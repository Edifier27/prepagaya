import { PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { formatPrecio, precioDesde, SITE_URL } from '@/lib/utils'
import type { Prepaga } from '@/types'

// Direcciones, tamaño y texto alternativo de la imagen de cada plan y ficha.
// Aparte de lib/og/tarjeta.tsx para que las páginas no carguen next/og.

type Plan = Prepaga['planes'][number]

export const OG_SIZE = { width: 1200, height: 630 }

export const rutaOgPlan = (prepSlug: string, planSlug: string) => `/og/${prepSlug}/${planSlug}`
export const urlOgPlan = (prepSlug: string, planSlug: string) => `${SITE_URL}${rutaOgPlan(prepSlug, planSlug)}`
export const urlOgPrepaga = (prepSlug: string) => `${SITE_URL}/og/${prepSlug}`

export const mes = () => PRECIO_ACTUALIZADO.toLowerCase()

export function altOgPlan(prep: Prepaga, plan: Plan) {
  return Number.isFinite(plan.precio)
    ? `Precio del ${plan.nombre} de ${prep.nombre}: ${formatPrecio(plan.precio)} por mes a los 30 años (${mes()}), ${plan.copago ? 'con' : 'sin'} copago`
    : `${plan.nombre} de ${prep.nombre}: ${plan.copago ? 'con' : 'sin'} copago, red ${plan.redAbierta ? 'abierta' : 'cerrada'}, precio a cotizar`
}

export function altOgPrepaga(prep: Prepaga) {
  const desde = precioDesde(prep)
  return Number.isFinite(desde)
    ? `Planes y precios de ${prep.nombre} en ${mes()}: ${prep.planes.length} planes desde ${formatPrecio(desde)} por mes`
    : `Planes de ${prep.nombre}: ${prep.planes.length} planes, precio a cotizar`
}
