'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

// Mide en GA4 (vía GTM) los clics en teléfonos y WhatsApp de cualquier página
// (1-oct-2026). GA4 no los cuenta solo: los "tel:" no son clics salientes y
// los WhatsApp se mezclan con el resto de los enlaces externos. Un solo
// listener en el documento, sin tocar cada enlace.
export function ClicsMedibles() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as HTMLElement | null)?.closest?.('a')
      const href = a?.getAttribute('href') ?? ''
      if (href.startsWith('tel:')) {
        trackEvent('click_telefono', { numero: href.slice(4), texto: a?.textContent?.trim().slice(0, 60) })
      } else if (/wa\.me\/|api\.whatsapp\.com|whatsapp:\/\//.test(href)) {
        trackEvent('click_whatsapp', { destino: href.slice(0, 80) })
      }
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])
  return null
}
