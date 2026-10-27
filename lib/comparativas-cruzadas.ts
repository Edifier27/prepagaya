// Solo del lado del servidor (usa el motor de precios y las cartillas).
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { escalaPorEdad, precioGrupo } from '@/lib/precios/motor'
import { CARTILLAS, linkCartillaPlan } from '@/lib/data/cartilla-zonas'
import { formatPrecio } from '@/lib/utils'
import type { Prepaga } from '@/types'

// Comparaciones plan contra plan entre DOS prepagas (11-oct-2026). Las de un
// mismo plan vecino (smg20-vs-smg30) ya existen; faltaba la equivalencia
// entre marcas, que es como se busca "osde o swiss medical" ("que es mejor
// osde o swiss medical", "osde vs swiss medical", 20-23 impresiones cada una
// en Search Console). Todo sale de datos con fuente: cuadros SSSalud por
// edad y cartillas oficiales (sanatorios con internación en CABA).

export interface ParCruzado {
  slug: string
  a: [string, string] // [prepaga, plan] — Swiss Medical siempre primero
  b: [string, string]
}

export const PARES_CRUZADOS: ParCruzado[] = [
  { slug: 'swiss-medical-smg20-vs-osde-310', a: ['swiss-medical', 'smg20'], b: ['osde', '310'] },
  { slug: 'swiss-medical-smg02-vs-osde-210', a: ['swiss-medical', 'smg02'], b: ['osde', '210'] },
  { slug: 'swiss-medical-smg30-vs-osde-410', a: ['swiss-medical', 'smg30'], b: ['osde', '410'] },
  { slug: 'swiss-medical-smg20-vs-sancor-salud-plan-3000', a: ['swiss-medical', 'smg20'], b: ['sancor-salud', 'plan-3000'] },
]

type Plan = Prepaga['planes'][number]
export interface LadoCruzado {
  prep: Prepaga
  plan: Plan
  nombre: string // "Swiss Medical SMG20", "OSDE 310"
  sanatorios: string[] // con internación en CABA, según la cartilla oficial
  cartillaHref: string | null
}

export const EDADES_CRUZADAS = [25, 30, 40, 50, 60, 65]

const codigo = (pl: Plan) => (/\d/.test(pl.nombre) ? pl.nombre.replace(/^Plan /, '') : pl.nombre)

function lado(prepSlug: string, planSlug: string): LadoCruzado | null {
  const prep = prepagas.find((p) => p.slug === prepSlug)
  const plan = prep?.planes.find((x) => x.slug === planSlug)
  if (!prep || !plan || !escalaPorEdad(prepSlug, planSlug, 'caba')) return null
  const c = CARTILLAS[prepSlug]
  const pc = c?.planes.find((x) => x.comparadorSlug === planSlug || x.otrosComparadorSlugs?.includes(planSlug))
  const caba = c?.zonas.find((z) => z.slug === 'caba')
  const sanatorios = pc && caba ? caba.centros.filter((x) => x.internacion.includes(pc.id)).map((x) => x.nombre) : []
  return { prep, plan, nombre: `${prep.nombre} ${codigo(plan)}`, sanatorios, cartillaHref: linkCartillaPlan(prepSlug, planSlug)?.href ?? null }
}

export const precioA = (l: LadoCruzado, edad: number) => precioGrupo(l.prep.slug, l.plan.slug, [edad], 'caba')?.total ?? null

