'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { prepagas, nivelPrecio, type NivelPrecio } from '@/lib/data/prepagas'
import { provinciasSEO } from '@/lib/data/zonas'
import type { Plan, Prepaga } from '@/types'
import { formatPrecio, esCelularArgentinoValido, NIVEL_PRECIO_LABEL, PRIORIDAD_PARTNERS, DESTACADO_PARTNER, APORTE_DERIVABLE } from '@/lib/utils'
import { PROVINCIAS, type Provincia } from '@/lib/data/provincias-cotizador'
import { CartillaModal } from './CartillaModal'
import { PlanModal } from './PlanModal'
import { useChromeVisibility } from '@/components/layout/ChromeVisibility'
import { NivelPrecioBadge } from '@/components/ui/NivelPrecioBadge'
import { AsesoramientoPopup } from '@/components/ui/AsesoramientoPopup'
import { leerZonaGeoDeCookie } from '@/lib/geo-zonas'
import { OPCIONES_PREPAGA_ACTUAL } from '@/lib/data/sondeo'

// Descuento según cómo paga el usuario. Relación de dependencia combina el
// 15% general con una reducción adicional de 10,5 puntos (descuento sucesivo):
// la alícuota de IVA en salud es del 10,5%, no el 21% general. El 25% es solo
// para monotributistas; el resto, 15% en la mayoría de las prepagas (Darío,
// 23-sep-2026).
const DESCUENTO_POR_SITUACION: Record<SituacionLaboral, number> = {
  particular: 0.15,
  'relacion-dependencia': 1 - (1 - 0.15) * (1 - 0.105),
  monotributo: 0.25,
  'responsable-inscripto': 0.15,
}

// Aporte del trabajador en relación de dependencia: 7,5% del sueldo bruto,
// se descuenta directo de la cuota mostrada (APORTE_DERIVABLE, lib/utils).
const APORTE_PORCENTAJE = APORTE_DERIVABLE

