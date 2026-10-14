import { NextRequest, NextResponse } from 'next/server'
import { sesionValidaEnRequest } from '@/lib/panel-auth'
import { cupoParaPanel, getCupoMail, reiniciarCupoHoy, setCupoMail, usadosHoy } from '@/lib/cupo-mail'

// Cupo diario por mail (pedido de Darío, 14-oct-2026): ver lib/cupo-mail.ts
export async function GET(req: NextRequest) {
  if (!sesionValidaEnRequest(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  // El mail no se devuelve: no se muestra en el panel (pedido de Darío)
  return NextResponse.json({ cupo: await cupoParaPanel(), usadosHoy: await usadosHoy() })
}

export async function POST(req: NextRequest) {
  if (!sesionValidaEnRequest(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const cuerpo = await req.json().catch(() => null)
  if (cuerpo?.reiniciar) { await reiniciarCupoHoy(); return NextResponse.json({ ok: true }) }
  const b = cuerpo?.cupo
  // Mail vacío = se queda el que ya estaba configurado
  const email = String(b?.email ?? '').trim() || (await getCupoMail()).email
  const porDia = Math.max(0, Math.min(50, Math.round(Number(b?.porDia) || 0)))
  const rotulo = String(b?.rotulo ?? '').trim().slice(0, 40) || 'Cupo mail'
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  await setCupoMail({ activo: Boolean(b?.activo), email, porDia, rotulo })
  return NextResponse.json({ ok: true })
}
