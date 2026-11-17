// Tarifa de hijo (6-nov-2026, Darío: "un hijo paga mucho menos"). El cuadro
// de la SSSalud trae un solo precio por persona y franja de edad: no distingue
// hijos. La lista comercial de Swiss Medical, la del cotizador del CRM
// (crm-asesor: lib/cotizador.js y la lista de octubre 2026 de
// supabase/migrations/0006_cotizador.sql), sí: precio de primer hijo (hj1) y
// de hijos siguientes (hjA), solo para los menores de 21. De 21 en adelante el
// hijo paga por su edad, como un adulto.
// Se guarda la proporción hijo/adulto de esa lista (AMBA; entre zonas varía
// menos de 0,02%) y el motor la aplica al precio oficial vigente del adulto de
// la primera franja, así el número sigue al cuadro de cada mes. Va por
// modalidad: directo y derivando aportes ("desregulado" en el motor,
// "derivacion" en el CRM) tienen proporciones distintas.
// Sin imports del motor: el motor la importa a ella.

import type { Modalidad } from '@/lib/precios/motor'

/** Hasta qué edad un hijo paga tarifa de hijo (de 21 en adelante, por su edad) */
export const EDAD_TARIFA_HIJO = 21

type Fila = [adulto: number, primerHijo: number, siguientes: number]

const LISTAS: Record<string, Record<Modalidad, Record<string, Fila>>> = {
  'swiss-medical': {
    directo: {
      s1: [201283, 143480, 104055],
      smg02: [283109, 201808, 146355],
      s2: [252698, 213611, 153309],
      'sport-s': [313961, 265398, 190477],
      smg20: [353332, 298680, 214363],
      smg30: [405892, 347486, 249136],
      sport: [413399, 349456, 250805],
      smg40: [424233, 363118, 260091],
      'sport-plus': [483625, 413955, 296504],
      smg50: [530091, 394322, 281940],
      smg60: [746423, 425587, 303788],
      smg70: [908349, 456790, 325637],
    },
    desregulado: {
      s1: [159951, 118372, 86586],
      smg02: [224975, 166493, 121785],
      s2: [197676, 157533, 113778],
      'sport-s': [245599, 195725, 141362],
      smg20: [276398, 220269, 159090],
      smg30: [304520, 256082, 166264],
      sport: [323386, 257715, 186135],
      smg40: [361854, 267388, 173380],
      'sport-plus': [412514, 304822, 197654],
      smg50: [430667, 290000, 187671],
      smg60: [644451, 312670, 201904],
      smg70: [790168, 335339, 216194],
    },
  },
}

/** Proporción del precio de un adulto de la primera franja que paga el primer hijo y los siguientes. */
export function proporcionHijo(prepaga: string, plan: string, modalidad: Modalidad): { primero: number; siguientes: number } | null {
  const f = LISTAS[prepaga]?.[modalidad]?.[plan]
  return f ? { primero: f[1] / f[0], siguientes: f[2] / f[0] } : null
}

/**
 * Quién es hijo cuando solo se conocen las edades, con la regla del CRM
 * (integrantesDesdeTexto): los dos mayores de 21 o más son el titular y la
 * pareja (si nadie tiene 21, el mayor es el titular); el resto son hijos.
 * Devuelve, en el orden de las edades, true para cada hijo.
 */
export function hijosPorEdades(edades: number[]): boolean[] {
  const orden = edades.map((edad, i) => ({ edad, i })).sort((a, b) => b.edad - a.edad)
  const adultos = orden.filter((x) => x.edad >= EDAD_TARIFA_HIJO).slice(0, 2).map((x) => x.i)
  if (!adultos.length && orden.length) adultos.push(orden[0].i)
  return edades.map((_, i) => !adultos.includes(i))
}

/**
 * Quién paga tarifa de hijo: los hijos (hijosPorEdades) menores de 21. El
 * mayor de ellos, la de primer hijo; los demás, la de siguientes. Devuelve,
 * en el orden de las edades, 'primero' | 'siguientes' | null (paga por su edad).
 */
export function tarifaHijoPorIntegrante(edades: number[]): ('primero' | 'siguientes' | null)[] {
  const hijos = hijosPorEdades(edades)
  const out: ('primero' | 'siguientes' | null)[] = edades.map(() => null)
  let n = 0
  for (const i of edades.map((_, i) => i).sort((a, b) => edades[b] - edades[a])) {
    if (!hijos[i] || edades[i] >= EDAD_TARIFA_HIJO) continue
    out[i] = n++ === 0 ? 'primero' : 'siguientes'
  }
  return out
}
