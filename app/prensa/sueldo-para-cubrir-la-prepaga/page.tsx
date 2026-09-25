import type { Metadata } from 'next'
import Link from 'next/link'
import { InformeSueldo } from '@/components/prensa/InformeSueldo'
import { INFORMES_PROVINCIA, MES, calcularSueldos, millones, millonesLargo, textosInforme } from '@/lib/prensa/sueldo-prepaga'
import { SITE_URL, OG_IMAGE } from '@/lib/utils'

// Informe para prensa del AMBA (25-sep-2026), con la comparación por
// provincia. Cálculo y textos en lib/prensa/sueldo-prepaga.ts.

const URL = `${SITE_URL}/prensa/sueldo-para-cubrir-la-prepaga`
const FILAS = calcularSueldos('caba') // cuadro AMBA
const { titular } = textosInforme(FILAS, 'en el AMBA')

// Dónde es más barato y más caro que los aportes cubran la prepaga (30 años)
const PISOS = INFORMES_PROVINCIA
  .map((p) => ({ ...p, piso: p.filas[0] }))
  .sort((a, b) => a.piso.sueldo.s30 - b.piso.sueldo.s30)

export const metadata: Metadata = {
  title: `¿Cuánto hay que ganar para que los aportes paguen la prepaga? Informe ${MES}`,
  description: FILAS[0]
    ? `Sueldo bruto necesario para que los aportes de obra social cubran el plan de entrada de cada prepaga sin pagar diferencia: desde ${millonesLargo(FILAS[0].sueldo.s30)} a los 30 años en el AMBA. Por provincia y con los cuadros oficiales de la SSSalud.`
    : 'Sueldo bruto necesario para que los aportes de obra social cubran la prepaga sin pagar diferencia.',
  alternates: { canonical: URL },
  keywords: ['cuanto hay que ganar para tener prepaga', 'aportes cubren prepaga', 'sueldo para prepaga con aportes', 'prepaga sin pagar diferencia', 'derivar aportes prepaga cuanto pago'],
  openGraph: { title: '¿Cuánto hay que ganar para que los aportes paguen la prepaga?', description: titular, url: URL, type: 'article', images: [OG_IMAGE] },
}

export default function InformeSueldoPrepaga() {
  return (
    <InformeSueldo
      filas={FILAS}
      lugar="en el AMBA"
      region="AMBA"
      h1="¿Cuánto hay que ganar para que los aportes paguen la prepaga?"
      url={URL}
      migas={[{ nombre: 'Sueldo para cubrir la prepaga' }]}
    >
      {PISOS.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-gray-900 mt-10 mb-2">Por provincia</h2>
          <p className="text-sm text-gray-600 mb-4">
            Cada prepaga publica cuadros por región, así que el piso cambia según dónde vivís. Sueldo bruto mínimo para que una persona de 30 años no pague diferencia, con el plan más accesible de cada provincia ({FILAS[0] ? `en el AMBA, ${millones(FILAS[0].sueldo.s30)}` : 'AMBA arriba'}).
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs text-gray-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Provincia</th>
                  <th className="px-3 py-2 font-semibold text-right whitespace-nowrap">Desde (30 años)</th>
                  <th className="px-3 py-2 font-semibold">Plan más accesible</th>
                </tr>
              </thead>
              <tbody>
                {PISOS.map((p) => (
                  <tr key={p.slug} className="border-t border-gray-100">
                    <td className="px-3 py-2"><Link href={`/prensa/sueldo-para-cubrir-la-prepaga/${p.slug}`} className="font-semibold text-[#E8002D] hover:underline">{p.nombre}</Link></td>
                    <td className="px-3 py-2 text-right tabular-nums text-gray-800 whitespace-nowrap">{millones(p.piso.sueldo.s30)}</td>
                    <td className="px-3 py-2 text-gray-700">{p.piso.prepaga} <span className="text-xs text-gray-500">{p.piso.plan}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </InformeSueldo>
  )
}
