'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { prepagas } from '@/lib/data/prepagas'
import { formatPrecio, precioDeriva } from '@/lib/utils'

function mult(edad: number): number {
  if (edad <= 18) return 0.3
  if (edad <= 25) return 0.75
  if (edad <= 35) return 1.0
  if (edad <= 45) return 1.45
  if (edad <= 55) return 2.05
  if (edad <= 65) return 2.85
  return 3.6
}

type Modalidad = 'particular' | 'dependencia'

interface Props {
  /** Si se pasa, muestra solo los planes de esa prepaga */
  prepagaSlug?: string
  compact?: boolean
}

export function CalculadoraSlider({ prepagaSlug, compact = false }: Props) {
  const [edad, setEdad] = useState(30)
  const [modalidad, setModalidad] = useState<Modalidad>('particular')

  const datos = useMemo(() => {
    const fuente = prepagaSlug
      ? prepagas.filter((p) => p.slug === prepagaSlug)
      : prepagas

    return fuente.flatMap((p) =>
      p.planes.map((pl) => {
        const base = modalidad === 'dependencia' ? precioDeriva(pl.precio) : pl.precio
        const precio30 = base
        const precioEdad = Math.round(base * mult(edad))
        const diferencia = precioEdad - precio30
        return {
          prepagaSlug: p.slug,
          prepagaNombre: p.nombre,
          colorPrimario: p.colorPrimario,
          planNombre: pl.nombre,
          planSlug: pl.slug,
          destacado: pl.destacado,
          copago: pl.copago,
          precio30,
          precioEdad,
          diferencia,
        }
      })
    ).sort((a, b) => a.precioEdad - b.precioEdad)
  }, [edad, modalidad, prepagaSlug])

  const multiplier = mult(edad)
  const variacionPct = Math.round((multiplier - 1) * 100)

  return (
    <div className={compact ? '' : 'bg-white rounded-2xl border border-gray-200 shadow-sm p-6'}>
      {!compact && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Calculadora de precio por edad
          </h2>
          <p className="text-sm text-gray-500">
            Mové el slider para ver el precio exacto para tu edad en tiempo real
          </p>
        </div>
      )}

      {/* Controles */}
      <div className="space-y-5 mb-8">
        {/* Slider de edad */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Tu edad</label>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-[#E8002D]">{edad}</span>
              <span className="text-sm text-gray-500">años</span>
              {variacionPct !== 0 && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  variacionPct > 0
                    ? 'bg-red-50 text-red-600 border border-red-100'
                    : 'bg-green-50 text-green-600 border border-green-100'
                }`}>
                  {variacionPct > 0 ? '+' : ''}{variacionPct}% vs 30 años
                </span>
              )}
            </div>
          </div>
          <input
            type="range"
            min={18}
            max={70}
            value={edad}
            onChange={(e) => setEdad(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E8002D]"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>18 años</span>
            <span>30</span>
            <span>40</span>
            <span>50</span>
            <span>60</span>
            <span>70 años</span>
          </div>
        </div>

        {/* Toggle modalidad */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Modalidad de contratación</label>
          <div className="flex gap-2">
            {([
              { id: 'particular' as Modalidad, label: 'Particular / Monotributo', sub: 'Con IVA 21%' },
              { id: 'dependencia' as Modalidad, label: 'Relación de dependencia', sub: 'Sin IVA (Lista Deriva)' },
            ]).map((opt) => (
              <button
                key={opt.id}
                onClick={() => setModalidad(opt.id)}
                className={`flex-1 text-left px-4 py-3 rounded-xl border-2 transition-all text-sm ${
                  modalidad === opt.id
                    ? 'border-[#E8002D] bg-red-50'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className={`font-semibold ${modalidad === opt.id ? 'text-[#E8002D]' : 'text-gray-800'}`}>
                  {opt.label}
                </div>
                <div className="text-xs text-gray-500">{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="space-y-2">
        {(compact ? datos.slice(0, 6) : datos).map((d, i) => (
          <Link
            key={`${d.prepagaSlug}-${d.planSlug}`}
            href={`/prepagas/${d.prepagaSlug}/${d.planSlug}`}
            className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl hover:bg-red-50 hover:border-red-200 border border-transparent transition-all group"
          >
            <span className="text-xs text-gray-400 w-4 text-center font-semibold">{i + 1}</span>
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: d.colorPrimario }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors">
                  {d.prepagaNombre}
                </span>
                <span className="text-xs text-gray-400">— {d.planNombre}</span>
                {d.destacado && (
                  <span className="text-xs bg-red-100 text-[#E8002D] font-bold px-1.5 py-0.5 rounded-full">★</span>
                )}
                {!d.copago && (
                  <span className="text-xs bg-green-50 text-green-700 font-medium px-1.5 py-0.5 rounded-full border border-green-100">
                    sin copago
                  </span>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-bold text-[#E8002D] text-sm">{formatPrecio(d.precioEdad)}</div>
              {d.diferencia !== 0 && (
                <div className={`text-xs ${d.diferencia > 0 ? 'text-red-400' : 'text-green-500'}`}>
                  {d.diferencia > 0 ? '+' : ''}{formatPrecio(Math.abs(d.diferencia))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {compact && datos.length > 6 && (
        <div className="mt-4 text-center">
          <Link
            href="/calculadora-costo"
            className="text-sm font-semibold text-[#E8002D] hover:underline"
          >
            Ver todos los planes para {edad} años →
          </Link>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-4 text-center">
        Precios orientativos · persona de {edad} años contratación directa · Julio 2026
      </p>
    </div>
  )
}
