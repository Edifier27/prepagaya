import osdeData from './osde.json'
import premedicData from './premedic.json'
import avalianData from './avalian.json'
import swissData from './swiss-medical.json'
import sancorData from './sancor-salud.json'
import { detectarZona, type ZonaDetectada } from '@/lib/geo-zonas'
import {
  nombreCortoZona,
  normalizarTexto,
  slugPlan,
  zonaParaUbicacion,
  type PlanCartilla,
  type SeccionCartilla,
  type ZonaCartillaIndice,
} from '@/lib/cartilla-zonas-geo'

// Cartilla por zona de OSDE, Premedic, Avalian, Swiss Medical y Sancor Salud — SOLO instituciones
// (sanatorios para internación y guardias/urgencias). Nada cargado a mano:
// cada JSON sale de la fuente oficial de la prepaga con los scripts de
// scripts/cartilla-{osde,premedic,avalian}/ (ver cada README/docstring).
// A propósito NO se incluyen médicos particulares — decisión de Darío, 22-sep-2026.

export interface SedeCartilla {
  direccion: string | null
  localidad: string | null
  tel: string | null
  servicios: SeccionCartilla[]
}

export interface CentroCartilla {
  nombre: string
  /** Planes con los que el centro figura para internación */
  internacion: string[]
  /** Planes con los que el centro figura con guardia / urgencias */
  guardia: string[]
  /** Asterisco de la cartilla de OSDE (ver leyenda en CentrosLista) */
  marca: 'mixto' | 'cuerpo-propio' | 'solo-cartilla' | null
  notas: string[]
  /** Premedic: prestaciones puntuales (ej. "Urgencias pediátricas") */
  servicios?: string[]
  sedes: SedeCartilla[]
}

export interface ZonaCartilla {
  slug: string
  nombre: string
  /** Solo OSDE: filial a la que pertenece la zona */
  filial?: string
  provincias: string[]
  centros: CentroCartilla[]
}

interface CartillaJson {
  fuente: string
  vigencia: string[]
  planes: string[]
  zonas: ZonaCartilla[]
}

export interface CartillaPrepaga {
  prepagaSlug: string
  prepagaNombre: string
  fuente: string
  /** Link a la cartilla oficial (para "confirmalo en la fuente") */
  fuenteUrl: string
  /** Fecha de la fuente: vigencia del PDF (OSDE) o fecha de consulta del buscador oficial */
  vigencia: string
  /** 'vigencia' = fecha impresa en la cartilla oficial; 'consulta' = fecha en que se consultó el buscador oficial */
  tipoFecha: 'vigencia' | 'consulta'
  planes: PlanCartilla[]
  /** Planes que tienen página propia (/cartillas/[prepaga]/plan-xxx) */
  planesConPagina: string[]
  /** Planes "en escalera" de menor a mayor cobertura, para sugerir el plan superior que suma un sanatorio */
  escalera: string[]
  /** Texto de la sección guardia en esta prepaga */
  labelGuardia: string
  zonas: ZonaCartilla[]
}

// Zonas que se indexan aunque tengan 1 solo centro: aparecen en el
// autocompletado de Google Argentina ("cartilla osde villa la angostura",
// relevado el 22-sep-2026) — el resto de las de 1 centro va con noindex.
const INDEXAR_SIEMPRE: Record<string, string[]> = {
  osde: ['villa-la-angostura'],
}

// OSDE y Avalian parten el sur del GBA en Sudeste y Sudoeste, pero la gente
// busca "zona sur" ("cartilla osde zona sur", "avalian cartilla zona sur"):
// se arma la unión como zona propia y las dos partes quedan navegables pero
// sin indexar, para no canibalizar.
const ZONAS_AGREGADAS: Record<string, { slug: string; nombre: string; partes: string[] }[]> = {
  osde: [{ slug: 'gba-zona-sur', nombre: 'GBA Zona Sur', partes: ['gba-zona-sudeste', 'gba-zona-sudoeste'] }],
  avalian: [{ slug: 'gba-zona-sur', nombre: 'GBA Zona Sur', partes: ['gba-zona-sudeste', 'gba-zona-sudoeste'] }],
}

