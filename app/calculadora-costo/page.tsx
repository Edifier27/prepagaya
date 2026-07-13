import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { CalculadoraSlider } from '@/components/ui/CalculadoraSlider'
import { BreadcrumbSchema } from '@/components/ui/BreadcrumbSchema'

export const metadata: Metadata = {
  title: `Calculadora de precio de prepaga por edad — ${SITE_NAME}`,
  description: 'Calculá el precio exacto de cualquier prepaga argentina según tu edad. Slider interactivo con todos los planes actualizados a Julio 2026. Sin registro, sin formulario.',
  alternates: { canonical: `${SITE_URL}/calculadora-costo` },
  keywords: [
    'calculadora precio prepaga por edad',
    'cuanto cuesta prepaga 40 años',
    'precio prepaga 50 años argentina',
    'tabla de edad prepaga argentina 2026',
  ],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Calculadora de precio de prepaga por edad',
  url: `${SITE_URL}/calculadora-costo`,
  description: 'Calculadora interactiva que muestra el precio de todas las prepagas argentinas según la edad del afiliado.',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: 0, priceCurrency: 'ARS' },
}

export default function CalculadoraCostoPage(): React.ReactElement {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="container">
          <BreadcrumbSchema crumbs={[{ label: 'Calculadora de precio por edad' }]} />
        </div>
      </div>

      <section className="py-12 bg-gradient-to-b from-red-50 to-white border-b border-gray-100">
        <div className="container max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            ¿Cuánto cuesta una prepaga<br className="hidden md:block" />
            <span className="text-[#E8002D]"> según tu edad?</span>
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-base">
            El precio de una prepaga sube con la edad. Mové el slider y ve el precio en tiempo real para todos los planes.
          </p>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <CalculadoraSlider />
        </div>
      </section>

      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            ¿Cómo escala el precio con la edad?
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Rango de edad</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-700">Multiplicador</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-700 hidden sm:table-cell">SMG20 Swiss Medical</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-700 hidden sm:table-cell">OSDE Plan 310</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { rango: '18–25 años', mult: 0.75,  smg20: Math.round(325467 * 0.75),  osde310: Math.round(390000 * 0.75)  },
                  { rango: '26–35 años', mult: 1.00,  smg20: 325467,                       osde310: 390000                     },
                  { rango: '36–45 años', mult: 1.45,  smg20: Math.round(325467 * 1.45),   osde310: Math.round(390000 * 1.45)  },
                  { rango: '46–55 años', mult: 2.05,  smg20: Math.round(325467 * 2.05),   osde310: Math.round(390000 * 2.05)  },
                  { rango: '56–65 años', mult: 2.85,  smg20: Math.round(325467 * 2.85),   osde310: Math.round(390000 * 2.85)  },
                  { rango: '66+ años',   mult: 3.60,  smg20: Math.round(325467 * 3.60),   osde310: Math.round(390000 * 3.60)  },
                ].map((row) => (
                  <tr key={row.rango} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">{row.rango}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`font-bold ${row.mult > 1 ? 'text-red-500' : row.mult < 1 ? 'text-green-600' : 'text-[#E8002D]'}`}>
                        ×{row.mult.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-gray-700 hidden sm:table-cell">
                      ${row.smg20.toLocaleString('es-AR')}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-gray-700 hidden sm:table-cell">
                      ${row.osde310.toLocaleString('es-AR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">Multiplicadores orientativos · Julio 2026</p>
        </div>
      </section>

      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">También puede interesarte</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/precios" className="group p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all">
              <div className="font-bold text-gray-900 group-hover:text-[#E8002D] text-sm">Tabla de precios →</div>
              <div className="text-xs text-gray-500 mt-0.5">Todos los planes julio 2026</div>
            </Link>
            <Link href="/comparar" className="group p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all">
              <div className="font-bold text-gray-900 group-hover:text-[#E8002D] text-sm">Comparar prepagas →</div>
              <div className="text-xs text-gray-500 mt-0.5">Side-by-side 15 características</div>
            </Link>
            <Link href="/#cotizador" className="group p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all">
              <div className="font-bold text-gray-900 group-hover:text-[#E8002D] text-sm">Cotizá gratis →</div>
              <div className="text-xs text-gray-500 mt-0.5">Comparador personalizado</div>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
