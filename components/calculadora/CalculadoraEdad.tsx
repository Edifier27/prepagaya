'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import type { Plan, Prepaga } from '@/types'
import { formatPrecio } from '@/lib/utils'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'
import { Carrusel } from '@/components/ui/Carrusel'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'

// ─── Tramos etarios (multiplicadores sobre precio base 30 años) ───────────────
// Basados en cuadros tarifarios promedio del mercado. Los valores reales varían
// por prepaga. Confirmá siempre el precio exacto con la empresa.
const TRAMOS = [
  { min: 18, max: 25, factor: 0.73, label: '18-25 años' },
  { min: 26, max: 30, factor: 1.00, label: '26-30 años' },
  { min: 31, max: 35, factor: 1.17, label: '31-35 años' },
  { min: 36, max: 40, factor: 1.37, label: '36-40 años' },
  { min: 41, max: 45, factor: 1.60, label: '41-45 años' },
  { min: 46, max: 50, factor: 1.90, label: '46-50 años' },
  { min: 51, max: 55, factor: 2.25, label: '51-55 años' },
  { min: 56, max: 60, factor: 2.65, label: '56-60 años' },
  { min: 61, max: 65, factor: 3.10, label: '61-65 años' },
  { min: 66, max: 70, factor: 3.40, label: '66-70 años' },
  { min: 71, max: 75, factor: 3.60, label: '71-75 años' },
]

// Copago promedio por tipo de uso (estimaciones de mercado, Junio 2026)
const COPAGO_CONSULTA = 5500     // por visita al médico con copago
const COPAGO_ESTUDIO = 8500      // por estudio/práctica con copago
const AHORRO_FARMACIA = 18000    // ahorro mensual estimado con cobertura farmacéutica

function getTramo(edad: number) {
  return TRAMOS.find((t) => edad >= t.min && edad <= t.max) ?? TRAMOS[1]
}

interface PlanConPrecio {
  prepaga: Prepaga
  plan: Plan
  precioAjustado: number
  costoReal: number
}

const PRIMERAS = ['swiss-medical', 'osde', 'premedic', 'sancor-salud']

