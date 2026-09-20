// Alerta instantánea de lead nuevo por Telegram (pedido de Darío, 20-sep-2026:
// enterarse al toque de cada lead sin depender del mail). Un bot de Telegram
// manda un mensaje a uno o más chats apenas entra el lead — si Darío/Gabriela
// tienen Telegram Desktop abierto, salta como notificación nativa del SO al
// instante, y también les llega al celular. Gratis y sin límite de envíos,
// a diferencia de EmailJS.
//
// TELEGRAM_CHAT_IDS admite varios ids separados por coma (uno por persona que
// tiene que enterarse). Sin token o sin ids configurados, no hace nada — el
// resto del flujo del lead sigue sin verse afectado (igual que Kommo).
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? ''
const TELEGRAM_CHAT_IDS = (process.env.TELEGRAM_CHAT_IDS ?? '')
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean)

export async function avisarLeadPorTelegram(texto: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_CHAT_IDS.length === 0) return

  await Promise.allSettled(
    TELEGRAM_CHAT_IDS.map(async (chatId) => {
      try {
        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: texto,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          }),
        })
        if (!res.ok) {
          console.error('[TELEGRAM] error enviando alerta:', res.status, await res.text().catch(() => ''))
        }
      } catch (err) {
        console.error('[TELEGRAM] error de red enviando alerta:', err)
      }
    })
  )
}

/** Arma el texto del mensaje de alerta, en HTML simple (el que soporta el parse_mode de arriba). */
export function textoAlertaLead(d: {
  nombre: string; celular: string; email: string; prepaga: string
  provincia: string; edades: string; fuente: string; kommoLink: string
}): string {
  const escapar = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const lineas = [
    '🆕 <b>Lead nuevo — PrepagaYa</b>',
    `👤 ${escapar(d.nombre || 'Sin nombre')}`,
    d.celular ? `📱 ${escapar(d.celular)}` : null,
    d.email ? `✉️ ${escapar(d.email)}` : null,
    d.prepaga ? `💊 Interés: ${escapar(d.prepaga)}` : null,
    d.provincia ? `📍 Zona: ${escapar(d.provincia)}` : null,
    d.edades ? `👥 Integrantes: ${escapar(d.edades)}` : null,
    d.fuente ? `🔗 Fuente: ${escapar(d.fuente)}` : null,
    d.kommoLink ? `\n<a href="${d.kommoLink}">Ver en Kommo →</a>` : null,
  ]
  return lineas.filter(Boolean).join('\n')
}
