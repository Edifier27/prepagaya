// Promo de Swiss Medical por integrante (17-nov-2026). Es la regla del
// cotizador del CRM (crm-asesor: lib/cotizador.js, descuento() y
// campaniaSugerida(), reglas de Darío del 10-oct-2026), así el precio del
// sitio da lo mismo que cotiza el asesor:
// - Promo general: 15% a los adultos y 50% a los menores de 26. Pagando
//   directo, también 50% a los hijos de hasta 29.
// - Monotributista sin hijos y sin menores de 26: 25% a todos. Con hijos o
//   con alguien menor de 26 va la general, que le conviene más.
// - Derivando aportes (relación de dependencia) no hay promo monotributo, y
//   el 50% de los hijos de 26 a 29 es solo pagando directo.
// El 50% es obligatorio y se lo cuenta el asesor: en el sitio no se nombra
// (Darío, 17-nov-2026). Solo cambia el número.

import { hijosPorEdades } from '@/lib/precios/tarifa-hijo'

export type SituacionPromo = 'particular' | 'relacion-dependencia' | 'monotributo' | 'responsable-inscripto'

/** Descuento de cada integrante, en el orden de las edades */
export function descuentosSwiss(edades: number[], situacion: SituacionPromo): number[] {
  const deriva = situacion === 'relacion-dependencia'
  const hijos = hijosPorEdades(edades)
  if (situacion === 'monotributo' && !hijos.some(Boolean) && !edades.some((e) => e < 26)) return edades.map(() => 0.25)
  return edades.map((edad, i) => (edad < 26 || (!deriva && hijos[i] && edad < 30) ? 0.5 : 0.15))
}
