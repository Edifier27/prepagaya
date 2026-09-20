import { NextRequest, NextResponse } from 'next/server'
import { sesionValidaEnRequest } from '@/lib/panel-auth'
import { marcarLeido } from '@/lib/db'

export async function POST(req: NextRequest) {
  if (!sesionValidaEnRequest(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const id = Number(body?.id)
  const leido = Boolean(body?.leido)
  if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })

  await marcarLeido(id, leido)
  return NextResponse.json({ ok: true })
}
