import type { Metadata } from 'next'
import Link from 'next/link'
import { aumentos2026, aumentoAcumulado, INFLACION_ACUMULADA_2026 } from '@/lib/data/aumentos'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { formatPrecio, SITE_NAME, SITE_URL } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'

const acumulado = aumentoAcumulado()
const ultimoConfirmado = [...aumentos2026].reverse().find((a) => !a.esProyeccion)!
const proyeccion = aumentos2026.find((a) => a.esProyeccion)

export const metadata: Metadata = {
  title: `Aumentos de Prepagas ${PRECIO_ACTUALIZADO}: cuánto sube cada mes`,
  description: `Aumento de prepagas en ${ultimoConfirmado.label}: ${ultimoConfirmado.porcentaje.toLocaleString('es-AR')}% promedio. Serie mensual 2026, acumulado del ${acumulado.toLocaleString('es-AR')}% y proyección del próximo mes. Actualizado todos los meses.`,
  alternates: { canonical: `${SITE_URL}/aumentos` },
  keywords: [
    'aumento prepagas 2026',
    'aumento prepagas julio 2026',
    'cuanto aumenta la prepaga este mes',
    'aumento prepagas agosto 2026',
    'prepagas aumento mensual',
  ],
}

const faqs = [
  {
    q: `¿Cuánto aumentan las prepagas en ${ultimoConfirmado.label}?`,
    a: `El aumento promedio del mercado en ${ultimoConfirmado.label} fue del ${ultimoConfirmado.porcentaje.toLocaleString('es-AR')}%. ${ultimoConfirmado.nota ?? ''}`,
  },
  {
    q: '¿Cuánto acumulan los aumentos de prepagas en 2026?',
    a: `Los aumentos acumulan ${acumulado.toLocaleString('es-AR')}% en lo que va de 2026, contra una inflación acumulada de aproximadamente ${INFLACION_ACUMULADA_2026}% en el mismo período.`,
  },
  {
    q: '¿Cómo se calculan los aumentos de las prepagas?',
    a: 'Desde la desregulación del sector, las empresas ajustan sus cuotas mensualmente tomando como referencia la inflación con dos meses de rezago: el aumento de julio refleja la inflación de mayo. Cada empresa comunica su porcentaje, que puede variar algunas décimas respecto del promedio.',
  },
  {
    q: '¿Qué puedo hacer si el aumento se me hace impagable?',
    a: 'Tenés cuatro caminos antes de resignar cobertura: derivar tus aportes si estás en relación de dependencia o monotributo (ahorra 30-40%), bajar de plan dentro de tu misma empresa (conservás antigüedad), negociar con el área de retención, o comparar el mercado: el mismo nivel de cobertura tiene precios muy distintos entre empresas.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Aumentos de prepagas 2026: serie mensual y acumulado`,
    description: `Registro mensual de los aumentos de medicina prepaga en Argentina durante 2026, con el acumulado del año y la proyección del próximo mes.`,
    url: `${SITE_URL}/aumentos`,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/aumentos` },
    inLanguage: 'es-AR',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Aumentos de prepagas' },
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

export default function AumentosPage() {
  // Ejemplo de impacto: plan destacado de las 3 prepagas más consultadas
  const ejemplos = ['swiss-medical', 'osde', 'galeno']
    .map((s) => prepagas.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => {
      const plan = p.planes.find((pl) => pl.destacado) ?? [...p.planes].sort((a, b) => a.precio - b.precio)[0]
      const proximoPrecio = proyeccion ? Math.round(plan.precio * (1 + proyeccion.porcentaje / 100)) : null
      return { prep: p, plan, proximoPrecio }
    })

  // Acumulado progresivo para la tabla
  let factorAcumulado = 1

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-[#E8002D] transition-colors">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">Aumentos de prepagas</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-red-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-4xl mx-auto">
          <span className="inline-block text-xs font-semibold text-[#E8002D] bg-red-100 px-3 py-1 rounded-full mb-4">
            Actualizado todos los meses
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Aumentos de prepagas <span className="text-[#E8002D]">2026</span>: cuánto sube cada mes
          </h1>
          <p className="text-gray-600 leading-relaxed max-w-3xl mb-8">
            Seguimos mes a mes los aumentos de las principales prepagas de Argentina: cuánto subieron, cuánto acumulan
            en el año y cuánto se espera para el mes que viene. Si tu cuota subió más que estos promedios, algo hay que revisar.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border-2 border-[#E8002D] p-5 text-center shadow-sm">
              <div className="text-3xl font-black text-[#E8002D]">
                {ultimoConfirmado.porcentaje.toLocaleString('es-AR')}%
              </div>
              <div className="text-xs text-gray-500 mt-1">Aumento {ultimoConfirmado.label}</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center shadow-sm">
              <div className="text-3xl font-black text-gray-900">{acumulado.toLocaleString('es-AR')}%</div>
              <div className="text-xs text-gray-500 mt-1">Acumulado 2026 (vs. {INFLACION_ACUMULADA_2026}% de inflación)</div>
            </div>
            {proyeccion && (
              <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-5 text-center shadow-sm">
                <div className="text-3xl font-black text-gray-400">~{proyeccion.porcentaje.toLocaleString('es-AR')}%</div>
                <div className="text-xs text-gray-500 mt-1">Proyección {proyeccion.label}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tabla mensual */}
      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Aumento mes a mes en 2026</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Mes</th>
                  <th className="text-right p-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Aumento promedio</th>
                  <th className="text-right p-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Acumulado del año</th>
                </tr>
              </thead>
              <tbody>
                {aumentos2026.map((a, i) => {
                  if (!a.esProyeccion) factorAcumulado *= 1 + a.porcentaje / 100
                  const acumuladoFila = Math.round((factorAcumulado - 1) * 1000) / 10
                  return (
                    <tr key={a.mes} className={`${i % 2 === 1 ? 'bg-gray-50/50' : ''} ${a.esProyeccion ? 'text-gray-400' : ''}`}>
                      <td className="p-4 font-medium">
                        {a.label}
                        {a.esProyeccion && (
                          <span className="ml-2 text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                            Proyección
                          </span>
                        )}
                      </td>
                      <td className={`p-4 text-right font-bold tabular-nums ${a.esProyeccion ? 'text-gray-400' : 'text-[#E8002D]'}`}>
                        {a.esProyeccion ? '~' : '+'}{a.porcentaje.toLocaleString('es-AR')}%
                      </td>
                      <td className="p-4 text-right font-semibold tabular-nums text-gray-700">
                        {a.esProyeccion ? '—' : `${acumuladoFila.toLocaleString('es-AR')}%`}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {ultimoConfirmado.nota && (
            <p className="text-xs text-gray-400 mt-3">{ultimoConfirmado.nota}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Promedios del mercado en base a las comunicaciones de aumento de las principales empresas. El porcentaje exacto varía según empresa y plan.
          </p>
        </div>
      </section>

      {/* Impacto en cuotas reales */}
      {proyeccion && (
        <section className="py-10 bg-gray-50 border-t border-gray-100">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Cómo impacta en cuotas reales</h2>
            <p className="text-sm text-gray-500 mb-6">
              Lo que pagarías hoy vs. lo que pagarías con el aumento proyectado de {proyeccion.label} (plan más elegido de cada empresa, 30 años).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ejemplos.map(({ prep, plan, proximoPrecio }) => (
                <Link
                  key={prep.slug}
                  href={`/prepagas/${prep.slug}/${plan.slug}`}
                  className="group bg-white rounded-2xl border border-gray-200 p-5 hover:border-red-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2.5 mb-4">
                    <PrepagaLogo slug={prep.slug} nombre={prep.nombre} colorPrimario={prep.colorPrimario} size="sm" />
                    <div className="min-w-0">
                      <div className="text-xs text-gray-400 leading-none">{prep.nombre}</div>
                      <div className="font-bold text-gray-900 group-hover:text-[#E8002D] transition-colors">{plan.nombre}</div>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wide">{PRECIO_ACTUALIZADO}</div>
                      <div className="text-lg font-black text-gray-900 tabular-nums">{formatPrecio(plan.precio)}</div>
                    </div>
                    <span className="text-gray-300 pb-1">→</span>
                    <div className="text-right">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wide">{proyeccion.label} (est.)</div>
                      <div className="text-lg font-black text-[#E8002D] tabular-nums">{proximoPrecio ? formatPrecio(proximoPrecio) : '—'}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA de urgencia honesta */}
      <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] py-6">
        <div className="container max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 px-4">
          <div>
            <div className="text-white font-bold">
              {proyeccion
                ? `Los precios suben ~${proyeccion.porcentaje.toLocaleString('es-AR')}% en ${proyeccion.label.toLowerCase()}`
                : 'Los precios se ajustan todos los meses'}
            </div>
            <div className="text-red-200 text-xs">Cotizá hoy con los valores de {PRECIO_ACTUALIZADO} y fijá tu precio de ingreso.</div>
          </div>
          <Link
            href="/comparador"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-[#E8002D] font-bold rounded-xl text-sm hover:bg-red-50 transition-colors shadow-sm"
          >
            Comparar precios ahora →
          </Link>
        </div>
      </div>

      {/* Cómo funciona el mecanismo */}
      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Cómo funcionan los aumentos (y cómo anticiparte)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center mb-3 text-sm font-black text-[#E8002D]">1</div>
              <div className="font-semibold text-gray-900 text-sm mb-1">Inflación con rezago</div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Las empresas ajustan siguiendo la inflación de dos meses atrás: el índice de mayo define el aumento de julio. Conociendo la inflación de hoy, ya sabés tu aumento de acá a dos meses.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center mb-3 text-sm font-black text-[#E8002D]">2</div>
              <div className="font-semibold text-gray-900 text-sm mb-1">Aviso previo obligatorio</div>
              <p className="text-xs text-gray-500 leading-relaxed">
                La empresa debe comunicarte el aumento con antelación y aplicarlo de forma general a tu plan. Un aumento no informado o distinto al del resto de tu plan es reclamable.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center mb-3 text-sm font-black text-[#E8002D]">3</div>
              <div className="font-semibold text-gray-900 text-sm mb-1">Tu base importa más que el %</div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Todos aumentan parecido: la diferencia la hace tu base. Derivar aportes, ajustar el plan a tu uso real o cambiar de empresa baja la base sobre la que se aplican los futuros aumentos.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <Link href="/guias/cuota-prepaga-aumento-inflacion" className="text-sm font-bold text-[#E8002D] hover:underline">
              Leer la guía completa: cómo protegerte de los aumentos →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
          <div className="space-y-2">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-sm text-gray-900 select-none list-none">
                  {q}
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

      {/* Links relacionados */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Seguí investigando</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/precios" className="p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all group">
              <div className="font-semibold text-sm text-gray-900 group-hover:text-[#E8002D] transition-colors">Precios de todas las prepagas</div>
              <div className="text-xs text-gray-400 mt-1">Actualizados a {PRECIO_ACTUALIZADO} →</div>
            </Link>
            <Link href="/historial-precios" className="p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all group">
              <div className="font-semibold text-sm text-gray-900 group-hover:text-[#E8002D] transition-colors">Historial de precios</div>
              <div className="text-xs text-gray-400 mt-1">Evolución por empresa y plan →</div>
            </Link>
            <Link href="/guias/prepagas-economicas" className="p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all group">
              <div className="font-semibold text-sm text-gray-900 group-hover:text-[#E8002D] transition-colors">Las prepagas más económicas</div>
              <div className="text-xs text-gray-400 mt-1">Desde $105.000/mes →</div>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
