// Solo del lado del servidor (usa el motor de precios).
import { precioGrupo } from '@/lib/precios/motor'
import type { LocalidadZona, ProvinciaSEO } from '@/lib/data/zonas'
import type { Prepaga } from '@/types'

// Precios de las páginas de prepaga por provincia y localidad con la lista
// oficial de esa región (28-sep-2026). Antes mostraban siempre la de CABA:
// en Córdoba el SMG20 figuraba a $346.404 cuando la lista de Córdoba dice
// $259.819. Si la prepaga no declara una región clara para la zona, queda
// el precio de CABA y la página lo aclara.

// Localidades de la provincia de Buenos Aires que las prepagas cotizan como
// interior. La Plata queda sin región: cada prepaga la ubica distinto.
const INTERIOR_BA = new Set(['mar-del-plata', 'bahia-blanca', 'tandil', 'azul'])

export function zonaDeLocalidad(prov: ProvinciaSEO, loc: LocalidadZona): string | null {
  if (prov.slug !== 'buenos-aires') return prov.zonaKey
  if (loc.slug === 'la-plata') return null
  return INTERIOR_BA.has(loc.slug) ? 'buenos-aires-interior' : prov.zonaKey
}

/** Planes con el precio de lista a los 30 años en la zona (directo, con IVA),
 *  ordenados por precio. `regional` = la prepaga declara precio para esa
 *  región; los planes sin precio en ella (por ejemplo, los de cartilla Nubial
 *  de Swiss Medical fuera de AMBA) quedan con precio null. Si no declara la
 *  región, quedan los precios de CABA. */
export function preciosDeZona(prep: Prepaga, zona: string | null) {
  const conRegion = prep.planes.map((plan) => ({ plan, r: zona ? precioGrupo(prep.slug, plan.slug, [30], zona) : null }))
  const regional = conRegion.some((x) => x.plan.fuentePrecio === 'sssalud' && x.r)
  const planes: { plan: Prepaga['planes'][number]; precio: number | null }[] = conRegion
    .map(({ plan, r }) => ({ plan, precio: regional ? r?.total ?? null : plan.precio }))
    .sort((a, b) => (a.precio ?? Infinity) - (b.precio ?? Infinity))
  const conPrecio = planes.filter((x): x is { plan: Prepaga['planes'][number]; precio: number } => x.precio !== null)
  const base = conPrecio.filter((x) => x.plan.fuentePrecio === 'sssalud')
  const desde = conPrecio.length ? Math.min(...(base.length ? base : conPrecio).map((x) => x.precio)) : null
  return { planes, regional, desde }
}
