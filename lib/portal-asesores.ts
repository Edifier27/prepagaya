// Envío al Portal Asesores (25-oct-2026): los leads que solo piden precio de
// prepagas que no son Swiss Medical ni OSDE van al asesor de esa prepaga, en
// la web aparte del portal. Swiss y OSDE siguen yendo al CRM. Apagado hasta
// que estén PORTAL_ASESORES_URL y PORTAL_ASESORES_API_KEY en Vercel (antes,
// el consentimiento en los formularios; ver la propuesta de reparto).
// Al portal no viaja nada que diga de qué web viene el dato.
import { prepagas } from '@/lib/data/prepagas'
import type { LeadRow } from '@/lib/db'

const URL_PORTAL = (process.env.PORTAL_ASESORES_URL ?? '').replace(/\/$/, '')
const CLAVE = process.env.PORTAL_ASESORES_API_KEY ?? ''
const DEL_CRM = ['swiss-medical', 'osde']

// Se prende junto con el aviso de consentimiento de los formularios (NEXT_PUBLIC_PORTAL_ASESORES=on)
export const portalConfigurado = () => Boolean(URL_PORTAL && CLAVE) && process.env.NEXT_PUBLIC_PORTAL_ASESORES === 'on'

const sinTildes = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** Prepaga del lead para el portal, o null si va al CRM (pidió Swiss u OSDE, o ninguna conocida). */
export function prepagaParaPortal(interes: string | null): string | null {
  const t = sinTildes(interes ?? '')
  const pedidas = prepagas.filter((p) => t.includes(sinTildes(p.nombre))).map((p) => p.slug)
  if (!pedidas.length || pedidas.some((s) => DEL_CRM.includes(s))) return null
  return pedidas[0]
}

/** El interés tal como lo arma el cotizador: "Medifé — Plan Oro | $ 474.191/mes de lista · pidió …" */
function planYPrecio(interes: string, slug: string): { plan: string | null; precio: string | null } {
  const nombre = prepagas.find((p) => p.slug === slug)?.nombre ?? ''
  const tramo = interes.split(',').find((x) => sinTildes(x).includes(sinTildes(nombre))) ?? interes
  const [antes, despues] = tramo.split('|')
  const plan = antes.split('—')[1]?.trim() || null
  const precio = despues?.split('·')[0].replace('de lista', '').trim() || null
  return { plan, precio }
}

export async function mandarAlPortal(lead: LeadRow, slug: string): Promise<boolean> {
  if (!portalConfigurado()) return false
  let prefs: Record<string, string> = {}
  try { prefs = JSON.parse(lead.preferencias ?? '{}') ?? {} } catch { /* sin preferencias */ }
  const { plan, precio } = planYPrecio(lead.prepaga ?? '', slug)
  try {
    const r = await fetch(`${URL_PORTAL}/api/recibir`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${CLAVE}` },
      body: JSON.stringify({
        origen_id: String(lead.id),
        prepaga: slug,
        plan,
        precio,
        nombre: lead.nombre,
        // Lead internacional: con "+" y código de país, para que no se lo tome como argentino
        celular: lead.pais && lead.celular ? `+${lead.celular.replace(/\D/g, '')}` : lead.celular ?? '',
        // El mail sintético del cotizador ("…@sin-email.com") no sirve al asesor
        email: lead.email && !lead.email.endsWith('@sin-email.com') ? lead.email : null,
        edades: lead.edades,
        zona: lead.provincia || lead.zona_detectada,
        condicion: lead.situacion_laboral,
        alta: prefs.alta ?? null,
        celular_verificado: !prefs.celular,
      }),
      signal: AbortSignal.timeout(10_000),
    })
    if (!r.ok) console.error('[PORTAL] respondió', r.status)
    return r.ok
  } catch (err) {
    console.error('[PORTAL] no se pudo enviar:', err)
    return false
  }
}
