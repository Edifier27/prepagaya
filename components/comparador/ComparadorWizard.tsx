'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import emailjs from '@emailjs/browser'
import { prepagas } from '@/lib/data/prepagas'
import type { Plan, Prepaga } from '@/types'
import { formatPrecio, precioDeriva, IVA_PREPAGA } from '@/lib/utils'

const EJS_SERVICE  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  ?? ''
const EJS_TEMPLATE = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? ''
const EJS_KEY      = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  ?? ''
const DESCUENTO_ONLINE = 0.25

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 'zona' | 'personas' | 'edades' | 'situacion' | 'coberturas' | 'datos' | 'resultados'
type CobId = 'internacion' | 'psicologia' | 'kinesiologia' | 'maternidad' | 'odontologia' | 'medicamentos' | 'estudios' | 'urgencias' | 'optica'
type Copago = 'sin-copago' | 'con-copago' | null
type Situacion = 'particular' | 'monotributista' | 'relacion-dependencia'
interface Persona { id: number; edad: string }
interface Resultado {
  prepaga: Prepaga; plan: Plan; score: number; matchPct: number
  coberturasOk: CobId[]; precioGrupal: number; precioDesc: number
}

// ─── Zona → prepagas disponibles ─────────────────────────────────────────────

const ZONA_PREPAGAS: Record<string, string[]> = {
  'caba':          ['swiss-medical','osde','cemic','sancor-salud','premedic','medife','omint','medicus','avalian','prevencion-salud','hospital-italiano','hominis'],
  'buenos-aires':  ['swiss-medical','osde','cemic','sancor-salud','premedic','medife','omint','medicus','avalian','prevencion-salud','hospital-italiano','hominis'],
  'cordoba':       ['swiss-medical','osde','sancor-salud','premedic','medife','medicus','avalian','prevencion-salud','federada-salud'],
  'santa-fe':      ['swiss-medical','osde','sancor-salud','medife','medicus','avalian','prevencion-salud','federada-salud'],
  'entre-rios':    ['swiss-medical','osde','sancor-salud','avalian','prevencion-salud','federada-salud'],
  'mendoza':       ['swiss-medical','osde','sancor-salud','medicus','avalian','prevencion-salud'],
  'tucuman':       ['swiss-medical','osde','sancor-salud','premedic','avalian','prevencion-salud'],
  'salta':         ['swiss-medical','osde','sancor-salud','medife','prevencion-salud'],
  'jujuy':         ['swiss-medical','osde','sancor-salud','medife','prevencion-salud'],
  'neuquen':       ['swiss-medical','osde','sancor-salud','medicus','avalian','prevencion-salud'],
  'rio-negro':     ['swiss-medical','osde','sancor-salud','medicus'],
  'misiones':      ['osde','sancor-salud','prevencion-salud'],
  'corrientes':    ['osde','sancor-salud','prevencion-salud'],
  'chaco':         ['osde','sancor-salud','prevencion-salud'],
  'otras':         ['swiss-medical','osde','sancor-salud','medife','avalian','prevencion-salud'],
}

interface Provincia { slug: string; nombre: string; zonaKey: string }
const PROVINCIAS: Provincia[] = [
  { slug: 'caba',           nombre: 'CABA',                    zonaKey: 'caba' },
  { slug: 'buenos-aires',   nombre: 'Buenos Aires (GBA/Pcia)', zonaKey: 'buenos-aires' },
  { slug: 'cordoba',        nombre: 'Córdoba',                 zonaKey: 'cordoba' },
  { slug: 'santa-fe',       nombre: 'Santa Fe',                zonaKey: 'santa-fe' },
  { slug: 'mendoza',        nombre: 'Mendoza',                 zonaKey: 'mendoza' },
  { slug: 'tucuman',        nombre: 'Tucumán',                 zonaKey: 'tucuman' },
  { slug: 'entre-rios',     nombre: 'Entre Ríos',              zonaKey: 'entre-rios' },
  { slug: 'salta',          nombre: 'Salta',                   zonaKey: 'salta' },
  { slug: 'neuquen',        nombre: 'Neuquén',                 zonaKey: 'neuquen' },
  { slug: 'misiones',       nombre: 'Misiones',                zonaKey: 'misiones' },
  { slug: 'chaco',          nombre: 'Chaco',                   zonaKey: 'chaco' },
  { slug: 'corrientes',     nombre: 'Corrientes',              zonaKey: 'corrientes' },
  { slug: 'rio-negro',      nombre: 'Río Negro',               zonaKey: 'rio-negro' },
  { slug: 'jujuy',          nombre: 'Jujuy',                   zonaKey: 'jujuy' },
  { slug: 'santiago',       nombre: 'Santiago del Estero',     zonaKey: 'otras' },
  { slug: 'san-juan',       nombre: 'San Juan',                zonaKey: 'otras' },
  { slug: 'san-luis',       nombre: 'San Luis',                zonaKey: 'otras' },
  { slug: 'la-pampa',       nombre: 'La Pampa',                zonaKey: 'otras' },
  { slug: 'catamarca',      nombre: 'Catamarca',               zonaKey: 'otras' },
  { slug: 'la-rioja',       nombre: 'La Rioja',                zonaKey: 'otras' },
  { slug: 'chubut',         nombre: 'Chubut',                  zonaKey: 'otras' },
  { slug: 'formosa',        nombre: 'Formosa',                 zonaKey: 'otras' },
  { slug: 'santa-cruz',     nombre: 'Santa Cruz',              zonaKey: 'otras' },
  { slug: 'tierra-fuego',   nombre: 'Tierra del Fuego',        zonaKey: 'otras' },
]

