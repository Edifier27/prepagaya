'use client'

import Link from 'next/link'
import { sanatoriosDePlan, REFERENCIA_POR_ZONA, REFERENCIA_GBA_SUBZONAS, SMG_CENTER_NOTA } from '@/lib/data/sanatorios'
import { getZona, CARTILLAS, linkCartillaPlan, tieneCombinacion } from '@/lib/data/cartilla-zonas'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'
import type { Plan, Prepaga } from '@/types'

interface Props {
  prepaga: Prepaga
  plan: Plan
  zonaKey: string
  provinciaNombre: string
  /** Localidad detectada por IP (ej. "tandil"), si coincide con una zona real del silo de cartillas. */
  localidadSlug?: string | null
  onClose: () => void
  /**
   * Cuando el modal se abre desde el wizard (que ya mandó el lead en el
   * popup inicial), el caller pasa esto para anotar el interés sin abrir el
   * formulario de ContratarPlanButton ni mandar un segundo mail — mismo
   * patrón que PlanModal (pedido de Darío, 17-sep-2026: un solo mail por
   * lead, cupo limitado de EmailJS). Si no viene, se muestra el formulario
   * completo (uso standalone fuera del wizard, donde todavía no tenemos los
   * datos de la persona).
   */
  onQuiero?: () => void
  quieroDisabled?: boolean
  quieroLabel?: string
}

