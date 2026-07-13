import { NextRequest, NextResponse } from 'next/server'

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

  const nombre = String(body.nombre ?? '').trim()
  const email  = String(body.email ?? body.reply_to ?? '').trim()

  if (!nombre || !email) {
    return NextResponse.json({ error: 'Nombre y email son requeridos' }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }

  const lead = {
    ...body,
    nombre,
    email: email.toLowerCase(),
    fecha: body.fecha ?? new Date().toISOString(),
    fuente: body.fuente ?? 'web',
  }

  console.log('[LEAD]', JSON.stringify(lead))

  const webhookUrl = process.env.LEADS_WEBHOOK_URL
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      })
    } catch (err) {
      console.error('[LEAD] Webhook error:', err)
    }
  }

  return NextResponse.json({ ok: true })
}
