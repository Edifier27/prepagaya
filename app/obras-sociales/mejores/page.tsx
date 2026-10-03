import type { Metadata } from 'next'
import Link from 'next/link'
import { CARTILLAS_SINDICALES, totales } from '@/lib/data/sindicales-cartillas'
import { osDeCartilla } from '@/lib/data/sindicales-cartillas/os'
import { COSEGUROS_OS } from '@/lib/data/coseguros-os'
import { OS_MONOTRIBUTO } from '@/lib/data/monotributo'
import { registroDeObraSocial } from '@/lib/data/registro-sssalud'
import { PasateConTusAportes } from '@/components/obras-sociales/PasateConTusAportes'
import { GrillaObrasSociales, type ItemGrilla } from '@/components/obras-sociales/GrillaObrasSociales'
import { obrasSociales } from '@/lib/data/obras-sociales'
import { FICHAS_REGISTRO } from '@/lib/data/fichas-registro'
import { SITE_NAME, SITE_URL, OG_IMAGE } from '@/lib/utils'

// "mejores obras sociales 2026", "ranking obras sociales", "cuál es la mejor
// obra social" (keyword research, 1-oct-2026). Ranking SOLO con datos
// oficiales: el tamaño de la red sale del listado de prestadores que cada
// obra social presentó ante la SSSalud (Anexo III, lib/data/sindicales-
// cartillas), los afiliados de la carátula de ese mismo listado, los coseguros
// de su publicación oficial y el monotributo del listado de la SSSalud. Solo
// entran las que publican su listado de prestadores: no se puede comparar lo
// que no se publica.

const enMonotributo = new Set(OS_MONOTRIBUTO.map((o) => o.codigo))
const valor = (slug: string, re: RegExp) => COSEGUROS_OS[slug]?.items.find((i) => re.test(i.concepto))?.valor

const filas = Object.values(CARTILLAS_SINDICALES)
  .map((c) => {
    const os = osDeCartilla(c.slug)
    const t = totales(c)
    const codigo = registroDeObraSocial(c.slug)?.codigo ?? null
    return {
      slug: c.slug,
      nombre: os?.nombre ?? c.slug,
      t,
      beneficiarios: c.beneficiarios,
      consulta: valor(c.slug, /especialista/i) ?? valor(c.slug, /consulta/i),
      domicilio: valor(c.slug, /noche/i) ?? valor(c.slug, /domicilio/i),
      monotributo: codigo ? enMonotributo.has(codigo) : null,
    }
  })
  .sort((a, b) => b.t.internacion - a.t.internacion)

// Grillas por tipo (Darío, 3-oct-2026): sindicales primero, provinciales
// después, las más buscadas arriba. Sindicales: orden por búsquedas mensuales
// de Google Ads Keyword Planner (1-oct-2026, registradas en cada ficha de
// lib/data/obras-sociales.ts; donde solo se midieron sub-búsquedas, como
// "osecac turnos" 12.100 o "union personal turnos/cartilla/teléfono" 17.400,
// se suman como piso). Provinciales: todavía sin medición de búsquedas; el
// orden provisorio es por afiliados/padrón provincial (IOMA, la más grande),
// a reemplazar cuando se mida en Keyword Planner. El resto, alfabético.
const ORDEN_SINDICALES = ['osecac', 'union-personal', 'ospedyc', 'osdop', 'ospacp', 'ospes', 'osmedica', 'osctc', 'oschoca', 'osperyh', 'osuthgra', 'ase']
const ORDEN_PROVINCIALES = ['ioma', 'apross', 'iapos', 'osep-mendoza', 'oser', 'ips-salta']
// Fichas del registro que no son de un sindicato/actividad (empresa)
const NO_SINDICALES = new Set(['osypf'])

