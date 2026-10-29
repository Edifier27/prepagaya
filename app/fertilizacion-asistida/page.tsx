import type { Metadata } from 'next'
import Link from 'next/link'
import { centrosPorEspecialidad, fuenteEspecialidades } from '@/lib/data/cartilla-zonas/especialidades'
import { SITE_NAME, SITE_URL, OG_IMAGE } from '@/lib/utils'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'
import { prepagas } from '@/lib/data/prepagas'
import { ldJson } from '@/lib/jsonld'

// Fertilización asistida (28-sep-2026, pedido de Darío): explica la Ley
// 26.862 + Decreto 956/2013 (fuente: InfoLeg, textos completos verificados).
// El buscador oficial de Swiss Medical solo clasifica "Esterilidad" en 2
// institutos en todo el país (28-sep-2026: Comodoro Rivadavia y Neuquén) —
// nada en CABA/GBA — así que en vez de un buscador por zona que a casi
// todo el mundo le queda vacío, se listan esos 2 y se deriva a la pestaña de
// Ginecología de /cartillas/swiss-medical (scripts/cartilla-swiss/especialidades.py)
// para el resto. Se suma OSDE cuando esté su cartilla oficial vigente 2026.
//
// 29-oct-2026 (Darío): página única para "qué prepaga cubre fertilidad" (el
// post del blog redirige acá y /coberturas/fertilidad resume y enlaza).
// Respuesta directa arriba, tabla de tratamientos según la ley, Swiss
// primero con los 10 centros de fertilidad de su cartilla oficial (los de
// "Esterilidad" más los de Ginecología con nombre de centro de fertilidad),
// OSDE con lo que dice su página oficial de cobertura, y cómo pedir la
// autorización. Nada de convenios sin fuente.

const URL = `${SITE_URL}/fertilizacion-asistida`
const TITULO = 'Fertilización asistida con prepaga: tratamientos, centros y qué plan la cubre'
const DESCRIPCION = 'Todas las prepagas cubren la fertilización asistida por ley, en todos los planes: 4 tratamientos de baja y 3 de alta complejidad por año. FIV, ICSI, ovodonación, centros de Swiss Medical y OSDE.'

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
    'prepagas que cubren fertilizacion asistida',
    'osde fertilidad',
    'swiss medical fertilizacion asistida',
    'ovodonacion prepaga',
    'que plan cubre fertilizacion in vitro',
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
    q: '¿Qué plan de Swiss Medical u OSDE cubre la fertilización asistida?',
    a: 'Todos. La Ley 26.862 no distingue planes: el SMG02 de Swiss Medical o el 210 de OSDE cubren los mismos tratamientos que los planes más altos. Lo que cambia es la red de centros: Swiss Medical tiene centros de fertilidad en su cartilla oficial en Comodoro Rivadavia, Neuquén, Mar del Plata, Córdoba, Paraná, Jujuy, Bariloche y Tucumán, y OSDE cubre con los prestadores de su cartilla.',
  },
  {
    q: '¿La prepaga cubre la ovodonación?',
    a: 'Sí. La ley incluye las técnicas con donación de óvulos, semen o embriones, dentro de los topes de baja y alta complejidad. El banco de gametos tiene que estar inscripto en el registro oficial (REFES): hubo un fallo en el que se revocó la cobertura porque el banco del centro no lo estaba.',
  },
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


// Tratamientos según la Ley 26.862 (art. 2 y 8) y el Decreto 956/2013 (art. 2 y 8)
const tratamientos = [
  { t: 'Baja complejidad', que: 'Inducción de ovulación, estimulación ovárica controlada e inseminación intrauterina (con semen de la pareja o de donante).', tope: 'Hasta 4 por año', req: 'Mayor de edad y consentimiento informado.' },
  { t: 'Alta complejidad: FIV e ICSI', que: 'Fecundación in vitro e inyección intracitoplasmática de espermatozoides, con la transferencia de embriones.', tope: 'Hasta 3 por año, con 3 meses entre uno y otro', req: 'Antes, 3 intentos de baja complejidad, salvo indicación médica que justifique ir directo.' },
  { t: 'Donación de óvulos, semen o embriones', que: 'Ovodonación, donación de semen y de embriones, incluidas en las técnicas que cubre la ley.', tope: 'Dentro de los topes de baja o alta complejidad', req: 'El banco de gametos tiene que estar inscripto en el registro oficial (REFES).' },
  { t: 'Preservación de la fertilidad', que: 'Guarda de óvulos, espermatozoides o tejido reproductivo.', tope: 'Cuando hay indicación médica', req: 'Por un tratamiento o enfermedad que puede afectar la fertilidad (por ejemplo, oncológico), también en menores. La preservación electiva no es obligatoria.' },
  { t: 'Diagnóstico, medicación y terapias de apoyo', que: 'Estudios de diagnóstico, la medicación del tratamiento y las terapias de apoyo.', tope: 'Incluidos en el PMO', req: 'Con indicación del médico tratante.' },
]

