import type { Metadata } from 'next'
import Link from 'next/link'
import { prepagas, PRECIO_ACTUALIZADO, nivelPrecio } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL, formatPrecio } from '@/lib/utils'
import { NivelPrecioBadge } from '@/components/ui/NivelPrecioBadge'
import { Button } from '@/components/ui/Button'
import { BreadcrumbSchema } from '@/components/ui/BreadcrumbSchema'

export const metadata: Metadata = {
  title: `Prepagas Económicas Argentina: Ranking ${PRECIO_ACTUALIZADO} — ${SITE_NAME}`,
  description: `Ranking de las prepagas más baratas de Argentina, ordenadas por precio real. Desde ${formatPrecio(109000)}/mes con cobertura PMO completa. Actualizado ${PRECIO_ACTUALIZADO}.`,
  alternates: { canonical: `${SITE_URL}/prepagas-economicas` },
  keywords: ['prepagas economicas', 'ranking de prepagas economicas', 'prepaga mas barata argentina', 'prepagas baratas 2026', 'prepaga economica buena'],
}

// Ranking real por precio del plan más económico de cada prepaga — mismos
// datos que /ranking, filtrados a nivel "económico" y con su propia URL y
// título enfocados en la keyword (700 búsquedas/mes, rankeaba mal como
// sección enterrada dentro de /ranking — pedido de Darío, 21-sep-2026).
const rankingPrecio = [...prepagas]
  .map((p) => ({ prep: p, planMinimo: [...p.planes].sort((a, b) => a.precio - b.precio)[0] }))
  .sort((a, b) => a.planMinimo.precio - b.planMinimo.precio)

const economicas = rankingPrecio.filter((r) => nivelPrecio(r.planMinimo.precio) === 'economico')
const masBarata = rankingPrecio[0]
const swissMedical = prepagas.find((p) => p.slug === 'swiss-medical')!
const swissS1 = swissMedical.planes.find((p) => p.slug === 's1')!
const swissS2 = swissMedical.planes.find((p) => p.slug === 's2')!

