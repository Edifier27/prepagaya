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
import { PaginaPlan, PaginaZona, anio, mesAnio, planCorto } from '@/components/cartillas/PaginasCartillaZona'

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
      // Títulos de hasta ~60 caracteres y descripción que no se corta (11-oct-2026):
      // Google corta lo que pasa de ese largo y en el celular se ve todavía menos.
      title: { absolute: `Cartilla ${c.prepagaNombre} ${pc} ${anio(c)}: sanatorios por zona` },
      description: `Sanatorios y ${c.labelGuardia.toLowerCase()} del ${plan.label} de ${c.prepagaNombre} en CABA, GBA y el interior, con dirección y teléfono. Cartilla oficial de ${mesAnio(c)}.`,
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
  // Antes la descripción era la primera respuesta del FAQ cortada a 120
  // caracteres ("Según el buscador oficial consultado el 22/09/2026, en
  // Ciudad de Buenos Aires Swiss Medical tiene 27 sanatorios para…"). Ahora
  // arranca con los números de la zona (11-oct-2026).
  const internacion = z.centros.filter((x) => x.internacion.length > 0).length
  const guardias = z.centros.filter((x) => x.guardia.length > 0).length
  const numeros = [
    internacion ? `${internacion} sanatorio${internacion === 1 ? '' : 's'} con internación` : '',
    guardias ? `${guardias} ${guardias === 1 ? 'centro' : 'centros'} con ${c.labelGuardia.toLowerCase()}` : '',
  ].filter(Boolean).join(' y ')
  return {
    title: { absolute: `Cartilla ${c.prepagaNombre} ${corto} ${anio(c)}: sanatorios por plan` },
    description: `${numeros ? `${c.prepagaNombre} en ${corto}: ${numeros}` : `Cartilla de ${c.prepagaNombre} en ${corto}`}, con dirección, teléfono y desde qué plan. Cartilla oficial de ${mesAnio(c)}.`,
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
