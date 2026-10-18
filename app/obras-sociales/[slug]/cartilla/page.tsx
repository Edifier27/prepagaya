import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { osDeCartilla } from '@/lib/data/sindicales-cartillas/os'
import { CARTILLAS_SINDICALES, getCartillaSindical, totales } from '@/lib/data/sindicales-cartillas'
import { PaginaCartillaSindical, urlCartilla } from '@/components/obras-sociales/CartillaSindical'
import { SITE_URL, OG_IMAGE } from '@/lib/utils'
import { PaginaCentrosOsecac, URL_CARTILLA_OSECAC } from '@/components/obras-sociales/PaginaCentrosOsecac'
import { centrosPorProvincia, totalCentros } from '@/lib/data/osecac-centros'

// "cartilla [obra social]": resumen por provincia de la cartilla oficial
// (Anexo III, Res. SSSalud 2165/21). Solo las sindicales con listado publicado.
export const dynamicParams = false

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  // OSECAC no publica el Anexo III: su cartilla es el buscador público de centros de atención.
  return [...Object.keys(CARTILLAS_SINDICALES), 'osecac'].map((slug) => ({ slug }))
}

function metadataOsecac(): Metadata {
  const n = totalCentros()
  const prov = centrosPorProvincia().grupos.length
  const title = 'Cartilla OSECAC 2026: centros de atención, salud mental y teléfonos'
  const description = `Cartilla de OSECAC: ${n} centros de atención en ${prov} provincias con dirección, teléfono, horario y especialidades, más salud mental y teléfonos oficiales. Fuente: buscador oficial de OSECAC.`
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}${URL_CARTILLA_OSECAC}` },
    keywords: ['cartilla osecac', 'osecac cartilla', 'osecac centros de atencion', 'cartilla medica osecac', 'osecac guardias', 'osecac salud mental', 'osecac prestadores'],
    openGraph: { title, description, type: 'article', images: [OG_IMAGE] },
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (slug === 'osecac') return metadataOsecac()
  const os = osDeCartilla(slug)
  const c = getCartillaSindical(slug)
  if (!os || !c) return {}
  const t = totales(c)
  const title = `Cartilla de ${os.nombre} ${c.vigencia?.slice(-4) ?? '2026'}: sanatorios y guardias por provincia`
  const description = `Cartilla oficial de ${os.nombre}: ${t.internacion} sanatorios con internación, ${t.guardia} guardias y ${t.diagnostico} centros de diagnóstico en ${t.provincias} provincias, con dirección y teléfono. Fuente: Superintendencia de Servicios de Salud.`
  const n = os.nombre.toLowerCase()
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}${urlCartilla(slug)}` },
    keywords: [`cartilla ${n}`, `${n} cartilla`, `cartilla medica ${n}`, `sanatorios ${n}`, `guardia ${n}`, `prestadores ${n}`],
    openGraph: { title, description, type: 'article', images: [OG_IMAGE] },
  }
}

export default async function CartillaSindicalPage({ params }: Props) {
  const { slug } = await params
  if (slug === 'osecac') return <PaginaCentrosOsecac />
  const os = osDeCartilla(slug)
  const c = getCartillaSindical(slug)
  if (!os || !c) notFound()
  return <PaginaCartillaSindical os={os} c={c} />
}
