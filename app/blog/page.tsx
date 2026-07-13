import type { Metadata } from 'next'
import { blogPosts } from '@/lib/data/blog'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { BreadcrumbSchema } from '@/components/ui/BreadcrumbSchema'
import { BlogGrid } from '@/components/blog/BlogGrid'
import Link from 'next/link'

export const metadata: Metadata = {
  title: `Blog de Prepagas Argentina — Guías, Análisis y Precios ${new Date().getFullYear()}`,
  description: 'Artículos sobre prepagas en Argentina: análisis de planes, comparativas, noticias del mercado y guías para elegir mejor tu cobertura médica.',
  alternates: { canonical: `${SITE_URL}/blog` },
}

export default function BlogPage(): React.ReactElement {
  const categorias = [...new Set(blogPosts.map((p) => p.categoria))]

  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-10">
        <div className="container">
          <BreadcrumbSchema crumbs={[{ label: 'Blog' }]} />
          <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Blog de prepagas
              </h1>
              <p className="text-gray-500 max-w-xl">
                Análisis, comparativas y guías actualizadas para elegir la mejor cobertura médica en Argentina.
              </p>
            </div>
            <Link
              href="/glosario"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-xl text-sm font-semibold text-gray-700 hover:text-[#E8002D] transition-all self-start md:self-auto"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
                <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Glosario de prepagas
            </Link>
          </div>
        </div>
      </section>

      {/* Contenido */}
      <div className="container py-10">
        <BlogGrid posts={blogPosts} categorias={categorias} />
      </div>
    </>
  )
}
