'use client'

import { Analytics } from '@vercel/analytics/next'

// Vercel Analytics sin el panel interno (acción 3e, 24-oct-2026): /panel-leads
// sumaba ~88 "visitantes" por mes, que son Darío y Gabriela.
export function AnalyticsSitio() {
  return <Analytics beforeSend={(e) => (new URL(e.url).pathname.startsWith('/panel-leads') ? null : e)} />
}
