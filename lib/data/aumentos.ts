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
    porcentaje: 1.8,
    esProyeccion: true,
    nota: 'Proyección en base a la inflación de junio 2026: las prepagas ajustan con dos meses de rezago.',
  },
]

/** Inflación acumulada del año para comparar contra los aumentos (INDEC, ene-jul 2026). */
export const INFLACION_ACUMULADA_2026 = 19

/** Acumulado de aumentos del año, solo meses confirmados (excluye proyecciones). */
export function aumentoAcumulado(): number {
  const factor = aumentos2026
    .filter((a) => !a.esProyeccion)
    .reduce((acc, a) => acc * (1 + a.porcentaje / 100), 1)
  return Math.round((factor - 1) * 1000) / 10
}
