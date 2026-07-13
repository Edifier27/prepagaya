'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import emailjs from '@emailjs/browser'
import { prepagas } from '@/lib/data/prepagas'
import type { Plan, Prepaga } from '@/types'
import { formatPrecio } from '@/lib/utils'

const EJS_SERVICE  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  ?? ''
const EJS_TEMPLATE = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? ''
const EJS_KEY      = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  ?? ''
const DESCUENTO_ONLINE = 0.25

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 'zona' | 'edades' | 'preview' | 'resultados'
type CobId = 'internacion' | 'psicologia' | 'kinesiologia' | 'maternidad' | 'odontologia' | 'medicamentos' | 'estudios' | 'urgencias' | 'optica'
type Copago = 'sin-copago' | 'con-copago' | null
interface Persona { id: number; edad: string }
interface Resultado {
  prepaga: Prepaga
  plan: Plan
  score: number
  precioGrupal: number
  precioDesc: number
}

// ─── Zone mapping ─────────────────────────────────────────────────────────────

const ZONA_PREPAGAS: Record<string, string[]> = {
  'caba':         ['swiss-medical','osde','cemic','sancor-salud','premedic','medife','omint','medicus','avalian','prevencion-salud','hospital-italiano','hominis'],
  'buenos-aires': ['swiss-medical','osde','cemic','sancor-salud','premedic','medife','omint','medicus','avalian','prevencion-salud','hospital-italiano','hominis'],
  'cordoba':      ['swiss-medical','osde','sancor-salud','premedic','medife','medicus','avalian','prevencion-salud','federada-salud'],
  'santa-fe':     ['swiss-medical','osde','sancor-salud','medife','medicus','avalian','prevencion-salud','federada-salud'],
  'entre-rios':   ['swiss-medical','osde','sancor-salud','avalian','prevencion-salud','federada-salud'],
  'mendoza':      ['swiss-medical','osde','sancor-salud','medicus','avalian','prevencion-salud'],
  'tucuman':      ['swiss-medical','osde','sancor-salud','premedic','avalian','prevencion-salud'],
  'salta':        ['swiss-medical','osde','sancor-salud','medife','prevencion-salud'],
  'jujuy':        ['swiss-medical','osde','sancor-salud','medife','prevencion-salud'],
  'neuquen':      ['swiss-medical','osde','sancor-salud','medicus','avalian','prevencion-salud'],
  'rio-negro':    ['swiss-medical','osde','sancor-salud','medicus'],
  'misiones':     ['osde','sancor-salud','prevencion-salud'],
  'corrientes':   ['osde','sancor-salud','prevencion-salud'],
  'chaco':        ['osde','sancor-salud','prevencion-salud'],
  'otras':        ['swiss-medical','osde','sancor-salud','medife','avalian','prevencion-salud'],
}

interface Provincia { slug: string; nombre: string; zonaKey: string }
const PROVINCIAS: Provincia[] = [
  { slug: 'caba',         nombre: 'CABA',                    zonaKey: 'caba' },
  { slug: 'buenos-aires', nombre: 'Buenos Aires (GBA/Pcia)', zonaKey: 'buenos-aires' },
  { slug: 'cordoba',      nombre: 'Córdoba',                 zonaKey: 'cordoba' },
  { slug: 'santa-fe',     nombre: 'Santa Fe',                zonaKey: 'santa-fe' },
  { slug: 'mendoza',      nombre: 'Mendoza',                 zonaKey: 'mendoza' },
  { slug: 'tucuman',      nombre: 'Tucumán',                 zonaKey: 'tucuman' },
  { slug: 'entre-rios',   nombre: 'Entre Ríos',              zonaKey: 'entre-rios' },
  { slug: 'salta',        nombre: 'Salta',                   zonaKey: 'salta' },
  { slug: 'neuquen',      nombre: 'Neuquén',                 zonaKey: 'neuquen' },
  { slug: 'misiones',     nombre: 'Misiones',                zonaKey: 'misiones' },
  { slug: 'chaco',        nombre: 'Chaco',                   zonaKey: 'chaco' },
  { slug: 'corrientes',   nombre: 'Corrientes',              zonaKey: 'corrientes' },
  { slug: 'rio-negro',    nombre: 'Río Negro',               zonaKey: 'rio-negro' },
  { slug: 'jujuy',        nombre: 'Jujuy',                   zonaKey: 'jujuy' },
  { slug: 'santiago',     nombre: 'Santiago del Estero',     zonaKey: 'otras' },
  { slug: 'san-juan',     nombre: 'San Juan',                zonaKey: 'otras' },
  { slug: 'san-luis',     nombre: 'San Luis',                zonaKey: 'otras' },
  { slug: 'la-pampa',     nombre: 'La Pampa',                zonaKey: 'otras' },
  { slug: 'catamarca',    nombre: 'Catamarca',               zonaKey: 'otras' },
  { slug: 'la-rioja',     nombre: 'La Rioja',                zonaKey: 'otras' },
  { slug: 'chubut',       nombre: 'Chubut',                  zonaKey: 'otras' },
  { slug: 'formosa',      nombre: 'Formosa',                 zonaKey: 'otras' },
  { slug: 'santa-cruz',   nombre: 'Santa Cruz',              zonaKey: 'otras' },
  { slug: 'tierra-fuego', nombre: 'Tierra del Fuego',        zonaKey: 'otras' },
]

