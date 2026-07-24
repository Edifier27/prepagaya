// "¿A cuál cambiarte?" — recomendaciones de switch entre prepagas, basadas en
// precios reales de lib/data/prepagas.ts (no estimaciones). Cada entrada compara
// el plan sin-copago/red-abierta más representativo de la prepaga de origen
// contra el destino, con el delta de precio calculado, no redondeado a ojo.
// Actualizar cuando cambien los precios de lista (PRECIO_ACTUALIZADO).

export interface CambioRecomendado {
  slug: string
  origenSlug: string
  origenNombre: string
  origenPlanNombre: string
  origenPrecio: number
  destinoSlug: string
  destinoNombre: string
  destinoPlanSlug: string
  destinoPlanNombre: string
  destinoPrecio: number
  // Positivo = ahorrás cambiándote; negativo = pagás un poco más.
  deltaMensual: number
  gancho: string
  razon: string
  paraQuienNo: string // honestidad: cuándo este cambio NO conviene
  ganas: string[] // lo que sumás al cambiarte, con base en datos reales de ambas empresas
  perdes: string[] // lo que la prepaga de origen ofrece y el destino no iguala — tradeoff honesto
  faqExtra: { q: string; a: string }[]
  comparativaSlug?: string // link cruzado a /comparativas/[slug] si existe el análisis "vs"
}

