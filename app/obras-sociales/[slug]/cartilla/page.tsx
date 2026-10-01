import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { osDeCartilla } from '@/lib/data/sindicales-cartillas/os'
import { CARTILLAS_SINDICALES, getCartillaSindical, totales } from '@/lib/data/sindicales-cartillas'
import { PaginaCartillaSindical, urlCartilla } from '@/components/obras-sociales/CartillaSindical'
import { SITE_URL, OG_IMAGE } from '@/lib/utils'

// "cartilla [obra social]": resumen por provincia de la cartilla oficial
// (Anexo III, Res. SSSalud 2165/21). Solo las sindicales con listado publicado.
export const dynamicParams = false

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return Object.keys(CARTILLAS_SINDICALES).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
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
  const os = osDeCartilla(slug)
  const c = getCartillaSindical(slug)
  if (!os || !c) notFound()
  return <PaginaCartillaSindical os={os} c={c} />
}
