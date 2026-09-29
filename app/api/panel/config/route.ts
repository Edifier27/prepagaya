import { NextRequest, NextResponse } from 'next/server'
import { sesionValidaEnRequest } from '@/lib/panel-auth'
import { getCuentaKommoDefault, setCuentaKommoDefault, type KommoCuenta } from '@/lib/kommo'

// Acceso directo pedido por Darío, 29-sep-2026: a qué cuenta de Kommo van
// los leads nuevos, editable desde /panel-leads sin pedir un deploy.
export async function GET(req: NextRequest) {
  if (!sesionValidaEnRequest(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  return NextResponse.json({ cuentaKommo: await getCuentaKommoDefault() })
}

export async function POST(req: NextRequest) {
  if (!sesionValidaEnRequest(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const body = await req.json().catch(() => null)
  const cuenta = body?.cuentaKommo as KommoCuenta
  if (cuenta !== 'dario' && cuenta !== 'gabriela') {
    return NextResponse.json({ error: 'Cuenta inválida' }, { status: 400 })
  }
  await setCuentaKommoDefault(cuenta)
  return NextResponse.json({ ok: true })
}
