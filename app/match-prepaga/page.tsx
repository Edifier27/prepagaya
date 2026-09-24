import type { Metadata } from 'next'
import Link from 'next/link'
import { MatchPrepaga } from '@/components/herramientas/MatchPrepaga'
import { datosMatch, USOS_MATCH } from '@/lib/data/match'
import { SITE_NAME, SITE_URL, OG_IMAGE } from '@/lib/utils'

// Puerta 3 de la propuesta (docs/producto/propuesta-buscador-interactivo.md):
// para quien no sabe por dónde empezar. Busca "qué prepaga me conviene" y
// "test de prepaga"; /prepaga-por-presupuesto queda para "según presupuesto".

const URL = `${SITE_URL}/match-prepaga`

export const metadata: Metadata = {
  title: '¿Qué prepaga me conviene? Test de 6 preguntas con datos oficiales',
  description: 'Contestá 6 preguntas y mirá qué plan coincide con lo que buscás: copago, cartilla, terapia, ortodoncia, anteojos, viajes. Con coberturas oficiales de cada plan.',
  alternates: { canonical: URL },
  openGraph: {
    title: '¿Qué prepaga me conviene?',
    description: 'Tu match de prepaga en 6 preguntas, con el porqué punto por punto.',
    url: URL,
    images: [OG_IMAGE],
  },
}

const faqs = [
  {
    q: '¿Cómo se elige el plan que más me conviene?',
    a: 'Comparamos cada plan con cuadro de precios oficial contra lo que contestaste: nivel de precio, copago, cartilla o libre elección, y lo que vas a usar (terapia, ortodoncia, anteojos, viajes, implantes, deporte). Gana el que cumple más puntos; si empatan, mostramos primero a nuestros partners.',
  },
  {
    q: '¿De dónde salen las coberturas?',
    a: 'De los documentos oficiales de cada prepaga (comparativos y alcances de cobertura). Si un plan no tiene el dato publicado, no lo contamos ni a favor ni en contra: lo marcamos como "sin dato oficial".',
  },
  {
    q: '¿Qué cubren todos los planes?',
    a: 'Por ley, todos los planes cubren el Programa Médico Obligatorio: consultas, estudios, internación, embarazo y parto, salud mental, medicamentos con descuento y más. Lo que cambia entre planes es la cartilla, los copagos y los adicionales.',
  },
]

export default function MatchPrepagaPage() {
  const datos = datosMatch()
  const usos = USOS_MATCH.map((u) => ({ id: u.id, label: u.label }))
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Match de prepaga',
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
        { '@type': 'ListItem', position: 2, name: '¿Qué prepaga me conviene?' },
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
        <div className="container max-w-2xl! mx-auto">
          <nav className="text-sm text-gray-500 mb-5">
            <Link href="/" className="hover:text-[#E8002D]">{SITE_NAME}</Link>
            <span className="mx-2 text-gray-300">›</span>
            <span className="text-gray-700">¿Qué prepaga me conviene?</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">¿Qué prepaga te conviene?</h1>
          <p className="text-gray-700 mt-3 mb-6 leading-relaxed">
            Seis preguntas y te mostramos el plan que más coincide con lo que buscás, con el porqué punto por punto y datos oficiales de cada plan.
          </p>
          <MatchPrepaga datos={datos} usos={usos} />
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-2xl! mx-auto">
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
            <Link href="/buscar-por-sanatorio" className="text-sm font-semibold text-[#E8002D] hover:underline">Buscar por sanatorio →</Link>
            <Link href="/prepaga-por-presupuesto" className="text-sm font-semibold text-[#E8002D] hover:underline">Prepaga según tu presupuesto →</Link>
            <Link href="/ranking" className="text-sm font-semibold text-[#E8002D] hover:underline">Ranking de prepagas →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
