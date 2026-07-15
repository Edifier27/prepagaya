import type { Metadata } from 'next'
import Link from 'next/link'
import { obrasSociales } from '@/lib/data/obras-sociales'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { ObraSocialIcon } from '@/components/ui/CategoryIcon'

export const metadata: Metadata = {
  title: `Obras Sociales Argentina 2026 — Comparativa y Guías Completas`,
  description: 'Compará las principales obras sociales de Argentina: OSDE, Swiss Medical, Galeno, Medicus, PAMI, IOMA y más. Qué cubren, cómo afiliarse y cuánto cuestan en 2026.',
  alternates: { canonical: `${SITE_URL}/obras-sociales` },
  keywords: ['obras sociales argentina', 'mejores obras sociales 2026', 'comparar obras sociales', 'obra social o prepaga'],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Obras Sociales Argentina 2026',
  numberOfItems: obrasSociales.length,
  itemListElement: obrasSociales.map((os, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: os.nombre,
    url: `${SITE_URL}/obras-sociales/${os.slug}`,
  })),
}

const tiposLabels: Record<string, string> = {
  sindical: 'Sindical / Nacional',
  provincial: 'Provincial',
  estatal: 'Estatal',
  jubilados: 'Para jubilados',
  empresarial: 'Empresarial',
}

const tiposColores: Record<string, string> = {
  sindical: 'bg-blue-100 text-blue-700',
  provincial: 'bg-purple-100 text-purple-700',
  estatal: 'bg-gray-100 text-gray-700',
  jubilados: 'bg-orange-100 text-orange-700',
  empresarial: 'bg-green-100 text-green-700',
}

