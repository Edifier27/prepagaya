import { NextRequest, NextResponse } from 'next/server'
import { whatsappLinkParaLead } from '@/lib/utils'

// Credenciales de la cuenta EmailJS de Darío, confirmadas con un envío de
// prueba real (8-sep-2026). Service/Template/Public ID no son secretos (el
// Public Key está diseñado para exponerse), así que tienen fallback acá para
// que funcione igual en local/preview sin .env. EMAILJS_PRIVATE_KEY SÍ es un
// secreto real — la cuenta quedó en "modo estricto" (API calls from
// non-browser apps), así que sin accessToken EmailJS rechaza el envío con
// 403 — y por eso NO tiene fallback hardcodeado ni prefijo NEXT_PUBLIC_: solo
// vive en la env var de Vercel.
const EMAILJS_SERVICE_ID  = process.env.EMAILJS_SERVICE_ID  ?? 'PREPAGAYA'
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID ?? 'template_rxgrviu'
const EMAILJS_PUBLIC_KEY  = process.env.EMAILJS_PUBLIC_KEY  ?? '-a6t4QSJQUEVpaEVe'
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

  const whatsapp_link = celular ? whatsappLinkParaLead(nombre, celular, prepaga) : ''

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
