import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { SANATORIOS_SEO, SANATORIOS_ACTUALIZADO, prepagasEnSanatorio, sanatoriosPublicables, type PrepagaEnSanatorio } from '@/lib/data/sanatorios-seo'
import { SITE_NAME, SITE_URL, formatPrecio, PRIORIDAD_PARTNERS, TIEMPO_RESPUESTA } from '@/lib/utils'
import { idCobertura } from '@/lib/data/cartilla-zonas/indice-cobertura'
import { getCartillaInfo } from '@/lib/data/cartillas'
import { obrasSocialesEnSanatorio } from '@/lib/data/sanatorios-obras-sociales'
import { CARTILLAS_SINDICALES } from '@/lib/data/sindicales-cartillas'
import { pediatriaDeSanatorio } from '@/lib/data/sanatorios-pediatria'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'
import { BarraCotizar } from '@/components/prepagas/BarraCotizar'

// "¿Qué prepagas atienden en el Hospital X?" (23-sep-2026): búsqueda que la
// competencia cubre con notas escritas a mano. Acá todo sale de las cartillas
// oficiales cargadas en lib/data/cartilla-zonas (ver lib/data/sanatorios-seo.ts).

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return sanatoriosPublicables().map((s) => ({ slug: s.slug }))
}

/** Artículo según el nombre: "la Clínica de Cuyo", "el Hospital Alemán". */
const art = (nombre: string) => (/^cl[ií]nica/i.test(nombre) ? 'la' : 'el')

// "¿Es público o privado?" (29-sep-2026, keyword research de Darío): volumen
// real en Hospital Italiano y Hospital Alemán. Verificado con fuente: ambos
// son asociaciones civiles sin fines de lucro, ni público ni privado en el
// sentido tradicional — no es una regla generalizable a todos los sanatorios
// del listado, por eso queda como mapa aparte y no una FAQ genérica.
const FAQ_EXTRA: Record<string, { q: string; a: string }[]> = {
  'hospital-italiano': [{
    q: '¿El Hospital Italiano es público o privado?',
    a: 'Ninguno de los dos en el sentido estricto: es una asociación civil sin fines de lucro, fundada en 1853 por la Sociedad Italiana de Beneficencia en Buenos Aires. No depende del Estado (no es un hospital público) ni reparte ganancias entre accionistas (no es una empresa privada con fines de lucro). Se financia con las cuotas de su propio Plan de Salud, los convenios con prepagas y obras sociales, y las prestaciones que factura.',
  }],
  'hospital-aleman': [{
    q: '¿El Hospital Alemán es público o privado?',
    a: 'Ninguno de los dos en el sentido estricto: es una asociación civil sin fines de lucro (Asociación Civil Hospital Alemán), fundada el 26 de agosto de 1867 por la Sociedad Alemana de Socorros a Enfermos. No depende del Estado ni reparte ganancias entre accionistas. Además de atender pacientes de distintas prepagas y obras sociales, tiene su propio Plan Médico de afiliación directa.',
  }],
}

const NUM_OS_RELEVADAS = Object.keys(CARTILLAS_SINDICALES).length
const tiposOs = (o: { internacion: boolean; guardia: boolean }) =>
  o.internacion && o.guardia ? 'internación y guardia' : o.internacion ? 'internación' : 'guardia'

const ORDEN = [...PRIORIDAD_PARTNERS, 'osde']
function ordenar(lista: PrepagaEnSanatorio[]) {
  return [...lista].sort((a, b) => (ORDEN.indexOf(a.prepagaSlug) + 99) % 99 - (ORDEN.indexOf(b.prepagaSlug) + 99) % 99)
}

