import type { Metadata } from 'next'
import { PaginaHubComplementaria, TITULO_HUB } from '@/components/obras-sociales/PrepagaComplementaria'
import { OS_COMPLEMENTARIA, URL_HUB_COMPLEMENTARIA, datosComplementaria, desdeMinimo } from '@/lib/data/prepaga-complementaria'
import { SITE_URL, OG_IMAGE } from '@/lib/utils'

// Hub de "prepaga complementaria" (18-oct-2026): afiliados a obras sociales
// provinciales y de las Fuerzas, que no pueden derivar aportes.
const items = OS_COMPLEMENTARIA.flatMap((slug) => {
  const d = datosComplementaria(slug)
  return d ? [{ d, desde: desdeMinimo(d.opciones) }] : []
})

const description = 'Si tenés IOMA, APROSS, IAPOS, OSEP u otra obra social provincial, no podés pasar tus aportes, pero sí sumar una prepaga aparte. Qué prepagas tienen red en tu provincia y cuánto cuestan.'

export const metadata: Metadata = {
  title: TITULO_HUB,
  description,
  alternates: { canonical: `${SITE_URL}${URL_HUB_COMPLEMENTARIA}` },
  keywords: ['prepaga complementaria', 'complementar obra social con prepaga', 'obra social provincial y prepaga', 'tener obra social y prepaga', 'prepaga para empleados publicos', 'prepaga para docentes', 'prepaga complementaria ioma'],
  openGraph: { title: TITULO_HUB, description, type: 'article', images: [OG_IMAGE] },
}

export default function PrepagaComplementariaHubPage() {
  return <PaginaHubComplementaria items={items} />
}
