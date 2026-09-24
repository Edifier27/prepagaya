import { nombreCortoZona, normalizarTexto } from '@/lib/cartilla-zonas-geo'
import { CARTILLAS, indiceZonas, type CentroCartilla } from './index'
import { claveZona, esMismo, nucleoNombre } from './cruce'

// Índice para /buscar-por-sanatorio ("Mis sanatorios", 24-sep-2026): cada
// sanatorio de internación de las cartillas oficiales, agrupado por región
// como en indice-nombres.ts, con TODOS los planes de cada prepaga que lo
// incluyen (no solo el sugerido). Así el cliente puede cruzar varios
// sanatorios y decir qué planes los cubren a todos.
//
// Los planes van como máscara de bits sobre el orden de CARTILLAS[x].planes
// (bit i = planes[i]): el índice pesa una fracción de lo que pesaría con los
// nombres, y el cruce de varios sanatorios es un AND.

export interface PlanIndice {
  id: string
  label: string
  /** Planes del comparador (lib/data/prepagas.ts) que usan esta cartilla: el primero es el principal */
  precio: string[]
}

export interface PrepagaIndice {
  nombre: string
  planes: PlanIndice[]
  /** Ids de plan de menor a mayor cobertura */
  escalera: string[]
  vigencia: string
  fuenteUrl: string
}

export interface SanatorioIndice {
  /** región + palabras distintivas: estable entre builds, sirve para compartir el link */
  id: string
  n: string
  /** nombre de la región para mostrar ("AMBA", "Córdoba") */
  rn: string
  /** zona del motor de precios (lib/precios/motor.ts) */
  z: string
  /** dirección de la primera sede, para distinguir homónimos */
  d?: string
  /** prepaga → [máscara internación, máscara guardia] */
  c: Record<string, [number, number]>
}

export interface IndiceCobertura {
  prepagas: Record<string, PrepagaIndice>
  sanatorios: SanatorioIndice[]
}

const esAmba = (s: string) => s === 'caba' || s.startsWith('gba-')

function mascara(ids: string[], planes: { id: string }[]): number {
  let m = 0
  planes.forEach((p, i) => { if (ids.includes(p.id)) m |= 1 << i })
  return m
}

function zonaPrecio(prepagaSlug: string, zonaSlug: string): string {
  if (esAmba(zonaSlug)) return 'caba'
  const prov = indiceZonas(prepagaSlug).find((z) => z.slug === zonaSlug)?.provinciaSlugs[0] ?? ''
  return prov === 'buenos-aires' ? 'buenos-aires-interior' : prov
}

let cache: IndiceCobertura | null = null

export function indiceCobertura(): IndiceCobertura {
  if (cache) return cache
  const prepagas: Record<string, PrepagaIndice> = {}
  const regiones = new Map<string, { rep: CentroCartilla; s: SanatorioIndice }[]>()

  for (const cart of Object.values(CARTILLAS)) {
    prepagas[cart.prepagaSlug] = {
      nombre: cart.prepagaNombre,
      planes: cart.planes.map((p) => ({ id: p.id, label: p.label, precio: [p.comparadorSlug, ...(p.otrosComparadorSlugs ?? [])].filter((x): x is string => Boolean(x)) })),
      escalera: cart.escalera,
      vigencia: cart.vigencia,
      fuenteUrl: cart.fuenteUrl,
    }
    for (const z of cart.zonas) {
      if (/gba-zona-sud(este|oeste)$/.test(z.slug)) continue // ya están dentro de "GBA Zona Sur"
      const region = esAmba(z.slug) ? 'amba' : `${claveZona(z.slug)}|${z.provincias.join('/')}`
      const rn = esAmba(z.slug) ? 'AMBA' : nombreCortoZona(z.nombre)
      const lista = regiones.get(region) ?? []
      regiones.set(region, lista)
      for (const c of z.centros) {
        if (!c.internacion.length) continue
        const mi = mascara(c.internacion, cart.planes)
        const mg = mascara(c.guardia, cart.planes)
        const previo = lista.find((x) => esMismo(x.rep, c))
        if (previo) {
          const [pi, pg] = previo.s.c[cart.prepagaSlug] ?? [0, 0]
          previo.s.c[cart.prepagaSlug] = [pi | mi, pg | mg]
          continue
        }
        const k = nucleoNombre(c.nombre).join('-')
        if (!k) continue
        lista.push({
          rep: c,
          s: {
            id: `${region.split('|')[0]}~${k}`,
            n: c.nombre,
            rn,
            z: zonaPrecio(cart.prepagaSlug, z.slug),
            ...(c.sedes[0]?.direccion ? { d: c.sedes[0].direccion } : {}),
            c: { [cart.prepagaSlug]: [mi, mg] },
          },
        })
      }
    }
  }

  // Ids repetidos (dos sanatorios distintos con las mismas palabras en la
  // misma región): se desambiguan con un número.
  const vistos = new Map<string, number>()
  const sanatorios = [...regiones.values()].flatMap((l) => l.map((x) => x.s)).map((s) => {
    const n = (vistos.get(s.id) ?? 0) + 1
    vistos.set(s.id, n)
    return n > 1 ? { ...s, id: `${s.id}~${n}` } : s
  })
  cache = { prepagas, sanatorios }
  return cache
}

/** Id del índice para un sanatorio de /sanatorios/[slug] (mismas claves que
 *  lib/data/sanatorios-seo.ts), para abrir el buscador con ese sanatorio ya
 *  cargado. Sin ciudad = AMBA. */
export function idCobertura(claves: string[], excluir: string[] = [], ciudad?: string): string | undefined {
  const candidatos = indiceCobertura().sanatorios.filter((s) => {
    const n = normalizarTexto(s.n)
    const enRegion = ciudad ? normalizarTexto(s.rn).includes(ciudad) : s.rn === 'AMBA'
    return enRegion && claves.every((k) => n.includes(k)) && !excluir.some((k) => n.includes(k))
  })
  // El que figura en más cartillas (el principal, no una sede chica homónima)
  return candidatos.sort((a, b) => Object.keys(b.c).length - Object.keys(a.c).length)[0]?.id
}