// ─── Utilities ────────────────────────────────────────────────────────────────

function mult(edad: number) {
  if (edad <= 18) return 0.3
  if (edad <= 25) return 0.75
  if (edad <= 35) return 1.0
  if (edad <= 45) return 1.45
  if (edad <= 55) return 2.05
  if (edad <= 65) return 2.85
  return 3.6
}

function calcGrupal(base: number, personas: Persona[]): number {
  if (!personas.length) return base
  return Math.round(personas.reduce((s, p) => s + base * mult(parseInt(p.edad) || 30), 0))
}

function checkCob(id: CobId, plan: Plan, p: Prepaga): boolean {
  const t = plan.cobertura.join(' ').toLowerCase()
  const m: Record<CobId, boolean> = {
    internacion:  t.includes('internaci'),
    psicologia:   t.includes('psic') || t.includes('salud mental') || p.caracteristicas.saludMental,
    kinesiologia: true,
    maternidad:   t.includes('maternidad') || p.caracteristicas.maternidad,
    odontologia:  t.includes('odont') || t.includes('dental') || p.caracteristicas.odontologia,
    medicamentos: t.includes('farmacia') || t.includes('medicament') || p.caracteristicas.farmacia,
    estudios:     t.includes('complejidad') || t.includes('laboratorio'),
    urgencias:    t.includes('urgencia') || p.caracteristicas.atencion24hs,
    optica:       t.includes('optica') || t.includes('óptica') || p.caracteristicas.optica,
  }
  return m[id]
}

function calcResultados(personas: Persona[], zonaKey: string): Resultado[] {
  const slugsZona = ZONA_PREPAGAS[zonaKey] ?? ZONA_PREPAGAS['otras']
  const prepagasFiltradas = prepagas.filter((p) => slugsZona.includes(p.slug))
  const out: Resultado[] = []
  for (const prep of prepagasFiltradas) {
    for (const plan of prep.planes) {
      let score = (prep.satisfaccion / 100) * 8
      if (plan.redAbierta) score += 3
      if (!plan.copago) score += 2
      if (plan.destacado) score += 3
      const precioGrupal = calcGrupal(plan.precio, personas)
      out.push({ prepaga: prep, plan, score, precioGrupal, precioDesc: Math.round(precioGrupal * (1 - DESCUENTO_ONLINE)) })
    }
  }
  return out.sort((a, b) => b.score - a.score)
}

// ─── Coverage filter options ──────────────────────────────────────────────────

const COBS: { id: CobId; label: string }[] = [
  { id: 'psicologia',   label: 'Psicología' },
  { id: 'maternidad',   label: 'Maternidad' },
  { id: 'odontologia',  label: 'Odontología' },
  { id: 'internacion',  label: 'Internación' },
  { id: 'medicamentos', label: 'Medicamentos' },
  { id: 'urgencias',    label: 'Urgencias 24hs' },
  { id: 'optica',       label: 'Óptica' },
  { id: 'kinesiologia', label: 'Kinesiología' },
  { id: 'estudios',     label: 'Estudios complejos' },
]

// ─── Progress bar (3 steps) ───────────────────────────────────────────────────

const STEP_LABELS = ['Zona', 'Integrantes', 'Ver precios']
const STEP_ORDER: Step[] = ['zona', 'edades', 'preview']

