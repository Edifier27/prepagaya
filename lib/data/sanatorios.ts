import { provinciasSEO } from './zonas'

export interface PlanCubre {
  prepagaSlug: string
  prepagaNombre: string
  planSlug: string
  planNombre: string
  precio: number
  nota?: string
}

export interface Sanatorio {
  slug: string
  nombre: string
  aliases: string[]
  zonas: string[]
  planesQueLoCubren: PlanCubre[]
}

// ─── Red de referencia por provincia ───────────────────────────────────────
// Nivel de certeza DISTINTO al de `sanatorios` de arriba: acá sabemos que el
// sanatorio existe y es relevante en la zona (aporte directo del equipo de
// PrepagaYa), pero NO tenemos verificado qué plan puntual de qué prepaga lo
// cubre. Por eso se muestra en el popup de Cartilla como "red de referencia"
// con aclaración de que hay que confirmar con la prepaga, nunca como
// "tu plan cubre esto". No mezclar con `planesQueLoCubren`.
export const REFERENCIA_POR_ZONA: Record<string, string[]> = {
  caba: [
    'Hospital Italiano de Buenos Aires', 'Hospital Alemán', 'Sanatorio Otamendi', 'Sanatorio Mater Dei',
    'Sanatorio de la Trinidad Palermo', 'Sanatorio de la Trinidad Mitre', 'Sanatorio Anchorena', 'CEMIC',
    'FLENI', 'Instituto Alexander Fleming', 'Sanatorio Los Arcos', 'Sanatorio Güemes', 'Clínica Bazterrica',
    'Sanatorio Finochietto', 'Sanatorio de la Providencia',
  ],
  // Lista plana — SOLO lo que todavía no tiene página de localidad propia en
  // el silo (lib/data/zonas.ts). Lo que ya está cubierto ahí (San Isidro,
  // Vicente López, Lomas de Zamora, Quilmes, Adrogué, Ramos Mejía/San Justo,
  // Morón, La Plata, Bahía Blanca) se sacó de acá para que buscarSanatorioReferencia()
  // no muestre el mismo centro dos veces con redacción distinta. Para mostrar
  // en el popup se usa REFERENCIA_GBA_SUBZONAS, agrupada.
  'buenos-aires': [
    'Clínica Espora (Quilmes)', 'Clínica Monte Grande',
    'DIM (Diagnóstico e Imágenes Médicas)', 'CEPEM',
    'Sanatorio Central Emhsa (Mar del Plata)', 'Hospital Privado de Comunidad (Mar del Plata)',
    'Sanatorio Tandil',
  ],
  cordoba: [
    'Sanatorio Allende', 'Hospital Privado Universitario de Córdoba', 'Sanatorio Aconcagua', 'Sanatorio Mayo',
    'Sanatorio Córdoba', 'Sanatorio Duarte Quirós', 'Clínica del Sol (Córdoba)', 'Sanatorio Privado Río Cuarto',
    'Instituto Médico Río Cuarto', 'Clínica Mediterránea San Martín (Villa María)',
  ],
  'la-pampa': [
    'Sanatorio Santa Rosa', 'Clínica García Salinas', 'Clínica Vivencias', 'Científica Damico',
    'Clínica Regional (Gral. Pico)', 'Clínica Argentina (Gral. Pico)', 'Instituto Cardiovascular (Gral. Pico)',
  ],
  'san-luis': [
    'Sanatorio Ramos Mejía', 'Sanatorio y Clínica Rivadavia', 'Sanatorio de la Merced', 'Clínica CERHU',
    'Clínica Privada Italia', 'Hospital Privado de la Villa (Villa Mercedes)',
  ],
  mendoza: [
    'Hospital Italiano Mendoza', 'Hospital Privado de Mendoza', 'Sanatorio Clínica de Cuyo', 'Sanatorio Fleming',
    'Clínica Santa María', 'Sanatorio Central', 'Clínica Sanatorio Mitre', 'Sanatorio Regional',
  ],
  'san-juan': [
    'Sanatorio Argentino', 'Hospital Privado (San Juan)', 'Sanatorio Mayo (San Juan)', 'Clínica Alvear',
    'Sanatorio Almirante Brown', 'Clínica Parque Universitario',
  ],
  'la-rioja': [
    'Sanatorio Rioja S.A.', 'Sanatorio del Colegio Médico', 'Maternidad Privada', 'Centro Médico Alberdi',
    'Clínica Finocchietto', 'Centro Privado de Maternidad y Ginecología',
  ],
  catamarca: [
    'Sanatorio Pasteur', 'Sanatorio Junín', 'Clínica Sagrado Corazón de Jesús', 'IGOM', 'IMC',
  ],
  santiago: [
    'Sanatorio Alvear', 'Sanatorio San Francisco', 'Sanatorio Norte SRL', 'Clínica Modelo', 'Clínica Privada del Norte',
  ],
  tucuman: [
    'Sanatorio 9 de Julio', 'Clínica Mayo (Tucumán)', 'Sanatorio del Norte SRL', 'Sanatorio Modelo (Tucumán)',
    'Sanatorio Parque', 'Clínica del Pilar', 'Sanatorio Rivadavia', 'Instituto de Cardiología', 'Sanatorio CIMSA',
    'Sanatorio Infantil San Lucas',
  ],
  salta: [
    'IMAC', 'Clínica Güemes', 'Hospital Privado Santa Clara de Asís', 'Sanatorio Parque (Salta)', 'Sanatorio San Roque',
    'Sanatorio El Carmen', 'Hospital Privado Tres Cerritos', 'Clínica San Rafael', 'Sanatorio Modelo S.A. (Salta)',
    'Maternidad Privada Salta',
  ],
  jujuy: [
    'Sanatorio y Clínica Lavalle', 'Sanatorio Los Lapachos', 'Sanatorio Ntra. Sra. del Rosario',
    'Clínica del Niño y del Recién Nacido', 'Sanatorio Santa María (San Pedro)', 'Clínica Ledesma (Libertador Gral. San Martín)',
  ],
  'santa-fe': [
    'Sanatorio Parque (Rosario)', 'Sanatorio Británico (Rosario)', 'Sanatorio Americano (Rosario)',
    'Sanatorio de la Mujer (Rosario)', 'Sanatorio Norte (Rosario)', 'Hospital Español (Rosario)',
    'Sanatorio Güemes (Santa Fe cap.)', 'Sanatorio San Gerónimo', 'Sanatorio Mayo (Santa Fe cap.)',
    'Sanatorio Médico Quirúrgico',
  ],
  'entre-rios': [
    'Sanatorio Río (Paraná)', 'Sanatorio La Entrerriana (Paraná)', 'Clínica Modelo (Paraná)',
    'Sanatorio Concordia', 'Instituto Médico Quirúrgico Garat (Concordia)', 'Sanatorio Cometra (Gualeguaychú)',
    'Sanatorio AGOS (Gualeguaychú)', 'Clínica Pronto (Gualeguaychú)',
  ],
  chaco: [
    'Sanatorio Güemes (Resistencia)', 'Sanatorio La Sagrada Familia', 'Sanatorio Modelo (Chaco)',
    'Sanatorio Chaco Oeste', 'Sanatorio Materno Infantil', 'Sanatorio Palacio',
  ],
  corrientes: [
    'Sanatorio del Norte (Corrientes)', 'Sanatorio del Litoral', 'Sanatorio San Juan (Corrientes)',
    'Clínica Maternal del Iberá',
  ],
  formosa: [
    'Sanatorio Formosa', 'Sanatorio González Lelong', 'Clínica Servimed', 'Clínica Neoform', 'Clínica EMI',
  ],
  misiones: [
    'Sanatorio IOT (Posadas)', 'Sanatorio Camino', 'Sanatorio Boratti', 'Sanatorio Posadas',
  ],
  neuquen: [
    'Clínica Pasteur', 'Policlínico Neuquén', 'Sanatorio San Agustín', 'Clínica Materno Infantil (CMI)',
  ],
  'rio-negro': [
    'Sanatorio San Carlos (Bariloche)', 'Hospital Privado Regional (Bariloche)', 'Sanatorio del Sol (Bariloche)',
    'Clínica Roca (Gral. Roca)', 'Sanatorio Juan XXIII (Gral. Roca)', 'Sanatorio Austral (Viedma)', 'Clínica Viedma',
  ],
  chubut: [
    'Sanatorio Asoc. Española de Socorros Mutuos (Comodoro Rivadavia)', 'Sanatorio Prosalud Austral',
    'Sanatorio Rivadavia (Chubut)', 'Clínica del Valle (Chubut)', 'Sanatorio Trelew', 'Sanatorio de la Ciudad (Pto. Madryn)',
    'Clínica San Camilo (Pto. Madryn)',
  ],
  'santa-cruz': [
    'Sanatorio San Juan Bosco (Río Gallegos)', 'Medisur Policlínico del Atlántico', 'Sanatorio Integral San Benito',
    'Clínica del Valle (Santa Cruz)',
  ],
  'tierra-fuego': [
    'Clínica/Sanatorio San Jorge (Ushuaia)', 'Sanatorio Fueguino (Río Grande)', 'CEMEP (Río Grande)',
  ],
}

