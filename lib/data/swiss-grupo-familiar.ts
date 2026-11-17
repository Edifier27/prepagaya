import { precioGrupo } from '@/lib/precios/motor'
import { EDAD_TARIFA_HIJO } from '@/lib/precios/tarifa-hijo'

// Grupo familiar de Swiss Medical (6-nov-2026, guía "cómo agregar un
// familiar"). La tarifa de hijo la aplica el motor de precios con la lista
// comercial de Swiss (lib/precios/tarifa-hijo.ts).

export { EDAD_TARIFA_HIJO }
/** Un hijo soltero puede estar en el grupo hasta los 29 (el reglamento lo da de baja a los 30) */
export const EDAD_MAX_HIJO_SWISS = 29
/** Padres o suegros a cargo: hasta los 65 (Darío, 6-nov-2026) */
export const EDAD_MAX_FAMILIAR_A_CARGO = 65

/** Precio por mes del primer hijo y de los siguientes en un plan (CABA y GBA, directo, IVA incluido) */
export function tarifaHijosSwiss(plan: string): { primero: number; siguientes: number } | null {
  // Un adulto con dos hijos: el mayor paga la de primer hijo
  const r = precioGrupo('swiss-medical', plan, [35, 8, 5], 'caba')
  return r ? { primero: r.porPersona[1].precio, siguientes: r.porPersona[2].precio } : null
}
