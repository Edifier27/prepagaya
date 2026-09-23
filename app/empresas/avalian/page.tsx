import type { Metadata } from 'next'
import Link from 'next/link'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'
import { PedirPropuestaCard } from '@/components/empresas/PedirPropuestaCard'

// Silo de empresas (23-sep-2026): spoke de marca para "avalian para
// empresas". Todo el contenido sale de la página oficial avalian.com/empresas.
const FUENTE = 'https://avalian.com/empresas'

export const metadata: Metadata = {
  title: 'Avalian para empresas: plan corporativo Superior Plus y beneficios (2026)',
  description: 'Avalian para tu empresa: plan corporativo Superior Plus con habitación individual y reintegros, más de 100.000 prestadores en todo el país, chequeos médicos en la empresa y telemedicina 24/7. Cotizá gratis.',
  alternates: { canonical: `${SITE_URL}/empresas/avalian` },
  keywords: ['avalian para empresas', 'avalian empresas', 'plan corporativo avalian', 'avalian superior plus', 'avalian pymes'],
}

const avalian = prepagas.find((p) => p.slug === 'avalian')!

const faqs = [
  {
    q: '¿Qué es el plan Superior Plus de Avalian?',
    a: 'Es el plan corporativo de Avalian: acceso a los servicios sin costos adicionales, habitación individual en internación, cartilla amplia con cobertura en todo el país, reintegros (hasta 12 interconsultas por año), telemedicina Avalian e-doc y asistencia al viajero. Se adapta a las necesidades de cada empresa.',
  },
  {
    q: '¿Qué beneficios tiene la empresa?',
    a: 'Según Avalian: chequeos médicos en la empresa, encuesta saludable para los colaboradores, programas de prevención, capacitaciones y actividades, y atención exclusiva y personalizada.',
  },
  {
    q: '¿Qué pasa con la familia del empleado?',
    a: 'Avalian ofrece para empresas un beneficio de permanencia familiar, seguros de accidentes personales, asistencia al viajero y beneficio jubilatorio, según su página oficial para empresas.',
  },
  {
    q: '¿Avalian tiene cobertura en todo el país?',
    a: 'Sí: Avalian informa más de 100.000 prestadores en todo el país, gestiones online y credencial digital. Es una buena opción si tu equipo está repartido en varias provincias.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Plan corporativo de medicina prepaga',
    name: 'Avalian para empresas',
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    areaServed: { '@type': 'Country', name: 'Argentina' },
    audience: { '@type': 'BusinessAudience', audienceType: 'PyMEs y empresas' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Empresas', item: `${SITE_URL}/empresas` },
      { '@type': 'ListItem', position: 3, name: 'Avalian' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
]

const GRUPOS = [
  { titulo: 'Bienestar y prevención', items: ['Chequeos médicos en la empresa', 'Encuesta saludable para colaboradores', 'Programas de prevención, capacitaciones y actividades'] },
  { titulo: 'Atención y cobertura médica', items: ['Asistencia psicológica telefónica y online', 'Telemedicina Avalian e-doc', 'App y gestiones online', 'Atención exclusiva y personalizada'] },
  { titulo: 'Seguro y continuidad familiar', items: ['Servicio de urgencia', 'Beneficio de permanencia familiar', 'Seguros de accidentes personales', 'Asistencia al viajero', 'Beneficio jubilatorio'] },
]

export default function EmpresasAvalianPage() {
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
            <span className="text-gray-700">Avalian</span>
          </nav>
        </div>
      </div>

      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <PrepagaLogo slug="avalian" nombre="Avalian" colorPrimario={avalian.colorPrimario} size="md" />
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">
              Plan corporativo · {PRECIO_ACTUALIZADO}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">Avalian para empresas</h1>
          <p className="text-gray-600 max-w-2xl text-base leading-relaxed">
            Plan corporativo Superior Plus, más de 100.000 prestadores en todo el país y beneficios pensados para la empresa y la familia de cada empleado. Avalian es parte del grupo cooperativo de La Segunda y la Asociación de Cooperativas Argentinas (ACA).
          </p>
          <a href="#cotizar" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm transition-colors">
            Pedir propuesta para mi empresa →
          </a>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border-2 border-[#0099D4]/30 bg-sky-50/40 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Plan corporativo Superior Plus</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              {['Acceso a los servicios sin costos adicionales', 'Habitación individual en internación', 'Cartilla amplia con cobertura en todo el país', 'Reintegros (hasta 12 interconsultas por año)', 'Telemedicina Avalian e-doc', 'Asistencia al viajero'].map((x) => (
                <li key={x} className="flex gap-2"><span className="text-emerald-500">✓</span>{x}</li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 mt-4">Se adapta a las necesidades de cada empresa. Fuente: <a href={FUENTE} target="_blank" rel="noopener noreferrer" className="underline">Avalian para empresas</a>.</p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Beneficios para tu empresa</h2>
            <div className="space-y-3">
              {GRUPOS.map((g) => (
                <div key={g.titulo} className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                  <div className="font-semibold text-gray-900 text-sm mb-1.5">{g.titulo}</div>
                  <ul className="text-xs text-gray-600 space-y-1">{g.items.map((i) => <li key={i}>· {i}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Los planes individuales de Avalian</h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-3xl mb-4">
            Además del Superior Plus corporativo, Avalian tiene los planes Cerca, Integral, Hoy, Superior y Selecta para contratación individual. En la propuesta te decimos cuál conviene para tu equipo.
          </p>
          <Link href="/prepagas/avalian" className="text-sm font-semibold text-[#E8002D] hover:underline">Ver los planes de Avalian →</Link>
        </div>
      </section>

      <section id="cotizar" className="py-12 bg-white border-t border-gray-100">
        <div className="container max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cotizá Avalian para tu empresa</h2>
            <p className="text-sm text-gray-500">Gratis y sin compromiso. Somos partner oficial de Avalian.</p>
          </div>
          <PedirPropuestaCard prepagaContexto="Avalian" variant="light" />
        </div>
      </section>

      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
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

      <section className="py-8 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto text-center flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link href="/empresas" className="text-sm font-semibold text-[#E8002D] hover:underline">← Prepagas para empresas</Link>
          <Link href="/empresas/ranking" className="text-sm font-semibold text-gray-600 hover:text-[#E8002D]">Ranking de prepagas corporativas</Link>
          <Link href="/empresas/como-cotizar" className="text-sm font-semibold text-gray-600 hover:text-[#E8002D]">Cómo cotizar un plan corporativo</Link>
        </div>
      </section>
    </>
  )
}
