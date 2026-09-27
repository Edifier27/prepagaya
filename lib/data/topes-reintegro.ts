import aumentosOficiales from './aumentos-oficiales.json'

// Topes de reintegro que las prepagas actualizan TODOS LOS MESES (Darío,
// 27-sep-2026): "se actualiza todos los meses" y "los reintegros suben el
// mismo % que sube la prepaga". Se guarda el último tope oficial (monto y
// período del alcance del plan) y se lleva al mes más nuevo con los aumentos
// oficiales de la prepaga (lib/data/aumentos-oficiales.json, cuadros de la
// SSSalud), que se cargan todos los meses. Cuando llegue un alcance nuevo,
// se reemplaza la base y el cálculo arranca de ahí.

interface Tope {
  prepagaSlug: string
  /** Monto del alcance oficial del plan */
  monto: number
  /** Período del alcance (AAAAMM) */
  periodo: number
}

/** Swiss Medical SMG50, cirugía estética por reintegro (Alcance de la cobertura SMG50, vigencia 09/2026) */
export const TOPE_CIRUGIA_SMG50: Tope = { prepagaSlug: 'swiss-medical', monto: 3765888, periodo: 202609 }

const MESES = (aumentosOficiales as { meses: Record<string, { label: string; prepagas: Record<string, { mediana: number }> }> }).meses

const pesos = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`
// "Octubre 2026" → "octubre de 2026"
const mesTexto = (label: string) => label.toLowerCase().replace(/ (\d{4})$/, ' de $1')

export function topeActualizado(t: Tope) {
  const base = MESES[String(t.periodo)]
  const posteriores = Object.keys(MESES)
    .filter((m) => Number(m) > t.periodo && MESES[m].prepagas[t.prepagaSlug])
    .sort()
  const factor = posteriores.reduce((f, m) => f * (1 + MESES[m].prepagas[t.prepagaSlug].mediana / 100), 1)
  const ultimo = posteriores.at(-1)
  return {
    baseTexto: pesos(t.monto),
    baseMes: base ? mesTexto(base.label) : String(t.periodo),
    /** Estimado al último mes con aumento oficial, redondeado a miles; undefined si la base es el último mes */
    actualTexto: ultimo ? pesos(Math.round((t.monto * factor) / 1000) * 1000) : undefined,
    actualMes: ultimo ? mesTexto(MESES[ultimo].label) : undefined,
  }
}

const smg50 = topeActualizado(TOPE_CIRUGIA_SMG50)

/** "se actualiza todos los meses, con el mismo porcentaje que la cuota: en septiembre de 2026 era de $3.765.888 y, con los aumentos oficiales de la cuota, en octubre de 2026 queda en unos $3.841.000" */
export const topeCirugiaSmg50 =
  `se actualiza todos los meses, con el mismo porcentaje que la cuota: en ${smg50.baseMes} era de ${smg50.baseTexto}` +
  (smg50.actualTexto ? ` y, con los aumentos oficiales de la cuota, en ${smg50.actualMes} queda en unos ${smg50.actualTexto}` : '')

/** Solo el dato del documento oficial, para los textos que citan esa fuente: "de $3.765.888 en septiembre de 2026" */
export const topeCirugiaSmg50Oficial = `de ${smg50.baseTexto} en ${smg50.baseMes}`
