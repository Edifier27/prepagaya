'use client'

// Cotizador v2 (prueba 50/50 contra ComparadorWizard, Darío 24-oct-2026).
// Reglas y maqueta: docs/producto/cotizador-v2.html y lib/cotizador-v2.ts.
// Swiss primero, precio de lista real según la condición, la promo de cada
// prepaga en la tarjeta y los datos recién al pedir el descuento.
import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { track } from '@vercel/analytics'
import { prepagas } from '@/lib/data/prepagas'
import { formatPrecio, esCelularArgentinoValido } from '@/lib/utils'
import { trackEvent, trackLead } from '@/lib/analytics'
import { leerZonaGeoDeCookie } from '@/lib/geo-zonas'
import { resumenEdades } from '@/lib/leads-cliente'
import { paginaPrevia } from '@/lib/navegacion-cliente'
import { CampoTrampa, datoTrampa } from '@/components/ui/CampoTrampa'
import { useChromeVisibility } from '@/components/layout/ChromeVisibility'
import {
  ZONAS_V2, PLANES_V2, SANATORIOS_SWISS_FIJOS, CUANDO_ALTA, centrosPropiosSwiss, errorDeEdad, aporteDe, promoDe, asesorDe, zonaDesdeGeo,
  type ZonaV2, type PlanV2, type Condicion,
} from '@/lib/cotizador-v2'
import type { SanatoriosV2 } from '@/lib/cotizador-v2-sanatorios'
import type { PestanaV2 } from './PlanDetalleV2'

// Popup del plan: se descarga recién al abrirlo (solo en la compu)
const PlanDetalleV2 = dynamic(() => import('./PlanDetalleV2').then((m) => m.PlanDetalleV2), { ssr: false })

type Paso = 'zona' | 'edades' | 'planes' | 'datos' | 'listo'
interface Persona { id: number; rol: string; edad: string }
interface Precios { totales: Record<string, number>; porPersona: Record<string, number[]> }

const CONDICIONES: { id: Condicion; texto: string; situacion: string }[] = [
  { id: 'particular', texto: 'Particular', situacion: 'Particular' },
  { id: 'monotributo', texto: 'Monotributo', situacion: 'Monotributista' },
  { id: 'recibo', texto: 'Recibo de sueldo', situacion: 'Relación de dependencia' },
]
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const numero = (t: string) => parseFloat(t.replace(/\./g, '').replace(',', '.')) || 0

