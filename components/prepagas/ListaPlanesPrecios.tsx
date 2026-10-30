import Link from 'next/link'
import type { Prepaga, Plan } from '@/types'
import { formatPrecio } from '@/lib/utils'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'
import { getGrupoCartilla } from '@/lib/data/cartilla-grupos'

// Lista de planes de la ficha (Darío, 28-oct-2026): mismo diseño que la
// tarjeta "Los planes a tu edad" que tuvo arriba la ficha de Swiss, en todas
// las prepagas. Precio a los 30 años; en Swiss, el de lista tachado y el
// final con 15% OFF online (la promo es solo de Swiss).
const DESCUENTO_SWISS = 0.15

export function ListaPlanesPrecios({ prep, destacado }: { prep: Prepaga; destacado: Plan }) {
  const conPromo = prep.slug === 'swiss-medical'
  const planes = [...prep.planes].sort((a, b) => a.precio - b.precio)
  return (
    <ul className="flex flex-col overflow-hidden rounded-[18px] border border-gray-200">
      {planes.map((pl, i) => {
        const conPrecio = Number.isFinite(pl.precio)
        const grupo = getGrupoCartilla(prep.slug, pl.slug)
        const esDestacado = pl.slug === destacado.slug
        return (
          <li key={pl.slug}
            className={`relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-4 py-3.5 cursor-pointer ${i ? 'border-t border-gray-200' : ''} ${esDestacado ? 'bg-[#fff1f3]' : 'bg-white'}`}>
            {/* Toda la fila es clickeable (Clarity, 30-oct-2026: clics fallidos
                en la tarjeta del plan): el link se estira con after:inset-0 y
                el botón de cotizar queda encima con z-10. */}
            <Link href={`/prepagas/${prep.slug}/${pl.slug}`} className="group min-w-0 after:absolute after:inset-0 after:content-['']">
              <span className="font-bold text-gray-900 group-hover:text-[#E8002D]">{pl.nombre}</span>
              {esDestacado && <span className="ml-1.5 rounded-full bg-[#E8002D] px-[7px] py-0.5 align-[2px] text-[10.5px] font-extrabold text-white">Más elegido</span>}
              <span className="block text-[12.5px] text-gray-500">
                <span className={pl.copago ? '' : 'font-semibold text-emerald-700'}>{pl.copago ? 'Con copago' : 'Sin copago'}</span>
                {' · '}Red {pl.redAbierta ? 'abierta' : 'cerrada'}
                {grupo && <> · {grupo.nombre}</>}
              </span>
              <span className="mt-0.5 hidden text-xs text-gray-500 sm:line-clamp-1">{pl.descripcion}</span>
            </Link>
            <div className="relative z-10 flex flex-col items-end gap-1.5">
              <span className="text-right tabular-nums">
                {conPrecio && conPromo && <span className="block text-xs text-gray-400 line-through">{formatPrecio(pl.precio)}</span>}
                <span className="text-base font-extrabold text-gray-900">
                  {conPrecio ? formatPrecio(conPromo ? pl.precio * (1 - DESCUENTO_SWISS) : pl.precio) : 'A cotizar'}
                </span>
                {conPrecio && <span className="text-xs font-medium text-gray-500"> /mes</span>}
              </span>
              <ContratarPlanButton
                prepagaNombre={prep.nombre}
                planNombre={pl.nombre}
                fuente="ficha-prepaga"
                conPromo={conPromo}
                label={conPromo ? 'Cotizar con 15% OFF' : 'Cotizar plan'}
                className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg bg-[#E8002D] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#B8001F]"
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
