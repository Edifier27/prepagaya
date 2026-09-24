import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { provinciasSEO, type ProvinciaSEO } from '@/lib/data/zonas'
import { obrasSociales } from '@/lib/data/obras-sociales'
import { entidadesRegistro, codigoSeisDigitos, grupoDe, nombreLegible, registroDeObraSocial, REGISTRO_VERIFICADO, type EntidadRegistro } from '@/lib/data/registro-sssalud'
import { FICHAS_REGISTRO } from '@/lib/data/fichas-registro'
import { delegacionesEn, DELEGACIONES_FUENTE, SSSALUD_0800 } from '@/lib/data/delegaciones-sssalud'
import { SITE_NAME, SITE_URL, OG_IMAGE, TIEMPO_RESPUESTA } from '@/lib/utils'

// Obras sociales por provincia (24-sep-2026, docs/seo/universo-busquedas.md):
// "obras sociales en córdoba", "mejor obra social mendoza", "obra social
// provincial de salta". No hay un partner de obra social, así que la página
// no rankea obras sociales: explica cuál te toca según cómo trabajás, lista
// las que tienen sede en la provincia (registro de la SSSalud) y ofrece la
// salida propia: pasar los aportes a una prepaga con cartilla en la provincia.

interface Props {
  params: Promise<{ prov: string }>
}

// Obra social → prepaga de la misma marca (como en /obras-sociales/[slug])
const OS_A_PREPAGA: Record<string, string> = { 'swiss-medical-os': 'swiss-medical', 'sancor-os': 'sancor-salud' }

// Sindicales nacionales con delegaciones en todo el país (fichas propias)
const SINDICALES_NACIONALES = ['osecac', 'osuomra', 'uocra-construir-salud', 'oschoca', 'osprera', 'ospedyc', 'osuthgra', 'ospacp', 'union-personal', 'bancaria-osba']

function fichaDeEntidad(e: EntidadRegistro): string {
  const os = obrasSociales.find((o) => registroDeObraSocial(o.slug)?.slug === e.slug)
  if (os) return `/obras-sociales/${os.slug}`
  if (FICHAS_REGISTRO.some((f) => f.slug === e.slug)) return `/obras-sociales/${e.slug}`
  return `/obras-sociales/codigos#${e.slug}`
}

function nombreFicha(slug: string): string | null {
  return obrasSociales.find((o) => o.slug === slug)?.nombre ?? FICHAS_REGISTRO.find((f) => f.slug === slug)?.nombreCorto ?? null
}

function datosProvincia(prov: ProvinciaSEO) {
  const conSede = entidadesRegistro
    .filter((e) => e.codigo && grupoDe(e) !== 'prepagas' && (e.jurisdiccion === prov.nombre || e.provincias?.includes(prov.nombre)))
    .sort((a, b) => nombreLegible(a.nombre).localeCompare(nombreLegible(b.nombre), 'es'))
  const prepagasProv = prov.prepagas.filter((p) => p.enSitio)
  const enProv = new Set(prepagasProv.map((p) => p.slug))
  // Obras sociales que son también prepaga y tienen cartilla en la provincia
  const marcas = obrasSociales
    .filter((o) => o.derivacion && enProv.has(OS_A_PREPAGA[o.slug] ?? o.slug))
    .sort((a, b) => (b.beneficiarios ?? 0) - (a.beneficiarios ?? 0))
  return { conSede, prepagasProv, marcas }
}

const empleoPublico = (prov: ProvinciaSEO) => (prov.slug === 'caba' ? 'empleado del Gobierno de la Ciudad' : 'empleado público provincial')

