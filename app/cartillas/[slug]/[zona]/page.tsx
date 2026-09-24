import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE_URL } from '@/lib/utils'
import {
  CARTILLAS,
  getCartilla,
  getPlanPorSlug,
  getZona,
  indiceZonas,
  nombreZonaTitulo,
  slugPlan,
} from '@/lib/data/cartilla-zonas'
import { PaginaPlan, PaginaZona, anio, faqsZona, mesAnio, planCorto } from '@/components/cartillas/PaginasCartillaZona'

// Segundo nivel del silo de cartillas por zona:
//   /cartillas/osde/gba-zona-norte   → cartilla de la zona ("cartilla osde zona norte")
//   /cartillas/osde/plan-210         → cartilla del plan ("cartilla osde 210")
// Solo para las prepagas con cartilla por zona (lib/data/cartilla-zonas);
// cualquier otra combinación da 404 (dynamicParams = false).
export const dynamicParams = false

interface Props {
  params: Promise<{ slug: string; zona: string }>
}

export function generateStaticParams() {
  return Object.values(CARTILLAS).flatMap((c) => [
    ...c.zonas.map((z) => ({ slug: c.prepagaSlug, zona: z.slug })),
    ...c.planesConPagina.map((p) => ({ slug: c.prepagaSlug, zona: slugPlan(p) })),
  ])
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, zona } = await params
  const c = getCartilla(slug)
  if (!c) return {}
  const plan = getPlanPorSlug(slug, zona)
  if (plan) {
    const pc = planCorto(plan)
    return {
      title: `Cartilla ${c.prepagaNombre} ${pc} ${anio(c)}: sanatorios y ${c.labelGuardia.toLowerCase()} por zona`,
      description: `Cartilla del ${plan.label} de ${c.prepagaNombre}: todos los sanatorios para internación y ${c.labelGuardia.toLowerCase()} por zona (CABA, GBA e interior), con dirección y teléfono. Datos oficiales de ${mesAnio(c)}.`,
      alternates: { canonical: `${SITE_URL}/cartillas/${slug}/${zona}` },
      keywords: [
        `cartilla ${c.prepagaNombre.toLowerCase()} ${pc.toLowerCase()}`,
        `${c.prepagaNombre.toLowerCase()} ${pc.toLowerCase()} cartilla`,
        `cartilla ${c.prepagaNombre.toLowerCase()} plan ${pc.toLowerCase()}`,
        `sanatorios ${c.prepagaNombre.toLowerCase()} ${pc.toLowerCase()}`,
      ],
    }
  }
  const z = getZona(slug, zona)
  if (!z) return {}
  const corto = nombreZonaTitulo(slug, z)
  const idx = indiceZonas(slug).find((x) => x.slug === z.slug)
  const faq = faqsZona(c, z)[0]
  return {
    title: `Cartilla ${c.prepagaNombre} ${corto} ${anio(c)}: sanatorios y ${c.labelGuardia.toLowerCase()} por plan`,
    description: `${faq ? faq.a.slice(0, 120).replace(/\s+\S*$/, '') + '…' : `Cartilla de ${c.prepagaNombre} en ${z.nombre}.`} Dirección, teléfono y qué plan incluye cada uno. Datos oficiales de ${mesAnio(c)}.`,
    alternates: { canonical: `${SITE_URL}/cartillas/${slug}/${z.slug}` },
    ...(idx && !idx.indexable ? { robots: { index: false, follow: true } } : {}),
    keywords: [
      `cartilla ${c.prepagaNombre.toLowerCase()} ${corto.toLowerCase()}`,
      `${c.prepagaNombre.toLowerCase()} cartilla ${corto.toLowerCase()}`,
      `sanatorios ${c.prepagaNombre.toLowerCase()} ${corto.toLowerCase()}`,
      `guardia ${c.prepagaNombre.toLowerCase()} ${corto.toLowerCase()}`,
    ],
  }
}

export default async function CartillaZonaOPlanPage({ params }: Props) {
  const { slug, zona } = await params
  const c = getCartilla(slug)
  if (!c) notFound()
  const plan = getPlanPorSlug(slug, zona)
  if (plan) return <PaginaPlan c={c} p={plan} />
  const z = getZona(slug, zona)
  if (!z) notFound()
  return <PaginaZona c={c} z={z} />
}
