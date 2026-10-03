import type { Metadata } from 'next'
import Link from 'next/link'
import { prepagas, PRECIO_ACTUALIZADO, nivelPrecio } from '@/lib/data/prepagas'
import { provinciasSEO } from '@/lib/data/zonas'
import { SITE_NAME, SITE_URL, formatPrecio, PRIORIDAD_PARTNERS, DESTACADO_PARTNER, PARTNERS_OFICIALES_TEXTO, TIEMPO_RESPUESTA } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { BreadcrumbSchema } from '@/components/ui/BreadcrumbSchema'
import { NivelPrecioBadge } from '@/components/ui/NivelPrecioBadge'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'
import type { Prepaga } from '@/types'

// Rediseño 28-sep-2026 (UX + copy): respuesta directa arriba (GEO), ganadores
// por categoría alineados con el posicionamiento de partners (Swiss mejor
// prepaga, Premedic mejor precio, Sancor y Avalian para el interior), ranking
// completo compacto, satisfacción en tabla, "desde $" con el plan más barato
// real y aviso de transparencia (somos partner de algunas).

const MES = PRECIO_ACTUALIZADO.toLowerCase()
const ANIO = PRECIO_ACTUALIZADO.slice(-4)

const precioDesde = (p: Prepaga) => Math.min(...p.planes.map((pl) => pl.precio))
const bySlug = (s: string) => prepagas.find((p) => p.slug === s)!

// Orden de nuestro ranking: partners en su prioridad, OSDE (también partner)
// y después el resto por satisfacción declarada.
const ORDEN_RANKING = [
  ...PRIORIDAD_PARTNERS,
  'osde',
  ...[...prepagas]
    .filter((p) => !PRIORIDAD_PARTNERS.includes(p.slug) && p.slug !== 'osde')
    .sort((a, b) => b.satisfaccion - a.satisfaccion)
    .map((p) => p.slug),
]

const CATEGORIAS = [
  { slug: 'swiss-medical', titulo: 'Mejor prepaga', para: 'Para quien quiere la cobertura más completa y sanatorios propios.' },
  { slug: 'premedic', titulo: 'Mejor precio', para: 'Para quien prioriza pagar menos sin resignar lo esencial.' },
  { slug: 'sancor-salud', titulo: 'Mejor en el interior', para: 'Para quien vive en Córdoba, Santa Fe, Entre Ríos y el centro del país.' },
  { slug: 'avalian', titulo: 'Mejor en el interior', para: 'Para quien necesita una red amplia en todo el país.' },
]

const respuesta = `Para la mayoría de las personas, la mejor prepaga de Argentina en ${ANIO} es Swiss Medical: tiene 9 sanatorios propios y más de 30 SMG Center en AMBA. Si lo que más te importa es el precio, Premedic es la opción más económica (desde ${formatPrecio(precioDesde(bySlug('premedic')))} por mes). Si vivís en el interior, Sancor Salud y Avalian tienen las redes más amplias fuera de AMBA.`

const faqs = [
  { q: `¿Cuál es la mejor prepaga de Argentina en ${ANIO}?`, a: respuesta },
  {
    q: '¿Cuál es la prepaga más barata?',
    a: (() => {
      const p = [...prepagas].sort((a, b) => precioDesde(a) - precioDesde(b))[0]
      return `El plan más económico de las ${prepagas.length} prepagas que comparamos es de ${p.nombre}, desde ${formatPrecio(precioDesde(p))} por mes para una persona de 30 años (${MES}). El precio final depende de tu edad y tu zona.`
    })(),
  },
  {
    q: '¿Cuál es la mejor prepaga para el interior del país?',
    a: 'Sancor Salud y Avalian. Sancor Salud informa más de 200.000 prestadores y más de 200 puntos de atención, con fuerte presencia en Córdoba, Santa Fe y Entre Ríos. Avalian informa más de 100.000 prestadores en todo el país. Igual conviene mirar la cartilla de tu ciudad antes de decidir.',
  },
  {
    q: '¿Cómo armamos este ranking?',
    a: `El orden de "Nuestro ranking" es la recomendación de nuestros asesores, por la experiencia de atención de cada prepaga. Somos partner oficial de ${PARTNERS_OFICIALES_TEXTO}, y lo aclaramos para que lo tengas en cuenta. Por eso publicamos aparte el ranking por satisfacción declarada y el de precio, que salen de datos y no de nuestra opinión. Los precios son los de los cuadros tarifarios oficiales de la Superintendencia de Servicios de Salud.`,
  },
]

