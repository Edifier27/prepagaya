import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_NAME, SITE_URL, CONTENT_UPDATE } from '@/lib/utils'
import { PedirPropuestaCard } from '@/components/empresas/PedirPropuestaCard'

export const metadata: Metadata = {
  title: 'Swiss Medical vs. OSDE para Empresas: Plan Corporativo Más Económico',
  description: '¿Tu empresa tiene OSDE corporativo? Comparamos por qué el plan corporativo de Swiss Medical suele salir más económico, con la misma o mejor cartilla. Cotizá gratis.',
  alternates: { canonical: `${SITE_URL}/empresas/swiss-medical/vs-osde` },
  keywords: [
    'swiss medical vs osde empresas', 'plan corporativo mas barato osde swiss medical',
    'cambiar de osde a swiss medical empresa', 'bajar costo obra social empleados',
  ],
}

const faqs = [
  {
    q: '¿Por qué el plan corporativo de Swiss Medical suele salir más económico que el de OSDE?',
    a: 'OSDE no tiene sanatorios propios: terceriza el 100% de la atención con convenios, lo que encarece su estructura de costos. Swiss Medical tiene 9 sanatorios propios y controla mejor ese costo, y lo traslada a una cuota corporativa más accesible en planes de nivel equivalente.',
  },
  {
    q: '¿Cuánto puede ahorrar mi empresa cambiando de OSDE a Swiss Medical?',
    a: 'Varía según la composición del equipo (edades, cantidad de gente), pero en las cotizaciones que armamos habitualmente el plan corporativo de Swiss Medical resulta significativamente más accesible que el equivalente de OSDE — en varios casos, hasta la mitad. El número exacto para tu empresa te lo damos en la cotización comparada.',
  },
  {
    q: '¿Perdemos cartilla si cambiamos de OSDE a Swiss Medical?',
    a: 'Depende del plan de origen y destino que se comparen. Swiss Medical tiene sanatorios propios de primer nivel (Suizo Argentina, Los Arcos, Agote, Zabala, Olivos, San Lucas) que OSDE no tiene, aunque OSDE declara mayor cantidad total de profesionales en convenio. Te mostramos el comparativo de cartilla concreto en la cotización.',
  },
  {
    q: '¿Se puede migrar el convenio corporativo sin afectar a los empleados?',
    a: 'Sí, es un proceso que gestiona la prepaga entrante junto con RRHH. La cobertura no se corta durante la transición: se coordina la fecha de baja de un convenio con el alta del otro.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Swiss Medical vs. OSDE para empresas',
    description: 'Comparativa de planes corporativos entre Swiss Medical y OSDE para empresas y pymes.',
    url: `${SITE_URL}/empresas/swiss-medical/vs-osde`,
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
      { '@type': 'ListItem', position: 3, name: 'Swiss Medical', item: `${SITE_URL}/empresas/swiss-medical` },
      { '@type': 'ListItem', position: 4, name: 'vs. OSDE' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
]

export default function SwissMedicalVsOsdeEmpresasPage() {
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
            <span className="text-gray-700">vs. OSDE</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            Para empresas con convenio corporativo
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            ¿Tu empresa paga OSDE corporativo? Comparalo con Swiss Medical
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Es una de las migraciones de convenio que más armamos: empresas con OSDE que, al comparar un plan corporativo equivalente de Swiss Medical, encuentran una cuota bastante más accesible por persona — sin resignar cartilla de primer nivel.
          </p>
        </div>
      </section>

      {/* Por qué */}
      <section className="py-10 bg-white">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Por qué sale más barato, no solo "es más barato"</h2>
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 mb-4">
            <h3 className="font-bold text-gray-900 text-sm mb-2">OSDE terceriza el 100% de su red</h3>
            <p className="text-sm text-gray-600 leading-relaxed">OSDE no tiene sanatorios propios: toda la atención se resuelve por convenios con clínicas y sanatorios independientes. Esa estructura, con la red más grande del país, tiene un costo operativo más alto — y se traslada a la cuota.</p>
          </div>
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 text-sm mb-2">Swiss Medical controla su propia infraestructura</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Con 9 sanatorios propios (Suizo Argentina, Los Arcos, Agote, Zabala, Olivos, San Lucas) y centros ambulatorios propios, Swiss Medical maneja directamente buena parte de su costo de atención, en vez de pagarlo íntegro a terceros. Esa eficiencia es la que permite planes corporativos más accesibles en el mismo nivel de cobertura.</p>
          </div>
        </div>
      </section>

      {/* El dato del asesor */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <div className="bg-white border-2 border-green-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Lo que vemos en las cotizaciones reales</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              En los convenios corporativos que armamos, el plan de Swiss Medical equivalente a un OSDE corporativo suele salir significativamente más accesible por persona — en varios casos, hasta la mitad de la cuota. Cuánto ahorra tu empresa puntual depende de la composición del equipo (edades, cantidad de gente) y del plan de OSDE que tengan hoy: te lo mostramos con números reales en la cotización comparada, no con un porcentaje genérico.
            </p>
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section id="cotizar" className="py-12 bg-white border-t border-gray-100">
        <div className="container max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Comparemos tu convenio actual</h2>
            <p className="text-sm text-gray-500">Contanos que hoy tenés OSDE y armamos el comparativo con números reales de tu equipo.</p>
          </div>
          <PedirPropuestaCard prepagaContexto="Swiss Medical vs. OSDE — ya tiene OSDE corporativo" />
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

      <section className="py-8 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto text-center">
          <Link href="/empresas/swiss-medical" className="text-sm font-semibold text-[#E8002D] hover:underline">
            ← Ver el resto de los planes corporativos de Swiss Medical
          </Link>
        </div>
      </section>
    </>
  )
}
