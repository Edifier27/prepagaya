import type { ZonaFarmacias } from './farmacias'
import swissMedicalOpticasData from './swiss-medical-opticas.json'
import osdeOpticasData from './osde-opticas.json'
import sancorOpticasData from './sancor-salud-opticas.json'
import swissMedicalVacunatoriosData from './swiss-medical-vacunatorios.json'
import osdeVacunatoriosData from './osde-vacunatorios.json'
import sancorVacunatoriosData from './sancor-salud-vacunatorios.json'
import avalianVacunatoriosData from './avalian-vacunatorios.json'
import premedicVacunatoriosData from './premedic-vacunatorios.json'

// Ópticas y vacunatorios por zona (Darío, 2-nov-2026) — mismo formato y mismo
// criterio que farmacias: SOLO comercios e instituciones, nunca médicos
// particulares. Fuente: la categoría propia del buscador oficial de cada
// prepaga (o la sección del PDF oficial en OSDE):
//  - Swiss Medical: scripts/cartilla-swiss/rubros.py ("Ópticas", "Vacunatorios")
//  - OSDE: scripts/cartilla-osde/merge.py ("Ópticas" de "Ópticas y ortopedias";
//    "Centros de vacunación" de la página de farmacias)
//  - Sancor Salud: scripts/cartilla-sancor/rubros.py ("OPTICAS", "VACUNATORIOS")
//  - Avalian: scripts/cartilla-avalian/rubros.py (clase 6; la clase 2 de
//    ópticas existe pero viene vacía en todo el país)
//  - Premedic: scripts/cartilla-premedic/rubros.py (prestación 91; no tiene ópticas)

export type RubroComercio = 'opticas' | 'vacunatorios'

interface ComerciosJson {
  fuente: string
  vigencia: string[]
  planes: string[]
  zonas: ZonaFarmacias[]
}

export const RUBROS_COMERCIO: Record<RubroComercio, { label: string; plural: string }> = {
  opticas: { label: 'Ópticas', plural: 'ópticas' },
  vacunatorios: { label: 'Vacunatorios', plural: 'vacunatorios' },
}

const FUENTES: Record<RubroComercio, Partial<Record<string, ComerciosJson>>> = {
  opticas: {
    'swiss-medical': swissMedicalOpticasData as ComerciosJson,
    osde: osdeOpticasData as ComerciosJson,
    'sancor-salud': sancorOpticasData as ComerciosJson,
  },
  vacunatorios: {
    'swiss-medical': swissMedicalVacunatoriosData as ComerciosJson,
    osde: osdeVacunatoriosData as ComerciosJson,
    'sancor-salud': sancorVacunatoriosData as ComerciosJson,
    avalian: avalianVacunatoriosData as ComerciosJson,
    premedic: premedicVacunatoriosData as ComerciosJson,
  },
}

export function esRubroComercio(x: string): x is RubroComercio {
  return x in RUBROS_COMERCIO
}

/** Rubros (ópticas, vacunatorios) que tiene la cartilla de esta prepaga */
export function rubrosDe(prepagaSlug: string): RubroComercio[] {
  return (Object.keys(FUENTES) as RubroComercio[]).filter((r) => Boolean(FUENTES[r][prepagaSlug]?.zonas.length))
}

export function prepagasConRubro(rubro: RubroComercio): string[] {
  return Object.keys(FUENTES[rubro])
}

export function zonasConRubro(rubro: RubroComercio, prepagaSlug: string): string[] {
  return FUENTES[rubro][prepagaSlug]?.zonas.map((z) => z.slug) ?? []
}

export function getZonaRubro(rubro: RubroComercio, prepagaSlug: string, zonaSlug: string): ZonaFarmacias | undefined {
  return FUENTES[rubro][prepagaSlug]?.zonas.find((z) => z.slug === zonaSlug)
}

/** Fuente y fecha de consulta de ese rubro (puede ser distinta a la de sanatorios y guardias) */
export function fuenteRubro(rubro: RubroComercio, prepagaSlug: string): { fuente: string; vigencia: string } | undefined {
  const d = FUENTES[rubro][prepagaSlug]
  if (!d) return undefined
  return { fuente: d.fuente, vigencia: d.vigencia[d.vigencia.length - 1] ?? '' }
}
