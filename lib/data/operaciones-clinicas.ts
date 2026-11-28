// Compras de clínicas por prepagas y grupos de salud, y cierres (28-nov-2026,
// pedido de Darío). Cada operación con fecha y fuente periodística u oficial
// verificada (docs/seo/clinicas-compras-2026-11.md). Quedan afuera las que no
// tienen fecha confirmada (Staff Médico, Medicien) y los cierres sin año.
// Alimenta /prensa/clinicas-compradas-por-prepagas, la red propia de cada
// prepaga y la sección "Quién es el dueño" de /sanatorios/[slug].

export interface FuenteNota { texto: string; url: string }

export interface OperacionClinica {
  id: string
  /** Quién compró, como lo cuentan las fuentes */
  comprador: string
  /** Prepaga del sitio involucrada, para enlazar su red propia */
  prepagaSlug?: string
  que: string
  tipo: 'compra' | 'canje' | 'gerenciamiento'
  /** AAAA-MM, para ordenar */
  mes: string
  /** Texto para mostrar */
  fecha: string
  lugar: string
  detalle: string
  /** Slugs de /sanatorios/[slug] que cambian de dueño */
  sanatorios?: string[]
  fuentes: FuenteNota[]
}

export interface CierreClinica {
  id: string
  nombre: string
  lugar: string
  mes: string
  fecha: string
  detalle: string
  fuentes: FuenteNota[]
}

export const OPERACIONES_ACTUALIZADO = '28 de noviembre de 2026'

export const operacionesClinicas: OperacionClinica[] = [
  {
    id: 'grupo-orono',
    comprador: 'Swiss Medical y Chicago Capital (familia Tourn, Grupo Gamma)',
    prepagaSlug: 'swiss-medical',
    que: 'Grupo Oroño',
    tipo: 'compra',
    mes: '2026-11',
    fecha: 'noviembre de 2026',
    lugar: 'Rosario',
    detalle: 'La familia Villavicencio vendió su parte del Grupo Oroño, la red de salud privada más grande de Rosario: Sanatorio Parque, Sanatorio de Niños, Instituto Cardiovascular de Rosario, Maternidad Oroño, GO Sanatorio Funes, Diagnóstico Médico Oroño e INECO Oroño. Según La Capital, entre Oroño y Gamma suman cerca del 60% de la salud privada de la ciudad.',
    sanatorios: ['sanatorio-parque-rosario', 'sanatorio-de-ninos-rosario', 'instituto-cardiovascular-de-rosario'],
    fuentes: [
      { texto: 'La Capital', url: 'https://www.lacapital.com.ar/grupo-orono-como-queda-el-mapa-la-salud-privada-rosario-despues-la-venta-del-siglo-n10292374.html' },
      { texto: 'Aire de Santa Fe', url: 'https://www.airedesantafe.com.ar/cambios-la-salud-privada-rosario-y-la-region-se-vendio-grupo-orono-n676874' },
      { texto: 'Conclusión', url: 'https://www.conclusion.com.ar/?p=1473641' },
    ],
  },
  {
    id: 'diagnostico-maipu',
    comprador: 'Swiss Medical',
    prepagaSlug: 'swiss-medical',
    que: 'Diagnóstico Maipú',
    tipo: 'compra',
    mes: '2025-10',
    fecha: 'octubre de 2025',
    lugar: 'CABA y GBA',
    detalle: 'Swiss Medical compró el 100% de Diagnóstico Maipú, la red de diagnóstico por imágenes y laboratorio con 30 centros, al grupo brasileño DASA, que así salió de Argentina. Los centros siguen con los mismos servicios.',
    fuentes: [
      { texto: 'LexLatin', url: 'https://lexlatin.com/noticias/dasa-vende-maipu-swiss-medical-sale-argentina' },
      { texto: 'El Cronista', url: 'https://www.cronista.com/negocios/swiss-medical-continua-creciendo-en-el-mercado-de-salud-compro-diagnostico-maipu' },
    ],
  },
  {
    id: 'fundacion-favaloro',
    comprador: 'Grupo Olmos (Red BASA)',
    que: 'Hospital Universitario Fundación Favaloro',
    tipo: 'gerenciamiento',
    mes: '2024-09',
    fecha: 'septiembre de 2024',
    lugar: 'CABA',
    detalle: 'No es una compra: el Grupo Olmos, a través de Red BASA, firmó un acuerdo para gerenciar los servicios médicos y administrativos del Hospital Universitario de la Fundación Favaloro por 15 años, con una inversión anunciada de unos US$20 millones.',
    sanatorios: ['fundacion-favaloro'],
    fuentes: [
      { texto: 'El Economista', url: 'https://eleconomista.com.ar/negocios/el-grupo-olmos-sigue-creciendo-sector-salud-tomo-control-fundacion-favaloro-prometio-invertir-us-20-millones-n78142' },
      { texto: 'BAE Negocios', url: 'https://www.baenegocios.com/negocios/Fundacion-Favaloro-y-Grupo-Olmos-firman-un-acuerdo-de-gerenciamiento-para-potenciar-servicios-medicos-20241001-0084.html' },
    ],
  },
  {
    id: 'sanatorio-las-lomas',
    comprador: 'Swiss Medical',
    prepagaSlug: 'swiss-medical',
    que: 'Sanatorio Las Lomas',
    tipo: 'canje',
    mes: '2024-05',
    fecha: 'mayo de 2024',
    lugar: 'San Isidro (GBA Norte)',
    detalle: 'Swiss Medical y la familia De All compartían Medicus y el Sanatorio Las Lomas. Dividieron el paquete: Swiss Medical se quedó con el 100% de Las Lomas y entregó su parte de Medicus, que quedó en manos de la familia De All. Según El Cronista, el acuerdo lo impulsó la familia De All, que quería manejar Medicus sola.',
    sanatorios: ['sanatorio-las-lomas'],
    fuentes: [
      { texto: 'La Nación', url: 'https://www.lanacion.com.ar/economia/negocios/swiss-medical-se-queda-con-sanatorio-las-lomas-y-sale-de-medicus-nid23052024/' },
      { texto: 'El Cronista', url: 'https://www.cronista.com/negocios/belocopitt-se-quedo-con-el-sanatorio-las-lomas-y-se-aleja-del-plan-de-comprar-medicus' },
    ],
  },
  {
    id: 'fresenius',
    comprador: 'Grupo Olmos',
    que: 'Las clínicas de diálisis de Fresenius Medical Care',
    tipo: 'compra',
    mes: '2023-12',
    fecha: 'diciembre de 2023',
    lugar: 'Todo el país',
    detalle: 'Well Being, del Grupo Olmos, compró el negocio argentino de Fresenius Medical Care: 76 clínicas de diálisis y una planta en Pilar. La Autoridad Nacional de la Competencia objetó la operación en un informe: el grupo pasaba a estar en 19 de las 24 provincias, con cerca del 44% de los pacientes.',
    fuentes: [
      { texto: 'LexLatin', url: 'https://lexlatin.com/noticias/fresenius-medical-care-grupo-olmos' },
      { texto: 'Autoridad Nacional de la Competencia', url: 'https://www.argentina.gob.ar/node/506502' },
    ],
  },
  {
    id: 'icba',
    comprador: 'Swiss Medical',
    prepagaSlug: 'swiss-medical',
    que: 'El 50% del Instituto Cardiovascular de Buenos Aires (ICBA)',
    tipo: 'compra',
    mes: '2021-01',
    fecha: 'enero de 2021',
    lugar: 'CABA',
    detalle: 'Swiss Medical compró el 50% del ICBA, después de más de tres años de conversaciones, sin informar el monto.',
    sanatorios: ['instituto-cardiovascular-de-buenos-aires'],
    fuentes: [
      { texto: 'iProfesional', url: 'https://www.iprofesional.com/negocios/331912-swiss-medical-compro-el-50-del-instituto-cardiovascular' },
      { texto: 'abogados.com.ar', url: 'https://abogados.com.ar/croz-y-el-estudio-padilla-silva-asociados-asesoraron-en-la-adquisicion-del-50-del-instituto-cardiovascular-de-buenos-aires-por-parte-de-swiss-medical-group/27745' },
    ],
  },
]

