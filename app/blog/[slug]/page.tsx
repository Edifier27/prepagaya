import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { blogPosts } from '@/lib/data/blog'
import { prepagas } from '@/lib/data/prepagas'
import { coberturas } from '@/lib/data/coberturas'
import { condiciones } from '@/lib/data/condiciones'
import { formatPrecio, SITE_NAME, SITE_URL } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { BlogAuthorBox } from '@/components/ui/BlogAuthorBox'
import { CoberturaIcon } from '@/components/ui/CategoryIcon'
import { BlogTOC } from '@/components/blog/BlogTOC'
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
  return blogPosts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return {}
  return {
    title: post.titulo,
    description: post.metaDescripcion,
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
    openGraph: {
      title: post.titulo,
      description: post.metaDescripcion,
      type: 'article',
      publishedTime: post.fechaPublicacion,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) notFound()

  const prepagasRelacionadas = (post.prepagasRelacionadas ?? [])
    .map((s) => prepagas.find((p) => p.slug === s))
    .filter(Boolean)

  const mismaCat = blogPosts.filter((p) => p.slug !== slug && p.categoria === post.categoria)
  const otrosPost = blogPosts.filter((p) => p.slug !== slug && p.categoria !== post.categoria)
  const articulosRelacionados = [...mismaCat, ...otrosPost].slice(0, 3)

  const postTokens = new Set([
    slug, post.categoria.toLowerCase(),
    ...(post.keywords ?? []).map((k) => k.toLowerCase()),
  ])
  const coberturasRelacionadas = coberturas
    .filter((c) => c.keywords.some((k) => postTokens.has(k.toLowerCase())) || postTokens.has(c.slug))
    .slice(0, 3)
  const coberturasParaMostrar = coberturasRelacionadas.length >= 2
    ? coberturasRelacionadas
    : coberturas.slice(0, 3)
  const condicionesRelacionadas = condiciones
    .filter((c) => (c.keywords ?? []).some((k) => postTokens.has(k.toLowerCase())))
    .slice(0, 2)

  // TOC sections
  const tocSections = [
    ...post.contenido.secciones.map((s) => ({
      id: slugifyId(s.titulo),
      titulo: s.titulo,
    })),
    { id: 'conclusion', titulo: 'Conclusión', isConclusion: true },
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.titulo,
      description: post.metaDescripcion,
      url: `${SITE_URL}/blog/${slug}`,
      datePublished: post.fechaPublicacion,
      dateModified: post.fechaPublicacion,
      author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${slug}` },
      inLanguage: 'es-AR',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: post.titulo },
      ],
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <StickySectionNav items={tocSections.map((s) => ({ id: s.id, label: s.titulo }))} />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-[#E8002D] transition-colors">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <Link href="/blog" className="hover:text-[#E8002D] transition-colors">Blog</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700 truncate max-w-xs">{post.titulo}</span>
          </nav>
        </div>
      </div>

      <div className="container py-10">
        {/* Layout: artículo + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10 max-w-5xl mx-auto">

          {/* ── Columna principal ── */}
          <div className="min-w-0">

            {/* Header */}
            <header className="mb-8">
              <Badge variant="gray" className="mb-4">{post.categoria}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {post.titulo}
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed mb-4">{post.bajada}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 pb-6 border-b border-gray-100">
                <span>{new Date(post.fechaPublicacion).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className="flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5">
                    <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3" strokeLinecap="round"/>
                  </svg>
                  {post.tiempoLectura} min de lectura
                </span>
                <span>{SITE_NAME}</span>
              </div>
            </header>

            <BlogAuthorBox fechaPublicacion={post.fechaPublicacion} />

            {/* TOC mobile (solo < lg) */}
            <div className="lg:hidden mb-8 bg-gray-50 rounded-2xl border border-gray-200 p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">En este artículo</p>
              <ul className="space-y-2">
                {tocSections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#E8002D] transition-colors"
                    >
                      <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500 flex-shrink-0">
                        {'isConclusion' in s ? '✓' : i + 1}
                      </span>
                      {s.titulo}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Intro */}
            <div className="bg-red-50 border-l-4 border-[#E8002D] rounded-r-xl p-5 mb-8">
              <p className="text-gray-800 leading-relaxed">{post.contenido.intro}</p>
            </div>

            {/* Secciones */}
            <article className="space-y-10 mb-10">
              {post.contenido.secciones.map((seccion, i) => (
                <section key={i} id={slugifyId(seccion.titulo)} className="scroll-mt-28">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-[11px] font-bold text-[#E8002D] flex-shrink-0">
                      {i + 1}
                    </span>
                    {seccion.titulo}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">{seccion.cuerpo}</p>
                </section>
              ))}

              {/* Conclusión */}
              <div id="conclusion" className="scroll-mt-28 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-[11px] font-bold text-green-600">✓</span>
                  Conclusión
                </h2>
                <p className="text-gray-600 leading-relaxed">{post.contenido.conclusion}</p>
              </div>
            </article>

            {/* Prepagas relacionadas */}
            {prepagasRelacionadas.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Prepagas mencionadas en este artículo</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prepagasRelacionadas.map((p) => {
                    if (!p) return null
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
                          <div className="text-sm font-bold text-[#E8002D]">desde {formatPrecio(planBase.precio)}</div>
                          <div className="text-xs text-gray-400">/mes</div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] rounded-2xl p-7 text-white text-center mb-10">
              <h2 className="text-xl font-bold mb-2">¿Querés comparar prepagas?</h2>
              <p className="text-red-100 text-sm mb-5">Usá nuestro comparador gratuito y encontrá la mejor opción para vos.</p>
              <Link
                href="/comparador"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#E8002D] font-bold rounded-xl text-sm hover:bg-red-50 transition-colors"
              >
                Comparar prepagas →
              </Link>
            </div>

            {/* Coberturas y condiciones */}
            <section className="mb-10">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Guías de cobertura relacionadas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                {coberturasParaMostrar.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/coberturas/${c.slug}`}
                    className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all group"
                  >
                    <CoberturaIcon slug={c.slug} size="sm" />
                    <span className="text-xs font-medium text-gray-700 group-hover:text-[#E8002D] leading-tight">{c.nombre}</span>
                  </Link>
                ))}
              </div>
              {condicionesRelacionadas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {condicionesRelacionadas.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/condiciones/${c.slug}`}
                      className="text-xs px-3 py-1.5 bg-green-50 text-green-700 border border-green-100 rounded-full hover:bg-green-100 transition-colors font-medium"
                    >
                      {c.nombre} →
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Artículos relacionados */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Seguí leyendo</h2>
              <div className="space-y-3">
                {articulosRelacionados.map((art) => (
                  <Link
                    key={art.slug}
                    href={`/blog/${art.slug}`}
                    className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all group"
                  >
                    <Badge variant="gray" className="mt-0.5 flex-shrink-0">{art.categoria}</Badge>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 group-hover:text-[#E8002D] transition-colors leading-snug">
                        {art.titulo}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{art.tiempoLectura} min →</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* ── Sidebar TOC (solo desktop) ── */}
          <div className="hidden lg:block">
            <BlogTOC sections={tocSections} />
          </div>

        </div>
      </div>
    </>
  )
}
