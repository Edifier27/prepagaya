import Link from 'next/link'
import { PRECIO_ACTUALIZADO_EN, PRECIO_ACTUALIZADO_PT } from '@/lib/data/prepagas'
import { pesosEn, pesosPt } from '@/lib/precios/en'
import { EDAD_ESTUDIANTE, planesEstudiante } from '@/lib/precios/estudiante'

// Precio de Swiss Medical para un estudiante de 22 años (26-nov-2026), en las
// guías en inglés y portugués. Tabla en HTML con fuente y fecha (GEO).
const T = {
  en: {
    mes: PRECIO_ACTUALIZADO_EN, caption: `Swiss Medical monthly prices for a ${EDAD_ESTUDIANTE}-year-old`, plan: 'Plan', copago: 'Copay on doctor visits', precio: `Monthly price (age ${EDAD_ESTUDIANTE})`, si: 'Yes', no: 'No', off: '15% off online',
    fuente: `Swiss Medical list prices filed with the Superintendencia de Servicios de Salud (${PRECIO_ACTUALIZADO_EN}), VAT included, direct enrollment, Buenos Aires City and Greater Buenos Aires. Prices differ in other cities: ask for a quote for yours.`,
  },
  pt: {
    mes: PRECIO_ACTUALIZADO_PT, caption: `Preço mensal da Swiss Medical para uma pessoa de ${EDAD_ESTUDIANTE} anos`, plan: 'Plano', copago: 'Coparticipação nas consultas', precio: `Preço mensal (${EDAD_ESTUDIANTE} anos)`, si: 'Sim', no: 'Não', off: '15% off on-line',
    fuente: `Preços de tabela da Swiss Medical informados à Superintendencia de Servicios de Salud (${PRECIO_ACTUALIZADO_PT}), com IVA, contratação direta, Cidade de Buenos Aires e Grande Buenos Aires. Em outras cidades o preço muda: peça a cotação para a sua.`,
  },
}

export function TablaEstudianteIntl({ locale }: { locale: 'en' | 'pt' }) {
  const t = T[locale]
  const pesos = locale === 'pt' ? pesosPt : pesosEn
  const filas = planesEstudiante()
  if (filas.length === 0) return null
  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <caption className="sr-only">{t.caption}, {t.mes}</caption>
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-3 py-2.5 font-semibold">{t.plan}</th>
              <th className="px-3 py-2.5 font-semibold">{t.copago}</th>
              <th className="px-3 py-2.5 font-semibold text-right">{t.precio}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filas.map((f) => (
              <tr key={f.planSlug}>
                <th scope="row" className="px-3 py-2.5 text-left font-normal">
                  <Link href={`/prepagas/swiss-medical/${f.planSlug}`} className="font-semibold text-gray-900 hover:text-[#E8002D]">Swiss Medical {f.plan}</Link>
                </th>
                <td className="px-3 py-2.5 text-gray-600">{f.copago ? t.si : t.no}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">
                  <span className="block text-xs text-gray-400 line-through">{pesos(f.precio)}</span>
                  <span className="font-bold text-gray-900">{pesos(f.precio * 0.85)}</span>
                  <span className="block text-xs font-semibold text-emerald-700">{t.off}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-gray-500">{t.fuente}</p>
    </div>
  )
}
