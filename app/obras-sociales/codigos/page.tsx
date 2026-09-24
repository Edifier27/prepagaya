import type { Metadata } from 'next'
import Link from 'next/link'
import { obrasSociales } from '@/lib/data/obras-sociales'
import {
  entidadesRegistro, entidadRegistro, codigoSeisDigitos, grupoDe, textoBusqueda, registroDeObraSocial,
  GRUPOS_REGISTRO, PREPAGA_A_REGISTRO, REGISTRO_VERIFICADO, type EntidadRegistro,
} from '@/lib/data/registro-sssalud'
import { FiltroCodigos } from '@/components/obras-sociales/FiltroCodigos'
import { SITE_NAME, SITE_URL, OG_IMAGE } from '@/lib/utils'

// Directorio de códigos de obras sociales y prepagas (24-sep-2026).
// "código obra social afip", "código [obra social]" y "rnos [obra social]"
// son búsquedas grandes y MiObraSocial las contesta de a una. Acá están todas
// en una página, con el dato del registro de la SSSalud.

const URL = `${SITE_URL}/obras-sociales/codigos`
const conCodigo = entidadesRegistro.filter((e) => e.codigo)
const fecha = new Date(`${REGISTRO_VERIFICADO}T12:00:00`).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })

// Los que más se buscan arriba; Swiss Medical primero.
const DESTACADOS = ['swiss-medical', 'osde', 'osecac', 'galeno', 'medife', 'sancor-salud', 'pami', 'osdepym', 'union-personal', 'omint', 'medicus', 'avalian']

const codigoDe = (slug: string) => {
  const c = entidadRegistro(slug)?.codigo
  return c ? codigoSeisDigitos(c) : ''
}

export const metadata: Metadata = {
  title: 'Códigos de obras sociales y prepagas para AFIP/ARCA (2026)',
  description: `Buscá el código de tu obra social o prepaga: Swiss Medical ${codigoDe('swiss-medical')}, OSDE ${codigoDe('osde')}, OSECAC ${codigoDe('osecac')} y ${conCodigo.length - 3} más, del registro oficial de la SSSalud.`,
  alternates: { canonical: URL },
  openGraph: {
    title: 'Códigos de obras sociales y prepagas para AFIP/ARCA',
    description: 'El código RNOS de cada obra social y prepaga, del Registro Nacional de Agentes del Seguro de la SSSalud.',
    url: URL,
    images: [OG_IMAGE],
  },
}

// Página propia del sitio para cada entidad del registro, si la hay.
function fichasPorRegistro(): Map<string, { href: string; texto: string }> {
  const m = new Map<string, { href: string; texto: string }>()
  for (const os of obrasSociales) {
    const e = registroDeObraSocial(os.slug)
    if (e) m.set(e.slug, { href: `/obras-sociales/${os.slug}`, texto: 'Ver ficha' })
  }
  // Las prepagas van a su ficha de planes y precios (pisa la de obra social).
  for (const [prepaga, registro] of Object.entries(PREPAGA_A_REGISTRO)) {
    m.set(registro, { href: `/prepagas/${prepaga}`, texto: 'Planes y precios' })
  }
  return m
}

const faqs = [
  {
    q: '¿Qué es el código de obra social?',
    a: `Es el número con el que cada obra social o prepaga figura en el Registro Nacional de Agentes del Seguro de Salud (RNAS) de la Superintendencia de Servicios de Salud. Se escribe con guiones (por ejemplo 9-0080-5) o como seis números seguidos (900805), que es como lo piden ARCA (ex AFIP) y los formularios de alta.`,
  },
  {
    q: '¿Para qué sirve el código de obra social?',
    a: `Tu empleador lo carga en tu alta en ARCA para que tus aportes vayan a esa obra social o prepaga, y lo vas a necesitar si hacés la opción de cambio en la web de la SSSalud. Por ejemplo, el de Swiss Medical es ${codigoDe('swiss-medical')} y el de OSDE, ${codigoDe('osde')}.`,
  },
  {
    q: '¿Por qué IOMA, APROSS u OSEP no tienen código?',
    a: 'Son obras sociales provinciales con régimen propio: no están en el registro nacional, cubren a los empleados públicos de su provincia y no se pueden elegir con la opción de cambio. Lo mismo pasa con las obras sociales universitarias, la de las Fuerzas Armadas (IOSFA) y la del Poder Judicial.',
  },
  {
    q: '¿Qué indica el primer número del código?',
    a: 'En este listado, todos los códigos que empiezan con 9 son de prepagas y mutuales inscriptas como agentes del seguro (artículo 1, inciso i, de la Ley 23.660), y los que empiezan con 4 son de obras sociales de personal de dirección, como OSDE (4-0080-0). La mayoría de las obras sociales sindicales empiezan con 1.',
  },
  {
    q: '¿Puedo derivar mis aportes a una prepaga?',
    a: 'Sí. Si trabajás en relación de dependencia podés elegir cualquier agente del seguro del registro, incluidas las prepagas inscriptas con código (las que empiezan con 9). Si el plan cuesta más que tu aporte, pagás la diferencia. La opción se puede hacer una vez por año.',
  },
]

