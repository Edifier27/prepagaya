import Link from 'next/link'
import type { ReactNode } from 'react'
import { prepagas } from '@/lib/data/prepagas'

// Enlazado de lo informativo a lo comercial (26-sep-2026): en guías y notas,
// la primera mención de cada prepaga enlaza a su ficha (/prepagas/[slug]),
// con el nombre de la marca como anchor. Solo la primera vez por página (el
// Set `vistas` se comparte entre intro, secciones y conclusión), así el texto
// no se llena de links.

const NOMBRES: { re: RegExp; slug: string }[] = prepagas
  .flatMap((p) => {
    const alias = [p.nombre]
    if (p.slug === 'medife') alias.push('Medifé')
    if (p.slug === 'hospital-italiano') alias.push('Hospital Italiano')
    return alias.map((a) => ({ a, slug: p.slug }))
  })
  .sort((x, y) => y.a.length - x.a.length)
  .map(({ a, slug }) => ({ re: new RegExp(`(?<![\\wÁÉÍÓÚáéíóúñ])${a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\wÁÉÍÓÚáéíóúñ])`), slug }))

export function enlazarPrepagas(texto: string, vistas: Set<string>): ReactNode[] {
  const partes: ReactNode[] = []
  let resto = texto
  let k = 0
  for (;;) {
    let mejor: { i: number; largo: number; slug: string } | null = null
    for (const n of NOMBRES) {
      if (vistas.has(n.slug)) continue
      const m = n.re.exec(resto)
      if (m && (!mejor || m.index < mejor.i)) mejor = { i: m.index, largo: m[0].length, slug: n.slug }
    }
    if (!mejor) break
    vistas.add(mejor.slug)
    partes.push(resto.slice(0, mejor.i))
    partes.push(
      <Link key={k++} href={`/prepagas/${mejor.slug}`} className="text-[#E8002D] font-medium hover:underline">
        {resto.slice(mejor.i, mejor.i + mejor.largo)}
      </Link>,
    )
    resto = resto.slice(mejor.i + mejor.largo)
  }
  partes.push(resto)
  return partes
}

/** Cierre con los planes de las prepagas mencionadas: anchors "Planes de X". */
export function PlanesMencionados({ vistas }: { vistas: Set<string> }) {
  const lista = prepagas.filter((p) => vistas.has(p.slug))
  if (!lista.length) return null
  return (
    <div className="rounded-2xl border border-gray-200 p-5">
      <h2 className="text-base font-bold text-gray-900 mb-3">Planes y precios de las prepagas de esta nota</h2>
      <div className="flex flex-wrap gap-2">
        {lista.map((p) => (
          <Link key={p.slug} href={`/prepagas/${p.slug}`} className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-[#E8002D] hover:text-[#E8002D]">
            Planes de {p.nombre}
          </Link>
        ))}
      </div>
    </div>
  )
}