// ─── Age multiplier (para precio por edad) ───────────────────────────────────

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

// ─── Coverage check ───────────────────────────────────────────────────────────

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

// ─── Algorithm ────────────────────────────────────────────────────────────────

function calcResultados(personas: Persona[], cobs: CobId[], copago: Copago, situacion: Situacion | null, zonaKey: string): Resultado[] {
  const slugsZona = ZONA_PREPAGAS[zonaKey] ?? ZONA_PREPAGAS['otras']
  const prepagasFiltradas = prepagas.filter((p) => slugsZona.includes(p.slug))
  const out: Resultado[] = []
  for (const prep of prepagasFiltradas) {
    for (const plan of prep.planes) {
      if (copago === 'sin-copago' && plan.copago) continue
      let score = 0
      const ok: CobId[] = []
      for (const c of cobs) {
        if (checkCob(c, plan, prep)) { score += 10; ok.push(c) }
      }
      score += (prep.satisfaccion / 100) * 8
      if (plan.redAbierta) score += 3
      if (!plan.copago) score += 2
      if (plan.destacado) score += 2
      const matchPct = cobs.length > 0 ? Math.min(100, Math.round((ok.length / cobs.length) * 100)) : 85
      // Precio base según modalidad: Relación de dependencia = sin IVA (Lista Deriva Aporte)
      const precioBase = situacion === 'relacion-dependencia' ? precioDeriva(plan.precio) : plan.precio
      const precioGrupal = calcGrupal(precioBase, personas)
      out.push({ prepaga: prep, plan, score, matchPct, coberturasOk: ok, precioGrupal, precioDesc: Math.round(precioGrupal * (1 - DESCUENTO_ONLINE)) })
    }
  }
  return out.sort((a, b) => b.score - a.score).slice(0, 5)
}

// ─── Coverage options ─────────────────────────────────────────────────────────

const COBS: { id: CobId; label: string; desc: string; letters: string; bg: string; text: string; bgHover: string }[] = [
  { id: 'psicologia',   label: 'Psicología',           desc: 'Sesiones sin límite por ley',         letters: 'PS', bg: 'bg-purple-100', text: 'text-purple-800', bgHover: 'group-hover:bg-purple-100 group-hover:text-purple-800' },
  { id: 'kinesiologia', label: 'Kinesiología',          desc: 'Rehabilitación y fisioterapia',        letters: 'KN', bg: 'bg-red-100',   text: 'text-red-800',   bgHover: 'group-hover:bg-red-100 group-hover:text-red-800' },
  { id: 'maternidad',   label: 'Maternidad',            desc: 'Embarazo, parto y neonatología',       letters: 'MA', bg: 'bg-pink-100',   text: 'text-pink-800',   bgHover: 'group-hover:bg-pink-100 group-hover:text-pink-800' },
  { id: 'internacion',  label: 'Internación y cirugía', desc: 'Internaciones y alta complejidad',     letters: 'IN', bg: 'bg-blue-100',   text: 'text-blue-800',   bgHover: 'group-hover:bg-blue-100 group-hover:text-blue-800' },
  { id: 'odontologia',  label: 'Odontología',           desc: 'Atención dental incluida',             letters: 'OD', bg: 'bg-cyan-100',   text: 'text-cyan-800',   bgHover: 'group-hover:bg-cyan-100 group-hover:text-cyan-800' },
  { id: 'medicamentos', label: 'Medicamentos',          desc: 'Descuentos en farmacia',               letters: 'RX', bg: 'bg-green-100',  text: 'text-green-800',  bgHover: 'group-hover:bg-green-100 group-hover:text-green-800' },
  { id: 'urgencias',    label: 'Urgencias 24hs',        desc: 'Guardia permanente',                   letters: 'UR', bg: 'bg-orange-100', text: 'text-orange-800', bgHover: 'group-hover:bg-orange-100 group-hover:text-orange-800' },
  { id: 'optica',       label: 'Óptica',                desc: 'Anteojos y lentes de contacto',        letters: 'OP', bg: 'bg-indigo-100', text: 'text-indigo-800', bgHover: 'group-hover:bg-indigo-100 group-hover:text-indigo-800' },
  { id: 'estudios',     label: 'Estudios complejos',    desc: 'Resonancias, tomografías',             letters: 'EC', bg: 'bg-slate-100',  text: 'text-slate-700',  bgHover: 'group-hover:bg-slate-100 group-hover:text-slate-700' },
]

// ─── Progress bar ─────────────────────────────────────────────────────────────

const STEPS_LABELS = ['Zona', 'Grupo', 'Edades', 'Situación', 'Coberturas', 'Datos']
const STEPS_ORDER: Step[] = ['zona', 'personas', 'edades', 'situacion', 'coberturas', 'datos']

