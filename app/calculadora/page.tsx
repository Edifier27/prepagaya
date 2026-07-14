import type { Metadata } from 'next'
import { CalculadoraEdad } from '@/components/calculadora/CalculadoraEdad'
import { PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL } from '@/lib/utils'

export const metadata: Metadata = {
  title: `Calculadora de Prepagas por Edad ${new Date().getFullYear()} — ¿Cuánto pago a los 40, 50, 60 años?`,
  description:
    'Calculá el precio real de tu prepaga según tu edad. Precios actualizados por tramo etario para Swiss Medical, OSDE, Sancor Salud, CEMIC, Premedic y Medife. Incluye simulador de costo real con copagos.',
  alternates: { canonical: `${SITE_URL}/calculadora` },
  keywords: [
    'precio prepaga por edad',
    'cuota prepaga 40 años',
    'cuota prepaga 50 años',
    'prepaga adultos mayores precio',
    'calculadora prepaga argentina',
    'cuanto sale una prepaga según la edad',
  ],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Calculadora de cuota de prepaga por edad',
  description: 'Calculá cuánto pagarías de prepaga según tu edad. Precios actualizados.',
  url: `${SITE_URL}/calculadora`,
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'ARS' },
}

const faqItems = [
  {
    q: '¿Las prepagas cobran diferente según la edad?',
    a: 'Sí. Las prepagas aplican multiplicadores sobre el precio base (referencia: 30 años) según tramos etarios. A los 50 años podés pagar hasta 1.9x el precio base; a los 65 años, hasta 3.1x. El Decreto 1993/2011 regula los topes máximos de variación.',
  },
  {
    q: '¿Cuánto cuesta una prepaga para un jubilado?',
    a: 'Para un jubilado de 65 años, el costo estimado oscila entre $350.000 y $1.500.000/mes según la prepaga y el plan elegido, aplicando el multiplicador etario correspondiente.',
  },
  {
    q: '¿Puedo contratar una prepaga a cualquier edad?',
    a: 'Sí, aunque algunas prepagas pueden aplicar períodos de carencia o preexistencias hasta los 65 años. Pasada esa edad, el ingreso puede estar sujeto a condiciones especiales según cada empresa.',
  },
]

export default function CalculadoraPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-[#E8002D] text-xs font-semibold px-4 py-2 rounded-full mb-4">
            Calculadora gratuita · Precios actualizados {PRECIO_ACTUALIZADO}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            ¿Cuánto cuesta una prepaga según tu edad?
          </h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Las prepagas aplican multiplicadores por edad sobre el precio base. Mové el slider y mirá el precio real para tu tramo etario.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="container max-w-3xl mx-auto py-10">
        <CalculadoraEdad />
      </section>

      {/* FAQ */}
      <section className="container max-w-3xl mx-auto pb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Preguntas frecuentes sobre precios por edad</h2>
        <div className="space-y-3">
          {faqItems.map((item) => (
            <div key={item.q} className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
