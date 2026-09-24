import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prepagas, PRECIO_ACTUALIZADO, PRECIOS_FUENTE_URL, nivelPrecio } from '@/lib/data/prepagas'
import { getProvinciaSEO, provinciasSEO } from '@/lib/data/zonas'
import { getCambiosPorOrigen, getCambiosPorDestino } from '@/lib/data/cambios'
import { getComparativasByPrepaga } from '@/lib/data/comparativas'
import { obrasSociales } from '@/lib/data/obras-sociales'
import { ordenarPorCartilla, getGrupoCartilla } from '@/lib/data/cartilla-grupos'
import { getCartillaInfo } from '@/lib/data/cartillas'
import { coberturasMarca } from '@/lib/data/coberturas-marca'
import { NIVEL_PRECIO_LABEL, SITE_NAME, SITE_URL, formatPrecio, calidadPlan, PRECIO_VALIDO_HASTA, PARTNERS_OFICIALES_SLUGS, TIEMPO_RESPUESTA } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'
import { NivelPrecioBadge } from '@/components/ui/NivelPrecioBadge'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'
import { ProvinciaHubPage, provinciaHubMetadata } from '@/components/seo-local/ProvinciaHubPage'
import type { Prepaga } from '@/types'
import { getAppPrepaga, APPS_FECHA, APPS_FUENTE } from '@/lib/data/apps-prepagas'
import { resenasAprobadas } from '@/lib/db'
import { ResenaForm } from '@/components/prepagas/ResenaForm'
import { contactos, CONTACTOS_VERIFICADOS } from '@/lib/data/contactos'
import { getConvenios } from '@/lib/data/convenios'
import { AUMENTOS_OFICIALES } from '@/lib/data/aumentos'

interface Props {
  params: Promise<{ slug: string }>
}

type Plan = Prepaga['planes'][number]

// Mapea el slug de prepaga al slug de obra social cuando la misma marca
// opera de las dos formas (la mayoría comparte slug; estas son las excepciones).
const PREPAGA_A_OS_SLUG: Record<string, string> = {
  'swiss-medical': 'swiss-medical-os',
  'sancor-salud': 'sancor-os',
}
function obraSocialHermana(prepagaSlug: string) {
  const osSlug = PREPAGA_A_OS_SLUG[prepagaSlug] ?? prepagaSlug
  return obrasSociales.find((o) => o.slug === osSlug)
}

