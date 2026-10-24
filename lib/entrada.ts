// Por dónde entró cada visita (acción 3 de la auditoría, 24-oct-2026). El 57%
// de los leads no decía por qué página entró la persona y ninguno el canal
// (Google, Bing, ChatGPT…). El middleware guarda en una cookie de sesión la
// primera página de la visita y el canal; /api/leads la lee y la guarda con
// el lead (base, CRM y Vercel Analytics). Sin datos personales: solo la ruta
// y el nombre del sitio de origen.

export const COOKIE_ENTRADA = 'pya_entrada'

const PROPIOS = /(^|\.)prepagaya\.com\.ar$|\.vercel\.app$|^localhost$|^127\.0\.0\.1$/

const CANALES: [RegExp, string][] = [
  [/(^|\.)google\.[a-z.]+$|googlequicksearchbox/, 'google'],
  [/(^|\.)bing\.com$/, 'bing'],
  [/(^|\.)yahoo\.com$/, 'yahoo'],
  [/(^|\.)duckduckgo\.com$/, 'duckduckgo'],
  [/(^|\.)ecosia\.org$|(^|\.)brave\.com$|(^|\.)yandex\./, 'otro-buscador'],
  [/(^|\.)chatgpt\.com$|(^|\.)openai\.com$/, 'chatgpt'],
  [/(^|\.)gemini\.google\.com$/, 'gemini'],
  [/(^|\.)copilot\.microsoft\.com$/, 'copilot'],
  [/(^|\.)perplexity\.ai$/, 'perplexity'],
  [/(^|\.)claude\.ai$/, 'claude'],
  [/(^|\.)(facebook|instagram|fb)\.com$|(^|\.)l\.facebook\.com$/, 'redes'],
  [/(^|\.)whatsapp\.com$|(^|\.)wa\.me$/, 'whatsapp'],
]

/** true si el referer es del propio sitio (navegación interna). */
export function esPropio(host: string): boolean {
  return PROPIOS.test(host)
}

/** "google", "bing", "chatgpt"… "directo" sin referer, "otro" para el resto. */
export function canalDeHost(host: string): string {
  if (!host) return 'directo'
  // gemini.google.com antes que google.*
  if (/(^|\.)gemini\.google\.com$/.test(host)) return 'gemini'
  for (const [re, canal] of CANALES) if (re.test(host)) return canal
  return 'otro'
}

export interface Entrada {
  canal: string
  pagina: string
}

export function leerEntrada(valor: string | undefined): Entrada | null {
  if (!valor) return null
  try {
    const e = JSON.parse(valor) as { c?: unknown; p?: unknown }
    const canal = typeof e.c === 'string' && /^[a-z-]{2,20}$/.test(e.c) ? e.c : null
    const pagina = typeof e.p === 'string' && e.p.startsWith('/') ? e.p.slice(0, 100) : null
    return canal && pagina ? { canal, pagina } : null
  } catch {
    return null
  }
}

export function escribirEntrada(e: Entrada): string {
  return JSON.stringify({ c: e.canal, p: e.pagina.slice(0, 100) })
}
