import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { PedirPropuestaCard } from '@/components/empresas/PedirPropuestaCard'

// Silo de empresas (23-sep-2026): guía para "obra social para empleados fuera
// de convenio". Todo lo normativo sale de la Superintendencia de Servicios
// de Salud (Decreto 504/98 y páginas de opción de cambio en argentina.gob.ar).
const FUENTE_DIRECCION = 'https://www.argentina.gob.ar/sssalud/usuarios/cambio-obra-sociales/direccion'
const FUENTE_OPCION = 'https://www.argentina.gob.ar/sssalud/usuarios/cambio-obra-social'

export const metadata: Metadata = {
  title: 'Obra social para empleados fuera de convenio: qué les corresponde y cómo elegir (2026)',
  description: 'Un empleado fuera de convenio es titular de una obra social de Dirección y puede elegir obra social o una prepaga inscripta en el RNAS, una vez por año (Decreto 504/98). Cómo se hace el trámite.',
  alternates: { canonical: `${SITE_URL}/empresas/empleados-fuera-de-convenio` },
  keywords: ['obra social para empleados fuera de convenio', 'empleado fuera de convenio obra social', 'obra social personal fuera de convenio', 'fuera de convenio prepaga', 'obra social de direccion'],
}

const faqs = [
  {
    q: '¿Qué obra social le corresponde a un empleado fuera de convenio?',
    a: 'Según la Superintendencia de Servicios de Salud, los trabajadores en relación de dependencia que no están comprendidos en un convenio colectivo son titulares de obras sociales de Dirección. Igual que el resto de los trabajadores, pueden ejercer la libre elección y cambiar de cobertura.',
  },
  {
    q: '¿Un empleado fuera de convenio puede elegir una prepaga?',
    a: 'Sí. Puede elegir entre obras sociales sindicales, de empresas y de Dirección, y también entidades de medicina prepaga inscriptas en el Registro Nacional de Agentes de Salud (RNAS).',
  },
  {
    q: '¿Cada cuánto se puede cambiar de obra social?',
    a: 'Una vez al año (cada 365 días), con una permanencia mínima de un año en la entidad elegida. El cambio se hace efectivo el primer día del mes siguiente a la confirmación de la solicitud y es irretractable, salvo excepciones. La norma es el Decreto 504/98 y sus modificatorios.',
  },
  {
    q: '¿Cómo se hace el trámite?',
    a: 'Lo hace el titular, de forma online y gratuita, en el sitio de la Superintendencia de Servicios de Salud.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Obra social para empleados fuera de convenio: qué les corresponde y cómo elegir',
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/empresas/empleados-fuera-de-convenio`,
    isBasedOn: [FUENTE_DIRECCION, FUENTE_OPCION],
    inLanguage: 'es-AR',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Empresas', item: `${SITE_URL}/empresas` },
      { '@type': 'ListItem', position: 3, name: 'Empleados fuera de convenio' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
]

export default function EmpleadosFueraDeConvenioPage() {
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
            <span className="text-gray-700">Empleados fuera de convenio</span>
          </nav>
        </div>
      </div>

      <article>
        <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-12">
          <div className="container max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Obra social para empleados fuera de convenio: qué les corresponde y cómo elegir
            </h1>
            <p className="text-gray-700 text-base leading-relaxed">
              Un empleado en relación de dependencia <strong>fuera de convenio</strong> es titular de una <strong>obra social de Dirección</strong> y puede elegir su cobertura:
              obras sociales sindicales, de empresas, de Dirección o una <strong>prepaga inscripta en el RNAS</strong>. Puede cambiar una vez por año, según el Decreto 504/98.
            </p>
          </div>
        </section>

        <section className="py-10 bg-white">
          <div className="container max-w-3xl mx-auto space-y-8 text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Qué obra social le corresponde</h2>
              <p>
                La Superintendencia de Servicios de Salud define a los trabajadores en relación de dependencia que no están comprendidos en un convenio colectivo como
                titulares de <strong>obras sociales de Dirección</strong>. Como cualquier beneficiario del sistema, pueden ejercer la libre elección de su agente de salud.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Qué pueden elegir: obra social o prepaga</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Obras sociales sindicales</li>
                <li>Obras sociales de empresas</li>
                <li>Obras sociales de Dirección</li>
                <li>Entidades de medicina prepaga inscriptas en el Registro Nacional de Agentes de Salud (RNAS)</li>
              </ul>
              <p className="mt-3">
                Si elige una prepaga, sus aportes se derivan a esa prepaga.{' '}
                <Link href="/guias/derivar-obra-social-a-prepaga" className="text-[#E8002D] font-semibold hover:underline">Cómo derivar tu obra social a una prepaga →</Link>
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Cada cuánto se puede cambiar y desde cuándo rige</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Una vez al año (cada 365 días).</li>
                <li>Permanencia mínima de un año en la entidad elegida.</li>
                <li>Rige desde el primer día del mes siguiente a la confirmación de la solicitud.</li>
                <li>Es irretractable, salvo excepciones.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Cómo se hace el trámite</h2>
              <p>
                Lo hace el propio titular, de forma online y gratuita, en el sitio de la Superintendencia de Servicios de Salud:{' '}
                <a href={FUENTE_OPCION} target="_blank" rel="noopener noreferrer" className="text-[#E8002D] font-semibold hover:underline">opción de cambio de obra social</a>.
              </p>
            </div>
            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Si sos empresa: cobertura para tu personal fuera de convenio</h2>
              <p className="text-sm">
                Podés ofrecerle a tu equipo un plan corporativo: el empleado elige la prepaga del convenio y deriva sus aportes. Te armamos la propuesta con las prepagas de las que somos partner oficial.
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Fuentes: Superintendencia de Servicios de Salud —{' '}
              <a href={FUENTE_DIRECCION} target="_blank" rel="noopener noreferrer" className="underline">trabajadores fuera de convenio</a> y{' '}
              <a href={FUENTE_OPCION} target="_blank" rel="noopener noreferrer" className="underline">libre elección y opción de cambio</a>; Decreto 504/98 y modificatorios.
            </p>
          </div>
        </section>
      </article>

      <section id="cotizar" className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pedí una propuesta para tu equipo</h2>
            <p className="text-sm text-gray-500">Gratis y sin compromiso.</p>
          </div>
          <PedirPropuestaCard variant="light" />
        </div>
      </section>

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
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl mx-auto text-center flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link href="/empresas" className="text-sm font-semibold text-[#E8002D] hover:underline">← Prepagas para empresas</Link>
          <Link href="/empresas/beneficios-impositivos" className="text-sm font-semibold text-gray-600 hover:text-[#E8002D]">Beneficios impositivos</Link>
          <Link href="/guias/derivar-obra-social-a-prepaga" className="text-sm font-semibold text-gray-600 hover:text-[#E8002D]">Derivar aportes a una prepaga</Link>
        </div>
      </section>
    </>
  )
}
