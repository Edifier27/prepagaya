import type { Metadata } from 'next'
import Link from 'next/link'
import { prepagas, PRECIO_ACTUALIZADO_EN, nivelPrecio } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL, formatPrecio } from '@/lib/utils'
import { NivelPrecioBadge } from '@/components/ui/NivelPrecioBadge'
import { ContratarPlanButtonIntl } from '@/components/prepagas/ContratarPlanButtonIntl'

// Declinación rusa de "clínica" según el número (1 клиника / 2-4 клиники /
// 0,5+,11-14 клиник) — sanatoriosPropios varía por prepaga (0, 1, 9, 11...)
// así que no alcanza con una sola forma fija.
function klinikSlovo(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'собственная клиника'
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'собственные клиники'
  return 'собственных клиник'
}

export const metadata: Metadata = {
  title: { absolute: `Лучшая медицинская страховка в Аргентине для иностранцев (${PRECIO_ACTUALIZADO_EN}) — ${SITE_NAME}` },
  description:
    'Swiss Medical, OSDE, Sancor Salud или Premedic? Сравнение лучших prepaga для иностранцев в Аргентине — сеть клиник, рейтинг удовлетворённости и реальные цены.',
  alternates: {
    canonical: `${SITE_URL}/ru/luchshaya-strahovka-argentina`,
    languages: {
      'es-AR': `${SITE_URL}/ranking`,
      en: `${SITE_URL}/en/best-health-insurance-argentina`,
      ru: `${SITE_URL}/ru/luchshaya-strahovka-argentina`,
    },
  },
  keywords: [
    'лучшая страховка аргентина',
    'лучшая prepaga для иностранцев',
    'swiss medical или osde',
    'сравнение медицинских страховок аргентина',
    'рейтинг prepaga аргентина',
  ],
}

const SLUGS = ['swiss-medical', 'osde', 'sancor-salud', 'premedic'] as const

const POZICIONIROVANIE: Record<string, { tag: string; para: string }> = {
  'swiss-medical': { tag: 'Лучший выбор', para: 'Самая широкая сеть собственных клиник — самый надёжный вариант, если для вас важнее качество покрытия, а не только цена.' },
  'osde': { tag: 'Самая большая сеть', para: 'Крупнейшая prepaga Аргентины по числу застрахованных — самая широкая сеть врачей и клиник по всей стране.' },
  'sancor-salud': { tag: 'Лучший баланс', para: 'Хороший вариант среднего уровня: покрытие по всей стране без премиум-цены.' },
  'premedic': { tag: 'Лучшая цена', para: 'Самый доступный из четырёх вариантов — полное покрытие обязательной программы (PMO) по минимальной цене.' },
}

