'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import type { Plan, Prepaga } from '@/types'
import { formatPrecio } from '@/lib/utils'

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
  }, [edad, tramo, visitasMes, medicamentos, estudiosAnio, mostrarSimulador])

  const precioMin = planes[0]?.precioAjustado ?? 0
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

      {/* ── Tabla de resultados ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">
            {planes.length} planes disponibles para {edad} años
          </h3>
          <span className="text-xs text-gray-400">{PRECIO_ACTUALIZADO}</span>
        </div>

        <div className="divide-y divide-gray-100">
          {planes.map(({ prepaga, plan, precioAjustado, costoReal }, i) => (
            <div
              key={`${prepaga.slug}-${plan.slug}`}
              className={`px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-gray-50 transition-colors ${
                i === 0 ? 'bg-green-50 hover:bg-green-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {i === 0 && (
                  <span className="flex-shrink-0 text-xs bg-[#00875A] text-white px-2 py-0.5 rounded-full font-bold mt-0.5">
                    Más económico
                  </span>
                )}
                <div>
                  <div className="font-semibold text-gray-900">
                    {prepaga.nombre}
                    <span className="text-gray-400 font-normal"> · </span>
                    {plan.nombre}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${plan.copago ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700 font-medium'}`}>
                      {plan.copago ? 'Con copago' : 'Sin copago'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${plan.redAbierta ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                      {plan.redAbierta ? 'Red abierta' : 'Red cerrada'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                <div className="text-right">
                  <div className="text-xl font-bold text-[#E8002D]">{formatPrecio(precioAjustado)}/mes</div>
                  {mostrarSimulador && costoReal !== precioAjustado && (
                    <div className="text-xs text-gray-500">
                      Costo real est.: <span className={`font-bold ${costoReal < precioAjustado ? 'text-green-700' : 'text-orange-600'}`}>{formatPrecio(costoReal)}/mes</span>
                    </div>
                  )}
                </div>
                <Link
                  href={`/prepagas/${prepaga.slug}/${plan.slug}`}
                  className="text-sm font-semibold text-[#E8002D] hover:underline whitespace-nowrap"
                >
                  Ver plan →
                </Link>
              </div>
            </div>
          ))}
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
