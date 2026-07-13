'use client'

import { useState } from 'react'
import Link from 'next/link'
import { buscarSanatorio } from '@/lib/data/sanatorios'
import { formatPrecio } from '@/lib/utils'
import type { Sanatorio } from '@/lib/data/sanatorios'

export function BuscadorSanatorio(): React.ReactElement {
  const [query, setQuery] = useState('')
  const [resultados, setResultados] = useState<Sanatorio[]>([])
  const [buscado, setBuscado] = useState(false)

  const handleSearch = (val: string) => {
    setQuery(val)
    setBuscado(val.length >= 2)
    setResultados(val.length >= 2 ? buscarSanatorio(val) : [])
  }

  return (
    <div>
      {/* Input de búsqueda */}
      <div className="relative max-w-xl mx-auto">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={1.5} strokeLinecap="round" className="w-5 h-5">
            <path d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z"/>
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Escribí el nombre del sanatorio u hospital..."
          className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#E8002D] transition-colors shadow-sm"
        />
        {query && (
          <button
            onClick={() => handleSearch('')}
            className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-4 h-4">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      {/* Sugerencias rápidas */}
      {!buscado && (
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {['Hospital Italiano', 'Hospital Alemán', 'FLENI', 'Favaloro', 'Mater Dei', 'Bazterrica'].map((sug) => (
            <button
              key={sug}
              onClick={() => handleSearch(sug)}
              className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-red-50 hover:text-[#E8002D] text-gray-600 rounded-full border border-gray-200 hover:border-red-200 transition-colors"
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* Sin resultados */}
      {buscado && resultados.length === 0 && (
        <div className="mt-8 text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="text-gray-400 text-sm mb-1">No encontramos "{query}" en nuestra base de datos.</div>
          <p className="text-xs text-gray-400">Probá con otro nombre o consultá directamente la cartilla de cada prepaga.</p>
        </div>
      )}

      {/* Resultados */}
      {resultados.length > 0 && (
        <div className="mt-8 space-y-6">
          {resultados.map((san) => (
            <div key={san.slug} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              {/* Header del sanatorio */}
              <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] px-6 py-4 text-white">
                <div className="font-bold text-lg">{san.nombre}</div>
                <div className="text-red-200 text-xs mt-0.5">
                  {san.zonas.map((z) => z === 'caba' ? 'CABA' : z === 'gba' ? 'GBA' : z.charAt(0).toUpperCase() + z.slice(1)).join(' · ')}
                  {' · '}
                  {san.planesQueLoCubren.length} plan{san.planesQueLoCubren.length !== 1 ? 'es' : ''} lo cubren
                </div>
              </div>

              {/* Planes que lo cubren */}
              <div className="divide-y divide-gray-50">
                {san.planesQueLoCubren
                  .sort((a, b) => a.precio - b.precio)
                  .map((plan) => (
                    <div key={`${plan.prepagaSlug}-${plan.planSlug}`} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                      {/* Iniciales prepaga */}
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 bg-gray-100 text-gray-600">
                        {plan.prepagaNombre.split(' ').slice(0, 2).map((w) => w[0]).join('')}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-sm">{plan.prepagaNombre}</div>
                        <div className="text-xs text-gray-500">{plan.planNombre}</div>
                        {plan.nota && (
                          <div className="text-xs text-amber-600 mt-0.5 font-medium">{plan.nota}</div>
                        )}
                      </div>

                      {/* Precio */}
                      <div className="text-right flex-shrink-0">
                        <div className="font-bold text-[#E8002D] text-sm">{formatPrecio(plan.precio)}</div>
                        <div className="text-xs text-gray-400">/mes · 30 años</div>
                      </div>

                      {/* CTA */}
                      <Link
                        href={`/prepagas/${plan.prepagaSlug}/${plan.planSlug}`}
                        className="flex-shrink-0 text-xs font-semibold text-[#E8002D] hover:text-[#B8001F] border border-[#E8002D] hover:border-[#B8001F] px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Ver plan
                      </Link>
                    </div>
                  ))}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  El plan más económico que cubre {san.nombre} es{' '}
                  <span className="font-semibold text-gray-600">
                    {san.planesQueLoCubren.sort((a, b) => a.precio - b.precio)[0].prepagaNombre}{' '}
                    {san.planesQueLoCubren.sort((a, b) => a.precio - b.precio)[0].planNombre}
                  </span>{' '}
                  a{' '}
                  <span className="font-semibold text-[#E8002D]">
                    {formatPrecio(Math.min(...san.planesQueLoCubren.map((p) => p.precio)))}
                  </span>
                  /mes.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
