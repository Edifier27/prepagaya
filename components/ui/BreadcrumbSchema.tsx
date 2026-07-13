import { SITE_URL, SITE_NAME } from '@/lib/utils'

interface Crumb {
  label: string
  href?: string
}

interface Props {
  crumbs: Crumb[]
}

// Renders both visual breadcrumb nav + BreadcrumbList JSON-LD
export function BreadcrumbSchema({ crumbs }: Props): React.ReactElement {
  const all = [{ label: SITE_NAME, href: '/' }, ...crumbs]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="breadcrumb" className="text-sm text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        {all.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>›</span>}
            {c.href && i < all.length - 1 ? (
              <a href={c.href} className="hover:text-[#E8002D] transition-colors">{c.label}</a>
            ) : (
              <span className={i === all.length - 1 ? 'text-gray-700 font-medium' : ''}>{c.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  )
}
