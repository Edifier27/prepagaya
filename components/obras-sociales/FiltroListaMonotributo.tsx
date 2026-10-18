'use client'

import { useState } from 'react'
import { normalizarBusqueda } from '@/lib/busqueda'

// Buscador de la lista de obras sociales que aceptan monotributistas
// (/obras-sociales/monotributo). La lista la arma el servidor, así Google la lee
// completa; acá solo se esconden las filas que no coinciden con lo escrito
// (nombre, código o ciudad de la sede).
export function FiltroListaMonotributo({ total }: { total: number }) {
  const [visibles, setVisibles] = useState(total)

  function filtrar(valor: string) {
    const terminos = normalizarBusqueda(valor).replace(/-/g, '').split(/\s+/).filter(Boolean)
    const filas = document.querySelectorAll<HTMLElement>('#lista-os-monotributo tr[data-q]')
    let n = 0
    filas.forEach((fila) => {
      if (!fila.dataset.qn) fila.dataset.qn = normalizarBusqueda(fila.dataset.q ?? '').replace(/-/g, '')
      const ok = terminos.every((t) => fila.dataset.qn!.includes(t))
      fila.hidden = !ok
      if (ok) n++
    })
    setVisibles(n)
  }

  return (
    <div className="mb-3">
      <label htmlFor="buscar-os-monotributo" className="sr-only">Buscar obra social por nombre, código o ciudad</label>
      <input
        id="buscar-os-monotributo"
        type="search"
        onChange={(e) => filtrar(e.target.value)}
        placeholder="Buscá por nombre, código o ciudad (ej. Córdoba)"
        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8002D]/30 focus:border-[#E8002D]"
        autoComplete="off"
      />
      <p className="text-xs text-gray-500 mt-1" aria-live="polite">
        {visibles === total ? `${total} obras sociales` : visibles === 0 ? 'Ninguna coincide con lo que escribiste.' : `${visibles} de ${total}`}
      </p>
    </div>
  )
}
