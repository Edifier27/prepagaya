import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { condiciones } from '@/lib/data/condiciones'
import { coberturas } from '@/lib/data/coberturas'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { formatPrecio, SITE_NAME, SITE_URL } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'
import { CondicionIcon, CoberturaIcon } from '@/components/ui/CategoryIcon'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return condiciones.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cond = condiciones.find((c) => c.slug === slug)
  if (!cond) return {}
  return {
    title: cond.titulo,
    description: cond.metaDescripcion,
    alternates: { canonical: `${SITE_URL}/condiciones/${slug}` },
    keywords: cond.keywords,
    openGraph: {
      title: cond.titulo,
      description: cond.metaDescripcion,
      type: 'article',
    },
  }
}

export default async function CondicionPage({ params }: Props) {
  const { slug } = await params
  const cond = condiciones.find((c) => c.slug === slug)
  if (!cond) notFound()

  const recomendadas = cond.prepagasRecomendadas
    .map((rec) => {
      const prep = prepagas.find((p) => p.slug === rec.slug)
      if (!prep) return null
      const plan = rec.planSlug ? prep.planes.find((pl) => pl.slug === rec.planSlug) : undefined
      return { rec, prep, plan }
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  const coberturasRel = cond.coberturasRelacionadas
    .map((s) => coberturas.find((c) => c.slug === s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))

  const otrasCondiciones = condiciones.filter((c) => c.slug !== slug).slice(0, 6)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: cond.titulo,
      description: cond.metaDescripcion,
      url: `${SITE_URL}/condiciones/${slug}`,
      author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/condiciones/${slug}` },
      inLanguage: 'es-AR',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Prepagas por condición', item: `${SITE_URL}/condiciones` },
        { '@type': 'ListItem', position: 3, name: cond.nombre },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: cond.faq.map(({ q, a }) => ({
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
            <Link href="/condiciones" className="hover:text-[#E8002D] transition-colors">Por condición</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">{cond.nombre}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <CondicionIcon slug={cond.slug} size="lg" />
            <span className="text-xs font-semibold text-[#00875A] bg-green-100 px-3 py-1 rounded-full">
              Guía por condición de salud · {PRECIO_ACTUALIZADO}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{cond.titulo}</h1>
          <p className="text-gray-600 leading-relaxed max-w-3xl">{cond.intro}</p>
        </div>
      </section>

      {/* Qué cubre el PMO */}
      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-500 flex-shrink-0">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Qué te cubre cualquier prepaga por ley
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">{cond.queCubreElPMO}</p>
          </div>
        </div>
      </section>

      {/* Prepagas recomendadas */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Las mejores prepagas para {cond.nombre.toLowerCase()}</h2>
          <p className="text-sm text-gray-500 mb-6">Análisis basado en cobertura real, red de especialistas y experiencia de afiliados.</p>
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
        </div>
      </section>

      {/* Mid CTA */}
      <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] py-5">
        <div className="container max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 px-4">
          <div>
            <div className="text-white font-bold text-sm">¿Tenés {cond.nombre.toLowerCase()} y querés cambiar de cobertura?</div>
            <div className="text-red-200 text-xs">Cotizá gratis y compará qué prepaga te conviene según tu situación.</div>
          </div>
          <Link
            href="/comparador"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#E8002D] font-bold rounded-xl text-sm hover:bg-red-50 transition-colors shadow-sm"
          >
            Cotizar mi precio →
          </Link>
        </div>
      </div>

      {/* Preguntas antes de firmar */}
      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Qué preguntar antes de afiliarte</h2>
          <p className="text-sm text-gray-500 mb-6">Hacé estas preguntas por escrito antes de firmar: te evitan sorpresas después.</p>
          <ul className="space-y-3">
            {cond.preguntasAntesDeFirmar.map((preg) => (
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
            {cond.faq.map(({ q, a }) => (
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

      {/* Coberturas relacionadas + otras condiciones */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          {coberturasRel.length > 0 && (
            <>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Coberturas relacionadas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                {coberturasRel.map((c) => (
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
            </>
          )}
          <h2 className="text-lg font-bold text-gray-900 mb-4">Guías para otras condiciones</h2>
          <div className="flex flex-wrap gap-2">
            {otrasCondiciones.map((c) => (
              <Link
                key={c.slug}
                href={`/condiciones/${c.slug}`}
                className="text-xs px-3 py-1.5 bg-green-50 text-green-700 border border-green-100 rounded-full hover:bg-green-100 transition-colors font-medium"
              >
                {c.nombre} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-12 bg-[#E8002D] text-white">
        <div className="container max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Encontrá tu prepaga ideal con {cond.nombre.toLowerCase()}</h2>
          <p className="text-red-200 text-sm mb-6">
            Compará precios reales y cobertura específica para tu condición. Gratis, sin registro y sin DNI.
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
