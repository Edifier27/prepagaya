'use client'

// Caja de precio de la ficha de cada plan (Darío, 25-oct-2026, "tipo Mercado
// Libre"): precio de lista estimado según la edad (y la de la pareja), con
// IVA, a la derecha, y el botón de cotizar abajo. Los precios son los del
// cuadro oficial SSSalud que ya usa la página (escalaPorEdad). La promo
// aparece solo en Swiss Medical; en el resto, sin promociones.
import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { formatPrecio } from '@/lib/utils'

interface Props {
  titulo: string
  /** Escala oficial por edad; null si el plan no tiene cuadro */
  rangos: { desde: number; hasta: number; precio: number }[] | null
  /** "CABA y GBA", "Córdoba"…: dónde vale el precio */
  region: string
  promo: { corta: string; detalle: string } | null
  /** Botón que abre el formulario (ContratarPlanButton) */
  cta: ReactNode
  hrefComparar: string
}

const EDAD_MIN = 18

export function CajaPrecioPlan({ titulo, rangos, region, promo, cta, hrefComparar }: Props) {
  const edadMax = rangos ? Math.min(75, Math.max(...rangos.map((r) => r.desde))) : 65
  const [edades, setEdades] = useState<number[]>([30])
  const precioDe = (e: number) => rangos?.find((r) => r.desde <= e && e <= r.hasta)?.precio ?? null
  const precios = edades.map(precioDe)
  const total = precios.every((p) => p !== null) ? (precios as number[]).reduce((a, b) => a + b, 0) : null
  const roles = ['Titular', 'Pareja']
  const cambiar = (i: number, e: number) => setEdades((xs) => xs.map((x, j) => (j === i ? Math.min(edadMax, Math.max(EDAD_MIN, e)) : x)))

  return (
    <div className="mb-5 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_18px_40px_-24px_rgba(22,18,26,0.35)]">
      {promo && (
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 bg-gradient-to-r from-[#6E0B22] to-[#E8002D] px-5 py-2 text-white">
          <span className="text-sm font-extrabold">{promo.corta}</span>
          <span className="text-xs text-red-100">{promo.detalle}</span>
        </div>
      )}
      <div className="grid gap-5 p-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:p-6">
        {/* Izquierda: para quién es */}
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-gray-900">{titulo}</p>
            <p className="text-xs text-gray-600">Este plan es ideal para los que buscan una cobertura de calidad al mejor precio.</p>
          </div>
          {rangos ? (
            <>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500">Calculá tu precio según la edad</p>
              {edades.map((e, i) => (
                <div key={i} className="flex items-center justify-between gap-2 rounded-2xl border border-gray-200 px-3 py-2">
                  <div>
                    <label htmlFor={`caja-edad-${i}`} className="text-sm font-bold text-gray-800">{roles[i]}</label>
                    {i > 0 && (
                      <button type="button" onClick={() => setEdades((xs) => xs.slice(0, 1))} className="block text-xs font-semibold text-gray-500 hover:text-[#E8002D]">Quitar</button>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => cambiar(i, e - 1)} aria-label={`Restar un año a ${roles[i]}`}
                      className="grid h-9 w-9 place-items-center rounded-xl border border-gray-200 bg-gray-50 text-lg font-extrabold text-gray-800 hover:border-[#E8002D]">−</button>
                    <input id={`caja-edad-${i}`} inputMode="numeric" value={e}
                      onChange={(ev) => { const v = parseInt(ev.target.value.replace(/\D/g, ''), 10); if (Number.isFinite(v)) setEdades((xs) => xs.map((x, j) => (j === i ? v : x))) }}
                      onBlur={() => cambiar(i, e)}
                      className="w-11 bg-transparent text-center text-base font-extrabold tabular-nums text-gray-900 focus:outline-none" />
                    <button type="button" onClick={() => cambiar(i, e + 1)} aria-label={`Sumar un año a ${roles[i]}`}
                      className="grid h-9 w-9 place-items-center rounded-xl border border-gray-200 bg-gray-50 text-lg font-extrabold text-gray-800 hover:border-[#E8002D]">+</button>
                    <span className="ml-1 text-xs text-gray-500">años</span>
                  </div>
                </div>
              ))}
              {edades.length === 1 && (
                <button type="button" onClick={() => setEdades((xs) => [...xs, xs[0]])}
                  className="self-start rounded-xl border border-dashed border-gray-300 px-3 py-2 text-sm font-bold text-[#E8002D] hover:border-[#E8002D]">+ Sumar a mi pareja</button>
              )}
              {edades.length > 1 && total !== null && (
                <div className="flex flex-col gap-1 border-t border-dashed border-gray-200 pt-2 text-sm">
                  {edades.map((e, i) => (
                    <div key={i} className="flex justify-between gap-2 text-gray-600"><span>{roles[i]} · {e} años</span><span className="font-bold tabular-nums">{formatPrecio(precios[i]!)}</span></div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-xs text-gray-500">Este plan no tiene lista de precios oficial: un asesor te lo cotiza para tu edad y tu zona.</p>
          )}
        </div>

        {/* Derecha: precio y botón */}
        <div className="flex flex-col gap-3 sm:border-l sm:border-gray-100 sm:pl-5">
          {total !== null && (
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500">Precio estimado</p>
              <p className="flex flex-wrap items-baseline gap-1.5">
                <span className="text-4xl font-extrabold tracking-tight tabular-nums text-gray-900">{formatPrecio(total)}</span>
                <span className="text-sm text-gray-500">/mes</span>
              </p>
              <p className="text-xs text-gray-500">Precio de lista con IVA incluido{region ? ` · ${region}` : ''}</p>
            </div>
          )}
          <p className="rounded-2xl bg-red-50 px-3.5 py-2.5 text-sm text-gray-800">
            <strong className="text-[#B8001F]">Conseguí un mejor precio.</strong>{' '}
            {promo ? `Cotizá a tu medida con ${promo.corta} y un asesor oficial te pasa tu precio final por WhatsApp.` : 'Cotizá a tu medida y un asesor te pasa tu precio final por WhatsApp.'}
          </p>
          {cta}
          <Link href={hrefComparar} className="text-center text-sm font-semibold text-gray-600 underline-offset-2 hover:text-[#E8002D] hover:underline">
            Comparar este plan con otro →
          </Link>
        </div>
      </div>
    </div>
  )
}
