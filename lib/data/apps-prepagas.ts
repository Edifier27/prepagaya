// Apps oficiales de las prepagas. Fuente: la ficha de cada app en Google Play
// (desarrollador verificado = la prepaga, o linkeada desde su web oficial),
// consultada el 22-sep-2026. Las funciones son las que la propia prepaga lista
// en la descripción de la app — no agregamos ninguna que no figure ahí. La
// calificación y la cantidad de opiniones cambian todo el tiempo: se muestran
// con la fecha de consulta.

export interface AppPrepaga {
  prepagaSlug: string
  nombreApp: string
  desarrollador: string
  playUrl: string
  /** Funciones tal como las describe la ficha oficial */
  funciones: string[]
  credencialDigital: boolean
  calificacion: number
  opiniones: number
  /** Otras apps oficiales de la misma prepaga (ej. telemedicina) */
  otras?: { nombre: string; playUrl: string; descripcion: string }[]
}

export const APPS_FECHA = '22 de septiembre de 2026'
export const APPS_FUENTE = 'Fichas oficiales en Google Play'

export const appsPrepagas: AppPrepaga[] = [
  {
    prepagaSlug: 'swiss-medical',
    nombreApp: 'Swiss Medical',
    desarrollador: 'Desarrollo Swiss Medical Group',
    playUrl: 'https://play.google.com/store/apps/details?id=com.swissmedical.clientes',
    funciones: [
      'Credencial digital y token de validación',
      'Turnos para especialidades y estudios',
      'Resultados de estudios médicos',
      'Guardia ágil: reservar lugar en la fila',
      'Cartilla y detalle del plan médico y odontológico',
      'Facturas y pago',
      'Autorizaciones, presupuestos y reintegros por chat (asistente Swity)',
      'Recetas',
      'E-consulta con profesionales',
      'Acceso rápido al teléfono de emergencias',
    ],
    credencialDigital: true,
    calificacion: 2.9,
    opiniones: 31119,
  },
  {
    prepagaSlug: 'avalian',
    nombreApp: 'Avalian',
    desarrollador: 'Avalian',
    playUrl: 'https://play.google.com/store/apps/details?id=com.acasalud',
    funciones: [
      'Credencial digital',
      'Trámites online',
      'Consulta médica virtual',
      'Cartilla con búsqueda geolocalizada',
      'Factura y pago',
    ],
    credencialDigital: true,
    calificacion: 3.1,
    opiniones: 971,
    otras: [
      {
        nombre: 'Avalian e-Doc',
        playUrl: 'https://play.google.com/store/apps/details?id=ar.com.portalsalud.acasalud',
        descripcion: 'Consultas por videollamada con clínicos y pediatras, las 24 horas',
      },
    ],
  },
  {
    prepagaSlug: 'premedic',
    nombreApp: 'Premedic Móvil',
    desarrollador: 'PaisanosCreando (app linkeada desde la web oficial de Premedic)',
    playUrl: 'https://play.google.com/store/apps/details?id=com.paisanoscreando.premedic',
    funciones: [
      'Cartilla: prestadores por especialidad, cercanía o nombre, con mapa',
      'Información de urgencias en todo el país',
      'Centros de Atención Personalizada por localidad',
      'Llamado directo por urgencias y riesgo de vida',
    ],
    credencialDigital: false,
    calificacion: 4.9,
    opiniones: 1214,
  },
  {
    prepagaSlug: 'sancor-salud',
    nombreApp: 'SanCor Salud Up!',
    desarrollador: 'SanCor Salud',
    playUrl: 'https://play.google.com/store/apps/details?id=ar.com.sancorsalud.appinstitucional',
    funciones: [
      'Credencial digital',
      'Cartilla de prestadores con favoritos',
      'Gestiones: reintegros, autorizaciones previas y programas (materno infantil, diabetes, crónicos, celiaquía y más)',
      'Detalle de cobertura del plan y de la asistencia al viajero',
      'Facturas',
      'Alta de un nuevo integrante (Espacio Familia)',
      'Línea exclusiva para asociados y llamada de emergencia',
      'Pedir un asesor si todavía no sos asociado',
    ],
    credencialDigital: true,
    calificacion: 2.7,
    opiniones: 2490,
  },
  {
    prepagaSlug: 'osde',
    nombreApp: 'OSDE',
    desarrollador: 'Grupo OSDE',
    playUrl: 'https://play.google.com/store/apps/details?id=ar.com.osde.ads',
    funciones: [
      'Credenciales digitales, también sin conexión y sin iniciar sesión',
      'Cartilla',
      'Trámites',
      'Próximos turnos',
      'Canales de contacto',
    ],
    credencialDigital: true,
    calificacion: 3.6,
    opiniones: 10354,
  },
]

export function getAppPrepaga(slug: string): AppPrepaga | undefined {
  return appsPrepagas.find((a) => a.prepagaSlug === slug)
}
