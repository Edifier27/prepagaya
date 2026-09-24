import datos from './registro-sssalud.json'
import { normalizarBusqueda } from '@/lib/busqueda'

// Registro de obras sociales y prepagas con su código (24-sep-2026). Sale del
// listado que pasó Darío, armado con el Registro Nacional de Agentes del Seguro
// de Salud (RNAS) de la SSSalud, verificado el 20-sep-2026. Se usa en
// /obras-sociales/codigos, en las fichas de obras sociales y en las fichas de
// prepaga (lib/data/convenios.ts).
//
// Criterios al pasarlo a este archivo:
// - Solo lleva código lo que figura en el RNAS (fuente 'rnas'). Las
//   universitarias, IOSFA, OSPJN y la del Congreso tienen régimen propio: sin
//   código, aunque el listado original traía uno sin fuente oficial.
// - Fuera las 4 entradas de "Directorio Histórico Verificado" (sin fuente).
// - Las prepagas del art. 1 inc. i venían con una sigla armada ("OSPS -
//   PREMEDICA S.A."): se muestra la razón social, así no se confunden con la
//   obra social que de verdad usa esa sigla.
// - Hospital Alemán y ASI estaban dos veces (RNEMP y RNAS): quedó la del RNAS.

export type FuenteRegistro = 'rnas' | 'rnemp' | 'provincial' | 'propio'

export interface EntidadRegistro {
  slug: string
  nombre: string
  razonSocial: string
  tipo: string
  sigla?: string
  /** Código RNAS con guiones, ej. "9-0080-5". null si no está en el RNAS. */
  codigo: string | null
  rnemp?: number
  jurisdiccion: string
  provincias?: string[]
  web?: string
  fuente: FuenteRegistro
  fuenteUrl: string
  alias?: string[]
}

export const REGISTRO_VERIFICADO: string = datos.verificado
export const entidadesRegistro = datos.entidades as EntidadRegistro[]

/** "9-0080-5" → "900805": así se carga en AFIP/ARCA y en la opción de cambio. */
export const codigoSeisDigitos = (codigo: string) => codigo.replace(/-/g, '')

export function entidadRegistro(slug: string): EntidadRegistro | undefined {
  return entidadesRegistro.find((e) => e.slug === slug)
}

export const FUENTE_RNAS = 'Superintendencia de Servicios de Salud — Registro Nacional de Agentes del Seguro'

// Grupos del directorio, en el orden en que se muestran.
export const GRUPOS_REGISTRO = [
  { id: 'prepagas', titulo: 'Prepagas', tipos: ['Prepaga'] },
  { id: 'sindicales', titulo: 'Obras sociales sindicales', tipos: ['Obra Social Sindical', 'Obra Social Nacional'] },
  { id: 'direccion', titulo: 'Obras sociales de personal de dirección', tipos: ['Obra Social de Dirección'] },
  { id: 'provinciales', titulo: 'Obras sociales provinciales y de régimen propio', tipos: ['Obra Social Provincial', 'Obra Social Municipal / CABA', 'Obra Social Especial', 'Obra Social Universitaria'] },
] as const

export type GrupoRegistro = (typeof GRUPOS_REGISTRO)[number]['id']

export function grupoDe(e: EntidadRegistro): GrupoRegistro {
  return (GRUPOS_REGISTRO.find((g) => (g.tipos as readonly string[]).includes(e.tipo))?.id ?? 'sindicales')
}

// Prepagas del sitio → entrada del registro. Premedic no figura en el listado
// ("PREMEDICA S.A." es otra empresa, de Catamarca).
export const PREPAGA_A_REGISTRO: Record<string, string> = {
  'swiss-medical': 'swiss-medical',
  osde: 'osde',
  'sancor-salud': 'sancor-salud',
  avalian: 'avalian',
  galeno: 'galeno',
  medife: 'medife',
  omint: 'omint',
  medicus: 'medicus',
  cemic: 'cemic',
  'hospital-italiano': 'ossib',
  'federada-salud': 'federada-salud',
  hominis: 'hominis',
  'luis-pasteur': 'luis-pasteur',
  'prevencion-salud': 'prevencion-salud',
}

// Fichas de obras sociales del sitio que tienen entrada en el registro con otro slug.
// OSPAT queda afuera a propósito: en el RNAS es la obra social del personal
// del turf y la ficha la presenta como de telecomunicaciones (revisar).
const OBRA_SOCIAL_A_REGISTRO: Record<string, string | null> = {
  'swiss-medical-os': 'swiss-medical',
  'sancor-os': 'sancor-salud',
  issn: 'issn-neuquen',
  ipsst: 'ipsst-tucuman',
  iosper: 'iosper-entre-rios',
  insssep: 'insssep-chaco',
  ioscor: 'ips-corrientes',
  ospat: null,
}

export function registroDeObraSocial(osSlug: string): EntidadRegistro | undefined {
  const slug = osSlug in OBRA_SOCIAL_A_REGISTRO ? OBRA_SOCIAL_A_REGISTRO[osSlug] : osSlug
  return slug ? entidadRegistro(slug) : undefined
}

/** Texto de búsqueda: minúsculas, sin tildes, con el código con y sin guiones. */
export function textoBusqueda(e: EntidadRegistro): string {
  return normalizarBusqueda([e.nombre, e.razonSocial, e.sigla, ...(e.alias ?? []), e.codigo, e.codigo && codigoSeisDigitos(e.codigo), e.jurisdiccion].filter(Boolean).join(' '))
}
