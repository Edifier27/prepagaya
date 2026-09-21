import type { Metadata } from 'next'
import Link from 'next/link'
import { prepagas, PRECIO_ACTUALIZADO_EN, nivelPrecio } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL, formatPrecio } from '@/lib/utils'
import { NivelPrecioBadge } from '@/components/ui/NivelPrecioBadge'

export const metadata: Metadata = {
  title: { absolute: `Best Health Insurance in Argentina for Foreigners (${PRECIO_ACTUALIZADO_EN}) — ${SITE_NAME}` },
  description:
    'Swiss Medical, OSDE, Sancor Salud or Premedic? A side-by-side comparison of the top Argentine prepaga plans for expats — network size, satisfaction rating, and real 2026 prices.',
  alternates: {
    canonical: `${SITE_URL}/en/best-health-insurance-argentina`,
    languages: {
      'es-AR': `${SITE_URL}/ranking`,
      en: `${SITE_URL}/en/best-health-insurance-argentina`,
      ru: `${SITE_URL}/ru/luchshaya-strahovka-argentina`,
    },
  },
  keywords: [
    'best health insurance argentina',
    'best prepaga argentina expat',
    'swiss medical vs osde',
    'best private health insurance argentina foreigners',
    'argentina health insurance comparison',
  ],
}

const SLUGS = ['swiss-medical', 'osde', 'sancor-salud', 'premedic'] as const

const POSICIONAMIENTO: Record<string, { tag: string; para: string }> = {
  'swiss-medical': { tag: 'Best overall', para: 'Widest network of its own hospitals — the safest pick if you want top-tier coverage and are not choosing on price alone.' },
  'osde': { tag: 'Largest network', para: "Argentina's biggest prepaga by membership — the widest reach of affiliated doctors and clinics nationwide." },
  'sancor-salud': { tag: 'Best balance', para: 'Solid mid-range option: nationwide coverage without the premium price tag.' },
  'premedic': { tag: 'Best value', para: 'The most affordable of the four — full PMO coverage at the lowest monthly cost.' },
}

const faqs = [
  {
    q: 'Is Swiss Medical or OSDE better for a foreigner in Argentina?',
    a: 'Swiss Medical has more hospitals it owns outright (9), which usually means shorter waits and more control over quality. OSDE has the largest overall network by membership and doctor count. Neither is wrong — Swiss Medical if you want a more curated, premium experience; OSDE if reach and choice of doctor matter most to you.',
  },
  {
    q: 'What is the cheapest good health insurance in Argentina?',
    a: 'Premedic is the most affordable of the major players while still covering the full mandatory health program (PMO) — doctor visits, hospitalization, emergencies, maternity, with no waiting periods.',
  },
  {
    q: 'Do foreigners pay more than Argentines for the same plan?',
    a: 'No. Price is set by age and plan, not nationality — you pay exactly what a local your age pays.',
  },
  {
    q: 'Can I compare exact prices for my age before choosing?',
    a: 'Yes — prices vary by age bracket and whether you are covering just yourself or a family. Use the free comparator to see the real monthly price for your situation across all major companies at once.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Best Health Insurance in Argentina for Foreigners: ${PRECIO_ACTUALIZADO_EN}`,
    description: 'Side-by-side comparison of the top Argentine prepaga plans for expats.',
    url: `${SITE_URL}/en/best-health-insurance-argentina`,
    image: `${SITE_URL}/opengraph-image`,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/en/best-health-insurance-argentina` },
    inLanguage: 'en',
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

export default function BestHealthInsuranceArgentinaPage() {
  const items = SLUGS
    .map((slug) => prepagas.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-3xl mx-auto">
          <span className="inline-block text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-4">
            English guide · Updated {PRECIO_ACTUALIZADO_EN}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Best Health Insurance in Argentina for Foreigners
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            There is no single &quot;best&quot; prepaga — it depends on whether you value network size, your own
            hospital, or price. Here is how the four most popular options among expats actually compare, with real
            {' '}{PRECIO_ACTUALIZADO_EN.toLowerCase()} prices.
          </p>
          <Link
            href="/comparador"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-md text-sm"
          >
            Get your exact price by age (free, no DNI) →
          </Link>
          <p className="text-xs text-gray-400 mt-3">
            ¿Preferís leer en español? <Link href="/ranking" className="text-[#E8002D] hover:underline font-medium">Ranking en español →</Link>
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-10 bg-white">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">The 4 most popular options, compared</h2>
          <div className="space-y-4">
            {items.map((p) => {
              const precioMin = Math.min(...p.planes.map((pl) => pl.precio))
              const pos = POSICIONAMIENTO[p.slug]
              return (
                <div key={p.slug} className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900">{p.nombre}</span>
                        {pos && (
                          <span className="inline-block text-[10px] font-black px-2 py-0.5 rounded-full border text-[#92400E] bg-[#FEF3C7] border-[#FDE68A]">
                            {pos.tag.toUpperCase()}
                          </span>
                        )}
                      </div>
                      {pos && <p className="text-sm text-gray-600 leading-relaxed mt-1 max-w-md">{pos.para}</p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-gray-900 text-sm">from {formatPrecio(precioMin)}/mo</div>
                      <NivelPrecioBadge nivel={nivelPrecio(precioMin)} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
                    <span><strong className="text-gray-700">{p.satisfaccion}%</strong> member satisfaction</span>
                    <span><strong className="text-gray-700">{p.sanatoriosPropios}</strong> own hospitals</span>
                    <span><strong className="text-gray-700">{p.caracteristicas.coberturaNacional ? 'Nationwide' : 'Regional'}</strong> coverage</span>
                  </div>
                  <Link href={`/prepagas/${p.slug}`} className="inline-block text-sm font-semibold text-[#E8002D] hover:underline mt-3">
                    Full plan details for {p.nombre} →
                  </Link>
                </div>
              )
            })}
          </div>
          <Link href="/en/health-insurance-cost-argentina" className="inline-block text-sm font-semibold text-[#E8002D] hover:underline mt-4">
            Full price breakdown by coverage tier →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Frequently asked questions</h2>
          <div className="space-y-2">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-sm text-gray-900 select-none list-none">
                  <h3 className="font-semibold text-sm text-gray-900 m-0">{q}</h3>
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

      {/* CTA */}
      <section className="py-12 bg-[#E8002D] text-white">
        <div className="container max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">See your exact price across all of them</h2>
          <p className="text-red-200 text-sm mb-6">
            Free, no registration, no DNI required. An advisor who works with foreigners will contact you.
          </p>
          <Link
            href="/comparador"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E8002D] font-bold rounded-2xl hover:bg-red-50 transition-all shadow-lg text-sm"
          >
            Get my quote →
          </Link>
        </div>
      </section>
    </>
  )
}
