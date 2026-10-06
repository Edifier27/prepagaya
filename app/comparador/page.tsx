import type { Metadata } from 'next'
import Link from 'next/link'
import { ComparadorWizard } from '@/components/comparador/ComparadorWizard'
import { prepagasEnSitioPorZona } from '@/lib/data/zonas'
import { PRECIO_ACTUALIZADO, prepagas } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL, TIEMPO_RESPUESTA } from '@/lib/utils'
import { ZonaBanner } from '@/components/ui/ZonaBanner'

// Mapa de keywords (auditoría SEO 24-sep-2026): el home ya pelea
// "comparador de prepagas" y esta página competía con él por la misma
// búsqueda con el mismo título. Acá va la intención de cotizar ("cotizar
// prepaga online", "cotizador de prepagas" — /cotizador ya redirige acá).
export const metadata: Metadata = {
  title: 'Cotizar prepaga online: tu precio exacto en 2 minutos',
  description: `Cotizá tu prepaga online con el precio oficial de ${PRECIO_ACTUALIZADO.toLowerCase()} para tu edad, tu grupo y tu zona. Todas las prepagas, gratis y sin DNI.`,
  alternates: { canonical: `${SITE_URL}/comparador` },
  keywords: ['cotizar prepaga', 'cotizar prepaga online', 'cotizador de prepagas', 'cotizacion prepaga', 'comparador de prepagas'],
}

const TOTAL_PLANES = prepagas.reduce((n, p) => n + p.planes.length, 0)

// FAQ de la página (SEO para "comparador de prepagas", 23-sep-2026): todo sale
// de cómo funciona el comparador y de los datos del sitio, nada inventado.
const faqs = [
  {
    q: '¿Cómo funciona el cotizador de prepagas?',
    a: `Elegís tu zona, cargás la edad de cada integrante del grupo y te mostramos los planes de las prepagas con cobertura en tu provincia, con el precio de ${PRECIO_ACTUALIZADO} calculado para tu grupo. Después podés filtrar por coberturas, copago y presupuesto.`,
  },
  {
    q: '¿Qué prepagas compara?',
    a: `Compara ${prepagas.length} prepagas y ${TOTAL_PLANES} planes: ${prepagas.map((p) => p.nombre).join(', ')}.`,
  },
  {
    q: '¿Usar el comparador tiene costo?',
    a: 'No. Comparar es gratis y, si contratás con nosotros, pagás lo mismo que contratando directo con la prepaga: nuestro ingreso es la comisión que nos paga la prepaga.',
  },
  {
    q: '¿Puedo cotizar una prepaga sin dar el DNI?',
    a: 'Sí. Para ver los planes y precios solo necesitás tu zona y las edades del grupo. No pedimos DNI en ningún paso de la cotización.',
  },
  {
    q: '¿Por qué me piden nombre, celular y email?',
    a: `Para mandarte la cotización formal de los planes que elegiste. Te respondemos en ${TIEMPO_RESPUESTA}, con nuestro sistema propio de cotización. No te pedimos DNI.`,
  },
  {
    q: '¿Cada cuánto se actualizan los precios?',
    a: `Todos los meses. Los precios que ves son los de ${PRECIO_ACTUALIZADO}; el valor final puede variar según tu edad exacta, zona y condición laboral.`,
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: `Comparador de Prepagas — ${SITE_NAME}`,
  description: 'Comparador interactivo de prepagas en Argentina. Encontrá el plan ideal según tu presupuesto y necesidades de cobertura.',
  url: `${SITE_URL}/comparador`,
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'ARS' },
}

interface Props {
  searchParams: Promise<{ zona?: string; provincia?: string; prepaga?: string; plan?: string; desde?: string }>
}

