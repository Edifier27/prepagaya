import type { Metadata } from 'next'
import Link from 'next/link'
import { prepagas } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL, CONTENT_UPDATE } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'
import { EmpresasForm } from '@/components/empresas/EmpresasForm'

export const metadata: Metadata = {
  title: 'Ranking de Planes Corporativos de Prepaga en Argentina',
  description: 'Cuál es la mejor prepaga para el plan corporativo de tu empresa: comparamos infraestructura propia, facturación y costo entre Swiss Medical y OSDE.',
  alternates: { canonical: `${SITE_URL}/empresas/ranking` },
  keywords: ['ranking prepagas corporativas', 'mejor prepaga para empresas argentina', 'mejor plan corporativo prepaga', 'cual es la mejor prepaga corporativa'],
}

const swiss = prepagas.find((p) => p.slug === 'swiss-medical')!
const osde = prepagas.find((p) => p.slug === 'osde')!

const criterios = [
  { nombre: 'Infraestructura propia', descripcion: 'Sanatorios, centros de atención y servicios de emergencia propios de la prepaga (no tercerizados), porque de eso depende que tu equipo consiga turno rápido sin depender de la disponibilidad de terceros.' },
  { nombre: 'Flexibilidad de facturación', descripcion: 'Qué tan fácil es armar el convenio sin sumarle trabajo administrativo a RRHH — si la factura puede ir directo a cada empleado en vez de a la empresa.' },
  { nombre: 'Costo relativo del plan equivalente', descripcion: 'Cuánto sale, a nivel de cobertura similar, cada plan corporativo entre las prepagas que evaluamos — según lo que vemos en las cotizaciones reales que armamos para empresas.' },
  { nombre: 'Penetración y poder de negociación corporativo', descripcion: 'Qué tan habitual es el convenio corporativo con esa prepaga y qué margen real hay para negociar condiciones a medida del tamaño de tu equipo.' },
]

