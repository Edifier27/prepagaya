import type { Metadata } from 'next'
import Link from 'next/link'
import { entidadesRegistro, codigoSeisDigitos, REGISTRO_VERIFICADO, PREPAGA_A_REGISTRO } from '@/lib/data/registro-sssalud'
import { OS_MONOTRIBUTO } from '@/lib/data/monotributo'
import { prepagas } from '@/lib/data/prepagas'
import { PasateConTusAportes } from '@/components/obras-sociales/PasateConTusAportes'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'
import { SITE_NAME, SITE_URL, OG_IMAGE, PRIORIDAD_PARTNERS } from '@/lib/utils'

// "obra social sindical de swiss medical / osde / sancor / medife / omint",
// "cómo derivar aportes a swiss medical", "cambiar de obra social a swiss
// medical" (keyword research, 1-oct-2026). Mucha gente cree que necesita una
// obra social "puente". Según el Registro Nacional de Agentes del Seguro de la
// SSSalud, las prepagas tienen código propio y figuran en la opción de cambio:
// en relación de dependencia se eligen directo. Ninguna figura en el listado
// de monotributo: el monotributista elige una obra social de ese listado.

const ORDEN = [...PRIORIDAD_PARTNERS, 'osde']
const enMonotributo = new Set(OS_MONOTRIBUTO.map((o) => o.codigo))

// Prepagas del registro con código y opción de cambio; las del sitio primero
const filas = entidadesRegistro
  .filter((e) => e.tipo === 'Prepaga' && e.codigo && e.opcion)
  .map((e) => {
    // Solo se vincula con la ficha del sitio si la equivalencia está confirmada
    const p = prepagas.find((x) => PREPAGA_A_REGISTRO[x.slug] === e.slug)
    return { e, nombre: p?.nombre ?? e.nombre, slugSitio: p?.slug, prioridad: p ? ORDEN.indexOf(p.slug) : -1 }
  })
  .sort((a, b) => (a.prioridad === -1 ? 99 : a.prioridad) - (b.prioridad === -1 ? 99 : b.prioridad) || (a.slugSitio ? 0 : 1) - (b.slugSitio ? 0 : 1) || a.nombre.localeCompare(b.nombre, 'es'))

const destacadas = filas.filter((f) => f.slugSitio).slice(0, 12)
const resto = filas.filter((f) => !destacadas.includes(f))
const swiss = filas.find((f) => f.e.slug === 'swiss-medical')

const TITULO = '¿Cuál es la obra social de Swiss Medical, OSDE o Sancor? El código para pasar tus aportes'

export const metadata: Metadata = {
  title: 'Obra social de Swiss Medical, OSDE, Sancor y otras prepagas: código (2026)',
  description: `No necesitás una obra social "puente": las prepagas tienen código propio en el registro de la Superintendencia y se eligen directo en la opción de cambio. Swiss Medical ${swiss ? codigoSeisDigitos(swiss.e.codigo!) : ''}, OSDE, Sancor y ${filas.length - 3} más.`,
  alternates: { canonical: `${SITE_URL}/obras-sociales/obra-social-de-cada-prepaga` },
  keywords: [
    'obra social sindical de swiss medical', 'obra social de swiss medical', 'codigo obra social swiss medical',
    'obra social sindical de osde', 'obra social sindical de sancor salud', 'obra social sindical de medife', 'obra social sindical de omint',
    'como derivar aportes a swiss medical', 'cambiar de obra social a swiss medical', 'derivar aportes a prepaga',
  ],
  openGraph: { title: TITULO, description: 'El código de cada prepaga para la opción de cambio.', type: 'article', images: [OG_IMAGE] },
}

const faqPrepagas = destacadas.slice(0, 8).map((f) => ({
  q: `¿Cuál es la obra social sindical de ${f.nombre}?`,
  a: `No hace falta una: ${f.nombre} figura en el Registro Nacional de Agentes del Seguro de Salud con el código ${codigoSeisDigitos(f.e.codigo!)} (RNAS ${f.e.codigo}) y en el listado de la opción de cambio. Si trabajás en relación de dependencia, la elegís directamente con ese código.${enMonotributo.has(f.e.codigo!) ? '' : ' Si sos monotributista, no figura en el listado de monotributo: tenés que elegir una obra social de ese listado que trabaje con ella.'}`,
}))

