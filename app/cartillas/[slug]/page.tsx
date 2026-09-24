import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cartillasInfo } from '@/lib/data/cartillas'
import { prepagas, PRECIO_ACTUALIZADO, nivelPrecio } from '@/lib/data/prepagas'
import { sanatorios } from '@/lib/data/sanatorios'
import { SITE_NAME, SITE_URL, formatPrecio } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'
import { NivelPrecioBadge } from '@/components/ui/NivelPrecioBadge'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'
import { BuscadorSanatorio } from '@/components/cartillas/BuscadorSanatorio'
import { BuscadorCartillaZona } from '@/components/cartillas/BuscadorCartillaZona'
import { contactos } from '@/lib/data/contactos'
import { getCartilla, nombreCortoZona, slugPlan, textoFecha, textoFechaConArticulo, zonasPorProvincia } from '@/lib/data/cartilla-zonas'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return cartillasInfo.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const info = cartillasInfo.find((c) => c.slug === slug)
  const prep = prepagas.find((p) => p.slug === slug)
  if (!info || !prep) return {}
  // Search Console (sept 2026): "cartilla osde" (535 impr), "cartilla swiss
  // medical" (80 impr) con 0% CTR. El título promete la lista real. Desde el
  // 23-sep-2026 sin cantidad de profesionales (no tenía fuente: OSDE, por
  // ejemplo, informa 125.000+ prestadores y acá decía +140.000); cuando hay
  // cartilla oficial cargada, se dice que es la oficial por zona y por plan.
  const oficial = getCartilla(slug)
  return {
    title: oficial
      ? `Cartilla ${prep.nombre} 2026: sanatorios y guardias por zona y por plan (oficial)`
      : `Cartilla ${prep.nombre} 2026: sanatorios, guardias y cómo consultarla`,
    description: oficial
      ? `Cartilla de ${prep.nombre} con datos oficiales: qué sanatorios y guardias hay en tu zona y desde qué plan está cada centro. Buscá tu sanatorio, mirá la cartilla de tu plan y cotizá gratis.`
      : `Cartilla de ${prep.nombre}: cómo consultarla online, qué plan necesitás para cada sanatorio y cómo comparar la red antes de contratar. Actualizado ${PRECIO_ACTUALIZADO}.`,
    alternates: { canonical: `${SITE_URL}/cartillas/${slug}` },
    keywords: [
      `cartilla ${prep.nombre.toLowerCase()}`,
      `cartilla medica ${prep.nombre.toLowerCase()}`,
      `${prep.nombre.toLowerCase()} sanatorios`,
      `${prep.nombre.toLowerCase()} prestadores`,
      // Variantes por plan: volumen real relevante en OSDE ("osde cartilla
      // 210" y "osde cartilla 310" suman varios miles de búsquedas/mes,
      // según el export de Ahrefs que pasó Darío el 21-sep-2026) — la
      // página ya cubre el detalle plan por plan más abajo (sanatorios con
      // nota de qué plan los incluye), esto es solo para que el buscador
      // la matchee con esas queries puntuales.
      ...(slug === 'osde' ? ['cartilla osde 210', 'osde cartilla 210', 'cartilla osde 310', 'osde cartilla 310'] : []),
      ...(slug === 'sancor-salud' ? ['sancor cartilla', 'sancor salud cartilla f800'] : []),
    ],
  }
}

