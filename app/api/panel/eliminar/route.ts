import { NextRequest, NextResponse } from 'next/server'
import { sesionValidaEnRequest } from '@/lib/panel-auth'
import { eliminarLead } from '@/lib/db'

// Borrado de un lead desde el panel (pedido de Darío, 23-sep-2026). Es un
// soft delete: deja de verse en el panel y no se manda a Kommo si todavía
// estaba pendiente, pero la fila queda en la base.
export async function POST(req: NextRequest) {
  if (!sesionValidaEnRequest(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const id = Number(body?.id)
  if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })

  await eliminarLead(id)
  return NextResponse.json({ ok: true })
}
