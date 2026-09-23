// Cobertura puntual por prepaga y plan ("¿Swiss Medical cubre ortodoncia?"),
// para /coberturas/[tema]/[prepaga]. Cada dato sale de un documento oficial de
// la prepaga, citado en `fuentes` — nada estimado ni "de mercado". Los montos
// en pesos se publican solo con su fecha de vigencia.
//
// Búsquedas objetivo (autocompletado de Google AR, 22-sep-2026): "swiss
// medical cubre ortodoncia", "swiss medical cobertura lentes", "swiss medical
// cobertura en el exterior", "swiss medical reintegros", etc.

export interface FuenteCobertura {
  nombre: string
  /** Fecha del documento (vigencia o creación), ej. "julio 2026" */
  fecha: string
  url?: string
}

export interface PlanCobertura {
  /** Texto del plan tal cual la fuente, ej. "SMG30" o "S1 y S2" */
  plan: string
  /** slugs de /prepagas/[prepaga]/[plan] a los que corresponde */
  planSlugs: string[]
  incluido: boolean
  /** detalle de la fuente para ese plan, ej. "Hasta 18 años" */
  detalle?: string
  /** la fuente no lo menciona para este plan: NO se afirma que no lo cubre */
  sinDato?: boolean
}

export interface CoberturaMarca {
  tema: string
  /** nombre del tema para mostrar, ej. "Ortodoncia" */
  temaNombre: string
  prepagaSlug: string
  prepagaNombre: string
  /** pregunta tal cual se busca; es el H1 */
  pregunta: string
  title: string
  description: string
  keywords: string[]
  /** respuesta corta (arriba de todo y en el FAQ) — solo datos de la fuente */
  respuesta: string
  planes: PlanCobertura[]
  /** detalle y condiciones, citando el documento */
  detalles: { texto: string; fuente: string }[]
  fuentes: FuenteCobertura[]
  /** planSlug a sugerir en el CTA (el más bajo que lo incluye y está en el comparador) */
  planCta?: string
}

// ─── Swiss Medical ──────────────────────────────────────────────────────────
// Fuentes:
//  - "Comparativo de coberturas planes estándar" (Productos & Segmentos,
//    División Salud, Swiss Medical), julio 2026 — S1/S2 a SMG70.
//  - "Alcance de la cobertura" de los planes SMG20 y SMG30 (vigencia 08/2026)
//    y SMG50 (vigencia 09/2026), Adm. de Producto - Gcia. Gestión de Prestadores.
// Los planes Sport no figuran en el comparativo: no se incluyen.
const SWISS_COMPARATIVO: FuenteCobertura = { nombre: 'Comparativo de coberturas planes estándar de Swiss Medical', fecha: 'julio 2026' }
const SWISS_ALCANCE: FuenteCobertura = { nombre: 'Alcance de la cobertura de los planes SMG20, SMG30 (vigencia 08/2026) y SMG50 (vigencia 09/2026)', fecha: 'agosto-septiembre 2026' }

const SW = (plan: string, planSlugs: string[], incluido: boolean, detalle?: string): PlanCobertura => ({ plan, planSlugs, incluido, detalle })
const S1S2 = ['s1', 's2']

