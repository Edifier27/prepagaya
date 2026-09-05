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

/** Inflación acumulada del año para comparar contra los aumentos (INDEC, ene-jul 2026). */
export const INFLACION_ACUMULADA_2026 = 19

/** Acumulado de aumentos del año, solo meses confirmados (excluye proyecciones). */
export function aumentoAcumulado(): number {
  const factor = aumentos2026
    .filter((a) => !a.esProyeccion)
    .reduce((acc, a) => acc * (1 + a.porcentaje / 100), 1)
  return Math.round((factor - 1) * 1000) / 10
}

// Comparativo por empresa: posicionamiento relativo estimado en base a las
// comunicaciones públicas de aumento y el promedio de mercado (no es el
// porcentaje exacto auditado mes a mes de cada plan — para eso está /precios
// con la cotización real). Sirve para responder "quién aumenta menos" con una
// referencia razonable, no para citar cifras exactas por empresa.
export interface AumentoEmpresa {
  slug: string
  nombre: string
  ultimoAumento: number // % del último mes confirmado (hoy: agosto 2026)
  acumulado2026: number // % estimado, enero-agosto
}

export const AUMENTO_POR_EMPRESA: AumentoEmpresa[] = [
  { slug: 'sancor-salud', nombre: 'Sancor Salud', ultimoAumento: 1.9, acumulado2026: 21.3 },
  { slug: 'premedic', nombre: 'Premedic', ultimoAumento: 2.0, acumulado2026: 22.0 },
  { slug: 'medife', nombre: 'Medifé', ultimoAumento: 2.1, acumulado2026: 22.8 },
  { slug: 'avalian', nombre: 'Avalian (ex-Galeno)', ultimoAumento: 2.2, acumulado2026: 23.4 },
  { slug: 'omint', nombre: 'Omint', ultimoAumento: 2.3, acumulado2026: 23.8 },
  { slug: 'osde', nombre: 'OSDE', ultimoAumento: 2.4, acumulado2026: 24.3 },
  { slug: 'swiss-medical', nombre: 'Swiss Medical', ultimoAumento: 2.5, acumulado2026: 24.9 },
  { slug: 'medicus', nombre: 'Medicus', ultimoAumento: 2.7, acumulado2026: 25.8 },
]
