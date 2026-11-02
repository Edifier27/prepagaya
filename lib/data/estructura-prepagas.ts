// Estructura propia de cada prepaga: sanatorios (con internación), centros médicos
// ambulatorios y avión sanitario. Pedido de Darío (2-nov-2026) para el ranking de
// /prepagas-con-sanatorios-propios. Cada dato sale de la web oficial de la prepaga
// (leída el 2-nov-2026) o, en Swiss Medical, de Darío como partner oficial.
// Sanatorio = establecimiento con internación; centro médico = atención ambulatoria.
// "null" = la prepaga no lo publica (no es lo mismo que 0).

export const ESTRUCTURA_FECHA = '2 de noviembre de 2026'

export interface EstructuraPrepaga {
  slug: string
  nombre: string
  sanatorios: number
  /** Nombres de los sanatorios propios (los que publica la prepaga) */
  sanatoriosNombres?: string[]
  centrosMedicos: number | null
  centrosOdontologicos?: number
  avionSanitario: number
  nota?: string
  fuente: { texto: string; url?: string }
}

export const estructuraPrepagas: EstructuraPrepaga[] = [
  {
    slug: 'swiss-medical', nombre: 'Swiss Medical', sanatorios: 11,
    sanatoriosNombres: ['Clínica y Maternidad Suizo Argentina', 'Sanatorio de Los Arcos', 'Sanatorio Agote', 'Clínica Zabala', 'Clínica Olivos', 'Clínica San Lucas', 'Sanatorio Las Lomas', 'Sanatorio Nordelta', 'Sanatorio Altos de Salta'],
    centrosMedicos: 20, centrosOdontologicos: 10, avionSanitario: 1,
    nota: 'Los 20 centros médicos son los SMG Center, exclusivos para socios. También es dueña del ICBA (Instituto Cardiovascular de Buenos Aires) y de Diagnóstico Maipú.',
    fuente: { texto: 'Swiss Medical, dato confirmado por PrepagaYa como asesor oficial (2-nov-2026)' },
  },
  {
    slug: 'galeno', nombre: 'Galeno', sanatorios: 8,
    sanatoriosNombres: ['Sanatorio de la Trinidad Palermo', 'Sanatorio de la Trinidad Mitre', 'Sanatorio de la Trinidad Quilmes', 'Sanatorio de la Trinidad San Isidro (Thames)', 'Sanatorio de la Trinidad San Isidro (Fleming)', 'Sanatorio de la Trinidad Ramos Mejía', 'Sanatorio de la Trinidad Neuquén', 'Sanatorio Dupuytren'],
    centrosMedicos: 9, avionSanitario: 0,
    nota: 'El Sanatorio Dupuytren es un centro de referencia en traumatología.',
    fuente: { texto: 'galeno.com.ar, sanatorios y centros médicos', url: 'https://www.galeno.com.ar/sanatorio/' },
  },
  {
    slug: 'omint', nombre: 'Omint', sanatorios: 3,
    sanatoriosNombres: ['Clínica Santa Isabel', 'Clínica del Sol', 'Clínica Bazterrica'],
    centrosMedicos: 3, centrosOdontologicos: 1, avionSanitario: 0,
    nota: 'Centros médicos Bazterrica, Santa Rita y Santa Isabel, y la Clínica Odontológica Omint. Todos en CABA.',
    fuente: { texto: 'omint.com.ar, clínicas del Grupo Omint', url: 'https://www.omint.com.ar/PlanDeSalud/' },
  },
  {
    slug: 'hospital-italiano', nombre: 'Hospital Italiano', sanatorios: 2,
    sanatoriosNombres: ['Hospital Italiano de Buenos Aires (sede Almagro)', 'Hospital Italiano de San Justo'],
    centrosMedicos: 15, avionSanitario: 0,
    nota: 'Dos sedes de alta complejidad y quince centros médicos ambulatorios en CABA y el GBA.',
    fuente: { texto: 'hospitalitaliano.org.ar, red de atención', url: 'https://www.hospitalitaliano.org.ar/hiba/es/news/red-medica-y-especialidades' },
  },
  {
    slug: 'medife', nombre: 'Medifé', sanatorios: 1, sanatoriosNombres: ['Sanatorio Finochietto'],
    centrosMedicos: null, avionSanitario: 0,
    nota: 'El Sanatorio Finochietto es de Medifé desde 2013.',
    fuente: { texto: 'medife.com.ar, nuestra empresa', url: 'https://www.medife.com.ar/institucional/nuestra_empresa' },
  },
  {
    slug: 'medicus', nombre: 'Medicus', sanatorios: 0, centrosMedicos: 11, avionSanitario: 0,
    nota: 'Once centros médicos propios; para internación usa sanatorios de terceros.',
    fuente: { texto: 'medicus.com.ar, institucional', url: 'https://medicus.com.ar/institucional' },
  },
  {
    slug: 'sancor-salud', nombre: 'Sancor Salud', sanatorios: 0, centrosMedicos: null, avionSanitario: 0,
    nota: 'Centro Médico Vitus propio, más de 200 puntos de atención y red de más de 200.000 prestadores.',
    fuente: { texto: 'sancorsalud.com.ar, quiénes somos', url: 'https://sancorsalud.com.ar/quienes-somos' },
  },
  {
    slug: 'osde', nombre: 'OSDE', sanatorios: 0, centrosMedicos: null, avionSanitario: 0,
    nota: 'Trabaja con prestadores de cartilla. El Grupo OSDE incluye URG Urgencias, el servicio de emergencias de Rosario y Córdoba.',
    fuente: { texto: 'osde.com.ar, Grupo OSDE', url: 'https://www.osde.com.ar/conoce-osde/grupo-osde' },
  },
  {
    slug: 'avalian', nombre: 'Avalian', sanatorios: 0, centrosMedicos: null, avionSanitario: 0,
    nota: 'Trabaja con prestadores de cartilla; sus centros de atención son sucursales administrativas.',
    fuente: { texto: 'avalian.com, centros de atención', url: 'https://avalian.com/centros' },
  },
]
