import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { guias } from '@/lib/data/guias'
import { prepagas, nivelPrecio } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL, OG_IMAGE } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { NivelPrecioBadge } from '@/components/ui/NivelPrecioBadge'
import { StickySectionNav } from '@/components/ui/StickySectionNav'

interface Props {
  params: Promise<{ slug: string }>
}

function slugifyId(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export async function generateStaticParams() {
  return guias.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guia = guias.find((g) => g.slug === slug)
  if (!guia) return {}
  return {
    title: guia.titulo,
    description: guia.metaDescripcion,
    alternates: { canonical: `${SITE_URL}/guias/${slug}` },
    keywords: guia.keywords,
    openGraph: {
      title: guia.titulo,
      description: guia.metaDescripcion,
      type: 'article',
      images: [OG_IMAGE],
      modifiedTime: guia.fechaActualizacion,
    },
  }
}

export default async function GuiaPage({ params }: Props) {
  const { slug } = await params
  const guia = guias.find((g) => g.slug === slug)
  if (!guia) notFound()

  const prepagasRelacionadas = (guia.prepagasRelacionadas ?? [])
    .map((s) => prepagas.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  const guiasRelacionadas = guia.relacionadas
    .map((s) => guias.find((g) => g.slug === s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guia.titulo,
      description: guia.metaDescripcion,
      url: `${SITE_URL}/guias/${slug}`,
      image: `${SITE_URL}/opengraph-image`,
      dateModified: guia.fechaActualizacion,
      author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/guias/${slug}` },
      inLanguage: 'es-AR',
      ...(guia.fuentes ? { isBasedOn: guia.fuentes.map((f) => f.url) } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Guías', item: `${SITE_URL}/guias` },
        { '@type': 'ListItem', position: 3, name: guia.titulo },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: guia.faq.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <StickySectionNav
        items={guia.contenido.secciones.map((s) => ({ id: slugifyId(s.titulo), label: s.titulo }))}
      />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-[#E8002D] transition-colors">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <Link href="/guias" className="hover:text-[#E8002D] transition-colors">Guías</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700 truncate max-w-xs">{guia.titulo}</span>
          </nav>
        </div>
      </div>

      <div className="container py-10 max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <Badge variant="gray" className="mb-4">{guia.categoria}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{guia.titulo}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 pb-6 border-b border-gray-100">
            <span>
              Actualizado el {new Date(guia.fechaActualizacion + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5">
                <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" strokeLinecap="round" />
              </svg>
              {guia.tiempoLectura} min de lectura
            </span>
            <span>{SITE_NAME}</span>
          </div>
        </header>

        {/* Intro: va ANTES del índice a propósito (GEO, 17-sep-2026). Los
            crawlers de IA (GPTBot, ClaudeBot, PerplexityBot) no ejecutan JS
            ni CSS: leen el HTML en el orden en que aparece, y evalúan
            relevancia principalmente por lo primero que encuentran. Un índice
            de navegación antes de la respuesta diluye esa señal. */}
        <div className="bg-red-50 border-l-4 border-[#E8002D] rounded-r-xl p-5 mb-8">
          <p className="text-gray-800 leading-relaxed">{guia.contenido.intro}</p>
        </div>

        {/* Índice */}
        <div className="mb-8 bg-gray-50 rounded-2xl border border-gray-200 p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">En esta guía</p>
          <ul className="space-y-2">
            {guia.contenido.secciones.map((s, i) => (
              <li key={s.titulo}>
                <a
                  href={`#${slugifyId(s.titulo)}`}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#E8002D] transition-colors"
                >
                  <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500 flex-shrink-0">
                    {i + 1}
                  </span>
                  {s.titulo}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Secciones */}
        <article className="space-y-10 mb-10">
          {guia.contenido.secciones.map((seccion, i) => (
            <section key={seccion.titulo} id={slugifyId(seccion.titulo)} className="scroll-mt-28">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-[11px] font-bold text-[#E8002D] flex-shrink-0">
                  {i + 1}
                </span>
                {seccion.titulo}
              </h2>
              <p className="text-gray-600 leading-relaxed">{seccion.cuerpo}</p>
              {seccion.enlaces && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {seccion.enlaces.map((e) => (
                    <a
                      key={e.url}
                      href={e.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border-2 border-gray-200 hover:border-[#E8002D] text-gray-900 font-semibold rounded-xl text-sm transition-colors"
                    >
                      {e.texto}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 text-gray-400">
                        <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  ))}
                </div>
              )}
              {seccion.cta && (
                <div className="mt-5 bg-red-50 border border-red-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-sm text-gray-800 leading-relaxed">{seccion.cta.texto}</p>
                  <Link
                    href={seccion.cta.href}
                    className="flex-shrink-0 text-center px-5 py-2.5 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm transition-colors whitespace-nowrap"
                  >
                    {seccion.cta.boton} →
                  </Link>
                </div>
              )}
            </section>
          ))}

          {/* Conclusión */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-2">En resumen</h2>
            <p className="text-gray-600 leading-relaxed">{guia.contenido.conclusion}</p>
          </div>

          {guia.fuentes && (
            <p className="text-xs text-gray-400 leading-relaxed">
              Fuentes oficiales:{' '}
              {guia.fuentes.map((f, i) => (
                <span key={f.url}>
                  {i > 0 && ' · '}
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">{f.texto}</a>
                </span>
              ))}
            </p>
          )}

          {/* Guía dedicada al PMO: se referencia desde acá y desde todas las
              fichas de condiciones y coberturas — es el desglose legal completo. */}
          {slug === 'que-cubre-la-prepaga' && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start justify-between gap-4 flex-wrap">
              <p className="text-sm text-gray-700 leading-relaxed">
                Este resumen cubre lo esencial. Para el desglose legal completo, categoría por categoría, con la fuente oficial de la SSSalud, mirá la guía dedicada del PMO.
              </p>
              <Link href="/pmo" className="flex-shrink-0 text-sm font-bold text-blue-700 hover:underline">
                Ver el PMO completo →
              </Link>
            </div>
          )}
          {slug === 'discapacidad-obra-social-cobertura-100' && (
            <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 flex items-start justify-between gap-4 flex-wrap">
              <p className="text-sm text-gray-700 leading-relaxed">
                ¿Ya tenés el CUD y buscás comparar prepagas específicamente por esto? Mirá qué prepaga conviene según nuestra ficha dedicada a discapacidad.
              </p>
              <Link href="/condiciones/discapacidad" className="flex-shrink-0 text-sm font-bold text-teal-700 hover:underline">
                Ver mejores prepagas para discapacidad →
              </Link>
            </div>
          )}
        </article>

        {/* Prepagas relacionadas */}
        {prepagasRelacionadas.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Prepagas mencionadas en esta guía</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prepagasRelacionadas.map((p) => {
                const planBase = [...p.planes].sort((a, b) => a.precio - b.precio)[0]
                return (
                  <Link
                    key={p.slug}
                    href={`/prepagas/${p.slug}`}
                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all group"
                  >
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors">{p.nombre}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{p.planes.length} planes · {p.satisfaccion}% satisfacción</div>
                    </div>
                    <div className="text-right">
                      <NivelPrecioBadge nivel={nivelPrecio(planBase.precio)} />
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Cross-link al silo de empresas — solo en las guías sobre planes corporativos */}
        {(guia.slug === 'prepaga-corporativa-vs-particular' || guia.slug === 'derivar-obra-social-a-prepaga') && (
          <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-blue-700 mb-1">¿Estás del lado de la empresa?</div>
              <div className="text-sm text-gray-700">Armamos propuestas corporativas comparadas según la cantidad de gente de tu equipo.</div>
            </div>
            <Link href="/empresas" className="flex-shrink-0 px-5 py-2.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-sm transition-colors whitespace-nowrap">
              Ver planes para empresas →
            </Link>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] rounded-2xl p-7 text-white text-center mb-10">
          <h2 className="text-xl font-bold mb-2">¿Querés comparar prepagas con precios reales?</h2>
          <p className="text-red-100 text-sm mb-5">Precios actualizados todos los meses. Sin DNI y sin compromiso.</p>
          <Link
            href="/comparador"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#E8002D] font-bold rounded-xl text-sm hover:bg-red-50 transition-colors"
          >
            Comparar prepagas →
          </Link>
        </div>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
          <div className="space-y-2">
            {guia.faq.map(({ q, a }) => (
              <details key={q} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-sm text-gray-900 select-none list-none">
                  <h3 className="font-semibold text-sm text-gray-900 m-0">{q}</h3>
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* Guías relacionadas */}
        {guiasRelacionadas.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Seguí leyendo</h2>
            <div className="space-y-3">
              {guiasRelacionadas.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guias/${g.slug}`}
                  className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all group"
                >
                  <Badge variant="gray" className="mt-0.5 flex-shrink-0">{g.categoria}</Badge>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 group-hover:text-[#E8002D] transition-colors leading-snug">
                      {g.titulo}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{g.tiempoLectura} min →</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
