import type { Metadata } from 'next'
import Link from 'next/link'
import { BuscadorPreexistenciasConUrl } from '@/components/herramientas/BuscadorPreexistencias'
import {
  CATEGORIAS_DDJJ, NIVEL_DOC, PREEXISTENCIAS_DOC_FECHA, SIN_AUDITORIA_LISTA,
  preexistenciasDeCategoria,
} from '@/lib/data/preexistencias-documentacion'
import { SITE_NAME, SITE_URL, OG_IMAGE } from '@/lib/utils'

// Buscador de preexistencias (27-sep-2026, pedido de Darío, "como lo hacemos
// con las cartillas"): qué documentación te piden al afiliarte según lo que
// declares. La lista completa va también en el HTML, por tema, para que se
// indexe cada condición ("prepaga con diabetes qué piden", "declaración
// jurada de salud prepaga"). La ley y el trámite están en
// /condiciones/preexistencias: acá solo lo práctico, sin repetirlo.

const URL = `${SITE_URL}/declaracion-jurada-de-salud`
const TITULO = 'Declaración jurada de salud en prepagas: qué papeles te piden'
const DESCRIPCION = 'Buscá tu condición (diabetes, presión alta, hernia de disco…) y mirá qué documentación te piden al afiliarte a una prepaga, qué pasa sin auditoría y qué pasa después.'

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: URL },
  keywords: ['declaracion jurada de salud prepaga', 'que documentacion piden para afiliarse a una prepaga', 'prepaga preexistencia documentacion', 'resumen de historia clinica prepaga', 'auditoria medica prepaga', 'prepaga con diabetes requisitos'],
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'website', images: [OG_IMAGE] },
}

const faqs = [
  {
    q: '¿Qué es la declaración jurada de salud?',
    a: 'Es el formulario que completás al afiliarte a una prepaga, con preguntas sobre enfermedades, cirugías, internaciones, tratamientos y medicación, tuyas y de cada integrante del grupo. Según la Ley 26.682, las preexistencias solo pueden establecerse a partir de esa declaración.',
  },
  {
    q: '¿Qué es un resumen de historia clínica?',
    a: 'Es un informe firmado y sellado por tu médico, en general el especialista que te trata, y es lo que más se pide. Tiene que decir: la fecha de la primera consulta y el motivo, el diagnóstico, los síntomas y el tiempo de evolución, otros antecedentes o enfermedades, los estudios que te hiciste (con fecha y resultado resumido), la medicación que tomás y desde cuándo, y si tenés certificado único de discapacidad. Tiene que estar actualizado.',
  },
  {
    q: '¿Tengo que declarar algo que ya se curó?',
    a: 'Sí: la declaración pregunta también por internaciones, cirugías y tratamientos pasados. Declaralo aunque esté resuelto y adjuntá la epicrisis o el informe del alta. Si no lo declarás y la prepaga lo detecta después, puede rescindir el contrato por falsedad de la declaración jurada.',
  },
  {
    q: '¿Me pueden rechazar por lo que declare?',
    a: 'La Ley 26.682 dice que las preexistencias no pueden ser criterio de rechazo. Lo que puede pasar es que el auditor médico pida más estudios o que la prepaga proponga una cuota diferencial, que tiene que autorizar la Superintendencia de Servicios de Salud.',
  },
  {
    q: '¿De dónde sale esta lista? ¿Es igual en todas las prepagas?',
    a: 'Sale de nuestra experiencia como asesores con los criterios de auditoría de las prepagas. No es una lista oficial: cada prepaga tiene su propio criterio y puede pedirte más o menos. Por eso conviene que un asesor revise tu caso antes de presentar la declaración.',
  },
]

