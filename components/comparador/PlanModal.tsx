'use client'

import { whatsappLink } from '@/lib/utils'
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
  const wa = whatsappLink(`Hola! Quiero asesoramiento sobre el plan ${plan.nombre} de ${prepaga.nombre}.`)

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
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] text-sm font-bold rounded-xl transition-colors border border-[#25D366]/30"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39c1.45.79 3.08 1.21 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.51 2 12.04 2zm5.83 14.07c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.1.11-1.77-.11-.41-.13-.93-.3-1.6-.58-2.83-1.22-4.67-4.06-4.81-4.25-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.35.26-.28.56-.35.75-.35.19 0 .37 0 .53.01.17.01.4-.06.62.48.24.58.81 2 .88 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.17-.29.37-.42.5-.14.13-.29.28-.12.56.16.28.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.19-.28.37-.23.62-.14.26.09 1.62.77 1.9.91.28.14.46.21.53.33.07.12.07.68-.17 1.36z"/>
              </svg>
              Hablar con un asesor ahora
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
