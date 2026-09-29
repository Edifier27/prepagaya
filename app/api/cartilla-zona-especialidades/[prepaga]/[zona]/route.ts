import { NextResponse } from 'next/server'
import { getZonaEspecialidades, prepagasConEspecialidades, zonasConEspecialidades } from '@/lib/data/cartilla-zonas/especialidades'

// Especialidades de una zona (Swiss Medical: cartilla general; OSDE: solo
// especialistas de guardia). Mismo patrón que /api/cartilla-zona: estático,
// una respuesta por zona generada en el build.
export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return prepagasConEspecialidades().flatMap((prepaga) => zonasConEspecialidades(prepaga).map((zona) => ({ prepaga, zona })))
}

export async function GET(_req: Request, { params }: { params: Promise<{ prepaga: string; zona: string }> }) {
  const { prepaga, zona } = await params
  const z = getZonaEspecialidades(prepaga, zona)
  if (!z) return NextResponse.json({ error: 'Zona no encontrada' }, { status: 404 })
  return NextResponse.json(z)
}
