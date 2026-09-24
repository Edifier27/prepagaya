import type { Metadata } from 'next'
import Link from 'next/link'
import { QuizPrepaga } from '@/components/quiz/QuizPrepaga'
import { SITE_URL, formatPrecio } from '@/lib/utils'
import { prepagas, PRECIO_ACTUALIZADO, PRECIO_REFERENCIA } from '@/lib/data/prepagas'
import { BreadcrumbSchema } from '@/components/ui/BreadcrumbSchema'

// "¿Qué prepaga puedo pagar con mi presupuesto?" (auditoría SEO 24-sep-2026):
// la página era solo el quiz (339 palabras, la más flaca del sitio). Los
// rangos salen de los cuartiles de los precios oficiales del mes redondeados a
// $50.000, así se mueven solos con los aumentos en vez de quedar viejos.
const PLANES = prepagas
  .flatMap((p) => p.planes.map((pl) => ({ ...pl, prepaga: p })))
  .sort((a, b) => a.precio - b.precio)
const redondear = (n: number) => Math.max(50000, Math.round(n / 50000) * 50000)
const cuartil = (q: number) => PLANES[Math.floor((PLANES.length - 1) * q)].precio
const cortes = [...new Set([redondear(cuartil(0.25)), redondear(cuartil(0.5)), redondear(cuartil(0.75))])]
const RANGOS = cortes.map((hasta, i) => ({ desde: i === 0 ? 0 : cortes[i - 1], hasta }))
  .concat([{ desde: cortes[cortes.length - 1], hasta: Infinity }])
  .map((r) => ({ ...r, planes: PLANES.filter((pl) => pl.precio > r.desde && pl.precio <= r.hasta) }))
  .filter((r) => r.planes.length > 0)
const tituloRango = (r: { desde: number; hasta: number }) =>
  r.desde === 0 ? `Hasta ${formatPrecio(r.hasta)}` : r.hasta === Infinity ? `Más de ${formatPrecio(r.desde)}` : `De ${formatPrecio(r.desde)} a ${formatPrecio(r.hasta)}`
const MAX_POR_RANGO = 8

export const metadata: Metadata = {
  // Sin "— PrepagaYa": el template del layout ya agrega la marca.
  title: `Prepaga según tu presupuesto: qué plan podés pagar (${PRECIO_ACTUALIZADO.toLowerCase()})`,
  description: `Qué planes de prepaga entran en tu presupuesto, del más barato (${formatPrecio(PLANES[0].precio)}/mes) al más completo, según los precios oficiales de ${PRECIO_ACTUALIZADO.toLowerCase()}. Quiz sin DNI.`,
  alternates: { canonical: `${SITE_URL}/prepaga-por-presupuesto` },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuánto tarda encontrar la prepaga por presupuesto?', acceptedAnswer: { '@type': 'Answer', text: 'Son 6 preguntas y toma menos de 2 minutos. El resultado es instantáneo y no requiere registro.' } },
    { '@type': 'Question', name: '¿El resultado es preciso para mi presupuesto?', acceptedAnswer: { '@type': 'Answer', text: 'El resultado es orientativo y te recomienda la prepaga más adecuada según tu perfil, edad y presupuesto. Para un precio exacto personalizado, usá nuestro comparador o cotizá directamente con la prepaga.' } },
    { '@type': 'Question', name: '¿Necesito dar mis datos para ver el resultado?', acceptedAnswer: { '@type': 'Answer', text: 'No. El resultado es inmediato y no pedimos DNI, nombre ni email para mostrarte la recomendación.' } },
  ],
}

export default function PrepagaPorPresupuestoPage(): React.ReactElement {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="container">
          <BreadcrumbSchema crumbs={[{ label: 'Encontrá tu prepaga por presupuesto' }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-red-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-100 text-[#E8002D] text-xs font-semibold px-4 py-2 rounded-full mb-4">
            6 preguntas · 2 minutos · Sin registro
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Encontrá la prepaga que se ajusta a tu presupuesto
          </h1>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            Respondé 6 preguntas y te mostramos qué prepaga encaja con lo que podés pagar, tu zona y tus necesidades de cobertura.
          </p>
        </div>
      </section>

      {/* Quiz */}
      <section className="py-10">
        <div className="container max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10">
            <QuizPrepaga />
          </div>
        </div>
      </section>

      {/* Planes por rango de presupuesto — datos oficiales del mes */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Qué prepaga podés pagar según tu presupuesto?</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-2xl">
            Todos los planes ordenados por cuota mensual, con los precios oficiales de {PRECIO_ACTUALIZADO.toLowerCase()} ({PRECIO_REFERENCIA}). Para tu edad y tu grupo familiar el precio cambia: <Link href="/comparador" className="text-[#E8002D] font-semibold hover:underline">cotizalo exacto</Link>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RANGOS.map((r) => (
              <div key={r.desde} className="rounded-2xl border border-gray-200 p-5">
                <div className="flex items-baseline justify-between gap-3 mb-3">
                  <h3 className="font-bold text-gray-900">{tituloRango(r)}</h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{r.planes.length} plan{r.planes.length === 1 ? '' : 'es'}</span>
                </div>
                <ul className="divide-y divide-gray-100">
                  {r.planes.slice(0, MAX_POR_RANGO).map((pl) => (
                    <li key={`${pl.prepaga.slug}-${pl.slug}`} className="flex items-center justify-between gap-3 py-2 text-sm">
                      <Link href={`/prepagas/${pl.prepaga.slug}/${pl.slug}`} className="text-gray-800 hover:text-[#E8002D] min-w-0 truncate">
                        {pl.prepaga.nombre} <span className="font-semibold">{pl.nombre}</span>
                      </Link>
                      <span className="tabular-nums font-semibold text-gray-900 whitespace-nowrap">{formatPrecio(pl.precio)}</span>
                    </li>
                  ))}
                </ul>
                {r.planes.length > MAX_POR_RANGO && (
                  <Link href="/precios" className="inline-block mt-3 text-xs font-semibold text-[#E8002D] hover:underline">
                    Ver los {r.planes.length} planes de este rango en la tabla de precios →
                  </Link>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            ¿Buscás lo más barato? Mirá el <Link href="/prepagas-economicas" className="text-[#E8002D] font-semibold hover:underline">ranking de prepagas económicas</Link>. Todos los planes cubren el PMO completo por ley: lo que cambia entre rangos es la cartilla, el copago y las prestaciones extra.
          </p>
        </div>
      </section>

      {/* Footer info */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-2xl mx-auto text-center">
          <p className="text-sm text-gray-500 mb-2">
            Sin registro · Sin DNI · Resultado instantáneo
          </p>
          <p className="text-xs text-gray-400">
            El resultado es orientativo. Los precios reales varían según edad, plan y modalidad de contratación.
          </p>
        </div>
      </section>
    </>
  )
}