function ProgressBar({ step }: { step: Step }) {
  const idx = STEP_ORDER.indexOf(step)
  if (idx < 0) return null
  return (
    <div className="mb-10">
      <div className="flex items-center">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i < idx  ? 'bg-[#00875A] text-white' :
                i === idx ? 'bg-[#E8002D] text-white ring-4 ring-red-100' :
                            'bg-gray-100 text-gray-400'
              }`}>
                {i < idx ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                ) : i + 1}
              </div>
              <span className={`text-[10px] font-semibold hidden sm:block whitespace-nowrap ${
                i === idx ? 'text-[#E8002D]' : i < idx ? 'text-[#00875A]' : 'text-gray-400'
              }`}>{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`flex-1 h-px mx-2 mb-4 transition-all duration-500 ${i < idx ? 'bg-[#00875A]' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-2">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-4 h-4">
        <path d="M19 12H5M12 5l-7 7 7 7"/>
      </svg>
      Volver
    </button>
  )
}

// ─── ZonaStep ─────────────────────────────────────────────────────────────────

function ZonaStep({ onSelect }: { onSelect: (p: Provincia) => void }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Provincia | null>(null)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleSelect(prov: Provincia) {
    setSelected(prov)
    setOpen(false)
    setTimeout(() => onSelect(prov), 180)
  }

  return (
    <div>
      <ProgressBar step="zona" />
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Desde dónde buscás cobertura?</h2>
        <p className="text-sm text-gray-500">Las prepagas disponibles varían según tu provincia</p>
      </div>
      <div ref={ref} className="relative max-w-sm mx-auto">
        <button
          onClick={() => setOpen((v) => !v)}
          className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl border-2 transition-all text-left ${
            open ? 'border-[#E8002D] bg-red-50 shadow-md' : 'border-gray-200 bg-white hover:border-red-300 hover:shadow-sm'
          }`}
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${open ? 'bg-[#E8002D]' : 'bg-red-50'}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={`w-5 h-5 ${open ? 'text-white' : 'text-[#E8002D]'}`}>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="9" r="2.5" fill="currentColor" stroke="none"/>
            </svg>
          </div>
          <span className={`flex-1 font-semibold text-base transition-colors ${selected ? 'text-gray-900' : 'text-gray-400'}`}>
            {selected ? selected.nombre : 'Seleccioná tu provincia'}
          </span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
            className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-[#E8002D]' : ''}`}>
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {open && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-20">
            <div className="max-h-64 overflow-y-auto">
              {PROVINCIAS.map((prov, i) => (
                <button key={prov.slug} onClick={() => handleSelect(prov)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 hover:text-[#E8002D] transition-colors group ${i < PROVINCIAS.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-gray-300 group-hover:text-[#E8002D] flex-shrink-0 transition-colors">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="9" r="2" fill="currentColor" stroke="none"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-[#E8002D] transition-colors">{prov.nombre}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <p className="text-center text-xs text-gray-400 mt-5">Elegí tu provincia para ver las prepagas disponibles en tu zona</p>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface WizardProps {
  initialZona?: string
  initialProvincia?: string
}

export function ComparadorWizard({ initialZona, initialProvincia }: WizardProps = {}) {
  const router = useRouter()
  const pathname = usePathname()

  const [step, setStep] = useState<Step>(initialZona ? 'edades' : 'zona')
  const [zonaKey, setZonaKey] = useState(initialZona ?? '')
  const [provinciaNombre, setProvinciaNombre] = useState(initialProvincia ?? '')
  const [personas, setPersonas] = useState<Persona[]>([{ id: 1, edad: '' }])

  // Lead data
  const [nombre, setNombre] = useState('')
  const [celular, setCelular] = useState('')
  const [leadStatus, setLeadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  // Preview countdown
  const [countdown, setCountdown] = useState(3)
  const [showPopup, setShowPopup] = useState(false)

  // Results filters
  const [activeCobs, setActiveCobs] = useState<Set<CobId>>(new Set())
  const [copago, setCopago] = useState<Copago>(null)
  const [sortBy, setSortBy] = useState<'relevancia' | 'precio-asc' | 'precio-desc'>('relevancia')

  // Plan access
  const [planAccedido, setPlanAccedido] = useState<string | null>(null)
  const [planAccedidoStatus, setPlanAccedidoStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  const allResultados = useMemo(() =>
    (step === 'resultados' || step === 'preview') ? calcResultados(personas, zonaKey) : [],
    [step, personas, zonaKey]
  )

  const resultadosFiltrados = useMemo((): Resultado[] => {
    return allResultados
      .filter((r) => {
        if (copago === 'sin-copago' && r.plan.copago) return false
        if (copago === 'con-copago' && !r.plan.copago) return false
        for (const c of activeCobs) {
          if (!checkCob(c, r.plan, r.prepaga)) return false
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'precio-asc') return a.precioGrupal - b.precioGrupal
        if (sortBy === 'precio-desc') return b.precioGrupal - a.precioGrupal
        const scoreA = a.score + [...activeCobs].filter(c => checkCob(c, a.plan, a.prepaga)).length * 5
        const scoreB = b.score + [...activeCobs].filter(c => checkCob(c, b.plan, b.prepaga)).length * 5
        return scoreB - scoreA
      })
      .slice(0, 12)
  }, [allResultados, copago, activeCobs, sortBy])

  // 3-second countdown when entering preview
  useEffect(() => {
    if (step !== 'preview') return
    setCountdown(3)
    setShowPopup(false)
    const timer = setInterval(() => {
      setCountdown((n) => {
        if (n <= 1) { clearInterval(timer); setShowPopup(true); return 0 }
        return n - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [step])

  // Block page close while popup is showing
  useEffect(() => {
    if (!showPopup) return
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [showPopup])

  const edadesOk = personas.length > 0 && personas.every((p) => {
    const n = parseInt(p.edad)
    return p.edad !== '' && !isNaN(n) && n > 0 && n < 110
  })
  const popupOk = nombre.trim().length > 0 && celular.trim().length >= 6

  function buildPayload(extra: Record<string, string> = {}): Record<string, string> {
    const planesTexto = allResultados.slice(0, 5).map((r, i) =>
      `${i + 1}. ${r.prepaga.nombre} — ${r.plan.nombre} | $${r.precioGrupal.toLocaleString('es-AR')}/mes`
    ).join('\n')
    return {
      name: nombre.trim(),
      nombre: nombre.trim(),
      celular: celular.trim(),
      reply_to: 'cotizaciones@prepagaya.com.ar',
      email: '',
      provincia: provinciaNombre,
      personas: `${personas.length} persona${personas.length !== 1 ? 's' : ''} — edades: ${personas.map(p => p.edad + ' años').join(', ')}`,
      fuente: 'cotizacion-wizard',
      planes_mostrados: planesTexto,
      planes_recomendados: planesTexto,
      prepaga: planesTexto.split('\n')[0] ?? '',
      coberturas: [...activeCobs].map(c => COBS.find(o => o.id === c)?.label).filter(Boolean).join(', ') || 'Sin preferencia',
      copago_preferencia: copago === 'sin-copago' ? 'Sin copago' : copago === 'con-copago' ? 'Con copago' : 'Sin preferencia',
      situacion: 'No especificada',
      presupuesto: 'calculado por edad',
      fecha: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }),
      ...extra,
    }
  }

  async function sendEmail(payload: Record<string, string>) {
    if (EJS_SERVICE && EJS_TEMPLATE && EJS_KEY) {
      await emailjs.send(EJS_SERVICE, EJS_TEMPLATE, payload, { publicKey: EJS_KEY })
    } else {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    }
  }

  async function handleVerPrecios() {
    if (!popupOk) return
    setLeadStatus('loading')
    try {
      await sendEmail(buildPayload())
      setLeadStatus('success')
      setShowPopup(false)
      setStep('resultados')
    } catch {
      setLeadStatus('error')
    }
  }

  async function handleAccederPlan(res: Resultado) {
    const planKey = `${res.prepaga.slug}-${res.plan.slug}`
    setPlanAccedido(planKey)
    setPlanAccedidoStatus('loading')
    try {
      await sendEmail(buildPayload({
        fuente: 'plan-accedido',
        plan_elegido: `${res.prepaga.nombre} — ${res.plan.nombre}`,
        precio_original: `$${res.precioGrupal.toLocaleString('es-AR')}/mes`,
        precio_con_descuento: `$${res.precioDesc.toLocaleString('es-AR')}/mes`,
      }))
      setPlanAccedidoStatus('success')
    } catch {
      setPlanAccedidoStatus('idle')
    }
  }

  function toggleCob(id: CobId) {
    setActiveCobs((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function resetWizard() {
    setStep('zona'); setZonaKey(''); setProvinciaNombre('')
    setPersonas([{ id: 1, edad: '' }]); setNombre(''); setCelular('')
    setLeadStatus('idle'); setActiveCobs(new Set()); setCopago(null)
    setSortBy('relevancia'); setPlanAccedido(null); setPlanAccedidoStatus('idle')
    setCountdown(3); setShowPopup(false)
  }

  // ── Step: Zona ───────────────────────────────────────────────────────────────

  if (step === 'zona') {
    return (
      <ZonaStep onSelect={(prov) => {
        if (pathname !== '/comparador') {
          router.push(`/comparador?zona=${prov.zonaKey}&provincia=${encodeURIComponent(prov.nombre)}`)
          return
        }
        setZonaKey(prov.zonaKey)
        setProvinciaNombre(prov.nombre)
        setStep('edades')
      }} />
    )
  }

  // ── Step: Edades ─────────────────────────────────────────────────────────────

  if (step === 'edades') {
    function addPersona() {
      if (personas.length >= 6) return
      const newId = Math.max(...personas.map(p => p.id)) + 1
      setPersonas(prev => [...prev, { id: newId, edad: '' }])
    }
    function removePersona(id: number) {
      if (personas.length <= 1) return
      setPersonas(prev => prev.filter(p => p.id !== id))
    }
    function updateEdad(id: number, edad: string) {
      setPersonas(prev => prev.map(p => p.id === id ? { ...p, edad } : p))
    }

    return (
      <div>
        <ProgressBar step="edades" />
        <BackBtn onClick={() => setStep('zona')} />
        {provinciaNombre && (
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-[#E8002D] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
            </svg>
            {provinciaNombre}
          </div>
        )}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Para quién cotizamos?</h2>
          <p className="text-sm text-gray-500">Ingresá la edad de cada integrante del grupo familiar</p>
        </div>

        <div className="space-y-3 mb-4">
          {personas.map((p, i) => (
            <div key={p.id} className="flex items-center gap-4 bg-white border-2 border-gray-100 rounded-2xl p-4 hover:border-red-100 transition-colors">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[#E8002D]">{i + 1}</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-700">{i === 0 ? 'Titular' : `Integrante ${i + 1}`}</div>
                <div className="text-xs text-gray-400">Edad en años</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number" min={0} max={110}
                  value={p.edad}
                  onChange={(e) => updateEdad(p.id, e.target.value)}
                  placeholder="Ej: 35"
                  className="w-24 text-center text-lg font-bold border-2 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#E8002D] transition-colors"
                />
                <span className="text-sm text-gray-400 font-medium">años</span>
                {i > 0 && (
                  <button onClick={() => removePersona(p.id)}
                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 text-gray-400 flex items-center justify-center transition-colors text-lg font-bold leading-none">
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {personas.length < 6 && (
          <button onClick={addPersona}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-400 hover:border-[#E8002D] hover:text-[#E8002D] hover:bg-red-50 transition-all mb-8">
            <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-base leading-none">+</span>
            Agregar integrante
          </button>
        )}

        <div className="flex justify-end">
          <button onClick={() => setStep('preview')} disabled={!edadesOk}
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#E8002D] hover:bg-[#B8001F] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all shadow-md hover:shadow-lg text-base">
            Ver precios →
          </button>
        </div>
      </div>
    )
  }

  // ── Step: Preview (3s + popup) ────────────────────────────────────────────────

  if (step === 'preview') {
    const previewItems = allResultados.slice(0, 4)
    return (
      <div>
        <ProgressBar step="preview" />

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {!showPopup ? `Planes disponibles en ${provinciaNombre}` : 'Tus precios están listos'}
          </h2>
          {!showPopup && countdown > 0 && (
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm font-semibold px-4 py-2 rounded-full">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Completando cotización en {countdown}s…
            </div>
          )}
        </div>

        {/* Preview cards — real prices shown for 3s, then blurred */}
        <div className={`space-y-3 mb-4 transition-all duration-500 ${showPopup ? 'blur-md pointer-events-none select-none' : ''}`}>
          {previewItems.map((r, i) => {
            const calidad = Math.max(1, Math.min(5, Math.round(r.prepaga.satisfaccion / 20)))
            return (
              <div key={`${r.prepaga.slug}-${r.plan.slug}`}
                className={`bg-white rounded-2xl border-2 p-4 flex items-center justify-between ${i === 0 ? 'border-[#E8002D]' : 'border-gray-100'}`}>
                <div className="flex-1 min-w-0">
                  {i === 0 && (
                    <div className="inline-flex items-center gap-1 bg-[#E8002D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      Mejor opción
                    </div>
                  )}
                  <div className="font-bold text-gray-900">{r.prepaga.nombre}</div>
                  <div className="text-xs text-gray-500">{r.plan.nombre}</div>
                  <div className="flex gap-1 mt-1.5">
                    {!r.plan.copago && <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-700 rounded-full border border-green-200 font-semibold">Sin copago</span>}
                    {r.plan.redAbierta && <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200 font-semibold">Red abierta</span>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="text-[10px] text-[#E8002D] font-bold uppercase tracking-wide mb-0.5">Calidad {calidad}/5</div>
                  <div className="text-xs text-gray-400 line-through">{formatPrecio(r.precioGrupal)}/mes</div>
                  <div className="text-xl font-black text-[#E8002D] tabular-nums">{formatPrecio(r.precioDesc)}</div>
                  <div className="text-xs text-gray-400">/mes · {personas.length} pers.</div>
                </div>
              </div>
            )
          })}
          {/* blurred placeholder row */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-gray-200 rounded w-32" />
              <div className="h-2.5 bg-gray-100 rounded w-24" />
            </div>
            <div className="space-y-2 text-right">
              <div className="h-3 bg-gray-200 rounded w-20 ml-auto" />
              <div className="h-5 bg-gray-200 rounded w-28 ml-auto" />
            </div>
          </div>
          <p className="text-center text-xs text-gray-400">y {Math.max(0, allResultados.length - 4)} planes más…</p>
        </div>

        {/* Popup — fixed overlay, no close button */}
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 max-w-sm w-full">

              <div className="w-14 h-14 bg-gradient-to-br from-[#E8002D] to-[#B8001F] rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5} strokeLinecap="round" className="w-7 h-7">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>

              <h3 className="text-xl font-bold text-gray-900 text-center mb-1">Tus precios están listos</h3>
              <p className="text-sm text-gray-500 text-center mb-6">Ingresá tus datos para ver la cotización completa</p>

              <div className="space-y-3 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre *</label>
                  <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8002D] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Celular *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className="w-4 h-4">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.18 6.18l1.28-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                      </svg>
                    </span>
                    <input type="tel" value={celular} onChange={(e) => setCelular(e.target.value)}
                      placeholder="11 2345-6789"
                      className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#E8002D] transition-colors" />
                  </div>
                </div>
              </div>

              {leadStatus === 'error' && (
                <p className="text-red-500 text-xs text-center mb-3">Hubo un problema. Intentá de nuevo.</p>
              )}

              <button onClick={handleVerPrecios} disabled={!popupOk || leadStatus === 'loading'}
                className="w-full py-4 bg-[#E8002D] hover:bg-[#B8001F] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all shadow-lg text-base flex items-center justify-center gap-2">
                {leadStatus === 'loading' ? (
                  <><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Procesando...</>
                ) : 'Ver precios →'}
              </button>

              <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className="w-3.5 h-3.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                Tu información es privada · Sin compromiso
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Step: Resultados ──────────────────────────────────────────────────────────

  const cheapestResult = [...resultadosFiltrados].sort((a, b) => a.precioGrupal - b.precioGrupal)[0]
  const cheapestKey = cheapestResult ? `${cheapestResult.prepaga.slug}-${cheapestResult.plan.slug}` : null
  const bestKey = resultadosFiltrados[0] ? `${resultadosFiltrados[0].prepaga.slug}-${resultadosFiltrados[0].plan.slug}` : null

  return (
    <div>
      {/* Summary header */}
      <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] rounded-2xl p-5 text-white mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-red-200 text-xs mb-1">Cotización para</div>
            <div className="font-bold text-lg">{nombre}</div>
            <div className="text-red-200 text-sm mt-0.5">
              {personas.length} persona{personas.length !== 1 ? 's' : ''} · {personas.map(p => `${p.edad} años`).join(', ')}
              {provinciaNombre ? ` · ${provinciaNombre}` : ''}
            </div>
          </div>
          <div className="bg-white/15 rounded-xl px-4 py-2.5 text-center flex-shrink-0">
            <div className="text-xs text-red-200 mb-0.5">Descuento online</div>
            <div className="text-2xl font-black">25% OFF</div>
            <div className="text-xs text-red-200">por 12 meses</div>
          </div>
        </div>
      </div>

      {/* Layout: sidebar + cards */}
      <div className="flex gap-6">

        {/* Left sidebar — desktop only */}
        <div className="hidden lg:block w-52 flex-shrink-0">
          <div className="sticky top-24 self-start space-y-4">

            {/* Sort */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Ordenar por</p>
              <div className="space-y-0.5">
                {([
                  { id: 'relevancia', label: 'Relevancia' },
                  { id: 'precio-asc', label: 'Menor precio' },
                  { id: 'precio-desc', label: 'Mayor precio' },
                ] as { id: typeof sortBy; label: string }[]).map((opt) => (
                  <button key={opt.id} onClick={() => setSortBy(opt.id)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-all font-medium ${
                      sortBy === opt.id ? 'bg-red-50 text-[#E8002D]' : 'text-gray-600 hover:bg-gray-50'
                    }`}>
                    {sortBy === opt.id && <span className="mr-1">·</span>}{opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tipo de consulta */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Tipo de consulta</p>
              <div className="space-y-2.5">
                {([
                  { id: 'sin-copago', label: 'Sin copago' },
                  { id: 'con-copago', label: 'Con copago' },
                ] as { id: Copago; label: string }[]).map((opt) => (
                  <label key={String(opt.id)} className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setCopago(copago === opt.id ? null : opt.id)}>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                      copago === opt.id ? 'bg-[#E8002D] border-[#E8002D]' : 'border-gray-300 group-hover:border-[#E8002D]'
                    }`}>
                      {copago === opt.id && <svg viewBox="0 0 12 12" fill="white" className="w-2.5 h-2.5"><path fillRule="evenodd" d="M10.28 1.28L3.989 9.05 1.695 6.288a.75.75 0 00-1.14.976l2.939 3.425a.75.75 0 001.07.093l7-8.5a.75.75 0 00-1.284-.802z" clipRule="evenodd"/></svg>}
                    </div>
                    <span className={`text-sm font-medium transition-colors ${copago === opt.id ? 'text-[#E8002D]' : 'text-gray-600 group-hover:text-gray-900'}`}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Coberturas */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Me interesa incluir</p>
              <div className="space-y-2.5">
                {COBS.map((cob) => {
                  const on = activeCobs.has(cob.id)
                  return (
                    <label key={cob.id} className="flex items-center gap-2.5 cursor-pointer group" onClick={() => toggleCob(cob.id)}>
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        on ? 'bg-[#E8002D] border-[#E8002D]' : 'border-gray-300 group-hover:border-[#E8002D]'
                      }`}>
                        {on && <svg viewBox="0 0 12 12" fill="white" className="w-2.5 h-2.5"><path fillRule="evenodd" d="M10.28 1.28L3.989 9.05 1.695 6.288a.75.75 0 00-1.14.976l2.939 3.425a.75.75 0 001.07.093l7-8.5a.75.75 0 00-1.284-.802z" clipRule="evenodd"/></svg>}
                      </div>
                      <span className={`text-sm font-medium transition-colors ${on ? 'text-[#E8002D]' : 'text-gray-600 group-hover:text-gray-900'}`}>{cob.label}</span>
                    </label>
                  )
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Cards column */}
        <div className="flex-1 min-w-0">

          {/* Mobile filter chips */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: 'none' }}>
            {([
              { id: 'sin-copago', label: 'Sin copago', type: 'copago' },
              { id: 'con-copago', label: 'Con copago', type: 'copago' },
              ...COBS.map(c => ({ id: c.id, label: c.label, type: 'cob' }))
            ]).map((f) => {
              const on = f.type === 'copago' ? copago === f.id : activeCobs.has(f.id as CobId)
              return (
                <button key={f.id} onClick={() => {
                  if (f.type === 'copago') setCopago(copago === (f.id as Copago) ? null : (f.id as Copago))
                  else toggleCob(f.id as CobId)
                }}
                  className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${
                    on ? 'bg-[#E8002D] text-white border-[#E8002D]' : 'bg-white text-gray-600 border-gray-200'
                  }`}>
                  {on ? '✓ ' : ''}{f.label}
                </button>
              )
            })}
          </div>

          {/* Count + clear */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-700">
              {resultadosFiltrados.length} resultado{resultadosFiltrados.length !== 1 ? 's' : ''}
              {(activeCobs.size > 0 || copago) ? ' con filtros' : ''}
            </p>
            {(activeCobs.size > 0 || copago) && (
              <button onClick={() => { setActiveCobs(new Set()); setCopago(null) }}
                className="text-xs text-[#E8002D] font-semibold hover:underline">
                Limpiar filtros
              </button>
            )}
          </div>

          {resultadosFiltrados.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm mb-2">Ningún plan cumple todos los filtros.</p>
              <button onClick={() => { setActiveCobs(new Set()); setCopago(null) }}
                className="text-sm text-[#E8002D] font-semibold hover:underline">Quitar filtros</button>
            </div>
          )}

          <div className="space-y-4 mb-8">
            {resultadosFiltrados.map((res) => {
              const planKey = `${res.prepaga.slug}-${res.plan.slug}`
              const isBest = planKey === bestKey
              const isCheapest = planKey === cheapestKey && planKey !== bestKey
              const isAccedido = planAccedido === planKey
              const calidad = Math.max(1, Math.min(5, Math.round(res.prepaga.satisfaccion / 20)))
              const ahorroMensual = res.precioGrupal - res.precioDesc

              return (
                <div key={planKey}
                  className={`bg-white rounded-2xl border-2 overflow-hidden transition-all ${
                    isBest ? 'border-[#E8002D] shadow-md' : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                  }`}>

                  {isBest && (
                    <div className="bg-[#E8002D] text-white text-xs font-bold px-4 py-2 flex items-center gap-2">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      Mejor opción para tu perfil
                    </div>
                  )}
                  {isCheapest && (
                    <div className="bg-[#00875A] text-white text-xs font-bold px-4 py-2 flex items-center gap-2">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                      Plan más económico
                    </div>
                  )}

                  <div className="p-5">
                    {/* Header: name + quality circle */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 text-lg leading-tight">{res.prepaga.nombre}</div>
                        <div className="text-gray-500 text-sm">{res.plan.nombre}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{res.plan.descripcion}</div>
                      </div>
                      <div className="text-center flex-shrink-0">
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Calidad Cartilla</div>
                        <div className="relative w-12 h-12">
                          <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                            <circle cx="18" cy="18" r="15" fill="none" stroke="#F3F4F6" strokeWidth="3"/>
                            <circle cx="18" cy="18" r="15" fill="none" stroke="#E8002D" strokeWidth="3"
                              strokeDasharray={`${(calidad / 5) * 94} 94`} strokeLinecap="round"/>
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-black text-gray-900">{calidad}/5</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cobertura dots */}
                    <div className="space-y-1.5 mb-3">
                      {([
                        { label: 'Odontología', id: 'odontologia' as CobId },
                        { label: 'Psicología',  id: 'psicologia'  as CobId },
                        { label: 'Maternidad',  id: 'maternidad'  as CobId },
                      ]).map(({ label, id }) => {
                        const included = checkCob(id, res.plan, res.prepaga)
                        return (
                          <div key={id} className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="font-medium w-24 flex-shrink-0">{label}</span>
                            <div className="flex gap-1">
                              {[1,2,3].map((d) => (
                                <div key={d} className={`w-2.5 h-2.5 rounded-full ${
                                  included
                                    ? d === 1 ? 'bg-[#E8002D]' : d === 2 ? 'bg-red-300' : 'bg-red-100'
                                    : 'bg-gray-200'
                                }`} />
                              ))}
                            </div>
                            <span className={`text-[10px] font-medium ${included ? 'text-[#E8002D]' : 'text-gray-300'}`}>
                              {included ? 'Incluida' : 'No incluida'}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Benefit pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {!res.plan.copago && <span className="text-[11px] px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full font-semibold">Sin copago</span>}
                      {res.plan.redAbierta && <span className="text-[11px] px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-semibold">Red abierta</span>}
                      {checkCob('urgencias', res.plan, res.prepaga) && <span className="text-[11px] px-2.5 py-0.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-full font-semibold">Urgencias 24hs</span>}
                      {checkCob('medicamentos', res.plan, res.prepaga) && <span className="text-[11px] px-2.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full font-semibold">Medicamentos</span>}
                      {checkCob('optica', res.plan, res.prepaga) && <span className="text-[11px] px-2.5 py-0.5 bg-cyan-50 text-cyan-700 border border-cyan-200 rounded-full font-semibold">Óptica</span>}
                    </div>

                    {/* Price + CTA */}
                    <div className="flex items-end justify-between gap-4 pt-3 border-t border-gray-100">
                      <div>
                        <div className="text-xs text-gray-400 line-through tabular-nums">{formatPrecio(res.precioGrupal)}/mes</div>
                        <div className="text-2xl font-black text-[#E8002D] tabular-nums leading-tight">{formatPrecio(res.precioDesc)}</div>
                        <div className="text-xs text-gray-500">/mes · {personas.length} persona{personas.length !== 1 ? 's' : ''}</div>
                        <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-full mt-1 border border-emerald-200">
                          Ahorrás {formatPrecio(ahorroMensual)}/mes
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end flex-shrink-0">
                        <Link href={`/prepagas/${res.prepaga.slug}/${res.plan.slug}`}
                          className="text-xs text-gray-400 hover:text-[#E8002D] transition-colors font-medium">
                          Ver detalles →
                        </Link>
                        {isAccedido && planAccedidoStatus === 'success' ? (
                          <div className="text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                            ¡Solicitud enviada!
                          </div>
                        ) : (
                          <button onClick={() => handleAccederPlan(res)}
                            disabled={isAccedido && planAccedidoStatus === 'loading'}
                            className="px-5 py-2.5 bg-[#E8002D] hover:bg-[#B8001F] text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-60 flex items-center gap-2">
                            {isAccedido && planAccedidoStatus === 'loading' ? (
                              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                            ) : null}
                            Pedir más info →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-center">
            <button onClick={resetWizard} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              ← Hacer una nueva cotización
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
