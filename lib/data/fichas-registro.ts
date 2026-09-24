import { entidadRegistro, type EntidadRegistro } from './registro-sssalud'

// Fichas de obras sociales sindicales grandes que no tenían página
// (24-sep-2026, docs/seo/universo-busquedas.md, familia B): se arman con el
// registro de la SSSalud (código, sede, teléfono, web, si se puede elegir con
// la opción de cambio) más la actividad que cubre, que sale del nombre
// oficial. Cada una ofrece la calculadora de aportes.

export interface FichaRegistro {
  /** slug del registro (lib/data/registro-sssalud.json) = slug de la página */
  slug: string
  /** Cómo se la conoce ("OSUOMRA (UOM)") */
  nombreCorto: string
  /** A quién cubre, para "Es la obra social de …" */
  actividad: string
  keywords: string[]
}

export const FICHAS_REGISTRO: FichaRegistro[] = [
  { slug: 'osuomra', nombreCorto: 'OSUOMRA (UOM)', actividad: 'los trabajadores metalúrgicos (Unión Obrera Metalúrgica)', keywords: ['osuomra', 'obra social uom', 'uom obra social telefono'] },
  { slug: 'uocra-construir-salud', nombreCorto: 'Construir Salud (UOCRA)', actividad: 'los trabajadores de la construcción', keywords: ['construir salud', 'obra social uocra', 'construir salud telefono'] },
  { slug: 'oschoca', nombreCorto: 'OSCHOCA (Camioneros)', actividad: 'los choferes de camiones', keywords: ['oschoca', 'obra social camioneros', 'oschoca telefono'] },
  { slug: 'ospedyc', nombreCorto: 'OSPEDYC (UTEDyC)', actividad: 'el personal de entidades deportivas y civiles', keywords: ['ospedyc', 'obra social utedyc', 'ospedyc telefono'] },
  { slug: 'ospacp', nombreCorto: 'OSPACP (Casas Particulares)', actividad: 'el personal auxiliar de casas particulares', keywords: ['ospacp', 'obra social empleada domestica', 'obra social casas particulares'] },
  { slug: 'ospia', nombreCorto: 'OSPIA (Alimentación)', actividad: 'el personal de la industria de la alimentación', keywords: ['ospia', 'obra social alimentacion', 'ospia telefono'] },
  { slug: 'bancaria-osba', nombreCorto: 'OSBA (La Bancaria)', actividad: 'los empleados bancarios', keywords: ['osba', 'obra social bancaria', 'la bancaria obra social'] },
  { slug: 'osmata', nombreCorto: 'OSMATA (SMATA)', actividad: 'los mecánicos y afines del transporte automotor', keywords: ['osmata', 'obra social smata', 'osmata telefono'] },
  { slug: 'ospsa-sanidad', nombreCorto: 'OSPSA (Sanidad)', actividad: 'el personal de la sanidad', keywords: ['ospsa', 'obra social sanidad', 'ospsa telefono'] },
  { slug: 'osuthgra', nombreCorto: 'OSUTHGRA (Gastronómicos)', actividad: 'los trabajadores gastronómicos y hoteleros', keywords: ['osuthgra', 'obra social gastronomicos', 'osuthgra telefono'] },
  { slug: 'osfatlyf', nombreCorto: 'OSFATLYF (Luz y Fuerza)', actividad: 'los trabajadores de Luz y Fuerza', keywords: ['osfatlyf', 'obra social luz y fuerza'] },
  { slug: 'osdop', nombreCorto: 'OSDOP (Docentes Particulares)', actividad: 'los docentes particulares', keywords: ['osdop', 'obra social docentes particulares', 'osdop telefono'] },
  { slug: 'osplad', nombreCorto: 'OSPLAD', actividad: 'la actividad docente', keywords: ['osplad', 'obra social docente', 'osplad telefono'] },
  { slug: 'osfymt', nombreCorto: 'Obra Social del Personal de Farmacias', actividad: 'el personal de farmacias', keywords: ['obra social farmacias', 'obra social del personal de farmacias'] },
  { slug: 'ospida', nombreCorto: 'OSPIDA', actividad: 'el personal de imprentas, diarios y afines', keywords: ['ospida', 'obra social graficos'] },
  { slug: 'ospil', nombreCorto: 'OSPIL (ATILRA)', actividad: 'el personal de la industria lechera', keywords: ['ospil', 'obra social atilra', 'obra social lecheros'] },
  { slug: 'ospic', nombreCorto: 'OSPIC (Caucho)', actividad: 'el personal de la industria del caucho', keywords: ['ospic', 'obra social caucho'] },
  { slug: 'osam-minera', nombreCorto: 'Obra Social de la Actividad Minera', actividad: 'la actividad minera', keywords: ['obra social minera', 'osam'] },
  { slug: 'osfe', nombreCorto: 'Obra Social Ferroviaria', actividad: 'los trabajadores ferroviarios', keywords: ['obra social ferroviaria', 'osfe'] },
  { slug: 'osapm', nombreCorto: 'OSAPM (Visitadores Médicos)', actividad: 'los agentes de propaganda médica', keywords: ['osapm', 'obra social visitadores medicos'] },
  { slug: 'osa', nombreCorto: 'Obra Social de Actores (OSA)', actividad: 'los actores', keywords: ['obra social de actores', 'osa actores'] },
  { slug: 'os-pe-pri', nombreCorto: 'OSPEPRI (Meopp)', actividad: 'los petroleros privados', keywords: ['meopp', 'ospepri', 'obra social petroleros privados'] },
  { slug: 'ospsip', nombreCorto: 'OSPSIP (Seguridad)', actividad: 'el personal de seguridad comercial, industrial e investigaciones privadas', keywords: ['ospsip', 'obra social seguridad privada', 'obra social vigiladores'] },
  { slug: 'ostel', nombreCorto: 'OSTEL (Telecomunicaciones)', actividad: 'el personal de las telecomunicaciones', keywords: ['ostel', 'obra social telefonicos'] },
]

export function fichaRegistro(slug: string): { ficha: FichaRegistro; entidad: EntidadRegistro } | null {
  const ficha = FICHAS_REGISTRO.find((f) => f.slug === slug)
  const entidad = ficha ? entidadRegistro(slug) : undefined
  return ficha && entidad?.codigo ? { ficha, entidad } : null
}
