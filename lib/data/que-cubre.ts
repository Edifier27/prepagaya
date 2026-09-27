import { MONTO_CELIAQUIA } from './monto-celiaquia'

// Buscador "¿Qué me cubre la prepaga?" (27-sep-2026, pedido de Darío: una
// herramienta de búsqueda útil para todo el mundo de prepagas y salud).
// Escribís una práctica, un tratamiento o un estudio y te dice si es
// obligatorio por ley, con qué porcentaje o límite, y la norma oficial.
//
// Todo sale de textos oficiales leídos en Infoleg por la Action de fuentes
// (scripts/fuentes/leer.py, pasadas 9 a 12): el PMO (Res. 201/2002 del
// Ministerio de Salud, Anexo I) con los cambios de la Res. 310/2004, la Ley
// 26.682 (art. 7: las prepagas cubren como mínimo el PMO y la Ley 24.901), la
// Ley 24.754 (las prepagas cubren las prestaciones obligatorias de las obras
// sociales) y las leyes especiales. Lo que no está en ninguna norma se marca
// "Depende del plan" y, cuando hay datos oficiales de las prepagas
// (coberturas-marca.ts), se muestra qué planes lo incluyen.
//
// Regla: nada de "sin límite" ni porcentajes que no estén en la norma. Los
// montos del PMO para coseguros son de 2002 y no se publican.

export const QUE_CUBRE_FECHA = '2026-09-27'

export type NivelCobertura = 'cien' | 'si' | 'parcial' | 'plan'

export const NIVEL_COBERTURA: Record<NivelCobertura, { texto: string; clase: string }> = {
  cien: { texto: 'Obligatorio al 100%', clase: 'bg-green-50 text-green-800 border-green-200' },
  si: { texto: 'Obligatorio', clase: 'bg-teal-50 text-teal-800 border-teal-200' },
  parcial: { texto: 'Obligatorio, con porcentaje o límite', clase: 'bg-sky-50 text-sky-800 border-sky-200' },
  plan: { texto: 'Depende del plan', clase: 'bg-amber-50 text-amber-900 border-amber-200' },
}

const INFOLEG = 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/'

export const NORMAS = {
  pmo: { nombre: 'PMO (Res. 201/2002, Anexo I)', url: `${INFOLEG}70000-74999/73649/res201-2002MS-anexoI.htm` },
  res310: { nombre: 'Resolución 310/2004 del Ministerio de Salud', url: `${INFOLEG}90000-94999/94218/norma.htm` },
  ley26682: { nombre: 'Ley 26.682', url: `${INFOLEG}180000-184999/182180/texact.htm` },
  dec1993: { nombre: 'Decreto 1993/2011', url: `${INFOLEG}190000-194999/190606/texact.htm` },
  ley24754: { nombre: 'Ley 24.754', url: `${INFOLEG}40000-44999/41166/norma.htm` },
  ley24455: { nombre: 'Ley 24.455', url: `${INFOLEG}10000-14999/14919/norma.htm` },
  ley24901: { nombre: 'Ley 24.901', url: `${INFOLEG}45000-49999/47677/texact.htm` },
  ley26657: { nombre: 'Ley 26.657 (Salud Mental)', url: `${INFOLEG}175000-179999/175977/norma.htm` },
  dec603: { nombre: 'Decreto 603/2013', url: `${INFOLEG}215000-219999/215485/texact.htm` },
  ley26862: { nombre: 'Ley 26.862', url: `${INFOLEG}215000-219999/216700/norma.htm` },
  dec956: { nombre: 'Decreto 956/2013', url: `${INFOLEG}215000-219999/217628/norma.htm` },
  ley26130: { nombre: 'Ley 26.130', url: `${INFOLEG}115000-119999/119260/texact.htm` },
  ley25673: { nombre: 'Ley 25.673', url: `${INFOLEG}75000-79999/79831/texact.htm` },
  ley27610: { nombre: 'Ley 27.610', url: `${INFOLEG}345000-349999/346231/norma.htm` },
  ley26743: { nombre: 'Ley 26.743', url: `${INFOLEG}195000-199999/197860/texact.htm` },
  ley25929: { nombre: 'Ley 25.929 (Parto Respetado)', url: `${INFOLEG}95000-99999/98805/norma.htm` },
  ley26279: { nombre: 'Ley 26.279', url: `${INFOLEG}130000-134999/131902/norma.htm` },
  ley25415: { nombre: 'Ley 25.415', url: `${INFOLEG}65000-69999/66860/norma.htm` },
  ley27305: { nombre: 'Ley 27.305', url: `${INFOLEG}265000-269999/267397/norma.htm` },
  ley27491: { nombre: 'Ley 27.491 (Vacunación)', url: `${INFOLEG}315000-319999/318455/norma.htm` },
  ley23753: { nombre: 'Ley 23.753', url: `${INFOLEG}0-4999/154/texact.htm` },
  ley26588: { nombre: 'Ley 26.588', url: `${INFOLEG}160000-164999/162428/texact.htm` },
  ley26396: { nombre: 'Ley 26.396', url: `${INFOLEG}140000-144999/144033/norma.htm` },
  ley27043: { nombre: 'Ley 27.043', url: `${INFOLEG}240000-244999/240452/norma.htm` },
  ley27552: { nombre: 'Ley 27.552', url: `${INFOLEG}340000-344999/340915/norma.htm` },
  ley27674: { nombre: 'Ley 27.674', url: `${INFOLEG}365000-369999/368128/texact.htm` },
  ley27675: { nombre: 'Ley 27.675', url: `${INFOLEG}365000-369999/368130/norma.htm` },
  ley27447: { nombre: 'Ley 27.447 (Trasplantes)', url: `${INFOLEG}310000-314999/312715/norma.htm` },
  ley26872: { nombre: 'Ley 26.872', url: `${INFOLEG}215000-219999/218211/norma.htm` },
} as const

export type ClaveNorma = keyof typeof NORMAS

export interface CategoriaCobertura {
  slug: string
  nombre: string
}

