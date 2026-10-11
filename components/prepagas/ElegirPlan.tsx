'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'

// "Elegí tu plan" (Darío, 11-oct-2026): "que las diferencias de planes se
// marquen bien fácil… si buscás esto, mejor elegí este plan". Arriba de la
// página de plan: la escalera de planes de la prepaga (tocable) y pestañas
// "¿Qué buscás?" con la recomendación de cada una. Los textos los arma el
// servidor con datos con fuente (ver opcionesPlan en
// app/prepagas/[slug]/[plan]/page.tsx); acá solo se muestran.

export interface EscalonPlan {
  slug: string
  codigo: string
  precio: string | null // a los 30 años
  copago: boolean
  href: string
  actual: boolean
}

export interface OpcionPlan {
  id: string
  pestana: string // "Pagar menos"
  titulo: string // "Elegí el S2"
  diferencia?: string // "$ 50.000 menos por mes a los 30 años"
  bueno: 'menos' | 'mas' | 'igual'
  gana: string[]
  pierde: string[]
  href?: string
  hrefComparar?: string
  destino?: string
}

export function ElegirPlan({ prepaga, actual, escalera, opciones, origen }: {
  prepaga: string
  actual: string
  escalera: EscalonPlan[]
  opciones: OpcionPlan[]
  origen: string
}) {
  const [sel, setSel] = useState(opciones[0]?.id)
  const op = opciones.find((o) => o.id === sel) ?? opciones[0]
  // En el celular la escalera se desliza sola hasta el plan actual
  const actualRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = actualRef.current
    const cont = el?.closest('.overflow-x-auto') as HTMLElement | null
    if (el && cont) cont.scrollLeft = el.offsetLeft - cont.clientWidth / 2 + el.clientWidth / 2
  }, [])

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Planes de {prepaga}</div>
      <div className="-mx-4 sm:mx-0 overflow-x-auto px-4 sm:px-0">
        <ol className="flex gap-2 min-w-max pb-1">
          {escalera.map((e, i) => (
            <li key={e.slug} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden className="text-gray-300">›</span>}
              {e.actual ? (
                <span ref={actualRef} className="flex flex-col items-center rounded-xl border-2 border-[#E8002D] bg-red-50 px-3 py-1.5 text-center">
                  <span className="text-sm font-black text-[#E8002D] leading-none">{e.codigo}</span>
                  <span className="text-[10px] font-semibold text-[#E8002D] mt-0.5">estás acá</span>
                </span>
              ) : (
                <Link
                  href={e.href}
                  onClick={() => trackEvent('escalera_plan_click', { origen, destino: e.slug })}
                  className="flex flex-col items-center rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-center hover:border-[#E8002D]"
                >
                  <span className="text-sm font-bold text-gray-900 leading-none">{e.codigo}</span>
                  <span className="text-[10px] text-gray-500 mt-0.5 whitespace-nowrap">{e.precio ?? (e.copago ? 'con copago' : 'sin copago')}</span>
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
      <p className="text-[11px] text-gray-400 mt-1">Precio de lista oficial a los 30 años, CABA y GBA. Tocá un plan para verlo.</p>

      {opciones.length > 0 && op && (
        <div className="mt-4">
          <div className="text-sm font-bold text-gray-900 mb-2">¿Qué buscás?</div>
          <div role="tablist" className="flex flex-wrap gap-1.5">
            {opciones.map((o) => (
              <button
                key={o.id}
                type="button"
                role="tab"
                aria-selected={o.id === op.id}
                onClick={() => { setSel(o.id); trackEvent('elegir_plan_pestana', { origen, opcion: o.id }) }}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${o.id === op.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {o.pestana}
              </button>
            ))}
          </div>

          <div role="tabpanel" className="mt-3 rounded-xl bg-gray-50 border border-gray-100 p-4">
            <div className="font-bold text-gray-900">{op.titulo}</div>
            {op.diferencia && (
              <div className={`text-sm font-semibold mt-0.5 ${op.bueno === 'menos' ? 'text-emerald-700' : op.bueno === 'mas' ? 'text-gray-700' : 'text-gray-700'}`}>{op.diferencia}</div>
            )}
            {(op.gana.length > 0 || op.pierde.length > 0) && (
              <ul className="mt-2 space-y-1 text-sm">
                {op.gana.map((g) => (
                  <li key={g} className="flex gap-2 text-gray-800"><span className="text-emerald-600 font-bold">✓</span><span>{g}</span></li>
                ))}
                {op.pierde.map((p) => (
                  <li key={p} className="flex gap-2 text-gray-600"><span className="text-gray-400 font-bold">–</span><span>{p}</span></li>
                ))}
              </ul>
            )}
            {(op.href || op.hrefComparar) && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                {op.href && (
                  <Link
                    href={op.href}
                    onClick={() => trackEvent('elegir_plan_click', { origen, opcion: op.id, destino: 'plan' })}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-900 hover:bg-black text-white text-sm font-bold"
                  >
                    Ver el {op.destino} →
                  </Link>
                )}
                {op.hrefComparar && (
                  <Link
                    href={op.hrefComparar}
                    onClick={() => trackEvent('elegir_plan_click', { origen, opcion: op.id, destino: 'comparar' })}
                    className="text-sm font-semibold text-[#E8002D] hover:underline"
                  >
                    Comparar {actual} vs {op.destino} →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
