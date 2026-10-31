import { NextRequest, NextResponse } from 'next/server'
import { sesionValidaEnRequest } from '@/lib/panel-auth'
import { listarLeadsBaseAnterior } from '@/lib/db'

// Pestaña "Base anterior" del panel (31-oct-2026): los leads que quedaron en
// la base original, solo para consultar y medir. Se pide recién al abrir la
// pestaña, así la base vieja no se despierta si nadie la mira.
export async function GET(req: NextRequest) {
  if (!sesionValidaEnRequest(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const leads = await listarLeadsBaseAnterior()
    if (!leads) return NextResponse.json({ error: 'No hay base anterior configurada' }, { status: 404 })
    return NextResponse.json({ leads })
  } catch (err) {
    console.error('[DB] base anterior:', err)
    return NextResponse.json({ error: 'La base anterior no responde (puede ser el cupo gratis de Neon agotado)' }, { status: 503 })
  }
}
