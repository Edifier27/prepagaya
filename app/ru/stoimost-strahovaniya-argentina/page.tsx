import type { Metadata } from 'next'
import Link from 'next/link'
import { PRECIO_ACTUALIZADO_EN } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL } from '@/lib/utils'

export const metadata: Metadata = {
  title: { absolute: `Сколько стоит медицинская страховка в Аргентине? (${PRECIO_ACTUALIZADO_EN}) — ${SITE_NAME}` },
  description:
    'Реальные цены на prepaga в Аргентине по уровню покрытия: базовый, средний и премиум — плюс что на самом деле влияет на цену (возраст, доплаты, план) и скидка 25% при онлайн-оформлении.',
  alternates: {
    canonical: `${SITE_URL}/ru/stoimost-strahovaniya-argentina`,
    languages: {
      'es-AR': `${SITE_URL}/para/extranjeros`,
      en: `${SITE_URL}/en/health-insurance-cost-argentina`,
      ru: `${SITE_URL}/ru/stoimost-strahovaniya-argentina`,
    },
  },
  keywords: [
    'сколько стоит страховка аргентина',
    'цена prepaga аргентина',
    'стоимость медицинской страховки аргентина',
    'prepaga аргентина цена 2026',
    'ежемесячная стоимость страховки аргентина',
  ],
}

const urovni = [
  { nombre: 'Базовый уровень', rango: 'от ~AR$170 000/мес', desc: 'Полное покрытие обязательной программы (PMO — законодательный минимум: приём врача, анализы, госпитализация, неотложная помощь, роды) для человека 30 лет. Обычно с доплатой за приём врача.' },
  { nombre: 'Средний уровень', rango: 'AR$300 000–500 000/мес', desc: 'Без доплат за приём, более широкая сеть врачей, часто с доступом к как минимум одной клинике высокой сложности.' },
  { nombre: 'Премиум', rango: 'от AR$1 000 000/мес', desc: 'Самая широкая сеть врачей, отдельные палаты, минимальное время ожидания к специалистам и на плановые процедуры.' },
]

const faqs = [
  {
    q: 'Сильно ли возраст влияет на цену?',
    a: 'Да — это главный фактор. Цены устанавливаются по возрастным группам и заметно растут после 40 лет, а затем снова после 60. Человек 25 лет и человек 55 лет на одном и том же плане платят совсем разные суммы.',
  },
  {
    q: 'Есть ли скидка за онлайн-оформление или автоматическое списание?',
    a: 'Да, большинство компаний дают около 25% скидки от базовой цены за оформление онлайн с автоматическим ежемесячным списанием — эта скидка уже учтена в ценах, которые вы получаете через PrepagaYa.',
  },
  {
    q: 'Насколько дороже стоит семейный план?',
    a: 'Каждый член семьи оценивается индивидуально по своему возрасту, без единого "семейного тарифа". Пара с двумя маленькими детьми обычно платит заметно меньше на человека, чем четверо взрослых, потому что дети оцениваются дешевле.',
  },
  {
    q: 'Платят ли иностранцы больше?',
    a: 'Нет. Гражданство не влияет на цену — вы платите ровно ту же базовую цену, что и местный житель вашего возраста.',
  },
  {
    q: 'Как быстрее всего узнать точную цену?',
    a: 'Воспользуйтесь бесплатным сравнением: укажите свой возраст (и возраст членов семьи, если нужно) и город — вы получите реальные цены по всем крупным компаниям примерно за две минуты, без DNI и регистрации.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Сколько стоит медицинская страховка в Аргентине? ${PRECIO_ACTUALIZADO_EN}`,
    description: 'Реальные цены на prepaga по уровню покрытия, и что на самом деле влияет на цену.',
    url: `${SITE_URL}/ru/stoimost-strahovaniya-argentina`,
    image: `${SITE_URL}/opengraph-image`,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/ru/stoimost-strahovaniya-argentina` },
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

export default function StoimostStrahovaniyaArgentinaPage() {
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
            Сколько стоит медицинская страховка в Аргентине?
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            Базовые цены для человека 30 лет — от около AR$170 000/мес за начальный уровень покрытия до более
            AR$1 000 000/мес за премиум-планы, по состоянию на {PRECIO_ACTUALIZADO_EN.toLowerCase()}. Ваша точная
            цена зависит в основном от возраста, уровня плана и наличия доплат за приём врача.
          </p>
          <Link
            href="/comparador"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-md text-sm"
          >
            Узнать точную цену по возрасту (бесплатно, без DNI) →
          </Link>
          <p className="text-xs text-gray-400 mt-3">
            <Link href="/ru/strahovanie-argentina" className="text-[#E8002D] hover:underline font-medium">← Общий гид по страховке в Аргентине</Link>
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-10 bg-white">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Цена по уровню покрытия (30 лет, один человек)</h2>
          <div className="space-y-4">
            {urovni.map((t) => (
              <div key={t.nombre} className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <span className="font-bold text-gray-900">{t.nombre}</span>
                  <span className="text-sm font-bold text-[#E8002D]">{t.rango}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mt-2">{t.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Базовые цены, {PRECIO_ACTUALIZADO_EN.toLowerCase()}. Большинство компаний дают около 25% скидки за
            онлайн-оформление с автоматическим списанием — эта скидка уже учтена в ценах через сравнение.
          </p>
        </div>
      </section>

      {/* What moves the price */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Что на самом деле влияет на цену</h2>
          <div className="space-y-4">
            {[
              { t: 'Ваш возраст', d: 'Главный фактор. Цена растёт по возрастным группам, особенно заметно после 40 лет, а затем снова после 60.' },
              { t: 'Доплата или без доплаты', d: 'Планы без доплаты за приём врача стоят дороже, чем похожие планы с доплатой.' },
              { t: 'Ваша семья', d: 'Каждый человек оценивается индивидуально по своему возрасту — единого семейного тарифа нет, но дети оцениваются дешевле взрослых.' },
              { t: 'Больше ничего', d: 'Гражданство, страна происхождения и миграционный статус не влияют на цену — вы платите ту же базовую цену, что и местный житель вашего возраста.' },
            ].map((item, i) => (
              <div key={item.t} className="flex items-start gap-4 bg-white rounded-2xl border border-gray-100 p-5">
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
          <h2 className="text-2xl font-bold mb-2">Узнайте точную цену, а не диапазон</h2>
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
