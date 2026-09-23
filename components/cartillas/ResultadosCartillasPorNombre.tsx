'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { normalizarTexto } from '@/lib/cartilla-zonas-geo'
import type { EntradaIndice, GrupoIndice } from '@/lib/data/cartilla-zonas/indice-nombres'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'

// Resultados del buscador por nombre contra las cartillas oficiales por zona
// (índice de /api/cartilla-indice). En /cartillas/[prepaga] responde "¿está
// en ESTA prepaga?" y, si no está, en cuáles sí → Cotizar (pedido de Darío).
// El índice se baja una sola vez, recién cuando alguien escribe.

let indicePromesa: Promise<GrupoIndice[]> | null = null
function cargarIndice(): Promise<GrupoIndice[]> {
  indicePromesa ??= fetch('/api/cartilla-indice')
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => {
      indicePromesa = null
      return []
    })
  return indicePromesa
}

// Mismo criterio que el cruce del servidor: mismo lugar si las palabras
// distintivas de uno están todas en el otro.
function mismoNucleo(a: string, b: string): boolean {
  const wa = a.split(' ').filter(Boolean)
  const wb = b.split(' ').filter(Boolean)
  return wa.length > 0 && wb.length > 0 && (wa.every((w) => wb.includes(w)) || wb.every((w) => wa.includes(w)))
}

function Chip({ e }: { e: EntradaIndice }) {
  return (
    <Link
      href={`/cartillas/${e[0]}/${e[3]}`}
      className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-100 hover:border-sky-300"
    >
      {e[1]} · {e[2]} <span className="text-sky-600/70">({e[4]})</span>
    </Link>
  )
}

export function ResultadosCartillasPorNombre({
  query,
  soloPrepagaSlug,
  soloPrepagaNombre,
  ocultarPresentes = false,
  onResultados,
}: {
  query: string
  soloPrepagaSlug?: string
  soloPrepagaNombre?: string
  /** si el buscador curado ya mostró resultados de esta prepaga, no repetirlos */
  ocultarPresentes?: boolean
  /** avisa cuántos grupos encontró (para no mostrar "no encontramos" encima) */
  onResultados?: (n: number) => void
}) {
  const [indice, setIndice] = useState<GrupoIndice[] | null>(null)
  const q = normalizarTexto(query)
  const activo = q.length >= 3

  useEffect(() => {
    if (activo && !indice) cargarIndice().then(setIndice)
  }, [activo, indice])

  const encontrados = useMemo(() => {
    if (!activo || !indice) return []
    const palabras = q.split(' ').filter((w) => w.length >= 2)
    return indice
      .filter((g) => {
        const texto = `${normalizarTexto(g.n)} ${g.k}`
        return palabras.every((w) => texto.includes(w))
      })
      .sort((a, b) => b.en.length - a.en.length)
      .slice(0, 8)
  }, [activo, indice, q])

  // Conservador: si la prepaga tiene un sanatorio con el mismo núcleo de
  // nombre en cualquier zona, no se afirma que "no figura".
  const presentes = soloPrepagaSlug && !ocultarPresentes ? encontrados.filter((g) => g.en.some((e) => e[0] === soloPrepagaSlug)) : []
  const ausentes = soloPrepagaSlug
    ? encontrados.filter(
        (g) =>
          !g.en.some((e) => e[0] === soloPrepagaSlug) &&
          !(indice ?? []).some((h) => h.en.some((e) => e[0] === soloPrepagaSlug) && mismoNucleo(h.k, g.k)),
      )
    : []

  const total = soloPrepagaSlug ? presentes.length + ausentes.length : encontrados.length
  useEffect(() => {
    onResultados?.(total)
  }, [total, onResultados])

  if (!activo || total === 0) return null

  if (!soloPrepagaSlug) {
    return (
      <div className="mt-8">
        <p className="text-xs text-gray-500 text-center mb-3">En las cartillas oficiales por zona:</p>
        <ul className="space-y-2">
          {encontrados.map((g) => (
            <li key={`${g.n}-${g.en[0][3]}`} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl p-4">
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 text-sm">{g.n}</div>
                <div className="flex flex-wrap gap-1.5 mt-1.5">{g.en.map((e) => <Chip key={e[0]} e={e} />)}</div>
              </div>
              <ContratarPlanButton
                prepagaNombre={g.en[0][1]}
                planNombre={g.en[0][2]}
                fuente="buscador-sanatorio-cartillas"
                label={`Cotizar ${g.en[0][1]}`}
                className="flex-shrink-0 inline-flex items-center justify-center px-4 py-2 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-lg transition-all text-xs"
              />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="mt-8 space-y-3">
      {presentes.map((g) => {
        const propia = g.en.find((e) => e[0] === soloPrepagaSlug)!
        return (
          <Link
            key={`p-${g.n}-${propia[3]}`}
            href={`/cartillas/${propia[0]}/${propia[3]}`}
            className="flex items-start justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 hover:border-emerald-400 transition-colors"
          >
            <div>
              <div className="font-semibold text-gray-900 text-sm">{g.n}</div>
              <div className="text-xs text-emerald-800 mt-0.5">
                ✓ Está en la cartilla de {soloPrepagaNombre}: {propia[4]} · {propia[2]}
              </div>
            </div>
            <span className="text-emerald-700 font-semibold text-sm whitespace-nowrap">Ver zona →</span>
          </Link>
        )
      })}
      {ausentes.map((g) => (
        <div key={`a-${g.n}-${g.en[0][3]}`} className="bg-sky-50/60 border border-sky-100 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-semibold text-gray-900 text-sm">{g.n}</div>
              <div className="text-xs text-gray-600 mt-0.5">
                No lo encontramos en la cartilla de {soloPrepagaNombre}, pero está en:
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">{g.en.map((e) => <Chip key={e[0]} e={e} />)}</div>
            </div>
            <ContratarPlanButton
              prepagaNombre={g.en[0][1]}
              planNombre={g.en[0][2]}
              fuente="buscador-sanatorio-cruce"
              label={`Cotizar ${g.en[0][1]}`}
              className="flex-shrink-0 inline-flex items-center justify-center px-4 py-2 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-lg transition-all text-xs"
            />
          </div>
        </div>
      ))}
      <p className="text-[11px] text-gray-400 text-center">
        Según las cartillas oficiales de cada prepaga (sanatorios para internación). Confirmá la cobertura antes de contratar.
      </p>
    </div>
  )
}
