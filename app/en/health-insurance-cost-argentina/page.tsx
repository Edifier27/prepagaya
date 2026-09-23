import type { Metadata } from 'next'
import Link from 'next/link'
import { PRECIO_ACTUALIZADO_EN } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { ContratarPlanButtonIntl } from '@/components/prepagas/ContratarPlanButtonIntl'

export const metadata: Metadata = {
  title: { absolute: `How Much Does Health Insurance Cost in Argentina? (${PRECIO_ACTUALIZADO_EN}) — ${SITE_NAME}` },
  description:
    'Real 2026 prepaga prices in Argentina by coverage tier: entry-level, mid-range and premium — plus what actually moves the price (age, copay, plan) and the 15% online discount.',
  alternates: {
    canonical: `${SITE_URL}/en/health-insurance-cost-argentina`,
    languages: {
      'es-AR': `${SITE_URL}/para/extranjeros`,
      en: `${SITE_URL}/en/health-insurance-cost-argentina`,
      ru: `${SITE_URL}/ru/stoimost-strahovaniya-argentina`,
      zh: `${SITE_URL}/zh/yiliao-baoxian-feiyong-agenting`,
    },
  },
  keywords: [
    'health insurance cost argentina',
    'prepaga price argentina',
    'how much is private health insurance in argentina',
    'argentina health insurance price 2026',
    'prepaga argentina monthly cost',
  ],
}

const tiers = [
  { nombre: 'Entry-level', rango: 'from ~AR$170,000/mo', desc: 'Full PMO coverage (the legally mandated minimum: doctor visits, tests, hospitalization, emergencies, maternity) for a 30-year-old. Usually has copays on consultations.' },
  { nombre: 'Mid-range', rango: 'AR$300,000–500,000/mo', desc: 'No copays, wider provider network, and often access to at least one high-complexity own or partner hospital.' },
  { nombre: 'Premium', rango: 'AR$1,000,000+/mo', desc: 'The broadest provider network, private rooms, and the shortest wait times for specialists and elective procedures.' },
]

const faqs = [
  {
    q: 'Does age change the price a lot?',
    a: 'Yes — it is the single biggest factor. Prices are set in age brackets and rise noticeably after 40, then again after 60. A 25-year-old and a 55-year-old on the identical plan pay very different monthly fees.',
  },
  {
    q: 'Is there a discount for paying online or by direct debit?',
    a: 'Yes, most companies offer around 15% off the list price for contracting online (25% for monotributistas, the simplified self-employed regime) — this is already reflected in the quotes you get through PrepagaYa.',
  },
  {
    q: 'How much more does a family plan cost?',
    a: 'Each family member is priced individually by their own age, then added up — there is no flat "family rate." A couple with two young kids typically costs noticeably less per person than four adults would, since children are priced lower.',
  },
  {
    q: 'Do foreigners pay a surcharge?',
    a: 'No. Nationality does not affect price — you pay exactly what an Argentine your age pays for the same plan.',
  },
  {
    q: 'What is the fastest way to see my exact price?',
    a: 'Use the free comparator: enter your age (and your family’s, if applicable) and your city, and you get real prices across all major companies in about two minutes, with no DNI or signup required.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `How Much Does Health Insurance Cost in Argentina? ${PRECIO_ACTUALIZADO_EN}`,
    description: 'Real prepaga prices by coverage tier, and what actually moves the price.',
    url: `${SITE_URL}/en/health-insurance-cost-argentina`,
    image: `${SITE_URL}/opengraph-image`,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/en/health-insurance-cost-argentina` },
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

export default function HealthInsuranceCostArgentinaPage() {
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
            How Much Does Health Insurance Cost in Argentina?
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            List prices for a 30-year-old range from about AR$170,000/month for entry-level coverage to over
            AR$1,000,000/month for premium plans, as of {PRECIO_ACTUALIZADO_EN.toLowerCase()}. Your own price
            depends mainly on age, plan tier, and whether you want copays or not.
          </p>
          <ContratarPlanButtonIntl
            locale="us"
            fuente="en-cost"
            label="See your exact price by age (free, no DNI) →"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-md text-sm"
          />
          <p className="text-xs text-gray-400 mt-3">
            ¿Preferís leer en español? <Link href="/para/extranjeros" className="text-[#E8002D] hover:underline font-medium">Guía en español →</Link>
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-10 bg-white">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Price by coverage tier (30-year-old, individual)</h2>
          <div className="space-y-4">
            {tiers.map((t) => (
              <div key={t.nombre} className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <span className="font-bold text-gray-900">{t.nombre}</span>
                  <span className="text-sm font-bold text-[#E8002D]">{t.rango}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mt-2">{t.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            List prices, {PRECIO_ACTUALIZADO_EN.toLowerCase()}. Most companies apply about 15% off for online
            contracting with automatic debit — already reflected in quotes through the comparator.
          </p>
        </div>
      </section>

      {/* What moves the price */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">What actually moves your price</h2>
          <div className="space-y-4">
            {[
              { t: 'Your age', d: 'The single biggest factor. Prices step up in age brackets, most noticeably after 40 and again after 60.' },
              { t: 'Copay or no copay', d: 'Plans with no copay on consultations cost more than otherwise-similar plans that do have one.' },
              { t: 'Your family group', d: 'Each person is priced individually by their own age and added up — there is no flat family discount, but children are priced lower than adults.' },
              { t: 'Nothing else', d: 'Nationality, country of origin and immigration status do not affect the price — you pay the same list price a local your age pays.' },
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
          <h2 className="text-2xl font-bold mb-2">Get your exact price, not just a range</h2>
          <p className="text-red-200 text-sm mb-6">
            Free, no registration, no DNI required. An advisor who works with foreigners will contact you.
          </p>
          <ContratarPlanButtonIntl
            locale="us"
            fuente="en-cost-cta"
            label="Get my quote →"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E8002D] font-bold rounded-2xl hover:bg-red-50 transition-all shadow-lg text-sm"
          />
        </div>
      </section>
    </>
  )
}
