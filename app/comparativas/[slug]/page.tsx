import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { comparativas } from '@/lib/data/comparativas'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { formatPrecio, SITE_NAME, SITE_URL } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'
import type { Prepaga } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return comparativas.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const comp = comparativas.find((c) => c.slug === slug)
  if (!comp) return {}
  return {
    title: comp.titulo,
    description: comp.descripcion,
    alternates: { canonical: `${SITE_URL}/comparativas/${slug}` },
    openGraph: {
      title: comp.titulo,
      description: comp.descripcion,
      type: 'article',
    },
  }
}

function precioMin(p: Prepaga): number {
  return Math.min(...p.planes.map((pl) => pl.precio))
}

export default async function ComparativaPage({ params }: Props) {
  const { slug } = await params
  const comp = comparativas.find((c) => c.slug === slug)
  if (!comp) notFound()

  const p1 = prepagas.find((p) => p.slug === comp.prepaga1Slug)
  const p2 = prepagas.find((p) => p.slug === comp.prepaga2Slug)
  if (!p1 || !p2) notFound()

  const filas: {
    label: string
    valor: (p: Prepaga) => string
    ganador?: string
  }[] = [
    { label: `Precio base (${PRECIO_ACTUALIZADO})`, valor: (p) => `desde ${formatPrecio(precioMin(p))}/mes`, ganador: comp.ganadorPrecio },
    { label: 'Profesionales en cartilla', valor: (p) => p.profesionales.toLocaleString('es-AR'), ganador: comp.ganadorRed },
    { label: 'Sanatorios propios', valor: (p) => (p.sanatoriosPropios > 0 ? String(p.sanatoriosPropios) : 'Red por convenio') },
    { label: 'Satisfacción de afiliados', valor: (p) => `${p.satisfaccion}%`, ganador: comp.ganadorSatisfaccion },
    { label: 'Rating', valor: (p) => `${p.rating}/5 (${p.cantidadOpiniones.toLocaleString('es-AR')} opiniones)` },
    { label: 'Cobertura nacional', valor: (p) => (p.caracteristicas.coberturaNacional ? 'Sí' : 'Limitada') },
    { label: 'Cantidad de planes', valor: (p) => String(p.planes.length) },
  ]

  const faqs = [
    {
      q: `¿Cuál es más barata: ${p1.nombre} o ${p2.nombre}?`,
      a: `En ${PRECIO_ACTUALIZADO}, ${p1.nombre} arranca desde ${formatPrecio(precioMin(p1))}/mes y ${p2.nombre} desde ${formatPrecio(precioMin(p2))}/mes (persona de 30 años, contratación directa con IVA). ${
        comp.ganadorPrecio === p1.slug ? p1.nombre : p2.nombre
      } gana en precio.`,
    },
    {
      q: `¿Cuál tiene más red de prestadores?`,
      a: `${p1.nombre} tiene ${p1.profesionales.toLocaleString('es-AR')} profesionales y ${p2.nombre} tiene ${p2.profesionales.toLocaleString('es-AR')}. ${
        comp.ganadorRed === p1.slug ? p1.nombre : p2.nombre
      } tiene la red más amplia.`,
    },
    {
      q: `¿Cuál conviene: ${p1.nombre} o ${p2.nombre}?`,
      a: comp.veredicto,
    },
  ]

  const otrasComparativas = comparativas
    .filter((c) => c.slug !== slug && (
      [c.prepaga1Slug, c.prepaga2Slug].includes(p1.slug) ||
      [c.prepaga1Slug, c.prepaga2Slug].includes(p2.slug)
    ))
    .slice(0, 4)
  const comparativasParaMostrar = otrasComparativas.length >= 2
    ? otrasComparativas
    : comparativas.filter((c) => c.slug !== slug).slice(0, 4)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: comp.titulo,
      description: comp.descripcion,
      url: `${SITE_URL}/comparativas/${slug}`,
      author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/comparativas/${slug}` },
      inLanguage: 'es-AR',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Comparativas', item: `${SITE_URL}/comparativas` },
        { '@type': 'ListItem', position: 3, name: comp.titulo },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ]

  const CheckBadge = () => (
    <span className="inline-flex items-center gap-1 text-[10px] font-black text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded-full ml-2">
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      GANA
    </span>
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-[#E8002D] transition-colors">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <Link href="/comparativas" className="hover:text-[#E8002D] transition-colors">Comparativas</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">{p1.nombre} vs {p2.nombre}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-4">
            Comparativa actualizada · {PRECIO_ACTUALIZADO}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{comp.titulo}</h1>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">{comp.descripcion}</p>

          {/* VS header */}
          <div className="flex items-center justify-center gap-6 sm:gap-10">
            {[p1, p2].map((p, i) => (
              <div key={p.slug} className="flex items-center gap-6 sm:gap-10">
                <Link href={`/prepagas/${p.slug}`} className="group flex flex-col items-center gap-2">
                  <PrepagaLogo slug={p.slug} nombre={p.nombre} colorPrimario={p.colorPrimario} size="lg" className="shadow-sm" />
                  <div className="font-bold text-gray-900 group-hover:text-[#E8002D] transition-colors">{p.nombre}</div>
                  <div className="text-xs text-gray-400">desde {formatPrecio(precioMin(p))}/mes</div>
                </Link>
                {i === 0 && (
                  <div className="w-12 h-12 rounded-full bg-[#E8002D] text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-md">
                    VS
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabla comparativa */}
      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">{p1.nombre} vs {p2.nombre}: números frente a frente</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Criterio</th>
                  <th className="text-left p-4 font-bold text-gray-900">{p1.nombre}</th>
                  <th className="text-left p-4 font-bold text-gray-900">{p2.nombre}</th>
                </tr>
              </thead>
              <tbody>
                {filas.map((fila, i) => (
                  <tr key={fila.label} className={i % 2 === 1 ? 'bg-gray-50/50' : ''}>
                    <td className="p-4 text-gray-500 font-medium">{fila.label}</td>
                    <td className="p-4 text-gray-900 font-semibold whitespace-nowrap">
                      {fila.valor(p1)}
                      {fila.ganador === p1.slug && <CheckBadge />}
                    </td>
                    <td className="p-4 text-gray-900 font-semibold whitespace-nowrap">
                      {fila.valor(p2)}
                      {fila.ganador === p2.slug && <CheckBadge />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            * Precios base para persona de 30 años, contratación directa con IVA incluido · {PRECIO_ACTUALIZADO}.
          </p>
        </div>
      </section>

      {/* Veredicto */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border-2 border-[#E8002D] p-7">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#E8002D]">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
              Nuestro veredicto
            </h2>
            <p className="text-gray-700 leading-relaxed">{comp.veredicto}</p>
          </div>
        </div>
      </section>

      {/* Cards de ambas prepagas */}
      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Conocé cada una en detalle</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[p1, p2].map((p) => {
              const planBase = [...p.planes].sort((a, b) => a.precio - b.precio)[0]
              const planEstrella = p.planes.find((pl) => pl.destacado) ?? planBase
              return (
                <Link
                  key={p.slug}
                  href={`/prepagas/${p.slug}`}
                  className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-red-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <PrepagaLogo slug={p.slug} nombre={p.nombre} colorPrimario={p.colorPrimario} size="md" />
                    <div>
                      <div className="font-bold text-gray-900 group-hover:text-[#E8002D] transition-colors">{p.nombre}</div>
                      <div className="text-xs text-gray-400">{p.satisfaccion}% satisfacción · {p.planes.length} planes</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">{p.descripcion}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <div className="text-xs text-gray-400">Plan más elegido: {planEstrella.nombre}</div>
                      <div className="text-lg font-black text-[#E8002D] tabular-nums">{formatPrecio(planEstrella.precio)}<span className="text-xs font-normal text-gray-400">/mes</span></div>
                    </div>
                    <span className="text-xs font-bold text-[#E8002D]">Ver planes →</span>
                  </div>
                </Link>
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
      </section>

      {/* Otras comparativas */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Otras comparativas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {comparativasParaMostrar.map((c) => (
              <Link
                key={c.slug}
                href={`/comparativas/${c.slug}`}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all group"
              >
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#E8002D] transition-colors leading-snug">{c.titulo}</span>
                <span className="text-[#E8002D] font-bold flex-shrink-0 ml-2">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-12 bg-[#E8002D] text-white">
        <div className="container max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">¿Todavía no te decidís?</h2>
          <p className="text-red-200 text-sm mb-6">
            Cotizá {p1.nombre} y {p2.nombre} con tu edad real y compará el precio exacto. Gratis y sin registro.
          </p>
          <Link
            href="/comparador"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E8002D] font-bold rounded-2xl hover:bg-red-50 transition-all shadow-lg text-sm"
          >
            Cotizar mi precio →
          </Link>
        </div>
      </section>
    </>
  )
}
