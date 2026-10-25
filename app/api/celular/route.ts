import { NextRequest, NextResponse } from 'next/server'
import { verificarCelularAR, MENSAJE_CELULAR } from '@/lib/celular-ar'

// ¿Existe el celular? Los formularios lo preguntan antes de enviar el lead
// (lib/celular-cliente.ts) y, si no, le muestran a la persona por qué.
//   POST { celular: "11 2345-6789" } → { ok: true } | { ok: false, motivo, mensaje }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const celular = String(body?.celular ?? '').slice(0, 40)
  const r = verificarCelularAR(celular)
  return NextResponse.json(r.ok ? { ok: true } : { ok: false, motivo: r.motivo, mensaje: MENSAJE_CELULAR[r.motivo] })
}
