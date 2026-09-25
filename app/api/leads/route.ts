import { NextRequest, NextResponse } from 'next/server'
import { track } from '@vercel/analytics/server'
import { avisarLeadPorTelegram, textoAlertaLead } from '@/lib/telegram'
import { guardarLeadEnPlanilla } from '@/lib/sheets'
import { guardarLead } from '@/lib/db'
import { avisarLeadPorPush } from '@/lib/push'
import { detectarZona } from '@/lib/geo-zonas'
import { limpiarSituacionLaboral, limpiarPresupuesto, limpiarPrepagaActual, limpiarPreferencias } from '@/lib/data/sondeo'

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
  // activo: el lead entra "Pendiente" y lo procesa
  // /api/cron/procesar-leads-kommo recién a los 3 minutos de la última
  // actividad de esa persona, para no crear un contacto en Kommo por cada
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

  await Promise.allSettled([
    track('Lead enviado', { fuente: fuente.slice(0, 60), pagina: pagina || '(desconocida)', provincia: provincia ? provincia.slice(0, 40) : 'Sin especificar' }, { headers: req.headers }),
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

  return NextResponse.json({ ok: true })
}