// Centros de fertilidad en la cartilla oficial de Swiss Medical: los de
// "Esterilidad" y los de Ginecología con nombre de centro de fertilidad
const NOMBRE_FERTILIDAD = /reproduc|fertil|fecund|gestar|crecer/i
function centrosFertilidadSwiss() {
  const vistos = new Set<string>()
  return [...centrosPorEspecialidad('swiss-medical', 'Esterilidad'), ...centrosPorEspecialidad('swiss-medical', 'Ginecología').filter(({ centro }) => NOMBRE_FERTILIDAD.test(centro.nombre))]
    .filter(({ centro }) => !vistos.has(centro.nombre) && vistos.add(centro.nombre))
    .sort((a, b) => a.zona.localeCompare(b.zona, 'es'))
}

export default function FertilizacionAsistidaPage() {
  const centrosFertilidad = centrosFertilidadSwiss()
  const swiss = prepagas.find((p) => p.slug === 'swiss-medical')!
  const osde = prepagas.find((p) => p.slug === 'osde')!
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
        { '@type': 'ListItem', position: 2, name: 'Coberturas', item: `${SITE_URL}/coberturas` },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(jsonLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-red-50/60 to-white border-b border-gray-100 pt-8 pb-12">
        <div className="container max-w-3xl! mx-auto">
          <nav className="text-sm text-gray-500 mb-5">
            <Link href="/" className="hover:text-[#E8002D]">{SITE_NAME}</Link>
            <span className="mx-2 text-gray-300">›</span>
            <Link href="/coberturas" className="hover:text-[#E8002D]">Coberturas</Link>
            <span className="mx-2 text-gray-300">›</span>
            <span className="text-gray-700">Fertilización asistida</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">
            ¿Qué prepaga cubre la fertilización asistida? Todas, en todos los planes
          </h1>
          {/* Respuesta directa para Google y las IA */}
          <p className="text-gray-700 mt-3 leading-relaxed">
            La <strong>Ley 26.862</strong> obliga a todas las prepagas y obras sociales a cubrir la reproducción médicamente asistida, en cualquier plan y sin costo extra:
            hasta <strong>4 tratamientos de baja complejidad</strong> y <strong>3 de alta complejidad</strong> (FIV o ICSI) por año, con la medicación, la donación de óvulos o semen
            y la preservación de la fertilidad por motivo médico (Decreto 956/2013). Lo que cambia entre prepagas no es si lo cubren, sino <strong>en qué centros</strong> te atendés.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <a href="#tratamientos" className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 font-medium text-gray-700 hover:border-[#E8002D] hover:text-[#E8002D]">Tratamientos</a>
            <a href="#swiss-medical" className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 font-medium text-gray-700 hover:border-[#E8002D] hover:text-[#E8002D]">Centros de Swiss Medical</a>
            <a href="#osde" className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 font-medium text-gray-700 hover:border-[#E8002D] hover:text-[#E8002D]">OSDE</a>
            <a href="#autorizacion" className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 font-medium text-gray-700 hover:border-[#E8002D] hover:text-[#E8002D]">Cómo pedir la autorización</a>
          </div>
        </div>
      </section>

      {/* Tratamientos y qué cubre la ley */}
      <section id="tratamientos" className="py-10 bg-white scroll-mt-20">
        <div className="container max-w-3xl! mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Tratamientos que cubre la prepaga y con qué tope</h2>
          <p className="text-sm text-gray-500 mb-5">Igual en todas las prepagas y en todos los planes: es una prestación obligatoria del PMO. Fuente: Ley 26.862 y Decreto 956/2013.</p>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <caption className="sr-only">Tratamientos de fertilidad que cubre la prepaga por la Ley 26.862, con tope y requisito</caption>
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr><th className="px-3 py-2.5 font-semibold">Tratamiento</th><th className="px-3 py-2.5 font-semibold">Qué incluye</th><th className="px-3 py-2.5 font-semibold">Tope</th><th className="px-3 py-2.5 font-semibold">Requisito</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tratamientos.map((x) => (
                  <tr key={x.t} className="align-top">
                    <th scope="row" className="px-3 py-3 text-left font-semibold text-gray-900">{x.t}</th>
                    <td className="px-3 py-3 text-gray-600">{x.que}</td>
                    <td className="px-3 py-3 font-medium text-gray-800">{x.tope}</td>
                    <td className="px-3 py-3 text-gray-600">{x.req}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            <strong className="text-gray-900">¿Qué plan lo cubre?</strong> Todos. El SMG02 de Swiss Medical o el 210 de OSDE cubren lo mismo que el SMG70 o el 510: la ley no distingue planes.
            Lo que cambia entre planes es la red de centros y, en los de red abierta, la posibilidad de reintegro fuera de cartilla, que depende de las condiciones de cada plan.
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
        <section id="swiss-medical" className="py-10 bg-gray-50 border-t border-gray-100 scroll-mt-20">
          <div className="container max-w-3xl! mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 text-center">Swiss Medical: {centrosFertilidad.length} centros de fertilidad en su cartilla</h2>
            <p className="text-sm text-gray-500 mb-6 text-center">
              Según su buscador oficial de cartilla (consultado el {fuenteEsp?.vigencia}), estos son los centros de fertilidad y reproducción de Swiss Medical en el país,
              para los planes SMG02, SMG20 y SMG30. En CABA y GBA no figura ninguno con nombre de centro de fertilidad: ahí te deriva tu ginecólogo/a de cartilla.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {centrosFertilidad.map(({ zona, centro }) => {
                const s = centro.sedes[0]
                const maps = s?.lat && s?.lon ? `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}` : null
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
              ¿No estás cerca de estos centros? En el resto del país, la vía habitual es que tu ginecólogo/a de cartilla te derive a un centro de fertilidad —
              no hace falta que figure con ese rótulo en el buscador. Mirá los ginecólogos y centros de Swiss Medical en tu zona en la{' '}
              <Link href="/cartillas/swiss-medical" className="font-semibold text-[#E8002D] hover:underline">
                cartilla por especialidad →
              </Link>
            </p>

            <div className="mt-6 flex flex-col items-center gap-2 text-center">
              <ContratarPlanButton
                prepagaNombre={swiss.nombre}
                fuente="fertilidad-swiss"
                titulo="Tu precio con 15% OFF"
                label="Cotizá Swiss Medical con 15% OFF"
                planesOpciones={swiss.planes.map((pl) => pl.nombre)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-md text-sm"
              />
              <Link href="/prepagas/swiss-medical" className="text-sm font-semibold text-gray-600 hover:text-[#E8002D]">Ver los planes y precios de Swiss Medical →</Link>
            </div>
          </div>
        </section>
      )}

      {/* OSDE: lo que dice su página oficial de cobertura (sin lista de centros publicada que podamos citar) */}
      <section id="osde" className="py-10 bg-white border-t border-gray-100 scroll-mt-20">
        <div className="container max-w-3xl! mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">OSDE: fertilización asistida con prestadores de cartilla</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            En su página oficial de servicios y cobertura, OSDE informa que cubre la <strong>fertilización asistida de alta complejidad</strong> y la <strong>inseminación artificial
            de baja complejidad</strong> &quot;con prestadores e instituciones de cartilla, según Ley 26.862&quot;, en todos sus planes (210, 310, 410, 510 y Flux).
            Los centros los asigna la cartilla de tu zona: consultalos con tu ginecólogo/a o en la cartilla de OSDE antes de empezar.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Fuente: <a href="https://www.osde.com.ar/informacion-al-socio/servicios-y-cobertura/fertilidad" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#E8002D]">osde.com.ar, servicios y cobertura: fertilidad</a> (octubre 2026).
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <ContratarPlanButton
              prepagaNombre={osde.nombre}
              fuente="fertilidad-osde"
              conPromo={false}
              titulo="Cotizá OSDE"
              label="Cotizar OSDE"
              planesOpciones={osde.planes.map((pl) => pl.nombre)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#E8002D] text-[#E8002D] hover:bg-red-50 font-bold rounded-xl transition-all text-sm"
            />
            <Link href="/cartillas/osde" className="text-sm font-semibold text-gray-600 hover:text-[#E8002D]">Cartilla de OSDE por zona →</Link>
            <Link href="/prepagas/osde" className="text-sm font-semibold text-gray-600 hover:text-[#E8002D]">Planes y precios de OSDE →</Link>
          </div>
        </div>
      </section>

      {/* Cómo pedir la autorización */}
      <section id="autorizacion" className="py-10 bg-gray-50 border-t border-gray-100 scroll-mt-20">
        <div className="container max-w-3xl! mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cómo pedir la autorización a tu prepaga</h2>
          <ol className="space-y-3 text-sm text-gray-700">
            <li><strong className="text-gray-900">1. Consulta con un especialista de cartilla.</strong> Es quien indica el tratamiento (baja o alta complejidad) y te deriva a un centro de fertilidad de la red de tu prepaga.</li>
            <li><strong className="text-gray-900">2. Armá la documentación.</strong> Lo habitual es un resumen de historia clínica firmado por el médico, el tratamiento indicado, la medicación con las dosis y el consentimiento informado (Ley 26.529). Cada prepaga tiene su formulario: pedilo antes.</li>
            <li><strong className="text-gray-900">3. Confirmá que el centro esté habilitado.</strong> Tiene que estar inscripto en el registro oficial de establecimientos (REFES) del Ministerio de Salud; si hay donación de óvulos o semen, también el banco de gametos.</li>
            <li><strong className="text-gray-900">4. Si te la niegan o te piden carencia,</strong> pedí la respuesta por escrito y hacé el reclamo ante la Superintendencia de Servicios de Salud (0800-222-72583). La infertilidad no es preexistencia y lo que está en el PMO no tiene carencia.</li>
          </ol>
        </div>
      </section>


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
          <p className="text-white text-sm mb-6">
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