function faqsProvincia(prov: ProvinciaSEO, conSede: EntidadRegistro[], marcas: { nombre: string }[]) {
  const osp = prov.obraSocialProvincial
  return [
    ...(osp ? [{ q: `¿Cuál es la obra social provincial de ${prov.nombre}?`, a: `${osp.sigla} (${osp.nombre}). ${osp.nota}` }] : []),
    {
      q: `¿Cuál es la mejor obra social en ${prov.nombre}?`,
      a: `Depende de cómo trabajás. ${osp ? `Si sos ${empleoPublico(prov)}, te corresponde ${osp.sigla} y no la podés cambiar. ` : ''}Si trabajás en relación de dependencia en el sector privado, te toca la obra social de tu actividad, pero podés cambiarla una vez por año: la que más conviene es la que tiene buena cartilla en tu ciudad. ${marcas.length ? `Las que además son prepaga y tienen cartilla en ${prov.nombre} son ${marcas.slice(0, 4).map((m) => m.nombre).join(', ')}.` : ''} Con tus aportes también podés pasarte a una prepaga pagando la diferencia.`.replace(/\s+/g, ' '),
    },
    ...(conSede.length ? [{
      q: `¿Qué obras sociales tienen sede en ${prov.nombre}?`,
      a: `Según el Registro Nacional de Agentes del Seguro de la Superintendencia de Servicios de Salud, ${conSede.length === 1 ? 'tiene sede' : `tienen sede ${conSede.length} obras sociales`} en ${prov.nombre}: ${conSede.slice(0, 8).map((e) => nombreLegible(e.nombre)).join('; ')}${conSede.length > 8 ? ', entre otras' : ''}. Además, las obras sociales nacionales grandes atienden con delegaciones en todo el país.`,
    }] : []),
    ...(osp ? [{
      q: `¿Puedo tener ${osp.sigla} y una prepaga?`,
      a: `Sí. ${osp.sigla} es obligatoria para los empleados públicos ${prov.slug === 'caba' ? 'de la Ciudad' : 'de la provincia'} y no se puede derivar, pero podés contratar una prepaga aparte para tener otra cartilla. Si además tenés un trabajo en el sector privado, esos aportes sí pueden ir a una prepaga.`,
    }] : []),
  ]
}

