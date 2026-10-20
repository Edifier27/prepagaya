import { CARTILLAS, type CartillaPrepaga } from '@/lib/data/cartilla-zonas'

// Solo servidor: importa todas las cartillas (lib/cartilla-plan-resumen.ts lo
// usa también el navegador, por eso esto vive aparte).

/** Nombre de la cartilla oficial de un plan: "Global", "Premium", "Plan 310" */
export function cartillaDePlan(c: CartillaPrepaga | undefined, planSlug: string): string | undefined {
  const pc = c?.planes.find((x) => x.comparadorSlug === planSlug || x.otrosComparadorSlugs?.includes(planSlug))
  if (!pc) return undefined
  return pc.label.match(/\(([^)]+)\)$/)?.[1] ?? pc.label
}

/** La cartilla del plan solo cuando tiene nombre propio ("Global"), no cuando
 *  repite el plan ("Plan 310", "SMG02"): para textos y la imagen del plan. */
export function cartillaConNombre(prepSlug: string, plan: { slug: string; nombre: string }): string | undefined {
  const c = cartillaDePlan(CARTILLAS[prepSlug], plan.slug)
  return c && !/^plan\b/i.test(c) && c !== plan.nombre.replace(/^Plan\s+/, '') ? c : undefined
}
