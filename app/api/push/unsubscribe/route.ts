import { NextRequest, NextResponse } from 'next/server'
import { sesionValidaEnRequest } from '@/lib/panel-auth'
import { desuscribirPush } from '@/lib/push'

export async function POST(req: NextRequest) {
  if (!sesionValidaEnRequest(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body?.endpoint) return NextResponse.json({ error: 'Falta endpoint' }, { status: 400 })

  await desuscribirPush(body.endpoint)
  return NextResponse.json({ ok: true })
}
