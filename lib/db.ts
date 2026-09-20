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
          leido BOOLEAN NOT NULL DEFAULT false
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
}

export interface NuevoLead {
  nombre: string
  celular: string
  email: string
  prepaga: string
  provincia: string
  edades: string
  fuente: string
  kommoEstado: string
  kommoLink: string
}

export function dbConfigurada(): boolean {
  return DB_CONFIGURADA
}

/** Guarda el lead como fila nueva. Nunca tira: si falla, solo loguea. */
export async function guardarLead(d: NuevoLead): Promise<void> {
  if (!sql) return
  try {
    await asegurarTablas()
    await sql`
      INSERT INTO leads (nombre, celular, email, prepaga, provincia, edades, fuente, kommo_estado, kommo_link)
      VALUES (${d.nombre}, ${d.celular}, ${d.email}, ${d.prepaga}, ${d.provincia}, ${d.edades}, ${d.fuente}, ${d.kommoEstado}, ${d.kommoLink})
    `
  } catch (err) {
    console.error('[DB] error guardando lead:', err)
  }
}

export async function listarLeads(limite = 300): Promise<LeadRow[]> {
  if (!sql) return []
  await asegurarTablas()
  const rows = await sql`SELECT * FROM leads ORDER BY creado_en DESC LIMIT ${limite}`
  return rows as unknown as LeadRow[]
}

/** Leads más nuevos que el id dado — usado por el panel para detectar "hay leads nuevos" al hacer polling. */
export async function leadsDesde(ultimoId: number): Promise<LeadRow[]> {
  if (!sql) return []
  await asegurarTablas()
  const rows = await sql`SELECT * FROM leads WHERE id > ${ultimoId} ORDER BY creado_en DESC`
  return rows as unknown as LeadRow[]
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
