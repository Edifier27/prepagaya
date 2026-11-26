// Planes para estudiantes extranjeros (26-nov-2026): Swiss Medical afilia con
// pasaporte o residencia precaria (Darío). Precio de lista oficial a los 22
// años en CABA y GBA, el mismo que paga un argentino de esa edad. Sin el
// descuento por edad de Swiss: se comunica después, en la cotización.
import { prepagas } from '@/lib/data/prepagas'
import { precioGrupo } from '@/lib/precios/motor'
import { codigoCorto } from '@/lib/seo/titulos'

export const EDAD_ESTUDIANTE = 22
const PLANES = ['s1', 'smg02', 'smg20'] as const

export interface FilaEstudiante { planSlug: string; plan: string; copago: boolean; precio: number }

/** S1, SMG02 y SMG20 de Swiss Medical a los 22 años (solo los que tienen precio oficial) */
export function planesEstudiante(): FilaEstudiante[] {
  const swiss = prepagas.find((p) => p.slug === 'swiss-medical')
  return PLANES.flatMap((planSlug) => {
    const pl = swiss?.planes.find((x) => x.slug === planSlug)
    const r = precioGrupo('swiss-medical', planSlug, [EDAD_ESTUDIANTE], 'caba')
    return pl && r ? [{ planSlug, plan: codigoCorto(pl.nombre), copago: pl.copago, precio: r.total }] : []
  })
}
