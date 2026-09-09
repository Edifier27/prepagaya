'use client'

import type { Plan, Prepaga } from '@/types'

interface Props {
  prepaga: Prepaga
  plan: Plan
  onClose: () => void
  onQuiero: () => void
  quieroDisabled?: boolean
  quieroLabel: string
}

export function PlanModal({ prepaga, plan, onClose, onQuiero, quieroDisabled, quieroLabel }: Props) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden max-h-[85vh] flex flex-col">
        <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] px-6 py-5 text-white flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-5 h-5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <div className="text-lg font-bold mb-0.5">{plan.nombre}</div>
          <p className="text-red-100 text-sm">{prepaga.nombre}</p>
        </div>

        <div className="p-6 overflow-y-auto">
          <p className="text-sm text-gray-600 leading-relaxed mb-4">{plan.descripcion}</p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
              plan.copago ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'
            }`}>
              {plan.copago ? 'Con copago' : 'Sin copago'}
            </span>
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
              plan.redAbierta ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'
            }`}>
              {plan.redAbierta ? 'Red abierta' : 'Red cerrada'}
            </span>
          </div>

          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Qué incluye este plan
          </p>
          <ul className="space-y-2 mb-6">
            {plan.cobertura.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-gray-700">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#00875A] flex-shrink-0 mt-0.5">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                {c}
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-gray-100 space-y-2.5">
            <button
              onClick={onQuiero}
              disabled={quieroDisabled}
              className="w-full py-3 bg-[#E8002D] hover:bg-[#B8001F] disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-colors"
            >
              {quieroLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
