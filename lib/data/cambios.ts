import { prepagas } from './prepagas'

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
  /** slug del plan de origen en lib/data/prepagas.ts — de ahí sale el precio */
  origenPlanSlug: string
  // origenPrecio, destinoPrecio y deltaMensual se recalculan al final del
  // archivo desde lib/data/prepagas.ts (precio oficial SSSalud cuando existe):
  // los números escritos acá son solo el valor inicial.
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
    origenPlanSlug: '310',
    origenPrecio: 345310,
    destinoSlug: 'swiss-medical',
    destinoNombre: 'Swiss Medical',
    destinoPlanSlug: 'smg20',
    destinoPlanNombre: 'Plan SMG20',
    destinoPrecio: 346404,
    deltaMensual: 345310 - 346404,
    gancho: 'Mismo nivel de cobertura, con sanatorios propios',
    razon: 'El OSDE 310 y el Swiss Medical SMG20 están en la misma categoría: sin copago y plan más elegido de cada empresa (el SMG20 es de cartilla cerrada, sin reintegros), y a los 30 años el SMG20 sale menos según los cuadros tarifarios oficiales de la Superintendencia de Servicios de Salud. La diferencia es que Swiss Medical suma 9 sanatorios propios (OSDE no tiene sanatorios propios, trabaja 100% con convenios). Si tu prioridad es no perder cartilla y sumar sanatorios propios sin pagar de más, es el cambio más directo del mercado.',
    paraQuienNo: 'Si tenés 56 años o más: OSDE deja de aumentar por edad a partir de los 36 (el 310 tiene solo tres escalones: hasta 27, de 28 a 35 y de 36 en adelante), mientras que Swiss Medical sigue subiendo cada 5 años. Según los cuadros tarifarios oficiales, desde los 56 el OSDE 310 sale más barato que el SMG20. También quedate en OSDE si usás específicamente el Hospital Alemán.',
    ganas: ['9 sanatorios propios (Suizo Argentina, Los Arcos, Agote, Zabala, Olivos, San Lucas)', 'Guardia Ágil: reservás turno de guardia desde el celular', '30 sesiones de psicología por año sin cargo', '40% de descuento en farmacias adheridas'],
    perdes: ['Red de OSDE, con más de 125.000 prestadores según OSDE', 'Hospital Alemán en cartilla desde el plan 310', 'Plan Flux para menores de 35 con psicología ilimitada'],
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
    origenPlanSlug: 'plan-1000',
    origenPrecio: 369200,
    destinoSlug: 'swiss-medical',
    destinoNombre: 'Swiss Medical',
    destinoPlanSlug: 'smg20',
    destinoPlanNombre: 'Plan SMG20',
    destinoPrecio: 346404,
    deltaMensual: 369200 - 346404,
    gancho: 'Pagás menos y subís de cartilla',
    razon: 'El Plan 1000 de Sancor no tiene sanatorios propios. El SMG20 de Swiss Medical tiene un nivel de precio más accesible y suma 9 sanatorios propios de primer nivel. Es habitual que las promociones de ingreso de Sancor terminen y el afiliado quede pagando más que un plan equivalente de Swiss — comparalo con tu recibo actual, no con el precio con el que entraste.',
    paraQuienNo: 'Si vivís en el interior productivo (Córdoba, Santa Fe, Entre Ríos) donde Sancor tiene cartilla más profunda que Swiss Medical, este cambio pierde sentido: quedate con Sancor o mirá otra regional local.',
    ganas: ['9 sanatorios propios (Sancor no tiene ninguno)', 'Calidad de cartilla 5/5 contra 3/5 de Sancor', '30 sesiones de psicología por año sin cargo', 'Guardia Ágil desde el celular'],
    perdes: ['Cobertura nacional más profunda en el interior del país (Córdoba, Santa Fe, Entre Ríos)', 'Precio de entrada más accesible en los planes básicos (F700/F800) para quien recién empieza'],
    faqExtra: [
      { q: '¿Por qué termino pagando más en Sancor de lo que esperaba?', a: 'Es un patrón habitual del mercado: muchas prepagas ofrecen descuentos de ingreso por los primeros meses que después se retiran, quedando el afiliado con el precio de lista completo. Revisá tu recibo actual (no el precio con el que entraste) contra el del plan equivalente en otra empresa.' },
      { q: '¿Sancor es mejor que Swiss Medical en algún lado?', a: 'Sí: en el interior del país, especialmente Córdoba y Santa Fe, Sancor suele tener cartilla más profunda que las nacionales premium. Si vivís fuera de AMBA, verificá la cobertura local de ambas antes de cambiarte.' },
    ],
    comparativaSlug: 'swiss-medical-vs-sancor-salud',
  },
  {
    // Reescrito 23-sep-2026: el plan más completo de Premedic ahora es el 500
    // (antes figuraba el 400) y se sacan datos sin fuente. Precios: SSSalud.
    slug: 'osde-a-premedic',
    origenSlug: 'osde',
    origenNombre: 'OSDE',
    origenPlanNombre: 'Plan 210',
    origenPlanSlug: '210',
    origenPrecio: 314922,
    destinoSlug: 'premedic',
    destinoNombre: 'Premedic',
    destinoPlanSlug: 'plan-500',
    destinoPlanNombre: 'Plan 500',
    destinoPrecio: 296221,
    deltaMensual: 314922 - 296221,
    gancho: 'El plan más completo de Premedic cuesta menos que el de entrada de OSDE',
    razon: 'Según los cuadros tarifarios oficiales de la Superintendencia de Servicios de Salud, el Plan 500 de Premedic —su plan más completo, con habitación individual y reintegros— tiene una cuota de lista menor que el OSDE 210, el plan de entrada de OSDE, para una persona de 30 años. La ventaja se mantiene hasta los 50 años.',
    paraQuienNo: 'Si tenés 60 años o más: OSDE deja de aumentar por edad desde los 36 y a los 60 el OSDE 210 ya sale menos que el Premedic 500. Tampoco conviene si vivís fuera de su zona: Premedic declara precios solo para CABA, provincia de Buenos Aires, Córdoba, Mendoza, Misiones y Tucumán.',
    ganas: ['Una cuota menor por el plan más completo de Premedic (hasta los 50 años)', 'Habitación individual y reintegros en el Plan 500', 'Red odontológica propia con descuentos en implantes, ortodoncia y estética dental'],
    perdes: ['Cobertura nacional de OSDE', 'La escala de OSDE, que deja de aumentar por edad desde los 36'],
    faqExtra: [
      { q: '¿Hasta qué edad conviene el cambio?', a: 'Según los cuadros oficiales, el Premedic 500 sale menos que el OSDE 210 a los 30, 40 y 50 años. A los 60 se da vuelta: OSDE tiene un precio único desde los 36 años, mientras que Premedic sigue subiendo por rango de edad.' },
      { q: '¿De dónde salen los precios?', a: 'De los cuadros tarifarios que cada prepaga declara ante la Superintendencia de Servicios de Salud: precio de lista para una persona de 30 años, contratación directa, con IVA. El precio final depende de tu edad, zona y promociones vigentes.' },
    ],
  },
  {
    // Reescrito 23-sep-2026 con los planes reales de Avalian (el "Plan Full"
    // no existía). Cobertura: cotizador oficial de Avalian; precios: SSSalud.
    slug: 'avalian-a-swiss-medical',
    origenSlug: 'avalian',
    origenNombre: 'Avalian',
    origenPlanNombre: 'Plan Superior AS300',
    origenPlanSlug: 'as300',
    origenPrecio: 559614,
    destinoSlug: 'swiss-medical',
    destinoNombre: 'Swiss Medical',
    destinoPlanSlug: 'smg20',
    destinoPlanNombre: 'Plan SMG20',
    destinoPrecio: 346404,
    deltaMensual: 559614 - 346404,
    gancho: 'Dos planes sin copago, con una cuota bastante menor',
    razon: 'El Plan Superior AS300 de Avalian y el SMG20 de Swiss Medical son planes sin copago en consultas con internación en habitación individual. Según los cuadros tarifarios oficiales de la Superintendencia de Servicios de Salud, el SMG20 tiene una cuota de lista bastante menor a los 30 años. Antes de cambiarte, compará la cartilla de cada uno en tu zona.',
    paraQuienNo: 'Si usás la asistencia al viajero internacional o la odontología sin copago del Superior AS300, verificá que el SMG20 te cubra lo mismo antes de cambiarte. Y si vivís en una zona donde Swiss Medical no tiene cartilla, Avalian declara cobertura nacional.',
    ganas: ['Una cuota de lista menor por un plan sin copago en consultas', 'Sanatorios propios de Swiss Medical en AMBA'],
    perdes: ['Asistencia al viajero internacional del Superior AS300', 'Odontología sin copago del Superior AS300'],
    faqExtra: [
      { q: '¿Qué plan de Avalian se compara con el SMG20?', a: 'El Superior AS300: es el plan de Avalian con consultas sin copago e internación en habitación individual. El Integral (AS200 y AS204) tiene copago en consultas.' },
      { q: '¿De dónde salen los precios?', a: 'De los cuadros tarifarios que cada prepaga declara ante la Superintendencia de Servicios de Salud: precio de lista para una persona de 30 años, contratación directa, con IVA. El precio final depende de tu edad, zona y promociones vigentes.' },
    ],
  },
  {
    // Reescrito 23-sep-2026 con los planes reales de Prevención (el "Plan Oro"
    // no existía). Precios y escala etaria: cuadros tarifarios SSSalud.
    slug: 'prevencion-salud-a-swiss-medical',
    origenSlug: 'prevencion-salud',
    origenNombre: 'Prevención Salud',
    origenPlanNombre: 'Plan A2',
    origenPlanSlug: 'a2',
    origenPrecio: 901261,
    destinoSlug: 'swiss-medical',
    destinoNombre: 'Swiss Medical',
    destinoPlanSlug: 'smg20',
    destinoPlanNombre: 'Plan SMG20',
    destinoPrecio: 346404,
    deltaMensual: 901261 - 346404,
    gancho: 'Si tenés menos de 55 años, la cuota puede bajar mucho',
    razon: 'Prevención Salud cobra el mismo precio desde el nacimiento hasta los 55 años: en su cuadro tarifario oficial hay un único rango de 0 a 55. Por eso, para una persona joven, el Plan A2 queda bastante más caro que el SMG20 de Swiss Medical, que ajusta el precio por edad. Los dos son planes sin copago en consultas.',
    paraQuienNo: 'Cuanto más cerca estés de los 55 años, menos conviene el cambio: el precio plano de Prevención juega a favor de las personas mayores, mientras que Swiss Medical sube cada 5 años. Pedinos la cotización para tu edad exacta antes de decidir.',
    ganas: ['Una cuota menor si sos joven (Swiss ajusta el precio por edad)', 'Sanatorios propios de Swiss Medical en AMBA'],
    perdes: ['El precio plano hasta los 55 años de Prevención', 'Cobertura nacional e internacional del A2 (verificá la del SMG20)'],
    faqExtra: [
      { q: '¿Por qué Prevención cuesta lo mismo a los 25 que a los 50?', a: 'Porque así lo declara en su cuadro tarifario ante la Superintendencia de Servicios de Salud: un único rango de edad de 0 a 55 años, con precios distintos recién desde los 56. Es una estrategia comercial: cada prepaga define sus propios rangos de edad.' },
      { q: '¿De dónde salen los precios?', a: 'De los cuadros tarifarios que cada prepaga declara ante la Superintendencia de Servicios de Salud: precio de lista para una persona de 30 años, contratación directa, con IVA. El precio final depende de tu edad, zona y promociones vigentes.' },
    ],
  },
  {
    slug: 'medife-a-swiss-medical',
    origenSlug: 'medife',
    origenNombre: 'Medifé',
    origenPlanNombre: 'Plan Plata',
    origenPlanSlug: 'plata',
    origenPrecio: 309892,
    destinoSlug: 'swiss-medical',
    destinoNombre: 'Swiss Medical',
    destinoPlanSlug: 'smg20',
    destinoPlanNombre: 'Plan SMG20',
    destinoPrecio: 346404,
    deltaMensual: 309892 - 346404,
    gancho: 'Casi el mismo precio, una cartilla mucho más grande',
    razon: 'Este caso es distinto a los demás: el Plan Plata de Medifé ya es uno de los planes sin copago más económicos del mercado, así que no hay ahorro real cambiándose. Lo que sí hay es una diferencia de cartilla enorme para una diferencia de precio chica: por un poco más de cuota, el SMG20 de Swiss Medical suma 9 sanatorios propios contra el sanatorio único (Finochietto) de Medifé.',
    paraQuienNo: 'Si tu prioridad es el precio más bajo posible y no usás sanatorios de alta complejidad seguido, Medifé Plata sigue siendo una opción sólida — no hay ahorro cambiándote, solo más cartilla por un poco más de plata.',
    ganas: ['9 sanatorios propios contra el acceso a Finochietto de Medifé', 'Calidad de cartilla 5/5 contra 3/5', 'Guardia Ágil y 30 sesiones de psicología sin cargo'],
    perdes: ['Cam Doctor: médico por videoconsulta en menos de 10 minutos', 'Cobertura oficial de la AFA', 'Plan Indie pensado para monotributistas', 'Cobertura en Brasil incluida en varios planes'],
    faqExtra: [
      { q: '¿Por qué cambiarme si Medifé ya es barato?', a: 'No es una cuestión de precio: es una cuestión de cartilla. Por una diferencia chica en la cuota pasás de acceder a un solo sanatorio de alta complejidad (Finochietto) a tener 9 sanatorios propios disponibles. Si esa diferencia no te cambia la vida, quedate en Medifé — es una decisión legítima.' },
      { q: '¿Pierdo el Cam Doctor de Medifé si me cambio?', a: 'Sí, Cam Doctor (videoconsulta médica en menos de 10 minutos) es un servicio propio de Medifé que Swiss Medical no ofrece con ese formato. Swiss tiene Guardia Ágil (reserva de turno de guardia desde el celular), que resuelve un problema distinto.' },
    ],
    comparativaSlug: 'medife-vs-swiss-medical',
  },
  {
    slug: 'omint-a-sancor-salud',
    origenSlug: 'omint',
    origenNombre: 'Omint',
    origenPlanNombre: 'Plan Global',
    origenPlanSlug: 'global',
    origenPrecio: 437027,
    destinoSlug: 'sancor-salud',
    destinoNombre: 'Sancor Salud',
    destinoPlanSlug: 'plan-1000',
    destinoPlanNombre: 'Plan 1000',
    destinoPrecio: 369200,
    deltaMensual: 437027 - 369200,
    gancho: 'Mucha menos cuota, mejor cartilla si vivís fuera de CABA/GBA',
    razon: 'El Plan Global de Omint tiene su red concentrada en 3 sanatorios propios de CABA/GBA (Bazterrica, Del Sol, Santa Isabel). El Plan 1000 de Sancor Salud es su plan más elegido, sin copago en especialistas, y suma el Centro Médico Vitus propio en Córdoba además de ser la prepaga con mayor presencia en el interior del país (Córdoba, Santa Fe, Entre Ríos).',
    paraQuienNo: 'Si vivís en CABA/GBA y elegiste Omint específicamente por sus 3 sanatorios propios o por la cobertura internacional incluida en todos los planes, Sancor Salud no te da lo mismo — quedate en Omint.',
    ganas: ['Centro Médico Vitus propio en Córdoba, con 30+ especialidades', 'Farmavitus y Óptica Vitus con descuentos exclusivos', 'La prepaga más fuerte del interior (Córdoba, Santa Fe, Entre Ríos)', 'El mayor ahorro estimado de esta comparación'],
    perdes: ['3 sanatorios propios de Omint en CABA/GBA (Bazterrica, Del Sol, Santa Isabel)', 'Cobertura internacional incluida en todos los planes de Omint', 'Certificación ISO 9001 de Omint'],
    faqExtra: [
      { q: '¿Sancor Salud tiene sanatorios propios como Omint?', a: 'Tiene uno: el Centro Médico Vitus en Córdoba, con más de 30 especialidades. Omint tiene 3 sanatorios propios de alta complejidad, pero limitados a CABA/GBA. Fuera de esa zona, la cartilla de Sancor suele ser más profunda.' },
      { q: '¿Por qué Omint es tan cara si su red es más chica que Sancor Salud?', a: 'Omint invierte en infraestructura propia de alta complejidad (Bazterrica, Del Sol, Santa Isabel) y en beneficios como cobertura internacional incluida en todos los planes, lo que eleva el costo de estructura frente a una prepaga con más despliegue territorial como Sancor Salud.' },
    ],
  },
  {
    // Reescrito 23-sep-2026 con la grilla real de ambas y sin datos sin fuente.
    slug: 'sancor-salud-a-premedic',
    origenSlug: 'sancor-salud',
    origenNombre: 'Sancor Salud',
    origenPlanNombre: 'Plan F700',
    origenPlanSlug: 'f700',
    origenPrecio: 232761,
    destinoSlug: 'premedic',
    destinoNombre: 'Premedic',
    destinoPlanSlug: 'plan-400',
    destinoPlanNombre: 'Plan 400',
    destinoPrecio: 208611,
    deltaMensual: 232761 - 208611,
    gancho: 'Habitación individual por menos que el plan de entrada de Sancor',
    razon: 'El F700 es el plan de entrada de Sancor Salud (Línea FAM, red regional de prestadores). Según los cuadros tarifarios oficiales de la Superintendencia de Servicios de Salud, el Plan 400 de Premedic —habitación individual y más de 5000 prestadores de acceso directo, según su ficha oficial— tiene una cuota de lista menor. Los dos planes declaran copago.',
    paraQuienNo: 'Si vivís fuera de la zona de Premedic, quedate en Sancor: Premedic declara precios solo para CABA, provincia de Buenos Aires, Córdoba, Mendoza, Misiones y Tucumán, mientras que Sancor declara cobertura en muchas más provincias.',
    ganas: ['Una cuota de lista menor', 'Internación en habitación individual (Plan 400)', 'Descuentos en implantes, ortodoncia y estética dental'],
    perdes: ['Telemedicina 24-7 y red regional de la Línea FAM de Sancor', 'Cobertura de Sancor en más provincias'],
    faqExtra: [
      { q: '¿Los dos planes tienen copago?', a: 'Sí: tanto el F700 de Sancor como el 400 de Premedic declaran copago ante la Superintendencia de Servicios de Salud.' },
      { q: '¿De dónde salen los precios?', a: 'De los cuadros tarifarios que cada prepaga declara ante la Superintendencia de Servicios de Salud: precio de lista para una persona de 30 años, contratación directa, con IVA. El precio final depende de tu edad, zona y promociones vigentes.' },
    ],
  },
  {
    // Reescrito 23-sep-2026 con los planes reales (el "Plan Básico" de Avalian
    // no existía). Precios: SSSalud; cobertura: fichas oficiales.
    slug: 'avalian-a-premedic',
    origenSlug: 'avalian',
    origenNombre: 'Avalian',
    origenPlanNombre: 'Plan Cerca AS100',
    origenPlanSlug: 'as100',
    origenPrecio: 288674,
    destinoSlug: 'premedic',
    destinoNombre: 'Premedic',
    destinoPlanSlug: 'plan-400',
    destinoPlanNombre: 'Plan 400',
    destinoPrecio: 208611,
    deltaMensual: 288674 - 208611,
    gancho: 'El plan más completo de Premedic cuesta menos que el de entrada de Avalian',
    razon: 'Según los cuadros tarifarios oficiales de la Superintendencia de Servicios de Salud, el Plan 400 de Premedic tiene una cuota de lista menor que el Plan Cerca AS100, el plan de entrada de Avalian. El 400 incluye internación en habitación individual y descuentos en implantes, ortodoncia y estética dental, según su ficha oficial.',
    paraQuienNo: 'Premedic solo declara cobertura en CABA, GBA, Córdoba, Mendoza, Misiones y Tucumán. Si vivís en otra zona, quedate en Avalian, que declara cobertura nacional.',
    ganas: ['Una cuota de lista menor', 'Internación en habitación individual (Plan 400)', 'Descuentos en implantes, ortodoncia y estética dental'],
    perdes: ['Cobertura nacional de Avalian', 'Telemedicina (e-doc) y app de Avalian'],
    faqExtra: [
      { q: '¿Dónde tiene cobertura Premedic?', a: 'Según los cuadros que declara ante la Superintendencia de Servicios de Salud, Premedic tiene precios para CABA, provincia de Buenos Aires (GBA), Córdoba, Mendoza, Misiones y Tucumán. Fuera de esas zonas no te conviene.' },
      { q: '¿De dónde salen los precios?', a: 'De los cuadros tarifarios que cada prepaga declara ante la Superintendencia de Servicios de Salud: precio de lista para una persona de 30 años, contratación directa, con IVA. El precio final depende de tu edad, zona y promociones vigentes.' },
    ],
  },
]

// Precios y delta siempre desde lib/data/prepagas.ts (que ya trae el precio
// oficial SSSalud de cada plan que lo tiene): así estas páginas nunca quedan
// con números viejos cuando se actualizan los cuadros (23-sep-2026).
for (const c of cambiosRecomendados) {
  const origen = prepagas.find((p) => p.slug === c.origenSlug)?.planes.find((pl) => pl.slug === c.origenPlanSlug)
  const destino = prepagas.find((p) => p.slug === c.destinoSlug)?.planes.find((pl) => pl.slug === c.destinoPlanSlug)
  if (origen) c.origenPrecio = origen.precio
  if (destino) c.destinoPrecio = destino.precio
  c.deltaMensual = c.origenPrecio - c.destinoPrecio
}

export function getCambioBySlug(slug: string): CambioRecomendado | undefined {
  return cambiosRecomendados.find((c) => c.slug === slug)
}

export function getCambiosPorOrigen(origenSlug: string): CambioRecomendado[] {
  return cambiosRecomendados.filter((c) => c.origenSlug === origenSlug)
}

export function getCambiosPorDestino(destinoSlug: string): CambioRecomendado[] {
  return cambiosRecomendados.filter((c) => c.destinoSlug === destinoSlug)
}
