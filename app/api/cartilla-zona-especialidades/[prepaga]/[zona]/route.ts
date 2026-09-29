import { NextResponse } from 'next/server'
import { getZonaEspecialidades, zonasConEspecialidades } from '@/lib/data/cartilla-zonas/especialidades'

// Especialidades (pediatría, traumatología... y esterilidad) de una zona —
// por ahora solo Swiss Medical. Mismo patrón que /api/cartilla-zona: estático,
// una respuesta por zona generada en el build.
export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return zonasConEspecialidades('swiss-medical').map((zona) => ({ prepaga: 'swiss-medical', zona }))
}

export async function GET(_req: Request, { params }: { params: Promise<{ prepaga: string; zona: string }> }) {
  const { prepaga, zona } = await params
  const z = getZonaEspecialidades(prepaga, zona)
  if (!z) return NextResponse.json({ error: 'Zona no encontrada' }, { status: 404 })
  return NextResponse.json(z)
}
