'use client'

import { useState } from 'react'

const RANGOS_EMPLEADOS = ['2-5', '6-10', '11-25', '26-50', '+50']
const MODALIDADES = [
  { value: 'derivando-aportes', label: 'Derivando aportes de obra social' },
  { value: 'particular', label: 'Plan corporativo particular' },
  { value: 'no-se', label: 'No sé, quiero que me asesoren' },
]

// Formulario de leads de pyme/empresas — a diferencia del comparador
// individual, acá no hay cotización automática (depende de la composición
// etaria del equipo), así que el formulario captura lo mínimo para que un
// asesor arme la propuesta. Todo lead de esta fuente va directo a la cuenta
// de Darío en Kommo (pedido de Darío, 17-sep-2026: no entra al reparto
// automático con Gabriela — ver lib/kommo.ts).
export function EmpresasForm() {
  const [empresa, setEmpresa] = useState('')
  const [nombre, setNombre] = useState('')
  const [empleados, setEmpleados] = useState('')
  const [modalidad, setModalidad] = useState('')
  const [celular, setCelular] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const ok =
    empresa.trim().length >= 2 &&
    nombre.trim().length >= 2 &&
    empleados !== '' &&
    modalidad !== '' &&
    celular.trim().length >= 8 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  async function handleSubmit() {
    if (!ok) return
    setStatus('loading')
    const modalidadLabel = MODALIDADES.find((m) => m.value === modalidad)?.label ?? modalidad
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          celular: celular.trim(),
          email: email.trim(),
          fuente: 'pyme-empresas',
          prepaga_interes: `PyME · ${empresa.trim()} · ${empleados} empleados · ${modalidadLabel}`,
        }),
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-white rounded-2xl border-2 border-green-200 p-6 text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7 text-green-500">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="font-bold text-gray-900 mb-1">¡Listo! Recibimos los datos de {empresa}</p>
        <p className="text-sm text-gray-500">Un asesor va a armar la propuesta comparada para tu equipo y te contacta a la brevedad.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre de la empresa *</label>
          <input
            type="text" value={empresa} onChange={(e) => setEmpresa(e.target.value)}
            placeholder="Ferretería del Sur SRL"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8002D] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Tu nombre *</label>
          <input
            type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del contacto"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8002D] transition-colors"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-2">Cantidad de empleados *</label>
        <div className="flex flex-wrap gap-2">
          {RANGOS_EMPLEADOS.map((r) => (
            <button
              key={r} type="button" onClick={() => setEmpleados(r)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-colors ${
                empleados === r ? 'border-[#E8002D] bg-red-50 text-[#E8002D]' : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-2">¿Cómo querés cotizar? *</label>
        <div className="flex flex-col gap-2">
          {MODALIDADES.map((m) => (
            <button
              key={m.value} type="button" onClick={() => setModalidad(m.value)}
              className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-colors ${
                modalidad === m.value ? 'border-[#E8002D] bg-red-50 text-[#E8002D]' : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Teléfono de contacto *</label>
          <input
            type="tel" value={celular} onChange={(e) => setCelular(e.target.value)}
            placeholder="11 4567-8900" inputMode="numeric"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8002D] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="vos@tuempresa.com"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8002D] transition-colors"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!ok || status === 'loading'}
        className="w-full py-3.5 bg-[#E8002D] hover:bg-[#B8001F] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-colors"
      >
        {status === 'loading' ? 'Enviando...' : 'Pedir propuesta para mi equipo'}
      </button>
      {status === 'error' && (
        <p className="text-xs text-red-600 mt-2 text-center">No pudimos enviar el formulario. Probá de nuevo en un momento.</p>
      )}
    </div>
  )
}
