import type { Metadata } from 'next'
import Link from 'next/link'
import { Buscador } from '@/components/layout/Buscador'
import { prepagas, PRECIO_ACTUALIZADO, nivelPrecio } from '@/lib/data/prepagas'
import { provinciasSEO, prepagasEnSitioPorZona } from '@/lib/data/zonas'
import { cambiosRecomendados } from '@/lib/data/cambios'
import { ultimoMesOficial } from '@/lib/data/aumentos'
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, PARTNERS_OFICIALES, PARTNERS_OFICIALES_TEXTO, PRIORIDAD_PARTNERS, TIEMPO_RESPUESTA, formatPrecio } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { NivelPrecioBadge } from '@/components/ui/NivelPrecioBadge'
import { ComparadorWizard } from '@/components/comparador/ComparadorWizard'
import { CotizarPorPrepaga } from '@/components/prepagas/CotizarPorPrepaga'
import { ZonaBanner } from '@/components/ui/ZonaBanner'

// Home = "comparador de prepagas" (la búsqueda principal del sitio). La
// descripción entra en los ~155 caracteres que muestra Google (la general
// del sitio tenía 180 y se cortaba).
export const metadata: Metadata = {
  title: { absolute: `Comparador de Prepagas Argentina 2026 con Precios Reales — ${SITE_NAME}` },
  description: `Compará todas las prepagas de Argentina con el precio oficial de ${PRECIO_ACTUALIZADO.toLowerCase()}: planes, coberturas y cartillas por zona. Cotizá gratis y sin DNI.`,
  alternates: { canonical: SITE_URL },
}

