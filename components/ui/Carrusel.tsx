'use client'

import { useRef, type ReactNode } from 'react'

// Carrusel genérico con flechas (compu) y deslizamiento (celular). Las
// tarjetas llegan armadas desde el servidor y quedan todas en el HTML.
// `itemClassName` define el ancho de cada tarjeta (ej. de a tres en la compu).
export function Carrusel({
  items,
  itemClassName = 'basis-[85%] sm:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)]',
  etiqueta = 'tarjetas',
}: {
  items: ReactNode[]
  itemClassName?: string
  /** Para los aria-label de las flechas ("prepagas", "planes"...) */
  etiqueta?: string
}) {
  const pista = useRef<HTMLDivElement>(null)
  const mover = (dir: 1 | -1) => pista.current?.scrollBy({ left: dir * pista.current.clientWidth, behavior: 'smooth' })

  return (
    <div>
      <div className="flex justify-end gap-2 mb-3">
        {([-1, 1] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => mover(d)}
            aria-label={d < 0 ? `Ver ${etiqueta} anteriores` : `Ver más ${etiqueta}`}
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
        className="flex items-start gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((it, i) => (
          <div key={i} className={`snap-start shrink-0 ${itemClassName}`}>
            {it}
          </div>
        ))}
      </div>
    </div>
  )
}
