'use client'

import { useState } from 'react'

interface Props {
  prepagaNombre: string
  planNombre: string
}

export function ContratarPlanButton({ prepagaNombre, planNombre }: Props) {
  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState('')
  const [celular, setCelular] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  const ok = nombre.trim().length >= 2 && celular.trim().length >= 8 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  function handleClose() {
    setOpen(false)
    setNombre(''); setCelular(''); setEmail(''); setStatus('idle')
  }

  async function handleSubmit() {
    if (!ok) return
    setStatus('loading')
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          celular: celular.trim(),
          email: email.trim(),
          fuente: 'contratar-plan',
          prepaga_interes: `${prepagaNombre} — ${planNombre}`,
        }),
      })
      setStatus('success')
      setTimeout(handleClose, 3000)
    } catch {
      setStatus('idle')
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-md text-sm w-full sm:w-auto"
      >
        Contratar {planNombre} →
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] px-6 py-5 text-white">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                aria-label="Cerrar"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-5 h-5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
              <div className="text-xl font-bold mb-1">Contratar {planNombre}</div>
              <p className="text-red-100 text-sm leading-relaxed">
                Dejanos tus datos y un asesor te contacta con el precio exacto de {prepagaNombre} {planNombre} para tu edad, y te ayuda con el alta.
              </p>
            </div>

            <div className="p-6">
              {status === 'success' ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-green-500">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <p className="font-bold text-gray-900 mb-1">¡Listo!</p>
                  <p className="text-sm text-gray-500">Un asesor te contacta a la brevedad para avanzar con la contratación.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre *</label>
                      <input
                        type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                        placeholder="Tu nombre" autoComplete="given-name"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8002D] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Celular *</label>
                      <input
                        type="tel" value={celular} onChange={(e) => setCelular(e.target.value)}
                        placeholder="11 2345-6789" autoComplete="tel" inputMode="numeric"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8002D] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
                      <input
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com" autoComplete="email"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8002D] transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!ok || status === 'loading'}
                    className="w-full py-3.5 bg-[#E8002D] hover:bg-[#B8001F] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-colors"
                  >
                    {status === 'loading' ? 'Enviando...' : 'Quiero contratar'}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-3">Tu información es privada · Sin compromiso</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
