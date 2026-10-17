import Link from 'next/link'
import type { Prepaga } from '@/types'
import { PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { formatPrecio, precioDesde } from '@/lib/utils'
import { codigoCorto } from '@/lib/seo/titulos'

// "Compará los N planes de X" arriba de la ficha (17-oct-2026, ola 1 de CTR):
// el título promete comparar los planes en 1 minuto, y la promesa se cumple
// apenas entra la persona. Reemplaza la frase "N planes: A, B, C…": mismos
// planes y el mismo precio desde (respuesta directa para Google y las IA),
// ahora como tarjetas deslizables. El botón lleva al comparador filtrado por
// esta prepaga (/comparador?prepaga=, ya soportado por la página).
export function ComparaPlanesHero({ prep }: { prep: Prepaga }) {
  const planes = [...prep.planes].sort((a, b) => a.precio - b.precio)
  const desde = precioDesde(prep)
  const conPrecio = Number.isFinite(desde)
  const n = planes.length
  return (
    <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm sm:text-base font-bold text-gray-900">
          {n === 1 ? `El plan de ${prep.nombre}` : `Compará los ${n} planes de ${prep.nombre}`}
        </h2>
        {n > 1 && (
          <a href="#diferencias-planes" className="shrink-0 text-xs font-semibold text-[#E8002D] hover:underline">Ver diferencias ↓</a>
        )}
      </div>
      <ul className="mt-2 -mx-1 px-1 flex gap-2 overflow-x-auto snap-x pb-1 [scrollbar-width:none]">
        {planes.map((pl) => (
          <li key={pl.slug} className="snap-start shrink-0">
            <Link href={`/prepagas/${prep.slug}/${pl.slug}`}
              className="block w-[8.5rem] rounded-xl border border-gray-200 px-3 py-2 hover:border-[#E8002D] transition-colors">
              <span className="block text-sm font-bold text-gray-900 truncate">{codigoCorto(pl.nombre)}</span>
              <span className="block text-sm font-semibold text-gray-800 tabular-nums">{formatPrecio(pl.precio)}</span>
              <span className={`block text-[11px] font-medium ${pl.copago ? 'text-gray-500' : 'text-emerald-700'}`}>{pl.copago ? 'Con copago' : 'Sin copago'}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-gray-500">
        {conPrecio
          ? <>Precio de lista desde {formatPrecio(desde)} por mes (30 años, {PRECIO_ACTUALIZADO.toLowerCase()}, cuadro oficial SSSalud).</>
          : <>{prep.nombre} no publica una lista de precios oficial: cada plan se cotiza según tu edad y zona.</>}
      </p>
      <Link href={`/comparador?prepaga=${prep.slug}&desde=ficha-hero`}
        className="mt-3 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#E8002D] hover:bg-[#B8001F] px-5 py-2.5 text-sm font-bold text-white transition-colors">
        {conPrecio ? 'Tu precio en cada plan, en 1 minuto →' : 'Cotizá cada plan en 1 minuto →'}
      </Link>
    </div>
  )
}
