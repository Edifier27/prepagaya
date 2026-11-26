import type { Metadata } from 'next'
import Link from 'next/link'
import { prepagas, PRECIO_ACTUALIZADO_ZH, nivelPrecio } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL, precioDesde } from '@/lib/utils'
import { extremosA30 } from '@/lib/precios/resumen'
import { pesosEn } from '@/lib/precios/en'

// Del cuadro oficial (31-oct-2026), antes escrito a mano
const A30 = extremosA30()
import { NivelPrecioBadge } from '@/components/ui/NivelPrecioBadge'
import { ContratarPlanButtonIntl } from '@/components/prepagas/ContratarPlanButtonIntl'
import { ldJson } from '@/lib/jsonld'
import { TablaPreciosIntl } from '@/components/intl/TablaPreciosIntl'

export const metadata: Metadata = {
  title: { absolute: `阿根廷医疗保险指南:外国人须知(${PRECIO_ACTUALIZADO_ZH}) — ${SITE_NAME}` },
  description:
    '阿根廷外国人医疗保险指南:强制入境保险要求(366/25号法令)、如何在没有DNI的情况下加入当地医保(prepaga),以及2026年真实价格。',
  alternates: {
    canonical: `${SITE_URL}/zh/yiliao-baoxian-agenting`,
    languages: {
      'es-AR': `${SITE_URL}/para/extranjeros`,
      en: `${SITE_URL}/en/health-insurance-argentina`,
      ru: `${SITE_URL}/ru/strahovanie-argentina`,
      zh: `${SITE_URL}/zh/yiliao-baoxian-agenting`,
      pt: `${SITE_URL}/pt/plano-de-saude-argentina`,
    },
  },
  keywords: [
    '阿根廷医疗保险',
    '阿根廷入境保险',
    '阿根廷强制保险2025',
    'prepaga 阿根廷',
    '阿根廷外国人保险',
  ],
}