/** Plan del comparador para un plan de cartilla, con su precio oficial (30 años). */
function planComparador(prepagaSlug: string, comparadorSlug?: string) {
  if (!comparadorSlug) return null
  const plan = prepagas.find((p) => p.slug === prepagaSlug)?.planes.find((pl) => pl.slug === comparadorSlug)
  return plan ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const s = SANATORIOS_SEO.find((x) => x.slug === slug)
  const lista = s ? prepagasEnSanatorio(slug) : []
  if (!s || lista.length < 2) return {}
  const nombres = ordenar(lista).map((p) => p.prepagaNombre)
  // Si también hay obras sociales con el sanatorio en su cartilla oficial, el
  // título lo dice: "qué obra social atiende el X" se busca mucho (1-oct-2026)
  const os = obrasSocialesEnSanatorio(slug)
  return {
    title: os.length
      ? `Qué prepagas y obras sociales atienden en ${art(s.nombre)} ${s.nombre}`
      : `Prepagas que atienden en ${art(s.nombre)} ${s.nombre}: desde qué plan`,
    description: os.length
      ? `${s.nombre}: lo tienen en cartilla ${nombres.join(', ')} (desde qué plan, para internación y guardia) y las obras sociales ${os.map((o) => o.osNombre).join(', ')}, según sus cartillas oficiales. Cotizá gratis.`
      : `Prepagas con ${art(s.nombre)} ${s.nombre} en cartilla: ${nombres.join(', ')}. Desde qué plan lo cubre cada una para internación y guardia, según sus cartillas oficiales. Cotizá gratis.`,
    alternates: { canonical: `${SITE_URL}/sanatorios/${slug}` },
    keywords: [
      `prepagas ${s.nombre.toLowerCase()}`,
      ...(s.ciudadNombre ? [`prepagas ${s.ciudadNombre.toLowerCase()}`, `que prepagas atienden en ${s.ciudadNombre.toLowerCase()}`] : []),
      `que prepagas atienden en el ${s.nombre.toLowerCase()}`,
      `obra social ${s.nombre.toLowerCase()}`,
      `que obras sociales atiende el ${s.nombre.toLowerCase()}`,
      `que obra social atiende el ${s.nombre.toLowerCase()}`,
      `obras sociales que trabajan con el ${s.nombre.toLowerCase()}`,
      `${s.nombre.toLowerCase()} prepaga`,
      ...(FAQ_EXTRA[slug] ? [`${s.nombre.toLowerCase()} es publico o privado`] : []),
      ...(pediatriaDeSanatorio(slug) ? [`pediatras ${s.nombre.toLowerCase()}`, `${s.nombre.toLowerCase()} pediatria`, `pediatra ${s.nombre.toLowerCase().replace(/^sanatorio /, '')}`] : []),
    ],
  }
}

