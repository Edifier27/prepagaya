// Solo servidor (lib/data/numeracion-ar.json pesa ~200 KB): ¿el celular que
// dejó la persona existe? Se fija que el código de área y los primeros
// dígitos estén en un bloque asignado por ENACOM y que ese bloque sea de
// telefonía móvil (Darío, 25-oct-2026: los números inventados ensucian los
// leads y gastan mensajes de WhatsApp). No confirma que la línea esté
// activa: solo que el número podría existir. Los bloques se actualizan con
// scripts/numeracion-enacom/generar.py.
import numeracion from '@/lib/data/numeracion-ar.json'

export type MotivoCelular = 'formato' | 'sin-area' | 'inexistente' | 'fijo'
export type ResultadoCelular = { ok: true; numero: string } | { ok: false; motivo: MotivoCelular }

const aMapa = (d: Record<string, string>) => new Map(Object.entries(d).map(([k, v]) => [k, new Set(v.split(','))]))
const MOVIL = aMapa(numeracion.movil)
const FIJO = aMapa(numeracion.fijo)
const INDICATIVOS = new Set([...MOVIL.keys(), ...FIJO.keys()])

/** ¿Algún bloque de este número (10 dígitos) está en la lista? */
function enBloques(numero: string, tabla: Map<string, Set<string>>): boolean {
  for (const largo of [2, 3, 4]) {
    const bloques = tabla.get(numero.slice(0, largo))
    if (!bloques) continue
    for (let fin = largo + 1; fin <= 10; fin++) if (bloques.has(numero.slice(largo, fin))) return true
  }
  return false
}

/** Formas en que la gente escribe un celular argentino → candidatos de 10
 *  dígitos (código de área sin 0 + número sin 15). */
function candidatos(raw: string): string[] | MotivoCelular {
  let d = raw.replace(/\D/g, '')
  if (d.startsWith('00')) d = d.slice(2)
  if (d.startsWith('54') && d.length >= 12) d = d.slice(2)
  if (d.startsWith('9') && d.length === 11) d = d.slice(1)
  if (d.startsWith('0')) d = d.slice(1)
  // "15 2345-6789" o "4567-8901": sin código de área
  if (d.length === 8 || (d.length === 10 && d.startsWith('15'))) return 'sin-area'
  if (d.length === 10) return [d]
  if (d.length === 12) {
    // "11 15 2345-6789", "351 15 555-1234": se saca el 15 después del código de área
    const lista = [2, 3, 4].filter((l) => INDICATIVOS.has(d.slice(0, l)) && d.slice(l, l + 2) === '15').map((l) => d.slice(0, l) + d.slice(l + 2))
    return lista.length ? lista : 'formato'
  }
  return 'formato'
}

export function verificarCelularAR(raw: string): ResultadoCelular {
  const c = candidatos(raw)
  if (typeof c === 'string') return { ok: false, motivo: c }
  const movil = c.find((n) => enBloques(n, MOVIL))
  if (movil) return { ok: true, numero: movil }
  return { ok: false, motivo: c.some((n) => enBloques(n, FIJO)) ? 'fijo' : 'inexistente' }
}

/** Texto para la persona, en el formulario. */
export const MENSAJE_CELULAR: Record<MotivoCelular, string> = {
  formato: 'Revisá el número: código de área y número, por ejemplo 11 2345-6789.',
  'sin-area': 'Falta el código de área: por ejemplo 11 en AMBA o 351 en Córdoba.',
  inexistente: 'No encontramos ese número. Revisalo: lo necesitamos para mandarte tu precio por WhatsApp.',
  fijo: 'Ese número es de un teléfono fijo. Dejanos un celular para mandarte tu precio por WhatsApp.',
}