// El cotizador solo permite elegir "Buenos Aires (GBA/Pcia)" como una única
// zona (sin distinguir Norte/Sur/Oeste), así que el popup de Cartilla agrupa
// la referencia de GBA por sub-zona en vez de mostrarla como lista plana.
export const REFERENCIA_GBA_SUBZONAS: { subzona: string; sanatorios: string[] }[] = [
  {
    subzona: 'GBA Norte',
    sanatorios: [
      'Clínica Olivos', 'Sanatorio Las Lomas', 'Sanatorio San Lucas', 'Sanatorio de la Trinidad San Isidro',
      'Hospital Universitario Austral',
    ],
  },
  {
    subzona: 'GBA Sur',
    sanatorios: [
      'Sanatorio Juncal', 'IMA (Instituto Médico de Adrogué)', 'Clínica Espora', 'Clínica Monte Grande',
      'SMG Center Lomas de Zamora', 'Sanatorio de la Trinidad Quilmes', 'Sanatorio Modelo Quilmes',
    ],
  },
  {
    subzona: 'GBA Oeste',
    sanatorios: [
      'Sanatorio de la Trinidad Ramos Mejía', 'Hospital Italiano (San Justo)', 'Casa Hospital San Juan de Dios',
      'DIM (Diagnóstico e Imágenes Médicas)', 'CEPEM', 'Clínica Modelo de Morón',
    ],
  },
  {
    subzona: 'Buenos Aires — interior y costa',
    sanatorios: [
      'Sanatorio Central Emhsa (Mar del Plata)', 'Hospital Privado de Comunidad (Mar del Plata)',
      'Hospital Privado del Sur (Bahía Blanca)', 'Hospital Italiano de La Plata', 'Sanatorio Tandil',
    ],
  },
]

// Swiss Medical tiene una red propia de más de 30 SMG Center: centros de
// atención exclusivos para socios en todo el país, con turnos más rápidos
// que la cartilla general. No listamos ubicaciones puntuales por ciudad
// porque no tenemos ese detalle verificado — es un dato general de la marca.
export const SMG_CENTER_NOTA = 'Swiss Medical suma más de 30 SMG Center: centros de atención propios y exclusivos para socios, con acceso a turnos más rápidos que en el resto de la cartilla.'

// ─── Laboratorios de referencia ────────────────────────────────────────────
// Mismo nivel de certeza que REFERENCIA_POR_ZONA: son redes de diagnóstico
// reales y relevantes en la zona (verificadas por búsqueda, no inventadas),
// pero no tenemos mapeado qué plan puntual de qué prepaga las incluye. Solo
// cargamos zonas donde identificamos una red claramente dominante — el resto
// usa LABORATORIOS_NOTA_GENERICA para no inventar nombres sin verificar.
export const REFERENCIA_LABORATORIOS_POR_ZONA: Record<string, string[]> = {
  caba: ['Stamboulian (laboratorio y vacunatorio)', 'Diagnóstico Maipú (laboratorio e imágenes)'],
  'buenos-aires': ['Diagnóstico Maipú (laboratorio e imágenes, CABA y zona norte)', 'Stamboulian (laboratorio y vacunatorio)'],
}

