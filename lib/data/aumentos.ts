import aumentosOficialesJson from './aumentos-oficiales.json'

// Serie mensual de aumentos promedio de prepagas.
// Actualizar al inicio de cada mes junto con PRECIO_ACTUALIZADO en prepagas.ts.
// Fuente: relevamiento de comunicaciones de aumento de las principales empresas
// (Swiss Medical, OSDE, Galeno, Medifé, Sancor, Omint, Medicus, Avalian y otras).

export interface AumentoMensual {
  mes: string // 'YYYY-MM'
  label: string // 'Enero 2026'
  porcentaje: number // aumento promedio del mercado, en %
  esProyeccion?: boolean
  nota?: string
  /** true = sale del cuadro tarifario oficial (SSSalud), no del relevamiento */
  oficial?: boolean
}

export const aumentos2026: AumentoMensual[] = [
  { mes: '2026-01', label: 'Enero 2026', porcentaje: 2.5 },
  { mes: '2026-02', label: 'Febrero 2026', porcentaje: 2.8 },
  { mes: '2026-03', label: 'Marzo 2026', porcentaje: 2.9 },
  { mes: '2026-04', label: 'Abril 2026', porcentaje: 2.9 },
  { mes: '2026-05', label: 'Mayo 2026', porcentaje: 3.4 },
  { mes: '2026-06', label: 'Junio 2026', porcentaje: 2.6 },
  {
    mes: '2026-07',
    label: 'Julio 2026',
    porcentaje: 2.1,
    nota: 'Rango entre empresas: 1,8% a 3,4% según el plan. Swiss Medical, Sancor Salud, OSDE, Medifé y Avalian aplicaron valores en torno al promedio.',
  },
  {
    mes: '2026-08',
    label: 'Agosto 2026',
    porcentaje: 2.2,
    nota: 'Rango entre empresas: 1,9% a 2,7% según el plan. Sancor Salud y Premedic aplicaron los valores más bajos del mercado; Swiss Medical y Medicus, los más altos.',
  },
  {
    mes: '2026-10',
    label: 'Octubre 2026',
    porcentaje: 2.3,
    esProyeccion: true,
    nota: 'Proyección en base a la inflación de agosto 2026: las prepagas ajustan con dos meses de rezago.',
  },
]

// ─── Dato oficial (SSSalud) ────────────────────────────────────────────────
// Aumento real de cada prepaga mes a mes, comparando los cuadros tarifarios
// oficiales de períodos consecutivos (scripts/cuadros-sssalud/aumentos.py).
// Los meses que tienen dato oficial reemplazan al relevamiento de arriba.
export interface AumentoOficialPrepaga {
  nombre: string
  mediana: number
  minimo: number
  maximo: number
  declaradas: number[]
  filas: number
}
export interface AumentoOficialMes {
  label: string
  promedio: number
  prepagas: Record<string, AumentoOficialPrepaga>
}
export const AUMENTOS_OFICIALES = aumentosOficialesJson as unknown as {
  fuente: string
  fuenteUrl: string
  metodo: string
  generado: string
  meses: Record<string, AumentoOficialMes>
}

for (const [periodo, m] of Object.entries(AUMENTOS_OFICIALES.meses)) {
  const mes = `${periodo.slice(0, 4)}-${periodo.slice(4)}`
  const ranking = Object.values(m.prepagas)
  const nota = `Dato oficial: promedio de ${ranking.length} prepagas según sus cuadros tarifarios ante la Superintendencia de Servicios de Salud. Rango: ${ranking[0].mediana.toLocaleString('es-AR')}% (${ranking[0].nombre}) a ${ranking[ranking.length - 1].mediana.toLocaleString('es-AR')}% (${ranking[ranking.length - 1].nombre}).`
  const existente = aumentos2026.find((x) => x.mes === mes)
  if (existente) Object.assign(existente, { porcentaje: m.promedio, esProyeccion: false, nota, oficial: true })
  else aumentos2026.push({ mes, label: m.label, porcentaje: m.promedio, nota, oficial: true })
}
aumentos2026.sort((a, b) => a.mes.localeCompare(b.mes))

/** Último mes con dato oficial por prepaga (el más reciente publicado). */
export function ultimoMesOficial(): (AumentoOficialMes & { periodo: string }) | null {
  const periodos = Object.keys(AUMENTOS_OFICIALES.meses).sort()
  const ultimo = periodos[periodos.length - 1]
  return ultimo ? { periodo: ultimo, ...AUMENTOS_OFICIALES.meses[ultimo] } : null
}

/** Inflación acumulada del año para comparar contra los aumentos (INDEC, ene-jul 2026). */
export const INFLACION_ACUMULADA_2026 = 19

/** Acumulado de aumentos del año, solo meses confirmados (excluye proyecciones). */
export function aumentoAcumulado(): number {
  const factor = aumentos2026
    .filter((a) => !a.esProyeccion)
    .reduce((acc, a) => acc * (1 + a.porcentaje / 100), 1)
  return Math.round((factor - 1) * 1000) / 10
}

