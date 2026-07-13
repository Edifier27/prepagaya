import type { Metadata } from 'next'
import { QuizPrepaga } from '@/components/quiz/QuizPrepaga'
import { SITE_URL } from '@/lib/utils'
import { BreadcrumbSchema } from '@/components/ui/BreadcrumbSchema'

export const metadata: Metadata = {
  title: 'Encontrá la prepaga que se ajusta a tu presupuesto — PrepagaYa',
  description:
    'Respondé 6 preguntas y descubrí qué prepaga encaja con tu presupuesto, zona y necesidades. Sin registro, sin DNI, resultado instantáneo.',
  alternates: { canonical: `${SITE_URL}/prepaga-por-presupuesto` },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuánto tarda encontrar la prepaga por presupuesto?', acceptedAnswer: { '@type': 'Answer', text: 'Son 6 preguntas y toma menos de 2 minutos. El resultado es instantáneo y no requiere registro.' } },
    { '@type': 'Question', name: '¿El resultado es preciso para mi presupuesto?', acceptedAnswer: { '@type': 'Answer', text: 'El resultado es orientativo y te recomienda la prepaga más adecuada según tu perfil, edad y presupuesto. Para un precio exacto personalizado, usá nuestro comparador o cotizá directamente con la prepaga.' } },
    { '@type': 'Question', name: '¿Necesito dar mis datos para ver el resultado?', acceptedAnswer: { '@type': 'Answer', text: 'No. El resultado es inmediato y no pedimos DNI, nombre ni email para mostrarte la recomendación.' } },
  ],
}

export default function PrepagaPorPresupuestoPage(): React.ReactElement {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="container">
          <BreadcrumbSchema crumbs={[{ label: 'Encontrá tu prepaga por presupuesto' }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-red-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-100 text-[#E8002D] text-xs font-semibold px-4 py-2 rounded-full mb-4">
            6 preguntas · 2 minutos · Sin registro
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Encontrá la prepaga que se ajusta a tu presupuesto
          </h1>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            Respondé 6 preguntas y te mostramos qué prepaga encaja con lo que podés pagar, tu zona y tus necesidades de cobertura.
          </p>
        </div>
      </section>

      {/* Quiz */}
      <section className="py-10">
        <div className="container max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10">
            <QuizPrepaga />
          </div>
        </div>
      </section>

      {/* Footer info */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-2xl mx-auto text-center">
          <p className="text-sm text-gray-500 mb-2">
            Sin registro · Sin DNI · Resultado instantáneo
          </p>
          <p className="text-xs text-gray-400">
            El resultado es orientativo. Los precios reales varían según edad, plan y modalidad de contratación.
          </p>
        </div>
      </section>
    </>
  )
}
