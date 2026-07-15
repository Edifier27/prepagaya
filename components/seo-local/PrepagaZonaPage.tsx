import Link from 'next/link'
import type { Metadata } from 'next'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import type { PrepagaZona, ProvinciaSEO } from '@/lib/data/zonas'
import { formatPrecio, SITE_URL } from '@/lib/utils'
import { BreadcrumbBar, CtaCotizador, FUERZA_LABEL, jsonLdBreadcrumb } from './shared'

export function prepagaZonaMetadata(prov: ProvinciaSEO, pz: PrepagaZona): Metadata {
  const year = new Date().getFullYear()
  return {
    title: `${pz.nombre} en ${prov.nombre}: cartilla, planes y precios ${year}`,
    description: `¿Qué cubre ${pz.nombre} en ${prov.nombre}? Cartilla local, sucursales, planes y precios ${PRECIO_ACTUALIZADO.toLowerCase()}. Compará con las demás prepagas de ${prov.nombre} y cotizá online.`,
    alternates: { canonical: `${SITE_URL}/prepagas/${prov.slug}/${pz.slug}` },
    keywords: [`${pz.nombre.toLowerCase()} ${prov.nombre.toLowerCase()}`, `${pz.nombre.toLowerCase()} en ${prov.nombre.toLowerCase()}`, `${pz.nombre.toLowerCase()} ${prov.capitalNombre.toLowerCase()}`, `cartilla ${pz.nombre.toLowerCase()} ${prov.nombre.toLowerCase()}`],
  }
}

export function PrepagaZonaPage({ prov, pz }: { prov: ProvinciaSEO; pz: PrepagaZona }) {
  const prepData = prepagas.find((p) => p.slug === pz.slug)
  const planesOrdenados = prepData ? [...prepData.planes].sort((a, b) => a.precio - b.precio) : []
  const precioMin = planesOrdenados[0]?.precio
  const hermanas = prov.prepagas.filter((h) => h.slug !== pz.slug && h.enSitio).slice(0, 3)
  const fuerza = FUERZA_LABEL[pz.fuerza]
  const crumbs = [
    { nombre: 'Prepagas', href: '/prepagas' },
    { nombre: prov.nombre, href: `/prepagas/${prov.slug}` },
    { nombre: pz.nombre },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb(crumbs)) }} />
      <BreadcrumbBar crumbs={crumbs} />

      <div className="container py-10 max-w-4xl mx-auto">
        <header className="mb-8">
          <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full border mb-3 ${fuerza.cls}`}>{fuerza.label}</span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{pz.nombre} en {prov.nombre}</h1>
          <p className="text-gray-600 leading-relaxed">{pz.resumen}</p>
          <p className="text-xs text-gray-400 mt-3">
            Cobertura verificada al {new Date(prov.fechaVerificacion + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
            {pz.verificado ? '' : ' · Detalle de cartilla local sujeto a confirmación al cotizar'}
          </p>
        </header>

        {/* Cartilla local */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cobertura de {pz.nombre} en {prov.nombre}</h2>
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
            {prov.prestadoresClave.length > 0 && (
              <p className="text-xs text-gray-500 mt-4 pt-3 border-t border-gray-100">
                Red privada de referencia en {prov.nombre}: {prov.prestadoresClave.join(' · ')}. La inclusión de cada prestador depende del plan — verificala al cotizar.
              </p>
            )}
          </div>
        </section>

        {/* Planes y precios */}
        {prepData && planesOrdenados.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Planes de {pz.nombre}: precios {PRECIO_ACTUALIZADO}</h2>
            <p className="text-sm text-gray-500 mb-5">Precios de lista para una persona de 30 años. En {prov.nombre} aplican los mismos precios de lista; tu edad y grupo familiar definen el valor final.</p>
            <div className="space-y-3">
              {planesOrdenados.map((plan) => (
                <Link key={plan.slug} href={`/prepagas/${pz.slug}/${plan.slug}`}
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all group">
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors">{plan.nombre}</div>
                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{plan.descripcion}</div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="text-sm font-bold text-[#E8002D] tabular-nums">{formatPrecio(plan.precio)}</div>
                    <div className="text-xs text-gray-400">/mes</div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link href={`/prepagas/${pz.slug}`} className="text-sm font-semibold text-[#E8002D] hover:underline">
                Análisis completo de {pz.nombre} (planes, pros y contras) →
              </Link>
            </div>
          </section>
        )}

        <div className="mb-10">
          <CtaCotizador zonaKey={prov.zonaKey} provinciaNombre={prov.nombre}
            titulo={`¿${pz.nombre} es tu mejor opción en ${prov.nombre}?`}
            subtitulo={`Compará ${pz.nombre} contra las otras ${prov.prepagas.length - 1} prepagas con cobertura en ${prov.nombre}, con precios por edad.`} />
        </div>

        {/* Hermanas del silo */}
        {hermanas.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Otras prepagas en {prov.nombre}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {hermanas.map((h) => (
                <Link key={h.slug} href={`/prepagas/${prov.slug}/${h.slug}`}
                  className="p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all group">
                  <div className="font-semibold text-sm text-gray-900 group-hover:text-[#E8002D] transition-colors">{h.nombre} en {prov.nombre}</div>
                  <div className="text-xs text-gray-400 mt-1">Ver cartilla y precios →</div>
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
