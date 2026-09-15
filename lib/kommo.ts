// Integración con Kommo (CRM) — pedido de Darío, 15-sep-2026: un botón en el
// mail del lead que lo carga como lead+contacto en Kommo con un clic, ahora
// repartido automáticamente entre DOS cuentas de Kommo separadas (Darío y
// Gabriela — no son dos usuarios de una misma cuenta, son dos cuentas con
// subdominio y token propios), y con detección de contactos duplicados.
//
// Server-only a propósito: usa `crypto` de Node, que no puede entrar al
// bundle del cliente. Nunca importar este archivo desde un componente
// 'use client' — solo desde route handlers (app/api/**/route.ts).
//
// Diseño del link firmado: el botón vive en el mail, así que solo puede ser
// un GET. En vez de guardar el lead en una base de datos para después
// buscarlo por id, se manda el dato del lead directo en la URL, firmado con
// HMAC-SHA256 (KOMMO_LINK_SECRET) para que nadie pueda armar un link a mano
// y cargar leads falsos en el CRM. Vence a los 90 días por las dudas de que
// quede dando vueltas en una bandeja de entrada vieja.
//
// Reparto entre cuentas: el sitio no tiene base de datos, así que no hay
// forma de llevar la cuenta real de "a quién le tocaba el próximo" en orden
// estricto. En cambio se decide de forma determinística a partir del
// timestamp de cuando se generó el link (par → Darío, impar → Gabriela):
// da un reparto parejo (~50/50) sin necesitar estado compartido, y el mismo
// lead siempre resuelve a la misma cuenta sin importar cuántas veces se
// clickee el botón.
import crypto from 'crypto'
import { normalizarCelularAR } from './utils'

const KOMMO_LINK_SECRET = process.env.KOMMO_LINK_SECRET ?? ''

const VENCIMIENTO_MS = 1000 * 60 * 60 * 24 * 90 // 90 días
const TIMEOUT_BUSQUEDA_MS = 3000 // nunca dejar que una consulta a Kommo frene el envío del lead

export type KommoCuenta = 'dario' | 'gabriela'

interface CuentaConfig { subdominio: string; token: string; nombreDisplay: string }

function cuentaConfig(cuenta: KommoCuenta): CuentaConfig {
  return cuenta === 'gabriela'
    ? {
        subdominio: process.env.KOMMO_SUBDOMINIO_GABRIELA ?? '',
        token: process.env.KOMMO_TOKEN_GABRIELA ?? '',
        nombreDisplay: 'Gabriela',
      }
    : {
        subdominio: process.env.KOMMO_SUBDOMINIO ?? '',
        token: process.env.KOMMO_TOKEN ?? '',
        nombreDisplay: 'Darío',
      }
}

/** Cuenta a la que le toca este lead, en base al timestamp firmado (ver comentario arriba). */
export function elegirCuenta(ts: string): KommoCuenta {
  return (Number(ts) || 0) % 2 === 0 ? 'dario' : 'gabriela'
}

// ─── Link firmado del botón del mail ───────────────────────────────────────

export interface KommoLeadData {
  nombre: string
  celular: string
  email: string
  interes: string
  provincia: string
  edades: string
  fuente: string
  fecha: string
  ts: string // epoch ms al firmar, para el chequeo de vencimiento y el reparto
}

const CAMPOS: (keyof KommoLeadData)[] = ['nombre', 'celular', 'email', 'interes', 'provincia', 'edades', 'fuente', 'fecha', 'ts']

function canonico(d: KommoLeadData): string {
  return CAMPOS.map((k) => d[k] ?? '').join('')
}

function firmar(d: KommoLeadData): string {
  return crypto.createHmac('sha256', KOMMO_LINK_SECRET).update(canonico(d)).digest('hex')
}

/** Arma el link firmado para el botón del mail. `base` sin barra final (ej. SITE_URL). */
export function buildKommoLink(base: string, datos: Omit<KommoLeadData, 'ts'>): string {
  if (!KOMMO_LINK_SECRET) return '' // sin secreto configurado no se genera el link (mejor que uno inválido)
  const d: KommoLeadData = { ...datos, ts: String(Date.now()) }
  const sig = firmar(d)
  const params = new URLSearchParams({ ...d, sig })
  return `${base}/api/kommo?${params.toString()}`
}

