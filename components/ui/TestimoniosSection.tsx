'use client'

import { useState } from 'react'
import type { Testimonio } from '@/lib/data/testimonios'

interface Props {
  testimonios: Testimonio[]
  prepagaNombre: string
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} viewBox="0 0 20 20" fill="currentColor"
          className={`w-3.5 h-3.5 ${s <= rating ? 'text-amber-400' : 'text-gray-200'}`}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  )
}

export function TestimoniosSection({ testimonios, prepagaNombre }: Props) {
  const [visible, setVisible] = useState(3)
  const [filterRating, setFilterRating] = useState<number | null>(null)

  const filtered = filterRating
    ? testimonios.filter((t) => t.rating === filterRating)
    : testimonios

  const shown = filtered.slice(0, visible)
  const avgRating = (testimonios.reduce((s, t) => s + t.rating, 0) / testimonios.length).toFixed(1)
  const pct5 = Math.round((testimonios.filter((t) => t.rating === 5).length / testimonios.length) * 100)

  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="container max-w-4xl mx-auto">

        {/* Header con stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Opiniones de afiliados a {prepagaNombre}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {testimonios.length} opiniones verificadas
            </p>
          </div>
          <div className="flex items-center gap-4 bg-gray-50 rounded-2xl px-5 py-4 border border-gray-100">
            <div className="text-center">
              <div className="text-3xl font-black text-gray-900">{avgRating}</div>
              <StarRow rating={Math.round(parseFloat(avgRating))} />
              <div className="text-xs text-gray-400 mt-1">promedio</div>
            </div>
            <div className="h-12 w-px bg-gray-200" />
            <div className="text-center">
              <div className="text-3xl font-black text-[#00875A]">{pct5}%</div>
              <div className="text-xs text-gray-500 mt-1">5 estrellas</div>
            </div>
          </div>
        </div>

        {/* Filtro por stars */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-xs font-semibold text-gray-500">Filtrar:</span>
          <button
            onClick={() => { setFilterRating(null); setVisible(3) }}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-colors ${
              !filterRating ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            Todas
          </button>
          {[5, 4, 3].map((r) => (
            <button
              key={r}
              onClick={() => { setFilterRating(r === filterRating ? null : r); setVisible(3) }}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-colors flex items-center gap-1 ${
                filterRating === r ? 'bg-amber-400 text-white border-amber-400' : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300'
              }`}
            >
              {r}
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-current">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {shown.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-8">No hay opiniones con ese filtro.</p>
          )}
          {shown.map((t) => (
            <div key={t.id} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {t.nombre[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.nombre}</div>
                    <div className="text-xs text-gray-400">{t.ciudad} · {t.fecha}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StarRow rating={t.rating} />
                  {t.planNombre && (
                    <span className="text-xs bg-red-50 text-[#E8002D] font-semibold px-2 py-0.5 rounded-full border border-red-100">
                      {t.planNombre}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">&ldquo;{t.texto}&rdquo;</p>
              {t.ahorro && (
                <div className="mt-3 inline-flex items-center gap-1.5 bg-green-50 border border-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Ahorra {t.ahorro}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Ver más */}
        {filtered.length > visible && (
          <div className="text-center mt-6">
            <button
              onClick={() => setVisible((v) => v + 5)}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-[#E8002D] hover:text-[#E8002D] transition-colors"
            >
              Cargar más opiniones ({filtered.length - visible} restantes)
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path d="M19 9l-7 7-7-7" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
