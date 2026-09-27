import type { Metadata } from 'next'
import Link from 'next/link'
import { prepagas, PRECIO_ACTUALIZADO, nivelPrecio } from '@/lib/data/prepagas'
import { CARTILLAS } from '@/lib/data/cartilla-zonas'
import { preciosParaGrupo } from '@/lib/precios/motor'
import { sanatoriosAmba } from '@/lib/planes-comparacion'
import { SITE_URL, formatPrecio } from '@/lib/utils'
import { NivelPrecioBadge } from '@/components/ui/NivelPrecioBadge'
import { Button } from '@/components/ui/Button'
import { BreadcrumbSchema } from '@/components/ui/BreadcrumbSchema'
import type { Plan, Prepaga } from '@/types'

// Solo precios oficiales (27-sep-2026): el ranking mezclaba precios de
// referencia sin cuadro de la SSSalud (Medicus, Luis Pasteur, Hominis, OSDE
// Flux) con los oficiales. Las prepagas sin precio oficial se nombran aparte.
// Suma "buenas y baratas" (sanatorios del plan de entrada en AMBA, de la
// cartilla oficial) y "para jóvenes" (orden a los 25 años con la escala que
// cada prepaga declara): GSC tenía "que prepaga es buena y barata", "mejor
// prepaga precio calidad" y "prepagas económicas para jóvenes" en 4-9 sin
// clics. Para jóvenes se muestra el orden, no el precio por edad: el precio
// exacto se da después de cotizar (decisión de Darío, 24-sep-2026).
const oficiales = (p: Prepaga) => p.planes.filter((pl) => pl.fuentePrecio === 'sssalud')
const porPrecio = (a: Plan, b: Plan) => a.precio - b.precio

// Ranking real por precio oficial del plan más económico de cada prepaga —
// mismos datos que /ranking, con su propia URL y título enfocados en la
// keyword (700 búsquedas/mes, rankeaba mal como sección enterrada dentro de
// /ranking — pedido de Darío, 21-sep-2026).
const rankingPrecio = prepagas
  .filter((p) => oficiales(p).length > 0)
  .map((p) => ({ prep: p, planMinimo: [...oficiales(p)].sort(porPrecio)[0] }))
  .sort((a, b) => a.planMinimo.precio - b.planMinimo.precio)
const sinPrecioOficial = prepagas.filter((p) => oficiales(p).length === 0)

// El template del layout ya agrega "| PrepagaYa". "Baratas" y "buenas" son
// las otras formas en que se busca. El precio "desde" sale de los datos.
const PRECIO_MINIMO = rankingPrecio[0].planMinimo.precio
export const metadata: Metadata = {
  title: `Prepagas baratas y buenas: ranking ${PRECIO_ACTUALIZADO.toLowerCase()}`,
  description: `Las prepagas más baratas de Argentina por precio oficial, desde ${formatPrecio(PRECIO_MINIMO)}/mes, y cuáles son buenas y baratas: sanatorios del plan de entrada, copagos y opciones para jóvenes.`,
  alternates: { canonical: `${SITE_URL}/prepagas-economicas` },
  keywords: ['prepagas economicas', 'prepagas baratas', 'prepaga buena y barata', 'prepaga mas barata argentina', 'mejor prepaga precio calidad', 'prepagas economicas para jovenes', 'prepagas economicas caba'],
}

const economicas = rankingPrecio.filter((r) => nivelPrecio(r.planMinimo.precio) === 'economico')
const masBarata = rankingPrecio[0]
const swissMedical = prepagas.find((p) => p.slug === 'swiss-medical')!
const swissS1 = swissMedical.planes.find((p) => p.slug === 's1')!
const swissS2 = swissMedical.planes.find((p) => p.slug === 's2')!

