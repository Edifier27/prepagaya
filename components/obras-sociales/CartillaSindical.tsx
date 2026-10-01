import Link from 'next/link'
import type { ObraSocialData } from '@/lib/data/obras-sociales'
import { registroDeObraSocial } from '@/lib/data/registro-sssalud'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import {
  contar,
  especialidadesDestacadas,
  fechaDescarga,
  localidades,
  provinciasConPagina,
  totales,
  type CartillaSindical,
  type InstitucionCartilla,
  type ProvinciaCartilla,
  type TipoInstitucion,
} from '@/lib/data/sindicales-cartillas'

// Páginas de cartilla de las obras sociales sindicales (1-oct-2026):
//   /obras-sociales/[slug]/cartilla          resumen por provincia
//   /obras-sociales/[slug]/cartilla/[prov]   sanatorios, guardias y centros de la provincia
// Fuente: Anexo III de la Res. SSSalud 2165/2021 publicado por cada obra social.

const fmt = (n: number) => n.toLocaleString('es-AR')

const ETIQUETA: Record<TipoInstitucion, string> = {
  internacion: 'Internación',
  guardia: 'Guardia',
  diagnostico: 'Diagnóstico',
}

const ESTILO: Record<TipoInstitucion, string> = {
  internacion: 'bg-red-50 text-[#B8001F]',
  guardia: 'bg-amber-50 text-amber-800',
  diagnostico: 'bg-sky-50 text-sky-800',
}

function telHref(tel: string) {
  return tel.split(/[/y-]\s*\d{6,}/)[0].replace(/[^\d+]/g, '')
}

export function urlCartilla(slug: string, prov?: string) {
  return `/obras-sociales/${slug}/cartilla${prov ? `/${prov}` : ''}`
}

function Migas({ os, prov }: { os: ObraSocialData; prov?: ProvinciaCartilla }) {
  return (
    <div className="bg-gray-50 border-b border-gray-100 py-3">
      <div className="container">
        <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
          <Link href="/" className="hover:text-[#E8002D] transition-colors">{SITE_NAME}</Link>
          <span className="text-gray-300">›</span>
          <Link href="/obras-sociales" className="hover:text-[#E8002D] transition-colors">Obras Sociales</Link>
          <span className="text-gray-300">›</span>
          <Link href={`/obras-sociales/${os.slug}`} className="hover:text-[#E8002D] transition-colors">{os.nombre}</Link>
          <span className="text-gray-300">›</span>
          {prov ? (
            <>
              <Link href={urlCartilla(os.slug)} className="hover:text-[#E8002D] transition-colors">Cartilla</Link>
              <span className="text-gray-300">›</span>
              <span className="text-gray-700">{prov.nombre}</span>
            </>
          ) : (
            <span className="text-gray-700">Cartilla</span>
          )}
        </nav>
      </div>
    </div>
  )
}

function Fuente({ c, os }: { c: CartillaSindical; os: ObraSocialData }) {
  return (
    <p className="text-xs text-gray-500 leading-relaxed">
      Fuente: listado completo de prestadores que {os.nombre} presentó ante la Superintendencia de Servicios de Salud
      ({c.norma}{c.vigencia ? `, vigencia ${c.vigencia}` : ''}), publicado en{' '}
      <a href={c.paginaFuente} target="_blank" rel="noopener noreferrer" className="underline">su web oficial</a>.
      Descargado el {fechaDescarga(c)}. Los prestadores cambian durante el año: antes de ir, confirmá con {os.nombre}.
      No publicamos datos de médicos particulares: solo instituciones.
    </p>
  )
}

function Cta({ os }: { os: ObraSocialData }) {
  const conCodigo = !!registroDeObraSocial(os.slug)?.codigo
  return (
    <section className="py-12 bg-[#E8002D] text-white">
      <div className="container max-w-xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-2">¿La cartilla de {os.nombre} te queda corta?</h2>
        <p className="text-white text-sm mb-6">
          {conCodigo
            ? `Con tus mismos aportes podés pasarte a una prepaga y pagar solo la diferencia. Mirá cuánto sería con los precios oficiales.`
            : 'Compará las prepagas con precios oficiales y cartilla completa, sin DNI y sin compromiso.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {conCodigo && (
            <Link href={`/calculadora-aportes?os=${os.slug}`} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#E8002D] font-bold rounded-2xl hover:bg-red-50 transition-all shadow-lg text-sm">
              Calcular mi diferencia →
            </Link>
          )}
          <Link href="/comparador" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-white text-white font-bold rounded-2xl hover:bg-white/10 transition-all text-sm">
            Comparar prepagas
          </Link>
        </div>
      </div>
    </section>
  )
}

