// Cupo diario por mail (pedido de Darío, 14-oct-2026): de todos los leads que entran, los primeros N de cada día
// (3) van a un mail aparte y en el panel quedan con un rótulo propio ("Dario B2"). El resto sigue al destino de
// siempre (Kommo, CRM Asesor, etc.). Se prende, se apaga y se cambia desde /panel-leads.
import { contarCupoMailDesde, getConfig, setConfig } from './db'

export type CupoMail = { activo: boolean; email: string; porDia: number; rotulo: string }

const CLAVE = 'cupo_mail'
const CLAVE_REINICIO = 'cupo_mail_reinicio'
// Lo que pidió Darío; vale hasta que se cambie desde el panel. El mail NO va en el código ni se muestra en el panel
// (pedido de Darío): sale de la variable de entorno CUPO_MAIL_EMAIL de Vercel, o del que se cargue desde el panel.
const POR_DEFECTO: CupoMail = { activo: true, email: '', porDia: 3, rotulo: 'Dario B2' }
const mailDe = (c: CupoMail) => c.email || process.env.CUPO_MAIL_EMAIL || ''

const hoyAR = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date())

export async function getCupoMail(): Promise<CupoMail> {
  const guardado = await getConfig(CLAVE)
  if (!guardado) return POR_DEFECTO
  try { return { ...POR_DEFECTO, ...JSON.parse(guardado) } } catch { return POR_DEFECTO }
}

export async function setCupoMail(c: CupoMail): Promise<void> {
  await setConfig(CLAVE, JSON.stringify(c))
}

/** Cuántos van hoy: se cuentan los leads reales que salieron por el cupo (los de prueba no cuentan). */
export async function usadosHoy(): Promise<number> {
  const inicioDia = new Date(`${hoyAR()}T00:00:00-03:00`).toISOString()
  // "Reiniciar hoy" desde el panel: lo que salió antes no cuenta (ej.: un lead que terminó atendiendo Darío)
  const reinicio = (await getConfig(CLAVE_REINICIO)) ?? ''
  return contarCupoMailDesde(reinicio > inicioDia ? reinicio : inicioDia)
}

/** El cupo de hoy vuelve a empezar desde ahora. */
export async function reiniciarCupoHoy(): Promise<void> {
  await setConfig(CLAVE_REINICIO, new Date().toISOString())
}

/** Si el cupo está prendido y hoy todavía queda lugar, cuenta este lead y devuelve el cupo; si no, null.
 *  Llamar una vez por lead (el cron los procesa de a uno). */
export async function tomarCupoMail({ prueba = false } = {}): Promise<CupoMail | null> {
  const c = await getCupoMail()
  if (!c.activo || !mailDe(c) || c.porDia <= 0) return null
  if (prueba) return { ...c, email: mailDe(c) }
  const usados = await usadosHoy()
  if (usados >= c.porDia) return null
  return { ...c, email: mailDe(c) }
}

/** Se cuenta por los leads que salieron por el cupo: si el mail no salió, no hay nada que devolver. */
export async function devolverCupoMail(): Promise<void> {}

/** Para el panel: sin el mail, solo si hay uno configurado. */
export async function cupoParaPanel(): Promise<Omit<CupoMail, 'email'> & { conMail: boolean }> {
  const { email, ...resto } = await getCupoMail()
  return { ...resto, conMail: Boolean(email || process.env.CUPO_MAIL_EMAIL) }
}
