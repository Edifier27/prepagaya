import Link from 'next/link'
import type { PlanCartilla, SeccionCartilla } from '@/lib/cartilla-zonas-geo'
import type { CentroCartilla } from '@/lib/data/cartilla-zonas'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'

// Lista de centros de una zona (OSDE / Premedic / Avalian). Sin 'use client'
// y sin importar valores de lib/data/cartilla-zonas (solo tipos) para poder
// usarse tanto en las páginas estáticas como dentro del buscador cliente sin
// arrastrar los JSON de las cartillas al bundle.

// Leyenda de los asteriscos, textual de la cartilla PDF de OSDE.
const MARCA_TEXTO: Record<NonNullable<CentroCartilla['marca']>, string> = {
  mixto: 'Atiende internaciones con su cuerpo profesional o con médicos de cartilla',
  'cuerpo-propio': 'Atiende internaciones solamente con su cuerpo profesional',
  'solo-cartilla': 'Internación con profesionales de cartilla exclusivamente',
}

function telHref(tel: string): string | null {
  const primero = tel.match(/(\(?0?\d{2,4}\)?[\s-]?)?\d{2,4}[\s-]?\d{4}/)
  if (!primero) return null
  const digitos = primero[0].replace(/\D/g, '')
  return digitos.length >= 8 ? `tel:${digitos}` : null
}

function PlanesChips({ incluidos, planes, prepagaSlug }: { incluidos: string[]; planes: PlanCartilla[]; prepagaSlug: string }) {
  return (
    <div className="flex flex-wrap gap-1">
      {planes.map((p) => {
        const si = incluidos.includes(p.id)
        const cls = `text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
          si ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-300 border-gray-100 line-through'
        }`
        const texto = p.label.replace(/^Plan /, '').replace(/ \(.*\)$/, '')
        return si && p.comparadorSlug ? (
          <Link key={p.id} href={`/prepagas/${prepagaSlug}/${p.comparadorSlug}`} className={`${cls} hover:border-emerald-400`} title={p.label}>
            {texto}
          </Link>
        ) : (
          <span key={p.id} className={cls} title={p.label}>{texto}</span>
        )
      })}
    </div>
  )
}

export function CentrosLista({
  centros,
  seccion,
  planes,
  prepagaSlug,
  vacio,
}: {
  centros: CentroCartilla[]
  seccion: SeccionCartilla
  /** Planes a mostrar como chips (en el orden oficial) */
  planes: PlanCartilla[]
  prepagaSlug: string
  vacio?: string
}) {
  const lista = centros.filter((c) => c[seccion].length > 0)
  if (lista.length === 0) {
    return (
      <p className="text-sm text-gray-500 bg-gray-50 border border-gray-100 rounded-xl p-4">
        {vacio ?? (seccion === 'internacion' ? 'No hay sanatorios para internación en esta selección.' : 'No hay guardias en esta selección.')}
      </p>
    )
  }
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {lista.map((c) => {
        const sedes = c.sedes.filter((s) => s.servicios.includes(seccion))
        return (
          <li key={c.nombre} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-2">
            <div>
              <h4 className="font-semibold text-gray-900 text-sm leading-snug">{c.nombre}</h4>
              {c.notas.length > 0 && <div className="text-xs text-amber-700 mt-0.5">{c.notas.join(' ')}</div>}
              {c.servicios && c.servicios.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {c.servicios.map((s) => (
                    <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-100">{s}</span>
                  ))}
                </div>
              )}
            </div>
            <ul className="space-y-1.5">
              {(sedes.length > 0 ? sedes : c.sedes).map((s) => {
                const href = s.tel ? telHref(s.tel) : null
                return (
                  <li key={`${s.direccion}-${s.tel}`} className="text-xs text-gray-600 leading-snug">
                    <span className="text-gray-800">{s.direccion}</span>
                    {s.localidad && <span className="text-gray-500"> · {s.localidad}</span>}
                    {s.tel && (
                      <div className="text-gray-500">
                        Tel.{' '}
                        {href ? (
                          <a href={href} className="hover:text-[#E8002D] underline-offset-2 hover:underline">{s.tel}</a>
                        ) : (
                          s.tel
                        )}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
            <div className="mt-auto pt-1">
              <div className="text-[11px] text-gray-400 mb-1">
                {seccion === 'internacion' ? 'Planes que lo incluyen para internación' : 'Planes con guardia en este centro'}
              </div>
              <PlanesChips incluidos={c[seccion]} planes={planes} prepagaSlug={prepagaSlug} />
              {seccion === 'internacion' && c.marca && (
                <div className="text-[11px] text-gray-400 mt-1.5">{MARCA_TEXTO[c.marca]}.</div>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/**
 * CRO: centros de la zona que el plan elegido NO incluye, con el plan más
 * bajo (en el orden oficial de la prepaga) que sí los incluye. Solo datos de
 * la fuente oficial, sin precios.
 */
export function centrosConPlanSuperior(
  centros: CentroCartilla[],
  plan: string,
  planes: PlanCartilla[],
  /** Planes de menor a mayor cobertura (CartillaPrepaga.escalera) */
  escalera: string[],
  seccion: SeccionCartilla,
): { nombre: string; desde: PlanCartilla }[] {
  const idx = escalera.indexOf(plan)
  if (idx < 0) return []
  return centros
    .filter((c) => c[seccion].length > 0 && !c[seccion].includes(plan))
    .map((c) => {
      const superior = escalera.slice(idx + 1).find((p) => c[seccion].includes(p))
      const desde = superior ? planes.find((p) => p.id === superior) : undefined
      return desde ? { nombre: c.nombre, desde } : null
    })
    .filter((x): x is { nombre: string; desde: PlanCartilla } => x !== null)
}

export function UpsellPlanes({
  items,
  prepagaNombre,
  planLabel,
  zonaCorta,
}: {
  items: { nombre: string; desde: PlanCartilla }[]
  prepagaNombre: string
  planLabel: string
  zonaCorta: string
}) {
  if (items.length === 0) return null
  const porPlan = new Map<string, { plan: PlanCartilla; nombres: string[] }>()
  for (const it of items) {
    const g = porPlan.get(it.desde.id) ?? { plan: it.desde, nombres: [] }
    g.nombres.push(it.nombre)
    porPlan.set(it.desde.id, g)
  }
  return (
    <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5">
      <h3 className="text-base font-bold text-gray-900 mb-1">
        ¿Buscás un sanatorio que el {planLabel} no incluye en {zonaCorta}?
      </h3>
      <p className="text-sm text-gray-600 mb-4">Estos los suma un plan superior de {prepagaNombre}:</p>
      <div className="space-y-3">
        {[...porPlan.values()].map(({ plan, nombres }) => (
          <div key={plan.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 bg-white rounded-xl border border-amber-100 p-3">
            <div className="text-sm">
              <div className="font-semibold text-gray-900">Desde {plan.label}</div>
              <div className="text-gray-600 text-xs mt-0.5 leading-relaxed">{nombres.join(' · ')}</div>
            </div>
            <ContratarPlanButton
              prepagaNombre={prepagaNombre}
              planNombre={plan.label}
              fuente="cartilla-upsell-plan"
              label={`Cotizar ${plan.label}`}
              className="flex-shrink-0 inline-flex items-center justify-center gap-1 px-4 py-2 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-lg transition-all text-xs"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
