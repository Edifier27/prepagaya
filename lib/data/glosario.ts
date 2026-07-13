export type CategoriaGlosario = 'Costos' | 'Cobertura' | 'Contratación' | 'Legal' | 'Tipos'

export interface Termino {
  termino: string
  definicion: string
  categoria: CategoriaGlosario
  ejemplo?: string
}

export const terminos: Termino[] = [
  // COSTOS
  {
    termino: 'Cuota mensual',
    definicion: 'Monto fijo que pagás todos los meses por tu cobertura de salud prepaga. Varía según tu edad, el plan elegido y si contratás en relación de dependencia o como particular.',
    categoria: 'Costos',
    ejemplo: 'Un plan SMG20 de Swiss Medical cuesta $185.000/mes para una persona de 30 años.',
  },
  {
    termino: 'Copago',
    definicion: 'Monto fijo que abonás en el momento de cada prestación: consulta médica, análisis o práctica. Es adicional a la cuota mensual.',
    categoria: 'Costos',
    ejemplo: 'Copago de $5.000 por cada consulta con especialista.',
  },
  {
    termino: 'Coseguro',
    definicion: 'Porcentaje del costo total de una práctica o medicamento que la prepaga te transfiere a vos. A diferencia del copago, no es un monto fijo sino proporcional al costo.',
    categoria: 'Costos',
    ejemplo: '20% de coseguro en cirugías electivas.',
  },
  {
    termino: 'Bono de consulta',
    definicion: 'Comprobante que emite la prepaga para que puedas atenderte con un médico. En algunos planes lo generás por la app; en otros es un cupón físico.',
    categoria: 'Costos',
  },
  {
    termino: 'Ajuste por edad',
    definicion: 'Las cuotas de prepaga aumentan con la edad del afiliado. El aumento puede ser de hasta un 100-200% entre los 30 y los 65 años.',
    categoria: 'Costos',
    ejemplo: 'Un plan que cuesta $120.000 a los 30 años puede costar $340.000 a los 60.',
  },
  {
    termino: 'Lista Deriva',
    definicion: 'Precios sin IVA para personas en relación de dependencia que derivan sus aportes a la prepaga. Son más bajos que los precios de particular.',
    categoria: 'Costos',
  },

  // COBERTURA
  {
    termino: 'PMO',
    definicion: 'Plan Médico Obligatorio. Conjunto mínimo de prestaciones que toda prepaga u obra social debe cubrir por ley en Argentina. Ninguna empresa puede negar las prácticas del PMO.',
    categoria: 'Cobertura',
    ejemplo: 'El PMO incluye consultas médicas, análisis clínicos, internación, parto y medicamentos.',
  },
  {
    termino: 'Cartilla médica',
    definicion: 'Listado oficial de médicos, clínicas y sanatorios habilitados por tu prepaga. Podés consultar qué profesionales aceptan tu cobertura antes de sacar turno.',
    categoria: 'Cobertura',
  },
  {
    termino: 'Red abierta',
    definicion: 'Plan que te permite atenderte con cualquier médico o clínica del país, aunque no esté en la cartilla. Ofrecen máxima libertad de elección.',
    categoria: 'Cobertura',
    ejemplo: 'OSDE Plan 410 y 510 tienen red abierta total.',
  },
  {
    termino: 'Red cerrada',
    definicion: 'Plan donde solo podés atenderte con los prestadores que figuran en la cartilla de tu prepaga. Suelen ser más económicos que los planes de red abierta.',
    categoria: 'Cobertura',
  },
  {
    termino: 'Alta complejidad',
    definicion: 'Prestaciones de gran costo tecnológico o médico: trasplantes, oncología avanzada, cirugías cardíacas, diálisis. El PMO obliga a cubrirlas al 100%.',
    categoria: 'Cobertura',
  },
  {
    termino: 'Autorización previa',
    definicion: 'Aprobación que la prepaga debe darte antes de realizarte una práctica de mediana o alta complejidad. Por ley, tiene plazos máximos de respuesta.',
    categoria: 'Cobertura',
  },
  {
    termino: 'Internación',
    definicion: 'Estadía en sanatorio o clínica por 24 horas o más. El PMO exige cobertura total de la internación; solo puede existir copago si está previsto en el contrato.',
    categoria: 'Cobertura',
  },
  {
    termino: 'Cobertura ambulatoria',
    definicion: 'Prestaciones que recibís sin necesidad de internarte: consultas médicas, análisis, radiografías, vacunas, kinesiología.',
    categoria: 'Cobertura',
  },

  // CONTRATACIÓN
  {
    termino: 'Carencia',
    definicion: 'Período inicial después de afiliarte (generalmente 3 a 12 meses) durante el cual ciertas prestaciones —generalmente las relacionadas con preexistencias— aún no están cubiertas.',
    categoria: 'Contratación',
    ejemplo: 'Carencia de 6 meses para cirugías programadas.',
  },
  {
    termino: 'Preexistencia',
    definicion: 'Enfermedad, condición o patología que ya tenías antes de contratar la prepaga. La ley obliga a cubrirlas, pero puede haber carencia inicial.',
    categoria: 'Contratación',
  },
  {
    termino: 'Derivación de aportes',
    definicion: 'Mecanismo por el cual un trabajador en relación de dependencia redirige sus aportes obligatorios de salud (3% empleado + 6% empleador) a la prepaga que prefiera.',
    categoria: 'Contratación',
  },
  {
    termino: 'Período de declaración jurada',
    definicion: 'Al afiliarte, declarás tus condiciones de salud actuales. La prepaga no puede rechazarte, pero puede imponer carencias en base a lo declarado.',
    categoria: 'Contratación',
  },
  {
    termino: 'Rescisión',
    definicion: 'Finalización voluntaria del contrato con la prepaga. Debés notificarlo con anticipación según lo que indique el contrato (generalmente 30 días).',
    categoria: 'Contratación',
  },
  {
    termino: 'Monotributista',
    definicion: 'Trabajador adherido al régimen de Monotributo. Paga obra social incluida en su cuota mensual, pero también puede contratar una prepaga privada de forma directa.',
    categoria: 'Contratación',
  },

  // LEGAL
  {
    termino: 'Ley 26.682',
    definicion: 'Marco Regulatorio de Medicina Prepaga sancionado en 2011. Regula los derechos y obligaciones de prepagas, prohíbe el rechazo por preexistencias y establece el PMO como piso mínimo.',
    categoria: 'Legal',
  },
  {
    termino: 'SSS',
    definicion: 'Superintendencia de Servicios de Salud. Organismo estatal que regula, fiscaliza y sanciona a prepagas y obras sociales en Argentina. Podés hacer reclamos ante la SSS.',
    categoria: 'Legal',
  },
  {
    termino: 'ANSSAL',
    definicion: 'Administración Nacional del Seguro de Salud. Redistribuye los aportes del Fondo Solidario de Redistribución entre las obras sociales para garantizar la cobertura mínima.',
    categoria: 'Legal',
  },

  // TIPOS
  {
    termino: 'Prepaga',
    definicion: 'Empresa privada de medicina prepagada. La afiliación es voluntaria y se paga directamente. Ofrecen mayor cobertura y más opciones que las obras sociales.',
    categoria: 'Tipos',
  },
  {
    termino: 'Obra social',
    definicion: 'Cobertura de salud obligatoria para trabajadores en relación de dependencia, financiada con aportes del empleado (3%) y el empleador (6%).',
    categoria: 'Tipos',
  },
  {
    termino: 'PAMI',
    definicion: 'Programa de Atención Médica Integral. Obra social para jubilados, pensionados y veteranos de guerra. Es la obra social más grande de América Latina.',
    categoria: 'Tipos',
  },
  {
    termino: 'IOMA',
    definicion: 'Instituto de Obra Médica Asistencial. Obra social para empleados de la provincia de Buenos Aires y sus familias.',
    categoria: 'Tipos',
  },
  {
    termino: 'Plan complementario',
    definicion: 'Prepaga contratada para ampliar la cobertura de tu obra social. Permite acceder a más especialistas, mejores sanatorios y menor tiempo de espera.',
    categoria: 'Tipos',
  },
  {
    termino: 'Plan superador',
    definicion: 'Cobertura adicional que contratás con tu misma obra social para acceder a prestaciones y sanatorios de mayor nivel que los del plan básico.',
    categoria: 'Tipos',
  },
]

export const categoriasGlosario: CategoriaGlosario[] = ['Costos', 'Cobertura', 'Contratación', 'Legal', 'Tipos']
