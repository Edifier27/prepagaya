import type { Metadata } from 'next'
import Link from 'next/link'
import { CalculadoraMonotributo } from '@/components/herramientas/CalculadoraMonotributo'
import { urlFichaEntidad } from '@/lib/data/fichas-registro'
import { codigoSeisDigitos } from '@/lib/data/registro-sssalud'
import {
  APORTE_OS_MAXIMO, APORTE_OS_MINIMO, CATEGORIAS_MONOTRIBUTO, FUENTE_CATEGORIAS, FUENTE_OS_MONOTRIBUTO,
  MONOTRIBUTO_GENERADO, OS_MONOTRIBUTO, VIGENCIA_CATEGORIAS, formatoPesos,
} from '@/lib/data/monotributo'
import { SITE_NAME, SITE_URL, OG_IMAGE, TIEMPO_RESPUESTA } from '@/lib/utils'

// Obras sociales para monotributistas (24-sep-2026, docs/seo/universo-busquedas.md,
// familia D): "obra social monotributo", "obras sociales que aceptan
// monotributistas", "cuánto se paga de obra social en el monotributo". Todo
// sale del cuadro de ARCA y del listado de la SSSalud (lib/data/monotributo.ts);
// la salida propia es la prepaga que toma ese aporte.

const URL = `${SITE_URL}/obras-sociales/monotributo`
const N = OS_MONOTRIBUTO.length
const letrasMinimo = CATEGORIAS_MONOTRIBUTO.filter((c) => c.obraSocial === APORTE_OS_MINIMO).map((c) => c.letra)
const letrasMaximo = CATEGORIAS_MONOTRIBUTO.filter((c) => c.obraSocial === APORTE_OS_MAXIMO).map((c) => c.letra)
const rango = (l: string[]) => (l.length === 1 ? `categoría ${l[0]}` : `categorías ${l[0]} a ${l[l.length - 1]}`)
const fechaDatos = new Date(`${MONOTRIBUTO_GENERADO}T12:00:00`).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })

export const metadata: Metadata = {
  title: 'Obras sociales para monotributistas 2026: lista oficial y cuánto pagás',
  description: `Las ${N} obras sociales que aceptan monotributistas según la Superintendencia, cuánto pagás de obra social en cada categoría (desde ${formatoPesos(APORTE_OS_MINIMO)} por mes, según ARCA) y cuánto suma cada familiar.`,
  alternates: { canonical: URL },
  keywords: ['obras sociales para monotributistas', 'obra social monotributo', 'obras sociales que aceptan monotributistas', 'cuanto se paga de obra social en el monotributo', 'monotributo obra social familiar', 'aporte obra social monotributo 2026'],
  openGraph: {
    title: `Obras sociales para monotributistas: las ${N} de la lista oficial`,
    description: `Cuánto pagás de obra social en cada categoría y cuánto suma cada familiar.`,
    url: URL,
    type: 'article',
    images: [OG_IMAGE],
  },
}

