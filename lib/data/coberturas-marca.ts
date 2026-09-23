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
// Los planes de Avalian en lib/data/prepagas.ts no coinciden con los reales
// (pendiente de precios de Darío), por eso planSlugs va vacío.
const AVALIAN_FICHAS: FuenteCobertura = { nombre: 'Planes publicados en el cotizador online de Avalian', fecha: 'septiembre 2026', url: 'https://compraonline.avalian.com/cotizacion' }
const AVALIAN_DIAGRAMA: FuenteCobertura = { nombre: 'Diagrama de cobertura de los planes Integral, Superior y Selecta (publicado en el cotizador online de Avalian)', fecha: 'septiembre 2026', url: 'https://compraonline.avalian.com/cotizacion' }

const AV = (plan: string, incluido: boolean, detalle?: string): PlanCobertura => ({ plan, planSlugs: [], incluido, detalle })

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

export const coberturasMarca: CoberturaMarca[] = [...swiss, ...avalian]

export function getCoberturaMarca(tema: string, prepagaSlug: string): CoberturaMarca | undefined {
  return coberturasMarca.find((c) => c.tema === tema && c.prepagaSlug === prepagaSlug)
}
