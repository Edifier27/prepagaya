import datos from './sucursales.json'
import type { LocalidadZona, ProvinciaSEO } from './zonas'
import { normalizarBusqueda } from '@/lib/busqueda'

// Sucursales oficiales de cada prepaga (24-sep-2026). Las baja la GitHub
// Action "Sucursales de prepagas" (scripts/sucursales/bajar.py) de los
// buscadores oficiales y las guarda en sucursales.json. Search Console:
// "[prepaga] + [ciudad]" (ej. "osde rosario") es un cuarto de las
// impresiones y se busca la sucursal; se muestran en las páginas de prepaga
// por provincia y por localidad.

export interface Sucursal {
  prepaga: string
  nombre: string
  direccion: string
  localidad?: string
  /** Provincia o región tal cual la fuente ("Santa Fé", "Gran Buenos Aires") */
  region?: string
  telefono?: string
  horario?: string
  lat?: number
  lon?: number
}

export const SUCURSALES_GENERADO: string | null = datos.generado
export const FUENTES_SUCURSALES = datos.fuentes as Record<string, string>
const TODAS = datos.sucursales as Sucursal[]

const n = (s: string | undefined) => normalizarBusqueda(s ?? '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()

/** Nombres con los que una localidad del sitio puede aparecer en una fuente. */
function alias(loc: LocalidadZona, prov: ProvinciaSEO): string[] {
  const nombre = n(loc.nombre)
  const partes = [nombre.replace(/\s*capital$/, ''), ...(loc.nombre.match(/\(([^)]*)\)/)?.[1].split(/,| y /) ?? []).map(n)]
  const sinParentesis = n(loc.nombre.replace(/\(.*\)/, ''))
  partes.push(sinParentesis, ...sinParentesis.split(' y ').map((x) => x.trim()))
  // La capital también aparece como "Ciudad de X", "X Capital" o el nombre de la provincia
  // (solo si la localidad ES la capital: en Santa Fe el campo dice "Rosario y
  // Santa Fe capital" y Rosario no es la capital)
  if (/capital$/.test(nombre) || n(prov.capitalNombre) === nombre) partes.push(n(prov.nombre), `ciudad de ${n(prov.nombre)}`)
  if (loc.slug === 'san-miguel-de-tucuman') partes.push('tucuman')
  if (loc.slug === 'villa-devoto') partes.push('devoto')
  return [...new Set(partes.filter((x) => x.length > 2 && !/^zona (norte|sur|oeste)$/.test(x)))]
}

// Barrios porteños (y cómo los nombran las fuentes), para separar CABA del GBA.
const BARRIOS_CABA = new Set(['capital federal', 'caba', 'ciudad de buenos aires', 'agronomia', 'almagro', 'balvanera', 'barracas', 'belgrano',
  'boedo', 'caballito', 'chacarita', 'coghlan', 'colegiales', 'constitucion', 'flores', 'floresta', 'la boca', 'la paternal', 'liniers',
  'mataderos', 'monte castro', 'monserrat', 'nueva pompeya', 'nunez', 'palermo', 'parque avellaneda', 'parque chacabuco', 'parque chas',
  'parque patricios', 'puerto madero', 'recoleta', 'barrio norte', 'retiro', 'saavedra', 'san cristobal', 'san nicolas', 'microcentro',
  'san telmo', 'velez sarsfield', 'versalles', 'villa crespo', 'villa del parque', 'villa devoto', 'devoto', 'villa general mitre',
  'villa lugano', 'villa luro', 'villa ortuzar', 'villa pueyrredon', 'villa real', 'villa riachuelo', 'villa santa rita', 'villa soldati',
  'villa urquiza'])

/** Provincia del sitio a la que pertenece una sucursal (por región o por localidad). */
function provinciaDe(s: Sucursal, provincias: ProvinciaSEO[]): string | null {
  const r = n(s.region)
  if (r) {
    if (/ciudad autonoma|capital federal|^caba$/.test(r)) return 'caba'
    // OSDE agrupa "Ciudad de Buenos Aires y GBA": se separa por la localidad.
    if (/ciudad de buenos aires y gba/.test(r)) return BARRIOS_CABA.has(n(s.localidad)) ? 'caba' : 'buenos-aires'
    if (/gran buenos aires/.test(r)) return 'buenos-aires'
    const p = provincias.find((x) => n(x.nombre) === r)
    if (p) return p.slug
    if (r === 'buenos aires') return 'buenos-aires'
    return null
  }
  // Sin región (Premedic): por el nombre de la localidad
  const l = n(s.localidad)
  for (const p of provincias) if (p.localidades.some((loc) => alias(loc, p).includes(l))) return p.slug
  return null
}

export function sucursalesEnProvincia(prepaga: string, prov: ProvinciaSEO, provincias: ProvinciaSEO[]): Sucursal[] {
  return TODAS.filter((s) => s.prepaga === prepaga && provinciaDe(s, provincias) === prov.slug)
}

export function sucursalesEnLocalidad(prepaga: string, prov: ProvinciaSEO, loc: LocalidadZona, provincias: ProvinciaSEO[]): Sucursal[] {
  const a = alias(loc, prov)
  return sucursalesEnProvincia(prepaga, prov, provincias).filter((s) => {
    const l = n(s.localidad)
    const nom = n(s.nombre)
    return a.includes(l) || a.some((x) => nom.endsWith(` ${x}`) || nom.includes(` ${x} `))
  })
}

export function linkMapa(s: Sucursal): string {
  const q = s.lat && s.lon ? `${s.lat},${s.lon}` : `${s.direccion}${s.localidad ? `, ${s.localidad}` : ''}, Argentina`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
}

export function totalSucursales(prepaga: string): number {
  return TODAS.filter((s) => s.prepaga === prepaga).length
}
