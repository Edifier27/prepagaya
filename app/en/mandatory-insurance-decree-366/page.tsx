import type { Metadata } from 'next'
import Link from 'next/link'
import { PRECIO_ACTUALIZADO_EN } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { ContratarPlanButtonIntl } from '@/components/prepagas/ContratarPlanButtonIntl'

export const metadata: Metadata = {
  title: { absolute: `Argentina Mandatory Insurance Requirement 2026 (Decree 366/25) — ${SITE_NAME}` },
  description:
    'Since July 2025, Argentina requires every foreign non-resident to carry medical insurance to enter the country. What Decree 366/25 requires, who is exempt, and which type of coverage — travel insurance or a local prepaga — fits your trip.',
  alternates: {
    canonical: `${SITE_URL}/en/mandatory-insurance-decree-366`,
    languages: {
      'es-AR': `${SITE_URL}/para/extranjeros`,
      en: `${SITE_URL}/en/mandatory-insurance-decree-366`,
    },
  },
  keywords: [
    'argentina mandatory travel insurance',
    'decree 366/25 argentina insurance',
    'health insurance to enter argentina',
    'argentina entry insurance requirement 2026',
    'argentina travel insurance law',
  ],
}

const faqs = [
  {
    q: 'Is travel insurance really mandatory to enter Argentina?',
    a: 'Yes. Decree 366/2025, in force since July 1, 2025, requires every foreign national who is not a permanent resident — tourists, students, workers, any reason for travel — to carry valid medical coverage for the entire stay. There is no exception by nationality.',
  },
  {
    q: 'Who checks it — the airline or immigration?',
    a: 'Both can. Airlines may ask for proof before boarding, and Migraciones (Argentine immigration) can request it on arrival. Emergency medical care itself is never denied to anyone regardless of migratory status, but you should still carry proof to avoid boarding or entry problems.',
  },
  {
    q: 'What does the insurance need to cover, at minimum?',
    a: 'Basic medical care, hospitalization for illness or accident, 24-hour emergency assistance, and medical transport or evacuation if needed. A standard travel-assistance policy from any recognized insurer meets this.',
  },
  {
    q: 'I am relocating to Argentina for months, not just visiting — do I still need travel insurance?',
    a: `No — and you shouldn't buy it. A short-term travel policy is priced and designed for a trip of days or weeks. If you are staying for months or settling in, a local prepaga (OSDE, Swiss Medical, Galeno, and others) costs about the same per month as your age group pays locally, covers you continuously with no per-trip limit, and its coverage certificate is what Migraciones actually accepts for temporary residency paperwork. As of ${PRECIO_ACTUALIZADO_EN}, entry-level plans start around AR$170,000/month for a 30-year-old.`,
  },
  {
    q: 'Are permanent residents or naturalized citizens exempt?',
    a: 'Yes. The requirement applies to non-resident foreign nationals. If you already hold permanent residency or Argentine citizenship, Decree 366/25 does not apply to you.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Argentina Mandatory Insurance Requirement 2026: Decree 366/25 Explained',
    description: 'What Decree 366/25 requires, who is exempt, and which coverage fits a short trip vs. relocating.',
    url: `${SITE_URL}/en/mandatory-insurance-decree-366`,
    image: `${SITE_URL}/opengraph-image`,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/en/mandatory-insurance-decree-366` },
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

export default function MandatoryInsuranceDecree366Page() {
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
            Argentina&apos;s Mandatory Insurance Requirement, Explained
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            Since July 1, 2025, Argentina requires every foreign non-resident to carry medical insurance for their
            entire stay (Decree 366/2025) — it can be checked at check-in or on arrival. The type of coverage you
            actually need depends on one thing: are you visiting for a few weeks, or moving here?
          </p>
          <ContratarPlanButtonIntl
            locale="us"
            fuente="en-decree366"
            label="Compare local prepaga plans (free, no DNI required) →"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-md text-sm"
          />
          <p className="text-xs text-gray-400 mt-3">
            ¿Preferís leer en español? <Link href="/para/extranjeros" className="text-[#E8002D] hover:underline font-medium">Guía en español →</Link>
          </p>
        </div>
      </section>

      {/* Which coverage fits your trip */}
      <section className="py-10 bg-white">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Which coverage actually fits your trip</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Short visit (days to a few weeks)</div>
              <div className="font-bold text-gray-900 mb-2">Travel / assistance insurance</div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Satisfies the entry requirement on its own and costs less for a short trip. Buy it from any
                recognized travel insurer before you fly.
              </p>
            </div>
            <div className="bg-red-50 rounded-2xl border-2 border-red-100 p-5">
              <div className="text-xs font-bold text-[#E8002D] uppercase tracking-wide mb-2">Relocating (months, work, residency)</div>
              <div className="font-bold text-gray-900 mb-2">Local prepaga plan</div>
              <p className="text-sm text-gray-600 leading-relaxed">
                A travel policy is not built for months of coverage. A local prepaga costs about the same monthly
                fee a resident your age pays, has no trip-length cap, and its certificate is what immigration
                accepts for residency paperwork.
              </p>
            </div>
          </div>
          <Link href="/en/best-health-insurance-argentina" className="inline-block text-sm font-semibold text-[#E8002D] hover:underline mt-4">
            Relocating? Compare the top prepaga options →
          </Link>
        </div>
      </section>

      {/* What it must cover */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">What the decree actually requires</h2>
          <div className="space-y-4">
            {[
              { t: 'Basic medical care', d: 'Coverage for a standard doctor visit or illness during your stay.' },
              { t: 'Hospitalization', d: 'Coverage for hospitalization due to illness or accident.' },
              { t: '24-hour emergency assistance', d: 'An emergency line and coverage reachable at any time.' },
              { t: 'Medical transport or evacuation', d: 'Coverage to transfer or evacuate you if the situation requires it.' },
            ].map((item, i) => (
              <div key={item.t} className="flex items-start gap-4 bg-white rounded-2xl border border-gray-100 p-5">
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
          <p className="text-xs text-gray-400 mt-4">
            Any standard local prepaga plan meets and exceeds all four — this is the baseline the decree sets, not a cap.
          </p>
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
          <h2 className="text-2xl font-bold mb-2">Moving to Argentina? Compare real prepaga prices</h2>
          <p className="text-red-200 text-sm mb-6">
            Free, no registration, no DNI required. An advisor who works with foreigners will contact you.
          </p>
          <ContratarPlanButtonIntl
            locale="us"
            fuente="en-decree366-cta"
            label="Get my quote →"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E8002D] font-bold rounded-2xl hover:bg-red-50 transition-all shadow-lg text-sm"
          />
        </div>
      </section>
    </>
  )
}
