import Link from 'next/link'
import { LeadFormInline } from '@/components/ui/LeadFormInline'
import { CtaMedio } from '@/components/ui/CtaMedio'
import { BarraCotizar } from '@/components/prepagas/BarraCotizar'
import { ObraSocialIcon } from '@/components/ui/CategoryIcon'
import { PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { registroDeObraSocial } from '@/lib/data/registro-sssalud'
import { obrasSociales } from '@/lib/data/obras-sociales'
import {
  OS_COMPLEMENTARIA,
  URL_HUB_COMPLEMENTARIA,
  desdeMinimo,
  urlComplementaria,
  type DatosComplementaria,
  type OpcionPrepaga,
} from '@/lib/data/prepaga-complementaria'
import { SITE_NAME, SITE_URL, formatPrecio } from '@/lib/utils'
import { ldJson } from '@/lib/jsonld'

// Página "prepaga para afiliados a [obra social provincial]" (18-oct-2026).
// Todo sale de datos que ya están verificados en el sitio: la ficha de la obra
// social (quiénes se afilian, contras), el silo local de la provincia (qué
// prepagas tienen red ahí) y el cuadro tarifario oficial de la SSSalud.

const ATRIBUTOS = 'text-xs px-2.5 py-1 rounded-full font-medium'

export function precioDesde(o: OpcionPrepaga) {
  if (!o.desde) return 'Precio a cotizar'
  return `Desde ${formatPrecio(o.desde.plan.precio)}/mes`
}

/** "Para quién es": primera línea de quiénes se afilian, en minúscula */
function quienes(d: DatosComplementaria) {
  const q = d.os.quienesPuedenAfiliarse[0] ?? ''
  return q.charAt(0).toLowerCase() + q.slice(1)
}

/** Respuesta a "¿puedo pasar mis aportes?" con lo que dice el registro de la SSSalud */
function respuestaDerivacion(d: DatosComplementaria) {
  const n = d.os.nombre
  const reg = registroDeObraSocial(d.os.slug)
  if (reg && !reg.codigo) {
    return `No. ${n} tiene régimen propio y no figura con código en el Registro Nacional de Agentes del Seguro de la Superintendencia de Servicios de Salud, así que no entra en la opción de cambio ni se puede derivar a una prepaga. El aporte sigue yendo a ${n} y la prepaga se paga aparte.`
  }
  return `No hay una opción formal para derivar los aportes de ${n} a una prepaga. El aporte sigue yendo a ${n} y la prepaga se contrata aparte, como particular.`
}

export function faqComplementaria(d: DatosComplementaria) {
  const n = d.os.nombre
  const donde = d.provincia ? ` en ${d.provincia.nombre}` : ''
  const min = desdeMinimo(d.opciones)
  const top = d.opciones.slice(0, 2)
  return [
    {
      q: `¿Puedo tener ${n} y una prepaga al mismo tiempo?`,
      a: `Sí. ${n} es la obra social de ${quienes(d)} y el aporte se descuenta igual. La prepaga la contratás aparte, como cualquier particular, y en cada consulta o internación usás la cobertura que más te convenga.`,
    },
    {
      q: `¿Puedo pasar mis aportes de ${n} a una prepaga?`,
      a: respuestaDerivacion(d),
    },
    {
      q: `¿Cuánto cuesta una prepaga si tengo ${n}?`,
      a: min
        ? `Lo mismo que para cualquier particular: el precio de lista depende de la edad y del plan, no de la obra social que tengas. Para una persona de 30 años, el plan más barato entre las prepagas con red${donde} arranca en ${formatPrecio(min.desde!.plan.precio)}/mes (${min.prepaga.nombre} ${min.desde!.plan.nombre}, cuadro tarifario oficial de ${PRECIO_ACTUALIZADO.toLowerCase()}). Cotizá con tu edad y tu grupo para ver el tuyo.`
        : 'Lo mismo que para cualquier particular: el precio de lista depende de la edad y del plan, no de la obra social que tengas. Cotizá con tu edad y tu grupo para ver el tuyo.',
    },
    ...(top.length === 2
      ? [{
          q: `¿Qué prepaga conviene si tengo ${n}${donde}?`,
          a: d.provincia && top[0].zona && top[1].zona
            ? `Depende de dónde vivas y qué sanatorio quieras. ${top[0].prepaga.nombre}: ${top[0].zona.resumen} ${top[1].prepaga.nombre}: ${top[1].zona.resumen}`
            : `Depende de dónde vivas y qué sanatorio quieras. Las de red nacional más grande son ${d.opciones.slice(0, 4).map((o) => o.prepaga.nombre).join(', ').replace(/, ([^,]*)$/, ' y $1')}. Cargá tu zona en el cotizador y te mostramos las que tienen cartilla cerca tuyo.`,
        }]
      : []),
    {
      q: '¿Cómo pago menos por la prepaga si ya aporto a una obra social?',
      a: 'Tres caminos: un plan con copagos o de red cerrada (la cuota baja bastante y seguís teniendo la obra social para lo que no cubra), sumar al grupo familiar en un solo plan, y deducir las cuotas de Ganancias: se pueden descontar hasta el 5% de la ganancia neta anual, cargándolas en SiRADIG si sos empleado.',
    },
    {
      q: '¿Qué necesito para contratar la prepaga?',
      a: 'DNI, la declaración jurada de salud de cada integrante y un medio de pago. Las prepagas pueden fijar períodos de carencia para algunas prestaciones cuando contratás como particular; antes de firmar, pedí por escrito cuáles son.',
    },
  ]
}

function TarjetaPrepaga({ o }: { o: OpcionPrepaga }) {
  const p = o.prepaga
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-gray-900">{p.nombre}</h3>
        <span className="text-sm font-bold text-[#E8002D] tabular-nums whitespace-nowrap">{precioDesde(o)}</span>
      </div>
      {o.desde && (
        <p className="text-xs text-gray-500 mt-0.5">
          {o.desde.plan.nombre}, 30 años, {o.desde.oficial ? 'precio de lista oficial' : 'precio de referencia'}
        </p>
      )}
      {o.zona ? (
        <>
          <p className="text-sm text-gray-600 leading-relaxed mt-3">{o.zona.resumen}</p>
          {o.zona.cartillaLocal.length > 0 && (
            <ul className="mt-3 space-y-1">
              {o.zona.cartillaLocal.slice(0, 3).map((c) => (
                <li key={c} className="text-xs text-gray-600 flex gap-1.5"><span className="text-green-600">✓</span>{c}</li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p className="text-sm text-gray-600 leading-relaxed mt-3">{p.descripcion}</p>
      )}
      <div className="flex flex-wrap gap-2 mt-auto pt-4">
        <Link href={`/prepagas/${p.slug}`} className={`${ATRIBUTOS} bg-gray-100 text-gray-700 hover:bg-gray-200`}>Ver planes y precios</Link>
        <Link href={`/comparador?prepaga=${p.slug}&desde=complementaria`} className={`${ATRIBUTOS} bg-[#E8002D] text-white hover:bg-[#B8001F]`}>Cotizar {p.nombre}</Link>
      </div>
    </div>
  )
}

function Faq({ items, titulo }: { items: { q: string; a: string }[]; titulo: string }) {
  return (
    <section className="py-10 bg-white border-t border-gray-100">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-5">{titulo}</h2>
        <div className="space-y-2">
          {items.map(({ q, a }) => (
            <details key={q} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
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
  )
}

const jsonLdFaq = (items: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
})

function Migas({ items }: { items: { nombre: string; href?: string }[] }) {
  return (
    <div className="bg-gray-50 border-b border-gray-100 py-3">
      <div className="container">
        <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
          {items.map((it, i) => (
            <span key={it.nombre} className="flex items-center gap-1">
              {i > 0 && <span className="text-gray-300">›</span>}
              {it.href ? <Link href={it.href} className="hover:text-[#E8002D]">{it.nombre}</Link> : <span className="text-gray-700">{it.nombre}</span>}
            </span>
          ))}
        </nav>
      </div>
    </div>
  )
}

export const tituloComplementaria = (d: DatosComplementaria) => `Prepaga para afiliados a ${d.os.nombre}: cuánto cuesta y cuál conviene (2026)`

export function PaginaPrepagaComplementaria({ d }: { d: DatosComplementaria }) {
  const n = d.os.nombre
  const url = urlComplementaria(d.os.slug)
  const faq = faqComplementaria(d)
  const min = desdeMinimo(d.opciones)
  const hrefCotizar = d.provincia
    ? `/comparador?zona=${d.provincia.zonaKey}&desde=complementaria`
    : '/comparador?desde=complementaria'
  const otras = OS_COMPLEMENTARIA.filter((s) => s !== d.os.slug)
    .map((s) => obrasSociales.find((o) => o.slug === s))
    .filter((o): o is NonNullable<typeof o> => !!o)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: tituloComplementaria(d),
      url: `${SITE_URL}${url}`,
      author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      dateModified: '2026-10-18',
      inLanguage: 'es-AR',
      about: { '@type': 'Organization', name: n },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Obras Sociales', item: `${SITE_URL}/obras-sociales` },
        { '@type': 'ListItem', position: 3, name: n, item: `${SITE_URL}/obras-sociales/${d.os.slug}` },
        { '@type': 'ListItem', position: 4, name: 'Prepaga para afiliados' },
      ],
    },
    jsonLdFaq(faq),
  ]

  return (
    <>
      <BarraCotizar titulo={`Prepaga además de ${n}`} origen={`complementaria:${d.os.slug}`} href={hrefCotizar} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(jsonLd) }} />
      <Migas items={[{ nombre: SITE_NAME, href: '/' }, { nombre: 'Obras Sociales', href: '/obras-sociales' }, { nombre: n, href: `/obras-sociales/${d.os.slug}` }, { nombre: 'Prepaga para afiliados' }]} />

      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-10">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <ObraSocialIcon slug={d.os.slug} size="lg" />
            <Link href={URL_HUB_COMPLEMENTARIA} className="text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full">Prepaga complementaria</Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">{tituloComplementaria(d)}</h1>
          <p className="text-gray-700 leading-relaxed mt-4 max-w-3xl">
            <strong>Respuesta corta:</strong> sí, podés tener {n} y una prepaga a la vez. Tus aportes a {n} no se pueden pasar a una prepaga,
            así que la prepaga se contrata aparte, como particular, y {n} sigue igual.
            {min && <> El plan más barato entre las prepagas con red{d.provincia ? ` en ${d.provincia.nombre}` : ' nacional'} arranca en <strong>{formatPrecio(min.desde!.plan.precio)}/mes</strong> para una persona de 30 años ({min.prepaga.nombre} {min.desde!.plan.nombre}, {PRECIO_ACTUALIZADO.toLowerCase()}).</>}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-lg font-bold text-green-700">Sí</div>
              <div className="text-xs text-gray-500 mt-0.5">Tener {n} y prepaga a la vez</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-lg font-bold text-[#E8002D]">No</div>
              <div className="text-xs text-gray-500 mt-0.5">Pasar los aportes de {n}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-lg font-bold text-gray-900 tabular-nums">{min ? formatPrecio(min.desde!.plan.precio) : 'A cotizar'}</div>
              <div className="text-xs text-gray-500 mt-0.5">Desde, por mes (30 años)</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Por qué los afiliados a {n} suman una prepaga</h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
            {n} es la obra social de {quienes(d)}: no se elige ni se deja. Quien quiere otra cartilla, otros sanatorios o cobertura fuera
            de {d.provincia ? 'la provincia' : 'su red'} no tiene cómo cambiarla, y la única salida es contratar una prepaga por su cuenta.
            Lo que la propia ficha de {n} marca como límites:
          </p>
          {d.os.contras.length > 0 && (
            <ul className="mt-4 space-y-2">
              {d.os.contras.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <span className="text-[#E8002D] font-bold">•</span>{c}
                </li>
              ))}
            </ul>
          )}
          <p className="text-sm text-gray-600 leading-relaxed max-w-3xl mt-4">
            Con una prepaga encima elegís en cada caso: {n} para lo que ya te resuelve y la prepaga para los sanatorios y especialistas de su cartilla.
            {' '}<Link href={`/obras-sociales/${d.os.slug}`} className="font-semibold text-gray-800 hover:text-[#E8002D] hover:underline">Ver la ficha completa de {n} →</Link>
          </p>
        </div>
      </section>

      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900">{d.provincia ? `Prepagas con red en ${d.provincia.nombre}` : 'Prepagas con red nacional'}</h2>
          <p className="text-sm text-gray-600 mt-1 mb-5 max-w-3xl">
            Precio de lista del plan más barato de cada una para una persona de 30 años, según el cuadro tarifario oficial de la Superintendencia de Servicios de Salud ({PRECIO_ACTUALIZADO.toLowerCase()}). Como contratás como particular, este es el precio que pagás: no se descuenta nada de {n}.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {d.opciones.map((o) => <TarjetaPrepaga key={o.prepaga.slug} o={o} />)}
          </div>
          <div className="flex flex-wrap gap-2 mt-5 text-sm">
            <Link href="/calculadora" className="px-4 py-2 rounded-full border border-gray-200 bg-white hover:border-[#E8002D] text-gray-700">Precio según tu edad →</Link>
            <Link href="/prepagas-economicas" className="px-4 py-2 rounded-full border border-gray-200 bg-white hover:border-[#E8002D] text-gray-700">Planes más baratos →</Link>
            {d.provincia && <Link href={`/prepagas/${d.provincia.slug}`} className="px-4 py-2 rounded-full border border-gray-200 bg-white hover:border-[#E8002D] text-gray-700">Todas las prepagas en {d.provincia.nombre} →</Link>}
          </div>
        </div>
      </section>

      <CtaMedio titulo={`¿Tenés ${n}? Mirá cuánto te sale una prepaga aparte`} href={hrefCotizar} boton="Cotizar gratis" />

      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cómo pagar menos si ya aportás a {n}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-2">Plan con copagos o red cerrada</h3>
              <p className="text-sm text-gray-600 leading-relaxed">La cuota baja y {n} te sigue cubriendo lo que el plan no incluya. <Link href="/guias/copago-en-prepagas-que-es" className="text-[#E8002D] hover:underline">Qué es el copago</Link>.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-2">Todo el grupo en un plan</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Sumar cónyuge e hijos a un solo plan sale menos que planes separados. <Link href="/para/familias" className="text-[#E8002D] hover:underline">Prepagas para familias</Link>.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-2">Deducila de Ganancias</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Hasta el 5% de tu ganancia neta anual, cargándola en SiRADIG. <Link href="/guias/deducir-prepaga-ganancias" className="text-[#E8002D] hover:underline">Cómo hacerlo</Link>.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Cómo contratarla</h2>
            <ol className="space-y-3 text-sm text-gray-700">
              <li><strong>1. Cotizá con tu edad y tu zona.</strong> El precio de lista cambia por edad y por plan.</li>
              <li><strong>2. Completá la declaración jurada de salud.</strong> <Link href="/declaracion-jurada-de-salud" className="text-[#E8002D] hover:underline">Qué te preguntan</Link>.</li>
              <li><strong>3. Pedí por escrito las carencias.</strong> Como particular pueden fijar esperas para algunas prestaciones. <Link href="/guias/prepaga-sin-periodo-carencia" className="text-[#E8002D] hover:underline">Cuáles son</Link>.</li>
              <li><strong>4. Seguí con {n}.</strong> No hay que avisarle ni hacer ningún trámite.</li>
            </ol>
          </div>
          <LeadFormInline titulo={`Te cotizamos una prepaga sin tocar ${n}`} fuente={`complementaria-${d.os.slug}`} />
        </div>
      </section>

      <Faq items={faq} titulo={`Preguntas frecuentes: ${n} y prepaga`} />

      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Prepaga para afiliados a otras obras sociales provinciales</h2>
          <div className="flex flex-wrap gap-2">
            {otras.map((o) => (
              <Link key={o.slug} href={urlComplementaria(o.slug)} className="text-xs px-3 py-1.5 bg-white text-gray-700 border border-gray-200 rounded-full hover:border-red-200 hover:text-[#E8002D] font-medium">
                {o.nombre} →
              </Link>
            ))}
            <Link href={URL_HUB_COMPLEMENTARIA} className="text-xs px-3 py-1.5 bg-white text-[#E8002D] border border-red-200 rounded-full font-semibold">Ver todas →</Link>
          </div>
        </div>
      </section>
    </>
  )
}

// ── Hub /obras-sociales/prepaga-complementaria ──────────────────────────────

export const TITULO_HUB = 'Prepaga complementaria para obras sociales provinciales: cómo funciona y cuánto cuesta'

export const FAQ_HUB = [
  {
    q: '¿Qué es una prepaga complementaria?',
    a: 'Es una prepaga que contratás de tu bolsillo además de la obra social que ya tenés. Se usa sobre todo cuando la obra social es obligatoria y no se puede cambiar, como las provinciales (IOMA, APROSS, IAPOS, OSEP y otras) o la de las Fuerzas Armadas: el aporte sigue yendo ahí y la prepaga se paga aparte.',
  },
  {
    q: '¿Por qué no puedo derivar los aportes de una obra social provincial?',
    a: 'Porque las obras sociales provinciales tienen régimen propio: no figuran con código en el Registro Nacional de Agentes del Seguro de la Superintendencia de Servicios de Salud, y la opción de cambio solo funciona entre las que están en ese registro. Por eso, si trabajás para el Estado provincial, la única forma de tener una prepaga es contratarla como particular.',
  },
  {
    q: '¿Me conviene un plan completo o uno más barato?',
    a: 'Como ya tenés una cobertura de base, muchos eligen un plan con copagos o de red cerrada: la cuota es más baja y la obra social sigue cubriendo lo que el plan no incluya. Si querés un sanatorio puntual, fijate primero que esté en la cartilla del plan.',
  },
  {
    q: '¿La prepaga me cobra distinto por tener otra obra social?',
    a: 'No. El precio de lista depende de la edad y del plan, no de la obra social que tengas. Lo que cuenta, como para cualquiera, es la declaración jurada de salud de cada integrante.',
  },
  {
    q: '¿Puedo deducir la prepaga de Ganancias?',
    a: 'Sí. Las cuotas que pagás de tu bolsillo se pueden deducir hasta el 5% de la ganancia neta anual. Si sos empleado público, las cargás en SiRADIG.',
  },
]

export function PaginaHubComplementaria({ items }: { items: { d: DatosComplementaria; desde: OpcionPrepaga | null }[] }) {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: TITULO_HUB,
      itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: `Prepaga para afiliados a ${it.d.os.nombre}`, url: `${SITE_URL}${urlComplementaria(it.d.os.slug)}` })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Obras Sociales', item: `${SITE_URL}/obras-sociales` },
        { '@type': 'ListItem', position: 3, name: 'Prepaga complementaria' },
      ],
    },
    jsonLdFaq(FAQ_HUB),
  ]
  return (
    <>
      <BarraCotizar titulo="Prepaga además de tu obra social" origen="complementaria:hub" href="/comparador?desde=complementaria" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(jsonLd) }} />
      <Migas items={[{ nombre: SITE_NAME, href: '/' }, { nombre: 'Obras Sociales', href: '/obras-sociales' }, { nombre: 'Prepaga complementaria' }]} />

      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-10">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">{TITULO_HUB}</h1>
          <p className="text-gray-700 leading-relaxed mt-4 max-w-3xl">
            <strong>Respuesta corta:</strong> si sos empleado público provincial, docente, policía de la provincia o militar, tu obra social es obligatoria
            y no podés pasar tus aportes a una prepaga. Lo que sí podés es contratar una prepaga aparte, como particular, y quedarte con las dos.
            Elegí tu obra social y te mostramos qué prepagas tienen red en tu provincia y cuánto cuestan.
          </p>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Elegí tu obra social</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map(({ d, desde }) => (
              <Link key={d.os.slug} href={urlComplementaria(d.os.slug)} className="group rounded-2xl border border-gray-200 p-4 hover:border-[#E8002D] transition-colors flex items-start gap-3">
                <ObraSocialIcon slug={d.os.slug} />
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 group-hover:text-[#E8002D]">{d.os.nombre}</div>
                  <div className="text-xs text-gray-500">{d.provincia ? d.provincia.nombre : 'Fuerzas Armadas'}</div>
                  {desde?.desde && <div className="text-xs text-gray-700 mt-1">Prepaga desde {formatPrecio(desde.desde.plan.precio)}/mes</div>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaMedio titulo="¿Ya sabés qué querés? Cotizá tu prepaga" href="/comparador?desde=complementaria" boton="Cotizar gratis" />

      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Cómo funciona</h2>
            <ul className="space-y-3 text-sm text-gray-700">
              <li><strong>Tu obra social sigue igual.</strong> El aporte se descuenta del sueldo como siempre.</li>
              <li><strong>La prepaga se paga aparte.</strong> Al precio de lista según tu edad y el plan. <Link href="/precios" className="text-[#E8002D] hover:underline">Ver precios</Link>.</li>
              <li><strong>Usás la que te convenga.</strong> En cada consulta o internación elegís con qué cobertura atenderte.</li>
              <li><strong>Podés bajar el costo.</strong> Con un plan con copagos, sumando a la familia o deduciendo de Ganancias. <Link href="/guias/deducir-prepaga-ganancias" className="text-[#E8002D] hover:underline">Cómo deducirla</Link>.</li>
            </ul>
          </div>
          <LeadFormInline titulo="Te cotizamos una prepaga sin tocar tu obra social" fuente="complementaria-hub" />
        </div>
      </section>

      <Faq items={FAQ_HUB} titulo="Preguntas frecuentes sobre la prepaga complementaria" />
    </>
  )
}
