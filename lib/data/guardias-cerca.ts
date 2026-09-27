import coordenadas from './cartilla-zonas/coordenadas.json'
import { CARTILLAS, textoFecha, type CartillaPrepaga } from './cartilla-zonas'
import { nucleoNombre } from './cartilla-zonas/cruce'
import { normalizarTexto } from '@/lib/cartilla-zonas-geo'
import { PRIORIDAD_PARTNERS } from '@/lib/utils'

// Datos de "¿Dónde me atiendo?" (/guardias-cerca, 27-sep-2026): cada lugar de
// atención de las cartillas oficiales (guardias y sanatorios de internación),
// con sus coordenadas y qué prepaga y plan lo cubre. Las coordenadas salen de
// Georef, el servicio oficial de direcciones del Estado
// (scripts/fuentes/geocodificar.py): "d" = ubicada por la dirección, "l" =
// no se encontró la dirección y quedó en el centro de su localidad
// (aproximada). Se sirve estático desde /api/guardias-cerca y el navegador
// calcula las distancias: la ubicación de la persona no sale de su teléfono.

/** [lat, lon, "d" | "l"] por "direccion|localidad|provincia" */
const COORDS = coordenadas as unknown as Record<string, [number, number, 'd' | 'l']>

/** [índice de prepaga, planes con guardia, planes con internación, notas y servicios] */
export type CoberturaLugar = [number, string[], string[], string]

/** [nombre, dirección, localidad, teléfono, lat, lon, aproximada (1) o no (0), cobertura por prepaga] */
export type LugarAtencion = [string, string, string, string, number, number, 0 | 1, CoberturaLugar[]]

/** [nombre, provincia, lat, lon]: localidades y zonas para elegir a mano */
export type PuntoZona = [string, string, number, number]

export interface PrepagaGuardias {
  slug: string
  nombre: string
  planes: { id: string; label: string }[]
  fecha: string
  fuenteUrl: string
}

export interface DatosGuardias {
  prepagas: PrepagaGuardias[]
  lugares: LugarAtencion[]
  zonas: PuntoZona[]
}

// Swiss Medical primero, después el resto de los socios y OSDE
const ORDEN = [...PRIORIDAD_PARTNERS, 'osde'].filter((s, i, a) => a.indexOf(s) === i && CARTILLAS[s])

function metros(a: [number, number], b: [number, number]): number {
  const r = Math.PI / 180
  const dLat = (b[0] - a[0]) * r
  const dLon = (b[1] - a[1]) * r
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLon / 2) ** 2
  return 6371000 * 2 * Math.asin(Math.sqrt(h))
}

function mismoNombre(a: string[], b: string[]): boolean {
  return a.length > 0 && b.length > 0 && (a.every((w) => b.includes(w)) || b.every((w) => a.includes(w)))
}

const limpiarNota = (n: string) => n.replace(/^\(|\)$/g, '').replace(/^"|"$/g, '').trim()

interface Armado {
  nombre: string
  nucleo: string[]
  dir: string
  loc: string
  tel: string
  lat: number
  lon: number
  aprox: boolean
  cob: Map<number, { g: Set<string>; i: Set<string>; extra: Set<string> }>
}

let cache: DatosGuardias | null = null

