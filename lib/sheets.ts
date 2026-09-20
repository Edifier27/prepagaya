// Respaldo de leads en Google Sheets (pedido de Darío, 20-sep-2026): cada
// lead que entra por la web queda como fila nueva en una planilla propia,
// más allá de lo que haya pasado con Kommo o el mail — así hay un registro
// completo, fuera del sitio, que se puede abrir desde el celu en cualquier
// momento.
//
// Server-only a propósito: usa `crypto` de Node. No importar desde un
// componente 'use client'.
//
// Sin dependencias nuevas: en vez de la librería oficial `googleapis` (pesada
// para lo que hace falta acá), se arma a mano el JWT firmado con la cuenta de
// servicio y se pide un access token OAuth2 por REST — mismo patrón de "firma
// con crypto + fetch directo" que ya usa lib/kommo.ts.
import crypto from 'crypto'

const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL ?? ''
// La private key de la cuenta de servicio viene con saltos de línea reales en
// el JSON que descarga Google; como env var de Vercel hay que pegarla con
// "\n" literales — acá se deshace ese escape.
const PRIVATE_KEY = (process.env.GOOGLE_SHEETS_PRIVATE_KEY ?? '').replace(/\\n/g, '\n')
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID ?? ''
// Nombre de la pestaña + rango donde se van agregando las filas. Configurable
// por si la pestaña se llama distinto; "Leads!A:K" por default.
const RANGE = process.env.GOOGLE_SHEETS_RANGE ?? 'Leads!A:K'

const TIMEOUT_MS = 5000 // nunca dejar que Sheets frene el envío del lead

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function obtenerAccessToken(): Promise<string | null> {
  if (!CLIENT_EMAIL || !PRIVATE_KEY) return null

  const iat = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const claim = {
    iss: CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat,
    exp: iat + 3600,
  }
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`

  let firma: string
  try {
    const signer = crypto.createSign('RSA-SHA256')
    signer.update(unsigned)
    signer.end()
    firma = base64url(signer.sign(PRIVATE_KEY))
  } catch (err) {
    console.error('[SHEETS] private key inválida, no se pudo firmar el JWT:', err)
    return null
  }

  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: `${unsigned}.${firma}`,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!res.ok) {
      console.error('[SHEETS] error pidiendo access token:', res.status, await res.text().catch(() => ''))
      return null
    }
    const body = await res.json()
    return body.access_token ?? null
  } catch (err) {
    console.error('[SHEETS] error de red pidiendo access token:', err)
    return null
  }
}

export interface LeadParaPlanilla {
  fecha: string
  nombre: string
  celular: string
  email: string
  prepaga: string
  provincia: string
  edades: string
  fuente: string
  kommo: string // "OK (Darío)" / "OK (Gabriela) — duplicado" / "Error: ..."
}

/** Agrega una fila nueva al final de la planilla. Nunca tira: si falla, solo loguea. */
export async function guardarLeadEnPlanilla(d: LeadParaPlanilla): Promise<void> {
  if (!SPREADSHEET_ID) return

  const token = await obtenerAccessToken()
  if (!token) return

  const fila = [d.fecha, d.nombre, d.celular, d.email, d.prepaga, d.provincia, d.edades, d.fuente, d.kommo]

  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(RANGE)}:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [fila] }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      }
    )
    if (!res.ok) {
      console.error('[SHEETS] error agregando fila:', res.status, await res.text().catch(() => ''))
    }
  } catch (err) {
    console.error('[SHEETS] error de red agregando fila:', err)
  }
}