// Precio "bloqueado": el número real sigue ahí (blureado, no reemplazado por
// texto falso), con un candado al lado — pedido de Darío, 21-sep-2026, para
// probar si ocultar el precio y forzar el paso de "Ver precio" mejora la
// calidad de los leads. El texto sigue siendo accesible para lectores de
// pantalla via aria-hidden en el span blureado + un texto alternativo.
function PrecioBloqueado({ texto, size = 'lg' }: { texto: React.ReactNode; size?: 'lg' | 'sm' }) {
  return (
    <span className="relative inline-flex items-center gap-1.5">
      <span aria-hidden className={`select-none blur-[5px] ${size === 'lg' ? 'text-xl font-black text-gray-900' : 'font-bold text-gray-900'}`}>
        {texto}
      </span>
      <svg viewBox="0 0 20 20" fill="currentColor" className={`${size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} text-gray-400 flex-shrink-0`}>
        <path fillRule="evenodd" d="M10 1a4 4 0 00-4 4v2H5a1 1 0 00-1 1v9a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1h-1V5a4 4 0 00-4-4zm2 6V5a2 2 0 10-4 0v2h4z" clipRule="evenodd" />
      </svg>
      <span className="sr-only">Precio disponible al cotizar</span>
    </span>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────

// "origen" (¿de qué prepaga venís?) dejó de ser un paso bloqueante — ahora es
// un filtro opcional dentro de resultados (ver "¿De qué prepaga venís?" más
// abajo), así se llega a precios reales en 2 pasos en vez de 3.
type Step = 'zona' | 'edades' | 'preview' | 'resultados'
type SituacionLaboral = 'particular' | 'relacion-dependencia' | 'monotributo' | 'responsable-inscripto'
type CobId = 'internacion' | 'psicologia' | 'kinesiologia' | 'maternidad' | 'odontologia' | 'medicamentos' | 'estudios' | 'urgencias' | 'optica' | 'reintegros' | 'ortodoncia' | 'cirugia-estetica'
type CaracteristicaId = 'red-abierta' | 'sanatorio-propio' | 'cobertura-nacional'
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
  'caba':         ['swiss-medical','osde','galeno','cemic','sancor-salud','premedic','medife','omint','medicus','avalian','prevencion-salud','hospital-italiano','hominis'],
  'buenos-aires': ['swiss-medical','osde','galeno','cemic','sancor-salud','premedic','medife','omint','medicus','avalian','prevencion-salud','hospital-italiano','hominis'],
  'cordoba':      ['swiss-medical','osde','galeno','sancor-salud','premedic','medife','medicus','avalian','prevencion-salud','federada-salud'],
  'santa-fe':     ['swiss-medical','osde','galeno','sancor-salud','medife','medicus','avalian','prevencion-salud','federada-salud'],
  'entre-rios':   ['swiss-medical','osde','sancor-salud','avalian','prevencion-salud','federada-salud'],
  'mendoza':      ['swiss-medical','osde','galeno','sancor-salud','medicus','avalian','prevencion-salud'],
  'tucuman':      ['swiss-medical','osde','galeno','sancor-salud','premedic','avalian','prevencion-salud'],
  'salta':        ['swiss-medical','osde','galeno','sancor-salud','medife','prevencion-salud'],
  'jujuy':        ['swiss-medical','osde','sancor-salud','medife','prevencion-salud'],
  'neuquen':      ['swiss-medical','osde','galeno','sancor-salud','medicus','avalian','prevencion-salud'],
  'rio-negro':    ['swiss-medical','osde','sancor-salud','medicus'],
  'misiones':     ['osde','sancor-salud','prevencion-salud'],
  'corrientes':   ['osde','sancor-salud','prevencion-salud'],
  'chaco':        ['osde','sancor-salud','prevencion-salud'],
  'otras':        ['swiss-medical','osde','galeno','sancor-salud','medife','avalian','prevencion-salud'],
}

// Las zonas con dataset SEO local verificado (lib/data/zonas.ts) pisan el
// mapping manual: fuente única para páginas de zona y cotizador.
for (const prov of provinciasSEO) {
  ZONA_PREPAGAS[prov.zonaKey] = prov.prepagas.filter((pz) => pz.enSitio).map((pz) => pz.slug)
}

// Interior de Buenos Aires (23-sep-2026): antes compartía lista con el GBA y
// el comparador le ofrecía a alguien de Tandil prepagas que no llegan ahí.
// Solo se sacan las que su cartilla oficial scrapeada confirma que no cubren
// el interior bonaerense (lib/data/cartilla-zonas): Premedic tiene zonas solo
// en CABA y GBA. Las que no tienen cartilla scrapeada no se sacan sin dato.
const SIN_COBERTURA_INTERIOR_BA = ['premedic']
const ZONAS_AMBA = ['caba', 'buenos-aires']
const INTERIOR_PARTNERS = ['avalian', 'sancor-salud']
// Con el orden por relevancia se muestran primero estos planes recomendados;
// el resto queda detrás de "Ver más planes" (demasiadas opciones frenan la
// decisión).
const RECOMENDADOS_VISIBLES = 4
ZONA_PREPAGAS['buenos-aires-interior'] = ZONA_PREPAGAS['buenos-aires'].filter((s) => !SIN_COBERTURA_INTERIOR_BA.includes(s))

// Lista de provincias del cotizador: vive en lib/data/provincias-cotizador.ts
// (la usan también las herramientas sin cargar este componente entero).
export { PROVINCIAS, type Provincia } from '@/lib/data/provincias-cotizador'

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

// La cobertura se evalúa A NIVEL PLAN (no prepaga): un filtro solo muestra los
// planes cuyo detalle de cobertura la incluye explícitamente. Urgencias y
// medicamentos mantienen fallback a nivel prepaga por ser coberturas universales.
function checkCob(id: CobId, plan: Plan, p: Prepaga): boolean {
  const t = plan.cobertura.join(' ').toLowerCase()
  const porKeyword = COB_MAP[id].keywords.some((k) => t.includes(k))
  // Obligatorias por PMO en todos los planes (salud mental, Plan Materno
  // Infantil, internación): si la ficha del plan no las nombra, igual están
  // incluidas. Antes salían "No incluida" y el filtro descartaba el plan.
  if (id === 'psicologia' || id === 'maternidad' || id === 'internacion') return true
  if (id === 'medicamentos') return porKeyword || p.caracteristicas.farmacia
  if (id === 'urgencias')    return porKeyword || p.caracteristicas.atencion24hs
  if (id === 'estudios')     return porKeyword || !plan.copago
  return porKeyword
}

// Detalle de una cobertura para un plan: usa el texto real de plan.cobertura
// (p. ej. "Psicología 30 sesiones sin cargo") y cae al texto genérico cuando
// el plan solo lista la categoría a secas.
function detalleCob(id: CobId, plan: Plan): string {
  const cob = COB_MAP[id]
  const matches = plan.cobertura
    .filter((c) => {
      const t = c.toLowerCase()
      return cob.keywords.some((k) => t.includes(k))
    })
    .map((c) => c.replace(new RegExp(`^${cob.label}\\s*`, 'i'), '').trim())
    .filter((c) => c.length > 0)
  return matches.length ? matches.join(' · ') : cob.generico
}

// Orden "mechado" del ranking por relevancia: arriba va el mejor plan de cada
// partner prioritario en orden (Swiss Medical, Avalian, Premedic, Sancor Salud
// — pedido de Darío, 22-sep-2026; si alguno no está en la zona se saltea); del
// resto en adelante se intercalan marcas (nunca dos cards seguidas de la misma
// prepaga mientras haya alternativa). Los ordenamientos por precio no se alteran.

// Orden del filtro de prepaga (sidebar/bottom sheet): Swiss Medical y OSDE
// siempre arriba (pedido de Darío, 17-sep-2026), el resto alfabético debajo.
const ORDEN_PREPAGA_FILTRO = ['swiss-medical', 'osde']

function mecharResultados(sorted: Resultado[]): Resultado[] {
  const pool = [...sorted]
  const out: Resultado[] = []
  const take = (pred: (r: Resultado) => boolean) => {
    const i = pool.findIndex(pred)
    if (i >= 0) out.push(...pool.splice(i, 1))
  }
  for (const slug of PRIORIDAD_PARTNERS) {
    if (slug === 'premedic') {
      // "Mejor plan económico": el plan de Premedic más barato para el grupo
      const cand = pool.filter((r) => r.prepaga.slug === slug)
      if (cand.length) {
        const barato = cand.reduce((m, r) => (r.precioGrupal < m.precioGrupal ? r : m))
        take((r) => r === barato)
      }
    } else if ((slug === 'avalian' || slug === 'sancor-salud') && out[0]) {
      // Plan comparable al primero (el de Swiss): el de precio más cercano,
      // para no mostrar un AS400 de $780.000 al lado de un SMG20 (23-sep-2026).
      const ref = out[0].precioGrupal
      const cand = pool.filter((r) => r.prepaga.slug === slug)
      if (cand.length) {
        const cercano = cand.reduce((m, r) => (Math.abs(r.precioGrupal - ref) < Math.abs(m.precioGrupal - ref) ? r : m))
        take((r) => r === cercano)
      }
    } else take((r) => r.prepaga.slug === slug)
  }
  while (pool.length) {
    const prev = out[out.length - 1]?.prepaga.slug
    const i = pool.findIndex((r) => r.prepaga.slug !== prev)
    out.push(...pool.splice(Math.max(i, 0), 1))
  }
  return out
}

// `oficiales`: precio de lista del grupo por plan según el cuadro tarifario
// SSSalud ({"prepaga/plan": total}, de /api/precios — escala etaria propia de
// cada prepaga). Los planes sin cuadro oficial siguen con la estimación por
// multiplicadores de calcGrupal (23-sep-2026).
function calcResultados(personas: Persona[], zonaKey: string, descuento: number, oficiales: Record<string, number>): Resultado[] {
  const slugsZona = ZONA_PREPAGAS[zonaKey] ?? ZONA_PREPAGAS['otras']
  const prepagasFiltradas = prepagas.filter((p) => slugsZona.includes(p.slug))
  const out: Resultado[] = []
  // Planes con edad acotada (Sancor GEN 18-45, Avalian Plan Hoy 18-35): se
  // toma la persona de mayor edad del grupo como referencia del titular.
  const edadMayor = Math.max(0, ...personas.map((p) => parseInt(p.edad) || 0))
  for (const prep of prepagasFiltradas) {
    for (const plan of prep.planes) {
      if (plan.edadMaxima && edadMayor > plan.edadMaxima) continue
      if (plan.edadMinima && edadMayor < plan.edadMinima) continue
      let score = (prep.satisfaccion / 100) * 8
      if (plan.redAbierta) score += 3
      if (!plan.copago) score += 2
      if (plan.destacado) score += 3
      const precioGrupal = oficiales[`${prep.slug}/${plan.slug}`] ?? calcGrupal(plan.precio, personas)
      out.push({ prepaga: prep, plan, score, precioGrupal, precioDesc: Math.round(precioGrupal * (1 - descuento)) })
    }
  }
  return mecharResultados(out.sort((a, b) => b.score - a.score))
}

// ─── Coverage filter options ──────────────────────────────────────────────────

interface CobDef {
  id: CobId
  label: string
  keywords: string[]
  // Texto que se muestra cuando el plan incluye la cobertura pero su data no
  // especifica detalle (solo lista la categoría). Debe ser válido para
  // cualquier plan: describe el piso PMO / lo universal, no beneficios premium.
  generico: string
}

const COBS: CobDef[] = [
  { id: 'psicologia',       label: 'Psicología',        keywords: ['psic', 'salud mental'],                          generico: 'atención psicológica incluida (mínimo 30 sesiones anuales por PMO)' },
  { id: 'maternidad',       label: 'Maternidad',        keywords: ['matern'],                                        generico: 'cobertura de embarazo, parto e internación para mamá y bebé' },
  { id: 'odontologia',      label: 'Odontología',       keywords: ['odont', 'dental'],                               generico: 'consultas y tratamientos odontológicos incluidos' },
  { id: 'ortodoncia',       label: 'Ortodoncia',        keywords: ['ortodoncia'],                                    generico: 'cobertura de ortodoncia incluida' },
  { id: 'reintegros',       label: 'Reintegros',        keywords: ['reintegro'],                                     generico: 'reintegros por atención fuera de cartilla' },
  { id: 'cirugia-estetica', label: 'Cirugía estética',  keywords: ['estétic', 'estetic', 'plástic', 'plastic'],      generico: 'cirugía estética incluida en el plan' },
  { id: 'internacion',      label: 'Internación',       keywords: ['internaci'],                                     generico: 'internación clínica y quirúrgica cubierta' },
  { id: 'medicamentos',     label: 'Medicamentos',      keywords: ['farmacia', 'medicament'],                        generico: 'descuento en medicamentos en farmacias adheridas' },
  { id: 'urgencias',        label: 'Urgencias 24hs',    keywords: ['urgencia', 'emergencia', 'guardia'],             generico: 'urgencias y emergencias cubiertas las 24 horas' },
  { id: 'optica',           label: 'Óptica',            keywords: ['optica', 'óptica'],                              generico: 'anteojos y lentes con cobertura' },
  { id: 'kinesiologia',     label: 'Kinesiología',      keywords: ['kinesio', 'rehabilit', 'fisioterap'],            generico: 'sesiones de kinesiología y rehabilitación incluidas' },
  { id: 'estudios',         label: 'Estudios complejos', keywords: ['complejidad', 'laborator', 'estudio'],          generico: 'estudios de laboratorio y alta complejidad cubiertos' },
]

const COB_MAP = Object.fromEntries(COBS.map((c) => [c.id, c])) as Record<CobId, CobDef>

// Coberturas con página propia en /coberturas/[slug]: al activar el filtro,
// se muestra un link directo a la comparativa a fondo de esa prestación.
const COB_GUIA: Partial<Record<CobId, string>> = {
  ortodoncia: 'ortodoncia',
  'cirugia-estetica': 'cirugia-estetica',
}

// ─── Características (atributos de plan/prepaga, como los filtros de
// "envío gratis" o "con garantía" en un e-commerce) — todos calculados a
// partir de datos reales ya existentes en lib/data/prepagas.ts, ninguno
// inventado para esta grilla de filtros. ────────────────────────────────────
interface CaracteristicaDef { id: CaracteristicaId; label: string; check: (plan: Plan, p: Prepaga) => boolean }

const CARACTERISTICAS: CaracteristicaDef[] = [
  { id: 'sanatorio-propio',   label: 'Con sanatorio propio', check: (_plan, p) => p.sanatoriosPropios > 0 },
  { id: 'red-abierta',        label: 'Red abierta',          check: (plan) => plan.redAbierta },
  { id: 'cobertura-nacional', label: 'Cobertura nacional',   check: (_plan, p) => p.caracteristicas.coberturaNacional },
]

function checkCaracteristica(id: CaracteristicaId, plan: Plan, p: Prepaga): boolean {
  const def = CARACTERISTICAS.find((c) => c.id === id)
  return def ? def.check(plan, p) : true
}

// ─── Situación laboral (define descuento + aporte) ─────────────────────────────

interface SituacionDef {
  id: SituacionLaboral
  label: string
  desc: string
  badge: string
}

const SITUACIONES: SituacionDef[] = [
  { id: 'particular',             label: 'Particular',              desc: 'Pagás la cuota completa de tu bolsillo', badge: '15% OFF' },
  { id: 'relacion-dependencia',   label: 'Relación de dependencia', desc: 'Tenés recibo de sueldo — te descontamos el aporte', badge: 'Hasta 24% OFF + aporte' },
  { id: 'monotributo',            label: 'Monotributista',          desc: 'Facturás como monotributista', badge: '25% OFF' },
  { id: 'responsable-inscripto',  label: 'Responsable Inscripto',   desc: 'Facturás con IVA discriminado', badge: '15% OFF' },
]

// ─── Progress bar (3 steps) ───────────────────────────────────────────────────

const STEP_LABELS = ['Zona', 'Integrantes', 'Ver precios']
const STEP_ORDER: Step[] = ['zona', 'edades', 'preview']

function ProgressBar({ step, onStepClick }: { step: Step; onStepClick?: (step: Step) => void }) {
  const idx = STEP_ORDER.indexOf(step)
  if (idx < 0) return null
  return (
    <div className="mb-10">
      <div className="flex items-center">
        {STEP_LABELS.map((label, i) => {
          const clickable = i < idx && Boolean(onStepClick)
          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick?.(STEP_ORDER[i])}
                className={`flex flex-col items-center gap-1 ${clickable ? 'cursor-pointer group' : 'cursor-default'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  i < idx  ? `bg-[#00875A] text-white ${clickable ? 'group-hover:ring-4 group-hover:ring-green-100' : ''}` :
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
                  i === idx ? 'text-[#E8002D]' : i < idx ? `text-[#00875A] ${clickable ? 'group-hover:underline' : ''}` : 'text-gray-400'
                }`}>{label}</span>
              </button>
              {i < STEP_LABELS.length - 1 && (
                <div className={`flex-1 h-px mx-2 mb-4 transition-all duration-500 ${i < idx ? 'bg-[#00875A]' : 'bg-gray-200'}`} />
              )}
            </div>
          )
        })}
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

function ZonaStep({ onSelect, zonaSugerida }: { onSelect: (p: Provincia) => void; zonaSugerida?: { provincia: Provincia; label: string } | null }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Provincia | null>(null)
  const [sugerenciaDescartada, setSugerenciaDescartada] = useState(false)
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

      {zonaSugerida && !sugerenciaDescartada && !selected && (
        <div className="max-w-sm mx-auto mb-4 bg-red-50 border-2 border-red-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[#E8002D] flex-shrink-0 mt-0.5">
              <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
            </svg>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-700">Detectamos que estás en <strong className="text-gray-900">{zonaSugerida.label}</strong></div>
              <button onClick={() => setSugerenciaDescartada(true)} className="text-xs text-gray-400 hover:text-gray-600 underline mt-0.5">
                No es correcto, elegir otra zona
              </button>
            </div>
          </div>
          <button
            onClick={() => handleSelect(zonaSugerida.provincia)}
            className="w-full sm:w-auto flex-shrink-0 px-4 py-2.5 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm transition-colors whitespace-nowrap"
          >
            Sí, continuar →
          </button>
        </div>
      )}

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

// ─── SituacionFiltro (radio-list, vive en el panel de filtros) ────────────────
// Mismo patrón visual que el resto de los filtros (radio/checkbox + label +
// dato a la derecha): "Particular" queda tildado por default, y sólo
// "Relación de dependencia" abre un campo extra para el sueldo bruto — el
// resto (Monotributista, Responsable Inscripto) se ve exactamente igual que
// "Particular", solo con su % de descuento (pedido de Darío, 20-sep-2026).

function SituacionFiltro({ situacion, setSituacion, sueldoBruto, setSueldoBruto }: {
  situacion: SituacionLaboral
  setSituacion: (s: SituacionLaboral) => void
  sueldoBruto: string
  setSueldoBruto: (v: string) => void
}) {
  const bruto = parseFloat(sueldoBruto) || 0
  const aportePreview = Math.round(bruto * APORTE_PORCENTAJE)

  return (
    <div className="space-y-2.5">
      {SITUACIONES.map((s) => {
        const on = situacion === s.id
        return (
          <div key={s.id}>
            <label className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setSituacion(s.id)}>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                on ? 'border-[#E8002D]' : 'border-gray-300 group-hover:border-[#E8002D]'
              }`}>
                {on && <div className="w-2 h-2 rounded-full bg-[#E8002D]" />}
              </div>
              <span className={`text-sm font-medium transition-colors flex-1 ${on ? 'text-[#E8002D]' : 'text-gray-600 group-hover:text-gray-900'}`}>{s.label}</span>
              <span className="text-[9px] font-bold text-[#00875A] bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full flex-shrink-0 text-right leading-tight">{s.badge}</span>
            </label>

            {s.id === 'relacion-dependencia' && on && (
              <div className="mt-2 ml-[26px]">
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">$</span>
                  <input
                    type="text" inputMode="numeric"
                    value={sueldoBruto ? Number(sueldoBruto).toLocaleString('es-AR') : ''}
                    onChange={(e) => setSueldoBruto(e.target.value.replace(/\D/g, ''))}
                    placeholder="Sueldo bruto"
                    className="w-full border-2 border-gray-200 rounded-lg pl-6 pr-2 py-1.5 text-xs font-bold focus:outline-none focus:border-[#E8002D] transition-colors"
                  />
                </div>
                {bruto > 0 ? (
                  <p className="text-[10px] text-gray-500 mt-1.5 leading-snug">
                    Aporte: <span className="font-bold text-[#E8002D]">{formatPrecio(aportePreview)}/mes</span> — ya descontado abajo.
                  </p>
                ) : (
                  <p className="text-[10px] text-gray-400 mt-1.5 leading-snug">Para descontar el aporte de la cuota.</p>
                )}
              </div>
            )}
          </div>
        )
      })}
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
  // Modo de prueba para Darío: entrando con ?testing=dario se salta el
  // popup de nombre/celular/mail y no se manda el lead — para poder probar
  // el wizard las veces que haga falta sin gastar cupo de EmailJS ni
  // mandarse un mail real cada vez (pedido de Darío, 17-sep-2026).
  // Se lee con window.location en un useEffect (no useSearchParams) porque
  // ComparadorWizard también vive en la home, que es 100% estática —
  // useSearchParams hubiera forzado esa página a Suspense/dinámica.
  const [modoPrueba, setModoPrueba] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const prueba = params.get('testing') === 'dario'
    setModoPrueba(prueba)
    // Modo prueba con edades por URL (?testing=dario&zona=caba&provincia=CABA&edades=35,33):
    // va directo a resultados, sin popup y sin mandar lead (Darío, 23-sep-2026).
    const edades = (params.get('edades') ?? '').split(',').map((e) => parseInt(e)).filter((n) => n > 0 && n < 110)
    if (prueba && edades.length && initialZona) {
      setPersonas(edades.map((edad, i) => ({ id: i + 1, edad: String(edad) })))
      setStep('preview')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [step, setStep] = useState<Step>(initialZona ? 'edades' : 'zona')
  const [zonaKey, setZonaKey] = useState(initialZona ?? '')
  const [provinciaNombre, setProvinciaNombre] = useState(initialProvincia ?? '')

  // Zona sugerida por geolocalización de IP (cookie que deja middleware.ts).
  // Solo se usa para precargar el paso "zona" — nunca lo salta, el usuario
  // siempre confirma o cambia con un tap. `label` es el texto detallado para
  // mostrar ("Banfield (GBA Sur)"); `provincia` mantiene el nombre real de
  // PROVINCIAS para no romper el resto del wizard, que espera ese formato.
  const [zonaSugerida, setZonaSugerida] = useState<{ provincia: Provincia; label: string } | null>(null)
  useEffect(() => {
    if (initialZona) return
    const geo = leerZonaGeoDeCookie()
    if (!geo) return
    // El geo distingue interior bonaerense solo en el label (wizardSlug es
    // 'buenos-aires' para toda la provincia): se mapea acá a la opción propia.
    const slug = geo.wizardSlug === 'buenos-aires' && geo.label.includes('Interior de Buenos Aires') ? 'buenos-aires-interior' : geo.wizardSlug
    const prov = PROVINCIAS.find((p) => p.slug === slug)
    if (prov) setZonaSugerida({ provincia: prov, label: geo.label })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [personas, setPersonas] = useState<Persona[]>([{ id: 1, edad: '' }])

  // Precios oficiales del grupo (motor de precios, /api/precios): se piden al
  // llegar a preview/resultados y cada vez que cambian edades o zona.
  const [preciosOficiales, setPreciosOficiales] = useState<Record<string, number>>({})
  const edadesClave = personas.map((p) => parseInt(p.edad)).filter((n) => Number.isFinite(n)).join(',')
  useEffect(() => {
    if (!zonaKey || !edadesClave) return
    let cancelado = false
    fetch('/api/precios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zona: zonaKey, edades: edadesClave.split(',').map(Number) }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (!cancelado && data?.precios) setPreciosOficiales(data.precios) })
      .catch(() => {})
    return () => { cancelado = true }
  }, [zonaKey, edadesClave])

  // Grupo familiar: se puede editar durante el paso "edades" y también desde
  // el panel de resultados (agregar/sacar integrantes recalcula el precio
  // grupal en el momento, sin volver atrás en el wizard).
  function addPersona() {
    setPersonas(prev => {
      if (prev.length >= 6) return prev
      const newId = Math.max(...prev.map(p => p.id)) + 1
      return [...prev, { id: newId, edad: '' }]
    })
  }
  function removePersona(id: number) {
    setPersonas(prev => prev.length <= 1 ? prev : prev.filter(p => p.id !== id))
  }
  function updateEdad(id: number, edad: string) {
    setPersonas(prev => prev.map(p => p.id === id ? { ...p, edad } : p))
  }
  const [editandoGrupo, setEditandoGrupo] = useState(false)

  // Modo enfocado: apenas se elige la zona y se avanza, se oculta el
  // header/footer/bottom-nav para que la cotización no tenga forma de
  // distraerse ni salir del flujo a mitad de camino.
  const { setHideChrome } = useChromeVisibility()
  useEffect(() => {
    setHideChrome(step !== 'zona')
  }, [step, setHideChrome])
  useEffect(() => () => setHideChrome(false), [setHideChrome])

  // Situación laboral: se elige recién en resultados (ya con el lead
  // capturado). "Particular" es el default hasta que el usuario la cambie.
  const [situacion, setSituacion] = useState<SituacionLaboral>('particular')
  const [sueldoBruto, setSueldoBruto] = useState('')
  const descuentoRate = DESCUENTO_POR_SITUACION[situacion]
  const aporteMensual = useMemo(() => {
    if (situacion !== 'relacion-dependencia') return 0
    return Math.round((parseFloat(sueldoBruto) || 0) * APORTE_PORCENTAJE)
  }, [situacion, sueldoBruto])
  const precioFinal = (precioDesc: number) => Math.max(0, precioDesc - aporteMensual)

  // Lead data
  const [nombre, setNombre] = useState('')
  const [celular, setCelular] = useState('')
  const [email, setEmail] = useState('')
  const [leadStatus, setLeadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  // Preview countdown
  const [countdown, setCountdown] = useState(3)
  const [showPopup, setShowPopup] = useState(false)

  // Results filters
  const [activeCobs, setActiveCobs] = useState<Set<CobId>>(new Set())
  const [copago, setCopago] = useState<Copago>(null)

  // Datos que la persona completa DESPUÉS de dejar el lead (24-sep-2026):
  // situación laboral (solo si la cambió: "Particular" es el default y no
  // dice nada), qué cobertura tiene hoy y qué coberturas filtra. Se suman a
  // su mismo lead (/api/leads/complemento) para el panel y el sondeo anónimo.
  // No hay ninguna pregunta nueva antes del formulario.
  const [situacionTocada, setSituacionTocada] = useState(false)
  const [prepagaActual, setPrepagaActual] = useState('')
  const elegirSituacion = (s: SituacionLaboral) => { setSituacion(s); setSituacionTocada(true) }
  useEffect(() => {
    if (leadStatus !== 'success') return
    const coberturasTxt = [...activeCobs].map((c) => COB_MAP[c]?.label).filter(Boolean).join(', ')
    const copagoTxt = copago === 'sin-copago' ? 'Sin copago' : copago === 'con-copago' ? 'Con copago' : ''
    if (!situacionTocada && !prepagaActual && !coberturasTxt && !copagoTxt) return
    const t = setTimeout(() => {
      fetch('/api/leads/complemento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          celular: celular.trim(),
          situacion_laboral: situacionTocada ? SITUACIONES.find((s) => s.id === situacion)?.label : '',
          prepaga_actual: prepagaActual,
          preferencias: JSON.stringify({ coberturas: coberturasTxt, copago: copagoTxt }),
        }),
      }).catch(() => {})
    }, 1500)
    return () => clearTimeout(t)
  }, [leadStatus, situacion, situacionTocada, prepagaActual, activeCobs, copago, email, celular])
  const [activePrepagas, setActivePrepagas] = useState<Set<string>>(new Set())
  const [activeNivelPrecio, setActiveNivelPrecio] = useState<Set<NivelPrecio>>(new Set())
  const [activeCaracteristicas, setActiveCaracteristicas] = useState<Set<CaracteristicaId>>(new Set())
  const [sortBy, setSortBy] = useState<'relevancia' | 'precio-asc' | 'precio-desc'>('relevancia')
  const [verTodos, setVerTodos] = useState(false)
  const [filtrosMenuOpen, setFiltrosMenuOpen] = useState(false)
  const [asesoramientoUrgenteOpen, setAsesoramientoUrgenteOpen] = useState(false)

  // Plan access
  const [planAccedido, setPlanAccedido] = useState<string | null>(null)
  const [planAccedidoStatus, setPlanAccedidoStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  // Popup de cartilla
  const [cartillaAbierta, setCartillaAbierta] = useState<Resultado | null>(null)
  const [planAbierto, setPlanAbierto] = useState<Resultado | null>(null)

  // Comparar hasta 3 planes lado a lado
  const [comparando, setComparando] = useState<Set<string>>(new Set())
  const [tablaComparativa, setTablaComparativa] = useState(false)
  function toggleComparar(planKey: string) {
    setComparando((prev) => {
      const next = new Set(prev)
      if (next.has(planKey)) next.delete(planKey)
      else if (next.size < 3) next.add(planKey)
      return next
    })
  }

  const allResultados = useMemo(() =>
    (step === 'resultados' || step === 'preview') ? calcResultados(personas, zonaKey, descuentoRate, preciosOficiales) : [],
    [step, personas, zonaKey, descuentoRate, preciosOficiales]
  )

  // Prepagas presentes en los resultados de esta zona — la lista del filtro
  // se arma sola a partir de acá, así nunca queda desactualizada ni hardcodeada
  // a "7 prepagas": si mañana sumamos o sacamos una prepaga de una zona, el
  // filtro se ajusta solo.
  const prepagasDisponibles = useMemo(() => {
    const vistos = new Set<string>()
    const out: Prepaga[] = []
    for (const r of allResultados) {
      if (!vistos.has(r.prepaga.slug)) { vistos.add(r.prepaga.slug); out.push(r.prepaga) }
    }
    return out.sort((a, b) => {
      const ia = ORDEN_PREPAGA_FILTRO.indexOf(a.slug)
      const ib = ORDEN_PREPAGA_FILTRO.indexOf(b.slug)
      if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
      return a.nombre.localeCompare(b.nombre, 'es')
    })
  }, [allResultados])

  function togglePrepaga(slug: string) {
    setActivePrepagas((prev) => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      return next
    })
  }

  // Selección "una sola por vez" para el bottom sheet mobile (pedido de Darío,
  // 17-sep-2026: en el celular no quiere marcar checkboxes en una lista larga,
  // sino tocar una prepaga y que quede solo esa — tocar la misma de nuevo
  // vuelve a mostrar todas). El sidebar de desktop sigue siendo multi-select
  // (togglePrepaga), esto es exclusivo del flujo mobile.
  function selectSoloPrepaga(slug: string) {
    setActivePrepagas((prev) => (prev.size === 1 && prev.has(slug) ? new Set() : new Set([slug])))
  }

  function toggleNivelPrecio(n: NivelPrecio) {
    setActiveNivelPrecio((prev) => {
      const next = new Set(prev)
      next.has(n) ? next.delete(n) : next.add(n)
      return next
    })
  }

  function toggleCaracteristica(id: CaracteristicaId) {
    setActiveCaracteristicas((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function limpiarFiltros() {
    setActiveCobs(new Set())
    setCopago(null)
    setActivePrepagas(new Set())
    setActiveNivelPrecio(new Set())
    setActiveCaracteristicas(new Set())
  }

  // Predicado único de filtrado — se reutiliza tal cual para calcular los
  // resultados finales Y, por separado, el conteo en vivo de cada opción de
  // filtro (facetado tipo e-commerce: "excluir" es el propio grupo de filtro
  // que se está contando, para que la cifra muestre "si sumás esta opción").
  type GrupoFiltro = 'copago' | 'prepaga' | 'cobertura' | 'precio' | 'caracteristicas'
  function pasaFiltros(r: Resultado, excluir?: GrupoFiltro): boolean {
    if (excluir !== 'copago') {
      if (copago === 'sin-copago' && r.plan.copago) return false
      if (copago === 'con-copago' && !r.plan.copago) return false
    }
    if (excluir !== 'prepaga' && activePrepagas.size > 0 && !activePrepagas.has(r.prepaga.slug)) return false
    if (excluir !== 'cobertura') {
      for (const c of activeCobs) if (!checkCob(c, r.plan, r.prepaga)) return false
    }
    if (excluir !== 'precio' && activeNivelPrecio.size > 0 && !activeNivelPrecio.has(nivelPrecio(r.plan.precio))) return false
    if (excluir !== 'caracteristicas') {
      for (const c of activeCaracteristicas) if (!checkCaracteristica(c, r.plan, r.prepaga)) return false
    }
    return true
  }

  // Cuántos resultados quedarían si, a los filtros ya activos, le sumás esta
  // opción puntual — el número que se muestra al lado de cada checkbox.
  function contarFacet(excluir: GrupoFiltro, opcion: (r: Resultado) => boolean): number {
    return allResultados.filter((r) => pasaFiltros(r, excluir) && opcion(r)).length
  }

  const resultadosFiltrados = useMemo((): Resultado[] => {
    const filtrados = allResultados.filter((r) => pasaFiltros(r))
    if (sortBy === 'precio-asc') return [...filtrados].sort((a, b) => a.precioGrupal - b.precioGrupal).slice(0, 12)
    if (sortBy === 'precio-desc') return [...filtrados].sort((a, b) => b.precioGrupal - a.precioGrupal).slice(0, 12)
    // Relevancia: score puro y después mechado de marcas (Swiss 1º, Sancor/Galeno 2º, sin repetir)
    return mecharResultados([...filtrados].sort((a, b) => b.score - a.score)).slice(0, 12)
  }, [allResultados, copago, activeCobs, activePrepagas, activeNivelPrecio, activeCaracteristicas, sortBy])

  // Cantidad total de resultados que matchean (sin el tope de 12 para mostrar
  // en las cards) — se usa en el contador de "X resultados" arriba de la lista.
  const totalResultadosFiltrados = useMemo(
    () => allResultados.filter((r) => pasaFiltros(r)).length,
    [allResultados, copago, activeCobs, activePrepagas, activeNivelPrecio, activeCaracteristicas]
  )

  const cantidadFiltrosActivos =
    activeCobs.size + (copago ? 1 : 0) + activePrepagas.size + activeNivelPrecio.size + activeCaracteristicas.size
  const hayFiltrosActivos = cantidadFiltrosActivos > 0

  // Cambia con cada combinación de filtros/orden: fuerza el remount de las cards
  // para disparar la animación de entrada en cascada (feedback visual del cambio).
  const filtroVersion = useMemo(
    () => `${[...activeCobs].sort().join('.')}|${copago ?? 'todos'}|${[...activePrepagas].sort().join('.')}|${[...activeNivelPrecio].sort().join('.')}|${[...activeCaracteristicas].sort().join('.')}|${sortBy}`,
    [activeCobs, copago, activePrepagas, activeNivelPrecio, activeCaracteristicas, sortBy]
  )

  // 3-second countdown when entering preview
  useEffect(() => {
    if (step !== 'preview') return
    if (modoPrueba) {
      // Salta directo a resultados: sin popup, sin mandar el lead.
      if (!nombre) setNombre('Darío (prueba)')
      setStep('resultados')
      return
    }
    setCountdown(3)
    setShowPopup(false)
    const timer = setInterval(() => {
      setCountdown((n) => {
        if (n <= 1) { clearInterval(timer); setShowPopup(true); return 0 }
        return n - 1
      })
    }, 1000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `nombre` se lee solo para el atajo de modoPrueba; si entra en las deps, cada tecla que se escribe en el popup reinicia el countdown y lo cierra (bug reportado: "se sale cuando pones el nombre").
  }, [step, modoPrueba])

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
  const popupOk = nombre.trim().length > 0 && esCelularArgentinoValido(celular) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  // Frase en lenguaje natural para el mensaje de WhatsApp ("una persona de
  // 35 años" / "un grupo de 3 personas (35, 8 y 5 años)") — pensada para que
  // Darío pueda reenviar el mensaje tal cual, sin reescribirlo.
  function resumenEdadesNatural(): string {
    const edades = personas.map(p => p.edad).filter(Boolean)
    if (edades.length === 0) return ''
    if (edades.length === 1) return `una persona de ${edades[0]} años`
    const lista = edades.length === 2
      ? edades.join(' y ')
      : `${edades.slice(0, -1).join(', ')} y ${edades[edades.length - 1]}`
    return `un grupo de ${edades.length} personas (${lista} años)`
  }

  function buildPayload(extra: Record<string, string> = {}): Record<string, string> {
    const planesTexto = allResultados.slice(0, 5).map((r, i) =>
      `${i + 1}. ${r.prepaga.nombre} — ${r.plan.nombre} | $${r.precioGrupal.toLocaleString('es-AR')}/mes`
    ).join('\n')
    // "interes" prioriza el plan puntual que la persona eligió (plan_elegido,
    // seteado por handleAccederPlan cuando aprieta "Cotización personalizada"
    // en un plan específico) y si no hay uno, cae al primer resultado
    // mostrado. Este es el valor que termina en el mail como "Interesado en".
    const interes = extra.plan_elegido ?? (planesTexto.split('\n')[0] ?? '')
    const edadResumen = resumenEdadesNatural()
    return {
      name: nombre.trim(),
      nombre: nombre.trim(),
      celular: celular.trim(),
      reply_to: 'cotizaciones@prepagaya.com.ar',
      email: email.trim(),
      provincia: provinciaNombre,
      // En lenguaje natural (no "1 persona — edades: 35 años") porque este
      // mismo valor se reusa tal cual para armar el mensaje de WhatsApp.
      personas: edadResumen,
      fuente: 'cotizacion-wizard',
      planes_mostrados: planesTexto,
      planes_recomendados: planesTexto,
      // OJO: /api/leads lee "prepaga_interes", no "prepaga" — este es el
      // campo que de verdad llega al template de EmailJS como {{prepaga}}.
      prepaga_interes: interes,
      // whatsapp_link NO se manda desde acá: /api/leads arma el suyo propio
      // server-side con whatsappLinkParaLead(nombre, celular) y nunca lee
      // este campo del payload — calcularlo acá era trabajo de más.
      coberturas: [...activeCobs].map(c => COBS.find(o => o.id === c)?.label).filter(Boolean).join(', ') || 'Sin preferencia',
      copago_preferencia: copago === 'sin-copago' ? 'Sin copago' : copago === 'con-copago' ? 'Con copago' : 'Sin preferencia',
      situacion: SITUACIONES.find(s => s.id === situacion)?.label ?? 'No especificada',
      sueldo_bruto: situacion === 'relacion-dependencia' ? `$${(parseFloat(sueldoBruto) || 0).toLocaleString('es-AR')}` : '',
      aporte_descontado: aporteMensual > 0 ? `$${aporteMensual.toLocaleString('es-AR')}/mes` : '',
      presupuesto: 'calculado por edad',
      fecha: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }),
      ...extra,
    }
  }

  // Único camino de envío de leads: /api/leads (server-side). Antes existía
  // una rama que mandaba el mail directo desde el navegador con
  // @emailjs/browser si estaban seteadas NEXT_PUBLIC_EMAILJS_* — se sacó
  // (14-sep-2026, auditoría de código): esas variables no se usan en
  // producción, pero si alguien las cargaba por error el wizard empezaba a
  // saltarse en silencio el filtro de celular y el accessToken del modo
  // estricto de EmailJS. Un solo camino, con todas las validaciones.
  async function sendEmail(payload: Record<string, string>) {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    // fetch() no rechaza por status HTTP (solo por error de red): sin este
    // chequeo, un 400 de /api/leads (ej. email inválido) queda como
    // "éxito" silencioso — la persona ve el cartel de listo pero el mail
    // nunca sale. Lanzamos para que los try/catch de arriba lo detecten.
    if (!res.ok) throw new Error(`/api/leads respondió ${res.status}`)
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

  function handleAccederPlan(res: Resultado) {
    const planKey = `${res.prepaga.slug}-${res.plan.slug}`
    setPlanAccedido(planKey)
    // Nombre y celular ya se mandaron por mail en el popup inicial (único
    // envío por lead, para no gastar cupo de EmailJS) — acá no se manda un
    // segundo mail ni se redirige a WhatsApp (pedido de Darío, 9-sep-2026: no
    // quiere que el visitante le escriba directo, solo recibir el lead por
    // mail y contactar él cuando quiera). Solo queda un "anotado" local.
    setPlanAccedidoStatus('success')
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
    setSituacion('particular'); setSueldoBruto(''); setSituacionTocada(false); setPrepagaActual('')
    setPersonas([{ id: 1, edad: '' }]); setNombre(''); setCelular('')
    setLeadStatus('idle'); limpiarFiltros()
    setSortBy('relevancia'); setPlanAccedido(null); setPlanAccedidoStatus('idle')
    setCountdown(3); setShowPopup(false)
    setCartillaAbierta(null); setComparando(new Set()); setTablaComparativa(false)
  }

  // ── Step: Zona ───────────────────────────────────────────────────────────────

  if (step === 'zona') {
    return (
      <ZonaStep
        zonaSugerida={zonaSugerida}
        onSelect={(prov) => {
          if (pathname !== '/comparador') {
            router.push(`/comparador?zona=${prov.zonaKey}&provincia=${encodeURIComponent(prov.nombre)}`)
            return
          }
          setZonaKey(prov.zonaKey)
          setProvinciaNombre(prov.nombre)
          setStep('edades')
        }}
      />
    )
  }

  // ── Step: Edades ─────────────────────────────────────────────────────────────

  if (step === 'edades') {
    return (
      <div>
        <ProgressBar step="edades" onStepClick={setStep} />
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
            <div key={p.id} className="relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-white border-2 border-gray-100 rounded-2xl p-4 hover:border-red-100 transition-colors">
              {i > 0 && (
                <button onClick={() => removePersona(p.id)} aria-label="Quitar integrante"
                  className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[#E8002D] hover:bg-[#B8001F] text-white flex items-center justify-center transition-colors text-sm font-bold leading-none shadow-sm ring-2 ring-white">
                  ×
                </button>
              )}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[#E8002D]">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-700 truncate">{i === 0 ? 'Titular' : `Integrante ${i + 1}`}</div>
                  <div className="text-xs text-gray-400">Edad en años</div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 sm:ml-auto">
                <button
                  type="button"
                  onClick={() => updateEdad(p.id, String(Math.max(0, (parseInt(p.edad) || 0) - 1)))}
                  className="w-9 h-9 rounded-xl border-2 border-gray-200 hover:border-[#E8002D] hover:text-[#E8002D] text-gray-400 flex items-center justify-center transition-colors text-lg font-bold leading-none flex-shrink-0"
                >−</button>
                <input
                  type="number" min={0} max={110}
                  value={p.edad}
                  onChange={(e) => updateEdad(p.id, e.target.value)}
                  placeholder="Ej: 35"
                  className="w-20 flex-shrink-0 text-center text-lg font-bold border-2 border-gray-200 rounded-xl px-2 py-2 focus:outline-none focus:border-[#E8002D] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => updateEdad(p.id, String(Math.min(110, (parseInt(p.edad) || 0) + 1)))}
                  className="w-9 h-9 rounded-xl border-2 border-gray-200 hover:border-[#E8002D] hover:text-[#E8002D] text-gray-400 flex items-center justify-center transition-colors text-lg font-bold leading-none flex-shrink-0"
                >+</button>
                <span className="text-sm text-gray-400 font-medium flex-shrink-0">años</span>
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
        <ProgressBar step="preview" onStepClick={setStep} />

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {!showPopup ? `Planes disponibles en ${provinciaNombre}` : 'Tu comparación está lista'}
          </h2>
          {!showPopup && countdown > 0 && (
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm font-semibold px-4 py-2 rounded-full">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Encontramos {allResultados.length} planes en {provinciaNombre}…
            </div>
          )}
        </div>

        {/* Preview cards — se muestran 3s, después se difuminan hasta dejar los datos */}
        <div className={`space-y-3 mb-4 transition-all duration-500 ${showPopup ? 'blur-md pointer-events-none select-none' : ''}`}>
          {previewItems.map((r, i) => {
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
                  {i > 0 && DESTACADO_PARTNER[r.prepaga.slug] && previewItems.findIndex((x) => x.prepaga.slug === r.prepaga.slug) === i && (
                    <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5">
                      <span className="text-amber-500">★</span> {DESTACADO_PARTNER[r.prepaga.slug]}
                    </div>
                  )}
                  <div className="font-bold text-gray-900">{r.prepaga.nombre}</div>
                  <div className="text-xs text-gray-500">{r.plan.nombre}</div>
                  <div className="flex gap-1 mt-1.5">
                    {!r.plan.copago && <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-700 rounded-full border border-green-200 font-semibold">Sin copago</span>}
                    {r.plan.redAbierta && <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200 font-semibold">Red abierta</span>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4 flex flex-col items-end gap-1.5">
                  <NivelPrecioBadge nivel={nivelPrecio(r.plan.precio)} />
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

              <h3 className="text-xl font-bold text-gray-900 text-center mb-1">Tu comparación está lista</h3>
              <p className="text-sm text-gray-500 text-center mb-6">Ingresá tus datos para ver el resultado completo</p>

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
                  {celular.trim().length > 0 && !esCelularArgentinoValido(celular) && (
                    <p className="text-[11px] text-amber-600 mt-1">Revisá el número — parece incompleto o inválido.</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className="w-4 h-4">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <path d="M22 6l-10 7L2 6"/>
                      </svg>
                    </span>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com" autoComplete="email"
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
                ) : 'Ver mi resultado →'}
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
  // Estrellita de cada partner (Darío, 23-sep-2026) en su primera tarjeta,
  // solo con el orden por relevancia (el que arma la prioridad de partners).
  const destacados = new Map<string, string>()
  if (sortBy === 'relevancia') {
    for (const r of resultadosFiltrados) {
      const texto = DESTACADO_PARTNER[r.prepaga.slug]
      const key = `${r.prepaga.slug}-${r.plan.slug}`
      // "Mejor cobertura en el interior del país" no se muestra en CABA ni GBA.
      if (ZONAS_AMBA.includes(zonaKey) && INTERIOR_PARTNERS.includes(r.prepaga.slug)) continue
      if (texto && r.prepaga.slug !== 'swiss-medical' && ![...destacados.keys()].some((k) => k.startsWith(`${r.prepaga.slug}-`))) destacados.set(key, texto)
    }
  }

  return (
    <div>
      {/* Summary header — sticky en desktop (pedido de Darío, 17-sep-2026: que
          "Cotización para {nombre}" siga a la persona al bajar, en vez de
          desaparecer al scrollear). En mobile no es sticky: ahí la versión
          compacta (nombre · edad · zona) vive al lado del botón de Filtros. */}
      <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] rounded-2xl p-5 text-white mb-6 lg:sticky lg:top-4 lg:z-40 lg:shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-red-200 text-xs mb-1">Tu cotización personalizada</div>
            <div className="font-bold text-lg leading-snug">
              <span className="uppercase text-black">{nombre}</span>, estos son los mejores planes para vos{personas.length > 1 ? ' y tu grupo familiar' : ''}
            </div>
            <button
              onClick={() => setEditandoGrupo((v) => !v)}
              className="flex items-center gap-1.5 text-red-200 text-sm mt-0.5 hover:text-white transition-colors group"
            >
              <span>
                {personas.length} persona{personas.length !== 1 ? 's' : ''} · {personas.map(p => `${p.edad} años`).join(', ')}
                {provinciaNombre ? ` · ${provinciaNombre}` : ''}
              </span>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0 opacity-70 group-hover:opacity-100">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="bg-white/15 rounded-xl px-4 py-2.5 text-center flex-shrink-0">
            <div className="text-xs text-red-200 mb-0.5">Descuento aplicado</div>
            <div className="text-2xl font-black">{Math.round(descuentoRate * 100)}% OFF</div>
            <div className="text-xs text-red-200">{aporteMensual > 0 ? 'más tu aporte descontado' : 'por 12 meses'}</div>
          </div>
        </div>

        {/* Editor de integrantes — agregar/sacar sin volver atrás en el wizard */}
        {editandoGrupo && (
          <div className="mt-4 pt-4 border-t border-white/20 space-y-2">
            {personas.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 bg-white/10 rounded-xl px-3 py-2">
                <span className="text-xs font-semibold text-red-100 w-20 flex-shrink-0">
                  {i === 0 ? 'Titular' : `Integrante ${i + 1}`}
                </span>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => updateEdad(p.id, String(Math.max(0, (parseInt(p.edad) || 0) - 1)))}
                    className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white font-bold transition-colors"
                  >−</button>
                  <input
                    type="number" min={0} max={110}
                    value={p.edad}
                    onChange={(e) => updateEdad(p.id, e.target.value)}
                    placeholder="Edad"
                    className="w-16 text-center text-sm font-bold bg-white/90 text-gray-900 rounded-lg px-1 py-1.5 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    onClick={() => updateEdad(p.id, String(Math.min(110, (parseInt(p.edad) || 0) + 1)))}
                    className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white font-bold transition-colors"
                  >+</button>
                </div>
                {i > 0 && (
                  <button
                    onClick={() => removePersona(p.id)}
                    className="ml-auto w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors text-sm flex-shrink-0"
                  >×</button>
                )}
              </div>
            ))}
            <div className="flex items-center gap-2 pt-1">
              {personas.length < 6 && (
                <button
                  onClick={addPersona}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-dashed border-white/40 rounded-xl text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  + Agregar integrante
                </button>
              )}
              <button
                onClick={() => setEditandoGrupo(false)}
                className="px-4 py-2 bg-white text-[#E8002D] rounded-xl text-xs font-bold hover:bg-red-50 transition-colors"
              >
                Listo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* "¿Qué cobertura tenés hoy?" — opcional y DESPUÉS del lead, así no
          suma fricción al formulario. Le sirve al asesor para comparar con lo
          que paga hoy y al sondeo anónimo de /prensa/sondeo (24-sep-2026). */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
        {prepagaActual ? (
          <p className="text-sm text-gray-600">
            ¡Gracias! Tu asesor va a comparar estos planes con tu cobertura actual ({prepagaActual}).{' '}
            <button onClick={() => setPrepagaActual('')} className="text-[#E8002D] font-semibold hover:underline">Cambiar</button>
          </p>
        ) : (
          <>
            <p className="text-sm font-semibold text-gray-900 mb-2">
              ¿Qué cobertura tenés hoy? <span className="font-normal text-gray-500">(opcional, para comparar con lo que pagás)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {OPCIONES_PREPAGA_ACTUAL.map((op) => (
                <button key={op} onClick={() => setPrepagaActual(op)}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:border-[#E8002D] hover:text-[#E8002D] transition-colors">
                  {op}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Layout: sidebar + cards */}
      <div className="flex gap-6">

        {/* Left sidebar — desktop only. max-h + overflow-y-auto propio (no solo
            sticky) para que, si el contenido del sidebar es más alto que la
            pantalla, tenga su scroll interno: pasar el mouse por arriba del
            menú scrollea el menú, y por arriba de las cards scrollea la lista
            de planes — sin esto, la parte de abajo del sidebar quedaba
            inaccesible hasta scrollear toda la página (pedido de Darío,
            17-sep-2026). */}
        <div className="hidden lg:block w-52 flex-shrink-0">
          <div className="sticky top-24 self-start space-y-4 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">

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

            {/* ¿Cómo pagás? */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">¿Cómo pagás?</p>
              <SituacionFiltro situacion={situacion} setSituacion={elegirSituacion} sueldoBruto={sueldoBruto} setSueldoBruto={setSueldoBruto} />
            </div>

            {/* Tipo de consulta */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Tipo de consulta</p>
              <div className="space-y-2.5">
                {([
                  { id: 'sin-copago', label: 'Sin copago' },
                  { id: 'con-copago', label: 'Con copago' },
                ] as { id: Copago; label: string }[]).map((opt) => {
                  const count = contarFacet('copago', (r) => opt.id === 'sin-copago' ? !r.plan.copago : r.plan.copago)
                  return (
                    <label key={String(opt.id)} className={`flex items-center gap-2.5 cursor-pointer group ${count === 0 && copago !== opt.id ? 'opacity-40' : ''}`} onClick={() => setCopago(copago === opt.id ? null : opt.id)}>
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        copago === opt.id ? 'bg-[#E8002D] border-[#E8002D]' : 'border-gray-300 group-hover:border-[#E8002D]'
                      }`}>
                        {copago === opt.id && <svg viewBox="0 0 12 12" fill="white" className="w-2.5 h-2.5"><path fillRule="evenodd" d="M10.28 1.28L3.989 9.05 1.695 6.288a.75.75 0 00-1.14.976l2.939 3.425a.75.75 0 001.07.093l7-8.5a.75.75 0 00-1.284-.802z" clipRule="evenodd"/></svg>}
                      </div>
                      <span className={`text-sm font-medium transition-colors flex-1 ${copago === opt.id ? 'text-[#E8002D]' : 'text-gray-600 group-hover:text-gray-900'}`}>{opt.label}</span>
                      <span className="text-[11px] text-gray-400 tabular-nums flex-shrink-0">{count}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Rango de precio — el facet más usado en e-commerce (MercadoLibre,
                Amazon) casi siempre va arriba de todo, cerca de "marca". Acá se
                reutilizan los mismos 3 niveles ($/$$/$$$) que ya se usan en todo
                el sitio (NivelPrecioBadge), en vez de inventar un slider nuevo. */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Rango de precio</p>
              <div className="space-y-2.5">
                {(['economico', 'medio', 'premium'] as NivelPrecio[]).map((n) => {
                  const on = activeNivelPrecio.has(n)
                  const count = contarFacet('precio', (r) => nivelPrecio(r.plan.precio) === n)
                  return (
                    <label key={n} className={`flex items-center gap-2.5 cursor-pointer group ${count === 0 && !on ? 'opacity-40' : ''}`} onClick={() => toggleNivelPrecio(n)}>
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        on ? 'bg-[#E8002D] border-[#E8002D]' : 'border-gray-300 group-hover:border-[#E8002D]'
                      }`}>
                        {on && <svg viewBox="0 0 12 12" fill="white" className="w-2.5 h-2.5"><path fillRule="evenodd" d="M10.28 1.28L3.989 9.05 1.695 6.288a.75.75 0 00-1.14.976l2.939 3.425a.75.75 0 001.07.093l7-8.5a.75.75 0 00-1.284-.802z" clipRule="evenodd"/></svg>}
                      </div>
                      <span className={`text-sm font-medium transition-colors flex-1 ${on ? 'text-[#E8002D]' : 'text-gray-600 group-hover:text-gray-900'}`}>{NIVEL_PRECIO_LABEL[n].label}</span>
                      <span className="text-[11px] text-gray-400 tabular-nums flex-shrink-0">{count}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Prepaga */}
            {prepagasDisponibles.length > 1 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Prepaga</p>
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {prepagasDisponibles.map((p) => {
                    const on = activePrepagas.has(p.slug)
                    const count = contarFacet('prepaga', (r) => r.prepaga.slug === p.slug)
                    return (
                      <label key={p.slug} className={`flex items-center gap-2.5 cursor-pointer group ${count === 0 && !on ? 'opacity-40' : ''}`} onClick={() => togglePrepaga(p.slug)}>
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                          on ? 'bg-[#E8002D] border-[#E8002D]' : 'border-gray-300 group-hover:border-[#E8002D]'
                        }`}>
                          {on && <svg viewBox="0 0 12 12" fill="white" className="w-2.5 h-2.5"><path fillRule="evenodd" d="M10.28 1.28L3.989 9.05 1.695 6.288a.75.75 0 00-1.14.976l2.939 3.425a.75.75 0 001.07.093l7-8.5a.75.75 0 00-1.284-.802z" clipRule="evenodd"/></svg>}
                        </div>
                        <span className={`text-sm font-medium transition-colors flex-1 truncate ${on ? 'text-[#E8002D]' : 'text-gray-600 group-hover:text-gray-900'}`}>{p.nombre}</span>
                        <span className="text-[11px] text-gray-400 tabular-nums flex-shrink-0">{count}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Características — atributos del plan/prepaga (equivalente a
                filtros de "envío gratis" o "con garantía" en un e-commerce),
                todos calculados sobre datos reales ya cargados en el sitio. */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Características</p>
              <div className="space-y-2.5">
                {CARACTERISTICAS.map((c) => {
                  const on = activeCaracteristicas.has(c.id)
                  const count = contarFacet('caracteristicas', (r) => c.check(r.plan, r.prepaga))
                  return (
                    <label key={c.id} className={`flex items-center gap-2.5 cursor-pointer group ${count === 0 && !on ? 'opacity-40' : ''}`} onClick={() => toggleCaracteristica(c.id)}>
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        on ? 'bg-[#E8002D] border-[#E8002D]' : 'border-gray-300 group-hover:border-[#E8002D]'
                      }`}>
                        {on && <svg viewBox="0 0 12 12" fill="white" className="w-2.5 h-2.5"><path fillRule="evenodd" d="M10.28 1.28L3.989 9.05 1.695 6.288a.75.75 0 00-1.14.976l2.939 3.425a.75.75 0 001.07.093l7-8.5a.75.75 0 00-1.284-.802z" clipRule="evenodd"/></svg>}
                      </div>
                      <span className={`text-sm font-medium transition-colors flex-1 ${on ? 'text-[#E8002D]' : 'text-gray-600 group-hover:text-gray-900'}`}>{c.label}</span>
                      <span className="text-[11px] text-gray-400 tabular-nums flex-shrink-0">{count}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Coberturas */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Me interesa incluir</p>
              <div className="space-y-2.5">
                {COBS.map((cob) => {
                  const on = activeCobs.has(cob.id)
                  const guiaSlug = COB_GUIA[cob.id]
                  const count = contarFacet('cobertura', (r) => checkCob(cob.id, r.plan, r.prepaga))
                  return (
                    <div key={cob.id} className="flex items-center gap-2.5">
                      <label className={`flex items-center gap-2.5 cursor-pointer group flex-1 ${count === 0 && !on ? 'opacity-40' : ''}`} onClick={() => toggleCob(cob.id)}>
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                          on ? 'bg-[#E8002D] border-[#E8002D]' : 'border-gray-300 group-hover:border-[#E8002D]'
                        }`}>
                          {on && <svg viewBox="0 0 12 12" fill="white" className="w-2.5 h-2.5"><path fillRule="evenodd" d="M10.28 1.28L3.989 9.05 1.695 6.288a.75.75 0 00-1.14.976l2.939 3.425a.75.75 0 001.07.093l7-8.5a.75.75 0 00-1.284-.802z" clipRule="evenodd"/></svg>}
                        </div>
                        <span className={`text-sm font-medium transition-colors flex-1 ${on ? 'text-[#E8002D]' : 'text-gray-600 group-hover:text-gray-900'}`}>{cob.label}</span>
                        <span className="text-[11px] text-gray-400 tabular-nums flex-shrink-0">{count}</span>
                      </label>
                      {on && guiaSlug && (
                        <Link href={`/coberturas/${guiaSlug}`} className="text-[10px] font-semibold text-[#E8002D] hover:underline flex-shrink-0">
                          Ver detalle →
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Cards column */}
        <div className="flex-1 min-w-0">

          {/* Mobile: solo la "oreja" a la izquierda — sin fila de chips (pedido de
              Darío, 17-sep-2026: la fila de chips quedaba en medio de la pantalla
              y confundía). Todos los filtros (copago, prepaga, coberturas) viven
              únicamente en el bottom sheet que abre este botón.
              top-0 (no top-16): en este paso el Header del sitio está oculto
              (hideChrome), así que no hay nada arriba que "esquivar" — con
              top-16 quedaba flotando con un hueco en blanco en vez de pegarse
              al borde superior real de la pantalla (pedido de Darío, 17-sep-2026). */}
          <div className="lg:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100 py-2.5 shadow-sm">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setFiltrosMenuOpen(true)}
                aria-label="Abrir filtros"
                className="relative flex items-center gap-2 pl-3 pr-4 py-2 rounded-full bg-gradient-to-r from-[#E8002D] to-[#B8001F] text-white shadow-md shadow-red-200 active:scale-95 transition-transform flex-shrink-0"
              >
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
                  <path d="M3 6h14M6 10h8M8.5 14h3" />
                </svg>
                <span className="text-xs font-bold tracking-wide">Filtros</span>
                {hayFiltrosActivos && (
                  <span className="w-4 h-4 rounded-full bg-white text-[#E8002D] text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                    {cantidadFiltrosActivos}
                  </span>
                )}
              </button>

              {/* Cotización personalizada: nombre, edad y zona — distinto del
                  botón de filtros a propósito, para que se lea como contexto de
                  la navegación y no como otro filtro más (pedido de Darío,
                  17-sep-2026). */}
              {nombre && (
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-gray-600 truncate">
                    {nombre}
                    {personas[0]?.edad ? ` · ${personas[0].edad} años` : ''}
                    {provinciaNombre ? ` · ${provinciaNombre}` : ''}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Menú completo de filtros — bottom sheet mobile */}
          {filtrosMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-[70] flex items-end justify-center" onClick={(e) => { if (e.target === e.currentTarget) setFiltrosMenuOpen(false) }}>
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <div className="relative bg-white rounded-t-3xl shadow-2xl w-full max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
                  <div className="text-base font-bold text-gray-900">Filtros</div>
                  <button onClick={() => setFiltrosMenuOpen(false)} aria-label="Cerrar" className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-5 h-5">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="overflow-y-auto p-5 space-y-5">
                  {/* Ordenar por */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Ordenar por</p>
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

                  {/* ¿Cómo pagás? */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">¿Cómo pagás?</p>
                    <SituacionFiltro situacion={situacion} setSituacion={elegirSituacion} sueldoBruto={sueldoBruto} setSueldoBruto={setSueldoBruto} />
                  </div>

                  {/* Tipo de consulta */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Tipo de consulta</p>
                    <div className="space-y-2.5">
                      {([
                        { id: 'sin-copago', label: 'Sin copago' },
                        { id: 'con-copago', label: 'Con copago' },
                      ] as { id: Copago; label: string }[]).map((opt) => {
                        const count = contarFacet('copago', (r) => opt.id === 'sin-copago' ? !r.plan.copago : r.plan.copago)
                        return (
                          <label key={String(opt.id)} className={`flex items-center gap-2.5 cursor-pointer group ${count === 0 && copago !== opt.id ? 'opacity-40' : ''}`} onClick={() => setCopago(copago === opt.id ? null : opt.id)}>
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                              copago === opt.id ? 'bg-[#E8002D] border-[#E8002D]' : 'border-gray-300 group-hover:border-[#E8002D]'
                            }`}>
                              {copago === opt.id && <svg viewBox="0 0 12 12" fill="white" className="w-2.5 h-2.5"><path fillRule="evenodd" d="M10.28 1.28L3.989 9.05 1.695 6.288a.75.75 0 00-1.14.976l2.939 3.425a.75.75 0 001.07.093l7-8.5a.75.75 0 00-1.284-.802z" clipRule="evenodd"/></svg>}
                            </div>
                            <span className={`text-sm font-medium transition-colors flex-1 ${copago === opt.id ? 'text-[#E8002D]' : 'text-gray-600 group-hover:text-gray-900'}`}>{opt.label}</span>
                            <span className="text-[11px] text-gray-400 tabular-nums flex-shrink-0">{count}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  {/* Rango de precio */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Rango de precio</p>
                    <div className="space-y-2.5">
                      {(['economico', 'medio', 'premium'] as NivelPrecio[]).map((n) => {
                        const on = activeNivelPrecio.has(n)
                        const count = contarFacet('precio', (r) => nivelPrecio(r.plan.precio) === n)
                        return (
                          <label key={n} className={`flex items-center gap-2.5 cursor-pointer group ${count === 0 && !on ? 'opacity-40' : ''}`} onClick={() => toggleNivelPrecio(n)}>
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                              on ? 'bg-[#E8002D] border-[#E8002D]' : 'border-gray-300 group-hover:border-[#E8002D]'
                            }`}>
                              {on && <svg viewBox="0 0 12 12" fill="white" className="w-2.5 h-2.5"><path fillRule="evenodd" d="M10.28 1.28L3.989 9.05 1.695 6.288a.75.75 0 00-1.14.976l2.939 3.425a.75.75 0 001.07.093l7-8.5a.75.75 0 00-1.284-.802z" clipRule="evenodd"/></svg>}
                            </div>
                            <span className={`text-sm font-medium transition-colors flex-1 ${on ? 'text-[#E8002D]' : 'text-gray-600 group-hover:text-gray-900'}`}>{NIVEL_PRECIO_LABEL[n].label}</span>
                            <span className="text-[11px] text-gray-400 tabular-nums flex-shrink-0">{count}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  {/* Prepaga — selección única: tocás una y queda solo esa,
                      tocás la misma de nuevo y volvés a ver todas */}
                  {prepagasDisponibles.length > 1 && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Prepaga</p>
                      <div className="space-y-2.5">
                        {prepagasDisponibles.map((p) => {
                          const on = activePrepagas.has(p.slug)
                          const count = contarFacet('prepaga', (r) => r.prepaga.slug === p.slug)
                          return (
                            <label key={p.slug} className={`flex items-center gap-2.5 cursor-pointer group ${count === 0 && !on ? 'opacity-40' : ''}`} onClick={() => selectSoloPrepaga(p.slug)}>
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                                on ? 'border-[#E8002D]' : 'border-gray-300 group-hover:border-[#E8002D]'
                              }`}>
                                {on && <div className="w-2 h-2 rounded-full bg-[#E8002D]" />}
                              </div>
                              <span className={`text-sm font-medium transition-colors flex-1 truncate ${on ? 'text-[#E8002D]' : 'text-gray-600 group-hover:text-gray-900'}`}>{p.nombre}</span>
                              <span className="text-[11px] text-gray-400 tabular-nums flex-shrink-0">{count}</span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Características */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Características</p>
                    <div className="space-y-2.5">
                      {CARACTERISTICAS.map((c) => {
                        const on = activeCaracteristicas.has(c.id)
                        const count = contarFacet('caracteristicas', (r) => c.check(r.plan, r.prepaga))
                        return (
                          <label key={c.id} className={`flex items-center gap-2.5 cursor-pointer group ${count === 0 && !on ? 'opacity-40' : ''}`} onClick={() => toggleCaracteristica(c.id)}>
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                              on ? 'bg-[#E8002D] border-[#E8002D]' : 'border-gray-300 group-hover:border-[#E8002D]'
                            }`}>
                              {on && <svg viewBox="0 0 12 12" fill="white" className="w-2.5 h-2.5"><path fillRule="evenodd" d="M10.28 1.28L3.989 9.05 1.695 6.288a.75.75 0 00-1.14.976l2.939 3.425a.75.75 0 001.07.093l7-8.5a.75.75 0 00-1.284-.802z" clipRule="evenodd"/></svg>}
                            </div>
                            <span className={`text-sm font-medium transition-colors flex-1 ${on ? 'text-[#E8002D]' : 'text-gray-600 group-hover:text-gray-900'}`}>{c.label}</span>
                            <span className="text-[11px] text-gray-400 tabular-nums flex-shrink-0">{count}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  {/* Coberturas */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Me interesa incluir</p>
                    <div className="space-y-2.5">
                      {COBS.map((cob) => {
                        const on = activeCobs.has(cob.id)
                        const count = contarFacet('cobertura', (r) => checkCob(cob.id, r.plan, r.prepaga))
                        return (
                          <label key={cob.id} className={`flex items-center gap-2.5 cursor-pointer group ${count === 0 && !on ? 'opacity-40' : ''}`} onClick={() => toggleCob(cob.id)}>
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                              on ? 'bg-[#E8002D] border-[#E8002D]' : 'border-gray-300 group-hover:border-[#E8002D]'
                            }`}>
                              {on && <svg viewBox="0 0 12 12" fill="white" className="w-2.5 h-2.5"><path fillRule="evenodd" d="M10.28 1.28L3.989 9.05 1.695 6.288a.75.75 0 00-1.14.976l2.939 3.425a.75.75 0 001.07.093l7-8.5a.75.75 0 00-1.284-.802z" clipRule="evenodd"/></svg>}
                            </div>
                            <span className={`text-sm font-medium transition-colors flex-1 ${on ? 'text-[#E8002D]' : 'text-gray-600 group-hover:text-gray-900'}`}>{cob.label}</span>
                            <span className="text-[11px] text-gray-400 tabular-nums flex-shrink-0">{count}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-5 py-4 border-t border-gray-100 flex-shrink-0">
                  {hayFiltrosActivos && (
                    <button onClick={limpiarFiltros}
                      className="text-sm text-gray-500 font-semibold hover:text-gray-700">
                      Limpiar
                    </button>
                  )}
                  <button onClick={() => setFiltrosMenuOpen(false)}
                    className="flex-1 bg-[#E8002D] text-white text-sm font-bold rounded-xl py-3 hover:bg-[#C4001F] transition-colors">
                    Ver {totalResultadosFiltrados} resultado{totalResultadosFiltrados !== 1 ? 's' : ''}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Asesoramiento inmediato — abre formulario, no un link directo de WhatsApp */}
          <button
            onClick={() => setAsesoramientoUrgenteOpen(true)}
            className="w-full flex items-center gap-3 bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl px-4 py-3 mb-4 hover:bg-[#25D366]/15 transition-colors group text-left"
          >
            <span className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="white" className="w-4.5 h-4.5">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39c1.45.79 3.08 1.21 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.51 2 12.04 2zm5.83 14.07c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.1.11-1.77-.11-.41-.13-.93-.3-1.6-.58-2.83-1.22-4.67-4.06-4.81-4.25-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.35.26-.28.56-.35.75-.35.19 0 .37 0 .53.01.17.01.4-.06.62.48.24.58.81 2 .88 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.17-.29.37-.42.5-.14.13-.29.28-.12.56.16.28.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.19-.28.37-.23.62-.14.26.09 1.62.77 1.9.91.28.14.46.21.53.33.07.12.07.68-.17 1.36z"/>
              </svg>
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5 flex-wrap">
                ¿Preferís que te asesoren ahora mismo?
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#E8002D] text-white tracking-wide">ATENCIÓN URGENTE</span>
              </div>
              <div className="text-xs text-gray-500">Asesor oficial · 10 años en el rubro · asesoramiento en el acto por WhatsApp</div>
            </div>
            <span className="text-xs font-bold text-[#128C7E] flex-shrink-0 hidden sm:inline group-hover:underline">Escribinos →</span>
          </button>

          {/* Count */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">
              {!verTodos && sortBy === 'relevancia' && totalResultadosFiltrados > RECOMENDADOS_VISIBLES
                ? `${RECOMENDADOS_VISIBLES} planes recomendados para vos`
                : `${totalResultadosFiltrados} resultado${totalResultadosFiltrados !== 1 ? 's' : ''}`}
              {hayFiltrosActivos ? ' con filtros' : ''}
            </p>
          </div>

          {/* Chips de filtros aplicados — patrón estándar de e-commerce
              (MercadoLibre, Amazon): cada filtro activo se ve como una
              píldora removible arriba de los resultados, no solo dentro
              del panel de filtros, para que el usuario vea de un vistazo
              qué está filtrando y pueda sacar uno sin abrir nada. */}
          {hayFiltrosActivos && (
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {copago && (
                <button onClick={() => setCopago(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full pl-3 pr-2 py-1.5 transition-colors">
                  {copago === 'sin-copago' ? 'Sin copago' : 'Con copago'}
                  <span className="text-gray-400">×</span>
                </button>
              )}
              {[...activePrepagas].map((slug) => (
                <button key={slug} onClick={() => togglePrepaga(slug)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full pl-3 pr-2 py-1.5 transition-colors">
                  {prepagasDisponibles.find((p) => p.slug === slug)?.nombre ?? slug}
                  <span className="text-gray-400">×</span>
                </button>
              ))}
              {[...activeNivelPrecio].map((n) => (
                <button key={n} onClick={() => toggleNivelPrecio(n)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full pl-3 pr-2 py-1.5 transition-colors">
                  {NIVEL_PRECIO_LABEL[n].label}
                  <span className="text-gray-400">×</span>
                </button>
              ))}
              {[...activeCaracteristicas].map((c) => (
                <button key={c} onClick={() => toggleCaracteristica(c)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full pl-3 pr-2 py-1.5 transition-colors">
                  {CARACTERISTICAS.find((x) => x.id === c)?.label ?? c}
                  <span className="text-gray-400">×</span>
                </button>
              ))}
              {[...activeCobs].map((c) => (
                <button key={c} onClick={() => toggleCob(c)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full pl-3 pr-2 py-1.5 transition-colors">
                  {COB_MAP[c].label}
                  <span className="text-gray-400">×</span>
                </button>
              ))}
              <button onClick={limpiarFiltros}
                className="text-xs text-[#E8002D] font-bold hover:underline px-1">
                Limpiar todo
              </button>
            </div>
          )}

          {resultadosFiltrados.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm mb-2">Ningún plan cumple todos los filtros.</p>
              <button onClick={limpiarFiltros}
                className="text-sm text-[#E8002D] font-semibold hover:underline">Quitar filtros</button>
            </div>
          )}

          <div className="space-y-3 mb-8">
            {(verTodos || sortBy !== 'relevancia' ? resultadosFiltrados : resultadosFiltrados.slice(0, RECOMENDADOS_VISIBLES)).map((res, i) => {
              const planKey = `${res.prepaga.slug}-${res.plan.slug}`
              const isBest = planKey === bestKey
              const isCheapest = planKey === cheapestKey && planKey !== bestKey
              const isAccedido = planAccedido === planKey
              // La de Swiss (primera por relevancia) queda grande y destacada;
              // el resto, compactas (Darío, 23-sep-2026).
              const grande = isBest && res.prepaga.slug === 'swiss-medical'

              return (
                <div key={`${planKey}::${filtroVersion}`}
                  style={{ animationDelay: `${Math.min(i, 8) * 80}ms` }}
                  className={`card-enter bg-white rounded-2xl border-2 overflow-hidden transition-all ${
                    isBest ? 'border-[#E8002D] shadow-md' : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                  }`}>

                  {isBest && (
                    <div className="bg-[#E8002D] text-white text-xs font-bold px-4 py-1.5 flex items-center gap-2">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      Mejor opción para tu perfil
                    </div>
                  )}
                  {!isBest && destacados.get(planKey) && (
                    <div className="bg-amber-50 text-amber-800 border-b border-amber-100 text-xs font-bold px-4 py-1.5 flex items-center gap-2">
                      <span className="text-amber-500">★</span>
                      {destacados.get(planKey)}
                    </div>
                  )}
                  {isCheapest && !destacados.get(planKey) && (
                    <div className="bg-[#00875A] text-white text-xs font-bold px-4 py-1.5 flex items-center gap-2">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                      Plan más económico
                    </div>
                  )}

                  {/* Card compacta (23-sep-2026): antes ~600px en celular, casi
                      una pantalla por plan y el botón al fondo. Ahora: plan,
                      4 chips que diferencian, precio y botón en la misma fila. */}
                  <div className={grande ? 'p-5' : 'p-4'}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-x-2 flex-wrap">
                          <span className={`font-bold text-gray-900 leading-tight ${grande ? 'text-xl' : 'text-base'}`}>{res.prepaga.nombre}</span>
                          <span className={`text-gray-600 ${grande ? 'text-base font-semibold' : 'text-sm'}`}>{res.plan.nombre}</span>
                        </div>
                        <p className={grande ? 'text-sm text-gray-500 mt-1 leading-relaxed' : 'text-xs text-gray-400 mt-0.5 line-clamp-1'}>{res.plan.descripcion}</p>
                      </div>
                      <label className="flex items-center gap-1 cursor-pointer select-none flex-shrink-0 pt-0.5">
                        <input
                          type="checkbox"
                          checked={comparando.has(planKey)}
                          onChange={() => toggleComparar(planKey)}
                          disabled={!comparando.has(planKey) && comparando.size >= 3}
                          className="w-3.5 h-3.5 accent-[#E8002D] cursor-pointer disabled:cursor-not-allowed"
                        />
                        <span className="text-[10px] font-semibold text-gray-400">Comparar</span>
                      </label>
                    </div>

                    {/* Solo lo que diferencia un plan de otro (psicología y
                        maternidad son PMO: las tienen todos) */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold ${res.plan.copago ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                        {res.plan.copago ? 'Con copago' : 'Sin copago'}
                      </span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold ${res.plan.redAbierta ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        Red {res.plan.redAbierta ? 'abierta' : 'cerrada'}
                      </span>
                      {res.prepaga.sanatoriosPropios > 0 && <span className="text-[11px] px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full font-semibold">Sanatorio propio</span>}
                      {checkCob('ortodoncia', res.plan, res.prepaga)
                        ? <span className="text-[11px] px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full font-semibold">Ortodoncia</span>
                        : checkCob('odontologia', res.plan, res.prepaga) && <span className="text-[11px] px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full font-semibold">Odontología</span>}
                      {grande && res.prepaga.caracteristicas.coberturaNacional && <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-semibold">Cobertura nacional</span>}
                      {grande && checkCob('urgencias', res.plan, res.prepaga) && <span className="text-[11px] px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-full font-semibold">Urgencias 24hs</span>}
                      {grande && checkCob('medicamentos', res.plan, res.prepaga) && <span className="text-[11px] px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full font-semibold">Medicamentos</span>}
                    </div>

                    {/* Detalle de las coberturas filtradas: cada card ya pasó
                        todos los filtros activos, así que solo se describe qué
                        incluye este plan para cada cobertura pedida */}
                    {activeCobs.size > 0 && (
                      <div className="bg-red-50/60 border border-red-100 rounded-xl px-3 py-2 mt-2.5 space-y-1">
                        {[...activeCobs].map((id) => (
                          <div key={id} className="flex items-start gap-1.5 text-xs text-gray-700">
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-[#00875A] flex-shrink-0 mt-px">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            <span className="line-clamp-2"><span className="font-semibold text-gray-900">{COB_MAP[id].label}:</span> {detalleCob(id, res.plan)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Precio + botón en la misma fila */}
                    <div className={`flex items-center justify-between gap-3 border-t border-gray-100 ${grande ? 'mt-4 pt-4' : 'mt-3 pt-3'}`}>
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          {res.precioGrupal > precioFinal(res.precioDesc) && (
                            <span className="text-xs text-gray-400 line-through blur-[3px] select-none" aria-hidden>{formatPrecio(res.precioGrupal)}</span>
                          )}
                          <PrecioBloqueado texto={<>{formatPrecio(precioFinal(res.precioDesc))}<span className="text-xs font-medium text-gray-400">/mes*</span></>} />
                        </div>
                        <div className="text-[11px] text-gray-500">{personas.length} persona{personas.length !== 1 ? 's' : ''} · {Math.round(descuentoRate * 100)}% OFF</div>
                      </div>
                      {isAccedido && planAccedidoStatus === 'success' ? (
                        <div className="text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-center max-w-[160px]">
                          ¡Listo! En breve te enviamos la cotización
                        </div>
                      ) : (
                        <button onClick={() => handleAccederPlan(res)}
                          disabled={isAccedido && planAccedidoStatus === 'loading'}
                          className={`flex-shrink-0 ${grande ? 'px-6 py-3 text-base' : 'px-4 py-2.5 text-sm'} bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-60 flex items-center justify-center gap-2 whitespace-nowrap`}>
                          {isAccedido && planAccedidoStatus === 'loading' ? (
                            <svg className="animate-spin w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                          ) : null}
                          Ver precio →
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      <button onClick={() => setPlanAbierto(res)} className="text-xs font-semibold text-[#E8002D] hover:underline">
                        Ver plan
                      </button>
                      <button onClick={() => setCartillaAbierta(res)} className="text-xs font-semibold text-[#E8002D] hover:underline">
                        Ver cartilla
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {resultadosFiltrados.length > 0 && (
            <p className="text-[11px] text-gray-400 leading-snug -mt-5 mb-6">
              *Estimado sobre precios de lista, con el {Math.round(descuentoRate * 100)}% de descuento aplicado. El valor final lo confirma un asesor, que en el asesoramiento puede conseguirte más descuento.
            </p>
          )}
          {!verTodos && sortBy === 'relevancia' && resultadosFiltrados.length > RECOMENDADOS_VISIBLES && (
            <div className="text-center -mt-4 mb-8">
              <button
                onClick={() => setVerTodos(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 hover:border-[#E8002D] text-gray-800 font-semibold rounded-xl text-sm transition-colors"
              >
                Ver más planes ({resultadosFiltrados.length - RECOMENDADOS_VISIBLES})
              </button>
            </div>
          )}

          <div className="text-center">
            <button onClick={resetWizard} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              ← Hacer una nueva cotización
            </button>
          </div>
        </div>
      </div>

      {cartillaAbierta && (() => {
        const key = `${cartillaAbierta.prepaga.slug}-${cartillaAbierta.plan.slug}`
        const yaEnviado = planAccedido === key && planAccedidoStatus === 'success'
        const enviando = planAccedido === key && planAccedidoStatus === 'loading'
        return (
          <CartillaModal
            prepaga={cartillaAbierta.prepaga}
            plan={cartillaAbierta.plan}
            zonaKey={zonaKey}
            provinciaNombre={provinciaNombre}
            onClose={() => setCartillaAbierta(null)}
            onQuiero={() => handleAccederPlan(cartillaAbierta)}
            quieroDisabled={enviando || yaEnviado}
            quieroLabel={yaEnviado ? '¡Anotado!' : enviando ? 'Enviando...' : 'Cotizar este plan →'}
          />
        )
      })()}

      {planAbierto && (() => {
        const key = `${planAbierto.prepaga.slug}-${planAbierto.plan.slug}`
        const yaEnviado = planAccedido === key && planAccedidoStatus === 'success'
        const enviando = planAccedido === key && planAccedidoStatus === 'loading'
        return (
          <PlanModal
            prepaga={planAbierto.prepaga}
            plan={planAbierto.plan}
            onClose={() => setPlanAbierto(null)}
            onQuiero={() => handleAccederPlan(planAbierto)}
            quieroDisabled={enviando || yaEnviado}
            quieroLabel={yaEnviado ? '¡Excelente! Ya te la enviamos' : enviando ? 'Enviando...' : 'Ver precio →'}
          />
        )
      })()}

      {comparando.size > 0 && !tablaComparativa && (
        <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-auto z-40 flex justify-center md:justify-end">
          <button
            onClick={() => setTablaComparativa(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl shadow-2xl transition-all text-sm"
          >
            Comparar {comparando.size} plan{comparando.size !== 1 ? 'es' : ''} →
          </button>
        </div>
      )}

      {tablaComparativa && (() => {
        const seleccionados = allResultados.filter((r) => comparando.has(`${r.prepaga.slug}-${r.plan.slug}`))
        // Entre los planes que el usuario eligió comparar, destacamos el de mejor
        // score (mismo criterio que ordena los resultados) para que la persona
        // tenga una recomendación clara además de la comparación cruda.
        const mejor = seleccionados.length > 1
          ? seleccionados.reduce((best, r) => (r.score > best.score ? r : best), seleccionados[0])
          : null
        const mejorKey = mejor ? `${mejor.prepaga.slug}-${mejor.plan.slug}` : null
        const celda = (r: Resultado) => `${r.prepaga.slug}-${r.plan.slug}` === mejorKey ? 'bg-red-50/60' : ''
        return (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setTablaComparativa(false) }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                <div className="font-bold text-gray-900">Comparar planes</div>
                <button onClick={() => setTablaComparativa(false)} className="text-gray-400 hover:text-gray-700 transition-colors" aria-label="Cerrar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-5 h-5">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <div className="overflow-auto p-6">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left text-xs text-gray-400 font-semibold pb-3 pr-3 align-bottom">&nbsp;</th>
                      {seleccionados.map((r) => {
                        const key = `${r.prepaga.slug}-${r.plan.slug}`
                        const esMejor = key === mejorKey
                        return (
                          <th key={key} className={`text-left pb-3 px-3 pt-3 align-bottom min-w-[160px] rounded-t-xl ${celda(r)}`}>
                            {esMejor && (
                              <div className="text-[10px] font-bold text-[#E8002D] uppercase tracking-wide mb-1 flex items-center gap-1">
                                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                Recomendado
                              </div>
                            )}
                            <div className="font-bold text-gray-900">{r.prepaga.nombre}</div>
                            <div className="text-xs text-gray-500">{r.plan.nombre}</div>
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-t border-gray-100">
                      <td className="py-3 pr-3 font-semibold text-gray-500 text-xs">Precio aprox.</td>
                      {seleccionados.map((r) => (
                        <td key={`${r.prepaga.slug}-${r.plan.slug}-precioaprox`} className={`py-3 px-3 ${celda(r)}`}>
                          <PrecioBloqueado size="sm" texto={<>{formatPrecio(precioFinal(r.precioDesc))}<span className="text-[10px] text-gray-400">/mes</span></>} />
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="py-3 pr-3 font-semibold text-gray-500 text-xs">Nivel de precio</td>
                      {seleccionados.map((r) => (
                        <td key={`${r.prepaga.slug}-${r.plan.slug}-precio`} className={`py-3 px-3 ${celda(r)}`}>
                          <NivelPrecioBadge nivel={nivelPrecio(r.plan.precio)} />
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="py-3 pr-3 font-semibold text-gray-500 text-xs">Red y copago</td>
                      {seleccionados.map((r) => (
                        <td key={`${r.prepaga.slug}-${r.plan.slug}-calidad`} className={`py-3 px-3 text-xs ${celda(r)}`}>
                          Red {r.plan.redAbierta ? 'abierta' : 'cerrada'} · {r.plan.copago ? 'con copago' : 'sin copago'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="py-3 pr-3 font-semibold text-gray-500 text-xs">Copago</td>
                      {seleccionados.map((r) => (
                        <td key={`${r.prepaga.slug}-${r.plan.slug}-copago`} className={`py-3 px-3 ${celda(r)}`}>
                          {r.plan.copago
                            ? <span className="text-amber-700">Con copago</span>
                            : <span className="text-emerald-700 font-semibold">Sin copago</span>}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="py-3 pr-3 font-semibold text-gray-500 text-xs">Red</td>
                      {seleccionados.map((r) => (
                        <td key={`${r.prepaga.slug}-${r.plan.slug}-red`} className={`py-3 px-3 ${celda(r)}`}>{r.plan.redAbierta ? 'Abierta' : 'Cerrada'}</td>
                      ))}
                    </tr>
                    {COBS.filter((c) => ['odontologia', 'psicologia', 'maternidad', 'urgencias', 'medicamentos', 'optica'].includes(c.id)).map((cob) => (
                      <tr key={cob.id} className="border-t border-gray-100">
                        <td className="py-3 pr-3 font-semibold text-gray-500 text-xs">{cob.label}</td>
                        {seleccionados.map((r) => {
                          const incluida = checkCob(cob.id, r.plan, r.prepaga)
                          return (
                            <td key={`${r.prepaga.slug}-${r.plan.slug}-${cob.id}`} className={`py-3 px-3 ${celda(r)}`}>
                              {incluida
                                ? <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#00875A]"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                                : <span className="text-gray-300">—</span>}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
                <button onClick={() => { setComparando(new Set()); setTablaComparativa(false) }}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                  Limpiar comparación
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      <AsesoramientoPopup open={asesoramientoUrgenteOpen} onClose={() => setAsesoramientoUrgenteOpen(false)} />
    </div>
  )
}
