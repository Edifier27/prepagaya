import type { Metadata } from 'next'
import Link from 'next/link'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'
import { EmpresasForm } from '@/components/empresas/EmpresasForm'

export const metadata: Metadata = {
  title: 'OSDE para Empresas: Plan Corporativo y Convenio para PyMEs',
  description: 'Plan corporativo de OSDE para tu empresa: la red de profesionales más grande de Argentina, planes 210/310/410/510 y facturación corporativa. Cotizá gratis.',
  alternates: { canonical: `${SITE_URL}/empresas/osde` },
  keywords: ['osde empresas', 'osde plan corporativo', 'osde pymes', 'cotizar osde empresa', 'convenio corporativo osde'],
}

const osde = prepagas.find((p) => p.slug === 'osde')!

const faqs = [
  {
    q: '¿Qué planes de OSDE se pueden contratar de forma corporativa?',
    a: 'Los mismos planes de la línea estándar (210, 310, 410, 510) se pueden contratar bajo convenio corporativo, con condiciones negociadas según el tamaño y composición de tu equipo.',
  },
  {
    q: '¿Cómo se factura el plan corporativo de OSDE?',
    a: 'El esquema habitual es que la factura llega a la empresa, que gestiona internamente el reparto del costo con cada empleado si corresponde (vía recibo de sueldo). Si tu prioridad es que RRHH no tenga que gestionar esa administración, comparalo con la modalidad de afinidad de Swiss Medical, donde la factura va directo a cada empleado.',
  },
  {
    q: '¿Por qué elegir OSDE para mi empresa?',
    a: 'Por la red: más de 140.000 profesionales y 380+ centros de atención en todo el país, la más grande del mercado. Es la opción más fuerte si tu equipo está distribuido en varias provincias y necesitás cobertura pareja en todo el país.',
  },
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Plan corporativo de medicina prepaga',
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    areaServed: { '@type': 'Country', name: 'Argentina' },
    audience: { '@type': 'BusinessAudience', audienceType: 'PyMEs y empresas' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Empresas', item: `${SITE_URL}/empresas` },
      { '@type': 'ListItem', position: 3, name: 'OSDE' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
]

export default function EmpresasOsdePage() {
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
            <span className="text-gray-700">OSDE</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <PrepagaLogo slug="osde" nombre="OSDE" colorPrimario={osde.colorPrimario} size="md" />
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">
              Plan corporativo · {PRECIO_ACTUALIZADO}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            OSDE para tu empresa
          </h1>
          <p className="text-gray-600 max-w-2xl text-base leading-relaxed">
            La red de profesionales más grande de Argentina: más de 140.000 especialistas y 380+ centros de atención en todo el país. La opción más fuerte si tu equipo está repartido en varias provincias.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-white">
        <div className="container max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { v: '140.000+', l: 'Profesionales' },
              { v: '380+', l: 'Centros de atención' },
              { v: '2M+', l: 'Afiliados' },
              { v: '50+', l: 'Años de trayectoria' },
            ].map((s) => (
              <div key={s.l} className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-center">
                <div className="text-xl font-bold text-[#003087]">{s.v}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planes disponibles corporativos */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Los planes que se pueden contratar corporativamente</h2>
          <p className="text-sm text-gray-500 mb-6">Misma línea de planes que la contratación individual, con condiciones negociadas por convenio.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {osde.planes.map((p) => (
              <Link key={p.slug} href={`/prepagas/osde/${p.slug}`} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-200 transition-all group">
                <div>
                  <div className="font-semibold text-gray-900 text-sm group-hover:text-[#003087]">{p.nombre}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{p.copago ? 'Con copago' : 'Sin copago'} · Red {p.redAbierta ? 'abierta' : 'cerrada'}</div>
                </div>
                <span className="text-xs text-gray-400 group-hover:text-[#003087]">Ver detalle →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo se factura */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Cómo se factura</h2>
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              El esquema habitual de OSDE es facturación a la empresa: la factura llega a nombre de la empresa, y si el costo se reparte con el empleado, RRHH gestiona el descuento correspondiente por recibo de sueldo.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Si tu prioridad es que RRHH no tenga que sumar ese trabajo administrativo, Swiss Medical ofrece la modalidad de afinidad, donde la factura llega directo a cada empleado.{' '}
              <Link href="/empresas/swiss-medical" className="text-[#E8002D] font-semibold hover:underline">Ver cómo funciona →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section id="cotizar" className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cotizá OSDE para tu empresa</h2>
            <p className="text-sm text-gray-500">Gratis, sin compromiso. Te contactamos en menos de 24hs hábiles.</p>
          </div>
          <EmpresasForm prepagaContexto="OSDE" />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
          <div className="space-y-2">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-sm text-gray-900 select-none list-none">
                  <h3 className="font-semibold text-sm text-gray-900 m-0">{q}</h3>
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl mx-auto text-center">
          <Link href="/empresas" className="text-sm font-semibold text-[#E8002D] hover:underline">
            ← Ver todas las modalidades para empresas
          </Link>
        </div>
      </section>
    </>
  )
}
