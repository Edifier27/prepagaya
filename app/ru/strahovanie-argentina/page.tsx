import type { Metadata } from 'next'
import Link from 'next/link'
import { prepagas, PRECIO_ACTUALIZADO_EN, nivelPrecio } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { NivelPrecioBadge } from '@/components/ui/NivelPrecioBadge'

export const metadata: Metadata = {
  title: { absolute: `Медицинская страховка в Аргентине: гид для иностранцев (${PRECIO_ACTUALIZADO_EN}) — ${SITE_NAME}` },
  description:
    'Как работает медицинская страховка в Аргентине для иностранцев: обязательное страхование при въезде (Декрет 366/25), как оформить местную prepaga без DNI, и реальные цены 2026 года.',
  alternates: {
    canonical: `${SITE_URL}/ru/strahovanie-argentina`,
    languages: {
      'es-AR': `${SITE_URL}/para/extranjeros`,
      en: `${SITE_URL}/en/health-insurance-argentina`,
      ru: `${SITE_URL}/ru/strahovanie-argentina`,
    },
  },
  keywords: [
    'медицинская страховка аргентина',
    'страховка для въезда в аргентину',
    'обязательная страховка аргентина 2025',
    'prepaga аргентина',
    'переезд в аргентину медицина',
  ],
}

const faqs = [
  {
    q: 'Обязательна ли страховка для въезда в Аргентину?',
    a: 'Да. С июля 2025 года, согласно Декрету 366/25, все иностранцы, не являющиеся постоянными резидентами, обязаны иметь действующую медицинскую страховку на весь период пребывания — туристы, студенты и работники. Постоянные резиденты и натурализованные граждане освобождены от этого требования.',
  },
  {
    q: 'Можно ли оформить аргентинскую prepaga без DNI?',
    a: 'Обычно да. Большинство крупных компаний принимают оформление по загранпаспорту и справке о поданном заявлении на резиденцию ("residencia precaria"). Некоторые запрашивают временный налоговый номер (CDI/CUIL) для выставления счетов.',
  },
  {
    q: 'Сколько стоит частная медицинская страховка в Аргентине?',
    a: `Иностранцы платят столько же, сколько местные жители: цена зависит от возраста и плана, а не от гражданства. По состоянию на ${PRECIO_ACTUALIZADO_EN}, базовые планы начинаются примерно от AR$170.000/мес для человека 30 лет, планы среднего уровня без доплат — AR$300.000–500.000, премиум-планы — от AR$1.000.000.`,
  },
  {
    q: 'Туристическая страховка или местная prepaga — что выбрать?',
    a: 'Для короткой поездки туристическая страховка покрывает требование при въезде и стоит дешевле. Если вы переезжаете в Аргентину на длительный срок, местная prepaga — единственный полноценный вариант: широкая сеть врачей, госпитализация без лимитов, и справка о покрытии, которую принимают миграционные органы при оформлении резиденции.',
  },
  {
    q: 'Покрывает ли prepaga роды и наблюдение беременности?',
    a: <>Да, по обязательной программе покрытия (PMO). Стандартный период ожидания для беременности — 2 месяца с даты оформления: чтобы беременность покрывалась без доплаты, дата последней менструации (ПДПМ) должна быть позже этих 2 месяцев. Если вы забеременели, не зная об этом, раньше — покрытие не отменяется, но нужно доплатить сумму, равную 3 ежемесячным взносам. <Link href="/ru/strahovka-dlya-beremennyh" className="text-[#E8002D] hover:underline font-medium">Подробнее о страховке для беременных →</Link></>,
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Медицинская страховка в Аргентине: гид для иностранцев',
    description: 'Обязательное страхование при въезде, оформление prepaga без DNI, реальные цены.',
    url: `${SITE_URL}/ru/strahovanie-argentina`,
    image: `${SITE_URL}/opengraph-image`,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/ru/strahovanie-argentina` },
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

export default function StrahovanieArgentinaPage() {
  const destacadas = ['swiss-medical', 'osde', 'medife', 'sancor-salud']
    .map((s) => prepagas.find((p) => p.slug === s))
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
            Медицинская страховка в Аргентине: гид для иностранцев
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            С июля 2025 года Аргентина требует от всех иностранных гостей медицинскую страховку (Декрет 366/25).
            А если вы переезжаете сюда — на работу, учёбу или для оформления резиденции — местный частный план
            (<em>prepaga</em>) обычно намного выгоднее международной туристической страховки: полная сеть клиник,
            без лимитов на госпитализацию, и вы платите столько же, сколько местные жители вашего возраста.
          </p>
          <Link
            href="/comparador"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-md text-sm"
          >
            Сравнить реальные цены (бесплатно, без DNI) →
          </Link>
          <p className="text-xs text-gray-400 mt-3">
            Read in English? <Link href="/en/health-insurance-argentina" className="text-[#E8002D] hover:underline font-medium">English guide →</Link>
          </p>
        </div>
      </section>

      {/* Key facts */}
      <section className="py-10 bg-white">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">4 главных факта</h2>
          <div className="space-y-4">
            {[
              { t: 'Страховка теперь обязательна на границе', d: 'Декрет 366/25 (действует с июля 2025 года) требует от каждого иностранца-нерезидента иметь медицинскую страховку на весь срок пребывания — при въезде по воздуху, суше или морю. Постоянные резиденты и граждане освобождены.' },
              { t: 'Prepaga можно оформить без DNI', d: 'Большинство крупных компаний принимают иностранцев по загранпаспорту и справке о поданном заявлении на резиденцию. Иногда требуется временный налоговый номер для выставления счетов. Цена такая же, как для местных — гражданство не влияет на стоимость.' },
              { t: 'Никаких периодов ожидания на основные услуги', d: 'По закону (Ley 26.682) услуги обязательной программы покрытия (PMO) — приём врача, анализы, госпитализация, неотложная помощь, роды — не могут иметь периода ожидания. Покрытие начинается с первого дня.' },
              { t: 'Справка от prepaga подходит для миграционных документов', d: 'Справку о покрытии, которую выдаёт любая prepaga, принимают миграционные органы Аргентины как подтверждение медицинской страховки при оформлении временной резиденции.' },
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

      {/* Top companies */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Популярные варианты среди иностранцев</h2>
          <p className="text-sm text-gray-500 mb-6">Уровень цены относительно рынка — {PRECIO_ACTUALIZADO_EN}. Точную цену можно узнать бесплатно.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {destacadas.map((p) => {
              const desde = Math.min(...p.planes.map((pl) => pl.precio))
              return (
                <Link key={p.slug} href={`/prepagas/${p.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-red-200 hover:shadow-sm transition-all">
                  <div className="font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors">{p.nombre}</div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">{p.planes.length} планов <NivelPrecioBadge nivel={nivelPrecio(desde)} /></div>
                </Link>
              )
            })}
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
