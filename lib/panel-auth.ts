// Acceso al panel interno /panel-leads (pedido de Darío, 20-sep-2026): un
// único password compartido (no hay usuarios individuales, es para
// Darío/Gabriela) que arma una cookie de sesión firmada con HMAC. La clave
// de firma se deriva del propio PANEL_PASSWORD (en vez de pedir un segundo
// secreto aparte): si el password cambia, las sesiones viejas quedan
// invalidadas solas, sin lógica extra.
//
// Server-only a propósito: usa `crypto` de Node.
import crypto from 'crypto'

const PANEL_PASSWORD = process.env.PANEL_PASSWORD ?? ''
const DURACION_MS = 1000 * 60 * 60 * 24 * 30 // 30 días

export const COOKIE_SESION = 'panel_session'

function claveFirma(): string {
  return crypto.createHash('sha256').update(`panel-leads::${PANEL_PASSWORD}`).digest('hex')
}

function firmar(exp: number): string {
  return crypto.createHmac('sha256', claveFirma()).update(String(exp)).digest('hex')
}

export function passwordConfigurada(): boolean {
  return Boolean(PANEL_PASSWORD)
}

export function verificarPassword(intento: string): boolean {
  if (!PANEL_PASSWORD || !intento) return false
  const a = Buffer.from(intento)
  const b = Buffer.from(PANEL_PASSWORD)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

export function crearValorCookie(): { valor: string; maxAgeSegundos: number } {
  const exp = Date.now() + DURACION_MS
  return { valor: `${exp}.${firmar(exp)}`, maxAgeSegundos: DURACION_MS / 1000 }
}

export function sesionValida(valorCookie: string | undefined): boolean {
  if (!valorCookie || !PANEL_PASSWORD) return false
  const [expStr, sig] = valorCookie.split('.')
  const exp = Number(expStr)
  if (!exp || Date.now() > exp || !sig) return false
  const esperada = Buffer.from(firmar(exp))
  const recibida = Buffer.from(sig)
  return esperada.length === recibida.length && crypto.timingSafeEqual(esperada, recibida)
}

/** Mismo chequeo que sesionValida, para usar en route handlers a partir de un NextRequest. */
export function sesionValidaEnRequest(req: { cookies: { get(name: string): { value: string } | undefined } }): boolean {
  return sesionValida(req.cookies.get(COOKIE_SESION)?.value)
}