const faqs = [
  {
    q: 'Swiss Medical или OSDE — что лучше для иностранца в Аргентине?',
    a: 'У Swiss Medical больше собственных клиник (9), что обычно означает более короткое ожидание и больше контроля над качеством. У OSDE самая широкая сеть по числу застрахованных и врачей. Оба варианта хороши: Swiss Medical — если важен премиум-опыт, OSDE — если важнее выбор врача и охват.',
  },
  {
    q: 'Какая самая доступная хорошая страховка в Аргентине?',
    a: 'Premedic — самый доступный из крупных игроков, при этом полностью покрывает обязательную программу (PMO): приём врача, госпитализацию, неотложную помощь, роды, без периода ожидания на большинство услуг.',
  },
  {
    q: 'Платят ли иностранцы больше, чем местные жители?',
    a: 'Нет. Цена зависит от возраста и плана, а не от гражданства — вы платите ровно столько же, сколько местный житель вашего возраста.',
  },
  {
    q: 'Можно ли узнать точную цену для моего возраста перед выбором?',
    a: 'Да — цена зависит от возрастной группы и от того, оформляете вы только себя или всю семью. Воспользуйтесь бесплатным сравнением цен, чтобы увидеть реальную стоимость для вашей ситуации по всем крупным компаниям сразу.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Лучшая медицинская страховка в Аргентине для иностранцев: ${PRECIO_ACTUALIZADO_EN}`,
    description: 'Сравнение лучших prepaga для иностранцев в Аргентине.',
    url: `${SITE_URL}/ru/luchshaya-strahovka-argentina`,
    image: `${SITE_URL}/opengraph-image`,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/ru/luchshaya-strahovka-argentina` },
    inLanguage: 'ru',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  },
]

export default function LuchshayaStrahovkaArgentinaPage() {
  const items = SLUGS
    .map((slug) => prepagas.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-3xl mx-auto">
          <span className="inline-block text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-4">
            Гид на русском · Обновлено {PRECIO_ACTUALIZADO_EN}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Лучшая медицинская страховка в Аргентине для иностранцев
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            Единого &quot;лучшего&quot; варианта не существует — всё зависит от того, что важнее: размер сети,
            собственная клиника или цена. Вот как реально сравниваются четыре самых популярных варианта среди
            иностранцев, с реальными ценами на {PRECIO_ACTUALIZADO_EN.toLowerCase()}.
          </p>
          <ContratarPlanButtonIntl
            locale="ru"
            fuente="ru-comparison"
            label="Узнать точную цену для моего возраста →"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-md text-sm"
          />
          <p className="text-xs text-gray-400 mt-3">
            <Link href="/ru/strahovanie-argentina" className="text-[#E8002D] hover:underline font-medium">← Общий гид по страховке в Аргентине</Link>
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-10 bg-white">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">4 самых популярных варианта</h2>
          <div className="space-y-4">
            {items.map((p) => {
              const precioMin = Math.min(...p.planes.map((pl) => pl.precio))
              const pos = POZICIONIROVANIE[p.slug]
              return (
                <div key={p.slug} className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900">{p.nombre}</span>
                        {pos && (
                          <span className="inline-block text-[10px] font-black px-2 py-0.5 rounded-full border text-[#92400E] bg-[#FEF3C7] border-[#FDE68A]">
                            {pos.tag.toUpperCase()}
                          </span>
                        )}
                      </div>
                      {pos && <p className="text-sm text-gray-600 leading-relaxed mt-1 max-w-md">{pos.para}</p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-gray-900 text-sm">от {formatPrecio(precioMin)}/мес</div>
                      <NivelPrecioBadge nivel={nivelPrecio(precioMin)} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
                    <span><strong className="text-gray-700">{p.satisfaccion}%</strong> удовлетворённость клиентов</span>
                    <span><strong className="text-gray-700">{p.sanatoriosPropios}</strong> {klinikSlovo(p.sanatoriosPropios)}</span>
                    <span><strong className="text-gray-700">{p.caracteristicas.coberturaNacional ? 'По всей стране' : 'Региональное'}</strong> покрытие</span>
                  </div>
                  <Link href={`/prepagas/${p.slug}`} className="inline-block text-sm font-semibold text-[#E8002D] hover:underline mt-3">
                    Подробнее о {p.nombre} →
                  </Link>
                </div>
              )
            })}
          </div>
          <Link href="/ru/stoimost-strahovaniya-argentina" className="inline-block text-sm font-semibold text-[#E8002D] hover:underline mt-4">
            Полный разбор цен по уровню покрытия →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Частые вопросы</h2>
          <div className="space-y-2">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-sm text-gray-900 select-none list-none">
                  <h3 className="font-semibold text-sm text-gray-900 m-0">{q}</h3>
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#E8002D] text-white">
        <div className="container max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Узнайте точную цену, а не просто диапазон</h2>
          <p className="text-red-200 text-sm mb-6">
            Бесплатно, без регистрации, без DNI. С вами свяжется консультант, который работает с иностранцами.
          </p>
          <ContratarPlanButtonIntl
            locale="ru"
            fuente="ru-comparison-cta"
            label="Узнать мою цену →"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E8002D] font-bold rounded-2xl hover:bg-red-50 transition-all shadow-lg text-sm"
          />
        </div>
      </section>
    </>
  )
}
