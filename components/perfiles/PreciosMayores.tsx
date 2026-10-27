import Link from 'next/link'
import { escalaPorEdad, precioGrupo } from '@/lib/precios/motor'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { formatPrecio } from '@/lib/utils'

// "¿Cuánto cuesta una prepaga para mayores de 60?" Precios de lista oficiales
// de cada prepaga por edad, de los cuadros declarados ante la SSSalud (CABA y
// GBA, contratación directa, IVA incluido). Swiss Medical primero. Hasta los
// 65: las prepagas aceptan ingresos nuevos hasta los 66 inclusive
// (Darío, 27-oct-2026), así que no se muestran precios de 66 en adelante.

const ORDEN = ['swiss-medical', 'osde', 'sancor-salud', 'avalian', 'medife', 'premedic', 'galeno']
const EDADES = [55, 60, 65]

/** "Swiss Medical S1", "Medifé+" (sin repetir la marca cuando el plan ya la lleva) */
export function nombreCorto(prep: string, plan: string) {
  const pl = plan.replace(/^Plan /, '')
  return pl.startsWith(prep) ? pl : `${prep} ${pl}`
}

// Planes con precio oficial a las tres edades, del más barato al más caro a los 60
function planesDe(slug: string) {
  const p = prepagas.find((x) => x.slug === slug)
  if (!p) return []
  return p.planes
    .filter((pl) => pl.fuentePrecio === 'sssalud' && !pl.edadMaxima)
    .map((pl) => ({ prep: p, pl, precios: EDADES.map((e) => precioGrupo(slug, pl.slug, [e], 'caba')?.total ?? null) }))
    .flatMap((x) => (x.precios.every((v) => v !== null) ? [{ ...x, precios: x.precios as number[] }] : []))
    .sort((a, b) => a.precios[0] - b.precios[0])
}

function filas() {
  return ORDEN.flatMap((slug) => {
    const planes = planesDe(slug)
    if (planes.length === 0) return []
    // El más económico y el más elegido, si es otro
    const elegidos = [planes[0], planes.find((x) => x.pl.destacado && x.pl.slug !== planes[0].pl.slug)].filter((x) => x !== undefined)
    return elegidos.map((x) => {
      const ultimo = escalaPorEdad(slug, x.pl.slug, 'caba')?.rangos.at(-1)
      return { prep: x.prep, plan: x.pl, precios: x.precios, dejaDeSubir: ultimo && ultimo.desde <= 65 ? ultimo.desde : null }
    })
  })
}

/** Respuesta para las preguntas frecuentes, con los mismos datos de la tabla */
export function faqPreciosMayores(): { q: string; a: string } {
  // El plan más barato de cada prepaga a los 65
  const f = ORDEN.flatMap((slug) => {
    const min = planesDe(slug).sort((a, b) => a.precios[2] - b.precios[2])[0]
    return min ? [min] : []
  })
  const texto = f.slice(0, 5).map((x) => `${nombreCorto(x.prep.nombre, x.pl.nombre)}, ${formatPrecio(x.precios[2])}`).join('; ')
  return {
    q: '¿Cuánto cuesta una prepaga para mayores de 60?',
    a: `Depende de la prepaga y del plan: cada una declara su precio por edad ante la Superintendencia de Servicios de Salud. Según las listas oficiales de ${PRECIO_ACTUALIZADO.toLowerCase()} (CABA y GBA, por persona, IVA incluido), el plan más económico de cada una sale a los 65 años: ${texto}. Para afiliarte por primera vez tenés que tener 66 años o menos. Cotizando online Swiss Medical tenés 15% OFF sobre esos valores.`,
  }
}

export function PreciosMayores() {
  const datos = filas()
  if (datos.length === 0) return null
  return (
    <section className="py-10 bg-white border-t border-gray-100">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Cuánto cuesta una prepaga a los 55, 60 y 65 años</h2>
        <p className="text-sm text-gray-500 mb-4">
          Precios de lista oficiales de {PRECIO_ACTUALIZADO.toLowerCase()} declarados ante la Superintendencia de Servicios de Salud: CABA y GBA, por persona, contratación directa, IVA incluido. Cotizando online Swiss Medical tenés 15% OFF.
        </p>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-[13px] sm:text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-2 sm:px-3 py-2">Plan</th>
                {EDADES.map((e) => <th key={e} className="text-right px-2 sm:px-3 py-2 whitespace-nowrap">{e} años</th>)}
              </tr>
            </thead>
            <tbody>
              {datos.map((x) => (
                <tr key={`${x.prep.slug}-${x.plan.slug}`} className="border-t border-gray-100 align-top">
                  <td className="px-2 sm:px-3 py-2">
                    <Link href={`/prepagas/${x.prep.slug}/${x.plan.slug}`} className="font-semibold text-gray-900 hover:text-[#E8002D] hover:underline">
                      {nombreCorto(x.prep.nombre, x.plan.nombre)}
                    </Link>
                    {x.dejaDeSubir && <div className="text-[11px] text-gray-500">Mismo precio desde los {x.dejaDeSubir} años</div>}
                  </td>
                  {x.precios.map((v, i) => <td key={EDADES[i]} className="px-2 sm:px-3 py-2 text-right tabular-nums text-gray-900 whitespace-nowrap">{formatPrecio(v)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          <li><strong>El ingreso es hasta los 66 años.</strong> Para afiliarte por primera vez tenés que tener 66 años o menos: el precio depende de los rangos de edad que declara cada prepaga.</li>
          <li><strong>Si tenés más de 65 y 10 años o más en la misma prepaga</strong>, no te pueden aumentar la cuota por edad. Antes de cambiarte, tenelo en cuenta: en una prepaga nueva empezás de cero.</li>
          <li><strong>Por una preexistencia</strong> pueden cobrarte una cuota diferencial autorizada por la Superintendencia, pero no rechazarte.</li>
        </ul>
        <div className="mt-5 flex flex-col sm:flex-row gap-2">
          <Link href="/comparador" className="inline-flex items-center justify-center px-5 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm">
            Ver el precio exacto para mi edad →
          </Link>
          <Link href="/guias/cuota-prepaga-por-edad" className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-800 hover:border-[#E8002D] hover:text-[#E8002D]">
            Cómo sube la cuota con la edad →
          </Link>
        </div>
      </div>
    </section>
  )
}
