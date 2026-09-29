import type { Metadata } from 'next'
import Link from 'next/link'
import { centrosPorEspecialidad, fuenteEspecialidades } from '@/lib/data/cartilla-zonas/especialidades'
import { SITE_NAME, SITE_URL, OG_IMAGE } from '@/lib/utils'

// Fertilización asistida (28-sep-2026, pedido de Darío): explica la Ley
// 26.862 + Decreto 956/2013 (fuente: InfoLeg, textos completos verificados).
// El buscador oficial de Swiss Medical solo clasifica "Esterilidad" en 2
// institutos en todo el país (28-sep-2026: Comodoro Rivadavia y Neuquén) —
// nada en CABA/GBA — así que en vez de un buscador por zona que a casi
// todo el mundo le queda vacío, se listan esos 2 y se deriva a la pestaña de
// Ginecología de /cartillas/swiss-medical (scripts/cartilla-swiss/especialidades.py)
// para el resto. Se suma OSDE cuando esté su cartilla oficial vigente 2026.

const URL = `${SITE_URL}/fertilizacion-asistida`
const TITULO = 'Fertilización asistida con prepaga: qué cubre la Ley 26.862 y centros por zona'
const DESCRIPCION = 'La Ley 26.862 obliga a las prepagas a cubrir la fertilización asistida: hasta 4 tratamientos de baja complejidad y 3 de alta complejidad por año, incluidos en el PMO. Te explicamos qué cubre exactamente y qué camino seguir para atenderte.'

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: URL },
  keywords: [
    'fertilizacion asistida prepaga',
    'ley 26862 prepaga',
    'cobertura fertilizacion in vitro argentina',
    'centros de fertilidad swiss medical',
    'cuantos tratamientos de fertilidad cubre la prepaga',
  ],
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'website', images: [OG_IMAGE] },
}

const puntos = [
  {
    t: 'Es un derecho, no un beneficio del plan',
    d: 'La Ley 26.862 obliga al sector público, las obras sociales y TODAS las prepagas (Ley 26.682) a cubrir la reproducción médicamente asistida. No depende del plan que tengas: es una prestación obligatoria en cualquier plan de cualquier prepaga.',
  },
  {
    t: 'Hasta 4 tratamientos de baja complejidad y 3 de alta por año',
    d: 'El Decreto 956/2013 (reglamentario) fija el límite: hasta 4 tratamientos anuales de baja complejidad (inducción de ovulación, inseminación) y hasta 3 de alta complejidad (FIV, ICSI), con un intervalo mínimo de 3 meses entre cada uno.',
  },
  {
    t: 'Primero baja complejidad, salvo indicación médica',
    d: 'Para acceder a alta complejidad hace falta haber hecho antes al menos 3 intentos de baja complejidad — salvo que una causa médica documentada justifique ir directo a alta complejidad.',
  },
  {
    t: 'La infertilidad no es preexistencia',
    d: 'La ley aclara expresamente que no se puede usar la infertilidad o la imposibilidad de concebir para excluirte, cobrarte un cargo extra o imponerte una carencia al afiliarte.',
  },
  {
    t: 'Para cualquier persona mayor de edad, sin importar el estado civil',
    d: 'El decreto reglamentario prohíbe expresamente que se exija estar en pareja o excluir por orientación sexual. Solo hace falta el consentimiento informado de quien se somete al tratamiento.',
  },
  {
    t: 'También cubre la preservación de la fertilidad',
    d: 'Si un tratamiento médico (por ejemplo, oncológico) puede comprometer tu capacidad de tener hijos en el futuro, la cobertura incluye la guarda de óvulos, espermatozoides o tejido reproductivo — incluso para menores de 18 años en esa situación.',
  },
]

const faqs = [
  {
    q: '¿Qué prepagas cubren la fertilización asistida?',
    a: 'Todas. La Ley 26.862 es obligatoria para el sector público, las obras sociales y todas las entidades de medicina prepaga habilitadas por la Ley 26.682, sin excepción y en cualquier plan.',
  },
  {
    q: '¿Cuántos intentos de FIV cubre la prepaga?',
    a: 'Hasta 3 tratamientos de alta complejidad (FIV, ICSI) por año, con un intervalo mínimo de 3 meses entre cada uno, según el Decreto 956/2013. Antes tenés que haber hecho al menos 3 intentos de baja complejidad, salvo que tu médico documente una razón para saltar ese paso.',
  },
  {
    q: '¿Necesito tener pareja o estar casado/a para acceder?',
    a: 'No. El decreto reglamentario prohíbe expresamente exigir estado civil u orientación sexual como condición. Alcanza con ser mayor de edad y dar el consentimiento informado.',
  },
  {
    q: '¿Hay período de carencia para fertilidad?',
    a: 'La ley establece que la infertilidad no puede considerarse preexistencia, así que no te pueden imponer una carencia especial por eso. Consultá con tu prepaga los plazos generales de afiliación de tu plan.',
  },
  {
    q: '¿Qué incluye exactamente la cobertura?',
    a: 'Diagnóstico, medicación, terapias de apoyo y los procedimientos: de baja complejidad (inducción de ovulación, estimulación ovárica, inseminación) y de alta complejidad (fecundación in vitro, ICSI, criopreservación y donación de óvulos/embriones, vitrificación de tejido reproductivo). Todo está incluido en el PMO.',
  },
]