// Buenas y baratas: para cada prepaga con cartilla oficial relevada, el plan
// oficial más barato y el más barato sin copago, con sus sanatorios en AMBA.
interface FilaBuena { prep: Prepaga; plan: Plan; sanatorios: number }
const conSanatorios = (prep: Prepaga, planes: Plan[]): FilaBuena | undefined => {
  for (const plan of [...planes].sort(porPrecio)) {
    const n = sanatoriosAmba(prep.slug, plan.slug)
    if (n) return { prep, plan, sanatorios: n }
  }
  return undefined
}
const buenasYBaratas = Object.keys(CARTILLAS)
  .map((slug) => prepagas.find((p) => p.slug === slug))
  .filter((p): p is Prepaga => Boolean(p) && oficiales(p!).length > 0)
  .map((prep) => {
    const entrada = conSanatorios(prep, oficiales(prep))
    const sinCopago = conSanatorios(prep, oficiales(prep).filter((pl) => !pl.copago))
    return { prep, entrada, sinCopago: sinCopago && sinCopago.plan !== entrada?.plan ? sinCopago : undefined }
  })
  .filter((x): x is { prep: Prepaga; entrada: FilaBuena; sinCopago: FilaBuena | undefined } => Boolean(x.entrada))
  .sort((a, b) => a.entrada.plan.precio - b.entrada.plan.precio)
const entradaConMasSanatorios = [...buenasYBaratas].sort((a, b) => b.entrada.sanatorios - a.entrada.sanatorios)[0]?.entrada
const sinCopagoMasBarato = rankingPrecio
  .flatMap((r) => oficiales(r.prep).filter((pl) => !pl.copago).map((plan) => ({ prep: r.prep, plan })))
  .sort((a, b) => a.plan.precio - b.plan.precio)[0]

// Para jóvenes: el plan más barato de cada prepaga para una persona de 25
// años en CABA, con la escala por edad declarada ante la SSSalud (sin precio).
const EDAD_JOVEN = 25
const jovenes = (() => {
  const precios = preciosParaGrupo([EDAD_JOVEN], 'caba')
  const vistos = new Set<string>()
  const out: { prep: Prepaga; plan: Plan }[] = []
  for (const [clave] of Object.entries(precios).sort((a, b) => a[1] - b[1])) {
    const [prepSlug, planSlug] = clave.split('/')
    if (vistos.has(prepSlug)) continue
    const prep = prepagas.find((p) => p.slug === prepSlug)
    const plan = prep?.planes.find((pl) => pl.slug === planSlug)
    if (!prep || !plan) continue
    vistos.add(prepSlug)
    out.push({ prep, plan })
  }
  return out.slice(0, 5)
})()