const swiss: CoberturaMarca[] = [
  {
    tema: 'ortodoncia',
    temaNombre: 'Ortodoncia',
    prepagaSlug: 'swiss-medical',
    prepagaNombre: 'Swiss Medical',
    pregunta: '¿Swiss Medical cubre ortodoncia?',
    title: '¿Swiss Medical cubre ortodoncia? Límite de edad por plan (2026)',
    description: 'Ortodoncia en Swiss Medical plan por plan: hasta 15 años en SMG20, hasta 18 en SMG30 y SMG40, sin límite de edad desde SMG50. El SMG02 no la incluye. Datos oficiales 2026.',
    keywords: ['swiss medical cubre ortodoncia', 'swiss medical ortodoncia', 'ortodoncia swiss medical edad', 'swiss medical brackets'],
    respuesta: 'Sí, según el plan. El SMG20 cubre ortodoncia hasta los 15 años, el SMG30 y el SMG40 hasta los 18, y del SMG50 al SMG70 sin límite de edad. En S1 y S2 es por reintegro hasta los 15 años. El SMG02 no la incluye.',
    planes: [
      SW('S1 y S2', S1S2, true, 'Por reintegro, hasta 15 años'),
      SW('SMG02', ['smg02'], false),
      SW('SMG20', ['smg20'], true, 'Hasta 15 años'),
      SW('SMG30', ['smg30'], true, 'Hasta 18 años'),
      SW('SMG40', ['smg40'], true, 'Hasta 18 años'),
      SW('SMG50', ['smg50'], true, 'Sin límite de edad'),
      SW('SMG60', ['smg60'], true, 'Sin límite de edad'),
      SW('SMG70', ['smg70'], true, 'Sin límite de edad'),
    ],
    detalles: [
      { texto: 'En sistema cerrado se cubre el 100% del tratamiento, por única vez, en los centros designados por Swiss Medical.', fuente: 'Alcance de la cobertura SMG20, SMG30 y SMG50' },
      { texto: 'La consulta de mantenimiento es con cargo en SMG20 y SMG30, y sin cargo en SMG50.', fuente: 'Alcance de la cobertura SMG20, SMG30 y SMG50' },
    ],
    fuentes: [SWISS_COMPARATIVO, SWISS_ALCANCE],
    planCta: 'smg20',
  },
  {
    tema: 'implantes-dentales',
    temaNombre: 'Implantes dentales',
    prepagaSlug: 'swiss-medical',
    prepagaNombre: 'Swiss Medical',
    pregunta: '¿Swiss Medical cubre implantes dentales?',
    title: '¿Swiss Medical cubre implantes dentales? Qué planes los incluyen (2026)',
    description: 'Implantes dentales en Swiss Medical: incluidos del SMG50 al SMG70 y por reintegro en S1 y S2; el SMG02, SMG20, SMG30 y SMG40 no los incluyen. Datos oficiales 2026.',
    keywords: ['swiss medical cubre implantes dentales', 'swiss medical implantes', 'implantes dentales swiss medical'],
    respuesta: 'Solo en algunos planes. Los implantes dentales están incluidos en el SMG50, SMG60 y SMG70, y en S1 y S2 son por reintegro. El SMG02, SMG20, SMG30 y SMG40 no los incluyen.',
    planes: [
      SW('S1 y S2', S1S2, true, 'Por reintegro'),
      SW('SMG02', ['smg02'], false),
      SW('SMG20', ['smg20'], false),
      SW('SMG30', ['smg30'], false),
      SW('SMG40', ['smg40'], false),
      SW('SMG50', ['smg50'], true),
      SW('SMG60', ['smg60'], true),
      SW('SMG70', ['smg70'], true),
    ],
    detalles: [
      { texto: 'La odontología general está incluida en todos los planes (S1/S2 a SMG70).', fuente: 'Comparativo de coberturas, julio 2026' },
      { texto: 'Las placas de descanso están incluidas en todos los planes excepto el SMG02.', fuente: 'Comparativo de coberturas, julio 2026' },
    ],
    fuentes: [SWISS_COMPARATIVO],
    planCta: 'smg50',
  },
  {
    tema: 'optica',
    temaNombre: 'Anteojos y lentes',
    prepagaSlug: 'swiss-medical',
    prepagaNombre: 'Swiss Medical',
    pregunta: '¿Swiss Medical cubre anteojos y lentes de contacto?',
    title: '¿Swiss Medical cubre anteojos y lentes? Cobertura de óptica por plan (2026)',
    description: 'Óptica en Swiss Medical: un par de anteojos o lentes de contacto standard por año y por persona en todos los planes excepto el SMG02, más cirugía refractiva. Datos oficiales 2026.',
    keywords: ['swiss medical cobertura lentes', 'swiss medical anteojos', 'swiss medical optica', 'swiss medical lentes de contacto', 'swiss medical cirugia refractiva'],
    respuesta: 'Sí, en todos los planes excepto el SMG02: cubre un par de anteojos o lentes de contacto standard por año y por persona. La cirugía refractiva también está incluida en todos los planes excepto el SMG02.',
    planes: [
      SW('S1 y S2', S1S2, true),
      SW('SMG02', ['smg02'], false),
      SW('SMG20', ['smg20'], true, '1 par por año y por persona'),
      SW('SMG30', ['smg30'], true, '1 par por año y por persona'),
      SW('SMG40', ['smg40'], true),
      SW('SMG50', ['smg50'], true, '1 par por año y por persona'),
      SW('SMG60', ['smg60'], true),
      SW('SMG70', ['smg70'], true),
    ],
    detalles: [
      { texto: 'Un par de anteojos o lentes de contacto standard, por año y por persona.', fuente: 'Alcance de la cobertura SMG20, SMG30 y SMG50' },
      { texto: 'Cirugía refractiva según norma, en todos los planes excepto el SMG02.', fuente: 'Comparativo de coberturas, julio 2026' },
    ],
    fuentes: [SWISS_COMPARATIVO, SWISS_ALCANCE],
    planCta: 'smg20',
  },
  {
    tema: 'psicologia',
    temaNombre: 'Psicología',
    prepagaSlug: 'swiss-medical',
    prepagaNombre: 'Swiss Medical',
    pregunta: '¿Swiss Medical cubre psicología?',
    title: '¿Swiss Medical cubre psicología? Sesiones por plan (2026)',
    description: 'Psicología en Swiss Medical: 30 sesiones sin cargo por año del SMG20 al SMG60 y 36 en el SMG70; con copago en S1, S2 y SMG02. Datos oficiales 2026.',
    keywords: ['swiss medical cobertura psicologia', 'swiss medical psicologos', 'swiss medical sesiones psicologia', 'swiss medical salud mental'],
    respuesta: 'Sí. Del SMG20 al SMG60 cubre 30 sesiones de psicología sin cargo por año y por persona, y el SMG70, 36. En S1, S2 y SMG02 la psicología es con copago.',
    planes: [
      SW('S1 y S2', S1S2, true, 'Con copago'),
      SW('SMG02', ['smg02'], true, 'Con copago'),
      SW('SMG20', ['smg20'], true, '30 sesiones sin cargo por año'),
      SW('SMG30', ['smg30'], true, '30 sesiones sin cargo por año'),
      SW('SMG40', ['smg40'], true, '30 sesiones sin cargo por año'),
      SW('SMG50', ['smg50'], true, '30 sesiones sin cargo por año'),
      SW('SMG60', ['smg60'], true, '30 sesiones sin cargo por año'),
      SW('SMG70', ['smg70'], true, '36 sesiones sin cargo por año'),
    ],
    detalles: [
      { texto: 'Desde la sesión 31, en sistema cerrado, con arancel: $ 30.866 por sesión en SMG20 y SMG30 (vigencia 08/2026) y $ 31.546 en SMG50 (vigencia 09/2026).', fuente: 'Alcance de la cobertura SMG20, SMG30 y SMG50' },
      { texto: 'Un psicodiagnóstico por año por persona.', fuente: 'Alcance de la cobertura SMG20, SMG30 y SMG50' },
      { texto: 'Internación psiquiátrica solo por patologías agudas, hasta 30 días.', fuente: 'Alcance de la cobertura SMG20' },
    ],
    fuentes: [SWISS_COMPARATIVO, SWISS_ALCANCE],
    planCta: 'smg20',
  },
  {
    tema: 'cirugia-estetica',
    temaNombre: 'Cirugía estética',
    prepagaSlug: 'swiss-medical',
    prepagaNombre: 'Swiss Medical',
    pregunta: '¿Swiss Medical cubre cirugía estética?',
    title: '¿Swiss Medical cubre cirugía estética? Qué planes la incluyen (2026)',
    description: 'Cirugía estética en Swiss Medical: 1 por año sin cargo en SMG50, SMG60 y SMG70 (titular o cónyuge, incluye prótesis). Los demás planes no la incluyen. Datos oficiales 2026.',
    keywords: ['swiss medical cubre cirugia estetica', 'swiss medical cirugia estetica', 'swiss medical cirugia plastica'],
    respuesta: 'Solo en los planes más altos: el SMG50, SMG60 y SMG70 cubren una cirugía estética por año sin cargo. Del S1/S2 al SMG40 no la incluyen.',
    planes: [
      SW('S1 y S2', S1S2, false),
      SW('SMG02', ['smg02'], false),
      SW('SMG20', ['smg20'], false),
      SW('SMG30', ['smg30'], false),
      SW('SMG40', ['smg40'], false),
      SW('SMG50', ['smg50'], true, '1 por año sin cargo'),
      SW('SMG60', ['smg60'], true, '1 por año sin cargo'),
      SW('SMG70', ['smg70'], true, '1 por año sin cargo'),
    ],
    detalles: [
      { texto: 'En el SMG50: 1 por año para el titular o cónyuge, incluye prótesis; por reintegro, tope de $ 3.765.888 (vigencia 09/2026).', fuente: 'Alcance de la cobertura SMG50' },
      { texto: 'Los tratamientos dermoestéticos están incluidos solo en el SMG70.', fuente: 'Comparativo de coberturas, julio 2026' },
    ],
    fuentes: [SWISS_COMPARATIVO, SWISS_ALCANCE],
    planCta: 'smg50',
  },
  {
    tema: 'exterior',
    temaNombre: 'Cobertura en el exterior',
    prepagaSlug: 'swiss-medical',
    prepagaNombre: 'Swiss Medical',
    pregunta: '¿Swiss Medical tiene cobertura en el exterior?',
    title: '¿Swiss Medical cubre en el exterior? Asistencia al viajero por plan (2026)',
    description: 'Swiss Medical incluye asistencia al viajero internacional desde el SMG30 (accidentes y enfermedades agudas, viajes de hasta 60 días). S1, S2, SMG02 y SMG20 no la incluyen. Datos oficiales 2026.',
    keywords: ['swiss medical cobertura en el exterior', 'swiss medical cobertura internacional', 'swiss medical cubre en brasil', 'swiss medical asistencia al viajero', 'swiss medical paises limitrofes'],
    respuesta: 'Desde el SMG30. Del SMG30 al SMG70 incluyen asistencia al viajero internacional ("Swiss Medical Internacional") para el grupo familiar. S1, S2, SMG02 y SMG20 no la incluyen.',
    planes: [
      SW('S1 y S2', S1S2, false),
      SW('SMG02', ['smg02'], false),
      SW('SMG20', ['smg20'], false),
      SW('SMG30', ['smg30'], true),
      SW('SMG40', ['smg40'], true),
      SW('SMG50', ['smg50'], true),
      SW('SMG60', ['smg60'], true),
      SW('SMG70', ['smg70'], true),
    ],
    detalles: [
      { texto: 'Rige solo para accidentes y enfermedades repentinas y agudas contraídas después de la fecha de inicio del viaje.', fuente: 'Alcance de la cobertura SMG30 y SMG50' },
      { texto: 'Cada viaje no debe superar los 60 días corridos desde la salida de la Argentina.', fuente: 'Alcance de la cobertura SMG30 y SMG50' },
    ],
    fuentes: [SWISS_COMPARATIVO, SWISS_ALCANCE],
    planCta: 'smg30',
  },
  {
    tema: 'reintegros',
    temaNombre: 'Reintegros',
    prepagaSlug: 'swiss-medical',
    prepagaNombre: 'Swiss Medical',
    pregunta: '¿Swiss Medical hace reintegros?',
    title: '¿Swiss Medical hace reintegros? Qué planes tienen reintegro (2026)',
    description: 'Reintegros en Swiss Medical: incluidos del SMG30 al SMG70 (sistema abierto, con topes por práctica). S1, S2, SMG02 y SMG20 no tienen reintegros. Datos oficiales 2026.',
    keywords: ['swiss medical hace reintegros', 'swiss medical reintegros', 'swiss medical reintegro', 'swiss medical sistema abierto'],
    respuesta: 'Desde el SMG30. Del SMG30 al SMG70 podés atenderte fuera de cartilla y pedir reintegro, con topes por práctica. S1, S2, SMG02 y SMG20 no tienen reintegros.',
    planes: [
      SW('S1 y S2', S1S2, false),
      SW('SMG02', ['smg02'], false),
      SW('SMG20', ['smg20'], false),
      SW('SMG30', ['smg30'], true, 'Sistema combinado (cerrado + abierto)'),
      SW('SMG40', ['smg40'], true),
      SW('SMG50', ['smg50'], true, 'Sistema combinado (cerrado + abierto)'),
      SW('SMG60', ['smg60'], true),
      SW('SMG70', ['smg70'], true),
    ],
    detalles: [
      { texto: 'Cada patología tiene un tope máximo de reintegro según los valores Galeno del Nomenclador Nacional.', fuente: 'Alcance de la cobertura SMG30 y SMG50' },
      { texto: 'El tope de reintegro de estudios y prácticas ambulatorias es compartido con resonancia y tomografía.', fuente: 'Alcance de la cobertura SMG30 y SMG50' },
      { texto: 'El SMG20 es sistema cerrado (solo cartilla).', fuente: 'Alcance de la cobertura SMG20' },
    ],
    fuentes: [SWISS_COMPARATIVO, SWISS_ALCANCE],
    planCta: 'smg30',
  },
  {
    tema: 'medicamentos',
    temaNombre: 'Medicamentos',
    prepagaSlug: 'swiss-medical',
    prepagaNombre: 'Swiss Medical',
    pregunta: '¿Cuánto cubre Swiss Medical en medicamentos?',
    title: 'Swiss Medical: cobertura de medicamentos en farmacia por plan (2026)',
    description: 'Swiss Medical cubre el 40% en medicamentos en farmacia en todos sus planes estándar, de S1/S2 a SMG70. Datos oficiales 2026.',
    keywords: ['swiss medical medicamentos', 'swiss medical cobertura farmacia', 'swiss medical descuento medicamentos'],
    respuesta: 'El 40% en farmacia, en todos los planes estándar (de S1/S2 a SMG70).',
    planes: ['S1 y S2', 'SMG02', 'SMG20', 'SMG30', 'SMG40', 'SMG50', 'SMG60', 'SMG70'].map((p) =>
      SW(p, p === 'S1 y S2' ? S1S2 : [p.toLowerCase()], true, '40% en farmacia'),
    ),
    detalles: [
      { texto: 'La cobertura del 40% en farmacia figura en todos los planes del comparativo oficial.', fuente: 'Comparativo de coberturas, julio 2026' },
    ],
    fuentes: [SWISS_COMPARATIVO],
    planCta: 'smg02',
  },
]

