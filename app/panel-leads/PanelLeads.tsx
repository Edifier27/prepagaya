'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { logout } from './actions'
import type { LeadRow } from '@/lib/db'

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

type EstadoAlertas = 'desconocido' | 'inactivas' | 'activando' | 'activas' | 'no-soportado' | 'rechazadas'

export default function PanelLeads({ leadsIniciales }: { leadsIniciales: LeadRow[] }) {
  const [leads, setLeads] = useState(leadsIniciales)
  const [estadoAlertas, setEstadoAlertas] = useState<EstadoAlertas>('desconocido')
  const [refrescando, setRefrescando] = useState(false)
  const [filtroMes, setFiltroMes] = useState<string | null>(null)
  const ultimoId = useRef(leadsIniciales[0]?.id ?? 0)

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

  const sinLeer = leads.filter((l) => !l.leido).length

  // Estadísticas del "mini CRM" (pedido de Darío, 20-sep-2026): cuántos
  // datos entran y de dónde — se calculan solas de los leads ya cargados
  // en el panel, sin pedir nada nuevo al servidor.
  const stats = useMemo(() => {
    const hoyStr = new Date().toDateString()
    const hoy = leads.filter((l) => new Date(l.creado_en).toDateString() === hoyStr).length
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

    return {
      total: leads.length,
      hoy,
      porZona: contar(leads.map((l) => l.provincia)),
      porFuente: contar(leads.map((l) => l.fuente)),
      porMes,
    }
  }, [leads])

  const leadsFiltrados = useMemo(
    () => (filtroMes ? leads.filter((l) => mesKey(l.creado_en) === filtroMes) : leads),
    [leads, filtroMes]
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
        <StatsPanel stats={stats} filtroMes={filtroMes} onFiltrarMes={(mes) => setFiltroMes((prev) => (prev === mes ? null : mes))} />

        {filtroMes && (
          <div className="flex items-center gap-2 mb-3 text-xs">
            <span className="text-gray-500">Mostrando <strong className="text-gray-900">{leadsFiltrados.length}</strong> de {mesLabel(filtroMes)}</span>
            <button onClick={() => setFiltroMes(null)} className="text-[#E8002D] font-semibold hover:underline">
              Ver todos →
            </button>
          </div>
        )}

        <div className="space-y-1.5">
          {leadsFiltrados.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-16">
              {filtroMes ? 'No hay leads en ese mes.' : 'Todavía no entró ningún lead.'}
            </p>
          )}
          {leadsFiltrados.map((lead) => (
            <LeadRow key={lead.id} lead={lead} onToggleLeido={toggleLeido} />
          ))}
        </div>
      </div>
    </div>
  )
}

interface Stats { total: number; hoy: number; porZona: [string, number][]; porFuente: [string, number][]; porMes: [string, number][] }

function StatsPanel({ stats, filtroMes, onFiltrarMes }: { stats: Stats; filtroMes: string | null; onFiltrarMes: (mes: string) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="text-2xl font-black text-gray-900 leading-none">{stats.total}</div>
          <div className="text-[11px] text-gray-500 mt-1">Leads totales</div>
        </div>
        <div className="bg-red-50 rounded-xl p-3">
          <div className="text-2xl font-black text-[#E8002D] leading-none">{stats.hoy}</div>
          <div className="text-[11px] text-gray-500 mt-1">Hoy</div>
        </div>
      </div>

      {stats.porMes.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Por mes</div>
          <div className="flex flex-wrap gap-1.5">
            {stats.porMes.map(([mes, n]) => {
              const activo = filtroMes === mes
              return (
                <button
                  key={mes}
                  onClick={() => onFiltrarMes(mes)}
                  className={`text-[11px] font-semibold rounded-full px-2 py-1 transition-colors ${
                    activo ? 'bg-[#E8002D] text-white' : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-[#E8002D]'
                  }`}
                >
                  {mesLabel(mes)} <span className={activo ? 'text-red-100' : 'text-gray-400'}>· {n}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatBreakdown titulo="Por zona" items={stats.porZona} />
        <StatBreakdown titulo="Por fuente" items={stats.porFuente} />
      </div>
    </div>
  )
}

function StatBreakdown({ titulo, items }: { titulo: string; items: [string, number][] }) {
  if (items.length === 0) return null
  const top = items.slice(0, 6)
  const resto = items.slice(6).reduce((acc, [, n]) => acc + n, 0)
  return (
    <div>
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">{titulo}</div>
      <div className="flex flex-wrap gap-1.5">
        {top.map(([nombre, n]) => (
          <span key={nombre} className="text-[11px] font-semibold text-gray-600 bg-gray-100 rounded-full px-2 py-1">
            {nombre} <span className="text-gray-400">· {n}</span>
          </span>
        ))}
        {resto > 0 && (
          <span className="text-[11px] font-semibold text-gray-400 bg-gray-50 rounded-full px-2 py-1">+{resto} más</span>
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
function LeadRow({ lead, onToggleLeido }: { lead: LeadRow; onToggleLeido: (id: number, leidoActual: boolean) => void }) {
  const cuenta = extraerCuentaKommo(lead.kommo_estado)
  const kommoOk = lead.kommo_estado?.startsWith('OK') ?? false

  return (
    <details className={`group bg-white rounded-xl border transition-colors overflow-hidden ${lead.leido ? 'border-gray-100' : 'border-red-200'}`}>
      <summary className="flex items-center gap-2 px-3 py-2.5 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
        {!lead.leido && <span className="w-1.5 h-1.5 rounded-full bg-[#E8002D] flex-shrink-0" />}
        <span className="font-bold text-gray-900 text-sm truncate">{lead.nombre}</span>
        {cuenta && (
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
            cuenta === 'Gabriela' ? 'text-purple-700 bg-purple-50' : 'text-blue-700 bg-blue-50'
          }`}>
            {cuenta}
          </span>
        )}
        {lead.provincia && <span className="text-[11px] text-gray-400 truncate hidden sm:inline">{lead.provincia}</span>}
        <span className="flex-1" />
        <span className={`text-[11px] flex-shrink-0 ${kommoOk ? 'text-emerald-500' : 'text-amber-500'}`} title={kommoOk ? 'Kommo OK' : 'Kommo falló'}>
          {kommoOk ? '✓' : '⚠'}
        </span>
        <span className="text-[11px] text-gray-400 flex-shrink-0 whitespace-nowrap">{formatFecha(lead.creado_en)}</span>
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
          {lead.edades && <Campo label="Integrantes">{lead.edades}</Campo>}
          {lead.fuente && <Campo label="Fuente">{lead.fuente}</Campo>}
        </div>

        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
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
