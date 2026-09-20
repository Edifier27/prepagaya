import { NextRequest, NextResponse } from 'next/server'
import { sesionValidaEnRequest } from '@/lib/panel-auth'
import { leadsDesde, listarLeads } from '@/lib/db'

// Polling del panel (pedido de Darío, 20-sep-2026): con ?after=<id> devuelve
// solo los leads más nuevos que ese id, para que el panel detecte "entró
// algo nuevo" sin traer la lista entera cada vez.
export async function GET(req: NextRequest) {
  if (!sesionValidaEnRequest(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const after = req.nextUrl.searchParams.get('after')
  const leads = after ? await leadsDesde(Number(after)) : await listarLeads()
  return NextResponse.json({ leads })
}