// ─── Avalian ────────────────────────────────────────────────────────────────
// Fuentes (públicas, del cotizador oficial compraonline.avalian.com,
// consultado el 22-sep-2026):
//  - Ficha de cada plan que vende online (API /api/plans: ítems de cobertura).
//  - "Diagrama de cobertura" PDF que ese cotizador enlaza para cada plan
//    (Integral AS200/AS204, Superior AS300, Selecta AS400/AS500).
// Cerca (AS100) y Plan Hoy (AS200H) quedan afuera: no tienen diagrama
// publicado (el de Plan Hoy da 404). Óptica no figura en los diagramas.
const AVALIAN_FICHAS: FuenteCobertura = { nombre: 'Planes publicados en el cotizador online de Avalian', fecha: 'septiembre 2026', url: 'https://compraonline.avalian.com/cotizacion' }
const AVALIAN_DIAGRAMA: FuenteCobertura = { nombre: 'Diagrama de cobertura de los planes Integral, Superior y Selecta (publicado en el cotizador online de Avalian)', fecha: 'septiembre 2026', url: 'https://compraonline.avalian.com/cotizacion' }

// Plan de la tabla → slugs de los planes reales de lib/data/prepagas.ts (23-sep-2026).
const AV_SLUGS: Record<string, string[]> = {
  'Integral AS200 / AS204': ['as200', 'as204'],
  'Superior AS300': ['as300'],
  'Selecta AS400 / AS500': ['as400', 'as500'],
  'Selecta AS400': ['as400'],
  'Selecta AS500': ['as500'],
}
const AV = (plan: string, incluido: boolean, detalle?: string): PlanCobertura => ({ plan, planSlugs: AV_SLUGS[plan] ?? [], incluido, detalle })

