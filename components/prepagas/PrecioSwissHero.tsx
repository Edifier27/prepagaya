'use client'

// Caja de precio arriba de la ficha de Swiss Medical (Darío, 28-oct-2026):
// edad, "con pareja" y particular/monotributo recalculan el precio de cada
// plan con el cuadro oficial SSSalud, con el 15% OFF (25% monotributistas)
// tachando el precio de lista. Arranca en el SMG20. Va dentro de la grilla
// del hero: devuelve la caja y la lista como dos celdas, para que en el
// celular la caja quede justo después del título y la respuesta directa.
import { useState, type ReactNode } from 'react'
import { formatPrecio, EDAD_MAX_INGRESO } from '@/lib/utils'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'

export interface PlanCaja {
  slug: string
  nombre: string
  copago: boolean
  rangos: { desde: number; hasta: number; precio: number }[]
}

const EDAD_MIN = 18
const DESCUENTOS = { particular: 0.15, monotributo: 0.25 } as const

const Tilde = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 flex-shrink-0 text-emerald-600" aria-hidden>
    <path d="M5 12.5l4 4 10-10" />
  </svg>
)

function Segmento<T extends string | number>({ etiqueta, opciones, valor, onChange }: { etiqueta: string; opciones: { v: T; texto: string }[]; valor: T; onChange: (v: T) => void }) {
  return (
    <div role="group" aria-label={etiqueta} className="flex rounded-xl bg-gray-100 p-0.5">
      {opciones.map((o) => (
        <button key={String(o.v)} type="button" aria-pressed={valor === o.v} onClick={() => onChange(o.v)}
          className={`rounded-[10px] px-3 py-2 text-[13px] font-semibold transition ${valor === o.v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
          {o.texto}
        </button>
      ))}
    </div>
  )
}

export function PrecioSwissHero({ prepagaNombre, planes, planInicial, chips, fuente, children }: {
  prepagaNombre: string
  /** Ordenados por precio */
  planes: PlanCaja[]
  planInicial: string
  chips: string[]
  fuente: string
  /** Lo que sigue a la lista (opiniones, descripción, botones) */
  children?: ReactNode
}) {
  const [edad, setEdad] = useState(30)
  const [personas, setPersonas] = useState(1)
  const [condicion, setCondicion] = useState<keyof typeof DESCUENTOS>('particular')
  const [sel, setSel] = useState(planInicial)
  const pct = DESCUENTOS[condicion]
  const txtPct = `${Math.round(pct * 100)}% OFF`
  const precioDe = (pl: PlanCaja) => {
    const r = pl.rangos.find((x) => x.desde <= edad && edad <= x.hasta) ?? pl.rangos[pl.rangos.length - 1]
    return r.precio * personas
  }
  const plan = planes.find((p) => p.slug === sel) ?? planes[0]
  const lista = precioDe(plan)
  const final = lista * (1 - pct)
  const quienes = personas === 1 ? `una persona de ${edad} años` : `2 personas de ${edad} años`

  return (
    <>
      <div className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-stretch">
        <aside aria-label="Tu precio" className="overflow-hidden rounded-[22px] border-2 border-[#E8002D] bg-white shadow-[0_22px_48px_-28px_rgba(22,18,26,0.35)] lg:sticky lg:top-20">
          <div className="flex flex-wrap justify-between gap-2 bg-gradient-to-r from-[#6E0B22] to-[#E8002D] px-4 py-2.5 text-[13px] text-white">
            <b className="font-extrabold">{txtPct} cotizando online</b>
            <span>25% monotributistas</span>
          </div>
          <div className="flex flex-col gap-3.5 p-[18px]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Para</span>
              <Segmento etiqueta="Quiénes" valor={personas} onChange={setPersonas} opciones={[{ v: 1, texto: 'Solo yo' }, { v: 2, texto: 'Con pareja' }]} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Edad</span>
              <div className="flex items-center gap-1 rounded-xl border border-gray-200 p-0.5">
                <button type="button" onClick={() => setEdad((e) => Math.max(EDAD_MIN, e - 1))} aria-label="Restar un año"
                  className="grid h-9 w-9 place-items-center rounded-[10px] text-lg font-bold text-gray-800 hover:bg-gray-100">−</button>
                <output aria-live="polite" className="min-w-[70px] text-center text-[15px] font-extrabold tabular-nums text-gray-900">{edad} años</output>
                <button type="button" onClick={() => setEdad((e) => Math.min(EDAD_MAX_INGRESO, e + 1))} aria-label="Sumar un año"
                  className="grid h-9 w-9 place-items-center rounded-[10px] text-lg font-bold text-gray-800 hover:bg-gray-100">+</button>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Condición</span>
              <Segmento etiqueta="Condición" valor={condicion} onChange={setCondicion} opciones={[{ v: 'particular', texto: 'Particular' }, { v: 'monotributo', texto: 'Monotributo' }]} />
            </div>
            <div className="flex flex-col gap-0.5 border-t border-dashed border-gray-200 pt-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Plan <span className="text-gray-900">{plan.nombre}</span></span>
              <span className="text-[13px] tabular-nums text-gray-400 line-through">{formatPrecio(lista)}</span>
              <span className="text-[38px] font-extrabold leading-tight tracking-tight tabular-nums text-gray-900">{formatPrecio(final)} <span className="text-sm font-medium text-gray-500">/mes</span></span>
              <span className="self-start rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-extrabold text-emerald-700">Ahorrás {formatPrecio(lista - final)} por mes</span>
              <span className="mt-1 text-xs text-gray-500">Para {quienes}. {plan.copago ? 'Con copago.' : 'Sin copago.'}</span>
            </div>
            <ContratarPlanButton
              prepagaNombre={prepagaNombre}
              planNombre={plan.nombre}
              fuente={fuente}
              conPromo
              textoPromo={txtPct}
              edadesIniciales={personas === 1 ? `${edad} años` : `2 personas de ${edad} años`}
              datosExtra={{ situacion_laboral: condicion === 'monotributo' ? 'Monotributista' : 'Particular' }}
              titulo={`Tu precio con ${txtPct}`}
              label={`Quiero mi precio con ${txtPct}`}
              className="flex h-[50px] w-full items-center justify-center gap-1.5 rounded-[14px] bg-[#E8002D] text-base font-bold text-white transition hover:bg-[#B8001F]"
            />
            <span className="text-center text-[13px] text-gray-500">Un asesor oficial te confirma el precio final por WhatsApp.</span>
          </div>
        </aside>
      </div>

      <div className="flex min-w-0 flex-col gap-4 lg:col-start-1 lg:row-start-2">
        <ul className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <li key={c} className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-[13px] font-semibold text-gray-900"><Tilde />{c}</li>
          ))}
        </ul>
        <h2 id="planes-a-tu-edad" className="text-[17px] font-extrabold text-gray-900">Los planes a tu edad</h2>
        <div role="group" aria-labelledby="planes-a-tu-edad" className="flex flex-col overflow-hidden rounded-[18px] border border-gray-200">
          {planes.map((pl, i) => {
            const p = precioDe(pl)
            const activo = pl.slug === plan.slug
            return (
              <button key={pl.slug} type="button" aria-pressed={activo} onClick={() => setSel(pl.slug)}
                className={`grid grid-cols-[20px_minmax(0,1fr)_auto] items-center gap-3 px-3.5 py-3 text-left transition ${i ? 'border-t border-gray-200' : ''} ${activo ? 'bg-[#fff1f3]' : 'bg-white hover:bg-gray-50'}`}>
                <span aria-hidden className={`h-[18px] w-[18px] rounded-full ${activo ? 'border-[5px] border-[#E8002D]' : 'border-2 border-gray-300'}`} />
                <span className="min-w-0">
                  <span className="font-bold text-gray-900">{pl.nombre}</span>
                  {pl.slug === planInicial && <span className="ml-1.5 rounded-full bg-[#E8002D] px-[7px] py-0.5 align-[2px] text-[10.5px] font-extrabold text-white">Recomendado</span>}
                  <span className={`block text-[12.5px] ${pl.copago ? 'text-gray-500' : 'font-semibold text-emerald-700'}`}>{pl.copago ? 'Con copago' : 'Sin copago'}</span>
                </span>
                <span className="text-right tabular-nums">
                  <span className="block text-xs text-gray-400 line-through">{formatPrecio(p)}</span>
                  <span className="text-base font-extrabold text-gray-900">{formatPrecio(p * (1 - pct))}</span>
                </span>
              </button>
            )
          })}
        </div>
        {children}
      </div>
    </>
  )
}
