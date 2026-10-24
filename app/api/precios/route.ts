import { NextRequest, NextResponse } from 'next/server'
import { preciosParaGrupo, precioGrupo, FUENTE_PRECIOS, type Modalidad } from '@/lib/precios/motor'

// Motor de precios oficial expuesto para el comparador (y reutilizable por
// otros cotizadores propios): precio de lista mensual de cada plan con
// cuadro tarifario SSSalud para un grupo familiar y una zona.
//   POST { zona: "caba", edades: [30, 32, 4], modalidad?: "directo" | "desregulado" }
//   → { precios: { "swiss-medical/smg20": 123456, ... }, fuente }
// Con planes: ["swiss-medical/smg20", …] suma porPersona (precio de cada
// integrante, en el orden de edades) para esos planes: el cotizador v2 lo usa
// para la promo de Swiss (50% a menores de 26, 15% a los adultos).
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
  const planes: string[] = Array.isArray(body?.planes) ? body.planes.map(String).filter((k: string) => /^[a-z0-9-]+\/[a-z0-9-]+$/.test(k)).slice(0, 20) : []
  const porPersona: Record<string, number[]> = {}
  for (const k of planes) {
    const [prep, plan] = k.split('/')
    const r = precioGrupo(prep, plan, edades, zona, modalidad)
    if (r) porPersona[k] = r.porPersona.map((x) => x.precio)
  }
  return NextResponse.json({ precios: preciosParaGrupo(edades, zona, modalidad), ...(planes.length ? { porPersona } : {}), fuente: FUENTE_PRECIOS })
}