function Preguntas({ faq }: { faq: { q: string; a: string }[] }) {
  return (
    <section className="py-10 bg-white border-t border-gray-100">
      <div className="container max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
        <div className="space-y-3">
          {faq.map((f) => (
            <details key={f.q} className="group rounded-xl border border-gray-200 bg-white p-4">
              <summary className="cursor-pointer font-semibold text-gray-900 text-sm list-none flex justify-between gap-3">
                {f.q}
                <span className="text-gray-400 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-sm text-gray-600 leading-relaxed mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function jsonLd(os: ObraSocialData, c: CartillaSindical, faq: { q: string; a: string }[], prov?: ProvinciaCartilla) {
  const url = `${SITE_URL}${urlCartilla(os.slug, prov?.slug)}`
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      url,
      name: prov ? `Cartilla de ${os.nombre} en ${prov.nombre}` : `Cartilla de ${os.nombre}`,
      isBasedOn: c.fuente,
      dateModified: c.descargado,
      inLanguage: 'es-AR',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Obras Sociales', item: `${SITE_URL}/obras-sociales` },
        { '@type': 'ListItem', position: 3, name: os.nombre, item: `${SITE_URL}/obras-sociales/${os.slug}` },
        prov
          ? { '@type': 'ListItem', position: 4, name: 'Cartilla', item: `${SITE_URL}${urlCartilla(os.slug)}` }
          : { '@type': 'ListItem', position: 4, name: 'Cartilla' },
        ...(prov ? [{ '@type': 'ListItem', position: 5, name: prov.nombre }] : []),
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  ]
}

const listaTipos = (i: { internacion: number; guardia: number; diagnostico: number }) =>
  [
    i.internacion && `${fmt(i.internacion)} ${i.internacion === 1 ? 'sanatorio o clínica' : 'sanatorios y clínicas'} con internación`,
    i.guardia && `${fmt(i.guardia)} ${i.guardia === 1 ? 'guardia' : 'guardias'}`,
    i.diagnostico && `${fmt(i.diagnostico)} ${i.diagnostico === 1 ? 'centro' : 'centros'} de diagnóstico y tratamiento`,
  ].filter(Boolean).join(', ').replace(/, ([^,]*)$/, ' y $1')

// ── Resumen nacional ────────────────────────────────────────────────────────

export function faqsCartilla(os: ObraSocialData, c: CartillaSindical) {
  const t = totales(c)
  const top = provinciasConPagina(c).slice(0, 3).map((p) => p.nombre)
  const faq = [
    {
      q: `¿Dónde veo la cartilla de ${os.nombre}?`,
      a: `${os.nombre} publica su listado completo de prestadores en su web, en el formato que exige la Superintendencia de Servicios de Salud (${c.norma}). Acá lo tenés ordenado por provincia y localidad: ${listaTipos(t)}.`,
    },
    {
      q: `¿En qué provincias tiene prestadores ${os.nombre}?`,
      a: `En ${t.provincias} ${t.provincias === 1 ? 'provincia' : 'provincias'}. Donde más instituciones tiene es en ${top.join(', ').replace(/, ([^,]*)$/, ' y $1')}.`,
    },
  ]
  if (t.profesionales > 0) {
    faq.push({
      q: `¿Cuántos médicos tiene la cartilla de ${os.nombre}?`,
      a: `El listado incluye ${fmt(t.profesionales)} profesionales particulares (consultorios), además de las instituciones. No publicamos sus nombres: si buscás un médico en particular, consultalo con ${os.nombre}.`,
    })
  }
  faq.push({
    q: `¿${os.nombre} cubre fertilización asistida?`,
    a: t.infertilidad > 0
      ? `Sí. Por la Ley 26.862 todas las obras sociales deben cubrir los tratamientos de reproducción asistida. En su cartilla, ${os.nombre} declara ${t.infertilidad} ${t.infertilidad === 1 ? 'centro' : 'centros'} de infertilidad.`
      : `Por la Ley 26.862 todas las obras sociales deben cubrir los tratamientos de reproducción asistida. Consultá con ${os.nombre} qué centro de fertilidad te corresponde según tu zona.`,
  })
  if (registroDeObraSocial(os.slug)?.codigo) {
    faq.push({
      q: `¿Puedo pasar mis aportes de ${os.nombre} a una prepaga?`,
      a: `Sí. Con la opción de cambio de obra social podés derivar tus aportes a una obra social que trabaje con prepaga y pagar solo la diferencia. Así accedés a la cartilla de la prepaga, que suele ser más amplia en sanatorios privados.`,
    })
  }
  return faq
}

export function PaginaCartillaSindical({ os, c }: { os: ObraSocialData; c: CartillaSindical }) {
  const t = totales(c)
  const provs = c.provincias
  const faq = faqsCartilla(os, c)
  const inf = provs.flatMap((p) => p.instituciones.filter((i) => i.inf).map((i) => ({ ...i, prov: p })))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(os, c, faq)) }} />
      <Migas os={os} />

      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-10">
        <div className="container max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wide text-[#E8002D] mb-2">Cartilla oficial{c.vigencia ? ` ${c.vigencia}` : ''}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">
            Cartilla de {os.nombre}: sanatorios, guardias y centros médicos por provincia
          </h1>
          <p className="text-gray-700 leading-relaxed mt-4 max-w-3xl">
            <strong>Respuesta corta:</strong> la cartilla de {os.nombre} tiene {listaTipos(t)} en {t.provincias}{' '}
            {t.provincias === 1 ? 'provincia' : 'provincias'}
            {t.profesionales > 0 ? `, más ${fmt(t.profesionales)} profesionales en consultorio` : ''}
            {t.farmacias > 0 ? ` y ${fmt(t.farmacias)} farmacias` : ''}. Es el listado que {os.nombre} presentó ante la
            Superintendencia de Servicios de Salud. Elegí tu provincia para ver cada sanatorio con dirección y teléfono.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { v: t.internacion, l: 'Internación' },
              { v: t.guardia, l: 'Guardias' },
              { v: t.diagnostico, l: 'Centros de diagnóstico' },
              t.profesionales > 0 ? { v: t.profesionales, l: 'Profesionales' } : { v: t.farmacias, l: 'Farmacias' },
            ].map((x) => (
              <div key={x.l} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-2xl font-black text-gray-900 tabular-nums">{fmt(x.v)}</div>
                <div className="text-xs text-gray-500 mt-1">{x.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Cartilla de {os.nombre} por provincia</h2>
          <p className="text-sm text-gray-500 mb-5">Sanatorios, guardias y centros de diagnóstico con nombre, dirección y teléfono.</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {provs.map((p) => {
              const conPagina = p.instituciones.length > 0
              const cuerpo = (
                <>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-gray-900">{p.nombre}</span>
                    {conPagina && <span className="text-[#E8002D] text-sm font-semibold">Ver →</span>}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 tabular-nums">
                    {[
                      contar(p.instituciones, 'internacion') && `${contar(p.instituciones, 'internacion')} internación`,
                      contar(p.instituciones, 'guardia') && `${contar(p.instituciones, 'guardia')} guardias`,
                      contar(p.instituciones, 'diagnostico') && `${contar(p.instituciones, 'diagnostico')} diagnóstico`,
                      p.profesionales && `${fmt(p.profesionales)} profesionales`,
                      p.farmacias && `${fmt(p.farmacias)} farmacias`,
                    ].filter(Boolean).join(' · ')}
                  </div>
                </>
              )
              return (
                <li key={p.slug}>
                  {conPagina ? (
                    <Link href={urlCartilla(os.slug, p.slug)} className="block rounded-xl border border-gray-200 p-4 hover:border-[#E8002D] transition-colors">{cuerpo}</Link>
                  ) : (
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">{cuerpo}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {inf.length > 0 && (
        <section id="fertilizacion" className="py-10 bg-gray-50 border-t border-gray-100">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Centros de fertilización de {os.nombre}</h2>
            <p className="text-sm text-gray-600 mb-5 max-w-3xl">
              Centros que {os.nombre} declara como “centro de infertilidad” en su cartilla. La cobertura de reproducción
              asistida es obligatoria por la Ley 26.862.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {inf.map((i) => <Institucion key={`${i.prov.slug}-${i.n}-${i.dom}`} i={i} extra={`${i.loc}, ${i.prov.nombre}`} />)}
            </ul>
          </div>
        </section>
      )}

      <section className="py-8 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto space-y-3">
          <p className="text-sm text-gray-700">
            ¿Querés saber más de {os.nombre}? Mirá <Link href={`/obras-sociales/${os.slug}`} className="text-[#E8002D] font-semibold hover:underline">quién puede afiliarse, aportes y teléfonos</Link>.
          </p>
          <Fuente c={c} os={os} />
        </div>
      </section>

      <Preguntas faq={faq} />
      <Cta os={os} />
    </>
  )
}

// ── Provincia ───────────────────────────────────────────────────────────────

function Institucion({ i, extra }: { i: InstitucionCartilla; extra?: string }) {
  return (
    <li className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="font-semibold text-gray-900 text-sm">{i.n}</div>
      {(i.dom || extra) && <div className="text-sm text-gray-600 mt-0.5">{[i.dom, extra].filter(Boolean).join(' · ')}</div>}
      <div className="flex flex-wrap items-center gap-1.5 mt-2">
        {i.t.map((t) => (
          <span key={t} className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${ESTILO[t]}`}>{ETIQUETA[t]}</span>
        ))}
        {i.inf && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-800">Fertilidad</span>}
        {i.tel && (
          <a href={`tel:${telHref(i.tel)}`} className="ml-auto text-sm font-semibold text-[#E8002D] hover:underline">{i.tel}</a>
        )}
      </div>
    </li>
  )
}

const slugLoc = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function faqsProvincia(os: ObraSocialData, c: CartillaSindical, p: ProvinciaCartilla) {
  const locs = localidades(p)
  const sanatorios = p.instituciones.filter((i) => i.t.includes('internacion'))
  const guardias = p.instituciones.filter((i) => i.t.includes('guardia'))
  const esp = especialidadesDestacadas(p, 5).slice(0, 4)
  const faq = [
    {
      q: `¿Qué sanatorios tiene ${os.nombre} en ${p.nombre}?`,
      a: sanatorios.length
        ? `${sanatorios.length} con internación, entre ellos ${sanatorios.slice(0, 4).map((s) => `${s.n} (${s.loc})`).join(', ')}. Abajo está la lista completa con dirección y teléfono.`
        : `En ${p.nombre} la cartilla de ${os.nombre} no tiene sanatorios con internación: tiene ${listaTipos({ internacion: 0, guardia: guardias.length, diagnostico: contar(p.instituciones, 'diagnostico') })}.`,
    },
  ]
  if (guardias.length) {
    faq.push({
      q: `¿Dónde hay guardia de ${os.nombre} en ${p.nombre}?`,
      a: `En ${guardias.length} ${guardias.length === 1 ? 'lugar' : 'lugares'}: ${guardias.slice(0, 5).map((s) => `${s.n} (${s.loc})`).join(', ')}${guardias.length > 5 ? ' y más' : ''}.`,
    })
  }
  if (locs.length > 1) {
    faq.push({
      q: `¿En qué ciudades de ${p.nombre} atiende ${os.nombre}?`,
      a: `Tiene instituciones en ${locs.length} localidades. Las que más tienen: ${locs.slice(0, 5).map((l) => l.loc).join(', ')}.`,
    })
  }
  if (p.profesionales > 0) {
    faq.push({
      q: `¿Cuántos médicos tiene ${os.nombre} en ${p.nombre}?`,
      a: `${fmt(p.profesionales)} profesionales en consultorio${esp.length ? `, entre ellos ${esp.map((e) => `${e.n} de ${e.nombre.toLowerCase()}`).join(', ')}` : ''}. No publicamos sus nombres: consultalos con ${os.nombre}.`,
    })
  }
  return faq
}

export function PaginaCartillaProvincia({ os, c, p }: { os: ObraSocialData; c: CartillaSindical; p: ProvinciaCartilla }) {
  const faq = faqsProvincia(os, c, p)
  const locs = localidades(p)
  const esp = especialidadesDestacadas(p)
  const cuenta = {
    internacion: contar(p.instituciones, 'internacion'),
    guardia: contar(p.instituciones, 'guardia'),
    diagnostico: contar(p.instituciones, 'diagnostico'),
  }
  const otras = provinciasConPagina(c).filter((x) => x.slug !== p.slug)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(os, c, faq, p)) }} />
      <Migas os={os} prov={p} />

      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-10">
        <div className="container max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wide text-[#E8002D] mb-2">Cartilla oficial{c.vigencia ? ` ${c.vigencia}` : ''}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">
            Cartilla de {os.nombre} en {p.nombre}: sanatorios, guardias y centros médicos
          </h1>
          <p className="text-gray-700 leading-relaxed mt-4 max-w-3xl">
            <strong>Respuesta corta:</strong> en {p.nombre}, {os.nombre} tiene {listaTipos(cuenta)}
            {locs.length > 1 ? ` en ${locs.length} localidades` : locs[0] ? ` en ${locs[0].loc}` : ''}
            {p.profesionales > 0 ? `, más ${fmt(p.profesionales)} profesionales en consultorio` : ''}
            {p.farmacias > 0 ? ` y ${fmt(p.farmacias)} farmacias` : ''}.
          </p>
          {locs.length > 1 && (
            <div className="mt-5">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ir a tu localidad</div>
              <div className="flex flex-wrap gap-2">
                {locs.map((l) => (
                  <a key={l.loc} href={`#${slugLoc(l.loc)}`} className="text-sm px-3 py-1 rounded-full border border-gray-200 bg-white hover:border-[#E8002D] text-gray-700">
                    {l.loc} <span className="text-gray-400 tabular-nums">{l.n}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto space-y-8">
          {locs.map((l) => (
            <div key={l.loc} id={slugLoc(l.loc)} className="scroll-mt-20">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{os.nombre} en {l.loc}</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {p.instituciones.filter((i) => i.loc === l.loc).map((i) => <Institucion key={`${i.n}-${i.dom}`} i={i} />)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {(esp.length > 0 || p.farmacias > 0) && (
        <section className="py-10 bg-gray-50 border-t border-gray-100">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Médicos y farmacias de {os.nombre} en {p.nombre}</h2>
            <p className="text-sm text-gray-600 mb-5 max-w-3xl">
              Cuántos profesionales en consultorio hay por especialidad. No publicamos nombres de médicos: para pedir turno, consultá la cartilla con {os.nombre}.
            </p>
            {esp.length > 0 && (
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {esp.map((e) => (
                  <li key={e.nombre} className="flex justify-between gap-2 rounded-lg bg-white border border-gray-200 px-3 py-2 text-sm">
                    <span className="text-gray-700">{e.nombre}</span>
                    <span className="font-semibold text-gray-900 tabular-nums">{fmt(e.n)}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-sm text-gray-700">
              {[
                p.farmacias > 0 && `${fmt(p.farmacias)} ${p.farmacias === 1 ? 'farmacia' : 'farmacias'}`,
                p.opticas > 0 && `${fmt(p.opticas)} ${p.opticas === 1 ? 'óptica' : 'ópticas'}`,
                p.ortopedias > 0 && `${fmt(p.ortopedias)} ${p.ortopedias === 1 ? 'ortopedia' : 'ortopedias'}`,
              ].filter(Boolean).join(', ').replace(/, ([^,]*)$/, ' y $1')}
              {p.farmacias + p.opticas + p.ortopedias > 0 ? ` adheridas en ${p.nombre}.` : ''}
            </p>
          </div>
        </section>
      )}

      {otras.length > 0 && (
        <section className="py-8 bg-white border-t border-gray-100">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-base font-bold text-gray-900 mb-3">Cartilla de {os.nombre} en otras provincias</h2>
            <div className="flex flex-wrap gap-2">
              {otras.map((x) => (
                <Link key={x.slug} href={urlCartilla(os.slug, x.slug)} className="text-sm px-3 py-1 rounded-full border border-gray-200 hover:border-[#E8002D] text-gray-700">{x.nombre}</Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-8 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto"><Fuente c={c} os={os} /></div>
      </section>

      <Preguntas faq={faq} />
      <Cta os={os} />
    </>
  )
}
