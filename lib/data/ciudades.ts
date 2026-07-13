export interface CiudadData {
  slug: string
  nombre: string
  provincia: string
  prepagasDisponibles: string[]
  descripcion: string
}

export const ciudades: CiudadData[] = [
  {
    slug: 'buenos-aires',
    nombre: 'Buenos Aires (AMBA)',
    provincia: 'Buenos Aires',
    prepagasDisponibles: [
      'swiss-medical', 'osde', 'cemic', 'sancor-salud', 'premedic', 'medife',
      'omint', 'medicus', 'avalian', 'prevencion-salud', 'hospital-italiano', 'hominis',
    ],
    descripcion: 'En el Área Metropolitana de Buenos Aires encontrás todas las prepagas disponibles con la mayor cantidad de prestadores del país. Más de 12 empresas compiten en el mercado más grande de Argentina.',
  },
  {
    slug: 'cordoba',
    nombre: 'Córdoba',
    provincia: 'Córdoba',
    prepagasDisponibles: [
      'swiss-medical', 'osde', 'sancor-salud', 'premedic', 'medife',
      'medicus', 'avalian', 'prevencion-salud', 'federada-salud',
    ],
    descripcion: 'Córdoba cuenta con amplia oferta de prepagas y una red de sanatorios y clínicas de primer nivel. Federada Salud tiene presencia fuerte en esta provincia.',
  },
  {
    slug: 'rosario',
    nombre: 'Rosario',
    provincia: 'Santa Fe',
    prepagasDisponibles: [
      'swiss-medical', 'osde', 'sancor-salud', 'medife',
      'medicus', 'avalian', 'prevencion-salud', 'federada-salud',
    ],
    descripcion: 'Rosario tiene buena oferta de prepagas con excelentes centros de salud privados. Federada Salud es especialmente fuerte en Santa Fe.',
  },
  {
    slug: 'mendoza',
    nombre: 'Mendoza',
    provincia: 'Mendoza',
    prepagasDisponibles: [
      'swiss-medical', 'osde', 'sancor-salud',
      'medicus', 'avalian', 'prevencion-salud', 'federada-salud',
    ],
    descripcion: 'En Mendoza la oferta de prepagas incluye las principales nacionales con buena cobertura en la región de Cuyo.',
  },
  {
    slug: 'tucuman',
    nombre: 'Tucumán',
    provincia: 'Tucumán',
    prepagasDisponibles: [
      'swiss-medical', 'osde', 'sancor-salud', 'premedic',
      'avalian', 'prevencion-salud',
    ],
    descripcion: 'Tucumán cuenta con presencia de las principales prepagas nacionales y es el centro de salud privada del NOA.',
  },
  {
    slug: 'la-plata',
    nombre: 'La Plata',
    provincia: 'Buenos Aires',
    prepagasDisponibles: [
      'swiss-medical', 'osde', 'cemic', 'sancor-salud', 'medife',
      'avalian', 'prevencion-salud', 'hospital-italiano', 'hominis',
    ],
    descripcion: 'La Plata, como capital bonaerense, tiene excelente cobertura de prepagas y acceso a los centros médicos más importantes de la provincia.',
  },
  {
    slug: 'mar-del-plata',
    nombre: 'Mar del Plata',
    provincia: 'Buenos Aires',
    prepagasDisponibles: [
      'swiss-medical', 'osde', 'sancor-salud',
      'medicus', 'avalian',
    ],
    descripcion: 'Mar del Plata cuenta con las principales prepagas nacionales. Medicus tiene centros propios en la ciudad.',
  },
  {
    slug: 'salta',
    nombre: 'Salta',
    provincia: 'Salta',
    prepagasDisponibles: [
      'swiss-medical', 'osde', 'sancor-salud',
      'medife', 'prevencion-salud',
    ],
    descripcion: 'Salta tiene presencia de las prepagas más importantes del país con cobertura regional en el NOA.',
  },
  {
    slug: 'neuquen',
    nombre: 'Neuquén',
    provincia: 'Neuquén',
    prepagasDisponibles: [
      'swiss-medical', 'osde', 'sancor-salud',
      'medicus', 'avalian', 'prevencion-salud',
    ],
    descripcion: 'Neuquén es el centro económico de la Patagonia y cuenta con prepagas nacionales con buena red de prestadores. Medicus tiene centros propios en la ciudad.',
  },
  {
    slug: 'bariloche',
    nombre: 'Bariloche',
    provincia: 'Río Negro',
    prepagasDisponibles: [
      'swiss-medical', 'osde', 'sancor-salud',
      'medicus',
    ],
    descripcion: 'Bariloche cuenta con las principales prepagas nacionales. Medicus tiene presencia propia en la ciudad, lo que la hace especialmente conveniente en la zona.',
  },
  {
    slug: 'santa-fe',
    nombre: 'Santa Fe',
    provincia: 'Santa Fe',
    prepagasDisponibles: [
      'swiss-medical', 'osde', 'sancor-salud',
      'avalian', 'prevencion-salud', 'federada-salud',
    ],
    descripcion: 'Santa Fe capital tiene buena oferta de prepagas con Federada Salud especialmente fuerte en la región.',
  },
  {
    slug: 'posadas',
    nombre: 'Posadas',
    provincia: 'Misiones',
    prepagasDisponibles: [
      'osde', 'sancor-salud',
      'prevencion-salud',
    ],
    descripcion: 'Posadas, capital de Misiones, cuenta con las prepagas nacionales más importantes con cobertura en la región NEA.',
  },
]

export function getCiudadBySlug(slug: string): CiudadData | undefined {
  return ciudades.find((c) => c.slug === slug)
}
