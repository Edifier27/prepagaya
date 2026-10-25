'use client'

// Popup del plan del cotizador v2 (solo en la compu, Darío 24-oct-2026): dos
// pestañas, "Qué cubre" y "Cartilla" de la zona de la persona, con buscador y
// filtros. Sin links que saquen del cotizador: la única salida es el botón
// de pedir el descuento.
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Plan } from '@/types'
import { nombreProlijo, puestoSanatorio, type PlanV2, type Promo } from '@/lib/cotizador-v2'

export type PestanaV2 = 'cubre' | 'cartilla'

interface Centro {
  nombre: string
  internacion: string[]
  guardia: string[]
  servicios: string[]
  sedes: { direccion: string; localidad: string }[]
}
interface ZonaCartilla { centros: Centro[]; planes: { id: string; comparadorSlugs: string[] }[] }

// Una respuesta por localidad y prepaga, compartida entre aperturas
const cache = new Map<string, Promise<ZonaCartilla | null>>()
function traerZona(prep: string, loc: string) {
  const k = `${prep}/${loc}`
  if (!cache.has(k)) cache.set(k, fetch(`/api/cartilla-zona/${k}`).then((r) => (r.ok ? r.json() : null)).catch(() => null))
  return cache.get(k)!
}

interface Props {
  plan: PlanV2
  datos: Plan | undefined
  zonaNombre: string
  localidades: { slug: string; nombre: string }[]
  localidadInicial?: string
  pestanaInicial: PestanaV2
  precio: string | null
  promo: Promo | null
  propios: string
  onClose: () => void
  onQuiero: () => void
}

const VISIBLES = 6

