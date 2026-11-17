import { CARTILLAS, slugPlan } from '@/lib/data/cartilla-zonas'
import { CARTILLA_GRUPOS } from '@/lib/data/cartilla-grupos'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { precioGrupo } from '@/lib/precios/motor'
import { formatPrecio } from '@/lib/utils'
import type { PlanCartilla } from '@/lib/cartilla-zonas-geo'

// Las 3 cartillas de Swiss Medical, Nubial, Global y Premium (17-nov-2026).
// Darío: la gente busca un prestador por la cartilla ("cartilla nubial",
// "swiss medical global", "cartilla premium swiss medical"), también los que
// tienen un plan corporativo con el nombre de la cartilla. Cada cartilla
// tiene su URL, /cartillas/swiss-medical/plan-smg02 (Nubial), plan-smg20
// (Global) y plan-smg30 (Premium). El precio de cada plan sigue en su ficha
// (/prepagas/swiss-medical/[plan]). Ver docs/seo/cartillas-swiss-2026-11.md.
// Qué plan va en cada cartilla: buscador oficial (planes de CARTILLAS) y, para
// los Sport, la agrupación de Darío (cartilla-grupos.ts). Todo lo demás sale
// de la cartilla oficial y del cuadro de la SSSalud.

export interface CartillaSwiss {
  plan: PlanCartilla
  nombre: string
  codigo: string
  href: string
  planes: { slug: string; nombre: string; precio: number | null }[]
  /** Sanatorios para internación en la Ciudad de Buenos Aires */
  internacionCaba: string[]
  /** Zonas y localidades de la cartilla con algún centro de esta cartilla */
  zonas: number
  /** El plan más barato de la cartilla (30 años, CABA y GBA, lista con IVA) */
  desde: { slug: string; nombre: string; precio: number } | null
}

const PRECIO_EDAD = 30

export function cartillasSwiss(): CartillaSwiss[] {
  const c = CARTILLAS['swiss-medical']
  const prep = prepagas.find((p) => p.slug === 'swiss-medical')
  if (!c || !prep) return []
  const caba = c.zonas.find((z) => z.slug === 'caba')
  const grupos = CARTILLA_GRUPOS['swiss-medical'] ?? []
  return c.planes
    .filter((p) => p.cartilla)
    .map((p) => {
      const oficiales = [p.comparadorSlug, ...(p.otrosComparadorSlugs ?? [])].filter((x): x is string => Boolean(x))
      const grupo = grupos.find((g) => oficiales.some((o) => g.planes.includes(o)))
      const slugs = new Set([...oficiales, ...(grupo?.planes ?? [])])
      const planes = prep.planes
        .filter((pl) => slugs.has(pl.slug))
        .map((pl) => ({ slug: pl.slug, nombre: pl.nombre.replace(/^Plan /, ''), precio: precioGrupo('swiss-medical', pl.slug, [PRECIO_EDAD], 'caba')?.total ?? null }))
        .sort((a, b) => (a.precio ?? Infinity) - (b.precio ?? Infinity))
      const conPrecio = planes.filter((x): x is { slug: string; nombre: string; precio: number } => x.precio !== null)
      return {
        plan: p,
        nombre: p.cartilla!,
        codigo: p.codigoCartilla ?? '',
        href: `/cartillas/swiss-medical/${slugPlan(p.id)}`,
        planes,
        internacionCaba: caba ? caba.centros.filter((ce) => ce.internacion.includes(p.id)).map((ce) => ce.nombre) : [],
        zonas: c.zonas.filter((z) => z.centros.some((ce) => ce.internacion.includes(p.id) || ce.guardia.includes(p.id))).length,
        desde: conPrecio[0] ?? null,
      }
    })
}

const lista = (xs: string[]) => xs.join(', ').replace(/, ([^,]*)$/, ' y $1')
const nombresPlanes = (x: CartillaSwiss) => lista(x.planes.map((p) => p.nombre))

/** Respuesta directa para el primer párrafo y la pregunta "¿Qué es la cartilla X?" (GEO) */
export function respuestaCartillaSwiss(id: string): string | null {
  const cs = cartillasSwiss()
  const i = cs.findIndex((x) => x.plan.id === id)
  if (i < 0) return null
  const x = cs[i]
  const posicion = i === 0 ? 'la de entrada' : i === cs.length - 1 ? 'la más completa' : 'la del medio'
  const otras = cs.filter((_, j) => j !== i).map((o) => `${o.internacionCaba.length} de la ${o.nombre}`)
  const fecha = CARTILLAS['swiss-medical']?.vigencia
  return `La cartilla ${x.nombre} de Swiss Medical es la de los planes ${nombresPlanes(x)}${x.codigo ? ` (código ${x.codigo} en el buscador oficial)` : ''}. De las tres cartillas de Swiss (${lista(cs.map((o) => o.nombre))}), es ${posicion}. En la Ciudad de Buenos Aires tiene ${x.internacionCaba.length} sanatorios para internación, contra ${lista(otras)}${fecha ? ` (cartilla oficial consultada el ${fecha})` : ''}.`
}

/** Preguntas propias de la cartilla, para la página de cada una */
export function faqsCartillaSwiss(id: string): { q: string; a: string }[] {
  const cs = cartillasSwiss()
  const i = cs.findIndex((x) => x.plan.id === id)
  if (i < 0) return []
  const x = cs[i]
  const faqs: { q: string; a: string }[] = []
  const resp = respuestaCartillaSwiss(id)
  if (resp) faqs.push({ q: `¿Qué es la cartilla ${x.nombre} de Swiss Medical?`, a: resp })
  if (x.desde) {
    const otros = x.planes.filter((p) => p.precio !== null && p.slug !== x.desde!.slug)
    faqs.push({
      q: `¿Cuánto cuesta un plan con cartilla ${x.nombre}?`,
      a: `Desde ${formatPrecio(x.desde.precio)} por mes, que es el ${x.desde.nombre} para una persona de ${PRECIO_EDAD} años${otros.length ? ` (${otros.map((p) => `${p.nombre}: ${formatPrecio(p.precio!)}`).join('; ')})` : ''}. Son precios de lista de ${PRECIO_ACTUALIZADO.toLowerCase()} en CABA y GBA, contratación directa, IVA incluido, según el cuadro oficial de la SSSalud. El precio cambia con la edad: la tabla completa está en la página de cada plan.`,
    })
  }
  faqs.push({
    q: '¿Cómo sé qué cartilla tengo en Swiss Medical?',
    a: `Depende de tu plan: ${cs.map((o) => `${nombresPlanes(o)} usan la ${o.nombre}`).join('; ')}. Si tu plan no está en la lista (por ejemplo, un plan corporativo), confirmalo en la cartilla oficial de Swiss Medical.`,
  })
  return faqs
}