function unirZonas(slug: string, nombre: string, partes: ZonaCartilla[]): ZonaCartilla {
  const centros = new Map<string, CentroCartilla>()
  for (const p of partes) {
    for (const c of p.centros) {
      const k = normalizarTexto(c.nombre)
      const previo = centros.get(k)
      if (!previo) {
        centros.set(k, { ...c, internacion: [...c.internacion], guardia: [...c.guardia], notas: [...c.notas], sedes: [...c.sedes] })
        continue
      }
      for (const pl of c.internacion) if (!previo.internacion.includes(pl)) previo.internacion.push(pl)
      for (const pl of c.guardia) if (!previo.guardia.includes(pl)) previo.guardia.push(pl)
      for (const n of c.notas) if (!previo.notas.includes(n)) previo.notas.push(n)
      for (const s of c.sedes) if (!previo.sedes.some((x) => x.direccion === s.direccion)) previo.sedes.push(s)
    }
  }
  return {
    slug,
    nombre,
    filial: partes[0]?.filial,
    provincias: partes[0]?.provincias ?? [],
    centros: [...centros.values()].sort((a, b) => Number(!a.internacion.length) - Number(!b.internacion.length) || a.nombre.localeCompare(b.nombre, 'es')),
  }
}

function armar(
  base: Omit<CartillaPrepaga, 'zonas' | 'vigencia' | 'fuente'>,
  json: CartillaJson,
): CartillaPrepaga {
  const zonas = [...json.zonas]
  for (const ag of ZONAS_AGREGADAS[base.prepagaSlug] ?? []) {
    const partes = ag.partes.map((s) => zonas.find((z) => z.slug === s)).filter((z): z is ZonaCartilla => Boolean(z))
    if (partes.length > 0 && !zonas.some((z) => z.slug === ag.slug)) zonas.push(unirZonas(ag.slug, ag.nombre, partes))
  }
  // Ordenar los planes de cada centro según el orden oficial de la prepaga
  const orden = base.planes.map((p) => p.id)
  for (const z of zonas) {
    for (const c of z.centros) {
      c.internacion.sort((a, b) => orden.indexOf(a) - orden.indexOf(b))
      c.guardia.sort((a, b) => orden.indexOf(a) - orden.indexOf(b))
    }
  }
  return { ...base, fuente: json.fuente, vigencia: json.vigencia[json.vigencia.length - 1] ?? '', zonas }
}