export const LABORATORIOS_NOTA_GENERICA = 'La mayoría de las prepagas también dan cobertura en laboratorios y centros de diagnóstico por imágenes de la zona, con turno directo. Confirmá el listado exacto en tu cartilla.'

export interface UpsellSwissMedical {
  sanatorio: Sanatorio
  planSwissMedical: PlanCubre
}

// Sanatorios que SÍ están en la cartilla de algún plan de Swiss Medical pero
// NO en la del plan que se está mirando — para motivar el cambio con un dato
// real y puntual ("lo tenés si pasás a Swiss Medical"), nunca inventado.
// Igual que sanatoriosDePlan, solo funciona en zonas con data granular
// verificada (ZONA_SANATORIO): fuera de esas zonas devuelve [] a propósito.
export function upsellSwissMedical(prepagaSlug: string, planSlug: string, zonaKey?: string): UpsellSwissMedical[] {
  if (prepagaSlug === 'swiss-medical') return []
  const zonasLocales = zonaKey ? (ZONA_SANATORIO[zonaKey] ?? []) : []
  if (zonasLocales.length === 0) return []

  const resultados: UpsellSwissMedical[] = []
  for (const s of sanatorios) {
    if (!s.zonas.some((z) => zonasLocales.includes(z))) continue
    const yaLoCubreElPlanActual = s.planesQueLoCubren.some(
      (p) => p.prepagaSlug === prepagaSlug && p.planSlug === planSlug
    )
    if (yaLoCubreElPlanActual) continue
    const planesSwiss = s.planesQueLoCubren.filter((p) => p.prepagaSlug === 'swiss-medical')
    if (planesSwiss.length === 0) continue
    const planMasBarato = planesSwiss.reduce((min, p) => (p.precio < min.precio ? p : min), planesSwiss[0])
    resultados.push({ sanatorio: s, planSwissMedical: planMasBarato })
  }
  return resultados
}

