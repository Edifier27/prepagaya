import type { ReactNode } from 'react'
import { terminos, type Termino } from '@/lib/data/glosario'
import { TerminoGlosario } from './TerminoGlosario'

// Marca en un texto la primera aparición de cada término del glosario
// (lib/data/glosario.ts, campo `alias`). Igual que enlazarPrepagas, el Set
// `vistos` se comparte en toda la página: cada término se explica una sola
// vez, así el texto no se llena de subrayados.

// Minúsculas y sin tildes, sin cambiar el largo (los índices sirven para el
// texto original)
const DE = 'áàäâéèëêíìïîóòöôúùüûñÁÀÄÂÉÈËÊÍÌÏÎÓÒÖÔÚÙÜÛÑ'
const A = 'aaaaeeeeiiiioooouuuunaaaaeeeeiiiioooouuuun'
const plano = (s: string) => {
  let out = ''
  for (const c of s) {
    const i = DE.indexOf(c)
    out += i >= 0 ? A[i] : c.toLowerCase()
  }
  return out
}
const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const PATRONES: { re: RegExp; t: Termino }[] = terminos
  .flatMap((t) => (t.alias ?? []).map((a) => ({ a: plano(a), t })))
  .sort((x, y) => y.a.length - x.a.length)
  .map(({ a, t }) => ({ re: new RegExp(`(?<![a-z0-9])${escapar(a)}(?![a-z0-9])`), t }))

/** Términos que aparecen en un texto, en el orden de su primera aparición */
export function terminosEnTexto(texto: string): Termino[] {
  const p = plano(texto)
  const hallados = new Map<string, { t: Termino; i: number }>()
  for (const { re, t } of PATRONES) {
    const m = re.exec(p)
    if (!m) continue
    const previo = hallados.get(t.slug)
    if (!previo || m.index < previo.i) hallados.set(t.slug, { t, i: m.index })
  }
  return [...hallados.values()].sort((a, b) => a.i - b.i).map((x) => x.t)
}

function marcarCadena(texto: string, vistos: Set<string>, clave: { k: number }): ReactNode[] {
  const partes: ReactNode[] = []
  let resto = texto
  for (;;) {
    const p = plano(resto)
    let mejor: { i: number; largo: number; t: Termino } | null = null
    for (const { re, t } of PATRONES) {
      if (vistos.has(t.slug)) continue
      const m = re.exec(p)
      if (m && (!mejor || m.index < mejor.i || (m.index === mejor.i && m[0].length > mejor.largo))) mejor = { i: m.index, largo: m[0].length, t }
    }
    if (!mejor) break
    vistos.add(mejor.t.slug)
    partes.push(resto.slice(0, mejor.i))
    partes.push(
      <TerminoGlosario key={`g${clave.k++}`} slug={mejor.t.slug} termino={mejor.t.termino} definicion={mejor.t.definicion}>
        {resto.slice(mejor.i, mejor.i + mejor.largo)}
      </TerminoGlosario>,
    )
    resto = resto.slice(mejor.i + mejor.largo)
  }
  partes.push(resto)
  return partes
}

/** Recibe un texto o lo que devuelve enlazarPrepagas (textos y links) y
 *  marca los términos solo en las partes de texto. */
export function marcarTerminos(contenido: string | ReactNode[], vistos: Set<string>): ReactNode[] {
  const nodos = typeof contenido === 'string' ? [contenido] : contenido
  const clave = { k: 0 }
  return nodos.flatMap((n) => (typeof n === 'string' ? marcarCadena(n, vistos, clave) : [n]))
}
