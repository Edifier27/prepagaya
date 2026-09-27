import Link from 'next/link'
import { terminoPorSlug, type Termino } from '@/lib/data/glosario'
import { SITE_URL } from '@/lib/utils'
import { terminosEnTexto } from './marcarTerminos'

// "Glosario de esta página" (28-sep-2026): las palabras técnicas de la página
// en un acordeón, al pie del contenido. Se arman solas a partir del texto (o
// de una lista de términos), con su fuente oficial y el marcado
// DefinedTermSet para buscadores.

export function GlosarioDePagina({ texto, slugs, max = 10 }: { texto?: string; slugs?: string[]; max?: number }) {
  const lista: Termino[] = (slugs
    ? slugs.map((s) => terminoPorSlug(s)).filter((t): t is Termino => Boolean(t))
    : terminosEnTexto(texto ?? '')
  ).slice(0, max)
  if (lista.length < 2) return null
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Glosario de prepagas',
    url: `${SITE_URL}/glosario`,
    hasDefinedTerm: lista.map((t) => ({
      '@type': 'DefinedTerm',
      name: t.termino,
      description: t.definicion,
      url: `${SITE_URL}/glosario#${t.slug}`,
      inDefinedTermSet: `${SITE_URL}/glosario`,
    })),
  }
  return (
    <section aria-labelledby="glosario-pagina" className="rounded-2xl border border-gray-200 bg-white p-5">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="glosario-pagina" className="text-lg font-bold text-gray-900">Glosario de esta página</h2>
        <Link href="/glosario" className="text-sm font-semibold text-[#E8002D] hover:underline">Glosario completo →</Link>
      </div>
      <p className="mt-1 text-sm text-gray-500">Las palabras técnicas que aparecen acá, explicadas en simple. Tocá una para ver qué significa.</p>
      <ul className="mt-3 divide-y divide-gray-100 border-t border-gray-100">
        {lista.map((t) => (
          <li key={t.slug}>
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-semibold text-gray-900 hover:text-[#E8002D]">
                {t.termino}
                <svg className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </summary>
              <div className="pb-3 text-sm leading-relaxed text-gray-600">
                <p>{t.definicion}</p>
                {t.fuente && (
                  <p className="mt-1.5 text-xs text-gray-400">
                    Fuente: <a href={t.fuente.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">{t.fuente.texto}</a>
                  </p>
                )}
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  )
}
