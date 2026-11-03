import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/utils'
import { estructuraPrepagas, ESTRUCTURA_FECHA, type EstructuraPrepaga } from '@/lib/data/estructura-prepagas'
import AF from '@/lib/data/afiliados-prepagas.json'
import { BreadcrumbSchema } from '@/components/ui/BreadcrumbSchema'
import { BotonCotizarArriba } from '@/components/ui/BotonCotizarArriba'
import { ldJson } from '@/lib/jsonld'

// Prepagas con estructura propia (Darío, 2-nov-2026): sanatorios, centros médicos y
// avión sanitario, cada dato con su fuente (lib/data/estructura-prepagas.ts). Una
// intención = una URL: "prepaga más grande / más afiliados" va en el blog
// /blog/cual-es-la-prepaga-mas-grande-argentina; "qué prepaga atiende en tal
// sanatorio" va en /sanatorios. Esta es "qué prepaga tiene sanatorios propios".

const URL = `${SITE_URL}/prepagas-con-sanatorios-propios`
const porSanatorios = [...estructuraPrepagas].sort((a, b) => b.sanatorios - a.sanatorios || (b.centrosMedicos ?? -1) - (a.centrosMedicos ?? -1))
const conSanatorios = porSanatorios.filter((p) => p.sanatorios > 0)
const sinSanatorios = porSanatorios.filter((p) => p.sanatorios === 0)
const porCentros = [...estructuraPrepagas].filter((p) => (p.centrosMedicos ?? 0) > 0).sort((a, b) => (b.centrosMedicos ?? 0) - (a.centrosMedicos ?? 0))
const conAvion = estructuraPrepagas.filter((p) => p.avionSanitario > 0)
const afiliados = (slug: string) => AF.ranking.find((r) => r.slug === slug)?.usuarios
const miles = (n: number) => n.toLocaleString('es-AR')
const unir = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}` : xs.join(''))
const primera = conSanatorios[0]
const segunda = conSanatorios[1]

const respuesta = `La prepaga con más sanatorios propios es ${primera.nombre}, con ${primera.sanatorios}, además de ${primera.centrosMedicos} centros médicos propios y un avión sanitario propio. La sigue ${segunda.nombre}, con ${segunda.sanatorios} sanatorios. OSDE, la prepaga con más afiliados, no tiene sanatorios propios: trabaja con prestadores de cartilla.`

const faqs = [
  { q: '¿Qué prepaga tiene más sanatorios propios?', a: respuesta },
  {
    q: '¿Qué prepagas tienen sanatorios propios?',
    a: `${unir(conSanatorios.map((p) => `${p.nombre} (${p.sanatorios})`))}. ${unir(sinSanatorios.map((p) => p.nombre))} no tienen sanatorios propios.`,
  },
  {
    q: '¿Qué prepaga tiene avión sanitario?',
    a: conAvion.length
      ? `Entre las prepagas grandes, ${conAvion.map((p) => p.nombre).join(' y ')} ${conAvion.length === 1 ? 'tiene' : 'tienen'} avión sanitario propio, para traslados y urgencias. Las demás de esta lista no informan uno propio.`
      : 'Ninguna de las prepagas de esta lista informa un avión sanitario propio.',
  },
  {
    q: '¿Conviene una prepaga con sanatorios propios?',
    a: 'Tener sanatorios propios le da a la prepaga control sobre turnos, camas y calidad de atención, y no depende de convenios que pueden cambiar. Igual conviene mirar qué sanatorios entran en tu plan y en tu zona: una prepaga sin sanatorios propios puede tener en cartilla los que vos usás.',
  },
]

export const metadata: Metadata = {
  title: { absolute: `Prepagas con sanatorios propios: ranking ${AF.periodo.slice(0, 4)}` },
  description: `${primera.nombre} tiene ${primera.sanatorios} sanatorios propios, ${primera.centrosMedicos} centros médicos y avión sanitario; ${segunda.nombre}, ${segunda.sanatorios}. Ranking de estructura propia de cada prepaga, con fuente.`,
  alternates: { canonical: URL },
}

function Celda({ n, nulo = 'No publica' }: { n: number | null; nulo?: string }) {
  if (n === null) return <span className="text-gray-400">{nulo}</span>
  return n > 0 ? <strong className="text-gray-900">{n}</strong> : <span className="text-gray-400">No tiene</span>
}

function Fuente({ p }: { p: EstructuraPrepaga }) {
  return p.fuente.url
    ? <a href={p.fuente.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#E8002D]">{p.fuente.texto}</a>
    : <span>{p.fuente.texto}</span>
}

export default function Pagina() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Prepagas con sanatorios propios',
      description: respuesta,
      url: URL,
      dateModified: '2026-11-02',
      author: { '@type': 'Organization', name: 'PrepagaYa', url: SITE_URL },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(jsonLd) }} />

      <section className="bg-gradient-to-b from-gray-50 to-white py-12 border-b border-gray-200">
        <div className="container">
          <div className="mb-4">
            <BreadcrumbSchema crumbs={[{ label: 'Ranking', href: '/ranking' }, { label: 'Prepagas con sanatorios propios' }]} />
          </div>
          <span className="inline-block text-xs font-semibold text-[#E8002D] bg-red-50 border border-red-100 rounded-full px-3 py-1 mb-4">
            Estructura propia · {ESTRUCTURA_FECHA}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Prepagas con sanatorios propios</h1>
          <p className="text-gray-600 max-w-2xl leading-relaxed">{respuesta}</p>
          <BotonCotizarArriba desde="sanatorios-propios" className="mt-5" />
        </div>
      </section>

      <div className="container py-12 max-w-3xl mx-auto space-y-12">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Ranking de estructura propia</h2>
          <p className="text-sm text-gray-500 mb-4">
            Sanatorio: con internación. Centro médico: atención ambulatoria (consultas y estudios). Ordenadas por sanatorios propios.
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th scope="col" className="px-3 py-2 font-semibold">Prepaga</th>
                  <th scope="col" className="px-3 py-2 font-semibold text-right">Sanatorios</th>
                  <th scope="col" className="px-3 py-2 font-semibold text-right">Centros médicos</th>
                  <th scope="col" className="px-3 py-2 font-semibold text-right">Avión sanitario</th>
                  <th scope="col" className="px-3 py-2 font-semibold text-right">Afiliados</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {porSanatorios.map((p) => (
                  <tr key={p.slug}>
                    <td className="px-3 py-2 font-medium"><Link href={`/prepagas/${p.slug}`} className="text-gray-900 hover:text-[#E8002D] hover:underline">{p.nombre}</Link></td>
                    <td className="px-3 py-2 text-right tabular-nums"><Celda n={p.sanatorios} /></td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      <Celda n={p.centrosMedicos} />
                      {p.centrosOdontologicos ? <span className="block text-xs text-gray-400">+{p.centrosOdontologicos} odontológico{p.centrosOdontologicos === 1 ? '' : 's'}</span> : null}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{p.avionSanitario > 0 ? <strong className="text-gray-900">Sí</strong> : <span className="text-gray-400">No informa</span>}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-gray-600">{afiliados(p.slug) ? miles(afiliados(p.slug)!) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-3 py-2 text-xs text-gray-400 border-t border-gray-100">
              Estructura: web oficial de cada prepaga ({ESTRUCTURA_FECHA}); el detalle y el enlace de cada una, abajo. Afiliados:{' '}
              <a href={AF.fuenteUrl} target="_blank" rel="noopener noreferrer" className="underline">Superintendencia de Servicios de Salud, {AF.periodoTexto}</a>.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Los sanatorios de cada prepaga</h2>
          <div className="space-y-4">
            {conSanatorios.map((p) => (
              <div key={p.slug} className="rounded-xl border border-gray-100 p-4">
                <h3 className="font-bold text-gray-900">
                  <Link href={`/prepagas/${p.slug}`} className="hover:text-[#E8002D]">{p.nombre}</Link>: {p.sanatorios} sanatorio{p.sanatorios === 1 ? '' : 's'} propio{p.sanatorios === 1 ? '' : 's'}
                </h3>
                {p.sanatoriosNombres && (
                  <p className="text-sm text-gray-600 mt-1">
                    {p.sanatoriosNombres.length < p.sanatorios ? 'Entre ellos: ' : ''}{p.sanatoriosNombres.join(', ')}.
                  </p>
                )}
                {p.nota && <p className="text-sm text-gray-500 mt-1">{p.nota}</p>}
                <p className="text-xs text-gray-400 mt-2">Fuente: <Fuente p={p} /></p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Prepagas con más centros médicos propios</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Los centros médicos propios son para consultas, estudios y controles, sin internación.{' '}
            {porCentros.map((p) => `${p.nombre} tiene ${p.centrosMedicos}`).join('; ')}.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Prepagas sin sanatorios propios</h2>
          <ul className="space-y-2">
            {sinSanatorios.map((p) => (
              <li key={p.slug} className="text-sm text-gray-600">
                <Link href={`/prepagas/${p.slug}`} className="font-semibold text-gray-900 hover:text-[#E8002D]">{p.nombre}</Link>: {p.nota}{' '}
                <span className="text-xs text-gray-400">(Fuente: <Fuente p={p} />)</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-500 mt-3">
            Para saber qué prepaga atiende en un sanatorio puntual, buscalo en <Link href="/sanatorios" className="underline hover:text-[#E8002D]">qué prepagas atienden en cada sanatorio</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold text-gray-900">{f.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mt-1">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-gray-50 border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Seguí comparando</h2>
          <ul className="text-sm space-y-1.5">
            <li><Link href="/blog/cual-es-la-prepaga-mas-grande-argentina" className="text-[#E8002D] hover:underline">La prepaga más grande de Argentina: ranking por afiliados</Link></li>
            <li><Link href="/ranking" className="text-[#E8002D] hover:underline">Cuál es la mejor prepaga</Link></li>
            <li><Link href="/sanatorios" className="text-[#E8002D] hover:underline">Qué prepagas atienden en cada sanatorio</Link></li>
            <li><Link href="/comparar" className="text-[#E8002D] hover:underline">Comparar prepagas lado a lado</Link></li>
          </ul>
        </section>
      </div>
    </>
  )
}