export const cambiosRecomendados: CambioRecomendado[] = [
  {
    slug: 'osde-a-swiss-medical',
    origenSlug: 'osde',
    origenNombre: 'OSDE',
    origenPlanNombre: 'Plan 310',
    origenPrecio: 345310,
    destinoSlug: 'swiss-medical',
    destinoNombre: 'Swiss Medical',
    destinoPlanSlug: 'smg20',
    destinoPlanNombre: 'Plan SMG20',
    destinoPrecio: 325467,
    deltaMensual: 345310 - 325467,
    gancho: 'Mismo nivel de cobertura, menos cuota',
    razon: 'El OSDE 310 y el Swiss Medical SMG20 están en la misma categoría: sin copago, red abierta, plan más elegido de cada empresa. La diferencia es que Swiss Medical suma 8 sanatorios propios (OSDE no tiene sanatorios propios, trabaja 100% con convenios) y sale $19.843 menos por mes. Si tu prioridad es no perder cartilla y bajar la cuota, es el cambio más directo del mercado.',
    paraQuienNo: 'Si usás específicamente el Hospital Alemán o necesitás la red nacional de 140.000 profesionales de OSDE fuera de las zonas donde Swiss Medical tiene centros propios, quedate en OSDE.',
    ganas: ['8 sanatorios propios (Suizo Argentina, Los Arcos, Agote, Zabala, Olivos, San Lucas)', 'Guardia Ágil: reservás turno de guardia desde el celular', '30 sesiones de psicología por año sin cargo', '40% de descuento en farmacias adheridas'],
    perdes: ['Red de 140.000 profesionales de OSDE (Swiss declara 81.500)', 'Hospital Alemán en cartilla desde el plan 310', 'Plan Flux para menores de 35 con psicología ilimitada'],
    faqExtra: [
      { q: '¿Swiss Medical SMG20 cubre el Hospital Alemán como OSDE 310?', a: 'No está confirmado en la cartilla de Swiss Medical. Si el Hospital Alemán es un prestador clave para vos, verificalo puntualmente antes de dar de baja OSDE — es la principal razón real para no hacer este cambio.' },
      { q: '¿Por qué Swiss Medical es más barato si tiene sanatorios propios?', a: 'Porque OSDE no tiene infraestructura propia y terceriza el 100% de la atención por convenios, lo que encarece su estructura de costos. Swiss Medical, al ser dueño de sus sanatorios, controla mejor ese costo y lo traslada a una cuota más baja en el plan equivalente.' },
    ],
    comparativaSlug: 'swiss-medical-vs-osde',
  },
  {
    slug: 'sancor-salud-a-swiss-medical',
    origenSlug: 'sancor-salud',
    origenNombre: 'Sancor Salud',
    origenPlanNombre: 'Plan 1000',
    origenPrecio: 362701,
    destinoSlug: 'swiss-medical',
    destinoNombre: 'Swiss Medical',
    destinoPlanSlug: 'smg20',
    destinoPlanNombre: 'Plan SMG20',
    destinoPrecio: 325467,
    deltaMensual: 362701 - 325467,
    gancho: 'Pagás menos y subís de cartilla',
    razon: 'El Plan 1000 de Sancor cuesta $362.701 y no tiene sanatorios propios. El SMG20 de Swiss Medical cuesta $37.234 menos por mes y suma 8 sanatorios propios de primer nivel. Es habitual que las promociones de ingreso de Sancor terminen y el afiliado quede pagando más que un plan equivalente de Swiss — comparalo con tu recibo actual, no con el precio con el que entraste.',
    paraQuienNo: 'Si vivís en el interior productivo (Córdoba, Santa Fe, Entre Ríos) donde Sancor tiene cartilla más profunda que Swiss Medical, este cambio pierde sentido: quedate con Sancor o mirá otra regional local.',
    ganas: ['8 sanatorios propios (Sancor no tiene ninguno)', 'Calidad de cartilla 5/5 contra 3/5 de Sancor', '30 sesiones de psicología por año sin cargo', 'Guardia Ágil desde el celular'],
    perdes: ['Cobertura nacional más profunda en el interior del país (Córdoba, Santa Fe, Entre Ríos)', 'Precio de entrada más accesible en los planes básicos (F700/F800) para quien recién empieza'],
    faqExtra: [
      { q: '¿Por qué termino pagando más en Sancor de lo que esperaba?', a: 'Es un patrón habitual del mercado: muchas prepagas ofrecen descuentos de ingreso por los primeros meses que después se retiran, quedando el afiliado con el precio de lista completo. Revisá tu recibo actual (no el precio con el que entraste) contra el del plan equivalente en otra empresa.' },
      { q: '¿Sancor es mejor que Swiss Medical en algún lado?', a: 'Sí: en el interior del país, especialmente Córdoba y Santa Fe, Sancor suele tener cartilla más profunda que las nacionales premium. Si vivís fuera de AMBA, verificá la cobertura local de ambas antes de cambiarte.' },
    ],
    comparativaSlug: 'swiss-medical-vs-sancor-salud',
  },
  {
    slug: 'avalian-a-swiss-medical',
    origenSlug: 'avalian',
    origenNombre: 'Avalian',
    origenPlanNombre: 'Plan Full',
    origenPrecio: 378200,
    destinoSlug: 'swiss-medical',
    destinoNombre: 'Swiss Medical',
    destinoPlanSlug: 'smg20',
    destinoPlanNombre: 'Plan SMG20',
    destinoPrecio: 325467,
    deltaMensual: 378200 - 325467,
    gancho: 'Menor cuota, más sanatorios propios',
    razon: 'El Plan Full de Avalian ($378.200) y el SMG20 de Swiss Medical ($325.467) cubren lo mismo — sin copago, red abierta — pero Swiss sale $52.733 menos por mes y con 8 sanatorios propios contra 5 de Avalian, todos concentrados en AMBA.',
    paraQuienNo: 'Si estás fuera de AMBA/GBA, Avalian declara cobertura en más de 24 provincias: verificá primero que Swiss Medical tenga cartilla real en tu ciudad antes de cambiarte.',
    ganas: ['8 sanatorios propios contra 5 de Avalian', 'Calidad de cartilla 5/5 contra 3/5', 'Ahorro de $52.733/mes, el mayor de esta comparación'],
    perdes: ['Cobertura declarada en más de 24 provincias (mayor despliegue territorial fuera de AMBA)', 'App con receta digital y credencial 100% digital'],
    faqExtra: [
      { q: '¿Avalian y Swiss Medical tienen los mismos sanatorios propios?', a: 'No. Los 5 sanatorios propios de Avalian están concentrados en AMBA (entre ellos Las Lomas y 25 de Mayo); los 8 de Swiss Medical incluyen Suizo Argentina, Los Arcos y Agote, también en AMBA pero con mayor cantidad de centros. Fuera de AMBA, ambas dependen de convenios.' },
      { q: '¿Por qué Avalian es más cara si es una prepaga de origen cooperativo?', a: 'El Plan Full de Avalian es su plan sin copago de mayor cobertura, lo que eleva el precio frente al SMG20 de Swiss, que es el plan más elegido pero de un escalón similar. Los planes de entrada de Avalian (Básico, Plus) sí son más económicos que Swiss, pero tienen copago.' },
    ],
  },
  {
    slug: 'prevencion-salud-a-swiss-medical',
    origenSlug: 'prevencion-salud',
    origenNombre: 'Prevención Salud',
    origenPlanNombre: 'Plan Oro',
    origenPrecio: 340500,
    destinoSlug: 'swiss-medical',
    destinoNombre: 'Swiss Medical',
    destinoPlanSlug: 'smg20',
    destinoPlanNombre: 'Plan SMG20',
    destinoPrecio: 325467,
    deltaMensual: 340500 - 325467,
    gancho: 'Pagás menos por una cartilla más sólida',
    razon: 'El Plan Oro de Prevención Salud ($340.500) no tiene sanatorios propios. El SMG20 de Swiss Medical cuesta $15.033 menos y suma 8 centros propios, con mejor calificación de cartilla (5/5 contra 3/5) y más satisfacción declarada de afiliados.',
    paraQuienNo: 'Si valorás la atención personalizada y ya tenés un vínculo armado con prestadores de Prevención en tu zona, el ahorro es chico — evaluá si vale la pena mover todo el grupo familiar por $15.000/mes.',
    ganas: ['8 sanatorios propios (Prevención no tiene ninguno)', 'Calidad de cartilla 5/5 contra 3/5', 'Satisfacción declarada 76% contra 71%'],
    perdes: ['Cobertura nacional en 23 provincias (más amplia que Swiss fuera de sus zonas fuertes)', 'Planes específicos para monotributistas', 'Atención personalizada de una empresa más chica'],
    faqExtra: [
      { q: '¿Vale la pena cambiarse por solo $15.000 de diferencia?', a: 'Depende de cuánto usás el sistema. Si tu grupo familiar consulta seguido o podría necesitar internación, el salto de calidad de cartilla (3/5 a 5/5) y sumar 8 sanatorios propios suele justificar una diferencia chica de precio. Si usás poco el sistema, el ahorro no compensa el trámite de cambio.' },
      { q: '¿Prevención Salud cubre el interior del país mejor que Swiss Medical?', a: 'Sí, Prevención Salud declara cobertura en 23 provincias, más amplia que la de Swiss Medical fuera de sus zonas de mayor presencia. Si vivís fuera de AMBA, Córdoba, Rosario o Mendoza, verificá la cartilla local antes de cambiarte.' },
    ],
  },
  {
    slug: 'medife-a-swiss-medical',
    origenSlug: 'medife',
    origenNombre: 'Medifé',
    origenPlanNombre: 'Plan Plata',
    origenPrecio: 309892,
    destinoSlug: 'swiss-medical',
    destinoNombre: 'Swiss Medical',
    destinoPlanSlug: 'smg20',
    destinoPlanNombre: 'Plan SMG20',
    destinoPrecio: 325467,
    deltaMensual: 309892 - 325467,
    gancho: 'Casi el mismo precio, una cartilla mucho más grande',
    razon: 'Este caso es distinto a los demás: el Plan Plata de Medifé ($309.892) ya es uno de los planes sin copago más baratos del mercado, así que no hay ahorro real cambiándose. Lo que sí hay es una diferencia de cartilla enorme para una diferencia de precio chica: por apenas $15.575 más por mes, el SMG20 de Swiss Medical suma 8 sanatorios propios contra el sanatorio único (Finochietto) de Medifé.',
    paraQuienNo: 'Si tu prioridad es el precio más bajo posible y no usás sanatorios de alta complejidad seguido, Medifé Plata sigue siendo una opción sólida — no hay ahorro cambiándote, solo más cartilla por un poco más de plata.',
    ganas: ['8 sanatorios propios contra el acceso a Finochietto de Medifé', 'Calidad de cartilla 5/5 contra 3/5', 'Guardia Ágil y 30 sesiones de psicología sin cargo'],
    perdes: ['Cam Doctor: médico por videoconsulta en menos de 10 minutos', 'Cobertura oficial de la AFA', 'Plan Indie pensado para monotributistas', 'Cobertura en Brasil incluida en varios planes'],
    faqExtra: [
      { q: '¿Por qué cambiarme si Medifé ya es barato?', a: 'No es una cuestión de precio: es una cuestión de cartilla. Por una diferencia de apenas $15.575/mes pasás de acceder a un solo sanatorio de alta complejidad (Finochietto) a tener 8 sanatorios propios disponibles. Si esa diferencia no te cambia la vida, quedate en Medifé — es una decisión legítima.' },
      { q: '¿Pierdo el Cam Doctor de Medifé si me cambio?', a: 'Sí, Cam Doctor (videoconsulta médica en menos de 10 minutos) es un servicio propio de Medifé que Swiss Medical no ofrece con ese formato. Swiss tiene Guardia Ágil (reserva de turno de guardia desde el celular), que resuelve un problema distinto.' },
    ],
    comparativaSlug: 'medife-vs-swiss-medical',
  },
  {
    slug: 'omint-a-osde',
    origenSlug: 'omint',
    origenNombre: 'Omint',
    origenPlanNombre: 'Plan Global',
    origenPrecio: 437027,
    destinoSlug: 'osde',
    destinoNombre: 'OSDE',
    destinoPlanSlug: '310',
    destinoPlanNombre: 'Plan 310',
    destinoPrecio: 345310,
    deltaMensual: 437027 - 345310,
    gancho: 'Mucha más red por bastante menos plata',
    razon: 'El Plan Global de Omint cuesta $437.027 y su red está concentrada en 3 sanatorios propios de CABA/GBA (Bazterrica, Del Sol, Santa Isabel). El Plan 310 de OSDE cuesta $91.717 menos por mes y da acceso a una red de 140.000 profesionales en todo el país, incluido el Hospital Alemán.',
    paraQuienNo: 'Si elegiste Omint específicamente por sus 3 sanatorios propios o por la cobertura internacional incluida en todos los planes, OSDE no te da lo mismo — quedate en Omint.',
    ganas: ['Red de 140.000 profesionales contra 10.000 de Omint', '380+ centros de atención en todo el país', 'Hospital Alemán en cartilla desde el plan 310', 'Ahorro de $91.717/mes, el mayor de toda esta comparación'],
    perdes: ['3 sanatorios propios de Omint (Bazterrica, Del Sol, Santa Isabel)', 'Cobertura internacional incluida en todos los planes (OSDE solo la incluye desde el plan 510)', 'Certificación ISO 9001 de Omint'],
    faqExtra: [
      { q: '¿OSDE tiene sanatorios propios como Omint?', a: 'No, OSDE no tiene sanatorios propios: trabaja 100% con red de convenios, aunque esa red es la más grande del país (140.000 profesionales). Omint tiene 3 sanatorios propios de alta complejidad, pero limitados a CABA/GBA.' },
      { q: '¿Por qué Omint es tan cara si su red es más chica que OSDE?', a: 'Omint invierte en infraestructura propia de alta complejidad (Bazterrica, Del Sol, Santa Isabel) y en beneficios como cobertura internacional incluida en todos los planes, lo que eleva el costo de estructura frente a un modelo de convenios como el de OSDE.' },
    ],
  },
]

export function getCambioBySlug(slug: string): CambioRecomendado | undefined {
  return cambiosRecomendados.find((c) => c.slug === slug)
}

export function getCambiosPorOrigen(origenSlug: string): CambioRecomendado[] {
  return cambiosRecomendados.filter((c) => c.origenSlug === origenSlug)
}

export function getCambiosPorDestino(destinoSlug: string): CambioRecomendado[] {
  return cambiosRecomendados.filter((c) => c.destinoSlug === destinoSlug)
}
