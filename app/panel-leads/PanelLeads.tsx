'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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

type EstadoAlertas = 'desconocido' | 'inactivas' | 'activando' | 'activas' | 'no-soportado' | 'rechazadas'

export default function PanelLeads({ leadsIniciales }: { leadsIniciales: LeadRow[] }) {
  const [leads, setLeads] = useState(leadsIniciales)
  const [estadoAlertas, setEstadoAlertas] = useState<EstadoAlertas>('desconocido')
  const [refrescando, setRefrescando] = useState(false)
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

      <div className="max-w-3xl mx-auto p-4 space-y-2.5">
        {leads.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-16">Todavía no entró ningún lead.</p>
        )}
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onToggleLeido={toggleLeido} />
        ))}
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

function LeadCard({ lead, onToggleLeido }: { lead: LeadRow; onToggleLeido: (id: number, leidoActual: boolean) => void }) {
  const cuenta = extraerCuentaKommo(lead.kommo_estado)
  return (
    <div className={`bg-white rounded-2xl border-2 p-4 transition-colors ${lead.leido ? 'border-gray-100' : 'border-red-200'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-900 text-sm">{lead.nombre}</span>
            {!lead.leido && <span className="w-2 h-2 rounded-full bg-[#E8002D] flex-shrink-0" />}
            {cuenta && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                cuenta === 'Gabriela'
                  ? 'text-purple-700 bg-purple-50 border-purple-200'
                  : 'text-blue-700 bg-blue-50 border-blue-200'
              }`}>
                → {cuenta}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{formatFecha(lead.creado_en)}</p>
        </div>
        <button
          onClick={() => onToggleLeido(lead.id, lead.leido)}
          className="text-[11px] font-semibold text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors"
        >
          {lead.leido ? 'Marcar no leído' : 'Marcar leído'}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 mt-3 text-xs">
        {lead.celular && <Campo label="Celular"><a href={`tel:${lead.celular}`} className="text-[#E8002D] font-semibold hover:underline">{lead.celular}</a></Campo>}
        {lead.email && <Campo label="Email"><a href={`mailto:${lead.email}`} className="text-gray-700 hover:underline break-all">{lead.email}</a></Campo>}
        {lead.prepaga && <Campo label="Interés">{lead.prepaga}</Campo>}
        {lead.provincia && <Campo label="Zona">{lead.provincia}</Campo>}
        {lead.edades && <Campo label="Integrantes">{lead.edades}</Campo>}
        {lead.fuente && <Campo label="Fuente">{lead.fuente}</Campo>}
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
        {lead.kommo_estado && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            lead.kommo_estado.startsWith('OK')
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : 'text-amber-700 bg-amber-50 border-amber-200'
          }`}>
            {lead.kommo_estado.startsWith('OK') ? '✓ Kommo' : '⚠ Kommo falló'}
          </span>
        )}
        {lead.kommo_link && (
          <a href={lead.kommo_link} target="_blank" rel="noopener noreferrer" className="text-[11px] font-semibold text-[#E8002D] hover:underline">
            Ver en Kommo →
          </a>
        )}
      </div>
    </div>
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
