// Cotizador v2 (prueba 50/50 contra el actual, Darío 24-oct-2026). Maqueta y
// reglas acordadas: docs/producto/cotizador-v2.html. Sirve en servidor y en el
// navegador: sin imports de servidor.

export type Condicion = 'particular' | 'monotributo' | 'recibo'
export type GrupoPlan = 'swiss' | 'sancor' | 'premedic' | 'osde'
export type Region = 'amba' | 'interior'

export interface ZonaV2 {
  id: string
  nombre: string
  /** zonaKey del motor de precios (lib/precios/motor.ts) */
  zonaKey: string
  region: Region
  /** Zona de la cartilla (lib/data/cartilla-zonas) para los sanatorios de la tarjeta */
  cartilla?: string
  /** Zona de OSDE en su cartilla, cuando el slug es distinto */
  cartillaOsde?: string
}

export const ZONAS_V2: ZonaV2[] = [
  { id: 'caba', nombre: 'CABA', zonaKey: 'caba', region: 'amba', cartilla: 'caba' },
  { id: 'gba-norte', nombre: 'GBA Norte', zonaKey: 'buenos-aires', region: 'amba', cartilla: 'gba-zona-norte' },
  { id: 'gba-oeste', nombre: 'GBA Oeste', zonaKey: 'buenos-aires', region: 'amba', cartilla: 'gba-zona-oeste' },
  { id: 'gba-sur', nombre: 'GBA Sur', zonaKey: 'buenos-aires', region: 'amba', cartilla: 'gba-zona-sur' },
  { id: 'buenos-aires-interior', nombre: 'Interior de Buenos Aires', zonaKey: 'buenos-aires-interior', region: 'interior' },
  { id: 'cordoba', nombre: 'Córdoba', zonaKey: 'cordoba', region: 'interior', cartilla: 'cordoba', cartillaOsde: 'cordoba-capital' },
  { id: 'santa-fe', nombre: 'Santa Fe', zonaKey: 'santa-fe', region: 'interior', cartilla: 'santa-fe', cartillaOsde: 'ciudad-de-santa-fe' },
  { id: 'mendoza', nombre: 'Mendoza', zonaKey: 'mendoza', region: 'interior', cartilla: 'mendoza', cartillaOsde: 'ciudad-de-mendoza' },
  { id: 'tucuman', nombre: 'Tucumán', zonaKey: 'tucuman', region: 'interior' },
  { id: 'entre-rios', nombre: 'Entre Ríos', zonaKey: 'entre-rios', region: 'interior' },
  { id: 'salta', nombre: 'Salta', zonaKey: 'salta', region: 'interior', cartilla: 'salta', cartillaOsde: 'salta-capital' },
  { id: 'neuquen', nombre: 'Neuquén', zonaKey: 'neuquen', region: 'interior', cartilla: 'neuquen', cartillaOsde: 'ciudad-de-neuquen' },
  { id: 'misiones', nombre: 'Misiones', zonaKey: 'misiones', region: 'interior' },
  { id: 'chaco', nombre: 'Chaco', zonaKey: 'chaco', region: 'interior' },
  { id: 'corrientes', nombre: 'Corrientes', zonaKey: 'corrientes', region: 'interior' },
  { id: 'rio-negro', nombre: 'Río Negro', zonaKey: 'rio-negro', region: 'interior' },
  { id: 'jujuy', nombre: 'Jujuy', zonaKey: 'jujuy', region: 'interior' },
  { id: 'otra', nombre: 'Otra provincia', zonaKey: 'otras', region: 'interior' },
]

/** Zona del cotizador a partir de la cookie de geolocalización (lib/geo-zonas). */
export function zonaDesdeGeo(geo: { wizardSlug: string; label: string } | null): ZonaV2 | null {
  if (!geo) return null
  if (geo.wizardSlug === 'buenos-aires') {
    if (geo.label.includes('Interior de Buenos Aires')) return ZONAS_V2.find((z) => z.id === 'buenos-aires-interior') ?? null
    if (geo.label.includes('GBA Norte')) return ZONAS_V2.find((z) => z.id === 'gba-norte') ?? null
    if (geo.label.includes('GBA Oeste')) return ZONAS_V2.find((z) => z.id === 'gba-oeste') ?? null
    if (geo.label.includes('GBA Sur')) return ZONAS_V2.find((z) => z.id === 'gba-sur') ?? null
    return null // GBA sin subzona: que elija (cambia la cartilla)
  }
  return ZONAS_V2.find((z) => z.id === geo.wizardSlug) ?? null
}

