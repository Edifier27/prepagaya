declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

// Eventos para GTM/GA4. Todos van al dataLayer con sus parámetros; en GTM una
// etiqueta GA4 por evento (o una sola con nombre {{Event}}) los manda a GA4.
//
// generate_lead (29-sep-2026): se llama justo después de que /api/leads
// responde bien, en cada formulario de "Cotizar". Es la conversión.
//
// Embudo (1-oct-2026, auditoría de medición): abrir_cotizador (abre un
// formulario), wizard_paso (avanza en el comparador), click_telefono y
// click_whatsapp (ClicsMedibles, en el layout). Con estos se ve dónde se cae
// la gente antes de dejar sus datos.

function push(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  const limpiaPaso = event === 'generate_lead' || event === 'abrir_cotizador' ? { paso: undefined } : {}
  window.dataLayer.push({ event, pagina: window.location.pathname, ...limpiaPaso, ...params })
}

export function trackEvent(event: string, params: Record<string, unknown> = {}) {
  push(event, params)
}

/** Conversión: el formulario se envió bien. `fuente` dice desde qué formulario/página. */
export function trackLead(fuente: string, params: { prepaga?: string } = {}) {
  push('generate_lead', { fuente, ...params })
  // Para no mostrarle más el popup de salida a quien ya dejó sus datos
  try { localStorage.setItem('pya_lead_enviado', String(Date.now())) } catch {}
}
