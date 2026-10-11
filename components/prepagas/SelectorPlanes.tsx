'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'
import { trackEvent } from '@/lib/analytics'
import type { DatosSelector } from '@/lib/selector-planes'

// Card "estilo Jeep" (Darío, 11-oct-2026, con la captura de jeepargentina.ar):
// la prepaga centrada arriba, el plan elegido en una píldora negra, un
// recuadro negro con el precio oficial, los otros planes como botones grises
// apilados (al tocar uno pasa arriba), lo que tiene el plan con íconos y un
// botón grande "Quiero este plan".

const TONO = {
  rojo: 'bg-[#E8002D] text-white',
  verde: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  azul: 'bg-sky-50 text-sky-700 border border-sky-200',
  violeta: 'bg-violet-50 text-violet-700 border border-violet-200',
} as const

function Icono({ tipo }: { tipo: 'check' | 'copago' | 'cartilla' }) {
  const cls = 'w-6 h-6 shrink-0 text-gray-900'
  if (tipo === 'cartilla') {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={cls}><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M12 7v4M10 9h4" strokeLinecap="round" strokeLinejoin="round" /></svg>
  }
  if (tipo === 'copago') {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={cls}><circle cx="12" cy="12" r="9" /><path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .9-3 2s1.3 1.6 3 2 3 .9 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6.5V8M12 16v1.5" strokeLinecap="round" /></svg>
  }
  return <svg viewBox="0 0 24 24" fill="currentColor" className={cls}><path fillRule="evenodd" d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.7 7.7l-5.5 5.5a1 1 0 01-1.4 0l-2.5-2.5a1 1 0 111.4-1.4l1.8 1.8 4.8-4.8a1 1 0 111.4 1.4z" clipRule="evenodd" /></svg>
}

export function SelectorPlanes({ datos, origen }: { datos: DatosSelector; origen: string }) {
  const { prepaga, planes } = datos
  const [sel, setSel] = useState(planes[0].slug)
  const p = planes.find((x) => x.slug === sel) ?? planes[0]
  const otros = planes.filter((x) => x.slug !== p.slug)
  const cotizar = `/comparador?${new URLSearchParams({ prepaga: prepaga.slug, plan: p.slug, desde: 'selector' })}`
  const puntos: { tipo: 'check' | 'copago' | 'cartilla'; texto: string }[] = [
    { tipo: 'copago', texto: p.copago ? 'Con copago en consultas: cuota más baja' : 'Sin copago en consultas' },
    ...(p.sanatorios ? [{ tipo: 'cartilla' as const, texto: `${p.sanatorios} sanatorios para internación en todo el país${p.cartilla ? ` · cartilla ${p.cartilla}` : ''}` }] : []),
    ...p.incluye.slice(0, 3).map((t) => ({ tipo: 'check' as const, texto: t })),
  ]

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-center gap-2">
        <PrepagaLogo slug={prepaga.slug} nombre={prepaga.nombre} colorPrimario={prepaga.colorPrimario} size="sm" />
        <h3 className="text-2xl font-black text-gray-900 text-center">{prepaga.nombre}</h3>
      </div>

      <div className="mt-4 rounded-full bg-gray-900 py-2.5 text-center text-sm font-bold text-white" aria-live="polite">
        {p.codigo}
      </div>

      <div className="mt-4 rounded-xl bg-gray-900 px-4 py-3 text-center text-white">
        {p.precio30 ? (
          <>
            <div className="text-sm text-gray-300">Precio de lista a los 30 años</div>
            <div className="text-2xl font-black tabular-nums">{p.precio30}<span className="text-sm font-semibold text-gray-300">/mes</span></div>
            <div className="text-xs font-semibold text-red-300 mt-0.5">15% OFF cotizando online</div>
          </>
        ) : (
          <>
            <div className="text-base font-bold">{p.copago ? 'Con copago' : 'Sin copago'}</div>
            <div className="text-xs font-semibold text-red-300 mt-0.5">15% OFF cotizando online</div>
          </>
        )}
      </div>

      {p.globos.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-1">
          {p.globos.map((g) => <span key={g.texto} className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${TONO[g.tono]}`}>{g.texto}</span>)}
        </div>
      )}

      <div className="mt-4 space-y-2" role="tablist" aria-label={`Otros planes de ${prepaga.nombre}`}>
        {otros.map((x) => (
          <button
            key={x.slug}
            type="button"
            role="tab"
            aria-selected={false}
            onClick={() => { setSel(x.slug); trackEvent('selector_plan', { origen, prepaga: prepaga.slug, plan: x.slug }) }}
            className="w-full rounded-full bg-gray-100 py-2.5 text-center text-sm font-semibold text-gray-800 hover:bg-gray-200 transition-colors"
          >
            {x.codigo}
          </button>
        ))}
      </div>

      <ul className="mt-5 space-y-3">
        {puntos.map((pt) => (
          <li key={pt.texto} className="flex items-center gap-3 text-sm font-semibold text-gray-900">
            <Icono tipo={pt.tipo} />
            <span>{pt.texto}</span>
          </li>
        ))}
      </ul>

      <Link
        href={cotizar}
        onClick={() => trackEvent('selector_plan_cotizar', { origen, prepaga: prepaga.slug, plan: p.slug })}
        className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#E8002D] py-3.5 text-base font-bold text-white hover:bg-[#B8001F]"
      >
        Quiero este plan <span aria-hidden>›</span>
      </Link>
      <Link href={p.href} className="mt-2 block text-center text-sm font-semibold text-gray-500 hover:text-[#E8002D] hover:underline">
        Ver todo sobre el {p.codigo}
      </Link>
    </div>
  )
}

/** En el inicio: una sola card, con la prepaga para elegir arriba (Swiss Medical primero) */
export function SelectorPlanesConPrepagas({ lista, origen }: { lista: DatosSelector[]; origen: string }) {
  const [sel, setSel] = useState(lista[0]?.prepaga.slug)
  const d = lista.find((x) => x.prepaga.slug === sel) ?? lista[0]
  if (!d) return null
  return (
    <div>
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {lista.map((x) => (
          <button
            key={x.prepaga.slug}
            type="button"
            onClick={() => { setSel(x.prepaga.slug); trackEvent('selector_prepaga', { origen, prepaga: x.prepaga.slug }) }}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${x.prepaga.slug === d.prepaga.slug ? 'bg-[#E8002D] text-white' : 'border border-gray-200 bg-white text-gray-700 hover:border-[#E8002D]'}`}
          >
            {x.prepaga.nombre}
          </button>
        ))}
      </div>
      <SelectorPlanes key={d.prepaga.slug} datos={d} origen={origen} />
    </div>
  )
}
