'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { normalizarBusqueda } from '@/lib/busqueda'

// Lista de centros de cartilla con buscador por sanatorio y "Ver más" por
// tandas (Darío, 3-oct-2026). Todas las tarjetas se renderizan siempre y se
// ocultan con `hidden`, así el HTML estático tiene la cartilla completa para
// las búsquedas "[sanatorio] [prepaga]".

const TANDAS = [8, 24, Infinity]
// Con pocas tarjetas no hace falta ni buscador ni "Ver más"
const MINIMO_PARA_FILTRAR = 9

export function ListaFiltrable({
  items,
  textos,
  className,
  itemClassName,
  placeholder = 'Buscá un sanatorio, clínica o localidad…',
}: {
  items: ReactNode[]
  /** Texto de búsqueda de cada item (nombre, dirección, localidad) */
  textos: string[]
  className: string
  itemClassName: string
  placeholder?: string
}) {
  const [texto, setTexto] = useState('')
  const [tanda, setTanda] = useState(0)
  const t = normalizarBusqueda(texto.trim())
  useEffect(() => { setTanda(0) }, [t])

  if (items.length < MINIMO_PARA_FILTRAR) {
    return (
      <ul className={className}>
        {items.map((it, i) => <li key={i} className={itemClassName}>{it}</li>)}
      </ul>
    )
  }

  const normalizados = textos.map((x) => normalizarBusqueda(x))
  const coinciden = items.map((_, i) => !t || normalizados[i].includes(t))
  const total = coinciden.filter(Boolean).length
  const limite = TANDAS[tanda]
  let n = 0
  const visible = coinciden.map((c) => c && n++ < limite)
  const quedan = Math.max(0, total - limite)
  const siguiente = TANDAS[tanda + 1] - limite

  return (
    <div>
      <div className="mb-4">
        <input
          type="search"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={placeholder}
          aria-label="Buscar en la cartilla"
          className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#E8002D] transition-colors bg-white"
        />
        <p className="text-xs text-gray-500 mt-1.5">
          {t ? `${total} resultado${total === 1 ? '' : 's'} para “${texto.trim()}”` : `${items.length} en total`}
        </p>
      </div>
      <ul className={className}>
        {items.map((it, i) => (
          <li key={i} hidden={!visible[i]} className={itemClassName}>{it}</li>
        ))}
      </ul>
      {t && total === 0 && (
        <p className="text-sm text-gray-500 bg-gray-50 border border-gray-100 rounded-xl p-4">
          No aparece en esta lista. Probá con otra parte del nombre o revisá las otras secciones de la cartilla.
        </p>
      )}
      {quedan > 0 && (
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setTanda((x) => Math.min(x + 1, TANDAS.length - 1))}
            className="px-6 py-2.5 rounded-xl border-2 border-gray-200 hover:border-[#E8002D] text-gray-800 font-bold text-sm bg-white"
          >
            {Number.isFinite(siguiente) && quedan > siguiente ? `Ver ${siguiente} más (quedan ${quedan})` : `Ver los ${quedan} restantes`}
          </button>
        </div>
      )}
    </div>
  )
}
