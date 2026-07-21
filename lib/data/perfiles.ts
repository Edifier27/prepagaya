import type { Prepaga } from '@/types'

export interface PerfilData {
  slug: string
  nombre: string
  emoji: string
  titulo: string
  metaDescripcion: string
  descripcion: string
  necesidades: string[]
  prepagasRecomendadas: { slug: string; razon: string }[]
  planesRecomendados: { prepagaSlug: string; planSlug: string; razon: string }[]
  faq: { q: string; a: string }[]
  keywords: string[]
}

export const perfiles: PerfilData[] = [
  {
    slug: 'familias',
    nombre: 'Familias',
    emoji: '👨‍👩‍👧‍👦',
    titulo: 'Mejor prepaga para familia',
    metaDescripcion: 'Encontrá la mejor prepaga para tu familia en Argentina. Comparamos precios, coberturas pediátricas y maternidad de Swiss Medical, OSDE, Sancor y más. Precios junio 2026.',
    descripcion: 'Elegir una prepaga para toda la familia requiere equilibrar cobertura pediátrica, maternidad, precio total y amplitud de red. Te ayudamos a encontrar la opción que mejor se adapta a tu grupo familiar.',
    necesidades: [
      'Pediatría con turnos rápidos',
      'Maternidad completa (parto, cesárea, neonatología)',
      'Descuentos por grupo familiar (2do, 3er integrante)',
      'Cobertura odontológica para niños',
      'Red amplia en tu zona',
      'Salud mental para adultos y niños',
    ],
    prepagasRecomendadas: [
      { slug: 'swiss-medical', razon: 'Excelente red pediátrica y maternidad en sus sanatorios propios. App para gestionar turnos de toda la familia.' },
      { slug: 'osde', razon: 'La mayor red de prestadores del país. Ideal para familias que necesitan cobertura en distintas zonas.' },
      { slug: 'sancor-salud', razon: 'Muy buena relación precio-calidad para familias. El plan 3000 cubre pediatría y maternidad a precios accesibles.' },
      { slug: 'medife', razon: 'Planes familiares con descuento progresivo. Buena opción para familias en AMBA.' },
    ],
    planesRecomendados: [
      { prepagaSlug: 'swiss-medical', planSlug: 'smg20', razon: 'Cubre toda la familia con red abierta y excelente maternidad' },
      { prepagaSlug: 'sancor-salud', planSlug: 'plan-3000', razon: 'Mejor relación precio-calidad para familias con niños' },
      { prepagaSlug: 'osde', planSlug: '310', razon: 'Red amplia con buena cobertura pediátrica' },
    ],
    faq: [
      {
        q: '¿Cuánto sale una prepaga para una familia de 4 personas?',
        a: 'Depende de la edad de cada integrante. Una familia tipo (2 adultos de 35 años + 2 hijos menores) puede pagar desde $580.000 con Sancor Plan 3000 hasta $1.300.000 con OSDE 410. Los niños menores de 18 años suelen pagar entre el 50% y 70% del valor del adulto.',
      },
      {
        q: '¿Las prepagas dan descuento por grupo familiar?',
        a: 'Sí. La mayoría de las prepagas aplican descuentos a partir del segundo integrante. Generalmente el 2do integrante paga el 100%, el 3ro entre el 60-80%, y del 4to en adelante entre el 50-60%. Los menores de 18 siempre tienen tarifa especial.',
      },
      {
        q: '¿Qué prepaga cubre mejor el parto?',
        a: 'Swiss Medical destaca por tener sus propios sanatorios maternales con hotelería de primera. OSDE cubre el parto en una amplísima red de maternidades. Ambas incluyen neonatología de alta complejidad en sus planes medios y altos.',
      },
    ],
    keywords: ['mejor prepaga para familia', 'prepaga familiar argentina', 'prepaga con pediatria', 'prepaga maternidad argentina'],
  },
  {
    slug: 'embarazadas',
    nombre: 'Embarazadas',
    emoji: '🤰',
    titulo: 'Mejor prepaga para embarazadas',
    metaDescripcion: 'Guía completa: las mejores prepagas para embarazadas en Argentina. Cobertura del parto, período de carencia, maternidad y atención prenatal. Actualizado junio 2026.',
    descripcion: 'Si estás embarazada o planificando un embarazo, la elección de prepaga es una decisión urgente. Te explicamos qué buscar, qué períodos de carencia existen y cuáles son las mejores opciones.',
    necesidades: [
      'Cobertura del parto sin período de carencia (si ya estás afiliada)',
      'Obstetricia y controles prenatales',
      'Neonatología de alta complejidad',
      'Hotelería materna de calidad',
      'Lactancia y seguimiento post-parto',
      'Pediatría para el bebé desde el nacimiento',
    ],
    prepagasRecomendadas: [
      { slug: 'swiss-medical', razon: 'Sus maternidades propias son referencia nacional. Cobertura 100% del parto y neonatología de alta complejidad.' },
      { slug: 'osde', razon: 'Acceso a las mejores maternidades privadas del país. Red amplísima de obstetras.' },
      { slug: 'sancor-salud', razon: 'Buena cobertura obstétrica a precio accesible. Ideal si el presupuesto es una restricción.' },
    ],
    planesRecomendados: [
      { prepagaSlug: 'swiss-medical', planSlug: 'smg20', razon: 'Maternidad completa con internación en Swiss Medical Centers' },
      { prepagaSlug: 'osde', planSlug: '310', razon: 'Amplia red obstétrica con cobertura completa del embarazo' },
    ],
    faq: [
      {
        q: '¿Las prepagas tienen período de carencia para el parto?',
        a: 'Sí. Si te afiliás estando embarazada, la mayoría de las prepagas aplica un período de carencia de 9 a 10 meses para la cobertura del parto y cesárea. Sin embargo, la atención prenatal (controles, ecografías) suele tener carencias menores o estar cubierta desde el inicio. Si ya sos afiliada y quedás embarazada, no aplica ninguna carencia.',
      },
      {
        q: '¿Qué cubre el PMO en el embarazo?',
        a: 'El Plan Médico Obligatorio (PMO) establece que todas las prepagas deben cubrir: atención prenatal completa, parto vaginal o cesárea, internación para la madre y el recién nacido, neonatología básica, y los primeros controles del bebé. La cobertura de internación en neonatología de alta complejidad también está incluida.',
      },
      {
        q: '¿Conviene afiliarse antes de quedar embarazada?',
        a: 'Totalmente. Si te afiliás antes del embarazo, evitás los períodos de carencia y tenés cobertura completa del parto. También podés elegir con calma qué prepaga y plan se adapta mejor a tus necesidades sin la presión del tiempo.',
      },
    ],
    keywords: ['prepaga para embarazadas', 'prepaga maternidad argentina', 'prepaga cubre parto', 'mejor prepaga embarazo'],
  },
  {
    slug: 'monotributistas',
    nombre: 'Monotributistas',
    emoji: '💼',
    titulo: 'Prepagas para monotributistas: opciones y precios 2026',
    metaDescripcion: 'Las mejores prepagas para monotributistas en Argentina 2026. Podés deducir el gasto, contratar sin empleador y elegir entre todas las opciones del mercado. Precios actualizados.',
    descripcion: 'Como monotributista podés contratar cualquier prepaga del mercado de forma directa, sin necesidad de obra social. Y lo mejor: podés deducir el gasto de tu declaración de ingresos.',
    necesidades: [
      'Contratación directa sin empleador',
      'Deducción del gasto como gasto de negocio',
      'Planes con buena relación precio-calidad',
      'Factura para declarar el gasto',
      'Flexibilidad para cambiar si cambia tu situación',
    ],
    prepagasRecomendadas: [
      { slug: 'premedic', razon: 'La más económica del mercado. Ideal si querés cobertura básica a bajo costo y trabajás en CABA/GBA.' },
      { slug: 'sancor-salud', razon: 'Excelente balance precio-cobertura. El Plan 3000 cubre todo lo necesario para un monotributista.' },
      { slug: 'medife', razon: 'Buena opción en AMBA con planes accesibles y cobertura completa.' },
      { slug: 'swiss-medical', razon: 'Si tu monotributo te da mayor flexibilidad económica, Swiss Medical ofrece la mejor experiencia de atención.' },
    ],
    planesRecomendados: [
      { prepagaSlug: 'premedic', planSlug: 'plan-200', razon: 'El plan más económico del mercado con cobertura PMO completa' },
      { prepagaSlug: 'sancor-salud', planSlug: 'plan-3000', razon: 'Mejor precio-calidad para monotributistas' },
      { prepagaSlug: 'medife', planSlug: 'individual', razon: 'Buena cobertura en AMBA a precio competitivo' },
    ],
    faq: [
      {
        q: '¿Los monotributistas pueden tener prepaga sin obra social?',
        a: 'Sí, los monotributistas pueden contratar cualquier prepaga directamente. No necesitás obra social ni empleador. La prepaga te factura directamente y podés pagar con tarjeta de crédito, débito o transferencia.',
      },
      {
        q: '¿Puedo deducir la prepaga siendo monotributista?',
        a: 'Depende de tu situación. Los monotributistas puros (que solo tienen ingresos del monotributo) no presentan declaración de ganancias, así que no deducen en ese impuesto. Sin embargo, si tenés ingresos en relación de dependencia además del monotributo, sí podés deducir la prepaga en tu liquidación anual hasta el límite establecido por AFIP.',
      },
      {
        q: '¿Cuánto cuesta una prepaga para un monotributista en 2026?',
        a: 'Los precios van desde $107.044/mes (Premedic Plan 200) hasta más de $400.000/mes (OSDE Plan 510). Para un monotributista, la recomendación es el rango $130.000-$200.000, donde encontrás buena cobertura con Sancor, Medife o Premedic Plan 300.',
      },
    ],
    keywords: ['prepagas para monotributistas', 'prepaga monotributista argentina', 'contratar prepaga sin obra social', 'mejor prepaga monotributo 2026'],
  },
  {
    slug: 'adultos-mayores',
    nombre: 'Adultos mayores',
    emoji: '👴',
    titulo: 'Mejor prepaga para adultos mayores en Argentina 2026',
    metaDescripcion: 'Encontrá la mejor prepaga para mayores de 60 años en Argentina. Coberturas geriátricas, precios por edad y qué tener en cuenta. Comparativa actualizada junio 2026.',
    descripcion: 'Las personas mayores de 60 años tienen necesidades específicas: mayor acceso a especialistas, cobertura geriátrica, medicamentos, y a menudo enfrentan precios más altos por edad. Te ayudamos a elegir bien.',
    necesidades: [
      'Amplia red de especialistas (cardiología, traumatología, neurología)',
      'Cobertura de medicamentos con descuento',
      'Atención domiciliaria',
      'Internación geriátrica de calidad',
      'Sin límites de internación por año',
      'Rehabilitación y kinesiología',
    ],
    prepagasRecomendadas: [
      { slug: 'osde', razon: 'La red más amplia del país garantiza acceso a cualquier especialista. Ideal para adultos mayores que necesitan múltiples especialidades.' },
      { slug: 'swiss-medical', razon: 'Excelente atención en sus propias clínicas con especialistas de primer nivel. Alta satisfacción entre adultos mayores.' },
      { slug: 'cemic', razon: 'Sus clínicas universitarias son referencia en especialidades para adultos mayores. Geriatría y neurología de excelencia.' },
    ],
    planesRecomendados: [
      { prepagaSlug: 'osde', planSlug: '410', razon: 'Sin copago para múltiples visitas a especialistas por mes' },
      { prepagaSlug: 'swiss-medical', planSlug: 'smg30', razon: 'Red abierta con excelente cobertura de especialistas' },
    ],
    faq: [
      {
        q: '¿Cuánto cuesta una prepaga para mayores de 65 años?',
        a: 'Los precios aumentan significativamente con la edad. A los 65 años, un plan que cuesta $200.000 a los 30 puede llegar a $400.000-$600.000. A los 70+, los precios pueden superar el millón de pesos mensuales en planes premium.',
      },
      {
        q: '¿Las prepagas pueden negarse a afiliar a adultos mayores?',
        a: 'No pueden negarse por razones de salud o edad, pero sí pueden cobrar más según la edad. La ley establece que el precio puede aumentar por edad pero no pueden rechazar la afiliación ni imponer períodos de carencia por preexistencias.',
      },
      {
        q: '¿Qué prepaga tiene mejor cobertura geriátrica?',
        a: 'OSDE y Swiss Medical destacan por su cobertura geriátrica integral. CEMIC tiene un centro geriátrico universitario de referencia. Para adultos mayores en CABA, estas tres son las mejores opciones.',
      },
    ],
    keywords: ['prepaga para mayores de 60', 'prepaga adultos mayores argentina', 'mejor prepaga jubilados', 'prepaga geriatrica argentina'],
  },
  {
    slug: 'jovenes',
    nombre: 'Jóvenes',
    emoji: '🧑',
    titulo: 'Prepaga económica para jóvenes: planes desde $107.000 en 2026',
    metaDescripcion: 'Las mejores prepagas económicas para jóvenes en Argentina. Planes desde $107.000/mes con buena cobertura. Compará Swiss Medical S1, Premedic 200, Medife y más.',
    descripcion: 'Si sos joven y sano, probablemente no necesitás el plan más completo del mercado. Te mostramos las opciones más económicas con cobertura real para el día a día.',
    necesidades: [
      'Precio accesible (budget-friendly)',
      'Urgencias y emergencias cubiertas',
      'Salud mental (psicólogo, psiquiatría)',
      'Sin copago excesivo en consultas de uso frecuente',
      'App móvil para gestionar turnos',
      'Cobertura odontológica básica',
    ],
    prepagasRecomendadas: [
      { slug: 'premedic', razon: 'La más económica del mercado. El Plan 200 desde $107.044 cubre todo lo esencial para un joven sano en CABA/GBA.' },
      { slug: 'swiss-medical', razon: 'El plan S1 está diseñado especialmente para jóvenes. Precio accesible con el respaldo de la mejor red de sanatorios.' },
      { slug: 'medife', razon: 'Plan Económico accesible con buena cobertura para jóvenes en AMBA.' },
      { slug: 'sancor-salud', razon: 'El Plan 1500 ofrece buena cobertura a precio competitivo.' },
    ],
    planesRecomendados: [
      { prepagaSlug: 'premedic', planSlug: 'plan-200', razon: 'El plan más económico del mercado — ideal para jóvenes sanos' },
      { prepagaSlug: 'swiss-medical', planSlug: 's1', razon: 'Plan diseñado para jóvenes con red de sanatorios propios' },
      { prepagaSlug: 'sancor-salud', planSlug: 'plan-1500', razon: 'Buena cobertura a precio accesible con red nacional' },
    ],
    faq: [
      {
        q: '¿Vale la pena tener prepaga siendo joven?',
        a: 'Sí, especialmente si no tenés obra social (por ser monotributista, estudiante o trabajar informal). Los accidentes, urgencias y la salud mental son las principales razones por las que los jóvenes usan la prepaga. Un plan básico desde $107.000 te da cobertura en esas situaciones.',
      },
      {
        q: '¿Cuál es la prepaga más barata para jóvenes?',
        a: 'Premedic Plan 200 ($107.044/mes a los 30 años) es consistentemente la más barata. Swiss Medical S1 ($185.773/mes) es la más barata entre las prepagas grandes con sanatorios propios. Ambas cubren el PMO completo.',
      },
    ],
    keywords: ['prepaga economica jovenes', 'prepaga barata argentina 2026', 'prepaga para estudiantes', 'prepaga mas barata argentina'],
  },
  {
    slug: 'empresas',
    nombre: 'Empresas y PyMEs',
    emoji: '🏢',
    titulo: 'Prepagas para empresas y PyMEs en Argentina 2026',
    metaDescripcion: 'Compará prepagas corporativas para empresas y PyMEs en Argentina. Swiss Medical, OSDE y Sancor ofrecen planes grupales con precios especiales. Descubrí cuál conviene más.',
    descripcion: 'Ofrecer una prepaga a tus empleados es uno de los beneficios más valorados en Argentina. Las prepagas corporativas tienen precios especiales y condiciones diferentes a los planes individuales.',
    necesidades: [
      'Precios corporativos (más bajos que individuales)',
      'Gestión centralizada de afiliados',
      'Incorporación y baja rápida de empleados',
      'Un solo punto de contacto para RRHH',
      'Facturación unificada',
      'Planes diferenciados por jerarquía',
    ],
    prepagasRecomendadas: [
      { slug: 'swiss-medical', razon: 'Líder en planes corporativos. Excelente servicio de RRHH, plataforma digital para gestión y reconocimiento de marca que retiene talento.' },
      { slug: 'osde', razon: 'La opción más solicitada por empleados. Su marca y red son las más reconocidas, facilitando la atracción de talento.' },
      { slug: 'sancor-salud', razon: 'Muy competitiva en precio para PyMEs. Buena relación precio-calidad para equipos de hasta 50 personas.' },
    ],
    planesRecomendados: [
      { prepagaSlug: 'swiss-medical', planSlug: 'smg20', razon: 'El plan corporativo más elegido por empresas tech y servicios' },
      { prepagaSlug: 'osde', planSlug: '310', razon: 'Estándar corporativo para empresas que priorizan la marca' },
    ],
    faq: [
      {
        q: '¿Cuántos empleados necesito para acceder a precios corporativos?',
        a: 'Generalmente desde 5-10 empleados ya podés negociar precios corporativos con la mayoría de las prepagas. Swiss Medical y OSDE tienen equipos dedicados a empresas desde 5 empleados. Sancor Salud ofrece condiciones grupales desde 3 personas.',
      },
      {
        q: '¿La empresa paga la prepaga completa o solo un porcentaje?',
        a: 'Depende de lo que negocia la empresa. Lo más común es que la empresa pague el 100% del empleado y este contribuya con un porcentaje para agregar a su familia. Algunas empresas pagan solo el 50-80% del plan base.',
      },
    ],
    keywords: ['prepaga para empresas argentina', 'prepaga corporativa pymes', 'swiss medical empresas', 'osde corporativo argentina'],
  },
  {
    slug: 'extranjeros',
    nombre: 'Extranjeros',
    emoji: '🌎',
    titulo: 'Prepaga para extranjeros en Argentina',
    metaDescripcion: 'Guía de cobertura médica para extranjeros en Argentina: el seguro obligatorio del Decreto 366/25, qué prepagas te afilian sin DNI argentino y cuánto cuesta en 2026.',
    descripcion: 'Desde julio de 2025, todo extranjero no residente necesita seguro médico para entrar a Argentina (Decreto 366/25). Y si venís a quedarte —por trabajo, estudio o residencia—, una prepaga local suele ser más conveniente que una asistencia al viajero: cobertura completa, cartilla real y sin límites de reintegro por evento. Te contamos qué opciones tenés según tu situación migratoria.',
    necesidades: [
      'Cumplir el requisito migratorio de cobertura médica (Decreto 366/25)',
      'Afiliación sin DNI argentino (con pasaporte o residencia precaria, según la empresa)',
      'Cobertura desde el primer día para urgencias e internación',
      'Atención en inglés o portugués (según la prepaga y la zona)',
      'Facturación sin CUIL/CUIT o con formas de pago internacionales',
      'Red fuerte en la ciudad donde vas a vivir',
    ],
    prepagasRecomendadas: [
      { slug: 'swiss-medical', razon: 'La más elegida por expatriados y personal de empresas internacionales: sanatorios propios de primer nivel en Buenos Aires y gestión digital completa.' },
      { slug: 'osde', razon: 'La red más grande del país y el plan con mejor cobertura de urgencias para quien todavía no conoce el sistema de salud argentino.' },
      { slug: 'medife', razon: 'Buena relación precio-calidad para estadías largas, con planes que no exigen relación de dependencia local.' },
      { slug: 'sancor-salud', razon: 'Alternativa accesible con red nacional, útil si tu destino no es Buenos Aires.' },
    ],
    planesRecomendados: [
      { prepagaSlug: 'swiss-medical', planSlug: 'smg20', razon: 'El estándar de los expatriados en CABA: sin copagos y sanatorios propios' },
      { prepagaSlug: 'osde', planSlug: '310', razon: 'Red amplia en todo el país, ideal si vas a moverte entre provincias' },
      { prepagaSlug: 'medife', planSlug: 'bronce', razon: 'Entrada económica con cobertura completa para estadías largas' },
    ],
    faq: [
      {
        q: '¿Es obligatorio tener seguro médico para entrar a Argentina?',
        a: 'Sí. Desde el Decreto 366/25 (vigente desde julio de 2025), todos los extranjeros no residentes deben contar con un seguro médico que cubra su estadía —turistas, estudiantes y trabajadores incluidos. Los residentes permanentes y ciudadanos naturalizados están exentos. Para el ingreso alcanza una asistencia al viajero; para radicarte, una prepaga local es la opción más completa.',
      },
      {
        q: '¿Puedo contratar una prepaga sin DNI argentino?',
        a: 'Depende de la empresa. La mayoría de las prepagas grandes aceptan afiliación con pasaporte y residencia precaria (el trámite migratorio iniciado), y algunas piden CDI o CUIL provisorio para facturar. Lo más práctico es cotizar y consultar tu caso puntual: un asesor te confirma qué empresa acepta tu documentación actual.',
      },
      {
        q: '¿Cuánto cuesta una prepaga para un extranjero?',
        a: 'Pagás lo mismo que un argentino: el precio depende de la edad y el plan, no de la nacionalidad. En 2026 los planes van desde ~$170.000/mes (planes de entrada) hasta más de $1.000.000/mes (premium) para un adulto de 30 años. Cotizá gratis para ver el valor exacto de tu edad.',
      },
      {
        q: '¿La prepaga sirve como seguro para el trámite de residencia?',
        a: 'Una prepaga local cubre de sobra los requisitos de cobertura médica que exige Migraciones para residencias temporarias. Pedile a la empresa el certificado de cobertura para presentarlo en tu trámite.',
      },
    ],
    keywords: ['prepaga para extranjeros argentina', 'seguro medico obligatorio argentina', 'prepaga sin dni', 'health insurance argentina', 'cobertura medica extranjeros residencia'],
  },
]

export function getPerfilBySlug(slug: string): PerfilData | undefined {
  return perfiles.find((p) => p.slug === slug)
}
