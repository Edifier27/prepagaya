import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cambiosRecomendados, getCambioBySlug } from '@/lib/data/cambios'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { formatPrecio, SITE_NAME, SITE_URL } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return cambiosRecomendados.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const c = getCambioBySlug(slug)
  if (!c) return {}
  return {
    title: `De ${c.origenNombre} a ${c.destinoNombre}: ¿conviene cambiarse? ${PRECIO_ACTUALIZADO}`,
    description: `${c.gancho}. ${c.origenPlanNombre} de ${c.origenNombre} ($${c.origenPrecio.toLocaleString('es-AR')}) vs ${c.destinoPlanNombre} de ${c.destinoNombre} ($${c.destinoPrecio.toLocaleString('es-AR')}). Precios reales, sin estimaciones.`,
    alternates: { canonical: `${SITE_URL}/cambios/${slug}` },
    keywords: [`cambiar de ${c.origenNombre.toLowerCase()} a ${c.destinoNombre.toLowerCase()}`, `${c.origenNombre.toLowerCase()} o ${c.destinoNombre.toLowerCase()}`, `pasar de ${c.origenNombre.toLowerCase()} a ${c.destinoNombre.toLowerCase()}`],
  }
}

export default async function CambioPage({ params }: Props) {
  const { slug } = await params
  const c = getCambioBySlug(slug)
  if (!c) notFound()

  const origen = prepagas.find((p) => p.slug === c.origenSlug)
  const destino = prepagas.find((p) => p.slug === c.destinoSlug)
  if (!origen || !destino) notFound()

  const ahorra = c.deltaMensual > 0
  const otrosCambios = cambiosRecomendados.filter((x) => x.slug !== c.slug).slice(0, 3)

  const faqs = [
    {
      q: `¿Cuánto ahorro cambiando de ${c.origenNombre} a ${c.destinoNombre}?`,
      a: ahorra
        ? `${formatPrecio(c.deltaMensual)} por mes, comparando el ${c.origenPlanNombre} de ${c.origenNombre} ($${c.origenPrecio.toLocaleString('es-AR')}) contra el ${c.destinoPlanNombre} de ${c.destinoNombre} ($${c.destinoPrecio.toLocaleString('es-AR')}), precios de lista para una persona de 30 años.`
        : `No hay ahorro en este caso: el ${c.destinoPlanNombre} de ${c.destinoNombre} cuesta ${formatPrecio(Math.abs(c.deltaMensual))} más por mes que el ${c.origenPlanNombre} de ${c.origenNombre}. Lo que ganás es cartilla, no precio.`,
    },
    {
      q: `¿Pierdo cobertura si cambio de ${c.origenNombre} a ${c.destinoNombre}?`,
      a: 'Por ley (26.682), las prestaciones del Programa Médico Obligatorio no tienen período de carencia al cambiar de prepaga: consultas, estudios, internación, parto y urgencias te cubren desde el primer día. Lo que puede tener carencia son las prestaciones superadoras (por ejemplo habitación individual u ortodoncia en adultos).',
    },
    {
      q: `¿Cómo hago el cambio?`,
      a: `Primero contratá la nueva y confirmá la fecha de alta, después pedí la baja de la anterior antes del cierre de facturación del mes. Así no quedás sin cobertura ni pagás dos cuotas el mismo mes.`,
    },
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `De ${c.origenNombre} a ${c.destinoNombre}: ¿conviene cambiarse?`,
      description: c.gancho,
      url: `${SITE_URL}/cambios/${slug}`,
      author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/cambios/${slug}` },
      inLanguage: 'es-AR',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'A qué prepaga cambiarse', item: `${SITE_URL}/cambios` },
        { '@type': 'ListItem', position: 3, name: `${c.origenNombre} → ${c.destinoNombre}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
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
            <Link href="/cambios" className="hover:text-[#E8002D] transition-colors">A qué prepaga cambiarse</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">{origen.nombre} → {destino.nombre}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 border-b border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex flex-col items-center gap-2">
              <PrepagaLogo slug={origen.slug} nombre={origen.nombre} colorPrimario={origen.colorPrimario} size="md" />
              <span className="text-xs text-gray-400 font-medium">Hoy</span>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-6 h-6 text-gray-300">
              <path d="M5 12h14m-6-6l6 6-6 6"/>
            </svg>
            <div className="flex flex-col items-center gap-2">
              <PrepagaLogo slug={destino.slug} nombre={destino.nombre} colorPrimario={destino.colorPrimario} size="md" />
              <span className="text-xs text-[#E8002D] font-bold">Recomendado</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center leading-tight">
            De {origen.nombre} a {destino.nombre}: {c.gancho}
          </h1>
          <p className="text-gray-500 text-base text-center max-w-2xl mx-auto">{c.razon}</p>
        </div>
      </section>

      {/* Comparación de precios */}
      <section className="py-10 bg-white">
        <div className="container max-w-3xl mx-auto">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 text-center">
              <div className="text-xs text-gray-400 mb-1">{origen.nombre} — {c.origenPlanNombre}</div>
              <div className="text-2xl font-black text-gray-700 tabular-nums">{formatPrecio(c.origenPrecio)}</div>
              <div className="text-xs text-gray-400">/mes · 30 años</div>
            </div>
            <div className="bg-red-50 rounded-2xl border-2 border-[#E8002D] p-5 text-center">
              <div className="text-xs text-[#E8002D] font-semibold mb-1">{destino.nombre} — {c.destinoPlanNombre}</div>
              <div className="text-2xl font-black text-[#E8002D] tabular-nums">{formatPrecio(c.destinoPrecio)}</div>
              <div className="text-xs text-gray-400">/mes · 30 años</div>
            </div>
          </div>
          <div className={`text-center rounded-2xl p-5 mb-8 ${ahorra ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
            <div className={`text-2xl font-black ${ahorra ? 'text-emerald-700' : 'text-amber-700'}`}>
              {ahorra ? `Ahorrás ${formatPrecio(Math.abs(c.deltaMensual))}/mes` : `Pagás ${formatPrecio(Math.abs(c.deltaMensual))} más por mes`}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {ahorra ? 'Cambiándote, con cobertura equivalente o mejor.' : 'Pero con una cartilla notablemente más grande.'}
            </p>
          </div>

          {/* Cuándo no conviene */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-2">¿Cuándo NO conviene este cambio?</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{c.paraQuienNo}</p>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] rounded-2xl p-7 text-white text-center mb-10">
            <h2 className="text-xl font-bold mb-2">Cotizá {destino.nombre} para tu edad exacta</h2>
            <p className="text-red-100 text-sm mb-5">El precio de lista es para 30 años. Cotizá gratis y sin DNI para ver tu valor real.</p>
            <Link
              href={`/comparador?zona=caba`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#E8002D] font-bold rounded-xl text-sm hover:bg-red-50 transition-colors"
            >
              Cotizar {destino.nombre} →
            </Link>
          </div>

          {/* FAQ */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
            <div className="space-y-2">
              {faqs.map(({ q, a }) => (
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

          {/* Otros cambios */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Otros cambios que analizamos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {otrosCambios.map((x) => (
                <Link key={x.slug} href={`/cambios/${x.slug}`}
                  className="p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all group">
                  <div className="font-semibold text-sm text-gray-900 group-hover:text-[#E8002D] transition-colors">{x.origenNombre} → {x.destinoNombre}</div>
                  <div className="text-xs text-gray-400 mt-1">{x.gancho}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