export interface PlanV2 {
  /** "prepaga/plan" como en el motor de precios */
  k: string
  marca: string
  nom: string
  puntos: string[]
  grupo: GrupoPlan
  /** Sello arriba de la tarjeta */
  sello?: string
  /** Frase entre la tarjeta anterior y esta ("¿Querés sin copago?…") */
  subir?: string
  /** Va en "Ver más planes" */
  mas?: boolean
}

// Orden acordado: Swiss primero, del plan con copago (el más económico) al
// superador sin copago; después 2 de Sancor intermedios y 1 de Premedic; en
// "Ver más", Premedic 400 y OSDE (sin descuento).
const OTROS: PlanV2[] = [
  { k: 'sancor-salud/plan-1000', marca: 'Sancor Salud', nom: 'Plan 1000', puntos: ['Plan intermedio de Sancor', 'Cartilla nacional'], grupo: 'sancor' },
  { k: 'sancor-salud/plan-1500', marca: 'Sancor Salud', nom: 'Plan 1500', puntos: ['Plan intermedio-alto de Sancor', 'Cartilla nacional'], grupo: 'sancor' },
  { k: 'premedic/plan-300', marca: 'Premedic', nom: 'Plan 300', puntos: ['Red propia de centros', 'Precio bajo'], grupo: 'premedic' },
  { k: 'premedic/plan-400', marca: 'Premedic', nom: 'Plan 400', puntos: ['Red propia de centros', 'Internación en habitación individual'], grupo: 'premedic', mas: true },
  { k: 'osde/210', marca: 'OSDE', nom: '210', puntos: ['Plan de entrada de OSDE'], grupo: 'osde', mas: true },
  { k: 'osde/310', marca: 'OSDE', nom: '310', puntos: ['Suma sanatorios y reintegros'], grupo: 'osde', mas: true },
]

export const PLANES_V2: Record<Region, PlanV2[]> = {
  amba: [
    { k: 'swiss-medical/s1', marca: 'Swiss Medical', nom: 'S1', puntos: ['Con copago en consultas y estudios', 'Cartilla cerrada de Swiss en AMBA', 'El más económico de Swiss'], grupo: 'swiss' },
    { k: 'swiss-medical/smg02', marca: 'Swiss Medical', nom: 'SMG02', puntos: ['Sin copago en consultas y estudios', 'Acceso ampliado a especialistas', 'Plan superador del S1'], grupo: 'swiss', sello: 'El que más eligen en tu zona', subir: '¿Querés sin copago? El SMG02 es el plan superador.' },
    { k: 'swiss-medical/smg20', marca: 'Swiss Medical', nom: 'SMG20', puntos: ['Sin copago', 'Suma sanatorios de primer nivel', 'Más reintegros'], grupo: 'swiss' },
    { k: 'swiss-medical/smg30', marca: 'Swiss Medical', nom: 'SMG30', puntos: ['Sin copago', 'Cartilla más amplia', 'Reintegros más altos'], grupo: 'swiss' },
    ...OTROS,
  ],
  interior: [
    { k: 'swiss-medical/s2', marca: 'Swiss Medical', nom: 'S2', puntos: ['Con copago en consultas y estudios', 'El más económico de Swiss en tu zona'], grupo: 'swiss' },
    { k: 'swiss-medical/smg20', marca: 'Swiss Medical', nom: 'SMG20', puntos: ['Sin copago', 'Plan superador del S2', 'Sanatorios de primer nivel'], grupo: 'swiss', sello: 'El que más eligen en tu zona', subir: '¿Querés sin copago? El SMG20 es el plan superador.' },
    { k: 'swiss-medical/smg30', marca: 'Swiss Medical', nom: 'SMG30', puntos: ['Sin copago', 'Cartilla más amplia', 'Reintegros más altos'], grupo: 'swiss' },
    ...OTROS,
  ],
}

