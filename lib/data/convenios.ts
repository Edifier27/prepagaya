// Convenios y afinidades de cada prepaga (23-sep-2026). Búsquedas con volumen:
// "swiss medical afip" (código de obra social), "swiss medical pami"
// ("¿atiende PAMI?"), "swiss medical anses", "swiss medical banco ...".
//
// Se muestran como secciones H2 dentro de /prepagas/[slug] (no páginas
// aparte, para no canibalizar). CADA BLOQUE SE PUBLICA SOLO SI TIENE DATOS:
// mientras un campo esté vacío, esa sección no aparece en la web.
// Datos pendientes de Darío: nada de acá se completa sin su confirmación.

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
  bancos?: AfinidadBanco[]
}

export const convenios: Record<string, ConveniosPrepaga> = {
  'swiss-medical': {
    // codigoAfip: {
    //   explicacion: '',
    //   codigos: [{ codigo: '', nota: '' }],
    //   fuente: { texto: '', url: '' },
    // },
    // pami: {
    //   respuesta: '',
    //   detalle: '',
    // },
    // convenios: [
    //   { entidad: 'ANSES', paraQuien: '', beneficio: '' },
    //   { entidad: 'PAMI', paraQuien: '', beneficio: '' },
    //   { entidad: 'AFIP / ARCA', paraQuien: '', beneficio: '' },
    // ],
    // bancos: [
    //   { banco: '', beneficio: '' },
    // ],
  },
}

export function getConvenios(prepagaSlug: string): ConveniosPrepaga | null {
  const c = convenios[prepagaSlug]
  if (!c) return null
  const hay = Boolean(c.codigoAfip?.codigos.length || c.pami?.respuesta || c.convenios?.length || c.bancos?.length)
  return hay ? c : null
}
