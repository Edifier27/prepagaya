import type { Metadata } from 'next'
import Link from 'next/link'
import { prepagas } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { BreadcrumbSchema } from '@/components/ui/BreadcrumbSchema'
import { ComparadorTable } from '@/components/comparador/ComparadorTable'

export const metadata: Metadata = {
  title: `Comparar Prepagas Argentina 2026 — Tabla Side-by-Side · ${SITE_NAME}`,
  description: 'Compará hasta 3 prepagas argentinas lado a lado: precio, coberturas, satisfacción y más de 12 características. Actualizado Julio 2026.',
  alternates: { canonical: `${SITE_URL}/comparar` },
  keywords: [
    'comparar prepagas argentina 2026',
    'diferencias entre prepagas',
    'swiss medical vs osde',
    'cual prepaga elegir argentina',
  ],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Comparador de prepagas Argentina side-by-side',
  url: `${SITE_URL}/comparar`,
  description: 'Comparador interactivo de prepagas argentinas. Compará hasta 3 prepagas en tabla lado a lado.',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: 0, priceCurrency: 'ARS' },
}

export default function CompararPage(): React.ReactElement {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="container">
          <BreadcrumbSchema crumbs={[{ label: 'Comparar prepagas' }]} />
        </div>
      </div>

      <section className="py-12 bg-gradient-to-b from-blue-50 to-white border-b border-gray-100">
        <div className="container max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-bold px-4 py-2 rounded-full mb-5">
            {prepagas.length} prepagas · 15 características · Julio 2026
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Comparador de prepagas<br className="hidden md:block" />
            <span className="text-[#E8002D]"> lado a lado</span>
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Seleccioná hasta 3 prepagas y compará precio, coberturas, red y satisfacción de afiliados en una sola tabla.
          </p>
        </div>
      </section>

      <section className="py-5 bg-white border-b border-gray-100">
        <div className="container">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Comparativas populares:</span>
            {[
              { href: '/comparativas/swiss-medical-vs-osde',   label: 'Swiss Medical vs OSDE' },
              { href: '/comparativas/osde-vs-sancor-salud',    label: 'OSDE vs Sancor' },
              { href: '/comparativas/swiss-medical-vs-medife',  label: 'Swiss Medical vs Medifé' },
              { href: '/comparativas/omint-vs-medicus',         label: 'Omint vs Medicus' },
            ].map((c) => (
              <Link key={c.href} href={c.href}
                className="text-xs font-semibold text-[#E8002D] bg-red-50 border border-red-100 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors">
                {c.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 bg-gray-50">
        <div className="container max-w-5xl mx-auto">
          <ComparadorTable />
        </div>
      </section>

      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-5">Ver detalle por prepaga</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {prepagas.map((p) => (
              <Link key={p.slug} href={`/prepagas/${p.slug}`}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all group">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                  style={{ backgroundColor: p.colorPrimario }}>
                  {p.nombre[0]}
                </div>
                <div className="text-sm font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors truncate">
                  {p.nombre}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <Link href="/precios" className="text-sm font-semibold text-[#E8002D] hover:underline">Ver tabla de precios →</Link>
            <Link href="/calculadora-costo" className="text-sm font-semibold text-[#E8002D] hover:underline">Calculadora por edad →</Link>
            <Link href="/ranking" className="text-sm font-semibold text-[#E8002D] hover:underline">Ranking de prepagas →</Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#E8002D] text-white">
        <div className="container max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">¿Necesitás ayuda para elegir?</h2>
          <p className="text-red-100 mb-7 text-sm">Completá el comparador inteligente y te mostramos la mejor opción para tu perfil.</p>
          <Link href="/#cotizador"
            className="inline-flex items-center justify-center font-bold rounded-xl px-8 py-4 text-base bg-[#00875A] text-white hover:bg-[#006644] transition-colors shadow-sm">
            Cotizar mi prepaga gratis →
          </Link>
        </div>
      </section>
    </>
  )
}
