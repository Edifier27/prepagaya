'use client'

import { useState } from 'react'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'

const RANGOS_EMPLEADOS = ['2-5', '6-10', '11-25', '26-50', '+50']

const MODALIDADES = [
  { value: 'derivando-aportes', label: 'Derivando aportes de obra social' },
  { value: 'particular', label: 'Plan corporativo particular' },
  { value: 'no-se', label: 'No sé, quiero que me asesoren' },
]

type Prioridad = 'precio' | 'cartilla' | 'administrativo' | 'retencion'

const PRIORIDADES: { value: Prioridad; label: string; icon: React.ReactElement }[] = [
  {
    value: 'precio',
    label: 'El mejor precio por persona',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
  {
    value: 'cartilla',
    label: 'La cartilla más amplia posible',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 010 20 15.3 15.3 0 010-20z" />
      </svg>
    ),
  },
  {
    value: 'administrativo',
    label: 'Que RRHH no tenga que gestionar nada',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    value: 'retencion',
    label: 'Un beneficio fuerte para retener gente',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
  },
]

interface Recomendacion {
  principal: 'swiss-medical' | 'osde'
  razonPrincipal: string
  razonSecundaria: string
}

const RECOMENDACIONES: Record<Prioridad, Recomendacion> = {
  precio: {
    principal: 'swiss-medical',
    razonPrincipal: 'Con 9 sanatorios propios, controla mejor su costo de atención — suele trasladarse a una cuota corporativa más accesible que un OSDE equivalente.',
    razonSecundaria: 'Igual te mostramos el número de OSDE al lado, por si la diferencia no justifica cambiar de red.',
  },
  cartilla: {
    principal: 'osde',
    razonPrincipal: 'Tiene la red de profesionales y centros más grande del país — la referencia si buscás cartilla sin restricciones.',
    razonSecundaria: 'Comparamos también Swiss Medical, con sanatorios propios de primer nivel en su propia red.',
  },
  administrativo: {
    principal: 'swiss-medical',
    razonPrincipal: 'Con la modalidad de afinidad, la factura llega directo a cada empleado — RRHH no gestiona descuentos de sueldo.',
    razonSecundaria: 'Armamos igual la comparación con OSDE para que decidas con los dos números en la mano.',
  },
  retencion: {
    principal: 'swiss-medical',
    razonPrincipal: 'Sanatorios propios de primer nivel (Suizo Argentina, Los Arcos, Agote) suelen pesar como beneficio real frente al equipo.',
    razonSecundaria: 'Comparamos también OSDE, por si tu gente valora más una red amplia que sanatorios propios.',
  },
}

type Step = 'prioridad' | 'empleados' | 'modalidad' | 'reveal' | 'contacto'
const STEPS: Step[] = ['prioridad', 'empleados', 'modalidad', 'reveal', 'contacto']

interface Props {
  open: boolean
  onClose: () => void
  prepagaContexto?: string
}

