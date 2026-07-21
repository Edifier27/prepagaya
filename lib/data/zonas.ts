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
  {
    slug: 'santa-fe',
    nombre: 'Santa Fe',
    zonaKey: 'santa-fe',
    capitalNombre: 'Rosario y Santa Fe capital',
    descripcion:
      'Santa Fe es la cuna de la medicina prepaga del interior: acá nacieron Sancor Salud y Prevención Salud (Sunchales), Federada Salud (Rosario) y Jerárquicos Salud (Santa Fe capital). El resultado es el mercado más competitivo del país fuera de Buenos Aires, con dos polos privados fuertes: Rosario (Sanatorio Parque, Británico, Americano, de la Mujer) y Santa Fe capital (Sanatorio Güemes, San Gerónimo, Mayo). Las nacionales premium compiten fuerte en Rosario; en el interior provincial, las regionales suelen tener mejor cartilla efectiva.',
    rankingIntro:
      'Ranking según cartilla efectiva en la provincia de Santa Fe. Con cuatro prepagas de origen santafesino operando en su propia casa, acá las regionales juegan de local: el tamaño nacional pesa menos que en cualquier otra provincia.',
    prepagas: [
      {
        slug: 'sancor-salud', nombre: 'Sancor Salud', enSitio: true, fuerza: 'fuerte', verificado: true,
        resumen: 'Juega de local: nació en Sunchales y su cartilla santafesina es de las más profundas de la empresa, tanto en Rosario y la capital como en el interior productivo (Rafaela, Venado Tuerto, Reconquista).',
        cartillaLocal: ['Origen y casa central en Sunchales', 'Cartilla profunda en Rosario, Santa Fe capital e interior', 'Cartillas provinciales publicadas (PDF oficial)'],
      },
      {
        slug: 'federada-salud', nombre: 'Federada Salud', enSitio: true, fuerza: 'fuerte', verificado: true,
        resumen: 'Nacida en Rosario, con 250+ agencias en el país y 60.000+ profesionales. En su provincia de origen tiene una de las redes más consolidadas, especialmente fuerte en el sur santafesino.',
        cartillaLocal: ['Origen rosarino con red histórica en la provincia', 'Agencias de atención en las principales ciudades', 'Cobertura consolidada en el corredor Rosario–Santa Fe'],
      },
      {
        slug: 'swiss-medical', nombre: 'Swiss Medical', enSitio: true, fuerza: 'fuerte', verificado: true,
        resumen: 'Presencia consolidada en Rosario con cartilla premium en los grandes sanatorios de la ciudad. Es la opción de gama alta más elegida del sur provincial.',
        cartillaLocal: ['Cartilla premium en Rosario', 'Acceso a los principales sanatorios privados', 'Menor densidad en el interior provincial'],
      },
      {
        slug: 'osde', nombre: 'OSDE', enSitio: true, fuerza: 'fuerte', verificado: true,
        resumen: 'Filiales en Rosario y Santa Fe capital con la red abierta más amplia del segmento premium en ambas ciudades.',
        cartillaLocal: ['Filiales en Rosario y Santa Fe capital', 'Red premium en los dos polos privados de la provincia'],
      },
      {
        slug: 'prevencion-salud', nombre: 'Prevención Salud', enSitio: true, fuerza: 'fuerte', verificado: true,
        resumen: 'La otra sunchalense (grupo Sancor Seguros): red nacional con fuerza particular en su provincia de origen y planes accesibles con cobertura nacional.',
        cartillaLocal: ['Casa central en Sunchales', 'Red en capital, Rosario e interior', 'Respaldo del grupo Sancor Seguros'],
      },
      {
        slug: 'galeno', nombre: 'Galeno', enSitio: true, fuerza: 'media', verificado: true,
        resumen: 'Sucursales en Rosario y Santa Fe capital, con cobertura nacional por convenio. Sus sanatorios propios (Trinidad) están en Buenos Aires.',
        cartillaLocal: ['Sucursales en Rosario y Santa Fe capital', 'Atención por cartilla de convenio'],
      },
      {
        slug: 'medife', nombre: 'Medifé', enSitio: true, fuerza: 'media', verificado: false,
        resumen: 'Red nacional con buena relación precio-calidad y presencia razonable en Rosario. Para el interior provincial conviene verificar la cartilla al cotizar.',
        cartillaLocal: ['Cobertura nacional declarada', 'Cartilla del interior santafesino sujeta a verificación'],
      },
      {
        slug: 'avalian', nombre: 'Avalian', enSitio: true, fuerza: 'media', verificado: false,
        resumen: 'La cooperativa de origen agropecuario tiene llegada natural al interior santafesino. Compite en precio frente a las locales.',
        cartillaLocal: ['Presencia declarada en las principales ciudades', 'Cartilla sujeta a verificación al cotizar'],
      },
      {
        slug: 'jerarquicos-salud', nombre: 'Jerárquicos Salud', enSitio: false, fuerza: 'fuerte', verificado: true,
        resumen: 'Con casa central en Santa Fe capital, es una de las obras sociales/prepagas más elegidas de la ciudad y el centro-norte provincial. Planes PMI, PMI 2000, PMI 3000 y PMI Soltero (hasta 30 años), con descuentos de farmacia del 40 al 70%.',
        cartillaLocal: ['Casa central en Santa Fe capital', 'Muy fuerte en la capital y el centro-norte provincial', 'Red de farmacias con 40-70% de descuento'],
      },
    ],
    localidades: [
      {
        slug: 'rosario', nombre: 'Rosario',
        descripcion: 'El principal polo de salud privada del interior del país: Sanatorio Parque, Sanatorio Británico, Sanatorio Americano, Sanatorio de la Mujer, Sanatorio Norte y el Hospital Español, más el Hospital Italiano de Rosario. Acá compiten todas las prepagas con sus cartillas más completas de la provincia; la diferencia entre planes está en qué sanatorios de esta lista incluye cada uno.',
        prestadores: ['Sanatorio Parque', 'Sanatorio Británico', 'Sanatorio Americano', 'Sanatorio de la Mujer', 'Hospital Italiano de Rosario', 'Sanatorio Español'],
      },
      {
        slug: 'santa-fe-capital', nombre: 'Santa Fe capital',
        descripcion: 'La capital provincial tiene su propia red privada — Sanatorio Güemes, Sanatorio San Gerónimo, Sanatorio Mayo, Sanatorio Médico Quirúrgico — y un jugador local dominante: Jerárquicos Salud, con casa central en la ciudad. Las nacionales cubren, pero acá las regionales santafesinas tienen ventaja de cartilla.',
        prestadores: ['Sanatorio Güemes (Santa Fe)', 'Sanatorio San Gerónimo', 'Sanatorio Mayo (Santa Fe)', 'Sanatorio Médico Quirúrgico'],
      },
      {
        slug: 'rafaela', nombre: 'Rafaela',
        descripcion: 'El corazón de la cuenca lechera queda a 90 km de Sunchales, la ciudad donde nacieron Sancor Salud y Prevención Salud: acá esas dos marcas son casi la opción por defecto, con cartillas locales que las nacionales no igualan. Para alta complejidad, las derivaciones van a Santa Fe capital o Rosario.',
        prestadores: [],
      },
      {
        slug: 'venado-tuerto', nombre: 'Venado Tuerto',
        descripcion: 'Cabecera del sur agrícola santafesino, con atención local para consultas y urgencias y derivación a Rosario (160 km) para alta complejidad. Federada y Sancor tienen presencia histórica en la zona; al elegir plan, pesá la cartilla rosarina tanto como la local.',
        prestadores: [],
      },
    ],
    prestadoresClave: ['Sanatorio Parque (Rosario)', 'Sanatorio Británico (Rosario)', 'Sanatorio Americano (Rosario)', 'Sanatorio de la Mujer (Rosario)', 'Sanatorio Güemes (Santa Fe)', 'Sanatorio San Gerónimo'],
    obraSocialProvincial: {
      sigla: 'IAPOS',
      nombre: 'Instituto Autárquico Provincial de Obra Social',
      nota: 'La obra social de los empleados públicos de la provincia de Santa Fe; no es de contratación voluntaria. Muchos afiliados la complementan con una prepaga para acceder sin restricciones a los sanatorios privados de Rosario y la capital.',
    },
    faq: [
      { q: '¿Cuál es la mejor prepaga en Santa Fe?', a: 'Depende de la ciudad. En Rosario, Swiss Medical y OSDE tienen las cartillas premium más completas y Federada juega de local. En Santa Fe capital y el centro-norte, Jerárquicos Salud es el jugador dominante y Sancor/Prevención (nacidas en Sunchales) tienen cartillas muy profundas. Nuestro ranking pondera la cartilla efectiva por zona.' },
      { q: '¿Qué prepagas nacieron en Santa Fe?', a: 'Cuatro de las más importantes del interior: Sancor Salud y Prevención Salud (Sunchales), Federada Salud (Rosario) y Jerárquicos Salud (Santa Fe capital). Eso hace de Santa Fe el mercado más competitivo del país fuera de Buenos Aires — y suele traducirse en mejor relación precio/cartilla.' },
      { q: 'Tengo IAPOS, ¿puedo contratar una prepaga?', a: 'Sí. IAPOS es la obra social de los empleados públicos santafesinos y no se elige voluntariamente, pero podés contratar una prepaga en paralelo para sumar cartilla privada sin restricciones.' },
      { q: '¿Las prepagas cubren igual en Rosario que en el interior?', a: 'No. Las nacionales premium concentran su cartilla en Rosario y la capital; en ciudades como Rafaela, Venado Tuerto o Reconquista, las regionales santafesinas suelen tener redes más profundas. Verificá la cartilla de tu ciudad antes de decidir.' },
    ],
    fechaVerificacion: '2026-07-21',
  },
  {
    slug: 'mendoza',
    nombre: 'Mendoza',
    zonaKey: 'mendoza',
    capitalNombre: 'Mendoza capital',
    descripcion:
      'Mendoza tiene el mercado de salud privada más desarrollado de Cuyo, concentrado en el Gran Mendoza: Hospital Italiano de Mendoza, Hospital Privado, Clínica de Cuyo y Clínica Santa María encabezan la red. Las nacionales premium (OSDE, Swiss Medical) compiten con las regionales de precio (Sancor, Prevención, Avalian) y Galeno mantiene sucursal propia. Un dato local: el sur provincial (San Rafael, General Alvear) tiene su propia dinámica de cartilla, distinta a la del Gran Mendoza.',
    rankingIntro:
      'Ranking según cartilla efectiva en la provincia de Mendoza: pondera la red en el Gran Mendoza y la cobertura real en el interior provincial (San Rafael, este mendocino), no el tamaño nacional de cada empresa.',
    prepagas: [
      {
        slug: 'osde', nombre: 'OSDE', enSitio: true, fuerza: 'fuerte', verificado: true,
        resumen: 'Filial Mendoza con la red abierta más completa del segmento premium: los grandes sanatorios del Gran Mendoza están en cartilla y la marca es la referencia histórica de la provincia.',
        cartillaLocal: ['Filial propia en Mendoza', 'Cartilla premium en el Gran Mendoza', 'Cobertura de derivaciones de alta complejidad'],
      },
      {
        slug: 'swiss-medical', nombre: 'Swiss Medical', enSitio: true, fuerza: 'fuerte', verificado: true,
        resumen: 'Presencia consolidada en Mendoza capital con cartilla premium. Sus sanatorios propios están en Buenos Aires: acá la atención es por convenio con los grandes privados locales.',
        cartillaLocal: ['Cartilla premium en el Gran Mendoza', 'Convenios con los principales sanatorios privados', 'Menor densidad en el interior provincial'],
      },
      {
        slug: 'sancor-salud', nombre: 'Sancor Salud', enSitio: true, fuerza: 'fuerte', verificado: true,
        resumen: 'Red nacional con cartillas provinciales publicadas y buena profundidad en Mendoza, incluido el interior. De las opciones más equilibradas en precio/cartilla de la provincia.',
        cartillaLocal: ['Cartilla provincial publicada (PDF oficial)', 'Red en el Gran Mendoza y el interior'],
      },
      {
        slug: 'galeno', nombre: 'Galeno', enSitio: true, fuerza: 'media', verificado: true,
        resumen: 'Sucursal propia en Mendoza y cobertura nacional en todos sus planes. La atención es por cartilla de convenio: sus sanatorios propios (Trinidad) están en Buenos Aires.',
        cartillaLocal: ['Sucursal propia en Mendoza', 'Cobertura por convenios locales'],
      },
      {
        slug: 'prevencion-salud', nombre: 'Prevención Salud', enSitio: true, fuerza: 'media', verificado: true,
        resumen: 'Del grupo Sancor Seguros, con presencia notable en el interior del país. En Mendoza compite en el segmento accesible con cobertura nacional incluida.',
        cartillaLocal: ['Oficinas en la región', 'Plan A1 con cobertura nacional'],
      },
      {
        slug: 'avalian', nombre: 'Avalian', enSitio: true, fuerza: 'media', verificado: false,
        resumen: 'La cooperativa declara presencia en todas las ciudades importantes, Mendoza incluida. Compite en precio; la densidad exacta de su cartilla local conviene confirmarla al cotizar.',
        cartillaLocal: ['Presencia declarada en Mendoza', 'Cartilla sujeta a verificación al cotizar'],
      },
      {
        slug: 'medicus', nombre: 'Medicus', enSitio: true, fuerza: 'marginal', verificado: false,
        resumen: 'Su foco histórico es AMBA y el segmento premium. En Mendoza opera con red acotada: si tu prioridad es la cartilla local, hay opciones con más profundidad en la provincia.',
        cartillaLocal: ['Presencia acotada fuera de AMBA', 'Verificar cartilla local antes de contratar'],
      },
    ],
    localidades: [
      {
        slug: 'mendoza-capital', nombre: 'Mendoza capital',
        descripcion: 'El Gran Mendoza concentra la red privada de Cuyo: Hospital Italiano de Mendoza, Hospital Privado, Clínica de Cuyo, Clínica Santa María y el Sanatorio Fleming. Acá compiten todas las prepagas con sus mejores cartillas; la diferencia entre planes está en cuáles de estos centros incluye cada uno.',
        prestadores: ['Hospital Italiano Mendoza', 'Hospital Privado de Mendoza', 'Sanatorio Clínica de Cuyo', 'Clínica Santa María', 'Sanatorio Fleming'],
      },
      {
        slug: 'godoy-cruz', nombre: 'Godoy Cruz',
        descripcion: 'El departamento más poblado del Gran Mendoza comparte la red privada de la capital — la mayoría de los afiliados se atiende en los sanatorios del centro, a minutos de distancia. Al cotizar, la cartilla que importa es la del Gran Mendoza completo.',
        prestadores: [],
      },
      {
        slug: 'san-rafael', nombre: 'San Rafael',
        descripcion: 'La cabecera del sur mendocino, a 230 km de la capital, tiene su propia dinámica: la atención cotidiana es local y la alta complejidad deriva al Gran Mendoza. Acá el filtro decisivo es qué prepagas tienen prestadores reales en la ciudad — las regionales de precio suelen defenderse mejor que las premium.',
        prestadores: [],
      },
    ],
    prestadoresClave: ['Hospital Italiano Mendoza', 'Hospital Privado de Mendoza', 'Sanatorio Clínica de Cuyo', 'Clínica Santa María'],
    obraSocialProvincial: {
      sigla: 'OSEP',
      nombre: 'Obra Social de Empleados Públicos de Mendoza',
      nota: 'La obra social de los empleados públicos mendocinos, con red propia importante; no es de contratación voluntaria. Si tenés OSEP y buscás sanatorios privados sin restricciones, podés complementarla con una prepaga.',
    },
    faq: [
      { q: '¿Cuál es la mejor prepaga en Mendoza?', a: 'OSDE tiene la red abierta más completa del Gran Mendoza y Swiss Medical compite en el mismo segmento premium. En relación precio/cartilla, Sancor Salud y Prevención son las alternativas regionales más equilibradas. El ranking completo pondera cartilla local, precio y satisfacción.' },
      { q: '¿Qué sanatorios privados hay en Mendoza?', a: 'Los principales son el Hospital Italiano de Mendoza, el Hospital Privado, la Clínica de Cuyo, la Clínica Santa María y el Sanatorio Fleming, concentrados en el Gran Mendoza. Qué cubra cada prepaga depende del plan: verificalo al cotizar.' },
      { q: 'Tengo OSEP, ¿puedo sumar una prepaga?', a: 'Sí. OSEP es la obra social provincial de los empleados públicos y no se elige voluntariamente, pero muchos afiliados contratan una prepaga en paralelo para acceder a la red privada sin las demoras y restricciones del sistema.' },
      { q: '¿Las prepagas cubren bien en San Rafael?', a: 'La cobertura del sur mendocino es más acotada que la del Gran Mendoza en todas las empresas. Antes de contratar, verificá qué prestadores locales incluye tu plan y cómo funciona la derivación a la capital para alta complejidad.' },
    ],
    fechaVerificacion: '2026-07-21',
  },
  {
    slug: 'tucuman',
    nombre: 'Tucumán',
    zonaKey: 'tucuman',
    capitalNombre: 'San Miguel de Tucumán',
    descripcion:
      'Tucumán es la capital sanitaria del NOA: San Miguel de Tucumán concentra la red privada más densa del norte argentino — Sanatorio 9 de Julio, Clínica Mayo, Sanatorio Modelo, Sanatorio Parque, Instituto de Cardiología — y recibe derivaciones de todas las provincias vecinas. Además es la casa de Boreal Salud, la prepaga regional del NOA, que acá juega de local. Las nacionales compiten en el segmento premium y las regionales del centro (Sancor, Prevención, Nobis) completan un mercado con mucha oferta.',
    rankingIntro:
      'Ranking según cartilla efectiva en Tucumán: en la provincia con la red privada más densa del NOA, lo que pesa es qué sanatorios de San Miguel incluye cada plan y la cobertura real en el interior (Concepción, Tafí Viejo, Monteros).',
    prepagas: [
      {
        slug: 'boreal', nombre: 'Boreal Salud', enSitio: false, fuerza: 'fuerte', verificado: true,
        resumen: 'La prepaga del NOA juega de local: nació en Tucumán, tiene centros médicos propios en la región y 260.000+ beneficiarios en el norte. Para quien vive en la provincia es la referencia regional a comparar antes que cualquier nacional.',
        cartillaLocal: ['Origen tucumano con centros médicos propios', '30+ sucursales en NOA/NEA', 'Urgencias 24 hs y telemedicina incluidas'],
      },
      {
        slug: 'swiss-medical', nombre: 'Swiss Medical', enSitio: true, fuerza: 'fuerte', verificado: true,
        resumen: 'Presencia consolidada en San Miguel de Tucumán con cartilla premium en los grandes sanatorios de la ciudad. La opción de gama alta más elegida de la provincia junto a OSDE.',
        cartillaLocal: ['Cartilla premium en San Miguel de Tucumán', 'Convenios con los principales sanatorios'],
      },
      {
        slug: 'osde', nombre: 'OSDE', enSitio: true, fuerza: 'fuerte', verificado: true,
        resumen: 'Filial Tucumán con la red abierta más reconocida del segmento premium en el NOA, incluyendo los centros de alta complejidad que reciben derivaciones de toda la región.',
        cartillaLocal: ['Filial propia en Tucumán', 'Red premium con los centros de alta complejidad de la capital'],
      },
      {
        slug: 'sancor-salud', nombre: 'Sancor Salud', enSitio: true, fuerza: 'fuerte', verificado: true,
        resumen: 'Red nacional con cartillas provinciales publicadas y buena profundidad en el NOA. Para grupos familiares tucumanos es de las opciones más equilibradas en precio/cartilla.',
        cartillaLocal: ['Cartilla provincial publicada (PDF oficial)', 'Red en la capital y el interior tucumano'],
      },
      {
        slug: 'premedic', nombre: 'Premedic', enSitio: true, fuerza: 'media', verificado: true,
        resumen: 'Su cartilla declarada cubre AMBA, Córdoba, Rosario, Tucumán y Mendoza: la provincia es una de sus cinco zonas de operación. Alternativa de precio accesible con red más acotada que las grandes.',
        cartillaLocal: ['Tucumán entre sus cinco zonas de cobertura declaradas', 'Red más acotada que las prepagas grandes'],
      },
      {
        slug: 'prevencion-salud', nombre: 'Prevención Salud', enSitio: true, fuerza: 'media', verificado: true,
        resumen: 'Del grupo Sancor Seguros, con presencia en el interior del país. En Tucumán compite en el segmento accesible.',
        cartillaLocal: ['Oficinas en la región', 'Plan A1 con cobertura nacional'],
      },
      {
        slug: 'nobis', nombre: 'Nobis Salud', enSitio: false, fuerza: 'media', verificado: true,
        resumen: 'La cordobesa Nobis tiene sucursal en Tucumán como parte de su expansión por el norte. Cartilla en crecimiento: vale cotizarla como alternativa accesible.',
        cartillaLocal: ['Sucursal de atención en Tucumán', 'Red en expansión en el NOA'],
      },
      {
        slug: 'avalian', nombre: 'Avalian', enSitio: true, fuerza: 'media', verificado: false,
        resumen: 'Presencia declarada en las principales ciudades del país. En Tucumán compite en precio; verificá la densidad de su cartilla local al cotizar.',
        cartillaLocal: ['Presencia declarada en la provincia', 'Cartilla sujeta a verificación al cotizar'],
      },
      {
        slug: 'galeno', nombre: 'Galeno', enSitio: true, fuerza: 'marginal', verificado: false,
        resumen: 'Cobertura nacional por convenio, con presencia comercial acotada en el NOA — sus sucursales regionales más cercanas verificadas están en Salta. Si tu prioridad es la cartilla tucumana, hay opciones con más profundidad local.',
        cartillaLocal: ['Cobertura nacional declarada', 'Presencia local a verificar al cotizar'],
      },
    ],
    localidades: [
      {
        slug: 'san-miguel-de-tucuman', nombre: 'San Miguel de Tucumán',
        descripcion: 'La red privada más densa del NOA: Sanatorio 9 de Julio, Clínica Mayo, Sanatorio Modelo, Sanatorio Parque, Sanatorio Rivadavia, el Instituto de Cardiología y el Sanatorio Infantil San Lucas. La capital tucumana recibe derivaciones de Santiago del Estero, Catamarca y el sur de Salta — acá se define la cartilla que importa para toda la región.',
        prestadores: ['Sanatorio 9 de Julio', 'Clínica Mayo (Tucumán)', 'Sanatorio Modelo (Tucumán)', 'Sanatorio Parque', 'Instituto de Cardiología', 'Sanatorio Infantil San Lucas'],
      },
      {
        slug: 'yerba-buena', nombre: 'Yerba Buena',
        descripcion: 'La ciudad residencial del Gran San Miguel comparte la red privada de la capital, a minutos de distancia. Al cotizar, lo relevante es la cartilla del Gran Tucumán completo, no solo la local.',
        prestadores: [],
      },
      {
        slug: 'concepcion', nombre: 'Concepción',
        descripcion: 'La segunda ciudad de la provincia y cabecera del sur tucumano. La atención cotidiana es local y la alta complejidad deriva a San Miguel (80 km): al elegir prepaga, verificá tanto los prestadores locales como la cartilla de la capital.',
        prestadores: [],
      },
    ],
    prestadoresClave: ['Sanatorio 9 de Julio', 'Clínica Mayo (Tucumán)', 'Sanatorio Modelo (Tucumán)', 'Sanatorio Parque', 'Instituto de Cardiología'],
    obraSocialProvincial: {
      sigla: 'Subsidio de Salud',
      nombre: 'Instituto de Previsión y Seguridad Social de Tucumán (IPSST)',
      nota: 'La obra social de los empleados públicos tucumanos (conocida como Subsidio de Salud); no es de contratación voluntaria. Muchos afiliados la complementan con una prepaga para acceder a los sanatorios privados de San Miguel sin restricciones.',
    },
    faq: [
      { q: '¿Cuál es la mejor prepaga en Tucumán?', a: 'Boreal Salud juega de local con centros propios y precios regionales; Swiss Medical y OSDE lideran el segmento premium con los grandes sanatorios de San Miguel en cartilla; y Sancor Salud es la alternativa más equilibrada en precio/cartilla. El ranking completo pondera la cartilla efectiva en la provincia.' },
      { q: '¿Boreal Salud es buena opción en Tucumán?', a: 'Es la prepaga con más identidad regional del NOA y Tucumán es su casa: centros médicos propios, urgencias 24 hs, telemedicina y precios pensados para el norte. Para residentes tucumanos suele ser la primera a cotizar y comparar contra las nacionales.' },
      { q: 'Tengo el Subsidio de Salud (IPSST), ¿puedo sumar una prepaga?', a: 'Sí. El Subsidio es la obra social provincial de los empleados públicos y no se elige voluntariamente, pero podés contratar una prepaga en paralelo para acceder a la red privada de San Miguel sin restricciones.' },
      { q: '¿Qué sanatorios privados hay en San Miguel de Tucumán?', a: 'Los principales son el Sanatorio 9 de Julio, la Clínica Mayo, el Sanatorio Modelo, el Sanatorio Parque, el Sanatorio Rivadavia, el Instituto de Cardiología y el Sanatorio Infantil San Lucas. Qué cubra cada prepaga depende del plan: verificalo al cotizar.' },
    ],
    fechaVerificacion: '2026-07-21',
  },
]

export function getProvinciaSEO(slug: string): ProvinciaSEO | undefined {
  return provinciasSEO.find((p) => p.slug === slug)
}
