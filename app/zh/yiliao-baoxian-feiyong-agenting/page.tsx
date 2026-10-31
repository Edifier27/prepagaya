import type { Metadata } from 'next'
import Link from 'next/link'
import { PRECIO_ACTUALIZADO_ZH } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { extremosA30 } from '@/lib/precios/resumen'
import { pesosEn, precioPlan } from '@/lib/precios/en'
import { TablaPreciosIntl } from '@/components/intl/TablaPreciosIntl'
import { UsdAprox } from '@/components/intl/Dolar'

// Montos del cuadro oficial (31-oct-2026): antes "~AR$170 000", "300,000–500,000"
// y "1 000 000" escritos a mano, y "大多数公司15%折扣" (solo Swiss)
const A30 = extremosA30()
const SMG20 = precioPlan('swiss-medical', 'smg20')
const OSDE210 = precioPlan('osde', '210')
import { ContratarPlanButtonIntl } from '@/components/prepagas/ContratarPlanButtonIntl'
import { ldJson } from '@/lib/jsonld'

export const metadata: Metadata = {
  title: { absolute: `阿根廷医疗保险费用是多少?(${PRECIO_ACTUALIZADO_ZH}真实价格) — ${SITE_NAME}` },
  description:
    `${PRECIO_ACTUALIZADO_ZH}官方价格(30岁):每月${pesosEn(A30.min.precio)}起(${A30.min.prepaga} ${A30.min.plan})。Swiss Medical SMG20 ${pesosEn(SMG20)},OSDE 210 ${pesosEn(OSDE210)}。外国人与本地人价格相同。`,
  alternates: {
    canonical: `${SITE_URL}/zh/yiliao-baoxian-feiyong-agenting`,
    languages: {
      en: `${SITE_URL}/en/health-insurance-cost-argentina`,
      ru: `${SITE_URL}/ru/stoimost-strahovaniya-argentina`,
      zh: `${SITE_URL}/zh/yiliao-baoxian-feiyong-agenting`,
    },
  },
  keywords: [
    '阿根廷医疗保险费用',
    '阿根廷保险价格',
    'prepaga阿根廷多少钱',
    '阿根廷私立医疗保险价格',
    '阿根廷保险月费2026',
  ],
}

const dengji = [
  { nombre: '基础级', rango: `每月${pesosEn(A30.min.precio)}起`, desc: `强制医疗计划(PMO——法定最低标准:门诊、检查、住院、急诊、生育)全覆盖,门诊通常需自付。最便宜的计划:${A30.min.prepaga} ${A30.min.plan}。` },
  { nombre: '中端(无自付)', rango: `每月${pesosEn(Math.min(SMG20, OSDE210))}–${pesosEn(Math.max(SMG20, OSDE210))}`, desc: `门诊无需自付,医生网络更广,例如OSDE 210(${pesosEn(OSDE210)})或拥有自有医院的Swiss Medical SMG20(${pesosEn(SMG20)})。` },
  { nombre: '高端', rango: `每月最高${pesosEn(A30.max.precio)}`, desc: `医生网络最广,单人病房,含海外保障。最贵的计划:${A30.max.prepaga} ${A30.max.plan}。` },
]

const faqs = [
  {
    q: '年龄对价格影响大吗?',
    a: '是的——这是最主要的因素。价格按年龄段设定,40岁后明显上升,60岁后再次上升。25岁和55岁的人在同一计划上支付的月费差别很大。',
  },
  {
    q: '在线签约或自动扣款是否有折扣?',
    a: 'Swiss Medical有:通过PrepagaYa网上投保可享标价15%优惠(单一税纳税人25%)。其他公司按标价计算。',
  },
  {
    q: '家庭计划贵多少?',
    a: '每位家庭成员按各自年龄单独定价后相加,没有统一的"家庭价"。一对带两个小孩的夫妻,通常人均费用明显低于四个成人,因为儿童的定价更低。',
  },
  {
    q: '外国人需要多付钱吗?',
    a: '不需要。国籍不影响价格——您支付的价格与同龄本地居民完全相同。',
  },
  {
    q: '最快了解我的具体价格的方法是什么?',
    a: '使用免费的比较工具:输入您(以及家人,如适用)的年龄和所在城市,大约两分钟内即可获得所有主要保险公司的真实价格,无需DNI,无需注册。',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `阿根廷医疗保险费用是多少?${PRECIO_ACTUALIZADO_ZH}`,
    description: '按保障级别划分的prepaga真实价格,以及真正影响价格的因素。',
    url: `${SITE_URL}/zh/yiliao-baoxian-feiyong-agenting`,
    image: `${SITE_URL}/opengraph-image`,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/zh/yiliao-baoxian-feiyong-agenting` },
    inLanguage: 'zh',
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

export default function YiliaoBaoxianFeiyongAgentingPage() {
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
            阿根廷医疗保险费用是多少?
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            根据{PRECIO_ACTUALIZADO_ZH}的官方价目表,30岁参保人的阿根廷私人医疗保险<strong className="text-gray-900">每月{pesosEn(A30.min.precio)}<UsdAprox ars={A30.min.precio} />起</strong>({A30.min.prepaga} {A30.min.plan}),
            最贵的计划为{pesosEn(A30.max.precio)}。热门的无自付计划:OSDE 210为{pesosEn(OSDE210)},Swiss Medical SMG20为{pesosEn(SMG20)}(网上投保优惠15%)。您的具体价格主要取决于年龄、计划和是否需要自付。
          </p>
          <ContratarPlanButtonIntl
            locale="zh"
            fuente="zh-cost"
            label="按年龄查看我的确切价格(免费,无需DNI)→"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-md text-sm"
          />
          <p className="text-xs text-gray-400 mt-3">
            <Link href="/zh/yiliao-baoxian-agenting" className="text-[#E8002D] hover:underline font-medium">← 阿根廷医疗保险总览指南</Link>
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-10 bg-white">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">按保障级别划分的价格(30岁,个人)</h2>
          <div className="space-y-4">
            {dengji.map((t) => (
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
            标价,{PRECIO_ACTUALIZADO_ZH},来自各公司向SSSalud申报的官方价目表。Swiss Medical:网上投保优惠15%(单一税纳税人25%)。
          </p>
        </div>
      </section>

      {/* 官方价格(GEO) */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">各公司及计划官方价格({PRECIO_ACTUALIZADO_ZH})</h2>
          <TablaPreciosIntl locale="zh" />
        </div>
      </section>

      {/* What moves the price */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">真正影响价格的因素</h2>
          <div className="space-y-4">
            {[
              { t: '您的年龄', d: '最主要的因素。价格按年龄段递增,40岁后明显上升,60岁后再次上升。' },
              { t: '是否自付', d: '门诊无需自付的计划比其他条件相似但有自付的计划价格更高。' },
              { t: '您的家庭成员', d: '每位家庭成员按各自年龄单独定价后相加——没有统一的家庭折扣,但儿童的定价低于成人。' },
              { t: '仅此而已', d: '国籍、原籍国和移民身份不影响价格——您支付的价格与同龄本地居民完全相同。' },
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
          <h2 className="text-2xl font-bold mb-2">获取确切价格,而不只是区间</h2>
          <p className="text-white text-sm mb-6">
            免费、无需注册、无需DNI。专门服务外国客户的顾问将与您联系。
          </p>
          <ContratarPlanButtonIntl
            locale="zh"
            fuente="zh-cost-cta"
            label="获取我的报价 →"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E8002D] font-bold rounded-2xl hover:bg-red-50 transition-all shadow-lg text-sm"
          />
        </div>
      </section>
    </>
  )
}
