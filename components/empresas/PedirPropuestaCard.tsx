'use client'

import { useState } from 'react'
import { PropuestaQuizPopup } from './PropuestaQuizPopup'

interface Props {
  prepagaContexto?: string
  titulo?: string
  subtitulo?: string
  /** 'dark' para el silo negro/dorado de /empresas, 'light' para páginas que todavía usan el fondo claro del sitio (OSDE, Plan Black, vs. OSDE). */
  variant?: 'dark' | 'light'
}

export function PedirPropuestaCard({ prepagaContexto, titulo, subtitulo, variant = 'dark' }: Props = {}) {
  const [open, setOpen] = useState(false)
  const isLight = variant === 'light'

  return (
    <>
      <div
        className={
          isLight
            ? 'bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sm:p-10 text-center'
            : 'bg-white/[0.03] rounded-2xl border border-white/[0.08] p-8 sm:p-10 text-center'
        }
      >
        <div
          className={
            isLight
              ? 'w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4'
              : 'w-12 h-12 rounded-full bg-[#C7A046]/10 border border-[#C7A046]/30 flex items-center justify-center mx-auto mb-4'
          }
        >
          <svg viewBox="0 0 24 24" fill="none" stroke={isLight ? '#E8002D' : '#C7A046'} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        </div>
        <h3 className={isLight ? 'text-lg font-semibold text-gray-900 mb-1.5' : 'text-lg font-semibold text-white mb-1.5'}>
          {titulo ?? '3 preguntas y te decimos qué comparar'}
        </h3>
        <p className={isLight ? 'text-sm text-gray-500 mb-6 max-w-sm mx-auto leading-relaxed' : 'text-sm text-gray-500 mb-6 max-w-sm mx-auto leading-relaxed'}>
          {subtitulo ?? 'Contanos qué te importa más a vos y armamos una recomendación antes de pedirte tus datos.'}
        </p>
        <button
          onClick={() => setOpen(true)}
          className={
            isLight
              ? 'inline-flex items-center gap-2 px-7 py-3.5 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-lg text-sm transition-colors'
              : 'inline-flex items-center gap-2 px-7 py-3.5 bg-[#C7A046] hover:bg-[#DDBB63] text-[#0A0B0D] font-bold rounded-lg text-sm transition-colors'
          }
        >
          Empezar →
        </button>
        <p className={isLight ? 'text-xs text-gray-400 mt-4' : 'text-xs text-gray-600 mt-4'}>Menos de 1 minuto · Sin compromiso</p>
      </div>

      <PropuestaQuizPopup open={open} onClose={() => setOpen(false)} prepagaContexto={prepagaContexto} />
    </>
  )
}
