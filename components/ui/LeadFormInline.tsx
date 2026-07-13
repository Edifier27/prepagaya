'use client'

import { useState } from 'react'

interface Props {
  prepagaNombre?: string
  titulo?: string
  className?: string
}

export function LeadFormInline({ prepagaNombre, titulo, className = '' }: Props) {
  const [nombre, setNombre] = useState('')
  const [celular, setCelular] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim() || !celular.trim() || !email.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          celular: celular.trim(),
          email: email.trim(),
          fuente: prepagaNombre ? `sidebar-${prepagaNombre.toLowerCase().replace(/\s+/g, '-')}` : 'sidebar-inline',
          prepaga_interes: prepagaNombre ?? '',
          fecha: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }),
        }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-2xl p-6 text-center ${className}`}>
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-green-600">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
        </div>
        <div className="font-bold text-green-800 mb-1">Consulta recibida</div>
        <p className="text-sm text-green-600">Te contactamos en las próximas horas para asesorarte sin cargo.</p>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-5 ${className}`}>
      <div className="mb-4">
        <h3 className="font-bold text-gray-900 text-base">
          {titulo ?? (prepagaNombre ? `¿Te interesa ${prepagaNombre}?` : 'Cotizá sin cargo')}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">Un asesor te llama para explicarte todo</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre *"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8002D] transition-colors"
          />
        </div>
        <div>
          <input
            type="tel"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
            placeholder="Celular *"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8002D] transition-colors"
          />
        </div>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email *"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8002D] transition-colors"
          />
        </div>

        {status === 'error' && (
          <p className="text-xs text-red-500">Hubo un problema. Intentá de nuevo.</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-3 bg-[#00875A] hover:bg-[#006644] disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-xl text-sm transition-colors"
        >
          {status === 'loading' ? 'Enviando...' : 'Quiero que me asesoren →'}
        </button>

        <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3 h-3">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          Sin DNI · Gratis · Sin compromiso
        </p>
      </form>
    </div>
  )
}
