// Cupo diario por mail (pedido de Darío, 14-oct-2026): de todos los leads que entran, los primeros N de cada día
// (3) van a un mail aparte y en el panel quedan con un rótulo propio ("Dario B2"). El resto sigue al destino de
// siempre (Kommo, CRM Asesor, etc.). Se prende, se apaga y se cambia desde /panel-leads.
import { getConfig, setConfig } from './db'

export type CupoMail = { activo: boolean; email: string; porDia: number; rotulo: string }

const CLAVE = 'cupo_mail'
const CLAVE_USO = 'cupo_mail_uso' // { fecha: 'AAAA-MM-DD', usados: n }
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

/** Cuántos van hoy. */
export async function usadosHoy(): Promise<number> {
  try {
    const u = JSON.parse((await getConfig(CLAVE_USO)) ?? '{}')
    return u.fecha === hoyAR() ? Number(u.usados) || 0 : 0
  } catch { return 0 }
}

/** Si el cupo está prendido y hoy todavía queda lugar, cuenta este lead y devuelve el cupo; si no, null.
 *  Llamar una vez por lead (el cron los procesa de a uno). */
export async function tomarCupoMail({ prueba = false } = {}): Promise<CupoMail | null> {
  const c = await getCupoMail()
  if (!c.activo || !mailDe(c) || c.porDia <= 0) return null
  if (prueba) return { ...c, email: mailDe(c) }
  const usados = await usadosHoy()
  if (usados >= c.porDia) return null
  await setConfig(CLAVE_USO, JSON.stringify({ fecha: hoyAR(), usados: usados + 1 }))
  return { ...c, email: mailDe(c) }
}

/** Si el mail no salió, se devuelve el lugar (el lead sigue al destino de siempre). */
export async function devolverCupoMail(): Promise<void> {
  const usados = await usadosHoy()
  if (usados > 0) await setConfig(CLAVE_USO, JSON.stringify({ fecha: hoyAR(), usados: usados - 1 }))
}

/** Para el panel: sin el mail, solo si hay uno configurado. */
export async function cupoParaPanel(): Promise<Omit<CupoMail, 'email'> & { conMail: boolean }> {
  const { email, ...resto } = await getCupoMail()
  return { ...resto, conMail: Boolean(email || process.env.CUPO_MAIL_EMAIL) }
}
