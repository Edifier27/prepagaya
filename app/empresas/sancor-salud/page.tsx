import type { Metadata } from 'next'
import Link from 'next/link'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'
import { PedirPropuestaCard } from '@/components/empresas/PedirPropuestaCard'

// Silo de empresas (23-sep-2026): spoke de marca para "sancor salud para
// empresas" / "sancor salud línea empresa". Todo el contenido sale de la
// página oficial Línea Empresa (sancorsalud.com.ar/linea-empresas).
const FUENTE = 'https://sancorsalud.com.ar/linea-empresas'

export const metadata: Metadata = {
  title: 'Sancor Salud para empresas: Línea Empresa y planes corporativos (2026)',
  description: 'Sancor Salud para tu empresa: planes corporativos a medida con el modelo System Adapt, telemedicina 24/7, club de beneficios para empleados y ejecutivos de cuenta. Cotizá gratis.',
  alternates: { canonical: `${SITE_URL}/empresas/sancor-salud` },
  keywords: ['sancor salud para empresas', 'sancor salud empresas', 'sancor salud linea empresa', 'plan corporativo sancor salud', 'sancor salud pymes'],
}

const sancor = prepagas.find((p) => p.slug === 'sancor-salud')!

const faqs = [
  {
    q: '¿Cómo es el plan corporativo de Sancor Salud?',
    a: 'Sancor Salud arma el plan a medida de cada empresa con su modelo System Adapt, que contempla las necesidades, expectativas y realidad de cada organización. No es un plan cerrado igual para todas: se define según tu equipo.',
  },
  {
    q: '¿Qué beneficios tienen los empleados?',
    a: 'Según Sancor Salud: telemedicina 24/7 con más de 20 especialidades online (Salud en Línea), un Club de Beneficios con descuentos para todos los empleados y el programa WOW de capacitaciones corporativas en bienestar, innovación y liderazgo.',
  },
  {
    q: '¿Qué atención recibe la empresa?',
    a: 'Sancor Salud asigna un acompañamiento corporativo con consultor médico, ejecutivos de cuenta y ejecutivos de atención (lo que llama "Conexión experta").',
  },
  {
    q: '¿Cuántas empresas trabajan con Sancor Salud?',
    a: 'Según su sitio oficial, más de 6.500 empresas eligen a Sancor Salud.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Plan corporativo de medicina prepaga',
    name: 'Sancor Salud para empresas',
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
      { '@type': 'ListItem', position: 3, name: 'Sancor Salud' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
]

const BENEFICIOS = [
  { titulo: 'Plan a medida (System Adapt)', texto: 'El plan se arma según las necesidades, expectativas y realidad de cada empresa.' },
  { titulo: 'Salud en Línea', texto: 'Telemedicina 24/7 con más de 20 especialidades disponibles online.' },
  { titulo: 'Club de Beneficios', texto: 'Todos los empleados acceden a descuentos y beneficios del club de Sancor Salud.' },
  { titulo: 'Programa WOW', texto: 'Capacitaciones corporativas de bienestar integral, innovación, negocios y liderazgo.' },
  { titulo: 'Conexión experta', texto: 'Acompañamiento con consultor médico, ejecutivos de cuenta y ejecutivos de atención.' },
  { titulo: 'Presencia en el interior', texto: 'Además de su lista general, Sancor Salud declara listas de precio propias para regiones como Santa Fe, Entre Ríos, Tucumán, Salta, Neuquén y el interior bonaerense.' },
]

export default function EmpresasSancorPage() {
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
            <span className="text-gray-700">Sancor Salud</span>
          </nav>
        </div>
      </div>

      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <PrepagaLogo slug="sancor-salud" nombre="Sancor Salud" colorPrimario={sancor.colorPrimario} size="md" />
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">
              Línea Empresa · {PRECIO_ACTUALIZADO}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">Sancor Salud para empresas</h1>
          <p className="text-gray-600 max-w-2xl text-base leading-relaxed">
            Sancor Salud arma el plan corporativo a medida de tu empresa, con telemedicina 24/7, un club de beneficios para los empleados y un equipo dedicado a tu cuenta. Según su sitio oficial, más de 6.500 empresas lo eligen.
          </p>
          <a href="#cotizar" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm transition-colors">
            Pedir propuesta para mi empresa →
          </a>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Qué incluye la Línea Empresa de Sancor Salud</h2>
          <p className="text-sm text-gray-500 mb-6">
            Según la página oficial de <a href={FUENTE} target="_blank" rel="noopener noreferrer" className="underline">Sancor Salud para empresas</a>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {BENEFICIOS.map((b) => (
              <div key={b.titulo} className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                <div className="font-semibold text-gray-900 text-sm">{b.titulo}</div>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{b.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Las líneas de planes de Sancor Salud</h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-3xl mb-4">
            El plan corporativo se define a medida. Como referencia, Sancor Salud tiene líneas FAM, Digital Flex, Clásica, Exclusive y GEN para contratación individual: en la propuesta para tu empresa te recomendamos cuál conviene según tu equipo.
          </p>
          <Link href="/prepagas/sancor-salud" className="text-sm font-semibold text-[#E8002D] hover:underline">Ver los planes de Sancor Salud →</Link>
        </div>
      </section>

      <section id="cotizar" className="py-12 bg-white border-t border-gray-100">
        <div className="container max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cotizá Sancor Salud para tu empresa</h2>
            <p className="text-sm text-gray-500">Gratis y sin compromiso. Somos partner oficial de Sancor Salud.</p>
          </div>
          <PedirPropuestaCard prepagaContexto="Sancor Salud" variant="light" />
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
