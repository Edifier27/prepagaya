// Agrupación de planes por cartilla real compartida (no por nivel de precio).
// Dato provisto directamente por el asesor: dentro de una misma prepaga, dos
// planes pueden compartir exactamente la misma red de prestadores aunque
// difieran en copago u otros extras. Hoy solo está cargado Swiss Medical;
// sumar más prepagas acá cuando se confirme su agrupación real.

export interface GrupoCartilla {
  nombre: string
  planes: string[] // slugs de planes (lib/data/prepagas.ts) que comparten esta cartilla
}

export const CARTILLA_GRUPOS: Record<string, GrupoCartilla[]> = {
  'swiss-medical': [
    { nombre: 'Cartilla Nubial', planes: ['s1', 'smg02'] },
    { nombre: 'Cartilla Global', planes: ['s2', 'smg20'] },
    { nombre: 'Cartilla Premium', planes: ['smg30', 'smg40', 'smg50'] },
  ],
}

export function getGrupoCartilla(prepagaSlug: string, planSlug: string): GrupoCartilla | undefined {
  return CARTILLA_GRUPOS[prepagaSlug]?.find((g) => g.planes.includes(planSlug))
}

// Plan hermano de menor copago dentro del mismo grupo (para sugerir "menos
// copago, misma cartilla"). Si el plan actual ya es el de menor copago del
// grupo, no hay nada que sugerir en esa dirección.
export function getPlanMenosCopago(prepagaSlug: string, planSlug: string, planesDeLaPrep: { slug: string; copago: boolean; precio: number }[]): string | undefined {
  const grupo = getGrupoCartilla(prepagaSlug, planSlug)
  if (!grupo) return undefined
  const actual = planesDeLaPrep.find((p) => p.slug === planSlug)
  if (!actual || !actual.copago) return undefined
  const hermanos = grupo.planes
    .filter((slug) => slug !== planSlug)
    .map((slug) => planesDeLaPrep.find((p) => p.slug === slug))
    .filter((p): p is { slug: string; copago: boolean; precio: number } => Boolean(p))
  const sinCopago = hermanos.filter((p) => !p.copago).sort((a, b) => a.precio - b.precio)
  return sinCopago[0]?.slug
}

// Ordena una lista de planes agrupando primero por cartilla compartida (los
// planes de un mismo grupo quedan pegados) y, dentro de cada grupo, por
// precio. Los planes sin grupo definido van al final, ordenados por precio.
export function ordenarPorCartilla<T extends { slug: string; precio: number }>(prepagaSlug: string, planes: T[]): T[] {
  const grupos = CARTILLA_GRUPOS[prepagaSlug]
  if (!grupos) return [...planes].sort((a, b) => a.precio - b.precio)

  const ordenGrupo = new Map<string, number>()
  grupos.forEach((g, i) => g.planes.forEach((slug) => ordenGrupo.set(slug, i)))

  return [...planes].sort((a, b) => {
    const ga = ordenGrupo.get(a.slug)
    const gb = ordenGrupo.get(b.slug)
    if (ga !== undefined && gb !== undefined && ga !== gb) return ga - gb
    if (ga !== undefined && gb === undefined) return -1
    if (ga === undefined && gb !== undefined) return 1
    return a.precio - b.precio
  })
}
