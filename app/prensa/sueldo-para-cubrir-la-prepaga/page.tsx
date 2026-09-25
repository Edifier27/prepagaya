import type { Metadata } from 'next'
import Link from 'next/link'
import { preciosParaGrupo } from '@/lib/precios/motor'
import { prepagasCotizables } from '@/lib/data/planes-cotizables'
import { PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { APORTE_DERIVABLE, SITE_NAME, SITE_URL, OG_IMAGE } from '@/lib/utils'

// Informe para prensa (25-sep-2026): cuánto hay que ganar para que los
// aportes de obra social paguen la prepaga completa, sin diferencia. Dato
// propio y citable (objetivo: notas con enlace). Sale de los cuadros oficiales
// "con aportes" que cada prepaga declara ante la SSSalud (motor de precios) y
// del 7,5% del sueldo bruto que llega a la prepaga: se recalcula solo cada mes.

const URL = `${SITE_URL}/prensa/sueldo-para-cubrir-la-prepaga`
const ZONA = 'caba' // cuadro AMBA

interface Perfil { id: string; titulo: string; corto: string; edades: number[]; sueldos: number }
const PERFILES: Perfil[] = [
  { id: 's30', titulo: 'Soltero/a de 30 años', corto: '30 años', edades: [30], sueldos: 1 },
  { id: 's45', titulo: 'Soltero/a de 45 años', corto: '45 años', edades: [45], sueldos: 1 },
  { id: 'fam', titulo: 'Familia de 4 (40 y 38 años, hijos de 10 y 7), con dos sueldos', corto: 'Familia de 4', edades: [40, 38, 10, 7], sueldos: 2 },
]

interface Fila { prepaga: string; plan: string; sueldo: Record<string, number> }

function calcular(): Fila[] {
  const precios = Object.fromEntries(PERFILES.map((p) => [p.id, preciosParaGrupo(p.edades, ZONA, 'desregulado')]))
  const filas: Fila[] = []
  for (const pr of prepagasCotizables()) {
    // Plan de entrada: el más barato con cuadro "con aportes" para una persona de 30
    const planes = pr.planes
      .map((pl) => ({ pl, v: precios.s30[`${pr.slug}/${pl.slug}`] ?? 0 }))
      .filter((x) => x.v > 0)
      .sort((a, b) => a.v - b.v)
    const entrada = planes[0]?.pl
    if (!entrada) continue
    const sueldo: Record<string, number> = {}
    for (const p of PERFILES) {
      const v = precios[p.id][`${pr.slug}/${entrada.slug}`]
      if (v > 0) sueldo[p.id] = v / APORTE_DERIVABLE
    }
    if (Object.keys(sueldo).length === PERFILES.length) filas.push({ prepaga: pr.nombre, plan: entrada.nombre, sueldo })
  }
  return filas.sort((a, b) => a.sueldo.s30 - b.sueldo.s30)
}

const FILAS = calcular()
const millones = (n: number) => `$${(n / 1e6).toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} M`
const millonesLargo = (n: number) => `$${(n / 1e6).toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} millones`
const mes = PRECIO_ACTUALIZADO.toLowerCase()
const min30 = FILAS[0]
// Para el titular: las prepagas grandes (el tope de la tabla puede ser un plan
// particular de una prepaga chica y distorsiona la cita).
const GRANDES = ['Swiss Medical', 'OSDE', 'Galeno', 'Medife', 'Medifé']
const grandes = FILAS.filter((f) => GRANDES.includes(f.prepaga))
const g30 = [...grandes].sort((a, b) => a.sueldo.s30 - b.sueldo.s30)
const gFam = [...grandes].sort((a, b) => a.sueldo.fam - b.sueldo.fam)
const osde = FILAS.find((f) => f.prepaga === 'OSDE')
const swiss = FILAS.find((f) => f.prepaga === 'Swiss Medical')
const famMin = [...FILAS].sort((a, b) => a.sueldo.fam - b.sueldo.fam)[0]

const titular = min30
  ? `Para que los aportes paguen la prepaga completa, una persona de 30 años necesita ganar desde ${millonesLargo(min30.sueldo.s30)} brutos por mes`
  : 'Cuánto hay que ganar para que los aportes paguen la prepaga'
const cita = min30 && g30.length > 1 && gFam.length > 1
  ? `Según un relevamiento de ${SITE_NAME} sobre los cuadros tarifarios oficiales "con aportes" de ${mes}, para que los aportes de obra social cubran el plan de entrada de una prepaga sin pagar diferencia, una persona de 30 años en el AMBA necesita un sueldo bruto desde ${millonesLargo(min30.sueldo.s30)} (${min30.prepaga}); en las prepagas más grandes, entre ${millonesLargo(g30[0].sueldo.s30)} (${g30[0].prepaga}) y ${millonesLargo(g30[g30.length - 1].sueldo.s30)} (${g30[g30.length - 1].prepaga}). Una familia de cuatro con dos sueldos necesita, entre los dos, desde ${millonesLargo(famMin.sueldo.fam)}, y entre ${millonesLargo(gFam[0].sueldo.fam)} y ${millonesLargo(gFam[gFam.length - 1].sueldo.fam)} en las más grandes.`
  : ''

export const metadata: Metadata = {
  title: `¿Cuánto hay que ganar para que los aportes paguen la prepaga? Informe ${mes}`,
  description: min30
    ? `Sueldo bruto necesario para que los aportes de obra social cubran el plan de entrada de cada prepaga sin pagar diferencia: desde ${millonesLargo(min30.sueldo.s30)} a los 30 años. Con los cuadros oficiales de la SSSalud.`
    : 'Sueldo bruto necesario para que los aportes de obra social cubran la prepaga sin pagar diferencia.',
  alternates: { canonical: URL },
  keywords: ['cuanto hay que ganar para tener prepaga', 'aportes cubren prepaga', 'sueldo para prepaga con aportes', 'prepaga sin pagar diferencia', 'derivar aportes prepaga cuanto pago'],
  openGraph: { title: '¿Cuánto hay que ganar para que los aportes paguen la prepaga?', description: titular, url: URL, type: 'article', images: [OG_IMAGE] },
}

export default function InformeSueldoPrepaga() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: titular,
      description: cita,
      url: URL,
      inLanguage: 'es-AR',
      author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      publisher: { '@id': `${SITE_URL}/#organization` },
      isBasedOn: 'https://cuadrostarifarios.sssalud.gob.ar/',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Prensa', item: `${SITE_URL}/prensa` },
        { '@type': 'ListItem', position: 3, name: 'Sueldo para cubrir la prepaga' },
      ],
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-[#E8002D]">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <Link href="/prensa" className="hover:text-[#E8002D]">Prensa</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">Sueldo para cubrir la prepaga</span>
          </nav>
        </div>
      </div>

      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-10">
        <div className="container max-w-3xl! mx-auto">
          <p className="text-xs font-semibold text-[#E8002D] uppercase tracking-wide">Informe {SITE_NAME} · {PRECIO_ACTUALIZADO}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance mt-2">¿Cuánto hay que ganar para que los aportes paguen la prepaga?</h1>
          <p className="text-gray-700 mt-3 leading-relaxed">{titular}.{osde && swiss ? ` Para el plan de entrada de Swiss Medical hacen falta ${millonesLargo(swiss.sueldo.s30)}; para el de OSDE, ${millonesLargo(osde.sueldo.s30)}.` : ''}</p>

          {min30 && osde && famMin && (
            <div className="mt-6 grid gap-3 grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
                <p className="text-lg sm:text-2xl font-black text-gray-900 tabular-nums">{millones(min30.sueldo.s30)}</p>
                <p className="text-xs text-gray-600">a los 30 años, en la prepaga más accesible</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
                <p className="text-lg sm:text-2xl font-black text-gray-900 tabular-nums">{millones(osde.sueldo.s45)}</p>
                <p className="text-xs text-gray-600">para OSDE a los 45 años</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
                <p className="text-lg sm:text-2xl font-black text-gray-900 tabular-nums">{millones(famMin.sueldo.fam)}</p>
                <p className="text-xs text-gray-600">como mínimo, entre los dos sueldos, una familia de 4</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-3xl! mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sueldo bruto mensual para no pagar diferencia</h2>
          <p className="text-sm text-gray-600 mb-4">Plan de entrada de cada prepaga, cuadro oficial con aportes del AMBA, {mes}. Con un sueldo menor, la persona paga la diferencia entre sus aportes y el precio del plan.</p>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs text-gray-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Prepaga y plan</th>
                  {PERFILES.map((p) => <th key={p.id} className="px-3 py-2 font-semibold text-right whitespace-nowrap">{p.corto}</th>)}
                </tr>
              </thead>
              <tbody>
                {FILAS.map((f) => (
                  <tr key={f.prepaga} className="border-t border-gray-100">
                    <td className="px-3 py-2"><span className="font-semibold text-gray-900">{f.prepaga}</span><span className="block text-xs text-gray-500">{f.plan}</span></td>
                    {PERFILES.map((p) => <td key={p.id} className="px-3 py-2 text-right tabular-nums text-gray-800 whitespace-nowrap">{millones(f.sueldo[p.id])}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">&quot;Familia de 4&quot;: pareja de 40 y 38 años con hijos de 10 y 7, que unifican los aportes de sus dos sueldos (el valor es la suma de ambos).</p>

          <div className="mt-8 rounded-2xl border-2 border-[#E8002D]/20 bg-gradient-to-r from-red-50 to-white p-5 flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="flex-1 text-sm text-gray-700"><strong className="text-gray-900">¿Y con tu sueldo?</strong> La calculadora te dice cuánto aportás y cuánto pagarías de diferencia en cada plan.</p>
            <Link href="/calculadora-aportes" className="shrink-0 inline-flex items-center justify-center px-5 py-2.5 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm">Calcular mi diferencia →</Link>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-10 mb-2">Metodología</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-700">
            <li>Precios: cuadros tarifarios que cada prepaga declara ante la Superintendencia de Servicios de Salud, en la modalidad &quot;con aportes&quot; (sin IVA), AMBA, {mes}.</li>
            <li>Plan de entrada: el más económico de cada prepaga con cuadro publicado para esa modalidad. Se usa el mismo plan para los tres perfiles.</li>
            <li>Aporte que llega a la prepaga: {(APORTE_DERIVABLE * 100).toLocaleString('es-AR')}% del sueldo bruto (el 3% del trabajador y el 6% del empleador, menos lo que va al Fondo Solidario de Redistribución).</li>
            <li>Sueldo necesario = precio del plan ÷ {(APORTE_DERIVABLE * 100).toLocaleString('es-AR')}%. No incluye promociones ni descuentos comerciales.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 mt-10 mb-2">Para citar</h2>
          <blockquote className="rounded-xl border-l-4 border-[#E8002D] bg-gray-50 p-4 text-sm text-gray-800 leading-relaxed">{cita}</blockquote>
          <p className="text-sm text-gray-600 mt-3">Podés usar estos datos citando a {SITE_NAME} con un enlace a esta página. Consultas de prensa: <a href="mailto:hola@prepagaya.com.ar" className="text-[#E8002D] hover:underline">hola@prepagaya.com.ar</a>.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
            <Link href="/prensa" className="text-sm font-semibold text-[#E8002D] hover:underline">Informe mensual de aumentos →</Link>
            <Link href="/prensa/sondeo" className="text-sm font-semibold text-[#E8002D] hover:underline">Sondeo: quién busca prepaga →</Link>
            <Link href="/guias/derivar-obra-social-a-prepaga" className="text-sm font-semibold text-[#E8002D] hover:underline">Cómo derivar los aportes →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
