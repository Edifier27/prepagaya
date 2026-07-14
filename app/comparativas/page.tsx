import type { Metadata } from 'next'
import Link from 'next/link'
import { comparativas } from '@/lib/data/comparativas'
import { prepagas } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { SelectorComparativo } from '@/components/comparativas/SelectorComparativo'

export const metadata: Metadata = {
  title: 'Comparativas de Prepagas 2026 — Swiss Medical vs OSDE y más',
  description: 'Elegí dos prepagas y comparalas al instante: precio, red de prestadores, satisfacción y veredicto. Swiss Medical vs OSDE, Sancor vs OSDE y más.',
  alternates: { canonical: `${SITE_URL}/comparativas` },
}

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Comparativas de prepagas Argentina',
  numberOfItems: comparativas.length,
  itemListElement: comparativas.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.titulo,
    url: `${SITE_URL}/comparativas/${c.slug}`,
  })),
}

export default function ComparativasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-10 border-b border-gray-100">
        <div className="container max-w-3xl">
          <nav className="text-sm text-gray-400 mb-4 flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#E8002D]">{SITE_NAME}</Link>
            <span>›</span>
            <span className="text-gray-900">Comparativas</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Comparar prepagas Argentina 2026
          </h1>
          <p className="text-gray-500 text-base max-w-xl">
            Elegí dos prepagas y te mostramos la comparación al instante — precio, red, satisfacción y veredicto.
          </p>
        </div>
      </section>

      {/* Selector interactivo */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="container max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#E8002D" strokeWidth={2} strokeLinecap="round" className="w-4 h-4">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Comparador interactivo</h2>
              <p className="text-xs text-gray-400">3 pasos · resultado instantáneo</p>
            </div>
          </div>
          <SelectorComparativo />
        </div>
      </section>

      {/* Grilla de comparativas existentes */}
      <section className="py-10 bg-gray-50">
        <div className="container">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Análisis completos publicados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comparativas.map((c) => {
              const p1 = prepagas.find((p) => p.slug === c.prepaga1Slug)
              const p2 = prepagas.find((p) => p.slug === c.prepaga2Slug)
              if (!p1 || !p2) return null
              const colors1 = { bg: '#DBEAFE', text: '#1E3A8A' }
              const colors2 = { bg: '#D1FAE5', text: '#065F46' }
              return (
                <Link
                  key={c.slug}
                  href={`/comparativas/${c.slug}`}
                  className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-red-200 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                      style={{ backgroundColor: p1.colorPrimario + '22', color: p1.colorPrimario }}
                    >
                      {p1.nombre[0]}
                    </div>
                    <span className="text-gray-300 font-bold text-xs">VS</span>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                      style={{ backgroundColor: p2.colorPrimario + '22', color: p2.colorPrimario }}
                    >
                      {p2.nombre[0]}
                    </div>
                    <span className="font-bold text-gray-900 text-sm group-hover:text-[#E8002D] transition-colors leading-tight">
                      {p1.nombre} vs {p2.nombre}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{c.descripcion}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                    <span>{p1.satisfaccion}% · {p2.satisfaccion}% satisf.</span>
                    <span className="text-[#E8002D] font-semibold group-hover:underline">Ver análisis →</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Guía */}
      <section className="py-10 border-t border-gray-100">
        <div className="container max-w-3xl">
          <h2 className="text-lg font-bold text-gray-900 mb-5">¿Cómo comparar prepagas correctamente?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { n: '1', t: 'Compará precio para TU edad', d: 'El precio base es para 30 años. A los 50 pagás hasta 1.9x más. Usá la calculadora de costo para tu perfil exacto.' },
              { n: '2', t: 'Analizá el costo real con copagos', d: 'Un plan "sin copago" puede ser más caro en total si usás poco el sistema. Calculá tus consultas por año.' },
              { n: '3', t: 'Verificá la red en tu zona', d: '90.000 profesionales no sirven si en tu barrio solo hay 3. Revisá la cartilla local antes de firmar.' },
              { n: '4', t: 'Priorizá tus coberturas clave', d: 'Si necesitás psicología, maternidad u odontología, verificá esas coberturas antes de decidir.' },
            ].map((item) => (
              <div key={item.n} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-3">
                <div className="w-6 h-6 bg-[#E8002D] rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{item.n}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.t}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
