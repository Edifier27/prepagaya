import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_NAME, SITE_URL } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Cómo Cotizar un Plan Corporativo de Prepaga: Guía Paso a Paso',
  description: 'Qué pide cada prepaga para cotizar un plan corporativo, cuántos empleados mínimo, qué documentación armar y cómo es el proceso real de principio a fin.',
  alternates: { canonical: `${SITE_URL}/empresas/como-cotizar` },
  keywords: ['como cotizar plan corporativo prepaga', 'cuantos empleados minimo plan corporativo', 'documentacion plan corporativo prepaga', 'requisitos prepaga empresa'],
}

const faqs = [
  {
    q: '¿Necesito un mínimo de empleados para cotizar?',
    a: 'Sí, pero varía por prepaga: algunas dan condiciones corporativas desde 2-3 empleados, otras piden 5 o 10 para acceder a los mejores descuentos por volumen. Por debajo del mínimo de una empresa, otra puede igual ofrecerte convenio — por eso conviene comparar más de una.',
  },
  {
    q: '¿Puedo empezar el trámite sin tener todavía la nómina definitiva?',
    a: 'Sí, para la cotización inicial alcanza con la cantidad de gente y un rango de edades aproximado. La nómina exacta (con DNI y fecha de nacimiento de cada uno) se pide recién para el alta definitiva.',
  },
  {
    q: '¿Cuánto tarda en aprobarse un plan corporativo nuevo?',
    a: 'Una vez que la empresa firma el convenio y entrega la nómina completa, el alta de cada empleado suele demorar entre 1 y 2 semanas. La cotización y la propuesta en sí las tenés mucho antes, generalmente en 24-48hs.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Cómo cotizar un plan corporativo de prepaga',
    description: 'Guía paso a paso para cotizar cobertura médica corporativa para una empresa o pyme en Argentina.',
    url: `${SITE_URL}/empresas/como-cotizar`,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    inLanguage: 'es-AR',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Empresas', item: `${SITE_URL}/empresas` },
      { '@type': 'ListItem', position: 3, name: 'Cómo cotizar' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
]

export default function ComoCotizarEmpresasPage() {
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
            <span className="text-gray-700">Cómo cotizar</span>
          </nav>
        </div>
      </div>

      <section className="py-12 bg-white">
        <div className="container max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Cómo cotizar un plan corporativo de prepaga</h1>
          <p className="text-gray-600 leading-relaxed mb-8">
            A diferencia de un plan individual (que se cotiza al instante con solo la edad y la zona), un plan corporativo depende de la composición de todo el equipo: no hay un precio de lista único, cada prepaga arma una propuesta a medida. Así es el proceso real, de punta a punta.
          </p>

          <div className="space-y-6 mb-10">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">1. El mínimo de empleados</h2>
              <p className="text-sm text-gray-600 leading-relaxed">Cada prepaga define su propio mínimo para considerar "corporativa" a una cuenta: algunas arrancan en 2-3 empleados, otras piden 5 o 10 para los mejores descuentos por volumen. Si tu equipo es chico, igual vale la pena cotizar en varias — el mínimo que te frena en una prepaga puede no aplicar en otra.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">2. Qué información pedir primero (sin nómina definitiva)</h2>
              <p className="text-sm text-gray-600 leading-relaxed">Para una cotización inicial alcanza con: cantidad de empleados, un rango de edades aproximado del equipo, y si vas a derivar aportes de obra social o contratar un plan corporativo particular. No hace falta tener la nómina cerrada con nombre y DNI de cada uno para pedir el primer número.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">3. Comparar entre 2-3 prepagas, no una sola</h2>
              <p className="text-sm text-gray-600 leading-relaxed">Cada prepaga negocia distinto según el rubro de tu empresa, la zona y la composición etaria. La misma cantidad de gente puede salir bastante distinto entre dos empresas de medicina prepaga — por eso conviene pedir la propuesta comparada, no la primera que te ofrezcan.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">4. La documentación para el alta definitiva</h2>
              <p className="text-sm text-gray-600 leading-relaxed">Una vez elegida la prepaga y firmado el convenio, se pide la nómina completa: nombre, DNI y fecha de nacimiento de cada empleado (y de su grupo familiar, si lo suman). Con eso arman el alta individual de cada uno.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">5. Los plazos reales</h2>
              <p className="text-sm text-gray-600 leading-relaxed">La cotización y la propuesta comparada las tenés generalmente en 24-48hs. El alta de cada empleado, una vez firmado el convenio y entregada la nómina completa, suele tardar entre 1 y 2 semanas.</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 mb-10">
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
            <p className="text-white font-bold mb-3">¿Querés la propuesta comparada para tu equipo?</p>
            <Link href="/empresas#cotizar" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#E8002D] font-bold rounded-xl text-sm hover:bg-red-50 transition-colors">
              Pedir cotización →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
