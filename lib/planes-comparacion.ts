import type { Plan, Prepaga } from '@/types'
import { getCartilla, linkCartillaPlan, zonasAmba } from '@/lib/data/cartilla-zonas'
import { coberturasMarca } from '@/lib/data/coberturas-marca'

// Comparación de los planes de una prepaga para su ficha (26-sep-2026):
// "swiss medical planes", "sancor salud planes" y "osde planes" rankeaban en
// la 2ª/3ª página (o no aparecían) mientras las búsquedas de un plan puntual
// ("plan smg20 swiss medical", "plan f800 sancor") ya estaban en 6-10. La
// ficha nombraba los planes pero no los comparaba entre sí. Todo sale de
// datos oficiales: precio de los cuadros de la SSSalud, sanatorios de la
// cartilla oficial relevada y coberturas de los documentos de la prepaga
// (lib/data/coberturas-marca). Lo que no está en una fuente no se muestra.

export interface CoberturaIncluida {
  tema: string
  nombre: string
  detalle?: string
}

export interface FilaPlan {
  plan: Plan
  oficial: boolean
  /** Sanatorios con internación en la cartilla oficial (todo el país) */
  sanatorios?: number
  /** Nombre de la cartilla cuando la comparten varios planes (ej. "SMG30 a SMG70") */
  cartillaLabel?: string
  cartillaHref?: string
  incluye: CoberturaIncluida[]
}

export interface SaltoPlan {
  desde: string
  hasta: string
  nuevos: number
  ejemplos: string[]
}

export interface ComparacionPlanes {
  filas: FilaPlan[]
  saltos: SaltoPlan[]
  /** Temas de cobertura con dato oficial para esta prepaga */
  temas: { tema: string; nombre: string }[]
  fuenteCartilla?: string
  fuentesCobertura: string[]
  entrada: FilaPlan
  sinCopago?: FilaPlan
  masSanatorios?: FilaPlan
  completo: FilaPlan
}

/** Nombres únicos de centros con internación para un plan de la cartilla, AMBA primero. */
function centrosInternacion(prepagaSlug: string, planId: string): string[] {
  const c = getCartilla(prepagaSlug)
  if (!c) return []
  const amba = new Set(zonasAmba(prepagaSlug).map((z) => z.slug))
  const zonas = [...c.zonas].sort((a, b) => Number(amba.has(b.slug)) - Number(amba.has(a.slug)))
  const vistos = new Set<string>()
  for (const z of zonas) for (const ce of z.centros) if (ce.internacion.includes(planId)) vistos.add(ce.nombre)
  return [...vistos]
}

export function compararPlanes(prep: Prepaga): ComparacionPlanes {
  const c = getCartilla(prep.slug)
  const temasMarca = coberturasMarca.filter((x) => x.prepagaSlug === prep.slug)
  const planesOrdenados = [...prep.planes].sort((a, b) => a.precio - b.precio)

  const filas: FilaPlan[] = planesOrdenados.map((plan) => {
    const planCartilla = c?.planes.find((x) => x.comparadorSlug === plan.slug || x.otrosComparadorSlugs?.includes(plan.slug))
    const link = linkCartillaPlan(prep.slug, plan.slug)
    const compartida = planCartilla && (planCartilla.otrosComparadorSlugs?.length ?? 0) > 0
    return {
      plan,
      oficial: plan.fuentePrecio === 'sssalud',
      sanatorios: planCartilla ? centrosInternacion(prep.slug, planCartilla.id).length || undefined : undefined,
      cartillaLabel: compartida ? planCartilla.label : undefined,
      cartillaHref: link?.href,
      incluye: temasMarca.flatMap((t) => {
        const p = t.planes.find((x) => x.planSlugs.includes(plan.slug))
        return p && p.incluido && !p.sinDato ? [{ tema: t.tema, nombre: t.temaNombre, detalle: p.detalle }] : []
      }),
    }
  })

  // Qué sanatorios suma cada escalón de la cartilla (ej. de SMG20 a SMG30)
  const saltos: SaltoPlan[] = []
  if (c) {
    for (let i = 1; i < c.escalera.length; i++) {
      const a = c.planes.find((p) => p.id === c.escalera[i - 1])
      const b = c.planes.find((p) => p.id === c.escalera[i])
      if (!a || !b) continue
      const previos = new Set(centrosInternacion(prep.slug, a.id))
      const nuevos = centrosInternacion(prep.slug, b.id).filter((n) => !previos.has(n))
      if (nuevos.length) saltos.push({ desde: a.label, hasta: b.label, nuevos: nuevos.length, ejemplos: nuevos.slice(0, 4) })
    }
  }

  const conPrecioOficial = filas.filter((f) => f.oficial)
  const base = conPrecioOficial.length ? conPrecioOficial : filas
  const entrada = base[0]
  const completo = base[base.length - 1]
  const sinCopagoFila = base.find((f) => !f.plan.copago)
  const maxSan = Math.max(0, ...base.map((f) => f.sanatorios ?? 0))
  const masSanatorios = maxSan > 0 ? base.find((f) => f.sanatorios === maxSan) : undefined

  return {
    filas,
    saltos,
    temas: temasMarca.map((t) => ({ tema: t.tema, nombre: t.temaNombre })),
    fuenteCartilla: c ? `${c.fuente}, ${c.tipoFecha === 'vigencia' ? 'vigente al' : 'consultado el'} ${c.vigencia}` : undefined,
    fuentesCobertura: [...new Set(temasMarca.flatMap((t) => t.fuentes.map((f) => `${f.nombre} (${f.fecha})`)))],
    entrada,
    sinCopago: sinCopagoFila && sinCopagoFila !== entrada ? sinCopagoFila : undefined,
    masSanatorios: masSanatorios && masSanatorios !== completo ? masSanatorios : undefined,
    completo,
  }
}
