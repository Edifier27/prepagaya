import bancarios from './osba-bancarios.json'
import construir from './construir-salud.json'
import osdop from './osdop.json'
import osmedica from './osmedica.json'
import osperyh from './osperyh.json'
import ospes from './ospes.json'

// Cartillas oficiales de obras sociales sindicales (1-oct-2026): salen del
// Anexo III de la Res. SSSalud 2165/2021, el listado completo de prestadores
// que cada obra social presenta ante la Superintendencia y publica en su web.
// Generado por scripts/cartilla-sindicales/generar.py. Regla: se nombran solo
// instituciones (sanatorios, guardias, centros de diagnóstico); los médicos
// se cuentan, nunca se nombran.

export type TipoInstitucion = 'internacion' | 'guardia' | 'diagnostico'

export interface InstitucionCartilla {
  n: string
  loc: string
  t: TipoInstitucion[]
  dom?: string
  tel?: string
  /** Centro de infertilidad declarado (solo si el centro no tildó todas las especialidades) */
  inf?: boolean
}

export interface ProvinciaCartilla {
  slug: string
  nombre: string
  instituciones: InstitucionCartilla[]
  profesionales: number
  especialidades: Record<string, number>
  farmacias: number
  opticas: number
  ortopedias: number
}

export interface CartillaSindical {
  slug: string
  fuente: string
  paginaFuente: string
  norma: string
  descargado: string
  rnas?: string
  vigencia?: string
  beneficiarios?: number
  provincias: ProvinciaCartilla[]
}

export const CARTILLAS_SINDICALES: Record<string, CartillaSindical> = Object.fromEntries(
  ([bancarios, construir, osdop, osmedica, osperyh, ospes] as CartillaSindical[]).map((c) => [c.slug, c])
)

export function getCartillaSindical(slug: string): CartillaSindical | undefined {
  return CARTILLAS_SINDICALES[slug]
}

/** Provincia con página propia: al menos un sanatorio, guardia o centro con nombre. */
export function provinciasConPagina(c: CartillaSindical): ProvinciaCartilla[] {
  return c.provincias.filter((p) => p.instituciones.length > 0)
}

export function getProvinciaCartilla(c: CartillaSindical, prov: string): ProvinciaCartilla | undefined {
  return provinciasConPagina(c).find((p) => p.slug === prov)
}

export function contar(instituciones: InstitucionCartilla[], tipo: TipoInstitucion): number {
  return instituciones.filter((i) => i.t.includes(tipo)).length
}

export function totales(c: CartillaSindical) {
  const todas = c.provincias.flatMap((p) => p.instituciones)
  return {
    internacion: contar(todas, 'internacion'),
    guardia: contar(todas, 'guardia'),
    diagnostico: contar(todas, 'diagnostico'),
    infertilidad: todas.filter((i) => i.inf).length,
    profesionales: c.provincias.reduce((n, p) => n + p.profesionales, 0),
    farmacias: c.provincias.reduce((n, p) => n + p.farmacias, 0),
    provincias: c.provincias.length,
  }
}

// Las especialidades vienen sin tildes del Anexo III (nomenclatura de la SSSalud)
const ESPECIALIDADES: Record<string, string> = {
  'cardiologia': 'Cardiología',
  'cirugia general': 'Cirugía general',
  'cirugia infantil': 'Cirugía infantil',
  'cirugia plastica reparadora': 'Cirugía plástica reparadora',
  'cirugia cardiovascular': 'Cirugía cardiovascular',
  'clinica medica': 'Clínica médica',
  'dermatologia': 'Dermatología',
  'endocrinologia': 'Endocrinología',
  'fisiatria': 'Fisiatría',
  'fonoaudiologia': 'Fonoaudiología',
  'gastroenterologia': 'Gastroenterología',
  'ginecologia': 'Ginecología',
  'hematologia': 'Hematología',
  'infectologia': 'Infectología',
  'kinesiologia': 'Kinesiología',
  'medicina familiar': 'Medicina familiar',
  'nefrologia': 'Nefrología',
  'neumonologia': 'Neumonología',
  'neurologia': 'Neurología',
  'nutricion': 'Nutrición',
  'obstetricia': 'Obstetricia',
  'odontologia': 'Odontología',
  'oftalmologia': 'Oftalmología',
  'oncologia': 'Oncología',
  'otorrinolaringologia': 'Otorrinolaringología',
  'pediatria': 'Pediatría',
  'psicologia': 'Psicología',
  'psiquiatria': 'Psiquiatría',
  'reumatologia': 'Reumatología',
  'traumatologia y ortopedia': 'Traumatología y ortopedia',
  'urologia': 'Urología',
}

export function nombreEspecialidad(clave: string): string {
  return ESPECIALIDADES[clave] ?? clave.charAt(0).toUpperCase() + clave.slice(1)
}

/** Especialidades con al menos `minimo` profesionales, de más a menos. */
export function especialidadesDestacadas(p: ProvinciaCartilla, minimo = 1) {
  return Object.entries(p.especialidades)
    .filter(([k, n]) => n >= minimo && k && !k.startsWith('emergencia') && !k.startsWith('internacion'))
    .map(([k, n]) => ({ nombre: nombreEspecialidad(k), n }))
}

export function fechaDescarga(c: CartillaSindical): string {
  return new Date(`${c.descargado}T12:00:00`).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** Localidades de la provincia, de más a menos instituciones. */
export function localidades(p: ProvinciaCartilla): { loc: string; n: number }[] {
  const m = new Map<string, number>()
  for (const i of p.instituciones) m.set(i.loc, (m.get(i.loc) ?? 0) + 1)
  return [...m.entries()].map(([loc, n]) => ({ loc, n })).sort((a, b) => b.n - a.n || a.loc.localeCompare(b.loc, 'es'))
}
