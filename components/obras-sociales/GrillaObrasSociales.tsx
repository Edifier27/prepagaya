'use client'

import { useState } from 'react'
import Link from 'next/link'

// Grilla de obras sociales con "Ver más" (Darío, 3-oct-2026): arriba las 6
// más buscadas en 2 filas de 3, el resto se abre con el botón. Las ocultas
// quedan en el HTML (`hidden`) para que los enlaces internos se indexen igual.

export interface ItemGrilla {
  slug: string
  nombre: string
  bajada: string
  cartilla?: boolean
  coseguro?: string
}

const PRIMERAS = 6

export function GrillaObrasSociales({ items, nombreGrupo }: { items: ItemGrilla[]; nombreGrupo: string }) {
  const [abierta, setAbierta] = useState(false)
  const quedan = items.length - PRIMERAS
  return (
    <div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((o, i) => (
          <li
            key={o.slug}
            hidden={!abierta && i >= PRIMERAS}
            className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col hover:border-[#E8002D]/40 transition-colors"
          >
            <Link href={`/obras-sociales/${o.slug}`} className="font-bold text-gray-900 hover:text-[#E8002D]">
              {o.nombre}
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed mt-1.5 flex-1">{o.bajada}</p>
            {o.coseguro && <p className="text-xs text-gray-500 mt-2">Coseguro por consulta: <strong className="text-gray-800">{o.coseguro}</strong></p>}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm font-semibold">
              <Link href={`/obras-sociales/${o.slug}`} className="text-[#E8002D] hover:underline">Ver ficha →</Link>
              {o.cartilla && (
                <Link href={`/obras-sociales/${o.slug}/cartilla`} className="text-gray-700 hover:text-[#E8002D] hover:underline">Cartilla</Link>
              )}
            </div>
          </li>
        ))}
      </ul>
      {quedan > 0 && (
        <div className="text-center mt-5">
          <button
            type="button"
            onClick={() => setAbierta((x) => !x)}
            aria-expanded={abierta}
            className="px-6 py-2.5 rounded-xl border-2 border-gray-200 hover:border-[#E8002D] text-gray-800 font-bold text-sm"
          >
            {abierta ? 'Ver menos' : `Ver más obras sociales ${nombreGrupo} (${quedan})`}
          </button>
        </div>
      )}
    </div>
  )
}
