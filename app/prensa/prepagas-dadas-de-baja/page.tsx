import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_NAME, SITE_URL } from '@/lib/utils'

// Informe de prensa (29-sep-2026, a pedido de Darío): qué prepagas dio de
// baja la Superintendencia y por qué — hay volumen de búsqueda real
// ("que prepagas dio de baja el gobierno") y la respuesta necesita fuente
// oficial, no se puede inventar. Los 4 casos y los números de resolución
// salen de las Resoluciones 1400 a 1403/2026 (Boletín Oficial) y de la nota
// de Ámbito del 10/08/2026 que las resume con más detalle. Son entidades
// chicas sin actividad comprobada, no marcas conocidas — el título y el
// cuerpo lo aclaran para no generar alarma sobre las prepagas grandes.

const URL = `${SITE_URL}/prensa/prepagas-dadas-de-baja`
const TITULO = 'Qué prepagas dio de baja la Superintendencia y por qué (2026)'
const DESCRIPCION = 'La Superintendencia de Servicios de Salud rechazó la inscripción definitiva de 4 entidades de medicina prepaga en 2026 por no acreditar afiliados ni actividad real. Quiénes son, qué dice cada resolución y qué pasa si tu prepaga pierde el registro.'
const FUENTE_BOLETIN = 'https://www.boletinoficial.gob.ar/'
const FUENTE_AMBITO = 'https://www.ambito.com/informacion-general/la-superintendencia-servicios-salud-rechazo-cuatro-prepagas-y-cancelo-sus-registros-provisorios-los-motivos-n6308885'

const casos = [
  {
    nombre: 'EMPY S.R.L.',
    resolucion: '1400/2026',
    registro: 'RNEMP 1-1353-3',
  },
  {
    nombre: 'Cooperativa de Provisión de Obras y Servicios Públicos y de Créditos Cuenca del Salado Ltda.',
    resolucion: '1401/2026',
    registro: 'RNEMP 2-1627-0',
  },
  {
    nombre: 'Mutual de Ayuda entre Profesionales del Arte de Curar del Sanatorio Garay',
    resolucion: '1402/2026',
    registro: 'RNEMP 3-1673-4',
  },
  {
    nombre: 'Huinca Salud S.A.',
    resolucion: '1403/2026',
    registro: 'RNEMP 1-1645-7',
  },
]

const faqs = [
  {
    q: '¿Qué prepagas dio de baja el gobierno en 2026?',
    a: `La Superintendencia de Servicios de Salud rechazó la inscripción definitiva de cuatro entidades y dio de baja sus registros provisorios: ${casos.map((c) => c.nombre).join(', ')}. Son entidades chicas, sin la escala de las prepagas conocidas del mercado (Swiss Medical, OSDE, Sancor Salud, etc.), que no pudieron acreditar tener afiliados reales ni actividad comercial de medicina prepaga.`,
  },
  {
    q: '¿Por qué las dieron de baja?',
    a: 'Según las resoluciones, la Superintendencia intimó a cada entidad a acreditar el cumplimiento de los requisitos técnicos, legales, contables y de solvencia financiera de la Ley 26.682 (Resoluciones SSSALUD 55/2012 y 132/2018). Ninguna presentó la documentación en el plazo dado, y las auditorías de la Gerencia de Control Prestacional y de Control Económico Financiero confirmaron que no había población usuaria ni actividad comercial vinculada a planes de salud.',
  },
  {
    q: '¿Esto afecta a las prepagas grandes como Swiss Medical, OSDE o Sancor Salud?',
    a: 'No. Las cuatro entidades dadas de baja tenían registros provisorios (no la inscripción definitiva) y sin afiliados comprobables. Las prepagas con inscripción definitiva y operación real en el mercado, como las que comparamos en este sitio, no están alcanzadas por estas resoluciones.',
  },
  {
    q: '¿Qué pasa si una prepaga pierde su registro en el RNEMP?',
    a: 'Queda inhabilitada para operar comercialmente en medicina prepaga. Las entidades afectadas tienen un plazo legal de 20 días para presentar un recurso de reconsideración, o 30 días para un recurso de alzada, además de la posibilidad de acciones judiciales.',
  },
]

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: URL },
  keywords: ['que prepagas dio de baja el gobierno', 'prepagas dadas de baja 2026', 'superintendencia servicios de salud baja prepagas', 'rnemp baja registro'],
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'article' },
}

export default function PrepagasDadasDeBajaPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: TITULO,
      description: DESCRIPCION,
      url: URL,
      datePublished: '2026-08-10',
      dateModified: '2026-09-29',
      author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
      inLanguage: 'es-AR',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Prensa', item: `${SITE_URL}/prensa` },
        { '@type': 'ListItem', position: 3, name: 'Prepagas dadas de baja' },
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

      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-[#E8002D] transition-colors">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <Link href="/prensa" className="hover:text-[#E8002D] transition-colors">Prensa</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">Prepagas dadas de baja</span>
          </nav>
        </div>
      </div>

      <section className="py-10 bg-white border-b border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wide text-[#E8002D] mb-2">Informe · agosto 2026</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">{TITULO}</h1>
          <p className="text-gray-700 text-base leading-relaxed mt-4">
            La Superintendencia de Servicios de Salud (SSS) rechazó en agosto de 2026 la inscripción definitiva de
            cuatro entidades de medicina prepaga y dio de baja sus registros provisorios en el Registro Nacional de
            Entidades de Medicina Prepaga (RNEMP), por no acreditar afiliados reales ni actividad comercial
            efectiva. <strong>Son entidades chicas y sin operación comprobable</strong> — no hay ninguna prepaga
            de las que se comparan habitualmente (Swiss Medical, OSDE, Sancor Salud, Premedic, Avalian, etc.)
            entre las afectadas.
          </p>
        </div>
      </section>

      <section className="py-10 bg-gray-50 border-b border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Las 4 entidades dadas de baja</h2>
          <div className="space-y-3">
            {casos.map((c) => (
              <div key={c.nombre} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="font-semibold text-gray-900 text-sm">{c.nombre}</div>
                <div className="text-xs text-gray-500 mt-1">Resolución {c.resolucion} · Registro provisorio {c.registro}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mt-5">
            En los cuatro casos, la Superintendencia había intimado previamente a cada entidad a acreditar el
            cumplimiento de los requisitos técnicos, legales y contables de la Ley 26.682 (Resoluciones SSSALUD
            55/2012 y 132/2018). Ninguna presentó la documentación en el plazo fijado, y las auditorías de la
            Gerencia de Control Prestacional y de la Gerencia de Control Económico Financiero confirmaron la
            &quot;inexistencia de población usuaria y de actividad comercial vinculada a planes de salud&quot;.
            Las entidades tienen un plazo legal de 20 días para un recurso de reconsideración, o 30 días para un
            recurso de alzada.
          </p>
        </div>
      </section>

      <section className="py-10 bg-white border-b border-gray-100">
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

      <section className="py-10 bg-gray-50">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Fuentes</h2>
          <ul className="text-sm text-gray-700 space-y-1.5">
            <li>
              Resoluciones 1400/2026 a 1403/2026, <a href={FUENTE_BOLETIN} target="_blank" rel="noopener noreferrer" className="text-[#E8002D] font-semibold hover:underline">Boletín Oficial de la República Argentina</a>.
            </li>
            <li>
              <a href={FUENTE_AMBITO} target="_blank" rel="noopener noreferrer" className="text-[#E8002D] font-semibold hover:underline">&quot;El Gobierno dio de baja cuatro nuevas prepagas: cuáles son las afectadas&quot;</a>, Ámbito Financiero, 10/08/2026.
            </li>
          </ul>
          <p className="text-xs text-gray-500 mt-4">
            ¿Sabés de otra baja de la Superintendencia? Escribinos a{' '}
            <a href="mailto:hola@prepagaya.com.ar" className="text-[#E8002D] font-semibold hover:underline">hola@prepagaya.com.ar</a> con la fuente y la sumamos.
          </p>
          <Link href="/prensa" className="inline-block mt-6 text-sm font-semibold text-[#E8002D] hover:underline">← Volver a la sala de prensa</Link>
        </div>
      </section>
    </>
  )
}
