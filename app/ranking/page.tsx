import type { Metadata } from 'next'
import Link from 'next/link'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { formatPrecio, SITE_NAME, SITE_URL } from '@/lib/utils'
import { StarRating } from '@/components/ui/StarRating'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { BreadcrumbSchema } from '@/components/ui/BreadcrumbSchema'

export const metadata: Metadata = {
  title: `Ranking Mejores Prepagas Argentina ${new Date().getFullYear()} — Actualizado`,
  description: `Las mejores prepagas de Argentina en ${new Date().getFullYear()} según satisfacción de afiliados, precio y cobertura. Ranking actualizado al ${PRECIO_ACTUALIZADO} con ${prepagas.length} prepagas analizadas.`,
  alternates: { canonical: `${SITE_URL}/ranking` },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: `Ranking Mejores Prepagas Argentina ${new Date().getFullYear()}`,
  description: 'Ranking de las mejores prepagas de Argentina por satisfacción de afiliados',
  numberOfItems: prepagas.length,
  itemListElement: [...prepagas]
    .sort((a, b) => b.satisfaccion - a.satisfaccion)
    .map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.nombre,
      url: `${SITE_URL}/prepagas/${p.slug}`,
    })),
}

export default function RankingPage() {
  const porSatisfaccion = [...prepagas].sort((a, b) => b.satisfaccion - a.satisfaccion)
  const porPrecio = [...prepagas].sort((a, b) => a.planes[0].precio - b.planes[0].precio)
  const porRating = [...prepagas].sort((a, b) => b.rating - a.rating)

  const positionStyles: Record<number, string> = {
    0: 'bg-amber-100 text-amber-700 border-amber-200',
    1: 'bg-gray-100 text-gray-600 border-gray-200',
    2: 'bg-orange-100 text-orange-700 border-orange-200',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 border-b border-gray-200">
        <div className="container">
          <div className="mb-4">
            <BreadcrumbSchema crumbs={[{ label: 'Ranking de prepagas' }]} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Ranking Mejores Prepagas Argentina {new Date().getFullYear()}
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Ranking actualizado al {PRECIO_ACTUALIZADO}, basado en satisfacción de afiliados, precio-calidad y opiniones reales. {prepagas.length} prepagas analizadas.
          </p>
        </div>
      </section>

      <div className="container py-12">
        {/* Ranking principal — por satisfacción */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Mejores prepagas por satisfacción de afiliados
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Basado en encuestas a afiliados activos — {PRECIO_ACTUALIZADO}
          </p>

          <div className="space-y-4">
            {porSatisfaccion.map((p, i) => (
              <Link
                key={p.slug}
                href={`/prepagas/${p.slug}`}
                className="flex items-center gap-5 bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-red-200 transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border flex-shrink-0 ${positionStyles[i] ?? 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                  {i + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 group-hover:text-[#E8002D] transition-colors">{p.nombre}</h3>
                    {i === 0 && <Badge variant="green">Mejor valorada</Badge>}
                    {p.planes[0].precio < 130000 && <Badge variant="gray">Más económica</Badge>}
                  </div>
                  <div className="flex items-center gap-3">
                    <StarRating rating={p.rating} size="sm" />
                    <span className="text-xs text-gray-400">{p.cantidadOpiniones.toLocaleString('es-AR')} opiniones</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 truncate hidden md:block">
                    {p.pros[0]}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-[#00875A]">{p.satisfaccion}%</div>
                  <div className="text-xs text-gray-400">satisfacción</div>
                  <div className="text-sm font-medium text-[#E8002D] mt-1">
                    desde {formatPrecio(p.planes[0].precio)}/mes
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Ranking por precio */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Prepagas más económicas
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Ordenadas por precio del plan más económico — persona de 30 años
          </p>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">#</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Prepaga</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Plan más económico</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-700">Precio/mes</th>
                  <th className="text-center p-4 text-sm font-semibold text-gray-700">Satisfacción</th>
                </tr>
              </thead>
              <tbody>
                {porPrecio.map((p, i) => {
                  const planMasBarato = [...p.planes].sort((a, b) => a.precio - b.precio)[0]
                  return (
                    <tr key={p.slug} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm text-gray-500 font-medium">{i + 1}</td>
                      <td className="p-4">
                        <Link href={`/prepagas/${p.slug}`} className="font-semibold text-gray-900 hover:text-[#E8002D] transition-colors">
                          {p.nombre}
                        </Link>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{planMasBarato.nombre}</td>
                      <td className="p-4 text-right font-bold text-[#E8002D]">{formatPrecio(planMasBarato.precio)}</td>
                      <td className="p-4 text-center">
                        <span className="text-sm font-semibold text-[#00875A]">{p.satisfaccion}%</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">¿Querés comparar en detalle?</h2>
          <p className="text-blue-100 mb-6">
            Analizá planes, precios y coberturas de cada prepaga side by side.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button href="/prepagas" variant="secondary" size="lg">
              Comparar prepagas
            </Button>
            <Button href="/comparativas" variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              Ver comparativas
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
