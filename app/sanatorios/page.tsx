import type { Metadata } from 'next'
import Link from 'next/link'
import { prepagasEnSanatorio, sanatoriosPublicables } from '@/lib/data/sanatorios-seo'
import { SITE_NAME, SITE_URL } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Qué prepagas atienden en cada sanatorio de CABA y GBA',
  description: 'Hospital Italiano, Alemán, Británico, Austral, FLENI y más: qué prepagas los tienen en cartilla y desde qué plan, según las cartillas oficiales.',
  alternates: { canonical: `${SITE_URL}/sanatorios` },
}

export default function SanatoriosPage() {
  const lista = sanatoriosPublicables()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Qué prepagas atienden en cada sanatorio de CABA y GBA',
    itemListElement: lista.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.nombre, url: `${SITE_URL}/sanatorios/${s.slug}` })),
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-[#E8002D] transition-colors">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">Sanatorios</span>
          </nav>
        </div>
      </div>
      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">Qué prepagas atienden en cada sanatorio</h1>
          <p className="text-gray-600 max-w-2xl mb-8">
            Elegí el sanatorio o el hospital que querés tener y te mostramos qué prepagas lo incluyen y desde qué plan, según sus cartillas oficiales de CABA y GBA.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lista.map((s) => {
              const n = prepagasEnSanatorio(s.slug).length
              return (
                <Link key={s.slug} href={`/sanatorios/${s.slug}`} className="group rounded-xl border border-gray-200 hover:border-[#E8002D]/40 p-4 transition-colors">
                  <div className="font-semibold text-gray-900 group-hover:text-[#E8002D]">{s.nombre}</div>
                  <div className="text-xs text-gray-500 mt-0.5">En {n} cartillas oficiales relevadas</div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
