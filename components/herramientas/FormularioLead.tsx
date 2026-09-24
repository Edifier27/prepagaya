'use client'

import { useEffect, useRef, useState } from 'react'
import { esCelularArgentinoValido, TIEMPO_RESPUESTA } from '@/lib/utils'

// Formulario de datos de las herramientas (Mis sanatorios, Chequeo, Match).
// El precio exacto para la edad se muestra recién después de dejar los datos
// (decisión de Darío, 24-sep-2026: con poco tráfico, el precio abierto hace
// que la gente no responda al asesor). A diferencia del cotizador se puede
// cerrar: la persona ya vio el valor de la herramienta y puede seguir mirando.

export interface DatosFormulario {
  nombre: string
  celular: string
  email: string
  edades: number[]
}

interface Props {
  titulo: string
  bajada: string
  textoBoton: string
  /** Pedir las edades del grupo (para calcular el precio) */
  pedirEdades?: boolean
  edadesIniciales?: number[]
  onCerrar: () => void
  /** Tiene que lanzar si el envío falla */
  onEnviar: (d: DatosFormulario) => Promise<void>
}

const MAX_PERSONAS = 6

export function FormularioLead({ titulo, bajada, textoBoton, pedirEdades, edadesIniciales, onCerrar, onEnviar }: Props) {
  const [edades, setEdades] = useState<string[]>(edadesIniciales?.length ? edadesIniciales.map(String) : [''])
  const [nombre, setNombre] = useState('')
  const [celular, setCelular] = useState('')
  const [email, setEmail] = useState('')
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'error'>('idle')
  const primerCampo = useRef<HTMLInputElement>(null)
  // onCerrar suele llegar como función nueva en cada render: se guarda en un
  // ref para que el efecto de abajo corra una sola vez (si no, el foco
  // saltaría al primer campo en cada render del padre).
  const cerrar = useRef(onCerrar)
  useEffect(() => { cerrar.current = onCerrar }, [onCerrar])

  useEffect(() => {
    primerCampo.current?.focus()
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') cerrar.current() }
    window.addEventListener('keydown', esc)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', esc); document.body.style.overflow = overflow }
  }, [])

  const edadesNum = edades.map((e) => parseInt(e, 10)).filter((n) => Number.isInteger(n) && n >= 0 && n <= 99)
  const edadesOk = !pedirEdades || (edadesNum.length === edades.length && edadesNum.length > 0)
  const celularOk = esCelularArgentinoValido(celular)
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const ok = edadesOk && nombre.trim().length > 0 && celularOk && emailOk

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!ok || estado === 'enviando') return
    setEstado('enviando')
    try {
      await onEnviar({ nombre: nombre.trim(), celular: celular.trim(), email: email.trim(), edades: edadesNum })
    } catch {
      setEstado('error')
    }
  }

  const input = 'w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#E8002D] transition-colors'

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="form-lead-titulo">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px]" onClick={onCerrar} />
      <form onSubmit={enviar} className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        <button type="button" onClick={onCerrar} aria-label="Cerrar" className="absolute top-4 right-4 w-9 h-9 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
        <h2 id="form-lead-titulo" className="text-xl font-bold text-gray-900 pr-8">{titulo}</h2>
        <p className="text-sm text-gray-600 mt-1 mb-5">{bajada}</p>

        {pedirEdades && (
          <fieldset className="mb-4">
            <legend className="block text-xs font-semibold text-gray-600 mb-1">Edad de cada persona que se asocia</legend>
            <div className="flex flex-wrap gap-2">
              {edades.map((v, i) => (
                <div key={i} className="relative">
                  <input
                    ref={i === 0 ? primerCampo : undefined}
                    type="text" inputMode="numeric" pattern="[0-9]*" maxLength={2} value={v}
                    onChange={(e) => setEdades((prev) => prev.map((x, j) => (j === i ? e.target.value.replace(/\D/g, '').slice(0, 2) : x)))}
                    placeholder={i === 0 ? 'Tu edad' : 'Edad'}
                    aria-label={i === 0 ? 'Tu edad' : `Edad de la persona ${i + 1}`}
                    className={`${input} w-28 pr-7`}
                  />
                  {i > 0 && (
                    <button type="button" onClick={() => setEdades((prev) => prev.filter((_, j) => j !== i))} aria-label={`Sacar persona ${i + 1}`}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full text-gray-400 hover:text-gray-700">×</button>
                  )}
                </div>
              ))}
              {edades.length < MAX_PERSONAS && (
                <button type="button" onClick={() => setEdades((prev) => [...prev, ''])}
                  className="rounded-xl border-2 border-dashed border-gray-300 px-3 text-sm font-semibold text-gray-600 hover:border-gray-400">+ Persona</button>
              )}
            </div>
          </fieldset>
        )}

        <div className="space-y-3">
          <div>
            <label htmlFor="fl-nombre" className="block text-xs font-semibold text-gray-600 mb-1">Nombre</label>
            <input id="fl-nombre" ref={pedirEdades ? undefined : primerCampo} value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="given-name" placeholder="Tu nombre" className={input} />
          </div>
          <div>
            <label htmlFor="fl-celular" className="block text-xs font-semibold text-gray-600 mb-1">Celular</label>
            <input id="fl-celular" type="tel" value={celular} onChange={(e) => setCelular(e.target.value)} autoComplete="tel" placeholder="11 2345-6789" className={input} />
            {celular.trim().length > 0 && !celularOk && <p className="text-[11px] text-amber-700 mt-1">Revisá el número: parece incompleto.</p>}
          </div>
          <div>
            <label htmlFor="fl-email" className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
            <input id="fl-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="tu@email.com" className={input} />
          </div>
        </div>

        {estado === 'error' && <p className="text-sm text-red-600 mt-3">No pudimos enviarlo. Probá de nuevo en un momento.</p>}

        <button type="submit" disabled={!ok || estado === 'enviando'}
          className="mt-5 w-full py-4 bg-[#E8002D] hover:bg-[#B8001F] disabled:bg-gray-200 disabled:text-gray-500 text-white font-bold rounded-2xl transition-colors text-base">
          {estado === 'enviando' ? 'Enviando…' : textoBoton}
        </button>
        <p className="text-xs text-gray-500 text-center mt-3">
          Gratis y sin compromiso. Un asesor te escribe en {TIEMPO_RESPUESTA} con la cotización formal. <a href="/privacidad" className="underline">Privacidad</a>
        </p>
      </form>
    </div>
  )
}
