import type { ZonaDetectada } from '@/lib/geo-zonas'

// Tipos y lógica client-safe de la cartilla por zona (OSDE, Premedic,
// Avalian). NO importa los JSON de datos: esto se usa en client components y
// no tiene que arrastrar la cartilla entera al bundle. Los centros de cada
// zona se piden aparte a /api/cartilla-zona/[prepaga]/[zona].

export type SeccionCartilla = 'internacion' | 'guardia'

export interface PlanCartilla {
  /** Id tal cual lo usa la fuente (ej. "210", "Flux", "Integral") */
  id: string
  /** Texto para mostrar, ej. "Plan 210", "Integral (AS200/AS204)" */
  label: string
  /** slug del plan en lib/data/prepagas.ts, si está en el comparador */
  comparadorSlug?: string
  /** Otros planes del comparador que usan esta misma cartilla (ej. S2 → Global) */
  otrosComparadorSlugs?: string[]
}

export interface ZonaCartillaIndice {
  slug: string
  /** Nombre de la zona tal cual lo usa la fuente, ej. "GBA Zona Norte", "Villa Carlos Paz" */
  nombre: string
  /** Slugs de provincia (mismos que ZonaDetectada.wizardSlug) */
  provinciaSlugs: string[]
  /** Nombre de provincia(s) para agrupar en el selector */
  provinciaNombre: string
  /** Localidades que aparecen en las direcciones de los centros de la zona */
  localidades: string[]
  internacion: number
  guardia: number
  /** Planes con al menos un centro en la zona */
  planes: string[]
  /** false = zona con muy poco contenido (noindex); sigue navegable */
  indexable: boolean
  /** Zona agregada que la contiene (ej. Sudeste/Sudoeste → GBA Zona Sur) */
  parte?: string
}

export function normalizarTexto(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+y alrededores$/, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function slugPlan(id: string): string {
  return `plan-${normalizarTexto(id).replace(/ /g, '-')}`
}

export function nombreCortoZona(nombre: string): string {
  if (normalizarTexto(nombre) === 'ciudad de buenos aires' || normalizarTexto(nombre) === 'capital federal') return 'CABA'
  return nombre.replace(/ y alrededores$/, '')
}

// Subzona que detecta lib/geo-zonas.ts ("Banfield (GBA Sur)") → slug de la
// zona agregada equivalente. GBA Sur existe como zona propia (OSDE y Avalian
// la parten en Sudeste/Sudoeste; acá se usa la unión, "gba-zona-sur").
const SUBZONA_GBA: Record<string, string> = {
  'gba norte': 'gba-zona-norte',
  'gba sur': 'gba-zona-sur',
  'gba oeste': 'gba-zona-oeste',
}

// Elige la zona de la cartilla que corresponde a la ubicación detectada por
// IP (cookie de middleware.ts). Solo cruza geografía: nombre de la ciudad
// contra el nombre de la zona o las localidades de las direcciones de la
// fuente oficial. Si no hay match claro devuelve null y el visitante elige a
// mano — nunca adivina una zona de otra provincia.
export function zonaParaUbicacion(indice: ZonaCartillaIndice[], zona: ZonaDetectada | null): string | null {
  if (!zona) return null
  const candidatas = indice.filter((z) => z.provinciaSlugs.includes(zona.wizardSlug))
  if (candidatas.length === 0) return null

  if (zona.wizardSlug === 'caba') {
    return candidatas.find((z) => ['ciudad de buenos aires', 'capital federal', 'caba'].includes(normalizarTexto(z.nombre)))?.slug
      ?? (candidatas.length === 1 ? candidatas[0].slug : null)
  }

  // label = "Banfield (GBA Sur)" / "Villa Carlos Paz (Córdoba)" / "Córdoba"
  const ciudad = normalizarTexto(zona.label.replace(/\s*\(.*\)\s*$/, ''))
  const parentesis = normalizarTexto(zona.label.match(/\(([^)]*)\)\s*$/)?.[1] ?? '')
  if (ciudad) {
    const porNombre = candidatas.find((z) => normalizarTexto(z.nombre) === ciudad)
      ?? candidatas.find((z) => normalizarTexto(z.nombre).startsWith(`${ciudad} `))
    if (porNombre) return porNombre.parte ?? porNombre.slug
    const porLocalidad = candidatas.find((z) => z.localidades.some((l) => normalizarTexto(l) === ciudad))
    if (porLocalidad) return porLocalidad.parte ?? porLocalidad.slug
  }

  if (zona.wizardSlug === 'buenos-aires') {
    const agregada = SUBZONA_GBA[parentesis]
    return agregada && indice.some((z) => z.slug === agregada) ? agregada : null
  }

  // Resto del país: si solo detectamos la provincia, la zona con más centros
  // (en general la capital).
  if (ciudad === normalizarTexto(zona.label)) {
    const ordenadas = [...candidatas].sort((a, b) => b.internacion + b.guardia - (a.internacion + a.guardia))
    return ordenadas[0]?.slug ?? null
  }
  return null
}
