import Link from 'next/link'
import { SITE_NAME, SITE_URL } from '@/lib/utils'

export interface Crumb {
  nombre: string
  href?: string
}

// Breadcrumb visual + JSON-LD BreadcrumbList (regla silo: presente en todas)
export function jsonLdBreadcrumb(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
      ...crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: c.nombre,
        ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}),
      })),
    ],
  }
}

export function BreadcrumbBar({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <div className="bg-gray-50 border-b border-gray-100 py-3">
      <div className="container">
        <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
          <Link href="/" className="hover:text-[#E8002D] transition-colors">{SITE_NAME}</Link>
          {crumbs.map((c) => (
            <span key={c.nombre} className="flex items-center gap-1">
              <span className="text-gray-300">›</span>
              {c.href ? (
                <Link href={c.href} className="hover:text-[#E8002D] transition-colors">{c.nombre}</Link>
              ) : (
                <span className="text-gray-700 truncate max-w-xs">{c.nombre}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  )
}

// CTA principal del silo: siempre al cotizador pre-filtrado por zona
export function CtaCotizador({ zonaKey, provinciaNombre, titulo, subtitulo }: {
  zonaKey: string
  provinciaNombre: string
  titulo?: string
  subtitulo?: string
}) {
  return (
    <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] rounded-2xl p-7 text-white text-center">
      <h2 className="text-xl font-bold mb-2">{titulo ?? `Cotizá tu prepaga en ${provinciaNombre}`}</h2>
      <p className="text-red-100 text-sm mb-5">{subtitulo ?? 'Precios reales por edad y grupo familiar. Solo las prepagas con cobertura en tu zona. Sin registro y sin DNI.'}</p>
      <Link
        href={`/comparador?zona=${zonaKey}&provincia=${encodeURIComponent(provinciaNombre)}`}
        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#E8002D] font-bold rounded-xl text-sm hover:bg-red-50 transition-colors"
      >
        Comparar precios en {provinciaNombre} →
      </Link>
    </div>
  )
}

export function FaqSection({ faq }: { faq: { q: string; a: string }[] }) {
  if (!faq.length) return null
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
      <div className="space-y-2">
        {faq.map(({ q, a }) => (
          <details key={q} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-sm text-gray-900 select-none list-none">
              {q}
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{a}</div>
          </details>
        ))}
      </div>
    </section>
  )
}

export function jsonLdFaq(faq: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

export const FUERZA_LABEL: Record<string, { label: string; cls: string }> = {
  fuerte: { label: 'Cartilla fuerte en la zona', cls: 'bg-green-50 text-green-700 border-green-200' },
  media: { label: 'Presencia media', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  marginal: { label: 'Presencia acotada', cls: 'bg-gray-50 text-gray-500 border-gray-200' },
}
