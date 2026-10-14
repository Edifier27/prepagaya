import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { getConvenios, PREPAGAS_DERIVAR } from '@/lib/data/convenios'
import { APORTE_DERIVABLE, SITE_URL, TIEMPO_RESPUESTA, formatPrecio, precioDeriva } from '@/lib/utils'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'
import { ldJson } from '@/lib/jsonld'

// "Derivar aportes a [prepaga]" (14-oct-2026, keyword research: "cómo derivar
// aportes a OSDE", "derivar aportes obra social a swiss medical", "sancor
// salud con aportes"). Una página por partner con código en el Registro
// Nacional de Agentes del Seguro (RNAS) de la SSSalud. Los pasos son los de
// la guía general /guias/derivar-obra-social-a-prepaga (ya verificados);
// acá se agregan el código y la cuenta con la lista oficial de cada marca.
// Premedic no figura en el registro: no tiene página.

type Props = { params: Promise<{ prepaga: string }> }

export function generateStaticParams() {
  return PREPAGAS_DERIVAR.map((prepaga) => ({ prepaga }))
}

function datos(slug: string) {
  if (!(PREPAGAS_DERIVAR as readonly string[]).includes(slug)) return null
  const prep = prepagas.find((p) => p.slug === slug)
  const codigo = getConvenios(slug)?.codigoAfip
  if (!prep || !codigo?.codigos.length) return null
  // Planes con precio oficial, sin variantes de edad acotada, del más barato
  const planes = prep.planes
    .filter((pl) => Number.isFinite(pl.precio) && !pl.edadMaxima)
    .sort((a, b) => a.precio - b.precio)
    .slice(0, 6)
    .map((pl) => {
      const conAportes = precioDeriva(pl.precio)
      return { pl, conAportes, sueldo: Math.ceil(conAportes / APORTE_DERIVABLE / 10000) * 10000 }
    })
  return { prep, codigo, planes }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { prepaga } = await params
  const d = datos(prepaga)
  if (!d) return {}
  const c = d.codigo.codigos[0].codigo
  return {
    title: `Derivar aportes a ${d.prep.nombre}: código ${c} y cuánto pagás (${PRECIO_ACTUALIZADO.toLowerCase()})`,
    description: `Cómo derivar tus aportes a ${d.prep.nombre}: código ${c} del registro de la SSSalud, el trámite online paso a paso y cuánto pagás con aportes en cada plan según la lista oficial.`,
    alternates: { canonical: `${SITE_URL}/derivar-aportes/${prepaga}` },
  }
}

