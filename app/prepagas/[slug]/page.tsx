import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { testimonios } from '@/lib/data/testimonios'
import { formatPrecio, SITE_NAME, SITE_URL } from '@/lib/utils'
import type { Prepaga } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

type Plan = Prepaga['planes'][number]

function buildFAQs(prep: Prepaga, precioMin: number, precioMax: number, planEstrella: Plan) {
  const sinCopago = prep.planes.filter(p => !p.copago).map(p => p.nombre)
  const conCopago = prep.planes.filter(p => p.copago).map(p => p.nombre)
  return [
    {
      q: `¿Cuánto cuesta ${prep.nombre} en ${PRECIO_ACTUALIZADO}?`,
      a: `Los planes de ${prep.nombre} van desde ${formatPrecio(precioMin)}/mes hasta ${formatPrecio(precioMax)}/mes (precio para persona de 30 años con IVA). El precio varía según edad y zona.`,
    },
    {
      q: `¿Qué plan de ${prep.nombre} conviene más?`,
      a: `El plan más elegido es el ${planEstrella.nombre} (${formatPrecio(planEstrella.precio)}/mes). ${planEstrella.descripcion}`,
    },
    {
      q: `¿${prep.nombre} tiene copago en consultas?`,
      a: sinCopago.length > 0 && conCopago.length > 0
        ? `Depende del plan. Los planes ${sinCopago.join(' y ')} no tienen copago. Los planes ${conCopago.join(' y ')} sí lo tienen.`
        : sinCopago.length === prep.planes.length
          ? `Ninguno de los planes de ${prep.nombre} tiene copago en consultas médicas.`
          : `Todos los planes de ${prep.nombre} tienen copago en consultas.`,
    },
    {
      q: `¿${prep.nombre} tiene cobertura en todo el país?`,
      a: prep.caracteristicas.coberturaNacional
        ? `Sí, ${prep.nombre} tiene cobertura nacional en todo el territorio argentino.`
        : `${prep.nombre} cubre principalmente AMBA y algunas ciudades (${prep.ciudades.slice(0, 3).join(', ')}). La red en el resto del interior es limitada.`,
    },
    {
      q: `¿Cómo contratar ${prep.nombre}?`,
      a: `Podés cotizar el precio exacto para tu edad y zona usando el comparador gratuito de PrepagaYa. Un asesor te contactará para completar el trámite sin costo adicional.`,
    },
  ]
}

function getPerfilesIdeales(prep: Prepaga, precioMin: number): { titulo: string; desc: string }[] {
  const items: { titulo: string; desc: string }[] = []
  if (precioMin < 175000) items.push({
    titulo: 'Quienes buscan el mejor precio del mercado',
    desc: `Desde ${formatPrecio(precioMin)}/mes con cobertura PMO completa. Ideal si necesitás cobertura sin pagar de más.`,
  })
  if (prep.sanatoriosPropios >= 3) items.push({
    titulo: 'Familias que quieren sanatorios propios',
    desc: `${prep.sanatoriosPropios} centros de alta complejidad incluidos. Sin depender de convenios que pueden cambiar.`,
  })
  if (prep.satisfaccion >= 80) items.push({
    titulo: 'Quienes valoran atención sin burocracia',
    desc: `${prep.satisfaccion}% de satisfacción entre afiliados. Autorizaciones ágiles y trámites simples.`,
  })
  if (prep.caracteristicas.coberturaNacional && prep.sanatoriosPropios === 0) items.push({
    titulo: 'Personas en el interior del país',
    desc: 'Red de prestadores en todo el territorio. Una de las mejores opciones fuera de AMBA.',
  })
  if (prep.profesionales >= 100000) items.push({
    titulo: 'Usuarios de muchos especialistas',
    desc: `Más de ${Math.round(prep.profesionales / 1000)}k profesionales en cartilla. Turno para cualquier especialidad en horas.`,
  })
  if (prep.caracteristicas.saludMental && items.length < 3) items.push({
    titulo: 'Quienes priorizan salud mental',
    desc: 'Psicología y psiquiatría cubiertos desde el plan base. Sin restricciones de derivación.',
  })
  if (prep.caracteristicas.maternidad && items.length < 3) items.push({
    titulo: 'Parejas con planes de tener hijos',
    desc: 'Maternidad completa y pediatría incluidos. Cobertura de embarazo, parto y controles del bebé.',
  })
  return items.slice(0, 3)
}

