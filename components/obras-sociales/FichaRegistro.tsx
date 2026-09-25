import Link from 'next/link'
import type { FichaRegistro as Ficha } from '@/lib/data/fichas-registro'
import { codigoSeisDigitos, nombreLegible, REGISTRO_VERIFICADO, type EntidadRegistro } from '@/lib/data/registro-sssalud'
import { SITE_NAME, SITE_URL, TIEMPO_RESPUESTA } from '@/lib/utils'

// Ficha de obra social armada con el registro de la SSSalud (lib/data/
// fichas-registro.ts). Todo lo que dice sale del registro o del nombre
// oficial; lo demás es cómo se hacen los trámites, que vale para todas.

export function faqsFichaRegistro(f: Ficha, e: EntidadRegistro) {
  const codigo = codigoSeisDigitos(e.codigo!)
  return [
    { q: `¿Cuál es el código de ${f.nombreCorto}?`, a: `${codigo} (RNAS ${e.codigo}). Es el número con el que figura en el Registro Nacional de Agentes del Seguro de la Superintendencia de Servicios de Salud: el que carga tu empleador en tu alta y el que se usa en la opción de cambio.` },
    ...(e.telefono ? [{ q: `¿Cuál es el teléfono de ${f.nombreCorto}?`, a: `El teléfono de la sede que figura en el registro de la Superintendencia de Servicios de Salud es ${e.telefono}${e.domicilio ? ` (${e.domicilio}${e.localidadSede ? `, ${e.localidadSede}` : ''})` : ''}. Para turnos y autorizaciones, consultá los canales de tu delegación${e.web ? ` en ${e.web.replace(/^https?:\/\//, '')}` : ''}.` }] : []),
    { q: `¿Puedo pasar mis aportes de ${f.nombreCorto} a una prepaga?`, a: `Sí: en relación de dependencia podés hacer la opción de cambio (online, con clave fiscal, una vez cada 365 días) y pasar tus aportes a una prepaga inscripta como agente del seguro, pagando solo la diferencia. La calculadora de aportes te dice cuánto sería con tu sueldo.` },
  ]
}

export function FichaRegistroPage({ ficha: f, entidad: e }: { ficha: Ficha; entidad: EntidadRegistro }) {
  const codigo = codigoSeisDigitos(e.codigo!)
  const faqs = faqsFichaRegistro(f, e)
  const fecha = new Date(`${REGISTRO_VERIFICADO}T12:00:00`).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Obras Sociales', item: `${SITE_URL}/obras-sociales` },
        { '@type': 'ListItem', position: 3, name: f.nombreCorto },
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
            <span className="text-gray-700">{f.nombreCorto}</span>
          </nav>
        </div>
      </div>

      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-10">
        <div className="container max-w-3xl! mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">{f.nombreCorto}: teléfono, código y cómo pasarte a una prepaga</h1>
          <p className="text-gray-700 mt-3 leading-relaxed">
            {nombreLegible(e.nombre).replace(/^\S+ - /, '')} es la obra social {f.actividad.startsWith('el ') ? `del ${f.actividad.slice(3)}` : `de ${f.actividad}`}. La tienen por defecto quienes trabajan en esa actividad en relación de dependencia{e.opcion ? ', y otros trabajadores pueden elegirla con la opción de cambio' : ''}.
          </p>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <dt className="text-xs text-gray-500">Código de obra social</dt>
              <dd className="text-2xl font-black text-gray-900 tabular-nums">{codigo}</dd>
              <dd className="text-xs text-gray-500">RNAS {e.codigo}</dd>
            </div>
            {e.telefono && (
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <dt className="text-xs text-gray-500">Teléfono de la sede</dt>
                <dd className="text-lg font-bold text-gray-900"><a href={`tel:${e.telefono.split('/')[0].replace(/[^\d]/g, '')}`} className="hover:text-[#E8002D]">{e.telefono}</a></dd>
              </div>
            )}
            {e.domicilio && (
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <dt className="text-xs text-gray-500">Sede</dt>
                <dd className="text-sm font-semibold text-gray-900">{e.domicilio}{e.localidadSede ? `, ${e.localidadSede}` : ''}</dd>
              </div>
            )}
            {e.web && (
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <dt className="text-xs text-gray-500">Sitio oficial</dt>
                <dd className="text-sm font-semibold"><a href={e.web} target="_blank" rel="noopener noreferrer" className="text-[#E8002D] hover:underline break-all">{e.web.replace(/^https?:\/\/(www\.)?/, '')}</a></dd>
              </div>
            )}
          </dl>
          <p className="text-xs text-gray-500 mt-3">
            Razón social: {e.razonSocial}. Fuente: <a href={e.fuenteUrl} target="_blank" rel="noopener noreferrer" className="underline">Registro Nacional de Agentes del Seguro de la SSSalud</a>, datos verificados el {fecha}.
          </p>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="container max-w-3xl! mx-auto">
          <Link href={`/calculadora-aportes?os=${f.slug}`} className="group flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border-2 border-[#E8002D]/20 bg-gradient-to-r from-red-50 to-white p-5 hover:border-[#E8002D] transition-colors">
            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-900">¿Tenés {f.nombreCorto}? Con tus mismos aportes podés tener una prepaga</div>
              <div className="text-sm text-gray-600 mt-0.5">Poné tu sueldo y mirá cuánto pagarías de diferencia en cada plan, con los precios oficiales.</div>
            </div>
            <span className="shrink-0 inline-flex items-center justify-center px-5 py-2.5 bg-[#E8002D] group-hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm">Calcular mi diferencia →</span>
          </Link>

          <h2 className="text-xl font-bold text-gray-900 mt-10 mb-3">Cómo cambiarte de {f.nombreCorto}</h2>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
            <li>Elegí la obra social o la prepaga a la que querés pasar tus aportes: tiene que estar inscripta en el Registro Nacional de Agentes del Seguro (si sos monotributista, en el de las que aceptan monotributo).</li>
            <li>Hacé la opción de cambio online, en la web de la Superintendencia de Servicios de Salud, con tu clave fiscal nivel 3 de ARCA. Es el único canal: no hace falta ir a ningún lado ni pagarle a un gestor.</li>
            <li>Te llega un mail: tenés 48 horas para confirmar el trámite con el link, o se cae.</li>
            <li>El cambio se activa el primer día del mes siguiente. Contactá a la nueva entidad para afiliarte; hasta entonces seguís con {f.nombreCorto}.</li>
          </ol>
          <p className="text-sm text-gray-600 mt-3">La opción se puede hacer una vez cada 365 días y no se puede volver atrás: tenés que quedarte al menos un año. No pueden hacerla quienes se quedaron sin trabajo ni quienes están en licencia por maternidad.</p>
          <p className="text-sm text-gray-600 mt-3">Si te pasás a una prepaga, un asesor te cotiza con tus aportes y te guía en el trámite. Te respondemos en {TIEMPO_RESPUESTA}.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-10 mb-3">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faqs.map((x) => (
              <div key={x.q}>
                <h3 className="font-semibold text-gray-900">{x.q}</h3>
                <p className="text-sm text-gray-700 leading-relaxed mt-1">{x.a}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6">
            {f.guia && <Link href={`/guias/${f.guia.slug}`} className="text-sm font-semibold text-[#E8002D] hover:underline">{f.guia.texto} →</Link>}
            <Link href="/obras-sociales/codigos" className="text-sm font-semibold text-[#E8002D] hover:underline">Códigos de todas las obras sociales →</Link>
            <Link href="/guias/opcion-de-cambio-obra-social" className="text-sm font-semibold text-[#E8002D] hover:underline">La opción de cambio, paso a paso →</Link>
            <Link href="/guias/derivar-obra-social-a-prepaga" className="text-sm font-semibold text-[#E8002D] hover:underline">Cómo derivar tus aportes →</Link>
            <Link href="/obras-sociales" className="text-sm font-semibold text-[#E8002D] hover:underline">Otras obras sociales →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
