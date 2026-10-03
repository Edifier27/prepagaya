import Link from 'next/link'
import { CARTILLAS, linkCartillaPlan, textoFecha } from '@/lib/data/cartilla-zonas'
import { CARTILLA_GRUPOS } from '@/lib/data/cartilla-grupos'
import type { Prepaga } from '@/types'

// "Las cartillas de Swiss Medical: Nubial, Global y Premium" (28-sep-2026).
// Se busca "swiss medical plan global", "plan premium", "cartilla smg20"; la
// ficha no explicaba que cada plan usa una de tres cartillas. Qué planes van
// en cada una sale del buscador oficial (CARTILLAS) y, para los Sport, de la
// agrupación que dio Darío (cartilla-grupos.ts). Los sanatorios son los de
// internación en CABA según la cartilla oficial.

function internacionCaba(id: string): string[] {
  const caba = CARTILLAS['swiss-medical']?.zonas.find((z) => z.slug === 'caba')
  return caba ? caba.centros.filter((c) => c.internacion.includes(id)).map((c) => c.nombre) : []
}

const lista = (xs: string[]) => xs.join(', ').replace(/, ([^,]*)$/, ' y $1')

export function cartillasSwiss(prep: Prepaga) {
  const c = CARTILLAS['swiss-medical']
  if (prep.slug !== 'swiss-medical' || !c) return []
  const grupos = CARTILLA_GRUPOS['swiss-medical'] ?? []
  return c.planes.map((p, i) => {
    const nombre = p.label.match(/\(([^)]+)\)$/)?.[1] ?? p.label
    const oficiales = [p.comparadorSlug, ...(p.otrosComparadorSlugs ?? [])].filter((x): x is string => Boolean(x))
    const grupo = grupos.find((g) => oficiales.some((o) => g.planes.includes(o)))
    const slugs = [...new Set([...oficiales, ...(grupo?.planes ?? [])])]
    const planes = prep.planes.filter((pl) => slugs.includes(pl.slug)).sort((a, b) => a.precio - b.precio)
    const sanatorios = internacionCaba(p.id)
    const previos = i > 0 ? internacionCaba(c.planes[i - 1].id) : []
    return {
      id: p.id,
      nombre,
      planes,
      sanatorios,
      suma: i > 0 ? sanatorios.filter((s) => !previos.includes(s)) : [],
      noIncluye: i > 0 ? previos.filter((s) => !sanatorios.includes(s)) : [],
      anterior: i > 0 ? c.planes[i - 1].label.match(/\(([^)]+)\)$/)?.[1] : undefined,
      link: p.comparadorSlug ? linkCartillaPlan('swiss-medical', p.comparadorSlug) : null,
    }
  })
}

/** Respuesta para las preguntas frecuentes de la ficha */
export function faqCartillasSwiss(prep: Prepaga): { q: string; a: string } | null {
  const cs = cartillasSwiss(prep)
  if (cs.length === 0) return null
  return {
    q: '¿Qué cartillas tiene Swiss Medical: Nubial, Global y Premium?',
    a: `Swiss Medical tiene ${cs.length} cartillas y cada plan usa una: ${cs.map((x) => `${x.nombre} (${lista(x.planes.map((p) => p.nombre.replace(/^Plan /, '')))})`).join(', ')}. En la Ciudad de Buenos Aires, la cartilla oficial tiene ${cs.map((x) => `${x.sanatorios.length} sanatorios con internación en la ${x.nombre}`).join(', ')}.`,
  }
}

export function CartillasSwiss({ prep }: { prep: Prepaga }) {
  const cs = cartillasSwiss(prep)
  if (cs.length === 0) return null
  const fecha = textoFecha(CARTILLAS['swiss-medical'])
  return (
    <section className="py-10 bg-white border-t border-gray-100">
      <div className="container max-w-5xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Las cartillas de Swiss Medical: {lista(cs.map((x) => x.nombre))}</h2>
        <p className="text-sm text-gray-600 mb-5 max-w-3xl">
          Cada plan de Swiss Medical usa una de estas {cs.length} cartillas, y en buena parte el precio sube con la cartilla. Contamos los sanatorios con internación en la Ciudad de Buenos Aires ({fecha}).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cs.map((x) => (
            <div key={x.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-5 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900">Cartilla {x.nombre}</h3>
              <p className="text-sm text-gray-600 mt-1">
                Planes:{' '}
                {x.planes.map((p, i) => (
                  <span key={p.slug}>
                    {i > 0 && (i === x.planes.length - 1 ? ' y ' : ', ')}
                    <Link href={`/prepagas/swiss-medical/${p.slug}`} className="font-semibold text-gray-900 hover:text-[#E8002D] hover:underline">{p.nombre.replace(/^Plan /, '')}</Link>
                  </span>
                ))}
              </p>
              <p className="mt-3 text-3xl font-extrabold text-[#E8002D] leading-none">{x.sanatorios.length}</p>
              <p className="text-xs text-gray-600">sanatorios con internación en CABA</p>
              {x.suma.length > 0 && (
                <p className="text-xs text-gray-700 mt-3"><strong>Suma respecto de la {x.anterior}:</strong> {lista(x.suma)}.</p>
              )}
              {x.noIncluye.length > 0 && (
                <p className="text-xs text-gray-500 mt-1.5"><strong>No incluye (sí está en la {x.anterior}):</strong> {lista(x.noIncluye)}.</p>
              )}
              {x.suma.length === 0 && x.sanatorios.length > 0 && (
                <p className="text-xs text-gray-700 mt-3"><strong>Incluye, entre otros:</strong> {lista(x.sanatorios.slice(0, 6))}.</p>
              )}
              {x.link && (
                <Link href={x.link.href} className="mt-auto pt-4 text-sm font-semibold text-[#E8002D] hover:underline">
                  Cartilla {x.nombre} por zona →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