export default async function ComparadorPage({ searchParams }: Props) {
  const { zona, provincia, prepaga: prepagaParam, plan: planParam, desde } = await searchParams
  // Llegada desde la barra "Cotizá X" de una ficha o página de plan
  // (3-oct-2026): los resultados vienen filtrados por esa prepaga y el lead
  // dice qué plan estaba mirando. Solo slugs que existen.
  const prepOrigen = prepagas.find((p) => p.slug === prepagaParam)
  const planOrigen = prepOrigen?.planes.find((pl) => pl.slug === planParam)
  const origen = prepOrigen
    ? {
        prepaga: prepOrigen.slug,
        prepagaNombre: prepOrigen.nombre,
        plan: planOrigen?.slug,
        planNombre: planOrigen?.nombre,
        desde: desde && /^[a-z-]{3,20}$/.test(desde) ? desde : undefined,
      }
    : undefined

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
          }),
        }}
      />

      {/* Hero — solo visible si no viene con zona preseleccionada */}
      {!zona && (
        // En el celular el encabezado va corto para que el cotizador entre en
        // la primera pantalla (Darío, 28-sep-2026: "mucha data, acortala"). La
        // zona detectada ya la muestra el propio cotizador ("Detectamos que
        // estás en…"): el banner y la pastilla quedan solo en pantallas grandes.
        <section className="bg-gradient-to-b from-[#FFF1F2] to-white border-b border-red-100 pt-5 pb-4 sm:py-14">
          <div className="container max-w-3xl mx-auto text-center">
            <div className="hidden sm:block">
              <ZonaBanner variant="cotizador" />
            </div>
            <div className="hidden sm:inline-flex items-center gap-2 bg-white border border-red-100 text-[#E8002D] text-xs font-semibold px-4 py-2 rounded-full mb-5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8002D] animate-pulse" />
              Comparador personalizado · Gratis · Sin DNI
            </div>
            <h1 className="text-[1.6rem] leading-tight sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight text-balance">
              Cotizá tu prepaga online: <span className="text-[#E8002D]">precio exacto para tu grupo</span>
            </h1>
            <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Zona y edades, y listo: planes con <strong className="text-gray-700">15% OFF online</strong> (25% monotributistas). Gratis y sin DNI.
            </p>
            <div className="hidden sm:flex flex-wrap items-center justify-center gap-6 mt-7 text-xs text-gray-500">
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-500"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                <strong className="text-gray-700">{prepagas.length} prepagas</strong> comparadas
              </span>
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-blue-400"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>
                Precios <strong className="text-gray-700">{PRECIO_ACTUALIZADO}</strong>
              </span>
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                <strong className="text-gray-700">100% gratuito</strong> · sin compromiso
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Wizard — ancho amplio para el sidebar de resultados */}
      <section className="container max-w-5xl mx-auto pt-4 pb-10 sm:py-10 px-4">
        {origen && (
          <p className="max-w-xl mx-auto mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-center text-sm text-gray-700">
            Cotizando <strong className="text-gray-900">{origen.prepagaNombre}{origen.planNombre ? ` ${origen.planNombre.replace(/^Plan /, '')}` : ''}</strong>
            {origen.prepaga !== 'swiss-medical' ? ' y, para comparar, Swiss Medical' : ''}. Con tu zona y edades te mostramos el precio exacto.
          </p>
        )}
        <ComparadorWizard
          zonasSEO={prepagasEnSitioPorZona()}
          initialZona={zona}
          initialProvincia={provincia}
          origen={origen}
        />
      </section>

      {/* Sin "Cotizar por prepaga" (Darío, 5-oct-2026): el comparador queda
          solo con el wizard */}

      {/* Confianza debajo del comparador (Darío, 6-oct-2026): cómo funciona,
          en tres columnas. Solo afirmaciones que el sitio ya respalda. */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                titulo: 'Cotización online',
                texto: `Gratis y sin DNI: el precio exacto para tu edad y tu zona, y un asesor te responde en ${TIEMPO_RESPUESTA}.`,
                icono: <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
              },
              {
                titulo: 'Alta simplificada',
                texto: 'Un asesor oficial te acompaña en todo el trámite con la prepaga. Cotizá online y obtené un 15% de descuento.',
                icono: <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
              },
              {
                titulo: `Más de ${Math.floor(TOTAL_PLANES / 10) * 10} planes comparados`,
                texto: `${prepagas.length} prepagas con los precios oficiales de ${PRECIO_ACTUALIZADO.toLowerCase()} que declaran ante la Superintendencia.`,
                icono: <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
              },
            ].map((c) => (
              <div key={c.titulo} className="rounded-2xl border border-gray-100 bg-gray-50/60 p-5">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E8002D] flex items-center justify-center mb-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">{c.icono}</svg>
                </div>
                <h2 className="font-bold text-gray-900">{c.titulo}</h2>
                <p className="text-sm text-gray-600 leading-relaxed mt-1">{c.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preguntas frecuentes — texto indexable para "comparador de prepagas" */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes sobre el comparador de prepagas</h2>
          <div className="space-y-2">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group bg-gray-50 rounded-xl border border-gray-100">
                <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden font-semibold text-sm text-gray-900">
                  {q}
                  <span className="text-gray-400 transition-transform group-open:rotate-180" aria-hidden>⌄</span>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer trust — solo si no hay zona (página limpia de cotización) */}
      {!zona && (
        <section className="bg-gray-50 border-t border-gray-200 py-10">
          <div className="container max-w-3xl mx-auto">
            <p className="text-center text-sm text-gray-500 mb-6">
              ¿Preferís explorar por tu cuenta? Navegá nuestras secciones:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { href: '/prepagas', label: 'Ver todas las prepagas' },
                { href: '/ranking', label: 'Ranking por satisfacción' },
                { href: '/aumentos#ranking-estabilidad', label: '🏆 Quién aumenta menos' },
                { href: '/comparativas/swiss-medical-vs-osde', label: 'Swiss Medical vs OSDE' },
                { href: '/guias/como-cambiar-de-prepaga', label: 'Cómo cambiar de prepaga' },
              ].map((link) => (
                <Link key={link.href} href={link.href}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 hover:border-red-200 hover:text-[#E8002D] transition-all">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
