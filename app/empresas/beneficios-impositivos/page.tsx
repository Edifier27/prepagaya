import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_NAME, SITE_URL, CONTENT_UPDATE } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Beneficios Impositivos de la Prepaga Corporativa: Deducción de Ganancias',
  description: 'Cómo deducir de Ganancias la cobertura médica de tus empleados: qué puede deducir la empresa, qué puede deducir cada empleado, y los límites que fija AFIP.',
  alternates: { canonical: `${SITE_URL}/empresas/beneficios-impositivos` },
  keywords: ['deducir prepaga empleados ganancias', 'beneficios impositivos plan corporativo', 'prepaga gasto deducible empresa', 'deduccion ganancias cobertura medica empleados'],
}

const faqs = [
  {
    q: '¿La empresa puede deducir el 100% de lo que paga por la cobertura de sus empleados?',
    a: 'La cobertura médica de los empleados es un gasto de la actividad y en general resulta deducible del Impuesto a las Ganancias de la empresa, dentro de las normas generales de deducibilidad de gastos vinculados a la actividad. Consultá con tu contador la aplicación exacta a tu caso.',
  },
  {
    q: '¿El empleado también puede deducir lo que paga de su bolsillo?',
    a: 'Sí, los aportes a cuotas médico-asistenciales (incluida la parte de un plan corporativo que paga el propio empleado) están entre los conceptos deducibles de la Ganancias de cuarta categoría, con el límite porcentual que fija AFIP sobre la ganancia neta del período.',
  },
  {
    q: '¿Cambia algo si es plan corporativo particular en vez de derivación de aportes?',
    a: 'El tratamiento impositivo de fondo (gasto deducible para la empresa, deducción personal para el empleado por su parte) aplica en general a ambas modalidades. Lo que sí cambia es el mecanismo de facturación y de dónde sale cada peso — confirmalo con tu contador antes de decidir la estructura.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Beneficios impositivos de la prepaga corporativa',
    description: 'Guía sobre deducción de Ganancias en planes corporativos de medicina prepaga en Argentina.',
    url: `${SITE_URL}/empresas/beneficios-impositivos`,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    dateModified: CONTENT_UPDATE,
    inLanguage: 'es-AR',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Empresas', item: `${SITE_URL}/empresas` },
      { '@type': 'ListItem', position: 3, name: 'Beneficios impositivos' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
]

export default function BeneficiosImpositivosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-[#E8002D] transition-colors">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <Link href="/empresas" className="hover:text-[#E8002D] transition-colors">Empresas</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">Beneficios impositivos</span>
          </nav>
        </div>
      </div>

      <section className="py-12 bg-white">
        <div className="container max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Beneficios impositivos de la prepaga corporativa</h1>
          <p className="text-gray-600 leading-relaxed mb-8">
            Ofrecer cobertura médica no es solo un beneficio para retener empleados: también tiene un tratamiento impositivo favorable, tanto para la empresa como para cada empleado. Esto es lo que hay que saber antes de armar la estructura del convenio — la aplicación exacta a tu caso siempre la confirma tu contador.
          </p>

          <div className="space-y-6 mb-10">
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Del lado de la empresa</h2>
              <p className="text-sm text-gray-600 leading-relaxed">La cobertura médica que la empresa paga por sus empleados es, en general, un gasto vinculado a la actividad y resulta deducible del Impuesto a las Ganancias de la empresa, bajo las reglas generales de deducibilidad de gastos del giro del negocio.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Del lado del empleado</h2>
              <p className="text-sm text-gray-600 leading-relaxed">Si el empleado paga una parte de su bolsillo (por ejemplo, para sumar a su grupo familiar), ese monto entra entre los conceptos deducibles de su Ganancias de cuarta categoría, junto con otros aportes a cuotas médico-asistenciales. AFIP fija un límite porcentual sobre la ganancia neta del período — no es 100% ilimitado.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Por qué conviene definir bien la estructura del convenio desde el principio</h2>
              <p className="text-sm text-gray-600 leading-relaxed">Cómo se factura (a la empresa, repartido, o con la modalidad de afinidad de Swiss Medical donde la factura llega directo a cada empleado) no solo define quién hace el trabajo administrativo — también define de qué lado sale cada deducción. Armarlo bien desde el convenio inicial evita tener que reordenar todo después.</p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-2xl p-5 mb-10">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Importante:</strong> esta página resume el criterio general de tratamiento impositivo, no reemplaza el asesoramiento de tu contador o estudio contable. Los porcentajes y límites de deducción los fija y actualiza periódicamente AFIP — confirmá los valores vigentes antes de tomar una decisión.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Preguntas frecuentes</h2>
            <div className="space-y-4">
              {faqs.map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{q}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#E8002D] rounded-2xl p-6 text-center">
            <p className="text-white font-bold mb-3">¿Armamos la propuesta para tu empresa?</p>
            <Link href="/empresas#cotizar" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#E8002D] font-bold rounded-xl text-sm hover:bg-red-50 transition-colors">
              Pedir cotización →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