export default async function CartillaPrepagaPage({ params }: Props) {
  const { slug } = await params
  const info = cartillasInfo.find((c) => c.slug === slug)
  const prep = prepagas.find((p) => p.slug === slug)
  if (!info || !prep) notFound()
  const cartillaZonas = getCartilla(slug)
  const faqsCartillaZonas: { q: string; a: string }[] = []
  if (cartillaZonas) {
    const [p1, p2] = cartillaZonas.escalera
      .filter((id) => cartillaZonas.planesConPagina.includes(id))
      .map((id) => cartillaZonas.planes.find((p) => p.id === id)!)
    const caba = cartillaZonas.zonas.find((z) => z.slug === 'caba')
    // Sanatorios de CABA que el segundo plan incluye para internación y el primero no
    const suma = caba && p1 && p2
      ? caba.centros.filter((c) => c.internacion.includes(p2.id) && !c.internacion.includes(p1.id)).map((c) => ({ nombre: c.nombre }))
      : []
    if (p1 && p2 && suma.length > 0) {
      faqsCartillaZonas.push({
        q: `¿En qué cambia la cartilla entre el ${p1.label} y el ${p2.label} de ${prep.nombre}?`,
        a: `Según ${textoFechaConArticulo(cartillaZonas)}, en la Ciudad de Buenos Aires el ${p2.label} suma para internación ${suma.length} sanatorio${suma.length === 1 ? '' : 's'} que el ${p1.label} no incluye: ${suma.map((x) => x.nombre).join(', ')}. En cada zona la diferencia es distinta: elegí tu zona en el buscador de arriba para verla.`,
      })
    }
    faqsCartillaZonas.push({
      q: `¿Cómo veo la cartilla de ${prep.nombre} de mi zona?`,
      a: `Elegí tu zona y tu plan en el buscador de esta página: te mostramos los sanatorios para internación y ${cartillaZonas.labelGuardia.toLowerCase()} de ${prep.nombre} con dirección y teléfono. Los datos salen de ${textoFechaConArticulo(cartillaZonas)}.`,
    })
  }

  // Sanatorios destacados cubiertos por esta prepaga, con el plan mínimo que los incluye
  const sanatoriosCubiertos = sanatorios
    .map((s) => {
      const planes = s.planesQueLoCubren.filter((pl) => pl.prepagaSlug === slug)
      if (planes.length === 0) return null
      const planMinimo = [...planes].sort((a, b) => a.precio - b.precio)[0]
      return { sanatorio: s, planMinimo }
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  const planesOrdenados = [...prep.planes].sort((a, b) => a.precio - b.precio)
  const otrasCartillas = cartillasInfo.filter((c) => c.slug !== slug)
  const otrasPrepagas = otrasCartillas
    .map((c) => prepagas.find((p) => p.slug === c.slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  const faqs = [
    {
      q: `¿Cómo consulto la cartilla de ${prep.nombre}?`,
      a: `${info.comoConsultar.join(' ')} También podés verificar la cartilla oficial en ${info.urlCartilla.replace('https://', '')}.`,
    },
    ...(contactos[prep.slug] ? [{
      q: `¿Cuál es el teléfono de ${prep.nombre}?`,
      a: (() => {
        const c = contactos[prep.slug]
        const socios = c.canales.find((x) => x.tipo === 'socios')
        const urg = c.canales.find((x) => x.tipo === 'emergencias')
        return `${socios ? `${socios.etiqueta}: ${socios.valor}.` : ''}${urg ? ` ${urg.etiqueta}: ${urg.valor}.` : ''} Todos los canales, en la ficha de ${prep.nombre}.`.trim()
      })(),
    }] : []),
    {
      q: `¿La cartilla de ${prep.nombre} es igual en todos los planes?`,
      a: `No. Cada plan habilita una porción de la red: los planes de entrada tienen cartilla más acotada y los superiores suman sanatorios de mayor complejidad y reintegros por fuera de cartilla. Antes de contratar, verificá que tu médico o sanatorio esté cubierto por el plan específico que vas a contratar, no por la prepaga en general.`,
    },
    // FAQ con datos de la cartilla oficial por zona (lib/data/cartilla-zonas):
    // qué sanatorios de CABA suma el segundo plan frente al de entrada. Antes
    // había un texto fijo para OSDE ("FLENI solo ambulatorio con el 210", "el
    // resto es igual") que la cartilla PDF oficial vigente al 22/09/2026
    // desmiente — corregido a pedido de Darío.
    ...faqsCartillaZonas,
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `Cartilla ${prep.nombre}: sanatorios, médicos y cómo consultarla`,
      description: `Guía completa de la cartilla médica de ${prep.nombre} en Argentina.`,
      url: `${SITE_URL}/cartillas/${slug}`,
      image: `${SITE_URL}/opengraph-image`,
      author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/cartillas/${slug}` },
      inLanguage: 'es-AR',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Cartillas', item: `${SITE_URL}/cartillas` },
        { '@type': 'ListItem', position: 3, name: `Cartilla ${prep.nombre}` },
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
            <Link href="/cartillas" className="hover:text-[#E8002D] transition-colors">Cartillas</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">{prep.nombre}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <PrepagaLogo slug={prep.slug} nombre={prep.nombre} colorPrimario={prep.colorPrimario} size="lg" className="shadow-sm" />
            <div>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Guía de cartilla · {PRECIO_ACTUALIZADO}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                Cartilla de {prep.nombre}
              </h1>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed max-w-3xl mb-6">
            {getCartilla(slug)
              ? `Esta es la cartilla de ${prep.nombre} armada con sus datos oficiales: qué sanatorios y guardias hay en cada zona y desde qué plan está cada centro.`
              : `Acá te contamos qué incluye la cartilla de ${prep.nombre}, cómo consultarla online y qué plan necesitás para acceder a cada sanatorio.`}
            {contactos[prep.slug] && (
              <> ¿Necesitás llamar? <Link href={`/prepagas/${prep.slug}#telefonos`} className="text-[#E8002D] font-semibold hover:underline">Teléfonos de {prep.nombre}</Link>.</>
            )}
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <ContratarPlanButton
              prepagaNombre={prep.nombre}
              fuente="cartilla-prepaga"
              label={`Cotizar ${prep.nombre}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-md text-sm"
            />
            <Link
              href={`/prepagas/${prep.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-semibold rounded-xl transition-all text-sm"
            >
              Ver planes y precios →
            </Link>
          </div>
          <a
            href={info.urlCartilla}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            ¿Preferís confirmarlo vos mismo? Mirá la cartilla oficial de {prep.nombre} ↗
          </a>
        </div>
      </section>

      {/* Cartilla por zona y plan (OSDE / Premedic / Avalian): sanatorios de
          internación y guardias de la fuente oficial (lib/data/cartilla-zonas),
          con la zona del visitante preseleccionada por geolocalización. Va
          arriba de todo: es lo que busca quien llega por "cartilla <prepaga>". */}
      {cartillaZonas && (
        <section className="py-10 bg-white border-b border-gray-100">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 text-center">
              Cartilla {prep.nombre} por zona y plan: sanatorios y {cartillaZonas.labelGuardia.toLowerCase()}
            </h2>
            <p className="text-sm text-gray-500 mb-6 text-center">
              Elegí tu zona y tu plan y mirá qué sanatorios y {cartillaZonas.labelGuardia.toLowerCase()} tiene {prep.nombre} cerca tuyo. Datos de la {textoFecha(cartillaZonas)}.
            </p>
            <BuscadorCartillaZona
              prepagaSlug={cartillaZonas.prepagaSlug}
              prepagaNombre={cartillaZonas.prepagaNombre}
              grupos={zonasPorProvincia(cartillaZonas.prepagaSlug)}
              planes={cartillaZonas.planes}
              escalera={cartillaZonas.escalera}
              planesConPagina={cartillaZonas.planesConPagina}
              labelGuardia={cartillaZonas.labelGuardia}
              textoFecha={textoFecha(cartillaZonas)}
            />
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {cartillaZonas.planesConPagina.map((id) => {
                const pl = cartillaZonas.planes.find((x) => x.id === id)!
                return (
                  <Link
                    key={id}
                    href={`/cartillas/${slug}/${slugPlan(id)}`}
                    className="text-xs px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-full hover:border-red-200 hover:text-[#E8002D] transition-colors font-semibold"
                  >
                    Cartilla {pl.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Buscador filtrado a esta prepaga */}
      <section className="py-10 bg-gray-50 border-b border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">¿Tu sanatorio está en la cartilla de {prep.nombre}?</h2>
          <p className="text-sm text-gray-500 mb-6 text-center">Buscalo por nombre — te decimos qué plan de {prep.nombre} lo cubre.</p>
          <BuscadorSanatorio soloPrepagaSlug={prep.slug} soloPrepagaNombre={prep.nombre} />
        </div>
      </section>

      {/* Cómo consultar */}
      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Cómo consultar la cartilla paso a paso</h2>
          <div className="space-y-3 mb-6">
            {info.comoConsultar.map((paso, i) => (
              <div key={paso} className="flex items-start gap-3 bg-gray-50 rounded-xl border border-gray-100 p-4">
                <span className="w-6 h-6 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-[11px] font-bold text-[#E8002D] flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-700 leading-relaxed">{paso}</span>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <div className="text-sm font-bold text-amber-800 mb-1">Tip de {SITE_NAME}</div>
                <p className="text-sm text-amber-900 leading-relaxed">{info.tip}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sanatorios cubiertos */}
      {sanatoriosCubiertos.length > 0 && (
        <section className="py-10 bg-gray-50 border-t border-gray-100">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Sanatorios destacados y qué plan los incluye</h2>
            <p className="text-sm text-gray-500 mb-6">
              El acceso a los grandes sanatorios depende del plan. Este es el plan más económico de {prep.nombre} que cubre cada centro.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sanatoriosCubiertos.map(({ sanatorio, planMinimo }) => (
                <Link
                  key={sanatorio.slug}
                  href={`/prepagas/${prep.slug}/${planMinimo.planSlug}`}
                  className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-red-200 hover:shadow-sm transition-all"
                >
                  <div className="font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors text-sm">
                    {sanatorio.nombre}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                    Desde {planMinimo.planNombre} · {formatPrecio(planMinimo.precio)}
                  </div>
                  {planMinimo.nota && (
                    <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1 mt-2 leading-snug">
                      {planMinimo.nota}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Planes */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Planes de {prep.nombre} — {PRECIO_ACTUALIZADO}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {planesOrdenados.map((plan) => (
              <Link
                key={plan.slug}
                href={`/prepagas/${prep.slug}/${plan.slug}`}
                className="group flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 hover:border-red-200 hover:shadow-sm transition-all"
              >
                <div>
                  <div className="font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors text-sm">{plan.nombre}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {plan.copago ? 'Con copago' : 'Sin copago'} · Red {plan.redAbierta ? 'abierta' : 'cerrada'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 text-sm">{formatPrecio(plan.precio)}</div>
                  <NivelPrecioBadge nivel={nivelPrecio(plan.precio)} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mid CTA */}
      <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] py-5">
        <div className="container max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 px-4">
          <div>
            <div className="text-white font-bold text-sm">¿Tu médico o sanatorio no está en esta cartilla?</div>
            <div className="text-red-200 text-xs">Compará qué prepagas lo cubren y cuánto costaría cambiarte.</div>
          </div>
          <Link
            href="/cartillas"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#E8002D] font-bold rounded-xl text-sm hover:bg-red-50 transition-colors shadow-sm"
          >
            Buscar mi sanatorio →
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <section className="py-10 bg-gray-50">
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

      {/* Índice de zonas (links internos a /cartillas/[prepaga]/[zona]) */}
      {cartillaZonas && (
        <section className="py-10 bg-white border-t border-gray-100">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Cartilla {prep.nombre} por zona</h2>
            <div className="space-y-4">
              {zonasPorProvincia(slug).map((g) => (
                <div key={g.provincia}>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">{g.provincia}</h3>
                  <div className="flex flex-wrap gap-2">
                    {g.zonas.map((z) => (
                      <Link
                        key={z.slug}
                        href={`/cartillas/${slug}/${z.slug}`}
                        className="text-xs px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-full hover:border-red-200 hover:text-[#E8002D] transition-colors font-medium"
                      >
                        {nombreCortoZona(z.nombre)}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Otras cartillas */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Cartillas de otras prepagas</h2>
          <div className="flex flex-wrap gap-2">
            {otrasPrepagas.map((p) => (
              <Link
                key={p.slug}
                href={`/cartillas/${p.slug}`}
                className="text-xs px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-full hover:border-red-200 hover:text-[#E8002D] transition-colors font-medium"
              >
                Cartilla {p.nombre} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-12 bg-[#E8002D] text-white">
        <div className="container max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Compará {prep.nombre} con otras prepagas</h2>
          <p className="text-red-200 text-sm mb-6">
            Precios reales de {PRECIO_ACTUALIZADO}, cartillas y coberturas. Gratis, sin DNI y sin compromiso.
          </p>
          <Link
            href="/comparador"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E8002D] font-bold rounded-2xl hover:bg-red-50 transition-all shadow-lg text-sm"
          >
            Comparar prepagas gratis →
          </Link>
        </div>
      </section>
    </>
  )
}
