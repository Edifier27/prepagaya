// Solo del lado del servidor (la usa app/api/precios): no importar desde client components.
import tarifasJson from '@/lib/data/tarifas-oficiales.json'

// Motor de precios oficial (23-sep-2026, pedido de Darío: "un solo motor de
// precios"). Calcula el precio de lista de un plan para un grupo con la
// escala etaria PROPIA de cada prepaga — cada una declara sus rangos ante la
// SSSalud según su estrategia comercial (ej. OSDE deja de subir después de
// los 36; Swiss sube cada ~5 años) — en vez de la tabla genérica de
// multiplicadores que usaba el comparador.
//
// Fuente: lib/data/tarifas-oficiales.json (scripts/cuadros-sssalud/generar.py).
// Valores declarados SIN IVA: la modalidad directa (particular) lleva IVA
// 10,5%; el desregulado (derivando aportes) se devuelve tal cual declarado.
// Solo cubre los planes mapeados en generar.py; para el resto devuelve null
// y quien llama decide el fallback. Nunca inventa: si una zona no tiene
// región equivalente clara o una edad cae fuera de los rangos declarados,
// devuelve null.

type Banda = [desde: number, hasta: number, valor: number]
type TablaPlan = Record<string, { d?: Banda[]; r?: Banda[] }>

const DATOS = tarifasJson as unknown as {
  fuente: string
  iva: number
  periodoPorPrepaga: Record<string, number>
  tarifas: Record<string, Record<string, TablaPlan>>
}

export type Modalidad = 'directo' | 'desregulado'

// Zona del comparador (zonaKey de ComparadorWizard) → regiones candidatas de
// cada prepaga, en orden de preferencia. Solo lo que el nombre de la región
// declarada deja claro; 'otras' mezcla Patagonia con el norte, así que solo
// se mapea donde la prepaga tiene una región nacional única.
const INTERIOR = ['cordoba', 'santa-fe', 'mendoza', 'tucuman', 'entre-rios', 'salta', 'misiones', 'chaco', 'corrientes', 'jujuy']

function regionesDe(prepaga: string, zona: string): string[] {
  switch (prepaga) {
    case 'swiss-medical':
      if (zona === 'caba' || zona === 'buenos-aires') return ['AMBA']
      if (zona === 'buenos-aires-interior' || zona === 'santa-fe') return ['BsAs Interior - Santa Fe']
      if (zona === 'cordoba') return ['Cordoba']
      if (zona === 'salta' || zona === 'neuquen' || zona === 'rio-negro') return ['Patagonia - Salta']
      if (['mendoza', 'tucuman', 'entre-rios', 'misiones', 'chaco', 'corrientes', 'jujuy'].includes(zona)) return ['Interior pais']
      return []
    case 'osde':
      if (zona === 'caba' || zona === 'buenos-aires' || zona === 'buenos-aires-interior')
        return ['CABA, Provincia de Bs As y Ciudad de Viedma', 'Pais excepto region Patagonia']
      if (INTERIOR.includes(zona)) return ['Pais excepto Patagonia, Bs As y CABA', 'Pais excepto region Patagonia']
      return []
    case 'premedic': {
      const m: Record<string, string> = { caba: 'CAPITAL FEDERAL', 'buenos-aires': 'BUENOS AIRES', cordoba: 'CORDOBA', mendoza: 'MENDOZA', misiones: 'MISIONES', tucuman: 'TUCUMAN' }
      return m[zona] ? [m[zona]] : []
    }
    case 'medife': {
      const m: Record<string, string> = {
        caba: 'BUENOS AIRES', 'buenos-aires': 'BUENOS AIRES', 'buenos-aires-interior': 'BUENOS AIRES', cordoba: 'CORDOBA',
        'santa-fe': 'SANTA FE', mendoza: 'MENDOZA', tucuman: 'TUCUMAN', 'entre-rios': 'ENTRE RIOS', salta: 'SALTA',
        neuquen: 'NEUQUEN', misiones: 'MISIONES', chaco: 'CHACO', corrientes: 'CORRIENTES', 'rio-negro': 'RIO NEGRO', jujuy: 'JUJUY',
      }
      return m[zona] ? [`PROVINCIA DE ${m[zona]}`] : []
    }
    case 'galeno':
      return ['Pais']
    default:
      return []
  }
}

function valorParaEdad(bandas: Banda[] | undefined, edad: number): number | null {
  const b = bandas?.find(([desde, hasta]) => desde <= edad && edad <= hasta)
  return b ? b[2] : null
}

export interface PrecioGrupo {
  total: number
  porPersona: { edad: number; precio: number }[]
  region: string
  periodo: number
}

/** Precio de lista mensual de un plan para un grupo (edad de cada integrante). */
export function precioGrupo(
  prepaga: string,
  plan: string,
  edades: number[],
  zona: string,
  modalidad: Modalidad = 'directo',
): PrecioGrupo | null {
  const tabla = DATOS.tarifas[prepaga]?.[plan]
  if (!tabla || edades.length === 0) return null
  const clave = modalidad === 'directo' ? 'd' : 'r'
  const factor = modalidad === 'directo' ? DATOS.iva : 1
  for (const region of regionesDe(prepaga, zona)) {
    const bandas = tabla[region]?.[clave]
    if (!bandas) continue
    const porPersona: { edad: number; precio: number }[] = []
    for (const edad of edades) {
      const v = valorParaEdad(bandas, edad)
      if (v === null) return null // edad fuera de los rangos declarados: sin dato
      porPersona.push({ edad, precio: Math.round(v * factor) })
    }
    return { total: porPersona.reduce((s, p) => s + p.precio, 0), porPersona, region, periodo: DATOS.periodoPorPrepaga[prepaga] }
  }
  return null
}

/** Todos los planes con precio oficial para ese grupo y zona: { "prepaga/plan": total }. */
export function preciosParaGrupo(edades: number[], zona: string, modalidad: Modalidad = 'directo'): Record<string, number> {
  const out: Record<string, number> = {}
  for (const [prepaga, planes] of Object.entries(DATOS.tarifas)) {
    for (const plan of Object.keys(planes)) {
      const r = precioGrupo(prepaga, plan, edades, zona, modalidad)
      if (r) out[`${prepaga}/${plan}`] = r.total
    }
  }
  return out
}

export const FUENTE_PRECIOS = DATOS.fuente
