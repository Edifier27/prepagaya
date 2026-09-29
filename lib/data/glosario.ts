export type CategoriaGlosario = 'Costos' | 'Cobertura' | 'Contratación' | 'Legal' | 'Tipos'

export interface FuenteTermino {
  texto: string
  url: string
}

export interface Termino {
  /** ancla en /glosario (#slug) */
  slug: string
  termino: string
  definicion: string
  categoria: CategoriaGlosario
  ejemplo?: string
  /** Cómo aparece en los textos del sitio, para marcarlo y explicarlo en el
   *  lugar (components/glosario). Sin tildes ni mayúsculas no importa. */
  alias?: string[]
  fuente?: FuenteTermino
}

// Glosario revisado el 28-sep-2026 (Darío: "un glosario con la info bien
// pro"): cada definición sale de una norma o de la guía oficial "Ley simple:
// Medicina prepaga" de argentina.gob.ar. Se sacaron datos que no estaban
// verificados (porcentajes de aumento por edad, precios de ejemplo que
// vencen, plazos "por ley" que ninguna norma fija) y el ANSSAL, que ya no
// existe. Los alias sirven para explicar cada término la primera vez que
// aparece en una guía o ficha.

const LEY_SIMPLE: FuenteTermino = { texto: 'Ley simple: Medicina prepaga (argentina.gob.ar)', url: 'https://www.argentina.gob.ar/justicia/derechofacil/leysimple/medicina-prepaga' }
const PMO: FuenteTermino = { texto: 'PMO, Res. 201/2002, Anexo I (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/70000-74999/73649/res201-2002MS-anexoI.htm' }
const LEY_26682: FuenteTermino = { texto: 'Ley 26.682 (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' }
const DEC_1993: FuenteTermino = { texto: 'Decreto 1993/2011 (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/190000-194999/190606/texact.htm' }
const RES_310: FuenteTermino = { texto: 'Res. 310/2004 del Ministerio de Salud (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/90000-94999/94218/norma.htm' }
const LEY_24901: FuenteTermino = { texto: 'Ley 24.901 (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/45000-49999/47677/texact.htm' }

