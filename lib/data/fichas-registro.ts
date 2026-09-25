import { entidadRegistro, registroDeObraSocial, type EntidadRegistro } from './registro-sssalud'
import { obrasSociales } from './obras-sociales'

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
  /** Guía propia de la actividad, si hay */
  guia?: { slug: string; texto: string }
}

export const FICHAS_REGISTRO: FichaRegistro[] = [
  { slug: 'osuomra', nombreCorto: 'OSUOMRA (UOM)', actividad: 'los trabajadores metalúrgicos (Unión Obrera Metalúrgica)', keywords: ['osuomra', 'obra social uom', 'uom obra social telefono'] },
  { slug: 'uocra-construir-salud', nombreCorto: 'Construir Salud (UOCRA)', actividad: 'los trabajadores de la construcción', keywords: ['construir salud', 'obra social uocra', 'construir salud telefono'] },
  { slug: 'oschoca', nombreCorto: 'OSCHOCA (Camioneros)', actividad: 'los choferes de camiones', keywords: ['oschoca', 'obra social camioneros', 'oschoca telefono'] },
  { slug: 'ospedyc', nombreCorto: 'OSPEDYC (UTEDyC)', actividad: 'el personal de entidades deportivas y civiles', keywords: ['ospedyc', 'obra social utedyc', 'ospedyc telefono'] },
  { slug: 'ospacp', nombreCorto: 'OSPACP (Casas Particulares)', actividad: 'el personal auxiliar de casas particulares', keywords: ['ospacp', 'obra social empleada domestica', 'obra social casas particulares'], guia: { slug: 'obra-social-empleada-domestica', texto: 'Obra social de la empleada doméstica: las 16 horas y cómo elegir otra' } },
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
  // Tanda 2 (25-sep-2026): 35 más, las de más búsqueda entre las que no
  // tenían página (sindicales grandes y de personal de dirección).
  { slug: 'ase', nombreCorto: 'ASE (Acción Social de Empresarios)', actividad: 'el personal de dirección de empresas', keywords: ['ase obra social', 'ase accion social de empresarios', 'ase telefono'] },
  { slug: 'osperyh', nombreCorto: 'OSPERYH (Encargados de Edificios)', actividad: 'el personal de edificios de renta y propiedad horizontal de CABA y el Gran Buenos Aires', keywords: ['osperyh', 'obra social encargados de edificio', 'osperyh telefono'] },
  { slug: 'ospm', nombreCorto: 'OSPM (Maestranza)', actividad: 'el personal de maestranza', keywords: ['ospm', 'obra social maestranza', 'ospm telefono'] },
  { slug: 'osctc', nombreCorto: 'OSCTC (Colectiveros)', actividad: 'los conductores de transporte colectivo de pasajeros', keywords: ['osctc', 'obra social colectiveros', 'osctc telefono'] },
  { slug: 'osypf', nombreCorto: 'OSYPF', actividad: 'el personal de YPF', keywords: ['osypf', 'obra social ypf', 'osypf telefono'] },
  { slug: 'ostep', nombreCorto: 'OSTEP (Educación Privada)', actividad: 'los trabajadores de la educación privada', keywords: ['ostep', 'obra social educacion privada', 'ostep telefono'] },
  { slug: 'os-del-personal-de-la-ensenanza-privada', nombreCorto: 'OSPEP (Enseñanza Privada)', actividad: 'el personal de la enseñanza privada', keywords: ['ospep', 'obra social enseñanza privada', 'obra social docentes privados'] },
  { slug: 'ospes', nombreCorto: 'OSPES (Estaciones de Servicio)', actividad: 'el personal de estaciones de servicio, garages, playas de estacionamiento, lavaderos y gomerías', keywords: ['ospes', 'obra social estaciones de servicio', 'obra social playeros'] },
  { slug: 'ospetelco', nombreCorto: 'OSPETELCO', actividad: 'el personal de telecomunicaciones de Buenos Aires', keywords: ['ospetelco', 'ospetelco telefono', 'obra social telecomunicaciones buenos aires'] },
  { slug: 'ostee', nombreCorto: 'OSTEE (Electricidad)', actividad: 'los trabajadores de las empresas de electricidad', keywords: ['ostee', 'ostee luz medica', 'ostee telefono'] },
  { slug: 'ospim', nombreCorto: 'OSPIM (Madereros)', actividad: 'el personal de la industria maderera', keywords: ['ospim', 'obra social madereros', 'ospim telefono'] },
  { slug: 'os-del-personal-de-la-industria-textil', nombreCorto: 'OSPIT (Textiles)', actividad: 'el personal de la industria textil', keywords: ['ospit', 'obra social textil', 'ospit telefono'] },
  { slug: 'ospiv', nombreCorto: 'OSPIV (Industria del Vestido)', actividad: 'el personal de la industria del vestido', keywords: ['ospiv', 'obra social del vestido', 'ospiv telefono'] },
  { slug: 'os-del-personal-de-la-industria-del-plastico', nombreCorto: 'OSPIP (Plásticos)', actividad: 'el personal de la industria del plástico', keywords: ['ospip', 'obra social plasticos', 'ospip telefono'] },
  { slug: 'osppcyq', nombreCorto: 'OSPPCYQ (Papeleros)', actividad: 'el personal del papel, cartón y químicos', keywords: ['osppcyq', 'obra social papeleros', 'obra social del papel'] },
  { slug: 'ospg', nombreCorto: 'OSPG (Personal Gráfico)', actividad: 'el personal gráfico', keywords: ['ospg', 'obra social del personal grafico', 'ospg telefono'] },
  { slug: 'osppra', nombreCorto: 'OSPPRA (Prensa)', actividad: 'el personal de prensa', keywords: ['osppra', 'obra social de prensa', 'osppra telefono'] },
  { slug: 'ospel', nombreCorto: 'OSPEL (Limpieza, Mendoza)', actividad: 'el personal de empresas de limpieza, servicios y maestranza de Mendoza', keywords: ['ospel', 'ospel mendoza', 'obra social limpieza mendoza'] },
  { slug: 'os-del-personal-aeronautico', nombreCorto: 'OSPA (Personal Aeronáutico)', actividad: 'el personal aeronáutico', keywords: ['ospa', 'obra social personal aeronautico', 'ospa telefono'] },
  { slug: 'os-de-aeronavegantes', nombreCorto: 'OSA (Aeronavegantes)', actividad: 'los aeronavegantes', keywords: ['obra social aeronavegantes', 'osa aeronavegantes', 'aeronavegantes obra social telefono'] },
  { slug: 'osdem', nombreCorto: 'OSDEM (Músicos)', actividad: 'los músicos', keywords: ['osdem', 'obra social de musicos', 'osdem telefono'] },
  { slug: 'os-del-personal-del-espectaculo-publico', nombreCorto: 'OSPEP (Espectáculo Público)', actividad: 'el personal del espectáculo público', keywords: ['ospep espectaculo publico', 'obra social espectaculo publico', 'ospep salud'] },
  { slug: 'osptv', nombreCorto: 'OSPTV (Televisión)', actividad: 'el personal de televisión', keywords: ['osptv', 'obra social television', 'osptv telefono'] },
  { slug: 'osfatun', nombreCorto: 'OSFATUN', actividad: 'los trabajadores de las universidades nacionales', keywords: ['osfatun', 'osfatun telefono', 'obra social universidades nacionales'] },
  { slug: 'oscoema', nombreCorto: 'OSCOEMA (Municipales)', actividad: 'los obreros y empleados municipales', keywords: ['oscoema', 'obra social municipales', 'oscoema telefono'] },
  { slug: 'ostva', nombreCorto: 'OSTVA (Viales)', actividad: 'los trabajadores viales', keywords: ['ostva', 'obra social viales', 'ostva telefono'] },
  { slug: 'os-del-personal-de-panaderias', nombreCorto: 'OSPEP (Panaderías)', actividad: 'el personal de panaderías', keywords: ['obra social panaderos', 'ospep panaderias', 'obra social del personal de panaderias'] },
  { slug: 'osmedica', nombreCorto: 'OSMEDICA (Médicos de CABA)', actividad: 'los médicos de la Ciudad de Buenos Aires', keywords: ['osmedica', 'osmedica telefono', 'obra social de los medicos'] },
  { slug: 'osjera', nombreCorto: 'OSJERA (Personal Jerárquico)', actividad: 'el personal jerárquico de la industria gráfica y del agua y la energía', keywords: ['osjera', 'osjera telefono', 'obra social personal jerarquico'] },
  { slug: 'osim', nombreCorto: 'OSIM (Dirección Metalúrgica)', actividad: 'el personal de dirección de la industria metalúrgica y otras actividades empresarias', keywords: ['osim', 'osim obra social', 'osim telefono'] },
  { slug: 'ospatca', nombreCorto: 'OSPATCA (Administrativos de la Construcción)', actividad: 'el personal administrativo y técnico de la construcción', keywords: ['ospatca', 'ospatca telefono', 'obra social administrativos construccion'] },
  { slug: 'luis-pasteur', nombreCorto: 'Luis Pasteur (Dirección de Sanidad)', actividad: 'el personal de dirección de la sanidad', keywords: ['luis pasteur obra social', 'obra social luis pasteur telefono', 'osluispasteur'] },
  { slug: 'ospcyd', nombreCorto: 'OSPCYD (Carga y Descarga)', actividad: 'el personal de carga y descarga', keywords: ['ospcyd', 'obra social carga y descarga', 'ospcyd telefono'] },
  { slug: 'osvvra', nombreCorto: 'OSVVRA (Viajantes, ANDAR)', actividad: 'los viajantes vendedores', keywords: ['osvvra', 'andar obra social', 'obra social viajantes'] },
  { slug: 'osfgp', nombreCorto: 'OSFGP (Carne)', actividad: 'el personal de la industria de la carne y sus derivados', keywords: ['osfgp', 'obra social de la carne', 'osfgp telefono'] },
]

export function fichaRegistro(slug: string): { ficha: FichaRegistro; entidad: EntidadRegistro } | null {
  const ficha = FICHAS_REGISTRO.find((f) => f.slug === slug)
  const entidad = ficha ? entidadRegistro(slug) : undefined
  return ficha && entidad?.codigo ? { ficha, entidad } : null
}

/** Página del sitio para una entidad del registro: su ficha si tiene, o su fila en /obras-sociales/codigos. */
export function urlFichaEntidad(e: EntidadRegistro): string {
  const os = obrasSociales.find((o) => registroDeObraSocial(o.slug)?.slug === e.slug)
  if (os) return `/obras-sociales/${os.slug}`
  if (FICHAS_REGISTRO.some((f) => f.slug === e.slug)) return `/obras-sociales/${e.slug}`
  return `/obras-sociales/codigos#${e.slug}`
}
