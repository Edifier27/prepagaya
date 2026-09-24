import Link from 'next/link'
import { linkCartillaZona } from '@/lib/data/cartilla-zonas'
import { CartillaOficialLink } from '@/components/cartillas/CartillaOficialLink'
import { SucursalesBloque } from './SucursalesBloque'
import { sucursalesEnLocalidad } from '@/lib/data/sucursales'
import type { Metadata } from 'next'
import { prepagas, PRECIO_ACTUALIZADO, nivelPrecio } from '@/lib/data/prepagas'
import { provinciasSEO, type PrepagaZona, type ProvinciaSEO, type LocalidadZona } from '@/lib/data/zonas'
import { SITE_URL, formatPrecio } from '@/lib/utils'
import { NivelPrecioBadge } from '@/components/ui/NivelPrecioBadge'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'
import { BreadcrumbBar, CtaCotizador, FaqSection, FUERZA_LABEL, jsonLdArticle, jsonLdBreadcrumb, jsonLdFaq, nombreCorto } from './shared'

// Debajo de este número de prestadores de referencia relevados en la
// localidad puntual, la cartilla local se considera "fina": en vez de
// mostrar una lista pobre y quedarse ahí, la página pivotea a vender la red
// PROVINCIAL de la prepaga (fuerza, profesionales, satisfacción) — pedido de
// Darío, 14-sep-2026: estas son keywords informacionales ("cartilla X en
// [ciudad]") que además de posicionar tienen que empujar a cotizar, incluso
// cuando el dato local es escaso. Todo lo que se muestra sigue viniendo de
// datos ya verificados (pz.cartillaLocal / prep.profesionales) — nada inventado.
const UMBRAL_CARTILLA_FINA = 3

export function localidadPrepagaMetadata(prov: ProvinciaSEO, loc: LocalidadZona, pz: PrepagaZona): Metadata {
  const corto = nombreCorto(loc.nombre)
  const year = new Date().getFullYear()
  // Search Console (24-sep-2026): "[prepaga] [ciudad]" se busca para
  // encontrar la sucursal. Si hay sucursal oficial en la localidad, va en el
  // título y en la descripción.
  const suc = sucursalesEnLocalidad(pz.slug, prov, loc, provinciasSEO)
  return {
    // Intención "planes y precios" en la localidad. La intención "cartilla" la
    // toma el silo /cartillas/[prepaga]/[zona] (datos oficiales por zona);
    // antes este título decía "cartilla" y competía con esas páginas.
    title: suc.length
      ? `${pz.nombre} en ${corto}: ${suc.length === 1 ? 'sucursal' : 'sucursales'}, planes y precios ${year}`
      : `${pz.nombre} en ${corto}, ${prov.nombre}: planes y precios ${year}`,
    description: suc.length
      ? `${suc.length === 1 ? 'Sucursal' : 'Sucursales'} de ${pz.nombre} en ${corto}: ${suc.slice(0, 2).map((x) => x.direccion.split(' - ')[0]).join(' y ')}. Planes y precios (${PRECIO_ACTUALIZADO.toLowerCase()}) y cotización online gratis.`
      : `Planes y precios de ${pz.nombre} en ${loc.nombre}, ${prov.nombre} (${PRECIO_ACTUALIZADO.toLowerCase()}), cobertura en la zona y cotización online gratis, sin DNI.`,
    alternates: { canonical: `${SITE_URL}/prepagas/${prov.slug}/${loc.slug}/${pz.slug}` },
    keywords: [
      `${pz.nombre.toLowerCase()} en ${corto.toLowerCase()}`,
      `${pz.nombre.toLowerCase()} ${corto.toLowerCase()} precios`,
      `planes ${pz.nombre.toLowerCase()} ${corto.toLowerCase()}`,
      `${pz.nombre.toLowerCase()} ${corto.toLowerCase()} ${prov.nombre.toLowerCase()}`,
    ],
  }
}

