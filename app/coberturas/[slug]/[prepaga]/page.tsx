import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { coberturasMarca, getCoberturaMarca } from '@/lib/data/coberturas-marca'
import { coberturas } from '@/lib/data/coberturas'
import { prepagas } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'

// Silo de coberturas: /coberturas/[tema] → /coberturas/[tema]/[prepaga]
// ("¿Swiss Medical cubre ortodoncia?"). Todo el contenido sale de
// lib/data/coberturas-marca.ts, que cita el documento oficial de cada dato.
export const dynamicParams = false

interface Props {
  params: Promise<{ slug: string; prepaga: string }>
}

// Hub genérico del tema, cuando existe (implantes → odontología).
const HUB_TEMA: Record<string, string> = { 'implantes-dentales': 'odontologia' }

export function generateStaticParams() {
  return coberturasMarca.map((c) => ({ slug: c.tema, prepaga: c.prepagaSlug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, prepaga } = await params
  const c = getCoberturaMarca(slug, prepaga)
  if (!c) return {}
  return {
    title: c.title,
    description: c.description,
    keywords: c.keywords,
    alternates: { canonical: `${SITE_URL}/coberturas/${slug}/${prepaga}` },
  }
}

export default async function CoberturaMarcaPage({ params }: Props) {
  const { slug, prepaga } = await params
  const c = getCoberturaMarca(slug, prepaga)
  if (!c) notFound()

  const prep = prepagas.find((p) => p.slug === c.prepagaSlug)
  const planCta = prep?.planes.find((p) => p.slug === c.planCta)
  const hubSlug = HUB_TEMA[c.tema] ?? c.tema
  const hub = coberturas.find((x) => x.slug === hubSlug)
  const hermanas = coberturasMarca.filter((x) => x.prepagaSlug === c.prepagaSlug && x.tema !== c.tema)
  const otrasMarcas = coberturasMarca.filter((x) => x.tema === c.tema && x.prepagaSlug !== c.prepagaSlug)
  const incluidos = c.planes.filter((p) => p.incluido && !p.sinDato)
  const faqs = [
    { q: c.pregunta, a: c.respuesta },
    ...(incluidos.length && incluidos.length < c.planes.length
      ? [{
          q: `¿Qué planes de ${c.prepagaNombre} incluyen ${c.temaNombre.toLowerCase()}?`,
          a: `${incluidos.map((p) => (p.detalle ? `${p.plan} (${p.detalle.toLowerCase()})` : p.plan)).join(', ')}.`,
        }]
      : []),
  ]
  const url = `${SITE_URL}/coberturas/${c.tema}/${c.prepagaSlug}`

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Coberturas', item: `${SITE_URL}/coberturas` },
        ...(hub ? [{ '@type': 'ListItem', position: 3, name: hub.nombre, item: `${SITE_URL}/coberturas/${hub.slug}` }] : []),
        { '@type': 'ListItem', position: hub ? 4 : 3, name: `${c.temaNombre} en ${c.prepagaNombre}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: c.title,
      url,
      inLanguage: 'es-AR',
      isBasedOn: c.fuentes.map((f) => ({ '@type': 'CreativeWork', name: f.nombre, ...(f.url ? { url: f.url } : {}) })),
      publisher: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#E8002D] transition-colors">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <Link href="/coberturas" className="hover:text-[#E8002D] transition-colors">Coberturas</Link>
            {hub && (
              <>
                <span className="text-gray-300">›</span>
                <Link href={`/coberturas/${hub.slug}`} className="hover:text-[#E8002D] transition-colors">{hub.nombre}</Link>
              </>
            )}
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">{c.prepagaNombre}</span>
          </nav>
        </div>
      </div>

      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-10">
        <div className="container max-w-4xl mx-auto">
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Datos oficiales de {c.prepagaNombre} · {c.fuentes[0].fecha}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">{c.pregunta}</h1>
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mb-6">{c.respuesta}</p>
          {(
            <ContratarPlanButton
              prepagaNombre={c.prepagaNombre}
              planNombre={planCta?.nombre}
              fuente={`cobertura-${c.tema}`}
              label={planCta ? `Cotizar ${c.prepagaNombre} ${planCta.nombre}` : `Cotizar ${c.prepagaNombre}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-md text-sm"
            />
          )}
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{c.temaNombre} en {c.prepagaNombre}, plan por plan</h2>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden bg-white">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left font-semibold px-4 py-2.5">Plan</th>
                  <th className="text-left font-semibold px-4 py-2.5">{c.temaNombre}</th>
                </tr>
              </thead>
              <tbody>
                {c.planes.map((p) => {
                  const slugs = p.planSlugs.filter((s) => prep?.planes.some((pl) => pl.slug === s))
                  return (
                    <tr key={p.plan} className="border-t border-gray-100">
                      <td className="px-4 py-2.5 font-medium text-gray-900 whitespace-nowrap">
                        {slugs.length ? (
                          slugs.map((s, i) => (
                            <span key={s}>
                              {i > 0 && ' y '}
                              <Link href={`/prepagas/${c.prepagaSlug}/${s}`} className="hover:text-[#E8002D] underline-offset-2 hover:underline">
                                {prep?.planes.find((pl) => pl.slug === s)?.nombre.replace(/^Plan /, '') ?? s}
                              </Link>
                            </span>
                          ))
                        ) : (
                          p.plan
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        {p.sinDato ? (
                          <span className="inline-flex items-center gap-1.5 text-gray-400">
                            <span aria-hidden>—</span>
                            <span>Sin dato en la ficha oficial</span>
                          </span>
                        ) : p.incluido ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-700">
                            <span aria-hidden>✓</span>
                            <span>{p.detalle ?? 'Incluido'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-gray-400">
                            <span aria-hidden>✕</span>
                            <span>No incluido</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {c.detalles.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Condiciones</h2>
              <ul className="space-y-2">
                {c.detalles.map((d) => (
                  <li key={d.texto} className="text-sm text-gray-700 leading-relaxed bg-gray-50 border border-gray-100 rounded-xl p-3">
                    {d.texto} <span className="text-gray-400">— {d.fuente}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-red-50 border border-red-100 rounded-2xl p-4">
            <p className="text-sm text-gray-700">¿Querés saber cuánto te sale un plan de {c.prepagaNombre} que incluya {c.temaNombre.toLowerCase()}? Te cotizamos gratis.</p>
            {(
              <ContratarPlanButton
                prepagaNombre={c.prepagaNombre}
                planNombre={planCta?.nombre}
                fuente={`cobertura-${c.tema}`}
                label="Cotizar gratis"
                className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-sm text-sm"
              />
            )}
          </div>
        </div>
      </section>

      <section className="py-6 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto text-xs text-gray-400 leading-relaxed">
          Fuente: {c.fuentes.map((f) => `${f.nombre} (${f.fecha})`).join('; ')}. Las condiciones pueden cambiar: confirmalas con {c.prepagaNombre} antes de contratar.
        </div>
      </section>

      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto space-y-6">
          {hermanas.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Qué más cubre {c.prepagaNombre}</h2>
              <div className="flex flex-wrap gap-2">
                {hermanas.map((h) => (
                  <Link key={h.tema} href={`/coberturas/${h.tema}/${h.prepagaSlug}`} className="text-xs px-3 py-1.5 bg-white text-gray-700 border border-gray-200 rounded-full hover:border-red-200 hover:text-[#E8002D] transition-colors font-medium">
                    {h.temaNombre}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {otrasMarcas.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">{c.temaNombre} en otras prepagas</h2>
              <div className="flex flex-wrap gap-2">
                {otrasMarcas.map((h) => (
                  <Link key={h.prepagaSlug} href={`/coberturas/${h.tema}/${h.prepagaSlug}`} className="text-xs px-3 py-1.5 bg-white text-gray-700 border border-gray-200 rounded-full hover:border-red-200 hover:text-[#E8002D] transition-colors font-medium">
                    {h.prepagaNombre}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-4 text-sm">
            {hub && <Link href={`/coberturas/${hub.slug}`} className="text-[#E8002D] font-semibold hover:underline">{hub.nombre} en todas las prepagas →</Link>}
            <Link href={`/prepagas/${c.prepagaSlug}`} className="text-[#E8002D] font-semibold hover:underline">Planes y precios de {c.prepagaNombre} →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