export const CARTILLAS: Record<string, CartillaPrepaga> = {
  osde: armar(
    {
      prepagaSlug: 'osde',
      prepagaNombre: 'OSDE',
      fuenteUrl: 'https://www.osde.com.ar/cartilla-inteligente/home',
      tipoFecha: 'vigencia',
      planes: [
        { id: '210', label: 'Plan 210', comparadorSlug: '210' },
        { id: '310', label: 'Plan 310', comparadorSlug: '310' },
        { id: '410', label: 'Plan 410', comparadorSlug: '410' },
        { id: '450', label: 'Plan 450' },
        { id: '510', label: 'Plan 510', comparadorSlug: '510' },
        { id: 'Flux', label: 'Plan Flux', comparadorSlug: 'flux' },
      ],
      planesConPagina: ['210', '310', '410', '450', '510', 'Flux'],
      escalera: ['210', '310', '410', '450', '510'],
      labelGuardia: 'Guardias 24 hs',
    },
    osdeData as CartillaJson,
  ),
  premedic: armar(
    {
      prepagaSlug: 'premedic',
      prepagaNombre: 'Premedic',
      fuenteUrl: 'https://web.grupopremedic.com.ar/cartilla-medica',
      tipoFecha: 'consulta',
      planes: [
        { id: 'C-100', label: 'Plan C-100' },
        { id: '200', label: 'Plan 200', comparadorSlug: 'plan-200' },
        { id: '300', label: 'Plan 300', comparadorSlug: 'plan-300' },
        { id: '400', label: 'Plan 400', comparadorSlug: 'plan-400' },
        { id: '500', label: 'Plan 500' },
        { id: 'Por aportes', label: 'Plan por aportes' },
        { id: '0-50', label: 'Plan 0-50' },
        { id: 'AMBA', label: 'Plan AMBA' },
        { id: 'Básico', label: 'Plan Básico' },
        { id: 'Bronce', label: 'Plan Bronce' },
        { id: 'Plata', label: 'Plan Plata' },
        { id: 'Simple', label: 'Plan Simple' },
      ],
      planesConPagina: ['C-100', '200', '300', '400', '500', 'Por aportes'],
      escalera: ['C-100', '200', '300', '400', '500'],
      labelGuardia: 'Urgencias',
    },
    premedicData as CartillaJson,
  ),
  avalian: armar(
    {
      prepagaSlug: 'avalian',
      prepagaNombre: 'Avalian',
      fuenteUrl: 'https://avalian.com/cartilla',
      tipoFecha: 'consulta',
      // Nombres y códigos AS tal cual los publica Avalian (avalian.com/planes
      // y el endpoint público de copagos de su cotizador).
      planes: [
        { id: 'Cerca', label: 'Cerca (AS100)', comparadorSlug: 'as100' },
        { id: 'Integral', label: 'Integral (AS200/AS204)', comparadorSlug: 'as200', otrosComparadorSlugs: ['as204', 'as200h'] },
        { id: 'Superior', label: 'Superior (AS300)', comparadorSlug: 'as300' },
        { id: 'Selecta', label: 'Selecta (AS400/AS500)', comparadorSlug: 'as400', otrosComparadorSlugs: ['as500'] },
        { id: 'Clásica', label: 'Clásica' },
      ],
      planesConPagina: ['Cerca', 'Integral', 'Superior', 'Selecta'],
      escalera: ['Cerca', 'Integral', 'Superior', 'Selecta'],
      labelGuardia: 'Guardias',
    },
    avalianData as CartillaJson,
  ),
  'swiss-medical': armar(
    {
      prepagaSlug: 'swiss-medical',
      prepagaNombre: 'Swiss Medical',
      fuenteUrl: 'https://www.swissmedical.com.ar/prepagaclientes/cartilla',
      tipoFecha: 'consulta',
      // Cada id es una cartilla del buscador oficial; qué planes usan cada
      // una sale de la lista de planes del propio buscador (NU2/NU3/CL1/CLE/CLS).
      // Los planes Sport no figuran en esa lista: no se asignan a ninguna.
      planes: [
        { id: 'SMG01', label: 'SMG01 (Nubial Clásica)' },
        { id: 'SMG02', label: 'SMG02 y S1 (Nubial Quality)', comparadorSlug: 'smg02', otrosComparadorSlugs: ['s1'] },
        { id: 'SMG10', label: 'SMG10 (Advance)' },
        { id: 'SMG20', label: 'SMG20 y S2 (Global)', comparadorSlug: 'smg20', otrosComparadorSlugs: ['s2'] },
        { id: 'SMG30', label: 'SMG30 a SMG70 (Premium)', comparadorSlug: 'smg30', otrosComparadorSlugs: ['smg40', 'smg50', 'smg60', 'smg70'] },
      ],
      planesConPagina: ['SMG02', 'SMG20', 'SMG30'],
      escalera: ['SMG01', 'SMG02', 'SMG10', 'SMG20', 'SMG30'],
      labelGuardia: 'Guardias',
    },
    swissData as CartillaJson,
  ),
  'sancor-salud': armar(
    {
      prepagaSlug: 'sancor-salud',
      prepagaNombre: 'Sancor Salud',
      fuenteUrl: 'https://sancorsalud.com.ar/cartilla-nosoyasociado',
      tipoFecha: 'consulta',
      // Nombres tal cual el índice de planes del buscador oficial (código
      // interno S3000 = "Sancor 3500", G3000 = "Sancor 3000").
      planes: [
        { id: 'F700', label: 'Plan F700', comparadorSlug: 'f700' },
        { id: 'F800', label: 'Plan F800', comparadorSlug: 'f800' },
        { id: '1000', label: 'Plan 1000', comparadorSlug: 'plan-1000' },
        { id: '1500', label: 'Plan 1500', comparadorSlug: 'plan-1500' },
        { id: '3000', label: 'Plan 3000', comparadorSlug: 'plan-3000' },
        { id: '3500', label: 'Plan 3500', comparadorSlug: 'plan-3500' },
        { id: '4000', label: 'Plan 4000', comparadorSlug: 'plan-4000' },
        { id: '4500', label: 'Plan 4500', comparadorSlug: 'plan-4500' },
        { id: '5000', label: 'Plan 5000', comparadorSlug: 'plan-5000' },
        { id: '6000', label: 'Plan 6000', comparadorSlug: 'plan-6000' },
      ],
      planesConPagina: ['F700', 'F800', '1000', '1500', '3000', '3500', '4000', '4500', '5000', '6000'],
      escalera: ['F700', 'F800', '1000', '1500', '3000', '3500', '4000', '4500', '5000', '6000'],
      labelGuardia: 'Guardias',
    },
    sancorData as CartillaJson,
  ),
}