export const terminos: Termino[] = [
  // COSTOS
  {
    slug: 'cuota-mensual',
    termino: 'Cuota mensual',
    definicion: 'Lo que pagás todos los meses por tu plan. Depende del plan, de la edad de cada integrante del grupo y de si pagás como particular o derivando tus aportes, y se actualiza con los aumentos que informa cada prepaga.',
    categoria: 'Costos',
    alias: ['cuota mensual'],
  },
  {
    slug: 'copago',
    termino: 'Copago',
    definicion: 'Monto que pagás en el momento de usar una prestación (una consulta, un estudio), además de la cuota. Hay planes con copago y planes sin copago: los sin copago tienen la cuota más alta.',
    categoria: 'Costos',
    alias: ['copago', 'copagos', 'sin copago', 'con copago'],
  },
  {
    slug: 'coseguro',
    termino: 'Coseguro',
    definicion: 'Es el nombre que usa el PMO para lo que pagás vos en cada consulta o estudio: un monto fijo, no un porcentaje. Hay prestaciones exentas de todo coseguro: el embarazo, el parto y el puerperio, el bebé hasta que cumple un año, los pacientes oncológicos y los programas preventivos.',
    categoria: 'Costos',
    alias: ['coseguro', 'coseguros'],
    fuente: PMO,
  },
  {
    slug: 'cuota-diferencial',
    termino: 'Cuota diferencial',
    definicion: 'Cuota más alta que la prepaga puede cobrarte por una enfermedad preexistente que declaraste. El monto y el plazo durante el que se cobra tienen que estar autorizados por la Superintendencia de Servicios de Salud.',
    categoria: 'Costos',
    alias: ['cuota diferencial', 'cuota mayor'],
    fuente: LEY_SIMPLE,
  },
  {
    slug: 'franja-etaria',
    termino: 'Franja etaria',
    definicion: 'Rango de edad que usa la prepaga para fijar la cuota. La cuota de la última franja no puede superar el triple de la de la primera. Si tenés 10 años o más de antigüedad continua en la misma prepaga, no pueden aumentarte la cuota por cumplir 65.',
    categoria: 'Costos',
    alias: ['franja etaria', 'franjas etarias', 'rango etario', 'rangos etarios', 'aumento por edad'],
    fuente: LEY_SIMPLE,
  },
  {
    slug: 'lista-deriva',
    termino: 'Lista deriva',
    definicion: 'Lista de precios para quienes pagan la prepaga derivando sus aportes de la obra social (relación de dependencia o monotributo), distinta de la lista de precios para particulares.',
    categoria: 'Costos',
  },
  {
    slug: 'reintegro',
    termino: 'Reintegro',
    definicion: 'Devolución de una parte de lo que pagaste cuando te atendés con un profesional fuera de la cartilla. Solo lo tienen algunos planes, con topes por práctica que la prepaga actualiza.',
    categoria: 'Costos',
    alias: ['reintegro', 'reintegros'],
  },
  {
    slug: 'precio-de-referencia',
    termino: 'Precio de referencia',
    definicion: 'Valor fijo sobre el que se calcula el porcentaje de cobertura de los medicamentos del PMO: 40% en los de uso habitual y 70% en los de enfermedades crónicas que se toman de forma permanente.',
    categoria: 'Costos',
    alias: ['precio de referencia'],
    fuente: RES_310,
  },

  // COBERTURA
  {
    slug: 'pmo',
    termino: 'PMO (Programa Médico Obligatorio)',
    definicion: 'Piso de prestaciones que toda prepaga tiene que cubrir en todos sus planes, del más barato al más caro. Lo fija el Ministerio de Salud (Res. 201/2002) y lo amplían leyes especiales, como las de fertilización, diabetes o celiaquía.',
    categoria: 'Cobertura',
    alias: ['PMO', 'Programa Médico Obligatorio'],
    fuente: LEY_26682,
  },
  {
    slug: 'prestacion-superadora',
    termino: 'Prestación superadora',
    definicion: 'Todo lo que un plan cubre por encima del PMO: por ejemplo, ortodoncia, cirugía estética, habitación individual, cobertura en el exterior o reintegros. Es donde se diferencian los planes, y puede tener carencia.',
    categoria: 'Cobertura',
    alias: ['prestación superadora', 'prestaciones superadoras', 'superadora', 'superadoras'],
  },
  {
    slug: 'cartilla',
    termino: 'Cartilla médica',
    definicion: 'Lista de profesionales, sanatorios y guardias que cubre tu plan. Si el médico con el que te tratabas deja la cartilla, tenés derecho a que te siga atendiendo hasta el alta.',
    categoria: 'Cobertura',
    alias: ['cartilla', 'cartillas', 'cartilla médica'],
    fuente: LEY_SIMPLE,
  },
  {
    slug: 'red-abierta',
    termino: 'Red abierta (libre elección)',
    definicion: 'Plan que, además de la cartilla, te deja atenderte con otros profesionales y pedir reintegro de una parte de lo que pagaste. Los planes altos suelen tenerlo.',
    categoria: 'Cobertura',
    alias: ['red abierta', 'libre elección'],
  },
  {
    slug: 'red-cerrada',
    termino: 'Red cerrada',
    definicion: 'Plan en el que solo te cubren los profesionales y sanatorios de la cartilla, sin reintegros. Suelen ser los planes más económicos.',
    categoria: 'Cobertura',
    alias: ['red cerrada', 'plan cerrado', 'cartilla cerrada'],
  },
  {
    slug: 'alta-complejidad',
    termino: 'Alta complejidad',
    definicion: 'Estudios y tratamientos de mayor costo o tecnología, como la resonancia, la tomografía o una cirugía programada. Están en el PMO y la prepaga suele pedir autorización previa con la orden médica.',
    categoria: 'Cobertura',
    alias: ['alta complejidad'],
  },
  {
    slug: 'autorizacion-previa',
    termino: 'Autorización previa',
    definicion: 'Aprobación que la prepaga te pide antes de algunas prácticas (estudios de alta complejidad, cirugías, internaciones programadas). Se tramita con la orden y el informe del médico; si te la niegan, pedí la respuesta por escrito.',
    categoria: 'Cobertura',
    alias: ['autorización previa', 'autorizaciones previas', 'auditoría previa'],
  },
  {
    slug: 'auditoria-medica',
    termino: 'Auditoría médica',
    definicion: 'El equipo médico de la prepaga que revisa tu declaración jurada y tus estudios al afiliarte, y que autoriza las prácticas que lo requieren.',
    categoria: 'Cobertura',
    alias: ['auditoría médica', 'auditor médico', 'auditoría'],
  },
  {
    slug: 'internacion',
    termino: 'Internación',
    definicion: 'Por el PMO se cubre al 100% y sin límite de tiempo, en sanatorio, en hospital de día o en tu casa (internación domiciliaria), con los medicamentos incluidos. La única excepción al "sin límite" es salud mental, que tiene su propio tope.',
    categoria: 'Cobertura',
    alias: ['internación', 'internaciones', 'internación domiciliaria'],
    fuente: PMO,
  },
  {
    slug: 'plan-materno-infantil',
    termino: 'Plan Materno Infantil',
    definicion: 'Parte del PMO que cubre al 100% y sin coseguros el embarazo (desde el diagnóstico), el parto y el primer mes después, y al bebé hasta que cumple un año.',
    categoria: 'Cobertura',
    alias: ['plan materno infantil', 'materno infantil'],
    fuente: PMO,
  },
  {
    slug: 'urgencia-emergencia',
    termino: 'Urgencia y emergencia',
    definicion: 'Urgencia es, por ejemplo, un accidente o una complicación del embarazo; emergencia, una situación en la que corre riesgo tu vida o puede haber lesiones irreparables. Tenés derecho a que te atiendan aunque haya dudas sobre si tu plan lo cubre.',
    categoria: 'Cobertura',
    alias: ['emergencia', 'emergencias', 'urgencia', 'urgencias'],
    fuente: LEY_SIMPLE,
  },
  {
    slug: 'cobertura-ambulatoria',
    termino: 'Cobertura ambulatoria',
    definicion: 'Lo que recibís sin internarte: consultas, estudios, kinesiología, vacunas y medicamentos de farmacia.',
    categoria: 'Cobertura',
    alias: ['ambulatoria', 'ambulatorio', 'ambulatorios'],
  },

  // CONTRATACIÓN
  {
    slug: 'carencia',
    termino: 'Carencia',
    definicion: 'Plazo de espera desde que te afiliás para usar una prestación superadora. No puede aplicarse a nada del PMO, el contrato tiene que decir a qué prestaciones alcanza y nunca puede superar los 12 meses desde la firma.',
    categoria: 'Contratación',
    ejemplo: 'La cirugía estética de un plan alto, que se habilita recién a los meses de afiliarte.',
    alias: ['carencia', 'carencias', 'período de carencia', 'periodo de carencia'],
    fuente: DEC_1993,
  },
  {
    slug: 'preexistencia',
    termino: 'Preexistencia',
    definicion: 'Enfermedad o condición que ya tenías antes de afiliarte. Se informa en la declaración jurada de salud y no puede ser motivo de rechazo; la prepaga puede cobrar una cuota diferencial autorizada por la SSSalud.',
    categoria: 'Contratación',
    alias: ['preexistencia', 'preexistencias', 'preexistente', 'preexistentes'],
    fuente: LEY_26682,
  },
  {
    slug: 'declaracion-jurada',
    termino: 'Declaración jurada de salud',
    definicion: 'Formulario que completás al afiliarte sobre tu historia médica y la de tu grupo. Hay que responder con la verdad: si después se descubre un dato falso, la prepaga puede terminar el contrato.',
    categoria: 'Contratación',
    alias: ['declaración jurada', 'declaraciones juradas', 'DDJJ'],
    fuente: LEY_SIMPLE,
  },
  {
    slug: 'derivacion-de-aportes',
    termino: 'Derivación de aportes',
    definicion: 'Usar los aportes de tu obra social (de tu sueldo o del monotributo) para pagar una prepaga, a través de una obra social que tenga convenio con ella. Pagás solo la diferencia entre la cuota y tus aportes.',
    categoria: 'Contratación',
    alias: ['derivación de aportes', 'derivar aportes', 'derivar tus aportes', 'derivás tus aportes', 'derivando tus aportes', 'derivan sus aportes'],
  },
  {
    slug: 'grupo-familiar',
    termino: 'Grupo familiar',
    definicion: 'Quienes podés sumar a tu plan: tu cónyuge o conviviente, tus hijos solteros hasta los 21 (hasta los 25 si estudian y están a tu cargo, y sin límite si tienen una discapacidad y están a tu cargo), los hijos de tu cónyuge y los menores bajo tu guarda o tutela.',
    categoria: 'Contratación',
    alias: ['grupo familiar'],
    fuente: LEY_SIMPLE,
  },
  {
    slug: 'baja',
    termino: 'Baja de la prepaga',
    definicion: 'Podés darte de baja en cualquier momento, avisando con 30 días de anticipación, una vez por año, sin multas ni cargos y sin que te exijan pagar lo adeudado. La prepaga solo puede terminar el contrato por 3 cuotas impagas consecutivas (intimándote antes) o por falsedad en la declaración jurada.',
    categoria: 'Contratación',
    alias: ['darte de baja', 'darse de baja', 'dar de baja', 'rescisión', 'rescindir'],
    fuente: LEY_SIMPLE,
  },
  {
    slug: 'monotributista',
    termino: 'Monotributista',
    definicion: 'Quien está en el Monotributo paga una obra social dentro de su cuota mensual, y puede derivar ese aporte a una prepaga o contratar una de forma particular.',
    categoria: 'Contratación',
    alias: ['monotributista', 'monotributistas', 'monotributo'],
  },
  {
    slug: 'doble-cobertura',
    termino: 'Doble cobertura (dos prepagas a la vez)',
    definicion: 'Sí se puede: contratar una prepaga es un contrato privado entre vos y la empresa, así que podés tener más de una al mismo tiempo (por ejemplo, una por tu trabajo y otra particular) y usar la que más te convenga en cada caso. Lo que no se puede es estar afiliado a dos obras sociales a la vez: ahí tus aportes van a una sola, la que te corresponde por tu empleo (con opción de cambio una vez al año).',
    categoria: 'Contratación',
    alias: ['doble cobertura', 'dos prepagas', 'tener dos prepagas', 'dos prepagas al mismo tiempo'],
  },

  // LEGAL
  {
    slug: 'ley-26682',
    termino: 'Ley 26.682',
    definicion: 'Marco regulatorio de la medicina prepaga (2011). Obliga a cubrir el PMO en todos los planes, prohíbe rechazar a alguien por preexistencias o por edad y fija las reglas de carencias, bajas y aumentos por edad.',
    categoria: 'Legal',
    alias: ['Ley 26.682', 'Ley 26682'],
    fuente: LEY_26682,
  },
  {
    slug: 'sssalud',
    termino: 'SSSalud (Superintendencia de Servicios de Salud)',
    definicion: 'Organismo del Estado que controla a las prepagas y obras sociales y recibe los reclamos de los afiliados, gratis, en el 0800-222-72583 o en sssalud.gob.ar.',
    categoria: 'Legal',
    alias: ['SSSalud', 'Superintendencia de Servicios de Salud', 'SSS', 'Superintendencia'],
  },
  {
    slug: 'cud',
    termino: 'CUD (Certificado Único de Discapacidad)',
    definicion: 'Certificado que acredita una discapacidad. Con él rige la cobertura total de las prestaciones básicas de la Ley 24.901, que las prepagas también tienen que dar.',
    categoria: 'Legal',
    alias: ['CUD', 'Certificado Único de Discapacidad'],
    fuente: LEY_24901,
  },

  // TIPOS
  {
    slug: 'prepaga',
    termino: 'Prepaga',
    definicion: 'Empresa de medicina prepaga inscripta en el registro de la SSSalud. Te afiliás de forma voluntaria y pagás una cuota (como particular o derivando tus aportes).',
    categoria: 'Tipos',
  },
  {
    slug: 'obra-social',
    termino: 'Obra social',
    definicion: 'Cobertura de salud de los trabajadores en relación de dependencia, financiada con aportes del empleado (3% del sueldo) y contribuciones del empleador (6%).',
    categoria: 'Tipos',
  },
  {
    slug: 'plan-parcial',
    termino: 'Plan parcial',
    definicion: 'Plan que no cubre todo el PMO. Solo puede ofrecerse en servicios odontológicos, en emergencias y traslados, o en prepagas de una sola localidad con menos de 5.000 afiliados, y no se puede pagar con aportes.',
    categoria: 'Tipos',
    alias: ['plan parcial', 'planes parciales', 'cobertura parcial'],
    fuente: LEY_SIMPLE,
  },
  {
    slug: 'pami',
    termino: 'PAMI',
    definicion: 'Obra social de jubilados y pensionados del sistema nacional.',
    categoria: 'Tipos',
    alias: ['PAMI'],
  },
  {
    slug: 'ioma',
    termino: 'IOMA',
    definicion: 'Instituto de Obra Médico Asistencial: la obra social de los empleados públicos de la provincia de Buenos Aires y sus familias.',
    categoria: 'Tipos',
    alias: ['IOMA'],
  },
]

export const categoriasGlosario: CategoriaGlosario[] = ['Costos', 'Cobertura', 'Contratación', 'Legal', 'Tipos']

export function terminoPorSlug(slug: string): Termino | undefined {
  return terminos.find((t) => t.slug === slug)
}
