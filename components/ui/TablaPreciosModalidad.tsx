'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatPrecio, precioDeriva } from '@/lib/utils'
import type { Prepaga } from '@/types'

const logoColors: Record<string, { bg: string; text: string }> = {
  'swiss-medical': { bg: '#FECDD3', text: '#9F1239' },
  osde: { bg: '#DBEAFE', text: '#1E3A8A' },
  cemic: { bg: '#DBEAFE', text: '#1E40AF' },
  'sancor-salud': { bg: '#FECDD3', text: '#9F1239' },
  premedic: { bg: '#DBEAFE', text: '#1E40AF' },
  medife: { bg: '#D1FAE5', text: '#065F46' },
  omint: { bg: '#DBEAFE', text: '#1E40AF' },
  medicus: { bg: '#EDE9FE', text: '#5B21B6' },
}

type Modalidad = 'directo' | 'deriva'

interface Props {
  prepagas: Prepaga[]
}

export function TablaPreciosModalidad({ prepagas }: Props) {
  const [modalidad, setModalidad] = useState<Modalidad>('directo')

  const displayPrice = (precio: number) =>
    modalidad === 'deriva' ? precioDeriva(precio) : precio

  return (
    <div>
      {/* Toggle modalidad */}
      <div className="flex items-center justify-center mb-6">
        <div className="inline-flex bg-gray-100 rounded-xl p-1 gap-1">
          <button
            onClick={() => setModalidad('directo')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              modalidad === 'directo'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Particular / Monotributista
            <span className="ml-1 text-gray-400 font-normal">(con IVA)</span>
          </button>
          <button
            onClick={() => setModalidad('deriva')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              modalidad === 'deriva'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Relación de dependencia
            <span className="ml-1 text-gray-400 font-normal">(sin IVA)</span>
          </button>
        </div>
      </div>

      {/* Chip informativo */}
      {modalidad === 'deriva' && (
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium px-4 py-2 rounded-full">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Lista Deriva Aporte — precios sin IVA (21% menos). Para empleados en relación de dependencia.
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
        {prepagas.map((p) => {
          const planBase = p.planes.find((pl) => pl.destacado) ?? p.planes[0]
          const initials = p.nombre.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
          const colors = logoColors[p.slug] ?? { bg: '#F3F4F6', text: '#374151' }
          const profAbbr =
            p.profesionales >= 100000
              ? `${(p.profesionales / 1000).toFixed(0)}k`
              : p.profesionales >= 10000
              ? `${(p.profesionales / 1000).toFixed(1)}k`
              : `${p.profesionales.toLocaleString('es-AR')}`

          return (
            <div key={p.slug} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
              {/* Logo */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: colors.bg, color: colors.text }}
              >
                {initials}
              </div>

              {/* Nombre */}
              <div className="w-36 flex-shrink-0">
                <div className="font-semibold text-gray-900 text-sm leading-tight">{p.nombre}</div>
                <div className="text-xs text-gray-400">{planBase.nombre}</div>
                {planBase.destacado && (
                  <span className="inline-block mt-1 text-[10px] font-bold text-[#E8002D] bg-red-50 border border-red-100 px-2 py-0.5 rounded-full leading-none">
                    Mejor relación P/C
                  </span>
                )}
              </div>

              {/* Precio */}
              <div className="w-40 flex-shrink-0 hidden sm:block">
                <div className="text-[#E8002D] font-bold text-sm">
                  {formatPrecio(displayPrice(planBase.precio))}
                  <span className="text-gray-400 font-normal text-xs">/mes</span>
                </div>
                <div className="text-xs text-gray-400">
                  desde · {modalidad === 'deriva' ? 'sin IVA' : 'con IVA 21%'}
                </div>
              </div>

              {/* Barra satisfacción */}
              <div className="flex-1 min-w-0 hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5 max-w-[120px]">
                    <div
                      className="h-1.5 rounded-full bg-[#E8002D]"
                      style={{ width: `${p.satisfaccion}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0">{p.satisfaccion}% satisf.</span>
                </div>
              </div>

              {/* Profesionales */}
              <div className="w-20 flex-shrink-0 hidden lg:block text-right">
                <div className="text-xs text-gray-500">{profAbbr} prof.</div>
              </div>

              {/* CTA */}
              <div className="flex-shrink-0 ml-auto">
                <Link
                  href={`/prepagas/${p.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#E8002D] hover:text-[#B8001F] border border-[#E8002D] hover:border-[#B8001F] px-3 py-1.5 rounded-lg transition-colors"
                >
                  Ver planes
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M4 8a.5.5 0 01.5-.5h5.793L8.146 5.354a.5.5 0 11.708-.708l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L10.293 8.5H4.5A.5.5 0 014 8z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
