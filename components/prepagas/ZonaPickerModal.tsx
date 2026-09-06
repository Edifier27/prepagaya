'use client'

import { PROVINCIAS, type Provincia } from '@/components/comparador/ComparadorWizard'

interface Props {
  onSelect: (p: Provincia) => void
  onClose: () => void
}

// Selector de provincia compacto para usar fuera del wizard (ej. antes de
// abrir la cartilla de un plan cuando todavía no sabemos la zona del
// visitante). Reutiliza la misma lista de provincias que /comparador.
export function ZonaPickerModal({ onSelect, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden max-h-[85vh] flex flex-col">
        <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] px-6 py-5 text-white flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-5 h-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="text-lg font-bold mb-0.5">¿Desde dónde cotizás?</div>
          <p className="text-red-100 text-sm">La cartilla real cambia según tu provincia</p>
        </div>

        <div className="overflow-y-auto p-3">
          {PROVINCIAS.map((p) => (
            <button
              key={p.slug}
              onClick={() => onSelect(p)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl hover:bg-red-50 hover:text-[#E8002D] transition-colors text-sm font-medium text-gray-700"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-gray-300 flex-shrink-0">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="9" r="2.5" fill="currentColor" stroke="none" />
              </svg>
              {p.nombre}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