export const TODOS_LOS_PLANES_V2 = [...new Set([...PLANES_V2.amba, ...PLANES_V2.interior].map((p) => p.k))]

/** Localidades de la cartilla (lib/data/cartilla-zonas) que el popup ofrece
 *  en cada zona, de la más poblada a la menos. Cada prepaga usa las que tiene
 *  cargadas (OSDE con sus propios slugs). */
export const CARTILLAS_ZONA_V2: Record<string, string[]> = {
  caba: ['caba'],
  'gba-norte': ['gba-zona-norte', 'gba-zona-noroeste'],
  'gba-oeste': ['gba-zona-oeste'],
  'gba-sur': ['gba-zona-sur', 'gba-zona-sudeste', 'gba-zona-sudoeste'],
  'buenos-aires-interior': ['la-plata', 'mar-del-plata', 'bahia-blanca', 'tandil', 'junin', 'pergamino', 'olavarria', 'san-nicolas-de-los-arroyos', 'necochea', 'azul', 'zarate', 'campana', 'lujan', 'tres-arroyos', 'chivilcoy'],
  cordoba: ['cordoba', 'cordoba-capital', 'rio-cuarto', 'villa-maria', 'villa-carlos-paz', 'san-francisco', 'alta-gracia'],
  'santa-fe': ['rosario', 'santa-fe', 'ciudad-de-santa-fe', 'rafaela', 'venado-tuerto', 'reconquista'],
  mendoza: ['mendoza', 'ciudad-de-mendoza', 'godoy-cruz', 'guaymallen', 'san-jose-de-guaymallen', 'lujan-de-cuyo', 'san-rafael'],
  tucuman: ['san-miguel-de-tucuman', 'tucuman'],
  'entre-rios': ['parana', 'concordia', 'concepcion-del-uruguay', 'gualeguaychu'],
  salta: ['salta', 'salta-capital'],
  neuquen: ['neuquen', 'ciudad-de-neuquen', 'zapala'],
  misiones: ['posadas', 'obera', 'misiones'],
  chaco: ['resistencia', 'presidencia-roque-saenz-pena'],
  corrientes: ['corrientes', 'corrientes-capital'],
  'rio-negro': ['san-carlos-de-bariloche', 'general-roca', 'cipolletti', 'viedma'],
  jujuy: ['san-salvador-de-jujuy'],
}

// Los sanatorios más conocidos primero (sin esto el orden es alfabético y
// arranca por clínicas chicas)
const CONOCIDOS = ['trinidad', 'mater dei', 'arcos', 'otamendi', 'suizo', 'italiano', 'brit', 'g[uü]emes', 'finochietto', 'agote', 'zabala',
  'favaloro', 'olivos', 'lomas', 'nordelta', 'san lucas', 'allende', 'reina fabiola', 'privado', 'sirio', 'bazterrica', 'cemic', 'santa isabel',
  'fleni', 'anchorena', 'colegiales', 'providencia', 'juncal', '\\bima\\b', 'espora'].map((x) => new RegExp(x, 'i'))
export const puestoSanatorio = (n: string) => { const i = CONOCIDOS.findIndex((r) => r.test(n)); return i < 0 ? 99 : i }
/** "Sanatorio los ARCOS - ASE" → "Sanatorio los Arcos" */
export const nombreProlijo = (n: string) => n.replace(/\b([A-ZÁÉÍÓÚÑ]{3,})\b/g, (w) => w[0] + w.slice(1).toLowerCase()).replace(/\s*-\s*ASE$/, '').replace(/^Clinica /, 'Clínica ')

/** Sanatorios de Swiss elegidos por Darío para GBA Sur y GBA Norte (24-oct-2026). */
export const SANATORIOS_SWISS_FIJOS: Record<string, string[]> = {
  'gba-sur': ['Juncal', 'IMA', 'Espora'],
  'gba-norte': ['Las Lomas', 'Trinidad', 'Clínica Olivos'],
}

