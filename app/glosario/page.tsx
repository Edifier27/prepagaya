'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { terminos, categoriasGlosario } from '@/lib/data/glosario'
import { BreadcrumbSchema } from '@/components/ui/BreadcrumbSchema'
import type { CategoriaGlosario } from '@/lib/data/glosario'

const CAT_COLORS: Record<string, string> = {
  'Costos':       'bg-red-50 text-[#E8002D] border-red-100',
  'Cobertura':    'bg-blue-50 text-blue-700 border-blue-100',
  'Contratación': 'bg-green-50 text-green-700 border-green-100',
  'Legal':        'bg-purple-50 text-purple-700 border-purple-100',
  'Tipos':        'bg-amber-50 text-amber-700 border-amber-100',
}

const CAT_DOT: Record<string, string> = {
  'Costos':       'bg-[#E8002D]',
  'Cobertura':    'bg-blue-500',
  'Contratación': 'bg-green-500',
  'Legal':        'bg-purple-500',
  'Tipos':        'bg-amber-400',
}

export default function GlosarioPage(): React.ReactElement {
  const [activa, setActiva] = useState<CategoriaGlosario | 'Todos'>('Todos')
  const [busqueda, setBusqueda] = useState('')

  const filtrados = useMemo(() => {
    return terminos.filter((t) => {
      const matchCat = activa === 'Todos' || t.categoria === activa
      const matchBusq = busqueda === '' ||
        t.termino.toLowerCase().includes(busqueda.toLowerCase()) ||
        t.definicion.toLowerCase().includes(busqueda.toLowerCase())
      return matchCat && matchBusq
    }).sort((a, b) => a.termino.localeCompare(b.termino))
  }, [activa, busqueda])

  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-10">
        <div className="container max-w-4xl mx-auto">
          <BreadcrumbSchema crumbs={[{ label: 'Blog', href: '/blog' }, { label: 'Glosario de prepagas' }]} />
          <div className="mt-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Glosario de prepagas
            </h1>
            <p className="text-gray-500 max-w-xl">
              Todos los términos del sistema de salud privado argentino explicados en lenguaje claro. Filtrá por tema o buscá el que necesitás.
            </p>
          </div>
        </div>
      </section>

      <div className="container max-w-4xl mx-auto py-10">

        {/* Buscador */}
        <div className="relative mb-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
            className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar término... (ej: copago, carencia, PMO)"
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E8002D] transition-colors"
          />
          {busqueda && (
            <button onClick={() => setBusqueda('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              ✕
            </button>
          )}
        </div>

        {/* Filtros por categoría */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiva('Todos')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              activa === 'Todos'
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            Todos ({terminos.length})
          </button>
          {categoriasGlosario.map((cat) => {
            const count = terminos.filter((t) => t.categoria === cat).length
            return (
              <button
                key={cat}
                onClick={() => setActiva(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all flex items-center gap-1.5 ${
                  activa === cat
                    ? CAT_COLORS[cat] + ' font-bold'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${CAT_DOT[cat]}`} />
                {cat} ({count})
              </button>
            )
          })}
        </div>

        {/* Contador */}
        <p className="text-sm text-gray-400 mb-5">
          {filtrados.length} término{filtrados.length !== 1 ? 's' : ''}
          {activa !== 'Todos' && ` en ${activa}`}
          {busqueda && ` · búsqueda: "${busqueda}"`}
        </p>

        {/* Términos */}
        {filtrados.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-semibold mb-1">Sin resultados</p>
            <p className="text-sm">Probá con otro término o categoría.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtrados.map((t) => (
              <div
                key={t.termino}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="font-bold text-gray-900 text-lg leading-snug">{t.termino}</h2>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full border flex-shrink-0 mt-0.5 ${CAT_COLORS[t.categoria]}`}>
                    {t.categoria}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{t.definicion}</p>
                {t.ejemplo && (
                  <div className="mt-3 flex items-start gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 mt-0.5 flex-shrink-0">Ej:</span>
                    <p className="text-xs text-gray-500 leading-relaxed">{t.ejemplo}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-[#E8002D] to-[#B8001F] rounded-2xl p-6 text-white text-center">
          <p className="font-bold text-lg mb-2">¿Querés comparar planes con estos conceptos claros?</p>
          <p className="text-red-100 text-sm mb-4">Usá el cotizador para ver precios reales según tu edad y zona.</p>
          <Link
            href="/comparador"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#E8002D] font-bold rounded-xl text-sm hover:bg-red-50 transition-colors"
          >
            Comparar planes →
          </Link>
        </div>
      </div>
    </>
  )
}
