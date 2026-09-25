import type { Metadata } from 'next'
import Link from 'next/link'
import { guias } from '@/lib/data/guias'
import { SITE_NAME, SITE_URL, CONTENT_UPDATE } from '@/lib/utils'
import { BreadcrumbSchema } from '@/components/ui/BreadcrumbSchema'

export const metadata: Metadata = {
  title: 'Trámites de Prepaga 2026: Autorizaciones, Alta, Baja y Traspaso',
  description: 'Guía completa de trámites de medicina prepaga en Argentina: cómo pedir autorizaciones, afiliarte, dar de baja, cambiar de prepaga y derivar los aportes de tu obra social. Paso a paso, actualizado 2026.',
  alternates: { canonical: `${SITE_URL}/tramites` },
  keywords: [
    'tramites prepaga', 'autorizacion prepaga', 'alta prepaga', 'baja prepaga',
    'traspaso de prepaga', 'derivacion de aportes', 'como afiliarse a una prepaga',
  ],
}

interface TramiteGrupo {
  titulo: string
  descripcion: string
  slugs: string[]
}

// Agrupación editorial de las guías de trámites por intención de búsqueda —
// no es 1 a 1 con `categoria` de guias.ts (esa sirve para /guias en general;
// acá la lógica es "qué trámite quiero hacer", que es como busca la gente).
const GRUPOS: TramiteGrupo[] = [
  {
    titulo: 'Afiliarme / dar de alta',
    descripcion: 'Requisitos, documentación y pasos para entrar a una prepaga por primera vez, sumar un integrante o agregar un recién nacido.',
    slugs: ['como-afiliarse-prepaga-requisitos', 'como-contratar-prepaga-online', 'afiliar-recien-nacido-prepaga'],
  },
  {
    titulo: 'Pedir una autorización',
    descripcion: 'Qué estudios y cirugías necesitan autorización previa, cómo pedirla online y cuánto tarda la respuesta.',
    slugs: ['como-pedir-autorizacion-prepaga', 'reintegros-en-prepagas', 'urgencias-guardia-prepaga'],
  },
  {
    titulo: 'Cambiar de prepaga (traspaso)',
    descripcion: 'Cómo pasar de una prepaga a otra sin perder cobertura ni pagar dos cuotas, y qué pasa con las carencias y preexistencias.',
    slugs: ['como-cambiar-de-prepaga', 'prepaga-sin-periodo-carencia', 'preexistencias-que-son-como-funcionan'],
  },
  {
    titulo: 'Derivar los aportes de tu obra social',
    descripcion: 'El trámite de libre elección para redirigir tus aportes a una prepaga en lugar de tu obra social, sin perder el descuento de ley.',
    slugs: ['que-obra-social-tengo-codem', 'derivar-obra-social-a-prepaga', 'obra-social-vs-prepaga'],
  },
  {
    titulo: 'Dar de baja',
    descripcion: 'Cómo pedir la baja de tu prepaga por el botón online, qué plazos respetar y cómo evitar que te sigan facturando.',
    slugs: ['baja-de-prepaga-proceso', 'como-reclamar-a-una-prepaga'],
  },
  {
    titulo: 'Casos particulares',
    descripcion: 'Situaciones que no entran en el trámite estándar: quedarte sin trabajo, la obra social de la empleada doméstica, venir del exterior, o pasar de una prepaga corporativa a una particular.',
    slugs: ['sin-trabajo-obra-social', 'obra-social-empleada-domestica', 'seguro-medico-obligatorio-extranjeros', 'prepaga-corporativa-vs-particular'],
  },
  {
    titulo: 'Obra social: cambios de trabajo y de familia',
    descripcion: 'Cambiar de obra social, sumar los aportes de tu pareja o separarlos después de un divorcio, y hasta qué edad quedan cubiertos los hijos.',
    slugs: ['opcion-de-cambio-obra-social', 'unificar-aportes-obra-social', 'divorcio-obra-social', 'hijos-21-a-25-anos-obra-social'],
  },
]

const faq = [
  { q: '¿Qué trámites puedo hacer sin ir a una sucursal?', a: 'Prácticamente todos. Alta, autorizaciones, reintegros, cambio de plan y baja se hacen online desde 2021, cuando la normativa obligó a las prepagas a ofrecer estos trámites por app o portal web sin exigir presencialidad.' },
  { q: '¿Cuál es el trámite más rápido: cambiar de prepaga o derivar los aportes?', a: 'Cambiar de prepaga contratándola de forma particular suele resolverse en 1-2 semanas. Derivar los aportes de tu obra social a una prepaga es un trámite aparte (se hace en la SSSalud o ARCA/ex AFIP) y la cobertura nueva arranca el primer día del mes siguiente a la confirmación.' },
  { q: '¿Necesito un abogado o gestor para algún trámite de prepaga?', a: 'No, ninguno de los trámites habituales (alta, autorización, baja, traspaso, derivación de aportes) requiere abogado. Solo se recomienda asesoramiento legal si un reclamo escala a un amparo judicial.' },
  { q: '¿Dónde reclamo si una prepaga no resuelve mi trámite?', a: 'Primero por escrito ante la propia prepaga; si no responde o la respuesta es negativa e injustificada, la denuncia se hace gratis y online en sssalud.gob.ar.' },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Trámites de Prepaga en Argentina',
    description: 'Guía completa de trámites de medicina prepaga: autorizaciones, alta, baja, traspaso y derivación de aportes.',
    url: `${SITE_URL}/tramites`,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    dateModified: CONTENT_UPDATE,
    inLanguage: 'es-AR',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  },
]

