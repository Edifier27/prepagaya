import sancorFarmaciasData from './sancor-salud-farmacias.json'
import avalianFarmaciasData from './avalian-farmacias.json'
import premedicFarmaciasData from './premedic-farmacias.json'

// Cartilla de farmacias por zona — SOLO comercios habilitados (nunca datos de
// médicos particulares; en farmacias no aplica ese problema, son negocios).
// Fuentes: categoría propia en el buscador oficial de cada prepaga.
//  - Sancor Salud: scripts/cartilla-sancor/farmacias.py (categoría "FARMACIAS")
//  - Avalian: scripts/cartilla-avalian/farmacias.py (clase "1")
//  - Premedic: scripts/cartilla-premedic/farmacias.py (prestación "90")
// OSDE y Swiss Medical quedan para una siguiente etapa (29-sep-2026).

export interface SedeFarmacia {
  direccion: string | null
  localidad: string | null
  tel: string | null
  lat: number | null
  lon: number | null
  turnoDigital: boolean
}

export interface CentroFarmacia {
  nombre: string
  /** Planes con los que la farmacia figura */
  planes: string[]
  notas: string[]
  sedes: SedeFarmacia[]
}

export interface ZonaFarmacias {
  slug: string
  nombre: string
  provincias: string[]
  centros: CentroFarmacia[]
}

interface FarmaciasJson {
  fuente: string
  vigencia: string[]
  planes: string[]
  zonas: ZonaFarmacias[]
}

const FUENTES: Partial<Record<string, FarmaciasJson>> = {
  'sancor-salud': sancorFarmaciasData as FarmaciasJson,
  avalian: avalianFarmaciasData as FarmaciasJson,
  premedic: premedicFarmaciasData as FarmaciasJson,
}

export function tieneFarmacias(prepagaSlug: string): boolean {
  return Boolean(FUENTES[prepagaSlug])
}

export function prepagasConFarmacias(): string[] {
  return Object.keys(FUENTES)
}

export function getZonaFarmacias(prepagaSlug: string, zonaSlug: string): ZonaFarmacias | undefined {
  return FUENTES[prepagaSlug]?.zonas.find((z) => z.slug === zonaSlug)
}

export function zonasConFarmacias(prepagaSlug: string): string[] {
  return FUENTES[prepagaSlug]?.zonas.map((z) => z.slug) ?? []
}

export function fuenteFarmacias(prepagaSlug: string): { fuente: string; vigencia: string } | undefined {
  const d = FUENTES[prepagaSlug]
  if (!d) return undefined
  return { fuente: d.fuente, vigencia: d.vigencia[d.vigencia.length - 1] ?? '' }
}