export function PropuestaQuizPopup({ open, onClose, prepagaContexto }: Props): React.ReactElement | null {
  const [step, setStep] = useState<Step>('prioridad')
  const [prioridad, setPrioridad] = useState<Prioridad | ''>('')
  const [empleados, setEmpleados] = useState('')
  const [modalidad, setModalidad] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [nombre, setNombre] = useState('')
  const [celular, setCelular] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  if (!open) return null

  function reset() {
    setStep('prioridad')
    setPrioridad(''); setEmpleados(''); setModalidad('')
    setEmpresa(''); setNombre(''); setCelular(''); setEmail(''); setStatus('idle')
  }

  function handleClose() {
    onClose()
    setTimeout(reset, 300)
  }

  function irA(s: Step) { setStep(s) }
  function volver() {
    const i = STEPS.indexOf(step)
    if (i > 0) setStep(STEPS[i - 1])
  }

  const contactOk =
    empresa.trim().length >= 2 &&
    nombre.trim().length >= 2 &&
    celular.trim().length >= 8 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  async function handleSubmit() {
    if (!contactOk) return
    setStatus('loading')
    const modalidadLabel = MODALIDADES.find((m) => m.value === modalidad)?.label ?? modalidad
    const prioridadLabel = PRIORIDADES.find((p) => p.value === prioridad)?.label ?? prioridad
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          celular: celular.trim(),
          email: email.trim(),
          fuente: 'pyme-empresas',
          prepaga_interes: `PyME${prepagaContexto ? ` · ${prepagaContexto}` : ''} · ${empresa.trim()} · ${empleados} empleados · ${modalidadLabel} · Prioridad: ${prioridadLabel}`,
        }),
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const pasoNum = STEPS.indexOf(step) + 1
  const pct = Math.round((pasoNum / STEPS.length) * 100)
  const reco = prioridad ? RECOMENDACIONES[prioridad] : null
  const secundaria: 'swiss-medical' | 'osde' | null = reco ? (reco.principal === 'swiss-medical' ? 'osde' : 'swiss-medical') : null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative bg-[#0A0B0D] border border-white/[0.08] rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#0A0B0D]/95 backdrop-blur border-b border-white/[0.08] px-6 pt-5 pb-4">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-5 h-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#C7A046]">Propuesta corporativa</span>
          <div className="h-1 bg-white/[0.08] rounded-full overflow-hidden mt-3">
            <div className="h-full bg-[#C7A046] rounded-full transition-all duration-400" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="p-6">
          {step === 'prioridad' && (
            <>
              <h3 className="text-lg font-semibold text-white mb-1.5">¿Qué es lo que más buscás en la cobertura de tu equipo?</h3>
              <p className="text-sm text-gray-500 mb-5">Con esto te mostramos qué comparar primero.</p>
              <div className="flex flex-col gap-2.5">
                {PRIORIDADES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => { setPrioridad(p.value); irA('empleados') }}
                    className="flex items-center gap-3 text-left px-4 py-3.5 rounded-xl border border-white/[0.12] text-gray-300 hover:border-[#C7A046]/50 hover:bg-[#C7A046]/[0.06] transition-colors"
                  >
                    <span className="text-[#C7A046] flex-shrink-0">{p.icon}</span>
                    <span className="text-sm font-medium">{p.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 'empleados' && (
            <>
              <h3 className="text-lg font-semibold text-white mb-1.5">¿Cuántas personas sos en el equipo?</h3>
              <p className="text-sm text-gray-500 mb-5">El precio por volumen depende de esto.</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {RANGOS_EMPLEADOS.map((r) => (
                  <button
                    key={r} type="button" onClick={() => { setEmpleados(r); irA('modalidad') }}
                    className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-white/[0.12] text-gray-300 hover:border-[#C7A046] hover:bg-[#C7A046]/10 hover:text-[#C7A046] transition-colors"
                  >
                    {r}
                  </button>
                ))}
              </div>
              <button onClick={volver} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">← Volver</button>
            </>
          )}

          {step === 'modalidad' && (
            <>
              <h3 className="text-lg font-semibold text-white mb-1.5">¿Cómo te gustaría cotizar?</h3>
              <p className="text-sm text-gray-500 mb-5">Es la última pregunta antes de tu recomendación.</p>
              <div className="flex flex-col gap-2.5 mb-6">
                {MODALIDADES.map((m) => (
                  <button
                    key={m.value} type="button" onClick={() => { setModalidad(m.value); irA('reveal') }}
                    className="text-left px-4 py-3 rounded-xl text-sm font-medium border border-white/[0.12] text-gray-300 hover:border-[#C7A046]/50 hover:bg-[#C7A046]/[0.06] transition-colors"
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <button onClick={volver} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">← Volver</button>
            </>
          )}

          {step === 'reveal' && reco && secundaria && (
            <>
              <div className="text-center mb-5">
                <span className="inline-flex items-center gap-1.5 bg-[#C7A046]/10 text-[#C7A046] text-[11px] font-bold px-3 py-1.5 rounded-full mb-3">
                  Tu match para {empleados} personas
                </span>
                <h3 className="text-lg font-semibold text-white">Esto es lo que compararíamos primero</h3>
              </div>

              <div className="rounded-xl border border-[#C7A046]/40 bg-[#C7A046]/[0.05] p-4 mb-3">
                <div className="flex items-center gap-3 mb-2">
                  <PrepagaLogo slug={reco.principal} nombre={reco.principal === 'swiss-medical' ? 'Swiss Medical' : 'OSDE'} colorPrimario={reco.principal === 'swiss-medical' ? '#E30613' : '#003087'} size="sm" />
                  <div>
                    <div className="text-[10px] font-bold text-[#C7A046] uppercase tracking-wide">Sugerido para vos</div>
                    <div className="text-sm font-semibold text-white">{reco.principal === 'swiss-medical' ? 'Swiss Medical' : 'OSDE'}</div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{reco.razonPrincipal}</p>
              </div>

              <div className="rounded-xl border border-white/[0.08] p-4 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <PrepagaLogo slug={secundaria} nombre={secundaria === 'swiss-medical' ? 'Swiss Medical' : 'OSDE'} colorPrimario={secundaria === 'swiss-medical' ? '#E30613' : '#003087'} size="sm" />
                  <div className="text-sm font-semibold text-white">{secundaria === 'swiss-medical' ? 'Swiss Medical' : 'OSDE'}</div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{reco.razonSecundaria}</p>
              </div>

              <button
                onClick={() => irA('contacto')}
                className="w-full py-3.5 bg-[#C7A046] hover:bg-[#DDBB63] text-[#0A0B0D] font-bold rounded-lg text-sm transition-colors mb-3"
              >
                Ver la propuesta comparada completa →
              </button>
              <button onClick={volver} className="w-full text-center text-xs text-gray-500 hover:text-gray-300 transition-colors">← Volver</button>
            </>
          )}

          {step === 'contacto' && status !== 'success' && (
            <>
              <h3 className="text-lg font-semibold text-white mb-1.5">Ya casi — ¿a quién le mandamos la propuesta?</h3>
              <p className="text-sm text-gray-500 mb-5">Un asesor arma la comparación con números reales para tu equipo.</p>

              <div className="grid grid-cols-1 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Nombre de la empresa *</label>
                  <input
                    type="text" value={empresa} onChange={(e) => setEmpresa(e.target.value)}
                    placeholder="Crossover S.A." autoComplete="organization"
                    className="w-full bg-white/[0.03] border border-white/[0.12] text-white placeholder:text-gray-600 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-[#C7A046] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Tu nombre *</label>
                  <input
                    type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre del contacto" autoComplete="name"
                    className="w-full bg-white/[0.03] border border-white/[0.12] text-white placeholder:text-gray-600 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-[#C7A046] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Teléfono de contacto *</label>
                  <input
                    type="tel" value={celular} onChange={(e) => setCelular(e.target.value)}
                    placeholder="11 4567-8900" inputMode="numeric" autoComplete="tel"
                    className="w-full bg-white/[0.03] border border-white/[0.12] text-white placeholder:text-gray-600 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-[#C7A046] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email *</label>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="vos@tuempresa.com" autoComplete="email"
                    className="w-full bg-white/[0.03] border border-white/[0.12] text-white placeholder:text-gray-600 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-[#C7A046] transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!contactOk || status === 'loading'}
                className="w-full py-3.5 bg-[#C7A046] hover:bg-[#DDBB63] disabled:bg-white/10 disabled:text-gray-600 disabled:cursor-not-allowed text-[#0A0B0D] font-bold rounded-lg text-sm transition-colors mb-3"
              >
                {status === 'loading' ? 'Enviando...' : 'Pedir propuesta para mi equipo'}
              </button>
              {status === 'error' && (
                <p className="text-xs text-red-400 mb-2 text-center">No pudimos enviar el formulario. Probá de nuevo en un momento.</p>
              )}
              <button onClick={volver} className="w-full text-center text-xs text-gray-500 hover:text-gray-300 transition-colors">← Volver</button>
            </>
          )}

          {status === 'success' && (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-[#C7A046]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7 text-[#C7A046]">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="font-semibold text-white mb-1">¡Listo! Recibimos los datos de {empresa}</p>
              <p className="text-sm text-gray-500">Un asesor va a armar la propuesta comparada para tu equipo y te contacta a la brevedad.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
