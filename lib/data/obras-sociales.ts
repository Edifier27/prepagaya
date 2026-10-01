import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { formatPrecio } from '@/lib/utils'

// Precio de lista oficial más bajo de la prepaga hermana (cuadro de la SSSalud
// del mes). Reemplaza precios de monotributo fijos que habían quedado viejos
// o sin fuente (auditoría 24-sep-2026: OSDE "$45.000", Galeno "$95.000",
// Medifé "$85.000", cuando el oficial arranca en más del doble).
function planDesde(prepagaSlug: string) {
  const p = prepagas.find((x) => x.slug === prepagaSlug)
  if (!p) return null
  // Plan del cuadro oficial y sin tope de edad (el Flux de OSDE, por ejemplo,
  // es solo para menores de 35 y tiene precio de referencia).
  const oficiales = p.planes.filter((pl) => pl.fuentePrecio === 'sssalud' && !pl.edadMaxima)
  const plan = [...(oficiales.length ? oficiales : p.planes)].sort((a, b) => a.precio - b.precio)[0]
  return { p, plan, oficial: plan.fuentePrecio === 'sssalud' }
}
function desdeOficial(prepagaSlug: string): string {
  const d = planDesde(prepagaSlug)
  if (!d) return ''
  return `${formatPrecio(d.plan.precio)}/mes (${d.p.nombre} ${d.plan.nombre}, ${d.oficial ? 'precio de lista oficial' : 'precio de referencia'} para una persona de 30 años, ${PRECIO_ACTUALIZADO.toLowerCase()})`
}
const respuestaMonotributo = (prepagaSlug: string, nombre: string) =>
  `El plan más accesible de ${nombre} arranca en ${desdeOficial(prepagaSlug)}${planDesde(prepagaSlug)?.oficial ? ', según el cuadro tarifario de la Superintendencia de Servicios de Salud' : ''}. El precio final depende de tu edad y del plan que elijas: cotizalo gratis para ver el tuyo.`

export interface ObraSocialData {
  slug: string
  nombre: string
  emoji: string
  tipo: 'sindical' | 'provincial' | 'estatal' | 'jubilados' | 'empresarial'
  titulo: string
  metaDescripcion: string
  descripcion: string
  intro: string
  // Opcional: solo se publica si hay cifra verificada (regla: nada inventado)
  beneficiarios?: number
  quienesPuedenAfiliarse: string[]
  // Opcional: solo si el porcentaje está verificado
  aportes?: { trabajador: string; empleador: string; monotributista?: string }
  cobertura: string[]
  diferenciadores: string[]
  pros: string[]
  contras: string[]
  derivacion: boolean
  web?: string
  /** Si la ficha se verificó contra la web oficial: va a isBasedOn (GEO) */
  fuenteOficial?: string
  /** Fecha (ISO) de la última verificación contra la fuente oficial */
  verificado?: string
  /** Teléfonos oficiales, copiados de la web de la obra social */
  telefonos?: { etiqueta: string; valor: string; detalle?: string }[]
  /** Bajada del CTA final, específica al dolor real de esta obra social (ej. "no conseguís turnos"). Si no está, se usa el genérico. */
  ganchoConversion?: string
  faq: { q: string; a: string }[]
  keywords: string[]
}

