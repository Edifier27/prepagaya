import swissEspecialidadesData from './swiss-medical-especialidades.json'

// Cartilla por especialidad (pediatría, traumatología, ginecología,
// cardiología, dermatología, oftalmología, esterilidad/fertilidad) — SOLO
// centros e instituciones, nunca datos de médicos particulares. De los
// profesionales particulares solo se guarda la cantidad (deduplicada por su
// id en la fuente oficial). Decisión de Darío, 28-sep-2026.
//
// Por ahora solo Swiss Medical (scripts/cartilla-swiss/especialidades.py);
// se suma OSDE cuando esté su cartilla oficial vigente 2026 parseada.

export interface SedeEspecialidad {
  direccion: string | null
  localidad: string | null
  tel: string | null
  lat: number | null
  lon: number | null
  turnoDigital: boolean
}

export interface CentroEspecialidad {
  nombre: string
  /** Planes (cartillas) con los que el centro figura para esta especialidad */
  planes: string[]
  notas: string[]
  sedes: SedeEspecialidad[]
}

export interface DatosEspecialidad {
  centros: CentroEspecialidad[]
  /** Profesionales particulares (no instituciones) únicos en la zona, todos los planes */
  profesionales: number
  /** Profesionales particulares únicos por plan */
  profesionalesPorPlan: Record<string, number>
}

export interface ZonaEspecialidades {
  slug: string
  nombre: string
  provincias: string[]
  especialidades: Record<string, DatosEspecialidad>
}

interface EspecialidadesJson {
  fuente: string
  vigencia: string[]
  planes: string[]
  especialidades: string[]
  zonas: ZonaEspecialidades[]
}

const FUENTES: Partial<Record<string, EspecialidadesJson>> = {
  'swiss-medical': swissEspecialidadesData as EspecialidadesJson,
}

export function tieneEspecialidades(prepagaSlug: string): boolean {
  return Boolean(FUENTES[prepagaSlug])
}

export function especialidadesDisponibles(prepagaSlug: string): string[] {
  return FUENTES[prepagaSlug]?.especialidades ?? []
}

export function getZonaEspecialidades(prepagaSlug: string, zonaSlug: string): ZonaEspecialidades | undefined {
  return FUENTES[prepagaSlug]?.zonas.find((z) => z.slug === zonaSlug)
}

export function fuenteEspecialidades(prepagaSlug: string): { fuente: string; vigencia: string } | undefined {
  const d = FUENTES[prepagaSlug]
  if (!d) return undefined
  return { fuente: d.fuente, vigencia: d.vigencia[d.vigencia.length - 1] ?? '' }
}

/** Todas las zonas con datos de especialidades de esta prepaga (para generateStaticParams). */
export function zonasConEspecialidades(prepagaSlug: string): string[] {
  return FUENTES[prepagaSlug]?.zonas.map((z) => z.slug) ?? []
}

/** Todos los centros de una especialidad en el país, con el nombre de su zona (ej. para /fertilizacion-asistida). */
export function centrosPorEspecialidad(prepagaSlug: string, especialidad: string): { zona: string; centro: CentroEspecialidad }[] {
  const d = FUENTES[prepagaSlug]
  if (!d) return []
  const out: { zona: string; centro: CentroEspecialidad }[] = []
  for (const z of d.zonas) {
    const e = z.especialidades[especialidad]
    if (!e) continue
    for (const c of e.centros) out.push({ zona: z.nombre, centro: c })
  }
  return out
}
