'use client'

import { useState } from 'react'

// Formulario "Dejá tu opinión" (23-sep-2026). La reseña queda pendiente hasta
// que se aprueba en el panel; se avisa en el mensaje de éxito.
export function ResenaForm({ prepagaSlug, prepagaNombre, planes }: { prepagaSlug: string; prepagaNombre: string; planes: string[] }) {
  const [abierto, setAbierto] = useState(false)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [nombre, setNombre] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [plan, setPlan] = useState('')
  const [texto, setTexto] = useState('')
  const [web, setWeb] = useState('') // campo trampa anti-bots
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'ok' | 'error'>('idle')
  const [error, setError] = useState('')

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!rating) { setError('Elegí de 1 a 5 estrellas'); return }
    setEstado('enviando')
    setError('')
    const res = await fetch('/api/resenas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prepaga: prepagaSlug, plan, nombre, ciudad, rating, texto, web }),
    }).catch(() => null)
    if (res?.ok) { setEstado('ok'); return }
    const data = await res?.json().catch(() => null)
    setError(data?.error ?? 'No pudimos enviar tu opinión. Probá de nuevo.')
    setEstado('error')
  }

  if (estado === 'ok') {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
        <strong>¡Gracias por tu opinión!</strong> La publicamos apenas la revisemos.
      </div>
    )
  }

  if (!abierto) {
    return (
      <button onClick={() => setAbierto(true)} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-[#E8002D] text-[#E8002D] font-bold text-sm hover:bg-red-50 transition-colors">
        ★ Dejá tu opinión sobre {prepagaNombre}
      </button>
    )
  }

  return (
    <form onSubmit={enviar} className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3 max-w-2xl">
      <div className="font-bold text-gray-900">Tu opinión sobre {prepagaNombre}</div>
      <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" aria-label={`${n} estrellas`} onMouseEnter={() => setHover(n)} onClick={() => setRating(n)}
            className={`text-3xl leading-none transition-colors ${(hover || rating) >= n ? 'text-amber-400' : 'text-gray-200'}`}>★</button>
        ))}
        {rating > 0 && <span className="text-sm text-gray-500 ml-2">{rating} de 5</span>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input required value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={40} placeholder="Tu nombre (ej. Laura G.)"
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#E8002D]" />
        <input value={ciudad} onChange={(e) => setCiudad(e.target.value)} maxLength={40} placeholder="Ciudad (opcional)"
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#E8002D]" />
        <select value={plan} onChange={(e) => setPlan(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
          <option value="">Plan (opcional)</option>
          {planes.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <textarea required value={texto} onChange={(e) => setTexto(e.target.value)} rows={4} minLength={20} maxLength={1200}
        placeholder="Contá tu experiencia: atención, cartilla, autorizaciones, guardias…"
        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#E8002D]" />
      {/* Campo trampa: oculto para personas, los bots lo completan */}
      <input type="text" value={web} onChange={(e) => setWeb(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-gray-400">Publicamos tu nombre, ciudad y comentario. Revisamos cada opinión antes de publicarla.</p>
        <button type="submit" disabled={estado === 'enviando'} className="px-5 py-2.5 rounded-xl bg-[#E8002D] hover:bg-[#B8001F] disabled:opacity-60 text-white font-bold text-sm">
          {estado === 'enviando' ? 'Enviando…' : 'Enviar opinión'}
        </button>
      </div>
    </form>
  )
}
