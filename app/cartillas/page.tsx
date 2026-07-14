import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL, SITE_NAME } from '@/lib/utils'
import { BuscadorSanatorio } from '@/components/cartillas/BuscadorSanatorio'
import { BreadcrumbSchema } from '@/components/ui/BreadcrumbSchema'

export const metadata: Metadata = {
  title: 'Cartillas Médicas por Prepaga Argentina 2026 — PrepagaYa',
  description:
    'Buscá en qué planes y prepagas está cubierto tu sanatorio u hospital. Acceso directo a las cartillas de Swiss Medical, OSDE, Omint, Medicus, Sancor, Medifé, CEMIC y Premedic.',
  alternates: { canonical: `${SITE_URL}/cartillas` },
}

const cartillas = [
  {
    slug: 'swiss-medical',
    nombre: 'Swiss Medical',
    url: 'https://www.swissmedical.com.ar/smg/cartilla',
    profesionales: '8.000+ en red propia / 50.000+ red abierta',
    tip: 'Filtrá por "Médicos SMG" para ver solo los centros Swiss Medical propios.',
    planes: 'SMG02, S1, S2, SMG20, SMG30, SMG40, SMG50',
    inicial: 'S',
    bgColor: '#FECDD3',
    textColor: '#9F1239',
  },
  {
    slug: 'osde',
    nombre: 'OSDE',
    url: 'https://www.osde.com.ar/cartilla',
    profesionales: '140.000+ a nivel nacional',
    tip: 'Usá la Cartilla Inteligente con IA — escribí el síntoma y te recomienda el especialista.',
    planes: 'Plan 210, 310, 410, 510, Flux',
    inicial: 'O',
    bgColor: '#DBEAFE',
    textColor: '#1E3A8A',
  },
  {
    slug: 'cemic',
    nombre: 'CEMIC',
    url: 'https://www.cemic.edu.ar/cartilla',
    profesionales: 'Red propia CEMIC + red complementaria',
    tip: 'Filtrá por sede CEMIC (Las Heras, Galván, Saavedra) para el más cercano a tu casa.',
    planes: 'Plan A, Plan B',
    inicial: 'C',
    bgColor: '#DBEAFE',
    textColor: '#1E40AF',
  },
  {
    slug: 'sancor-salud',
    nombre: 'Sancor Salud',
    url: 'https://www.sancorsalud.com.ar/cartilla',
    profesionales: '30.000+ prestadores nacionales',
    tip: 'Buscá por especialidad + ciudad. La red más amplia del interior del país.',
    planes: 'F700, F800, Plan 1000, 1500, 3000, 4500',
    inicial: 'SS',
    bgColor: '#FECDD3',
    textColor: '#9F1239',
  },
  {
    slug: 'premedic',
    nombre: 'Premedic',
    url: 'https://www.premedic.com.ar/cartilla',
    profesionales: '15.000+ en AMBA y ciudades seleccionadas',
    tip: 'Cartilla disponible en AMBA, Córdoba, Rosario, Tucumán y Mendoza únicamente.',
    planes: 'Plan 200, Plan 300',
    inicial: 'P',
    bgColor: '#DBEAFE',
    textColor: '#1E40AF',
  },
  {
    slug: 'medife',
    nombre: 'Medifé',
    url: 'https://www.medife.com.ar/cartilla',
    profesionales: '60.000+ profesionales',
    tip: 'Filtrá por plan para verificar que tu médico esté cubierto en el plan específico.',
    planes: 'Medifé+, Bronce, Plata, Oro, Platinum',
    inicial: 'M',
    bgColor: '#D1FAE5',
    textColor: '#065F46',
  },
  {
    slug: 'omint',
    nombre: 'Omint',
    url: 'https://www.omint.com.ar/cartilla',
    profesionales: '10.000+ profesionales · 3 sanatorios propios',
    tip: 'Bazterrica, Del Sol y Santa Isabel están incluidos desde el plan más básico. Buscá por especialidad en el portal.',
    planes: 'Smart, Global, Clásico, Premium',
    inicial: 'Om',
    bgColor: '#DBEAFE',
    textColor: '#1E40AF',
  },
  {
    slug: 'medicus',
    nombre: 'Medicus',
    url: 'https://medicus.com.ar/cartilla',
    profesionales: '10.000+ en red · 11 centros propios',
    tip: 'Buscá por el Centro Médico más cercano (Azcuénaga, Belgrano, San Isidro, Mar del Plata, Neuquén, etc.) o por especialidad.',
    planes: 'Integra X, Family, Celeste, Azul',
    inicial: 'Mc',
    bgColor: '#EDE9FE',
    textColor: '#5B21B6',
  },
]

