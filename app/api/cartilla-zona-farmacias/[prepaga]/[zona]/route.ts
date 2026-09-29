import { NextResponse } from 'next/server'
import { getZonaFarmacias, prepagasConFarmacias, zonasConFarmacias } from '@/lib/data/cartilla-zonas/farmacias'

// Farmacias de una zona. Mismo patrón que /api/cartilla-zona: estático, una
// respuesta por zona generada en el build.
export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return prepagasConFarmacias().flatMap((prepaga) => zonasConFarmacias(prepaga).map((zona) => ({ prepaga, zona })))
}

export async function GET(_req: Request, { params }: { params: Promise<{ prepaga: string; zona: string }> }) {
  const { prepaga, zona } = await params
  const z = getZonaFarmacias(prepaga, zona)
  if (!z) return NextResponse.json({ error: 'Zona no encontrada' }, { status: 404 })
  return NextResponse.json(z)
}
