import { prepagas } from '@/lib/data/prepagas'
import { getComparativaPlanes } from '@/lib/data/comparativas-planes'
import { escalaPorEdad } from '@/lib/precios/motor'
import { coberturasMarca } from '@/lib/data/coberturas-marca'
import type { Prepaga } from '@/types'

// Comparativas automáticas plan vs plan vecino (4-oct-2026): "osde flux vs
// 210" es de las páginas que más entran desde Google, y se busca lo mismo
// para cada par ("smg20 vs smg30", "osde 210 vs 310"). Acá solo se arman los
// pares; el contenido (cuadro SSSalud, fichas oficiales, cartillas) lo arma
// app/prepagas/[slug]/[plan]/page.tsx con la misma tabla de diferencias de
// la página de plan.

type Plan = Prepaga['planes'][number]

/** Prepagas con precio por edad oficial y fichas plan por plan */
export const PREPAGAS_COMPARATIVA_AUTO = ['swiss-medical', 'osde', 'premedic', 'avalian', 'sancor-salud', 'medife']

/** Escalera de planes por precio, sin variantes (Sport, -cc, Digital Flex, planes con edad acotada) */
export function ordenPlanes(prep: Prepaga): Plan[] {
  return [...prep.planes]
    .filter((x) => !x.slug.startsWith('sport') && !x.slug.endsWith('-cc') && !x.slug.includes('digital-flex') && !x.edadMaxima)
    .sort((a, b) => a.precio - b.precio)
}

// Solo pares con ficha oficial plan por plan en los dos (coberturas-marca):
// sin eso la página sería solo precio y no se puede decir qué cambia.
// Hoy: Swiss Medical, OSDE, Avalian y Premedic.
function conFicha(prepSlug: string, planSlug: string) {
  return coberturasMarca.some((c) => c.prepagaSlug === prepSlug && c.planes.some((f) => f.planSlugs.includes(planSlug)))
}

export function paresComparativaAuto(): { prep: Prepaga; plan1: Plan; plan2: Plan; slug: string }[] {
  const out: { prep: Prepaga; plan1: Plan; plan2: Plan; slug: string }[] = []
  for (const prep of prepagas.filter((p) => PREPAGAS_COMPARATIVA_AUTO.includes(p.slug))) {
    const orden = ordenPlanes(prep)
    for (let i = 0; i + 1 < orden.length; i++) {
      const [plan1, plan2] = [orden[i], orden[i + 1]]
      const slug = `${plan1.slug}-vs-${plan2.slug}`
      if (prep.planes.some((x) => x.slug === slug) || getComparativaPlanes(prep.slug, slug)) continue
      if (!escalaPorEdad(prep.slug, plan1.slug, 'caba') || !escalaPorEdad(prep.slug, plan2.slug, 'caba')) continue
      if (!conFicha(prep.slug, plan1.slug) || !conFicha(prep.slug, plan2.slug)) continue
      out.push({ prep, plan1, plan2, slug })
    }
  }
  return out
}
