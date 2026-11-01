import { NextResponse } from 'next/server'
import { esRubroComercio, fuenteRubro, getZonaRubro, prepagasConRubro, RUBROS_COMERCIO, zonasConRubro, type RubroComercio } from '@/lib/data/cartilla-zonas/comercios'

// Ópticas o vacunatorios de una zona (2-nov-2026). Mismo patrón que
// /api/cartilla-zona-farmacias: estático, una respuesta por zona generada en el build.
export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return (Object.keys(RUBROS_COMERCIO) as RubroComercio[]).flatMap((rubro) =>
    prepagasConRubro(rubro).flatMap((prepaga) => zonasConRubro(rubro, prepaga).map((zona) => ({ rubro, prepaga, zona }))),
  )
}

export async function GET(_req: Request, { params }: { params: Promise<{ rubro: string; prepaga: string; zona: string }> }) {
  const { rubro, prepaga, zona } = await params
  const z = esRubroComercio(rubro) ? getZonaRubro(rubro, prepaga, zona) : undefined
  if (!z || !esRubroComercio(rubro)) return NextResponse.json({ error: 'Zona no encontrada' }, { status: 404 })
  return NextResponse.json({ ...z, ...fuenteRubro(rubro, prepaga) })
}
