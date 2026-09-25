import datos from './monotributo.json'
import { entidadesRegistro, nombreLegible, type EntidadRegistro } from './registro-sssalud'

// Monotributo y obra social (24-sep-2026). Lo baja la Action "Monotributo
// (datos oficiales)" (scripts/monotributo/bajar.py) el día 5 de cada mes:
// - ARCA: cuadro de categorías con el aporte de obra social de cada una.
// - SSSalud: agentes del seguro que aceptan monotributistas (44 al 24-sep).
// Los nombres y teléfonos salen del registro (lib/data/registro-sssalud.json)
// cruzando por código: la web de la SSSalud corta las palabras
// ("PROFESIONALE S") y no trae teléfonos en ese listado.

export const MONOTRIBUTO_GENERADO: string = datos.generado
export const FUENTE_CATEGORIAS: string = datos.categorias.fuente
export const FUENTE_OS_MONOTRIBUTO: string = datos.fuenteObrasSociales

const pesos = (s: string) => Number(s.replace(/[^\d,]/g, '').replace(',', '.'))

export interface CategoriaMonotributo {
  letra: string
  /** Tope de ingresos brutos anuales */
  ingresosHasta: number
  /** Aporte mensual a la obra social del titular (cada adherente paga lo mismo) */
  obraSocial: number
  sipa: number
  /** Cuota mensual total: servicios / venta de cosas muebles */
  totalServicios: number
  totalVenta: number
}

// Columnas del cuadro de ARCA: Categ., Ingresos brutos, Sup., Energía,
// Alquileres, Precio unitario máx., Impuesto integrado (servicios, venta),
// SIPA, Obra social, Total (servicios, venta).
export const CATEGORIAS_MONOTRIBUTO: CategoriaMonotributo[] = datos.categorias.filas.map((f) => ({
  letra: f[0],
  ingresosHasta: pesos(f[1]),
  sipa: pesos(f[8]),
  obraSocial: pesos(f[9]),
  totalServicios: pesos(f[10]),
  totalVenta: pesos(f[11]),
}))

/** "Valores de aplicación desde el 1/08/2026" → "1/08/2026" */
export const VIGENCIA_CATEGORIAS: string | null =
  datos.categorias.vigencias.map((v) => v.match(/aplicaci[oó]n desde el (\d{1,2}\/\d{1,2}\/\d{4})/)?.[1]).find(Boolean) ?? null

export const APORTE_OS_MINIMO = Math.min(...CATEGORIAS_MONOTRIBUTO.map((c) => c.obraSocial))
export const APORTE_OS_MAXIMO = Math.max(...CATEGORIAS_MONOTRIBUTO.map((c) => c.obraSocial))

export interface ObraSocialMonotributo {
  codigo: string
  nombre: string
  localidad: string
  telefono?: string
  habilitadaOpciones: boolean
  entidad?: EntidadRegistro
}

const titulo = (s: string) => s.toLowerCase().replace(/(^|\s)\S/g, (m) => m.toUpperCase())

export const OS_MONOTRIBUTO: ObraSocialMonotributo[] = datos.obrasSociales
  .map((o) => {
    const entidad = entidadesRegistro.find((e) => e.codigo === o.codigo)
    return {
      codigo: o.codigo,
      nombre: entidad ? nombreLegible(entidad.nombre) : o.nombre,
      localidad: entidad?.localidadSede ?? titulo(o.localidad),
      telefono: entidad?.telefono ?? (o.telefono || undefined),
      habilitadaOpciones: o.habilitadaOpciones !== false,
      entidad,
    }
  })
  .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

export const formatoPesos = (n: number) => `$${n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
