import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { InformeSueldo } from '@/components/prensa/InformeSueldo'
import { INFORMES_PROVINCIA, MES, calcularSueldos, informeProvincia, millones, millonesLargo, textosInforme } from '@/lib/prensa/sueldo-prepaga'
import { provinciasSEO } from '@/lib/data/zonas'
import { SITE_URL, OG_IMAGE } from '@/lib/utils'

// Versión por provincia del informe (25-sep-2026): los mismos números con el
// cuadro que cada prepaga declara para la región, para los medios de cada
// provincia. Solo provincias con cuadro regional y al menos 4 prepagas.

interface Props {
  params: Promise<{ provincia: string }>
}

export const dynamicParams = false

export async function generateStaticParams() {
  return INFORMES_PROVINCIA.map((p) => ({ provincia: p.slug }))
}

const urlDe = (slug: string) => `${SITE_URL}/prensa/sueldo-para-cubrir-la-prepaga/${slug}`
const PISO_AMBA = calcularSueldos('caba')[0]

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { provincia } = await params
  const p = informeProvincia(provincia)
  if (!p) return {}
  const { titular } = textosInforme(p.filas, p.lugar)
  const titulo = `¿Cuánto hay que ganar ${p.lugar} para que los aportes paguen la prepaga?`
  return {
    title: `${titulo} Informe ${MES}`,
    description: `${p.nombre}: sueldo bruto necesario para que los aportes de obra social cubran el plan de entrada de cada prepaga sin pagar diferencia, desde ${millonesLargo(p.filas[0].sueldo.s30)} a los 30 años. Con los cuadros oficiales de la SSSalud.`,
    alternates: { canonical: urlDe(p.slug) },
    keywords: [`prepaga ${p.nombre.toLowerCase()} aportes`, `cuanto hay que ganar para tener prepaga en ${p.nombre.toLowerCase()}`, `prepaga sin pagar diferencia ${p.nombre.toLowerCase()}`],
    openGraph: { title: titulo, description: titular, url: urlDe(p.slug), type: 'article', images: [OG_IMAGE] },
  }
}

export default async function InformeSueldoProvincia({ params }: Props) {
  const { provincia } = await params
  const p = informeProvincia(provincia)
  if (!p) notFound()
  const piso = p.filas[0]
  const seo = provinciasSEO.find((x) => x.slug === p.slug)
  const otras = INFORMES_PROVINCIA.filter((x) => x.slug !== p.slug)

  return (
    <InformeSueldo
      filas={p.filas}
      lugar={p.lugar}
      region={p.nombre}
      h1={`¿Cuánto hay que ganar ${p.lugar} para que los aportes paguen la prepaga?`}
      url={urlDe(p.slug)}
      migas={[{ nombre: 'Sueldo para cubrir la prepaga', href: '/prensa/sueldo-para-cubrir-la-prepaga' }, { nombre: p.nombre }]}
    >
      {PISO_AMBA && (
        <p className="mt-8 text-sm text-gray-700 leading-relaxed">
          <strong className="text-gray-900">Comparado con el AMBA:</strong>{' '}
          {p.lugar.charAt(0).toUpperCase() + p.lugar.slice(1)}, el piso a los 30 años es de {millones(piso.sueldo.s30)} ({piso.prepaga}){millones(piso.sueldo.s30) === millones(PISO_AMBA.sueldo.s30) ? ', igual que en el AMBA' : `; en el AMBA, de ${millones(PISO_AMBA.sueldo.s30)} (${PISO_AMBA.prepaga})`}.{' '}
          <Link href="/prensa/sueldo-para-cubrir-la-prepaga" className="font-semibold text-[#E8002D] hover:underline">Ver el informe del AMBA y todas las provincias →</Link>
        </p>
      )}
      {seo && (
        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
          <Link href={`/prepagas-en/${seo.slug}`} className="text-sm font-semibold text-[#E8002D] hover:underline">Prepagas en {seo.nombre} →</Link>
          <Link href={`/obras-sociales/provincia/${seo.slug}`} className="text-sm font-semibold text-[#E8002D] hover:underline">Obras sociales en {seo.nombre} →</Link>
        </div>
      )}
      <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">Otras provincias</h2>
      <div className="flex flex-wrap gap-2">
        {otras.map((x) => (
          <Link key={x.slug} href={`/prensa/sueldo-para-cubrir-la-prepaga/${x.slug}`} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-[#E8002D] hover:text-[#E8002D]">
            {x.nombre}
          </Link>
        ))}
      </div>
    </InformeSueldo>
  )
}
