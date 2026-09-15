import { NextRequest, NextResponse } from 'next/server'
import { whatsappLinkParaLead, SITE_URL } from '@/lib/utils'
import { buildKommoLink, buscarContactoExistente, nombreCuenta } from '@/lib/kommo'

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

  const whatsapp_link = celular ? whatsappLinkParaLead(nombre, celular, prepaga, provincia, personas) : ''
  // Botón "Cargar en Kommo" del mail (pedido de Darío, 15-sep-2026) — ver
  // lib/kommo.ts para el porqué del link firmado en vez de un botón directo.
  const kommo_link = buildKommoLink(SITE_URL, {
    nombre, celular, email, interes: prepaga, provincia, edades: personas, fuente, fecha,
  })

  // Aviso de duplicado en el mail — best-effort: si Kommo está lento o caído
  // esto nunca frena ni rompe el envío del lead (ver timeout en lib/kommo.ts).
  let duplicado_banner = ''
  try {
    const existente = await buscarContactoExistente({ celular, email })
    if (existente) duplicado_banner = bannerDuplicado(nombreCuenta(existente.cuenta))
  } catch (err) {
    console.error('[LEAD] error chequeando duplicado en Kommo (no bloquea el envío):', err)
  }

  if (!EMAILJS_PRIVATE_KEY) {
    console.error('[LEAD] Falta EMAILJS_PRIVATE_KEY — EmailJS va a rechazar el envío (modo estricto).')
  }

  // Enviar email via EmailJS REST API
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

  return NextResponse.json({ ok: true })
}