export function getCartilla(prepagaSlug: string): CartillaPrepaga | undefined {
  return CARTILLAS[prepagaSlug]
}

export function getZona(prepagaSlug: string, zonaSlug: string): ZonaCartilla | undefined {
  return CARTILLAS[prepagaSlug]?.zonas.find((z) => z.slug === zonaSlug)
}

export function getPlanPorSlug(prepagaSlug: string, planSlug: string): PlanCartilla | undefined {
  const c = CARTILLAS[prepagaSlug]
  return c?.planes.find((p) => slugPlan(p.id) === planSlug && c.planesConPagina.includes(p.id))
}

function provinciaSlug(nombre: string): string {
  const map: Record<string, string> = {
    'Ciudad de Buenos Aires': 'caba',
    'Buenos Aires': 'buenos-aires',
    'Santiago del Estero': 'santiago',
    'Tierra del Fuego': 'tierra-fuego',
  }
  return map[nombre] ?? normalizarTexto(nombre).replace(/ /g, '-')
}

export function centrosDePlan(z: ZonaCartilla, plan: string): CentroCartilla[] {
  return z.centros.filter((c) => c.internacion.includes(plan) || c.guardia.includes(plan))
}

export function indiceZonas(prepagaSlug: string): ZonaCartillaIndice[] {
  const c = CARTILLAS[prepagaSlug]
  if (!c) return []
  const partes = new Map<string, string>()
  for (const ag of ZONAS_AGREGADAS[prepagaSlug] ?? []) for (const p of ag.partes) partes.set(p, ag.slug)
  return c.zonas.map((z) => {
    const localidades = new Set<string>()
    for (const ce of z.centros) for (const s of ce.sedes) if (s.localidad) localidades.add(s.localidad)
    const planes = c.planes.map((p) => p.id).filter((p) => z.centros.some((ce) => ce.internacion.includes(p) || ce.guardia.includes(p)))
    return {
      slug: z.slug,
      nombre: z.nombre,
      provinciaSlugs: z.provincias.map(provinciaSlug),
      provinciaNombre: z.provincias.join(' / '),
      localidades: [...localidades],
      internacion: z.centros.filter((ce) => ce.internacion.length > 0).length,
      guardia: z.centros.filter((ce) => ce.guardia.length > 0).length,
      planes,
      indexable: !partes.has(z.slug) && (z.centros.length >= 2 || (INDEXAR_SIEMPRE[prepagaSlug] ?? []).includes(z.slug)),
      ...(partes.has(z.slug) ? { parte: partes.get(z.slug) } : {}),
    }
  })
}

/** Zonas agrupadas por provincia (CABA y Buenos Aires primero). Excluye las partes de zonas agregadas. */
export function zonasPorProvincia(prepagaSlug: string): { provincia: string; zonas: ZonaCartillaIndice[] }[] {
  const grupos = new Map<string, ZonaCartillaIndice[]>()
  for (const z of indiceZonas(prepagaSlug)) {
    if (z.parte) continue
    const lista = grupos.get(z.provinciaNombre) ?? []
    lista.push(z)
    grupos.set(z.provinciaNombre, lista)
  }
  const prioridad = (p: string) => (p === 'Ciudad de Buenos Aires' ? 0 : p === 'Buenos Aires' ? 1 : 2)
  const ordenZona = (z: ZonaCartillaIndice) => (z.slug.startsWith('gba-') ? 0 : 1)
  return [...grupos.entries()]
    .map(([provincia, zonas]) => ({
      provincia,
      zonas: zonas.sort((a, b) => ordenZona(a) - ordenZona(b) || a.nombre.localeCompare(b.nombre, 'es')),
    }))
    .sort((a, b) => prioridad(a.provincia) - prioridad(b.provincia) || a.provincia.localeCompare(b.provincia, 'es'))
}

