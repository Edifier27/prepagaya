import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { coberturas } from '@/lib/data/coberturas'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { formatPrecio, SITE_NAME, SITE_URL } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'
import { CoberturaIcon } from '@/components/ui/CategoryIcon'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return coberturas.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cob = coberturas.find((c) => c.slug === slug)
  if (!cob) return {}
  return {
    title: cob.titulo,
    description: cob.metaDescripcion,
    alternates: { canonical: `${SITE_URL}/coberturas/${slug}` },
    keywords: cob.keywords,
    openGraph: {
      title: cob.titulo,
      description: cob.metaDescripcion,
      type: 'article',
    },
  }
}

export default async function CoberturaPage({ params }: Props) {
  const { slug } = await params
  const cob = coberturas.find((c) => c.slug === slug)
  if (!cob) notFound()

  const recomendadas = cob.prepagasRecomendadas
    .map((rec) => {
      const prep = prepagas.find((p) => p.slug === rec.slug)
      if (!prep) return null
      const plan = rec.planSlug ? prep.planes.find((pl) => pl.slug === rec.planSlug) : undefined
      return { rec, prep, plan }
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  const restrictivas = cob.prepagasRestrictivas
    .map((r) => {
      const prep = prepagas.find((p) => p.slug === r.slug)
      return prep ? { detalle: r.detalle, prep } : null
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  const relacionadas = cob.relacionadas
    .map((s) => coberturas.find((c) => c.slug === s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: cob.titulo,
      description: cob.metaDescripcion,
      url: `${SITE_URL}/coberturas/${slug}`,
      author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/coberturas/${slug}` },
      inLanguage: 'es-AR',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Coberturas', item: `${SITE_URL}/coberturas` },
        { '@type': 'ListItem', position: 3, name: cob.nombre },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: cob.faq.map(({ q, a }) => ({
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
            <Link href="/coberturas" className="hover:text-[#E8002D] transition-colors">Coberturas</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">{cob.nombre}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <CoberturaIcon slug={cob.slug} size="lg" />
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Guía de cobertura · {PRECIO_ACTUALIZADO}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{cob.titulo}</h1>
          <p className="text-gray-600 leading-relaxed max-w-3xl">{cob.intro}</p>
        </div>
      </section>

      {/* Qué establece la ley */}
      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-500 flex-shrink-0">
                <path fillRule="evenodd" d="M10 1L3 5v6c0 5.55 3.84 10.74 7 12 3.16-1.26 7-6.45 7-12V5l-7-4z" clipRule="evenodd" />
              </svg>
              Qué establece la ley
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">{cob.queEstableceLaLey}</p>
          </div>
        </div>
      </section>

      {/* Prepagas recomendadas */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Prepagas con mejor cobertura de {cob.nombre.toLowerCase()}</h2>
          <p className="text-sm text-gray-500 mb-6">Ordenadas por calidad de cobertura real, no solo por lo que promete el contrato.</p>
          <div className="space-y-4">
            {recomendadas.map(({ rec, prep, plan }, i) => (
              <div key={prep.slug} className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-red-200 hover:shadow-sm transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex items-center gap-3 sm:w-48 flex-shrink-0">
                    <span className="w-7 h-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-xs font-bold text-[#E8002D] flex-shrink-0">
                      {i + 1}
                    </span>
                    <PrepagaLogo slug={prep.slug} nombre={prep.nombre} colorPrimario={prep.colorPrimario} size="md" />
                    <div className="min-w-0">
                      <Link href={`/prepagas/${prep.slug}`} className="font-bold text-gray-900 hover:text-[#E8002D] transition-colors block leading-tight">
                        {prep.nombre}
                      </Link>
                      <div className="text-xs text-gray-400">{prep.satisfaccion}% satisfacción</div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 leading-relaxed">{rec.razon}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      {plan && (
                        <Link
                          href={`/prepagas/${prep.slug}/${plan.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8002D] bg-red-50 border border-red-100 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors"
                        >
                          Plan {plan.nombre} · {formatPrecio(plan.precio)}/mes →
                        </Link>
                      )}
                      <Link href={`/prepagas/${prep.slug}`} className="text-xs font-semibold text-gray-500 hover:text-[#E8002D] transition-colors">
                        Ver todos los planes →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Restrictivas */}
          {restrictivas.length > 0 && (
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-2">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-500 flex-shrink-0">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Prepagas con cobertura más limitada en esta área
              </h3>
              <ul className="space-y-2">
                {restrictivas.map(({ prep, detalle }) => (
                  <li key={prep.slug} className="text-sm text-amber-900">
                    <Link href={`/prepagas/${prep.slug}`} className="font-semibold underline hover:text-amber-700">{prep.nombre}</Link>
                    {': '}{detalle}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Mid CTA */}
      <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] py-5">
        <div className="container max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 px-4">
          <div>
            <div className="text-white font-bold text-sm">¿Buscás la mejor cobertura de {cob.nombre.toLowerCase()}?</div>
            <div className="text-red-200 text-xs">Compará precios y coberturas reales en 2 minutos, gratis.</div>
          </div>
          <Link
            href="/comparador"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#E8002D] font-bold rounded-xl text-sm hover:bg-red-50 transition-colors shadow-sm"
          >
            Cotizar mi precio →
          </Link>
        </div>
      </div>

      {/* Qué preguntar */}
      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Qué preguntar antes de contratar</h2>
          <p className="text-sm text-gray-500 mb-6">Pedí estas respuestas por escrito: lo que no está por escrito, no existe.</p>
          <ul className="space-y-3">
            {cob.quePreguntar.map((preg) => (
              <li key={preg} className="flex items-start gap-3 bg-gray-50 rounded-xl border border-gray-100 p-4">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[#E8002D] flex-shrink-0 mt-0.5">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700 leading-relaxed">{preg}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
          <div className="space-y-2">
            {cob.faq.map(({ q, a }) => (
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

      {/* Relacionadas */}
      {relacionadas.length > 0 && (
        <section className="py-10 bg-white border-t border-gray-100">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Otras coberturas que te pueden interesar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relacionadas.map((c) => (
                <Link
                  key={c.slug}
                  href={`/coberturas/${c.slug}`}
                  className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all group"
                >
                  <CoberturaIcon slug={c.slug} size="sm" />
                  <span className="text-xs font-medium text-gray-700 group-hover:text-[#E8002D] leading-tight">{c.nombre}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="py-12 bg-[#E8002D] text-white">
        <div className="container max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Compará la cobertura de {cob.nombre.toLowerCase()} entre prepagas</h2>
          <p className="text-red-200 text-sm mb-6">
            Precios reales de {PRECIO_ACTUALIZADO}, sin registro y sin DNI. Encontrá el plan que mejor te cubre.
          </p>
          <Link
            href="/comparador"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E8002D] font-bold rounded-2xl hover:bg-red-50 transition-all shadow-lg text-sm"
          >
            Comparar prepagas gratis →
          </Link>
        </div>
      </section>
    </>
  )
}