const faq = [
  ...faqPrepagas,
  {
    q: '¿Cómo derivo mis aportes a una prepaga si soy monotributista?',
    a: 'Ninguna prepaga figura en el listado oficial de obras sociales para monotributistas. Tenés que elegir una obra social de ese listado que tenga convenio con la prepaga que querés: el asesor te dice cuál corresponde y te cotiza la diferencia.',
  },
  {
    q: '¿Cómo hago la opción de cambio a una prepaga?',
    a: 'Online, en la web de la Superintendencia de Servicios de Salud con tu clave fiscal nivel 3: elegís la prepaga por su código, confirmás el mail que te llega dentro de las 48 horas y el cambio se activa el primer día del mes siguiente. Se puede hacer una vez cada 365 días.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: TITULO,
    url: `${SITE_URL}/obras-sociales/obra-social-de-cada-prepaga`,
    inLanguage: 'es-AR',
    dateModified: REGISTRO_VERIFICADO,
    isBasedOn: 'https://www.sssalud.gob.ar/index.php?cat=agsis&page=listRnos',
    publisher: { '@id': `${SITE_URL}/#organization` },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Obras Sociales', item: `${SITE_URL}/obras-sociales` },
      { '@type': 'ListItem', position: 3, name: 'Obra social de cada prepaga' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
]

function Fila({ f }: { f: (typeof filas)[number] }) {
  return (
    <tr>
      <td className="px-4 py-2.5">
        {f.slugSitio ? (
          <Link href={`/prepagas/${f.slugSitio}`} className="font-semibold text-gray-900 hover:text-[#E8002D]">{f.nombre}</Link>
        ) : (
          <span className="text-gray-800">{f.nombre}</span>
        )}
      </td>
      <td className="px-4 py-2.5 font-bold tabular-nums text-gray-900">{codigoSeisDigitos(f.e.codigo!)}</td>
      <td className="px-4 py-2.5 text-xs text-gray-500 tabular-nums">{f.e.codigo}</td>
      <td className="px-4 py-2.5 text-sm">{enMonotributo.has(f.e.codigo!) ? 'Sí' : 'No'}</td>
    </tr>
  )
}

export default function ObraSocialDeCadaPrepagaPage() {
  const fecha = new Date(`${REGISTRO_VERIFICADO}T12:00:00`).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-[#E8002D]">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <Link href="/obras-sociales" className="hover:text-[#E8002D]">Obras Sociales</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">Obra social de cada prepaga</span>
          </nav>
        </div>
      </div>

      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-10">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">{TITULO}</h1>
          <p className="text-gray-700 leading-relaxed mt-4 max-w-3xl">
            <strong>Respuesta corta:</strong> no necesitás una obra social “puente”. Las prepagas figuran en el registro oficial de
            la Superintendencia de Servicios de Salud con su propio código y en el listado de la opción de cambio: si trabajás en
            relación de dependencia, elegís la prepaga directamente.{swiss && <> El código de <strong>Swiss Medical es {codigoSeisDigitos(swiss.e.codigo!)}</strong>.</>}
          </p>
          <p className="text-gray-700 leading-relaxed mt-3 max-w-3xl">
            <strong>Si sos monotributista</strong>, es distinto: ninguna prepaga figura en el listado de monotributo, así que tenés
            que elegir una obra social de ese listado que trabaje con la prepaga que querés.
          </p>
          <div className="mt-5">
            <ContratarPlanButton
              prepagaNombre="Swiss Medical"
              fuente="obra-social-de-cada-prepaga"
              label="Quiero pasar mis aportes a Swiss Medical"
              titulo="Pasá tus aportes a Swiss Medical"
              planesOpciones={prepagas.find((p) => p.slug === 'swiss-medical')?.planes.map((p) => p.nombre)}
            />
          </div>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">El código de cada prepaga</h2>
          <p className="text-sm text-gray-500 mb-4">Registro Nacional de Agentes del Seguro de Salud, verificado el {fecha}.</p>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 font-semibold">Prepaga</th>
                  <th className="px-4 py-3 font-semibold">Código</th>
                  <th className="px-4 py-3 font-semibold">RNAS</th>
                  <th className="px-4 py-3 font-semibold">Monotributo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {destacadas.map((f) => <Fila key={f.e.slug} f={f} />)}
              </tbody>
            </table>
          </div>
          {resto.length > 0 && (
            <details className="mt-4 rounded-xl border border-gray-200 p-4">
              <summary className="cursor-pointer font-semibold text-gray-900 text-sm">Ver las otras {resto.length} prepagas</summary>
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-100">
                    {resto.map((f) => <Fila key={f.e.slug} f={f} />)}
                  </tbody>
                </table>
              </div>
            </details>
          )}
          <p className="text-xs text-gray-500 mt-3">
            Todas figuran en el listado de la opción de cambio. “Monotributo”: si figura en el listado oficial de obras sociales para
            monotributistas. <Link href="/obras-sociales/codigos" className="underline">Códigos de todas las obras sociales</Link>.
          </p>
        </div>
      </section>

      <PasateConTusAportes osNombre="tu obra social" osSlug="" fuente="obra-social-de-cada-prepaga" titulo="Por qué pasar tus aportes a Swiss Medical" />

      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faq.map((x) => (
              <div key={x.q}>
                <h3 className="font-semibold text-gray-900">{x.q}</h3>
                <p className="text-sm text-gray-700 leading-relaxed mt-1">{x.a}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6">
            <Link href="/guias/opcion-de-cambio-obra-social" className="text-sm font-semibold text-[#E8002D] hover:underline">La opción de cambio, paso a paso →</Link>
            <Link href="/guias/derivar-obra-social-a-prepaga" className="text-sm font-semibold text-[#E8002D] hover:underline">Cómo derivar tus aportes a una prepaga →</Link>
            <Link href="/obras-sociales/monotributo" className="text-sm font-semibold text-[#E8002D] hover:underline">Obras sociales para monotributistas →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
