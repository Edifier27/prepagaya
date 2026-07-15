// Fuente única del silo SEO local: alimenta los hubs provinciales, rankings,
// páginas prepaga×zona, localidades Y el filtro por zona del cotizador.
// Regla de contenido: nada inventado — lo no verificado se marca y la página
// lo comunica como "sujeto a cotización". Investigación: docs/seo-local/fase1-dataset.json

export interface PrepagaZona {
  slug: string
  nombre: string
  // true = existe /prepagas/[slug] con planes y precios en lib/data/prepagas.ts
  enSitio: boolean
  fuerza: 'fuerte' | 'media' | 'marginal'
  resumen: string
  cartillaLocal: string[]
  verificado: boolean
}

export interface LocalidadZona {
  slug: string
  nombre: string
  descripcion: string
  prestadores: string[]
}

export interface ProvinciaSEO {
  slug: string
  nombre: string
  // key de ZONA_PREPAGAS del cotizador (deep-link /comparador?zona=)
  zonaKey: string
  capitalNombre: string
  descripcion: string
  rankingIntro: string
  prepagas: PrepagaZona[]
  localidades: LocalidadZona[]
  prestadoresClave: string[]
  obraSocialProvincial?: { sigla: string; nombre: string; nota: string }
  faq: { q: string; a: string }[]
  fechaVerificacion: string
}