export function datosGuardias(): DatosGuardias {
  if (cache) return cache
  const armados: Armado[] = []
  // grilla de ~1 km para buscar el mismo lugar entre prepagas
  const grilla = new Map<string, Armado[]>()
  const celda = (lat: number, lon: number) => `${Math.round(lat * 100)}|${Math.round(lon * 100)}`
  const vecinos = (lat: number, lon: number) => {
    const out: Armado[] = []
    const la = Math.round(lat * 100)
    const lo = Math.round(lon * 100)
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) out.push(...(grilla.get(`${la + i}|${lo + j}`) ?? []))
    return out
  }
  const zonas = new Map<string, { nombre: string; prov: string; lat: number; lon: number; n: number }>()
  const sumarZona = (nombre: string, prov: string, lat: number, lon: number) => {
    const k = `${normalizarTexto(nombre)}|${prov}`
    const z = zonas.get(k) ?? { nombre, prov, lat: 0, lon: 0, n: 0 }
    z.lat += lat
    z.lon += lon
    z.n += 1
    zonas.set(k, z)
  }

  ORDEN.forEach((slug, pi) => {
    const cart = CARTILLAS[slug]
    for (const z of cart.zonas) {
      if (z.slug === 'gba-zona-sur' && cart.zonas.some((x) => x.slug === 'gba-zona-sudeste')) continue // unión de Sudeste y Sudoeste
      const prov = z.provincias[0] ?? ''
      for (const c of z.centros) {
        const nucleo = nucleoNombre(c.nombre)
        for (const s of c.sedes) {
          if (!s.direccion) continue
          const co = COORDS[`${s.direccion}|${s.localidad ?? ''}|${prov}`]
          if (!co) continue
          const [lat, lon, m] = co
          const aprox = m === 'l'
          const g = s.servicios.includes('guardia') ? c.guardia : []
          const i = s.servicios.includes('internacion') ? c.internacion : []
          if (!g.length && !i.length) continue
          if (!aprox) {
            sumarZona(z.nombre.replace(/\s+y alrededores$/i, ''), prov, lat, lon)
            if (s.localidad) sumarZona(s.localidad, prov, lat, lon)
          }
          const previo = vecinos(lat, lon).find((a) =>
            aprox || a.aprox
              ? a.lat === lat && a.lon === lon && mismoNombre(a.nucleo, nucleo)
              : metros([a.lat, a.lon], [lat, lon]) < 150 && (mismoNombre(a.nucleo, nucleo) || metros([a.lat, a.lon], [lat, lon]) < 25),
          )
          const destino = previo ?? {
            nombre: c.nombre,
            nucleo,
            dir: s.direccion,
            loc: s.localidad ?? '',
            tel: s.tel ?? '',
            lat,
            lon,
            aprox,
            cob: new Map(),
          }
          if (!previo) {
            armados.push(destino)
            const k = celda(lat, lon)
            grilla.set(k, [...(grilla.get(k) ?? []), destino])
          }
          if (!destino.tel && s.tel) destino.tel = s.tel
          const cob = destino.cob.get(pi) ?? { g: new Set<string>(), i: new Set<string>(), extra: new Set<string>() }
          g.forEach((x) => cob.g.add(x))
          i.forEach((x) => cob.i.add(x))
          for (const n of c.notas) cob.extra.add(limpiarNota(n))
          for (const sv of c.servicios ?? []) if (/guardia|urgencia/i.test(sv) && !/^(guardia|urgencias)$/i.test(sv)) cob.extra.add(sv)
          destino.cob.set(pi, cob)
        }
      }
    }
  })

  const orden = (cart: CartillaPrepaga, planes: Set<string>) => cart.planes.map((p) => p.id).filter((id) => planes.has(id))
  const lugares: LugarAtencion[] = armados.map((a) => [
    a.nombre,
    a.dir,
    a.loc,
    a.tel,
    a.lat,
    a.lon,
    a.aprox ? 1 : 0,
    [...a.cob.entries()]
      .sort((x, y) => x[0] - y[0])
      .map(([pi, c]) => [pi, orden(CARTILLAS[ORDEN[pi]], c.g), orden(CARTILLAS[ORDEN[pi]], c.i), [...c.extra].filter(Boolean).slice(0, 4).join(' · ')] as CoberturaLugar),
  ])

  cache = {
    prepagas: ORDEN.map((slug) => {
      const c = CARTILLAS[slug]
      return { slug, nombre: c.prepagaNombre, planes: c.planes.map((p) => ({ id: p.id, label: p.label })), fecha: textoFecha(c), fuenteUrl: c.fuenteUrl }
    }),
    lugares,
    zonas: [...zonas.values()]
      .map((z) => [z.nombre, z.prov, Math.round((z.lat / z.n) * 1e5) / 1e5, Math.round((z.lon / z.n) * 1e5) / 1e5] as PuntoZona)
      .sort((a, b) => a[0].localeCompare(b[0], 'es')),
  }
  return cache
}

/** Sedes con internación de cada prepaga a menos de `km` de un punto, sumando
 *  todos los planes (para comparar cartillas cerca del centro de una ciudad) */
export function internacionCerca(lat: number, lon: number, km: number): Record<string, number> {
  const d = datosGuardias()
  return Object.fromEntries(
    d.prepagas.map((p, pi) => [
      p.slug,
      d.lugares.filter((l) => l[7].some((c) => c[0] === pi && c[2].length > 0) && metros([lat, lon], [l[4], l[5]]) <= km * 1000).length,
    ]),
  )
}

/** Cuántos lugares con guardia tiene cada prepaga (para el texto de la página) */
export function resumenGuardias(): { slug: string; nombre: string; guardias: number; internacion: number }[] {
  const d = datosGuardias()
  return d.prepagas.map((p, pi) => ({
    slug: p.slug,
    nombre: p.nombre,
    guardias: d.lugares.filter((l) => l[7].some((c) => c[0] === pi && c[1].length > 0)).length,
    internacion: d.lugares.filter((l) => l[7].some((c) => c[0] === pi && c[2].length > 0)).length,
  }))
}
