// Convenios y afinidades de cada prepaga (23-sep-2026). Búsquedas con volumen:
// "swiss medical afip" (código de obra social), "swiss medical pami"
// ("¿atiende PAMI?"), "swiss medical anses", "swiss medical banco ...".
//
// Se muestran como secciones H2 dentro de /prepagas/[slug] (no páginas
// aparte, para no canibalizar). CADA BLOQUE SE PUBLICA SOLO SI TIENE DATOS:
// mientras un campo esté vacío, esa sección no aparece en la web.
// Datos pendientes de Darío: nada de acá se completa sin su confirmación.

import { entidadRegistro, codigoSeisDigitos, FUENTE_RNAS, PREPAGA_A_REGISTRO } from './registro-sssalud'

export interface Convenio {
  /** Organismo o empresa, ej. "ANSES" */
  entidad: string
  /** A quién alcanza, ej. "Empleados de ANSES y su grupo familiar" */
  paraQuien: string
  /** Qué da el convenio: plan, descuento, condiciones */
  beneficio: string
  fuente?: { texto: string; url?: string }
}

export interface AfinidadBanco {
  banco: string
  beneficio: string
  fuente?: { texto: string; url?: string }
}

export interface PlanConvenio {
  codigo: string
  linea: string
  sistema: string
  destacados: string[]
}

export interface ConveniosPrepaga {
  /** "Código de obra social para AFIP/ARCA": texto explicativo + código(s) */
  codigoAfip?: {
    explicacion: string
    codigos: { codigo: string; nota?: string }[]
    fuente?: { texto: string; url?: string }
  }
  /** "¿Atiende PAMI?": respuesta corta y detalle */
  pami?: {
    respuesta: string
    detalle: string
    fuente?: { texto: string; url?: string }
  }
  convenios?: Convenio[]
  /** Planes a los que acceden los convenios (si son los mismos para todos) */
  planesConvenio?: { planes: PlanConvenio[]; fuente: string }
  bancos?: AfinidadBanco[]
}