// Los 10 planes de Swiss Medical, presentes en las 3 cartillas (Nubial,
// Global, Premium) según los anexos oficiales vigentes 09/2026 — para
// sanatorios propios que están incluidos en todos los planes sin excepción.
const PLANES_SWISS_MEDICAL_TODOS: PlanCubre[] = [
  { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's1', planNombre: 'Plan S1', precio: 197336 },
  { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg02', planNombre: 'Plan SMG02', precio: 277558 },
  { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's2', planNombre: 'Plan S2', precio: 247743 },
  { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 346404 },
  { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-s', planNombre: 'Plan Sport-S', precio: 307805 },
  { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport', planNombre: 'Plan Sport', precio: 405293 },
  { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 397934 },
  { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 415914 },
  { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg50', planNombre: 'Plan SMG50', precio: 519697 },
  { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-plus', planNombre: 'Plan Sport+', precio: 474143 },
]

// Los mismos planes de arriba, pero sin S1/SMG02 (cartilla Nubial) — para
// sanatorios que la cartilla oficial confirma que arrancan desde S2/SMG20
// (cartilla Global). Corregido 22-sep-2026 contra los PDF oficiales
// SMMP-GLOBAL/PREMIUM-CAP-Y-GBA que pasó Darío: Suizo Argentina, Sanatorio
// de los Arcos, Clínica Zabala y Sanatorio Agote NO aparecen en el PDF
// Nubial (SMMP-NUBIAL-QUALITY-CAP-Y-GBA) — el dato anterior de "incluido en
// todos los planes, incluso los de entrada" no estaba verificado y era
// incorrecto para estos cuatro en particular.
const PLANES_SWISS_MEDICAL_DESDE_S2: PlanCubre[] = PLANES_SWISS_MEDICAL_TODOS.filter(
  (p) => p.planSlug !== 's1' && p.planSlug !== 'smg02'
)

export const sanatorios: Sanatorio[] = [
  {
    slug: 'clinica-suizo-argentina',
    nombre: 'Clínica y Maternidad Suizo Argentina',
    aliases: ['suizo argentina', 'clinica suizo argentina', 'clínica suizo argentina'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { ...PLANES_SWISS_MEDICAL_DESDE_S2[0], nota: 'No incluido en S1/SMG02 (cartilla Nubial). Suma desde S2/SMG20 (cartilla Global).' },
      ...PLANES_SWISS_MEDICAL_DESDE_S2.slice(1),
    ],
  },
  {
    slug: 'sanatorio-los-arcos',
    nombre: 'Sanatorio de los Arcos',
    aliases: ['los arcos', 'sanatorio de los arcos', 'sanatorio los arcos'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { ...PLANES_SWISS_MEDICAL_DESDE_S2[0], nota: 'No incluido en S1/SMG02 (cartilla Nubial). Suma desde S2/SMG20 (cartilla Global).' },
      ...PLANES_SWISS_MEDICAL_DESDE_S2.slice(1),
    ],
  },
  {
    slug: 'clinica-zabala',
    nombre: 'Clínica Zabala',
    aliases: ['zabala', 'clinica zabala', 'clínica zabala'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { ...PLANES_SWISS_MEDICAL_DESDE_S2[0], nota: 'No incluido en S1/SMG02 (cartilla Nubial). Suma desde S2/SMG20 (cartilla Global).' },
      ...PLANES_SWISS_MEDICAL_DESDE_S2.slice(1),
    ],
  },
  {
    slug: 'sanatorio-agote',
    nombre: 'Sanatorio Agote',
    aliases: ['agote', 'sanatorio agote'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { ...PLANES_SWISS_MEDICAL_DESDE_S2[0], nota: 'No incluido en S1/SMG02 (cartilla Nubial). Suma desde S2/SMG20 (cartilla Global).' },
      ...PLANES_SWISS_MEDICAL_DESDE_S2.slice(1),
    ],
  },
  {
    slug: 'clinica-olivos',
    nombre: 'Clínica Olivos',
    aliases: ['olivos', 'clinica olivos', 'clínica olivos'],
    zonas: ['gba'],
    planesQueLoCubren: [
      { ...PLANES_SWISS_MEDICAL_TODOS[0], nota: 'Sanatorio propio de Swiss Medical (zona norte de GBA) — incluido en todos los planes, incluso los de entrada.' },
      ...PLANES_SWISS_MEDICAL_TODOS.slice(1),
    ],
  },
  {
    slug: 'sanatorio-las-lomas',
    nombre: 'Sanatorio Las Lomas',
    aliases: ['las lomas', 'sanatorio las lomas'],
    zonas: ['gba'],
    planesQueLoCubren: [
      { ...PLANES_SWISS_MEDICAL_TODOS[0], nota: 'Zona norte de GBA (San Isidro) — incluido en todos los planes de Swiss Medical, incluso los de entrada.' },
      ...PLANES_SWISS_MEDICAL_TODOS.slice(1),
    ],
  },
  {
    slug: 'sanatorio-san-lucas',
    nombre: 'Sanatorio San Lucas',
    aliases: ['san lucas', 'sanatorio san lucas'],
    zonas: ['gba'],
    planesQueLoCubren: [
      { ...PLANES_SWISS_MEDICAL_TODOS[0], nota: 'Zona norte de GBA (San Isidro) — incluido en todos los planes de Swiss Medical, incluso los de entrada.' },
      ...PLANES_SWISS_MEDICAL_TODOS.slice(1),
    ],
  },
  {
    slug: 'hospital-italiano',
    nombre: 'Hospital Italiano',
    aliases: ['italiano', 'hospital italiano de buenos aires', 'hiba'],
    zonas: ['caba', 'gba'],
    planesQueLoCubren: [
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310, nota: 'Sacado del Plan 210 en agosto 2024. Requiere 310 mínimo.' },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '410', planNombre: 'Plan 410', precio: 459250 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '510', planNombre: 'Plan 510', precio: 1139396 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's2', planNombre: 'Plan S2', precio: 247743, nota: 'No incluido en S1/SMG02 (cartilla Nubial). Suma desde S2/SMG20 (cartilla Global).' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 346404 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-s', planNombre: 'Plan Sport-S', precio: 307805 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport', planNombre: 'Plan Sport', precio: 405293 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 397934 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 415914 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg50', planNombre: 'Plan SMG50', precio: 519697 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-plus', planNombre: 'Plan Sport+', precio: 474143 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'plata', planNombre: 'Plan Plata', precio: 309892, nota: 'Con reintegros desde Plan Plata.' },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'oro', planNombre: 'Plan Oro', precio: 393744 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'platinum', planNombre: 'Plan Platinum', precio: 478050 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'celeste', planNombre: 'Plan Celeste', precio: 399484 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'azul', planNombre: 'Plan Azul', precio: 490333 },
    ],
  },
  {
    slug: 'hospital-aleman',
    nombre: 'Hospital Alemán',
    aliases: ['aleman', 'alemán', 'hospital alemán'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310, nota: 'No incluido en Plan 210.' },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '410', planNombre: 'Plan 410', precio: 459250 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '510', planNombre: 'Plan 510', precio: 1139396 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 397934, nota: 'Suma desde SMG30 (cartilla Premium). No en S1/S2/SMG20 ni en la línea Sport-S/Sport (cartilla Global).' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 415914 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg50', planNombre: 'Plan SMG50', precio: 519697 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-plus', planNombre: 'Plan Sport+', precio: 474143 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'plata', planNombre: 'Plan Plata', precio: 309892 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'oro', planNombre: 'Plan Oro', precio: 393744 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'celeste', planNombre: 'Plan Celeste', precio: 399484 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'azul', planNombre: 'Plan Azul', precio: 490333 },
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'plan-3000', planNombre: 'Plan 3000', precio: 466900 },
    ],
  },
  {
    slug: 'fleni',
    nombre: 'FLENI',
    aliases: ['fleni', 'fundación fleni'],
    zonas: ['caba', 'gba'],
    planesQueLoCubren: [
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '210', planNombre: 'Plan 210', precio: 267250, nota: 'Solo consultas ambulatorias. Internación desde Plan 310.' },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310, nota: 'Internación completa desde Plan 310.' },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '410', planNombre: 'Plan 410', precio: 459250 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '510', planNombre: 'Plan 510', precio: 1139396 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 397934, nota: 'Suma desde SMG30 (cartilla Premium).' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 415914 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg50', planNombre: 'Plan SMG50', precio: 519697 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-plus', planNombre: 'Plan Sport+', precio: 474143 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'celeste', planNombre: 'Plan Celeste', precio: 399484 },
    ],
  },
  {
    slug: 'fundacion-favaloro',
    nombre: 'Fundación Favaloro',
    aliases: ['favaloro', 'fundacion favaloro', 'fundación favaloro'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '210', planNombre: 'Plan 210', precio: 267250 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '410', planNombre: 'Plan 410', precio: 459250 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's2', planNombre: 'Plan S2', precio: 247743, nota: 'No incluido en S1/SMG02 (cartilla Nubial). Suma desde S2/SMG20 (cartilla Global).' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 346404 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-s', planNombre: 'Plan Sport-S', precio: 307805 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport', planNombre: 'Plan Sport', precio: 405293 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 397934 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 415914 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg50', planNombre: 'Plan SMG50', precio: 519697 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-plus', planNombre: 'Plan Sport+', precio: 474143 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'celeste', planNombre: 'Plan Celeste', precio: 399484 },
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'plan-1000', planNombre: 'Plan 1000', precio: 369200 },
    ],
  },
  {
    slug: 'sanatorio-otamendi',
    nombre: 'Sanatorio Otamendi',
    aliases: ['otamendi', 'sanatorio otamendi'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's2', planNombre: 'Plan S2', precio: 247743, nota: 'No incluido en S1/SMG02 (cartilla Nubial). Suma desde S2/SMG20 (cartilla Global).' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 346404 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-s', planNombre: 'Plan Sport-S', precio: 307805 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport', planNombre: 'Plan Sport', precio: 405293 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 397934 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 415914 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg50', planNombre: 'Plan SMG50', precio: 519697 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-plus', planNombre: 'Plan Sport+', precio: 474143 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'celeste', planNombre: 'Plan Celeste', precio: 399484 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'azul', planNombre: 'Plan Azul', precio: 490333 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '210', planNombre: 'Plan 210', precio: 267250 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310 },
    ],
  },
  {
    slug: 'sanatorio-mater-dei',
    nombre: 'Sanatorio Mater Dei',
    aliases: ['mater dei', 'materdei'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '410', planNombre: 'Plan 410', precio: 459250 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's1', planNombre: 'Plan S1', precio: 197336, nota: 'Incluido en todos los planes de Swiss Medical, incluso los de entrada (cartilla Nubial).' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg02', planNombre: 'Plan SMG02', precio: 277558 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's2', planNombre: 'Plan S2', precio: 247743 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 346404 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-s', planNombre: 'Plan Sport-S', precio: 307805 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport', planNombre: 'Plan Sport', precio: 405293 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 397934 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 415914 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg50', planNombre: 'Plan SMG50', precio: 519697 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-plus', planNombre: 'Plan Sport+', precio: 474143 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'bronce', planNombre: 'Plan Bronce', precio: 240360 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'plata', planNombre: 'Plan Plata', precio: 309892 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'celeste', planNombre: 'Plan Celeste', precio: 399484 },
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'plan-1000', planNombre: 'Plan 1000', precio: 369200 },
      { prepagaSlug: 'omint', prepagaNombre: 'Omint', planSlug: 'global', planNombre: 'Plan Global', precio: 437027 },
    ],
  },
  {
    slug: 'hospital-britanico',
    nombre: 'Hospital Británico',
    aliases: ['britanico', 'británico', 'hospital britanico'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '210', planNombre: 'Plan 210', precio: 267250 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's1', planNombre: 'Plan S1', precio: 197336, nota: 'Incluido en todos los planes de Swiss Medical, incluso los de entrada (cartilla Nubial).' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg02', planNombre: 'Plan SMG02', precio: 277558 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's2', planNombre: 'Plan S2', precio: 247743 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 346404 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-s', planNombre: 'Plan Sport-S', precio: 307805 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport', planNombre: 'Plan Sport', precio: 405293 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 397934 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 415914 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg50', planNombre: 'Plan SMG50', precio: 519697 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-plus', planNombre: 'Plan Sport+', precio: 474143 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'celeste', planNombre: 'Plan Celeste', precio: 399484 },
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'plan-1000', planNombre: 'Plan 1000', precio: 369200 },
    ],
  },
  // ─── Cartilla real de Swiss Medical, Capital Federal (archivos oficiales
  // SMMP-NUBIAL/GLOBAL/PREMIUM-CAP-Y-GBA que pasó Darío, 22-sep-2026) ───────
  // Nubial = S1/SMG02 (tier de entrada). Global = S2/SMG20/Sport-S/Sport.
  // Premium = SMG30/SMG40/SMG50/Sport+ (superset de Global). Los que
  // aparecen en el PDF Nubial tienen cobertura desde S1; el resto recién
  // desde S2 — mismo patrón que ya tenían cargados Hospital Italiano/
  // Favaloro (desde S2) vs Hospital Británico/Mater Dei (desde S1).
  {
    slug: 'cemic-almagro',
    nombre: 'CEMIC',
    aliases: ['cemic', 'cemic almagro'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's1', planNombre: 'Plan S1', precio: 197336, nota: 'Incluido desde el plan de entrada (cartilla Nubial).' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg02', planNombre: 'Plan SMG02', precio: 277558 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's2', planNombre: 'Plan S2', precio: 247743 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 346404 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-s', planNombre: 'Plan Sport-S', precio: 307805 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport', planNombre: 'Plan Sport', precio: 405293 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 397934 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 415914 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg50', planNombre: 'Plan SMG50', precio: 519697 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-plus', planNombre: 'Plan Sport+', precio: 474143 },
    ],
  },
  {
    slug: 'clinica-la-sagrada-familia',
    nombre: 'Clínica La Sagrada Familia',
    aliases: ['sagrada familia', 'clinica la sagrada familia'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's1', planNombre: 'Plan S1', precio: 197336, nota: 'Incluido desde el plan de entrada (cartilla Nubial).' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg02', planNombre: 'Plan SMG02', precio: 277558 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's2', planNombre: 'Plan S2', precio: 247743 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 346404 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-s', planNombre: 'Plan Sport-S', precio: 307805 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport', planNombre: 'Plan Sport', precio: 405293 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 397934 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 415914 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg50', planNombre: 'Plan SMG50', precio: 519697 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-plus', planNombre: 'Plan Sport+', precio: 474143 },
    ],
  },
  {
    slug: 'clinica-medica-adventista-belgrano',
    nombre: 'Clínica Médica Adventista Belgrano',
    aliases: ['adventista belgrano', 'clinica medica adventista belgrano'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's1', planNombre: 'Plan S1', precio: 197336, nota: 'Incluido desde el plan de entrada (cartilla Nubial).' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg02', planNombre: 'Plan SMG02', precio: 277558 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's2', planNombre: 'Plan S2', precio: 247743 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 346404 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-s', planNombre: 'Plan Sport-S', precio: 307805 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport', planNombre: 'Plan Sport', precio: 405293 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 397934 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 415914 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg50', planNombre: 'Plan SMG50', precio: 519697 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-plus', planNombre: 'Plan Sport+', precio: 474143 },
    ],
  },
  {
    slug: 'instituto-arauz',
    nombre: 'Instituto Oto-Rino-Laringológico Arauz',
    aliases: ['instituto arauz', 'arauz'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's1', planNombre: 'Plan S1', precio: 197336, nota: 'Incluido desde el plan de entrada (cartilla Nubial).' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg02', planNombre: 'Plan SMG02', precio: 277558 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's2', planNombre: 'Plan S2', precio: 247743 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 346404 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-s', planNombre: 'Plan Sport-S', precio: 307805 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport', planNombre: 'Plan Sport', precio: 405293 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 397934 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 415914 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg50', planNombre: 'Plan SMG50', precio: 519697 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-plus', planNombre: 'Plan Sport+', precio: 474143 },
    ],
  },
  {
    slug: 'clinica-san-camilo',
    nombre: 'Clínica San Camilo',
    aliases: ['san camilo', 'clinica san camilo'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's1', planNombre: 'Plan S1', precio: 197336, nota: 'Incluido desde el plan de entrada (cartilla Nubial).' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg02', planNombre: 'Plan SMG02', precio: 277558 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's2', planNombre: 'Plan S2', precio: 247743 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 346404 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-s', planNombre: 'Plan Sport-S', precio: 307805 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport', planNombre: 'Plan Sport', precio: 405293 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 397934 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 415914 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg50', planNombre: 'Plan SMG50', precio: 519697 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-plus', planNombre: 'Plan Sport+', precio: 474143 },
    ],
  },
  {
    slug: 'icba',
    nombre: 'ICBA Instituto Cardiovascular de Buenos Aires',
    aliases: ['icba', 'instituto cardiovascular de buenos aires'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's1', planNombre: 'Plan S1', precio: 197336, nota: 'Incluido desde el plan de entrada (cartilla Nubial).' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg02', planNombre: 'Plan SMG02', precio: 277558 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's2', planNombre: 'Plan S2', precio: 247743 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 346404 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-s', planNombre: 'Plan Sport-S', precio: 307805 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport', planNombre: 'Plan Sport', precio: 405293 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 397934 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 415914 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg50', planNombre: 'Plan SMG50', precio: 519697 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-plus', planNombre: 'Plan Sport+', precio: 474143 },
    ],
  },
  {
    slug: 'instituto-dupuytren',
    nombre: 'Instituto Dupuytren de Traumatología y Ortopedia',
    aliases: ['dupuytren', 'instituto dupuytren'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's1', planNombre: 'Plan S1', precio: 197336, nota: 'Incluido desde el plan de entrada (cartilla Nubial).' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg02', planNombre: 'Plan SMG02', precio: 277558 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's2', planNombre: 'Plan S2', precio: 247743 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 346404 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-s', planNombre: 'Plan Sport-S', precio: 307805 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport', planNombre: 'Plan Sport', precio: 405293 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 397934 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 415914 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg50', planNombre: 'Plan SMG50', precio: 519697 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-plus', planNombre: 'Plan Sport+', precio: 474143 },
    ],
  },
  {
    slug: 'sanatorio-de-la-trinidad-palermo',
    nombre: 'Sanatorio de la Trinidad Palermo',
    aliases: ['trinidad palermo', 'sanatorio trinidad', 'sanatorio de la trinidad'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's1', planNombre: 'Plan S1', precio: 197336, nota: 'Incluido desde el plan de entrada (cartilla Nubial).' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg02', planNombre: 'Plan SMG02', precio: 277558 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's2', planNombre: 'Plan S2', precio: 247743 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 346404 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-s', planNombre: 'Plan Sport-S', precio: 307805 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport', planNombre: 'Plan Sport', precio: 405293 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 397934 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 415914 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg50', planNombre: 'Plan SMG50', precio: 519697 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-plus', planNombre: 'Plan Sport+', precio: 474143 },
    ],
  },
  {
    slug: 'sanatorio-anchorena',
    nombre: 'Sanatorio Anchorena',
    aliases: ['anchorena', 'sanatorio anchorena'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's1', planNombre: 'Plan S1', precio: 197336, nota: 'Incluido desde el plan de entrada (cartilla Nubial).' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg02', planNombre: 'Plan SMG02', precio: 277558 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's2', planNombre: 'Plan S2', precio: 247743 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 346404 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-s', planNombre: 'Plan Sport-S', precio: 307805 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport', planNombre: 'Plan Sport', precio: 405293 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 397934 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 415914 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg50', planNombre: 'Plan SMG50', precio: 519697 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-plus', planNombre: 'Plan Sport+', precio: 474143 },
    ],
  },
  {
    slug: 'alexander-fleming',
    nombre: 'Alexander Fleming - Instituto Médico Especializado',
    aliases: ['alexander fleming', 'instituto fleming'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's2', planNombre: 'Plan S2', precio: 247743, nota: 'No incluido en S1/SMG02 (cartilla Nubial). Suma desde S2/SMG20 (cartilla Global).' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 346404 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-s', planNombre: 'Plan Sport-S', precio: 307805 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport', planNombre: 'Plan Sport', precio: 405293 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 397934 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 415914 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg50', planNombre: 'Plan SMG50', precio: 519697 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-plus', planNombre: 'Plan Sport+', precio: 474143 },
    ],
  },
  {
    slug: 'sanatorio-de-la-providencia',
    nombre: 'Sanatorio de la Providencia',
    aliases: ['sanatorio de la providencia', 'la providencia'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's2', planNombre: 'Plan S2', precio: 247743, nota: 'No incluido en S1/SMG02 (cartilla Nubial). Suma desde S2/SMG20 (cartilla Global).' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 346404 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-s', planNombre: 'Plan Sport-S', precio: 307805 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport', planNombre: 'Plan Sport', precio: 405293 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 397934 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 415914 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg50', planNombre: 'Plan SMG50', precio: 519697 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-plus', planNombre: 'Plan Sport+', precio: 474143 },
    ],
  },
  {
    slug: 'sanatorio-finochietto',
    nombre: 'Sanatorio Finochietto',
    aliases: ['sanatorio finochietto', 'finochietto'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's2', planNombre: 'Plan S2', precio: 247743, nota: 'No incluido en S1/SMG02 (cartilla Nubial). Suma desde S2/SMG20 (cartilla Global).' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 346404 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-s', planNombre: 'Plan Sport-S', precio: 307805 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport', planNombre: 'Plan Sport', precio: 405293 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 397934 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 415914 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg50', planNombre: 'Plan SMG50', precio: 519697 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-plus', planNombre: 'Plan Sport+', precio: 474143 },
    ],
  },
  {
    slug: 'instituto-superior-otorrinolaringologia',
    nombre: 'Instituto Superior de Otorrinolaringología',
    aliases: ['instituto superior de otorrinolaringologia'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 's2', planNombre: 'Plan S2', precio: 247743, nota: 'No incluido en S1/SMG02 (cartilla Nubial). Suma desde S2/SMG20 (cartilla Global).' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 346404 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-s', planNombre: 'Plan Sport-S', precio: 307805 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport', planNombre: 'Plan Sport', precio: 405293 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 397934 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 415914 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg50', planNombre: 'Plan SMG50', precio: 519697 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'sport-plus', planNombre: 'Plan Sport+', precio: 474143 },
    ],
  },
  {
    slug: 'clinica-bazterrica',
    nombre: 'Clínica Bazterrica',
    aliases: ['bazterrica', 'clinica bazterrica', 'clínica bazterrica'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'omint', prepagaNombre: 'Omint', planSlug: 'smart', planNombre: 'Plan Smart', precio: 262000, nota: 'Incluido desde el plan más básico de Omint.' },
      { prepagaSlug: 'omint', prepagaNombre: 'Omint', planSlug: 'global', planNombre: 'Plan Global', precio: 437027 },
      { prepagaSlug: 'omint', prepagaNombre: 'Omint', planSlug: 'clasico', planNombre: 'Plan Clásico', precio: 568962 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310 },
    ],
  },
  {
    slug: 'clinica-del-sol',
    nombre: 'Clínica del Sol',
    aliases: ['del sol', 'clinica del sol', 'clínica del sol'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'omint', prepagaNombre: 'Omint', planSlug: 'smart', planNombre: 'Plan Smart', precio: 262000, nota: 'Sanatorio propio de Omint — incluido en todos los planes.' },
      { prepagaSlug: 'omint', prepagaNombre: 'Omint', planSlug: 'global', planNombre: 'Plan Global', precio: 437027 },
      { prepagaSlug: 'omint', prepagaNombre: 'Omint', planSlug: 'clasico', planNombre: 'Plan Clásico', precio: 568962 },
    ],
  },
  {
    slug: 'clinica-santa-isabel',
    nombre: 'Clínica Santa Isabel',
    aliases: ['santa isabel', 'clinica santa isabel', 'clínica santa isabel'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'omint', prepagaNombre: 'Omint', planSlug: 'smart', planNombre: 'Plan Smart', precio: 262000, nota: 'Sanatorio propio de Omint — incluido en todos los planes.' },
      { prepagaSlug: 'omint', prepagaNombre: 'Omint', planSlug: 'global', planNombre: 'Plan Global', precio: 437027 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'bronce', planNombre: 'Plan Bronce', precio: 240360 },
      { ...PLANES_SWISS_MEDICAL_TODOS[0], nota: 'Incluido en todos los planes de Swiss Medical, incluso los de entrada (cartilla Nubial).' },
      ...PLANES_SWISS_MEDICAL_TODOS.slice(1),
    ],
  },
  {
    slug: 'hospital-austral',
    nombre: 'Hospital Austral',
    aliases: ['austral', 'hospital universitario austral'],
    zonas: ['gba'],
    planesQueLoCubren: [
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '410', planNombre: 'Plan 410', precio: 459250 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'celeste', planNombre: 'Plan Celeste', precio: 399484 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 346404 },
    ],
  },
  {
    slug: 'sanatorio-juncal',
    nombre: 'Sanatorio Juncal',
    aliases: ['juncal', 'sanatorio juncal'],
    zonas: ['gba'],
    planesQueLoCubren: [
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'f700', planNombre: 'Plan F700', precio: 262000 },
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'plan-1000', planNombre: 'Plan 1000', precio: 369200 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '210', planNombre: 'Plan 210', precio: 267250 },
    ],
  },
  {
    slug: 'hospital-privado-cordoba',
    nombre: 'Hospital Privado Universitario Córdoba',
    aliases: ['hospital privado cordoba', 'privado cordoba', 'hospital privado de córdoba'],
    zonas: ['cordoba'],
    planesQueLoCubren: [
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 346404 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '210', planNombre: 'Plan 210', precio: 267250 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310 },
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'plan-1000', planNombre: 'Plan 1000', precio: 369200 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'bronce', planNombre: 'Plan Bronce', precio: 240360 },
    ],
  },
  {
    slug: 'sanatorio-allende-cordoba',
    nombre: 'Sanatorio Allende (Córdoba)',
    aliases: ['allende', 'sanatorio allende', 'clínica allende'],
    zonas: ['cordoba'],
    planesQueLoCubren: [
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '210', planNombre: 'Plan 210', precio: 267250 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310 },
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'f700', planNombre: 'Plan F700', precio: 262000 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'bronce', planNombre: 'Plan Bronce', precio: 240360 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 346404 },
    ],
  },
  {
    slug: 'hospital-italiano-rosario',
    nombre: 'Hospital Italiano Rosario',
    aliases: ['italiano rosario', 'hospital italiano rosario'],
    zonas: ['rosario'],
    planesQueLoCubren: [
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 346404 },
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'plan-1000', planNombre: 'Plan 1000', precio: 369200 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'bronce', planNombre: 'Plan Bronce', precio: 240360 },
    ],
  },
  {
    slug: 'sanatorio-espanol-rosario',
    nombre: 'Sanatorio Español Rosario',
    aliases: ['español rosario', 'sanatorio español', 'sanatorio español rosario'],
    zonas: ['rosario'],
    planesQueLoCubren: [
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '210', planNombre: 'Plan 210', precio: 267250 },
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'f700', planNombre: 'Plan F700', precio: 262000 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'bronce', planNombre: 'Plan Bronce', precio: 240360 },
    ],
  },
]

