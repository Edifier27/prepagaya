'use client'

import { useState } from 'react'
import Link from 'next/link'
import { prepagas } from '@/lib/data/prepagas'
import type { Plan, Prepaga } from '@/types'
import { formatPrecio, precioDeriva } from '@/lib/utils'

type Lado = {
  prepagaSlug: string
  planSlug: string
}

const TEAL = '#E8002D'

function getPrepaga(slug: string): Prepaga | undefined {
  return prepagas.find((p) => p.slug === slug)
}

function getPlan(prepagaSlug: string, planSlug: string): Plan | undefined {
  return getPrepaga(prepagaSlug)?.planes.find((pl) => pl.slug === planSlug)
}

type GanadorCol = 1 | 2 | 0

function SelectPrepaga({
  value,
  onChange,
  label,
}: {
  value: string
  onChange: (v: string) => void
  label: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#E8002D] bg-white transition-colors"
      >
        <option value="">Elegí una prepaga</option>
        {prepagas.map((p) => (
          <option key={p.slug} value={p.slug}>
            {p.nombre}
          </option>
        ))}
      </select>
    </div>
  )
}

function SelectPlan({
  prepagaSlug,
  value,
  onChange,
}: {
  prepagaSlug: string
  value: string
  onChange: (v: string) => void
}) {
  const prepaga = getPrepaga(prepagaSlug)
  if (!prepaga) return null
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Plan</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#E8002D] bg-white transition-colors"
      >
        <option value="">Elegí un plan</option>
        {prepaga.planes.map((pl) => (
          <option key={pl.slug} value={pl.slug}>
            {pl.nombre} — {formatPrecio(pl.precio)}/mes
          </option>
        ))}
      </select>
    </div>
  )
}

function CeldaValor({
  children,
  ganador,
}: {
  children: React.ReactNode
  ganador: boolean
}) {
  return (
    <td
      className={`text-center py-4 px-4 text-sm font-semibold transition-colors ${
        ganador ? 'text-[#E8002D] bg-red-50' : 'text-gray-700'
      }`}
    >
      {ganador && (
        <span className="inline-block mr-1 text-[#E8002D]">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 inline-block mb-0.5">
            <path
              fillRule="evenodd"
              d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"
              clipRule="evenodd"
            />
          </svg>{' '}
        </span>
      )}
      {children}
    </td>
  )
}