export function LocalidadPrepagaPage({ prov, loc, pz }: { prov: ProvinciaSEO; loc: LocalidadZona; pz: PrepagaZona }) {
  const corto = nombreCorto(loc.nombre)
  const prepData = prepagas.find((p) => p.slug === pz.slug)
  const planesOrdenados = prepData ? [...prepData.planes].sort((a, b) => a.precio - b.precio) : []
  const precios = planesOrdenados.map((p) => p.precio)
  const precioMin = precios.length ? Math.min(...precios) : null
  const precioMax = precios.length ? Math.max(...precios) : null
  const fuerza = FUERZA_LABEL[pz.fuerza]
  const cartillaFina = loc.prestadores.length < UMBRAL_CARTILLA_FINA
  const cartillaLink = linkCartillaZona(pz.slug, prov.slug, prov.nombre, loc.nombre)

  // Otras prepagas con ficha propia (enSitio) disponibles en la misma localidad
  const hermanas = prov.prepagas.filter((h) => h.slug !== pz.slug && h.enSitio).slice(0, 3)

  const crumbs = [
    { nombre: 'Prepagas', href: '/prepagas' },
    { nombre: prov.nombre, href: `/prepagas/${prov.slug}` },
    { nombre: corto, href: `/prepagas/${prov.slug}/${loc.slug}` },
    { nombre: pz.nombre },
  ]

  const faq = [
    {
      q: `¿${pz.nombre} tiene cobertura en ${corto}?`,
      a: cartillaFina
        ? `Todavía no relevamos muchos prestadores puntuales de ${pz.nombre} en ${corto}, pero la prepaga tiene ${fuerza.label.toLowerCase()} en toda la provincia de ${prov.nombre}${prepData?.profesionales ? ` (más de ${prepData.profesionales.toLocaleString('es-AR')} prestadores, según la prepaga)` : ''}. Cotizá gratis y te confirmamos la cartilla exacta para tu domicilio en ${corto}.`
        : `Sí. Los prestadores de referencia verificados en ${corto} son: ${loc.prestadores.join(', ')}. Qué prestador puntual cubre cada plan depende del plan contratado — confirmalo al cotizar.`,
    },
    ...(precioMin !== null && precioMax !== null
      ? [{
          q: `¿Cuánto cuesta ${pz.nombre} en ${corto}?`,
          a: `Los planes de ${pz.nombre} van de ${formatPrecio(precioMin)} a ${formatPrecio(precioMax)} por mes en precio de lista (${PRECIO_ACTUALIZADO.toLowerCase()}). Los planes y precios son los mismos en toda la provincia; lo que cambia según la zona es la cartilla de sanatorios disponibles cerca tuyo.`,
        }]
      : []),
    ...(hermanas.length > 0
      ? [{
          q: `¿Qué otras prepagas tienen cobertura en ${corto}?`,
          a: `Además de ${pz.nombre}, en ${corto} tenés cobertura de ${hermanas.map((h) => h.nombre).join(', ')}. Te conviene comparar precio y cartilla de las tres antes de decidir.`,
        }]
      : []),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        jsonLdBreadcrumb(crumbs),
        jsonLdFaq(faq),
        jsonLdArticle(`${pz.nombre} en ${corto}, ${prov.nombre}`, `Planes, precios y cobertura de ${pz.nombre} en ${loc.nombre}, ${prov.nombre}.`, `/prepagas/${prov.slug}/${loc.slug}/${pz.slug}`),
      ]) }} />
      <BreadcrumbBar crumbs={crumbs} />

      <div className="container py-10 max-w-4xl mx-auto">
        <header className="mb-8">
          <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full border mb-3 ${fuerza.cls}`}>{fuerza.label}</span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{pz.nombre} en {corto}, {prov.nombre}</h1>
          <p className="text-gray-600 leading-relaxed">{pz.resumen}</p>
          <p className="text-xs text-gray-400 mt-3">
            Cobertura verificada al {new Date(prov.fechaVerificacion + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
            {pz.verificado ? '' : ' · Detalle de cartilla local sujeto a confirmación al cotizar'}
          </p>
        </header>

        <SucursalesBloque prepagaSlug={pz.slug} prepagaNombre={pz.nombre} lugar={corto} sucursales={sucursalesEnLocalidad(pz.slug, prov, loc, provinciasSEO)} />

        {/* Link al silo de cartillas (datos oficiales por zona), si la prepaga lo tiene */}
        {cartillaLink && (
          <div className="mb-8">
            <CartillaOficialLink
              href={cartillaLink.href}
              titulo={cartillaLink.zonaNombre ? `Cartilla oficial de ${pz.nombre} en ${cartillaLink.zonaNombre}` : `Cartilla oficial de ${pz.nombre} por zona`}
              texto="Sanatorios para internación y guardias, con dirección, teléfono y qué plan incluye cada uno."
            />
          </div>
        )}

        {/* Prestadores puntuales de la localidad, si hay */}
        {loc.prestadores.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Prestadores de referencia en {corto}</h2>
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
            <p className="text-xs text-gray-500 mt-3">Prestadores de referencia relevados en la zona — qué prepaga y plan puntual los cubre se confirma al cotizar.</p>
          </section>
        )}

        {/* Cartilla provincial de la prepaga (siempre se muestra, verificada) */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Red de {pz.nombre} en la provincia de {prov.nombre}</h2>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <ul className="space-y-2.5">
              {pz.cartillaLocal.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-gray-700">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#00875A] flex-shrink-0 mt-0.5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Cartilla local fina: pivot a vender la red provincial en vez de dejar la página pobre */}
        {cartillaFina && prepData && (
          <section className="mb-10">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <div>
                  <div className="text-sm font-bold text-amber-800 mb-1">Todavía no relevamos muchos prestadores puntuales en {corto}</div>
                  <p className="text-sm text-amber-900 leading-relaxed">
                    Eso no significa que {pz.nombre} tenga poca cobertura ahí: la prepaga tiene {fuerza.label.toLowerCase()} en toda la provincia de {prov.nombre}
                    {prepData.profesionales ? <>, con <strong>más de {prepData.profesionales.toLocaleString('es-AR')} prestadores</strong> según la prepaga</> : ''}
                    {prepData.sanatoriosPropios > 0 ? ` y ${prepData.sanatoriosPropios} sanatorio${prepData.sanatoriosPropios === 1 ? '' : 's'} propio${prepData.sanatoriosPropios === 1 ? '' : 's'}` : ''}
                    {' '}y {prepData.satisfaccion}% de satisfacción entre afiliados. Cotizá gratis y te confirmamos la cartilla exacta para tu domicilio en {corto} antes de que decidas.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Planes y precios */}
        {prepData && planesOrdenados.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Planes de {pz.nombre} — {PRECIO_ACTUALIZADO}</h2>
            <p className="text-sm text-gray-500 mb-5">Mismos planes y precios de lista en toda la provincia. Tu edad y grupo familiar definen el valor final.</p>
            <div className="space-y-3">
              {planesOrdenados.map((plan) => (
                <div key={plan.slug}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all">
                  <Link href={`/prepagas/${pz.slug}/${plan.slug}?provincia=${prov.slug}`} className="min-w-0 flex-1 group">
                    <div className="font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors">{plan.nombre}</div>
                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{plan.descripcion}</div>
                  </Link>
                  <div className="flex items-center gap-2 flex-shrink-0 flex-wrap sm:flex-nowrap">
                    <span className="text-sm font-bold text-gray-900">{formatPrecio(plan.precio)}</span>
                    <NivelPrecioBadge nivel={nivelPrecio(plan.precio)} />
                    <ContratarPlanButton
                      prepagaNombre={pz.nombre}
                      planNombre={plan.nombre}
                      fuente="ficha-localidad-prepaga"
                      label="Cotizar plan"
                      className="text-xs font-bold px-4 py-2 rounded-lg bg-[#E8002D] hover:bg-[#B8001F] text-white transition-colors whitespace-nowrap flex-shrink-0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mb-10">
          <CtaCotizador zonaKey={prov.zonaKey} provinciaNombre={prov.nombre}
            titulo={`¿${pz.nombre} es tu mejor opción en ${corto}?`}
            subtitulo={`Comparalo con las otras prepagas de ${corto} y ${prov.nombre}, con precios reales por edad. Gratis y sin DNI.`} />
        </div>

        {/* Otras prepagas en la misma localidad */}
        {hermanas.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Otras prepagas en {corto}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {hermanas.map((h) => (
                <Link key={h.slug} href={`/prepagas/${prov.slug}/${loc.slug}/${h.slug}`}
                  className="p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all group">
                  <div className="font-semibold text-sm text-gray-900 group-hover:text-[#E8002D] transition-colors">{h.nombre} en {corto}</div>
                  <div className="text-xs text-gray-400 mt-1">Ver planes y precios →</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <FaqSection faq={faq} />

        <div className="mt-10 text-center flex items-center justify-center gap-4 flex-wrap">
          <Link href={`/prepagas/${prov.slug}/${loc.slug}`} className="text-sm text-gray-400 hover:text-[#E8002D] transition-colors">
            ← Prepagas en {corto}
          </Link>
          <span className="text-gray-200">·</span>
          <Link href={`/prepagas/${prov.slug}/${pz.slug}`} className="text-sm text-gray-400 hover:text-[#E8002D] transition-colors">
            {pz.nombre} en toda {prov.nombre} →
          </Link>
        </div>
      </div>
    </>
  )
}
