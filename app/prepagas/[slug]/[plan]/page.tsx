import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { formatPrecio, SITE_NAME, SITE_URL } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string; plan: string }>
}

export async function generateStaticParams() {
  return prepagas.flatMap((p) =>
    p.planes.map((pl) => ({ slug: p.slug, plan: pl.slug }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, plan: planSlug } = await params
  const prep = prepagas.find((p) => p.slug === slug)
  const plan = prep?.planes.find((pl) => pl.slug === planSlug)
  if (!prep || !plan) return {}
  return {
    title: `${prep.nombre} ${plan.nombre} — Precio y Cobertura ${PRECIO_ACTUALIZADO} | ${SITE_NAME}`,
    description: `${prep.nombre} ${plan.nombre}: ${formatPrecio(plan.precio)}/mes (persona 30 años). ${plan.descripcion} Cobertura completa, sin formularios.`,
    alternates: { canonical: `${SITE_URL}/prepagas/${slug}/${planSlug}` },
    keywords: [
      `${prep.nombre.toLowerCase()} ${plan.nombre.toLowerCase()}`,
      `${prep.nombre.toLowerCase()} ${plan.nombre.toLowerCase()} precio`,
      `${prep.nombre.toLowerCase()} ${plan.nombre.toLowerCase()} cobertura`,
      `plan ${plan.nombre.toLowerCase()} ${prep.nombre.toLowerCase()}`,
    ],
  }
}

export default async function PlanPage({ params }: Props) {
  const { slug, plan: planSlug } = await params
  const prep = prepagas.find((p) => p.slug === slug)
  const plan = prep?.planes.find((pl) => pl.slug === planSlug)
  if (!prep || !plan) notFound()

  const planesOrdenados = [...prep.planes].sort((a, b) => a.precio - b.precio)
  const initials = prep.nombre.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${prep.nombre} ${plan.nombre}`,
    description: plan.descripcion,
    url: `${SITE_URL}/prepagas/${slug}/${planSlug}`,
    brand: { '@type': 'Brand', name: prep.nombre },
    offers: {
      '@type': 'Offer',
      price: plan.precio,
      priceCurrency: 'ARS',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2026-08-01',
      seller: { '@type': 'Organization', name: prep.nombre },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: prep.rating,
      reviewCount: prep.cantidadOpiniones,
      bestRating: 5,
    },
  }

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
            <Link href={`/prepagas/${slug}`} className="hover:text-[#E8002D] transition-colors">{prep.nombre}</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">{plan.nombre}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-start gap-4 mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-black flex-shrink-0 shadow-sm"
              style={{ backgroundColor: prep.colorPrimario }}
            >
              {initials}
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">
                <Link href={`/prepagas/${slug}`} className="hover:text-[#E8002D] transition-colors font-medium">{prep.nombre}</Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{plan.nombre}</h1>
              {plan.destacado && (
                <span className="inline-block mt-2 bg-[#E8002D] text-white text-xs font-black px-3 py-1 rounded-full">
                  MÁS ELEGIDO
                </span>
              )}
            </div>
          </div>

          {/* Price card */}
          <div className="bg-white rounded-2xl border-2 border-[#E8002D] p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-xs text-gray-400 mb-1">Precio base — persona 30 años · con IVA</div>
              <div className="text-4xl font-black text-[#E8002D] tabular-nums">{formatPrecio(plan.precio)}</div>
              <div className="text-sm text-gray-500 mt-0.5">/mes · {PRECIO_ACTUALIZADO}</div>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/comparador"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-md text-sm"
              >
                Cotizar para mi edad →
              </Link>
              <p className="text-xs text-center text-gray-400">El precio varía según tu edad</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${
              plan.copago ? 'bg-gray-50 text-gray-600 border-gray-200' : 'bg-green-50 text-green-700 border-green-200'
            }`}>
              {plan.copago ? '● Con copago en consultas' : '✓ Sin copago en consultas'}
            </span>
            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${
              plan.redAbierta ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'
            }`}>
              {plan.redAbierta ? '✓ Red abierta' : '● Red cerrada'}
            </span>
          </div>

          <p className="text-gray-600 leading-relaxed">{plan.descripcion}</p>
        </div>
      </section>

      {/* Coberturas */}
      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Coberturas del {plan.nombre}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {plan.cobertura.map((c) => (
              <div key={c} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500 flex-shrink-0">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm text-gray-700">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Otros planes de la misma prepaga */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Otros planes de {prep.nombre}</h2>
          <div className="space-y-2">
            {planesOrdenados.filter(pl => pl.slug !== planSlug).map((pl) => (
              <Link
                key={pl.slug}
                href={`/prepagas/${slug}/${pl.slug}`}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all group"
              >
                <div>
                  <div className="font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors text-sm">{pl.nombre}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{pl.copago ? 'Con copago' : 'Sin copago'} · Red {pl.redAbierta ? 'abierta' : 'cerrada'}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#E8002D] text-sm">{formatPrecio(pl.precio)}/mes</div>
                  <div className="text-xs text-gray-400">→</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link href={`/prepagas/${slug}`} className="text-sm text-[#E8002D] font-semibold hover:underline">
              ← Ver todos los planes de {prep.nombre}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#E8002D] text-white">
        <div className="container max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">¿Querés contratar {plan.nombre}?</h2>
          <p className="text-red-200 text-sm mb-6">
            El precio real depende de tu edad y zona. Cotizá gratis y recibí asesoramiento sin cargo.
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
