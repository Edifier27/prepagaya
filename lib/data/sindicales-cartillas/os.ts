import { getObraSocialBySlug } from '@/lib/data/obras-sociales'
import { FICHAS_REGISTRO } from '@/lib/data/fichas-registro'

/** Lo que necesitan las páginas de cartilla de una obra social. */
export interface OsCartilla {
  slug: string
  nombre: string
}

/** La obra social de una cartilla: ficha completa (obras-sociales.ts) o ficha del registro de la SSSalud (fichas-registro.ts). */
export function osDeCartilla(slug: string): OsCartilla | undefined {
  const os = getObraSocialBySlug(slug)
  if (os) return { slug: os.slug, nombre: os.nombre }
  const f = FICHAS_REGISTRO.find((x) => x.slug === slug)
  return f ? { slug: f.slug, nombre: f.nombreCorto } : undefined
}
