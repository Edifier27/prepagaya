// Solo servidor: usa las cartillas completas (lib/data/cartilla-zonas).
// Para cada zona del cotizador v2 y cada plan, los 3 sanatorios con
// internación más conocidos y cuántos hay en total; y las localidades de la
// cartilla que el popup ofrece por prepaga. Se calcula una vez por instancia
// y viaja a la página como un objeto chico.
import { CARTILLAS } from '@/lib/data/cartilla-zonas'
import { ZONAS_V2, TODOS_LOS_PLANES_V2, CARTILLAS_ZONA_V2, puestoSanatorio, nombreProlijo } from '@/lib/cotizador-v2'

export interface SanatoriosV2 {
  /** zona → plan → top 3 con internación y total */
  top: Record<string, Record<string, { top: string[]; total: number }>>
  /** zona → prepaga → localidades de su cartilla */
  localidades: Record<string, Record<string, { slug: string; nombre: string }[]>>
}

let cache: SanatoriosV2 | null = null

export function sanatoriosV2(): SanatoriosV2 {
  if (cache) return cache
  const out: SanatoriosV2 = { top: {}, localidades: {} }
  const prepagasV2 = [...new Set(TODOS_LOS_PLANES_V2.map((k) => k.split('/')[0]))]
  for (const zona of ZONAS_V2) {
    out.localidades[zona.id] = {}
    for (const prep of prepagasV2) {
      const zonas = CARTILLAS[prep]?.zonas ?? []
      const locs = (CARTILLAS_ZONA_V2[zona.id] ?? []).map((slug) => zonas.find((z) => z.slug === slug)).filter((z) => !!z)
      if (locs.length) out.localidades[zona.id][prep] = locs.slice(0, 8).map((z) => ({ slug: z.slug, nombre: z.nombre }))
    }
    if (!zona.cartilla) continue
    out.top[zona.id] = {}
    for (const k of TODOS_LOS_PLANES_V2) {
      const [prep, planSlug] = k.split('/')
      const c = CARTILLAS[prep]
      const plan = c?.planes.find((x) => x.comparadorSlug === planSlug || x.otrosComparadorSlugs?.includes(planSlug))
      const z = c?.zonas.find((x) => x.slug === (prep === 'osde' ? zona.cartillaOsde ?? zona.cartilla : zona.cartilla))
      if (!plan || !z) continue
      const nombres = z.centros.filter((x) => x.internacion.includes(plan.id)).map((x) => x.nombre)
        .sort((a, b) => puestoSanatorio(a) - puestoSanatorio(b) || a.localeCompare(b))
      if (nombres.length) out.top[zona.id][k] = { top: nombres.slice(0, 3).map(nombreProlijo), total: nombres.length }
    }
  }
  cache = out
  return out
}
