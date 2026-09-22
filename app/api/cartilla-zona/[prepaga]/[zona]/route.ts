import { NextResponse } from 'next/server'
import { CARTILLAS, getZona } from '@/lib/data/cartilla-zonas'

// Centros de una zona de la cartilla (OSDE / Premedic / Avalian) para el
// buscador cliente (components/cartillas/BuscadorCartillaZona.tsx).
// Estático: una respuesta por zona generada en el build, así el bundle del
// cliente no carga la cartilla entera, solo la zona que se mira.
export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return Object.values(CARTILLAS).flatMap((c) => c.zonas.map((z) => ({ prepaga: c.prepagaSlug, zona: z.slug })))
}

export async function GET(_req: Request, { params }: { params: Promise<{ prepaga: string; zona: string }> }) {
  const { prepaga, zona } = await params
  const z = getZona(prepaga, zona)
  if (!z) return NextResponse.json({ error: 'Zona no encontrada' }, { status: 404 })
  return NextResponse.json(z)
}
