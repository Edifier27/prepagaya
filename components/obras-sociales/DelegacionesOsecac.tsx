'use client'

import { useMemo, useState } from 'react'
import { normalizarBusqueda } from '@/lib/busqueda'
import { useZonaDetectada } from '@/lib/use-zona-detectada'
import type { DelegacionOsecac, GrupoProvinciaOsecac } from '@/lib/data/sindicales-zonas/osecac'

// Buscador de delegaciones de OSECAC por provincia y localidad. Todo el
// listado se renderiza siempre (el filtro solo oculta/muestra con `hidden`,
// nunca se saca del árbol) para que el HTML estático tenga las 382
// delegaciones completas — "osecac [ciudad]" indexa igual que si no hubiera
// buscador.
//
// 1-oct-2026 (Darío): no arranca con "Todo el país" (había que scrollear
// mucho). Muestra la provincia de la persona (cookie de geolocalización del
// middleware); si OSECAC no tiene delegaciones ahí, un aviso; si no se
// detecta, pide elegir la provincia.

function telHref(telefono: string): string {
  return telefono.split('/')[0].trim().replace(/[^\d+]/g, '')
}

const TODAS = '__todas__'

function Card({ e, oculta }: { e: DelegacionOsecac; oculta?: boolean }) {
  return (
    <li hidden={oculta} className="rounded-xl border border-gray-200 bg-white p-4">
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
  // '' = sin elegir (se usa la detectada), TODAS = todo el país
  const [elegida, setElegida] = useState('')
  const [texto, setTexto] = useState('')
  const detectada = useZonaDetectada()

  // Provincia detectada → nombre como figura en el listado de OSECAC
  const clave = (s: string) => normalizarBusqueda(s).replace(/[^a-z]/g, '')
  const provDetectada = useMemo(() => {
    if (!detectada) return null
    const { slug, nombre } = detectada.provincia
    const especiales: Record<string, [string, string]> = {
      caba: ['capitalfederal', 'CABA'],
      'buenos-aires': ['buenosaires', 'Buenos Aires'],
      'buenos-aires-interior': ['buenosaires', 'Buenos Aires'],
    }
    const [buscada, nombreVisible] = especiales[slug] ?? [clave(nombre), nombre]
    const grupo = grupos.find((g) => clave(g.provincia) === buscada)
    return { nombre: nombreVisible, grupo: grupo?.provincia ?? null }
  }, [detectada, grupos])

  const provincia = elegida || provDetectada?.grupo || ''
  const t = normalizarBusqueda(texto.trim())
  // Con texto se busca en la provincia elegida o, si no hay, en todo el país
  const visible = (g: GrupoProvinciaOsecac, e: DelegacionOsecac) =>
    (provincia === TODAS || g.provincia === provincia || (!provincia && !!t)) &&
    (!t || normalizarBusqueda(`${e.nombre} ${e.direccion ?? ''}`).includes(t))

  const totalVisible = grupos.reduce((n, g) => n + g.entidades.filter((e) => visible(g, e)).length, 0)
  const sinDelegaciones = !elegida && provDetectada && !provDetectada.grupo
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
              onChange={(e) => setElegida(e.target.value)}
              className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#E8002D] transition-colors bg-white"
            >
              <option value="">Elegí tu provincia</option>
              {grupos.map((g) => (
                <option key={g.provincia} value={g.provincia}>
                  {g.provincia} ({g.entidades.length})
                </option>
              ))}
              <option value={TODAS}>Ver todo el país</option>
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

      {sinDelegaciones && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 mb-6 text-sm text-amber-900">
          OSECAC no tiene delegaciones en <strong>{provDetectada!.nombre}</strong> en su buscador oficial. Elegí otra provincia o buscá
          tu localidad arriba, o comunicate con OSECAC al 0800-666-0400 (beneficiarios).
        </div>
      )}

      {!provincia && !t && !sinDelegaciones && (
        <p className="text-sm text-gray-600 mb-4">Elegí tu provincia o buscá tu localidad para ver las delegaciones.</p>
      )}

      {(provincia || t) && (
        <p className="text-sm text-gray-500 mb-4">
          {totalVisible} resultado{totalVisible === 1 ? '' : 's'}
          {provincia === TODAS || (!provincia && t) ? ' en todo el país' : ` en ${provincia}`}.
          {!elegida && provDetectada?.grupo && ' Según tu ubicación aproximada: podés cambiarla arriba.'}
        </p>
      )}

      <div className="space-y-8">
        {grupos.map((g) => {
          const algunoVisible = g.entidades.some((e) => visible(g, e))
          return (
            <div key={g.provincia} hidden={!algunoVisible}>
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                {g.provincia} <span className="text-gray-400 font-normal">· {g.entidades.length}</span>
              </h3>
              <ul className="grid gap-3 sm:grid-cols-2">
                {g.entidades.map((e) => (
                  <Card key={`${e.tipo}-${e.nombre}-${e.direccion ?? ''}`} e={e} oculta={!visible(g, e)} />
                ))}
              </ul>
            </div>
          )
        })}
        {(provincia || t) && totalVisible === 0 && <p className="text-sm text-gray-500 py-8 text-center">No encontramos delegaciones que coincidan con la búsqueda.</p>}
      </div>

      <p className="text-xs text-gray-400 leading-relaxed mt-6">
        Fuente: buscador oficial de delegaciones de OSECAC{fecha ? `, consultado el ${fecha}` : ''}.
        {provinciasParciales.length > 0 && ` ${notaProvinciasParciales}`} Antes de ir, confirmá el horario con la delegación.
      </p>
    </div>
  )
}