const avalian: CoberturaMarca[] = [
  {
    tema: 'ortodoncia',
    temaNombre: 'Ortodoncia',
    prepagaSlug: 'avalian',
    prepagaNombre: 'Avalian',
    pregunta: '¿Avalian cubre ortodoncia?',
    title: '¿Avalian cubre ortodoncia? Edad máxima por plan (2026)',
    description: 'Ortodoncia en Avalian: por única vez y con autorización previa, de 5 a 30 años en Integral, de 5 a 35 en Superior y de 5 a 50 en Selecta. Datos oficiales 2026.',
    keywords: ['avalian cubre ortodoncia', 'avalian cobertura ortodoncia', 'avalian ortodoncia', 'avalian brackets'],
    respuesta: 'Sí, por única vez y con autorización previa, a valor Avalian. La edad cambia según el plan: de 5 a 30 años en Integral (AS200/AS204), de 5 a 35 en Superior (AS300) y de 5 a 50 en Selecta (AS400/AS500).',
    planes: [
      AV('Integral AS200 / AS204', true, 'De 5 a 30 años, por única vez'),
      AV('Superior AS300', true, 'De 5 a 35 años, por única vez'),
      AV('Selecta AS400 / AS500', true, 'De 5 a 50 años, por única vez'),
    ],
    detalles: [
      { texto: 'Por única vez, con autorización previa. Cobertura a "valor Avalian".', fuente: 'Diagrama de cobertura de cada plan' },
    ],
    fuentes: [AVALIAN_DIAGRAMA],
  },
  {
    tema: 'implantes-dentales',
    temaNombre: 'Implantes dentales',
    prepagaSlug: 'avalian',
    prepagaNombre: 'Avalian',
    pregunta: '¿Avalian cubre implantes dentales?',
    title: '¿Avalian cubre implantes dentales? Qué planes los incluyen (2026)',
    description: 'Implantes dentales en Avalian: solo el plan Selecta (AS400/AS500) los cubre, a valor Avalian según plan. Integral y Superior: sin cobertura. Datos oficiales 2026.',
    keywords: ['avalian cubre implantes dentales', 'avalian implantes', 'avalian protesis dentales'],
    respuesta: 'Solo el plan Selecta (AS400 y AS500), a valor Avalian según el plan. En Integral (AS200/AS204) y Superior (AS300) las prótesis odontológicas e implantes dentales figuran sin cobertura.',
    planes: [
      AV('Integral AS200 / AS204', false),
      AV('Superior AS300', false),
      AV('Selecta AS400 / AS500', true, 'Valor Avalian según plan'),
    ],
    detalles: [
      { texto: 'Aplica a "prótesis odontológicas e implantes dentales".', fuente: 'Diagrama de cobertura de cada plan' },
    ],
    fuentes: [AVALIAN_DIAGRAMA],
  },
  {
    tema: 'odontologia',
    temaNombre: 'Odontología',
    prepagaSlug: 'avalian',
    prepagaNombre: 'Avalian',
    pregunta: '¿Qué cubre Avalian en odontología?',
    title: 'Avalian odontología: qué cubre cada plan y con qué copago (2026)',
    description: 'Odontología en Avalian: 100% con copago en Integral, sin copago en Superior y Selecta. Ortodoncia en todos (con límite de edad) e implantes solo en Selecta. Datos oficiales 2026.',
    keywords: ['avalian odontologia', 'avalian cobertura odontologica', 'avalian dentista', 'avalian cartilla odontología'],
    respuesta: 'Consultas y tratamientos odontológicos al 100%: con copago en Integral (AS200/AS204) y sin copago en Superior (AS300) y Selecta (AS400/AS500). La ortodoncia está en todos los planes con límite de edad y los implantes, solo en Selecta.',
    planes: [
      AV('Integral AS200 / AS204', true, '100% con copago'),
      AV('Superior AS300', true, 'Consulta y tratamiento sin copago'),
      AV('Selecta AS400 / AS500', true, '100% sin copago'),
    ],
    detalles: [
      { texto: 'Ortodoncia: por única vez, de 5 a 30 años (Integral), 5 a 35 (Superior) y 5 a 50 (Selecta).', fuente: 'Diagrama de cobertura de cada plan' },
      { texto: 'Implantes y prótesis odontológicas: solo Selecta, a valor Avalian según plan.', fuente: 'Diagrama de cobertura de cada plan' },
    ],
    fuentes: [AVALIAN_FICHAS, AVALIAN_DIAGRAMA],
  },
  {
    tema: 'psicologia',
    temaNombre: 'Psicología',
    prepagaSlug: 'avalian',
    prepagaNombre: 'Avalian',
    pregunta: '¿Avalian cubre psicología?',
    title: '¿Avalian cubre psicología? Sesiones por plan (2026)',
    description: 'Psicoterapia en Avalian: 30 sesiones por año en Integral y Superior (4 por mes, con copago; virtual por E-doc sin copago) y 48 por año sin copago en Selecta. Datos oficiales 2026.',
    keywords: ['avalian cubre psicologia', 'avalian psicologos', 'avalian cartilla de psicologos', 'avalian reintegro psicologia'],
    respuesta: 'Sí. Integral (AS200/AS204) y Superior (AS300) cubren 30 sesiones de psicoterapia por año, hasta 4 por mes, con copago al prestador (las virtuales por E-doc, sin copago). Selecta (AS400/AS500) cubre 48 sesiones por año sin copago.',
    planes: [
      AV('Integral AS200 / AS204', true, '30 sesiones por año, con copago'),
      AV('Superior AS300', true, '30 sesiones por año, con copago'),
      AV('Selecta AS400 / AS500', true, '48 sesiones por año, sin copago'),
    ],
    detalles: [
      { texto: 'Hasta 4 sesiones por mes.', fuente: 'Diagrama de cobertura de cada plan' },
      { texto: 'En Integral y Superior, las sesiones virtuales por E-doc son sin copago.', fuente: 'Diagrama de cobertura de cada plan' },
    ],
    fuentes: [AVALIAN_DIAGRAMA],
  },
  {
    tema: 'cirugia-estetica',
    temaNombre: 'Cirugía estética',
    prepagaSlug: 'avalian',
    prepagaNombre: 'Avalian',
    pregunta: '¿Avalian cubre cirugía estética?',
    title: '¿Avalian cubre cirugía estética? Qué plan la incluye (2026)',
    description: 'Cirugía estética en Avalian: incluida solo en el plan Selecta (AS400 y AS500). Integral y Superior no la incluyen. Datos oficiales 2026.',
    keywords: ['avalian cubre cirugia estetica', 'avalian cirugia estetica', 'avalian cirugia plastica'],
    respuesta: 'Solo en el plan Selecta (AS400 y AS500), que incluye cirugías estéticas. Integral y Superior no las incluyen.',
    planes: [
      AV('Integral AS200 / AS204', false),
      AV('Superior AS300', false),
      AV('Selecta AS400 / AS500', true, 'Incluye cirugías estéticas'),
    ],
    detalles: [],
    fuentes: [AVALIAN_FICHAS],
  },
  {
    tema: 'exterior',
    temaNombre: 'Cobertura en el exterior',
    prepagaSlug: 'avalian',
    prepagaNombre: 'Avalian',
    pregunta: '¿Avalian tiene cobertura en el exterior?',
    title: '¿Avalian cubre en el exterior? Asistencia al viajero por plan (2026)',
    description: 'Asistencia al viajero de Avalian (Universal Assistance): Argentina y países limítrofes en Integral; internacional en Superior y Selecta. Datos oficiales 2026.',
    keywords: ['avalian cobertura internacional', 'avalian cubre en brasil', 'avalian asistencia al viajero', 'avalian paises limitrofes', 'avalian internacional'],
    respuesta: 'Sí, con asistencia al viajero a través de Universal Assistance. En Integral (AS200/AS204) cubre Argentina y países limítrofes; en Superior (AS300) y Selecta (AS400/AS500), es internacional.',
    planes: [
      AV('Integral AS200 / AS204', true, 'Argentina y países limítrofes'),
      AV('Superior AS300', true, 'Internacional'),
      AV('Selecta AS400 / AS500', true, 'Internacional'),
    ],
    detalles: [
      { texto: 'La asistencia al viajero se brinda a través de Universal Assistance.', fuente: 'Diagrama de cobertura de cada plan' },
      { texto: '20% de descuento en la ampliación de cobertura de la asistencia internacional al viajero.', fuente: 'Diagrama de cobertura de cada plan' },
    ],
    fuentes: [AVALIAN_FICHAS, AVALIAN_DIAGRAMA],
  },
  {
    tema: 'reintegros',
    temaNombre: 'Reintegros',
    prepagaSlug: 'avalian',
    prepagaNombre: 'Avalian',
    pregunta: '¿Avalian hace reintegros?',
    title: '¿Avalian hace reintegros? Qué plan tiene reintegro (2026)',
    description: 'Reintegros en Avalian: solo en el plan Selecta (AS400/AS500), de acuerdo a normas y valores Avalian. Integral y Superior no tienen reintegros. Datos oficiales 2026.',
    keywords: ['avalian hace reintegros', 'avalian reintegros', 'avalian reintegro', 'avalian cuenta de reintegro'],
    respuesta: 'Solo en el plan Selecta (AS400 y AS500), de acuerdo a las normas y valores de Avalian. Integral (AS200/AS204) y Superior (AS300) no tienen reintegros.',
    planes: [
      AV('Integral AS200 / AS204', false),
      AV('Superior AS300', false),
      AV('Selecta AS400 / AS500', true, 'Según normas y valores Avalian'),
    ],
    detalles: [],
    fuentes: [AVALIAN_FICHAS, AVALIAN_DIAGRAMA],
  },
  {
    tema: 'medicamentos',
    temaNombre: 'Medicamentos',
    prepagaSlug: 'avalian',
    prepagaNombre: 'Avalian',
    pregunta: '¿Cuánto cubre Avalian en medicamentos?',
    title: 'Avalian: descuento en medicamentos por plan (2026)',
    description: 'Avalian cubre 40% en medicamentos en farmacia en Integral y Superior, 50% en Selecta AS400 y 75% en Selecta AS500. Datos oficiales 2026.',
    keywords: ['avalian medicamentos', 'avalian descuento farmacia', 'avalian cobertura medicamentos'],
    respuesta: 'Depende del plan: 40% en farmacia en Integral (AS200/AS204) y Superior (AS300), 50% en Selecta AS400 y 75% en Selecta AS500.',
    planes: [
      AV('Integral AS200 / AS204', true, '40%'),
      AV('Superior AS300', true, '40%'),
      AV('Selecta AS400', true, '50%'),
      AV('Selecta AS500', true, '75%'),
    ],
    detalles: [
      { texto: 'Porcentaje sobre el precio de venta al público.', fuente: 'Diagrama de cobertura de cada plan' },
    ],
    fuentes: [AVALIAN_FICHAS, AVALIAN_DIAGRAMA],
  },
]

