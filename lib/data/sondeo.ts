// Opciones y validación de los datos extra del lead que alimentan el sondeo
// anónimo de /prensa/sondeo (24-sep-2026). Se comparten entre el cotizador,
// el quiz y la API, así en la base solo entran valores conocidos y el sondeo
// no se llena de texto libre.

export const SITUACIONES_LABORALES = ['Particular', 'Relación de dependencia', 'Monotributista', 'Responsable Inscripto'] as const

// "¿Qué cobertura tenés hoy?" — pregunta opcional DESPUÉS de enviar el lead.
export const OPCIONES_PREPAGA_ACTUAL = [
  'No tengo cobertura',
  'Obra social',
  'PAMI',
  'Swiss Medical',
  'OSDE',
  'Galeno',
  'Medifé',
  'Sancor Salud',
  'Omint',
  'Avalian',
  'Premedic',
  'Medicus',
  'Otra prepaga',
] as const

// Opciones de la pregunta 1 del quiz (components/quiz/QuizPrepaga.tsx).
export const PRESUPUESTOS_QUIZ = ['Menos de $200.000', '$200.000–$350.000', '$350.000–$600.000', 'Más de $600.000'] as const

const PREFERENCIAS_CLAVES = ['copago', 'coberturas', 'zona', 'saludMental', 'medicoDeConfianza', 'grupo'] as const
export type Preferencias = Partial<Record<(typeof PREFERENCIAS_CLAVES)[number], string>>

function deLista<T extends readonly string[]>(lista: T, valor: unknown): string {
  const v = String(valor ?? '').trim()
  return (lista as readonly string[]).includes(v) ? v : ''
}

export const limpiarSituacionLaboral = (v: unknown) => deLista(SITUACIONES_LABORALES, v)
export const limpiarPrepagaActual = (v: unknown) => deLista(OPCIONES_PREPAGA_ACTUAL, v)
export const limpiarPresupuesto = (v: unknown) => deLista(PRESUPUESTOS_QUIZ, v)

/** Solo claves conocidas, valores cortos, JSON de hasta 600 caracteres. */
export function limpiarPreferencias(v: unknown): string {
  let obj: Record<string, unknown>
  try {
    obj = typeof v === 'string' ? JSON.parse(v) : (v as Record<string, unknown>)
  } catch {
    return ''
  }
  if (!obj || typeof obj !== 'object') return ''
  const limpio: Preferencias = {}
  for (const k of PREFERENCIAS_CLAVES) {
    const val = obj[k]
    if (typeof val === 'string' && val.trim()) limpio[k] = val.trim().slice(0, 200)
  }
  const json = JSON.stringify(limpio)
  return json === '{}' || json.length > 600 ? '' : json
}

// ─── Agregado del sondeo (/prensa/sondeo) ──────────────────────────────────
// Solo totales y porcentajes. Un bloque se muestra si tiene al menos
// MIN_BASE respuestas, y las categorías con menos de MIN_CATEGORIA van a
// "Otras", así ningún número chico apunta a una persona.

/** Fila de la base SIN datos personales (ver filasSondeo en lib/db.ts). */
export interface FilaSondeo {
  creado_en: string
  provincia: string | null
  edades: string | null
  prepaga: string | null
  situacion_laboral: string | null
  presupuesto: string | null
  prepaga_actual: string | null
  preferencias: string | null
}

export interface ItemSondeo { etiqueta: string; n: number; pct: number }
export interface BloqueSondeo { id: string; titulo: string; base: number; items: ItemSondeo[]; nota?: string }
export interface ResultadoSondeo {
  total: number
  desde: string | null
  hasta: string | null
  edadMedianaTitular: number | null
  bloques: BloqueSondeo[]
}

export const MIN_BASE = 30
const MIN_CATEGORIA = 5

/** "una persona de 35 años" / "un grupo de 3 personas (35, 33 y 5 años)" → edades */
export function parsearEdades(txt: string | null): number[] {
  if (!txt) return []
  const grupo = txt.match(/grupo de \d+ personas \(([^)]*)\)/)
  const edades = grupo ? (grupo[1].match(/\d+/g) ?? []).map(Number) : (txt.match(/persona de (\d+)/)?.slice(1).map(Number) ?? [])
  return edades.filter((e) => e >= 0 && e <= 110)
}

function preferencias(json: string | null): Preferencias {
  if (!json) return {}
  try { return JSON.parse(json) as Preferencias } catch { return {} }
}

