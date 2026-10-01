'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { normalizarBusqueda } from '@/lib/busqueda'

export interface ItemBuscadorOS {
  slug: string
  nombre: string
  sub?: string
  keywords?: string[]
}

// Buscador instantáneo sobre las ~120 obras sociales del sitio (las fichas
// completas + las armadas con el registro de la SSSalud) — pedido de Darío,
// 1-oct-2026, para no obligar a scrollear toda la página para encontrar la
// tuya. Todo el listado por categoría sigue abajo igual que antes; esto es
// un atajo encima.

export function BuscadorObrasSociales({ items }: { items: ItemBuscadorOS[] }) {
  const [q, setQ] = useState('')
  const t = normalizarBusqueda(q.trim())

  const resultados = useMemo(() => {
    if (!t) return []
    return items
      .filter((it) => normalizarBusqueda(`${it.nombre} ${it.sub ?? ''} ${(it.keywords ?? []).join(' ')}`).includes(t))
      .slice(0, 10)
  }, [items, t])

  return (
    <div className="max-w-xl mx-auto text-left">
      <div className="relative">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
        </svg>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscá tu obra social: OSDE, OSECAC, IOMA, PAMI…"
          className="w-full pl-11 pr-4 py-3.5 text-base border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#E8002D] transition-colors bg-white shadow-sm"
        />
      </div>
      {t && (
        <div className="mt-3 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {resultados.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 text-center">No encontramos ninguna obra social con ese nombre.</div>
          ) : (
            resultados.map((it) => (
              <Link
                key={it.slug}
                href={`/obras-sociales/${it.slug}`}
                className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
              >
                <div className="font-semibold text-gray-900 text-sm">{it.nombre}</div>
                {it.sub && <div className="text-xs text-gray-500 mt-0.5">{it.sub}</div>}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}
