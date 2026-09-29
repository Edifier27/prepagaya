declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

// Evento de conversión para GTM/GA4 (29-sep-2026): se llama justo después de
// que /api/leads responde bien, en cada uno de los formularios de "Cotizar"
// del sitio. En GTM hay que armar un disparador de evento personalizado
// "generate_lead" y una etiqueta de GA4 que lo escuche — así se puede marcar
// como evento clave (conversión) sin volver a tocar código.
export function trackLead(fuente: string) {
  window.dataLayer?.push({ event: 'generate_lead', fuente })
}
