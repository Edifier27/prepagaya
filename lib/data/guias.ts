export interface GuiaSeccion {
  titulo: string
  cuerpo: string
}

export interface GuiaData {
  slug: string
  titulo: string
  metaDescripcion: string
  tiempoLectura: number // minutos
  categoria: string
  fechaActualizacion: string // ISO
  contenido: {
    intro: string
    secciones: GuiaSeccion[]
    conclusion: string
  }
  faq: { q: string; a: string }[]
  keywords: string[]
  relacionadas: string[] // slugs de otras guías
  prepagasRelacionadas?: string[] // slugs de prepagas
}

export const guias: GuiaData[] = [
  {
    slug: 'como-cambiar-de-prepaga',
    titulo: '¿Cómo cambiar de prepaga? Guía paso a paso 2026',
    metaDescripcion: 'Aprendé cómo cambiar de prepaga en Argentina de forma simple. Te explicamos los plazos, requisitos y todo lo que necesitás saber para hacer el cambio sin perder cobertura.',
    tiempoLectura: 8,
    categoria: 'Trámites',
    fechaActualizacion: '2026-07-14',
    contenido: {
      intro: 'Cambiar de prepaga en Argentina es más simple de lo que la mayoría cree: no hay permanencia mínima, no existen multas por irte y la ley te protege contra las carencias en las prestaciones obligatorias. Aun así, hay un orden correcto para hacerlo y errores que pueden dejarte unos días sin cobertura o pagando dos cuotas el mismo mes. Esta guía te lleva por todo el proceso.',
      secciones: [
        {
          titulo: 'Primero contratá la nueva, después dá de baja la anterior',
          cuerpo: 'El error más común es dar de baja la prepaga actual antes de tener el alta confirmada en la nueva. Hacelo al revés: cotizá, presentá la documentación y esperá la confirmación de alta con fecha de inicio de cobertura. Recién con esa fecha en mano, pedí la baja de la anterior. Así nunca quedás descubierto, algo clave si tenés tratamientos en curso o hijos chicos.',
        },
        {
          titulo: 'Las carencias no aplican al PMO',
          cuerpo: 'La Ley 26.682 prohíbe que las prepagas apliquen períodos de carencia sobre las prestaciones del Programa Médico Obligatorio (PMO): consultas, estudios, internación, parto, medicación oncológica, urgencias. Solo pueden aplicar carencias a prestaciones "superadoras" (por ejemplo, habitación individual, ortodoncia o cirugía estética). Si una prepaga te dice que tenés que esperar 6 meses para una consulta clínica, está incumpliendo la ley.',
        },
        {
          titulo: 'Preexistencias: te tienen que aceptar igual',
          cuerpo: 'Ninguna prepaga puede rechazarte por una enfermedad preexistente: la Ley 26.682 lo prohíbe expresamente. Lo que sí pueden hacer es cobrarte un valor diferencial autorizado por la Superintendencia de Servicios de Salud. Declarala siempre en la declaración jurada: ocultarla puede darles argumentos para negarte coberturas después.',
        },
        {
          titulo: 'El timing de la baja: evitá pagar dos cuotas',
          cuerpo: 'Las prepagas facturan por mes adelantado. Pedí la baja de la anterior antes del cierre de facturación (generalmente entre el 20 y el 25 de cada mes) para que no te generen la cuota del mes siguiente. La baja se puede pedir online: desde 2021 todas las empresas están obligadas a ofrecer un "botón de baja" en su web, y no pueden exigirte que vayas a una sucursal ni retenerte con llamados.',
        },
        {
          titulo: 'Documentación que te van a pedir',
          cuerpo: 'Para el alta en la nueva prepaga: DNI de cada integrante del grupo, declaración jurada de salud, y según tu situación laboral, último recibo de sueldo (si derivás aportes), constancia de monotributo o inscripción en autónomos. Si venís de otra prepaga, algunas te piden certificado de cobertura anterior para acreditar continuidad, lo que puede ayudarte a evitar carencias en prestaciones superadoras.',
        },
      ],
      conclusion: 'Cambiar de prepaga es un trámite de dos semanas si lo hacés en orden: primero el alta nueva, después la baja vieja, siempre cruzando las fechas para no quedar descubierto ni pagar doble. Compará precios reales antes de decidir: con los aumentos mensuales de 2026, la diferencia entre dos planes equivalentes puede superar los $100.000 por mes.',
    },
    faq: [
      {
        q: '¿Tengo que esperar un tiempo mínimo antes de cambiar de prepaga?',
        a: 'No. No existe permanencia mínima ni penalidad por baja. Podés cambiar de prepaga en cualquier momento y las prestaciones del PMO te cubren desde el primer día en la nueva.',
      },
      {
        q: '¿Pierdo la antigüedad si cambio de prepaga?',
        a: 'La antigüedad como afiliado no se traslada automáticamente entre empresas, pero muchas prepagas reconocen la cobertura previa para no aplicarte carencias en prestaciones superadoras. Pedí un certificado de cobertura antes de dar de baja la anterior.',
      },
      {
        q: '¿Pueden rechazarme por edad o por una enfermedad?',
        a: 'No pueden rechazarte por condiciones de salud preexistentes. Por edad, algunas prepagas ponen límites de ingreso en planes específicos, pero existen planes diseñados para mayores. En ambos casos pueden aplicar cuotas diferenciales autorizadas por la SSSalud.',
      },
    ],
    keywords: ['como cambiar de prepaga', 'cambiar de prepaga argentina', 'baja prepaga alta nueva', 'carencia cambio de prepaga'],
    relacionadas: ['baja-de-prepaga-proceso', 'prepaga-sin-periodo-carencia', 'como-afiliarse-prepaga-requisitos'],
    prepagasRelacionadas: ['swiss-medical', 'osde', 'sancor-salud'],
  },
  {
    slug: 'obra-social-vs-prepaga',
    titulo: 'Obra Social vs Prepaga: ¿cuál es mejor para vos? 2026',
    metaDescripcion: 'Comparamos obra social y prepaga en Argentina: diferencias, costos, cobertura y cuándo conviene cada una. Tomá la mejor decisión para tu salud.',
    tiempoLectura: 10,
    categoria: 'Comparativas',
    fechaActualizacion: '2026-07-14',
    contenido: {
      intro: 'Obra social y prepaga no son lo mismo, aunque en Argentina la línea se volvió difusa: OSDE es técnicamente una obra social y compite con Swiss Medical, que es una prepaga. La diferencia real está en cómo se financian, quién puede afiliarse y qué nivel de servicio ofrecen. Entender esto te puede ahorrar cientos de miles de pesos por mes.',
      secciones: [
        {
          titulo: 'La diferencia de fondo: solidaria vs privada',
          cuerpo: 'Las obras sociales se financian con aportes obligatorios del salario (3% del trabajador + 6% del empleador) y deben aceptar a todos los trabajadores de su actividad. Las prepagas son empresas privadas: pagás una cuota de bolsillo y el precio depende de tu edad y del plan. Ambas están obligadas a cubrir el mismo piso: el Programa Médico Obligatorio (PMO). La diferencia está en todo lo que va por encima de ese piso: cartilla, sanatorios, tiempos de espera y confort.',
        },
        {
          titulo: 'La tercera vía: derivar aportes a una prepaga',
          cuerpo: 'Si trabajás en relación de dependencia, podés derivar tus aportes de obra social a una prepaga: tus contribuciones se descuentan del precio del plan y además el precio "deriva aporte" no paga el IVA del 21% que paga la contratación directa. En la práctica, el mismo plan puede costarte entre 30% y 40% menos derivando aportes. Por ejemplo, un plan intermedio de Galeno cuesta $307.804 directo y $195.527 con aportes (julio 2026).',
        },
        {
          titulo: 'Cuándo conviene quedarse en la obra social',
          cuerpo: 'Si tu obra social sindical tiene buena cartilla en tu zona y usás el sistema poco (consultas de rutina, alguna urgencia), pagar una prepaga puede ser plata tirada: ya estás cubierto con tus aportes sin costo extra. También conviene si tu sueldo es bajo: el aporte es proporcional al salario, mientras que la cuota de prepaga es fija y en 2026 arranca en $110.000 por persona.',
        },
        {
          titulo: 'Cuándo conviene pasarse a una prepaga',
          cuerpo: 'Conviene cuando necesitás especialistas con turnos rápidos, sanatorios de primer nivel (Alemán, Italiano, Austral, Trinidad), cobertura fuerte en salud mental, o tenés hijos y querés pediatría sin demoras. También si sos monotributista con una obra social de baja calidad: la diferencia de servicio entre una obra social saturada y una prepaga media es enorme en tiempos de espera y acceso a estudios complejos.',
        },
        {
          titulo: 'Los números de 2026',
          cuerpo: 'Una prepaga de entrada (Premedic, Hominis) cuesta desde ~$110.000/mes por persona. El segmento medio (Galeno Plata, Sancor 3000, Medifé Bronce) va de $250.000 a $400.000. Las premium (OSDE 410/510, Swiss SMG40+) superan los $450.000 y llegan a $1.100.000. Contra eso, la obra social ya la pagás con tus aportes. La pregunta correcta no es cuál es mejor en abstracto, sino cuánto valorás el acceso rápido y la cartilla premium.',
        },
      ],
      conclusion: 'No hay una respuesta única: la obra social gana en costo (ya la pagás), la prepaga gana en servicio. El punto medio que la mayoría no conoce es la derivación de aportes, que te da servicio de prepaga descontando lo que ya aportás. Antes de decidir, compará el plan que te interesa en las dos modalidades.',
    },
    faq: [
      {
        q: '¿Puedo tener obra social y prepaga al mismo tiempo?',
        a: 'Sí. Podés mantener tu obra social por tus aportes y pagar una prepaga aparte de bolsillo. Muchas personas lo hacen para tener doble cobertura, aunque en general conviene más derivar los aportes y unificar.',
      },
      {
        q: '¿Qué cubre una obra social que no cubra una prepaga?',
        a: 'El piso legal es el mismo para ambas: el PMO. Ninguna puede cubrir menos que eso. La diferencia está en la calidad de la red, los tiempos de espera y las prestaciones superadoras, donde las prepagas suelen estar por encima.',
      },
      {
        q: '¿El monotributista tiene obra social?',
        a: 'Sí, el monotributo incluye un componente de obra social que te da derecho a elegir una del registro. Desde el Decreto 955/2024 los aportes van directo a la entidad que elijas, sin triangulaciones. Muchas prepagas ofrecen planes específicos para monotributistas que combinan ese aporte con una cuota adicional.',
      },
    ],
    keywords: ['obra social vs prepaga', 'diferencia obra social prepaga', 'derivar aportes prepaga', 'que conviene obra social o prepaga'],
    relacionadas: ['derivar-obra-social-a-prepaga', 'prepagas-para-monotributistas', 'que-cubre-la-prepaga'],
    prepagasRelacionadas: ['osde', 'galeno', 'sancor-salud'],
  },
  {
    slug: 'que-cubre-la-prepaga',
    titulo: '¿Qué cubre una prepaga obligatoriamente? PMO completo 2026',
    metaDescripcion: 'Conocé todo lo que debe cubrir tu prepaga por ley en Argentina según el Plan Médico Obligatorio (PMO). Evitá que te nieguen prestaciones.',
    tiempoLectura: 12,
    categoria: 'Cobertura',
    fechaActualizacion: '2026-07-14',
    contenido: {
      intro: 'El Programa Médico Obligatorio (PMO) es el piso de prestaciones que toda prepaga y obra social debe cubrir por ley, sin importar cuánto pagues ni qué plan tengas. Conocerlo es tu mejor herramienta: la mayoría de las negativas de cobertura que reciben los afiliados son sobre prestaciones que el PMO obliga a cubrir.',
      secciones: [
        {
          titulo: 'Atención básica: consultas, estudios e internación',
          cuerpo: 'El PMO cubre consultas con médicos de todas las especialidades, estudios de diagnóstico (laboratorio, imágenes, alta complejidad con indicación médica), internación clínica y quirúrgica sin límite de días, y traslados en ambulancia cuando hay indicación. Los planes con copago pueden cobrarte un monto por consulta, pero nunca negarte la prestación.',
        },
        {
          titulo: 'Medicamentos: 40%, 70% y 100%',
          cuerpo: 'La cobertura de medicamentos ambulatorios es de al menos 40% del precio de referencia, que sube a 70% para medicamentos de enfermedades crónicas (hipertensión, diabetes, colesterol) y llega a 100% en internación, oncología, diabetes (insulina), HIV, trasplantes y medicación para discapacidad. Muchas prepagas mejoran estos pisos como diferencial comercial: Luis Pasteur, por ejemplo, cubre 60% en farmacia desde su plan base.',
        },
        {
          titulo: 'Maternidad y niñez: cobertura al 100%',
          cuerpo: 'El embarazo, el parto (vaginal o cesárea) y la atención del recién nacido hasta el año de vida tienen cobertura del 100%, incluyendo controles prenatales, ecografías, internación conjunta y neonatología. El Plan Materno Infantil es una de las áreas donde la ley es más estricta: no pueden cobrarte copagos ni aplicar carencias.',
        },
        {
          titulo: 'Salud mental, discapacidad y tratamientos especiales',
          cuerpo: 'La Ley de Salud Mental obliga a cubrir psicología y psiquiatría en igualdad de condiciones que cualquier enfermedad. La cobertura de discapacidad es integral al 100% (tratamientos, educación, transporte). También son obligatorias la fertilización asistida (Ley 26.862), la cobertura de celiaquía (harinas y premezclas), obesidad, diabetes (Ley 23.753) y los tratamientos oncológicos completos.',
        },
        {
          titulo: 'Qué NO cubre el PMO (y dónde las prepagas se diferencian)',
          cuerpo: 'Quedan fuera del piso obligatorio: cirugía estética sin causa médica, ortodoncia en adultos, habitación individual, cobertura internacional, y reintegros por profesionales fuera de cartilla. Justamente ahí compiten los planes: cuando pagás un plan medio o alto, estás pagando estas prestaciones superadoras más la calidad de la red. Al comparar planes, mirá esta capa: el piso legal es idéntico en todos.',
        },
        {
          titulo: 'Qué hacer si te niegan algo del PMO',
          cuerpo: 'Pedí la negativa por escrito, reuní la indicación médica y presentá un reclamo formal ante la prepaga. Si no responden o insisten, denunciá ante la Superintendencia de Servicios de Salud (SSSalud) al 0800-222-72583 o en sssalud.gob.ar: es gratuito, no necesitás abogado y las empresas suelen revertir la negativa apenas la SSSalud interviene. Para urgencias médicas existe además el recurso de amparo judicial.',
        },
      ],
      conclusion: 'El PMO es tu piso de derechos: ninguna prepaga puede cubrir menos, ni siquiera en el plan más barato. Las diferencias reales entre planes están por encima de ese piso. Si te niegan una prestación obligatoria, reclamá: la mayoría de las negativas se revierten con un reclamo bien hecho ante la SSSalud.',
    },
    faq: [
      {
        q: '¿El plan más barato cubre menos que el más caro?',
        a: 'En prestaciones obligatorias (PMO), no: ambos cubren exactamente lo mismo por ley. Las diferencias están en copagos, cartilla, habitación individual, reintegros y prestaciones superadoras como ortodoncia o cirugía estética.',
      },
      {
        q: '¿La prepaga puede negarme un estudio de alta complejidad?',
        a: 'No, si tiene indicación médica. Puede pedir auditoría previa (autorización), pero la negativa injustificada de un estudio indicado por tu médico es incumplimiento del PMO y es denunciable ante la SSSalud.',
      },
      {
        q: '¿Las prepagas cubren tratamientos de fertilidad?',
        a: 'Sí, la Ley 26.862 obliga a cubrir técnicas de baja y alta complejidad (hasta 4 tratamientos de baja y 3 de alta por año, con criterios médicos), incluyendo la medicación, que es el componente más caro.',
      },
    ],
    keywords: ['que cubre la prepaga', 'PMO prepagas', 'programa medico obligatorio 2026', 'prepaga me niega cobertura'],
    relacionadas: ['como-reclamar-a-una-prepaga', 'copago-en-prepagas-que-es', 'reintegros-en-prepagas'],
  },
  {
    slug: 'prepagas-para-monotributistas',
    titulo: 'Prepagas para Monotributistas 2026: las mejores opciones',
    metaDescripcion: 'Guía completa sobre prepagas para monotributistas en Argentina. Cuánto sale, cómo contratarla y cuáles son las mejores opciones según tu categoría.',
    tiempoLectura: 9,
    categoria: 'Perfiles',
    fechaActualizacion: '2026-07-14',
    contenido: {
      intro: 'Si sos monotributista, tu cobertura de salud cambió más en los últimos dos años que en las dos décadas anteriores. El Decreto 955/2024 eliminó la "triangulación" por la que derivabas tu aporte a una prepaga a través de una obra social intermediaria, y ahora las prepagas pueden recibir tus aportes directamente. Esta guía explica el sistema actual y cuáles son las mejores opciones en 2026.',
      secciones: [
        {
          titulo: 'Cómo funciona hoy: aporte directo, sin intermediarios',
          cuerpo: 'Tu monotributo incluye un componente de obra social que hoy va directo a la entidad que elijas. Las prepagas que se inscribieron en el registro de agentes del seguro de salud pueden recibir ese aporte y descontarlo de la cuota de su plan. El aporte del monotributo cubre solo una fracción del precio real de un plan de prepaga, así que siempre vas a pagar una diferencia de bolsillo, pero cada peso aportado se descuenta.',
        },
        {
          titulo: 'Cuánto te sale según lo que busques',
          cuerpo: 'Con precios de julio 2026, un monotributista de 30 años paga aproximadamente: opciones de entrada como Hominis (~$105.000) o Premedic (~$109.000); segmento medio como Federada 4000 (~$139.000), Luis Pasteur Novo (~$148.000) o Swiss Medical S1 ($185.773); segmento medio-alto como Galeno Plata 300 ($307.804) u OSDE 210 (~$270.000). De estos montos se descuenta tu componente de obra social si la prepaga acepta la derivación.',
        },
        {
          titulo: 'Ojo con el IVA: la trampa de la contratación directa',
          cuerpo: 'Los precios "particulares" de las prepagas incluyen IVA del 21%. Cuando derivás tu aporte de monotributo, en la mayoría de los casos accedés a la lista de precios sin IVA, la misma de los empleados en relación de dependencia. Preguntá siempre por las dos listas: la diferencia en un plan medio puede superar los $50.000 mensuales.',
        },
        {
          titulo: 'Las mejores opciones por perfil de monotributista',
          cuerpo: 'Si facturás poco y querés cumplir con cobertura digna: Hominis o Premedic (PMO completo, precio mínimo). Si trabajás desde casa y valorás la telemedicina: Medifé (Cam Doctor) o los planes digitales de Medicus. Si vivís en el interior: Sancor Salud, Federada o Avalian, que tienen las mejores redes fuera de AMBA. Si tu prioridad son los grandes sanatorios: Galeno Plata 300 es el mejor precio-calidad con acceso a la red Trinidad.',
        },
        {
          titulo: 'El trámite paso a paso',
          cuerpo: 'Primero elegí plan y prepaga y pedí la cotización como monotributista (no como particular). La prepaga gestiona la unificación de tu aporte ante ARCA/SSSalud con el formulario correspondiente. El cambio de obra social tarda hasta 90 días en impactar, pero la cobertura de la prepaga arranca cuando empezás a pagar. Necesitás: DNI, constancia de inscripción al monotributo, último pago del monotributo y declaración jurada de salud.',
        },
      ],
      conclusion: 'Para el monotributista, 2026 es el mejor momento en años para pasarse a una prepaga: el aporte va directo, hay planes desde $105.000 y la competencia por este segmento bajó los precios de entrada. La clave es cotizar como monotributista (nunca como particular) y comparar el precio final con el aporte ya descontado.',
    },
    faq: [
      {
        q: '¿Qué categoría de monotributo necesito para derivar a una prepaga?',
        a: 'Cualquier categoría puede elegir obra social y derivar su componente de salud. Lo que cambia con la categoría es el monto del aporte: en categorías bajas el aporte es menor y la diferencia de bolsillo que pagás a la prepaga es mayor.',
      },
      {
        q: '¿Puedo sumar a mi familia con mi monotributo?',
        a: 'Sí, podés incorporar a tu grupo familiar pagando un aporte adicional por cada integrante en el monotributo, y la prepaga cotiza el plan familiar completo descontando esos aportes.',
      },
      {
        q: '¿Conviene monotributo con prepaga o directamente particular?',
        a: 'Casi siempre conviene derivar el monotributo: descontás tu aporte y en general accedés a la lista de precios sin IVA. Contratar como particular solo tiene sentido si tu situación fiscal no te permite usar el componente de obra social.',
      },
    ],
    keywords: ['prepagas para monotributistas', 'monotributo prepaga 2026', 'derivar monotributo prepaga', 'decreto 955 monotributo obra social'],
    relacionadas: ['obra-social-vs-prepaga', 'derivar-obra-social-a-prepaga', 'prepaga-para-freelancers-autonomos'],
    prepagasRelacionadas: ['hominis', 'premedic', 'galeno', 'sancor-salud'],
  },
  {
    slug: 'deducir-prepaga-ganancias',
    titulo: 'Cómo deducir la prepaga del impuesto a las ganancias 2026',
    metaDescripcion: 'Aprendé a deducir el gasto de tu prepaga en la declaración de impuesto a las ganancias. Límites, requisitos y cómo hacerlo paso a paso.',
    tiempoLectura: 7,
    categoria: 'Finanzas',
    fechaActualizacion: '2026-07-14',
    contenido: {
      intro: 'Si pagás impuesto a las ganancias y también pagás una prepaga de tu bolsillo, el fisco te devuelve una parte: las cuotas de medicina prepaga son deducibles hasta el 5% de tu ganancia neta anual. Con cuotas que en 2026 superan los $300.000 mensuales en planes medios, esta deducción puede significar varios cientos de miles de pesos al año que estás dejando sobre la mesa si no la cargás.',
      secciones: [
        {
          titulo: 'Qué se puede deducir y cuánto',
          cuerpo: 'Se deducen las cuotas de medicina prepaga que pagués por vos y por tus cargas de familia declaradas (cónyuge e hijos menores de 18, o incapacitados para el trabajo). El tope es el 5% de la ganancia neta del ejercicio, calculada antes de esta deducción. Importante: se deduce lo efectivamente pagado de bolsillo; si tu empleador paga parte del plan o derivás aportes, solo deducís la diferencia que abonás vos.',
        },
        {
          titulo: 'Cómo cargarla si sos empleado: SiRADIG',
          cuerpo: 'Los empleados en relación de dependencia la cargan en el formulario SiRADIG (F.572 web) desde la web de ARCA, en la sección "Deducciones y desgravaciones" → "Cuotas médico-asistenciales". Cargá el monto mensual pagado y los datos de la prepaga (CUIT). Tenés tiempo hasta el 31 de marzo del año siguiente para informar todo el año anterior, pero conviene cargarlo mes a mes para que la retención de tu recibo baje ya mismo.',
        },
        {
          titulo: 'Cómo deducirla si sos autónomo',
          cuerpo: 'Los autónomos la incluyen directamente en la declaración jurada anual de ganancias, en el rubro de deducciones generales. Guardá los comprobantes de pago de todo el año: facturas o débitos de la prepaga. El tope del 5% de la ganancia neta aplica igual. Los monotributistas puros no pueden usar esta deducción porque no liquidan ganancias, salvo por ingresos gravados por fuera del monotributo.',
        },
        {
          titulo: 'Un ejemplo con números de 2026',
          cuerpo: 'Supongamos una ganancia neta anual de $60.000.000 y una prepaga familiar de $500.000/mes ($6.000.000 al año). El tope de deducción es $3.000.000 (5% de la ganancia neta). Deducís $3.000.000, y si tu alícuota marginal es del 35%, el ahorro real de impuesto es de hasta $1.050.000 en el año. Aunque no llegues a deducir todo lo pagado, el beneficio es demasiado grande para ignorarlo.',
        },
      ],
      conclusion: 'La deducción de prepaga es de las más fáciles de aprovechar y de las más olvidadas. Si sos empleado, cargala en SiRADIG este mes y va a impactar en tu próximo recibo; si sos autónomo, sumala a tu declaración anual. Cinco minutos de trámite pueden devolverte el equivalente a dos o tres cuotas de tu plan.',
    },
    faq: [
      {
        q: '¿Puedo deducir la prepaga de mis padres?',
        a: 'Solo si son carga de familia declarada a tu cargo, algo que el régimen actual limita a cónyuge e hijos. Las cuotas que pagues por padres no son deducibles como cuota médico-asistencial en la mayoría de los casos.',
      },
      {
        q: '¿Los copagos y gastos médicos también se deducen?',
        a: 'Los honorarios médicos y de internación tienen una deducción separada (40% de lo facturado, con tope del 5% de la ganancia neta), pero requieren factura. Los copagos de consulta en general no se deducen como cuota, sino como gasto médico si tenés comprobante.',
      },
      {
        q: '¿Qué pasa si me olvidé de cargarla el año pasado?',
        a: 'Si sos empleado, podés cargarla en el SiRADIG hasta el 31 de marzo siguiente al cierre del año fiscal. Pasada esa fecha, podés presentar una declaración jurada de ganancias como contribuyente para recuperar la retención en exceso.',
      },
    ],
    keywords: ['deducir prepaga ganancias', 'prepaga impuesto ganancias 2026', 'siradig prepaga', 'deduccion cuota medico asistencial'],
    relacionadas: ['obra-social-vs-prepaga', 'cuota-prepaga-aumento-inflacion', 'prepagas-economicas'],
  },
  {
    slug: 'prepagas-economicas',
    titulo: 'Las prepagas más económicas de Argentina en 2026',
    metaDescripcion: 'Ranking de las prepagas más baratas de Argentina con buena cobertura. Precios actualizados y análisis de qué tan convenientes son realmente.',
    tiempoLectura: 8,
    categoria: 'Precios',
    fechaActualizacion: '2026-07-14',
    contenido: {
      intro: 'Una prepaga no tiene por qué costar medio millón de pesos: en 2026 hay opciones desde ~$105.000 por mes que cubren el PMO completo, el mismo piso legal que cubre OSDE 510. La diferencia está en la cartilla, los sanatorios y los tiempos de espera. Acá está el ranking real de las más baratas y, más importante, qué resignás en cada una.',
      secciones: [
        {
          titulo: 'El podio de precios (julio 2026, 30 años, contratación directa)',
          cuerpo: 'Hominis Aqua Más: ~$105.000/mes, con atención centrada en el Sanatorio Güemes. Premedic C200: ~$109.000/mes, PMO completo con alta satisfacción de afiliados. Federada 4000: ~$139.000/mes, con la red de Federada fuerte en Santa Fe, Córdoba y el interior. Luis Pasteur Novo: ~$148.000/mes con el mejor descuento en farmacia del mercado (60%). Swiss Medical S1: $185.773/mes, la puerta de entrada más barata a una prepaga premium.',
        },
        {
          titulo: 'Qué resignás en una prepaga económica',
          cuerpo: 'Tres cosas, principalmente: cartilla más chica (menos opciones de especialistas y sanatorios), copagos en consultas y estudios, y cobertura geográfica limitada (Premedic cubre CABA, GBA, Córdoba y Tucumán; Hominis se concentra en AMBA). Lo que NO resignás: el PMO. Internación, oncología, maternidad, urgencias y medicación crónica están cubiertos por ley igual que en un plan premium.',
        },
        {
          titulo: 'Para quién tienen sentido',
          cuerpo: 'Son ideales para jóvenes sanos que quieren cobertura real sin pagar red premium que no usan, monotributistas de categorías bajas, y como cobertura puente mientras mejorás ingresos. No son la mejor opción si tenés una condición crónica que requiere especialistas frecuentes, si vivís fuera de sus zonas de cobertura, o si tenés hijos chicos y priorizás pediatría con turnos inmediatos.',
        },
        {
          titulo: 'El truco para bajar el precio sin bajar de prepaga',
          cuerpo: 'Antes de irte a una prepaga más barata, mirá el plan de entrada de tu prepaga actual: bajar de plan dentro de la misma empresa conserva tu antigüedad y tu historia clínica. También compará la modalidad: si estás pagando como particular y podés derivar aportes (relación de dependencia o monotributo), el mismo plan puede bajar 30-40%. Un Galeno Plata 300 pasa de $307.804 a $195.527 con aportes.',
        },
      ],
      conclusion: 'La prepaga más barata de Argentina en 2026 es Hominis (~$105.000), seguida de cerca por Premedic. Ambas son opciones legítimas con PMO completo. Pero antes de elegir por precio, verificá que la cartilla cubra tu zona y tus médicos: una prepaga barata que no tiene prestadores cerca tuyo es cara.',
    },
    faq: [
      {
        q: '¿Cuál es la prepaga más barata de Argentina en 2026?',
        a: 'Hominis, con el plan Aqua Más desde ~$105.000/mes para una persona de 30 años (julio 2026). Le siguen Premedic (~$109.000) y Federada 4000 (~$139.000). Los precios varían por edad y zona.',
      },
      {
        q: '¿Las prepagas baratas cubren internación y oncología?',
        a: 'Sí. El PMO obliga a todas las prepagas a cubrir internación sin límite de días, tratamientos oncológicos al 100% y urgencias, sin importar el precio del plan.',
      },
      {
        q: '¿Conviene una prepaga económica o quedarse en la obra social?',
        a: 'Si tu obra social tiene buena red en tu zona, quedarte es gratis. La prepaga económica conviene cuando tu obra social está saturada o tiene mala cartilla, y querés turnos más rápidos sin pagar un plan premium.',
      },
    ],
    keywords: ['prepaga mas barata argentina', 'prepagas economicas 2026', 'prepaga barata buena', 'hominis premedic precios'],
    relacionadas: ['cuota-prepaga-por-edad', 'obra-social-vs-prepaga', 'derivar-obra-social-a-prepaga'],
    prepagasRelacionadas: ['hominis', 'premedic', 'federada-salud', 'luis-pasteur'],
  },
  {
    slug: 'cuota-prepaga-por-edad',
    titulo: '¿Cuánto sube la prepaga con la edad? Tabla completa 2026',
    metaDescripcion: 'Descubrí cómo aumentan los precios de las prepagas según tu edad en Argentina. Tabla comparativa por empresa y consejos para pagar menos.',
    tiempoLectura: 6,
    categoria: 'Precios',
    fechaActualizacion: '2026-07-14',
    contenido: {
      intro: 'La edad es el factor que más pesa en el precio de una prepaga: el mismo plan puede costar el doble o el triple según cuántos años tengas al contratar. Entender cómo funcionan las bandas etarias te permite anticipar cuánto vas a pagar y aprovechar la regla que casi nadie conoce: la antigüedad te protege de los aumentos por edad.',
      secciones: [
        {
          titulo: 'Cómo funcionan las bandas etarias',
          cuerpo: 'Las prepagas segmentan sus precios por rangos de edad: típicamente 0-17, 18-25, 26-35, 36-45, 46-55, 56-65 y 66+. Los precios de referencia que ves publicados (incluidos los nuestros) son para la banda de 26-35 años. Un joven de 22 puede pagar 10-20% menos que ese valor; una persona de 50, entre 40% y 80% más; y al ingresar con más de 60, el precio puede duplicar o triplicar el de referencia.',
        },
        {
          titulo: 'La protección legal que tenés que conocer',
          cuerpo: 'La Ley 26.682 establece que los mayores de 65 años con 10 o más años de antigüedad continua en la misma prepaga no pueden sufrir aumentos por razón de edad. Traducción práctica: si contratás a los 50 y te quedás, a los 65 tu cuota solo sube por los ajustes generales de precios, no por envejecer. Es el argumento más fuerte para elegir bien una vez y construir antigüedad.',
        },
        {
          titulo: 'Aproximación de precios por edad (plan medio, julio 2026)',
          cuerpo: 'Tomando como referencia un plan medio de ~$300.000 para 30 años: a los 22 años pagarías ~$255.000-270.000; a los 40, ~$360.000-400.000; a los 50, ~$450.000-520.000; a los 60, ~$550.000-700.000; ingresando a los 70, puede superar el $1.000.000 en las premium. Cada empresa pondera distinto: algunas castigan menos el ingreso tardío (Sancor, Federada) y otras lo encarecen fuerte (las premium de AMBA).',
        },
        {
          titulo: 'Estrategias para pagar menos a cualquier edad',
          cuerpo: 'Primero: derivá aportes si podés; el descuento del IVA y de tus contribuciones aplica a toda edad. Segundo: entrá joven y no cortes la afiliación; la continuidad es tu activo. Tercero: después de los 55, compará planes diseñados para mayores (Hospital Italiano Plan Mayor, opciones de CEMIC) contra el ingreso general, suelen tener mejor relación precio-cobertura para esa etapa. Cuarto: si sos jubilado, evaluá la prepaga complementaria a PAMI en lugar de un plan completo.',
        },
      ],
      conclusion: 'La edad define tu precio de entrada, pero la antigüedad define tu precio futuro: quien construye 10 años de continuidad llega a los 65 protegido por ley contra los aumentos etarios. Si estás cerca de un cambio de banda (por ejemplo, por cumplir 36), contratar antes del cumpleaños puede fijarte en la banda anterior.',
    },
    faq: [
      {
        q: '¿La prepaga puede aumentarme la cuota cuando cumplo años?',
        a: 'Depende del contrato: muchas aplican el cambio de banda etaria al cruzar ciertos umbrales. Pero si tenés más de 65 años y 10+ años de antigüedad en la empresa, la ley prohíbe aumentos por edad.',
      },
      {
        q: '¿Hay prepagas que acepten personas mayores de 70?',
        a: 'Sí. No pueden rechazarte por edad según la ley, aunque los precios de ingreso a edades avanzadas son altos. Los planes específicos para mayores (Hospital Italiano Mayor, líneas senior de otras empresas) suelen ser más convenientes que el ingreso a un plan general.',
      },
      {
        q: '¿Los hijos pagan lo mismo que los adultos en un plan familiar?',
        a: 'No, los menores de 18 tienen tarifas reducidas, generalmente entre el 40% y el 70% del valor de un adulto joven. Al cumplir 18-21 (según la empresa) pasan a tarifa de adulto, lo que encarece notablemente el grupo familiar.',
      },
    ],
    keywords: ['precio prepaga por edad', 'cuanto sube la prepaga con la edad', 'prepaga mayores 60', 'bandas etarias prepagas'],
    relacionadas: ['prepaga-para-mayores-60', 'prepagas-economicas', 'cuota-prepaga-aumento-inflacion'],
  },
  {
    slug: 'como-reclamar-a-una-prepaga',
    titulo: 'Cómo reclamar a una prepaga: guía de derechos 2026',
    metaDescripcion: 'Conocé tus derechos como afiliado y cómo hacer una queja o reclamo efectivo a tu prepaga ante la Superintendencia de Servicios de Salud.',
    tiempoLectura: 8,
    categoria: 'Derechos',
    fechaActualizacion: '2026-07-14',
    contenido: {
      intro: 'Negativa de cobertura, demoras en autorizaciones, aumentos mal aplicados, cartilla que no coincide con la prometida: los motivos de reclamo contra las prepagas son siempre los mismos, y la mayoría se resuelve a favor del afiliado cuando el reclamo se hace bien. La clave es escalar en el orden correcto y dejar todo por escrito.',
      secciones: [
        {
          titulo: 'Paso 1: reclamo formal ante la prepaga',
          cuerpo: 'Todo reclamo empieza en la propia empresa, pero no por teléfono: usá los canales que dejan constancia (formulario web, mail, carta con acuse). Describí el problema, adjuntá la indicación médica si es una negativa de cobertura, y pedí respuesta por escrito con número de reclamo. Guardá todo. Si la respuesta es negativa o no llega en un plazo razonable (10-15 días), pasá al siguiente nivel con ese expediente como prueba.',
        },
        {
          titulo: 'Paso 2: denuncia ante la SSSalud',
          cuerpo: 'La Superintendencia de Servicios de Salud es el organismo que controla a prepagas y obras sociales. La denuncia es gratuita, no necesitás abogado y se hace online en sssalud.gob.ar o al 0800-222-72583 (SALUD). Adjuntá tu reclamo previo, la respuesta de la empresa (o la constancia de que no respondió) y la documentación médica. La SSSalud intima a la empresa, y en la práctica la mayoría de las negativas de PMO se revierten en esta instancia.',
        },
        {
          titulo: 'Paso 3: Defensa del Consumidor y amparo judicial',
          cuerpo: 'En paralelo podés denunciar en Defensa del Consumidor (la relación con la prepaga es una relación de consumo), útil sobre todo para problemas de facturación y aumentos. Para urgencias médicas donde la demora pone en riesgo la salud (medicación oncológica, cirugías, discapacidad), el recurso de amparo judicial es la vía rápida: los jueces otorgan medidas cautelares en días, y la jurisprudencia es abrumadoramente favorable al paciente en prestaciones del PMO.',
        },
        {
          titulo: 'Los reclamos que casi siempre se ganan',
          cuerpo: 'Negativa de prestaciones del PMO (se ganan casi siempre), carencias aplicadas a prestaciones obligatorias (ilegales), rechazo de afiliación por preexistencia (prohibido por la Ley 26.682), aumentos no informados con la antelación debida, y cobros posteriores a una baja solicitada. En todos estos casos la ley es clara y está de tu lado: el reclamo bien documentado es cuestión de tiempo, no de suerte.',
        },
      ],
      conclusion: 'Reclamar funciona: la mayoría de las negativas se revierten ante la SSSalud sin llegar a juicio. La fórmula es simple: todo por escrito, escalar en orden (empresa → SSSalud → amparo si urge), y apoyarte en la indicación médica. No aceptes un "no" telefónico como respuesta final.',
    },
    faq: [
      {
        q: '¿Cuánto tarda un reclamo ante la SSSalud?',
        a: 'La intimación a la empresa suele salir en días y muchas empresas revierten la negativa en 2 a 4 semanas. Para urgencias médicas no esperes este circuito: el amparo judicial con medida cautelar es la vía correcta y resuelve en días.',
      },
      {
        q: '¿Pueden darme de baja por reclamar?',
        a: 'No. La baja como represalia sería ilegal. La prepaga solo puede rescindir el contrato por falta de pago (con intimación previa) o por falsedad comprobada en la declaración jurada de salud.',
      },
      {
        q: '¿Necesito abogado para reclamar?',
        a: 'Para el reclamo interno y la denuncia ante SSSalud y Defensa del Consumidor, no. Para un amparo judicial sí, aunque muchas defensorías públicas y colegios de abogados ofrecen patrocinio gratuito para amparos de salud.',
      },
    ],
    keywords: ['como reclamar a una prepaga', 'denuncia sssalud prepaga', 'prepaga me niega cobertura que hacer', 'amparo salud prepaga'],
    relacionadas: ['que-cubre-la-prepaga', 'preexistencias-que-son-como-funcionan', 'baja-de-prepaga-proceso'],
  },
  {
    slug: 'prepaga-para-embarazadas',
    titulo: 'Prepaga para embarazadas: cobertura completa de maternidad 2026',
    metaDescripcion: 'Todo sobre la cobertura de maternidad en prepagas: controles prenatales, parto, neonatología y qué prepagas cubren mejor el embarazo en Argentina.',
    tiempoLectura: 9,
    categoria: 'Perfiles',
    fechaActualizacion: '2026-07-14',
    contenido: {
      intro: 'El embarazo es el momento en que más se nota la diferencia entre prepagas: misma ley, pero experiencias totalmente distintas en calidad de maternidades, acceso al obstetra y neonatología. Y hay un dato que cambia todo: el Plan Materno Infantil tiene cobertura del 100% por ley, sin copagos y sin carencias. Esta guía explica qué te corresponde y dónde conviene atenderte.',
      secciones: [
        {
          titulo: 'Qué cubre cualquier prepaga por ley (100%, sin copagos)',
          cuerpo: 'El Plan Materno Infantil del PMO cubre al 100%: todos los controles prenatales, los análisis y ecografías del embarazo, el parto vaginal o la cesárea, la internación de la madre, la atención del recién nacido hasta el año de vida (controles, vacunas del calendario, leche medicamentosa si hay indicación) y la internación neonatal si hace falta. No pueden cobrarte copagos por nada de esto ni aplicarte períodos de carencia sobre estas prestaciones.',
        },
        {
          titulo: 'Contratar estando embarazada: qué dice la ley y qué pasa en la práctica',
          cuerpo: 'La Ley 26.682 prohíbe rechazar afiliaciones por preexistencia, y el embarazo se considera una: te tienen que aceptar. La empresa puede aplicar una cuota diferencial autorizada por la SSSalud durante un período, pero no puede negarte la cobertura del parto. En la práctica, algunas empresas dilatan o desinforman en el proceso comercial: si te dicen que "el parto no está cubierto por carencia", eso contradice el régimen del PMO y es reclamable ante la SSSalud.',
        },
        {
          titulo: 'Las mejores maternidades por prepaga',
          cuerpo: 'Swiss Medical juega en su propia liga con maternidades propias (Sanatorio de la Trinidad, Suizo Argentina) y neonatología de máxima complejidad. CEMIC ofrece una maternidad universitaria de referencia, ideal para embarazos de alto riesgo. Hospital Italiano tiene su propio plan con acceso directo a una de las mejores neonatologías del país. OSDE no tiene sanatorios propios pero su cartilla incluye casi todas las maternidades top (Alemán, Otamendi, Mater Dei). En el interior, Sancor Salud y Avalian tienen los mejores convenios provinciales.',
        },
        {
          titulo: 'Qué mirar al elegir si estás planificando',
          cuerpo: 'Cuatro preguntas concretas: ¿qué maternidad me toca con este plan y dónde queda? ¿Mi obstetra de confianza atiende por cartilla o tendría que pagar la diferencia? ¿Qué nivel de neonatología tiene la maternidad asignada (importa más que la hotelería)? ¿La habitación individual está incluida o es prestación superadora de un plan más caro? Si estás planificando con tiempo, contratá antes del embarazo: evitás la cuota diferencial por preexistencia y elegís con calma.',
        },
      ],
      conclusion: 'Embarazada o planificando, tenés más derechos de los que las prepagas suelen contar: cobertura del parto al 100% sin copagos, afiliación que no pueden rechazarte y un año completo de cobertura total para el bebé. La diferencia real entre prepagas está en la calidad de la maternidad y la neonatología: elegí por eso, no por el marketing.',
    },
    faq: [
      {
        q: '¿Puedo afiliarme a una prepaga estando embarazada?',
        a: 'Sí, no pueden rechazarte: el embarazo es una preexistencia y la Ley 26.682 prohíbe el rechazo por preexistencias. Pueden aplicar una cuota diferencial autorizada, pero deben cubrir el parto y toda la atención del embarazo.',
      },
      {
        q: '¿La prepaga cubre la cesárea y la anestesia peridural?',
        a: 'Sí, al 100%. El Plan Materno Infantil cubre el parto en todas sus modalidades, incluida la cesárea con indicación médica y la analgesia. También la internación y los honorarios del equipo por cartilla.',
      },
      {
        q: '¿Qué pasa si mi bebé necesita neonatología?',
        a: 'La internación neonatal está cubierta al 100% sin límite de días, en la unidad que corresponda a la complejidad del caso. Si la maternidad donde nació no tiene el nivel necesario, la prepaga debe cubrir el traslado y la internación en un centro de mayor complejidad.',
      },
    ],
    keywords: ['prepaga para embarazadas', 'prepaga cubre parto', 'plan materno infantil prepaga', 'mejor prepaga maternidad 2026'],
    relacionadas: ['mejor-prepaga-para-familias', 'prepaga-sin-periodo-carencia', 'preexistencias-que-son-como-funcionan'],
    prepagasRelacionadas: ['swiss-medical', 'cemic', 'hospital-italiano', 'osde'],
  },
  {
    slug: 'mejor-prepaga-para-familias',
    titulo: 'Mejor prepaga para familias en Argentina 2026',
    metaDescripcion: 'Análisis de las mejores prepagas para grupos familiares: cobertura pediátrica, maternidad, precio por grupo y cuál conviene según cuántos integrantes tenés.',
    tiempoLectura: 10,
    categoria: 'Perfiles',
    fechaActualizacion: '2026-07-14',
    contenido: {
      intro: 'Elegir prepaga para una familia es un problema distinto a elegirla para uno solo: el precio se multiplica por cada integrante, la pediatría pasa a ser el servicio más usado y la maternidad puede volver a importar. La buena noticia: los grupos familiares tienen descuentos y la competencia por las familias es fuerte. Acá va el análisis completo con precios de julio 2026.',
      secciones: [
        {
          titulo: 'Cómo se calcula el precio de un grupo familiar',
          cuerpo: 'Cada integrante suma su tarifa según edad: los adultos pagan tarifa plena y los menores de 18 pagan entre el 40% y el 70% de un adulto joven. La mayoría de las empresas aplica descuentos progresivos a partir del tercer integrante. Una familia tipo (dos adultos de 35 y dos hijos menores) paga aproximadamente 2,8 a 3,2 veces la tarifa individual de referencia: desde ~$600.000/mes en un plan económico hasta $1.300.000+ en uno premium.',
        },
        {
          titulo: 'Lo que más importa con hijos: pediatría y urgencias',
          cuerpo: 'Con chicos, el 80% del uso de la prepaga son pediatría, vacunas y guardias. Evaluá: disponibilidad de turnos pediátricos (la diferencia entre 2 días y 3 semanas de espera), guardia pediátrica propia o de referencia cerca de tu casa, y vacunatorio incluido. Swiss Medical y OSDE lideran en red pediátrica en AMBA; en el interior, Sancor Salud y Avalian tienen la mejor capilaridad. La telemedicina pediátrica (Cam Doctor de Medifé la tiene muy lograda) resuelve la mitad de las consultas nocturnas sin moverte de tu casa.',
        },
        {
          titulo: 'Recomendaciones por presupuesto (julio 2026)',
          cuerpo: 'Presupuesto ajustado: Sancor Salud plan medio o Federada, con buena pediatría a precio contenido, especialmente fuera de AMBA. Presupuesto medio: Galeno Plata 300 ($307.804 base individual) con acceso a los sanatorios Trinidad, o Medifé Bronce con Finochietto y Cam Doctor. Presupuesto alto: Swiss Medical SMG20 ($325.467 base) por sus sanatorios propios y maternidades, u OSDE 310 ($345.310) por la red pediátrica más grande del país. El Hospital Italiano tiene planes familiares con acceso directo a su hospital, una opción excelente si vivís cerca de sus sedes.',
        },
        {
          titulo: 'Trucos para bajar la cuota familiar',
          cuerpo: 'Derivá los aportes de los dos adultos si ambos trabajan en relación de dependencia: las contribuciones de ambos se suman y descuentan de la cuota total. Revisá la edad de los hijos: al cumplir 18-21 pasan a tarifa adulta y muchas familias no lo anticipan; algunas empresas ofrecen tarifas de "hijo joven" hasta los 25 si estudia. Y recotizá el grupo completo una vez por año: los descuentos comerciales para captar familias son agresivos y tu prepaga actual puede igualarlos si se lo pedís.',
        },
      ],
      conclusion: 'Para familias, la decisión correcta pesa más la red pediátrica y las urgencias que el nombre de la prepaga. Con dos sueldos en relación de dependencia derivando aportes, un plan medio de calidad queda al alcance de la mayoría de las familias. Cotizá el grupo completo, no sumes tarifas individuales: los descuentos cambian el número final.',
    },
    faq: [
      {
        q: '¿Cuánto cuesta una prepaga para una familia de 4 en 2026?',
        a: 'Entre ~$600.000/mes en planes económicos y más de $1.300.000 en premium, para dos adultos de 35 y dos hijos menores (julio 2026). Derivando los aportes de ambos adultos el número baja considerablemente.',
      },
      {
        q: '¿Los recién nacidos pagan cuota?',
        a: 'El recién nacido debe ser dado de alta en el plan (avisá dentro de los plazos de la empresa para que quede cubierto desde el nacimiento). Paga tarifa de menor, y su primer año de atención está cubierto al 100% por el Plan Materno Infantil.',
      },
      {
        q: '¿Qué pasa con la cuota cuando mis hijos cumplen 18?',
        a: 'Pasan a tarifa de adulto joven, lo que puede subir el costo del grupo un 30-50%. Algunas prepagas mantienen tarifa diferencial hasta los 25 años si acreditan estudios. Es el momento típico para recotizar todo el grupo.',
      },
    ],
    keywords: ['mejor prepaga para familia', 'prepaga familiar precio 2026', 'prepaga con buena pediatria', 'descuento grupo familiar prepaga'],
    relacionadas: ['prepaga-para-embarazadas', 'cuota-prepaga-por-edad', 'derivar-obra-social-a-prepaga'],
    prepagasRelacionadas: ['swiss-medical', 'osde', 'sancor-salud', 'medife'],
  },
  {
    slug: 'prepaga-para-mayores-60',
    titulo: 'Las mejores prepagas para mayores de 60 años en 2026',
    metaDescripcion: 'Guía completa sobre prepagas para jubilados y personas mayores: precios por edad, cobertura de medicamentos, enfermedades crónicas y cómo no pagar de más.',
    tiempoLectura: 9,
    categoria: 'Perfiles',
    fechaActualizacion: '2026-07-14',
    contenido: {
      intro: 'Después de los 60, el mercado de prepagas se da vuelta: los precios de ingreso se disparan, PAMI aparece como alternativa y la cobertura de medicamentos pasa a ser el rubro que define el gasto mensual. Pero hay más opciones de las que parece: planes senior específicos, la prepaga complementaria a PAMI y una protección legal por antigüedad que vale oro.',
      secciones: [
        {
          titulo: 'La regla de oro: la antigüedad te protege',
          cuerpo: 'Si ya tenés prepaga, pensalo dos veces antes de darte de baja "para ahorrar unos meses": la Ley 26.682 congela los aumentos por edad para mayores de 65 con 10+ años de antigüedad continua en la misma empresa. Quien corta la afiliación y quiere volver a los 68 paga tarifa de ingreso senior, que puede duplicar lo que pagaba. La continuidad es el activo más valioso que tiene un afiliado mayor.',
        },
        {
          titulo: 'Ingresar después de los 60: qué esperar',
          cuerpo: 'No pueden rechazarte por edad, pero el precio de ingreso es alto: para un plan medio, una persona de 65 puede pagar 2 a 2,5 veces la tarifa de referencia de 30 años, es decir $600.000-$800.000/mes en el segmento medio (julio 2026). Los planes por etapa de vida suelen convenir más que el ingreso general: el Plan Mayor del Hospital Italiano (60+) y las líneas senior de CEMIC están diseñados para este segmento con precios más razonables que el plan general equivalente.',
        },
        {
          titulo: 'La opción inteligente para jubilados: PAMI + complementaria',
          cuerpo: 'Todo jubilado tiene PAMI, y muchas prepagas ofrecen planes "complementarios" que cubren lo que PAMI hace lento o mal (turnos con especialistas, sanatorios privados, habitación individual) por una fracción del precio de un plan completo, porque PAMI sigue siendo el cobertor de fondo. Si el presupuesto no alcanza para un plan pleno, la complementaria es el mejor precio-calidad para mayores de 65. Preguntá específicamente por esta modalidad: no siempre la ofrecen de entrada.',
        },
        {
          titulo: 'Qué cobertura mirar con lupa a esta edad',
          cuerpo: 'Medicamentos: es el rubro decisivo; el PMO cubre 70% en crónicos, pero las diferencias en vademécum y descuentos extra importan (Luis Pasteur con 60% general en farmacia es fuerte acá). Cardiología y alta complejidad: verificá qué centros cardiovasculares están en cartilla (ICBA, Favaloro, Trinidad). Internación domiciliaria y rehabilitación: cobertura clave post-quirúrgica que varía mucho entre planes. Y turnos: de nada sirve una cartilla enorme si el cardiólogo da turno a 60 días.',
        },
      ],
      conclusion: 'Para mayores de 60 la estrategia depende del punto de partida: si ya tenés prepaga, cuidá tu antigüedad como un tesoro; si sos jubilado sin prepaga, la complementaria a PAMI es el mejor punto de entrada; y si vas a ingresar a un plan pleno, compará los planes senior específicos antes que los generales. En todos los casos, la cobertura de medicamentos es el número que más impacta tu bolsillo mensual.',
    },
    faq: [
      {
        q: '¿Una prepaga puede rechazarme por tener 70 años?',
        a: 'No puede rechazarte por edad ni por preexistencias. Sí puede aplicar tarifas de ingreso altas para esa edad. Compará varias empresas: la dispersión de precios senior es enorme, y los planes específicos para mayores suelen ser más accesibles.',
      },
      {
        q: '¿Conviene dejar la prepaga cuando me jubilo y quedarme solo con PAMI?',
        a: 'Si tenés 10+ años de antigüedad y podés pagarla, conservarla suele convenir: perdés la protección por antigüedad si te vas. Si el costo es inmanejable, evaluá bajar de plan dentro de la misma empresa o pasar a un plan complementario a PAMI antes que la baja total.',
      },
      {
        q: '¿Qué cubre PAMI que no cubra una prepaga?',
        a: 'PAMI cubre el PMO como cualquier cobertura, con fortaleza en medicamentos (muchos al 100% para jubilados). Su debilidad son los tiempos y la red. La prepaga complementaria ataca exactamente eso: acceso rápido y sanatorios privados, dejando en PAMI lo que PAMI hace bien.',
      },
    ],
    keywords: ['prepaga para mayores de 60', 'prepaga jubilados 2026', 'prepaga complementaria pami', 'prepaga adultos mayores precio'],
    relacionadas: ['cuota-prepaga-por-edad', 'prepagas-economicas', 'como-cambiar-de-prepaga'],
    prepagasRelacionadas: ['hospital-italiano', 'cemic', 'luis-pasteur'],
  },
  {
    slug: 'como-contratar-prepaga-online',
    titulo: 'Cómo contratar una prepaga online: paso a paso 2026',
    metaDescripcion: 'Guía completa para contratar tu prepaga por internet en Argentina. Documentación necesaria, plazos, carencias y cómo evitar errores al afiliarte.',
    tiempoLectura: 7,
    categoria: 'Trámites',
    fechaActualizacion: '2026-07-14',
    contenido: {
      intro: 'Contratar una prepaga ya no requiere pisar una sucursal: todas las empresas grandes permiten completar la afiliación online, y algunas (Avalian, Medifé, Sancor) tienen el proceso 100% digital de punta a punta. Pero el orden importa: cotizar bien antes de dar tus datos te evita semanas de llamados comerciales y te asegura el mejor precio para tu situación.',
      secciones: [
        {
          titulo: 'Antes de dar tus datos: compará con precios reales',
          cuerpo: 'El error clásico es pedir cotización en cinco webs de prepagas y quedar en cinco bases de datos comerciales. Primero compará precios reales entre empresas y planes (para eso existe PrepagaYa: precios publicados sin dejar tu DNI), definí 2 o 3 candidatos, y recién ahí iniciá el contacto formal. Llegás a la conversación comercial sabiendo cuánto cuesta lo que querés, que es la mejor posición para negociar bonificaciones de ingreso.',
        },
        {
          titulo: 'La documentación que vas a necesitar',
          cuerpo: 'Para todos: DNI de cada integrante y datos de contacto. Según tu situación laboral: recibo de sueldo (si derivás aportes en relación de dependencia), constancia de inscripción y último pago de monotributo, o constancia de autónomos. Y la declaración jurada de salud, que completa cada adulto del grupo. Todo se sube en foto o PDF; ninguna empresa seria exige originales en papel para el alta.',
        },
        {
          titulo: 'La declaración jurada de salud: el paso que define todo',
          cuerpo: 'Es el formulario donde declarás enfermedades, cirugías, tratamientos y medicación actual. Completala con verdad total: no pueden rechazarte por lo que declares (la ley lo prohíbe), pero sí pueden desconocer coberturas futuras si demuestran que ocultaste algo. Una preexistencia declarada puede implicar una cuota diferencial temporal; una ocultada puede costarte la cobertura cuando más la necesites. Es el único punto del trámite donde un error sale caro.',
        },
        {
          titulo: 'Plazos y primer uso de la cobertura',
          cuerpo: 'Entre que enviás la documentación completa y tenés el alta, pasan entre 3 y 15 días hábiles según la empresa. La cobertura arranca en la fecha que figura en tu alta (generalmente el 1° del mes siguiente al primer pago). Desde el día uno tenés derecho a todas las prestaciones del PMO sin carencias. Descargá la credencial digital en la app de la empresa el mismo día del alta y verificá que todo el grupo figure activo antes de dar de baja tu cobertura anterior.',
        },
      ],
      conclusion: 'Contratar online es rápido si llegás con el trabajo hecho: comparación de precios primero, candidatos definidos, documentación digitalizada y declaración jurada completada con verdad. De la cotización al alta pasan menos de dos semanas, y tu cobertura PMO arranca completa desde el primer día.',
    },
    faq: [
      {
        q: '¿Es seguro contratar una prepaga por internet?',
        a: 'Sí, todas las empresas reguladas por la SSSalud ofrecen contratación online válida. Verificá siempre estar en el dominio oficial de la empresa y desconfiá de "promotores" que piden datos por WhatsApp sin pertenecer a un canal oficial.',
      },
      {
        q: '¿Me pueden pedir un examen médico para afiliarme?',
        a: 'Algunas empresas piden un examen de admisión o auditoría médica para ciertos planes o edades. Es legal como evaluación, pero el resultado no puede usarse para rechazarte: solo para encuadrar preexistencias con valores diferenciales autorizados.',
      },
      {
        q: '¿Cuándo empiezo a estar cubierto?',
        a: 'Desde la fecha de vigencia de tu alta, que suele ser el 1° del mes siguiente al primer pago. Las prestaciones del PMO no tienen carencia; las superadoras del plan (ortodoncia, estética, habitación individual) pueden tener esperas contractuales.',
      },
    ],
    keywords: ['contratar prepaga online', 'como afiliarse a una prepaga', 'requisitos prepaga 2026', 'alta prepaga documentacion'],
    relacionadas: ['como-afiliarse-prepaga-requisitos', 'como-cambiar-de-prepaga', 'preexistencias-que-son-como-funcionan'],
  },
  {
    slug: 'derivar-obra-social-a-prepaga',
    titulo: 'Cómo derivar tu obra social a una prepaga: guía 2026',
    metaDescripcion: 'Aprendé cómo funciona la derivación de aportes de tu obra social a una prepaga en Argentina. Qué prepagas lo aceptan, requisitos y diferencia de costos.',
    tiempoLectura: 8,
    categoria: 'Trámites',
    fechaActualizacion: '2026-07-14',
    contenido: {
      intro: 'La derivación de aportes es el mecanismo más poderoso (y menos entendido) para pagar menos por tu prepaga: si trabajás en relación de dependencia, tus aportes de obra social pueden ir a la prepaga que elijas, descontándose de la cuota, y encima accedés a la lista de precios sin IVA. El mismo plan puede costarte 30-40% menos. Así funciona.',
      secciones: [
        {
          titulo: 'Qué es exactamente la derivación de aportes',
          cuerpo: 'De tu sueldo bruto, el 3% va a una obra social, y tu empleador suma otro 6%. Ese 9% total es tuyo: la ley te permite dirigirlo a la entidad que elijas. Cuando lo derivás a una prepaga, la empresa toma tus aportes como parte de pago y te factura solo la diferencia hasta el valor del plan. Cuanto más alto tu sueldo, mayor el aporte y menor la diferencia que pagás de bolsillo.',
        },
        {
          titulo: 'El doble ahorro: aportes + IVA',
          cuerpo: 'La derivación tiene dos descuentos acumulados. Primero, tus aportes se restan del precio. Segundo, el precio base es otro: la lista "deriva aporte" no incluye el IVA del 21% que sí paga la contratación particular. Ejemplo real con Galeno (julio 2026): el plan Plata 300 cuesta $307.804 particular y $195.527 con aportes, un 36% menos, antes incluso de considerar sueldos altos con aportes que cubren más.',
        },
        {
          titulo: 'El trámite paso a paso',
          cuerpo: 'Uno: cotizá el plan en modalidad "con aportes" o "deriva aporte", con tu recibo de sueldo a mano. Dos: la prepaga te hace firmar el formulario de opción de cambio de obra social, que gestiona ella misma ante la SSSalud. Tres: el cambio impacta en hasta 90 días corridos, pero la cobertura de la prepaga arranca antes según el acuerdo comercial (la mayoría te cubre desde el primer mes facturado). Requisitos: un año de antigüedad en la obra social de origen para el primer cambio, y solo un cambio de obra social por año calendario.',
        },
        {
          titulo: 'Casos particulares: pareja, cambio de trabajo, despido',
          cuerpo: 'Si los dos trabajan en relación de dependencia, pueden unificar ambos aportes en el mismo plan familiar: los dos descuentos se suman. Si cambiás de trabajo, la derivación te sigue: informá el nuevo empleador a la prepaga para que los aportes no se corten. Si te quedás sin trabajo, tenés derecho a la cobertura de la obra social por 3 meses post-despido con aportes; después, la prepaga te ofrecerá recontratar como particular o monotributista, un buen momento para recotizar todo.',
        },
      ],
      conclusion: 'Si estás en relación de dependencia y pagás tu prepaga como particular, estás pagando de más: la derivación descuenta tus aportes y elimina el IVA del precio. El trámite lo gestiona la propia prepaga y el ahorro es inmediato. Cotizá siempre en las dos modalidades para ver la diferencia con tus números reales.',
    },
    faq: [
      {
        q: '¿Pierdo mi obra social si derivo los aportes a una prepaga?',
        a: 'Tus aportes pasan a financiar el plan de la prepaga (en rigor, vía la obra social con la que la prepaga articula o directamente si está registrada). Si algún día querés volver a una obra social pura, podés ejercer la opción de cambio nuevamente, respetando el límite de un cambio por año.',
      },
      {
        q: '¿Todas las prepagas aceptan derivación de aportes?',
        a: 'Las principales sí: Swiss Medical, OSDE, Galeno, Medifé, Sancor Salud, Omint, Medicus, Avalian y la mayoría del mercado trabajan con aportes. Las diferencias están en qué planes habilitan para la modalidad y los mínimos de aporte que exigen.',
      },
      {
        q: '¿Qué pasa si mi aporte supera el valor del plan?',
        a: 'Si tus aportes superan la cuota, no pagás diferencia de bolsillo. El excedente no se devuelve en efectivo, pero muchas empresas permiten aplicarlo a upgrades de plan o a integrantes adicionales del grupo.',
      },
    ],
    keywords: ['derivar aportes a prepaga', 'derivacion obra social prepaga', 'prepaga con aportes precio', 'plan deriva aporte'],
    relacionadas: ['obra-social-vs-prepaga', 'prepagas-para-monotributistas', 'como-cambiar-de-prepaga'],
    prepagasRelacionadas: ['galeno', 'swiss-medical', 'medife'],
  },
  {
    slug: 'prepaga-sin-periodo-carencia',
    titulo: 'Prepagas sin período de carencia: ¿existen en Argentina? 2026',
    metaDescripcion: 'Qué es el período de carencia en las prepagas, cuánto dura, cómo se puede reducir y qué prepagas ofrecen las menores esperas para tener cobertura completa.',
    tiempoLectura: 7,
    categoria: 'Cobertura',
    fechaActualizacion: '2026-07-14',
    contenido: {
      intro: 'El "período de carencia" es probablemente el concepto más malinterpretado del sistema: la mayoría de los afiliados cree que debe esperar meses para usar su prepaga nueva. La realidad legal es otra: las carencias están prohibidas para todo el PMO. Lo que sí existe son esperas para prestaciones superadoras. Saber distinguirlas te evita que te vendan miedo.',
      secciones: [
        {
          titulo: 'La regla legal: cero carencia en el PMO',
          cuerpo: 'El artículo 10 de la Ley 26.682 es explícito: los contratos entre prepagas y usuarios no pueden incluir períodos de carencia para las prestaciones del Programa Médico Obligatorio. Consultas, estudios, urgencias, internación, parto, oncología, medicación crónica: todo eso te cubre desde el día uno de vigencia del contrato, en cualquier prepaga, sin excepción. Cualquier cláusula en contrario es nula.',
        },
        {
          titulo: 'Dónde sí hay esperas: las prestaciones superadoras',
          cuerpo: 'Las carencias legales solo aplican a lo que excede el PMO: ortodoncia y implantes dentales (típicamente 6-12 meses de espera), cirugía estética (12-24 meses, como el plan Oro de Medifé que pide 2 años de antigüedad), cobertura internacional en algunos planes, y reintegros ampliados. Cada empresa define estas esperas en el contrato: leelas antes de firmar si alguna de estas prestaciones es tu motivo de contratación.',
        },
        {
          titulo: 'Cómo reducir o eliminar las esperas superadoras',
          cuerpo: 'Tres vías: la continuidad de cobertura (si venís de otra prepaga con plan equivalente, presentá el certificado de cobertura previa; muchas empresas reconocen tu antigüedad y levantan las esperas), las campañas comerciales (las prepagas bonifican carencias para captar afiliados, especialmente en planes medios y altos: pedilo explícitamente, es negociable), y la contratación corporativa (los convenios de empresa suelen entrar sin esperas de ningún tipo).',
        },
        {
          titulo: 'Señal de alarma: cuando te "informan" carencias ilegales',
          cuerpo: 'Si un vendedor te dice que "los primeros 3 meses no cubrís internación" o que "el parto tiene 10 meses de carencia", estás ante información falsa: ambas son prestaciones PMO sin carencia posible. Puede ser desconocimiento del vendedor o táctica para desalentar afiliados que van a usar el servicio pronto. En cualquier caso: pedilo por escrito (no van a poder), y si figura en un contrato, es nulo y denunciable ante la SSSalud.',
        },
      ],
      conclusion: 'Todas las prepagas de Argentina son "sin carencia" para lo que importa: el PMO te cubre desde el primer día por ley. Las únicas esperas legales son sobre prestaciones superadoras, y hasta esas son negociables con certificado de cobertura previa o en campañas comerciales. Que el miedo a la carencia no te ate a una prepaga que ya no te conviene.',
    },
    faq: [
      {
        q: '¿Si me afilio hoy y mañana necesito una cirugía, me cubre?',
        a: 'Si la cirugía es una prestación del PMO con indicación médica, sí: no puede haber carencia. La empresa puede auditar la indicación (autorización previa), pero no negarla por ser afiliado reciente. Distinto es si la condición fue ocultada en la declaración jurada.',
      },
      {
        q: '¿El embarazo tiene período de carencia?',
        a: 'No. El Plan Materno Infantil es PMO: controles, parto y atención del bebé están cubiertos al 100% sin carencia. Si estabas embarazada al afiliarte, es una preexistencia que debe declararse, pero la cobertura del parto no puede negarse.',
      },
      {
        q: '¿Qué prestaciones suelen tener carencia contractual?',
        a: 'Ortodoncia e implantes (6-12 meses), cirugía estética (12-24 meses), reintegros ampliados y cobertura internacional en algunos planes. Son siempre prestaciones por encima del PMO y cada contrato define sus plazos.',
      },
    ],
    keywords: ['prepaga sin carencia', 'periodo de carencia prepaga', 'carencia prepaga ilegal PMO', 'cuanto dura la carencia prepaga'],
    relacionadas: ['que-cubre-la-prepaga', 'como-cambiar-de-prepaga', 'preexistencias-que-son-como-funcionan'],
  },
  {
    slug: 'preexistencias-que-son-como-funcionan',
    titulo: 'Preexistencias en prepagas: qué son y cómo te afectan en 2026',
    metaDescripcion: 'Guía completa sobre las preexistencias en prepagas en Argentina: qué condiciones se consideran, cuánto tiempo duran las restricciones y cuáles son tus derechos.',
    tiempoLectura: 9,
    categoria: 'Derechos',
    fechaActualizacion: '2026-07-14',
    contenido: {
      intro: 'Una enfermedad preexistente no te deja fuera del sistema privado de salud: desde la Ley 26.682, ninguna prepaga puede rechazarte por tu historia clínica. Lo que sí pueden hacer es cobrarte un valor diferencial autorizado por el Estado. Entender exactamente cómo funciona este régimen te permite afiliarte con enfermedades crónicas sin sustos ni cláusulas abusivas.',
      secciones: [
        {
          titulo: 'Qué es una preexistencia (y qué no)',
          cuerpo: 'Preexistencia es toda condición de salud diagnosticada o con síntomas evidentes antes de la firma del contrato: diabetes, hipertensión, asma, enfermedades cardíacas, oncológicas en tratamiento o remisión, embarazo en curso, y también cirugías programadas pendientes. No son preexistencias las condiciones que aparecen después de afiliarte, aunque sea a la semana: para eso está el seguro. La detección se hace mediante tu declaración jurada de salud al ingresar.',
        },
        {
          titulo: 'Tus derechos: te tienen que aceptar, con cobertura completa',
          cuerpo: 'La Ley 26.682 prohíbe rechazar la afiliación por preexistencias, y además obliga a cubrirlas: la prepaga no puede excluir de la cobertura tu enfermedad declarada. Lo único que la ley permite es que la SSSalud autorice valores diferenciales de cuota para preexistencias de alto costo. En la práctica: te aceptan, te cubren la condición, y podés pagar una cuota mayor a la estándar durante un período o de forma permanente según el caso.',
        },
        {
          titulo: 'La declaración jurada: el documento que define tu relación con la prepaga',
          cuerpo: 'Todo gira alrededor de la DDJJ de salud. Declarar todo te protege: lo declarado está cubierto y no pueden alegar nada después. Ocultar te expone: si la empresa demuestra falsedad u omisión maliciosa (una internación previa que no mencionaste, medicación crónica que ya tomabas), puede desconocer la cobertura de esa condición e incluso rescindir el contrato. Ante la duda entre declarar o no un episodio menor: declaralo. El costo de una cuota diferencial es siempre menor al de una cobertura desconocida.',
        },
        {
          titulo: 'Estrategias si tenés una condición crónica',
          cuerpo: 'Compará el trato de la preexistencia entre empresas, no solo el precio: ante la misma diabetes, una empresa puede ofrecerte cuota estándar con programa de seguimiento (Swiss Medical y OSDE tienen programas de crónicos muy desarrollados) y otra un diferencial alto. Pedí por escrito cómo queda cubierta tu condición: medicación, especialistas, insumos. Y si una empresa te "desalienta" verbalmente por tu condición (te dicen que no hay vacantes, dilatan eternamente), eso es un rechazo encubierto ilegal: denunciable ante la SSSalud.',
        },
      ],
      conclusion: 'Las preexistencias cambiaron de régimen hace más de una década, pero el mito del rechazo sigue vivo. La realidad legal: te aceptan, te cubren la condición, y a lo sumo pagás un diferencial autorizado. Tu única obligación es la verdad en la declaración jurada, y tu mejor jugada es comparar cómo trata tu condición específica cada empresa antes de elegir.',
    },
    faq: [
      {
        q: '¿La prepaga puede negarse a cubrir mi enfermedad preexistente?',
        a: 'No. Debe cubrir la condición declarada como cualquier otra patología, incluyendo medicación e insumos según el PMO. Lo único permitido es una cuota diferencial autorizada por la SSSalud, no la exclusión de cobertura.',
      },
      {
        q: '¿Cuánto más cara es la cuota con una preexistencia?',
        a: 'Depende de la condición y la empresa: los valores diferenciales deben estar autorizados por la SSSalud. Para condiciones controladas (hipertensión medicada, diabetes tipo 2 estable) muchas empresas no aplican diferencial. Compará entre empresas: el criterio varía mucho.',
      },
      {
        q: '¿Qué pasa si no declaré algo sin mala intención?',
        a: 'La empresa debe probar que la omisión fue maliciosa para desconocer coberturas. Un olvido menor de buena fe (una consulta aislada de hace años) difícilmente lo sea. Igualmente, ante cualquier omisión que detectes después de afiliarte, conviene informarla espontáneamente para blindar tu cobertura.',
      },
    ],
    keywords: ['preexistencias prepaga', 'prepaga con enfermedad preexistente', 'declaracion jurada salud prepaga', 'pueden rechazarme por preexistencia'],
    relacionadas: ['como-reclamar-a-una-prepaga', 'prepaga-sin-periodo-carencia', 'que-cubre-la-prepaga'],
  },
  {
    slug: 'prepaga-para-freelancers-autonomos',
    titulo: 'Mejor prepaga para freelancers y autónomos en Argentina 2026',
    metaDescripcion: 'Si trabajás de manera independiente, conocé las mejores opciones de cobertura médica para freelancers y autónomos en Argentina. Precios, requisitos y cómo contratar.',
    tiempoLectura: 8,
    categoria: 'Perfiles',
    fechaActualizacion: '2026-07-14',
    contenido: {
      intro: 'Trabajar por tu cuenta significa que nadie te resuelve la cobertura médica: no hay empleador, no hay obra social automática, y el precio depende de cómo estés inscripto ante el fisco. La diferencia entre contratar bien y mal como independiente puede superar el 40% de la cuota. Esta guía ordena las opciones según tu situación fiscal: monotributista, autónomo o informal.',
      secciones: [
        {
          titulo: 'Si sos monotributista: usá tu componente de obra social',
          cuerpo: 'Es la situación más favorable: tu monotributo ya incluye un aporte de salud que podés dirigir a la prepaga (directamente o vía convenio), descontándolo de la cuota, y en general accedés a precios sin IVA. Cotizá siempre "como monotributista": es la palabra clave que activa la lista de precios correcta. Con aportes derivados, un plan medio como Galeno Plata 300 baja de $307.804 a alrededor de $195.527 (julio 2026).',
        },
        {
          titulo: 'Si sos autónomo puro: contratación particular con deducción',
          cuerpo: 'Los autónomos del régimen general no tienen componente de obra social derivable, así que contratan como particulares con IVA incluido. Tu compensación está en Ganancias: las cuotas se deducen hasta el 5% de tu ganancia neta anual, lo que en la práctica recupera una parte relevante del costo. Facturá la prepaga a tu nombre y guardá los comprobantes: esa deducción es tuya por derecho.',
        },
        {
          titulo: 'Los planes que mejor le calzan al trabajo independiente',
          cuerpo: 'El trabajo freelance valora dos cosas: telemedicina resolutiva (consultas sin perder medio día de trabajo) y cobertura donde sea que estés. Medifé Indie fue diseñado explícitamente para independientes de AMBA, y su Cam Doctor resuelve consultas en minutos. Los planes digitales de Medicus (Conecta) apuntan al mismo perfil. Si viajás seguido por el país, priorizá cobertura nacional real: Sancor Salud, Avalian o Federada por sobre las AMBA-céntricas. Y si facturás en dólares y querés lo mejor: OSDE 310 o Swiss SMG20 siguen siendo el estándar.',
        },
        {
          titulo: 'Estabilidad de ingresos variables: cómo protegerte',
          cuerpo: 'El riesgo del freelancer no es el precio de hoy sino el mes flojo de mañana. Tres coberturas ante eso: elegí un plan que puedas pagar en tu peor mes, no en el mejor; conocé la política de mora de tu empresa (la rescisión por falta de pago requiere intimación previa, y siempre es mejor pedir un plan de pagos antes de cortar); y si venís de una relación de dependencia reciente, recordá que tu ex obra social te cubre 3 meses post-baja, un puente útil mientras armás tu esquema independiente.',
        },
      ],
      conclusion: 'Para el independiente, la situación fiscal define la estrategia: el monotributista deriva su aporte y esquiva el IVA; el autónomo contrata particular pero recupera por Ganancias. En ambos casos, los planes pensados para independientes (Medifé Indie, Medicus Conecta) y las prepagas con cobertura nacional real son el mejor calce para esta forma de trabajar.',
    },
    faq: [
      {
        q: '¿Un freelancer sin monotributo puede contratar una prepaga?',
        a: 'Sí, cualquier persona puede contratar como particular pagando la lista con IVA. Ninguna prepaga exige situación fiscal específica para la contratación directa. Eso sí: regularizarte como monotributista casi siempre te termina saliendo más barato por el aporte derivable.',
      },
      {
        q: '¿Qué categoría de monotributo me conviene para la prepaga?',
        a: 'La categoría se define por tu facturación, no por la prepaga. Lo relevante es que cualquier categoría te permite derivar el componente de salud. A mayor categoría, mayor aporte y menor diferencia de bolsillo con la prepaga.',
      },
      {
        q: '¿Las prepagas cubren mientras trabajo desde el exterior?',
        a: 'La cobertura regular es dentro de Argentina. Para nomadismo digital necesitás un plan con asistencia al viajero incluida (los planes altos de Omint, Swiss, OSDE y Medifé Platinum la tienen) o contratar asistencia internacional aparte para tus estadías afuera.',
      },
    ],
    keywords: ['prepaga para freelancers', 'prepaga autonomos argentina', 'medife indie precio', 'prepaga trabajador independiente'],
    relacionadas: ['prepagas-para-monotributistas', 'deducir-prepaga-ganancias', 'obra-social-vs-prepaga'],
    prepagasRelacionadas: ['medife', 'medicus', 'sancor-salud', 'avalian'],
  },
  {
    slug: 'baja-de-prepaga-proceso',
    titulo: 'Cómo darse de baja de una prepaga: proceso completo 2026',
    metaDescripcion: 'Pasos para dar de baja tu prepaga en Argentina: plazos, documentación, carta documento y cómo evitar que te sigan cobrando. Guía actualizada.',
    tiempoLectura: 6,
    categoria: 'Trámites',
    fechaActualizacion: '2026-07-14',
    contenido: {
      intro: 'Darte de baja de una prepaga es un derecho sin condiciones: no hay permanencia mínima, no hay multa y no pueden exigirte que vayas a una sucursal a "conversarlo". Desde la regulación del botón de baja, el trámite es online y debe resolverse rápido. El problema real no es la baja en sí, sino los cobros posteriores mal aplicados. Así se hace bien.',
      secciones: [
        {
          titulo: 'El botón de baja: tu vía rápida legal',
          cuerpo: 'Todas las empresas están obligadas a ofrecer en su web un mecanismo de baja tan accesible como el de alta: el "botón de baja" de la normativa de defensa del consumidor. Lo encontrás en el sitio de tu prepaga (generalmente en el pie de página o en tu portal de afiliado). Al usarlo, la empresa debe procesar la solicitud sin requisitos adicionales y enviarte constancia. Guardá esa constancia con fecha: es tu prueba ante cualquier cobro posterior.',
        },
        {
          titulo: 'El timing correcto para no pagar de más',
          cuerpo: 'Las prepagas facturan mes adelantado y cierran facturación entre el 20 y el 25. Pedí la baja antes de ese cierre para que no se genere la cuota del mes siguiente. La baja rige desde la fecha que indiques o desde la solicitud; la empresa no puede "estirarla" 30 o 60 días para facturarte más. Si tenés débito automático, avisá también a tu banco o tarjeta después de la constancia de baja: es la doble llave contra cobros fantasma.',
        },
        {
          titulo: 'Deudas, retenciones y las trampas clásicas',
          cuerpo: 'La empresa puede reclamarte cuotas efectivamente adeudadas hasta la fecha de baja, pero no puede condicionar la baja al pago: son cosas independientes. Tampoco puede retener tu baja "hasta devolver la credencial" ni exigirte un preaviso que no esté en la ley. Si después de la baja te siguen debitando, reclamá primero a la empresa con tu constancia, y si no devuelven, denunciá en Defensa del Consumidor: los cobros post-baja se recuperan con intereses.',
        },
        {
          titulo: 'Antes de la baja total: pensá el costo de la antigüedad',
          cuerpo: 'La baja borra tu antigüedad, que es valiosa: protege contra aumentos por edad después de los 65 (con 10 años de continuidad) y levanta carencias superadoras. Si el motivo es económico, evaluá primero bajar de plan dentro de la misma empresa (conserva la antigüedad) o pasarte a otra prepaga sin hueco de cobertura (la continuidad acreditable también te sirve en la nueva). La baja "a la nada" conviene solo si vas a estar cubierto por otra vía.',
        },
      ],
      conclusion: 'La baja es simple si usás el canal correcto: botón de baja online, antes del cierre de facturación, constancia guardada y débito automático notificado. No pueden retenerte, multarte ni condicionarte. Y antes de ejecutarla, asegurate de que la baja total sea realmente tu mejor opción frente a bajar de plan o cambiar de empresa sin cortar continuidad.',
    },
    faq: [
      {
        q: '¿Pueden negarme la baja si debo cuotas?',
        a: 'No. La baja y la deuda son independientes: deben procesar tu baja y luego reclamarte lo adeudado por las vías normales. Condicionar la baja al pago previo es una práctica abusiva denunciable.',
      },
      {
        q: '¿Tengo que dar explicaciones o preaviso para darme de baja?',
        a: 'No. Es un derecho incondicionado: no necesitás justificar motivos ni dar preavisos más allá de solicitar la baja por un canal fehaciente. La "llamada de retención" es una gestión comercial que podés cortar cuando quieras.',
      },
      {
        q: '¿Qué hago si me siguen cobrando después de la baja?',
        a: 'Reclamá a la empresa adjuntando tu constancia de baja y pedí la devolución. Si no responden en unos días, desconocé el débito ante tu banco o tarjeta y denunciá en Defensa del Consumidor. Los importes cobrados sin causa se devuelven.',
      },
    ],
    keywords: ['baja de prepaga', 'boton de baja prepaga', 'como darse de baja prepaga', 'me siguen cobrando prepaga baja'],
    relacionadas: ['como-cambiar-de-prepaga', 'como-reclamar-a-una-prepaga', 'cuota-prepaga-aumento-inflacion'],
  },
  {
    slug: 'cuota-prepaga-aumento-inflacion',
    titulo: 'Aumentos de prepagas en Argentina: cómo protegerte en 2026',
    metaDescripcion: 'Cómo funcionan los aumentos de cuota de prepaga en Argentina, qué dice la ley, cuánto pueden subir y qué podés hacer si el aumento te parece excesivo.',
    tiempoLectura: 7,
    categoria: 'Precios',
    fechaActualizacion: '2026-07-14',
    contenido: {
      intro: 'Desde la desregulación del sector, las prepagas ajustan sus cuotas mes a mes siguiendo de cerca la inflación. En 2026 el patrón se estabilizó: aumentos mensuales de entre 1,8% y 2,5%, aplicados con unos dos meses de rezago respecto del índice de precios. Entender la mecánica te permite anticipar tu cuota y saber cuándo un aumento está fuera de lo normal.',
      secciones: [
        {
          titulo: 'Cómo funcionan los aumentos hoy',
          cuerpo: 'Tras el DNU 70/2023 los precios quedaron desregulados, con un esquema de monitoreo: las empresas informan sus ajustes y el mercado converge a aumentos mensuales alineados con la inflación de dos meses atrás. En julio 2026 el aumento promedio fue de 2,1% (con topes de 2,3% según empresa), en línea con la inflación de mayo. El acumulado del año ronda el 21%, contra una inflación del 19% en el mismo período. Para agosto se estima un ajuste cercano al 1,8%.',
        },
        {
          titulo: 'Tus derechos frente a un aumento',
          cuerpo: 'La empresa debe informarte el aumento con antelación (la comunicación con al menos 30 días es el estándar exigible) y aplicarlo de manera general para tu plan, no de forma personalizada por tu edad o tu consumo, salvo los cambios de banda etaria previstos en el contrato. Un aumento no informado, o muy por encima del aplicado al resto de los afiliados de tu mismo plan, es reclamable ante la empresa y denunciable en Defensa del Consumidor y la SSSalud.',
        },
        {
          titulo: 'Qué hacer cuando la cuota se te va de presupuesto',
          cuerpo: 'En orden de menor a mayor fricción: primero, verificá tu modalidad de pago (si podés derivar aportes y no lo hacés, ahí hay 30-40% de ahorro inmediato). Segundo, bajá de plan dentro de tu empresa: conservás antigüedad e historia clínica, y la diferencia entre un plan y el inferior suele ser 20-30%. Tercero, compará contra el mercado: el mismo nivel de cobertura puede tener precios muy distintos entre empresas. Cuarto, negociá: las áreas de retención tienen margen para bonificaciones que el call center de facturación no te va a ofrecer espontáneamente.',
        },
        {
          titulo: 'El momento del año para cambiar',
          cuerpo: 'Como los aumentos son mensuales y generalizados, no existe un "mes barato" para quedarse, pero sí un buen momento para cambiar: cuando tu empresa aplica un aumento por encima del promedio del mercado dos o tres meses seguidos, es señal de reacomodamiento de su cartera y difícilmente se revierta. Ahí conviene cotizar afuera: entrar a otra empresa fija tu precio de ingreso al valor actual de mercado, y los meses siguientes ajustás desde esa base más baja.',
        },
      ],
      conclusion: 'Los aumentos mensuales llegaron para quedarse: la variable que controlás no es el porcentaje sino tu base. Derivar aportes, ajustar el plan a tu uso real y comparar el mercado una vez por año son las tres palancas que mantienen tu cuota a raya. Y ante aumentos anómalos o no informados, reclamá: la asimetría de información es el principal negocio del sector.',
    },
    faq: [
      {
        q: '¿Cuánto aumentaron las prepagas en 2026?',
        a: 'El acumulado a julio 2026 ronda el 21%, contra una inflación del 19% en igual período. Los ajustes son mensuales, de entre 1,8% y 2,5% según la empresa, siguiendo la inflación con unos dos meses de rezago.',
      },
      {
        q: '¿La prepaga puede aumentarme más que a otros afiliados del mismo plan?',
        a: 'No, los aumentos generales se aplican por plan, no por persona. Las únicas diferencias individuales legítimas son los cambios de banda etaria pactados en el contrato y los diferenciales por preexistencia autorizados. Si tu aumento difiere del general de tu plan, reclamá.',
      },
      {
        q: '¿Me pueden aumentar sin avisarme?',
        a: 'Deben comunicar los ajustes con antelación razonable (30 días es el estándar). Un aumento aplicado sin comunicación previa es impugnable: reclamá a la empresa y, si no responde, denunciá ante Defensa del Consumidor.',
      },
    ],
    keywords: ['aumento prepagas 2026', 'cuanto aumenta la prepaga', 'aumento cuota prepaga derechos', 'prepagas aumento mensual inflacion'],
    relacionadas: ['prepagas-economicas', 'cuota-prepaga-por-edad', 'como-cambiar-de-prepaga'],
  },
  {
    slug: 'copago-en-prepagas-que-es',
    titulo: 'Copago en prepagas: qué es y cuánto pagás por consulta en 2026',
    metaDescripcion: 'Explicamos qué es el copago en las prepagas argentinas, cuánto cuesta en cada empresa, en qué planes hay copago y cuándo puede convenirte un plan con copago.',
    tiempoLectura: 6,
    categoria: 'Cobertura',
    fechaActualizacion: '2026-07-14',
    contenido: {
      intro: 'El copago es el monto fijo que pagás cada vez que usás una prestación: una consulta, un estudio, una sesión. Es la variable que explica por qué dos planes de la misma prepaga pueden diferir 30% en la cuota mensual. Bien elegido, un plan con copagos es la forma más inteligente de pagar menos; mal elegido, es una cuota barata que sale cara.',
      secciones: [
        {
          titulo: 'Cómo funciona y cuánto se paga en 2026',
          cuerpo: 'En los planes con copago, la cuota mensual es más baja pero abonás un monto por uso: en 2026, las consultas médicas tienen copagos típicos de $4.000 a $15.000 según empresa y especialidad, los estudios simples montos similares, y las prácticas complejas valores mayores. Las urgencias, la internación, la oncología y el plan materno infantil no llevan copago por ley en ningún plan: el copago aplica a la atención ambulatoria programada.',
        },
        {
          titulo: 'La cuenta que tenés que hacer',
          cuerpo: 'La diferencia de cuota entre un plan con copago y su equivalente sin copago ronda el 15-30%. Ejemplo con Swiss Medical (julio 2026): el S2 con copagos cuesta $233.226 y el SMG20 sin copagos $325.467, una brecha de $92.000 mensuales. Para que el plan sin copago se justifique económicamente, tendrías que hacer más de 8-10 consultas o prácticas por mes, todos los meses. La mayoría de las personas sanas no llega ni cerca.',
        },
        {
          titulo: 'Para quién conviene cada modalidad',
          cuerpo: 'Copago conviene si sos joven y sano, usás el sistema esporádicamente y tenés disciplina para no postergar consultas por el costo marginal. Sin copago conviene si tenés una condición crónica con controles frecuentes, hijos chicos (la pediatría multiplica las visitas), tratamiento psicológico semanal o simplemente si el copago te hace dudar antes de consultar: la peor economía es la del estudio que no te hiciste. Familias numerosas casi siempre amortizan el plan sin copago.',
        },
        {
          titulo: 'Los copagos ocultos que hay que preguntar',
          cuerpo: 'No todos los copagos son iguales dentro del mismo plan: salud mental puede tener copago distinto al clínico, kinesiología suele cobrarse por sesión, y la guardia puede tener un copago disuasivo para consultas no urgentes. Pedí el cuadro completo de copagos por prestación antes de contratar (las empresas lo tienen publicado, como los cuadros de copagos de CEMIC) y calculá con tu patrón de uso real del último año, no con el uso que imaginás.',
        },
      ],
      conclusion: 'El copago no es un plan "peor": es un seguro con deducible, y para el usuario ocasional es matemáticamente superior. La decisión correcta sale de tu historial real: contá tus consultas del último año, multiplicá por el copago y comparalo con la diferencia anual de cuota. Con números en la mano, la elección es obvia en casi todos los casos.',
    },
    faq: [
      {
        q: '¿Qué prestaciones nunca tienen copago?',
        a: 'Internación, urgencias que derivan en internación, tratamientos oncológicos, plan materno infantil (embarazo, parto y primer año del bebé) y las prestaciones de discapacidad. El copago legal aplica a la atención ambulatoria programada.',
      },
      {
        q: '¿Los copagos también aumentan todos los meses?',
        a: 'Suelen ajustarse junto con las cuotas o periódicamente. Al comparar planes con copago entre empresas, mirá el valor actual del copago de consulta: la dispersión entre empresas es grande y cambia la cuenta.',
      },
      {
        q: '¿Puedo cambiar de un plan con copago a uno sin copago después?',
        a: 'Sí, el upgrade dentro de la misma empresa es un trámite simple y conserva tu antigüedad. Algunas empresas piden requisitos o aplican esperas para prestaciones superadoras del plan superior, pero el cambio de modalidad de copago es rutinario.',
      },
    ],
    keywords: ['copago prepaga que es', 'plan con copago o sin copago', 'cuanto cuesta el copago 2026', 'copago consulta prepaga'],
    relacionadas: ['que-cubre-la-prepaga', 'prepagas-economicas', 'reintegros-en-prepagas'],
    prepagasRelacionadas: ['swiss-medical', 'cemic', 'sancor-salud'],
  },
  {
    slug: 'urgencias-guardia-prepaga',
    titulo: 'Urgencias y guardia con prepaga: qué te cubre y cómo usarla 2026',
    metaDescripcion: 'Todo sobre las urgencias con prepaga en Argentina: cómo acceder a la guardia, qué sanatorios podés usar, cobertura de emergencias y qué hacer en otra ciudad.',
    tiempoLectura: 7,
    categoria: 'Cobertura',
    fechaActualizacion: '2026-07-14',
    contenido: {
      intro: 'La urgencia es el momento donde la prepaga se pone a prueba: no hay tiempo de consultar cartillas ni pedir autorizaciones. Por eso conviene saber de antemano tres cosas: a qué guardia ir, cuándo llamar a la ambulancia de tu empresa y qué pasa si la urgencia te agarra de viaje. La cobertura de urgencias es de las más protegidas por la ley, pero usarla bien marca la diferencia.',
      secciones: [
        {
          titulo: 'Qué cubre la prepaga en una urgencia',
          cuerpo: 'Toda urgencia con riesgo está cubierta al 100%: la atención en guardia, los estudios que se hagan en ese contexto, la internación si se decide y el traslado en ambulancia con criterio médico. No pueden pedirte autorización previa para una urgencia (la autorización es posterior, entre el sanatorio y la empresa) ni aplicarte carencias. Algunas empresas cobran un copago disuasivo en guardia solo cuando la consulta resulta no urgente, algo a verificar en tu plan.',
        },
        {
          titulo: 'A qué guardia ir: la diferencia entre red propia y convenio',
          cuerpo: 'Las prepagas con sanatorios propios (Swiss Medical, Galeno con la red Trinidad, CEMIC, Hospital Italiano, Hominis con el Güemes) te orientan a sus guardias, donde el ingreso es directo con la credencial. Las de red abierta (OSDE, Medifé, Sancor) cubren las guardias de su cartilla: identificá hoy la más cercana a tu casa y tu trabajo. En una emergencia grave con riesgo de vida andá al centro más cercano, sea o no de cartilla: la cobertura de la emergencia real no depende de la cartilla, y la empresa debe cubrirla o gestionar la derivación una vez estabilizado.',
        },
        {
          titulo: 'Ambulancia y emergencias domiciliarias',
          cuerpo: 'La mayoría de los planes incluye emergencias médicas a domicilio con unidades propias o contratadas (OSDE tiene URG, Swiss su sistema SEM, y las demás trabajan con prestadores como Vittal o Emergencias). Guardá el número de emergencias de tu credencial en el teléfono de todos los integrantes de la familia hoy: en la urgencia real nadie busca el número. El servicio clasifica la llamada (emergencia, urgencia, visita) y despacha según gravedad; la emergencia con riesgo de vida no tiene costo adicional.',
        },
        {
          titulo: 'Urgencias en otra ciudad o en el exterior',
          cuerpo: 'Dentro del país, las prepagas nacionales te cubren en cualquier provincia vía su red o convenios de reciprocidad: llevá siempre la credencial digital y llamá al 0800 de tu empresa ante una internación fuera de tu zona para que gestionen la cobertura. Las prepagas regionales (Premedic, Hominis) tienen protocolos de urgencia fuera de zona más limitados: preguntá antes de viajar. En el exterior, solo los planes con asistencia al viajero incluida te cubren; si tu plan no la tiene, contratá asistencia aparte para cada viaje: una internación afuera se cobra en dólares.',
        },
      ],
      conclusion: 'La cobertura de urgencias es sólida en todo el sistema: sin autorizaciones, sin carencias y al 100% cuando hay riesgo. Tu parte del trabajo es logística y se hace hoy: identificar tu guardia de referencia, cargar el número de emergencias en todos los teléfonos de la familia y verificar cómo te cubre tu plan fuera de tu zona habitual.',
    },
    faq: [
      {
        q: '¿Pueden cobrarme la guardia si al final no era nada grave?',
        a: 'Algunos planes aplican un copago de guardia cuando la consulta se clasifica como no urgente. La atención en sí no puede negarse. Revisá el cuadro de copagos de tu plan para saber si aplica y cuánto es.',
      },
      {
        q: '¿Qué pasa si me atienden en un sanatorio fuera de cartilla por una emergencia?',
        a: 'La emergencia con riesgo de vida debe cubrirse aunque el centro no sea de cartilla, y la empresa gestiona la derivación a su red una vez estabilizado el paciente. Avisá a tu prepaga apenas puedas para que tome intervención y no queden facturas sin canalizar.',
      },
      {
        q: '¿La ambulancia está incluida en todos los planes?',
        a: 'Las emergencias con riesgo de vida sí, en todos. Los traslados programados y las visitas médicas a domicilio varían según plan: los básicos pueden cobrarlas o no incluirlas, los medios y altos suelen incluirlas sin cargo.',
      },
    ],
    keywords: ['urgencias prepaga', 'guardia prepaga cobertura', 'ambulancia prepaga', 'emergencia en otra provincia prepaga'],
    relacionadas: ['que-cubre-la-prepaga', 'copago-en-prepagas-que-es', 'como-reclamar-a-una-prepaga'],
    prepagasRelacionadas: ['swiss-medical', 'osde', 'galeno'],
  },
  {
    slug: 'reintegros-en-prepagas',
    titulo: 'Reintegros en prepagas: cómo pedirlos y cuánto te devuelven 2026',
    metaDescripcion: 'Guía práctica sobre los reintegros de gastos médicos en prepagas argentinas: qué gastos cubren, cómo presentar la solicitud y en cuánto tiempo te devuelven el dinero.',
    tiempoLectura: 6,
    categoria: 'Derechos',
    fechaActualizacion: '2026-07-14',
    contenido: {
      intro: 'El reintegro es lo que separa a los planes de red cerrada de los de red abierta: la posibilidad de atenderte con el profesional que quieras, pagar de tu bolsillo y que la prepaga te devuelva una parte. Es también uno de los beneficios peor utilizados: montos que prescriben sin reclamarse, presentaciones rechazadas por errores de forma y afiliados que pagan planes con reintegro que nunca usan.',
      secciones: [
        {
          titulo: 'Cómo funciona: topes por prestación, no porcentajes mágicos',
          cuerpo: 'Cada plan define un cuadro de reintegros: un monto tope por consulta, por sesión de psicología, por práctica. Si tu médico particular cobra $40.000 y tu plan reintegra hasta $25.000 por consulta clínica, recuperás $25.000. Los planes altos (OSDE 410/510, Swiss SMG40+, Omint Premium, Medifé Plata en adelante) tienen topes más generosos y más rubros con reintegro; los planes básicos directamente no reintegran nada: son de cartilla pura.',
        },
        {
          titulo: 'El trámite: qué presentar y cómo',
          cuerpo: 'Necesitás la factura o recibo oficial del profesional (con matrícula y CUIT: los "recibos comunes" se rechazan), la orden o indicación médica cuando corresponde (estudios, tratamientos), y en algunos casos el informe o resumen de la atención. Hoy casi todas las empresas reciben reintegros por la app con foto de la documentación: OSDE, Swiss, Galeno y Medifé lo resuelven 100% digital. Cargalo apenas tengas la factura: los plazos de presentación prescriben (habitualmente 60 a 180 días desde la fecha de atención según empresa).',
        },
        {
          titulo: 'Plazos de devolución y qué hacer si no pagan',
          cuerpo: 'Entre la presentación correcta y la acreditación pasan típicamente 10 a 30 días. Si el reintegro se demora más o lo rechazan, pedí el motivo por escrito: los rechazos válidos son de forma (factura mal emitida, falta de orden) y se corrigen represantando. Un rechazo de fondo sobre una prestación que tu plan reintegra según contrato es reclamable como cualquier incumplimiento: primero por los canales de la empresa, después ante la SSSalud con tu cuadro de beneficios como prueba.',
        },
        {
          titulo: 'Cómo saber si te conviene pagar un plan con reintegros',
          cuerpo: 'La cuenta es la misma que con los copagos, pero al revés: el plan con reintegros altos cuesta más por mes, y se justifica si efectivamente te atendés fuera de cartilla con frecuencia (tu terapeuta de años, un especialista de renombre, el pediatra que atiende a tus hijos desde siempre). Si en el último año no presentaste reintegros, estás pagando un beneficio que no usás: bajar a un plan de cartilla de la misma empresa suele liberar 20-30% de cuota sin resignar cobertura real.',
        },
      ],
      conclusion: 'Los reintegros son plata tuya que requiere método: factura oficial siempre, presentación inmediata por app y seguimiento de los plazos. Y una vez al año, auditá tu propio uso: el cuadro de reintegros que pagás tiene que reflejar cómo te atendés de verdad, no cómo creías que te ibas a atender cuando contrataste.',
    },
    faq: [
      {
        q: '¿Qué gastos se pueden pedir por reintegro?',
        a: 'Depende del plan: típicamente consultas con profesionales fuera de cartilla, psicología, odontología, ópticas y algunas prácticas. Cada plan tiene un cuadro de reintegros con topes por rubro: pedilo por escrito, es parte de tu contrato.',
      },
      {
        q: '¿Cuánto tarda la prepaga en devolverme el dinero?',
        a: 'Entre 10 y 30 días desde la presentación correcta, según empresa. Las presentaciones por app suelen ser más rápidas que las presenciales. Si supera ampliamente ese plazo sin justificación, reclamá por escrito.',
      },
      {
        q: '¿Puedo pedir reintegro de una consulta si mi plan es de cartilla cerrada?',
        a: 'No, los planes de red cerrada no contemplan reintegros: cubren solo prestadores de cartilla. Para atenderte fuera de la red con devolución necesitás un plan de red abierta o mixta, que son más caros justamente por eso.',
      },
    ],
    keywords: ['reintegros prepaga', 'como pedir reintegro prepaga', 'reintegro consulta medica', 'plan con reintegros prepaga'],
    relacionadas: ['copago-en-prepagas-que-es', 'que-cubre-la-prepaga', 'como-reclamar-a-una-prepaga'],
    prepagasRelacionadas: ['osde', 'swiss-medical', 'omint'],
  },
  {
    slug: 'como-afiliarse-prepaga-requisitos',
    titulo: 'Cómo afiliarse a una prepaga: documentación y requisitos 2026',
    metaDescripcion: 'Todo lo que necesitás para afiliarte a una prepaga en Argentina: documentos requeridos, períodos de carencia, declaración jurada de salud y errores a evitar.',
    tiempoLectura: 7,
    categoria: 'Trámites',
    fechaActualizacion: '2026-07-14',
    contenido: {
      intro: 'Afiliarte a una prepaga requiere menos requisitos de los que la mayoría imagina: con DNI, tu situación fiscal acreditada y una declaración jurada de salud completa, cualquier empresa está en condiciones de darte el alta en dos semanas. Esta guía repasa la documentación exacta por situación laboral y los errores que demoran o complican el trámite.',
      secciones: [
        {
          titulo: 'Los requisitos base (para todos)',
          cuerpo: 'DNI de cada integrante del grupo a afiliar, datos de contacto, y la declaración jurada de salud de cada adulto. No existe requisito de nacionalidad (los extranjeros con DNI argentino o residencia en trámite pueden afiliarse; algunas empresas aceptan pasaporte con precaria) ni límite de edad legal para el ingreso, aunque las tarifas suben fuerte con la edad. No pueden exigirte estudios médicos como condición de aceptación: la evaluación de admisión, donde existe, solo puede usarse para encuadrar preexistencias.',
        },
        {
          titulo: 'Documentación según tu situación laboral',
          cuerpo: 'Relación de dependencia con derivación de aportes: últimos recibos de sueldo y firma del formulario de opción de obra social. Monotributista: constancia de inscripción, comprobante del último pago y categoría (el aporte se deriva al plan). Autónomo o particular: solo la documentación base, contratás la lista directa con IVA. Grupo familiar: partidas o libreta que acrediten el vínculo para cónyuge/conviviente e hijos, y DNI de cada uno. Tener todo digitalizado antes de empezar reduce el alta de semanas a días.',
        },
        {
          titulo: 'La declaración jurada: dedicale tiempo',
          cuerpo: 'Es el documento más importante del legajo: enfermedades diagnosticadas, cirugías, internaciones, medicación habitual, tratamientos en curso. Regla simple: si un médico te lo diagnosticó o lo tomás recetado, va en la DDJJ. Declarar no te expone al rechazo (está prohibido rechazar por preexistencias); ocultar sí te expone a perder cobertura futura. Si tenés dudas sobre cómo declarar algo, pedí completarla con el asesor y dejá constancia escrita de lo conversado.',
        },
        {
          titulo: 'Errores que demoran o encarecen el alta',
          cuerpo: 'Cotizar como particular cuando podías derivar aportes (el error más caro: hasta 40% de diferencia). Dar de baja la cobertura anterior antes de tener el alta confirmada (te deja descubierto). Omitir integrantes del grupo "para ahorrar" y quererlos sumar después (el ingreso posterior cotiza a la edad del momento, y un embarazo en curso del integrante no declarado complica todo). Y firmar sin el cuadro de copagos, carencias superadoras y reintegros por escrito: ese anexo es tu contrato real, no el folleto comercial.',
        },
      ],
      conclusion: 'El alta en una prepaga es un trámite de dos semanas cuando llegás con la documentación correcta para tu situación fiscal y una declaración jurada bien hecha. Los requisitos son pocos y la ley te protege del rechazo. El único paso donde no hay atajo es la DDJJ: la verdad completa hoy es tu cobertura garantizada mañana.',
    },
    faq: [
      {
        q: '¿Pueden rechazar mi solicitud de afiliación?',
        a: 'No por edad ni por condiciones de salud: la Ley 26.682 lo prohíbe. Los rechazos legítimos son operativos: documentación incompleta, zona sin cobertura de la empresa o falta de acreditación de la situación fiscal declarada.',
      },
      {
        q: '¿Un extranjero puede afiliarse a una prepaga argentina?',
        a: 'Sí. Con DNI argentino el trámite es idéntico al de cualquier afiliado. Con residencia en trámite, varias empresas aceptan pasaporte y constancia de residencia precaria. Las condiciones comerciales pueden variar, pero no hay impedimento legal.',
      },
      {
        q: '¿Puedo afiliar a mi pareja sin estar casados?',
        a: 'Sí, los convivientes integran el grupo familiar acreditando la unión convivencial (certificado de convivencia o información sumaria). Cada empresa define la prueba que acepta; el certificado de unión convivencial del registro civil es el camino más directo.',
      },
    ],
    keywords: ['requisitos para afiliarse a una prepaga', 'documentacion alta prepaga', 'declaracion jurada salud prepaga', 'afiliacion prepaga extranjeros'],
    relacionadas: ['como-contratar-prepaga-online', 'preexistencias-que-son-como-funcionan', 'derivar-obra-social-a-prepaga'],
  },
  {
    slug: 'seguro-medico-obligatorio-extranjeros',
    titulo: 'Seguro médico obligatorio en Argentina: guía para extranjeros 2026',
    metaDescripcion: 'El Decreto 366/25 hizo obligatorio el seguro médico para entrar a Argentina. Qué exige Migraciones, quiénes están exentos y cuándo conviene una prepaga local en vez de asistencia al viajero.',
    tiempoLectura: 7,
    categoria: 'Trámites',
    fechaActualizacion: '2026-07-21',
    contenido: {
      intro: 'Desde mediados de 2025, entrar a Argentina sin cobertura médica dejó de ser una opción: el Decreto 366/25 exige que todo extranjero no residente cuente con un seguro médico válido durante su estadía, sin importar si viene por turismo, trabajo o estudio. Y para quienes se quedan a vivir, la pregunta cambia: ¿alcanza con la asistencia al viajero o conviene pasarse a una prepaga local? Esta guía responde las dos cosas.',
      secciones: [
        {
          titulo: 'Qué exige el Decreto 366/25',
          cuerpo: 'Desde julio de 2025 rige la obligación de contar con seguro médico para todos los extranjeros que ingresan como residentes transitorios o temporarios, por cualquier vía (aérea, marítima o terrestre). La cobertura debe incluir atención primaria y de emergencia, internación por accidente o enfermedad y asistencia durante toda la estadía. Los residentes permanentes y los ciudadanos naturalizados están exentos del requisito.',
        },
        {
          titulo: 'Asistencia al viajero vs. prepaga local',
          cuerpo: 'Para una visita corta, una asistencia al viajero cumple el requisito y es más barata. Pero si venís a radicarte —trabajo, estudio de largo plazo, residencia—, la ecuación se invierte: la asistencia tiene topes de reintegro por evento, no cubre tratamientos programados ni enfermedades crónicas, y no te da médico de cabecera. Una prepaga local te da cartilla completa, internación sin tope, medicamentos con descuento y continuidad de tratamiento, pagando lo mismo que un residente argentino de tu edad.',
        },
        {
          titulo: 'Cómo afiliarte a una prepaga siendo extranjero',
          cuerpo: 'La mayoría de las prepagas grandes aceptan la afiliación con pasaporte y el trámite de residencia iniciado (residencia precaria); algunas piden un CDI o CUIL provisorio para la facturación. El precio es el mismo que para cualquier persona de tu edad: la nacionalidad no cambia la cuota. Al momento de contratar, pedí el certificado de cobertura — sirve como comprobante ante Migraciones para el trámite de residencia.',
        },
        {
          titulo: 'Cuánto cuesta en 2026',
          cuerpo: 'Para un adulto de 30 años, los planes de entrada arrancan alrededor de $170.000 por mes y los premium superan el $1.000.000. Entre medio hay una franja amplia ($300.000 a $500.000) con planes sin copago y sanatorios de primer nivel, que es donde se ubica la mayoría de los expatriados. La cuota sube con la edad, así que cotizá con tu edad real para ver el número exacto.',
        },
        {
          titulo: 'Errores comunes de extranjeros al elegir cobertura',
          cuerpo: 'Los tres más frecuentes: contratar la asistencia al viajero más barata y descubrir el tope de reintegro recién en la primera internación; elegir prepaga por marca sin verificar la cartilla de la ciudad donde efectivamente van a vivir (la red fuera de Buenos Aires cambia mucho entre empresas); y no declarar preexistencias en la declaración jurada, lo que puede complicar coberturas futuras. La ley argentina prohíbe rechazar afiliaciones por preexistencia — declarala y evitá problemas.',
        },
      ],
      conclusion: 'Si venís de visita, cualquier seguro que cumpla el Decreto 366/25 alcanza. Si venís a quedarte, una prepaga local es la única cobertura completa: mismo precio que un argentino, cartilla real y certificado válido para Migraciones. Compará los planes con precios reales y elegí según la ciudad donde vas a vivir.',
    },
    faq: [
      {
        q: '¿El seguro médico es obligatorio también para turistas?',
        a: 'Sí. Desde julio de 2025 el requisito alcanza a todos los extranjeros no residentes, incluidos turistas, sin importar la vía de ingreso. Los residentes permanentes y naturalizados están exentos.',
      },
      {
        q: '¿Puedo usar el hospital público siendo extranjero?',
        a: 'El sistema público argentino atiende urgencias a cualquier persona. Pero el Decreto 366/25 exige igualmente contar con seguro al ingresar, y para radicarte la cobertura privada te evita las demoras del sistema público en consultas programadas y estudios.',
      },
      {
        q: '¿Qué documento necesito para contratar una prepaga sin DNI?',
        a: 'Depende de la empresa: en general pasaporte vigente y residencia precaria (constancia del trámite migratorio iniciado). Algunas piden CDI/CUIL provisorio para facturar. Cotizá y consultá tu caso — un asesor te confirma qué empresas aceptan tu documentación hoy.',
      },
      {
        q: '¿La prepaga me sirve como comprobante para la residencia?',
        a: 'Sí: el certificado de cobertura que emite la prepaga acredita cobertura médica ante Migraciones para los trámites de residencia temporaria.',
      },
    ],
    keywords: ['seguro medico obligatorio argentina', 'decreto 366/25 seguro medico', 'prepaga para extranjeros', 'prepaga sin dni argentina', 'health insurance argentina requirement'],
    relacionadas: ['como-afiliarse-prepaga-requisitos', 'prepaga-sin-periodo-carencia', 'como-contratar-prepaga-online'],
    prepagasRelacionadas: ['swiss-medical', 'osde', 'medife'],
  },
  {
    slug: 'prepaga-o-pami-jubilados',
    titulo: '¿Prepaga o PAMI? Guía completa para jubilados 2026',
    metaDescripcion: 'Jubilados en Argentina: qué conviene entre PAMI y una prepaga, qué empresas aceptan mayores, el tope legal de 3x entre franjas etarias y la regla de los 65 años con 10 de antigüedad.',
    tiempoLectura: 8,
    categoria: 'Perfiles',
    fechaActualizacion: '2026-07-21',
    contenido: {
      intro: 'Al jubilarte, el sistema te asigna PAMI por defecto — pero no estás obligado a quedarte ahí, y tampoco estás obligado a resignar la prepaga que tuviste toda tu vida. La ley te protege más de lo que la mayoría cree: ninguna empresa puede rechazarte por edad, hay un tope legal a lo que pueden cobrarte, y si tenés antigüedad como afiliado, ni siquiera pueden aumentarte la cuota por cumplir años. Esta guía ordena las opciones reales de un jubilado en 2026.',
      secciones: [
        {
          titulo: 'No pueden rechazarte por edad: es ley',
          cuerpo: 'La Ley 26.682 prohíbe rechazar afiliaciones por edad. Cualquier prepaga tiene que aceptarte a los 60, a los 70 o a los 85. Lo que sí pueden hacer es cobrarte la cuota de tu franja etaria, que es más alta — pero con un límite que muchos desconocen: la cuota de la franja más alta no puede superar TRES VECES la de la más baja. Si te pasan un presupuesto que rompe esa relación, está fuera de la norma.',
        },
        {
          titulo: 'La regla de oro: 65 años + 10 de antigüedad',
          cuerpo: 'Si tenés más de 65 años y más de 10 años de antigüedad continua en la misma prepaga, la empresa no puede aplicarte aumentos por edad: solo los aumentos generales autorizados que pagan todos. Esta regla convierte la antigüedad en un activo valioso — antes de darte de baja de una prepaga de toda la vida "porque está cara", comparalo contra lo que pagarías entrando de nuevo a otra a tu edad actual.',
        },
        {
          titulo: 'Qué te da PAMI y qué no',
          cuerpo: 'PAMI cubre la canasta completa de prestaciones para jubilados, con medicamentos gratuitos o con descuentos altos, y es gratis (se descuenta de los aportes ya hechos). Sus limitaciones conocidas: demoras en turnos con especialistas, cartilla acotada según la zona y burocracia en autorizaciones de alta complejidad. Para muchos jubilados sanos, PAMI + atención puntual privada paga por consulta es suficiente. Para quienes tienen condiciones crónicas o quieren acceso rápido a sanatorios privados, la prepaga marca la diferencia.',
        },
        {
          titulo: 'Las tres estrategias posibles',
          cuerpo: 'Opción 1 — Solo PAMI: costo cero, cobertura completa en los papeles, con las demoras del sistema. Opción 2 — Prepaga pura: pagás la cuota de tu franja etaria (en 2026, desde ~$250.000/mes en planes de entrada para +65) y accedés a la cartilla privada completa. Opción 3 — La mixta: mantenés PAMI para medicamentos (su punto más fuerte) y contratás una prepaga o un plan parcial para consultas e internación. Varias empresas ofrecen planes específicos para mayores que complementan PAMI a menor costo que un plan completo.',
        },
        {
          titulo: 'Qué empresas aceptan mayores y qué mirar al cotizar',
          cuerpo: 'Todas están obligadas a aceptarte; en la práctica, las que más afilian mayores de 60 son OSDE, Swiss Medical, Sancor Salud y Galeno, además de empresas regionales con planes senior. Al cotizar, mirá tres cosas: que la cartilla tenga los sanatorios donde ya te atendés, la cobertura de medicamentos crónicos (el gasto que más crece con la edad), y la letra chica de internación domiciliaria y rehabilitación, las prestaciones que más se usan después de los 70.',
        },
      ],
      conclusion: 'La decisión no es PAMI o prepaga en abstracto: es cuánto valorás el acceso rápido y qué margen tiene tu jubilación. Con el tope legal de 3x y la regla de 65+10 a tu favor, cotizá tu edad real y comparalo contra lo que hoy no te da PAMI. Es una cuenta que cada jubilado puede hacer en cinco minutos con precios reales.',
    },
    faq: [
      {
        q: '¿Una prepaga puede rechazarme por tener 70 años?',
        a: 'No. La Ley 26.682 prohíbe rechazar afiliaciones por edad. Pueden cobrarte la cuota de tu franja etaria, pero con tope: la franja más alta no puede pagar más de 3 veces lo que paga la más baja.',
      },
      {
        q: '¿Me pueden aumentar la cuota por cumplir años?',
        a: 'Si tenés más de 65 años y más de 10 años de antigüedad en esa prepaga, no pueden aplicarte aumentos por edad — solo los aumentos generales autorizados. Con menos antigüedad, pueden ajustarte al cambiar de franja etaria, dentro de los topes.',
      },
      {
        q: '¿Puedo tener PAMI y una prepaga al mismo tiempo?',
        a: 'Sí. Muchos jubilados mantienen PAMI (sobre todo por la cobertura de medicamentos) y suman una prepaga para consultas, especialistas e internación privada. También existen planes parciales pensados como complemento de PAMI.',
      },
      {
        q: '¿Cuánto cuesta una prepaga para un jubilado en 2026?',
        a: 'Depende de la edad y el plan: los planes de entrada para mayores de 65 arrancan alrededor de $250.000/mes y los completos superan los $500.000. Cotizá con tu edad real para ver el precio exacto — el número genérico de las notas de los diarios no aplica a tu caso.',
      },
    ],
    keywords: ['prepaga o pami jubilados', 'prepagas que aceptan jubilados', 'prepaga adultos mayores 2026', 'pami vs prepaga', 'aumento prepaga por edad tope'],
    relacionadas: ['prepaga-para-mayores-60', 'cuota-prepaga-por-edad', 'derivar-obra-social-a-prepaga'],
    prepagasRelacionadas: ['osde', 'swiss-medical', 'sancor-salud', 'galeno'],
  },
  {
    slug: 'sin-trabajo-obra-social',
    titulo: 'Me quedé sin trabajo: ¿qué pasa con mi obra social y qué opciones tengo?',
    metaDescripcion: 'Si te despidieron o renunciaste, conservás la obra social 3 meses. Qué hacer después: seguro de desempleo, monotributo, prepaga directa. Plazos y opciones 2026.',
    tiempoLectura: 6,
    categoria: 'Trámites',
    fechaActualizacion: '2026-07-21',
    contenido: {
      intro: 'Perder el trabajo no significa quedarte sin cobertura médica al día siguiente: la ley te da un colchón de 3 meses, y después hay al menos cuatro caminos para no quedar descubierto. Lo importante es conocer los plazos, porque cada opción tiene su ventana. Esta guía te ordena qué hacer, semana a semana, desde el día del despido o la renuncia.',
      secciones: [
        {
          titulo: 'Los primeros 3 meses: seguís cubierto por ley',
          cuerpo: 'Si trabajaste en relación de dependencia al menos 6 meses, conservás tu obra social (y la de tu grupo familiar) durante los 3 meses posteriores al fin del contrato, sin hacer ningún trámite y sin pagar nada. Aplica tanto para despido como para renuncia. Este período es tu ventana para decidir con calma qué viene después — no la desperdicies esperando al día 89.',
        },
        {
          titulo: 'Si te despidieron sin causa: el seguro de desempleo extiende la cobertura',
          cuerpo: 'La Prestación por Desempleo de ANSES no es solo el cobro mensual: incluye la continuidad de tu obra social durante todo el período de la prestación (que puede llegar hasta 12 meses según tu antigüedad). Si tenés derecho al seguro de desempleo, tramitalo dentro de los 90 días hábiles del despido — extendés tu cobertura de salud gratis mientras buscás trabajo.',
        },
        {
          titulo: 'El camino del monotributo',
          cuerpo: 'Si arrancás a facturar como monotributista, tu cuota mensual incluye el componente de obra social: elegís una del listado (OSDE vía derivación, OSECAC, OSDEPYM y muchas más) y quedás cubierto vos, con un adicional por cada familiar que sumes. Es la opción más económica para independientes, y podés potenciarla derivando esos aportes a un plan de prepaga con derivación (pagás la diferencia entre tu aporte y la cuota del plan).',
        },
        {
          titulo: 'Prepaga directa: cobertura sin depender del empleo',
          cuerpo: 'La prepaga como particular no depende de tu situación laboral: contratás y pagás la cuota completa. Es la opción más cara pero la única que no se cae si tu situación vuelve a cambiar. Punto importante: las prestaciones del PMO no tienen carencia, así que si contratás antes de que venzan tus 3 meses de gracia, la transición es sin ningún hueco de cobertura.',
        },
        {
          titulo: 'El error a evitar: dejar pasar los 3 meses sin decidir',
          cuerpo: 'El escenario más caro es quedarse descubierto y necesitar atención: una internación privada sin cobertura se factura por día en cifras que superan cualquier cuota anual. Si al mes 2 todavía no conseguiste trabajo, activá una de las opciones: seguro de desempleo si te corresponde, monotributo si vas a facturar, o prepaga particular aunque sea con un plan de entrada — después la escalás.',
        },
      ],
      conclusion: 'Tenés 3 meses de aire garantizados por ley y cuatro caminos para después: seguro de desempleo (hasta 12 meses más, gratis), monotributo (la más económica), derivación de aportes a prepaga, o prepaga particular (la más completa). La única mala decisión es no tomar ninguna antes de que se cumpla el plazo.',
    },
    faq: [
      {
        q: '¿Cuánto tiempo conservo la obra social después de renunciar?',
        a: 'Tres meses desde el fin del contrato, igual que en un despido, siempre que hayas estado al menos 6 meses en relación de dependencia. Cubre también a tu grupo familiar y no requiere trámite.',
      },
      {
        q: '¿El seguro de desempleo incluye obra social?',
        a: 'Sí. Mientras cobrás la Prestación por Desempleo de ANSES mantenés tu obra social, hasta 12 meses según tu antigüedad laboral. Es la extensión de cobertura más barata que existe: gratis.',
      },
      {
        q: '¿Puedo contratar una prepaga estando desempleado?',
        a: 'Sí. Como particular no necesitás recibo de sueldo: pagás la cuota completa del plan. Y si después conseguís trabajo o te hacés monotributista, podés rearmar el esquema derivando aportes para bajar el costo.',
      },
      {
        q: '¿Qué pasa si tengo un tratamiento en curso cuando pierdo el trabajo?',
        a: 'Durante los 3 meses de continuidad tu cobertura sigue igual, tratamientos incluidos. Si después pasás a una prepaga, las prestaciones del PMO (incluida la medicación crónica y oncológica) no admiten carencia: la cobertura arranca desde el día uno.',
      },
    ],
    keywords: ['me quede sin trabajo obra social', 'cuanto dura la obra social despues del despido', 'obra social despues de renunciar', 'cobertura medica sin trabajo', 'prepaga desempleado'],
    relacionadas: ['obra-social-vs-prepaga', 'prepagas-para-monotributistas', 'derivar-obra-social-a-prepaga'],
    prepagasRelacionadas: ['sancor-salud', 'medife', 'prevencion-salud'],
  },
]

export function getGuiaBySlug(slug: string): GuiaData | undefined {
  return guias.find((g) => g.slug === slug)
}