export function buscarSanatorio(query: string): Sanatorio[] {
  const q = query.toLowerCase().trim()
  if (q.length < 2) return []
  return sanatorios.filter(
    (s) =>
      s.nombre.toLowerCase().includes(q) ||
      s.aliases.some((a) => a.includes(q))
  )
}

const ZONA_NOMBRE: Record<string, string> = {
  caba: 'CABA', 'buenos-aires': 'Buenos Aires (GBA e interior)', cordoba: 'Córdoba',
  'la-pampa': 'La Pampa', 'san-luis': 'San Luis', mendoza: 'Mendoza', 'san-juan': 'San Juan',
  'la-rioja': 'La Rioja', catamarca: 'Catamarca', santiago: 'Santiago del Estero', tucuman: 'Tucumán',
  salta: 'Salta', jujuy: 'Jujuy', 'santa-fe': 'Santa Fe', 'entre-rios': 'Entre Ríos', chaco: 'Chaco',
  corrientes: 'Corrientes', formosa: 'Formosa', misiones: 'Misiones', neuquen: 'Neuquén',
  'rio-negro': 'Río Negro', chubut: 'Chubut', 'santa-cruz': 'Santa Cruz', 'tierra-fuego': 'Tierra del Fuego',
}

export interface SanatorioReferenciaResult {
  nombre: string
  zonaKey: string
  zonaNombre: string
  /** Ruta a la página más específica que tenemos: partido/localidad si hay
   *  match ahí, si no la provincia/zona genérica. Siempre empieza con /prepagas/. */
  href: string
}

