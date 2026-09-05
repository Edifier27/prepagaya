'use client'

import { useState } from 'react'
import { CartillaModal } from '@/components/comparador/CartillaModal'
import type { Plan, Prepaga } from '@/types'

interface Props {
  prepaga: Prepaga
  plan: Plan
  zonaKey: string
  provinciaNombre: string
  className?: string
}

// Wrapper con estado propio para reutilizar CartillaModal (ya construido y
// probado dentro del comparador) también en las páginas estáticas de SEO,
// donde no hay un componente padre manejando el open/close del modal.
export function CartillaModalTrigger({ prepaga, plan, zonaKey, provinciaNombre, className }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={className ?? 'inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#E8002D] border-2 border-gray-200 hover:border-red-200 rounded-lg px-3 py-2 transition-colors whitespace-nowrap flex-shrink-0'}
      >
        Ver cartilla
      </button>
      {open && (
        <CartillaModal
          prepaga={prepaga}
          plan={plan}
          zonaKey={zonaKey}
          provinciaNombre={provinciaNombre}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
