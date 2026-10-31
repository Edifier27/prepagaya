import Link from 'next/link'
import { PRECIO_ACTUALIZADO_EN, PRECIO_ACTUALIZADO_RU, PRECIO_ACTUALIZADO_ZH, PRECIOS_FUENTE_URL } from '@/lib/data/prepagas'
import { pesosEn, planesTablaEn } from '@/lib/precios/en'
import { dolarOficial, usd } from '@/lib/dolar'
import { NotaDolar } from '@/components/intl/Dolar'

// Tabla de precios oficiales para las páginas en inglés, ruso y chino
// (31-oct-2026): HTML real con fuente y fecha (GEO), Swiss Medical primero,
// 15% OFF solo en Swiss y, si el BCRA responde, el equivalente en dólares.
export type LocaleIntl = 'en' | 'ru' | 'zh'

const T: Record<LocaleIntl, { mes: string; caption: string; plan: string; copago: string; precio: string; si: string; no: string; off: string; notas: Record<string, string>; fuente: (link: React.ReactNode) => React.ReactNode }> = {
  en: {
    mes: PRECIO_ACTUALIZADO_EN, caption: 'Monthly list prices of Argentine health insurance plans for a 30-year-old', plan: 'Company and plan', copago: 'Copay', precio: 'Monthly price (age 30)', si: 'Yes', no: 'No', off: '15% off online',
    notas: { popular: 'Most popular Swiss Medical plan', entrada: 'Entry plan', barato: 'Lowest price in the market' },
    fuente: (l) => <>List prices in Argentine pesos (AR$), VAT included, direct enrollment, Buenos Aires City and Greater Buenos Aires, as filed by each company with the {l} ({PRECIO_ACTUALIZADO_EN}). The 15% online discount (25% for monotributistas) applies to Swiss Medical only.</>,
  },
  ru: {
    mes: PRECIO_ACTUALIZADO_RU, caption: 'Ежемесячные базовые цены планов медицинской страховки в Аргентине для человека 30 лет', plan: 'Компания и план', copago: 'Доплата', precio: 'Цена в месяц (30 лет)', si: 'Да', no: 'Нет', off: 'скидка 15% онлайн',
    notas: { popular: 'Самый популярный план Swiss Medical', entrada: 'Начальный план', barato: 'Самая низкая цена на рынке' },
    fuente: (l) => <>Базовые цены в аргентинских песо (AR$) с НДС, прямое оформление, Буэнос-Айрес и пригороды, по данным, которые каждая компания подаёт в {l} ({PRECIO_ACTUALIZADO_RU}). Скидка 15% за онлайн-оформление (25% для монотрибутистов) — только у Swiss Medical.</>,
  },
  zh: {
    mes: PRECIO_ACTUALIZADO_ZH, caption: '阿根廷医疗保险计划月度标价(30岁)', plan: '公司与计划', copago: '自付', precio: '月费(30岁)', si: '有', no: '无', off: '网上投保优惠15%',
    notas: { popular: 'Swiss Medical最受欢迎的计划', entrada: '入门计划', barato: '市场最低价' },
    fuente: (l) => <>标价以阿根廷比索(AR$)计,含增值税,直接投保,布宜诺斯艾利斯市及大布宜诺斯艾利斯地区,数据来自各公司向{l}申报的官方价目表({PRECIO_ACTUALIZADO_ZH})。网上投保优惠15%(单一税纳税人25%)仅适用于Swiss Medical。</>,
  },
}
const NOTA_FILA: Record<string, keyof typeof T.en.notas> = { smg20: 'popular', s1: 'entrada', '210': 'entrada', f700: 'entrada', 'plan-c100': 'barato' }

export async function TablaPreciosIntl({ locale }: { locale: LocaleIntl }) {
  const t = T[locale]
  const dolar = await dolarOficial()
  const filas = planesTablaEn()
  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
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
            {filas.map((f) => {
              const final = f.promo ? f.precio * 0.85 : f.precio
              const nota = NOTA_FILA[f.planSlug]
              return (
                <tr key={`${f.slug}-${f.planSlug}`}>
                  <th scope="row" className="px-3 py-2.5 text-left font-normal">
                    <Link href={`/prepagas/${f.slug}/${f.planSlug}`} className="font-semibold text-gray-900 hover:text-[#E8002D]">{f.prepaga} {f.plan}</Link>
                    {nota && <span className="block text-xs text-gray-500">{t.notas[nota]}</span>}
                  </th>
                  <td className="px-3 py-2.5 text-gray-600">{f.copago ? t.si : t.no}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">
                    {f.promo && <span className="block text-xs text-gray-400 line-through">{pesosEn(f.precio)}</span>}
                    <span className="font-bold text-gray-900">{pesosEn(final)}</span>
                    {dolar && <span className="block text-xs font-semibold text-gray-600">≈ {usd(final, dolar)}</span>}
                    {f.promo && <span className="block text-xs font-semibold text-emerald-700">{t.off}</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        {t.fuente(<a href={PRECIOS_FUENTE_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#E8002D]">Superintendencia de Servicios de Salud</a>)}{' '}
        <NotaDolar locale={locale} />
      </p>
    </div>
  )
}
