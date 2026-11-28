import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SITE_URL } from '@/lib/utils'
import { estructuraPrepagas, ESTRUCTURA_FECHA } from '@/lib/data/estructura-prepagas'
import { SANATORIOS_SEO, prepagasEnSanatorio } from '@/lib/data/sanatorios-seo'
import { SANATORIOS_PROPIOS, operacionesClinicas, OPERACIONES_ACTUALIZADO } from '@/lib/data/operaciones-clinicas'
import { BreadcrumbSchema } from '@/components/ui/BreadcrumbSchema'
import { BotonCotizarArriba } from '@/components/ui/BotonCotizarArriba'
import { ldJson } from '@/lib/jsonld'

// Red propia de una prepaga (28-nov-2026, pedido de Darío): "clinicas de swiss
// medical", "cuales son los sanatorios de swiss medical", "clinica swiss medical
// [barrio]" (~120 variantes en el autocompletado) no tenían página. Una
// intención = una URL: el ranking /prepagas-con-sanatorios-propios responde
// "qué prepaga tiene sanatorios propios"; esta, "cuáles son los de Swiss".
// Desde qué plan cubre cada uno: cartilla oficial (lib/data/sanatorios-seo).

export const dynamicParams = false
export function generateStaticParams() {
  return Object.keys(SANATORIOS_PROPIOS).map((prepaga) => ({ prepaga }))
}

type Props = { params: Promise<{ prepaga: string }> }

