// Solo del lado del servidor.
import { prepagas } from '@/lib/data/prepagas'
import { compararPlanes } from '@/lib/planes-comparacion'
import { ordenPlanes } from '@/lib/comparativas-auto'
import { globosDePlanes } from '@/components/prepagas/ComparacionPlanes'
import { escalaPorEdad } from '@/lib/precios/motor'
import { formatPrecio } from '@/lib/utils'

// Card "estilo Jeep" (Darío, 11-oct-2026): por prepaga, botones con los
// planes (S1 · S2 · SMG02 · SMG20 · SMG30 · SMG50) y al tocar uno cambia la
// card: copago, cartilla, sanatorios, lo que destaca y lo que incluye. Mismos
// datos oficiales que el carrusel de la ficha (lib/planes-comparacion.ts).

export interface PlanSelector {
  slug: string
  codigo: string
  copago: boolean
  sanatorios?: number
  cartilla?: string
  globos: { texto: string; tono: 'rojo' | 'verde' | 'azul' | 'violeta' }[]
  incluye: string[]
  descripcion: string
  /** Precio de lista oficial a los 30 años (CABA y GBA), si hay cuadro SSSalud */
  precio30: string | null
  href: string
}

export interface DatosSelector {
  prepaga: { slug: string; nombre: string; colorPrimario: string }
  planes: PlanSelector[]
}

/** Planes que muestra cada prepaga (Darío: S1, S2, SMG02, SMG20, SMG30, SMG50) */
const PLANES_POR_PREPAGA: Record<string, string[]> = {
  'swiss-medical': ['s1', 's2', 'smg02', 'smg20', 'smg30', 'smg50'],
  // El Flux (18 a 35 años) al final: el 210 es la puerta de entrada para todas las edades
  osde: ['210', '310', '410', '510', 'flux'],
}

const codigo = (nombre: string) => (/\d/.test(nombre) ? nombre.replace(/^Plan /, '') : nombre)

export function datosSelector(slug: string, max = 6): DatosSelector | null {
  const prep = prepagas.find((p) => p.slug === slug)
  if (!prep || prep.planes.length < 2) return null
  const comp = compararPlanes(prep)
  const globos = globosDePlanes(comp)
  const elegidos = PLANES_POR_PREPAGA[slug] ?? ordenPlanes(prep).slice(0, max).map((p) => p.slug)
  const planes = elegidos.flatMap((s) => {
    const f = comp.filas.find((x) => x.plan.slug === s)
    if (!f) return []
    return [{
      slug: s,
      codigo: codigo(f.plan.nombre),
      copago: f.plan.copago,
      sanatorios: f.sanatorios,
      cartilla: f.cartillaLabel,
      globos: (globos.get(s) ?? []).slice(0, 3),
      incluye: f.incluye.slice(0, 4).map((c) => (c.detalle ? `${c.nombre} · ${c.detalle}` : c.nombre)),
      descripcion: f.plan.descripcion,
      precio30: (() => { const v = escalaPorEdad(slug, s, 'caba')?.rangos.find((r) => r.desde <= 30 && 30 <= r.hasta)?.precio; return v ? formatPrecio(v) : null })(),
      href: `/prepagas/${slug}/${s}`,
    }]
  })
  if (planes.length < 2) return null
  return { prepaga: { slug: prep.slug, nombre: prep.nombre, colorPrimario: prep.colorPrimario }, planes }
}
