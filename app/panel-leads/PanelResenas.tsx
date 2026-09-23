'use client'

import { useCallback, useEffect, useState } from 'react'
import type { EstadoResena, ResenaRow } from '@/lib/db'

// Moderación de reseñas (23-sep-2026): se aprueban las "potables". Criterio
// recomendado: rechazar insultos, spam, datos personales o fuera de tema —
// NO las negativas bien escritas (mostrar solo positivas es engañoso y Google
// puede quitar las estrellas).
const PESTANAS: { id: EstadoResena; label: string }[] = [
  { id: 'pendiente', label: 'Pendientes' },
  { id: 'aprobada', label: 'Aprobadas' },
  { id: 'rechazada', label: 'Rechazadas' },
]

export default function PanelResenas({ onPendientes }: { onPendientes?: (n: number) => void }) {
  const [estado, setEstado] = useState<EstadoResena>('pendiente')
  const [resenas, setResenas] = useState<ResenaRow[]>([])
  const [cargando, setCargando] = useState(true)

  const cargar = useCallback(async (e: EstadoResena) => {
    setCargando(true)
    const res = await fetch(`/api/panel/resenas?estado=${e}`).catch(() => null)
    const data = res?.ok ? await res.json() : { resenas: [] }
    setResenas(data.resenas)
    if (e === 'pendiente') onPendientes?.(data.resenas.length)
    setCargando(false)
  }, [onPendientes])

  useEffect(() => { cargar(estado) }, [estado, cargar])

  async function moderar(id: number, nuevo: EstadoResena) {
    setResenas((prev) => prev.filter((r) => r.id !== id))
    await fetch('/api/panel/resenas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, estado: nuevo }),
    }).catch(() => {})
    if (estado === 'pendiente') onPendientes?.(Math.max(0, resenas.length - 1))
  }

  return (
    <div>
      <div className="flex gap-1.5 mb-3">
        {PESTANAS.map((p) => (
          <button key={p.id} onClick={() => setEstado(p.id)}
            className={`text-xs font-semibold rounded-full px-3 py-1.5 transition-colors ${estado === p.id ? 'bg-[#E8002D] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:text-[#E8002D]'}`}>
            {p.label}
          </button>
        ))}
      </div>
      <p className="text-[11px] text-gray-500 mb-3">
        Rechazá insultos, spam, datos personales o comentarios fuera de tema. Las opiniones negativas bien escritas conviene aprobarlas: si solo se ven positivas, Google puede quitar las estrellas.
      </p>
      {cargando && <p className="text-sm text-gray-400 py-10 text-center">Cargando…</p>}
      {!cargando && resenas.length === 0 && <p className="text-sm text-gray-400 py-10 text-center">No hay reseñas {PESTANAS.find((p) => p.id === estado)?.label.toLowerCase()}.</p>}
      <div className="space-y-2">
        {resenas.map((r) => (
          <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <div className="text-sm">
                <strong className="text-gray-900">{r.prepaga_slug}</strong>
                {r.plan_nombre && <span className="text-gray-500"> · {r.plan_nombre}</span>}
                <span className="text-amber-400 ml-2">{'★'.repeat(r.rating)}<span className="text-gray-200">{'★'.repeat(5 - r.rating)}</span></span>
              </div>
              <span className="text-[11px] text-gray-400">{new Date(r.creado_en).toLocaleString('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-line">{r.texto}</p>
            <p className="text-xs text-gray-500 mt-1.5">{r.nombre}{r.ciudad ? ` · ${r.ciudad}` : ''}</p>
            <div className="flex gap-2 mt-3">
              {estado !== 'aprobada' && (
                <button onClick={() => moderar(r.id, 'aprobada')} className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg px-3 py-1.5">✓ Aprobar</button>
              )}
              {estado !== 'rechazada' && (
                <button onClick={() => moderar(r.id, 'rechazada')} className="text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-1.5">✕ Rechazar</button>
              )}
              {estado !== 'pendiente' && (
                <button onClick={() => moderar(r.id, 'pendiente')} className="text-xs font-semibold text-gray-400 hover:text-gray-600 px-2">Volver a pendiente</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
