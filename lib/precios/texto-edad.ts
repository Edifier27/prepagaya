import { formatPrecio } from '@/lib/utils'

type Rango = { desde: number; hasta: number; precio: number }

/**
 * Precio por edad en una frase, para respuestas directas (GEO, 30-oct-2026).
 * Con pocas franjas (OSDE tiene 3, Avalian y Premedic 5) se nombran las
 * franjas; con muchas (Swiss 7, Medifé 9) se dan las edades que más se
 * preguntan, salteando la que cae en la misma franja que la anterior, para
 * no repetir el mismo precio ni hacer una frase eterna.
 *   OSDE 210 → "$ 208.430 hasta los 27 años, $ 320.904 de 28 a 35 y $ 520.047 de 36 a 66"
 *   SMG20    → "$ 353.333 a los 30 años, $ 423.986 a los 40, $ 489.717 a los 50 y $ 827.602 a los 60"
 */
export function precioPorEdadEnFrase(rangos: Rango[], edades = [30, 40, 50, 60]): string {
  const y = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}` : xs[0] ?? '')
  if (rangos.length <= 5) {
    return y(rangos.map((r, i) =>
      r.desde === 0 ? `${formatPrecio(r.precio)} hasta los ${r.hasta} años`
        : r.desde === r.hasta ? `${formatPrecio(r.precio)} a los ${r.desde}`
        : `${formatPrecio(r.precio)} de ${r.desde} a ${r.hasta}${i === 0 ? ' años' : ''}`))
  }
  const partes: string[] = []
  let anterior: Rango | undefined
  for (const e of edades) {
    const r = rangos.find((x) => x.desde <= e && e <= x.hasta)
    if (!r || r === anterior) continue
    partes.push(`${formatPrecio(r.precio)} a los ${e}${partes.length === 0 ? ' años' : ''}`)
    anterior = r
  }
  return y(partes)
}

/** "Avalian" + "Cerca AS100" → "Avalian Cerca AS100"; "Medifé" + "Medifé+" → "Medifé+" (sin repetir la marca) */
export function planConMarca(marca: string, plan: string): string {
  return plan.toLowerCase().startsWith(marca.toLowerCase()) ? plan : `${marca} ${plan}`
}