export default async function DerivarAportesPage({ params }: Props) {
  const { prepaga } = await params
  const d = datos(prepaga)
  if (!d) notFound()
  const { prep, codigo, planes } = d
  const c = codigo.codigos[0]
  const pctAporte = (APORTE_DERIVABLE * 100).toLocaleString('es-AR')
  const masBarato = planes[0]

  const faqs = [
    {
      q: `¿Cuál es el código de obra social de ${prep.nombre} para derivar aportes?`,
      a: `${c.codigo}${c.nota ? ` (${c.nota})` : ''}, según el Registro Nacional de Agentes del Seguro de Salud de la Superintendencia de Servicios de Salud. Es el que se usa en la opción de cambio y el que tu empleador puede cargar en tu alta.`,
    },
    {
      q: `¿Cuánto pago por ${prep.nombre} si derivo mis aportes?`,
      a: masBarato
        ? `Con aportes se cotiza la lista sin IVA y se descuenta lo que aportás. El ${masBarato.pl.nombre} sale ${formatPrecio(masBarato.conAportes)} por mes sin IVA para una persona de 30 años (${PRECIO_ACTUALIZADO.toLowerCase()}): con un sueldo bruto de alrededor de ${formatPrecio(masBarato.sueldo)} el aporte lo cubre. Con menos sueldo pagás la diferencia.`
        : `Depende del plan y de tu sueldo: con aportes se cotiza la lista sin IVA y se descuenta lo que aportás.`,
    },
    {
      q: '¿Cada cuánto puedo cambiar de obra social?',
      a: 'Una vez por año. Si después querés volver a una obra social pura o elegir otra prepaga, podés ejercer la opción de cambio de nuevo respetando ese límite.',
    },
    {
      q: '¿Sirve si soy monotributista?',
      a: `El aporte de obra social del monotributo lo pagás igual dentro de tu cuota. Si la prepaga lo toma, pagás solo la diferencia. En la página de prepagas para monotributistas tenés cuánto aporta cada categoría según ARCA.`,
    },
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `Cómo derivar tus aportes a ${prep.nombre}`,
      step: [
        { '@type': 'HowToStep', name: 'Cotizá con aportes', text: `Pedí la cotización de ${prep.nombre} en modalidad con aportes, con tu recibo de sueldo a mano.` },
        { '@type': 'HowToStep', name: 'Hacé la opción de cambio', text: `En la web de la Superintendencia de Servicios de Salud, con tu clave fiscal nivel 3 de ARCA, elegí el código ${c.codigo}.` },
        { '@type': 'HowToStep', name: 'Confirmá el mail', text: 'Confirmá el mail que te llega dentro de las 48 horas o el trámite se cae.' },
        { '@type': 'HowToStep', name: 'Afiliate', text: `El cambio se activa el primer día del mes siguiente y ahí te afiliás a ${prep.nombre}.` },
      ],
    },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: prep.nombre, item: `${SITE_URL}/prepagas/${prep.slug}` },
        { '@type': 'ListItem', position: 3, name: 'Derivar aportes', item: `${SITE_URL}/derivar-aportes/${prep.slug}` },
      ],
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(jsonLd) }} />
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-10">
        <div className="container max-w-3xl mx-auto">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-[#E8002D]">PrepagaYa</Link> › <Link href={`/prepagas/${prep.slug}`} className="hover:text-[#E8002D]">{prep.nombre}</Link> › Derivar aportes
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 text-balance">Cómo derivar tus aportes a {prep.nombre}</h1>
          <p className="text-gray-700 mt-3 leading-relaxed">
            Si trabajás en relación de dependencia, tus aportes de obra social pueden ir a {prep.nombre}: hacés la opción de cambio online en la Superintendencia de Servicios de Salud con el código <strong>{c.codigo}</strong>,
            y pagás el plan con la lista sin IVA y descontando lo que aportás. Es gratis y lo hacés vos.
          </p>
          <div className="mt-5 rounded-2xl border-2 border-[#E8002D] bg-white p-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Código de obra social de {prep.nombre}</div>
              <div className="text-3xl font-black text-gray-900 tabular-nums mt-1">{c.codigo}</div>
              {c.nota && <div className="text-xs text-gray-500 mt-1">{c.nota}</div>}
            </div>
            {codigo.fuente && (
              <a href={codigo.fuente.url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 underline sm:max-w-[14rem]">Fuente: {codigo.fuente.texto}</a>
            )}
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">El trámite, paso a paso</h2>
          <ol className="space-y-3">
            {[
              ['Cotizá con aportes', `Pedí la cotización de ${prep.nombre} en modalidad con aportes, con tu recibo de sueldo a mano: así ves cuánto te queda por pagar.`],
              ['Hacé la opción de cambio', `Entrá a la web de la Superintendencia de Servicios de Salud con tu clave fiscal nivel 3 de ARCA y elegí el código ${c.codigo}. Es gratis y sin intermediarios.`],
              ['Confirmá el mail', 'Te llega un mail para confirmar dentro de las 48 horas: si no lo confirmás, el trámite se cae.'],
              ['Afiliate', `El cambio se activa el primer día del mes siguiente y ahí te afiliás a ${prep.nombre}.`],
            ].map(([t, x], i) => (
              <li key={t} className="flex gap-3 rounded-xl border border-gray-200 p-4">
                <span className="w-7 h-7 shrink-0 rounded-full bg-red-50 text-[#E8002D] font-bold text-sm flex items-center justify-center">{i + 1}</span>
                <div><div className="font-semibold text-gray-900 text-sm">{t}</div><p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{x}</p></div>
              </li>
            ))}
          </ol>
          <p className="text-sm text-gray-600 mt-4 leading-relaxed">
            <strong>¿Empezás un trabajo nuevo?</strong> Pedile a Recursos Humanos que en tu alta cargue el código {c.codigo} en vez de la obra social del convenio: te ahorrás el trámite de después.
          </p>
        </div>
      </section>

      {planes.length > 0 && (
        <section className="py-8 bg-gray-50 border-y border-gray-100">
          <div className="container max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Cuánto pagás por {prep.nombre} con aportes</h2>
            <p className="text-sm text-gray-600 mb-4">Lista oficial ({PRECIO_ACTUALIZADO.toLowerCase()}, 30 años). Con aportes se cotiza sin IVA y se descuenta lo que aportás.</p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="text-left px-4 py-3">Plan</th>
                    <th className="text-right px-4 py-3">Particular</th>
                    <th className="text-right px-4 py-3">Con aportes, sin IVA</th>
                    <th className="text-right px-4 py-3">Sueldo bruto que lo cubre</th>
                  </tr>
                </thead>
                <tbody>
                  {planes.map(({ pl, conAportes, sueldo }) => (
                    <tr key={pl.slug} className="border-t border-gray-100">
                      <td className="px-4 py-3"><Link href={`/prepagas/${prep.slug}/${pl.slug}`} className="font-semibold text-gray-900 hover:text-[#E8002D]">{pl.nombre}</Link></td>
                      <td className="px-4 py-3 text-right tabular-nums text-gray-500">{formatPrecio(pl.precio)}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-semibold text-gray-900">{formatPrecio(conAportes)}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-gray-700">{formatPrecio(sueldo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Sueldo bruto aproximado con el que tu aporte cubre la cuota de una persona: se toma el {pctAporte}% del sueldo que llega a la prepaga (9% de aportes menos el Fondo Solidario de Redistribución). Con menos sueldo pagás la diferencia.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <ContratarPlanButton prepagaNombre={prep.nombre} fuente="derivar-aportes" label={`Cotizar ${prep.nombre} con aportes`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm transition-colors" />
              <Link href="/calculadora-aportes" className="inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-700 hover:border-[#E8002D] hover:text-[#E8002D]">
                Calcular con mi sueldo
              </Link>
            </div>
            <p className="text-xs text-gray-500 mt-2">Un asesor te confirma la cotización exacta en {TIEMPO_RESPUESTA}.</p>
          </div>
        </section>
      )}

      <section className="py-8 bg-white">
        <div className="container max-w-3xl mx-auto space-y-3">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Preguntas frecuentes</h2>
          {faqs.map((f) => (
            <div key={f.q} className="rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 text-sm">{f.q}</h3>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">{f.a}</p>
            </div>
          ))}
          <div className="flex flex-wrap gap-2 pt-3 text-sm">
            <Link href="/guias/derivar-obra-social-a-prepaga" className="rounded-full border border-gray-200 px-4 py-2 font-semibold text-gray-700 hover:border-[#E8002D] hover:text-[#E8002D]">Guía completa de derivación</Link>
            <Link href="/para/monotributistas" className="rounded-full border border-gray-200 px-4 py-2 font-semibold text-gray-700 hover:border-[#E8002D] hover:text-[#E8002D]">Prepagas para monotributistas</Link>
            {PREPAGAS_DERIVAR.filter((s) => s !== prep.slug).map((s) => (
              <Link key={s} href={`/derivar-aportes/${s}`} className="rounded-full border border-gray-200 px-4 py-2 font-semibold text-gray-700 hover:border-[#E8002D] hover:text-[#E8002D]">
                Derivar a {prepagas.find((p) => p.slug === s)?.nombre}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
