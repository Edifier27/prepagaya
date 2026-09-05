import Link from 'next/link'
import type { Metadata } from 'next'
import { prepagas, PRECIO_ACTUALIZADO, nivelPrecio } from '@/lib/data/prepagas'
import type { ProvinciaSEO } from '@/lib/data/zonas'
import { SITE_URL } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'
import { NivelPrecioBadge } from '@/components/ui/NivelPrecioBadge'
import { agruparPorZona, BreadcrumbBar, CtaCotizador, FaqSection, FUERZA_LABEL, jsonLdBreadcrumb, jsonLdFaq } from './shared'

export function provinciaHubMetadata(prov: ProvinciaSEO): Metadata {
  return {
    title: `Prepagas en ${prov.nombre}: cobertura y cartillas — ${PRECIO_ACTUALIZADO}`,
    description: `Compará las ${prov.prepagas.length} prepagas con cobertura real en ${prov.nombre}: cartillas verificadas en ${prov.capitalNombre} y el interior, y cotización online sin DNI. Actualizado ${PRECIO_ACTUALIZADO.toLowerCase()}.`,
    alternates: { canonical: `${SITE_URL}/prepagas/${prov.slug}` },
    keywords: [`prepagas en ${prov.nombre.toLowerCase()}`, `mejor prepaga ${prov.nombre.toLowerCase()}`, `medicina prepaga ${prov.nombre.toLowerCase()}`, `prepagas ${prov.capitalNombre.toLowerCase()}`],
  }
}

const PARTNER_ORDER = ['swiss-medical', 'sancor-salud', 'premedic']

// Prepagas con sanatorio/centro médico propio verificado, por provincia (no un cálculo
// automático sobre el texto: cada lista está chequeada a mano contra la ficha de cada
// una para evitar falsos positivos, ej. "sus sanatorios propios están en Buenos Aires").
const PROPIO_POR_PROVINCIA: Record<string, string[]> = {
  caba: ['swiss-medical', 'omint', 'cemic', 'medicus', 'hospital-italiano', 'galeno'],
  'buenos-aires': ['galeno', 'swiss-medical', 'medicus'],
}

export function ProvinciaHubPage({ prov }: { prov: ProvinciaSEO }) {
  const crumbs = [{ nombre: 'Prepagas', href: '/prepagas' }, { nombre: prov.nombre }]
  const jsonLd = [jsonLdBreadcrumb(crumbs), jsonLdFaq(prov.faq)]
  const prepagasOrdenadas = [...prov.prepagas].sort((a, b) => {
    const ia = PARTNER_ORDER.indexOf(a.slug)
    const ib = PARTNER_ORDER.indexOf(b.slug)
    if (ia === -1 && ib === -1) return 0
    if (ia === -1) return 1
    if (ib === -1) return -1
    return ia - ib
  })
  const gruposLocalidades = agruparPorZona(prov.localidades)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BreadcrumbBar crumbs={crumbs} />

      <div className="container py-10 max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">Prepagas en {prov.nombre}</h1>
          <p className="text-gray-600 leading-relaxed">{prov.descripcion}</p>
          <p className="text-xs text-gray-400 mt-3">Información de cobertura verificada al {new Date(prov.fechaVerificacion + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })} · Precios de lista {PRECIO_ACTUALIZADO}</p>

          {prov.localidades.length > 1 && (
            <div className="mt-5 space-y-2.5">
              {gruposLocalidades.map((grupo, i) => (
                <div key={grupo.titulo ?? i} className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400 mr-1">
                    {grupo.titulo ? `${grupo.titulo}:` : 'Elegí tu zona:'}
                  </span>
                  {grupo.items.map((loc) => (
                    <Link key={loc.slug} href={`/prepagas/${prov.slug}/${loc.slug}`}
                      className="text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-red-50 hover:text-[#E8002D] border border-gray-200 hover:border-red-200 rounded-full px-3 py-1.5 transition-colors">
                      {loc.nombre.split(' (')[0]}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}
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
            {prepagasOrdenadas.map((pz) => {
              const prepData = pz.enSitio ? prepagas.find((p) => p.slug === pz.slug) : undefined
              const precioMin = prepData ? Math.min(...prepData.planes.map((pl) => pl.precio)) : null
              const fuerza = FUERZA_LABEL[pz.fuerza]
              const isPartner = PARTNER_ORDER.includes(pz.slug)
              const tienePropio = (PROPIO_POR_PROVINCIA[prov.slug] ?? []).includes(pz.slug)
              return (
                <div key={pz.slug} className={`bg-white rounded-2xl border-2 transition-colors p-5 ${
                  isPartner ? 'border-amber-200 hover:border-amber-300' : 'border-gray-100 hover:border-red-100'
                }`}>
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
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="font-bold text-gray-900">{pz.nombre}</div>
                          {isPartner && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border"
                              style={{ color: '#92400E', backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }}>
                              ★ MÁS ELEGIDA
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap mt-1">
                          <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${fuerza.cls}`}>{fuerza.label}</span>
                          {tienePropio && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                              🏥 Sanatorio propio
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mt-2">{pz.resumen}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {precioMin ? (
                        <NivelPrecioBadge nivel={nivelPrecio(precioMin)} />
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
                    <Link
                      href={`/comparador?zona=${prov.zonaKey}&provincia=${encodeURIComponent(prov.nombre)}`}
                      className={isPartner
                        ? 'text-sm font-bold text-[#E8002D] hover:underline'
                        : 'text-sm text-gray-400 hover:text-[#E8002D] transition-colors font-medium'}
                    >
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
          <div className="space-y-6">
            {gruposLocalidades.map((grupo, i) => (
              <div key={grupo.titulo ?? i}>
                {grupo.titulo && (
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">{grupo.titulo}</h3>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {grupo.items.map((loc) => (
                    <Link key={loc.slug} href={`/prepagas/${prov.slug}/${loc.slug}`}
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all group">
                      <span className="font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors text-sm">Prepagas en {loc.nombre}</span>
                      <span className="text-gray-300 group-hover:text-[#E8002D]">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Obra social provincial */}
        {prov.obraSocialProvincial && (
          <section className="mb-10">
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2">¿Y {prov.obraSocialProvincial.sigla}?</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{prov.obraSocialProvincial.nota}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {prov.obraSocialProvincial.slug && (
                  <Link href={`/obras-sociales/${prov.obraSocialProvincial.slug}`} className="text-sm font-semibold text-[#E8002D] hover:underline">
                    Ver ficha completa de {prov.obraSocialProvincial.sigla} →
                  </Link>
                )}
                <Link href={`/comparador?zona=${prov.zonaKey}&provincia=${encodeURIComponent(prov.nombre)}`} className="text-sm font-semibold text-gray-500 hover:text-[#E8002D] hover:underline">
                  Comparar prepagas para complementar →
                </Link>
              </div>
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
