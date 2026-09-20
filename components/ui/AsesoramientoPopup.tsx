'use client'

import { useState } from 'react'

interface Props {
  open: boolean
  onClose: () => void
}

type Situacion = 'obra-social' | 'cambiar' | 'monotributo' | 'sin-cobertura'
type Prioridad = 'precio' | 'atencion' | 'maternidad' | 'nacional'
type Personas = 'solo' | 'pareja' | 'familia'

const SITUACIONES: { value: Situacion; label: string }[] = [
  { value: 'obra-social', label: 'Tengo obra social y quiero derivar aportes' },
  { value: 'cambiar', label: 'Tengo una prepaga y quiero cambiarme' },
  { value: 'monotributo', label: 'Soy monotributista o autónomo, busco particular' },
  { value: 'sin-cobertura', label: 'Todavía no tengo cobertura' },
]

const PRIORIDADES: { value: Prioridad; label: string }[] = [
  { value: 'precio', label: 'El precio más bajo posible' },
  { value: 'atencion', label: 'Atención rápida y buena cartilla' },
  { value: 'maternidad', label: 'Maternidad y pediatría' },
  { value: 'nacional', label: 'Cobertura en todo el país' },
]

const PERSONAS: { value: Personas; label: string }[] = [
  { value: 'solo', label: 'Solo para mí' },
  { value: 'pareja', label: 'Para mí y mi pareja' },
  { value: 'familia', label: 'Familia con chicos' },
]

const RECO_PRIORIDAD: Record<Prioridad, string> = {
  precio: 'planes económicos, con la cuota más baja del mercado en su categoría',
  atencion: 'planes de nivel medio o premium, con sanatorios propios y buena velocidad de turnos',
  maternidad: 'planes con buena cobertura de maternidad y pediatría, sin carencias largas',
  nacional: 'planes con cartilla fuerte en todo el país, ideales si viajás o vivís en el interior',
}

const NOTA_SITUACION: Record<Situacion, string> = {
  'obra-social': 'Como vas a derivar aportes de obra social, calculamos también cuánto te conviene poner de tu bolsillo.',
  cambiar: 'Como ya tenés prepaga, comparamos qué carencias no vas a tener que volver a hacer.',
  monotributo: 'Como contratás particular, te mostramos el valor real de bolsillo, no el de lista.',
  'sin-cobertura': 'Arrancamos por lo esencial y vemos juntos si conviene sumar algo más.',
}

type Step = 'situacion' | 'prioridad' | 'personas' | 'reveal' | 'contacto'
const STEPS: Step[] = ['situacion', 'prioridad', 'personas', 'reveal', 'contacto']

