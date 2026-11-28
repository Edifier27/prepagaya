import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { ldJson } from '@/lib/jsonld'
import { operacionesClinicas, cierresClinicas, OPERACIONES_ACTUALIZADO, type FuenteNota } from '@/lib/data/operaciones-clinicas'
import { SANATORIOS_SEO } from '@/lib/data/sanatorios-seo'
import AF from '@/lib/data/afiliados-prepagas.json'
import { BotonCotizarArriba } from '@/components/ui/BotonCotizarArriba'

// Informe (28-nov-2026, pedido de Darío): las prepagas y los grupos de salud
// compran clínicas en crisis. Dueño de "quién compró [clínica]", "[clínica] es
// de swiss medical", "dueño de [prepaga/grupo]" y "cerró la clínica…". Cada
// operación con fecha y fuente (lib/data/operaciones-clinicas.ts). La pregunta
// "qué prepaga atiende en [clínica]" sigue siendo de /sanatorios/[slug].

const URL = `${SITE_URL}/prensa/clinicas-compradas-por-prepagas`
const TITULO = 'Clínicas compradas por prepagas: quién compró qué (2021-2026)'
const ops = [...operacionesClinicas].sort((a, b) => b.mes.localeCompare(a.mes))
const swiss = ops.filter((o) => o.prepagaSlug === 'swiss-medical')
const olmos = ops.filter((o) => o.comprador.startsWith('Grupo Olmos'))
const unir = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}` : xs.join(''))
// "El 50% del ICBA" en medio de una oración va en minúscula
const enOracion = (t: string) => t.replace(/^(El|Las) /, (m) => m.toLowerCase())
const nombreSan = (slug: string) => SANATORIOS_SEO.find((s) => s.slug === slug)?.nombre ?? slug

const top2 = AF.ranking.slice(0, 2)
const cuotaTop2 = top2.reduce((s, r) => s + r.cuota, 0)

const RESPUESTA = `Swiss Medical es la prepaga que más clínicas sumó: ${unir(swiss.map((o) => `${enOracion(o.que)} (${o.fecha})`))}. El Grupo Olmos se quedó con ${unir(olmos.map((o) => `${o.tipo === 'gerenciamiento' ? `el gerenciamiento del ${o.que}` : enOracion(o.que)} (${o.fecha})`))}. Pasa en un sector concentrado: ${top2.map((r) => r.nombre).join(' y ')} reúnen el ${cuotaTop2.toLocaleString('es-AR', { maximumFractionDigits: 1 })}% de los afiliados a prepagas (Superintendencia de Servicios de Salud, ${AF.periodoTexto}).`
const DESCRIPCION = 'Qué clínicas compraron Swiss Medical, el Grupo Olmos y otros grupos de salud entre 2021 y 2026, cuáles cerraron y qué cambia para tu cobertura. Cada operación con fecha y fuente.'

const faqs = [
  { q: '¿Qué clínicas compró Swiss Medical?', a: `${unir(swiss.map((o) => `${enOracion(o.que)} (${o.fecha})`))}. Además tiene sus sanatorios propios, como la Clínica y Maternidad Suizo Argentina, Los Arcos, Agote, Zabala y Olivos.` },
  { q: '¿Quién compró el Grupo Oroño de Rosario?', a: 'Swiss Medical y Chicago Capital (familia Tourn, Grupo Gamma), en noviembre de 2026. Compraron la parte de la familia Villavicencio: Sanatorio Parque, Sanatorio de Niños, Instituto Cardiovascular de Rosario, Maternidad Oroño, GO Sanatorio Funes, Diagnóstico Médico Oroño e INECO Oroño.' },
  { q: '¿Diagnóstico Maipú es de Swiss Medical?', a: `Sí. ${ops.find((o) => o.id === 'diagnostico-maipu')!.detalle}` },
  { q: '¿Quién es el dueño de Swiss Medical?', a: 'Swiss Medical Group lo preside Claudio Belocopitt.' },
  { q: '¿Qué pasa con mi cobertura si mi clínica cambia de dueño?', a: 'Lo que decide si te atienden es la cartilla de tu prepaga y tu plan, no quién es el dueño de la clínica. Fijate en la página de tu sanatorio qué prepagas y desde qué plan lo cubren según sus cartillas oficiales. Si la clínica pasa a ser de una prepaga, esa prepaga suele concentrar ahí la internación y las cirugías de sus socios.' },
]

export const metadata: Metadata = {
  title: { absolute: TITULO },
  description: DESCRIPCION,
  alternates: { canonical: URL },
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'article' },
}

function Fuentes({ fs }: { fs: FuenteNota[] }) {
  return (
    <>
      {fs.map((f, i) => (
        <span key={f.url}>{i > 0 && ' · '}<a href={f.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#E8002D]">{f.texto}</a></span>
      ))}
    </>
  )
}

const TIPO: Record<string, string> = { compra: 'Compra', canje: 'Canje', gerenciamiento: 'Gerenciamiento' }

export default function Pagina() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: TITULO,
      description: RESPUESTA,
      url: URL,
      dateModified: '2026-11-28',
      author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      isBasedOn: [...ops.flatMap((o) => o.fuentes), ...cierresClinicas.flatMap((c) => c.fuentes)].map((f) => f.url),
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
        <div className="container max-w-3xl mx-auto">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/prensa" className="hover:text-[#E8002D]">Prensa</Link> › Clínicas compradas por prepagas
          </nav>
          <span className="inline-block text-xs font-semibold text-[#E8002D] bg-red-50 border border-red-100 rounded-full px-3 py-1 mb-4">
            Informe · actualizado el {OPERACIONES_ACTUALIZADO}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Qué clínicas compraron las prepagas (2021-2026)</h1>
          <p className="text-gray-600 leading-relaxed">{RESPUESTA}</p>
        </div>
      </section>

      <div className="container py-12 max-w-3xl mx-auto space-y-12">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Las operaciones, de la más reciente a la más vieja</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <caption className="sr-only">Compras de clínicas por prepagas y grupos de salud, 2021-2026</caption>
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th scope="col" className="px-3 py-2 font-semibold">Fecha</th>
                  <th scope="col" className="px-3 py-2 font-semibold">Quién</th>
                  <th scope="col" className="px-3 py-2 font-semibold">Qué</th>
                  <th scope="col" className="px-3 py-2 font-semibold">Dónde</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 align-top">
                {ops.map((o) => (
                  <tr key={o.id}>
                    <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{o.fecha}</td>
                    <td className="px-3 py-2 text-gray-900">{o.comprador}</td>
                    <td className="px-3 py-2 text-gray-700"><a href={`#${o.id}`} className="hover:text-[#E8002D] hover:underline">{o.que}</a> <span className="text-xs text-gray-400">({TIPO[o.tipo]})</span></td>
                    <td className="px-3 py-2 text-gray-600">{o.lugar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">El detalle de cada operación</h2>
          <div className="space-y-4">
            {ops.map((o) => (
              <article key={o.id} id={o.id} className="rounded-xl border border-gray-100 p-4 scroll-mt-20">
                <h3 className="font-bold text-gray-900">{o.que}: {o.comprador} ({o.fecha})</h3>
                <p className="text-sm text-gray-700 leading-relaxed mt-1">{o.detalle}</p>
                {(o.sanatorios?.length || o.prepagaSlug) && (
                  <p className="text-sm mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {o.sanatorios?.map((s) => (
                      <Link key={s} href={`/sanatorios/${s}`} className="font-semibold text-[#E8002D] hover:underline">Qué prepagas atienden en {nombreSan(s)} →</Link>
                    ))}
                    {o.prepagaSlug === 'swiss-medical' && (
                      <Link href="/prepagas-con-sanatorios-propios/swiss-medical" className="font-semibold text-[#E8002D] hover:underline">Clínicas y sanatorios de Swiss Medical →</Link>
                    )}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">Fuente: <Fuentes fs={o.fuentes} /></p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Clínicas que cerraron</h2>
          <p className="text-sm text-gray-500 mb-4">
            Las cámaras del sector (ADECRA, ACAMI, CAPRESS) vienen advirtiendo por atrasos en los pagos y cierres de clínicas. Acá solo figuran los cierres confirmados con fuente y fecha.
          </p>
          <div className="space-y-4">
            {cierresClinicas.map((c) => (
              <article key={c.id} className="rounded-xl border border-gray-100 p-4">
                <h3 className="font-bold text-gray-900">{c.nombre}, {c.lugar} ({c.fecha})</h3>
                <p className="text-sm text-gray-700 leading-relaxed mt-1">{c.detalle}</p>
                <p className="text-xs text-gray-400 mt-2">Fuente: <Fuentes fs={c.fuentes} /></p>
              </article>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Contexto: <a href="https://www.perfil.com/noticias/politica/clinicas-y-sanatorios-privados-exigen-una-respuesta-de-lugones.phtml" target="_blank" rel="noopener noreferrer" className="underline">Perfil</a> · <a href="https://www.anbariloche.com.ar/noticias/2026/09/14/117109-clinicas-y-sanatorios-advierten-por-la-crisis-del-sector-y-piden-una-reunion-urgente-con-santilli" target="_blank" rel="noopener noreferrer" className="underline">ANBariloche</a>.
          </p>
        </section>

        <section className="rounded-2xl border-2 border-[#E8002D]/25 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">¿Tu clínica cambió de dueño?</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Lo que decide si te atienden es tu plan. Si querés seguir en una clínica que ahora es de Swiss Medical, te pasamos qué plan la incluye y el precio para tu edad, con 15% OFF cotizando online.
          </p>
          <BotonCotizarArriba desde="clinicas-compradas" query="prepaga=swiss-medical" />
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
          <p className="text-xs text-gray-400 mt-4">
            Swiss Medical Group y su presidente: <a href="https://www.lanacion.com.ar/economia/negocios/swiss-medical-se-queda-con-sanatorio-las-lomas-y-sale-de-medicus-nid23052024/" target="_blank" rel="noopener noreferrer" className="underline">La Nación</a>.
            Afiliados: <a href={AF.fuenteUrl} target="_blank" rel="noopener noreferrer" className="underline">Superintendencia de Servicios de Salud, {AF.periodoTexto}</a>.
          </p>
        </section>

        <section className="rounded-2xl bg-gray-50 border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Seguí leyendo</h2>
          <ul className="text-sm space-y-1.5">
            <li><Link href="/prepagas-con-sanatorios-propios/swiss-medical" className="text-[#E8002D] hover:underline">Clínicas y sanatorios de Swiss Medical, plan por plan</Link></li>
            <li><Link href="/prepagas-con-sanatorios-propios" className="text-[#E8002D] hover:underline">Prepagas con sanatorios propios: ranking</Link></li>
            <li><Link href="/sanatorios" className="text-[#E8002D] hover:underline">Qué prepagas atienden en cada sanatorio</Link></li>
            <li><Link href="/prensa/prepagas-dadas-de-baja" className="text-[#E8002D] hover:underline">Qué prepagas dio de baja la Superintendencia</Link></li>
          </ul>
        </section>
      </div>
    </>
  )
}