export default async function SanatorioPage({ params }: Props) {
  const { slug } = await params
  const s = SANATORIOS_SEO.find((x) => x.slug === slug)
  if (!s) notFound()
  const lista = ordenar(prepagasEnSanatorio(slug))
  if (lista.length < 2) notFound()

  const conInternacion = lista.filter((p) => p.desde)
  // Obras sociales con este sanatorio en su cartilla oficial (1-oct-2026)
  const obrasSociales = obrasSocialesEnSanatorio(slug)
  // Pediatría (1-oct-2026): solo conteos del cuerpo médico oficial, sin nombres
  const pediatria = pediatriaDeSanatorio(slug)
  // "Mis sanatorios" con este ya cargado, para sumar los otros de la persona.
  const idBuscador = idCobertura(s.claves, s.excluir, s.ciudad)
  const hrefBuscador = idBuscador ? `/buscar-por-sanatorio?s=${encodeURIComponent(idBuscador)}` : '/buscar-por-sanatorio'
  const resumen = conInternacion
    .map((p) => `${p.prepagaNombre} desde ${p.desde!.label}`)
    .join('; ')

  const faqs = [
    {
      q: `¿Qué prepagas atienden en ${art(s.nombre)} ${s.nombre}?`,
      a: `Según sus cartillas oficiales, ${art(s.nombre)} ${s.nombre} figura en ${lista.map((p) => p.prepagaNombre).join(', ')}.${resumen ? ` Para internación: ${resumen}.` : ''}`,
    },
    {
      q: `¿Cuál es el plan más barato que incluye ${art(s.nombre)} ${s.nombre}?`,
      a: (() => {
        const conPrecio = conInternacion
          .map((p) => ({ p, plan: planComparador(p.prepagaSlug, p.desde!.comparadorSlug) }))
          .filter((x) => x.plan)
          .sort((a, b) => a.plan!.precio - b.plan!.precio)
        const m = conPrecio[0]
        return m
          ? `Entre las cartillas que relevamos, el plan de entrada más económico que lo incluye para internación es ${m.p.prepagaNombre} ${m.plan!.nombre}, desde ${formatPrecio(m.plan!.precio)}/mes para una persona de 30 años (${PRECIO_ACTUALIZADO.toLowerCase()}). El precio final depende de tu edad y tu zona.`
          : 'Depende de tu edad y tu zona: te lo cotizamos gratis.'
      })(),
    },
    {
      q: '¿Es lo mismo internación que guardia?',
      a: 'No. Un plan puede incluir un sanatorio solo para guardia, solo para internación o para las dos. En esta página lo mostramos por separado, tal como figura en cada cartilla oficial.',
    },
    ...(obrasSociales.length
      ? [{
          q: `¿Qué obras sociales atiende ${art(s.nombre)} ${s.nombre}?`,
          a: `Según los listados oficiales de prestadores que cada obra social presenta ante la Superintendencia de Servicios de Salud, ${art(s.nombre)} ${s.nombre} figura en ${obrasSociales.length === 1 ? 'la cartilla de ' : 'estas cartillas: '}${obrasSociales.map((o) => `${o.osNombre}: ${tiposOs(o)}`).join('; ')}. Relevamos las ${NUM_OS_RELEVADAS} obras sociales sindicales que publican ese listado: puede trabajar con otras.`,
        }]
      : []),
    ...(pediatria
      ? [{
          q: `¿Cuántos pediatras tiene ${art(s.nombre)} ${s.nombre}?`,
          a: `Según el cuerpo médico que publica ${art(s.nombre)} ${s.nombre}, atienden ${pediatria.totalGenerales} pediatras de pediatría general (${pediatria.generalesPorSede.map((x) => `${x.n} en ${x.sede}`).join(', ').replace(/, ([^,]*)$/, ' y $1')}) y ${pediatria.totalSubespecialistas} subespecialistas pediátricos, como neumonología, cardiología y dermatología. Para atenderte con ellos, tu prepaga tiene que incluir el sanatorio en tu plan.`,
        }]
      : []),
    ...(FAQ_EXTRA[slug] ?? []),
  ]

  const fuentes = [...new Set([...lista.map((p) => p.fuenteUrl), ...obrasSociales.map((o) => o.fuente)])]
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `¿Qué prepagas atienden en ${art(s.nombre)} ${s.nombre}?`,
      url: `${SITE_URL}/sanatorios/${slug}`,
      inLanguage: 'es-AR',
      dateModified: SANATORIOS_ACTUALIZADO,
      about: { '@type': 'Hospital', name: s.nombre, address: { '@type': 'PostalAddress', addressCountry: 'AR' } },
      isBasedOn: fuentes,
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Sanatorios', item: `${SITE_URL}/sanatorios` },
        { '@type': 'ListItem', position: 3, name: s.nombre },
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
      <BarraCotizar titulo={`un plan con ${art(s.nombre)} ${s.nombre}`} origen={`sanatorio:${s.slug}`} href="/comparador?desde=barra" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-[#E8002D] transition-colors">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <Link href="/sanatorios" className="hover:text-[#E8002D] transition-colors">Sanatorios</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">{s.nombre}</span>
          </nav>
        </div>
      </div>

      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-10">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight text-balance">
            ¿Qué prepagas{obrasSociales.length ? ' y obras sociales' : ''} atienden en {art(s.nombre)} {s.nombre}?
          </h1>
          <p className="text-gray-700 text-base leading-relaxed max-w-3xl">
            Según sus cartillas oficiales, {art(s.nombre)} <strong>{s.nombre}</strong> figura en <strong>{lista.map((p) => p.prepagaNombre).join(', ')}</strong>.
            {resumen && <> Para internación: {resumen}.</>}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-6">
            <a href="#cotizar" className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm transition-colors">
              Cotizar un plan con {art(s.nombre)} {s.nombre} →
            </a>
            <Link href={hrefBuscador} className="text-sm font-semibold text-[#E8002D] hover:underline">
              ¿Te atendés en otro sanatorio también? Mirá qué plan los cubre a todos →
            </Link>
          </div>
        </div>
      </section>

      {/* Conversión (Darío, 3-oct-2026): "si lo querés en cartilla, está en
          estos planes" + cotizar cada prepaga con sus planes preseleccionables.
          Planes = los que lo incluyen para internación en la cartilla oficial. */}
      {lista.some((p) => p.internacion.length > 0) && (
        <section className="py-10 bg-white">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 text-balance">
              Si estás buscando tener {art(s.nombre)} {s.nombre} en cartilla, lo encontrás en estos planes
            </h2>
            <p className="text-sm text-gray-600 mt-1 mb-5">Para internación, según la cartilla oficial de cada prepaga. Elegí el plan y cotizalo gratis.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lista.filter((p) => p.internacion.length > 0).map((p) => (
                <div key={p.prepagaSlug} className="rounded-2xl border-2 border-gray-100 hover:border-[#E8002D]/30 p-5 flex flex-col gap-3 transition-colors">
                  <div className="font-bold text-gray-900">{p.prepagaNombre}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {p.internacion.map((pl) => (
                      <span key={pl.id} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {pl.label}
                      </span>
                    ))}
                  </div>
                  <ContratarPlanButton
                    prepagaNombre={p.prepagaNombre}
                    fuente="sanatorio-planes"
                    label={`Cotizá ${p.prepagaNombre}`}
                    titulo={`${p.prepagaNombre} con ${art(s.nombre)} ${s.nombre}`}
                    planesOpciones={p.internacion.map((pl) => pl.label)}
                    datosExtra={{ sanatorio: s.nombre }}
                    className="mt-auto inline-flex items-center justify-center px-5 py-2.5 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tabla resumen (GEO): la respuesta en un formato que los motores de IA
          citan tal cual; el detalle por prepaga va abajo. */}
      <section className="pt-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen: prepagas con {art(s.nombre)} {s.nombre}</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 font-semibold">Prepaga</th>
                  <th className="px-4 py-3 font-semibold">Internación desde</th>
                  <th className="px-4 py-3 font-semibold">Guardia</th>
                  <th className="px-4 py-3 font-semibold">Precio del plan (30 años)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lista.map((p) => {
                  const plan = p.desde ? planComparador(p.prepagaSlug, p.desde.comparadorSlug) : null
                  return (
                    <tr key={p.prepagaSlug}>
                      <td className="px-4 py-3 font-semibold text-gray-900">{p.prepagaNombre}</td>
                      <td className="px-4 py-3 text-gray-700">{p.desde ? p.desde.label : 'No figura'}</td>
                      <td className="px-4 py-3 text-gray-700">{p.guardia.length ? `Sí, desde ${p.guardia[0].label}` : 'No figura'}</td>
                      <td className="px-4 py-3 text-gray-700 tabular-nums">{plan ? `${formatPrecio(plan.precio)}/mes` : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">Cartillas oficiales consultadas en septiembre de 2026. Precios de lista {PRECIO_ACTUALIZADO.toLowerCase()} según los cuadros tarifarios de la SSSalud{s.ciudadNombre ? ` (lista de referencia: en ${s.ciudadNombre} el precio puede ser distinto, te lo cotizamos con la lista de tu zona)` : ''}.</p>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Desde qué plan lo cubre cada prepaga</h2>
          <div className="space-y-4">
            {lista.map((p) => {
              const plan = p.desde ? planComparador(p.prepagaSlug, p.desde.comparadorSlug) : null
              return (
                <div key={p.prepagaSlug} className="rounded-2xl border border-gray-200 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{p.prepagaNombre}</h3>
                      {p.desde ? (
                        <p className="text-sm text-gray-700 mt-0.5">
                          Internación desde <strong>{p.desde.label}</strong>
                          {plan && <> · desde {formatPrecio(plan.precio)}/mes <span className="text-gray-400">(30 años)</span></>}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-700 mt-0.5">Figura solo para guardia</p>
                      )}
                    </div>
                    {plan && (
                      <Link href={`/prepagas/${p.prepagaSlug}/${plan.slug}`} className="text-sm font-semibold text-[#E8002D] hover:underline">
                        Ver {plan.nombre} →
                      </Link>
                    )}
                  </div>
                  <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Internación</dt>
                      <dd className="text-gray-800 mt-1">{p.internacion.length ? p.internacion.map((x) => x.label).join(' · ') : 'No figura'}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Guardia</dt>
                      <dd className="text-gray-800 mt-1">{p.guardia.length ? p.guardia.map((x) => x.label).join(' · ') : 'No figura con guardia'}</dd>
                    </div>
                  </dl>
                  {p.sedes.length > 0 && (
                    <p className="text-xs text-gray-500 mt-3">
                      Como figura en la cartilla: {p.sedes.map((x) => `${x.nombre}${x.direccion ? ` (${x.direccion})` : ''}`).join(' · ')}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Fuente: <a href={p.fuenteUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">cartilla oficial de {p.prepagaNombre}</a> ({p.fecha}).
                  </p>
                  {/* Enlazado interno (auditoría 29-sep-2026): esta página no
                      linkeaba a /cartillas, aunque es el contenido más
                      relacionado — buscador completo de esa misma prepaga. */}
                  {getCartillaInfo(p.prepagaSlug) && (
                    <Link href={`/cartillas/${p.prepagaSlug}`} className="inline-block mt-2 text-xs font-semibold text-[#E8002D] hover:underline">
                      Buscar otro médico o sanatorio en la cartilla de {p.prepagaNombre} →
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
          <p className="text-xs text-gray-500 mt-5 max-w-3xl">
            Relevamos las cartillas oficiales de Swiss Medical, OSDE, Premedic, Avalian y Sancor Salud en {s.ciudadNombre ?? 'CABA y GBA'}. Si una prepaga no aparece acá, puede que lo tenga con otro nombre o en otra zona: consultanos y te lo confirmamos.
          </p>
        </div>
      </section>

      {/* "¿Qué obras sociales atiende?" (1-oct-2026): cruce con las cartillas
          oficiales de obras sociales (lib/data/sanatorios-obras-sociales.ts) */}
      {/* Pediatría (1-oct-2026): conteos del cuerpo médico oficial, sin nombres */}
      {pediatria && (
        <section id="pediatria" className="py-10 bg-white border-t border-gray-100">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Pediatría en {art(s.nombre)} {s.nombre}</h2>
            <p className="text-sm text-gray-600 mb-5 max-w-3xl">
              {pediatria.totalGenerales} pediatras de pediatría general y {pediatria.totalSubespecialistas} subespecialistas pediátricos, según el{' '}
              <a href={pediatria.fuente} target="_blank" rel="noopener noreferrer" className="underline">cuerpo médico oficial</a>{' '}
              del sanatorio ({new Date(`${pediatria.verificado}T12:00:00`).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}). Ahí podés ver quiénes son y en qué sede atiende cada uno.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {pediatria.generalesPorSede.map((x) => (
                <div key={x.sede} className="rounded-xl border border-gray-200 p-4">
                  <div className="text-2xl font-black text-gray-900 tabular-nums">{x.n}</div>
                  <div className="text-xs text-gray-500 mt-1">pediatras en {x.sede}</div>
                </div>
              ))}
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">Subespecialidades pediátricas</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 mb-6">
              {pediatria.subespecialidades.map((x) => (
                <li key={x.nombre} className="flex justify-between gap-3 text-sm border-b border-gray-100 py-1">
                  <span className="text-gray-700">{x.nombre}</span>
                  <span className="font-semibold text-gray-900 tabular-nums">{x.n}</span>
                </li>
              ))}
            </ul>
            <a href="#cotizar" className="group flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border-2 border-[#E8002D]/20 bg-gradient-to-r from-red-50 to-white p-5 hover:border-[#E8002D] transition-colors">
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900">¿Tu cobertura dejó {art(s.nombre)} {s.nombre} y no querés cambiar de pediatra?</div>
                <div className="text-sm text-gray-600 mt-0.5">Elegí un plan que lo incluya: arriba tenés desde qué plan lo cubre cada prepaga.</div>
              </div>
              <span className="shrink-0 inline-flex items-center justify-center px-5 py-2.5 bg-[#E8002D] group-hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm">Cotizar →</span>
            </a>
          </div>
        </section>
      )}

      {obrasSociales.length > 0 && (
        <section id="obras-sociales" className="py-10 bg-gray-50 border-t border-gray-100">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Obras sociales que atiende {art(s.nombre)} {s.nombre}</h2>
            <p className="text-sm text-gray-600 mb-5 max-w-3xl">
              Según el listado oficial de prestadores que cada obra social presenta ante la Superintendencia de Servicios de Salud.
              Relevamos las {NUM_OS_RELEVADAS} obras sociales sindicales que lo publican: si la tuya no aparece, puede que igual lo tenga.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {obrasSociales.map((o) => (
                <li key={o.osSlug} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/obras-sociales/${o.osSlug}`} className="font-semibold text-gray-900 hover:text-[#E8002D]">{o.osNombre}</Link>
                    <div className="flex gap-1.5 shrink-0">
                      {o.internacion && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-[#B8001F]">Internación</span>}
                      {o.guardia && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">Guardia</span>}
                    </div>
                  </div>
                  {o.sedes[0]?.domicilio && <div className="text-sm text-gray-600 mt-1">{[...new Set(o.sedes.map((x) => x.domicilio).filter(Boolean))].slice(0, 3).join(' · ')}</div>}
                  <Link href={o.urlCartilla} className="inline-block text-xs font-semibold text-[#E8002D] hover:underline mt-2">Ver la cartilla de {o.osNombre} →</Link>
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-700 mt-5">
              ¿Tu obra social no lo tiene? Con tus mismos aportes podés pasarte a una prepaga que sí lo incluya y pagar solo la diferencia.{' '}
              <Link href="/calculadora-aportes" className="text-[#E8002D] font-semibold hover:underline">Calculá cuánto sería →</Link>
            </p>
          </div>
        </section>
      )}

      <section id="cotizar" className="py-12 bg-[#E8002D] text-white scroll-mt-20">
        <div className="container max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Cotizá un plan que incluya {art(s.nombre)} {s.nombre}</h2>
          <p className="text-red-100 text-sm mb-6">Te respondemos en {TIEMPO_RESPUESTA}, con el precio para tu edad y tu zona.</p>
          <Link href="/comparador" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E8002D] font-bold rounded-2xl hover:bg-red-50 transition-all shadow-lg text-sm">
            Cotizar gratis →
          </Link>
        </div>
      </section>

      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
          <div className="space-y-2">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer select-none list-none">
                  <h3 className="font-semibold text-sm text-gray-900 m-0">{q}</h3>
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <p className="text-sm font-semibold text-gray-700 mb-3">Otros sanatorios</p>
          <div className="flex flex-wrap gap-2">
            {sanatoriosPublicables().filter((x) => x.slug !== slug).map((x) => (
              <Link key={x.slug} href={`/sanatorios/${x.slug}`} className="text-sm px-3 py-1.5 bg-white border border-gray-200 hover:border-[#E8002D] rounded-full text-gray-700">
                {x.nombre}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
