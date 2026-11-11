import type { Metadata } from 'next'
import { elegir } from '@/lib/seo/titulos'
import { notFound } from 'next/navigation'
import { osDeCartilla } from '@/lib/data/sindicales-cartillas/os'
import { CARTILLAS_SINDICALES, contar, getCartillaSindical, getProvinciaCartilla, provinciasConPagina } from '@/lib/data/sindicales-cartillas'
import { PaginaCartillaProvincia, urlCartilla } from '@/components/obras-sociales/CartillaSindical'
import { SITE_URL, OG_IMAGE } from '@/lib/utils'

// "cartilla [obra social] [provincia]": sanatorios, guardias y centros de la
// provincia, agrupados por localidad. Solo provincias con instituciones.
export const dynamicParams = false

interface Props {
  params: Promise<{ slug: string; prov: string }>
}

export function generateStaticParams() {
  return Object.values(CARTILLAS_SINDICALES).flatMap((c) => provinciasConPagina(c).map((p) => ({ slug: c.slug, prov: p.slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, prov } = await params
  const os = osDeCartilla(slug)
  const c = getCartillaSindical(slug)
  const p = c && getProvinciaCartilla(c, prov)
  if (!os || !c || !p) return {}
  const title = elegir([`Cartilla de ${os.nombre} en ${p.nombre}: sanatorios, guardias y centros`, `Cartilla de ${os.nombre} en ${p.nombre}: sanatorios y guardias`, `Cartilla de ${os.nombre} en ${p.nombre}`], 65)
  const internacion = contar(p.instituciones, 'internacion')
  const guardia = contar(p.instituciones, 'guardia')
  const description = `Dónde atiende ${os.nombre} en ${p.nombre}: ${internacion ? `${internacion} sanatorios con internación, ` : ''}${guardia ? `${guardia} guardias y ` : ''}centros de diagnóstico por localidad, con dirección y teléfono. Cartilla oficial presentada ante la SSSalud.`
  const n = os.nombre.toLowerCase()
  const pn = p.nombre.toLowerCase()
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}${urlCartilla(slug, prov)}` },
    keywords: [`cartilla ${n} ${pn}`, `${n} ${pn}`, `sanatorios ${n} ${pn}`, `guardia ${n} ${pn}`],
    openGraph: { title, description, type: 'article', images: [OG_IMAGE] },
  }
}

export default async function CartillaSindicalProvinciaPage({ params }: Props) {
  const { slug, prov } = await params
  const os = osDeCartilla(slug)
  const c = getCartillaSindical(slug)
  const p = c && getProvinciaCartilla(c, prov)
  if (!os || !c || !p) notFound()
  return <PaginaCartillaProvincia os={os} c={c} p={p} />
}
