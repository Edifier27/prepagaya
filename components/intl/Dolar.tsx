import { dolarOficial, usd } from '@/lib/dolar'
import type { LocaleIntl } from '@/components/intl/TablaPreciosIntl'

// Equivalente en dólares y la nota con la cotización (31-oct-2026). Sin
// respuesta del BCRA no se muestra nada.

/** " (≈ US$240)" al lado de un monto en pesos */
export async function UsdAprox({ ars }: { ars: number }) {
  const dolar = await dolarOficial()
  return dolar ? <> (≈ {usd(ars, dolar)})</> : null
}

export async function NotaDolar({ locale }: { locale: LocaleIntl }) {
  const d = await dolarOficial()
  if (!d) return null
  const [a, m, dia] = d.fecha.split('-')
  const valor = `AR$${d.valor.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
  if (locale === 'ru') return <>Суммы в долларах приблизительные, по официальному курсу BCRA на {dia}.{m}.{a} ({valor} за доллар). Оплата в аргентинских песо.</>
  if (locale === 'zh') return <>美元金额为约数,按阿根廷中央银行(BCRA){a}年{Number(m)}月{Number(dia)}日官方汇率(1美元={valor})换算。按阿根廷比索计费。</>
  return <>US$ amounts are approximate, at the BCRA official exchange rate of {m}/{dia}/{a} ({valor} per dollar). Plans are billed in Argentine pesos.</>
}
