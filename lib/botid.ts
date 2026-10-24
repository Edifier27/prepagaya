import { checkBotId } from 'botid/server'

/** true si el detector de robots de Vercel marca el pedido como bot. Si el
 *  detector falla (por ejemplo fuera de Vercel, sin el header OIDC), deja
 *  pasar: es preferible un scraper más que un cotizador sin precios. */
export async function esBot(): Promise<boolean> {
  try {
    return (await checkBotId()).isBot
  } catch (err) {
    console.error('[BOTID] no se pudo verificar, se deja pasar:', err instanceof Error ? err.message : err)
    return false
  }
}
