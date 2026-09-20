// Notificaciones push de escritorio (pedido de Darío, 20-sep-2026): a
// diferencia de una notificación armada a mano en el navegador, esta llega
// aunque el panel esté cerrado — mientras el sistema operativo tenga el
// service worker registrado (Chrome/Edge lo mantienen corriendo en segundo
// plano). Usa el protocolo estándar Web Push (VAPID + cifrado de
// notificación), vía la librería `web-push` — cifrar el payload a mano
// (ECDH + HKDF + AES-GCM, RFC 8291) es un lugar donde vale la pena usar la
// librería de referencia del ecosistema en vez de reinventarlo.
//
// Server-only a propósito.
import webpush from 'web-push'
import { guardarSubscripcionPush, borrarSubscripcionPush, listarSubscripcionesPush, type SubscripcionPush } from './db'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY ?? ''
const PUSH_CONFIGURADO = Boolean(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY)

if (PUSH_CONFIGURADO) {
  webpush.setVapidDetails('mailto:cotizaciones@prepagaya.com.ar', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
}

export function pushConfigurado(): boolean {
  return PUSH_CONFIGURADO
}

export async function suscribirPush(sub: SubscripcionPush): Promise<void> {
  await guardarSubscripcionPush(sub)
}

export async function desuscribirPush(endpoint: string): Promise<void> {
  await borrarSubscripcionPush(endpoint)
}

/**
 * Manda la notificación a todos los dispositivos suscriptos (Darío,
 * Gabriela, o quien haya activado las alertas en su compu). Nunca tira: una
 * suscripción vencida (404/410 — el navegador la invalidó, ej. porque se
 * desinstaló la app) se borra sola; cualquier otro error solo se loguea.
 */
export async function avisarLeadPorPush(titulo: string, cuerpo: string): Promise<void> {
  if (!PUSH_CONFIGURADO) return
  const subs = await listarSubscripcionesPush()
  if (subs.length === 0) return

  const payload = JSON.stringify({ title: titulo, body: cuerpo, url: '/panel-leads' })

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(sub, payload)
      } catch (err) {
        const statusCode = (err as { statusCode?: number })?.statusCode
        if (statusCode === 404 || statusCode === 410) {
          await borrarSubscripcionPush(sub.endpoint)
        } else {
          console.error('[PUSH] error enviando notificación:', err)
        }
      }
    })
  )
}
