'use client'

import { useState } from 'react'
import { trackEvent, trackLead } from '@/lib/analytics'
import { OPCIONES_PREPAGA_ACTUAL } from '@/lib/data/sondeo'
import { CampoTrampa, datoTrampa } from '@/components/ui/CampoTrampa'

// "Te aviso el aumento" (15-oct-2026): el aumento mensual es el momento en que
// la gente piensa en cambiarse. Entra como un lead más (/api/leads, fuente
// "aviso-aumento"): panel, Kommo/CRM y planilla. El aviso lo manda el asesor;
// el sitio no envía mensajes.
const PREPAGAS: string[] = OPCIONES_PREPAGA_ACTUAL.filter((x) => !['No tengo cobertura', 'Obra social', 'PAMI'].includes(x))

export function AvisoAumento({ prepagaInicial, titulo, compacto = false }: { prepagaInicial?: string; titulo?: string; compacto?: boolean }) {
  // compacto: en la ficha va plegado para no empujar los planes hacia abajo
  const [abierto, setAbierto] = useState(!compacto)
  const [nombre, setNombre] = useState('')
  const [celular, setCelular] = useState('')
  const [prepaga, setPrepaga] = useState(prepagaInicial && PREPAGAS.includes(prepagaInicial) ? prepagaInicial : '')
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'ok' | 'error'>('idle')
  const ok = nombre.trim().length >= 2 && celular.replace(/\D/g, '').length >= 8 && !!prepaga

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!ok || estado === 'enviando') return
    setEstado('enviando')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...datoTrampa(),
          nombre: nombre.trim(),
          celular: celular.trim(),
          email: `${celular.replace(/\D/g, '')}@sin-email.com`,
          fuente: 'aviso-aumento',
          prepaga_interes: `Aviso de aumento: ${prepaga}`,
          prepaga_actual: prepaga,
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      trackLead('aviso-aumento', { prepaga })
      setEstado('ok')
    } catch {
      setEstado('error')
    }
  }

  if (estado === 'ok') {
    return (
      <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5 text-center">
        <p className="font-bold text-emerald-900">¡Listo, {nombre.trim().split(' ')[0]}!</p>
        <p className="text-sm text-emerald-800 mt-1">Cuando se publique el aumento oficial de {prepaga}, te escribimos por WhatsApp con el número y lo que pagarías en otros planes.</p>
      </div>
    )
  }

  if (!abierto) {
    return (
      <button type="button" onClick={() => { setAbierto(true); trackEvent('aviso_aumento_abrir', {}) }}
        className="inline-flex items-center gap-2 rounded-xl border-2 border-amber-300 bg-white px-4 py-2.5 text-sm font-bold text-amber-900 hover:bg-amber-50 transition-colors">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
        Avisame cuánto aumenta {prepaga || 'mi prepaga'} el mes que viene
      </button>
    )
  }

  return (
    <form onSubmit={enviar} onFocus={() => trackEvent('aviso_aumento_inicio', {})} className="rounded-2xl border-2 border-gray-200 bg-white p-5">
      <p className="font-bold text-gray-900 text-lg">{titulo ?? '¿Querés saber cuánto te aumenta el mes que viene?'}</p>
      <p className="text-sm text-gray-600 mt-1 mb-4">Te avisamos por WhatsApp apenas se publique el aumento oficial de tu prepaga, y si te conviene cambiarte. Gratis.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="block">
          <span className="block text-xs font-semibold text-gray-600 mb-1">Tu prepaga</span>
          <select value={prepaga} onChange={(e) => setPrepaga(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-[#E8002D] bg-white">
            <option value="">Elegí</option>
            {PREPAGAS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
        <CampoTrampa />
        <label className="block">
          <span className="block text-xs font-semibold text-gray-600 mb-1">Nombre</span>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="given-name" placeholder="Tu nombre"
            className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-[#E8002D]" />
        </label>
        <label className="block">
          <span className="block text-xs font-semibold text-gray-600 mb-1">WhatsApp</span>
          <input value={celular} onChange={(e) => setCelular(e.target.value)} type="tel" inputMode="tel" autoComplete="tel-national" placeholder="11 2345-6789"
            className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-[#E8002D]" />
        </label>
      </div>
      {estado === 'error' && <p className="text-sm text-[#E8002D] mt-3">Hubo un problema. Probá de nuevo.</p>}
      <button type="submit" disabled={!ok || estado === 'enviando'}
        className="mt-4 w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm transition-colors bg-[#E8002D] hover:bg-[#B8001F] text-white disabled:bg-gray-200 disabled:text-gray-500">
        {estado === 'enviando' ? 'Enviando…' : 'Avisame el próximo aumento'}
      </button>
      <p className="text-[11px] text-gray-400 mt-2">Sin compromiso. Podés pedir que no te escribamos más cuando quieras.</p>
    </form>
  )
}