// Busca primero en las localidades del silo (lib/data/zonas.ts): son más
// precisas que REFERENCIA_POR_ZONA porque ya están mapeadas a un partido
// puntual (ej. "SMG Center Lomas de Zamora" -> /prepagas/buenos-aires/lomas-de-zamora
// en vez de al hub genérico de la provincia). Si no hay match ahí, cae a
// REFERENCIA_POR_ZONA (24 provincias, sin verificación por plan) para que el
// buscador no devuelva "no encontrado" en sanatorios reales que ya
// identificamos pero no tenemos mapeados a un plan puntual. Se muestra
// siempre con la aclaración de "confirmá con la prepaga" — nunca como
// planesQueLoCubren.
//
// Si la búsqueda ya matcheó algo verificado (buscarSanatorio, con plan y
// precio real), no mostramos referencia para la misma consulta: mostrar un
// "no verificado, confirmá con la prepaga" al lado de un resultado con datos
// reales y precisos del mismo lugar (con nombre apenas distinto, ej.
// "Hospital Austral" vs "Hospital Universitario Austral") confunde más de lo
// que ayuda.
export function buscarSanatorioReferencia(query: string): SanatorioReferenciaResult[] {
  const q = query.toLowerCase().trim()
  if (q.length < 2) return []
  if (buscarSanatorio(query).length > 0) return []

  const resultados: SanatorioReferenciaResult[] = []
  const yaAgregados = new Set<string>()

  // Dos pasadas: primero localidades puntuales (partido/barrio), recién
  // después los hubs de zona ('zona-norte'/'zona-sur'/'zona-oeste') — así un
  // mismo prestador listado en ambos niveles linkea siempre al más
  // específico, no al hub genérico que aparece antes en el array.
  const esHub = (slug: string) => slug.startsWith('zona-')
  for (const soloHubs of [false, true]) {
    for (const prov of provinciasSEO) {
      for (const loc of prov.localidades) {
        if (esHub(loc.slug) !== soloHubs) continue
        for (const nombre of loc.prestadores) {
          const key = nombre.toLowerCase()
          if (nombre.toLowerCase().includes(q) && !yaAgregados.has(key)) {
            yaAgregados.add(key)
            resultados.push({
              nombre,
              zonaKey: loc.slug,
              zonaNombre: `${loc.nombre.split(' (')[0]}, ${prov.nombre}`,
              href: `/prepagas/${prov.slug}/${loc.slug}`,
            })
          }
        }
      }
    }
  }

  for (const [zonaKey, nombres] of Object.entries(REFERENCIA_POR_ZONA)) {
    for (const nombre of nombres) {
      const key = nombre.toLowerCase()
      if (nombre.toLowerCase().includes(q) && !yaAgregados.has(key)) {
        yaAgregados.add(key)
        resultados.push({ nombre, zonaKey, zonaNombre: ZONA_NOMBRE[zonaKey] ?? zonaKey, href: `/prepagas/${zonaKey}` })
      }
    }
  }
  return resultados
}

