import type { Metadata } from 'next'
import Link from 'next/link'
import { aumentos2026, aumentoAcumulado, INFLACION_ACUMULADA_2026, AUMENTOS_OFICIALES, ultimoMesOficial } from '@/lib/data/aumentos'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { formatPrecio, SITE_NAME, SITE_URL, PRECIOS_UPDATE } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'

const acumulado = aumentoAcumulado()
const ultimoConfirmado = [...aumentos2026].reverse().find((a) => !a.esProyeccion)!
const proyeccion = aumentos2026.find((a) => a.esProyeccion)
// Dato oficial del último mes publicado (cuadros tarifarios SSSalud)
const oficial = ultimoMesOficial()
const rankingOficial = oficial ? Object.entries(oficial.prepagas).map(([slug, v]) => ({ slug, ...v })) : []
const masEstable = rankingOficial[0]
// Partners que todavía no declararon el mes (para aclararlo en la tabla)
const sinDeclarar = oficial ? ['swiss-medical', 'premedic', 'avalian', 'sancor-salud', 'osde'].filter((s) => !oficial.prepagas[s]) : []

export const metadata: Metadata = {
  title: oficial
    ? `Aumento de prepagas en ${oficial.label}: cuánto sube cada una (dato oficial)`
    : `Aumentos de Prepagas ${PRECIO_ACTUALIZADO}: cuánto sube cada mes`,
  description: `Aumento de prepagas en ${ultimoConfirmado.label}: ${ultimoConfirmado.porcentaje.toLocaleString('es-AR')}% promedio. Serie mensual 2026, acumulado del ${acumulado.toLocaleString('es-AR')}% y proyección del próximo mes. Actualizado todos los meses.`,
  alternates: { canonical: `${SITE_URL}/aumentos` },
  keywords: [
    'aumento prepagas 2026',
    'aumento prepagas agosto 2026',
    'aumento prepagas septiembre 2026',
    'aumento prepagas octubre 2026',
    'cuanto aumentan las prepagas en octubre',
    'cuanto aumenta la prepaga este mes',
    'que prepaga aumenta menos',
    'ranking prepagas mas estables',
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
  {
    q: '¿Qué prepaga aumenta menos?',
    a: `Según los cuadros tarifarios oficiales de ${oficial?.label ?? ''}, ${masEstable?.nombre} es la que menos aumenta (${masEstable?.mediana.toLocaleString('es-AR')}%). Es una posición relativa estimada, no el número exacto y auditado de cada plan: para el valor real de tu cobertura, la referencia es la cotización actualizada.`,
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: oficial ? `Aumento de prepagas en ${oficial.label}: cuánto sube cada una` : `Aumentos de prepagas 2026: serie mensual y acumulado`,
    description: `Registro mensual de los aumentos de medicina prepaga en Argentina durante 2026, con el acumulado del año y la proyección del próximo mes.`,
    url: `${SITE_URL}/aumentos`,
    image: `${SITE_URL}/opengraph-image`,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/aumentos` },
    dateModified: PRECIOS_UPDATE,
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
    '@type': 'Dataset',
    name: 'Índice de aumentos de medicina prepaga en Argentina',
    description: 'Serie mensual de aumentos porcentuales de las cuotas de medicina prepaga en Argentina, con acumulado anual y comparación contra inflación. Actualización mensual con precios de lista relevados.',
    url: `${SITE_URL}/aumentos`,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    creator: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    temporalCoverage: '2026-01/..',
    spatialCoverage: 'Argentina',
    keywords: ['medicina prepaga', 'aumentos', 'salud privada', 'Argentina'],
    dateModified: PRECIOS_UPDATE,
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

  const medallas = ['🥇', '🥈', '🥉']

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
            {oficial
              ? <>Aumento de prepagas en <span className="text-[#E8002D]">{oficial.label}</span>: cuánto sube cada una</>
              : <>Aumentos de prepagas <span className="text-[#E8002D]">2026</span>: cuánto sube cada mes</>}
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

      {/* Aumento oficial del último mes, prepaga por prepaga (cuadros tarifarios SSSalud) */}
      {oficial && (
        <section id="ranking-estabilidad" className="py-10 bg-white border-b border-gray-100 scroll-mt-20">
          <div className="container max-w-4xl mx-auto">
            <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-3">Dato oficial</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Aumento de {oficial.label} por prepaga</h2>
            <p className="text-gray-600 text-sm leading-relaxed max-w-3xl mb-6">
              Comparamos los cuadros tarifarios que cada prepaga declara ante la{' '}
              <a href={AUMENTOS_OFICIALES.fuenteUrl} target="_blank" rel="noopener noreferrer" className="underline">Superintendencia de Servicios de Salud</a>{' '}
              con los del mes anterior, plan por plan. Promedio: <strong className="text-gray-900">{oficial.promedio.toLocaleString('es-AR')}%</strong>. De la que menos sube a la que más:
            </p>
            <div className="space-y-2">
              {rankingOficial.map((e, i) => {
                const prep = prepagas.find((p) => p.slug === e.slug)
                return (
                  <div key={e.slug} className={`flex items-center justify-between gap-4 p-4 bg-white rounded-2xl border ${i === 0 ? 'border-2 border-emerald-200' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg w-7 text-center flex-shrink-0">{medallas[i] ?? `${i + 1}º`}</span>
                      {prep && <PrepagaLogo slug={prep.slug} nombre={prep.nombre} colorPrimario={prep.colorPrimario} size="sm" />}
                      {prep ? <Link href={`/prepagas/${prep.slug}`} className="font-bold text-gray-900 hover:text-[#E8002D] truncate">{e.nombre}</Link> : <span className="font-bold text-gray-900 truncate">{e.nombre}</span>}
                    </div>
                    <div className="flex items-center gap-6 flex-shrink-0 text-right">
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wide">Aumento</div>
                        <div className={`font-black tabular-nums ${i === 0 ? 'text-emerald-600' : 'text-gray-900'}`}>{e.mediana.toLocaleString('es-AR')}%</div>
                      </div>
                      <div className="hidden sm:block w-28">
                        <div className="text-[10px] text-gray-400 uppercase tracking-wide">Según el plan</div>
                        <div className="text-xs text-gray-600 tabular-nums">{e.minimo === e.maximo ? 'Igual en todos' : `${e.minimo.toLocaleString('es-AR')}% a ${e.maximo.toLocaleString('es-AR')}%`}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-gray-400 mt-4 leading-relaxed">
              {sinDeclarar.length > 0 && <>Todavía no declararon {oficial.label}: {sinDeclarar.map((s) => prepagas.find((p) => p.slug === s)?.nombre ?? s).join(', ')}. Se suman cuando publiquen su cuadro. </>}
              Metodología: {AUMENTOS_OFICIALES.metodo}
            </p>
            <div className="mt-6 bg-gray-50 rounded-2xl border border-gray-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="font-bold text-gray-900 text-sm">¿Tu cuota sube más que el promedio?</div>
                <div className="text-xs text-gray-500">Puede convenirte cambiar de plan o de prepaga. Te lo cotizamos sin cargo.</div>
              </div>
              <Link href="/comparador" className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-[#E8002D] text-white font-bold rounded-xl text-sm hover:bg-[#B8001F] transition-colors">Cotizar ahora →</Link>
            </div>
          </div>
        </section>
      )}

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

      {/* Metodología + cómo citar (informe de referencia para prensa) */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Metodología y uso de estos datos</h2>
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              Este informe se actualiza el primer día hábil de cada mes con los porcentajes de aumento comunicados por
              las principales empresas de medicina prepaga y los precios de lista relevados directamente por el equipo
              de {SITE_NAME} para un adulto de 30 años (IVA incluido). El promedio mensual pondera las empresas de mayor
              cantidad de afiliados. La proyección del mes siguiente se estima con la inflación de dos meses atrás, el
              mecanismo de ajuste que usa el sector desde la desregulación.
            </p>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">¿Sos periodista o investigador?</p>
              <p className="text-sm text-gray-600 leading-relaxed mb-2">
                Estos datos pueden citarse libremente mencionando la fuente. Cita sugerida:
              </p>
              <p className="text-sm bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-700 font-mono">
                Fuente: {SITE_NAME} — Índice de aumentos de medicina prepaga, {PRECIO_ACTUALIZADO}. prepagaya.com.ar/aumentos
              </p>
              <p className="text-xs text-gray-400 mt-3">
                Para acceder a la serie completa por empresa y plan, o coordinar una nota, escribinos a hola@prepagaya.com.ar — respondemos en el día.
              </p>
            </div>
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
            <Link href="/prepagas-economicas" className="p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all group">
              <div className="font-semibold text-sm text-gray-900 group-hover:text-[#E8002D] transition-colors">Las prepagas más económicas</div>
              <div className="text-xs text-gray-400 mt-1">Desde $105.000/mes →</div>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