/** Línea de centros propios de Swiss según la zona. */
export function centrosPropiosSwiss(zona: ZonaV2): string {
  if (zona.region === 'amba') return '+ más de 30 centros propios de atención exclusiva'
  if (zona.id === 'salta' || zona.id === 'neuquen') return `+ centro médico propio de Swiss Medical en ${zona.nombre}`
  return ''
}

// ─── Edad ───────────────────────────────────────────────────────────────────
/** Error a mostrar o '' si el grupo se puede cotizar online. Hasta 65; hasta
 *  69 solo junto a alguien de 65 o menos (programa de Swiss). */
export function errorDeEdad(edades: (number | null)[]): string {
  if (edades.some((e) => e === null || !Number.isFinite(e) || e < 0)) return 'Completá la edad de cada integrante.'
  const e = edades as number[]
  if (e.some((n) => n > 69)) return 'Cotizamos online hasta los 69 años, y solo junto a un integrante de 65 o menos.'
  if (!e.some((n) => n <= 65)) return 'Cotizamos online hasta los 65 años. Si en el grupo hay alguien de 65 o menos, podés sumar integrantes de hasta 69.'
  return ''
}

// ─── Aportes (misma fórmula que el cotizador de Swiss, lib/cotizador.js del CRM) ─
/** Tope de aportes de la lista de octubre 2026 del cotizador de Swiss. */
export const TOPE_APORTES = 4691748.47
export function aporteDe(sueldo: number): number {
  if (!(sueldo > 0)) return 0
  return sueldo > TOPE_APORTES
    ? Math.round((sueldo * 0.06 + TOPE_APORTES * 0.03) * 0.85)
    : Math.round(sueldo * 0.09 * 0.85)
}

// ─── Promos ─────────────────────────────────────────────────────────────────
export interface Promo {
  /** Texto corto de la cinta: "15% OFF", "25% OFF por ser monotributista"… */
  corta: string
  /** Aclaración al lado: "exclusivo cotizando online", "por 12 meses"… */
  detalle: string
  /** Porcentaje principal para el botón: "15%" */
  pct: string
}

/**
 * Promo de cada prepaga para este grupo (datos de Darío, 24-oct-2026):
 * Swiss: 15% a los adultos + 50% a menores de 26; monotributista sin menores
 * de 26, 25% a todos. Sancor: 30% por 12 meses si viene de otra prepaga
 * (grupos de hasta 3). Premedic: 15% por 12 meses. OSDE: sin descuento.
 */
export function promoDe(grupo: GrupoPlan, edades: number[], condicion: Condicion): Promo | null {
  if (grupo === 'swiss') {
    const menores = edades.filter((e) => e < 26).length
    if (condicion === 'monotributo' && menores === 0) return { corta: '25% OFF', detalle: 'por ser monotributista', pct: '25%' }
    if (menores && menores === edades.length) return { corta: '50% OFF', detalle: 'para menores de 26', pct: '50%' }
    if (menores) return { corta: '15% OFF', detalle: '+ 50% para los menores de 26', pct: '15%' }
    return { corta: '15% OFF', detalle: 'exclusivo cotizando online', pct: '15%' }
  }
  if (grupo === 'sancor') return edades.length <= 3 ? { corta: '30% OFF', detalle: 'por 12 meses si venís de otra prepaga', pct: '30%' } : null
  if (grupo === 'premedic') return { corta: '15% OFF', detalle: 'por 12 meses', pct: '15%' }
  return null
}

export function asesorDe(grupo: GrupoPlan): string {
  if (grupo === 'swiss') return 'Asesor oficial de Swiss Medical'
  if (grupo === 'sancor') return 'Asesor oficial de Sancor Salud'
  return 'Asesor de PrepagaYa'
}

export const CUANDO_ALTA = [
  { id: 'inmediata', texto: 'De forma inmediata' },
  { id: 'mes-que-viene', texto: 'A partir del mes que viene' },
  { id: 'averiguando', texto: 'Solo estoy averiguando' },
] as const

export const COOKIE_AB = 'pya_ab'
