import type { Metadata } from 'next'
import Link from 'next/link'
import { COSEGUROS_OS } from '@/lib/data/coseguros-os'
import { osDeCartilla } from '@/lib/data/sindicales-cartillas/os'
import { PasateConTusAportes } from '@/components/obras-sociales/PasateConTusAportes'
import { SITE_NAME, SITE_URL, OG_IMAGE } from '@/lib/utils'

// "coseguro obra social", "obra social sin coseguro", "cuánto cobra X de
// coseguro" (keyword research, 1-oct-2026). Desde la Res. SSSalud 1926/2024
// cada obra social fija sus coseguros: acá están los que publican, con fuente
// y vigencia (lib/data/coseguros-os.ts), y la salida: un plan sin copagos
// pagado con los aportes.

const filas = Object.entries(COSEGUROS_OS)
  .map(([slug, c]) => {
    const os = osDeCartilla(slug)
    const valor = (re: RegExp) => c.items.find((i) => re.test(i.concepto))?.valor
    return {
      slug,
      nombre: os?.nombre ?? slug.toUpperCase(),
      consulta: valor(/especialista/i) ?? valor(/consulta/i),
      domicilio: valor(/noche/i) ?? valor(/domicilio/i),
      c,
    }
  })
  .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

const pesos = (v?: string) => Number((v ?? '').replace(/\D/g, '')) || 0
const maxValor = (k: 'consulta' | 'domicilio') => filas.map((f) => f[k]).filter(Boolean).sort((a, b) => pesos(b) - pesos(a))[0]
const minValor = (k: 'consulta' | 'domicilio') => filas.map((f) => f[k]).filter(Boolean).sort((a, b) => pesos(a) - pesos(b))[0]

const TITULO = 'Coseguros de obras sociales 2026: cuánto cobra cada una'

export const metadata: Metadata = {
  title: TITULO,
  description: `Cuánto cobran de coseguro ${filas.length} obras sociales por una consulta y una visita a domicilio, con sus valores oficiales. Qué prestaciones no pagan coseguro y cómo tener un plan sin copagos con tus aportes.`,
  alternates: { canonical: `${SITE_URL}/obras-sociales/coseguros` },
  keywords: ['coseguro obra social', 'coseguros obras sociales 2026', 'obra social sin coseguro', 'obras sociales sin coseguro', 'que significa obra social con coseguro', 'resolucion 1926/2024 coseguros'],
  openGraph: { title: TITULO, description: 'Coseguros oficiales de cada obra social, comparados.', type: 'article', images: [OG_IMAGE] },
}

const EXENTOS = [
  'Emergencias (código rojo)',
  'Plan materno infantil: embarazo, parto y el bebé hasta el año',
  'Oncología',
  'Discapacidad',
  'Programa de VIH',
  'Programas preventivos (por ejemplo, cáncer de mama y de cuello uterino)',
]

