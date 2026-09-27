// Qué documentación piden las prepagas al ingreso según lo que declares en la
// declaración jurada de salud (27-sep-2026). Sale de la experiencia de Darío
// como asesor y de los criterios de auditoría con los que trabaja, pasados a
// lenguaje simple. No se nombra ni se cita ningún documento interno de una
// prepaga: cada una tiene su criterio y puede pedir más o menos. Si algo cambia
// en la práctica, se corrige acá y se actualiza PREEXISTENCIAS_DOC_FECHA.

export const PREEXISTENCIAS_DOC_FECHA = '2026-09-27'

/**
 * - no: no suelen pedir documentación.
 * - propia: alcanza con adjuntar los informes que tengas.
 * - si: piden documentación específica (y suele pasar por el auditor médico).
 */
export type NivelDocumentacion = 'no' | 'propia' | 'si'

export const NIVEL_DOC: Record<NivelDocumentacion, { texto: string; clase: string }> = {
  no: { texto: 'No suelen pedir documentación', clase: 'bg-green-50 text-green-800 border-green-200' },
  propia: { texto: 'Adjuntá lo que tengas', clase: 'bg-amber-50 text-amber-800 border-amber-200' },
  si: { texto: 'Piden documentación', clase: 'bg-red-50 text-[#B8001F] border-red-200' },
}

export interface CategoriaDDJJ {
  slug: string
  nombre: string
}

// Los mismos temas en que se ordena la declaración jurada de salud.
export const CATEGORIAS_DDJJ: CategoriaDDJJ[] = [
  { slug: 'neurologicas-psiquiatricas', nombre: 'Neurológicas y psiquiátricas' },
  { slug: 'ojos', nombre: 'Ojos' },
  { slug: 'garganta-nariz-oido', nombre: 'Garganta, nariz y oído' },
  { slug: 'metabolicas', nombre: 'Metabólicas y endocrinas' },
  { slug: 'respiratorias', nombre: 'Respiratorias' },
  { slug: 'mamas', nombre: 'Mamas' },
  { slug: 'corazon', nombre: 'Corazón y circulación' },
  { slug: 'digestivas', nombre: 'Digestivas' },
  { slug: 'sangre', nombre: 'Sangre y ganglios' },
  { slug: 'rinon-vejiga-prostata', nombre: 'Riñón, vejiga y próstata' },
  { slug: 'ginecologicas', nombre: 'Ginecológicas y embarazo' },
  { slug: 'huesos-articulaciones', nombre: 'Huesos, músculos y articulaciones' },
  { slug: 'inmunologicas-piel-infecciosas', nombre: 'Congénitas, inmunológicas, piel e infecciosas' },
  { slug: 'adicciones-alimentarios', nombre: 'Adicciones y trastornos alimentarios' },
  { slug: 'tratamientos', nombre: 'Tratamientos, internaciones y estudios' },
]

export interface PreexistenciaDoc {
  slug: string
  nombre: string
  categoria: string
  /** Otras formas en que la gente lo busca (sin tildes no hace falta: se normaliza) */
  sinonimos: string[]
  nivel: NivelDocumentacion
  documentos: string[]
  /** Aclaración: cuándo cambia lo que piden, o si pasa sin auditoría */
  nota?: string
  /** Página del sitio donde se desarrolla el tema */
  enlace?: { href: string; texto: string }
}

// Frases que se repiten: el resumen de historia clínica (RHC) es lo que más se
// pide, siempre actualizado y firmado por el especialista que te atiende.
const rhc = (especialista: string, detalle = 'con el diagnóstico, cuándo empezó, cómo evolucionó y cómo estás hoy') =>
  `Resumen de historia clínica actualizado de tu ${especialista}, ${detalle}.`
const ALTO_COSTO = 'Si recibís medicación de alto costo, el formulario de medicación de alto costo de la prepaga, completado por tu médico.'
const SIN_AUDITORIA = 'Pasa sin auditoría médica.'

