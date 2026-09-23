import type { Metadata } from 'next'
import Link from 'next/link'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'
import { PedirPropuestaCard } from '@/components/empresas/PedirPropuestaCard'
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

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.08] py-20 sm:py-28">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C7A046 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <div className="container max-w-3xl mx-auto text-center relative">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#C7A046] border border-[#C7A046]/30 rounded-full px-4 py-1.5 mb-7">
            Para empresas y pymes · {PRECIO_ACTUALIZADO}
          </span>
          <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-6 leading-[1.1] tracking-tight">
            Prepaga para empresas y pymes: cobertura médica para tu equipo
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
            Un plan corporativo no se cotiza como uno individual: depende de cuántos son y qué edad tienen. Dejanos tus datos y un asesor te arma la propuesta comparada entre las prepagas que mejor encajan con tu equipo.
          </p>
          <div className="mt-9 flex items-center justify-center gap-4">
            <Link href="#cotizar" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#C7A046] hover:bg-[#DDBB63] text-[#0A0B0D] font-bold rounded-lg text-sm transition-colors">
              Pedir propuesta gratis
            </Link>
            <Link href="#modalidades" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">
              Ver cómo funciona ↓
            </Link>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="py-16 border-b border-white/[0.08]">
        <div className="container max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/[0.08] rounded-2xl overflow-hidden border border-white/[0.08]">
            <div className="bg-[#0A0B0D] p-7">
              <div className="text-[#C7A046] text-2xl font-semibold mb-3 tabular-nums">01</div>
              <h3 className="font-semibold text-white mb-2">Precio por volumen</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Cuantos más empleados sumás de una vez, mejor la condición que negocia la prepaga — suele ser más barato por persona que contratar cada uno por separado.</p>
            </div>
            <div className="bg-[#0A0B0D] p-7">
              <div className="text-[#C7A046] text-2xl font-semibold mb-3 tabular-nums">02</div>
              <h3 className="font-semibold text-white mb-2">Sin carencias en superadoras</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Los convenios corporativos suelen entrar directo, sin las esperas que sí aplican a ortodoncia, cirugía estética o cobertura internacional en un plan individual.</p>
            </div>
            <div className="bg-[#0A0B0D] p-7">
              <div className="text-[#C7A046] text-2xl font-semibold mb-3 tabular-nums">03</div>
              <h3 className="font-semibold text-white mb-2">Deducible de Ganancias</h3>
              <p className="text-sm text-gray-500 leading-relaxed">La cobertura de los empleados es un gasto deducible para la empresa, dentro de los límites que fija AFIP. <Link href="/empresas/beneficios-impositivos" className="text-[#C7A046] font-semibold hover:underline">Ver el detalle →</Link></p>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo se factura */}
      <section id="modalidades" className="py-16 border-b border-white/[0.08]">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-white mb-1.5">Cómo se factura: 3 modalidades posibles</h2>
          <p className="text-sm text-gray-500 mb-8">Es de las primeras cosas que RRHH pregunta — y es negociable en el convenio.</p>
          <div className="space-y-3">
            <div className="bg-white/[0.03] rounded-xl border border-white/[0.08] p-6">
              <h3 className="font-semibold text-white mb-1.5 text-sm">1. Factura a la empresa</h3>
              <p className="text-sm text-gray-500 leading-relaxed">La factura llega a nombre de la empresa. Si el costo se reparte con el empleado, RRHH gestiona el descuento por recibo de sueldo — puede ser el total, una parte, o solo la cobertura del grupo familiar de cada uno.</p>
            </div>
            <div className="bg-white/[0.03] rounded-xl border border-white/[0.08] p-6">
              <h3 className="font-semibold text-white mb-1.5 text-sm">2. Reparto negociado</h3>
              <p className="text-sm text-gray-500 leading-relaxed">La empresa paga el plan del titular y cada empleado paga aparte si quiere sumar a su grupo familiar, o cualquier otra combinación que se acuerde en el convenio.</p>
            </div>
            <div className="bg-white/[0.03] rounded-xl border border-[#C7A046]/30 p-6">
              <div className="flex items-center gap-2.5 mb-1.5">
                <PrepagaLogo slug="swiss-medical" nombre="Swiss Medical" colorPrimario={swissMedical.colorPrimario} size="xs" />
                <h3 className="font-semibold text-white text-sm">3. Afinidad <span className="text-gray-500 font-normal">(exclusivo de Swiss Medical)</span></h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-3">La empresa cierra el convenio y toda la nómina accede al precio corporativo, pero la factura llega directo a cada empleado — nunca a la empresa. Es la opción para cuando RRHH no quiere sumar el trabajo administrativo de gestionar descuentos de sueldo, y sigue siendo la misma condición de precio por volumen.</p>
              <Link href="/empresas/swiss-medical" className="text-xs font-semibold text-[#C7A046] hover:underline">Ver plan corporativo de Swiss Medical →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparador: las 2 prepagas corporativas que manejamos */}
      <section className="py-16 border-b border-white/[0.08]">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-white mb-1.5">Swiss Medical y OSDE, lado a lado</h2>
          <p className="text-sm text-gray-500 mb-8">Las dos prepagas con las que armamos convenios corporativos. Deslizá para ver cada una y compará antes de cotizar.</p>
          <EmpresasComparador />
        </div>
      </section>

      {/* Fallo Corte Suprema */}
      <section className="py-16 border-b border-white/[0.08]">
        <div className="container max-w-3xl mx-auto">
          <div className="bg-white/[0.03] border-l-2 border-[#C7A046] rounded-r-xl p-7">
            <h2 className="text-lg font-semibold text-white mb-2.5">¿Qué pasa si en algún momento se termina el convenio?</h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-3">
              La Corte Suprema resolvió en agosto de 2026 (causa contra Swiss Medical) que la prepaga no está obligada a mantener las condiciones exactas del plan corporativo, pero cada empleado tiene derecho a pasar a un plan de venta pública de la misma prepaga conservando su antigüedad. Con más de 12 meses de antigüedad, no le pueden aplicar carencias nuevas ni cobrarle de más por preexistencias.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-1.5">
              <Link href="/guias/prepaga-corporativa-vs-particular" className="text-sm font-semibold text-[#C7A046] hover:underline">
                Ver la guía completa →
              </Link>
              <Link href="/blog/fallo-corte-suprema-plan-corporativo-2026" className="text-sm font-semibold text-[#C7A046] hover:underline">
                Leer el fallo explicado →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section id="cotizar" className="py-20 border-b border-white/[0.08]">
        <div className="container max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-white mb-2.5">Pedí tu propuesta corporativa</h2>
            <p className="text-sm text-gray-500">Gratis, sin compromiso. Te contactamos en menos de 24hs hábiles.</p>
          </div>
          <PedirPropuestaCard />
        </div>
      </section>

      {/* Cómo sigue el proceso */}
      <section className="py-16 border-b border-white/[0.08]">
        <div className="container max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-white mb-8">Así sigue el proceso</h2>
          <div className="space-y-7">
            {[
              { n: '01', t: 'Nos dejás los datos básicos', d: 'Empresa, cantidad de gente, y si vas a derivar aportes de obra social o contratar particular.' },
              { n: '02', t: 'Un asesor arma la propuesta', d: 'La cotización real de una empresa no es automática como la individual: depende de la composición etaria del equipo. La armamos con las 2-3 prepagas que mejor encajan.' },
              { n: '03', t: 'Te la mandamos comparada', d: 'Con el ahorro estimado si derivás aportes y el detalle de qué carencias no aplican por ser corporativo.' },
            ].map((s, i) => (
              <div key={s.n} className="flex gap-5">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-9 h-9 rounded-full border border-[#C7A046]/40 text-[#C7A046] font-semibold text-xs flex items-center justify-center">{s.n}</div>
                  {i < 2 && <div className="w-px flex-1 bg-white/[0.08] mt-2" />}
                </div>
                <div className="pb-2">
                  <div className="font-semibold text-white text-sm mb-1">{s.t}</div>
                  <div className="text-sm text-gray-500 leading-relaxed">{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-b border-white/[0.08]">
        <div className="container max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-white mb-6">Preguntas frecuentes</h2>
          <div className="space-y-2.5">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group bg-white/[0.03] rounded-xl border border-white/[0.08] overflow-hidden open:border-[#C7A046]/30">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-sm text-white select-none list-none">
                  <h3 className="font-medium text-sm text-white m-0">{q}</h3>
                  <svg className="w-4 h-4 text-gray-500 flex-shrink-0 ml-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed border-t border-white/[0.08] pt-3">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="py-16">
        <div className="container max-w-2xl mx-auto">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">Más sobre planes corporativos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/empresas/ranking" className="flex flex-col gap-1 p-4 bg-white/[0.03] rounded-xl border border-white/[0.08] hover:border-[#C7A046]/40 transition-all group">
              <span className="text-sm font-semibold text-white group-hover:text-[#C7A046]">Ranking de planes corporativos →</span>
              <span className="text-xs text-gray-500">Cómo comparamos Swiss Medical y OSDE</span>
            </Link>
            <Link href="/empresas/swiss-medical" className="flex flex-col gap-1 p-4 bg-white/[0.03] rounded-xl border border-white/[0.08] hover:border-[#C7A046]/40 transition-all group">
              <span className="text-sm font-semibold text-white group-hover:text-[#C7A046]">Plan corporativo de Swiss Medical →</span>
              <span className="text-xs text-gray-500">Convenio de afinidad y Plan Black</span>
            </Link>
            <Link href="/empresas/osde" className="flex flex-col gap-1 p-4 bg-white/[0.03] rounded-xl border border-white/[0.08] hover:border-[#C7A046]/40 transition-all group">
              <span className="text-sm font-semibold text-white group-hover:text-[#C7A046]">Plan corporativo de OSDE →</span>
              <span className="text-xs text-gray-500">La red más grande del país</span>
            </Link>
            <Link href="/empresas/sancor-salud" className="flex flex-col gap-1 p-4 bg-white/[0.03] rounded-xl border border-white/[0.08] hover:border-[#C7A046]/40 transition-all group">
              <span className="text-sm font-semibold text-white group-hover:text-[#C7A046]">Sancor Salud para empresas →</span>
              <span className="text-xs text-gray-500">Plan a medida y club de beneficios</span>
            </Link>
            <Link href="/empresas/avalian" className="flex flex-col gap-1 p-4 bg-white/[0.03] rounded-xl border border-white/[0.08] hover:border-[#C7A046]/40 transition-all group">
              <span className="text-sm font-semibold text-white group-hover:text-[#C7A046]">Avalian para empresas →</span>
              <span className="text-xs text-gray-500">Plan corporativo Superior Plus</span>
            </Link>
            <Link href="/empresas/como-cotizar" className="flex flex-col gap-1 p-4 bg-white/[0.03] rounded-xl border border-white/[0.08] hover:border-[#C7A046]/40 transition-all group">
              <span className="text-sm font-semibold text-white group-hover:text-[#C7A046]">Cómo cotizar un plan corporativo →</span>
              <span className="text-xs text-gray-500">Mínimos, documentación y paso a paso</span>
            </Link>
            <Link href="/empresas/beneficios-impositivos" className="flex flex-col gap-1 p-4 bg-white/[0.03] rounded-xl border border-white/[0.08] hover:border-[#C7A046]/40 transition-all group">
              <span className="text-sm font-semibold text-white group-hover:text-[#C7A046]">Beneficios impositivos →</span>
              <span className="text-xs text-gray-500">Deducción de Ganancias para empresa y empleado</span>
            </Link>
            <Link href="/guias/prepaga-corporativa-vs-particular" className="flex flex-col gap-1 p-4 bg-white/[0.03] rounded-xl border border-white/[0.08] hover:border-[#C7A046]/40 transition-all group">
              <span className="text-sm font-semibold text-white group-hover:text-[#C7A046]">Corporativa vs. particular →</span>
              <span className="text-xs text-gray-500">Qué pasa si un empleado se va de la empresa</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
