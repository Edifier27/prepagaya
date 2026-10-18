import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PaginaPrepagaComplementaria, tituloComplementaria } from '@/components/obras-sociales/PrepagaComplementaria'
import { OS_COMPLEMENTARIA, datosComplementaria, desdeMinimo, urlComplementaria } from '@/lib/data/prepaga-complementaria'
import { SITE_URL, OG_IMAGE, formatPrecio } from '@/lib/utils'

// "prepaga para afiliados a IOMA", "IOMA y prepaga al mismo tiempo" y lo mismo
// con cada obra social provincial (keyword research 18-oct-2026).
export const dynamicParams = false

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return OS_COMPLEMENTARIA.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const d = datosComplementaria(slug)
  if (!d) return {}
  const n = d.os.nombre
  const min = desdeMinimo(d.opciones)
  const title = tituloComplementaria(d)
  const description = `¿Tenés ${n}? Podés sumar una prepaga sin dejarla: tus aportes no se pasan, la prepaga se paga aparte${min ? ` desde ${formatPrecio(min.desde!.plan.precio)}/mes` : ''}. Qué prepagas tienen red${d.provincia ? ` en ${d.provincia.nombre}` : ''} y cómo pagar menos.`
  const k = n.toLowerCase()
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}${urlComplementaria(slug)}` },
    keywords: [`prepaga para afiliados ${k}`, `${k} y prepaga`, `${k} y prepaga al mismo tiempo`, `prepaga complementaria ${k}`, `alternativa a ${k}`, `dejar ${k}`, `${k} derivar aportes`],
    openGraph: { title, description, type: 'article', images: [OG_IMAGE] },
  }
}

export default async function PrepagaComplementariaPage({ params }: Props) {
  const { slug } = await params
  const d = datosComplementaria(slug)
  if (!d) notFound()
  return <PaginaPrepagaComplementaria d={d} />
}