export const provinciasSEO: ProvinciaSEO[] = [
  {
    slug: 'cordoba',
    nombre: 'Córdoba',
    zonaKey: 'cordoba',
    capitalNombre: 'Córdoba capital',
    descripcion:
      'Córdoba es el segundo mercado de medicina privada del país y el que más competencia regional tiene: además de las prepagas nacionales, acá pesan fuerte las empresas nacidas en el interior como Avalian, Sancor Salud, Federada y la cordobesa Nobis. La provincia tiene una red sanatorial de primer nivel encabezada por el Hospital Privado Universitario, el Sanatorio Allende y la Clínica Universitaria Reina Fabiola, y una particularidad: la cobertura en el interior provincial (Río Cuarto, Villa María, San Francisco) puede ser muy distinta a la de capital, así que conviene verificar la cartilla de tu ciudad antes de decidir.',
    rankingIntro:
      'Este ranking pondera la cartilla efectiva en la provincia de Córdoba (capital e interior), la red de sanatorios locales, el precio y la satisfacción de afiliados. Una prepaga grande a nivel nacional pero con pocos prestadores cordobeses no puede estar arriba.',
    prepagas: [
      {
        slug: 'swiss-medical', nombre: 'Swiss Medical', enSitio: true, fuerza: 'fuerte', verificado: true,
        resumen: 'Presencia consolidada en Córdoba capital con cartilla urbana amplia y acceso a los principales sanatorios privados de la ciudad. Es la opción premium más elegida junto a OSDE en el mercado cordobés.',
        cartillaLocal: ['Cartilla en Córdoba capital con los principales sanatorios privados', 'Centros de diagnóstico asociados en la ciudad', 'Menor densidad de prestadores en el interior provincial'],
      },
      {
        slug: 'sancor-salud', nombre: 'Sancor Salud', enSitio: true, fuerza: 'fuerte', verificado: true,
        resumen: 'Nacida en Sunchales, es una de las redes más fuertes del centro del país. En Córdoba tiene cartilla tanto en capital como en el interior productivo (Villa María, San Francisco, Río Cuarto), donde muchas nacionales flaquean.',
        cartillaLocal: ['Cartilla provincial publicada por provincia (PDF oficial)', 'Fuerte presencia en el interior productivo cordobés', 'Convenios con clínicas regionales'],
      },
      {
        slug: 'nobis', nombre: 'Nobis Salud', enSitio: false, fuerza: 'fuerte', verificado: true,
        resumen: 'La prepaga cordobesa por definición: centros médicos propios en Córdoba capital y acceso a las principales clínicas y sanatorios de la ciudad. Desde Córdoba se expandió a otras 7 provincias del norte y centro. Planes B200, N200, N400 y N500.',
        cartillaLocal: ['Centros médicos propios en Córdoba capital', 'Acceso a las principales clínicas y sanatorios cordobeses', '20+ sucursales de atención en 8 provincias'],
      },
      {
        slug: 'osde', nombre: 'OSDE', enSitio: true, fuerza: 'fuerte', verificado: true,
        resumen: 'La filial Córdoba de OSDE mantiene la red más amplia del segmento premium, con cobertura en el Hospital Privado Universitario y los grandes sanatorios de capital. Es la referencia de cartilla abierta en la provincia.',
        cartillaLocal: ['Filial propia en Córdoba', 'Cobertura en los sanatorios de mayor complejidad de capital', 'Red premium también en ciudades del interior'],
      },
      {
        slug: 'avalian', nombre: 'Avalian', enSitio: true, fuerza: 'fuerte', verificado: true,
        resumen: 'De origen cooperativo (ex ACA Salud) y con ADN de interior: declara acceso a cerca del 80% de los prestadores del país y presencia en todas las ciudades importantes de Córdoba. Muy competitiva en precio para familias del interior.',
        cartillaLocal: ['Presencia en Córdoba capital y ciudades del interior', 'Red cooperativa con fuerte llegada rural', 'Buena relación precio/cartilla en la provincia'],
      },
      {
        slug: 'prevencion-salud', nombre: 'Prevención Salud', enSitio: true, fuerza: 'fuerte', verificado: true,
        resumen: 'La prepaga del grupo Sancor Seguros replica en Córdoba su fórmula de interior: red nacional con presencia notable fuera de las capitales y planes accesibles con cobertura nacional (plan A1).',
        cartillaLocal: ['Oficinas comerciales en la provincia', 'Red de prestadores en capital e interior', 'Respaldo del grupo Sancor Seguros'],
      },
      {
        slug: 'federada-salud', nombre: 'Federada Salud', enSitio: true, fuerza: 'fuerte', verificado: true,
        resumen: 'Santafesina con más de 250 agencias en el país y 60.000 profesionales en red, históricamente fuerte en Córdoba y todo el centro. Es una de las opciones más sólidas si vivís en el interior provincial.',
        cartillaLocal: ['Agencias de atención en la provincia', 'Red de 60.000+ profesionales a nivel país', 'Cobertura consolidada en el corredor Córdoba–Santa Fe'],
      },
      {
        slug: 'galeno', nombre: 'Galeno', enSitio: true, fuerza: 'media', verificado: true,
        resumen: 'Tiene sucursal propia en Córdoba capital (Mariano Fragueiro 142) y cobertura nacional en todos sus planes. Tené en cuenta que sus sanatorios propios (Trinidad) están en Buenos Aires: en Córdoba atendés por cartilla de convenio.',
        cartillaLocal: ['Sucursal Córdoba: Mariano Fragueiro 142', 'Cobertura nacional por convenios (sin sanatorios propios en la provincia)', 'Farmacias con descuentos de hasta 70%'],
      },
      {
        slug: 'medife', nombre: 'Medifé', enSitio: true, fuerza: 'media', verificado: false,
        resumen: 'Red nacional con buena relación precio-calidad. Su densidad de cartilla en Córdoba es menor que la de las regionales fuertes; para el interior provincial conviene verificar prestadores al cotizar.',
        cartillaLocal: ['Cobertura nacional declarada', 'Cartilla cordobesa sujeta a verificación al cotizar'],
      },
    ],
    localidades: [
      {
        slug: 'cordoba-capital', nombre: 'Córdoba capital',
        descripcion: 'Capital concentra la red privada más densa de la provincia: Hospital Privado Universitario, Sanatorio Allende (Nueva Córdoba y Cerro), Clínica Universitaria Reina Fabiola y Sanatorio del Salvador. Acá compiten todas: nacionales premium (OSDE, Swiss Medical, Galeno) y regionales (Nobis con centros propios, Avalian, Sancor, Federada, Prevención).',
        prestadores: ['Hospital Privado Universitario de Córdoba', 'Sanatorio Allende', 'Clínica Universitaria Reina Fabiola', 'Sanatorio del Salvador'],
      },
      {
        slug: 'rio-cuarto', nombre: 'Río Cuarto',
        descripcion: 'Segunda ciudad de la provincia y cabecera del sur cordobés. Acá el mapa cambia: las regionales del interior (Sancor Salud, Federada, Avalian, Prevención) tienen cartillas más profundas que varias nacionales premium. Antes de contratar, verificá qué sanatorios locales incluye tu plan.',
        prestadores: [],
      },
      {
        slug: 'villa-carlos-paz', nombre: 'Villa Carlos Paz',
        descripcion: 'La ciudad turística del Valle de Punilla suma población estable año a año. La mayoría de los afiliados combina atención local para consultas con derivación a Córdoba capital (a 36 km) para alta complejidad — un factor clave al elegir prepaga: mirá la cartilla de capital, no solo la local.',
        prestadores: [],
      },
      {
        slug: 'villa-maria', nombre: 'Villa María',
        descripcion: 'Polo agroindustrial del centro-este cordobés donde las prepagas de origen cooperativo y regional (Sancor Salud, Federada, Avalian) son históricamente fuertes. Las nacionales premium cubren, pero con redes más chicas que en capital.',
        prestadores: [],
      },
    ],
    prestadoresClave: ['Hospital Privado Universitario de Córdoba', 'Sanatorio Allende', 'Clínica Universitaria Reina Fabiola', 'Sanatorio del Salvador'],
    obraSocialProvincial: {
      sigla: 'APROSS',
      nombre: 'Administración Provincial del Seguro de Salud',
      nota: 'Es la obra social de los empleados públicos de la provincia de Córdoba: no se puede contratar de forma voluntaria. Si tenés APROSS y buscás más cobertura, podés complementar con una prepaga.',
    },
    faq: [
      { q: '¿Cuál es la mejor prepaga en Córdoba?', a: 'Depende de dónde vivas y qué priorices. En Córdoba capital, Swiss Medical y OSDE tienen las cartillas premium más completas; Nobis (cordobesa) suma centros propios; y en el interior provincial las regionales como Sancor Salud, Federada y Avalian suelen tener mejor cartilla efectiva que las nacionales. Nuestro ranking pondera cartilla local, precio y satisfacción.' },
      { q: '¿Qué prepagas tienen cartilla en el interior de Córdoba?', a: 'Sancor Salud, Federada Salud, Avalian y Prevención Salud son las de mayor presencia en ciudades como Río Cuarto, Villa María y San Francisco. Las premium nacionales cubren el interior pero con redes más acotadas que en capital.' },
      { q: 'Tengo APROSS, ¿puedo contratar una prepaga igual?', a: 'Sí. APROSS es la obra social de los empleados públicos cordobeses y no se elige voluntariamente, pero podés contratar una prepaga en paralelo para acceder a cartilla privada. Muchos afiliados lo hacen para internación y especialistas.' },
      { q: '¿Cuánto cuesta una prepaga en Córdoba?', a: 'Los precios de lista son los mismos que en el resto del país para la mayoría de las prepagas nacionales: van desde ~$150.000/mes para un adulto joven en planes de entrada hasta más de $450.000 en planes premium. Cotizá por edad y zona para ver el precio exacto con descuentos.' },
    ],
    fechaVerificacion: '2026-07-14',
  },
  {
    slug: 'salta',
    nombre: 'Salta',
    zonaKey: 'salta',
    capitalNombre: 'Salta capital',
    descripcion:
      'En Salta el mercado de la medicina privada tiene un jugador propio que las comparativas nacionales suelen ignorar: Boreal Salud, la prepaga del NOA, con cartilla salteña publicada y centros médicos propios en la región. Conviven con ella las nacionales (OSDE, Swiss Medical, Galeno) y las regionales del interior (Sancor Salud, Prevención). La red privada de la capital está encabezada por el Sanatorio El Carmen, la Clínica Güemes, el Sanatorio San Roque y la Clínica Urkupiña.',
    rankingIntro:
      'Ranking según cartilla efectiva en la provincia de Salta: acá pesa tener prestadores reales en la capital y el interior (Orán, Tartagal, Metán), no el tamaño nacional de la empresa.',
    prepagas: [
      {
        slug: 'boreal', nombre: 'Boreal Salud', enSitio: false, fuerza: 'fuerte', verificado: true,
        resumen: 'La prepaga del norte argentino: más de 30 sucursales en NOA/NEA y 260.000 beneficiarios, con cartilla específica de Salta publicada oficialmente. Centros médicos propios, telemedicina, urgencias 24 hs e internación al 100%. Para quien vive en Salta, es la referencia local a comparar antes que cualquier nacional.',
        cartillaLocal: ['Cartilla de Salta publicada (PDF oficial en borealsalud.com.ar)', 'Centros médicos propios en la región NOA', 'Urgencias 24 hs y telemedicina incluidas'],
      },
      {
        slug: 'swiss-medical', nombre: 'Swiss Medical', enSitio: true, fuerza: 'media', verificado: true,
        resumen: 'Presencia en Salta capital con cartilla premium más acotada que en Buenos Aires o Córdoba. Es una buena opción si viajás seguido o querés respaldo nacional, verificando antes qué sanatorios salteños incluye tu plan.',
        cartillaLocal: ['Cobertura en Salta capital', 'Cartilla más acotada que en AMBA — verificar prestadores por plan'],
      },
      {
        slug: 'osde', nombre: 'OSDE', enSitio: true, fuerza: 'fuerte', verificado: true,
        resumen: 'La filial Salta de OSDE ofrece la cartilla abierta más reconocida del segmento premium en la provincia, con acceso a los principales sanatorios privados de la capital.',
        cartillaLocal: ['Filial propia en Salta', 'Acceso a los principales sanatorios privados de la capital'],
      },
      {
        slug: 'sancor-salud', nombre: 'Sancor Salud', enSitio: true, fuerza: 'fuerte', verificado: true,
        resumen: 'Publica cartilla provincial específica y mantiene una red sólida en el NOA. Para grupos familiares del interior salteño suele ser de las opciones con mejor relación cartilla/precio.',
        cartillaLocal: ['Cartilla provincial publicada (PDF oficial)', 'Red consolidada en el NOA'],
      },
      {
        slug: 'prevencion-salud', nombre: 'Prevención Salud', enSitio: true, fuerza: 'fuerte', verificado: true,
        resumen: 'Del grupo Sancor Seguros, con presencia notable en el interior del país. En Salta compite en el segmento accesible con cobertura nacional incluida.',
        cartillaLocal: ['Oficinas en la región', 'Plan A1 con cobertura nacional'],
      },
      {
        slug: 'galeno', nombre: 'Galeno', enSitio: true, fuerza: 'media', verificado: true,
        resumen: 'Sucursal propia en Salta capital (España 414) y cobertura nacional en todos los planes. Sus sanatorios propios están en Buenos Aires, así que en Salta la atención es por cartilla de convenio.',
        cartillaLocal: ['Sucursal Salta: España 414', 'Cobertura por convenios locales'],
      },
      {
        slug: 'nobis', nombre: 'Nobis Salud', enSitio: false, fuerza: 'media', verificado: true,
        resumen: 'La cordobesa Nobis abrió sucursal en Salta como parte de su expansión por el norte. Cartilla en crecimiento: vale cotizarla como alternativa accesible frente a las nacionales.',
        cartillaLocal: ['Sucursal de atención en Salta', 'Red en expansión en el NOA'],
      },
    ],
    localidades: [
      {
        slug: 'salta-capital', nombre: 'Salta capital',
        descripcion: 'La capital concentra la red privada provincial: Sanatorio El Carmen, Clínica Güemes, Sanatorio San Roque, Clínica Urkupiña, Sanatorio Modelo y el Hospital Santa Clara de Asís. Acá Boreal juega de local y las nacionales premium tienen sus cartillas más completas de la provincia.',
        prestadores: ['Sanatorio El Carmen', 'Clínica Güemes', 'Sanatorio San Roque', 'Clínica Urkupiña', 'Sanatorio Modelo', 'Hospital Santa Clara de Asís'],
      },
      {
        slug: 'oran', nombre: 'San Ramón de la Nueva Orán',
        descripcion: 'Cabecera del norte salteño, a 270 km de la capital. La cobertura efectiva acá es el filtro decisivo: las regionales del NOA (Boreal, Sancor) tienen presencia real, mientras que varias nacionales premium derivan la alta complejidad a Salta capital.',
        prestadores: [],
      },
      {
        slug: 'tartagal', nombre: 'Tartagal',
        descripcion: 'Centro del departamento San Martín, zona de actividad hidrocarburífera. Igual que en Orán, conviene priorizar prepagas con cartilla local real (Boreal, Sancor Salud) y verificar derivaciones a capital para internación compleja.',
        prestadores: [],
      },
    ],
    prestadoresClave: ['Sanatorio El Carmen', 'Clínica Güemes', 'Sanatorio San Roque', 'Clínica Urkupiña', 'Sanatorio Modelo', 'Hospital Santa Clara de Asís'],
    obraSocialProvincial: {
      sigla: 'IPS Salta',
      nombre: 'Instituto Provincial de Salud de Salta',
      nota: 'La obra social provincial con mayor cobertura de Salta (empleados públicos provinciales); no es de contratación voluntaria. En diciembre de 2025 firmó un convenio con las clínicas privadas de ACLISASA para atención de guardia sin copagos. Si tenés IPS y buscás cartilla privada completa, podés complementar con una prepaga.',
    },
    faq: [
      { q: '¿Cuál es la mejor prepaga en Salta?', a: 'Para cartilla local, Boreal Salud es la referencia regional del NOA con red propia en Salta; OSDE y Swiss Medical lideran el segmento premium en la capital; Sancor Salud y Prevención destacan en relación precio/cartilla, especialmente fuera de la capital.' },
      { q: '¿Boreal Salud es buena opción en Salta?', a: 'Es la prepaga con más presencia regional del NOA: 30+ sucursales, 260.000 beneficiarios, cartilla salteña publicada, centros propios, urgencias 24 hs y telemedicina. Para residentes de Salta suele ser la primera a cotizar y comparar contra las nacionales.' },
      { q: 'Tengo IPS Salta, ¿puedo sumar una prepaga?', a: 'Sí. IPS es la obra social provincial y no se puede elegir voluntariamente, pero muchos afiliados contratan además una prepaga para acceder a sanatorios privados sin restricciones. Desde el convenio IPS–ACLISASA (dic. 2025) la guardia privada mejoró, pero la cartilla completa sigue siendo terreno de las prepagas.' },
      { q: '¿Qué sanatorios privados hay en Salta capital?', a: 'Los principales son el Sanatorio El Carmen, la Clínica Güemes, el Sanatorio San Roque, la Clínica Urkupiña, el Sanatorio Modelo y el Hospital Santa Clara de Asís. Qué cubra cada prepaga depende del plan: verificalo al cotizar.' },
    ],
    fechaVerificacion: '2026-07-14',
  },
  {
    slug: 'neuquen',
    nombre: 'Neuquén',
    zonaKey: 'neuquen',
    capitalNombre: 'Neuquén capital',
    descripcion:
      'Neuquén es el mercado de medicina privada que más creció en la Patagonia, empujado por Vaca Muerta y los salarios del sector energético. Swiss Medical tiene centro médico propio en la capital, OSDE es históricamente fuerte en la región y Sancor Salud publica cartilla provincial específica. La red privada local incluye al Sanatorio San Carlos y la Clínica Pasteur, con derivaciones frecuentes al Alto Valle rionegrino (Cipolletti, General Roca) — un dato clave: mirá la cartilla de las dos provincias.',
    rankingIntro:
      'Ranking según cartilla efectiva en la provincia de Neuquén y el corredor del Alto Valle. En una zona con alta demanda y red privada acotada, tener prestadores reales acá vale más que el tamaño nacional.',
    prepagas: [
      {
        slug: 'swiss-medical', nombre: 'Swiss Medical', enSitio: true, fuerza: 'fuerte', verificado: true,
        resumen: 'Es la única premium con centro médico propio en Neuquén capital (Fotheringham 155) más dos puntos de atención (Av. Argentina 376 y Diagonal 25 de Mayo 160). Para el perfil de ingresos altos del sector energético, es la referencia local.',
        cartillaLocal: ['Centro médico propio: Fotheringham 155', 'Sucursales: Av. Argentina 376 y Diag. 25 de Mayo 160', 'Cartilla premium en capital y Alto Valle'],
      },
      {
        slug: 'osde', nombre: 'OSDE', enSitio: true, fuerza: 'fuerte', verificado: true,
        resumen: 'Filial propia y décadas de presencia patagónica: OSDE es la cartilla abierta más buscada por las familias del sector petrolero y profesional de Neuquén, con red en capital y derivaciones fluidas al Alto Valle.',
        cartillaLocal: ['Filial Neuquén', 'Red consolidada en capital y Alto Valle', 'Cobertura de derivaciones de alta complejidad'],
      },
      {
        slug: 'sancor-salud', nombre: 'Sancor Salud', enSitio: true, fuerza: 'fuerte', verificado: true,
        resumen: 'Publica cartilla específica de la provincia de Neuquén (documento oficial) y mantiene red en las principales ciudades. Es de las opciones más equilibradas en precio/cartilla para grupos familiares de la zona.',
        cartillaLocal: ['Cartilla provincial Neuquén publicada (PDF oficial)', 'Red en Neuquén capital y ciudades del interior'],
      },
      {
        slug: 'galeno', nombre: 'Galeno', enSitio: true, fuerza: 'media', verificado: true,
        resumen: 'Sucursal propia en Neuquén capital (Santa Fe y Diagonal España) y otra en Bariloche. Cobertura nacional por convenio: sus sanatorios propios (Trinidad) están en Buenos Aires.',
        cartillaLocal: ['Sucursal Neuquén: Santa Fe y Diagonal España', 'Sucursal cercana en Bariloche', 'Atención por cartilla de convenio'],
      },
      {
        slug: 'prevencion-salud', nombre: 'Prevención Salud', enSitio: true, fuerza: 'media', verificado: false,
        resumen: 'Red nacional con foco en el interior. En Neuquén es una alternativa accesible frente a las premium; la densidad exacta de su cartilla local conviene confirmarla al cotizar.',
        cartillaLocal: ['Cobertura nacional declarada', 'Cartilla neuquina sujeta a verificación al cotizar'],
      },
      {
        slug: 'avalian', nombre: 'Avalian', enSitio: true, fuerza: 'media', verificado: false,
        resumen: 'La cooperativa con llegada de interior también opera en la Patagonia norte. Compite en precio; su cartilla local es más acotada que la de Swiss/OSDE, verificala según tu ciudad.',
        cartillaLocal: ['Presencia declarada en la región', 'Cartilla sujeta a verificación al cotizar'],
      },
      {
        slug: 'medife', nombre: 'Medifé', enSitio: true, fuerza: 'media', verificado: false,
        resumen: 'Cobertura nacional con buena relación precio-calidad. En Neuquén su red es razonable en capital; para el interior provincial (Cutral Có, Zapala, San Martín de los Andes) verificá prestadores antes de contratar.',
        cartillaLocal: ['Cobertura nacional declarada', 'Verificar cartilla en ciudades del interior neuquino'],
      },
    ],
    localidades: [
      {
        slug: 'neuquen-capital', nombre: 'Neuquén capital',
        descripcion: 'El principal polo de salud privada de la Patagonia norte: Sanatorio San Carlos, Clínica Pasteur y el centro médico propio de Swiss Medical. La demanda creció fuerte con Vaca Muerta, así que los turnos con especialistas premium se valoran tanto como el precio.',
        prestadores: ['Sanatorio San Carlos', 'Clínica Pasteur'],
      },
      {
        slug: 'cutral-co', nombre: 'Cutral Có – Plaza Huincul',
        descripcion: 'El corazón petrolero histórico de la provincia. La mayoría de los trabajadores tiene cobertura por convenio (OSPEPRI u otras del sector) y complementa con prepaga para la familia; la alta complejidad deriva a Neuquén capital, a 100 km.',
        prestadores: [],
      },
      {
        slug: 'san-martin-de-los-andes', nombre: 'San Martín de los Andes',
        descripcion: 'Destino cordillerano con población estable creciente. La atención local cubre consultas y urgencias; la alta complejidad deriva a Neuquén capital o Bariloche. Al elegir prepaga, pesá la cartilla de esas dos ciudades además de la local.',
        prestadores: [],
      },
    ],
    prestadoresClave: ['Sanatorio San Carlos', 'Clínica Pasteur'],
    obraSocialProvincial: {
      sigla: 'ISSN',
      nombre: 'Instituto de Seguridad Social del Neuquén',
      nota: 'La obra social de los empleados públicos provinciales y municipales de Neuquén (creada por ley provincial 611 en 1970); no es de contratación voluntaria. Junto a OSPEPRI (petroleros privados) y OSECAC concentra la mayor cantidad de afiliados de la provincia. Se puede complementar con una prepaga.',
    },
    faq: [
      { q: '¿Cuál es la mejor prepaga en Neuquén?', a: 'Swiss Medical es la única premium con centro médico propio en la capital y OSDE tiene la red abierta más consolidada de la región. Sancor Salud, con cartilla provincial publicada, es la alternativa regional más equilibrada en precio. El ranking completo pondera cartilla local, precio y satisfacción.' },
      { q: '¿Qué cobertura conviene si trabajo en Vaca Muerta?', a: 'La mayoría de los trabajadores petroleros ya tiene obra social de convenio (como OSPEPRI). Lo habitual es complementarla con una prepaga para el grupo familiar, priorizando cartilla en Neuquén capital y Añelo/Alto Valle, y urgencias 24 hs.' },
      { q: 'Tengo ISSN, ¿puedo contratar una prepaga?', a: 'Sí. El ISSN es la obra social de los empleados públicos neuquinos y no se elige voluntariamente, pero podés contratar una prepaga en paralelo para acceder a la red privada (Sanatorio San Carlos, Clínica Pasteur y derivaciones al Alto Valle).' },
      { q: '¿Las prepagas cubren derivaciones a Río Negro?', a: 'Las principales (Swiss Medical, OSDE, Sancor, Galeno) tienen cartilla en el corredor Neuquén–Cipolletti–General Roca, donde la red privada funciona de forma integrada. Verificá que tu plan incluya prestadores de ambas provincias: es el punto que más diferencia a los planes en esta zona.' },
    ],
    fechaVerificacion: '2026-07-14',
  },
]

export function getProvinciaSEO(slug: string): ProvinciaSEO | undefined {
  return provinciasSEO.find((p) => p.slug === slug)
}
