import { normalizarTexto } from '@/lib/cartilla-zonas-geo'
import type { CentroCartilla, ZonaCartilla } from '@/lib/data/cartilla-zonas'

// Resumen de la cartilla oficial de un plan en una zona: los sanatorios de
// renombre (lista curada de lib/data/sanatorios.ts) o, si no hay, un
// pantallazo de prestadores. Lo usa el recuadro "Con el plan en tu zona" de
// las páginas de plan: en el servidor para CABA (28-sep-2026, así Google ve
// los sanatorios del plan) y en el navegador para la zona de la persona.

export interface CentroResumen {
  nombre: string
  ubicacion: string
  internacion: boolean
  guardia: boolean
}

export interface ResumenZonaPlan {
  zonaSlug: string
  zonaNombre: string
  destacados: CentroResumen[]
  pantallazo: CentroResumen[]
  totalInternacion: number
  totalGuardia: number
}

// Palabras que no identifican a un sanatorio ("Sanatorio", "Clínica"...): se
// ignoran al comparar el nombre de la cartilla con la lista curada.
const GENERICAS = new Set(['sanatorio', 'clinica', 'hospital', 'instituto', 'centro', 'medico', 'de', 'del', 'la', 'las', 'los', 'el', 'y', 'sede', 'fundacion', 'privado', 'privada'])
const tokens = (t: string) => normalizarTexto(t).split(' ').filter((w) => w.length > 2 && !GENERICAS.has(w))

/** Claves de la lista curada: cada nombre o alias como conjunto de palabras */
export function clavesRenombre(renombre: { nombre: string; aliases: string[] }[]): string[][] {
  return renombre.flatMap((s) => [s.nombre, ...s.aliases].map(tokens)).filter((k) => k.length > 0)
}

export function resumirZonaPlan(z: ZonaCartilla, zonaSlug: string, zonaNombre: string, planId: string, claves: string[][]): ResumenZonaPlan {
  const esRenombre = (c: CentroCartilla) => {
    const t = new Set(tokens(c.nombre))
    return claves.some((k) => k.every((w) => t.has(w)))
  }
  const resumir = (c: CentroCartilla): CentroResumen => ({
    nombre: c.nombre,
    ubicacion: [c.sedes[0]?.direccion, c.sedes[0]?.localidad].filter(Boolean).join(', '),
    internacion: c.internacion.includes(planId),
    guardia: c.guardia.includes(planId),
  })
  const delPlan = z.centros.filter((c) => c.internacion.includes(planId) || c.guardia.includes(planId))
  return {
    zonaSlug,
    zonaNombre,
    destacados: delPlan.filter(esRenombre).map(resumir),
    // Sin sanatorios de la lista en la zona: los primeros prestadores de la
    // cartilla del plan, internación primero
    pantallazo: [...delPlan].sort((a, b) => Number(b.internacion.includes(planId)) - Number(a.internacion.includes(planId))).slice(0, 3).map(resumir),
    totalInternacion: delPlan.filter((c) => c.internacion.includes(planId)).length,
    totalGuardia: delPlan.filter((c) => c.guardia.includes(planId)).length,
  }
}
