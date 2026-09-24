'use client'

import { useState } from 'react'
import Link from 'next/link'
import { track } from '@vercel/analytics'
import type { CategoriaMonotributo } from '@/lib/data/monotributo'

// Cuánto pagás de obra social en el monotributo con tu grupo familiar
// (24-sep-2026). ARCA: el aporte es por la afiliación individual; por cada
// adherente se paga el mismo importe. Todo con el cuadro oficial vigente.

const pesos = (n: number) => `$${n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export function CalculadoraMonotributo({ categorias }: { categorias: CategoriaMonotributo[] }) {
  const [letra, setLetra] = useState('A')
  const [adherentes, setAdherentes] = useState(0)
  const [tipo, setTipo] = useState<'servicios' | 'venta'>('servicios')
  const cat = categorias.find((c) => c.letra === letra) ?? categorias[0]
  const obraSocial = cat.obraSocial * (1 + adherentes)
  const cuota = (tipo === 'servicios' ? cat.totalServicios : cat.totalVenta) + cat.obraSocial * adherentes

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-xs font-semibold text-gray-600">Tu categoría</span>
          <select value={letra} onChange={(e) => { setLetra(e.target.value); track('monotributo_calculo', { categoria: e.target.value }) }}
            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900">
            {categorias.map((c) => (
              <option key={c.letra} value={c.letra}>Categoría {c.letra} (hasta {pesos(c.ingresosHasta).replace(/,\d\d$/, '')} al año)</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-gray-600">Familiares que sumás</span>
          <select value={adherentes} onChange={(e) => setAdherentes(Number(e.target.value))}
            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900">
            {[0, 1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n === 0 ? 'Solo yo' : `${n} ${n === 1 ? 'adherente' : 'adherentes'}`}</option>)}
          </select>
        </label>
        <fieldset>
          <legend className="text-xs font-semibold text-gray-600">Actividad</legend>
          <div className="mt-1 grid grid-cols-2 gap-1 rounded-xl border border-gray-300 p-1">
            {(['servicios', 'venta'] as const).map((t) => (
              <button key={t} type="button" onClick={() => setTipo(t)} aria-pressed={tipo === t}
                className={`rounded-lg px-2 py-1.5 text-sm font-semibold ${tipo === t ? 'bg-[#E8002D] text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                {t === 'servicios' ? 'Servicios' : 'Venta'}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2" aria-live="polite">
        <div className="rounded-xl bg-red-50 p-4">
          <div className="text-xs font-semibold text-gray-600">Obra social por mes</div>
          <div className="text-2xl font-black text-gray-900 tabular-nums">{pesos(obraSocial)}</div>
          <div className="text-xs text-gray-600 mt-0.5">{adherentes ? `${pesos(cat.obraSocial)} × ${adherentes + 1} personas` : 'Solo el titular'}</div>
        </div>
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="text-xs font-semibold text-gray-600">Cuota total del monotributo</div>
          <div className="text-2xl font-black text-gray-900 tabular-nums">{pesos(cuota)}</div>
          <div className="text-xs text-gray-600 mt-0.5">Impuesto integrado + jubilación + obra social{adherentes ? ' con tus adherentes' : ''}</div>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border-2 border-[#E8002D]/20 p-4">
        <p className="flex-1 text-sm text-gray-700">
          Ese aporte ya lo pagás todos los meses. Con una prepaga que lo tome, pagás solo la diferencia: te decimos cuáles y cuánto, para tu edad y tu zona.
        </p>
        <Link href="/comparador" onClick={() => track('monotributo_cta', { categoria: letra, adherentes })}
          className="shrink-0 inline-flex items-center justify-center px-5 py-2.5 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm">
          Cotizar como monotributista →
        </Link>
      </div>
    </div>
  )
}