function buildFAQs(prep: Prepaga, precioMin: number, precioMax: number, planEstrella: Plan) {
  const sinCopago = prep.planes.filter(p => !p.copago).map(p => p.nombre)
  const conCopago = prep.planes.filter(p => p.copago).map(p => p.nombre)
  const nivelMin = NIVEL_PRECIO_LABEL[nivelPrecio(precioMin)].label.toLowerCase()
  const nivelMax = NIVEL_PRECIO_LABEL[nivelPrecio(precioMax)].label.toLowerCase()
  // Mismos planes ya ordenados por precio arriba — solo se nombra el más
  // barato y el más caro explícitamente (pedido de Darío, 20-sep-2026: que
  // "planes económicos"/"planes premium" aparezcan en texto visible, igual
  // que ya pasa con "{prepaga} planes").
  const planMasBarato = prep.planes.find(pl => pl.precio === precioMin) ?? prep.planes[0]
  const planMasCaro = prep.planes.find(pl => pl.precio === precioMax) ?? prep.planes[0]
  return [
    {
      // FAQ pensada para "{prepaga} planes" (pedido de Darío, 15-sep-2026):
      // nombra los planes explícitamente en texto visible, no solo en el
      // título — es la señal más directa que puede leer Google.
      q: `¿Cuántos planes tiene ${prep.nombre} y cuáles son?`,
      a: `${prep.nombre} tiene ${prep.planes.length} planes: ${prep.planes.map(pl => pl.nombre).join(', ')}. Van de ${formatPrecio(precioMin)} a ${formatPrecio(precioMax)} por mes (precio de lista, ${PRECIO_ACTUALIZADO.toLowerCase()}) — el valor exacto depende de tu edad y zona.`,
    },
    {
      q: `¿Cuánto cuesta ${prep.nombre} en ${PRECIO_ACTUALIZADO}?`,
      a: `Los planes de ${prep.nombre} van de nivel de precio ${nivelMin} a ${nivelMax} según la cobertura elegida. El precio exacto varía según tu edad y zona — cotizalo gratis en el comparador de PrepagaYa.`,
    },
    {
      q: `¿Qué plan de ${prep.nombre} conviene más?`,
      a: `El plan más elegido es el ${planEstrella.nombre}, de nivel de precio ${NIVEL_PRECIO_LABEL[nivelPrecio(planEstrella.precio)].label.toLowerCase()}. ${planEstrella.descripcion}`,
    },
    {
      q: `¿Cuál es el plan más económico y cuál el premium de ${prep.nombre}?`,
      a: planMasBarato.slug === planMasCaro.slug
        ? `${prep.nombre} tiene un solo nivel de plan: ${planMasBarato.nombre}, a ${formatPrecio(precioMin)}/mes.`
        : `El plan más económico es ${planMasBarato.nombre}, desde ${formatPrecio(precioMin)}/mes. El plan premium con mejor cobertura es ${planMasCaro.nombre}, desde ${formatPrecio(precioMax)}/mes.`,
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
  if (nivelPrecio(precioMin) === 'economico') items.push({
    titulo: 'Quienes buscan el mejor precio del mercado',
    desc: 'Nivel de precio económico con cobertura PMO completa. Ideal si necesitás cobertura sin pagar de más.',
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
  if (prep.profesionales && prep.profesionales >= 100000) items.push({
    titulo: 'Usuarios de muchos especialistas',
    desc: `Más de ${Math.round(prep.profesionales / 1000)}k prestadores en cartilla, según ${prep.nombre}.`,
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

// El segmento [slug] despacha dos tipos: prepaga (/prepagas/osde) y hub
// provincial del silo SEO local (/prepagas/cordoba). Sin colisiones de slug.
// Reseñas de usuarios: la ficha se regenera cada hora y al aprobar una reseña
// en el panel (revalidatePath en /api/panel/resenas).
export const revalidate = 3600

export async function generateStaticParams() {
  return [
    ...prepagas.map((p) => ({ slug: p.slug })),
    ...provinciasSEO.map((p) => ({ slug: p.slug })),
  ]
}

// Keywords de cola larga con volumen de búsqueda real confirmado (research de
// mercado), específicas por marca. Se suman a las genéricas de cada ficha.
const KEYWORDS_EXTRA: Record<string, string[]> = {
  'swiss-medical': ['swiss medical anses', 'swiss medical afip', 'swiss medical pami', 'swiss medical convenio empleados', 'swiss medical banco nacion', 'swiss medical banco provincia', 'swiss medical banco macro', 'swiss medical supervielle', 'swiss medical banco ciudad'],
  'sancor-salud': ['sancor salud precios', 'sancor salud cordoba', 'sancor plan 1000', 'sancor salud interior del país'],
  'avalian': ['avalian ex aca salud', 'aca salud ahora avalian', 'avalian planes precios', 'avalian as200', 'avalian as300'],
  'premedic': ['premedic precios', 'premedic opiniones', 'premedic plan 200', 'premedic monotributistas', 'prepaga mas barata argentina'],
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const prov = getProvinciaSEO(slug)
  if (prov) return provinciaHubMetadata(prov)
  const prep = prepagas.find((p) => p.slug === slug)
  if (!prep) return {}
  // Título y descripción con precio real "desde" (Search Console, sept 2026:
  // estas fichas tenían 1000+ impresiones y CTR menor a 0.5% — el título
  // genérico anterior no respondía la intención de búsqueda "precio" ni
  // "cartilla", que son las dos consultas de mayor volumen sin clics).
  const precioMinTitulo = Math.min(...prep.planes.map((pl) => pl.precio))
  return {
    // "Cartilla" salió del título (22-sep-2026): esa intención ahora la toma
    // /cartillas/[prepaga] con datos oficiales por zona; esta ficha apunta a
    // planes y precios y enlaza a la cartilla.
    // "Cuánto sale" (23-sep-2026): "cuánto sale osde" busca ~7 veces más que
    // "prepagas precios" (Google Trends); es la misma intención de esta ficha.
    // absolute: sin el sufijo "| PrepagaYa", para que entre completo en Google (~65 caracteres).
    title: { absolute: `${prep.nombre}: planes y cuánto sale en ${PRECIO_ACTUALIZADO.toLowerCase()}, desde ${formatPrecio(precioMinTitulo)}` },
    // Descripción ≤ ~160 caracteres (antes ~185 y Google cortaba el "Cotizá gratis")
    description: `¿Cuánto sale ${prep.nombre}? Planes desde ${formatPrecio(precioMinTitulo)}/mes en ${PRECIO_ACTUALIZADO.toLowerCase()}${prep.planes.some((pl) => pl.fuentePrecio === 'sssalud') ? ' (precio oficial SSSalud)' : ''}. Precio por edad, cartilla${contactos[prep.slug] ? ', teléfonos' : ''} y opiniones. Cotizá gratis.`,
    alternates: { canonical: `${SITE_URL}/prepagas/${slug}` },
    keywords: [
      `${prep.nombre.toLowerCase()} planes`,
      `${prep.nombre.toLowerCase()} opiniones`,
      `${prep.nombre.toLowerCase()} cobertura`,
      `prepaga ${prep.nombre.toLowerCase()}`,
      `cuanto sale ${prep.nombre.toLowerCase()}`,
      `aumento ${prep.nombre.toLowerCase()}`,
      ...(contactos[slug] ? [`telefono ${prep.nombre.toLowerCase()}`] : []),
      ...(KEYWORDS_EXTRA[slug] ?? []),
    ],
  }
}

export default async function PrepagaSlugPage({ params }: Props) {
  const { slug } = await params
  const prov = getProvinciaSEO(slug)
  if (prov) return <ProvinciaHubPage prov={prov} />
  const prep = prepagas.find((p) => p.slug === slug)
  if (!prep) notFound()
  const opiniones = await resenasAprobadas(prep.slug)

  const PARTNERS_TIER: Record<string, string> = {
    'swiss-medical': 'Premium',
    'sancor-salud': 'Intermedia',
    'premedic': 'Económica',
  }
  const isPartner = PARTNERS_OFICIALES_SLUGS.includes(slug)
  const osMatch = obraSocialHermana(prep.slug)

  const planesOrdenados = [...prep.planes].sort((a, b) => a.precio - b.precio)
  const precioMin = Math.min(...prep.planes.map(pl => pl.precio))
  const precioMax = Math.max(...prep.planes.map(pl => pl.precio))
  const planEstrella = prep.planes.find(pl => pl.destacado) ?? planesOrdenados[0]
  // Los planes que comparten cartilla real van pegados en vez de ordenados
  // solo por precio (hoy solo hay data cargada para Swiss Medical).
  const otrosPlanes = ordenarPorCartilla(prep.slug, planesOrdenados).filter(pl => pl.slug !== planEstrella.slug)
  const perfiles = getPerfilesIdeales(prep, precioMin)
  const app = getAppPrepaga(prep.slug)
  const contacto = contactos[prep.slug]
  const conv = getConvenios(prep.slug)
  const telSocios = contacto?.canales.find((c) => c.tipo === 'socios') ?? contacto?.canales.find((c) => c.tipo === 'whatsapp')
  const telEmergencias = contacto?.canales.find((c) => c.tipo === 'emergencias')
  // Aumento oficial del mes de esta prepaga (auditoría SEO 24-sep-2026):
  // "aumento [prepaga] [mes]" es de las búsquedas más grandes por marca y la
  // ficha no lo decía. Mismo dato que /aumentos (cuadros de la SSSalud).
  const aumentosPrep = Object.keys(AUMENTOS_OFICIALES.meses).sort()
    .map((per) => ({ mes: AUMENTOS_OFICIALES.meses[per], dato: AUMENTOS_OFICIALES.meses[per].prepagas[prep.slug] }))
    .filter((x) => x.dato)
  const aumento = aumentosPrep[aumentosPrep.length - 1]
  const aumentoAnterior = aumentosPrep[aumentosPrep.length - 2]
  const pct = (n: number) => `${n.toLocaleString('es-AR')}%`
  const aumentoRango = aumento && aumento.dato.minimo !== aumento.dato.maximo
    ? ` (de ${pct(aumento.dato.minimo)} a ${pct(aumento.dato.maximo)} según el plan y la región)` : ''
  const faqs = [
    ...buildFAQs(prep, precioMin, precioMax, planEstrella),
    ...(aumento ? [{
      q: `¿Cuánto aumenta ${prep.nombre} en ${aumento.mes.label.toLowerCase()}?`,
      a: `Según el cuadro tarifario que ${prep.nombre} declaró ante la Superintendencia de Servicios de Salud, aumenta ${pct(aumento.dato.mediana)} en ${aumento.mes.label.toLowerCase()}${aumentoRango}. El promedio del mercado ese mes es ${pct(aumento.mes.promedio)}.${aumentoAnterior ? ` En ${aumentoAnterior.mes.label.toLowerCase()} había aumentado ${pct(aumentoAnterior.dato.mediana)}.` : ''}`,
    }] : []),
    ...(conv?.codigoAfip?.codigos.length ? [{
      q: `¿Cuál es el código de obra social de ${prep.nombre} para AFIP/ARCA?`,
      a: `${conv.codigoAfip.codigos.map((c) => `${c.codigo}${c.nota ? ` (${c.nota})` : ''}`).join('; ')}. ${conv.codigoAfip.explicacion}`,
    }] : []),
    ...(conv?.pami?.respuesta ? [{
      q: `¿${prep.nombre} atiende PAMI?`,
      a: `${conv.pami.respuesta} ${conv.pami.detalle}`,
    }] : []),
    ...(conv?.convenios?.length ? [{
      q: `¿Qué convenios tiene ${prep.nombre}?`,
      a: conv.convenios.map((c) => `${c.entidad}: ${c.beneficio} (${c.paraQuien.toLowerCase()})`).join('. ') + '.',
    }] : []),
    ...(conv?.bancos?.length ? [{
      q: `¿Con qué bancos tiene afinidad ${prep.nombre}?`,
      a: `${prep.nombre} tiene convenios de afinidad con ${conv.bancos.map((b) => b.banco).join(', ').replace(/, ([^,]*)$/, ' y $1')}. Consultanos qué planes y condiciones aplican a tu caso: te respondemos en ${TIEMPO_RESPUESTA}.`,
    }] : []),
    ...(contacto && telSocios ? [{
      q: `¿Cuál es el teléfono de ${prep.nombre}?`,
      a: `${telSocios.etiqueta}: ${telSocios.valor}${telSocios.detalle ? ` (${telSocios.detalle.toLowerCase()})` : ''}.${telEmergencias ? ` ${telEmergencias.etiqueta}: ${telEmergencias.valor}.` : ''} Datos publicados por ${prep.nombre} en su web oficial. Si querés contratar un plan, te cotizamos en ${TIEMPO_RESPUESTA}.`,
    }] : []),
    // "¿X tiene app?": única búsqueda de apps con intención previa a contratar
    // (análisis de keywords, 22-sep-2026). Solo con datos de la ficha oficial.
    ...(app ? [{
      q: `¿${prep.nombre} tiene app?`,
      a: `Sí. La app oficial se llama "${app.nombreApp}" y está en Google Play. ${app.credencialDigital ? 'Incluye credencial digital. ' : ''}Según su ficha oficial permite: ${app.funciones.slice(0, 4).map((f) => f.toLowerCase()).join('; ')}.`,
    }] : []),
  ]

  const jsonLd: Record<string, unknown>[] = [
    ...(opiniones.cantidad > 0 ? [{
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: prep.nombre,
      url: `${SITE_URL}/prepagas/${slug}`,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: opiniones.promedio,
        reviewCount: opiniones.cantidad,
        bestRating: 5,
        worstRating: 1,
      },
      review: opiniones.resenas.slice(0, 5).map((o) => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: o.nombre },
        datePublished: o.creado_en.slice(0, 10),
        reviewBody: o.texto,
        reviewRating: { '@type': 'Rating', ratingValue: o.rating, bestRating: 5, worstRating: 1 },
      })),
    }] : []),
    {
      '@context': 'https://schema.org',
      // Service, no Product: un plan de salud no es un bien físico y
      // "Product" hace que Search Console lo valide como ficha de compras
      // (Merchant Listing), pidiendo campos que no aplican como "image" de
      // producto, política de devolución o envío. Corregido 17-sep-2026
      // tras el error real reportado en Search Console.
      '@type': 'Service',
      name: `${prep.nombre} — Medicina Prepaga Argentina`,
      description: prep.descripcion,
      url: `${SITE_URL}/prepagas/${slug}`,
      provider: { '@type': 'Organization', name: prep.nombre },
      // AggregateOffer con el rango real de precios de los planes — sin esto
      // Google no tiene forma de mostrar "desde $X" en el resultado de
      // búsqueda para consultas tipo "{prepaga} planes" (pedido de Darío,
      // 15-sep-2026: posicionar justo esa keyword).
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'ARS',
        lowPrice: precioMin,
        highPrice: precioMax,
        offerCount: prep.planes.length,
        availability: 'https://schema.org/InStock',
        priceValidUntil: PRECIO_VALIDO_HASTA,
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
                <PrepagaLogo
                  slug={prep.slug}
                  nombre={prep.nombre}
                  colorPrimario={prep.colorPrimario}
                  size="lg"
                  className="shadow-sm"
                />
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
                    {isPartner && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        ✓ {PARTNERS_TIER[slug] ? `Opción ${PARTNERS_TIER[slug]} de PrepagaYa` : 'Partner oficial de PrepagaYa'}
                      </span>
                    )}
                  </div>
                  {/* "Precios" en el H1 (auditoría SEO 24-sep-2026): el título
                      ya dice "cuánto sale"; así la ficha cubre también
                      "[prepaga] precios", la otra forma de la búsqueda. */}
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{prep.nombre}: planes y precios</h1>
                </div>
              </div>

              {/* Rating: solo el de las reseñas reales del sitio (las mismas del
                  rich snippet). Antes mostraba "4,2 (1.243 opiniones)" fijo,
                  sin fuente (Darío, 24-sep-2026). */}
              <a href="#opiniones" className="inline-flex items-center gap-2 mb-4 group">
                {opiniones.cantidad > 0 ? (
                  <>
                    <StarRow rating={opiniones.promedio} />
                    <span className="text-sm font-semibold text-gray-700">{opiniones.promedio.toLocaleString('es-AR')}</span>
                    <span className="text-sm text-gray-400 group-hover:text-[#E8002D]">({opiniones.cantidad} {opiniones.cantidad === 1 ? 'opinión' : 'opiniones'} de usuarios)</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500 group-hover:text-[#E8002D]">★ Dejá tu opinión sobre {prep.nombre}</span>
                )}
              </a>

              <p className="text-gray-600 text-sm leading-relaxed mb-5 max-w-xl">{prep.descripcion}</p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/comparador"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
                >
                  {isPartner ? 'Cotizar y contratar online →' : 'Cotizar mi precio exacto →'}
                </Link>
                {/* Botón a la cartilla por zona/nombre — pedido de Darío, 23-sep-2026, para darle visibilidad */}
                {getCartillaInfo(prep.slug) && (
                  <Link
                    href={`/cartillas/${prep.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#E8002D] text-[#E8002D] hover:bg-red-50 font-bold rounded-xl transition-all text-sm"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.45 4.39l3.08 3.08a.75.75 0 11-1.06 1.06l-3.08-3.08A7 7 0 012 9z" clipRule="evenodd" /></svg>
                    Buscar en la cartilla de {prep.nombre}
                  </Link>
                )}
                {/* Web oficial como botón solo para las que no vendemos: en las
                    partner mandaba al visitante más calificado a contratar
                    directo (pedido de Darío, 23-sep-2026). En las partner
                    queda como link de texto al pie de las preguntas frecuentes. */}
                {!isPartner && (
                  <a
                    href={`https://${prep.web}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-semibold rounded-xl transition-all text-sm"
                  >
                    Web oficial ↗
                  </a>
                )}
              </div>
              {isPartner && (
                <p className="mt-3 text-xs text-gray-500 flex items-center gap-1.5">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" aria-hidden><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .2.08.39.22.53l3 3a.75.75 0 101.06-1.06l-2.78-2.78V5z" clipRule="evenodd" /></svg>
                  Te respondemos en {TIEMPO_RESPUESTA} con la cotización de {prep.nombre}, hecha con nuestro sistema propio de cotización.
                </p>
              )}
              {(prep.slug === 'swiss-medical' || prep.slug === 'osde') && (
                <Link href={`/empresas/${prep.slug}`} className="inline-block mt-3 text-xs text-gray-400 hover:text-[#E8002D] font-medium transition-colors">
                  ¿Buscás cobertura para tu empresa? Plan corporativo de {prep.nombre} →
                </Link>
              )}
            </div>

            {/* Right: nivel de precio card */}
            <div className="sm:w-52 flex-shrink-0">
              <div className="bg-white rounded-2xl border-2 border-[#E8002D] p-5 text-center shadow-sm">
                <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-medium">Desde</div>
                <div className="text-2xl font-black text-gray-900">{formatPrecio(precioMin)}</div>
                <div className="flex justify-center mt-1.5">
                  <NivelPrecioBadge nivel={nivelPrecio(precioMin)} />
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 space-y-1">
                  <div className="text-xs text-gray-500 font-medium">{prep.planes.length} planes disponibles</div>
                  <div className="text-xs text-gray-400">El precio exacto depende de tu edad y zona</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {[
              ...(prep.profesionales ? [{ label: 'Prestadores', value: `${(prep.profesionales / 1000).toFixed(0)}k+` }] : []),
              { label: 'Centros propios', value: prep.sanatoriosPropios > 0 ? String(prep.sanatoriosPropios) : 'Red convenio' },
              { label: 'Satisfacción', value: `${prep.satisfaccion}%` },
              ...(opiniones.cantidad > 0 ? [{ label: 'Opiniones de usuarios', value: String(opiniones.cantidad) }] : []),
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
                <div className="text-lg font-bold text-[#E8002D]">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {getCartillaInfo(prep.slug) && (
            <Link
              href={`/cartillas/${prep.slug}`}
              className="inline-block mt-3 text-xs text-gray-400 hover:text-[#E8002D] font-medium transition-colors"
            >
              ¿Buscás un médico puntual? Cartilla de {prep.nombre}: sanatorios y cómo consultarla →
            </Link>
          )}
        </div>
      </section>

      {/* Aumento oficial del mes (ver aumentosPrep arriba) */}
      {aumento && (
        <section id="aumento" className="pt-8 bg-white">
          <div className="container max-w-5xl mx-auto">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-900">
                  Aumento de {prep.nombre} en {aumento.mes.label.toLowerCase()}: {pct(aumento.dato.mediana)}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed mt-1">
                  Dato oficial del cuadro tarifario declarado ante la Superintendencia de Servicios de Salud{aumentoRango}. Promedio del mercado: {pct(aumento.mes.promedio)}.
                  {aumentoAnterior && <> En {aumentoAnterior.mes.label.toLowerCase()} había aumentado {pct(aumentoAnterior.dato.mediana)}.</>}
                </p>
              </div>
              <Link href="/aumentos" className="flex-shrink-0 text-sm font-bold text-[#E8002D] hover:underline">
                Aumentos de todas las prepagas →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Planes */}
      <section className="py-10 bg-white">
        <div className="container max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">Planes de {prep.nombre} — {PRECIO_ACTUALIZADO}</h2>
            <span className="text-xs text-gray-400 hidden sm:block">Nivel de precio relativo</span>
          </div>
          <p className="text-xs text-gray-400 -mt-3 mb-5">
            {prep.planes.every((pl) => pl.fuentePrecio === 'sssalud') ? (
              <>Precios de lista oficiales declarados ante la{' '}
                <a href={PRECIOS_FUENTE_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Superintendencia de Servicios de Salud</a>
                {' '}({PRECIO_ACTUALIZADO}): 30 años, contratación directa, CABA/AMBA, IVA incluido.</>
            ) : (
              <>Precios de referencia para 30 años, contratación individual. El valor final depende de tu edad y zona.</>
            )}
          </p>

          {/* Plan destacado — más grande */}
          <div className="relative bg-gradient-to-r from-[#fff5f5] to-white border-2 border-[#E8002D] rounded-2xl p-6 mb-4">
            <div className="absolute -top-3.5 left-6">
              <span className="bg-[#E8002D] text-white text-[11px] font-black px-4 py-1.5 rounded-full shadow-sm tracking-wide">
                MÁS ELEGIDO
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-1">
              <Link href={`/prepagas/${slug}/${planEstrella.slug}`} className="flex-1 min-w-0 group">
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
                  <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold bg-gray-50 text-gray-600 border border-gray-200">
                    Cartilla {calidadPlan(prep, planEstrella)}/5
                  </span>
                  {planEstrella.cobertura.slice(0, 3).map(c => (
                    <span key={c} className="text-[11px] px-2 py-1 bg-gray-50 text-gray-500 rounded-full border border-gray-100">{c}</span>
                  ))}
                  {planEstrella.cobertura.length > 3 && (
                    <span className="text-[11px] text-gray-400 py-1">+{planEstrella.cobertura.length - 3} más</span>
                  )}
                </div>
              </Link>
              <div className="flex-shrink-0 flex flex-col items-stretch sm:items-end gap-2">
                <div className="text-right sm:text-right">
                  <div className="font-black text-gray-900 text-lg">{formatPrecio(planEstrella.precio)}</div>
                  <div className="flex sm:justify-end">
                    <NivelPrecioBadge nivel={nivelPrecio(planEstrella.precio)} />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap sm:justify-end">
                  <Link href={`/prepagas/${slug}/${planEstrella.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-gray-200 hover:border-red-200 text-gray-700 hover:text-[#E8002D] rounded-xl text-xs font-bold transition-colors whitespace-nowrap">
                    Ver más →
                  </Link>
                  <ContratarPlanButton
                    prepagaNombre={prep.nombre}
                    planNombre={planEstrella.nombre}
                    fuente="ficha-prepaga"
                    label="Cotizar plan"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E8002D] hover:bg-[#B8001F] text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Otros planes */}
          {otrosPlanes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {otrosPlanes.map((plan) => {
                const grupoCartilla = getGrupoCartilla(prep.slug, plan.slug)
                return (
                <div
                  key={plan.slug}
                  className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-red-200 hover:shadow-sm transition-all h-full flex flex-col"
                >
                  <Link href={`/prepagas/${slug}/${plan.slug}`} className="block flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors text-sm">{plan.nombre}</div>
                        <div className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2 min-h-[2.5em]">{plan.descripcion}</div>
                        <div className="flex gap-1.5 mt-2 flex-wrap">
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
                          {grupoCartilla && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-red-50 text-[#E8002D]">
                              {grupoCartilla.nombre}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="font-bold text-gray-900 text-sm">{formatPrecio(plan.precio)}</div>
                        <NivelPrecioBadge nivel={nivelPrecio(plan.precio)} />
                      </div>
                    </div>
                  </Link>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                    <Link href={`/prepagas/${slug}/${plan.slug}`}
                      className="flex-1 justify-center inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#E8002D] border-2 border-gray-200 hover:border-red-200 rounded-lg px-3 py-2 transition-colors">
                      Ver más →
                    </Link>
                    <ContratarPlanButton
                      prepagaNombre={prep.nombre}
                      planNombre={plan.nombre}
                      fuente="ficha-prepaga"
                      label="Cotizar plan"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-[#E8002D] hover:bg-[#B8001F] text-white transition-colors"
                    />
                  </div>
                </div>
              )})}
            </div>
          )}

          <p className="text-xs text-gray-400 mt-4">
            * Nivel de precio relativo al resto del mercado · {PRECIO_ACTUALIZADO}. Cotizá tu precio exacto según tu edad y zona.
          </p>

          <div className="mt-6 bg-gradient-to-r from-[#E8002D] to-[#B8001F] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="text-white font-bold text-lg">¿Cuánto te sale {prep.nombre} a vos?</div>
              <div className="text-red-200 text-sm mt-0.5">El precio final depende de tu edad y tu zona. Cotizalo gratis, sin DNI y sin compromiso.</div>
            </div>
            <ContratarPlanButton
              prepagaNombre={prep.nombre}
              fuente="ficha-prepaga-final"
              label="Cotizar mi precio"
              className="flex-shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-[#E8002D] font-bold rounded-xl transition-all shadow-md text-sm hover:bg-red-50 whitespace-nowrap"
            />
          </div>
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

      {/* Otros planes sin precio declarado ante la SSSalud: se cotizan a pedido */}
      {prep.otrosPlanes && prep.otrosPlanes.length > 0 && (
        <section className="py-10 bg-white border-t border-gray-100">
          <div className="container max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Otros planes de {prep.nombre}</h2>
            <p className="text-sm text-gray-500 mb-5">No tienen precio de lista publicado: te los cotizamos según tu situación.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {prep.otrosPlanes.map((o) => (
                <div key={o.nombre} className="rounded-2xl border border-gray-200 p-5 flex flex-col gap-3">
                  <div className="font-bold text-gray-900">{o.nombre}</div>
                  <p className="text-sm text-gray-600 flex-1">{o.descripcion}</p>
                  <div className="flex items-center justify-between gap-2">
                    <Link href="/comparador" className="text-sm font-semibold text-[#E8002D] hover:underline">Pedir cotización →</Link>
                    <a href={o.url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gray-600 underline">Ficha oficial</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

            {/* Qué cubre esta prepaga (silo /coberturas/[tema]/[prepaga], datos oficiales) */}
      {coberturasMarca.some((x) => x.prepagaSlug === prep.slug) && (
        <section className="py-10 bg-gray-50 border-t border-gray-100">
          <div className="container max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Qué cubre {prep.nombre}, plan por plan</h2>
            <p className="text-sm text-gray-500 mb-5">Ortodoncia, anteojos, psicología, exterior y más, según los documentos oficiales de {prep.nombre}.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {coberturasMarca.filter((x) => x.prepagaSlug === prep.slug).map((x) => (
                <Link key={x.tema} href={`/coberturas/${x.tema}/${x.prepagaSlug}`}
                  className="p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all group">
                  <div className="font-semibold text-sm text-gray-900 group-hover:text-[#E8002D] transition-colors">{x.temaNombre}</div>
                  <div className="text-xs text-gray-400 mt-1">{x.pregunta.replace(/^¿|\?$/g, '')} →</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cobertura por provincia (silo SEO local — link vertical) */}
      {(() => {
        const zonasConPagina = provinciasSEO.filter((prov) =>
          prov.prepagas.some((pz) => pz.slug === prep.slug && pz.enSitio)
        )
        if (zonasConPagina.length === 0) return null
        return (
          <section className="py-10 bg-white border-t border-gray-100">
            <div className="container max-w-5xl mx-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{prep.nombre} por provincia</h2>
              <p className="text-sm text-gray-500 mb-5">La cartilla de {prep.nombre} cambia según la zona: mirá el detalle de tu provincia.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {zonasConPagina.map((prov) => (
                  <Link key={prov.slug} href={`/prepagas/${prov.slug}/${prep.slug}`}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all group">
                    <div className="font-semibold text-sm text-gray-900 group-hover:text-[#E8002D] transition-colors">{prep.nombre} en {prov.nombre}</div>
                    <div className="text-xs text-gray-400 mt-1">Planes y precios locales →</div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )
      })()}

      {/* Cross-link a la ficha de obra social de la misma marca, cuando existe */}
      {osMatch && (
        <section className="py-10 bg-gray-50 border-t border-gray-100">
          <div className="container max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">{prep.nombre} también existe como obra social</h2>
                <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
                  Esta ficha es la contratación directa (prepaga). Si trabajás en relación de dependencia, también podés derivar tu aporte a {osMatch.nombre} y mantener la cobertura del PMO garantizada por ley, algo que la prepaga sola no reemplaza si dejás de pagarla.
                </p>
              </div>
              <Link
                href={`/obras-sociales/${osMatch.slug}`}
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 hover:border-red-200 text-gray-700 hover:text-[#E8002D] font-bold rounded-xl text-sm transition-colors"
              >
                Ver {osMatch.nombre} como obra social →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ¿Pensás cambiarte? (link a /cambios cuando esta prepaga es origen) */}
      {(() => {
        const cambios = getCambiosPorOrigen(prep.slug)
        if (cambios.length === 0) return null
        return (
          <section className="py-10 bg-white border-t border-gray-100">
            <div className="container max-w-5xl mx-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-2">¿Estás en {prep.nombre} y pensás cambiarte?</h2>
              <p className="text-sm text-gray-500 mb-5">Analizamos con datos reales si conviene el cambio.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {cambios.map((c) => {
                  const ahorra = c.deltaMensual > 0
                  return (
                    <Link key={c.slug} href={`/cambios/${c.slug}`}
                      className="p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all group">
                      <div className="font-semibold text-sm text-gray-900 group-hover:text-[#E8002D] transition-colors">A {c.destinoNombre}</div>
                      <div className="text-xs text-gray-400 mt-1 mb-2">{c.gancho}</div>
                      <div className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        ahorra ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {ahorra ? 'Cuota más accesible' : 'Mejor cartilla, cuota similar'}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })()}

      {/* ¿Te interesa cambiarte A esta prepaga? (link a /cambios cuando esta prepaga es destino) */}
      {(() => {
        const cambiosDestino = getCambiosPorDestino(prep.slug)
        if (cambiosDestino.length === 0) return null
        return (
          <section className="py-10 bg-gray-50 border-t border-gray-100">
            <div className="container max-w-5xl mx-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-2">¿Te conviene cambiarte a {prep.nombre}?</h2>
              <p className="text-sm text-gray-500 mb-5">Comparamos con datos reales si vale la pena el cambio desde otras prepagas.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {cambiosDestino.map((c) => {
                  const ahorra = c.deltaMensual > 0
                  return (
                    <Link key={c.slug} href={`/cambios/${c.slug}`}
                      className="p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all group">
                      <div className="font-semibold text-sm text-gray-900 group-hover:text-[#E8002D] transition-colors">Desde {c.origenNombre}</div>
                      <div className="text-xs text-gray-400 mt-1 mb-2">{c.gancho}</div>
                      <div className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        ahorra ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {ahorra ? 'Cuota más accesible' : 'Mejor cartilla, cuota similar'}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })()}

      {/* Comparativas relacionadas */}
      {(() => {
        const comps = getComparativasByPrepaga(prep.slug)
        if (comps.length === 0) return null
        return (
          <section className="py-10 bg-white border-t border-gray-100">
            <div className="container max-w-5xl mx-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Comparativas de {prep.nombre}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {comps.map((c) => (
                  <Link key={c.slug} href={`/comparativas/${c.slug}`}
                    className="p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all group">
                    <div className="font-semibold text-sm text-gray-900 group-hover:text-[#E8002D] transition-colors">{c.titulo}</div>
                    <div className="text-xs text-gray-400 mt-1 line-clamp-2">{c.descripcion}</div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )
      })()}

      {/* App oficial — datos de la ficha de Google Play (lib/data/apps-prepagas.ts) */}
      {app && (
        <section className="py-10 bg-white border-t border-gray-100">
          <div className="container max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-2">App de {prep.nombre}: {app.credencialDigital ? 'credencial digital y gestiones' : 'cartilla y urgencias'}</h2>
            <p className="text-sm text-gray-600 mb-5 max-w-3xl">
              {prep.nombre} tiene app oficial: <strong>{app.nombreApp}</strong>.{' '}
              {app.credencialDigital ? 'Desde ahí usás la credencial digital y hacés gestiones sin ir a una sucursal.' : 'Está centrada en la cartilla y las urgencias; su ficha no menciona credencial digital.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 bg-gray-50 rounded-2xl border border-gray-100 p-5">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Qué podés hacer con la app</div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
                  {app.funciones.map((f) => (
                    <li key={f} className="flex gap-2"><span className="text-emerald-500 flex-shrink-0">✓</span>{f}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3">
                <div>
                  <div className="text-2xl font-black text-gray-900">{app.calificacion.toLocaleString('es-AR')} <span className="text-base text-amber-500">★</span></div>
                  <div className="text-xs text-gray-500">{app.opiniones.toLocaleString('es-AR')} opiniones en Google Play</div>
                </div>
                <a href={app.playUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#E8002D] hover:underline">Ver la app en Google Play →</a>
                {app.otras?.map((o) => (
                  <a key={o.playUrl} href={o.playUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 hover:text-[#E8002D]">
                    <strong>{o.nombre}</strong>: {o.descripcion} →
                  </a>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">Fuente: {APPS_FUENTE}, consultadas el {APPS_FECHA}. La calificación cambia con el tiempo. <Link href="/blog/prepagas-con-mejor-app" className="underline hover:text-gray-600">Comparar las apps de todas las prepagas</Link>.</p>
          </div>
        </section>
      )}

      {/* Opiniones de usuarios (reseñas propias del sitio, moderadas en el panel) */}
      <section id="opiniones" className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-5xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Opiniones sobre {prep.nombre}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {opiniones.cantidad > 0
                  ? <><span className="text-amber-500">★</span> <strong className="text-gray-800">{opiniones.promedio.toLocaleString('es-AR')}</strong> de 5 · {opiniones.cantidad} {opiniones.cantidad === 1 ? 'opinión' : 'opiniones'} de usuarios de PrepagaYa</>
                  : `Todavía no hay opiniones publicadas. ¿Tenés ${prep.nombre}? Contanos tu experiencia.`}
              </p>
            </div>
          </div>
          {opiniones.resenas.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {opiniones.resenas.slice(0, 10).map((o) => (
                <div key={o.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-amber-400 text-sm" aria-label={`${o.rating} de 5 estrellas`}>{'★'.repeat(o.rating)}<span className="text-gray-200">{'★'.repeat(5 - o.rating)}</span></span>
                    <span className="text-xs text-gray-400">{new Date(o.creado_en).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{o.texto}</p>
                  <p className="text-xs text-gray-500 mt-3 font-medium">{o.nombre}{o.ciudad ? ` · ${o.ciudad}` : ''}{o.plan_nombre ? ` · ${o.plan_nombre}` : ''}</p>
                </div>
              ))}
            </div>
          )}
          <ResenaForm prepagaSlug={prep.slug} prepagaNombre={prep.nombre} planes={prep.planes.map((pl) => pl.nombre)} />
        </div>
      </section>

      {/* Convenios, código AFIP y PAMI (23-sep-2026): solo se muestra lo que
          esté cargado en lib/data/convenios.ts. */}
      {conv && (
        <section id="convenios" className="py-10 bg-white border-t border-gray-100">
          <div className="container max-w-5xl mx-auto space-y-8">
            {conv.codigoAfip && conv.codigoAfip.codigos.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Código de obra social de {prep.nombre} para AFIP/ARCA</h2>
                <p className="text-sm text-gray-600 max-w-3xl mb-4">{conv.codigoAfip.explicacion}</p>
                <div className="flex flex-wrap gap-3">
                  {conv.codigoAfip.codigos.map((c) => (
                    <div key={c.codigo} className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                      <div className="text-lg font-black text-gray-900 tabular-nums">{c.codigo}</div>
                      {c.nota && <div className="text-xs text-gray-500 mt-0.5">{c.nota}</div>}
                    </div>
                  ))}
                </div>
                {conv.codigoAfip.fuente && <p className="text-xs text-gray-400 mt-3">Fuente: {conv.codigoAfip.fuente.url ? <a href={conv.codigoAfip.fuente.url} target="_blank" rel="noopener noreferrer" className="underline">{conv.codigoAfip.fuente.texto}</a> : conv.codigoAfip.fuente.texto}</p>}
                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3">
                  <Link href="/guias/derivar-obra-social-a-prepaga" className="text-sm font-semibold text-[#E8002D] hover:underline">Cómo derivar tus aportes a {prep.nombre} →</Link>
                  <Link href="/obras-sociales/codigos" className="text-sm font-semibold text-[#E8002D] hover:underline">Códigos de todas las obras sociales →</Link>
                </div>
              </div>
            )}

            {conv.pami?.respuesta && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">¿{prep.nombre} atiende PAMI?</h2>
                <p className="text-sm text-gray-800 max-w-3xl"><strong>{conv.pami.respuesta}</strong> {conv.pami.detalle}</p>
                {conv.pami.fuente && <p className="text-xs text-gray-400 mt-2">Fuente: {conv.pami.fuente.url ? <a href={conv.pami.fuente.url} target="_blank" rel="noopener noreferrer" className="underline">{conv.pami.fuente.texto}</a> : conv.pami.fuente.texto}</p>}
              </div>
            )}

            {((conv.convenios?.length ?? 0) > 0 || (conv.bancos?.length ?? 0) > 0) && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Convenios y afinidades de {prep.nombre}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {conv.convenios?.map((c) => (
                    <div key={c.entidad} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <h3 className="font-bold text-gray-900 text-sm">Convenio con {c.entidad}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{c.paraQuien}</p>
                      <p className="text-sm text-gray-700 mt-2">{c.beneficio}</p>
                      {c.fuente && <p className="text-[11px] text-gray-400 mt-2">Fuente: {c.fuente.url ? <a href={c.fuente.url} target="_blank" rel="noopener noreferrer" className="underline">{c.fuente.texto}</a> : c.fuente.texto}</p>}
                    </div>
                  ))}
                  {conv.planesConvenio && conv.planesConvenio.planes.length > 0 && (
                    <div className="sm:col-span-2">
                      <h3 className="font-bold text-gray-900 mt-2 mb-3">Planes de los convenios</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {conv.planesConvenio.planes.map((pl) => (
                          <div key={pl.codigo} className="rounded-xl border border-gray-200 bg-white p-4">
                            <div className="flex items-baseline justify-between gap-2">
                              <span className="text-lg font-black text-gray-900">{pl.codigo}</span>
                              <span className="text-xs font-semibold text-[#E8002D]">{pl.linea}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">{pl.sistema}</div>
                            <ul className="mt-3 space-y-1.5">
                              {pl.destacados.map((d) => (
                                <li key={d} className="flex gap-2 text-xs text-gray-700"><span className="text-emerald-500">✓</span>{d}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-2">Fuente: {conv.planesConvenio.fuente}.</p>
                    </div>
                  )}
                  {conv.bancos?.map((b) => (
                    <div key={b.banco} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <h3 className="font-bold text-gray-900 text-sm">Afinidad con {b.banco}</h3>
                      <p className="text-sm text-gray-700 mt-2">{b.beneficio}</p>
                      {b.fuente && <p className="text-[11px] text-gray-400 mt-2">Fuente: {b.fuente.url ? <a href={b.fuente.url} target="_blank" rel="noopener noreferrer" className="underline">{b.fuente.texto}</a> : b.fuente.texto}</p>}
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl border-2 border-[#E8002D]/20 bg-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-sm text-gray-700"><strong>¿Te corresponde algún convenio?</strong> Te decimos cuál aplica a tu caso y te cotizamos en {TIEMPO_RESPUESTA}.</p>
                  <Link href="/comparador" className="flex-shrink-0 text-center px-5 py-2.5 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm transition-colors">
                    Consultar mi convenio →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Teléfonos (23-sep-2026): "teléfono osde" / "swiss medical teléfono"
          tienen mucho volumen. Va como H2 dentro de la ficha (no página
          aparte) para no canibalizar. Solo datos de lib/data/contactos.ts. */}
      {contacto && (
        <section id="telefonos" className="py-10 bg-white border-t border-gray-100">
          <div className="container max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Teléfonos de {prep.nombre} y canales de atención</h2>
            <p className="text-sm text-gray-500 mb-5">
              Publicados por {prep.nombre} en su{' '}
              <a href={contacto.fuente} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">web oficial</a>
              {' '}(verificados el {CONTACTOS_VERIFICADOS}).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {contacto.canales.map((c) => {
                const numero = /\d{6}/.test(c.valor.replace(/\D/g, '')) ? c.valor.split('/')[0].replace(/[^\d+]/g, '') : null
                return (
                  <div key={c.etiqueta} className={`rounded-xl border p-4 ${c.tipo === 'emergencias' ? 'border-red-100 bg-red-50/60' : 'border-gray-100 bg-gray-50'}`}>
                    <div className="text-xs font-semibold text-gray-500">{c.etiqueta}</div>
                    {numero ? (
                      <a href={c.tipo === 'whatsapp' ? `https://wa.me/${numero.startsWith('+54') ? numero.slice(1) : `549${numero}`}` : `tel:${numero}`} className="block mt-1 font-bold text-gray-900 tabular-nums hover:text-[#E8002D]">
                        {c.valor}
                      </a>
                    ) : (
                      <div className="mt-1 font-semibold text-gray-900 text-sm">{c.valor}</div>
                    )}
                    {c.detalle && <div className="text-xs text-gray-500 mt-1">{c.detalle}</div>}
                  </div>
                )
              })}
            </div>
            <div className="mt-5 rounded-2xl border-2 border-[#E8002D]/20 bg-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-sm text-gray-700">
                <strong>¿Querés contratar {prep.nombre}?</strong>{' '}
                {isPartner ? `Somos partner oficial: te cotizamos en ${TIEMPO_RESPUESTA}, sin esperas en el conmutador.` : `Te cotizamos en ${TIEMPO_RESPUESTA} y lo comparamos con otras prepagas.`}
              </p>
              <Link href="/comparador" className="flex-shrink-0 text-center px-5 py-2.5 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm transition-colors">
                Cotizar {prep.nombre} →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes sobre {prep.nombre}</h2>
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
          {isPartner && (
            <p className="text-xs text-gray-400 mt-5">
              Sitio oficial de {prep.nombre}:{' '}
              <a href={`https://${prep.web}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">{prep.web}</a>
            </p>
          )}
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
        </div>
      </section>
    </>
  )
}