export const preexistenciasDoc: PreexistenciaDoc[] = [
  // ── Neurológicas y psiquiátricas
  {
    slug: 'epilepsia', nombre: 'Epilepsia y convulsiones', categoria: 'neurologicas-psiquiatricas',
    sinonimos: ['convulsiones', 'convulsion', 'epilepsia', 'epileptico', 'crisis convulsivas'],
    nivel: 'si',
    documentos: [
      rhc('neurólogo (de adultos o infantil)', 'con la fecha de inicio, la evolución, las internaciones si las hubo y el tratamiento pasado y actual'),
      'Informes de la última resonancia y de un electroencefalograma del último año.',
    ],
    nota: 'Las convulsiones febriles de la infancia no suelen requerir documentación.',
  },
  {
    slug: 'acv', nombre: 'ACV, aneurisma o accidente isquémico transitorio', categoria: 'neurologicas-psiquiatricas',
    sinonimos: ['acv', 'accidente cerebrovascular', 'derrame cerebral', 'ataque cerebral', 'isquemia', 'ait', 'aneurisma', 'malformacion arteriovenosa'],
    nivel: 'si',
    documentos: [rhc('neurólogo'), 'Informes de los estudios de imágenes: tomografía, resonancia o electroencefalograma.'],
  },
  {
    slug: 'esclerosis-multiple-ela', nombre: 'Esclerosis múltiple o ELA', categoria: 'neurologicas-psiquiatricas',
    sinonimos: ['esclerosis multiple', 'ela', 'esclerosis lateral amiotrofica', 'desmielinizante', 'leucodistrofia'],
    nivel: 'si',
    documentos: [rhc('neurólogo'), 'El formulario de historia clínica o de pedido de medicación para esclerosis múltiple o ELA de la prepaga.', 'Informes de los estudios neurológicos.'],
  },
  {
    slug: 'parkinson-alzheimer', nombre: 'Parkinson, Alzheimer y otras enfermedades neurológicas degenerativas', categoria: 'neurologicas-psiquiatricas',
    sinonimos: ['parkinson', 'alzheimer', 'demencia', 'enfermedad degenerativa', 'neurologico'],
    nivel: 'si',
    documentos: [rhc('neurólogo'), 'Informes de los estudios de imágenes (tomografía o resonancia).', ALTO_COSTO],
  },
  {
    slug: 'paralisis', nombre: 'Parálisis', categoria: 'neurologicas-psiquiatricas',
    sinonimos: ['paralisis', 'hemiplejia', 'paraplejia', 'cuadriplejia', 'paralisis facial'],
    nivel: 'si',
    documentos: [rhc('neurólogo'), 'Informes de los estudios de imágenes: tomografía, resonancia o electroencefalograma.'],
  },
  {
    slug: 'depresion', nombre: 'Depresión', categoria: 'neurologicas-psiquiatricas',
    sinonimos: ['depresion', 'depresivo', 'antidepresivos', 'distimia'],
    nivel: 'si',
    documentos: [rhc('psiquiatra', 'con el diagnóstico, el tiempo de evolución, cómo estás hoy, las internaciones si las hubo y la medicación actual')],
    enlace: { href: '/condiciones/salud-mental', texto: 'Prepagas y salud mental' },
  },
  {
    slug: 'psiquiatricas', nombre: 'Otras enfermedades psiquiátricas (bipolaridad, esquizofrenia, ansiedad)', categoria: 'neurologicas-psiquiatricas',
    sinonimos: ['bipolar', 'bipolaridad', 'esquizofrenia', 'ansiedad', 'ataque de panico', 'psiquiatrico', 'psicofarmacos', 'trastorno de personalidad', 'toc', 'salud mental'],
    nivel: 'si',
    documentos: [
      rhc('psiquiatra', 'con el diagnóstico, el tiempo de evolución, cómo estás hoy, las internaciones si las hubo y la medicación actual'),
      'En chicos, los informes psicopedagógicos, fonoaudiológicos y escolares.',
    ],
    enlace: { href: '/condiciones/salud-mental', texto: 'Prepagas y salud mental' },
  },
  {
    slug: 'trastornos-desarrollo', nombre: 'Trastornos del habla, del lenguaje o del desarrollo (TEA, TGD)', categoria: 'neurologicas-psiquiatricas',
    sinonimos: ['autismo', 'tea', 'tgd', 'asperger', 'lenguaje', 'habla', 'desarrollo', 'retraso madurativo', 'tartamudez', 'tdah'],
    nivel: 'si',
    documentos: [
      rhc('neurólogo infantil', 'con el inicio, la evolución y cómo está hoy'),
      'Informes de los estudios (tomografía, resonancia o electroencefalograma), si los hay.',
      'Informes psicopedagógicos, fonoaudiológicos y escolares.',
      'Si tiene certificado único de discapacidad (CUD), el certificado y los informes que presentaste en la junta.',
    ],
    enlace: { href: '/condiciones/autismo', texto: 'Prepagas y autismo' },
  },
  {
    slug: 'discapacidad', nombre: 'Discapacidad (con certificado único de discapacidad)', categoria: 'neurologicas-psiquiatricas',
    sinonimos: ['discapacidad', 'cud', 'certificado de discapacidad', 'paralisis cerebral', 'hidrocefalia', 'discapacidad motriz', 'discapacidad mental'],
    nivel: 'si',
    documentos: [rhc('especialista'), 'Informes de los estudios que tengas.', 'El CUD y los informes que presentaste en la junta de discapacidad.'],
    enlace: { href: '/condiciones/discapacidad', texto: 'Prepagas y discapacidad' },
  },
  {
    slug: 'desmayos', nombre: 'Desmayos', categoria: 'neurologicas-psiquiatricas',
    sinonimos: ['desmayo', 'desmayos', 'sincope', 'lipotimia'],
    nivel: 'propia', documentos: ['Los informes o estudios que tengas.'],
  },
  {
    slug: 'mareos', nombre: 'Mareos o vértigo', categoria: 'neurologicas-psiquiatricas',
    sinonimos: ['mareo', 'mareos', 'vertigo', 'inestabilidad'],
    nivel: 'propia', documentos: ['Los informes o estudios que tengas.'],
  },

  // ── Ojos
  {
    slug: 'anteojos', nombre: 'Miopía, astigmatismo, hipermetropía y anteojos', categoria: 'ojos',
    sinonimos: ['miopia', 'astigmatismo', 'hipermetropia', 'presbicia', 'anteojos', 'lentes', 'lentes de contacto'],
    nivel: 'no', documentos: [],
    nota: 'Alcanza con indicar en la declaración para qué usás anteojos.',
    enlace: { href: '/coberturas/optica', texto: 'Qué cubren las prepagas en óptica' },
  },
  {
    slug: 'estrabismo', nombre: 'Estrabismo', categoria: 'ojos',
    sinonimos: ['estrabismo', 'bizco', 'ojo vago', 'ambliopia'],
    nivel: 'si',
    documentos: [rhc('oftalmólogo'), 'Estudios del estrabismo y de agudeza visual, y si te indicaron cirugía.', 'Si tenés CUD, el certificado.'],
  },
  {
    slug: 'glaucoma', nombre: 'Glaucoma', categoria: 'ojos',
    sinonimos: ['glaucoma', 'presion ocular'],
    nivel: 'si', documentos: [rhc('oftalmólogo', 'con los estudios del glaucoma y el tratamiento que hacés')],
  },
  {
    slug: 'retina', nombre: 'Problemas de retina', categoria: 'ojos',
    sinonimos: ['retina', 'retinopatia', 'desprendimiento de retina', 'degeneracion macular', 'macula', 'retinitis pigmentaria'],
    nivel: 'si', documentos: [rhc('oftalmólogo', 'con los estudios de la retina y el tratamiento'), ALTO_COSTO],
  },
  {
    slug: 'cornea', nombre: 'Problemas de córnea (queratocono)', categoria: 'ojos',
    sinonimos: ['cornea', 'queratocono', 'trasplante de cornea'],
    nivel: 'si',
    documentos: [rhc('oftalmólogo', 'con los estudios de la córnea, la agudeza visual y el tratamiento que necesitás (por ejemplo, un trasplante)'), 'Si tenés CUD, el certificado y los informes de la junta.'],
  },
  {
    slug: 'otros-ojos', nombre: 'Otros problemas de la vista (cataratas y otros)', categoria: 'ojos',
    sinonimos: ['cataratas', 'vista', 'vision', 'ojo', 'ojos', 'baja vision'],
    nivel: 'si', documentos: [rhc('oftalmólogo'), 'Estudios: agudeza visual, fondo de ojo y campo visual.'],
  },

  // ── Garganta, nariz y oído
  {
    slug: 'alergias', nombre: 'Alergias, rinitis y sinusitis', categoria: 'garganta-nariz-oido',
    sinonimos: ['alergia', 'alergias', 'rinitis', 'sinusitis', 'garganta', 'nariz', 'tabique', 'desviacion de tabique'],
    nivel: 'no', documentos: [], nota: 'Las alergias pasan sin auditoría médica.',
  },
  {
    slug: 'amigdalas', nombre: 'Amígdalas o adenoides operadas', categoria: 'garganta-nariz-oido',
    sinonimos: ['amigdalas', 'adenoides', 'anginas', 'amigdalectomia'],
    nivel: 'propia', documentos: ['Los informes que tengas.'], nota: SIN_AUDITORIA,
  },
  {
    slug: 'oido', nombre: 'Problemas de oído (otitis, acúfenos)', categoria: 'garganta-nariz-oido',
    sinonimos: ['oido', 'otitis', 'acufenos', 'tinnitus', 'zumbido'],
    nivel: 'propia', documentos: ['Los informes o estudios que tengas.'],
  },
  {
    slug: 'hipoacusia', nombre: 'Hipoacusia o sordera', categoria: 'garganta-nariz-oido',
    sinonimos: ['sordera', 'hipoacusia', 'audifono', 'audifonos', 'implante coclear', 'no escucho'],
    nivel: 'si',
    documentos: [rhc('otorrino'), 'Audiometría y logoaudiometría de los dos oídos.', 'Si usás o te indicaron audífonos o un implante coclear, aclararlo.'],
  },
  {
    slug: 'apnea', nombre: 'Ronquidos y apnea del sueño', categoria: 'garganta-nariz-oido',
    sinonimos: ['apnea', 'apnea del sueño', 'ronquidos', 'roncar', 'cpap'],
    nivel: 'si',
    documentos: [rhc('otorrino o neumonólogo', 'con peso y talla'), 'Polisomnografía nocturna.', 'Si usás CPAP o te lo indicaron, aclararlo.'],
  },
  {
    slug: 'cuerdas-vocales', nombre: 'Nódulos o pólipos en las cuerdas vocales', categoria: 'garganta-nariz-oido',
    sinonimos: ['cuerdas vocales', 'nodulos vocales', 'polipo vocal', 'disfonia'],
    nivel: 'si', documentos: [rhc('otorrino'), 'Informe de la fibrolaringoscopía y de la biopsia, si te operaron.'],
  },

  // ── Metabólicas y endocrinas
  {
    slug: 'diabetes', nombre: 'Diabetes (tipo 1 o tipo 2)', categoria: 'metabolicas',
    sinonimos: ['diabetes', 'diabetico', 'diabetica', 'azucar', 'glucemia', 'insulina', 'metformina', 'dbt', 'diabetes tipo 1', 'diabetes tipo 2'],
    nivel: 'si',
    documentos: [
      'La planilla de acreditación de diabetes, completada por tu diabetólogo o endocrinólogo: tipo de diabetes, años de diagnóstico, complicaciones y tratamiento.',
      'Los estudios de los últimos 12 meses: hemoglobina glicosilada (HbA1c), glucemia en ayunas, fondo de ojo, índice albúmina/creatinina en orina y examen de pie.',
    ],
    nota: 'Pasa por auditoría médica, uses insulina o no.',
    enlace: { href: '/condiciones/diabetes', texto: 'Prepagas y diabetes' },
  },
  {
    slug: 'hipotiroidismo', nombre: 'Hipotiroidismo', categoria: 'metabolicas',
    sinonimos: ['hipotiroidismo', 'tiroides', 'hashimoto', 'tiroiditis', 'levotiroxina', 't4', 'eutirox'],
    nivel: 'no', documentos: [],
    nota: 'Aclará en la declaración si es primario o autoinmune (Hashimoto): en ese caso no suelen pedir nada. Si vino después de una cirugía, de iodo radiactivo u otra enfermedad de la tiroides, piden un resumen de historia clínica con los antecedentes y tratamientos, la anatomía patológica de la cirugía y un laboratorio completo.',
  },
  {
    slug: 'hipertiroidismo', nombre: 'Hipertiroidismo (Graves-Basedow)', categoria: 'metabolicas',
    sinonimos: ['hipertiroidismo', 'graves', 'basedow', 'tiroides'],
    nivel: 'si', documentos: [rhc('endocrinólogo', 'con el tratamiento definitivo que hiciste')],
  },
  {
    slug: 'obesidad', nombre: 'Sobrepeso y obesidad', categoria: 'metabolicas',
    sinonimos: ['obesidad', 'sobrepeso', 'imc', 'peso', 'bariatrica', 'manga gastrica', 'bypass gastrico', 'bajo peso'],
    nivel: 'si',
    documentos: [
      rhc('clínico o nutricionista', 'con peso, talla, índice de masa corporal y presión arterial'),
      'Los tratamientos nutricionales de los últimos 2 años.',
      'El último laboratorio.',
      'Con un índice de masa corporal de 40 o más, si te indicaron cirugía bariátrica.',
    ],
    nota: 'Con un índice de masa corporal (IMC) de 18,5 a 30 no piden nada. Lo de arriba aplica desde 30. Con bajo peso (menos de 18,5) piden un resumen con peso, talla, antecedentes de trastornos alimentarios y el último laboratorio.',
    enlace: { href: '/coberturas/cirugia-bariatrica', texto: 'Cirugía bariátrica en prepagas' },
  },
  {
    slug: 'gota', nombre: 'Gota', categoria: 'metabolicas',
    sinonimos: ['gota', 'acido urico'],
    nivel: 'no', documentos: [],
  },
  {
    slug: 'hipofisis', nombre: 'Prolactina alta y otros problemas de la hipófisis o las suprarrenales', categoria: 'metabolicas',
    sinonimos: ['prolactina', 'hipofisis', 'adenoma de hipofisis', 'suprarrenal', 'cushing', 'addison'],
    nivel: 'si',
    documentos: [rhc('endocrinólogo', 'con el tiempo de evolución, cómo estás hoy y los tratamientos'), 'Laboratorio (en prolactina alta, el último dosaje).', 'Estudios por imágenes, si los hay.', ALTO_COSTO],
  },

  // ── Respiratorias
  {
    slug: 'asma', nombre: 'Asma', categoria: 'respiratorias',
    sinonimos: ['asma', 'asmatico', 'broncoespasmo', 'puff', 'salbutamol', 'broncodilatador'],
    nivel: 'no', documentos: [],
    nota: 'Si tuviste internaciones o consultas de guardia por broncoespasmo o falta de aire, piden un resumen del neumonólogo con espirometría y radiografía o tomografía de tórax. En chicos, el asma suele pasar por auditoría.',
  },
  {
    slug: 'epoc', nombre: 'EPOC, enfisema o bronquitis crónica', categoria: 'respiratorias',
    sinonimos: ['epoc', 'enfisema', 'bronquitis cronica', 'oxigeno'],
    nivel: 'si',
    documentos: [rhc('neumonólogo', 'con el tiempo de evolución, cómo estás hoy, las internaciones si las hubo y el tratamiento'), 'Una espirometría de los últimos 6 meses.'],
  },
  {
    slug: 'pulmon', nombre: 'Otras enfermedades del pulmón (neumotórax, nódulo pulmonar, fibrosis)', categoria: 'respiratorias',
    sinonimos: ['pulmon', 'neumotorax', 'nodulo pulmonar', 'fibrosis pulmonar', 'pleura', 'hemoptisis', 'sangre al toser', 'falta de aire'],
    nivel: 'si',
    documentos: [rhc('neumonólogo', 'con el diagnóstico y el tratamiento actual'), 'Espirometría.', 'Radiografía y tomografía de tórax.'],
  },
  {
    slug: 'neumonia', nombre: 'Neumonía u otras infecciones respiratorias pasadas', categoria: 'respiratorias',
    sinonimos: ['neumonia', 'pulmonia', 'infeccion respiratoria'],
    nivel: 'propia', documentos: ['Los informes que tengas.'],
  },

  // ── Mamas
  {
    slug: 'nodulos-mama', nombre: 'Nódulos o quistes de mama', categoria: 'mamas',
    sinonimos: ['nodulo mamario', 'nodulo de mama', 'quiste mamario', 'quiste de mama', 'mama', 'mamas', 'pecho', 'puncion mamaria', 'biopsia de mama', 'birads', 'fibroadenoma'],
    nivel: 'si',
    documentos: [rhc('ginecólogo o mastólogo', 'con el diagnóstico, los procedimientos que te hicieron y cómo estás hoy'), 'Informes de la última ecografía y mamografía.', 'Anatomía patológica de biopsias o cirugías, si las hubo.'],
  },
  {
    slug: 'cancer-mama', nombre: 'Cáncer de mama', categoria: 'mamas',
    sinonimos: ['cancer de mama', 'tumor de mama', 'carcinoma mamario', 'mastectomia'],
    nivel: 'si',
    documentos: [rhc('ginecólogo, mastólogo u oncólogo', 'con el diagnóstico, los tratamientos que recibiste y cómo estás hoy'), 'Informes de la última ecografía y mamografía.', 'Anatomía patológica de biopsias o cirugías.', ALTO_COSTO],
    nota: 'Cualquier cáncer, sea cual sea su evolución, pasa por auditoría médica.',
    enlace: { href: '/coberturas/oncologia', texto: 'Cobertura oncológica en prepagas' },
  },
  {
    slug: 'protesis-mamarias', nombre: 'Prótesis mamarias (implantes)', categoria: 'mamas',
    sinonimos: ['protesis mamarias', 'implantes mamarios', 'siliconas', 'mamoplastia', 'aumento mamario'],
    nivel: 'si',
    documentos: ['Aclarar si fueron estéticas o reparadoras.', 'Si tienen más de 5 años, una ecografía mamaria actualizada.'],
  },

  // ── Corazón y circulación
  {
    slug: 'hipertension', nombre: 'Hipertensión arterial (presión alta)', categoria: 'corazon',
    sinonimos: ['hipertension', 'hipertenso', 'hipertensa', 'presion alta', 'presion', 'enalapril', 'losartan', 'amlodipina'],
    nivel: 'no', documentos: [],
    nota: 'Si tomás tres o más medicamentos para la presión, piden un resumen del cardiólogo con estudios (ecoestrés, ergometría o ecodoppler) y el tratamiento actual.',
    enlace: { href: '/condiciones/hipertension', texto: 'Prepagas e hipertensión' },
  },
  {
    slug: 'infarto', nombre: 'Infarto, angina de pecho, stent o bypass', categoria: 'corazon',
    sinonimos: ['infarto', 'angina de pecho', 'angor', 'stent', 'angioplastia', 'bypass', 'by pass', 'coronario', 'coronaria'],
    nivel: 'si',
    documentos: [rhc('cardiólogo', 'con el tratamiento actual'), 'La epicrisis de la internación.', 'Informes de los estudios cardiológicos: ecoestrés, ergometría, ecodoppler, cinecoronariografía o cámara gamma.'],
    enlace: { href: '/condiciones/enfermedad-cardiovascular', texto: 'Prepagas y enfermedad cardiovascular' },
  },
  {
    slug: 'arritmias', nombre: 'Arritmias, marcapasos o cardiodesfibrilador', categoria: 'corazon',
    sinonimos: ['arritmia', 'arritmias', 'taquicardia', 'fibrilacion auricular', 'palpitaciones', 'marcapasos', 'cardiodesfibrilador', 'bloqueo cardiaco', 'anticoagulado'],
    nivel: 'si',
    documentos: [rhc('cardiólogo', 'con el informe del Holter y la medicación actual'), 'Si tenés o te indicaron marcapasos o cardiodesfibrilador, aclararlo.'],
    enlace: { href: '/condiciones/enfermedad-cardiovascular', texto: 'Prepagas y enfermedad cardiovascular' },
  },
  {
    slug: 'soplo', nombre: 'Soplo cardíaco o problemas de válvulas', categoria: 'corazon',
    sinonimos: ['soplo', 'soplo cardiaco', 'valvula', 'valvulopatia', 'prolapso mitral', 'estenosis aortica'],
    nivel: 'si',
    documentos: [rhc('cardiólogo (de adultos o infantil)'), 'Ecodoppler cardíaco.', 'Si te indicaron cirugía de válvula, aclararlo.'],
    nota: 'Si es un soplo inocente, alcanza con un certificado de salud y el último ecodoppler.',
  },
  {
    slug: 'cardiopatias', nombre: 'Otras enfermedades del corazón (insuficiencia cardíaca, Chagas)', categoria: 'corazon',
    sinonimos: ['insuficiencia cardiaca', 'chagas', 'cardiopatia', 'corazon', 'miocardiopatia', 'cardiologico'],
    nivel: 'si',
    documentos: [rhc('cardiólogo', 'con el tratamiento actual'), 'La epicrisis, si estuviste internado.', 'Informes de los estudios: ecoestrés, ergometría, ecodoppler o Holter.'],
    enlace: { href: '/condiciones/enfermedad-cardiovascular', texto: 'Prepagas y enfermedad cardiovascular' },
  },
  {
    slug: 'varices', nombre: 'Várices', categoria: 'corazon',
    sinonimos: ['varices', 'insuficiencia venosa', 'arañitas', 'piernas cansadas'],
    nivel: 'no', documentos: [],
  },

  // ── Digestivas
  {
    slug: 'gastritis', nombre: 'Gastritis, úlcera o hernia de hiato', categoria: 'digestivas',
    sinonimos: ['gastritis', 'ulcera', 'hernia de hiato', 'reflujo', 'acidez', 'helicobacter'],
    nivel: 'no', documentos: [], nota: 'La hernia de hiato pasa sin auditoría médica.',
  },
  {
    slug: 'hernias', nombre: 'Hernias (inguinal, umbilical)', categoria: 'digestivas',
    sinonimos: ['hernia', 'hernia inguinal', 'hernia umbilical', 'eventracion'],
    nivel: 'propia', documentos: ['Los informes que tengas.'],
    nota: 'Las hernias inguinales operadas, en menores de 50 años, pasan sin auditoría médica.',
  },
  {
    slug: 'vesicula', nombre: 'Vesícula (cálculos, cólicos)', categoria: 'digestivas',
    sinonimos: ['vesicula', 'calculos biliares', 'piedras en la vesicula', 'colico biliar', 'colecistectomia'],
    nivel: 'propia', documentos: ['Los informes que tengas.'],
    nota: 'Si ya te operaron de la vesícula, pasa sin auditoría médica.',
  },
  {
    slug: 'crohn-colitis', nombre: 'Enfermedad de Crohn o colitis ulcerosa', categoria: 'digestivas',
    sinonimos: ['crohn', 'colitis', 'colitis ulcerosa', 'enfermedad inflamatoria intestinal', 'eii'],
    nivel: 'si',
    documentos: [rhc('gastroenterólogo'), 'Informe de la biopsia o anatomía patológica.', ALTO_COSTO],
  },
  {
    slug: 'hepatitis', nombre: 'Hepatitis B o C', categoria: 'digestivas',
    sinonimos: ['hepatitis', 'hepatitis b', 'hepatitis c', 'higado', 'cirrosis'],
    nivel: 'si',
    documentos: [rhc('hepatólogo'), 'Serologías, ecografía abdominal y el último laboratorio.', 'En casos crónicos, la biopsia hepática.', ALTO_COSTO],
    nota: 'La hepatitis A no requiere documentación.',
  },
  {
    slug: 'polipos-colon', nombre: 'Pólipos de colon', categoria: 'digestivas',
    sinonimos: ['polipos', 'polipo', 'polipos de colon', 'colonoscopia'],
    nivel: 'si', documentos: [rhc('gastroenterólogo'), 'Informe de la videocolonoscopía y de la biopsia.'],
  },
  {
    slug: 'cirugias-digestivas', nombre: 'Cirugías digestivas (estómago, intestino, colon)', categoria: 'digestivas',
    sinonimos: ['cirugia digestiva', 'cirugia de colon', 'cirugia de estomago', 'colectomia', 'gastrectomia'],
    nivel: 'si', documentos: [rhc('gastroenterólogo'), 'Informe de la anatomía patológica.'],
  },
  {
    slug: 'laboratorio-alterado', nombre: 'Análisis de laboratorio alterados', categoria: 'digestivas',
    sinonimos: ['laboratorio', 'analisis', 'transaminasas', 'enzimas hepaticas', 'valores alterados'],
    nivel: 'si', documentos: [rhc('gastroenterólogo'), 'Los informes de laboratorio.'],
  },
  {
    slug: 'antecedentes-familiares', nombre: 'Antecedentes familiares de cáncer digestivo', categoria: 'digestivas',
    sinonimos: ['antecedentes familiares', 'familiar con cancer'],
    nivel: 'no', documentos: [],
  },

  // ── Sangre y ganglios
  {
    slug: 'anemia', nombre: 'Anemia', categoria: 'sangre',
    sinonimos: ['anemia', 'hierro bajo', 'talasemia'],
    nivel: 'propia', documentos: ['Los informes que tengas.'], nota: 'Indicá en la declaración qué tipo de anemia es.',
  },
  {
    slug: 'leucemia-linfoma', nombre: 'Leucemia, linfoma o mieloma', categoria: 'sangre',
    sinonimos: ['leucemia', 'linfoma', 'hodgkin', 'mieloma', 'ganglios', 'medula osea', 'mielodisplasia'],
    nivel: 'si',
    documentos: [rhc('hematólogo', 'con las internaciones y los tratamientos'), 'Anatomía patológica del diagnóstico.', 'Estudios de imágenes (tomografía, ecografía) y laboratorio.', ALTO_COSTO],
    nota: 'Cualquier cáncer, sea cual sea su evolución, pasa por auditoría médica.',
    enlace: { href: '/coberturas/oncologia', texto: 'Cobertura oncológica en prepagas' },
  },
  {
    slug: 'coagulacion', nombre: 'Trombofilia, hemofilia u otros trastornos de la coagulación', categoria: 'sangre',
    sinonimos: ['trombofilia', 'hemofilia', 'von willebrand', 'coagulacion', 'trombosis', 'purpura', 'plaquetas', 'anticoagulado', 'sintrom'],
    nivel: 'si', documentos: [rhc('hematólogo', 'con el tratamiento actual'), ALTO_COSTO],
  },
  {
    slug: 'cancer', nombre: 'Cáncer, quimioterapia o radioterapia', categoria: 'sangre',
    sinonimos: ['cancer', 'tumor', 'oncologico', 'oncologia', 'neoplasia', 'quimioterapia', 'quimio', 'radioterapia', 'rayos', 'cancer de prostata', 'cancer de riñon', 'cancer de vejiga', 'cancer de colon'],
    nivel: 'si',
    documentos: [rhc('oncólogo o especialista que te trata', 'con las internaciones y los tratamientos'), 'Anatomía patológica del diagnóstico.', 'Estudios de imágenes y laboratorio.', ALTO_COSTO],
    nota: 'Cualquier cáncer, sea cual sea su evolución, pasa por auditoría médica.',
    enlace: { href: '/coberturas/oncologia', texto: 'Cobertura oncológica en prepagas' },
  },

  // ── Riñón, vejiga y próstata
  {
    slug: 'enfermedad-renal', nombre: 'Enfermedades del riñón (insuficiencia renal, un solo riñón)', categoria: 'rinon-vejiga-prostata',
    sinonimos: ['riñon', 'renal', 'insuficiencia renal', 'monorreno', 'un solo riñon', 'dialisis', 'nefritis'],
    nivel: 'si',
    documentos: [rhc('urólogo o nefrólogo', 'con los tratamientos'), 'Estudios de imágenes (ecografía, tomografía o resonancia) y la biopsia, si la hubo.'],
    nota: 'Si tenés un solo riñón: resumen del nefrólogo que diga si es congénito o adquirido, las últimas imágenes y un laboratorio de función renal.',
    enlace: { href: '/condiciones/enfermedad-renal-cronica', texto: 'Prepagas y enfermedad renal crónica' },
  },
  {
    slug: 'prostata', nombre: 'Próstata o PSA alto', categoria: 'rinon-vejiga-prostata',
    sinonimos: ['prostata', 'psa', 'hiperplasia prostatica', 'adenoma de prostata'],
    nivel: 'si', documentos: [rhc('urólogo'), 'Estudios de imágenes y laboratorio con PSA.', 'La biopsia, si te la hicieron.'],
  },
  {
    slug: 'vejiga', nombre: 'Vejiga (pólipos, incontinencia)', categoria: 'rinon-vejiga-prostata',
    sinonimos: ['vejiga', 'incontinencia', 'polipos vesicales'],
    nivel: 'si', documentos: [rhc('urólogo', 'con los tratamientos'), 'Estudios de imágenes y la biopsia, si la hubo.'],
  },
  {
    slug: 'calculos-renales', nombre: 'Cálculos renales', categoria: 'rinon-vejiga-prostata',
    sinonimos: ['calculos renales', 'piedras en el riñon', 'colico renal', 'litiasis renal'],
    nivel: 'propia', documentos: ['Los informes que tengas.'],
  },
  {
    slug: 'infecciones-urinarias', nombre: 'Infecciones urinarias', categoria: 'rinon-vejiga-prostata',
    sinonimos: ['infeccion urinaria', 'cistitis', 'infecciones urinarias'],
    nivel: 'propia', documentos: ['Los informes que tengas.'],
  },
  {
    slug: 'quistes-renales', nombre: 'Quistes en el riñón', categoria: 'rinon-vejiga-prostata',
    sinonimos: ['quiste renal', 'quistes en el riñon'],
    nivel: 'no', documentos: [],
  },
  {
    slug: 'fimosis-varicocele', nombre: 'Fimosis o varicocele', categoria: 'rinon-vejiga-prostata',
    sinonimos: ['fimosis', 'varicocele'],
    nivel: 'no', documentos: [],
    nota: 'La fimosis, y el varicocele en menores de 18, pasan sin auditoría médica. Con varicocele desde los 18: resumen de historia clínica, ecodoppler y espermograma si lo tenés.',
  },

  // ── Ginecológicas y embarazo
  {
    slug: 'embarazo', nombre: 'Embarazo', categoria: 'ginecologicas',
    sinonimos: ['embarazo', 'embarazada', 'fum', 'ultima menstruacion', 'ecografia obstetrica'],
    nivel: 'si',
    documentos: ['La fecha de tu última menstruación.', 'Si estás embarazada, la ecografía obstétrica.'],
    nota: 'En la práctica, con un embarazo en curso es muy difícil entrar: algunas prepagas no lo aceptan, aunque la ley dice que las preexistencias no pueden ser motivo de rechazo. Si entrás embarazada sin declararlo, cuando lo detectan suelen cobrarte las carencias (un pago extra por los meses de espera que no cumpliste). Declaralo siempre.',
    enlace: { href: '/condiciones/preexistencias', texto: 'Preexistencias: la ley y la práctica' },
  },
  {
    slug: 'endometriosis', nombre: 'Endometriosis', categoria: 'ginecologicas',
    sinonimos: ['endometriosis', 'adenomiosis'],
    nivel: 'si',
    documentos: [rhc('ginecólogo', 'con el diagnóstico, los procedimientos que te hicieron, cómo estás hoy y los antecedentes de embarazos o infertilidad'), 'Una ecografía ginecológica de los últimos 6 meses.'],
  },
  {
    slug: 'ovarios-utero', nombre: 'Quistes de ovario, miomas y otras afecciones ginecológicas', categoria: 'ginecologicas',
    sinonimos: ['quiste de ovario', 'ovario', 'ovario poliquistico', 'sop', 'mioma', 'miomas', 'utero', 'ginecologico'],
    nivel: 'si',
    documentos: [rhc('ginecólogo', 'con las cirugías, las biopsias si las hubo y el tratamiento actual'), 'Una ecografía ginecológica de los últimos 6 meses.'],
  },
  {
    slug: 'infertilidad', nombre: 'Infertilidad o tratamientos de fertilidad', categoria: 'ginecologicas',
    sinonimos: ['infertilidad', 'fertilidad', 'fertilizacion', 'in vitro', 'ovodonacion', 'reproduccion asistida'],
    nivel: 'si',
    documentos: [rhc('ginecólogo', 'con los estudios (ecografía transvaginal, histerosalpingografía) y el tratamiento actual')],
    enlace: { href: '/coberturas/fertilidad', texto: 'Fertilidad en prepagas' },
  },
  {
    slug: 'abortos', nombre: 'Abortos espontáneos previos', categoria: 'ginecologicas',
    sinonimos: ['aborto', 'abortos', 'perdida de embarazo'],
    nivel: 'si', documentos: [rhc('ginecólogo', 'con los antecedentes, los estudios de control y el tratamiento actual')],
  },
  {
    slug: 'sangrados', nombre: 'Sangrados anormales', categoria: 'ginecologicas',
    sinonimos: ['sangrado', 'hemorragia', 'metrorragia'],
    nivel: 'si', documentos: [rhc('ginecólogo'), 'Una ecografía ginecológica reciente.'],
  },
  {
    slug: 'its', nombre: 'Infecciones de transmisión sexual (HPV y otras)', categoria: 'ginecologicas',
    sinonimos: ['hpv', 'vph', 'herpes genital', 'ets', 'its', 'clamidia', 'sifilis', 'condilomas'],
    nivel: 'propia', documentos: ['Los informes que tengas.'],
  },

  // ── Huesos, músculos y articulaciones
  {
    slug: 'columna', nombre: 'Hernia de disco y cirugía de columna', categoria: 'huesos-articulaciones',
    sinonimos: ['hernia de disco', 'columna', 'lumbalgia', 'ciatica', 'protrusion discal', 'discopatia', 'cervical', 'lumbar', 'artrodesis'],
    nivel: 'si',
    documentos: [rhc('traumatólogo'), 'Informe del último estudio de imágenes (radiografía, tomografía o resonancia).'],
    nota: 'Lo piden sobre todo si te operaron o tenés una prótesis de columna.',
  },
  {
    slug: 'escoliosis', nombre: 'Escoliosis', categoria: 'huesos-articulaciones',
    sinonimos: ['escoliosis', 'cifosis'],
    nivel: 'si',
    documentos: [rhc('especialista en columna', 'con el diagnóstico, la evolución, cómo estás hoy y los tratamientos (con o sin cirugía)'), 'El espinograma o las imágenes de los últimos estudios.'],
  },
  {
    slug: 'protesis-cadera-rodilla', nombre: 'Prótesis de cadera o de rodilla, artrosis', categoria: 'huesos-articulaciones',
    sinonimos: ['protesis de cadera', 'protesis de rodilla', 'reemplazo de cadera', 'reemplazo de rodilla', 'artrosis', 'coxartrosis', 'gonartrosis', 'protesis'],
    nivel: 'si', documentos: [rhc('traumatólogo'), 'Informe del último estudio de imágenes (radiografía, tomografía o resonancia).'],
  },
  {
    slug: 'artroscopia', nombre: 'Cirugía de rodilla u hombro (meniscos, ligamentos, artroscopía)', categoria: 'huesos-articulaciones',
    sinonimos: ['artroscopia', 'menisco', 'meniscos', 'ligamento cruzado', 'lca', 'rodilla', 'hombro', 'manguito rotador'],
    nivel: 'si',
    documentos: [rhc('traumatólogo', 'con la fecha de la cirugía, la causa y cómo funciona hoy la articulación'), 'El protocolo quirúrgico, si lo tenés.', 'La última resonancia y la de antes de la cirugía.'],
  },
  {
    slug: 'osteoporosis', nombre: 'Osteoporosis', categoria: 'huesos-articulaciones',
    sinonimos: ['osteoporosis', 'osteopenia', 'densitometria', 'fracturas'],
    nivel: 'si',
    documentos: [rhc('endocrinólogo', 'con las fracturas que tuviste y el tratamiento actual'), 'Densitometría ósea y laboratorio.', ALTO_COSTO],
  },
  {
    slug: 'neuromusculares', nombre: 'Enfermedades neuromusculares (miastenia, distrofias)', categoria: 'huesos-articulaciones',
    sinonimos: ['miastenia', 'distrofia muscular', 'neuromuscular', 'atrofia muscular'],
    nivel: 'si', documentos: [rhc('neurólogo'), 'Los estudios diagnósticos.', ALTO_COSTO],
  },
  {
    slug: 'juanetes', nombre: 'Juanetes (hallux valgus)', categoria: 'huesos-articulaciones',
    sinonimos: ['juanete', 'juanetes', 'hallux valgus'],
    nivel: 'no', documentos: [], nota: 'Operados o no, pasan sin auditoría médica.',
  },
  {
    slug: 'quiste-pilonidal', nombre: 'Quiste pilonidal (sacrocoxígeo) operado', categoria: 'huesos-articulaciones',
    sinonimos: ['quiste pilonidal', 'quiste sacro', 'sacrocoxigeo', 'quiste dermoide'],
    nivel: 'no', documentos: [], nota: SIN_AUDITORIA,
  },
  {
    slug: 'fracturas-mano', nombre: 'Fracturas o secuelas en la mano o la muñeca', categoria: 'huesos-articulaciones',
    sinonimos: ['fractura', 'muñeca', 'mano', 'tunel carpiano'],
    nivel: 'propia', documentos: ['Los informes que tengas.'],
  },
  {
    slug: 'kinesiologia', nombre: 'Tratamiento de kinesiología', categoria: 'huesos-articulaciones',
    sinonimos: ['kinesiologia', 'kinesio', 'rehabilitacion fisica', 'fisioterapia'],
    nivel: 'no', documentos: [],
  },

  // ── Congénitas, inmunológicas, piel e infecciosas
  {
    slug: 'artritis', nombre: 'Artritis reumatoidea o espondilitis anquilosante', categoria: 'inmunologicas-piel-infecciosas',
    sinonimos: ['artritis', 'artritis reumatoidea', 'espondilitis', 'reuma', 'reumatologico'],
    nivel: 'si', documentos: ['El formulario del programa de artritis de la prepaga, completado por tu reumatólogo.'],
    enlace: { href: '/condiciones/artritis', texto: 'Prepagas y artritis' },
  },
  {
    slug: 'lupus-autoinmunes', nombre: 'Lupus y otras enfermedades autoinmunes', categoria: 'inmunologicas-piel-infecciosas',
    sinonimos: ['lupus', 'autoinmune', 'colagenopatia', 'sjogren', 'esclerodermia', 'vasculitis', 'inmunodeficiencia'],
    nivel: 'si',
    documentos: [rhc('reumatólogo o inmunólogo', 'con los informes del diagnóstico y el tratamiento (inmunosupresores o biológicos)'), ALTO_COSTO],
  },
  {
    slug: 'psoriasis', nombre: 'Psoriasis', categoria: 'inmunologicas-piel-infecciosas',
    sinonimos: ['psoriasis'],
    nivel: 'si', documentos: [rhc('dermatólogo', 'con el tipo de psoriasis, dónde está, si hay artritis y si te tratan con metotrexato o biológicos')],
  },
  {
    slug: 'melanoma', nombre: 'Melanoma', categoria: 'inmunologicas-piel-infecciosas',
    sinonimos: ['melanoma', 'cancer de piel', 'lunar'],
    nivel: 'si',
    documentos: [rhc('dermatólogo', 'con la localización y el tratamiento oncológico'), 'Informe de la anatomía patológica.', 'Estudios de imágenes (tomografías).', ALTO_COSTO],
    nota: 'Cualquier cáncer, sea cual sea su evolución, pasa por auditoría médica.',
  },
  {
    slug: 'piel', nombre: 'Otras enfermedades de la piel (dermatitis, acné, vitiligo)', categoria: 'inmunologicas-piel-infecciosas',
    sinonimos: ['dermatitis', 'acne', 'vitiligo', 'urticaria', 'eczema', 'rosacea', 'piel'],
    nivel: 'propia', documentos: ['Los informes que tengas.'], nota: 'Las alergias pasan sin auditoría médica.',
  },
  {
    slug: 'congenitas', nombre: 'Enfermedades congénitas, genéticas o hereditarias', categoria: 'inmunologicas-piel-infecciosas',
    sinonimos: ['congenita', 'genetica', 'hereditaria', 'sindrome', 'sindrome de down', 'fibrosis quistica', 'malformacion', 'enfermedad metabolica', 'gaucher'],
    nivel: 'si',
    documentos: [rhc('especialista', 'con los estudios diagnósticos o biopsias y los tratamientos que hiciste y hacés'), ALTO_COSTO],
  },
  {
    slug: 'hiv', nombre: 'HIV', categoria: 'inmunologicas-piel-infecciosas',
    sinonimos: ['hiv', 'vih', 'sida'],
    nivel: 'si',
    documentos: [rhc('infectólogo'), 'La ficha de enfermedades infecciosas de la prepaga.', 'Último laboratorio con carga viral, y el tratamiento actual.'],
  },
  {
    slug: 'infecciosas', nombre: 'Otras enfermedades infecciosas crónicas (tuberculosis y otras)', categoria: 'inmunologicas-piel-infecciosas',
    sinonimos: ['tuberculosis', 'tbc', 'infecciosa', 'infectocontagiosa'],
    nivel: 'si',
    documentos: [rhc('infectólogo'), 'La ficha de enfermedades infecciosas de la prepaga.', 'Último laboratorio y tratamiento actual.'],
  },

  // ── Adicciones y trastornos alimentarios
  {
    slug: 'adicciones', nombre: 'Adicciones (alcohol, drogas) y tratamientos de rehabilitación', categoria: 'adicciones-alimentarios',
    sinonimos: ['adiccion', 'adicciones', 'alcoholismo', 'alcohol', 'drogas', 'rehabilitacion', 'toxicomania', 'consumo problematico'],
    nivel: 'si',
    documentos: [rhc('psiquiatra', 'con el diagnóstico, las internaciones o tratamientos (ambulatorio, hospital de día), la medicación, la psicoterapia y si tuviste acompañante terapéutico')],
  },
  {
    slug: 'trastornos-alimentarios', nombre: 'Trastornos alimentarios (anorexia, bulimia)', categoria: 'adicciones-alimentarios',
    sinonimos: ['anorexia', 'bulimia', 'trastorno alimentario', 'tca', 'atracones'],
    nivel: 'si',
    documentos: [rhc('psiquiatra', 'con el diagnóstico, las internaciones o tratamientos (ambulatorio, hospital de día), la medicación y la psicoterapia')],
  },

  // ── Tratamientos, internaciones y estudios
  {
    slug: 'tratamiento-actual', nombre: 'Tratamiento médico actual o medicación crónica', categoria: 'tratamientos',
    sinonimos: ['tratamiento', 'medicacion', 'medicamentos', 'remedios', 'pastillas', 'medicacion cronica'],
    nivel: 'si',
    documentos: ['Resumen de historia clínica del médico que te trata, o una copia de la historia clínica.', 'Informes de los estudios que te hayan hecho.', ALTO_COSTO],
    nota: 'En la declaración, detallá cada medicamento con la droga y la dosis.',
  },
  {
    slug: 'internaciones', nombre: 'Internaciones o cirugías anteriores', categoria: 'tratamientos',
    sinonimos: ['internacion', 'internado', 'cirugia', 'operacion', 'operado', 'operada', 'epicrisis'],
    nivel: 'si',
    documentos: ['La epicrisis de la internación o un resumen de historia clínica.', 'Informes de los estudios que te hayan hecho.'],
  },
  {
    slug: 'cirugia-pendiente', nombre: 'Cirugía indicada que todavía no te hiciste', categoria: 'tratamientos',
    sinonimos: ['cirugia pendiente', 'cirugia programada', 'me tengo que operar', 'operacion pendiente'],
    nivel: 'si',
    documentos: ['Resumen de historia clínica con la indicación de la cirugía y los estudios.'],
    nota: 'Una cirugía indicada pasa por auditoría médica hasta que se resuelve.',
  },
  {
    slug: 'estudios', nombre: 'Resonancias, tomografías o biopsias recientes', categoria: 'tratamientos',
    sinonimos: ['resonancia', 'tomografia', 'biopsia', 'estudios'],
    nivel: 'si', documentos: ['Los informes de los estudios y, si corresponde, un resumen de historia clínica.'],
  },
]

// Condiciones que, según nuestra experiencia, pasan sin auditoría médica.
export const SIN_AUDITORIA_LISTA = [
  'Alergias',
  'Amígdalas o adenoides operadas',
  'Hernia de hiato',
  'Hernia inguinal operada (menores de 50 años)',
  'Vesícula operada',
  'Fimosis y varicocele en menores de 18',
  'Quiste pilonidal operado',
  'Juanetes, operados o no',
]

export function preexistenciasDeCategoria(slug: string): PreexistenciaDoc[] {
  return preexistenciasDoc.filter((p) => p.categoria === slug)
}

/** Las entradas que se desarrollan en una página del sitio (ficha de condición o cobertura). */
export function preexistenciasConEnlace(href: string): PreexistenciaDoc[] {
  return preexistenciasDoc.filter((p) => p.enlace?.href === href)
}
