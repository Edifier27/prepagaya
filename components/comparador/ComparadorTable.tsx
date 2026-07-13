'use client'

import { useState } from 'react'
import Link from 'next/link'
import { prepagas } from '@/lib/data/prepagas'
import { formatPrecio } from '@/lib/utils'

function Check({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-green-600">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
      </svg>
    </span>
  ) : (
    <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-gray-300">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
      </svg>
    </span>
  )
}

const FILAS = [
  { key: 'precio',           label: 'Precio desde' },
  { key: 'precioEstrella',   label: 'Plan estrella' },
  { key: 'satisfaccion',     label: 'Satisfacción afiliados' },
  { key: 'profesionales',    label: 'Red de profesionales' },
  { key: 'planes',           label: 'Cantidad de planes' },
  { key: 'sinCopago',        label: 'Plan sin copago disponible' },
  { key: 'redAbierta',       label: 'Red abierta' },
  { key: 'coberturaNacional',label: 'Cobertura nacional' },
  { key: 'odontologia',      label: 'Odontología' },
  { key: 'saludMental',      label: 'Salud mental' },
  { key: 'maternidad',       label: 'Maternidad' },
  { key: 'farmacia',         label: 'Descuentos en farmacia' },
  { key: 'optica',           label: 'Óptica' },
  { key: 'appMovil',         label: 'App móvil' },
  { key: 'atencion24hs',     label: 'Atención 24hs' },
]

interface FilaValor {
  precio: string
  precioEstrella: string
  satisfaccion: string
  profesionales: string
  planes: string
  sinCopago: boolean
  redAbierta: boolean
  coberturaNacional: boolean
  odontologia: boolean
  saludMental: boolean
  maternidad: boolean
  farmacia: boolean
  optica: boolean
  appMovil: boolean
  atencion24hs: boolean
}

function buildValores(slug: string): FilaValor | null {
  const p = prepagas.find((x) => x.slug === slug)
  if (!p) return null
  const precioMin = Math.min(...p.planes.map((pl) => pl.precio))
  const planEstrella = p.planes.find((pl) => pl.destacado) ?? p.planes[0]
  return {
    precio: formatPrecio(precioMin) + '/mes',
    precioEstrella: `${planEstrella.nombre} · ${formatPrecio(planEstrella.precio)}/mes`,
    satisfaccion: `${p.satisfaccion}%`,
    profesionales: p.profesionales.toLocaleString('es-AR'),
    planes: `${p.planes.length} planes`,
    sinCopago: p.planes.some((pl) => !pl.copago),
    redAbierta: p.planes.some((pl) => pl.redAbierta),
    coberturaNacional: p.caracteristicas.coberturaNacional,
    odontologia: p.caracteristicas.odontologia,
    saludMental: p.caracteristicas.saludMental,
    maternidad: p.caracteristicas.maternidad,
    farmacia: p.caracteristicas.farmacia,
    optica: p.caracteristicas.optica,
    appMovil: p.caracteristicas.appMovil,
    atencion24hs: p.caracteristicas.atencion24hs,
  }
}

const BOOL_KEYS = new Set(['sinCopago','redAbierta','coberturaNacional','odontologia','saludMental','maternidad','farmacia','optica','appMovil','atencion24hs'])

const DEFAULTS = ['swiss-medical', 'osde', 'sancor-salud']

export function ComparadorTable() {
  const [seleccionados, setSeleccionados] = useState<string[]>(DEFAULTS)

  function togglePrepaga(slug: string) {
    setSeleccionados((prev) => {
      if (prev.includes(slug)) {
        if (prev.length <= 2) return prev
        return prev.filter((s) => s !== slug)
      }
      if (prev.length >= 3) return [...prev.slice(1), slug]
      return [...prev, slug]
    })
  }

  const valoresMap = Object.fromEntries(
    seleccionados.map((s) => [s, buildValores(s)])
  )

  const prepagasSeleccionadas = seleccionados.map((s) => prepagas.find((p) => p.slug === s)!).filter(Boolean)

  return (
    <div>
      {/* Selector de prepagas */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-gray-700 mb-3">
          Seleccioná hasta 3 prepagas para comparar
        </p>
        <div className="flex flex-wrap gap-2">
          {prepagas.map((p) => {
            const activa = seleccionados.includes(p.slug)
            return (
              <button
                key={p.slug}
                onClick={() => togglePrepaga(p.slug)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                  activa
                    ? 'border-[#E8002D] bg-red-50 text-[#E8002D]'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                }`}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: p.colorPrimario }}
                />
                {p.nombre}
                {activa && (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-5 py-4 font-semibold text-gray-500 w-48">Característica</th>
              {prepagasSeleccionadas.map((p) => (
                <th key={p.slug} className="px-5 py-4 text-center">
                  <Link href={`/prepagas/${p.slug}`} className="flex flex-col items-center gap-1 group">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: p.colorPrimario }}
                    >
                      {p.nombre[0]}
                    </div>
                    <span className="font-bold text-gray-900 group-hover:text-[#E8002D] transition-colors text-sm">
                      {p.nombre}
                    </span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {FILAS.map((fila, i) => (
              <tr
                key={fila.key}
                className={`transition-colors hover:bg-red-50/50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
              >
                <td className="px-5 py-3.5 text-gray-600 font-medium text-xs uppercase tracking-wide">
                  {fila.label}
                </td>
                {prepagasSeleccionadas.map((p) => {
                  const vals = valoresMap[p.slug]
                  if (!vals) return <td key={p.slug} className="px-5 py-3.5 text-center text-gray-300">—</td>
                  const val = vals[fila.key as keyof FilaValor]
                  const isBool = BOOL_KEYS.has(fila.key)
                  return (
                    <td key={p.slug} className="px-5 py-3.5 text-center">
                      {isBool ? (
                        <div className="flex justify-center">
                          <Check ok={val as boolean} />
                        </div>
                      ) : (
                        <span className={`text-sm font-semibold ${
                          fila.key === 'satisfaccion' ? 'text-[#00875A]' :
                          fila.key === 'precio' ? 'text-[#E8002D]' : 'text-gray-900'
                        }`}>
                          {String(val)}
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
          {/* Footer con CTAs */}
          <tfoot>
            <tr className="bg-gray-50 border-t border-gray-200">
              <td className="px-5 py-4" />
              {prepagasSeleccionadas.map((p) => (
                <td key={p.slug} className="px-5 py-4 text-center">
                  <Link
                    href={`/prepagas/${p.slug}`}
                    className="inline-flex items-center justify-center px-4 py-2.5 bg-[#E8002D] hover:bg-[#B8001F] text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Ver planes →
                  </Link>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        * Precios para persona de 30 años, contratación directa. Datos actualizados Julio 2026.
      </p>
    </div>
  )
}
