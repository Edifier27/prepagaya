import type { Metadata } from 'next'
import Link from 'next/link'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { provinciasSEO } from '@/lib/data/zonas'
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, formatPrecio } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ComparadorWizard } from '@/components/comparador/ComparadorWizard'

export const metadata: Metadata = {
  title: { absolute: `Comparador de Prepagas Argentina 2026 con Precios Reales — ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/prepagas?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Comparador independiente de prepagas y obras sociales de Argentina. Precios reales verificados mensualmente.',
    areaServed: { '@type': 'Country', name: 'Argentina' },
    knowsAbout: ['medicina prepaga argentina', 'planes de salud privados', 'comparar prepagas', 'OSDE', 'Swiss Medical', 'Sancor Salud'],
    sameAs: [],
    logo: `${SITE_URL}/logo.png`,
  },
]

const testimonios = [
  {
    texto: 'Cambié de OSDE 210 a Swiss Medical SMG20 y ahorré $47.000 por mes. Literal en 5 minutos entendí qué plan me convenía.',
    nombre: 'Martín R.',
    detalle: '34 años · Buenos Aires',
    ahorro: '$47.000/mes',
    stars: 5,
  },
  {
    texto: 'Como monotributista no sabía que pagaba IVA extra. Me explicaron todo y ahora estoy en Sancor Plan 1000, mucho más claro.',
    nombre: 'Diego P.',
    detalle: '28 años · Rosario',
    ahorro: '$38.000/mes',
    stars: 5,
  },
  {
    texto: 'Para mi familia de 4 personas el comparador fue clave. Encontramos Medifé Plata y nos ahorramos casi $90k por mes vs lo que pagábamos.',
    nombre: 'Lucía M.',
    detalle: '41 años · Córdoba',
    ahorro: '$89.000/mes',
    stars: 5,
  },
]

const faqItems = [
  {
    q: '¿Cuánto cuesta una prepaga en Argentina en 2026?',
    a: 'Los precios varían mucho según la empresa, el plan y tu edad. En junio 2026, el plan más económico (Premedic Plan 200) cuesta desde $107.044/mes, mientras que el más caro (OSDE Plan 510) llega a $1.139.396/mes. Un plan estándar para una persona de 30 años cuesta entre $185.000 y $460.000/mes según la prepaga y cobertura elegida.',
  },
  {
    q: '¿Cuál es la mejor prepaga de Argentina?',
    a: 'Según satisfacción de afiliados, Swiss Medical lidera con 92-93% de satisfacción. Le siguen OSDE (74%) y Sancor Salud (72%). La "mejor" depende de tu presupuesto, zona geográfica y necesidades de cobertura. Usá el comparador para ver cuál encaja con tu perfil.',
  },
  {
    q: '¿Cuál es la prepaga más barata?',
    a: 'Premedic es consistentemente la más económica, con planes desde $107.044 mensuales. Sancor Salud y Medife también ofrecen planes accesibles con buena cobertura.',
  },
  {
    q: '¿Puedo cambiar de prepaga en cualquier momento?',
    a: 'Sí, podés solicitar el cambio en cualquier momento. El proceso tarda entre 30 y 60 días hábiles y durante ese período mantenés tu cobertura actual.',
  },
  {
    q: '¿Qué diferencia hay entre el Plan SMG20 de Swiss Medical y el Plan 310 de OSDE?',
    a: 'Son los planes estrella de cada prepaga. El SMG20 de Swiss Medical incluye 8 sanatorios propios (Suizo Argentina, Los Arcos). El Plan 310 de OSDE incluye el Hospital Alemán y médico a domicilio. Si necesitás Hospital Italiano, ambos lo cubren desde estos planes.',
  },
  {
    q: '¿Qué es la Lista Deriva Aporte? ¿Pago menos si trabajo en relación de dependencia?',
    a: 'Sí. Si trabajás en relación de dependencia, pagás por la "Lista Deriva Aporte" que no incluye IVA (21% menos que el precio directo). En el comparador seleccioná "Relación de dependencia" y automáticamente te mostramos los precios sin IVA.',
  },
]

const RANKING_ORDER = [
  'swiss-medical', 'sancor-salud', 'cemic', 'osde', 'omint',
  'medicus', 'medife', 'avalian', 'prevencion-salud', 'premedic',
  'hospital-italiano', 'hominis', 'federada-salud',
]

// Iniciales para avatar
function iniciales(nombre: string) {
  return nombre.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
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
          <div className="container max-w-3xl mx-auto text-center pt-14 pb-8">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-red-100 text-[#E8002D] text-xs font-semibold px-4 py-2 rounded-full mb-5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8002D] animate-pulse" />
              Comparador personalizado · Gratis · Sin registro
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              Encontrá tu prepaga ideal<br />
              <span className="text-[#E8002D]">en menos de 2 minutos</span>
            </h1>
            <p className="text-gray-600 text-base max-w-lg mx-auto leading-relaxed">
              Respondé 4 preguntas y te mostramos los mejores planes con precio real y <strong className="text-gray-800">25% de descuento online</strong>.
            </p>

            {/* Trust bullets */}
            <div className="flex flex-wrap items-center justify-center gap-5 mt-5 text-xs text-gray-500">
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

          {/* Wizard card */}
          <div className="container max-w-3xl mx-auto pb-16">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white p-6 md:p-10">
              <ComparadorWizard />
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonios ─────────────────────────────────────────────────── */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-semibold px-4 py-2 rounded-full mb-4">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              4.7 · Más de 800 valoraciones
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Lo que dicen quienes ya compararon</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonios.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 relative">
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <svg key={j} viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-400">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-4">&ldquo;{t.texto}&rdquo;</p>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.nombre}</div>
                    <div className="text-xs text-gray-400">{t.detalle}</div>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-1.5 text-right">
                    <div className="text-xs text-green-600 font-medium">Ahorro</div>
                    <div className="text-sm font-black text-green-700">{t.ahorro}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                title: 'Sin DNI, sin registro',
                desc: 'Solo necesitamos tu edad y coberturas deseadas. Nada más.',
              },
              {
                icon: <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />,
                title: 'Comparativa imparcial',
                desc: 'No recibimos dinero de prepagas para mejorar su posición.',
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

      {/* ── Ranking de prepagas ──────────────────────────────────────────── */}
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
            <p className="text-gray-500 text-sm mt-2">Ordenadas por popularidad, cobertura y relación precio/calidad</p>
          </div>

          <div className="space-y-3">
            {prepagasRanking.slice(0, 3).map((prep, i) => {
              const precioMin = Math.min(...prep.planes.map(pl => pl.precio))
              const pos = i + 1
              const isTop3 = pos <= 3
              const medalColor =
                pos === 1 ? 'bg-amber-400 text-white' :
                pos === 2 ? 'bg-gray-400 text-white' :
                pos === 3 ? 'bg-amber-700 text-white' :
                            'bg-gray-100 text-gray-500'
              const initials = iniciales(prep.nombre)

              return (
                <Link
                  key={prep.slug}
                  href={`/prepagas/${prep.slug}`}
                  className={`flex items-center gap-4 p-4 sm:p-5 bg-white rounded-2xl border-2 transition-all group hover:shadow-md ${
                    isTop3 ? 'border-amber-200 hover:border-amber-400' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {/* Posición */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 ${medalColor}`}>
                    {pos <= 3 ? (
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ) : pos}
                  </div>

                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                    style={{ backgroundColor: prep.colorPrimario }}
                  >
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-900 group-hover:text-[#E8002D] transition-colors">{prep.nombre}</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border"
                        style={{ color: '#92400E', backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }}>
                        ★ MÁS ELEGIDO
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 truncate">{prep.planes.length} planes disponibles · {prep.satisfaccion}% satisfacción</div>
                  </div>

                  {/* Satisfaction bar — desktop */}
                  <div className="hidden sm:flex flex-col items-center gap-1 flex-shrink-0 w-28">
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#E8002D] rounded-full" style={{ width: `${prep.satisfaccion}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">{prep.satisfaccion}% satisfacción</span>
                  </div>

                  {/* Precio */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-gray-400">Desde</div>
                    <div className="font-black text-gray-900 text-sm tabular-nums">{formatPrecio(precioMin)}</div>
                    <div className="text-xs text-gray-400">/mes</div>
                  </div>

                  {/* Arrow */}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"
                    className="w-4 h-4 text-gray-300 group-hover:text-[#E8002D] transition-colors flex-shrink-0 hidden sm:block">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
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

      {/* ── Prepagas por zona (silo SEO local) ───────────────────────────── */}
      <section className="py-14">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Prepagas por zona</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              La cartilla real cambia según dónde vivas. Verificamos qué prepagas tienen cobertura efectiva en cada provincia, incluyendo las regionales que las comparativas nacionales ignoran.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {provinciasSEO.map((prov) => (
              <div key={prov.slug} className="bg-white rounded-2xl border-2 border-gray-100 hover:border-red-200 hover:shadow-md transition-all p-6 flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-[#E8002D]">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="9" r="2.5" fill="currentColor" stroke="none"/>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Prepagas en {prov.nombre}</h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-1">
                  {prov.prepagas.length} prepagas con cobertura verificada, precios {PRECIO_ACTUALIZADO.toLowerCase()} y cartillas en {prov.capitalNombre} y el interior.
                </p>
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
                  <Link href={`/prepagas/${prov.slug}`} className="text-sm font-bold text-[#E8002D] hover:underline">
                    Ver cobertura →
                  </Link>
                  <Link href={`/prepagas/${prov.slug}/mejores-prepagas`} className="text-sm text-gray-400 hover:text-[#E8002D] font-medium transition-colors">
                    Ranking
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">¿Tu provincia no está? Estamos sumando todas las provincias — mientras tanto <Link href="/comparador" className="text-[#E8002D] font-semibold hover:underline">cotizá acá</Link> y te mostramos las prepagas de tu zona.</p>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
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
                  {item.q}
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
            Comparamos Swiss Medical, OSDE, Sancor Salud, CEMIC, Medifé, Omint y más. Precios reales, sin registro, sin DNI.
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
