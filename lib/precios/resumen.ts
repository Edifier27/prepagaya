// Montos de mercado sacados de los cuadros oficiales (Darío, 28-oct-2026):
// reemplazan los "desde $105.000" o "entre $350.000 y $1.500.000" escritos a
// mano en textos y FAQs, que quedaban viejos con cada aumento.
import { prepagas } from '@/lib/data/prepagas'
import { escalaPorEdad } from '@/lib/precios/motor'

export interface PrecioPlan { prepaga: string; plan: string; precio: number }

/** Planes con precio de lista a los 30 años (los "A cotizar" quedan afuera) */
function planesA30(): PrecioPlan[] {
  return prepagas.flatMap((p) => p.planes
    .filter((pl) => Number.isFinite(pl.precio))
    .map((pl) => ({ prepaga: p.nombre, plan: pl.nombre, precio: pl.precio })))
    .sort((a, b) => a.precio - b.precio)
}

/** El plan más barato y el más caro del mercado para una persona de 30 años */
export function extremosA30(): { min: PrecioPlan; max: PrecioPlan } {
  const lista = planesA30()
  return { min: lista[0], max: lista[lista.length - 1] }
}

/**
 * Precio de cada plan con cuadro oficial a una edad (CABA/AMBA, contratación
 * directa, IVA incluido), y cuántas veces el de los 30 años.
 */
export function preciosAEdad(edad: number): (PrecioPlan & { veces: number })[] {
  const enBanda = (rangos: { desde: number; hasta: number; precio: number }[], e: number) =>
    rangos.find((r) => r.desde <= e && e <= r.hasta)?.precio
  return prepagas.flatMap((p) => p.planes.flatMap((pl) => {
    const esc = escalaPorEdad(p.slug, pl.slug, 'caba')
    const precio = esc && enBanda(esc.rangos, edad)
    const a30 = esc && enBanda(esc.rangos, 30)
    return precio && a30 ? [{ prepaga: p.nombre, plan: pl.nombre, precio, veces: precio / a30 }] : []
  })).sort((a, b) => a.precio - b.precio)
}

/** Rango de precio y de "veces el precio de los 30" a una edad */
export function rangoAEdad(edad: number) {
  const lista = preciosAEdad(edad)
  const veces = lista.map((x) => x.veces)
  return {
    min: lista[0],
    max: lista[lista.length - 1],
    vecesMin: Math.min(...veces),
    vecesMax: Math.max(...veces),
    planes: lista.length,
  }
}
