import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE_URL } from '@/lib/utils'
import {
  CARTILLAS,
  combinacionesPlanZona,
  getCartilla,
  getPlanPorSlug,
  getZona,
  nombreCortoZona,
  tieneCombinacion,
} from '@/lib/data/cartilla-zonas'
import { PaginaPlanZona, anio, mesAnio, planCorto } from '@/components/cartillas/PaginasCartillaZona'

// Tercer nivel del silo: plan × zona (/cartillas/osde/plan-210/gba-zona-norte
// → "cartilla osde 210 zona norte"). Solo las combinaciones con contenido
// propio (ver combinacionesPlanZona): el resto da 404.
export const dynamicParams = false

interface Props {
  params: Promise<{ slug: string; zona: string; sub: string }>
}

export function generateStaticParams() {
  return Object.values(CARTILLAS).flatMap((c) =>
    combinacionesPlanZona(c.prepagaSlug).map((x) => ({ slug: c.prepagaSlug, zona: x.plan, sub: x.zona })),
  )
}

function resolver(slug: string, planSlug: string, zonaSlug: string) {
  const c = getCartilla(slug)
  const p = getPlanPorSlug(slug, planSlug)
  const z = getZona(slug, zonaSlug)
  if (!c || !p || !z || !tieneCombinacion(slug, planSlug, zonaSlug)) return null
  return { c, p, z }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, zona, sub } = await params
  const r = resolver(slug, zona, sub)
  if (!r) return {}
  const { c, p, z } = r
  const corto = nombreCortoZona(z.nombre)
  const pc = planCorto(p)
  const n = z.centros.filter((ce) => ce.internacion.includes(p.id)).length
  const g = z.centros.filter((ce) => ce.guardia.includes(p.id)).length
  return {
    title: `Cartilla ${c.prepagaNombre} ${pc} ${corto} ${anio(c)}: sanatorios y ${c.labelGuardia.toLowerCase()}`,
    description: `${c.prepagaNombre} ${pc} en ${z.nombre}: ${n} sanatorio${n === 1 ? '' : 's'} para internación${g ? ` y ${g} con ${c.labelGuardia.toLowerCase()}` : ''}, con dirección y teléfono. Qué suma un plan superior. Datos oficiales de ${mesAnio(c)}.`,
    alternates: { canonical: `${SITE_URL}/cartillas/${slug}/${zona}/${sub}` },
    keywords: [
      `cartilla ${c.prepagaNombre.toLowerCase()} ${pc.toLowerCase()} ${corto.toLowerCase()}`,
      `${c.prepagaNombre.toLowerCase()} ${pc.toLowerCase()} ${corto.toLowerCase()}`,
      `${c.prepagaNombre.toLowerCase()} cartilla ${pc.toLowerCase()} ${corto.toLowerCase()}`,
    ],
  }
}

export default async function CartillaPlanZonaPage({ params }: Props) {
  const { slug, zona, sub } = await params
  const r = resolver(slug, zona, sub)
  if (!r) notFound()
  return <PaginaPlanZona c={r.c} p={r.p} z={r.z} />
}