export const cierresClinicas: CierreClinica[] = [
  {
    id: 'sanatorio-sudeste-marcos-juarez',
    nombre: 'Sanatorio Privado del Sudeste',
    lugar: 'Marcos Juárez (Córdoba)',
    mes: '2026-03',
    fecha: 'marzo de 2026',
    detalle: 'Cerró a fines de marzo de 2026. Era el único prestador de PAMI de la ciudad; según su director, por los aranceles de PAMI sin actualizar. Los afiliados de PAMI pasaron a atenderse en la Clínica Fusavim de Villa María.',
    fuentes: [
      { texto: 'Perfil', url: 'https://www.perfil.com/noticias/cordoba/deudas-del-pami-unos-7000-jubilados-sin-atencion-medica-por-el-cierre-del-sanatorio-sudeste.phtml' },
      { texto: 'Cadena 3', url: 'https://www.cadena3.com/noticia/radioinforme-3/marcos-juarez-jubilados-sin-atencion-de-pami-tras-cierre-del-sanatorio-sudeste_543914' },
    ],
  },
]

/** Operaciones que cambian el dueño de un sanatorio con página propia */
export function operacionesDeSanatorio(slug: string): OperacionClinica[] {
  return operacionesClinicas.filter((o) => o.sanatorios?.includes(slug))
}

// Sanatorios propios de Swiss Medical con página en /sanatorios (los nombres
// salen de lib/data/estructura-prepagas.ts, dato de Swiss vía Darío)
export const SANATORIOS_PROPIOS: Record<string, string[]> = {
  'swiss-medical': ['clinica-suizo-argentina', 'sanatorio-los-arcos', 'sanatorio-agote', 'clinica-zabala', 'clinica-olivos', 'sanatorio-san-lucas', 'sanatorio-las-lomas', 'sanatorio-altos-de-salta'],
}

/** Prepaga dueña de un sanatorio con página propia */
export function prepagaDuena(slug: string): string | null {
  return Object.entries(SANATORIOS_PROPIOS).find(([, xs]) => xs.includes(slug))?.[0] ?? null
}
