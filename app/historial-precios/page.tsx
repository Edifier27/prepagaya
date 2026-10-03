import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL, SITE_NAME, PRIORIDAD_PARTNERS, PRECIOS_UPDATE, formatPrecio } from '@/lib/utils'
import { BreadcrumbSchema } from '@/components/ui/BreadcrumbSchema'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { ultimoMesOficial } from '@/lib/data/aumentos'
import historial from '@/lib/data/historial-precios.json'

// Historial de precios (3-oct-2026). Antes era una serie del OSDE 310 de
// 2024-2025 escrita a mano, sin fuente verificable, que terminaba en junio
// de 2025 y mostraba ese precio como "actual". Ahora sale de los cuadros
// tarifarios de la SSSalud guardados en data/sssalud
// (scripts/cuadros-sssalud/historial.py) y suma un mes con cada
// actualización automática.

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const mesCorto = (p: number) => `${MESES[(p % 100) - 1].slice(0, 3)} ${Math.floor(p / 100)}`
const mesLargo = (p: number) => `${MESES[(p % 100) - 1]} ${Math.floor(p / 100)}`

// Los últimos seis meses: la tabla tiene que entrar en el celular
const PERIODOS: number[] = historial.periodos.slice(-6)
const PRECIOS = historial.precios as Record<string, Record<string, Record<string, number>>>

// Los planes más cotizados de cada prepaga, Swiss Medical primero
const DESTACADOS: [string, string][] = [
  ['swiss-medical', 'smg20'], ['swiss-medical', 's2'], ['osde', '310'], ['sancor-salud', 'plan-3000'],
  ['medife', 'plata'], ['galeno', 'plata-300'], ['avalian', 'as200'], ['premedic', 'plan-300'],
]

function fila(slug: string, planSlug: string) {
  const prep = prepagas.find((p) => p.slug === slug)
  const plan = prep?.planes.find((pl) => pl.slug === planSlug)
  const serie = PRECIOS[slug]?.[planSlug]
  if (!prep || !plan || !serie) return null
  const valores = PERIODOS.map((p) => serie[String(p)] ?? null)
  const conDato = valores.filter((v): v is number => v !== null)
  const variacion = conDato.length > 1 ? (conDato[conDato.length - 1] / conDato[0] - 1) * 100 : null
  return { prep, plan, valores, variacion }
}

const pct = (v: number) => `${v >= 0 ? '+' : ''}${v.toLocaleString('es-AR', { maximumFractionDigits: 1 })}%`
const primero = PERIODOS[0]
const ultimo = PERIODOS[PERIODOS.length - 1]

