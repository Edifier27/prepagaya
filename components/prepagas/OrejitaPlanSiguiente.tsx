'use client'

import { useState } from 'react'
import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'

// "Orejita" del plan siguiente (Darío, 4-oct-2026): en cada página de plan,
// una pestaña al costado (compu y celular) que dice qué suma el escalón de
// arriba: "¿Buscás reintegros y cobertura en el exterior? Pasá al SMG30".
// El texto lo arma el servidor con la tabla de diferencias (cuadro SSSalud,
// fichas oficiales, cartilla); acá solo se muestra.

export function OrejitaPlanSiguiente({
  plan,
  siguiente,
  mejoras,
  diferencia,
  href,
  hrefComparar,
  origen,
}: {
  /** Nombre corto del plan actual ("SMG02") */
  plan: string
  /** Nombre corto del plan siguiente ("SMG20") */
  siguiente: string
  /** Lo que suma el plan siguiente, ya redactado ("sin copago en consultas") */
  mejoras: string[]
  /** "$ 52.559 más por mes a los 30 años", si hay precio oficial */
  diferencia?: string
  href: string
  hrefComparar?: string
  origen: string
}) {
  const [abierta, setAbierta] = useState(false)
  const lista = mejoras.length > 1 ? `${mejoras.slice(0, -1).join(', ')} y ${mejoras[mejoras.length - 1]}` : mejoras[0]

  return (
    // Celular: arriba de la barra "Cotizá" y la navegación de abajo. Compu: a media altura.
    <div className="fixed right-0 z-30 bottom-[9.5rem] lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 flex items-end lg:items-center">
      {abierta ? (
        <div className="mr-3 w-[min(20rem,calc(100vw-2rem))] rounded-2xl bg-white border border-gray-200 shadow-2xl p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="text-[11px] font-bold uppercase tracking-wide text-[#E8002D]">Plan siguiente: {siguiente}</div>
            <button type="button" onClick={() => setAbierta(false)} aria-label="Cerrar" className="-mt-1 -mr-1 p-1 text-gray-400 hover:text-gray-700">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="w-4 h-4"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
          <p className="text-sm text-gray-800 leading-snug mt-1.5">
            ¿Buscás un plan con <strong>{lista}</strong>? Pasá del {plan} al <strong>{siguiente}</strong>.
          </p>
          {diferencia && <p className="text-xs text-gray-500 mt-1.5">{diferencia}.</p>}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
            <Link
              href={href}
              onClick={() => trackEvent('orejita_plan_click', { origen, destino: 'plan' })}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-[#E8002D] hover:bg-[#B8001F] text-white text-sm font-bold"
            >
              Ver el {siguiente} →
            </Link>
            {hrefComparar && (
              <Link
                href={hrefComparar}
                onClick={() => trackEvent('orejita_plan_click', { origen, destino: 'comparar' })}
                className="text-sm font-semibold text-gray-700 hover:text-[#E8002D] hover:underline"
              >
                Comparar los dos
              </Link>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => { setAbierta(true); trackEvent('orejita_plan_abrir', { origen }) }}
          className="flex items-center gap-1.5 rounded-l-xl bg-gray-900 hover:bg-[#E8002D] text-white pl-3 pr-2 py-2.5 shadow-lg transition-colors"
          aria-label={`Ver qué suma el plan ${siguiente}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="w-4 h-4"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
          <span className="text-left leading-tight">
            <span className="block text-[10px] text-gray-300">Plan siguiente</span>
            <span className="block text-sm font-bold">{siguiente}</span>
          </span>
        </button>
      )}
    </div>
  )
}