const faq = [
  {
    q: '¿Qué es el coseguro de una obra social?',
    a: 'Es un monto fijo que pagás cada vez que usás una prestación: una consulta, una visita médica a domicilio, un estudio o una sesión de kinesiología. Se suma a tus aportes mensuales.',
  },
  {
    q: '¿Quién decide cuánto se paga de coseguro?',
    a: 'Cada obra social. Desde la Resolución 1926/2024, la Superintendencia de Servicios de Salud ya no fija un tope: cada entidad define sus valores y tiene que avisarlos a sus afiliados con 30 días de anticipación.',
  },
  {
    q: '¿Hay obras sociales sin coseguro?',
    a: 'Entre las obras sociales que publican sus valores, todas cobran coseguro por consultas y la mayoría también por las visitas a domicilio. Lo que sí existe son planes de prepaga sin copagos, que podés pagar con tus mismos aportes haciendo la opción de cambio.',
  },
  {
    q: '¿Qué prestaciones no pagan coseguro?',
    a: `Según las tablas oficiales que publican las obras sociales: ${EXENTOS.join('; ').toLowerCase()}.`,
  },
  {
    q: '¿Cuánto cuesta una consulta en una obra social?',
    a: `Depende de la obra social. Entre las que relevamos, la consulta con especialista va de ${minValor('consulta')} a ${maxValor('consulta')} de coseguro, y la visita médica a domicilio llega a ${maxValor('domicilio')}.`,
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: TITULO,
    url: `${SITE_URL}/obras-sociales/coseguros`,
    inLanguage: 'es-AR',
    dateModified: '2026-10-01',
    isBasedOn: filas.map((f) => f.c.fuente),
    publisher: { '@id': `${SITE_URL}/#organization` },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Obras Sociales', item: `${SITE_URL}/obras-sociales` },
      { '@type': 'ListItem', position: 3, name: 'Coseguros' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
]

export default function CosegurosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-[#E8002D]">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <Link href="/obras-sociales" className="hover:text-[#E8002D]">Obras Sociales</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">Coseguros</span>
          </nav>
        </div>
      </div>

      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-10">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">{TITULO}</h1>
          <p className="text-gray-700 leading-relaxed mt-4 max-w-3xl">
            <strong>Respuesta corta:</strong> además de tus aportes, casi todas las obras sociales te cobran un coseguro cada vez que
            las usás. Desde la Resolución 1926/2024 cada una fija sus valores. Entre las que publican su tabla, una consulta con
            especialista cuesta hasta {maxValor('consulta')} y una visita médica a domicilio, hasta {maxValor('domicilio')}.
          </p>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cuánto cobra cada obra social</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 font-semibold">Obra social</th>
                  <th className="px-4 py-3 font-semibold text-right">Consulta</th>
                  <th className="px-4 py-3 font-semibold text-right">Visita a domicilio</th>
                  <th className="px-4 py-3 font-semibold">Vigencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filas.map((f) => (
                  <tr key={f.slug}>
                    <td className="px-4 py-2.5">
                      <Link href={`/obras-sociales/${f.slug}#pasarte`} className="font-semibold text-gray-900 hover:text-[#E8002D]">{f.nombre}</Link>
                      {f.c.plan && <span className="text-xs text-gray-500"> · plan {f.c.plan}</span>}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{f.consulta ?? '—'}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{f.domicilio ?? '—'}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-500">
                      <a href={f.c.fuente} target="_blank" rel="noopener noreferrer" className="underline">{f.c.vigencia}</a>
                    </td>
                  </tr>
                ))}
                <tr className="bg-red-50/60">
                  <td className="px-4 py-2.5 font-semibold text-gray-900">Swiss Medical SMG20 (prepaga, con tus aportes)</td>
                  <td className="px-4 py-2.5 text-right font-bold text-[#B8001F]">Sin cargo</td>
                  <td className="px-4 py-2.5 text-right font-bold text-[#B8001F]">Sin cargo</td>
                  <td className="px-4 py-2.5 text-xs text-gray-500">Folleto oficial 09/2026</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Consulta: con especialista cuando la obra social distingue. Domicilio: la visita nocturna cuando distingue entre día y noche.
            Cada valor sale de la publicación oficial de la obra social (enlace en la vigencia). “—”: no lo publica.
          </p>
        </div>
      </section>

      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Qué prestaciones no pagan coseguro</h2>
            <p className="text-sm text-gray-700 mb-2">Según las tablas oficiales que publican las obras sociales:</p>
            <ul className="text-sm text-gray-700 space-y-1.5">
              {EXENTOS.map((x) => <li key={x}>✓ {x}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">¿Hay obras sociales sin coseguro?</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Entre las que publican sus valores, no: todas cobran por las consultas y la mayoría también por las visitas a domicilio.
              Y pueden actualizarlos cuando quieran, avisando con 30 días.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mt-2">
              Lo que sí existe son <strong>planes de prepaga sin copagos</strong>, y los podés pagar con tus mismos aportes.{' '}
              <a href="#pasarte" className="text-[#E8002D] font-semibold hover:underline">Ver cómo →</a>
            </p>
          </div>
        </div>
      </section>

      <PasateConTusAportes osNombre="tu obra social" osSlug="" fuente="coseguros-obras-sociales" titulo="Con tus mismos aportes podés tener Swiss Medical, sin copagos" />

      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faq.map((x) => (
              <div key={x.q}>
                <h3 className="font-semibold text-gray-900">{x.q}</h3>
                <p className="text-sm text-gray-700 leading-relaxed mt-1">{x.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