export interface VerificacionKommo {
  ok: boolean
  motivo?: 'sin-secreto' | 'firma-invalida' | 'vencido'
}

export function verificarKommoLink(d: KommoLeadData, sig: string): VerificacionKommo {
  if (!KOMMO_LINK_SECRET) return { ok: false, motivo: 'sin-secreto' }
  const esperada = Buffer.from(firmar(d))
  const recibida = Buffer.from(sig || '')
  if (esperada.length !== recibida.length || !crypto.timingSafeEqual(esperada, recibida)) {
    return { ok: false, motivo: 'firma-invalida' }
  }
  const ts = Number(d.ts)
  if (!ts || Date.now() - ts > VENCIMIENTO_MS) return { ok: false, motivo: 'vencido' }
  return { ok: true }
}

// ─── Búsqueda de contacto existente (anti-duplicado) ───────────────────────

export interface ContactoExistente {
  cuenta: KommoCuenta
  contactId: number
  leadId?: number
  fechaTexto?: string // fecha de creación del contacto, ya formateada, para mostrar en el aviso
}

async function buscarEnCuenta(cuenta: KommoCuenta, query: string): Promise<ContactoExistente | null> {
  const cfg = cuentaConfig(cuenta)
  if (!cfg.subdominio || !cfg.token) return null
  try {
    const res = await fetch(
      `https://${cfg.subdominio}.kommo.com/api/v4/contacts?query=${encodeURIComponent(query)}&with=leads&limit=1`,
      { headers: { Authorization: `Bearer ${cfg.token}` }, signal: AbortSignal.timeout(TIMEOUT_BUSQUEDA_MS) },
    )
    // Kommo devuelve 204 sin body cuando la búsqueda no encuentra nada — no
    // es un error, es el "no hay coincidencia" esperado la mayoría de las
    // veces (no intentar parsear JSON de un body vacío).
    if (res.status === 204 || !res.ok) return null
    const body = await res.json()
    const contacto = body?._embedded?.contacts?.[0]
    if (!contacto) return null
    const leads = contacto._embedded?.leads ?? []
    const lead = leads[0] // Kommo devuelve los leads embebidos del contacto; tomamos el primero
    const fechaTexto = contacto.created_at
      ? new Date(contacto.created_at * 1000).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
      : undefined
    return { cuenta, contactId: contacto.id, leadId: lead?.id, fechaTexto }
  } catch (err) {
    console.error(`[KOMMO] error buscando contacto existente en cuenta ${cuenta}:`, err)
    return null
  }
}

/**
 * Busca si esta persona (por celular o mail) ya es un contacto en CUALQUIERA
 * de las dos cuentas — cubre tanto "cliente viejo" como "llenó el formulario
 * dos veces" (la segunda vez encuentra el contacto que dejó la primera).
 * Nunca tira: si Kommo está lento o caído, devuelve null y el flujo normal
 * sigue sin bloquearse (ver TIMEOUT_BUSQUEDA_MS).
 */
export async function buscarContactoExistente(d: Pick<KommoLeadData, 'celular' | 'email'>): Promise<ContactoExistente | null> {
  const telefono = d.celular ? `+${normalizarCelularAR(d.celular)}` : ''
  const query = telefono || d.email
  if (!query) return null

  const [porDario, porGabriela] = await Promise.allSettled([
    buscarEnCuenta('dario', query),
    buscarEnCuenta('gabriela', query),
  ])
  const resultados = [porDario, porGabriela]
    .filter((r): r is PromiseFulfilledResult<ContactoExistente | null> => r.status === 'fulfilled')
    .map((r) => r.value)
    .filter((r): r is ContactoExistente => r !== null)

  return resultados[0] ?? null
}

// ─── Creación del lead ──────────────────────────────────────────────────────

export interface ResultadoKommo {
  ok: boolean
  cuenta?: KommoCuenta
  leadId?: number
  duplicado?: boolean
  error?: string
}