const ordenar = (orden: string[]) => (a: ItemGrilla, b: ItemGrilla) => {
  const ia = orden.indexOf(a.slug)
  const ib = orden.indexOf(b.slug)
  if (ia !== -1 || ib !== -1) return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib)
  return a.nombre.localeCompare(b.nombre, 'es')
}
const conCartilla = new Set(Object.keys(CARTILLAS_SINDICALES))
const item = (slug: string, nombre: string, bajada: string): ItemGrilla => ({
  slug,
  nombre,
  bajada,
  cartilla: conCartilla.has(slug),
  coseguro: valor(slug, /especialista/i) ?? valor(slug, /consulta/i),
})
const slugsFicha = new Set(obrasSociales.map((o) => o.slug))
const sindicales = [
  ...obrasSociales.filter((o) => o.tipo === 'sindical').map((o) => item(o.slug, o.nombre, o.descripcion)),
  ...FICHAS_REGISTRO.filter((f) => !slugsFicha.has(f.slug) && !NO_SINDICALES.has(f.slug)).map((f) => item(f.slug, f.nombreCorto, `La obra social de ${f.actividad}.`)),
].sort(ordenar(ORDEN_SINDICALES))
const provinciales = obrasSociales
  .filter((o) => o.tipo === 'provincial')
  .map((o) => item(o.slug, o.nombre, o.descripcion))
  .sort(ordenar(ORDEN_PROVINCIALES))

const TITULO = 'Mejores obras sociales de Argentina 2026: ranking con datos oficiales'
const top = filas.slice(0, 3).map((f) => f.nombre)

export const metadata: Metadata = {
  title: TITULO,
  description: `Ranking de ${filas.length} obras sociales por tamaño de su cartilla oficial: sanatorios, guardias y provincias, más afiliados, coseguros y monotributo. Las de red más grande: ${top.join(', ')}.`,
  alternates: { canonical: `${SITE_URL}/obras-sociales/mejores` },
  keywords: ['mejores obras sociales', 'mejores obras sociales argentina 2026', 'ranking obras sociales', 'ranking de obras sociales argentina', 'cual es la mejor obra social', 'mejor obra social con aportes', 'mejor obra social sindical'],
  openGraph: { title: TITULO, description: 'Las obras sociales comparadas con sus listados oficiales.', type: 'article', images: [OG_IMAGE] },
}

