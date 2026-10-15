import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { AUMENTOS_OFICIALES, ultimoMesOficial, slugMesAumento, periodoDeSlugAumento } from '@/lib/data/aumentos'
import { SITE_URL } from '@/lib/utils'
import { CtaMedio } from '@/components/ui/CtaMedio'
import { AvisoAumento } from '@/components/aumentos/AvisoAumento'
import { ldJson } from '@/lib/jsonld'

// Archivo mensual de aumentos (14-oct-2026, keyword research: "aumento
// prepagas mayo 2026", "aumento prepagas septiembre 2025"… 39 variantes con
// el mes). Solo meses con dato OFICIAL (cuadros tarifarios SSSalud). El mes
// en curso vive en /aumentos (no se duplica): su URL de archivo redirige ahí.

const slugDe = slugMesAumento
const periodoDe = periodoDeSlugAumento
const PERIODOS = Object.keys(AUMENTOS_OFICIALES.meses).sort()
const ACTUAL = ultimoMesOficial()?.periodo

type Props = { params: Promise<{ mes: string }> }

export function generateStaticParams() {
  return PERIODOS.filter((p) => p !== ACTUAL).map((p) => ({ mes: slugDe(p) }))
}

function datos(slug: string) {
  const periodo = periodoDe(slug)
  if (!periodo) return null
  const m = AUMENTOS_OFICIALES.meses[periodo]
  if (!m) return null
  const ranking = Object.entries(m.prepagas).map(([s, v]) => ({ slug: s, ...v })).sort((a, b) => a.mediana - b.mediana)
  const i = PERIODOS.indexOf(periodo)
  const previo = i > 0 ? { periodo: PERIODOS[i - 1], ...AUMENTOS_OFICIALES.meses[PERIODOS[i - 1]] } : null
  const siguiente = i < PERIODOS.length - 1 ? PERIODOS[i + 1] : null
  return { periodo, m, ranking, previo, siguiente }
}

const pct = (n: number) => `${n.toLocaleString('es-AR')}%`

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { mes } = await params
  const d = datos(mes)
  if (!d) return {}
  const label = d.m.label.toLowerCase()
  return {
    title: `Aumento de prepagas en ${label}: ${pct(d.m.promedio)} promedio y por prepaga`,
    description: `Cuánto aumentaron las prepagas en ${label} según sus cuadros tarifarios oficiales ante la SSSalud: ${pct(d.m.promedio)} promedio, de ${pct(d.ranking[0].mediana)} (${d.ranking[0].nombre}) a ${pct(d.ranking[d.ranking.length - 1].mediana)} (${d.ranking[d.ranking.length - 1].nombre}).`,
    alternates: { canonical: `${SITE_URL}/aumentos/${mes}` },
  }
}

