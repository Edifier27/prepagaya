import type { Metadata } from 'next'
import Link from 'next/link'
import { AUMENTOS_OFICIALES } from '@/lib/data/aumentos'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { InsertarWidget } from '@/components/prensa/InsertarWidget'

// Sala de prensa (23-sep-2026): el informe mensual de aumentos con el dato
// oficial de la SSSalud, listo para citar. Objetivo: que los medios nos citen
// y enlacen (autoridad). Todo sale de lib/data/aumentos-oficiales.json, que la
// tarea programada regenera cada 15 días: la página se actualiza sola.

const periodos = Object.keys(AUMENTOS_OFICIALES.meses).sort()
const ultimo = periodos[periodos.length - 1]
const anterior = periodos[periodos.length - 2]
const mes = AUMENTOS_OFICIALES.meses[ultimo]
const mesAnt = anterior ? AUMENTOS_OFICIALES.meses[anterior] : null
const ranking = Object.entries(mes.prepagas).map(([slug, p]) => ({ slug, ...p })).sort((a, b) => a.mediana - b.mediana)
const menor = ranking[0]
const mayor = ranking[ranking.length - 1]
const pct = (n: number) => `${n.toLocaleString('es-AR')}%`
const fechaDatos = new Date(AUMENTOS_OFICIALES.generado + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
const CSV = `${SITE_URL}/prensa/aumentos.csv`

const titular = `Las prepagas aumentan en promedio ${pct(mes.promedio)} en ${mes.label.toLowerCase()}, según los cuadros tarifarios oficiales`
const bajada = `El dato surge de los cuadros tarifarios que ${ranking.length} prepagas declararon ante la Superintendencia de Servicios de Salud. La suba va de ${pct(menor.mediana)} (${menor.nombre}) a ${pct(mayor.mediana)} (${mayor.nombre}).${mesAnt ? ` En ${mesAnt.label.toLowerCase()} el promedio había sido ${pct(mesAnt.promedio)}.` : ''}`
const cita = `Según un relevamiento de ${SITE_NAME} sobre los cuadros tarifarios oficiales de la Superintendencia de Servicios de Salud, las prepagas aumentan en promedio ${pct(mes.promedio)} en ${mes.label.toLowerCase()}.`

export const metadata: Metadata = {
  // Sin "aumento de prepagas {mes}" en el título: esa búsqueda es de /aumentos
  // (canibalización). Acá, intención prensa/datos.
  title: `Prensa: informe mensual de aumentos de prepagas y datos descargables`,
  description: `Informe para periodistas con el dato oficial de la SSSalud: ${titular.charAt(0).toLowerCase() + titular.slice(1)}. Ranking por prepaga, CSV descargable, metodología y contacto de prensa.`,
  alternates: { canonical: `${SITE_URL}/prensa` },
  keywords: ['prepagaya prensa', 'datos aumentos prepagas csv', 'cuadros tarifarios sssalud datos', 'informe aumentos prepagas'],
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Aumentos mensuales de las prepagas de Argentina (cuadros tarifarios SSSalud)',
    description: `Aumento de cada prepaga por mes, calculado a partir de los cuadros tarifarios que las entidades de medicina prepaga declaran ante la Superintendencia de Servicios de Salud. ${AUMENTOS_OFICIALES.metodo}`,
    url: `${SITE_URL}/prensa`,
    creator: { '@id': `${SITE_URL}/#organization` },
    isBasedOn: AUMENTOS_OFICIALES.fuenteUrl,
    inLanguage: 'es-AR',
    spatialCoverage: 'Argentina',
    temporalCoverage: `${periodos[0].slice(0, 4)}-${periodos[0].slice(4)}/${ultimo.slice(0, 4)}-${ultimo.slice(4)}`,
    dateModified: AUMENTOS_OFICIALES.generado,
    distribution: [{ '@type': 'DataDownload', encodingFormat: 'text/csv', contentUrl: CSV }],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Prensa' },
    ],
  },
]

export default function PrensaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-[#E8002D] transition-colors">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">Prensa</span>
          </nav>
        </div>
      </div>

      <section className="py-10 bg-white border-b border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wide text-[#E8002D] mb-2">Informe mensual · datos al {fechaDatos}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">{titular}</h1>
          <p className="text-gray-700 text-base leading-relaxed mt-4 max-w-3xl">{bajada}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { v: pct(mes.promedio), l: `Promedio ${mes.label.toLowerCase()}` },
              { v: pct(menor.mediana), l: `Menor suba: ${menor.nombre}` },
              { v: pct(mayor.mediana), l: `Mayor suba: ${mayor.nombre}` },
              { v: String(ranking.length), l: 'Prepagas con cuadro declarado' },
            ].map((x) => (
              <div key={x.l} className="rounded-xl border border-gray-200 p-4">
                <div className="text-2xl font-black text-gray-900 tabular-nums">{x.v}</div>
                <div className="text-xs text-gray-500 mt-1">{x.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Aumento de {mes.label.toLowerCase()} por prepaga</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 font-semibold">Prepaga</th>
                  <th className="px-4 py-3 font-semibold text-right">{mes.label}</th>
                  {mesAnt && <th className="px-4 py-3 font-semibold text-right">{mesAnt.label}</th>}
                  <th className="px-4 py-3 font-semibold text-right">Rango del mes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ranking.map((p) => {
                  const ant = mesAnt?.prepagas[p.slug]
                  return (
                    <tr key={p.slug}>
                      <td className="px-4 py-2.5 font-semibold text-gray-900">{p.nombre}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums font-semibold">{pct(p.mediana)}</td>
                      {mesAnt && <td className="px-4 py-2.5 text-right tabular-nums text-gray-600">{ant ? pct(ant.mediana) : '—'}</td>}
                      <td className="px-4 py-2.5 text-right tabular-nums text-gray-500">{p.minimo === p.maximo ? '—' : `${pct(p.minimo)} a ${pct(p.maximo)}`}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Solo figuran las prepagas que ya declararon su cuadro tarifario del mes. Para ver el detalle y la evolución del año: <Link href="/aumentos" className="text-[#E8002D] font-semibold hover:underline">aumentos de prepagas</Link>.
          </p>
        </div>
      </section>

      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Para citar</h2>
            <blockquote className="rounded-xl border-l-4 border-[#E8002D] bg-white p-4 text-sm text-gray-800 leading-relaxed">{cita}</blockquote>
            <p className="text-xs text-gray-500 mt-2">Podés usar estos datos citando a {SITE_NAME} con un enlace a esta página.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Datos y contacto</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <a href="/prensa/aumentos.csv" className="text-[#E8002D] font-semibold hover:underline">Descargar los datos (CSV)</a>: aumento de cada prepaga por mes.
              </li>
              <li>
                Fuente: <a href={AUMENTOS_OFICIALES.fuenteUrl} target="_blank" rel="noopener noreferrer" className="underline">{AUMENTOS_OFICIALES.fuente}</a>.
              </li>
              <li>Consultas de prensa: <a href="mailto:hola@prepagaya.com.ar" className="text-[#E8002D] font-semibold hover:underline">hola@prepagaya.com.ar</a></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Insertar el gráfico en tu sitio</h2>
          <InsertarWidget filas={ranking.length} />
        </div>
      </section>

      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Metodología</h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">{AUMENTOS_OFICIALES.metodo} Los datos se actualizan cada 15 días, cuando la Superintendencia publica los cuadros nuevos.</p>
        </div>
      </section>
    </>
  )
}
