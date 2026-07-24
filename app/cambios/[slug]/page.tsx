import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cambiosRecomendados, getCambioBySlug, getCambiosPorDestino } from '@/lib/data/cambios'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { testimonios } from '@/lib/data/testimonios'
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
  const ahorra = c.deltaMensual > 0
  const resumenPrecio = ahorra
    ? `Ahorrás ${formatPrecio(c.deltaMensual)}/mes`
    : `${formatPrecio(Math.abs(c.deltaMensual))}/mes más, con mucha más cartilla`
  return {
    title: `De ${c.origenNombre} a ${c.destinoNombre}: ¿conviene cambiarse? ${PRECIO_ACTUALIZADO}`,
    description: `${resumenPrecio}. Comparamos ${c.origenPlanNombre} de ${c.origenNombre} ($${c.origenPrecio.toLocaleString('es-AR')}) vs ${c.destinoPlanNombre} de ${c.destinoNombre} ($${c.destinoPrecio.toLocaleString('es-AR')}) con precios reales, sanatorios y cuándo NO conviene cambiarte.`,
    alternates: { canonical: `${SITE_URL}/cambios/${slug}` },
    keywords: [
      `cambiar de ${c.origenNombre.toLowerCase()} a ${c.destinoNombre.toLowerCase()}`,
      `pasar de ${c.origenNombre.toLowerCase()} a ${c.destinoNombre.toLowerCase()}`,
      `diferencia entre ${c.origenNombre.toLowerCase()} y ${c.destinoNombre.toLowerCase()}`,
      `${c.origenNombre.toLowerCase()} o ${c.destinoNombre.toLowerCase()}`,
      `cuanto sale cambiarse de ${c.origenNombre.toLowerCase()} a ${c.destinoNombre.toLowerCase()}`,
    ],
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
  const otrosAlDestino = getCambiosPorDestino(c.destinoSlug).filter((x) => x.slug !== c.slug)
  const otrosCambios = (otrosAlDestino.length > 0 ? otrosAlDestino : cambiosRecomendados.filter((x) => x.slug !== c.slug)).slice(0, 3)
  const testimonioDestino = testimonios.find((t) => t.prepagaSlug === c.destinoSlug && t.rating >= 4) ?? testimonios.find((t) => t.prepagaSlug === c.destinoSlug)

  const filas = [
    { label: 'Precio de lista (30 años)', origen: formatPrecio(c.origenPrecio), destino: formatPrecio(c.destinoPrecio) },
    { label: 'Copago', origen: 'Sin copago', destino: 'Sin copago' },
    { label: 'Calidad de cartilla', origen: `${origen.calidadCartilla}/5`, destino: `${destino.calidadCartilla}/5` },
    { label: 'Satisfacción declarada', origen: `${origen.satisfaccion}%`, destino: `${destino.satisfaccion}%` },
    { label: 'Sanatorios propios', origen: String(origen.sanatoriosPropios), destino: String(destino.sanatoriosPropios) },
    { label: 'Profesionales en cartilla', origen: `${origen.profesionales.toLocaleString('es-AR')}+`, destino: `${destino.profesionales.toLocaleString('es-AR')}+` },
  ]

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
      q: `¿Cómo hago el cambio de ${c.origenNombre} a ${c.destinoNombre}?`,
      a: `Primero contratá ${c.destinoNombre} y confirmá la fecha de alta, después pedí la baja de ${c.origenNombre} antes del cierre de facturación del mes. Así no quedás sin cobertura ni pagás dos cuotas el mismo mes. El trámite completo lleva unas dos semanas.`,
    },
    ...c.faqExtra,
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
          <p className="text-xs text-gray-400 text-center mt-4">
            Precios de lista {PRECIO_ACTUALIZADO}, persona de 30 años · {origen.nombre} {c.origenPlanNombre} vs {destino.nombre} {c.destinoPlanNombre}
          </p>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-3xl mx-auto">

          {/* Precio destacado */}
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
          <div className={`text-center rounded-2xl p-5 mb-10 ${ahorra ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
            <div className={`text-2xl font-black ${ahorra ? 'text-emerald-700' : 'text-amber-700'}`}>
              {ahorra ? `Ahorrás ${formatPrecio(Math.abs(c.deltaMensual))}/mes` : `Pagás ${formatPrecio(Math.abs(c.deltaMensual))} más por mes`}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {ahorra ? 'Cambiándote, con cobertura equivalente o mejor.' : 'Pero con una cartilla notablemente más grande.'}
            </p>
          </div>

          {/* Tabla comparativa */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{origen.nombre} vs {destino.nombre}, lado a lado</h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left font-semibold text-gray-500 px-4 py-3">&nbsp;</th>
                    <th className="text-left font-bold text-gray-700 px-4 py-3">{origen.nombre}</th>
                    <th className="text-left font-bold text-[#E8002D] px-4 py-3">{destino.nombre}</th>
                  </tr>
                </thead>
                <tbody>
                  {filas.map((f, i) => (
                    <tr key={f.label} className={i < filas.length - 1 ? 'border-b border-gray-100' : ''}>
                      <td className="px-4 py-3 text-gray-500 font-medium">{f.label}</td>
                      <td className="px-4 py-3 text-gray-700">{f.origen}</td>
                      <td className="px-4 py-3 text-gray-900 font-semibold">{f.destino}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Qué ganás / qué podrías perder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5">
              <h2 className="text-sm font-bold text-emerald-800 mb-3 uppercase tracking-wide">Lo que ganás</h2>
              <ul className="space-y-2">
                {c.ganas.map((g) => (
                  <li key={g} className="flex items-start gap-2 text-sm text-emerald-900">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
              <h2 className="text-sm font-bold text-amber-800 mb-3 uppercase tracking-wide">Lo que podrías perder</h2>
              <ul className="space-y-2">
                {c.perdes.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-amber-900">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Cuándo no conviene */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-2">¿Cuándo NO conviene este cambio?</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{c.paraQuienNo}</p>
          </div>

          {/* Testimonio real */}
          {testimonioDestino && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-10">
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} viewBox="0 0 20 20" fill={s <= testimonioDestino.rating ? '#F59E0B' : '#E5E7EB'} className="w-4 h-4">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed italic mb-3">&ldquo;{testimonioDestino.texto}&rdquo;</p>
              <p className="text-xs text-gray-400 font-medium">{testimonioDestino.nombre} · {testimonioDestino.ciudad} · afiliado a {destino.nombre}</p>
            </div>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] rounded-2xl p-7 text-white text-center mb-10">
            <h2 className="text-xl font-bold mb-2">Cotizá {destino.nombre} para tu edad exacta</h2>
            <p className="text-red-100 text-sm mb-5">El precio de lista es para 30 años. Cotizá gratis y sin DNI para ver tu valor real, con el 15% al 25% de descuento según tu situación.</p>
            <Link
              href="/comparador"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#E8002D] font-bold rounded-xl text-sm hover:bg-red-50 transition-colors"
            >
              Cotizar {destino.nombre} →
            </Link>
          </div>

          {/* Cómo hacer el cambio */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-2">¿Ya decidiste? Así se hace el cambio</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Primero contratás {destino.nombre} y esperás la confirmación de alta con fecha de inicio. Recién con esa fecha
              confirmada, pedís la baja de {origen.nombre} antes del cierre de facturación del mes para no pagar dos cuotas.
            </p>
            <Link href="/guias/como-cambiar-de-prepaga" className="text-sm font-semibold text-[#E8002D] hover:underline">
              Ver la guía completa paso a paso →
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

          {/* Análisis completo vs */}
          {c.comparativaSlug && (
            <div className="mb-10">
              <Link href={`/comparativas/${c.comparativaSlug}`}
                className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all group">
                <div>
                  <div className="font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors">Ver el análisis completo {origen.nombre} vs {destino.nombre}</div>
                  <div className="text-xs text-gray-400 mt-1">Precio, red, satisfacción y veredicto en detalle →</div>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-5 h-5 text-gray-300 group-hover:text-[#E8002D] flex-shrink-0">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </Link>
            </div>
          )}

          {/* Otros cambios */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {otrosAlDestino.length > 0 ? `Otros que se cambiaron a ${destino.nombre}` : 'Otros cambios que analizamos'}
            </h2>
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
