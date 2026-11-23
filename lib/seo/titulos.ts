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

/** "$320.904": monto sin espacio, para títulos (formatPrecio pone "$ 320.904") */
export const pesosTitulo = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`

/**
 * Fichas y planes con el precio "desde" y el mes en el título (29-oct-2026,
 * ola 2 de CTR, Search Console al 28-oct: muchas impresiones y CTR < 0,7%).
 * Swiss Medical queda con el título de la ola 1 hasta medirlo (mediados de
 * noviembre); su SMG20 sí entra.
 */
export const FICHAS_TITULO_PRECIO = ['osde', 'sancor-salud']
export const PLANES_TITULO_PRECIO = ['osde/210', 'osde/310', 'swiss-medical/smg20']

/**
 * Pruebas de título del 23-nov-2026 (auditoría de CTR con Search Console al 22-nov; protocolo y línea de base en
 * docs/seo/pruebas-titulos-2026-11-23.md). Medir a las 2-4 semanas, página por página:
 *  · A30: el precio de referencia a los 30 años en vez del "desde" de la franja más joven (OSDE 410 y 510).
 *  · CON_PLAN: "Plan SMG20 …", como se busca ("plan smg20 swiss medical", 0,3% de CTR en la posición 9).
 */
export const PLANES_TITULO_PRECIO_A30 = ['osde/410', 'osde/510']
export const PLANES_TITULO_CON_PLAN = ['swiss-medical/smg20']

/**
 * Fichas de plan con "precio" en el H1 y la respuesta directa arriba de todo (9-nov-2026, Search
 * Console al 7-nov: "osde 210 precio" en la posición 8,0 y "osde 310 precio" en la 8,5, con CTR < 1%).
 * Medir a las 2-4 semanas contra docs/seo/datos/gsc-2026-11-09.
 */
export const PLANES_PRECIO_ARRIBA = ['osde/210', 'osde/310']

/**
 * Fichas de prepaga donde la tabla de planes y precios va antes del aumento y que reciben enlaces internos con el
 * texto "planes y precios de X". Swiss desde el 9-nov-2026; OSDE y Sancor Salud desde el 16-nov-2026 (Search Console
 * del 27-oct al 16-nov: sus consultas de compra, "sancor salud planes y precios", "cotizar sancor salud", "osde planes
 * precios 2026", están en la posición 8 a 12 y casi sin clics).
 */
export const FICHAS_PRECIOS_PRIMERO = ['swiss-medical', 'osde', 'sancor-salud']
