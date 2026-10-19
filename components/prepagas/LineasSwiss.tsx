import Link from 'next/link'
import { PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { formatPrecio } from '@/lib/utils'
import { codigoCorto } from '@/lib/seo/titulos'
import type { Prepaga } from '@/types'

// "Los planes de Swiss Medical por línea" (19-oct-2026). "swiss medical
// planes" (6.600/mes) rankea ~19 y la respuesta de IA de Google cita a
// miobrasocial con los mismos precios SSSalud que ya publicamos, pero
// agrupados por línea (con copago, nivel medio, superiores, especiales). La
// ficha mostraba tarjetas sueltas: este resumen en texto + tabla es lo que
// Google y las IA pueden citar. Precios, copago y red salen de
// lib/data/prepagas.ts; el texto de cada línea, de las descripciones de esos
// mismos planes. Sin montos escritos a mano.

interface Linea {
  nombre: string
  /** Cómo se nombra la línea dentro del párrafo de resumen */
  enTexto: string
  planes: string[]
  distingue: string
}

const LINEAS: Linea[] = [
  { nombre: 'Con copago (económica)', enTexto: 'con copago', planes: ['s1', 's2'], distingue: 'Menor cuota a cambio de copagos en consultas y estudios. El S2 suma el Hospital Italiano y la Fundación Favaloro.' },
  { nombre: 'Entrada sin copago', enTexto: 'de entrada sin copago', planes: ['smg02'], distingue: 'La forma más barata de tener consultas sin copago, con cobertura en CABA y GBA.' },
  { nombre: 'Nivel medio', enTexto: 'de nivel medio', planes: ['smg20'], distingue: 'El más elegido: sistema cerrado, sin copago en consultas, estudios, kinesiología y fonoaudiología, y 30 sesiones de psicología por año.' },
  { nombre: 'Superiores', enTexto: 'superiores', planes: ['smg30', 'smg40', 'smg50'], distingue: 'Red abierta con reintegros fuera de cartilla. El SMG50 suma una cirugía estética por año e implantes dentales por reintegro.' },
  { nombre: 'Alta gama', enTexto: 'de alta gama', planes: ['smg60', 'smg70'], distingue: 'Habitación individual, chequeo médico ejecutivo anual y Swiss Medical Internacional para todo el grupo familiar.' },
  { nombre: 'Sport', enTexto: 'Sport', planes: ['sport-s', 'sport', 'sport-plus'], distingue: 'Reintegro por gimnasio y actividad física, nutrición y traumatología. El Sport incluye estudio biomecánico de la marcha y el Sport+, un test genético.' },
]

const lista = (xs: string[]) => xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}` : xs.join('')

function lineasSwiss(prep: Prepaga) {
  if (prep.slug !== 'swiss-medical') return []
  return LINEAS.map((l) => {
    const planes = l.planes
      .map((s) => prep.planes.find((pl) => pl.slug === s))
      .filter((pl): pl is Prepaga['planes'][number] => Boolean(pl))
    const desde = Math.min(...planes.map((pl) => pl.precio))
    const copago = planes.every((pl) => pl.copago) ? 'Sí' : planes.some((pl) => pl.copago) ? 'Según plan' : 'No'
    const red = planes.every((pl) => pl.redAbierta) ? 'Abierta' : planes.some((pl) => pl.redAbierta) ? 'Según plan' : 'Cerrada'
    return { ...l, planes, desde, copago, red }
  }).filter((l) => l.planes.length > 0)
}

function resumen(prep: Prepaga, ls: ReturnType<typeof lineasSwiss>) {
  const tramo = (l: (typeof ls)[number]) =>
    `${l.enTexto} (${lista(l.planes.map((pl) => codigoCorto(pl.nombre)))}${Number.isFinite(l.desde) ? `, desde ${formatPrecio(l.desde)}` : ''})`
  return `Swiss Medical tiene ${prep.planes.length} planes para particulares en ${PRECIO_ACTUALIZADO.toLowerCase()}, divididos en ${ls.length} líneas: ${lista(ls.map(tramo))}. Son precios de lista por mes para una persona de 30 años según el cuadro oficial de la SSSalud. Para empresas existe además la línea corporativa, con el Plan Black.`
}

/** Respuesta para las preguntas frecuentes de la ficha */
export function faqLineasSwiss(prep: Prepaga): { q: string; a: string } | null {
  const ls = lineasSwiss(prep)
  if (ls.length === 0) return null
  return { q: '¿Cómo se dividen los planes de Swiss Medical?', a: resumen(prep, ls) }
}

export function LineasSwiss({ prep }: { prep: Prepaga }) {
  const ls = lineasSwiss(prep)
  if (ls.length === 0) return null
  return (
    <div className="mb-6">
      <h3 className="text-base font-bold text-gray-900 mb-2">Los planes de Swiss Medical por línea</h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-4 max-w-3xl">{resumen(prep, ls)}</p>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[40rem] text-sm text-left">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <tr>
              <th scope="col" className="px-3 py-2 font-semibold">Línea</th>
              <th scope="col" className="px-3 py-2 font-semibold">Planes</th>
              <th scope="col" className="px-3 py-2 font-semibold whitespace-nowrap">Desde (30 años)</th>
              <th scope="col" className="px-3 py-2 font-semibold">Copago</th>
              <th scope="col" className="px-3 py-2 font-semibold">Red</th>
              <th scope="col" className="px-3 py-2 font-semibold">Qué la distingue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ls.map((l) => (
              <tr key={l.nombre} className="align-top">
                <th scope="row" className="px-3 py-2.5 font-semibold text-gray-900">{l.nombre}</th>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  {l.planes.map((pl, i) => (
                    <span key={pl.slug}>
                      {i > 0 && ', '}
                      <Link href={`/prepagas/swiss-medical/${pl.slug}`} className="font-semibold text-gray-900 hover:text-[#E8002D] hover:underline">{codigoCorto(pl.nombre)}</Link>
                    </span>
                  ))}
                </td>
                <td className="px-3 py-2.5 font-semibold text-gray-900 tabular-nums whitespace-nowrap">{formatPrecio(l.desde)}</td>
                <td className="px-3 py-2.5 text-gray-600">{l.copago}</td>
                <td className="px-3 py-2.5 text-gray-600">{l.red}</td>
                <td className="px-3 py-2.5 text-gray-600">{l.distingue}</td>
              </tr>
            ))}
            <tr className="align-top">
              <th scope="row" className="px-3 py-2.5 font-semibold text-gray-900">Corporativa</th>
              <td className="px-3 py-2.5 whitespace-nowrap">
                <Link href="/empresas/swiss-medical/plan-black" className="font-semibold text-gray-900 hover:text-[#E8002D] hover:underline">Black</Link>
              </td>
              <td className="px-3 py-2.5 text-gray-600">A cotizar</td>
              <td className="px-3 py-2.5 text-gray-600">—</td>
              <td className="px-3 py-2.5 text-gray-600">—</td>
              <td className="px-3 py-2.5 text-gray-600">
                Solo para empresas: ejecutivo de cuenta, cobertura internacional y red Blue Cross &amp; Blue Shield en EE. UU.{' '}
                <Link href="/empresas/swiss-medical" className="text-[#E8002D] hover:underline">Planes corporativos →</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
