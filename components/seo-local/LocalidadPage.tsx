import Link from 'next/link'
import type { Metadata } from 'next'
import { prepagas, PRECIO_ACTUALIZADO, nivelPrecio } from '@/lib/data/prepagas'
import { prepagaEnLocalidad, type LocalidadZona, type PrepagaZona, type ProvinciaSEO } from '@/lib/data/zonas'
import { SITE_URL, formatPrecio } from '@/lib/utils'
import { preciosDeZona, zonaDeLocalidad } from '@/lib/precios/zona'
import { anioPrecios, elegir, MAX_DESCRIPCION } from '@/lib/seo/titulos'
import { NivelPrecioBadge } from '@/components/ui/NivelPrecioBadge'
import { agruparPorZona, BreadcrumbBar, CtaCotizador, FaqSection, jsonLdArticle, jsonLdBreadcrumb, jsonLdFaq, nombreCorto } from './shared'
import { ldJson } from '@/lib/jsonld'

// Precio de lista de la prepaga en la localidad (30 años, el plan oficial más
// barato). `regional` = la prepaga declara precio para esa región en el cuadro
// de la SSSalud; si no, el número es el de CABA y no se muestra como precio
// de la zona.
function precioEnLocalidad(prov: ProvinciaSEO, loc: LocalidadZona, pz: PrepagaZona) {
  const prep = pz.enSitio ? prepagas.find((p) => p.slug === pz.slug) : undefined
  if (!prep) return null
  const zona = zonaDeLocalidad(prov, loc)
  const r = preciosDeZona(prep, zona)
  return r.desde ? { desde: r.desde, regional: Boolean(zona) && r.regional } : null
}

/** El precio "desde" más bajo entre las prepagas con precio oficial de la
 *  región que cubren la localidad (null si ninguna lo declara, ej. La Plata). */
function desdeEnLocalidad(prov: ProvinciaSEO, loc: LocalidadZona): number | null {
  const precios = prov.prepagas
    .filter((pz) => prepagaEnLocalidad(pz, loc.slug))
    .flatMap((pz) => { const p = precioEnLocalidad(prov, loc, pz); return p?.regional ? [p.desde] : [] })
  return precios.length ? Math.min(...precios) : null
}

// Las prepagas que cubren la localidad (las de soloLocalidades, ej. Premedic
// u Hospital Italiano, solo donde tienen cartilla).
const enLaLocalidad = (prov: ProvinciaSEO, loc: LocalidadZona) =>
  prov.prepagas.filter((pz) => !pz.soloLocalidades || pz.soloLocalidades.includes(loc.slug))

export function localidadMetadata(prov: ProvinciaSEO, loc: LocalidadZona): Metadata {
  const anio = anioPrecios()
  const corto = nombreCorto(loc.nombre)
  // 20-oct-2026: "prepagas en [ciudad]" es búsqueda de compra (Google Ads:
  // Rosario 480/mes, Tucumán 210) y el título decía "cobertura", sin precio
  // ni planes. Mismo criterio que las fichas: "planes y precios" + el "desde"
  // oficial. Sin la provincia: los nombres de las localidades no se repiten.
  const desde = desdeEnLocalidad(prov, loc)
  const precio = desde ? formatPrecio(desde) : null
  const n = enLaLocalidad(prov, loc).length
  return {
    title: elegir([
      ...(precio ? [
        `Prepagas en ${corto}: planes y precios ${anio}, desde ${precio}`,
        `Prepagas en ${corto}: planes y precios desde ${precio}`,
      ] : []),
      `Prepagas en ${corto} ${anio}: planes y precios`,
      `Prepagas en ${corto}: planes y precios`,
    ]),
    description: elegir([
      `Prepagas en ${corto}, ${prov.nombre}: las ${n} con cobertura en la zona${precio ? `, desde ${precio}/mes` : ''}. Sus planes, los prestadores que cubren y cotización online gratis.`,
      `Prepagas en ${corto}: las ${n} con cobertura en la zona${precio ? `, desde ${precio}/mes` : ''}. Planes, prestadores y cotización online gratis.`,
    ], MAX_DESCRIPCION),
    alternates: { canonical: `${SITE_URL}/prepagas/${prov.slug}/${loc.slug}` },
    keywords: [`prepagas en ${corto.toLowerCase()}`, `prepagas ${corto.toLowerCase()} precios`, `prepagas ${corto.toLowerCase()} ${prov.nombre.toLowerCase()}`, `medicina prepaga ${corto.toLowerCase()}`],
  }
}

