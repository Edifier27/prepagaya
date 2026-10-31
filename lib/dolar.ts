// Dólar oficial del día para las páginas internacionales (Darío, 31-oct-2026):
// los precios se muestran también en dólares aproximados. Fuente: API de
// Estadísticas Cambiarias del BCRA (cotización del dólar, sin clave). Se
// pide una vez cada 12 horas (ISR); si no responde, no se muestran dólares
// (nada inventado ni guardado a mano).
const URL_BCRA = 'https://api.bcra.gob.ar/estadisticascambiarias/v1.0/Cotizaciones/USD'

export interface Dolar {
  /** Pesos por dólar */
  valor: number
  /** "2026-10-31" */
  fecha: string
}

type Cotizacion = { fecha?: string | null; detalle?: { codigoMoneda?: string; tipoCotizacion?: number }[] }

/** La cotización más reciente con valor razonable de la respuesta del BCRA */
export function leerDolarBcra(json: unknown): Dolar | null {
  const results = (json as { results?: Cotizacion | Cotizacion[] })?.results
  const lista = Array.isArray(results) ? results : results ? [results] : []
  const validas = lista.flatMap((c) => {
    const d = c.detalle?.find((x) => !x.codigoMoneda || x.codigoMoneda === 'USD')
    const valor = Number(d?.tipoCotizacion)
    return c.fecha && Number.isFinite(valor) && valor > 10 && valor < 1_000_000 ? [{ valor, fecha: c.fecha.slice(0, 10) }] : []
  })
  return validas.sort((a, b) => b.fecha.localeCompare(a.fecha))[0] ?? null
}

export async function dolarOficial(): Promise<Dolar | null> {
  // Solo en desarrollo: DOLAR_PRUEBA="1490@2026-10-30" para ver la página con
  // dólares sin acceso al BCRA. En producción no se lee.
  const prueba = process.env.NODE_ENV !== 'production' ? process.env.DOLAR_PRUEBA?.match(/^([\d.]+)@(\d{4}-\d{2}-\d{2})$/) : null
  if (prueba) return { valor: Number(prueba[1]), fecha: prueba[2] }
  try {
    const r = await fetch(URL_BCRA, { next: { revalidate: 43200 }, signal: AbortSignal.timeout(6000) })
    if (!r.ok) {
      console.error('[DOLAR] BCRA respondió', r.status)
      return null
    }
    const json = await r.json()
    const d = leerDolarBcra(json)
    if (!d) console.error('[DOLAR] respuesta del BCRA sin cotización:', JSON.stringify(json).slice(0, 300))
    return d
  } catch (err) {
    console.error('[DOLAR] no se pudo leer el BCRA:', err instanceof Error ? `${err.name}: ${err.message} ${String((err as { cause?: unknown }).cause ?? '')}` : err)
    return null
  }
}

/** "US$240" (redondeado, sin decimales) */
export const usd = (ars: number, dolar: Dolar) => `US$${Math.round(ars / dolar.valor).toLocaleString('en-US')}`
