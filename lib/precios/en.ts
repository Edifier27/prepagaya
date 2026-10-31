// Datos de precios para las páginas en inglés (31-oct-2026): del cuadro
// oficial, nada escrito a mano. Swiss primero (partner) y el 15% OFF solo ahí.
import { prepagas } from '@/lib/data/prepagas'
import { codigoCorto } from '@/lib/seo/titulos'

/** "AR$90,938" (formato en inglés) */
export const pesosEn = (n: number) => `AR$${Math.round(n).toLocaleString('en-US')}`

export interface FilaPrecioEn { slug: string; prepaga: string; planSlug: string; plan: string; precio: number; copago: boolean; promo: boolean; nota?: string }

// Qué planes muestra la tabla: el de entrada de cada prepaga y los sin
// copago más elegidos de Swiss y OSDE
const PLANES: [string, string, string?][] = [
  ['swiss-medical', 'smg20', 'Most popular Swiss Medical plan'],
  ['swiss-medical', 's1', 'Entry plan'],
  ['osde', '210', 'Entry plan'],
  ['sancor-salud', 'f700', 'Entry plan'],
  ['premedic', 'plan-c100', 'Lowest price in the market'],
]

export function planesTablaEn(): FilaPrecioEn[] {
  return PLANES.flatMap(([slug, planSlug, nota]) => {
    const p = prepagas.find((x) => x.slug === slug)
    const pl = p?.planes.find((x) => x.slug === planSlug)
    if (!p || !pl || !Number.isFinite(pl.precio)) return []
    return [{ slug, prepaga: p.nombre, planSlug, plan: codigoCorto(pl.nombre), precio: pl.precio, copago: pl.copago, promo: slug === 'swiss-medical', nota }]
  })
}

/** Precio de lista a los 30 de un plan */
export function precioPlan(slug: string, planSlug: string): number {
  return prepagas.find((x) => x.slug === slug)?.planes.find((x) => x.slug === planSlug)?.precio ?? NaN
}
