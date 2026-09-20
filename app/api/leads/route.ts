import { NextRequest, NextResponse } from 'next/server'
import { whatsappLinkParaLead, SITE_URL } from '@/lib/utils'
import { buildKommoLink, crearLeadEnKommo, kommoLeadUrl, nombreCuenta } from '@/lib/kommo'
import { avisarLeadPorTelegram, textoAlertaLead } from '@/lib/telegram'
import { guardarLeadEnPlanilla } from '@/lib/sheets'

// Aviso de "ya es tu contacto" que va arriba del mail cuando la búsqueda
// anti-duplicado (ver lib/kommo.ts) encuentra coincidencia por celular o
// mail en cualquiera de las dos cuentas de Kommo. Siempre HTML propio
// (nunca dato de la persona sin escapar) — se inserta tal cual en la
// plantilla en un {{duplicado_banner}} suelto, así que si viene vacío no
// deja ningún resto de markup.
function bannerDuplicado(cuenta: string): string {
  return `<tr><td style="padding:16px 32px 0 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FEF3C7;border:1px solid #FDE68A;border-radius:12px;"><tr><td style="padding:14px 18px;"><span style="display:block;font-size:13px;font-weight:700;color:#92400E;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">⚠️ Ya es un contacto en Kommo (cuenta de ${cuenta})</span><span style="display:block;font-size:12px;color:#92400E;margin-top:4px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">Puede que ya lo hayas contactado antes — revisá el historial en Kommo antes de escribirle de nuevo.</span></td></tr></table></td></tr>`
}

// Credenciales de la cuenta EmailJS de Darío — cuenta nueva (9-sep-2026),
// confirmada con un envío de prueba real. Service/Template/Public ID no son
// secretos (el Public Key está diseñado para exponerse), así que tienen
// fallback acá para que funcione igual en local/preview sin .env.
// EMAILJS_PRIVATE_KEY SÍ es un secreto real — la cuenta quedó en "modo
// estricto" (API calls from non-browser apps), así que sin accessToken
// EmailJS rechaza el envío con 403 — y por eso NO tiene fallback hardcodeado
// ni prefijo NEXT_PUBLIC_: solo vive en la env var de Vercel.
const EMAILJS_SERVICE_ID  = process.env.EMAILJS_SERVICE_ID  ?? 'PREPAGAYA'
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID ?? 'template_8p5ihaj'
const EMAILJS_PUBLIC_KEY  = process.env.EMAILJS_PUBLIC_KEY  ?? 'lVlSZHupNk1R5ZDES'
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY ?? ''

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

  if (!nombre || !email) {
    return NextResponse.json({ error: 'Nombre y email son requeridos' }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }

  console.log('[LEAD]', JSON.stringify({ nombre, email, celular, prepaga, provincia, personas, fuente, fecha }))

  const whatsapp_link = celular ? whatsappLinkParaLead(nombre, celular) : ''

  // Carga automática en Kommo (pedido de Darío, 15-sep-2026 — antes requería
  // apretar el botón del mail). El botón sigue existiendo pero cambia de rol:
  // si la carga automática funcionó, es un link directo a la tarjeta que ya
  // se creó ("Ver en Kommo"); si Kommo estuvo caído justo en este momento,
  // cae al link firmado de siempre ("Cargar en Kommo") como respaldo, para
  // que el dato nunca se pierda del todo. Nunca bloquea ni rompe el resto del
  // flujo si Kommo falla (ver timeout en lib/kommo.ts).
  let kommo_link = ''
  let kommo_label = 'Ver en Kommo'
  let duplicado_banner = ''
  let kommoOk = false
  let kommoResumen = ''
  try {
    const resultado = await crearLeadEnKommo({
      nombre, celular, email, interes: prepaga, provincia, edades: personas, fuente, fecha,
      ts: String(Date.now()),
    })
    if (resultado.ok && resultado.cuenta && resultado.leadId) {
      kommoOk = true
      kommo_link = kommoLeadUrl(resultado.cuenta, resultado.leadId)
      kommoResumen = `OK (${nombreCuenta(resultado.cuenta)})${resultado.duplicado ? ' — ya era contacto' : ''}`
      if (resultado.duplicado) duplicado_banner = bannerDuplicado(nombreCuenta(resultado.cuenta))
    } else {
      kommoResumen = `Error: ${resultado.error ?? 'sin detalle'}`
      console.error('[LEAD] no se pudo cargar en Kommo automáticamente, cae al link manual:', resultado.error)
    }
  } catch (err) {
    kommoResumen = `Error: ${err}`
    console.error('[LEAD] error cargando en Kommo automáticamente, cae al link manual:', err)
  }
  if (!kommo_link) {
    kommo_link = buildKommoLink(SITE_URL, {
      nombre, celular, email, interes: prepaga, provincia, edades: personas, fuente, fecha,
    })
    kommo_label = 'Cargar en Kommo'
  }

  // Alerta por Telegram + fila en la planilla de respaldo — siempre, haya
  // andado Kommo o no (pedido de Darío, 20-sep-2026). Ninguna de las dos
  // rompe el flujo si falla o no está configurada (ver lib/telegram.ts y
  // lib/sheets.ts): se corren en paralelo y nunca tiran.
  await Promise.allSettled([
    avisarLeadPorTelegram(textoAlertaLead({
      nombre, celular, email, prepaga, provincia, edades: personas, fuente, kommoLink: kommoOk ? kommo_link : '',
    })),
    guardarLeadEnPlanilla({
      fecha, nombre, celular, email, prepaga, provincia, edades: personas, fuente, kommo: kommoResumen,
    }),
  ])

  // El mail por EmailJS ahora es solo respaldo: Kommo ya recibe el lead
  // automático (con toda la data) y Telegram ya avisó al toque, así que
  // mandar un mail por cada lead solo gastaba cupo de EmailJS sin sumar nada
  // (pedido de Darío, 20-sep-2026, para no seguir quedándose sin límite
  // mensual). Si Kommo falló, el mail sigue siendo la red de contención de
  // siempre, con el link manual de carga incluido.
  if (!kommoOk) {
    if (!EMAILJS_PRIVATE_KEY) {
      console.error('[LEAD] Falta EMAILJS_PRIVATE_KEY — EmailJS va a rechazar el envío (modo estricto).')
    }
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id:  EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id:     EMAILJS_PUBLIC_KEY,
          accessToken: EMAILJS_PRIVATE_KEY,
          template_params: {
            name:      nombre,
            email:     email.toLowerCase(),
            celular:   celular || 'No informado',
            prepaga:   prepaga || 'No especificada',
            zona:      provincia || 'No especificada',
            edades:    personas || 'No especificado',
            fuente,
            fecha,
            whatsapp_link,
            kommo_link,
            kommo_label,
            duplicado_banner,
          },
        }),
      })
      if (!res.ok) {
        const text = await res.text()
        console.error('[LEAD] EmailJS error:', res.status, text)
      }
    } catch (err) {
      console.error('[LEAD] EmailJS fetch error:', err)
    }
  }

  return NextResponse.json({ ok: true })
}
