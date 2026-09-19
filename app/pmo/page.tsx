import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_NAME, SITE_URL, CONTENT_UPDATE } from '@/lib/utils'
import { condiciones } from '@/lib/data/condiciones'
import { coberturas } from '@/lib/data/coberturas'
import { StickySectionNav } from '@/components/ui/StickySectionNav'

export const metadata: Metadata = {
  title: 'PMO 2026: Qué Cubre el Programa Médico Obligatorio por Ley',
  description: 'Guía completa y detallada del Programa Médico Obligatorio (PMO) en Argentina: qué cubre cada categoría, porcentajes de medicamentos (40%, 70%, 100%), leyes especiales y qué hacer si te niegan una prestación. Fuente: SSSalud.',
  alternates: { canonical: `${SITE_URL}/pmo` },
  keywords: [
    'pmo que cubre', 'programa medico obligatorio', 'pmo 2026', 'que cubre el pmo por ley',
    'resolucion 201/2002 sssalud', 'pmo medicamentos porcentaje', 'pmo prepaga obligatorio',
  ],
  openGraph: {
    title: 'PMO 2026: Qué Cubre el Programa Médico Obligatorio por Ley',
    description: 'Guía completa del PMO: cada categoría de cobertura, porcentajes de medicamentos y leyes especiales, con fuente oficial de la SSSalud.',
    type: 'article',
    modifiedTime: CONTENT_UPDATE,
  },
}

interface Seccion {
  id: string
  titulo: string
  cuerpo: React.ReactNode
}

