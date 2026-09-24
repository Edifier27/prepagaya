import type { Metadata } from 'next'
import Link from 'next/link'
import { prepagas, PRECIO_ACTUALIZADO, PRECIOS_FUENTE_URL } from '@/lib/data/prepagas'
import { formatPrecio, SITE_NAME, SITE_URL } from '@/lib/utils'
import { BreadcrumbSchema } from '@/components/ui/BreadcrumbSchema'
import { Badge } from '@/components/ui/Badge'
import { ultimoMesOficial } from '@/lib/data/aumentos'
import preciosOficiales from '@/lib/data/precios-oficiales.json'

// El mes se toma de PRECIO_ACTUALIZADO (lib/data/prepagas.ts) — única fuente
// de verdad para evitar que esta página quede desincronizada del resto del sitio.
const MES_ACTUAL = PRECIO_ACTUALIZADO
// Fecha y aumento salen solos de los cuadros tarifarios de la SSSalud (los
// regenera la tarea programada cada 15 días): nada para tocar a mano.
const FECHA_ISO = preciosOficiales.generado
const FECHA_ACTUALIZACION = new Date(FECHA_ISO + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
const MES_OFICIAL = ultimoMesOficial()
const VARIACION_PROMEDIO = MES_OFICIAL ? `+${MES_OFICIAL.promedio.toLocaleString('es-AR')}%` : null

const todosLosPlanes = prepagas.flatMap((p) => p.planes.map((pl) => ({ ...pl, prepaga: p })))
const precioMin = Math.min(...todosLosPlanes.map((pl) => pl.precio))
const precioMax = Math.max(...todosLosPlanes.map((pl) => pl.precio))
const planMasBarato = todosLosPlanes.find((pl) => pl.precio === precioMin)!

// "¿Cuánto sale una prepaga?" (23-sep-2026): esta sección reemplaza a la guía
// /guias/precios-prepagas-actualizados, que competía con esta página por la
// misma búsqueda (redirigida acá en next.config.ts).
function referencia(slug: string, criterio: 'barato' | 'destacado' | 'caro') {
  const p = prepagas.find((x) => x.slug === slug)!
  const ordenados = [...p.planes].sort((a, b) => a.precio - b.precio)
  const plan = criterio === 'barato' ? ordenados[0] : criterio === 'caro' ? ordenados[ordenados.length - 1] : (p.planes.find((pl) => pl.destacado) ?? ordenados[0])
  return { prepaga: p, plan }
}
const NIVELES = [
  { titulo: 'Económica', texto: 'El plan de entrada más accesible entre nuestros partners.', ...referencia('premedic', 'barato') },
  { titulo: 'Intermedia', texto: 'El plan más elegido de Swiss Medical, la que destacamos como mejor prepaga.', ...referencia('swiss-medical', 'destacado') },
  { titulo: 'Premium', texto: 'El plan más completo de Swiss Medical.', ...referencia('swiss-medical', 'caro') },
]

const faqs = [
  {
    q: `¿Cuánto sale una prepaga en ${MES_ACTUAL.toLowerCase()}?`,
    a: `Para una persona de 30 años con contratación directa, los planes van desde ${formatPrecio(precioMin)}/mes hasta ${formatPrecio(precioMax)}/mes. Como referencia: ${NIVELES.map((n) => `${n.prepaga.nombre} ${n.plan.nombre} ${formatPrecio(n.plan.precio)}`).join(', ')}. El precio final depende de tu edad, tu zona y si derivás aportes.`,
  },
  ...(MES_OFICIAL ? [{
    q: `¿Cuánto aumentaron las prepagas en ${MES_OFICIAL.label.toLowerCase()}?`,
    a: `Según los cuadros tarifarios que las prepagas declaran ante la Superintendencia de Servicios de Salud, el aumento promedio de ${MES_OFICIAL.label.toLowerCase()} fue de ${MES_OFICIAL.promedio.toLocaleString('es-AR')}%. En la página de aumentos está el detalle por prepaga.`,
  }] : []),
  {
    q: '¿Cuál es la prepaga más barata?',
    a: `El plan más económico de esta tabla es ${planMasBarato.prepaga.nombre} ${planMasBarato.nombre}, desde ${formatPrecio(precioMin)}/mes para una persona de 30 años.`,
  },
  {
    q: '¿Los precios varían según la edad?',
    a: 'Sí. Los precios de esta tabla son para una persona de 30 años, y cada prepaga tiene su propia escala por edad: algunas suben cada cinco años y otras mantienen el precio a partir de cierta edad. Con la calculadora ves el precio para tu edad.',
  },
  {
    q: '¿El precio incluye IVA?',
    a: 'Sí. El precio de contratación directa incluye el IVA del 10,5%. Si trabajás en relación de dependencia y derivás tus aportes, esa lista no lleva IVA y además se descuentan tus aportes de la cuota.',
  },
]

export const metadata: Metadata = {
  title: `Precios de prepagas ${MES_ACTUAL.toLowerCase()}: cuánto sale cada plan (tabla oficial)`,
  description: `Precios de prepagas de ${MES_ACTUAL.toLowerCase()}: todos los planes de Swiss Medical, OSDE, Sancor, Premedic, Avalian y más, desde ${formatPrecio(precioMin)}/mes. Dato oficial SSSalud.`,
  alternates: { canonical: `${SITE_URL}/precios` },
  keywords: [
    `precios prepagas ${MES_ACTUAL.toLowerCase()}`,
    'precios prepagas argentina 2026',
    'tabla precios prepagas',
    'cuanto cuesta una prepaga argentina',
    'cuanto sale una prepaga',
    'cuanto cuesta una prepaga',
    'precios medicina prepaga argentina',
  ],
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Precios de prepagas Argentina — ${MES_ACTUAL}`,
    description: `Tabla completa y actualizada de precios de prepagas en Argentina al ${MES_ACTUAL}. Todos los planes sin formularios.`,
    url: `${SITE_URL}/precios`,
    image: `${SITE_URL}/opengraph-image`,
    datePublished: '2026-01-01',
    dateModified: FECHA_ISO,
    isBasedOn: PRECIOS_FUENTE_URL,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/precios` },
    inLanguage: 'es-AR',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
]