export async function generateStaticParams() {
  return provinciasSEO.map((p) => ({ prov: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { prov: slug } = await params
  const prov = provinciasSEO.find((p) => p.slug === slug)
  if (!prov) return {}
  const osp = prov.obraSocialProvincial
  const title = `Obras sociales en ${prov.nombre}${osp ? `: ${osp.sigla}, las sindicales` : ''} y cuál conviene (2026)`
  const description = `Qué obra social te corresponde en ${prov.nombre} según cómo trabajás${osp ? `, qué es ${osp.sigla}` : ''}, cuáles tienen sede en la provincia con su código y cómo pasar tus aportes a una prepaga con cartilla en ${prov.capitalNombre}.`
  const url = `${SITE_URL}/obras-sociales/provincia/${slug}`
  return {
    title,
    description,
    alternates: { canonical: url },
    keywords: [`obras sociales ${prov.nombre.toLowerCase()}`, `mejor obra social ${prov.nombre.toLowerCase()}`, `obra social provincial ${prov.nombre.toLowerCase()}`, ...(osp ? [osp.sigla.toLowerCase()] : [])],
    openGraph: { title, description, url, type: 'article', images: [OG_IMAGE] },
  }
}

export default async function ObrasSocialesProvinciaPage({ params }: Props) {
  const { prov: slug } = await params
  const prov = provinciasSEO.find((p) => p.slug === slug)
  if (!prov) notFound()
  const osp = prov.obraSocialProvincial
  const { conSede, prepagasProv, marcas } = datosProvincia(prov)
  const faqs = faqsProvincia(prov, conSede, marcas)
  const nacionales = SINDICALES_NACIONALES.map((s) => ({ slug: s, nombre: nombreFicha(s) })).filter((x): x is { slug: string; nombre: string } => !!x.nombre)
  const fecha = new Date(`${REGISTRO_VERIFICADO}T12:00:00`).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
  const otras = provinciasSEO.filter((p) => p.slug !== prov.slug)
  const delegaciones = delegacionesEn(prov.nombre)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Obras Sociales', item: `${SITE_URL}/obras-sociales` },
        { '@type': 'ListItem', position: 3, name: `Obras sociales en ${prov.nombre}` },
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
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-[#E8002D]">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <Link href="/obras-sociales" className="hover:text-[#E8002D]">Obras Sociales</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">{prov.nombre}</span>
          </nav>
        </div>
      </div>

      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-10">
        <div className="container max-w-3xl! mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">Obras sociales en {prov.nombre}: cuál te toca y cuál conviene</h1>
          <p className="text-gray-700 mt-3 leading-relaxed">
            La obra social no se elige como una prepaga: depende de cómo trabajás. Acá tenés cuál te corresponde en {prov.nombre}, cuáles tienen sede en la provincia y cómo usar tus aportes para tener una prepaga con cartilla en {prov.capitalNombre}.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {osp && (
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-xs font-semibold text-gray-500 first-letter:uppercase">{empleoPublico(prov)}</div>
                <div className="font-bold text-gray-900 mt-0.5">{osp.sigla}: obligatoria</div>
                <p className="text-sm text-gray-600 mt-1">No se puede cambiar ni derivar. Podés sumar una prepaga aparte.</p>
              </div>
            )}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="text-xs font-semibold text-gray-500">Relación de dependencia (privado)</div>
              <div className="font-bold text-gray-900 mt-0.5">La de tu actividad, o la que elijas</div>
              <p className="text-sm text-gray-600 mt-1">Podés cambiarla una vez por año, y pasar tus aportes a una prepaga.</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="text-xs font-semibold text-gray-500">Monotributo</div>
              <div className="font-bold text-gray-900 mt-0.5">La que elijas, entre las que lo aceptan</div>
              <p className="text-sm text-gray-600 mt-1"><Link href="/para/monotributistas" className="text-[#E8002D] hover:underline">Prepagas que aceptan monotributo</Link>.</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="text-xs font-semibold text-gray-500">Jubilados y pensionados</div>
              <div className="font-bold text-gray-900 mt-0.5">PAMI, u otra que reciba jubilados</div>
              <p className="text-sm text-gray-600 mt-1"><Link href="/obras-sociales/pami" className="text-[#E8002D] hover:underline">Todo sobre PAMI</Link>.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="container max-w-3xl! mx-auto">
          <Link href="/calculadora-aportes" className="group flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border-2 border-[#E8002D]/20 bg-gradient-to-r from-red-50 to-white p-5 hover:border-[#E8002D] transition-colors">
            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-900">¿Trabajás en blanco en {prov.nombre}? Con tus aportes podés tener una prepaga</div>
              <div className="text-sm text-gray-600 mt-0.5">Poné tu sueldo y mirá cuánto pagarías de diferencia en cada plan, con los precios oficiales.</div>
            </div>
            <span className="shrink-0 inline-flex items-center justify-center px-5 py-2.5 bg-[#E8002D] group-hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm">Calcular mi diferencia →</span>
          </Link>

          {osp && (
            <>
              <h2 className="text-xl font-bold text-gray-900 mt-10 mb-2">La obra social provincial: {osp.sigla}</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{osp.nombre}. {osp.nota}</p>
              {osp.slug && <Link href={`/obras-sociales/${osp.slug}`} className="inline-block mt-2 text-sm font-semibold text-[#E8002D] hover:underline">Ficha completa de {osp.sigla} →</Link>}
            </>
          )}

          {marcas.length > 0 && (
            <>
              <h2 className="text-xl font-bold text-gray-900 mt-10 mb-2">Obras sociales que también son prepaga, con cartilla en {prov.nombre}</h2>
              <p className="text-sm text-gray-600 mb-4">Si podés elegir, son las que te dan cartilla de prepaga con tus aportes. Cuánto pagás de diferencia depende del plan y de tu sueldo.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {marcas.map((o) => (
                  <Link key={o.slug} href={`/obras-sociales/${o.slug}`} className="rounded-xl border border-gray-200 p-4 hover:border-red-200 transition-colors">
                    <div className="font-bold text-gray-900">{o.nombre}</div>
                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{o.descripcion}</div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {conSede.length > 0 && (
            <>
              <h2 className="text-xl font-bold text-gray-900 mt-10 mb-2">Obras sociales con sede en {prov.nombre}</h2>
              <p className="text-sm text-gray-600 mb-4">Las que tienen su sede central en la provincia según el registro de la Superintendencia de Servicios de Salud (datos del {fecha}), con el código que carga tu empleador.</p>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs text-gray-500">
                    <tr><th className="px-3 py-2 font-semibold">Obra social</th><th className="px-3 py-2 font-semibold">Código</th><th className="px-3 py-2 font-semibold hidden sm:table-cell">Sede</th></tr>
                  </thead>
                  <tbody>
                    {conSede.map((e) => (
                      <tr key={e.slug} className="border-t border-gray-100 align-top">
                        <td className="px-3 py-2"><Link href={fichaDeEntidad(e)} className="font-medium text-gray-900 hover:text-[#E8002D]">{nombreLegible(e.nombre)}</Link></td>
                        <td className="px-3 py-2 tabular-nums whitespace-nowrap">{codigoSeisDigitos(e.codigo!)}</td>
                        <td className="px-3 py-2 text-gray-600 hidden sm:table-cell">{[e.localidadSede, e.telefono].filter(Boolean).join(' · ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <h2 className="text-xl font-bold text-gray-900 mt-10 mb-2">Obras sociales sindicales nacionales</h2>
          <p className="text-sm text-gray-600 mb-3">Atienden en {prov.nombre} con delegaciones propias. Si trabajás en una de estas actividades, es la que te toca salvo que hagas la opción de cambio.</p>
          <div className="flex flex-wrap gap-2">
            {nacionales.map((o) => (
              <Link key={o.slug} href={`/obras-sociales/${o.slug}`} className="text-xs px-3 py-1.5 bg-white text-gray-700 border border-gray-200 rounded-full hover:border-red-200 hover:text-[#E8002D] font-medium">{o.nombre}</Link>
            ))}
            <Link href="/obras-sociales/codigos" className="text-xs px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-full hover:text-[#E8002D] font-medium">Todas, con su código →</Link>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-10 mb-2">Trámites de obra social en {prov.nombre}</h2>
          <p className="text-sm text-gray-600 mb-4">
            La <Link href="/guias/opcion-de-cambio-obra-social" className="text-[#E8002D] hover:underline">opción de cambio</Link> es solo online, con clave fiscal. Para lo que se hace con turno (como la <Link href="/guias/unificar-aportes-obra-social" className="text-[#E8002D] hover:underline">unificación de aportes</Link> o una denuncia), la Superintendencia de Servicios de Salud atiende en:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {delegaciones.map((d) => (
              <div key={d.localidad} className="rounded-xl border border-gray-200 p-4 text-sm">
                <div className="font-semibold text-gray-900">{d.provincia === 'CABA' ? 'Sede central' : `Delegación ${d.localidad}`}</div>
                <div className="text-gray-700 mt-0.5">{d.direccion}</div>
                <div className="text-gray-500 text-xs mt-1">{[d.horario, d.telefono].filter(Boolean).join(' · ')}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Línea gratuita de la Superintendencia: <a href={`tel:${SSSALUD_0800.replace(/\D/g, '')}`} className="underline">{SSSALUD_0800}</a>. Fuente: <a href={DELEGACIONES_FUENTE} target="_blank" rel="noopener noreferrer" className="underline">Delegaciones de la SSSalud</a>.</p>

          {prepagasProv.length > 0 && (
            <>
              <h2 className="text-xl font-bold text-gray-900 mt-10 mb-2">Prepagas en {prov.nombre}</h2>
              <p className="text-sm text-gray-600 mb-3">Las que reciben aportes de obra social y tienen cartilla en la provincia.</p>
              <div className="flex flex-wrap gap-2">
                {prepagasProv.map((p) => (
                  <Link key={p.slug} href={`/prepagas/${prov.slug}/${p.slug}`} className="text-xs px-3 py-1.5 bg-white text-gray-700 border border-gray-200 rounded-full hover:border-red-200 hover:text-[#E8002D] font-medium">{p.nombre} en {prov.nombre}</Link>
                ))}
              </div>
              <Link href={`/prepagas/${prov.slug}/mejores-prepagas`} className="inline-block mt-3 text-sm font-semibold text-[#E8002D] hover:underline">Ranking de prepagas en {prov.nombre} →</Link>
            </>
          )}

          <h2 className="text-xl font-bold text-gray-900 mt-10 mb-3">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faqs.map((x) => (
              <div key={x.q}>
                <h3 className="font-semibold text-gray-900">{x.q}</h3>
                <p className="text-sm text-gray-700 leading-relaxed mt-1">{x.a}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-6">¿Dudas con el cambio? Un asesor te ayuda con el trámite y te responde en {TIEMPO_RESPUESTA}.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-10 mb-3">Obras sociales en otras provincias</h2>
          <div className="flex flex-wrap gap-2">
            {otras.map((p) => (
              <Link key={p.slug} href={`/obras-sociales/provincia/${p.slug}`} className="text-xs px-3 py-1.5 bg-white text-gray-700 border border-gray-200 rounded-full hover:border-red-200 hover:text-[#E8002D] font-medium">{p.nombre}</Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
