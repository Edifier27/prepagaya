import datos from './osecac.json'

// Delegaciones, agencias, sub-agencias y corresponsalías reales de OSECAC en
// todo el país (scripts/sindicales-osecac/scrape.py, buscador oficial de
// osecac.org.ar). Usado en la ficha de OSECAC (/obras-sociales/osecac) para
// "osecac delegaciones", "osecac [ciudad]" — búsqueda real confirmada con
// Google Ads Keyword Planner, 1-oct-2026.

export interface DelegacionOsecac {
  tipo: 'Delegación' | 'Agencia' | 'Sub Agencia' | 'Corresponsalia'
  nombre: string
  direccion?: string
  telefono?: string
  email_whatsapp?: string
  horario?: string
  delegacion_padre?: string
  lat?: number
  lon?: number
  provincia: string
}

export const FUENTE_OSECAC_DELEGACIONES: string = datos.fuente
export const DESCARGADO_OSECAC_DELEGACIONES: string | null = datos.descargado ?? null
export const PROVINCIAS_PARCIALES_OSECAC: string[] = datos.provinciasParciales ?? []
export const NOTA_PROVINCIAS_PARCIALES_OSECAC: string = datos.notaProvinciasParciales ?? ''

export const DELEGACIONES_OSECAC = datos.entidades as DelegacionOsecac[]

const ORDEN_TIPO: Record<string, number> = { Delegación: 0, Agencia: 1, 'Sub Agencia': 2, Corresponsalia: 3 }

export interface GrupoProvinciaOsecac {
  provincia: string
  entidades: DelegacionOsecac[]
}

/** Agrupadas por provincia, cada grupo ordenado por tipo y nombre, provincias ordenadas por cantidad (de más a menos delegaciones). */
export function delegacionesPorProvincia(): GrupoProvinciaOsecac[] {
  const porProvincia = new Map<string, DelegacionOsecac[]>()
  for (const e of DELEGACIONES_OSECAC) {
    if (!porProvincia.has(e.provincia)) porProvincia.set(e.provincia, [])
    porProvincia.get(e.provincia)!.push(e)
  }
  return [...porProvincia.entries()]
    .map(([provincia, entidades]) => ({
      provincia,
      entidades: [...entidades].sort(
        (a, b) => (ORDEN_TIPO[a.tipo] ?? 9) - (ORDEN_TIPO[b.tipo] ?? 9) || a.nombre.localeCompare(b.nombre, 'es')
      ),
    }))
    .sort((a, b) => b.entidades.length - a.entidades.length)
}
