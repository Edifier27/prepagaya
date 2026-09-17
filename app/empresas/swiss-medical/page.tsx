import type { Metadata } from 'next'
import Link from 'next/link'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'
import { EmpresasForm } from '@/components/empresas/EmpresasForm'

export const metadata: Metadata = {
  title: `Swiss Medical para Empresas: Plan Corporativo y Convenio de Afinidad`,
  description: 'Plan corporativo de Swiss Medical para tu empresa: convenio de afinidad, facturación individual sin trabajo administrativo para RRHH, 8 sanatorios propios. Cotizá gratis.',
  alternates: { canonical: `${SITE_URL}/empresas/swiss-medical` },
  keywords: [
    'swiss medical empresas', 'swiss medical plan corporativo', 'swiss medical convenio afinidad',
    'swiss medical pymes', 'cotizar swiss medical empresa',
  ],
}

const swissMedical = prepagas.find((p) => p.slug === 'swiss-medical')!

const faqs = [
  {
    q: '¿Qué es el convenio de afinidad de Swiss Medical?',
    a: 'Es una modalidad donde la empresa cierra el convenio y toda la nómina accede al precio corporativo por volumen, pero la factura llega directo a cada empleado — nunca a la empresa. Resuelve el problema más común de RRHH: no tener que gestionar descuentos de recibo de sueldo ni recibir una factura a nombre de la empresa.',
  },
  {
    q: '¿Cuántos empleados necesito para un convenio con Swiss Medical?',
    a: 'El mínimo varía según el convenio y ha bajado con el tiempo: se conocen acuerdos de cámaras de comercio con Swiss Medical trabajando desde 10 empleados (20 cápitas contando grupo familiar). El mínimo exacto vigente para tu caso te lo confirma tu asesor en la cotización.',
  },
  {
    q: '¿Qué es el Plan Black?',
    a: 'Es la línea corporativa premium de Swiss Medical: máxima cobertura con atención preferencial y exclusiva. Incluye línea dedicada 24hs con ejecutivo de cuenta, 80% de descuento en farmacias, reintegros en todas las especialidades y acceso a la red Blue Cross & Blue Shield en Estados Unidos.',
  },
  {
    q: '¿Por qué Swiss Medical para mi empresa y no otra prepaga?',
    a: 'Swiss Medical tiene 8 sanatorios propios y más de 81.500 profesionales, con la cartilla premium más amplia del mercado según satisfacción de afiliados (76%). Para una empresa, eso significa menos derivaciones y mejor experiencia para el equipo — y es la prepaga con la que tenemos mayor poder de negociación para armar convenios a medida.',
  },
  {
    q: '¿Qué documentación pide Swiss Medical para dar de alta el convenio corporativo?',
    a: 'El formulario de Ingresos Brutos, el estatuto de la empresa, el último formulario 931 de AFIP con el comprobante de pago, y una nómina con los datos básicos de cada empleado (nombre, apellido, edad y sueldo bruto). Con eso se arma la propuesta a medida.',
  },
]

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
      { '@type': 'ListItem', position: 3, name: 'Swiss Medical' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
]

