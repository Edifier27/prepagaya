import Link from 'next/link'
import type { Metadata } from 'next'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import type { LocalidadZona, ProvinciaSEO } from '@/lib/data/zonas'
import { formatPrecio, SITE_URL } from '@/lib/utils'
import { BreadcrumbBar, CtaCotizador, jsonLdBreadcrumb } from './shared'

export function localidadMetadata(prov: ProvinciaSEO, loc: LocalidadZona): Metadata {
  const year = new Date().getFullYear()
  return {
    title: `Prepagas en ${loc.nombre}: precios y cobertura ${year}`,
    description: `Las prepagas con cartilla en ${loc.nombre}, ${prov.nombre}: precios ${PRECIO_ACTUALIZADO.toLowerCase()}, qué prestadores locales cubren y cotización online gratis.`,
    alternates: { canonical: `${SITE_URL}/prepagas/${prov.slug}/${loc.slug}` },
    keywords: [`prepagas en ${loc.nombre.toLowerCase()}`, `prepagas ${loc.nombre.toLowerCase()}`, `medicina prepaga ${loc.nombre.toLowerCase()}`],
  }
}

export function LocalidadPage({ prov, loc }: { prov: ProvinciaSEO; loc: LocalidadZona }) {
  const destacadas = prov.prepagas.slice(0, 4)
  const hermanas = prov.localidades.filter((l) => l.slug !== loc.slug)
  const crumbs = [
    { nombre: 'Prepagas', href: '/prepagas' },
    { nombre: prov.nombre, href: `/prepagas/${prov.slug}` },
    { nombre: loc.nombre },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb(crumbs)) }} />
      <BreadcrumbBar crumbs={crumbs} />

      <div className="container py-10 max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">Prepagas en {loc.nombre}</h1>
          <p className="text-gray-600 leading-relaxed">{loc.descripcion}</p>
          <p className="text-xs text-gray-400 mt-3">Cobertura verificada al {new Date(prov.fechaVerificacion + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </header>

        {loc.prestadores.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Prestadores de referencia en {loc.nombre}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {loc.prestadores.map((p) => (
                <div key={p} className="flex items-center gap-2.5 p-4 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-700">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-[#E8002D] flex-shrink-0">
                    <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {p}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">Qué prestadores incluye cada prepaga depende del plan: verificalo al cotizar.</p>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Prepagas destacadas en {prov.nombre}</h2>
          <div className="space-y-3">
            {destacadas.map((pz) => {
              const prepData = pz.enSitio ? prepagas.find((p) => p.slug === pz.slug) : undefined
              const precioMin = prepData ? Math.min(...prepData.planes.map((pl) => pl.precio)) : null
              const inner = (
                <>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors">{pz.nombre}</div>
                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{pz.cartillaLocal[0]}</div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    {precioMin ? (
                      <>
                        <div className="text-sm font-bold text-[#E8002D] tabular-nums">desde {formatPrecio(precioMin)}</div>
                        <div className="text-xs text-gray-400">/mes</div>
                      </>
                    ) : (
                      <div className="text-xs text-gray-400">Sujeto a cotización</div>
                    )}
                  </div>
                </>
              )
              return pz.enSitio ? (
                <Link key={pz.slug} href={`/prepagas/${prov.slug}/${pz.slug}`}
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all group">
                  {inner}
                </Link>
              ) : (
                <div key={pz.slug} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 group">
                  {inner}
                </div>
              )
            })}
          </div>
          <div className="mt-4">
            <Link href={`/prepagas/${prov.slug}/mejores-prepagas`} className="text-sm font-semibold text-[#E8002D] hover:underline">
              Ver el ranking completo de {prov.nombre} →
            </Link>
          </div>
        </section>

        <div className="mb-10">
          <CtaCotizador zonaKey={prov.zonaKey} provinciaNombre={prov.nombre}
            titulo={`Cotizá tu prepaga en ${loc.nombre}`} />
        </div>

        {hermanas.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Otras ciudades de {prov.nombre}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {hermanas.map((h) => (
                <Link key={h.slug} href={`/prepagas/${prov.slug}/${h.slug}`}
                  className="p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all group">
                  <div className="font-semibold text-sm text-gray-900 group-hover:text-[#E8002D] transition-colors">Prepagas en {h.nombre}</div>
                  <div className="text-xs text-gray-400 mt-1">Ver cobertura →</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 text-center">
          <Link href={`/prepagas/${prov.slug}`} className="text-sm text-gray-400 hover:text-[#E8002D] transition-colors">
            ← Prepagas en {prov.nombre}
          </Link>
        </div>
      </div>
    </>
  )
}