// texto: la respuesta sin links, para el JSON-LD (26-nov-2026: iba el JSX y
// el FAQPage quedaba con un objeto en vez de texto)
const faqs: { q: string; a: React.ReactNode; texto?: string }[] = [
  {
    q: '医疗保险是入境阿根廷的强制要求吗?',
    a: '是的,如果您没有永久居留权。2025年5月29日在阿根廷《官方公报》(Boletín Oficial)发布的366/2025号法令,要求没有永久居留权的外国人入境时持有医疗保险 — 无论是旅游、留学还是工作(据报道,边境检查自2025年7月1日起实施)。永久居民和阿根廷公民可豁免。',
  },
  {
    q: '持有美国签证的中国公民可以免签入境阿根廷吗?',
    a: '可以。自2025年7月22日起,持有效美国签证的中国公民可免签入境阿根廷,停留期最长30天。不过,免签入境同样需要满足366/25号法令的医疗保险要求。',
  },
  {
    q: '没有DNI可以加入阿根廷的prepaga吗?',
    a: '可以。Swiss Medical接受凭护照或居留申请证明("residencia precaria",在移民局提交居留申请时发放)办理。其他公司请向顾问咨询。办理后,我们会提供保险证明,用于居留和DNI手续。价格与本地居民完全相同 — 国籍不影响费用。',
  },
  {
    q: '阿根廷的私人医疗保险费用是多少?',
    a: <>价格取决于年龄和保险计划,而非国籍。根据{PRECIO_ACTUALIZADO_ZH}的官方价目表,30岁参保人每月{pesosEn(A30.min.precio)}起({A30.min.prepaga} {A30.min.plan}),最贵的计划为{pesosEn(A30.max.precio)}。 <Link href="/zh/yiliao-baoxian-feiyong-agenting" className="text-[#E8002D] hover:underline font-medium">完整价格明细 →</Link></>,
    texto: `价格取决于年龄和保险计划,而非国籍。根据${PRECIO_ACTUALIZADO_ZH}的官方价目表,30岁参保人每月${pesosEn(A30.min.precio)}起(${A30.min.prepaga} ${A30.min.plan}),最贵的计划为${pesosEn(A30.max.precio)}。`,
  },
  {
    q: '旅行保险还是当地prepaga——该如何选择?',
    a: '短期旅行通常选择旅行保险(我们不销售旅行保险)。如果您计划长期在阿根廷生活或工作,当地prepaga是更完整的选择:覆盖范围更广、没有单次事件限额,并且我们会提供保险证明,用于居留和DNI手续。',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '阿根廷医疗保险指南:外国人须知',
    description: '强制入境保险要求、如何加入当地prepaga,以及真实价格。',
    url: `${SITE_URL}/zh/yiliao-baoxian-agenting`,
    image: `${SITE_URL}/opengraph-image`,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/zh/yiliao-baoxian-agenting` },
    inLanguage: 'zh',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a, texto }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: typeof a === 'string' ? a : texto },
    })),
  },
]

export default function YiliaoBaoxianAgentingPage() {
  const destacadas = ['swiss-medical', 'osde', 'medife', 'sancor-salud']
    .map((s) => prepagas.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(jsonLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-3xl mx-auto">
          <span className="inline-block text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-4">
            中文指南 · 更新于 {PRECIO_ACTUALIZADO_ZH}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            阿根廷医疗保险指南:外国人须知
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            366/2025号法令要求没有永久居留权的外国人持有医疗保险,公立医院对非居民的预约诊疗收费。如果您计划长期在阿根廷生活、
            工作或办理居留手续,当地的私人医疗保险(<em>prepaga</em>)通常比国际旅行保险更划算:覆盖范围更广、
            住院无次数限制,且保费与同龄本地居民完全相同。
          </p>
          <ContratarPlanButtonIntl
            locale="zh"
            fuente="zh-pillar"
            label="免费比较真实价格(无需DNI)→"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-md text-sm"
          />
          <p className="text-xs text-gray-400 mt-3">
            Read in English? <Link href="/en/health-insurance-argentina" className="text-[#E8002D] hover:underline font-medium">English guide →</Link>
          </p>
        </div>
      </section>

      {/* Key facts */}
      <section className="py-10 bg-white">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">4项须知要点</h2>
          <div className="space-y-4">
            {[
              { t: '没有永久居留权须持有医疗保险', d: '366/2025号法令(2025年5月29日《官方公报》)要求没有永久居留权的外国人入境时持有医疗保险;据报道,边境检查自2025年7月1日起实施。公立医院对非居民的预约诊疗收费,急诊始终提供。' },
              { t: '无需DNI即可加入prepaga', d: 'Swiss Medical接受外国人凭护照或居留申请证明(residencia precaria)办理。价格与本地居民相同——国籍不影响费用。' },
              { t: '大部分基础医疗服务无等待期', d: '根据法律(Ley 26.682),强制医疗计划(PMO)的服务——门诊、检查、住院、急诊——不得设有等待期,从第一天起即可使用。产科(孕产)是唯一例外:标准等待期为投保后2个月。' },
              { t: '我们提供用于居留和DNI的保险证明', d: '办理后,我们会提供prepaga的保险证明,供您在办理居留和DNI时提交。' },
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

      {/* Precios oficiales con dólares (GEO, 31-oct-2026) */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">官方价格({PRECIO_ACTUALIZADO_ZH})</h2>
          <TablaPreciosIntl locale="zh" />
        </div>
      </section>

      {/* Top companies */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-2">外国人常选保险公司</h2>
          <p className="text-sm text-gray-500 mb-6">价格水平相对市场而言 — {PRECIO_ACTUALIZADO_ZH}。可免费获取您的精确报价。</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {destacadas.map((p) => {
              const desde = precioDesde(p)
              return (
                <Link key={p.slug} href={`/prepagas/${p.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-red-200 hover:shadow-sm transition-all">
                  <div className="font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors">{p.nombre}</div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">{p.planes.length} 个计划 <NivelPrecioBadge nivel={nivelPrecio(desde)} /></div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">常见问题</h2>
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
          <h2 className="text-2xl font-bold mb-2">比较真实价格的保险计划</h2>
          <p className="text-white text-sm mb-6">
            免费、无需注册、无需DNI。专门服务外国客户的顾问将与您联系。
          </p>
          <ContratarPlanButtonIntl
            locale="zh"
            fuente="zh-pillar-cta"
            label="获取我的报价 →"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E8002D] font-bold rounded-2xl hover:bg-red-50 transition-all shadow-lg text-sm"
          />
        </div>
      </section>
    </>
  )
}
