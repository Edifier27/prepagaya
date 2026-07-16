'use client'

import Link from 'next/link'
import { sanatoriosDePlan } from '@/lib/data/sanatorios'
import { getCartillaInfo } from '@/lib/data/cartillas'
import type { Plan, Prepaga } from '@/types'

interface Props {
  prepaga: Prepaga
  plan: Plan
  zonaKey: string
  provinciaNombre: string
  onClose: () => void
}

export function CartillaModal({ prepaga, plan, zonaKey, provinciaNombre, onClose }: Props) {
  const resultados = sanatoriosDePlan(prepaga.slug, plan.slug, zonaKey)
  const cartillaInfo = getCartillaInfo(prepaga.slug)
  const zonasConDato = new Set(['caba', 'buenos-aires', 'cordoba', 'santa-fe'])
  const hayDatoDeZona = zonasConDato.has(zonaKey)

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
          <div className="text-lg font-bold mb-0.5">Cartilla de {plan.nombre}</div>
          <p className="text-red-100 text-sm">{prepaga.nombre} · {provinciaNombre || 'tu zona'}</p>
        </div>

        <div className="p-6 overflow-y-auto">
          {resultados.length > 0 ? (
            <>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Sanatorios de alta complejidad que cubre este plan
              </p>
              <div className="space-y-3 mb-4">
                {resultados.map(({ sanatorio, cobertura }) => {
                  const esLocal = hayDatoDeZona && sanatorio.zonas.some((z) =>
                    (zonaKey === 'caba' && z === 'caba') ||
                    (zonaKey === 'buenos-aires' && z === 'gba') ||
                    (zonaKey === 'cordoba' && z === 'cordoba') ||
                    (zonaKey === 'santa-fe' && z === 'rosario')
                  )
                  return (
                    <div key={sanatorio.slug} className="bg-gray-50 rounded-xl border border-gray-100 p-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-sm text-gray-900">{sanatorio.nombre}</div>
                        {esLocal && (
                          <span className="flex-shrink-0 text-[10px] font-bold text-[#00875A] bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                            En tu zona
                          </span>
                        )}
                      </div>
                      {cobertura.nota && (
                        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{cobertura.nota}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="mb-4">
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Todavía no tenemos cargada la cartilla detallada de {prepaga.nombre} en {provinciaNombre || 'tu zona'}. Esto es lo que incluye el plan en general:
              </p>
              <ul className="space-y-1.5">
                {plan.cobertura.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#00875A] flex-shrink-0 mt-0.5">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {cartillaInfo && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Para ver la cartilla completa y actualizada:</p>
              <Link
                href={cartillaInfo.urlCartilla}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[#E8002D] hover:underline"
              >
                Buscador oficial de {prepaga.nombre} →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
