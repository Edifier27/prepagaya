import { preciosParaGrupo } from '@/lib/precios/motor'
import { prepagasCotizables } from '@/lib/data/planes-cotizables'
import { PROVINCIAS } from '@/lib/data/provincias-cotizador'
import { PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { APORTE_DERIVABLE, SITE_NAME } from '@/lib/utils'

// Informe para prensa (25-sep-2026): cuánto hay que ganar para que los
// aportes de obra social paguen la prepaga completa, sin diferencia. Sale de
// los cuadros oficiales "con aportes" que cada prepaga declara ante la
// SSSalud (motor de precios) y del 7,5% del sueldo bruto que llega a la
// prepaga: se recalcula solo cada mes. Una versión para el AMBA y una por
// provincia con cuadro regional propio (para la prensa de cada provincia).

export interface PerfilSueldo { id: string; titulo: string; corto: string; edades: number[] }
export const PERFILES: PerfilSueldo[] = [
  { id: 's30', titulo: 'Soltero/a de 30 años', corto: '30 años', edades: [30] },
  { id: 's45', titulo: 'Soltero/a de 45 años', corto: '45 años', edades: [45] },
  { id: 'fam', titulo: 'Familia de 4 (40 y 38 años, hijos de 10 y 7), con dos sueldos', corto: 'Familia de 4', edades: [40, 38, 10, 7] },
]

export interface FilaSueldo { prepaga: string; plan: string; sueldo: Record<string, number> }

/** Sueldo bruto para el plan de entrada de cada prepaga en esa zona del motor, de menor a mayor a los 30 años. */
export function calcularSueldos(zona: string): FilaSueldo[] {
  const precios = Object.fromEntries(PERFILES.map((p) => [p.id, preciosParaGrupo(p.edades, zona, 'desregulado')]))
  const filas: FilaSueldo[] = []
  for (const pr of prepagasCotizables()) {
    // Plan de entrada: el más barato con cuadro "con aportes" para una persona de 30
    const entrada = pr.planes
      .map((pl) => ({ pl, v: precios.s30[`${pr.slug}/${pl.slug}`] ?? 0 }))
      .filter((x) => x.v > 0)
      .sort((a, b) => a.v - b.v)[0]?.pl
    if (!entrada) continue
    const sueldo: Record<string, number> = {}
    for (const p of PERFILES) {
      const v = precios[p.id][`${pr.slug}/${entrada.slug}`]
      if (v > 0) sueldo[p.id] = v / APORTE_DERIVABLE
    }
    if (Object.keys(sueldo).length === PERFILES.length) filas.push({ prepaga: pr.nombre, plan: entrada.nombre, sueldo })
  }
  return filas.sort((a, b) => a.sueldo.s30 - b.sueldo.s30)
}

export const millones = (n: number) => `$${(n / 1e6).toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} M`
export const millonesLargo = (n: number) => `$${(n / 1e6).toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} millones`
export const MES = PRECIO_ACTUALIZADO.toLowerCase()

// Para la cita: las prepagas grandes (el tope de la tabla puede ser un plan
// particular de una prepaga chica y distorsiona la cita).
const GRANDES = ['Swiss Medical', 'OSDE', 'Galeno', 'Medife', 'Medifé']

export function resumenSueldos(filas: FilaSueldo[]) {
  const grandes = filas.filter((f) => GRANDES.includes(f.prepaga))
  return {
    min30: filas[0],
    g30: [...grandes].sort((a, b) => a.sueldo.s30 - b.sueldo.s30),
    gFam: [...grandes].sort((a, b) => a.sueldo.fam - b.sueldo.fam),
    famMin: [...filas].sort((a, b) => a.sueldo.fam - b.sueldo.fam)[0],
    osde: filas.find((f) => f.prepaga === 'OSDE'),
    swiss: filas.find((f) => f.prepaga === 'Swiss Medical'),
  }
}

/** Titular y párrafo para citar. `lugar`: "en el AMBA", "en Córdoba"… */
export function textosInforme(filas: FilaSueldo[], lugar: string) {
  const { min30, g30, gFam, famMin } = resumenSueldos(filas)
  const titular = min30
    ? `Para que los aportes paguen la prepaga completa ${lugar}, una persona de 30 años necesita ganar desde ${millonesLargo(min30.sueldo.s30)} brutos por mes`
    : 'Cuánto hay que ganar para que los aportes paguen la prepaga'
  const cita = min30 && g30.length > 1 && gFam.length > 1
    ? `Según un relevamiento de ${SITE_NAME} sobre los cuadros tarifarios oficiales "con aportes" de ${MES}, para que los aportes de obra social cubran el plan de entrada de una prepaga sin pagar diferencia, una persona de 30 años ${lugar} necesita un sueldo bruto desde ${millonesLargo(min30.sueldo.s30)} (${min30.prepaga}); en las prepagas más grandes, entre ${millonesLargo(g30[0].sueldo.s30)} (${g30[0].prepaga}) y ${millonesLargo(g30[g30.length - 1].sueldo.s30)} (${g30[g30.length - 1].prepaga}). Una familia de cuatro con dos sueldos necesita, entre los dos, desde ${millonesLargo(famMin.sueldo.fam)}, y entre ${millonesLargo(gFam[0].sueldo.fam)} y ${millonesLargo(gFam[gFam.length - 1].sueldo.fam)} en las más grandes.`
    : ''
  return { titular, cita }
}

export interface InformeProvincia { slug: string; nombre: string; zonaKey: string; lugar: string; filas: FilaSueldo[] }

// Provincias con cuadro regional propio en el motor. CABA y GBA van en el
// informe del AMBA; las 'otras' no tienen cuadro regional en la mayoría de
// las prepagas. Hacen falta al menos 4 prepagas con precio para publicar.
export const INFORMES_PROVINCIA: InformeProvincia[] = PROVINCIAS
  .filter((p) => p.zonaKey !== 'otras' && p.slug !== 'caba' && p.slug !== 'buenos-aires')
  .map((p) => ({
    slug: p.slug,
    nombre: p.nombre,
    zonaKey: p.zonaKey,
    lugar: p.slug === 'buenos-aires-interior' ? 'en el interior de Buenos Aires' : `en ${p.nombre}`,
    filas: calcularSueldos(p.zonaKey),
  }))
  .filter((p) => p.filas.length >= 4)

export const informeProvincia = (slug: string) => INFORMES_PROVINCIA.find((p) => p.slug === slug)
