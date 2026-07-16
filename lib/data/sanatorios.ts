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
  'buenos-aires': [
    // GBA Norte
    'Hospital Universitario Austral (Pilar)', 'Sanatorio de la Trinidad San Isidro', 'Sanatorio Las Lomas (San Isidro)',
    'Sanatorio San Lucas (San Isidro)', 'Clínica Olivos (V. López)', 'Hospital Privado Modelo (V. López)',
    'Sanatorio Vicente López', 'Sanatorio San Pablo (San Fernando)', 'Sanatorio General Sarmiento (San Miguel)',
    'Clínica Privada Fátima (Pilar/Escobar)',
    // GBA Sur
    'Sanatorio Modelo Quilmes', 'Sanatorio Avellaneda', 'Clínica Modelo Lanús', 'Sanatorio San Juan (Lanús)',
    'Sanatorio Juncal (Temperley)', 'Hospital Británico — Lomas de Zamora', 'Clínica Boedo (Lomas)',
    'Clínica Monte Grande', 'Clínica Ima (Adrogué)', 'Sanatorio Modelo Adrogué', 'Nuevo Sanatorio Berazategui',
    // GBA Oeste
    'Sanatorio Nuestra Señora del Pilar (Ciudadela)', 'Casa Hospital San Juan de Dios (Ramos Mejía)',
    'Sanatorio de la Trinidad Ramos Mejía', 'Sanatorio San Justo', 'Clínica Dres. Tachella (Haedo)',
    'Clínica Modelo de Morón', 'Clínica Constituyentes (Morón)', 'Sanatorio del Oeste (Ituzaingó y Merlo)',
    'Clínica Privada Provincial (Merlo)', 'Sanatorio Modelo de Caseros (Hurlingham)',
    // Interior / costa
    'Sanatorio Central Emhsa (Mar del Plata)', 'Hospital Privado de Comunidad (Mar del Plata)',
    'Clínica Privada del Sol (Mar del Plata)', 'Sanatorio Belgrano (Mar del Plata)',
    'Hospital Privado del Sur (Bahía Blanca)', 'Clínica Privada Bahiense (Bahía Blanca)',
    'Hospital Italiano de La Plata', 'Hospital Privado Sudamericano (La Plata)', 'Sanatorio Ipensa (La Plata)',
    'Sanatorio Tandil', 'Hospital Italiano Regional del Sur (Necochea)',
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

// Swiss Medical tiene una red propia de más de 30 SMG Center: centros de
// atención exclusivos para socios en todo el país, con turnos más rápidos
// que la cartilla general. No listamos ubicaciones puntuales por ciudad
// porque no tenemos ese detalle verificado — es un dato general de la marca.
export const SMG_CENTER_NOTA = 'Swiss Medical suma más de 30 SMG Center: centros de atención propios y exclusivos para socios, con acceso a turnos más rápidos que en el resto de la cartilla.'

export const sanatorios: Sanatorio[] = [
  {
    slug: 'hospital-italiano',
    nombre: 'Hospital Italiano',
    aliases: ['italiano', 'hospital italiano de buenos aires', 'hiba'],
    zonas: ['caba', 'gba'],
    planesQueLoCubren: [
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310, nota: 'Sacado del Plan 210 en agosto 2024. Requiere 310 mínimo.' },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '410', planNombre: 'Plan 410', precio: 459250 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '510', planNombre: 'Plan 510', precio: 1139396 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 325467, nota: 'No incluido en S1/S2. Suma desde SMG20.' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 373881 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 390775 },
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
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 373881, nota: 'Suma desde SMG30. No en S1/S2/SMG20.' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 390775 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'plata', planNombre: 'Plan Plata', precio: 309892 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'oro', planNombre: 'Plan Oro', precio: 393744 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'celeste', planNombre: 'Plan Celeste', precio: 399484 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'azul', planNombre: 'Plan Azul', precio: 490333 },
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'plan-3000', planNombre: 'Plan 3000', precio: 458614 },
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
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 373881, nota: 'Suma desde SMG30.' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 390775 },
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
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 325467, nota: 'Suma desde SMG20. No en S1.' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 373881 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'celeste', planNombre: 'Plan Celeste', precio: 399484 },
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'plan-1000', planNombre: 'Plan 1000', precio: 362701 },
    ],
  },
  {
    slug: 'sanatorio-otamendi',
    nombre: 'Sanatorio Otamendi',
    aliases: ['otamendi', 'sanatorio otamendi'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 325467, nota: 'Suma desde SMG20. No en S1/S2.' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 373881 },
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
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'bronce', planNombre: 'Plan Bronce', precio: 240360 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'plata', planNombre: 'Plan Plata', precio: 309892 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'celeste', planNombre: 'Plan Celeste', precio: 399484 },
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'plan-1000', planNombre: 'Plan 1000', precio: 362701 },
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
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'celeste', planNombre: 'Plan Celeste', precio: 399484 },
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'plan-1000', planNombre: 'Plan 1000', precio: 362701 },
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
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 325467 },
    ],
  },
  {
    slug: 'sanatorio-juncal',
    nombre: 'Sanatorio Juncal',
    aliases: ['juncal', 'sanatorio juncal'],
    zonas: ['gba'],
    planesQueLoCubren: [
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'f700', planNombre: 'Plan F700', precio: 257337 },
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'plan-1000', planNombre: 'Plan 1000', precio: 362701 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '210', planNombre: 'Plan 210', precio: 267250 },
    ],
  },
  {
    slug: 'hospital-privado-cordoba',
    nombre: 'Hospital Privado Universitario Córdoba',
    aliases: ['hospital privado cordoba', 'privado cordoba', 'hospital privado de córdoba'],
    zonas: ['cordoba'],
    planesQueLoCubren: [
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 325467 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '210', planNombre: 'Plan 210', precio: 267250 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310 },
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'plan-1000', planNombre: 'Plan 1000', precio: 362701 },
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
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'f700', planNombre: 'Plan F700', precio: 257337 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'bronce', planNombre: 'Plan Bronce', precio: 240360 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 325467 },
    ],
  },
  {
    slug: 'hospital-italiano-rosario',
    nombre: 'Hospital Italiano Rosario',
    aliases: ['italiano rosario', 'hospital italiano rosario'],
    zonas: ['rosario'],
    planesQueLoCubren: [
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 325467 },
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'plan-1000', planNombre: 'Plan 1000', precio: 362701 },
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
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'f700', planNombre: 'Plan F700', precio: 257337 },
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
  const matches: SanatorioDePlan[] = []
  for (const s of sanatorios) {
    const cobertura = s.planesQueLoCubren.find(
      (p) => p.prepagaSlug === prepagaSlug && p.planSlug === planSlug
    )
    if (cobertura) matches.push({ sanatorio: s, cobertura })
  }
  const zonasLocales = zonaKey ? (ZONA_SANATORIO[zonaKey] ?? []) : []
  if (zonasLocales.length === 0) return matches
  return [...matches].sort((a, b) => {
    const aLocal = a.sanatorio.zonas.some((z) => zonasLocales.includes(z)) ? 0 : 1
    const bLocal = b.sanatorio.zonas.some((z) => zonasLocales.includes(z)) ? 0 : 1
    return aLocal - bLocal
  })
}
