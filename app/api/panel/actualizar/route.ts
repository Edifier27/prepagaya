import { NextRequest, NextResponse } from 'next/server'
import { sesionValidaEnRequest } from '@/lib/panel-auth'
import { actualizarLead, ESTADOS_LEAD, type EstadoLead } from '@/lib/db'

// Mini CRM del panel (pedido de Darío, 23-sep-2026): cambia estado, notas
// y/o fecha de seguimiento de un lead. Valida cada campo antes de tocar la base.
export async function POST(req: NextRequest) {
  if (!sesionValidaEnRequest(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const id = Number(body?.id)
  if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })

  const cambios: { estado?: EstadoLead; notas?: string; seguimiento_en?: string | null } = {}
  if (body.estado !== undefined) {
    if (!ESTADOS_LEAD.includes(body.estado)) return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
    cambios.estado = body.estado
  }
  if (body.notas !== undefined) cambios.notas = String(body.notas).slice(0, 2000)
  if (body.seguimiento_en !== undefined) {
    if (body.seguimiento_en === null) cambios.seguimiento_en = null
    else {
      const fecha = new Date(body.seguimiento_en)
      if (Number.isNaN(fecha.getTime())) return NextResponse.json({ error: 'Fecha inválida' }, { status: 400 })
      cambios.seguimiento_en = fecha.toISOString()
    }
  }

  await actualizarLead(id, cambios)
  return NextResponse.json({ ok: true })
}