const faqs = [
  {
    q: '¿Cuál es la prepaga más barata de Argentina?',
    a: `${masBarata.prep.nombre}, con el ${masBarata.planMinimo.nombre}, es la de precio de lista más accesible del mercado (${PRECIO_ACTUALIZADO}), desde ${formatPrecio(masBarata.planMinimo.precio)}/mes para una persona. El precio exacto varía por edad y zona — cotizalo gratis para ver el tuyo.`,
  },
  {
    q: '¿Las prepagas baratas cubren internación y oncología?',
    a: 'Sí. El PMO obliga por ley a todas las prepagas a cubrir internación sin límite de días, tratamientos oncológicos al 100% y urgencias, sin importar el precio del plan. La diferencia entre un plan económico y uno premium está en la cartilla, los copagos y las prestaciones superadoras — nunca en el PMO.',
  },
  {
    q: '¿Qué se resigna en una prepaga económica?',
    a: 'Principalmente tres cosas: cartilla más chica (menos especialistas y sanatorios para elegir), copagos en consultas y estudios, y cobertura geográfica más acotada que las prepagas grandes. Lo que no se resigna es el piso legal del PMO.',
  },
  {
    q: '¿Conviene una prepaga económica o quedarse en la obra social?',
    a: 'Si tu obra social tiene buena red en tu zona, quedarte ahí no tiene costo adicional. Pasarte a una prepaga económica conviene cuando tu obra social está saturada o tiene mala cartilla, y buscás turnos más rápidos sin pagar un plan premium.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Ranking de Prepagas Económicas Argentina ${PRECIO_ACTUALIZADO}`,
    description: 'Ranking de las prepagas más baratas de Argentina por precio de lista.',
    numberOfItems: economicas.length,
    itemListElement: economicas.map((r, i) => ({
      '@type': 'ListItem', position: i + 1, name: r.prep.nombre, url: `${SITE_URL}/prepagas/${r.prep.slug}`,
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  },
]

export default function PrepagasEconomicasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-gradient-to-b from-gray-50 to-white py-12 border-b border-gray-200">
        <div className="container">
          <div className="mb-4">
            <BreadcrumbSchema crumbs={[{ label: 'Prepagas económicas' }]} />
          </div>
          <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 mb-4">
            Ranking por precio · {PRECIO_ACTUALIZADO}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Prepagas económicas: ranking actualizado
          </h1>
          <p className="text-gray-600 max-w-2xl leading-relaxed">
            Una prepaga no tiene por qué costar medio millón de pesos: hoy hay opciones desde{' '}
            <strong>{formatPrecio(masBarata.planMinimo.precio)}/mes</strong> que cubren el PMO completo, el mismo piso legal que cubre el plan más caro del mercado. La diferencia está en la cartilla, los sanatorios y los copagos — no en la cobertura que exige la ley.
          </p>
        </div>
      </section>

      <div className="container py-12 max-w-3xl mx-auto">
        {/* Ranking */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-1">El podio de precios</h2>
          <p className="text-sm text-gray-500 mb-6">Ordenadas por precio de lista del plan más económico de cada prepaga, individual, {PRECIO_ACTUALIZADO}.</p>
          <div className="space-y-3">
            {rankingPrecio.slice(0, 10).map((r, i) => (
              <Link
                key={r.prep.slug}
                href={`/prepagas/${r.prep.slug}`}
                className="flex items-center gap-4 bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md hover:border-red-200 transition-all group"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold border flex-shrink-0 text-sm ${
                  i === 0 ? 'bg-amber-100 text-amber-700 border-amber-200' : i === 1 ? 'bg-gray-100 text-gray-600 border-gray-200' : i === 2 ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-gray-50 text-gray-500 border-gray-100'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900 group-hover:text-[#E8002D] transition-colors">{r.prep.nombre}</h3>
                    {i === 0 && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">Más económica</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{r.planMinimo.nombre} · {r.planMinimo.copago ? 'Con copago' : 'Sin copago'}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-gray-900">{formatPrecio(r.planMinimo.precio)}</div>
                  <NivelPrecioBadge nivel={nivelPrecio(r.planMinimo.precio)} />
                </div>
              </Link>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Precios de lista para una persona, {PRECIO_ACTUALIZADO}. Con 25% de descuento por contratación online el valor baja más — cotizá tu precio exacto según tu edad y zona.
          </p>
        </section>

        {/* Entrada accesible a premium */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-1">¿Preferís quedarte en una prepaga premium pagando lo menos posible?</h2>
          <p className="text-sm text-gray-500 mb-6">
            {swissMedical.nombre} S1 y S2 no son los planes más baratos del mercado — esos son los del ranking de arriba — pero sí el escalón de entrada más accesible dentro de una prepaga con sanatorios propios y cartilla premium.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[swissS1, swissS2].map((plan) => (
              <Link key={plan.slug} href={`/prepagas/swiss-medical/${plan.slug}`}
                className="bg-white rounded-2xl border border-gray-200 p-4 hover:border-red-200 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
                  <span className="font-bold text-gray-900">{swissMedical.nombre} {plan.nombre}</span>
                  <span className="text-sm font-bold text-[#E8002D]">{formatPrecio(plan.precio)}/mes</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{plan.descripcion}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Qué resignás */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Qué resignás en una prepaga económica (y qué no)</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Tres cosas, principalmente: cartilla más chica (menos opciones de especialistas y sanatorios), copagos en consultas y estudios, y cobertura geográfica más acotada que las prepagas grandes — varias de las opciones más económicas concentran su red en CABA, GBA y algunas capitales de provincia.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Lo que <strong>no</strong> resignás es el PMO: internación sin límite de días, oncología al 100%, maternidad y urgencias están cubiertos por ley igual que en un plan premium. La cobertura mínima es idéntica; lo que cambia con el precio es todo lo que está por encima de ese piso.
          </p>
        </section>

        {/* Para quién */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Para quién tiene sentido una prepaga económica</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Son ideales para jóvenes sanos que quieren cobertura real sin pagar una red premium que no usan, monotributistas de categorías bajas, y como cobertura puente mientras mejorás ingresos.
          </p>
          <p className="text-gray-600 leading-relaxed">
            No son la mejor opción si tenés una condición crónica que requiere especialistas frecuentes, si vivís fuera de la zona de cobertura de la empresa, o si priorizás pediatría con turnos inmediatos para hijos chicos.
          </p>
        </section>

        {/* El truco */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3">El truco para bajar el precio sin bajar de prepaga</h2>
          <p className="text-gray-600 leading-relaxed">
            Antes de cambiarte a una prepaga más barata, mirá el plan de entrada de tu prepaga actual: bajar de plan dentro de la misma empresa conserva tu antigüedad y tu historia clínica. También compará la modalidad de pago — si estás como particular y podés derivar aportes (relación de dependencia o monotributo), el mismo plan puede bajar 30-40%.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
          <div className="space-y-2">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-sm text-gray-900 select-none list-none">
                  <h3 className="font-semibold text-sm text-gray-900 m-0">{q}</h3>
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* Cross-links */}
        <div className="flex flex-wrap gap-3 mb-10 text-sm">
          <Link href="/guias/prepagas-economicas" className="text-[#E8002D] font-semibold hover:underline">
            → Guía completa: las prepagas más económicas en detalle
          </Link>
          <Link href="/ranking" className="text-[#E8002D] font-semibold hover:underline">
            → Ver el ranking general por satisfacción
          </Link>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">¿Cuál de estas te conviene a vos?</h2>
          <p className="text-red-100 mb-6">
            El precio de lista es orientativo — tu precio exacto depende de tu edad, tu zona y tu grupo familiar. Cotizalo gratis.
          </p>
          <Button href="/comparador" variant="secondary" size="lg">
            Cotizar gratis en 2 minutos →
          </Button>
        </div>
      </div>
    </>
  )
}