export default function ObrasSocialesHubPage() {
  const porTipo = {
    jubilados: obrasSociales.filter((os) => os.tipo === 'jubilados'),
    provincial: obrasSociales.filter((os) => os.tipo === 'provincial'),
    empresarial: obrasSociales.filter((os) => os.tipo === 'empresarial'),
    sindical: obrasSociales.filter((os) => os.tipo === 'sindical'),
    estatal: obrasSociales.filter((os) => os.tipo === 'estatal'),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-[#E8002D]">{SITE_NAME}</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Obras Sociales</span>
          </nav>
        </div>
      </div>

      <section className="bg-gradient-to-b from-purple-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-xs font-semibold px-4 py-2 rounded-full mb-4">
            Guía completa de obras sociales en Argentina
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Las mejores obras sociales de Argentina 2026
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Comparativa completa de las principales obras sociales: OSDE, Swiss Medical, Galeno, Medicus, PAMI, IOMA y más. Qué cubren, quiénes pueden afiliarse y cómo derivar tus aportes.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/coberturas" className="text-sm font-medium bg-white border border-gray-200 px-4 py-2 rounded-xl hover:border-blue-300 hover:bg-red-50 transition-all">
              Qué cubren por ley
            </Link>
            <Link href="/guias/obra-social-vs-prepaga" className="text-sm font-medium bg-white border border-gray-200 px-4 py-2 rounded-xl hover:border-blue-300 hover:bg-red-50 transition-all">
              Obra social vs prepaga
            </Link>
            <Link href="/comparador" className="text-sm font-medium bg-[#E8002D] text-white px-4 py-2 rounded-xl hover:bg-[#B8001F] transition-all">
              Comparador personalizado
            </Link>
          </div>
        </div>
      </section>

      {/* Diferencia clave */}
      <section className="py-8 bg-amber-50 border-b border-amber-100">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-start gap-4">
            <svg className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            <div>
              <h2 className="font-bold text-gray-900 mb-1">¿Cuál es la diferencia entre obra social y prepaga?</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                Las <strong>obras sociales</strong> se financian con aportes obligatorios del empleado (3%) y el empleador (6%) del salario. Las <strong>prepagas</strong> son de contratación voluntaria y se pagan directamente. Muchos argentinos tienen las dos: la obra social obligatoria por el trabajo + una prepaga complementaria para ampliar la red.{' '}
                <Link href="/guias/obra-social-vs-prepaga" className="text-[#E8002D] hover:underline font-medium">Ver guía completa →</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container max-w-4xl mx-auto py-12 space-y-12">

        {/* PAMI destacado */}
        {porTipo.jubilados.map((os) => (
          <section key={os.slug}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg font-bold text-gray-900">Para jubilados y pensionados</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tiposColores[os.tipo]}`}>{tiposLabels[os.tipo]}</span>
            </div>
            <Link href={`/obras-sociales/${os.slug}`} className="group block bg-white rounded-2xl border-2 border-orange-200 p-6 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="group"><ObraSocialIcon slug={os.slug} size="lg" /></div>
                <div className="flex-1">
                  <h2 className="font-bold text-xl text-gray-900 group-hover:text-[#E8002D] mb-1">{os.nombre}</h2>
                  <p className="text-gray-500 text-sm mb-3">{os.descripcion}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    {typeof os.beneficiarios === 'number' && <span>+{(os.beneficiarios / 1000000).toFixed(1)}M beneficiarios</span>}
                    <span className="font-medium text-orange-600">Cobertura automática para jubilados ANSES</span>
                  </div>
                </div>
                <span className="text-sm font-medium text-[#E8002D] flex-shrink-0">Ver guía →</span>
              </div>
            </Link>
          </section>
        ))}

        {/* Provinciales */}
        {porTipo.provincial.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg font-bold text-gray-900">Obras sociales provinciales</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {porTipo.provincial.map((os) => (
                <OsCard key={os.slug} os={os} tiposColores={tiposColores} tiposLabels={tiposLabels} />
              ))}
            </div>
          </section>
        )}

        {/* Empresariales (las que compiten con prepagas) */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-gray-900">Obras sociales empresariales (compiten con prepagas)</span>
          </div>
          <p className="text-sm text-gray-500 mb-4">Estas entidades operan tanto como obra social como prepaga privada. Son las más elegidas por la red de prestadores premium.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {porTipo.empresarial.map((os) => (
              <OsCard key={os.slug} os={os} tiposColores={tiposColores} tiposLabels={tiposLabels} />
            ))}
          </div>
        </section>

        {/* Sindicales / para derivación */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-gray-900">Obras sociales sindicales y destinos de derivación</span>
          </div>
          <p className="text-sm text-gray-500 mb-4">Si trabajás en relación de dependencia, podés <strong>derivar tus aportes</strong> a cualquiera de estas obras sociales para mejorar tu cobertura.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...porTipo.sindical, ...porTipo.estatal].map((os) => (
              <OsCard key={os.slug} os={os} tiposColores={tiposColores} tiposLabels={tiposLabels} />
            ))}
          </div>
        </section>

        {/* FAQ general */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes sobre obras sociales</h2>
          <div className="space-y-4">
            {[
              { q: '¿Puedo cambiar de obra social cuando quiero?', a: 'Sí, podés pedir el cambio de obra social en cualquier momento del año. El proceso se realiza online a través del portal de la Superintendencia de Servicios de Salud. El cambio se hace efectivo en un plazo de 30-60 días hábiles.' },
              { q: '¿Qué es la derivación de aportes?', a: 'La derivación es el proceso por el cual un trabajador en relación de dependencia redirige sus aportes obligatorios de salud (3% empleado + 6% empleador) a la obra social que prefiera, en lugar de ir a la obra social sindical de su actividad.' },
              { q: '¿Puedo tener obra social y prepaga al mismo tiempo?', a: 'Sí. Una opción muy común es tener la obra social obligatoria (por el trabajo) y contratar una prepaga complementaria para ampliar la red de prestadores o acceder a sanatorios premium. La prepaga puede descontar los aportes de obra social, reduciendo el costo.' },
              { q: '¿Cuánto se descuenta del sueldo para la obra social?', a: 'El empleado aporta el 3% del sueldo bruto y el empleador el 6%. Es decir, por cada $100 de sueldo, $3 van a la obra social del trabajador y $6 los pone la empresa. Ese dinero financia la cobertura de salud.' },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{f.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] rounded-2xl p-6 text-white text-center">
          <h2 className="font-bold text-xl mb-2">La obra social tiene límites. La prepaga, no.</h2>
          <p className="text-red-100 text-sm mb-5">Miles de argentinos suman una prepaga complementaria para turnos en días, más especialistas y sanatorios de primer nivel. Encontrá el plan ideal para vos.</p>
          <Link href="/comparador" className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#ea6c0b] text-white font-bold rounded-xl transition-colors">
            Comparar planes →
          </Link>
        </div>
      </div>
    </>
  )
}

function OsCard({ os, tiposColores, tiposLabels }: {
  os: { slug: string; nombre: string; emoji: string; tipo: string; descripcion: string; beneficiarios?: number; derivacion: boolean }
  tiposColores: Record<string, string>
  tiposLabels: Record<string, string>
}) {
  return (
    <Link
      href={`/obras-sociales/${os.slug}`}
      className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-red-200 transition-all"
    >
      <div className="flex items-start gap-3">
        <ObraSocialIcon slug={os.slug} size="xs" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h2 className="font-bold text-gray-900 group-hover:text-[#E8002D] transition-colors text-sm">{os.nombre}</h2>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${tiposColores[os.tipo]}`}>
              {tiposLabels[os.tipo]}
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-2">{os.descripcion}</p>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {typeof os.beneficiarios === 'number' && (
              <span>+{os.beneficiarios >= 1000000 ? (os.beneficiarios / 1000000).toFixed(1) + 'M' : (os.beneficiarios / 1000).toFixed(0) + 'k'} afiliados</span>
            )}
            {os.derivacion && <span className="text-green-600 font-medium">✓ Acepta derivación</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}
