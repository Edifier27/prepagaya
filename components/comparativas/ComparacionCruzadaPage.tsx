import Link from 'next/link'
import { comparacionCruzada } from '@/lib/comparativas-cruzadas'
import { PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL, formatPrecio } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'
import { BarraCotizar } from '@/components/prepagas/BarraCotizar'
import { ldJson } from '@/lib/jsonld'

type Comp = NonNullable<ReturnType<typeof comparacionCruzada>>

// Página "Swiss Medical SMG20 vs OSDE 310" (11-oct-2026). Ver
// lib/comparativas-cruzadas.ts: todo sale de los cuadros SSSalud y las
// cartillas oficiales.
export function ComparacionCruzadaPage({ c }: { c: Comp }) {
  const { a, b, precios } = c
  const mes = PRECIO_ACTUALIZADO.toLowerCase()
  // Qué plan sale menos en cada edad de la tabla, dicho tal cual
  const conDato = precios.filter((x) => x.a !== null && x.b !== null)
  const edadesA = conDato.filter((x) => x.a! <= x.b!).map((x) => x.edad)
  const edadesB = conDato.filter((x) => x.b! < x.a!).map((x) => x.edad)
  const listaEdades = (xs: number[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs.at(-1)}` : `${xs[0]}`)
  const veredicto = [
    edadesA.length ? `Por precio, el ${a.nombre} sale menos a los ${listaEdades(edadesA)} años.` : '',
    edadesB.length ? `El ${b.nombre} sale menos a los ${listaEdades(edadesB)} años, según su cuadro oficial.` : '',
    a.plan.copago === false && b.plan.copago ? `Además, el ${a.nombre} no tiene copago en consultas y el ${b.nombre} sí.` : '',
    'Antes de decidir, fijate que tus sanatorios estén en la cartilla del plan: el link de cada uno lleva a la cartilla oficial por zona.',
  ].filter(Boolean).join(' ')
  const comparadorHref = `/comparador?${new URLSearchParams({ prepaga: b.prep.slug, plan: b.plan.slug, desde: 'comparativa' })}`

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: c.titulo,
      description: c.descripcion,
      url: `${SITE_URL}/comparativas/${c.par.slug}`,
      inLanguage: 'es-AR',
      author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Comparativas', item: `${SITE_URL}/comparativas` },
        { '@type': 'ListItem', position: 3, name: `${a.nombre} vs ${b.nombre}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: c.faq.map(({ q, a: r }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: r } })),
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(jsonLd) }} />
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-[#E8002D]">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <Link href="/comparativas" className="hover:text-[#E8002D]">Comparativas</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">{a.nombre} vs {b.nombre}</span>
          </nav>
        </div>
      </div>

      <section className="bg-gradient-to-b from-red-50 to-white border-b border-gray-100 py-10">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <PrepagaLogo slug={a.prep.slug} nombre={a.prep.nombre} colorPrimario={a.prep.colorPrimario} size="sm" />
            <span className="text-sm font-black text-gray-400">VS</span>
            <PrepagaLogo slug={b.prep.slug} nombre={b.prep.nombre} colorPrimario={b.prep.colorPrimario} size="sm" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">{a.nombre} vs {b.nombre}: ¿cuál conviene?</h1>
          <p className="text-gray-700 leading-relaxed mt-4"><strong>Respuesta corta:</strong> {c.respuestaCorta}</p>
          <div className="mt-5 flex flex-col sm:flex-row gap-2">
            <Link href={comparadorHref} className="inline-flex items-center justify-center px-5 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm">
              Ver el precio de los dos a mi edad →
            </Link>
            <Link href={`/prepagas/${a.prep.slug}/${a.plan.slug}`} className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-800 hover:border-[#E8002D] hover:text-[#E8002D]">
              Todo sobre el {a.nombre}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Precio por edad</h2>
          <p className="text-sm text-gray-500 mb-4">Lista oficial de {mes} declarada ante la Superintendencia de Servicios de Salud: CABA y GBA, por persona, contratación directa, IVA incluido. En verde, el más barato de cada edad.</p>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-[13px] sm:text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-3 py-2">Edad</th>
                  <th className="text-right px-3 py-2">{a.nombre}</th>
                  <th className="text-right px-3 py-2">{b.nombre}</th>
                </tr>
              </thead>
              <tbody>
                {precios.map((x) => {
                  const ganaA = x.a !== null && x.b !== null && x.a <= x.b
                  const ganaB = x.a !== null && x.b !== null && x.b < x.a
                  return (
                    <tr key={x.edad} className="border-t border-gray-100">
                      <td className="px-3 py-2 text-gray-700">{x.edad} años</td>
                      <td className={`px-3 py-2 text-right tabular-nums whitespace-nowrap ${ganaA ? 'font-bold text-emerald-700 bg-emerald-50' : 'text-gray-900'}`}>{x.a === null ? '—' : formatPrecio(x.a)}</td>
                      <td className={`px-3 py-2 text-right tabular-nums whitespace-nowrap ${ganaB ? 'font-bold text-emerald-700 bg-emerald-50' : 'text-gray-900'}`}>{x.b === null ? '—' : formatPrecio(x.b)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">Cotizando online tenés 15% OFF sobre estos valores (25% si sos monotributista).</p>
        </div>
      </section>

      <section className="py-10 bg-gray-50 border-y border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Copago y cartilla</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[a, b].map((l) => (
              <div key={l.nombre} className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="font-bold text-gray-900">{l.nombre}</div>
                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                  <li>{l.plan.copago ? 'Con copago en consultas' : 'Sin copago en consultas'}</li>
                  {c.conSanatorios && <li>{l.sanatorios.length} sanatorios con internación en CABA (cartilla oficial)</li>}
                </ul>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                  {l.cartillaHref && <Link href={l.cartillaHref} className="text-sm font-semibold text-[#E8002D] hover:underline">Ver la cartilla →</Link>}
                  <Link href={`/prepagas/${l.prep.slug}/${l.plan.slug}`} className="text-sm font-semibold text-[#E8002D] hover:underline">Qué cubre →</Link>
                </div>
              </div>
            ))}
          </div>
          {c.conSanatorios && c.soloA.length > 0 && (
            <p className="text-sm text-gray-700 mt-4">
              <strong>Solo en el {a.nombre}</strong> (internación en CABA): {c.soloA.slice(0, 10).join(', ')}.
            </p>
          )}
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-2">¿Cuál conviene?</h2>
          <p className="text-gray-700 leading-relaxed">{veredicto}</p>
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {c.faq.map((x) => (
              <div key={x.q}>
                <h3 className="font-semibold text-gray-900">{x.q}</h3>
                <p className="text-sm text-gray-700 leading-relaxed mt-1">{x.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#E8002D] text-white">
        <div className="container max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">¿Querés ver los dos con tu edad exacta?</h2>
          <p className="text-red-100 text-sm mb-6">Te mostramos el precio de los dos planes para tu grupo, con 15% OFF online. Gratis y sin DNI.</p>
          <Link href={comparadorHref} className="inline-flex items-center justify-center px-6 py-3.5 bg-white text-[#E8002D] font-bold rounded-2xl hover:bg-red-50 shadow-lg text-sm">
            Comparar a mi edad →
          </Link>
        </div>
      </section>
      <BarraCotizar titulo={`${a.nombre} o ${b.nombre}`} origen={`comparativa:${c.par.slug}`} href={comparadorHref.replace('desde=comparativa', 'desde=barra')} />
    </>
  )
}