// zonaKey del cotizador (ZONA_PREPAGAS en ComparadorWizard) → tags de zona
// usados acá. Las provincias sin sanatorios cargados devuelven [] a propósito:
// el popup de Cartilla cae al fallback genérico en vez de mostrar datos de
// otra zona como si fueran locales.
const ZONA_SANATORIO: Record<string, string[]> = {
  caba: ['caba'],
  'buenos-aires': ['gba'],
  cordoba: ['cordoba'],
  'santa-fe': ['rosario'],
}

export interface SanatorioDePlan {
  sanatorio: Sanatorio
  cobertura: PlanCubre
}

// Sanatorios de alta complejidad que cubre un plan puntual, con la nota real
// si existe (ej. "no incluido en S1/S2"). `enZona` prioriza los que matchean
// la provincia elegida en el cotizador; si no hay ninguno ahí, devuelve los
// de otras zonas igual (mejor mostrar cartilla de otra provincia con la
// etiqueta correspondiente que no mostrar nada).
export function sanatoriosDePlan(prepagaSlug: string, planSlug: string, zonaKey?: string): SanatorioDePlan[] {
  const zonasLocales = zonaKey ? (ZONA_SANATORIO[zonaKey] ?? []) : []
  // Sin zona local conocida (todavía no tenemos data verificada de esa
  // provincia) no hay que mostrar sanatorios de OTRA zona como si aplicaran:
  // mejor devolver vacío y que el popup caiga al fallback genérico + red de
  // referencia, que sí está filtrada por provincia.
  if (zonasLocales.length === 0) return []

  const matches: SanatorioDePlan[] = []
  for (const s of sanatorios) {
    if (!s.zonas.some((z) => zonasLocales.includes(z))) continue
    const cobertura = s.planesQueLoCubren.find(
      (p) => p.prepagaSlug === prepagaSlug && p.planSlug === planSlug
    )
    if (cobertura) matches.push({ sanatorio: s, cobertura })
  }
  return matches
}
