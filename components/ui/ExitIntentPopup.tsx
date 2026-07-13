'use client'

import { useEffect, useState, useRef } from 'react'

export function ExitIntentPopup(): React.ReactElement | null {
  const [visible, setVisible] = useState(false)
  const [nombre, setNombre] = useState('')
  const [celular, setCelular] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const fired = useRef(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem('exit-popup-dismissed')
    if (dismissed) return

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && !fired.current) {
        fired.current = true
        setTimeout(() => setVisible(true), 300)
      }
    }

    // Mobile: inactividad 90 segundos sin interacción
    let idleTimer: ReturnType<typeof setTimeout>
    const resetIdle = () => {
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        if (!fired.current) {
          fired.current = true
          setVisible(true)
        }
      }, 90_000)
    }

    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('touchstart', resetIdle, { passive: true })
    resetIdle()

    return () => {
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('touchstart', resetIdle)
      clearTimeout(idleTimer)
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    sessionStorage.setItem('exit-popup-dismissed', '1')
  }

  const handleSubmit = async () => {
    if (!nombre.trim() || celular.trim().length < 8) return
    setStatus('loading')
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          celular: celular.trim(),
          email: `${celular.trim().replace(/\s/g, '')}@sin-email.com`,
          fuente: 'exit-intent',
        }),
      })
      setStatus('success')
      setTimeout(dismiss, 3000)
    } catch {
      setStatus('idle')
    }
  }

  const ok = nombre.trim().length >= 2 && celular.trim().length >= 8

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) dismiss() }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] px-6 py-5 text-white">
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-5 h-5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <div className="text-2xl mb-1">Esperate un momento</div>
          <p className="text-red-100 text-sm leading-relaxed">
            Dejanos tu celular y te mandamos los 3 mejores planes por WhatsApp ahora mismo.
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
              <p className="font-bold text-gray-900 mb-1">Recibimos tu consulta</p>
              <p className="text-sm text-gray-500">Un asesor te escribe por WhatsApp en menos de 2 horas.</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre"
                    autoComplete="given-name"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8002D] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Celular *</label>
                  <input
                    type="tel"
                    value={celular}
                    onChange={(e) => setCelular(e.target.value)}
                    placeholder="11 2345-6789"
                    autoComplete="tel"
                    inputMode="numeric"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8002D] transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!ok || status === 'loading'}
                className="w-full py-3.5 bg-[#25D366] hover:bg-[#128C7E] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {status === 'loading' ? 'Enviando...' : 'Mandarme planes por WhatsApp'}
              </button>

              <button onClick={dismiss} className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-3 py-1">
                No gracias, prefiero seguir solo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
