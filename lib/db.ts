// Base de datos propia del sitio (Postgres, vía la integración Neon de
// Vercel — pedido de Darío, 20-sep-2026): respaldo de cada lead y fuente de
// datos del panel interno (/panel-leads), sin depender de Google Sheets ni
// de abrir el mail para enterarse de nada.
//
// Server-only a propósito: no importar desde un componente 'use client'.
//
// Sin configurar (falta DATABASE_URL) esto no rompe nada — mismo patrón que
// el resto de las integraciones opcionales del sitio (Kommo, Telegram,
// Sheets): las funciones devuelven vacío/no hacen nada en vez de tirar.
import type { FilaSondeo } from '@/lib/data/sondeo'
import { neon } from '@neondatabase/serverless'

const CONNECTION_STRING = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? ''
const DB_CONFIGURADA = Boolean(CONNECTION_STRING)

const sql = DB_CONFIGURADA ? neon(CONNECTION_STRING) : null

let tablasListas: Promise<unknown> | null = null

function asegurarTablas(): Promise<unknown> {
  if (!sql) return Promise.resolve()
  if (!tablasListas) {
    tablasListas = Promise.all([
      sql`
        CREATE TABLE IF NOT EXISTS leads (
          id SERIAL PRIMARY KEY,
          creado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
          nombre TEXT NOT NULL,
          celular TEXT,
          email TEXT,
          prepaga TEXT,
          provincia TEXT,
          edades TEXT,
          fuente TEXT,
          kommo_estado TEXT,
          kommo_link TEXT,
          leido BOOLEAN NOT NULL DEFAULT false,
          veces INTEGER NOT NULL DEFAULT 1,
          actualizado_en TIMESTAMPTZ,
          pais TEXT
        )
      `,
      // ADD COLUMN IF NOT EXISTS para las tablas que ya existían en producción
      // antes de sumar el apilado de leads repetidos (21-sep-2026) y los
      // leads internacionales (22-sep-2026).
      sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS veces INTEGER NOT NULL DEFAULT 1`,
      sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS actualizado_en TIMESTAMPTZ`,
      sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS pais TEXT`,
      // Borrado desde el panel (23-sep-2026): soft delete — la fila queda en la
      // base con fecha de borrado, así un error se puede recuperar a mano.
      sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS eliminado_en TIMESTAMPTZ`,
      // Mini CRM del panel (23-sep-2026): estado comercial, notas y fecha de
      // seguimiento con aviso push (lo manda el cron de Kommo, cada minuto).
      sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS estado TEXT NOT NULL DEFAULT 'nuevo'`,
      sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS notas TEXT`,
      sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS seguimiento_en TIMESTAMPTZ`,
      sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS seguimiento_avisado BOOLEAN NOT NULL DEFAULT false`,
      // Zona detectada por IP al momento del lead, ej. "Banfield (GBA Sur)" —
      // aproximada (23-sep-2026), para filtrar el panel por localidad/subzona.
      sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS zona_detectada TEXT`,
      // Respuestas que la persona ya da en el cotizador y el quiz (24-sep-2026):
      // situación laboral, presupuesto del quiz, prepaga actual (pregunta
      // opcional después de enviar el lead) y preferencias (JSON: copago,
      // coberturas, etc.). No se agrega ninguna pregunta antes del formulario.
      // Alimentan el panel y el sondeo anónimo de /prensa/sondeo.
      sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS situacion_laboral TEXT`,
      sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS presupuesto TEXT`,
      sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS prepaga_actual TEXT`,
      sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS preferencias TEXT`,
      // Reseñas de usuarios sobre las prepagas (23-sep-2026): se cargan desde la
      // ficha de cada prepaga y se publican recién cuando Darío las aprueba en
      // el panel. Alimentan el rich snippet de estrellas (reseñas propias del
      // sitio, como exige Google).
      sql`
        CREATE TABLE IF NOT EXISTS resenas (
          id SERIAL PRIMARY KEY,
          creado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
          prepaga_slug TEXT NOT NULL,
          plan_nombre TEXT,
          nombre TEXT NOT NULL,
          ciudad TEXT,
          rating INTEGER NOT NULL,
          texto TEXT NOT NULL,
          estado TEXT NOT NULL DEFAULT 'pendiente',
          moderado_en TIMESTAMPTZ,
          ip_hash TEXT
        )
      `,
      sql`
        CREATE TABLE IF NOT EXISTS push_subscriptions (
          id SERIAL PRIMARY KEY,
          endpoint TEXT UNIQUE NOT NULL,
          p256dh TEXT NOT NULL,
          auth TEXT NOT NULL,
          creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `,
    ])
  }
  return tablasListas
}

export interface LeadRow {
  id: number
  creado_en: string
  nombre: string
  celular: string | null
  email: string | null
  prepaga: string | null
  provincia: string | null
  edades: string | null
  fuente: string | null
  kommo_estado: string | null
  kommo_link: string | null
  leido: boolean
  veces: number
  actualizado_en: string | null
  pais: string | null
  estado: EstadoLead
  notas: string | null
  seguimiento_en: string | null
  seguimiento_avisado: boolean
  zona_detectada: string | null
  situacion_laboral: string | null
  presupuesto: string | null
  prepaga_actual: string | null
  /** JSON con las preferencias que marcó (copago, coberturas, respuestas del quiz) */
  preferencias: string | null
}

export const ESTADOS_LEAD = ['nuevo', 'contactado', 'cotizado', 'vendido', 'perdido'] as const
export type EstadoLead = (typeof ESTADOS_LEAD)[number]

export interface NuevoLead {
  nombre: string
  celular: string
  email: string
  prepaga: string
  provincia: string
  edades: string
  fuente: string
  /** 'us'/'ru'/'zh' para leads de los silos internacionales — ver lib/kommo.ts. */
  pais?: string
  /** Label de detectarZona() por IP, ej. "Banfield (GBA Sur)" — aproximado. */
  zonaDetectada?: string
  situacionLaboral?: string
  presupuesto?: string
  prepagaActual?: string
  preferencias?: string
}

/** Sentinela de kommo_estado para leads que todavía no se mandaron a Kommo — ver KOMMO_DELAY_MIN en app/api/leads/route.ts. */
export const KOMMO_PENDIENTE = 'Pendiente'

export function dbConfigurada(): boolean {
  return DB_CONFIGURADA
}

/**
 * Guarda el lead. Si la misma persona (mismo celular, o mismo mail cuando no
 * dejó celular) ya generó un lead en las últimas 24hs, apila todo en esa
 * fila en vez de crear una nueva — pasa seguido cuando alguien prueba
 * "elegir plan" en más de una prepaga desde el comparador y cada click
 * dispara su propio POST a /api/leads (pedido de Darío, 21-sep-2026: antes
 * cada click generaba una fila distinta en el panel). Nunca tira: si falla,
 * solo loguea.
 *
 * El envío a Kommo NO pasa por acá: todo lead nuevo entra con
 * kommo_estado = 'Pendiente' y lo procesa el cron de
 * /api/cron/procesar-leads-kommo recién 3 minutos después de la última
 * actividad de esa persona (pedido de Darío, 22-sep-2026, con Vercel Pro ya
 * activo) — así si alguien toca "elegir plan" en varias prepagas seguidas,
 * Kommo recibe un solo contacto con todos los intereses juntos, en vez de
 * uno por cada click. El "apilado" de acá abajo, al actualizar
 * actualizado_en en cada touch, extiende esa ventana de 3 minutos
 * automáticamente — no hace falta tocar kommo_estado en el UPDATE.
 */
export async function guardarLead(d: NuevoLead): Promise<void> {
  if (!sql) return
  try {
    await asegurarTablas()

    // interval hardcodeado (no interpolado) a propósito: el tag `sql` de Neon
    // parametriza cada ${...} como bind variable, así que un valor dentro de
    // comillas SQL (interval '$1') no es válido — solo puede ir literal.
    const existente = d.celular
      ? await sql`
          SELECT id, prepaga FROM leads
          WHERE celular <> '' AND celular = ${d.celular} AND eliminado_en IS NULL
            AND creado_en > now() - interval '24 hours'
          ORDER BY creado_en DESC LIMIT 1
        `
      : d.email
        ? await sql`
            SELECT id, prepaga FROM leads
            WHERE email <> '' AND email = ${d.email} AND eliminado_en IS NULL
              AND creado_en > now() - interval '24 hours'
            ORDER BY creado_en DESC LIMIT 1
          `
        : []

    if (existente.length > 0) {
      const fila = existente[0] as { id: number; prepaga: string | null }
      const intereses = (fila.prepaga ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      if (d.prepaga && !intereses.includes(d.prepaga)) intereses.push(d.prepaga)

      await sql`
        UPDATE leads SET
          nombre = ${d.nombre},
          prepaga = ${intereses.join(', ')},
          provincia = COALESCE(NULLIF(${d.provincia}, ''), provincia),
          edades = COALESCE(NULLIF(${d.edades}, ''), edades),
          zona_detectada = COALESCE(zona_detectada, ${d.zonaDetectada ?? null}),
          situacion_laboral = COALESCE(NULLIF(${d.situacionLaboral ?? ''}, ''), situacion_laboral),
          presupuesto = COALESCE(NULLIF(${d.presupuesto ?? ''}, ''), presupuesto),
          prepaga_actual = COALESCE(NULLIF(${d.prepagaActual ?? ''}, ''), prepaga_actual),
          preferencias = COALESCE(NULLIF(${d.preferencias ?? ''}, ''), preferencias),
          fuente = ${d.fuente},
          veces = veces + 1,
          actualizado_en = now(),
          leido = false
        WHERE id = ${fila.id}
      `
      return
    }

    await sql`
      INSERT INTO leads (nombre, celular, email, prepaga, provincia, edades, fuente, kommo_estado, kommo_link, pais, zona_detectada, situacion_laboral, presupuesto, prepaga_actual, preferencias)
      VALUES (${d.nombre}, ${d.celular}, ${d.email}, ${d.prepaga}, ${d.provincia}, ${d.edades}, ${d.fuente}, ${KOMMO_PENDIENTE}, '', ${d.pais ?? null}, ${d.zonaDetectada ?? null}, ${d.situacionLaboral || null}, ${d.presupuesto || null}, ${d.prepagaActual || null}, ${d.preferencias || null})
    `
  } catch (err) {
    console.error('[DB] error guardando lead:', err)
  }
}

/**
 * Datos que la persona completa DESPUÉS de enviar el lead (situación laboral
 * en los filtros de resultados, "¿qué prepaga tenés hoy?", coberturas que
 * filtra). Actualiza su lead más reciente de las últimas 24 hs: pide email Y
 * celular juntos, así nadie puede tocar el lead de otro con solo un dato.
 */
export async function complementarLead(c: { email: string; celular: string; situacionLaboral?: string; prepagaActual?: string; preferencias?: string }): Promise<boolean> {
  if (!sql || !c.email || !c.celular) return false
  try {
    await asegurarTablas()
    const rows = await sql`
      UPDATE leads SET
        situacion_laboral = COALESCE(NULLIF(${c.situacionLaboral ?? ''}, ''), situacion_laboral),
        prepaga_actual = COALESCE(NULLIF(${c.prepagaActual ?? ''}, ''), prepaga_actual),
        preferencias = COALESCE(NULLIF(${c.preferencias ?? ''}, ''), preferencias)
      WHERE id = (
        SELECT id FROM leads
        WHERE email = ${c.email} AND celular = ${c.celular} AND eliminado_en IS NULL
          AND creado_en > now() - interval '24 hours'
        ORDER BY creado_en DESC LIMIT 1
      )
      RETURNING id
    `
    return rows.length > 0
  } catch (err) {
    console.error('[DB] error complementando lead:', err)
    return false
  }
}

/**
 * Filas para el sondeo anónimo de /prensa/sondeo: SOLO columnas sin datos
 * personales (nada de nombre, celular ni email). Excluye borrados y leads de
 * los silos internacionales. El agregado se hace en lib/data/sondeo.ts.
 */
export async function filasSondeo(desde: string): Promise<FilaSondeo[]> {
  if (!sql) return []
  try {
    await asegurarTablas()
    const rows = await sql`
      SELECT creado_en, provincia, edades, prepaga, situacion_laboral, presupuesto, prepaga_actual, preferencias
      FROM leads
      WHERE eliminado_en IS NULL AND (pais IS NULL OR pais = '') AND creado_en >= ${desde}::timestamptz
    `
    return (rows as Record<string, unknown>[]).map((r) => ({ ...(r as unknown as FilaSondeo), creado_en: new Date(r.creado_en as string | Date).toISOString() }))
  } catch (err) {
    console.error('[DB] error leyendo filas del sondeo:', err)
    return []
  }
}

/**
 * Leads con kommo_estado = 'Pendiente' cuya última actividad tiene 3+
 * minutos — lo que procesa el cron cada 1 minuto. `minutos` es parametrizable
 * solo para poder testear con una ventana más corta sin tocar el código.
 */
export async function leadsPendientesDeKommo(minutosEspera = 3): Promise<LeadRow[]> {
  if (!sql) return []
  await asegurarTablas()
  const rows = await sql`
    SELECT * FROM leads
    WHERE kommo_estado = ${KOMMO_PENDIENTE}
      AND eliminado_en IS NULL
      AND COALESCE(actualizado_en, creado_en) <= now() - (${minutosEspera}::text || ' minutes')::interval
    ORDER BY creado_en ASC
    LIMIT 50
  `
  return rows as unknown as LeadRow[]
}

export async function marcarResultadoKommo(id: number, estado: string, link: string): Promise<void> {
  if (!sql) return
  await asegurarTablas()
  await sql`UPDATE leads SET kommo_estado = ${estado}, kommo_link = ${link} WHERE id = ${id}`
}

export async function listarLeads(limite = 300): Promise<LeadRow[]> {
  if (!sql) return []
  await asegurarTablas()
  const rows = await sql`SELECT * FROM leads WHERE eliminado_en IS NULL ORDER BY creado_en DESC LIMIT ${limite}`
  return rows as unknown as LeadRow[]
}

/** Leads más nuevos que el id dado — usado por el panel para detectar "hay leads nuevos" al hacer polling. */
export async function leadsDesde(ultimoId: number): Promise<LeadRow[]> {
  if (!sql) return []
  await asegurarTablas()
  const rows = await sql`SELECT * FROM leads WHERE id > ${ultimoId} AND eliminado_en IS NULL ORDER BY creado_en DESC`
  return rows as unknown as LeadRow[]
}

/**
 * Cambios desde el panel: estado, notas y/o fecha de seguimiento. Cada campo
 * es opcional; `seguimiento_en: null` borra el recordatorio. Cambiar la fecha
 * vuelve a armar el aviso (seguimiento_avisado = false).
 */
export async function actualizarLead(
  id: number,
  cambios: { estado?: EstadoLead; notas?: string; seguimiento_en?: string | null }
): Promise<void> {
  if (!sql) return
  await asegurarTablas()
  if (cambios.estado !== undefined) {
    await sql`UPDATE leads SET estado = ${cambios.estado} WHERE id = ${id}`
  }
  if (cambios.notas !== undefined) {
    await sql`UPDATE leads SET notas = ${cambios.notas} WHERE id = ${id}`
  }
  if (cambios.seguimiento_en !== undefined) {
    await sql`UPDATE leads SET seguimiento_en = ${cambios.seguimiento_en}, seguimiento_avisado = false WHERE id = ${id}`
  }
}

/** Seguimientos cuya fecha ya llegó y todavía no se avisaron — los procesa el cron cada minuto. */
export async function seguimientosVencidos(): Promise<LeadRow[]> {
  if (!sql) return []
  await asegurarTablas()
  const rows = await sql`
    SELECT * FROM leads
    WHERE seguimiento_en IS NOT NULL
      AND seguimiento_en <= now()
      AND seguimiento_avisado = false
      AND eliminado_en IS NULL
    LIMIT 50
  `
  return rows as unknown as LeadRow[]
}

export async function marcarSeguimientoAvisado(id: number): Promise<void> {
  if (!sql) return
  await asegurarTablas()
  await sql`UPDATE leads SET seguimiento_avisado = true WHERE id = ${id}`
}

/** Borrado desde el panel: soft delete (ver eliminado_en en asegurarTablas). */
export async function eliminarLead(id: number): Promise<void> {
  if (!sql) return
  await asegurarTablas()
  await sql`UPDATE leads SET eliminado_en = now() WHERE id = ${id}`
}

export async function marcarLeido(id: number, leido: boolean): Promise<void> {
  if (!sql) return
  await asegurarTablas()
  await sql`UPDATE leads SET leido = ${leido} WHERE id = ${id}`
}

// ─── Suscripciones push ─────────────────────────────────────────────────────

export interface SubscripcionPush {
  endpoint: string
  keys: { p256dh: string; auth: string }
}

export async function guardarSubscripcionPush(s: SubscripcionPush): Promise<void> {
  if (!sql) return
  await asegurarTablas()
  await sql`
    INSERT INTO push_subscriptions (endpoint, p256dh, auth)
    VALUES (${s.endpoint}, ${s.keys.p256dh}, ${s.keys.auth})
    ON CONFLICT (endpoint) DO NOTHING
  `
}

export async function borrarSubscripcionPush(endpoint: string): Promise<void> {
  if (!sql) return
  await asegurarTablas()
  await sql`DELETE FROM push_subscriptions WHERE endpoint = ${endpoint}`
}

export async function listarSubscripcionesPush(): Promise<SubscripcionPush[]> {
  if (!sql) return []
  await asegurarTablas()
  const rows = await sql`SELECT endpoint, p256dh, auth FROM push_subscriptions`
  return (rows as { endpoint: string; p256dh: string; auth: string }[]).map((r) => ({
    endpoint: r.endpoint,
    keys: { p256dh: r.p256dh, auth: r.auth },
  }))
}


// ─── Reseñas ────────────────────────────────────────────────────────────────

export type EstadoResena = 'pendiente' | 'aprobada' | 'rechazada'

export interface ResenaRow {
  id: number
  creado_en: string
  prepaga_slug: string
  plan_nombre: string | null
  nombre: string
  ciudad: string | null
  rating: number
  texto: string
  estado: EstadoResena
  moderado_en: string | null
}

// El driver de Neon devuelve TIMESTAMPTZ como Date: se normaliza a ISO string
// para que la ficha (server) y el panel (JSON) usen siempre el mismo tipo.
function normalizarResena(r: Record<string, unknown>): ResenaRow {
  const iso = (v: unknown) => (v == null ? null : new Date(v as string | Date).toISOString())
  return { ...(r as unknown as ResenaRow), creado_en: iso(r.creado_en)!, moderado_en: iso(r.moderado_en) }
}

export async function guardarResena(r: { prepagaSlug: string; planNombre: string; nombre: string; ciudad: string; rating: number; texto: string; ipHash: string }): Promise<void> {
  if (!sql) return
  await asegurarTablas()
  await sql`
    INSERT INTO resenas (prepaga_slug, plan_nombre, nombre, ciudad, rating, texto, ip_hash)
    VALUES (${r.prepagaSlug}, ${r.planNombre || null}, ${r.nombre}, ${r.ciudad || null}, ${r.rating}, ${r.texto}, ${r.ipHash})
  `
}

/** Reseñas enviadas desde esa IP en las últimas 24 hs (freno anti-spam). */
export async function resenasRecientesDeIp(ipHash: string): Promise<number> {
  if (!sql) return 0
  await asegurarTablas()
  const rows = await sql`SELECT count(*)::int AS n FROM resenas WHERE ip_hash = ${ipHash} AND creado_en > now() - interval '24 hours'`
  return (rows[0] as { n: number }).n
}

export async function listarResenas(estado?: EstadoResena): Promise<ResenaRow[]> {
  if (!sql) return []
  await asegurarTablas()
  const rows = estado
    ? await sql`SELECT id, creado_en, prepaga_slug, plan_nombre, nombre, ciudad, rating, texto, estado, moderado_en FROM resenas WHERE estado = ${estado} ORDER BY creado_en DESC LIMIT 300`
    : await sql`SELECT id, creado_en, prepaga_slug, plan_nombre, nombre, ciudad, rating, texto, estado, moderado_en FROM resenas ORDER BY creado_en DESC LIMIT 300`
  return (rows as Record<string, unknown>[]).map(normalizarResena)
}

/** Aprobadas de una prepaga + resumen (promedio y cantidad) para la ficha y el rich snippet. */
export async function resenasAprobadas(prepagaSlug: string): Promise<{ resenas: ResenaRow[]; promedio: number; cantidad: number }> {
  if (!sql) return { resenas: [], promedio: 0, cantidad: 0 }
  try {
    await asegurarTablas()
    const [rows, resumen] = await Promise.all([
      sql`SELECT id, creado_en, prepaga_slug, plan_nombre, nombre, ciudad, rating, texto, estado, moderado_en FROM resenas WHERE prepaga_slug = ${prepagaSlug} AND estado = 'aprobada' ORDER BY creado_en DESC LIMIT 20`,
      sql`SELECT count(*)::int AS cantidad, coalesce(avg(rating), 0)::float AS promedio FROM resenas WHERE prepaga_slug = ${prepagaSlug} AND estado = 'aprobada'`,
    ])
    const r = resumen[0] as { cantidad: number; promedio: number }
    return { resenas: (rows as Record<string, unknown>[]).map(normalizarResena), promedio: Math.round(r.promedio * 10) / 10, cantidad: r.cantidad }
  } catch (err) {
    console.error('[DB] error leyendo reseñas:', err)
    return { resenas: [], promedio: 0, cantidad: 0 }
  }
}

export async function moderarResena(id: number, estado: EstadoResena): Promise<string | null> {
  if (!sql) return null
  await asegurarTablas()
  const rows = await sql`UPDATE resenas SET estado = ${estado}, moderado_en = now() WHERE id = ${id} RETURNING prepaga_slug`
  return (rows[0] as { prepaga_slug: string } | undefined)?.prepaga_slug ?? null
}
