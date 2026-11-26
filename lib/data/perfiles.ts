import type { Prepaga } from '@/types'
import { PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { formatPrecio } from '@/lib/utils'
import { extremosA30 } from '@/lib/precios/resumen'

// Extremos del mercado a los 30 años, del cuadro oficial (28-oct-2026)
const A30 = extremosA30()

export interface PerfilData {
  slug: string
  nombre: string
  emoji: string
  titulo: string
  /** Título para Google cuando el H1 pasa de 60 caracteres (ya lleva el año) */
  tituloSeo?: string
  metaDescripcion: string
  descripcion: string
  necesidades: string[]
  prepagasRecomendadas: { slug: string; razon: string }[]
  planesRecomendados: { prepagaSlug: string; planSlug: string; razon: string }[]
  faq: { q: string; a: string }[]
  keywords: string[]
  /** Secciones propias del perfil (26-nov-2026, estudiantes extranjeros): texto, tabla en HTML y fuentes */
  secciones?: SeccionPerfil[]
  /** Páginas hermanas que se enlazan arriba del FAQ, con el texto que se busca */
  relacionados?: { href: string; titulo: string; texto: string }[]
}

export interface SeccionPerfil {
  titulo: string
  parrafos: string[]
  tabla?: { columnas: string[]; filas: string[][] }
  fuentes?: { texto: string; url: string }[]
}

export const perfiles: PerfilData[] = [
  {
    slug: 'familias',
    nombre: 'Familias',
    emoji: '👨‍👩‍👧‍👦',
    titulo: 'Mejor prepaga para familias',
    metaDescripcion: 'Encontrá la mejor prepaga para tu familia en Argentina. Comparamos precios oficiales, cobertura pediátrica y maternidad de Swiss Medical, OSDE, Sancor y más. Cotizá gratis para tu grupo familiar.',
    descripcion: 'Elegir una prepaga para toda la familia requiere equilibrar cobertura pediátrica, maternidad, precio total y amplitud de red. Te ayudamos a encontrar la opción que mejor se adapta a tu grupo familiar.',
    necesidades: [
      'Pediatría con turnos rápidos',
      'Maternidad completa (parto, cesárea, neonatología)',
      'Una cuota total que puedas sostener: cada integrante paga según su edad',
      'Cobertura odontológica para niños',
      'Red amplia en tu zona',
      'Salud mental para adultos y niños',
    ],
    prepagasRecomendadas: [
      { slug: 'swiss-medical', razon: 'Tiene maternidad propia, la Clínica y Maternidad Suizo Argentina, que está en la cartilla de todos sus planes salvo el S1 y el SMG02. App para gestionar los turnos de toda la familia.' },
      { slug: 'osde', razon: 'En su lista oficial, los chicos y jóvenes de hasta 27 años pagan bastante menos que un adulto, algo que pesa en una familia con hijos.' },
      { slug: 'sancor-salud', razon: 'Los planes F700 y F800, con copago, son sus cuotas más bajas según su lista oficial; el Plan 3000 no tiene copago.' },
      { slug: 'medife', razon: 'En su lista oficial, el Plan Bronce cuesta lo mismo desde el nacimiento hasta los 35 años, así que la cuota de la familia es fácil de prever.' },
    ],
    planesRecomendados: [
      { prepagaSlug: 'swiss-medical', planSlug: 'smg20', razon: 'Cartilla Global, con la Maternidad Suizo Argentina y el Hospital Italiano en CABA, sin copago' },
      { prepagaSlug: 'sancor-salud', planSlug: 'plan-3000', razon: 'Sin copago en consultas, para una familia que va seguido al pediatra' },
      { prepagaSlug: 'osde', planSlug: '310', razon: 'Los chicos de hasta 27 años pagan menos que un adulto según su lista oficial' },
    ],
    faq: [
      // La pregunta "¿Cuánto sale una prepaga para una familia de 4?" se arma en la página con los precios oficiales
      {
        q: '¿Las prepagas dan descuento por grupo familiar?',
        a: 'En las listas oficiales que declaran ante la Superintendencia de Servicios de Salud no hay un descuento por grupo: cada integrante paga según su franja de edad, y en algunas prepagas los chicos pagan menos que un adulto. Lo que sí baja la cuota: contratar online (15% OFF cotizando acá) y, si los dos trabajan en relación de dependencia, unificar los aportes de ambos en la misma prepaga. Si hay alguna bonificación comercial vigente por grupo, el asesor te la confirma al cotizar.',
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
    metaDescripcion: 'Guía completa: las mejores prepagas para embarazadas en Argentina. Cobertura del parto, período de carencia, maternidad y atención prenatal. Cotizá gratis.',
    descripcion: 'Si estás embarazada o planificando un embarazo, la elección de prepaga es una decisión urgente. Te explicamos qué buscar, qué períodos de carencia existen y cuáles son las mejores opciones.',
    necesidades: [
      'Cobertura del parto sin cargo de carencia (afiliándote con más de 2 meses de margen antes de la FUM)',
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
        q: '¿Puedo contratar una prepaga estando embarazada?',
        a: 'Sí. La Ley 26.682 dice que las preexistencias no pueden ser motivo de rechazo, y hay fallos que dicen que el embarazo no es una enfermedad preexistente. Tenés que declararlo en la declaración jurada. En la guía "¿Puedo contratar una prepaga estando embarazada?" está el detalle.',
      },
      {
        q: '¿Las prepagas tienen período de carencia para el parto?',
        a: 'La carencia estándar es de 2 meses desde la fecha de afiliación: para que el embarazo quede cubierto sin ningún cargo extra, la FUM (fecha de última menstruación) tiene que ser posterior a esos 2 meses. Si resulta que ya estabas embarazada sin saberlo al afiliarte (por ejemplo, de 1 mes), no se te niega la cobertura, pero tenés que abonar una carencia equivalente a 3 cuotas del plan. Lo que no se puede hacer es afiliarse declarando el embarazo ya confirmado — en ese caso, es poco probable que la afiliación se acepte.',
      },
      {
        q: '¿Qué cubre el PMO en el embarazo?',
        a: 'El Plan Médico Obligatorio (PMO) establece que todas las prepagas deben cubrir: atención prenatal completa, parto vaginal o cesárea, internación para la madre y el recién nacido, neonatología básica, y los primeros controles del bebé. La cobertura de internación en neonatología de alta complejidad también está incluida.',
      },
      {
        q: '¿Conviene afiliarse antes de quedar embarazada?',
        a: 'Sí. Afiliándote con margen (más de 2 meses antes de la FUM) te asegurás la cobertura completa sin ningún cargo de carencia, y podés elegir con calma qué prepaga y plan se adapta mejor a tus necesidades sin la presión del tiempo.',
      },
    ],
    keywords: ['prepaga para embarazadas', 'prepaga maternidad argentina', 'prepaga cubre parto', 'mejor prepaga embarazo'],
  },
  {
    slug: 'monotributistas',
    nombre: 'Monotributistas',
    emoji: '💼',
    // Search Console (hasta el 24-sep-2026): "prepaga monotributista" y
    // variantes, unas 124 impresiones en el puesto 10-12. El aporte por
    // categoría y la lista de obras sociales salen de ARCA y la SSSalud
    // (lib/data/monotributo.ts) y se arman en la página.
    titulo: 'Prepagas para monotributistas: cómo usar el aporte y cuánto pagás',
    metaDescripcion: 'Cómo usar el aporte de obra social del monotributo en una prepaga, cuánto aporta cada categoría según ARCA y los planes más económicos según la lista oficial. 25% OFF cotizando online.',
    descripcion: 'Tu cuota del monotributo ya incluye un aporte a la obra social. Podés derivarlo a una prepaga que lo tome y pagar solo la diferencia, o contratar cualquier prepaga en forma directa, sin depender de un empleador. Acá tenés cuánto aporta tu categoría y qué planes conviene mirar.',
    necesidades: [
      'Usar el aporte de obra social del monotributo para pagar menos',
      'Contratación directa, sin empleador',
      'Una cuota que no se coma tu facturación: los planes con copago son los más baratos',
      'Sumar a tu familia: cada adherente aporta lo mismo que el titular',
      'Factura de la prepaga para tus comprobantes',
      'Poder cambiar de plan si cambia tu categoría',
    ],
    prepagasRecomendadas: [
      { slug: 'swiss-medical', razon: 'Sus cuotas más bajas son las de los planes con copago, según su lista oficial. El S2 usa la cartilla Global, que en CABA incluye sus sanatorios propios (Suizo Argentina, Los Arcos, Agote, Zabala) y el Hospital Italiano; el S1, la Nubial Quality, con el Hospital Británico, el Güemes y el Trinidad.' },
      { slug: 'premedic', razon: 'Tiene la cuota más baja del mercado según las listas oficiales: el Plan C-100, con copago. Su red está concentrada en CABA y GBA.' },
      { slug: 'sancor-salud', razon: 'Los planes F700 y F800, con copago, son sus cuotas más bajas según su lista oficial.' },
      { slug: 'medife', razon: 'Medifé+, con copago, es su cuota más baja según su lista oficial.' },
    ],
    planesRecomendados: [
      { prepagaSlug: 'swiss-medical', planSlug: 's1', razon: 'La cuota más baja de Swiss Medical, con copago. Cartilla Nubial Quality: en CABA, Hospital Británico, Güemes y Trinidad' },
      { prepagaSlug: 'premedic', planSlug: 'plan-c100', razon: 'La cuota más baja del mercado según las listas oficiales, con copago' },
      { prepagaSlug: 'sancor-salud', planSlug: 'f700', razon: 'La cuota más baja de Sancor Salud según su lista oficial, con copago' },
    ],
    faq: [
      // La pregunta "¿Cuánto aporta mi categoría…?" se arma en la página con el cuadro de ARCA
      {
        q: '¿Los monotributistas pueden tener prepaga sin obra social?',
        a: 'Podés contratar cualquier prepaga en forma directa, sin empleador, pero el aporte de obra social del monotributo lo seguís pagando igual: está dentro de tu cuota mensual (salvo excepciones, como quienes aportan a otro régimen). Por eso conviene una prepaga que tome ese aporte: pagás solo la diferencia. En la página de obras sociales para monotributistas tenés la lista oficial y cuánto se paga por categoría.',
      },
      {
        q: '¿Puedo deducir la prepaga siendo monotributista?',
        a: 'Depende de tu situación. Si solo tenés ingresos del monotributo, no presentás declaración de Ganancias, así que no la deducís en ese impuesto. Si además tenés un sueldo en relación de dependencia, sí podés deducir la cuota de la prepaga en Ganancias con el tope que fija ARCA.',
      },
      {
        q: '¿Cuánto cuesta una prepaga para un monotributista en 2026?',
        a: 'Lo mismo que para cualquier persona: el precio depende de la edad y del plan, no de cómo facturás. Lo que cambia es que podés descontar el aporte de obra social que ya pagás en el monotributo si la prepaga lo toma. En la tabla de planes recomendados tenés el precio de lista oficial a los 30 años; cotizando online como monotributista tenés 25% OFF.',
      },
      {
        q: '¿Es lo mismo para un freelancer o trabajador remoto que no vive en CABA?',
        a: 'Sí: si facturás por monotributo, contratás la prepaga en forma directa sin depender de un empleador. Lo que cambia según dónde vivís es la cartilla y el precio, porque cada prepaga declara una lista distinta por región. Antes de elegir, revisá en la cartilla de tu zona qué sanatorios y guardias tenés cerca.',
      },
    ],
    keywords: ['prepagas para monotributistas', 'prepaga monotributista argentina', 'contratar prepaga sin obra social', 'mejor prepaga monotributo 2026', 'prepaga freelancers autonomos', 'prepaga trabajadores remotos argentina'],
  },
  {
    slug: 'adultos-mayores',
    nombre: 'Jubilados y mayores de 60',
    emoji: '👴',
    // Search Console (3-oct-2026): "prepaga para mayores de 60". La página
    // muestra los precios oficiales por edad (components/perfiles/PreciosMayores.tsx).
    // 27-oct-2026 (Darío): el ingreso es hasta los 66 años inclusive; no
    // se muestra nada de 66 en adelante.
    // 20-oct-2026: suma "jubilados" (Google Ads: "prepagas para jubilados"
    // 260/mes, +23 %). Es la misma intención: una sola URL, sin página aparte.
    titulo: 'Prepagas para jubilados y mayores de 60: precios por edad y cuál conviene',
    tituloSeo: 'Prepagas para jubilados y mayores de 60: precios 2026',
    metaDescripcion: '¿Cuánto cuesta una prepaga para jubilados y mayores de 60? Precios oficiales a los 55, 60 y 65 años, hasta qué edad podés entrar, PAMI y prepaga juntos, y cuál conviene.',
    descripcion: 'Después de los 60 la cuota pesa más y cada prepaga sube distinto con la edad: algunas dejan de aumentar mucho antes que otras. Acá tenés los precios oficiales por edad de cada una hasta los 65, la edad máxima para entrar, y lo que dice la ley para que elijas bien.',
    necesidades: [
      'Red de especialistas cerca de tu casa (cardiología, traumatología, neurología)',
      'Cobertura de medicamentos de uso crónico',
      'Atención domiciliaria y urgencias',
      'Internación en sanatorios que conozcas',
      'Rehabilitación y kinesiología',
      'Una cuota que puedas sostener con los años',
    ],
    prepagasRecomendadas: [
      { slug: 'swiss-medical', razon: 'Sanatorios propios en CABA y GBA. Los planes SMG30 a SMG70 usan la cartilla Premium, que en CABA suma el Hospital Alemán y Fleni. Según su cuadro oficial, el precio deja de subir por edad a los 61.' },
      { slug: 'osde', razon: 'Según su cuadro oficial, el precio deja de subir por edad a partir de los 36 años: a los 65 pagás lo mismo que a los 40.' },
      { slug: 'cemic', razon: 'Tiene hospital universitario propio en CABA.' },
    ],
    planesRecomendados: [
      { prepagaSlug: 'swiss-medical', planSlug: 'smg30', razon: 'Cartilla Premium (Hospital Alemán y Fleni en CABA) y sin copago en consultas' },
      { prepagaSlug: 'osde', planSlug: '410', razon: 'Sin copago en consultas y con el mismo precio desde los 36 años' },
    ],
    faq: [
      // La pregunta "¿Cuánto cuesta…?" se arma con los precios oficiales en la página
      {
        q: '¿Qué prepaga acepta jubilados?',
        a: 'Todas, si tenés 66 años o menos: las prepagas aceptan ingresos nuevos hasta los 66. Lo que cambia es el precio por edad: más abajo están los precios oficiales a los 55, 60 y 65 de cada una.',
      },
      {
        q: '¿Hasta qué edad me puedo afiliar a una prepaga?',
        a: 'Hasta los 66 años inclusive: para afiliarte por primera vez tenés que tener 66 o menos. El precio depende de los rangos de edad que cada prepaga declara ante la Superintendencia de Servicios de Salud. Por una preexistencia pueden cobrarte una cuota diferencial autorizada por la Superintendencia, pero no rechazarte.',
      },
      {
        q: '¿Me pueden aumentar la cuota por cumplir 65?',
        a: 'Si tenés 10 años o más de antigüedad en la misma prepaga, no: la Ley 26.682 no permite aumentos por edad a mayores de 65 con esa antigüedad. Si te cambiás de prepaga, en la nueva empezás de cero con la antigüedad, así que conviene hacer la cuenta antes.',
      },
      {
        q: '¿Qué prepaga conviene después de los 60?',
        a: 'Depende de dónde te atendés y de cuánto querés pagar. Mirá dos cosas en la tabla de precios: cuánto sale hoy cada plan y a qué edad deja de subir (OSDE, por ejemplo, cobra lo mismo desde los 36 según su cuadro oficial). Después confirmá que estén tus sanatorios en la cartilla del plan. Te lo cotizamos gratis, con 15% OFF en Swiss Medical.',
      },
      {
        q: '¿Puedo tener PAMI y una prepaga al mismo tiempo?',
        a: 'Sí. Muchos jubilados mantienen PAMI y suman una prepaga para tener turnos más rápidos con especialistas e internación en sanatorios privados. Si querés cambiar de PAMI a otra obra social, los jubilados hacen la opción en ANSES. Te asesoramos sin cargo para ver qué te conviene según tu haber.',
      },
    ],
    keywords: ['prepagas para jubilados', 'prepagas que aceptan jubilados', 'prepaga para mayores de 60', 'prepaga adultos mayores argentina', 'mejor prepaga jubilados', 'prepaga geriatrica argentina', 'prepaga complementaria pami', 'prepaga o pami jubilados'],
  },
  {
    slug: 'jovenes',
    nombre: 'Jóvenes',
    emoji: '🧑',
    titulo: 'Mejor prepaga para jóvenes: opciones económicas',
    metaDescripcion: 'Las prepagas más económicas para jóvenes en Argentina según las listas oficiales: Swiss Medical S1, Premedic C-100, Medifé+ y más. Qué mirar además del precio. Cotizá gratis.',
    descripcion: 'Si sos joven y sano, probablemente no necesitás el plan más completo del mercado. Te mostramos las opciones más económicas con cobertura real para el día a día.',
    necesidades: [
      'Una cuota baja: los planes con copago son los más baratos',
      'Urgencias y emergencias cubiertas',
      'Salud mental (psicólogo, psiquiatría)',
      'Sin copago excesivo en consultas de uso frecuente',
      'App móvil para gestionar turnos',
      'Cobertura odontológica básica',
    ],
    prepagasRecomendadas: [
      { slug: 'swiss-medical', razon: 'El S1, con copago, es su cuota más baja según su lista oficial. Usa la cartilla Nubial Quality, que en CABA incluye el Hospital Británico, el Güemes y el Trinidad.' },
      { slug: 'premedic', razon: 'Tiene la cuota más baja del mercado según las listas oficiales: el Plan C-100, con copago. Su red está concentrada en CABA y GBA.' },
      { slug: 'medife', razon: 'Medifé+, con copago, es su cuota más baja según su lista oficial.' },
      { slug: 'sancor-salud', razon: 'Los planes F700 y F800, con copago, son sus cuotas más bajas según su lista oficial.' },
    ],
    planesRecomendados: [
      { prepagaSlug: 'swiss-medical', planSlug: 's1', razon: 'La cuota más baja de Swiss Medical, con copago. Cartilla Nubial Quality: en CABA, Hospital Británico, Güemes y Trinidad' },
      { prepagaSlug: 'premedic', planSlug: 'plan-c100', razon: 'La cuota más baja del mercado según las listas oficiales, con copago' },
      { prepagaSlug: 'medife', planSlug: 'medife-plus', razon: 'La cuota más baja de Medifé según su lista oficial, con copago' },
    ],
    faq: [
      {
        q: '¿Vale la pena tener prepaga siendo joven?',
        a: 'Sí, especialmente si no tenés obra social (por ser monotributista, estudiante o trabajar informal). Los accidentes, urgencias y la salud mental son las principales razones por las que los jóvenes usan la prepaga. Un plan de nivel de precio económico ya te da cobertura en esas situaciones.',
      },
      {
        q: '¿Cuál es la prepaga más barata para jóvenes?',
        a: 'Según las listas oficiales que cada prepaga declara ante la Superintendencia de Servicios de Salud, la cuota más baja es la del Plan C-100 de Premedic, con copago. Entre las prepagas grandes, el S1 de Swiss Medical es su plan más económico. Todos los planes cubren como mínimo el Programa Médico Obligatorio. Cotizá gratis para ver el monto exacto a tu edad, con 15% OFF online.',
      },
    ],
    keywords: ['prepaga economica jovenes', 'prepaga barata argentina 2026', 'prepaga para estudiantes', 'prepaga mas barata argentina'],
  },
  {
    slug: 'extranjeros',
    nombre: 'Extranjeros',
    emoji: '🌎',
    titulo: 'Prepaga para extranjeros en Argentina',
    // 26-nov-2026 (Darío): Swiss Medical afilia con pasaporte o residencia
    // precaria, damos el certificado de cobertura para el DNI y asesoramos en
    // inglés y portugués. El decreto, con su fuente (Boletín Oficial).
    metaDescripcion: 'Cobertura médica para extranjeros en Argentina: qué pide el DNU 366/2025, afiliación con pasaporte o residencia precaria y certificado de cobertura para tu DNI. Te asesoramos en inglés y portugués.',
    descripcion: 'El DNU 366/2025 pide seguro de salud a los extranjeros que entran al país sin residencia permanente, y los hospitales públicos les cobran la atención programada (las emergencias se atienden siempre). Si venís a quedarte —por trabajo, estudio o residencia—, una prepaga local es más conveniente que una asistencia al viajero: cobertura completa y cartilla real, todos los meses. Swiss Medical te afilia con tu pasaporte o con la residencia precaria, y con la afiliación te damos el certificado de cobertura para tu trámite de DNI. Te asesoramos en español, inglés y portugués.',
    necesidades: [
      'Cumplir el requisito de cobertura médica del DNU 366/2025',
      'Afiliarte con pasaporte o residencia precaria (Swiss Medical acepta los dos)',
      'El certificado de cobertura para tu trámite de residencia y DNI',
      'Cobertura desde el primer mes para guardias e internación',
      'Asesoramiento en inglés o portugués',
      'Facturación sin CUIL/CUIT o con formas de pago internacionales',
      'Red fuerte en la ciudad donde vas a vivir',
    ],
    prepagasRecomendadas: [
      { slug: 'swiss-medical', razon: 'La más elegida por expatriados y personal de empresas internacionales: sanatorios propios de primer nivel en Buenos Aires y gestión digital completa.' },
      { slug: 'osde', razon: 'La red más grande del país y el plan con mejor cobertura de urgencias para quien todavía no conoce el sistema de salud argentino.' },
      { slug: 'medife', razon: 'Buena relación precio-calidad para estadías largas, con planes que no exigen relación de dependencia local.' },
      { slug: 'sancor-salud', razon: 'Alternativa accesible con red nacional, útil si tu destino no es Buenos Aires.' },
      { slug: 'avalian', razon: 'Telemedicina 24hs incluida en todos los planes — útil mientras todavía no armaste tu red de médicos de confianza — y cobertura declarada en más de 24 provincias, con app propia para turnos y credencial digital.' },
    ],
    planesRecomendados: [
      { prepagaSlug: 'swiss-medical', planSlug: 'smg20', razon: 'El estándar de los expatriados en CABA: sin copagos y sanatorios propios' },
      { prepagaSlug: 'osde', planSlug: '310', razon: 'Red amplia en todo el país, ideal si vas a moverte entre provincias' },
      { prepagaSlug: 'medife', planSlug: 'bronce', razon: 'Entrada económica con cobertura completa para estadías largas' },
      { prepagaSlug: 'avalian', planSlug: 'as300', razon: 'Telemedicina (e-doc) y consultas sin copago desde el primer día' },
    ],
    faq: [
      {
        q: '¿Es obligatorio tener seguro médico para entrar a Argentina?',
        a: 'Sí. El DNU 366/2025, publicado en el Boletín Oficial el 29 de mayo de 2025, reformó la Ley de Migraciones y pide seguro de salud a los extranjeros que ingresan sin residencia permanente —turistas, estudiantes y trabajadores—. Además, los hospitales públicos les cobran la atención programada; las emergencias se atienden siempre. Para un viaje corto alcanza una asistencia al viajero; para radicarte o estudiar, una prepaga local es la opción más completa.',
      },
      {
        q: '¿Puedo contratar una prepaga sin DNI argentino?',
        a: 'Sí. Swiss Medical te afilia con tu pasaporte o con el certificado de residencia precaria que te da Migraciones mientras tramitás la residencia. Para otras prepagas, consultá tu caso: un asesor te confirma qué documentación aceptan.',
      },
      {
        q: '¿Cuánto cuesta una prepaga para un extranjero?',
        a: `Pagás lo mismo que un argentino: el precio depende de la edad y el plan, no de la nacionalidad. Según los cuadros oficiales de ${PRECIO_ACTUALIZADO.toLowerCase()}, para un adulto de 30 años van desde ${formatPrecio(A30.min.precio)} por mes (${A30.min.prepaga}, ${A30.min.plan}) hasta ${formatPrecio(A30.max.precio)} (${A30.max.prepaga}, ${A30.max.plan}). Cotizá gratis para ver el valor exacto de tu edad.`,
      },
      {
        q: '¿Me dan un certificado de cobertura para el trámite de residencia y DNI?',
        a: 'Sí. Con la afiliación te damos el certificado de cobertura para presentarlo en tu trámite de residencia y DNI.',
      },
      {
        q: '¿Me atienden en inglés o portugués?',
        a: 'Sí: el asesoramiento es en español, inglés o portugués, por WhatsApp o por teléfono.',
      },
      {
        q: 'Vengo a estudiar a Argentina, ¿qué cobertura necesito?',
        a: 'Lo mismo que cualquier extranjero sin residencia permanente: un seguro o una prepaga para la atención programada. Tenemos una guía para estudiantes extranjeros, con cuánto sale y cómo funciona la prepaga si venís de Brasil, Uruguay o Colombia.',
      },
    ],
    relacionados: [
      { href: '/para/estudiantes-extranjeros', titulo: '¿Venís a estudiar a Argentina?', texto: 'Seguro médico para estudiantes extranjeros: precio, residencia precaria y certificado para el DNI' },
      { href: '/guias/seguro-medico-obligatorio-extranjeros', titulo: '¿Qué exige el decreto 366?', texto: 'Seguro médico obligatorio para extranjeros: qué pide la ley y quién está exento' },
      { href: '/pt/plano-de-saude-argentina', titulo: 'Lê em português?', texto: 'Plano de saúde na Argentina para brasileiros' },
    ],
    // Lo legal ("seguro médico obligatorio", "decreto 366") es de la guía
    // /guias/seguro-medico-obligatorio-extranjeros: acá solo el link (26-nov-2026)
    keywords: ['prepaga para extranjeros argentina', 'seguro medico para extranjeros en argentina', 'prepaga con residencia precaria', 'prepaga sin dni', 'health insurance argentina', 'cobertura medica extranjeros residencia'],
  },
  {
    // Estudiantes extranjeros (26-nov-2026, Darío: "apuntemos a todos los
    // países que quieren venir a estudiar"). Autocompletado: "estudiar medicina
    // en argentina siendo peruano/colombiano/ecuatoriano", "estudar medicina na
    // argentina", "certificado de residencia precaria". Ver
    // docs/seo/extranjeros-2026-11.md. Nada del 50% de menores de 26 (se
    // comunica después, criterio de Darío).
    slug: 'estudiantes-extranjeros',
    nombre: 'Estudiantes extranjeros',
    emoji: '🎓',
    titulo: 'Prepaga para estudiantes extranjeros en Argentina',
    tituloSeo: 'Seguro médico para estudiantes extranjeros en Argentina 2026',
    metaDescripcion: 'Para estudiar en Argentina sin residencia permanente necesitás cobertura médica. Swiss Medical te afilia con pasaporte o residencia precaria y te damos el certificado para tu DNI. Te asesoramos en portugués e inglés.',
    descripcion: 'Si venís a estudiar a Argentina —medicina u otra carrera—, mientras no tengas residencia permanente la atención programada en los hospitales públicos se paga o la cubre un seguro (DNU 366/2025); las emergencias se atienden siempre. Con una prepaga tenés médicos, estudios, guardias e internación de la cartilla desde el primer mes. Swiss Medical te afilia con tu pasaporte o con el certificado de residencia precaria, y con la afiliación te damos el certificado de cobertura para tu trámite de residencia y DNI. Te asesoramos en español, portugués o inglés.',
    necesidades: [
      'Afiliarte con pasaporte o con el certificado de residencia precaria',
      'El certificado de cobertura para tu trámite de residencia y DNI',
      'Una cuota de estudiante: el precio depende de la edad, no de la nacionalidad',
      'Guardias y médicos cerca de tu facultad',
      'Asesoramiento en tu idioma: español, portugués o inglés',
      'Cobertura todos los meses, sin topes por viaje como una asistencia al viajero',
    ],
    prepagasRecomendadas: [
      { slug: 'swiss-medical', razon: 'Te afilia con pasaporte o con la residencia precaria, y con la afiliación te damos el certificado de cobertura para tu trámite de DNI. Cotizando online tenés 15% OFF.' },
    ],
    planesRecomendados: [
      { prepagaSlug: 'swiss-medical', planSlug: 's1', razon: 'La cuota más baja de Swiss Medical: copago fijo en consultas, con la cartilla Nubial' },
      { prepagaSlug: 'swiss-medical', planSlug: 'smg02', razon: 'Sin copago en consultas, con la misma cartilla Nubial' },
      { prepagaSlug: 'swiss-medical', planSlug: 'smg20', razon: 'Cartilla Global: suma el Hospital Italiano y la Fundación Favaloro en CABA' },
    ],
    faq: [
      {
        q: '¿Necesito seguro médico para estudiar en Argentina?',
        a: 'Para entrar al país, el DNU 366/2025 pide seguro de salud a los extranjeros sin residencia permanente. Y mientras no tengas residencia permanente, la atención programada en los hospitales públicos se paga o la cubre tu seguro; las emergencias se atienden siempre. Por eso los estudiantes que se quedan meses o años se afilian a una prepaga.',
      },
      {
        q: '¿Puedo afiliarme con pasaporte o con la residencia precaria?',
        a: 'Sí. Swiss Medical te afilia con tu pasaporte o con el certificado de residencia precaria que te da Migraciones mientras tramitás la residencia. Para otras prepagas, consultá tu caso con un asesor.',
      },
      {
        q: '¿Me dan un certificado de cobertura para el DNI?',
        a: 'Sí. Con la afiliación te damos el certificado de cobertura para presentarlo en tu trámite de residencia y DNI.',
      },
      {
        q: '¿Qué es la residencia precaria?',
        a: 'Es el certificado que te da la Dirección Nacional de Migraciones al iniciar el trámite de residencia y que acredita tu situación mientras se resuelve. La residencia temporaria de estudiante se pide a distancia, por el sistema RaDEX, y dura un año prorrogable.',
      },
      {
        q: '¿En qué se diferencia de un seguro de viaje?',
        a: 'La asistencia al viajero está pensada para viajes cortos, con topes por evento. Una prepaga es tu cobertura médica en Argentina: médicos, estudios, guardias e internación de la cartilla, todos los meses.',
      },
      {
        q: '¿Me atienden en portugués o inglés?',
        a: 'Sí: el asesoramiento es en español, portugués o inglés.',
      },
    ],
    secciones: [
      {
        titulo: 'Cómo funciona la prepaga si venís de Brasil, Uruguay o Colombia',
        parrafos: [
          'En Argentina la prepaga es un plan de salud privado: pagás una cuota mensual según tu edad y el plan, y te atendés con los médicos, sanatorios y guardias de su cartilla. Todos los planes cubren el Programa Médico Obligatorio (PMO), y hay planes sin copago en consultas: en Swiss Medical, desde el SMG02.',
          'La diferencia con tu país está en cuánto pagás cada vez que usás el plan y desde cuándo te cubre:',
        ],
        tabla: {
          columnas: ['País', 'Cómo funciona allá', 'En Argentina, con una prepaga'],
          filas: [
            ['Brasil', 'Planos de saúde regulados por la ANS, con carencias de hasta 180 días para consultas, estudios e internación y de 300 días para el parto.', 'Lo que está en el PMO (consultas, estudios, internación, urgencias) no puede tener carencia (Ley 26.682, art. 10). Para embarazo, Swiss Medical tiene 2 meses de carencia desde el alta, y no se puede ingresar embarazada.'],
            ['Uruguay', 'En las mutualistas se paga la cuota y, aparte, órdenes y tickets (tasas moderadoras) por consultas y medicamentos, con topes que fija el Poder Ejecutivo.', 'Con un plan sin copago pagás solo la cuota mensual: la consulta no tiene costo extra.'],
            ['Colombia', 'En las EPS se pagan cuotas moderadoras por consultas y copagos por servicios de mayor complejidad, que fija el Ministerio de Salud.', 'Con un plan sin copago, la consulta no tiene costo extra; los planes con copago tienen una cuota más baja.'],
          ],
        },
        fuentes: [
          { texto: 'IDEC (Brasil): carencias de los planes', url: 'https://idec.org.br/node/19435' },
          { texto: 'ANS (Brasil)', url: 'https://www.gov.br/ans/pt-br/assuntos/consumidor/prazos-maximos-de-atendimento' },
          { texto: 'OPS: el sistema de salud de Uruguay', url: 'https://paho.org/sites/default/files/2021-12/Digital_Funcionamiento%20del%20sistema%20de%20salud%20de%20Uruguay.pdf' },
          { texto: 'IMPO (Uruguay): tasas moderadoras', url: 'https://www.impo.com.uy/bases/decretos/362-2024/8' },
          { texto: 'Ley 26.682 (Argentina), Infoleg', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
          { texto: 'Portafolio (Colombia): cuotas moderadoras y copagos 2026', url: 'https://www.portafolio.co/economia/gobierno/cuotas-moderadoras-y-copagos-en-2026-asi-quedan-los-valores-que-deberan-pagar-los-afiliados-al-sistema-de-salud-485624' },
        ],
      },
      {
        titulo: 'Qué te pedimos para afiliarte',
        parrafos: [
          'Para cotizar alcanzan tu edad y tu ciudad. Para afiliarte a Swiss Medical, tu pasaporte o el certificado de residencia precaria. Un asesor te guía en español, portugués o inglés y, con la afiliación, te damos el certificado de cobertura para tu trámite de residencia y DNI.',
        ],
      },
      {
        titulo: 'Qué dice la ley desde 2025',
        parrafos: [
          'El DNU 366/2025, publicado en el Boletín Oficial el 29 de mayo de 2025, reformó la Ley de Migraciones: pide seguro de salud a los extranjeros que ingresan sin residencia permanente, y los hospitales públicos cobran la atención programada a quien no tiene residencia permanente. Las emergencias se atienden siempre.',
          'La residencia temporaria de estudiante la da la Dirección Nacional de Migraciones a alumnos regulares de establecimientos reconocidos, por un año prorrogable. El trámite empieza a distancia, por el sistema RaDEX.',
        ],
        fuentes: [
          { texto: 'DNU 366/2025, Boletín Oficial', url: 'https://www.boletinoficial.gob.ar/detalleAviso/primera/326096/2025-05-29' },
          { texto: 'Texto del decreto, argentina.gob.ar', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-366-2025-413297' },
          { texto: 'Presidencia: atención a no residentes', url: 'https://www.argentina.gob.ar/node/467195' },
          { texto: 'Migraciones: residencia temporaria de estudiante', url: 'https://www.argentina.gob.ar/servicio/obtener-una-residencia-temporaria-como-estudiante' },
        ],
      },
    ],
    relacionados: [
      { href: '/para/extranjeros', titulo: '¿No venís a estudiar?', texto: 'Prepaga para extranjeros en Argentina: trabajo, residencia y jubilados' },
      { href: '/guias/seguro-medico-obligatorio-extranjeros', titulo: '¿Qué exige el decreto 366?', texto: 'Seguro médico obligatorio para extranjeros: qué pide la ley y quién está exento' },
      { href: '/pt/plano-de-saude-argentina', titulo: 'Lê em português?', texto: 'Plano de saúde na Argentina para estudantes brasileiros' },
    ],
    keywords: ['seguro medico para estudiantes extranjeros en argentina', 'prepaga para estudiantes extranjeros', 'seguro medico para estudiar en argentina', 'estudiar medicina en argentina seguro medico', 'certificado de cobertura medica para dni'],
  },
]

export function getPerfilBySlug(slug: string): PerfilData | undefined {
  return perfiles.find((p) => p.slug === slug)
}
