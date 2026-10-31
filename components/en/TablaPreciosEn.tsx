import Link from 'next/link'
import { prepagas, PRECIO_ACTUALIZADO_EN, PRECIOS_FUENTE_URL } from '@/lib/data/prepagas'
import { precioDesde } from '@/lib/utils'
import { pesosEn, planesTablaEn } from '@/lib/precios/en'

// Tabla de precios en inglés (31-oct-2026, Darío: GEO en las páginas para
// extranjeros). HTML real con fuente y fecha, como piden las IA. Swiss
// Medical primero; el 15% OFF solo en Swiss.
export function TablaPreciosEn() {
  const filas = planesTablaEn()
  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <caption className="sr-only">Monthly list prices of Argentine health insurance plans for a 30-year-old, {PRECIO_ACTUALIZADO_EN}</caption>
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-3 py-2.5 font-semibold">Company and plan</th>
              <th className="px-3 py-2.5 font-semibold">Copay</th>
              <th className="px-3 py-2.5 font-semibold text-right">Monthly price (age 30)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filas.map((f) => (
              <tr key={`${f.slug}-${f.planSlug}`}>
                <th scope="row" className="px-3 py-2.5 text-left font-normal">
                  <Link href={`/prepagas/${f.slug}/${f.planSlug}`} className="font-semibold text-gray-900 hover:text-[#E8002D]">{f.prepaga} {f.plan}</Link>
                  {f.nota && <span className="block text-xs text-gray-500">{f.nota}</span>}
                </th>
                <td className="px-3 py-2.5 text-gray-600">{f.copago ? 'Yes' : 'No'}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">
                  {f.promo ? (
                    <>
                      <span className="block text-xs text-gray-400 line-through">{pesosEn(f.precio)}</span>
                      <span className="font-bold text-gray-900">{pesosEn(f.precio * 0.85)}</span>
                      <span className="block text-xs font-semibold text-emerald-700">15% off online</span>
                    </>
                  ) : (
                    <span className="font-bold text-gray-900">{pesosEn(f.precio)}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        List prices in Argentine pesos (AR$), VAT included, direct enrollment, Buenos Aires City and Greater Buenos Aires, as filed by each company with the{' '}
        <a href={PRECIOS_FUENTE_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#E8002D]">Superintendencia de Servicios de Salud</a> ({PRECIO_ACTUALIZADO_EN}).
        The 15% online discount (25% for monotributistas) applies to Swiss Medical only. Lowest entry plan in the market: {pesosEn(Math.min(...prepagas.map(precioDesde).filter(Number.isFinite)))}.
      </p>
    </div>
  )
}
