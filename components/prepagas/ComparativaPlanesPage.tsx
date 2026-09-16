import type { Metadata } from 'next'
import Link from 'next/link'
import { PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import type { ComparativaPlanes } from '@/lib/data/comparativas-planes'
import { SITE_NAME, SITE_URL, formatPrecio } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'
import type { Prepaga } from '@/types'

type Plan = Prepaga['planes'][number]

export function comparativaPlanesMetadata(comp: ComparativaPlanes, prep: Prepaga, plan1: Plan, plan2: Plan): Metadata {
  return {
    title: `${prep.nombre} ${plan1.nombre} vs ${plan2.nombre}: Precios y Diferencias — ${PRECIO_ACTUALIZADO}`,
    description: `${comp.descripcion} ${plan1.nombre}: ${formatPrecio(plan1.precio)}/mes. ${plan2.nombre}: ${formatPrecio(plan2.precio)}/mes.`,
    alternates: { canonical: `${SITE_URL}/prepagas/${prep.slug}/${comp.slug}` },
    keywords: [
      `${prep.nombre.toLowerCase()} ${plan1.nombre.toLowerCase()} vs ${plan2.nombre.toLowerCase()}`,
      `diferencia entre ${prep.nombre.toLowerCase()} ${plan2.nombre.toLowerCase()} y ${plan1.nombre.toLowerCase()}`,
      `${prep.nombre.toLowerCase()} ${plan1.nombre.toLowerCase()} o ${plan2.nombre.toLowerCase()}`,
    ],
  }
}

function FilaComparacion({ label, v1, v2 }: { label: string; v1: React.ReactNode; v2: React.ReactNode }) {
  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="px-4 py-3.5 text-sm text-gray-500 font-medium w-1/3">{label}</td>
      <td className="px-4 py-3.5 text-sm text-gray-900 text-center">{v1}</td>
      <td className="px-4 py-3.5 text-sm text-gray-900 text-center">{v2}</td>
    </tr>
  )
}

function Check({ ok }: { ok: boolean }) {
  return ok
    ? <span className="text-green-600 font-bold">✓</span>
    : <span className="text-gray-300 font-bold">✕</span>
}

export function ComparativaPlanesPage({ comp, prep, plan1, plan2 }: { comp: ComparativaPlanes; prep: Prepaga; plan1: Plan; plan2: Plan }) {
  const masBarato = plan1.precio < plan2.precio ? plan1 : plan2
  const masCaro = plan1.precio < plan2.precio ? plan2 : plan1
  const diferencia = Math.abs(plan1.precio - plan2.precio)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: comp.titulo,
      description: comp.descripcion,
      url: `${SITE_URL}/prepagas/${prep.slug}/${comp.slug}`,
      author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/prepagas/${prep.slug}/${comp.slug}` },
      inLanguage: 'es-AR',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Prepagas', item: `${SITE_URL}/prepagas` },
        { '@type': 'ListItem', position: 3, name: prep.nombre, item: `${SITE_URL}/prepagas/${prep.slug}` },
        { '@type': 'ListItem', position: 4, name: `${plan1.nombre} vs ${plan2.nombre}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: comp.faqExtra.map(({ q, a }) => ({
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
            <Link href={`/prepagas/${prep.slug}`} className="hover:text-[#E8002D] transition-colors">{prep.nombre}</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">{plan1.nombre} vs {plan2.nombre}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-10">
        <div className="container max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <PrepagaLogo slug={prep.slug} nombre={prep.nombre} colorPrimario={prep.colorPrimario} size="sm" />
            <span className="text-sm font-semibold text-gray-500">{prep.nombre}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{comp.titulo}</h1>

          {/* Respuesta corta — lo primero que alguien busca en este tipo de query */}
          <div className="bg-white rounded-2xl border-2 border-[#E8002D] p-5 mb-6">
            <div className="text-xs font-bold text-[#E8002D] uppercase tracking-wide mb-2">Respuesta corta</div>
            <p className="text-sm text-gray-700 leading-relaxed">{comp.respuestaCorta}</p>
          </div>

          {/* Precio lado a lado */}
          <div className="grid grid-cols-2 gap-3">
            {[plan1, plan2].map((plan) => (
              <Link
                key={plan.slug}
                href={`/prepagas/${prep.slug}/${plan.slug}`}
                className={`rounded-2xl border-2 p-4 text-center transition-all hover:shadow-sm ${
                  plan.slug === masBarato.slug ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="text-sm font-bold text-gray-900 mb-1">{plan.nombre}</div>
                <div className="text-2xl font-black text-gray-900">{formatPrecio(plan.precio)}</div>
                <div className="text-[10px] text-gray-400 mb-2">/mes · 30 años</div>
                {plan.slug === masBarato.slug && (
                  <span className="inline-block text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    {formatPrecio(diferencia)} más barato
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tabla comparativa */}
      <section className="py-10 bg-white">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">{plan1.nombre} vs {plan2.nombre}, punto por punto</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">&nbsp;</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">{plan1.nombre}</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">{plan2.nombre}</th>
                </tr>
              </thead>
              <tbody>
                <FilaComparacion label="Precio de lista" v1={<span className="font-bold">{formatPrecio(plan1.precio)}</span>} v2={<span className="font-bold">{formatPrecio(plan2.precio)}</span>} />
                <FilaComparacion label="Copago en consultas" v1={<Check ok={!plan1.copago} />} v2={<Check ok={!plan2.copago} />} />
                <FilaComparacion label="Red abierta" v1={<Check ok={plan1.redAbierta} />} v2={<Check ok={plan2.redAbierta} />} />
                <FilaComparacion label="Plan más elegido" v1={plan1.destacado ? <Check ok /> : '—'} v2={plan2.destacado ? <Check ok /> : '—'} />
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">✓ en "Copago en consultas" significa que NO tiene copago (mejor). Precios de lista para persona de 30 años, {PRECIO_ACTUALIZADO.toLowerCase()}.</p>

          {/* Cobertura destacada de cada uno */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {[plan1, plan2].map((plan) => (
              <div key={plan.slug} className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                <div className="text-sm font-bold text-gray-900 mb-2">{plan.nombre} incluye</div>
                <ul className="space-y-1.5">
                  {plan.cobertura.map((c) => (
                    <li key={c} className="flex items-center gap-2 text-xs text-gray-600">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-green-500 flex-shrink-0">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Veredicto */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">¿Cuál conviene?</h2>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-700 leading-relaxed">{comp.veredicto}</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
          <div className="space-y-2">
            {comp.faqExtra.map(({ q, a }) => (
              <details key={q} className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-sm text-gray-900 select-none list-none">
                  <h3 className="font-semibold text-sm text-gray-900 m-0">{q}</h3>
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Links a cada ficha */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href={`/prepagas/${prep.slug}/${plan1.slug}`} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all group">
              <span className="text-sm font-semibold text-gray-900 group-hover:text-[#E8002D]">Ver ficha completa del {plan1.nombre} →</span>
            </Link>
            <Link href={`/prepagas/${prep.slug}/${plan2.slug}`} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all group">
              <span className="text-sm font-semibold text-gray-900 group-hover:text-[#E8002D]">Ver ficha completa del {plan2.nombre} →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-12 bg-[#E8002D] text-white">
        <div className="container max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">¿Querés saber cuál te conviene a vos?</h2>
          <p className="text-red-200 text-sm mb-6">Cotizá gratis y te decimos qué plan de {prep.nombre} encaja con tu edad y presupuesto.</p>
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