export const convenios: Record<string, ConveniosPrepaga> = {
  'swiss-medical': {
    // Código confirmado por Darío (23-sep-2026).
    // Coincide con el RNAS de la SSSalud (Swiss Medical S.A., 9-0080-5).
    codigoAfip: {
      explicacion: 'Es el código de obra social que se indica para elegir Swiss Medical al derivar tus aportes: podés pedirle a tu empleador que lo cargue en tu alta, así no tenés que hacer el cambio después. Confirmalo con tu asesor antes de indicarlo.',
      codigos: [{ codigo: '900805', nota: 'Swiss Medical S.A., RNAS 9-0080-5' }],
      fuente: { texto: FUENTE_RNAS, url: 'https://www.sssalud.gob.ar/index.php?cat=agsis&page=listRnos&rnas=900805' },
    },
    // Confirmado por Darío (23-sep-2026): Swiss Medical no atiende PAMI.
    pami: {
      respuesta: 'No.',
      detalle: 'Swiss Medical no atiende a afiliados de PAMI: para atenderte en Swiss Medical necesitás un plan de Swiss Medical. Si trabajás en PAMI, sí podés acceder a los planes corporativos del convenio de Swiss Medical con PAMI para empleados.',
      fuente: { texto: 'PrepagaYa, partner oficial de Swiss Medical' },
    },
    // Convenios corporativos (Darío, 23-sep-2026): los tres son para
    // empleados del organismo y dan acceso a los mismos planes.
    convenios: [
      { entidad: 'ANSES', paraQuien: 'Empleados de ANSES', beneficio: 'Acceso a los planes corporativos SB02, SB61 y PO64 de Swiss Medical.' },
      { entidad: 'ARCA (ex AFIP)', paraQuien: 'Empleados de ARCA (ex AFIP)', beneficio: 'Acceso a los planes corporativos SB02, SB61 y PO64 de Swiss Medical.' },
      { entidad: 'PAMI', paraQuien: 'Empleados que trabajan en PAMI', beneficio: 'Acceso a los planes corporativos SB02, SB61 y PO64 de Swiss Medical.' },
    ],
    // Resumen de las cartillas de cobertura de Swiss Medical (Adm. de
    // Producto, vigencia 09/2026) que pasó Darío. Sin topes en pesos: cambian.
    planesConvenio: {
      fuente: 'Cartillas de cobertura de Swiss Medical, vigencia septiembre 2026',
      planes: [
        {
          codigo: 'SB02',
          linea: 'Línea Advance',
          sistema: 'Sistema cerrado (cartilla)',
          destacados: [
            'Consultas en consultorio, estudios e internación sin cargo',
            'Habitación individual',
            'Maternidad sin cargo',
            'Kinesiología y fonoaudiología: 25 sesiones sin cargo',
            'Ortodoncia 50% hasta los 15 años',
            '40% de descuento en farmacias',
          ],
        },
        {
          codigo: 'SB61',
          linea: 'Línea Premium',
          sistema: 'Sistema combinado (cartilla + reintegros)',
          destacados: [
            'Consultas, estudios e internación sin cargo',
            'Habitación individual',
            'Psicología: 20 sesiones por año sin cargo',
            'Ortodoncia 100% hasta los 15 años (en cartilla)',
            'Un par de anteojos o lentes de contacto por año',
            'Swiss Medical Internacional para el grupo familiar',
          ],
        },
        {
          codigo: 'PO64',
          linea: 'Línea Premium',
          sistema: 'Sistema combinado (cartilla + reintegros)',
          destacados: [
            'Consultas, estudios e internación sin cargo',
            'Habitación individual',
            'Psicología: 20 sesiones por año sin cargo',
            'Ortodoncia 100% hasta los 15 años (en cartilla)',
            'Swiss Medical Internacional para el grupo familiar',
            'Cirugía estética: 1 por año para el titular o cónyuge (sin prótesis)',
          ],
        },
      ],
    },
    // Afinidades con bancos (Darío, 23-sep-2026). Sin detalle de condiciones
    // todavía: el texto no promete un beneficio puntual.
    bancos: [
      { banco: 'Banco Supervielle', beneficio: 'Swiss Medical tiene un convenio de afinidad con Banco Supervielle. Consultanos qué planes y condiciones aplican a tu caso.' },
      { banco: 'Banco Macro', beneficio: 'Swiss Medical tiene un convenio de afinidad con Banco Macro. Consultanos qué planes y condiciones aplican a tu caso.' },
      { banco: 'Banco Provincia', beneficio: 'Swiss Medical tiene un convenio de afinidad con Banco Provincia. Consultanos qué planes y condiciones aplican a tu caso.' },
      { banco: 'Banco Nación', beneficio: 'Swiss Medical tiene un convenio de afinidad con Banco Nación. Consultanos qué planes y condiciones aplican a tu caso.' },
      { banco: 'Banco Ciudad', beneficio: 'Swiss Medical tiene un convenio de afinidad con Banco Ciudad. Consultanos qué planes y condiciones aplican a tu caso.' },
    ],
  },
  // Códigos del Registro Nacional de Agentes del Seguro (RNAS) de la SSSalud
  // (24-sep-2026). OSDE: RNOS 4-0080-0 (OSDE indica "código 400800" en su web
  // para la opción). Sancor: la Asociación Mutual Sancor Salud está inscripta
  // como agente del seguro con el 9-0210-8 (también figura así en la serie
  // SANO de argentina.gob.ar, con archivo de AFIP). El resto sale del
  // registro (ver CODIGOS_DEL_REGISTRO abajo). Premedic no figura en el
  // listado: no se carga.
  osde: {
    codigoAfip: {
      explicacion: 'Es el código con el que figura OSDE en el Registro Nacional de Agentes del Seguro de la Superintendencia de Servicios de Salud. Es el que se usa para elegir OSDE al derivar tus aportes (la opción se hace en la web de la SSSalud) y el que tu empleador carga en tu alta. Confirmalo con tu asesor antes de indicarlo.',
      codigos: [{ codigo: '400800', nota: 'OSDE, RNOS 4-0080-0' }],
      fuente: { texto: FUENTE_RNAS, url: 'https://www.sssalud.gob.ar/index.php?cat=agsis&page=listRnos&rnas=400800' },
    },
  },
  'sancor-salud': {
    codigoAfip: {
      explicacion: 'Es el código de la Asociación Mutual Sancor Salud como agente del seguro de salud: con él elegís Sancor Salud al derivar tus aportes, sin pasar por otra obra social, y es el que tu empleador carga en tu alta. Confirmalo con tu asesor antes de indicarlo.',
      codigos: [{ codigo: '902108', nota: 'Asociación Mutual Sancor Salud, RNAS 9-0210-8' }],
      fuente: { texto: FUENTE_RNAS, url: 'https://www.sssalud.gob.ar/index.php?cat=agsis&page=listRnos&rnas=902108' },
    },
  },
}