const secciones: Seccion[] = [
  {
    id: 'que-es',
    titulo: 'Qué es el PMO y quién está obligado a cumplirlo',
    cuerpo: (
      <>
        <p className="text-gray-600 leading-relaxed">
          El Programa Médico Obligatorio (PMO) es el conjunto de prestaciones mínimas que toda obra social y toda prepaga de Argentina debe garantizar, sin excepción, sea cual sea el plan contratado. Lo estableció originalmente la <strong>Resolución 201/2002</strong> del entonces Ministerio de Salud (con el nombre de PMOE, Programa Médico Obligatorio de Emergencia) y desde entonces se fue ampliando con nuevas leyes especiales.
        </p>
        <p className="text-gray-600 leading-relaxed mt-3">
          La <strong>Ley 26.682</strong> (Marco Regulatorio de Medicina Prepaga, 2011) extendió esta obligación a las empresas de medicina prepaga: todas deben cubrir el PMO completo como piso mínimo, <strong>sin período de carencia, sin poder rechazarte por preexistencias y sin examen de admisión</strong> para las prestaciones que el programa incluye. Esto es válido para el plan más económico y el más caro por igual: la diferencia entre planes está en lo que cada empresa suma por encima de ese piso (habitación individual, cartilla más amplia, menores copagos), nunca en el PMO en sí.
        </p>
      </>
    ),
  },
  {
    id: 'atencion-primaria',
    titulo: 'Atención Primaria de la Salud',
    cuerpo: (
      <p className="text-gray-600 leading-relaxed">
        Consultas con médico de cabecera y médico clínico o de familia, control de salud (chequeos preventivos según edad y sexo), atención domiciliaria programada, y todos los programas de prevención: control de embarazo, planificación familiar, vacunación del calendario nacional, y detección temprana de enfermedades prevalentes (hipertensión, diabetes, cáncer de mama y de cuello uterino). Es la puerta de entrada al sistema y no puede tener copagos que la vuelvan inaccesible.
      </p>
    ),
  },
  {
    id: 'atencion-secundaria',
    titulo: 'Atención Secundaria: especialistas y estudios',
    cuerpo: (
      <p className="text-gray-600 leading-relaxed">
        Consultas con todas las especialidades médicas, estudios de diagnóstico por laboratorio, estudios de diagnóstico por imágenes (radiografía, ecografía, tomografía, resonancia), prácticas de diagnóstico y tratamiento ambulatorio, y las prácticas de alta complejidad cuando hay indicación médica (hemodinamia, medicina nuclear, radioterapia, litotricia). Los planes con copago pueden cobrarte un monto fijo por consulta o estudio, pero nunca pueden negarte la prestación en sí si está indicada por tu médico.
      </p>
    ),
  },
  {
    id: 'internacion',
    titulo: 'Internación',
    cuerpo: (
      <p className="text-gray-600 leading-relaxed">
        Internación clínica y quirúrgica <strong>sin límite de días</strong>, en Unidad de Terapia Intensiva (UTI) o Unidad Coronaria cuando corresponde, cirugías de cualquier complejidad, anestesia, y traslados en ambulancia con indicación médica (incluidos los traslados entre centros cuando el que te atiende no tiene la complejidad necesaria). No hay tope de días de internación ni de cantidad de cirugías: el único límite es la indicación médica.
      </p>
    ),
  },
  {
    id: 'salud-mental',
    titulo: 'Salud Mental',
    cuerpo: (
      <p className="text-gray-600 leading-relaxed">
        La <strong>Ley 26.657</strong> (Ley de Salud Mental) obliga a cubrir psicología, psiquiatría y psicopedagogía en igualdad de condiciones que cualquier otra enfermedad: no pueden aplicarse límites de sesiones por año distintos a los que rigen para otras especialidades, ni un copago desproporcionado que funcione como barrera de acceso. Incluye tratamiento ambulatorio, internación en salud mental cuando está indicada, y hospital de día. Ver el detalle completo en <Link href="/condiciones/salud-mental" className="text-[#E8002D] font-semibold hover:underline">prepagas y salud mental</Link>.
      </p>
    ),
  },
  {
    id: 'rehabilitacion',
    titulo: 'Rehabilitación',
    cuerpo: (
      <p className="text-gray-600 leading-relaxed">
        Kinesiología, fonoaudiología, terapia ocupacional y rehabilitación motriz, cognitiva y del lenguaje, tanto para recuperación post-quirúrgica o post-traumática como para condiciones crónicas. Para las personas con discapacidad, esta cobertura se amplía y se vuelve del 100% por la Ley 24.901 (ver más abajo).
      </p>
    ),
  },
  {
    id: 'odontologia',
    titulo: 'Odontología',
    cuerpo: (
      <p className="text-gray-600 leading-relaxed">
        Consulta odontológica, diagnóstico, prevención (control y profilaxis), operatoria dental (obturaciones), extracciones y radiografías odontológicas. Quedan fuera del piso obligatorio la ortodoncia en adultos, los implantes y la odontología estética — ahí sí compiten los planes de cada prepaga con coberturas superadoras o descuentos en redes propias.
      </p>
    ),
  },
  {
    id: 'medicamentos',
    titulo: 'Medicamentos: el detalle del 40%, 70% y 100%',
    cuerpo: (
      <div className="space-y-4">
        <p className="text-gray-600 leading-relaxed">
          La cobertura de medicamentos ambulatorios tiene tres niveles según el tipo de tratamiento, calculados sobre el precio de referencia del Anexo IV de la Resolución 201/2002:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-2.5 px-3 font-semibold text-gray-700">Nivel</th>
                <th className="text-left py-2.5 px-3 font-semibold text-gray-700">Aplica a</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2.5 px-3 font-bold text-gray-900">40%</td>
                <td className="py-2.5 px-3 text-gray-600">Piso mínimo para medicamentos ambulatorios en general (uso agudo, no crónico).</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-gray-900">70%</td>
                <td className="py-2.5 px-3 text-gray-600">Medicación para enfermedades crónicas prevalentes: hipertensión, diabetes (hipoglucemiantes orales), colesterol, epilepsia, entre otras.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-gray-900">100%</td>
                <td className="py-2.5 px-3 text-gray-600">Insulina, medicación oncológica, tratamiento de HIV, medicación para discapacidad (Ley 24.901), inmunosupresores post-trasplante, y medicación en internación.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-gray-600 leading-relaxed">
          Muchas prepagas mejoran estos pisos como diferencial comercial en sus planes medios y altos — pero nunca pueden ofrecer menos de esta tabla, sea cual sea el plan.
        </p>
      </div>
    ),
  },
  {
    id: 'otras-coberturas',
    titulo: 'Otras coberturas obligatorias por leyes especiales',
    cuerpo: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed mb-2">
          Además del Anexo I, una serie de leyes específicas amplían el PMO para condiciones puntuales. Todas se cubren al 100% salvo que se indique lo contrario:
        </p>
        <ul className="space-y-2.5">
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8002D] mt-2 flex-shrink-0" />
            <span className="text-gray-600 text-sm"><strong>Maternidad e infancia</strong> — embarazo, parto (vaginal o cesárea) y atención del recién nacido hasta el año, sin copagos ni carencias.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8002D] mt-2 flex-shrink-0" />
            <span className="text-gray-600 text-sm"><strong>Discapacidad</strong> (Ley 24.901) — rehabilitación, transporte especial, integración escolar y apoyos, sin límite y sin carencia. Ver <Link href="/condiciones/discapacidad" className="text-[#E8002D] font-semibold hover:underline">prepagas para discapacidad</Link>.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8002D] mt-2 flex-shrink-0" />
            <span className="text-gray-600 text-sm"><strong>Fertilización asistida</strong> (Ley 26.862) — hasta 4 tratamientos de baja complejidad y 3 de alta complejidad por año, incluida la medicación. Ver <Link href="/coberturas/fertilidad" className="text-[#E8002D] font-semibold hover:underline">cobertura de fertilidad</Link>.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8002D] mt-2 flex-shrink-0" />
            <span className="text-gray-600 text-sm"><strong>Diabetes</strong> (Ley 23.753) — insulina, tiras reactivas según tipo, y equipamiento (bombas de insulina con indicación médica). Ver <Link href="/condiciones/diabetes" className="text-[#E8002D] font-semibold hover:underline">prepagas para diabéticos</Link>.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8002D] mt-2 flex-shrink-0" />
            <span className="text-gray-600 text-sm"><strong>Celiaquía</strong> (Ley 26.588) — harinas y premezclas libres de gluten con reintegro mensual. Ver <Link href="/condiciones/celiacos" className="text-[#E8002D] font-semibold hover:underline">prepagas para celíacos</Link>.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8002D] mt-2 flex-shrink-0" />
            <span className="text-gray-600 text-sm"><strong>Trastornos del Espectro Autista</strong> (Ley 27.043) — diagnóstico y tratamiento (terapias ABA, fonoaudiología, terapia ocupacional) sin límite de edad. Ver <Link href="/condiciones/autismo" className="text-[#E8002D] font-semibold hover:underline">prepagas para autismo</Link>.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8002D] mt-2 flex-shrink-0" />
            <span className="text-gray-600 text-sm"><strong>Oncología</strong> — diagnóstico, cirugía, radioterapia, quimioterapia y medicación oncológica al 100%, sin límite de tratamientos mientras haya indicación médica. Ver <Link href="/coberturas/oncologia" className="text-[#E8002D] font-semibold hover:underline">cobertura oncológica</Link>.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8002D] mt-2 flex-shrink-0" />
            <span className="text-gray-600 text-sm"><strong>Enfermedad renal crónica</strong> — hemodiálisis, diálisis peritoneal y trasplante renal al 100%, con reintegro a la prepaga vía el Sistema Único de Reintegro (SUR) de la SSSalud. Ver <Link href="/condiciones/enfermedad-renal-cronica" className="text-[#E8002D] font-semibold hover:underline">prepagas para diálisis</Link>.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8002D] mt-2 flex-shrink-0" />
            <span className="text-gray-600 text-sm"><strong>HIV y hepatitis</strong> (Ley 24.455) — diagnóstico, tratamiento antirretroviral y medicación al 100%, con reserva de confidencialidad reforzada.</span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'que-no-cubre',
    titulo: 'Qué NO cubre el PMO',
    cuerpo: (
      <p className="text-gray-600 leading-relaxed">
        Quedan fuera del piso obligatorio: cirugía estética sin causa médica (reconstructiva sí está cubierta), ortodoncia e implantes dentales en adultos, habitación individual (salvo indicación médica puntual), cobertura fuera de Argentina, medicina prepaga para mascotas obviamente no aplica, y los reintegros por atenderte con un profesional fuera de la cartilla de tu plan. Ahí es exactamente donde compiten los planes de cada prepaga: cuando pagás más, estás pagando estas prestaciones superadoras y una cartilla más amplia — nunca una cobertura del PMO "mejor" que en el plan económico, porque el PMO es idéntico en todos.
      </p>
    ),
  },
  {
    id: 'que-hacer',
    titulo: 'Qué hacer si te niegan una prestación del PMO',
    cuerpo: (
      <p className="text-gray-600 leading-relaxed">
        Pedí la negativa por escrito, reuní la indicación médica y presentá un reclamo formal ante tu prepaga u obra social. Si no responden en un plazo razonable o insisten con la negativa, la denuncia ante la <strong>Superintendencia de Servicios de Salud (SSSalud)</strong> es gratuita, no requiere abogado, y se hace online en <a href="https://www.sssalud.gob.ar" target="_blank" rel="noopener noreferrer" className="text-[#E8002D] font-semibold hover:underline">sssalud.gob.ar</a> o llamando al 0800-222-72583. La mayoría de las negativas sobre prestaciones del PMO se revierten apenas la SSSalud interviene. Para el paso a paso completo, ver <Link href="/guias/como-reclamar-a-una-prepaga" className="text-[#E8002D] font-semibold hover:underline">cómo reclamar a una prepaga</Link>.
      </p>
    ),
  },
]

