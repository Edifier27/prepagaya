export interface CoberturaData {
  slug: string
  nombre: string
  emoji: string
  titulo: string
  metaDescripcion: string
  intro: string
  queEstableceLaLey: string
  prepagasRecomendadas: { slug: string; razon: string; planSlug?: string }[]
  prepagasRestrictivas: { slug: string; detalle: string }[]
  quePreguntar: string[]
  faq: { q: string; a: string }[]
  relacionadas: string[] // slugs de otras coberturas
  keywords: string[]
}

export const coberturas: CoberturaData[] = [
  {
    slug: 'psicologia',
    nombre: 'Psicología y salud mental',
    emoji: '🧠',
    titulo: '¿Las prepagas cubren psicología y salud mental?',
    metaDescripcion: 'Descubrí qué prepagas cubren psicología, psiquiatría y salud mental en Argentina. Qué dice la ley, cuántas sesiones cubren y cuáles tienen menos restricciones.',
    intro: 'La salud mental es una de las coberturas más buscadas en prepagas. La buena noticia: la Ley 26.657 obliga a todas las prepagas a cubrir tratamientos de salud mental en igualdad de condiciones que cualquier otra enfermedad. Pero hay grandes diferencias en calidad de red, cantidad de sesiones sin necesidad de auditoría y acceso a psiquiatras.',
    queEstableceLaLey: 'La Ley 26.657 (Ley Nacional de Salud Mental) y el PMO establecen que las prepagas deben cubrir tratamientos psicológicos y psiquiátricos sin límite de sesiones cuando existe indicación médica. No pueden requerir autorizaciones previas para las primeras sesiones de urgencia.',
    prepagasRecomendadas: [
      { slug: 'swiss-medical', razon: 'La red de profesionales de salud mental de Swiss Medical es la más amplia del país. Tienen psicólogos, psiquiatras y centros especializados en todas las zonas. El Plan SMG20 cubre sesiones sin auditoría hasta cierta cantidad mensual.', planSlug: 'smg20' },
      { slug: 'osde', razon: 'OSDE tiene +90.000 profesionales adheridos, incluyendo una amplia red de psicólogos en todo el país. El Plan 310 cubre psicología y psiquiatría con copago razonable. Ideal si querés tener muchas opciones de profesionales.', planSlug: '310' },
      { slug: 'sancor-salud', razon: 'Sancor Salud tiene muy buena relación precio-calidad en salud mental. El Plan 3000 incluye cobertura de psicología con copago estándar y buena disponibilidad de profesionales en el interior del país.', planSlug: 'plan-3000' },
    ],
    prepagasRestrictivas: [
      { slug: 'premedic', detalle: 'Red de profesionales de salud mental más limitada, concentrada en CABA y GBA.' },
    ],
    quePreguntar: [
      '¿La red de psicólogos incluye profesionales en mi zona?',
      '¿Cuántas sesiones por mes cubre sin necesidad de auditoría?',
      '¿Cubrís psiquiatría y medicación psiquiátrica?',
      '¿Las sesiones online (telepsicología) están cubiertas?',
      '¿Cómo se maneja la derivación cuando necesito un psiquiatra?',
    ],
    faq: [
      {
        q: '¿Cuántas sesiones de psicólogo cubre la prepaga por mes?',
        a: 'Por ley, las prepagas deben cubrir las sesiones indicadas por el profesional sin límite arbitrario. En la práctica, muchos planes cubren entre 2 y 4 sesiones mensuales sin auditoría; más sesiones pueden requerir un informe médico. La Ley 26.657 prohíbe límites que no estén basados en criterios médicos.',
      },
      {
        q: '¿La prepaga cubre tratamientos psiquiátricos y medicación?',
        a: 'Sí, el PMO obliga a cubrir tanto la consulta psiquiátrica como los medicamentos indicados. Muchas prepagas aplican un porcentaje de descuento en farmacia para medicación psiquiátrica (usualmente 40-70% de descuento).',
      },
      {
        q: '¿Puedo ir a un psicólogo fuera de la cartilla de la prepaga?',
        a: 'Depende del plan. Los planes de red abierta permiten consultar con cualquier profesional y luego pedir reintegro parcial. Los de red cerrada solo cubren profesionales de la cartilla. Swiss Medical SMG40 y OSDE 410/510 tienen las mejores políticas de reintegro.',
      },
      {
        q: '¿Las prepagas cubren psicología online (telepsalud)?',
        a: 'Desde la pandemia, la mayoría de las prepagas cubre sesiones de telepsicología. OSDE, Swiss Medical y Sancor tienen plataformas digitales propias para turnos online. Confirmá con la prepaga antes de contratar si es importante para vos.',
      },
    ],
    relacionadas: ['maternidad', 'medicamentos', 'urgencias'],
    keywords: ['prepagas que cubren psicología', 'cobertura salud mental prepaga', 'prepaga psicólogo sin copago', 'cuántas sesiones cubre la prepaga', 'ley 26657 prepagas'],
  },
  {
    slug: 'maternidad',
    nombre: 'Maternidad y embarazo',
    emoji: '👶',
    titulo: '¿Qué cubre la prepaga durante el embarazo y el parto?',
    metaDescripcion: 'Todo lo que cubre la prepaga en embarazo, parto y recién nacido. Ecografías, controles, internación y más. Comparativa de las mejores prepagas para maternidad.',
    intro: 'La cobertura de maternidad es una de las más consultadas antes de contratar una prepaga. El PMO garantiza un piso de cobertura, pero hay diferencias importantes entre prepagas en calidad de maternidades, obstetricia privada y atención del recién nacido.',
    queEstableceLaLey: 'El PMO cubre controles prenatales, ecografías, análisis, parto (vaginal o cesárea) e internación conjunta madre-bebé. La Ley 23.798 y el PMO ampliado incluyen también el plan SUMAR y controles del recién nacido. Las prepagas no pueden discriminar por embarazo preexistente si la cobertura de maternidad estaba incluida desde el inicio.',
    prepagasRecomendadas: [
      { slug: 'swiss-medical', razon: 'Swiss Medical tiene maternidades propias de alta complejidad (Swiss Medical Center, Sanatorio de la Trinidad). Cubre parto, cesárea, internación conjunta, neonatología y atención ambulatoria completa del embarazo. Es la opción premium para maternidad.', planSlug: 'smg20' },
      { slug: 'cemic', razon: 'CEMIC tiene una de las mejores maternidades universitarias del país. Sus planes cubren controles, ecografías y parto con acceso a profesores universitarios. Ideal para embarazos de alto riesgo.', planSlug: 'plan-individual' },
      { slug: 'sancor-salud', razon: 'Sancor Salud tiene excelente cobertura de maternidad para el interior del país. El Plan 3000 cubre parto y controles con buena red de obstetras en todas las provincias.', planSlug: 'plan-3000' },
    ],
    prepagasRestrictivas: [
      { slug: 'premedic', detalle: 'Cobertura PMO básica. Red de obstetras más limitada, sin maternidad propia.' },
    ],
    quePreguntar: [
      '¿La prepaga tiene maternidad propia o acuerdo con clínicas?',
      '¿Qué ecografías y análisis cubre durante el embarazo?',
      '¿Cómo es la cobertura de neonatología y UCI neonatal?',
      '¿La internación del recién nacido está cubierta si hay complicaciones?',
      '¿Cubrís el plan SUMAR o controles post-parto?',
    ],
    faq: [
      {
        q: '¿Puedo contratar una prepaga ya estando embarazada?',
        a: 'Sí, podés contratar. Sin embargo, la mayoría de las prepagas aplica un período de carencia de entre 9 y 12 meses para la cobertura del parto cuando existe embarazo preexistente. Si ya estás embarazada al contratar, el parto puede no estar cubierto. Consultá siempre antes de firmar.',
      },
      {
        q: '¿Cuántas ecografías cubre la prepaga durante el embarazo?',
        a: 'El PMO establece un mínimo de 5 ecografías obstétricas durante el embarazo (morfológica del primer y segundo trimestre, doppler y eco 3D/4D en indicación médica). Las prepagas premium como Swiss Medical y OSDE pueden cubrir más según indicación.',
      },
      {
        q: '¿La prepaga cubre si tengo un embarazo gemelar o de alto riesgo?',
        a: 'Sí, el PMO obliga a cubrir embarazos de alto riesgo. La diferencia entre prepagas está en la calidad de los centros de neonatología y UCI neonatal a los que tenés acceso. Swiss Medical y CEMIC tienen los mejores centros de referencia.',
      },
    ],
    relacionadas: ['psicologia', 'medicamentos', 'urgencias'],
    keywords: ['prepaga maternidad embarazo', 'qué cubre la prepaga en el embarazo', 'mejor prepaga para embarazadas', 'cobertura parto prepaga argentina', 'prepaga ecografías embarazo'],
  },
  {
    slug: 'odontologia',
    nombre: 'Odontología y dental',
    emoji: '🦷',
    titulo: '¿Las prepagas cubren el dentista? Cobertura odontológica completa',
    metaDescripcion: 'Qué prepagas incluyen odontología en Argentina. Diferencias entre cobertura básica PMO y planes con dental completo. Implantes, ortodoncia y más.',
    intro: 'La cobertura odontológica es una de las más confusas entre los afiliados. El PMO cubre urgencias odontológicas y algunos tratamientos básicos, pero la mayoría de los tratamientos de mediana y alta complejidad (ortodoncia, implantes, estética) requieren planes con cobertura dental ampliada o son a cargo del afiliado.',
    queEstableceLaLey: 'El PMO cubre urgencias odontológicas (dolor agudo, infección, trauma), extracciones y algunas obturaciones. La cobertura dental amplia (ortodoncia, prótesis, implantes, blanqueamiento) NO está en el PMO y depende de cada plan y prepaga.',
    prepagasRecomendadas: [
      { slug: 'swiss-medical', razon: 'Swiss Medical incluye cobertura dental en sus planes SMG20 en adelante. Tienen Swiss Dental en sus propios centros médicos. Cubre consultas, radiografías, obturaciones y con los planes superiores acceso a endodoncia y periodoncia.', planSlug: 'smg20' },
      { slug: 'osde', razon: 'OSDE tiene convenio con la red de odontólogos más amplia del país. El Plan 310 incluye cobertura dental básica-media con copago. El Plan 410 amplía significativamente la cobertura con acceso a más especialidades.', planSlug: '310' },
      { slug: 'sancor-salud', razon: 'Sancor Salud Plan 3000 incluye cobertura dental con buena relación precio-calidad. Red amplia en el interior del país, donde otras prepagas tienen menos odontólogos adheridos.', planSlug: 'plan-3000' },
    ],
    prepagasRestrictivas: [
      { slug: 'premedic', detalle: 'Sin cobertura dental incluida. PMO odontológico básico únicamente.' },
    ],
    quePreguntar: [
      '¿La cobertura dental incluye ortodoncia? ¿Hay tope?',
      '¿Cubre implantes dentales? ¿Bajo qué condiciones?',
      '¿Endodoncia y periodoncia están incluidas?',
      '¿Hay odontólogos adheridos en mi zona?',
      '¿Blanqueamiento o estética dental tiene alguna cobertura?',
    ],
    faq: [
      {
        q: '¿Las prepagas cubren ortodoncia?',
        a: 'Depende del plan. La mayoría de las prepagas cubre ortodoncia con un porcentaje (30-50%) hasta un tope anual, solo con planes de nivel medio-alto. Swiss Medical SMG30/40 y OSDE 410/510 tienen la mejor cobertura de ortodoncia. Los planes básicos generalmente no la incluyen.',
      },
      {
        q: '¿Las prepagas cubren implantes dentales?',
        a: 'Los implantes no están en el PMO. Algunas prepagas premium (Swiss Medical SMG40, OSDE 510) tienen cobertura parcial de implantes bajo indicación médica (pérdida dentaria por accidente o enfermedad). En general es una cobertura limitada con topes estrictos.',
      },
      {
        q: '¿Qué es la cobertura dental PMO?',
        a: 'La cobertura PMO incluye: consultas de urgencia, extracción simple, radiografías, obturaciones simples y detartraje (limpieza). Todo lo que vaya más allá de esto —prótesis, ortodoncia, implantes, tratamientos estéticos— requiere cobertura adicional que varía por prepaga y plan.',
      },
    ],
    relacionadas: ['optica', 'medicamentos', 'rehabilitacion'],
    keywords: ['prepagas que cubren odontología', 'cobertura dental prepaga argentina', 'prepaga ortodoncia', 'prepaga implantes dentales', 'qué cubre la prepaga en el dentista'],
  },
  {
    slug: 'fertilidad',
    nombre: 'Fertilización y tratamientos de fertilidad',
    emoji: '🍀',
    titulo: '¿Las prepagas cubren fertilización in vitro y tratamientos de fertilidad?',
    metaDescripcion: 'Todo sobre la cobertura de fertilidad en prepagas argentinas. FIV, ovodonación, inseminación artificial. Qué dice la ley y cuáles son los mejores planes.',
    intro: 'Argentina tiene una de las legislaciones más avanzadas del mundo en fertilidad: la Ley 26.862 obliga a prepagas y obras sociales a cubrir tratamientos de reproducción médicamente asistida. Sin embargo, hay diferencias importantes en cuántos ciclos cubren, qué técnicas incluyen y la calidad de los centros de fertilidad.',
    queEstableceLaLey: 'La Ley 26.862 establece que las prepagas deben cubrir hasta 4 tratamientos de fertilización in vitro de baja complejidad y hasta 4 de alta complejidad (FIV) por año, incluyendo la medicación. La ley no discrimina por orientación sexual ni estado civil. La ovodonación también está incluida.',
    prepagasRecomendadas: [
      { slug: 'swiss-medical', razon: 'Swiss Medical tiene convenio con los mejores centros de fertilidad del país (CEGYR, Procrearte). Cubre los 4 ciclos por ley más la medicación con descuento en farmacia. Atención personalizada y coordinación entre ginecólogo y especialista en fertilidad.', planSlug: 'smg20' },
      { slug: 'osde', razon: 'OSDE tiene la red de centros de fertilidad adheridos más amplia. El Plan 310 cubre los tratamientos por ley. Su ventaja es la cantidad de opciones de centros especializados en todo el país.', planSlug: '310' },
      { slug: 'sancor-salud', razon: 'Sancor Salud cumple la ley 26.862 en todas sus modalidades. Buena opción para el interior del país donde Swiss y OSDE tienen menos centros de fertilidad habilitados.', planSlug: 'plan-5000' },
    ],
    prepagasRestrictivas: [],
    quePreguntar: [
      '¿Cuántos ciclos de FIV cubre por año?',
      '¿La medicación para fertilidad está incluida con descuento?',
      '¿Cubrís ovodonación y donación de esperma?',
      '¿Qué centros de fertilidad habilitados tenés en convenio?',
      '¿Aplica el mismo beneficio para parejas del mismo sexo?',
    ],
    faq: [
      {
        q: '¿Cuántos tratamientos de fertilidad cubre la prepaga por ley?',
        a: 'La Ley 26.862 establece hasta 4 tratamientos anuales de baja complejidad (estimulación ovárica + inseminación) y hasta 4 de alta complejidad (FIV, ICSI) por año. La medicación asociada también debe ser cubierta. Si la prepaga te niega estos tratamientos, podés reclamar ante SSSalud.',
      },
      {
        q: '¿La prepaga cubre la preservación de óvulos (vitrificación)?',
        a: 'La Ley 26.862 incluye la criopreservación de gametos cuando está indicada médicamente (por ejemplo, antes de un tratamiento oncológico). La preservación de fertilidad electiva (sin indicación médica) no está obligatoriamente cubierta, aunque algunas prepagas la incluyen en planes premium.',
      },
      {
        q: '¿Hay período de espera para acceder a los tratamientos de fertilidad?',
        a: 'Las prepagas no pueden aplicar períodos de carencia específicos para fertilidad superiores a los generales del plan. Sin embargo, algunos planes requieren que hayas estado afiliado al menos 6 meses antes de iniciar el tratamiento. Consultá al contratar.',
      },
    ],
    relacionadas: ['maternidad', 'psicologia', 'medicamentos'],
    keywords: ['prepagas que cubren fertilización in vitro', 'ley 26862 prepagas fertilidad', 'FIV cobertura prepaga argentina', 'mejor prepaga para tratamiento de fertilidad', 'prepaga ovodonación'],
  },
  {
    slug: 'oncologia',
    nombre: 'Oncología y enfermedades crónicas graves',
    emoji: '🎗️',
    titulo: 'Cobertura oncológica en prepagas: qué cubren y cuál es la mejor',
    metaDescripcion: 'Comparativa de cobertura oncológica en prepagas argentinas. Quimioterapia, radioterapia, medicación de alto costo. Qué dice la ley y qué prepaga conviene.',
    intro: 'El diagnóstico de cáncer es uno de los momentos más críticos para evaluar la cobertura de una prepaga. En Argentina, la Ley 23.661 y el PMO ampliado establecen coberturas mínimas, pero las diferencias entre prepagas en acceso a centros de oncología, medicación de alto costo y velocidad de autorización pueden ser determinantes.',
    queEstableceLaLey: 'El PMO cubre quimioterapia, radioterapia, cirugía oncológica e internaciones. La Ley de Medicamentos de Alto Costo (Ley 26.689) y la cobertura de patologías poco frecuentes obligan a cubrir medicamentos de alto costo oncológicos. Las prepagas no pueden dar de baja a un afiliado por tener cáncer.',
    prepagasRecomendadas: [
      { slug: 'swiss-medical', razon: 'Swiss Medical tiene los mejores centros oncológicos privados en convenio (Instituto Alexander Fleming, Centro Oncológico de Excelencia). Sus planes SMG20 en adelante cubren oncología con acceso rápido a especialistas y medicación de alto costo.', planSlug: 'smg20' },
      { slug: 'osde', razon: 'OSDE tiene la red oncológica más amplia en términos de cantidad de centros adheridos. Plan 310 en adelante cubre oncología integral. Su fortaleza es el acceso a tratamientos en centros de excelencia en todo el país.', planSlug: '310' },
      { slug: 'cemic', razon: 'CEMIC es un centro oncológico universitario de referencia. Sus planes cubren tratamientos oncológicos con acceso a profesores universitarios y protocolos de última generación. Ideal para segunda opinión médica.', planSlug: 'plan-individual' },
    ],
    prepagasRestrictivas: [
      { slug: 'premedic', detalle: 'PMO básico. Para tratamientos oncológicos complejos puede requerir derivación a centros fuera de su red.' },
      { slug: 'medife', detalle: 'Cobertura oncológica PMO. Red más limitada para tratamientos de alta complejidad.' },
    ],
    quePreguntar: [
      '¿A qué centros oncológicos especializados tengo acceso?',
      '¿Cubrís medicación oncológica de alto costo sin tope?',
      '¿Qué tan rápido se autorizan los tratamientos?',
      '¿Cubrís segunda opinión médica oncológica?',
      '¿Qué pasa con los ensayos clínicos?',
    ],
    faq: [
      {
        q: '¿La prepaga me puede dar de baja si me diagnostican cáncer?',
        a: 'No. La Ley de Prepagas 26.682 prohíbe expresamente dar de baja a un afiliado por razones de salud, incluyendo diagnósticos oncológicos. Si una prepaga intenta hacerlo, es ilegal y podés presentar denuncia ante SSSalud.',
      },
      {
        q: '¿Las prepagas cubren medicamentos oncológicos de alto costo como inmunoterapia?',
        a: 'La ley obliga a cubrir los tratamientos indicados médicamente, incluyendo inmunoterapia y terapias blanco. Sin embargo, la velocidad de autorización varía mucho. Swiss Medical y OSDE tienen los procesos más ágiles para medicación oncológica de alto costo.',
      },
      {
        q: '¿Puedo contratar una prepaga si ya tengo diagnóstico de cáncer?',
        a: 'Podés contratar, pero la prepaga puede declarar el cáncer como preexistencia y aplicar un período de carencia o excluir esa condición temporalmente. La Ley 26.682 establece que después de 2 años de afiliación, no pueden negarle cobertura por ninguna preexistencia.',
      },
    ],
    relacionadas: ['medicamentos', 'psicologia', 'urgencias'],
    keywords: ['prepaga cobertura oncológica', 'mejor prepaga para cáncer Argentina', 'quimioterapia cobertura prepaga', 'medicamentos alto costo prepaga', 'prepaga diagnóstico cáncer'],
  },
  {
    slug: 'medicamentos',
    nombre: 'Medicamentos y farmacia',
    emoji: '💊',
    titulo: 'Descuento en medicamentos en prepagas: qué cubre cada una',
    metaDescripcion: 'Comparativa de cobertura de medicamentos en prepagas argentinas. Descuentos en farmacia, medicación crónica, alto costo. Swiss Medical, OSDE, Sancor y más.',
    intro: 'La cobertura de medicamentos puede representar un ahorro de $10.000 a $50.000 por mes para quienes toman medicación crónica. Todas las prepagas tienen cobertura farmacéutica, pero los porcentajes de descuento, los medicamentos incluidos y los límites varían significativamente.',
    queEstableceLaLey: 'El PMO establece cobertura al 40% en medicamentos genéricos del vademécum básico. Para enfermedades crónicas (hipertensión, diabetes, hipotiroidismo), el descuento mínimo es del 70%. Los medicamentos de alto costo para enfermedades poco frecuentes deben ser cubiertos al 100% bajo la Ley 26.689.',
    prepagasRecomendadas: [
      { slug: 'swiss-medical', razon: 'Swiss Medical tiene uno de los mejores sistemas de descuentos en farmacia. Sus afiliados acceden a la red de Swiss Farma con descuentos del 40-80% según el medicamento. La cobertura de medicación crónica es especialmente buena.', planSlug: 'smg20' },
      { slug: 'osde', razon: 'OSDE tiene convenio con la mayor red de farmacias del país. Sus descuentos en medicación crónica (diabetes, hipertensión, colesterol) son del 70% en el vademécum OSDE. También tienen programa de entrega a domicilio.', planSlug: '310' },
      { slug: 'sancor-salud', razon: 'Sancor Salud ofrece muy buenos descuentos en farmacia para el interior del país, donde tiene más farmacias adheridas que la competencia. El Plan 3000 incluye cobertura al 40-70% según diagnóstico.', planSlug: 'plan-3000' },
    ],
    prepagasRestrictivas: [],
    quePreguntar: [
      '¿Qué porcentaje de descuento tiene la medicación que tomo?',
      '¿Hay farmacias adheridas en mi barrio?',
      '¿La medicación de alto costo está cubierta al 100%?',
      '¿Cómo se gestiona la receta electrónica?',
      '¿Tienen entrega de medicamentos a domicilio?',
    ],
    faq: [
      {
        q: '¿Cuánto descuento me hace la prepaga en farmacia?',
        a: 'El PMO garantiza 40% en genéricos y 70% en crónicos. En la práctica: Swiss Medical y OSDE aplican 40-80% según el medicamento. Premedic y Medife aplican el mínimo del PMO. Para medicación de alto costo oncológica o de enfermedades raras, la cobertura es del 100% por ley.',
      },
      {
        q: '¿La prepaga cubre insulina y medicamentos para diabetes?',
        a: 'Sí. Los medicamentos para diabetes (insulina, metformina, análogos) deben cubrirse al 70% como mínimo por PMO. Swiss Medical y OSDE tienen programas especiales de diabetes con descuentos mayores y entrega de insumos (tiras reactivas, lancetas).',
      },
      {
        q: '¿Puedo comprar los medicamentos en cualquier farmacia?',
        a: 'Depende del plan. Los planes de red cerrada solo dan descuento en farmacias adheridas. Los de red abierta permiten comprar en cualquier farmacia y pedir reintegro, aunque el descuento inmediato solo aplica en la red. OSDE tiene la red de farmacias más amplia del país.',
      },
    ],
    relacionadas: ['oncologia', 'psicologia', 'urgencias'],
    keywords: ['descuento medicamentos prepaga', 'prepaga farmacia argentina', 'cobertura medicación crónica prepaga', 'prepaga medicamentos diabetes', 'farmacia adherida prepaga'],
  },
  {
    slug: 'urgencias',
    nombre: 'Urgencias y emergencias 24hs',
    emoji: '🚨',
    titulo: 'Guardia y urgencias en prepagas: cobertura completa 24 horas',
    metaDescripcion: 'Cómo funcionan las guardias y urgencias en prepagas argentinas. Cobertura de emergencias 24hs, traslados, internación de urgencia. Sin copago vs con copago.',
    intro: 'Las urgencias y emergencias son la cobertura más crítica de cualquier prepaga. Cuando hay una emergencia no hay tiempo para comparar: necesitás saber de antemano si tu prepaga te cubre en la clínica más cercana, si el traslado en ambulancia está incluido y si podés internarte sin papeles previos.',
    queEstableceLaLey: 'El PMO garantiza cobertura de urgencias y emergencias las 24 horas en todo el territorio nacional, incluyendo en clínicas y hospitales que no son de la red de la prepaga si es una emergencia real. La prepaga no puede negarse a cubrir una emergencia real por motivos de red.',
    prepagasRecomendadas: [
      { slug: 'swiss-medical', razon: 'Swiss Medical tiene el servicio de emergencias más completo: Swiss Medical Emergencias atiende en todo AMBA y CABA con ambulancias propias. Los Swiss Medical Centers son guardias propias con médicos de guardia 24/7. Para el interior tienen convenios con las principales clínicas.', planSlug: 'smg20' },
      { slug: 'osde', razon: 'OSDE tiene convenio con las principales clínicas y sanatorios en todo el país. Su ventaja es la cobertura en el interior: en ciudades donde otras prepagas tienen poca red, OSDE casi siempre tiene clínicas adheridas.', planSlug: '310' },
      { slug: 'sancor-salud', razon: 'Sancor Salud tiene buena cobertura de urgencias en el interior con sus propios centros médicos en varias provincias. El Plan 3000 incluye ambulancias y traslado cubiertos.', planSlug: 'plan-3000' },
    ],
    prepagasRestrictivas: [
      { slug: 'premedic', detalle: 'Cobertura de urgencias concentrada en CABA, GBA, Córdoba y Tucumán. Fuera de esas zonas la cobertura de emergencias es más limitada.' },
    ],
    quePreguntar: [
      '¿Tienen ambulancias propias o con qué empresa trabajan?',
      '¿El traslado en ambulancia tiene copago?',
      '¿Puedo internarme de urgencia en cualquier clínica?',
      '¿Qué pasa si tengo una emergencia en el interior del país?',
      '¿Las urgencias pediátricas están incluidas?',
    ],
    faq: [
      {
        q: '¿Las emergencias tienen copago en la prepaga?',
        a: 'Depende del plan. Los planes con copago generalmente aplican un copago en guardia (usualmente $3.000-$8.000). Los planes sin copago como Swiss Medical SMG40 u OSDE 410/510 no cobran copago en guardia. En emergencias graves (código rojo), muchas prepagas no cobran copago aunque el plan lo tenga.',
      },
      {
        q: '¿La prepaga me cubre si tengo una emergencia de vacaciones en otra provincia?',
        a: 'Por ley, sí. Las prepagas deben cubrir emergencias en todo el territorio nacional. En la práctica, OSDE es la que mejor cobertura tiene en el interior por su red de convenios. Recomendamos siempre tener el número de emergencias de tu prepaga guardado en el teléfono.',
      },
      {
        q: '¿Qué hago si la clínica más cercana no es de mi red en una emergencia?',
        a: 'La ley es clara: en una emergencia real podés atenderte en cualquier guardia del país y la prepaga está obligada a pagar. Guardá toda la documentación (facturas, órdenes médicas) para pedir el reintegro después. Si la prepaga se niega, presentá denuncia ante SSSalud.',
      },
    ],
    relacionadas: ['medicamentos', 'oncologia', 'psicologia'],
    keywords: ['urgencias emergencias prepaga', 'guardia 24hs prepaga', 'prepaga sin copago emergencias', 'ambulancia prepaga cobertura', 'emergencias interior del país prepaga'],
  },
  {
    slug: 'optica',
    nombre: 'Óptica y lentes',
    emoji: '👁',
    titulo: '¿Las prepagas cubren anteojos y lentes de contacto?',
    metaDescripcion: 'Qué prepagas cubren óptica en Argentina. Anteojos, lentes de contacto, cirugía láser. Topes, requisitos y cómo acceder al beneficio.',
    intro: 'La cobertura óptica es un beneficio incluido en muchas prepagas, aunque con diferencias importantes en los topes anuales, los tipos de lentes cubiertos y si aplica para cirugía láser. No está en el PMO básico, por lo que depende del plan contratado.',
    queEstableceLaLey: 'El PMO no incluye óptica de forma obligatoria. Sin embargo, muchas prepagas la incluyen como beneficio adicional. Sí es obligatorio el control oftalmológico como parte del PMO. Para discapacidad visual, la Ley 24.901 obliga a cubrir lentes u órtesis visuales.',
    prepagasRecomendadas: [
      { slug: 'swiss-medical', razon: 'Swiss Medical incluye cobertura óptica en los planes SMG20 en adelante. Tienen ópticas propias en sus centros médicos con descuentos del 30-50% en armazones y lentes. Topes anuales razonables para lentes recetados.', planSlug: 'smg20' },
      { slug: 'osde', razon: 'OSDE tiene convenio con la red de ópticas más grande del país (Óptica Carol, entre otras). El Plan 310 incluye cobertura con tope anual. El 410 amplía el beneficio con mayor cobertura en lentes progresivos.', planSlug: '310' },
      { slug: 'sancor-salud', razon: 'Sancor Salud Plan 3000 incluye beneficio óptico con cobertura parcial. Buena relación precio-calidad para quienes necesitan renovar anteojos cada 2 años.', planSlug: 'plan-3000' },
    ],
    prepagasRestrictivas: [
      { slug: 'premedic', detalle: 'Sin cobertura óptica incluida en sus planes.' },
    ],
    quePreguntar: [
      '¿Cuál es el tope anual de cobertura óptica?',
      '¿Cubre lentes progresivos y lentes de contacto?',
      '¿Cubrís cirugía láser de vista (PRK, LASIK)?',
      '¿Cuántos pares de anteojos cubre por año?',
      '¿Hay ópticas adheridas en mi zona?',
    ],
    faq: [
      {
        q: '¿Cuánto cubre la prepaga para anteojos?',
        a: 'Los topes varían: Swiss Medical SMG20 cubre hasta $80.000-120.000 por año. OSDE 310 tiene un tope similar. Los planes básicos no suelen incluir óptica. Para lentes de contacto, la cobertura es más limitada y generalmente requiere indicación médica (queratocono, etc.).',
      },
      {
        q: '¿La prepaga cubre cirugía láser de ojos?',
        a: 'Generalmente no, a menos que haya indicación médica específica (por ejemplo, intolerancia al uso de lentes de contacto con afección corneal). Swiss Medical SMG40 y OSDE 510 tienen los mejores beneficios para procedimientos oftalmológicos incluyendo algunos casos de cirugía refractiva.',
      },
    ],
    relacionadas: ['odontologia', 'rehabilitacion', 'medicamentos'],
    keywords: ['prepaga que cubre anteojos', 'cobertura óptica prepaga argentina', 'prepaga lentes de contacto', 'prepaga cirugía láser ojos', 'beneficio óptico prepaga'],
  },
  {
    slug: 'rehabilitacion',
    nombre: 'Kinesiología y rehabilitación',
    emoji: '🏃',
    titulo: 'Cobertura de kinesiología y rehabilitación en prepagas',
    metaDescripcion: 'Qué prepagas cubren kinesiología, fisioterapia y rehabilitación en Argentina. Sesiones por mes, fonoaudiología, terapia ocupacional y más.',
    intro: 'La kinesiología y rehabilitación son esenciales después de cirugías, accidentes o para tratamiento de enfermedades crónicas. El PMO incluye cobertura básica, pero las diferencias entre prepagas en cantidad de sesiones, acceso a especialidades y copago son muy grandes.',
    queEstableceLaLey: 'El PMO cubre kinesiología, fisioterapia, fonoaudiología y terapia ocupacional cuando están indicadas médicamente. No hay un límite de sesiones establecido por ley mientras exista indicación médica. Las prepagas no pueden limitar arbitrariamente el número de sesiones.',
    prepagasRecomendadas: [
      { slug: 'swiss-medical', razon: 'Swiss Medical tiene centros de rehabilitación propios con equipamiento de última generación. Cubre kinesiología, hidroterapia, fonoaudiología y terapia ocupacional. Los planes SMG20 en adelante tienen cobertura amplia con pocos requisitos de auditoría.', planSlug: 'smg20' },
      { slug: 'osde', razon: 'OSDE tiene la red de kinesiólogos adheridos más grande del país. Muy buena opción si querés elegir tu propio kinesiólogo. El Plan 310 cubre sesiones con copago razonable.', planSlug: '310' },
      { slug: 'sancor-salud', razon: 'Sancor Salud cubre kinesiología con buena disponibilidad en el interior del país. El Plan 3000 es competitivo en precio para quienes necesitan rehabilitación regular.', planSlug: 'plan-3000' },
    ],
    prepagasRestrictivas: [],
    quePreguntar: [
      '¿Cuántas sesiones de kinesiología cubren por mes sin auditoría?',
      '¿Cubre fonoaudiología y terapia ocupacional?',
      '¿Hay kinesiólogos adheridos a domicilio?',
      '¿Cubrís rehabilitación post-quirúrgica completa?',
      '¿Qué tan rápido autorizan las sesiones?',
    ],
    faq: [
      {
        q: '¿Cuántas sesiones de kinesiología cubre la prepaga por mes?',
        a: 'Por ley no hay límite si existe indicación médica. En la práctica, Swiss Medical y OSDE autorizan entre 12-20 sesiones mensuales sin auditoría. A partir de ese número pueden pedir un informe de evolución. Premedic y Medife tienen límites más estrictos.',
      },
      {
        q: '¿La prepaga cubre kinesiología en domicilio?',
        a: 'Algunas prepagas cubren kinesiología domiciliaria bajo indicación médica (pacientes con movilidad reducida, post-ACV, etc.). Swiss Medical y OSDE tienen este servicio. En planes básicos puede requerir autorización especial.',
      },
    ],
    relacionadas: ['urgencias', 'odontologia', 'medicamentos'],
    keywords: ['prepaga que cubre kinesiología', 'cobertura rehabilitación prepaga', 'kinesiología sesiones prepaga', 'fonoaudiología prepaga argentina', 'fisioterapia cobertura prepaga'],
  },
  {
    slug: 'bariátrica',
    nombre: 'Cirugía bariátrica y obesidad',
    emoji: '⚕️',
    titulo: '¿Las prepagas cubren la cirugía bariátrica en Argentina?',
    metaDescripcion: 'Todo sobre la cobertura de cirugía bariátrica en prepagas argentinas. Manga gástrica, bypass, banda gástrica. Requisitos, qué prepagas cubren mejor y cómo pedirla.',
    intro: 'La cirugía bariátrica (manga gástrica, bypass gástrico) tiene una cobertura obligatoria en prepagas argentinas desde 2013. Sin embargo, los requisitos para acceder, los tiempos de espera y la calidad de los cirujanos en convenio varían enormemente.',
    queEstableceLaLey: 'La Ley 26.396 (Ley de Trastornos Alimentarios) y la Resolución 904/2010 de SSSalud establecen que las prepagas deben cubrir cirugía bariátrica cuando el paciente cumple los criterios médicos: IMC ≥ 40 o IMC ≥ 35 con comorbilidades. La cobertura incluye la cirugía, internación y seguimiento postoperatorio.',
    prepagasRecomendadas: [
      { slug: 'swiss-medical', razon: 'Swiss Medical tiene los mejores cirujanos bariátricos del país en convenio y centros propios con programas integrales de obesidad. Cubre manga gástrica y bypass con seguimiento nutricional y psicológico incluido.', planSlug: 'smg20' },
      { slug: 'osde', razon: 'OSDE tiene convenio con los principales centros bariátricos del país. El Plan 310 en adelante cubre la cirugía con programa de seguimiento. La ventaja es la disponibilidad de centros en todo el territorio nacional.', planSlug: '310' },
    ],
    prepagasRestrictivas: [
      { slug: 'premedic', detalle: 'Cubre por ley pero la red de cirujanos especializados es más acotada.' },
      { slug: 'medife', detalle: 'Cobertura legal pero con proceso de autorización más largo.' },
    ],
    quePreguntar: [
      '¿Qué cirujanos bariátricos tienen en convenio?',
      '¿El seguimiento nutricional y psicológico post-cirugía está incluido?',
      '¿Cuánto tiempo lleva obtener la autorización?',
      '¿Cómo se acredita el IMC y las comorbilidades?',
      '¿La cirugía de revisión (si hay complicaciones) también está cubierta?',
    ],
    faq: [
      {
        q: '¿Qué requisitos pide la prepaga para autorizar una cirugía bariátrica?',
        a: 'Los requisitos standard son: IMC ≥ 40 (o ≥ 35 con diabetes, hipertensión, apnea del sueño), haber fracasado en tratamientos no quirúrgicos por al menos 2 años, evaluación psicológica y nutricional previa. Cada prepaga puede agregar requisitos adicionales, pero no puede negarla si se cumplen los criterios médicos.',
      },
      {
        q: '¿La cirugía bariátrica tiene período de carencia en la prepaga?',
        a: 'Sí, generalmente las prepagas aplican un período de carencia para procedimientos quirúrgicos programados de entre 6 y 12 meses. Esto significa que si recién te afiliás, tendrás que esperar ese período antes de que cubran la cirugía bariátrica.',
      },
    ],
    relacionadas: ['medicamentos', 'psicologia', 'rehabilitacion'],
    keywords: ['prepaga que cubre cirugía bariátrica', 'manga gástrica cobertura prepaga', 'bypass gástrico prepaga argentina', 'ley 26396 bariátrica prepagas', 'prepaga obesidad cirugía'],
  },
]

export function getCoberturaBySlug(slug: string) {
  return coberturas.find((c) => c.slug === slug)
}