export function CartillaModal({ prepaga, plan, zonaKey, provinciaNombre, localidadSlug, onClose, onQuiero, quieroDisabled, quieroLabel }: Props) {
  // sanatoriosDePlan ya filtra por zona: todo lo que devuelve es local.
  const resultados = sanatoriosDePlan(prepaga.slug, plan.slug, zonaKey)
  const zonaLocal = localidadSlug ? getZona(prepaga.slug, localidadSlug) : undefined
  // Centros de la cartilla oficial de esta localidad para este plan (4-oct-2026,
  // Darío: en Tandil decía "todavía no tenemos verificado" teniendo la
  // cartilla de la zona). Internación primero; si no hay, guardias.
  const planCartilla = CARTILLAS[prepaga.slug]?.planes.find((x) => x.comparadorSlug === plan.slug || x.otrosComparadorSlugs?.includes(plan.slug))
  const conInternacion = zonaLocal && planCartilla ? zonaLocal.centros.filter((c) => c.internacion.includes(planCartilla.id)) : []
  const centrosZona = conInternacion.length
    ? conInternacion
    : zonaLocal && planCartilla ? zonaLocal.centros.filter((c) => c.guardia.includes(planCartilla.id)) : []
  const linkPlan = linkCartillaPlan(prepaga.slug, plan.slug)
  // Página del plan en esa zona si existe; si no (el plan tiene todos los
  // centros de la zona), la cartilla de la zona, que marca los planes de cada centro.
  const hrefPlanZona = zonaLocal && localidadSlug
    ? linkPlan && tieneCombinacion(prepaga.slug, linkPlan.href.split('/').pop()!, localidadSlug)
      ? `${linkPlan.href}/${localidadSlug}`
      : `/cartillas/${prepaga.slug}/${localidadSlug}`
    : null

  const nombresVerificados = new Set(resultados.map((r) => r.sanatorio.nombre.toLowerCase()))
  const esGBA = zonaKey === 'buenos-aires'
  const referenciaZona = esGBA ? [] : (REFERENCIA_POR_ZONA[zonaKey] ?? []).filter(
    (nombre) => !nombresVerificados.has(nombre.toLowerCase())
  )
  const referenciaGBA = esGBA
    ? REFERENCIA_GBA_SUBZONAS.map((g) => ({
        ...g,
        sanatorios: g.sanatorios.filter((nombre) => !nombresVerificados.has(nombre.toLowerCase())),
      })).filter((g) => g.sanatorios.length > 0)
    : []

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
          {prepaga.slug === 'swiss-medical' && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-3.5 py-3 mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#E8002D] flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 2"/>
              </svg>
              <p className="text-xs text-gray-700 leading-relaxed">{SMG_CENTER_NOTA}</p>
            </div>
          )}

          {resultados.length > 0 && (
            <>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Sanatorios que cubre este plan puntual
              </p>
              <div className="space-y-3 mb-5">
                {resultados.map(({ sanatorio, cobertura }) => (
                  <div key={sanatorio.slug} className="bg-gray-50 rounded-xl border border-gray-100 p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-sm text-gray-900">{sanatorio.nombre}</div>
                      <span className="flex-shrink-0 text-[10px] font-bold text-[#00875A] bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                        En tu zona
                      </span>
                    </div>
                    {cobertura.nota && (
                      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{cobertura.nota}</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {resultados.length === 0 && centrosZona.length > 0 && zonaLocal && (
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                {conInternacion.length ? 'Sanatorios para internación' : 'Guardias'} en {zonaLocal.nombre}
              </p>
              <div className="space-y-2.5">
                {centrosZona.slice(0, 3).map((c) => (
                  <div key={c.nombre} className="bg-gray-50 rounded-xl border border-gray-100 p-3.5">
                    <div className="font-semibold text-sm text-gray-900">{c.nombre}</div>
                    {c.sedes[0]?.direccion && <div className="text-xs text-gray-500 mt-0.5">{c.sedes[0].direccion}</div>}
                  </div>
                ))}
              </div>
              {hrefPlanZona && (
                <Link href={hrefPlanZona} onClick={onClose} className="inline-block mt-3 text-sm font-semibold text-[#E8002D] hover:underline">
                  {centrosZona.length > 3 ? `Ver los ${centrosZona.length} de ${plan.nombre} en ${zonaLocal.nombre}` : `Ver la cartilla de ${plan.nombre} en ${zonaLocal.nombre}`} →
                </Link>
              )}
              <p className="text-[11px] text-gray-400 mt-2">Según la cartilla oficial de {prepaga.nombre}.</p>
            </div>
          )}

          {resultados.length === 0 && centrosZona.length === 0 && (
            <div className="mb-5">
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Todavía no tenemos verificado qué sanatorios cubre puntualmente este plan. Esto es lo que incluye en general:
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

          {referenciaZona.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                Red de referencia en {provinciaNombre || 'tu zona'}
              </p>
              <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
                Sanatorios de mayor complejidad de la zona. Confirmá con {prepaga.nombre} cuáles están incluidos en tu cartilla exacta.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {referenciaZona.map((nombre) => (
                  <span key={nombre} className="text-[11px] px-2.5 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-full">
                    {nombre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {referenciaGBA.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Red de referencia en Buenos Aires</p>
              <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
                Sanatorios de mayor complejidad por zona del GBA. Confirmá con {prepaga.nombre} cuáles están incluidos en tu cartilla exacta.
              </p>
              <div className="space-y-3">
                {referenciaGBA.map((g) => (
                  <div key={g.subzona}>
                    <p className="text-[11px] font-bold text-gray-500 mb-1.5">{g.subzona}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {g.sanatorios.map((nombre) => (
                        <span key={nombre} className="text-[11px] px-2.5 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-full">
                          {nombre}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            {onQuiero ? (
              <button
                onClick={onQuiero}
                disabled={quieroDisabled}
                className="w-full mb-4 inline-flex items-center justify-center gap-2 py-3 bg-[#E8002D] hover:bg-[#B8001F] disabled:opacity-60 text-white font-bold rounded-xl text-sm transition-colors"
              >
                {quieroLabel ?? 'Cotizar este plan →'}
              </button>
            ) : (
              <ContratarPlanButton
                prepagaNombre={prepaga.nombre}
                planNombre={plan.nombre}
                fuente="cartilla-modal"
                label="Cotizar este plan"
                className="w-full mb-4 inline-flex items-center justify-center gap-2 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm transition-colors"
              />
            )}
            {/* Con los sanatorios de la zona a la vista, el link ya está arriba */}
            {!(resultados.length === 0 && centrosZona.length > 0) && <p className="text-xs text-gray-500 mb-2">¿Querés ver el detalle completo?</p>}
            {resultados.length === 0 && centrosZona.length > 0 ? null : hrefPlanZona && zonaLocal ? (
              <Link
                href={hrefPlanZona}
                className="text-sm font-semibold text-[#E8002D] hover:underline"
                onClick={onClose}
              >
                Cartilla del {plan.nombre} en {zonaLocal.nombre} →
              </Link>
            ) : zonaLocal ? (
              <Link
                href={`/cartillas/${prepaga.slug}/${localidadSlug}`}
                className="text-sm font-semibold text-[#E8002D] hover:underline"
                onClick={onClose}
              >
                Cartilla completa de {prepaga.nombre} en {zonaLocal.nombre} →
              </Link>
            ) : (
              <Link
                href={`/cartillas/${prepaga.slug}`}
                className="text-sm font-semibold text-[#E8002D] hover:underline"
                onClick={onClose}
              >
                Guía de cartilla de {prepaga.nombre} →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
