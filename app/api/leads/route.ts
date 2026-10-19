import { NextRequest, NextResponse, after } from 'next/server'
import { track } from '@vercel/analytics/server'
import { avisarLeadPorTelegram, textoAlertaLead } from '@/lib/telegram'
import { guardarLeadEnPlanilla } from '@/lib/sheets'
import { guardarLead } from '@/lib/db'
import { procesarLeadsPendientesDeKommo, MINUTOS_ESPERA_KOMMO } from '@/lib/procesar-leads-kommo'
import { avisarLeadPorPush } from '@/lib/push'
import { detectarZona } from '@/lib/geo-zonas'
import { limpiarSituacionLaboral, limpiarPresupuesto, limpiarPrepagaActual, limpiarPreferencias } from '@/lib/data/sondeo'

// Envío a Kommo programado por cada lead (19-oct-2026, en vez del cron de
// cada minuto que agotó el cupo gratis de la base): después de responder,
// esta misma función espera 1 minuto y medio (más un margen) y manda los que
// ya cumplieron ese tiempo sin actividad (lib/procesar-leads-kommo.ts). Si la persona sigue
// sumando intereses, su lead espera al último aviso; si este envío se corta,
// lo levanta el cron de respaldo cada 30 minutos. maxDuration alcanza para
// la espera más el envío (Vercel Pro).
export const maxDuration = 300
const ESPERA_KOMMO_MS = MINUTOS_ESPERA_KOMMO * 60_000 + 10_000

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const nombre    = String(body.nombre ?? '').trim()
  const email     = String(body.email ?? body.reply_to ?? '').trim()
  const celular   = String(body.celular ?? '').trim()
  const prepaga   = String(body.prepaga_interes ?? '').trim()
  const fuente    = String(body.fuente ?? 'web').trim()
  const fecha     = String(body.fecha ?? new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }))
  // Zona y edades: solo el wizard del comparador los manda (provincia +
  // personas en buildPayload) — los otros formularios no piden esta info,
  // así que quedan en "No especificada" para esos leads.
  const provincia = String(body.provincia ?? '').trim()
  const personas  = String(body.personas ?? '').trim()
  // Leads de los silos internacionales (/en, /ru, /zh) — ver lib/kommo.ts:
  // cuando viene seteado, el celular ya trae su propio código de país y no
  // se normaliza a formato argentino en ningún punto del pipeline.
  const pais      = String(body.pais ?? '').trim()
  // Localidad aproximada por IP (mismos headers de Vercel que usa el banner
  // "Vemos que estás en…"), para filtrar el panel por localidad o subzona
  // del GBA — pedido de Darío, 23-sep-2026. No se le pide nada al usuario.
  // Respuestas que la persona ya dio en el cotizador o el quiz (24-sep-2026).
  // Solo valores de las listas de lib/data/sondeo.ts; lo demás se descarta.
  const situacionLaboral = limpiarSituacionLaboral(body.situacion_laboral)
  const presupuesto = limpiarPresupuesto(body.presupuesto_quiz)
  const prepagaActual = limpiarPrepagaActual(body.prepaga_actual)
  const preferencias = limpiarPreferencias(body.preferencias)
  const zonaDetectada = detectarZona(req.headers.get('x-vercel-ip-country-region'), req.headers.get('x-vercel-ip-city'))?.label

  if (!nombre || !email) {
    return NextResponse.json({ error: 'Nombre y email son requeridos' }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }

  console.log('[LEAD]', JSON.stringify({ nombre, email, celular, prepaga, provincia, personas, fuente, fecha }))

  // Kommo ya NO se llama acá — pedido de Darío, 22-sep-2026, con Vercel Pro
  // activo: el lead entra "Pendiente" y sale recién al minuto y medio de la
  // última actividad de esa persona (ver el after() de abajo), para no crear un contacto en Kommo por cada
  // click de "elegir plan" y en cambio mandar uno solo ya consolidado con
  // todos los intereses (ver el apilado en lib/db.ts). Antes de eso, avisos
  // instantáneos igual — Telegram, push y la planilla no dependen de Kommo.
  // Medición (25-sep-2026): un evento por lead en Vercel Analytics con la
  // herramienta (fuente), la página donde estaba y la provincia, para saber
  // qué convierte. Sin datos personales. Se registra acá, en un solo lugar,
  // para todos los formularios del sitio.
  let pagina = ''
  try {
    pagina = new URL(req.headers.get('referer') ?? '').pathname.slice(0, 100)
  } catch { /* sin referer */ }

  // Leads que llegaron al comparador desde la barra "Cotizá X" de fichas y
  // planes (3-oct-2026): se miden como "cotizacion-wizard · barra". Solo en
  // Vercel Analytics; la fuente guardada (base, Kommo, planilla) no cambia.
  const origen = String(body.origen ?? '').trim()
  const fuenteMedida = /^[a-z-]{3,20}$/.test(origen) ? `${fuente} · ${origen}` : fuente

  await Promise.allSettled([
    track('Lead enviado', { fuente: fuenteMedida.slice(0, 60), pagina: pagina || '(desconocida)', provincia: provincia ? provincia.slice(0, 40) : 'Sin especificar' }, { headers: req.headers }),
    guardarLead({ nombre, celular, email, prepaga, provincia, edades: personas, fuente, pais: pais || undefined, zonaDetectada, situacionLaboral, presupuesto, prepagaActual, preferencias }),
    avisarLeadPorTelegram(textoAlertaLead({
      nombre, celular, email, prepaga, provincia, edades: personas, fuente, kommoLink: '',
    })),
    avisarLeadPorPush(
      'PrepagaYa — Lead nuevo',
      `${nombre} · ${prepaga || 'Sin especificar'}`
    ),
    guardarLeadEnPlanilla({
      fecha, nombre, celular, email, prepaga, provincia, edades: personas, fuente, kommo: 'Pendiente',
    }),
  ])

  after(async () => {
    await new Promise((r) => setTimeout(r, ESPERA_KOMMO_MS))
    try {
      const r = await procesarLeadsPendientesDeKommo()
      console.log('[LEAD→KOMMO] envío programado:', JSON.stringify(r))
    } catch (err) {
      // Queda en la cola: lo manda el cron de respaldo
      console.error('[LEAD→KOMMO] no se pudo procesar ahora:', err)
    }
  })

  return NextResponse.json({ ok: true })
}