const faq = [
  {
    q: '¿Cuál es la mejor obra social de Argentina?',
    a: `No hay una sola: depende de dónde vivas y qué uses. Si medimos el tamaño de la red, entre las que publican su cartilla oficial las más grandes son ${top.join(', ').replace(/, ([^,]*)$/, ' y $1')}. Pero una red grande no garantiza turnos rápidos ni sanatorios de primer nivel: con tus mismos aportes podés tener una prepaga y pagar solo la diferencia.`,
  },
  {
    q: '¿Cuál es la mejor obra social con aportes?',
    a: 'Si trabajás en relación de dependencia podés elegir cualquier obra social o prepaga del listado de la opción de cambio. Si querés sanatorios propios y sin copagos, la opción es una prepaga como Swiss Medical, que figura en ese listado: tus aportes pagan el plan y ponés la diferencia, o nada, según tu sueldo.',
  },
  {
    q: '¿Cómo armaron este ranking?',
    a: 'Con el listado completo de prestadores que cada obra social presenta ante la Superintendencia de Servicios de Salud (Resolución 2165/2021): contamos sanatorios con internación, guardias y provincias. Los afiliados salen de ese mismo listado, los coseguros de la publicación oficial de cada obra social y el monotributo del listado de la Superintendencia. Solo entran las que publican su listado de prestadores.',
  },
  {
    q: '¿Cuál es la mejor obra social para monotributistas?',
    a: 'Tiene que estar en el listado oficial de obras sociales para monotributistas. En la tabla marcamos cuáles de estas lo están; el listado completo está en nuestra página de obras sociales para monotributistas.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: TITULO,
    itemListElement: filas.map((f, i) => ({ '@type': 'ListItem', position: i + 1, name: f.nombre, url: `${SITE_URL}/obras-sociales/${f.slug}` })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Obras Sociales', item: `${SITE_URL}/obras-sociales` },
      { '@type': 'ListItem', position: 3, name: 'Mejores obras sociales' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
]

const fmt = (n: number) => n.toLocaleString('es-AR')

export default function MejoresObrasSocialesPage() {
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
            <span className="text-gray-700">Mejores obras sociales</span>
          </nav>
        </div>
      </div>

      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-10">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">{TITULO}</h1>
          <p className="text-gray-700 leading-relaxed mt-4 max-w-3xl">
            <strong>Respuesta corta:</strong> entre las obras sociales que publican su cartilla oficial, las de red más grande son{' '}
            {top.join(', ').replace(/, ([^,]*)$/, ' y $1')}. Este ranking no sale de opiniones: sale de los listados de prestadores
            que cada una presentó ante la Superintendencia de Servicios de Salud, más sus coseguros oficiales.
          </p>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900">Obras sociales sindicales</h2>
          <p className="text-sm text-gray-600 mt-1 mb-5">Las más buscadas primero. Teléfonos, cartilla, coseguros y cómo pasar tus aportes a otra cobertura.</p>
          <GrillaObrasSociales items={sindicales} nombreGrupo="sindicales" />
        </div>
      </section>

      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900">Obras sociales provinciales</h2>
          <p className="text-sm text-gray-600 mt-1 mb-5">Las de los empleados públicos de cada provincia: quién puede afiliarse, qué cubre y cómo comunicarte.</p>
          <GrillaObrasSociales items={provinciales} nombreGrupo="provinciales" />
        </div>
      </section>

      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ranking por tamaño de la red oficial</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="px-3 py-3 font-semibold">#</th>
                  <th className="px-3 py-3 font-semibold">Obra social</th>
                  <th className="px-3 py-3 font-semibold text-right">Sanatorios</th>
                  <th className="px-3 py-3 font-semibold text-right">Guardias</th>
                  <th className="px-3 py-3 font-semibold text-right">Provincias</th>
                  <th className="px-3 py-3 font-semibold text-right">Afiliados</th>
                  <th className="px-3 py-3 font-semibold text-right">Coseguro consulta</th>
                  <th className="px-3 py-3 font-semibold text-right">Coseguro domicilio</th>
                  <th className="px-3 py-3 font-semibold">Monotributo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 tabular-nums">
                {filas.map((f, i) => (
                  <tr key={f.slug}>
                    <td className="px-3 py-2.5 text-gray-500">{i + 1}</td>
                    <td className="px-3 py-2.5">
                      <Link href={`/obras-sociales/${f.slug}`} className="font-semibold text-gray-900 hover:text-[#E8002D]">{f.nombre}</Link>
                      <Link href={`/obras-sociales/${f.slug}/cartilla`} className="block text-xs text-[#E8002D] hover:underline">Ver cartilla</Link>
                    </td>
                    <td className="px-3 py-2.5 text-right font-semibold">{fmt(f.t.internacion)}</td>
                    <td className="px-3 py-2.5 text-right">{fmt(f.t.guardia)}</td>
                    <td className="px-3 py-2.5 text-right">{f.t.provincias}</td>
                    <td className="px-3 py-2.5 text-right">{f.beneficiarios ? fmt(f.beneficiarios) : '—'}</td>
                    <td className="px-3 py-2.5 text-right">{f.consulta ?? '—'}</td>
                    <td className="px-3 py-2.5 text-right">{f.domicilio ?? '—'}</td>
                    <td className="px-3 py-2.5">{f.monotributo === null ? '—' : f.monotributo ? 'Sí' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3 max-w-4xl">
            Sanatorios: con internación. Afiliados: los que declara en su listado de prestadores (“—” si no los declara). Coseguros:
            consulta con especialista y visita a domicilio nocturna, de su publicación oficial (
            <Link href="/obras-sociales/coseguros" className="underline">ver todos</Link>). Solo entran las obras sociales que publican
            su listado completo de prestadores.
          </p>
        </div>
      </section>

      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Lo que el ranking no te dice</h2>
          <p className="text-sm text-gray-700 leading-relaxed max-w-3xl">
            Una red grande no es lo mismo que una buena red: la mayoría de los prestadores de una obra social sindical son de terceros,
            con turnos que dependen de cada uno, y casi todas cobran coseguro por consulta y por visita a domicilio. Si querés
            sanatorios propios y sin copagos, la comparación que importa es otra: tu obra social contra una prepaga, con los mismos aportes.
          </p>
        </div>
      </section>

      <PasateConTusAportes osNombre="tu obra social" osSlug="" fuente="mejores-obras-sociales" titulo="La alternativa con tus mismos aportes: Swiss Medical, sin copagos" />

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
            <Link href="/obras-sociales/monotributo" className="text-sm font-semibold text-[#E8002D] hover:underline">Obras sociales para monotributistas →</Link>
            <Link href="/obras-sociales/obra-social-de-cada-prepaga" className="text-sm font-semibold text-[#E8002D] hover:underline">El código de cada prepaga →</Link>
            <Link href="/ranking" className="text-sm font-semibold text-[#E8002D] hover:underline">Ranking de prepagas →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
