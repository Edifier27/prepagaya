import type { Metadata } from 'next'
import Link from 'next/link'
import { prepagas, PRECIO_ACTUALIZADO, nivelPrecio } from '@/lib/data/prepagas'
import { provinciasSEO } from '@/lib/data/zonas'
import { SITE_URL, formatPrecio } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { BreadcrumbSchema } from '@/components/ui/BreadcrumbSchema'
import { NivelPrecioBadge } from '@/components/ui/NivelPrecioBadge'

export const metadata: Metadata = {
  title: `Ranking Mejores Prepagas Argentina ${new Date().getFullYear()} — Actualizado`,
  description: `Las mejores prepagas de Argentina en ${new Date().getFullYear()} según satisfacción de afiliados, precio y cobertura. Ranking actualizado al ${PRECIO_ACTUALIZADO} con ${prepagas.length} prepagas analizadas.`,
  alternates: { canonical: `${SITE_URL}/ranking` },
}

// Orden curado por nuestros asesores (no es el ranking por satisfacción):
// prioriza estructura propia, poder de negociación y experiencia de atención
// diaria por sobre el dato aislado de la encuesta de satisfacción.
const SELECCION_ASESORES = ['swiss-medical', 'osde', 'sancor-salud', 'galeno', 'medicus']

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: `Ranking Mejores Prepagas Argentina ${new Date().getFullYear()}`,
  description: 'Selección de nuestros asesores de las mejores prepagas de Argentina',
  numberOfItems: prepagas.length,
  itemListElement: [
    ...SELECCION_ASESORES,
    ...prepagas.map((p) => p.slug).filter((s) => !SELECCION_ASESORES.includes(s)),
  ].map((slug, i) => {
    const p = prepagas.find((x) => x.slug === slug)!
    return { '@type': 'ListItem', position: i + 1, name: p.nombre, url: `${SITE_URL}/prepagas/${p.slug}` }
  }),
}

export default function RankingPage() {
  const porSatisfaccion = [...prepagas].sort((a, b) => b.satisfaccion - a.satisfaccion)
  const porPrecio = [...prepagas].sort((a, b) => a.planes[0].precio - b.planes[0].precio)

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
            Actualizado al {PRECIO_ACTUALIZADO}: nuestra selección como asesores, el ranking por satisfacción de afiliados y el de precio-calidad. {prepagas.length} prepagas analizadas.
          </p>
        </div>
      </section>

      <div className="container py-12">
        {/* Selección de nuestros asesores */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-gray-900">Nuestra selección</h2>
            <span className="text-xs font-bold text-white bg-gray-900 px-2.5 py-1 rounded-full">Opinión de nuestros asesores</span>
          </div>
          <p className="text-gray-500 text-sm mb-6 max-w-2xl">
            A diferencia del ranking por satisfacción de más abajo (que sale de datos de encuestas), este orden es nuestra recomendación como asesores, en base a la experiencia de atención diaria de cada prepaga, no de una encuesta.
          </p>
          <div className="space-y-3">
            {SELECCION_ASESORES.map((slug, i) => {
              const p = prepagas.find((x) => x.slug === slug)
              if (!p) return null
              return (
                <Link
                  key={p.slug}
                  href={`/prepagas/${p.slug}`}
                  className="flex items-center gap-5 bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-red-200 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border flex-shrink-0 ${positionStyles[i] ?? 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 group-hover:text-[#E8002D] transition-colors">{p.nombre}</h3>
                      {i === 0 && <Badge variant="green">Nuestra recomendación #1</Badge>}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 truncate hidden md:block">{p.pros[0]}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-gray-900">{formatPrecio(p.planes[0].precio)}</div>
                    <NivelPrecioBadge nivel={nivelPrecio(p.planes[0].precio)} />
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Ranking principal — por satisfacción */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Mejores prepagas por satisfacción de afiliados
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Basado en encuestas de satisfacción de cada prepaga a sus propios afiliados — {PRECIO_ACTUALIZADO}.{' '}
            <Link href="/metodologia" className="text-[#E8002D] font-semibold hover:underline">
              Ver cómo calculamos esto →
            </Link>
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
                    {nivelPrecio(p.planes[0].precio) === 'economico' && <Badge variant="gray">Más económica</Badge>}
                  </div>
                  {/* Sin rating ni "N opiniones": eran cifras sin fuente (24-sep-2026) */}
                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {p.pros[0]}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-[#00875A]">{p.satisfaccion}%</div>
                  <div className="text-xs text-gray-400 mb-1.5">satisfacción</div>
                  <div className="text-sm font-bold text-gray-900">{formatPrecio(p.planes[0].precio)}</div>
                  <NivelPrecioBadge nivel={nivelPrecio(p.planes[0].precio)} />
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
            Ordenadas por nivel de precio del plan más económico de cada una.{' '}
            <Link href="/prepagas-economicas" className="text-[#E8002D] font-semibold hover:underline">
              Ver el ranking completo de económicas, con detalle de cada una →
            </Link>
          </p>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">#</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Prepaga</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Plan más económico</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-700">Precio de lista</th>
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
                      <td className="p-4 text-right">
                        <div className="font-bold text-gray-900 text-sm">{formatPrecio(planMasBarato.precio)}</div>
                        <NivelPrecioBadge nivel={nivelPrecio(planMasBarato.precio)} />
                      </td>
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

        {/* Ranking por provincia */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-1">¿Vivís fuera de CABA? Mirá el ranking de tu provincia</h2>
          <p className="text-sm text-gray-500 mb-5">Este ranking nacional pondera satisfacción general. La cartilla real cambia mucho según dónde vivas — por eso armamos un ranking específico por provincia.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {provinciasSEO.map((prov) => (
              <Link key={prov.slug} href={`/prepagas/${prov.slug}/mejores-prepagas`}
                className="text-sm font-medium text-gray-600 hover:text-[#E8002D] bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-lg px-3 py-2 transition-colors">
                {prov.nombre} →
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">¿Cuál de este ranking te conviene a vos?</h2>
          <p className="text-red-100 mb-6">
            El ranking es general — tu precio exacto depende de tu edad, tu zona y tu grupo familiar. Cotizalo gratis.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button href="/comparador" variant="secondary" size="lg">
              Cotizar gratis en 2 minutos →
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
