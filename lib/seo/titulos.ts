// Títulos y descripciones para Google (17-oct-2026, ola 1 de CTR).
// Reglas: 50-60 caracteres (los de 51-60 son los que Google menos reescribe),
// la keyword primero y el gancho después, sin la marca del sitio, sin números
// inventados (todo sale de los datos). Cada fórmula recibe variantes de la más
// completa a la más corta y se queda con la primera que entra.
import { PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'

export const MAX_TITULO = 60
export const MAX_DESCRIPCION = 155

/** La primera variante que entra en `max`; si ninguna entra, la más corta. */
export function elegir(variantes: string[], max = MAX_TITULO): string {
  const limpias = variantes.map((v) => v.replace(/\s+/g, ' ').trim())
  return limpias.find((v) => v.length <= max) ?? [...limpias].sort((a, b) => a.length - b.length)[0]
}

/** "Octubre 2026" → "2026" */
export const anioPrecios = () => PRECIO_ACTUALIZADO.match(/\d{4}/)?.[0] ?? String(new Date().getFullYear())

/** "Octubre 2026" → "oct 2026" */
export const mesCorto = () => {
  const [mes, anio] = PRECIO_ACTUALIZADO.split(' ')
  return `${mes.slice(0, 3).toLowerCase()} ${anio}`
}

/** "Plan de Salud Hospital Italiano" → "Hospital Italiano"; el resto igual. */
export const nombreCortoPrepaga = (nombre: string) => nombre.replace(/^Plan de Salud /, '')

/** "Plan 210" → "210", "Plan Flux" → "Flux" */
export const codigoCorto = (nombrePlan: string) => nombrePlan.replace(/^Plan /, '')