const faq = [
  { q: '¿El PMO es el mismo en todas las prepagas y obras sociales?', a: 'Sí. El PMO es un piso mínimo fijado por ley (Resolución 201/2002 y sus actualizaciones), igual para todas las prepagas y obras sociales de Argentina, sin importar el plan que contrates. Lo que varía entre empresas y planes es todo lo que está por encima de ese piso: cartilla, habitación, copagos y prestaciones superadoras.' },
  { q: '¿El PMO tiene período de carencia?', a: 'No. Ninguna prestación del PMO puede tener período de carencia, ni siquiera si te afiliás con una enfermedad preexistente. Las carencias solo pueden aplicarse a prestaciones "superadoras" que están por fuera del PMO (por ejemplo, habitación individual u ortodoncia en adultos).' },
  { q: '¿Dónde está publicado el texto oficial del PMO?', a: 'El texto completo (Resolución 201/2002 y sus anexos, más las actualizaciones posteriores) está publicado en el sitio oficial de la Superintendencia de Servicios de Salud, en sssalud.gob.ar, y también resumido en argentina.gob.ar/sssalud/programa-medico-obligatorio.' },
  { q: '¿El plan más barato de una prepaga cubre menos que el más caro?', a: 'En las prestaciones del PMO, no: ambos cubren exactamente lo mismo por ley. Las diferencias reales entre un plan económico y uno premium están en la cartilla de prestadores, los copagos, la habitación y las prestaciones que van más allá del PMO.' },
  { q: '¿Las prepagas pueden cobrar copago por las prestaciones del PMO?', a: 'Sí, algunos planes con copago pueden cobrarte un monto fijo por consulta o práctica ambulatoria, siempre que esté claramente informado en el contrato. Lo que nunca pueden hacer es negarte la prestación en sí, ni cobrar un copago tan alto que funcione como una negativa encubierta.' },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'PMO: Qué Cubre el Programa Médico Obligatorio por Ley',
    description: 'Guía completa del Programa Médico Obligatorio en Argentina: cada categoría de cobertura, porcentajes de medicamentos y leyes especiales.',
    url: `${SITE_URL}/pmo`,
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
      { '@type': 'ListItem', position: 2, name: 'PMO' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  },
]

