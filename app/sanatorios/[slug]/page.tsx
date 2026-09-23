import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { SANATORIOS_SEO, prepagasEnSanatorio, sanatoriosPublicables, type PrepagaEnSanatorio } from '@/lib/data/sanatorios-seo'
import { SITE_NAME, SITE_URL, formatPrecio, PRIORIDAD_PARTNERS, TIEMPO_RESPUESTA } from '@/lib/utils'

// "¿Qué prepagas atienden en el Hospital X?" (23-sep-2026): búsqueda que la
// competencia cubre con notas escritas a mano. Acá todo sale de las cartillas
// oficiales cargadas en lib/data/cartilla-zonas (ver lib/data/sanatorios-seo.ts).

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return sanatoriosPublicables().map((s) => ({ slug: s.slug }))
}

const ORDEN = [...PRIORIDAD_PARTNERS, 'osde']
function ordenar(lista: PrepagaEnSanatorio[]) {
  return [...lista].sort((a, b) => (ORDEN.indexOf(a.prepagaSlug) + 99) % 99 - (ORDEN.indexOf(b.prepagaSlug) + 99) % 99)
}

/** Plan del comparador para un plan de cartilla, con su precio oficial (30 años). */
function planComparador(prepagaSlug: string, comparadorSlug?: string) {
  if (!comparadorSlug) return null
  const plan = prepagas.find((p) => p.slug === prepagaSlug)?.planes.find((pl) => pl.slug === comparadorSlug)
  return plan ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const s = SANATORIOS_SEO.find((x) => x.slug === slug)
  const lista = s ? prepagasEnSanatorio(slug) : []
  if (!s || lista.length < 2) return {}
  const nombres = ordenar(lista).map((p) => p.prepagaNombre)
  return {
    title: `Prepagas que atienden en el ${s.nombre}: desde qué plan`,
    description: `Prepagas con el ${s.nombre} en cartilla: ${nombres.join(', ')}. Desde qué plan lo cubre cada una para internación y guardia, según sus cartillas oficiales. Cotizá gratis.`,
    alternates: { canonical: `${SITE_URL}/sanatorios/${slug}` },
    keywords: [
      `prepagas ${s.nombre.toLowerCase()}`,
      `que prepagas atienden en el ${s.nombre.toLowerCase()}`,
      `obra social ${s.nombre.toLowerCase()}`,
      `${s.nombre.toLowerCase()} prepaga`,
    ],
  }
}

