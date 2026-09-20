import type { Metadata } from 'next'
import Link from 'next/link'
import { prepagas, PRECIO_ACTUALIZADO_EN } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL } from '@/lib/utils'

export const metadata: Metadata = {
  title: { absolute: `Страховка для беременных в Аргентине: роды и ведение беременности — ${SITE_NAME}` },
  description:
    'Как работает медицинская страховка для беременных в Аргентине: период ожидания на роды, что гарантирует PMO, и какие prepaga лучше всего покрывают беременность и роды.',
  alternates: {
    canonical: `${SITE_URL}/ru/strahovka-dlya-beremennyh`,
    languages: {
      'es-AR': `${SITE_URL}/para/embarazadas`,
      ru: `${SITE_URL}/ru/strahovka-dlya-beremennyh`,
    },
  },
  keywords: [
    'страховка для беременных аргентина',
    'роды в аргентине',
    'prepaga роды',
    'медицинская страховка беременность аргентина',
    'период ожидания роды аргентина',
  ],
}

const rekomendovano: { slug: string; razon: string }[] = [
  { slug: 'swiss-medical', razon: 'Собственные родильные отделения национального уровня. Полное покрытие родов и неонатологии высокой сложности.' },
  { slug: 'osde', razon: 'Доступ к лучшим частным родильным домам страны. Очень широкая сеть акушеров-гинекологов.' },
  { slug: 'sancor-salud', razon: 'Хорошее акушерское покрытие по доступной цене — если бюджет ограничен.' },
]

const faqs = [
  {
    q: 'Есть ли период ожидания на роды?',
    a: 'Да, стандартный — 2 месяца с даты оформления prepaga. Дата последней менструации (ПДМ) должна приходиться на срок позже этих 2 месяцев, чтобы беременность покрывалась без доплаты.',
  },
  {
    q: 'Что если я узнаю о беременности уже после оформления страховки?',
    a: 'Если окажется, что вы забеременели чуть раньше 2-месячного срока, не зная об этом на момент оформления, — в покрытии не откажут. Нужно будет доплатить сумму, равную 3 ежемесячным взносам плана, как карентную доплату.',
  },
  {
    q: 'Можно ли заявить о беременности при оформлении, если она уже подтверждена?',
    a: 'Нет — точнее, можно попробовать, но заявку, скорее всего, просто не примут. Правило рассчитано на тех, кто оформляет страховку заранее или ещё не знает о беременности, а не на подтверждённую на момент подачи заявки беременность.',
  },
  {
    q: 'Что гарантирует обязательная программа покрытия (PMO) при беременности?',
    a: 'PMO обязывает все prepaga покрывать: полное наблюдение беременности, роды (естественные или кесарево), госпитализацию матери и новорождённого, и базовую неонатологию. Госпитализация в неонатологии высокой сложности также включена.',
  },
  {
    q: 'Стоит ли оформлять страховку заранее, до наступления беременности?',
    a: 'Да — это самый надёжный вариант: оформляясь заранее, вы гарантированно проходите 2-месячный срок без доплат и можете спокойно выбрать подходящую компанию и план, без спешки.',
  },
  {
    q: 'Какая prepaga лучше всего подходит для родов?',
    a: 'Среди наиболее сильных вариантов: Swiss Medical (собственные родильные отделения национального уровня), OSDE (доступ к лучшим частным родильным домам и широкая сеть акушеров) и Sancor Salud (хорошее акушерское покрытие по более доступной цене).',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Страховка для беременных в Аргентине: роды и ведение беременности',
    description: 'Период ожидания на роды, что гарантирует PMO, и лучшие prepaga для беременности.',
    url: `${SITE_URL}/ru/strahovka-dlya-beremennyh`,
    image: `${SITE_URL}/opengraph-image`,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/ru/strahovka-dlya-beremennyh` },
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

export default function StrahovkaDlyaBeremennyhPage() {
  const planes = rekomendovano
    .map((r) => ({ r, prep: prepagas.find((p) => p.slug === r.slug) }))
    .filter((x): x is { r: typeof rekomendovano[number]; prep: NonNullable<typeof x.prep> } => Boolean(x.prep))

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
            Страховка для беременных в Аргентине
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            Для беременности действует отдельное правило: стандартный период ожидания — 2 месяца с даты оформления
            prepaga (дата последней менструации должна приходиться на срок после этих 2 месяцев). Если окажется,
            что вы забеременели немного раньше, не зная об этом, — в покрытии не откажут, но нужно будет доплатить
            сумму, равную 3 ежемесячным взносам. А вот заявить об уже подтверждённой беременности в момент
            оформления нельзя — в этом случае заявку, скорее всего, просто не примут.
          </p>
          <Link
            href="/comparador"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-md text-sm"
          >
            Сравнить планы (бесплатно, без DNI) →
          </Link>
          <p className="text-xs text-gray-400 mt-3">
            <Link href="/ru/strahovanie-argentina" className="text-[#E8002D] hover:underline font-medium">← Общий гид по страховке в Аргентине</Link>
          </p>
        </div>
      </section>

      {/* Key facts */}
      <section className="py-10 bg-white">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Что важно знать</h2>
          <div className="space-y-4">
            {[
              { t: 'Стандартный период ожидания — 2 месяца', d: 'Считается от даты оформления prepaga. Чтобы беременность покрывалась без доплаты, дата последней менструации (ПДМ) должна быть позже этих 2 месяцев.' },
              { t: 'Если беременность обнаружилась раньше срока', d: 'Если вы оформили страховку, не зная, что уже беременны (например, срок 1 месяц), в покрытии не откажут — но нужно будет доплатить карентную сумму, равную 3 ежемесячным взносам плана.' },
              { t: 'Нельзя заявлять о беременности при оформлении', d: 'Если на момент подачи заявки беременность уже подтверждена и об этом заявлено компании, заявку, скорее всего, просто не примут.' },
              { t: 'Остальной уход — без периода ожидания', d: 'Осмотры, УЗИ, анализы, экстренная помощь и другие услуги обязательной программы покрытия (PMO) не связаны с этим правилом и покрываются с первого дня.' },
            ].map((item, i) => (
              <div key={item.t} className="flex items-start gap-4 bg-gray-50 rounded-2xl border border-gray-100 p-5">
                <span className="w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-sm font-bold text-[#E8002D] flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <div className="font-bold text-gray-900 text-sm mb-1">{item.t}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Лучшие варианты для беременности и родов</h2>
          <div className="space-y-3">
            {planes.map(({ r, prep }) => (
              <Link key={r.slug} href={`/prepagas/${r.slug}`}
                className="block bg-white rounded-2xl border border-gray-200 hover:border-red-200 hover:shadow-sm p-5 transition-all">
                <div className="font-bold text-gray-900">{prep.nombre}</div>
                <p className="text-sm text-gray-600 leading-relaxed mt-1">{r.razon}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 bg-white border-t border-gray-100">
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
          <h2 className="text-2xl font-bold mb-2">Сравните планы с реальными ценами</h2>
          <p className="text-red-200 text-sm mb-6">
            Бесплатно, без регистрации, без DNI. С вами свяжется консультант, который работает с иностранцами.
          </p>
          <Link
            href="/comparador"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E8002D] font-bold rounded-2xl hover:bg-red-50 transition-all shadow-lg text-sm"
          >
            Узнать мою цену →
          </Link>
        </div>
      </section>
    </>
  )
}