function ProgressBar({ step }: { step: Step }) {
  const idx = STEPS_ORDER.indexOf(step)
  if (idx < 0) return null
  return (
    <div className="mb-10">
      <div className="flex items-center">
        {STEPS_LABELS.map((label, i) => (
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
            {i < STEPS_LABELS.length - 1 && (
              <div className={`flex-1 h-px mx-2 mb-4 transition-all duration-500 ${i < idx ? 'bg-[#00875A]' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

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

function NextBtn({ onClick, disabled = false, label = 'Siguiente →' }: { onClick?: () => void; disabled?: boolean; label?: string }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 bg-[#E8002D] hover:bg-[#B8001F] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all shadow-md hover:shadow-lg text-base">
      {label}
    </button>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ComparadorWizard() {
  const [step, setStep] = useState<Step>('zona')
  const [zonaKey, setZonaKey] = useState<string>('')
  const [provinciaNombre, setProvinciaNombre] = useState<string>('')
  const [numPersonas, setNumPersonas] = useState<number | null>(null)
  const [personas, setPersonas] = useState<Persona[]>([])
  const [situacion, setSituacion] = useState<Situacion | null>(null)
  const [sueldoBruto, setSueldoBruto] = useState('')
  const [coberturas, setCoberturas] = useState<CobId[]>([])
  const [copago, setCopago] = useState<Copago>(null)
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [celular, setCelular] = useState('')
  const [email, setEmail] = useState('')
  const [leadStatus, setLeadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [planAccedido, setPlanAccedido] = useState<string | null>(null)
  const [planAccedidoStatus, setPlanAccedidoStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<'relevancia' | 'precio-asc' | 'precio-desc' | 'satisfaccion'>('relevancia')

  const resultados = useMemo(() =>
    step === 'resultados' ? calcResultados(personas, coberturas, copago, situacion, zonaKey) : [],
    [step, personas, coberturas, copago, situacion, zonaKey]
  )

  // Helpers
  function pickZona(prov: Provincia) {
    setZonaKey(prov.zonaKey)
    setProvinciaNombre(prov.nombre)
    setStep('personas')
  }

  function pickPersonas(n: number) {
    setNumPersonas(n)
    setPersonas(Array.from({ length: n }, (_, i) => ({ id: i + 1, edad: '' })))
    setStep('edades')
  }

  function updateEdad(id: number, edad: string) {
    setPersonas((prev) => prev.map((p) => p.id === id ? { ...p, edad } : p))
  }

  function toggleCob(id: CobId) {
    setCoberturas((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id])
  }

  const edadesOk = personas.every((p) => p.edad !== '' && !isNaN(parseInt(p.edad)) && parseInt(p.edad) > 0 && parseInt(p.edad) < 110)
  const datosOk  = nombre.trim() && celular.trim() && email.trim()
  const sueldo   = parseInt(sueldoBruto.replace(/\D/g, '')) || 0
  const aporteOS = Math.round(sueldo * 0.09)

  // Email helpers
  function buildBasePayload() {
    return {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      celular: celular.trim(),
      reply_to: email.trim(),
      email: email.trim(),
      provincia: provinciaNombre,
      personas: `${numPersonas} persona${numPersonas !== 1 ? 's' : ''}${personas.length ? ' — edades: ' + personas.map(p => p.edad + ' años').join(', ') : ''}`,
      situacion: situacion === 'relacion-dependencia'
        ? `Relación de dependencia (sueldo bruto: $${sueldo.toLocaleString('es-AR')} → aporte OS: $${aporteOS.toLocaleString('es-AR')})`
        : situacion === 'monotributista' ? 'Monotributista' : 'Particular',
      coberturas: coberturas.map(c => COBS.find(o => o.id === c)?.label).filter(Boolean).join(', ') || 'Sin preferencia',
      copago_preferencia: copago === 'sin-copago' ? 'Sin copago' : copago === 'con-copago' ? 'Con copago' : 'Sin preferencia',
      fecha: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }),
    }
  }

  async function sendEmail(payload: Record<string, string>) {
    if (EJS_SERVICE && EJS_TEMPLATE && EJS_KEY) {
      await emailjs.send(EJS_SERVICE, EJS_TEMPLATE, payload, { publicKey: EJS_KEY })
      return true
    }
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return res.ok
  }

  async function handleCotizar() {
    if (!datosOk) return
    setLeadStatus('loading')
    const planesTexto = resultados.slice(0, 5).map((r, i) =>
      `${i + 1}. ${r.prepaga.nombre} — ${r.plan.nombre} | Precio: $${r.precioGrupal.toLocaleString('es-AR')}/mes | Con descuento: $${r.precioDesc.toLocaleString('es-AR')}/mes`
    ).join('\n')
    try {
      await sendEmail({
        ...buildBasePayload(),
        fuente: 'cotizacion-wizard',
        planes_mostrados: planesTexto,
        planes_recomendados: planesTexto,
        presupuesto: 'calculado por edad',
      })
      setLeadStatus('success')
      setStep('resultados')
    } catch {
      setLeadStatus('error')
    }
  }

  async function handleAccederPlan(r: Resultado) {
    const slug = `${r.prepaga.slug}-${r.plan.slug}`
    setPlanAccedido(slug)
    setPlanAccedidoStatus('loading')
    try {
      await sendEmail({
        ...buildBasePayload(),
        fuente: 'plan-accedido',
        plan_elegido: `${r.prepaga.nombre} — ${r.plan.nombre}`,
        precio_original: `$${r.precioGrupal.toLocaleString('es-AR')}/mes`,
        precio_con_descuento: `$${r.precioDesc.toLocaleString('es-AR')}/mes`,
        descuento_aplicado: `${DESCUENTO_ONLINE * 100}% OFF por 12 meses (online)`,
        planes_recomendados: `${r.prepaga.nombre} — ${r.plan.nombre}`,
        presupuesto: 'calculado por edad',
      })
      setPlanAccedidoStatus('success')
    } catch {
      setPlanAccedidoStatus('idle')
    }
  }

  // ── Step: Zona ───────────────────────────────────────────────────────────────
  if (step === 'zona') {
    return (
      <div>
        <ProgressBar step="zona" />
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Desde dónde buscás cobertura?</h2>
          <p className="text-sm text-gray-500">Las prepagas disponibles varían según tu provincia</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
          {PROVINCIAS.map((prov) => (
            <button
              key={prov.slug}
              onClick={() => pickZona(prov)}
              className="group flex items-center gap-2.5 px-4 py-3 bg-white border-2 border-gray-100 rounded-xl hover:border-[#E8002D] hover:bg-red-50 transition-all text-left"
            >
              <div className="w-7 h-7 bg-red-50 group-hover:bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-[#E8002D]">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-800 group-hover:text-[#E8002D] transition-colors leading-tight">
                {prov.nombre}
              </span>
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">Seleccioná tu provincia para continuar</p>
      </div>
    )
  }

  // ── Step: Personas ───────────────────────────────────────────────────────────
  if (step === 'personas') {
    return (
      <div>
        <ProgressBar step="personas" />
        <BackBtn onClick={() => setStep('zona')} />
        {provinciaNombre && (
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-[#E8002D] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
            {provinciaNombre}
          </div>
        )}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Para cuántas personas cotizamos?</h2>
          <p className="text-sm text-gray-500">El precio varía según la cantidad y edad de cada integrante</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button key={n} onClick={() => pickPersonas(n)}
              className="group flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-gray-100 bg-white hover:border-[#E8002D] hover:bg-red-50 hover:shadow-md transition-all duration-150 cursor-pointer">
              <span className="text-3xl font-bold text-gray-900 group-hover:text-[#E8002D] transition-colors leading-none">
                {n === 6 ? '6+' : n}
              </span>
              <span className="text-xs text-gray-400 mt-1 group-hover:text-[#E8002D] transition-colors">
                {n === 1 ? 'persona' : 'personas'}
              </span>
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400">Incluí a tu grupo familiar completo para una cotización precisa</p>
      </div>
    )
  }

  // ── Step: Edades ─────────────────────────────────────────────────────────────
  if (step === 'edades') {
    function addIntegrante() {
      if (personas.length >= 6) return
      const newId = Math.max(...personas.map((p) => p.id)) + 1
      setPersonas((prev) => [...prev, { id: newId, edad: '' }])
      setNumPersonas((prev) => (prev ?? 0) + 1)
    }

    function removeIntegrante(id: number) {
      if (personas.length <= 1) return
      setPersonas((prev) => prev.filter((p) => p.id !== id))
      setNumPersonas((prev) => (prev ?? 1) - 1)
    }

    return (
      <div>
        <ProgressBar step="edades" />
        <BackBtn onClick={() => setStep('personas')} />
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Cuántos años tiene cada integrante?</h2>
          <p className="text-sm text-gray-500">La edad determina el precio de cada integrante</p>
        </div>
        <div className="space-y-3 mb-4">
          {personas.map((p, i) => (
            <div key={p.id} className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 hover:border-red-200 transition-colors group">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[#E8002D]">{i + 1}</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-700">
                  {i === 0 ? 'Titular' : `Integrante ${i + 1}`}
                </div>
                <div className="text-xs text-gray-400">Ingresá la edad en años</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0} max={110}
                  value={p.edad}
                  onChange={(e) => updateEdad(p.id, e.target.value)}
                  placeholder="Ej: 35"
                  className="w-24 text-center text-lg font-bold border-2 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#E8002D] transition-colors"
                />
                <span className="text-sm text-gray-400 font-medium">años</span>
                {i > 0 && (
                  <button
                    onClick={() => removeIntegrante(p.id)}
                    className="ml-1 w-7 h-7 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 text-gray-400 flex items-center justify-center transition-colors text-lg font-bold leading-none"
                    title="Quitar integrante"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Botón agregar integrante */}
        {personas.length < 6 && (
          <button
            onClick={addIntegrante}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-400 hover:border-[#E8002D] hover:text-[#E8002D] hover:bg-red-50 transition-all mb-8"
          >
            <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-base leading-none">+</span>
            Agregar otro integrante
          </button>
        )}

        <div className="flex justify-end">
          <NextBtn onClick={() => setStep('situacion')} disabled={!edadesOk} />
        </div>
      </div>
    )
  }

  // ── Step: Situación laboral ───────────────────────────────────────────────────
  if (step === 'situacion') {
    // Precio estimado basado en las edades ingresadas
    const preciosPlanes = prepagas.flatMap((p) => p.planes.map((pl) => pl.precio))
    const precioMinBase = Math.min(...preciosPlanes)
    const precioMaxBase = Math.max(...preciosPlanes.filter((p) => p < 600000))
    const estimadoMin = calcGrupal(precioMinBase, personas)
    const estimadoMax = calcGrupal(precioMaxBase, personas)

    const situaciones: { id: Situacion; label: string; sub: string; letters: string; bg: string; text: string }[] = [
      { id: 'relacion-dependencia', label: 'Relación de dependencia', sub: 'Recibís recibo de sueldo',                 letters: 'RD', bg: 'bg-blue-100',  text: 'text-blue-800' },
      { id: 'monotributista',       label: 'Monotributista',          sub: 'Factura de manera independiente',           letters: 'MT', bg: 'bg-amber-100', text: 'text-amber-800' },
      { id: 'particular',           label: 'Particular',              sub: 'Sin relación de dependencia ni monotributo', letters: 'PA', bg: 'bg-green-100', text: 'text-green-800' },
    ]
    return (
      <div>
        <ProgressBar step="situacion" />
        <BackBtn onClick={() => setStep('edades')} />
        {/* Precio estimado basado en edad — primer valor inmediato */}
        <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-3.5 mb-6 flex items-center gap-3">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[#E8002D] flex-shrink-0">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
          <div className="text-sm text-red-800">
            Para tu perfil, los planes van de{' '}
            <strong>{formatPrecio(estimadoMin)}</strong>
            {' '}a{' '}
            <strong>{formatPrecio(estimadoMax)}/mes</strong>
            {' '}— precio exacto en el último paso.
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Cuál es tu situación laboral?</h2>
          <p className="text-sm text-gray-500">Esto afecta cuánto pagás de bolsillo por la prepaga</p>
        </div>
        <div className="space-y-3 mb-6">
          {situaciones.map((s) => (
            <button key={s.id} onClick={() => setSituacion(s.id)}
              className={`w-full group flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-150 text-left ${
                situacion === s.id
                  ? 'border-[#E8002D] bg-blue-50 shadow-sm'
                  : 'border-gray-100 bg-white hover:border-red-200 hover:bg-gray-50'
              }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-black tracking-tight transition-all ${
                situacion === s.id ? `${s.bg} ${s.text}` : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
              }`}>
                {s.letters}
              </div>
              <div className="flex-1">
                <div className={`font-semibold ${situacion === s.id ? 'text-[#E8002D]' : 'text-gray-900'}`}>{s.label}</div>
                <div className="text-sm text-gray-500">{s.sub}</div>
              </div>
              {situacion === s.id && (
                <div className="w-6 h-6 bg-[#E8002D] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 12 12" fill="white" className="w-3 h-3"><path fillRule="evenodd" d="M10.28 1.28L3.989 9.05 1.695 6.288a.75.75 0 00-1.14.976l2.939 3.425a.75.75 0 001.07.093l7-8.5a.75.75 0 00-1.284-.802z" clipRule="evenodd"/></svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Sueldo bruto (si relacion dependencia) */}
        {situacion === 'relacion-dependencia' && (
          <div className="bg-blue-50 rounded-2xl p-5 mb-6 border border-blue-100">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              ¿Cuál es tu sueldo bruto mensual? <span className="text-gray-500 font-normal">(opcional)</span>
            </label>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-500 font-semibold">$</span>
              <input
                type="text"
                value={sueldoBruto}
                onChange={(e) => setSueldoBruto(e.target.value.replace(/\D/g, ''))}
                placeholder="Ej: 500000"
                className="flex-1 border-2 border-blue-200 rounded-xl px-4 py-2.5 text-base font-semibold focus:outline-none focus:border-[#E8002D] bg-white transition-colors"
              />
            </div>
            {sueldo > 0 && (
              <div className="bg-white rounded-xl p-3 border border-blue-100 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Aporte total de obra social</span>
                  <span className="font-bold text-[#E8002D]">${aporteOS.toLocaleString('es-AR')}/mes</span>
                </div>
                <p className="text-xs text-gray-400">Tu empleador aporta el 6% y vos el 3% = 9% del bruto. Ese dinero financia tu prepaga y reduce lo que pagás de tu bolsillo.</p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <NextBtn onClick={() => setStep('coberturas')} disabled={!situacion} />
        </div>
      </div>
    )
  }

  // ── Step: Coberturas ─────────────────────────────────────────────────────────
  if (step === 'coberturas') {
    const selected = coberturas.length
    return (
      <div>
        <ProgressBar step="coberturas" />
        <BackBtn onClick={() => setStep('situacion')} />
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Qué priorizás en tu prepaga?</h2>
          <p className="text-sm text-gray-500">Marcá todo lo que necesitás · Podés elegir varios</p>
        </div>

        {/* Tipo de consulta */}
        <div className="mb-7">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-3">01 · Tipo de consulta</p>
          <div className="grid grid-cols-2 gap-3">
            {([
              { id: 'sin-copago' as Copago, label: 'Sin copago', sub: 'Consultas incluidas en la cuota',       letters: 'SIN', bg: 'bg-green-100', text: 'text-green-800' },
              { id: 'con-copago' as Copago, label: 'Con copago', sub: 'Pago algo por consulta, cuota menor',   letters: 'CON', bg: 'bg-amber-100', text: 'text-amber-800' },
            ] as { id: Copago; label: string; sub: string; letters: string; bg: string; text: string }[]).map((opt) => (
              <button key={String(opt.id)} onClick={() => setCopago((prev) => prev === opt.id ? null : opt.id)}
                className={`group relative text-left p-4 rounded-xl border-2 transition-all duration-150 ${
                  copago === opt.id ? 'border-[#E8002D] bg-blue-50 shadow-sm' : 'border-gray-100 bg-white hover:border-red-200 hover:bg-gray-50'
                }`}>
                {copago === opt.id && <span className="absolute top-3 right-3 w-4 h-4 bg-[#E8002D] rounded-full flex items-center justify-center"><svg viewBox="0 0 12 12" fill="white" className="w-2.5 h-2.5"><path fillRule="evenodd" d="M10.28 1.28L3.989 9.05 1.695 6.288a.75.75 0 00-1.14.976l2.939 3.425a.75.75 0 001.07.093l7-8.5a.75.75 0 00-1.284-.802z" clipRule="evenodd"/></svg></span>}
                <div className={`w-10 h-9 rounded-xl flex items-center justify-center mb-2.5 text-[11px] font-black tracking-tight transition-all ${copago === opt.id ? `${opt.bg} ${opt.text}` : 'bg-gray-100 text-gray-400'}`}>{opt.letters}</div>
                <div className={`font-semibold text-sm mb-0.5 ${copago === opt.id ? 'text-[#E8002D]' : 'text-gray-800'}`}>{opt.label}</div>
                <div className="text-xs text-gray-500 leading-snug">{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Coberturas */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">02 · Coberturas importantes</p>
            {selected > 0 && <span className="text-xs font-semibold text-[#E8002D] bg-blue-50 px-2.5 py-1 rounded-full">{selected} seleccionadas</span>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {COBS.map((opt) => {
              const on = coberturas.includes(opt.id)
              return (
                <button key={opt.id} onClick={() => toggleCob(opt.id)}
                  className={`group relative text-left p-4 rounded-xl border-2 transition-all duration-150 ${on ? 'border-[#E8002D] bg-blue-50 shadow-sm' : 'border-gray-100 bg-white hover:border-red-200 hover:bg-gray-50'}`}>
                  {on && <span className="absolute top-3 right-3 w-4 h-4 bg-[#E8002D] rounded-full flex items-center justify-center"><svg viewBox="0 0 12 12" fill="white" className="w-2.5 h-2.5"><path fillRule="evenodd" d="M10.28 1.28L3.989 9.05 1.695 6.288a.75.75 0 00-1.14.976l2.939 3.425a.75.75 0 001.07.093l7-8.5a.75.75 0 00-1.284-.802z" clipRule="evenodd"/></svg></span>}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 text-[11px] font-black tracking-tight transition-all ${on ? `${opt.bg} ${opt.text}` : `bg-gray-100 text-gray-400 ${opt.bgHover}`}`}>{opt.letters}</div>
                  <div className={`font-semibold text-sm mb-0.5 transition-colors ${on ? 'text-[#E8002D]' : 'text-gray-800'}`}>{opt.label}</div>
                  <div className="text-xs text-gray-500 leading-snug">{opt.desc}</div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <NextBtn onClick={() => setStep('datos')} label={selected > 0 ? `Continuar con ${selected} filtro${selected > 1 ? 's' : ''} →` : 'Continuar →'} />
        </div>
      </div>
    )
  }

  // ── Step: Datos de contacto ───────────────────────────────────────────────────
  if (step === 'datos') {
    return (
      <div>
        <ProgressBar step="datos" />
        <BackBtn onClick={() => setStep('coberturas')} />

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="#E8002D" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Casi listo!</h2>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">Ingresá tus datos para ver la cotización. Un asesor puede ayudarte a elegir sin costo.</p>
        </div>

        <div className="max-w-md mx-auto space-y-3 mb-6">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre *</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8002D] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Apellido</label>
              <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Tu apellido"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8002D] transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Celular *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className="w-4 h-4"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.18 6.18l1.28-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              </span>
              <input type="tel" value={celular} onChange={(e) => setCelular(e.target.value)} placeholder="11 2345-6789"
                className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#E8002D] transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Email *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className="w-4 h-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
              </span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com"
                className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#E8002D] transition-colors" />
            </div>
          </div>
        </div>

        {leadStatus === 'error' && (
          <p className="text-center text-red-500 text-xs mb-4">Hubo un problema. Intentá de nuevo.</p>
        )}

        <div className="flex justify-center mb-4">
          <button onClick={handleCotizar} disabled={!datosOk || leadStatus === 'loading'}
            className="inline-flex items-center gap-3 px-12 py-4 bg-[#00875A] hover:bg-[#006644] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl text-base">
            {leadStatus === 'loading' ? (
              <><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Calculando...</>
            ) : (
              <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-5 h-5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Ver mi cotización gratis</>
            )}
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className="w-3.5 h-3.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          Tu información es privada · No la compartimos con terceros
        </p>
      </div>
    )
  }

  // ── Step: Resultados ─────────────────────────────────────────────────────────
  const coberturasLabels = coberturas.map(c => COBS.find(o => o.id === c)?.label).filter(Boolean).join(' · ')
  const totalEdades = personas.map(p => `${p.edad} años`).join(', ')

  function toggleFilter(f: string) {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      next.has(f) ? next.delete(f) : next.add(f)
      return next
    })
  }

  const resultadosFiltrados = resultados
    .filter((r) => {
      if (activeFilters.has('sin-copago') && r.plan.copago) return false
      if (activeFilters.has('red-abierta') && !r.plan.redAbierta) return false
      if (activeFilters.has('odontologia') && !checkCob('odontologia', r.plan, r.prepaga)) return false
      if (activeFilters.has('menos-300k') && r.precioGrupal >= 300000) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'precio-asc')   return a.precioGrupal - b.precioGrupal
      if (sortBy === 'precio-desc')  return b.precioGrupal - a.precioGrupal
      if (sortBy === 'satisfaccion') return b.prepaga.satisfaccion - a.prepaga.satisfaccion
      return b.score - a.score
    })

  const FILTROS_OPCIONES = [
    { id: 'sin-copago',  label: 'Sin copago' },
    { id: 'red-abierta', label: 'Red abierta' },
    { id: 'odontologia', label: 'Con odontología' },
    { id: 'menos-300k',  label: 'Menos de $300k' },
  ]

  return (
    <div>
      {/* Summary header */}
      <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] rounded-2xl p-5 text-white mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="text-red-200 text-xs mb-1">Cotización para</div>
            <div className="font-bold text-lg">{nombre} {apellido}</div>
            <div className="text-red-200 text-sm mt-0.5">
              {numPersonas} persona{numPersonas !== 1 ? 's' : ''} · {totalEdades}
              {provinciaNombre ? ` · ${provinciaNombre}` : ''}
            </div>
          </div>
          <div className="bg-white/15 rounded-xl px-4 py-2.5 text-center">
            <div className="text-xs text-red-200 mb-0.5">Descuento online</div>
            <div className="text-2xl font-black">25% OFF</div>
            <div className="text-xs text-red-200">por 12 meses</div>
          </div>
        </div>
        {coberturasLabels && (
          <div className="mt-3 pt-3 border-t border-white/20 text-xs text-red-200">
            Prioridades: {coberturasLabels}
          </div>
        )}
        {/* Badge de modalidad de precio */}
        <div className="mt-3 pt-3 border-t border-white/20 flex items-center gap-2 text-xs">
          {situacion === 'relacion-dependencia' ? (
            <span className="bg-white/20 rounded-full px-3 py-1 text-white font-medium">
              Precios Lista Deriva Aporte — sin IVA ({Math.round(IVA_PREPAGA * 100)}% menos que directo)
            </span>
          ) : (
            <span className="bg-white/20 rounded-full px-3 py-1 text-white font-medium">
              Precios Directo con IVA (21%) · válido para monotributistas y particulares
            </span>
          )}
        </div>
      </div>

      {/* Filtros + ordenamiento */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex flex-wrap gap-2 flex-1">
          {FILTROS_OPCIONES.map((f) => {
            const on = activeFilters.has(f.id)
            return (
              <button key={f.id} onClick={() => toggleFilter(f.id)}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${
                  on ? 'bg-[#E8002D] text-white border-[#E8002D]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#E8002D] hover:text-[#E8002D]'
                }`}>
                {on ? '✓ ' : ''}{f.label}
              </button>
            )
          })}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="text-xs border border-gray-200 rounded-xl px-3 py-1.5 text-gray-600 focus:outline-none focus:border-[#E8002D] bg-white"
        >
          <option value="relevancia">Ordenar: Relevancia</option>
          <option value="precio-asc">Precio: menor primero</option>
          <option value="precio-desc">Precio: mayor primero</option>
          <option value="satisfaccion">Satisfacción</option>
        </select>
      </div>

      {resultadosFiltrados.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">
          Ningún plan cumple todos los filtros. Probá quitando alguno.
        </div>
      )}

      {/* Result cards */}
      <div className="space-y-5 mb-8">
        {resultadosFiltrados.map((res, i) => {
          const slug = `${res.prepaga.slug}-${res.plan.slug}`
          const isAccedido = planAccedido === slug
          const ahorroMensual = res.precioGrupal - res.precioDesc

          return (
            <div key={slug}
              className={`bg-white rounded-2xl border-2 overflow-hidden transition-all ${
                i === 0 ? 'border-[#E8002D] shadow-lg' : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
              }`}>

              {/* Top badge */}
              {i === 0 && (
                <div className="bg-[#E8002D] text-white text-xs font-bold px-4 py-2 flex items-center gap-2">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  Mejor opción para tu perfil · {res.matchPct}% de coincidencia
                </div>
              )}

              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <div className="font-bold text-gray-900 text-xl leading-tight">{res.prepaga.nombre}</div>
                    <div className="text-gray-500 text-sm font-medium mt-0.5">{res.plan.nombre}</div>
                    <div className="text-xs text-gray-400 mt-1">{res.plan.descripcion}</div>
                  </div>
                  {/* Pricing block */}
                  <div className="flex-shrink-0 text-right">
                    {/* Original price crossed out */}
                    <div className="text-sm text-gray-400 line-through tabular-nums">
                      {formatPrecio(res.precioGrupal)}/mes
                    </div>
                    {/* Discounted price */}
                    <div className="text-3xl font-black text-[#00875A] tabular-nums leading-tight">
                      {formatPrecio(res.precioDesc)}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">/mes · {numPersonas} persona{numPersonas !== 1 ? 's' : ''}</div>
                    {/* Saving badge */}
                    <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full mt-2 border border-emerald-200">
                      Ahorrás {formatPrecio(ahorroMensual)}/mes
                    </div>
                  </div>
                </div>

                {/* Discount banner */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-4 flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className="w-5 h-5 text-amber-600 flex-shrink-0"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                  <div>
                    <span className="text-xs font-bold text-amber-800">25% de descuento por contratar online</span>
                    <span className="text-xs text-amber-600 ml-1">· válido por 12 meses · precio sin descuento: {formatPrecio(res.precioGrupal)}/mes</span>
                  </div>
                </div>

                {/* Coberturas match */}
                {coberturas.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {coberturas.map((c) => {
                      const ok = checkCob(c, res.plan, res.prepaga)
                      const label = COBS.find((o) => o.id === c)?.label
                      return (
                        <span key={c} className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                          ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                             : 'bg-gray-50 text-gray-400 border border-gray-200 line-through'
                        }`}>
                          {ok ? '✓' : '✗'} {label}
                        </span>
                      )
                    })}
                  </div>
                )}

                {/* Plan details */}
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 pb-4 border-b border-gray-100 mb-4">
                  <span className={res.plan.copago ? '' : 'text-emerald-600 font-semibold'}>
                    {res.plan.copago ? '● Con copago' : '● Sin copago'}
                  </span>
                  <span>{res.plan.redAbierta ? '● Red abierta' : '● Red cerrada'}</span>
                  <span>● {res.prepaga.satisfaccion}% satisfacción</span>
                  <span>● {res.prepaga.profesionales.toLocaleString('es-AR')} profesionales</span>
                  <Link href={`/prepagas/${res.prepaga.slug}/${res.plan.slug}`} className="ml-auto text-[#E8002D] font-semibold hover:underline">
                    Ver detalles →
                  </Link>
                </div>

                {/* Si relación de dependencia: mostrá el costo de bolsillo */}
                {situacion === 'relacion-dependencia' && sueldo > 0 && (
                  <div className="bg-blue-50 rounded-xl p-3 mb-4 text-xs">
                    <div className="flex justify-between font-semibold text-gray-700 mb-1">
                      <span>Precio con descuento online</span>
                      <span>{formatPrecio(res.precioDesc)}/mes</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Menos tu aporte de OS</span>
                      <span className="text-emerald-600">− ${aporteOS.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="border-t border-blue-200 mt-2 pt-2 flex justify-between font-bold text-gray-900">
                      <span>Pagás de tu bolsillo</span>
                      <span className="text-[#E8002D]">${Math.max(0, res.precioDesc - aporteOS).toLocaleString('es-AR')}/mes</span>
                    </div>
                  </div>
                )}

                {/* CTA */}
                {isAccedido && planAccedidoStatus === 'success' ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                    <div className="text-emerald-700 font-bold mb-1 flex items-center justify-center gap-2">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    ¡Solicitud enviada!
                  </div>
                    <p className="text-xs text-emerald-600">Un asesor se va a contactar en las próximas horas para activar tu plan con el 25% de descuento.</p>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAccederPlan(res)}
                    disabled={isAccedido && planAccedidoStatus === 'loading'}
                    className="w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 bg-[#00875A] hover:bg-[#006644] text-white shadow-md hover:shadow-lg disabled:opacity-60">
                    {isAccedido && planAccedidoStatus === 'loading' ? (
                      <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Procesando...</>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-5 h-5"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                        Acceder a este plan con 25% OFF
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-center">
        <button onClick={() => { setStep('zona'); setZonaKey(''); setProvinciaNombre(''); setNumPersonas(null); setPersonas([]); setSituacion(null); setSueldoBruto(''); setCoberturas([]); setCopago(null); setNombre(''); setApellido(''); setCelular(''); setEmail(''); setLeadStatus('idle'); setPlanAccedido(null); setPlanAccedidoStatus('idle') }}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Hacer una nueva cotización
        </button>
      </div>
    </div>
  )
}