export function AsesoramientoPopup({ open, onClose }: Props): React.ReactElement | null {
  const [step, setStep] = useState<Step>('situacion')
  const [situacion, setSituacion] = useState<Situacion | ''>('')
  const [prioridad, setPrioridad] = useState<Prioridad | ''>('')
  const [personas, setPersonas] = useState<Personas | ''>('')
  const [nombre, setNombre] = useState('')
  const [celular, setCelular] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  if (!open) return null

  const ok = nombre.trim().length >= 2 && celular.trim().length >= 8

  function irA(s: Step) { setStep(s) }
  function volver() {
    const i = STEPS.indexOf(step)
    if (i > 0) setStep(STEPS[i - 1])
  }

  function handleClose() {
    onClose()
    setTimeout(() => {
      setStep('situacion'); setSituacion(''); setPrioridad(''); setPersonas('')
      setNombre(''); setCelular(''); setStatus('idle')
    }, 300)
  }

  async function handleSubmit() {
    if (!ok) return
    setStatus('loading')
    const situacionLabel = SITUACIONES.find((s) => s.value === situacion)?.label ?? situacion
    const prioridadLabel = PRIORIDADES.find((p) => p.value === prioridad)?.label ?? prioridad
    const personasLabel = PERSONAS.find((p) => p.value === personas)?.label ?? personas
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          celular: celular.trim(),
          email: `${celular.trim().replace(/\s/g, '')}@sin-email.com`,
          fuente: 'quiero-asesoramiento',
          prepaga_interes: `Quiz asesoramiento · ${situacionLabel} · Prioridad: ${prioridadLabel} · ${personasLabel}`,
        }),
      })
      // Ya no redirige al WhatsApp del asesor — el lead solo llega por mail
      // y el asesor contacta desde ahí cuando le conviene (pedido de Darío,
      // 9-sep-2026: no quiere que el visitante le escriba directo).
      setStatus('success')
    } catch {
      setStatus('idle')
    }
  }

  const pasoNum = STEPS.indexOf(step) + 1
  const pct = Math.round((pasoNum / STEPS.length) * 100)

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] px-6 py-5 text-white flex-shrink-0">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-5 h-5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <div className="text-2xl mb-1">¿Qué buscás en tu prepaga?</div>
          <p className="text-red-100 text-sm leading-relaxed mb-3">
            3 preguntas rápidas y te armamos una recomendación.
          </p>
          {status !== 'success' && (
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-400" style={{ width: `${pct}%` }} />
            </div>
          )}
        </div>

        <div className="p-6 overflow-y-auto">
          {status === 'success' ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-green-500">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <p className="font-bold text-gray-900 mb-1">¡Listo!</p>
              <p className="text-sm text-gray-500">Recibimos tus datos. Un asesor oficial te va a contactar a la brevedad con tu comparación.</p>
            </div>
          ) : (
            <>
              {step === 'situacion' && (
                <>
                  <h3 className="font-bold text-gray-900 text-sm mb-3">¿Cuál es tu situación hoy?</h3>
                  <div className="flex flex-col gap-2">
                    {SITUACIONES.map((s) => (
                      <button
                        key={s.value} type="button"
                        onClick={() => { setSituacion(s.value); irA('prioridad') }}
                        className="text-left px-4 py-3 rounded-xl text-sm font-medium border-2 border-gray-200 text-gray-700 hover:border-[#E8002D] hover:bg-red-50 transition-colors"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 'prioridad' && (
                <>
                  <h3 className="font-bold text-gray-900 text-sm mb-3">¿Qué es lo más importante para vos?</h3>
                  <div className="flex flex-col gap-2 mb-3">
                    {PRIORIDADES.map((p) => (
                      <button
                        key={p.value} type="button"
                        onClick={() => { setPrioridad(p.value); irA('personas') }}
                        className="text-left px-4 py-3 rounded-xl text-sm font-medium border-2 border-gray-200 text-gray-700 hover:border-[#E8002D] hover:bg-red-50 transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <button onClick={volver} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">← Volver</button>
                </>
              )}

              {step === 'personas' && (
                <>
                  <h3 className="font-bold text-gray-900 text-sm mb-3">¿Para cuántas personas?</h3>
                  <div className="flex flex-col gap-2 mb-3">
                    {PERSONAS.map((p) => (
                      <button
                        key={p.value} type="button"
                        onClick={() => { setPersonas(p.value); irA('reveal') }}
                        className="text-left px-4 py-3 rounded-xl text-sm font-medium border-2 border-gray-200 text-gray-700 hover:border-[#E8002D] hover:bg-red-50 transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <button onClick={volver} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">← Volver</button>
                </>
              )}

              {step === 'reveal' && prioridad && situacion && (
                <>
                  <div className="text-center mb-3">
                    <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-[11px] font-bold px-3 py-1.5 rounded-full mb-2">
                      Tu recomendación
                    </span>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Para vos armamos una preselección de <strong>{RECO_PRIORIDAD[prioridad]}</strong>. {NOTA_SITUACION[situacion]}
                    </p>
                  </div>
                  <button
                    onClick={() => irA('contacto')}
                    className="w-full py-3.5 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm transition-colors mb-3"
                  >
                    Quiero mi comparación personalizada →
                  </button>
                  <button onClick={volver} className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors">← Volver</button>
                </>
              )}

              {step === 'contacto' && (
                <>
                  <h3 className="font-bold text-gray-900 text-sm mb-3">Ya casi — ¿a quién le mandamos la comparación?</h3>
                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre *</label>
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Tu nombre"
                        autoComplete="given-name"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#E8002D] transition-colors"
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
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#E8002D] transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!ok || status === 'loading'}
                    className="w-full py-3.5 bg-[#E8002D] hover:bg-[#B8001F] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-colors mb-3"
                  >
                    {status === 'loading' ? 'Enviando...' : 'Solicitar asesoramiento'}
                  </button>
                  <button onClick={volver} className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors">← Volver</button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