// Prepagas cuyo código sale del registro de la SSSalud (lib/data/
// registro-sssalud.ts, listado verificado el 20-sep-2026). El código se lee
// del registro; acá va solo la marca y la razón social bien escrita.
const CODIGOS_DEL_REGISTRO: Record<string, { marca: string; razonSocial: string }> = {
  avalian: { marca: 'Avalian', razonSocial: 'Avalian Salud y Bienestar Cooperativa Limitada' },
  galeno: { marca: 'Galeno', razonSocial: 'Galeno Argentina S.A.' },
  medife: { marca: 'Medifé', razonSocial: 'Medifé Asociación Civil' },
  omint: { marca: 'Omint', razonSocial: 'Omint S.A. de Servicios' },
  medicus: { marca: 'Medicus', razonSocial: 'Medicus S.A. de Asistencia Médica y Científica' },
  cemic: { marca: 'CEMIC', razonSocial: 'Centro de Educación Médica e Investigaciones Clínicas Norberto Quirno' },
  'hospital-italiano': { marca: 'el Plan de Salud del Hospital Italiano', razonSocial: 'Sociedad Italiana de Beneficencia en Buenos Aires' },
  'federada-salud': { marca: 'Federada Salud', razonSocial: 'Mutual Federada 25 de Junio' },
  hominis: { marca: 'Hominis', razonSocial: 'Hominis S.A.' },
  'luis-pasteur': { marca: 'Luis Pasteur', razonSocial: 'Obra Social del Personal de Dirección de Sanidad Luis Pasteur' },
  'prevencion-salud': { marca: 'Prevención Salud', razonSocial: 'Prevención Salud S.A.' },
}

for (const [slug, m] of Object.entries(CODIGOS_DEL_REGISTRO)) {
  const e = entidadRegistro(PREPAGA_A_REGISTRO[slug])
  if (!e?.codigo || convenios[slug]?.codigoAfip) continue
  const codigo = codigoSeisDigitos(e.codigo)
  convenios[slug] = {
    ...convenios[slug],
    codigoAfip: {
      explicacion: `Es el código con el que ${m.razonSocial} figura en el Registro Nacional de Agentes del Seguro de la Superintendencia de Servicios de Salud. Con él elegís ${m.marca} al derivar tus aportes (la opción se hace en la web de la SSSalud) y es el que tu empleador carga en tu alta. Confirmalo con tu asesor antes de indicarlo.`,
      codigos: [{ codigo, nota: `${m.razonSocial}, RNAS ${e.codigo}` }],
      fuente: { texto: FUENTE_RNAS, url: e.fuenteUrl },
    },
  }
}

export function getConvenios(prepagaSlug: string): ConveniosPrepaga | null {
  const c = convenios[prepagaSlug]
  if (!c) return null
  const hay = Boolean(c.codigoAfip?.codigos.length || c.pami?.respuesta || c.convenios?.length || c.bancos?.length)
  return hay ? c : null
}
