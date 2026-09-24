import { prepagas } from './prepagas'
import { planesConTarifa } from '@/lib/precios/motor'

// Prepagas y planes con cuadro oficial (se pueden cotizar con precio exacto
// por edad y zona). Lo usan el chequeo y la calculadora de aportes. Solo
// servidor: pasa por el motor de precios.

export interface PlanCotizable { slug: string; nombre: string; edadMinima?: number; edadMaxima?: number }
export interface PrepagaCotizable { slug: string; nombre: string; planes: PlanCotizable[] }

export function prepagasCotizables(): PrepagaCotizable[] {
  return Object.entries(planesConTarifa()).map(([slug, t]) => {
    const p = prepagas.find((x) => x.slug === slug)
    if (!p) return null
    const planes = p.planes
      .filter((pl) => t.planes.includes(pl.slug))
      .map((pl) => ({ slug: pl.slug, nombre: pl.nombre, ...(pl.edadMinima ? { edadMinima: pl.edadMinima } : {}), ...(pl.edadMaxima ? { edadMaxima: pl.edadMaxima } : {}) }))
    return planes.length ? { slug, nombre: p.nombre, planes } : null
  }).filter((x): x is PrepagaCotizable => x !== null).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
}
