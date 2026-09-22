'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { leerZonaGeoDeCookie } from '@/lib/geo-zonas'
import {
  nombreCortoZona,
  slugPlan,
  zonaParaUbicacion,
  type PlanCartilla,
  type SeccionCartilla,
  type ZonaCartillaIndice,
} from '@/lib/cartilla-zonas-geo'
import type { ZonaCartilla } from '@/lib/data/cartilla-zonas'
import { CentrosLista, UpsellPlanes, centrosConPlanSuperior } from '@/components/cartillas/CentrosLista'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'

interface Props {
  prepagaSlug: string
  prepagaNombre: string
  grupos: { provincia: string; zonas: ZonaCartillaIndice[] }[]
  planes: PlanCartilla[]
  escalera: string[]
  planesConPagina: string[]
  labelGuardia: string
  /** "cartilla oficial vigente al 22/09/2026" / "buscador oficial consultado el ..." */
  textoFecha: string
  /** Plan preseleccionado (páginas /cartillas/[prepaga]/plan-xxx) */
  planInicial?: string
  /** Zonas rápidas para mostrar como chips cuando no hay zona elegida */
  zonasRapidas?: string[]
}

// Buscador de cartilla por zona y plan (OSDE / Premedic / Avalian). La zona
// se preselecciona con la geolocalización por IP que deja middleware.ts en
// una cookie — se lee después de hidratar, así que el HTML estático (lo que
// ve Google) es el mismo para todos: sin cloaking.
export function BuscadorCartillaZona({
  prepagaSlug,
  prepagaNombre,
  grupos,
  planes,
  escalera,
  planesConPagina,
  labelGuardia,
  textoFecha,
  planInicial,
  zonasRapidas = ['caba', 'gba-zona-norte', 'gba-zona-oeste', 'gba-zona-sur'],
}: Props) {
  const indice = useMemo(() => grupos.flatMap((g) => g.zonas), [grupos])
  const [zonaSlug, setZonaSlug] = useState('')
  const [plan, setPlan] = useState(planInicial ?? '')
  const [detectadaLabel, setDetectadaLabel] = useState<string | null>(null)
  const [seccion, setSeccion] = useState<SeccionCartilla>('internacion')
  const [datos, setDatos] = useState<ZonaCartilla | null>(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const geo = leerZonaGeoDeCookie()
    const slug = zonaParaUbicacion(indice, geo)
    if (slug) {
      setZonaSlug(slug)
      setDetectadaLabel(geo?.label ?? null)
    }
  }, [indice])

  useEffect(() => {
    if (!zonaSlug) {
      setDatos(null)
      return
    }
    let cancelado = false
    setCargando(true)
    setError(false)
    fetch(`/api/cartilla-zona/${prepagaSlug}/${zonaSlug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((z: ZonaCartilla) => {
        if (cancelado) return
        setDatos(z)
        if (!z.centros.some((c) => c.internacion.length > 0)) setSeccion('guardia')
      })
      .catch(() => !cancelado && setError(true))
      .finally(() => !cancelado && setCargando(false))
    return () => {
      cancelado = true
    }
  }, [prepagaSlug, zonaSlug])

  const zonaIndice = indice.find((z) => z.slug === zonaSlug)
  const planesZona = planes.filter((p) => !zonaIndice || zonaIndice.planes.includes(p.id))
  const planObj = planes.find((p) => p.id === plan)
  const centrosFiltrados = useMemo(() => {
    if (!datos) return []
    if (!plan) return datos.centros
    return datos.centros
      .filter((c) => c.internacion.includes(plan) || c.guardia.includes(plan))
      .map((c) => ({
        ...c,
        internacion: c.internacion.includes(plan) ? c.internacion : [],
        guardia: c.guardia.includes(plan) ? c.guardia : [],
      }))
  }, [datos, plan])
  const conteo = (s: SeccionCartilla) => centrosFiltrados.filter((c) => c[s].length > 0).length
  const upsell = datos && plan ? centrosConPlanSuperior(datos.centros, plan, planes, escalera, seccion) : []
  const zonaCorta = datos ? nombreCortoZona(datos.nombre) : ''

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
          <div>
            <label htmlFor={`zona-${prepagaSlug}`} className="block text-sm font-semibold text-gray-900 mb-1.5">
              ¿En qué zona buscás?
            </label>
            <select
              id={`zona-${prepagaSlug}`}
              value={zonaSlug}
              onChange={(e) => {
                setZonaSlug(e.target.value)
                setDetectadaLabel(null)
                setSeccion('internacion')
              }}
              className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#E8002D] transition-colors bg-white"
            >
              <option value="">Elegí tu zona o localidad…</option>
              {grupos.map((g) => (
                <optgroup key={g.provincia} label={g.provincia}>
                  {g.zonas.map((z) => (
                    <option key={z.slug} value={z.slug}>
                      {z.nombre}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`plan-${prepagaSlug}`} className="block text-sm font-semibold text-gray-900 mb-1.5">
              Tu plan
            </label>
            <select
              id={`plan-${prepagaSlug}`}
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full sm:w-52 px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#E8002D] transition-colors bg-white"
            >
              <option value="">Todos los planes</option>
              {planesZona.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {detectadaLabel && zonaIndice && (
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-[#E8002D] flex-shrink-0" aria-hidden>
              <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
            </svg>
            Te mostramos {nombreCortoZona(zonaIndice.nombre)} porque vemos que estás en {detectadaLabel}. Podés cambiarla arriba.
          </p>
        )}
        {!zonaSlug && (
          <div className="flex flex-wrap gap-2 mt-3">
            {zonasRapidas
              .map((s) => indice.find((z) => z.slug === s))
              .filter((z): z is ZonaCartillaIndice => Boolean(z))
              .map((z) => (
                <button
                  key={z.slug}
                  type="button"
                  onClick={() => setZonaSlug(z.slug)}
                  className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-red-50 hover:text-[#E8002D] text-gray-600 rounded-full border border-gray-200 hover:border-red-200 transition-colors"
                >
                  {nombreCortoZona(z.nombre)}
                </button>
              ))}
          </div>
        )}
      </div>

      {zonaSlug && (
        <div className="mt-6">
          <div className="flex gap-2 mb-4 overflow-x-auto" role="tablist">
            {(['internacion', 'guardia'] as const).map((s) => (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={seccion === s}
                onClick={() => setSeccion(s)}
                className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-xl border transition-colors ${
                  seccion === s ? 'bg-[#E8002D] text-white border-[#E8002D]' : 'bg-white text-gray-600 border-gray-200 hover:border-red-200'
                }`}
              >
                {s === 'internacion' ? (
                  <>
                    <span className="sm:hidden">Internación</span>
                    <span className="hidden sm:inline">Sanatorios para internación</span>
                  </>
                ) : (
                  labelGuardia
                )}
                {datos && <span className={`ml-1.5 text-xs ${seccion === s ? 'text-red-200' : 'text-gray-400'}`}>{conteo(s)}</span>}
              </button>
            ))}
          </div>

          {cargando && <div className="text-sm text-gray-400 py-8 text-center">Cargando cartilla…</div>}
          {error && !cargando && (
            <div className="text-sm text-gray-500 py-8 text-center">No pudimos cargar la cartilla de esta zona. Probá de nuevo.</div>
          )}
          {datos && !cargando && (
            <>
              <CentrosLista
                centros={centrosFiltrados}
                seccion={seccion}
                planes={planesZona}
                prepagaSlug={prepagaSlug}
                vacio={
                  planObj
                    ? `El ${planObj.label} no tiene ${seccion === 'internacion' ? 'sanatorios para internación' : 'guardias'} en ${zonaCorta} según la cartilla oficial.`
                    : undefined
                }
              />
              {planObj && (
                <UpsellPlanes items={upsell} prepagaNombre={prepagaNombre} planLabel={planObj.label} zonaCorta={zonaCorta} />
              )}
              <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Fuente: {textoFecha}.{' '}
                  <Link href={`/cartillas/${prepagaSlug}/${datos.slug}`} className="text-[#E8002D] font-semibold hover:underline">
                    Cartilla de {prepagaNombre} en {zonaCorta} →
                  </Link>
                  {planObj && planesConPagina.includes(planObj.id) && (
                    <>
                      {' '}
                      <Link href={`/cartillas/${prepagaSlug}/${slugPlan(planObj.id)}`} className="text-[#E8002D] font-semibold hover:underline">
                        Todo el {planObj.label} →
                      </Link>
                    </>
                  )}
                </p>
                <ContratarPlanButton
                  prepagaNombre={prepagaNombre}
                  planNombre={planObj?.label}
                  fuente="cartilla-zona-buscador"
                  label={`Cotizar ${planObj ? `${prepagaNombre} ${planObj.label}` : prepagaNombre} en ${zonaCorta}`}
                  className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-sm text-sm"
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
