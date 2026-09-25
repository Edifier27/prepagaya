'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useZonaDetectada, type ZonaParaHerramientas } from '@/lib/use-zona-detectada'

// Listado de /sanatorios con filtro por zona (pedido de Darío, 26-sep-2026):
// arranca en la zona de la ubicación aproximada de la persona (misma cookie
// que el cotizador y las herramientas) y se puede cambiar. Sin zona detectada
// (y en el HTML del servidor) muestra todas, así los buscadores ven la lista
// completa.

export interface SanatorioItem { slug: string; nombre: string; zona: string; cartillas: number }

const TODAS = 'Todas'
const sinTildes = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

/** Zona del listado que corresponde a la ubicación detectada, si hay una. */
function zonaDeUbicacion(det: ZonaParaHerramientas | null, zonas: string[]): string | null {
  if (!det) return null
  const label = sinTildes(det.label)
  const porCiudad = zonas.find((z) => z !== 'CABA y GBA' && label.includes(sinTildes(z)))
  if (porCiudad) return porCiudad
  const porProvincia: Record<string, string> = {
    caba: 'CABA y GBA',
    'buenos-aires': 'CABA y GBA',
    cordoba: 'Córdoba',
    'santa-fe': 'Rosario',
    mendoza: 'Mendoza',
    tucuman: 'Tucumán',
    salta: 'Salta',
  }
  const z = porProvincia[det.provincia.slug]
  return z && zonas.includes(z) ? z : null
}

export function SanatoriosPorZona({ items }: { items: SanatorioItem[] }) {
  const zonas = [...new Set(items.map((s) => s.zona))]
  const detectada = useZonaDetectada()
  const zonaDetectada = zonaDeUbicacion(detectada, zonas)
  const [elegida, setElegida] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const zona = elegida ?? zonaDetectada ?? TODAS
  const q = sinTildes(busqueda.trim())
  // Si busca por nombre, busca en todas las zonas
  const visibles = items.filter((s) => (q ? sinTildes(s.nombre).includes(q) : zona === TODAS || s.zona === zona))
  const grupos = zonas.filter((z) => visibles.some((s) => s.zona === z))

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="buscar-sanatorio" className="sr-only">Buscar sanatorio u hospital</label>
        <input
          id="buscar-sanatorio"
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscá un sanatorio u hospital"
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm"
        />
      </div>
      {!q && (
        <div className="flex flex-wrap gap-2 mb-2" role="group" aria-label="Zona">
          {[TODAS, ...zonas].map((z) => (
            <button
              key={z}
              type="button"
              onClick={() => setElegida(z)}
              aria-pressed={zona === z}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${zona === z ? 'border-[#E8002D] bg-[#E8002D] text-white' : 'border-gray-200 text-gray-700 hover:border-[#E8002D] hover:text-[#E8002D]'}`}
            >
              {z}
            </button>
          ))}
        </div>
      )}
      {!q && detectada && zonaDetectada && elegida === null && (
        <p className="text-xs text-gray-500 mb-6">📍 Por tu ubicación aproximada: {detectada.label}. Si no es tu zona, elegí otra.</p>
      )}
      <div className="space-y-8 mt-6">
        {grupos.map((g) => (
          <div key={g}>
            <h2 className="text-lg font-bold text-gray-900 mb-3">{g}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {visibles.filter((s) => s.zona === g).map((s) => (
                <Link key={s.slug} href={`/sanatorios/${s.slug}`} className="group rounded-xl border border-gray-200 hover:border-[#E8002D]/40 p-4 transition-colors">
                  <div className="font-semibold text-gray-900 group-hover:text-[#E8002D]">{s.nombre}</div>
                  <div className="text-xs text-gray-500 mt-0.5">En {s.cartillas} cartillas oficiales relevadas</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
        {!visibles.length && <p className="text-sm text-gray-600">No encontramos ese sanatorio. Probá con otro nombre o mirá <Link href="/buscar-por-sanatorio" className="font-semibold text-[#E8002D] hover:underline">qué prepagas cubren tus sanatorios</Link>.</p>}
      </div>
    </div>
  )
}