export const metadata: Metadata = {
  title: `Historial de precios de prepagas ${Math.floor(ultimo / 100)}: cuánto aumentó cada plan`,
  description: `Cuánto costó cada plan de prepaga mes a mes desde ${mesLargo(primero)}, según los cuadros tarifarios oficiales de la Superintendencia de Servicios de Salud. Swiss Medical, OSDE, Sancor Salud, Medifé, Galeno y más. Actualizado a ${PRECIO_ACTUALIZADO.toLowerCase()}.`,
  alternates: { canonical: `${SITE_URL}/historial-precios` },
  keywords: [
    'historial precios prepagas argentina',
    'evolución precios prepaga',
    'cuanto aumentaron las prepagas',
    'precio osde 310 historial',
    'precio swiss medical smg20 historial',
    'aumento prepagas 2026',
  ],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Historial de precios de prepagas: cuánto aumentó cada plan',
  description: `Precio de lista de cada plan mes a mes según los cuadros tarifarios de la Superintendencia de Servicios de Salud, desde ${mesLargo(primero)}.`,
  url: `${SITE_URL}/historial-precios`,
  image: `${SITE_URL}/opengraph-image`,
  dateModified: PRECIOS_UPDATE,
  inLanguage: 'es-AR',
  author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/historial-precios` },
}

function TablaPlanes({ filas }: { filas: NonNullable<ReturnType<typeof fila>>[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
          <tr>
            <th className="sticky left-0 bg-gray-50 text-left px-3 py-2">Plan</th>
            {PERIODOS.map((p) => <th key={p} className="text-right px-3 py-2 whitespace-nowrap">{mesCorto(p)}</th>)}
            <th className="text-right px-3 py-2 whitespace-nowrap">Variación</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((f) => (
            <tr key={`${f.prep.slug}-${f.plan.slug}`} className="border-t border-gray-100">
              <td className="sticky left-0 bg-white px-3 py-2 whitespace-nowrap">
                <Link href={`/prepagas/${f.prep.slug}/${f.plan.slug}`} className="font-semibold text-gray-900 hover:text-[#E8002D] hover:underline">
                  {f.plan.nombre.startsWith(f.prep.nombre) ? f.plan.nombre : `${f.prep.nombre} ${f.plan.nombre.replace(/^Plan /, '')}`}
                </Link>
              </td>
              {f.valores.map((v, i) => (
                <td key={PERIODOS[i]} className="px-3 py-2 text-right tabular-nums text-gray-900 whitespace-nowrap">{v === null ? <span className="text-gray-300">—</span> : formatPrecio(v)}</td>
              ))}
              <td className="px-3 py-2 text-right tabular-nums whitespace-nowrap text-gray-700">{f.variacion === null ? '—' : pct(f.variacion)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function HistorialPreciosPage(): React.ReactElement {
  const destacados = DESTACADOS.map(([s, p]) => fila(s, p)).filter((x) => x !== null)
  const mes = ultimoMesOficial()
  const ranking = mes ? Object.values(mes.prepagas).sort((a, b) => a.mediana - b.mediana) : []
  // Todas las prepagas con historial, Swiss Medical y los partners primero
  const orden = (s: string) => (PRIORIDAD_PARTNERS.includes(s) ? PRIORIDAD_PARTNERS.indexOf(s) : 100)
  const porPrepaga = Object.keys(PRECIOS)
    .sort((a, b) => orden(a) - orden(b))
    .map((slug) => {
      const prep = prepagas.find((p) => p.slug === slug)
      const filas = (prep?.planes ?? []).map((pl) => fila(slug, pl.slug)).filter((x) => x !== null)
      return prep && filas.length ? { prep, filas } : null
    })
    .filter((x) => x !== null)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="container">
          <BreadcrumbSchema crumbs={[{ label: 'Historial de precios de prepagas' }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-red-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-100 text-[#E8002D] text-xs font-semibold px-4 py-2 rounded-full mb-4">
            Cuadros oficiales de la SSSalud · {PRECIO_ACTUALIZADO}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Historial de precios de prepagas: cuánto aumentó cada plan
          </h1>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            El precio de lista de cada plan, mes a mes, según los cuadros tarifarios que cada prepaga declara ante la Superintendencia de Servicios de Salud. Referencia: 30 años, contratación directa, CABA y GBA, IVA incluido.
          </p>
        </div>
      </section>

      {/* Último aumento oficial */}
      {mes && ranking.length > 0 && (
        <section className="py-10 bg-white">
          <div className="container max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 bg-[#E8002D] text-white rounded-2xl p-6 flex flex-col justify-center">
                <div className="text-sm font-medium text-red-100 mb-1">Aumento promedio de {mes.label.toLowerCase()}</div>
                <div className="text-5xl font-bold mb-2">{pct(mes.promedio)}</div>
                <div className="text-red-100 text-sm">
                  Promedio de {ranking.length} prepagas según sus cuadros oficiales. Va de {pct(ranking[0].mediana)} ({ranking[0].nombre}) a {pct(ranking[ranking.length - 1].mediana)} ({ranking[ranking.length - 1].nombre}).
                </div>
              </div>
              <Link href="/aumentos" className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-red-200 transition-colors flex flex-col justify-center">
                <div className="text-sm font-bold text-gray-900">Aumentos mes a mes</div>
                <div className="text-xs text-gray-500 mt-1">El aumento de cada prepaga, el acumulado del año y la comparación con la inflación.</div>
                <div className="text-sm font-bold text-[#E8002D] mt-3">Ver aumentos →</div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Planes más cotizados */}
      <section className="py-10 bg-gray-50 border-y border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Precio de los planes más cotizados, mes a mes</h2>
          <p className="text-sm text-gray-500 mb-4">
            30 años, contratación directa, CABA y GBA, IVA incluido. Un guion significa que la prepaga todavía no publicó el cuadro de ese mes; la variación compara el primer y el último mes con dato. Cotizando online tenés 15% OFF sobre estos valores.
          </p>
          <TablaPlanes filas={destacados} />
        </div>
      </section>

      {/* Todos los planes, por prepaga */}
      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Todos los planes, por prepaga</h2>
          <p className="text-sm text-gray-500 mb-4">Tocá una prepaga para ver el historial de cada uno de sus planes.</p>
          <div className="space-y-3">
            {porPrepaga.map(({ prep, filas }) => (
              <details key={prep.slug} className="group rounded-xl border border-gray-200 bg-white">
                <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 font-semibold text-gray-900">
                  <span>{prep.nombre} <span className="font-normal text-gray-500">· {filas.length} {filas.length === 1 ? 'plan' : 'planes'}</span></span>
                  <span className="text-[#E8002D] transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                </summary>
                <div className="px-3 pb-3">
                  <TablaPlanes filas={filas} />
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo leer los precios */}
      <section className="py-10 bg-gray-50 border-y border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cómo leer estos precios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Son precios de lista oficiales</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Cada prepaga declara sus cuadros tarifarios ante la Superintendencia de Servicios de Salud, por plan, región y franja de edad. Acá mostramos el valor a los 30 años en CABA y GBA; cotizando online tenés 15% OFF sobre ese precio.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Por qué suben todos los meses</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Desde el DNU 70/2023, vigente desde enero de 2024, cada prepaga fija sus aumentos y los informa en sus cuadros tarifarios. Hoy suben todos los meses, en general en línea con la inflación.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Tu precio depende de tu edad y tu zona</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                El mismo plan puede costar el doble o el triple según tu edad, y cada prepaga tiene listas distintas por región. Para ver el precio exacto de tu grupo, usá el comparador.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Si el precio es un problema</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Si trabajás en relación de dependencia, podés derivar tu aporte de obra social a la prepaga: esa lista no lleva el IVA del 10,5% y además se descuentan tus aportes. Los planes con copago son los de cuota más baja de cada prepaga.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-[#E8002D] text-white">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">
            Mirá el precio de hoy para tu edad
          </h2>
          <p className="text-red-100 mb-7 text-sm">
            Compará los precios de todas las prepagas con tu edad y tu zona, con 15% OFF cotizando online.
          </p>
          <Link
            href="/comparador"
            className="inline-flex items-center justify-center font-semibold rounded-lg px-7 py-3.5 text-base bg-[#00875A] text-white hover:bg-[#006644] transition-colors shadow-sm"
          >
            Ver precios actualizados y cotizá
          </Link>
        </div>
      </section>
    </>
  )
}