export default function PmoPage() {
  const condicionesLink = condiciones.slice(0, 8)
  const coberturasLink = coberturas.slice(0, 8)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <StickySectionNav items={secciones.map((s) => ({ id: s.id, label: s.titulo }))} />

      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-[#E8002D] transition-colors">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">PMO</span>
          </nav>
        </div>
      </div>

      <div className="container py-10 max-w-3xl mx-auto">
        <header className="mb-8">
          <span className="inline-block text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 mb-4">
            Referencia legal · Fuente: SSSalud
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            PMO: qué cubre el Programa Médico Obligatorio por ley
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 pb-6 border-b border-gray-100">
            <span>Actualizado {new Date(CONTENT_UPDATE.slice(0, 10) + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5">
                <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" strokeLinecap="round" />
              </svg>
              11 min de lectura
            </span>
            <span>{SITE_NAME}</span>
          </div>
        </header>

        {/* GEO: intro con la respuesta directa antes del índice */}
        <div className="bg-red-50 border-l-4 border-[#E8002D] rounded-r-xl p-5 mb-8">
          <p className="text-gray-800 leading-relaxed">
            El <strong>Programa Médico Obligatorio (PMO)</strong> es el piso de prestaciones que toda prepaga y obra social de Argentina debe cubrir por ley, sin importar el plan contratado ni cuánto pagués: consultas médicas, estudios, internación sin límite de días, salud mental, rehabilitación, odontología básica, medicamentos (40%, 70% o 100% según el caso) y toda una serie de leyes especiales para diabetes, discapacidad, fertilidad, oncología, celiaquía y más. Nunca puede tener carencias ni rechazarse por preexistencia. Está regulado por la <strong>Resolución 201/2002</strong> de la Superintendencia de Servicios de Salud (SSSalud) y ampliado desde entonces por leyes puntuales — esta guía lo desglosa categoría por categoría, con la fuente oficial de cada dato.
          </p>
        </div>

        {/* Índice */}
        <div className="mb-8 bg-gray-50 rounded-2xl border border-gray-200 p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">En esta guía</p>
          <ul className="space-y-2">
            {secciones.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#E8002D] transition-colors">
                  <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500 flex-shrink-0">{i + 1}</span>
                  {s.titulo}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Secciones */}
        <article className="space-y-10 mb-10">
          {secciones.map((seccion, i) => (
            <section key={seccion.id} id={seccion.id} className="scroll-mt-28">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-[11px] font-bold text-[#E8002D] flex-shrink-0">{i + 1}</span>
                {seccion.titulo}
              </h2>
              {seccion.cuerpo}
            </section>
          ))}
        </article>

        {/* Fuente oficial */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-10 flex items-start gap-3">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-gray-700 leading-relaxed">
            Esta guía está basada en la Resolución 201/2002 y sus actualizaciones, publicadas por la Superintendencia de Servicios de Salud. Podés consultar el texto oficial en{' '}
            <a href="https://www.argentina.gob.ar/sssalud/programa-medico-obligatorio" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">argentina.gob.ar/sssalud/programa-medico-obligatorio</a>
            {' '}y{' '}
            <a href="https://www.sssalud.gob.ar/pmo/res_201.php" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">sssalud.gob.ar/pmo</a>.
          </p>
        </div>

        {/* Profundizá por tema */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Profundizá por condición o cobertura</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {condicionesLink.map((c) => (
              <Link key={c.slug} href={`/condiciones/${c.slug}`} className="text-center bg-white border border-gray-200 rounded-xl py-3 px-2 hover:border-red-200 hover:bg-red-50 transition-all group">
                <span className="text-sm font-semibold text-gray-700 group-hover:text-[#E8002D]">{c.nombre}</span>
              </Link>
            ))}
            {coberturasLink.map((c) => (
              <Link key={c.slug} href={`/coberturas/${c.slug}`} className="text-center bg-white border border-gray-200 rounded-xl py-3 px-2 hover:border-red-200 hover:bg-red-50 transition-all group">
                <span className="text-sm font-semibold text-gray-700 group-hover:text-[#E8002D]">{c.nombre}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes sobre el PMO</h2>
          <div className="space-y-3">
            {faq.map((f) => (
              <details key={f.q} className="group bg-white rounded-xl border border-gray-200 p-4 open:border-blue-200">
                <summary className="font-semibold text-gray-900 text-sm cursor-pointer list-none flex items-center justify-between gap-3">
                  {f.q}
                  <span className="text-gray-300 group-open:rotate-45 transition-transform text-lg flex-shrink-0">+</span>
                </summary>
                <p className="text-sm text-gray-600 leading-relaxed mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-white font-bold">¿Ya sabés qué te tiene que cubrir? Ahora comparemos precios</div>
            <div className="text-red-200 text-xs">El PMO es igual en todas — la diferencia está en la cartilla y el precio. Cotizá gratis.</div>
          </div>
          <Link href="/comparador" className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-[#E8002D] font-bold rounded-xl text-sm hover:bg-red-50 transition-colors shadow-sm">
            Cotizar gratis →
          </Link>
        </div>

        <div className="mt-10 text-center">
          <Link href="/guias/que-cubre-la-prepaga" className="text-sm text-gray-400 hover:text-[#E8002D] transition-colors">
            ← Ver también: ¿Qué cubre una prepaga obligatoriamente?
          </Link>
        </div>
      </div>
    </>
  )
}
