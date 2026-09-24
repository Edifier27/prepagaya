import type { Metadata } from 'next'
import Link from 'next/link'
import { ChequeoPrepagaConUrl, type AumentoChequeo, type PrepagaChequeo } from '@/components/herramientas/ChequeoPrepaga'
import { PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { prepagasCotizables } from '@/lib/data/planes-cotizables'
import { AUMENTOS_OFICIALES } from '@/lib/data/aumentos'
import { SITE_NAME, SITE_URL, OG_IMAGE, TIEMPO_RESPUESTA } from '@/lib/utils'

// Puerta 2 de la propuesta (docs/producto/propuesta-buscador-interactivo.md):
// para quien ya tiene prepaga. Convierte el tráfico de "aumento de [prepaga]"
// (informativo, no dejaba leads) en el lead de cambio: la persona ve su
// precio oficial, el aumento que viene y cuántos planes le salen menos.

const URL = `${SITE_URL}/chequeo-prepaga`
const meses = Object.keys(AUMENTOS_OFICIALES.meses).sort()
const ultimoMes = AUMENTOS_OFICIALES.meses[meses[meses.length - 1]]

export const metadata: Metadata = {
  title: `Chequeá tu prepaga: cuánto pagás y cuánto aumenta en ${ultimoMes.label.toLowerCase()}`,
  description: `Elegí tu prepaga y tu plan: te mostramos el precio oficial para tu edad, el aumento de ${ultimoMes.label.toLowerCase()} y cuántos planes parecidos te salen menos. Gratis.`,
  alternates: { canonical: URL },
  openGraph: {
    title: '¿Estás pagando de más por tu prepaga?',
    description: 'Tu precio oficial, el próximo aumento y cuánto podés ahorrar, en un minuto.',
    url: URL,
    images: [OG_IMAGE],
  },
}

function datos(): { lista: PrepagaChequeo[]; aumentos: Record<string, AumentoChequeo[]> } {
  const lista = prepagasCotizables()
  const aumentos: Record<string, AumentoChequeo[]> = {}
  for (const per of meses) {
    const m = AUMENTOS_OFICIALES.meses[per]
    for (const [slug, a] of Object.entries(m.prepagas)) {
      (aumentos[slug] ??= []).push({ mes: m.label, mediana: a.mediana, minimo: a.minimo, maximo: a.maximo, promedio: m.promedio })
    }
  }
  return { lista, aumentos }
}

const faqs = [
  {
    q: '¿De dónde sale el precio de mi plan?',
    a: `Del cuadro tarifario que cada prepaga declara ante la Superintendencia de Servicios de Salud (${PRECIO_ACTUALIZADO.toLowerCase()}), con la escala de edades y la región de cada una. Es el precio de lista: si pagás menos, puede ser por una bonificación o por tus aportes.`,
  },
  {
    q: `¿Cuánto aumenta mi prepaga en ${ultimoMes.label.toLowerCase()}?`,
    a: `El promedio del mercado en ${ultimoMes.label.toLowerCase()} es ${ultimoMes.promedio.toLocaleString('es-AR')}%, según los cuadros oficiales. Cada prepaga aumenta distinto (y a veces distinto por plan): elegí la tuya arriba para ver el dato exacto.`,
  },
  {
    q: '¿Cambiarme de prepaga me hace perder cobertura?',
    a: 'Por ley no hay carencias para lo que cubre el Programa Médico Obligatorio. Lo que sí cambia es la cartilla: antes de cambiarte, fijate que el plan nuevo tenga tus sanatorios y médicos. Un asesor lo revisa con vos.',
  },
  {
    q: '¿Por qué me muestran solo planes de precio parecido?',
    a: 'Porque los planes mucho más baratos suelen ser de otro nivel de cobertura. Comparamos con planes que cuestan hasta 40% menos que el tuyo, para tus mismas edades y tu misma zona.',
  },
]

export default function ChequeoPrepagaPage() {
  const { lista, aumentos } = datos()
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Chequeo de prepaga',
      url: URL,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      inLanguage: 'es-AR',
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'ARS' },
      provider: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Chequeo de prepaga' },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-gradient-to-b from-red-50/60 to-white border-b border-gray-100 pt-8 pb-12">
        <div className="container max-w-3xl! mx-auto">
          <nav className="text-sm text-gray-500 mb-5">
            <Link href="/" className="hover:text-[#E8002D]">{SITE_NAME}</Link>
            <span className="mx-2 text-gray-300">›</span>
            <span className="text-gray-700">Chequeo de prepaga</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">¿Estás pagando de más por tu prepaga?</h1>
          <p className="text-gray-700 mt-3 mb-6 leading-relaxed">
            Elegí tu plan y te mostramos su precio oficial para tu edad, cuánto aumenta en {ultimoMes.label.toLowerCase()} y cuántos planes de precio parecido te salen menos.
          </p>
          <ChequeoPrepagaConUrl prepagas={lista} aumentos={aumentos} mesPrecios={PRECIO_ACTUALIZADO.toLowerCase()} />
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-3xl! mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold text-gray-900">{f.q}</h3>
                <p className="text-sm text-gray-700 leading-relaxed mt-1">{f.a}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-6">
            ¿Tu prepaga no está en la lista? Todavía no publica su cuadro en un formato que podamos leer: te la cotiza un asesor en {TIEMPO_RESPUESTA}. <Link href="/comparador" className="text-[#E8002D] font-semibold hover:underline">Cotizar →</Link>
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
            <Link href="/aumentos" className="text-sm font-semibold text-[#E8002D] hover:underline">Aumentos de todas las prepagas →</Link>
            <Link href="/buscar-por-sanatorio" className="text-sm font-semibold text-[#E8002D] hover:underline">Buscar prepaga por sanatorio →</Link>
            <Link href="/guias/como-cambiar-de-prepaga" className="text-sm font-semibold text-[#E8002D] hover:underline">Cómo cambiarte de prepaga →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
