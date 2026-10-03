import { NextRequest, NextResponse } from 'next/server'
import { sesionValidaEnRequest } from '@/lib/panel-auth'
import { getDestinoLead, setDestinoLead, type DestinoLead } from '@/lib/kommo'

// Acceso directo pedido por Darío, 29-sep-2026: a dónde van los leads nuevos
// (cuenta de Kommo de Darío, de Gabriela, o un mail suelto por EmailJS),
// editable desde /panel-leads sin pedir un deploy.
export async function GET(req: NextRequest) {
  if (!sesionValidaEnRequest(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  return NextResponse.json({ destino: await getDestinoLead() })
}

export async function POST(req: NextRequest) {
  if (!sesionValidaEnRequest(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const body = await req.json().catch(() => null)
  const tipo = body?.destino?.tipo
  const TIPOS_VALIDOS = ['dario', 'gabriela', 'email', 'alternar-cuentas', 'alternar-mail']
  if (!TIPOS_VALIDOS.includes(tipo)) {
    return NextResponse.json({ error: 'Tipo de destino inválido' }, { status: 400 })
  }
  let destino: DestinoLead
  if (tipo === 'email') {
    const email = String(body?.destino?.email ?? '').trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }
    destino = { tipo: 'email', email }
  } else if (tipo === 'alternar-mail') {
    const email = String(body?.destino?.email ?? '').trim()
    const cuenta = body?.destino?.cuenta === 'gabriela' ? 'gabriela' : 'dario'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }
    destino = { tipo: 'alternar-mail', cuenta, email }
  } else {
    destino = { tipo }
  }
  await setDestinoLead(destino)
  return NextResponse.json({ ok: true })
}
