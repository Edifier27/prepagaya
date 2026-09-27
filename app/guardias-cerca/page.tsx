import type { Metadata } from 'next'
import Link from 'next/link'
import { GuardiasCercaConParametros } from '@/components/herramientas/GuardiasCerca'
import { resumenGuardias } from '@/lib/data/guardias-cerca'
import { CARTILLAS, textoFecha } from '@/lib/data/cartilla-zonas'
import { SITE_NAME, SITE_URL, OG_IMAGE } from '@/lib/utils'

// "¿Dónde me atiendo?" (27-sep-2026, segunda herramienta de búsqueda que
// aprobó Darío): con la ubicación del celular, las guardias y los sanatorios
// de las cartillas oficiales más cercanos, y qué prepaga y plan los cubre.
// Apunta a "guardia cerca", "guardia [prepaga] cerca de mi" y a la gente que
// busca la cartilla para saber adónde ir.

const URL = `${SITE_URL}/guardias-cerca`
const TITULO = 'Guardias cerca tuyo según tu prepaga: OSDE, Swiss Medical y más'
const DESCRIPCION = 'Con tu ubicación, mirá las guardias y los sanatorios más cercanos de tu prepaga y tu plan, según las cartillas oficiales de Swiss Medical, OSDE, Sancor Salud, Avalian y Premedic.'
const FECHA_GUARDIAS = '2026-09-27'

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: URL },
  keywords: ['guardia cerca', 'guardias cerca de mi', 'guardia osde cerca', 'guardia swiss medical cerca', 'donde me atiendo con mi prepaga', 'sanatorio cerca de mi prepaga', 'guardia sancor salud', 'guardia avalian', 'guardia premedic'],
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'website', images: [OG_IMAGE] },
}

const faqs = [
  {
    q: '¿A qué guardia puedo ir con mi prepaga?',
    a: 'A las que figuran en la cartilla de tu prepaga para tu plan. Cada prepaga publica su cartilla con los centros de guardia y de internación, y no todos los planes tienen los mismos: por eso el buscador te deja elegir el plan.',
  },
  {
    q: '¿Qué hago si es una emergencia?',
    a: 'Llamá al 107 (emergencias médicas) o al 911. El buscador sirve para saber adónde ir cuando no es una emergencia que requiera ambulancia.',
  },
  {
    q: '¿Guardan mi ubicación?',
    a: 'No. La ubicación se usa solo en tu navegador para calcular las distancias: no se manda a ningún lado. Si no querés compartirla, podés escribir tu barrio o localidad.',
  },
  {
    q: '¿De dónde salen los datos?',
    a: 'De las cartillas oficiales de cada prepaga (la fecha de cada una está al pie del buscador). Las direcciones se ubicaron en el mapa con Georef, el servicio oficial de direcciones del Estado, y con OpenStreetMap; cuando una dirección no se pudo ubicar con precisión, el lugar se muestra en el centro de su localidad y lo aclaramos. La distancia es en línea recta.',
  },
  {
    q: '¿Por qué no aparecen médicos ni consultorios?',
    a: 'A propósito: solo mostramos guardias y sanatorios de internación, que es lo que está en las cartillas oficiales por zona. Para médicos particulares, usá la cartilla de tu prepaga.',
  },
]

export default function GuardiasCercaPage() {
  const resumen = resumenGuardias()
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: '¿Dónde me atiendo? Guardias cerca según tu prepaga',
      url: URL,
      description: DESCRIPCION,
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web',
      inLanguage: 'es-AR',
      dateModified: FECHA_GUARDIAS,
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'ARS' },
      provider: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Cartillas', item: `${SITE_URL}/cartillas` },
        { '@type': 'ListItem', position: 3, name: 'Guardias cerca' },
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
            <Link href="/cartillas" className="hover:text-[#E8002D]">Cartillas</Link>
            <span className="mx-2 text-gray-300">›</span>
            <span className="text-gray-700">Guardias cerca</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">¿Dónde me atiendo? Guardias cerca tuyo según tu prepaga</h1>
          <p className="text-gray-700 mt-3 mb-6 leading-relaxed">
            Elegí tu prepaga y tu plan, y con tu ubicación te mostramos las guardias y los sanatorios de la cartilla oficial más cercanos, con la dirección, cómo llegar y el teléfono.
          </p>
          <GuardiasCercaConParametros />
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-3xl! mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Guardias y sanatorios por prepaga</h2>
          <p className="text-sm text-gray-600 mb-4">Lugares de atención de cada cartilla oficial en todo el país. Para verlos zona por zona, entrá a la cartilla de cada prepaga.</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {resumen.map((r) => (
              <li key={r.slug} className="rounded-2xl border border-gray-200 p-4">
                <Link href={`/cartillas/${r.slug}`} className="font-bold text-gray-900 hover:text-[#E8002D]">Cartilla de {r.nombre} →</Link>
                <p className="mt-1 text-sm text-gray-600">{r.guardias} lugares con guardia y {r.internacion} con internación.</p>
                <p className="mt-0.5 text-xs text-gray-400">{CARTILLAS[r.slug] ? textoFecha(CARTILLAS[r.slug]) : ''}</p>
                <Link href={`/guardias-cerca?prepaga=${r.slug}`} className="mt-2 inline-block text-sm font-semibold text-[#E8002D] hover:underline">Guardias de {r.nombre} cerca tuyo</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-3xl! mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Preguntas frecuentes</h2>
          <div className="space-y-2">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group rounded-xl border border-gray-200 bg-white">
                <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                  <h3 className="font-semibold text-sm text-gray-900 m-0">{q}</h3>
                  <svg className="w-4 h-4 text-gray-400 shrink-0 ml-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{a}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-600">
            ¿Querés saber cómo funciona la guardia con prepaga? Leé{' '}
            <Link href="/guias/urgencias-guardia-prepaga" className="font-semibold text-[#E8002D] hover:underline">guardia y urgencias con prepaga</Link>.
          </p>
        </div>
      </section>
    </>
  )
}