function notaTexto(d: KommoLeadData, esDuplicado: boolean): string {
  const lineas = [
    esDuplicado ? 'Volvió a consultar desde la web.' : null,
    d.interes ? `Interesado en: ${d.interes}` : null,
    d.provincia ? `Zona: ${d.provincia}` : null,
    d.edades ? `Edades: ${d.edades}` : null,
    d.fuente ? `Fuente: ${d.fuente}` : null,
    d.fecha ? `Fecha del lead: ${d.fecha}` : null,
  ]
  return lineas.filter(Boolean).join('\n')
}

async function agregarNota(cuenta: KommoCuenta, leadId: number, texto: string): Promise<void> {
  if (!texto) return
  const cfg = cuentaConfig(cuenta)
  try {
    await fetch(`https://${cfg.subdominio}.kommo.com/api/v4/leads/${leadId}/notes`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([{ note_type: 'common', params: { text: texto } }]),
    })
  } catch (err) {
    console.error(`[KOMMO] no se pudo crear la nota en cuenta ${cuenta} (lead ${leadId}):`, err)
  }
}

/**
 * Crea el lead + contacto en Kommo. Si la persona ya es un contacto
 * existente (en cualquiera de las dos cuentas), NO crea un lead nuevo:
 * agrega una nota al lead que ya tenía y devuelve ese id (pedido explícito
 * de Darío, 15-sep-2026). Si el contacto existe pero no tiene ningún lead
 * asociado, crea un lead nuevo pero enganchado a ese contacto ya existente
 * (nunca duplica el contacto).
 */
export async function crearLeadEnKommo(d: KommoLeadData): Promise<ResultadoKommo> {
  const existente = await buscarContactoExistente(d)

  if (existente?.leadId) {
    await agregarNota(existente.cuenta, existente.leadId, notaTexto(d, true))
    return { ok: true, cuenta: existente.cuenta, leadId: existente.leadId, duplicado: true }
  }

  // Cuenta destino: la del contacto existente (si hay uno sin lead propio)
  // o la que le toca por reparto automático si es una persona nueva.
  const cuenta = existente?.cuenta ?? elegirCuenta(d.ts)
  const cfg = cuentaConfig(cuenta)
  if (!cfg.subdominio || !cfg.token) {
    return { ok: false, error: `Falta configurar Kommo para la cuenta de ${cfg.nombreDisplay} en el servidor.` }
  }

  const telefono = d.celular ? `+${normalizarCelularAR(d.celular)}` : ''
  const customFieldsContacto: Record<string, unknown>[] = []
  if (telefono) customFieldsContacto.push({ field_code: 'PHONE', values: [{ value: telefono, enum_code: 'MOB' }] })
  if (d.email) customFieldsContacto.push({ field_code: 'EMAIL', values: [{ value: d.email, enum_code: 'WORK' }] })

  const contacto = existente
    ? { id: existente.contactId } // engancha al contacto ya existente, no crea uno nuevo
    : { first_name: d.nombre, custom_fields_values: customFieldsContacto }

  const nombreLead = `${d.nombre || 'Lead web'} — ${d.provincia || 'PrepagaYa'}`.trim()
  const lead = { name: nombreLead, price: 0, _embedded: { contacts: [contacto] } }

  let res: Response
  try {
    res = await fetch(`https://${cfg.subdominio}.kommo.com/api/v4/leads/complex`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([lead]),
    })
  } catch (err) {
    return { ok: false, error: `Error de red al conectar con Kommo (${cfg.nombreDisplay}): ${err}` }
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    return { ok: false, error: `Kommo (${cfg.nombreDisplay}) respondió ${res.status}: ${text}` }
  }

  const body = await res.json().catch(() => null)
  const leadId = body?.[0]?.id as number | undefined
  if (!leadId) return { ok: false, error: `Kommo (${cfg.nombreDisplay}) no devolvió el id del lead creado.` }

  await agregarNota(cuenta, leadId, notaTexto(d, false))
  return { ok: true, cuenta, leadId }
}

export function kommoLeadUrl(cuenta: KommoCuenta, leadId: number): string {
  const cfg = cuentaConfig(cuenta)
  return `https://${cfg.subdominio}.kommo.com/leads/detail/${leadId}`
}

export function nombreCuenta(cuenta: KommoCuenta): string {
  return cuentaConfig(cuenta).nombreDisplay
}