export function CalculadoraEdad() {
  const [edad, setEdad] = useState(35)
  // Simulador
  const [visitasMes, setVisitasMes] = useState(2)
  const [medicamentos, setMedicamentos] = useState(false)
  const [estudiosAnio, setEstudiosAnio] = useState(2)
  const [mostrarSimulador, setMostrarSimulador] = useState(false)

  const tramo = getTramo(edad)

  const planes = useMemo<PlanConPrecio[]>(() => {
    const result: PlanConPrecio[] = []
    for (const prepaga of prepagas) {
      for (const plan of prepaga.planes) {
        const precioAjustado = Math.round(plan.precio * tramo.factor)
        const copagosEstimados = plan.copago
          ? visitasMes * COPAGO_CONSULTA + (estudiosAnio / 12) * COPAGO_ESTUDIO
          : 0
        const ahorroFarmacia = medicamentos && prepaga.caracteristicas.farmacia ? AHORRO_FARMACIA : 0
        const costoReal = Math.round(precioAjustado + copagosEstimados - ahorroFarmacia)
        result.push({ prepaga, plan, precioAjustado, costoReal })
      }
    }
    return result.sort((a, b) =>
      mostrarSimulador ? a.costoReal - b.costoReal : a.precioAjustado - b.precioAjustado
    )
  }, [tramo, visitasMes, medicamentos, estudiosAnio, mostrarSimulador])

  const precioMin = planes[0]?.precioAjustado ?? 0
  const porPrepaga = useMemo(() => {
    const grupos = new Map<string, { prepaga: Prepaga; items: PlanConPrecio[] }>()
    for (const x of planes) {
      const g = grupos.get(x.prepaga.slug) ?? { prepaga: x.prepaga, items: [] }
      g.items.push(x)
      grupos.set(x.prepaga.slug, g)
    }
    const lista = [...grupos.values()]
    const pos = (slug: string) => (PRIMERAS.includes(slug) ? PRIMERAS.indexOf(slug) : PRIMERAS.length)
    // Las cuatro primeras en ese orden; el resto, de la más barata a la más cara
    return lista.sort((a, b) => pos(a.prepaga.slug) - pos(b.prepaga.slug) || (a.items[0]?.precioAjustado ?? 0) - (b.items[0]?.precioAjustado ?? 0))
  }, [planes])
  const precioMax = planes[planes.length - 1]?.precioAjustado ?? 0

  return (
    <div>
      {/* ── Slider de edad ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-medium text-gray-500 mb-0.5">Tu edad</div>
            <div className="text-4xl font-bold text-[#E8002D]">{edad} <span className="text-xl font-normal text-gray-400">años</span></div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 mb-0.5">Tramo tarifario</div>
            <div className="text-sm font-semibold text-gray-700">{tramo.label}</div>
            <div className="text-xs text-gray-500">Factor: <span className="font-bold text-[#E8002D]">{tramo.factor}×</span> el precio base</div>
          </div>
        </div>

        <input
          type="range"
          min={18}
          max={75}
          value={edad}
          onChange={(e) => setEdad(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#E8002D]"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>18 años</span>
          <span>75 años</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-gray-100">
          <div className="text-center bg-green-50 rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">Opción más económica</div>
            <div className="text-lg font-bold text-[#00875A]">{formatPrecio(precioMin)}/mes</div>
          </div>
          <div className="text-center bg-blue-50 rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">Opción premium</div>
            <div className="text-lg font-bold text-[#E8002D]">{formatPrecio(precioMax)}/mes</div>
          </div>
        </div>
      </div>

      {/* ── CTA contextual con el resultado ────────────────────────────────── */}
      {planes[0] && (
        <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-white font-bold text-sm">
              A los {edad} años, {planes[0].prepaga.nombre} {planes[0].plan.nombre} te sale desde {formatPrecio(planes[0].precioAjustado)}/mes
            </div>
            <div className="text-white text-xs">Este es un valor estimado. ¿Querés el precio exacto para tu zona y grupo familiar?</div>
          </div>
          <ContratarPlanButton
            prepagaNombre={planes[0].prepaga.nombre}
            planNombre={planes[0].plan.nombre}
            fuente="calculadora-edad"
            label="Cotizar mi precio exacto"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#E8002D] font-bold rounded-xl text-sm hover:bg-red-50 transition-colors shadow-sm whitespace-nowrap"
          />
        </div>
      )}

      {/* ── Toggle simulador ───────────────────────────────────────────────── */}
      <button
        onClick={() => setMostrarSimulador(!mostrarSimulador)}
        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 mb-6 transition-all ${
          mostrarSimulador
            ? 'border-[#00875A] bg-green-50 text-[#00875A]'
            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🧮</span>
          <div className="text-left">
            <div className="font-semibold text-sm">Simulador de costo real</div>
            <div className="text-xs opacity-70">¿Cuánto pagás en total contando copagos?</div>
          </div>
        </div>
        <span className="text-lg">{mostrarSimulador ? '▲' : '▼'}</span>
      </button>

      {/* ── Simulador (expandible) ─────────────────────────────────────────── */}
      {mostrarSimulador && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">¿Cómo usás el sistema de salud?</h3>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Visitas al médico por mes</label>
                <span className="text-sm font-bold text-[#E8002D]">{visitasMes} vez{visitasMes !== 1 ? 'es' : ''}</span>
              </div>
              <input
                type="range"
                min={0}
                max={8}
                value={visitasMes}
                onChange={(e) => setVisitasMes(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#E8002D]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Casi nunca</span>
                <span>Muy seguido</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Estudios/análisis por año</label>
                <span className="text-sm font-bold text-[#E8002D]">{estudiosAnio}</span>
              </div>
              <input
                type="range"
                min={0}
                max={12}
                value={estudiosAnio}
                onChange={(e) => setEstudiosAnio(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#E8002D]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Ninguno</span>
                <span>1 por mes</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <div className="text-sm font-medium text-gray-700">Medicamentos crónicos</div>
                <div className="text-xs text-gray-500">Si tomás medicamentos todos los meses</div>
              </div>
              <button
                onClick={() => setMedicamentos(!medicamentos)}
                className={`relative w-11 h-6 rounded-full transition-colors ${medicamentos ? 'bg-[#E8002D]' : 'bg-gray-300'}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    medicamentos ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-xl text-xs text-gray-500">
            <strong className="text-gray-700">¿Cómo se calcula?</strong> Cuota + (visitas × copago estimado $5.500) + (estudios/12 × copago estimado $8.500) {medicamentos ? '— ahorro en farmacia estimado $18.000' : ''}
          </div>
        </div>
      )}

      {/* ── Carrusel por prepaga (Darío, 5-oct-2026): Swiss Medical, OSDE,
          Premedic y Sancor primero; el resto después. Cada tarjeta con el
          precio a tu edad, sus planes y algunos beneficios. ───────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">
            {planes.length} planes disponibles para {edad} años
          </h3>
          <span className="text-xs text-gray-400">{PRECIO_ACTUALIZADO}</span>
        </div>

        <div className="p-4 sm:p-5">
          <Carrusel
            etiqueta="prepagas"
            items={porPrepaga.map(({ prepaga, items }) => {
              const desde = items[0]
              const valor = (x: PlanConPrecio) => (mostrarSimulador ? x.costoReal : x.precioAjustado)
              return (
                <div key={prepaga.slug} className="h-full rounded-2xl border-2 border-gray-100 p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <PrepagaLogo slug={prepaga.slug} nombre={prepaga.nombre} colorPrimario={prepaga.colorPrimario} size="sm" />
                    <div className="min-w-0">
                      <Link href={`/prepagas/${prepaga.slug}`} className="font-bold text-gray-900 hover:text-[#E8002D] leading-tight">{prepaga.nombre}</Link>
                      <div className="text-xs text-gray-500">{prepaga.satisfaccion}% satisfacción</div>
                    </div>
                  </div>
                  <div className="rounded-xl bg-gray-50 px-3 py-2">
                    <div className="text-[11px] text-gray-500">Desde, a los {edad} años</div>
                    <div className="text-2xl font-black text-gray-900 tabular-nums">{formatPrecio(valor(desde))}<span className="text-xs font-semibold text-gray-400">/mes</span></div>
                    <div className="text-[11px] text-gray-500">{desde.plan.nombre}{desde.plan.copago ? ' · con copago' : ' · sin copago'}</div>
                  </div>
                  {prepaga.pros.length > 0 && (
                    <ul className="space-y-1 text-xs text-gray-600">
                      {prepaga.pros.slice(0, 3).map((b) => (
                        <li key={b} className="flex gap-1.5"><span className="text-emerald-600 font-bold">✓</span><span>{b}</span></li>
                      ))}
                    </ul>
                  )}
                  <ul className="divide-y divide-gray-100 border-t border-gray-100 text-sm">
                    {items.slice(0, 5).map((x) => (
                      <li key={x.plan.slug}>
                        <Link href={`/prepagas/${prepaga.slug}/${x.plan.slug}`} className="flex items-center justify-between gap-2 py-1.5 hover:text-[#E8002D]">
                          <span className="truncate">{x.plan.nombre}</span>
                          <span className="font-semibold tabular-nums shrink-0">{formatPrecio(valor(x))}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {items.length > 5 && <Link href={`/prepagas/${prepaga.slug}`} className="text-xs font-semibold text-gray-500 hover:text-[#E8002D]">+{items.length - 5} planes más</Link>}
                  <ContratarPlanButton
                    prepagaNombre={prepaga.nombre}
                    fuente="calculadora-edad"
                    label={`Cotizar ${prepaga.nombre}`}
                    planesOpciones={items.map((x) => x.plan.nombre)}
                    className="mt-auto w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#E8002D] hover:bg-[#B8001F] text-white rounded-xl text-sm font-bold transition-colors"
                  />
                </div>
              )
            })}
          />
        </div>

        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            * Precios estimados para {edad} años. Los valores reales pueden variar según la prepaga, zona y condiciones particulares.
            Confirmá siempre el precio directamente con la empresa.
          </p>
        </div>
      </div>
    </div>
  )
}