export default function CodigosObrasSocialesPage() {
  const fichas = fichasPorRegistro()
  const grupos = GRUPOS_REGISTRO.map((g) => ({
    ...g,
    entidades: entidadesRegistro.filter((e) => grupoDe(e) === g.id),
  }))
  const destacados = DESTACADOS.map((s) => entidadRegistro(s)).filter((e): e is EntidadRegistro => Boolean(e?.codigo))

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Obras Sociales', item: `${SITE_URL}/obras-sociales` },
        { '@type': 'ListItem', position: 3, name: 'Códigos' },
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
            <Link href="/" className="hover:text-[#E8002D] transition-colors">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <Link href="/obras-sociales" className="hover:text-[#E8002D] transition-colors">Obras Sociales</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">Códigos</span>
          </nav>
        </div>
      </div>

      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">Códigos de obras sociales y prepagas para AFIP/ARCA</h1>
          <p className="text-gray-700 leading-relaxed mt-4 max-w-3xl">
            El código de las {conCodigo.length} obras sociales y prepagas del Registro Nacional de Agentes del Seguro de la Superintendencia de Servicios de Salud. Es el que carga tu empleador en tu alta y el que usás para elegir obra social o prepaga al derivar tus aportes.
          </p>
          <p className="text-xs text-gray-500 mt-3">
            Fuente: <a href="https://www.sssalud.gob.ar/index.php?cat=agsis&page=listRnos" target="_blank" rel="noopener noreferrer" className="underline">SSSalud — Registro Nacional de Agentes del Seguro</a>. Datos verificados el {fecha}.
          </p>

          <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">Los más buscados</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {destacados.map((e) => {
              const ficha = fichas.get(e.slug)
              const nombre = e.alias?.[0] && e.alias[0].length < e.nombre.length ? e.alias[0] : e.nombre
              return (
                <li key={e.slug} className="rounded-xl border border-gray-200 p-3">
                  <div className="text-sm text-gray-700 truncate" title={e.nombre}>{nombre}</div>
                  <div className="text-xl font-black text-gray-900 tabular-nums tracking-wide">{codigoSeisDigitos(e.codigo!)}</div>
                  {ficha && <Link href={ficha.href} className="text-xs font-semibold text-[#E8002D] hover:underline">{ficha.texto} →</Link>}
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="pb-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <FiltroCodigos
            total={entidadesRegistro.length}
            grupos={grupos.map((g) => ({ id: g.id, titulo: g.titulo, cantidad: g.entidades.length }))}
          />

          <div id="lista-codigos">
            {grupos.map((g) => (
              <section key={g.id} data-grupo-seccion={g.id} className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{g.id === 'provinciales' ? g.titulo : `Códigos de ${g.titulo.toLowerCase()}`}</h2>
                {g.id === 'provinciales' && (
                  <p className="text-sm text-gray-600 mb-2">No están en el registro nacional: tienen régimen propio y no se pueden elegir con la opción de cambio.</p>
                )}
                <ul className="divide-y divide-gray-100 border-y border-gray-100">
                  {g.entidades.map((e) => {
                    const ficha = fichas.get(e.slug)
                    const seis = e.codigo ? codigoSeisDigitos(e.codigo) : ''
                    const detalle = [
                      e.nombre.toUpperCase().includes(e.razonSocial.toUpperCase()) ? '' : e.razonSocial,
                      e.jurisdiccion !== 'Nacional' ? e.jurisdiccion : '',
                    ].filter(Boolean).join(' · ')
                    return (
                      <li key={e.slug} data-q={textoBusqueda(e)} className="flex items-start justify-between gap-3 py-3">
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 text-sm sm:text-base break-words">{e.nombre}</div>
                          {detalle && <div className="text-xs text-gray-500 mt-0.5 break-words">{detalle}</div>}
                          {ficha && <Link href={ficha.href} className="inline-block text-xs font-semibold text-[#E8002D] hover:underline mt-1">{ficha.texto} →</Link>}
                        </div>
                        <div className="text-right shrink-0">
                          {e.codigo ? (
                            <>
                              <div className="text-lg font-black text-gray-900 tabular-nums tracking-wide">{seis}</div>
                              <div className="text-[11px] text-gray-500 tabular-nums">RNAS {e.codigo}</div>
                              <button type="button" data-copiar={seis} className="mt-1 text-xs font-semibold text-gray-600 border border-gray-200 rounded-md px-2 py-0.5 hover:border-gray-400">Copiar</button>
                            </>
                          ) : (
                            <div className="text-xs text-gray-500 max-w-[9rem]">{e.fuente === 'rnemp' ? `Prepaga sin código de obra social (RNEMP ${e.rnemp})` : 'Sin código nacional: régimen propio'}</div>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Preguntas frecuentes sobre los códigos de obra social</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold text-gray-900">{f.q}</h3>
                <p className="text-sm text-gray-700 leading-relaxed mt-1">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/guias/derivar-obra-social-a-prepaga" className="text-sm font-semibold text-[#E8002D] hover:underline">Cómo derivar tus aportes a una prepaga →</Link>
            <Link href="/comparador" className="text-sm font-semibold text-[#E8002D] hover:underline">Cotizar prepaga con tus aportes →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