const faqs = [
  {
    q: '¿Cuál es la prepaga más barata de Argentina?',
    a: `Con precio oficial, ${masBarata.prep.nombre} con el ${masBarata.planMinimo.nombre}: ${formatPrecio(masBarata.planMinimo.precio)}/mes para una persona de 30 años en CABA y GBA (${PRECIO_ACTUALIZADO}, cuadros que cada prepaga declara ante la Superintendencia de Servicios de Salud). El precio exacto varía por edad y zona: cotizalo gratis para ver el tuyo.`,
  },
  {
    q: '¿Qué prepaga es buena y barata?',
    a: `Depende de qué necesites, pero hay dos datos objetivos para mirar además del precio: cuántos sanatorios con internación tiene el plan en tu zona y si cobra copagos. Entre los planes de entrada con cartilla oficial relevada, el que más sanatorios tiene en AMBA es ${entradaConMasSanatorios ? `${entradaConMasSanatorios.prep.nombre} ${entradaConMasSanatorios.plan.nombre} (${entradaConMasSanatorios.sanatorios})` : 'el de la tabla de arriba'}${sinCopagoMasBarato ? `, y el plan sin copago más barato es ${sinCopagoMasBarato.prep.nombre} ${sinCopagoMasBarato.plan.nombre} (${formatPrecio(sinCopagoMasBarato.plan.precio)}/mes)` : ''}. Si ya tenés sanatorios de confianza, buscalos en nuestro buscador por sanatorio.`,
  },
  {
    q: '¿Cuál es la prepaga más barata para jóvenes?',
    a: `Para una persona de ${EDAD_JOVEN} años en CABA, con la escala por edad que cada prepaga declara ante la SSSalud, el plan más barato es ${jovenes[0] ? `${jovenes[0].prep.nombre} ${jovenes[0].plan.nombre}` : 'el de la lista de arriba'}. Cada prepaga tiene su propia escala: por eso el orden cambia con la edad.`,
  },
  {
    q: '¿Cuál es la obra social más barata?',
    a: 'Si trabajás en relación de dependencia, la obra social no tiene costo extra: se paga con tus aportes, y podés elegir cuál. Si sos monotributista, el componente de obra social depende de tu categoría y es el mismo para cualquier obra social del listado. Si pagás una prepaga como particular, arriba tenés las más baratas con precio oficial.',
  },
  {
    q: '¿Las prepagas baratas cubren internación y oncología?',
    a: 'Sí. El PMO obliga por ley a todas las prepagas a cubrir internación, tratamientos oncológicos y urgencias, sin importar el precio del plan. La diferencia entre un plan económico y uno premium está en la cartilla, los copagos y las prestaciones superadoras — nunca en el PMO.',
  },
  {
    q: '¿Qué se resigna en una prepaga económica?',
    a: 'Principalmente tres cosas: cartilla más chica (menos especialistas y sanatorios para elegir), copagos en consultas y estudios, y cobertura geográfica más acotada que las prepagas grandes. Lo que no se resigna es el piso legal del PMO.',
  },
  {
    q: '¿Conviene una prepaga económica o quedarse en la obra social?',
    a: 'Si tu obra social tiene buena red en tu zona, quedarte ahí no tiene costo adicional. Pasarte a una prepaga económica conviene cuando tu obra social está saturada o tiene mala cartilla, y buscás turnos más rápidos sin pagar un plan premium.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Ranking de Prepagas Económicas Argentina ${PRECIO_ACTUALIZADO}`,
    description: 'Ranking de las prepagas más baratas de Argentina por precio de lista.',
    numberOfItems: economicas.length,
    itemListElement: economicas.map((r, i) => ({
      '@type': 'ListItem', position: i + 1, name: r.prep.nombre, url: `${SITE_URL}/prepagas/${r.prep.slug}`,
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  },
]

export default function PrepagasEconomicasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-gradient-to-b from-gray-50 to-white py-12 border-b border-gray-200">
        <div className="container">
          <div className="mb-4">
            <BreadcrumbSchema crumbs={[{ label: 'Prepagas económicas' }]} />
          </div>
          <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 mb-4">
            Ranking por precio · {PRECIO_ACTUALIZADO}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Prepagas económicas: las más baratas y las buenas y baratas
          </h1>
          <p className="text-gray-600 max-w-2xl leading-relaxed">
            Una prepaga no tiene por qué costar medio millón de pesos: hoy hay opciones desde{' '}
            <strong>{formatPrecio(masBarata.planMinimo.precio)}/mes</strong> que cubren el PMO completo, el mismo piso legal que cubre el plan más caro del mercado. La diferencia está en la cartilla, los sanatorios y los copagos — no en la cobertura que exige la ley.
          </p>
        </div>
      </section>

      <div className="container py-12 max-w-3xl mx-auto">
        {/* Ranking */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-1">El podio de precios</h2>
          <p className="text-sm text-gray-500 mb-6">Ordenadas por el precio oficial del plan más económico de cada prepaga: una persona de 30 años, contratación individual en CABA y GBA, {PRECIO_ACTUALIZADO}.</p>
          <div className="space-y-3">
            {rankingPrecio.slice(0, 10).map((r, i) => (
              <Link
                key={r.prep.slug}
                href={`/prepagas/${r.prep.slug}`}
                className="flex items-center gap-4 bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md hover:border-red-200 transition-all group"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold border flex-shrink-0 text-sm ${
                  i === 0 ? 'bg-amber-100 text-amber-700 border-amber-200' : i === 1 ? 'bg-gray-100 text-gray-600 border-gray-200' : i === 2 ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-gray-50 text-gray-500 border-gray-100'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900 group-hover:text-[#E8002D] transition-colors">{r.prep.nombre}</h3>
                    {i === 0 && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">Más económica</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{r.planMinimo.nombre} · {r.planMinimo.copago ? 'Con copago' : 'Sin copago'}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-gray-900">{formatPrecio(r.planMinimo.precio)}</div>
                  <NivelPrecioBadge nivel={nivelPrecio(r.planMinimo.precio)} />
                </div>
              </Link>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Cuadros tarifarios que cada prepaga declara ante la Superintendencia de Servicios de Salud, con IVA, {PRECIO_ACTUALIZADO}. Con el descuento por contratación online (15%, o 25% si sos monotributista) el valor baja más — cotizá tu precio exacto según tu edad y zona.
            {sinPrecioOficial.length > 0 && <> {sinPrecioOficial.map((p) => p.nombre).join(', ').replace(/, ([^,]*)$/, ' y $1')} no están en el ranking porque no tenemos su precio oficial: te las cotizamos igual.</>}
          </p>
        </section>

        {/* Buenas y baratas */}
        {buenasYBaratas.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Buenas y baratas: qué te da el plan de entrada de cada una</h2>
            <p className="text-sm text-gray-500 mb-5">
              Barata no alcanza: mirá cuántos sanatorios con internación tiene el plan en tu zona y si cobra copagos. Sanatorios y clínicas con internación en CABA y GBA según la cartilla oficial de cada prepaga; precio oficial para 30 años.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Plan</th>
                    <th className="px-4 py-3 font-semibold text-right">Precio</th>
                    <th className="px-4 py-3 font-semibold text-right">Sanatorios en AMBA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {buenasYBaratas.flatMap(({ prep, entrada, sinCopago }) => [entrada, sinCopago].filter((f): f is NonNullable<typeof f> => Boolean(f)).map((f) => (
                    <tr key={`${prep.slug}/${f.plan.slug}`}>
                      <td className="px-4 py-3">
                        <Link href={`/prepagas/${prep.slug}/${f.plan.slug}`} className="font-semibold text-gray-900 hover:text-[#E8002D]">{prep.nombre} {f.plan.nombre}</Link>
                        <div className={`text-xs mt-0.5 ${f.plan.copago ? 'text-gray-500' : 'text-green-700 font-semibold'}`}>{f.plan.copago ? 'Con copago' : 'Sin copago'}</div>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">{formatPrecio(f.plan.precio)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{f.sanatorios}</td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Para cada prepaga con cartilla oficial relevada, el plan más barato y, si es otro, el más barato sin copago. Contamos sanatorios y clínicas con internación del plan en CABA y GBA; en el interior la red cambia.{' '}
              <Link href="/buscar-por-sanatorio" className="underline hover:text-gray-600">Buscá tus sanatorios</Link> para ver qué plan los tiene.
            </p>
          </section>
        )}

        {/* Para jóvenes */}
        {jovenes.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Prepagas económicas para jóvenes</h2>
            <p className="text-sm text-gray-500 mb-5">
              Las más baratas para una persona de {EDAD_JOVEN} años en CABA, según la escala por edad que cada prepaga declara ante la SSSalud. Cada una tiene su propia escala, así que el orden cambia con la edad.
            </p>
            <ol className="space-y-2">
              {jovenes.map((j, i) => (
                <li key={j.prep.slug}>
                  <Link href={`/prepagas/${j.prep.slug}/${j.plan.slug}`} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 hover:border-red-200">
                    <span className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">{i + 1}</span>
                    <span className="font-semibold text-gray-900">{j.prep.nombre} {j.plan.nombre}</span>
                    <span className="ml-auto text-xs text-gray-500">{j.plan.copago ? 'Con copago' : 'Sin copago'}</span>
                  </Link>
                </li>
              ))}
            </ol>
            <Link href="/comparador" className="inline-block mt-3 text-sm font-bold text-[#E8002D] hover:underline">Ver mi precio exacto por edad →</Link>
          </section>
        )}

        {/* Entrada accesible a premium */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-1">¿Preferís quedarte en una prepaga premium pagando lo menos posible?</h2>
          <p className="text-sm text-gray-500 mb-6">
            {swissMedical.nombre} S1 y S2 no son los planes más baratos del mercado — esos son los del ranking de arriba — pero sí el escalón de entrada más accesible dentro de una prepaga con sanatorios propios y cartilla premium.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[swissS1, swissS2].map((plan) => (
              <Link key={plan.slug} href={`/prepagas/swiss-medical/${plan.slug}`}
                className="bg-white rounded-2xl border border-gray-200 p-4 hover:border-red-200 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
                  <span className="font-bold text-gray-900">{swissMedical.nombre} {plan.nombre}</span>
                  <span className="text-sm font-bold text-[#E8002D]">{formatPrecio(plan.precio)}/mes</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{plan.descripcion}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Qué resignás */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Qué resignás en una prepaga económica (y qué no)</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Tres cosas, principalmente: cartilla más chica (menos opciones de especialistas y sanatorios), copagos en consultas y estudios, y cobertura geográfica más acotada que las prepagas grandes — varias de las opciones más económicas concentran su red en CABA, GBA y algunas capitales de provincia.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Lo que <strong>no</strong> resignás es el PMO: internación sin límite de días, oncología al 100%, maternidad y urgencias están cubiertos por ley igual que en un plan premium. La cobertura mínima es idéntica; lo que cambia con el precio es todo lo que está por encima de ese piso.
          </p>
        </section>

        {/* Para quién */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Para quién tiene sentido una prepaga económica</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Son ideales para jóvenes sanos que quieren cobertura real sin pagar una red premium que no usan, monotributistas de categorías bajas, y como cobertura puente mientras mejorás ingresos.
          </p>
          <p className="text-gray-600 leading-relaxed">
            No son la mejor opción si tenés una condición crónica que requiere especialistas frecuentes, si vivís fuera de la zona de cobertura de la empresa, o si priorizás pediatría con turnos inmediatos para hijos chicos.
          </p>
        </section>

        {/* El truco */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3">El truco para bajar el precio sin bajar de prepaga</h2>
          <p className="text-gray-600 leading-relaxed">
            Antes de cambiarte a una prepaga más barata, mirá el plan de entrada de tu prepaga actual: bajar de plan dentro de la misma empresa conserva tu antigüedad y tu historia clínica. También compará la modalidad de pago — si estás como particular y podés derivar aportes (relación de dependencia o monotributo), el mismo plan puede bajar 30-40%.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
          <div className="space-y-2">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-sm text-gray-900 select-none list-none">
                  <h3 className="font-semibold text-sm text-gray-900 m-0">{q}</h3>
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* Cross-links */}
        <div className="flex flex-wrap gap-3 mb-10 text-sm">
          {/* La guía /guias/prepagas-economicas se consolidó en esta página
              (redirige acá): el link apuntaba a sí misma. */}
          <Link href="/precios" className="text-[#E8002D] font-semibold hover:underline">
            → Tabla oficial de precios de todos los planes
          </Link>
          <Link href="/ranking" className="text-[#E8002D] font-semibold hover:underline">
            → Ver el ranking general por satisfacción
          </Link>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">¿Cuál de estas te conviene a vos?</h2>
          <p className="text-red-100 mb-6">
            El precio de lista es orientativo — tu precio exacto depende de tu edad, tu zona y tu grupo familiar. Cotizalo gratis.
          </p>
          <Button href="/comparador" variant="secondary" size="lg">
            Cotizar gratis en 2 minutos →
          </Button>
        </div>
      </div>
    </>
  )
}