export const CATEGORIAS_COBERTURA: CategoriaCobertura[] = [
  { slug: 'consultas', nombre: 'Consultas, estudios y guardia' },
  { slug: 'internacion', nombre: 'Internación y cirugías' },
  { slug: 'embarazo', nombre: 'Embarazo, parto y bebés' },
  { slug: 'salud-sexual', nombre: 'Salud sexual y reproductiva' },
  { slug: 'medicamentos', nombre: 'Medicamentos' },
  { slug: 'salud-mental', nombre: 'Salud mental y rehabilitación' },
  { slug: 'enfermedades', nombre: 'Enfermedades y tratamientos' },
  { slug: 'odontologia', nombre: 'Odontología' },
  { slug: 'ojos-oidos', nombre: 'Ojos, oídos y prótesis' },
  { slug: 'otros', nombre: 'Viajes y reintegros' },
]

export interface PrestacionCobertura {
  slug: string
  nombre: string
  categoria: string
  /** Cómo lo busca la gente (sin tildes hace falta: se normaliza) */
  sinonimos: string[]
  nivel: NivelCobertura
  /** La respuesta, en 1 a 3 frases, solo con lo que dice la norma */
  respuesta: string
  /** Dónde lo dice: norma y artículo o punto */
  normas: { norma: ClaveNorma; donde?: string }[]
  /** Un dato más: condiciones, excepciones o qué mirar */
  nota?: string
  /** Tema de coberturas-marca.ts: se muestra qué incluye cada plan */
  temaMarca?: string
  enlace?: { href: string; texto: string }
}