export default function FertilizacionAsistidaPage() {
  const centrosFertilidad = centrosPorEspecialidad('swiss-medical', 'Esterilidad')
  const fuenteEsp = fuenteEspecialidades('swiss-medical')

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: TITULO,
      description: DESCRIPCION,
      url: URL,
      image: `${SITE_URL}/opengraph-image`,
      author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
      inLanguage: 'es-AR',
      about: { '@type': 'Legislation', name: 'Ley 26.862', legislationIdentifier: '26862' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Cartillas', item: `${SITE_URL}/cartillas` },
        { '@type': 'ListItem', position: 3, name: 'Fertilización asistida' },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-red-50/60 to-white border-b border-gray-100 pt-8 pb-12">
        <div className="container max-w-3xl! mx-auto">
          <nav className="text-sm text-gray-500 mb-5">
            <Link href="/" className="hover:text-[#E8002D]">{SITE_NAME}</Link>
            <span className="mx-2 text-gray-300">›</span>
            <Link href="/cartillas" className="hover:text-[#E8002D]">Cartillas</Link>
            <span className="mx-2 text-gray-300">›</span>
            <span className="text-gray-700">Fertilización asistida</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">
            Fertilización asistida con prepaga: qué cubre la ley y dónde atenderte
          </h1>
          <p className="text-gray-700 mt-3 leading-relaxed">
            La Ley 26.862 (2013) obliga a todas las prepagas a cubrir la reproducción médicamente asistida, en cualquier plan.
            Te explicamos qué cubre exactamente, con las dos normas oficiales, y qué camino seguir para atenderte.
          </p>
        </div>
      </section>

      {/* Qué dice la ley */}
      <section className="py-10 bg-white">
        <div className="container max-w-3xl! mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Qué dice la Ley 26.862</h2>
          <p className="text-sm text-gray-500 mb-6">
            Fuentes oficiales:{' '}
            <a href="https://servicios.infoleg.gob.ar/infolegInternet/anexos/215000-219999/216700/norma.htm" target="_blank" rel="noopener noreferrer" className="text-[#E8002D] hover:underline">
              Ley 26.862
            </a>{' '}
            y{' '}
            <a href="https://servicios.infoleg.gob.ar/infolegInternet/anexos/215000-219999/217628/norma.htm" target="_blank" rel="noopener noreferrer" className="text-[#E8002D] hover:underline">
              Decreto reglamentario 956/2013
            </a>{' '}
            (InfoLeg).
          </p>
          <div className="space-y-4">
            {puntos.map((p, i) => (
              <div key={p.t} className="flex items-start gap-4 bg-gray-50 rounded-2xl border border-gray-100 p-5">
                <span className="w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-sm font-bold text-[#E8002D] flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <div className="font-bold text-gray-900 text-sm mb-1">{p.t}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{p.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Centros de fertilidad: el buscador oficial de Swiss Medical solo
          clasifica específicamente "Esterilidad" en 2 institutos en todo el
          país (28-sep-2026) — en CABA/GBA y el resto no hay ninguno marcado
          así. En vez de un buscador por zona que le queda vacío a casi todo
          el mundo, se listan los 2 reales y se deriva a la pestaña de
          Ginecología (con cientos de centros) para el resto. */}
      {centrosFertilidad.length > 0 && (
        <section className="py-10 bg-gray-50 border-t border-gray-100">
          <div className="container max-w-3xl! mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 text-center">Centros de fertilidad</h2>
            <p className="text-sm text-gray-500 mb-6 text-center">
              En su buscador oficial (consultado el {fuenteEsp?.vigencia}), Swiss Medical clasifica específicamente como &quot;Esterilidad&quot; solo estos {centrosFertilidad.length} centros en todo el país. Cubren los tres planes (SMG02, SMG20 y SMG30).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {centrosFertilidad.map(({ zona, centro }) => {
                const s = centro.sedes[0]
                const maps = s?.lat != null && s?.lon != null ? `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}` : null
                return (
                  <div key={centro.nombre} className="bg-white rounded-xl border border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-900 text-sm">{centro.nombre}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{zona}</p>
                    {s && (
                      <p className="text-xs text-gray-600 mt-2">
                        {s.direccion}
                        {s.localidad && ` · ${s.localidad}`}
                        {s.tel && <> · Tel. {s.tel}</>}
                      </p>
                    )}
                    {maps && (
                      <a href={maps} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-xs font-semibold text-[#E8002D] hover:underline">
                        Cómo llegar →
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
            <p className="text-sm text-gray-600 bg-white border border-gray-200 rounded-2xl p-5">
              ¿No estás cerca de estos dos? En el resto del país, la vía habitual es que tu ginecólogo/a de cartilla te derive a un centro de fertilidad —
              no hace falta que figure con ese rótulo específico en el buscador. Mirá los ginecólogos y centros de Swiss Medical en tu zona en la{' '}
              <Link href="/cartillas/swiss-medical" className="font-semibold text-[#E8002D] hover:underline">
                cartilla por especialidad →
              </Link>
            </p>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-3xl! mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Preguntas frecuentes</h2>
          <div className="space-y-2">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group rounded-xl border border-gray-200 bg-white">
                <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                  <h3 className="font-semibold text-sm text-gray-900 m-0">{q}</h3>
                  <svg className="w-4 h-4 text-gray-400 shrink-0 ml-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-12 bg-[#E8002D] text-white">
        <div className="container max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">¿No tenés prepaga todavía?</h2>
          <p className="text-red-200 text-sm mb-6">
            Cualquier prepaga que contrates cubre fertilización asistida por ley, en cualquier plan. Comparamos precios reales para tu edad, gratis y sin DNI.
          </p>
          <Link
            href="/comparador"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E8002D] font-bold rounded-2xl hover:bg-red-50 transition-all shadow-lg text-sm"
          >
            Comparar prepagas gratis →
          </Link>
        </div>
      </section>
    </>
  )
}
