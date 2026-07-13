'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { BlogPost } from '@/lib/data/blog'

interface Props {
  posts: BlogPost[]
  categorias: string[]
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5">
      <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3" strokeLinecap="round"/>
    </svg>
  )
}

const CATEGORIA_COLORS: Record<string, string> = {
  'Precios':      'bg-red-50 text-[#E8002D] border-red-100',
  'Mercado':      'bg-blue-50 text-blue-700 border-blue-100',
  'Guías':        'bg-green-50 text-green-700 border-green-100',
  'Comparativas': 'bg-purple-50 text-purple-700 border-purple-100',
  'Novedades':    'bg-amber-50 text-amber-700 border-amber-100',
}

function catClass(cat: string) {
  return CATEGORIA_COLORS[cat] ?? 'bg-gray-50 text-gray-700 border-gray-100'
}

export function BlogGrid({ posts, categorias }: Props) {
  const [activa, setActiva] = useState('Todos')

  const [destacado, ...resto] = posts
  const filtrados = activa === 'Todos' ? resto : resto.filter((p) => p.categoria === activa)

  const mostrarDestacado = activa === 'Todos' || destacado.categoria === activa

  return (
    <>
      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-8">
        {['Todos', ...categorias].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiva(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              activa === cat
                ? 'bg-[#E8002D] text-white border-[#E8002D]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-[#E8002D]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Destacado */}
      {mostrarDestacado && (
        <div className="mb-10">
          <Link
            href={`/blog/${destacado.slug}`}
            className="group block bg-gradient-to-br from-[#E8002D] to-[#8B0000] rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
          >
            <div className="p-8 md:p-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="inline-flex items-center px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full border border-white/30">
                  Destacado
                </span>
                <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${catClass(destacado.categoria)}`}>
                  {destacado.categoria}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:underline leading-snug max-w-3xl">
                {destacado.titulo}
              </h2>
              <p className="text-red-100 mb-6 max-w-2xl text-base leading-relaxed">
                {destacado.bajada}
              </p>
              <div className="flex items-center gap-5 text-sm text-red-200">
                <span>{new Date(destacado.fechaPublicacion).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className="flex items-center gap-1.5">
                  <ClockIcon />
                  {destacado.tiempoLectura} min de lectura
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Grid */}
      {filtrados.length === 0 ? (
        <p className="text-center text-gray-400 py-16">No hay artículos en esta categoría todavía.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrados.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-red-100 transition-all duration-200 flex flex-col"
            >
              {/* Color bar por categoría */}
              <div className={`h-1.5 w-full ${
                post.categoria === 'Precios' ? 'bg-[#E8002D]' :
                post.categoria === 'Mercado' ? 'bg-blue-500' :
                post.categoria === 'Guías' ? 'bg-green-500' :
                post.categoria === 'Comparativas' ? 'bg-purple-500' :
                'bg-amber-400'
              }`} />

              <div className="p-6 flex flex-col flex-1">
                <span className={`inline-flex self-start items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border mb-3 ${catClass(post.categoria)}`}>
                  {post.categoria}
                </span>
                <h2 className="font-bold text-gray-900 group-hover:text-[#E8002D] transition-colors mb-2 leading-snug text-base flex-1">
                  {post.titulo}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-2 mb-5 leading-relaxed">
                  {post.bajada}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
                  <span>{new Date(post.fechaPublicacion).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span className="flex items-center gap-1">
                    <ClockIcon />
                    {post.tiempoLectura} min
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