export default function PreciosPage(): React.ReactElement {
  // Ordenar prepagas de menor a mayor precio de entrada
  const prepagasOrdenadas = [...prepagas].sort((a, b) => {
    const minA = Math.min(...a.planes.map(p => p.precio))
    const minB = Math.min(...b.planes.map(p => p.precio))
    return minA - minB
  })

  const totalPlanes = prepagas.reduce((acc, p) => acc + p.planes.length, 0)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="container">
          <BreadcrumbSchema crumbs={[{ label: `Precios de prepagas — ${MES_ACTUAL}` }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-red-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-red-100 text-[#E8002D] text-xs font-bold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-[#E8002D] rounded-full animate-pulse" />
              Actualizado el {FECHA_ACTUALIZACION}
            </span>
            {MES_OFICIAL && VARIACION_PROMEDIO && (
              <Link href="/aumentos" className="text-xs text-gray-500 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full font-medium hover:border-amber-200">
                Aumento de {MES_OFICIAL.label.toLowerCase()}: {VARIACION_PROMEDIO} promedio (SSSalud)
              </Link>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            Precios de prepagas Argentina<br className="hidden md:block" />
            <span className="text-[#E8002D]"> — {MES_ACTUAL}</span>
          </h1>
          <p className="text-gray-600 max-w-2xl text-base mb-6">
            Tabla completa con todos los planes y precios de las {prepagas.length} principales prepagas.
            Precios visibles sin formularios. Referencia: persona de 30 años, contratación individual.{' '}
            Fuente: cuadros tarifarios oficiales de la{' '}
            <a href={PRECIOS_FUENTE_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-800">Superintendencia de Servicios de Salud</a>
            {' '}para las prepagas que los declaran; el resto, precio de referencia.
          </p>

          {/* Stats rápidos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Prepagas comparadas', value: `${prepagas.length}` },
              { label: 'Planes analizados', value: `${totalPlanes}` },
              { label: 'Precio más bajo', value: formatPrecio(precioMin) },
              { label: 'Precio más alto', value: formatPrecio(precioMax) },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <div className="text-xl font-bold text-[#E8002D]">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ¿Cuánto sale una prepaga? — absorbe la ex guía de precios */}
      <section id="cuanto-sale" className="py-10 bg-white border-b border-gray-100 scroll-mt-24">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-2">¿Cuánto sale una prepaga en {MES_ACTUAL.toLowerCase()}? Económica, intermedia y premium</h2>
          <p className="text-sm text-gray-600 max-w-3xl mb-5">
            Entre el plan más barato ({formatPrecio(precioMin)}) y el más caro ({formatPrecio(precioMax)}) hay {totalPlanes} planes con distinto copago, red y cobertura.
            Estas son tres referencias para una persona de 30 años con contratación directa:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {NIVELES.map((n) => (
              <Link
                key={n.titulo}
                href={`/prepagas/${n.prepaga.slug}/${n.plan.slug}`}
                className="group rounded-2xl border border-gray-200 hover:border-[#E8002D]/40 p-5 transition-colors"
              >
                <div className="text-xs font-bold uppercase tracking-wide text-[#E8002D]">{n.titulo}</div>
                <div className="mt-1 font-bold text-gray-900 group-hover:text-[#E8002D]">{n.prepaga.nombre} {n.plan.nombre}</div>
                <div className="text-2xl font-black text-gray-900 tabular-nums mt-1">{formatPrecio(n.plan.precio)}<span className="text-sm font-medium text-gray-400">/mes</span></div>
                <p className="text-xs text-gray-500 mt-2">{n.texto}</p>
              </Link>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 max-w-3xl">
            El precio de lista no es lo único que importa: dos planes sin copago pueden tener cartillas muy distintas. Antes de decidir, fijate que la cartilla tenga los prestadores que usás.
          </p>
        </div>
      </section>

      {/* Tabla resumen — todas las prepagas */}
      <section className="py-10 bg-white">
        <div className="container max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">Precio más bajo por prepaga — {MES_ACTUAL}</h2>
            <span className="text-xs text-gray-400 hidden sm:block">Persona 30 años · contratación directa con IVA</span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-700">#</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-700">Prepaga</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-700">Plan más económico</th>
                    <th className="text-right px-5 py-3.5 font-semibold text-gray-700">Precio/mes</th>
                    <th className="text-right px-5 py-3.5 font-semibold text-gray-700">Precio plan estrella</th>
                    <th className="text-center px-5 py-3.5 font-semibold text-gray-700">Satisfacción</th>
                    <th className="px-5 py-3.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {prepagasOrdenadas.map((p, i) => {
                    const planMin = [...p.planes].sort((a, b) => a.precio - b.precio)[0]
                    const planEstrella = p.planes.find(pl => pl.destacado) ?? planMin
                    return (
                      <tr key={p.slug} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-5 py-4 text-gray-400 font-medium">{i + 1}</td>
                        <td className="px-5 py-4">
                          <Link
                            href={`/prepagas/${p.slug}`}
                            className="flex items-center gap-2.5 group-hover:text-[#E8002D] transition-colors"
                          >
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: p.colorPrimario }}
                            />
                            <span className="font-semibold text-gray-900 group-hover:text-[#E8002D]">
                              {p.nombre}
                            </span>
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-gray-600">{planMin.nombre}</td>
                        <td className="px-5 py-4 text-right">
                          <span className="font-bold text-[#E8002D]">{formatPrecio(planMin.precio)}</span>
                        </td>
                        <td className="px-5 py-4 text-right text-gray-500">
                          {planEstrella.slug !== planMin.slug
                            ? formatPrecio(planEstrella.precio)
                            : <span className="text-gray-300">—</span>
                          }
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            p.satisfaccion >= 80 ? 'bg-green-100 text-green-700' :
                            p.satisfaccion >= 75 ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {p.satisfaccion}%
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/prepagas/${p.slug}`}
                            className="text-xs font-semibold text-[#E8002D] hover:underline whitespace-nowrap"
                          >
                            Ver planes →
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            * Precios orientativos para persona de 30 años contratación individual con IVA. Los precios varían según edad y zona. Actualizado: {MES_ACTUAL}.
          </p>
        </div>
      </section>

      {/* Desglose completo por prepaga */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Todos los planes — precios completos {MES_ACTUAL}</h2>
          <p className="text-sm text-gray-500 mb-8">
            Hacé clic en cualquier plan para ver cobertura completa, copago y detalles.
          </p>

          <div className="space-y-6">
            {prepagasOrdenadas.map((p) => {
              const planesOrdenados = [...p.planes].sort((a, b) => a.precio - b.precio)
              return (
                <div key={p.slug} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  {/* Header prepaga */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100"
                    style={{ borderLeftWidth: 4, borderLeftColor: p.colorPrimario }}>
                    <div className="flex items-center gap-3">
                      <div>
                        <Link
                          href={`/prepagas/${p.slug}`}
                          className="font-bold text-gray-900 hover:text-[#E8002D] transition-colors text-base"
                        >
                          {p.nombre}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-400">{p.satisfaccion}% satisfacción</span>
                          <span className="text-gray-300">·</span>
                          <span className="text-xs text-gray-400">{p.planes.length} planes</span>
                          {!p.caracteristicas.coberturaNacional && (
                            <>
                              <span className="text-gray-300">·</span>
                              <span className="text-xs text-amber-600 font-medium">Cobertura parcial</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/prepagas/${p.slug}`}
                      className="text-xs font-semibold text-[#E8002D] hover:underline hidden sm:block"
                    >
                      Ver página completa →
                    </Link>
                  </div>

                  {/* Planes */}
                  <div className="divide-y divide-gray-50">
                    {planesOrdenados.map((plan) => (
                      <Link
                        key={plan.slug}
                        href={`/prepagas/${p.slug}/${plan.slug}`}
                        className="flex items-center justify-between px-5 py-3.5 hover:bg-red-50 transition-colors group"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-gray-900 group-hover:text-[#E8002D] transition-colors text-sm">
                                {plan.nombre}
                              </span>
                              {plan.destacado && (
                                <span className="bg-red-100 text-[#E8002D] text-xs font-bold px-2 py-0.5 rounded-full">
                                  Más elegido
                                </span>
                              )}
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                plan.copago
                                  ? 'bg-gray-100 text-gray-500'
                                  : 'bg-green-100 text-green-700 font-medium'
                              }`}>
                                {plan.copago ? 'Con copago' : 'Sin copago'}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                plan.redAbierta
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-500'
                              }`}>
                                Red {plan.redAbierta ? 'abierta' : 'cerrada'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 hidden sm:block">
                              {plan.descripcion}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                          <div className="text-right">
                            <div className="font-bold text-[#E8002D] text-base">{formatPrecio(plan.precio)}</div>
                            <div className="text-xs text-gray-400">/mes</div>
                          </div>
                          <svg className="w-4 h-4 text-gray-400 group-hover:text-[#E8002D] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contexto editorial */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            ¿Cómo se calculan los precios de prepagas?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                titulo: 'Precio base (30 años)',
                texto: 'Los precios publicados corresponden a una persona de 30 años contratando de forma individual. Es el precio de referencia del mercado.',
              },
              {
                titulo: 'Variación por edad',
                texto: 'A los 40 años los precios suben un 30-50%. A los 50 años, el doble. Las prepagas aplican tablas de edad que multiplican el precio base.',
              },
              {
                titulo: 'IVA incluido',
                texto: 'Los precios incluyen el IVA del 10,5% (la alícuota de salud). Si trabajás en relación de dependencia y derivás tu obra social, pagás la lista sin IVA y además se descuentan tus aportes.',
              },
            ].map((item) => (
              <div key={item.titulo} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{item.titulo}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Preguntas frecuentes sobre precios de prepagas</h2>
          <div className="space-y-4">
            {faqs.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Links internos — silo */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-5">Más información sobre precios</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/historial-precios"
              className="flex flex-col gap-1 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all group"
            >
              <span className="text-sm font-bold text-gray-900 group-hover:text-[#E8002D]">Historial de precios →</span>
              <span className="text-xs text-gray-500">Evolución mensual 2024–2026</span>
            </Link>
            <Link
              href="/calculadora"
              className="flex flex-col gap-1 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all group"
            >
              <span className="text-sm font-bold text-gray-900 group-hover:text-[#E8002D]">Calculadora de costo →</span>
              <span className="text-xs text-gray-500">Precio exacto para tu edad</span>
            </Link>
            <Link
              href="/ranking"
              className="flex flex-col gap-1 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all group"
            >
              <span className="text-sm font-bold text-gray-900 group-hover:text-[#E8002D]">Ranking de prepagas →</span>
              <span className="text-xs text-gray-500">Las mejores por satisfacción</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-[#E8002D] text-white">
        <div className="container max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Cotizá el precio real para tu edad</h2>
          <p className="text-red-100 mb-7 text-sm">
            Los precios varían según tu edad y zona. Usá nuestro cotizador para ver el precio exacto para tu perfil.
          </p>
          <Link
            href="/#cotizador"
            className="inline-flex items-center justify-center font-bold rounded-xl px-8 py-4 text-base bg-[#00875A] text-white hover:bg-[#006644] transition-colors shadow-sm"
          >
            Ver precio para mi edad →
          </Link>
        </div>
      </section>
    </>
  )
}
