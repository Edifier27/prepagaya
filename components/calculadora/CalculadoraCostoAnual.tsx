'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { prepagas } from '@/lib/data/prepagas'
import { formatPrecio, precioDeriva } from '@/lib/utils'
import type { Plan, Prepaga } from '@/types'

function multEdad(edad: number): number {
  if (edad < 30) return 0.85
  if (edad < 40) return 1.0
  if (edad < 50) return 1.35
  if (edad < 60) return 1.75
  if (edad < 70) return 2.4
  return 3.2
}

type Situacion = 'particular' | 'dependencia'

interface ResultadoCalculo {
  cuotaMensual: number
  copagosAnuales: number
  aporteOSMensual: number
  bolsilloMensual: number
  totalAnual: number
  diasSueldo: number | null
}

export function CalculadoraCostoAnual(): React.ReactElement {
  const [prepagaSlug, setPrepagaSlug] = useState<string>(prepagas[0].slug)
  const [planSlug, setPlanSlug] = useState<string>(prepagas[0].planes[0].slug)
  const [edadStr, setEdadStr] = useState<string>('35')
  const edad = Math.min(99, Math.max(18, Number(edadStr) || 18))
  const [situacion, setSituacion] = useState<Situacion>('particular')
  const [sueldoBruto, setSueldoBruto] = useState<string>('')
  const [consultasMes, setConsultasMes] = useState<number>(1)
  const [copagoPorConsulta, setCopagoPorConsulta] = useState<number>(3500)

  const prepagaActual = useMemo<Prepaga>(
    () => prepagas.find((p) => p.slug === prepagaSlug) ?? prepagas[0],
    [prepagaSlug]
  )

  const planActual = useMemo<Plan>(
    () => prepagaActual.planes.find((p) => p.slug === planSlug) ?? prepagaActual.planes[0],
    [prepagaActual, planSlug]
  )

  const resultado = useMemo<ResultadoCalculo>(() => {
    const mult = multEdad(edad)
    let cuotaMensual: number

    if (situacion === 'dependencia') {
      cuotaMensual = precioDeriva(Math.round(planActual.precio * mult))
    } else {
      cuotaMensual = Math.round(planActual.precio * mult)
    }

    const copagosAnuales = consultasMes * copagoPorConsulta * 12

    const sueldoBrutoNum = parseFloat(sueldoBruto.replace(/\D/g, '')) || 0
    const aporteOSMensual = situacion === 'dependencia' && sueldoBrutoNum > 0
      ? Math.round(sueldoBrutoNum * 0.09)
      : 0

    const bolsilloMensual = Math.max(0, cuotaMensual - aporteOSMensual) + Math.round(consultasMes * copagoPorConsulta)
    const totalAnual = bolsilloMensual * 12

    let diasSueldo: number | null = null
    if (sueldoBrutoNum > 0) {
      const sueldoDiario = sueldoBrutoNum / 30
      diasSueldo = Math.round(totalAnual / sueldoDiario)
    }

    return { cuotaMensual, copagosAnuales, aporteOSMensual, bolsilloMensual, totalAnual, diasSueldo }
  }, [planActual, edad, situacion, sueldoBruto, consultasMes, copagoPorConsulta])

  function handlePrepagaChange(slug: string) {
    const nueva = prepagas.find((p) => p.slug === slug)
    if (!nueva) return
    setPrepagaSlug(slug)
    const primerPlan = nueva.planes[0]
    setPlanSlug(primerPlan.slug)
    setCopagoPorConsulta(primerPlan.copago ? 3500 : 0)
  }

  function handlePlanChange(slug: string) {
    setPlanSlug(slug)
    const plan = prepagaActual.planes.find((p) => p.slug === slug)
    if (plan) {
      setCopagoPorConsulta(plan.copago ? 3500 : 0)
    }
  }

  const labelConsultas = ['Ninguna', '1 vez', '2 veces', '3 veces', '4 o más']

  return (
    <div className="space-y-5">
      {/* Selección de prepaga y plan */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-4">Elegí tu prepaga y plan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Prepaga</label>
            <select
              value={prepagaSlug}
              onChange={(e) => handlePrepagaChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#E8002D] focus:border-[#E8002D]"
            >
              {prepagas.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Plan</label>
            <select
              value={planSlug}
              onChange={(e) => handlePlanChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#E8002D] focus:border-[#E8002D]"
            >
              {prepagaActual.planes.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.nombre} — {formatPrecio(p.precio)}/mes
                </option>
              ))}
            </select>
          </div>
        </div>

        {planActual.copago ? (
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-orange-700 bg-orange-50 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            Este plan tiene copago por consulta
          </div>
        ) : (
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Este plan no tiene copago en consultas
          </div>
        )}
      </div>

      {/* Edad y situación */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-4">Tu perfil</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tu edad
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={edadStr}
              onChange={(e) => setEdadStr(e.target.value.replace(/[^0-9]/g, ''))}
              onBlur={() => setEdadStr(String(Math.min(99, Math.max(18, Number(edadStr) || 18))))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E8002D] focus:border-[#E8002D]"
            />
            <p className="text-xs text-gray-400 mt-1">
              Factor de edad: <span className="font-semibold text-[#E8002D]">{multEdad(edad).toFixed(2)}×</span> el precio base
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Situación laboral
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="situacion"
                  value="particular"
                  checked={situacion === 'particular'}
                  onChange={() => setSituacion('particular')}
                  className="accent-[#E8002D]"
                />
                <div>
                  <div className="text-sm font-medium text-gray-800">Particular / Monotributista</div>
                  <div className="text-xs text-gray-500">Precio con IVA incluido</div>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="situacion"
                  value="dependencia"
                  checked={situacion === 'dependencia'}
                  onChange={() => setSituacion('dependencia')}
                  className="accent-[#E8002D]"
                />
                <div>
                  <div className="text-sm font-medium text-gray-800">Relación de dependencia</div>
                  <div className="text-xs text-gray-500">Precio sin IVA (21% menos) + aporte OS</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {situacion === 'dependencia' && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Sueldo bruto mensual (opcional)
            </label>
            <div className="relative max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Ej: 800000"
                value={sueldoBruto}
                onChange={(e) => setSueldoBruto(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E8002D] focus:border-[#E8002D]"
              />
            </div>
            {sueldoBruto && (
              <p className="text-xs text-gray-500 mt-1">
                Aporte OS estimado (9% del bruto):{' '}
                <span className="font-semibold text-green-700">
                  {formatPrecio(Math.round(parseFloat(sueldoBruto) * 0.09))}/mes
                </span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Uso del sistema */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-4">Uso del sistema de salud</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Consultas médicas por mes</label>
              <span className="text-sm font-bold text-[#E8002D]">
                {labelConsultas[Math.min(consultasMes, 4)]}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={4}
              value={Math.min(consultasMes, 4)}
              onChange={(e) => setConsultasMes(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#E8002D]"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Ninguna</span>
              <span>4 o más</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Copago por consulta
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
              <input
                type="text"
                inputMode="numeric"
                value={copagoPorConsulta}
                onChange={(e) => setCopagoPorConsulta(Number(e.target.value.replace(/[^0-9]/g, '')) || 0)}
                className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E8002D] focus:border-[#E8002D]"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {planActual.copago ? 'Auto-detectado del plan seleccionado. Podés editarlo.' : 'Plan sin copago — en $0. Podés editarlo.'}
            </p>
          </div>
        </div>
      </div>

      {/* Resultado */}
      <div className="bg-white rounded-2xl border-2 border-[#E8002D] overflow-hidden">
        <div className="bg-[#E8002D] px-6 py-4">
          <h2 className="font-bold text-white text-lg">Tu costo estimado de bolsillo</h2>
          <p className="text-red-100 text-sm">
            {prepagaActual.nombre} · {planActual.nombre} · {edad} años ·{' '}
            {situacion === 'dependencia' ? 'Relación de dependencia' : 'Particular / Monotributista'}
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Cuota mensual */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <div className="text-sm font-medium text-gray-700">Cuota mensual según tu edad</div>
              <div className="text-xs text-gray-400">
                Precio base {formatPrecio(planActual.precio)} × factor {multEdad(edad).toFixed(2)}
                {situacion === 'dependencia' ? ' · sin IVA (deriva OS)' : ' · con IVA'}
              </div>
            </div>
            <div className="text-xl font-bold text-gray-900 text-right">
              {formatPrecio(resultado.cuotaMensual)}
              <div className="text-xs font-normal text-gray-400">/mes</div>
            </div>
          </div>

          {/* Copagos */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <div className="text-sm font-medium text-gray-700">Copagos estimados al año</div>
              <div className="text-xs text-gray-400">
                {consultasMes} consulta{consultasMes !== 1 ? 's' : ''}/mes × {formatPrecio(copagoPorConsulta)} × 12 meses
              </div>
            </div>
            <div className="text-xl font-bold text-gray-900 text-right">
              {formatPrecio(resultado.copagosAnuales)}
              <div className="text-xs font-normal text-gray-400">/año</div>
            </div>
          </div>

          {/* Aporte OS */}
          {resultado.aporteOSMensual > 0 && (
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <div className="text-sm font-medium text-green-700">Menos: aporte obra social</div>
                <div className="text-xs text-gray-400">9% del sueldo bruto ingresado</div>
              </div>
              <div className="text-xl font-bold text-green-700 text-right">
                − {formatPrecio(resultado.aporteOSMensual)}
                <div className="text-xs font-normal text-gray-400">/mes</div>
              </div>
            </div>
          )}

          {/* Total anual — destacado */}
          <div className="bg-red-50 border border-red-100 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-gray-700">Total de bolsillo al año</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {formatPrecio(resultado.bolsilloMensual)}/mes × 12 meses
              </div>
              {resultado.diasSueldo !== null && (
                <div className="text-xs text-[#E8002D] font-medium mt-1">
                  Equivale a {resultado.diasSueldo} días de tu sueldo bruto
                </div>
              )}
            </div>
            <div className="text-4xl font-bold text-[#E8002D] tabular-nums">
              {formatPrecio(resultado.totalAnual)}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-400 leading-relaxed">
            Estimación orientativa. Los multiplicadores de edad son promedios de mercado. Los copagos varían según el prestador y la práctica.
            Confirmá siempre el precio exacto con la prepaga antes de contratar.
          </p>
        </div>

        {/* CTA interno */}
        <div className="px-6 pb-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full font-semibold rounded-lg px-5 py-3 text-sm bg-[#00875A] text-white hover:bg-[#006644] transition-colors"
          >
            Cotizá con precio real personalizado →
          </Link>
        </div>
      </div>
    </div>
  )
}