export async function generateStaticParams() {
  return prepagas.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const prep = prepagas.find((p) => p.slug === slug)
  if (!prep) return {}
  const precioMin = Math.min(...prep.planes.map(pl => pl.precio))
  return {
    title: `${prep.nombre}: Precios, Planes y Opiniones — ${PRECIO_ACTUALIZADO} | ${SITE_NAME}`,
    description: `${prep.nombre} ${PRECIO_ACTUALIZADO}: desde ${formatPrecio(precioMin)}/mes. ${prep.satisfaccion}% satisfacción · ${prep.cantidadOpiniones.toLocaleString()} opiniones. Planes, coberturas, pros y contras. Sin registro.`,
    alternates: { canonical: `${SITE_URL}/prepagas/${slug}` },
    keywords: [
      `${prep.nombre.toLowerCase()} precios ${PRECIO_ACTUALIZADO.split(' ')[1]}`,
      `${prep.nombre.toLowerCase()} planes`,
      `${prep.nombre.toLowerCase()} opiniones`,
      `${prep.nombre.toLowerCase()} cobertura`,
      `prepaga ${prep.nombre.toLowerCase()}`,
    ],
  }
}

export default async function PrepagaSlugPage({ params }: Props) {
  const { slug } = await params
  const prep = prepagas.find((p) => p.slug === slug)
  if (!prep) notFound()

  const planesOrdenados = [...prep.planes].sort((a, b) => a.precio - b.precio)
  const precioMin = Math.min(...prep.planes.map(pl => pl.precio))
  const precioMax = Math.max(...prep.planes.map(pl => pl.precio))
  const planEstrella = prep.planes.find(pl => pl.destacado) ?? planesOrdenados[0]
  const otrosPlanes = planesOrdenados.filter(pl => pl.slug !== planEstrella.slug)
  const initials = prep.nombre.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const testisPrepaga = testimonios.filter(t => t.prepagaSlug === prep.slug).slice(0, 2)
  const perfiles = getPerfilesIdeales(prep, precioMin)
  const faqs = buildFAQs(prep, precioMin, precioMax, planEstrella)
  const starsLlenas = Math.round(prep.rating)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${prep.nombre} — Medicina Prepaga Argentina`,
      description: prep.descripcion,
      url: `${SITE_URL}/prepagas/${slug}`,
      brand: { '@type': 'Brand', name: prep.nombre },
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: precioMin,
        highPrice: precioMax,
        priceCurrency: 'ARS',
        offerCount: prep.planes.length,
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
        { '@type': 'ListItem', position: 3, name: prep.nombre },
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

  const StarRow = ({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' }) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor"
          className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${i <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )

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
            <span className="text-gray-700">{prep.nombre}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-10">
        <div className="container max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            {/* Left */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-black flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: prep.colorPrimario }}
                >
                  {initials}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                      {PRECIO_ACTUALIZADO}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      prep.satisfaccion >= 80 ? 'bg-green-100 text-green-700' :
                      prep.satisfaccion >= 75 ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {prep.satisfaccion}% satisfacción
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{prep.nombre}</h1>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <StarRow rating={prep.rating} />
                <span className="text-sm font-semibold text-gray-700">{prep.rating}</span>
                <span className="text-sm text-gray-400">({prep.cantidadOpiniones.toLocaleString()} opiniones)</span>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-5 max-w-xl">{prep.descripcion}</p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/comparador"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
                >
                  Cotizar mi precio exacto →
                </Link>
                <a
                  href={`https://${prep.web}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-semibold rounded-xl transition-all text-sm"
                >
                  Web oficial ↗
                </a>
              </div>
            </div>

            {/* Right: price card */}
            <div className="sm:w-52 flex-shrink-0">
              <div className="bg-white rounded-2xl border-2 border-[#E8002D] p-5 text-center shadow-sm">
                <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-medium">Desde</div>
                <div className="text-3xl font-black text-[#E8002D] tabular-nums">{formatPrecio(precioMin)}</div>
                <div className="text-xs text-gray-400 mt-1">/mes · 30 años · IVA inc.</div>
                <div className="mt-4 pt-3 border-t border-gray-100 space-y-1">
                  <div className="text-xs text-gray-500 font-medium">{prep.planes.length} planes disponibles</div>
                  <div className="text-xs text-gray-400">hasta {formatPrecio(precioMax)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {[
              { label: 'Profesionales', value: prep.profesionales >= 1000 ? `${(prep.profesionales / 1000).toFixed(0)}k+` : `${prep.profesionales}+` },
              { label: 'Centros propios', value: prep.sanatoriosPropios > 0 ? String(prep.sanatoriosPropios) : 'Red convenio' },
              { label: 'Satisfacción', value: `${prep.satisfaccion}%` },
              { label: 'Opiniones', value: prep.cantidadOpiniones.toLocaleString() },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
                <div className="text-lg font-bold text-[#E8002D]">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planes */}
      <section className="py-10 bg-white">
        <div className="container max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">Planes de {prep.nombre} — {PRECIO_ACTUALIZADO}</h2>
            <span className="text-xs text-gray-400 hidden sm:block">Precio base · 30 años · IVA inc.</span>
          </div>

          {/* Plan destacado — más grande */}
          <Link
            href={`/prepagas/${slug}/${planEstrella.slug}`}
            className="relative block bg-gradient-to-r from-[#fff5f5] to-white border-2 border-[#E8002D] rounded-2xl p-6 mb-4 hover:shadow-lg transition-all group"
          >
            <div className="absolute -top-3.5 left-6">
              <span className="bg-[#E8002D] text-white text-[11px] font-black px-4 py-1.5 rounded-full shadow-sm tracking-wide">
                MÁS ELEGIDO
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-1">
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 text-lg group-hover:text-[#E8002D] transition-colors">{planEstrella.nombre}</div>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{planEstrella.descripcion}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${
                    planEstrella.copago ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {planEstrella.copago ? 'Con copago' : 'Sin copago'}
                  </span>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${
                    planEstrella.redAbierta ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-500'
                  }`}>
                    Red {planEstrella.redAbierta ? 'abierta' : 'cerrada'}
                  </span>
                  {planEstrella.cobertura.slice(0, 3).map(c => (
                    <span key={c} className="text-[11px] px-2 py-1 bg-gray-50 text-gray-500 rounded-full border border-gray-100">{c}</span>
                  ))}
                  {planEstrella.cobertura.length > 3 && (
                    <span className="text-[11px] text-gray-400 py-1">+{planEstrella.cobertura.length - 3} más</span>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 sm:text-right">
                <div className="text-3xl font-black text-[#E8002D] tabular-nums">{formatPrecio(planEstrella.precio)}</div>
                <div className="text-xs text-gray-400">/mes</div>
                <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#E8002D] text-white rounded-xl text-xs font-bold group-hover:bg-[#B8001F] transition-colors">
                  Ver cobertura completa →
                </div>
              </div>
            </div>
          </Link>

          {/* Otros planes */}
          {otrosPlanes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {otrosPlanes.map((plan) => (
                <Link
                  key={plan.slug}
                  href={`/prepagas/${slug}/${plan.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-red-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors text-sm">{plan.nombre}</div>
                      <div className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">{plan.descripcion}</div>
                      <div className="flex gap-1.5 mt-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          plan.copago ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-green-700'
                        }`}>
                          {plan.copago ? 'Con copago' : 'Sin copago'}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          plan.redAbierta ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          Red {plan.redAbierta ? 'abierta' : 'cerrada'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="font-black text-[#E8002D] text-lg tabular-nums">{formatPrecio(plan.precio)}</div>
                      <div className="text-xs text-gray-400">/mes</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-400 mt-4">
            * Precios para persona de 30 años · contratación directa · IVA incluido · {PRECIO_ACTUALIZADO}. El precio varía según tu edad.
          </p>
        </div>
      </section>

      {/* Para quién es ideal */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">¿Para quién es ideal {prep.nombre}?</h2>
          <p className="text-sm text-gray-500 mb-6">Los perfiles que más se benefician de esta prepaga.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {perfiles.map((perfil, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center mb-3">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#E8002D]">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{perfil.titulo}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{perfil.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-page CTA */}
      <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] py-5">
        <div className="container max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 px-4">
          <div>
            <div className="text-white font-bold text-sm">¿Cuánto te costaría {prep.nombre} a tu edad?</div>
            <div className="text-red-200 text-xs">El precio varía con la edad. Cotizá gratis en 2 minutos.</div>
          </div>
          <Link
            href="/comparador"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#E8002D] font-bold rounded-xl text-sm hover:bg-red-50 transition-colors shadow-sm"
          >
            Cotizar mi precio →
          </Link>
        </div>
      </div>

      {/* Testimonios */}
      {testisPrepaga.length > 0 && (
        <section className="py-10 bg-white border-t border-gray-100">
          <div className="container max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Opiniones de afiliados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {testisPrepaga.map(t => (
                <div key={t.id} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
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
                      <span className="text-[10px] bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
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

      {/* Pros y Contras */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{prep.nombre}: pros y contras</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-green-100 p-6">
              <h3 className="font-bold text-green-700 mb-4 flex items-center gap-2 text-sm">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Ventajas
              </h3>
              <ul className="space-y-2.5">
                {prep.pros.map((pro) => (
                  <li key={pro} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-red-100 p-6">
              <h3 className="font-bold text-red-700 mb-4 flex items-center gap-2 text-sm">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-400">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Desventajas
              </h3>
              <ul className="space-y-2.5">
                {prep.contras.map((contra) => (
                  <li key={contra} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {contra}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Coberturas incluidas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {([
              { key: 'appMovil', label: 'App móvil' },
              { key: 'atencion24hs', label: 'Atención 24hs' },
              { key: 'coberturaNacional', label: 'Cobertura nacional' },
              { key: 'odontologia', label: 'Odontología' },
              { key: 'saludMental', label: 'Salud mental' },
              { key: 'maternidad', label: 'Maternidad' },
              { key: 'optica', label: 'Óptica' },
              { key: 'farmacia', label: 'Farmacia' },
            ] as { key: keyof typeof prep.caracteristicas; label: string }[]).map(({ key, label }) => {
              const ok = prep.caracteristicas[key]
              return (
                <div key={key} className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium ${
                  ok ? 'bg-green-50 border-green-100 text-green-800' : 'bg-gray-50 border-gray-100 text-gray-400'
                }`}>
                  <svg viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 flex-shrink-0 ${ok ? 'text-green-500' : 'text-gray-300'}`}>
                    {ok
                      ? <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      : <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    }
                  </svg>
                  {label}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes sobre {prep.nombre}</h2>
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
          <h2 className="text-2xl font-bold mb-2">Cotizá {prep.nombre} para tu perfil</h2>
          <p className="text-red-200 text-sm mb-6">
            El precio cambia según tu edad y zona. Usá el cotizador para ver el precio exacto y comparar con otras prepagas.
          </p>
          <Link
            href="/comparador"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E8002D] font-bold rounded-2xl hover:bg-red-50 transition-all shadow-lg text-sm"
          >
            Cotizar gratis →
          </Link>
          {prep.telefono && (
            <div className="mt-5 text-red-200 text-xs">
              O llamá directo:{' '}
              <a href={`tel:${prep.telefono.replace(/\D/g, '')}`} className="text-white font-semibold underline">
                {prep.telefono}
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