export default function DeclaracionJuradaPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Buscador de documentación para preexistencias',
      url: URL,
      description: DESCRIPCION,
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web',
      inLanguage: 'es-AR',
      dateModified: PREEXISTENCIAS_DOC_FECHA,
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'ARS' },
      provider: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Preexistencias', item: `${SITE_URL}/condiciones/preexistencias` },
        { '@type': 'ListItem', position: 3, name: 'Declaración jurada de salud' },
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

      <section className="bg-gradient-to-b from-red-50/60 to-white border-b border-gray-100 pt-8 pb-12">
        <div className="container max-w-3xl! mx-auto">
          <nav className="text-sm text-gray-500 mb-5">
            <Link href="/" className="hover:text-[#E8002D]">{SITE_NAME}</Link>
            <span className="mx-2 text-gray-300">›</span>
            <Link href="/condiciones/preexistencias" className="hover:text-[#E8002D]">Preexistencias</Link>
            <span className="mx-2 text-gray-300">›</span>
            <span className="text-gray-700">Declaración jurada de salud</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">Declaración jurada de salud: qué papeles te piden según tu preexistencia</h1>
          <p className="text-gray-700 mt-3 mb-6 leading-relaxed">
            Escribí lo que tenés o te trataste y te mostramos qué documentación suelen pedir las prepagas para afiliarte. Sumá todo a tu lista y llevalo junto: te ahorra idas y vueltas con el auditor.
          </p>
          <BuscadorPreexistenciasConUrl />
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-3xl! mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Lo que pasa sin auditoría médica</h2>
          <p className="text-sm text-gray-600 mb-4">
            Según nuestra experiencia, esto se declara pero no pasa por el auditor. Tampoco suelen pedir papeles por cosas como la miopía, las várices o una hipertensión controlada con uno o dos medicamentos.
          </p>
          <ul className="flex flex-wrap gap-2">
            {SIN_AUDITORIA_LISTA.map((s) => (
              <li key={s} className="rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm text-green-800">{s}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl! mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Todas las condiciones, por tema</h2>
          <p className="text-sm text-gray-600 mb-5">En el mismo orden que las preguntas de la declaración jurada.</p>
          <div className="space-y-2">
            {CATEGORIAS_DDJJ.map((cat) => {
              const items = preexistenciasDeCategoria(cat.slug)
              if (items.length === 0) return null
              return (
                <details key={cat.slug} id={cat.slug} className="group rounded-2xl border border-gray-200 bg-white">
                  <summary className="flex items-center justify-between gap-3 p-4 cursor-pointer list-none">
                    <h3 className="font-semibold text-gray-900 m-0">{cat.nombre}</h3>
                    <span className="flex items-center gap-2 text-xs text-gray-500">
                      {items.length}
                      <svg className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </span>
                  </summary>
                  <ul className="border-t border-gray-100 divide-y divide-gray-100">
                    {items.map((p) => (
                      <li key={p.slug} className="p-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h4 className="font-semibold text-gray-900 text-sm">{p.nombre}</h4>
                          <span className={`text-[11px] font-semibold rounded-full border px-2 py-0.5 ${NIVEL_DOC[p.nivel].clase}`}>{NIVEL_DOC[p.nivel].texto}</span>
                        </div>
                        {p.documentos.length > 0 && <p className="text-sm text-gray-700 mt-1.5 leading-relaxed">{p.documentos.join(' ')}</p>}
                        {p.nota && <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{p.nota}</p>}
                        {p.enlace && <Link href={p.enlace.href} className="inline-block mt-1.5 text-xs font-semibold text-[#E8002D] hover:underline">{p.enlace.texto} →</Link>}
                      </li>
                    ))}
                  </ul>
                </details>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-3xl! mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Qué pasa después de presentar los papeles</h2>
          <p className="text-gray-700 leading-relaxed">
            Si declaraste algo que pasa por auditoría, el auditor médico de la prepaga revisa la documentación y puede aceptarte con la cuota normal, pedirte más estudios o proponerte una cuota diferencial, que tiene que autorizar la Superintendencia de Servicios de Salud. Con el valor aprobado, vos decidís si aceptás. Derivar aportes o pagar como particular no cambia la evaluación.
          </p>
          <Link href="/condiciones/preexistencias" className="inline-block mt-3 text-sm font-bold text-[#E8002D] hover:underline">
            Preexistencias: qué dice la ley y cómo es el trámite →
          </Link>
        </div>
      </section>

      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl! mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold text-gray-900">{f.q}</h3>
                <p className="text-sm text-gray-700 leading-relaxed mt-1">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6">
            <Link href="/guias/prepaga-sin-periodo-carencia" className="text-sm font-semibold text-[#E8002D] hover:underline">Carencias: la ley y la práctica →</Link>
            <Link href="/guias/como-afiliarse-prepaga-requisitos" className="text-sm font-semibold text-[#E8002D] hover:underline">Requisitos para afiliarte →</Link>
            <Link href="/comparador" className="text-sm font-semibold text-[#E8002D] hover:underline">Cotizar por edad y zona →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
