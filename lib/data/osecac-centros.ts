import datos from './sindicales-zonas/osecac-centros.json'

// Centros de atención de OSECAC (policlínicos, clínicas, centros propios y de
// salud mental) por provincia. Fuente: buscador público "Centros de atención"
// de osecac.org.ar (scripts/sindicales-osecac/scrape_centros.py), descargado el
// 18-oct-2026. "cartilla osecac" tiene 2.400 búsquedas por mes en el
// Planificador de Google Ads y la cartilla completa exige ingresar con usuario:
// este buscador es lo que OSECAC muestra sin ingresar.

export interface CentroOsecac {
  id: string
  nombre: string
  direccion: string
  telefono: string
  horario: string
  lat: number | null
  lon: number | null
  /** Generales, Pediátricas y Adultos, tal cual figuran en el buscador oficial */
  especialidades: Record<string, string[]>
}

export interface GrupoCentrosOsecac {
  provincia: string
  slug: string
  centros: CentroOsecac[]
}

export const FUENTE_CENTROS_OSECAC: string = datos.fuente
export const DESCARGADO_CENTROS_OSECAC: string = datos.descargado

// El buscador usa los nombres sin tilde; acá se muestran como corresponde.
const NOMBRE_VISIBLE: Record<string, string> = {
  'Capital Federal': 'Ciudad de Buenos Aires',
  Cordoba: 'Córdoba',
  'Entre Rios': 'Entre Ríos',
  Neuquen: 'Neuquén',
  'Rio Negro': 'Río Negro',
  'Santiago Del Estero': 'Santiago del Estero',
  'Tierra Del Fuego': 'Tierra del Fuego',
  Tucuman: 'Tucumán',
}

const esCallCenter = (c: CentroOsecac) => /^Call Center SESAM/i.test(c.nombre)
const esSaludMental = (c: CentroOsecac) => /^SESAM/i.test(c.nombre)

function slugDe(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const crudo = datos.provincias as Record<string, CentroOsecac[]>

/** Teléfono del call center de salud mental, el mismo en todo el interior del país. */
export const CALL_CENTER_SESAM: CentroOsecac | undefined = Object.values(crudo).flat().find(esCallCenter)

/** Centros de salud mental (SESAM) sin repetidos. */
export function centrosSaludMental(): CentroOsecac[] {
  const vistos = new Set<string>()
  const out: CentroOsecac[] = []
  for (const c of Object.values(crudo).flat()) {
    if (!esSaludMental(c) || esCallCenter(c)) continue
    const clave = `${c.nombre}|${c.direccion}`
    if (vistos.has(clave)) continue
    vistos.add(clave)
    out.push(c)
  }
  return out
}

/** Centros por provincia, sin el call center ni los SESAM (van aparte) y sin repetidos; ordenadas de más a menos centros. */
export function centrosPorProvincia(): { grupos: GrupoCentrosOsecac[]; provinciasSinCentros: string[] } {
  const grupos: GrupoCentrosOsecac[] = []
  const sin: string[] = []
  for (const [prov, lista] of Object.entries(crudo)) {
    const nombre = NOMBRE_VISIBLE[prov] ?? prov
    const vistos = new Set<string>()
    const centros = lista.filter((c) => {
      if (esCallCenter(c) || esSaludMental(c)) return false
      const clave = `${c.nombre}|${c.direccion}`
      if (vistos.has(clave)) return false
      vistos.add(clave)
      return true
    })
    if (centros.length === 0) { sin.push(nombre); continue }
    centros.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
    grupos.push({ provincia: nombre, slug: slugDe(nombre), centros })
  }
  grupos.sort((a, b) => b.centros.length - a.centros.length || a.provincia.localeCompare(b.provincia, 'es'))
  return { grupos, provinciasSinCentros: sin.sort((a, b) => a.localeCompare(b, 'es')) }
}

export function totalCentros(): number {
  return centrosPorProvincia().grupos.reduce((n, g) => n + g.centros.length, 0)
}
