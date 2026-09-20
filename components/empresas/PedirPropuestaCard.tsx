'use client'

import { useState } from 'react'
import { PropuestaQuizPopup } from './PropuestaQuizPopup'

interface Props {
  prepagaContexto?: string
  titulo?: string
  subtitulo?: string
}

export function PedirPropuestaCard({ prepagaContexto, titulo, subtitulo }: Props = {}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="bg-white/[0.03] rounded-2xl border border-white/[0.08] p-8 sm:p-10 text-center">
        <div className="w-12 h-12 rounded-full bg-[#C7A046]/10 border border-[#C7A046]/30 flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="#C7A046" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-1.5">
          {titulo ?? '3 preguntas y te decimos qué comparar'}
        </h3>
        <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto leading-relaxed">
          {subtitulo ?? 'Contanos qué te importa más a vos y armamos una recomendación antes de pedirte tus datos.'}
        </p>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#C7A046] hover:bg-[#DDBB63] text-[#0A0B0D] font-bold rounded-lg text-sm transition-colors"
        >
          Empezar →
        </button>
        <p className="text-xs text-gray-600 mt-4">Menos de 1 minuto · Sin compromiso</p>
      </div>

      <PropuestaQuizPopup open={open} onClose={() => setOpen(false)} prepagaContexto={prepagaContexto} />
    </>
  )
}