// Para comparar sanatorios entre cartillas: los nombres vienen escritos
// distinto ("Sanatorio de la Trinidad Palermo" / "SANATORIO TRINIDAD").
const norm = (s: string) => s.replace(/\./g, '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\b(sanatorio|clinica|hospital|instituto|de|la|del|el|los|las|y|s\.?a\.?)\b/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim()
function mismoCentro(x: string, y: string) {
  const [a, b] = [norm(x), norm(y)]
  return a === b || (a.length > 4 && b.includes(a)) || (b.length > 4 && a.includes(b))
}

export function comparacionCruzada(slug: string) {
  const par = PARES_CRUZADOS.find((x) => x.slug === slug)
  if (!par) return null
  const a = lado(...par.a)
  const b = lado(...par.b)
  if (!a || !b) return null
  // Igual que en las cartillas de OSDE (bloque de Swiss por ciudad): la
  // comparación de sanatorios se muestra solo donde Swiss Medical tiene igual
  // o más en CABA. Donde no, se enlaza la cartilla de cada plan.
  const conSanatorios = a.sanatorios.length > 0 && a.sanatorios.length >= b.sanatorios.length
  const soloA = a.sanatorios.filter((x) => !b.sanatorios.some((y) => mismoCentro(x, y)))
  const soloB = b.sanatorios.filter((y) => !a.sanatorios.some((x) => mismoCentro(x, y)))
  const precios = EDADES_CRUZADAS.map((e) => ({ edad: e, a: precioA(a, e), b: precioA(b, e) }))
  const p30 = precios.find((x) => x.edad === 30)!
  const mes = PRECIO_ACTUALIZADO.toLowerCase()
  const titulo = `${a.nombre} vs ${b.nombre}: precio, cartilla y cuál conviene`
  const descripcion = `${a.nombre} o ${b.nombre}: precio oficial por edad (${mes}), copago y la cartilla oficial de cada uno. Mirá cuál te conviene a tu edad.`

  const masBarato30 = p30.a !== null && p30.b !== null ? (p30.a <= p30.b ? a : b) : null
  const dif30 = p30.a !== null && p30.b !== null ? Math.abs(p30.a - p30.b) : null
  const respuestaCorta = [
    masBarato30 && dif30 !== null
      ? `A los 30 años, el ${masBarato30.nombre} sale ${formatPrecio(dif30)} menos por mes (lista oficial de ${mes}, CABA y GBA, IVA incluido).`
      : '',
    `${a.nombre}: ${a.plan.copago ? 'con' : 'sin'} copago${conSanatorios ? `, ${a.sanatorios.length} sanatorios con internación en CABA` : ''}. ${b.nombre}: ${b.plan.copago ? 'con' : 'sin'} copago${conSanatorios ? `, ${b.sanatorios.length} sanatorios con internación en CABA` : ''}.`,
  ].filter(Boolean).join(' ')

  const faq: { q: string; a: string }[] = [
    {
      q: `¿Qué es más barato, ${a.nombre} o ${b.nombre}?`,
      a: `Depende de la edad. Según los cuadros que cada prepaga declara ante la Superintendencia de Servicios de Salud (${mes}, CABA y GBA, IVA incluido): ${precios.filter((x) => x.a && x.b).map((x) => `a los ${x.edad} años, ${formatPrecio(x.a!)} el ${a.nombre} y ${formatPrecio(x.b!)} el ${b.nombre}`).join('; ')}. Cotizando online tenés 15% OFF.`,
    },
    ...(conSanatorios && b.sanatorios.length
      ? [{
          q: `¿Qué sanatorios tiene cada uno en CABA?`,
          a: `Según las cartillas oficiales, el ${a.nombre} tiene ${a.sanatorios.length} sanatorios con internación en la Ciudad de Buenos Aires y el ${b.nombre}, ${b.sanatorios.length}.${soloA.length ? ` Solo en el ${a.nombre}: ${soloA.slice(0, 6).join(', ')}.` : ''}${soloB.length ? ` Solo en el ${b.nombre}: ${soloB.slice(0, 6).join(', ')}.` : ''}`,
        }]
      : []),
    {
      q: `¿Puedo pasarme de ${b.prep.nombre} a ${a.prep.nombre} con mis aportes?`,
      a: `Sí. Si trabajás en relación de dependencia, tus aportes se pueden derivar a cualquiera de las dos y pagás solo la diferencia. Al cambiar de prepaga empezás de cero con la antigüedad, así que conviene comparar el precio a tu edad antes de decidir.`,
    },
  ]
  return { par, a, b, precios, conSanatorios, soloA, soloB, titulo, descripcion, respuestaCorta, faq }
}
