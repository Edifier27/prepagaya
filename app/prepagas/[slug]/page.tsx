import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { formatPrecio, SITE_NAME, SITE_URL } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return prepagas.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const prep = prepagas.find((p) => p.slug === slug)
  if (!prep) return {}
  const precioMin = Math.min(...prep.planes.map(pl => pl.precio))
  return {
    title: `${prep.nombre} — Planes y Precios ${PRECIO_ACTUALIZADO} | ${SITE_NAME}`,
    description: `Todos los planes de ${prep.nombre} en Argentina: precios actualizados, coberturas, pros y contras. Desde ${formatPrecio(precioMin)}/mes. Sin formularios, sin registro.`,
    alternates: { canonical: `${SITE_URL}/prepagas/${slug}` },
    keywords: [
      `${prep.nombre.toLowerCase()} precios`,
      `${prep.nombre.toLowerCase()} planes`,
      `${prep.nombre.toLowerCase()} argentina 2026`,
      `planes ${prep.nombre.toLowerCase()}`,
      `prepaga ${prep.nombre.toLowerCase()}`,
    ],
  }
}

export default async function PrepagaSlugPage({ params }: Props) {
  const { slug } = await params
  const prep = prepagas.find((p) => p.slug === slug)
  if (!prep) notFound()

  const planesOrdenados = [...prep.planes].sort((a, b) => a.precio - b.precio)
  const precioMin = Math.min(...prep.planes.map(pl => pl.precio))
  const precioMax = Math.max(...prep.planes.map(pl => pl.precio))
  const planEstrella = prep.planes.find(pl => pl.destacado) ?? planesOrdenados[0]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${prep.nombre} — Medicina Prepaga Argentina`,
      description: prep.descripcion,
      url: `${SITE_URL}/prepagas/${slug}`,
      brand: { '@type': 'Brand', name: prep.nombre },
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: precioMin,
        highPrice: precioMax,
        priceCurrency: 'ARS',
        offerCount: prep.planes.length,
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: prep.rating,
        reviewCount: prep.cantidadOpiniones,
        bestRating: 5,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Prepagas', item: `${SITE_URL}/prepagas` },
        { '@type': 'ListItem', position: 3, name: prep.nombre },
      ],
    },
  ]

  // Iniciales para avatar
  const initials = prep.nombre.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

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
            <span className="text-gray-700">{prep.nombre}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-5xl mx-auto">
          <div className="flex items-start gap-5 mb-6">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-black flex-shrink-0 shadow-sm"
              style={{ backgroundColor: prep.colorPrimario }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                  Actualizado {PRECIO_ACTUALIZADO}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  prep.satisfaccion >= 80 ? 'bg-green-100 text-green-700' :
                  prep.satisfaccion >= 75 ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {prep.satisfaccion}% satisfacción
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{prep.nombre}</h1>
              <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">{prep.descripcion}</p>
            </div>
          </div>

          {/* Stats rápidos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Planes disponibles', value: `${prep.planes.length}` },
              { label: 'Precio desde', value: formatPrecio(precioMin) },
              { label: 'Profesionales', value: `${(prep.profesionales / 1000).toFixed(0)}k+` },
              { label: 'Satisfacción', value: `${prep.satisfaccion}%` },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
                <div className="text-lg font-bold text-[#E8002D]">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/comparador?zona=caba&provincia=CABA`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
            >
              Cotizar {prep.nombre} →
            </Link>
            <a
              href={`https://${prep.web}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 hover:border-[#E8002D] text-gray-700 hover:text-[#E8002D] font-semibold rounded-xl transition-all text-sm"
            >
              Web oficial ↗
            </a>
          </div>
        </div>
      </section>

      {/* Planes */}
      <section className="py-10 bg-white">
        <div className="container max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">Planes de {prep.nombre} — {PRECIO_ACTUALIZADO}</h2>
            <span className="text-xs text-gray-400 hidden sm:block">Precio base · persona 30 años · con IVA</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {planesOrdenados.map((plan) => (
              <Link
                key={plan.slug}
                href={`/prepagas/${slug}/${plan.slug}`}
                className={`relative group bg-white rounded-2xl border-2 p-5 hover:shadow-md transition-all ${
                  plan.destacado ? 'border-[#E8002D]' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                {plan.destacado && (
                  <div className="absolute -top-3 left-5">
                    <span className="bg-[#E8002D] text-white text-[10px] font-black px-3 py-1 rounded-full">
                      MÁS ELEGIDO
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="font-bold text-gray-900 group-hover:text-[#E8002D] transition-colors">{plan.nombre}</div>
                    <div className="text-xs text-gray-500 mt-0.5 leading-snug">{plan.descripcion}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xl font-black text-[#E8002D] tabular-nums">{formatPrecio(plan.precio)}</div>
                    <div className="text-xs text-gray-400">/mes</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                    plan.copago ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {plan.copago ? 'Con copago' : 'Sin copago'}
                  </span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                    plan.redAbierta ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-500'
                  }`}>
                    Red {plan.redAbierta ? 'abierta' : 'cerrada'}
                  </span>
                </div>

                {/* Coberturas */}
                <div className="flex flex-wrap gap-1">
                  {plan.cobertura.slice(0, 4).map((c) => (
                    <span key={c} className="text-[10px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">
                      {c}
                    </span>
                  ))}
                  {plan.cobertura.length > 4 && (
                    <span className="text-[10px] text-gray-400">+{plan.cobertura.length - 4} más</span>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Ver cobertura completa</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"
                    className="w-4 h-4 text-gray-300 group-hover:text-[#E8002D] transition-colors">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          <p className="text-xs text-gray-400">* Precios para persona de 30 años, contratación directa con IVA incluido. {PRECIO_ACTUALIZADO}.</p>
        </div>
      </section>

      {/* Pros y Contras */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{prep.nombre}: pros y contras</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-green-100 p-6">
              <h3 className="font-bold text-green-700 mb-4 flex items-center gap-2 text-sm">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Ventajas
              </h3>
              <ul className="space-y-2.5">
                {prep.pros.map((pro) => (
                  <li key={pro} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-red-100 p-6">
              <h3 className="font-bold text-red-700 mb-4 flex items-center gap-2 text-sm">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-400">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                Desventajas
              </h3>
              <ul className="space-y-2.5">
                {prep.contras.map((contra) => (
                  <li key={contra} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                    {contra}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Coberturas incluidas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {([
              { key: 'appMovil', label: 'App móvil' },
              { key: 'atencion24hs', label: 'Atención 24hs' },
              { key: 'coberturaNacional', label: 'Cobertura nacional' },
              { key: 'odontologia', label: 'Odontología' },
              { key: 'saludMental', label: 'Salud mental' },
              { key: 'maternidad', label: 'Maternidad' },
              { key: 'optica', label: 'Óptica' },
              { key: 'farmacia', label: 'Farmacia' },
            ] as { key: keyof typeof prep.caracteristicas; label: string }[]).map(({ key, label }) => {
              const ok = prep.caracteristicas[key]
              return (
                <div key={key} className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium ${
                  ok ? 'bg-green-50 border-green-100 text-green-800' : 'bg-gray-50 border-gray-100 text-gray-400'
                }`}>
                  <svg viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 flex-shrink-0 ${ok ? 'text-green-500' : 'text-gray-300'}`}>
                    {ok
                      ? <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      : <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                    }
                  </svg>
                  {label}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-12 bg-[#E8002D] text-white">
        <div className="container max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Cotizá {prep.nombre} para tu perfil</h2>
          <p className="text-red-200 text-sm mb-6">
            El precio varía según tu edad. Usá el cotizador para ver el precio exacto y comparar con otras prepagas.
          </p>
          <Link
            href="/comparador"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E8002D] font-bold rounded-2xl hover:bg-red-50 transition-all shadow-lg text-sm"
          >
            Cotizar gratis →
          </Link>
        </div>
      </section>
    </>
  )
}
