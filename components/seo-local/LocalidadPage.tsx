import Link from 'next/link'
import type { Metadata } from 'next'
import { prepagas, PRECIO_ACTUALIZADO, nivelPrecio } from '@/lib/data/prepagas'
import type { LocalidadZona, ProvinciaSEO } from '@/lib/data/zonas'
import { SITE_URL } from '@/lib/utils'
import { NivelPrecioBadge } from '@/components/ui/NivelPrecioBadge'
import { BreadcrumbBar, CtaCotizador, FaqSection, jsonLdBreadcrumb, jsonLdFaq } from './shared'

// Algunas localidades tienen nombres largos con aclaración entre paréntesis
// (ej: "Zona Norte (San Isidro, Vicente López, Pilar)"). Para title/H1 usamos
// solo la parte corta; el detalle completo queda en el body y en la descripción.
function nombreCorto(nombre: string): string {
  return nombre.split(' (')[0]
}

export function localidadMetadata(prov: ProvinciaSEO, loc: LocalidadZona): Metadata {
  const year = new Date().getFullYear()
  const corto = nombreCorto(loc.nombre)
  return {
    title: `Prepagas en ${corto}, ${prov.nombre}: cobertura ${year}`,
    description: `Las prepagas con cartilla en ${loc.nombre}, ${prov.nombre}: qué prestadores locales cubren, planes actualizados ${PRECIO_ACTUALIZADO.toLowerCase()} y cotización online gratis.`,
    alternates: { canonical: `${SITE_URL}/prepagas/${prov.slug}/${loc.slug}` },
    keywords: [`prepagas en ${corto.toLowerCase()}`, `prepagas ${corto.toLowerCase()} ${prov.nombre.toLowerCase()}`, `medicina prepaga ${corto.toLowerCase()}`],
  }
}

export function LocalidadPage({ prov, loc }: { prov: ProvinciaSEO; loc: LocalidadZona }) {
  const corto = nombreCorto(loc.nombre)
  const destacadas = prov.prepagas.slice(0, 4)
  const hermanas = prov.localidades.filter((l) => l.slug !== loc.slug)
  const crumbs = [
    { nombre: 'Prepagas', href: '/prepagas' },
    { nombre: prov.nombre, href: `/prepagas/${prov.slug}` },
    { nombre: corto },
  ]

  const faq = [
    {
      q: `¿Qué prepagas tienen cobertura en ${corto}?`,
      a: `${destacadas.map((d) => d.nombre).join(', ')} son las prepagas con mejor presencia en ${loc.nombre}, ${prov.nombre}. Podés ver la cartilla de cada una y cotizar el precio para tu grupo familiar sin cargo.`,
    },
    {
      q: `¿Los precios de las prepagas cambian en ${corto} respecto al resto de ${prov.nombre}?`,
      a: `No: las prepagas aplican los mismos planes y precios de lista en toda la provincia. Lo que cambia según la zona es la cartilla de sanatorios y centros médicos disponibles cerca tuyo — por eso conviene confirmar qué prestadores cubre cada plan en ${corto} antes de contratar.`,
    },
    ...(loc.prestadores.length > 0
      ? [{
          q: `¿Qué prestadores médicos hay en ${corto}?`,
          a: `${loc.prestadores.join(', ')} son los prestadores de referencia verificados en la zona. Qué prestadores incluye cada prepaga depende del plan contratado: confirmalo al cotizar.`,
        }]
      : []),
    {
      q: `¿Cuál es la mejor prepaga en ${corto}?`,
      a: `Depende de tu presupuesto, tu edad y qué prestadores usás habitualmente. Armamos un ranking de ${prov.nombre} con cartilla real de la zona para ayudarte a decidir, y podés cotizar gratis para ver precios reales según tu grupo familiar.`,
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLdBreadcrumb(crumbs), jsonLdFaq(faq)]) }} />
      <BreadcrumbBar crumbs={crumbs} />

      <div className="container py-10 max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">Prepagas en {corto}, {prov.nombre}</h1>
          <p className="text-gray-600 leading-relaxed">{loc.descripcion}</p>
          <p className="text-xs text-gray-400 mt-3">Cobertura verificada al {new Date(prov.fechaVerificacion + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </header>

        {loc.prestadores.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Prestadores de referencia en {corto}, {prov.nombre}</h2>
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
                      <NivelPrecioBadge nivel={nivelPrecio(precioMin)} />
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
            titulo={`Cotizá tu prepaga en ${corto}`} />
        </div>

        {hermanas.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Otras ciudades de {prov.nombre}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {hermanas.map((h) => (
                <Link key={h.slug} href={`/prepagas/${prov.slug}/${h.slug}`}
                  className="p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all group">
                  <div className="font-semibold text-sm text-gray-900 group-hover:text-[#E8002D] transition-colors">Prepagas en {nombreCorto(h.nombre)}</div>
                  <div className="text-xs text-gray-400 mt-1">Ver cobertura →</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <FaqSection faq={faq} />

        <div className="mt-10 text-center">
          <Link href={`/prepagas/${prov.slug}`} className="text-sm text-gray-400 hover:text-[#E8002D] transition-colors">
            ← Prepagas en {prov.nombre}
          </Link>
        </div>
      </div>
    </>
  )
}