export default function TramitesPage() {
  const bySlug = Object.fromEntries(guias.map((g) => [g.slug, g]))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="container">
          <BreadcrumbSchema crumbs={[{ label: 'Trámites' }]} />
        </div>
      </div>

      <section className="bg-gradient-to-b from-blue-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trámites de prepaga: la guía completa 2026
          </h1>
          {/* GEO: respuesta directa en los primeros ~200 palabras, antes de
              cualquier navegación — igual criterio que /guias/[slug] y /blog/[slug]. */}
          <p className="text-gray-700 leading-relaxed text-lg">
            Casi todos los trámites de una prepaga en Argentina se hacen online, sin ir a una sucursal: <strong>afiliarte</strong> (alta), <strong>pedir una autorización</strong> para un estudio o cirugía, <strong>cambiar de prepaga</strong> (traspaso), <strong>derivar los aportes</strong> de tu obra social, o <strong>dar de baja</strong> tu cobertura. Esta página reúne, agrupados por lo que necesitás hacer, todos los pasos, plazos legales y requisitos de cada trámite, con la información actualizada a septiembre de 2026.
          </p>
        </div>
      </section>

      <div className="container max-w-4xl mx-auto py-12">
        <Link
          href="/pmo"
          className="flex items-center justify-between gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 mb-10 hover:border-blue-200 transition-colors"
        >
          <div>
            <div className="font-bold text-gray-900 text-sm">Antes de tramitar algo, confirmá si está cubierto por ley</div>
            <div className="text-xs text-gray-500">Guía completa del Programa Médico Obligatorio (PMO): qué cubre cada categoría y con qué porcentaje</div>
          </div>
          <span className="flex-shrink-0 text-sm font-bold text-blue-700">Ver PMO →</span>
        </Link>

        <div className="space-y-10">
          {GRUPOS.map((grupo) => {
            const items = grupo.slugs.map((s) => bySlug[s]).filter((g): g is NonNullable<typeof g> => Boolean(g))
            if (items.length === 0) return null
            return (
              <section key={grupo.titulo}>
                <h2 className="text-xl font-bold text-gray-900 mb-1.5">{grupo.titulo}</h2>
                <p className="text-sm text-gray-500 mb-4 max-w-2xl">{grupo.descripcion}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {items.map((g) => (
                    <Link
                      key={g.slug}
                      href={`/guias/${g.slug}`}
                      className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-200 hover:shadow-sm transition-all group"
                    >
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors text-sm mb-1">
                        {g.titulo}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">{g.metaDescripcion}</p>
                      <span className="text-xs font-semibold text-[#E8002D] group-hover:underline">Ver trámite →</span>
                    </Link>
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        {/* Preguntas frecuentes */}
        <section className="mt-14">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes sobre trámites de prepaga</h2>
          <div className="space-y-3">
            {faq.map((f) => (
              <details key={f.q} className="group bg-white rounded-xl border border-gray-200 p-4 open:border-blue-200">
                <summary className="font-semibold text-gray-900 text-sm cursor-pointer list-none flex items-center justify-between gap-3">
                  {f.q}
                  <span className="text-gray-300 group-open:rotate-45 transition-transform text-lg flex-shrink-0">+</span>
                </summary>
                <p className="text-sm text-gray-600 leading-relaxed mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA de cierre */}
        <div className="mt-12 bg-gradient-to-r from-[#E8002D] to-[#B8001F] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-white font-bold">¿Todavía no elegiste prepaga?</div>
            <div className="text-red-200 text-xs">Antes de hacer cualquier trámite, comparemos precios reales según tu edad y zona.</div>
          </div>
          <Link
            href="/comparador"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-[#E8002D] font-bold rounded-xl text-sm hover:bg-red-50 transition-colors shadow-sm"
          >
            Cotizar gratis →
          </Link>
        </div>

        <div className="mt-10 text-center">
          <Link href="/guias" className="text-sm text-gray-400 hover:text-[#E8002D] transition-colors">
            ← Ver todas las guías de PrepagaYa
          </Link>
        </div>
      </div>
    </>
  )
}