function bloque(id: string, titulo: string, valores: string[], orden?: readonly string[], nota?: string, base?: number): BloqueSondeo | null {
  const total = base ?? valores.length
  if (total < MIN_BASE) return null
  const conteo = new Map<string, number>()
  for (const v of valores) conteo.set(v, (conteo.get(v) ?? 0) + 1)
  let items = [...conteo.entries()].map(([etiqueta, n]) => ({ etiqueta, n }))
  const chicos = items.filter((x) => x.n < MIN_CATEGORIA)
  items = items.filter((x) => x.n >= MIN_CATEGORIA)
  const otras = chicos.reduce((s, x) => s + x.n, 0)
  if (otras > 0) items.push({ etiqueta: 'Otras', n: otras })
  items = orden
    ? items.sort((a, b) => (orden.indexOf(a.etiqueta) + 1 || 999) - (orden.indexOf(b.etiqueta) + 1 || 999))
    : items.sort((a, b) => (a.etiqueta === 'Otras' ? 1 : b.etiqueta === 'Otras' ? -1 : b.n - a.n))
  return { id, titulo, base: total, nota, items: items.map((x) => ({ ...x, pct: Math.round((x.n / total) * 1000) / 10 })) }
}

const TRAMOS = ['18 a 29 años', '30 a 39 años', '40 a 49 años', '50 a 59 años', '60 años o más'] as const
const tramo = (e: number) => (e < 30 ? TRAMOS[0] : e < 40 ? TRAMOS[1] : e < 50 ? TRAMOS[2] : e < 60 ? TRAMOS[3] : TRAMOS[4])
const GRUPOS = ['Solo para sí', 'En pareja', 'Familia con hijos', 'Otros grupos'] as const
const COPAGO = ['Quiere un plan sin copago', 'Acepta pagar copago', 'Le es indiferente'] as const
const COPAGO_MAPA: Record<string, (typeof COPAGO)[number]> = {
  'Muy importante': COPAGO[0], 'Sin copago': COPAGO[0],
  'Me parece bien pagar algo': COPAGO[1], 'Con copago': COPAGO[1],
  'Me es indiferente': COPAGO[2],
}

export function agregarSondeo(filas: FilaSondeo[]): ResultadoSondeo {
  const fechas = filas.map((f) => f.creado_en).sort()
  const conEdades = filas.map((f) => parsearEdades(f.edades)).filter((e) => e.length > 0)
  const titulares = conEdades.map((e) => e[0]).filter((e) => e >= 18).sort((a, b) => a - b)
  const grupos = conEdades.map((e) =>
    e.length === 1 ? GRUPOS[0] : e.some((x) => x < 18) ? GRUPOS[2] : e.length === 2 ? GRUPOS[1] : GRUPOS[3])
  const prefs = filas.map((f) => preferencias(f.preferencias))
  const conCoberturas = prefs.filter((p) => p.coberturas)
  const coberturas = conCoberturas.flatMap((p) => (p.coberturas ?? '').split(',').map((s) => s.trim()).filter(Boolean))

  const bloques = [
    bloque('grupo', '¿Para quién buscan prepaga?', grupos, GRUPOS),
    bloque('edad', 'Edad de quien cotiza (titular)', titulares.map(tramo), TRAMOS),
    bloque('provincia', 'Desde qué provincia cotizan', filas.map((f) => (f.provincia ?? '').trim()).filter(Boolean)),
    bloque('situacion', 'Situación laboral', filas.map((f) => f.situacion_laboral ?? '').filter(Boolean), SITUACIONES_LABORALES),
    bloque('cobertura-actual', 'Qué cobertura tienen hoy', filas.map((f) => f.prepaga_actual ?? '').filter(Boolean)),
    bloque('presupuesto', 'Cuánto pueden pagar por mes', filas.map((f) => f.presupuesto ?? '').filter(Boolean), PRESUPUESTOS_QUIZ),
    bloque('copago', 'Qué opinan del copago', prefs.map((p) => COPAGO_MAPA[p.copago ?? ''] ?? '').filter(Boolean), COPAGO),
    bloque('coberturas', 'Coberturas que más buscan', coberturas, undefined, 'Podían marcar más de una: los porcentajes no suman 100.', conCoberturas.length),
  ].filter((b): b is BloqueSondeo => b !== null)

  return {
    total: filas.length,
    desde: fechas[0] ?? null,
    hasta: fechas[fechas.length - 1] ?? null,
    edadMedianaTitular: titulares.length >= MIN_BASE ? titulares[Math.floor(titulares.length / 2)] : null,
    bloques,
  }
}
