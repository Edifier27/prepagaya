'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { leerZonaGeoDeCookie } from '@/lib/geo-zonas'
import { normalizarTexto, zonaParaUbicacion, type ZonaCartillaIndice } from '@/lib/cartilla-zonas-geo'
import type { CentroCartilla, ZonaCartilla } from '@/lib/data/cartilla-zonas'

export interface SanatorioRenombre {
  nombre: string
  aliases: string[]
}

interface Props {
  prepagaSlug: string
  prepagaNombre: string
  planNombre: string
  /** Id del plan en la cartilla oficial (ej. "SMG20", "310", "Integral") */
  planCartillaId: string
  labelGuardia: string
  /** Lista curada de sanatorios de referencia (lib/data/sanatorios.ts) */
  renombre: SanatorioRenombre[]
}

// Palabras que no identifican a un sanatorio ("Sanatorio", "Clínica"...): se
// ignoran al comparar el nombre de la cartilla con la lista curada.
const GENERICAS = new Set(['sanatorio', 'clinica', 'hospital', 'instituto', 'centro', 'medico', 'de', 'del', 'la', 'las', 'los', 'el', 'y', 'sede', 'fundacion', 'privado', 'privada'])
const tokens = (t: string) => normalizarTexto(t).split(' ').filter((w) => w.length > 2 && !GENERICAS.has(w))

function ubicacion(c: CentroCartilla): string {
  const s = c.sedes[0]
  return [s?.direccion, s?.localidad].filter(Boolean).join(', ')
}

// Recuadro "Sanatorios de renombre con este plan en tu zona" (Darío,
// 23-sep-2026): toma la zona detectada por IP (misma cookie que el banner
// "Vemos que estás en…"), trae la cartilla oficial de esa zona y muestra SOLO
// los centros del plan que coinciden con la lista curada de sanatorios de
// referencia, en un recuadro aparte del resto de la cartilla. Se completa
// después de hidratar: el HTML estático es igual para todos (sin cloaking).
export function CartillaPlanTuZona({ prepagaSlug, prepagaNombre, planNombre, planCartillaId, labelGuardia, renombre }: Props) {
  // Índice de zonas desde la API estática (no embebido en el HTML del plan)
  const [grupos, setGrupos] = useState<{ provincia: string; zonas: ZonaCartillaIndice[] }[]>([])
  useEffect(() => {
    fetch(`/api/cartilla-zonas/${prepagaSlug}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setGrupos)
      .catch(() => {})
  }, [prepagaSlug])
  const indice = useMemo(() => grupos.flatMap((g) => g.zonas), [grupos])
  const [zonaSlug, setZonaSlug] = useState('')
  const [detectada, setDetectada] = useState<string | null>(null)
  const [datos, setDatos] = useState<ZonaCartilla | null>(null)
  const [cargando, setCargando] = useState(false)
  const [verTodos, setVerTodos] = useState(false)

  useEffect(() => {
    if (indice.length === 0) return
    const geo = leerZonaGeoDeCookie()
    const slug = zonaParaUbicacion(indice, geo)
    if (slug) {
      setZonaSlug(slug)
      setDetectada(geo?.label ?? null)
    }
  }, [indice])

  useEffect(() => {
    if (!zonaSlug) return
    let cancelado = false
    setCargando(true)
    fetch(`/api/cartilla-zona/${prepagaSlug}/${zonaSlug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((z: ZonaCartilla | null) => { if (!cancelado) setDatos(z) })
      .catch(() => { if (!cancelado) setDatos(null) })
      .finally(() => { if (!cancelado) setCargando(false) })
    return () => { cancelado = true }
  }, [prepagaSlug, zonaSlug])

  // Claves de la lista curada: cada nombre/alias como conjunto de palabras
  const claves = useMemo(
    () => renombre.flatMap((s) => [s.nombre, ...s.aliases].map(tokens)).filter((k) => k.length > 0),
    [renombre],
  )
  const esRenombre = (c: CentroCartilla) => {
    const t = new Set(tokens(c.nombre))
    return claves.some((k) => k.every((w) => t.has(w)))
  }

  const delPlan = datos?.centros.filter((c) => c.internacion.includes(planCartillaId) || c.guardia.includes(planCartillaId)) ?? []
  const destacados = delPlan.filter(esRenombre)
  const totalInternacion = delPlan.filter((c) => c.internacion.includes(planCartillaId)).length
  const totalGuardia = delPlan.filter((c) => c.guardia.includes(planCartillaId)).length
  const zonaNombre = indice.find((z) => z.slug === zonaSlug)?.nombre ?? datos?.nombre ?? ''

  return (
    <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-white p-5 md:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wide mb-1">★ Sanatorios de renombre</div>
          <h2 className="text-lg font-bold text-gray-900">
            {zonaNombre ? `Con el ${planNombre} en ${zonaNombre}` : `Con el ${planNombre} en tu zona`}
          </h2>
          {detectada && <p className="text-xs text-gray-500 mt-0.5">📍 Detectamos que estás en {detectada}</p>}
        </div>
        <label className="text-xs text-gray-500 flex items-center gap-2">
          {zonaSlug ? 'Cambiar zona' : 'Elegí tu zona'}
          <select
            value={zonaSlug}
            onChange={(e) => { setZonaSlug(e.target.value); setDetectada(null); setVerTodos(false) }}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white max-w-[220px]"
          >
            <option value="">—</option>
            {grupos.map((g) => (
              <optgroup key={g.provincia} label={g.provincia}>
                {g.zonas.map((z) => <option key={z.slug} value={z.slug}>{z.nombre}</option>)}
              </optgroup>
            ))}
          </select>
        </label>
      </div>

      {!zonaSlug && <p className="text-sm text-gray-600">Elegí tu zona para ver los sanatorios de renombre que incluye el {planNombre}.</p>}
      {zonaSlug && cargando && <p className="text-sm text-gray-400">Buscando en la cartilla…</p>}
      {zonaSlug && !cargando && datos && (
        <>
          {destacados.length === 0 ? (
            <p className="text-sm text-gray-600">En {zonaNombre} el {planNombre} no incluye sanatorios de nuestra lista de referencia. Mirá la cartilla completa de la zona abajo.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(verTodos ? destacados : destacados.slice(0, 9)).map((c) => (
                <div key={c.nombre} className="bg-white rounded-xl border border-amber-200 p-4">
                  <div className="font-bold text-gray-900 text-sm">{c.nombre}</div>
                  {ubicacion(c) && <div className="text-xs text-gray-500 mt-0.5">{ubicacion(c)}</div>}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {c.internacion.includes(planCartillaId) && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Internación</span>}
                    {c.guardia.includes(planCartillaId) && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{labelGuardia}</span>}
                  </div>
                </div>
              ))}
              {!verTodos && destacados.length > 9 && (
                <button onClick={() => setVerTodos(true)} className="rounded-xl border border-dashed border-amber-300 text-sm font-semibold text-amber-800 hover:bg-amber-50 p-4">
                  Ver los {destacados.length} sanatorios de renombre →
                </button>
              )}
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-amber-100">
            <Link href={`/cartillas/${prepagaSlug}/${zonaSlug}`} className="text-sm font-semibold text-[#E8002D] hover:underline">
              Ver la cartilla completa en {zonaNombre}: {totalInternacion} de internación y {totalGuardia} de {labelGuardia.toLowerCase()} →
            </Link>
            <span className="text-xs text-gray-400">Fuente: cartilla oficial de {prepagaNombre}. Confirmá la cobertura antes de atenderte.</span>
          </div>
        </>
      )}
    </div>
  )
}
