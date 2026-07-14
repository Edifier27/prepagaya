// Información de cartillas médicas por prepaga.
// `urlCartilla` apunta al buscador oficial de cartilla cuando está verificado;
// si no, al sitio oficial de la empresa.

export interface CartillaInfo {
  slug: string // slug de la prepaga en prepagas.ts
  urlCartilla: string
  tip: string
  comoConsultar: string[]
}

export const cartillasInfo: CartillaInfo[] = [
  {
    slug: 'swiss-medical',
    urlCartilla: 'https://www.swissmedical.com.ar/smg/cartilla',
    tip: 'Filtrá por "Médicos SMG" para ver solo los centros Swiss Medical propios: ahí la disponibilidad de turnos es mayor.',
    comoConsultar: [
      'Entrá al buscador de cartilla en la web o app de Swiss Medical.',
      'Elegí tu plan (S1, S2, SMG20, etc.): la red cambia según el plan.',
      'Filtrá por especialidad y zona, o buscá directamente por nombre del profesional.',
    ],
  },
  {
    slug: 'osde',
    urlCartilla: 'https://www.osde.com.ar/cartilla',
    tip: 'Usá la Cartilla Inteligente: escribí el síntoma y te recomienda el especialista adecuado.',
    comoConsultar: [
      'Ingresá a osde.com.ar/cartilla o a la app OSDE.',
      'Seleccioná tu plan (210, 310, 410, 510 o Flux): los prestadores varían por plan.',
      'Buscá por especialidad, nombre o cercanía con la geolocalización de la app.',
    ],
  },
  {
    slug: 'cemic',
    urlCartilla: 'https://www.cemic.edu.ar',
    tip: 'Filtrá por sede CEMIC (Las Heras, Galván, Saavedra) para encontrar el centro más cercano a tu casa.',
    comoConsultar: [
      'La atención se concentra en las sedes propias de CEMIC.',
      'Verificá qué sanatorios externos suma tu plan (Británico, Mater Dei, Otamendi en planes superiores).',
      'Los turnos se gestionan por el portal del paciente o por teléfono.',
    ],
  },
  {
    slug: 'sancor-salud',
    urlCartilla: 'https://www.sancorsalud.com.ar/cartilla',
    tip: 'Buscá por especialidad + ciudad: es la red más amplia del interior del país.',
    comoConsultar: [
      'Entrá al buscador de prestadores en la web o app de Sancor Salud.',
      'Elegí tu plan y provincia: la fortaleza de Sancor está en la cobertura federal.',
      'Confirmá el turno directamente con el prestador; la credencial digital está en la app.',
    ],
  },
  {
    slug: 'premedic',
    urlCartilla: 'https://www.premedic.com.ar/cartilla',
    tip: 'La cartilla cubre AMBA, Córdoba, Rosario, Tucumán y Mendoza únicamente: verificá tu zona antes de contratar.',
    comoConsultar: [
      'Consultá el listado de prestadores en la web de Premedic.',
      'Verificá que haya sanatorio y especialistas en tu zona: la red es más acotada que en prepagas grandes.',
      'Para urgencias fuera de zona, llamá al número de emergencias de tu credencial.',
    ],
  },
  {
    slug: 'medife',
    urlCartilla: 'https://www.medife.com.ar/cartilla',
    tip: 'Filtrá por plan: un profesional puede atender por Plan Oro y no por Bronce. Verificalo antes de cada consulta.',
    comoConsultar: [
      'Usá el buscador de cartilla en medife.com.ar o la app Medifé.',
      'Elegí tu plan (Indie, Bronce, Plata, Oro, Platinum): la red varía.',
      'Para consultas simples probá Cam Doctor: telemedicina con médico en menos de 10 minutos.',
    ],
  },
  {
    slug: 'omint',
    urlCartilla: 'https://www.omint.com.ar',
    tip: 'Bazterrica, Del Sol y Santa Isabel están incluidos desde los planes básicos. La cartilla completa se abre en Global y superiores.',
    comoConsultar: [
      'Ingresá al portal de Omint y buscá por especialidad o profesional.',
      'Tené en cuenta tu línea de plan: Génesis tiene cartilla acotada; Global, Clásico y Premium acceden a la red completa.',
      'Los sanatorios propios se reservan por el portal de turnos de Omint.',
    ],
  },
  {
    slug: 'medicus',
    urlCartilla: 'https://medicus.com.ar',
    tip: 'Buscá primero el Centro Médico Medicus más cercano (Azcuénaga, Belgrano, San Isidro y otros): concentran la mayoría de las especialidades.',
    comoConsultar: [
      'Usá el buscador de prestadores en medicus.com.ar o la app.',
      'Filtrá por tu plan (Conecta, Integra, Family, Celeste, Azul).',
      'En el plan Conecta gran parte de la atención inicial es digital, con historia clínica online.',
    ],
  },
  {
    slug: 'avalian',
    urlCartilla: 'https://www.avalian.com/cartilla',
    tip: 'El buscador permite ordenar prestadores por cercanía: útil porque la red de Avalian es federal.',
    comoConsultar: [
      'Entrá a avalian.com/cartilla y elegí tu plan y localidad.',
      'Buscá por especialidad o nombre; la app muestra prestadores por cercanía.',
      'La credencial es digital (e-doc): la descargás desde la app.',
    ],
  },
  {
    slug: 'prevencion-salud',
    urlCartilla: 'https://www.prevencionsalud.com.ar',
    tip: 'Verificá qué sanatorios suma tu plan: el A2 es el más económico que incluye Hospital Austral en cartilla.',
    comoConsultar: [
      'Usá el buscador de prestadores en prevencionsalud.com.ar o la app.',
      'Elegí tu plan (A1 a A6): la amplitud de la red crece con el plan.',
      'Prevención pertenece al grupo Sancor Seguros: la red federal es su fuerte.',
    ],
  },
  {
    slug: 'hospital-italiano',
    urlCartilla: 'https://www.hospitalitaliano.org.ar/hiba/es/sitio/plan-de-salud',
    tip: 'La atención se centra en el propio Hospital Italiano (Almagro y San Justo) y sus centros periféricos: si vivís cerca, es imbatible.',
    comoConsultar: [
      'La cartilla es la estructura del propio Hospital Italiano y sus centros médicos.',
      'Los turnos se sacan por el Portal de Salud o la app del Hospital.',
      'Verificá los centros periféricos de agenda rápida para consultas simples.',
    ],
  },
  {
    slug: 'federada-salud',
    urlCartilla: 'https://federada.com',
    tip: 'Federada nació en Rosario: su red en Santa Fe, Córdoba y Entre Ríos es de las mejores del interior.',
    comoConsultar: [
      'Consultá el buscador de prestadores en federada.com.',
      'Elegí tu plan (Joven, 4000, 3000, 2000, 1000) y tu provincia.',
      'En el interior productivo (Santa Fe, Córdoba) la capilaridad es su diferencial.',
    ],
  },
  {
    slug: 'hominis',
    urlCartilla: 'https://www.hominis.com.ar',
    tip: 'La atención se concentra en el Sanatorio Güemes, uno de los hospitales de comunidad más completos de CABA.',
    comoConsultar: [
      'La red se estructura alrededor del Sanatorio Güemes y centros asociados.',
      'Verificá la cobertura en tu zona: Hominis se concentra en AMBA.',
      'Los turnos del Güemes se gestionan por su portal de turnos online.',
    ],
  },
  {
    slug: 'galeno',
    urlCartilla: 'https://www.galeno.com.ar',
    tip: 'Los sanatorios de la Trinidad (Palermo, Mitre, San Isidro, Quilmes, Ramos Mejía) son la columna de la red: incluidos según plan.',
    comoConsultar: [
      'Usá el buscador de cartilla en galeno.com.ar o la app Galeno.',
      'Elegí tu línea de plan (Azul, Plata, Oro): el acceso a las Trinidad crece con el plan.',
      'e-Galeno permite gestionar autorizaciones y reintegros sin ir a sucursal.',
    ],
  },
  {
    slug: 'luis-pasteur',
    urlCartilla: 'https://www.oslpasteur.com.ar',
    tip: 'Su diferencial no está en la cartilla sino en farmacia: 60% de descuento en medicamentos, el más alto del mercado.',
    comoConsultar: [
      'Consultá el listado de prestadores en oslpasteur.com.ar o por el 0800-222-1331.',
      'Verificá la red de tu zona antes de contratar: es una obra social de estructura más chica.',
      'El Plan N en adelante elimina los copagos de consulta.',
    ],
  },
]

export function getCartillaInfo(slug: string): CartillaInfo | undefined {
  return cartillasInfo.find((c) => c.slug === slug)
}
