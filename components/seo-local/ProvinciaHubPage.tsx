import Link from 'next/link'
import type { Metadata } from 'next'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import type { ProvinciaSEO } from '@/lib/data/zonas'
import { formatPrecio, SITE_URL } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'
import { BreadcrumbBar, CtaCotizador, FaqSection, FUERZA_LABEL, jsonLdBreadcrumb, jsonLdFaq } from './shared'

export function provinciaHubMetadata(prov: ProvinciaSEO): Metadata {
  return {
    title: `Prepagas en ${prov.nombre}: precios y cartillas — ${PRECIO_ACTUALIZADO}`,
    description: `Compará las ${prov.prepagas.length} prepagas con cobertura real en ${prov.nombre}: precios ${PRECIO_ACTUALIZADO.toLowerCase()}, cartillas en ${prov.capitalNombre} y el interior, y cotización online sin DNI.`,
    alternates: { canonical: `${SITE_URL}/prepagas/${prov.slug}` },
    keywords: [`prepagas en ${prov.nombre.toLowerCase()}`, `mejor prepaga ${prov.nombre.toLowerCase()}`, `medicina prepaga ${prov.nombre.toLowerCase()}`, `prepagas ${prov.capitalNombre.toLowerCase()}`],
  }
}

export function ProvinciaHubPage({ prov }: { prov: ProvinciaSEO }) {
  const crumbs = [{ nombre: 'Prepagas', href: '/prepagas' }, { nombre: prov.nombre }]
  const jsonLd = [jsonLdBreadcrumb(crumbs), jsonLdFaq(prov.faq)]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BreadcrumbBar crumbs={crumbs} />

      <div className="container py-10 max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">Prepagas en {prov.nombre}</h1>
          <p className="text-gray-600 leading-relaxed">{prov.descripcion}</p>
          <p className="text-xs text-gray-400 mt-3">Información de cobertura verificada al {new Date(prov.fechaVerificacion + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })} · Precios de lista {PRECIO_ACTUALIZADO}</p>
        </header>

        {/* Ranking teaser */}
        <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-2xl px-5 py-4 mb-8">
          <div>
            <div className="font-bold text-gray-900 text-sm">¿Buscás directamente la mejor?</div>
            <div className="text-xs text-gray-500">Armamos el ranking {new Date().getFullYear()} según cartilla real en {prov.nombre}</div>
          </div>
          <Link href={`/prepagas/${prov.slug}/mejores-prepagas`} className="flex-shrink-0 text-sm font-bold text-[#E8002D] hover:underline">
            Ver ranking →
          </Link>
        </div>

        {/* Prepagas con cobertura */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Las {prov.prepagas.length} prepagas con cobertura en {prov.nombre}</h2>
          <div className="space-y-4">
            {prov.prepagas.map((pz) => {
              const prepData = pz.enSitio ? prepagas.find((p) => p.slug === pz.slug) : undefined
              const precioMin = prepData ? Math.min(...prepData.planes.map((pl) => pl.precio)) : null
              const fuerza = FUERZA_LABEL[pz.fuerza]
              return (
                <div key={pz.slug} className="bg-white rounded-2xl border-2 border-gray-100 hover:border-red-100 transition-colors p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {prepData ? (
                        <PrepagaLogo slug={pz.slug} nombre={pz.nombre} colorPrimario={prepData.colorPrimario} size="sm" />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center font-black text-[#E8002D] flex-shrink-0">
                          {pz.nombre.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-bold text-gray-900">{pz.nombre}</div>
                        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1 ${fuerza.cls}`}>{fuerza.label}</span>
                        <p className="text-sm text-gray-600 leading-relaxed mt-2">{pz.resumen}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {precioMin ? (
                        <>
                          <div className="text-xs text-gray-400">desde</div>
                          <div className="text-lg font-black text-[#E8002D] tabular-nums">{formatPrecio(precioMin)}</div>
                          <div className="text-xs text-gray-400">/mes</div>
                        </>
                      ) : (
                        <div className="text-xs text-gray-400 max-w-[90px]">Precio sujeto a cotización</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
                    {pz.enSitio && (
                      <Link href={`/prepagas/${prov.slug}/${pz.slug}`} className="text-sm font-semibold text-[#E8002D] hover:underline">
                        {pz.nombre} en {prov.nombre} →
                      </Link>
                    )}
                    <Link href={`/comparador?zona=${prov.zonaKey}&provincia=${encodeURIComponent(prov.nombre)}`} className="text-sm text-gray-400 hover:text-[#E8002D] transition-colors font-medium">
                      Cotizar
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Localidades */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Prepagas por ciudad en {prov.nombre}</h2>
          <p className="text-sm text-gray-500 mb-5">La cartilla cambia mucho entre {prov.capitalNombre} y el interior: mirá tu ciudad.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prov.localidades.map((loc) => (
              <Link key={loc.slug} href={`/prepagas/${prov.slug}/${loc.slug}`}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all group">
                <span className="font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors text-sm">Prepagas en {loc.nombre}</span>
                <span className="text-gray-300 group-hover:text-[#E8002D]">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Obra social provincial */}
        {prov.obraSocialProvincial && (
          <section className="mb-10">
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2">¿Y {prov.obraSocialProvincial.sigla}?</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{prov.obraSocialProvincial.nota}</p>
              <Link href={`/comparador?zona=${prov.zonaKey}&provincia=${encodeURIComponent(prov.nombre)}`} className="text-sm font-semibold text-[#E8002D] hover:underline">
                Comparar prepagas para complementar →
              </Link>
            </div>
          </section>
        )}

        <div className="mb-10">
          <CtaCotizador zonaKey={prov.zonaKey} provinciaNombre={prov.nombre} />
        </div>

        <FaqSection faq={prov.faq} />

        <div className="mt-10 text-center">
          <Link href="/prepagas" className="text-sm text-gray-400 hover:text-[#E8002D] transition-colors">
            ← Todas las prepagas de Argentina
          </Link>
        </div>
      </div>
    </>
  )
}
