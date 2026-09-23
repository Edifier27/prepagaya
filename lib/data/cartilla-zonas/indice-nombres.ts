import { nombreCortoZona } from '@/lib/cartilla-zonas-geo'
import { CARTILLAS, type CentroCartilla } from './index'
import { claveZona, esMismo, nucleoNombre, planSugerido } from './cruce'

// Índice liviano de sanatorios de internación de todas las cartillas por zona,
// para el buscador por nombre (components/cartillas/BuscadorSanatorio.tsx):
// "¿Finochietto está en Sancor? No, pero está en OSDE (Plan 210) → Cotizá".
// Se sirve estático desde /api/cartilla-indice y el cliente lo baja recién
// cuando la persona empieza a escribir.
//
// Un grupo = un mismo sanatorio en una región, con las prepagas que lo
// tienen. La región es AMBA (CABA + GBA juntos, porque cada prepaga traza
// distinto los límites) o la ciudad/zona en el interior.

/** [prepagaSlug, prepagaNombre, plan sugerido (texto corto), zonaSlug, zona (texto)] */
export type EntradaIndice = [string, string, string, string, string]

export interface GrupoIndice {
  /** nombre a mostrar */
  n: string
  /** palabras distintivas del nombre, separadas por espacio (para el cruce en el cliente) */
  k: string
  en: EntradaIndice[]
}

const esAmba = (s: string) => s === 'caba' || s.startsWith('gba-')

let cache: GrupoIndice[] | null = null

export function indiceNombres(): GrupoIndice[] {
  if (cache) return cache
  const regiones = new Map<string, { rep: CentroCartilla; g: GrupoIndice }[]>()
  for (const cart of Object.values(CARTILLAS)) {
    for (const z of cart.zonas) {
      if (/gba-zona-sud(este|oeste)$/.test(z.slug)) continue // ya están dentro de "GBA Zona Sur"
      const region = esAmba(z.slug) ? 'amba' : `${claveZona(z.slug)}|${z.provincias.join('/')}`
      const lista = regiones.get(region) ?? []
      regiones.set(region, lista)
      for (const c of z.centros) {
        if (!c.internacion.length) continue
        const plan = planSugerido(cart.prepagaSlug, c)
        if (!plan) continue
        const entrada: EntradaIndice = [cart.prepagaSlug, cart.prepagaNombre, plan.label.replace(/ \(.*\)$/, ''), z.slug, nombreCortoZona(z.nombre)]
        const previo = lista.find((x) => esMismo(x.rep, c))
        if (previo) {
          if (!previo.g.en.some((e) => e[0] === cart.prepagaSlug)) previo.g.en.push(entrada)
        } else {
          lista.push({ rep: c, g: { n: c.nombre, k: nucleoNombre(c.nombre).join(' '), en: [entrada] } })
        }
      }
    }
  }
  cache = [...regiones.values()].flatMap((l) => l.map((x) => x.g)).filter((g) => g.k)
  return cache
}