export default function EmpresasSwissMedicalPage() {
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
            <span className="text-gray-700">Swiss Medical</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <PrepagaLogo slug="swiss-medical" nombre="Swiss Medical" colorPrimario={swissMedical.colorPrimario} size="md" />
            <div>
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">
                Plan corporativo · {PRECIO_ACTUALIZADO}
              </span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Swiss Medical para tu empresa
          </h1>
          <p className="text-gray-600 max-w-2xl text-base leading-relaxed">
            La prepaga con más sanatorios propios del país, con la modalidad que resuelve el problema #1 de RRHH: el convenio de afinidad, donde la factura llega directo a cada empleado y no a la empresa.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-white">
        <div className="container max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { v: '8', l: 'Sanatorios propios' },
              { v: '81.500+', l: 'Profesionales' },
              { v: '76%', l: 'Satisfacción de afiliados' },
              { v: '13', l: 'Centros ambulatorios propios' },
            ].map((s) => (
              <div key={s.l} className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-center">
                <div className="text-xl font-bold text-[#E8002D]">{s.v}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Convenio de afinidad */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">El convenio de afinidad</h2>
          <p className="text-sm text-gray-500 mb-6">La modalidad diferencial de Swiss Medical para pymes que no quieren sumar trabajo administrativo.</p>
          <div className="bg-white rounded-2xl border-2 border-red-100 p-6">
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              La empresa cierra el convenio y toda la nómina accede al precio corporativo por volumen — pero la factura <strong>nunca llega a la empresa</strong>: va directo a cada empleado. RRHH no gestiona descuentos de recibo de sueldo ni recibe una factura a nombre de la empresa, y el equipo igual accede al precio de grupo.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              El mínimo de gente para arrancar un convenio varía y en general es bajo: se conocen acuerdos de cámaras de comercio trabajando desde 10 empleados (20 cápitas contando grupo familiar). Confirmamos el mínimo vigente para tu caso en la cotización.
            </p>
          </div>
        </div>
      </section>

      {/* Plan Black */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Plan Black: la línea corporativa premium</h2>
          <p className="text-sm text-gray-500 mb-6">Para equipos gerenciales o empresas que buscan el techo de la cobertura privada en Argentina.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Línea dedicada 24hs con ejecutivo de cuenta',
              '80% de descuento en farmacias',
              'Reintegros en todas las especialidades',
              'Acceso a la red Blue Cross & Blue Shield en Estados Unidos',
              'Chequeo médico anual',
              'Cobertura médica internacional',
            ].map((b) => (
              <div key={b} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500 flex-shrink-0">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estructura propia: por qué se nota en el día a día */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Estructura propia: por qué se nota en el día a día</h2>
          <p className="text-sm text-gray-500 mb-6">No es solo tener sanatorios: es no depender de terceros para lo que más se usa.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">Swiss Medical Centers exclusivos</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Los Swiss Medical Center en Capital y Gran Buenos Aires atienden solo a socios de Swiss Medical, no a afiliados de otras prepagas. En temporada alta de demanda (por ejemplo la gripe en invierno, cuando los sanatorios de red compartida se saturan), eso se traduce en turnos más rápidos para tu equipo.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">Avión sanitario propio</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Cobertura en todo el país con infraestructura propia, incluyendo traslados de alta complejidad. Relevante para empresas con personal viajando o trabajando fuera de AMBA.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">Médico online propio</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                El servicio de consulta médica online es de Swiss Medical, no un partner tercerizado — mismo estándar de calidad que la atención presencial, disponible para consultas rápidas del equipo.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">Ambulancias propias</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                El servicio de emergencias también es propio de Swiss Medical, no un convenio con un tercero — coordinación directa con la red de sanatorios propios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section id="cotizar" className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cotizá Swiss Medical para tu empresa</h2>
            <p className="text-sm text-gray-500">Gratis, sin compromiso. Te contactamos en menos de 24hs hábiles.</p>
          </div>
          <EmpresasForm prepagaContexto="Swiss Medical" />
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

      {/* Cross-links */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/empresas" className="flex flex-col gap-1 p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 transition-all group">
              <span className="text-sm font-bold text-gray-900 group-hover:text-[#E8002D]">← Volver a Empresas</span>
              <span className="text-xs text-gray-500">Otras modalidades y prepagas</span>
            </Link>
            <Link href="/prepagas/swiss-medical" className="flex flex-col gap-1 p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 transition-all group">
              <span className="text-sm font-bold text-gray-900 group-hover:text-[#E8002D]">Planes individuales de Swiss Medical →</span>
              <span className="text-xs text-gray-500">Precios, cartilla y planes particulares</span>
            </Link>
            <Link href="/guias/prepaga-corporativa-vs-particular" className="flex flex-col gap-1 p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 transition-all group">
              <span className="text-sm font-bold text-gray-900 group-hover:text-[#E8002D]">Corporativa vs. particular →</span>
              <span className="text-xs text-gray-500">Qué pasa si un empleado deja la empresa</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ¿Ya tenés OSDE corporativo? */}
      <section className="py-10 bg-gray-900 border-t border-gray-100">
        <div className="container max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">¿Tu empresa ya paga OSDE corporativo?</h2>
            <p className="text-sm text-gray-300">Comparamos tu convenio actual con un plan equivalente de Swiss Medical — la cuota suele bajar bastante.</p>
          </div>
          <Link href="/empresas/swiss-medical/vs-osde" className="flex-shrink-0 px-6 py-3 bg-white text-gray-900 font-bold rounded-xl text-sm hover:bg-gray-100 transition-colors whitespace-nowrap">
            Ver comparativo →
          </Link>
        </div>
      </section>
    </>
  )
}
