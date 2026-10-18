// De la página de cartilla de una zona (/cartillas/[prepaga]/[zona]) a la
// página de planes y precios de esa misma ciudad (/prepagas/[prov]/[loc]/[prepaga]).
// 18-oct-2026: la de planes y precios ya enlazaba a la cartilla, pero la
// cartilla no devolvía el enlace. Para "[prepaga] [ciudad]" las dos páginas
// salen en Google (Rosario: 618 y 485 impresiones en posición 5,5 y 6) con
// intenciones distintas (cartilla vs. planes y precios); el enlace de ida y
// vuelta las separa para el visitante y lleva a quien viene por la cartilla
// hacia el precio local.
import { provinciasSEO, prepagaEnLocalidad } from '@/lib/data/zonas'
import { linkCartillaZona } from '@/lib/data/cartilla-zonas'

interface Destino {
  href: string
  localidad: string
  provHref: string
  provNombre: string
}

let indice: Map<string, Destino[]> | null = null

function armarIndice() {
  const m = new Map<string, Destino[]>()
  for (const prov of provinciasSEO) {
    for (const pz of prov.prepagas) {
      for (const loc of prov.localidades) {
        if (!prepagaEnLocalidad(pz, loc.slug)) continue
        const link = linkCartillaZona(pz.slug, prov.slug, prov.nombre, loc.nombre)
        if (!link || !link.zonaNombre) continue
        const zonaSlug = link.href.split('/').pop()!
        const k = `${pz.slug}|${zonaSlug}`
        const lista = m.get(k) ?? []
        lista.push({
          href: `/prepagas/${prov.slug}/${loc.slug}/${pz.slug}`,
          localidad: loc.nombre,
          provHref: `/prepagas/${prov.slug}/${pz.slug}`,
          provNombre: prov.nombre,
        })
        m.set(k, lista)
      }
    }
  }
  return m
}

/**
 * Enlace a los planes y precios de la prepaga en la ciudad de esa zona de la
 * cartilla. Si la zona abarca una sola localidad, va a la página de esa
 * localidad; si abarca varias de la misma provincia (CABA, GBA), a la de la
 * provincia; si no hay página propia, null (se usa la ficha de la prepaga).
 */
export function enlacePlanesDeLaZona(prepagaSlug: string, prepagaNombre: string, zonaSlug: string): { href: string; texto: string } | null {
  indice ??= armarIndice()
  const lista = indice.get(`${prepagaSlug}|${zonaSlug}`)
  if (!lista?.length) return null
  if (lista.length === 1) return { href: lista[0].href, texto: `Planes y precios de ${prepagaNombre} en ${lista[0].localidad}` }
  const provincias = new Set(lista.map((x) => x.provHref))
  if (provincias.size === 1) return { href: lista[0].provHref, texto: `Planes y precios de ${prepagaNombre} en ${lista[0].provNombre}` }
  return null
}