const faqs = [
  {
    q: '¿Por qué Swiss Medical encabeza el ranking?',
    a: 'Por la combinación de infraestructura propia (9 sanatorios, Swiss Medical Centers exclusivos para sus socios, avión sanitario, médico online y ambulancias propias), la modalidad de afinidad que le saca a RRHH el trabajo administrativo de facturación, y un costo que en las cotizaciones que armamos suele resultar más accesible que un plan de OSDE equivalente.',
  },
  {
    q: '¿Evaluaron otras prepagas para planes corporativos, además de Swiss Medical y OSDE?',
    a: 'Por ahora este ranking evalúa a fondo únicamente Swiss Medical y OSDE, que son las dos prepagas con las que armamos convenios corporativos de forma activa. A medida que sumemos gestión activa de convenios con otras prepagas, las vamos a incorporar acá — no queremos rankear una empresa sin haberla evaluado en profundidad primero.',
  },
  {
    q: '¿Qué pasa si mi empresa ya tiene un convenio corporativo con OSDE?',
    a: 'Podés comparar tu convenio actual contra un plan equivalente de Swiss Medical — en la mayoría de los casos que vemos, el costo baja. Mirá el comparativo directo entre las dos.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Ranking de planes corporativos de prepaga en Argentina',
    description: 'Comparamos infraestructura propia, facturación y costo entre las prepagas corporativas que evaluamos activamente.',
    url: `${SITE_URL}/empresas/ranking`,
    image: `${SITE_URL}/opengraph-image`,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    dateModified: CONTENT_UPDATE,
    inLanguage: 'es-AR',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Empresas', item: `${SITE_URL}/empresas` },
      { '@type': 'ListItem', position: 3, name: 'Ranking' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Ranking de planes corporativos de prepaga',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Swiss Medical', url: `${SITE_URL}/empresas/swiss-medical` },
      { '@type': 'ListItem', position: 2, name: 'OSDE', url: `${SITE_URL}/empresas/osde` },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
]

export default function RankingEmpresasPage() {
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
            <span className="text-gray-700">Ranking</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            ¿Cuál es la mejor prepaga corporativa? Nuestro ranking
          </h1>
          <p className="text-gray-600 max-w-2xl text-base leading-relaxed">
            Evaluamos infraestructura propia, facilidad de facturación para RRHH y costo relativo entre las prepagas con las que armamos convenios corporativos de forma activa.
          </p>
        </div>
      </section>

      {/* Criterios */}
      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Cómo armamos este ranking</h2>
          <p className="text-sm text-gray-500 mb-6">4 criterios, en base a nuestra experiencia armando convenios corporativos — no es una encuesta de satisfacción.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {criterios.map((c) => (
              <div key={c.nombre} className="bg-gray-50 rounded-xl border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-1.5">{c.nombre}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{c.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* #1 Swiss Medical */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border-2 border-amber-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center font-bold flex-shrink-0">1</div>
              <PrepagaLogo slug="swiss-medical" nombre="Swiss Medical" colorPrimario={swiss.colorPrimario} size="md" />
            </div>
            <ul className="space-y-2 mb-4">
              {[
                '9 sanatorios propios, incluyendo Swiss Medical Centers de uso exclusivo para sus socios (turnos más rápidos, sobre todo en temporada alta de demanda)',
                'Convenio de afinidad: la factura llega directo a cada empleado, RRHH no gestiona descuentos de recibo de sueldo',
                'Avión sanitario, médico online y ambulancias propias — no tercerizados',
                'En las cotizaciones que armamos, suele resultar significativamente más accesible que un plan equivalente de OSDE',
              ].map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
            <Link href="/empresas/swiss-medical" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E8002D] hover:underline">
              Ver plan corporativo de Swiss Medical →
            </Link>
          </div>
        </div>
      </section>

      {/* #2 OSDE */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-2xl border-2 border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 border border-gray-200 flex items-center justify-center font-bold flex-shrink-0">2</div>
              <PrepagaLogo slug="osde" nombre="OSDE" colorPrimario={osde.colorPrimario} size="md" />
            </div>
            <ul className="space-y-2 mb-4">
              {[
                'La red más grande del país: +140.000 profesionales y 380+ centros de atención',
                'La opción más fuerte si tu equipo está repartido en muchas provincias',
                'No tiene sanatorios propios: terceriza el 100% de la atención con convenios',
                'Facturación estándar a la empresa — RRHH gestiona el reparto por recibo de sueldo si corresponde',
              ].map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
            <Link href="/empresas/osde" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E8002D] hover:underline">
              Ver plan corporativo de OSDE →
            </Link>
          </div>
        </div>
      </section>

      {/* Nota de alcance */}
      <section className="py-8 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-2xl p-5">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Por qué el ranking tiene solo dos prepagas:</strong> evaluamos a fondo únicamente las empresas con las que armamos convenios corporativos de forma activa. Preferimos eso a rankear una prepaga que todavía no analizamos en profundidad para el segmento corporativo.
            </p>
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section id="cotizar" className="py-12 bg-white border-t border-gray-100">
        <div className="container max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pedí la propuesta comparada para tu empresa</h2>
            <p className="text-sm text-gray-500">Gratis, sin compromiso. Te contactamos en menos de 24hs hábiles.</p>
          </div>
          <EmpresasForm />
        </div>
      </section>

      {/* FAQ */}
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
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="py-8 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/empresas" className="text-sm font-semibold text-[#E8002D] hover:underline">← Volver a Empresas</Link>
            <Link href="/empresas/swiss-medical/vs-osde" className="text-sm font-semibold text-[#E8002D] hover:underline">Swiss Medical vs. OSDE en detalle →</Link>
            <Link href="/empresas/como-cotizar" className="text-sm font-semibold text-[#E8002D] hover:underline">Cómo cotizar un plan corporativo →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
