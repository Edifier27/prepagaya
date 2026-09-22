import Link from 'next/link'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import {
  combinacionesPlanZona,
  indiceZonas,
  nombreCortoZona,
  slugPlan,
  textoFecha,
  zonasAmba,
  zonasPorProvincia,
  type CartillaPrepaga,
  type CentroCartilla,
  type ZonaCartilla,
} from '@/lib/data/cartilla-zonas'
import type { PlanCartilla } from '@/lib/cartilla-zonas-geo'
import { CentrosLista, UpsellPlanes, centrosConPlanSuperior } from '@/components/cartillas/CentrosLista'
import { BuscadorCartillaZona } from '@/components/cartillas/BuscadorCartillaZona'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'

// Páginas del silo de cartilla por zona (estructura silo: /cartillas →
// /cartillas/[prepaga] → /cartillas/[prepaga]/[zona | plan-x] →
// /cartillas/[prepaga]/plan-x/[zona]). Enlazado solo hacia arriba y entre
// hermanos del mismo silo; hacia afuera únicamente el CTA de cotización.
// Todo el contenido sale de lib/data/cartilla-zonas (fuente oficial de cada
// prepaga) — los textos son plantillas sobre esos datos, sin afirmaciones
// que no estén en la cartilla.

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

export function mesAnio(c: CartillaPrepaga): string {
  const [, mes, anio] = c.vigencia.split('/')
  return mes ? `${MESES[Number(mes) - 1]} ${anio}` : ''
}
export function anio(c: CartillaPrepaga): string {
  return c.vigencia.split('/')[2] ?? ''
}
/** "Plan 210" → "210"; "Integral (AS200/AS204)" → "Integral" */
export function planCorto(p: PlanCartilla): string {
  return p.label.replace(/^Plan /, '').replace(/ \(.*\)$/, '')
}

function contar(centros: CentroCartilla[], plan?: string) {
  const f = (arr: string[]) => (plan ? arr.includes(plan) : arr.length > 0)
  return {
    internacion: centros.filter((c) => f(c.internacion)).length,
    guardia: centros.filter((c) => f(c.guardia)).length,
  }
}

function soloPlan(centros: CentroCartilla[], plan: string): CentroCartilla[] {
  return centros
    .filter((c) => c.internacion.includes(plan) || c.guardia.includes(plan))
    .map((c) => ({ ...c, internacion: c.internacion.includes(plan) ? c.internacion : [], guardia: c.guardia.includes(plan) ? c.guardia : [] }))
}

function listaNombres(centros: CentroCartilla[], max = 6): string {
  const n = centros.map((c) => c.nombre)
  if (n.length <= max) return n.join(', ')
  return `${n.slice(0, max).join(', ')} y ${n.length - max} más`
}

function planesDeZona(c: CartillaPrepaga, z: ZonaCartilla): PlanCartilla[] {
  return c.planes.filter((p) => z.centros.some((ce) => ce.internacion.includes(p.id) || ce.guardia.includes(p.id)))
}

// ─── Piezas comunes ─────────────────────────────────────────────────────────

