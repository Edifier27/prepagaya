import { NextRequest, NextResponse } from 'next/server'
import { preciosParaGrupo, FUENTE_PRECIOS, type Modalidad } from '@/lib/precios/motor'

// Motor de precios oficial expuesto para el comparador (y reutilizable por
// otros cotizadores propios): precio de lista mensual de cada plan con
// cuadro tarifario SSSalud para un grupo familiar y una zona.
//   POST { zona: "caba", edades: [30, 32, 4], modalidad?: "directo" | "desregulado" }
//   → { precios: { "swiss-medical/smg20": 123456, ... }, fuente }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const zona = String(body?.zona ?? '').trim()
  const edades = Array.isArray(body?.edades)
    ? body.edades.map(Number).filter((n: number) => Number.isInteger(n) && n >= 0 && n <= 110).slice(0, 10)
    : []
  const modalidad: Modalidad = body?.modalidad === 'desregulado' ? 'desregulado' : 'directo'
  if (!zona || edades.length === 0) {
    return NextResponse.json({ error: 'Faltan zona o edades' }, { status: 400 })
  }
  return NextResponse.json({ precios: preciosParaGrupo(edades, zona, modalidad), fuente: FUENTE_PRECIOS })
}
