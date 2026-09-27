'use client'

import { Suspense, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { useSearchParams } from 'next/navigation'
import { leerZonaGeoDeCookie } from '@/lib/geo-zonas'
import type { DatosGuardias, LugarAtencion, PuntoZona } from '@/lib/data/guardias-cerca'
import { FormularioLead, type DatosFormulario } from '@/components/herramientas/FormularioLead'
import { enviarLead } from '@/lib/leads-cliente'
import { TIEMPO_RESPUESTA } from '@/lib/utils'

// "¿Dónde me atiendo?" (27-sep-2026): guardias y sanatorios de las cartillas
// oficiales ordenados por distancia. La ubicación (del celular o la localidad
// elegida) se usa solo en el navegador para calcular distancias: no se manda a
// ningún lado. Los datos vienen de /api/guardias-cerca (estático).

type Tipo = 'guardia' | 'internacion'
interface Origen { lat: number; lon: number; texto: string }

const SWISS = 0 // Swiss Medical va primero en los datos (PRIORIDAD_PARTNERS)
const PASO = 8

// En el celular los resultados quedan abajo del formulario: se baja hasta ellos
const irAResultados = () => setTimeout(() => document.getElementById('gc-resultados')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim()

function km(a: { lat: number; lon: number }, lat: number, lon: number): number {
  const r = Math.PI / 180
  const h = Math.sin(((lat - a.lat) * r) / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(lat * r) * Math.sin(((lon - a.lon) * r) / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(h))
}

const textoDistancia = (d: number, aprox: boolean) =>
  `${aprox ? 'a unos ' : 'a '}${d < 1 ? `${Math.max(100, Math.round(d * 10) * 100)} m` : `${d.toLocaleString('es-AR', { maximumFractionDigits: d < 10 ? 1 : 0 })} km`}`

const telHref = (tel: string) => {
  const m = tel.match(/\(?\d[\d()\s-]{5,}\d/)
  return m ? `tel:${m[0].replace(/\D/g, '')}` : null
}

// La cookie de zona por IP (la deja middleware.ts) se lee sin romper la
// hidratación: en el servidor no hay zona.
const suscribirNada = () => () => {}
function useZonaIp() {
  return useSyncExternalStore(suscribirNada, () => leerZonaGeoDeCookie()?.label ?? null, () => null)
}

function puntoDeZonaIp(label: string | null, zonas: PuntoZona[]): Origen | null {
  if (!label) return null
  const base = norm(label.split(' (')[0])
  const buscado = base === 'caba' ? 'ciudad de buenos aires' : base
  const z = zonas.find((x) => norm(x[0]) === buscado)
  return z ? { lat: z[2], lon: z[3], texto: `${z[0]} (según tu conexión)` } : null
}

function Lugar({ l, d, datos, prepaga, tipo }: { l: LugarAtencion; d: number; datos: DatosGuardias; prepaga: number; tipo: Tipo }) {
  const [nombre, dir, loc, tel, , , aprox, cob] = l
  const direccion = [dir, loc].filter(Boolean).join(', ')
  const destino = encodeURIComponent(`${nombre}, ${direccion}, Argentina`)
  const href = telHref(tel)
  const mias = prepaga >= 0 ? cob.filter((c) => c[0] === prepaga) : cob
  const extra = [...new Set(mias.flatMap((c) => (c[3] ? c[3].split(' · ') : [])))].slice(0, 4)
  return (
    <li className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-gray-900 leading-snug">{nombre}</h3>
        <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700">{textoDistancia(d, aprox === 1)}</span>
      </div>
      <p className="mt-1 text-sm text-gray-600">
        {direccion}
        {aprox === 1 && <span className="text-gray-400"> · ubicación aproximada</span>}
      </p>
      {extra.length > 0 && <p className="mt-1.5 text-xs text-gray-500">{extra.join(' · ')}</p>}
      {prepaga >= 0 ? (
        mias.map((c) => {
          const planes = tipo === 'guardia' ? c[1] : c[2]
          return planes.length ? (
            <p key={c[0]} className="mt-2 text-sm text-gray-700">
              <span className="font-semibold">{tipo === 'guardia' ? 'Guardia' : 'Internación'} con {datos.prepagas[c[0]].nombre}:</span> {planes.join(', ')}
            </p>
          ) : null
        })
      ) : (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {cob.filter((c) => (tipo === 'guardia' ? c[1] : c[2]).length > 0).map((c) => (
            <span key={c[0]} className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${c[0] === SWISS ? 'border-red-200 bg-red-50 text-[#B8001F]' : 'border-gray-200 bg-gray-50 text-gray-700'}`}>
              {datos.prepagas[c[0]].nombre}
            </span>
          ))}
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <a href={`https://www.google.com/maps/dir/?api=1&destination=${destino}`} target="_blank" rel="noopener noreferrer"
          className="rounded-xl bg-gray-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-black">Cómo llegar</a>
        {href && (
          <a href={href} className="rounded-xl border border-gray-300 px-3.5 py-2 text-sm font-semibold text-gray-800 hover:border-gray-500">Llamar: {tel.length > 28 ? `${tel.slice(0, 28)}…` : tel}</a>
        )}
      </div>
    </li>
  )
}

function GuardiasCerca({ prepagaInicial, tipoInicial, origenInicial }: { prepagaInicial?: string; tipoInicial?: Tipo; origenInicial?: Origen }) {
  const [datos, setDatos] = useState<DatosGuardias | null>(null)
  const [error, setError] = useState(false)
  const [prepagaSlug, setPrepagaSlug] = useState(prepagaInicial ?? '')
  const [plan, setPlan] = useState('')
  const [tipo, setTipo] = useState<Tipo>(tipoInicial ?? 'guardia')
  const [origenElegido, setOrigenElegido] = useState<Origen | null>(origenInicial ?? null)
  const [geo, setGeo] = useState<'idle' | 'buscando' | 'denegado' | 'error'>('idle')
  const [q, setQ] = useState('')
  const [cantidad, setCantidad] = useState(PASO)
  const [form, setForm] = useState<string | null>(null)
  const [enviado, setEnviado] = useState<string | null>(null)
  const zonaIp = useZonaIp()

  useEffect(() => {
    let vivo = true
    fetch('/api/guardias-cerca')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: DatosGuardias) => vivo && setDatos(d))
      .catch(() => vivo && setError(true))
    return () => { vivo = false }
  }, [])

  const prepaga = datos ? datos.prepagas.findIndex((p) => p.slug === prepagaSlug) : -1
  const origen = origenElegido ?? (datos ? puntoDeZonaIp(zonaIp, datos.zonas) : null)

  const resultados = useMemo(() => {
    if (!datos || !origen) return []
    const col = tipo === 'guardia' ? 1 : 2
    return datos.lugares
      .filter((l) => l[7].some((c) => (prepaga < 0 || c[0] === prepaga) && c[col].length > 0 && (!plan || (c[col] as string[]).includes(plan))))
      .map((l) => ({ l, d: km(origen, l[4], l[5]) }))
      .sort((a, b) => a.d - b.d)
  }, [datos, origen, prepaga, plan, tipo])

  // Swiss Medical cerca: para quien tiene otra prepaga o ninguna
  const swissCerca = useMemo(() => {
    if (!datos || !origen || prepaga === SWISS) return { swiss: 0, propia: 0 }
    const col = tipo === 'guardia' ? 1 : 2
    const cerca = (p: number) => datos.lugares.filter((l) => l[7].some((c) => c[0] === p && c[col].length > 0) && km(origen, l[4], l[5]) <= 5).length
    return { swiss: cerca(SWISS), propia: prepaga >= 0 ? cerca(prepaga) : 0 }
  }, [datos, origen, prepaga, tipo])

  const sugerencias = useMemo(() => {
    const t = norm(q)
    if (!datos || t.length < 2) return []
    return datos.zonas.filter((z) => norm(z[0]).split(' ').some((w) => w.startsWith(t)) || norm(z[0]).startsWith(t)).slice(0, 6)
  }, [datos, q])

  function usarUbicacion() {
    if (!('geolocation' in navigator)) return setGeo('error')
    setGeo('buscando')
    navigator.geolocation.getCurrentPosition(
      (p) => { setOrigenElegido({ lat: p.coords.latitude, lon: p.coords.longitude, texto: 'tu ubicación' }); setGeo('idle'); setCantidad(PASO); irAResultados() },
      (e) => setGeo(e.code === 1 ? 'denegado' : 'error'),
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 },
    )
  }

  async function enviar(d: DatosFormulario) {
    const zona = origen?.texto ?? ''
    await enviarLead({
      ...d,
      fuente: 'guardias-cerca',
      interes: `${form ?? 'Asesoramiento'} · ${tipo === 'guardia' ? 'guardias' : 'internación'} cerca de ${zona}`.slice(0, 200),
      prepagaActual: prepaga >= 0 && datos ? datos.prepagas[prepaga].nombre : undefined,
      preferencias: { zona: zona.slice(0, 200) },
    })
    setEnviado(d.nombre)
    setForm(null)
  }

  const planes = datos && prepaga >= 0 ? datos.prepagas[prepaga].planes : []
  const nombreTipo = tipo === 'guardia' ? 'guardias' : 'sanatorios con internación'

  return (
    <div>
      <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-gray-800">
        <strong>¿Es una emergencia?</strong> Llamá al <a href="tel:107" className="font-bold text-[#B8001F] underline">107</a> (emergencias médicas) o al <a href="tel:911" className="font-bold text-[#B8001F] underline">911</a>.
      </p>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-2">Tu prepaga</p>
          <div className="flex flex-wrap gap-2">
            {[{ slug: '', nombre: 'Todas / no tengo' }, ...(datos?.prepagas ?? [])].map((p) => (
              <button key={p.slug} type="button" aria-pressed={prepagaSlug === p.slug}
                onClick={() => { setPrepagaSlug(p.slug); setPlan(''); setCantidad(PASO) }}
                className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${prepagaSlug === p.slug ? 'border-[#E8002D] bg-[#E8002D] text-white' : 'border-gray-200 text-gray-700 hover:border-[#E8002D]'}`}>
                {p.nombre}
              </button>
            ))}
          </div>
          {planes.length > 0 && (
            <label className="mt-3 block text-sm text-gray-700">
              <span className="sr-only">Tu plan</span>
              <select value={plan} onChange={(e) => { setPlan(e.target.value); setCantidad(PASO) }}
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-3 py-2.5 text-base focus:outline-none focus:border-[#E8002D]">
                <option value="">Todos los planes</option>
                {planes.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </label>
          )}
        </div>

        <div className="flex rounded-xl border border-gray-200 p-1" role="tablist" aria-label="Qué buscás">
          {(['guardia', 'internacion'] as Tipo[]).map((t) => (
            <button key={t} type="button" role="tab" aria-selected={tipo === t} onClick={() => { setTipo(t); setCantidad(PASO) }}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${tipo === t ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              {t === 'guardia' ? 'Guardias' : 'Internación'}
            </button>
          ))}
        </div>

        <div>
          <button type="button" onClick={usarUbicacion} disabled={geo === 'buscando'}
            className="w-full rounded-xl bg-[#E8002D] px-4 py-3 font-bold text-white hover:bg-[#B8001F] disabled:opacity-60">
            {geo === 'buscando' ? 'Buscando tu ubicación…' : 'Usar mi ubicación'}
          </button>
          {geo === 'denegado' && <p className="mt-2 text-sm text-gray-600">No diste permiso para usar la ubicación. Escribí tu barrio o localidad acá abajo.</p>}
          {geo === 'error' && <p className="mt-2 text-sm text-gray-600">No pudimos obtener tu ubicación. Escribí tu barrio o localidad acá abajo.</p>}
          <label htmlFor="gc-q" className="mt-3 block text-sm text-gray-600">o escribí tu barrio o localidad</label>
          <input id="gc-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" placeholder="Ej.: Palermo, Quilmes, Rosario…"
            className="mt-1 w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-base focus:outline-none focus:border-[#E8002D]" />
          {sugerencias.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-2">
              {sugerencias.map((z) => (
                <li key={`${z[0]}|${z[1]}`}>
                  <button type="button" onClick={() => { setOrigenElegido({ lat: z[2], lon: z[3], texto: z[0] }); setQ(''); setCantidad(PASO); irAResultados() }}
                    className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-[#E8002D] hover:text-[#E8002D]">
                    {z[0]} <span className="text-gray-400">({z[1] === 'Ciudad de Buenos Aires' ? 'CABA' : z[1]})</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-gray-700">No pudimos cargar las cartillas. Probá recargar la página.</p>}
      {!datos && !error && <p className="mt-4 text-sm text-gray-500" aria-live="polite">Cargando las cartillas…</p>}

      {datos && origen && (
        <section id="gc-resultados" className="mt-5 scroll-mt-24" aria-live="polite">
          <h2 className="text-lg font-bold text-gray-900">
            {resultados.length > 0 ? `${tipo === 'guardia' ? 'Las' : 'Los'} ${nombreTipo} más cerca de ${origen.texto}` : `No encontramos ${nombreTipo} con ese filtro`}
          </h2>
          <p className="text-sm text-gray-500 mb-3">
            {prepaga >= 0 ? `${datos.prepagas[prepaga].nombre}${plan ? `, ${datos.prepagas[prepaga].planes.find((p) => p.id === plan)?.label ?? plan}` : ''}` : 'Todas las prepagas'} · ordenadas por distancia en línea recta
          </p>
          <ul className="space-y-3">
            {resultados.slice(0, cantidad).map(({ l, d }, i) => (
              <Lugar key={`${l[0]}|${l[1]}|${i}`} l={l} d={d} datos={datos} prepaga={prepaga} tipo={tipo} />
            ))}
          </ul>
          {resultados.length > cantidad && (
            <button type="button" onClick={() => setCantidad((c) => c + PASO)} className="mt-3 w-full rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-800 hover:border-gray-500">
              Ver más
            </button>
          )}

          {!enviado && swissCerca.swiss > 0 && prepaga !== SWISS && (
            <div className="mt-5 rounded-2xl border-2 border-[#E8002D]/20 bg-red-50/50 p-5">
              <p className="font-bold text-gray-900">
                Con Swiss Medical tendrías {swissCerca.swiss} {tipo === 'guardia' ? (swissCerca.swiss === 1 ? 'guardia' : 'guardias') : (swissCerca.swiss === 1 ? 'sanatorio' : 'sanatorios')} a menos de 5 km
                {prepaga >= 0 ? ` (con ${datos.prepagas[prepaga].nombre}${plan ? ` ${plan}` : ''}: ${swissCerca.propia})` : ''}.
              </p>
              <p className="mt-1 text-sm text-gray-600">Te decimos qué plan de Swiss Medical los incluye y cuánto sale para tu edad.</p>
              <button type="button" onClick={() => setForm('Swiss Medical')} className="mt-3 rounded-xl bg-[#E8002D] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#B8001F]">
                Cotizar Swiss Medical →
              </button>
            </div>
          )}
          {!enviado && prepaga < 0 && swissCerca.swiss === 0 && resultados.length > 0 && (
            <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <p className="font-bold text-gray-900">¿No tenés prepaga o querés cambiarte?</p>
              <p className="mt-1 text-sm text-gray-600">Te decimos qué plan tiene más {nombreTipo} cerca tuyo y cuánto sale para tu edad.</p>
              <button type="button" onClick={() => setForm('Asesoramiento')} className="mt-3 rounded-xl bg-[#E8002D] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#B8001F]">
                Quiero que me asesoren →
              </button>
            </div>
          )}
          {enviado && (
            <p className="mt-5 text-sm text-green-900 bg-green-50 border border-green-200 rounded-xl p-3">
              <strong>Listo, {enviado}.</strong> Un asesor te escribe en {TIEMPO_RESPUESTA} con los planes que tienen {nombreTipo} cerca tuyo.
            </p>
          )}
        </section>
      )}

      {datos && !origen && (
        <p className="mt-4 text-sm text-gray-600">Tocá &quot;Usar mi ubicación&quot; o escribí tu barrio o localidad para ver las {nombreTipo} más cerca.</p>
      )}

      {datos && (
        <p className="mt-6 text-xs text-gray-400 leading-relaxed">
          Tu ubicación no sale de tu teléfono: las distancias se calculan en tu navegador. Cartillas: {datos.prepagas.map((p) => `${p.nombre} (${p.fecha})`).join('; ')}. Ubicaciones: Georef (servicio oficial de direcciones, datos.gob.ar) y © colaboradores de OpenStreetMap. Antes de ir, si podés, confirmá con tu prepaga: la cartilla puede cambiar.
        </p>
      )}

      {form && (
        <FormularioLead
          titulo={form === 'Swiss Medical' ? 'Cotizá Swiss Medical' : 'Te asesoramos'}
          bajada={`Te pasamos los planes con ${nombreTipo} cerca de ${origen?.texto ?? 'tu zona'} y cuánto salen para tu edad.`}
          textoBoton="Quiero que me asesoren →"
          pedirEdades
          onCerrar={() => setForm(null)}
          onEnviar={enviar}
        />
      )}
    </div>
  )
}

function ConParametros() {
  const sp = useSearchParams()
  const p = sp.get('prepaga') ?? undefined
  const tipo = sp.get('tipo') === 'internacion' ? 'internacion' : undefined
  const lat = Number(sp.get('lat'))
  const lon = Number(sp.get('lon'))
  const lugar = sp.get('lugar')
  const origen = sp.has('lat') && sp.has('lon') && lugar && Math.abs(lat) <= 90 && Math.abs(lon) <= 180
    ? { lat, lon, texto: lugar.slice(0, 60) }
    : undefined
  return <GuardiasCerca key={sp.toString()} prepagaInicial={p} tipoInicial={tipo} origenInicial={origen} />
}

/** El buscador sale en el HTML (fallback) y, ya en el navegador, toma del
 *  link ?prepaga=<slug> (cartillas, buscador del sitio) y, desde las
 *  cartillas de OSDE, también ?tipo=internacion&lat=…&lon=…&lugar=… */
export function GuardiasCercaConParametros() {
  return (
    <Suspense fallback={<GuardiasCerca />}>
      <ConParametros />
    </Suspense>
  )
}
