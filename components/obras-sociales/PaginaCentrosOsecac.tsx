import Link from 'next/link'
import { AportesCta } from '@/components/obras-sociales/AportesCta'
import { FiltroCentrosOsecac } from '@/components/obras-sociales/FiltroCentrosOsecac'
import { PasateConTusAportes } from '@/components/obras-sociales/PasateConTusAportes'
import { BarraCotizar } from '@/components/prepagas/BarraCotizar'
import {
  CALL_CENTER_SESAM,
  DESCARGADO_CENTROS_OSECAC,
  centrosPorProvincia,
  centrosSaludMental,
  totalCentros,
  type CentroOsecac,
} from '@/lib/data/osecac-centros'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { ldJson } from '@/lib/jsonld'

// /obras-sociales/osecac/cartilla (18-oct-2026). "cartilla osecac": 2.400
// búsquedas por mes. OSECAC no publica una cartilla única: su web ofrece
// buscadores. El de centros de atención es público; guardias y turnos piden
// ingresar con usuario (verificado el 18-oct-2026). Acá va lo público.

export const URL_CARTILLA_OSECAC = '/obras-sociales/osecac/cartilla'

const OFICIAL = 'https://www.osecac.org.ar'
const TELEFONOS = [
  { etiqueta: 'Emergencias', valor: '0810-333-0004' },
  { etiqueta: 'Beneficiarios', valor: '0800-666-0400' },
  { etiqueta: 'Turnos', valor: '0810-999-0101' },
  { etiqueta: 'Reclamos', valor: '0800-666-0445' },
]

const TITULO_ESPECIALIDAD: Record<string, string> = { Generales: 'Generales', 'Pedriátricas': 'Pediátricas', Adultos: 'Adultos' }

const telHref = (t: string) => t.split('/')[0].replace(/[^\d+]/g, '')