function Breadcrumb({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <div className="bg-gray-50 border-b border-gray-100 py-3">
      <div className="container">
        <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap" aria-label="Breadcrumb">
          {items.map((it, i) => (
            <span key={it.label} className="flex items-center gap-1">
              {i > 0 && <span className="text-gray-300">›</span>}
              {it.href ? (
                <Link href={it.href} className="hover:text-[#E8002D] transition-colors">{it.label}</Link>
              ) : (
                <span className="text-gray-700">{it.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  )
}

function Faq({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <section className="py-10 bg-gray-50 border-t border-gray-100">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
        <div className="space-y-2">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
              <summary className="flex items-center justify-between p-4 cursor-pointer select-none list-none">
                <h3 className="font-semibold text-sm text-gray-900 m-0">{q}</h3>
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
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

function Chips({ titulo, links }: { titulo: string; links: { href: string; label: string; activo?: boolean }[] }) {
  if (links.length === 0) return null
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-3">{titulo}</h2>
      <div className="flex flex-wrap gap-2">
        {links.map((l) =>
          l.activo ? (
            <span key={l.href} className="text-xs px-3 py-1.5 bg-[#E8002D] text-white border border-[#E8002D] rounded-full font-medium">{l.label}</span>
          ) : (
            <Link key={l.href} href={l.href} className="text-xs px-3 py-1.5 bg-white text-gray-700 border border-gray-200 rounded-full hover:border-red-200 hover:text-[#E8002D] transition-colors font-medium">
              {l.label}
            </Link>
          ),
        )}
      </div>
    </div>
  )
}

function Fuente({ c, extra }: { c: CartillaPrepaga; extra?: string }) {
  return (
    <section className="py-6 bg-white border-t border-gray-100">
      <div className="container max-w-4xl mx-auto text-xs text-gray-400 leading-relaxed">
        Fuente: {c.fuente}, {textoFecha(c)}.{extra ? ` ${extra}` : ''} La disponibilidad de camas y la atención dependen de cada
        institución; antes de atenderte confirmá la cobertura con {c.prepagaNombre} o en su{' '}
        <a href={c.fuenteUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">cartilla oficial</a>.
      </div>
    </section>
  )
}

function jsonLd(data: object[]) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

function ldBreadcrumb(items: { url?: string; name: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, ...(it.url ? { item: it.url } : {}) })),
  }
}

function ldHospitales(nombre: string, centros: CentroCartilla[], provincia?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: nombre,
    itemListElement: centros.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Hospital',
        name: c.nombre,
        ...(c.sedes[0]?.direccion
          ? {
              address: {
                '@type': 'PostalAddress',
                streetAddress: c.sedes[0].direccion,
                ...(c.sedes[0].localidad ? { addressLocality: c.sedes[0].localidad } : {}),
                ...(provincia ? { addressRegion: provincia } : {}),
                addressCountry: 'AR',
              },
            }
          : {}),
        ...(c.sedes[0]?.tel ? { telephone: c.sedes[0].tel } : {}),
      },
    })),
  }
}

function ldFaq(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  }
}

function Cta({ c, plan, zonaCorta, grande }: { c: CartillaPrepaga; plan?: PlanCartilla; zonaCorta?: string; grande?: boolean }) {
  const label = `Cotizar ${c.prepagaNombre}${plan ? ` ${planCorto(plan)}` : ''}${zonaCorta ? ` en ${zonaCorta}` : ''}`
  return (
    <ContratarPlanButton
      prepagaNombre={c.prepagaNombre}
      planNombre={plan?.label}
      fuente="cartilla-zona"
      label={label}
      className={`inline-flex items-center gap-2 ${grande ? 'px-6 py-3' : 'px-5 py-2.5'} bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-md text-sm`}
    />
  )
}