const faqs = [
  {
    q: '¿Cuánto se paga de obra social en el monotributo?',
    a: `Según el cuadro de ARCA${VIGENCIA_CATEGORIAS ? ` vigente desde el ${VIGENCIA_CATEGORIAS}` : ''}, el aporte a la obra social va de ${formatoPesos(APORTE_OS_MINIMO)} por mes (${rango(letrasMinimo)}) a ${formatoPesos(APORTE_OS_MAXIMO)} (${rango(letrasMaximo)}). Ya está incluido en la cuota mensual del monotributo.`,
  },
  {
    q: '¿Qué obras sociales aceptan monotributistas?',
    a: `Según el listado de la Superintendencia de Servicios de Salud (consultado el ${fechaDatos}), ${N} agentes del seguro aceptan monotributistas. Están todas en esta página, con su código y su sede.`,
  },
  {
    q: '¿Puedo sumar a mi familia a la obra social del monotributo?',
    a: 'Sí. El aporte del monotributo cubre solo al titular: ARCA indica que por cada adherente hay que pagar el mismo importe de obra social que el titular.',
  },
  {
    q: '¿Quiénes no pagan obra social en el monotributo?',
    a: 'Según ARCA, quedan exceptuados de pagar jubilación y obra social en el monotributo: quienes están obligados por otros regímenes previsionales, los menores de 18 años, quienes adhirieron solo por alquilar bienes muebles o inmuebles, las sucesiones indivisas que siguen en el régimen y quienes se jubilaron por leyes anteriores a julio de 1994.',
  },
  {
    q: '¿Cómo cambio de obra social siendo monotributista?',
    a: 'Con la opción de cambio, online en la web de la Superintendencia de Servicios de Salud, con tu clave fiscal nivel 3. Los monotributistas solo pueden elegir entre las entidades que aceptan monotributistas. Se puede hacer una vez cada 365 días y rige desde el primer día del mes siguiente.',
  },
  {
    q: '¿Puedo tener una prepaga siendo monotributista?',
    a: 'Sí. Podés contratarla directo, como particular, o elegir una prepaga que tome tu aporte de obra social del monotributo y pagar solo la diferencia. Qué prepagas y planes lo aceptan depende de cada empresa: te lo decimos al cotizar.',
  },
]

export default function ObrasSocialesMonotributoPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Obras Sociales', item: `${SITE_URL}/obras-sociales` },
        { '@type': 'ListItem', position: 3, name: 'Monotributo' },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Obras sociales que aceptan monotributistas',
      numberOfItems: N,
      itemListElement: OS_MONOTRIBUTO.map((o, i) => ({ '@type': 'ListItem', position: i + 1, name: o.nombre })),
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
            <span className="text-gray-700">Monotributo</span>
          </nav>
        </div>
      </div>

      <section className="bg-gradient-to-b from-red-50/60 to-white border-b border-gray-100 pt-8 pb-12">
        <div className="container max-w-3xl! mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">Obras sociales para monotributistas: cuáles aceptan y cuánto pagás</h1>
          <p className="text-gray-700 mt-3 leading-relaxed">
            La cuota del monotributo ya incluye un aporte a la obra social, que va de {formatoPesos(APORTE_OS_MINIMO)} a {formatoPesos(APORTE_OS_MAXIMO)} por mes según tu categoría. Con ese aporte elegís entre las {N} obras sociales que aceptan monotributistas, o lo usás para pagar menos en una prepaga.
          </p>
          <div className="mt-6 grid gap-3 grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
              <p className="text-2xl sm:text-3xl font-black text-gray-900">{N}</p>
              <p className="text-xs text-gray-600">obras sociales aceptan monotributistas</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
              <p className="text-lg sm:text-2xl font-black text-gray-900 tabular-nums">{formatoPesos(APORTE_OS_MINIMO).replace(/,\d\d$/, '')}</p>
              <p className="text-xs text-gray-600">de obra social por mes ({rango(letrasMinimo)})</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
              <p className="text-2xl sm:text-3xl font-black text-gray-900">×2</p>
              <p className="text-xs text-gray-600">con un familiar: cada adherente paga lo mismo</p>
            </div>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">¿Cuánto pagás con tu familia?</h2>
          <CalculadoraMonotributo categorias={CATEGORIAS_MONOTRIBUTO} />
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-3xl! mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Aporte de obra social por categoría</h2>
          <p className="text-sm text-gray-600 mb-4">
            Cuadro de ARCA{VIGENCIA_CATEGORIAS ? `, vigente desde el ${VIGENCIA_CATEGORIAS}` : ''}. El aporte es por el titular: por cada adherente se paga el mismo importe.
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs text-gray-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Cat.</th>
                  <th className="px-3 py-2 font-semibold">Ingresos anuales hasta</th>
                  <th className="px-3 py-2 font-semibold">Obra social</th>
                  <th className="px-3 py-2 font-semibold hidden sm:table-cell">Cuota total (servicios)</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORIAS_MONOTRIBUTO.map((c) => (
                  <tr key={c.letra} className="border-t border-gray-100">
                    <td className="px-3 py-2 font-bold text-gray-900">{c.letra}</td>
                    <td className="px-3 py-2 tabular-nums text-gray-700">{formatoPesos(c.ingresosHasta).replace(/,\d\d$/, '')}</td>
                    <td className="px-3 py-2 tabular-nums font-semibold text-gray-900">{formatoPesos(c.obraSocial)}</td>
                    <td className="px-3 py-2 tabular-nums text-gray-700 hidden sm:table-cell">{formatoPesos(c.totalServicios)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Fuente: <a href={FUENTE_CATEGORIAS} target="_blank" rel="noopener noreferrer" className="underline">ARCA, montos y categorías vigentes del monotributo</a>. No pagan jubilación ni obra social en el monotributo quienes aportan a otro régimen previsional, los menores de 18 años y quienes adhirieron solo por alquilar bienes, entre otros.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-10 mb-2">Las {N} obras sociales que aceptan monotributistas</h2>
          <p className="text-sm text-gray-600 mb-4">
            Listado de la Superintendencia de Servicios de Salud, consultado el {fechaDatos}. Son las únicas que podés elegir con la opción de cambio si sos monotributista.
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs text-gray-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Obra social</th>
                  <th className="px-3 py-2 font-semibold">Código</th>
                  <th className="px-3 py-2 font-semibold hidden sm:table-cell">Sede</th>
                </tr>
              </thead>
              <tbody>
                {OS_MONOTRIBUTO.map((o) => (
                  <tr key={o.codigo} className="border-t border-gray-100 align-top">
                    <td className="px-3 py-2">
                      {o.entidad ? (
                        <Link href={urlFichaEntidad(o.entidad)} className="font-medium text-gray-900 hover:text-[#E8002D]">{o.nombre}</Link>
                      ) : (
                        <span className="font-medium text-gray-900">{o.nombre}</span>
                      )}
                      {!o.habilitadaOpciones && <span className="block text-xs text-amber-700">Hoy no habilitada para opciones de cambio</span>}
                    </td>
                    <td className="px-3 py-2 tabular-nums whitespace-nowrap">{codigoSeisDigitos(o.codigo)}</td>
                    <td className="px-3 py-2 text-gray-600 hidden sm:table-cell">{[o.localidad, o.telefono].filter(Boolean).join(' · ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Fuente: <a href={FUENTE_OS_MONOTRIBUTO} target="_blank" rel="noopener noreferrer" className="underline">SSSalud, agentes del seguro que aceptan monotributistas</a>. Nombres y teléfonos: Registro Nacional de Agentes del Seguro.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-10 mb-2">¿Y si quiero una prepaga?</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Tenés dos caminos: contratarla directo, como particular, o elegir una prepaga que tome tu aporte de obra social del monotributo y pagar solo la diferencia. Qué prepagas y planes lo aceptan depende de cada empresa, y conviene mirarlo con tu edad y tu zona.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3">
            <Link href="/comparador" className="text-sm font-semibold text-[#E8002D] hover:underline">Cotizar como monotributista →</Link>
            <Link href="/para/monotributistas" className="text-sm font-semibold text-[#E8002D] hover:underline">Prepagas para monotributistas →</Link>
            <Link href="/guias/opcion-de-cambio-obra-social" className="text-sm font-semibold text-[#E8002D] hover:underline">Cómo hacer la opción de cambio →</Link>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-10 mb-3">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold text-gray-900">{f.q}</h3>
                <p className="text-sm text-gray-700 leading-relaxed mt-1">{f.a}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-6">¿Dudas? Un asesor te responde en {TIEMPO_RESPUESTA}.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
            <Link href="/guias/unificar-aportes-obra-social" className="text-sm font-semibold text-[#E8002D] hover:underline">Unificar aportes con tu pareja →</Link>
            <Link href="/obras-sociales/codigos" className="text-sm font-semibold text-[#E8002D] hover:underline">Códigos de obras sociales →</Link>
            <Link href="/obras-sociales" className="text-sm font-semibold text-[#E8002D] hover:underline">Obras sociales →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
