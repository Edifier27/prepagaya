'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { logout } from './actions'
import PanelResenas from './PanelResenas'
import type { LeadRow, EstadoLead } from '@/lib/db'
import { whatsappLinkParaLead } from '@/lib/utils'

// Preferencias (JSON de lib/data/sondeo.ts) en una línea legible para el panel.
const ETIQUETAS_PREFERENCIAS: Record<string, string> = {
  copago: 'Copago', coberturas: 'Coberturas', zona: 'Zona (quiz)', saludMental: 'Salud mental',
  medicoDeConfianza: 'Médico de confianza', grupo: 'Grupo',
}
function textoPreferencias(json: string | null): string {
  if (!json) return ''
  try {
    return Object.entries(JSON.parse(json) as Record<string, string>)
      .map(([k, v]) => `${ETIQUETAS_PREFERENCIAS[k] ?? k}: ${v}`).join(' · ')
  } catch {
    return ''
  }
}

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''
const POLL_MS = 20000

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const base64Safe = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64Safe)
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)))
}

function formatFecha(iso: string): string {
  return new Date(iso).toLocaleString('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

// "2026-09" — ordena bien como string (año-mes) sin tener que parsear fechas.
function mesKey(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}
function mesLabel(key: string): string {
  const [anio, mes] = key.split('-').map(Number)
  const texto = new Date(anio, mes - 1, 1).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

// "Banfield (GBA Sur)" → { localidad: 'Banfield', region: 'GBA Sur' }; "CABA" → region CABA.
function partesZona(label: string | null): { localidad: string | null; region: string } | null {
  if (!label) return null
  const m = label.match(/^(.*?)\s*\(([^)]+)\)$/)
  return m ? { localidad: m[1], region: m[2] } : { localidad: null, region: label }
}

const esHoy = (iso: string) => new Date(iso).toDateString() === new Date().toDateString()

function normalizar(t: string): string {
  return t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

// WhatsApp del lead (pedido de Darío, 23-sep-2026): mismo mensaje de apertura
// que se manda a Kommo para los argentinos; los internacionales (pais seteado)
// ya traen el código de país, así que van tal cual, sin mensaje.
function linkWhatsapp(lead: LeadRow): string | null {
  if (!lead.celular) return null
  if (lead.pais) return `https://wa.me/${lead.celular.replace(/\D/g, '')}`
  return whatsappLinkParaLead(lead.nombre, lead.celular)
}

// Estados comerciales del lead (mini CRM, 23-sep-2026). Se define acá y no se
// importa de lib/db para no arrastrar el cliente de la base al bundle.
const ESTADOS: { id: EstadoLead; label: string; clase: string }[] = [
  { id: 'nuevo', label: 'Nuevo', clase: 'bg-gray-100 text-gray-600' },
  { id: 'contactado', label: 'Contactado', clase: 'bg-blue-50 text-blue-700' },
  { id: 'cotizado', label: 'Cotizado', clase: 'bg-amber-50 text-amber-700' },
  { id: 'vendido', label: 'Vendido', clase: 'bg-emerald-50 text-emerald-700' },
  { id: 'perdido', label: 'Perdido', clase: 'bg-red-50 text-red-600' },
]
const estadoInfo = (id: EstadoLead | null | undefined) => ESTADOS.find((e) => e.id === (id ?? 'nuevo')) ?? ESTADOS[0]

// Seguimiento pendiente = fecha ya vencida y lead todavía abierto.
const seguimientoVencido = (l: LeadRow) =>
  Boolean(l.seguimiento_en) && new Date(l.seguimiento_en!).getTime() <= Date.now() && l.estado !== 'vendido' && l.estado !== 'perdido'

// Exporta lo que se está viendo (con los filtros aplicados) a CSV para Excel:
// separador ";" y BOM para que Excel en español lo abra con acentos bien.
function exportarCSV(leads: LeadRow[]) {
  const cols: [string, (l: LeadRow) => string][] = [
    ['Fecha', (l) => new Date(l.creado_en).toLocaleString('es-AR')],
    ['Nombre', (l) => l.nombre],
    ['Celular', (l) => l.celular ?? ''],
    ['Email', (l) => l.email ?? ''],
    ['Interés', (l) => l.prepaga ?? ''],
    ['Zona', (l) => l.provincia ?? ''],
    ['Integrantes', (l) => l.edades ?? ''],
    ['Situación laboral', (l) => l.situacion_laboral ?? ''],
    ['Cobertura actual', (l) => l.prepaga_actual ?? ''],
    ['Presupuesto (quiz)', (l) => l.presupuesto ?? ''],
    ['Preferencias', (l) => textoPreferencias(l.preferencias)],
    ['Fuente', (l) => l.fuente ?? ''],
    ['Estado', (l) => estadoInfo(l.estado).label],
    ['Notas', (l) => l.notas ?? ''],
    ['Seguimiento', (l) => (l.seguimiento_en ? new Date(l.seguimiento_en).toLocaleString('es-AR') : '')],
    ['Kommo', (l) => l.kommo_link ?? ''],
  ]
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`
  const filas = [cols.map(([c]) => esc(c)).join(';'), ...leads.map((l) => cols.map(([, f]) => esc(f(l))).join(';'))]
  const blob = new Blob(['\uFEFF' + filas.join('\r\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `leads-prepagaya-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// Filtros combinables (pedido de Darío, 23-sep-2026): antes solo se podía
// filtrar por mes; ahora también por zona, fuente, hoy, sin leer y búsqueda.
interface Filtros {
  mes: string | null
  zona: string | null
  fuente: string | null
  soloHoy: boolean
  soloSinLeer: boolean
  busqueda: string
  estado: EstadoLead | null
  soloSeguimiento: boolean
  region: string | null
}
const FILTROS_VACIOS: Filtros = { mes: null, zona: null, fuente: null, soloHoy: false, soloSinLeer: false, busqueda: '', estado: null, soloSeguimiento: false, region: null }
type FiltroChip = 'mes' | 'zona' | 'fuente' | 'region'

type EstadoAlertas = 'desconocido' | 'inactivas' | 'activando' | 'activas' | 'no-soportado' | 'rechazadas'

export default function PanelLeads({ leadsIniciales }: { leadsIniciales: LeadRow[] }) {
  const [leads, setLeads] = useState(leadsIniciales)
  const [estadoAlertas, setEstadoAlertas] = useState<EstadoAlertas>('desconocido')
  const [refrescando, setRefrescando] = useState(false)
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VACIOS)
  // Pestañas del panel: leads o moderación de reseñas (23-sep-2026)
  const [vista, setVista] = useState<'leads' | 'resenas'>('leads')
  const [resenasPendientes, setResenasPendientes] = useState<number | null>(null)
  useEffect(() => {
    fetch('/api/panel/resenas?estado=pendiente')
      .then((r) => (r.ok ? r.json() : { resenas: [] }))
      .then((d) => setResenasPendientes(d.resenas.length))
      .catch(() => {})
  }, [])
  const ultimoId = useRef(leadsIniciales[0]?.id ?? 0)

  const alternar = useCallback((clave: FiltroChip, valor: string) => {
    setFiltros((f) => ({ ...f, [clave]: f[clave] === valor ? null : valor }))
  }, [])

  // Trae los leads más nuevos que el último visto — la usan tanto el
  // polling automático como el botón "Refrescar" (pedido de Darío,
  // 20-sep-2026: poder forzar la actualización sin esperar los 20s).
  const refrescar = useCallback(async (notificarSiHayNuevos: boolean) => {
    try {
      const res = await fetch(`/api/panel/leads?after=${ultimoId.current}`)
      if (!res.ok) return
      const { leads: nuevos } = (await res.json()) as { leads: LeadRow[] }
      if (nuevos.length === 0) return

      setLeads((prev) => [...nuevos, ...prev])
      ultimoId.current = Math.max(ultimoId.current, ...nuevos.map((l) => l.id))

      if (notificarSiHayNuevos && document.hidden && Notification.permission === 'granted') {
        const l = nuevos[0]
        const cuenta = extraerCuentaKommo(l.kommo_estado)
        new Notification('PrepagaYa — Lead nuevo', {
          body: `${l.nombre} · ${l.prepaga || 'Sin especificar'}${cuenta ? ` · → ${cuenta}` : ''}`,
          icon: '/panel-icon-192',
        })
      }
    } catch {
      // silencioso — el polling reintenta solo en el próximo tick
    }
  }, [])

  const refrescarManual = useCallback(async () => {
    setRefrescando(true)
    await refrescar(false)
    setRefrescando(false)
  }, [refrescar])

  // Chequea el estado real (permiso + suscripción activa) al entrar, para no
  // mostrar "Activar alertas" si esta compu ya las tiene prendidas.
  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setEstadoAlertas('no-soportado')
      return
    }
    if (Notification.permission === 'denied') {
      setEstadoAlertas('rechazadas')
      return
    }
    navigator.serviceWorker.register('/sw.js').then(async (reg) => {
      const sub = await reg.pushManager.getSubscription()
      setEstadoAlertas(sub ? 'activas' : 'inactivas')
    }).catch(() => setEstadoAlertas('inactivas'))
  }, [])

  // Polling: cada 20s pregunta si hay leads más nuevos que el último visto.
  // Si el usuario tiene la pestaña abierta, además de sumarlos a la lista
  // dispara una notificación local al toque (sin esperar el viaje del push).
  useEffect(() => {
    const interval = setInterval(() => refrescar(true), POLL_MS)
    return () => clearInterval(interval)
  }, [refrescar])

  const activarAlertas = useCallback(async () => {
    if (!VAPID_PUBLIC_KEY) {
      alert('Falta configurar la clave pública de notificaciones en el servidor.')
      return
    }
    setEstadoAlertas('activando')
    try {
      const permiso = await Notification.requestPermission()
      if (permiso !== 'granted') {
        setEstadoAlertas('rechazadas')
        return
      }
      const reg = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      })
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub.toJSON()),
      })
      setEstadoAlertas('activas')
    } catch (err) {
      console.error(err)
      setEstadoAlertas('inactivas')
    }
  }, [])

  const toggleLeido = useCallback(async (id: number, leidoActual: boolean) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, leido: !leidoActual } : l)))
    await fetch('/api/panel/leido', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, leido: !leidoActual }),
    }).catch(() => {})
  }, [])

  // Borrado desde la card (pedido de Darío, 23-sep-2026). En la base es un
  // soft delete — ver eliminarLead en lib/db.ts.
  const eliminar = useCallback(async (id: number) => {
    const res = await fetch('/api/panel/eliminar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => null)
    if (res?.ok) setLeads((prev) => prev.filter((l) => l.id !== id))
    else alert('No se pudo eliminar el lead. Probá de nuevo.')
  }, [])

  // Estado / notas / seguimiento: actualización optimista + POST.
  const actualizar = useCallback(async (id: number, cambios: Partial<Pick<LeadRow, 'estado' | 'notas' | 'seguimiento_en'>>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...cambios, ...(cambios.seguimiento_en !== undefined ? { seguimiento_avisado: false } : {}) } : l)))
    await fetch('/api/panel/actualizar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...cambios }),
    }).catch(() => {})
  }, [])

  const sinLeer = leads.filter((l) => !l.leido).length
  const seguimientos = leads.filter(seguimientoVencido).length

  // Estadísticas del "mini CRM" (pedido de Darío, 20-sep-2026): cuántos
  // datos entran y de dónde — se calculan solas de los leads ya cargados
  // en el panel, sin pedir nada nuevo al servidor.
  const stats = useMemo(() => {
    const hoy = leads.filter((l) => esHoy(l.creado_en)).length
    const contar = (valores: (string | null)[]) => {
      const mapa = new Map<string, number>()
      for (const v of valores) {
        const key = v?.trim() || 'Sin especificar'
        mapa.set(key, (mapa.get(key) ?? 0) + 1)
      }
      return [...mapa.entries()].sort((a, b) => b[1] - a[1])
    }
    // Por mes ordenado por fecha (más reciente primero), no por cantidad —
    // pedido de Darío, 21-sep-2026: "datos de agosto, datos de septiembre",
    // filtrable tocando el mes.
    const porMesMapa = new Map<string, number>()
    for (const l of leads) {
      const key = mesKey(l.creado_en)
      porMesMapa.set(key, (porMesMapa.get(key) ?? 0) + 1)
    }
    const porMes = [...porMesMapa.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1))

    const porEstado = ESTADOS.map((e) => [e.id, leads.filter((l) => (l.estado ?? 'nuevo') === e.id).length] as [EstadoLead, number])
    // Ventas por fuente: qué páginas del sitio traen leads que se venden.
    const fuentes = new Map<string, { total: number; vendidos: number }>()
    for (const l of leads) {
      const key = l.fuente?.trim() || 'Sin especificar'
      const f = fuentes.get(key) ?? { total: 0, vendidos: 0 }
      f.total++
      if (l.estado === 'vendido') f.vendidos++
      fuentes.set(key, f)
    }
    const ventasPorFuente = [...fuentes.entries()]
      .filter(([, f]) => f.vendidos > 0)
      .sort((a, b) => b[1].vendidos - a[1].vendidos)

    return {
      total: leads.length,
      hoy,
      porZona: contar(leads.map((l) => l.provincia)),
      porRegion: contar(leads.map((l) => partesZona(l.zona_detectada)?.region ?? null)),
      porFuente: contar(leads.map((l) => l.fuente)),
      porMes,
      porEstado,
      ventasPorFuente,
    }
  }, [leads])

  const leadsFiltrados = useMemo(() => {
    const q = normalizar(filtros.busqueda.trim())
    const qDigitos = filtros.busqueda.replace(/\D/g, '')
    return leads.filter((l) => {
      if (filtros.mes && mesKey(l.creado_en) !== filtros.mes) return false
      if (filtros.zona && (l.provincia?.trim() || 'Sin especificar') !== filtros.zona) return false
      if (filtros.fuente && (l.fuente?.trim() || 'Sin especificar') !== filtros.fuente) return false
      if (filtros.soloHoy && !esHoy(l.creado_en)) return false
      if (filtros.soloSinLeer && l.leido) return false
      if (filtros.estado && (l.estado ?? 'nuevo') !== filtros.estado) return false
      if (filtros.region && (partesZona(l.zona_detectada)?.region ?? 'Sin especificar') !== filtros.region) return false
      if (filtros.soloSeguimiento && !seguimientoVencido(l)) return false
      if (q) {
        const texto = normalizar([l.nombre, l.email, l.prepaga, l.provincia, l.zona_detectada].filter(Boolean).join(' '))
        const coincideTel = qDigitos.length >= 3 && (l.celular ?? '').replace(/\D/g, '').includes(qDigitos)
        if (!texto.includes(q) && !coincideTel) return false
      }
      return true
    })
  }, [leads, filtros])

  const hayFiltros = Boolean(
    filtros.mes || filtros.zona || filtros.fuente || filtros.soloHoy || filtros.soloSinLeer || filtros.busqueda.trim() || filtros.estado || filtros.soloSeguimiento || filtros.region
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E8002D] text-white flex items-center justify-center font-black text-sm flex-shrink-0">P</div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-tight">Panel de Leads</h1>
              <p className="text-xs text-gray-400 leading-tight">{sinLeer > 0 ? `${sinLeer} sin leer` : 'Todo leído'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refrescarManual}
              disabled={refrescando}
              className="text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 rounded-full px-3 py-1.5 transition-colors flex items-center gap-1.5"
            >
              <span className={refrescando ? 'animate-spin' : ''}>↻</span>
              {refrescando ? 'Actualizando…' : 'Refrescar'}
            </button>
            <button
              onClick={() => exportarCSV(leadsFiltrados)}
              className="text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5 transition-colors"
              title="Descargar los leads que estás viendo (con filtros) en CSV para Excel"
            >
              ⬇ Exportar
            </button>
            <BotonAlertas estado={estadoAlertas} onActivar={activarAlertas} />
            <form action={logout}>
              <button type="submit" className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors px-2 py-1.5">
                Salir
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4">
        <div className="flex gap-1.5 mb-3">
          {([['leads', 'Leads'], ['resenas', 'Reseñas']] as const).map(([id, label]) => (
            <button key={id} onClick={() => setVista(id)}
              className={`text-sm font-semibold rounded-xl px-4 py-2 transition-colors ${vista === id ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900'}`}>
              {label}
              {id === 'resenas' && resenasPendientes ? <span className="ml-1.5 text-[10px] font-bold bg-[#E8002D] text-white rounded-full px-1.5 py-0.5">{resenasPendientes}</span> : null}
            </button>
          ))}
        </div>

        {vista === 'resenas' ? <PanelResenas onPendientes={setResenasPendientes} /> : (<>
        <StatsPanel
          stats={stats}
          filtros={filtros}
          onAlternar={alternar}
          onHoy={() => setFiltros((f) => ({ ...f, soloHoy: !f.soloHoy }))}
          onEstado={(e) => setFiltros((f) => ({ ...f, estado: f.estado === e ? null : e }))}
        />

        {/* Barra de filtros: búsqueda + sin leer + resumen de lo aplicado */}
        <div className="bg-white rounded-2xl border border-gray-100 p-3 mb-3 space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-300 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden>
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.45 4.39l3.08 3.08a.75.75 0 11-1.06 1.06l-3.08-3.08A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
              <input
                type="search"
                value={filtros.busqueda}
                onChange={(e) => setFiltros((f) => ({ ...f, busqueda: e.target.value }))}
                placeholder="Buscar por nombre, teléfono, email o prepaga"
                className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-[#E8002D] focus:bg-white"
              />
            </div>
            <button
              onClick={() => setFiltros((f) => ({ ...f, soloSinLeer: !f.soloSinLeer }))}
              className={`text-xs font-semibold rounded-xl px-3 py-2 whitespace-nowrap transition-colors ${
                filtros.soloSinLeer ? 'bg-[#E8002D] text-white' : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-[#E8002D]'
              }`}
            >
              Sin leer · {sinLeer}
            </button>
            {seguimientos > 0 && (
              <button
                onClick={() => setFiltros((f) => ({ ...f, soloSeguimiento: !f.soloSeguimiento }))}
                className={`text-xs font-semibold rounded-xl px-3 py-2 whitespace-nowrap transition-colors ${
                  filtros.soloSeguimiento ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
                title="Leads con seguimiento vencido"
              >
                ⏰ {seguimientos}
              </button>
            )}
          </div>
          {hayFiltros && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-gray-500 mr-1">
                Mostrando <strong className="text-gray-900">{leadsFiltrados.length}</strong> de {leads.length}
              </span>
              {filtros.soloHoy && <ChipActivo onQuitar={() => setFiltros((f) => ({ ...f, soloHoy: false }))}>Hoy</ChipActivo>}
              {filtros.mes && <ChipActivo onQuitar={() => setFiltros((f) => ({ ...f, mes: null }))}>{mesLabel(filtros.mes)}</ChipActivo>}
              {filtros.zona && <ChipActivo onQuitar={() => setFiltros((f) => ({ ...f, zona: null }))}>{filtros.zona}</ChipActivo>}
              {filtros.region && <ChipActivo onQuitar={() => setFiltros((f) => ({ ...f, region: null }))}>📍 {filtros.region}</ChipActivo>}
              {filtros.fuente && <ChipActivo onQuitar={() => setFiltros((f) => ({ ...f, fuente: null }))}>{filtros.fuente}</ChipActivo>}
              {filtros.soloSinLeer && <ChipActivo onQuitar={() => setFiltros((f) => ({ ...f, soloSinLeer: false }))}>Sin leer</ChipActivo>}
              {filtros.estado && <ChipActivo onQuitar={() => setFiltros((f) => ({ ...f, estado: null }))}>{estadoInfo(filtros.estado).label}</ChipActivo>}
              {filtros.soloSeguimiento && <ChipActivo onQuitar={() => setFiltros((f) => ({ ...f, soloSeguimiento: false }))}>Seguimientos vencidos</ChipActivo>}
              <button onClick={() => setFiltros(FILTROS_VACIOS)} className="text-[#E8002D] font-semibold hover:underline ml-auto">
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          {leadsFiltrados.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-16">
              {hayFiltros ? 'Ningún lead coincide con los filtros.' : 'Todavía no entró ningún lead.'}
            </p>
          )}
          {leadsFiltrados.map((lead) => (
            <LeadRow key={lead.id} lead={lead} onToggleLeido={toggleLeido} onEliminar={eliminar} onActualizar={actualizar} />
          ))}
        </div>
        </>)}
      </div>
    </div>
  )
}

interface Stats {
  total: number
  hoy: number
  porZona: [string, number][]
  porFuente: [string, number][]
  porMes: [string, number][]
  porEstado: [EstadoLead, number][]
  porRegion: [string, number][]
  ventasPorFuente: [string, { total: number; vendidos: number }][]
}

function ChipActivo({ children, onQuitar }: { children: React.ReactNode; onQuitar: () => void }) {
  return (
    <button onClick={onQuitar} className="inline-flex items-center gap-1 bg-red-50 text-[#E8002D] font-semibold rounded-full px-2 py-0.5 hover:bg-red-100">
      {children} <span aria-hidden>×</span>
    </button>
  )
}

function StatsPanel({ stats, filtros, onAlternar, onHoy, onEstado }: {
  stats: Stats
  filtros: Filtros
  onAlternar: (clave: FiltroChip, valor: string) => void
  onHoy: () => void
  onEstado: (e: EstadoLead) => void
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-3">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="text-2xl font-black text-gray-900 leading-none">{stats.total}</div>
          <div className="text-[11px] text-gray-500 mt-1">Leads totales</div>
        </div>
        <button
          onClick={onHoy}
          className={`text-left rounded-xl p-3 transition-colors ${filtros.soloHoy ? 'bg-[#E8002D]' : 'bg-red-50 hover:bg-red-100'}`}
          title="Tocá para ver solo los de hoy"
        >
          <div className={`text-2xl font-black leading-none ${filtros.soloHoy ? 'text-white' : 'text-[#E8002D]'}`}>{stats.hoy}</div>
          <div className={`text-[11px] mt-1 ${filtros.soloHoy ? 'text-red-100' : 'text-gray-500'}`}>Hoy · tocá para filtrar</div>
        </button>
      </div>

      {/* Embudo comercial: tocá un estado para filtrar */}
      <div className="mb-4">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Estado</div>
        <div className="flex flex-wrap gap-1.5">
          {stats.porEstado.map(([id, n]) => {
            const e = estadoInfo(id)
            const sel = filtros.estado === id
            return (
              <button
                key={id}
                onClick={() => onEstado(id)}
                className={`text-[11px] font-semibold rounded-full px-2 py-1 transition-colors ${sel ? 'bg-[#E8002D] text-white' : `${e.clase} hover:opacity-80`}`}
              >
                {e.label} <span className={sel ? 'text-red-100' : 'opacity-60'}>· {n}</span>
              </button>
            )
          })}
        </div>
        {stats.ventasPorFuente.length > 0 && (
          <div className="mt-3">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Ventas por fuente</div>
            <div className="space-y-1">
              {stats.ventasPorFuente.slice(0, 6).map(([fuente, f]) => (
                <div key={fuente} className="flex items-center gap-2 text-[11px]">
                  <span className="text-gray-700 font-semibold truncate flex-1">{fuente}</span>
                  <span className="text-gray-500">{f.vendidos} de {f.total}</span>
                  <span className="font-bold text-emerald-700 w-10 text-right">{Math.round((f.vendidos / f.total) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {stats.porMes.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Por mes</div>
          <div className="flex flex-wrap gap-1.5">
            {stats.porMes.map(([mes, n]) => (
              <ChipFiltro key={mes} activo={filtros.mes === mes} onClick={() => onAlternar('mes', mes)}>
                {mesLabel(mes)} <span className={filtros.mes === mes ? 'text-red-100' : 'text-gray-400'}>· {n}</span>
              </ChipFiltro>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatBreakdown titulo="Por zona elegida" items={stats.porZona} activo={filtros.zona} onSelect={(v) => onAlternar('zona', v)} />
        <StatBreakdown titulo="Por zona detectada (aprox.)" items={stats.porRegion} activo={filtros.region} onSelect={(v) => onAlternar('region', v)} />
        <StatBreakdown titulo="Por fuente" items={stats.porFuente} activo={filtros.fuente} onSelect={(v) => onAlternar('fuente', v)} />
      </div>
    </div>
  )
}

function ChipFiltro({ activo, onClick, children }: { activo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`text-[11px] font-semibold rounded-full px-2 py-1 transition-colors ${
        activo ? 'bg-[#E8002D] text-white' : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-[#E8002D]'
      }`}
    >
      {children}
    </button>
  )
}

// Chips de zona y fuente clickeables para filtrar (antes eran solo
// informativos); "+N más" despliega el resto en vez de solo contarlo.
function StatBreakdown({ titulo, items, activo, onSelect }: {
  titulo: string
  items: [string, number][]
  activo: string | null
  onSelect: (valor: string) => void
}) {
  const [verTodos, setVerTodos] = useState(false)
  if (items.length === 0) return null
  const visibles = verTodos ? items : items.slice(0, 6)
  const resto = items.length - visibles.length
  return (
    <div>
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">{titulo}</div>
      <div className="flex flex-wrap gap-1.5">
        {visibles.map(([nombre, n]) => (
          <ChipFiltro key={nombre} activo={activo === nombre} onClick={() => onSelect(nombre)}>
            {nombre} <span className={activo === nombre ? 'text-red-100' : 'text-gray-400'}>· {n}</span>
          </ChipFiltro>
        ))}
        {resto > 0 && (
          <button onClick={() => setVerTodos(true)} className="text-[11px] font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-full px-2 py-1">
            +{resto} más
          </button>
        )}
      </div>
    </div>
  )
}

function BotonAlertas({ estado, onActivar }: { estado: EstadoAlertas; onActivar: () => void }) {
  if (estado === 'no-soportado') return null
  if (estado === 'activas') {
    return <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">🔔 Alertas activas</span>
  }
  if (estado === 'rechazadas') {
    return <span className="text-xs text-gray-400" title="Habilitá las notificaciones para este sitio en la config del navegador">Alertas bloqueadas</span>
  }
  return (
    <button
      onClick={onActivar}
      disabled={estado === 'activando'}
      className="text-xs font-semibold text-white bg-[#E8002D] hover:bg-[#c8001f] disabled:opacity-60 rounded-full px-3 py-1.5 transition-colors"
    >
      {estado === 'activando' ? 'Activando…' : '🔔 Activar alertas'}
    </button>
  )
}

// "OK (Darío)" / "OK (Gabriela) — ya era contacto" → "Darío" / "Gabriela".
function extraerCuentaKommo(estado: string | null): string | null {
  if (!estado) return null
  const m = estado.match(/OK \(([^)]+)\)/)
  return m ? m[1] : null
}

// Fila compacta y plegable (pedido de Darío, 20-sep-2026: la card anterior
// ocupaba demasiado alto siempre expandida). El resumen de una línea trae
// lo que hace falta para escanear la lista rápido; el resto se abre al
// tocarla — mismo patrón <details>/<summary> que ya usan las FAQ del sitio.
function LeadRow({ lead, onToggleLeido, onEliminar, onActualizar }: {
  lead: LeadRow
  onToggleLeido: (id: number, leidoActual: boolean) => void
  onEliminar: (id: number) => Promise<void>
  onActualizar: (id: number, cambios: Partial<Pick<LeadRow, 'estado' | 'notas' | 'seguimiento_en'>>) => Promise<void>
}) {
  const cuenta = extraerCuentaKommo(lead.kommo_estado)
  const kommoOk = lead.kommo_estado?.startsWith('OK') ?? false
  const wa = linkWhatsapp(lead)
  const [confirmando, setConfirmando] = useState(false)
  const [eliminando, setEliminando] = useState(false)
  const [notas, setNotas] = useState(lead.notas ?? '')
  const estado = estadoInfo(lead.estado)
  const vencido = seguimientoVencido(lead)

  // Atajos de seguimiento: mañana 10 hs, en 2 días y en una semana (10 hs).
  const programar = (dias: number) => {
    const d = new Date()
    d.setDate(d.getDate() + dias)
    d.setHours(10, 0, 0, 0)
    onActualizar(lead.id, { seguimiento_en: d.toISOString() })
  }

  return (
    <details className={`group bg-white rounded-xl border transition-colors overflow-hidden ${lead.leido ? 'border-gray-100' : 'border-red-200'}`}>
      <summary className="flex items-center gap-2 px-3 py-2.5 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
        {!lead.leido && <span className="w-1.5 h-1.5 rounded-full bg-[#E8002D] flex-shrink-0" />}
        <span className="font-bold text-gray-900 text-sm truncate">{lead.nombre}</span>
        {lead.veces > 1 && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 text-amber-700 bg-amber-50" title={`Se repitió ${lead.veces} veces en 24hs`}>
            ×{lead.veces}
          </span>
        )}
        {cuenta && (
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
            cuenta === 'Gabriela' ? 'text-purple-700 bg-purple-50' : 'text-blue-700 bg-blue-50'
          }`}>
            {cuenta}
          </span>
        )}
        {lead.estado && lead.estado !== 'nuevo' && (
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${estado.clase}`}>{estado.label}</span>
        )}
        {vencido && <span className="text-[11px] flex-shrink-0" title="Seguimiento vencido">⏰</span>}
        {lead.provincia && <span className="text-[11px] text-gray-400 truncate hidden sm:inline">{lead.provincia}</span>}
        <span className="flex-1" />
        <span className={`text-[11px] flex-shrink-0 ${kommoOk ? 'text-emerald-500' : 'text-amber-500'}`} title={kommoOk ? 'Kommo OK' : 'Kommo falló'}>
          {kommoOk ? '✓' : '⚠'}
        </span>
        <span className="text-[11px] text-gray-400 flex-shrink-0 whitespace-nowrap">{formatFecha(lead.creado_en)}</span>
        {wa && (
          // Botón (no <a>) con preventDefault: un click dentro de <summary>,
          // además de abrir WhatsApp, plegaría o desplegaría la card.
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); window.open(wa, '_blank', 'noopener') }}
            className="w-7 h-7 rounded-full bg-[#25D366] hover:bg-[#1ebe5a] text-white flex items-center justify-center flex-shrink-0 transition-colors"
            title={`Escribirle a ${lead.nombre} por WhatsApp`}
            aria-label={`WhatsApp a ${lead.nombre}`}
          >
            <IconoWhatsapp />
          </button>
        )}
        <svg className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>

      <div className="px-3 pb-3 border-t border-gray-50 pt-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-xs">
          {lead.celular && <Campo label="Celular"><a href={`tel:${lead.celular}`} className="text-[#E8002D] font-semibold hover:underline">{lead.celular}</a></Campo>}
          {lead.email && <Campo label="Email"><a href={`mailto:${lead.email}`} className="text-gray-700 hover:underline break-all">{lead.email}</a></Campo>}
          {lead.prepaga && <Campo label="Interés">{lead.prepaga}</Campo>}
          {lead.provincia && <Campo label="Zona">{lead.provincia}</Campo>}
          {lead.zona_detectada && <Campo label="Detectada (aprox.)">{lead.zona_detectada}</Campo>}
          {lead.edades && <Campo label="Integrantes">{lead.edades}</Campo>}
          {lead.situacion_laboral && <Campo label="Situación laboral">{lead.situacion_laboral}</Campo>}
          {lead.prepaga_actual && <Campo label="Cobertura actual">{lead.prepaga_actual}</Campo>}
          {lead.presupuesto && <Campo label="Presupuesto (quiz)">{lead.presupuesto}</Campo>}
          {textoPreferencias(lead.preferencias) && <Campo label="Preferencias">{textoPreferencias(lead.preferencias)}</Campo>}
          {lead.fuente && <Campo label="Fuente">{lead.fuente}</Campo>}
          {lead.veces > 1 && lead.actualizado_en && <Campo label="Última actividad">{formatFecha(lead.actualizado_en)}</Campo>}
        </div>

        {/* Estado comercial */}
        <div className="mt-3 pt-3 border-t border-gray-50">
          <div className="text-gray-400 text-[10px] uppercase tracking-wide mb-1.5">Estado</div>
          <div className="flex flex-wrap gap-1.5">
            {ESTADOS.map((e) => (
              <button
                key={e.id}
                onClick={() => onActualizar(lead.id, { estado: e.id })}
                className={`text-[11px] font-semibold rounded-full px-2.5 py-1 border transition-colors ${
                  (lead.estado ?? 'nuevo') === e.id ? `${e.clase} border-current` : 'border-gray-200 text-gray-400 hover:text-gray-600'
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notas: se guardan al salir del campo */}
        <div className="mt-3">
          <div className="text-gray-400 text-[10px] uppercase tracking-wide mb-1.5">Notas</div>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            onBlur={() => { if (notas !== (lead.notas ?? '')) onActualizar(lead.id, { notas }) }}
            rows={2}
            placeholder="Ej: quiere Swiss SMG20, vuelve a llamar el viernes"
            className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#E8002D] focus:bg-white resize-y"
          />
        </div>

        {/* Seguimiento con aviso push (lo manda el cron cuando llega la fecha) */}
        <div className="mt-2">
          <div className="text-gray-400 text-[10px] uppercase tracking-wide mb-1.5">Seguimiento</div>
          {lead.seguimiento_en ? (
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className={`font-semibold ${vencido ? 'text-amber-700' : 'text-gray-700'}`}>
                {vencido ? '⏰ Vencido: ' : '⏰ '}{formatFecha(lead.seguimiento_en)}
              </span>
              <button onClick={() => onActualizar(lead.id, { seguimiento_en: null })} className="text-gray-400 hover:text-gray-600 font-semibold">
                Quitar
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {[['Mañana', 1], ['En 2 días', 2], ['En 1 semana', 7]].map(([label, dias]) => (
                <button
                  key={label}
                  onClick={() => programar(dias as number)}
                  className="text-[11px] font-semibold rounded-full px-2.5 py-1 border border-gray-200 text-gray-500 hover:border-[#E8002D] hover:text-[#E8002D]"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-gray-50">
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="text-[11px] font-semibold text-[#128C4A] hover:underline inline-flex items-center gap-1">
              <IconoWhatsapp className="w-3.5 h-3.5" /> WhatsApp
            </a>
          )}
          {lead.kommo_link && (
            <a href={lead.kommo_link} target="_blank" rel="noopener noreferrer" className="text-[11px] font-semibold text-[#E8002D] hover:underline">
              Ver en Kommo →
            </a>
          )}
          <button
            onClick={() => onToggleLeido(lead.id, lead.leido)}
            className="text-[11px] font-semibold text-gray-400 hover:text-gray-600 transition-colors ml-auto"
          >
            {lead.leido ? 'Marcar no leído' : 'Marcar leído'}
          </button>
          {confirmando ? (
            <span className="flex items-center gap-2 text-[11px]">
              <span className="text-gray-500">¿Eliminar?</span>
              <button
                disabled={eliminando}
                onClick={async () => { setEliminando(true); await onEliminar(lead.id); setEliminando(false); setConfirmando(false) }}
                className="font-bold text-white bg-[#E8002D] hover:bg-[#B8001F] disabled:opacity-60 rounded-md px-2 py-1"
              >
                {eliminando ? 'Eliminando…' : 'Sí, eliminar'}
              </button>
              <button onClick={() => setConfirmando(false)} className="font-semibold text-gray-400 hover:text-gray-600">No</button>
            </span>
          ) : (
            <button
              onClick={() => setConfirmando(true)}
              className="text-gray-300 hover:text-[#E8002D] transition-colors p-1"
              title="Eliminar lead"
              aria-label={`Eliminar lead de ${lead.nombre}`}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden>
                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.44c-.8.08-1.58.17-2.37.29a.75.75 0 10.23 1.48l.15-.02.84 10.52A2.75 2.75 0 007.59 19h4.82a2.75 2.75 0 002.74-2.54l.84-10.52.15.02a.75.75 0 00.23-1.48c-.79-.12-1.58-.21-2.37-.29v-.44A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.67.03 2.5.08v-.33c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.33C8.33 4.03 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </details>
  )
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-gray-400 text-[10px] uppercase tracking-wide">{label}</div>
      <div className="text-gray-700 font-medium truncate">{children}</div>
    </div>
  )
}

function IconoWhatsapp({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 004.73 1.2h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.15h-.01a8.23 8.23 0 01-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 012.41 5.83c0 4.54-3.7 8.23-8.24 8.23z" />
    </svg>
  )
}