// ─── Premedic ───────────────────────────────────────────────────────────────
// Fuente: las fichas oficiales de cada plan en web.grupopremedic.com.ar/planes
// (C-100, 200, 300, 400, 500, por aportes, Joven y Simple), consultadas el
// 22-sep-2026. Son fichas comerciales: si un beneficio no aparece en la ficha
// de un plan se marca "sin dato" (sinDato), nunca "no incluido".
const PREMEDIC_FICHAS: FuenteCobertura = { nombre: 'Fichas oficiales de los planes de Premedic (web.grupopremedic.com.ar/planes)', fecha: 'septiembre 2026', url: 'https://web.grupopremedic.com.ar/planes/300' }

const PM = (plan: string, planSlugs: string[], incluido: boolean, detalle?: string, sinDato = false): PlanCobertura => ({ plan, planSlugs, incluido, detalle, sinDato })
const PM_SIN = (plan: string, planSlugs: string[] = []): PlanCobertura => PM(plan, planSlugs, false, undefined, true)

const premedic: CoberturaMarca[] = [
  {
    tema: 'ortodoncia',
    temaNombre: 'Ortodoncia',
    prepagaSlug: 'premedic',
    prepagaNombre: 'Premedic',
    pregunta: '¿Premedic cubre ortodoncia?',
    title: '¿Premedic cubre ortodoncia o brackets? Qué ofrece cada plan (2026)',
    description: 'Ortodoncia en Premedic: arancel preferencial en el Plan C-100 y descuentos en ortodoncia en los planes 400 y 500, en su red odontológica propia. Datos de sus fichas oficiales 2026.',
    keywords: ['premedic cubre ortodoncia', 'premedic cubre brackets', 'premedic ortodoncia', 'premedic odontologia que cubre'],
    respuesta: 'Según sus fichas oficiales, no como cobertura total: el Plan C-100 ofrece ortodoncia con arancel preferencial y los planes 400 y 500, descuentos en ortodoncia. Todos los planes tienen la red odontológica propia de Premedic.',
    planes: [
      PM('C-100', [], true, 'Arancel preferencial'),
      PM_SIN('200', ['plan-200']),
      PM_SIN('300', ['plan-300']),
      PM('400', ['plan-400'], true, 'Descuentos'),
      PM('500', [], true, 'Descuentos'),
      PM_SIN('Por aportes'),
    ],
    detalles: [
      { texto: 'Todos los planes incluyen la red odontológica propia de Premedic.', fuente: 'Fichas oficiales de los planes' },
      { texto: 'Los planes 400 y 500 informan "descuentos en implantes, ortodoncia y estética dental".', fuente: 'Fichas oficiales de los planes 400 y 500' },
    ],
    fuentes: [PREMEDIC_FICHAS],
    planCta: 'plan-400',
  },
  {
    tema: 'implantes-dentales',
    temaNombre: 'Implantes dentales',
    prepagaSlug: 'premedic',
    prepagaNombre: 'Premedic',
    pregunta: '¿Premedic cubre implantes dentales?',
    title: '¿Premedic cubre implantes dentales? Qué ofrece cada plan (2026)',
    description: 'Implantes dentales en Premedic: el Plan C-100 los menciona entre sus beneficios y los planes 400 y 500 ofrecen descuentos en implantes. Datos de sus fichas oficiales 2026.',
    keywords: ['premedic cubre implantes dentales', 'premedic implantes', 'premedic protesis dental'],
    respuesta: 'Según sus fichas oficiales, el Plan C-100 menciona "prótesis e implantes odontológicos" entre sus beneficios, y los planes 400 y 500 ofrecen descuentos en implantes. En los planes 200, 300 y por aportes la ficha no lo informa.',
    planes: [
      PM('C-100', [], true, 'Prótesis e implantes odontológicos'),
      PM_SIN('200', ['plan-200']),
      PM_SIN('300', ['plan-300']),
      PM('400', ['plan-400'], true, 'Descuentos'),
      PM('500', [], true, 'Descuentos'),
      PM_SIN('Por aportes'),
    ],
    detalles: [
      { texto: 'La ficha no detalla porcentajes ni topes: confirmalos con Premedic.', fuente: 'Fichas oficiales de los planes' },
    ],
    fuentes: [PREMEDIC_FICHAS],
    planCta: 'plan-400',
  },
  {
    tema: 'optica',
    temaNombre: 'Anteojos y lentes',
    prepagaSlug: 'premedic',
    prepagaNombre: 'Premedic',
    pregunta: '¿Premedic cubre anteojos?',
    title: '¿Premedic cubre anteojos? Descuentos en ópticas por plan (2026)',
    description: 'Óptica en Premedic: red de ópticas con descuento del 20% al 40% en los planes C-100 y Simple. Datos de sus fichas oficiales 2026.',
    keywords: ['premedic cubre anteojos', 'premedic anteojos', 'premedic descuentos en opticas', 'premedic lentes gratis', 'premedic opticas'],
    respuesta: 'Según sus fichas oficiales, Premedic ofrece una red de ópticas con descuentos del 20% al 40% en los planes C-100 y Simple. Las fichas no informan anteojos sin cargo.',
    planes: [
      PM('C-100', [], true, 'Descuento del 20% al 40% en ópticas de la red'),
      PM_SIN('200', ['plan-200']),
      PM_SIN('300', ['plan-300']),
      PM_SIN('400', ['plan-400']),
      PM_SIN('500'),
      PM('Simple', [], true, 'Descuento del 20% al 40% en ópticas de la red'),
    ],
    detalles: [],
    fuentes: [PREMEDIC_FICHAS],
  },
  {
    tema: 'exterior',
    temaNombre: 'Cobertura en el exterior',
    prepagaSlug: 'premedic',
    prepagaNombre: 'Premedic',
    pregunta: '¿Premedic tiene cobertura en el exterior?',
    title: '¿Premedic cubre en Brasil y el exterior? Asistencia al viajero (2026)',
    description: 'Premedic incluye asistencia al viajero en Argentina y países limítrofes (Brasil, Chile, Uruguay, Paraguay y Bolivia) con Cardinal Assistance, en casi todos sus planes. Datos oficiales 2026.',
    keywords: ['premedic cobertura internacional', 'premedic tiene cobertura en brasil', 'premedic asistencia al viajero', 'premedic exterior'],
    respuesta: 'Sí, en países limítrofes: los planes 200, 300, 400, 500, por aportes, Joven y Simple incluyen asistencia al viajero con cobertura nacional y en países limítrofes, con Cardinal Assistance. Las fichas no informan cobertura en otros países.',
    planes: [
      PM_SIN('C-100'),
      PM('200', ['plan-200'], true, 'Nacional y países limítrofes'),
      PM('300', ['plan-300'], true, 'Nacional y países limítrofes'),
      PM('400', ['plan-400'], true, 'Nacional y países limítrofes'),
      PM('500', [], true, 'Nacional y países limítrofes'),
      PM('Por aportes', [], true, 'Nacional y países limítrofes'),
      PM('Joven', [], true, 'Nacional y países limítrofes'),
      PM('Simple', [], true, 'Nacional y países limítrofes'),
    ],
    detalles: [
      { texto: 'La asistencia al viajero es con Cardinal Assistance.', fuente: 'Fichas oficiales de los planes' },
    ],
    fuentes: [PREMEDIC_FICHAS],
    planCta: 'plan-200',
  },
  {
    tema: 'internacion',
    temaNombre: 'Internación',
    prepagaSlug: 'premedic',
    prepagaNombre: 'Premedic',
    pregunta: '¿Premedic cubre internación?',
    title: '¿Premedic cubre internación? Habitación por plan (2026)',
    description: 'Internación en Premedic: habitación compartida en C-100, 200, 300 y Joven; habitación individual en 400 y 500. El Plan Simple es 100% ambulatorio y no incluye internación. Datos oficiales 2026.',
    keywords: ['premedic cubre internacion', 'premedic internacion', 'premedic habitacion individual', 'premedic plan simple internacion'],
    respuesta: 'Sí, salvo el Plan Simple, que es 100% ambulatorio. Los planes C-100, 200, 300 y Joven internan en habitación compartida, y los planes 400 y 500 en habitación individual.',
    planes: [
      PM('C-100', [], true, 'Habitación compartida'),
      PM('200', ['plan-200'], true, 'Habitación compartida'),
      PM('300', ['plan-300'], true, 'Habitación compartida'),
      PM('400', ['plan-400'], true, 'Habitación individual'),
      PM('500', [], true, 'Habitación individual'),
      PM('Joven', [], true, 'Habitación compartida'),
      PM('Simple', [], false, 'Plan 100% ambulatorio'),
    ],
    detalles: [
      { texto: 'El Plan 400 informa "cobertura en internación y cirugía (según PMO)".', fuente: 'Ficha oficial del Plan 400' },
      { texto: 'El Plan Simple incluye urgencias y emergencias, pero no internación.', fuente: 'Ficha oficial del Plan Simple' },
    ],
    fuentes: [PREMEDIC_FICHAS],
    planCta: 'plan-400',
  },
  {
    tema: 'anticonceptivos',
    temaNombre: 'Anticonceptivos',
    prepagaSlug: 'premedic',
    prepagaNombre: 'Premedic',
    pregunta: '¿Premedic cubre anticonceptivos?',
    title: 'Premedic anticonceptivos: servicio a domicilio por plan (2026)',
    description: 'Premedic ofrece servicio de anticonceptivos a domicilio en los planes 200, 300, 400, 500, por aportes, Joven y Simple. Datos de sus fichas oficiales 2026.',
    keywords: ['premedic anticonceptivos', 'premedic pastillas anticonceptivas', 'premedic nume'],
    respuesta: 'Los planes 200, 300, 400, 500, por aportes, Joven y Simple incluyen servicio de anticonceptivos a domicilio, según sus fichas oficiales.',
    planes: [
      PM_SIN('C-100'),
      PM('200', ['plan-200'], true, 'A domicilio'),
      PM('300', ['plan-300'], true, 'A domicilio'),
      PM('400', ['plan-400'], true, 'A domicilio'),
      PM('500', [], true, 'A domicilio'),
      PM('Por aportes', [], true, 'A domicilio'),
      PM('Joven', [], true, 'A domicilio'),
      PM('Simple', [], true, 'A domicilio'),
    ],
    detalles: [
      { texto: 'La ficha no detalla porcentajes de cobertura del medicamento: confirmalo con Premedic.', fuente: 'Fichas oficiales de los planes' },
    ],
    fuentes: [PREMEDIC_FICHAS],
    planCta: 'plan-200',
  },
]

