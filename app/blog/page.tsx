import type { Metadata } from 'next'
import Link from 'next/link'
import { blogPosts } from '@/lib/data/blog'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

export const metadata: Metadata = {
  title: `Blog de Prepagas Argentina — Guías, Análisis y Precios ${new Date().getFullYear()}`,
  description: 'Artículos sobre prepagas en Argentina: análisis de planes, comparativas, noticias del mercado y guías para elegir mejor tu cobertura médica.',
  alternates: { canonical: `${SITE_URL}/blog` },
}

export default function BlogPage() {
  const categorias = [...new Set(blogPosts.map((p) => p.categoria))]
  const [destacado, ...resto] = blogPosts

  return (
    <>
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 border-b border-gray-200">
        <div className="container">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#E8002D]">{SITE_NAME}</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Blog</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Blog de Prepagas Argentina
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Análisis, comparativas y guías sobre el mercado de prepagas en Argentina. Información actualizada para que tomes la mejor decisión.
          </p>
        </div>
      </section>

      <div className="container py-12">
        {/* Artículo destacado */}
        <div className="mb-12">
          <Link
            href={`/blog/${destacado.slug}`}
            className="block bg-gradient-to-r from-[#E8002D] to-[#B8001F] rounded-2xl p-8 text-white hover:shadow-xl transition-all group"
          >
            <Badge className="bg-white/20 text-white border border-white/30 mb-4">
              {destacado.categoria}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:underline">
              {destacado.titulo}
            </h2>
            <p className="text-blue-100 mb-4 max-w-2xl">{destacado.bajada}</p>
            <div className="flex items-center gap-4 text-sm text-blue-200">
              <span>{new Date(destacado.fechaPublicacion).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span>{destacado.tiempoLectura} min de lectura</span>
            </div>
          </Link>
        </div>

        {/* Grid de artículos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resto.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-red-200 transition-all group"
            >
              <div className="p-6">
                <Badge variant="gray" className="mb-3">{post.categoria}</Badge>
                <h2 className="font-bold text-gray-900 group-hover:text-[#E8002D] transition-colors mb-2 leading-snug">
                  {post.titulo}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.bajada}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
                  <span>{new Date(post.fechaPublicacion).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}</span>
                  <span>{post.tiempoLectura} min</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
