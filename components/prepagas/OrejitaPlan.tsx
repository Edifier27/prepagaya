'use client'

import { useState } from 'react'
import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'

// Orejitas de navegación entre planes (Darío, 4-oct-2026): en cada página de
// plan, a la derecha el plan siguiente ("¿buscás más cobertura?") y a la
// izquierda el anterior ("¿buscás pagar menos?"), en compu y celular. El
// texto lo arma el servidor con datos con fuente (ver orejitasPlan en
// app/prepagas/[slug]/[plan]/page.tsx); acá solo se muestra.

export interface OrejitaDatos {
  lado: 'derecha' | 'izquierda'
  /** "Plan siguiente", "Plan con copago", "Más económico" */
  etiqueta: string
  /** Nombre corto del plan de destino ("SMG30") */
  destino: string
  /** Texto con **negritas** */
  texto: string
  nota?: string
  href: string
  hrefComparar?: string
  origen: string
}

/** "**algo**" → <strong> */
function ConNegritas({ texto }: { texto: string }) {
  return <>{texto.split(/\*\*(.+?)\*\*/g).map((t, i) => (i % 2 ? <strong key={i}>{t}</strong> : t))}</>
}

export function OrejitaPlan({ lado, etiqueta, destino, texto, nota, href, hrefComparar, origen }: OrejitaDatos) {
  const [abierta, setAbierta] = useState(false)
  const der = lado === 'derecha'

  return (
    // Celular: arriba de la barra "Cotizá" y la navegación de abajo. Compu: a media altura.
    <div
      className={`fixed z-30 bottom-[9.5rem] lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 flex items-end lg:items-center ${der ? 'right-0' : 'left-0'}`}
    >
      {abierta ? (
        <div className={`${der ? 'mr-3' : 'ml-3'} w-[min(20rem,calc(100vw-2rem))] rounded-2xl bg-white border border-gray-200 shadow-2xl p-4`}>
          <div className="flex items-start justify-between gap-3">
            <div className="text-[11px] font-bold uppercase tracking-wide text-[#E8002D]">{etiqueta}: {destino}</div>
            <button type="button" onClick={() => setAbierta(false)} aria-label="Cerrar" className="-mt-1 -mr-1 p-1 text-gray-400 hover:text-gray-700">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="w-4 h-4"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
          <p className="text-sm text-gray-800 leading-snug mt-1.5"><ConNegritas texto={texto} /></p>
          {nota && <p className="text-xs text-gray-500 mt-1.5">{nota}</p>}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
            <Link
              href={href}
              onClick={() => trackEvent('orejita_plan_click', { origen, destino: 'plan', lado })}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-[#E8002D] hover:bg-[#B8001F] text-white text-sm font-bold"
            >
              Ver el {destino} →
            </Link>
            {hrefComparar && (
              <Link
                href={hrefComparar}
                onClick={() => trackEvent('orejita_plan_click', { origen, destino: 'comparar', lado })}
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
          onClick={() => { setAbierta(true); trackEvent('orejita_plan_abrir', { origen, lado }) }}
          className={`flex items-center gap-1 lg:gap-1.5 text-white py-1.5 lg:py-2.5 shadow-lg transition-colors ${der ? 'rounded-l-xl pl-3 pr-2 bg-gray-900 hover:bg-[#E8002D]' : 'rounded-r-xl pr-3 pl-2 flex-row-reverse bg-gray-600 hover:bg-[#E8002D]'}`}
          aria-label={`${etiqueta}: ${destino}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="w-4 h-4 shrink-0">
            <path d={der ? 'M12 19V5M5 12l7-7 7 7' : 'M12 5v14M19 12l-7 7-7-7'} />
          </svg>
          <span className={`leading-tight ${der ? 'text-left' : 'text-right'}`}>
            {/* En el celular solo el nombre, para tapar menos */}
            <span className="hidden lg:block text-[10px] text-gray-300">{etiqueta}</span>
            <span className="block text-xs lg:text-sm font-bold">{destino}</span>
          </span>
        </button>
      )}
    </div>
  )
}
