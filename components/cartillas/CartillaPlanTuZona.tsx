'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { leerZonaGeoDeCookie } from '@/lib/geo-zonas'
import { zonaParaUbicacion, type ZonaCartillaIndice } from '@/lib/cartilla-zonas-geo'
import { clavesRenombre, resumirZonaPlan, type CentroResumen, type ResumenZonaPlan } from '@/lib/cartilla-plan-resumen'
import type { ZonaCartilla } from '@/lib/data/cartilla-zonas'

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
  /** Resumen armado en el servidor (CABA): es lo que ve Google y lo que se
   *  muestra hasta detectar la zona de la persona */
  inicial?: ResumenZonaPlan
}

// Recuadro "Sanatorios de renombre con este plan en tu zona" (Darío,
// 23-sep-2026): toma la zona detectada por IP (misma cookie que el banner
// "Vemos que estás en…"), trae la cartilla oficial de esa zona y muestra SOLO
// los centros del plan que coinciden con la lista curada de sanatorios de
// referencia, en un recuadro aparte del resto de la cartilla. Desde el
// 28-sep-2026 llega armado con CABA desde el servidor (Google no elige zona:
// antes veía "Elegí tu zona" y ningún sanatorio) y se cambia a la zona de la
// persona después de hidratar. El HTML es igual para todos (sin cloaking).
export function CartillaPlanTuZona({ prepagaSlug, prepagaNombre, planNombre, planCartillaId, labelGuardia, renombre, inicial }: Props) {
  // Índice de zonas desde la API estática (no embebido en el HTML del plan)
  const [grupos, setGrupos] = useState<{ provincia: string; zonas: ZonaCartillaIndice[] }[]>([])
  useEffect(() => {
    fetch(`/api/cartilla-zonas/${prepagaSlug}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setGrupos)
      .catch(() => {})
  }, [prepagaSlug])
  const indice = useMemo(() => grupos.flatMap((g) => g.zonas), [grupos])
  // Zona: la que elige la persona; si no eligió, la detectada por IP; si no
  // hay, la que vino armada del servidor (CABA)
  const [elegida, setElegida] = useState<string | null>(null)
  const geo = useMemo(() => (indice.length ? leerZonaGeoDeCookie() : null), [indice])
  const detectadaSlug = useMemo(() => (indice.length ? zonaParaUbicacion(indice, geo) : null), [indice, geo])
  const zonaSlug = elegida ?? detectadaSlug ?? inicial?.zonaSlug ?? ''
  const detectada = elegida === null && detectadaSlug ? geo?.label ?? null : null
  const usarInicial = Boolean(inicial && zonaSlug === inicial.zonaSlug)
  const [cargado, setCargado] = useState<{ slug: string; z: ZonaCartilla | null } | null>(null)
  const [verTodos, setVerTodos] = useState(false)

  useEffect(() => {
    if (!zonaSlug || usarInicial) return
    let cancelado = false
    fetch(`/api/cartilla-zona/${prepagaSlug}/${zonaSlug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((z: ZonaCartilla | null) => { if (!cancelado) setCargado({ slug: zonaSlug, z }) })
      .catch(() => { if (!cancelado) setCargado({ slug: zonaSlug, z: null }) })
    return () => { cancelado = true }
  }, [prepagaSlug, zonaSlug, usarInicial])
  const cargando = Boolean(zonaSlug) && !usarInicial && cargado?.slug !== zonaSlug
  const datos = cargado?.slug === zonaSlug ? cargado.z : null

  const claves = useMemo(() => clavesRenombre(renombre), [renombre])
  const zonaNombre = indice.find((z) => z.slug === zonaSlug)?.nombre ?? (usarInicial ? inicial?.zonaNombre : datos?.nombre) ?? ''
  const resumen: ResumenZonaPlan | null = usarInicial
    ? inicial ?? null
    : datos ? resumirZonaPlan(datos, zonaSlug, zonaNombre, planCartillaId, claves) : null
  const destacados = resumen?.destacados ?? []
  const pantallazo = resumen?.pantallazo ?? []
  // "Tandil (Interior de Buenos Aires)" → "Tandil"
  const ciudadDetectada = detectada?.replace(/\s*\(.*\)\s*$/, '') ?? null
  const tarjeta = (c: CentroResumen) => (
    <div key={c.nombre} className="bg-white rounded-xl border border-amber-200 p-4">
      <div className="font-bold text-gray-900 text-sm">{c.nombre}</div>
      {c.ubicacion && <div className="text-xs text-gray-500 mt-0.5">{c.ubicacion}</div>}
      <div className="flex flex-wrap gap-1.5 mt-2">
        {c.internacion && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Internación</span>}
        {c.guardia && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{labelGuardia}</span>}
      </div>
    </div>
  )

  return (
    <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-white p-5 md:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wide mb-1">{resumen && destacados.length === 0 ? '★ Prestadores en tu zona' : '★ Sanatorios de renombre'}</div>
          <h2 className="text-lg font-bold text-gray-900">
            {zonaNombre ? `Con el ${planNombre} en ${zonaNombre}` : `Con el ${planNombre} en tu zona`}
          </h2>
          {ciudadDetectada && (
            <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-[#E8002D] bg-white border border-red-100 rounded-full px-3 py-1 shadow-sm">
              📍 Estás en {ciudadDetectada}
            </span>
          )}
        </div>
        <label className="text-xs text-gray-500 flex items-center gap-2">
          {zonaSlug ? 'Cambiar zona' : 'Elegí tu zona'}
          <select
            value={zonaSlug}
            onChange={(e) => { setElegida(e.target.value); setVerTodos(false) }}
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
      {zonaSlug && !cargando && resumen && (
        <>
          {destacados.length === 0 ? (
            pantallazo.length === 0 ? (
              <p className="text-sm text-gray-600">No encontramos prestadores del {planNombre} en {zonaNombre}. Mirá la cartilla completa o pedinos que te asesoremos.</p>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-3">Algunos prestadores del {planNombre} en {zonaNombre}:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {pantallazo.map(tarjeta)}
                  <Link href={`/cartillas/${prepagaSlug}/${zonaSlug}`} className="rounded-xl border border-dashed border-amber-300 text-sm font-semibold text-amber-800 hover:bg-amber-50 p-4 flex items-center justify-center text-center">
                    Ver más prestadores en {zonaNombre} →
                  </Link>
                </div>
              </>
            )
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(verTodos ? destacados : destacados.slice(0, 9)).map(tarjeta)}
              {!verTodos && destacados.length > 9 && (
                <button onClick={() => setVerTodos(true)} className="rounded-xl border border-dashed border-amber-300 text-sm font-semibold text-amber-800 hover:bg-amber-50 p-4">
                  Ver los {destacados.length} sanatorios de renombre →
                </button>
              )}
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-amber-100">
            <Link href={`/cartillas/${prepagaSlug}/${zonaSlug}`} className="text-sm font-semibold text-[#E8002D] hover:underline">
              Ver la cartilla completa en {zonaNombre}: {resumen.totalInternacion} de internación y {resumen.totalGuardia} de {labelGuardia.toLowerCase()} →
            </Link>
            <span className="text-xs text-gray-400">Fuente: cartilla oficial de {prepagaNombre}. Confirmá la cobertura antes de atenderte.</span>
          </div>
        </>
      )}
    </div>
  )
}