export function LocalidadPage({ prov, loc }: { prov: ProvinciaSEO; loc: LocalidadZona }) {
  const corto = nombreCorto(loc.nombre)
  const destacadas = enLaLocalidad(prov, loc).slice(0, 4)
  const desde = desdeEnLocalidad(prov, loc)
  const grupoActual = agruparPorZona(prov.localidades).find((g) => g.items.some((l) => l.slug === loc.slug))
  const hermanas = (grupoActual?.items ?? prov.localidades).filter((l) => l.slug !== loc.slug)
  const tituloHermanas = grupoActual?.titulo ? `Otras localidades de ${grupoActual.titulo}` : `Otras ciudades de ${prov.nombre}`
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson([
        jsonLdBreadcrumb(crumbs),
        jsonLdFaq(faq),
        jsonLdArticle(`Prepagas en ${corto}: planes y precios`, `Las prepagas con cartilla en ${loc.nombre}, ${prov.nombre}${desde ? `, desde ${formatPrecio(desde)} por mes` : ''}.`, `/prepagas/${prov.slug}/${loc.slug}`),
      ]) }} />
      <BreadcrumbBar crumbs={crumbs} />

      <div className="container py-10 max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">Prepagas en {corto}: planes y precios de {PRECIO_ACTUALIZADO.toLowerCase()}</h1>
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
              const precio = precioEnLocalidad(prov, loc, pz)
              const inner = (
                <>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors">{pz.nombre}</div>
                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{pz.cartillaLocal[0]}</div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    {precio ? (
                      <>
                        {precio.regional && <div className="text-sm font-bold text-gray-900 mb-1 tabular-nums">desde {formatPrecio(precio.desde)}</div>}
                        <NivelPrecioBadge nivel={nivelPrecio(precio.desde)} />
                      </>
                    ) : (
                      <div className="text-xs text-gray-400">Sujeto a cotización</div>
                    )}
                  </div>
                </>
              )
              return prepagaEnLocalidad(pz, loc.slug) ? (
                <Link key={pz.slug} href={`/prepagas/${prov.slug}/${loc.slug}/${pz.slug}`}
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
          {/* Enlazado interno (auditoría 18-oct-2026): las prepagas fuera de
              las 4 destacadas tenían un solo link de entrada (desde su página
              provincial). Su padre natural es esta página de la localidad. */}
          {(() => {
            const resto = prov.prepagas.filter((pz) => !destacadas.includes(pz) && prepagaEnLocalidad(pz, loc.slug))
            return resto.length > 0 && (
              <div className="mt-5">
                <div className="text-sm font-semibold text-gray-700 mb-2">Más prepagas en {corto}</div>
                <div className="flex flex-wrap gap-2">
                  {resto.map((pz) => (
                    <Link key={pz.slug} href={`/prepagas/${prov.slug}/${loc.slug}/${pz.slug}`}
                      className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-[#E8002D] hover:text-[#E8002D]">
                      {pz.nombre}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })()}
          {desde && (
            <p className="text-xs text-gray-500 mt-3">
              Precio por mes a los 30 años, del plan más económico de cada prepaga: lista oficial de la región en el cuadro tarifario de la Superintendencia de Servicios de Salud ({PRECIO_ACTUALIZADO.toLowerCase()}), contratación directa. Para tu edad y tu grupo, cotizá abajo.
            </p>
          )}
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
            <h2 className="text-lg font-bold text-gray-900 mb-4">{tituloHermanas}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {hermanas.map((h) => (
                <Link key={h.slug} href={`/prepagas/${prov.slug}/${h.slug}`}
                  className="p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all group">
                  <div className="font-semibold text-sm text-gray-900 group-hover:text-[#E8002D] transition-colors">Prepagas en {nombreCorto(h.nombre)}</div>
                  <div className="text-xs text-gray-400 mt-1">Planes y precios →</div>
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