export function PlanDetalleV2({ plan, datos, zonaNombre, localidades, localidadInicial, pestanaInicial, precio, promo, propios, onClose, onQuiero }: Props) {
  const [pestana, setPestana] = useState<PestanaV2>(pestanaInicial)
  const [loc, setLoc] = useState(localidades.find((l) => l.slug === localidadInicial)?.slug ?? localidades[0]?.slug ?? '')
  const [zona, setZona] = useState<{ loc: string; datos: ZonaCartilla | null } | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState<'todos' | 'internacion' | 'guardia'>('todos')
  const [todos, setTodos] = useState(false)
  const cerrar = useRef<HTMLButtonElement>(null)
  const prep = plan.k.split('/')[0]
  const planSlug = plan.k.split('/')[1]

  // Escape cierra, sin scroll de fondo, foco en el popup
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', tecla)
    const antes = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cerrar.current?.focus()
    return () => { document.removeEventListener('keydown', tecla); document.body.style.overflow = antes }
  }, [onClose])

  useEffect(() => {
    if (!loc) return
    let vigente = true
    traerZona(prep, loc).then((d) => { if (vigente) setZona({ loc, datos: d }) })
    return () => { vigente = false }
  }, [prep, loc])

  const cargando = !!loc && zona?.loc !== loc
  const centros = useMemo(() => {
    const d = zona?.loc === loc ? zona.datos : null
    const id = d?.planes.find((p) => p.comparadorSlugs.includes(planSlug))?.id
    if (!d || !id) return []
    return d.centros
      .filter((c) => c.internacion.includes(id) || c.guardia.includes(id))
      .map((c) => ({ nombre: nombreProlijo(c.nombre), internacion: c.internacion.includes(id), guardia: c.guardia.includes(id), donde: c.sedes[0]?.localidad ?? '', direccion: c.sedes[0]?.direccion ?? '' }))
      .sort((a, b) => Number(b.internacion) - Number(a.internacion) || puestoSanatorio(a.nombre) - puestoSanatorio(b.nombre) || a.nombre.localeCompare(b.nombre))
  }, [zona, loc, planSlug])

  const q = busqueda.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  const filtrados = centros.filter((c) =>
    (filtro === 'todos' || c[filtro]) &&
    (!q || `${c.nombre} ${c.donde}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(q)))
  const mostrados = todos || q ? filtrados : filtrados.slice(0, VISIBLES)
  const conInternacion = centros.filter((c) => c.internacion).length
  const locNombre = localidades.find((l) => l.slug === loc)?.nombre ?? zonaNombre
  const cta = promo ? `Quiero mi ${promo.pct} OFF` : 'Quiero que me asesoren'

  return (
    <div className="cv2-fondo fixed inset-0 z-[60] flex items-center justify-center bg-gray-950/60 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div role="dialog" aria-modal="true" aria-label={`${plan.marca} ${plan.nom}`}
        className="cv2-modal flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">

        {/* Encabezado: plan, precio y promo siempre a la vista */}
        <div className="relative flex items-start justify-between gap-4 border-b border-gray-100 px-6 pb-4 pt-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{plan.marca}</p>
            <h2 className="text-2xl font-extrabold leading-tight text-gray-900">{plan.nom}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {precio && <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold tabular-nums text-gray-800">{precio} <span className="font-medium text-gray-500">de lista</span></span>}
              {promo && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">🔥 {promo.corta} · {promo.detalle}</span>}
            </div>
          </div>
          <button ref={cerrar} type="button" onClick={onClose} aria-label="Cerrar"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-[#E8002D]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-5 w-5"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Pestañas con indicador deslizante */}
        <div className="px-6 pt-4">
          <div role="tablist" className="relative grid grid-cols-2 rounded-2xl bg-gray-100 p-1">
            <span aria-hidden className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-xl bg-white shadow-sm transition-transform duration-300 ease-out ${pestana === 'cartilla' ? 'translate-x-full' : ''}`} />
            {([['cubre', 'Qué cubre'], ['cartilla', `Cartilla en ${zonaNombre}`]] as const).map(([id, texto]) => (
              <button key={id} type="button" role="tab" aria-selected={pestana === id} onClick={() => setPestana(id)}
                className={`relative z-10 truncate rounded-xl px-3 py-2 text-sm font-bold transition-colors ${pestana === id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}>
                {texto}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[320px] flex-1 overflow-y-auto px-6 py-5">
          {pestana === 'cubre' ? (
            <div key="cubre" className="cv2-panel flex flex-col gap-5">
              {datos?.descripcion && <p className="text-sm leading-relaxed text-gray-600">{datos.descripcion}</p>}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { t: datos?.copago ? 'Con copago' : 'Sin copago', d: datos?.copago ? 'Pagás un copago en consultas y estudios' : 'Consultas y estudios sin cargo extra', ok: !datos?.copago },
                  { t: datos?.redAbierta ? 'Red abierta' : 'Red cerrada', d: datos?.redAbierta ? 'Cartilla amplia de prestadores' : 'Atención en la cartilla del plan', ok: !!datos?.redAbierta },
                  { t: conInternacion ? `${conInternacion} sanatorio${conInternacion === 1 ? '' : 's'}` : 'Internación', d: cargando ? 'Buscando en la cartilla…' : conInternacion ? `con internación en ${locNombre}` : 'Te pasamos la cartilla completa', ok: conInternacion > 0 },
                ].map((x) => (
                  <div key={x.t} className="rounded-2xl border border-gray-100 bg-gray-50/70 p-3">
                    <p className={`text-sm font-extrabold ${x.ok ? 'text-emerald-700' : 'text-gray-900'}`}>{x.t}</p>
                    <p className="mt-0.5 text-xs leading-snug text-gray-500">{x.d}</p>
                  </div>
                ))}
              </div>
              {datos?.cobertura.length ? (
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Qué incluye</p>
                  <ul className="grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2">
                    {datos.cobertura.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-100 text-[10px] font-black text-emerald-700">✓</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {propios && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-[#B8001F]">🏥 {propios.replace(/^\+ /, '')}</p>}
              <button type="button" onClick={() => setPestana('cartilla')} className="self-start text-sm font-bold text-[#E8002D] hover:underline">Ver los sanatorios de {zonaNombre} →</button>
            </div>
          ) : (
            <div key="cartilla" className="cv2-panel flex flex-col gap-3">
              {localidades.length > 1 && (
                <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
                  {localidades.map((l) => (
                    <button key={l.slug} type="button" onClick={() => { setLoc(l.slug); setTodos(false) }} aria-pressed={loc === l.slug}
                      className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold transition ${loc === l.slug ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-700 hover:border-gray-400'}`}>
                      {l.nombre}
                    </button>
                  ))}
                </div>
              )}
              {propios && <p className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-[#B8001F]">🏥 {propios.replace(/^\+ /, '')}</p>}
              {!loc ? (
                <p className="rounded-2xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">Todavía no tenemos cargada la cartilla de {zonaNombre} para este plan. Te la pasa el asesor junto con tu precio.</p>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="relative min-w-[200px] flex-1">
                      <span className="sr-only">Buscar sanatorio o localidad</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                      <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscá tu sanatorio o localidad"
                        className="w-full rounded-xl border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-[#E8002D] focus:outline-none focus:ring-2 focus:ring-red-100" />
                    </label>
                    <div className="flex gap-1">
                      {([['todos', 'Todos'], ['internacion', 'Internación'], ['guardia', 'Guardia']] as const).map(([id, t]) => (
                        <button key={id} type="button" onClick={() => setFiltro(id)} aria-pressed={filtro === id}
                          className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${filtro === id ? 'bg-[#E8002D] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{t}</button>
                      ))}
                    </div>
                  </div>
                  {cargando ? (
                    <div className="flex flex-col gap-2">{[0, 1, 2, 3].map((i) => <div key={i} className="h-14 animate-pulse rounded-2xl bg-gray-100" />)}</div>
                  ) : centros.length === 0 ? (
                    <p className="rounded-2xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">No encontramos prestadores de este plan en {locNombre}. Te pasamos la cartilla completa con tu precio.</p>
                  ) : (
                    <>
                      <p className="text-xs text-gray-500">
                        {q || filtro !== 'todos' ? `${filtrados.length} de ${centros.length}` : centros.length} prestadores de {plan.nom} en {locNombre} · cartilla oficial
                      </p>
                      <ul className="flex flex-col gap-2">
                        {mostrados.map((c, i) => (
                          <li key={c.nombre + c.direccion} className="cv2-panel flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 transition hover:border-gray-300 hover:shadow-sm"
                            style={{ animationDelay: `${Math.min(i, 8) * 25}ms` }}>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-gray-900">{c.nombre}</p>
                              {(c.direccion || c.donde) && <p className="truncate text-xs text-gray-500">{[c.direccion, c.donde].filter(Boolean).join(' · ')}</p>}
                            </div>
                            <div className="flex shrink-0 gap-1">
                              {c.internacion && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">Internación</span>}
                              {c.guardia && <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-bold text-sky-700">Guardia</span>}
                            </div>
                          </li>
                        ))}
                      </ul>
                      {filtrados.length === 0 && <p className="text-center text-sm text-gray-500">Sin resultados para “{busqueda}”.</p>}
                      {!todos && !q && filtrados.length > VISIBLES && (
                        <button type="button" onClick={() => setTodos(true)} className="self-center rounded-full border border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 hover:border-gray-400">
                          Ver los {filtrados.length} prestadores
                        </button>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Única salida: pedir el descuento */}
        <div className="flex items-center justify-between gap-4 border-t border-gray-100 bg-gray-50/80 px-6 py-4">
          <p className="text-xs leading-snug text-gray-500">{promo ? 'Tu precio final con descuento te lo pasa un asesor oficial por WhatsApp.' : 'Un asesor te pasa tu precio final por WhatsApp.'}</p>
          <button type="button" onClick={onQuiero}
            className="shrink-0 rounded-xl bg-[#E8002D] px-5 py-3 text-sm font-bold text-white shadow-md shadow-red-200 transition hover:-translate-y-0.5 hover:bg-[#B8001F]">
            {cta} →
          </button>
        </div>
      </div>
    </div>
  )
}