export function ComparadorLadoALado(): React.ReactElement {
  const [ladoA, setLadoA] = useState<Lado>({ prepagaSlug: 'swiss-medical', planSlug: 'smg20' })
  const [ladoB, setLadoB] = useState<Lado>({ prepagaSlug: 'osde', planSlug: '310' })
  const [sinIva, setSinIva] = useState(false)

  const prepagaA = getPrepaga(ladoA.prepagaSlug)
  const prepagaB = getPrepaga(ladoB.prepagaSlug)
  const planA = getPlan(ladoA.prepagaSlug, ladoA.planSlug)
  const planB = getPlan(ladoB.prepagaSlug, ladoB.planSlug)

  const precioA = planA ? (sinIva ? precioDeriva(planA.precio) : planA.precio) : null
  const precioB = planB ? (sinIva ? precioDeriva(planB.precio) : planB.precio) : null

  function cmpNum(a: number, b: number, mayorEsMejor = true): GanadorCol {
    if (a === b) return 0
    if (mayorEsMejor) return a > b ? 1 : 2
    return a < b ? 1 : 2
  }

  function cmpBool(a: boolean, b: boolean): GanadorCol {
    if (a === b) return 0
    return a ? 1 : 2
  }

  const canCompare = prepagaA && prepagaB && planA && planB && precioA !== null && precioB !== null

  const ganadorPrecio: GanadorCol = canCompare ? cmpNum(precioA!, precioB!, false) : 0
  const ganadorCopago: GanadorCol = canCompare ? cmpBool(!planA!.copago, !planB!.copago) : 0
  const ganadorRed: GanadorCol = canCompare ? cmpBool(planA!.redAbierta, planB!.redAbierta) : 0
  const ganadorSatisfaccion: GanadorCol = canCompare ? cmpNum(prepagaA!.satisfaccion, prepagaB!.satisfaccion) : 0
  const ganadorProfesionales: GanadorCol = canCompare ? cmpNum(prepagaA!.profesionales, prepagaB!.profesionales) : 0

  const allCoberturas = canCompare
    ? Array.from(new Set([...planA!.cobertura, ...planB!.cobertura]))
    : []

  return (
    <div>
      {/* Selectors */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lado A */}
          <div className="space-y-3">
            <SelectPrepaga
              value={ladoA.prepagaSlug}
              onChange={(v) => setLadoA({ prepagaSlug: v, planSlug: '' })}
              label="Prepaga A"
            />
            {ladoA.prepagaSlug && (
              <SelectPlan
                prepagaSlug={ladoA.prepagaSlug}
                value={ladoA.planSlug}
                onChange={(v) => setLadoA((prev) => ({ ...prev, planSlug: v }))}
              />
            )}
          </div>

          {/* VS */}
          <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2 mt-8">
            <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-black text-gray-400">
              VS
            </span>
          </div>

          {/* Lado B */}
          <div className="space-y-3">
            <SelectPrepaga
              value={ladoB.prepagaSlug}
              onChange={(v) => setLadoB({ prepagaSlug: v, planSlug: '' })}
              label="Prepaga B"
            />
            {ladoB.prepagaSlug && (
              <SelectPlan
                prepagaSlug={ladoB.prepagaSlug}
                value={ladoB.planSlug}
                onChange={(v) => setLadoB((prev) => ({ ...prev, planSlug: v }))}
              />
            )}
          </div>
        </div>

        {/* Toggle IVA */}
        <div className="mt-5 pt-5 border-t border-gray-100 flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-600 font-medium">Modalidad de precio:</span>
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setSinIva(false)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !sinIva ? 'bg-white shadow-sm text-[#E8002D]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Con IVA (particular)
            </button>
            <button
              onClick={() => setSinIva(true)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                sinIva ? 'bg-white shadow-sm text-[#E8002D]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sin IVA (relación de dependencia)
            </button>
          </div>
        </div>
      </div>

      {/* Tabla comparativa */}
      {canCompare ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
            <div className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wide">
              Característica
            </div>
            <div
              className="py-4 px-4 text-center border-l border-gray-200"
              style={{ borderTopColor: TEAL, borderTopWidth: 3 }}
            >
              <div className="text-sm font-black text-gray-900">{prepagaA!.nombre}</div>
              <div className="text-xs text-[#E8002D] font-semibold">{planA!.nombre}</div>
            </div>
            <div
              className="py-4 px-4 text-center border-l border-gray-200"
              style={{ borderTopColor: TEAL, borderTopWidth: 3 }}
            >
              <div className="text-sm font-black text-gray-900">{prepagaB!.nombre}</div>
              <div className="text-xs text-[#E8002D] font-semibold">{planB!.nombre}</div>
            </div>
          </div>

          <table className="w-full">
            <tbody>
              {/* Precio */}
              <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 text-sm text-gray-600 font-medium">
                  Precio {sinIva ? '(sin IVA, relación dependencia)' : '(con IVA, particular)'}
                </td>
                <CeldaValor ganador={ganadorPrecio === 1}>
                  {formatPrecio(precioA!)}/mes
                </CeldaValor>
                <CeldaValor ganador={ganadorPrecio === 2}>
                  {formatPrecio(precioB!)}/mes
                </CeldaValor>
              </tr>

              {/* Copago */}
              <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 text-sm text-gray-600 font-medium">Copago en consultas</td>
                <CeldaValor ganador={ganadorCopago === 1}>
                  {planA!.copago ? 'Con copago' : 'Sin copago'}
                </CeldaValor>
                <CeldaValor ganador={ganadorCopago === 2}>
                  {planB!.copago ? 'Con copago' : 'Sin copago'}
                </CeldaValor>
              </tr>

              {/* Red */}
              <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 text-sm text-gray-600 font-medium">Red de prestadores</td>
                <CeldaValor ganador={ganadorRed === 1}>
                  {planA!.redAbierta ? 'Red abierta' : 'Red cerrada'}
                </CeldaValor>
                <CeldaValor ganador={ganadorRed === 2}>
                  {planB!.redAbierta ? 'Red abierta' : 'Red cerrada'}
                </CeldaValor>
              </tr>

              {/* Satisfaccion */}
              <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 text-sm text-gray-600 font-medium">Satisfacción de afiliados</td>
                <CeldaValor ganador={ganadorSatisfaccion === 1}>
                  {prepagaA!.satisfaccion}%
                </CeldaValor>
                <CeldaValor ganador={ganadorSatisfaccion === 2}>
                  {prepagaB!.satisfaccion}%
                </CeldaValor>
              </tr>

              {/* Profesionales */}
              <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 text-sm text-gray-600 font-medium">Profesionales en la red</td>
                <CeldaValor ganador={ganadorProfesionales === 1}>
                  {prepagaA!.profesionales.toLocaleString('es-AR')}
                </CeldaValor>
                <CeldaValor ganador={ganadorProfesionales === 2}>
                  {prepagaB!.profesionales.toLocaleString('es-AR')}
                </CeldaValor>
              </tr>

              {/* Coberturas */}
              {allCoberturas.length > 0 && (
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-sm text-gray-600 font-medium align-top">
                    Coberturas incluidas
                  </td>
                  <td className="py-4 px-4 align-top">
                    <ul className="space-y-1">
                      {planA!.cobertura.map((c) => (
                        <li key={c} className="text-xs text-gray-700 flex items-start gap-1.5">
                          <svg
                            viewBox="0 0 16 16"
                            fill={TEAL}
                            className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-4 px-4 align-top">
                    <ul className="space-y-1">
                      {planB!.cobertura.map((c) => (
                        <li key={c} className="text-xs text-gray-700 flex items-start gap-1.5">
                          <svg
                            viewBox="0 0 16 16"
                            fill={TEAL}
                            className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* CTAs */}
          <div className="grid grid-cols-2 border-t border-gray-200">
            <div className="py-5 px-4 flex justify-center border-r border-gray-200">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00875A] hover:bg-[#006644] text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                Cotizar {planA!.nombre}
              </Link>
            </div>
            <div className="py-5 px-4 flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00875A] hover:bg-[#006644] text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                Cotizar {planB!.nombre}
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm py-16 text-center text-gray-400">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10 mx-auto mb-3 text-gray-300"
          >
            <path d="M9 17H7A5 5 0 017 7h2m6 0h2a5 5 0 010 10h-2m-7-5h8" />
          </svg>
          <p className="text-sm font-medium">Seleccioná dos planes para comparar</p>
        </div>
      )}
    </div>
  )
}
