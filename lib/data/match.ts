import { prepagas } from './prepagas'
import { coberturasMarca } from './coberturas-marca'
import { PROVINCIAS } from './provincias-cotizador'
import { planesConTarifa, precioGrupo } from '@/lib/precios/motor'

// Datos para /match-prepaga (24-sep-2026). Solo planes con cuadro oficial
// (se pueden cotizar con precio exacto) y solo coberturas con fuente:
// lib/data/coberturas-marca.ts (documentos oficiales de cada prepaga) y, para
// deporte, los planes Sport de Swiss Medical. Si un plan no tiene dato de un
// tema, no suma ni resta: no se afirma que no lo cubre.

export const USOS_MATCH = [
  { id: 'psicologia', label: 'Hacer terapia', tema: 'psicologia' },
  { id: 'ortodoncia', label: 'Ortodoncia', tema: 'ortodoncia' },
  { id: 'optica', label: 'Anteojos o lentes', tema: 'optica' },
  { id: 'exterior', label: 'Viajar al exterior', tema: 'exterior' },
  { id: 'implantes', label: 'Implantes dentales', tema: 'implantes-dentales' },
  { id: 'deporte', label: 'Gimnasio y deporte', tema: null },
] as const
export type UsoMatch = (typeof USOS_MATCH)[number]['id']

export interface PlanMatch {
  /** "prepaga/plan": misma clave que el motor de precios */
  k: string
  prepaga: string
  prepagaNombre: string
  plan: string
  planNombre: string
  copago: boolean
  redAbierta: boolean
  /** 0 = económico, 1 = intermedio, 2 = alta gama (tercios del precio de referencia) */
  nivel: 0 | 1 | 2
  edadMinima?: number
  edadMaxima?: number
  usos: Partial<Record<UsoMatch, { si: boolean; detalle?: string }>>
}

export interface DatosMatch {
  planes: PlanMatch[]
  /** zona del motor → claves de los planes que tienen precio oficial ahí */
  disponibles: Record<string, string[]>
}

export function datosMatch(): DatosMatch {
  const tarifas = planesConTarifa()
  const planes: Omit<PlanMatch, 'nivel'>[] = []
  const precioRef: Record<string, number> = {}
  for (const [slug, t] of Object.entries(tarifas)) {
    const p = prepagas.find((x) => x.slug === slug)
    if (!p) continue
    for (const pl of p.planes.filter((x) => t.planes.includes(x.slug))) {
      const usos: PlanMatch['usos'] = {}
      for (const u of USOS_MATCH) {
        if (u.tema) {
          const c = coberturasMarca.find((x) => x.prepagaSlug === slug && x.tema === u.tema)
          const dato = c?.planes.find((x) => x.planSlugs.includes(pl.slug))
          if (dato && !dato.sinDato) usos[u.id] = { si: dato.incluido, ...(dato.detalle ? { detalle: dato.detalle } : {}) }
        } else {
          const deporte = pl.cobertura.find((s) => /actividad f[ií]sica/i.test(s))
          if (deporte) usos.deporte = { si: true, detalle: deporte }
        }
      }
      const k = `${slug}/${pl.slug}`
      precioRef[k] = pl.precio
      planes.push({
        k, prepaga: slug, prepagaNombre: p.nombre, plan: pl.slug, planNombre: pl.nombre,
        copago: pl.copago, redAbierta: pl.redAbierta,
        ...(pl.edadMinima ? { edadMinima: pl.edadMinima } : {}),
        ...(pl.edadMaxima ? { edadMaxima: pl.edadMaxima } : {}),
        usos,
      })
    }
  }
  const orden = Object.values(precioRef).sort((a, b) => a - b)
  const t1 = orden[Math.floor(orden.length / 3)]
  const t2 = orden[Math.floor((orden.length * 2) / 3)]
  const conNivel = planes.map((p) => ({ ...p, nivel: (precioRef[p.k] < t1 ? 0 : precioRef[p.k] < t2 ? 1 : 2) as 0 | 1 | 2 }))

  // Disponibilidad: el plan tiene precio oficial en esa zona (persona de 40).
  const disponibles: Record<string, string[]> = {}
  for (const z of new Set(PROVINCIAS.map((p) => p.zonaKey))) {
    disponibles[z] = conNivel.filter((p) => precioGrupo(p.prepaga, p.plan, [40], z)).map((p) => p.k)
  }
  return { planes: conNivel, disponibles }
}
