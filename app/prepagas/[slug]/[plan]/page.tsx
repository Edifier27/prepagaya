import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { testimonios } from '@/lib/data/testimonios'
import { formatPrecio, SITE_NAME, SITE_URL } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'
import type { Prepaga } from '@/types'

interface Props {
  params: Promise<{ slug: string; plan: string }>
}

type Plan = Prepaga['planes'][number]

function getPerfilDelPlan(plan: Plan): { titulo: string; desc: string }[] {
  const items: { titulo: string; desc: string }[] = []
  if (!plan.copago) items.push({
    titulo: 'Usuarios frecuentes del sistema de salud',
    desc: 'Sin copago: cuanto más consultás, más te conviene. Especialistas, kinesio, estudios — todo sin ticket adicional.',
  })
  if (plan.copago) items.push({
    titulo: 'Personas jóvenes y en general sanas',
    desc: 'Con copago el costo mensual baja. Ideal si usás el sistema solo para urgencias y controles anuales.',
  })
  if (plan.redAbierta) items.push({
    titulo: 'Quienes eligen libremente su médico',
    desc: 'Red abierta: cualquier profesional de la cartilla, sin derivaciones ni restricción por zona o centro.',
  })
  if (!plan.redAbierta) items.push({
    titulo: 'Quienes se atienden siempre en el mismo centro',
    desc: 'Red cerrada con prestadores de calidad garantizada. Sin pagar de más por amplitud que no vas a usar.',
  })
  const tieneMaternidad = plan.cobertura.some(c => c.toLowerCase().includes('maternidad'))
  if (tieneMaternidad) items.push({
    titulo: 'Parejas con planes de tener hijos',
    desc: 'Maternidad y parto cubiertos. Incluye controles de embarazo, pediatría y primer año del bebé.',
  })
  const tieneSaludMental = plan.cobertura.some(c => c.toLowerCase().includes('psicolog') || c.toLowerCase().includes('salud mental'))
  if (tieneSaludMental) items.push({
    titulo: 'Quienes usan o planean usar salud mental',
    desc: 'Psicología incluida. Sin derivación médica previa para empezar a atenderte.',
  })
  return items.slice(0, 3)
}

function buildPlanFAQs(plan: Plan, prep: Prepaga) {
  return [
    {
      q: `¿Cuánto cuesta el ${plan.nombre} de ${prep.nombre}?`,
      a: `El ${plan.nombre} cuesta ${formatPrecio(plan.precio)}/mes para una persona de 30 años con IVA incluido. El precio final varía según tu edad: a mayor edad, mayor es el costo mensual. Cotizá en PrepagaYa para ver tu precio exacto.`,
    },
    {
      q: `¿El ${plan.nombre} tiene copago en consultas?`,
      a: plan.copago
        ? `Sí, el ${plan.nombre} tiene copago en consultas médicas. Pagás un adicional por cada consulta, lo que baja la cuota mensual. Ideal si no usás el sistema con frecuencia.`
        : `No, el ${plan.nombre} no tiene copago en consultas. Podés ir al médico sin pagar nada extra por cada visita. Conviene si usás el sistema con frecuencia.`,
    },
    {
      q: `¿Qué cubre el ${plan.nombre} de ${prep.nombre}?`,
      a: `El ${plan.nombre} incluye: ${plan.cobertura.join(', ')}. La red es ${plan.redAbierta ? 'abierta (libre elección de prestador)' : 'cerrada (centros propios y convenios específicos)'}.`,
    },
    {
      q: `¿Cómo contratar el ${plan.nombre}?`,
      a: `Cotizá el precio exacto para tu edad usando el comparador gratuito de PrepagaYa. Un asesor te va a contactar para completar el trámite sin costo adicional.`,
    },
  ]
}