export function CotizadorV2({ sanatorios, desde }: { sanatorios: SanatoriosV2; desde?: string }) {
  const [paso, setPaso] = useState<Paso>('zona')
  const [zona, setZona] = useState<ZonaV2 | null>(null)
  const [zonaPorIp, setZonaPorIp] = useState(false)
  const [personas, setPersonas] = useState<Persona[]>([{ id: 1, rol: 'Titular', edad: '' }])
  const [condicion, setCondicion] = useState<Condicion>('particular')
  const [sueldos, setSueldos] = useState<string[]>([''])
  const [errorEdad, setErrorEdad] = useState('')
  const [precios, setPrecios] = useState<Precios | null>(null)
  const [verMas, setVerMas] = useState(false)
  const [elegido, setElegido] = useState<PlanV2 | null>(null)
  const [nombre, setNombre] = useState('')
  const [celular, setCelular] = useState('')
  const [cuando, setCuando] = useState('')
  const [intento, setIntento] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState(false)
  const [modal, setModal] = useState<{ pestana: PestanaV2; plan: PlanV2 } | null>(null)
  const [localidadGeo, setLocalidadGeo] = useState<string | undefined>()

  // Zona por IP: arranca en las edades con "Cambiar" (la pantalla de zona solo
  // si no se detecta o si la persona la cambia)
  useEffect(() => {
    track('Cotizador visto', { version: 'b' })
    const geo = leerZonaGeoDeCookie()
    const z = zonaDesdeGeo(geo)
    if (!z) return
    // La cookie solo existe en el navegador: se aplica después de hidratar
    let vigente = true
    queueMicrotask(() => {
      if (!vigente) return
      setZona(z)
      setZonaPorIp(true)
      setLocalidadGeo(geo?.localidadSlug)
      setPaso('edades')
    })
    return () => { vigente = false }
  }, [])

  // Modo enfocado como el cotizador actual: sin menú en las edades y los datos
  const { setHideChrome } = useChromeVisibility()
  useEffect(() => { setHideChrome(paso === 'edades' || paso === 'datos' || paso === 'listo') }, [paso, setHideChrome])
  useEffect(() => () => setHideChrome(false), [setHideChrome])
  // Al pedir el descuento solo queda el formulario (Darío, 24-oct-2026): se
  // esconden el encabezado y las secciones de la página (.cv2-ocultable)
  useEffect(() => {
    const raiz = document.documentElement
    if (paso === 'datos' || paso === 'listo') raiz.dataset.cv2Foco = '1'
    else delete raiz.dataset.cv2Foco
    return () => { delete raiz.dataset.cv2Foco }
  }, [paso])

  const edades = personas.map((p) => (p.edad.trim() === '' ? null : parseInt(p.edad)))
  const edadesOk = edades.filter((e): e is number => e !== null && Number.isFinite(e))
  const aportes = condicion === 'recibo' ? sueldos.reduce((t, s) => t + aporteDe(numero(s)), 0) : 0
  const lista = zona ? PLANES_V2[zona.region] : []

  async function verPrecios() {
    const err = errorDeEdad(edades)
    setErrorEdad(err)
    if (err || !zona) return
    setPrecios(null)
    setPaso('planes')
    trackEvent('cotizador_v2_precios', { zona: zona.id, condicion, integrantes: edadesOk.length })
    try {
      const r = await fetch('/api/precios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zona: zona.zonaKey, edades: edadesOk, modalidad: condicion === 'recibo' ? 'desregulado' : 'directo', planes: lista.map((p) => p.k) }),
      })
      const d = r.ok ? await r.json() : null
      setPrecios({ totales: d?.precios ?? {}, porPersona: d?.porPersona ?? {} })
    } catch {
      setPrecios({ totales: {}, porPersona: {} })
    }
  }

  function cotizacion(plan: PlanV2) {
    const pp = precios?.porPersona[plan.k]
    const lista = pp ? pp.reduce((a, b) => a + b, 0) : precios?.totales[plan.k] ?? null
    const promo = promoDe(plan.grupo, edadesOk, condicion)
    return { lista, aPagar: lista === null ? null : Math.max(0, lista - aportes), promo }
  }

  const cerrarModal = useCallback(() => setModal(null), [])
  function elegir(plan: PlanV2) {
    setElegido(plan)
    setModal(null)
    setPaso('datos')
    trackEvent('cotizador_v2_plan', { plan: plan.k })
    window.scrollTo({ top: 0 })
  }

  const celularOk = esCelularArgentinoValido(celular)
  async function enviar() {
    setIntento(true)
    if (!nombre.trim() || !celularOk || !elegido || !zona) return
    setEnviando(true)
    setErrorEnvio(false)
    const c = cotizacion(elegido)
    const alta = CUANDO_ALTA.find((x) => x.id === cuando)?.texto ?? ''
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          celular: celular.trim(),
          // Mismo email sintético que el cotizador actual (el CRM lo usa para encontrar el lead)
          email: `${celular.replace(/\D/g, '')}@sin-email.com`,
          provincia: zona.nombre,
          personas: resumenEdades(edadesOk),
          fuente: 'cotizador-v2',
          prepaga_interes: `${elegido.marca} — ${elegido.nom}${c.aPagar !== null ? ` | ${formatPrecio(c.aPagar)}/mes de lista` : ''}${c.promo ? ` · pidió ${c.promo.corta} ${c.promo.detalle}` : ''}`,
          situacion_laboral: CONDICIONES.find((x) => x.id === condicion)?.situacion,
          preferencias: JSON.stringify({ alta, grupo: personas.map((p) => p.rol).join(', ') }),
          ...(desde ? { origen: desde } : {}),
          pagina_previa: paginaPrevia(),
          ...datoTrampa(),
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      trackLead('cotizador-v2', { prepaga: elegido.marca })
      setPaso('listo')
      window.scrollTo({ top: 0 })
    } catch {
      setErrorEnvio(true)
    } finally {
      setEnviando(false)
    }
  }

  const ahora = new Date()
  const mesQueViene = MESES[(ahora.getMonth() + 1) % 12]

  // ── Zona ──────────────────────────────────────────────────────────────────
  if (paso === 'zona') {
    return (
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">¿Dónde vivís?</h2>
        <p className="text-sm text-gray-500 mb-5">El precio y la cartilla cambian según la zona.</p>
        <div className="grid grid-cols-2 gap-2">
          {ZONAS_V2.map((z) => (
            <button key={z.id} type="button" onClick={() => { setZona(z); setZonaPorIp(false); setPaso('edades') }}
              className={`text-left text-sm font-semibold rounded-xl border-2 px-3 py-3 transition-colors ${zona?.id === z.id ? 'border-[#E8002D] bg-red-50' : 'border-gray-200 hover:border-[#E8002D]'}`}>
              {z.nombre}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── Edades y condición ────────────────────────────────────────────────────
  if (paso === 'edades' && zona) {
    return (
      <div className="max-w-xl mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm">
          <span>📍 Precios para <strong>{zona.nombre}</strong>{zonaPorIp ? ' (por tu ubicación)' : ''}</span>
          <button type="button" onClick={() => setPaso('zona')} className="font-semibold text-[#E8002D] underline">Cambiar</button>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">¿Para quiénes es?</h2>
        <div className="flex flex-col gap-2">
          {personas.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 rounded-xl border border-gray-200 px-3.5 py-2.5">
              <label htmlFor={`v2-edad-${p.id}`} className="flex-1 text-sm font-semibold text-gray-800">{p.rol}</label>
              <input id={`v2-edad-${p.id}`} inputMode="numeric" value={p.edad} placeholder="Edad"
                onChange={(e) => setPersonas((ps) => ps.map((x) => (x.id === p.id ? { ...x, edad: e.target.value.replace(/\D/g, '').slice(0, 2) } : x)))}
                className="w-20 rounded-lg border-2 border-gray-200 px-2 py-2 text-center text-base focus:border-[#E8002D] focus:outline-none" />
              <span className="text-sm text-gray-500">años</span>
              {i > 0 && (
                <button type="button" aria-label={`Sacar ${p.rol}`} onClick={() => setPersonas((ps) => ps.filter((x) => x.id !== p.id))} className="text-gray-400 hover:text-[#E8002D]">✕</button>
              )}
            </div>
          ))}
          {personas.length < 6 && (
            <button type="button" onClick={() => setPersonas((ps) => [...ps, { id: Math.max(...ps.map((x) => x.id)) + 1, rol: ps.length === 1 ? 'Pareja' : 'Hijo/a', edad: '' }])}
              className="self-start text-sm font-semibold text-[#E8002D] hover:underline">+ Agregar integrante</button>
          )}
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">¿Condición?</p>
          <div className="grid grid-cols-3 gap-2">
            {CONDICIONES.map((c) => (
              <button key={c.id} type="button" onClick={() => setCondicion(c.id)}
                className={`rounded-xl border-2 px-2 py-2.5 text-sm font-semibold transition-colors ${condicion === c.id ? 'border-[#E8002D] bg-red-50 text-gray-900' : 'border-gray-200 text-gray-700 hover:border-[#E8002D]'}`}>
                {c.texto}
              </button>
            ))}
          </div>
        </div>

        {condicion === 'recibo' && (
          <div className="flex flex-col gap-2">
            {sueldos.map((s, i) => (
              <label key={i} htmlFor={`v2-sueldo-${i}`} className="flex flex-col gap-1 text-sm font-semibold text-gray-800">
                <span>Sueldo bruto{i > 0 ? ' del otro aporte' : ''} <span className="font-normal text-gray-500">· es para calcular tu aporte</span></span>
                <input id={`v2-sueldo-${i}`} inputMode="numeric" value={s} placeholder="Ej.: 1.500.000"
                  onChange={(e) => { const v = e.target.value.replace(/[^\d]/g, ''); setSueldos((xs) => xs.map((x, j) => (j === i ? (v ? Number(v).toLocaleString('es-AR') : '') : x))) }}
                  className="rounded-xl border-2 border-gray-200 px-3 py-2.5 text-base font-normal focus:border-[#E8002D] focus:outline-none" />
              </label>
            ))}
            {sueldos.length < 3 && (
              <button type="button" onClick={() => setSueldos((xs) => [...xs, ''])} className="self-start text-sm font-semibold text-[#E8002D] hover:underline">+ Sumar otro aporte</button>
            )}
          </div>
        )}

        {errorEdad && <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm font-semibold text-[#E8002D]">{errorEdad}</p>}
        <button type="button" onClick={verPrecios} className="w-full rounded-2xl bg-[#E8002D] py-4 text-base font-bold text-white shadow-md hover:bg-[#B8001F] lg:sticky lg:bottom-4">
          Ver precios →
        </button>
      </div>
    )
  }

  // ── Planes ────────────────────────────────────────────────────────────────
  if (paso === 'planes' && zona) {
    const visibles = lista.filter((p) => verMas || !p.mas)
    const tarjeta = (plan: PlanV2) => {
      const c = cotizacion(plan)
      // Premedic y OSDE sin precio en la zona no se muestran; Swiss y Sancor sí (el precio lo pasa el asesor)
      if (c.lista === null && precios && (plan.grupo === 'premedic' || plan.grupo === 'osde')) return null
      const fijos = plan.grupo === 'swiss' ? SANATORIOS_SWISS_FIJOS[zona.id] : undefined
      const sn = sanatorios.top[zona.id]?.[plan.k]
      const nombres = fijos ?? sn?.top
      const propios = plan.grupo === 'swiss' ? centrosPropiosSwiss(zona) : ''
      return (
        <div key={plan.k} className="flex flex-col gap-1.5">
          {plan.subir && <p className="text-center text-xs text-gray-500 lg:hidden">{plan.subir}</p>}
          <article className={`flex flex-col overflow-hidden rounded-2xl border-2 bg-white ${plan.sello ? 'border-[#E8002D] shadow-md' : 'border-gray-200'}`}>
            {c.promo && (
              <div className="flex flex-wrap items-baseline gap-x-2 bg-[#00875A] px-4 py-2 text-white">
                <span className="font-extrabold">🔥 {c.promo.corta}</span><span className="text-xs opacity-90">{c.promo.detalle}</span>
              </div>
            )}
            <div className="flex flex-col gap-2.5 p-4">
              {plan.sello && <span className="self-start rounded-full bg-[#E8002D] px-2.5 py-0.5 text-[11px] font-bold text-white">⭐ {plan.sello}</span>}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{plan.marca}</p>
                  <h3 className="text-xl font-extrabold leading-tight text-gray-900">{plan.nom}</h3>
                </div>
                <div className="text-right">
                  {!precios ? <span className="inline-block h-6 w-24 animate-pulse rounded bg-gray-100" /> : c.aPagar !== null ? (
                    <>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Precio de lista</p>
                      <p className="text-xl font-extrabold tabular-nums text-gray-900">{formatPrecio(c.aPagar)}</p>
                      <p className="text-[11px] text-gray-500">{condicion === 'recibo' ? (aportes ? 'por mes, con tu aporte descontado' : 'por mes, sin IVA') : 'por mes, IVA incluido'}</p>
                    </>
                  ) : <p className="text-xs text-gray-500">Tu precio te lo pasa<br />el asesor oficial</p>}
                </div>
              </div>
              <ul className="list-disc pl-5 text-sm text-gray-700">{plan.puntos.map((x) => <li key={x}>{x}</li>)}</ul>
              {nombres && (
                <div className="border-t border-dashed border-gray-200 pt-2 text-sm text-gray-800">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">🏥 Internación en {zona.nombre}</p>
                  {nombres.join(' · ')}{!fijos && !propios && sn && sn.total > 3 && <span className="text-gray-500"> y {sn.total - 3} más</span>}
                  {propios && <span className="mt-0.5 block font-bold text-[#E8002D]">{propios}</span>}
                </div>
              )}
              {c.promo && (
                <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">🔓 Pedilo ahora y pagás menos desde el primer mes. Tu precio final con descuento te lo pasa un asesor oficial.</p>
              )}
              {/* En la compu, el popup del plan (qué cubre y cartilla); en el celular, no */}
              <div className="hidden grid-cols-2 gap-2 lg:grid">
                {([['cubre', 'Qué cubre', <path key="i" d="M9 12l2 2 4-4M7.8 4.7a3.4 3.4 0 001.9-.8 3.4 3.4 0 014.6 0 3.4 3.4 0 001.9.8 3.4 3.4 0 013.1 3.1c.1.7.3 1.4.8 1.9a3.4 3.4 0 010 4.6 3.4 3.4 0 00-.8 1.9 3.4 3.4 0 01-3.1 3.1 3.4 3.4 0 00-1.9.8 3.4 3.4 0 01-4.6 0 3.4 3.4 0 00-1.9-.8 3.4 3.4 0 01-3.1-3.1 3.4 3.4 0 00-.8-1.9 3.4 3.4 0 010-4.6c.5-.5.7-1.2.8-1.9a3.4 3.4 0 013.1-3.1z" />],
                  ['cartilla', 'Cartilla', <path key="i" d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M12 7v4M10 9h4" />]] as const).map(([id, texto, icono]) => (
                  <button key={id} type="button" onClick={() => setModal({ pestana: id, plan })}
                    className="group flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50/70 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:-translate-y-0.5 hover:border-[#E8002D] hover:bg-white hover:text-gray-900 hover:shadow-sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-[#E8002D]">{icono}</svg>
                    {texto}
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => elegir(plan)}
                className={`w-full rounded-xl py-3 text-sm font-bold ${c.promo ? 'bg-[#E8002D] text-white hover:bg-[#B8001F]' : 'bg-red-50 text-[#E8002D] hover:bg-red-100'}`}>
                {c.promo ? `Quiero mi ${c.promo.pct} OFF →` : 'Quiero que me asesoren →'}
              </button>
              <p className="text-xs text-gray-500">✓ {asesorDe(plan.grupo)}{plan.grupo === 'swiss' || plan.grupo === 'sancor' ? ' · respuesta por WhatsApp' : ''}</p>
            </div>
          </article>
        </div>
      )
    }
    const swiss = visibles.filter((p) => p.grupo === 'swiss')
    const otros = visibles.filter((p) => p.grupo !== 'swiss')
    const planModal = modal ? prepagas.find((p) => p.slug === modal.plan.k.split('/')[0])?.planes.find((pl) => pl.slug === modal.plan.k.split('/')[1]) : undefined
    return (
      <div className="flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => setPaso('edades')} className="text-sm text-gray-500 hover:text-[#E8002D]">← Cambiar edades o condición</button>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">¡Encontramos tus planes en {zona.nombre}!</h2>
          <p className="text-sm text-gray-500">
            {edadesOk.length === 1 ? `1 persona de ${edadesOk[0]} años` : `${edadesOk.length} integrantes (${edadesOk.join(', ')} años)`} · {CONDICIONES.find((x) => x.id === condicion)?.texto.toLowerCase()}
          </p>
        </div>
        <p className="rounded-xl bg-amber-50 px-3.5 py-2 text-sm text-amber-800">⏰ Las prepagas aumentan todos los meses: el 1 de {mesQueViene} sube la lista de precios.</p>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Swiss Medical</p>
        {/* En la compu, de a 3 por fila; los 4 de Swiss en AMBA, de a 2 (que no quede uno solo abajo) */}
        <div className={`grid grid-cols-1 items-start gap-4 ${swiss.length === 4 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}`}>{swiss.map(tarjeta)}</div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Otras opciones</p>
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">{otros.map(tarjeta)}</div>
        {!verMas && (
          <button type="button" onClick={() => setVerMas(true)} className="self-center rounded-xl border-2 border-[#E8002D] px-6 py-3 text-sm font-bold text-[#E8002D] hover:bg-red-50">Ver más planes</button>
        )}
        <p className="text-xs text-gray-400">Precios de lista oficiales declarados ante la Superintendencia de Servicios de Salud. El precio final con promoción lo confirma el asesor.</p>
        {modal && (() => {
          const c = cotizacion(modal.plan)
          const prep = modal.plan.k.split('/')[0]
          return (
            <PlanDetalleV2 plan={modal.plan} datos={planModal} zonaNombre={zona.nombre}
              localidades={sanatorios.localidades[zona.id]?.[prep] ?? []} localidadInicial={localidadGeo}
              pestanaInicial={modal.pestana} precio={c.aPagar !== null ? formatPrecio(c.aPagar) : null} promo={c.promo}
              propios={modal.plan.grupo === 'swiss' ? centrosPropiosSwiss(zona) : ''}
              onClose={cerrarModal} onQuiero={() => elegir(modal.plan)} />
          )
        })()}
      </div>
    )
  }

  // ── Datos ─────────────────────────────────────────────────────────────────
  if (paso === 'datos' && elegido && zona) {
    const c = cotizacion(elegido)
    const quien = asesorDe(elegido.grupo).replace('Asesor', 'Un asesor')
    return (
      <div className="max-w-xl mx-auto flex flex-col gap-4">
        <button type="button" onClick={() => setPaso('planes')} className="self-start text-sm text-gray-500 hover:text-[#E8002D]">← Ver otros planes</button>
        <h2 className="text-2xl font-bold text-gray-900">¡Buenísima elección!</h2>
        {/* Resumen del plan elegido: qué pide y cuánto sale de lista */}
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{elegido.marca}</p>
            <p className="text-lg font-extrabold leading-tight text-gray-900">{elegido.nom}</p>
            {c.promo && <p className="mt-1 text-xs font-bold text-emerald-700">🔥 {c.promo.corta} · {c.promo.detalle}</p>}
          </div>
          {c.aPagar !== null && (
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Precio de lista</p>
              <p className="text-lg font-extrabold tabular-nums text-gray-900">{formatPrecio(c.aPagar)}</p>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-700">{quien} te pasa por WhatsApp tu precio final{c.promo ? ` con el ${c.promo.pct} OFF` : ''} y te ayuda con el alta.</p>
        <CampoTrampa />
        <label htmlFor="v2-nombre" className="flex flex-col gap-1 text-sm font-semibold text-gray-800">Nombre
          <input id="v2-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="given-name" placeholder="Tu nombre"
            className={`rounded-xl border-2 px-3 py-3 text-base font-normal focus:border-[#E8002D] focus:outline-none ${intento && !nombre.trim() ? 'border-[#E8002D] bg-red-50/40' : 'border-gray-200'}`} />
          {intento && !nombre.trim() && <span className="text-xs text-[#E8002D]">Falta tu nombre.</span>}
        </label>
        <label htmlFor="v2-celular" className="flex flex-col gap-1 text-sm font-semibold text-gray-800">Celular con código de área
          <input id="v2-celular" type="tel" inputMode="tel" value={celular} onChange={(e) => setCelular(e.target.value)} autoComplete="tel-national" placeholder="11 2345-6789"
            className={`rounded-xl border-2 px-3 py-3 text-base font-normal focus:border-[#E8002D] focus:outline-none ${intento && !celularOk ? 'border-[#E8002D] bg-red-50/40' : 'border-gray-200'}`} />
          {intento && !celularOk && <span className="text-xs text-[#E8002D]">{celular.trim() ? 'Revisá el número: con código de área, por ejemplo 11 2345-6789.' : 'Falta tu celular.'}</span>}
        </label>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">¿Para cuándo buscás el alta?</p>
          <div className="flex flex-col gap-2">
            {CUANDO_ALTA.map((x) => (
              <button key={x.id} type="button" onClick={() => setCuando(x.id)}
                className={`rounded-xl border-2 px-3.5 py-2.5 text-left text-sm font-semibold ${cuando === x.id ? 'border-[#E8002D] bg-red-50' : 'border-gray-200 hover:border-[#E8002D]'}`}>{x.texto}</button>
            ))}
          </div>
        </div>
        {errorEnvio && <p role="alert" className="text-sm text-red-600">No se pudo enviar. Probá de nuevo en un momento.</p>}
        <button type="button" onClick={enviar} disabled={enviando}
          className="w-full rounded-2xl bg-[#E8002D] py-4 text-base font-bold text-white shadow-md hover:bg-[#B8001F] disabled:cursor-wait disabled:opacity-70">
          {enviando ? 'Enviando…' : c.promo ? `Quiero mi precio con ${c.promo.pct} OFF →` : 'Quiero mi precio final →'}
        </button>
        <p className="text-center text-xs text-gray-500">📲 Te llega por WhatsApp · Gratis, sin DNI y sin compromiso</p>
      </div>
    )
  }

  // ── Listo ─────────────────────────────────────────────────────────────────
  if (paso === 'listo' && elegido) {
    const c = cotizacion(elegido)
    const pasos = [
      { t: 'Recibimos tu pedido', d: `${elegido.marca} ${elegido.nom}${c.promo ? ` con ${c.promo.corta}` : ''}`, estado: 'hecho' },
      { t: `Te escribe ${asesorDe(elegido.grupo).replace('Asesor', 'un asesor')}`, d: 'Por WhatsApp, en los próximos minutos (lunes a viernes de 8 a 20; si es fuera de horario, a primera hora del día hábil siguiente).', estado: 'ahora' },
      { t: c.promo ? `Te pasa tu precio final con el ${c.promo.pct} OFF` : 'Te pasa tu precio final', d: 'Y te ayuda con el alta, sin vueltas.', estado: 'despues' },
    ]
    return (
      <div className="max-w-xl mx-auto flex flex-col gap-5">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="cv2-modal grid h-16 w-16 place-items-center rounded-full bg-emerald-500 text-3xl font-black text-white shadow-lg shadow-emerald-200">✓</div>
          <h2 className="text-2xl font-bold text-gray-900">¡Listo, {nombre.trim().split(' ')[0]}! {c.promo ? `Tu ${c.promo.pct} OFF ya está pedido` : 'Ya pedimos tu precio'}</h2>
          <p className="text-sm text-gray-500">Tené el WhatsApp a mano: ahí te llega todo.</p>
        </div>
        {/* Qué pasa ahora, en tres pasos */}
        <ol className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          {pasos.map((x, i) => (
            <li key={x.t} className="relative flex gap-3 pb-5 last:pb-0">
              {i < pasos.length - 1 && <span aria-hidden className={`absolute left-[13px] top-7 h-[calc(100%-1.75rem)] w-0.5 ${x.estado === 'hecho' ? 'bg-emerald-400' : 'bg-gray-200'}`} />}
              <span className={`relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black ${x.estado === 'hecho' ? 'bg-emerald-500 text-white' : x.estado === 'ahora' ? 'bg-[#E8002D] text-white' : 'bg-gray-100 text-gray-500'}`}>
                {x.estado === 'hecho' ? '✓' : i + 1}
                {x.estado === 'ahora' && <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-[#E8002D]/40 motion-reduce:animate-none" />}
              </span>
              <div className="pt-0.5">
                <p className={`text-sm font-bold ${x.estado === 'despues' ? 'text-gray-500' : 'text-gray-900'}`}>{x.t}</p>
                <p className="text-sm text-gray-500">{x.d}</p>
              </div>
            </li>
          ))}
        </ol>
        {/* Si el número está mal, el asesor no llega: se puede corregir acá */}
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-gray-50 px-4 py-3 text-sm">
          <span className="text-gray-600">Te escribimos al <strong className="whitespace-nowrap text-gray-900">{celular.trim()}</strong></span>
          <button type="button" onClick={() => setPaso('datos')} className="shrink-0 font-semibold text-[#E8002D] hover:underline">¿Está mal? Corregilo</button>
        </div>
      </div>
    )
  }
  return null
}