export const obrasSociales: ObraSocialData[] = [
  {
    slug: 'osde',
    nombre: 'OSDE Obra Social',
    emoji: '🏥',
    tipo: 'sindical',
    titulo: 'OSDE como obra social: cómo derivar tus aportes y quién puede afiliarse (2026)',
    metaDescripcion: 'OSDE como obra social en Argentina: quién puede afiliarse, cómo derivar tus aportes y qué cubre. Los planes y precios de OSDE como prepaga están en su ficha, plan por plan.',
    descripcion: 'Una de las obras sociales más conocidas de Argentina: OSDE informa más de 125.000 prestadores en todo el país.',
    intro: 'OSDE (Organización de Servicios Directos Empresarios) es la obra social con mayor red de prestadores de Argentina, que informa más de 125.000 prestadores y presencia en todo el país. Aunque muchos la conocen como prepaga, es técnicamente una obra social que compite en el segmento premium.',
    beneficiarios: 2800000,
    quienesPuedenAfiliarse: [
      'Trabajadores en relación de dependencia (a través del empleador)',
      'Monotributistas (categoría B en adelante)',
      'Autónomos y profesionales independientes',
      'Jubilados y pensionados (complementaria a PAMI)',
      'Planes familiares para grupo conviviente',
    ],
    aportes: {
      trabajador: '3% del salario bruto',
      empleador: '6% del salario bruto',
      monotributista: `Desde ${desdeOficial('osde')}`,
    },
    cobertura: [
      'PMO completo (Plan Médico Obligatorio)',
      'Más de 125.000 prestadores en todo el país (según OSDE)',
      'Hospitalización en clínicas y sanatorios de primer nivel',
      'Maternidad, pediatría y neonatología',
      'Salud mental (psicología y psiquiatría)',
      'Odontología según plan',
      'Medicamentos con descuentos según plan',
      'Cobertura de emergencias en el exterior (planes premium)',
    ],
    diferenciadores: [
      'Red más extensa del país',
      'Cartilla online actualizada en tiempo real',
      'App móvil para gestión de trámites',
      'Módulo de telemedicina disponible',
    ],
    pros: [
      'La mayor red de prestadores del país',
      'Presencia en todas las provincias',
      'Reconocida y aceptada en todos los sanatorios',
      'Planes para todos los presupuestos (210, 310, 410, 510)',
      'Excelente app móvil y gestión digital',
    ],
    contras: [
      'Precios más altos que otras obras sociales',
      'Algunos trámites pueden ser burocráticos',
      'La cartilla varía mucho según zona geográfica',
      'Los planes más baratos (210) tienen limitaciones',
    ],
    derivacion: true,
    web: 'osde.com.ar',
    faq: [
      { q: '¿Cuánto cuesta OSDE para un monotributista?', a: respuestaMonotributo('osde', 'OSDE') },
      { q: '¿Puedo tener OSDE y una prepaga al mismo tiempo?', a: 'Sí, muchas personas derivan sus aportes obligatorios a OSDE y contratan una prepaga complementaria para mejorar la cobertura. OSDE puede actuar como financiador y la prepaga como complemento.' },
      { q: '¿OSDE cubre medicamentos?', a: 'Sí, OSDE cubre medicamentos con descuentos que van del 40% al 100% según el tipo de medicamento y el plan. Los planes superiores tienen mayor cobertura de medicamentos crónicos.' },
      { q: '¿Cómo cambio de obra social a OSDE?', a: 'Con la opción de cambio: la hacés vos, online, en la web de la Superintendencia de Servicios de Salud con tu clave fiscal nivel 3, y confirmás el mail que te llega dentro de las 48 horas. El cambio se activa el primer día del mes siguiente; hasta entonces seguís con tu obra social actual. Se puede hacer una vez cada 365 días.' },
      { q: '¿OSDE es obra social o prepaga?', a: 'OSDE es técnicamente una obra social sindical (de los empleados de empresas), pero funciona como prepaga privada y compite en el mismo segmento. Requiere aportes patronales para empleados en relación de dependencia.' },
    ],
    keywords: ['osde obra social', 'derivar aportes a osde', 'pasar mi obra social a osde', 'osde afiliarse', 'osde 310 monotributista'],
  },
  {
    slug: 'medicus',
    nombre: 'Medicus',
    emoji: '⚕️',
    tipo: 'empresarial',
    titulo: 'Medicus 2026: obra social con cobertura premium en AMBA',
    metaDescripcion: 'Medicus obra social y prepaga en Argentina 2026. Planes, precios, cómo afiliarse y qué cubre. Reconocida por su red premium en Buenos Aires.',
    descripcion: 'Medicus ofrece cobertura premium con acceso a los mejores prestadores del AMBA.',
    intro: 'Medicus es una de las obras sociales y prepagas privadas más reconocidas de Argentina, especialmente valorada en el segmento empresarial de Buenos Aires y el conurbano. Su propuesta se basa en una red de prestadores seleccionados y atención de alta complejidad.',
    beneficiarios: 450000,
    quienesPuedenAfiliarse: [
      'Empleados de empresas con convenio Medicus',
      'Monotributistas y autónomos (plan directo)',
      'Familiares y grupo conviviente',
      'Jubilados como complemento a PAMI',
    ],
    aportes: {
      trabajador: '3% del salario bruto',
      empleador: '6% del salario bruto',
      monotributista: `Desde ${desdeOficial('medicus')}`,
    },
    cobertura: [
      'Red seleccionada de prestadores premium',
      'Internación en sanatorios de primer nivel',
      'Urgencias y emergencias 24hs',
      'Maternidad completa',
      'Salud mental incluida',
      'Odontología en planes seleccionados',
      'Traslados sanitarios',
    ],
    diferenciadores: [
      'Red de prestadores muy cuidada y actualizada',
      'Gestión de trámites ágil',
      'Fuerte en el segmento corporativo premium',
      'Atención personalizada',
    ],
    pros: [
      'Excelente red de prestadores en AMBA',
      'Buena relación precio-calidad',
      'Ágil gestión de autorizaciones',
      'Fuerte en alta complejidad médica',
    ],
    contras: [
      'Cobertura más limitada en el interior del país',
      'Menor presencia en provincias chicas',
      'Precios más altos que la media',
    ],
    derivacion: true,
    web: 'medicus.com.ar',
    faq: [
      { q: '¿Medicus es obra social o prepaga?', a: 'Medicus funciona como ambas: es una entidad que puede recibir derivaciones de obras sociales sindicales y también ofrece planes directos de prepaga para monotributistas y autónomos.' },
      { q: '¿Cuánto cuesta Medicus para un monotributista?', a: respuestaMonotributo('medicus', 'Medicus') },
      { q: '¿Medicus tiene cobertura fuera de Buenos Aires?', a: 'Medicus está principalmente concentrada en el AMBA. Si vivís en el interior del país, su cobertura puede ser más limitada y conviene verificar la cartilla de prestadores en tu zona.' },
    ],
    keywords: ['medicus obra social', 'medicus prepaga precio', 'medicus afiliarse', 'medicus cobertura'],
  },
  {
    slug: 'galeno',
    nombre: 'Galeno',
    emoji: '🏫',
    tipo: 'empresarial',
    titulo: 'Galeno Obra Social 2026: la opción más accesible para derivar tus aportes',
    metaDescripcion: 'Galeno obra social 2026: cómo derivar tus aportes, planes, precios y requisitos de afiliación. Más de 600.000 beneficiarios, la opción más accesible frente a OSDE o Medifé.',
    descripcion: 'Galeno es obra social sindical además de prepaga: con más de 600.000 beneficiarios, es habitualmente la opción de menor costo entre las grandes al momento de derivar aportes.',
    intro: 'Galeno opera como obra social además de prepaga, con más de 600.000 beneficiarios. Frente a otras obras sociales grandes como OSDE o Medifé, su principal atractivo es el precio: suele ser la opción más accesible al derivar tus aportes, con buena cobertura en AMBA y gestión 100% digital.',
    beneficiarios: 600000,
    quienesPuedenAfiliarse: [
      'Empleados en relación de dependencia',
      'Monotributistas y autónomos',
      'Jubilados (complementaria a PAMI)',
      'Familiares del titular',
    ],
    aportes: {
      trabajador: '3% del salario bruto',
      empleador: '6% del salario bruto',
      monotributista: `Desde ${desdeOficial('galeno')}`,
    },
    cobertura: [
      'Red de prestadores propios y externos',
      'Internación y cirugías',
      'Urgencias 24hs',
      'Maternidad completa',
      'Salud mental',
      'Medicamentos con descuento',
      'Estudios de diagnóstico',
    ],
    diferenciadores: [
      'Buena relación precio-calidad',
      'Red propia en CABA y GBA',
      'Gestión online y app móvil',
      'Múltiples planes según necesidad',
    ],
    pros: [
      'Precio más accesible que los líderes del mercado',
      'Buena cobertura en AMBA',
      'Fácil gestión digital',
      'Amplia variedad de planes',
    ],
    contras: [
      'Red más débil que OSDE o Swiss Medical',
      'Cobertura en interior depende de la zona',
      'Algunas autorizaciones pueden demorar',
    ],
    derivacion: true,
    web: 'galeno.com.ar',
    faq: [
      { q: '¿Cuánto cuesta Galeno para un monotributista?', a: respuestaMonotributo('galeno', 'Galeno') },
      { q: '¿Galeno tiene buena cobertura en el interior?', a: 'Galeno está principalmente concentrada en Buenos Aires y el AMBA. En el interior del país, la cobertura existe pero puede ser más limitada. Conviene revisar la cartilla para tu zona antes de afiliarte.' },
      { q: '¿Puedo derivar mi obra social sindical a Galeno?', a: 'Sí, podés hacer una derivación de aportes a Galeno. El proceso demora entre 30 y 60 días hábiles y lo gestionás a través de la Superintendencia de Servicios de Salud.' },
    ],
    keywords: ['galeno obra social', 'galeno prepaga precio', 'galeno afiliarse monotributista', 'galeno cobertura'],
  },
  {
    // Reescrita 23-sep-2026 con datos de pami.org.ar (historia, afiliación,
    // medicamentos y contacto). Antes citaba el programa REMEDIAR (que no es
    // de PAMI) y porcentajes de aportes sin fuente.
    slug: 'pami',
    nombre: 'PAMI',
    emoji: '👴',
    tipo: 'jubilados',
    titulo: 'PAMI: teléfono 138, medicamentos, cartilla y cómo afiliarte (2026)',
    metaDescripcion: 'PAMI, la obra social de jubilados y pensionados: teléfono gratuito 138 las 24 horas, cobertura de medicamentos al 100%, 50-80% y 40%, médico de cabecera, más de 600 agencias y cómo afiliarte.',
    descripcion: 'La obra social de jubilados y pensionados: más de 5 millones de afiliados.',
    intro: 'PAMI (Instituto Nacional de Servicios Sociales para Jubilados y Pensionados) fue creado en 1971 para dar asistencia médica integral a las personas mayores. Según PAMI, acompaña a más de 5 millones de jubilados, pensionados, sus familiares a cargo, personas con discapacidad y veteranos de guerra. La puerta de entrada a las prestaciones es el médico de cabecera, y la línea gratuita 138 atiende las 24 horas.',
    beneficiarios: 5000000,
    quienesPuedenAfiliarse: [
      'Jubilados y pensionados',
      'Sus familiares a cargo',
      'Personas con discapacidad',
      'Veteranos y excombatientes de guerra',
    ],
    cobertura: [
      'Médico de cabecera como puerta de entrada a todas las prestaciones',
      'Especialidades, estudios de diagnóstico, guardia e internación',
      'Medicamentos al 100% en tratamientos especiales: diabetes, oncológicos, VIH y hepatitis, trasplantes, entre otros',
      'Medicamentos de 50% a 80% para patologías crónicas y agudas, y 40% los de uso eventual',
      'Más de 14 mil farmacias adheridas',
      'Hospitales propios',
      'Talleres, cursos universitarios UPAMI y actividades preventivas',
    ],
    diferenciadores: [
      'Línea 138 gratuita las 24 horas, todo el país',
      'Más de 600 agencias y 38 Unidades de Gestión Local (UGL)',
      'Más de 8 mil médicos de cabecera y 17 mil prestadores',
    ],
    pros: [
      'Cobertura de medicamentos al 100% en tratamientos especiales',
      'Atención telefónica gratuita las 24 horas (138)',
      'Presencia en todo el país con más de 600 agencias',
    ],
    contras: [
      'Todo pasa por el médico de cabecera: para especialistas y estudios necesitás su derivación',
      'Se atiende en la red de prestadores de PAMI: no es una prepaga, así que no se usa en sanatorios fuera de esa red',
    ],
    derivacion: false,
    web: 'pami.org.ar',
    fuenteOficial: 'https://www.pami.org.ar/historia',
    verificado: '2026-09-23',
    telefonos: [
      { etiqueta: 'PAMI Escucha y Responde', valor: '138', detalle: 'Gratuito, las 24 horas, todo el país' },
      { etiqueta: 'Emergencias', valor: 'Según tu zona', detalle: 'Tené a mano tu número de afiliación, teléfono y dirección' },
    ],
    faq: [
      { q: '¿Cuál es el teléfono de PAMI?', a: 'El 138, PAMI Escucha y Responde: es gratuito y atiende en todo el país las 24 horas, los 365 días. Para emergencias hay un teléfono según tu zona.' },
      { q: '¿Qué medicamentos cubre PAMI al 100%?', a: 'Según PAMI: tratamiento para la diabetes, oncológicos y oncohematológicos, hemofilia, VIH y hepatitis B y C, trasplantes, trastornos hematopoyéticos, artritis reumatoidea, enfermedades fibroquísticas, medicamentos oftalmológicos intravítreos, osteoartritis e insuficiencia renal crónica. Para patologías crónicas y agudas cubre de 50% a 80%, y 40% los de uso eventual.' },
      { q: '¿Quiénes pueden afiliarse a PAMI?', a: 'Jubilados y pensionados, sus familiares a cargo, personas con discapacidad y veteranos y excombatientes de guerra.' },
      { q: '¿Puedo tener PAMI y una prepaga?', a: 'Sí: muchos jubilados mantienen PAMI y suman una prepaga para atenderse en sanatorios que no están en la red de PAMI. Te cotizamos gratis según tu edad.' },
    ],
    keywords: ['pami', 'pami telefono', 'pami 138', 'pami medicamentos', 'pami cartilla', 'afiliarse a pami'],
  },
  {
    // Reescrita 23-sep-2026 solo con datos de accordsalud.com.ar (inicio y
    // "Nosotros"). Antes tenía afiliados, precios y pros/contras sin fuente.
    slug: 'accord-salud',
    nombre: 'Accord Salud',
    emoji: '🤝',
    tipo: 'sindical',
    titulo: 'Accord Salud: planes 1.5, 2.2, 3.2 y 4.2, teléfonos y cómo afiliarte (2026)',
    metaDescripcion: 'Accord Salud son los planes superadores de la obra social Unión Personal (UPCN). Planes Accord 1.5, 2.2, 3.2 y 4.2, Sanatorio Anchorena propio, teléfonos de urgencias y atención. Compará con otras prepagas.',
    descripcion: 'Los planes superadores de la obra social Unión Personal, de UPCN.',
    intro: 'Accord Salud nació en 1998, cuando se incorporaron los planes superadores a la obra social Unión Personal, que pertenece a UPCN (Unión del Personal Civil de la Nación). Ofrece cuatro planes, Accord 1.5, 2.2, 3.2 y 4.2, y tiene centros médicos propios como el Sanatorio Anchorena.',
    quienesPuedenAfiliarse: [
      'Trabajadores en relación de dependencia que eligen la obra social Unión Personal y suman un plan superador',
      'Familiares a cargo del titular',
      'Afiliados que se jubilan: pueden mantener el plan superador pagando el aporte adicional (según Unión Personal)',
    ],
    aportes: {
      trabajador: '3% del salario bruto (Ley 23.660) + el valor del plan superador',
      empleador: '6% del salario bruto (Ley 23.660)',
    },
    cobertura: [
      'PMO',
      'Planes Accord 1.5 (básico), 2.2 (intermedio), 3.2 (avanzado) y 4.2 (premium)',
      'Centros médicos propios, entre ellos el Sanatorio Anchorena',
      'Telemedicina en todos los planes, sin coseguro',
      'Asistencia internacional (Universal Assistance)',
    ],
    diferenciadores: [
      'Sanatorio Anchorena propio',
      'Cuatro planes escalonados, del básico al premium',
      'Urgencias odontológicas y psiquiátricas domiciliarias',
    ],
    pros: [
      'Centros médicos propios, entre ellos el Sanatorio Anchorena',
      'Telemedicina incluida en todos los planes sin coseguro',
      'App para gestionar la cobertura',
    ],
    contras: [
      'No publica precios en su web: hay que cotizar',
      'Es un plan superador de una obra social: se suma al aporte y tiene un costo adicional',
    ],
    derivacion: true,
    web: 'accordsalud.com.ar',
    fuenteOficial: 'https://www.accordsalud.com.ar/nosotros',
    verificado: '2026-09-23',
    faq: [
      { q: '¿Accord Salud es una obra social o una prepaga?', a: 'Según su sitio oficial, Accord Salud son los planes superadores de la obra social Unión Personal, que pertenece a UPCN. Se incorporaron en 1998.' },
      { q: '¿Qué planes tiene Accord Salud?', a: 'Cuatro: Accord 1.5 (cobertura esencial), 2.2 (intermedio), 3.2 (avanzado) y 4.2 (premium).' },
      { q: '¿Cuál es el teléfono de Accord Salud?', a: 'Según su web: riesgo de vida 0800-199-0911; urgencias y visitas médicas 0810-222-0085; atención 0810-555-1100. La atención al afiliado online es por WhatsApp desde su sitio.' },
      { q: '¿Accord Salud tiene sanatorio propio?', a: 'Sí: el Sanatorio Anchorena, entre otros centros propios.' },
    ],
    keywords: ['accord salud', 'accord salud planes', 'accord salud telefono', 'accord salud cartilla', 'accord 2.2', 'accord 3.2', 'accord salud opiniones'],
  },
  {
    slug: 'medife',
    nombre: 'Medifé',
    emoji: '🏛️',
    tipo: 'sindical',
    titulo: 'Medifé 2026: obra social con fuerte red en el interior del país',
    metaDescripcion: 'Medifé obra social y prepaga 2026. Planes, precios, cobertura y qué diferencia a Medifé de las otras obras sociales. Guía completa.',
    descripcion: 'Medifé es una obra social con fuerte presencia en el interior del país y buena red nacional.',
    intro: 'Medifé es una de las obras sociales con mayor presencia en el interior del país. Conocida por su red de prestadores en ciudades medianas y pequeñas donde otras obras sociales tienen menor cobertura, Medifé se destaca como opción para quienes no viven en el AMBA.',
    beneficiarios: 350000,
    quienesPuedenAfiliarse: [
      'Trabajadores en relación de dependencia (por derivación)',
      'Monotributistas y autónomos',
      'Jubilados (complementaria a PAMI)',
      'Familiares del titular',
    ],
    aportes: {
      trabajador: '3% del salario bruto',
      empleador: '6% del salario bruto',
      monotributista: `Desde ${desdeOficial('medife')}`,
    },
    cobertura: [
      'PMO completo',
      'Red de prestadores en todo el país',
      'Especialmente fuerte en provincias del interior',
      'Internaciones y cirugías',
      'Maternidad',
      'Salud mental',
      'Medicamentos',
    ],
    diferenciadores: [
      'Una de las mejores redes en el interior del país',
      'Buena cobertura en ciudades medianas',
      'Precios competitivos para el interior',
    ],
    pros: [
      'Excelente cobertura en el interior del país',
      'Buena relación precio-calidad',
      'Red amplia en ciudades medianas y pequeñas',
      'Reconocida en todo el territorio nacional',
    ],
    contras: [
      'Menos infraestructura propia que Swiss Medical u OSDE',
      'App y gestión digital menos desarrollada',
      'Menor oferta de planes premium',
    ],
    derivacion: true,
    web: 'medife.com.ar',
    faq: [
      { q: '¿Medifé tiene cobertura en el interior del país?', a: 'Sí, Medifé es reconocida precisamente por su fuerte cobertura en el interior. Tiene prestadores en ciudades de las 23 provincias, incluyendo ciudades medianas donde otras obras sociales tienen menos presencia.' },
      { q: '¿Cuánto cuesta Medifé para un monotributista?', a: respuestaMonotributo('medife', 'Medifé') },
    ],
    keywords: ['medife obra social', 'medife prepaga precio', 'medife interior del pais', 'medife afiliarse'],
  },
  {
    // Reescrita 23-sep-2026 con datos de ioma.gba.gob.ar. Antes: cantidad de
    // afiliados y porcentajes de aportes sin fuente.
    slug: 'ioma',
    nombre: 'IOMA',
    emoji: '🏢',
    tipo: 'provincial',
    titulo: 'IOMA: la obra social de la provincia de Buenos Aires, app, cartilla y teléfonos (2026)',
    metaDescripcion: 'IOMA es la obra social de la provincia de Buenos Aires: todos los afiliados reciben la misma cobertura. App IOMA Digital, cartilla prestacional, credencial, telemedicina y teléfonos de ayuda.',
    descripcion: 'La obra social de la provincia de Buenos Aires, con la mayor red de prestadores bonaerense.',
    intro: 'IOMA (Instituto de Obra Médico Asistencial) es la obra social de la provincia de Buenos Aires. Funciona como un sistema solidario de salud: todas y todos reciben la misma cobertura, sin distinción de aportes. Según IOMA, tiene la mayor red de prestadores de la provincia.',
    quienesPuedenAfiliarse: [
      'Trabajadoras y trabajadores de la Administración Pública de la provincia de Buenos Aires',
      'Integrantes de entidades adheridas por afiliación voluntaria colectiva (convenios)',
      'Grupo familiar del titular',
    ],
    cobertura: [
      'Misma cobertura para todos los afiliados, sin distinción de aportes',
      'Cartilla prestacional en toda la provincia de Buenos Aires',
      'Clínicas, guardias y policonsultorios',
      'Telemedicina',
      'Clínica Manuel Belgrano (Escobar), con atención al 100% para afiliados',
      'Receta electrónica',
    ],
    diferenciadores: [
      'App IOMA Digital: autorizaciones, credencial digital, token, receta electrónica, bonos y telemedicina',
      'Red de prestadores en toda la provincia',
    ],
    pros: [
      'La misma cobertura para todos, sin importar el aporte',
      'Muchos trámites se hacen por la app IOMA Digital',
      'Red en toda la provincia de Buenos Aires',
    ],
    contras: [
      'Es provincial: fuera de la provincia de Buenos Aires la red es limitada',
      'Algunas prestaciones requieren bonos',
    ],
    derivacion: false,
    web: 'ioma.gba.gob.ar',
    fuenteOficial: 'https://www.ioma.gba.gob.ar/index.php/institucional',
    verificado: '2026-09-23',
    telefonos: [
      { etiqueta: 'Mesa de Ayuda Remota (app, usuario y token)', valor: '+54 9 11 2242-5600' },
      { etiqueta: 'Afiliación voluntaria colectiva (convenios)', valor: '(0221) 483-9812' },
    ],
    faq: [
      { q: '¿Qué es IOMA?', a: 'Es la obra social de la provincia de Buenos Aires. Funciona como un sistema solidario: todos los afiliados reciben la misma cobertura, sin distinción de aportes.' },
      { q: '¿Qué puedo hacer en la app IOMA Digital?', a: 'Según IOMA: autorizar y seguir trámites, consultar el vademécum, obtener la credencial digital, generar el token para validar prestaciones, sacar la receta electrónica, hacer trámites afiliatorios, pedir bonos extras, usar telemedicina y pedir derivaciones digitales.' },
      { q: '¿Cuál es el teléfono de IOMA?', a: 'Para problemas con la app, el usuario o el token, la Mesa de Ayuda Remota: +54 9 11 2242-5600. Para afiliación voluntaria colectiva: (0221) 483-9812. También podés ir a tu delegación.' },
      { q: '¿Puedo tener IOMA y una prepaga?', a: 'Sí: podés contratar una prepaga como particular y mantener IOMA. Te cotizamos gratis y te decimos qué prepagas tienen buena red en tu ciudad.' },
    ],
    keywords: ['ioma', 'ioma digital', 'ioma cartilla', 'ioma telefono', 'ioma credencial', 'obra social provincia de buenos aires'],
  },
  {
    slug: 'sancor-os',
    nombre: 'Sancor Salud (OS)',
    emoji: '🌿',
    tipo: 'sindical',
    titulo: 'Sancor Salud como obra social: derivación de aportes y cobertura (2026)',
    metaDescripcion: 'Sancor Salud obra social 2026. Derivación de aportes, planes disponibles, precios y cobertura en todo el país. Guía completa.',
    descripcion: 'Sancor Salud opera como obra social nacional con excelente cobertura en el interior del país.',
    intro: 'Sancor Salud es una de las pocas prepagas-obra social con cobertura efectiva en todo el territorio nacional, incluyendo el interior profundo. Su red alcanza incluso ciudades pequeñas del NOA, NEA y Patagonia donde otras obras sociales tienen poca presencia.',
    beneficiarios: 700000,
    quienesPuedenAfiliarse: [
      'Trabajadores en relación de dependencia (por derivación)',
      'Monotributistas y autónomos',
      'Jubilados (complementaria a PAMI)',
      'Familiares del titular hasta cierta edad',
    ],
    aportes: {
      trabajador: '3% del salario bruto (más diferencia del plan)',
      empleador: '6% del salario bruto',
      monotributista: `Desde ${desdeOficial('sancor-salud')}`,
    },
    cobertura: [
      'PMO completo en todo el país',
      'Red de 30.000+ prestadores nacionales',
      'Internación y cirugías',
      'Maternidad completa',
      'Salud mental',
      'Cobertura de emergencias en todo el territorio',
    ],
    diferenciadores: [
      'Mejor cobertura nacional del mercado (incluyendo provincias alejadas)',
      'Fuerte presencia en el interior del país',
      'Sancor Salud Digital para autogestión',
    ],
    pros: [
      'La mejor cobertura en el interior del país',
      'Precios más accesibles que OSDE y Swiss Medical',
      'Red de 30.000+ profesionales nacionales',
      'Excelente para familias y viajeros frecuentes',
    ],
    contras: [
      'Menos infraestructura propia que Swiss Medical',
      'Menor satisfacción que la competencia premium en AMBA',
      'Algunos planes con restricciones',
    ],
    derivacion: true,
    web: 'sancorsalud.com.ar',
    faq: [
      { q: '¿Puedo derivar mi obra social a Sancor Salud?', a: 'Sí, podés derivar los aportes de tu obra social sindical a Sancor Salud. Es uno de los destinos más solicitados por la cobertura nacional que ofrece. El trámite se hace online a través del portal de la Superintendencia.' },
      { q: '¿Sancor Salud tiene cobertura en todo el país?', a: 'Sí, es una de las prepagas-obras sociales con mayor cobertura territorial de Argentina. Tiene prestadores en todas las provincias, incluyendo zonas rurales y ciudades pequeñas del interior profundo.' },
    ],
    keywords: ['sancor salud obra social', 'derivar a sancor salud', 'sancor salud cobertura nacional', 'sancor salud interior del pais'],
  },
  {
    // Reescrita 1-oct-2026: la ficha anterior la daba por "telecomunicaciones"
    // (error). Fuentes: registro de la SSSalud (RNAS 1-2170-5), ospat.com.ar y
    // su Anexo III 2026. Sin cifra de beneficiarios: no la publican.
    slug: 'ospat',
    nombre: 'OSPAT',
    emoji: '🏇',
    tipo: 'sindical',
    titulo: 'OSPAT (Turf): teléfonos, WhatsApp, planes y afiliación (2026)',
    metaDescripcion: 'OSPAT, la obra social del personal del Turf: emergencias 0800-999-1656, WhatsApp de atención y planes PMO y Bronce. Quién puede afiliarse y cómo pasar tus aportes.',
    descripcion: 'La Obra Social del Personal de la Actividad del Turf: hipódromos, studs y haras.',
    intro: 'OSPAT es la Obra Social del Personal de la Actividad del Turf, la de quienes trabajan en hipódromos, studs y haras. Tiene sede en la Ciudad de Buenos Aires y cobertura en todo el país, con dos planes (PMO y Bronce) y credencial digital en la app SiSalud. Como está en el listado de la opción de cambio, también la eligen trabajadores de otras actividades.',
    quienesPuedenAfiliarse: [
      'Trabajadores de la actividad del turf (hipódromos, studs, haras) y su grupo familiar',
      'Trabajadores en relación de dependencia de otras actividades, con la opción de cambio de obra social',
    ],
    aportes: {
      trabajador: '3% del salario bruto',
      empleador: '6% del salario bruto',
    },
    cobertura: [
      'Programa Médico Obligatorio (PMO)',
      'Plan Bronce, superior al PMO',
      'Emergencias las 24 horas: 0800-999-1656',
      'Telemedicina con la app Hola Doctor',
      'Credencial digital y autorizaciones en la app SiSalud',
    ],
    diferenciadores: [
      'Dos planes: PMO y Bronce',
      'Atención por WhatsApp con ALBA, su asistente',
      'Cartilla oficial con sanatorios en todo el país',
    ],
    pros: [
      'Gestiones por WhatsApp y app, sin ir a una oficina',
      'Telemedicina incluida',
      'Se puede elegir con la opción de cambio',
    ],
    contras: [
      'Red más chica que la de las obras sociales grandes',
      'No publica cuántos afiliados tiene',
    ],
    derivacion: true,
    web: 'ospat.com.ar',
    fuenteOficial: 'https://www.ospat.com.ar/',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'Emergencias (24 h)', valor: '0800-999-1656' },
      { etiqueta: 'WhatsApp de atención (ALBA)', valor: '11 5342-9438', detalle: 'Nuevo número informado por OSPAT. El anterior era 11 5812-9260.' },
      { etiqueta: 'Administración', valor: '(011) 5070-2000' },
    ],
    faq: [
      { q: '¿Qué es OSPAT?', a: 'Es la Obra Social del Personal de la Actividad del Turf, la de quienes trabajan en hipódromos, studs y haras. Está inscripta en el Registro Nacional de Agentes del Seguro de Salud con el número 1-2170-5.' },
      { q: '¿Cuál es el teléfono de emergencias de OSPAT?', a: 'El 0800-999-1656, gratuito y las 24 horas. Para trámites y consultas, OSPAT atiende por WhatsApp con su asistente ALBA en el 11 5342-9438.' },
      { q: '¿Qué planes tiene OSPAT?', a: 'Dos: el Plan PMO, con la cobertura obligatoria, y el Plan Bronce, con prestaciones por encima del PMO.' },
      { q: '¿Puedo pasarme a OSPAT si no trabajo en el turf?', a: 'Sí. OSPAT figura en el listado de obras sociales que se pueden elegir con la opción de cambio, así que cualquier trabajador en relación de dependencia puede pasar sus aportes.' },
    ],
    keywords: ['ospat', 'ospat obra social', 'ospat telefono', 'ospat whatsapp', 'obra social del turf', 'ospat plan bronce'],
  },
  {
    // Antes "UPCN Salud" (23-sep-2026): nadie lo busca así (Google Trends: 0);
    // la obra social se llama Unión Personal. /obras-sociales/upcn redirige acá.
    // Datos de unionpersonal.com.ar y accordsalud.com.ar.
    slug: 'union-personal',
    nombre: 'Unión Personal',
    emoji: '🏛',
    tipo: 'sindical',
    titulo: 'Unión Personal (UPCN): cartilla, teléfonos y planes (2026)',
    metaDescripcion: 'Unión Personal es la obra social de UPCN, con centros médicos propios como el Sanatorio Anchorena. Teléfonos de urgencias y atención, planes superadores Accord Salud y cómo derivar tus aportes.',
    descripcion: 'La obra social de UPCN (Unión del Personal Civil de la Nación), con centros médicos propios.',
    intro: 'Unión Personal es la obra social de UPCN, la Unión del Personal Civil de la Nación. Tiene centros médicos propios, como el Sanatorio Anchorena, y desde 1998 ofrece planes superadores bajo la marca Accord Salud.',
    quienesPuedenAfiliarse: [
      'Trabajadores en relación de dependencia, que pueden elegirla como obra social (libre elección, Decreto 504/98)',
      'Familiares a cargo del titular',
      'Afiliados que se jubilan y no optan por pasar a PAMI (según Unión Personal, por una medida cautelar de 2019)',
    ],
    aportes: {
      trabajador: '3% del salario bruto (Ley 23.660)',
      empleador: '6% del salario bruto (Ley 23.660)',
    },
    cobertura: [
      'PMO',
      'Centros médicos propios, entre ellos el Sanatorio Anchorena',
      'Telemedicina en todos los planes, sin coseguro',
      'Urgencias odontológicas y psiquiátricas',
      'Planes superadores Accord Salud',
    ],
    diferenciadores: [
      'Centros médicos propios',
      'Planes superadores Accord Salud para mejorar la cobertura',
    ],
    pros: [
      'Sanatorio Anchorena y otros centros propios',
      'Telemedicina sin coseguro en todos los planes',
      'Opción de subir de cobertura con Accord Salud',
    ],
    contras: [
      'Para mejorar la cobertura hay que sumar un plan superador, con costo adicional',
    ],
    derivacion: true,
    web: 'unionpersonal.com.ar',
    fuenteOficial: 'https://www.unionpersonal.com.ar/',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'Riesgo de vida', valor: '0800-199-0911' },
      { etiqueta: 'Urgencias y visitas médicas', valor: '0810-222-0085' },
      { etiqueta: 'Atención al afiliado', valor: '0810-555-1100' },
      { etiqueta: 'Urgencias odontológicas', valor: '0810-362-0047' },
      { etiqueta: 'Urgencias psiquiátricas', valor: '0810-555-1100' },
      { etiqueta: 'Desde el exterior', valor: '+5411 4516-8102' },
    ],
    // Gancho de conversión (1-oct-2026): igual que en OSECAC, "union personal
    // turnos" (6.600/mes) le gana a "cartilla union personal" y "teléfono"
    // (5.400 cada una) — confirmado con Google Ads Keyword Planner. Acá
    // además no hay portal propio de turnos online (se gestiona por
    // WhatsApp o los teléfonos de atención), así que el dolor real es más
    // fuerte todavía.
    ganchoConversion: '¿Tenés que esperar para conseguir un turno? Derivá tus aportes a una prepaga, mejorá tu cobertura y sacá turno online al toque.',
    faq: [
      { q: '¿Unión Personal es la obra social de UPCN?', a: 'Sí. Es la Obra Social de la Unión del Personal Civil de la Nación (UPCN).' },
      { q: '¿Qué es Accord Salud respecto de Unión Personal?', a: 'Son los planes superadores de Unión Personal: se incorporaron en 1998 para mejorar la cobertura de la obra social.' },
      { q: '¿Cuál es el teléfono de Unión Personal?', a: 'Según su web: riesgo de vida 0800-199-0911; urgencias y visitas médicas 0810-222-0085; atención 0810-555-1100; urgencias odontológicas 0810-362-0047.' },
      { q: '¿Cómo saco un turno en Unión Personal?', a: 'No tiene un portal de turnos 100% autogestionable: se pide por WhatsApp (ícono en la web oficial, completando los datos que te piden) o llamando a los teléfonos de atención (0810-555-1100 / 0810-222-0085).' },
      { q: '¿Dónde quedan las sucursales de Unión Personal?', a: 'La Casa Central está en Tucumán 949, CABA. También tiene sucursales en Avellaneda (Buenos Aires), Corrientes, Formosa, Santa Rosa (La Pampa), Mendoza, San Carlos de Bariloche (Río Negro) y Ushuaia (Tierra del Fuego), todas de lunes a viernes de 9:30 a 16:00.' },
      { q: '¿Puedo pasar de Unión Personal a una prepaga?', a: 'Sí: si trabajás en relación de dependencia podés derivar tus aportes a una prepaga, una vez por año. Te cotizamos gratis y comparamos con lo que tenés.' },
    ],
    keywords: ['union personal', 'union personal obra social', 'union personal cartilla', 'union personal telefono', 'union personal turnos', 'cartilla union personal', 'obra social upcn', 'upcn obra social'],
  },
  {
    // Actualizado 30-sep-2026: el Decreto 88/2026 (6-feb-2026) dispuso la
    // disolución y liquidación de IOSFA, dividiendo su cobertura en dos
    // entidades nuevas — OSFA (Fuerzas Armadas) y OSFFESEG (Fuerzas Federales
    // de Seguridad). Fuentes: Boletín Oficial / Decreto 88/2026, Parlamentario,
    // Perfil, Canal26, La Capital MDP, iosfa.gob.ar (aviso "Nuevo esquema de
    // cobertura médica"). IOSFA deja de existir el 5-feb-2027.
    slug: 'iosfa',
    nombre: 'IOSFA',
    emoji: '🎖️',
    tipo: 'estatal',
    titulo: 'IOSFA 2026: se disuelve — qué pasa con tu cobertura y a dónde vas ahora',
    metaDescripcion: 'IOSFA está en liquidación desde el Decreto 88/2026 y deja de existir en febrero de 2027. Se divide en OSFA (Fuerzas Armadas) y OSFFESEG (Fuerzas de Seguridad). Qué cambia para vos.',
    descripcion: 'IOSFA, la ex obra social de las Fuerzas Armadas y de Seguridad, está en proceso de disolución.',
    intro: 'IOSFA (Instituto de Obra Social de las Fuerzas Armadas) dejó de ser la obra social activa de los militares y fuerzas de seguridad: el Decreto 88/2026 dispuso su disolución y liquidación, con fecha límite el 5 de febrero de 2027. En su lugar se crearon dos entidades nuevas, separadas por fuerza: OSFA para el personal de Ejército, Armada y Fuerza Aérea, y OSFFESEG para Gendarmería y Prefectura Naval. Si todavía sos afiliado de IOSFA, tu cobertura está en transición hacia una de esas dos — no hace falta ningún trámite de tu parte.',
    beneficiarios: 200000,
    quienesPuedenAfiliarse: [
      'Ya no admite nuevos afiliados: está en liquidación',
      'Los afiliados existentes están pasando a OSFA (Fuerzas Armadas) o a OSFFESEG (Gendarmería y Prefectura), según corresponda',
    ],
    aportes: {
      trabajador: 'Descuento del haber mensual (ahora a nombre de OSFA u OSFFESEG, según la fuerza)',
      empleador: 'El Estado Nacional',
      monotributista: 'No aplica (es exclusiva para las fuerzas)',
    },
    cobertura: [
      'En transición: IOSFA mantiene por un tiempo los tratamientos de alta complejidad ya autorizados y la provisión de medicación crónica, para no cortar continuidad mientras se completa el pase a OSFA/OSFFESEG',
    ],
    diferenciadores: [
      'Ya no es la obra social activa: es el organismo que se está liquidando',
    ],
    pros: [
      'Mientras dura la transición, sostiene los tratamientos de alta complejidad ya en curso',
    ],
    contras: [
      'Está en liquidación: no es una cobertura a elegir ni en la que dar de alta a nadie nuevo',
      'La fecha de disolución definitiva es el 5 de febrero de 2027',
    ],
    derivacion: false,
    web: 'iosfa.gob.ar',
    fuenteOficial: 'Decreto 88/2026 (Boletín Oficial) y aviso "Nuevo esquema de cobertura médica" en iosfa.gob.ar',
    verificado: '2026-09-30',
    faq: [
      { q: '¿IOSFA sigue existiendo?', a: 'Está en proceso de disolución y liquidación desde el Decreto 88/2026 (6 de febrero de 2026), con fecha límite el 5 de febrero de 2027. No toma afiliados nuevos: los que ya tenía están pasando a OSFA o a OSFFESEG.' },
      { q: '¿Por qué se disolvió IOSFA?', a: 'El Gobierno invocó un desequilibrio financiero persistente, con un déficit declarado de unos $200.000 millones, y la heterogeneidad de su padrón de afiliados (fuerzas con necesidades muy distintas bajo una misma estructura).' },
      { q: '¿Qué obra social me corresponde ahora si era de IOSFA?', a: 'Depende de tu fuerza: si sos de Ejército, Armada o Fuerza Aérea, pasás a OSFA (Ministerio de Defensa). Si sos de Gendarmería o Prefectura Naval, pasás a OSFFESEG, cuya atención médica gestiona Medicus desde el 1 de junio de 2026.' },
      { q: '¿Tengo que hacer algún trámite por el cambio?', a: 'Según los avisos oficiales, no: el pase es automático y no requiere presentarte en persona, pagar nada ni gestionar nada a través de terceros. Confirmá tus datos si te llega un mail de validación de OSFA u OSFFESEG.' },
    ],
    keywords: ['iosfa obra social', 'iosfa disolucion', 'iosfa se disuelve', 'que paso con iosfa', 'iosfa cierre', 'iosfa 2026'],
  },
  {
    // Nueva (30-sep-2026): creada por el Decreto 88/2026 para el personal de
    // las Fuerzas Armadas, en reemplazo de IOSFA. A diferencia de OSFFESEG, no
    // tercerizó la atención en una prepaga: arma su propia red de
    // prestadores, y los medios reportan problemas de cobertura durante la
    // transición. Fuentes: Decreto 88/2026, Perfil ("A seis meses de la
    // disolución del IOSFA las Fuerzas Armadas siguen sin cobertura médica"),
    // Parlamentario, defonline.com.ar.
    slug: 'osfa',
    nombre: 'OSFA',
    emoji: '🎖️',
    tipo: 'estatal',
    titulo: 'OSFA 2026: la nueva obra social de las Fuerzas Armadas (ex IOSFA)',
    metaDescripcion: 'OSFA es la obra social de Ejército, Armada y Fuerza Aérea desde 2026, creada al disolverse IOSFA. Quiénes cubre, qué problemas reportó la transición y tus alternativas.',
    descripcion: 'OSFA es la obra social de las Fuerzas Armadas (Ejército, Armada y Fuerza Aérea), creada en 2026 al disolverse IOSFA.',
    intro: 'OSFA (Obra Social de las Fuerzas Armadas) se creó por el Decreto 88/2026, bajo la órbita del Ministerio de Defensa, para cubrir al personal de Ejército, Armada y Fuerza Aérea que antes estaba en IOSFA. A diferencia de lo que hizo el Ministerio de Seguridad con Gendarmería y Prefectura (que tercerizó la atención en Medicus), OSFA arma su propia red de prestadores en vez de delegarla en una prepaga — y varios medios reportaron, a seis meses de la transición, dificultades de cobertura en algunas zonas.',
    beneficiarios: 200000,
    quienesPuedenAfiliarse: [
      'Personal en actividad del Ejército, la Armada y la Fuerza Aérea',
      'Personal retirado de esas tres fuerzas',
      'Familiares a cargo del afiliado titular',
    ],
    aportes: {
      trabajador: 'Descuento del haber mensual',
      empleador: 'El Estado Nacional (Ministerio de Defensa)',
      monotributista: 'No aplica (es exclusiva para las fuerzas)',
    },
    cobertura: [
      'Red de prestadores propia, en formación (no tercerizada en una prepaga)',
      'Continuidad de los hospitales militares que ya existían',
      'Reintegro por atención particular cuando no hay prestador disponible: la persona puede atenderse por su cuenta y pedir el reintegro dentro de los 30 días, según reportes periodísticos',
    ],
    diferenciadores: [
      'Mantiene su propia red de hospitales militares en vez de delegar en una prepaga',
      'El Ministerio de Defensa desarrolla una app propia con credencial digital para la gestión',
    ],
    pros: [
      'Sostiene la red de hospitales militares existente',
      'Reintegro disponible si no hay prestador cercano',
    ],
    contras: [
      'Medios reportaron fallas de cobertura en varias zonas a seis meses de la transición, con reclamos públicos de afiliados y veteranos',
      'El propio organismo reconoció que todavía no funciona al 100% y estimó un año para la puesta a punto completa',
      'No tiene una opción formal de derivar aportes a una prepaga privada',
    ],
    derivacion: false,
    fuenteOficial: 'Decreto 88/2026 (Boletín Oficial) y cobertura periodística de Perfil y Parlamentario',
    verificado: '2026-09-30',
    faq: [
      { q: '¿Qué es OSFA?', a: 'Es la Obra Social de las Fuerzas Armadas, creada por el Decreto 88/2026 para el personal de Ejército, Armada y Fuerza Aérea, en reemplazo de IOSFA.' },
      { q: '¿OSFA funciona bien?', a: 'Según reportes periodísticos de mediados de 2026, no al 100%: hubo dificultades de cobertura en ciertas zonas durante la transición, y la propia conducción de OSFA reconoció el problema y estimó alrededor de un año para normalizar el servicio.' },
      { q: '¿Puedo derivar mis aportes de OSFA a una prepaga?', a: 'No hay una opción formal de libre elección confirmada para el personal de las Fuerzas Armadas. Si tenés un problema puntual de cobertura, algunos afiliados optaron por atenderse de forma particular y pedir el reintegro, o por la cobertura especial de PAMI para veteranos, según el caso.' },
      { q: '¿OSFA es lo mismo que IOSFA?', a: 'No: IOSFA está en liquidación. OSFA es la entidad nueva que lo reemplaza específicamente para el personal de las Fuerzas Armadas (Gendarmería y Prefectura pasaron a OSFFESEG, no a OSFA).' },
    ],
    keywords: ['osfa obra social', 'osfa fuerzas armadas', 'osfa ex iosfa', 'osfa cobertura', 'que es osfa'],
  },
  {
    // Nueva (30-sep-2026): creada por el Decreto 88/2026 para Gendarmería y
    // Prefectura Naval. A diferencia de OSFA, la atención médica se tercerizó
    // por completo en Medicus desde el 1-jun-2026. Fuentes: Decreto 88/2026,
    // argentina.gob.ar/seguridad/nueva-obra-social (oficial), iosfa.gob.ar
    // (aviso de transición), Confidencial, El Estratégico, Tiempo Militar.
    slug: 'osffeseg',
    nombre: 'OSFFESEG',
    emoji: '🎖️',
    tipo: 'estatal',
    titulo: 'OSFFESEG 2026: la obra social de Gendarmería y Prefectura, gestionada por Medicus',
    metaDescripcion: 'OSFFESEG cubre a Gendarmería y Prefectura Naval desde 2026 (ex IOSFA). La atención médica la gestiona Medicus desde junio de 2026, con planes MS1 y MS2. Aportes, teléfonos y cómo funciona.',
    descripcion: 'OSFFESEG es la obra social de las Fuerzas Federales de Seguridad (Gendarmería y Prefectura Naval), creada en 2026 al disolverse IOSFA.',
    intro: 'OSFFESEG (Obra Social de las Fuerzas Federales de Seguridad) se creó por el Decreto 88/2026, bajo el Ministerio de Seguridad, para cubrir al personal de Gendarmería Nacional y Prefectura Naval que antes estaba en IOSFA. A diferencia de OSFA (Fuerzas Armadas), acá el Ministerio tercerizó toda la atención médica: desde el 1 de junio de 2026 la gestiona Medicus, con dos planes (MS1 y MS2) y sus propios canales de atención.',
    beneficiarios: 200000,
    quienesPuedenAfiliarse: [
      'Personal en actividad de la Gendarmería Nacional Argentina',
      'Personal en actividad de la Prefectura Naval Argentina',
      'Retirados y pensionados de ambas fuerzas',
      'Grupo familiar primario del afiliado titular',
    ],
    aportes: {
      trabajador: '7% para personal en actividad sin grupo familiar, 8% con grupo familiar',
      empleador: 'El Estado Nacional (Ministerio de Seguridad)',
      monotributista: 'No aplica — aporte de 8% para retirados/pensionados sin grupo familiar, 9% con grupo familiar',
    },
    cobertura: [
      'Atención médica integral a cargo de Medicus (plan MS1 con copago de $20.000, o plan MS2 sin copago)',
      'Credencial y trámites digitales por la app "Mi Medicus"',
      'Emergencias y urgencias por la línea de Medicus',
    ],
    diferenciadores: [
      'Única entre las ex-IOSFA con la atención médica completamente tercerizada en una prepaga (Medicus)',
      'Dos planes a elección: con copago (MS1) o sin copago (MS2)',
      'Canales de atención propios: teléfono gratuito, WhatsApp y mail dedicados',
    ],
    pros: [
      'Cartilla y gestión de una prepaga establecida (Medicus), no una red armada desde cero',
      'Plan sin copago disponible (MS2)',
      'Inscripción sin trámite presencial: validación de datos online',
    ],
    contras: [
      'Es un cambio reciente (junio 2026): todavía no hay suficiente antigüedad para evaluar la cartilla real a fondo',
      'No tiene una opción formal de derivar aportes a otra prepaga distinta de Medicus',
    ],
    derivacion: false,
    web: 'medicus.com.ar/ministeriodeseguridad',
    telefonos: [
      { etiqueta: 'Línea gratuita', valor: '0800-220-9006' },
      { etiqueta: 'WhatsApp', valor: '+54 9 11 5094-1119' },
      { etiqueta: 'Emergencias', valor: '011 4129-5300', detalle: 'opción 1' },
    ],
    fuenteOficial: 'argentina.gob.ar/seguridad/nueva-obra-social (oficial) y Decreto 88/2026',
    verificado: '2026-09-30',
    faq: [
      { q: '¿Qué es OSFFESEG?', a: 'Es la Obra Social de las Fuerzas Federales de Seguridad, creada por el Decreto 88/2026 para el personal de Gendarmería Nacional y Prefectura Naval, en reemplazo de IOSFA.' },
      { q: '¿Quién atiende médicamente a los afiliados de OSFFESEG?', a: 'Medicus S.A., por contrato con el Ministerio de Seguridad desde el 1 de junio de 2026. Cubre a unos 200.000 afiliados entre personal activo, retirados, pensionados y sus familias.' },
      { q: '¿Qué planes tiene OSFFESEG con Medicus?', a: 'Dos: el Plan MS1, con copago de $20.000, y el Plan MS2, sin copago.' },
      { q: '¿Cuánto se aporta a OSFFESEG?', a: '7% del haber para personal activo sin grupo familiar, 8% con grupo familiar; 8% para retirados y pensionados sin grupo familiar, 9% con grupo familiar.' },
      { q: '¿OSFFESEG es lo mismo que OSFA?', a: 'No: son dos entidades distintas creadas por el mismo decreto. OSFA es para Ejército, Armada y Fuerza Aérea (Ministerio de Defensa); OSFFESEG es para Gendarmería y Prefectura Naval (Ministerio de Seguridad), con la atención tercerizada en Medicus.' },
    ],
    keywords: ['osffeseg', 'osffeseg obra social', 'osffeseg medicus', 'obra social gendarmeria', 'obra social prefectura naval', 'osffeseg telefono'],
  },
  {
    slug: 'osdepym',
    nombre: 'OSDEPYM',
    emoji: '🏪',
    tipo: 'empresarial',
    titulo: 'OSDEPYM 2026: la obra social para directivos y dueños de PyMEs',
    metaDescripcion: 'OSDEPYM obra social para empleadores y directivos de PyMEs en Argentina 2026. Qué cubre, cómo afiliarse y cuánto cuesta.',
    descripcion: 'La obra social diseñada para empleadores y directivos de pequeñas y medianas empresas.',
    intro: 'OSDEPYM (Obras Sociales de Dirección de Empresas y Empleadores PyMEs) está pensada para los empleadores, directivos y dueños de pequeñas y medianas empresas de Argentina. Es una alternativa a la prepaga privada con los beneficios de la obra social.',
    beneficiarios: 120000,
    quienesPuedenAfiliarse: [
      'Empleadores y dueños de empresas (monotributistas categoría C en adelante)',
      'Directivos y gerentes',
      'Familiares del titular',
    ],
    aportes: {
      trabajador: 'N/A (son empleadores)',
      empleador: 'N/A',
      monotributista: 'Cuota según plan y edad (sin precio oficial publicado)',
    },
    cobertura: [
      'PMO completo',
      'Red de prestadores en todo el país',
      'Internaciones y cirugías',
      'Maternidad',
      'Salud mental',
      'Medicamentos con descuento',
    ],
    diferenciadores: [
      'Diseñada específicamente para empleadores',
      'Proceso de afiliación simple para dueños de PyMEs',
      'Precios competitivos para el segmento',
    ],
    pros: [
      'Accesible para empleadores que no tienen otra cobertura obligatoria',
      'Precio más accesible que las grandes prepagas',
      'Cobertura nacional',
    ],
    contras: [
      'Menos conocida que las grandes obras sociales',
      'Red puede ser más limitada en algunas zonas',
    ],
    derivacion: false,
    web: 'osdepym.org.ar',
    faq: [
      { q: '¿Quién puede afiliarse a OSDEPYM?', a: 'OSDEPYM está pensada para empleadores, directivos y dueños de empresas. Los monotributistas con categoría C en adelante pueden acceder. No es para empleados en relación de dependencia.' },
      { q: '¿OSDEPYM es una buena alternativa a la prepaga?', a: 'Para empleadores y dueños de PyMEs, OSDEPYM puede ser una alternativa más económica que las prepagas premium, manteniendo una cobertura completa del PMO.' },
    ],
    keywords: ['osdepym obra social', 'osdepym pymes empleadores', 'osdepym afiliarse', 'obra social para empleadores'],
  },
  {
    slug: 'amsalud',
    nombre: 'AmSALUD',
    emoji: '🌟',
    tipo: 'sindical',
    titulo: 'AmSALUD 2026: obra social con planes flexibles para derivaciones',
    metaDescripcion: 'AmSALUD obra social argentina 2026. Quiénes pueden derivar, qué planes ofrece y qué cobertura incluye. Guía completa.',
    descripcion: 'AmSALUD es un destino de derivación popular por sus precios competitivos y variedad de planes.',
    intro: 'AmSALUD se posiciona como un destino de derivación de aportes muy elegido por los trabajadores argentinos que buscan mejorar su cobertura de salud sin los costos de las grandes prepagas. Ofrece una variedad de planes adaptados a distintos presupuestos.',
    beneficiarios: 95000,
    quienesPuedenAfiliarse: [
      'Cualquier trabajador en relación de dependencia (por derivación)',
      'Monotributistas y autónomos',
      'Familiares del titular',
    ],
    aportes: {
      trabajador: '3% del salario bruto (+ diferencia del plan)',
      empleador: '6% del salario bruto',
      monotributista: 'Cuota según plan y edad (sin precio oficial publicado)',
    },
    cobertura: [
      'PMO completo',
      'Red de prestadores nacionales',
      'Internaciones',
      'Maternidad',
      'Salud mental',
      'Medicamentos',
    ],
    diferenciadores: [
      'Variedad de planes a distintos precios',
      'Proceso de derivación simple y rápido',
      'Planes desde muy accesibles hasta premium',
    ],
    pros: [
      'Gran variedad de planes',
      'Proceso de derivación eficiente',
      'Precios accesibles en relación a la cobertura',
    ],
    contras: [
      'Menos reconocida en el mercado',
      'Red puede variar según zona y plan',
    ],
    derivacion: true,
    web: 'amsalud.com.ar',
    faq: [
      { q: '¿Cómo me derivo a AmSALUD?', a: 'La derivación a AmSALUD se tramita online a través del portal de la Superintendencia de Servicios de Salud. Necesitás tu CUIL, los datos del empleador y elegir el plan deseado. El proceso demora entre 30 y 60 días hábiles.' },
    ],
    keywords: ['amsalud obra social', 'amsalud planes precios', 'derivar a amsalud', 'amsalud cobertura'],
  },
  {
    // Reescrita 1-oct-2026: la ficha anterior la daba por "seguridad privada"
    // (error: es la de la actividad de Seguros). Fuentes: registro de la SSSalud
    // (RNAS 0-0090-1), osseg.org.ar y su Anexo III 2026.
    slug: 'osseg',
    nombre: 'OSSEG',
    emoji: '🛡️',
    tipo: 'sindical',
    titulo: 'OSSEG: la obra social de Seguros, teléfonos y afiliación (2026)',
    metaDescripcion: 'OSSEG, la obra social de la actividad de Seguros y Reaseguros: teléfonos 0800-777-67734 y 4131-2000, sede en Carlos Pellegrini 575. Quién puede afiliarse y cómo pasar tus aportes.',
    descripcion: 'La obra social de la actividad de Seguros, Reaseguros, Capitalización y Ahorro y Préstamo para la Vivienda.',
    intro: 'OSSEG es la Obra Social de la Actividad de Seguros, Reaseguros, Capitalización y Ahorro y Préstamo para la Vivienda: la de quienes trabajan en compañías de seguros y afines. Tiene sede en Carlos Pellegrini 575 (CABA) y prestadores en todo el país. Está en el listado de la opción de cambio, así que también la pueden elegir trabajadores de otras actividades.',
    quienesPuedenAfiliarse: [
      'Trabajadores de la actividad aseguradora, reaseguradora, de capitalización y de ahorro y préstamo, y su grupo familiar',
      'Trabajadores en relación de dependencia de otras actividades, con la opción de cambio de obra social',
    ],
    aportes: {
      trabajador: '3% del salario bruto',
      empleador: '6% del salario bruto',
    },
    cobertura: [
      'Programa Médico Obligatorio (PMO)',
      'Cartilla oficial con sanatorios, guardias y centros de diagnóstico en todo el país',
      'Portal de afiliados en su web',
    ],
    diferenciadores: [
      'Obra social de la actividad aseguradora',
      'Prestadores en las 24 provincias según su cartilla oficial',
    ],
    pros: [
      'Se puede elegir con la opción de cambio',
      'Cartilla con alcance nacional',
    ],
    contras: [
      'Red más chica que la de las obras sociales grandes',
      'No publica cuántos afiliados tiene',
    ],
    derivacion: true,
    web: 'osseg.org.ar',
    fuenteOficial: 'https://www.osseg.org.ar/',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'Línea gratuita', valor: '0800-777-67734' },
      { etiqueta: 'Sede (CABA)', valor: '(011) 4131-2000', detalle: 'Carlos Pellegrini 575' },
    ],
    faq: [
      { q: '¿Qué es OSSEG?', a: 'Es la Obra Social de la Actividad de Seguros, Reaseguros, Capitalización y Ahorro y Préstamo para la Vivienda. Está inscripta en el Registro Nacional de Agentes del Seguro de Salud con el número 0-0090-1. No es la obra social de la seguridad privada (esa es OSPSIP).' },
      { q: '¿Cuál es el teléfono de OSSEG?', a: 'La línea gratuita es el 0800-777-67734 y el de la sede, el (011) 4131-2000. La sede está en Carlos Pellegrini 575, Ciudad de Buenos Aires.' },
      { q: '¿Puedo pasarme a OSSEG si no trabajo en seguros?', a: 'Sí. OSSEG figura en el listado de obras sociales que se pueden elegir con la opción de cambio, así que cualquier trabajador en relación de dependencia puede pasar sus aportes.' },
    ],
    keywords: ['osseg', 'osseg obra social', 'osseg telefono', 'obra social de seguros', 'osseg afiliacion'],
  },
  {
    // Reescrita 23-sep-2026 con datos de osecac.org.ar. Antes: cantidad de
    // beneficiarios, "Plan Azul" y datos de monotributo sin verificar.
    slug: 'osecac',
    nombre: 'OSECAC',
    emoji: '🛒',
    tipo: 'sindical',
    titulo: 'OSECAC: teléfonos, turnos, guardias y cómo afiliarte (2026)',
    metaDescripcion: 'OSECAC, la obra social de empleados de comercio: teléfonos de emergencias 0810-333-0004, beneficiarios 0800-666-0400 y turnos 0810-999-0101. App Mi OSECAC, guardias y cómo empadronarte.',
    descripcion: 'La obra social de los empleados de comercio y actividades civiles, fundada en 1964.',
    intro: 'OSECAC (Obra Social de Empleados de Comercio y Actividades Civiles) fue fundada en 1964 con el nombre de I.M.M.A. (Instituto Médico Mercantil Argentina) para dar cobertura médica asistencial, en todos sus niveles, al empleado de comercio y a su grupo familiar. Tiene centros de atención propios, app Mi OSECAC y turnos online.',
    quienesPuedenAfiliarse: [
      'Empleados de comercio y actividades civiles',
      'Trabajadores en relación de dependencia que la eligen por opción de cambio',
      'Grupo familiar del titular: cónyuge, hijos y personas a cargo',
    ],
    aportes: {
      trabajador: '3% del salario bruto (Ley 23.660)',
      empleador: '6% del salario bruto (Ley 23.660)',
    },
    cobertura: [
      'PMO',
      'Centros de atención propios',
      'Guardias (en AMBA se pueden programar turnos de guardia)',
      'Farmacias con convenio y vademécum',
      'Turnos online',
    ],
    diferenciadores: [
      'App Mi OSECAC y gestión web',
      'Delegaciones en todo el país',
    ],
    pros: [
      'Turnos y gestiones online y por app',
      'Centros de atención propios',
      'Delegaciones en todo el país',
    ],
    contras: [
      'Tiene coseguros (valores según resolución de la SSSalud)',
      'El empadronamiento se hace en un centro de gestión',
    ],
    derivacion: true,
    web: 'osecac.org.ar',
    fuenteOficial: 'https://www.osecac.org.ar/',
    verificado: '2026-09-23',
    telefonos: [
      { etiqueta: 'Emergencias', valor: '0810-333-0004' },
      { etiqueta: 'Beneficiarios', valor: '0800-666-0400' },
      { etiqueta: 'Turnos', valor: '0810-999-0101', detalle: 'Tené a mano el DNI del paciente' },
      { etiqueta: 'Reclamos', valor: '0800-666-0445' },
    ],
    // Gancho de conversión (1-oct-2026): "osecac turnos" es la búsqueda más
    // grande de todo el universo OSECAC (12.100/mes, el doble que "cartilla
    // osecac") — el dolor real de la gente es no conseguir turno, no "quiero
    // cambiarme de obra social". El CTA apunta directo a eso.
    ganchoConversion: '¿No conseguís turno en OSECAC? Derivá tus aportes a una prepaga, mejorá tu cobertura y conseguí turnos más rápido.',
    faq: [
      { q: '¿Cuál es el teléfono de OSECAC?', a: 'Emergencias 0810-333-0004; beneficiarios 0800-666-0400; turnos 0810-999-0101; reclamos 0800-666-0445.' },
      { q: '¿Cómo saco turno en OSECAC?', a: 'Por teléfono al 0810-999-0101 (con el DNI del paciente a mano) o de forma online con tu usuario web o la app Mi OSECAC.' },
      { q: '¿Desde cuándo existe OSECAC?', a: 'Desde 1964: nació como I.M.M.A. (Instituto Médico Mercantil Argentina).' },
      { q: '¿Puedo pasar de OSECAC a una prepaga?', a: 'Sí: si trabajás en relación de dependencia podés derivar tus aportes a una prepaga, una vez por año. Te cotizamos gratis.' },
      { q: '¿Dónde queda la delegación de OSECAC más cercana?', a: 'OSECAC tiene delegaciones, agencias, sub-agencias y corresponsalías en todo el país. Buscá la tuya por provincia o localidad en el listado de delegaciones de esta misma página.' },
    ],
    keywords: ['osecac', 'osecac telefono', 'osecac turnos', 'osecac cartilla', 'osecac guardias', 'osecac farmacias', 'osecac delegaciones', 'osecac delegaciones por provincia', 'obra social empleados de comercio'],
  },
  {
    // Reescrita 23-sep-2026 con datos de ospesalud.com.ar (sitio oficial; no
    // confundir con ospe.ar). Antes decía que acepta monotributistas: su web
    // no lo menciona.
    slug: 'ospe',
    nombre: 'OSPe',
    emoji: '⛽',
    tipo: 'sindical',
    titulo: 'OSPe (Obra Social de Petroleros): planes, requisitos y teléfonos (2026)',
    metaDescripcion: 'OSPe, la Obra Social de Petroleros: urgencias 0800-444-0206, atención 0800-444-6773. Qué cubren sus planes, requisitos para la opción de cambio y cómo afiliarte.',
    descripcion: 'La Obra Social de Petroleros, nacida en 1996 con el personal de YPF.',
    intro: 'OSPe (Obra Social de Petroleros) nació en 1996 para dar servicios de salud a los empleados de YPF y sus emprendimientos vinculados. Hoy, según OSPe, es una de las obras sociales más elegidas por opción de cambio, con prestadores en todo el país.',
    quienesPuedenAfiliarse: [
      'Trabajadores de la actividad petrolera',
      'Trabajadores en relación de dependencia que la eligen por opción de cambio, con un salario superior a dos bases mínimas ($248.962,98 según OSPe, Res. ANSES 237/2025)',
      'Grupo familiar: cónyuge o conviviente e hijos (estudiantes hasta 25 años)',
    ],
    aportes: {
      trabajador: '3% del salario bruto (Ley 23.660)',
      empleador: '6% del salario bruto (Ley 23.660)',
    },
    cobertura: [
      'Programa Médico Obligatorio, con alcance nacional',
      'Urgencias y emergencias las 24 horas',
      'Consulta médica y psicológica online las 24 horas sin cargo adicional',
      'Internación clínica y quirúrgica',
      '100% en medicamentos en internación y 40% en ambulatorios',
      'Odontología general y preventiva',
      'Según el plan: habitación individual, ortodoncia, prótesis odontológica, seguro del viajero y acceso sin coseguro',
    ],
    diferenciadores: [
      'Consulta médica y psicológica online 24 horas sin cargo',
      'Planes por zona (AMBA, interior y otras provincias)',
    ],
    pros: [
      'Telemedicina 24 horas incluida',
      'Prestadores en todo el país',
      'Planes superiores con habitación individual y ortodoncia',
    ],
    contras: [
      'Para elegirla por opción de cambio hay un salario mínimo',
      'Algunos beneficios dependen del nivel de plan',
    ],
    derivacion: true,
    web: 'ospesalud.com.ar',
    fuenteOficial: 'https://www.ospesalud.com.ar/afiliados/institucional/',
    verificado: '2026-09-23',
    telefonos: [
      { etiqueta: 'Urgencias y emergencias', valor: '0800-444-0206', detalle: 'Las 24 horas' },
      { etiqueta: 'Atención al beneficiario', valor: '0800-444-6773', detalle: 'Lunes a viernes de 8:30 a 20:30; sábados de 8:30 a 13' },
    ],
    faq: [
      { q: '¿Cuál es el teléfono de OSPe?', a: 'Urgencias y emergencias las 24 horas: 0800-444-0206. Atención al beneficiario: 0800-444-6773 (lunes a viernes de 8:30 a 20:30 y sábados de 8:30 a 13).' },
      { q: '¿Quién puede pasarse a OSPe?', a: 'Según OSPe, los trabajadores en relación de dependencia que aportan a una obra social nacional y tienen un salario superior a dos bases mínimas. El trámite de opción de cambio se hace online en la web de la Superintendencia de Servicios de Salud.' },
      { q: '¿OSPe tiene telemedicina?', a: 'Sí: consulta médica y psicológica online las 24 horas, sin cargo adicional.' },
      { q: '¿Me conviene OSPe o una prepaga?', a: 'Depende de tu zona y de los sanatorios que quieras usar. Con tus aportes también podés derivar a una prepaga: te cotizamos las dos opciones gratis.' },
    ],
    keywords: ['ospe', 'ospe obra social', 'ospe petroleros', 'ospe telefono', 'ospe cartilla', 'ospe planes'],
  },
  {
    // Nueva 23-sep-2026, con datos de osprera.org.ar.
    slug: 'osprera',
    nombre: 'OSPRERA',
    emoji: '🌾',
    tipo: 'sindical',
    titulo: 'OSPRERA (Rurales): teléfonos, turnos y afiliación (2026)',
    metaDescripcion: 'OSPRERA, la obra social del personal rural y estibadores: atención al beneficiario 0800-77-RURAL (78725) las 24 horas, emergencias 0810-444-0911, app y cómo afiliarte.',
    descripcion: 'La obra social del personal rural y estibadores de la República Argentina.',
    intro: 'OSPRERA (Obra Social del Personal Rural y Estibadores de la República Argentina) tiene su origen en 1972, cuando se constituyó el ISSARA (Instituto de Servicios Sociales para las Actividades Rurales y Afines), que con el decreto 492/95 pasó a ser OSPRERA. Según la obra social, atiende cada año a más de dos millones de personas entre titulares y familiares, rurales y monotributistas.',
    quienesPuedenAfiliarse: [
      'Trabajadores rurales y estibadores',
      'Monotributistas',
      'Trabajadores que la eligen por opción de cambio o traspaso',
      'Grupo familiar primario del titular',
    ],
    aportes: {
      trabajador: '3% del salario bruto (Ley 23.660)',
      empleador: '6% del salario bruto (Ley 23.660)',
    },
    cobertura: [
      'Programa Médico Obligatorio',
      'Trasplantes y medicamentos oncológicos',
      'Internaciones, prácticas médicas y bioquímicas',
      'Prótesis y órtesis',
      'Odontología',
    ],
    diferenciadores: [
      'Línea 0800 de atención al beneficiario las 24 horas, todo el año',
      'Sedes en todo el país',
    ],
    pros: [
      'Atención telefónica las 24 horas',
      'Presencia en todo el país, incluidas zonas rurales',
      'Acepta monotributistas',
    ],
    contras: [
      'La afiliación se presenta en la dependencia de OSPRERA de tu domicilio, con formulario y documentación',
    ],
    derivacion: true,
    web: 'osprera.org.ar',
    fuenteOficial: 'https://www.osprera.org.ar/resena-institucional.php',
    verificado: '2026-09-23',
    telefonos: [
      { etiqueta: 'Orientación al beneficiario', valor: '0800-777-8725 (0800-77-RURAL)', detalle: 'Las 24 horas' },
      { etiqueta: 'Riesgo de vida / emergencias', valor: '0810-444-0911' },
    ],
    // Gancho de conversión (1-oct-2026): acá "teléfono" gana por lejos a
    // "turnos" (720 contra 10 búsquedas/mes, Google Ads Keyword Planner) —
    // la gente busca el 0800 para gestionar algo, no un portal de turnos
    // online. El punto real para esta obra social es la red de prestadores
    // más chica en zonas rurales (ya reflejado en "contras" más arriba).
    ganchoConversion: '¿La cartilla de OSPRERA no te alcanza en tu zona? Derivá tus aportes a una prepaga con más sanatorios cerca tuyo.',
    faq: [
      { q: '¿Cuál es el teléfono de OSPRERA?', a: 'Orientación al beneficiario: 0800-777-8725 (0800-77-RURAL), las 24 horas. Emergencias y riesgo de vida: 0810-444-0911.' },
      { q: '¿OSPRERA acepta monotributistas?', a: 'Sí: según OSPRERA, atiende tanto a trabajadores rurales como a monotributistas y sus familias.' },
      { q: '¿Cómo me afilio a OSPRERA?', a: 'Con la Solicitud de Afiliación (Formulario 83 M) por triplicado, presentada en la dependencia de OSPRERA de tu domicilio, con DNI, recibo de sueldo y la documentación del grupo familiar.' },
      { q: '¿Me conviene OSPRERA o una prepaga?', a: 'Depende de tu zona y de los sanatorios que quieras usar. Te cotizamos gratis una prepaga con tus aportes para que compares.' },
    ],
    keywords: ['osprera', 'osprera telefono', 'osprera monotributo', 'obra social trabajadores rurales'],
  },
  {
    // Nueva (1-oct-2026): tercer y cuarto sindical del silo por volumen real
    // (Google Ads Keyword Planner): "cartilla osuthgra" es la búsqueda más
    // grande de todo el universo OSUTHGRA (1.600/mes), muy por encima de
    // "teléfono" o "turnos" — distinto al patrón de OSECAC/Unión Personal.
    // OJO: el sitio osuthgra.org.ar se declara "PARA AFILIADOS A CABA Y GBA"
    // — no queda claro que cubra todo el país con esta misma estructura, así
    // que se aclara la limitación en vez de asumir cobertura nacional.
    slug: 'osuthgra',
    nombre: 'OSUTHGRA',
    emoji: '🍽️',
    tipo: 'sindical',
    titulo: 'OSUTHGRA (Gastronómicos): teléfonos, turnos y afiliación (2026)',
    metaDescripcion: 'OSUTHGRA, la obra social de trabajadores gastronómicos y hoteleros: cartilla médica, teléfonos de urgencias (0800-222-8855) y cómo derivar tus aportes a una prepaga.',
    descripcion: 'La obra social de los trabajadores gastronómicos y hoteleros (UTHGRA).',
    intro: 'OSUTHGRA es la obra social de UTHGRA, el sindicato de trabajadores gastronómicos y hoteleros. Su portal oficial (osuthgra.org.ar) está dirigido específicamente a afiliados de CABA y GBA, con consultorios propios, videoconsulta y guía de trámites online.',
    quienesPuedenAfiliarse: [
      'Trabajadores gastronómicos y hoteleros en relación de dependencia',
      'Grupo familiar a cargo del titular',
    ],
    aportes: {
      trabajador: '3% del salario bruto (Ley 23.660)',
      empleador: '6% del salario bruto (Ley 23.660)',
    },
    cobertura: [
      'PMO',
      'Consultorios propios con odontología y oftalmología',
      'Videoconsulta médica para afiliados de CABA y GBA',
      'Urgencias médicas y odontológicas',
    ],
    diferenciadores: [
      'Videoconsulta con profesionales propios, sin trasladarte al sanatorio',
      'Credencial digital y guía de trámites online',
    ],
    pros: [
      'Consultorios propios de odontología y oftalmología',
      'Atención a urgencias las 24 horas',
    ],
    contras: [
      'El portal y los servicios digitales están pensados para afiliados de CABA y GBA; en el resto del país la cobertura real puede variar',
    ],
    derivacion: true,
    web: 'osuthgra.org.ar',
    fuenteOficial: 'https://osuthgra.org.ar/contactos/',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'COA (urgencias médicas)', valor: '0800-222-8855', detalle: 'También (011) 4959-8200 (CABA Norte) y (011) 4522-6584' },
      { etiqueta: 'Urgencias odontológicas CABA', valor: 'Triunvirato 4096 1°', detalle: 'Las 24 hs' },
      { etiqueta: 'Urgencias odontológicas resto del país', valor: '(011) 4127-0500 (rotativas)' },
      { etiqueta: 'WhatsApp', valor: '11 3854-5300' },
    ],
    // Gancho de conversión (1-oct-2026): acá "cartilla" es la búsqueda
    // dominante (1.600/mes, Google Ads Keyword Planner) — la gente busca
    // saber qué prestadores tiene, no turnos ni teléfono.
    ganchoConversion: '¿Buscás una cartilla más amplia que la de OSUTHGRA? Derivá tus aportes a una prepaga y accedé a más sanatorios y especialistas.',
    faq: [
      { q: '¿Cuál es el teléfono de OSUTHGRA?', a: 'COA (urgencias médicas): 0800-222-8855, también (011) 4959-8200 (CABA Norte) y (011) 4522-6584. Urgencias odontológicas para afiliados de CABA: Triunvirato 4096 1°, las 24 hs. Resto del país: (011) 4127-0500 (rotativas).' },
      { q: '¿OSUTHGRA cubre todo el país?', a: 'Su portal y los servicios digitales (videoconsulta, turnos online) están dirigidos a afiliados de CABA y GBA. Si trabajás gastronomía u hotelería en el interior, confirmá con tu delegación local qué cartilla y trámites te corresponden.' },
      { q: '¿Puedo pasar de OSUTHGRA a una prepaga?', a: 'Sí: si trabajás en relación de dependencia podés derivar tus aportes a una prepaga, una vez por año. Te cotizamos gratis.' },
    ],
    keywords: ['osuthgra', 'osuthgra telefono', 'osuthgra turnos', 'obra social gastronomicos', 'obra social hoteleros'],
  },
  {
    // Nueva (1-oct-2026): quinto sindical del silo. Nombre oficial completo
    // OSPECON (Obra Social del Personal de la Construcción), conocida
    // públicamente como "Construir Salud" — ambos nombres se usan en su
    // propio sitio oficial. Acá "teléfono" y "turnos" están parejos (590 y
    // 480/mes, Google Ads Keyword Planner), "cartilla" bastante más abajo (140).
    slug: 'construir-salud',
    nombre: 'Construir Salud',
    emoji: '🦺',
    tipo: 'sindical',
    titulo: 'Construir Salud (UOCRA): teléfonos, turnos y afiliación (2026)',
    metaDescripcion: 'Construir Salud (OSPECON), la obra social del personal de la construcción: urgencias 0800-345-7700, atención al beneficiario 0800-222-0123, cartilla por zona y cómo derivar tus aportes.',
    descripcion: 'La obra social del personal de la construcción (UOCRA), con centros médicos propios en todo el país.',
    intro: 'Construir Salud es el nombre público de OSPECON, la Obra Social del Personal de la Construcción (UOCRA). Tiene centros médicos propios (CEMAP) tanto en AMBA como en el interior del país, con guías de atención separadas para cada zona.',
    quienesPuedenAfiliarse: [
      'Trabajadores de la construcción en relación de dependencia',
      'Grupo familiar a cargo del titular',
    ],
    aportes: {
      trabajador: '3% del salario bruto (Ley 23.660)',
      empleador: '6% del salario bruto (Ley 23.660)',
    },
    cobertura: [
      'PMO',
      'Centros médicos propios (CEMAP) en AMBA y en el interior',
      'Farmacias y ópticas con convenio',
      'Cobertura de discapacidad, salud mental y violencia de género',
    ],
    diferenciadores: [
      'Centros médicos propios con guías de atención separadas por zona (AMBA / interior)',
      'Portal de gestión propio para trámites online',
    ],
    pros: [
      'Más de 50 centros médicos propios (CEMAP) en el país, según su cartilla oficial',
      'Atención a urgencias las 24 horas',
    ],
    contras: [
      'La cartilla completa por zona está en un PDF separado, no es un buscador online interactivo',
    ],
    derivacion: true,
    web: 'construirsalud.com.ar',
    fuenteOficial: 'https://construirsalud.com.ar/',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'Urgencias', valor: '0800-345-7700', detalle: 'Las 24 hs' },
      { etiqueta: 'Atención al beneficiario', valor: '0800-222-0123' },
    ],
    // Gancho de conversión (1-oct-2026): "teléfono" (590) y "turnos" (480)
    // van parejos, bastante por encima de "cartilla" (140) — mezcla de los
    // dos dolores, a diferencia de OSECAC/UP donde turnos domina solo.
    ganchoConversion: '¿Tardás en conseguir turno o te cuesta comunicarte con Construir Salud? Derivá tus aportes a una prepaga y mejorá tu cobertura.',
    faq: [
      { q: '¿Cuál es el teléfono de Construir Salud?', a: 'Urgencias: 0800-345-7700, las 24 horas. Atención al beneficiario: 0800-222-0123.' },
      { q: '¿Construir Salud es lo mismo que OSPECON?', a: 'Sí: OSPECON (Obra Social del Personal de la Construcción) es el nombre legal; "Construir Salud" es el nombre con el que se presenta públicamente.' },
      { q: '¿Dónde veo la cartilla de Construir Salud?', a: 'Publican una cartilla oficial en PDF con los Centros Médicos de Atención Primaria (CEMAP) por zona, separada en AMBA e interior del país, disponible en construirsalud.com.ar.' },
      { q: '¿Puedo pasar de Construir Salud a una prepaga?', a: 'Sí: si trabajás en relación de dependencia podés derivar tus aportes a una prepaga, una vez por año. Te cotizamos gratis.' },
    ],
    keywords: ['construir salud', 'construir salud telefono', 'construir salud turnos', 'ospecon', 'obra social construccion', 'uocra obra social'],
  },
  {
    // Nueva (1-oct-2026): sexto sindical del silo (2.900 búsquedas/mes,
    // Google Ads Keyword Planner). OJO: OSCHOCA cubre solo CABA y provincia
    // de Buenos Aires (confirmado: el sindicato de camioneros tiene
    // seccionales regionales separadas, esta es la de Buenos Aires,
    // camioneros-ba.org.ar) — no es cobertura nacional.
    slug: 'oschoca',
    nombre: 'OSCHOCA',
    emoji: '🚛',
    tipo: 'sindical',
    titulo: 'OSCHOCA (Camioneros): teléfonos y afiliación (2026)',
    metaDescripcion: 'OSCHOCA, la obra social de choferes de camiones de Buenos Aires: teléfonos de auditoría médica y reclamos, cómo afiliarte y si te conviene derivar a una prepaga.',
    descripcion: 'La obra social de choferes de camiones de la Ciudad y la Provincia de Buenos Aires, desde 1945.',
    intro: 'OSCHOCA (Obra Social de Choferes de Camiones) es la obra social del sindicato de camioneros, con sede en CABA y cobertura para choferes de camión y trabajadores del transporte de cargas, logística y distribución en Buenos Aires. Existe desde 1945, financiada principalmente por el aporte de los trabajadores.',
    quienesPuedenAfiliarse: [
      'Choferes de camiones en relación de dependencia',
      'Trabajadores de transporte de cargas, logística y distribución alcanzados por el convenio',
      'Grupo familiar a cargo del titular',
    ],
    aportes: {
      trabajador: '3% del salario bruto (Ley 23.660)',
      empleador: '6% del salario bruto (Ley 23.660)',
    },
    cobertura: [
      'PMO',
      'Auditoría médica propia',
      'Ambulancias',
      'Cobertura de discapacidad',
      'Beneficios adicionales del sindicato: becas, turismo, sepelios',
    ],
    diferenciadores: [
      'Vinculada directamente al Sindicato de Camioneros, con beneficios adicionales (turismo, Club de Camioneros, mutual)',
    ],
    pros: [
      'Auditoría médica y gestión de reclamos con línea propia',
      'Beneficios extra del sindicato (becas universitarias, turismo, sepelios)',
    ],
    contras: [
      'Cobertura regional: solo CABA y provincia de Buenos Aires, no nacional',
    ],
    derivacion: true,
    web: 'camioneros-ba.org.ar',
    fuenteOficial: 'https://camioneros-ba.org.ar/index.php/contactenos/telefonos-utiles',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'Auditoría médica', valor: '4378-1012' },
      { etiqueta: 'Reclamo pago de hospital', valor: '4378-1000', detalle: 'internos 1315 / 1415' },
      { etiqueta: 'Accidentes de trabajo y enf. profesionales', valor: '4378-1083 / 4378-1082' },
      { etiqueta: 'Trámites y seguro de sepelio', valor: '4378-1025 / 0800-1220222' },
    ],
    ganchoConversion: '¿Necesitás una cartilla con cobertura fuera de Buenos Aires? Derivá tus aportes de OSCHOCA a una prepaga con alcance nacional.',
    faq: [
      { q: '¿Qué zona cubre OSCHOCA?', a: 'CABA y la provincia de Buenos Aires. Si trabajás en transporte de cargas en otra provincia, consultá con tu seccional regional del sindicato de camioneros, que puede tener una obra social o convenio distinto.' },
      { q: '¿Cuál es el teléfono de OSCHOCA?', a: 'Auditoría médica: 4378-1012. Reclamo de pago de hospital: 4378-1000 (internos 1315/1415). Accidentes de trabajo: 4378-1083 / 4378-1082.' },
      { q: '¿Puedo pasar de OSCHOCA a una prepaga?', a: 'Sí: si trabajás en relación de dependencia podés derivar tus aportes a una prepaga, una vez por año. Te cotizamos gratis.' },
    ],
    keywords: ['oschoca', 'oschoca telefono', 'oschoca obra social', 'obra social camioneros', 'obra social choferes de camiones'],
  },
  {
    // Nueva (1-oct-2026): obra social bancaria. Pedido puntual de Darío,
    // corregido 1-oct: no es "OSBA firmó un convenio", es el mismo convenio
    // CORPORATIVO DE AFINIDAD que ya describimos en /empresas/swiss-medical
    // ("5 bancos con convenio de afinidad") — Swiss Medical lo cierra con el
    // BANCO empleador, no con la obra social sindical. Se describe con esa
    // misma terminología para no inventar un mecanismo distinto al que ya
    // tenemos documentado. OSBA pasó a llamarse formalmente OSSSB (Obra
    // Social Servicios Sociales Bancarios); teléfonos verificados en
    // osssb.com.
    slug: 'osba-bancarios',
    nombre: 'OSBA (Bancarios)',
    emoji: '🏦',
    tipo: 'sindical',
    titulo: 'OSBA (Bancarios): teléfonos, afiliación y convenio con Swiss Medical',
    metaDescripcion: 'OSBA (hoy OSSSB), la obra social de los trabajadores bancarios. Varios bancos tienen además un convenio corporativo de afinidad con Swiss Medical. Teléfonos, cartilla y cómo cotizarlo.',
    descripcion: 'La obra social de los trabajadores bancarios, hoy llamada formalmente OSSSB (Obra Social Servicios Sociales Bancarios).',
    intro: 'OSBA, conocida formalmente como OSSSB (Obra Social Servicios Sociales Bancarios), es la obra social de los trabajadores del sector bancario. Además, Swiss Medical tiene convenios corporativos de afinidad con varios bancos del país: no es un acuerdo con la obra social sindical, sino con el banco como empleador, y le da a su personal acceso al precio corporativo por volumen, con la factura llegando directo a cada empleado.',
    quienesPuedenAfiliarse: [
      'Trabajadores del sector bancario en relación de dependencia',
      'Grupo familiar a cargo del titular',
    ],
    aportes: {
      trabajador: '3% del salario bruto (Ley 23.660)',
      empleador: '6% del salario bruto (Ley 23.660)',
    },
    cobertura: [
      'PMO',
      'Cartilla propia con farmacias y ópticas',
      'Urgencias psiquiátricas, oftalmológicas y odontológicas con prestadores de convenio',
    ],
    diferenciadores: [
      'Varios bancos tienen convenio corporativo de afinidad con Swiss Medical para su personal',
    ],
    pros: [
      'Si tu banco tiene convenio de afinidad con Swiss Medical, accedés al precio corporativo sin que la empresa gestione nada: la factura llega directo a vos',
      'Call center y canales de comunicación las 24 horas para urgencias',
    ],
    contras: [
      'El convenio de afinidad depende de que tu banco en particular lo tenga firmado — no es automático para todo el sector',
    ],
    derivacion: true,
    web: 'osssb.com',
    fuenteOficial: 'https://www.osssb.com/',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'Call Center', valor: '0800-222-3462', detalle: 'Lunes a viernes de 9 a 16:30 hs' },
      { etiqueta: 'Atención 24 hs', valor: '11-2761-0695' },
      { etiqueta: 'Urgencias psiquiátricas (APPSI)', valor: '11-2257-2258' },
      { etiqueta: 'Urgencias oftalmológicas (CITO)', valor: '4123-9300' },
      { etiqueta: 'Urgencias odontológicas (SIACO CABA)', valor: '5253-3400', detalle: 'Las 24 hs' },
    ],
    // Gancho de conversión distinto al resto: acá el angulo real no es
    // "derivá tus aportes", es "tu banco puede tener acceso corporativo a
    // Swiss Medical — cotizalo". Aprovecha la ficha /empresas/swiss-medical
    // que ya tenemos armada con el detalle del convenio de afinidad.
    ganchoConversion: 'Si trabajás en un banco, puede que tengas acceso al convenio corporativo de Swiss Medical — cotizá tu plan y comparalo con lo que tenés hoy.',
    faq: [
      { q: '¿OSBA y OSSSB son la misma obra social?', a: 'Sí: OSBA (Obra Social Bancaria Argentina) pasó a llamarse formalmente OSSSB (Obra Social Servicios Sociales Bancarios), pero mucha gente la sigue buscando como OSBA.' },
      { q: '¿Es cierto que los bancarios tienen un convenio con Swiss Medical?', a: 'Sí, pero es un convenio corporativo de afinidad que Swiss Medical cierra con el banco como empleador (tiene acuerdos con varios bancos del país), no un beneficio de la obra social sindical OSBA/OSSSB en sí. Si tu banco lo tiene firmado, accedés al precio corporativo con la factura a tu nombre.' },
      { q: '¿Cuál es el teléfono de OSBA?', a: 'Call Center: 0800-222-3462 (lunes a viernes de 9 a 16:30). Atención las 24 horas: 11-2761-0695.' },
      { q: '¿Cómo sé si mi banco tiene el convenio de afinidad con Swiss Medical?', a: 'Consultá en RRHH de tu banco, o cotizá directo con nosotros: te confirmamos si tu empleador tiene el convenio activo y qué precio corporativo te corresponde.' },
    ],
    keywords: ['osba', 'osba obra social', 'obra social bancaria', 'osssb', 'bancarios obra social', 'swiss medical bancarios', 'convenio bancarios swiss medical'],
  },
  {
    // Nueva (1-oct-2026): obra social de Luz y Fuerza. Nombre oficial OSFATLyF
    // (Obra Social de la Federación Argentina de Trabajadores de Luz y
    // Fuerza). No se encontró un teléfono público claro en su sitio oficial
    // (osfatlyf.org) — se linkea el sitio en vez de inventar un número.
    slug: 'luz-y-fuerza',
    nombre: 'OSFATLyF (Luz y Fuerza)',
    emoji: '⚡',
    tipo: 'sindical',
    titulo: 'OSFATLyF (Luz y Fuerza): cobertura y afiliación (2026)',
    metaDescripcion: 'OSFATLyF, la obra social de la Federación Argentina de Trabajadores de Luz y Fuerza: qué cubre, cómo afiliarte y si te conviene derivar tus aportes a una prepaga.',
    descripcion: 'La obra social de la Federación Argentina de Trabajadores de Luz y Fuerza.',
    intro: 'OSFATLyF (Obra Social de la Federación Argentina de Trabajadores de Luz y Fuerza) es la obra social de los trabajadores del sector eléctrico nucleados en Luz y Fuerza. Tiene app móvil propia para gestionar la credencial y trámites.',
    quienesPuedenAfiliarse: [
      'Trabajadores del sector eléctrico en relación de dependencia, nucleados en Luz y Fuerza',
      'Grupo familiar a cargo del titular',
    ],
    aportes: {
      trabajador: '3% del salario bruto (Ley 23.660)',
      empleador: '6% del salario bruto (Ley 23.660)',
    },
    cobertura: [
      'PMO',
      'App móvil propia para credencial y trámites',
      'Cobertura de discapacidad, salud mental y violencia de género',
    ],
    diferenciadores: [
      'App móvil propia para gestión de credencial y trámites',
    ],
    pros: [
      'Gestión digital de la credencial por app',
    ],
    contras: [
      'No publica un teléfono de atención claro en su sitio oficial: la vía de contacto es el formulario web',
    ],
    derivacion: true,
    web: 'osfatlyf.org',
    fuenteOficial: 'https://osfatlyf.org/',
    verificado: '2026-10-01',
    faq: [
      { q: '¿Cuál es el sitio oficial de OSFATLyF?', a: 'osfatlyf.org. No publica un teléfono de atención al público de forma clara; el contacto se hace por el formulario web de la sección "Contacto".' },
      { q: '¿Puedo pasar de OSFATLyF a una prepaga?', a: 'Sí: si trabajás en relación de dependencia podés derivar tus aportes a una prepaga, una vez por año. Te cotizamos gratis.' },
    ],
    keywords: ['osfatlyf', 'luz y fuerza obra social', 'obra social luz y fuerza'],
  },
  {
    // Nueva (1-oct-2026): mismo slug 'osctc' que ya existía en FICHAS_REGISTRO
    // (ficha genérica armada solo con el registro de la SSSalud) — esta
    // entrada la reemplaza porque obrasSociales tiene prioridad en
    // app/obras-sociales/[slug]/page.tsx. "uta obra social" tiene volumen real
    // (4.400/mes, Google Ads Keyword Planner) y "cartilla" es el sub-intent
    // dominante (320/mes vs 140/mes de "telefono") — verificado 1-oct-2026
    // contra obrasocialuta.com.ar, el sitio oficial de la obra social (no el
    // de UTA el sindicato, que es uta.org.ar).
    slug: 'osctc',
    nombre: 'OSCTCP (UTA)',
    emoji: '🚌',
    tipo: 'sindical',
    titulo: 'OSCTCP (UTA, colectiveros): teléfonos y cobertura (2026)',
    metaDescripcion: 'OSCTCP, la obra social de los conductores de transporte colectivo de pasajeros (UTA): urgencias 4959-9530, consultas 11 4011-5123/5124. Cartilla, cobertura y cómo derivar tus aportes.',
    descripcion: 'La obra social de los conductores de transporte colectivo de pasajeros, afiliados a UTA.',
    intro: 'OSCTCP (Obra Social Conductores de Transporte Colectivo de Pasajeros) es la obra social de los choferes de colectivos nucleados en UTA (Unión Tranviarios Automotor). Tiene atención domiciliaria en CABA y GBA, delegaciones propias y atención telefónica para el interior del país.',
    quienesPuedenAfiliarse: [
      'Conductores de transporte colectivo de pasajeros en relación de dependencia, afiliados a UTA',
      'Grupo familiar a cargo del titular',
    ],
    aportes: {
      trabajador: '3% del salario bruto (Ley 23.660)',
      empleador: '6% del salario bruto (Ley 23.660)',
    },
    cobertura: [
      'PMO',
      'Atención médica domiciliaria en CABA y GBA',
      'Delegaciones propias en el interior del país',
      'Vademécum propio',
    ],
    diferenciadores: [
      'Urgencias y emergencias médicas domiciliarias las 24 horas en CABA y GBA',
    ],
    pros: [
      'Línea de urgencias y emergencias las 24 horas, los 365 días',
      'Delegaciones en todo el país para el interior',
    ],
    contras: [
      'La atención domiciliaria de urgencias es solo para CABA y GBA',
    ],
    derivacion: true,
    web: 'obrasocialuta.com.ar',
    fuenteOficial: 'https://obrasocialuta.com.ar/',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'Urgencias y emergencias (CABA y GBA)', valor: '4959-9530', detalle: 'Atención las 24 hs, los 365 días' },
      { etiqueta: 'Consultas e informes (Capital y GBA)', valor: '11 4011-5123 / 5124', detalle: 'De 10 a 17 hs' },
      { etiqueta: 'Consultas e informes (interior del país)', valor: '0810 122 8080', detalle: 'De 10 a 17 hs' },
    ],
    // Gancho de conversión (1-oct-2026): "cartilla" es el sub-intent real más
    // grande ("obra social uta cartilla" 320/mes vs "telefono" 140/mes) y la
    // propia obra social acota la atención domiciliaria de urgencias a
    // CABA/GBA — el dolor real para quien maneja en el interior.
    ganchoConversion: '¿Manejás en el interior y la cartilla de OSCTCP no te alcanza? Derivá tus aportes a una prepaga con cobertura en todo el país.',
    faq: [
      { q: '¿Cuál es el teléfono de OSCTCP?', a: 'Urgencias y emergencias (CABA y GBA): 4959-9530, las 24 horas. Consultas e informes: 11 4011-5123/5124 en Capital y GBA, 0810 122 8080 en el interior.' },
      { q: '¿OSCTCP es lo mismo que UTA?', a: 'No: UTA (Unión Tranviarios Automotor) es el sindicato; OSCTCP (Obra Social Conductores de Transporte Colectivo de Pasajeros) es su obra social.' },
      { q: '¿Puedo pasar de OSCTCP a una prepaga?', a: 'Sí: si trabajás en relación de dependencia podés derivar tus aportes a una prepaga, una vez por año. Te cotizamos gratis.' },
    ],
    keywords: ['osctcp', 'osctc', 'uta obra social', 'obra social uta', 'obra social colectiveros', 'osctcp telefono', 'osctcp cartilla'],
  },
  {
    // Nueva (1-oct-2026): mismo slug 'osperyh' que ya existía en
    // FICHAS_REGISTRO (ficha genérica) — esta entrada la reemplaza. "osperyh"
    // tiene volumen real (2.900/mes) con "cartilla" y "telefono" empatados
    // como sub-intent (90/mes cada uno) — verificado 1-oct-2026 contra
    // osperyh.org.ar, el sitio oficial (gestionado por SUTERH, el sindicato).
    slug: 'osperyh',
    nombre: 'OSPERYH (Encargados de Edificios)',
    emoji: '🏢',
    tipo: 'sindical',
    titulo: 'OSPERYH (Encargados de Edificio): teléfonos y afiliación (2026)',
    metaDescripcion: 'OSPERYH, la obra social del personal de edificios de renta y horizontal de CABA y GBA (SUTERH): urgencias 0800-266-6662, delegaciones 0810 222 7883. Cartilla y cómo derivar tus aportes.',
    descripcion: 'La obra social del personal de edificios de renta y propiedad horizontal de CABA y el Gran Buenos Aires.',
    intro: 'OSPERYH (Obra Social del Personal de Edificios de Renta y Horizontal) es la obra social de los encargados y porteros de edificios de CABA y el Gran Buenos Aires, gestionada por el sindicato SUTERH. Tiene delegaciones propias con especialidades médicas y un servicio de urgencias y emergencias domiciliario.',
    quienesPuedenAfiliarse: [
      'Encargados y personal de edificios de renta y propiedad horizontal de CABA y GBA, en relación de dependencia',
      'Grupo familiar a cargo del titular',
    ],
    aportes: {
      trabajador: '3% del salario bruto (Ley 23.660)',
      empleador: '6% del salario bruto (Ley 23.660)',
    },
    cobertura: [
      'PMO',
      'Delegaciones propias con especialidades (cardiología, ginecología, traumatología y más)',
      'Urgencias y emergencias médicas domiciliarias, hasta 60 km de CABA',
      'Clínica propia (Clínica Ciudad SUTERH-OSPERYH)',
    ],
    diferenciadores: [
      'Delegaciones propias en CABA y GBA con especialidades médicas y guardia',
    ],
    pros: [
      'Urgencias y emergencias domiciliarias gratuitas, con clínica propia de guardia',
      'Varias delegaciones con especialidades en CABA y GBA',
    ],
    contras: [
      'Solo cubre CABA y GBA: no tiene la misma red fuera de esa zona',
    ],
    derivacion: true,
    web: 'osperyh.org.ar',
    fuenteOficial: 'https://osperyh.org.ar/',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'Urgencias y emergencias (S.U.E.)', valor: '0800-266-6662', detalle: 'Atención domiciliaria, hasta 60 km de CABA' },
      { etiqueta: 'Delegaciones (conmutador)', valor: '0810 222 7883', detalle: 'Marcar el interno de tu delegación' },
    ],
    // Gancho de conversión (1-oct-2026): "cartilla" y "telefono" empatan como
    // sub-intent (90/mes cada uno) — la obra social solo cubre CABA/GBA, el
    // dolor real para quien vive o se muda fuera de esa zona.
    ganchoConversion: '¿Vivís fuera de CABA o GBA y la cartilla de OSPERYH no te cubre? Derivá tus aportes a una prepaga con cobertura en todo el país.',
    faq: [
      { q: '¿Cuál es el teléfono de OSPERYH?', a: 'Urgencias y emergencias (S.U.E.): 0800-266-6662. Delegaciones: 0810 222 7883 (marcando el interno de cada una).' },
      { q: '¿OSPERYH y SUTERH son lo mismo?', a: 'No: SUTERH (Sindicato Único de Trabajadores de Edificios de Renta y Horizontal) es el sindicato; OSPERYH es su obra social.' },
      { q: '¿Puedo pasar de OSPERYH a una prepaga?', a: 'Sí: si trabajás en relación de dependencia podés derivar tus aportes a una prepaga, una vez por año. Te cotizamos gratis.' },
    ],
    keywords: ['osperyh', 'osperyh telefono', 'obra social encargados de edificio', 'obra social porteros', 'suterh obra social'],
  },
  {
    // Nueva (1-oct-2026): mismo slug 'ospedyc' que ya existía en
    // FICHAS_REGISTRO — esta entrada la reemplaza. Hallazgo grande del día:
    // "ospedyc" tiene 12.100/mes (Google Ads Keyword Planner), más que
    // cualquier otra sindical agregada hoy salvo OSECAC y Unión Personal.
    // "cartilla" es el sub-intent dominante (880/mes, empatado con OSDOP).
    // Verificado 1-oct-2026 contra ospedyc.org.ar (redirige a ospedyc.org),
    // el sitio oficial.
    slug: 'ospedyc',
    nombre: 'OSPEDYC (UTEDyC)',
    emoji: '🏋️',
    tipo: 'sindical',
    titulo: 'OSPEDYC (UTEDyC): teléfonos y centros médicos (2026)',
    metaDescripcion: 'OSPEDYC, la obra social del personal de entidades deportivas y civiles (UTEDyC): urgencias y call center 0800-345-6773. Centros médicos propios, cartilla y cómo derivar tus aportes.',
    descripcion: 'La obra social del personal de entidades deportivas y civiles, afiliados a UTEDyC.',
    intro: 'OSPEDYC (Obra Social del Personal de Entidades Deportivas y Civiles) es la obra social de los trabajadores de clubes, gimnasios y entidades civiles y deportivas, nucleados en UTEDyC. Tiene centros médicos propios en varias provincias, teleconsultas y un asistente virtual (OSPY) por WhatsApp y web.',
    quienesPuedenAfiliarse: [
      'Personal de entidades deportivas y civiles (clubes, gimnasios, asociaciones) en relación de dependencia, afiliados a UTEDyC',
      'Grupo familiar a cargo del titular',
    ],
    aportes: {
      trabajador: '3% del salario bruto (Ley 23.660)',
      empleador: '6% del salario bruto (Ley 23.660)',
    },
    cobertura: [
      'PMO',
      'Centros médicos propios en CABA, GBA, Mar del Plata, Córdoba y Santa Fe',
      'Teleconsultas y asistente virtual OSPY (WhatsApp y web)',
      'Plataforma Mi OSPEDYC para bonos, recetas y constancias',
    ],
    diferenciadores: [
      'Centros médicos propios en varias provincias, con cobertura nacional',
    ],
    pros: [
      'Call center y urgencias las 24 horas',
      'Centros médicos propios, no solo cartilla de terceros',
    ],
    contras: [
      'Los centros médicos propios se concentran en algunas provincias: en el resto se depende de la cartilla de prestadores',
    ],
    derivacion: true,
    web: 'ospedyc.org.ar',
    fuenteOficial: 'https://www.ospedyc.org.ar/',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'Urgencias y emergencias / Call Center', valor: '0800-345-6773', detalle: 'Lunes a viernes de 8 a 20 hs' },
    ],
    // Gancho de conversión (1-oct-2026): "cartilla" es el sub-intent real más
    // grande (880/mes, igual que OSDOP) — el dolor es que los centros propios
    // no están en todas las provincias.
    ganchoConversion: '¿No tenés un centro médico de OSPEDYC cerca? Derivá tus aportes a una prepaga con cartilla en tu zona.',
    faq: [
      { q: '¿Cuál es el teléfono de OSPEDYC?', a: 'Call Center y urgencias: 0800-345-6773, de lunes a viernes de 8 a 20 hs. También podés escribirle al asistente virtual OSPY por WhatsApp o desde la web.' },
      { q: '¿OSPEDYC y UTEDyC son lo mismo?', a: 'No: UTEDyC (Unión de Trabajadores de Entidades Deportivas y Civiles) es el sindicato; OSPEDYC es su obra social.' },
      { q: '¿Puedo pasar de OSPEDYC a una prepaga?', a: 'Sí: si trabajás en relación de dependencia podés derivar tus aportes a una prepaga, una vez por año. Te cotizamos gratis.' },
    ],
    keywords: ['ospedyc', 'ospedyc telefono', 'ospedyc cartilla', 'obra social utedyc', 'utedyc obra social'],
  },
  {
    // Nueva (1-oct-2026): mismo slug 'osdop' que ya existía en
    // FICHAS_REGISTRO — esta entrada la reemplaza. "osdop"/"obra social
    // docentes particulares" tiene 9.900/mes cada uno (Google Ads Keyword
    // Planner); "cartilla" es el sub-intent dominante (880/mes). Verificado
    // 1-oct-2026 contra osdop.org.ar, el sitio oficial.
    slug: 'osdop',
    nombre: 'OSDOP (Docentes Particulares)',
    emoji: '📚',
    tipo: 'sindical',
    titulo: 'OSDOP (Docentes Particulares): teléfonos y afiliación (2026)',
    metaDescripcion: 'OSDOP, la obra social de los docentes de escuelas privadas: atención 0810-345-2527 y 0800-666-6450. Cartilla, coseguros y cómo derivar tus aportes a una prepaga.',
    descripcion: 'La obra social de los docentes que trabajan en establecimientos de enseñanza privada.',
    intro: 'OSDOP (Obra Social de Docentes Particulares) es la obra social de los docentes de establecimientos de enseñanza privada, vinculada al sindicato SADOP. También pueden elegirla por opción de cambio trabajadores de otras actividades.',
    quienesPuedenAfiliarse: [
      'Docentes de establecimientos de enseñanza privada en relación de dependencia',
      'Otros trabajadores en relación de dependencia, por opción de cambio',
      'Grupo familiar a cargo del titular',
    ],
    aportes: {
      trabajador: '3% del salario bruto (Ley 23.660)',
      empleador: '6% del salario bruto (Ley 23.660)',
    },
    cobertura: [
      'PMO',
      'Cartilla propia por región',
      'Credencial y trámites digitales (Osdop Digital)',
      'Cobertura de discapacidad y salud mental',
    ],
    diferenciadores: [
      'Abierta a trabajadores de otras actividades por opción de cambio, no solo docentes',
    ],
    pros: [
      'Atención telefónica y trámites online (Osdop Digital)',
      'Cartilla organizada por región del país',
    ],
    contras: [
      'Cobra coseguros en varias prestaciones (valores vigentes publicados en su web)',
    ],
    derivacion: true,
    web: 'osdop.org.ar',
    fuenteOficial: 'https://www.osdop.org.ar/',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'Consultas, trámites y reclamos', valor: '0810-345-2527', detalle: 'Lunes a viernes de 9 a 17 hs' },
      { etiqueta: 'Consultas, trámites y reclamos', valor: '0800-666-6450', detalle: 'Lunes a viernes de 9 a 17 hs' },
    ],
    // Gancho de conversión (1-oct-2026): "cartilla" es el sub-intent real más
    // grande (880/mes, igual que OSPEDYC).
    ganchoConversion: '¿La cartilla de OSDOP no te alcanza en tu zona? Derivá tus aportes a una prepaga con más sanatorios cerca tuyo.',
    faq: [
      { q: '¿Cuál es el teléfono de OSDOP?', a: '0810-345-2527 y 0800-666-6450, de lunes a viernes de 9 a 17 hs.' },
      { q: '¿Si no soy docente puedo elegir OSDOP?', a: 'Sí: aunque nació para docentes de escuelas privadas, cualquier trabajador en relación de dependencia puede elegirla por la opción de cambio.' },
      { q: '¿Puedo pasar de OSDOP a una prepaga?', a: 'Sí: si trabajás en relación de dependencia podés derivar tus aportes a una prepaga, una vez por año. Te cotizamos gratis.' },
    ],
    keywords: ['osdop', 'obra social docentes particulares', 'osdop telefono', 'obra social sadop'],
  },
  {
    // Nueva (1-oct-2026): mismo slug 'ospacp' que ya existía en
    // FICHAS_REGISTRO — esta entrada la reemplaza. "ospacp" tiene 6.600/mes
    // (Google Ads Keyword Planner) y "telefono" es el sub-intent dominante
    // (320/mes). Verificado 1-oct-2026 contra ospacp.org.ar, el sitio oficial.
    slug: 'ospacp',
    nombre: 'OSPACP (Casas Particulares)',
    emoji: '🏠',
    tipo: 'sindical',
    titulo: 'OSPACP (Casas Particulares): teléfonos y afiliación (2026)',
    metaDescripcion: 'OSPACP, la obra social del personal de casas particulares (empleadas/os domésticos): línea 0800-222-72583. Cartilla, consultorios propios y requisitos para afiliarte.',
    descripcion: 'La obra social del personal auxiliar de casas particulares (empleadas y empleados domésticos).',
    intro: 'OSPACP (Obra Social del Personal Auxiliar de Casas Particulares) es la obra social de los trabajadores de casas particulares, vinculada al sindicato UPACP. Da cobertura desde 1975 y tiene consultorios propios, cartilla médica y delegaciones en el país.',
    quienesPuedenAfiliarse: [
      'Personal de casas particulares (empleadas/os domésticos) registrado, que trabaje 16 horas semanales o más para uno o varios empleadores',
      'Grupo familiar a cargo del titular',
    ],
    cobertura: [
      'PMO',
      'Consultorios propios',
      'Cartilla médica',
      'Vademécum farmacéutico propio',
      'Delegaciones en el país',
    ],
    diferenciadores: [
      'Consultorios propios, además de la cartilla de prestadores',
    ],
    pros: [
      'Línea de atención las 24 horas, los 365 días',
      'Consultorios propios para no depender solo de terceros',
    ],
    contras: [
      'El acceso depende de llegar a las 16 horas semanales registradas: por debajo de eso no da cobertura',
    ],
    derivacion: true,
    web: 'ospacp.org.ar',
    fuenteOficial: 'https://ospacp.org.ar/',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'Salud (consultas y urgencias)', valor: '0800-222-72583', detalle: 'Las 24 horas, los 365 días' },
    ],
    // Gancho de conversión (1-oct-2026): "telefono" es el sub-intent real más
    // grande acá (320/mes vs 140/mes de "cartilla") — a diferencia del resto
    // del silo. El aporte de casas particulares es un monto fijo chico por
    // las horas trabajadas (no un % del sueldo), muy por debajo de lo que
    // cuesta una prepaga: el gancho apunta al empleador, no al trabajador.
    ganchoConversion: 'Si sos empleador y querés que tu empleada/o tenga una cobertura mejor que la de OSPACP, cotizale un plan de prepaga.',
    faq: [
      { q: '¿Cuál es el teléfono de OSPACP?', a: '0800-222-72583 (SALUD), las 24 horas los 365 días.' },
      { q: '¿Desde cuántas horas trabajadas da cobertura OSPACP?', a: 'Desde las 16 horas semanales registradas, sumando uno o varios empleadores.' },
      { q: '¿Se puede cambiar de OSPACP a otra obra social o prepaga?', a: 'Sí: el personal de casas particulares puede hacer la opción de cambio una vez por año, con clave fiscal nivel 3 y el servicio "Mi SSSalud" de la Superintendencia de Servicios de Salud. Igual, el aporte de casas particulares es un monto fijo chico por las horas trabajadas, así que conviene comparar bien contra el costo de una prepaga.' },
    ],
    keywords: ['ospacp', 'ospacp telefono', 'obra social empleada domestica', 'obra social casas particulares', 'obra social personal domestico'],
  },
  {
    // Nueva (1-oct-2026): mismo slug 'osmedica' que ya existía en
    // FICHAS_REGISTRO — esta entrada la reemplaza. Otro hallazgo grande:
    // "osmedica cartilla" sola tiene 5.400/mes (Google Ads Keyword Planner),
    // más que la base "osmedica" de muchas otras sindicales juntas.
    // Verificado 1-oct-2026 contra osmedica.com.ar, el sitio oficial.
    slug: 'osmedica',
    nombre: 'OSMEDICA (Médicos de CABA)',
    emoji: '🩺',
    tipo: 'sindical',
    titulo: 'OSMEDICA, la obra social de los médicos: teléfonos y turnos (2026)',
    metaDescripcion: 'OSMEDICA, la obra social de los médicos de la Ciudad de Buenos Aires: centro de atención 0800-999-5396, urgencias 0810 345 0762. Cartilla, sedes y cómo derivar tus aportes.',
    descripcion: 'La obra social de los médicos de la Ciudad de Buenos Aires.',
    intro: 'OSMEDICA (Obra Social de los Médicos de la Ciudad de Buenos Aires) es la obra social de los profesionales médicos porteños. Tiene centros médicos propios y varias sedes administrativas en CABA y GBA.',
    quienesPuedenAfiliarse: [
      'Médicos de la Ciudad de Buenos Aires en relación de dependencia',
      'Otros trabajadores en relación de dependencia, por opción de cambio',
      'Grupo familiar a cargo del titular',
    ],
    aportes: {
      trabajador: '3% del salario bruto (Ley 23.660)',
      empleador: '6% del salario bruto (Ley 23.660)',
    },
    cobertura: [
      'PMO',
      'Centros médicos propios',
      'Emergencias médicas y médico a domicilio en CABA y GBA',
      'Emergencias psiquiátricas las 24 horas en CABA y AMBA',
    ],
    diferenciadores: [
      'Varias sedes propias en CABA y GBA (Metropolitana, Temperley, San Miguel, San Fernando, Lanús Este)',
    ],
    pros: [
      'Centro de atención telefónica permanente para emergencias',
      'Varias sedes propias, no solo cartilla de terceros',
    ],
    contras: [
      'Las sedes propias se concentran en CABA y GBA',
    ],
    derivacion: true,
    web: 'osmedica.com.ar',
    fuenteOficial: 'https://osmedica.com.ar/',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'Centro de atención (Sede Central)', valor: '0800-999-5396' },
      { etiqueta: 'Emergencias médicas (CABA y GBA)', valor: '0810 345 0762', detalle: 'Gratuito, las 24 hs' },
      { etiqueta: 'Emergencias psiquiátricas (CABA y AMBA)', valor: '11 4192-9150', detalle: 'Las 24 hs, los 365 días' },
    ],
    // Gancho de conversión (1-oct-2026): "cartilla" es, por lejos, el
    // sub-intent dominante (5.400/mes vs 390/mes de "telefono").
    ganchoConversion: '¿La cartilla de OSMEDICA no te alcanza? Derivá tus aportes a una prepaga con más especialistas y sanatorios.',
    faq: [
      { q: '¿Cuál es el teléfono de OSMEDICA?', a: 'Centro de atención: 0800-999-5396. Emergencias médicas en CABA y GBA: 0810 345 0762 (gratuito, las 24 hs). Emergencias psiquiátricas: 11 4192-9150.' },
      { q: '¿Solo los médicos pueden afiliarse a OSMEDICA?', a: 'Nació para médicos de CABA, pero cualquier trabajador en relación de dependencia puede elegirla por la opción de cambio.' },
      { q: '¿Puedo pasar de OSMEDICA a una prepaga?', a: 'Sí: si trabajás en relación de dependencia podés derivar tus aportes a una prepaga, una vez por año. Te cotizamos gratis.' },
    ],
    keywords: ['osmedica', 'osmedica telefono', 'osmedica turnos', 'obra social de los medicos', 'obra social medicos caba'],
  },
  {
    // Nueva (1-oct-2026): mismo slug 'ospes' que ya existía en
    // FICHAS_REGISTRO — esta entrada la reemplaza. "ospes obra social" tiene
    // 6.600/mes (Google Ads Keyword Planner). Verificado 1-oct-2026 contra
    // ospes.org.ar, el sitio oficial (tiene delegaciones provinciales propias
    // además de la administración nacional).
    slug: 'ospes',
    nombre: 'OSPES (Estaciones de Servicio)',
    emoji: '⛽',
    tipo: 'sindical',
    titulo: 'OSPES (Estaciones de Servicio): teléfonos y afiliación (2026)',
    metaDescripcion: 'OSPES, la obra social del personal de estaciones de servicio, garages, lavaderos y gomerías: administración (011) 4956-0954, beneficiarios 0800-666-1230. Cobertura y afiliación.',
    descripcion: 'La obra social del personal de estaciones de servicio, garages, playas de estacionamiento, lavaderos automáticos y gomerías de la República Argentina.',
    intro: 'OSPES (Obra Social para el Personal de Estaciones de Servicio, Garages, Playas de Estacionamiento, Lavaderos Automáticos y Gomerías) cubre a los trabajadores de ese sector en todo el país, con una administración nacional en CABA y delegaciones provinciales propias.',
    quienesPuedenAfiliarse: [
      'Personal de estaciones de servicio, garages, playas de estacionamiento, lavaderos automáticos y gomerías, en relación de dependencia',
      'Grupo familiar a cargo del titular',
    ],
    aportes: {
      trabajador: '3% del salario bruto (Ley 23.660)',
      empleador: '6% del salario bruto (Ley 23.660)',
    },
    cobertura: [
      'PMO',
      'Plan Médico Asistencial propio',
      'Delegaciones provinciales',
    ],
    diferenciadores: [
      'Administración nacional más delegaciones propias por provincia',
    ],
    pros: [
      'Línea gratuita de beneficiarios',
      'Delegaciones provinciales propias, no solo un canal centralizado',
    ],
    contras: [
      'La atención varía según la delegación provincial: conviene confirmar los prestadores de tu zona',
    ],
    derivacion: true,
    web: 'ospes.org.ar',
    fuenteOficial: 'https://www.ospes.org.ar/',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'Administración (CABA)', valor: '(011) 4956-0954', detalle: 'También 4956-0321' },
      { etiqueta: 'Beneficiarios', valor: '0800-666-1230' },
    ],
    ganchoConversion: '¿OSPES no te alcanza en tu zona? Derivá tus aportes a una prepaga con cartilla en todo el país.',
    faq: [
      { q: '¿Cuál es el teléfono de OSPES?', a: 'Administración: (011) 4956-0954 / 0321. Línea de beneficiarios: 0800-666-1230.' },
      { q: '¿OSPES tiene delegaciones en todo el país?', a: 'Sí: además de la administración nacional en CABA, tiene delegaciones provinciales propias (por ejemplo en Santa Fe y La Pampa).' },
      { q: '¿Puedo pasar de OSPES a una prepaga?', a: 'Sí: si trabajás en relación de dependencia podés derivar tus aportes a una prepaga, una vez por año. Te cotizamos gratis.' },
    ],
    keywords: ['ospes', 'ospes obra social', 'obra social estaciones de servicio', 'obra social gomerias', 'obra social garages'],
  },
  {
    // Nueva (1-oct-2026): mismo slug 'ospia' que ya existía en
    // FICHAS_REGISTRO — esta entrada la reemplaza. Volumen moderado
    // ("ospia cartilla"/"ospia telefono" empatados, 110/mes cada uno) pero
    // fuente oficial muy sólida: 60+ delegaciones y presencia en 17+
    // provincias, verificado 1-oct-2026 contra ospia.org.ar.
    slug: 'ospia',
    nombre: 'OSPIA (Industria de la Alimentación)',
    emoji: '🍞',
    tipo: 'sindical',
    titulo: 'OSPIA: la obra social de la industria de la alimentación (2026)',
    metaDescripcion: 'OSPIA, la obra social de los trabajadores de la industria alimenticia: línea gratuita 0800-666-6774. Más de 60 delegaciones en todo el país, cartilla y cómo derivar tus aportes.',
    descripcion: 'La obra social del personal de la industria de la alimentación, con delegaciones en todo el país.',
    intro: 'OSPIA (Obra Social del Personal de la Industria de la Alimentación) cubre a los trabajadores de la industria alimenticia, con más de 60 delegaciones en 17 provincias y una línea gratuita nacional.',
    quienesPuedenAfiliarse: [
      'Trabajadores de la industria de la alimentación en relación de dependencia',
      'Grupo familiar a cargo del titular',
    ],
    aportes: {
      trabajador: '3% del salario bruto (Ley 23.660)',
      empleador: '6% del salario bruto (Ley 23.660)',
    },
    cobertura: [
      'PMO',
      'Cartilla prestacional propia, actualizada por período',
      'App con credencial digital',
      'Programas de discapacidad y salud mental',
    ],
    diferenciadores: [
      'Más de 60 delegaciones en 17 provincias',
    ],
    pros: [
      'Línea gratuita de atención en todo el país',
      'Presencia federal: no se concentra solo en CABA',
    ],
    contras: [
      'La cartilla y los prestadores disponibles varían según la delegación',
    ],
    derivacion: true,
    web: 'ospia.org.ar',
    fuenteOficial: 'https://www.ospia.org.ar/',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'Línea gratuita (todo el país)', valor: '0800-666-6774' },
    ],
    ganchoConversion: '¿La cartilla de OSPIA no te alcanza en tu zona? Derivá tus aportes a una prepaga con más sanatorios cerca tuyo.',
    faq: [
      { q: '¿Cuál es el teléfono de OSPIA?', a: '0800-666-6774, línea gratuita en todo el país.' },
      { q: '¿OSPIA tiene delegaciones en todo el país?', a: 'Sí: más de 60 delegaciones en más de 17 provincias, según la propia obra social.' },
      { q: '¿Puedo pasar de OSPIA a una prepaga?', a: 'Sí: si trabajás en relación de dependencia podés derivar tus aportes a una prepaga, una vez por año. Te cotizamos gratis.' },
    ],
    keywords: ['ospia', 'ospia obra social', 'obra social alimentacion', 'ospia telefono', 'ospia cartilla'],
  },
  {
    // Nueva (1-oct-2026): mismo slug 'ase' que ya existía en FICHAS_REGISTRO
    // — esta entrada la reemplaza. "ase obra social" tiene 1.000/mes.
    // Verificado 1-oct-2026 contra ase.com.ar, el sitio oficial.
    slug: 'ase',
    nombre: 'ASE (Personal de Dirección)',
    emoji: '💼',
    tipo: 'sindical',
    titulo: 'ASE (Acción Social de Empresarios): teléfonos y afiliación (2026)',
    metaDescripcion: 'ASE (Acción Social de Empresarios), la obra social del personal de dirección de empresas: línea nacional 0810-3333-273. Cobertura, gestiones online y cómo derivar tus aportes.',
    descripcion: 'La obra social del personal de dirección de empresas, administrada por Acción Social de Empresarios.',
    intro: 'ASE (Acción Social de Empresarios) es la obra social del personal de dirección de empresas desde 1977, con filiales en el país y gestiones online para no tener que ir de forma presencial.',
    quienesPuedenAfiliarse: [
      'Personal de dirección de empresas en relación de dependencia',
      'Grupo familiar a cargo del titular',
    ],
    aportes: {
      trabajador: '3% del salario bruto (Ley 23.660)',
      empleador: '6% del salario bruto (Ley 23.660)',
    },
    cobertura: [
      'PMO',
      'Gestiones y trámites online, sin necesidad de ir a una filial',
      'Filiales en el país',
    ],
    diferenciadores: [
      'Pensada específicamente para personal de dirección y mandos gerenciales',
    ],
    pros: [
      'Línea nacional gratuita única para todo el país',
      'Trámites online para evitar la presencialidad',
    ],
    contras: [
      'Pensada para personal jerárquico: la cartilla puede no ajustarse a otros perfiles',
    ],
    derivacion: true,
    web: 'ase.com.ar',
    fuenteOficial: 'https://www.ase.com.ar/',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'Línea nacional', valor: '0810-3333-273' },
    ],
    ganchoConversion: '¿Querés una cobertura premium para personal jerárquico? Cotizá una prepaga y compará contra ASE.',
    faq: [
      { q: '¿Cuál es el teléfono de ASE?', a: '0810-3333-273, línea nacional desde cualquier parte del país.' },
      { q: '¿Quién puede afiliarse a ASE?', a: 'Principalmente personal de dirección de empresas, aunque como cualquier obra social con código, se puede elegir por la opción de cambio.' },
      { q: '¿Puedo pasar de ASE a una prepaga?', a: 'Sí: si trabajás en relación de dependencia podés derivar tus aportes a una prepaga, una vez por año. Te cotizamos gratis.' },
    ],
    keywords: ['ase obra social', 'ase accion social de empresarios', 'ase telefono', 'obra social personal de direccion'],
  },
  {
    slug: 'ospoce',
    nombre: 'OSPOCE',
    emoji: '🏛️',
    tipo: 'sindical',
    titulo: 'OSPOCE 2026: planes Mi600, Mi700 y Mi800 — cobertura y afiliación',
    metaDescripcion: 'OSPOCE, la obra social de organismos de control y empleados en relación de dependencia: planes Mi600, Mi700 y Mi800, cobertura PMO y cómo derivar tus aportes.',
    descripcion: 'Obra social nacida en los organismos de control del Estado, hoy abierta a empleados de casi cualquier sector por derivación de aportes.',
    intro: 'OSPOCE existe desde 1992, con origen en el personal de la Auditoría General de la Nación y las unidades de auditoría interna. Con la desregulación de 1997 se abrió a otros sectores (diplomáticos, estudios jurídicos, ejecutivos, aeronavegantes, docentes) y hoy cualquier trabajador en relación de dependencia puede derivarle su aporte. Ofrece tres planes — Mi600, Mi700 y Mi800 — de menor a mayor cartilla y beneficios.',
    beneficiarios: 225000,
    quienesPuedenAfiliarse: [
      'Trabajadores en relación de dependencia (derivación de aportes, cualquier sector)',
      'Personal de organismos de control del Estado (origen histórico)',
      'Grupo familiar del titular',
    ],
    aportes: {
      trabajador: '3% del salario bruto',
      empleador: '6% del salario bruto',
      monotributista: 'No aplica (requiere relación de dependencia)',
    },
    cobertura: [
      'PMO completo',
      'Mi600: urgencias 24hs, descuentos en farmacia, cobertura de anticonceptivos',
      'Mi700: suma sanatorios y profesionales, urgencias online, descuento en ópticas',
      'Mi800: asistencia al viajero y consultas sin copago',
      'Internación y maternidad',
      'Salud mental',
    ],
    diferenciadores: [
      'Tres planes escalonados (Mi600/Mi700/Mi800) dentro de la misma obra social',
      'Abierta a casi cualquier sector por derivación, no solo a su origen estatal',
      'Más de 225.000 afiliados con sedes en varias provincias',
    ],
    pros: [
      'Opción real para derivar el aporte fuera de la obra social sindical de origen',
      'Escalabilidad interna: podés subir de plan sin cambiar de obra social',
      'Trayectoria de más de 30 años',
    ],
    contras: [
      'Menos sanatorios propios que OSDE o Swiss Medical',
      'Cartilla premium acotada en el plan de entrada (Mi600)',
    ],
    derivacion: true,
    web: 'ospoce.com.ar',
    faq: [
      { q: '¿Qué es OSPOCE?', a: 'Una obra social nacida en 1992 para el personal de organismos de control del Estado (Auditoría General de la Nación) que desde 1997, con la desregulación de aportes, se abrió a empleados de casi cualquier sector.' },
      { q: '¿Puedo derivar mi aporte a OSPOCE?', a: 'Sí, cualquier trabajador en relación de dependencia puede pedir la derivación de aportes a OSPOCE a través de la Superintendencia de Servicios de Salud.' },
      { q: '¿Cuál es la diferencia entre Mi600, Mi700 y Mi800?', a: 'Son los tres planes de OSPOCE, de menor a mayor cobertura: Mi600 es el de entrada (urgencias 24hs, descuentos en farmacia), Mi700 suma sanatorios y profesionales, y Mi800 agrega asistencia al viajero y consultas sin copago.' },
      { q: '¿OSPOCE cubre el PMO?', a: 'Sí, como toda obra social, OSPOCE garantiza por ley la cobertura del Programa Médico Obligatorio en todos sus planes.' },
    ],
    keywords: ['ospoce', 'ospoce obra social', 'ospoce mi600', 'ospoce mi700', 'ospoce mi800', 'derivar aportes a ospoce'],
  },
  {
    slug: 'daspu',
    nombre: 'DASPU',
    emoji: '🎓',
    tipo: 'estatal',
    titulo: 'DASPU 2026: la obra social universitaria de Córdoba — planes y afiliación',
    metaDescripcion: 'DASPU, la obra social de la Universidad Nacional de Córdoba: quiénes pueden afiliarse como adherentes, planes Integral y Esencial, y cómo funciona.',
    descripcion: 'La obra social de la Universidad Nacional de Córdoba, abierta a adherentes voluntarios.',
    intro: 'DASPU es la obra social universitaria de la Universidad Nacional de Córdoba (la sigla viene de su origen: Dirección de Asistencia Social del Personal Universitario). Además de los docentes y no docentes de la UNC, admite afiliación voluntaria de estudiantes, egresados menores de 35 años, profesionales colegiados y familiares — lo que la convierte en una opción real de cobertura en Córdoba más allá de la comunidad universitaria.',
    quienesPuedenAfiliarse: [
      'Docentes y no docentes de la UNC (afiliación obligatoria automática)',
      'Estudiantes universitarios y egresados menores de 35 años (adherentes)',
      'Profesionales colegiados (adherentes)',
      'Familiares de 2º y 3º grado de agentes universitarios',
      'Jubilados y pensionados universitarios',
    ],
    aportes: {
      trabajador: 'Aporte sobre el salario (personal UNC)',
      empleador: 'Contribución patronal UNC',
      monotributista: 'Cuota de adherente según plan y edad',
    },
    cobertura: [
      'PMO completo',
      'Red de prestadores en Córdoba capital e interior provincial',
      'Internación y urgencias',
      'Maternidad',
      'Salud mental',
      'Farmacia y óptica con descuentos',
    ],
    diferenciadores: [
      'Dos planes: DASPU Integral (completo) y DASPU Esencial (accesible)',
      'Fuerte inserción en la red de salud cordobesa',
      'Una de las pocas obras sociales universitarias abiertas a adherentes',
    ],
    pros: [
      'Opción real y accesible para estudiantes y jóvenes profesionales en Córdoba',
      'Red local cordobesa consolidada',
      'Planes diferenciados según presupuesto',
    ],
    contras: [
      'Cobertura centrada en Córdoba: limitada si te mudás de provincia',
      'Requiere examen médico de admisión para adherentes',
      'Cartilla premium acotada frente a prepagas nacionales',
    ],
    derivacion: false,
    web: 'daspu.com.ar',
    faq: [
      { q: '¿Qué significa DASPU?', a: 'La sigla viene de su origen como Dirección de Asistencia Social del Personal Universitario de la Universidad Nacional de Córdoba. Hoy se denomina Obra Social Universitaria.' },
      { q: '¿Puedo afiliarme a DASPU sin trabajar en la UNC?', a: 'Sí, como adherente: estudiantes universitarios, egresados menores de 35 años, profesionales colegiados y familiares de 2º/3º grado de agentes universitarios pueden afiliarse voluntariamente, con examen médico de admisión.' },
      { q: '¿Qué planes tiene DASPU?', a: 'Dos: DASPU Integral, la opción más completa, y DASPU Esencial, la alternativa accesible. La cuota de adherente varía según plan y edad.' },
      { q: '¿DASPU o una prepaga en Córdoba?', a: 'DASPU es competitiva en precio para estudiantes y jóvenes profesionales cordobeses. Si buscás cartilla premium (Sanatorio Allende, Hospital Privado sin restricciones) o cobertura nacional, compará contra las prepagas con presencia en Córdoba.' },
    ],
    keywords: ['daspu', 'daspu córdoba', 'daspu afiliación', 'daspu adherentes', 'obra social universitaria unc', 'daspu planes'],
  },
  {
    // Reescrita 1-oct-2026 con datos de su web oficial (https://www.apross.gov.ar/institucional/).
    slug: 'apross',
    nombre: 'APROSS',
    emoji: '🏛️',
    tipo: 'provincial',
    titulo: 'APROSS (Córdoba): teléfonos, afiliación, cartilla y app (2026)',
    metaDescripcion: 'APROSS, la obra social de los empleados públicos de Córdoba: emergencias 0810-777-2985, atención 0800-888-2776, afiliación obligatoria y voluntaria, Hospital Raúl Ferreyra, app y telemedicina.',
    descripcion: 'La obra social de los agentes públicos de la provincia de Córdoba, con más de 600.000 afiliados.',
    intro: 'APROSS (Administración Provincial del Seguro de Salud) es la obra social de los agentes en actividad y jubilados de los tres poderes del Estado de Córdoba y de los municipios y comunas adheridos. Fue creada en 2005 por la Ley 9277. Según APROSS, tiene más de 600.000 afiliados, una red de casi 15.000 prestadores, un hospital propio (el Hospital Raúl Ferreyra) y descuentos en 1.600 farmacias.',
    beneficiarios: 600000,
    quienesPuedenAfiliarse: [
      'Agentes en actividad y jubilados de los tres poderes del Estado provincial de Córdoba',
      'Empleados de municipios y comunas adheridos',
      'Familiares a cargo del titular (afiliados indirectos)',
      'Afiliación voluntaria: APROSS tiene afiliados voluntarios además de los obligatorios',
    ],
    cobertura: [
      'Red de casi 15.000 prestadores',
      'Hospital Raúl Ferreyra, centro de referencia propio',
      'Descuentos en 1.600 farmacias adheridas',
      'Telemedicina y turnero digital',
      'Programas de salud y líneas de cuidado priorizadas',
    ],
    diferenciadores: [
      'Hospital propio (Raúl Ferreyra)',
      'Portal de autogestión y app con credencial',
    ],
    pros: [
      'Hospital propio y red amplia en Córdoba',
      'Afiliación voluntaria disponible',
      'Trámites digitales en el portal de autogestión',
    ],
    contras: [
      'Hay coseguros en muchas prestaciones',
      'La telemedicina está habilitada solo en algunos departamentos de la provincia',
    ],
    derivacion: false,
    web: 'apross.gov.ar',
    fuenteOficial: 'https://www.apross.gov.ar/institucional/',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'Emergencias', valor: '0810-777-2985', detalle: 'También (0351) 420-1711 al 16 y (0351) 569-7000' },
      { etiqueta: 'Atención al afiliado', valor: '0800-888-2776', detalle: 'Lunes a viernes de 8 a 20' },
    ],
    faq: [
      { q: '¿Cuál es el teléfono de APROSS?', a: 'Emergencias: 0810-777-2985. Atención al afiliado: 0800-888-2776, de lunes a viernes de 8 a 20.' },
      { q: '¿APROSS tiene afiliación voluntaria?', a: 'Sí. Según APROSS, sus afiliados se dividen en obligatorios y voluntarios, y en ambos casos pueden ser titulares o familiares a cargo.' },
      { q: '¿Cuántos afiliados tiene APROSS?', a: 'Más de 600.000, según la propia APROSS.' },
      { q: '¿Puedo tener APROSS y una prepaga?', a: 'Sí: podés mantener APROSS y contratar una prepaga como particular para sumar la cartilla privada que quieras. Te cotizamos gratis y te decimos qué prepagas tienen buena red en tu ciudad.' },
    ],
    keywords: ['apross', 'apross telefono', 'apross cordoba', 'apross afiliacion voluntaria', 'apross cartilla', 'apross 0800'],
  },
  {
    // Reescrita 1-oct-2026 con datos de su web oficial (https://www.ipssalta.gov.ar/Contacto.aspx).
    slug: 'ips-salta',
    nombre: 'IPS Salta',
    emoji: '🏔️',
    tipo: 'provincial',
    titulo: 'IPS Salta: casa central, teléfono y afiliación individual (2026)',
    metaDescripcion: 'IPS Salta, el Instituto Provincial de Salud de Salta: casa central en España 782, conmutador (0387) 432-3100 y afiliación individual 2026.',
    descripcion: 'El Instituto Provincial de Salud de Salta, la obra social de los estatales salteños.',
    intro: 'El IPS (Instituto Provincial de Salud de Salta) es la obra social de los empleados públicos de Salta. Su casa central está en España 782, Salta capital, con conmutador (0387) 432-3100. Además de los afiliados estatales, ofrece afiliación individual.',
    quienesPuedenAfiliarse: [
      'Empleados públicos de la provincia de Salta',
      'Jubilados del régimen provincial',
      'Grupo familiar del titular',
      'Afiliación individual (voluntaria)',
    ],
    cobertura: [
      'Prestadores, ópticas y farmacias en convenio',
      'Internación domiciliaria',
      'Suite de autogestión para afiliados',
    ],
    diferenciadores: [
      'Afiliación individual disponible',
    ],
    pros: [
      'Se puede afiliar como particular',
      'Autogestión online',
    ],
    contras: [
      'Fuera de Salta la atención es por convenios',
    ],
    derivacion: false,
    web: 'ipssalta.gov.ar',
    fuenteOficial: 'https://www.ipssalta.gov.ar/Contacto.aspx',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'Casa central (conmutador)', valor: '(0387) 432-3100', detalle: 'España 782, Salta' },
    ],
    faq: [
      { q: '¿Cuál es el teléfono del IPS Salta?', a: 'El conmutador de la casa central es (0387) 432-3100, en España 782, Salta capital.' },
      { q: '¿Me puedo afiliar al IPS Salta como particular?', a: 'Sí: el IPS ofrece afiliación individual además de la de los empleados públicos.' },
      { q: '¿Puedo tener el IPS y una prepaga?', a: 'Sí: podés mantener el IPS y contratar una prepaga como particular para sumar la cartilla privada que quieras. Te cotizamos gratis y te decimos qué prepagas tienen buena red en tu ciudad.' },
    ],
    keywords: ['ips salta', 'ipss salta', 'ips salta telefono', 'ips salta afiliacion individual', 'instituto provincial de salud salta'],
  },
  {
    // Reescrita 1-oct-2026 con datos de su web oficial (https://www.issn.gov.ar/).
    slug: 'issn',
    nombre: 'ISSN',
    emoji: '⛰️',
    tipo: 'provincial',
    titulo: 'ISSN (Neuquén): obra social y previsión de los estatales neuquinos (2026)',
    metaDescripcion: 'ISSN, el Instituto de Seguridad Social del Neuquén: obra social y jubilaciones de los empleados públicos de Neuquén. Tipos de afiliados, oficina virtual y cobertura 100% en anteojos para mayores de 65.',
    descripcion: 'El Instituto de Seguridad Social del Neuquén: obra social y previsión de los estatales neuquinos.',
    intro: 'El ISSN (Instituto de Seguridad Social del Neuquén) administra la obra social y las jubilaciones de los empleados públicos de Neuquén. Tiene afiliados directos obligatorios, afiliados por convenio de reciprocidad y adherentes, oficina virtual para trámites y una cadena hotelera propia. Desde el 1 de septiembre de 2026 cubre el 100% de armazones y cristales para sus afiliados mayores de 65 años.',
    quienesPuedenAfiliarse: [
      'Afiliados directos obligatorios: empleados públicos de Neuquén',
      'Afiliados por convenio de reciprocidad',
      'Afiliados adherentes (con cuota)',
      'Jubilados del régimen provincial',
    ],
    cobertura: [
      'Prestaciones médicas, bioquímicas, odontológicas y farmacéuticas',
      'Salud mental',
      'Casa de la Prevención: programas de crónicas, materno infantil, salud sexual y más',
      'Óptica: 100% en armazones y cristales para mayores de 65 (desde septiembre de 2026)',
    ],
    diferenciadores: [
      'Obra social y previsión en el mismo instituto',
      'Cadena hotelera propia para afiliados',
    ],
    pros: [
      'Programas de prevención propios',
      'Cobertura total de anteojos para mayores de 65',
      'Oficina virtual para trámites',
    ],
    contras: [
      'Hay coseguros',
      'Fuera de Neuquén la atención es por convenios',
    ],
    derivacion: false,
    web: 'issn.gov.ar',
    fuenteOficial: 'https://www.issn.gov.ar/',
    verificado: '2026-10-01',
    faq: [
      { q: '¿Qué es el ISSN?', a: 'Es el Instituto de Seguridad Social del Neuquén: administra la obra social y las jubilaciones de los empleados públicos neuquinos. Su sede central está en Buenos Aires 353, Neuquén.' },
      { q: '¿El ISSN cubre anteojos?', a: 'Sí: desde el 1 de septiembre de 2026, los afiliados mayores de 65 años tienen cobertura total en armazones y cristales.' },
      { q: '¿Puedo tener el ISSN y una prepaga?', a: 'Sí: podés mantener el ISSN y contratar una prepaga como particular para sumar la cartilla privada que quieras. Te cotizamos gratis y te decimos qué prepagas tienen buena red en tu ciudad.' },
    ],
    keywords: ['issn', 'issn neuquen', 'issn obra social', 'issn afiliados', 'issn anteojos'],
  },
  {
    // Reescrita 1-oct-2026 con datos de su web oficial (https://www.iapossantafe.gob.ar/quienes-somos/).
    slug: 'iapos',
    nombre: 'IAPOS',
    emoji: '🌾',
    tipo: 'provincial',
    titulo: 'IAPOS (Santa Fe): teléfonos, afiliaciones y app Mi IAPOS (2026)',
    metaDescripcion: 'IAPOS, la obra social de los empleados públicos de Santa Fe: coberturas y afiliaciones 0800-444-4276, medicamentos 0810-222-4276. Más de 575.000 afiliados y app Mi IAPOS.',
    descripcion: 'La obra social de los trabajadores del Estado santafesino, con más de 575.000 afiliados.',
    intro: 'IAPOS (Instituto Autárquico Provincial de Obra Social) es la obra social de los trabajadores del Estado de Santa Fe, de los jubilados de la Caja de Jubilaciones provincial y de los empleados de municipios y comunas con convenio, incluido su grupo familiar. Fue creada por la Ley 8288 de 1978, abrió el 1 de enero de 1979 y, según IAPOS, tiene más de 575.000 afiliados, con sedes en Santa Fe y Rosario y delegaciones en todos los departamentos.',
    beneficiarios: 575000,
    quienesPuedenAfiliarse: [
      'Trabajadores del Estado de la provincia de Santa Fe',
      'Jubilados y pensionados de la Caja de Jubilaciones provincial',
      'Empleados de municipios y comunas con convenio de adhesión',
      'Grupo familiar del titular',
    ],
    cobertura: [
      'Padrón de prestadores en toda la provincia',
      'Receta electrónica y token para medicamentos',
      'Coseguros digitales (órdenes y bonos) desde la app',
      'Servicio complementario',
    ],
    diferenciadores: [
      'App Mi IAPOS: credencial de todo el grupo familiar, recetas, coseguros y prestadores por cercanía y especialidad',
      'Sedes en Santa Fe y Rosario y delegaciones en toda la provincia',
    ],
    pros: [
      'App completa: credencial, recetas, coseguros y prestadores cerca',
      'Presencia en todos los departamentos de Santa Fe',
    ],
    contras: [
      'Hay coseguros por prestación',
      'La línea de coberturas atiende solo de 8 a 14',
    ],
    derivacion: false,
    web: 'iapossantafe.gob.ar',
    fuenteOficial: 'https://www.iapossantafe.gob.ar/quienes-somos/',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'Coberturas y afiliaciones', valor: '0800-444-4276', detalle: 'Días hábiles de 8 a 14' },
      { etiqueta: 'Consultas de medicamentos', valor: '0810-222-4276', detalle: 'Días hábiles de 8 a 17' },
      { etiqueta: 'Línea adicional', valor: '(0342) 559-4737' },
    ],
    faq: [
      { q: '¿Cuál es el teléfono de IAPOS?', a: 'Coberturas y afiliaciones: 0800-444-4276 (días hábiles de 8 a 14). Medicamentos: 0810-222-4276 (días hábiles de 8 a 17).' },
      { q: '¿Qué puedo hacer en la app Mi IAPOS?', a: 'Mostrar la credencial del titular y del grupo familiar, ver recetas electrónicas y token, sacar coseguros sin papel y buscar prestadores por cercanía y especialidad.' },
      { q: '¿Cuántos afiliados tiene IAPOS?', a: 'Más de 575.000, según IAPOS.' },
      { q: '¿Puedo tener IAPOS y una prepaga?', a: 'Sí: podés mantener IAPOS y contratar una prepaga como particular para sumar la cartilla privada que quieras. Te cotizamos gratis y te decimos qué prepagas tienen buena red en tu ciudad.' },
    ],
    keywords: ['iapos', 'iapos santa fe', 'iapos telefono', 'mi iapos', 'iapos afiliaciones', 'iapos 0800'],
  },
  {
    // Reescrita 1-oct-2026 con datos de su web oficial (https://osepmendoza.com.ar/web/).
    slug: 'osep-mendoza',
    nombre: 'OSEP Mendoza',
    emoji: '🍇',
    tipo: 'provincial',
    titulo: 'OSEP Mendoza: teléfonos, turnos, emergencias y afiliación (2026)',
    metaDescripcion: 'OSEP, la obra social de los empleados públicos de Mendoza: emergencias 0810-999-0042, turnos 0810-810-1033, asistente ALMA por WhatsApp. La afiliación voluntaria está suspendida.',
    descripcion: 'La obra social de los empleados públicos de la provincia de Mendoza.',
    intro: 'OSEP (Obra Social de Empleados Públicos) es la obra social de los trabajadores del Estado provincial y municipal de Mendoza y de organismos descentralizados, además de sus jubilados. Tiene efectores propios, turnos online, receta digital y un asistente virtual, ALMA, por WhatsApp. Importante: según OSEP, la afiliación voluntaria está suspendida temporalmente, salvo excepciones como los recién nacidos y algunos convenios con entidades.',
    quienesPuedenAfiliarse: [
      'Empleados públicos provinciales y municipales de Mendoza, y de organismos descentralizados o autárquicos',
      'Suplentes, con 30 días trabajados',
      'Jubilados y pensionados de la administración pública',
      'Grupo familiar del titular',
    ],
    cobertura: [
      'Efectores (centros de atención) propios',
      'Turnos en el Gran Mendoza y en las sedes territoriales',
      'Receta digital',
      'Telemedicina en la app',
      'Servicios preventivos',
    ],
    diferenciadores: [
      'Asistente virtual ALMA por WhatsApp',
      'Mi OSEP y app OSEP Móvil',
    ],
    pros: [
      'Centros de atención propios',
      'Turnos y trámites online',
      'Asistente por WhatsApp',
    ],
    contras: [
      'La afiliación voluntaria está suspendida temporalmente (salvo excepciones)',
      'Traslados sin médico requieren autorización previa',
    ],
    derivacion: false,
    web: 'osepmendoza.com.ar',
    fuenteOficial: 'https://osepmendoza.com.ar/web/',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'Emergencias', valor: '0810-999-0042', detalle: 'Opción 2: médico a domicilio' },
      { etiqueta: 'Turnos en el Gran Mendoza', valor: '0810-810-1033' },
      { etiqueta: 'Turnos en sedes territoriales', valor: '0810-810-8537' },
      { etiqueta: 'ALMA, asistente por WhatsApp', valor: '261 205-8800' },
    ],
    faq: [
      { q: '¿Cuál es el teléfono de OSEP Mendoza?', a: 'Emergencias: 0810-999-0042 (opción 2, médico a domicilio). Turnos en el Gran Mendoza: 0810-810-1033; en sedes territoriales: 0810-810-8537. WhatsApp del asistente ALMA: 261 205-8800.' },
      { q: '¿Me puedo afiliar a OSEP de forma voluntaria?', a: 'Por ahora no: según OSEP, las afiliaciones voluntarias están suspendidas temporalmente, salvo excepciones como los recién nacidos y algunos convenios con entidades.' },
      { q: '¿Puedo tener OSEP y una prepaga?', a: 'Sí: podés mantener OSEP y contratar una prepaga como particular para sumar la cartilla privada que quieras. Te cotizamos gratis y te decimos qué prepagas tienen buena red en tu ciudad.' },
    ],
    keywords: ['osep', 'osep mendoza', 'osep telefono', 'osep turnos', 'osep emergencias', 'osep afiliacion'],
  },
  {
    // Reescrita 1-oct-2026 con datos de su web oficial (https://msptucuman.gov.ar/nueva-aplicacion-del-subsidio-de-salud-fortalece-el-acceso-de-los-afiliados/). Fuente: Ministerio de Salud de Tucumán y Guía de Trámites del Gobierno de Tucumán.
    slug: 'ipsst',
    nombre: 'IPSST (Subsidio de Salud)',
    emoji: '🍋',
    tipo: 'provincial',
    titulo: 'IPSST Tucumán (Subsidio de Salud): app, cobertura y casa central (2026)',
    metaDescripcion: 'IPSST, el Subsidio de Salud de Tucumán: la obra social de los estatales tucumanos, app IPSST Móvil, casa central en Las Piedras 530 y filial en Buenos Aires.',
    descripcion: 'El Subsidio de Salud: la obra social de los empleados públicos de Tucumán.',
    intro: 'El IPSST (Instituto de Previsión y Seguridad Social de Tucumán), conocido como Subsidio de Salud, es la obra social de los empleados públicos tucumanos. Según el Ministerio de Salud de Tucumán, cubre a más de 370.000 familias. Tiene la app IPSST Móvil, consultorios propios y una filial en la Casa de Tucumán, en Buenos Aires.',
    quienesPuedenAfiliarse: [
      'Empleados públicos de la provincia de Tucumán',
      'Jubilados del régimen provincial',
      'Grupo familiar del titular',
    ],
    cobertura: [
      'Consultorios propios (sede Chacabuco 433)',
      'Cobertura de internación clínica y quirúrgica',
      'Planes especiales',
      'Atención en Buenos Aires a través de la filial en la Casa de Tucumán',
    ],
    diferenciadores: [
      'App IPSST Móvil: coberturas, consumos, prestadores, credencial digital y token',
    ],
    pros: [
      'App completa con credencial y token',
      'Filial en Buenos Aires para afiliados de viaje',
    ],
    contras: [
      'Fuera de Tucumán la atención es por convenios y reciprocidad',
    ],
    derivacion: false,
    web: 'msptucuman.gov.ar',
    fuenteOficial: 'https://msptucuman.gov.ar/nueva-aplicacion-del-subsidio-de-salud-fortalece-el-acceso-de-los-afiliados/',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'Filial Buenos Aires (Casa de Tucumán)', valor: '(011) 4322-0584', detalle: 'Suipacha 140, 1.er piso' },
    ],
    faq: [
      { q: '¿Qué es el Subsidio de Salud de Tucumán?', a: 'Es el IPSST, la obra social de los empleados públicos tucumanos. Su casa central está en Las Piedras 530, 2.º piso, San Miguel de Tucumán.' },
      { q: '¿Qué hace la app IPSST Móvil?', a: 'Permite consultar coberturas y consumos, ver los prestadores en convenio, tener la credencial digital, recibir notificaciones y validar prestaciones con token.' },
      { q: '¿Puedo tener el IPSST y una prepaga?', a: 'Sí: podés mantener el IPSST y contratar una prepaga como particular para sumar la cartilla privada que quieras. Te cotizamos gratis y te decimos qué prepagas tienen buena red en tu ciudad.' },
    ],
    keywords: ['ipsst', 'subsidio de salud tucuman', 'ipsst movil', 'ipsst tucuman', 'obra social tucuman'],
  },
  {
    // Reescrita 1-oct-2026 con datos de su web oficial (https://www.oser.gob.ar/institucion/historia-y-legislacion). Antes era la ficha de IOSPER (/obras-sociales/iosper redirige acá).
    slug: 'oser',
    nombre: 'OSER (ex IOSPER)',
    emoji: '🌊',
    tipo: 'provincial',
    titulo: 'OSER (ex IOSPER): la obra social de Entre Ríos, teléfonos y qué cambió (2026)',
    metaDescripcion: 'IOSPER ahora es OSER, la Obra Social de Entre Ríos: más de 300.000 afiliados, atención 0800-444-4677 y WhatsApp 343 570-1533. Qué cambió y cómo seguir atendiéndote.',
    descripcion: 'La obra social de los trabajadores estatales de Entre Ríos, sucesora de IOSPER desde 2025.',
    intro: 'OSER (Obra Social de Entre Ríos) reemplazó a IOSPER en 2025: fue creada por la Ley provincial 11.202 como organismo sucesor y mantiene todo el sistema de prestaciones, el personal y las sedes en toda la provincia. Los afiliados de IOSPER pasaron automáticamente a OSER. Cubre a los trabajadores estatales entrerrianos, activos y jubilados, y a sus familias: según OSER, más de 300.000 afiliados.',
    beneficiarios: 300000,
    quienesPuedenAfiliarse: [
      'Trabajadores estatales de Entre Ríos, activos y jubilados',
      'Grupo familiar del titular',
      'Hijos estudiantes hasta los 26 años inclusive (ampliación de OSER)',
    ],
    cobertura: [
      'Búsqueda de profesionales, establecimientos y delegaciones en la web',
      'Constancia de afiliación online',
      'Consulta de farmacias',
      'Programas de salud (por ejemplo, con CEMENER)',
    ],
    diferenciadores: [
      'Sucesora de IOSPER: los afiliados pasaron automáticamente',
      'WhatsApp de atención digital verificado',
    ],
    pros: [
      'Continuidad total de IOSPER: misma cobertura y sedes',
      'Atención digital por WhatsApp',
      'Cobertura de hijos estudiantes hasta los 26 años',
    ],
    contras: [
      'Es obligatoria para los estatales entrerrianos: no se elige',
      'Si buscás cartilla privada amplia, la tenés que sumar aparte',
    ],
    derivacion: false,
    web: 'oser.gob.ar',
    fuenteOficial: 'https://www.oser.gob.ar/institucion/historia-y-legislacion',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'Atención al afiliado', valor: '0800-444-4677' },
      { etiqueta: 'WhatsApp de atención digital', valor: '343 570-1533', detalle: 'Cuenta verificada (tilde azul)' },
    ],
    faq: [
      { q: '¿IOSPER sigue existiendo?', a: 'No: desde 2025 la obra social de los estatales de Entre Ríos es OSER, creada por la Ley 11.202 como sucesora de IOSPER. Los afiliados pasaron automáticamente y se mantienen las prestaciones y las sedes.' },
      { q: '¿Cuál es el teléfono de OSER?', a: 'Atención: 0800-444-4677. WhatsApp de atención digital: 343 570-1533 (cuenta verificada). OSER nunca pide contraseñas ni datos bancarios por WhatsApp.' },
      { q: '¿Cuántos afiliados tiene OSER?', a: 'Más de 300.000, según OSER.' },
      { q: '¿Puedo tener OSER y una prepaga?', a: 'Sí: podés mantener OSER y contratar una prepaga como particular para sumar la cartilla privada que quieras. Te cotizamos gratis y te decimos qué prepagas tienen buena red en tu ciudad.' },
    ],
    keywords: ['oser', 'oser entre rios', 'iosper', 'iosper ahora oser', 'oser telefono', 'oser whatsapp', 'obra social entre rios'],
  },
  {
    // Reescrita 1-oct-2026 con datos de su web oficial (https://ipsmisiones.com.ar/obra-social/).
    slug: 'ips-misiones',
    nombre: 'IPS Misiones',
    emoji: '🌿',
    tipo: 'provincial',
    titulo: 'IPS Misiones: obra social, teléfonos y afiliaciones (2026)',
    metaDescripcion: 'IPS Misiones, el Instituto de Previsión Social: obra social de 180.503 afiliados (estatales activos y pasivos de Misiones). Teléfono 0376-444-8631, Junín 1563, Posadas.',
    descripcion: 'La obra social del Instituto de Previsión Social de Misiones.',
    intro: 'El IPS (Instituto de Previsión Social de la Provincia de Misiones) brinda la obra social de los empleados activos y pasivos de la administración pública provincial, sus jubilados y pensionados y sus familias. Según el IPS, cubre a 180.503 afiliados con servicios médico-asistenciales acordes al PMO. Atiende en Junín 1563, Posadas, de lunes a viernes de 7 a 12 y de 14:30 a 19:30.',
    beneficiarios: 180503,
    quienesPuedenAfiliarse: [
      'Empleados activos y pasivos de la administración pública de Misiones',
      'Jubilados y pensionados del régimen provincial',
      'Grupo familiar del titular',
    ],
    cobertura: [
      'Programa Médico Obligatorio',
      'Laboratorio de análisis clínicos propio',
      'Inmunización',
      'Discapacidad',
      'Servicios fúnebres',
    ],
    diferenciadores: [
      'Laboratorio propio',
      'Turnos online',
    ],
    pros: [
      'Laboratorio de análisis propio',
      'Turnos por plataforma online',
    ],
    contras: [
      'Fuera de Misiones la atención es por convenios',
    ],
    derivacion: false,
    web: 'ipsmisiones.com.ar',
    fuenteOficial: 'https://ipsmisiones.com.ar/obra-social/',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'Obra social', valor: '0376-444-8631', detalle: 'Lunes a viernes de 7 a 12 y de 14:30 a 19:30' },
      { etiqueta: 'Derivaciones', valor: '03764-444-8678' },
      { etiqueta: 'Discapacidad', valor: '0376-444-8677' },
    ],
    faq: [
      { q: '¿Cuál es el teléfono del IPS Misiones?', a: 'Obra social: 0376-444-8631, Junín 1563, Posadas (lunes a viernes de 7 a 12 y de 14:30 a 19:30). Derivaciones: 03764-444-8678.' },
      { q: '¿Cuántos afiliados tiene el IPS Misiones?', a: '180.503, según el IPS.' },
      { q: '¿Puedo tener el IPS y una prepaga?', a: 'Sí: podés mantener el IPS y contratar una prepaga como particular para sumar la cartilla privada que quieras. Te cotizamos gratis y te decimos qué prepagas tienen buena red en tu ciudad.' },
    ],
    keywords: ['ips misiones', 'ips misiones telefono', 'ips posadas', 'obra social misiones', 'ips misiones obra social'],
  },
  {
    // Reescrita 1-oct-2026 con datos de su web oficial (https://mapadelestado.chaco.gob.ar/dependencia/ver/1447). Fuente: Mapa del Estado del Gobierno del Chaco.
    slug: 'insssep',
    nombre: 'INSSSEP',
    emoji: '🌳',
    tipo: 'provincial',
    titulo: 'INSSSEP (Chaco): obra social y jubilaciones de los estatales chaqueños (2026)',
    metaDescripcion: 'INSSSEP, el Instituto de Seguridad Social, Seguros y Préstamos del Chaco: obra social y régimen de jubilaciones de los empleados públicos chaqueños. Dirección y teléfono.',
    descripcion: 'El instituto que administra la obra social y las jubilaciones de los estatales del Chaco.',
    intro: 'El INSSSEP (Instituto de Seguridad Social, Seguros y Préstamos) es el organismo del Chaco que administra la cobertura de salud de los empleados públicos provinciales, el régimen de jubilaciones y pensiones, subsidios laborales por discapacidad y protección de vida, y un fondo financiero complementario. Su sede está en Av. 25 de Mayo 701, Resistencia.',
    quienesPuedenAfiliarse: [
      'Empleados públicos de la provincia del Chaco',
      'Jubilados y pensionados del régimen provincial',
      'Grupo familiar del titular',
    ],
    cobertura: [
      'Cobertura de salud (obra social provincial)',
      'Régimen de jubilaciones y pensiones',
      'Subsidios por discapacidad y protección de vida',
    ],
    diferenciadores: [
      'Obra social, previsión y seguros en el mismo instituto',
    ],
    pros: [
      'Cobertura de salud y previsión en un solo organismo',
    ],
    contras: [
      'Es obligatoria para los estatales chaqueños: no se elige',
    ],
    derivacion: false,
    web: 'insssep.gob.ar',
    fuenteOficial: 'https://mapadelestado.chaco.gob.ar/dependencia/ver/1447',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'Sede central (Resistencia)', valor: '(0362) 441-4400', detalle: 'Av. 25 de Mayo 701' },
    ],
    faq: [
      { q: '¿Qué es el INSSSEP?', a: 'Es el Instituto de Seguridad Social, Seguros y Préstamos del Chaco: administra la obra social de los empleados públicos provinciales, las jubilaciones y pensiones y subsidios por discapacidad y protección de vida.' },
      { q: '¿Cuál es el teléfono del INSSSEP?', a: 'Sede central en Resistencia: (0362) 441-4400, Av. 25 de Mayo 701, según el Mapa del Estado del Gobierno del Chaco.' },
      { q: '¿Puedo tener el INSSSEP y una prepaga?', a: 'Sí: podés mantener el INSSSEP y contratar una prepaga como particular para sumar la cartilla privada que quieras. Te cotizamos gratis y te decimos qué prepagas tienen buena red en tu ciudad.' },
    ],
    keywords: ['insssep', 'insssep chaco', 'insssep telefono', 'obra social chaco', 'insssep resistencia'],
  },
  {
    // Reescrita 1-oct-2026 con datos de su web oficial (https://ioscor.gob.ar/).
    slug: 'ioscor',
    nombre: 'IOSCor',
    emoji: '🛶',
    tipo: 'provincial',
    titulo: 'IOSCor (Corrientes): teléfonos, horarios y trámites (2026)',
    metaDescripcion: 'IOSCor, el Instituto de Obra Social de Corrientes: casa central en Dr. Ramón Carrillo 444, teléfonos para urgencias e informes (solo mensajes), óptica y padrón de afiliados.',
    descripcion: 'El Instituto de Obra Social de la Provincia de Corrientes.',
    intro: 'IOSCor (Instituto de Obra Social de la Provincia de Corrientes) es la obra social de los empleados públicos correntinos. Su casa central está en Dr. Ramón Carrillo 444, Corrientes, y atiende de lunes a viernes de 7:15 a 12:45 y de 13:45 a 19:15. Hoy está intervenido: su web lista una Secretaría Privada de Intervención. Para urgencias médicas y tratamientos impostergables publica teléfonos que reciben solo mensajes.',
    quienesPuedenAfiliarse: [
      'Empleados públicos de la provincia de Corrientes',
      'Jubilados del régimen provincial',
      'Hijos estudiantes mayores de 21 con constancia de alumno regular',
    ],
    cobertura: [
      'Prestadores y farmacias en convenio',
      'Óptica propia (calle Uruguay 851)',
      'Planes especiales',
      'Receta digital obligatoria (app RCTA)',
    ],
    diferenciadores: [
      'Óptica propia con oftalmólogo',
      'Padrón y expedientes consultables online',
    ],
    pros: [
      'Óptica propia',
      'Consulta de padrón y expedientes en la web',
    ],
    contras: [
      'Los teléfonos de urgencias reciben solo mensajes',
      'El organismo está intervenido',
    ],
    derivacion: false,
    web: 'ioscor.gob.ar',
    fuenteOficial: 'https://ioscor.gob.ar/',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'Informes (solo mensajes)', valor: '3794-623010' },
      { etiqueta: 'Derivaciones (solo mensajes)', valor: '3794-296374' },
      { etiqueta: 'Beneficiarios (solo mensajes)', valor: '3794-749076' },
      { etiqueta: 'Óptica (solo mensajes)', valor: '3794-627385' },
    ],
    faq: [
      { q: '¿Cuál es el teléfono de IOSCor?', a: 'Para urgencias médicas y tratamientos impostergables, IOSCor publica teléfonos que reciben solo mensajes: informes 3794-623010, derivaciones 3794-296374 y beneficiarios 3794-749076.' },
      { q: '¿Dónde queda IOSCor?', a: 'La casa central está en Dr. Ramón Carrillo 444, Corrientes capital, y atiende de lunes a viernes de 7:15 a 12:45 y de 13:45 a 19:15.' },
      { q: '¿Puedo tener IOSCor y una prepaga?', a: 'Sí: podés mantener IOSCor y contratar una prepaga como particular para sumar la cartilla privada que quieras. Te cotizamos gratis y te decimos qué prepagas tienen buena red en tu ciudad.' },
    ],
    keywords: ['ioscor', 'ioscor corrientes', 'ioscor telefono', 'ioscor padron', 'obra social corrientes'],
  },
  {
    // Reescrita 1-oct-2026 con datos de su web oficial (https://www.obsba.org.ar/institucional/).
    slug: 'obsba',
    nombre: 'ObSBA',
    emoji: '🏙️',
    tipo: 'provincial',
    titulo: 'ObSBA (Obra Social de la Ciudad): teléfonos, Sanatorio Méndez y WhatsApp (2026)',
    metaDescripcion: 'ObSBA, la Obra Social de la Ciudad de Buenos Aires: contact center 0800-348-1014, emergencias 0810-122-2283, chatbot ObSBI por WhatsApp y Sanatorio Méndez propio.',
    descripcion: 'La obra social de los trabajadores, activos y jubilados, del Gobierno de la Ciudad de Buenos Aires.',
    intro: 'ObSBA (Obra Social de la Ciudad de Buenos Aires) brinda cobertura médica y social a los trabajadores, activos y jubilados, del Gobierno de la Ciudad. Tiene un centro de salud propio, el Sanatorio Méndez, centros periféricos, laboratorio, telemedicina y servicios de turismo y recreación.',
    quienesPuedenAfiliarse: [
      'Trabajadores del Gobierno de la Ciudad de Buenos Aires',
      'Jubilados del Gobierno de la Ciudad',
      'Grupo familiar del titular',
    ],
    cobertura: [
      'Sanatorio Méndez, centro de salud propio',
      'Centros de salud periféricos',
      'Telemedicina',
      'Laboratorio',
      'Redes prestacionales en todos los niveles de atención',
      'Turismo y recreación',
    ],
    diferenciadores: [
      'Sanatorio propio en Caballito',
      'Chatbot ObSBI por WhatsApp',
    ],
    pros: [
      'Sanatorio propio',
      'Atención por WhatsApp',
      'Servicios sociales y de turismo',
    ],
    contras: [
      'Es para trabajadores y jubilados del Gobierno de la Ciudad',
      'El contact center atiende de lunes a viernes de 8 a 16',
    ],
    derivacion: false,
    web: 'obsba.org.ar',
    fuenteOficial: 'https://www.obsba.org.ar/institucional/',
    verificado: '2026-10-01',
    telefonos: [
      { etiqueta: 'Emergencias', valor: '0810-122-2283', detalle: 'También 2821-7010 y 5555-1710' },
      { etiqueta: 'Contact center', valor: '0800-348-1014', detalle: 'Lunes a viernes de 8 a 16' },
      { etiqueta: 'ObSBI, chatbot por WhatsApp', valor: '11 3340-4636' },
      { etiqueta: 'Turnos de imágenes', valor: '6842-7777', detalle: 'WhatsApp: 11 6037-1111' },
    ],
    faq: [
      { q: '¿Cuál es el teléfono de ObSBA?', a: 'Contact center: 0800-348-1014 (lunes a viernes de 8 a 16). Emergencias: 0810-122-2283, 2821-7010 o 5555-1710. WhatsApp (chatbot ObSBI): 11 3340-4636.' },
      { q: '¿ObSBA tiene sanatorio propio?', a: 'Sí: el Sanatorio Méndez. Además tiene centros de salud periféricos y laboratorio.' },
      { q: '¿Puedo tener ObSBA y una prepaga?', a: 'Sí: podés mantener ObSBA y contratar una prepaga como particular para sumar la cartilla privada que quieras. Te cotizamos gratis y te decimos qué prepagas tienen buena red en tu ciudad.' },
    ],
    keywords: ['obsba', 'obsba telefono', 'obsba whatsapp', 'obra social ciudad de buenos aires', 'sanatorio mendez obsba'],
  },
  {
    // Nueva (1-oct-2026): Río Negro es la PRIMERA provincia en permitir
    // derivar los aportes de su obra social provincial a otra obra social o
    // una prepaga — rompe el patrón de "cautiva" que tienen el resto de las
    // provinciales (ver ObSBA, Apross, etc. más arriba, todas con
    // derivacion: false). Ley aprobada 24-sep-2026 (35 a favor, 9 en contra),
    // impulsada por el gobernador Weretilneck. OJO: la ley ya está aprobada
    // pero la implementación real recién arranca en 2027 (el Ejecutivo tiene
    // 120 días para reglamentarla) — no es un trámite disponible hoy mismo.
    // Fuentes: La Nación ("Río Negro es la primera provincia..."),
    // Barilocheopina, Noti-Río, Vozradio, Diario Río Negro.
    slug: 'ipross',
    nombre: 'IPROSS',
    emoji: '🏔️',
    tipo: 'provincial',
    titulo: 'IPROSS 2026: Río Negro, primera provincia en permitir derivar los aportes',
    metaDescripcion: 'IPROSS (Río Negro) dejó de ser obligatoria: la Legislatura aprobó que los estatales deriven el 4% de su aporte a otra obra social o una prepaga. Cómo funciona y desde cuándo rige.',
    descripcion: 'IPROSS es la obra social de los empleados estatales de Río Negro, y la primera obra social provincial del país en permitir elegir otra cobertura.',
    intro: 'IPROSS (Instituto Provincial del Seguro de Salud) es la obra social de los trabajadores estatales de Río Negro. El 24 de septiembre de 2026 la Legislatura rionegrina aprobó, por 35 votos a favor y 9 en contra, una reforma impulsada por el gobernador Alberto Weretilneck que termina con la afiliación obligatoria: de ahora en más, los estatales van a poder elegir otra obra social o una prepaga en vez de IPROSS. Es la primera provincia del país en dar este paso. Importante: la ley ya está aprobada, pero la implementación recién va a estar disponible en 2027, porque el Poder Ejecutivo tiene 120 días para reglamentarla.',
    quienesPuedenAfiliarse: [
      'Trabajadores de la administración pública provincial de Río Negro',
      'Empleados municipales alcanzados por el régimen',
      'Jubilados y pensionados del sistema provincial',
    ],
    aportes: {
      trabajador: '4% del salario (derivable a otra cobertura desde que se reglamente la ley)',
      empleador: '7%, que según la ley queda siempre en IPROSS, derive uno su aporte o no',
      monotributista: 'No aplica: es exclusiva de empleados estatales y municipales de Río Negro',
    },
    cobertura: [
      'PMO completo',
      'Red de prestadores y hospitales públicos de Río Negro',
      'Internación, urgencias y maternidad',
      'Salud mental',
      'Medicamentos con descuento',
    ],
    diferenciadores: [
      'Primera obra social provincial de Argentina en permitir derivar el aporte personal a otra cobertura',
      'El 7% patronal queda en IPROSS igual, elijas derivar o no',
      'Los jubilados derivan el 5,5% de su haber (distinto al 4% de los activos)',
    ],
    pros: [
      'Hasta ahora era obligatoria sin excepción; ahora vas a poder elegir',
      'Cobertura automática para todo el personal estatal mientras tanto',
    ],
    contras: [
      'La implementación recién arranca en 2027: todavía no es un trámite disponible',
      'Solo se deriva el aporte personal (4% o 5,5%), no el patronal — para una prepaga, esa diferencia la pagás vos',
      'Quien se va, según el proyecto, tiene que esperar un plazo para poder volver a IPROSS',
    ],
    derivacion: true,
    fuenteOficial: 'La Nación, Diario Río Negro y cobertura de medios rionegrinos sobre la Ley aprobada el 24-sep-2026',
    verificado: '2026-10-01',
    faq: [
      { q: '¿Qué cambió en IPROSS?', a: 'Hasta ahora, todo empleado estatal de Río Negro estaba obligado a tener IPROSS. Desde la ley aprobada el 24 de septiembre de 2026, va a poder elegir otra obra social o una prepaga en su lugar — es la primera provincia del país en permitirlo.' },
      { q: '¿Ya puedo derivar mis aportes de IPROSS?', a: 'Todavía no: la ley está aprobada, pero el Poder Ejecutivo tiene 120 días para reglamentarla, así que la implementación real está proyectada para 2027, no para hoy.' },
      { q: '¿Cuánto puedo derivar?', a: 'El 100% de tu aporte personal: 4% si sos trabajador activo, 5,5% si sos jubilado o pensionado. El aporte patronal (7%) se queda en IPROSS de todas formas.' },
      { q: '¿Me alcanza el 4% para pagar una prepaga?', a: 'Depende de tu sueldo y del plan que elijas: en la mayoría de los casos el aporte derivado cubre una parte del plan, y la diferencia la pagás de tu bolsillo. Cotizá tu caso puntual para saber cuánto te quedaría poniendo vos.' },
      { q: '¿Si me voy de IPROSS puedo volver después?', a: 'Según lo discutido en la Legislatura, sí, pero con un plazo de espera — todavía hay que ver cómo queda exactamente una vez reglamentada la ley.' },
    ],
    keywords: ['ipross', 'ipross rio negro', 'ipross derivar aportes', 'ipross libre eleccion', 'ipross prepaga', 'ipross 2026'],
  },
]

export function getObraSocialBySlug(slug: string): ObraSocialData | undefined {
  return obrasSociales.find((os) => os.slug === slug)
}