export async function generateStaticParams() {
  return prepagas.flatMap((p) =>
    p.planes.map((pl) => ({ slug: p.slug, plan: pl.slug }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, plan: planSlug } = await params
  const prep = prepagas.find((p) => p.slug === slug)
  const plan = prep?.planes.find((pl) => pl.slug === planSlug)
  if (!prep || !plan) return {}
  return {
    title: `${prep.nombre} ${plan.nombre}: Precio, Cobertura y Opiniones — ${PRECIO_ACTUALIZADO} | ${SITE_NAME}`,
    description: `${prep.nombre} ${plan.nombre}: ${formatPrecio(plan.precio)}/mes (persona 30 años · IVA inc.). ${plan.copago ? 'Con copago.' : 'Sin copago.'} Red ${plan.redAbierta ? 'abierta' : 'cerrada'}. ${plan.descripcion}`,
    alternates: { canonical: `${SITE_URL}/prepagas/${slug}/${planSlug}` },
    keywords: [
      `${prep.nombre.toLowerCase()} ${plan.nombre.toLowerCase()}`,
      `${prep.nombre.toLowerCase()} ${plan.nombre.toLowerCase()} precio`,
      `${prep.nombre.toLowerCase()} ${plan.nombre.toLowerCase()} cobertura`,
      `${prep.nombre.toLowerCase()} ${plan.nombre.toLowerCase()} opiniones`,
    ],
  }
}

export default async function PlanPage({ params }: Props) {
  const { slug, plan: planSlug } = await params
  const prep = prepagas.find((p) => p.slug === slug)
  const plan = prep?.planes.find((pl) => pl.slug === planSlug)
  if (!prep || !plan) notFound()

  const planesOrdenados = [...prep.planes].sort((a, b) => a.precio - b.precio)
  const planIdx = planesOrdenados.findIndex(p => p.slug === planSlug)
  const planInferior = planIdx > 0 ? planesOrdenados[planIdx - 1] : null
  const planSuperior = planIdx < planesOrdenados.length - 1 ? planesOrdenados[planIdx + 1] : null
  const otrosPlanes = planesOrdenados.filter(pl => pl.slug !== planSlug)

  const perfilDelPlan = getPerfilDelPlan(plan)
  const faqs = buildPlanFAQs(plan, prep)

  const testisPlan = testimonios
    .filter(t => t.prepagaSlug === prep.slug && t.planNombre?.toLowerCase().includes(plan.nombre.toLowerCase().slice(0, 6)))
    .slice(0, 2)
  const testisFallback = testisPlan.length === 0
    ? testimonios.filter(t => t.prepagaSlug === prep.slug).slice(0, 2)
    : testisPlan

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${prep.nombre} ${plan.nombre}`,
      description: plan.descripcion,
      url: `${SITE_URL}/prepagas/${slug}/${planSlug}`,
      brand: { '@type': 'Brand', name: prep.nombre },
      offers: {
        '@type': 'Offer',
        price: plan.precio,
        priceCurrency: 'ARS',
        availability: 'https://schema.org/InStock',
        priceValidUntil: '2026-09-01',
        seller: { '@type': 'Organization', name: prep.nombre },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: prep.rating,
        reviewCount: prep.cantidadOpiniones,
        bestRating: 5,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Prepagas', item: `${SITE_URL}/prepagas` },
        { '@type': 'ListItem', position: 3, name: prep.nombre, item: `${SITE_URL}/prepagas/${slug}` },
        { '@type': 'ListItem', position: 4, name: plan.nombre },
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-[#E8002D] transition-colors">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <Link href="/prepagas" className="hover:text-[#E8002D] transition-colors">Prepagas</Link>
            <span className="text-gray-300">›</span>
            <Link href={`/prepagas/${slug}`} className="hover:text-[#E8002D] transition-colors">{prep.nombre}</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">{plan.nombre}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-10">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-start gap-4 mb-6">
            <PrepagaLogo
              slug={prep.slug}
              nombre={prep.nombre}
              colorPrimario={prep.colorPrimario}
              size="md"
              className="shadow-sm mt-1"
            />
            <div>
              <Link href={`/prepagas/${slug}`} className="text-sm text-gray-500 hover:text-[#E8002D] transition-colors font-medium">
                {prep.nombre}
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-0.5">{plan.nombre}</h1>
              {plan.destacado && (
                <span className="inline-block mt-2 bg-[#E8002D] text-white text-xs font-black px-3 py-1 rounded-full">
                  MÁS ELEGIDO
                </span>
              )}
            </div>
          </div>

          {/* Price + CTA */}
          <div className="bg-white rounded-2xl border-2 border-[#E8002D] p-6 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-xs text-gray-400 mb-1">Precio base — persona 30 años · con IVA · {PRECIO_ACTUALIZADO}</div>
              <div className="text-4xl font-black text-[#E8002D] tabular-nums">{formatPrecio(plan.precio)}</div>
              <div className="text-sm text-gray-500 mt-0.5">/mes</div>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <Link
                href="/comparador"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-md text-sm"
              >
                Cotizar para mi edad →
              </Link>
              <p className="text-xs text-gray-400 text-center">El precio varía según tu edad</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${
              plan.copago ? 'bg-gray-50 text-gray-600 border-gray-200' : 'bg-green-50 text-green-700 border-green-200'
            }`}>
              {plan.copago ? '— Con copago en consultas' : '✓ Sin copago en consultas'}
            </span>
            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${
              plan.redAbierta ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'
            }`}>
              {plan.redAbierta ? '✓ Red abierta' : '— Red cerrada'}
            </span>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed">{plan.descripcion}</p>
        </div>
      </section>

      {/* Para quién es este plan */}
      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">¿Para quién es el {plan.nombre}?</h2>
          <p className="text-sm text-gray-500 mb-5">Los perfiles que más sacan partido a este plan.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {perfilDelPlan.map((p, i) => (
              <div key={i} className="flex gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-6 h-6 rounded-full bg-[#E8002D] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-white">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-0.5">{p.titulo}</div>
                  <div className="text-xs text-gray-500 leading-relaxed">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coberturas */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">¿Qué incluye el {plan.nombre}?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {plan.cobertura.map((c) => (
              <div key={c} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500 flex-shrink-0">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparar con planes adyacentes */}
      {(planInferior || planSuperior) && (
        <section className="py-10 bg-white border-t border-gray-100">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Comparar con otros planes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {planInferior && (
                <Link
                  href={`/prepagas/${slug}/${planInferior.slug}`}
                  className="group flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Plan anterior</div>
                    <div className="font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors text-sm">{planInferior.nombre}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {planInferior.copago ? 'Con copago' : 'Sin copago'} · Red {planInferior.redAbierta ? 'abierta' : 'cerrada'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-700 text-sm">{formatPrecio(planInferior.precio)}</div>
                    <div className="text-xs text-green-600 font-semibold">
                      -{formatPrecio(plan.precio - planInferior.precio)}/mes
                    </div>
                  </div>
                </Link>
              )}
              {planSuperior && (
                <Link
                  href={`/prepagas/${slug}/${planSuperior.slug}`}
                  className="group flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100 hover:border-red-200 hover:shadow-sm transition-all"
                >
                  <div>
                    <div className="text-xs text-[#E8002D] mb-1 font-medium">Plan superior</div>
                    <div className="font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors text-sm">{planSuperior.nombre}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {planSuperior.copago ? 'Con copago' : 'Sin copago'} · Red {planSuperior.redAbierta ? 'abierta' : 'cerrada'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#E8002D] text-sm">{formatPrecio(planSuperior.precio)}</div>
                    <div className="text-xs text-gray-500">
                      +{formatPrecio(planSuperior.precio - plan.precio)}/mes
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Testimonios */}
      {testisFallback.length > 0 && (
        <section className="py-10 bg-gray-50 border-t border-gray-100">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Opiniones de afiliados de {prep.nombre}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {testisFallback.map(t => (
                <div key={t.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map(i => (
                      <svg key={i} viewBox="0 0 20 20" fill="currentColor"
                        className={`w-3.5 h-3.5 ${i <= t.rating ? 'text-amber-400' : 'text-gray-200'}`}>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">"{t.texto}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-gray-900">{t.nombre}</div>
                      <div className="text-xs text-gray-400">{t.ciudad} · {t.fecha}</div>
                    </div>
                    {t.planNombre && (
                      <span className="text-[10px] bg-gray-50 border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                        {t.planNombre}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Otros planes */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Otros planes de {prep.nombre}</h2>
          <div className="space-y-2">
            {otrosPlanes.map((pl) => (
              <Link
                key={pl.slug}
                href={`/prepagas/${slug}/${pl.slug}`}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all group"
              >
                <div>
                  <div className="font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors text-sm flex items-center gap-2">
                    {pl.nombre}
                    {pl.destacado && (
                      <span className="text-[10px] bg-[#E8002D] text-white px-2 py-0.5 rounded-full font-bold">MÁS ELEGIDO</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {pl.copago ? 'Con copago' : 'Sin copago'} · Red {pl.redAbierta ? 'abierta' : 'cerrada'}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-[#E8002D] text-sm">{formatPrecio(pl.precio)}/mes</div>
                  <div className="text-xs text-gray-400">→</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link href={`/prepagas/${slug}`} className="text-sm text-[#E8002D] font-semibold hover:underline">
              ← Ver página completa de {prep.nombre}
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes sobre el {plan.nombre}</h2>
          <div className="space-y-2">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-sm text-gray-900 select-none list-none">
                  {q}
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

      {/* CTA final */}
      <section className="py-12 bg-[#E8002D] text-white">
        <div className="container max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">¿Querés contratar el {plan.nombre}?</h2>
          <p className="text-red-200 text-sm mb-6">
            El precio real depende de tu edad y zona. Cotizá gratis y recibí asesoramiento sin cargo.
          </p>
          <Link
            href="/comparador"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E8002D] font-bold rounded-2xl hover:bg-red-50 transition-all shadow-lg text-sm"
          >
            Cotizar gratis →
          </Link>
        </div>
      </section>
    </>
  )
}
