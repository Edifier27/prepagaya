import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProvinciaSEO, provinciasSEO } from '@/lib/data/zonas'
import { LocalidadPrepagaPage, localidadPrepagaMetadata } from '@/components/seo-local/LocalidadPrepagaPage'

interface Props {
  params: Promise<{ slug: string; plan: string; extra: string }>
}

// /prepagas/[provincia]/[localidad]/[prepaga] — silo SEO local, un nivel más
// específico que /prepagas/[provincia]/[prepaga]. Pedido de Darío,
// 14-sep-2026: cruzar prepaga × localidad para captar búsquedas tipo
// "cartilla swiss medical bahía blanca", siempre con datos ya verificados
// (nada scrapeado ni inventado — ver comentario en LocalidadPrepagaPage.tsx).
export async function generateStaticParams() {
  return provinciasSEO.flatMap((prov) =>
    prov.localidades.flatMap((loc) =>
      prov.prepagas
        .filter((pz) => pz.enSitio)
        .map((pz) => ({ slug: prov.slug, plan: loc.slug, extra: pz.slug }))
    )
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, plan, extra } = await params
  const prov = getProvinciaSEO(slug)
  if (!prov) return {}
  const loc = prov.localidades.find((l) => l.slug === plan)
  const pz = prov.prepagas.find((p) => p.slug === extra && p.enSitio)
  if (!loc || !pz) return {}
  return localidadPrepagaMetadata(prov, loc, pz)
}

export default async function LocalidadPrepagaRoute({ params }: Props) {
  const { slug, plan, extra } = await params
  const prov = getProvinciaSEO(slug)
  if (!prov) notFound()
  const loc = prov.localidades.find((l) => l.slug === plan)
  const pz = prov.prepagas.find((p) => p.slug === extra && p.enSitio)
  if (!loc || !pz) notFound()
  return <LocalidadPrepagaPage prov={prov} loc={loc} pz={pz} />
}