const faqItems = [
  {
    q: '¿Puedo atenderme con cualquier médico?',
    a: 'Depende del tipo de red de tu plan. Con red abierta (como OSDE Plan 310 o 410), podés atenderte con cualquier médico del país que tenga convenio OSDE, sin importar dónde ni cuándo. Con red cerrada o propia (como los planes SMG de Swiss Medical o las sedes CEMIC), tu atención está limitada a los centros y profesionales de la propia red. Antes de contratar, verificá qué tipo de red tiene el plan que te interesa.',
  },
  {
    q: '¿Qué pasa si mi médico no está en cartilla?',
    a: 'Tenés tres opciones: podés pedirle a tu prepaga una derivación especial si el médico es un especialista de difícil acceso, podés pagar la consulta como particular y pedir un reintegro parcial (monto y porcentaje dependen del plan), o podés evaluar cambiar de plan o de prepaga para acceder a una red que incluya a ese profesional. En general, reintegros parciales rondan el 40-60% del valor de la consulta.',
  },
  {
    q: '¿Las cartillas se actualizan con frecuencia?',
    a: 'Sí, las prepagas actualizan sus cartillas mensualmente. Los médicos pueden ingresar o salir de la cartilla en cualquier momento. Por eso es importante verificar la disponibilidad de tu médico directamente en la cartilla oficial de la prepaga antes de cada consulta, y no confiar en información de meses anteriores.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

export default function CartillasPage(): React.ReactElement {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="container">
          <BreadcrumbSchema crumbs={[{ label: 'Cartillas médicas de prepagas' }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-red-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-red-100 text-[#E8002D] text-xs font-semibold px-4 py-2 rounded-full mb-5 shadow-sm">
            Sin registro · Acceso directo
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Cartillas médicas de prepagas Argentina 2026
          </h1>
          <p className="text-gray-600 text-base max-w-2xl mx-auto leading-relaxed">
            Buscá en qué planes cubre tu hospital favorito, o accedé directo a la cartilla oficial de cada prepaga. Verificá antes de contratar.
          </p>
        </div>
      </section>

      {/* Buscador inverso por sanatorio */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-semibold px-4 py-2 rounded-full mb-4">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              Buscador inverso · Beta
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¿En qué planes cubre mi hospital o sanatorio?
            </h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              Escribí el nombre del sanatorio o hospital y te mostramos en qué planes de qué prepagas está cubierto, con el precio de cada uno.
            </p>
          </div>
          <BuscadorSanatorio />
        </div>
      </section>

      {/* Grilla de cartillas */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cartillas.map((c) => (
              <div
                key={c.slug}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-red-200 transition-all flex flex-col"
              >
                <div className="p-6 flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0"
                      style={{ backgroundColor: c.bgColor, color: c.textColor }}
                    >
                      {c.inicial}
                    </div>
                    <h2 className="font-bold text-xl text-gray-900">{c.nombre}</h2>
                  </div>

                  {/* Datos */}
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-800">Profesionales:</span> {c.profesionales}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-800">Planes:</span> {c.planes}
                    </p>
                  </div>

                  {/* Tip */}
                  <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    <p className="text-xs font-semibold text-[#E8002D] mb-0.5">Consejo de búsqueda</p>
                    <p className="text-xs text-red-800 leading-relaxed">{c.tip}</p>
                  </div>
                </div>

                {/* Footer de card */}
                <div className="px-6 pb-6 flex flex-col gap-2">
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#E8002D] hover:bg-[#B8001F] text-white font-semibold rounded-xl text-sm transition-colors"
                  >
                    Abrir cartilla oficial
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <path d="M15 3h6v6" />
                      <path d="M10 14L21 3" />
                    </svg>
                  </a>
                  <Link
                    href={`/cartillas/${c.slug}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-red-100 text-[#E8002D] hover:bg-red-50 font-semibold rounded-xl text-sm transition-colors"
                  >
                    Guía de la cartilla {c.nombre} →
                  </Link>
                  <Link
                    href={`/prepagas/${c.slug}`}
                    className="text-center text-sm font-medium text-[#E8002D] hover:underline"
                  >
                    Ver planes y precios →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección informativa */}
      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Qué es la cartilla médica?</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            La cartilla médica es el directorio de profesionales, clínicas, laboratorios y centros de diagnóstico que tienen convenio con tu prepaga. Es el primer documento que tenés que consultar antes de sacar un turno para asegurarte de que la consulta va a ser cubierta por tu plan.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mb-3">Red abierta vs. red cerrada</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm font-semibold text-gray-900 mb-2">Red abierta</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Podés atenderte con cualquier profesional del país que esté en convenio, sin importar dónde esté su consultorio. OSDE es el ejemplo más conocido: con más de 140.000 profesionales, prácticamente cualquier médico tiene convenio OSDE. Los planes de red abierta suelen ser más caros.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm font-semibold text-gray-900 mb-2">Red cerrada o propia</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                La atención está limitada a los centros y profesionales propios de la prepaga. Swiss Medical es el caso más claro: los planes SMG te atienden en sanatorios Swiss Medical (Suizo Argentina, Los Arcos, etc.). La ventaja es que la coordinación y el historial clínico son centralizados; la desventaja es que no podés elegir libremente.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-3">¿Qué pasa si tu médico no está en cartilla?</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Si el médico que querés consultar no figura en la cartilla de tu plan, tenés básicamente tres caminos: solicitar una derivación especial a tu prepaga (aplica para especialistas de difícil acceso), pagar la consulta como particular y gestionar un reintegro parcial, o revisar si existe un plan de la misma prepaga con una red más amplia que sí incluya a ese profesional.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Preguntas frecuentes sobre cartillas</h2>
          <div className="space-y-3">
            {faqItems.map((item) => (
              <details key={item.q} className="bg-gray-50 rounded-xl border border-gray-200 group">
                <summary className="flex items-center justify-between gap-4 px-5 py-4 font-semibold text-gray-900 text-sm cursor-pointer list-none select-none">
                  {item.q}
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-12 bg-red-50 border-t border-red-100">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Antes de elegir cartilla, compará precios
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            La red de médicos importa, pero el precio también. Compará planes de las 6 prepagas principales en menos de 2 minutos.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8002D] hover:bg-[#0b7a70] text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
          >
            Comparar prepagas ahora →
          </Link>
        </div>
      </section>
    </>
  )
}