/** Zonas "AMBA" (CABA + GBA), en el orden en que la gente las busca. */
export function zonasAmba(prepagaSlug: string): ZonaCartilla[] {
  const orden = ['caba', 'gba-zona-norte', 'gba-zona-oeste', 'gba-zona-sur', 'gba-zona-noroeste']
  const c = CARTILLAS[prepagaSlug]
  if (!c) return []
  return orden.map((s) => c.zonas.find((z) => z.slug === s)).filter((z): z is ZonaCartilla => Boolean(z))
}

/**
 * Páginas plan × zona que valen la pena: zona indexable, con al menos 3
 * centros para ese plan, y (si no es AMBA) solo si el plan NO cubre todo lo
 * de la zona — si lo cubre todo, la página sería un duplicado de la de la zona.
 */
const cacheCombinaciones = new Map<string, { plan: string; zona: string }[]>()
export function combinacionesPlanZona(prepagaSlug: string): { plan: string; zona: string }[] {
  const cache = cacheCombinaciones.get(prepagaSlug)
  if (cache) return cache
  const c = CARTILLAS[prepagaSlug]
  if (!c) return []
  const indice = new Map(indiceZonas(prepagaSlug).map((z) => [z.slug, z]))
  const amba = new Set(zonasAmba(prepagaSlug).map((z) => z.slug))
  const out: { plan: string; zona: string }[] = []
  for (const plan of c.planesConPagina) {
    for (const z of c.zonas) {
      if (!indice.get(z.slug)?.indexable) continue
      const n = centrosDePlan(z, plan).length
      if (n < 3) continue
      if (!amba.has(z.slug) && n === z.centros.length) continue
      out.push({ plan: slugPlan(plan), zona: z.slug })
    }
  }
  cacheCombinaciones.set(prepagaSlug, out)
  return out
}

export function tieneCombinacion(prepagaSlug: string, planSlug: string, zonaSlug: string): boolean {
  return combinacionesPlanZona(prepagaSlug).some((x) => x.plan === planSlug && x.zona === zonaSlug)
}

export function textoFecha(c: CartillaPrepaga): string {
  return c.tipoFecha === 'vigencia' ? `cartilla oficial vigente al ${c.vigencia}` : `buscador oficial consultado el ${c.vigencia}`
}

/**
 * Página del silo de cartillas que corresponde a una prepaga en una provincia
 * (y opcionalmente una localidad), para enlazar desde el silo SEO local
 * (/prepagas/[provincia]/[localidad]/[prepaga]). Usa el mismo cruce
 * geográfico que el buscador (zonaParaUbicacion). Sin match → la cabeza del
 * silo de esa prepaga; sin cartilla por zona → null.
 */
export function linkCartillaZona(
  prepagaSlug: string,
  provinciaSlug: string,
  provinciaNombre: string,
  localidad?: string,
): { href: string; zonaNombre: string | null } | null {
  if (!CARTILLAS[prepagaSlug]) return null
  const idx = indiceZonas(prepagaSlug)
  let zd: ZonaDetectada | null
  if (localidad && (provinciaSlug === 'caba' || provinciaSlug === 'buenos-aires')) {
    zd = detectarZona(provinciaSlug === 'caba' ? 'C' : 'B', localidad)
  } else if (localidad) {
    zd = { label: `${localidad} (${provinciaNombre})`, wizardSlug: provinciaSlug }
  } else {
    zd = { label: provinciaNombre, wizardSlug: provinciaSlug }
  }
  const slug = zonaParaUbicacion(idx, zd)
  const z = slug ? idx.find((x) => x.slug === slug) : undefined
  return z
    ? { href: `/cartillas/${prepagaSlug}/${z.slug}`, zonaNombre: nombreCortoZona(z.nombre) }
    : { href: `/cartillas/${prepagaSlug}`, zonaNombre: null }
}

/** Página del silo de cartillas para un plan del comparador (ej. osde/210 → /cartillas/osde/plan-210). */
export function linkCartillaPlan(prepagaSlug: string, planComparadorSlug: string): { href: string; label: string } | null {
  const c = CARTILLAS[prepagaSlug]
  if (!c) return null
  const p = c.planes.find((x) => x.comparadorSlug === planComparadorSlug || x.otrosComparadorSlugs?.includes(planComparadorSlug))
  if (!p || !c.planesConPagina.includes(p.id)) return null
  return { href: `/cartillas/${prepagaSlug}/${slugPlan(p.id)}`, label: p.label }
}

export { nombreCortoZona, slugPlan }
