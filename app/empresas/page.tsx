import type { Metadata } from 'next'
import Link from 'next/link'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'
import { EmpresasForm } from '@/components/empresas/EmpresasForm'
import { EmpresasComparador } from '@/components/empresas/EmpresasComparador'

export const metadata: Metadata = {
  title: `Prepaga para Empresas y PyMEs: Planes Corporativos — ${PRECIO_ACTUALIZADO}`,
  description: 'Cotizá un plan corporativo de prepaga para tu empresa o pyme. Precio por volumen, sin carencias, deducible de Ganancias. Te asesoramos gratis según tu equipo.',
  alternates: { canonical: `${SITE_URL}/empresas` },
  keywords: [
    'prepaga para empresas', 'plan corporativo prepaga', 'prepaga para pymes',
    'cotizar obra social para empleados', 'swiss medical empresas', 'seguro de salud corporativo argentina',
  ],
}

const swissMedical = prepagas.find((p) => p.slug === 'swiss-medical')!

const faqs = [
  {
    q: '¿Cuántos empleados necesito para acceder a un plan corporativo?',
    a: 'Depende de la prepaga: algunas dan condiciones corporativas desde 2-3 empleados, otras piden 5 o 10 para los mejores descuentos por volumen. Contanos tu caso y te decimos qué opciones aplican.',
  },
  {
    q: '¿El plan corporativo tiene carencias?',
    a: 'Generalmente no para las prestaciones superadoras (las que sí tienen espera en un plan individual, como ortodoncia o cirugía estética): es una de las ventajas de negociar como grupo. Cada convenio es distinto — lo confirmamos en tu cotización.',
  },
  {
    q: '¿Se puede deducir de Ganancias?',
    a: 'Sí, la cobertura médica de los empleados es un gasto deducible para la empresa, y la parte que eventualmente paga cada empleado también entra dentro de los conceptos deducibles de su Ganancias personal, dentro de los límites que fija AFIP.',
  },
  {
    q: '¿Quién recibe la factura, la empresa o cada empleado?',
    a: 'Depende de cómo se arme el convenio. Lo más común es que la factura llegue a la empresa y ella gestione internamente cuánto le corresponde descontar a cada empleado. Con Swiss Medical existe además la modalidad de afinidad: la empresa accede al precio corporativo por volumen, pero la factura llega directo a cada empleado — así RRHH no tiene que gestionar descuentos de recibo de sueldo.',
  },
  {
    q: '¿Qué pasa con la cobertura de un empleado si se va de la empresa?',
    a: 'La Corte Suprema definió en agosto de 2026 que la prepaga no está obligada a mantener las condiciones exactas del plan corporativo, pero el empleado tiene derecho a pasar a un plan de venta pública de la misma prepaga conservando su antigüedad. Si tenía más de 12 meses de antigüedad, no le pueden aplicar carencias nuevas ni cobrarle de más por preexistencias. Lo explicamos en detalle en nuestra guía de prepaga corporativa vs. particular.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Asesoramiento en planes corporativos de medicina prepaga',
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    areaServed: { '@type': 'Country', name: 'Argentina' },
    audience: { '@type': 'BusinessAudience', audienceType: 'PyMEs y empresas' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Empresas' },
    ],
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

export default function EmpresasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-[#E8002D] transition-colors">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">Empresas</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            Para empresas y pymes · {PRECIO_ACTUALIZADO}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Cobertura médica para tu equipo, al precio de una empresa
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base leading-relaxed">
            Un plan corporativo no se cotiza como uno individual: depende de cuántos son y qué edad tienen. Dejanos tus datos y un asesor te arma la propuesta comparada entre las prepagas que mejor encajan con tu equipo.
          </p>
        </div>
      </section>

      {/* Value props */}
      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-1.5 text-sm">Precio por volumen</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Cuantos más empleados sumás de una vez, mejor la condición que negocia la prepaga — suele ser más barato por persona que contratar cada uno por separado.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-1.5 text-sm">Sin carencias en superadoras</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Los convenios corporativos suelen entrar directo, sin las esperas que sí aplican a ortodoncia, cirugía estética o cobertura internacional en un plan individual.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-1.5 text-sm">Deducible de Ganancias</h3>
              <p className="text-sm text-gray-600 leading-relaxed">La cobertura de los empleados es un gasto deducible para la empresa, dentro de los límites que fija AFIP. <Link href="/empresas/beneficios-impositivos" className="text-[#E8002D] font-semibold hover:underline">Ver el detalle →</Link></p>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo se factura */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Cómo se factura: 3 modalidades posibles</h2>
          <p className="text-sm text-gray-500 mb-6">Es de las primeras cosas que RRHH pregunta — y es negociable en el convenio.</p>
          <div className="space-y-3">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-1 text-sm">1. Factura a la empresa</h3>
              <p className="text-sm text-gray-600 leading-relaxed">La factura llega a nombre de la empresa. Si el costo se reparte con el empleado, RRHH gestiona el descuento por recibo de sueldo — puede ser el total, una parte, o solo la cobertura del grupo familiar de cada uno.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-1 text-sm">2. Reparto negociado</h3>
              <p className="text-sm text-gray-600 leading-relaxed">La empresa paga el plan del titular y cada empleado paga aparte si quiere sumar a su grupo familiar, o cualquier otra combinación que se acuerde en el convenio.</p>
            </div>
            <div className="bg-white rounded-2xl border-2 border-red-100 p-5">
              <div className="flex items-center gap-2 mb-1">
                <PrepagaLogo slug="swiss-medical" nombre="Swiss Medical" colorPrimario={swissMedical.colorPrimario} size="xs" />
                <h3 className="font-bold text-gray-900 text-sm">3. Afinidad (exclusivo de Swiss Medical)</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-2">La empresa cierra el convenio y toda la nómina accede al precio corporativo, pero la factura llega directo a cada empleado — nunca a la empresa. Es la opción para cuando RRHH no quiere sumar el trabajo administrativo de gestionar descuentos de sueldo, y sigue siendo la misma condición de precio por volumen.</p>
              <Link href="/empresas/swiss-medical" className="text-xs font-semibold text-[#E8002D] hover:underline">Ver plan corporativo de Swiss Medical →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparador: las 2 prepagas corporativas que manejamos */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Swiss Medical y OSDE, lado a lado</h2>
          <p className="text-sm text-gray-500 mb-6">Las dos prepagas con las que armamos convenios corporativos. Deslizá para ver cada una y compará antes de cotizar.</p>
          <EmpresasComparador />
        </div>
      </section>

      {/* Fallo Corte Suprema */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">¿Qué pasa si en algún momento se termina el convenio?</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              La Corte Suprema resolvió en agosto de 2026 (causa contra Swiss Medical) que la prepaga no está obligada a mantener las condiciones exactas del plan corporativo, pero cada empleado tiene derecho a pasar a un plan de venta pública de la misma prepaga conservando su antigüedad. Con más de 12 meses de antigüedad, no le pueden aplicar carencias nuevas ni cobrarle de más por preexistencias.
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              <Link href="/guias/prepaga-corporativa-vs-particular" className="text-sm font-semibold text-blue-700 hover:underline">
                Ver la guía completa →
              </Link>
              <Link href="/blog/fallo-corte-suprema-plan-corporativo-2026" className="text-sm font-semibold text-blue-700 hover:underline">
                Leer el fallo explicado →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section id="cotizar" className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pedí tu propuesta corporativa</h2>
            <p className="text-sm text-gray-500">Gratis, sin compromiso. Te contactamos en menos de 24hs hábiles.</p>
          </div>
          <EmpresasForm />
        </div>
      </section>

      {/* Cómo sigue el proceso */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Así sigue el proceso</h2>
          <div className="space-y-4">
            {[
              { n: '1', t: 'Nos dejás los datos básicos', d: 'Empresa, cantidad de gente, y si vas a derivar aportes de obra social o contratar particular.' },
              { n: '2', t: 'Un asesor arma la propuesta', d: 'La cotización real de una empresa no es automática como la individual: depende de la composición etaria del equipo. La armamos con las 2-3 prepagas que mejor encajan.' },
              { n: '3', t: 'Te la mandamos comparada', d: 'Con el ahorro estimado si derivás aportes y el detalle de qué carencias no aplican por ser corporativo.' },
            ].map((s) => (
              <div key={s.n} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#E8002D] text-white font-bold text-sm flex items-center justify-center flex-shrink-0">{s.n}</div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm mb-0.5">{s.t}</div>
                  <div className="text-sm text-gray-500">{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
          <div className="space-y-2">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
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
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-5">Más sobre planes corporativos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/empresas/swiss-medical" className="flex flex-col gap-1 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all group">
              <span className="text-sm font-bold text-gray-900 group-hover:text-[#E8002D]">Plan corporativo de Swiss Medical →</span>
              <span className="text-xs text-gray-500">Convenio de afinidad y Plan Black</span>
            </Link>
            <Link href="/empresas/osde" className="flex flex-col gap-1 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all group">
              <span className="text-sm font-bold text-gray-900 group-hover:text-[#E8002D]">Plan corporativo de OSDE →</span>
              <span className="text-xs text-gray-500">La red más grande del país</span>
            </Link>
            <Link href="/empresas/como-cotizar" className="flex flex-col gap-1 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all group">
              <span className="text-sm font-bold text-gray-900 group-hover:text-[#E8002D]">Cómo cotizar un plan corporativo →</span>
              <span className="text-xs text-gray-500">Mínimos, documentación y paso a paso</span>
            </Link>
            <Link href="/empresas/beneficios-impositivos" className="flex flex-col gap-1 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all group">
              <span className="text-sm font-bold text-gray-900 group-hover:text-[#E8002D]">Beneficios impositivos →</span>
              <span className="text-xs text-gray-500">Deducción de Ganancias para empresa y empleado</span>
            </Link>
            <Link href="/guias/prepaga-corporativa-vs-particular" className="flex flex-col gap-1 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all group">
              <span className="text-sm font-bold text-gray-900 group-hover:text-[#E8002D]">Corporativa vs. particular →</span>
              <span className="text-xs text-gray-500">Qué pasa si un empleado se va de la empresa</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