export const prestacionesCobertura: PrestacionCobertura[] = [
  // ── Consultas, estudios y guardia
  {
    slug: 'consultas',
    nombre: 'Consultas con médicos y especialistas',
    categoria: 'consultas',
    sinonimos: ['consulta', 'medico', 'medica', 'especialista', 'clinico', 'medico de cabecera', 'medico de familia', 'pediatra', 'ginecologo', 'ginecologa', 'cardiologo', 'dermatologo', 'traumatologo', 'oftalmologo', 'otorrino', 'urologo', 'endocrinologo', 'neurologo', 'reumatologo', 'gastroenterologo', 'neumonologo', 'geriatra', 'nutricion', 'turno'],
    nivel: 'si',
    respuesta: 'Sí. El PMO obliga a cubrir la consulta en consultorio y en internación de todas las especialidades reconocidas: clínica médica, medicina familiar, pediatría, ginecología, cardiología, dermatología, traumatología, oftalmología, otorrinolaringología, urología, psiquiatría, nutrición y el resto de la lista oficial. Según el plan, puede haber un copago por consulta.',
    normas: [{ norma: 'pmo', donde: 'puntos 2.1 y 2.2' }],
  },
  {
    slug: 'estudios',
    nombre: 'Análisis y estudios',
    categoria: 'consultas',
    sinonimos: ['analisis', 'laboratorio', 'analisis de sangre', 'orina', 'estudios', 'radiografia', 'placa', 'rayos', 'ecografia', 'eco', 'ecodoppler', 'biopsia', 'anatomia patologica'],
    nivel: 'si',
    respuesta: 'Sí. El PMO incluye las prácticas diagnósticas y terapéuticas de su Anexo II, con el material descartable y los medios de contraste como parte de la prestación. El diagnóstico por imágenes (radiología, ecografía, tomografía y resonancia) está en la lista de especialidades obligatorias. Según el plan, puede haber copago.',
    normas: [{ norma: 'pmo', donde: 'puntos 2.1 y 2.3' }],
  },
  {
    slug: 'resonancia-tomografia',
    nombre: 'Resonancia magnética y tomografía',
    categoria: 'consultas',
    sinonimos: ['resonancia', 'resonancia magnetica', 'rmn', 'tomografia', 'tomografia computada', 'tac', 'medicina nuclear', 'centellograma', 'alta complejidad'],
    nivel: 'si',
    respuesta: 'Sí. El diagnóstico por imágenes del PMO incluye la tomografía computada y la resonancia magnética, además de la radiología y la ecografía. Son estudios que la prepaga suele autorizar antes: se piden con la orden de tu médico.',
    normas: [{ norma: 'pmo', donde: 'punto 2.1' }],
    enlace: { href: '/guias/como-pedir-autorizacion-prepaga', texto: 'Cómo pedir una autorización' },
  },
  {
    slug: 'chequeos-preventivos',
    nombre: 'Chequeos y controles preventivos',
    categoria: 'consultas',
    sinonimos: ['chequeo', 'chequeo anual', 'control anual', 'prevencion', 'preventivo', 'papanicolau', 'pap', 'mamografia', 'colposcopia', 'control ginecologico'],
    nivel: 'si',
    respuesta: 'Sí. El PMO se basa en la atención primaria y la prevención: incluye programas de prevención, en especial del cáncer de mama y de cuello uterino, y los programas preventivos están exceptuados de todo tipo de coseguros.',
    normas: [{ norma: 'pmo', donde: 'puntos 1.1, 1.1.3 y 9.2' }],
  },
  {
    slug: 'guardia-urgencias',
    nombre: 'Guardia, urgencias y emergencias',
    categoria: 'consultas',
    sinonimos: ['guardia', 'urgencia', 'urgencias', 'emergencia', 'emergencias', 'accidente', 'emergencia medica'],
    nivel: 'si',
    respuesta: 'Sí. El PMO asegura la consulta de urgencia y emergencia, también en tu domicilio, y los traslados son parte de la prestación que se realiza.',
    normas: [{ norma: 'pmo', donde: 'puntos 2.2 y 8.3.4' }],
    enlace: { href: '/guias/urgencias-guardia-prepaga', texto: 'Guardia y urgencias con prepaga' },
  },
  {
    slug: 'medico-a-domicilio',
    nombre: 'Médico a domicilio',
    categoria: 'consultas',
    sinonimos: ['medico a domicilio', 'visita domiciliaria', 'domicilio', 'atencion en casa', 'medico en casa'],
    nivel: 'si',
    respuesta: 'La urgencia y la emergencia en domicilio están aseguradas. La consulta programada en tu casa es obligatoria para mayores de 65 años que no pueden movilizarse (con coseguro); para el resto de las edades, queda a criterio de la auditoría de la prepaga.',
    normas: [{ norma: 'pmo', donde: 'punto 2.2' }],
  },
  {
    slug: 'ambulancia-traslados',
    nombre: 'Ambulancia y traslados',
    categoria: 'consultas',
    sinonimos: ['ambulancia', 'traslado', 'traslados', 'traslado en ambulancia', 'unidad coronaria movil'],
    nivel: 'si',
    respuesta: 'Sí. Para el PMO, los traslados son parte de la prestación que se realiza, y la auditoría médica de la prepaga puede autorizar otros traslados según la necesidad de cada persona.',
    normas: [{ norma: 'pmo', donde: 'punto 8.3.4' }],
  },
  {
    slug: 'vacunas',
    nombre: 'Vacunas',
    categoria: 'consultas',
    sinonimos: ['vacuna', 'vacunas', 'vacunacion', 'vacunatorio', 'calendario de vacunacion', 'antigripal', 'hpv', 'vph'],
    nivel: 'si',
    respuesta: 'Las del Calendario Nacional de Vacunación que compra el Estado se aplican gratis en cualquier vacunatorio que las ponga, público o privado. Para el bebé, el PMO incluye las vacunas del primer año. Las que no están en el calendario dependen del plan.',
    normas: [{ norma: 'ley27491' }, { norma: 'pmo', donde: 'punto 1.1.2' }],
  },

  // ── Internación y cirugías
  {
    slug: 'internacion',
    nombre: 'Internación',
    categoria: 'internacion',
    sinonimos: ['internacion', 'internado', 'internada', 'internar', 'sanatorio', 'clinica', 'hospital de dia', 'internacion domiciliaria', 'terapia intensiva', 'uti', 'habitacion individual', 'habitacion compartida'],
    nivel: 'cien',
    respuesta: 'Sí, al 100% y sin límite de tiempo, en cualquier modalidad: en sanatorio, en hospital de día o internación domiciliaria, con todas las prácticas incluidas y los medicamentos también al 100%. La única excepción al "sin límite" es salud mental, que tiene su propio tope. El tipo de habitación (individual o compartida) depende del plan.',
    normas: [{ norma: 'pmo', donde: 'puntos 3 y 7.2' }],
    temaMarca: 'internacion',
  },
  {
    slug: 'cirugias',
    nombre: 'Cirugías',
    categoria: 'internacion',
    sinonimos: ['cirugia', 'cirugias', 'operacion', 'operarme', 'operar', 'intervencion quirurgica', 'quirofano', 'hernia', 'vesicula', 'apendicitis', 'cataratas', 'artroscopia'],
    nivel: 'si',
    respuesta: 'Sí. Las cirugías con indicación médica están dentro del PMO: cirugía general, cardiovascular, de cabeza y cuello, de tórax, infantil, plástica reparadora, traumatología, urología y el resto de las especialidades reconocidas. Si requieren internación, se cubren al 100%, igual que las prótesis que quedan colocadas dentro del cuerpo.',
    normas: [{ norma: 'pmo', donde: 'puntos 2.1, 3 y 8.3.3' }],
  },
  {
    slug: 'cirugia-estetica',
    nombre: 'Cirugía estética',
    categoria: 'internacion',
    sinonimos: ['cirugia estetica', 'estetica', 'lipoaspiracion', 'lipo', 'rinoplastia', 'nariz', 'implantes mamarios', 'aumento mamario', 'lolas', 'abdominoplastia', 'blefaroplastia', 'cirugia plastica', 'lipoescultura'],
    nivel: 'plan',
    respuesta: 'La estética, sin indicación médica, no está en el PMO: depende del plan, y solo la incluyen algunos planes altos. La cirugía plástica reparadora sí está en el PMO, y la reconstrucción mamaria después de una mastectomía es obligatoria en cualquier plan, con las prótesis.',
    normas: [{ norma: 'pmo', donde: 'punto 2.1' }, { norma: 'ley26872' }],
    nota: 'Como es una prestación superadora, puede tener carencia: el máximo legal es de 12 meses desde que empieza el contrato (Decreto 1993/2011, art. 10).',
    temaMarca: 'cirugia-estetica',
    enlace: { href: '/coberturas/cirugia-estetica', texto: 'Cirugía estética: qué planes la cubren' },
  },
  {
    slug: 'reconstruccion-mamaria',
    nombre: 'Reconstrucción mamaria después de una mastectomía',
    categoria: 'internacion',
    sinonimos: ['reconstruccion mamaria', 'mastectomia', 'protesis mamaria', 'reconstruccion de mama', 'cirugia reconstructiva'],
    nivel: 'si',
    respuesta: 'Sí, en cualquier plan: la Ley 26.872 obliga a las obras sociales y a las prepagas a cubrir la cirugía reconstructiva después de una mastectomía, así como la provisión de las prótesis necesarias. No depende de que el plan tenga cirugía estética.',
    normas: [{ norma: 'ley26872' }],
    enlace: { href: '/coberturas/cirugia-estetica', texto: 'Estética y reconstructiva: la diferencia' },
  },
  {
    slug: 'obesidad-cirugia-bariatrica',
    nombre: 'Obesidad, cirugía bariátrica y trastornos alimentarios',
    categoria: 'internacion',
    sinonimos: ['obesidad', 'cirugia bariatrica', 'bariatrica', 'bypass gastrico', 'bypass', 'manga gastrica', 'balon gastrico', 'bulimia', 'anorexia', 'trastornos alimentarios', 'sobrepeso'],
    nivel: 'si',
    respuesta: 'Sí. La Ley 26.396 incorporó al PMO el tratamiento integral de los trastornos alimentarios, entre los que cuenta la obesidad, la bulimia y la anorexia: incluye los tratamientos nutricionales, psicológicos, clínicos, quirúrgicos y farmacológicos, según las especificaciones de la autoridad sanitaria.',
    normas: [{ norma: 'ley26396', donde: 'arts. 2, 15 y 16' }],
    enlace: { href: '/coberturas/cirugia-bariatrica', texto: 'Cirugía bariátrica y prepagas' },
  },
  {
    slug: 'trasplantes',
    nombre: 'Trasplantes',
    categoria: 'internacion',
    sinonimos: ['trasplante', 'trasplantes', 'transplante', 'incucai', 'trasplante renal', 'trasplante de medula', 'trasplante hepatico', 'donante'],
    nivel: 'si',
    respuesta: 'Sí. La Ley de Trasplantes reconoce el derecho a la cobertura integral del tratamiento y del seguimiento posterior, y pone los gastos de la ablación, el implante y los tratamientos posteriores a cargo de la cobertura de salud de quien recibe el trasplante, nunca del donante.',
    normas: [{ norma: 'ley27447', donde: 'arts. 4 y 28' }],
  },
  {
    slug: 'cuidados-paliativos',
    nombre: 'Cuidados paliativos',
    categoria: 'internacion',
    sinonimos: ['cuidados paliativos', 'paliativos', 'enfermo terminal', 'tratamiento del dolor'],
    nivel: 'cien',
    respuesta: 'Sí, al 100%. El PMO define el cuidado paliativo como la asistencia activa y total de un equipo multidisciplinario cuando la enfermedad no responde al tratamiento curativo, para aliviar el dolor, los síntomas y el aspecto psicosocial.',
    normas: [{ norma: 'pmo', donde: 'punto 8.1' }],
  },

  // ── Embarazo, parto y bebés
  {
    slug: 'embarazo-parto',
    nombre: 'Embarazo y parto',
    categoria: 'embarazo',
    sinonimos: ['embarazo', 'embarazada', 'parto', 'cesarea', 'maternidad', 'obstetra', 'obstetricia', 'controles prenatales', 'ecografia del embarazo', 'puerperio', 'parto respetado', 'acompanante en el parto', 'psicoprofilaxis'],
    nivel: 'cien',
    respuesta: 'Sí, al 100% y sin coseguros, desde el diagnóstico del embarazo hasta el primer mes después del parto: consultas, estudios del embarazo, psicoprofilaxis, el parto y los medicamentos relacionados. La Ley de Parto Respetado, que también es parte del PMO, suma derechos como estar acompañada por una persona de tu elección y la internación conjunta con tu bebé.',
    normas: [{ norma: 'pmo', donde: 'puntos 1.1.1, 1.1.2 y 9.2' }, { norma: 'ley25929', donde: 'arts. 1 a 3' }],
    nota: 'Si todavía no te afiliaste: el embarazo en curso se declara en la declaración jurada de salud y cada prepaga lo evalúa al ingreso.',
    enlace: { href: '/coberturas/maternidad', texto: 'Maternidad: qué prepaga conviene' },
  },
  {
    slug: 'recien-nacido',
    nombre: 'Bebé recién nacido (primer año)',
    categoria: 'embarazo',
    sinonimos: ['recien nacido', 'bebe', 'neonatologia', 'neonato', 'primer ano', 'afiliar al bebe', 'pediatra del bebe'],
    nivel: 'cien',
    respuesta: 'Sí, al 100% hasta que cumple un año, en internación y en consultorio, sin coseguros: consultas de seguimiento y control, vacunas del período, la medicación del primer año que figure en el listado de medicamentos esenciales y los estudios de pesquisa neonatal.',
    normas: [{ norma: 'pmo', donde: 'puntos 1.1.2 y 9.2' }],
    enlace: { href: '/guias/afiliar-recien-nacido-prepaga', texto: 'Cómo afiliar a tu bebé' },
  },
  {
    slug: 'pesquisa-neonatal',
    nombre: 'Test del piecito (pesquisa neonatal)',
    categoria: 'embarazo',
    sinonimos: ['test del piecito', 'prueba del talon', 'pesquisa neonatal', 'fenilcetonuria', 'hipotiroidismo congenito', 'galactosemia'],
    nivel: 'si',
    respuesta: 'Sí. La Ley 26.279 obliga a detectar y tratar en todo recién nacido la fenilcetonuria, el hipotiroidismo neonatal, la fibrosis quística, la galactosemia, la hiperplasia suprarrenal congénita, la deficiencia de biotinidasa, la retinopatía del prematuro, el chagas y la sífilis, y las prepagas tienen que incorporarlo como prestación obligatoria, con los tratamientos.',
    normas: [{ norma: 'ley26279', donde: 'arts. 1 y 3' }],
  },
  {
    slug: 'leche-medicamentosa',
    nombre: 'Leche medicamentosa y leche de fórmula',
    categoria: 'embarazo',
    sinonimos: ['leche medicamentosa', 'aplv', 'alergia a la leche', 'alergia a la proteina de la leche', 'leche especial', 'leche de formula', 'leche maternizada', 'formula infantil'],
    nivel: 'si',
    respuesta: 'La leche medicamentosa, sí: cobertura integral para quienes tienen alergia a la proteína de la leche de vaca (APLV), trastornos gastrointestinales o enfermedades metabólicas, sin límite de edad y con la receta del médico especialista. La leche de fórmula común no está en el PMO, salvo expresa indicación médica y con evaluación de la auditoría.',
    normas: [{ norma: 'ley27305', donde: 'arts. 1 y 2' }, { norma: 'pmo', donde: 'punto 1.1.2 c' }],
  },

  // ── Salud sexual y reproductiva
  {
    slug: 'anticonceptivos',
    nombre: 'Anticonceptivos',
    categoria: 'salud-sexual',
    sinonimos: ['anticonceptivos', 'anticonceptivo', 'pastillas anticonceptivas', 'pastillas', 'diu', 'implante subdermico', 'anillo vaginal', 'parche anticonceptivo', 'preservativos', 'metodos anticonceptivos'],
    nivel: 'si',
    respuesta: 'Sí. La Ley de Salud Sexual incluyó en el PMO los métodos anticonceptivos reversibles, no abortivos y transitorios, que las prepagas tienen que dar a pedido y en igualdad de condiciones con sus otras prestaciones. El programa es sin coseguro para quien lo usa.',
    normas: [{ norma: 'ley25673', donde: 'arts. 6 y 7' }, { norma: 'res310', donde: 'art. 1' }],
    nota: 'Las instituciones de carácter confesional pueden exceptuarse de dar los anticonceptivos por sus convicciones (Ley 25.673, art. 10).',
    temaMarca: 'anticonceptivos',
  },
  {
    slug: 'vasectomia-ligadura',
    nombre: 'Vasectomía y ligadura de trompas',
    categoria: 'salud-sexual',
    sinonimos: ['vasectomia', 'ligadura de trompas', 'ligadura tubaria', 'ligadura', 'esterilizacion', 'contracepcion quirurgica'],
    nivel: 'cien',
    respuesta: 'Sí, y totalmente gratis: la Ley 26.130 obliga a las prepagas a incorporar la ligadura de trompas y la vasectomía a su cobertura sin costo para quien la pide. Alcanza con ser mayor de edad y dar el consentimiento informado: no hace falta el consentimiento de la pareja ni una autorización judicial.',
    normas: [{ norma: 'ley26130', donde: 'arts. 1, 2 y 5' }],
    enlace: { href: '/guias/prepaga-cubre-vasectomia-ligadura-cirugia-bariatrica', texto: 'Vasectomía y ligadura: cómo pedirlas' },
  },
  {
    slug: 'fertilizacion',
    nombre: 'Fertilización asistida',
    categoria: 'salud-sexual',
    sinonimos: ['fertilizacion', 'fertilizacion asistida', 'fertilidad', 'infertilidad', 'in vitro', 'fiv', 'fecundacion in vitro', 'icsi', 'inseminacion', 'inseminacion artificial', 'reproduccion asistida', 'ovodonacion', 'tratamiento de fertilidad'],
    nivel: 'parcial',
    respuesta: 'Sí. La Ley 26.862 obliga a cubrir de forma integral la reproducción médicamente asistida a toda persona mayor de edad: diagnóstico, medicamentos, terapias de apoyo y técnicas de baja y alta complejidad. El límite: hasta 4 tratamientos de baja complejidad por año y hasta 3 de alta complejidad, con al menos 3 meses entre uno y otro. Antes de la alta complejidad van como mínimo 3 intentos de baja, salvo una causa médica documentada.',
    normas: [{ norma: 'ley26862', donde: 'arts. 7 y 8' }, { norma: 'dec956', donde: 'art. 8' }],
    nota: 'La infertilidad no cuenta como preexistencia al afiliarte (Decreto 956/2013, art. 8).',
    enlace: { href: '/coberturas/fertilidad', texto: 'Fertilidad: qué prepaga conviene' },
  },
  {
    slug: 'ive',
    nombre: 'Interrupción voluntaria del embarazo',
    categoria: 'salud-sexual',
    sinonimos: ['ive', 'ile', 'aborto', 'interrupcion del embarazo', 'interrupcion voluntaria'],
    nivel: 'cien',
    respuesta: 'Sí. La Ley 27.610 obliga a las prepagas a dar cobertura integral y gratuita de la interrupción voluntaria del embarazo, incluida en el PMO con cobertura total, junto con el diagnóstico, los medicamentos y las terapias de apoyo.',
    normas: [{ norma: 'ley27610', donde: 'art. 12' }],
  },
  {
    slug: 'identidad-de-genero',
    nombre: 'Tratamientos por identidad de género',
    categoria: 'salud-sexual',
    sinonimos: ['identidad de genero', 'tratamiento hormonal', 'hormonizacion', 'cirugia de reasignacion', 'reasignacion de sexo', 'trans'],
    nivel: 'si',
    respuesta: 'Sí, para mayores de 18 años: las intervenciones quirúrgicas totales y parciales y los tratamientos hormonales integrales para adecuar el cuerpo a la identidad de género autopercibida están incluidos en el PMO, sin autorización judicial ni administrativa. Desde el Decreto 62/2025, los menores de 18 no pueden acceder a esas intervenciones y tratamientos.',
    normas: [{ norma: 'ley26743', donde: 'art. 11' }],
  },
  {
    slug: 'vih-hepatitis-its',
    nombre: 'VIH, hepatitis virales, ITS y tuberculosis',
    categoria: 'salud-sexual',
    sinonimos: ['vih', 'hiv', 'sida', 'hepatitis', 'hepatitis c', 'hepatitis b', 'its', 'ets', 'sifilis', 'tuberculosis', 'tbc', 'prep', 'profilaxis', 'test de vih', 'antirretrovirales'],
    nivel: 'cien',
    respuesta: 'Sí, gratis. La Ley 27.675 obliga a las prepagas a brindar asistencia integral, universal y gratuita a las personas expuestas o afectadas por el VIH, las hepatitis virales, otras infecciones de transmisión sexual y la tuberculosis, incluidas las herramientas de prevención combinada.',
    normas: [{ norma: 'ley27675', donde: 'art. 3' }],
  },

  // ── Medicamentos
  {
    slug: 'medicamentos',
    nombre: 'Medicamentos en farmacia',
    categoria: 'medicamentos',
    sinonimos: ['medicamentos', 'medicamento', 'remedios', 'farmacia', 'receta', 'descuento en farmacia', 'vademecum', 'genericos', 'pastillas'],
    nivel: 'parcial',
    respuesta: 'El PMO fija un piso: 40% en los medicamentos ambulatorios de su formulario y 70% en los de enfermedades crónicas que se toman de forma permanente, sobre un precio de referencia; 100% durante la internación y 100% en los oncológicos según protocolo. Los de venta libre no están incluidos. Algunos planes mejoran esos porcentajes.',
    normas: [{ norma: 'pmo', donde: 'punto 7 y Anexo III' }, { norma: 'res310', donde: 'art. 2' }],
    nota: 'Los médicos tienen que recetar por nombre genérico, y la cobertura se calcula sobre el precio de referencia.',
    temaMarca: 'medicamentos',
    enlace: { href: '/coberturas/medicamentos', texto: 'Medicamentos: cuánto cubre cada prepaga' },
  },
  {
    slug: 'enfermedades-cronicas',
    nombre: 'Enfermedades crónicas (hipertensión, colesterol y otras)',
    categoria: 'medicamentos',
    sinonimos: ['hipertension', 'presion alta', 'colesterol', 'cronico', 'cronica', 'enfermedad cronica', 'tiroides', 'hipotiroidismo', 'asma', 'epilepsia', 'medicacion cronica'],
    nivel: 'parcial',
    respuesta: 'Las consultas y los estudios de control entran en el PMO como cualquier otra prestación. En farmacia, si tu medicamento figura en el formulario del PMO como de uso crónico (para enfermedades crónicas prevalentes que se tratan de modo permanente), la cobertura mínima es del 70% sobre el precio de referencia; el resto de los ambulatorios del formulario, 40%.',
    normas: [{ norma: 'res310', donde: 'art. 2' }],
    enlace: { href: '/condiciones/hipertension', texto: 'Hipertensión: qué prepaga conviene' },
  },
  {
    slug: 'diabetes',
    nombre: 'Diabetes: insulina, medicamentos y tiras',
    categoria: 'medicamentos',
    sinonimos: ['diabetes', 'diabetico', 'diabetica', 'insulina', 'tiras reactivas', 'tirillas', 'glucemia', 'medidor de glucosa', 'glucometro', 'sensor de glucosa', 'metformina'],
    nivel: 'cien',
    respuesta: 'Sí, al 100%: la Ley 23.753 fija la cobertura total de los medicamentos y de los reactivos para el autocontrol, en las cantidades que indique el médico. Para acceder, se acredita la diabetes con una certificación médica de una institución sanitaria pública.',
    normas: [{ norma: 'ley23753', donde: 'art. 5' }],
    enlace: { href: '/condiciones/diabetes', texto: 'Diabetes: qué prepaga conviene' },
  },

  // ── Salud mental y rehabilitación
  {
    slug: 'psicologia',
    nombre: 'Psicólogo y psicoterapia',
    categoria: 'salud-mental',
    sinonimos: ['psicologo', 'psicologa', 'psicologia', 'psicoterapia', 'terapia', 'sesiones', 'terapia de pareja', 'terapia familiar', 'psicopedagogia', 'psicopedagoga', 'psicodiagnostico', 'salud mental', 'depresion', 'ansiedad'],
    nivel: 'parcial',
    respuesta: 'Sí. El piso del PMO es de hasta 30 consultas ambulatorias por año calendario, con un máximo de 4 por mes, e incluye psicoterapia individual, grupal, de familia y de pareja, entrevistas psicológicas y psiquiátricas, psicopedagogía y psicodiagnóstico. Hay planes que cubren más sesiones o las mismas sin copago.',
    normas: [{ norma: 'pmo', donde: 'punto 4.3' }, { norma: 'dec603', donde: 'art. 37' }],
    nota: 'La reglamentación de la Ley de Salud Mental ordena adecuar la cobertura del PMO a los principios de esa ley, y para acceder no se exige certificado de discapacidad (Decreto 603/2013, art. 37). Si tu tratamiento necesita más sesiones, pedí que tu profesional lo fundamente por escrito.',
    temaMarca: 'psicologia',
    enlace: { href: '/coberturas/psicologia', texto: 'Psicología: qué prepaga conviene' },
  },
  {
    slug: 'psiquiatria',
    nombre: 'Psiquiatría e internación psiquiátrica',
    categoria: 'salud-mental',
    sinonimos: ['psiquiatra', 'psiquiatria', 'internacion psiquiatrica', 'hospital de dia psiquiatrico', 'depresion', 'ansiedad', 'bipolar', 'trastorno bipolar', 'esquizofrenia', 'toc', 'ataques de panico'],
    nivel: 'parcial',
    respuesta: 'Sí. Las consultas psiquiátricas entran en el cupo de salud mental del PMO (hasta 30 por año, hasta 4 por mes) y la internación por cuadros agudos se cubre en sanatorio o en hospital de día, hasta 30 días por año calendario. La medicación sigue las reglas generales de medicamentos.',
    normas: [{ norma: 'pmo', donde: 'puntos 4.3 y 4.4' }, { norma: 'dec603', donde: 'art. 37' }],
    enlace: { href: '/condiciones/salud-mental', texto: 'Salud mental: qué prepaga conviene' },
  },
  {
    slug: 'adicciones',
    nombre: 'Adicciones',
    categoria: 'salud-mental',
    sinonimos: ['adicciones', 'adiccion', 'drogas', 'drogadiccion', 'alcoholismo', 'alcohol', 'consumo problematico', 'rehabilitacion de adicciones'],
    nivel: 'si',
    respuesta: 'Sí. Las prepagas tienen que cubrir, como mínimo, las mismas prestaciones obligatorias que las obras sociales (Ley 24.754), y eso incluye los tratamientos médicos, psicológicos y farmacológicos de las personas que dependen física o psíquicamente de drogas (Ley 24.455). La Ley de Salud Mental trata las adicciones como parte de la salud mental.',
    normas: [{ norma: 'ley24754', donde: 'art. 1' }, { norma: 'ley24455', donde: 'art. 1' }, { norma: 'ley26657', donde: 'art. 4' }],
  },
  {
    slug: 'kinesiologia',
    nombre: 'Kinesiología y rehabilitación',
    categoria: 'salud-mental',
    sinonimos: ['kinesiologia', 'kinesiologo', 'kinesiologa', 'kine', 'fisioterapia', 'fisiatria', 'rehabilitacion', 'rehabilitacion motriz', 'sesiones de kinesiologia'],
    nivel: 'parcial',
    respuesta: 'Sí, hasta 25 sesiones por persona por año calendario. El PMO incluye la rehabilitación ambulatoria motriz, psicomotriz, de readaptación ortopédica y sensorial.',
    normas: [{ norma: 'pmo', donde: 'punto 5' }],
    enlace: { href: '/coberturas/rehabilitacion', texto: 'Rehabilitación: qué prepaga conviene' },
  },
  {
    slug: 'fonoaudiologia',
    nombre: 'Fonoaudiología',
    categoria: 'salud-mental',
    sinonimos: ['fonoaudiologia', 'fonoaudiologo', 'fonoaudiologa', 'fono', 'lenguaje', 'habla', 'estimulacion temprana'],
    nivel: 'parcial',
    respuesta: 'Sí, hasta 25 sesiones por persona por año calendario. La estimulación temprana también está en el PMO, en los términos de su Anexo II.',
    normas: [{ norma: 'pmo', donde: 'punto 5' }],
  },
  {
    slug: 'autismo-tea',
    nombre: 'Autismo (TEA)',
    categoria: 'salud-mental',
    sinonimos: ['autismo', 'tea', 'trastorno del espectro autista', 'espectro autista', 'asperger', 'tgd', 'terapia aba'],
    nivel: 'si',
    respuesta: 'Sí. La Ley 27.043 obliga a las prepagas a cubrir la pesquisa, la detección temprana, el diagnóstico y el tratamiento de los Trastornos del Espectro Autista, y esas prestaciones forman parte del PMO. Con Certificado Único de Discapacidad, además, rige la cobertura total de la Ley 24.901.',
    normas: [{ norma: 'ley27043', donde: 'art. 4' }, { norma: 'ley24901', donde: 'art. 2' }],
    enlace: { href: '/condiciones/autismo', texto: 'Autismo: qué prepaga conviene' },
  },
  {
    slug: 'discapacidad',
    nombre: 'Discapacidad (CUD)',
    categoria: 'salud-mental',
    sinonimos: ['discapacidad', 'cud', 'certificado de discapacidad', 'certificado unico de discapacidad', 'persona con discapacidad', 'prestaciones basicas'],
    nivel: 'cien',
    respuesta: 'Sí. Las prepagas tienen que cubrir el Sistema de Prestaciones Básicas para Personas con Discapacidad de la Ley 24.901, que obliga a la cobertura total de las prestaciones básicas que necesite la persona con discapacidad.',
    normas: [{ norma: 'ley26682', donde: 'art. 7' }, { norma: 'ley24901', donde: 'art. 2' }],
    enlace: { href: '/condiciones/discapacidad', texto: 'Discapacidad: qué prepaga conviene' },
  },

  // ── Enfermedades y tratamientos
  {
    slug: 'cancer',
    nombre: 'Cáncer (oncología)',
    categoria: 'enfermedades',
    sinonimos: ['cancer', 'oncologia', 'oncologo', 'quimioterapia', 'quimio', 'radioterapia', 'tumor', 'leucemia', 'linfoma', 'cancer de mama', 'cancer de prostata'],
    nivel: 'cien',
    respuesta: 'Sí. El PMO incluye el diagnóstico y el tratamiento de todas las afecciones malignas, con los medicamentos oncológicos al 100% según los protocolos aprobados, y los pacientes oncológicos no pagan coseguros. Quedan afuera los tratamientos experimentales o en fase de prueba.',
    normas: [{ norma: 'pmo', donde: 'puntos 1.1.3, 7.3 y 9.2' }],
    enlace: { href: '/coberturas/oncologia', texto: 'Oncología: qué prepaga conviene' },
  },
  {
    slug: 'cancer-infantil',
    nombre: 'Cáncer infantil',
    categoria: 'enfermedades',
    sinonimos: ['cancer infantil', 'oncologia pediatrica', 'oncopediatria', 'leucemia infantil', 'ley oncopediatrica'],
    nivel: 'cien',
    respuesta: 'Sí, al 100%. La Ley 27.674 obliga a las prepagas a dar a chicas, chicos y adolescentes con cáncer (hasta los 18 años inclusive) cobertura del 100% en prevención, promoción, diagnóstico, tratamiento y todas las tecnologías relacionadas con el diagnóstico oncológico.',
    normas: [{ norma: 'ley27674', donde: 'arts. 7 y 8' }],
  },
  {
    slug: 'celiaquia',
    nombre: 'Celiaquía',
    categoria: 'enfermedades',
    sinonimos: ['celiaquia', 'celiaco', 'celiaca', 'sin gluten', 'sin tacc', 'tacc', 'harinas sin gluten', 'premezclas'],
    nivel: 'parcial',
    respuesta: `Sí. La Ley 26.588 obliga a cubrir la detección, el diagnóstico, el seguimiento y el tratamiento de la celiaquía, incluidas las harinas, premezclas y alimentos sin gluten certificados, con un monto que fija el Ministerio de Salud y se actualiza por inflación: desde el ${MONTO_CELIAQUIA.desdeTexto} es de ${MONTO_CELIAQUIA.montoTexto} por mes.`,
    normas: [{ norma: 'ley26588', donde: 'art. 9' }],
    enlace: { href: '/condiciones/celiacos', texto: 'Celiaquía: cómo cobrar el monto' },
  },
  {
    slug: 'dialisis',
    nombre: 'Diálisis',
    categoria: 'enfermedades',
    sinonimos: ['dialisis', 'hemodialisis', 'dialisis peritoneal', 'insuficiencia renal', 'rinon', 'rinones', 'enfermedad renal', 'eritropoyetina'],
    nivel: 'cien',
    respuesta: 'Sí, al 100%: hemodiálisis y diálisis peritoneal continua ambulatoria, con el requisito de inscribirte en el INCUCAI dentro de los primeros 30 días de empezado el tratamiento. La eritropoyetina para la insuficiencia renal crónica también se cubre al 100%.',
    normas: [{ norma: 'pmo', donde: 'puntos 7.3 y 8.2' }],
    enlace: { href: '/condiciones/enfermedad-renal-cronica', texto: 'Enfermedad renal: qué prepaga conviene' },
  },
  {
    slug: 'fibrosis-quistica',
    nombre: 'Fibrosis quística',
    categoria: 'enfermedades',
    sinonimos: ['fibrosis quistica', 'mucoviscidosis', 'fq'],
    nivel: 'cien',
    respuesta: 'Sí, al 100%: medicamentos, suplementos, equipos, rehabilitación, traslados, estudios y todas las prestaciones que indique el médico, en las cantidades prescriptas y sin que la prepaga pueda sustituirlas. Tiene que darlas en un máximo de 30 días corridos, o de inmediato si es urgente.',
    normas: [{ norma: 'ley27552', donde: 'arts. 5 y 6' }],
  },

  // ── Odontología
  {
    slug: 'odontologia',
    nombre: 'Dentista (odontología general)',
    categoria: 'odontologia',
    sinonimos: ['dentista', 'odontologo', 'odontologa', 'odontologia', 'muelas', 'caries', 'arreglo de caries', 'empaste', 'conducto', 'tratamiento de conducto', 'endodoncia', 'extraccion', 'sacar una muela', 'limpieza dental', 'encias', 'periodoncia', 'fluor', 'selladores'],
    nivel: 'si',
    respuesta: 'Sí. El PMO incluye consultas y urgencias, arreglos de caries (obturaciones), tratamientos de conducto, extracciones y cirugía bucal, tratamiento de encías y prevención (limpieza, flúor y, hasta los 15 años, selladores). Puede haber coseguro según la edad.',
    normas: [{ norma: 'pmo', donde: 'punto 6' }],
    temaMarca: 'odontologia',
    enlace: { href: '/coberturas/odontologia', texto: 'Odontología: qué prepaga conviene' },
  },
  {
    slug: 'ortodoncia',
    nombre: 'Ortodoncia',
    categoria: 'odontologia',
    sinonimos: ['ortodoncia', 'brackets', 'frenillos', 'aparatos', 'aparatos dentales', 'alineadores', 'invisalign', 'placa de ortodoncia'],
    nivel: 'plan',
    respuesta: 'No está entre las prácticas odontológicas del PMO: depende del plan. Varios planes la incluyen con límite de edad (por ejemplo, hasta los 15 o los 18 años) y los más altos, sin límite.',
    normas: [{ norma: 'pmo', donde: 'punto 6' }],
    nota: 'Como es una prestación superadora, puede tener carencia: el máximo legal es de 12 meses (Decreto 1993/2011, art. 10).',
    temaMarca: 'ortodoncia',
    enlace: { href: '/coberturas/ortodoncia', texto: 'Ortodoncia: qué prepaga conviene' },
  },
  {
    slug: 'implantes-dentales',
    nombre: 'Implantes y prótesis dentales',
    categoria: 'odontologia',
    sinonimos: ['implantes dentales', 'implante dental', 'implantes', 'protesis dental', 'dentadura', 'corona', 'puente', 'perno'],
    nivel: 'plan',
    respuesta: 'No están entre las prácticas odontológicas del PMO: dependen del plan. Suelen estar en los planes más altos, a veces con tope por año o por reintegro.',
    normas: [{ norma: 'pmo', donde: 'punto 6' }],
    temaMarca: 'implantes-dentales',
  },
  {
    slug: 'blanqueamiento',
    nombre: 'Blanqueamiento dental',
    categoria: 'odontologia',
    sinonimos: ['blanqueamiento', 'blanqueamiento dental', 'estetica dental', 'carillas'],
    nivel: 'plan',
    respuesta: 'No es obligatorio: el PMO aclara que sus prácticas odontológicas no incluyen el blanqueamiento de piezas dentarias. Algunos planes ofrecen descuentos en estética dental.',
    normas: [{ norma: 'pmo', donde: 'punto 6' }],
  },

  // ── Ojos, oídos y prótesis
  {
    slug: 'anteojos',
    nombre: 'Anteojos',
    categoria: 'ojos-oidos',
    sinonimos: ['anteojos', 'lentes', 'gafas', 'optica', 'armazon', 'cristales', 'lentes recetados'],
    nivel: 'parcial',
    respuesta: 'Para chicos de hasta 15 años, sí: anteojos con lentes estándar al 100%. Para adultos no es obligatorio y depende del plan: algunos cubren un par por año o cada dos años.',
    normas: [{ norma: 'pmo', donde: 'punto 8.3.2' }],
    temaMarca: 'optica',
    enlace: { href: '/coberturas/optica', texto: 'Óptica: qué prepaga conviene' },
  },
  {
    slug: 'lentes-de-contacto',
    nombre: 'Lentes de contacto',
    categoria: 'ojos-oidos',
    sinonimos: ['lentes de contacto', 'lentillas', 'lentes blandas', 'contactologia'],
    nivel: 'plan',
    respuesta: 'No son obligatorias: el PMO solo cubre anteojos con lentes estándar para chicos de hasta 15 años. Algunos planes incluyen un par de lentes de contacto por año o cada dos años.',
    normas: [{ norma: 'pmo', donde: 'punto 8.3.2' }],
    temaMarca: 'optica',
  },
  {
    slug: 'cirugia-refractiva',
    nombre: 'Cirugía láser de miopía (refractiva)',
    categoria: 'ojos-oidos',
    sinonimos: ['cirugia refractiva', 'laser', 'cirugia laser', 'laser ojos', 'miopia', 'astigmatismo', 'hipermetropia', 'lasik'],
    nivel: 'plan',
    respuesta: 'Depende del plan. Swiss Medical, por ejemplo, la incluye en todos sus planes estándar excepto el SMG02, según su comparativo oficial de julio de 2026.',
    normas: [],
    temaMarca: 'optica',
  },
  {
    slug: 'audifonos',
    nombre: 'Audífonos e hipoacusia',
    categoria: 'ojos-oidos',
    sinonimos: ['audifonos', 'audifono', 'otoamplifonos', 'hipoacusia', 'sordera', 'implante coclear', 'audicion', 'protesis auditiva', 'otoemisiones'],
    nivel: 'parcial',
    respuesta: 'Para chicos de hasta 15 años, los audífonos se cubren al 100%. En los recién nacidos, la Ley 25.415 obliga a estudiar la audición antes del tercer mes y, si hay hipoacusia, a cubrir los audífonos, las prótesis auditivas y la rehabilitación fonoaudiológica. Para adultos, fijate qué cubre tu plan.',
    normas: [{ norma: 'pmo', donde: 'punto 8.3.1' }, { norma: 'ley25415', donde: 'arts. 1 a 3' }],
  },
  {
    slug: 'protesis',
    nombre: 'Prótesis y órtesis',
    categoria: 'ojos-oidos',
    sinonimos: ['protesis', 'protesis de cadera', 'protesis de rodilla', 'stent', 'marcapasos', 'ortesis', 'plantillas', 'valvula cardiaca', 'osteosintesis', 'clavos'],
    nivel: 'parcial',
    respuesta: 'Las prótesis e implantes que se colocan de forma permanente dentro del cuerpo se cubren al 100%; las órtesis y las prótesis externas, al 50%. Se proveen nacionales, salvo que no exista una similar, y el médico las indica por nombre genérico, sin marca. Las prótesis miogénicas o bioeléctricas no están incluidas.',
    normas: [{ norma: 'pmo', donde: 'punto 8.3.3' }],
  },

  // ── Viajes y reintegros
  {
    slug: 'exterior',
    nombre: 'Cobertura en el exterior y viajes',
    categoria: 'otros',
    sinonimos: ['exterior', 'viaje', 'viajes', 'asistencia al viajero', 'cobertura internacional', 'afuera del pais', 'extranjero', 'vacaciones'],
    nivel: 'plan',
    respuesta: 'La cobertura fuera del país no está en el PMO: depende del plan. Algunos planes incluyen asistencia al viajero solo en países limítrofes y otros, en todo el mundo.',
    normas: [],
    temaMarca: 'exterior',
  },
  {
    slug: 'reintegros',
    nombre: 'Médicos fuera de cartilla (reintegros)',
    categoria: 'otros',
    sinonimos: ['reintegro', 'reintegros', 'fuera de cartilla', 'medico particular', 'reembolso', 'devolucion', 'libre eleccion'],
    nivel: 'plan',
    respuesta: 'Depende del plan. Los planes con reintegro te devuelven una parte cuando te atendés fuera de la cartilla, con topes por práctica; los planes cerrados solo cubren a los profesionales de su cartilla.',
    normas: [],
    temaMarca: 'reintegros',
    enlace: { href: '/guias/reintegros-en-prepagas', texto: 'Cómo funcionan los reintegros' },
  },
]

export function prestacionesDeCategoria(slug: string): PrestacionCobertura[] {
  return prestacionesCobertura.filter((p) => p.categoria === slug)
}
