import { escalaPorEdad } from '@/lib/precios/motor'

// Tarifa de hijo de Swiss Medical (6-nov-2026, Darío: "un hijo paga mucho
// menos"). El cuadro de la SSSalud trae un solo precio por persona y franja
// de edad (0 a 35 años): no distingue hijos. La lista comercial de Swiss, la
// que usa el cotizador del CRM (crm-asesor, lib/cotizador.js y la lista de
// octubre 2026 de supabase/migrations/0006_cotizador.sql), sí: primer hijo
// (hj1) e hijos siguientes (hjA), solo para menores de 21; de 21 en adelante
// pagan por su edad, como un adulto.
// Se guarda la proporción hijo/adulto de esa lista (AMBA, contratación
// directa; es la misma en todas las zonas) y se aplica al precio oficial
// vigente del adulto de 0 a 35, así el número sigue al cuadro de cada mes.
const LISTA_OCT_2026: Record<string, { h35: number; hj1: number; hjA: number }> = {
  s1: { h35: 201283, hj1: 143480, hjA: 104055 },
  smg02: { h35: 283109, hj1: 201808, hjA: 146355 },
  s2: { h35: 252698, hj1: 213611, hjA: 153309 },
  'sport-s': { h35: 313961, hj1: 265398, hjA: 190477 },
  smg20: { h35: 353332, hj1: 298680, hjA: 214363 },
  smg30: { h35: 405892, hj1: 347486, hjA: 249136 },
  sport: { h35: 413399, hj1: 349456, hjA: 250805 },
  smg40: { h35: 424233, hj1: 363118, hjA: 260091 },
  'sport-plus': { h35: 483625, hj1: 413955, hjA: 296504 },
  smg50: { h35: 530091, hj1: 394322, hjA: 281940 },
  smg60: { h35: 746423, hj1: 425587, hjA: 303788 },
  smg70: { h35: 908349, hj1: 456790, hjA: 325637 },
}

/** Hasta qué edad un hijo paga tarifa de hijo (de 21 en adelante paga por su edad) */
export const EDAD_TARIFA_HIJO = 21
/** Un hijo soltero puede estar en el grupo hasta los 29 (el reglamento lo da de baja a los 30) */
export const EDAD_MAX_HIJO_SWISS = 29
/** Padres o suegros a cargo: hasta los 65 (Darío, 6-nov-2026) */
export const EDAD_MAX_FAMILIAR_A_CARGO = 65

export interface IntegranteSwiss {
  edad: number
  hijo?: boolean
}

/** Precio de lista por mes de cada integrante en un plan de Swiss (CABA y GBA, directo, IVA incluido). */
export function precioGrupoSwiss(plan: string, integrantes: IntegranteSwiss[]): { total: number; porPersona: number[] } | null {
  const escala = escalaPorEdad('swiss-medical', plan, 'caba')
  const lista = LISTA_OCT_2026[plan]
  if (!escala || !lista || integrantes.length === 0) return null
  const adulto = (edad: number) => escala.rangos.find((r) => r.desde <= edad && edad <= r.hasta)?.precio
  let hijos = 0
  const porPersona: number[] = []
  for (const p of integrantes) {
    if (p.hijo && p.edad < EDAD_TARIFA_HIJO) {
      const base = adulto(0)
      if (!base) return null
      porPersona.push(Math.round(base * (hijos++ === 0 ? lista.hj1 : lista.hjA) / lista.h35))
    } else {
      const v = adulto(p.edad)
      if (!v) return null
      porPersona.push(v)
    }
  }
  return { total: porPersona.reduce((s, x) => s + x, 0), porPersona }
}

/** Precio por mes del primer hijo y de los siguientes en un plan */
export function tarifaHijosSwiss(plan: string): { primero: number; siguientes: number } | null {
  const r = precioGrupoSwiss(plan, [{ edad: 5, hijo: true }, { edad: 8, hijo: true }])
  return r ? { primero: r.porPersona[0], siguientes: r.porPersona[1] } : null
}