// Definición de la entidad (GEO): una sola frase autocontenida que buscadores y
// motores de IA puedan citar tal cual. Los números salen de los datos del sitio.
const TOTAL_PLANES = prepagas.reduce((n, p) => n + p.planes.length, 0)
const ENTIDAD_DESCRIPCION = `${SITE_NAME} es un comparador online de prepagas de Argentina: compara ${prepagas.length} prepagas y ${TOTAL_PLANES} planes con precios actualizados cada mes, coberturas plan por plan y cartillas por zona. Es partner oficial de ${PARTNERS_OFICIALES_TEXTO}.`

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'es-AR',
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/prepagas?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/panel-icon-512`,
    description: ENTIDAD_DESCRIPCION,
    areaServed: { '@type': 'Country', name: 'Argentina' },
    knowsAbout: ['medicina prepaga en Argentina', 'comparar prepagas', 'precios de prepagas', 'cartillas médicas', 'obras sociales', ...prepagas.map((p) => p.nombre)],
  },
]

// FAQ con los números del mes, calculados de los mismos datos que /precios
// (auditoría SEO 24-sep-2026): antes estaban fijos con precios de junio
// ($107.044) que contradecían la tabla oficial, y Google los mostraba como
// respuesta a "cuánto cuesta una prepaga".
const TODOS_LOS_PLANES = prepagas.flatMap((p) => p.planes.map((pl) => ({ ...pl, prepaga: p })))
const PLAN_MAS_BARATO = TODOS_LOS_PLANES.reduce((a, b) => (b.precio < a.precio ? b : a))
const PLAN_MAS_CARO = TODOS_LOS_PLANES.reduce((a, b) => (b.precio > a.precio ? b : a))
const AUMENTO_OFICIAL = ultimoMesOficial()

const faqItems = [
  {
    q: `¿Cuánto cuesta una prepaga en Argentina en ${PRECIO_ACTUALIZADO.toLowerCase()}?`,
    a: `Depende de la prepaga, el plan y tu edad. Para una persona de 30 años, según los cuadros tarifarios oficiales de la Superintendencia de Servicios de Salud, van desde ${formatPrecio(PLAN_MAS_BARATO.precio)}/mes (${PLAN_MAS_BARATO.prepaga.nombre} ${PLAN_MAS_BARATO.nombre}) hasta ${formatPrecio(PLAN_MAS_CARO.precio)}/mes (${PLAN_MAS_CARO.prepaga.nombre} ${PLAN_MAS_CARO.nombre}). En la tabla de precios está cada plan.`,
  },
  ...(AUMENTO_OFICIAL ? [{
    q: `¿Cuánto aumentan las prepagas en ${AUMENTO_OFICIAL.label.toLowerCase()}?`,
    a: `Según los cuadros tarifarios que declaran ante la Superintendencia de Servicios de Salud, las prepagas aumentan en promedio ${AUMENTO_OFICIAL.promedio.toLocaleString('es-AR')}% en ${AUMENTO_OFICIAL.label.toLowerCase()}. El detalle por prepaga está en la página de aumentos.`,
  }] : []),
  {
    q: '¿Cuál es la mejor prepaga de Argentina?',
    a: 'Depende de tu presupuesto, tu zona y la cobertura que necesitás. En nuestro ranking, Swiss Medical es la mejor opción premium, Premedic la mejor económica, y Avalian y Sancor Salud las de mejor cobertura en el interior del país. Con el comparador ves cuál encaja con tu perfil y tu zona.',
  },
  {
    q: '¿Cuál es la prepaga más barata?',
    a: `Según los precios oficiales de ${PRECIO_ACTUALIZADO.toLowerCase()}, el plan más económico es ${PLAN_MAS_BARATO.prepaga.nombre} ${PLAN_MAS_BARATO.nombre}, desde ${formatPrecio(PLAN_MAS_BARATO.precio)}/mes para una persona de 30 años. En el ranking de prepagas económicas están las demás.`,
  },
  {
    q: '¿Puedo cambiar de prepaga en cualquier momento?',
    a: 'Sí, podés solicitar el cambio en cualquier momento. El proceso tarda entre 30 y 60 días hábiles y durante ese período mantenés tu cobertura actual.',
  },
  {
    q: '¿Qué diferencia hay entre el Plan SMG20 de Swiss Medical y el Plan 310 de OSDE?',
    a: 'Son los planes estrella de cada prepaga. El SMG20 de Swiss Medical incluye 9 sanatorios propios (Suizo Argentina, Los Arcos). El Plan 310 de OSDE incluye el Hospital Alemán y médico a domicilio. Si necesitás Hospital Italiano, ambos lo cubren desde estos planes.',
  },
  {
    q: '¿Qué es la Lista Deriva Aporte? ¿Pago menos si trabajo en relación de dependencia?',
    a: 'Sí. Si trabajás en relación de dependencia, pagás por la "Lista Deriva Aporte": no lleva IVA y además se descuentan tus aportes de la cuota. En el comparador seleccioná "Relación de dependencia" y te mostramos esos precios.',
  },
]

const RANKING_ORDER = [
  // Partners en orden de prioridad (Darío, 22-sep-2026), después el resto.
  ...PRIORIDAD_PARTNERS, 'osde', 'cemic',
  'omint', 'medicus', 'medife', 'prevencion-salud',
  'hospital-italiano', 'hominis', 'federada-salud',
]

// Etiqueta de las prepagas partner del top: tier por presupuesto donde está
// definido; Avalian va como "PARTNER" hasta tener sus precios oficiales
// cargados (sin precio verificado no la ubicamos en un tier).
const TIER_PARTNER: Record<string, string> = {
  'swiss-medical': 'PREMIUM',
  'avalian': 'PARTNER',
  'sancor-salud': 'INTERMEDIA',
  'premedic': 'ECONÓMICA',
}

export default function HomePage(): React.ReactElement {
  const prepagasRanking = RANKING_ORDER
    .map(slug => prepagas.find(p => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}

      />

      {/* ── Hero: Wizard ────────────────────────────────────────────────── */}
      <section id="cotizador" className="relative overflow-hidden border-b border-gray-100">
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(120deg, #FFE4E6 0%, #FECDD3 16%, #DBEAFE 33%, #E0E7FF 50%, #FCE7F3 66%, #FEF3C7 83%, #FFE4E6 100%)' }}
        />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-white via-white/70 to-transparent" />

        <div className="relative z-10">
          <div className="container max-w-3xl mx-auto text-center pt-6 sm:pt-14 pb-5 sm:pb-8">
            {/* Envuelta en su propia fila centrada: el banner de zona y el
                badge de abajo son dos pastillas "inline-flex" del mismo
                ancho de contenido — sin esto, cuando el banner de zona se
                muestra, quedaban las dos apretadas una al lado de la otra
                en la misma línea (pedido de Darío, 20-sep-2026). */}
            <div className="flex justify-center">
              <ZonaBanner variant="home" />
            </div>
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-red-100 text-[#E8002D] text-xs font-semibold px-4 py-2 rounded-full mb-3 sm:mb-5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8002D] animate-pulse" />
              Precios oficiales {PRECIO_ACTUALIZADO.toLowerCase()} · Gratis · Sin DNI
            </div>
            {/* H1 con la búsqueda principal del home ("comparador de prepagas");
                antes era "Encontrá tu prepaga ideal…", sin la keyword
                (auditoría SEO 24-sep-2026). */}
            <h1 className="text-[1.75rem] leading-tight sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight text-balance">
              Comparador de prepagas<span className="sr-only">:</span>{' '}
              <span className="block text-[#E8002D]">encontrá tu plan en 2 minutos</span>
            </h1>
            {/* El cotizador son 2 preguntas (zona y edades), no 4 */}
            <p className="text-gray-600 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Elegí tu zona y las edades: te mostramos todos los planes con <strong className="text-gray-800">15% de descuento online</strong> (25% si sos monotributista).
            </p>

            {/* Trust bullets — ocultos en mobile para que el cotizador entre
                en la primera pantalla (la pastilla de arriba ya dice precios
                oficiales, gratis y sin DNI) */}
            <div className="hidden sm:flex flex-wrap items-center justify-center gap-5 mt-5 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-500"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                <strong className="text-gray-700">+8.400</strong> cotizaciones realizadas
              </span>
              <span className="flex items-center gap-1.5">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-400"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>
                Precios <strong className="text-gray-700">{PRECIO_ACTUALIZADO}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                Sin DNI · <strong className="text-gray-700">100% gratuito</strong>
              </span>
            </div>
          </div>

          {/* Cómo funciona: baja la fricción de "¿qué pasa con mis datos?" antes de empezar.
              En mobile va compacto en una fila (antes eran 3 bloques apilados
              que empujaban el cotizador fuera de la primera pantalla). */}
          <div className="container max-w-2xl mx-auto pb-4 sm:pb-8">
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {[
                { n: '1', t: 'Cotizás gratis', d: 'Sin DNI, en menos de 2 minutos' },
                { n: '2', t: 'Comparás precios reales', d: 'De todas las prepagas en tu zona' },
                { n: '3', t: 'Vos decidís', d: 'Un asesor te contacta solo si pedís más info' },
              ].map((s) => (
                <div key={s.n} className="flex flex-col items-center text-center gap-1 sm:gap-1.5">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white border-2 border-red-100 flex items-center justify-center font-bold text-xs sm:text-sm text-[#E8002D] shadow-sm">
                    {s.n}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">{s.t}</div>
                  <div className="hidden sm:block text-xs text-gray-500">{s.d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Wizard card */}
          <div className="container max-w-3xl mx-auto pb-10 sm:pb-16">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white p-5 md:p-10">
              <ComparadorWizard zonasSEO={prepagasEnSitioPorZona()} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Tres puertas (24-sep-2026, docs/producto/propuesta-buscador-
          interactivo.md): otras formas de empezar además del cotizador. La de
          sanatorios reemplaza al acceso a cartillas del 23-sep (lo incluye). ── */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">¿Cómo querés empezar?</h2>
          <p className="text-sm text-gray-600 mb-5">Además del cotizador, tres atajos con datos oficiales.</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { href: '/buscar-por-sanatorio', titulo: 'Tengo mis sanatorios', texto: 'Elegí dónde te atendés y mirá qué plan los cubre a todos, con las cartillas oficiales.', cta: 'Buscar por sanatorio', icono: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4M12 8v4M10 10h4' },
              { href: '/chequeo-prepaga', titulo: 'Ya tengo prepaga', texto: 'Chequeá cuánto pagás, cuánto aumenta el mes que viene y cuánto podés ahorrar.', cta: 'Chequear mi cuota', icono: 'M9 12l2 2 4-4M7.8 4.7a3.4 3.4 0 001.9-.8 3.4 3.4 0 014.6 0 3.4 3.4 0 001.9.8 3.4 3.4 0 013.1 3.1c.1.7.4 1.4.8 1.9a3.4 3.4 0 010 4.6 3.4 3.4 0 00-.8 1.9 3.4 3.4 0 01-3.1 3.1 3.4 3.4 0 00-1.9.8 3.4 3.4 0 01-4.6 0 3.4 3.4 0 00-1.9-.8 3.4 3.4 0 01-3.1-3.1 3.4 3.4 0 00-.8-1.9 3.4 3.4 0 010-4.6 3.4 3.4 0 00.8-1.9 3.4 3.4 0 013.1-3.1z' },
              { href: '/match-prepaga', titulo: 'No sé cuál me conviene', texto: 'Seis preguntas y te mostramos el plan que más coincide con lo que buscás.', cta: 'Hacer el test', icono: 'M8.2 9a4 4 0 017.6 1c0 2-3 3-3 3M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            ].map((p) => (
              <Link key={p.href} href={p.href}
                className="group flex gap-4 sm:flex-col sm:gap-0 rounded-2xl border-2 border-gray-100 bg-gradient-to-b from-red-50/50 to-white p-4 sm:p-5 hover:border-[#E8002D] hover:shadow-md transition-all">
                <span className="w-11 h-11 shrink-0 rounded-xl bg-[#E8002D] flex items-center justify-center sm:mb-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden><path d={p.icono} /></svg>
                </span>
                <span className="flex flex-col flex-1 min-w-0">
                  <span className="text-base sm:text-lg font-bold text-gray-900">{p.titulo}</span>
                  <span className="text-sm text-gray-600 mt-1 flex-1">{p.texto}</span>
                  <span className="mt-2 sm:mt-3 text-sm font-bold text-[#E8002D] group-hover:underline">{p.cta} →</span>
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <Buscador variante="barra" />
            <Link href="/cartillas" className="text-sm font-semibold text-gray-600 hover:text-[#E8002D] hover:underline sm:px-2">Cartillas de {PARTNERS_OFICIALES_TEXTO} por zona →</Link>
          </div>
        </div>
      </section>

      {/* ── Cotizar por prepaga — debajo del cotizador ─────────────────────── */}
      <CotizarPorPrepaga fuente="home-por-prepaga" />

      {/* ── Ranking de prepagas: intención "mejor prepaga argentina" / precios ── */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-4 py-2 rounded-full mb-4">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-500">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Ranking actualizado {PRECIO_ACTUALIZADO}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Las mejores prepagas de Argentina</h2>
            <p className="text-gray-500 text-sm mt-2">Nuestras prepagas partner destacadas: cotizás y contratás con nosotros</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {prepagasRanking.slice(0, 3).map((prep, i) => {
              const planReferencia = prep.planes.find(pl => pl.destacado) ?? prep.planes[0]
              const pos = i + 1
              const medalColor =
                pos === 1 ? 'bg-amber-400 text-white' :
                pos === 2 ? 'bg-gray-400 text-white' :
                            'bg-amber-700 text-white'
              return (
                <Link
                  key={prep.slug}
                  href={`/prepagas/${prep.slug}`}
                  className="flex items-center gap-3 p-3 sm:flex-col sm:items-stretch sm:gap-3 sm:p-5 bg-white rounded-2xl border-2 border-amber-200 hover:border-amber-400 transition-all group hover:shadow-md"
                >
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-black flex-shrink-0 ${medalColor}`}>
                    {pos}
                  </div>

                  <div className="min-w-0 flex-1 sm:flex-none">
                    {/* Posición + nombre — en mobile todo en una fila compacta */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="font-bold text-gray-900 group-hover:text-[#E8002D] transition-colors truncate">{prep.nombre}</div>
                      {TIER_PARTNER[prep.slug] && (
                        <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full border flex-shrink-0"
                          style={{ color: '#92400E', backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }}>
                          ★ {TIER_PARTNER[prep.slug]}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 mt-0.5 sm:mt-0">{prep.planes.length} planes · {prep.satisfaccion}% satisfacción</div>

                    {/* Satisfaction bar */}
                    <div className="w-full h-1 sm:h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1.5 sm:mt-2">
                      <div className="h-full bg-[#E8002D] rounded-full" style={{ width: `${prep.satisfaccion}%` }} />
                    </div>

                    {/* Nivel de precio + arrow — solo desktop: en mobile
                        sobraba (pedido de Darío, 17-sep-2026: la card ya
                        tenía toda la info que necesita de un vistazo) */}
                    <div className="hidden sm:flex items-center justify-between mt-3">
                      <NivelPrecioBadge nivel={nivelPrecio(planReferencia.precio)} />
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"
                        className="w-4 h-4 text-gray-300 group-hover:text-[#E8002D] transition-colors flex-shrink-0">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="text-center mt-8">
            <Button href="/prepagas" variant="outline" size="lg">
              Ver todos los planes y precios →
            </Button>
          </div>
        </div>
      </section>

      {/* ── Prepagas por zona (silo SEO local): intención "prepagas en [ciudad]" ── */}
      <section id="zonas" className="py-14">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Prepagas por zona</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              La cartilla real cambia según dónde vivas. Verificamos qué prepagas tienen cobertura efectiva en cada provincia, incluyendo las regionales que las comparativas nacionales ignoran.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 max-w-4xl mx-auto">
            {provinciasSEO.map((prov) => (
              <div key={prov.slug} className="bg-white rounded-2xl border-2 border-gray-100 hover:border-red-200 hover:shadow-md transition-all p-4 sm:p-6 flex flex-col">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-red-50 flex items-center justify-center mb-3 sm:mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 sm:w-5 sm:h-5 text-[#E8002D]">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="9" r="2.5" fill="currentColor" stroke="none"/>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-lg mb-1 leading-snug">Prepagas en {prov.nombre}</h3>
                <p className="hidden sm:block text-sm text-gray-500 leading-relaxed flex-1">
                  {prov.prepagas.length} prepagas con cobertura verificada, precios {PRECIO_ACTUALIZADO.toLowerCase()} y cartillas en {prov.capitalNombre} y el interior.
                </p>
                <p className="sm:hidden text-xs text-gray-500 flex-1">
                  {prov.prepagas.length} prepagas verificadas
                </p>
                <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4 pt-3 border-t border-gray-50 flex-wrap">
                  <Link href={`/prepagas/${prov.slug}`} className="text-xs sm:text-sm font-bold text-[#E8002D] hover:underline">
                    Ver cobertura →
                  </Link>
                  <Link href={`/prepagas/${prov.slug}/mejores-prepagas`} className="text-xs sm:text-sm text-gray-400 hover:text-[#E8002D] font-medium transition-colors">
                    Ranking
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">¿Tu provincia no está? Estamos sumando todas las provincias — mientras tanto <Link href="/comparador" className="text-[#E8002D] font-semibold hover:underline">cotizá acá</Link> y te mostramos las prepagas de tu zona.</p>
        </div>
      </section>

      {/* ── Qué es PrepagaYa (GEO): bloque de respuesta directa y citable ── */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">El comparador de todas las prepagas de Argentina</h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-center">{ENTIDAD_DESCRIPCION}</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
            <li className="bg-gray-50 rounded-xl border border-gray-100 p-4">
              <strong className="text-gray-900">Todas las prepagas, no solo nuestros partners.</strong> El comparador incluye {prepagas.length} prepagas con el precio de {PRECIO_ACTUALIZADO}, para que veas el mercado completo. <Link href="/precios" className="text-[#E8002D] font-semibold hover:underline">Ver precios</Link>
            </li>
            <li className="bg-gray-50 rounded-xl border border-gray-100 p-4">
              <strong className="text-gray-900">Cartillas por zona.</strong> Buscás tu sanatorio o tu barrio y ves qué plan de {PARTNERS_OFICIALES_TEXTO} lo incluye. <Link href="/cartillas" className="text-[#E8002D] font-semibold hover:underline">Buscar en cartillas</Link>
            </li>
            <li className="bg-gray-50 rounded-xl border border-gray-100 p-4">
              <strong className="text-gray-900">Coberturas plan por plan.</strong> Ortodoncia, anteojos, psicología, internación y más, con la fuente oficial citada en cada dato. <Link href="/coberturas" className="text-[#E8002D] font-semibold hover:underline">Ver coberturas</Link>
            </li>
            <li className="bg-gray-50 rounded-xl border border-gray-100 p-4">
              <strong className="text-gray-900">Partner oficial de {PARTNERS_OFICIALES.length} prepagas, con respuesta en {TIEMPO_RESPUESTA}.</strong> Nuestro sistema propio de cotización nos permite mandarte la cotización formal enseguida, y pagás lo mismo que yendo directo. <Link href="/metodologia" className="text-[#E8002D] font-semibold hover:underline">Cómo trabajamos</Link>
            </li>
          </ul>
        </div>
      </section>

      {/* ── Por qué PrepagaYa ───────────────────────────────────────────── */}
      <section className="py-14 bg-gray-50 border-b border-gray-100">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">¿Por qué PrepagaYa?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
                title: 'Precios reales publicados',
                desc: 'El único comparador con precios actualizados mes a mes. Sin sorpresas.',
              },
              {
                icon: <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
                title: `Respuesta en ${TIEMPO_RESPUESTA}`,
                desc: `Te respondemos en ${TIEMPO_RESPUESTA} y te mandamos la cotización formal con nuestro sistema propio de cotización.`,
              },
              {
                icon: <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />,
                title: 'Partner oficial, sin costo extra',
                desc: `Somos partner oficial de ${PARTNERS_OFICIALES_TEXTO}. Ganamos comisión si contratás con nosotros, nunca de tu bolsillo.`,
              },
              {
                icon: <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
                title: 'Expertos en el mercado',
                desc: 'Verificamos precios contra cuadros tarifarios de la Superintendencia.',
              },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#E8002D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    {card.icon}
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{card.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Empresas: intención B2B, distinta del resto del home ──────────── */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-3xl border border-gray-200 p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                Para empresas y pymes
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Buscás cobertura para tu equipo?</h2>
              <p className="text-sm text-gray-600 leading-relaxed max-w-lg">
                Un plan corporativo no se cotiza igual que uno individual: depende de cuántos son y qué edad tienen. Te armamos la propuesta comparada, con precio por volumen y sin las carencias de un plan particular.
              </p>
            </div>
            <Link
              href="/empresas"
              className="flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-sm transition-colors whitespace-nowrap"
            >
              Cotizar para mi empresa →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA consultar precios ────────────────────────────────────────── */}
      <section className="py-12 bg-gradient-to-r from-[#E8002D] to-[#B8001F]">
        <div className="container max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-white text-center sm:text-left">
            <h2 className="text-xl font-bold mb-1">¿Cuánto cuesta tu prepaga en {PRECIO_ACTUALIZADO}?</h2>
            <p className="text-red-200 text-sm">Ingresá tu zona y tu edad — te calculamos el precio exacto en segundos, gratis.</p>
          </div>
          <Link
            href="/comparador"
            className="flex-shrink-0 inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E8002D] font-bold rounded-2xl hover:bg-red-50 transition-all shadow-lg text-sm whitespace-nowrap"
          >
            Cotizar precio →
          </Link>
        </div>
      </section>

      {/* ── ¿A qué prepaga cambiarte? ──────────────────────────────────────── */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Estás pagando de más o cubierto de menos?</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Analizamos precio real y cartilla, empresa por empresa. Si estás en alguna de estas, esto es lo que te conviene.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {cambiosRecomendados.slice(0, 3).map((c) => {
              const origen = prepagas.find((p) => p.slug === c.origenSlug)
              const destino = prepagas.find((p) => p.slug === c.destinoSlug)
              if (!origen || !destino) return null
              const ahorra = c.deltaMensual > 0
              return (
                <Link key={c.slug} href={`/cambios/${c.slug}`}
                  className="bg-white rounded-2xl border-2 border-gray-100 hover:border-red-200 hover:shadow-md transition-all p-6 flex flex-col group">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0"
                      style={{ backgroundColor: origen.colorPrimario + '22', color: origen.colorPrimario }}>
                      {origen.nombre[0]}
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="w-4 h-4 text-gray-300 flex-shrink-0">
                      <path d="M5 12h14m-6-6l6 6-6 6"/>
                    </svg>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0"
                      style={{ backgroundColor: destino.colorPrimario + '22', color: destino.colorPrimario }}>
                      {destino.nombre[0]}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-[#E8002D] transition-colors mb-1">
                    ¿Estás en {origen.nombre}?
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">{c.gancho}</p>
                  <div className={`inline-flex self-start items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border mt-4 ${
                    ahorra ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {ahorra ? 'Cuota más accesible' : 'Mejor cartilla, cuota similar'}
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="text-center mt-8">
            <Button href="/cambios" variant="outline" size="lg">
              Ver todos los cambios recomendados →
            </Button>
          </div>
        </div>
      </section>

      {/* ── FAQ: intención "cuánto cuesta / cuál es la mejor / más barata" ── */}
      <section className="py-14 bg-gray-50">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Preguntas frecuentes
          </h2>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqItems.map((item) => ({
                  '@type': 'Question',
                  name: item.q,
                  acceptedAnswer: { '@type': 'Answer', text: item.a },
                })),
              }),
            }}
          />

          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <details key={i} className="bg-white rounded-xl border border-gray-200 group">
                <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-900 text-sm list-none gap-3">
                  <h3 className="font-semibold text-sm text-gray-900 m-0">{item.q}</h3>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-4 h-4 flex-shrink-0 transition-transform group-open:rotate-180">
                    <path d="M19 9l-7 7-7-7"/>
                  </svg>
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">{item.a}</p>
                </div>
              </details>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/guias" className="text-sm font-medium text-[#E8002D] hover:underline">
              Ver todas las guías →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA final ───────────────────────────────────────────────────── */}
      <section className="py-14 bg-[#E8002D] text-white">
        <div className="container text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            ¿Listo para encontrar tu prepaga ideal?
          </h2>
          <p className="text-red-100 mb-8 text-sm">
            Comparamos Swiss Medical, OSDE, Sancor Salud, CEMIC, Medifé, Omint y más. Precios reales, sin DNI, sin compromiso.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="#cotizador" variant="white" size="lg">
              Cotizar ahora — gratis
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