function fechaLarga(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export const FAQ_CARTILLA_OSECAC = [
  {
    q: '¿Dónde veo la cartilla de OSECAC?',
    a: 'En su web oficial no encontramos una cartilla única para descargar: OSECAC ofrece buscadores. El de centros de atención es público (se busca por provincia, localidad y especialidad), igual que los de farmacias, vademécum y delegaciones. Las guardias y los turnos piden ingresar con usuario. En esta página están los centros de atención que el buscador oficial muestra sin ingresar.',
  },
  {
    q: '¿Cómo busco un centro de atención de OSECAC?',
    a: 'Entrá al buscador de centros de atención de osecac.org.ar, elegí la provincia, la localidad y, si querés, la especialidad. También tiene un botón de centros más cercanos. Acá abajo podés filtrar la misma lista por provincia, localidad, calle o especialidad.',
  },
  {
    q: '¿Puedo ver las guardias de OSECAC sin usuario?',
    a: 'Al 18 de octubre de 2026, la página de guardias de OSECAC pide iniciar sesión. Para una emergencia está el teléfono 0810-333-0004; para consultas generales de afiliados, 0800-666-0400.',
  },
  {
    q: '¿Cómo saco un turno en OSECAC?',
    a: 'Por teléfono al 0810-999-0101, con el DNI del paciente a mano (pueden pedir órdenes de prácticas y estudios), o con tu usuario en la web o en la app Mi OSECAC. La página de turnos de la web pide iniciar sesión.',
  },
  {
    q: '¿Qué atención de salud mental ofrece OSECAC?',
    a: 'El buscador oficial lista centros de salud mental SESAM en la Ciudad de Buenos Aires (adultos e infanto-juvenil), atención virtual y, para el interior del país, un call center al 0810-112-3923.',
  },
  {
    q: '¿Esta lista está actualizada?',
    a: `Es la lista que mostraba el buscador oficial de OSECAC el ${fechaLarga(DESCARGADO_CENTROS_OSECAC)}. Los centros pueden cambiar durante el año: antes de ir, confirmá la dirección y el horario con OSECAC al 0800-666-0400.`,
  },
]

function Migas() {
  return (
    <div className="bg-gray-50 border-b border-gray-100 py-3">
      <div className="container">
        <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
          <Link href="/" className="hover:text-[#E8002D] transition-colors">{SITE_NAME}</Link>
          <span className="text-gray-300">›</span>
          <Link href="/obras-sociales" className="hover:text-[#E8002D] transition-colors">Obras Sociales</Link>
          <span className="text-gray-300">›</span>
          <Link href="/obras-sociales/osecac" className="hover:text-[#E8002D] transition-colors">OSECAC</Link>
          <span className="text-gray-300">›</span>
          <span className="text-gray-700">Cartilla</span>
        </nav>
      </div>
    </div>
  )
}

function textoBusqueda(c: CentroOsecac) {
  return [c.nombre, c.direccion, c.telefono, ...Object.values(c.especialidades).flat()].join(' ')
}

function Tarjeta({ c, prov }: { c: CentroOsecac; prov?: string }) {
  const espec = Object.entries(c.especialidades).filter(([, lista]) => lista.length > 0)
  const cantidad = new Set(espec.flatMap(([, l]) => l.map((x) => x.toLowerCase()))).size
  return (
    <li data-centro data-prov={prov} data-q={textoBusqueda(c)} className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="font-semibold text-gray-900 text-sm">{c.nombre}</div>
      {c.direccion && <div className="text-sm text-gray-700 mt-1">{c.direccion}</div>}
      {c.horario && <div className="text-xs text-gray-500 mt-1">{c.horario}</div>}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm">
        {c.telefono && <a href={`tel:${telHref(c.telefono)}`} className="font-semibold text-[#E8002D] hover:underline">{c.telefono}</a>}
        {c.lat != null && c.lon != null && (
          <a href={`https://www.google.com/maps?q=${c.lat},${c.lon}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#E8002D] hover:underline">Ver en el mapa</a>
        )}
      </div>
      {espec.length > 0 && (
        <details className="mt-3 group">
          <summary className="cursor-pointer text-xs font-semibold text-gray-600 hover:text-[#E8002D] list-none">
            Especialidades ({cantidad}) <span className="text-gray-400 group-open:hidden">+</span>
          </summary>
          <div className="mt-2 space-y-2">
            {espec.map(([titulo, lista]) => (
              <div key={titulo}>
                <div className="text-[11px] font-bold uppercase tracking-wide text-gray-400">{TITULO_ESPECIALIDAD[titulo] ?? titulo}</div>
                <p className="text-xs text-gray-600 leading-relaxed">{lista.join(' · ')}</p>
              </div>
            ))}
          </div>
        </details>
      )}
    </li>
  )
}

export function PaginaCentrosOsecac() {
  const { grupos, provinciasSinCentros } = centrosPorProvincia()
  const total = totalCentros()
  const saludMental = centrosSaludMental()
  const fecha = fechaLarga(DESCARGADO_CENTROS_OSECAC)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Obras Sociales', item: `${SITE_URL}/obras-sociales` },
          { '@type': 'ListItem', position: 3, name: 'OSECAC', item: `${SITE_URL}/obras-sociales/osecac` },
          { '@type': 'ListItem', position: 4, name: 'Cartilla', item: `${SITE_URL}${URL_CARTILLA_OSECAC}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_CARTILLA_OSECAC.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(jsonLd) }} />
      <BarraCotizar titulo="Swiss Medical con tus aportes" origen="cartilla-os:osecac" href="/comparador?prepaga=swiss-medical&desde=barra" />
      <Migas />

      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-10">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">
            Cartilla OSECAC 2026: centros de atención, salud mental y teléfonos
          </h1>
          <p className="text-gray-700 leading-relaxed mt-4 max-w-3xl">
            OSECAC no publica una cartilla única para descargar: su web ofrece buscadores. Acá está lo que muestra el buscador oficial de{' '}
            <strong>centros de atención</strong> sin ingresar con usuario: {total} centros en {grupos.length} provincias, con dirección,
            teléfono, horario y especialidades. Las guardias y los turnos, en cambio, piden ingresar con tu usuario de OSECAC.
          </p>
          <AportesCta osNombre="OSECAC" osSlug="osecac" />
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Qué se ve sin ingresar y qué no</h2>
          <p className="text-sm text-gray-500 mb-4">Según la web oficial, consultada el {fecha}.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-green-200 bg-green-50/50 p-4">
              <div className="text-sm font-bold text-green-800 mb-2">Se ve sin usuario</div>
              <ul className="text-sm text-gray-700 space-y-1.5 list-disc pl-5">
                <li><a href={`${OFICIAL}/Centros`} target="_blank" rel="noopener noreferrer" className="text-[#E8002D] hover:underline">Centros de atención</a> (provincia, localidad y especialidad)</li>
                <li><a href={`${OFICIAL}/Farmacias`} target="_blank" rel="noopener noreferrer" className="text-[#E8002D] hover:underline">Farmacias</a></li>
                <li><a href={`${OFICIAL}/Vademecus`} target="_blank" rel="noopener noreferrer" className="text-[#E8002D] hover:underline">Vademécum</a> (por principio activo o marca, según el plan)</li>
                <li><a href={`${OFICIAL}/Delegaciones`} target="_blank" rel="noopener noreferrer" className="text-[#E8002D] hover:underline">Delegaciones y agencias</a> (<Link href="/obras-sociales/osecac#delegaciones" className="text-[#E8002D] hover:underline">también acá</Link>)</li>
              </ul>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
              <div className="text-sm font-bold text-amber-800 mb-2">Pide usuario de OSECAC</div>
              <ul className="text-sm text-gray-700 space-y-1.5 list-disc pl-5">
                <li><a href={`${OFICIAL}/cartillasguardias`} target="_blank" rel="noopener noreferrer" className="text-[#E8002D] hover:underline">Guardias</a></li>
                <li><a href={`${OFICIAL}/Turnos`} target="_blank" rel="noopener noreferrer" className="text-[#E8002D] hover:underline">Turnos online</a></li>
                <li>Mis datos y mis atenciones</li>
                <li>La lista de favoritos de centros</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">También podés usar la app Mi OSECAC.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="centros" className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Centros de atención de OSECAC por provincia</h2>
          <p className="text-sm text-gray-500 mb-5">Elegí tu provincia o escribí tu localidad o la especialidad que buscás.</p>
          <FiltroCentrosOsecac provincias={grupos.map((g) => ({ slug: g.slug, nombre: g.provincia, cantidad: g.centros.length }))} total={total} />

          <div id="centros-osecac" className="space-y-8">
            {grupos.map((g) => (
              <div key={g.slug} data-grupo id={g.slug}>
                <h3 className="text-base font-bold text-gray-900 mb-3">
                  {g.provincia} <span className="text-gray-400 font-normal">· {g.centros.length}</span>
                </h3>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {g.centros.map((c) => <Tarjeta key={`${c.id}-${c.nombre}`} c={c} prov={g.slug} />)}
                </ul>
              </div>
            ))}
          </div>

          {provinciasSinCentros.length > 0 && (
            <p className="text-sm text-gray-600 mt-8 leading-relaxed">
              El buscador oficial no lista centros de atención propios en {provinciasSinCentros.join(', ')}. En esas provincias podés
              ubicar la <Link href="/obras-sociales/osecac#delegaciones" className="text-[#E8002D] hover:underline">delegación más cercana</Link> o llamar al
              0800-666-0400.
            </p>
          )}
          <p className="text-xs text-gray-400 leading-relaxed mt-4">
            Fuente: buscador oficial de centros de atención de OSECAC (<a href={`${OFICIAL}/Centros`} target="_blank" rel="noopener noreferrer" className="underline">osecac.org.ar/Centros</a>),
            consultado el {fecha}. Los nombres figuran tal cual los publica OSECAC. Antes de ir, confirmá dirección y horario.
          </p>
        </div>
      </section>

      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Salud mental (SESAM)</h2>
          <p className="text-sm text-gray-500 mb-4">Centros y atención de salud mental que lista el buscador oficial.</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {CALL_CENTER_SESAM && (
              <li className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="font-semibold text-gray-900 text-sm">{CALL_CENTER_SESAM.nombre}</div>
                <a href={`tel:${telHref(CALL_CENTER_SESAM.telefono)}`} className="text-sm font-semibold text-[#E8002D] hover:underline mt-2 inline-block">{CALL_CENTER_SESAM.telefono}</a>
              </li>
            )}
            {saludMental.map((c) => (
              <li key={`${c.nombre}-${c.direccion}`} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="font-semibold text-gray-900 text-sm">{c.nombre}</div>
                {c.direccion && <div className="text-sm text-gray-700 mt-1">{c.direccion}</div>}
                {c.telefono && <a href={`tel:${telHref(c.telefono)}`} className="text-sm font-semibold text-[#E8002D] hover:underline mt-2 inline-block">{c.telefono}</a>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Teléfonos oficiales de OSECAC</h2>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
            {TELEFONOS.map((t) => (
              <a key={t.etiqueta} href={`tel:${telHref(t.valor)}`} className="rounded-xl border border-gray-200 bg-white p-4 text-center hover:border-[#E8002D] transition-colors">
                <div className="text-xs text-gray-500">{t.etiqueta}</div>
                <div className="text-sm font-bold text-[#E8002D] mt-1">{t.valor}</div>
              </a>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">Para pedir un turno tené a mano el DNI del paciente; pueden pedir las órdenes de prácticas y estudios.</p>
        </div>
      </section>

      <PasateConTusAportes osNombre="OSECAC" osSlug="osecac" fuente="osecac-cartilla" titulo="¿La cartilla de OSECAC te queda corta? Con tus mismos aportes podés tener Swiss Medical" />

      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {FAQ_CARTILLA_OSECAC.map((f) => (
              <details key={f.q} className="group rounded-xl border border-gray-200 bg-white p-4">
                <summary className="cursor-pointer font-semibold text-gray-900 text-sm list-none flex justify-between gap-3">
                  {f.q}
                  <span className="text-gray-400 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-sm text-gray-600 leading-relaxed mt-2">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-6">
            Más sobre la obra social: <Link href="/obras-sociales/osecac" className="text-[#E8002D] hover:underline">OSECAC, teléfonos, turnos y cómo afiliarte</Link>.
          </p>
        </div>
      </section>
    </>
  )
}
