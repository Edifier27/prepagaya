import type { Metadata } from 'next'
import { ComparadorWizard } from '@/components/comparador/ComparadorWizard'
import { SITE_NAME, SITE_URL } from '@/lib/utils'

export const metadata: Metadata = {
  title: `Comparador de Prepagas Argentina ${new Date().getFullYear()} — Encontrá tu plan ideal`,
  description:
    'Usá nuestro comparador de prepagas y encontrá el plan ideal en 2 minutos. Filtrá por presupuesto y coberturas: psicología, maternidad, odontología y más. Gratis y sin registro.',
  alternates: { canonical: `${SITE_URL}/comparador` },
}

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
  searchParams: Promise<{ zona?: string; provincia?: string }>
}

export default async function ComparadorPage({ searchParams }: Props) {
  const { zona, provincia } = await searchParams

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero — solo visible si no viene con zona preseleccionada */}
      {!zona && (
        <section className="bg-gradient-to-b from-[#FFF1F2] to-white border-b border-red-100 py-14">
          <div className="container max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white border border-red-100 text-[#E8002D] text-xs font-semibold px-4 py-2 rounded-full mb-5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8002D] animate-pulse" />
              Comparador personalizado · Gratis · Sin registro
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              Arma tu cobertura y <span className="text-[#E8002D]">cotizá</span>
            </h1>
            <p className="text-gray-500 text-base max-w-lg mx-auto leading-relaxed">
              Ingresá tu zona y las edades, y te mostramos los mejores planes con precio real y{' '}
              <strong className="text-gray-700">25% de descuento</strong> por contratar online.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-7 text-xs text-gray-500">
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-500"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                <strong className="text-gray-700">+12 prepagas</strong> analizadas
              </span>
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-blue-400"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>
                Precios <strong className="text-gray-700">Julio 2026</strong>
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
      <section className="container max-w-5xl mx-auto py-10 px-4">
        <ComparadorWizard
          initialZona={zona}
          initialProvincia={provincia}
        />
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
                { href: '/comparativas/swiss-medical-vs-osde', label: 'Swiss Medical vs OSDE' },
                { href: '/guias/como-cambiar-de-prepaga', label: 'Cómo cambiar de prepaga' },
              ].map((link) => (
                <a key={link.href} href={link.href}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 hover:border-red-200 hover:text-[#E8002D] transition-all">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
