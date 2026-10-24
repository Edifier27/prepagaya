// Solo servidor: usa las cartillas completas (lib/data/cartilla-zonas).
// Para cada zona del cotizador v2 y cada plan, los 3 sanatorios con
// internación más conocidos y cuántos hay en total. Se calcula una vez por
// instancia y viaja a la página como un objeto chico.
import { CARTILLAS } from '@/lib/data/cartilla-zonas'
import { ZONAS_V2, TODOS_LOS_PLANES_V2 } from '@/lib/cotizador-v2'

export type SanatoriosV2 = Record<string, Record<string, { top: string[]; total: number }>>

// Los más conocidos primero (sin esto el orden es alfabético y arranca por
// clínicas chicas)
const CONOCIDOS = ['trinidad', 'mater dei', 'arcos', 'otamendi', 'suizo', 'italiano', 'brit', 'g[uü]emes', 'finochietto', 'agote', 'zabala',
  'favaloro', 'olivos', 'lomas', 'nordelta', 'san lucas', 'allende', 'reina fabiola', 'privado', 'sirio', 'bazterrica', 'cemic', 'santa isabel',
  'fleni', 'anchorena', 'colegiales', 'providencia'].map((x) => new RegExp(x, 'i'))
const puesto = (n: string) => { const i = CONOCIDOS.findIndex((r) => r.test(n)); return i < 0 ? 99 : i }
// "Sanatorio los ARCOS" → "Sanatorio los Arcos"
const prolijo = (n: string) => n.replace(/\b([A-ZÁÉÍÓÚÑ]{3,})\b/g, (w) => w[0] + w.slice(1).toLowerCase()).replace(/\s*-\s*ASE$/, '').replace(/^Clinica /, 'Clínica ')

let cache: SanatoriosV2 | null = null

export function sanatoriosV2(): SanatoriosV2 {
  if (cache) return cache
  const out: SanatoriosV2 = {}
  for (const zona of ZONAS_V2) {
    if (!zona.cartilla) continue
    out[zona.id] = {}
    for (const k of TODOS_LOS_PLANES_V2) {
      const [prep, planSlug] = k.split('/')
      const c = CARTILLAS[prep]
      const plan = c?.planes.find((x) => x.comparadorSlug === planSlug || x.otrosComparadorSlugs?.includes(planSlug))
      const z = c?.zonas.find((x) => x.slug === (prep === 'osde' ? zona.cartillaOsde ?? zona.cartilla : zona.cartilla))
      if (!plan || !z) continue
      const nombres = z.centros.filter((x) => x.internacion.includes(plan.id)).map((x) => x.nombre)
        .sort((a, b) => puesto(a) - puesto(b) || a.localeCompare(b))
      if (nombres.length) out[zona.id][k] = { top: nombres.slice(0, 3).map(prolijo), total: nombres.length }
    }
  }
  cache = out
  return out
}
