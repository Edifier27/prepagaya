import { formatPrecio } from '@/lib/utils'
import type { GuiaEnlace, GuiaSeccion } from '@/lib/data/guias'

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
  guiasRelacionadas?: string[] // slugs de guías (lib/data/guias.ts), solo donde hay relación real
  keywords: string[]
  /** Título del recuadro de la ley (por defecto "Qué te cubre cualquier prepaga por ley") */
  tituloLey?: string
  /** Secciones de desarrollo debajo del recuadro de la ley (ley vs. práctica) */
  secciones?: GuiaSeccion[]
  /** Normas y páginas oficiales citadas (se listan al pie y van a isBasedOn) */
  fuentes?: GuiaEnlace[]
  /** Última revisión del contenido (ISO); si falta, CONTENT_UPDATE */
  fechaActualizacion?: string
}

// Cobertura mensual obligatoria para personas celíacas (Ley 27.196, Decreto
// 218/2023): 27,5% de la Canasta Básica Alimentaria de un adulto. La publica
// el Ministerio de Salud cada seis meses: ACTUALIZAR el 26-oct-2026.
// Fuente: https://www.argentina.gob.ar/salud/nueva-actualizacion-del-monto-cubrir-por-obras-sociales-y-prepagas
export const MONTO_CELIAQUIA = {
  monto: 58560.97,
  montoTexto: '$58.560,97',
  desdeTexto: '26 de abril de 2026',
  proximaTexto: '26 de octubre de 2026',
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
        a: 'Sí, podés contratar cualquier prepaga aunque tengas diabetes. La Ley 26.682 prohíbe rechazar afiliados por razones de salud. Si la declarás, la prepaga puede pedir estudios y proponerte una cuota diferencial, que tiene que autorizar la Superintendencia de Servicios de Salud. Lo que está en el PMO, como la insulina y los controles, no puede tener carencia.',
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
    // Search Console (sept 2026): "subsidio celiaquía 2026" y variantes. El
    // monto sale del Ministerio de Salud (MONTO_CELIAQUIA, arriba).
    titulo: `Celiaquía y prepaga 2026: ${formatPrecio(Math.round(MONTO_CELIAQUIA.monto))} por mes para alimentos sin TACC`,
    metaDescripcion: `Desde el ${MONTO_CELIAQUIA.desdeTexto} las prepagas y obras sociales pagan ${MONTO_CELIAQUIA.montoTexto} por mes a cada persona celíaca (Ley 27.196). Qué más cubren y qué prepaga conviene.`,
    intro: `Si tenés celiaquía, tu prepaga u obra social tiene que darte todos los meses una cobertura en dinero para comprar harinas, premezclas y alimentos sin TACC: desde el ${MONTO_CELIAQUIA.desdeTexto} son ${MONTO_CELIAQUIA.montoTexto} por mes, según el Ministerio de Salud. Además cubre el diagnóstico y el seguimiento. Entre prepagas cambian la cartilla de gastroenterólogos y nutricionistas y lo simple que es el trámite.`,
    queCubreElPMO: `La Ley 26.588, modificada por la Ley 27.196, obliga a todas las obras sociales y prepagas a cubrir la detección, el diagnóstico y el tratamiento de la celiaquía, y a pagar una cobertura mensual en dinero para alimentos libres de gluten: el 27,5% de la Canasta Básica Alimentaria del INDEC para un adulto (Decreto 218/2023). Desde el ${MONTO_CELIAQUIA.desdeTexto} son ${MONTO_CELIAQUIA.montoTexto} por mes; la próxima actualización es el ${MONTO_CELIAQUIA.proximaTexto}.`,
    prepagasRecomendadas: [
      {
        slug: 'osde',
        planSlug: '310',
        razon: 'Cartilla nacional de gastroenterólogos y nutricionistas y, en el Plan 310, controles sin copago.',
      },
      {
        slug: 'swiss-medical',
        planSlug: 'smg20',
        razon: 'En el SMG20, consultas y estudios de seguimiento sin copago, con gastroenterólogos y nutricionistas en su cartilla.',
      },
      {
        slug: 'sancor-salud',
        planSlug: 'plan-3000',
        razon: 'Buena relación precio-cobertura en el interior del país, con gastroenterólogos y nutricionistas en su cartilla.',
      },
    ],
    preguntasAntesDeFirmar: [
      '¿Cómo se cobra la cobertura mensual para alimentos sin TACC: depósito o reintegro?',
      '¿Tienen gastroenterólogos y nutricionistas en mi zona?',
      '¿La densitometría ósea está cubierta?',
      '¿Los análisis de control (anticuerpos, hemograma) son sin copago?',
    ],
    faq: [
      {
        q: '¿Cuánto paga la prepaga por celiaquía en 2026?',
        a: `${MONTO_CELIAQUIA.montoTexto} por mes desde el ${MONTO_CELIAQUIA.desdeTexto}: es el 27,5% de la Canasta Básica Alimentaria de un adulto, según la Ley 27.196 y el Decreto 218/2023. Es obligatorio para todas las prepagas y obras sociales, no un beneficio opcional. Se actualiza cada seis meses; la próxima vez, el ${MONTO_CELIAQUIA.proximaTexto}. Fuente: Ministerio de Salud de la Nación.`,
      },
      {
        q: '¿Cómo se pide la cobertura para alimentos sin TACC?',
        a: 'Se tramita en tu prepaga u obra social con el certificado médico del diagnóstico de celiaquía. Cada una indica cómo la paga (depósito mensual o reintegro): preguntalo antes de asociarte.',
      },
      {
        q: '¿La celiaquía se considera una preexistencia en la prepaga?',
        a: 'Si ya tenés el diagnóstico al asociarte, se declara en la declaración jurada de salud. La Ley 26.682 no permite rechazarte por una preexistencia (la Superintendencia puede autorizar una cuota diferencial), y la cobertura de celiaquía, incluido el monto mensual, es obligatoria por ley.',
      },
    ],
    coberturasRelacionadas: ['medicamentos', 'psicologia', 'urgencias'],
    keywords: ['subsidio celiaquia 2026', 'monto celiaquia prepaga', 'mejor prepaga para celíacos', 'prepaga celiaquía argentina', 'cobertura celiaquía prepaga', 'ley 27196 celiaquia', 'prepaga dieta sin TACC'],
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
        a: 'Ninguna prepaga puede rechazar afiliados por hipertensión: las preexistencias no son criterio de rechazo (Ley 26.682, artículo 10). Lo que puede hacer es evaluarla y, si corresponde, proponer una cuota diferencial autorizada por la SSSalud; según nuestra experiencia, una hipertensión controlada muchas veces entra con la cuota normal. Lo que está en el PMO no puede tener carencia.',
      },
    ],
    coberturasRelacionadas: ['medicamentos', 'urgencias', 'rehabilitacion'],
    keywords: ['mejor prepaga para hipertensos', 'prepaga hipertensión arterial', 'cobertura medicación hipertensión prepaga', 'cardiólogo prepaga argentina', 'prepaga control cardiovascular'],
  },
  {
    slug: 'preexistencias',
    // Reescrita el 27-sep-2026 con la letra oficial (Ley 26.682 art. 10 y 11,
    // Decreto 1993/2011 art. 9, 10 y 17 actualizados en Infoleg), el
    // reglamento de contratación de Swiss Medical y la experiencia de Darío
    // como asesor, separando ley y práctica. La versión anterior decía que no
    // se podían cobrar "sobreprecios permanentes", que había una carencia de
    // 12 meses por preexistencia y que a los 24 meses se levantaba todo: nada
    // de eso está en la norma. También recomendaba prepagas "más flexibles"
    // sin ninguna fuente, así que la sección de recomendadas queda vacía.
    nombre: 'Preexistencias',
    emoji: '📋',
    titulo: 'Prepaga con preexistencias: qué dice la ley y cómo es el trámite real',
    metaDescripcion: 'No te pueden rechazar por una preexistencia, pero sí cobrarte una cuota diferencial que autoriza la SSSalud. Cómo es la auditoría y qué pasa si no declarás algo.',
    intro: 'Tener una enfermedad previa no te impide entrar a una prepaga: la ley dice que las preexistencias no pueden ser motivo de rechazo. Lo que sí puede pasar es que la prepaga te pida estudios, que un auditor médico evalúe tu caso y que te proponga una cuota más alta, con un valor que tiene que autorizar la Superintendencia de Servicios de Salud. Acá separamos lo que dice la norma de lo que vemos todos los días como asesores.',
    tituloLey: 'Lo que dice la ley',
    queCubreElPMO: 'La Ley 26.682 (artículo 10) dice que las enfermedades preexistentes "solamente pueden establecerse a partir de la declaración jurada del usuario y no pueden ser criterio del rechazo de admisión", y que la Superintendencia de Servicios de Salud "autorizará valores diferenciales debidamente justificados" para esos casos. La reglamentación (Decreto 1993/2011, artículo 10) distingue preexistencias temporarias, crónicas y de alto costo, y deja en manos de la SSSalud el valor de la cuota diferencial y cuánto tiempo se paga: la prepaga presenta el pedido y la SSSalud tiene 30 días para expedirse. Lo que está en el PMO no puede tener carencia, tengas o no preexistencias.',
    secciones: [
      {
        titulo: 'Cómo es el trámite en la práctica',
        cuerpo: 'Según nuestra experiencia como asesores, el circuito es así. Completás la declaración jurada de salud. Si declarás algo, la solicitud pasa al auditor médico de la prepaga, que puede pedirte estudios o un resumen de tu historia clínica. Con eso hay tres salidas: te acepta con la cuota normal, te pide más estudios, o arma una estructura de costos y la presenta a la SSSalud para cobrarte una cuota diferencial. En los casos que vemos, esa cuota puede llegar a triplicar la normal. Con el valor aprobado, vos decidís si aceptás o no. Pedí que la aceptación quede por escrito, con el valor y la duración de la cuota diferencial si la hay: los reglamentos de contratación, como el de Swiss Medical, prevén que las preexistencias declaradas se cubren cuando la empresa las acepta en forma expresa.',
      },
      {
        titulo: 'Qué preexistencias pasan más fácil',
        cuerpo: 'No hay una lista oficial: cada prepaga tiene su propio criterio de auditoría, y la misma condición puede tener respuestas distintas según dónde la presentes. Según nuestra experiencia, hay cosas que casi nunca piden papeles, como las várices, la gota o un hipotiroidismo común. Una hipertensión controlada suele pasar sin auditoría (en Swiss Medical, por ejemplo), y una diabetes sí pasa por auditoría. Otras prepagas tienen auditorías más exigentes.',
      },
      {
        titulo: 'Qué te va a pedir el auditor',
        cuerpo: 'En general, un resumen de historia clínica firmado por tu médico con el diagnóstico, cuándo empezó, cómo evolucionó, cómo estás hoy, las internaciones y el tratamiento, más los últimos estudios y un laboratorio reciente. Según nuestra experiencia, en una hipertensión con varios medicamentos suelen pedir estudios cardiológicos; en una diabetes, un formulario del diabetólogo o del endocrinólogo; y con un índice de masa corporal de 30 o más, un resumen con peso, talla y los tratamientos de los últimos dos años. Llevarlo todo junto desde el principio evita idas y vueltas. Derivar tus aportes de obra social o pagar como particular no cambia la evaluación.',
        cta: { texto: '¿Qué te van a pedir a vos? Buscá tu condición y armá la lista de documentación para la declaración jurada.', boton: 'Buscar mi condición', href: '/declaracion-jurada-de-salud' },
      },
      {
        titulo: 'Qué declarar y qué pasa si no lo declarás',
        cuerpo: 'La declaración jurada pregunta por enfermedades, cirugías, internaciones, tratamientos y medicación; algunas, como la de Swiss Medical, también por los profesionales que consultaste en los últimos 12 meses. Una cirugía que ya te indicaron y todavía no te hiciste también se declara. Si la prepaga detecta después algo que venía de antes y no declaraste, puede aplicarte un plazo de espera para esa patología o rescindir el contrato por falsedad de la declaración jurada, y reclamarte lo que haya cubierto. El reglamento de Swiss Medical, por ejemplo, prevé una junta de tres médicos para decidir si la enfermedad era anterior, a la que podés ir con un médico tuyo. El plazo durante el cual se puede invocar la falsedad lo fija la SSSalud (Decreto 1993/2011, artículo 9). Declarar todo sale siempre más barato.',
      },
      {
        titulo: 'Embarazo en curso y edad: la ley y la práctica',
        cuerpo: 'En la práctica, con un embarazo en curso es muy difícil entrar: hay prepagas que directamente no lo aceptan. Y si alguien entra embarazada sin declararlo, cuando la prepaga lo detecta suele cobrarle las carencias, es decir, un pago extra por los meses de espera que no cumplió. También hay prepagas que a partir de cierta edad solo ofrecen planes parciales. La norma dice otra cosa: las preexistencias y la edad no pueden ser criterio de rechazo (Ley 26.682, artículos 10 y 11), y desde el Decreto 102/2025 los planes de la última franja etaria "deben estar disponibles sin límites de edad máxima" (Decreto 1993/2011, artículo 17). Si te rechazan o te ofrecen solo un plan inferior, pedí la respuesta por escrito: con eso podés reclamar ante la Superintendencia de Servicios de Salud.',
        cta: { texto: 'Cómo hacer el reclamo ante la SSSalud, paso a paso.', boton: 'Ver la guía', href: '/guias/como-reclamar-a-una-prepaga' },
      },
    ],
    prepagasRecomendadas: [],
    preguntasAntesDeFirmar: [
      '¿Mi condición pasa por auditoría médica? ¿Qué estudios necesitan?',
      'Si me cobran una cuota diferencial: ¿cuánto es, por cuánto tiempo y cuándo la autorizó la SSSalud?',
      '¿La aceptación de mi preexistencia queda por escrito?',
      '¿La declaración jurada pide los médicos que consulté en el último año?',
      '¿Qué carencias tiene el plan para prestaciones superadoras? (el máximo legal es 12 meses)',
    ],
    faq: [
      {
        q: '¿Una prepaga me puede rechazar por una enfermedad previa?',
        a: 'Según la Ley 26.682 (artículo 10), no: las preexistencias no pueden ser criterio de rechazo. Lo que sí puede hacer la prepaga es pedirte estudios y proponerte una cuota diferencial, cuyo valor y duración autoriza la Superintendencia de Servicios de Salud. Si te rechazan, pedí la respuesta por escrito y reclamá ante la SSSalud.',
      },
      {
        q: '¿Cuánto más se paga con una preexistencia?',
        a: 'Depende del caso: el valor lo presenta la prepaga y lo autoriza la SSSalud, que también fija por cuánto tiempo se paga (Decreto 1993/2011, artículo 10). Según nuestra experiencia, puede llegar a triplicar la cuota, aunque muchas condiciones controladas entran con la cuota normal.',
      },
      {
        q: '¿Hay carencia por preexistencia?',
        a: 'Para lo que está en el PMO no puede haber carencia (Ley 26.682, artículo 10), y para las prestaciones superadoras el máximo es de 12 meses (Decreto 1993/2011, artículo 10). Para una preexistencia declarada, lo que prevé la ley es la cuota diferencial. Distinto es lo que no declaraste: ahí el auditor puede aplicar un plazo de espera para esa patología o rescindir el contrato.',
      },
      {
        q: '¿Qué pasa si no declaro una preexistencia?',
        a: 'Si la prepaga detecta después que la enfermedad era anterior, puede aplicarte un plazo de espera para esa patología o rescindir el contrato por falsedad de la declaración jurada, y reclamarte lo que haya cubierto. Declarar todo sale siempre más barato.',
      },
      {
        q: '¿Cambia algo si derivo mis aportes o pago como particular?',
        a: 'No. Según nuestra experiencia, la auditoría médica y la cuota diferencial se aplican igual en los dos casos.',
      },
      {
        q: '¿Me pueden rechazar por la edad?',
        a: 'La ley dice que no: la edad no puede ser criterio de rechazo (Ley 26.682, artículo 11) y los planes de la última franja etaria deben estar disponibles sin límite de edad máxima (Decreto 1993/2011, artículo 17, texto del Decreto 102/2025). En la práctica, algunas prepagas solo ofrecen planes parciales a partir de cierta edad: pedí la respuesta por escrito.',
      },
    ],
    coberturasRelacionadas: ['medicamentos', 'psicologia', 'urgencias'],
    guiasRelacionadas: ['prepaga-sin-periodo-carencia', 'como-afiliarse-prepaga-requisitos', 'como-reclamar-a-una-prepaga', 'edad-maxima-afiliarse-prepaga'],
    keywords: ['prepaga con preexistencias', 'preexistencias prepaga', 'prepaga enfermedad preexistente', 'cuota diferencial preexistencia', 'declaracion jurada de salud prepaga', 'ley 26682 preexistencias', 'no declare una preexistencia prepaga', 'auditoria medica prepaga'],
    fuentes: [
      { texto: 'Ley 26.682 (texto actualizado) — Infoleg', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
      { texto: 'Decreto 1993/2011, reglamentación de la Ley 26.682 (texto actualizado) — Infoleg', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/190000-194999/190606/texact.htm' },
      { texto: 'Ley simple: Medicina prepaga — Ministerio de Justicia', url: 'https://www.argentina.gob.ar/justicia/derechofacil/leysimple/medicina-prepaga' },
    ],
    fechaActualizacion: '2026-09-27',
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
      {
        slug: 'avalian',
        planSlug: 'as300',
        razon: 'Según el diagrama de cobertura oficial de Avalian, los planes Integral y Superior cubren 30 sesiones de psicoterapia por año y el Selecta, 48 sin copago. Todos suman telemedicina (e-doc).',
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
    guiasRelacionadas: ['discapacidad-obra-social-cobertura-100'],
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
        a: 'Sí: las preexistencias no son criterio de rechazo (Ley 26.682, artículo 10). La prepaga puede pedir estudios y proponerte una cuota diferencial, que tiene que autorizar la SSSalud. Lo que está en el PMO, como las urgencias y la internación, no puede tener carencia.',
      },
    ],
    coberturasRelacionadas: ['medicamentos', 'urgencias', 'rehabilitacion'],
    keywords: ['prepaga enfermedad cardiovascular', 'prepaga infarto miocardio', 'prepaga stent angioplastia', 'cardiología cobertura prepaga', 'mejor prepaga para el corazón'],
  },
  {
    slug: 'discapacidad',
    nombre: 'Discapacidad',
    emoji: '♿',
    titulo: 'Mejor prepaga para personas con discapacidad (CUD) 2026',
    metaDescripcion: 'Qué prepaga conviene si tenés Certificado Único de Discapacidad (CUD). Cobertura 100% por Ley 24.901: terapias, transporte, apoyos y escolaridad especial.',
    intro: 'Si tenés Certificado Único de Discapacidad (CUD), la Ley 24.901 obliga a las prepagas a cubrir el 100% de un conjunto amplio de prestaciones —no solo las médicas básicas del PMO— y esa cobertura no depende del plan que elijas ni puede limitarse por preexistencia. Lo que sí cambia mucho de una prepaga a otra es la red real de prestadores de discapacidad en tu zona y la agilidad para autorizar cada prestación.',
    queCubreElPMO: 'Por la Ley 24.901 (extendida a las prepagas por la Ley 26.682), la cobertura para afiliados con CUD incluye al 100%: prestaciones de rehabilitación (kinesiología, fonoaudiología, terapia ocupacional, psicopedagogía), apoyo a la integración escolar (maestra integradora), transporte especial hacia los tratamientos, centros de día y talleres protegidos, prestaciones asistenciales (residencias, hogares) cuando corresponde, y todas las prestaciones médicas del PMO sin límite de sesiones cuando están indicadas.',
    prepagasRecomendadas: [
      {
        slug: 'osde',
        planSlug: '310',
        razon: 'La red más grande del país juega a favor en discapacidad: más variedad de centros de rehabilitación, escuelas de integración y transporte especial habilitados cerca de donde vivís, algo clave cuando las terapias son varias veces por semana.',
      },
      {
        slug: 'swiss-medical',
        planSlug: 'smg20',
        razon: 'Cartilla amplia con proceso de autorizaciones digitalizado, que en la práctica agiliza la aprobación mensual de las prestaciones de Ley 24.901 frente a circuitos más manuales.',
      },
      {
        slug: 'sancor-salud',
        planSlug: 'plan-3000',
        razon: 'Buena opción si estás en el interior del país, donde la red de prestadores de discapacidad de las nacionales premium suele ser más chica que la de las regionales fuertes.',
      },
    ],
    preguntasAntesDeFirmar: [
      '¿Tienen prestadores de rehabilitación y centros de día en mi zona?',
      '¿Cómo es el circuito de autorización mensual de las prestaciones de Ley 24.901?',
      '¿Cubren transporte especial hacia los tratamientos?',
      '¿Tienen convenio con la escuela o el centro educativo terapéutico que necesito?',
      '¿Qué pasa si el prestador que necesito no está en cartilla?',
    ],
    faq: [
      { q: '¿La prepaga me puede rechazar por tener discapacidad o CUD?', a: 'No. La Ley 26.682 prohíbe expresamente el rechazo de afiliados por discapacidad o cualquier condición preexistente. La prepaga debe aceptarte y cubrir las prestaciones de Ley 24.901 desde el ingreso, sin período de carencia para esas prestaciones.' },
      { q: '¿Qué es exactamente el CUD y cómo lo tramito?', a: 'El Certificado Único de Discapacidad es un documento gratuito que acredita la condición ante juntas evaluadoras provinciales o ANDIS (Agencia Nacional de Discapacidad). Con el CUD tramitado, cualquier prepaga u obra social está obligada a cubrir el 100% de las prestaciones de la Ley 24.901.' },
      { q: '¿Las prestaciones de discapacidad tienen copago?', a: 'No. Las prestaciones cubiertas por la Ley 24.901 (rehabilitación, transporte, apoyos escolares, centros de día) deben cubrirse al 100%, sin copago, a diferencia de otras prestaciones del plan donde sí puede haber coseguro según el plan contratado.' },
      { q: '¿Puedo cambiar de prepaga si ya tengo CUD y estoy en tratamiento?', a: 'Sí. La cobertura de la Ley 24.901 se mantiene en cualquier prepaga a la que te afilies, sin carencia. Igual conviene chequear antes que la nueva prepaga tenga en cartilla el centro de rehabilitación o la escuela donde ya estás en tratamiento, para no tener que cambiar de prestador.' },
    ],
    coberturasRelacionadas: ['rehabilitacion', 'psicologia', 'medicamentos'],
    guiasRelacionadas: ['discapacidad-obra-social-cobertura-100'],
    keywords: ['mejor prepaga para discapacidad', 'prepaga cud cobertura', 'ley 24901 prepagas', 'prepaga discapacidad 100 cobertura', 'certificado unico de discapacidad prepaga'],
  },
  {
    slug: 'enfermedad-renal-cronica',
    nombre: 'Enfermedad renal crónica y diálisis',
    emoji: '🩸',
    titulo: 'Mejor prepaga para enfermedad renal crónica y diálisis 2026',
    metaDescripcion: 'Qué prepaga conviene si tenés enfermedad renal crónica. Cobertura 100% de hemodiálisis, diálisis peritoneal y trasplante renal en Argentina.',
    intro: 'La enfermedad renal crónica es una de las condiciones de mayor costo del sistema de salud, y por eso está específicamente protegida: la SSSalud reintegra a las prepagas parte del gasto en diálisis y trasplante a través del Sistema Único de Reintegro (SUR), lo que en la práctica elimina el argumento de "es muy caro" para negarte la cobertura. Lo que sí importa al elegir prepaga es tener un centro de diálisis cerca de casa, porque el tratamiento es varias veces por semana de por vida (o hasta el trasplante).',
    queCubreElPMO: 'El PMO cubre al 100% y sin límite de sesiones: hemodiálisis, diálisis peritoneal (incluidos los insumos), los controles nefrológicos periódicos, y el trasplante renal con su tratamiento inmunosupresor de por vida (regulado por la Ley 24.193 de Trasplantes, en articulación con el INCUCAI). También cubre el traslado hacia el centro de diálisis cuando el afiliado no puede trasladarse por sus propios medios.',
    prepagasRecomendadas: [
      {
        slug: 'osde',
        planSlug: '310',
        razon: 'La red más grande del país es una ventaja concreta acá: más centros de diálisis habilitados en más ciudades, lo que reduce la distancia que tenés que viajar tres veces por semana.',
      },
      {
        slug: 'swiss-medical',
        planSlug: 'smg20',
        razon: 'Sanatorios propios con servicio de nefrología y diálisis integrado, y buena coordinación entre el nefrólogo de cabecera y el centro donde te dializás.',
      },
      {
        slug: 'sancor-salud',
        planSlug: 'plan-3000',
        razon: 'Buena opción si vivís en el interior del país: su red en ciudades medianas suele tener centros de diálisis donde las nacionales premium tienen menos presencia.',
      },
    ],
    preguntasAntesDeFirmar: [
      '¿Qué centros de diálisis tienen en convenio cerca de mi domicilio?',
      '¿Cubren el traslado hacia el centro de diálisis si lo necesito?',
      '¿Cómo es el seguimiento para pacientes en lista de espera de trasplante?',
      '¿La medicación inmunosupresora post-trasplante está cubierta al 100% de por vida?',
      '¿Qué pasa si me mudo de ciudad: mantengo la continuidad del tratamiento?',
    ],
    faq: [
      { q: '¿La prepaga puede negarme la cobertura de diálisis por el costo?', a: 'No. Es una prestación obligatoria del PMO al 100%, y además la SSSalud reintegra parte del costo a la prepaga a través del Sistema Único de Reintegro (SUR), un fondo pensado justamente para que el alto costo de tratamientos como la diálisis no sea excusa para negarlos.' },
      { q: '¿Puedo afiliarme a una prepaga si ya estoy en diálisis?', a: 'Sí. La Ley 26.682 prohíbe el rechazo por preexistencias. La prepaga debe aceptarte y cubrir la diálisis desde el ingreso, sin período de carencia para esta prestación.' },
      { q: '¿Qué cubre la prepaga después de un trasplante renal?', a: 'Cobertura completa e indefinida de la medicación inmunosupresora (para evitar el rechazo del órgano) y el seguimiento nefrológico periódico. Es una de las prestaciones de mayor costo sostenido y está protegida por ley igual que la diálisis.' },
      { q: '¿Conviene elegir la prepaga con el plan más caro para diálisis?', a: 'No necesariamente: la cobertura de diálisis y trasplante es la misma (100%) en todos los planes de una misma prepaga, porque la exige la ley. Lo que cambia entre planes es la cartilla general (otras especialidades, habitación, etc.), no la cobertura renal en sí. Lo que sí conviene comparar entre prepagas es la cantidad de centros de diálisis disponibles en tu zona.' },
    ],
    coberturasRelacionadas: ['medicamentos', 'urgencias', 'rehabilitacion'],
    keywords: ['prepaga enfermedad renal cronica', 'prepaga dialisis cobertura', 'prepaga trasplante renal', 'hemodialisis prepaga argentina', 'mejor prepaga insuficiencia renal'],
  },
]

export function getCondicionBySlug(slug: string) {
  return condiciones.find((c) => c.slug === slug)
}
