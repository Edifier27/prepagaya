import type { Metadata } from 'next'
import Link from 'next/link'
import { prepagas, PRECIO_ACTUALIZADO_EN, nivelPrecio } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL, precioDesde } from '@/lib/utils'
import { extremosA30 } from '@/lib/precios/resumen'
import { pesosEn, precioPlan } from '@/lib/precios/en'
import { elegir } from '@/lib/seo/titulos'
import { TablaPreciosIntl } from '@/components/intl/TablaPreciosIntl'
import { TablaEstudianteIntl } from '@/components/intl/TablaEstudianteIntl'
import { UsdAprox } from '@/components/intl/Dolar'
import { EDAD_ESTUDIANTE, planesEstudiante } from '@/lib/precios/estudiante'

// Montos del cuadro oficial (31-oct-2026), no escritos a mano
const A30 = extremosA30()
const SMG20 = precioPlan('swiss-medical', 'smg20')
const OSDE210 = precioPlan('osde', '210')
// Estudiantes (26-nov-2026): Swiss Medical a los 22 años, lista oficial
const ESTUDIANTE_DESDE = Math.min(...planesEstudiante().map((f) => f.precio))

// Decreto 366/2025 y residencia de estudiante: fuentes oficiales (26-nov-2026)
const FUENTES = [
  { texto: 'Decree 366/2025, Official Gazette', url: 'https://www.boletinoficial.gob.ar/detalleAviso/primera/326096/2025-05-29' },
  { texto: 'Presidency: care for non-residents', url: 'https://www.argentina.gob.ar/node/467195' },
  { texto: 'Migraciones: student residency', url: 'https://www.argentina.gob.ar/servicio/obtener-una-residencia-temporaria-como-estudiante' },
]
// Red de Swiss Medical en las ciudades universitarias
const CIUDADES: [string, string][] = [
  ['Buenos Aires City', 'caba'], ['La Plata', 'la-plata'], ['Rosario', 'rosario'], ['Córdoba', 'cordoba'], ['Corrientes', 'corrientes'], ['Mendoza', 'mendoza'],
]
import { NivelPrecioBadge } from '@/components/ui/NivelPrecioBadge'
import { ContratarPlanButtonIntl } from '@/components/prepagas/ContratarPlanButtonIntl'
import { ldJson } from '@/lib/jsonld'

export const metadata: Metadata = {
  // Con precio y mes (31-oct-2026, ola 2 de CTR: 3.388 imp., 0,59%)
  title: { absolute: elegir([`Health Insurance in Argentina for Expats (${PRECIO_ACTUALIZADO_EN})`, `Health Insurance in Argentina for Expats, ${PRECIO_ACTUALIZADO_EN.slice(-4)} Guide`]) },
  description:
    `Plans from ${pesosEn(A30.min.precio)}/month (official ${PRECIO_ACTUALIZADO_EN} prices). Decree 366/25 mandatory insurance, joining a prepaga without a DNI, and which company fits expats.`,
  alternates: {
    canonical: `${SITE_URL}/en/health-insurance-argentina`,
    languages: {
      'es-AR': `${SITE_URL}/para/extranjeros`,
      en: `${SITE_URL}/en/health-insurance-argentina`,
      ru: `${SITE_URL}/ru/strahovanie-argentina`,
      zh: `${SITE_URL}/zh/yiliao-baoxian-agenting`,
      pt: `${SITE_URL}/pt/plano-de-saude-argentina`,
    },
  },
  keywords: [
    'health insurance argentina',
    'argentina health insurance for foreigners',
    'prepaga argentina expat',
    'mandatory health insurance argentina',
    'private health care argentina cost',
    'health insurance for international students argentina',
    'study in argentina health insurance',
  ],
}

