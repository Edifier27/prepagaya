import { NextRequest, NextResponse } from 'next/server'
import { complementarLead } from '@/lib/db'
import { limpiarSituacionLaboral, limpiarPrepagaActual, limpiarPreferencias } from '@/lib/data/sondeo'

// Datos que la persona completa en la pantalla de resultados DESPUÉS de dejar
// el lead (24-sep-2026): situación laboral (filtro "¿Cómo pagás?"), "¿qué
// cobertura tenés hoy?" y las coberturas que filtra. Actualiza su lead de
// las últimas 24 hs; complementarLead pide email y celular juntos.
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }
  const email = String(body.email ?? '').trim()
  const celular = String(body.celular ?? '').trim()
  if (!email || !celular) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })

  const ok = await complementarLead({
    email,
    celular,
    situacionLaboral: limpiarSituacionLaboral(body.situacion_laboral),
    prepagaActual: limpiarPrepagaActual(body.prepaga_actual),
    preferencias: limpiarPreferencias(body.preferencias),
  })
  return NextResponse.json({ ok })
}
