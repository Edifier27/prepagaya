import Link from 'next/link'
import type { Metadata } from 'next'
import { prepagas, PRECIO_ACTUALIZADO, nivelPrecio } from '@/lib/data/prepagas'
import type { ProvinciaSEO } from '@/lib/data/zonas'
import { SITE_URL, formatPrecio } from '@/lib/utils'
import { NivelPrecioBadge } from '@/components/ui/NivelPrecioBadge'
import { BreadcrumbBar, CtaCotizador, FUERZA_LABEL, jsonLdBreadcrumb } from './shared'

// Partners comerciales de PrepagaYa: siempre se destacan visualmente en el ranking,
// aunque el orden del ranking en sí se mantiene honesto según cartilla real de la zona.
const PARTNER_ORDER = ['swiss-medical', 'sancor-salud', 'premedic']

export function rankingZonaMetadata(prov: ProvinciaSEO): Metadata {
  const year = new Date().getFullYear()
  return {
    title: `Mejores prepagas en ${prov.nombre} (${year}): ranking y cartilla`,
    description: `Ranking ${year} de prepagas en ${prov.nombre} según cartilla local y satisfacción — con prestadores como ${prov.prestadoresClave[0]}. Actualizado ${PRECIO_ACTUALIZADO.toLowerCase()}, cotización online sin DNI.`,
    alternates: { canonical: `${SITE_URL}/prepagas/${prov.slug}/mejores-prepagas` },
    keywords: [`mejores prepagas ${prov.nombre.toLowerCase()}`, `mejor prepaga en ${prov.nombre.toLowerCase()}`, `ranking prepagas ${prov.nombre.toLowerCase()} ${year}`],
  }
}

export function RankingZonaPage({ prov }: { prov: ProvinciaSEO }) {
  const year = new Date().getFullYear()
  const crumbs = [
    { nombre: 'Prepagas', href: '/prepagas' },
    { nombre: prov.nombre, href: `/prepagas/${prov.slug}` },
    { nombre: 'Mejores prepagas' },
  ]
  const jsonLd = [
    jsonLdBreadcrumb(crumbs),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Mejores prepagas en ${prov.nombre} ${year}`,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      numberOfItems: prov.prepagas.length,
      itemListElement: prov.prepagas.map((pz, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: pz.nombre,
        ...(pz.enSitio ? { url: `${SITE_URL}/prepagas/${prov.slug}/${pz.slug}` } : {}),
      })),
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BreadcrumbBar crumbs={crumbs} />

      <div className="container py-10 max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">Las mejores prepagas en {prov.nombre} ({year})</h1>
          <p className="text-gray-600 leading-relaxed">{prov.rankingIntro}</p>
          <p className="text-xs text-gray-400 mt-3">Cobertura verificada al {new Date(prov.fechaVerificacion + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })} · Precios de lista {PRECIO_ACTUALIZADO}</p>
          {!PARTNER_ORDER.includes(prov.prepagas[0]?.slug) && (
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mt-4">
              <span className="text-amber-500 flex-shrink-0">★</span>
              <p className="text-xs text-amber-800 leading-relaxed">
                Este ranking pondera cartilla local real, así que en {prov.nombre} puede quedar arriba una regional que no vendemos nosotros. Dicho eso: en PrepagaYa trabajamos directo con Swiss Medical y Sancor Salud, así que si alguna de las dos te sirve, podés cotizar y contratar con nosotros con asesoramiento incluido.
              </p>
            </div>
          )}
        </header>

        <div className="space-y-5 mb-10">
          {prov.prepagas.map((pz, i) => {
            const prepData = pz.enSitio ? prepagas.find((p) => p.slug === pz.slug) : undefined
            const precioMin = prepData ? Math.min(...prepData.planes.map((pl) => pl.precio)) : null
            const fuerza = FUERZA_LABEL[pz.fuerza]
            const isPartner = PARTNER_ORDER.includes(pz.slug)
            return (
              <div key={pz.slug} className={`bg-white rounded-2xl border-2 overflow-hidden ${
                i === 0 ? 'border-[#E8002D] shadow-md' : isPartner ? 'border-amber-200' : 'border-gray-100'
              }`}>
                {i === 0 && (
                  <div className="bg-[#E8002D] text-white text-xs font-bold px-4 py-2">Nº 1 en {prov.nombre} según cartilla local</div>
                )}
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black flex-shrink-0 ${i === 0 ? 'bg-[#E8002D] text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="font-bold text-gray-900 text-lg leading-tight">{pz.nombre}</h2>
                            {isPartner && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border"
                                style={{ color: '#92400E', backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }}>
                                ★ TRABAJAMOS CON ELLOS
                              </span>
                            )}
                          </div>
                          <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1 ${fuerza.cls}`}>{fuerza.label}</span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          {precioMin ? (
                            <>
                              <div className="font-bold text-gray-900 text-sm">{formatPrecio(precioMin)}</div>
                              <NivelPrecioBadge nivel={nivelPrecio(precioMin)} />
                            </>
                          ) : (
                            <div className="text-xs text-gray-400 max-w-[90px]">Precio sujeto a cotización</div>
                          )}
                          {prepData && (
                            <div className="text-[10px] text-[#00875A] font-semibold mt-1">{prepData.satisfaccion}% satisf.</div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mt-2">{pz.resumen}</p>
                      <ul className="mt-3 space-y-1">
                        {pz.cartillaLocal.map((c) => (
                          <li key={c} className="flex items-start gap-1.5 text-xs text-gray-600">
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-[#00875A] flex-shrink-0 mt-px">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            {c}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
                        {pz.enSitio && (
                          <Link href={`/prepagas/${prov.slug}/${pz.slug}`} className="text-sm font-semibold text-[#E8002D] hover:underline">
                            Ver {pz.nombre} en {prov.nombre} →
                          </Link>
                        )}
                        <Link href={`/comparador?zona=${prov.zonaKey}&provincia=${encodeURIComponent(prov.nombre)}`} className="text-sm text-gray-400 hover:text-[#E8002D] transition-colors font-medium">
                          Cotizar
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <CtaCotizador zonaKey={prov.zonaKey} provinciaNombre={prov.nombre}
          titulo={`¿Cuál te conviene a vos en ${prov.nombre}?`}
          subtitulo="El ranking es general — tu edad, tu grupo familiar y tu ciudad cambian el resultado. Cotizá gratis y compará." />

        <div className="mt-10 text-center">
          <Link href={`/prepagas/${prov.slug}`} className="text-sm text-gray-400 hover:text-[#E8002D] transition-colors">
            ← Prepagas en {prov.nombre}
          </Link>
        </div>
      </div>
    </>
  )
}