export const metadata: Metadata = {
  title: `Mejores prepagas de Argentina ${ANIO}: ranking por categoría y precio`,
  description: `¿Cuál es la mejor prepaga? Ranking ${MES} por categoría: mejor en general, más económica y mejor cartilla, con precio oficial y satisfacción real.`,
  alternates: {
    canonical: `${SITE_URL}/ranking`,
    // Par recíproco de las versiones en inglés y ruso del ranking (las dos
    // declaraban /ranking como su versión en español y /ranking no les
    // respondía: Google ignora el hreflang sin reciprocidad).
    languages: {
      'es-AR': `${SITE_URL}/ranking`,
      en: `${SITE_URL}/en/best-health-insurance-argentina`,
      ru: `${SITE_URL}/ru/luchshaya-strahovka-argentina`,
    },
  },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Mejores prepagas de Argentina ${ANIO}`,
    description: 'Ranking de prepagas de Argentina de los asesores de PrepagaYa',
    numberOfItems: ORDEN_RANKING.length,
    itemListElement: ORDEN_RANKING.map((slug, i) => ({ '@type': 'ListItem', position: i + 1, name: bySlug(slug).nombre, url: `${SITE_URL}/prepagas/${slug}` })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
]

export default function RankingPage() {
  const porSatisfaccion = [...prepagas].sort((a, b) => b.satisfaccion - a.satisfaccion)
  const porPrecio = [...prepagas].sort((a, b) => precioDesde(a) - precioDesde(b))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero con respuesta directa */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 pt-8 pb-10">
        <div className="container max-w-5xl mx-auto">
          <div className="mb-4">
            <BreadcrumbSchema crumbs={[{ label: 'Ranking de prepagas' }]} />
          </div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#E8002D] mb-2">Actualizado en {MES} · {prepagas.length} prepagas analizadas</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">
            Las mejores prepagas de Argentina en {ANIO}
          </h1>
          <div className="mt-5 max-w-3xl rounded-2xl border-l-4 border-[#E8002D] bg-white shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Respuesta corta</p>
            <p className="text-gray-800 leading-relaxed">{respuesta}</p>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link href="/comparador" className="inline-flex items-center gap-2 px-5 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm transition-colors">
              Cotizar la que más me conviene →
            </Link>
            <span className="text-xs text-gray-500">Gratis · te respondemos en {TIEMPO_RESPUESTA}</span>
          </div>
        </div>
      </section>

      {/* Ganadores por categoría */}
      <section className="py-10 bg-white">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">La mejor según lo que buscás</h2>
          <p className="text-sm text-gray-500 mb-6">No hay una prepaga ideal para todos: elegí la categoría que más se parece a tu caso.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIAS.map((cat, i) => {
              const p = bySlug(cat.slug)
              const principal = i === 0
              return (
                <div
                  key={cat.slug}
                  className={`flex flex-col rounded-2xl border p-5 bg-white ${principal ? 'border-[#E8002D] shadow-md ring-1 ring-[#E8002D]/10' : 'border-gray-200'}`}
                >
                  <span className={`self-start text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${principal ? 'bg-[#E8002D] text-white' : 'bg-amber-50 text-amber-800 border border-amber-100'}`}>
                    {principal ? '★ ' : ''}{cat.titulo}
                  </span>
                  <div className="flex items-center gap-3 mt-4">
                    <PrepagaLogo slug={p.slug} nombre={p.nombre} colorPrimario={p.colorPrimario} size="md" />
                    <div className="font-bold text-lg text-gray-900 leading-tight">{p.nombre}</div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">{cat.para}</p>
                  <ul className="mt-3 space-y-1.5 text-xs text-gray-600 flex-1">
                    {p.pros.slice(0, 2).map((x) => (
                      <li key={x} className="flex gap-1.5"><span className="text-emerald-500 flex-shrink-0">✓</span><span className="line-clamp-3">{x}</span></li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500">Desde</div>
                    <div className="text-xl font-black text-gray-900 tabular-nums">{formatPrecio(precioDesde(p))}<span className="text-xs font-medium text-gray-400">/mes</span></div>
                  </div>
                  <Link href="/comparador" className={`mt-3 block text-center text-sm font-bold rounded-xl px-3 py-2.5 transition-colors ${principal ? 'bg-[#E8002D] hover:bg-[#B8001F] text-white' : 'bg-gray-900 hover:bg-black text-white'}`}>
                    Cotizar {p.nombre}
                  </Link>
                  <Link href={`/prepagas/${p.slug}`} className="mt-2 text-center text-xs font-semibold text-gray-500 hover:text-[#E8002D]">
                    Ver planes y precios →
                  </Link>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-gray-400 mt-4">Precio de lista del plan más económico, persona de 30 años, {MES}, según los cuadros tarifarios oficiales de la SSSalud.</p>
        </div>
      </section>

      {/* Ranking completo */}
      <section className="py-10 bg-gray-50 border-y border-gray-100">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Nuestro ranking de las {ORDEN_RANKING.length} prepagas</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-3xl">
            El orden es la recomendación de nuestros asesores, por la experiencia de atención diaria con cada prepaga. Somos partner oficial de {PARTNERS_OFICIALES_TEXTO}: por eso, más abajo, publicamos también los rankings por satisfacción y por precio, que salen de datos.
          </p>
          <ol className="space-y-2.5">
            {ORDEN_RANKING.map((slug, i) => {
              const p = bySlug(slug)
              const destacado = DESTACADO_PARTNER[slug]
              return (
                <li key={slug}>
                  <Link
                    href={`/prepagas/${slug}`}
                    className="flex items-center gap-3 sm:gap-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-sm p-3.5 sm:p-4 transition-all group"
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0 ${i < 3 ? 'bg-[#E8002D] text-white' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</span>
                    <PrepagaLogo slug={p.slug} nombre={p.nombre} colorPrimario={p.colorPrimario} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-bold text-gray-900 group-hover:text-[#E8002D] transition-colors">{p.nombre}</span>
                        {destacado && <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-100 rounded-full px-2 py-0.5">★ {destacado}</span>}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 sm:line-clamp-1">{p.pros[0]}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[10px] text-gray-400">desde</div>
                      <div className="text-sm font-bold text-gray-900 tabular-nums">{formatPrecio(precioDesde(p))}</div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      {/* Datos: satisfacción y precio, en tablas compactas */}
      <section className="py-10 bg-white">
        <div className="container max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Ranking por satisfacción</h2>
            <p className="text-xs text-gray-500 mb-4">
              Satisfacción declarada en encuestas a afiliados.{' '}
              <Link href="/metodologia" className="text-[#E8002D] font-semibold hover:underline">Cómo lo calculamos</Link>
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="px-3 py-2.5 font-semibold w-8">#</th>
                    <th className="px-3 py-2.5 font-semibold">Prepaga</th>
                    <th className="px-3 py-2.5 font-semibold text-right">Satisfacción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {porSatisfaccion.map((p, i) => (
                    <tr key={p.slug} className="hover:bg-gray-50">
                      <td className="px-3 py-2.5 text-gray-400 tabular-nums">{i + 1}</td>
                      <td className="px-3 py-2.5"><Link href={`/prepagas/${p.slug}`} className="font-semibold text-gray-900 hover:text-[#E8002D]">{p.nombre}</Link></td>
                      <td className="px-3 py-2.5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <span className="hidden sm:block w-20 h-1.5 rounded-full bg-gray-100 overflow-hidden"><span className="block h-full bg-[#00875A]" style={{ width: `${p.satisfaccion}%` }} /></span>
                          <span className="font-bold text-[#00875A] tabular-nums">{p.satisfaccion}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Ranking por precio</h2>
            <p className="text-xs text-gray-500 mb-4">
              Plan más económico de cada una, persona de 30 años.{' '}
              <Link href="/prepagas-economicas" className="text-[#E8002D] font-semibold hover:underline">Ver prepagas económicas</Link>
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="px-3 py-2.5 font-semibold w-8">#</th>
                    <th className="px-3 py-2.5 font-semibold">Prepaga y plan</th>
                    <th className="px-3 py-2.5 font-semibold text-right">Desde</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {porPrecio.map((p, i) => {
                    const plan = [...p.planes].sort((a, b) => a.precio - b.precio)[0]
                    return (
                      <tr key={p.slug} className="hover:bg-gray-50">
                        <td className="px-3 py-2.5 text-gray-400 tabular-nums">{i + 1}</td>
                        <td className="px-3 py-2.5">
                          <Link href={`/prepagas/${p.slug}/${plan.slug}`} className="font-semibold text-gray-900 hover:text-[#E8002D]">{p.nombre}</Link>
                          <div className="text-xs text-gray-500">{plan.nombre}</div>
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <div className="font-bold text-gray-900 tabular-nums">{formatPrecio(plan.precio)}</div>
                          <NivelPrecioBadge nivel={nivelPrecio(plan.precio)} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Por provincia */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">¿Vivís fuera de CABA? Mirá el ranking de tu provincia</h2>
          <p className="text-sm text-gray-500 mb-5">La cartilla cambia mucho según dónde vivas: por eso armamos un ranking por provincia.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {provinciasSEO.map((prov) => (
              <Link key={prov.slug} href={`/prepagas/${prov.slug}/mejores-prepagas`}
                className="text-sm font-medium text-gray-600 hover:text-[#E8002D] bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-lg px-3 py-2 transition-colors">
                {prov.nombre} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
          <div className="space-y-2">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer select-none list-none">
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

      {/* CTA */}
      <section className="pb-12 bg-white">
        <div className="container max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-3">¿Cuál te conviene a vos?</h2>
            <p className="text-red-100 mb-6 max-w-xl mx-auto">
              El ranking es general: tu precio depende de tu edad, tu zona y tu grupo familiar. Te cotizamos gratis y te respondemos en {TIEMPO_RESPUESTA}.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button href="/comparador" variant="secondary" size="lg">
                Cotizar gratis →
              </Button>
              <Button href="/comparativas" variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Ver comparativas
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">{SITE_NAME} · Ranking actualizado en {MES}.</p>
        </div>
      </section>
    </>
  )
}
