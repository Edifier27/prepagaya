'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'

// "Otros planes" en carrusel (Darío, 4-oct-2026): tarjetas de a tres que se
// pasan con flechas (o deslizando en el celular). Arranca por los planes de
// arriba del actual y después siguen los más económicos, así desde el SMG20
// se ve SMG30, SMG40, SMG50… y desde el SMG70 los de abajo. Todas las
// tarjetas están en el HTML (los links se indexan igual).

export interface TarjetaPlan {
  slug: string
  nombre: string
  href: string
  /** "Plan superior" / "Más económico" */
  relacion: 'superior' | 'economico'
  precio: string
  copago: boolean
  redAbierta: boolean
  destacado?: boolean
  cartilla?: string
}

export function CarruselPlanes({ planes, origen }: { planes: TarjetaPlan[]; origen: string }) {
  const pista = useRef<HTMLDivElement>(null)
  const mover = (dir: 1 | -1) => {
    const el = pista.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div className="flex justify-end gap-2 mb-3">
        {[-1, 1].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => mover(d as 1 | -1)}
            aria-label={d < 0 ? 'Planes anteriores' : 'Más planes'}
            className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:border-[#E8002D] hover:text-[#E8002D] text-gray-600 flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="w-4 h-4">
              <path d={d < 0 ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
            </svg>
          </button>
        ))}
      </div>
      <div
        ref={pista}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {planes.map((p) => (
          <Link
            key={p.slug}
            href={p.href}
            onClick={() => trackEvent('carrusel_plan_click', { origen, destino: p.slug })}
            className="snap-start shrink-0 basis-[80%] sm:basis-[calc((100%-1.5rem)/3)] rounded-2xl border-2 border-gray-100 hover:border-[#E8002D]/40 bg-white p-4 flex flex-col gap-2 transition-colors group"
          >
            <div className="flex items-center justify-between gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wide ${p.relacion === 'superior' ? 'text-[#E8002D]' : 'text-emerald-700'}`}>
                {p.relacion === 'superior' ? '↑ Plan superior' : '↓ Más económico'}
              </span>
              {p.destacado && <span className="text-[10px] bg-[#E8002D] text-white px-2 py-0.5 rounded-full font-bold">MÁS ELEGIDO</span>}
            </div>
            <div className="font-bold text-gray-900 group-hover:text-[#E8002D] transition-colors">{p.nombre}</div>
            {p.cartilla && <span className="self-start text-[10px] bg-red-50 text-[#E8002D] px-2 py-0.5 rounded-full font-bold">{p.cartilla}</span>}
            <div className="text-xs text-gray-500">{p.copago ? 'Con copago' : 'Sin copago'} · Red {p.redAbierta ? 'abierta' : 'cerrada'}</div>
            <div className="mt-auto pt-2 border-t border-gray-100">
              <div className="text-[11px] text-gray-400">Precio de lista, 30 años</div>
              <div className="text-lg font-black text-gray-900 tabular-nums">{p.precio}<span className="text-xs font-semibold text-gray-400">/mes</span></div>
            </div>
            <span className="text-sm font-semibold text-[#E8002D]">Ver el plan →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
