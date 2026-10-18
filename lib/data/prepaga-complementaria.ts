import { obrasSociales, planDesde, type ObraSocialData } from '@/lib/data/obras-sociales'
import { prepagas } from '@/lib/data/prepagas'
import { provinciasSEO, type PrepagaZona, type ProvinciaSEO } from '@/lib/data/zonas'
import type { Plan, Prepaga } from '@/types'

// Prepaga para afiliados a obras sociales provinciales y de las Fuerzas
// (keyword research 18-oct-2026, docs/seo/vetas-keywords-2026-10-18.md):
// "IOMA y prepaga al mismo tiempo", "prepaga para afiliados a IOMA", "APROSS y
// prepaga". Estas obras sociales tienen régimen propio: no están en el
// Registro Nacional de Agentes del Seguro, así que no hay opción de cambio ni
// derivación. La prepaga se contrata como particular y la obra social sigue.
// Los comparadores solo venden derivación y no le hablan a este público.

// Orden: IOMA primero (135.000 búsquedas/mes de la marca, Keyword Planner
// oct-2026); el resto como ORDEN_PROVINCIALES de /obras-sociales/mejores.
export const OS_COMPLEMENTARIA = [
  'ioma', 'apross', 'iapos', 'osep-mendoza', 'oser', 'ips-salta', 'issn', 'ipsst',
  'obsba', 'ips-misiones', 'insssep', 'ioscor', 'ipross', 'osfa',
]

export const URL_HUB_COMPLEMENTARIA = '/obras-sociales/prepaga-complementaria'
export const urlComplementaria = (slug: string) => `/obras-sociales/${slug}/prepaga`
export const tieneComplementaria = (slug: string) => OS_COMPLEMENTARIA.includes(slug)

// Para las que no tienen provincia en el silo local (OSFA es nacional; IPROSS
// todavía no tiene hub de Río Negro): prepagas nacionales con precio oficial.
const NACIONALES = ['swiss-medical', 'osde', 'galeno', 'sancor-salud', 'medife', 'premedic']
const ORDEN_FUERZA: Record<PrepagaZona['fuerza'], number> = { fuerte: 0, media: 1, marginal: 2 }

export interface OpcionPrepaga {
  prepaga: Prepaga
  /** Lo que dice el silo local de esa prepaga en la provincia (solo verificadas) */
  zona?: PrepagaZona
  /** Plan oficial más barato, a 30 años (null si la prepaga no publica precio) */
  desde: { plan: Plan; oficial: boolean } | null
}

export interface DatosComplementaria {
  os: ObraSocialData
  provincia?: ProvinciaSEO
  opciones: OpcionPrepaga[]
}

function opcion(prepaga: Prepaga, zona?: PrepagaZona): OpcionPrepaga {
  const d = planDesde(prepaga.slug)
  return { prepaga, zona, desde: d && Number.isFinite(d.plan.precio) ? { plan: d.plan, oficial: d.oficial } : null }
}

export function datosComplementaria(slug: string): DatosComplementaria | null {
  if (!tieneComplementaria(slug)) return null
  const os = obrasSociales.find((o) => o.slug === slug)
  if (!os) return null
  const provincia = provinciasSEO.find((p) => p.obraSocialProvincial?.slug === slug)
  let opciones: OpcionPrepaga[]
  if (provincia) {
    // Swiss Medical primero (la que se promociona en todo el sitio), después
    // por presencia en la provincia. Solo prepagas con ficha y datos verificados.
    opciones = provincia.prepagas
      .filter((z) => z.enSitio && z.verificado && !z.soloLocalidades)
      .sort((a, b) => (a.slug === 'swiss-medical' ? -1 : b.slug === 'swiss-medical' ? 1 : ORDEN_FUERZA[a.fuerza] - ORDEN_FUERZA[b.fuerza]))
      .flatMap((z) => {
        const p = prepagas.find((x) => x.slug === z.slug)
        return p ? [opcion(p, z)] : []
      })
      .slice(0, 6)
  } else {
    opciones = NACIONALES.flatMap((s) => {
      const p = prepagas.find((x) => x.slug === s)
      return p ? [opcion(p)] : []
    })
  }
  return { os, provincia, opciones }
}

/** Precio de entrada más bajo entre las opciones (para títulos y FAQ) */
export function desdeMinimo(opciones: OpcionPrepaga[]) {
  return opciones
    .filter((o) => o.desde?.oficial)
    .sort((a, b) => a.desde!.plan.precio - b.desde!.plan.precio)[0] ?? null
}
