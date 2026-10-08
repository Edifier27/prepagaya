'use client'

import { useState } from 'react'
import { trackEvent, trackLead } from '@/lib/analytics'
import { TrustBadge } from '@/components/ui/TrustBadge'

interface Props {
  prepagaNombre: string
  planNombre?: string
  /** De qué página/flujo viene el lead — se manda a /api/leads para trackear el origen. */
  fuente?: string
  /** Texto del botón. Por defecto "Cotizar {planNombre}" (Darío, 4-oct-2026: "cotizar" en vez de "contratar") o "Cotización personalizada" si no hay plan. */
  label?: string
  className?: string
  /** Datos extra que ya respondió la persona (ej. respuestas del quiz), ver lib/data/sondeo.ts */
  datosExtra?: Record<string, string>
  /** Título del popup (28-sep-2026: cada botón con su propio encabezado) */
  titulo?: string
  /** Planes para elegir en el popup (botón de la ficha de la prepaga, sin plan fijo) */
  planesOpciones?: string[]
}

export function ContratarPlanButton({ prepagaNombre, planNombre, fuente = 'contratar-plan', label, className, datosExtra, titulo, planesOpciones }: Props) {
  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState('')
  const [celular, setCelular] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [planElegido, setPlanElegido] = useState('')
  const [edades, setEdades] = useState('')

  const ok = nombre.trim().length >= 2 && celular.trim().length >= 8 && (email.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
  const planFinal = planNombre ?? (planElegido || undefined)
  const interes = planFinal ? `${prepagaNombre} — ${planFinal}` : prepagaNombre

  function handleClose() {
    setOpen(false)
    setNombre(''); setCelular(''); setEmail(''); setStatus('idle'); setPlanElegido(''); setEdades('')
  }

  async function handleSubmit() {
    if (!ok) return
    setStatus('loading')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          celular: celular.trim(),
          email: email.trim() || `${celular.trim().replace(/\s/g, '')}@sin-email.com`,
          fuente,
          prepaga_interes: interes,
          // Edades opcionales: el asesor cotiza el precio exacto sin repreguntar
          ...(edades.trim() ? { personas: edades.trim() } : {}),
          ...datosExtra,
        }),
      })
      // Sin esto, un 4xx/5xx de la API mostraba "¡Listo!" y contaba un
      // generate_lead falso en GA4 (8-oct-2026).
      if (!res.ok) throw new Error(String(res.status))
      // Ya no redirige al WhatsApp del asesor — el lead solo llega por mail
      // y el asesor contacta desde ahí cuando le conviene (pedido de Darío,
      // 9-sep-2026: no quiere que el visitante le escriba directo).
      trackLead(fuente, { prepaga: interes })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <button
        onClick={() => { setOpen(true); trackEvent('abrir_cotizador', { fuente, prepaga: prepagaNombre }) }}
        className={className ?? "inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-md text-sm w-full sm:w-auto"}
      >
        {label ?? (planNombre ? `Cotizar ${planNombre}` : 'Cotización personalizada')} →
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden max-h-[92vh] overflow-y-auto">
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
              <div className="text-xl font-bold mb-1 pr-6">{titulo ?? 'Cotizá online y Ahorrá'}</div>
              <p className="text-red-100 text-sm leading-relaxed">
                Dejanos tus datos y un asesor oficial te pasa el precio exacto de {interes} para tu edad, con 15% OFF por contratar online.
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
                  <p className="text-sm text-gray-500">Recibimos tus datos. Un asesor oficial te va a contactar a la brevedad para avanzar con la contratación.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {!planNombre && planesOpciones && planesOpciones.length > 0 && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">¿Qué plan te interesa?</label>
                        <select
                          value={planElegido} onChange={(e) => setPlanElegido(e.target.value)}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#E8002D] transition-colors"
                        >
                          <option value="">Todavía no sé: quiero que me asesoren</option>
                          {planesOpciones.map((pl) => <option key={pl} value={pl}>{pl}</option>)}
                        </select>
                      </div>
                    )}
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
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Edades de quienes se asocian <span className="font-normal text-gray-400">(opcional)</span></label>
                      <input
                        type="text" value={edades} onChange={(e) => setEdades(e.target.value)}
                        placeholder="33,35,1" inputMode="text"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8002D] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Email <span className="font-normal text-gray-400">(opcional)</span></label>
                      <input
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com" autoComplete="email"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8002D] transition-colors"
                      />
                    </div>
                  </div>

                  <TrustBadge className="mb-3" />

                  {status === 'error' && (
                    <p role="alert" className="text-sm text-red-600 mb-3">No pudimos enviarlo. Probá de nuevo en un momento.</p>
                  )}
                  {!ok && status !== 'error' && (
                    <p className="text-xs text-gray-400 mb-2 text-center">Completá tu nombre y celular para continuar.</p>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={!ok || status === 'loading'}
                    className="w-full py-3.5 bg-[#E8002D] hover:bg-[#B8001F] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-colors"
                  >
                    {status === 'loading' ? 'Enviando...' : planFinal ? `Cotizar ${planFinal} →` : 'Cotizar →'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
