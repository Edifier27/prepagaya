import type { Metadata } from 'next'
import Link from 'next/link'
import { PRECIO_ACTUALIZADO_EN } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { extremosA30 } from '@/lib/precios/resumen'
import { pesosEn } from '@/lib/precios/en'
import { ContratarPlanButtonIntl } from '@/components/prepagas/ContratarPlanButtonIntl'
import { ldJson } from '@/lib/jsonld'

export const metadata: Metadata = {
  title: { absolute: `Argentina Mandatory Insurance Requirement 2026 (Decree 366/25) — ${SITE_NAME}` },
  description:
    'Decree 366/2025 requires foreigners without permanent residency to have health insurance in Argentina, and public hospitals bill them for non-emergency care. What it requires, who is exempt, and which coverage — travel insurance or a local prepaga — fits your stay.',
  alternates: {
    canonical: `${SITE_URL}/en/mandatory-insurance-decree-366`,
    languages: {
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
    a: 'Yes. Decree 366/2025, published in the Official Gazette (Boletín Oficial) on May 29, 2025, amended the Migration Law to require health insurance from foreign nationals who are not permanent residents — tourists, students and workers alike. Border checks were reported to start on July 1, 2025.',
  },
  {
    q: 'Who checks it?',
    a: 'Migraciones (Argentine immigration) can ask for proof of coverage when you arrive, so carry your policy or coverage certificate on your phone. Emergency care is never denied to anyone, whatever their migratory status.',
  },
  {
    q: 'Is healthcare free in Argentina for foreigners?',
    a: 'Emergencies, yes: public hospitals treat everyone. Since Decree 366/2025, foreigners without permanent residency pay for scheduled (non-emergency) care in public hospitals, or need health insurance that covers it. That is why students and new residents usually join a local prepaga.',
  },
  {
    q: 'Can I join a prepaga with my passport or a "residencia precaria"?',
    a: 'Yes. Swiss Medical accepts a passport or the residencia precaria certificate that Migraciones gives you while your residency is processed. Once you join, we give you the coverage certificate to present in your residency and DNI paperwork. Our advisors speak English and Portuguese.',
  },
  {
    q: 'What does the insurance need to cover, at minimum?',
    a: 'Basic medical care, hospitalization for illness or accident, 24-hour emergency assistance, and medical transport or evacuation if needed. A standard travel-assistance policy from any recognized insurer meets this.',
  },
  {
    q: 'I am relocating to Argentina for months, not just visiting — do I still need travel insurance?',
    a: `No — and you shouldn't buy it. A short-term travel policy is priced and designed for a trip of days or weeks. If you are staying for months or settling in, a local prepaga (OSDE, Swiss Medical, Galeno, and others) costs about the same per month as your age group pays locally, covers you continuously with no per-trip limit, and we give you its coverage certificate for your residency and DNI paperwork. As of ${PRECIO_ACTUALIZADO_EN}, plans start at ${pesosEn(extremosA30().min.precio)}/month for a 30-year-old (official price lists).`,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(jsonLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-3xl mx-auto">
          <span className="inline-block text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-4">
            English guide · Updated {PRECIO_ACTUALIZADO_EN}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Argentina&apos;s Mandatory Insurance Requirement, Explained
          </h1>
          {/* 26-nov-2026: con fuente oficial y sin lo de las aerolíneas (no figura en
              las fuentes oficiales). El 1-jul-2025 es la fecha que informó la prensa. */}
          <p className="text-gray-600 leading-relaxed mb-6">
            Decree 366/2025 requires foreigners who are not permanent residents to have health insurance in
            Argentina, and Migraciones can ask for it when you arrive (checks were reported to start on July 1, 2025).
            Without permanent residency, non-emergency care in public hospitals is billed. The coverage you need
            depends on one thing: are you visiting for a few weeks, or moving here to work or study?
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
                A travel policy is not built for months of coverage. A local prepaga costs the same monthly fee a
                resident your age pays and has no trip-length cap. Swiss Medical accepts your passport or residencia
                precaria, and we give you the coverage certificate for your residency and DNI paperwork.
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
          <p className="text-xs text-gray-400 mt-6 leading-relaxed">
            Sources:{' '}
            <a href="https://www.boletinoficial.gob.ar/detalleAviso/primera/326096/2025-05-29" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Decree 366/2025, Boletín Oficial (May 29, 2025)</a>
            {' · '}
            <a href="https://www.argentina.gob.ar/normativa/nacional/decreto-366-2025-413297" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">full text, argentina.gob.ar</a>
            {' · '}
            <a href="https://www.argentina.gob.ar/node/467195" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">public hospitals and non-residents, Presidencia</a>.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#E8002D] text-white">
        <div className="container max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Moving to Argentina? Compare real prepaga prices</h2>
          <p className="text-white text-sm mb-6">
            Free, no registration, no DNI required. An advisor who speaks English or Portuguese will contact you.
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
