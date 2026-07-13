export interface CondicionData {
  slug: string
  nombre: string
  emoji: string
  titulo: string
  metaDescripcion: string
  intro: string
  queCubreElPMO: string
  prepagasRecomendadas: { slug: string; planSlug?: string; razon: string }[]
  preguntasAntesDeFirmar: string[]
  faq: { q: string; a: string }[]
  coberturasRelacionadas: string[] // slugs de coberturas
  keywords: string[]
}

export const condiciones: CondicionData[] = [
  {
    slug: 'diabetes',
    nombre: 'Diabetes',
    emoji: '💉',
    titulo: 'Mejor prepaga para diabéticos en Argentina 2026',
    metaDescripcion: 'Cuál es la mejor prepaga si tenés diabetes en Argentina. Cobertura de insulina, tiras reactivas, bombas de insulina, endocrinólogos. Comparativa completa.',
    intro: 'La diabetes es una de las condiciones crónicas más relevantes al elegir una prepaga. Las diferencias entre prepagas no están solo en los precios: están en el acceso a endocrinólogos, la cobertura de insumos (tiras reactivas, lancetas, bombas de insulina), los descuentos en medicación y la calidad del seguimiento de la enfermedad.',
    queCubreElPMO: 'El PMO cubre: consultas con endocrinólogo, insulinas (humanas y análogos), hipoglucemiantes orales con 70% de descuento, tiras reactivas (cantidad según tipo de diabetes), hemoglobina glicosilada (HbA1c) cada 3 meses, fondo de ojo anual y evaluación podológica. La Ley 23.753 (Ley de Diabetes) amplía la cobertura obligatoria.',
    prepagasRecomendadas: [
      {
        slug: 'swiss-medical',
        planSlug: 'smg20',
        razon: 'Swiss Medical tiene el programa de diabetes más completo del mercado: seguimiento por equipo multidisciplinario (endocrinólogo, nutricionista, podólogo, oftalmólogo), cobertura de bombas de insulina bajo indicación médica, y descuentos del 70-100% en insulinas análogas. Sus centros Swiss Medical tienen consultorios de diabetes especializados.',
      },
      {
        slug: 'osde',
        planSlug: '310',
        razon: 'OSDE tiene el programa OSDE Diabetes con cobertura amplia de insumos, educación diabetológica y seguimiento. Su red de endocrinólogos es la más grande del país. El Plan 310 cubre tiras reactivas (hasta 100/mes para insulinodependientes), hemoglobinas cada 3 meses y consultas sin restricciones.',
      },
      {
        slug: 'sancor-salud',
        planSlug: 'plan-3000',
        razon: 'Sancor Salud tiene buena cobertura para diabetes en el interior del país, donde OSDE y Swiss tienen menos endocrinólogos. El Plan 3000 cubre medicación con 70% de descuento y tiene convenios con los principales laboratorios de análisis.',
      },
    ],
    preguntasAntesDeFirmar: [
      '¿Cuántas tiras reactivas por mes cubre para mi tipo de diabetes?',
      '¿La bomba de insulina (si la necesito) está cubierta?',
      '¿Tienen endocrinólogos en mi zona?',
      '¿El glucómetro o sensores de glucosa continua están incluidos?',
      '¿Tienen programa de educación diabetológica?',
    ],
    faq: [
      {
        q: '¿Puedo contratar una prepaga si tengo diabetes?',
        a: 'Sí, podés contratar cualquier prepaga aunque tengas diabetes. La Ley 26.682 prohíbe rechazar afiliados por razones de salud. La prepaga puede declarar la diabetes como preexistencia y aplicar un período de espera de hasta 12 meses para nuevas complicaciones, pero debe cubrir la medicación e insumos desde el primer día.',
      },
      {
        q: '¿La prepaga cubre la bomba de insulina?',
        a: 'La Ley 23.753 obliga a cubrir bombas de insulina para pacientes con diabetes tipo 1 cuando existe indicación médica. Swiss Medical y OSDE tienen los procesos más ágiles de autorización. El proceso puede llevar entre 30 y 90 días en obtener la autorización.',
      },
      {
        q: '¿Cuántas tiras reactivas cubre la prepaga por mes?',
        a: 'El PMO establece cobertura de tiras según el tipo: diabetes tipo 1 con insulina → hasta 100 tiras/mes; diabetes tipo 2 con insulina → hasta 50/mes; diabetes tipo 2 sin insulina → hasta 30/mes. Swiss Medical y OSDE respetan estos estándares; algunas prepagas menores pueden ser más restrictivas.',
      },
    ],
    coberturasRelacionadas: ['medicamentos', 'urgencias', 'optica'],
    keywords: ['mejor prepaga para diabéticos', 'prepaga diabetes tipo 1', 'prepaga diabetes tipo 2', 'cobertura insulina prepaga argentina', 'prepaga bomba insulina'],
  },
  {
    slug: 'celiacos',
    nombre: 'Celiaquía',
    emoji: '🌾',
    titulo: 'Mejor prepaga para celíacos en Argentina 2026',
    metaDescripcion: 'Cuál es la mejor prepaga si sos celíaco en Argentina. Cobertura de alimentos sin TACC, medicación, seguimiento. Qué dice la ley y cuáles prepagas son mejores.',
    intro: 'La celiaquía tiene una cobertura especial en Argentina gracias a la Ley 26.588. Si sos celíaco, la prepaga debe cubrirte el seguimiento médico, análisis específicos y en algunos casos subsidios para alimentos sin TACC. Las diferencias entre prepagas están en la facilidad del trámite y la calidad del seguimiento.',
    queCubreElPMO: 'La Ley 26.588 (Ley de Celiaquía) obliga a cubrir: diagnóstico (serología e histología), seguimiento con gastroenterólogo, densitometría ósea, consulta con nutricionista y en algunos casos subsidio para alimentos sin TACC. La obra social/prepaga también debe cubrir los análisis de control periódicos.',
    prepagasRecomendadas: [
      {
        slug: 'osde',
        planSlug: '310',
        razon: 'OSDE tiene un programa especial para celíacos con seguimiento por gastroenterólogo y nutricionista. Su red de especialistas en gastroenterología es la más amplia. Acceso a análisis de control (anticuerpos, densitometría) sin restricciones.',
      },
      {
        slug: 'swiss-medical',
        planSlug: 'smg20',
        razon: 'Swiss Medical cubre todos los aspectos de la celiaquía con su equipo multidisciplinario. Tienen nutricionistas especializados en dietas sin TACC y gastroenterólogos con experiencia en enfermedad celíaca.',
      },
      {
        slug: 'sancor-salud',
        planSlug: 'plan-3000',
        razon: 'Buena opción precio-calidad para celíacos. Cubre el seguimiento médico obligatorio por ley con acceso a gastroenterólogos y nutricionistas en el interior del país.',
      },
    ],
    preguntasAntesDeFirmar: [
      '¿Tienen gastroenterólogos especializados en celiaquía?',
      '¿La densitometría ósea anual está cubierta?',
      '¿Tienen nutricionistas con experiencia en dieta sin TACC?',
      '¿Los análisis de control (anticuerpos, hemograma) son sin copago?',
    ],
    faq: [
      {
        q: '¿La prepaga subsidia los alimentos sin TACC?',
        a: 'La Ley 26.588 establece un subsidio para alimentos sin TACC, pero su implementación varía. Las obras sociales sindicales suelen tenerlo más desarrollado que las prepagas. Consultá con cada prepaga si tienen un programa de subsidio alimentario para celíacos.',
      },
      {
        q: '¿La celiaquía se considera una preexistencia en la prepaga?',
        a: 'Puede serlo. Si ya tenés diagnóstico de celiaquía al contratar, la prepaga puede declararla preexistencia. Sin embargo, por ley debe cubrir el seguimiento y los análisis de control desde el inicio. La medicación y el subsidio alimentario pueden tener un período de espera.',
      },
    ],
    coberturasRelacionadas: ['medicamentos', 'psicologia', 'urgencias'],
    keywords: ['mejor prepaga para celíacos', 'prepaga celiaquía argentina', 'cobertura celiaquía prepaga', 'ley 26588 prepagas', 'prepaga dieta sin TACC'],
  },
  {
    slug: 'hipertension',
    nombre: 'Hipertensión arterial',
    emoji: '❤️',
    titulo: 'Mejor prepaga si tenés hipertensión arterial en Argentina',
    metaDescripcion: 'Cuál es la mejor prepaga para hipertensos en Argentina. Cobertura de medicación, cardiólogos, controles. Comparativa de Swiss Medical, OSDE y más.',
    intro: 'La hipertensión es la condición crónica más frecuente en Argentina. Si sos hipertenso, el factor más importante al elegir prepaga es la calidad de la red de cardiólogos, el descuento en medicación antihipertensiva y el acceso a estudios de seguimiento (ecocardiograma, holter, ergometría).',
    queCubreElPMO: 'El PMO cubre medicación antihipertensiva con 70% de descuento, consultas con cardiólogo, ECG, ecocardiograma, holter de presión, laboratorio de seguimiento (función renal, ionograma) y fondo de ojo. Todo con indicación médica.',
    prepagasRecomendadas: [
      {
        slug: 'swiss-medical',
        planSlug: 'smg20',
        razon: 'Swiss Medical tiene los mejores cardiólogos en convenio y acceso a sus sanatorios propios para estudios de alta complejidad. Sus descuentos en medicación antihipertensiva son del 70% para los medicamentos del vademécum. Programa preventivo cardiovascular incluido.',
      },
      {
        slug: 'osde',
        planSlug: '310',
        razon: 'OSDE tiene la red de cardiólogos más grande del país. Para hipertensos que necesitan controles frecuentes, la variedad de profesionales disponibles es una ventaja clave. El Plan 310 cubre todos los estudios de seguimiento cardiovascular.',
      },
      {
        slug: 'premedic',
        planSlug: 'plan-300',
        razon: 'Para hipertensos sin otras comorbilidades, Premedic es la opción más económica que cubre lo esencial: medicación con descuento 70%, cardiólogo y ECG. Ideal para personas jóvenes con hipertensión controlada y bajo presupuesto.',
      },
    ],
    preguntasAntesDeFirmar: [
      '¿El ecocardiograma está cubierto sin copago adicional?',
      '¿Cuántas consultas con cardiólogo cubre por año?',
      '¿Mi medicación antihipertensiva está en el vademécum con descuento?',
      '¿El holter y la ergometría están incluidos?',
    ],
    faq: [
      {
        q: '¿Cuánto descuento hace la prepaga en medicación para hipertensión?',
        a: 'Por PMO, el mínimo es 70% para medicamentos antihipertensivos en enfermos crónicos. OSDE y Swiss Medical pueden llegar al 80-100% en sus propios programas. El descuento aplica en las farmacias de su red.',
      },
      {
        q: '¿La hipertensión es una preexistencia que puede rechazar una prepaga?',
        a: 'Ninguna prepaga puede rechazar afiliados por hipertensión. Puede declararla como preexistencia y aplicar un período de espera de hasta 12 meses para nuevas complicaciones cardiovasculares (como una cirugía electiva). La medicación y controles de rutina deben cubrirse desde el inicio.',
      },
    ],
    coberturasRelacionadas: ['medicamentos', 'urgencias', 'rehabilitacion'],
    keywords: ['mejor prepaga para hipertensos', 'prepaga hipertensión arterial', 'cobertura medicación hipertensión prepaga', 'cardiólogo prepaga argentina', 'prepaga control cardiovascular'],
  },
  {
    slug: 'preexistencias',
    nombre: 'Preexistencias',
    emoji: '📋',
    titulo: 'Prepaga con preexistencias: qué dice la ley y cuáles son las más flexibles',
    metaDescripcion: 'Todo sobre preexistencias en prepagas argentinas. Qué dice la ley, cuánto tiempo duran, qué prepagas son más flexibles y cómo protegerte.',
    intro: 'Las preexistencias son la principal preocupación de quienes quieren contratar una prepaga con enfermedades o condiciones de salud previas. La buena noticia: la ley argentina pone límites muy claros a lo que pueden hacer las prepagas con las preexistencias, y después de 2 años no pueden usarlas como excusa para negar ningún tratamiento.',
    queCubreElPMO: 'La Ley 26.682 establece que las prepagas pueden declarar preexistencias al ingreso, pero NO pueden rechazar afiliados por ellas ni cobrar sobreprecios permanentes. Los períodos de carencia para preexistencias tienen un máximo de 12 meses. Después de 24 meses de afiliación, la prepaga no puede negar cobertura por ninguna preexistencia.',
    prepagasRecomendadas: [
      {
        slug: 'sancor-salud',
        planSlug: 'plan-3000',
        razon: 'Sancor Salud es conocida por tener un proceso de admisión más flexible para personas con preexistencias. Sus períodos de carencia tienden a ser menores y el proceso de declaración es más ágil que en prepagas más grandes.',
      },
      {
        slug: 'premedic',
        planSlug: 'plan-300',
        razon: 'Premedic tiene una política de admisión más accesible y períodos de carencia más cortos para muchas condiciones. Es una buena opción para quienes tienen preexistencias menores y presupuesto ajustado.',
      },
      {
        slug: 'medife',
        planSlug: 'individual',
        razon: 'Medife tiene una política de preexistencias razonable. Para condiciones estables y controladas, los períodos de carencia son relativamente cortos.',
      },
    ],
    preguntasAntesDeFirmar: [
      '¿Declaran mi condición como preexistencia? ¿Por cuánto tiempo?',
      '¿Qué cobertura tengo durante el período de carencia?',
      '¿Puedo recurrir si considero que el período es excesivo?',
      '¿Cuándo exactamente desaparece la limitación por preexistencia?',
    ],
    faq: [
      {
        q: '¿Puede una prepaga rechazarme por tener una enfermedad previa?',
        a: 'No. La Ley 26.682 prohíbe expresamente rechazar afiliados por razones de salud o preexistencias. Si una prepaga intenta rechazarte, podés denunciarlo ante la Superintendencia de Servicios de Salud (SSSalud). Sí pueden aplicar períodos de carencia, pero no rechazarte.',
      },
      {
        q: '¿Cuánto tiempo dura la carencia por preexistencia?',
        a: 'El máximo legal es 12 meses. Durante ese período, la prepaga puede no cubrir tratamientos relacionados con esa preexistencia específica, pero sí debe cubrirte todo lo demás. A los 24 meses de afiliación, todas las carencias por preexistencias desaparecen por ley.',
      },
      {
        q: '¿Qué pasa si no declaro una preexistencia?',
        a: 'No declarar una preexistencia puede resultar en que la prepaga rechace cobertura en el futuro cuando detecten la condición. Si la preexistencia fue declarada y pasó el período de carencia, la cobertura es plena. Recomendamos siempre declarar honestamente.',
      },
    ],
    coberturasRelacionadas: ['medicamentos', 'psicologia', 'urgencias'],
    keywords: ['prepaga con preexistencias', 'período de carencia prepaga', 'ley 26682 preexistencias', 'prepaga flexible preexistencias', 'cómo afectan las preexistencias a la prepaga'],
  },
  {
    slug: 'salud-mental',
    nombre: 'Trastornos de salud mental',
    emoji: '🧘',
    titulo: 'Mejor prepaga para salud mental: depresión, ansiedad, TOC y más',
    metaDescripcion: 'Qué prepaga cubre mejor la salud mental en Argentina. Tratamiento de depresión, ansiedad, TOC, bipolaridad. Psicólogos, psiquiatras, internaciones. Ley 26657.',
    intro: 'La salud mental va más allá de las sesiones de psicología. Para personas con diagnósticos psiquiátricos (depresión severa, trastorno bipolar, TOC, esquizofrenia), las diferencias entre prepagas son críticas: acceso a psiquiatras, cobertura de medicación psiquiátrica, internaciones y hospitales de día.',
    queCubreElPMO: 'La Ley 26.657 establece igualdad de cobertura entre salud mental y salud física. Las prepagas deben cubrir: psicoterapia sin límite de sesiones (con indicación), psiquiatría, medicación psiquiátrica con descuento, internaciones en clínicas psiquiátricas y hospital de día. No pueden discriminar por diagnóstico psiquiátrico.',
    prepagasRecomendadas: [
      {
        slug: 'swiss-medical',
        planSlug: 'smg20',
        razon: 'Swiss Medical tiene la red de psiquiatras y psicólogos más amplia y con las esperas más cortas. Sus centros atienden patologías complejas incluyendo trastornos severos. La cobertura de medicación psiquiátrica incluye antidepresivos, ansiolíticos y antipsicóticos con 70-100% de descuento.',
      },
      {
        slug: 'osde',
        planSlug: '310',
        razon: 'OSDE tiene la mayor variedad de profesionales de salud mental adheridos. Para quienes buscan elegir su propio psicólogo o psiquiatra, OSDE ofrece la mayor libertad de elección. El Plan 310 cubre internaciones en clínicas psiquiátricas con red amplia.',
      },
      {
        slug: 'cemic',
        planSlug: 'plan-individual',
        razon: 'CEMIC tiene un departamento de salud mental universitario de excelencia. Ideal para casos complejos que necesitan diagnóstico diferencial o segunda opinión psiquiátrica. Sus clínicas propias tienen servicios de internación psiquiátrica.',
      },
    ],
    preguntasAntesDeFirmar: [
      '¿Cubrís hospitalización psiquiátrica sin límite de días?',
      '¿Hospital de día psiquiátrico está incluido?',
      '¿La medicación psiquiátrica tiene descuento en el vademécum?',
      '¿Cuántos psiquiatras tienen en mi zona?',
      '¿Los tratamientos de salud mental tienen límite de sesiones?',
    ],
    faq: [
      {
        q: '¿La prepaga puede negarme cobertura por tener diagnóstico psiquiátrico?',
        a: 'No. La Ley 26.657 y la Ley 26.682 prohíben discriminar por diagnóstico de salud mental. Una prepaga no puede rechazarte, darte de baja ni limitarte la cobertura por tener depresión, trastorno bipolar u otro diagnóstico psiquiátrico.',
      },
      {
        q: '¿Cuántos días de internación psiquiátrica cubre la prepaga?',
        a: 'La Ley 26.657 establece que las internaciones psiquiátricas deben cubrirse igual que cualquier otra internación médica, sin límite de días por ley. La prepaga no puede limitar la internación psiquiátrica a menos días que una internación clínica equivalente.',
      },
    ],
    coberturasRelacionadas: ['psicologia', 'medicamentos', 'urgencias'],
    keywords: ['mejor prepaga salud mental', 'prepaga depresión ansiedad', 'prepaga psiquiatra Argentina', 'cobertura salud mental prepaga', 'ley 26657 prepagas psiquiatría'],
  },
  {
    slug: 'artritis',
    nombre: 'Artritis y enfermedades reumáticas',
    emoji: '🦴',
    titulo: 'Mejor prepaga para artritis reumatoidea y enfermedades reumáticas',
    metaDescripcion: 'Cuál es la mejor prepaga si tenés artritis reumatoidea, lupus o espondilitis en Argentina. Cobertura de biológicos, reumatólogos y kinesiología.',
    intro: 'Las enfermedades reumáticas (artritis reumatoidea, lupus, espondilitis, psoriasis artropática) requieren seguimiento especializado y en muchos casos medicación biológica de alto costo. La elección de prepaga puede marcar una diferencia enorme en acceso a reumatólogos y en la velocidad de autorización de los biológicos.',
    queCubreElPMO: 'El PMO cubre reumatología, análisis específicos (factor reumatoide, anti-CCP, ANA), radiografías y ecografías articulares. La medicación biológica (adalimumab, etanercept, rituximab) debe cubrirse al 100% bajo la Ley 26.689 para enfermedades poco frecuentes o bajo el PMO para artritis reumatoidea activa.',
    prepagasRecomendadas: [
      {
        slug: 'swiss-medical',
        planSlug: 'smg20',
        razon: 'Swiss Medical tiene los mejores reumatólogos en convenio y acceso ágil a medicación biológica. Sus centros propios tienen laboratorios para seguimiento de enfermedades autoinmunes. El proceso de autorización de biológicos es el más rápido del mercado.',
      },
      {
        slug: 'osde',
        planSlug: '310',
        razon: 'OSDE tiene la mayor cantidad de reumatólogos adheridos y acceso a los principales centros de reumatología del país. Para quienes viven en el interior, OSDE es la única opción que garantiza reumatólogos en ciudades medianas.',
      },
    ],
    preguntasAntesDeFirmar: [
      '¿Tienen reumatólogos disponibles en mi zona?',
      '¿Los medicamentos biológicos están cubiertos al 100%?',
      '¿Cuánto tarda la autorización de un biológico?',
      '¿La kinesiología para rehabilitación articular está incluida?',
      '¿Cubrís cirugía de reemplazo articular (prótesis de cadera/rodilla)?',
    ],
    faq: [
      {
        q: '¿La prepaga cubre los medicamentos biológicos para artritis?',
        a: 'Sí. Los medicamentos biológicos (adalimumab, etanercept, baricitinib, etc.) deben cubrirse al 100% bajo la Ley 26.689 (enfermedades poco frecuentes) o por el PMO para artritis reumatoidea. El proceso de autorización varía: Swiss Medical y OSDE son los más ágiles.',
      },
      {
        q: '¿Las prótesis de cadera o rodilla están cubiertas?',
        a: 'Sí, las cirugías de reemplazo articular están cubiertas por el PMO cuando están indicadas médicamente. La cobertura incluye la prótesis, la cirugía y la rehabilitación post-operatoria. Swiss Medical y OSDE tienen los mejores centros ortopédicos para estas cirugías.',
      },
    ],
    coberturasRelacionadas: ['medicamentos', 'rehabilitacion', 'urgencias'],
    keywords: ['prepaga artritis reumatoidea', 'mejor prepaga enfermedades reumáticas', 'prepaga medicamentos biológicos', 'prepaga lupus Argentina', 'reumatólogo prepaga'],
  },
  {
    slug: 'autismo',
    nombre: 'Autismo (TEA)',
    emoji: '🧩',
    titulo: 'Mejor prepaga para personas con autismo (TEA) en Argentina',
    metaDescripcion: 'Cuál es la mejor prepaga si tenés un hijo con autismo (TEA). Cobertura de terapia ABA, fonoaudiología, psicología. Ley 27.043 y qué prepagas cumplen mejor.',
    intro: 'Para familias con un niño o adulto con Trastorno del Espectro Autista (TEA), la elección de prepaga es una decisión crítica. La Ley 27.043 obliga a cubrir tratamientos para TEA, pero las diferencias en red de profesionales especializados, velocidad de autorización y cobertura de terapias intensivas son enormes.',
    queCubreElPMO: 'La Ley 27.043 establece cobertura obligatoria para TEA incluyendo: diagnóstico, terapia ABA (Análisis de Conducta Aplicado), fonoaudiología, psicología, terapia ocupacional, integración sensorial y apoyo escolar especializado. No hay límite de horas establecido si existe indicación médica.',
    prepagasRecomendadas: [
      {
        slug: 'osde',
        planSlug: '310',
        razon: 'OSDE tiene la red de profesionales especializados en TEA más amplia: terapistas ABA, fonoaudiólogos con especialización en TEA, psicólogos con experiencia en autismo. Su Plan 310 cubre las terapias intensivas sin restricciones arbitrarias de horas.',
      },
      {
        slug: 'swiss-medical',
        planSlug: 'smg20',
        razon: 'Swiss Medical tiene centros especializados en neurodesarrollo y TEA. Su equipo interdisciplinario (neuropediatra, psicólogo, fonoaudiólogo, TO) trabaja coordinadamente. Buen proceso de autorización para terapias ABA.',
      },
      {
        slug: 'sancor-salud',
        planSlug: 'plan-3000',
        razon: 'Sancor Salud tiene buena cobertura de TEA en el interior del país. Cumple la Ley 27.043 con acceso a profesionales en ciudades donde OSDE y Swiss tienen menos presencia.',
      },
    ],
    preguntasAntesDeFirmar: [
      '¿Tienen terapistas ABA en convenio en mi zona?',
      '¿Cuántas horas de ABA cubren por semana?',
      '¿El equipo interdisciplinario (neuro, fono, psico, TO) está disponible?',
      '¿Cubrís centros de día especializados en TEA?',
      '¿Cuánto tarda la autorización de las terapias?',
    ],
    faq: [
      {
        q: '¿Cuántas horas de terapia ABA cubre la prepaga?',
        a: 'La Ley 27.043 no establece un límite de horas; la cobertura debe ser según indicación médica y plan terapéutico. En la práctica, las prepagas más grandes cubren entre 10 y 25 horas semanales de ABA. OSDE y Swiss Medical tienen los procesos más favorables para los pacientes.',
      },
      {
        q: '¿La prepaga puede limitar la cobertura de TEA si mi hijo es mayor de 18 años?',
        a: 'No. La Ley 27.043 no establece límite de edad para la cobertura de TEA. Las prepagas deben cubrir los tratamientos indicados para adultos con TEA igual que para menores.',
      },
    ],
    coberturasRelacionadas: ['psicologia', 'rehabilitacion', 'medicamentos'],
    keywords: ['mejor prepaga para autismo', 'prepaga TEA Argentina', 'prepaga terapia ABA', 'ley 27043 prepagas autismo', 'prepaga TEA cobertura'],
  },
  {
    slug: 'enfermedad-cardiovascular',
    nombre: 'Enfermedades cardiovasculares',
    emoji: '🫀',
    titulo: 'Mejor prepaga si tenés enfermedad cardiovascular: infarto, arritmia, stent',
    metaDescripcion: 'Cuál es la mejor prepaga para enfermedades cardiovasculares en Argentina. Cobertura de cateterismo, stent, bypass, marcapasos y cardiología especializada.',
    intro: 'Las enfermedades cardiovasculares requieren acceso inmediato a cardiología de alta complejidad, hemodinamia y cirugía cardíaca. No todas las prepagas tienen convenio con centros de hemodinamia o cirugía cardíaca de excelencia, y esa diferencia puede ser literalmente vital.',
    queCubreElPMO: 'El PMO cubre cardiología, ECG, ecocardiograma, holter, ergometría, cateterismo diagnóstico, angioplastia con stent, cirugía cardíaca (bypass, reemplazo valvular), marcapasos y desfibriladores implantables, y rehabilitación cardíaca.',
    prepagasRecomendadas: [
      {
        slug: 'swiss-medical',
        planSlug: 'smg20',
        razon: 'Swiss Medical tiene los mejores centros de hemodinamia y cirugía cardíaca del país en convenio (Sanatorio de la Trinidad, Sanatorio Güemes). Sus sanatorios propios tienen unidades coronarias de alta complejidad. Atención de urgencias cardiovasculares de primer nivel.',
      },
      {
        slug: 'cemic',
        planSlug: 'plan-individual',
        razon: 'CEMIC tiene un servicio de cardiología universitario de excelencia con acceso a todos los procedimientos de alta complejidad. Ideal para pacientes cardíacos que necesitan seguimiento por cardiólogos de alto nivel académico.',
      },
      {
        slug: 'osde',
        planSlug: '410',
        razon: 'OSDE Plan 410 tiene acceso sin copago a cardiología y todos los estudios cardiovasculares. Su red incluye los principales sanatorios cardiovasculares del país. Mejor opción para quienes viven en el interior.',
      },
    ],
    preguntasAntesDeFirmar: [
      '¿Tienen centros de hemodinamia disponibles las 24hs?',
      '¿Cubrís cirugía cardíaca sin tope económico?',
      '¿El marcapasos o desfibrilador (si lo necesito) está cubierto?',
      '¿La rehabilitación cardíaca post-infarto está incluida?',
      '¿Cuál es el tiempo de respuesta ante una urgencia coronaria?',
    ],
    faq: [
      {
        q: '¿La prepaga cubre un stent o una angioplastia?',
        a: 'Sí. La angioplastia con stent (incluyendo stents medicados) está cubierta por el PMO. La prepaga debe cubrir el procedimiento, el stent, la internación y el seguimiento. Swiss Medical y CEMIC tienen los mejores centros de hemodinamia.',
      },
      {
        q: '¿Puedo contratar una prepaga después de haber tenido un infarto?',
        a: 'Podés contratar, pero la enfermedad cardiovascular puede declararse como preexistencia con un período de carencia de hasta 12 meses para procedimientos electivos relacionados. La medicación cardíaca y las urgencias deben cubrirse desde el primer día.',
      },
    ],
    coberturasRelacionadas: ['medicamentos', 'urgencias', 'rehabilitacion'],
    keywords: ['prepaga enfermedad cardiovascular', 'prepaga infarto miocardio', 'prepaga stent angioplastia', 'cardiología cobertura prepaga', 'mejor prepaga para el corazón'],
  },
]

export function getCondicionBySlug(slug: string) {
  return condiciones.find((c) => c.slug === slug)
}
