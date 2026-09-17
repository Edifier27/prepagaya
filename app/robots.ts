import type { MetadataRoute } from 'next'

// Bots de motores de IA nombrados a propósito (GEO, 17-sep-2026): el
// wildcard '*' ya los dejaba pasar, pero una regla explícita por nombre
// evita que el día de mañana alguien agregue un Disallow puntual y los
// bloquee sin darse cuenta. Lista: GPTBot/OAI-SearchBot/ChatGPT-User
// (OpenAI), ClaudeBot (Anthropic), PerplexityBot (Perplexity),
// Google-Extended (entrenamiento de Gemini, separado de Googlebot),
// Applebot-Extended (Apple Intelligence), CCBot (Common Crawl, alimenta
// el entrenamiento de varios modelos), meta-externalagent (Meta AI).
const AI_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'meta-externalagent',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: 'https://www.prepagaya.com.ar/sitemap.xml',
  }
}
