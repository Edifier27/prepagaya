'use client'

import { useState } from 'react'
import { normalizarBusqueda } from '@/lib/busqueda'

// Buscador de la cartilla de centros de OSECAC (/obras-sociales/osecac/cartilla).
// La lista completa la arma el servidor (así Google lee todos los centros); acá
// solo se esconden los que no coinciden con la provincia elegida y con lo escrito
// (nombre, dirección, teléfono o especialidad). Sin geolocalización a propósito:
// cambiar la lista después de cargar movería la página (CLS).
export function FiltroCentrosOsecac({ provincias, total }: { provincias: { slug: string; nombre: string; cantidad: number }[]; total: number }) {
  const [visibles, setVisibles] = useState(total)
  const [prov, setProv] = useState('')
  const [texto, setTexto] = useState('')

  function aplicar(nuevaProv: string, nuevoTexto: string) {
    const terminos = normalizarBusqueda(nuevoTexto).replace(/-/g, ' ').split(/\s+/).filter(Boolean)
    let n = 0
    document.querySelectorAll<HTMLElement>('#centros-osecac [data-centro]').forEach((el) => {
      if (!el.dataset.qn) el.dataset.qn = normalizarBusqueda(el.dataset.q ?? '').replace(/-/g, ' ')
      const ok = (!nuevaProv || el.dataset.prov === nuevaProv) && terminos.every((t) => el.dataset.qn!.includes(t))
      el.hidden = !ok
      if (ok) n++
    })
    document.querySelectorAll<HTMLElement>('#centros-osecac [data-grupo]').forEach((g) => {
      g.hidden = !g.querySelector('[data-centro]:not([hidden])')
    })
    setVisibles(n)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="centros-provincia" className="block text-sm font-semibold text-gray-900 mb-1.5">Provincia</label>
          <select
            id="centros-provincia"
            value={prov}
            onChange={(e) => { setProv(e.target.value); aplicar(e.target.value, texto) }}
            className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#E8002D] transition-colors bg-white"
          >
            <option value="">Todo el país ({total})</option>
            {provincias.map((p) => (
              <option key={p.slug} value={p.slug}>{p.nombre} ({p.cantidad})</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="centros-texto" className="block text-sm font-semibold text-gray-900 mb-1.5">Localidad, calle o especialidad</label>
          <input
            id="centros-texto"
            type="search"
            value={texto}
            onChange={(e) => { setTexto(e.target.value); aplicar(prov, e.target.value) }}
            placeholder="Ej: Lanús, Pediatría, Cardiología…"
            autoComplete="off"
            className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#E8002D] transition-colors bg-white"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-3" aria-live="polite">
        {visibles === total ? `${total} centros de atención` : visibles === 0 ? 'Ningún centro coincide con lo que buscaste.' : `${visibles} de ${total} centros`}
      </p>
    </div>
  )
}