export default async function SanatorioPage({ params }: Props) {
  const { slug } = await params
  const s = SANATORIOS_SEO.find((x) => x.slug === slug)
  if (!s) notFound()
  const lista = ordenar(prepagasEnSanatorio(slug))
  if (lista.length < 2) notFound()

  const conInternacion = lista.filter((p) => p.desde)
  const resumen = conInternacion
    .map((p) => `${p.prepagaNombre} desde ${p.desde!.label}`)
    .join('; ')

  const faqs = [
    {
      q: `¿Qué prepagas atienden en el ${s.nombre}?`,
      a: `Según sus cartillas oficiales, el ${s.nombre} figura en ${lista.map((p) => p.prepagaNombre).join(', ')}.${resumen ? ` Para internación: ${resumen}.` : ''}`,
    },
    {
      q: `¿Cuál es el plan más barato que incluye el ${s.nombre}?`,
      a: (() => {
        const conPrecio = conInternacion
          .map((p) => ({ p, plan: planComparador(p.prepagaSlug, p.desde!.comparadorSlug) }))
          .filter((x) => x.plan)
          .sort((a, b) => a.plan!.precio - b.plan!.precio)
        const m = conPrecio[0]
        return m
          ? `Entre las cartillas que relevamos, el plan de entrada más económico que lo incluye para internación es ${m.p.prepagaNombre} ${m.plan!.nombre}, desde ${formatPrecio(m.plan!.precio)}/mes para una persona de 30 años (${PRECIO_ACTUALIZADO.toLowerCase()}). El precio final depende de tu edad y tu zona.`
          : 'Depende de tu edad y tu zona: te lo cotizamos gratis.'
      })(),
    },
    {
      q: '¿Es lo mismo internación que guardia?',
      a: 'No. Un plan puede incluir un sanatorio solo para guardia, solo para internación o para las dos. En esta página lo mostramos por separado, tal como figura en cada cartilla oficial.',
    },
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Sanatorios', item: `${SITE_URL}/sanatorios` },
        { '@type': 'ListItem', position: 3, name: s.nombre },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-[#E8002D] transition-colors">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <Link href="/sanatorios" className="hover:text-[#E8002D] transition-colors">Sanatorios</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">{s.nombre}</span>
          </nav>
        </div>
      </div>

      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-10">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight text-balance">
            ¿Qué prepagas atienden en el {s.nombre}?
          </h1>
          <p className="text-gray-700 text-base leading-relaxed max-w-3xl">
            Según sus cartillas oficiales, el <strong>{s.nombre}</strong> figura en <strong>{lista.map((p) => p.prepagaNombre).join(', ')}</strong>.
            {resumen && <> Para internación: {resumen}.</>}
          </p>
          <a href="#cotizar" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm transition-colors">
            Cotizar un plan con el {s.nombre} →
          </a>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Desde qué plan lo cubre cada prepaga</h2>
          <div className="space-y-4">
            {lista.map((p) => {
              const plan = p.desde ? planComparador(p.prepagaSlug, p.desde.comparadorSlug) : null
              return (
                <div key={p.prepagaSlug} className="rounded-2xl border border-gray-200 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{p.prepagaNombre}</h3>
                      {p.desde ? (
                        <p className="text-sm text-gray-700 mt-0.5">
                          Internación desde <strong>{p.desde.label}</strong>
                          {plan && <> · desde {formatPrecio(plan.precio)}/mes <span className="text-gray-400">(30 años)</span></>}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-700 mt-0.5">Figura solo para guardia</p>
                      )}
                    </div>
                    {plan && (
                      <Link href={`/prepagas/${p.prepagaSlug}/${plan.slug}`} className="text-sm font-semibold text-[#E8002D] hover:underline">
                        Ver {plan.nombre} →
                      </Link>
                    )}
                  </div>
                  <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Internación</dt>
                      <dd className="text-gray-800 mt-1">{p.internacion.length ? p.internacion.map((x) => x.label).join(' · ') : 'No figura'}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Guardia</dt>
                      <dd className="text-gray-800 mt-1">{p.guardia.length ? p.guardia.map((x) => x.label).join(' · ') : 'No figura con guardia'}</dd>
                    </div>
                  </dl>
                  {p.sedes.length > 0 && (
                    <p className="text-xs text-gray-500 mt-3">
                      Como figura en la cartilla: {p.sedes.map((x) => `${x.nombre}${x.direccion ? ` (${x.direccion})` : ''}`).join(' · ')}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Fuente: <a href={p.fuenteUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">cartilla oficial de {p.prepagaNombre}</a> ({p.fecha}).
                  </p>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-gray-500 mt-5 max-w-3xl">
            Relevamos las cartillas oficiales de Swiss Medical, OSDE, Premedic, Avalian y Sancor Salud en CABA y GBA. Si una prepaga no aparece acá, puede que lo tenga con otro nombre o en otra zona: consultanos y te lo confirmamos.
          </p>
        </div>
      </section>

      <section id="cotizar" className="py-12 bg-[#E8002D] text-white scroll-mt-20">
        <div className="container max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Cotizá un plan que incluya el {s.nombre}</h2>
          <p className="text-red-100 text-sm mb-6">Te respondemos en {TIEMPO_RESPUESTA}, con el precio para tu edad y tu zona.</p>
          <Link href="/comparador" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E8002D] font-bold rounded-2xl hover:bg-red-50 transition-all shadow-lg text-sm">
            Cotizar gratis →
          </Link>
        </div>
      </section>

      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
          <div className="space-y-2">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer select-none list-none">
                  <h3 className="font-semibold text-sm text-gray-900 m-0">{q}</h3>
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <p className="text-sm font-semibold text-gray-700 mb-3">Otros sanatorios</p>
          <div className="flex flex-wrap gap-2">
            {sanatoriosPublicables().filter((x) => x.slug !== slug).map((x) => (
              <Link key={x.slug} href={`/sanatorios/${x.slug}`} className="text-sm px-3 py-1.5 bg-white border border-gray-200 hover:border-[#E8002D] rounded-full text-gray-700">
                {x.nombre}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
