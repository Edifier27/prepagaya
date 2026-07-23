import type { Metadata } from 'next'
import Link from 'next/link'
import { cambiosRecomendados } from '@/lib/data/cambios'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { formatPrecio, SITE_NAME, SITE_URL } from '@/lib/utils'

export const metadata: Metadata = {
  title: `¿A qué prepaga conviene cambiarse en 2026? Guía por empresa`,
  description: `Si estás en OSDE, Sancor Salud, Medifé, Avalian, Prevención Salud u Omint, te mostramos con precios reales a qué prepaga te conviene cambiarte y cuánto ahorrás. Actualizado ${PRECIO_ACTUALIZADO}.`,
  alternates: { canonical: `${SITE_URL}/cambios` },
  keywords: ['cambiar de prepaga', 'cambiar de osde a swiss medical', 'cambiar de sancor a swiss medical', 'que prepaga conviene', 'mejor prepaga para cambiarse 2026'],
}

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'A qué prepaga cambiarse según tu prepaga actual',
  numberOfItems: cambiosRecomendados.length,
  itemListElement: cambiosRecomendados.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: `De ${c.origenNombre} a ${c.destinoNombre}`,
    url: `${SITE_URL}/cambios/${c.slug}`,
  })),
}

export default function CambiosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-10 border-b border-gray-100">
        <div className="container max-w-3xl">
          <nav className="text-sm text-gray-400 mb-4 flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#E8002D]">{SITE_NAME}</Link>
            <span>›</span>
            <span className="text-gray-900">A qué prepaga cambiarse</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            ¿Estás pagando de más o cubierto de menos? Mirá si te conviene cambiarte
          </h1>
          <p className="text-gray-500 text-base max-w-xl">
            Analizamos precio real, cartilla y calidad para decirte, según tu prepaga actual, si existe una opción mejor —
            y cuándo NO conviene moverte. Con números, no con opiniones.
          </p>
        </div>
      </section>

      {/* Grilla de cambios */}
      <section className="py-10 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cambiosRecomendados.map((c) => {
              const origen = prepagas.find((p) => p.slug === c.origenSlug)
              const destino = prepagas.find((p) => p.slug === c.destinoSlug)
              if (!origen || !destino) return null
              const ahorra = c.deltaMensual > 0
              return (
                <Link
                  key={c.slug}
                  href={`/cambios/${c.slug}`}
                  className="bg-white rounded-2xl border-2 border-gray-100 p-5 hover:shadow-md hover:border-red-200 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                      style={{ backgroundColor: origen.colorPrimario + '22', color: origen.colorPrimario }}>
                      {origen.nombre[0]}
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="w-4 h-4 text-gray-300 flex-shrink-0">
                      <path d="M5 12h14m-6-6l6 6-6 6"/>
                    </svg>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                      style={{ backgroundColor: destino.colorPrimario + '22', color: destino.colorPrimario }}>
                      {destino.nombre[0]}
                    </div>
                  </div>
                  <h2 className="font-bold text-gray-900 text-sm group-hover:text-[#E8002D] transition-colors leading-tight mb-1">
                    De {origen.nombre} a {destino.nombre}
                  </h2>
                  <p className="text-xs text-gray-500 mb-3">{c.gancho}</p>
                  <div className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                    ahorra ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {ahorra ? `Ahorrás ${formatPrecio(Math.abs(c.deltaMensual))}/mes` : `Solo ${formatPrecio(Math.abs(c.deltaMensual))}/mes más`}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#E8002D] text-white">
        <div className="container max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">¿No encontrás tu prepaga actual?</h2>
          <p className="text-red-200 text-sm mb-6">
            Cotizá gratis y te mostramos todas las opciones con precio real para tu edad y zona.
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
