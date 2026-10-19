import { NextResponse } from 'next/server'
import { CARTILLAS, getZona, linkCartillaPlan, tieneCombinacion } from '@/lib/data/cartilla-zonas'
import { centrosEnOtrasCartillas } from '@/lib/data/cartilla-zonas/cruce'

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
  // enOtras: sanatorios de la zona que están en otras cartillas y no en esta.
  // planes: lo que necesita el modal de cartilla del comparador para elegir
  // los centros del plan y armar el link (18-oct-2026: antes el modal
  // importaba todas las cartillas — 1,1 MB — para mirar una sola zona).
  const planes = CARTILLAS[prepaga].planes.map((p) => {
    const slugComp = p.comparadorSlug ?? p.otrosComparadorSlugs?.[0]
    const link = slugComp ? linkCartillaPlan(prepaga, slugComp) : null
    const slugPlan = link?.href.split('/').pop()
    return {
      id: p.id,
      comparadorSlugs: [p.comparadorSlug, ...(p.otrosComparadorSlugs ?? [])].filter(Boolean),
      href: link?.href ?? null,
      conPaginaEnZona: !!slugPlan && tieneCombinacion(prepaga, slugPlan, zona),
    }
  })
  return NextResponse.json({ ...z, enOtras: centrosEnOtrasCartillas(prepaga, zona), planes })
}
