import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { perfiles } from '@/lib/data/perfiles'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { formatPrecio, SITE_NAME, SITE_URL } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'

interface Props {
  params: Promise<{ perfil: string }>
}

export async function generateStaticParams() {
  return perfiles.map((p) => ({ perfil: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { perfil } = await params
  const perf = perfiles.find((p) => p.slug === perfil)
  if (!perf) return {}
  return {
    title: `${perf.titulo} — ${PRECIO_ACTUALIZADO}`,
    description: perf.metaDescripcion,
    alternates: { canonical: `${SITE_URL}/para/${perfil}` },
    keywords: perf.keywords,
    openGraph: {
      title: perf.titulo,
      description: perf.metaDescripcion,
      type: 'article',
    },
  }
}

export default async function PerfilPage({ params }: Props) {
  const { perfil } = await params
  const perf = perfiles.find((p) => p.slug === perfil)
  if (!perf) notFound()

  const recomendadas = perf.prepagasRecomendadas
    .map((rec) => {
      const prep = prepagas.find((p) => p.slug === rec.slug)
      return prep ? { rec, prep } : null
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  const planes = perf.planesRecomendados
    .map((pr) => {
      const prep = prepagas.find((p) => p.slug === pr.prepagaSlug)
      const plan = prep?.planes.find((pl) => pl.slug === pr.planSlug)
      return prep && plan ? { razon: pr.razon, prep, plan } : null
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => a.plan.precio - b.plan.precio)

  const otrosPerfiles = perfiles.filter((p) => p.slug !== perfil).slice(0, 8)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: perf.titulo,
      description: perf.metaDescripcion,
      url: `${SITE_URL}/para/${perfil}`,
      author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/para/${perfil}` },
      inLanguage: 'es-AR',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Prepagas por perfil', item: `${SITE_URL}/prepagas` },
        { '@type': 'ListItem', position: 3, name: perf.nombre },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: perf.faq.map(({ q, a }) => ({
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
            <Link href="/prepagas" className="hover:text-[#E8002D] transition-colors">Prepagas</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">Para {perf.nombre.toLowerCase()}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-red-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-4xl mx-auto">
          <span className="inline-block text-xs font-semibold text-[#E8002D] bg-red-100 px-3 py-1 rounded-full mb-4">
            Guía por perfil · {PRECIO_ACTUALIZADO}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {perf.titulo} <span className="text-[#E8002D]">2026</span>
          </h1>
          <p className="text-gray-600 leading-relaxed max-w-3xl">{perf.descripcion}</p>
        </div>
      </section>

      {/* Necesidades del perfil */}
      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Qué tiene que cubrir tu prepaga</h2>
          <p className="text-sm text-gray-500 mb-6">Los puntos que más importan para {perf.nombre.toLowerCase()}, según nuestra experiencia asesorando este perfil.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {perf.necesidades.map((n) => (
              <div key={n} className="flex items-start gap-3 bg-gray-50 rounded-xl border border-gray-100 p-4">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700 leading-relaxed">{n}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planes recomendados con precio */}
      {planes.length > 0 && (
        <section className="py-10 bg-gray-50 border-t border-gray-100">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Planes recomendados — {PRECIO_ACTUALIZADO}</h2>
            <p className="text-sm text-gray-500 mb-6">Precio base para persona de 30 años, contratación directa con IVA incluido.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {planes.map(({ prep, plan, razon }, i) => (
                <Link
                  key={`${prep.slug}-${plan.slug}`}
                  href={`/prepagas/${prep.slug}/${plan.slug}`}
                  className={`group relative bg-white rounded-2xl border-2 p-5 hover:shadow-lg transition-all ${
                    i === 0 ? 'border-[#E8002D]' : 'border-gray-200 hover:border-red-200'
                  }`}
                >
                  {i === 0 && (
                    <span className="absolute -top-3 left-5 bg-[#E8002D] text-white text-[10px] font-black px-3 py-1 rounded-full tracking-wide">
                      MEJOR PRECIO
                    </span>
                  )}
                  <div className="flex items-center gap-2.5 mb-3 mt-1">
                    <PrepagaLogo slug={prep.slug} nombre={prep.nombre} colorPrimario={prep.colorPrimario} size="sm" />
                    <div className="min-w-0">
                      <div className="text-xs text-gray-400 leading-none">{prep.nombre}</div>
                      <div className="font-bold text-gray-900 group-hover:text-[#E8002D] transition-colors">{plan.nombre}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#E8002D] tabular-nums">{formatPrecio(plan.precio)}</div>
                  <div className="text-xs text-gray-400 mb-3">/mes</div>
                  <p className="text-xs text-gray-500 leading-relaxed">{razon}</p>
                  <div className="mt-3 text-xs font-bold text-[#E8002D]">Ver cobertura completa →</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mid CTA */}
      <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] py-5">
        <div className="container max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 px-4">
          <div>
            <div className="text-white font-bold text-sm">¿Cuánto pagarías vos exactamente?</div>
            <div className="text-red-200 text-xs">El precio cambia según tu edad y situación laboral. Cotizá gratis en 2 minutos.</div>
          </div>
          <Link
            href="/comparador"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#E8002D] font-bold rounded-xl text-sm hover:bg-red-50 transition-colors shadow-sm"
          >
            Cotizar mi precio →
          </Link>
        </div>
      </div>

      {/* Prepagas recomendadas */}
      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Las mejores prepagas para {perf.nombre.toLowerCase()}</h2>
          <div className="space-y-4">
            {recomendadas.map(({ rec, prep }, i) => {
              const planBase = [...prep.planes].sort((a, b) => a.precio - b.precio)[0]
              return (
                <div key={prep.slug} className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-red-200 hover:shadow-sm transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3 sm:w-52 flex-shrink-0">
                      <span className="w-7 h-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-xs font-bold text-[#E8002D] flex-shrink-0">
                        {i + 1}
                      </span>
                      <PrepagaLogo slug={prep.slug} nombre={prep.nombre} colorPrimario={prep.colorPrimario} size="md" />
                      <div className="min-w-0">
                        <Link href={`/prepagas/${prep.slug}`} className="font-bold text-gray-900 hover:text-[#E8002D] transition-colors block leading-tight">
                          {prep.nombre}
                        </Link>
                        <div className="text-xs text-gray-400">desde {formatPrecio(planBase.precio)}/mes</div>
                      </div>
                    </div>
                    <p className="flex-1 text-sm text-gray-600 leading-relaxed">{rec.razon}</p>
                    <Link
                      href={`/prepagas/${prep.slug}`}
                      className="flex-shrink-0 text-xs font-bold text-[#E8002D] hover:underline"
                    >
                      Ver planes →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
          <div className="space-y-2">
            {perf.faq.map(({ q, a }) => (
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

      {/* Otros perfiles */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Guías para otros perfiles</h2>
          <div className="flex flex-wrap gap-2">
            {otrosPerfiles.map((p) => (
              <Link
                key={p.slug}
                href={`/para/${p.slug}`}
                className="text-xs px-3 py-1.5 bg-red-50 text-[#B8001F] border border-red-100 rounded-full hover:bg-red-100 transition-colors font-medium"
              >
                {p.nombre} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-12 bg-[#E8002D] text-white">
        <div className="container max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Encontrá tu prepaga ideal</h2>
          <p className="text-red-200 text-sm mb-6">
            Compará precios reales de {PRECIO_ACTUALIZADO} para tu perfil. Gratis, sin registro y sin DNI.
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