/** Tabla "qué plan necesitás en esta zona": centros por plan (datos de la cartilla). */
function TablaPlanes({ c, z, linkPlan }: { c: CartillaPrepaga; z: ZonaCartilla; linkPlan: (p: PlanCartilla) => string | null }) {
  const filas = planesDeZona(c, z).map((p) => ({ p, ...contar(z.centros, p.id) }))
  if (filas.length < 2) return null
  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden bg-white">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-left font-semibold px-4 py-2.5">Plan</th>
            <th className="text-right font-semibold px-4 py-2.5">Sanatorios internación</th>
            <th className="text-right font-semibold px-4 py-2.5">{c.labelGuardia}</th>
          </tr>
        </thead>
        <tbody>
          {filas.map(({ p, internacion, guardia }) => {
            const href = linkPlan(p)
            return (
              <tr key={p.id} className="border-t border-gray-100">
                <td className="px-4 py-2.5 font-medium text-gray-900">
                  {href ? <Link href={href} className="hover:text-[#E8002D] underline-offset-2 hover:underline">{p.label}</Link> : p.label}
                </td>
                <td className="px-4 py-2.5 text-right text-gray-700">{internacion}</td>
                <td className="px-4 py-2.5 text-right text-gray-700">{guardia}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── /cartillas/[prepaga]/[zona] ────────────────────────────────────────────

export function faqsZona(c: CartillaPrepaga, z: ZonaCartilla) {
  const corto = nombreCortoZona(z.nombre)
  const int = z.centros.filter((ce) => ce.internacion.length > 0)
  const gua = z.centros.filter((ce) => ce.guardia.length > 0)
  const porPlan = planesDeZona(c, z).map((p) => ({ p, n: contar(z.centros, p.id).internacion })).filter((x) => x.n > 0)
  const max = porPlan.reduce((a, b) => (b.n > a.n ? b : a), porPlan[0])
  const min = porPlan.reduce((a, b) => (b.n < a.n ? b : a), porPlan[0])
  const faqs: { q: string; a: string }[] = []
  if (int.length > 0) {
    faqs.push({
      q: `¿Qué sanatorios cubre ${c.prepagaNombre} en ${corto}?`,
      a: `Según la ${textoFecha(c)}, en ${z.nombre} ${c.prepagaNombre} tiene ${int.length} sanatorio${int.length === 1 ? '' : 's'} para internación: ${listaNombres(int)}. Qué sanatorio te toca depende del plan.`,
    })
  }
  if (gua.length > 0) {
    faqs.push({
      q: `¿Dónde hay ${c.labelGuardia.toLowerCase()} de ${c.prepagaNombre} en ${corto}?`,
      a: `En ${z.nombre} figuran ${gua.length} centro${gua.length === 1 ? '' : 's'} con ${c.labelGuardia.toLowerCase()}: ${listaNombres(gua)}.`,
    })
  }
  if (max && min && max.p.id !== min.p.id) {
    faqs.push({
      q: `¿Qué plan de ${c.prepagaNombre} tiene más sanatorios en ${corto}?`,
      a: `En ${z.nombre}, el ${max.p.label} incluye ${max.n} sanatorio${max.n === 1 ? '' : 's'} para internación y el ${min.p.label}, ${min.n}. Más abajo tenés la cantidad para cada plan.`,
    })
  }
  faqs.push({
    q: `¿La cartilla de ${c.prepagaNombre} en ${corto} está actualizada?`,
    a: `Sí: los datos salen del ${c.fuente.replace(/^Buscador/, 'buscador').replace(/^Cartillas/, 'conjunto de cartillas')} (${textoFecha(c)}). Igual, antes de atenderte confirmá con ${c.prepagaNombre}: la cartilla puede cambiar.`,
  })
  return faqs
}

export function PaginaZona({ c, z }: { c: CartillaPrepaga; z: ZonaCartilla }) {
  const corto = nombreCortoZona(z.nombre)
  const base = `/cartillas/${c.prepagaSlug}`
  const cuenta = contar(z.centros)
  const idx = indiceZonas(c.prepagaSlug)
  const yo = idx.find((x) => x.slug === z.slug)
  const combos = new Set(combinacionesPlanZona(c.prepagaSlug).filter((x) => x.zona === z.slug).map((x) => x.plan))
  const linkPlan = (p: PlanCartilla) =>
    combos.has(slugPlan(p.id)) ? `${base}/${slugPlan(p.id)}/${z.slug}` : c.planesConPagina.includes(p.id) ? `${base}/${slugPlan(p.id)}` : null
  const vecinas = idx.filter((o) => o.slug !== z.slug && !o.parte && o.provinciaNombre === yo?.provinciaNombre)
  const partes = idx.filter((o) => o.parte === z.slug)
  const faqs = faqsZona(c, z)
  const int = z.centros.filter((ce) => ce.internacion.length > 0)
  const planes = planesDeZona(c, z)

  return (
    <>
      {jsonLd([
        ldBreadcrumb([
          { name: SITE_NAME, url: SITE_URL },
          { name: 'Cartillas', url: `${SITE_URL}/cartillas` },
          { name: `Cartilla ${c.prepagaNombre}`, url: `${SITE_URL}${base}` },
          { name: corto },
        ]),
        ldHospitales(`Sanatorios de ${c.prepagaNombre} en ${z.nombre}`, int, z.provincias[0]),
        ldFaq(faqs),
      ])}
      <Breadcrumb items={[{ href: '/', label: SITE_NAME }, { href: '/cartillas', label: 'Cartillas' }, { href: base, label: c.prepagaNombre }, { label: corto }]} />

      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-10">
        <div className="container max-w-4xl mx-auto">
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {c.tipoFecha === 'vigencia' ? `Cartilla oficial · vigente al ${c.vigencia}` : `Cartilla oficial · consultada el ${c.vigencia}`}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-3">
            Cartilla {c.prepagaNombre} en {corto}: sanatorios y {c.labelGuardia.toLowerCase()}
          </h1>
          <p className="text-gray-600 leading-relaxed max-w-3xl mb-5">
            En {z.nombre}, la cartilla de {c.prepagaNombre} tiene{' '}
            {cuenta.internacion > 0 && <strong>{cuenta.internacion} sanatorio{cuenta.internacion === 1 ? '' : 's'} para internación</strong>}
            {cuenta.internacion > 0 && cuenta.guardia > 0 && ' y '}
            {cuenta.guardia > 0 && <strong>{cuenta.guardia} centro{cuenta.guardia === 1 ? '' : 's'} con {c.labelGuardia.toLowerCase()}</strong>}
            . Para cada uno te mostramos la dirección, el teléfono y qué planes lo incluyen
            {z.filial ? ` (filial ${z.filial} de ${c.prepagaNombre})` : ''}.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Cta c={c} zonaCorta={corto} grande />
            <Link href={base} className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-semibold rounded-xl transition-all text-sm">
              Buscar en otra zona
            </Link>
          </div>
          {planes.length > 1 && (
            <div className="mt-6">
              <div className="text-xs font-semibold text-gray-500 mb-2">Filtrar por plan:</div>
              <div className="flex flex-wrap gap-2">
                {planes.map((p) => {
                  const href = linkPlan(p)
                  const n = contar(z.centros, p.id)
                  return href ? (
                    <Link key={p.id} href={href} className="text-xs px-3 py-1.5 bg-white text-gray-700 border border-gray-200 rounded-full hover:border-red-200 hover:text-[#E8002D] transition-colors font-semibold">
                      {p.label} <span className="text-gray-400 font-normal">· {n.internacion + n.guardia}</span>
                    </Link>
                  ) : null
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {cuenta.internacion > 0 && (
        <section className="py-10 bg-white">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Sanatorios de {c.prepagaNombre} para internación en {corto}</h2>
            <p className="text-sm text-gray-500 mb-5">En verde, los planes con los que el sanatorio figura en la cartilla para internación.</p>
            <CentrosLista centros={z.centros} seccion="internacion" planes={planes} prepagaSlug={c.prepagaSlug} />
          </div>
        </section>
      )}

      {cuenta.guardia > 0 && (
        <section className="py-10 bg-gray-50 border-t border-gray-100">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{c.labelGuardia} de {c.prepagaNombre} en {corto}</h2>
            <p className="text-sm text-gray-500 mb-5">Centros con {c.labelGuardia.toLowerCase()} que figuran en la cartilla, y con qué planes.</p>
            <CentrosLista centros={z.centros} seccion="guardia" planes={planes} prepagaSlug={c.prepagaSlug} />
          </div>
        </section>
      )}

      {planes.length > 1 && (
        <section className="py-10 bg-white border-t border-gray-100">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-1">¿Qué plan de {c.prepagaNombre} necesitás en {corto}?</h2>
            <p className="text-sm text-gray-500 mb-4">Cantidad de centros que incluye cada plan en {z.nombre}.</p>
            <TablaPlanes c={c} z={z} linkPlan={linkPlan} />
            <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-red-50 border border-red-100 rounded-2xl p-4">
              <p className="text-sm text-gray-700">¿No sabés qué plan te conviene? Te ayudamos a elegir según los sanatorios que usás.</p>
              <Cta c={c} zonaCorta={corto} />
            </div>
          </div>
        </section>
      )}

      <Faq faqs={faqs} />
      <Fuente c={c} />

      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto space-y-6">
          {partes.length > 0 && (
            <Chips titulo={`${corto} por subzona`} links={partes.map((p) => ({ href: `${base}/${p.slug}`, label: nombreCortoZona(p.nombre) }))} />
          )}
          <Chips
            titulo={`Cartilla ${c.prepagaNombre} en otras zonas de ${z.provincias.join(' y ')}`}
            links={vecinas.map((v) => ({ href: `${base}/${v.slug}`, label: nombreCortoZona(v.nombre) }))}
          />
          <Chips
            titulo={`Cartilla ${c.prepagaNombre} por plan`}
            links={c.planesConPagina.map((id) => c.planes.find((p) => p.id === id)!).map((p) => ({ href: `${base}/${slugPlan(p.id)}`, label: p.label }))}
          />
        </div>
      </section>
    </>
  )
}

// ─── /cartillas/[prepaga]/plan-x ────────────────────────────────────────────

export function faqsPlan(c: CartillaPrepaga, p: PlanCartilla) {
  const amba = zonasAmba(c.prepagaSlug)
  const caba = amba.find((z) => z.slug === 'caba')
  const intCaba = caba ? caba.centros.filter((ce) => ce.internacion.includes(p.id)) : []
  const idxEsc = c.escalera.indexOf(p.id)
  const siguiente = idxEsc >= 0 ? c.planes.find((x) => x.id === c.escalera[idxEsc + 1]) : undefined
  const sumaSiguiente = caba && siguiente ? centrosConPlanSuperior(caba.centros, p.id, c.planes, c.escalera, 'internacion').filter((x) => x.desde.id === siguiente.id) : []
  const zonasCon = c.zonas.filter((z) => z.centros.some((ce) => ce.internacion.includes(p.id) || ce.guardia.includes(p.id)))
  const faqs: { q: string; a: string }[] = []
  if (intCaba.length > 0) {
    faqs.push({
      q: `¿Qué sanatorios cubre el ${c.prepagaNombre} ${planCorto(p)} en CABA?`,
      a: `Según la ${textoFecha(c)}, en la Ciudad de Buenos Aires el ${p.label} incluye ${intCaba.length} sanatorio${intCaba.length === 1 ? '' : 's'} para internación: ${listaNombres(intCaba, 10)}.`,
    })
  }
  if (siguiente && sumaSiguiente.length > 0) {
    faqs.push({
      q: `¿Qué sanatorios suma el ${siguiente.label} frente al ${p.label}?`,
      a: `En CABA, el ${siguiente.label} suma para internación: ${sumaSiguiente.map((x) => x.nombre).join(', ')}.`,
    })
  }
  faqs.push({
    q: `¿En qué zonas tiene cartilla el ${c.prepagaNombre} ${planCorto(p)}?`,
    a: `El ${p.label} tiene centros en ${zonasCon.length} zona${zonasCon.length === 1 ? '' : 's'} de la cartilla${amba.length ? `, incluyendo ${amba.filter((z) => zonasCon.includes(z)).map((z) => nombreCortoZona(z.nombre)).join(', ')}` : ''}. Elegí tu zona en el buscador para ver los sanatorios y ${c.labelGuardia.toLowerCase()} cerca tuyo.`,
  })
  return faqs
}

export function PaginaPlan({ c, p }: { c: CartillaPrepaga; p: PlanCartilla }) {
  const base = `/cartillas/${c.prepagaSlug}`
  const corto = planCorto(p)
  const amba = zonasAmba(c.prepagaSlug)
  const combos = new Set(combinacionesPlanZona(c.prepagaSlug).filter((x) => x.plan === slugPlan(p.id)).map((x) => x.zona))
  const grupos = zonasPorProvincia(c.prepagaSlug)
  const zonasConPlan = grupos.flatMap((g) => g.zonas).filter((z) => z.planes.includes(p.id)).length
  const faqs = faqsPlan(c, p)
  const idxEsc = c.escalera.indexOf(p.id)
  const siguiente = idxEsc >= 0 ? c.planes.find((x) => x.id === c.escalera[idxEsc + 1]) : undefined

  return (
    <>
      {jsonLd([
        ldBreadcrumb([
          { name: SITE_NAME, url: SITE_URL },
          { name: 'Cartillas', url: `${SITE_URL}/cartillas` },
          { name: `Cartilla ${c.prepagaNombre}`, url: `${SITE_URL}${base}` },
          { name: p.label },
        ]),
        ldFaq(faqs),
      ])}
      <Breadcrumb items={[{ href: '/', label: SITE_NAME }, { href: '/cartillas', label: 'Cartillas' }, { href: base, label: c.prepagaNombre }, { label: p.label }]} />

      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-10">
        <div className="container max-w-4xl mx-auto">
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {c.tipoFecha === 'vigencia' ? `Cartilla oficial · vigente al ${c.vigencia}` : `Cartilla oficial · consultada el ${c.vigencia}`}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-3">
            Cartilla {c.prepagaNombre} {corto}: sanatorios y {c.labelGuardia.toLowerCase()} por zona
          </h1>
          <p className="text-gray-600 leading-relaxed max-w-3xl mb-5">
            Todos los sanatorios para internación y {c.labelGuardia.toLowerCase()} que incluye el {p.label} de {c.prepagaNombre}
            , zona por zona{zonasConPlan > 1 ? ` (${zonasConPlan} zonas y localidades)` : ''}. Elegí tu zona y mirá qué tenés cerca.
          </p>
          <Cta c={c} plan={p} grande />
        </div>
      </section>

      <section className="py-10 bg-white border-b border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Buscá la cartilla del {p.label} en tu zona</h2>
          <BuscadorCartillaZona
            prepagaSlug={c.prepagaSlug}
            prepagaNombre={c.prepagaNombre}
            grupos={grupos}
            planes={c.planes}
            escalera={c.escalera}
            planesConPagina={c.planesConPagina}
            labelGuardia={c.labelGuardia}
            textoFecha={textoFecha(c)}
            planInicial={p.id}
          />
        </div>
      </section>

      {amba.map((z) => {
        const lista = soloPlan(z.centros, p.id)
        const n = contar(lista)
        if (n.internacion === 0) return null
        const zc = nombreCortoZona(z.nombre)
        const upsell = siguiente
          ? centrosConPlanSuperior(z.centros, p.id, c.planes, c.escalera, 'internacion').filter((x) => x.desde.id === siguiente.id)
          : []
        return (
          <section key={z.slug} className="py-10 bg-white border-t border-gray-100">
            <div className="container max-w-4xl mx-auto">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                <h2 className="text-xl font-bold text-gray-900">Sanatorios del {c.prepagaNombre} {corto} en {zc}</h2>
                {combos.has(z.slug) && (
                  <Link href={`${base}/${slugPlan(p.id)}/${z.slug}`} className="text-sm font-semibold text-[#E8002D] hover:underline">
                    Ver también {c.labelGuardia.toLowerCase()} →
                  </Link>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-5">{n.internacion} sanatorio{n.internacion === 1 ? '' : 's'} para internación en {z.nombre}.</p>
              <CentrosLista centros={lista} seccion="internacion" planes={planesDeZona(c, z)} prepagaSlug={c.prepagaSlug} />
              {siguiente && <UpsellPlanes items={upsell} prepagaNombre={c.prepagaNombre} planLabel={p.label} zonaCorta={zc} />}
            </div>
          </section>
        )
      })}

      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{c.prepagaNombre} {corto} en el resto del país</h2>
          <div className="space-y-4">
            {grupos
              .map((g) => ({
                ...g,
                zonas: g.zonas.filter((z) => !amba.some((a) => a.slug === z.slug) && z.planes.includes(p.id)),
              }))
              .filter((g) => g.zonas.length > 0)
              .map((g) => (
                <div key={g.provincia}>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">{g.provincia}</h3>
                  <div className="flex flex-wrap gap-2">
                    {g.zonas.map((z) => (
                      <Link
                        key={z.slug}
                        href={combos.has(z.slug) ? `${base}/${slugPlan(p.id)}/${z.slug}` : `${base}/${z.slug}`}
                        className="text-xs px-3 py-1.5 bg-white text-gray-700 border border-gray-200 rounded-full hover:border-red-200 hover:text-[#E8002D] transition-colors font-medium"
                      >
                        {nombreCortoZona(z.nombre)}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <Faq faqs={faqs} />
      <Fuente c={c} />

      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <Chips
            titulo={`Cartilla de otros planes de ${c.prepagaNombre}`}
            links={c.planesConPagina.map((id) => c.planes.find((x) => x.id === id)!).map((x) => ({ href: `${base}/${slugPlan(x.id)}`, label: x.label, activo: x.id === p.id }))}
          />
        </div>
      </section>
    </>
  )
}

// ─── /cartillas/[prepaga]/plan-x/[zona] ─────────────────────────────────────

export function faqsPlanZona(c: CartillaPrepaga, p: PlanCartilla, z: ZonaCartilla) {
  const corto = nombreCortoZona(z.nombre)
  const lista = soloPlan(z.centros, p.id)
  const int = lista.filter((ce) => ce.internacion.length > 0)
  const gua = lista.filter((ce) => ce.guardia.length > 0)
  const noIncluye = z.centros.filter((ce) => ce.internacion.length > 0 && !ce.internacion.includes(p.id))
  const faqs: { q: string; a: string }[] = []
  if (int.length > 0) {
    faqs.push({
      q: `¿Qué sanatorios cubre ${c.prepagaNombre} ${planCorto(p)} en ${corto}?`,
      a: `Según la ${textoFecha(c)}, el ${p.label} incluye en ${z.nombre} ${int.length} sanatorio${int.length === 1 ? '' : 's'} para internación: ${listaNombres(int, 10)}.`,
    })
  }
  if (gua.length > 0) {
    faqs.push({
      q: `¿Dónde hay ${c.labelGuardia.toLowerCase()} con ${c.prepagaNombre} ${planCorto(p)} en ${corto}?`,
      a: `Con el ${p.label}, en ${z.nombre} figuran ${gua.length} centro${gua.length === 1 ? '' : 's'} con ${c.labelGuardia.toLowerCase()}: ${listaNombres(gua, 10)}.`,
    })
  }
  if (noIncluye.length > 0) {
    faqs.push({
      q: `¿Qué sanatorios de ${corto} no incluye el ${p.label}?`,
      a: `En ${z.nombre}, el ${p.label} no incluye para internación: ${listaNombres(noIncluye, 10)}. Esos centros figuran con otros planes de ${c.prepagaNombre}.`,
    })
  }
  return faqs
}

export function PaginaPlanZona({ c, p, z }: { c: CartillaPrepaga; p: PlanCartilla; z: ZonaCartilla }) {
  const base = `/cartillas/${c.prepagaSlug}`
  const corto = nombreCortoZona(z.nombre)
  const pc = planCorto(p)
  const lista = soloPlan(z.centros, p.id)
  const n = contar(lista)
  const faqs = faqsPlanZona(c, p, z)
  const upsell = centrosConPlanSuperior(z.centros, p.id, c.planes, c.escalera, 'internacion')
  const combos = combinacionesPlanZona(c.prepagaSlug)
  const otrosPlanes = combos.filter((x) => x.zona === z.slug).map((x) => c.planes.find((pl) => slugPlan(pl.id) === x.plan)!).filter(Boolean)
  const idx = indiceZonas(c.prepagaSlug)
  const yo = idx.find((x) => x.slug === z.slug)
  const otrasZonas = combos
    .filter((x) => x.plan === slugPlan(p.id) && x.zona !== z.slug)
    .map((x) => idx.find((i) => i.slug === x.zona)!)
    .filter((i) => i && i.provinciaNombre === yo?.provinciaNombre)
  const planes = planesDeZona(c, z)

  return (
    <>
      {jsonLd([
        ldBreadcrumb([
          { name: SITE_NAME, url: SITE_URL },
          { name: 'Cartillas', url: `${SITE_URL}/cartillas` },
          { name: `Cartilla ${c.prepagaNombre}`, url: `${SITE_URL}${base}` },
          { name: p.label, url: `${SITE_URL}${base}/${slugPlan(p.id)}` },
          { name: corto },
        ]),
        ldHospitales(`Sanatorios de ${c.prepagaNombre} ${pc} en ${z.nombre}`, lista.filter((ce) => ce.internacion.length > 0), z.provincias[0]),
        ldFaq(faqs),
      ])}
      <Breadcrumb
        items={[
          { href: '/', label: SITE_NAME },
          { href: '/cartillas', label: 'Cartillas' },
          { href: base, label: c.prepagaNombre },
          { href: `${base}/${slugPlan(p.id)}`, label: p.label },
          { label: corto },
        ]}
      />

      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-10">
        <div className="container max-w-4xl mx-auto">
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {c.tipoFecha === 'vigencia' ? `Cartilla oficial · vigente al ${c.vigencia}` : `Cartilla oficial · consultada el ${c.vigencia}`}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-3">
            Cartilla {c.prepagaNombre} {pc} en {corto}
          </h1>
          <p className="text-gray-600 leading-relaxed max-w-3xl mb-5">
            Con el {p.label} de {c.prepagaNombre}, en {z.nombre} tenés{' '}
            {n.internacion > 0 && <strong>{n.internacion} sanatorio{n.internacion === 1 ? '' : 's'} para internación</strong>}
            {n.internacion > 0 && n.guardia > 0 && ' y '}
            {n.guardia > 0 && <strong>{n.guardia} centro{n.guardia === 1 ? '' : 's'} con {c.labelGuardia.toLowerCase()}</strong>}
            . Dirección y teléfono de cada uno, según la cartilla oficial.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Cta c={c} plan={p} zonaCorta={corto} grande />
            <Link href={`${base}/${z.slug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-semibold rounded-xl transition-all text-sm">
              Todos los planes en {corto}
            </Link>
          </div>
        </div>
      </section>

      {n.internacion > 0 && (
        <section className="py-10 bg-white">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Sanatorios del {c.prepagaNombre} {pc} para internación en {corto}</h2>
            <CentrosLista centros={lista} seccion="internacion" planes={planes} prepagaSlug={c.prepagaSlug} />
            <UpsellPlanes items={upsell} prepagaNombre={c.prepagaNombre} planLabel={p.label} zonaCorta={corto} />
          </div>
        </section>
      )}

      {n.guardia > 0 && (
        <section className="py-10 bg-gray-50 border-t border-gray-100">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-5">{c.labelGuardia} del {c.prepagaNombre} {pc} en {corto}</h2>
            <CentrosLista centros={lista} seccion="guardia" planes={planes} prepagaSlug={c.prepagaSlug} />
          </div>
        </section>
      )}

      <Faq faqs={faqs} />
      <Fuente c={c} />

      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto space-y-6">
          <Chips
            titulo={`Otros planes de ${c.prepagaNombre} en ${corto}`}
            links={otrosPlanes.map((x) => ({ href: `${base}/${slugPlan(x.id)}/${z.slug}`, label: x.label, activo: x.id === p.id }))}
          />
          <Chips
            titulo={`${c.prepagaNombre} ${pc} en otras zonas`}
            links={otrasZonas.map((x) => ({ href: `${base}/${slugPlan(p.id)}/${x.slug}`, label: nombreCortoZona(x.nombre) }))}
          />
        </div>
      </section>
    </>
  )
}
