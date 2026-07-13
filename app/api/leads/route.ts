import { NextRequest, NextResponse } from 'next/server'

const EMAILJS_SERVICE_ID  = 'service_m8w2gtu'
const EMAILJS_TEMPLATE_ID = 'template_a8qzzg8'
const EMAILJS_PUBLIC_KEY  = 'DsKn9OmLBr6211IOF'

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

  const nombre  = String(body.nombre ?? '').trim()
  const email   = String(body.email ?? body.reply_to ?? '').trim()
  const celular = String(body.celular ?? '').trim()
  const prepaga = String(body.prepaga_interes ?? '').trim()
  const fuente  = String(body.fuente ?? 'web').trim()
  const fecha   = String(body.fecha ?? new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }))

  if (!nombre || !email) {
    return NextResponse.json({ error: 'Nombre y email son requeridos' }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }

  console.log('[LEAD]', JSON.stringify({ nombre, email, celular, prepaga, fuente, fecha }))

  // Enviar email via EmailJS REST API
  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id:  EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id:     EMAILJS_PUBLIC_KEY,
        template_params: {
          name:    nombre,
          email:   email.toLowerCase(),
          celular: celular || 'No informado',
          prepaga: prepaga || 'No especificada',
          fuente,
          fecha,
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
