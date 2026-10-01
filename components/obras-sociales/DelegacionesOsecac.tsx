'use client'

import { useMemo, useState } from 'react'
import { normalizarBusqueda } from '@/lib/busqueda'
import type { DelegacionOsecac, GrupoProvinciaOsecac } from '@/lib/data/sindicales-zonas/osecac'

// Buscador de delegaciones de OSECAC por provincia y localidad. Todo el
// listado se renderiza siempre (el filtro solo oculta/muestra del lado del
// cliente, nunca se saca del árbol) para que el HTML estático tenga las 382
// delegaciones completas — "osecac [ciudad]" indexa igual que si no hubiera
// buscador.

function telHref(telefono: string): string {
  return telefono.split('/')[0].trim().replace(/[^\d+]/g, '')
}

function Card({ e }: { e: DelegacionOsecac }) {
  return (
    <li className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="font-semibold text-gray-900 text-sm">{e.nombre}</div>
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{e.tipo}</span>
      </div>
      {e.direccion && <div className="text-sm text-gray-700 mt-1">{e.direccion}</div>}
      {e.delegacion_padre && <div className="text-xs text-gray-500 mt-0.5">Depende de la delegación {e.delegacion_padre}</div>}
      {e.horario && <div className="text-xs text-gray-500 mt-1">{e.horario}</div>}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm">
        {e.telefono && (
          <a href={`tel:${telHref(e.telefono)}`} className="font-semibold text-[#E8002D] hover:underline">
            {e.telefono}
          </a>
        )}
        {e.email_whatsapp && <span className="text-gray-500">{e.email_whatsapp}</span>}
      </div>
    </li>
  )
}

export function DelegacionesOsecac({
  grupos,
  descargado,
  notaProvinciasParciales,
  provinciasParciales,
}: {
  grupos: GrupoProvinciaOsecac[]
  descargado: string | null
  notaProvinciasParciales: string
  provinciasParciales: string[]
}) {
  const [provincia, setProvincia] = useState('')
  const [texto, setTexto] = useState('')

  const t = normalizarBusqueda(texto.trim())
  const visibles = useMemo(() => {
    return grupos
      .filter((g) => !provincia || g.provincia === provincia)
      .map((g) => ({
        ...g,
        entidades: t ? g.entidades.filter((e) => normalizarBusqueda(`${e.nombre} ${e.direccion ?? ''}`).includes(t)) : g.entidades,
      }))
      .filter((g) => g.entidades.length > 0)
  }, [grupos, provincia, t])

  const totalVisible = visibles.reduce((n, g) => n + g.entidades.length, 0)
  const fecha = descargado
    ? new Date(`${descargado}T12:00:00`).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="osecac-provincia" className="block text-sm font-semibold text-gray-900 mb-1.5">
              Provincia
            </label>
            <select
              id="osecac-provincia"
              value={provincia}
              onChange={(e) => setProvincia(e.target.value)}
              className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#E8002D] transition-colors bg-white"
            >
              <option value="">Todo el país</option>
              {grupos.map((g) => (
                <option key={g.provincia} value={g.provincia}>
                  {g.provincia} ({g.entidades.length})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="osecac-busqueda" className="block text-sm font-semibold text-gray-900 mb-1.5">
              Buscar localidad o nombre
            </label>
            <input
              id="osecac-busqueda"
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Ej: Lanús, Rosario, Avellaneda…"
              className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#E8002D] transition-colors bg-white"
            />
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {totalVisible} resultado{totalVisible === 1 ? '' : 's'}
        {provincia ? ` en ${provincia}` : ' en todo el país'}.
      </p>

      <div className="space-y-8">
        {visibles.map((g) => (
          <div key={g.provincia}>
            <h3 className="text-sm font-bold text-gray-900 mb-3">
              {g.provincia} <span className="text-gray-400 font-normal">· {g.entidades.length}</span>
            </h3>
            <ul className="grid gap-3 sm:grid-cols-2">
              {g.entidades.map((e) => (
                <Card key={`${e.tipo}-${e.nombre}-${e.direccion ?? ''}`} e={e} />
              ))}
            </ul>
          </div>
        ))}
        {totalVisible === 0 && <p className="text-sm text-gray-500 py-8 text-center">No encontramos delegaciones que coincidan con la búsqueda.</p>}
      </div>

      <p className="text-xs text-gray-400 leading-relaxed mt-6">
        Fuente: buscador oficial de delegaciones de OSECAC{fecha ? `, consultado el ${fecha}` : ''}.
        {provinciasParciales.length > 0 && ` ${notaProvinciasParciales}`} Antes de ir, confirmá el horario con la delegación.
      </p>
    </div>
  )
}
