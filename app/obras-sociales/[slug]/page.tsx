import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { obrasSociales } from '@/lib/data/obras-sociales'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { ObraSocialIcon } from '@/components/ui/CategoryIcon'

interface Props {
  params: Promise<{ slug: string }>
}

const tiposLabels: Record<string, string> = {
  sindical: 'Sindical / Nacional',
  provincial: 'Provincial',
  estatal: 'Estatal',
  jubilados: 'Jubilados y pensionados',
  empresarial: 'Empresarial',
}

export async function generateStaticParams() {
  return obrasSociales.map((os) => ({ slug: os.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const os = obrasSociales.find((o) => o.slug === slug)
  if (!os) return {}
  return {
    title: os.titulo,
    description: os.metaDescripcion,
    alternates: { canonical: `${SITE_URL}/obras-sociales/${slug}` },
    keywords: os.keywords,
    openGraph: {
      title: os.titulo,
      description: os.metaDescripcion,
      type: 'article',
    },
  }
}

export default async function ObraSocialPage({ params }: Props) {
  const { slug } = await params
  const os = obrasSociales.find((o) => o.slug === slug)
  if (!os) notFound()

  const otras = obrasSociales.filter((o) => o.slug !== slug).slice(0, 8)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: os.titulo,
      description: os.metaDescripcion,
      url: `${SITE_URL}/obras-sociales/${slug}`,
      author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/obras-sociales/${slug}` },
      inLanguage: 'es-AR',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Obras Sociales', item: `${SITE_URL}/obras-sociales` },
        { '@type': 'ListItem', position: 3, name: os.nombre },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: os.faq.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-[#E8002D] transition-colors">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <Link href="/obras-sociales" className="hover:text-[#E8002D] transition-colors">Obras Sociales</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">{os.nombre}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <ObraSocialIcon slug={os.slug} size="lg" />
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {tiposLabels[os.tipo] ?? os.tipo}
              </span>
              {os.derivacion && (
                <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                  Acepta derivación de aportes
                </span>
              )}
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{os.titulo}</h1>
          <p className="text-gray-600 leading-relaxed max-w-3xl mb-6">{os.intro}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg">
            {typeof os.beneficiarios === 'number' && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
                <div className="text-lg font-bold text-[#E8002D]">
                  {os.beneficiarios >= 1000000
                    ? `${(os.beneficiarios / 1000000).toLocaleString('es-AR', { maximumFractionDigits: 1 })}M`
                    : `${Math.round(os.beneficiarios / 1000)}k`}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Beneficiarios</div>
              </div>
            )}
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
              <div className="text-lg font-bold text-[#E8002D]">{os.derivacion ? 'Sí' : 'No'}</div>
              <div className="text-xs text-gray-500 mt-0.5">Derivación</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm col-span-2 sm:col-span-1">
              <div className="text-lg font-bold text-[#E8002D]">{tiposLabels[os.tipo]?.split(' ')[0] ?? os.tipo}</div>
              <div className="text-xs text-gray-500 mt-0.5">Tipo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiénes pueden afiliarse */}
      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quiénes pueden afiliarse</h2>
          <ul className="space-y-3">
            {os.quienesPuedenAfiliarse.map((item) => (
              <li key={item} className="flex items-start gap-3 bg-gray-50 rounded-xl border border-gray-100 p-4">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Aportes */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Cuánto se aporta</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Trabajador</div>
              <div className="text-sm font-semibold text-gray-900">{os.aportes.trabajador}</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Empleador</div>
              <div className="text-sm font-semibold text-gray-900">{os.aportes.empleador}</div>
            </div>
            {os.aportes.monotributista && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Monotributista</div>
                <div className="text-sm font-semibold text-gray-900">{os.aportes.monotributista}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cobertura y diferenciadores */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Qué cubre {os.nombre}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {os.cobertura.map((c) => (
              <div key={c} className="flex items-start gap-2.5 p-3 rounded-xl border border-green-100 bg-green-50 text-sm text-green-900">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {c}
              </div>
            ))}
          </div>
          {os.diferenciadores.length > 0 && (
            <>
              <h3 className="text-sm font-bold text-gray-900 mb-3">Qué la diferencia</h3>
              <div className="flex flex-wrap gap-2">
                {os.diferenciadores.map((d) => (
                  <span key={d} className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full font-medium">
                    {d}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Mid CTA */}
      <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] py-5">
        <div className="container max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 px-4">
          <div>
            <div className="text-white font-bold text-sm">¿Te conviene {os.nombre} o una prepaga?</div>
            <div className="text-red-200 text-xs">Compará precios y coberturas reales antes de decidir. Gratis y sin registro.</div>
          </div>
          <Link
            href="/comparador"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#E8002D] font-bold rounded-xl text-sm hover:bg-red-50 transition-colors shadow-sm"
          >
            Comparar opciones →
          </Link>
        </div>
      </div>

      {/* Pros y contras */}
      <section className="py-10 bg-gray-50">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{os.nombre}: pros y contras</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-green-100 p-6">
              <h3 className="font-bold text-green-700 mb-4 flex items-center gap-2 text-sm">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Ventajas
              </h3>
              <ul className="space-y-2.5">
                {os.pros.map((pro) => (
                  <li key={pro} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-red-100 p-6">
              <h3 className="font-bold text-red-700 mb-4 flex items-center gap-2 text-sm">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-400">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Desventajas
              </h3>
              <ul className="space-y-2.5">
                {os.contras.map((contra) => (
                  <li key={contra} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {contra}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes sobre {os.nombre}</h2>
          <div className="space-y-2">
            {os.faq.map(({ q, a }) => (
              <details key={q} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-sm text-gray-900 select-none list-none">
                  {q}
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Otras obras sociales */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Otras obras sociales</h2>
          <div className="flex flex-wrap gap-2">
            {otras.map((o) => (
              <Link
                key={o.slug}
                href={`/obras-sociales/${o.slug}`}
                className="text-xs px-3 py-1.5 bg-white text-gray-700 border border-gray-200 rounded-full hover:border-red-200 hover:text-[#E8002D] transition-colors font-medium"
              >
                {o.nombre} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-12 bg-[#E8002D] text-white">
        <div className="container max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Compará {os.nombre} con las prepagas del mercado</h2>
          <p className="text-red-200 text-sm mb-6">
            Precios reales actualizados, sin registro y sin DNI. Decidí con toda la información.
          </p>
          <Link
            href="/comparador"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E8002D] font-bold rounded-2xl hover:bg-red-50 transition-all shadow-lg text-sm"
          >
            Comparar gratis →
          </Link>
        </div>
      </section>
    </>
  )
}
