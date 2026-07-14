import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ciudades } from '@/lib/data/ciudades'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { formatPrecio, SITE_NAME, SITE_URL } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'

interface Props {
  params: Promise<{ ciudad: string }>
}

export async function generateStaticParams() {
  return ciudades.map((c) => ({ ciudad: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ciudad } = await params
  const city = ciudades.find((c) => c.slug === ciudad)
  if (!city) return {}
  return {
    title: `Prepagas en ${city.nombre}: Precios y Planes — ${PRECIO_ACTUALIZADO}`,
    description: `Las ${city.prepagasDisponibles.length} prepagas con cobertura en ${city.nombre}, ${city.provincia}. Precios reales de ${PRECIO_ACTUALIZADO}, planes y comparativa para elegir la mejor de tu zona.`,
    alternates: { canonical: `${SITE_URL}/prepagas-en/${ciudad}` },
    keywords: [
      `prepagas en ${city.nombre.toLowerCase()}`,
      `mejor prepaga ${city.nombre.toLowerCase()}`,
      `medicina prepaga ${city.provincia.toLowerCase()}`,
      `precios prepagas ${city.nombre.toLowerCase()}`,
    ],
  }
}

export default async function CiudadPage({ params }: Props) {
  const { ciudad } = await params
  const city = ciudades.find((c) => c.slug === ciudad)
  if (!city) notFound()

  const disponibles = city.prepagasDisponibles
    .map((s) => prepagas.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({ prep: p, precioMin: Math.min(...p.planes.map((pl) => pl.precio)) }))
    .sort((a, b) => a.precioMin - b.precioMin)

  const masBarata = disponibles[0]
  const otrasCiudades = ciudades.filter((c) => c.slug !== ciudad)

  const faqs = [
    {
      q: `¿Cuál es la prepaga más barata en ${city.nombre}?`,
      a: masBarata
        ? `En ${PRECIO_ACTUALIZADO}, la opción más económica con cobertura en ${city.nombre} es ${masBarata.prep.nombre}, desde ${formatPrecio(masBarata.precioMin)}/mes para una persona de 30 años con contratación directa.`
        : `Depende de tu edad y situación laboral. Usá el comparador para ver precios exactos en tu zona.`,
    },
    {
      q: `¿Cuántas prepagas tienen cobertura en ${city.nombre}?`,
      a: `Hay ${disponibles.length} prepagas con red de prestadores en ${city.nombre} y alrededores: ${disponibles.map((d) => d.prep.nombre).join(', ')}.`,
    },
    {
      q: `¿Qué conviene mirar al elegir prepaga en ${city.nombre}?`,
      a: `Además del precio, verificá que la cartilla tenga sanatorios y especialistas cerca tuyo: algunas prepagas tienen precios atractivos pero red limitada fuera de AMBA. Pedí la cartilla de tu zona antes de firmar y confirmá los tiempos de espera para turnos con especialistas.`,
    },
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Prepagas con cobertura en ${city.nombre}`,
      numberOfItems: disponibles.length,
      itemListElement: disponibles.map(({ prep }, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: prep.nombre,
        url: `${SITE_URL}/prepagas/${prep.slug}`,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Prepagas', item: `${SITE_URL}/prepagas` },
        { '@type': 'ListItem', position: 3, name: `Prepagas en ${city.nombre}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-[#E8002D] transition-colors">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <Link href="/prepagas" className="hover:text-[#E8002D] transition-colors">Prepagas</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">{city.nombre}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-4xl mx-auto">
          <span className="inline-block text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-4">
            {city.provincia} · Precios {PRECIO_ACTUALIZADO}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Prepagas en {city.nombre}: <span className="text-[#E8002D]">precios y planes</span>
          </h1>
          <p className="text-gray-600 leading-relaxed max-w-3xl">{city.descripcion}</p>
          {masBarata && (
            <div className="mt-6 inline-flex items-center gap-3 bg-white rounded-2xl border border-gray-200 px-5 py-3 shadow-sm">
              <span className="text-sm text-gray-500">Opción más económica en tu zona:</span>
              <Link href={`/prepagas/${masBarata.prep.slug}`} className="font-bold text-[#E8002D] hover:underline text-sm">
                {masBarata.prep.nombre} desde {formatPrecio(masBarata.precioMin)}/mes →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Listado de prepagas */}
      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-end justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              Las {disponibles.length} prepagas con cobertura en {city.nombre}
            </h2>
            <span className="text-xs text-gray-400 hidden sm:block">Ordenadas por precio · 30 años · IVA inc.</span>
          </div>
          <div className="space-y-3">
            {disponibles.map(({ prep, precioMin }, i) => (
              <Link
                key={prep.slug}
                href={`/prepagas/${prep.slug}`}
                className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all group"
              >
                <span className="w-7 h-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-xs font-bold text-[#E8002D] flex-shrink-0">
                  {i + 1}
                </span>
                <PrepagaLogo slug={prep.slug} nombre={prep.nombre} colorPrimario={prep.colorPrimario} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 group-hover:text-[#E8002D] transition-colors">{prep.nombre}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {prep.planes.length} planes · {prep.satisfaccion}% satisfacción
                    {prep.caracteristicas.coberturaNacional ? ' · Cobertura nacional' : ''}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm text-gray-400">desde</div>
                  <div className="text-lg font-black text-[#E8002D] tabular-nums">{formatPrecio(precioMin)}</div>
                  <div className="text-xs text-gray-400">/mes</div>
                </div>
              </Link>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            * Precio base del plan más económico de cada prepaga · persona de 30 años · contratación directa · IVA incluido · {PRECIO_ACTUALIZADO}.
          </p>
        </div>
      </section>

      {/* Mid CTA */}
      <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] py-5">
        <div className="container max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 px-4">
          <div>
            <div className="text-white font-bold text-sm">¿Cuál te conviene en {city.nombre}?</div>
            <div className="text-red-200 text-xs">Cotizá con tu edad real y compará las opciones de tu zona. Gratis, en 2 minutos.</div>
          </div>
          <Link
            href="/comparador"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#E8002D] font-bold rounded-xl text-sm hover:bg-red-50 transition-colors shadow-sm"
          >
            Cotizar mi precio →
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <section className="py-10 bg-gray-50">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
          <div className="space-y-2">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-sm text-gray-900 select-none list-none">
                  {q}
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

      {/* Otras ciudades */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Prepagas en otras ciudades</h2>
          <div className="flex flex-wrap gap-2">
            {otrasCiudades.map((c) => (
              <Link
                key={c.slug}
                href={`/prepagas-en/${c.slug}`}
                className="text-xs px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-full hover:border-red-200 hover:text-[#E8002D] transition-colors font-medium"
              >
                {c.nombre} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-12 bg-[#E8002D] text-white">
        <div className="container max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Encontrá tu prepaga ideal en {city.nombre}</h2>
          <p className="text-red-200 text-sm mb-6">
            Compará precios reales de {PRECIO_ACTUALIZADO} para tu zona. Gratis, sin registro y sin DNI.
          </p>
          <Link
            href="/comparador"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E8002D] font-bold rounded-2xl hover:bg-red-50 transition-all shadow-lg text-sm"
          >
            Comparar prepagas gratis →
          </Link>
        </div>
      </section>
    </>
  )
}