const unir = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}` : xs.join(''))

function datos(slug: string) {
  const est = estructuraPrepagas.find((p) => p.slug === slug)
  const propios = SANATORIOS_PROPIOS[slug]
  if (!est || !propios) return null
  // Fila por sanatorio con página: desde qué plan lo incluye la propia prepaga, según su cartilla
  const fila = (s: string) => {
    const san = SANATORIOS_SEO.find((x) => x.slug === s)
    if (!san) return null
    const p = prepagasEnSanatorio(s).find((x) => x.prepagaSlug === slug)
    return {
      slug: s,
      nombre: san.nombre,
      zona: p?.sedes[0]?.zona ?? san.ciudadNombre ?? null,
      internacion: p?.desde?.label ?? null,
      guardia: p?.guardia.map((g) => g.label) ?? [],
      fecha: p?.fecha ?? null,
    }
  }
  const propiosFilas = propios.map(fila).filter((x): x is NonNullable<typeof x> => Boolean(x))
  const ops = operacionesClinicas.filter((o) => o.prepagaSlug === slug)
  const rosario = ops.find((o) => o.id === 'grupo-orono')
  const rosarioFilas = (rosario?.sanatorios ?? []).map(fila).filter((x): x is NonNullable<typeof x> => Boolean(x))
  return { est, propiosFilas, ops, rosario, rosarioFilas }
}

type FilaSanatorio = { slug: string; nombre: string; zona: string | null; internacion: string | null; guardia: string[]; fecha: string | null }

function Tabla({ filas, caption }: { filas: FilaSanatorio[]; caption: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            <th scope="col" className="px-3 py-2 font-semibold">Sanatorio</th>
            <th scope="col" className="px-3 py-2 font-semibold">Zona</th>
            <th scope="col" className="px-3 py-2 font-semibold">Internación desde</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 align-top">
          {filas.map((f) => (
            <tr key={f.slug}>
              <th scope="row" className="px-3 py-2 text-left font-normal">
                <Link href={`/sanatorios/${f.slug}`} className="font-semibold text-gray-900 hover:text-[#E8002D] hover:underline">{f.nombre}</Link>
              </th>
              <td className="px-3 py-2 text-gray-600">{f.zona ?? '—'}</td>
              <td className="px-3 py-2 text-gray-700">
                {f.internacion ?? <span className="text-gray-400">No figura en la cartilla relevada</span>}
                {f.guardia.length > 0 && <span className="block text-xs text-gray-500">Guardia: {unir(f.guardia)}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { prepaga } = await params
  const d = datos(prepaga)
  if (!d) return {}
  return {
    title: { absolute: `Clínicas y sanatorios de ${d.est.nombre}: lista 2026 por plan` },
    description: `${d.est.nombre} tiene ${d.est.sanatorios} sanatorios propios, ${d.est.centrosMedicos} centros médicos y avión sanitario. Cuáles son, dónde están y desde qué plan te cubre cada uno, según la cartilla oficial.`,
    alternates: { canonical: `${SITE_URL}/prepagas-con-sanatorios-propios/${prepaga}` },
  }
}

export default async function RedPropiaPage({ params }: Props) {
  const { prepaga } = await params
  const d = datos(prepaga)
  if (!d) notFound()
  const { est, propiosFilas, ops, rosario, rosarioFilas } = d
  const url = `${SITE_URL}/prepagas-con-sanatorios-propios/${prepaga}`
  const maipu = ops.find((o) => o.id === 'diagnostico-maipu')
  const icba = ops.find((o) => o.id === 'icba')

  const respuesta = `${est.nombre} tiene ${est.sanatorios} sanatorios propios (entre ellos ${unir(est.sanatoriosNombres ?? [])}), ${est.centrosMedicos} centros médicos${est.centrosOdontologicos ? `, ${est.centrosOdontologicos} centros odontológicos` : ''} y avión sanitario.${maipu ? ` Desde ${maipu.fecha} es dueña de Diagnóstico Maipú (30 centros de diagnóstico)` : ''}${icba ? ` y tiene el 50% del ICBA` : ''}.${rosario ? ` En ${rosario.fecha} compró, junto con Chicago Capital, el Grupo Oroño de Rosario.` : ''}`

  const faqs = [
    { q: `¿Cuáles son los sanatorios de ${est.nombre}?`, a: respuesta },
    ...(rosario ? [{
      q: `¿${est.nombre} tiene clínicas en Rosario?`,
      a: `Sí. En ${rosario.fecha}, ${est.nombre} y Chicago Capital compraron el Grupo Oroño: Sanatorio Parque, Sanatorio de Niños, Instituto Cardiovascular de Rosario, Maternidad Oroño, GO Sanatorio Funes, Diagnóstico Médico Oroño e INECO Oroño.`,
    }] : []),
    {
      q: `¿Conviene atenderse en la red propia de ${est.nombre}?`,
      a: `Según nuestros asesores oficiales de ${est.nombre}, la prepaga concentra la internación y las cirugías de sus socios en sus propios sanatorios. Igual, qué sanatorio te cubre depende de tu plan: en la tabla de arriba está desde qué plan entra cada uno, según la cartilla oficial.`,
    },
    {
      q: `¿Los centros médicos de ${est.nombre} son solo para socios?`,
      a: est.nota ?? `Sí, los centros médicos propios atienden a los socios de ${est.nombre}.`,
    },
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `Clínicas y sanatorios de ${est.nombre}`,
      description: respuesta,
      url,
      dateModified: '2026-11-28',
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
        <div className="container max-w-3xl mx-auto">
          <div className="mb-4">
            <BreadcrumbSchema crumbs={[{ label: 'Prepagas con sanatorios propios', href: '/prepagas-con-sanatorios-propios' }, { label: est.nombre }]} />
          </div>
          <span className="inline-block text-xs font-semibold text-[#E8002D] bg-red-50 border border-red-100 rounded-full px-3 py-1 mb-4">
            Red propia · actualizado el {OPERACIONES_ACTUALIZADO}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Clínicas y sanatorios de {est.nombre}</h1>
          <p className="text-gray-600 leading-relaxed">{respuesta}</p>
          <BotonCotizarArriba desde="red-propia" query={`prepaga=${prepaga}`} className="mt-5" />
        </div>
      </section>

      <div className="container py-12 max-w-3xl mx-auto space-y-12">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Los sanatorios propios de {est.nombre}, plan por plan</h2>
          <p className="text-sm text-gray-500 mb-4">
            Desde qué plan te cubre cada uno para internación, según la cartilla oficial de {est.nombre}{propiosFilas[0]?.fecha ? ` (${propiosFilas[0].fecha})` : ''}. Entrá a cada sanatorio para ver sus sedes y qué otras prepagas lo atienden.
          </p>
          <Tabla filas={propiosFilas} caption={`Sanatorios propios de ${est.nombre} y desde qué plan los cubre`} />
          <p className="text-xs text-gray-400 mt-2">Lista de sanatorios propios: {est.fuente.texto}, {ESTRUCTURA_FECHA}.</p>
        </section>

        {rosario && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-1">En Rosario: el Grupo Oroño</h2>
            <p className="text-gray-600 leading-relaxed mb-4">{rosario.detalle}</p>
            {rosarioFilas.length > 0 && <Tabla filas={rosarioFilas} caption={`Clínicas del Grupo Oroño y desde qué plan las cubre ${est.nombre}`} />}
            <p className="text-xs text-gray-400 mt-2">
              Compra: {rosario.fuentes.map((f, i) => (
                <span key={f.url}>{i > 0 && ' · '}<a href={f.url} target="_blank" rel="noopener noreferrer" className="underline">{f.texto}</a></span>
              ))}. Desde qué plan: cartilla oficial de {est.nombre}.
            </p>
          </section>
        )}

        {(maipu || icba) && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Diagnóstico y centros médicos</h2>
            <ul className="space-y-3 text-sm text-gray-700">
              <li><strong className="text-gray-900">{est.centrosMedicos} centros médicos propios.</strong> {est.nota}</li>
              {maipu && <li><strong className="text-gray-900">Diagnóstico Maipú ({maipu.fecha}).</strong> {maipu.detalle}</li>}
              {icba && <li><strong className="text-gray-900"><Link href="/sanatorios/instituto-cardiovascular-de-buenos-aires" className="hover:text-[#E8002D] hover:underline">ICBA</Link> ({icba.fecha}).</strong> {icba.detalle}</li>}
            </ul>
          </section>
        )}

        <section className="rounded-2xl border-2 border-[#E8002D]/25 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">¿Querés atenderte en la red de {est.nombre}?</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Según nuestros asesores oficiales, {est.nombre} concentra la internación y las cirugías de sus socios en sus propios sanatorios. Elegí el plan que incluya el sanatorio que querés: te pasamos el precio para tu edad, con 15% OFF cotizando online.
          </p>
          <BotonCotizarArriba desde="red-propia-cierre" query={`prepaga=${prepaga}`} />
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
          <h2 className="text-lg font-bold text-gray-900 mb-2">Seguí leyendo</h2>
          <ul className="text-sm space-y-1.5">
            <li><Link href="/prensa/clinicas-compradas-por-prepagas" className="text-[#E8002D] hover:underline">Qué clínicas compraron las prepagas (2021-2026)</Link></li>
            <li><Link href="/prepagas-con-sanatorios-propios" className="text-[#E8002D] hover:underline">Prepagas con sanatorios propios: ranking</Link></li>
            <li><Link href={`/cartillas/${prepaga}`} className="text-[#E8002D] hover:underline">Cartilla de {est.nombre} por plan</Link></li>
            <li><Link href="/sanatorios" className="text-[#E8002D] hover:underline">Qué prepagas atienden en cada sanatorio</Link></li>
          </ul>
        </section>
      </div>
    </>
  )
}
