import Link from 'next/link'
import { cartillasSwiss } from '@/lib/data/cartillas-swiss'
import { CARTILLAS } from '@/lib/data/cartilla-zonas'
import { PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { formatPrecio } from '@/lib/utils'

// Tabla de las 3 cartillas de Swiss Medical (Nubial, Global y Premium), en
// HTML para que la lean Google y las IA (17-nov-2026). Va en la cartilla de
// Swiss y en la página de cada cartilla; `actual` marca la de la página.
export function TablaCartillasSwiss({ actual }: { actual?: string }) {
  const cs = cartillasSwiss()
  if (cs.length === 0) return null
  const fecha = CARTILLAS['swiss-medical']?.vigencia
  return (
    <div>
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full text-[13px] sm:text-sm border border-gray-200 rounded-xl overflow-hidden bg-white">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left font-semibold px-2.5 sm:px-4 py-2.5">Cartilla</th>
              <th className="text-left font-semibold px-2.5 sm:px-4 py-2.5">Planes</th>
              <th className="text-right font-semibold px-2.5 sm:px-4 py-2.5">Sanatorios en CABA</th>
              <th className="text-right font-semibold px-2.5 sm:px-4 py-2.5">Desde</th>
            </tr>
          </thead>
          <tbody>
            {cs.map((x) => {
              const esta = x.plan.id === actual
              return (
                <tr key={x.plan.id} className={`border-t border-gray-100 ${esta ? 'bg-red-50/60' : ''}`}>
                  <td className="px-2.5 sm:px-4 py-2.5 font-semibold text-gray-900 whitespace-nowrap">
                    {esta ? (
                      <>Cartilla {x.nombre}</>
                    ) : (
                      <Link href={x.href} className="hover:text-[#E8002D] underline-offset-2 hover:underline">Cartilla {x.nombre}</Link>
                    )}
                    {x.codigo && <span className="block text-[11px] font-normal text-gray-400">Código {x.codigo}</span>}
                  </td>
                  <td className="px-2.5 sm:px-4 py-2.5 text-gray-700">
                    {x.planes.map((p, i) => (
                      <span key={p.slug}>
                        {i > 0 && (i === x.planes.length - 1 ? ' y ' : ', ')}
                        <Link href={`/prepagas/swiss-medical/${p.slug}`} className="whitespace-nowrap hover:text-[#E8002D] hover:underline">{p.nombre}</Link>
                      </span>
                    ))}
                  </td>
                  <td className="px-2.5 sm:px-4 py-2.5 text-right text-gray-700">{x.internacionCaba.length}</td>
                  <td className="px-2.5 sm:px-4 py-2.5 text-right text-gray-700 whitespace-nowrap">
                    {x.desde ? (
                      <Link href={`/prepagas/swiss-medical/${x.desde.slug}`} className="hover:text-[#E8002D] hover:underline">{formatPrecio(x.desde.precio)}</Link>
                    ) : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-gray-400 leading-relaxed">
        Sanatorios para internación en la Ciudad de Buenos Aires, según la cartilla oficial de Swiss Medical{fecha ? ` consultada el ${fecha}` : ''}. Desde: precio de lista de {PRECIO_ACTUALIZADO.toLowerCase()} para una persona de 30 años, CABA y GBA, contratación directa, IVA incluido (cuadro oficial de la SSSalud).
      </p>
    </div>
  )
}
