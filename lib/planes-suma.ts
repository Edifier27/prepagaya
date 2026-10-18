import { prepagas } from '@/lib/data/prepagas'
import { coberturasMarca } from '@/lib/data/coberturas-marca'

// Qué suma cada plan frente al plan anterior de la misma prepaga (18-oct-2026,
// Darío: en el comparador, "el SMG30 suma reintegros… el SMG50 suma una
// cirugía estética", resaltado, que vaya sumando). Solo con las fichas
// oficiales (lib/data/coberturas-marca.ts) y el copago. Se calcula en el
// servidor y al comparador le llega solo el resultado (los datos de
// coberturas pesan ~56 KB y no hace falta mandarlos al navegador).

export interface SumaPlan {
  /** Plan anterior de la escalera, ej. "SMG20" */
  anterior: string
  suma: { nombre: string; detalle?: string }[]
}

const esVariante = (slug: string) => slug.startsWith('sport') || slug.endsWith('-cc') || slug.includes('digital-flex')

/** { "swiss-medical/smg30": { anterior: "SMG20", suma: [...] } } */
export function sumasPorPlan(): Record<string, SumaPlan> {
  const out: Record<string, SumaPlan> = {}
  for (const prep of prepagas) {
    const temas = coberturasMarca.filter((c) => c.prepagaSlug === prep.slug)
    if (!temas.length) continue
    const escalera = prep.planes
      .filter((pl) => !esVariante(pl.slug) && !pl.edadMaxima && Number.isFinite(pl.precio))
      .sort((a, b) => a.precio - b.precio)
    for (let i = 1; i < escalera.length; i++) {
      const [ant, pl] = [escalera[i - 1], escalera[i]]
      const suma: SumaPlan['suma'] = []
      if (ant.copago && !pl.copago) suma.push({ nombre: 'Sin copago' })
      for (const t of temas) {
        const f = t.planes.find((x) => x.planSlugs.includes(pl.slug))
        const fa = t.planes.find((x) => x.planSlugs.includes(ant.slug))
        if (!f || f.sinDato || !f.incluido) continue
        // Sin dato del plan anterior no se puede afirmar que "suma"
        if (!fa || fa.sinDato) continue
        const nuevo = !fa.incluido
        const mejora = fa.incluido && !!f.detalle && !!fa.detalle && f.detalle !== fa.detalle
        if (nuevo || mejora) suma.push({ nombre: t.temaNombre, detalle: f.detalle })
      }
      if (suma.length) out[`${prep.slug}/${pl.slug}`] = { anterior: ant.nombre.replace(/^Plan /, ''), suma: suma.slice(0, 3) }
    }
  }
  return out
}
