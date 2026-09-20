import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { PedirPropuestaCard } from '@/components/empresas/PedirPropuestaCard'

export const metadata: Metadata = {
  title: 'Plan Black de Swiss Medical: Línea Corporativa Premium para Empresas',
  description: 'Qué incluye el Plan Black de Swiss Medical: ejecutivo de cuenta 24hs, red Blue Cross & Blue Shield en EEUU, cobertura internacional y reintegros en todas las especialidades.',
  alternates: { canonical: `${SITE_URL}/empresas/swiss-medical/plan-black` },
  keywords: ['plan black swiss medical', 'swiss medical black empresas', 'swiss medical plan black que incluye', 'swiss medical linea premium corporativa'],
}

const beneficios = [
  { t: 'Ejecutivo de cuenta 24hs', d: 'Línea dedicada exclusiva, sin pasar por la atención general al socio.' },
  { t: '80% de descuento en farmacias', d: 'El porcentaje más alto de la oferta de Swiss Medical — el resto de los planes da 40%.' },
  { t: 'Reintegros en todas las especialidades', d: 'Cobertura ampliada más allá de la cartilla cerrada, en cualquier especialidad médica.' },
  { t: 'Red Blue Cross & Blue Shield (EE. UU.)', d: 'Acceso a la red de proveedores médicos de Blue Cross & Blue Shield para quienes viajan o residen parcialmente en Estados Unidos.' },
  { t: 'Cobertura médica internacional', d: 'Atención cubierta fuera de Argentina, no solo asistencia al viajero de urgencia.' },
  { t: 'Chequeo médico anual', d: 'Control preventivo anual incluido para el titular.' },
  { t: 'Cirugía estética y dermoestética', d: 'Cobertura sobre procedimientos que en planes estándar quedan fuera del PMO.' },
]

const faqs = [
  {
    q: '¿Para quién está pensado el Plan Black?',
    a: 'Para equipos gerenciales, socios y ejecutivos de empresas que buscan el nivel más alto de cobertura y atención disponible en Swiss Medical, con servicios que no están en la línea de planes corporativos estándar.',
  },
  {
    q: '¿El Plan Black se puede contratar para toda la empresa o solo para algunos puestos?',
    a: 'Se puede segmentar: es habitual que una empresa dé Plan Black a su plana gerencial y un plan corporativo estándar (o la modalidad de afinidad) al resto del equipo. Se define en el convenio.',
  },
  {
    q: '¿Qué diferencia al Plan Black de un plan corporativo estándar de Swiss Medical?',
    a: 'El salto está en los servicios adicionales: ejecutivo de cuenta dedicado, mayor descuento en farmacias, reintegros ampliados a todas las especialidades, y acceso a cobertura y red de proveedores en Estados Unidos — nada de esto está en la línea corporativa estándar.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Plan Black Swiss Medical',
    description: 'Línea corporativa premium de Swiss Medical con atención preferencial y exclusiva.',
    provider: { '@type': 'Organization', name: 'Swiss Medical' },
    url: `${SITE_URL}/empresas/swiss-medical/plan-black`,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Empresas', item: `${SITE_URL}/empresas` },
      { '@type': 'ListItem', position: 3, name: 'Swiss Medical', item: `${SITE_URL}/empresas/swiss-medical` },
      { '@type': 'ListItem', position: 4, name: 'Plan Black' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
]

export default function PlanBlackPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-[#E8002D] transition-colors">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <Link href="/empresas" className="hover:text-[#E8002D] transition-colors">Empresas</Link>
            <span className="text-gray-300">›</span>
            <Link href="/empresas/swiss-medical" className="hover:text-[#E8002D] transition-colors">Swiss Medical</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">Plan Black</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-14">
        <div className="container max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 border border-white/20">
            Línea corporativa premium
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Plan Black de Swiss Medical
          </h1>
          <p className="text-gray-300 max-w-2xl text-base leading-relaxed">
            El techo de la cobertura corporativa: atención preferencial y exclusiva, pensada para equipos gerenciales y empresas que no quieren resignar nada.
          </p>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Qué incluye</h2>
          <div className="space-y-3">
            {beneficios.map((b) => (
              <div key={b.t} className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-1">{b.t}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section id="cotizar" className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cotizá el Plan Black para tu equipo</h2>
            <p className="text-sm text-gray-500">Contanos cuántos van con Black y cuántos con el plan corporativo estándar — armamos la propuesta combinada.</p>
          </div>
          <PedirPropuestaCard prepagaContexto="Swiss Medical — Plan Black" variant="light" />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
          <div className="space-y-2">
            {faqs.map(({ q, a }) => (
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

      <section className="py-8 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl mx-auto text-center">
          <Link href="/empresas/swiss-medical" className="text-sm font-semibold text-[#E8002D] hover:underline">
            ← Ver el resto de los planes corporativos de Swiss Medical
          </Link>
        </div>
      </section>
    </>
  )
}