export default async function AumentoMesPage({ params }: Props) {
  const { mes } = await params
  const periodo = periodoDe(mes)
  if (periodo && periodo === ACTUAL) redirect('/aumentos')
  const d = datos(mes)
  if (!d) notFound()
  const { m, ranking, previo, siguiente } = d
  const label = m.label.toLowerCase()
  const menos = ranking[0]
  const mas = ranking[ranking.length - 1]

  const faqs = [
    {
      q: `¿Cuánto aumentaron las prepagas en ${label}?`,
      a: `El promedio fue ${pct(m.promedio)} entre las ${ranking.length} prepagas que relevamos en los cuadros tarifarios oficiales de la Superintendencia de Servicios de Salud. ${previo ? `En ${previo.label.toLowerCase()} había sido ${pct(previo.promedio)}.` : ''}`,
    },
    {
      q: `¿Qué prepaga aumentó menos en ${label}?`,
      a: `${menos.nombre}, con ${pct(menos.mediana)}. La que más aumentó fue ${mas.nombre}, con ${pct(mas.mediana)}.`,
    },
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: `Aumento de prepagas en ${label}`,
      description: `Aumento mensual de cada prepaga en ${label}, calculado sobre los cuadros tarifarios oficiales.`,
      url: `${SITE_URL}/aumentos/${mes}`,
      creator: { '@type': 'Organization', name: 'PrepagaYa', url: SITE_URL },
      isBasedOn: AUMENTOS_OFICIALES.fuenteUrl,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Aumentos', item: `${SITE_URL}/aumentos` },
        { '@type': 'ListItem', position: 3, name: m.label, item: `${SITE_URL}/aumentos/${mes}` },
      ],
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(jsonLd) }} />
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-10">
        <div className="container max-w-3xl mx-auto">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-[#E8002D]">PrepagaYa</Link> › <Link href="/aumentos" className="hover:text-[#E8002D]">Aumentos</Link> › {m.label}
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 text-balance">Aumento de prepagas en {label}</h1>
          <p className="text-gray-700 mt-3 leading-relaxed">
            En {label} las prepagas aumentaron <strong>{pct(m.promedio)}</strong> en promedio, según los cuadros tarifarios que cada una declara ante la Superintendencia de Servicios de Salud.
            La que menos subió fue <strong>{menos.nombre} ({pct(menos.mediana)})</strong> y la que más, <strong>{mas.nombre} ({pct(mas.mediana)})</strong>.
            {previo && <> En {previo.label.toLowerCase()} el promedio había sido {pct(previo.promedio)}.</>}
          </p>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Aumento de cada prepaga en {label}</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-3">Prepaga</th>
                  <th className="text-right px-4 py-3">Aumento</th>
                  <th className="text-right px-4 py-3">Rango por plan</th>
                  {previo && <th className="text-right px-4 py-3">{previo.label.split(' ')[0]}</th>}
                </tr>
              </thead>
              <tbody>
                {ranking.map((r) => (
                  <tr key={r.slug} className="border-t border-gray-100">
                    <td className="px-4 py-3"><Link href={`/prepagas/${r.slug}`} className="font-semibold text-gray-900 hover:text-[#E8002D]">{r.nombre}</Link></td>
                    <td className="px-4 py-3 text-right font-bold tabular-nums">{pct(r.mediana)}</td>
                    <td className="px-4 py-3 text-right text-gray-500 tabular-nums whitespace-nowrap">{r.minimo === r.maximo ? '—' : `${pct(r.minimo)} a ${pct(r.maximo)}`}</td>
                    {previo && <td className="px-4 py-3 text-right text-gray-500 tabular-nums">{previo.prepagas[r.slug] ? pct(previo.prepagas[r.slug].mediana) : '—'}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Fuente: <a href={AUMENTOS_OFICIALES.fuenteUrl} target="_blank" rel="noopener noreferrer" className="underline">{AUMENTOS_OFICIALES.fuente}</a>. Aumento de cada prepaga = mediana de la variación de todos sus planes, regiones y edades entre un mes y el anterior.
          </p>
        </div>
      </section>

      <section className="py-6 bg-white">
        <div className="container max-w-3xl mx-auto"><AvisoAumento /></div>
      </section>

      <CtaMedio titulo="¿Te aumentó la prepaga? Mirá cuánto pagarías en otra" texto="Cotizá gratis y sin DNI: el precio oficial de cada plan para tu edad y zona, con 15% de descuento." />

      <section className="py-8 bg-white">
        <div className="container max-w-3xl mx-auto space-y-3">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Preguntas frecuentes</h2>
          {faqs.map((f) => (
            <div key={f.q} className="rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 text-sm">{f.q}</h3>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">{f.a}</p>
            </div>
          ))}
          <div className="flex flex-wrap gap-2 pt-4">
            {previo && previo.periodo !== ACTUAL && <Link href={`/aumentos/${slugDe(previo.periodo)}`} className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-[#E8002D] hover:text-[#E8002D]">← {previo.label}</Link>}
            {siguiente && <Link href={siguiente === ACTUAL ? '/aumentos' : `/aumentos/${slugDe(siguiente)}`} className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-[#E8002D] hover:text-[#E8002D]">{AUMENTOS_OFICIALES.meses[siguiente].label} →</Link>}
            <Link href="/aumentos" className="rounded-full bg-[#E8002D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#B8001F]">Aumento de este mes</Link>
          </div>
        </div>
      </section>
    </>
  )
}