// ─── OSDE ───────────────────────────────────────────────────────────────────
// Fuente: páginas oficiales "Información al socio → Servicios y cobertura" de
// osde.com.ar (una por tema), consultadas el 22-sep-2026. Donde la página no
// menciona un plan (en general Flux) va "sin dato". Exterior queda afuera:
// sus páginas de asistencia al viajero y urgencias en países limítrofes dan 404.
const OSDE_URL = 'https://www.osde.com.ar/informacion-al-socio/servicios-y-cobertura'
const osdeFuente = (tema: string, slug: string): FuenteCobertura => ({
  nombre: `OSDE, Información al socio: Servicios y cobertura – ${tema}`,
  fecha: 'septiembre 2026',
  url: `${OSDE_URL}/${slug}`,
})

const OS = (plan: string, planSlugs: string[], incluido: boolean, detalle?: string, sinDato = false): PlanCobertura => ({ plan, planSlugs, incluido, detalle, sinDato })
const OS_SIN = (plan: string, planSlugs: string[] = []): PlanCobertura => OS(plan, planSlugs, false, undefined, true)

const osde: CoberturaMarca[] = [
  {
    tema: 'ortodoncia',
    temaNombre: 'Ortodoncia',
    prepagaSlug: 'osde',
    prepagaNombre: 'OSDE',
    pregunta: '¿OSDE cubre ortodoncia?',
    title: '¿OSDE cubre ortodoncia? Edad por plan: 210, 310, 410, 450 y 510 (2026)',
    description: 'Ortodoncia en OSDE: en los planes 210 y 310 de 8 a 18 años inclusive; en 410, 450 y 510, un tratamiento de por vida, con especialistas de cartilla. Datos oficiales de OSDE.',
    keywords: ['osde cubre ortodoncia', 'osde ortodoncia', 'osde 210 ortodoncia', 'osde 310 ortodoncia', 'osde ortodoncia adultos'],
    respuesta: 'Sí. En los planes 210 y 310 cubre ortodoncia de los 8 a los 18 años inclusive; en los planes 410, 450 y 510, un tratamiento de por vida. Siempre con especialistas de la cartilla, e incluye ajustes y aparatología.',
    planes: [
      OS('210', ['210'], true, 'De 8 a 18 años inclusive'),
      OS('310', ['310'], true, 'De 8 a 18 años inclusive'),
      OS('410', ['410'], true, 'Un tratamiento de por vida'),
      OS('450', [], true, 'Un tratamiento de por vida'),
      OS('510', ['510'], true, 'Un tratamiento de por vida'),
      OS_SIN('Flux', ['flux']),
    ],
    detalles: [
      { texto: 'El tratamiento incluye los ajustes y la aparatología necesaria, con profesionales de la cartilla.', fuente: 'Servicios y cobertura – Ortodoncia y ortopedia funcional' },
      { texto: 'Si el tratamiento se interrumpe más de cuatro meses, la nueva etapa queda a cargo del socio.', fuente: 'Servicios y cobertura – Ortodoncia y ortopedia funcional' },
    ],
    fuentes: [osdeFuente('Ortodoncia y ortopedia funcional', 'ortodoncia-y-ortopedia-funcional')],
    planCta: '210',
  },
  {
    tema: 'optica',
    temaNombre: 'Anteojos y lentes',
    prepagaSlug: 'osde',
    prepagaNombre: 'OSDE',
    pregunta: '¿OSDE cubre anteojos y lentes de contacto?',
    title: '¿OSDE cubre anteojos y lentes? Cobertura de óptica por plan (2026)',
    description: 'Óptica en OSDE: desde el plan 410, un par de anteojos completos o de lentes de contacto cada dos años. Menores de 15 años: un par por año (PMO) en todos los planes. Datos oficiales de OSDE.',
    keywords: ['osde cobertura lentes', 'osde reintegro anteojos', 'osde anteojos', 'osde optica', 'osde lentes de contacto'],
    respuesta: 'Desde el plan 410: un par de anteojos completos con armazón estándar o un par de lentes de contacto cada dos años calendario. En todos los planes, los menores de 15 años tienen un par de anteojos por año (PMO).',
    planes: [
      OS('210', ['210'], true, 'Solo menores de 15 años: 1 par por año (PMO)'),
      OS('310', ['310'], true, 'Solo menores de 15 años: 1 par por año (PMO)'),
      OS('410', ['410'], true, '1 par de anteojos o lentes de contacto cada 2 años'),
      OS('450', [], true, '1 par de anteojos o lentes de contacto cada 2 años'),
      OS('510', ['510'], true, '1 par de anteojos o lentes de contacto cada 2 años'),
      OS_SIN('Flux', ['flux']),
    ],
    detalles: [
      { texto: 'Anteojos con cristales orgánicos, minerales blancos con tratamiento antirreflejo u otro material; esféricos hasta ±6 dioptrías, esferocilíndricos hasta ±4 (esf) ±2 (cil) y cilíndricos hasta ±2. Excluye bifocales y multifocales.', fuente: 'Servicios y cobertura – Óptica' },
      { texto: 'Lentes de contacto flexibles o blandas esféricas, independientemente de las dioptrías; excluye tóricas y descartables.', fuente: 'Servicios y cobertura – Óptica' },
      { texto: 'La cirugía refractiva tiene cobertura del 100% con profesionales de cartilla y autorización previa.', fuente: 'Servicios y cobertura – Cirugías' },
    ],
    fuentes: [osdeFuente('Óptica', 'optica'), osdeFuente('Cirugías', 'cirugias')],
    planCta: '410',
  },
  {
    tema: 'implantes-dentales',
    temaNombre: 'Implantes dentales',
    prepagaSlug: 'osde',
    prepagaNombre: 'OSDE',
    pregunta: '¿OSDE cubre implantes dentales?',
    title: '¿OSDE cubre implantes dentales? Qué planes los incluyen (2026)',
    description: 'Implantes dentales en OSDE: cobertura en los planes 410, 450 y 510 con prestadores contratados, con tope anual por beneficiario. Prótesis en todos los planes binarios. Datos oficiales de OSDE.',
    keywords: ['osde cubre implantes dentales', 'osde implantes', 'osde 410 cubre implantes dentales', 'osde protesis dental'],
    respuesta: 'Sí, en los planes 410, 450 y 510: cobertura en implantes con prestadores contratados, con tope por año calendario y por beneficiario. Las prótesis dentales tienen cobertura en todos los planes binarios.',
    planes: [
      OS('210', ['210'], false, 'Solo prótesis'),
      OS('310', ['310'], false, 'Solo prótesis'),
      OS('410', ['410'], true, 'Con tope anual'),
      OS('450', [], true, 'Con tope anual'),
      OS('510', ['510'], true, 'Con tope anual'),
      OS_SIN('Flux', ['flux']),
    ],
    detalles: [
      { texto: 'Con un profesional de la cartilla, el socio abona una diferencia solo si el tratamiento supera el tope anual. Los topes no son acumulativos y se renuevan el 1° de enero.', fuente: 'Servicios y cobertura – Prótesis' },
    ],
    fuentes: [osdeFuente('Prótesis', 'protesis')],
    planCta: '410',
  },
  {
    tema: 'odontologia',
    temaNombre: 'Odontología',
    prepagaSlug: 'osde',
    prepagaNombre: 'OSDE',
    pregunta: '¿Qué cubre OSDE en odontología?',
    title: 'OSDE odontología: qué cubre el 210, 310, 410 y 510 (2026)',
    description: 'Odontología en OSDE: cobertura al 100% con prestadores contratados en consultas, endodoncia, cirugía bucal, radiología, odontopediatría y periodoncia en los planes binarios. Datos oficiales de OSDE.',
    keywords: ['osde cobertura odontologica', 'osde odontologia', 'osde 210 que cubre en odontologia', 'osde 310 que cubre en odontologia'],
    respuesta: 'Los planes binarios (210, 310, 410, 450 y 510) cubren al 100%, con prestadores contratados, consultas, endodoncia, cirugía bucal, radiología, odontopediatría, periodoncia y más. La ortodoncia y los implantes dependen del plan.',
    planes: [
      OS('210', ['210'], true, '100% con prestadores contratados'),
      OS('310', ['310'], true, '100% con prestadores contratados'),
      OS('410', ['410'], true, '100% con prestadores contratados'),
      OS('450', [], true, '100% con prestadores contratados'),
      OS('510', ['510'], true, '100% con prestadores contratados'),
      OS_SIN('Flux', ['flux']),
    ],
    detalles: [
      { texto: 'Ortodoncia: de 8 a 18 años en 210 y 310; un tratamiento de por vida en 410, 450 y 510.', fuente: 'Servicios y cobertura – Ortodoncia' },
      { texto: 'Implantes: planes 410, 450 y 510, con tope anual. Prótesis: todos los planes binarios.', fuente: 'Servicios y cobertura – Prótesis' },
    ],
    fuentes: [osdeFuente('Odontología general', 'odontologia-general'), osdeFuente('Prótesis', 'protesis')],
    planCta: '210',
  },
  {
    tema: 'cirugia-estetica',
    temaNombre: 'Cirugía estética',
    prepagaSlug: 'osde',
    prepagaNombre: 'OSDE',
    pregunta: '¿OSDE cubre cirugía estética?',
    title: '¿OSDE cubre cirugía estética? Cada cuánto en 410, 450 y 510 (2026)',
    description: 'Cirugía estética bonificada en OSDE: una cada 3 años en el 410, una cada 2 años en el 450 y una por año en el 510, para cada integrante del grupo familiar. Datos oficiales de OSDE.',
    keywords: ['osde cubre cirugia estetica', 'osde cirugia estetica', 'osde 510 cirugia estetica', 'osde 450 cirugía estética'],
    respuesta: 'Sí, bonificada en los planes 410, 450 y 510, para cada integrante del grupo familiar: una cada 3 años calendario en el 410, una cada 2 años en el 450 y una por año en el 510.',
    planes: [
      OS('210', ['210'], false),
      OS('310', ['310'], false),
      OS('410', ['410'], true, '1 cada 3 años calendario'),
      OS('450', [], true, '1 cada 2 años calendario'),
      OS('510', ['510'], true, '1 por año calendario'),
      OS_SIN('Flux', ['flux']),
    ],
    detalles: [
      { texto: 'Para cada integrante del grupo familiar.', fuente: 'Servicios y cobertura – Cirugías' },
    ],
    fuentes: [osdeFuente('Cirugías', 'cirugias')],
    planCta: '410',
  },
  {
    tema: 'anticonceptivos',
    temaNombre: 'Anticonceptivos',
    prepagaSlug: 'osde',
    prepagaNombre: 'OSDE',
    pregunta: '¿OSDE cubre anticonceptivos?',
    title: '¿OSDE cubre anticonceptivos? Cobertura al 100% y cómo pedirla (2026)',
    description: 'OSDE cubre al 100% anticonceptivos orales, DIU, espermicidas, diafragmas y preservativos. Para los orales, parches y anillos hay que empadronarse una vez al año. Datos oficiales de OSDE.',
    keywords: ['osde anticonceptivos', 'osde cubre anticonceptivos', 'osde pastillas anticonceptivas', 'osde diu'],
    respuesta: 'Sí, al 100%: anticonceptivos orales, intrauterinos (DIU), espermicidas, diafragmas y preservativos. Para los orales, parches y anillos vaginales hay que empadronarse una vez por año en la app o en Gestiones online.',
    planes: [
      OS('Todos los planes', ['210', '310', '410', '510', 'flux'], true, '100%'),
    ],
    detalles: [
      { texto: 'El empadronamiento anual se hace desde la app OSDE (Trámites > Gestiones médicas > Anticonceptivos) o en la web (Gestiones online).', fuente: 'Servicios y cobertura – Anticonceptivos' },
      { texto: 'Los preservativos se cubren por reintegro, con el ticket o factura de una farmacia de la cartilla.', fuente: 'Servicios y cobertura – Anticonceptivos' },
    ],
    fuentes: [osdeFuente('Anticonceptivos', 'anticonceptivos')],
    planCta: '210',
  },
  {
    tema: 'medicamentos',
    temaNombre: 'Medicamentos',
    prepagaSlug: 'osde',
    prepagaNombre: 'OSDE',
    pregunta: '¿Cuánto cubre OSDE en medicamentos?',
    title: 'OSDE medicamentos: 40% de descuento en farmacias adheridas (2026)',
    description: 'OSDE cubre el 40% en medicamentos recetados en su red de farmacias adheridas. No cubre venta libre, preparados, recetas magistrales ni cosméticos. Datos oficiales de OSDE.',
    keywords: ['osde cobertura medicamentos', 'osde medicamentos', 'osde descuento farmacia', 'osde farmacias'],
    respuesta: 'El 40% en medicamentos recetados en la red de farmacias adheridas (receta, credencial y DNI), y el 70% en ciertos medicamentos para patologías crónicas. Los de venta libre, preparados, recetas magistrales o con fines cosméticos no tienen cobertura.',
    planes: [
      OS('Todos los planes', ['210', '310', '410', '510', 'flux'], true, '40% en farmacias adheridas'),
    ],
    detalles: [
      { texto: 'Las recetas vencen a los 30 días desde el inicio de su vigencia; solo el médico tratante puede extenderla.', fuente: 'Servicios y cobertura – Medicamentos ambulatorios' },
      { texto: 'Hasta tres medicamentos por receta.', fuente: 'Servicios y cobertura – Medicamentos ambulatorios' },
      { texto: 'Ciertos medicamentos de uso permanente para patologías crónicas tienen 70% de descuento en farmacias adheridas (Resolución 310/04), completando un formulario en Gestiones online o la app.', fuente: 'Servicios y cobertura – Medicamentos para patologías crónicas' },
    ],
    fuentes: [osdeFuente('Medicamentos ambulatorios', 'medicamentos-ambulatorios'), osdeFuente('Medicamentos para patologías crónicas', 'medicamentos-para-patologias-cronicas')],
    planCta: '210',
  },
]

export const coberturasMarca: CoberturaMarca[] = [...swiss, ...avalian, ...premedic, ...osde]

export function getCoberturaMarca(tema: string, prepagaSlug: string): CoberturaMarca | undefined {
  return coberturasMarca.find((c) => c.tema === tema && c.prepagaSlug === prepagaSlug)
}
