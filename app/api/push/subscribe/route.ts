import { NextRequest, NextResponse } from 'next/server'
import { sesionValidaEnRequest } from '@/lib/panel-auth'
import { suscribirPush } from '@/lib/push'

export async function POST(req: NextRequest) {
  if (!sesionValidaEnRequest(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body?.endpoint || !body?.keys?.p256dh || !body?.keys?.auth) {
    return NextResponse.json({ error: 'Suscripción inválida' }, { status: 400 })
  }

  await suscribirPush({ endpoint: body.endpoint, keys: { p256dh: body.keys.p256dh, auth: body.keys.auth } })
  return NextResponse.json({ ok: true })
}