// texto: versión sin links de la respuesta, para el JSON-LD (antes iba el JSX
// y el FAQPage quedaba con un objeto en vez de texto)
const faqs: { q: string; a: React.ReactNode; texto?: string }[] = [
  {
    q: 'Is health insurance mandatory to enter Argentina?',
    a: 'Yes, if you don’t have permanent residency. Decree 366/2025, published in Argentina’s Official Gazette on May 29, 2025, requires foreigners entering without permanent residency to have health insurance (border checks were reported from July 1, 2025). Permanent residents and Argentine citizens are exempt.',
  },
  {
    q: 'Can I join an Argentine prepaga without a DNI?',
    a: 'Yes. Swiss Medical enrolls you with your passport or with the residencia precaria certificate that Migraciones issues when you file for residency. For other companies, an advisor will check your case. When you join, we give you the coverage certificate for your residency and DNI paperwork.',
  },
  {
    q: 'How much does private health insurance cost in Argentina?',
    a: <>Foreigners pay the same as locals: price depends on age and plan, not nationality. According to the official {PRECIO_ACTUALIZADO_EN} price lists, plans for a 30-year-old start at {pesosEn(A30.min.precio)}/month ({A30.min.prepaga} {A30.min.plan}); popular no-copay plans like OSDE 210 ({pesosEn(OSDE210)}) and Swiss Medical SMG20 ({pesosEn(SMG20)}, 15% off online) sit in the middle, and the top plan reaches {pesosEn(A30.max.precio)}. <Link href="/en/health-insurance-cost-argentina" className="text-[#E8002D] hover:underline font-medium">Full price breakdown →</Link></>,
    texto: `Foreigners pay the same as locals: price depends on age and plan, not nationality. According to the official ${PRECIO_ACTUALIZADO_EN} price lists, plans for a 30-year-old start at ${pesosEn(A30.min.precio)}/month (${A30.min.prepaga} ${A30.min.plan}); popular no-copay plans like OSDE 210 (${pesosEn(OSDE210)}) and Swiss Medical SMG20 (${pesosEn(SMG20)}, 15% off online) sit in the middle, and the top plan reaches ${pesosEn(A30.max.precio)}.`,
  },
  {
    q: 'Travel insurance or a local prepaga — which one do I need?',
    a: 'For a short visit, travel insurance is the usual choice (we don’t sell it). If you are staying for months or years, a local prepaga is the complete option: full provider network, no per-event caps, chronic treatment coverage, and we give you the coverage certificate for your residency and DNI paperwork.',
  },
  {
    q: 'I’m coming to study in Argentina. What health insurance do I need?',
    a: `While you don’t have permanent residency, Decree 366/2025 requires health insurance, and public hospitals bill non-residents for scheduled care (emergencies are always treated). Students who stay the whole year usually join a prepaga${Number.isFinite(ESTUDIANTE_DESDE) ? `: for a ${EDAD_ESTUDIANTE}-year-old, Swiss Medical starts at ${pesosEn(ESTUDIANTE_DESDE)}/month (official ${PRECIO_ACTUALIZADO_EN} list price, Buenos Aires City and Greater Buenos Aires), and it enrolls you` : '. Swiss Medical enrolls you'} with your passport or residencia precaria.`,
  },
  {
    q: 'Do your advisors speak English or Portuguese?',
    a: 'Yes. An advisor who speaks English or Portuguese quotes your plan, explains the coverage and helps you enroll. We also advise in Spanish.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Health Insurance in Argentina for Foreigners: the 2026 Guide',
    description: 'Mandatory insurance requirement, joining a prepaga without a DNI, and real prices.',
    url: `${SITE_URL}/en/health-insurance-argentina`,
    image: `${SITE_URL}/opengraph-image`,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/en/health-insurance-argentina` },
    inLanguage: 'en',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a, texto }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: typeof a === 'string' ? a : texto },
    })),
  },
]

export default function HealthInsuranceArgentinaPage() {
  const destacadas = ['swiss-medical', 'osde', 'medife', 'sancor-salud']
    .map((s) => prepagas.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

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
            Health Insurance in Argentina: the Guide for Foreigners
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            Decree 366/2025 requires foreigners without permanent residency to have health insurance in Argentina, and
            public hospitals bill non-residents for scheduled care. If you are moving here — for work, studies or residency —
            joining a local private health plan (<em>prepaga</em>) is usually far better value than international travel
            insurance: full hospital network, no per-event caps, and you pay the same monthly fee as any Argentine your
            age: <strong className="text-gray-900">from {pesosEn(A30.min.precio)}<UsdAprox ars={A30.min.precio} /> per month</strong> for
            a 30-year-old, according to the official {PRECIO_ACTUALIZADO_EN} price lists. Swiss Medical enrolls you with your
            passport or residencia precaria, we give you the coverage certificate for your DNI, and our advisors speak
            English and Portuguese.
          </p>
          <ContratarPlanButtonIntl
            locale="us"
            fuente="en-pillar"
            label="Compare real prices (free, no DNI required) →"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-md text-sm"
          />
          <p className="text-xs text-gray-400 mt-3 flex flex-wrap gap-x-3 gap-y-1">
            <span>¿Preferís leer en español? <Link href="/para/extranjeros" className="text-[#E8002D] hover:underline font-medium">Guía en español →</Link></span>
            <span>· Lê em português? <Link href="/pt/plano-de-saude-argentina" className="text-[#E8002D] hover:underline font-medium">Guia em português →</Link></span>
            <span>· <Link href="/zh/yiliao-baoxian-agenting" className="text-[#E8002D] hover:underline font-medium">中文阅读 →</Link></span>
          </p>
        </div>
      </section>

      {/* Key facts */}
      <section className="py-10 bg-white">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">The 4 things to know</h2>
          <div className="space-y-4">
            {[
              { t: 'Health insurance is required without permanent residency', d: <>Decree 366/2025 (Official Gazette, May 29, 2025) requires foreigners entering Argentina without permanent residency to have health insurance; border checks were reported from July 1, 2025. Public hospitals bill non-residents for scheduled care, and emergencies are always treated. <Link href="/en/mandatory-insurance-decree-366" className="text-[#E8002D] hover:underline font-medium">Full breakdown of the requirement →</Link></> },
              { t: 'You can join a prepaga without a DNI', d: 'Swiss Medical enrolls foreigners with a passport or the residencia precaria certificate that Migraciones issues when you file for residency. Same price as locals — nationality does not change the fee.' },
              { t: 'No waiting periods on most essential care', d: 'By law (Ley 26.682), mandatory health program (PMO) services — doctor visits, tests, hospitalization, emergencies — cannot carry waiting periods and start on day one. Maternity is the exception: Swiss Medical applies a 2-month waiting period from enrollment and does not enroll people who are already pregnant.' },
              { t: 'We give you the coverage certificate for your DNI', d: 'When you join, we give you the prepaga’s coverage certificate to present in your residency and DNI paperwork. Our advisors speak English and Portuguese.' },
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

      {/* Precios oficiales (GEO) */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">How much it costs: official prices ({PRECIO_ACTUALIZADO_EN})</h2>
          <TablaPreciosIntl locale="en" />
        </div>
      </section>

      {/* Estudiantes (26-nov-2026) */}
      <section id="students" className="py-10 bg-gray-50 border-t border-gray-100 scroll-mt-20">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Studying in Argentina: health insurance for international students</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            While you don’t have permanent residency, Decree 366/2025 requires health insurance, and public hospitals bill
            non-residents for scheduled care (emergencies are always treated). Argentina’s immigration office (Dirección
            Nacional de Migraciones) grants student residency to regular students of recognized institutions for one year,
            renewable, and you start the process online through the RaDEX system.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Swiss Medical enrolls you with your passport or residencia precaria, and when you join we give you the coverage
            certificate for your DNI paperwork. Price depends on age, not nationality:
          </p>
          <TablaEstudianteIntl locale="en" />
          <p className="text-sm text-gray-700 mt-5 mb-2 font-semibold">Swiss Medical network in university cities (in Spanish):</p>
          <p className="text-sm leading-relaxed">
            {CIUDADES.map(([nombre, zona], i) => (
              <span key={zona}>
                {i > 0 && <span className="text-gray-300"> · </span>}
                <Link href={`/cartillas/swiss-medical/${zona}`} className="text-[#E8002D] hover:underline font-medium">{nombre}</Link>
              </span>
            ))}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ContratarPlanButtonIntl
              locale="us"
              fuente="en-students"
              label="Get my student quote →"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-md text-sm"
            />
            <Link href="/pt/plano-de-saude-argentina#estudantes" className="text-sm font-semibold text-gray-600 hover:text-[#E8002D] hover:underline">
              Em português: plano de saúde para estudantes →
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            Sources:{' '}
            {FUENTES.map((f, i) => (
              <span key={f.url}>
                {i > 0 && ' · '}
                <a href={f.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">{f.texto}</a>
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* Top companies */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Popular options among expats</h2>
          <p className="text-sm text-gray-500 mb-6">Price level relative to the market — {PRECIO_ACTUALIZADO_EN}. Get your exact quote for free.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {destacadas.map((p) => {
              const desde = precioDesde(p)
              return (
                <Link key={p.slug} href={`/prepagas/${p.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-red-200 hover:shadow-sm transition-all">
                  <div className="font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors">{p.nombre}</div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">{p.planes.length} plans <NivelPrecioBadge nivel={nivelPrecio(desde)} /></div>
                </Link>
              )
            })}
          </div>
          <Link href="/en/best-health-insurance-argentina" className="inline-block text-sm font-semibold text-[#E8002D] hover:underline mt-4">
            Full comparison: which one is actually best for you →
          </Link>
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
          <h2 className="text-2xl font-bold mb-2">Compare plans with real prices</h2>
          <p className="text-white text-sm mb-6">
            Free, no registration, no DNI required. An advisor who speaks English or Portuguese will contact you.
          </p>
          <ContratarPlanButtonIntl
            locale="us"
            fuente="en-pillar-cta"
            label="Get my quote →"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E8002D] font-bold rounded-2xl hover:bg-red-50 transition-all shadow-lg text-sm"
          />
        </div>
      </section>
    </>
  )
}
