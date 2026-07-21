import type { Metadata } from 'next'
import Link from 'next/link'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { formatPrecio, SITE_NAME, SITE_URL } from '@/lib/utils'

export const metadata: Metadata = {
  title: { absolute: `Health Insurance in Argentina for Foreigners (2026 Guide) — ${SITE_NAME}` },
  description:
    'How health insurance works in Argentina for expats and foreigners: the mandatory insurance requirement (Decree 366/25), how to join a local prepaga without a DNI, and real 2026 prices.',
  alternates: {
    canonical: `${SITE_URL}/en/health-insurance-argentina`,
    languages: {
      'es-AR': `${SITE_URL}/para/extranjeros`,
      en: `${SITE_URL}/en/health-insurance-argentina`,
    },
  },
  keywords: [
    'health insurance argentina',
    'argentina health insurance for foreigners',
    'prepaga argentina expat',
    'mandatory health insurance argentina',
    'private health care argentina cost',
  ],
}

const faqs = [
  {
    q: 'Is health insurance mandatory to enter Argentina?',
    a: 'Yes. Since Decree 366/25 came into force in July 2025, all foreign non-residents must have valid medical coverage for their entire stay — tourists, students and workers alike. Permanent residents and naturalized citizens are exempt.',
  },
  {
    q: 'Can I join an Argentine prepaga without a DNI?',
    a: 'Usually yes. Most major companies accept enrollment with a valid passport plus proof that your residency application has been filed ("residencia precaria"). Some require a provisional tax ID (CDI/CUIL) for billing. Get a quote and an advisor will confirm which companies accept your current documents.',
  },
  {
    q: 'How much does private health insurance cost in Argentina?',
    a: `Foreigners pay the same as locals: price depends on age and plan, not nationality. As of ${PRECIO_ACTUALIZADO}, entry-level plans start around AR$170,000/month for a 30-year-old, mid-range plans with no copays run AR$300,000–500,000, and premium plans exceed AR$1,000,000.`,
  },
  {
    q: 'Travel insurance or a local prepaga — which one do I need?',
    a: 'For a short visit, travel insurance satisfies the entry requirement and costs less. If you are relocating, a local prepaga is the only complete option: full provider network, unlimited hospitalization, chronic treatment coverage, and a coverage certificate accepted for residency paperwork.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Health Insurance in Argentina for Foreigners: the 2026 Guide',
    description: 'Mandatory insurance requirement, joining a prepaga without a DNI, and real prices.',
    url: `${SITE_URL}/en/health-insurance-argentina`,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/en/health-insurance-argentina` },
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

export default function HealthInsuranceArgentinaPage() {
  const destacadas = ['swiss-medical', 'osde', 'medife', 'sancor-salud']
    .map((s) => prepagas.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-3xl mx-auto">
          <span className="inline-block text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-4">
            English guide · Updated {PRECIO_ACTUALIZADO}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Health Insurance in Argentina: the Guide for Foreigners
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            Since July 2025, Argentina requires all foreign visitors to carry medical coverage (Decree 366/25).
            And if you are moving here — for work, studies or residency — joining a local private health plan
            (<em>prepaga</em>) is usually far better value than international travel insurance: full hospital
            network, no per-event caps, and you pay the same monthly fee as any Argentine your age.
          </p>
          <Link
            href="/comparador"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-md text-sm"
          >
            Compare real prices (free, no DNI required) →
          </Link>
          <p className="text-xs text-gray-400 mt-3">
            ¿Preferís leer en español? <Link href="/para/extranjeros" className="text-[#E8002D] hover:underline font-medium">Guía en español →</Link>
          </p>
        </div>
      </section>

      {/* Key facts */}
      <section className="py-10 bg-white">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">The 4 things to know</h2>
          <div className="space-y-4">
            {[
              { t: 'Insurance is now mandatory at the border', d: 'Decree 366/25 (in force since July 2025) requires every foreign non-resident to hold medical coverage for the whole stay — entering by air, land or sea. Permanent residents and naturalized citizens are exempt.' },
              { t: 'You can join a prepaga without a DNI', d: 'Most major companies enroll foreigners with a passport and a filed residency application (precaria). Some ask for a provisional tax ID for billing. Same price as locals — nationality does not change the fee.' },
              { t: 'No waiting periods on essential care', d: 'By law (Ley 26.682), mandatory health program (PMO) services — doctor visits, tests, hospitalization, emergencies, maternity — cannot carry waiting periods. Coverage of essentials starts on day one.' },
              { t: 'Your prepaga certificate works for immigration paperwork', d: 'The coverage certificate issued by any prepaga is accepted by Migraciones as proof of medical coverage for temporary residency applications.' },
            ].map((item, i) => (
              <div key={item.t} className="flex items-start gap-4 bg-gray-50 rounded-2xl border border-gray-100 p-5">
                <span className="w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-sm font-bold text-[#E8002D] flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <div className="font-bold text-gray-900 text-sm mb-1">{item.t}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top companies */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Popular options among expats</h2>
          <p className="text-sm text-gray-500 mb-6">Real list prices for a 30-year-old adult, VAT included — {PRECIO_ACTUALIZADO}.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {destacadas.map((p) => {
              const desde = Math.min(...p.planes.map((pl) => pl.precio))
              return (
                <Link key={p.slug} href={`/prepagas/${p.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-red-200 hover:shadow-sm transition-all">
                  <div className="font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors">{p.nombre}</div>
                  <div className="text-xs text-gray-500 mt-1">{p.planes.length} plans · from <span className="font-bold text-[#E8002D]">{formatPrecio(desde)}</span>/month</div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Frequently asked questions</h2>
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

      {/* CTA */}
      <section className="py-12 bg-[#E8002D] text-white">
        <div className="container max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Compare plans with real prices</h2>
          <p className="text-red-200 text-sm mb-6">
            Free, no registration, no DNI required. An advisor who works with expats will contact you.
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
