'use client'

import { useState } from 'react'
import { prepagas } from '@/lib/data/prepagas'
import { formatPrecio } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'

// Orden fijo pedido por el asesor para las 6 que se ven de entrada.
const VISIBLE_ORDER = ['avalian', 'sancor-salud', 'premedic', 'galeno', 'osde', 'swiss-medical']
const visibles = VISIBLE_ORDER.map((slug) => prepagas.find((p) => p.slug === slug)).filter((p): p is (typeof prepagas)[number] => Boolean(p))
const ocultas = prepagas.filter((p) => !VISIBLE_ORDER.includes(p.slug)).sort((a, b) => b.satisfaccion - a.satisfaccion)

function PrepagaCotizarCard({ p, fuente }: { p: (typeof prepagas)[number]; fuente: string }) {
  const planEstrella = p.planes.find((pl) => pl.destacado) ?? [...p.planes].sort((a, b) => a.precio - b.precio)[0]
  const precioMin = Math.min(...p.planes.map((pl) => pl.precio))
  return (
    <div className="flex flex-col items-center text-center bg-white rounded-2xl border-2 border-amber-200 p-4">
      <span className="text-[9px] font-black px-2 py-0.5 rounded-full border mb-2"
        style={{ color: '#92400E', backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }}>
        ★ TRABAJAMOS CON ELLOS
      </span>
      <PrepagaLogo slug={p.slug} nombre={p.nombre} colorPrimario={p.colorPrimario} size="md" className="mb-2" />
      <div className="font-bold text-gray-900 text-sm leading-tight">{p.nombre}</div>
      <div className="text-xs text-gray-400 mt-0.5 mb-3">
        Desde <span className="font-semibold text-gray-600">{formatPrecio(precioMin)}</span>
      </div>
      <ContratarPlanButton
        prepagaNombre={p.nombre}
        planNombre={planEstrella.nombre}
        fuente={fuente}
        label="Cotizar"
        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#E8002D] hover:bg-[#B8001F] text-white rounded-lg text-xs font-bold transition-colors"
      />
    </div>
  )
}

interface Props {
  className?: string
  fuente?: string
}

// Grid de prepagas para cotizar directo (sin pasar por el wizard de
// zona/edades) — usado en /comparador y en el home, debajo del cotizador.
// Muestra 6 fijas de entrada; el resto queda detrás de "Ver más".
export function CotizarPorPrepaga({ className, fuente = 'cotizar-por-prepaga' }: Props) {
  const [verTodas, setVerTodas] = useState(false)

  return (
    <section className={className ?? 'bg-white border-t border-gray-100 py-12'}>
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cotizar por prepaga</h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            ¿Ya sabés cuál te interesa? Elegí la prepaga y dejá tus datos directamente, sin pasar por el comparador.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {visibles.map((p) => (
            <PrepagaCotizarCard key={p.slug} p={p} fuente={fuente} />
          ))}
        </div>

        {verTodas && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
            {ocultas.map((p) => (
              <PrepagaCotizarCard key={p.slug} p={p} fuente={fuente} />
            ))}
          </div>
        )}

        <div className="text-center mt-6">
          <button
            onClick={() => setVerTodas((v) => !v)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 border-2 border-gray-200 hover:border-red-200 text-gray-600 hover:text-[#E8002D] font-bold rounded-xl text-sm transition-colors"
          >
            {verTodas ? 'Ver menos' : `Ver ${ocultas.length} prepagas más`}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"
              className={`w-4 h-4 transition-transform ${verTodas ? 'rotate-180' : ''}`}>
              <path d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
