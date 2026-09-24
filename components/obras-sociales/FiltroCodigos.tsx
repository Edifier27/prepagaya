'use client'

import { useEffect, useState } from 'react'
import { normalizarBusqueda } from '@/lib/busqueda'

// Buscador de /obras-sociales/codigos. La lista la arma el servidor (así
// Google lee los ~400 códigos y no viajan dos veces en el HTML): acá solo se
// esconden las filas que no coinciden y se copia el código al tocar "Copiar".
// Busca en el texto visible de cada fila (nombre, razón social, código con y
// sin guiones, provincia) más los alias de data-a.

interface Props {
  grupos: { id: string; titulo: string; cantidad: number }[]
  total: number
}

export function FiltroCodigos({ grupos, total }: Props) {
  const [q, setQ] = useState('')
  const [grupo, setGrupo] = useState('todos')
  const [visibles, setVisibles] = useState(total)
  const [copiado, setCopiado] = useState<string | null>(null)

  // Filtra en el momento (no en un efecto): esconde filas y secciones vacías.
  function filtrar(nuevoQ: string, nuevoGrupo: string) {
    setQ(nuevoQ)
    setGrupo(nuevoGrupo)
    const lista = document.getElementById('lista-codigos')
    if (!lista) return
    const terminos = normalizarBusqueda(nuevoQ).replace(/-/g, '').split(/\s+/).filter(Boolean)
    let n = 0
    lista.querySelectorAll<HTMLElement>('[data-grupo-seccion]').forEach((sec) => {
      let enSeccion = 0
      const mismoGrupo = nuevoGrupo === 'todos' || sec.dataset.grupoSeccion === nuevoGrupo
      sec.querySelectorAll<HTMLElement>('[data-q]').forEach((fila) => {
        // Texto de búsqueda: lo visible de la fila + alias/sigla (data-a), sin
        // tildes ni guiones. Se calcula una vez y queda en data-q.
        if (!fila.dataset.q) fila.dataset.q = normalizarBusqueda(`${fila.textContent ?? ''} ${fila.dataset.a ?? ''}`).replace(/-/g, '')
        const texto = fila.dataset.q
        const ok = mismoGrupo && terminos.every((t) => texto.includes(t))
        fila.hidden = !ok
        if (ok) enSeccion++
      })
      sec.hidden = enSeccion === 0
      n += enSeccion
    })
    setVisibles(n)
  }

  useEffect(() => {
    const lista = document.getElementById('lista-codigos')
    if (!lista) return
    const copiar = (ev: MouseEvent) => {
      const btn = (ev.target as HTMLElement).closest<HTMLButtonElement>('[data-copiar]')
      if (!btn) return
      const codigo = btn.dataset.copiar ?? ''
      navigator.clipboard?.writeText(codigo).then(() => {
        setCopiado(codigo)
        setTimeout(() => setCopiado((c) => (c === codigo ? null : c)), 1800)
      }).catch(() => {})
    }
    lista.addEventListener('click', copiar)
    return () => lista.removeEventListener('click', copiar)
  }, [])

  return (
    <div className="sticky top-16 z-10 bg-white/95 backdrop-blur border-b border-gray-100 py-3 -mx-4 px-4 sm:mx-0 sm:px-0">
      <label htmlFor="buscar-codigo" className="sr-only">Buscar obra social, prepaga o código</label>
      <input
        id="buscar-codigo"
        type="search"
        value={q}
        onChange={(e) => filtrar(e.target.value, grupo)}
        placeholder="Nombre, sigla o código (ej. OSECAC)"
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#E8002D]/30 focus:border-[#E8002D]"
        autoComplete="off"
      />
      <div className="flex gap-2 mt-3 overflow-x-auto pb-1" role="group" aria-label="Filtrar por tipo">
        {[{ id: 'todos', titulo: 'Todas', cantidad: total }, ...grupos].map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => filtrar(q, g.id)}
            aria-pressed={grupo === g.id}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors ${grupo === g.id ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'}`}
          >
            {g.titulo} <span className={grupo === g.id ? 'text-gray-300' : 'text-gray-400'}>{g.cantidad}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2" aria-live="polite">
        {visibles === total && !q ? `${total} entidades` : visibles === 0 ? 'No encontramos esa obra social. Probá con la sigla o con otra palabra del nombre.' : `${visibles} ${visibles === 1 ? 'resultado' : 'resultados'}`}
        {copiado && <span className="ml-2 font-semibold text-green-700">Código {copiado} copiado</span>}
      </p>
    </div>
  )
}
