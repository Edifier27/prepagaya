// Integración con Kommo (CRM) — pedido de Darío, 15-sep-2026: un botón en el
// mail del lead que lo carga como lead+contacto en Kommo con un clic.
//
// Server-only a propósito: usa `crypto` de Node, que no puede entrar al
// bundle del cliente. Nunca importar este archivo desde un componente
// 'use client' — solo desde route handlers (app/api/**/route.ts).
//
// Diseño: el link del botón va en el mail, así que solo puede ser un GET.
// En vez de guardar el lead en una base de datos para después buscarlo por
// id, se manda el dato del lead directo en la URL, firmado con HMAC-SHA256
// (KOMMO_LINK_SECRET) para que nadie pueda armar un link a mano y cargar
// leads falsos en el CRM. El link también vence (90 días) por las dudas de
// que quede dando vueltas en una bandeja de entrada vieja.
import crypto from 'crypto'
import { normalizarCelularAR } from './utils'

const KOMMO_LINK_SECRET = process.env.KOMMO_LINK_SECRET ?? ''
const KOMMO_SUBDOMINIO  = process.env.KOMMO_SUBDOMINIO  ?? ''
const KOMMO_TOKEN       = process.env.KOMMO_TOKEN       ?? ''

const VENCIMIENTO_MS = 1000 * 60 * 60 * 24 * 90 // 90 días

export interface KommoLeadData {
  nombre: string
  celular: string
  email: string
  interes: string
  provincia: string
  edades: string
  fuente: string
  fecha: string
  ts: string // epoch ms al firmar, para el chequeo de vencimiento
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

export interface ResultadoKommo {
  ok: boolean
  leadId?: number
  error?: string
}

/** Crea el lead + contacto en Kommo, y una nota con el detalle completo. */
export async function crearLeadEnKommo(d: KommoLeadData): Promise<ResultadoKommo> {
  if (!KOMMO_SUBDOMINIO || !KOMMO_TOKEN) {
    return { ok: false, error: 'Falta configurar KOMMO_SUBDOMINIO / KOMMO_TOKEN en el servidor.' }
  }

  const telefono = d.celular ? `+${normalizarCelularAR(d.celular)}` : ''
  const customFieldsContacto: Record<string, unknown>[] = []
  if (telefono) customFieldsContacto.push({ field_code: 'PHONE', values: [{ value: telefono, enum_code: 'MOB' }] })
  if (d.email) customFieldsContacto.push({ field_code: 'EMAIL', values: [{ value: d.email, enum_code: 'WORK' }] })

  const nombreLead = `${d.nombre || 'Lead web'} — ${d.provincia || 'PrepagaYa'}`.trim()
  const lead = {
    name: nombreLead,
    price: 0,
    _embedded: {
      contacts: [{ first_name: d.nombre, custom_fields_values: customFieldsContacto }],
    },
  }

  let res: Response
  try {
    res = await fetch(`https://${KOMMO_SUBDOMINIO}.kommo.com/api/v4/leads/complex`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KOMMO_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([lead]),
    })
  } catch (err) {
    return { ok: false, error: `Error de red al conectar con Kommo: ${err}` }
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    return { ok: false, error: `Kommo respondió ${res.status}: ${text}` }
  }

  const body = await res.json().catch(() => null)
  const leadId = body?.[0]?.id as number | undefined
  if (!leadId) return { ok: false, error: 'Kommo no devolvió el id del lead creado.' }

  // Nota con el mismo detalle que ya llega por mail — no bloquea el resultado si falla.
  const notaTexto = [
    d.interes ? `Interesado en: ${d.interes}` : null,
    d.provincia ? `Zona: ${d.provincia}` : null,
    d.edades ? `Edades: ${d.edades}` : null,
    d.fuente ? `Fuente: ${d.fuente}` : null,
    d.fecha ? `Fecha del lead: ${d.fecha}` : null,
  ].filter(Boolean).join('\n')

  if (notaTexto) {
    try {
      await fetch(`https://${KOMMO_SUBDOMINIO}.kommo.com/api/v4/leads/${leadId}/notes`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${KOMMO_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify([{ note_type: 'common', params: { text: notaTexto } }]),
      })
    } catch (err) {
      console.error('[KOMMO] no se pudo crear la nota (el lead sí se creó):', err)
    }
  }

  return { ok: true, leadId }
}

export function kommoLeadUrl(leadId: number): string {
  return `https://${KOMMO_SUBDOMINIO}.kommo.com/leads/detail/${leadId}`
}
