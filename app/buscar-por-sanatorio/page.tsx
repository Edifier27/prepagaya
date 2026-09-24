import type { Metadata } from 'next'
import Link from 'next/link'
import { MisSanatorios } from '@/components/herramientas/MisSanatorios'
import { indiceCobertura } from '@/lib/data/cartilla-zonas/indice-cobertura'
import { CARTILLAS, textoFecha } from '@/lib/data/cartilla-zonas'
import { SANATORIOS_SEO, sanatoriosPublicables } from '@/lib/data/sanatorios-seo'
import { SITE_NAME, SITE_URL, OG_IMAGE, TIEMPO_RESPUESTA } from '@/lib/utils'

// Puerta 1 de la propuesta (docs/producto/propuesta-buscador-interactivo.md):
// buscar prepaga empezando por los sanatorios de la persona. Busca "qué
// prepaga cubre el [sanatorio]" y "prepaga con [sanatorio]"; las páginas de
// cada sanatorio (/sanatorios/[slug]) linkean acá con el sanatorio ya cargado.

const URL = `${SITE_URL}/buscar-por-sanatorio`
const TITULO = '¿Qué prepaga cubre tu sanatorio? Buscador por cartilla oficial'

export const metadata: Metadata = {
  title: TITULO,
  description: 'Elegí los sanatorios y clínicas donde te atendés y mirá qué planes de Swiss Medical, OSDE, Sancor Salud, Avalian y Premedic los incluyen a todos. Gratis.',
  alternates: { canonical: URL },
  openGraph: {
    title: '¿Qué prepaga cubre tus sanatorios?',
    description: 'Buscador de prepagas por sanatorio, con las cartillas oficiales de internación.',
    url: URL,
    images: [OG_IMAGE],
  },
}

const faqs = [
  {
    q: '¿De dónde salen los datos?',
    a: `De las cartillas oficiales de internación de ${Object.values(CARTILLAS).map((c) => c.prepagaNombre).join(', ').replace(/, ([^,]*)$/, ' y $1')}, plan por plan y zona por zona. Cada una tiene su fecha: ${Object.values(CARTILLAS).map((c) => `${c.prepagaNombre}, ${textoFecha(c)}`).join('; ')}.`,
  },
  {
    q: '¿Qué pasa si mi sanatorio no aparece?',
    a: 'Buscamos en los sanatorios y clínicas con internación. Si no aparece, probá con otra palabra del nombre (por ejemplo "Güemes" en vez de "Sanatorio Güemes"). Puede que la prepaga lo tenga con otro nombre o solo para consultas: un asesor lo confirma con la prepaga.',
  },
  {
    q: '¿Qué diferencia hay entre internación y guardia?',
    a: 'Internación es que el plan cubre internarte ahí (cirugías, partos, internaciones clínicas). Guardia es la atención de urgencia sin turno. Hay planes que incluyen un sanatorio para internación pero no para guardia: por eso lo marcamos aparte.',
  },
  {
    q: '¿Cuánto sale el plan que cubre mis sanatorios?',
    a: `Depende de la edad de cada persona y de la zona. Con tus edades te mostramos el precio de lista oficial de cada plan y un asesor te escribe en ${TIEMPO_RESPUESTA} con la cotización formal y los descuentos que apliquen.`,
  },
]

export default function BuscarPorSanatorioPage() {
  const total = indiceCobertura().sanatorios.length
  const publicables = sanatoriosPublicables()
  const amba = publicables.filter((s) => !s.ciudad)
  const interior = publicables.filter((s) => s.ciudad)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Buscador de prepagas por sanatorio',
      url: URL,
      applicationCategory: 'HealthApplication',
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
        { '@type': 'ListItem', position: 2, name: 'Buscar por sanatorio' },
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
            <span className="text-gray-700">Buscar por sanatorio</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">¿Qué prepaga cubre tus sanatorios?</h1>
          <p className="text-gray-700 mt-3 mb-6 leading-relaxed">
            Elegí dónde te atendés y te mostramos qué planes los incluyen a todos, con las cartillas oficiales de {total.toLocaleString('es-AR')} sanatorios y clínicas de internación.
          </p>
          <MisSanatorios />
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-3xl! mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cómo funciona</h2>
          <ol className="grid sm:grid-cols-3 gap-4">
            {[
              ['Elegí tus sanatorios', 'Hasta 5: donde te internarías, tu guardia de confianza, donde nacieron tus hijos.'],
              ['Mirá qué planes los incluyen', 'Para cada prepaga, el plan más bajo que los tiene a todos, con internación y guardia por separado.'],
              ['Pedí tu precio', 'Con tus edades te mostramos el precio oficial y un asesor te arma la cotización formal.'],
            ].map(([t, d], i) => (
              <li key={t} className="rounded-2xl border border-gray-200 p-4">
                <div className="text-xs font-bold text-[#E8002D]">Paso {i + 1}</div>
                <div className="font-semibold text-gray-900 mt-1">{t}</div>
                <p className="text-sm text-gray-600 mt-1">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {publicables.length > 0 && (
        <section className="py-10 bg-gray-50 border-t border-gray-100">
          <div className="container max-w-3xl! mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-1">¿Qué prepagas atienden en…?</h2>
            <p className="text-sm text-gray-600 mb-4">Los sanatorios más buscados, con cada prepaga y desde qué plan.</p>
            {[['AMBA', amba], ['Interior', interior]].map(([titulo, lista]) => (lista as typeof SANATORIOS_SEO).length > 0 && (
              <div key={titulo as string} className="mb-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">{titulo as string}</h3>
                <ul className="flex flex-wrap gap-2">
                  {(lista as typeof SANATORIOS_SEO).map((s) => (
                    <li key={s.slug}>
                      <Link href={`/sanatorios/${s.slug}`} className="inline-block rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:border-[#E8002D] hover:text-[#E8002D]">
                        {s.nombre}{s.ciudadNombre ? ` (${s.ciudadNombre})` : ''}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="py-10 bg-white border-t border-gray-100">
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
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6">
            <Link href="/cartillas" className="text-sm font-semibold text-[#E8002D] hover:underline">Cartillas por prepaga y zona →</Link>
            <Link href="/comparador" className="text-sm font-semibold text-[#E8002D] hover:underline">Cotizar por edad y zona →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
