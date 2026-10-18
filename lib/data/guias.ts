import { topeCirugiaSmg50 } from '@/lib/data/topes-reintegro'
import { escalaPorEdad, precioGrupo } from '@/lib/precios/motor'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { formatPrecio } from '@/lib/utils'
import { contactos } from '@/lib/data/contactos'
import { SWISS_S1_COPAGOS, SWISS_COPAGOS_VIGENCIA } from '@/lib/data/coseguros-os'

// Precios de lista oficiales para las guías que dan números (3-oct-2026):
// CABA y GBA, contratación directa, IVA incluido. Salen de los cuadros de la
// SSSalud y cambian solos cada mes; antes estaban escritos a mano y quedaban
// viejos ("arranca en $110.000", "$170.000").
const MES = PRECIO_ACTUALIZADO.toLowerCase()
const lista = (prepaga: string, plan: string, edad = 30) => {
  const r = precioGrupo(prepaga, plan, [edad], 'caba')
  return r ? formatPrecio(r.total) : '—'
}
// Edades en las que cambia el precio de un plan: "36, 41, 46, 51, 56 y 61"
const cortes = (prepaga: string, plan: string) => {
  const xs = (escalaPorEdad(prepaga, plan, 'caba')?.rangos ?? []).slice(1).map((r) => String(r.desde))
  return xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs.at(-1)}` : xs[0] ?? '—'
}
const ultimoCorte = (prepaga: string, plan: string) => String(escalaPorEdad(prepaga, plan, 'caba')?.rangos.at(-1)?.desde ?? '—')
// La cuota más baja del mercado a los 30 años
const MAS_BARATO = prepagas
  .flatMap((p) => p.planes.filter((pl) => pl.fuentePrecio === 'sssalud').map((pl) => ({ p, pl, r: precioGrupo(p.slug, pl.slug, [30], 'caba') })))
  .filter((x) => x.r)
  .sort((a, b) => (a.r?.total ?? 0) - (b.r?.total ?? 0))[0]
const DESDE = MAS_BARATO?.r ? formatPrecio(MAS_BARATO.r.total) : '—'
const DESDE_PLAN = MAS_BARATO ? `${MAS_BARATO.p.nombre} ${MAS_BARATO.pl.nombre.replace(/^Plan /, '')}${MAS_BARATO.pl.copago ? ', con copago' : ''}` : ''

export interface GuiaEnlace {
  texto: string
  url: string
}

export interface GuiaSeccion {
  titulo: string
  cuerpo: string
  // Botones a trámites oficiales (se abren en pestaña nueva).
  enlaces?: GuiaEnlace[]
  // Bloque de conversión que se muestra al final de la sección.
  cta?: { texto: string; boton: string; href: string }
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
  fuentes?: GuiaEnlace[] // fuentes oficiales (se listan al pie y van a isBasedOn)
  captarBaja?: boolean // muestra el formulario de contacto de "bajas" (17-oct-2026)
  // Tabla comparativa y pasos (pilar de bajas, 17-oct-2026): datos propios,
  // fáciles de citar por buscadores de IA; los pasos generan el JSON-LD HowTo.
  tabla?: { titulo: string; columnas: string[]; filas: { celdas: string[]; slug?: string }[]; nota?: string }
  pasos?: { nombre: string; texto: string }[]
}

export const guias: GuiaData[] = [
  {
    slug: 'opcion-de-cambio-obra-social',
    titulo: 'Cómo cambiar de obra social: la opción de cambio online, paso a paso (2026)',
    metaDescripcion: 'Cómo hacer la opción de cambio de obra social en la web de la Superintendencia: clave fiscal nivel 3, confirmación por mail en 48 horas y alta el 1° del mes siguiente. Quiénes pueden y cada cuánto.',
    tiempoLectura: 6,
    categoria: 'Trámites',
    fechaActualizacion: '2026-09-24',
    contenido: {
      intro: 'Para cambiar de obra social tenés que hacer la "opción de cambio" en la web de la Superintendencia de Servicios de Salud (SSSalud). Es gratis, es online y la hacés vos con tu clave fiscal nivel 3 de ARCA: no hace falta ir a ningún lado ni pagarle a un gestor. Podés elegir cualquier obra social o prepaga inscripta en el Registro Nacional de Agentes del Seguro, una vez cada 365 días, y el cambio se activa el primer día del mes siguiente.',
      secciones: [
        {
          titulo: 'Quiénes pueden hacer la opción de cambio',
          cuerpo: 'Según la SSSalud, pueden hacerla los trabajadores en relación de dependencia bajo convenio, los que están fuera de convenio y son titulares de una obra social de personal de dirección, el personal de casas particulares y los monotributistas de todas las categorías. Los monotributistas solo pueden elegir entre las entidades inscriptas en el registro de las que aceptan monotributistas. Los jubilados y pensionados hacen la opción en ANSES, no en la Superintendencia.',
        },
        {
          titulo: 'Quiénes no pueden',
          cuerpo: 'No pueden hacer la opción de cambio: quienes se quedaron sin trabajo; los trabajadores con un sueldo mensual menor a dos bases mínimas jubilatorias; las trabajadoras en licencia por maternidad o en situación de excedencia; y el personal de las Fuerzas Armadas y de seguridad, del Servicio Penitenciario, del Poder Judicial y del Poder Legislativo, los afiliados a obras sociales provinciales (como IOMA o APROSS) y cualquier persona de una entidad que no esté inscripta en el registro.',
        },
        {
          titulo: 'Qué necesitás',
          cuerpo: 'Clave fiscal nivel 3 de ARCA (ex AFIP); tus datos personales (nombre, DNI, CUIL, domicilio y un correo electrónico al que tengas acceso); y saber a qué entidad te querés pasar. Revisá que esté inscripta: en nuestra lista de códigos de obras sociales están todas las del registro, con su código.',
          enlaces: [{ texto: 'Hacer la opción de cambio (SSSalud)', url: 'https://www.argentina.gob.ar/servicio/realizar-opcion-de-cambio-libre-eleccion-de-agentes-del-seguro' }],
        },
        {
          titulo: 'El paso a paso',
          cuerpo: 'Uno: entrá al trámite con tu CUIT y tu clave fiscal nivel 3 (si es la primera vez, seguí el instructivo que está en la página del trámite). Dos: elegí "Opción de cambio", después "Nueva opción", y completá el formulario con tus datos. Tres: tocá "Elección de Obra Social / Prepaga" y elegí la entidad. Cuatro: aceptá, revisá los datos y confirmá; el número de trámite aparece arriba, en un recuadro verde. Cinco: te llega un mail; entrá al link "Confirmar trámite" dentro de las 48 horas, o la opción se desestima. En la pantalla y en el mail de ratificación figuran el número de trámite y la fecha desde la que rige tu nueva cobertura.',
        },
        {
          titulo: 'Cuánto tarda el cambio de obra social',
          cuerpo: 'Todas las opciones se activan el primer día del mes siguiente al que hiciste y confirmaste el trámite. Si confirmás el 10 de octubre, la nueva obra social rige desde el 1 de noviembre; hasta ese día seguís con la que tenías. Una vez confirmada la opción, contactá a la nueva entidad para afiliarte: sin ese paso no vas a poder usar la cobertura cuando empiece.',
        },
        {
          titulo: 'Cada cuánto se puede cambiar',
          cuerpo: 'Una vez cada 365 días. La opción es irretractable: en la entidad que elegiste tenés que quedarte al menos un año, y recién después podés hacer una nueva opción. Por eso conviene comparar bien antes de confirmar.',
        },
        {
          titulo: 'Si te querés pasar a una prepaga',
          cuerpo: 'La opción de cambio también sirve para pasar tus aportes a una prepaga inscripta como agente del seguro: tus aportes se descuentan de la cuota y pagás solo la diferencia. Antes de hacerla, calculá cuánto sería con tu sueldo y elegí el plan: después tenés que quedarte un año.',
          cta: {
            texto: 'Poné tu sueldo y mirá cuánto pagarías de diferencia en cada plan, con los precios oficiales.',
            boton: 'Calcular mi diferencia',
            href: '/calculadora-aportes',
          },
        },
      ],
      conclusion: 'Cambiar de obra social es un trámite online de diez minutos: clave fiscal nivel 3, elegir la entidad, confirmar el mail en 48 horas y esperar al primer día del mes siguiente. Lo importante es elegir bien, porque después tenés que quedarte un año. Si estás pensando en una prepaga, compará antes cuánto te queda de diferencia con tus aportes.',
    },
    faq: [
      {
        q: '¿Cómo cambio de obra social?',
        a: 'Con la opción de cambio, online, en la web de la Superintendencia de Servicios de Salud: entrás con tu clave fiscal nivel 3, elegís la nueva obra social o prepaga y confirmás el mail que te llega dentro de las 48 horas.',
      },
      {
        q: '¿Cuánto tarda el cambio de obra social?',
        a: 'La opción se activa el primer día del mes siguiente al que hiciste y confirmaste el trámite. Hasta entonces seguís con tu obra social actual.',
      },
      {
        q: '¿Cada cuánto puedo cambiar de obra social?',
        a: 'Una vez cada 365 días. La opción es irretractable: tenés que quedarte al menos un año en la entidad que elegiste.',
      },
      {
        q: '¿Puedo hacer la opción de cambio en la obra social o con un gestor?',
        a: 'La Superintendencia indica que la opción de cambio se hace solo online, desde su web, sin intermediarios y sin ir en persona. Es gratuita. Tu clave fiscal es personal: no se la des a nadie.',
      },
      {
        q: '¿Qué pasa si no confirmo el mail?',
        a: 'La opción se desestima. Tenés 48 horas para entrar al link "Confirmar trámite" del mail.',
      },
      {
        q: '¿Puedo cambiar de obra social si soy monotributista?',
        a: 'Sí, pero solo a las entidades inscriptas en el registro de agentes del seguro que aceptan monotributistas.',
      },
    ],
    keywords: ['cambiar de obra social', 'como cambiar de obra social', 'opcion de cambio obra social', 'cambio de obra social online', 'cuanto tarda el cambio de obra social', 'cada cuanto se puede cambiar de obra social', 'opcion de cambio sssalud', 'cambiar obra social clave fiscal'],
    relacionadas: ['derivar-obra-social-a-prepaga', 'que-obra-social-tengo-codem', 'unificar-aportes-obra-social', 'obra-social-vs-prepaga', 'baja-obra-social-monotributo'],
    fuentes: [
      { texto: 'Argentina.gob.ar — Realizar opción de cambio: libre elección de agentes del seguro', url: 'https://www.argentina.gob.ar/servicio/realizar-opcion-de-cambio-libre-eleccion-de-agentes-del-seguro' },
      { texto: 'Superintendencia de Servicios de Salud — Usuarios', url: 'https://www.argentina.gob.ar/sssalud/usuarios' },
    ],
  },
  {
    slug: 'unificar-aportes-obra-social',
    titulo: 'Unificación de aportes: cómo sumar los aportes de tu pareja en una obra social o prepaga (2026)',
    metaDescripcion: 'Cómo unificar los aportes de obra social con tu cónyuge o concubino: quiénes pueden, qué papeles piden y cómo presentarlos ante la Superintendencia por TAD, con turno o por correo. Gratis.',
    tiempoLectura: 5,
    categoria: 'Trámites',
    fechaActualizacion: '2026-09-24',
    contenido: {
      intro: 'La unificación de aportes es el trámite para que vos y tu cónyuge o concubino tengan la misma obra social o prepaga, con los aportes de los dos. La pueden pedir las parejas en relación de dependencia, monotributistas o del servicio doméstico, y también los jubilados. Es gratis y se hace ante la Superintendencia de Servicios de Salud: online por Trámites a Distancia (TAD), con turno o por correo.',
      secciones: [
        {
          titulo: 'Para qué sirve',
          cuerpo: 'Si los dos trabajan, cada uno aporta a su propia obra social. Al unificar, los aportes de ambos van a la misma entidad y el grupo familiar queda en un solo plan. Cuando esa entidad es una prepaga, los dos aportes se descuentan de la cuota: es una de las formas más efectivas de pagar menos diferencia.',
          cta: {
            texto: 'La calculadora de aportes te deja sumar el sueldo de tu pareja y te muestra la diferencia en cada plan.',
            boton: 'Calcular con los dos sueldos',
            href: '/calculadora-aportes',
          },
        },
        {
          titulo: 'Quiénes pueden unificar',
          cuerpo: 'Cónyuges o concubinos beneficiarios de obras sociales nacionales, en relación de dependencia, monotributistas o del régimen de servicio doméstico. Para jubilados hay un trámite propio, con los mismos pasos más la certificación del vínculo que extiende ANSES.',
        },
        {
          titulo: 'Qué papeles necesitás',
          cuerpo: 'El formulario de unificación de aportes (se descarga de la página del trámite); fotocopia del DNI; certificado de matrimonio o de concubinato; certificación laboral de tu empleador actual (hay un modelo para descargar) y fotocopia del último recibo de sueldo, o los pagos del monotributo o del servicio doméstico. Si sos monotributista, sumá la fotocopia del F.184 / F.152 de ARCA (y, si sos monotributista social, el alta como efector de Desarrollo Social). Si es servicio doméstico, el F.102 de ARCA y, si hay adherentes, el F.575.',
          enlaces: [
            { texto: 'Solicitar unificación de aportes', url: 'https://www.argentina.gob.ar/servicio/solicitar-unificacion-de-aportes' },
            { texto: 'Unificación de aportes de jubilados', url: 'https://www.argentina.gob.ar/servicio/solicitar-unificacion-de-aportes-de-jubilados' },
          ],
        },
        {
          titulo: 'Cómo presentarlo',
          cuerpo: 'Elegí una sola vía. Online, por Trámites a Distancia (TAD), con tu usuario de ARCA o de Mi Argentina. Con turno, en la sede central de la Superintendencia (Bartolomé Mitre 434, CABA) o en la delegación de tu provincia: el turno se pide online o al 0800-222-72583. O por correo postal, a la sede central o a la delegación más cercana a tu domicilio.',
        },
        {
          titulo: 'Si se separan o cambiás de trabajo',
          cuerpo: 'Para volver cada uno a la obra social de su actividad está la desunificación de aportes: formulario de desunificación, DNI de los dos, certificación laboral o recibo de sueldo, la anulación del concubinato, la sentencia de divorcio o el telegrama de renuncia o despido, y el certificado del vínculo. Se presenta por las mismas vías.',
          enlaces: [{ texto: 'Solicitar desunificación de aportes', url: 'https://www.argentina.gob.ar/servicio/solicitar-desunificacion-de-aportes' }],
        },
      ],
      conclusion: 'Unificar aportes es gratis y, si los dos trabajan, es la forma más directa de bajar lo que pagan por la cobertura familiar: los dos aportes van al mismo plan. Juntá el formulario, los DNI, el certificado de matrimonio o concubinato y las certificaciones laborales, y presentalo por TAD para no hacer filas.',
    },
    faq: [
      {
        q: '¿Qué es la unificación de aportes?',
        a: 'Es el trámite ante la Superintendencia de Servicios de Salud para que dos cónyuges o concubinos tengan la misma obra social o prepaga, con los aportes de los dos.',
      },
      {
        q: '¿Cómo unifico aportes con mi pareja?',
        a: 'Completás el formulario de unificación y lo presentás con el DNI, el certificado de matrimonio o concubinato y las certificaciones laborales, por Trámites a Distancia (TAD), con turno en la Superintendencia o por correo.',
      },
      {
        q: '¿La unificación de aportes tiene costo?',
        a: 'No, es gratuita.',
      },
      {
        q: '¿Puedo unificar aportes con mi concubino?',
        a: 'Sí: en lugar del certificado de matrimonio presentás el certificado de concubinato.',
      },
      {
        q: '¿Los jubilados pueden unificar aportes?',
        a: 'Sí, con el trámite de unificación de aportes de jubilados: los mismos papeles más el recibo de haberes y la certificación del vínculo de ANSES.',
      },
    ],
    keywords: ['unificacion de aportes', 'unificar aportes obra social', 'unificar aportes con mi pareja', 'unificacion de aportes conyuge', 'unificacion de aportes concubino', 'unificacion de aportes sssalud', 'unificar aportes prepaga', 'desunificacion de aportes'],
    relacionadas: ['opcion-de-cambio-obra-social', 'divorcio-obra-social', 'derivar-obra-social-a-prepaga', 'que-obra-social-tengo-codem', 'baja-obra-social-monotributo'],
    fuentes: [
      { texto: 'Argentina.gob.ar — Solicitar unificación de aportes', url: 'https://www.argentina.gob.ar/servicio/solicitar-unificacion-de-aportes' },
      { texto: 'Argentina.gob.ar — Solicitar unificación de aportes de jubilados', url: 'https://www.argentina.gob.ar/servicio/solicitar-unificacion-de-aportes-de-jubilados' },
      { texto: 'Argentina.gob.ar — Solicitar desunificación de aportes', url: 'https://www.argentina.gob.ar/servicio/solicitar-desunificacion-de-aportes' },
    ],
  },
  {
    slug: 'obra-social-empleada-domestica',
    titulo: 'Obra social de la empleada doméstica: cuál le corresponde y cómo elegir otra (2026)',
    metaDescripcion: 'La obra social del personal de casas particulares es OSPACP, pero la trabajadora puede elegir otra. Para tener cobertura, los aportes tienen que llegar a los de 16 horas semanales o más. Lo que dicen ARCA y ANSES.',
    tiempoLectura: 5,
    categoria: 'Trámites',
    fechaActualizacion: '2026-09-25',
    contenido: {
      intro: 'Toda trabajadora de casas particulares registrada tiene obra social. La de la actividad es la Obra Social del Personal Auxiliar de Casas Particulares (OSPACP), que se asigna automáticamente con el alta, pero la trabajadora puede elegir otra. Lo que define si tiene cobertura son los aportes: tienen que ser iguales o mayores a los de la categoría de 16 horas semanales o más.',
      secciones: [
        {
          titulo: 'Qué obra social le corresponde',
          cuerpo: 'Según ARCA, la obra social de la actividad es la del Personal Auxiliar de Casas Particulares (OSPACP), y ANSES aclara que se asigna automáticamente. Pero la que elige es la trabajadora: el empleador solo la declara cuando la da de alta. Con los aportes al día, la cobertura es para ella y para su familia.',
          enlaces: [{ texto: 'ANSES: personal de casas particulares', url: 'https://www.anses.gob.ar/trabajo/personal-de-casas-particulares' }],
        },
        {
          titulo: 'La regla de las 16 horas',
          cuerpo: 'El régimen tiene tres categorías según las horas semanales: menos de 12, de 12 a 16, y 16 o más. Para acceder a las prestaciones, los aportes de obra social tienen que ser iguales o superiores a la cuota de la categoría de 16 horas semanales o más. Si trabaja menos horas y el aporte no llega, ANSES indica que la trabajadora puede completar la diferencia o que la puede pagar el empleador.',
        },
        {
          titulo: 'Cómo cambiar de obra social',
          cuerpo: 'Por internet, con clave fiscal nivel 3 y el servicio "Mi SSSalud" habilitado: se entra al servicio, se toca "Nueva opción" y se completan los datos. También se puede hacer en la sede o delegación de la obra social elegida. Según ARCA, el cambio se puede hacer una vez al año, y quien cambia tiene que quedarse al menos un año antes de volver a cambiar.',
          enlaces: [{ texto: 'ARCA: obra social en casas particulares', url: 'https://www.arca.gob.ar/casasparticulares/ayuda/empleador/obra-social.asp' }],
        },
        {
          titulo: 'Qué tiene que cubrir',
          cuerpo: 'ARCA enumera lo que la obra social elegida le tiene que garantizar: atención médica, internación y medicamentos. La constancia de qué obra social tiene asignada (el CODEM) se descarga desde la web de ANSES.',
        },
        {
          titulo: 'Qué le toca al empleador',
          cuerpo: 'Registrarla en ARCA, sin importar cuántas horas trabaje ni la modalidad, y pagar todos los meses los aportes y contribuciones según las horas semanales. Se pagan a mes vencido (lo trabajado el mes anterior), salvo la ART, que se paga a mes en curso. Según el Ministerio de Trabajo, quien emplea puede deducir la remuneración y los aportes del impuesto a las ganancias.',
          enlaces: [
            { texto: 'ARCA: Casas Particulares', url: 'https://www.arca.gob.ar/casasparticulares/' },
            { texto: 'Trabajo: empleadores de casas particulares', url: 'https://www.argentina.gob.ar/trabajo/casasparticulares/empleadores' },
          ],
          cta: {
            texto: '¿Buscás cobertura para tu familia? Te cotizamos las prepagas de tu zona, con 15% OFF online.',
            boton: 'Cotizar prepaga',
            href: '/comparador',
          },
        },
      ],
      conclusion: 'Registrada, la trabajadora de casas particulares tiene obra social: OSPACP por defecto o la que ella elija. Para que la cobertura funcione, el aporte tiene que llegar al de la categoría de 16 horas o más; si no llega, se puede completar la diferencia.',
    },
    faq: [
      {
        q: '¿Cuál es la obra social de la empleada doméstica?',
        a: 'La de la actividad es la Obra Social del Personal Auxiliar de Casas Particulares (OSPACP), que se asigna automáticamente. La trabajadora puede elegir otra.',
      },
      {
        q: '¿Una empleada doméstica que trabaja menos de 16 horas tiene obra social?',
        a: 'Para tener cobertura, los aportes tienen que ser iguales o mayores a los de la categoría de 16 horas semanales o más. Si son menores, la trabajadora puede completar la diferencia o la puede pagar el empleador (ANSES).',
      },
      {
        q: '¿Quién elige la obra social, la trabajadora o el empleador?',
        a: 'La trabajadora. El empleador la declara cuando la da de alta.',
      },
      {
        q: '¿Cada cuánto puede cambiar de obra social?',
        a: 'Una vez al año, y después de cambiar tiene que quedarse al menos un año en la nueva (ARCA).',
      },
      {
        q: '¿La obra social cubre a su familia?',
        a: 'Sí: según ARCA, los aportes le dan cobertura de obra social a ella y a su familia.',
      },
    ],
    keywords: ['obra social empleada domestica', 'obra social casas particulares', 'ospacp', 'empleada domestica obra social 16 horas', 'cambiar obra social empleada domestica', 'obra social servicio domestico', 'aportes obra social casas particulares'],
    relacionadas: ['opcion-de-cambio-obra-social', 'que-obra-social-tengo-codem', 'unificar-aportes-obra-social', 'derivar-obra-social-a-prepaga'],
    fuentes: [
      { texto: 'ARCA — Obra social (Casas Particulares)', url: 'https://www.arca.gob.ar/casasparticulares/ayuda/empleador/obra-social.asp' },
      { texto: 'ARCA — Aportes, contribuciones y ART: conceptos', url: 'https://www.arca.gob.ar/casasparticulares/aportes-contribuciones-ART/conceptos.asp' },
      { texto: 'ANSES — Personal de casas particulares', url: 'https://www.anses.gob.ar/trabajo/personal-de-casas-particulares' },
      { texto: 'Argentina.gob.ar — Empleadores de casas particulares', url: 'https://www.argentina.gob.ar/trabajo/casasparticulares/empleadores' },
    ],
  },
  {
    slug: 'hijos-21-a-25-anos-obra-social',
    // Pregunta textual (15-oct-2026, Search Console: 'hasta que edad cubre la obra social a los hijos', 135 impresiones)
    titulo: '¿Hasta qué edad cubre la obra social a los hijos? 21, 25 o sin límite (2026)',
    metaDescripcion: 'Según la Ley 23.660, los hijos solteros siguen en la obra social del padre o la madre hasta los 21 años, y hasta los 25 inclusive si estudian y están a su cargo. Qué pasa después y qué opciones hay.',
    tiempoLectura: 4,
    categoria: 'Trámites',
    fechaActualizacion: '2026-09-25',
    contenido: {
      intro: 'Los hijos están en la obra social del padre o la madre como parte del grupo familiar primario. La Ley 23.660 fija dos edades: hasta los 21 años, los hijos solteros; y de 21 a 25 años inclusive, los hijos solteros que estudian y están a exclusivo cargo del titular. Los hijos con discapacidad a cargo siguen cubiertos después de los 21, sin tope.',
      secciones: [
        {
          titulo: 'Qué dice la ley',
          cuerpo: 'El artículo 9 de la Ley 23.660 define el grupo familiar primario del afiliado titular: su cónyuge; los hijos solteros hasta los 21 años, no emancipados; los hijos solteros de más de 21 y hasta 25 años inclusive, a exclusivo cargo del titular, que cursen estudios regulares oficialmente reconocidos; los hijos con discapacidad a cargo del titular, mayores de 21; los hijos del cónyuge; y los menores con guarda o tutela otorgada por un juez o una autoridad administrativa.',
          enlaces: [{ texto: 'Ley 23.660 (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/0-4999/62/texact.htm' }],
        },
        {
          titulo: 'De 21 a 25: las tres condiciones',
          cuerpo: 'Para seguir cubierto después de los 21, el hijo tiene que cumplir las tres: ser soltero, estar a exclusivo cargo del titular y cursar estudios regulares oficialmente reconocidos. La obra social te va a pedir que lo acredites, en general con el certificado de alumno regular: consultá en la tuya cada cuánto lo tenés que presentar.',
        },
        {
          titulo: 'Qué pasa a los 21 (si no estudia) o a los 26',
          cuerpo: 'Deja de ser parte del grupo familiar primario y sale de la cobertura del titular. Si trabaja en relación de dependencia, tiene su propia obra social con sus aportes, y puede elegir otra con la opción de cambio. Si es monotributista, la cuota del monotributo incluye la obra social. Si no trabaja, la alternativa es un plan particular de prepaga.',
          cta: {
            texto: 'A esa edad los planes de prepaga están entre los más baratos de la lista. Te cotizamos online con 15% OFF.',
            boton: 'Cotizar plan joven',
            href: '/comparador',
          },
        },
        {
          titulo: 'Hijos con discapacidad',
          cuerpo: 'La ley los incluye después de los 21 años sin fijar un tope: los hijos con discapacidad que están a cargo del titular siguen en el grupo familiar.',
        },
        {
          titulo: 'Otros familiares a cargo',
          cuerpo: 'La Superintendencia de Servicios de Salud puede autorizar que se sumen otros ascendientes o descendientes por consanguinidad que estén a cargo del titular, como padres o nietos. Por cada persona que se incluye se paga un aporte adicional del 1,5%.',
        },
      ],
      conclusion: 'Hasta los 21 años, los hijos solteros están cubiertos por la obra social del padre o la madre. De 21 a 25 inclusive, solo si estudian y están a cargo. Después, cada uno necesita su propia cobertura: la obra social de su trabajo, la del monotributo o un plan de prepaga. En un plan de prepaga particular, las condiciones para los hijos las fija el contrato.',
    },
    faq: [
      {
        q: '¿Hasta qué edad un hijo puede estar en la obra social de sus padres?',
        a: 'Hasta los 21 años si es soltero; hasta los 25 inclusive si además estudia y está a exclusivo cargo del titular. Los hijos con discapacidad a cargo, sin tope de edad.',
      },
      {
        q: '¿Qué necesita un hijo de 21 a 25 para seguir en la obra social?',
        a: 'Ser soltero, estar a exclusivo cargo del titular y cursar estudios regulares oficialmente reconocidos (Ley 23.660, artículo 9).',
      },
      {
        q: '¿Qué pasa si mi hijo empieza a trabajar?',
        a: 'En relación de dependencia pasa a tener su propia obra social con sus aportes. La ley excluye del grupo familiar a los hijos menores de 21 emancipados por ejercer una actividad profesional, comercial o laboral, y de 21 a 25 exige que estén a exclusivo cargo del titular.',
      },
      {
        q: '¿Los hijos de mi pareja pueden estar en mi obra social?',
        a: 'Sí: la ley incluye a los hijos del cónyuge en el grupo familiar primario.',
      },
      {
        q: '¿Puedo sumar a mis padres a la obra social?',
        a: 'La Superintendencia puede autorizar ascendientes que estén a tu cargo, con un aporte adicional del 1,5% por persona.',
      },
    ],
    keywords: ['hijos 21 a 25 años obra social', 'hasta que edad un hijo puede estar en la obra social', 'hijo estudiante obra social 25 años', 'obra social hijos mayores de 21', 'grupo familiar primario obra social', 'ley 23660 articulo 9'],
    relacionadas: ['afiliar-recien-nacido-prepaga', 'discapacidad-obra-social-cobertura-100', 'opcion-de-cambio-obra-social', 'edad-maxima-afiliarse-prepaga'],
    fuentes: [
      { texto: 'Ley 23.660 de Obras Sociales, texto actualizado (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/0-4999/62/texact.htm' },
    ],
  },
  {
    slug: 'divorcio-obra-social',
    titulo: 'Divorcio y obra social: qué pasa con la cobertura y cómo desunificar aportes (2026)',
    metaDescripcion: 'Con el divorcio, tu ex deja de ser parte de tu grupo familiar en la obra social (Ley 23.660). Si habían unificado aportes, se pide la desunificación ante la Superintendencia con la sentencia. Papeles y vías.',
    tiempoLectura: 4,
    categoria: 'Trámites',
    fechaActualizacion: '2026-09-25',
    contenido: {
      intro: 'Con el divorcio cambian dos cosas en la obra social. Tu ex deja de ser parte de tu grupo familiar, porque la Ley 23.660 cubre al cónyuge del titular. Y si habían unificado aportes, cada uno puede volver a la obra social de su actividad con la desunificación de aportes, un trámite ante la Superintendencia de Servicios de Salud que se hace online, con turno o por correo.',
      secciones: [
        {
          titulo: 'Tu ex deja de ser familiar a cargo',
          cuerpo: 'El grupo familiar primario de la Ley 23.660 incluye al cónyuge del afiliado titular. Con la sentencia de divorcio, tu ex deja de ser cónyuge y, con eso, familiar a cargo en tu obra social: avisale a tu obra social. Si tu ex trabaja en relación de dependencia, tiene su propia obra social con sus aportes; si no, va a necesitar su propia cobertura.',
          cta: {
            texto: 'Si te quedaste sin cobertura, te cotizamos un plan individual en tu zona, con 15% OFF online.',
            boton: 'Cotizar plan individual',
            href: '/comparador',
          },
        },
        {
          titulo: 'Los hijos siguen cubiertos',
          cuerpo: 'Los hijos siguen en el grupo familiar del padre o la madre titular, con los límites de edad de la ley: solteros hasta los 21 años, hasta los 25 inclusive si estudian y están a cargo, y sin tope si tienen una discapacidad y están a cargo.',
        },
        {
          titulo: 'Si habían unificado aportes: la desunificación',
          cuerpo: 'Con la desunificación, separás tus aportes de los de tu cónyuge o concubino y volvés al agente del seguro de tu actividad. Papeles: el formulario de desunificación (se descarga de la página del trámite), fotocopias del DNI de los dos, certificación laboral de tu empleador actual (hay un modelo) o fotocopia del recibo de sueldo, la sentencia de divorcio y el certificado del vínculo (matrimonio o concubinato). La Superintendencia puede pedirte documentación extra.',
          enlaces: [{ texto: 'Solicitar desunificación de aportes', url: 'https://www.argentina.gob.ar/servicio/solicitar-desunificacion-de-aportes' }],
        },
        {
          titulo: 'Cómo presentarlo',
          cuerpo: 'Elegí una sola vía. Online, por Trámites a Distancia (TAD), con usuario de ARCA o de Mi Argentina. Con turno, que se pide online con Mi Argentina o al 0800-222-72583. O por correo postal, a la sede central de la Superintendencia (Bartolomé Mitre 434, planta baja, CABA, C1035AAN) o a la delegación más cercana a tu domicilio.',
        },
        {
          titulo: 'Si eran concubinos',
          cuerpo: 'La ley también cubre a quien convive con el titular y recibe de él trato familiar. Si se separan, en lugar de la sentencia de divorcio se presenta la anulación de la certificación de concubinato.',
        },
        {
          titulo: 'Después: otra obra social o una prepaga',
          cuerpo: 'Con los aportes separados, cada uno puede hacer la opción de cambio (una vez cada 365 días) y elegir otra obra social o una prepaga inscripta como agente del seguro, pagando la diferencia.',
          cta: {
            texto: 'La calculadora te dice cuánto cubren tus aportes y cuánto pagarías de diferencia en cada plan.',
            boton: 'Calcular mi diferencia',
            href: '/calculadora-aportes',
          },
        },
      ],
      conclusion: 'El divorcio saca a tu ex de tu grupo familiar en la obra social, y los hijos siguen cubiertos. Si habían unificado aportes, pedí la desunificación con la sentencia de divorcio por TAD, con turno o por correo, y después elegí con qué cobertura seguís.',
    },
    faq: [
      {
        q: '¿Mi ex sigue en mi obra social después del divorcio?',
        a: 'No como familiar a cargo: la Ley 23.660 cubre al cónyuge del titular, y con el divorcio deja de serlo.',
      },
      {
        q: '¿Qué pasa con los hijos en la obra social después del divorcio?',
        a: 'Siguen cubiertos como hijos del titular, con los límites de edad de la ley (21 años, o 25 si estudian y están a cargo).',
      },
      {
        q: '¿Cómo desunifico los aportes?',
        a: 'Completás el formulario de desunificación y lo presentás con los DNI, la certificación laboral o el recibo de sueldo, la sentencia de divorcio y el certificado del vínculo, por TAD, con turno o por correo a la Superintendencia de Servicios de Salud.',
      },
      {
        q: '¿Y si éramos concubinos?',
        a: 'Se presenta la anulación de la certificación de concubinato en lugar de la sentencia de divorcio.',
      },
      {
        q: '¿Después de desunificar puedo pasarme a una prepaga?',
        a: 'Sí, con la opción de cambio (una vez cada 365 días), a una prepaga inscripta como agente del seguro, pagando la diferencia.',
      },
    ],
    keywords: ['divorcio obra social', 'desunificacion de aportes', 'obra social despues del divorcio', 'ex conyuge obra social', 'separacion obra social', 'desunificar aportes obra social'],
    relacionadas: ['unificar-aportes-obra-social', 'hijos-21-a-25-anos-obra-social', 'opcion-de-cambio-obra-social', 'sin-trabajo-obra-social'],
    fuentes: [
      { texto: 'Argentina.gob.ar — Solicitar desunificación de aportes', url: 'https://www.argentina.gob.ar/servicio/solicitar-desunificacion-de-aportes' },
      { texto: 'Ley 23.660 de Obras Sociales, texto actualizado (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/0-4999/62/texact.htm' },
    ],
  },
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
          cuerpo: 'Pedí la baja de la anterior coordinando la fecha de efecto con el alta de la nueva. La ley prevé un aviso fehaciente con 30 días de anticipación y cada prepaga tiene su fecha de corte: por ejemplo, en Swiss Medical el día 5 de cada mes, en Avalian el día 10, y en OSDE la baja rige desde el día del trámite. La baja se puede pedir online: desde 2019 las prepagas deben ofrecer un "botón de baja" en su web, y si contrataste a distancia podés rescindir por el mismo medio. Mirá la guía de baja de tu prepaga para el paso a paso.',
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
    relacionadas: ['como-dar-de-baja-prepaga-u-obra-social', 'prepaga-sin-periodo-carencia', 'como-afiliarse-prepaga-requisitos'],
    prepagasRelacionadas: ['swiss-medical', 'osde', 'sancor-salud'],
  },
  {
    slug: 'obra-social-vs-prepaga',
    // Search Console (sept 2026): "prepaga y obra social es lo mismo" y
    // "obra social y prepaga es lo mismo" son las búsquedas que más la traen.
    titulo: '¿Obra social y prepaga es lo mismo? Diferencias y cuál conviene (2026)',
    metaDescripcion: 'Comparamos obra social y prepaga en Argentina: diferencias, costos, cobertura y cuándo conviene cada una. Tomá la mejor decisión para tu salud.',
    tiempoLectura: 10,
    categoria: 'Comparativas',
    fechaActualizacion: '2026-10-03',
    contenido: {
      intro: 'No, no son lo mismo. La obra social se paga con los aportes de tu sueldo (o del monotributo) y la prepaga, con una cuota que depende de tu edad y del plan. Las dos tienen que cubrir el mismo piso, el Programa Médico Obligatorio, y se pueden combinar: si trabajás en relación de dependencia, podés derivar tus aportes a una prepaga y pagar solo la diferencia. En la práctica la línea se volvió difusa (OSDE, por ejemplo, está inscripta como obra social y compite con prepagas como Swiss Medical), pero entender la diferencia te puede ahorrar mucha plata por mes.',
      secciones: [
        {
          titulo: 'La diferencia de fondo: solidaria vs privada',
          cuerpo: 'Las obras sociales se financian con aportes obligatorios del salario (3% del trabajador + 6% del empleador) y deben aceptar a todos los trabajadores de su actividad. Las prepagas son empresas privadas: pagás una cuota de bolsillo y el precio depende de tu edad y del plan. Ambas están obligadas a cubrir el mismo piso: el Programa Médico Obligatorio (PMO). La diferencia está en todo lo que va por encima de ese piso: cartilla, sanatorios, tiempos de espera y confort.',
        },
        {
          titulo: 'La tercera vía: derivar aportes a una prepaga',
          cuerpo: 'Si trabajás en relación de dependencia, podés derivar tus aportes de obra social a una prepaga: tus contribuciones se descuentan del precio del plan y además el precio "deriva aporte" no paga el IVA (10,5%) que paga la contratación directa. Cuánto ahorrás depende de tu sueldo: cuanto más alto, más grande el aporte que se descuenta de la cuota.',
        },
        {
          titulo: 'Cuándo conviene quedarse en la obra social',
          cuerpo: `Si tu obra social sindical tiene buena cartilla en tu zona y usás el sistema poco (consultas de rutina, alguna urgencia), pagar una prepaga puede ser plata tirada: ya estás cubierto con tus aportes sin costo extra. También conviene si tu sueldo es bajo: el aporte es proporcional al salario, mientras que la cuota de una prepaga es fija y, según las listas oficiales de ${MES}, la más baja del mercado es de ${DESDE} por persona a los 30 años (${DESDE_PLAN}).`,
        },
        {
          titulo: 'Cuándo conviene pasarse a una prepaga',
          cuerpo: 'Conviene cuando necesitás especialistas con turnos rápidos, sanatorios de primer nivel (Alemán, Italiano, Austral, Trinidad), cobertura fuerte en salud mental, o tenés hijos y querés pediatría sin demoras. También si sos monotributista con una obra social de baja calidad: la diferencia de servicio entre una obra social saturada y una prepaga media es enorme en tiempos de espera y acceso a estudios complejos.',
        },
        {
          titulo: 'Los números de 2026',
          cuerpo: `Según las listas oficiales de ${MES} (a los 30 años, CABA y GBA, con IVA): la cuota más baja del mercado es de ${DESDE} (${DESDE_PLAN}) y ya cubre el PMO completo. Un plan medio sin copago, como el SMG20 de Swiss Medical, sale ${lista('swiss-medical', 'smg20')}; uno de los más completos, como el OSDE 410, ${lista('osde', '410')}. Contra eso, la obra social ya la pagás con tus aportes. La pregunta correcta no es cuál es mejor en abstracto, sino cuánto valorás el acceso rápido y la cartilla.`,
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
    keywords: ['obra social vs prepaga', 'diferencia obra social prepaga', 'derivar aportes prepaga', 'que conviene obra social o prepaga', 'prepaga vs obra social argentina', 'diferencia prepaga obra social', 'obra social o prepaga cual conviene', 'tener prepaga y obra social al mismo tiempo'],
    relacionadas: ['que-obra-social-tengo-codem', 'derivar-obra-social-a-prepaga', 'prepagas-para-monotributistas', 'que-cubre-la-prepaga'],
    prepagasRelacionadas: ['osde', 'galeno', 'sancor-salud'],
  },
  {
    // 27-sep-2026: la guía suma el buscador "¿Qué me cubre la prepaga?"
    // (components/herramientas/QueCubreSeccion.tsx) y se reescribió con los
    // textos oficiales del PMO y las leyes (lib/data/que-cubre.ts). Se
    // corrigieron: fertilización (son 3 tratamientos de alta complejidad en
    // total, no por año: Decreto 956/2013, art. 8) y salud mental (el PMO fija
    // un piso de 30 consultas por año, no "sin límite").
    slug: 'que-cubre-la-prepaga',
    titulo: '¿Qué cubre la prepaga? Buscador de coberturas por ley y por plan (2026)',
    metaDescripcion: 'Buscá psicólogo, ortodoncia, anteojos, fertilización o lo que necesites: si la prepaga lo cubre por ley, con qué porcentaje o límite y qué planes lo incluyen, con la norma oficial.',
    tiempoLectura: 12,
    categoria: 'Cobertura',
    fechaActualizacion: '2026-09-27',
    contenido: {
      intro: 'Toda prepaga tiene que cubrir, como mínimo, el Programa Médico Obligatorio (PMO) y las prestaciones para personas con discapacidad de la Ley 24.901, en todos sus planes, del más barato al más caro (Ley 26.682, art. 7). Además, hay leyes que suman prestaciones obligatorias: fertilización, diabetes, celiaquía, vasectomía y ligadura, autismo, VIH y más. Lo que no está en ninguna norma es superador y depende del plan. Buscá la práctica que necesitás y mirá en qué grupo cae.',
      secciones: [
        {
          titulo: 'Atención básica: consultas, estudios e internación',
          cuerpo: 'El PMO cubre la consulta con médicos de todas las especialidades reconocidas, los estudios y prácticas de su Anexo II (con el material descartable y los medios de contraste incluidos) y el diagnóstico por imágenes, tomografía y resonancia incluidas. La internación se cubre al 100% y sin límite de tiempo, en sanatorio, hospital de día o domicilio, salvo en salud mental, que tiene su propio tope. Los traslados son parte de la prestación. Según el plan, puede haber copago en consultas y estudios.',
        },
        {
          titulo: 'Medicamentos: 40%, 70% y 100%',
          cuerpo: 'El piso es el 40% en los medicamentos ambulatorios del formulario del PMO y el 70% en los de enfermedades crónicas que se toman de modo permanente, siempre sobre un precio de referencia (Resolución 310/2004). Es del 100% durante la internación, en los oncológicos según protocolo y en la eritropoyetina para la insuficiencia renal crónica, y en diabetes la Ley 23.753 fija el 100% de los medicamentos y las tiras de autocontrol. Muchas prepagas mejoran estos pisos como diferencial comercial: Luis Pasteur, por ejemplo, cubre 60% en farmacia desde su plan base.',
        },
        {
          titulo: 'Embarazo, parto y primer año: cobertura al 100%',
          cuerpo: 'El embarazo, desde el diagnóstico hasta el primer mes después del parto, y el bebé hasta que cumple un año tienen cobertura del 100% en internación y en consultorio, sin coseguros: controles, estudios del embarazo, psicoprofilaxis, el parto, la medicación relacionada, las vacunas y la pesquisa neonatal. La Ley de Parto Respetado, que también es parte del PMO, suma derechos como estar acompañada por una persona de tu elección y la internación conjunta con tu bebé.',
        },
        {
          titulo: 'Salud mental, discapacidad y tratamientos especiales',
          cuerpo: 'En salud mental, el piso del PMO es de hasta 30 consultas ambulatorias por año calendario (hasta 4 por mes) y de hasta 30 días de internación por año para cuadros agudos; la reglamentación de la Ley de Salud Mental ordena adecuar esa cobertura a los principios de la ley. Kinesiología y fonoaudiología: hasta 25 sesiones por año cada una. La discapacidad tiene cobertura total (Ley 24.901), y son obligatorias la fertilización asistida (Ley 26.862), la diabetes (Ley 23.753), la celiaquía (Ley 26.588), la obesidad y los trastornos alimentarios (Ley 26.396), el autismo (Ley 27.043), el VIH y las hepatitis (Ley 27.675) y los tratamientos oncológicos, entre otras.',
        },
        {
          titulo: 'Qué NO cubre el PMO (y dónde las prepagas se diferencian)',
          cuerpo: 'Quedan fuera del piso obligatorio: la cirugía estética sin indicación médica, la ortodoncia, los implantes dentales, los anteojos para adultos, la habitación individual, la cobertura en el exterior y los reintegros por profesionales fuera de cartilla. Justamente ahí compiten los planes: cuando pagás un plan medio o alto, estás pagando estas prestaciones superadoras más la calidad de la red. Al comparar planes, mirá esta capa: el piso legal es idéntico en todos.',
        },
        {
          titulo: 'Qué hacer si te niegan algo del PMO',
          cuerpo: 'Pedí la negativa por escrito, reuní la indicación médica y presentá un reclamo formal ante la prepaga. Si no responden o insisten, denunciá ante la Superintendencia de Servicios de Salud (SSSalud) al 0800-222-72583 o en sssalud.gob.ar: es gratuito, no necesitás abogado y las empresas suelen revertir la negativa apenas la SSSalud interviene. Para urgencias médicas existe además el recurso de amparo judicial.',
          cta: { texto: '¿Querés un plan con más cobertura que el piso legal? Te decimos cuáles incluyen lo que necesitás y cuánto salen para tu edad.', boton: 'Cotizar', href: '/comparador' },
        },
      ],
      conclusion: 'El PMO es tu piso de derechos: ninguna prepaga puede cubrir menos, ni siquiera en el plan más barato. Las diferencias reales entre planes están por encima de ese piso. Si te niegan una prestación obligatoria, pedí la respuesta por escrito y reclamá: primero ante la prepaga y, si no se resuelve, ante la SSSalud.',
    },
    faq: [
      {
        q: '¿El plan más barato cubre menos que el más caro?',
        a: 'En prestaciones obligatorias (PMO y leyes especiales), no: todos los planes tienen que cubrirlas (Ley 26.682, art. 7). Las diferencias están en copagos, cartilla, habitación individual, reintegros y prestaciones superadoras como ortodoncia o cirugía estética.',
      },
      {
        q: '¿La prepaga puede negarme un estudio de alta complejidad?',
        a: 'La tomografía y la resonancia están en el PMO. La prepaga puede pedir una autorización previa con la orden de tu médico; si te lo niega, pedí la respuesta por escrito y reclamá ante la SSSalud.',
      },
      {
        q: '¿Cuántas sesiones de psicólogo cubre la prepaga?',
        a: 'El piso del PMO es de hasta 30 consultas ambulatorias de salud mental por año calendario, con un máximo de 4 por mes (Res. 201/2002, Anexo I, punto 4.3). Hay planes que cubren más o sin copago: Swiss Medical, por ejemplo, cubre 30 sesiones sin cargo por año del SMG20 al SMG60 y 36 en el SMG70, según su comparativo oficial de julio de 2026.',
      },
      {
        q: '¿Las prepagas cubren tratamientos de fertilidad?',
        a: 'Sí, la Ley 26.862 obliga a cubrir la reproducción médicamente asistida, incluida la medicación. Por persona: hasta 4 tratamientos de baja complejidad por año y hasta 3 de alta complejidad, con al menos 3 meses entre uno y otro, y antes de la alta complejidad van como mínimo 3 intentos de baja, salvo causa médica (Decreto 956/2013, art. 8).',
      },
      {
        q: '¿La prepaga cubre anteojos?',
        a: 'Para chicos de hasta 15 años, sí: anteojos con lentes estándar al 100% (PMO, punto 8.3.2). Para adultos depende del plan: Swiss Medical, por ejemplo, cubre un par de anteojos o lentes de contacto por año en todos sus planes estándar salvo el SMG02.',
      },
    ],
    keywords: ['que cubre la prepaga', 'que cubre una prepaga', 'que no cubre la prepaga', 'la prepaga cubre', 'buscador de coberturas prepaga', 'prepaga me niega cobertura'],
    relacionadas: ['como-reclamar-a-una-prepaga', 'copago-en-prepagas-que-es', 'reintegros-en-prepagas'],
    fuentes: [
      { texto: 'PMO: Resolución 201/2002 del Ministerio de Salud, Anexo I — Infoleg', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/70000-74999/73649/res201-2002MS-anexoI.htm' },
      { texto: 'Resolución 310/2004 (medicamentos) — Infoleg', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/90000-94999/94218/norma.htm' },
      { texto: 'Ley 26.682 (texto actualizado) — Infoleg', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
      { texto: 'Ley 24.754 — Infoleg', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/40000-44999/41166/norma.htm' },
      { texto: 'Decreto 956/2013 (fertilización) — Infoleg', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/215000-219999/217628/norma.htm' },
      { texto: 'Decreto 603/2013 (salud mental) — Infoleg', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/215000-219999/215485/texact.htm' },
    ],
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
    slug: 'cuota-prepaga-por-edad',
    // 3-oct-2026: los porcentajes y precios aproximados ("un joven de 22 paga
    // 10-20% menos", "los hijos pagan entre el 40% y el 70%") no coincidían
    // con las listas oficiales. Ahora los números salen de los cuadros de la
    // SSSalud y cambian solos cada mes.
    titulo: '¿Cuánto sube la prepaga con la edad? Precios oficiales por edad 2026',
    metaDescripcion: 'Cuánto sube la cuota de la prepaga con la edad según las listas oficiales: en qué edades cambia el precio de cada plan, ejemplos de Swiss Medical, OSDE y Sancor Salud, y qué dice la ley después de los 65.',
    tiempoLectura: 6,
    categoria: 'Precios',
    fechaActualizacion: '2026-10-03',
    contenido: {
      intro: 'La edad es lo que más pesa en el precio de una prepaga: el mismo plan puede costar el doble o el triple según cuántos años tengas. Cada prepaga declara ante la Superintendencia de Servicios de Salud un precio por franja de edad, y las franjas cambian de una a otra. Entenderlas te permite anticipar cuánto vas a pagar y aprovechar la regla que casi nadie conoce: la antigüedad te protege de los aumentos por edad.',
      secciones: [
        {
          titulo: 'Cómo funcionan las franjas de edad',
          cuerpo: `Las franjas no son iguales en todas las prepagas, ni siquiera en todos los planes de una misma empresa. Según las listas oficiales de ${MES}, el SMG20 de Swiss Medical cambia de precio a los ${cortes('swiss-medical', 'smg20')} años; el Plan 3000 de Sancor Salud, a los ${cortes('sancor-salud', 'plan-3000')}; y el 310 de OSDE solo a los ${cortes('osde', '310')}. Después de la última franja, el precio ya no sube por edad: solo por los aumentos generales de cada mes.`,
        },
        {
          titulo: 'La protección legal que tenés que conocer',
          cuerpo: 'La Ley 26.682 establece que los mayores de 65 años con 10 o más años de antigüedad continua en la misma prepaga no pueden sufrir aumentos por razón de edad. Traducción práctica: si contratás a los 50 y te quedás, a los 65 tu cuota solo sube por los ajustes generales de precios, no por envejecer. Es el argumento más fuerte para elegir bien una vez y construir antigüedad.',
        },
        {
          titulo: 'Cuánto sube un mismo plan con la edad',
          cuerpo: `Precios de lista oficiales de ${MES} (CABA y GBA, contratación directa, IVA incluido). El SMG20 de Swiss Medical sale ${lista('swiss-medical', 'smg20', 30)} a los 30 años, ${lista('swiss-medical', 'smg20', 40)} a los 40, ${lista('swiss-medical', 'smg20', 50)} a los 50 y ${lista('swiss-medical', 'smg20', 61)} desde los ${ultimoCorte('swiss-medical', 'smg20')}. El Plan 3000 de Sancor Salud: ${lista('sancor-salud', 'plan-3000', 30)} a los 30, ${lista('sancor-salud', 'plan-3000', 40)} a los 40, ${lista('sancor-salud', 'plan-3000', 50)} a los 50, ${lista('sancor-salud', 'plan-3000', 60)} a los 60 y ${lista('sancor-salud', 'plan-3000', 70)} a los 70. El 310 de OSDE: ${lista('osde', '310', 25)} a los 25, ${lista('osde', '310', 30)} a los 30 y ${lista('osde', '310', 40)} desde los ${ultimoCorte('osde', '310')}. Cotizando online tenés 15% OFF sobre estos valores.`,
        },
        {
          titulo: 'Estrategias para pagar menos a cualquier edad',
          cuerpo: `Primero: derivá aportes si podés; el descuento del IVA y de tus contribuciones aplica a toda edad. Segundo: entrá joven y no cortes la afiliación; la continuidad es tu activo. Tercero: fijate a qué edad deja de subir cada plan: en el 310 de OSDE el precio es el mismo desde los ${ultimoCorte('osde', '310')} y en el SMG20 de Swiss Medical, desde los ${ultimoCorte('swiss-medical', 'smg20')}. Cuarto: si sos jubilado, podés mantener PAMI y sumar una prepaga para tener turnos e internación en sanatorios privados.`,
        },
      ],
      conclusion: 'La edad define tu precio de entrada, pero la antigüedad define tu precio futuro: quien construye 10 años de continuidad llega a los 65 protegido por ley contra los aumentos por edad. Si estás por cumplir una edad en la que cambia la franja (por ejemplo, 36), cotizá con la edad que vas a tener: la cuota cambia al cumplirla.',
    },
    faq: [
      {
        q: '¿La prepaga puede aumentarme la cuota cuando cumplo años?',
        a: 'Sí, cuando pasás a otra de las franjas de edad que la prepaga declara ante la Superintendencia (en muchos planes, por ejemplo, a los 36). La excepción: si tenés más de 65 años y 10 o más de antigüedad en la misma prepaga, la Ley 26.682 no permite aumentos por edad.',
      },
      {
        q: '¿Hay prepagas que acepten personas mayores de 70?',
        a: `Sí. La ley no permite rechazarte por la edad; lo que cambia es el precio. Según las listas oficiales de ${MES}, a los 70 años el SMG20 de Swiss Medical sale ${lista('swiss-medical', 'smg20', 70)} y el 310 de OSDE, ${lista('osde', '310', 70)}. En la guía de prepagas para mayores de 60 tenés el precio de cada prepaga a los 60, 65 y 70 años.`,
      },
      {
        q: '¿Los hijos pagan lo mismo que los adultos en un plan familiar?',
        a: `Depende de la prepaga. En la lista oficial de OSDE, los menores de 28 pagan menos (en el 310, ${lista('osde', '310', 10)} contra ${lista('osde', '310', 30)} a los 30), y en el Plan 300 de Premedic, los menores de 30. En otras, como el SMG20 de Swiss Medical o el Plan Bronce de Medifé, un chico paga lo mismo que un adulto de hasta 35 años.`,
      },
    ],
    keywords: ['precio prepaga por edad', 'cuanto sube la prepaga con la edad', 'prepaga mayores 60', 'bandas etarias prepagas'],
    relacionadas: ['prepaga-para-mayores-60', 'prepagas-economicas', 'edad-maxima-afiliarse-prepaga', 'afiliar-recien-nacido-prepaga'],
  },
  {
    slug: 'como-reclamar-a-una-prepaga',
    titulo: 'Cómo reclamar a una prepaga: guía de derechos 2026',
    metaDescripcion: 'Conocé tus derechos como afiliado y cómo hacer una queja o reclamo efectivo a tu prepaga ante la Superintendencia de Servicios de Salud.',
    tiempoLectura: 8,
    categoria: 'Derechos',
    fechaActualizacion: '2026-09-24',
    contenido: {
      intro: 'Negativa de cobertura, demoras en autorizaciones, aumentos mal aplicados, cartilla que no coincide con la prometida: los motivos de reclamo contra las prepagas son siempre los mismos, y la mayoría se resuelve a favor del afiliado cuando el reclamo se hace bien. La clave es escalar en el orden correcto y dejar todo por escrito.',
      secciones: [
        {
          titulo: 'Paso 1: reclamo formal ante la prepaga',
          cuerpo: 'Todo reclamo empieza en la propia empresa, pero no por teléfono: usá los canales que dejan constancia (formulario web, mail, carta con acuse). Describí el problema, adjuntá la indicación médica si es una negativa de cobertura, y pedí respuesta por escrito con número de reclamo. Guardá todo. Si la respuesta es negativa o no llega en un plazo razonable (10-15 días), pasá al siguiente nivel con ese expediente como prueba.',
        },
        {
          titulo: 'Paso 2: denuncia ante la SSSalud',
          cuerpo: 'La Superintendencia de Servicios de Salud controla a prepagas y obras sociales, y recibe denuncias por negativa de afiliación, por problemas de cobertura, por aumentos indebidos de cuota por edad y por prestaciones de discapacidad. Es gratis y no necesitás abogado. Para una denuncia por cobertura, completá y firmá el formulario de denuncia y sumá: DNI del titular y del grupo familiar, la credencial, la prescripción médica actualizada, un resumen de historia clínica y la justificación del médico tratante, más tu último recibo de sueldo o la última factura de la prepaga (o el pago del monotributo, según tu caso). Se presenta online por Trámites a Distancia (TAD) con tu usuario de ARCA o de Mi Argentina, con turno en la sede central o en una delegación (se pide online o al 0800-222-72583), o por correo postal. Los plazos y las sanciones los fija la Resolución 951/2025 de la SSSalud.',
          enlaces: [{ texto: 'Denuncia por problemas de cobertura (SSSalud)', url: 'https://www.argentina.gob.ar/servicio/denuncia-por-problematicas-de-cobertura-prestacional' }],
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
        a: 'Los plazos del expediente los fija la Resolución 951/2025 de la Superintendencia. Podés seguir el estado de tu denuncia en "Mis Expedientes", en la web de la SSSalud. Para urgencias médicas no esperes este circuito: el amparo judicial con medida cautelar es la vía correcta y resuelve en días.',
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
    keywords: ['como reclamar a una prepaga', 'denuncia sssalud prepaga', 'prepaga me niega cobertura que hacer', 'amparo salud prepaga', 'como reclamar prepaga argentina', 'prepaga nego prestacion que hacer', 'superintendencia servicios salud reclamo', 'derechos afiliados prepaga'],
    relacionadas: ['que-cubre-la-prepaga', 'como-dar-de-baja-prepaga-u-obra-social', 'como-pedir-autorizacion-prepaga'],
    fuentes: [
      { texto: 'Argentina.gob.ar — Denuncia por problemáticas de cobertura prestacional', url: 'https://www.argentina.gob.ar/servicio/denuncia-por-problematicas-de-cobertura-prestacional' },
      { texto: 'Superintendencia de Servicios de Salud — Usuarios: denuncias', url: 'https://www.argentina.gob.ar/sssalud/usuarios' },
    ],
  },
  {
    slug: 'como-pedir-autorizacion-prepaga',
    titulo: 'Cómo pedir autorización a la prepaga: guía completa 2026',
    metaDescripcion: 'Qué estudios y cirugías necesitan autorización previa, cómo pedirla online desde la app o el portal de tu prepaga, cuánto tarda y qué hacer si te la niegan.',
    tiempoLectura: 7,
    categoria: 'Trámites',
    fechaActualizacion: '2026-09-19',
    contenido: {
      intro: 'La autorización previa (también llamada "auditoría médica") es el trámite que más dudas genera una vez que ya sos afiliado: no sabés si tu estudio la necesita, cómo pedirla, ni cuánto vas a tener que esperar. La buena noticia es que hoy casi todo se resuelve online, en minutos, y hay reglas claras (y una ley de tu lado) para lo que tarda más de la cuenta.',
      secciones: [
        {
          titulo: 'Qué es la autorización y para qué sirve',
          cuerpo: 'Es el control que hace la prepaga antes de cubrir una prestación de mayor costo o complejidad: confirma que el estudio o la cirugía que pidió tu médico está indicado, corresponde a tu plan y entra dentro de lo que la empresa va a pagar. No es un trámite para "decidir si te atienden": si la indicación médica es correcta y la prestación forma parte del PMO, la autorización es un paso administrativo, no una segunda opinión que pueda negarte algo obligatorio.',
        },
        {
          titulo: 'Qué necesita autorización previa (y qué no)',
          cuerpo: 'Por lo general piden autorización: cirugías programadas, internaciones que no son de urgencia, estudios de alta complejidad (resonancias, tomografías, estudios genéticos), medicación de alto costo, prótesis y tratamientos prolongados (kinesiología, salud mental, discapacidad). NO necesitás autorización para: consultas médicas, análisis de rutina de baja complejidad, y nunca para una urgencia real — ahí la autorización es posterior, entre el sanatorio y la empresa, nunca una condición para atenderte.',
        },
        {
          titulo: 'Cómo pedirla online, paso a paso',
          cuerpo: 'Todas las prepagas grandes tienen el trámite digitalizado: en OSDE es desde la app o el sitio, en la sección "Trámites → Autorizar una prestación"; en Swiss Medical desde el portal de Autorizaciones o la app; el resto de las empresas (Sancor Salud, Galeno, Medifé, Avalian) tiene circuitos equivalentes en su portal de afiliados. En general subís la orden médica escaneada o fotografiada, indicás la prestación y el prestador donde te la vas a hacer, y el sistema te da una respuesta o un número de trámite para seguir el estado.',
        },
        {
          titulo: 'Cuánto tarda',
          cuerpo: 'Las autorizaciones simples (un estudio de rutina, una práctica ambulatoria) suelen resolverse en el momento o dentro de las 24 a 48 horas. Las cirugías programadas y las prestaciones de mayor complejidad pueden tardar más: como regla general, conviene iniciar el trámite con al menos 72 horas de anticipación a la fecha del turno o la cirugía para no quedarte sin margen si piden algún dato adicional.',
        },
        {
          titulo: 'Qué hacer si te la niegan o no responden',
          cuerpo: 'Si la prestación es parte del PMO y tenés indicación médica, la prepaga no puede negarla: puede auditarla, pero no rechazarla sin fundamento. Si te dicen que no, o simplemente no te contestan, pedí la negativa por escrito (mail o número de reclamo) y hacé la denuncia en sssalud.gob.ar — la mayoría de estos casos se revierten en esa instancia sin necesidad de llegar a la justicia. Para el detalle completo del circuito de reclamo, ver la guía de cómo reclamar a una prepaga.',
        },
      ],
      conclusion: 'El 90% de las autorizaciones hoy se resuelven online y sin drama: la clave es pedirla con anticipación (72 horas para lo programado), guardar el número de trámite, y saber que si la prestación es del PMO, la ley está de tu lado si te la niegan sin motivo.',
    },
    faq: [
      { q: '¿Necesito autorización para una consulta médica?', a: 'No. Las consultas con especialistas de cartilla no requieren autorización previa en ninguna prepaga; solo necesitás la orden si tu plan lo pide para reintegro.' },
      { q: '¿Cuánto tarda la autorización de una cirugía programada?', a: 'Varía según la prepaga y la complejidad, pero como referencia conviene iniciar el trámite con al menos 72 horas de anticipación. Las cirugías de mayor complejidad o con insumos especiales pueden tardar más.' },
      { q: '¿Puedo pedir la autorización desde la app de mi prepaga?', a: 'Sí, todas las prepagas grandes (OSDE, Swiss Medical, Sancor Salud, Galeno, Medifé) tienen el trámite digitalizado desde su app o portal de afiliados: subís la orden médica y el sistema te da una respuesta o un número de seguimiento.' },
      { q: '¿Qué pasa si me hago un estudio sin la autorización correspondiente?', a: 'Corrés el riesgo de que la prepaga no lo reconozca y tengas que pagarlo particular, salvo que sea una urgencia real (ahí la autorización se tramita después). Por eso conviene siempre confirmar antes si tu estudio la necesita.' },
    ],
    keywords: ['como pedir autorizacion prepaga', 'autorizacion online prepaga', 'codigo de autorizacion prepaga', 'cuanto tarda la autorizacion de una cirugia', 'que estudios necesitan autorizacion prepaga', 'autorizar una prestacion osde'],
    relacionadas: ['como-reclamar-a-una-prepaga', 'urgencias-guardia-prepaga', 'reintegros-en-prepagas', 'que-cubre-la-prepaga'],
    prepagasRelacionadas: ['osde', 'swiss-medical', 'sancor-salud'],
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
    relacionadas: ['como-afiliarse-prepaga-requisitos', 'como-cambiar-de-prepaga'],
  },
  {
    // 23-sep-2026: "codem" y "qué obra social tengo" son de las búsquedas de
    // mayor volumen del rubro. No se puede consultar el padrón desde nuestra
    // web (tiene captcha y son datos de salud de terceros): la guía explica el
    // trámite oficial, linkea a ANSES/SSSalud y convierte al que va a cambiar.
    slug: 'que-obra-social-tengo-codem',
    titulo: '¿Qué obra social tengo? Consultala por DNI o CUIL y sacá el CODEM (2026)',
    metaDescripcion: 'Cómo saber cuál es tu obra social en 1 minuto: consultá gratis el CODEM de ANSES con tu DNI o CUIL, o el padrón de la Superintendencia de Servicios de Salud. Paso a paso y qué hacer si no figurás.',
    tiempoLectura: 5,
    categoria: 'Trámites',
    fechaActualizacion: '2026-09-23',
    contenido: {
      intro: 'Para saber qué obra social tenés, consultá el CODEM (Comprobante de Empadronamiento) en la web de ANSES: es gratis, se hace online y solo necesitás tu DNI y tu CUIL. El sistema te muestra tu obra social y los familiares que tenés a cargo, y te deja descargar e imprimir la constancia. Otra vía oficial es la consulta del padrón de beneficiarios de la Superintendencia de Servicios de Salud (SSSalud).',
      secciones: [
        {
          titulo: 'Cómo sacar el CODEM en ANSES, paso a paso',
          cuerpo: 'Entrá a la consulta "Obra social (CODEM)" de ANSES, ingresá tu número de DNI y/o CUIL y seleccioná Continuar. El sistema te informa cuál es tu obra social y los familiares a cargo, si los tenés. Desde ahí podés descargar e imprimir el comprobante. El trámite es gratuito y lo podés hacer desde el celular o la computadora.',
          enlaces: [{ texto: 'Consultar el CODEM en ANSES', url: 'https://www.anses.gob.ar/consultas/obra-social-codem' }],
        },
        {
          titulo: 'Quiénes pueden consultarlo',
          cuerpo: 'Según ANSES, el CODEM está disponible si sos trabajador en actividad, si cobrás la prestación por desempleo o si sos jubilado o pensionado. También figuran tus familiares a cargo: cónyuge o conviviente, hijos menores de 21 años, hijos estudiantes hasta los 25 años e hijos con discapacidad.',
        },
        {
          titulo: 'La otra vía: el padrón de la Superintendencia de Servicios de Salud',
          cuerpo: 'La SSSalud tiene una consulta del padrón de beneficiarios, con los datos de los titulares y familiares a cargo que están en la base de afiliados de las obras sociales. Pide tu CUIL, tu número de documento y un código de verificación. Es útil para confirmar el dato o si en ANSES no encontrás lo que buscás.',
          enlaces: [{ texto: 'Consultar el padrón de la SSSalud', url: 'https://www.sssalud.gob.ar/?page=bus650' }],
        },
        {
          titulo: 'Para qué te sirve saber tu obra social',
          cuerpo: 'Es el primer paso para cambiar de cobertura. Si trabajás en relación de dependencia, tus aportes pueden ir a la prepaga que elijas en lugar de a tu obra social actual: esa derivación descuenta tus aportes de la cuota. Para hacer el cambio es habitual que te pidan el comprobante de tu obra social actual, así que tener el CODEM a mano te ahorra tiempo.',
          cta: {
            texto: '¿Ya sabés cuál es tu obra social? Te decimos a qué prepaga podés derivar tus aportes y cuánto pagarías. Respondemos en 3 minutos.',
            boton: 'Cotizar con mis aportes',
            href: '/comparador',
          },
        },
        {
          titulo: 'Si no figurás o los datos están mal',
          cuerpo: 'Si la consulta no te muestra obra social o los datos no coinciden (por ejemplo, un familiar que no aparece a cargo), la vía es contactar a ANSES para revisar tu situación. Si te quedaste sin trabajo, tenés un período de cobertura de la obra social después del despido: te lo explicamos en la guía sobre obra social sin trabajo.',
        },
      ],
      conclusion: 'El CODEM de ANSES es la forma más rápida de saber qué obra social tenés: DNI, CUIL y en un minuto tenés la constancia. Con ese dato podés comparar si te conviene derivar tus aportes a una prepaga, que en muchos casos es la forma de tener mejor cobertura pagando menos de bolsillo.',
    },
    faq: [
      {
        q: '¿Cómo sé qué obra social tengo?',
        a: 'Consultá el CODEM en la web de ANSES con tu DNI y/o CUIL: te muestra tu obra social y tus familiares a cargo. También podés usar la consulta del padrón de beneficiarios de la Superintendencia de Servicios de Salud.',
      },
      {
        q: '¿Qué es el CODEM?',
        a: 'Es el Comprobante de Empadronamiento de ANSES: la constancia que indica a qué obra social pertenecés y qué familiares tenés a cargo. Se descarga e imprime gratis desde la web de ANSES.',
      },
      {
        q: '¿El CODEM tiene costo?',
        a: 'No. Es un trámite gratuito y online.',
      },
      {
        q: '¿Qué necesito para consultar mi obra social?',
        a: 'En ANSES, tu número de DNI y tu número de CUIL. En la consulta del padrón de la SSSalud, tu CUIL, tu documento y un código de verificación.',
      },
      {
        q: '¿Puedo consultar la obra social desde PrepagaYa?',
        a: 'No: la consulta es personal y se hace en los sitios oficiales de ANSES o de la SSSalud. Una vez que sabés tu obra social, en PrepagaYa te ayudamos a comparar a qué prepaga podés derivar tus aportes.',
      },
    ],
    keywords: ['que obra social tengo', 'codem', 'codem anses', 'cual es mi obra social', 'consultar obra social por dni', 'consultar obra social por cuil', 'constancia de obra social', 'padron sssalud'],
    relacionadas: ['derivar-obra-social-a-prepaga', 'sin-trabajo-obra-social', 'obra-social-vs-prepaga', 'como-cambiar-de-prepaga'],
    fuentes: [
      { texto: 'ANSES — Obra social (CODEM)', url: 'https://www.anses.gob.ar/consultas/obra-social-codem' },
      { texto: 'Argentina.gob.ar — Consultar tu obra social (CODEM)', url: 'https://www.argentina.gob.ar/servicio/consultar-tu-obra-social-codem-comprobante-de-empadronamiento' },
      { texto: 'SSSalud — Consulta del padrón de beneficiarios', url: 'https://www.sssalud.gob.ar/?page=bus650' },
    ],
  },
  {
    slug: 'derivar-obra-social-a-prepaga',
    titulo: 'Cómo derivar tu obra social a una prepaga: guía 2026',
    metaDescripcion: 'Aprendé cómo funciona la derivación de aportes de tu obra social a una prepaga en Argentina. Qué prepagas lo aceptan, requisitos y diferencia de costos.',
    tiempoLectura: 8,
    categoria: 'Trámites',
    fechaActualizacion: '2026-09-24',
    contenido: {
      intro: 'La derivación de aportes es el mecanismo más poderoso (y menos entendido) para pagar menos por tu prepaga: si trabajás en relación de dependencia, tus aportes de obra social pueden ir a la prepaga que elijas, descontándose de la cuota, y encima accedés a la lista de precios sin IVA. El mismo plan puede costarte 30-40% menos. Así funciona.',
      secciones: [
        {
          titulo: 'Qué es exactamente la derivación de aportes',
          cuerpo: 'De tu sueldo bruto, el 3% va a una obra social, y tu empleador suma otro 6%. Ese 9% total es tuyo: la ley te permite dirigirlo a la entidad que elijas. Cuando lo derivás a una prepaga, la empresa toma tus aportes como parte de pago y te factura solo la diferencia hasta el valor del plan. Cuanto más alto tu sueldo, mayor el aporte y menor la diferencia que pagás de bolsillo.',
        },
        {
          titulo: 'El doble ahorro: aportes + IVA',
          cuerpo: 'La derivación tiene dos descuentos acumulados. Primero, tus aportes se restan del precio. Segundo, el precio base es otro: la lista "deriva aporte" no incluye el IVA (10,5%) que sí paga la contratación directa. Ejemplo real con Galeno (julio 2026): el plan Plata 300 baja alrededor de un 36% pasando de particular a aportes, antes incluso de considerar sueldos altos con aportes que cubren más.',
        },
        {
          titulo: 'El trámite paso a paso',
          cuerpo: 'Uno: cotizá el plan en modalidad "con aportes" o "deriva aporte", con tu recibo de sueldo a mano, y fijate que la prepaga esté inscripta en el Registro Nacional de Agentes del Seguro (figura con código en el listado de la Superintendencia). Dos: hacé la opción de cambio vos mismo, online, en la web de la Superintendencia de Servicios de Salud con tu clave fiscal nivel 3 de ARCA: es gratis y sin intermediarios. Tres: confirmá el mail que te llega dentro de las 48 horas, o el trámite se cae. El cambio se activa el primer día del mes siguiente y ahí te afiliás a la prepaga. Se puede hacer una vez cada 365 días, y en la entidad elegida tenés que quedarte al menos un año.',
        },
        {
          titulo: 'Casos particulares: pareja, cambio de trabajo, despido',
          cuerpo: 'Si los dos trabajan en relación de dependencia, pueden unificar ambos aportes en el mismo plan familiar: los dos descuentos se suman. Si cambiás de trabajo, la derivación te sigue: informá el nuevo empleador a la prepaga para que los aportes no se corten. Si te quedás sin trabajo, tenés derecho a la cobertura de la obra social por 3 meses post-despido con aportes; después, la prepaga te ofrecerá recontratar como particular o monotributista, un buen momento para recotizar todo.',
        },
        {
          titulo: 'Si recién empezás un trabajo nuevo: pedí el código de la prepaga en el alta',
          cuerpo: 'Este paso lo conoce poca gente y ahorra hasta dos meses de espera. Cuando te dan de alta temprana en un trabajo nuevo, el formulario de alta ante AFIP/RRHH te pide indicar una obra social — y ahí mismo podés indicar directamente el código de la obra social con la que opera tu prepaga elegida, en vez de dejar que te asignen la obra social por default de tu convenio colectivo de trabajo (CCT) y tener que derivar después. Por ejemplo, si vas a Swiss Medical, tu empleador puede cargar directamente el código de obra social 900805 (confirmalo con tu asesor antes de indicarlo). Decirlo en el alta, en vez de derivar después, evita dos demoras que se suman: el trámite de derivación en sí (hasta 90 días corridos) y, un problema menos conocido, que la Superintendencia de Servicios de Salud tarde en reflejar en su sistema que ya estás en relación de dependencia — mientras eso no impacte, ninguna prepaga puede procesar tu derivación, y esa demora sola puede llevarse otros 2 meses. Pedir el código correcto desde el día uno evita las dos esperas.',
        },
      ],
      conclusion: 'Si estás en relación de dependencia y pagás tu prepaga como particular, estás pagando de más: la derivación descuenta tus aportes y elimina el IVA del precio. El trámite es online y gratis, y el ahorro arranca el mes siguiente. Cotizá siempre en las dos modalidades para ver la diferencia con tus números reales.',
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
      {
        q: '¿Cómo evito esperar 1 o 2 meses para derivar el aporte si recién empiezo un trabajo?',
        a: 'Pedile a Recursos Humanos que, en el alta temprana, cargue directamente el código de la obra social de tu prepaga elegida en vez del default del convenio colectivo. Así evitás el trámite de derivación posterior (hasta 90 días) y el riesgo de que la Superintendencia de Servicios de Salud tarde en reflejar tu alta en relación de dependencia, que puede sumar otros 2 meses de espera. Confirmá el código exacto con tu prepaga, varía según el convenio colectivo de cada actividad.',
      },
    ],
    keywords: ['derivar aportes a prepaga', 'derivacion obra social prepaga', 'prepaga con aportes precio', 'plan deriva aporte', 'codigo obra social alta temprana', 'derivar aporte trabajo nuevo', 'como derivar obra social argentina', 'derivacion obra social paso a paso', 'cambiar obra social 2026', 'derivacion obra social online'],
    relacionadas: ['que-obra-social-tengo-codem', 'obra-social-vs-prepaga', 'prepagas-para-monotributistas', 'como-cambiar-de-prepaga', 'prepaga-corporativa-vs-particular'],
    prepagasRelacionadas: ['galeno', 'swiss-medical', 'medife'],
  },
  {
    slug: 'prepaga-sin-periodo-carencia',
    // Reescrita el 27-sep-2026 con la letra oficial (Ley 26.682 y Decreto
    // 1993/2011 actualizados en Infoleg, Ley simple del Ministerio de
    // Justicia), el reglamento de contratación de Swiss Medical y la
    // experiencia de Darío como asesor, separando siempre ley y práctica. La
    // versión anterior tenía plazos sin fuente ("ortodoncia 6-12 meses",
    // "cirugía estética 12-24 meses").
    titulo: 'Carencias en prepagas 2026: qué dice la ley y cómo funcionan en la práctica',
    metaDescripcion: 'Carencias en prepagas: sin espera para el PMO y como máximo 12 meses para lo superador, según la ley. Qué suele tener carencia y qué pasa si no declaraste algo.',
    tiempoLectura: 8,
    categoria: 'Cobertura',
    fechaActualizacion: '2026-09-27',
    contenido: {
      intro: 'Todo lo que está en el Programa Médico Obligatorio (PMO) te cubre desde el día en que empieza el contrato: consultas, estudios, internación, parto, urgencias. Las carencias —la norma las llama "períodos de acceso progresivo a la cobertura"— solo pueden aplicarse a prestaciones superadoras, como la cirugía estética de los planes altos, y nunca por más de 12 meses. Acá está lo que dice la norma y, aparte, lo que vemos en la práctica como asesores.',
      secciones: [
        {
          titulo: 'Lo que dice la ley: sin carencia en el PMO',
          cuerpo: 'El artículo 10 de la Ley 26.682 dice que los contratos "no pueden incluir períodos de carencia o espera para todas aquellas prestaciones que se encuentran incluidas en el Programa Médico Obligatorio". Para el resto, los plazos "deben estar suficientemente explicitados en el contrato y aprobados por la Autoridad de Aplicación", que es la Superintendencia de Servicios de Salud. Lo que es PMO lo tenés desde el primer día, en cualquier prepaga y en cualquier plan.',
        },
        {
          titulo: 'Lo superador: 12 meses como máximo',
          cuerpo: 'La reglamentación (Decreto 1993/2011, artículo 10, con el texto que le dio el Decreto 171/2024) dice que las carencias "solo podrán establecerse para el acceso a las prestaciones sanitarias superadoras o complementarias al Programa Médico Obligatorio" y que "en ningún caso podrán superar los DOCE (12) meses corridos desde el comienzo de la relación contractual". Y si una prestación con carencia pasa a formar parte del PMO, esa carencia "quedará automáticamente anulada". Cada prepaga detalla sus plazos en el anexo de cada plan: pedilo antes de firmar.',
        },
        {
          titulo: 'En la práctica: qué suele tener carencia',
          cuerpo: 'Lo que vemos como asesores: la cirugía estética es la prestación con carencia más común, y solo está en los planes altos. La ortodoncia suele tener una carencia corta, de alrededor de 6 meses. Los implantes, cuando el plan los cubre por reintegro, se pueden pedir desde el primer día: cuánto te devuelven depende del presupuesto del profesional y del tope del plan. La internación y los tratamientos de fertilización (PMO por la Ley 26.862) no tienen carencia. Algunos planes piden más antigüedad para la cirugía estética; si te informan un plazo mayor a 12 meses, pedí que te lo muestren en el contrato: la reglamentación vigente no lo permite.',
        },
        {
          titulo: 'Mientras corre una carencia, el PMO se atiende igual',
          cuerpo: 'Durante una carencia no te quedás sin cobertura: lo que es PMO se atiende igual, aunque la prepaga puede derivarte a prestadores que elige para eso. El reglamento de contratación de Swiss Medical, por ejemplo, dice que en ese lapso las prestaciones obligatorias se dan "utilizando a tal efecto los prestadores exclusivos para la atención de prestaciones del Programa Médico Obligatorio", y que el resto de los servicios se pueden usar pagando el arancel.',
        },
        {
          titulo: 'Cirugía estética: cómo funciona el reintegro',
          cuerpo: `En los planes que la incluyen, la cirugía estética se cubre por reintegro, con un tope por plan: si la operación sale más que el tope, la diferencia la pagás vos. Con un tope de $3.500.000 y una cirugía de $4.000.000, por ejemplo, ponés $500.000. En Swiss Medical, según nuestra experiencia, el SMG50 la habilita a partir de los 12 meses de antigüedad, y el tope de reintegro ${topeCirugiaSmg50}. Dónde te operás cambia mucho la cuenta: en un sanatorio propio de la prepaga (en Swiss Medical, por ejemplo, Los Arcos), la internación, el anestesista y las prótesis los cubre el plan y el reintegro queda para los honorarios del cirujano; en otro prestador, el presupuesto incluye todo y la diferencia suele ser mayor.`,
          cta: { texto: 'Qué plan de cada prepaga cubre la cirugía estética, cada cuánto y con qué tope.', boton: 'Ver cirugía estética por prepaga', href: '/coberturas/cirugia-estetica' },
        },
        {
          titulo: 'La carencia que no esperabas: lo que no declaraste',
          cuerpo: 'Al afiliarte completás una declaración jurada de salud. Si después un estudio o un médico deja constancia de que el problema venía de antes y no lo declaraste, el auditor médico de la prepaga puede aplicarte un plazo de espera para esa patología —en la práctica vemos, por ejemplo, 180 días para una práctica de traumatología— o directamente rescindir el contrato. La ley lo permite: la falsedad de la declaración jurada es causal de rescisión. El reglamento de Swiss Medical, por ejemplo, prevé que si sospecha una preexistencia no declarada convoca a una junta de tres médicos (podés ir con un médico tuyo) y que puede pedir el reintegro de lo que cubrió. Declarar todo sale siempre más barato.',
        },
        {
          titulo: 'Planes corporativos y cambio de trabajo',
          cuerpo: 'En la práctica, los planes corporativos (los que contrata tu empleador) entran sin carencias. Si dejás ese trabajo, el artículo 15 de la Ley 26.682 te da 60 días para seguir en un plan de la prepaga con tu antigüedad reconocida, y mientras tanto te tienen que mantener el plan: avisá cuanto antes, porque algunos reglamentos piden hacerlo en menos tiempo. Derivar tus aportes de obra social o pagar como particular no cambia las carencias.',
        },
      ],
      conclusion: 'PMO desde el primer día; carencias solo en prestaciones superadoras, escritas en el anexo del plan y por un máximo de 12 meses; y la declaración jurada completa para no tener sorpresas. Si querés saber qué carencias tiene un plan concreto antes de contratarlo, preguntanos: te lo confirmamos por escrito con la prepaga.',
    },
    faq: [
      {
        q: '¿Cuánto dura como máximo una carencia en una prepaga?',
        a: '12 meses corridos desde el comienzo del contrato, y solo para prestaciones superadoras al PMO (Decreto 1993/2011, artículo 10, texto según el Decreto 171/2024). Para lo que está en el PMO no puede haber carencia.',
      },
      {
        q: '¿Si me afilio hoy y mañana necesito una cirugía, me cubre?',
        a: 'Si es una prestación del PMO con indicación médica, sí: no puede haber carencia. La prepaga puede pedir autorización previa. Si el problema era anterior y no lo declaraste, el auditor puede aplicar un plazo de espera para esa patología o rescindir el contrato por falsedad de la declaración jurada.',
      },
      {
        q: '¿Qué prestaciones suelen tener carencia?',
        a: 'En la práctica, la cirugía estética de los planes altos y la ortodoncia. Los implantes por reintegro se pueden pedir desde el primer día, con el tope del plan. La internación, el parto y la fertilización son PMO y no tienen carencia. Cada plan detalla sus plazos en su anexo.',
      },
      {
        q: '¿Qué pasa con el PMO mientras corre una carencia?',
        a: 'Se cubre igual, desde el primer día, aunque la prepaga puede atenderte con prestadores que elige para las prestaciones obligatorias. Lo que tiene carencia es solo la prestación superadora.',
      },
      {
        q: '¿Cambia algo si derivo mis aportes de obra social?',
        a: 'En la práctica, no: las carencias y la evaluación de la declaración jurada son las mismas que para un plan particular.',
      },
      {
        q: '¿Los planes corporativos tienen carencia?',
        a: 'En la práctica entran sin carencias. Si dejás el trabajo, la Ley 26.682 (artículo 15) te da 60 días para seguir en un plan de la prepaga con tu antigüedad reconocida.',
      },
    ],
    keywords: ['prepaga sin carencia', 'periodo de carencia prepaga', 'carencia prepaga ley', 'cuanto dura la carencia prepaga', 'carencia prepaga 12 meses', 'carencia cirugia estetica prepaga', 'carencia ortodoncia prepaga', 'periodo de carencia prepaga argentina', 'carencia prepaga que es'],
    relacionadas: ['que-cubre-la-prepaga', 'como-cambiar-de-prepaga', 'reintegros-en-prepagas', 'prepaga-cubre-vasectomia-ligadura-cirugia-bariatrica'],
    fuentes: [
      { texto: 'Ley 26.682 (texto actualizado) — Infoleg', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
      { texto: 'Decreto 1993/2011, reglamentación de la Ley 26.682 (texto actualizado) — Infoleg', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/190000-194999/190606/texact.htm' },
      { texto: 'Ley simple: Medicina prepaga — Ministerio de Justicia', url: 'https://www.argentina.gob.ar/justicia/derechofacil/leysimple/medicina-prepaga' },
    ],
  },
  {
    slug: 'cuota-prepaga-aumento-inflacion',
    titulo: '¿Aumentó tu prepaga? Qué hacer y cómo protegerte de los aumentos (2026)',
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
    keywords: ['que hacer si aumenta la prepaga', 'como protegerte de aumentos prepaga', 'aumento cuota prepaga derechos', 'prepaga sube precio que hacer', 'derechos aumento prepaga argentina'],
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
          cuerpo: 'La diferencia de cuota entre un plan con copago y su equivalente sin copago ronda el 15-30%. Ejemplo con Swiss Medical (julio 2026): el S2 con copagos tiene un nivel de precio notablemente más bajo que el SMG20 sin copagos. Para que el plan sin copago se justifique económicamente, tendrías que hacer más de 8-10 consultas o prácticas por mes, todos los meses. La mayoría de las personas sanas no llega ni cerca.',
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
    keywords: ['copago prepaga que es', 'plan con copago o sin copago', 'cuanto cuesta el copago 2026', 'copago consulta prepaga', 'copago prepaga argentina', 'coseguro prepaga diferencia', 'plan sin copago prepaga', 'cuanto pago de copago prepaga'],
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
          cta: { texto: '¿A qué guardia te conviene ir? Con tu ubicación te mostramos las de tu prepaga y tu plan más cerca, con cómo llegar y el teléfono.', boton: 'Ver guardias cerca', href: '/guardias-cerca' },
        },
        {
          titulo: 'Ambulancia y emergencias domiciliarias',
          cuerpo: 'La mayoría de los planes incluye emergencias médicas a domicilio con unidades propias o contratadas (OSDE tiene URG, Swiss su sistema SEM, y las demás trabajan con prestadores como Vittal o Emergencias). Guardá el número de emergencias de tu credencial en el teléfono de todos los integrantes de la familia hoy: en la urgencia real nadie busca el número. El servicio clasifica la llamada (emergencia, urgencia, visita) y despacha según gravedad; la emergencia con riesgo de vida no tiene costo adicional.',
          cta: { texto: '¿Necesitás el número para pedir un médico a domicilio? Están los teléfonos oficiales de cada prepaga.', boton: 'Ver teléfonos de médico a domicilio', href: '/guias/medico-a-domicilio-prepaga' },
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
    // 15-oct-2026: título con la búsqueda "cómo pedir reintegro en OSDE / Swiss Medical"
    titulo: '¿Cómo pedir un reintegro en tu prepaga? Paso a paso en OSDE y Swiss Medical (2026)',
    metaDescripcion: 'Guía práctica sobre los reintegros de gastos médicos en prepagas argentinas: qué gastos cubren, cómo presentar la solicitud y en cuánto tiempo te devuelven el dinero.',
    tiempoLectura: 6,
    categoria: 'Derechos',
    fechaActualizacion: '2026-10-15',
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
          titulo: 'Cómo se pide en OSDE',
          cuerpo: 'Según OSDE, primero el titular tiene que registrar una cuenta bancaria: los reintegros se acreditan ahí en pesos, aunque el gasto haya sido en moneda extranjera. Después presentás los comprobantes en Gestiones Online > Solicitar un reintegro, en la app o en la web de OSDE. El plazo para presentarlos es de un año desde la fecha de la prestación. Los montos son por beneficiario, intransferibles y no acumulativos.',
          enlaces: [{ texto: 'OSDE — Cómo utilizar el servicio (reintegros)', url: 'https://www.osde.com.ar/informacion-al-socio/como-utilizar-el-servicio' }],
        },
        {
          titulo: 'Cómo se pide en Swiss Medical',
          cuerpo: 'Swiss Medical gestiona los reintegros desde su web de clientes y la app. Antes de un tratamiento podés pedir un presupuesto de reintegro para saber cuánto te devuelven según tu plan: te responden en un plazo máximo de 72 horas hábiles. El presupuesto tiene que tener la firma y el sello del profesional y el detalle de cada prestación con su importe.',
          enlaces: [{ texto: 'Swiss Medical — Preguntas frecuentes', url: 'https://www.swissmedical.com.ar/prepagaclientes/faqs' }],
          cta: { texto: 'Si te atendés fuera de cartilla seguido, lo que importa es el tope de reintegro de cada plan. Compará planes con reintegros.', boton: 'Ver planes con reintegros', href: '/coberturas/reintegros/swiss-medical' },
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
    keywords: ['como pedir reintegro osde', 'como pedir reintegro swiss medical', 'reintegro osde plazo', 'presupuesto de reintegro swiss medical', 'reintegros prepaga', 'como pedir reintegro prepaga', 'reintegro consulta medica', 'plan con reintegros prepaga', 'reintegro prepaga argentina', 'prepaga devuelve dinero', 'como recuperar gastos medicos prepaga'],
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
          cta: { texto: '¿Qué papeles te van a pedir según lo que declares? Buscá tu condición y armá la lista.', boton: 'Buscar mi condición', href: '/declaracion-jurada-de-salud' },
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
    relacionadas: ['como-contratar-prepaga-online', 'derivar-obra-social-a-prepaga', 'afiliar-recien-nacido-prepaga'],
  },
  {
    slug: 'seguro-medico-obligatorio-extranjeros',
    titulo: 'Seguro médico obligatorio en Argentina: guía para extranjeros 2026',
    metaDescripcion: 'El Decreto 366/25 hizo obligatorio el seguro médico para entrar a Argentina. Qué exige Migraciones, quiénes están exentos y cuándo conviene una prepaga local en vez de asistencia al viajero.',
    tiempoLectura: 7,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-03',
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
          cuerpo: `Según las listas oficiales de ${MES}, para un adulto de 30 años la cuota más baja del mercado es de ${DESDE} por mes (${DESDE_PLAN}). Los planes sin copago con sanatorios de primer nivel, como el SMG20 de Swiss Medical (${lista('swiss-medical', 'smg20')}) o el 310 de OSDE (${lista('osde', '310')}), están en el medio, y un premium como el SMG70 de Swiss Medical sale ${lista('swiss-medical', 'smg70')}. La cuota sube con la edad, así que cotizá con tu edad real para ver el número exacto.`,
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
          cuerpo: 'Si trabajaste en relación de dependencia de forma continuada más de 3 meses, conservás tu obra social (y la de tu grupo familiar) durante los 3 meses posteriores al fin del contrato, sin hacer ningún trámite y sin pagar aportes (artículo 10, inciso a, de la Ley 23.660). Aplica tanto para despido como para renuncia. Este período es tu ventana para decidir con calma qué viene después — no la desperdicies esperando al día 89.',
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
        a: 'Tres meses desde el fin del contrato, igual que en un despido, siempre que hayas trabajado en forma continuada más de 3 meses en relación de dependencia (Ley 23.660, art. 10). Cubre también a tu grupo familiar y no requiere trámite.',
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
    relacionadas: ['que-obra-social-tengo-codem', 'obra-social-vs-prepaga', 'prepagas-para-monotributistas', 'derivar-obra-social-a-prepaga', 'prepaga-corporativa-vs-particular', 'baja-obra-social-monotributo'],
    prepagasRelacionadas: ['sancor-salud', 'medife', 'prevencion-salud'],
  },
  {
    slug: 'discapacidad-obra-social-cobertura-100',
    titulo: 'Discapacidad y Certificado Único de Discapacidad (CUD): qué cubre tu obra social al 100%',
    metaDescripcion: 'Con el Certificado Único de Discapacidad (CUD), la Ley 24.901 obliga a cubrir al 100% tratamientos, medicación, rehabilitación y transporte. Te explicamos cómo funciona con tu obra social.',
    tiempoLectura: 9,
    categoria: 'Derechos',
    fechaActualizacion: '2026-08-02',
    contenido: {
      intro: 'El Certificado Único de Discapacidad (CUD) es la puerta de entrada a un sistema de cobertura al 100% que muy poca gente conoce en detalle: medicación, rehabilitación, transporte, apoyos educativos y prótesis, sin copagos ni límites de sesiones. La Ley 24.901 pone esta obligación en cabeza de las obras sociales (reguladas por la Superintendencia de Servicios de Salud), que es donde este sistema funciona de forma más consistente y donde conviene enfocar el trámite.',
      secciones: [
        {
          titulo: 'Qué es el CUD y quién lo puede tramitar',
          cuerpo: 'El CUD es un documento público, gratuito y válido en todo el país que acredita una discapacidad según la definición de la Ley 22.431. Lo tramita cualquier persona con una condición física, sensorial, intelectual o psicosocial que le genere una desventaja para su participación plena, ante una Junta Evaluadora provincial o de CABA. El trámite es voluntario: nadie está obligado a sacarlo, pero sin él no se puede acceder a las prestaciones de la Ley 24.901.',
        },
        {
          titulo: 'Qué cubre al 100% la Ley 24.901',
          cuerpo: 'Con CUD vigente, la cobertura incluye: medicación específica para la condición, rehabilitación (kinesiología, fonoaudiología, terapia ocupacional, psicopedagogía), transporte especial hacia los tratamientos, apoyo a la integración escolar, prótesis y órtesis, y en los casos que corresponda, centros de día o residenciales. Todo sin copago y sin límite de sesiones prefijado — el criterio es lo que indique el equipo tratante, no un tope administrativo.',
        },
        {
          titulo: 'Si cobrás una pensión no contributiva: Incluir Salud',
          cuerpo: 'Si sos titular de una pensión no contributiva (por ejemplo, por invalidez) y no tenés otra obra social, tu cobertura de salud es el Programa Federal Incluir Salud: atiende en la red pública de prestadores de tu provincia. La afiliación no es automática: se pide en forma gratuita y presencial.',
          enlaces: [{ texto: 'Programa Incluir Salud (argentina.gob.ar)', url: 'https://www.argentina.gob.ar/node/321532' }],
        },
        {
          titulo: 'Por qué esto es un tema de obra social, no de prepaga',
          cuerpo: 'La Ley 24.901 nombra a obras sociales, prepagas y al Estado como sujetos obligados. En la práctica, el circuito funciona de forma mucho más consistente en obras sociales: tienen áreas y prestadores especializados en discapacidad rodados desde hace décadas, mientras que en muchas prepagas la gestión de estas prestaciones es más lenta o directamente friccionada, más allá de lo que dice la letra de la ley. Si tenés CUD y estás evaluando dónde afiliarte, no asumas que cualquier prepaga te va a resolver esto igual que una obra social — conviene preguntar explícitamente por el área de discapacidad antes de decidir.',
        },
        {
          titulo: 'Cómo se tramita paso a paso',
          cuerpo: 'Se pide turno en la Junta Evaluadora de discapacidad de tu provincia (o de CABA), se presenta documentación médica que respalde el diagnóstico, y un equipo interdisciplinario evalúa el caso. Si se aprueba, el certificado tiene una vigencia definida (o permanente en condiciones que no varían) y hay que renovarlo antes del vencimiento. Para 2026 rige una prórroga automática para los certificados que vencían durante 2025, que se extienden hasta la misma fecha de este año.',
        },
        {
          titulo: 'Qué hacer si tu cobertura te rechaza una prestación',
          cuerpo: 'El rechazo de una prestación incluida en el nomenclador de la Ley 24.901 a una persona con CUD vigente es reclamable ante la Superintendencia de Servicios de Salud (para obras sociales) o ante la autoridad de contralor de prepagas de tu jurisdicción. Guardá siempre el rechazo por escrito: es lo que necesitás para iniciar el reclamo formal.',
        },
      ],
      conclusion: 'El CUD no es un trámite más: es la llave a una cobertura del 100% que en la práctica se ejerce mejor a través de una obra social que de una prepaga. Si estás evaluando opciones y tenés (o vas a tramitar) el certificado, priorizá entender cómo funciona el área de discapacidad de cada cobertura antes de mirar cualquier otra variable.',
    },
    faq: [
      {
        q: '¿El CUD sirve en todo el país?',
        a: 'Sí, es un documento de validez nacional. Una vez otorgado por la Junta Evaluadora de tu jurisdicción, tus derechos y prestaciones aplican en cualquier provincia.',
      },
      {
        q: '¿Las prepagas están obligadas a cubrir lo mismo que las obras sociales?',
        a: 'Por ley sí, la Ley 24.901 las incluye como sujeto obligado igual que a las obras sociales. En la práctica, el nivel de organización y experiencia en gestionar estas prestaciones suele ser mayor en obras sociales — confirmá esto puntualmente con cada cobertura antes de decidir, no lo des por sentado.',
      },
      {
        q: '¿El CUD tiene costo?',
        a: 'No, el trámite es gratuito tanto en el sistema público como el certificado en sí.',
      },
      {
        q: '¿Qué pasa si mi certificado vence en 2026?',
        a: 'Para certificados que vencían durante 2025 rige una prórroga automática hasta la misma fecha de 2026. Para vencimientos propios de 2026, hay que iniciar la renovación con anticipación ante la Junta Evaluadora.',
      },
    ],
    keywords: ['certificado unico de discapacidad', 'CUD cobertura 100', 'ley 24901 obra social', 'discapacidad obra social cobertura', 'que cubre el CUD'],
    relacionadas: ['obra-social-vs-prepaga', 'como-reclamar-a-una-prepaga'],
  },
  {
    slug: 'afiliar-recien-nacido-prepaga',
    titulo: 'Afiliar a tu bebé recién nacido a la prepaga: plazos y requisitos',
    metaDescripcion: 'Cómo y cuándo afiliar a un recién nacido a la prepaga, qué documentos pedir, qué pasa si te pasás del plazo y cuánto empieza a costar. Guía práctica.',
    tiempoLectura: 6,
    categoria: 'Trámites',
    fechaActualizacion: '2026-09-17',
    contenido: {
      intro: 'El nacimiento de un hijo trae un trámite administrativo que muchos padres primerizos descubren tarde: la prepaga no incorpora automáticamente al bebé para siempre, hay una ventana para inscribirlo formalmente. Te contamos cómo funciona, qué pedir y qué pasa si te atrasás.',
      secciones: [
        {
          titulo: 'La cobertura del parto está garantizada, la inscripción del bebé no es automática de por vida',
          cuerpo: 'Por la Ley 26.682, el Plan Materno Infantil cubre el embarazo, el parto y la atención del recién nacido durante los primeros días sin copagos ni carencias, sea cual sea tu plan. Pero esa cobertura inicial es transitoria: para que tu hijo quede como beneficiario permanente con su propia credencial, tenés que inscribirlo formalmente ante la prepaga. Es habitual que las empresas den un plazo de gracia (muchas manejan 30 días corridos desde el nacimiento) para hacerlo sin pedir declaración jurada de salud ni aplicar carencias — pero el plazo exacto lo define cada contrato, así que confirmalo con tu prepaga apenas nazca, no lo asumas.',
        },
        {
          titulo: 'Qué documentación piden',
          cuerpo: 'Mientras se tramita el DNI del bebé (que en Argentina puede demorar semanas), la mayoría de las prepagas acepta iniciar el trámite con el Certificado de Nacido Vivo que entrega el sanatorio o la partida de nacimiento provisoria del Registro Civil, más el número de afiliado del progenitor titular. El DNI definitivo se presenta después, cuando llega. Iniciá el trámite con lo que tengas en el momento — no esperes a tener el DNI para no perder el plazo de inscripción sin carencias.',
        },
        {
          titulo: 'Qué pasa si te pasás del plazo',
          cuerpo: 'Si inscribís al bebé después de la ventana sin carencias, la prepaga puede tratarlo como una afiliación nueva: pedir declaración jurada de salud y, si detecta una preexistencia, proponer una cuota diferencial, igual que con un adulto. Es la principal razón para no dejar pasar el trámite: no es solo burocracia, es la diferencia entre cobertura inmediata y una evaluación médica evitable.',
        },
        {
          titulo: 'Cuánto empieza a costar',
          cuerpo: 'El bebé se suma como un integrante más de tu grupo familiar, con el valor de la franja de edad más baja del plan que tengas contratado — generalmente la cuota más económica de toda la tabla de precios por edad de esa prepaga. El monto exacto varía según la empresa y el plan: usá la calculadora para ver cuánto se sumaría a tu cuota familiar antes de inscribirlo.',
        },
      ],
      conclusion: 'El resumen práctico: el parto y los primeros días del bebé están cubiertos pase lo que pase, pero la inscripción formal como beneficiario tiene plazo. Llamá a tu prepaga apenas nazca para confirmar la fecha límite exacta de tu contrato, iniciá el trámite con el Certificado de Nacido Vivo si el DNI todavía no está, y no dejes pasar la ventana sin carencias.',
    },
    faq: [
      {
        q: '¿Cuánto tiempo tengo para afiliar a mi bebé recién nacido a la prepaga?',
        a: 'Depende del contrato de cada empresa, pero es habitual un plazo de gracia de alrededor de 30 días corridos desde el nacimiento para inscribirlo sin declaración jurada de salud ni carencias. Confirmá la fecha exacta con tu prepaga apenas nazca.',
      },
      {
        q: '¿Puedo afiliar al bebé sin el DNI todavía?',
        a: 'Sí. La mayoría de las prepagas acepta iniciar el trámite con el Certificado de Nacido Vivo del sanatorio o la partida de nacimiento provisoria, y completar con el DNI cuando llegue.',
      },
      {
        q: '¿Qué pasa si me atraso en inscribir al bebé?',
        a: 'La prepaga puede tratarlo como una afiliación nueva fuera de plazo: pedir declaración jurada de salud y, si detecta una preexistencia, proponer una cuota diferencial, igual que haría con un adulto que se afilia por primera vez.',
      },
      {
        q: '¿Cuánto cuesta agregar un bebé a la prepaga?',
        a: 'Se suma como un integrante más de tu grupo familiar al valor de la franja de edad más baja del plan, que suele ser la más económica de la tabla de precios por edad. El monto exacto depende de la empresa y el plan — podés calcularlo en nuestra calculadora.',
      },
    ],
    keywords: ['afiliar bebe recien nacido prepaga', 'plazo para afiliar recien nacido obra social', 'cuanto cuesta afiliar un bebe a la prepaga', 'plan materno infantil recien nacido', 'documentos para afiliar bebe prepaga'],
    relacionadas: ['como-afiliarse-prepaga-requisitos', 'cuota-prepaga-por-edad'],
  },
  {
    slug: 'prepaga-corporativa-vs-particular',
    titulo: 'Prepaga corporativa vs. particular: diferencias y qué pasa si dejás la empresa',
    metaDescripcion: 'Diferencia entre la prepaga que te da tu empresa como beneficio y contratarla vos como particular: carencias, cartilla y qué pasa con tu cobertura si renunciás o te despiden.',
    tiempoLectura: 7,
    categoria: 'Trámites',
    fechaActualizacion: '2026-09-17',
    contenido: {
      intro: 'Que tu empresa te dé una prepaga como beneficio no es lo mismo que derivar tus aportes de obra social a una prepaga: son dos mecanismos distintos, con reglas distintas para cuando dejás ese trabajo. Esta guía es sobre el primero — el convenio corporativo directo entre tu empleador y la prepaga — y qué conviene saber antes de que decidan por vos.',
      secciones: [
        {
          titulo: 'Qué es exactamente un plan corporativo',
          cuerpo: 'Es un contrato entre la empresa y la prepaga para todo (o parte de) su personal, negociado como grupo. Al sumar muchos afiliados de una sola vez, la prepaga suele ofrecer mejores condiciones que a un particular: cartilla más amplia, menos restricciones, y es habitual que estos convenios entren directamente sin las carencias que sí aplican a prestaciones superadoras (ortodoncia, cirugía estética) en una contratación individual. No es una obra social derivada — es un contrato aparte que arma tu empleador, y las condiciones exactas las define ese acuerdo puntual, no una ley general.',
        },
        {
          titulo: 'La diferencia clave con la derivación de obra social',
          cuerpo: 'Si derivás tus aportes de obra social a una prepaga (el mecanismo más común y el que tiene protección legal más clara), tenés 3 meses de continuidad garantizados por ley si perdés el trabajo, porque en el fondo seguís cubierto por tu obra social. Un plan corporativo directo es distinto: no está atado a tu obra social, sino al contrato que tiene tu empresa con la prepaga. Cuando dejás la empresa —renuncia o despido— esa cobertura puntual generalmente termina con la última liquidación de sueldo o a fin de mes, según lo que diga el contrato de tu empleador con la prepaga. No asumas que tenés la misma ventana de 3 meses: confirmalo con RRHH, porque depende de ese acuerdo específico, no de una garantía legal uniforme.',
        },
        {
          titulo: 'Qué hacer antes de irte de la empresa',
          cuerpo: 'Pedí el certificado de cobertura (o "certificado de antigüedad" en la prepaga) antes de que se corte tu plan corporativo: acredita cuánto tiempo estuviste cubierto y con qué plan, y sirve para pedir que te reconozcan la antigüedad si te afiliás como particular o negociás la continuidad de las prestaciones superadoras sin nuevas carencias. Pedilo mientras todavía sos empleado — después de la baja es más difícil de gestionar.',
        },
        {
          titulo: 'Recontratar como particular: qué esperar',
          cuerpo: 'Al pasar de corporativo a particular pagás la cuota completa (sin el aporte de tu empleador ni el descuento por volumen del convenio grupal), así que el mismo plan sale más caro. Las prestaciones del PMO nunca tienen carencia, así que esa parte no cambia. Lo que sí puede cambiar son las prestaciones superadoras que el convenio corporativo te daba sin espera: mostrando el certificado de cobertura previa, muchas prepagas te las mantienen sin reiniciar el plazo — pedilo explícitamente, no es automático.',
        },
        {
          titulo: 'El fallo de la Corte Suprema que le da respaldo legal a esto',
          cuerpo: 'En agosto de 2026 la Corte Suprema de Justicia (CSJN) resolvió, en una causa contra Swiss Medical, que la prepaga no está obligada a mantener idénticas las condiciones del plan corporativo después de terminada la relación laboral — pero reconoció que el empleado tiene derecho a pasar a un plan de venta pública de la misma prepaga conservando la antigüedad acumulada. Con más de 12 meses de antigüedad, no te pueden aplicar carencias nuevas ni cobrarte de más por preexistencias. Es exactamente el respaldo legal que confirma todo lo anterior: el certificado de cobertura no es solo una formalidad, es lo que te permite hacer valer este derecho.',
        },
      ],
      conclusion: 'Un plan corporativo es un beneficio real mientras estás en la empresa, pero no tiene la misma red de protección legal que la derivación de aportes de obra social. Antes de dejar el trabajo (por lo que sea), pedí el certificado de cobertura y confirmá con RRHH la fecha exacta en que se corta tu plan — son dos minutos que evitan quedarte con un hueco de cobertura sin darte cuenta.',
    },
    faq: [
      {
        q: '¿Tengo los mismos 3 meses de continuidad que con la obra social si me despiden?',
        a: 'No necesariamente. Los 3 meses de continuidad son una garantía legal ligada a la obra social. Un plan corporativo directo depende del contrato entre tu empresa y la prepaga: puede cortarse antes. Confirmá la fecha exacta con RRHH.',
      },
      {
        q: '¿Puedo pedir que me mantengan la cartilla del plan corporativo si me voy particular?',
        a: 'La cartilla exacta del convenio corporativo (que suele ser más amplia) generalmente no se traslada tal cual a un plan particular: vas a un plan equivalente de la oferta individual de esa prepaga. Lo que sí podés pedir, con el certificado de cobertura, es que no te apliquen de nuevo las carencias de las prestaciones superadoras.',
      },
      {
        q: '¿El plan corporativo tiene carencia para prestaciones superadoras?',
        a: 'Generalmente no: es una de las ventajas de negociar como grupo. Cada convenio es distinto, así que confirmalo en tu caso puntual con RRHH o la prepaga.',
      },
      {
        q: '¿Qué dijo exactamente la Corte Suprema sobre esto?',
        a: 'Que la prepaga no tiene obligación de mantener las condiciones corporativas para siempre, pero que el empleado con más de 12 meses de antigüedad tiene derecho a pasar a un plan individual de la misma prepaga sin carencias nuevas ni recargo por preexistencias.',
      },
    ],
    keywords: ['prepaga corporativa vs particular', 'plan de salud de la empresa que pasa si me voy', 'prepaga de la empresa despido', 'certificado de cobertura prepaga', 'plan corporativo prepaga carencia'],
    relacionadas: ['derivar-obra-social-a-prepaga', 'sin-trabajo-obra-social', 'prepaga-sin-periodo-carencia'],
  },
  {
    slug: 'edad-maxima-afiliarse-prepaga',
    titulo: '¿Hay edad máxima para afiliarse a una prepaga?',
    metaDescripcion: '¿Existe un límite de edad para afiliarse a una prepaga en Argentina? Legalmente no, pero en la práctica hay un corte cerca de los 65 años. Te explicamos los planes complementarios para esa etapa.',
    tiempoLectura: 6,
    categoria: 'Cobertura',
    fechaActualizacion: '2026-09-17',
    contenido: {
      intro: 'Legalmente, ninguna prepaga puede rechazar tu afiliación solo por tu edad. Pero en la práctica, a partir de los 65 años el panorama cambia: los planes integrales tradicionales se vuelven mucho más caros o dejan de ofrecerse como primera opción, y aparecen los planes complementarios, pensados específicamente para esa etapa. Te explicamos cómo funciona.',
      secciones: [
        {
          titulo: 'No hay un límite de edad legal',
          cuerpo: 'La Ley 26.682 (Marco Regulatorio de Medicina Prepaga) prohíbe rechazar una afiliación por edad. Lo que sí puede pasar es que, a partir de cierta edad, el plan integral tradicional tenga una cuota muy alta, o que directamente la prepaga te oriente hacia un plan pensado para adultos mayores en lugar del plan general.',
        },
        {
          titulo: 'Por qué en la práctica el corte está cerca de los 65',
          cuerpo: 'A los 65 años, en general, ya se tiene acceso a una obra social de base: PAMI para la mayoría de los jubilados, o en algunos casos una obra social de convenio que la persona mantiene de su actividad anterior (por ejemplo, quienes trabajaron en el sector salud pueden conservar de por vida la obra social del gremio, como Sanidad, en vez de pasar a PAMI). Sobre esa base, muchas prepagas — Swiss Medical entre ellas — ofrecen planes parciales complementarios en lugar de (o además de) el plan integral.',
        },
        {
          titulo: 'Los planes complementarios: cómo se dividen la cobertura',
          cuerpo: 'La lógica de estos planes parciales es dividir la cobertura en dos partes —ambulatoria e internación— y cubrir solo una de las dos, dejando la otra a cargo de la obra social de base. Un plan tipo "ambulatorio" cubre consultas, tratamientos y estudios, pero la internación queda a cargo de PAMI o la obra social que tengas. Un plan tipo "internación" cubre la parte hospitalaria, mientras que consultas y estudios ambulatorios los resuelve tu obra social. En los dos casos, es un requisito tener una obra social de apoyo vigente (PAMI u otra): estos planes están diseñados para combinar, no para reemplazar por completo una cobertura.',
        },
        {
          titulo: 'Por qué conviene este esquema en vez de forzar un plan integral',
          cuerpo: 'Un plan integral completo a partir de los 65 puede tener una cuota muy elevada. Combinando un plan complementario con la obra social de base, se cubre el punto débil típico de PAMI (comodidad y tiempos de espera en consultas e internación) a un costo más razonable que pagar la cobertura completa de forma privada. Es la misma lógica que explicamos en nuestra guía sobre combinar PAMI con una prepaga particular, pero con productos específicamente diseñados para complementar en vez de duplicar cobertura.',
        },
      ],
      conclusion: 'No hay edad máxima legal para afiliarte a una prepaga, pero a partir de los 65 el camino más habitual deja de ser el plan integral y pasa a ser un plan complementario (ambulatorio o de internación) que trabaja junto a tu obra social de base. Confirmá con la prepaga qué planes complementarios tiene disponibles y cuál conviene según tu obra social actual.',
    },
    faq: [
      {
        q: '¿Una prepaga me puede rechazar por tener 70 años?',
        a: 'No puede rechazarte solo por la edad — está prohibido por ley. Lo que sí puede pasar es que te oriente hacia un plan complementario en lugar del plan integral general, sobre todo si ya tenés una obra social de base.',
      },
      {
        q: '¿Necesito tener PAMI para acceder a un plan complementario?',
        a: 'Necesitás tener alguna obra social de apoyo vigente, sea PAMI u otra (como una obra social de convenio que hayas mantenido de tu actividad laboral anterior). El plan complementario está diseñado para trabajar junto a esa cobertura, no de forma aislada.',
      },
      {
        q: '¿Qué conviene, el plan que cubre ambulatorio o el que cubre internación?',
        a: 'Depende de qué te resuelve peor tu obra social de base. Si tu obra social tiene buena cobertura de internación pero consultas y estudios ambulatorios tardan mucho, conviene el plan complementario ambulatorio. Si es al revés, conviene el de internación. Conversalo con un asesor para definirlo según tu caso.',
      },
    ],
    keywords: ['edad maxima para afiliarse a una prepaga', 'limite de edad prepaga argentina', 'prepaga para mayores de 65 años', 'plan complementario prepaga jubilados', 'prepaga ambulatorio internacion mayores'],
    relacionadas: ['cuota-prepaga-por-edad'],
    prepagasRelacionadas: ['swiss-medical'],
  },
  {
    slug: 'prepaga-cubre-vasectomia-ligadura-cirugia-bariatrica',
    titulo: '¿La prepaga cubre vasectomía, ligadura tubaria y cirugía bariátrica?',
    metaDescripcion: 'Vasectomía, ligadura de trompas y cirugía bariátrica: qué cubren las prepagas en Argentina, el paso por auditoría médica y cómo puede afectar tu cuota.',
    tiempoLectura: 5,
    categoria: 'Cobertura',
    fechaActualizacion: '2026-09-17',
    contenido: {
      intro: 'Vasectomía, ligadura tubaria y cirugía bariátrica están cubiertas por las prepagas en Argentina — son prestaciones incluidas en el Programa Médico Obligatorio (PMO) y en la Ley de Salud Reproductiva. Pero cubierto no siempre significa automático: estos procedimientos pasan por auditoría médica antes de autorizarse, y eso puede tener consecuencias en tu cuota.',
      secciones: [
        {
          titulo: 'Sí, están cubiertas',
          cuerpo: 'La vasectomía y la ligadura tubaria (anticoncepción quirúrgica) están garantizadas por la Ley 26.130 de Contracepción Quirúrgica y forman parte de las prestaciones obligatorias de cualquier prepaga. La cirugía bariátrica está incluida en el PMO para casos de obesidad que cumplen determinados criterios clínicos (generalmente relacionados al índice de masa corporal y a comorbilidades asociadas).',
        },
        {
          titulo: 'El paso obligado: la auditoría médica',
          cuerpo: 'Ninguno de estos tres procedimientos se autoriza de forma directa con solo pedir el turno. Pasan por auditoría médica: un equipo de la prepaga revisa la historia clínica, los estudios previos y los criterios clínicos que justifican la cirugía. En el caso de la cirugía bariátrica en particular, suele exigirse un proceso previo con nutricionista, endocrinólogo y a veces psicólogo, documentando el intento de tratamiento no quirúrgico antes de aprobar la cirugía.',
        },
        {
          titulo: 'Por qué la auditoría puede afectar tu cuota',
          cuerpo: 'La auditoría médica no es solo un trámite de aprobación: dependiendo del caso, puede derivar en un ajuste de la cuota, especialmente si el procedimiento se solicita poco tiempo después de la afiliación o si hay antecedentes que la prepaga considera relevantes para el riesgo cubierto. No es una regla fija ni automática — cada caso se evalúa puntualmente — pero es importante saberlo antes de asumir que el trámite va a ser inmediato y sin ningún impacto.',
        },
        {
          titulo: 'Qué conviene hacer antes de pedir el turno',
          cuerpo: 'Consultá primero con tu asesor o directamente con la prepaga qué documentación específica pide para tu caso, y si corresponde algún período de carencia si te afiliaste recientemente. Tener los estudios y antecedentes ordenados de antemano acelera la auditoría.',
        },
      ],
      conclusion: 'Vasectomía, ligadura tubaria y cirugía bariátrica están cubiertas por ley en todas las prepagas, pero ninguna se autoriza sin pasar antes por auditoría médica, que evalúa el caso puntual y puede implicar un ajuste de cuota según la situación. Confirmá los requisitos específicos con tu prepaga antes de avanzar.',
    },
    faq: [
      {
        q: '¿La vasectomía tiene carencia en la prepaga?',
        a: 'Depende de cuándo te afiliaste. Si tenés una afiliación reciente, puede aplicar un período de carencia para prácticas quirúrgicas programadas. Confirmalo con tu prepaga antes de pedir el turno.',
      },
      {
        q: '¿Qué estudios piden para autorizar una cirugía bariátrica?',
        a: 'Generalmente un proceso previo con nutricionista y endocrinólogo (y en algunos casos psicólogo), documentando intentos previos de tratamiento no quirúrgico y los criterios clínicos que justifican la cirugía. La auditoría médica de la prepaga define el detalle exacto según tu caso.',
      },
      {
        q: '¿Es verdad que puede aumentar la cuota después de una cirugía así?',
        a: 'Puede pasar en algunos casos, dependiendo de la evaluación de auditoría médica, pero no es una regla automática ni universal. No hay un porcentaje fijo: cada caso se analiza puntualmente.',
      },
    ],
    keywords: ['prepaga cubre vasectomia', 'prepaga cubre ligadura de trompas', 'prepaga cubre cirugia bariatrica', 'auditoria medica prepaga cirugia', 'anticoncepcion quirurgica prepaga argentina'],
    relacionadas: ['prepaga-sin-periodo-carencia'],
  },
]

// ── Long tail de preguntas (15-oct-2026, keyword research "cómo / qué /
// cuánto / puedo"): una guía por intención que no tenía página. Las que ya
// tenían (SiRADIG, renuncia, reintegros, cambio en ARCA) se reforzaron en su
// guía para no canibalizar. Cada una enlaza a la página comercial del tema.
const PREPAGAS_DOMICILIO = ['swiss-medical', 'osde', 'galeno', 'medife', 'sancor-salud', 'omint', 'medicus', 'avalian', 'premedic']
const lineaDomicilio = (slug: string) => {
  const c = contactos[slug]
  const p = prepagas.find((x) => x.slug === slug)
  if (!c || !p) return null
  const canales = c.canales.filter((x) => x.tipo === 'emergencias' || /domicilio/i.test(x.etiqueta))
  return canales.length ? `${p.nombre}: ${canales.map((x) => `${x.etiqueta.replace(/^\S/, (ch) => ch.toLowerCase())} ${x.valor}${x.detalle ? ` (${x.detalle})` : ''}`).join('; ')}.` : null
}
const s1Domicilio = SWISS_S1_COPAGOS.find((x) => /domicilio/i.test(x.concepto))?.valor

export const guiasPreguntas: GuiaData[] = [
  {
    slug: 'como-acceder-kinesiologia-prepaga',
    titulo: '¿Cómo acceder a sesiones de kinesiología con tu prepaga u obra social? (sin pagar de más)',
    metaDescripcion: 'Cuántas sesiones de kinesiología te cubre el PMO (25 por año), qué necesitás para pedirlas y cómo conseguir más sesiones sin pagarlas de tu bolsillo.',
    tiempoLectura: 5,
    categoria: 'Coberturas',
    fechaActualizacion: '2026-10-15',
    contenido: {
      intro: 'Toda prepaga y obra social tiene que cubrirte kinesiología: el Programa Médico Obligatorio (PMO) incluye todas las prácticas kinesiológicas y fonoaudiológicas hasta 25 sesiones por año. Para usarlas necesitás una orden médica y, según tu plan, una autorización. Así se hace sin pagar de más.',
      secciones: [
        {
          titulo: 'Cuántas sesiones te cubren por ley',
          cuerpo: 'El piso es el del PMO: hasta 25 sesiones por año de prácticas kinesiológicas y fonoaudiológicas. Es un mínimo: muchos planes dan más sesiones o las cubren sin copago. Lo que cambia entre planes es cuántas sesiones extra te dan, si pagás copago por cada una y con qué kinesiólogos podés atenderte.',
        },
        {
          titulo: 'El paso a paso para empezar',
          cuerpo: 'Uno: pedile a tu médico (traumatólogo, clínico o el especialista que te trate) una orden con el diagnóstico y la cantidad de sesiones. Dos: buscá un kinesiólogo o centro de rehabilitación en la cartilla de tu plan. Tres: si tu prepaga lo pide, cargá la orden para autorizarla (en la app o la web) antes de la primera sesión. Cuatro: guardá las órdenes; cuando se terminan las sesiones autorizadas, tu médico puede indicar más.',
          cta: { texto: 'Si vas a necesitar rehabilitación seguido, mirá qué prepagas tienen mejor cobertura de kinesiología.', boton: 'Ver cobertura de kinesiología por prepaga', href: '/coberturas/rehabilitacion' },
        },
        {
          titulo: 'Cómo conseguir más de 25 sesiones',
          cuerpo: 'Si tu tratamiento necesita más, el camino es el mismo: una nueva orden médica que justifique la continuidad. Muchos planes superiores ya incluyen más sesiones. Si tenés Certificado Único de Discapacidad (CUD), la rehabilitación entra en la Ley 24.901 y la cobertura es del 100%, sin el tope del PMO.',
        },
        {
          titulo: 'Si te rechazan o te cobran de más',
          cuerpo: 'Pedí la negativa por escrito. Las 25 sesiones del PMO no se pueden negar si tenés indicación médica. Reclamá primero a la prepaga y, si no responde, a la Superintendencia de Servicios de Salud.',
          cta: { texto: '¿Tu plan te cobra copago en cada sesión? Compará planes sin copago con el precio oficial para tu edad.', boton: 'Ver planes sin copago', href: '/comparador' },
        },
      ],
      conclusion: 'Kinesiología tenés siempre: 25 sesiones por año como mínimo, con orden médica. Si la vas a usar seguido, lo que más pesa en tu bolsillo es el copago por sesión y la cartilla: ahí conviene comparar planes.',
    },
    faq: [
      { q: '¿Cuántas sesiones de kinesiología cubre la prepaga?', a: 'Como mínimo 25 por año, que es lo que fija el Programa Médico Obligatorio para prácticas kinesiológicas y fonoaudiológicas. Muchos planes dan más.' },
      { q: '¿Necesito orden médica para ir al kinesiólogo?', a: 'Sí. Para que la prepaga u obra social cubra las sesiones necesitás una orden médica con el diagnóstico y la cantidad de sesiones; algunas además piden autorizarla antes.' },
      { q: '¿La kinesiología tiene copago?', a: 'Depende del plan: los planes con copago cobran un monto por sesión y los planes sin copago, no. Revisalo en la ficha de tu plan antes de empezar.' },
      { q: '¿Si tengo CUD tengo más sesiones?', a: 'Sí. Con Certificado Único de Discapacidad la rehabilitación entra en la Ley 24.901, con cobertura del 100% y sin el tope de 25 sesiones del PMO.' },
    ],
    keywords: ['como acceder a kinesiologia', 'cuantas sesiones de kinesiologia cubre la prepaga', 'kinesiologia obra social sesiones', 'kinesiologia prepaga', 'kinesiologia pmo 25 sesiones', 'como pedir kinesiologia obra social'],
    relacionadas: ['como-pedir-autorizacion-prepaga', 'discapacidad-obra-social-cobertura-100', 'reintegros-en-prepagas', 'que-cubre-la-prepaga'],
    fuentes: [
      { texto: 'Ministerio de Justicia — Ley simple: Programa Médico Obligatorio', url: 'https://www.argentina.gob.ar/justicia/derechofacil/leysimple/programa-medico-obligatorio' },
      { texto: 'Resolución 201/2002 del Ministerio de Salud (PMO)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/70000-74999/73649/res201-2002MS-anexoI.htm' },
    ],
  },
  {
    slug: 'medico-a-domicilio-prepaga',
    titulo: 'Médico a domicilio: cómo pedirlo en tu prepaga (teléfonos oficiales 2026)',
    metaDescripcion: 'Cómo pedir médico a domicilio en Swiss Medical, OSDE, Galeno, Medifé, Sancor Salud y más: los teléfonos oficiales de cada una y cuándo te cobran copago.',
    tiempoLectura: 4,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-15',
    contenido: {
      intro: 'Para pedir un médico a domicilio llamás al número de urgencias o de atención médica de tu prepaga: te preguntan los síntomas y, según la gravedad, te mandan un médico o una ambulancia. Acá están los teléfonos oficiales de cada una.',
      secciones: [
        {
          titulo: 'Los teléfonos de cada prepaga',
          cuerpo: PREPAGAS_DOMICILIO.map(lineaDomicilio).filter(Boolean).join(' ') + ' Números copiados de la web oficial de cada prepaga.',
        },
        {
          titulo: 'Cómo es el pedido',
          cuerpo: 'Tené a mano tu número de socio o DNI, la dirección exacta y los síntomas. Te van a hacer preguntas para saber qué tan urgente es: si es una emergencia con riesgo de vida, va una ambulancia; si no, un médico a domicilio. Si es grave, decilo de entrada.',
        },
        {
          titulo: '¿Te cobran la visita?',
          cuerpo: `Depende del plan. Los planes con copago cobran la visita a domicilio: por ejemplo, en el S1 de Swiss Medical es de ${s1Domicilio ?? 'un monto fijo'} según su folleto oficial (${SWISS_COPAGOS_VIGENCIA}). Los planes sin copago, como el SMG20 de Swiss Medical, la cubren sin cargo.`,
          cta: { texto: 'Si pedís médico a domicilio seguido (por chicos o adultos mayores), un plan sin copago puede salirte más barato.', boton: 'Comparar planes sin copago', href: '/comparador' },
        },
      ],
      conclusion: 'Agendá hoy el número de urgencias de tu prepaga: cuando lo necesitás no es momento de buscarlo. Y si usás seguido el médico a domicilio, fijate cuánto te cobra tu plan por visita.',
    },
    faq: [
      { q: '¿Cómo pido un médico a domicilio en mi prepaga?', a: 'Llamando al teléfono de urgencias o atención médica de tu prepaga. Te preguntan los síntomas y, según la gravedad, te mandan un médico o una ambulancia.' },
      { q: '¿El médico a domicilio tiene costo?', a: 'En los planes con copago, sí: se cobra un monto por visita. En los planes sin copago, no.' },
      { q: '¿Cuánto tarda en llegar el médico a domicilio?', a: 'Depende de la gravedad que informes y de la zona. Las emergencias con riesgo de vida tienen prioridad.' },
    ],
    keywords: ['como pedir medico a domicilio', 'medico a domicilio osde', 'medico a domicilio swiss medical', 'medico a domicilio galeno', 'medico a domicilio medife', 'telefono urgencias prepaga'],
    relacionadas: ['urgencias-guardia-prepaga', 'copago-en-prepagas-que-es', 'como-pedir-autorizacion-prepaga'],
    prepagasRelacionadas: ['swiss-medical', 'osde', 'galeno'],
  },
  {
    slug: 'prepaga-cubre-ozempic',
    titulo: '¿La prepaga cubre Ozempic? Qué dice la ley para diabetes y para bajar de peso (2026)',
    metaDescripcion: 'Si tenés diabetes, la Ley de Diabetes obliga a cubrir al 100% los medicamentos necesarios. Para bajar de peso, la semaglutida no está obligada. Qué hacer si te la niegan.',
    tiempoLectura: 5,
    categoria: 'Coberturas',
    fechaActualizacion: '2026-10-15',
    contenido: {
      intro: 'Depende de para qué te lo indiquen. Si tenés diabetes, la ley obliga a obras sociales y prepagas a cubrir al 100% los medicamentos necesarios para tu tratamiento. Si es para bajar de peso, no hay una obligación expresa: es lo que más se discute y hay fallos en los dos sentidos.',
      secciones: [
        {
          titulo: 'Si tenés diabetes: cobertura del 100%',
          cuerpo: 'La Ley de Diabetes (Ley 23.753, actualizada por la Ley 26.914) obliga a cubrir el 100% de los medicamentos y reactivos necesarios para el tratamiento. Para acceder te piden el diagnóstico certificado y la receta. Las prepagas suelen pedir además estudios y la historia de tratamientos previos: presentá todo de entrada para evitar demoras.',
        },
        {
          titulo: 'Si es para bajar de peso',
          cuerpo: 'La semaglutida está aprobada en Argentina para la diabetes. Para tratar la obesidad sin diabetes, la cobertura no es obligatoria y muchas prepagas la rechazan. Hay casos en que la Justicia ordenó cubrirla a pacientes con obesidad, pero es caso por caso y con indicación médica fundada.',
        },
        {
          titulo: 'Si te la niegan',
          cuerpo: 'Pedí la negativa por escrito y guardá la receta, el diagnóstico y las facturas. Reclamá a la prepaga y, si no responde, a la Superintendencia de Servicios de Salud. En diabetes, la ley está de tu lado; en obesidad, conviene el asesoramiento de un abogado especializado.',
          cta: { texto: 'Si tenés diabetes, mirá qué prepagas tienen mejor cobertura de medicamentos y programas de seguimiento.', boton: 'Ver prepagas para diabetes', href: '/condiciones/diabetes' },
        },
      ],
      conclusion: 'Con diabetes, la cobertura del 100% es tu derecho: presentá diagnóstico y receta. Para bajar de peso, no está garantizada. En los dos casos, pedí siempre la respuesta por escrito.',
    },
    faq: [
      { q: '¿La prepaga cubre Ozempic para la diabetes?', a: 'La Ley de Diabetes obliga a cubrir al 100% los medicamentos necesarios para el tratamiento de la diabetes, con diagnóstico y receta. Si te lo niegan, reclamá a la prepaga y a la Superintendencia de Servicios de Salud.' },
      { q: '¿La prepaga cubre Ozempic para bajar de peso?', a: 'No es obligatorio: la semaglutida está aprobada para la diabetes. Hay fallos que ordenaron cubrirla en casos de obesidad, pero se decide caso por caso.' },
      { q: '¿Qué necesito para que me cubran la semaglutida?', a: 'Diagnóstico de diabetes certificado y receta del médico. Muchas prepagas piden además estudios recientes y los tratamientos que probaste antes.' },
    ],
    keywords: ['prepaga cubre ozempic', 'que prepaga cubre ozempic', 'obra social cubre semaglutida', 'ozempic cobertura 100 diabetes', 'ozempic para bajar de peso prepaga', 'semaglutida cobertura'],
    relacionadas: ['como-reclamar-a-una-prepaga', 'que-cubre-la-prepaga', 'prepaga-cubre-vasectomia-ligadura-cirugia-bariatrica'],
    fuentes: [
      { texto: 'Ministerio de Justicia — Ley simple: Diabetes', url: 'https://www.argentina.gob.ar/justicia/derechofacil/leysimple/diabetes' },
    ],
  },
  {
    slug: 'contratar-prepaga-embarazada',
    titulo: '¿Puedo contratar una prepaga estando embarazada? Lo que dice la ley (2026)',
    metaDescripcion: 'Sí: la Ley 26.682 prohíbe rechazar a alguien por una preexistencia. Qué te pueden pedir, qué cubre el Plan Materno Infantil y cómo elegir plan si estás embarazada.',
    tiempoLectura: 5,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-15',
    contenido: {
      intro: 'Sí. La Ley de Medicina Prepaga (26.682) dice que las preexistencias no pueden ser motivo de rechazo: no te pueden negar la afiliación por estar embarazada. Lo que sí pasa es que te piden declararlo en la declaración jurada y, en algunos casos, la prepaga intenta cobrar un valor diferencial.',
      secciones: [
        {
          titulo: 'Qué dice la ley',
          cuerpo: 'La Ley 26.682 establece que las enfermedades preexistentes solo se determinan por la declaración jurada del usuario y no pueden ser criterio de rechazo de admisión. La Justicia, además, tiene fallos que dicen que el embarazo no es una enfermedad preexistente y que no se puede dar de baja a una afiliada por no haberlo declarado.',
        },
        {
          titulo: 'Declaralo siempre',
          cuerpo: 'En la declaración jurada de salud tenés que informar el embarazo. Ocultarlo es lo que después da lugar a conflictos. Declarado, la prepaga no te puede rechazar; si te quiere cobrar un valor diferencial, pedí que te lo justifique por escrito.',
        },
        {
          titulo: 'Qué te cubre: el Plan Materno Infantil',
          cuerpo: 'Por el Programa Médico Obligatorio está cubierto todo el embarazo y hasta el primer mes después del nacimiento; la atención del bebé se cubre hasta el año, con la medicación específica al 100%, las vacunas obligatorias y las leches especiales si hay indicación médica.',
          cta: { texto: 'Lo que cambia entre prepagas es dónde parís: el sanatorio y la habitación. Compará planes con el sanatorio que querés.', boton: 'Ver prepagas para embarazadas', href: '/para/embarazadas' },
        },
        {
          titulo: 'Si ya tenés obra social',
          cuerpo: 'Si trabajás en relación de dependencia, podés derivar tus aportes a la prepaga con la opción de cambio y pagar solo la diferencia. Así sumás el sanatorio que querés sin pagar el plan entero.',
          cta: { texto: 'Calculá cuánto pagarías de diferencia con tus aportes.', boton: 'Calcular con mis aportes', href: '/calculadora-aportes' },
        },
      ],
      conclusion: 'Estar embarazada no te impide contratar una prepaga: declaralo y elegí el plan por el sanatorio donde querés parir. Si te ponen trabas, la ley está de tu lado.',
    },
    faq: [
      { q: '¿Quién paga la obra social durante la licencia por maternidad?', a: 'Durante la licencia, el ingreso lo paga ANSES con la Asignación por Maternidad. La relación laboral sigue vigente, así que conservás tu obra social (o tu prepaga, si derivás los aportes). Confirmá con tu empleador cómo se refleja en tu recibo.' },
      { q: '¿Me pueden rechazar en una prepaga por estar embarazada?', a: 'No. La Ley 26.682 dice que las preexistencias no pueden ser criterio de rechazo de admisión, y hay fallos que dicen que el embarazo no es una enfermedad preexistente.' },
      { q: '¿Tengo que declarar el embarazo?', a: 'Sí, en la declaración jurada de salud. Ocultarlo es lo que después puede generar conflictos con la prepaga.' },
      { q: '¿Me pueden cobrar más por estar embarazada?', a: 'La ley permite valores diferenciales autorizados para preexistencias, y es lo que algunas prepagas invocan. La Justicia tiene fallos que dicen que el embarazo no es una preexistencia: pedí que te lo justifiquen por escrito.' },
      { q: '¿Puedo cambiar de obra social estando embarazada?', a: 'Sí, la opción de cambio no tiene restricción por embarazo. El cambio se activa el primer día del mes siguiente a la confirmación.' },
    ],
    keywords: ['puedo contratar una prepaga estando embarazada', 'prepaga embarazada', 'se puede contratar prepaga estando embarazada', 'cambiar de prepaga estando embarazada', 'cambiar de obra social estando embarazada', 'embarazo preexistencia prepaga'],
    relacionadas: ['plan-materno-infantil', 'opcion-de-cambio-obra-social', 'derivar-obra-social-a-prepaga', 'afiliar-recien-nacido-prepaga', 'prepaga-sin-periodo-carencia'],
    fuentes: [
      { texto: 'Ley 26.682 de Medicina Prepaga (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/norma.htm' },
      { texto: 'Ministerio de Justicia — Ley simple: Programa Médico Obligatorio', url: 'https://www.argentina.gob.ar/justicia/derechofacil/leysimple/programa-medico-obligatorio' },
    ],
  },
  // 17-oct-2026: el Plan Materno Infantil tiene 371 búsquedas en la lista de
  // keywords de Darío (por obra social y por prepaga) y no había página propia.
  // Alcance confirmado por Darío (asesor): el PMI cubre hasta el año de vida del
  // bebé, con leches medicamentosas al 100 % con indicación médica, y la
  // cobertura sigue con la nueva prepaga si se cambia dentro del primer año.
  {
    slug: 'plan-materno-infantil',
    titulo: 'Plan Materno Infantil (PMI): qué cubre, hasta cuándo y cómo activarlo (2026)',
    metaDescripcion: 'El PMI cubre el embarazo, el parto y al bebé hasta el año, con la medicación específica y las leches medicamentosas al 100 %. Qué incluye, cómo activarlo y qué pasa si cambiás de prepaga.',
    tiempoLectura: 5,
    categoria: 'Cobertura',
    fechaActualizacion: '2026-10-17',
    contenido: {
      intro: 'El Plan Materno Infantil (PMI) es parte del Programa Médico Obligatorio: toda obra social y prepaga tiene que dar esta cobertura, sin importar el plan que tengas. Cubre el embarazo, el parto y al bebé durante su primer año de vida, y la medicación específica sale al 100 %. Acá está lo que más se busca: qué incluye, hasta cuándo dura, cómo se activa y qué pasa con la leche y con un cambio de prepaga.',
      secciones: [
        {
          titulo: 'Qué es el Plan Materno Infantil',
          cuerpo: 'Es la cobertura mínima obligatoria para la madre durante el embarazo y el parto, y para el bebé durante su primer año. Está dentro del Programa Médico Obligatorio (PMO): no es un plan que se contrate aparte ni un beneficio de una marca en particular. OSDE, Swiss Medical, Sancor Salud, Galeno, Omint y cualquier otra prepaga u obra social lo tienen que cubrir; lo que cambia de una a otra es la red de sanatorios, la habitación y los servicios que suman por encima del mínimo.',
          enlaces: [{ texto: 'Ministerio de Justicia — Programa Médico Obligatorio', url: 'https://www.argentina.gob.ar/justicia/derechofacil/leysimple/programa-medico-obligatorio' }],
        },
        {
          titulo: 'Qué cubre',
          cuerpo: 'Durante el embarazo: controles, estudios y medicación relacionada, sin coseguros. El parto: la atención y la internación. Después del nacimiento: la atención del bebé hasta que cumple un año, con la medicación específica al 100 %, las vacunas del calendario obligatorio y los controles de salud. Las leches medicamentosas también se cubren al 100 % cuando hay indicación médica expresa; la leche de fórmula común no se cubre sin esa indicación, porque el sistema busca estimular la lactancia materna.',
        },
        {
          titulo: 'Hasta cuándo dura',
          cuerpo: 'Hasta el año de vida del bebé. Es el dato que más confusión genera: el PMI no se extiende a los 3 años. Después del primer año, lo que cubre la prepaga depende de cada prestación y de tu plan, y la leche medicamentosa con indicación médica tiene su propia normativa: pedí siempre la indicación por escrito del pediatra.',
        },
        {
          titulo: 'Cómo se activa',
          cuerpo: 'Se pide a la prepaga u obra social, no se activa solo. Lo habitual es presentar el certificado médico de embarazo para el alta del PMI y, cuando nace el bebé, los datos del recién nacido para incorporarlo al plan. Cada empresa tiene su canal (autogestión, app o atención al socio), así que el primer paso es llamar o escribir y pedir "el alta del Plan Materno Infantil". Si te dicen que no existe, es un error: es una obligación del PMO.',
          cta: { texto: 'Si todavía no tenés cobertura, compará qué sanatorio y qué habitación te da cada plan antes del parto.', boton: 'Ver prepagas para embarazadas', href: '/para/embarazadas' },
        },
        {
          titulo: 'Si cambiás de prepaga durante el primer año',
          cuerpo: 'La obligación del PMI la tiene la prepaga u obra social que te cubre en ese momento. Si el bebé tiene 6 meses y te pasás a otra, la nueva cobertura tiene que seguir dando el PMI hasta que cumpla el año. Conviene pedir el alta del PMI en el mismo trámite del cambio y llevar la indicación médica de la leche, si la tiene, para que no haya cortes.',
        },
      ],
      conclusion: 'El Plan Materno Infantil es un derecho que no depende de la marca ni del plan: embarazo, parto y bebé hasta el año, con la medicación específica y las leches medicamentosas al 100 %. Pedí el alta en cuanto sepas del embarazo y guardá todo por escrito. La diferencia entre prepagas está en el sanatorio y la habitación donde parís.',
    },
    faq: [
      { q: '¿Qué cubre el Plan Materno Infantil?', a: 'El embarazo, el parto y la atención del bebé hasta el año de vida. La medicación específica va al 100 % y sin coseguros, igual que las vacunas obligatorias y los controles. Las leches medicamentosas, con indicación médica expresa.' },
      { q: '¿Hasta qué edad cubre el Plan Materno Infantil?', a: 'Hasta que el bebé cumple un año. No llega a los 3 años: después del primer año, la cobertura depende de cada prestación y de tu plan.' },
      { q: '¿El Plan Materno Infantil cubre la leche?', a: 'Cubre al 100 % las leches medicamentosas cuando hay indicación médica expresa. La leche de fórmula sin indicación médica no se cubre, porque la norma prioriza la lactancia materna.' },
      { q: '¿Cómo activo el Plan Materno Infantil en mi prepaga?', a: 'Pidiendo el alta del PMI a tu prepaga u obra social, con el certificado médico de embarazo; después se incorpora al bebé con los datos del nacimiento. Cada una tiene su canal de atención.' },
      { q: '¿Qué pasa con el PMI si me paso a otra prepaga?', a: 'La cobertura sigue con la nueva: si el bebé tiene 6 meses, la nueva prepaga tiene que cubrirlo hasta el año. Pedí el alta del PMI en el mismo trámite del cambio.' },
      { q: '¿Es lo mismo en todas las prepagas y obras sociales?', a: 'El mínimo sí, porque lo fija el PMO. Lo que cambia es la red de sanatorios, el tipo de habitación y los beneficios que cada empresa suma por encima del mínimo.' },
      { q: '¿Tengo que pagar coseguro por el PMI?', a: 'No. Las prestaciones del Plan Materno Infantil se cubren sin coseguros ni copagos.' },
    ],
    keywords: ['plan materno infantil', 'que cubre el plan materno infantil', 'plan materno infantil hasta que edad cubre', 'plan materno infantil leche', 'como activar el plan materno infantil', 'plan materno infantil prepagas', 'plan materno infantil osde', 'plan materno infantil swiss medical', 'plan materno infantil sancor salud', 'pmi plan materno infantil'],
    relacionadas: ['contratar-prepaga-embarazada', 'afiliar-recien-nacido-prepaga', 'como-cambiar-de-prepaga', 'que-cubre-la-prepaga'],
    prepagasRelacionadas: ['osde', 'swiss-medical', 'sancor-salud'],
    fuentes: [
      { texto: 'Ministerio de Justicia — Ley simple: Programa Médico Obligatorio', url: 'https://www.argentina.gob.ar/justicia/derechofacil/leysimple/programa-medico-obligatorio' },
    ],
  },
  // 17-oct-2026: la Ley de Diabetes se repite en las listas de keywords de
  // Medicus, Omint, Prevención, Unión Personal y Swiss ("formulario diabetes",
  // "empadronamiento diabetes"). Norma: Ley 26.914 (art. 5), Res. 1156/2014
  // (Anexo II, Normas de Provisión) y Res. 2820/2022 (sensores flash), según
  // los textos citados en fallos y notas jurídicas.
  {
    slug: 'ley-de-diabetes-cobertura-prepaga',
    titulo: 'Ley de Diabetes: qué cubre tu prepaga u obra social al 100 % y cómo pedirlo (2026)',
    metaDescripcion: 'La Ley 26.914 obliga a prepagas y obras sociales a cubrir al 100 % los medicamentos y las tiras reactivas de la diabetes. Qué incluye, qué documentación piden y cómo reclamar si la niegan.',
    tiempoLectura: 5,
    categoria: 'Cobertura',
    fechaActualizacion: '2026-10-17',
    contenido: {
      intro: 'Si tenés diabetes, tu prepaga u obra social está obligada por ley a cubrirte al 100 % los medicamentos y las tiras reactivas para el autocontrol, en las cantidades que indique tu médico. No depende del plan que tengas ni de la marca. Lo que sí cambia es el trámite: casi todas piden una documentación específica y la renovación es periódica.',
      secciones: [
        {
          titulo: 'Qué dice la ley',
          cuerpo: 'La Ley Nacional de Diabetes (26.914) amplió la ley 23.753 de 1989. Su artículo 5 establece la cobertura del 100 % de los medicamentos y de los reactivos de diagnóstico para el autocontrol, según la prescripción médica. Aplica a las obras sociales y también a las empresas de medicina prepaga: la Justicia las equiparó en sus obligaciones. Qué se entrega y en qué cantidades lo definen las Normas de Provisión de Medicamentos e Insumos para Personas con Diabetes (Resolución 1156/2014 del Ministerio de Salud, Anexo II), parte del Programa Médico Obligatorio.',
        },
        {
          titulo: 'Qué incluye',
          cuerpo: 'Los medicamentos para tratar la diabetes (insulinas y antidiabéticos orales), las tiras reactivas y los insumos de autocontrol, según las Normas de Provisión vigentes. La Resolución 2820/2022 actualizó el listado e incorporó la cobertura al 100 % de los sensores de monitoreo continuo de glucosa tipo flash. Las cantidades tienen tope: lo que fija la norma para tu situación clínica, no lo que pida una persona sin indicación médica.',
        },
        {
          titulo: 'Qué te piden para empezar',
          cuerpo: 'Cada prepaga tiene su formulario, pero el pedido casi siempre incluye: el certificado que acredita que tenés diabetes (una declaración jurada firmada por tu médico y por vos, que se renueva cada seis meses), la receta con los medicamentos e insumos y sus cantidades, los análisis de laboratorio (hemoglobina glicosilada, glucemia, perfil lipídico, función renal) y un resumen de tu historia clínica. Si pedís un sensor de glucosa, suelen sumar un informe de tus mediciones de los últimos meses. Pedí el formulario en tu prepaga: muchas lo publican en su web.',
          cta: { texto: 'Si estás eligiendo prepaga, mirá cómo manejan la diabetes las que más se consultan.', boton: 'Ver prepagas para diabéticos', href: '/condiciones/diabetes' },
        },
        {
          titulo: 'Qué hacer si te lo niegan o te lo demoran',
          cuerpo: 'Pedí la negativa por escrito, con el motivo. La ley es clara en el 100 % de medicamentos y reactivos con prescripción, así que una negativa genérica no alcanza. Reclamá por los canales de la empresa, después ante la Superintendencia de Servicios de Salud y, si hace falta, con un amparo: la Justicia viene ordenando coberturas de sensores y medicación.',
          cta: { texto: 'Paso a paso para reclamar a una prepaga u obra social.', boton: 'Cómo reclamar', href: '/guias/como-reclamar-a-una-prepaga' },
        },
      ],
      conclusion: 'La cobertura de la diabetes al 100 % es un derecho que rige para toda prepaga y obra social. Lo único que tenés que hacer es reunir la documentación, renovar el certificado cada seis meses y exigir la negativa por escrito si te la niegan.',
    },
    faq: [
      { q: '¿La prepaga está obligada a cubrir la diabetes al 100 %?', a: 'Sí. La Ley 26.914 establece la cobertura total de los medicamentos y de los reactivos de autocontrol, según la prescripción médica, y alcanza a obras sociales y prepagas.' },
      { q: '¿Qué cubre la Ley de Diabetes?', a: 'Los medicamentos para la diabetes, las tiras reactivas y los insumos de autocontrol que fijan las Normas de Provisión, y desde la Resolución 2820/2022 también los sensores de monitoreo continuo de glucosa tipo flash.' },
      { q: '¿Cada cuánto hay que renovar el certificado de diabetes?', a: 'Las prepagas lo piden en forma semestral, y también cuando cambia la dosis o la medicación. Es una declaración jurada firmada por el médico y por el paciente.' },
      { q: '¿Qué documentación piden para dar la cobertura?', a: 'Certificado de diabetes firmado, receta con medicamentos e insumos y cantidades, laboratorio actualizado y resumen de historia clínica. Cada prepaga tiene su formulario.' },
      { q: '¿La cobertura incluye los sensores de glucosa?', a: 'Los sensores tipo flash están incluidos desde la Resolución 2820/2022. Suelen pedir informes de automonitoreo y la indicación del especialista.' },
      { q: '¿Qué hago si me niegan los medicamentos o las tiras?', a: 'Pedí la negativa por escrito, reclamá en la empresa y después ante la Superintendencia de Servicios de Salud. Si hace falta, la Justicia viene concediendo amparos por medicación y sensores.' },
    ],
    keywords: ['ley de diabetes', 'ley de diabetes cobertura prepaga', 'ley 26914', 'cobertura diabetes 100 prepaga', 'formulario diabetes prepaga', 'empadronamiento diabetes', 'tiras reactivas cobertura', 'insulina cobertura obra social', 'sensor de glucosa cobertura prepaga', 'diabetes prepaga'],
    relacionadas: ['que-cubre-la-prepaga', 'como-reclamar-a-una-prepaga', 'como-pedir-autorizacion-prepaga', 'prepaga-cubre-ozempic'],
    fuentes: [
      { texto: 'Superintendencia de Servicios de Salud', url: 'https://www.argentina.gob.ar/sssalud' },
      { texto: 'Ministerio de Justicia — Ley simple: Programa Médico Obligatorio', url: 'https://www.argentina.gob.ar/justicia/derechofacil/leysimple/programa-medico-obligatorio' },
    ],
  },
  // 17-oct-2026: "receta digital / por WhatsApp" y "cuánto duran las recetas y
  // órdenes" aparecen en las listas de keywords de casi todas las marcas.
  // Fuentes: notas oficiales de argentina.gob.ar sobre el Decreto 98/2023 (Ley
  // 27.553) y la Resolución 2214/2025 del Ministerio de Salud.
  {
    slug: 'recetas-electronicas-ordenes-medicas-prepaga',
    titulo: 'Recetas electrónicas y órdenes médicas: qué valen hoy, cuánto duran y qué hacer (2026)',
    metaDescripcion: 'La receta de medicamentos es electrónica desde 2025: una foto o un WhatsApp no valen. Cuánto dura una receta (30 y 90 días), cuándo sigue valiendo el papel y qué pasa con las órdenes de estudios.',
    tiempoLectura: 5,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-17',
    contenido: {
      intro: 'Desde enero de 2025 la receta de medicamentos tiene que ser electrónica, y desde la Resolución 2214/2025 lo mismo rige para las órdenes de estudios y prácticas. Una foto de la receta o una captura enviada por WhatsApp ya no es una receta válida. Esto es lo que necesitás saber: qué vale, cuánto dura y qué hacer si te piden papel.',
      secciones: [
        {
          titulo: 'Qué cambió',
          cuerpo: 'La Ley 27.553 permite recetar y dispensar medicamentos con firma electrónica o digital, y el Decreto 98/2023 la reglamentó. Desde el 1 de enero de 2025 la receta electrónica es obligatoria para los medicamentos. La Resolución 2214/2025 del Ministerio de Salud la extendió a los medicamentos de prescripción restringida, los estudios, las prácticas, los procedimientos y los dispositivos médicos: todas las órdenes médicas deben emitirse de forma electrónica, desde plataformas registradas. Rige igual para quien tiene obra social, prepaga o cobertura estatal.',
          enlaces: [{ texto: 'Argentina.gob.ar — Resolución 2214/2025', url: 'https://www.argentina.gob.ar/node/473332' }],
        },
        {
          titulo: 'Cuánto dura una receta',
          cuerpo: 'Según el Decreto 98/2023, la receta electrónica de un medicamento vale 30 días y las demás prescripciones, 60 días, salvo que otra norma diga otra cosa. Para los tratamientos crónicos se pueden extender recetas por períodos de hasta 90 días (Resolución 27/2022 del Ministerio de Salud). Cuenta desde la fecha de emisión: si pasó el plazo, pedí una nueva a tu médico.',
          enlaces: [{ texto: 'Argentina.gob.ar — Decreto 98/2023', url: 'https://www.argentina.gob.ar/node/362409' }],
        },
        {
          titulo: 'Qué no vale',
          cuerpo: 'La foto de una receta en papel, una captura de pantalla o un mail no son recetas electrónicas ni digitales. Esas modalidades se habilitaron durante la pandemia y dejaron de valer a fines de 2022, con excepciones hasta el 28 de febrero de 2023. Si tu médico te manda la receta por WhatsApp, pedile que la emita desde una plataforma habilitada.',
        },
        {
          titulo: 'Cuándo sigue valiendo el papel',
          cuerpo: 'La Resolución 2214/2025 aclara que la receta en papel sigue vigente donde no sea posible implementar la electrónica, por ejemplo en localidades alejadas o con problemas de conectividad. Fuera de esos casos, lo que debería pasar es que el médico la emita en forma electrónica. Si una farmacia o una prepaga te rechaza una receta, pedí el motivo por escrito.',
        },
        {
          titulo: 'Cómo funciona',
          cuerpo: 'Cada paciente se identifica con su CUIL y cada receta tiene una Clave Única de Identificación de Receta (CUIR). Las recetas de medicamentos restringidos se conservan digitalmente al menos tres años. Para las órdenes de estudios, cuánto tiempo podés demorar en usarlas depende de cada prepaga: preguntalo antes de que se te venza.',
          cta: { texto: 'Si necesitás una autorización o un reintegro, acá está el paso a paso.', boton: 'Cómo pedir autorización', href: '/guias/como-pedir-autorizacion-prepaga' },
        },
      ],
      conclusion: 'La receta de medicamentos es electrónica desde 2025 y las órdenes de estudios, desde la Resolución 2214/2025. Una foto o un WhatsApp no alcanzan; el papel queda solo para los lugares donde no se puede. Mirá la fecha de emisión: una receta dura 30 días, y hasta 90 si es de un tratamiento crónico.',
    },
    faq: [
      { q: '¿Sirve la foto de la receta por WhatsApp?', a: 'No. La foto de una receta en papel, una captura o un mail no son recetas electrónicas ni digitales. Pedile a tu médico que la emita desde una plataforma habilitada.' },
      { q: '¿Cuánto dura una receta electrónica?', a: 'Treinta días para los medicamentos y 60 días para otras prescripciones, según el Decreto 98/2023. Los tratamientos crónicos pueden tener recetas de hasta 90 días.' },
      { q: '¿Siguen valiendo las recetas en papel?', a: 'Solo donde no se pueda implementar la receta electrónica, por ejemplo en localidades alejadas o con mala conectividad, según la Resolución 2214/2025. En el resto, la receta tiene que ser electrónica.' },
      { q: '¿Las órdenes de estudios también tienen que ser electrónicas?', a: 'Sí. La Resolución 2214/2025 extendió la obligación a estudios, prácticas, procedimientos y dispositivos médicos.' },
      { q: '¿Rige también para obras sociales y prepagas?', a: 'Sí, rige sin importar si el paciente tiene cobertura estatal, sindical o privada.' },
      { q: '¿Cuánto tiempo tengo para usar una orden de estudios?', a: 'Lo define cada prepaga u obra social. Consultalo en tu app o con atención al socio antes de que venza.' },
    ],
    keywords: ['recetas electronicas', 'receta digital', 'receta por whatsapp', 'cuanto dura una receta', 'cuanto duran las ordenes', 'cuanto duran las recetas', 'ley 27553', 'receta electronica obligatoria', 'ordenes medicas electronicas', 'recetas electronicas prepaga'],
    relacionadas: ['como-pedir-autorizacion-prepaga', 'que-cubre-la-prepaga', 'ley-de-diabetes-cobertura-prepaga', 'como-reclamar-a-una-prepaga'],
    fuentes: [
      { texto: 'Argentina.gob.ar — Decreto 98/2023: Recetas electrónicas y digitales', url: 'https://www.argentina.gob.ar/node/362409' },
      { texto: 'Argentina.gob.ar — Resolución 2214/2025: receta electrónica para todas las indicaciones', url: 'https://www.argentina.gob.ar/node/473332' },
    ],
  },
  // 17-oct-2026: "formulario 310 enfermedades crónicas" aparece en las listas de
  // Swiss, Unión Personal y Omint. Texto verificado en la Resolución 310/2004
  // (B.O. 15/04/2004), art. 2: apartado 7 del Anexo I de la Res. 201/2002.
  {
    slug: 'medicacion-cronica-70-resolucion-310-2004',
    titulo: 'Medicación crónica: la Resolución 310/2004, el 70 % de cobertura y el formulario de crónicos',
    metaDescripcion: 'Los remedios para enfermedades crónicas tienen 70 % de cobertura (40 % los de uso habitual) según la Resolución 310/2004. Cómo se calcula, qué medicamentos entran y cómo pedir el formulario.',
    tiempoLectura: 6,
    categoria: 'Cobertura',
    fechaActualizacion: '2026-10-17',
    contenido: {
      intro: 'Si tomás medicación todos los meses (presión, colesterol, tiroides, epilepsia, glaucoma…), tu prepaga u obra social te tiene que cubrir una parte por ley. La norma que lo establece es la Resolución 310/2004 del Ministerio de Salud, que fijó el 70 % para los medicamentos de patologías crónicas prevalentes y el 40 % para los de uso habitual. Acá va cómo se calcula y qué trámite te piden.',
      secciones: [
        {
          titulo: 'Qué dice la Resolución 310/2004',
          cuerpo: 'El artículo 2 reescribió el apartado 7 del Anexo I de la Resolución 201/2002 (el PMO). Los medicamentos de uso ambulatorio que figuran en el Anexo III tienen un 40 % a cargo del agente del seguro de salud cuando son de uso habitual y un 70 % cuando son para patologías crónicas prevalentes, es decir, las que requieren el empleo de fármacos de modo permanente o recurrente. Los medicamentos suministrados durante la internación tienen cobertura del 100 %.',
          enlaces: [{ texto: 'Resolución 310/2004 (texto oficial, PDF)', url: 'https://www.argentina.gob.ar/sites/default/files/resolucion_310_2004.pdf' }],
        },
        {
          titulo: 'El porcentaje se calcula sobre un precio de referencia',
          cuerpo: 'La cobertura no se aplica sobre lo que cuesta en la farmacia, sino sobre un precio de referencia de monto fijo que fija el Ministerio (Anexo IV), por forma farmacéutica, concentración y presentación. Por eso, si el remedio sale más caro que el precio de referencia, el descuento real que ves en el mostrador puede ser menor al 70 %. La resolución también prevé que los medicamentos de alternativa terapéutica (Anexo V) los resuelva la auditoría médica de cada prepaga.',
        },
        {
          titulo: 'Qué medicamentos entran',
          cuerpo: 'Los del Formulario Terapéutico de los Anexos III y IV. En el listado de 2004 figuraban con 70 % medicamentos como atorvastatina, captopril, clopidogrel, glimepirida, gabapentina y latanoprost, y con 40 % los de uso habitual como alprazolam, cetirizina o celecoxib. El Ministerio actualizó listados y precios después, así que la lista vigente la tiene tu prepaga: pedila antes de comprar. Algunos medicamentos tienen 100 %: insulina, anticonceptivos de la Ley 25.673, drogas para la tuberculosis, la medicación de soporte de la quimioterapia y los de los programas especiales.',
        },
        {
          titulo: 'Cómo se pide: el formulario de crónicos',
          cuerpo: 'Para el 70 %, la prepaga te pide acreditar que tenés la patología crónica: un formulario con el diagnóstico firmado por tu médico (muchas lo llaman "formulario de crónicos" o "formulario 310") y la receta con la medicación. Cada prepaga tiene su formulario y define cada cuánto hay que renovarlo: pedilo en tu app o en atención al socio. Si la medicación tiene una norma propia, como la insulina para la diabetes, se aplica esa.',
          cta: { texto: 'Ver cómo cubre el costo mensual de medicación cada prepaga.', boton: 'Ver qué cubre la prepaga', href: '/guias/que-cubre-la-prepaga' },
        },
        {
          titulo: 'Si te dan el 40 % en un remedio crónico',
          cuerpo: 'Preguntá por qué: si el medicamento está en el listado de crónicos y tenés el formulario aprobado, te corresponde el 70 %. Pedí la negativa por escrito y reclamá; la Justicia viene aplicando el 70 % a las prepagas en casos de patologías crónicas.',
        },
      ],
      conclusion: 'La Resolución 310/2004 garantiza el 70 % de los medicamentos de enfermedades crónicas prevalentes y el 40 % de los de uso habitual, calculado sobre un precio de referencia. Pedí el formulario de crónicos, verificá en el listado de tu prepaga y guardá siempre las negativas por escrito.',
    },
    faq: [
      { q: '¿Qué es la Resolución 310/2004?', a: 'Una resolución del Ministerio de Salud (B.O. 15/04/2004) que modificó el PMO: fijó el 40 % de cobertura para los medicamentos de uso habitual y el 70 % para los de patologías crónicas prevalentes, sobre un precio de referencia.' },
      { q: '¿Qué porcentaje cubre la prepaga en los medicamentos crónicos?', a: 'El 70 % del precio de referencia para los medicamentos de patologías crónicas prevalentes del Formulario Terapéutico; algunos, como la insulina, tienen 100 %.' },
      { q: '¿Qué es el formulario 310?', a: 'Es el formulario de crónicos que muchas prepagas piden para acceder al 70 %: un diagnóstico firmado por el médico. Cada empresa tiene su modelo.' },
      { q: '¿Por qué pago más del 30 % en la farmacia?', a: 'Porque el porcentaje se aplica sobre un precio de referencia de monto fijo, no sobre el precio de venta. Si el remedio cuesta más que la referencia, la diferencia la pagás vos.' },
      { q: '¿Qué medicamentos cubren al 100 %?', a: 'Entre otros, la insulina, los anticonceptivos de la Ley 25.673, las drogas para la tuberculosis, la medicación de soporte de la quimioterapia y los de la internación.' },
      { q: '¿Rige para las prepagas o solo para las obras sociales?', a: 'Rige para los agentes del seguro de salud y, por las normas del PMO, también para las prepagas; la Justicia las equipara en estas obligaciones.' },
    ],
    keywords: ['resolucion 310 2004', 'formulario 310', 'ley de cronicos', 'medicacion cronica prepaga', 'cobertura 70 medicamentos', 'medicamentos cronicos obra social', 'medicamentos al 70', 'situacion terapeutica cronicos', 'formulario enfermedades cronicas', 'cuanto cubre la prepaga en medicamentos'],
    relacionadas: ['que-cubre-la-prepaga', 'ley-de-diabetes-cobertura-prepaga', 'como-reclamar-a-una-prepaga', 'recetas-electronicas-ordenes-medicas-prepaga'],
    fuentes: [
      { texto: 'Resolución 310/2004 del Ministerio de Salud (texto oficial)', url: 'https://www.argentina.gob.ar/sites/default/files/resolucion_310_2004.pdf' },
      { texto: 'Ministerio de Justicia — Ley simple: Programa Médico Obligatorio', url: 'https://www.argentina.gob.ar/justicia/derechofacil/leysimple/programa-medico-obligatorio' },
    ],
  },
  // 17-oct-2026: "formulario anticonceptivos" y "empadronamiento anticonceptivos"
  // en las listas de OSDE, Sancor y Prevención. Norma verificada: Ley 25.673 y
  // Resolución 310/2004 (art. 1 y art. 2, apartado 7.3). Métodos incorporados
  // después, según Chequeado.
  {
    slug: 'anticonceptivos-cobertura-100-prepaga',
    titulo: 'Anticonceptivos: la prepaga u obra social tiene que cubrirlos al 100 % (cómo pedirlos)',
    metaDescripcion: 'Por la Ley 25.673 y el PMO, prepagas y obras sociales cubren anticonceptivos al 100 % y sin coseguro. Qué métodos incluye, cómo pedirlos y qué hacer si te los niegan.',
    tiempoLectura: 4,
    categoria: 'Cobertura',
    fechaActualizacion: '2026-10-17',
    contenido: {
      intro: 'La cobertura de anticonceptivos es un derecho que rige para todas las prepagas y obras sociales, sin importar el plan: por la Ley 25.673 de Salud Sexual y Procreación Responsable y el Programa Médico Obligatorio, se cubren al 100 % y sin coseguro. Lo que cambia entre empresas es el trámite.',
      secciones: [
        {
          titulo: 'Qué dice la norma',
          cuerpo: 'La Resolución 310/2004 del Ministerio de Salud incorporó el Programa de Salud Sexual y Procreación Responsable (Ley 25.673) al PMO "sin coseguro a cargo de los beneficiarios" y estableció la cobertura al 100 % de los medicamentos de uso anticonceptivo comprendidos en esa norma, a cargo del agente del seguro de salud. Aplica a obras sociales y, por el PMO, también a las prepagas.',
          enlaces: [{ texto: 'Resolución 310/2004 (texto oficial, PDF)', url: 'https://www.argentina.gob.ar/sites/default/files/resolucion_310_2004.pdf' }],
        },
        {
          titulo: 'Qué métodos incluye',
          cuerpo: 'La resolución menciona los anticonceptivos intrauterinos de cobre, los condones con o sin espermicidas, los diafragmas y los espermicidas, con cobertura del 100 %, además de los anticonceptivos incluidos en el Formulario Terapéutico. Después se fueron sumando otros métodos al PMO: el dispositivo intrauterino hormonal (para ciertas indicaciones) y el implante subdérmico, también al 100 %, y están garantizados la anticoncepción de emergencia y la anticoncepción quirúrgica (ligadura tubaria y vasectomía).',
          enlaces: [{ texto: 'Chequeado — cómo pedir anticonceptivos a tu prepaga u obra social', url: 'https://chequeado.com/el-explicador/salud-sexual-como-pedir-preservativos-gratis-a-tu-prepaga-u-obra-social/' }],
        },
        {
          titulo: 'Cómo se piden',
          cuerpo: 'En general se retiran en la farmacia con la receta médica, o se reintegran, según cómo trabaje tu empresa. Algunas prepagas piden hacer un registro previo ("empadronamiento") o completar un formulario una vez: pedilo en la app o en atención al socio. Para la píldora y los métodos de uso periódico, preguntá si te dan la cantidad de varios meses por vez. Si te cobran un copago o un porcentaje, no corresponde: es una prestación sin coseguro.',
          cta: { texto: 'Si querés comparar qué incluye cada plan además de lo obligatorio, mirá las prepagas.', boton: 'Ver prepagas', href: '/prepagas' },
        },
        {
          titulo: 'Si te lo niegan',
          cuerpo: 'Pedí la negativa por escrito, con el motivo. La cobertura al 100 % no depende del plan. Reclamá en la empresa y, si no responden, en la Superintendencia de Servicios de Salud.',
          cta: { texto: 'Paso a paso para reclamar a una prepaga u obra social.', boton: 'Cómo reclamar', href: '/guias/como-reclamar-a-una-prepaga' },
        },
      ],
      conclusion: 'Los anticonceptivos tienen cobertura del 100 % y sin coseguro en cualquier prepaga u obra social. Presentá la receta, completá el registro si te lo piden y reclamá por escrito si te cobran o te los niegan.',
    },
    faq: [
      { q: '¿La prepaga cubre los anticonceptivos?', a: 'Sí. La Ley 25.673 y el PMO obligan a prepagas y obras sociales a cubrirlos al 100 % y sin coseguro.' },
      { q: '¿Qué métodos están cubiertos al 100 %?', a: 'Según la Resolución 310/2004, los DIU de cobre, los condones, los diafragmas, los espermicidas y los anticonceptivos del formulario terapéutico; después se sumaron el DIU hormonal en ciertos casos y el implante subdérmico.' },
      { q: '¿Tengo que empadronarme para recibirlos?', a: 'Algunas prepagas piden un registro o formulario previo. No es un requisito de la ley, pero puede ser el trámite de tu empresa: consultalo en atención al socio.' },
      { q: '¿Me pueden cobrar copago por los anticonceptivos?', a: 'No. Es una prestación sin coseguro a cargo del beneficiario.' },
      { q: '¿La vasectomía y la ligadura están cubiertas?', a: 'Sí: la anticoncepción quirúrgica (ligadura tubaria y vasectomía) está garantizada por el PMO.' },
      { q: '¿Qué hago si me los niegan?', a: 'Pedí la negativa por escrito, reclamá en la empresa y, si no responden, ante la Superintendencia de Servicios de Salud.' },
    ],
    keywords: ['anticonceptivos prepaga', 'anticonceptivos cobertura 100', 'ley 25673', 'anticonceptivos obra social', 'formulario anticonceptivos', 'empadronamiento anticonceptivos', 'dispositivo intrauterino cobertura', 'preservativos gratis prepaga', 'implante subdermico cobertura', 'vasectomia cobertura prepaga'],
    relacionadas: ['que-cubre-la-prepaga', 'como-reclamar-a-una-prepaga', 'medicacion-cronica-70-resolucion-310-2004', 'plan-materno-infantil'],
    fuentes: [
      { texto: 'Resolución 310/2004 del Ministerio de Salud (texto oficial)', url: 'https://www.argentina.gob.ar/sites/default/files/resolucion_310_2004.pdf' },
      { texto: 'Chequeado — Salud sexual: cómo pedir preservativos gratis a tu prepaga u obra social', url: 'https://chequeado.com/el-explicador/salud-sexual-como-pedir-preservativos-gratis-a-tu-prepaga-u-obra-social/' },
    ],
  },
  // 17-oct-2026, Darío: "bajas" es un punto estratégico (dar de baja Swiss /
  // Sancor aparece en todas las listas). Fuente: Reglamento General de
  // Contratación de Swiss Medical, público en su web (cláusulas 1.3, 6 y 7).
  {
    slug: 'como-dar-de-baja-swiss-medical',
    captarBaja: true,
    titulo: 'Cómo dar de baja Swiss Medical: pasos, fecha límite del día 5 y qué pasa con tu familia',
    metaDescripcion: 'La baja de Swiss Medical la hace el titular, de forma fehaciente. Hasta el día 5 del mes es retroactiva al mes anterior. Pasos, qué pasa con el grupo familiar y cómo mantener tu antigüedad.',
    tiempoLectura: 5,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-17',
    contenido: {
      intro: 'Para dar de baja Swiss Medical, el que tiene que pedirla es el titular del plan, en forma fehaciente, devolviendo las credenciales y poniéndose al día con la deuda. La fecha importa: si la pedís hasta el día 5 del mes, rige desde el último día del mes anterior; si la pedís después, desde el último día del mes en curso. Todo esto sale del Reglamento General de Contratación que Swiss publica en su web.',
      secciones: [
        {
          titulo: 'Quién puede pedirla y cómo',
          cuerpo: 'El reglamento dice que la renuncia debe ser formulada por el titular en forma fehaciente, es decir, es decir, de una manera que deje constancia de la fecha y de quién la pidió. El reglamento no detalla el canal: consultá en tu app o en el 0810 de Swiss cuál te habilitan, o usá carta documento si querés una prueba indiscutible. Guardá el comprobante, el número de trámite o la copia de la carta documento: es la prueba de la fecha en que la pediste.',
          enlaces: [{ texto: 'Reglamento General de Contratación de Swiss Medical (PDF oficial)', url: 'https://www.swissmedical.com.ar/smgnewsite/pdf/prepaga/formularios/reglamento_swissmedical.pdf' }],
        },
        {
          titulo: 'El día 5: desde cuándo rige la baja',
          cuerpo: 'Según el reglamento (cláusula 6.1.2), la renuncia presentada hasta el 5.º día del mes es retroactiva al último día del mes anterior, y la presentada después del día 5 se computa desde el último día del mes en curso. Si querés evitar pagar el mes entero, pedila antes del día 5.',
        },
        {
          titulo: 'Qué tenés que hacer antes',
          cuerpo: 'Restituir tu credencial y las de todo el grupo familiar, y cancelar la deuda pendiente: cuotas y excedentes de topes, si los hubiera. La baja no borra las deudas: si existían, siguen siendo exigibles aunque te hayas dado de baja (cláusula 6.1.3).',
        },
        {
          titulo: 'Qué pasa con tu grupo familiar',
          cuerpo: 'La renuncia o la muerte del titular termina la asociación de todo el grupo familiar (cláusula 6.1.1). Si algún integrante quiere seguir en Swiss, para conservar la antigüedad tiene que ir a las oficinas dentro de los 30 días de la baja y formar un nuevo grupo, pagando las cuotas desde el momento de la renuncia o la muerte (cláusula 6.1.4). Lo mismo rige para un integrante al que el titular da de baja (cláusula 7.1.2). Los hijos solteros se dan de baja solos al cumplir 30 años y tienen 30 días para asociarse por su cuenta y no perder la antigüedad (cláusula 1.3.1).',
        },
        {
          titulo: 'Qué dice la ley (vale para todas las prepagas)',
          cuerpo: 'Ley 26.682, artículo 9: podés rescindir en cualquier momento, sin penalidad, notificando de forma fehaciente con 30 días de anticipación. El decreto reglamentario agrega que solo se puede ejercer una vez por año y que la prepaga no puede condicionar tu baja a que canceles antes lo que debas. En Swiss, el reglamento pide además cancelar la deuda al renunciar: la deuda no desaparece, pero la ley no permite usarla para frenar la baja. Si algo del trámite te parece contrario a esto, reclamá ante la Superintendencia de Servicios de Salud.',
          enlaces: [{ texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' }],
        },
        {
          titulo: 'Antes de bajarte: la antigüedad vale',
          cuerpo: 'Si te das de baja y volvés a asociarte más tarde, empezás de cero: se pierde la antigüedad y pueden aplicar carencias de nuevo (el propio reglamento condiciona conservarla a asociarse dentro de los 30 días). Si el motivo es el precio, mirá primero bajar de plan dentro de Swiss, y si querés cambiar de empresa, hacelo sin dejar un hueco de cobertura.',
          cta: { texto: 'Compará el precio oficial de otros planes y prepagas antes de decidir.', boton: 'Comparar prepagas', href: '/comparador' },
        },
      ],
      conclusion: 'Para dar de baja Swiss Medical: la pide el titular, en forma fehaciente, hasta el día 5 si querés que rija desde el mes anterior, devolviendo credenciales y cancelando la deuda. Si alguien de la familia quiere seguir, tiene 30 días para conservar la antigüedad.',
    },
    faq: [
      { q: '¿Quién puede dar de baja Swiss Medical?', a: 'El titular del plan, en forma fehaciente. El reglamento establece que la renuncia debe ser formulada por el titular.' },
      { q: '¿Hasta qué día tengo que pedir la baja para no pagar el mes?', a: 'Hasta el día 5: la baja pedida hasta el 5.º día del mes es retroactiva al último día del mes anterior. Después del día 5 rige desde el último día del mes en curso.' },
      { q: '¿Qué pasa con mi familia si me doy de baja?', a: 'La baja del titular termina la asociación de todo el grupo familiar. Quien quiera seguir y mantener la antigüedad tiene 30 días para formar un nuevo grupo en Swiss.' },
      { q: '¿Puedo darme de baja si debo cuotas?', a: 'Tenés que cancelar la deuda pendiente (cuotas y excedentes de topes) al renunciar, según el reglamento. La baja no extingue la deuda.' },
      { q: '¿Tengo que devolver la credencial?', a: 'Sí, el reglamento pide restituir las credenciales del titular y de todo el grupo familiar al renunciar.' },
      { q: '¿Qué hago si me siguen cobrando después de la baja?', a: 'Reclamá por escrito con el comprobante de la baja y, si no lo corrigen, ante la Superintendencia de Servicios de Salud.' },
    ],
    keywords: ['como dar de baja swiss medical', 'dar de baja swiss medical', 'baja swiss medical', 'swiss medical baja de servicio', 'swiss medical bajas', 'swiss medical como dar de baja', 'renuncia swiss medical', 'baja swiss medical por fallecimiento', 'swiss medical baja grupo familiar', 'swiss medical hijos 30 años'],
    relacionadas: ['como-dar-de-baja-prepaga-u-obra-social', 'prepaga-no-me-da-la-baja', 'carta-documento-baja-prepaga-modelo', 'prepaga-sigue-cobrando-despues-de-la-baja', 'como-cambiar-de-prepaga', 'como-reclamar-a-una-prepaga', 'cuota-prepaga-por-edad', 'swiss-medical-carencias-preexistencias-declaracion-jurada', 'swiss-medical-mora-suspension-baja-por-falta-de-pago'],
    prepagasRelacionadas: ['swiss-medical'],
    fuentes: [
      { texto: 'Swiss Medical — Reglamento General de Contratación (PDF)', url: 'https://www.swissmedical.com.ar/smgnewsite/pdf/prepaga/formularios/reglamento_swissmedical.pdf' },
    ],
  },
  // Sancor Salud publica un formulario de baja online (sancorsalud.com.ar/baja)
  // que pide tipo y número de documento del titular y número de asociado.
  {
    slug: 'como-dar-de-baja-sancor-salud',
    captarBaja: true,
    titulo: 'Cómo dar de baja Sancor Salud: el botón de baja online, qué datos pide y qué guardar',
    metaDescripcion: 'Sancor Salud tiene un formulario de baja en su web: pide documento del titular y número de asociado. Paso a paso, qué guardar como constancia y cómo reclamar si te siguen cobrando.',
    tiempoLectura: 4,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-17',
    contenido: {
      intro: 'Sancor Salud (Asociación Mutual SanCor Salud) tiene un botón de baja en su web oficial (sancorsalud.com.ar/baja): se completa con el documento del titular y el número de asociado y se inicia la solicitud online, sin iniciar sesión. Sus condiciones generales de ingreso dicen además que la renuncia o rescisión debe formularse por escrito al domicilio legal de la Mutual (25 de Mayo 201, Sunchales, Santa Fe), y que también puede hacerse en los términos de la Res. 271/2020 sobre el botón de baja. El botón es el camino más simple y deja constancia.',
      secciones: [
        {
          titulo: 'Paso a paso',
          cuerpo: '1) Entrá a la página oficial de baja de Sancor Salud ("Botón de baja de servicio", en el pie de su web). 2) Elegí el tipo de documento y escribí el número del titular. 3) Ingresá el número de asociado del titular, que figura en la credencial y en la factura. 4) Tocá "Iniciar baja" y seguí las instrucciones que te muestre. La solicitud de baja es del titular del plan.',
          enlaces: [{ texto: 'Sancor Salud — Solicitud de baja (página oficial)', url: 'https://www.sancorsalud.com.ar/baja' }],
        },
        {
          titulo: 'Qué guardar',
          cuerpo: 'Una captura de pantalla o el comprobante de la solicitud, con la fecha y el número de trámite si te lo dan, y cualquier confirmación que recibas. Es lo que te va a servir si la baja no se refleja en la facturación. Antes de la baja, revisá que no haya cuotas pendientes y cómo estás pagando: si usás débito automático, controlá que se corte al mes siguiente.',
        },
        {
          titulo: 'Qué dicen las condiciones generales de ingreso',
          cuerpo: 'Las "Condiciones generales para ingresos" que Sancor Salud publica dicen que, en caso de renuncia o rescisión, esta debe formularse por escrito al domicilio legal de la Asociación Mutual SanCor Salud (25 de Mayo 201, Sunchales, Santa Fe), pudiendo hacerse en los términos de la Res. 271/2020 sobre el botón de baja. También aclaran que, en los casos en que se aplica el artículo 10 de la Ley 26.682 (preexistencias), el asociado paga por mes anticipado la cuota social y el arancel de servicios, con el diferencial que corresponda, desde el ingreso y hasta la exclusión o renuncia. El texto no fija una fecha de efecto ni un plazo de preaviso: pedí por escrito desde cuándo rige tu baja. Si adheriste a los subsidios complementarios (SUPRA, S.U.F., Vida Plus), revisá sus condiciones en la web.',
          enlaces: [{ texto: 'Sancor Salud — Contrato de adhesión y condiciones', url: 'https://www.sancorsalud.com.ar/contrato-de-adhesion' }],
        },
        {
          titulo: 'Si te siguen cobrando',
          cuerpo: 'Reclamá por escrito, adjuntando el comprobante de la baja, y pedí la devolución de lo cobrado de más. Si no lo resuelven, hacé el reclamo ante la Superintendencia de Servicios de Salud: es gratuito y no necesita abogado.',
          cta: { texto: 'Paso a paso para reclamar a una prepaga u obra social.', boton: 'Cómo reclamar', href: '/guias/como-reclamar-a-una-prepaga' },
        },
        {
          titulo: 'Qué dice la ley (vale para todas las prepagas)',
          cuerpo: 'Ley 26.682, artículo 9: podés rescindir en cualquier momento, sin penalidad, notificando de forma fehaciente con 30 días de anticipación. El decreto reglamentario agrega que solo se puede ejercer una vez por año y que la prepaga no puede condicionar tu baja a que canceles antes lo que debas. Si algo del trámite te parece contrario a esto, reclamá ante la Superintendencia de Servicios de Salud.',
          enlaces: [{ texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' }],
        },
        {
          titulo: 'Antes de bajarte: la antigüedad vale',
          cuerpo: 'Si te das de baja y después querés volver, empezás de cero: se pierde la antigüedad y pueden aplicar carencias de nuevo. Si el motivo es el precio, pedí primero cambiar a un plan más económico de Sancor Salud, o compará otra prepaga y pasate sin dejar un hueco de cobertura.',
          cta: { texto: 'Compará el precio oficial de los planes de Sancor Salud con otras prepagas.', boton: 'Comparar prepagas', href: '/comparador' },
        },
      ],
      conclusion: 'Para dar de baja Sancor Salud usá el botón de baja de su web, con el documento y el número de asociado del titular, y guardá el comprobante. Controlá la factura del mes siguiente y reclamá por escrito si te cobran de más.',
    },
    faq: [
      { q: '¿Cómo doy de baja Sancor Salud?', a: 'Desde el formulario de baja de su web oficial: se completan tipo y número de documento del titular y el número de asociado, y se inicia la solicitud.' },
      { q: '¿Qué datos necesito para la baja de Sancor Salud?', a: 'El tipo y número de documento del titular y su número de asociado, que figura en la credencial y en la factura.' },
      { q: '¿Quién puede pedir la baja?', a: 'El titular del plan: el formulario pide sus datos y su número de asociado.' },
      { q: '¿Se puede pedir la baja de Sancor Salud por escrito?', a: 'Sí: según sus condiciones generales de ingreso, la renuncia o rescisión se formula por escrito al domicilio legal de la Asociación Mutual SanCor Salud (25 de Mayo 201, Sunchales, Santa Fe), o por el botón de baja de su web.' },
      { q: '¿Necesito iniciar sesión para pedir la baja de Sancor Salud?', a: 'No: el formulario de sancorsalud.com.ar/baja pide el documento del titular y el número de asociado, sin iniciar sesión.' },
      { q: '¿Dónde están las condiciones de contratación?', a: 'En la sección "Contrato de adhesión" de la web de Sancor Salud.' },
      { q: '¿Qué hago si me siguen cobrando después de la baja?', a: 'Reclamá por escrito con el comprobante y, si no lo resuelven, ante la Superintendencia de Servicios de Salud.' },
      { q: '¿Pierdo la antigüedad si me doy de baja?', a: 'Si volvés a asociarte más tarde, empezás de cero. Si querés cambiar de plan o de prepaga, hacelo sin dejar un hueco de cobertura.' },
    ],
    keywords: ['como dar de baja sancor salud', 'dar de baja sancor salud', 'baja sancor salud', 'sancor salud baja', 'sancor salud dar de baja', 'solicitud de baja sancor salud', 'sancor salud boton de baja', 'baja de servicio sancor salud', 'sancor salud baja de obra social', 'baja sancor salud telefono'],
    relacionadas: ['como-dar-de-baja-prepaga-u-obra-social', 'prepaga-no-me-da-la-baja', 'carta-documento-baja-prepaga-modelo', 'prepaga-sigue-cobrando-despues-de-la-baja', 'como-cambiar-de-prepaga', 'como-reclamar-a-una-prepaga', 'cuota-prepaga-por-edad'],
    prepagasRelacionadas: ['sancor-salud'],
    fuentes: [
      { texto: 'Sancor Salud — Solicitud de baja (web oficial)', url: 'https://www.sancorsalud.com.ar/baja' },
      { texto: 'Sancor Salud — Contrato de adhesión (Condiciones generales para ingresos)', url: 'https://www.sancorsalud.com.ar/contrato-de-adhesion' },
      { texto: 'Resolución 271/2020 (botón de baja) — Secretaría de Comercio Interior', url: 'https://www.boletinoficial.gob.ar/detalleAviso/primera/234663/20200908' },
    ],
  },
  // 17-oct-2026: bajas por marca, leídas de las páginas oficiales de cada
  // prepaga (sin enviar ningún formulario). Marco legal: Ley 26.682 art. 9,
  // Decreto 1993/2011 art. 9, Res. SC 316/2018 y Disp. DNDCyAC 472/2019.
  {
    slug: 'como-dar-de-baja-osde',
    captarBaja: true,
    titulo: 'Cómo dar de baja OSDE: pasos online, documentación y qué pasa si volvés',
    metaDescripcion: 'La baja de OSDE la pide el titular desde Gestiones online. No hay bajas retroactivas, la baja alcanza a todo el grupo familiar y si volvés pasados 60 días entrás como socio nuevo.',
    tiempoLectura: 5,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-17',
    contenido: {
      intro: 'Para dar de baja OSDE, el titular entra a la web de OSDE con su cuenta y usa Gestiones online > Mi afiliación > Solicitud de baja (en la home también hay un acceso "Baja de servicio", en Información adicional). La baja rige desde el día en que hacés el trámite o desde una fecha futura: OSDE aclara que no acepta bajas retroactivas. Lo que cambia es la documentación según seas socio directo, monotributista o por empresa.',
      secciones: [
        {
          titulo: 'Paso a paso para socios directos y monotributistas',
          cuerpo: '1) Ingresá a osde.com.ar con tu cuenta (te pide email y contraseña). 2) Andá a Gestiones online > Mi afiliación > Solicitud de baja, o al acceso "Baja de servicio" del pie de la home. 3) Seguí el trámite: empieza eligiendo qué integrante da de baja. 4) Guardá la constancia. Solo el titular de la afiliación puede pedirla, y la baja del titular implica la de todo el grupo familiar.',
          enlaces: [
            { texto: 'OSDE — Bajas (información al socio)', url: 'https://www.osde.com.ar/informacion-al-socio/servicios-y-cobertura/bajas' },
            { texto: 'OSDE — ¿Cómo darme de baja de OSDE?', url: 'https://www.osde.com.ar/novedades/como-darme-de-baja-de-osde-' },
          ],
        },
        {
          titulo: 'Qué documentación piden',
          cuerpo: 'Si sos monotributista y dejaste de serlo en AFIP, tenés que presentar el Formulario 183; si te pasaste a otra obra social, una copia del traspaso. Si sos socio por empresa, en la mayoría de los casos piden el certificado de cambio de obra social o, si terminó la relación laboral, el telegrama de renuncia o despido. En esos casos la vigencia es la fecha del traspaso o la que figure en la documentación del cese. En los planes Flux, la baja rige desde el último día del mes de la solicitud.',
        },
        {
          titulo: 'Si te asociaste por una empresa',
          cuerpo: 'Si pagás la diferencia entre tus aportes y el costo del plan, podés pedir la baja por la web, igual que un socio directo. Si tu empleador cubre el costo total, el trámite lo gestiona la empresa con su asesor comercial de OSDE o en cualquier oficina.',
        },
        {
          titulo: 'Qué pasa si querés volver',
          cuerpo: 'OSDE avisa que si volvés a afiliarte pasados más de 60 días desde la baja, tenés que cumplir los mismos requisitos que un socio nuevo. Y si al reingresar tenés más de 55 años, según OSDE pagarás cuota Senior al cumplir 65 (Ley 26.682). Por eso conviene pensar antes si no te sirve más bajar de plan o pasarte a otra prepaga sin dejar un hueco.',
          cta: { texto: 'Compará el precio oficial de otros planes y prepagas antes de decidir.', boton: 'Comparar prepagas', href: '/comparador' },
        },
        {
          titulo: 'Qué dice la ley (vale para todas las prepagas)',
          cuerpo: 'Ley 26.682, artículo 9: podés rescindir en cualquier momento, sin penalidad, notificando de forma fehaciente con 30 días de anticipación. El decreto reglamentario agrega que solo se puede ejercer una vez por año y que la prepaga no puede condicionar tu baja a que canceles antes lo que debas. Si algo del trámite te parece contrario a esto, reclamá ante la Superintendencia de Servicios de Salud. Para consultas del trámite, OSDE publica atención al socio en el 0810-555-6733 (lunes a viernes de 9 a 20).',
          enlaces: [{ texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' }],
        },
      ],
      conclusion: 'La baja de OSDE la pide el titular desde la web con su cuenta, rige desde el día del trámite o una fecha futura, alcanza a todo el grupo y, si volvés pasados 60 días, entrás como socio nuevo. Guardá la constancia y revisá la siguiente factura.',
    },
    faq: [
      { q: '¿Cómo doy de baja OSDE por internet?', a: 'El titular entra a osde.com.ar con su cuenta y usa Gestiones online > Mi afiliación > Solicitud de baja, o el acceso "Baja de servicio" del pie de la home.' },
      { q: '¿Desde cuándo rige la baja de OSDE?', a: 'Desde el día en que hacés el trámite o una fecha futura. OSDE aclara que no se aceptan bajas retroactivas. En planes por empresa, rige desde la fecha del traspaso o del cese laboral.' },
      { q: '¿Quién puede pedir la baja?', a: 'Solo el titular de la afiliación. La baja del titular incluye a todo el grupo familiar.' },
      { q: '¿Qué documentación piden?', a: 'Monotributistas: Formulario 183 si se dieron de baja en AFIP, o copia del traspaso si cambiaron de obra social. Socios por empresa: certificado de cambio de obra social o telegrama de renuncia o despido.' },
      { q: '¿Qué pasa si vuelvo a OSDE después de la baja?', a: 'Si pasaron más de 60 días, OSDE te pide los mismos requisitos que a un socio nuevo. Si reingresás con más de 55 años, según OSDE pagarás cuota Senior al cumplir 65.' },
      { q: '¿Pueden condicionar la baja a que pague una deuda?', a: 'No. El decreto reglamentario de la Ley 26.682 dice que la prepaga no puede supeditar tu baja a la cancelación previa de lo adeudado, aunque la deuda siga siendo exigible.' },
    ],
    keywords: ['como dar de baja osde', 'dar de baja osde', 'baja osde', 'osde baja de servicio', 'como darme de baja de osde', 'osde dar de baja', 'osde baja monotributo', 'osde baja por empresa', 'osde baja online', 'solicitud de baja osde'],
    relacionadas: ['como-dar-de-baja-prepaga-u-obra-social', 'prepaga-no-me-da-la-baja', 'carta-documento-baja-prepaga-modelo', 'prepaga-sigue-cobrando-despues-de-la-baja', 'como-cambiar-de-prepaga', 'como-reclamar-a-una-prepaga', 'cuota-prepaga-por-edad'],
    prepagasRelacionadas: ['osde'],
    fuentes: [
      { texto: 'OSDE — Bajas (información al socio)', url: 'https://www.osde.com.ar/informacion-al-socio/servicios-y-cobertura/bajas' },
      { texto: 'OSDE — ¿Cómo darme de baja de OSDE?', url: 'https://www.osde.com.ar/novedades/como-darme-de-baja-de-osde-' },
      { texto: 'Ley 26.682, texto actualizado (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
      { texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' },
    ],
  },
  {
    slug: 'como-dar-de-baja-galeno',
    captarBaja: true,
    titulo: 'Cómo dar de baja Galeno: solicitud online, requisitos y sucursales',
    metaDescripcion: 'Galeno tiene "Solicitud de Baja" en su web: ingresás con tu usuario, tenés que ser el titular y socio privado, y la baja alcanza a todo el grupo familiar. También podés ir a una sucursal.',
    tiempoLectura: 4,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-17',
    contenido: {
      intro: 'Galeno tiene un acceso "Solicitud de Baja" en la home de su web. Para usarlo hay que ingresar con tu usuario de Galeno, ser el titular del plan y ser socio privado (no corporativo). La baja alcanza a todo el grupo familiar y termina la cobertura médica. La otra vía oficial es ir a la sucursal más cercana.',
      secciones: [
        {
          titulo: 'Paso a paso online',
          cuerpo: '1) Entrá a galeno.com.ar y tocá "Solicitud de Baja" en la home. 2) Leé el aviso: te pide ingresar con tu usuario de la web de Galeno. 3) Tocá "Empezar la solicitud" y seguí los pasos. 4) Guardá la constancia con la fecha. Si no tenés usuario, creá primero tu cuenta de socio.',
          enlaces: [{ texto: 'Galeno — sitio oficial (acceso "Solicitud de Baja")', url: 'https://www.galeno.com.ar/' }],
        },
        {
          titulo: 'Requisitos que informa Galeno',
          cuerpo: 'Ser el titular del plan. Ser socio privado (no corporativo): si tu plan viene por empresa, la baja la gestiona la empresa. Y tener en cuenta que la solicitud aplica a todos los integrantes del grupo familiar y contempla la finalización de la cobertura médica: no se puede dar de baja solo a uno desde este trámite.',
        },
        {
          titulo: 'Otra forma: sucursal',
          cuerpo: 'Galeno aclara que otra forma de solicitar la baja es concurrir a la sucursal más cercana. Llevá tu DNI y tu credencial, y pedí una constancia escrita con sello y fecha. El WhatsApp de atención al cliente (11 6163-0000) funciona con número de socio y DNI y sirve para consultar el estado.',
        },
        {
          titulo: 'Antes de bajarte',
          cuerpo: 'Si te das de baja y volvés más tarde, empezás de cero: se pierde la antigüedad y pueden aplicar carencias de nuevo. Si el motivo es el precio, consultá primero un plan más económico de Galeno, o compará otra prepaga y pasate sin dejar un hueco de cobertura.',
          cta: { texto: 'Compará el precio oficial de los planes de Galeno con otras prepagas.', boton: 'Comparar prepagas', href: '/comparador' },
        },
        {
          titulo: 'Qué dice la ley (vale para todas las prepagas)',
          cuerpo: 'Ley 26.682, artículo 9: podés rescindir en cualquier momento, sin penalidad, notificando de forma fehaciente con 30 días de anticipación. El decreto reglamentario agrega que solo se puede ejercer una vez por año y que la prepaga no puede condicionar tu baja a que canceles antes lo que debas. Si algo del trámite te parece contrario a esto, reclamá ante la Superintendencia de Servicios de Salud.',
          enlaces: [{ texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' }],
        },
      ],
      conclusion: 'Para dar de baja Galeno: titular y socio privado, con tu usuario desde "Solicitud de Baja" o en una sucursal. La baja termina la cobertura de todo el grupo familiar. Guardá la constancia y revisá la próxima factura.',
    },
    faq: [
      { q: '¿Cómo doy de baja Galeno?', a: 'Desde el acceso "Solicitud de Baja" de la web de Galeno, ingresando con tu usuario, o yendo a la sucursal más cercana.' },
      { q: '¿Quién puede pedir la baja de Galeno?', a: 'El titular del plan, siempre que sea socio privado (no corporativo).' },
      { q: '¿La baja de Galeno incluye a mi familia?', a: 'Sí. Galeno aclara que la solicitud aplica a todos los integrantes del grupo familiar y contempla la finalización de la cobertura médica.' },
      { q: '¿Necesito usuario para la baja online?', a: 'Sí, la web de Galeno pide ingresar con tu usuario de socio para iniciar la solicitud.' },
      { q: '¿Pueden condicionar la baja a que pague una deuda?', a: 'No. El decreto reglamentario de la Ley 26.682 dice que la prepaga no puede supeditar tu baja a la cancelación previa de lo adeudado, aunque la deuda siga siendo exigible.' },
      { q: '¿Qué hago si me siguen cobrando después de la baja?', a: 'Reclamá por escrito con tu constancia y, si no lo resuelven, ante la Superintendencia de Servicios de Salud o Defensa del Consumidor.' },
    ],
    keywords: ['como dar de baja galeno', 'dar de baja galeno', 'baja galeno', 'galeno solicitud de baja', 'galeno dar de baja', 'como darse de baja de galeno', 'galeno baja de servicio', 'baja de galeno online', 'galeno baja sucursal', 'galeno boton de baja'],
    relacionadas: ['como-dar-de-baja-prepaga-u-obra-social', 'prepaga-no-me-da-la-baja', 'carta-documento-baja-prepaga-modelo', 'prepaga-sigue-cobrando-despues-de-la-baja', 'como-cambiar-de-prepaga', 'como-reclamar-a-una-prepaga', 'cuota-prepaga-por-edad'],
    prepagasRelacionadas: ['galeno'],
    fuentes: [
      { texto: 'Galeno — sitio oficial (Solicitud de Baja)', url: 'https://www.galeno.com.ar/' },
      { texto: 'Ley 26.682, texto actualizado (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
      { texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' },
    ],
  },
  {
    slug: 'como-dar-de-baja-medife',
    captarBaja: true,
    titulo: 'Cómo dar de baja Medifé: formulario de baja, arrepentimiento y Mi Cuenta',
    metaDescripcion: 'Medifé tiene un formulario de baja en su portal de asociados y un formulario de arrepentimiento para planes nuevos (hasta 10 días). Cuál usar, qué datos pide y qué guardar.',
    tiempoLectura: 4,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-17',
    contenido: {
      intro: 'Medifé tiene dos caminos oficiales. Si ya sos asociado activo, la baja se pide desde el "Formulario de baja" del portal de asociados (Mi Cuenta), que pide iniciar sesión con tu documento y contraseña. Si recién contrataste y el plan todavía no está activo o su vigencia no supera los 10 días, existe un formulario de arrepentimiento.',
      secciones: [
        {
          titulo: 'Asociado activo: Formulario de baja',
          cuerpo: '1) Entrá a medife.com.ar y buscá "Formulario de baja" en el pie de la página (sección Asociados). 2) Iniciá sesión en el portal: tipo y número de documento y contraseña, o con tu email, Google o Apple. 3) Seguí el trámite y guardá la constancia. Si no tenés cuenta, el portal te invita a registrarte.',
          enlaces: [{ texto: 'Medifé — Formulario de baja (portal de asociados)', url: 'https://medife.com.ar/portal/baja-servicio' }],
        },
        {
          titulo: 'Plan nuevo (hasta 10 días): formulario de arrepentimiento',
          cuerpo: 'Medifé aclara que ese formulario es de uso exclusivo para asociados que aún no están activos o cuyo plan no supera los 10 días de vigencia. Pide nombre, tipo y número de documento, email, celular, provincia, localidad y el motivo. Si tu cuenta ya está activa, la propia página indica que por seguridad la baja se solicita ingresando a Mi Cuenta.',
          enlaces: [{ texto: 'Medifé — Solicitar la baja del plan contratado', url: 'https://www.medife.com.ar/formulario-de-arrepentimiento' }],
        },
        {
          titulo: 'Teléfono y constancia',
          cuerpo: 'El Centro de atención al cliente de Medifé es 0800-333-2700, todos los días las 24 horas, y el WhatsApp es 11 2242-0091 (de 8 a 22). Pedí siempre una constancia por escrito de la fecha de tu solicitud: es lo que necesitás si después te siguen facturando.',
        },
        {
          titulo: 'Antes de bajarte',
          cuerpo: 'Si te das de baja y volvés más tarde, empezás de cero: se pierde la antigüedad y pueden aplicar carencias de nuevo. Si el motivo es el precio, consultá primero un plan más económico de Medifé, o compará otra prepaga y pasate sin dejar un hueco de cobertura.',
          cta: { texto: 'Compará el precio oficial de los planes de Medifé con otras prepagas.', boton: 'Comparar prepagas', href: '/comparador' },
        },
        {
          titulo: 'Qué dice la ley (vale para todas las prepagas)',
          cuerpo: 'Ley 26.682, artículo 9: podés rescindir en cualquier momento, sin penalidad, notificando de forma fehaciente con 30 días de anticipación. El decreto reglamentario agrega que solo se puede ejercer una vez por año y que la prepaga no puede condicionar tu baja a que canceles antes lo que debas. Si algo del trámite te parece contrario a esto, reclamá ante la Superintendencia de Servicios de Salud.',
          enlaces: [{ texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' }],
        },
      ],
      conclusion: 'Medifé: asociado activo, baja desde Mi Cuenta con el Formulario de baja; plan nuevo de hasta 10 días, formulario de arrepentimiento. Guardá la constancia y controlá la próxima factura.',
    },
    faq: [
      { q: '¿Cómo doy de baja Medifé?', a: 'Desde el "Formulario de baja" del portal de asociados de Medifé (Mi Cuenta), iniciando sesión con tu documento y contraseña.' },
      { q: '¿Para qué sirve el formulario de arrepentimiento de Medifé?', a: 'Es para asociados que aún no están activos o cuyo plan no supera los 10 días de vigencia. Si tu cuenta ya está activa, se pide desde Mi Cuenta.' },
      { q: '¿Qué datos pide el formulario de arrepentimiento?', a: 'Apellido y nombre, tipo y número de documento, email, celular, provincia, localidad y el motivo.' },
      { q: '¿Hay teléfono para consultas de la baja?', a: 'La atención al cliente de Medifé es 0800-333-2700 (las 24 horas, todos los días).' },
      { q: '¿Pueden condicionar la baja a que pague una deuda?', a: 'No. El decreto reglamentario de la Ley 26.682 dice que la prepaga no puede supeditar tu baja a la cancelación previa de lo adeudado, aunque la deuda siga siendo exigible.' },
      { q: '¿Qué hago si me siguen cobrando después de la baja?', a: 'Reclamá por escrito con tu constancia y, si no lo resuelven, ante la Superintendencia de Servicios de Salud o Defensa del Consumidor.' },
    ],
    keywords: ['como dar de baja medife', 'dar de baja medife', 'baja medife', 'medife baja de servicio', 'medife formulario de baja', 'medife arrepentimiento', 'como darse de baja de medife', 'medife dar de baja', 'medife baja online', 'baja de medife telefono'],
    relacionadas: ['como-dar-de-baja-prepaga-u-obra-social', 'prepaga-no-me-da-la-baja', 'carta-documento-baja-prepaga-modelo', 'prepaga-sigue-cobrando-despues-de-la-baja', 'como-cambiar-de-prepaga', 'como-reclamar-a-una-prepaga', 'cuota-prepaga-por-edad'],
    prepagasRelacionadas: ['medife'],
    fuentes: [
      { texto: 'Medifé — Formulario de baja (portal de asociados)', url: 'https://medife.com.ar/portal/baja-servicio' },
      { texto: 'Medifé — Solicitar la baja del plan contratado', url: 'https://www.medife.com.ar/formulario-de-arrepentimiento' },
      { texto: 'Ley 26.682, texto actualizado (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
      { texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' },
    ],
  },
  {
    slug: 'como-dar-de-baja-omint',
    captarBaja: true,
    titulo: 'Cómo dar de baja Omint: el botón de baja de Autogestión y qué conviene tener a mano',
    metaDescripcion: 'Omint tiene un "Botón de baja de servicios" en su web que te lleva a Autogestión (documento, usuario y contraseña). Paso a paso, canales de atención y qué guardar como constancia.',
    tiempoLectura: 4,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-17',
    contenido: {
      intro: 'Omint publica en su web un "Botón de baja de servicios" que lleva al portal de Autogestión, donde ingresás con tu documento, usuario y contraseña. Es la vía online oficial. Si no tenés cuenta, el mismo portal te permite crearla. Para consultas del trámite, Omint tiene atención telefónica y WhatsApp.',
      secciones: [
        {
          titulo: 'Paso a paso',
          cuerpo: '1) Entrá a omint.com.ar y buscá "Botón de baja de servicios" en la sección Legales del pie de la página. 2) Ingresá a Autogestión con tu documento, usuario y contraseña (si olvidaste el acceso, el portal tiene el enlace para recuperarlo; si no tenés cuenta, "Creá tu cuenta ahora"). 3) Seguí el trámite de solicitud de baja. 4) Guardá el comprobante con la fecha.',
          enlaces: [{ texto: 'Omint — Botón de baja de servicios (Autogestión)', url: 'https://autogestion.omint.com.ar/inicio/solicitar-baja' }],
        },
        {
          titulo: 'Arrepentimiento: un botón aparte',
          cuerpo: 'Omint tiene además un "Botón de arrepentimiento", separado del de baja, pensado para quien se acaba de asociar y quiere desistir. Si ya estás asociado desde hace tiempo, el camino es el botón de baja de servicios.',
        },
        {
          titulo: 'Canales de atención',
          cuerpo: 'Atención al socio: (011) 4808-2090 o 0810-999-3876, de lunes a viernes de 8 a 20. WhatsApp: 11 6434-8039, de lunes a viernes de 9 a 17. Son los canales que Omint publica en su sitio. Si pedís la baja por teléfono o WhatsApp, pedí número de gestión y confirmación escrita.',
        },
        {
          titulo: 'Antes de bajarte',
          cuerpo: 'Si te das de baja y volvés más tarde, empezás de cero: se pierde la antigüedad y pueden aplicar carencias de nuevo. Si el motivo es el precio, consultá primero un plan más económico de Omint, o compará otra prepaga y pasate sin dejar un hueco de cobertura.',
          cta: { texto: 'Compará el precio oficial de los planes de Omint con otras prepagas.', boton: 'Comparar prepagas', href: '/comparador' },
        },
        {
          titulo: 'Qué dice la ley (vale para todas las prepagas)',
          cuerpo: 'Ley 26.682, artículo 9: podés rescindir en cualquier momento, sin penalidad, notificando de forma fehaciente con 30 días de anticipación. El decreto reglamentario agrega que solo se puede ejercer una vez por año y que la prepaga no puede condicionar tu baja a que canceles antes lo que debas. Si algo del trámite te parece contrario a esto, reclamá ante la Superintendencia de Servicios de Salud.',
          enlaces: [{ texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' }],
        },
      ],
      conclusion: 'Para dar de baja Omint usá el "Botón de baja de servicios" desde Autogestión y guardá el comprobante. Si algo no funciona, atención al socio por teléfono o WhatsApp, siempre pidiendo confirmación escrita.',
    },
    faq: [
      { q: '¿Cómo doy de baja Omint?', a: 'Desde el "Botón de baja de servicios" de la web de Omint, que lleva a Autogestión, donde ingresás con documento, usuario y contraseña.' },
      { q: '¿Necesito cuenta en Autogestión para la baja?', a: 'Sí, el portal pide documento, usuario y contraseña. Si no tenés cuenta, permite crearla.' },
      { q: '¿Cuál es la diferencia entre el botón de baja y el de arrepentimiento?', a: 'Son dos botones separados en la web de Omint. El de arrepentimiento es para quien recién se asoció y quiere desistir; el de baja de servicios es para dar de baja el servicio contratado.' },
      { q: '¿A qué teléfono llamo por la baja de Omint?', a: 'Atención al socio: (011) 4808-2090 o 0810-999-3876, de lunes a viernes de 8 a 20.' },
      { q: '¿Pueden condicionar la baja a que pague una deuda?', a: 'No. El decreto reglamentario de la Ley 26.682 dice que la prepaga no puede supeditar tu baja a la cancelación previa de lo adeudado, aunque la deuda siga siendo exigible.' },
      { q: '¿Qué hago si me siguen cobrando después de la baja?', a: 'Reclamá por escrito con tu comprobante y, si no lo resuelven, ante la Superintendencia de Servicios de Salud o Defensa del Consumidor.' },
    ],
    keywords: ['como dar de baja omint', 'dar de baja omint', 'baja omint', 'omint baja de servicio', 'omint boton de baja', 'omint dar de baja', 'como darse de baja de omint', 'omint baja online', 'omint autogestion baja', 'baja de omint telefono'],
    relacionadas: ['como-dar-de-baja-prepaga-u-obra-social', 'prepaga-no-me-da-la-baja', 'carta-documento-baja-prepaga-modelo', 'prepaga-sigue-cobrando-despues-de-la-baja', 'como-cambiar-de-prepaga', 'como-reclamar-a-una-prepaga', 'cuota-prepaga-por-edad'],
    prepagasRelacionadas: ['omint'],
    fuentes: [
      { texto: 'Omint — Botón de baja de servicios (Autogestión)', url: 'https://autogestion.omint.com.ar/inicio/solicitar-baja' },
      { texto: 'Omint — Canales de atención', url: 'https://www.omint.com.ar/PlanDeSalud/CanalesAtencion' },
      { texto: 'Ley 26.682, texto actualizado (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
      { texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' },
    ],
  },
  {
    slug: 'como-dar-de-baja-medicus',
    captarBaja: true,
    titulo: 'Cómo dar de baja Medicus: mail, 0800, agencias y el botón de arrepentimiento',
    metaDescripcion: 'Medicus indica en sus preguntas frecuentes cómo dar de baja: mail con asunto "Intención de baja", 0800-333-7624 o agencias administrativas. Pasos, excepciones y el botón de arrepentimiento (10 días).',
    tiempoLectura: 4,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-17',
    contenido: {
      intro: 'Según las preguntas frecuentes oficiales de Medicus, la baja se solicita escribiendo a contactenos@medicus.com.ar (con el asunto "Intención de baja"), llamando al 0800-333-7624 de lunes a viernes de 8 a 20, o yendo a una agencia administrativa. Aparte, para quien recién contrató, la web tiene un botón de arrepentimiento con plazo de 10 días corridos.',
      secciones: [
        {
          titulo: 'Los canales oficiales de baja',
          cuerpo: '1) Mail a contactenos@medicus.com.ar con asunto "Intención de baja". Incluí nombre completo, DNI y número de asociado. 2) Teléfono 0800-333-7624, de lunes a viernes de 8 a 20. 3) En una agencia administrativa de Medicus. Ojo: Medicus aclara que en Alvear, Canning, Córdoba, La Plata, Mar del Plata y Morón solo hay representaciones comerciales, que no tramitan la baja.',
          enlaces: [{ texto: 'Medicus — Preguntas frecuentes: Baja del servicio', url: 'https://medicus.com.ar/categoria-preguntas/baja-del-servicio' }],
        },
        {
          titulo: 'Botón de arrepentimiento (10 días)',
          cuerpo: 'Para quien aún no está activo y está dentro de los diez días corridos posteriores a la contratación. Debe pedirlo el titular del plan elegido, y cancela el ingreso de todos los integrantes listados. Si ya usaste servicios, la cobertura termina en esa fecha y se facturan los días utilizados. Pasado el plazo, la propia página indica que la baja se gestiona desde Mi Medicus (app.medicus.com.ar).',
          enlaces: [{ texto: 'Medicus — Botón de arrepentimiento', url: 'https://medicus.com.ar/arrepentimiento' }],
        },
        {
          titulo: 'Qué guardar',
          cuerpo: 'Si pedís la baja por mail, guardá el mensaje enviado con fecha y la respuesta de Medicus. Si llamás, anotá el número de gestión. Controlá que la siguiente factura no incluya cuotas posteriores a la fecha de tu pedido. El WhatsApp de atención al cliente (11 5094-1119) sirve para consultar el estado.',
        },
        {
          titulo: 'Antes de bajarte',
          cuerpo: 'Si te das de baja y volvés más tarde, empezás de cero: se pierde la antigüedad y pueden aplicar carencias de nuevo. Si el motivo es el precio, consultá primero un plan más económico de Medicus, o compará otra prepaga y pasate sin dejar un hueco de cobertura.',
          cta: { texto: 'Compará el precio oficial de los planes de Medicus con otras prepagas.', boton: 'Comparar prepagas', href: '/comparador' },
        },
        {
          titulo: 'Qué dice la ley (vale para todas las prepagas)',
          cuerpo: 'Ley 26.682, artículo 9: podés rescindir en cualquier momento, sin penalidad, notificando de forma fehaciente con 30 días de anticipación. El decreto reglamentario agrega que solo se puede ejercer una vez por año y que la prepaga no puede condicionar tu baja a que canceles antes lo que debas. Un mail o un llamado deja constancia, pero si querés una notificación indiscutible, usá carta documento. Si algo del trámite te parece contrario a esto, reclamá ante la Superintendencia de Servicios de Salud.',
          enlaces: [{ texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' }],
        },
      ],
      conclusion: 'Para dar de baja Medicus: mail con asunto "Intención de baja", 0800-333-7624 o agencia administrativa, guardando siempre la constancia. Si recién contrataste, tenés 10 días corridos para el botón de arrepentimiento.',
    },
    faq: [
      { q: '¿Cómo doy de baja Medicus?', a: 'Escribiendo a contactenos@medicus.com.ar con el asunto "Intención de baja", llamando al 0800-333-7624 (lunes a viernes de 8 a 20) o en una agencia administrativa, según las preguntas frecuentes de Medicus.' },
      { q: '¿Medicus tiene botón de baja online?', a: 'En su web figura un botón de arrepentimiento para quien recién contrató (10 días corridos). Para el resto, las preguntas frecuentes indican mail, 0800 o agencias, y la página de arrepentimiento menciona Mi Medicus.' },
      { q: '¿Qué agencias de Medicus no tramitan bajas?', a: 'Alvear, Canning, Córdoba, La Plata, Mar del Plata y Morón: según Medicus, allí hay solo representaciones comerciales.' },
      { q: '¿Cuánto tiempo tengo para el botón de arrepentimiento de Medicus?', a: 'Diez días corridos desde la contratación, si todavía no estás activo. Pasado ese plazo, la baja se tramita por los canales habituales.' },
      { q: '¿Pueden condicionar la baja a que pague una deuda?', a: 'No. El decreto reglamentario de la Ley 26.682 dice que la prepaga no puede supeditar tu baja a la cancelación previa de lo adeudado, aunque la deuda siga siendo exigible.' },
      { q: '¿Qué hago si me siguen cobrando después de la baja?', a: 'Reclamá por escrito con tu constancia y, si no lo resuelven, ante la Superintendencia de Servicios de Salud o Defensa del Consumidor.' },
    ],
    keywords: ['como dar de baja medicus', 'dar de baja medicus', 'baja medicus', 'medicus baja de servicio', 'medicus intencion de baja', 'medicus boton de arrepentimiento', 'como darse de baja de medicus', 'medicus dar de baja', 'medicus baja telefono', 'baja de medicus mail'],
    relacionadas: ['como-dar-de-baja-prepaga-u-obra-social', 'prepaga-no-me-da-la-baja', 'carta-documento-baja-prepaga-modelo', 'prepaga-sigue-cobrando-despues-de-la-baja', 'como-cambiar-de-prepaga', 'como-reclamar-a-una-prepaga', 'cuota-prepaga-por-edad'],
    prepagasRelacionadas: ['medicus'],
    fuentes: [
      { texto: 'Medicus — Preguntas frecuentes: Baja del servicio', url: 'https://medicus.com.ar/categoria-preguntas/baja-del-servicio' },
      { texto: 'Medicus — Botón de arrepentimiento', url: 'https://medicus.com.ar/arrepentimiento' },
      { texto: 'Ley 26.682, texto actualizado (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
      { texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' },
    ],
  },
  // 17-oct-2026, Darío: contenido jurídico/administrativo para quien tiene
  // problemas con la baja (reclamos), pensado también para respuestas de IA
  // (respuesta directa al inicio, pasos numerados, fuentes oficiales y fecha).
  // Fuentes leídas: Ley 26.682 art. 9; Decreto 1993/2011 arts. 9 y 13; Ley
  // 24.240 arts. 10 bis, 10 ter, 34, 40 bis, 52 bis, 53; BCRA débito directo;
  // formulario de consultas de la SSSalud; Ventanilla Federal Única.
  {
    slug: 'prepaga-no-me-da-la-baja',
    titulo: 'La prepaga no me da la baja: qué hacer paso a paso (ley y reclamos)',
    metaDescripcion: 'Si tu prepaga demora, rechaza o te hace dar vueltas con la baja: qué dice la ley, cómo dejar constancia, carta documento y reclamo ante la Superintendencia y Defensa del Consumidor.',
    tiempoLectura: 7,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-17',
    captarBaja: true,
    contenido: {
      intro: 'Si tu prepaga no te da la baja, la ley está de tu lado: el artículo 9 de la Ley 26.682 te permite rescindir el contrato en cualquier momento, sin penalidad, notificando de forma fehaciente con 30 días de anticipación, y el decreto reglamentario aclara que no pueden condicionar la baja a que antes pagues lo que debas. El camino, en orden: 1) dejar constancia del pedido, 2) intimar por carta documento, 3) reclamar ante la Superintendencia de Servicios de Salud, 4) reclamar ante Defensa del Consumidor y 5) la Justicia, si hace falta.',
      secciones: [
        {
          titulo: 'Qué pueden y qué no pueden hacer con tu baja',
          cuerpo: 'Pueden: pedir que el aviso sea fehaciente, cobrarte las cuotas realmente adeudadas hasta la fecha en que la baja se haga efectiva, y ofrecerte retenciones comerciales (que podés rechazar). No pueden: aplicarte una multa o permanencia mínima (la ley dice "sin penalidad"), condicionar tu baja al pago previo de una deuda (artículo 9 del decreto 1993/2011), ni hacerte ir a una sucursal si contrataste por teléfono o por internet: el artículo 10 ter de la Ley 24.240 permite rescindir por el mismo medio de la contratación y obliga a la empresa a enviarte, sin cargo, una constancia fehaciente dentro de las 72 horas de recibir el pedido.',
          enlaces: [
            { texto: 'Ley 26.682 (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
            { texto: 'Decreto 1993/2011 (argentina.gob.ar)', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' },
          ],
        },
        {
          titulo: 'Paso 1: dejá constancia del pedido',
          cuerpo: 'Pedí la baja por el canal oficial de tu prepaga (botón de baja, portal de asociados, mail o atención telefónica) y guardá la prueba: captura con fecha, número de gestión, mail enviado y respuesta. Si no conocés el canal, mirá la guía de tu prepaga: Swiss Medical, OSDE, Sancor Salud, Galeno, Medifé, Omint y Medicus ya tienen el paso a paso. Pagá las cuotas hasta la fecha efectiva de la baja para no dar pie a una deuda, y reclamá después lo que te cobren de más. Un dato útil: según la Res. 271/2020, quien usa el botón de baja no puede ser obligado a registrarse ni a hacer otro trámite; si el portal de tu prepaga te exige iniciar sesión y no podés ingresar, dejá captura del problema, pedí la baja por escrito y reclamá.',
        },
        {
          titulo: 'Paso 2: carta documento',
          cuerpo: 'Si en unos días no te dan una confirmación escrita o te la niegan, mandá una carta documento al domicilio legal de la prepaga. Es la forma más sólida de notificar de manera fehaciente y fija la fecha desde la que corren los 30 días del preaviso. En la carta pedí: la baja del plan y de todo el grupo familiar, el cese de la facturación y de los débitos, y la constancia escrita de la baja. Tenés un modelo con el texto para copiar en la guía "Modelo de carta documento para dar de baja la prepaga".',
        },
        {
          titulo: 'Paso 3: reclamo ante la Superintendencia de Servicios de Salud',
          cuerpo: 'La Superintendencia (SSSalud) controla a las prepagas. Desde su Centro de Atención Virtual podés presentar una consulta o reclamo online con tu CUIL, tu correo y la descripción del problema: el formulario ofrece la opción "Afiliaciones" como tipo de problema, y pide la prepaga y cómo accedés a ella (por ejemplo, socio directo de prepaga). Adjuntá la carta documento, las capturas y la factura. También podés llamar al 0800-222-SALUD (72583).',
          enlaces: [{ texto: 'SSSalud — Consultas y reclamos', url: 'https://www.argentina.gob.ar/sssalud/consultas-la-superintendencia-de-servicios-de-salud' }],
        },
        {
          titulo: 'Paso 4: reclamo en Defensa del Consumidor',
          cuerpo: 'En paralelo podés iniciar un reclamo gratuito en la Ventanilla Federal Única de Defensa del Consumidor: cargás tus datos (DNI, contacto), los de la prepaga y el detalle del problema, y recibís por mail un número de reclamo; el organismo lo deriva a la autoridad que corresponde y te contacta. Ojo: algunas guías viejas hablan del COPREC (conciliación previa), pero ese servicio fue disuelto por el Decreto 55/2025 en febrero de 2025.',
          enlaces: [{ texto: 'Iniciar un reclamo ante Defensa del Consumidor', url: 'https://www.argentina.gob.ar/servicio/iniciar-un-reclamo-ante-defensa-del-consumidor' }],
        },
        {
          titulo: 'Paso 5: la Justicia',
          cuerpo: 'Si la prepaga sigue sin cumplir, queda la vía judicial. La Ley 24.240 prevé el beneficio de justicia gratuita para las acciones individuales de consumo (artículo 53), el reclamo del daño directo (artículo 40 bis) y, según el caso, la multa civil o daño punitivo contra el proveedor incumplidor (artículo 52 bis). Para evaluar si te conviene, consultá a un abogado de consumo o a la Defensoría del Consumidor de tu jurisdicción. Esta guía es información general y no reemplaza el asesoramiento de un profesional.',
        },
        {
          titulo: 'Mientras resolvés la baja, no te quedes sin cobertura',
          cuerpo: 'El error más común es pedir la baja antes de tener la nueva cobertura confirmada. Primero cotizá y confirmá la nueva prepaga u obra social, después pedí la baja con la fecha de efecto coordinada para que no quede un hueco. Si todavía no resolviste tu nueva cobertura, podés gestionarla desde acá: dejás tus datos y un asesor oficial te contacta.',
          cta: { texto: 'Compará el precio oficial de otras prepagas antes de decidir.', boton: 'Comparar prepagas', href: '/comparador' },
        },
      ],
      conclusion: 'Con la ley 26.682 de tu lado: sin multa, sin condicionar la baja a una deuda y con 30 días de preaviso. Dejá todo por escrito, mandá carta documento si no avanzan, y escalá a la Superintendencia y a Defensa del Consumidor. Y coordiná la baja con tu nueva cobertura para no quedar sin cobertura ni un día.',
    },
    faq: [
      { q: '¿Pueden negarme la baja de la prepaga?', a: 'No. La Ley 26.682 (art. 9) te permite rescindir en cualquier momento, sin penalidad, notificando de forma fehaciente con 30 días de anticipación. Sí pueden exigir que el pedido sea fehaciente y cobrarte lo efectivamente adeudado.' },
      { q: '¿Qué hago si la prepaga no me responde la solicitud de baja?', a: 'Mandá una carta documento al domicilio legal de la prepaga pidiendo la baja y el cese de los cobros, y reclamá en paralelo ante la Superintendencia de Servicios de Salud y Defensa del Consumidor.' },
      { q: '¿La prepaga puede obligarme a ir a una sucursal para darme de baja?', a: 'Si contrataste por teléfono o por medios electrónicos, el artículo 10 ter de la Ley 24.240 te permite rescindir por el mismo medio, y la empresa debe enviarte una constancia fehaciente dentro de las 72 horas de recibido el pedido.' },
      { q: '¿Dónde reclamo si la prepaga no me da la baja?', a: 'Ante la Superintendencia de Servicios de Salud (formulario de consultas, opción "Afiliaciones", o 0800-222-72583) y ante Defensa del Consumidor, por la Ventanilla Federal Única, que es gratuita.' },
      { q: '¿El COPREC sigue funcionando?', a: 'No. El Decreto 55/2025 disolvió el Servicio de Conciliación Previa en las Relaciones de Consumo (COPREC) en febrero de 2025. Los reclamos se inician en Defensa del Consumidor.' },
      { q: '¿Cuántas veces puedo rescindir la prepaga?', a: 'El decreto reglamentario de la Ley 26.682 establece que la facultad de rescindir puede ejercerse solamente una vez por año.' },
      { q: '¿Pueden condicionar la baja a que pague una deuda?', a: 'No. Según el decreto reglamentario, no puede supeditarse la rescisión del usuario a la previa cancelación de lo adeudado. La deuda sigue existiendo y la prepaga puede reclamarla por las vías correspondientes.' },
    ],
    keywords: ['prepaga no me da la baja', 'no me quieren dar de baja prepaga', 'no me dan la baja de la prepaga', 'reclamo baja prepaga', 'baja prepaga superintendencia', 'dar de baja prepaga ley', 'baja de prepaga ley', 'prepaga no deja darse de baja', 'que hacer si la prepaga no me da la baja', 'denuncia prepaga baja'],
    relacionadas: ['carta-documento-baja-prepaga-modelo', 'prepaga-sigue-cobrando-despues-de-la-baja', 'dar-de-baja-prepaga-con-deuda', 'como-dar-de-baja-prepaga-u-obra-social', 'como-reclamar-a-una-prepaga', 'como-cambiar-de-prepaga'],
    fuentes: [
      { texto: 'Ley 26.682, texto actualizado (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
      { texto: 'Decreto 1993/2011, texto actualizado (argentina.gob.ar)', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' },
      { texto: 'Ley 24.240 de Defensa del Consumidor (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/0-4999/638/texact.htm' },
      { texto: 'SSSalud — Consultas', url: 'https://www.argentina.gob.ar/sssalud/consultas-la-superintendencia-de-servicios-de-salud' },
      { texto: 'Defensa del Consumidor — Iniciar un reclamo', url: 'https://www.argentina.gob.ar/servicio/iniciar-un-reclamo-ante-defensa-del-consumidor' },
      { texto: 'Decreto 55/2025 (disolución del COPREC)', url: 'https://www.argentina.gob.ar/normativa/nacional/norma-409013/texto' },
    ],
  },
  {
    slug: 'carta-documento-baja-prepaga-modelo',
    titulo: 'Modelo de carta documento para dar de baja la prepaga (texto para copiar)',
    metaDescripcion: 'Texto listo para copiar de carta documento de baja de prepaga, con el artículo 9 de la Ley 26.682, qué pedir, a dónde enviarla y qué guardar. Para usar cuando la prepaga no da la baja.',
    tiempoLectura: 5,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-17',
    captarBaja: true,
    contenido: {
      intro: 'La carta documento es la forma más sólida de notificar la baja de la prepaga de manera fehaciente, que es lo que pide el artículo 9 de la Ley 26.682. Abajo tenés un modelo para copiar y completar: se envía por Correo, en original y copia, al domicilio legal de la prepaga, y los 30 días de preaviso corren desde que la reciben.',
      secciones: [
        {
          titulo: 'Texto modelo para copiar',
          cuerpo: 'Completá lo que está entre corchetes. Texto: "Por la presente, en mi carácter de titular del plan [nombre del plan], asociado/a N.º [número de asociado], DNI [número], comunico mi decisión de rescindir el contrato de medicina prepaga, en los términos del artículo 9 de la Ley 26.682, con efecto a los treinta (30) días corridos de la recepción de la presente. La rescisión comprende a todos los integrantes de mi grupo familiar. Solicito: 1) constancia escrita de la baja y de su fecha de efecto; 2) el cese de toda facturación y de todo débito a partir de esa fecha, y la baja de mi adhesión al débito automático; 3) el estado de cuenta actualizado y el libre deuda correspondiente. Dejo constancia de que, conforme el decreto reglamentario 1993/2011, la rescisión no puede condicionarse a la cancelación previa de sumas adeudadas. Queda Ud. debidamente notificado/a."',
        },
        {
          titulo: 'A dónde y cómo enviarla',
          cuerpo: 'Se envía por Correo Argentino como carta documento, en original y copia, al domicilio legal de la prepaga: figura en el contrato de adhesión, en la factura o en su web. Pedí el aviso de recepción y guardá la copia sellada y el comprobante de envío: son tu prueba de la fecha. Si tenés contrato a nombre de una empresa o la baja la gestiona un empleador, ajustá el texto con ayuda de un profesional.',
        },
        {
          titulo: 'Qué hacer después',
          cuerpo: 'Seguí pagando hasta la fecha de efecto, controlá que se corte el débito y no uses servicios después de esa fecha. Si te siguen cobrando, reclamá la devolución con la carta y el acuse; si la prepaga no responde, el siguiente paso es la Superintendencia de Servicios de Salud y Defensa del Consumidor. Si todavía no resolviste tu nueva cobertura, podés gestionarla desde acá antes de que se cumpla el plazo, así no queda un hueco.',
          cta: { texto: 'Compará el precio oficial de otras prepagas antes de que se cumpla el plazo.', boton: 'Comparar prepagas', href: '/comparador' },
        },
        {
          titulo: 'Esto no reemplaza a un abogado',
          cuerpo: 'El modelo es un texto general basado en la Ley 26.682 y su decreto reglamentario. Si tu caso tiene particularidades (deuda, cobertura por empresa, tratamientos en curso o un reclamo ya iniciado), conviene que lo revise un abogado de consumo o la Defensoría del Consumidor de tu jurisdicción.',
        },
      ],
      conclusion: 'La carta documento fija la fecha, deja prueba y habilita los reclamos posteriores. Usá el modelo, enviala al domicilio legal con acuse de recibo, y coordiná la fecha de efecto con tu nueva cobertura.',
    },
    faq: [
      { q: '¿Qué es una carta documento de baja de prepaga?', a: 'Es una notificación fehaciente enviada por Correo, en original y copia, con la que el titular comunica a la prepaga que rescinde el contrato. La Ley 26.682 exige que la rescisión se notifique de forma fehaciente con 30 días de anticipación.' },
      { q: '¿Cuántos días de preaviso tengo que dar?', a: 'Treinta días, según el artículo 9 de la Ley 26.682. Cada prepaga puede aplicar su propia fecha de efecto, por ejemplo OSDE da la baja desde el día del trámite.' },
      { q: '¿La carta documento es obligatoria?', a: 'No. Podés usar el botón de baja o el canal que ofrezca tu prepaga. La carta documento es la mejor prueba cuando la prepaga demora, rechaza el pedido o no te da constancia.' },
      { q: '¿A qué domicilio la envío?', a: 'Al domicilio legal de la prepaga, que figura en el contrato de adhesión, en la factura o en su sitio web.' },
      { q: '¿Qué tengo que pedir en la carta?', a: 'La baja de todo el grupo familiar, la constancia escrita de la fecha de efecto, el cese de facturación y débitos, y el estado de cuenta o libre deuda.' },
      { q: '¿Puedo mandarla si debo cuotas?', a: 'Sí. El decreto reglamentario dice que la baja no puede condicionarse a pagar antes lo adeudado. La deuda sigue existiendo y la prepaga puede reclamarla.' },
    ],
    keywords: ['carta documento baja prepaga', 'modelo carta documento baja prepaga', 'carta documento para dar de baja la prepaga', 'carta de baja prepaga', 'modelo carta baja medicina prepaga', 'carta documento baja obra social prepaga', 'texto carta documento baja prepaga', 'como redactar carta documento prepaga'],
    relacionadas: ['prepaga-no-me-da-la-baja', 'prepaga-sigue-cobrando-despues-de-la-baja', 'como-dar-de-baja-prepaga-u-obra-social', 'dar-de-baja-prepaga-con-deuda', 'como-reclamar-a-una-prepaga'],
    fuentes: [
      { texto: 'Ley 26.682, texto actualizado (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
      { texto: 'Decreto 1993/2011, texto actualizado (argentina.gob.ar)', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' },
    ],
  },
  {
    slug: 'prepaga-sigue-cobrando-despues-de-la-baja',
    titulo: 'La prepaga me sigue cobrando después de la baja: cómo frenar el débito y recuperar la plata',
    metaDescripcion: 'Si la prepaga te sigue cobrando después de la baja: comparar fechas, reclamo escrito, stop debit y reversión del débito (30 días), Superintendencia y Defensa del Consumidor.',
    tiempoLectura: 6,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-17',
    captarBaja: true,
    contenido: {
      intro: 'Si la prepaga te sigue cobrando después de la baja, actuá rápido: según el Banco Central, un débito directo se puede pedir revertir dentro de los 30 días corridos desde la fecha en que se hizo, ante la empresa o el banco donde tenés la cuenta, y el próximo débito se puede frenar (stop debit) hasta 24 horas antes del primer vencimiento. En paralelo, reclamá por escrito con tu constancia y, si no lo resuelven, ante la Superintendencia de Servicios de Salud y Defensa del Consumidor.',
      secciones: [
        {
          titulo: 'Primero, confirmá que el cobro sea indebido',
          cuerpo: 'Revisá la fecha en que tu baja se hizo efectiva. Cada prepaga fija la suya (OSDE desde el día del trámite o una fecha futura; Swiss Medical retroactiva al último día del mes anterior si pedís la baja hasta el día 5) y la ley habla de 30 días de preaviso. Si el cobro corresponde a una cuota anterior a esa fecha, es válido; si es posterior, es indebido. Armá una línea de tiempo con la constancia de baja, la factura y el movimiento bancario.',
        },
        {
          titulo: 'Frená el próximo débito (stop debit)',
          cuerpo: 'Según el BCRA, para un monto que no estás de acuerdo en pagar podés pedir que se cancele ese débito específico hasta 24 horas antes del primer vencimiento de la factura, ante tu banco o la empresa. Pedirlo frena ese monto, pero no cancela la adhesión: para eso, pedí por escrito a la prepaga y a tu banco la baja de la adhesión al débito automático.',
          enlaces: [{ texto: 'BCRA — Débito directo', url: 'https://www.bcra.gob.ar/debito-directo/' }],
        },
        {
          titulo: 'Pedí la reversión del débito ya cobrado',
          cuerpo: 'Según el BCRA, dentro de los 30 días corridos desde la fecha del débito podés pedir la reversión (devolución) del monto, ante la empresa del servicio o en el banco donde está tu cuenta. Es el plazo que más se pierde: pedilo cuanto antes. Si pagás con tarjeta, consultá con el emisor cómo impugnar el consumo y en qué plazo.',
        },
        {
          titulo: 'Reclamo escrito a la prepaga',
          cuerpo: 'Mandá un mail o carta documento con la constancia de baja, el comprobante del cobro indebido y el pedido de devolución y de cese de los débitos. La Ley 24.240 (art. 10 bis, inciso c) te permite rescindir con derecho a la restitución de lo pagado cuando el proveedor incumple, y el artículo 10 ter obliga a la empresa a enviarte una constancia fehaciente de la baja pedida a distancia dentro de las 72 horas de recibido el pedido.',
        },
        {
          titulo: 'Si no devuelven: Superintendencia y Defensa del Consumidor',
          cuerpo: 'Presentá la consulta o reclamo online ante la Superintendencia de Servicios de Salud (opción "Afiliaciones") y un reclamo gratuito en la Ventanilla Federal Única de Defensa del Consumidor, adjuntando constancia de baja, cartas, facturas y movimientos. Si el monto o el daño lo justifica, la vía judicial está abierta, con beneficio de justicia gratuita para las acciones individuales de consumo.',
          enlaces: [
            { texto: 'SSSalud — Consultas y reclamos', url: 'https://www.argentina.gob.ar/sssalud/consultas-la-superintendencia-de-servicios-de-salud' },
            { texto: 'Defensa del Consumidor — Iniciar un reclamo', url: 'https://www.argentina.gob.ar/servicio/iniciar-un-reclamo-ante-defensa-del-consumidor' },
          ],
        },
        {
          titulo: 'Y si ya estás en otra prepaga',
          cuerpo: 'Si el cobro duplicado aparece porque se superpusieron dos coberturas, la nueva prepaga no tiene responsabilidad: reclamá solo a la anterior. Si todavía no resolviste tu nueva cobertura, podés gestionarla desde acá y coordinar las fechas para no pagar dos veces ni quedarte sin cobertura.',
          cta: { texto: 'Compará el precio oficial de otras prepagas antes de decidir.', boton: 'Comparar prepagas', href: '/comparador' },
        },
      ],
      conclusion: 'Cobro posterior a la baja: confirmá la fecha efectiva, frená el próximo débito, pedí la reversión dentro de los 30 días, reclamá por escrito y escalá a la Superintendencia y a Defensa del Consumidor. Todo con constancia.',
    },
    faq: [
      { q: '¿Cuántos días tengo para pedir la reversión de un débito automático?', a: 'Según el BCRA, 30 días corridos desde la fecha del débito, ante la empresa del servicio o el banco donde tenés la cuenta.' },
      { q: '¿Hasta cuándo puedo frenar el débito de la prepaga?', a: 'Según el BCRA, el stop debit de un monto específico se puede pedir hasta 24 horas antes del primer vencimiento de la factura, en tu banco o en la empresa.' },
      { q: '¿Puedo reclamar si me cobraron después de la baja?', a: 'Sí. Reclamá por escrito con la constancia de baja y, si no devuelven, ante la Superintendencia de Servicios de Salud y Defensa del Consumidor.' },
      { q: '¿Cómo doy de baja el débito automático de la prepaga?', a: 'Pedilo por escrito a la prepaga y a tu banco. El stop debit del BCRA frena un monto puntual pero no cancela la adhesión.' },
      { q: '¿Qué prueba necesito para reclamar?', a: 'La constancia de la baja con fecha (botón, mail, número de gestión o carta documento), la factura y el comprobante del débito.' },
      { q: '¿Me corresponde la devolución de lo cobrado de más?', a: 'Si el cobro es posterior a la fecha efectiva de la baja, sí: el artículo 10 bis de la Ley 24.240 prevé la restitución de lo pagado cuando el proveedor incumple.' },
    ],
    keywords: ['prepaga me sigue cobrando despues de la baja', 'me siguen cobrando la prepaga', 'cobro despues de dar de baja prepaga', 'reversion debito automatico prepaga', 'stop debit prepaga', 'devolucion cuotas prepaga baja', 'me cobraron la prepaga despues de la baja', 'reclamo cobro indebido prepaga'],
    relacionadas: ['prepaga-no-me-da-la-baja', 'carta-documento-baja-prepaga-modelo', 'como-dar-de-baja-prepaga-u-obra-social', 'como-reclamar-a-una-prepaga', 'dar-de-baja-prepaga-con-deuda'],
    fuentes: [
      { texto: 'BCRA — Débito directo', url: 'https://www.bcra.gob.ar/debito-directo/' },
      { texto: 'Ley 24.240 de Defensa del Consumidor (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/0-4999/638/texact.htm' },
      { texto: 'SSSalud — Consultas', url: 'https://www.argentina.gob.ar/sssalud/consultas-la-superintendencia-de-servicios-de-salud' },
      { texto: 'Defensa del Consumidor — Iniciar un reclamo', url: 'https://www.argentina.gob.ar/servicio/iniciar-un-reclamo-ante-defensa-del-consumidor' },
    ],
  },
  {
    slug: 'dar-de-baja-prepaga-con-deuda',
    titulo: '¿Se puede dar de baja la prepaga con deuda? Qué dice la ley',
    metaDescripcion: 'Sí: el decreto reglamentario de la Ley 26.682 dice que la baja no puede condicionarse al pago previo de lo adeudado. Qué pasa con la deuda, qué pueden reclamar y cómo ordenarla.',
    tiempoLectura: 5,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-17',
    captarBaja: true,
    contenido: {
      intro: 'Sí, se puede dar de baja la prepaga con deuda: el decreto reglamentario de la Ley 26.682 establece que no puede supeditarse el ejercicio de la facultad de rescisión del usuario a la previa cancelación de las sumas adeudadas. La baja y la deuda van por carriles separados: la prepaga tiene que procesar tu baja y, si corresponde, reclamarte lo que debas por las vías legales.',
      secciones: [
        {
          titulo: 'Qué dice la norma',
          cuerpo: 'Decreto 1993/2011, artículo 9: el usuario puede rescindir en cualquier momento sin limitación y sin penalidad (una vez por año), y "no podrá supeditarse" ese derecho a la previa cancelación de lo adeudado a la entidad. Es la regla general: si una prepaga te dice que no te da la baja hasta que pagues, está yendo contra el decreto. Algunos reglamentos propios piden saldar la deuda al renunciar, pero esa exigencia no puede usarse para frenar tu baja.',
          enlaces: [{ texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' }],
        },
        {
          titulo: 'Qué pasa con la deuda',
          cuerpo: 'La deuda sigue existiendo: la prepaga puede reclamarte las cuotas realmente adeudadas hasta la fecha en que la baja se hizo efectiva, primero por carta o mail y, si no pagás, por la vía judicial. Antes de pagar, pedí por escrito el detalle: qué cuotas, qué período y qué conceptos (excedentes, intereses). Revisá que no incluyan cuotas posteriores a la fecha de efecto de la baja.',
        },
        {
          titulo: 'Cómo ordenarla',
          cuerpo: '1) Pedí el estado de cuenta por escrito. 2) Pagá lo que sea correcto o proponé un plan de pagos por escrito. 3) Pedí el libre deuda cuando termines. 4) Si el monto te parece incorrecto, pagá lo que no discutas y reclamá el resto con la constancia. Mientras tanto, mantené la baja pedida con carta documento si hace falta, para que la fecha de efecto no quede en duda.',
        },
        {
          titulo: 'Si la prepaga te da de baja a vos por deuda',
          cuerpo: 'La prepaga solo puede resolver el contrato por falta de pago de tres cuotas íntegras y consecutivas, y debe intimarte a regularizar en diez días hábiles. Si no cumplió esos pasos, la guía "La prepaga me dio de baja por falta de pago" explica cómo reclamar.',
        },
        {
          titulo: 'Y si querés pasarte a otra prepaga',
          cuerpo: 'La deuda con la prepaga anterior no impide que te asocies a otra, aunque conviene ordenarla para evitar reclamos. Si todavía no resolviste tu nueva cobertura, podés gestionarla desde acá: dejás tus datos y un asesor oficial te contacta.',
          cta: { texto: 'Compará el precio oficial de otras prepagas antes de decidir.', boton: 'Comparar prepagas', href: '/comparador' },
        },
      ],
      conclusion: 'La baja de la prepaga no puede frenarse por una deuda, pero la deuda no se borra. Pedí estado de cuenta, resolvé lo que corresponda y dejá la baja por escrito con fecha.',
    },
    faq: [
      { q: '¿Puedo dar de baja la prepaga si debo cuotas?', a: 'Sí. El decreto 1993/2011 dice que no puede supeditarse la rescisión del usuario a la previa cancelación de lo adeudado. La deuda sigue siendo exigible.' },
      { q: '¿La prepaga puede cobrarme la deuda después de la baja?', a: 'Sí, las cuotas realmente adeudadas hasta la fecha efectiva de la baja pueden reclamarse por las vías legales.' },
      { q: '¿Qué pasa si la prepaga dice que no me da la baja hasta que pague?', a: 'Dejá el pedido por escrito, mandá carta documento citando el decreto y reclamá ante la Superintendencia de Servicios de Salud y Defensa del Consumidor.' },
      { q: '¿Cómo pido el libre deuda?', a: 'Por escrito a la prepaga una vez cancelado el saldo, pidiendo la constancia de que no registrás deuda ni cuotas pendientes.' },
      { q: '¿Qué pasa si debo tres cuotas?', a: 'La prepaga puede rescindir el contrato por falta de pago de tres cuotas íntegras y consecutivas, pero antes debe intimarte a regularizar en diez días hábiles.' },
      { q: '¿Puedo asociarme a otra prepaga si tengo deuda con la anterior?', a: 'La normativa no lo impide, pero conviene ordenar la deuda para evitar reclamos posteriores.' },
    ],
    keywords: ['dar de baja prepaga con deuda', 'puedo dar de baja una prepaga con deuda', 'se puede dar de baja una prepaga con deuda', 'baja prepaga deuda', 'prepaga no da la baja por deuda', 'baja obra social con deuda', 'libre deuda prepaga'],
    relacionadas: ['prepaga-no-me-da-la-baja', 'prepaga-me-dio-de-baja-por-falta-de-pago', 'carta-documento-baja-prepaga-modelo', 'como-dar-de-baja-prepaga-u-obra-social', 'como-reclamar-a-una-prepaga'],
    fuentes: [
      { texto: 'Decreto 1993/2011, texto actualizado (argentina.gob.ar)', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' },
      { texto: 'Ley 26.682, texto actualizado (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
    ],
  },
  {
    slug: 'prepaga-me-dio-de-baja-por-falta-de-pago',
    titulo: 'La prepaga me dio de baja por falta de pago o por declaración jurada: qué hacer',
    metaDescripcion: 'La prepaga solo puede rescindir por tres cuotas impagas consecutivas (con intimación de 10 días hábiles) o por declaración jurada falseada con mala fe. Cómo reclamar si la baja fue ilegítima.',
    tiempoLectura: 6,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-17',
    captarBaja: true,
    contenido: {
      intro: 'La prepaga solo puede darte de baja por dos motivos: falta de pago de tres cuotas íntegras y consecutivas, o declaración jurada falseada (Ley 26.682, art. 9). En el primer caso, antes debe notificarte la mora e intimarte a regularizar en diez días hábiles; en el segundo, debe poder demostrar que obraste de mala fe, y si no lo acredita la baja es ilegítima. Si te dieron de baja sin cumplir estos pasos, podés reclamar la reincorporación.',
      secciones: [
        {
          titulo: 'Baja por falta de pago: lo que tiene que cumplir la prepaga',
          cuerpo: 'Según el decreto 1993/2011 (art. 9), la prepaga solo puede resolver el contrato por falta de pago de tres cuotas íntegras y consecutivas. Debe notificarte de inmediato la constitución en mora e intimarte, de forma fehaciente, a regularizar el pago íntegro en un plazo de diez días hábiles. Si no hubo esa intimación, o no esperó los diez días hábiles, la baja es discutible.',
          enlaces: [{ texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' }],
        },
        {
          titulo: 'Baja por declaración jurada falseada',
          cuerpo: 'La prepaga puede rescindir si falseaste la declaración jurada de salud, pero el decreto exige que acredite que no obraste de buena fe, y aclara que la falta de acreditación de la mala fe determina la ilegitimidad de la resolución. Una omisión sin mala fe no alcanza. Si te dieron de baja por una enfermedad preexistente, pedí por escrito el motivo y la prueba en que se basan.',
        },
        {
          titulo: 'Qué hacer si te dieron de baja',
          cuerpo: '1) Pedí por escrito el motivo exacto de la baja y copia de las intimaciones. 2) Si se trata de deuda y querés seguir, regularizá y pedí la reincorporación por escrito. 3) Si la baja fue ilegítima, reclamá ante la Superintendencia de Servicios de Salud, opción "Afiliaciones", y ante Defensa del Consumidor. 4) Evaluá con un abogado una acción judicial si necesitás cobertura urgente (tratamientos en curso): en esos casos la vía suele ser un amparo de salud.',
          enlaces: [{ texto: 'SSSalud — Consultas y reclamos', url: 'https://www.argentina.gob.ar/sssalud/consultas-la-superintendencia-de-servicios-de-salud' }],
        },
        {
          titulo: 'Para no quedar sin cobertura',
          cuerpo: 'Si la baja ya se produjo y no vas a poder revertirla rápido, conviene conseguir una nueva cobertura cuanto antes: en una nueva prepaga vas a tener que completar la declaración jurada de salud y es posible que apliquen carencias. Si todavía no resolviste tu nueva cobertura, podés gestionarla desde acá: dejás tus datos y un asesor oficial te contacta.',
          cta: { texto: 'Compará el precio oficial de otras prepagas.', boton: 'Comparar prepagas', href: '/comparador' },
        },
      ],
      conclusion: 'La prepaga solo puede darte de baja por tres cuotas impagas (con intimación de diez días hábiles) o por declaración jurada falseada con mala fe acreditada. Si no cumplió esos pasos, reclamá por escrito, ante la Superintendencia y en Defensa del Consumidor, y no te quedes sin cobertura.',
    },
    faq: [
      { q: '¿Cuándo puede una prepaga darme de baja?', a: 'Solo por falta de pago de tres cuotas íntegras y consecutivas o por declaración jurada falseada (Ley 26.682, art. 9).' },
      { q: '¿Tiene que avisarme antes de darme de baja por deuda?', a: 'Sí. Debe notificarte la mora e intimarte a regularizar el pago íntegro en diez días hábiles antes de resolver el contrato (decreto 1993/2011, art. 9).' },
      { q: '¿Me pueden dar de baja por una enfermedad preexistente?', a: 'Solo si falseaste la declaración jurada y la prepaga acredita que no obraste de buena fe. Si no lo acredita, la resolución es ilegítima.' },
      { q: '¿Cómo reclamo si me dieron de baja sin intimarme?', a: 'Pedí por escrito el motivo y las intimaciones, y reclamá ante la Superintendencia de Servicios de Salud (opción Afiliaciones) y Defensa del Consumidor.' },
      { q: '¿Qué hago si necesito atención urgente y me dieron de baja?', a: 'Consultá cuanto antes con un abogado: en tratamientos en curso, la vía suele ser un amparo de salud. Mientras tanto, la urgencia se atiende en guardias.' },
    ],
    keywords: ['prepaga me dio de baja por falta de pago', 'me dieron de baja de la prepaga', 'baja de prepaga por falta de pago', 'prepaga me dio de baja por preexistencia', 'baja por declaracion jurada prepaga', 'reincorporacion prepaga', 'prepaga rescinde contrato', 'baja de obra social por falta de pago'],
    relacionadas: ['dar-de-baja-prepaga-con-deuda', 'prepaga-no-me-da-la-baja', 'como-reclamar-a-una-prepaga', 'como-dar-de-baja-prepaga-u-obra-social', 'swiss-medical-mora-suspension-baja-por-falta-de-pago'],
    fuentes: [
      { texto: 'Decreto 1993/2011, texto actualizado (argentina.gob.ar)', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' },
      { texto: 'Ley 26.682, texto actualizado (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
      { texto: 'SSSalud — Consultas', url: 'https://www.argentina.gob.ar/sssalud/consultas-la-superintendencia-de-servicios-de-salud' },
    ],
  },
  {
    slug: 'baja-prepaga-fallecimiento-titular',
    titulo: 'Fallecimiento del titular de la prepaga: qué pasa con la cobertura de la familia',
    metaDescripcion: 'Si fallece el titular de la prepaga, el grupo familiar primario conserva la cobertura del PMO durante dos meses sin pagar. Después, alguien debe constituirse como titular. Plazos y trámite.',
    tiempoLectura: 5,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-17',
    captarBaja: true,
    contenido: {
      intro: 'Si fallece el titular de la prepaga, el grupo familiar primario mantiene la cobertura del Programa Médico Obligatorio (PMO) durante dos meses desde el fallecimiento, sin obligación de pagar (decreto 1993/2011, art. 13). Pasado ese plazo, un integrante del grupo que quiera seguir tiene que constituirse como titular del plan. Los reglamentos de cada prepaga pueden fijar plazos propios para conservar la antigüedad: conviene hacer el trámite cuanto antes.',
      secciones: [
        {
          titulo: 'Qué dice la normativa',
          cuerpo: 'El decreto 1993/2011, artículo 13, establece que, tras la muerte del titular, las entidades deben mantener la cobertura del PMO para el grupo familiar primario durante dos meses desde el fallecimiento, sin obligación de efectuar pago alguno. Después, quien quiera continuar debe constituirse como titular del plan.',
          enlaces: [{ texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' }],
        },
        {
          titulo: 'Qué dicen los reglamentos de las prepagas',
          cuerpo: 'Swiss Medical, por ejemplo, establece que la renuncia o muerte del titular resuelve la asociación de todo el grupo y que, para conservar la antigüedad, los integrantes que quieran seguir deben concurrir a las oficinas dentro de los 30 días del hecho para formar un nuevo grupo, abonando las cuotas desde ese momento. Es una cláusula distinta del plazo de dos meses sin pago del decreto: ante la duda, pedí por escrito a la prepaga cómo aplican ambos plazos y cuál es la fecha de efecto. Avalian, en cambio, prevé en su reglamento que el grupo familiar primario conserve la cobertura del PMO durante los tres primeros meses posteriores al deceso. CEMIC indica enviar el certificado de defunción a consultasafiliados@cemic.edu.ar y que otro integrante asuma la titularidad con un nuevo contrato.',
        },
        {
          titulo: 'Qué trámite hacer',
          cuerpo: '1) Avisá el fallecimiento a la prepaga por escrito y pedí por escrito cómo sigue la cobertura. 2) Reuní el acta de defunción y la documentación que pidan para acreditar el vínculo. 3) Decidí quién será el nuevo titular y pedí la continuidad de la antigüedad. 4) Si preferís cambiar de prepaga, hacelo sin dejar un hueco de cobertura: coordiná la fecha de la nueva con el fin de los dos meses.',
        },
        {
          titulo: 'Si querés evaluar otra cobertura',
          cuerpo: 'Muchas familias aprovechan el plazo para comparar precios y coberturas. Si todavía no resolviste tu nueva cobertura, podés gestionarla desde acá: dejás tus datos y un asesor oficial te contacta.',
          cta: { texto: 'Compará el precio oficial de otras prepagas.', boton: 'Comparar prepagas', href: '/comparador' },
        },
      ],
      conclusion: 'Tras el fallecimiento del titular, la familia tiene dos meses de cobertura del PMO sin pagar. Avisá por escrito, pedí cómo se aplica el plazo y decidí rápido quién se constituye como titular o si cambian de prepaga.',
    },
    faq: [
      { q: '¿Qué pasa con la prepaga si fallece el titular?', a: 'El grupo familiar primario conserva la cobertura del PMO durante dos meses desde el fallecimiento, sin obligación de pagar. Después, un integrante debe constituirse como titular.' },
      { q: '¿Tengo que pagar la cuota durante esos dos meses?', a: 'Según el decreto 1993/2011 (art. 13), no: la cobertura del PMO se mantiene sin obligación de efectuar pago alguno durante dos meses.' },
      { q: '¿Quién puede seguir como titular?', a: 'Un integrante del grupo familiar primario que quiera continuar y se constituya como titular del plan.' },
      { q: '¿Se pierde la antigüedad?', a: 'Depende del reglamento de la prepaga: Swiss Medical, por ejemplo, la conserva si el grupo se reconstituye dentro de los 30 días. Pedí la respuesta por escrito.' },
      { q: '¿Qué documentación piden?', a: 'Habitualmente el acta de defunción y la documentación que acredite el vínculo. Consultá con tu prepaga.' },
    ],
    keywords: ['fallecimiento titular prepaga', 'muerte del titular prepaga cobertura familia', 'que pasa con la prepaga si muere el titular', 'baja prepaga fallecimiento', 'prepaga fallecimiento titular dos meses', 'viuda prepaga cobertura', 'continuidad prepaga fallecimiento'],
    relacionadas: ['como-dar-de-baja-prepaga-u-obra-social', 'como-dar-de-baja-swiss-medical', 'como-cambiar-de-prepaga', 'prepaga-no-me-da-la-baja'],
    fuentes: [
      { texto: 'Decreto 1993/2011, texto actualizado (argentina.gob.ar)', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' },
      { texto: 'Swiss Medical — Reglamento General de Contratación (PDF)', url: 'https://www.swissmedical.com.ar/smgnewsite/pdf/prepaga/formularios/reglamento_swissmedical.pdf' },
    ],
  },
  {
    slug: 'arrepentimiento-prepaga-10-dias',
    titulo: 'Arrepentimiento de la prepaga: cómo cancelar en 10 días (artículo 34 de la Ley 24.240)',
    metaDescripcion: 'El consumidor puede revocar la aceptación durante 10 días corridos (art. 34, Ley 24.240) en contrataciones a distancia. Qué dicen Medifé, Omint y Medicus sobre su botón de arrepentimiento.',
    tiempoLectura: 5,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-17',
    captarBaja: true,
    contenido: {
      intro: 'Si acabás de contratar una prepaga y te arrepentiste, el artículo 34 de la Ley 24.240 te da 10 días corridos para revocar la aceptación, y esa facultad no puede ser dispensada ni renunciada. El plazo corre desde que se celebra el contrato. En las prepagas se canaliza con un "botón de arrepentimiento" en la web: Medifé, Omint y Medicus tienen uno.',
      secciones: [
        {
          titulo: 'Qué dice el artículo 34',
          cuerpo: 'La Ley 24.240 prevé que, en las contrataciones a distancia o fuera del local del proveedor, el consumidor tiene derecho a revocar la aceptación durante el plazo de diez días corridos, contados desde que se celebra el contrato, y que esa facultad no puede ser dispensada ni renunciada. Es distinto de la baja de la prepaga (artículo 9 de la Ley 26.682): el arrepentimiento es para los primeros días y no tiene costo de salida.',
          enlaces: [{ texto: 'Ley 24.240 (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/0-4999/638/texact.htm' }],
        },
        {
          titulo: 'Qué dicen las prepagas',
          cuerpo: 'Swiss Medical: su reglamento reconoce el derecho de revocar dentro de los 10 días conforme el artículo 34 de la Ley 24.240 (cláusula 1.5.2). Medifé: el formulario de arrepentimiento es de uso exclusivo para asociados que aún no están activos o cuyo plan no supera los 10 días de vigencia; si tu cuenta ya está activa, la baja se pide en Mi Cuenta. Medicus: el botón es para quien no está activo y está dentro de los 10 días corridos de la contratación; debe pedirlo el titular y, si ya usaste servicios, se facturan los días utilizados. Omint: tiene un "Botón de arrepentimiento" separado del de baja de servicios.',
        },
        {
          titulo: 'Cómo hacerlo bien',
          cuerpo: '1) Contá los 10 días corridos desde el día en que contrataste (no desde la primera factura). 2) Usá el botón de arrepentimiento de la prepaga o, si no lo hay, mandá un mail o carta documento. 3) Guardá la constancia. 4) No uses servicios mientras tanto si querés evitar cobros por días utilizados. 5) Si ya te cobraron, pedí la devolución.',
        },
        {
          titulo: 'Si ya pasaron los 10 días',
          cuerpo: 'Si ya pasaron los 10 días, el camino es la baja común: rescisión sin penalidad con 30 días de preaviso (Ley 26.682, art. 9). Mirá la guía de tu prepaga para el paso a paso.',
          cta: { texto: 'Compará el precio oficial de otras prepagas.', boton: 'Comparar prepagas', href: '/comparador' },
        },
      ],
      conclusion: 'Tenés 10 días corridos para arrepentirte de una contratación a distancia. Pedilo por el botón de arrepentimiento de la prepaga y guardá la constancia. Pasado ese plazo, aplica la baja con 30 días de preaviso.',
    },
    faq: [
      { q: '¿Cuántos días tengo para arrepentirme de contratar una prepaga?', a: 'Diez días corridos desde que se celebra el contrato, según el artículo 34 de la Ley 24.240.' },
      { q: '¿Se puede renunciar al derecho de arrepentimiento?', a: 'No: la ley dice que esa facultad no puede ser dispensada ni renunciada.' },
      { q: '¿Tiene costo arrepentirse?', a: 'No debería. Pero Medicus informa que, si usaste servicios, se facturan los días utilizados.' },
      { q: '¿Dónde está el botón de arrepentimiento?', a: 'En la web de la prepaga: Medifé, Omint y Medicus tienen uno. En Medicus está en el pie de la página (medicus.com.ar/arrepentimiento).' },
      { q: '¿Qué hago si ya pasaron los 10 días?', a: 'Pedí la baja común: la Ley 26.682 permite rescindir sin penalidad, con aviso fehaciente de 30 días.' },
    ],
    keywords: ['arrepentimiento prepaga', 'boton de arrepentimiento prepaga', 'arrepentirme de contratar prepaga', 'cancelar prepaga 10 dias', 'arrepentimiento medicina prepaga', 'revocar contratacion prepaga', 'articulo 34 ley 24240 prepaga'],
    relacionadas: ['como-dar-de-baja-prepaga-u-obra-social', 'prepaga-no-me-da-la-baja', 'como-dar-de-baja-medicus', 'como-dar-de-baja-medife', 'como-dar-de-baja-omint'],
    fuentes: [
      { texto: 'Ley 24.240 de Defensa del Consumidor (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/0-4999/638/texact.htm' },
      { texto: 'Medifé — Solicitar la baja del plan contratado', url: 'https://www.medife.com.ar/formulario-de-arrepentimiento' },
      { texto: 'Medicus — Botón de arrepentimiento', url: 'https://medicus.com.ar/arrepentimiento' },
      { texto: 'Omint — sitio oficial', url: 'https://www.omint.com.ar/PlanDeSalud/' },
    ],
  },
  {
    slug: 'hasta-cuando-tengo-cobertura-despues-de-la-baja-prepaga',
    titulo: 'Si doy de baja la prepaga, ¿hasta cuándo tengo cobertura?',
    metaDescripcion: 'La cobertura termina en la fecha en que se hace efectiva la baja (cada prepaga fija la suya). Excepción: tras el fallecimiento del titular hay dos meses de PMO. Cómo evitar quedarte sin cobertura.',
    tiempoLectura: 5,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-17',
    captarBaja: true,
    contenido: {
      intro: 'Al dar de baja la prepaga, la cobertura termina en la fecha en que la baja se hace efectiva: no hay un período de gracia general. Esa fecha la fija cada prepaga: OSDE, por ejemplo, la hace valer desde el día del trámite o una fecha futura, y Swiss Medical la computa según el día 5 del mes y Avalian al último día del mes si la pedís hasta el día 10. La única extensión que prevé el decreto 1993/2011 es de dos meses de cobertura del PMO para el grupo familiar primario tras el fallecimiento del titular. Por eso conviene tener la nueva cobertura confirmada antes de pedir la baja.',
      secciones: [
        {
          titulo: 'La fecha de efecto es la que manda',
          cuerpo: 'La cobertura rige hasta la fecha de efecto de la baja. Pedí por escrito la fecha exacta y planificá tus consultas, estudios o tratamientos antes de esa fecha. Con la ley en la mano, el preaviso es de 30 días (Ley 26.682, art. 9); algunas prepagas dan la baja en una fecha anterior si así lo establece su reglamento: lo que importa es tenerla por escrito.',
        },
        {
          titulo: 'Tratamientos en curso e internaciones',
          cuerpo: 'El decreto reglamentario no establece una continuidad automática de los tratamientos tras la baja del usuario. Si estás en un tratamiento o tenés una cirugía o internación programada, coordiná con tu prepaga y con tu médico antes de pedir la baja, y consultá con un abogado si la continuidad es crítica. Las urgencias y emergencias se atienden en guardias, pero la cobertura formal ya no existe luego de la fecha efectiva.',
        },
        {
          titulo: 'Cuándo hay extensión: fallecimiento del titular',
          cuerpo: 'El decreto 1993/2011 (art. 13) establece que, tras el fallecimiento del titular, el grupo familiar primario mantiene la cobertura del PMO durante dos meses sin pagar. Es la única extensión que prevé la norma. Mirá la guía específica para los pasos.',
        },
        {
          titulo: 'Cómo evitar quedarte sin cobertura',
          cuerpo: '1) Cotizá y confirmá la nueva cobertura antes de pedir la baja. 2) Coordiná que la nueva rija desde el día siguiente al fin de la anterior. 3) Pedí la baja con la fecha de efecto exacta por escrito. 4) Tené en cuenta que en la nueva prepaga vas a completar una declaración jurada y puede haber carencias. Si todavía no resolviste tu nueva cobertura, podés gestionarla desde acá: dejás tus datos y un asesor oficial te contacta.',
          cta: { texto: 'Compará el precio oficial de otras prepagas.', boton: 'Comparar prepagas', href: '/comparador' },
        },
      ],
      conclusion: 'Cobertura hasta la fecha efectiva de la baja y nada más (salvo los dos meses de PMO por fallecimiento del titular). Confirmá la fecha por escrito y organizá tu nueva cobertura antes.',
    },
    faq: [
      { q: '¿Hasta cuándo tengo cobertura si doy de baja la prepaga?', a: 'Hasta la fecha en que la baja se hace efectiva. No hay un período de gracia general: cada prepaga fija su fecha de efecto y la ley establece un preaviso de 30 días.' },
      { q: '¿Me cubren un tratamiento en curso después de la baja?', a: 'El decreto reglamentario no prevé continuidad automática. Coordiná con la prepaga y tu médico antes de pedir la baja, y consultá a un abogado si es crítico.' },
      { q: '¿Cuánto tiempo cubre la prepaga si fallece el titular?', a: 'El grupo familiar primario mantiene la cobertura del PMO durante dos meses desde el fallecimiento, sin pagar (decreto 1993/2011, art. 13).' },
      { q: '¿Puedo usar la prepaga el mes que pagué si pedí la baja?', a: 'Depende de la fecha de efecto: pedila por escrito. Con Swiss Medical, por ejemplo, la baja pedida hasta el día 5 se computa desde el último día del mes anterior.' },
      { q: '¿Qué hago para no quedarme sin cobertura entre dos prepagas?', a: 'Confirmá la nueva cobertura antes de pedir la baja y coordiná que arranque el día siguiente al fin de la anterior.' },
    ],
    keywords: ['si doy de baja la prepaga cuanto tiempo me cubre', 'hasta cuando tengo cobertura despues de la baja prepaga', 'cobertura despues de baja prepaga', 'cuanto tarda la baja de la prepaga', 'baja prepaga fecha efecto', 'baja prepaga retroactiva', 'cobertura tras baja obra social'],
    relacionadas: ['como-dar-de-baja-prepaga-u-obra-social', 'baja-prepaga-fallecimiento-titular', 'como-cambiar-de-prepaga', 'prepaga-no-me-da-la-baja', 'prepaga-sin-periodo-carencia'],
    fuentes: [
      { texto: 'Decreto 1993/2011, texto actualizado (argentina.gob.ar)', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' },
      { texto: 'Ley 26.682, texto actualizado (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
      { texto: 'OSDE — Bajas (información al socio)', url: 'https://www.osde.com.ar/informacion-al-socio/servicios-y-cobertura/bajas' },
      { texto: 'Swiss Medical — Reglamento General de Contratación (PDF)', url: 'https://www.swissmedical.com.ar/smgnewsite/pdf/prepaga/formularios/reglamento_swissmedical.pdf' },
    ],
  },
  // 17-oct-2026: bajas de Prevención Salud, Hominis, Hospital Italiano y Avalian,
  // leídas de sus webs oficiales (sin enviar formularios). Accord Salud,
  // CEMIC y Premedic quedan pendientes: sus páginas de baja no se pudieron
  // leer (imagen, sin datos publicados o sin acceso).
  {
    slug: 'como-dar-de-baja-prevencion-salud',
    titulo: 'Cómo dar de baja Prevención Salud: solicitud de baja online y arrepentimiento',
    metaDescripcion: 'Prevención Salud tiene "Solicitud de baja" en su Autogestión de afiliados y un formulario de arrepentimiento para altas de hasta 10 días. Pasos, datos que pide y qué guardar.',
    tiempoLectura: 4,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-17',
    captarBaja: true,
    contenido: {
      intro: 'Prevención Salud ofrece dos caminos oficiales. Para una baja común, el pie de su web tiene "Solicitud de baja", que lleva a la Autogestión de afiliados (se ingresa con tu correo y contraseña, o con Google, Apple o Microsoft). Para quien se acaba de asociar, hay un "Formulario de arrepentimiento" que sirve si el alta fue en los últimos 10 días y lo pide el titular.',
      secciones: [
        {
          titulo: 'Baja común: Autogestión de afiliados',
          cuerpo: '1) Entrá a prevencionsalud.com.ar y buscá "Solicitud de baja" en el pie de la página. 2) Iniciá sesión en Autogestión Afiliados con tu correo electrónico (o con Google, Apple o Microsoft). Si no tenés cuenta, el portal te permite registrarte. 3) Seguí el trámite y guardá la constancia con la fecha.',
          enlaces: [{ texto: 'Prevención Salud — Autogestión de afiliados (solicitud de baja)', url: 'https://autogestionafiliados.prevencionsalud.com.ar/unsubscribe' }],
        },
        {
          titulo: 'Arrepentimiento: alta de hasta 10 días',
          cuerpo: 'El "Formulario de arrepentimiento del servicio de medicina prepaga" aclara que, para cancelar una solicitud, hay que ser titular del plan y haber solicitado el alta dentro de los últimos 10 días. Cancelar la solicitud interrumpe el ingreso como afiliados de todos los integrantes del grupo familiar declarados y la cobertura médico-asistencial. El formulario pide apellido, nombre, tipo y número de documento, fecha de nacimiento, teléfono, correo, el plan contratado y si usaste la cobertura.',
        },
        {
          titulo: 'Consultas',
          cuerpo: 'Prevención Salud publica el 0810-888-0010 (lunes a viernes de 8 a 20) para consultas generales. Si pedís la baja por teléfono, pedí número de gestión y una confirmación escrita.',
        },
        {
          titulo: 'Antes de bajarte',
          cuerpo: 'Si te das de baja y volvés más tarde, empezás de cero: se pierde la antigüedad y pueden aplicar carencias de nuevo. Si el motivo es el precio, consultá primero un plan más económico de Prevención Salud, o compará otra prepaga y pasate sin dejar un hueco de cobertura.',
          cta: { texto: 'Compará el precio oficial de los planes de Prevención Salud con otras prepagas.', boton: 'Comparar prepagas', href: '/comparador' },
        },
        {
          titulo: 'Qué dice la ley (vale para todas las prepagas)',
          cuerpo: 'Ley 26.682, artículo 9: podés rescindir en cualquier momento, sin penalidad, notificando de forma fehaciente con 30 días de anticipación. El decreto reglamentario agrega que solo se puede ejercer una vez por año y que la prepaga no puede condicionar tu baja a que canceles antes lo que debas. Si algo del trámite te parece contrario a esto, reclamá ante la Superintendencia de Servicios de Salud.',
          enlaces: [{ texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' }],
        },
      ],
      conclusion: 'Prevención Salud: baja desde Autogestión de afiliados, o formulario de arrepentimiento si el alta fue en los últimos 10 días. Guardá la constancia y revisá la próxima factura.',
    },
    faq: [
      { q: '¿Cómo doy de baja Prevención Salud?', a: 'Desde "Solicitud de baja" en el pie de la web de Prevención Salud, que lleva a la Autogestión de afiliados, donde iniciás sesión con tu correo electrónico.' },
      { q: '¿Qué es el formulario de arrepentimiento de Prevención Salud?', a: 'Sirve para cancelar una solicitud de alta hecha en los últimos 10 días. Tiene que pedirlo el titular y cancela el ingreso de todo el grupo familiar declarado.' },
      { q: '¿Necesito cuenta para pedir la baja?', a: 'Sí, la Autogestión de afiliados pide iniciar sesión (correo electrónico, o Google, Apple o Microsoft). Si no tenés cuenta, permite registrarte.' },
      { q: '¿A qué teléfono consulto por la baja?', a: 'Prevención Salud publica el 0810-888-0010 para consultas generales, de lunes a viernes de 8 a 20.' },
      { q: '¿Pueden condicionar la baja a que pague una deuda?', a: 'No. El decreto reglamentario de la Ley 26.682 dice que la prepaga no puede supeditar tu baja a la cancelación previa de lo adeudado, aunque la deuda siga siendo exigible.' },
      { q: '¿Qué hago si me siguen cobrando después de la baja?', a: 'Reclamá por escrito con tu constancia y, si no lo resuelven, ante la Superintendencia de Servicios de Salud o Defensa del Consumidor.' },
    ],
    keywords: ['como dar de baja prevencion salud', 'dar de baja prevencion salud', 'baja prevencion salud', 'prevencion salud solicitud de baja', 'prevencion salud arrepentimiento', 'como darme de baja de prevencion salud', 'prevencion salud baja online', 'prevencion salud dar de baja prepaga', 'baja de prevencion salud telefono'],
    relacionadas: ['como-dar-de-baja-prepaga-u-obra-social', 'prepaga-no-me-da-la-baja', 'carta-documento-baja-prepaga-modelo', 'prepaga-sigue-cobrando-despues-de-la-baja', 'arrepentimiento-prepaga-10-dias', 'como-cambiar-de-prepaga'],
    prepagasRelacionadas: ['prevencion-salud'],
    fuentes: [
      { texto: 'Prevención Salud — sitio oficial', url: 'https://www.prevencionsalud.com.ar/' },
      { texto: 'Prevención Salud — Autogestión de afiliados', url: 'https://autogestionafiliados.prevencionsalud.com.ar/unsubscribe' },
      { texto: 'Ley 26.682, texto actualizado (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
      { texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' },
    ],
  },
  {
    slug: 'como-dar-de-baja-hominis',
    titulo: 'Cómo dar de baja Hominis: solicitud de baja online, requisitos y baja parcial',
    metaDescripcion: 'Hominis tiene "Solicitud de baja" en su web (con inicio de sesión): hay que ser titular del grupo, la baja alcanza a todos los integrantes y se puede pedir una baja parcial. Pasos y contactos.',
    tiempoLectura: 4,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-17',
    captarBaja: true,
    contenido: {
      intro: 'Hominis tiene una página de "Solicitud de baja" dentro de Información útil: pide iniciar sesión en Mi Hominis, y sus requisitos indispensables son ser el titular del grupo y tener en cuenta que la solicitud implica la rescisión del servicio para todos los integrantes del grupo familiar. Si la baja es parcial, hay que indicar nombre, apellido y DNI de quien se da de baja.',
      secciones: [
        {
          titulo: 'Paso a paso',
          cuerpo: '1) Entrá a hominis.com.ar y buscá "Solicitud de baja" en Información útil. 2) Tocá "Iniciar sesión" con tu cuenta de Mi Hominis. 3) Completá la solicitud y guardá la constancia con la fecha.',
          enlaces: [{ texto: 'Hominis — Solicitud de baja', url: 'https://www.hominis.com.ar/mi-hominis/mh-baja-del-servicio.php' }],
        },
        {
          titulo: 'Requisitos que informa Hominis',
          cuerpo: 'Ser titular del grupo. La solicitud de baja implica la rescisión del servicio para todos los integrantes del grupo familiar y la finalización de las prestaciones médico-asistenciales. Si la baja es parcial (solo uno o más integrantes), hay que consignar claramente nombre y apellido del integrante con su número de DNI.',
        },
        {
          titulo: 'Contactos publicados',
          cuerpo: 'Hominis publica un contacto específico para "Mora / Bajas / Cambios de plan": WhatsApp +54 9 11 2838-1649. Atención al socio: 0810-999-1950. En la web también figura el Reglamento y Condiciones Generales de Contratación como descarga: leelo antes de pedir la baja, sobre todo si debés cuotas o tenés un grupo familiar.',
        },
        {
          titulo: 'Antes de bajarte',
          cuerpo: 'Si te das de baja y volvés más tarde, empezás de cero: se pierde la antigüedad y pueden aplicar carencias de nuevo. Si el motivo es el precio, consultá primero un plan más económico de Hominis, o compará otra prepaga y pasate sin dejar un hueco de cobertura.',
          cta: { texto: 'Compará el precio oficial de los planes de Hominis con otras prepagas.', boton: 'Comparar prepagas', href: '/comparador' },
        },
        {
          titulo: 'Qué dice la ley (vale para todas las prepagas)',
          cuerpo: 'Ley 26.682, artículo 9: podés rescindir en cualquier momento, sin penalidad, notificando de forma fehaciente con 30 días de anticipación. El decreto reglamentario agrega que solo se puede ejercer una vez por año y que la prepaga no puede condicionar tu baja a que canceles antes lo que debas. Si algo del trámite te parece contrario a esto, reclamá ante la Superintendencia de Servicios de Salud.',
          enlaces: [{ texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' }],
        },
      ],
      conclusion: 'Hominis: baja desde "Solicitud de baja" con tu cuenta de Mi Hominis, siendo titular del grupo; implica a todo el grupo, salvo que pidas una baja parcial indicando DNI. Guardá la constancia.',
    },
    faq: [
      { q: '¿Cómo doy de baja Hominis?', a: 'Desde "Solicitud de baja" en la sección Información útil de la web de Hominis, iniciando sesión en Mi Hominis.' },
      { q: '¿Quién puede pedir la baja de Hominis?', a: 'El titular del grupo.' },
      { q: '¿La baja incluye a toda mi familia?', a: 'Sí: implica la rescisión para todos los integrantes del grupo familiar. Si querés una baja parcial, hay que indicar nombre, apellido y DNI de quien se da de baja.' },
      { q: '¿Hay un WhatsApp para bajas?', a: 'Hominis publica el +54 9 11 2838-1649 para "Mora / Bajas / Cambios de plan".' },
      { q: '¿Pueden condicionar la baja a que pague una deuda?', a: 'No. El decreto reglamentario de la Ley 26.682 dice que la prepaga no puede supeditar tu baja a la cancelación previa de lo adeudado, aunque la deuda siga siendo exigible.' },
      { q: '¿Qué hago si me siguen cobrando después de la baja?', a: 'Reclamá por escrito con tu constancia y, si no lo resuelven, ante la Superintendencia de Servicios de Salud o Defensa del Consumidor.' },
    ],
    keywords: ['como dar de baja hominis', 'dar de baja hominis', 'baja hominis', 'hominis solicitud de baja', 'como darme de baja de hominis', 'dar de baja obra social hominis', 'hominis baja online', 'hominis baja telefono'],
    relacionadas: ['como-dar-de-baja-prepaga-u-obra-social', 'prepaga-no-me-da-la-baja', 'carta-documento-baja-prepaga-modelo', 'prepaga-sigue-cobrando-despues-de-la-baja', 'como-cambiar-de-prepaga'],
    prepagasRelacionadas: ['hominis'],
    fuentes: [
      { texto: 'Hominis — Solicitud de baja', url: 'https://www.hominis.com.ar/mi-hominis/mh-baja-del-servicio.php' },
      { texto: 'Ley 26.682, texto actualizado (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
      { texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' },
    ],
  },
  {
    slug: 'como-dar-de-baja-hospital-italiano',
    titulo: 'Cómo dar de baja el Plan de Salud del Hospital Italiano: el formulario "¿Cómo cancelar mi afiliación?"',
    metaDescripcion: 'El Hospital Italiano tiene en su web el formulario para cancelar la afiliación al Plan de Salud, que puede usarse en cualquier momento. Dónde está, qué conviene guardar y qué dice la ley.',
    tiempoLectura: 4,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-17',
    captarBaja: true,
    contenido: {
      intro: 'El Plan de Salud del Hospital Italiano publica una página "¿Cómo cancelar mi afiliación?" que dice que, a través de su formulario y en cualquier momento, los afiliados pueden solicitar la baja del servicio. El acceso es el botón que figura al pie de esa página. Es el camino oficial online; si el formulario no te responde, la ley te permite notificar por carta documento.',
      secciones: [
        {
          titulo: 'Paso a paso',
          cuerpo: '1) Entrá a la página "¿Cómo cancelar mi afiliación?" del Plan de Salud del Hospital Italiano. 2) Abrí el formulario desde el botón de la página y completá tus datos. 3) Guardá la constancia con la fecha (captura, número de gestión o mail de confirmación).',
          enlaces: [{ texto: 'Hospital Italiano — ¿Cómo cancelar mi afiliación?', url: 'https://www.hospitalitaliano.org.ar/hiba/es/arrepentimiento' }],
        },
        {
          titulo: 'Qué conviene saber',
          cuerpo: 'La propia página cita la Res. 271/2020 como base del formulario y aclara que sirve en cualquier momento. Su Portal de pacientes también está disponible para otras gestiones. En la página no figuran los plazos de vigencia ni la documentación: pedí por escrito la fecha en que se hace efectiva la baja y guardá todo lo que te respondan.',
        },
        {
          titulo: 'Antes de bajarte',
          cuerpo: 'Si te das de baja y volvés más tarde, empezás de cero: se pierde la antigüedad y pueden aplicar carencias de nuevo. Si el motivo es el precio, consultá primero un plan más económico del Plan de Salud, o compará otra prepaga y pasate sin dejar un hueco de cobertura.',
          cta: { texto: 'Compará el precio oficial del Plan de Salud del Hospital Italiano con otras prepagas.', boton: 'Comparar prepagas', href: '/comparador' },
        },
        {
          titulo: 'Qué dice la ley (vale para todas las prepagas)',
          cuerpo: 'Ley 26.682, artículo 9: podés rescindir en cualquier momento, sin penalidad, notificando de forma fehaciente con 30 días de anticipación. El decreto reglamentario agrega que solo se puede ejercer una vez por año y que la prepaga no puede condicionar tu baja a que canceles antes lo que debas. Si algo del trámite te parece contrario a esto, reclamá ante la Superintendencia de Servicios de Salud.',
          enlaces: [{ texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' }],
        },
      ],
      conclusion: 'Plan de Salud del Hospital Italiano: baja desde el formulario de la página "¿Cómo cancelar mi afiliación?", en cualquier momento. Guardá la constancia y pedí la fecha de efecto por escrito.',
    },
    faq: [
      { q: '¿Cómo doy de baja el Plan de Salud del Hospital Italiano?', a: 'Desde el formulario de la página "¿Cómo cancelar mi afiliación?" del Plan de Salud, que según la página puede usarse en cualquier momento.' },
      { q: '¿Qué resolución cita el Hospital Italiano para la baja?', a: 'La página indica "Res 271/2020".' },
      { q: '¿Qué hago si el formulario no funciona?', a: 'Notificá por carta documento al domicilio legal y reclamá ante la Superintendencia de Servicios de Salud. La ley exige aviso fehaciente con 30 días de anticipación.' },
      { q: '¿Pueden condicionar la baja a que pague una deuda?', a: 'No. El decreto reglamentario de la Ley 26.682 dice que la prepaga no puede supeditar tu baja a la cancelación previa de lo adeudado, aunque la deuda siga siendo exigible.' },
      { q: '¿Qué hago si me siguen cobrando después de la baja?', a: 'Reclamá por escrito con tu constancia y, si no lo resuelven, ante la Superintendencia de Servicios de Salud o Defensa del Consumidor.' },
    ],
    keywords: ['como dar de baja hospital italiano', 'dar de baja prepaga hospital italiano', 'baja plan de salud hospital italiano', 'hospital italiano baja de afiliacion', 'dar de baja obra social hospital italiano', 'hospital italiano cancelar afiliacion', 'hospital italiano boton de arrepentimiento'],
    relacionadas: ['como-dar-de-baja-prepaga-u-obra-social', 'prepaga-no-me-da-la-baja', 'carta-documento-baja-prepaga-modelo', 'prepaga-sigue-cobrando-despues-de-la-baja', 'como-cambiar-de-prepaga'],
    prepagasRelacionadas: ['hospital-italiano'],
    fuentes: [
      { texto: 'Hospital Italiano — ¿Cómo cancelar mi afiliación?', url: 'https://www.hospitalitaliano.org.ar/hiba/es/arrepentimiento' },
      { texto: 'Ley 26.682, texto actualizado (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
      { texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' },
    ],
  },
  {
    slug: 'como-dar-de-baja-avalian',
    titulo: 'Cómo dar de baja Avalian: Botón de baja, fecha de efecto (día 10), baja transitoria y reglamento',
    metaDescripcion: 'Avalian: la baja la pide el titular por escrito o con el "Botón de baja". Rige al último día del mes si la pedís hasta el día 10. Además: baja transitoria, bajas parciales y fallecimiento del titular.',
    tiempoLectura: 6,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-17',
    captarBaja: true,
    contenido: {
      intro: 'Según el Reglamento general de servicios y contratación de Avalian (v02), la baja solo puede pedirla el titular de la cuenta, por escrito o con el "Botón de baja" de su web, completando el formulario. La baja se computa al último día del mes en que se solicita, siempre que se tramite hasta el día 10 (o el hábil posterior). Hasta entonces seguís obligado a pagar las cuotas, con intereses. El reglamento también prevé la baja transitoria para quien se va del país más de 90 días.',
      secciones: [
        {
          titulo: 'Paso a paso',
          cuerpo: '1) Entrá a avalian.com y buscá "Bajas" en Información útil, al pie de la página; te lleva a la Autogestión de afiliados (online.avalian.com), donde se ingresa con tu cuenta o con Google. 2) Completá el formulario de baja (también podés presentarlo por escrito). 3) Guardá la constancia con la fecha. La atención telefónica oficial es el 0810-222-72583 (SALUD).',
          enlaces: [{ texto: 'Avalian — Autogestión de afiliados', url: 'https://online.avalian.com/' }],
        },
        {
          titulo: 'Qué dice el reglamento sobre la baja',
          cuerpo: 'Punto 5.2: el titular puede rescindir en cualquier momento, sin limitación y sin penalidad, notificando fehacientemente con treinta días de anticipación, y el derecho se puede ejercer solamente una vez por año. Punto 5.3: la baja se computa al último día del mes en que se solicite, siempre que se tramite hasta el día diez (o el hábil posterior). Punto 5.4: si hay deudas con Avalian u otros prestadores, la baja no las extingue y Avalian se reserva el derecho de reclamarlas judicialmente. Punto 7.3: hay que reintegrar las credenciales de todo el grupo familiar.',
        },
        {
          titulo: 'Qué pasa con tu grupo familiar',
          cuerpo: 'La baja del titular implica la de su grupo. Los integrantes que quieran seguir en Avalian y mantener la antigüedad tienen que concurrir a las oficinas dentro de los 30 días de la solicitud para formar un nuevo grupo y pagar las cuotas desde la baja (puntos 2.2.A y 5.5). Las bajas parciales que desbalanceen el cálculo de riesgo de la cuenta pueden implicar un nuevo contrato, con modalidades que fija Avalian.',
        },
        {
          titulo: 'Baja transitoria: asociado ausente',
          cuerpo: 'Si te vas del país por más de 90 días, el reglamento permite pedir la condición de "asociado ausente" (punto 5.6): el servicio se suspende temporalmente, pagás el 25% de la cuota para mantener la antigüedad, solo una vez por año calendario de vigencia del plan, y rige para todo el grupo familiar, no de manera individual. Al volver, hay que acreditar el lugar y el tiempo de permanencia en el exterior. Es una alternativa a la baja si no querés perder la antigüedad.',
        },
        {
          titulo: 'Fallecimiento del titular y reincorporación',
          cuerpo: 'El reglamento dice que el fallecimiento del titular no implica la caducidad de los derechos del grupo, y que el grupo familiar primario cuenta con la cobertura del PMO durante los tres primeros meses posteriores al deceso (punto 6). Si pedís la reincorporación tras una baja por deuda, Avalian puede rechazarla aunque canceles el saldo, y si la acepta tenés que pagar lo adeudado con intereses y las cuotas entre la baja y el alta para mantener la antigüedad.',
        },
        {
          titulo: 'Antes de bajarte',
          cuerpo: 'Si te das de baja y volvés más tarde, empezás de cero salvo que mantengas la continuidad en los plazos que fija el reglamento. Si el motivo es el precio, consultá primero un plan más económico de Avalian o, si te vas del país, la baja transitoria; o compará otra prepaga y pasate sin dejar un hueco de cobertura.',
          cta: { texto: 'Compará el precio oficial de los planes de Avalian con otras prepagas.', boton: 'Comparar prepagas', href: '/comparador' },
        },
        {
          titulo: 'Qué dice la ley (vale para todas las prepagas)',
          cuerpo: 'Ley 26.682, artículo 9: podés rescindir en cualquier momento, sin penalidad, notificando de forma fehaciente con 30 días de anticipación. El decreto reglamentario agrega que solo se puede ejercer una vez por año y que la prepaga no puede condicionar tu baja a que canceles antes lo que debas: la baja y la deuda van por carriles separados, como dice el propio reglamento de Avalian. Si algo del trámite te parece contrario a esto, reclamá ante la Superintendencia de Servicios de Salud.',
          enlaces: [{ texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' }],
        },
      ],
      conclusion: 'Avalian: la baja la pide el titular, por escrito o con el Botón de baja; rige al último día del mes si la pedís hasta el día 10, y mientras tanto se siguen pagando las cuotas. Alternativa si te vas del país: baja transitoria al 25% de la cuota.',
    },
    faq: [
      { q: '¿Cómo doy de baja Avalian?', a: 'El titular la pide por escrito o con el "Botón de baja" de la web de Avalian (Autogestión de afiliados), completando el formulario correspondiente.' },
      { q: '¿Hasta qué día tengo que pedir la baja de Avalian?', a: 'Hasta el día 10 de cada mes (o el hábil posterior): en ese caso la baja se computa al último día del mes en que se solicita.' },
      { q: '¿Tengo que pagar la cuota mientras tramito la baja?', a: 'Según el reglamento, hasta que se cumplan los requisitos de la baja el asociado está obligado a pagar las cuotas, con sus intereses.' },
      { q: '¿Qué es la baja transitoria de Avalian?', a: 'Si te ausentás del país más de 90 días, podés pedir la condición de asociado ausente: el servicio se suspende, pagás el 25% de la cuota y mantenés la antigüedad. Se puede usar una vez por año calendario y vale para todo el grupo.' },
      { q: '¿Qué pasa con la cobertura si fallece el titular?', a: 'El grupo familiar primario conserva la cobertura del PMO durante los tres primeros meses posteriores al deceso, según el reglamento de Avalian.' },
      { q: '¿Cuál es el teléfono de Avalian?', a: '0810-222-72583 (SALUD), la atención telefónica oficial.' },
      { q: '¿Pueden condicionar la baja a que pague una deuda?', a: 'No. El decreto reglamentario de la Ley 26.682 dice que la prepaga no puede supeditar tu baja a la cancelación previa de lo adeudado, aunque la deuda siga siendo exigible.' },
    ],
    keywords: ['como dar de baja avalian', 'dar de baja avalian', 'baja avalian', 'avalian bajas', 'como darme de baja de avalian', 'dar de baja prepaga avalian', 'avalian boton de baja', 'baja de obra social avalian', 'avalian baja telefono', 'avalian asociado ausente', 'avalian baja transitoria'],
    relacionadas: ['como-dar-de-baja-prepaga-u-obra-social', 'prepaga-no-me-da-la-baja', 'carta-documento-baja-prepaga-modelo', 'prepaga-sigue-cobrando-despues-de-la-baja', 'arrepentimiento-prepaga-10-dias', 'como-cambiar-de-prepaga'],
    prepagasRelacionadas: ['avalian'],
    fuentes: [
      { texto: 'Avalian — Reglamento general de servicios y contratación (v02)', url: 'https://avalian.com/' },
      { texto: 'Avalian — Autogestión de afiliados', url: 'https://online.avalian.com/' },
      { texto: 'Ley 26.682, texto actualizado (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
      { texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' },
    ],
  },
  {
    slug: 'baja-obra-social-monotributo',
    titulo: 'Cómo dar de baja la obra social del monotributo: adherentes, cambio y baja del monotributo',
    metaDescripcion: 'En el monotributo no hay una "baja de obra social" separada: el aporte va dentro de la cuota. Qué hacer para quitar adherentes, cambiar de obra social (Mi SSSalud) o dejar el monotributo (ARCA).',
    tiempoLectura: 6,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-17',
    captarBaja: true,
    contenido: {
      intro: 'En el monotributo no existe una "baja de obra social" por separado: según ARCA, el aporte a la obra social está incluido en la cuota mensual. Para dejar de tener esa obra social hay tres caminos: 1) cambiar de obra social con la opción de cambio en Mi SSSalud (una vez al año, rige desde el primer día del mes siguiente); 2) quitar a un familiar adherente desde Modificación de datos en el portal del Monotributo; 3) darte de baja del monotributo (en ese caso dejás de aportar a la obra social y a la jubilación).',
      secciones: [
        {
          titulo: 'Camino 1: cambiar de obra social (o pasarte a una prepaga)',
          cuerpo: 'Es el camino habitual si querés otra cobertura sin dejar el monotributo. Según la ARCA y la SSSalud, el trámite se hace por internet con clave fiscal nivel 3 en Mi SSSalud ("Nueva opción"), se puede hacer una vez al año y obliga a permanecer como mínimo un año en la obra social elegida; se hace efectivo el primer día del mes siguiente a la confirmación y mientras tanto la obra social de origen debe seguir cubriéndote. Los monotributistas solo pueden elegir agentes del seguro que aceptan monotributistas.',
          enlaces: [
            { texto: 'ARCA — Obra social en el monotributo', url: 'https://www.afip.gob.ar/monotributo/ayuda/obra-social.asp' },
            { texto: 'SSSalud — Opción de cambio para monotributistas', url: 'https://www.argentina.gob.ar/sssalud/usuarios/cambio-obra-sociales/monotributistas' },
          ],
        },
        {
          titulo: 'Camino 2: quitar a un familiar adherente',
          cuerpo: 'Si lo que querés es dar de baja a un adherente (cónyuge, hijo), se hace desde el servicio del Monotributo en ARCA: Modificación de datos > Obra Social, donde figura el listado de los familiares incorporados. Cada adherente tiene un aporte adicional, y la modificación genera el Formulario 184 como comprobante. Según la ayuda de ARCA, el aporte del grupo familiar primario debe pagarse hasta el mes en que hacés la modificación.',
          enlaces: [{ texto: 'argentina.gob.ar — Modificar el número de adherentes', url: 'https://www.argentina.gob.ar/modificar-datos-en-el-monotributo' }],
        },
        {
          titulo: 'Camino 3: darte de baja del monotributo',
          cuerpo: 'Podés darte de baja en cualquier momento desde el portal del Monotributo > Modificación y baja > "Darse de baja del Monotributo", indicando el motivo y confirmando. Según ARCA, el mes en que pedís la baja debe quedar pago para no generar deuda, la baja se hace efectiva al mes siguiente y, si aportabas a jubilación y obra social con el monotributo, vas a dejar de hacerlo. Dejar el monotributo significa perder la obra social: antes de hacerlo, asegurate de tener otra cobertura (por ejemplo, otra actividad en relación de dependencia o una prepaga).',
          enlaces: [{ texto: 'ARCA — Baja del monotributo', url: 'https://www.afip.gob.ar/monotributo/ayuda/baja.asp' }],
        },
        {
          titulo: 'Si estás en el Monotributo Social',
          cuerpo: 'El trámite es distinto: la inscripción, modificación o renuncia se hace por Trámites a Distancia (TAD, con clave fiscal nivel 3) o en persona, con turno en ANSES. El cambio de plan de salud, en ese caso, también se hace por la opción de cambio de la SSSalud.',
          enlaces: [{ texto: 'argentina.gob.ar — Modificar datos o darme de baja del monotributo', url: 'https://www.argentina.gob.ar/servicio/como-modifico-datos-o-me-doy-de-baja-del-monotributo' }],
        },
        {
          titulo: 'Para no quedarte sin cobertura',
          cuerpo: 'Si lo que querés es una prepaga, conviene elegirla antes de pedir el cambio. Con monotributo se puede derivar el aporte a una prepaga y pagar la diferencia. Si todavía no resolviste tu nueva cobertura, podés gestionarla desde acá: dejás tus datos y un asesor oficial te contacta.',
          cta: { texto: 'Compará el precio oficial de las prepagas para monotributistas.', boton: 'Comparar prepagas', href: '/comparador' },
        },
      ],
      conclusion: 'En el monotributo, "dar de baja la obra social" es cambiarla por la opción de cambio (una vez al año), quitar adherentes desde Modificación de datos, o dejar el monotributo (y con él los aportes). Elegí tu nueva cobertura antes de mover nada.',
    },
    faq: [
      { q: '¿Cómo doy de baja la obra social del monotributo?', a: 'No hay una baja separada: el aporte está incluido en la cuota. Podés cambiar de obra social con la opción de cambio en Mi SSSalud, quitar adherentes desde Modificación de datos del Monotributo, o darte de baja del monotributo.' },
      { q: '¿Cuántas veces puedo cambiar de obra social siendo monotributista?', a: 'Una vez al año, y hay que permanecer como mínimo un año en la obra social elegida, según la SSSalud.' },
      { q: '¿Desde cuándo rige el cambio de obra social?', a: 'Desde el primer día del mes siguiente a la confirmación; mientras tanto, la obra social de origen debe seguir cubriéndote.' },
      { q: '¿Qué pasa con mi obra social si me doy de baja del monotributo?', a: 'Según ARCA, los aportes a jubilación y obra social que hacías con el monotributo finalizan cuando la baja se hace efectiva.' },
      { q: '¿Tengo que pagar el mes en que pido la baja del monotributo?', a: 'Sí: ARCA indica que el mes en que solicitás la baja debe quedar pago, y la baja se hace efectiva el mes siguiente.' },
      { q: '¿Cómo quito a un adherente de la obra social del monotributo?', a: 'Desde el portal del Monotributo en ARCA, en Modificación de datos > Obra Social. Se genera el Formulario 184 como comprobante.' },
    ],
    keywords: ['baja de obra social monotributo', 'como dar de baja la obra social del monotributo', 'baja de obra social monotributo afip', 'baja de obra social arca', 'dar de baja adherente obra social monotributo', 'baja adherente obra social monotributo', 'baja de obra social en monotributo', 'dar de baja obra social monotributo afip', 'quiero dar de baja la obra social del monotributo'],
    relacionadas: ['opcion-de-cambio-obra-social', 'unificar-aportes-obra-social', 'derivar-obra-social-a-prepaga', 'como-dar-de-baja-prepaga-u-obra-social', 'sin-trabajo-obra-social', 'que-obra-social-tengo-codem'],
    fuentes: [
      { texto: 'ARCA — Obra social en el monotributo', url: 'https://www.afip.gob.ar/monotributo/ayuda/obra-social.asp' },
      { texto: 'ARCA — Baja del monotributo', url: 'https://www.afip.gob.ar/monotributo/ayuda/baja.asp' },
      { texto: 'argentina.gob.ar — Modificar datos en el monotributo', url: 'https://www.argentina.gob.ar/modificar-datos-en-el-monotributo' },
      { texto: 'SSSalud — Opción de cambio para monotributistas', url: 'https://www.argentina.gob.ar/sssalud/usuarios/cambio-obra-sociales/monotributistas' },
    ],
  },
  // 17-oct-2026: CEMIC. La página oficial (cemic.edu.ar/mi-cemic.php) solo
  // describe la baja por fallecimiento y los traspasos; no publica un
  // procedimiento de baja voluntaria ni preaviso. La guía lo dice así.
  {
    slug: 'como-dar-de-baja-cemic',
    titulo: 'Cómo dar de baja CEMIC: fallecimiento del titular, traspasos y baja voluntaria',
    metaDescripcion: 'CEMIC publica el trámite por fallecimiento (certificado de defunción por mail) y los traspasos de obra social, pero no un formulario de baja voluntaria. Canales oficiales y cómo dejar constancia.',
    tiempoLectura: 4,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-17',
    captarBaja: true,
    contenido: {
      intro: 'La página oficial de afiliados de CEMIC explica la baja por fallecimiento (se envía el certificado de defunción a consultasafiliados@cemic.edu.ar) y los traspasos de obra social (se hacen online), pero no publica un formulario ni un procedimiento de baja voluntaria ni un plazo de preaviso. Para una baja común, usá los canales oficiales de afiliados y dejá constancia por escrito; si no te dan respuesta, la ley te permite notificar por carta documento.',
      secciones: [
        {
          titulo: 'Baja por fallecimiento del titular',
          cuerpo: 'CEMIC indica enviar el certificado de defunción al mail consultasafiliados@cemic.edu.ar. Si fallece el titular, la titularidad la asume otro afiliado integrante del mismo grupo, que firma un nuevo contrato de forma presencial en la oficina de Av. Las Heras 2900, en días hábiles de 9 a 18. Recordá que el decreto 1993/2011 mantiene la cobertura del PMO del grupo familiar primario durante dos meses desde el fallecimiento, sin pagar.',
          enlaces: [{ texto: 'CEMIC — Mi CEMIC (afiliados)', url: 'https://cemic.edu.ar/mi-cemic.php' }],
        },
        {
          titulo: 'Baja voluntaria: canales oficiales',
          cuerpo: 'La página de afiliados no describe un trámite de baja voluntaria. Los canales que CEMIC publica para consultas de afiliados son: consultasafiliados@cemic.edu.ar, WhatsApp 11 2160-4545 y la atención administrativa de Av. Las Heras 2900 (teléfono 5299-1000, días hábiles de 9 a 18). Pedí la baja por escrito (mail o presencial con copia sellada), indicá nombre, DNI y número de afiliado, y guardá la respuesta con fecha.',
        },
        {
          titulo: 'Traspaso a otra obra social',
          cuerpo: 'Si tu aporte va a CEMIC por relación de dependencia y querés cambiar, CEMIC dice que los traspasos se hacen online y que para el recupero de aportes se necesita la constancia de la Superintendencia de la opción de cambio. El paso a paso de esa opción está en la guía de cambio de obra social.',
        },
        {
          titulo: 'Antes de bajarte',
          cuerpo: 'Si te das de baja y volvés más tarde, empezás de cero: se pierde la antigüedad y pueden aplicar carencias de nuevo. Si el motivo es el precio, consultá primero otro plan de CEMIC, o compará otra prepaga y pasate sin dejar un hueco de cobertura.',
          cta: { texto: 'Compará el precio oficial de los planes de CEMIC con otras prepagas.', boton: 'Comparar prepagas', href: '/comparador' },
        },
        {
          titulo: 'Qué dice la ley (vale para todas las prepagas)',
          cuerpo: 'Ley 26.682, artículo 9: podés rescindir en cualquier momento, sin penalidad, notificando de forma fehaciente con 30 días de anticipación. El decreto reglamentario agrega que solo se puede ejercer una vez por año y que la prepaga no puede condicionar tu baja a que canceles antes lo que debas. Si CEMIC no te da la baja, mandá una carta documento y reclamá ante la Superintendencia de Servicios de Salud.',
          enlaces: [{ texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' }],
        },
      ],
      conclusion: 'CEMIC publica el trámite por fallecimiento y los traspasos, pero no un procedimiento de baja voluntaria: pedila por escrito por sus canales de afiliados y, si hace falta, por carta documento. Guardá siempre la constancia.',
    },
    faq: [
      { q: '¿Cómo doy de baja CEMIC por fallecimiento del titular?', a: 'Enviando el certificado de defunción a consultasafiliados@cemic.edu.ar. Otro integrante del grupo puede asumir la titularidad firmando un nuevo contrato en Av. Las Heras 2900.' },
      { q: '¿CEMIC tiene un formulario de baja online?', a: 'Su página de afiliados no publica un formulario de baja. Los canales de consulta son el mail consultasafiliados@cemic.edu.ar, el WhatsApp 11 2160-4545 y la atención en Av. Las Heras 2900.' },
      { q: '¿CEMIC publica un plazo de preaviso para la baja?', a: 'No en su página de afiliados. La Ley 26.682 (art. 9) fija 30 días de preaviso fehaciente para rescindir sin penalidad.' },
      { q: '¿Cómo hago un traspaso de obra social en CEMIC?', a: 'CEMIC indica que los traspasos se efectúan online y que se necesita la constancia de la Superintendencia de la opción de cambio para recuperar aportes.' },
      { q: '¿Pueden condicionar la baja a que pague una deuda?', a: 'No. El decreto reglamentario de la Ley 26.682 dice que la prepaga no puede supeditar tu baja a la cancelación previa de lo adeudado, aunque la deuda siga siendo exigible.' },
    ],
    keywords: ['como dar de baja cemic', 'dar de baja cemic', 'baja cemic', 'cemic baja de afiliado', 'cemic fallecimiento titular', 'cemic traspaso obra social', 'como darme de baja de cemic', 'cemic dar de baja plan medico'],
    relacionadas: ['como-dar-de-baja-prepaga-u-obra-social', 'prepaga-no-me-da-la-baja', 'carta-documento-baja-prepaga-modelo', 'baja-prepaga-fallecimiento-titular', 'opcion-de-cambio-obra-social', 'como-cambiar-de-prepaga'],
    prepagasRelacionadas: ['cemic'],
    fuentes: [
      { texto: 'CEMIC — Mi CEMIC (afiliados)', url: 'https://cemic.edu.ar/mi-cemic.php' },
      { texto: 'Ley 26.682, texto actualizado (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
      { texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' },
    ],
  },
  // Premedic: el link lo pasó Darío (web.grupopremedic.com.ar/solicitud-de-baja).
  {
    slug: 'como-dar-de-baja-premedic',
    titulo: 'Cómo dar de baja Premedic: solicitud de baja online, baja total o parcial y teléfonos',
    metaDescripcion: 'Premedic tiene un formulario de solicitud de baja para asociados activos: solo lo puede hacer el titular, permite baja total o parcial y te contactan después. Qué pide, contactos y qué guardar.',
    tiempoLectura: 4,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-17',
    captarBaja: true,
    contenido: {
      intro: 'Premedic tiene una página de "Solicitud de baja": es de uso exclusivo para asociados activos, solo puede hacerla el titular del plan, y permite elegir entre baja total o parcial. Después de enviarla, Premedic indica que se pondrá en contacto lo más pronto posible para continuar el trámite, sin informar un plazo concreto.',
      secciones: [
        {
          titulo: 'Paso a paso',
          cuerpo: '1) Entrá al formulario de solicitud de baja de Premedic (Grupo Premedic). 2) Completá tu plan (C-100, 200, 300, 400, 500, Por aportes, AMBA, Básico, Bronce, Plata o Simple), tus datos de contacto, la sucursal más próxima, el tipo de baja (parcial o total), el horario de contacto preferido (de 10 a 18) y el motivo. 3) Enviá el formulario y guardá la captura con la fecha. 4) Esperá el contacto de Premedic y pedí confirmación escrita de la baja.',
          enlaces: [{ texto: 'Premedic — Solicitud de baja', url: 'https://web.grupopremedic.com.ar/solicitud-de-baja' }],
        },
        {
          titulo: 'Baja total o parcial',
          cuerpo: 'El formulario ofrece baja "Total" o "Parcial". La parcial es para dar de baja a algunos integrantes del grupo sin cerrar el plan; la total cierra el contrato. Si elegís la parcial, tené a mano los datos de las personas.',
        },
        {
          titulo: 'Motivo de la baja',
          cuerpo: 'El motivo se elige de una lista: problemas económicos, cambio de cobertura médica, viaje al exterior o interior, fallecimiento, disconformidad u otro. Si elegís disconformidad, te pregunta el tipo (asesoramiento comercial, prestadores de cartilla, copagos excedentes, cartilla médica, atención telefónica, entre otros). Elegir "problemas económicos" suele disparar una oferta de plan más barato: podés escucharla, pero no te obliga a nada.',
        },
        {
          titulo: 'Otros canales',
          cuerpo: 'Premedic publica la atención presencial en sus sucursales, el WhatsApp 15-2264-7285 y el teléfono 0810-222-5522, de lunes a viernes de 10 a 18. La página no detalla documentación ni un plazo máximo de resolución: pedí por escrito la fecha en que se hace efectiva la baja.',
        },
        {
          titulo: 'Antes de bajarte',
          cuerpo: 'Si te das de baja y volvés más tarde, empezás de cero: se pierde la antigüedad y pueden aplicar carencias de nuevo. Si el motivo es el precio, consultá primero un plan más económico de Premedic, o compará otra prepaga y pasate sin dejar un hueco de cobertura.',
          cta: { texto: 'Compará el precio oficial de los planes de Premedic con otras prepagas.', boton: 'Comparar prepagas', href: '/comparador' },
        },
        {
          titulo: 'Qué dice la ley (vale para todas las prepagas)',
          cuerpo: 'Ley 26.682, artículo 9: podés rescindir en cualquier momento, sin penalidad, notificando de forma fehaciente con 30 días de anticipación. El decreto reglamentario agrega que solo se puede ejercer una vez por año y que la prepaga no puede condicionar tu baja a que canceles antes lo que debas. Si el formulario no te lleva a una respuesta, mandá una carta documento y reclamá ante la Superintendencia de Servicios de Salud.',
          enlaces: [{ texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' }],
        },
      ],
      conclusion: 'Premedic: formulario de solicitud de baja (titular, asociado activo, baja total o parcial) y después te contactan. Guardá la captura del envío, pedí confirmación escrita y coordiná la fecha con tu nueva cobertura.',
    },
    faq: [
      { q: '¿Cómo doy de baja Premedic?', a: 'Desde el formulario "Solicitud de baja" de Premedic, solo para asociados activos y hecho por el titular del plan. Después, Premedic se pone en contacto para continuar el trámite.' },
      { q: '¿Quién puede pedir la baja de Premedic?', a: 'El titular del plan, siempre que sea asociado activo.' },
      { q: '¿Se puede dar de baja solo a una persona del grupo?', a: 'Sí: el formulario permite elegir entre baja parcial y baja total.' },
      { q: '¿A qué teléfono llamo?', a: 'Premedic publica el 0810-222-5522, de lunes a viernes de 10 a 18, y el WhatsApp 15-2264-7285.' },
      { q: '¿Cuánto tarda la baja de Premedic?', a: 'La página no informa un plazo: dice que se contactarán lo más pronto posible. Pedí por escrito la fecha en que se hace efectiva.' },
      { q: '¿Pueden condicionar la baja a que pague una deuda?', a: 'No. El decreto reglamentario de la Ley 26.682 dice que la prepaga no puede supeditar tu baja a la cancelación previa de lo adeudado, aunque la deuda siga siendo exigible.' },
    ],
    keywords: ['como dar de baja premedic', 'dar de baja premedic', 'baja premedic', 'premedic solicitud de baja', 'dar de baja obra social premedic', 'como darme de baja de premedic', 'premedic baja online', 'premedic baja telefono', 'grupo premedic baja'],
    relacionadas: ['como-dar-de-baja-prepaga-u-obra-social', 'prepaga-no-me-da-la-baja', 'carta-documento-baja-prepaga-modelo', 'prepaga-sigue-cobrando-despues-de-la-baja', 'como-cambiar-de-prepaga'],
    prepagasRelacionadas: ['premedic'],
    fuentes: [
      { texto: 'Premedic — Solicitud de baja', url: 'https://web.grupopremedic.com.ar/solicitud-de-baja' },
      { texto: 'Ley 26.682, texto actualizado (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
      { texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' },
    ],
  },
  // PILAR DE BAJAS (17-oct-2026, pedido de Darío): reemplaza a
  // "baja-de-prepaga-proceso" (redirección 301 en next.config.ts). Análisis de
  // palabras clave en docs/seo/bajas-pilar-keywords-2026-10.md.
  {
    slug: 'como-dar-de-baja-prepaga-u-obra-social',
    titulo: 'Cómo dar de baja la prepaga o la obra social: guía completa 2026 (por prepaga y con la ley)',
    metaDescripcion: 'Cómo dar de baja tu prepaga u obra social: la ley (30 días de preaviso, sin multa), tabla con el trámite oficial de 13 prepagas, monotributo, jubilados y qué hacer si no te dan la baja.',
    tiempoLectura: 10,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-17',
    captarBaja: true,
    contenido: {
      intro: 'Dar de baja una prepaga es un derecho sin multa: la Ley 26.682 (art. 9) te permite rescindir en cualquier momento, notificando de forma fehaciente con 30 días de anticipación, y solo una vez por año. Lo pide el titular, por el botón de baja de la web de la prepaga o por escrito. Una obra social, en cambio, no se "da de baja": se cambia con la opción de cambio en Mi SSSalud, se deja al terminar el trabajo o se pierde al darte de baja del monotributo. Antes de pedir la baja, tené la nueva cobertura confirmada.',
      secciones: [
        {
          titulo: '¿Prepaga u obra social? La diferencia, en 30 segundos',
          cuerpo: 'La prepaga es un contrato privado: lo rescindís con un aviso. La obra social (Agente del Seguro de Salud) llega por tu trabajo en relación de dependencia o por el monotributo y se financia con aportes obligatorios: no hay una "baja" separada, sino que cambiás de agente con la opción de cambio, o dejás de aportar cuando termina la relación laboral o dejás el monotributo. Mucha gente busca "obra social prepaga" para referirse a lo mismo: si pagás una cuota a una empresa privada, el trámite es el de la prepaga (tabla de arriba).',
        },
        {
          titulo: 'Qué dice la ley: 30 días, sin multa, una vez por año',
          cuerpo: 'Ley 26.682, artículo 9: los usuarios pueden rescindir el contrato en cualquier momento, sin limitación y sin penalidad, notificando fehacientemente con treinta días de anticipación. El decreto reglamentario 1993/2011 agrega que solo se puede ejercer una vez por año y que la prepaga no puede condicionar tu baja a que cancelés antes lo que debas. La prepaga, en cambio, solo puede rescindir por falta de pago de tres cuotas consecutivas (con intimación de diez días hábiles) o por declaración jurada falseada. Desde 2019, además, las prepagas deben mostrar un botón de baja en su web (Res. SC 316/2018 y Disp. 472/2019); la Res. 271/2020 agrega que debe verse "a simple vista y en el primer acceso" y que, al usarlo, el proveedor no puede requerir al consumidor registración previa ni ningún otro trámite. Si contrataste a distancia podés rescindir por el mismo medio, con constancia fehaciente en 72 horas (Ley 24.240, art. 10 ter).',
          enlaces: [
            { texto: 'Ley 26.682 (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
            { texto: 'Decreto 1993/2011 (argentina.gob.ar)', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' },
          ],
        },
        {
          titulo: '¿Se puede dar de baja antes del año?',
          cuerpo: 'Prepaga: sí. No hay permanencia mínima: la ley permite rescindir en cualquier momento y solo limita a una vez por año el ejercicio de ese derecho. Obra social: no tan libre. Tras una opción de cambio, la SSSalud exige permanecer 12 meses en el agente elegido (Resolución 201/2024); la norma aclara que esa permanencia no rige para quien elige una prepaga registrada. Confirmá en la web de la Superintendencia si tu caso entra, porque las reglas del cambio se ajustaron varias veces desde 2023.',
          enlaces: [{ texto: 'Resolución 201/2024 de la SSSalud', url: 'https://www.argentina.gob.ar/normativa/nacional/norma-396980/texto' }],
        },
        {
          titulo: 'Cuándo rige la baja y cuánto hay que pagar',
          cuerpo: 'La ley habla de 30 días de preaviso, pero cada prepaga fija su fecha de efecto: en OSDE vale desde el día del trámite o una fecha futura (sin bajas retroactivas); en Swiss Medical, si la pedís hasta el día 5 rige desde el último día del mes anterior; en Avalian, si la pedís hasta el día 10 rige al último día del mes. Pedí siempre por escrito la fecha exacta, pagá hasta esa fecha y controlá que se corte el débito. Si te cobran de más, mirá la guía de cobros posteriores a la baja.',
        },
        {
          titulo: 'Obra social: relación de dependencia, monotributo y jubilados',
          cuerpo: 'Relación de dependencia: los aportes se descuentan del sueldo; para cambiar de agente el titular hace la opción de cambio online en Mi SSSalud (una vez al año, permanencia mínima de un año, rige el primer día del mes siguiente). Si terminás el trabajo, los aportes cesan y la obra social puede seguir cubriéndote un tiempo, según el tiempo trabajado: la guía "Sin trabajo, ¿qué pasa con la obra social?" lo explica. Monotributo: el aporte va dentro de la cuota; para dejarlo, cambiás con la opción de cambio, quitás adherentes desde Modificación de datos o te das de baja del monotributo (ver la guía específica). Jubilados y pensionados: el cambio se hace en ARCA o en la UDAI más cercana, una vez por año, y rige desde el primer día del tercer mes siguiente. ANSES no tramita bajas de obra social: CODEM solo sirve para consultar cuál tenés.',
          enlaces: [{ texto: 'SSSalud — Cambio de obra social para jubilados y pensionados', url: 'https://www.argentina.gob.ar/sssalud/usuarios/cambio-obra-sociales/jubilados-pensionados' }],
        },
        {
          titulo: 'Dar de baja a un familiar (baja parcial)',
          cuerpo: 'En una prepaga, la baja del titular implica la de todo el grupo (Swiss Medical, OSDE, Galeno y Hominis lo aclaran); para sacar solo a un integrante, el titular pide una baja parcial: Hominis y Premedic la ofrecen en su formulario (con el DNI de la persona) y Avalian advierte que algunas bajas parciales pueden implicar un nuevo contrato. Los integrantes que quieran seguir tras la baja del titular tienen 30 días para formar un nuevo grupo y conservar la antigüedad (Swiss Medical y Avalian). En el monotributo, los adherentes se quitan desde Modificación de datos.',
        },
        {
          titulo: 'Si no te dan la baja, te siguen cobrando o te dieron de baja a vos',
          cuerpo: 'Si la prepaga demora o rechaza el pedido: constancia, carta documento, reclamo ante la Superintendencia de Servicios de Salud y Defensa del Consumidor, y la Justicia si hace falta (guía "La prepaga no me da la baja" y "Modelo de carta documento"). Si te siguen cobrando: stop debit y reversión del débito dentro de los 30 días. Si debés cuotas: la baja no puede condicionarse al pago, pero la deuda sigue. Si te dieron de baja por falta de pago o por declaración jurada: la prepaga debe haberte intimado diez días hábiles o acreditar tu mala fe.',
        },
        {
          titulo: 'Antes de bajarte: no pierdas tu antigüedad',
          cuerpo: 'Si te das de baja y volvés más tarde, empezás de cero: se pierde la antigüedad y pueden aplicar carencias. La ley prohíbe el aumento por edad a los mayores de 65 con más de diez años de antigüedad, y los cambios de plan dentro de la misma prepaga no la interrumpen. Si el motivo es el precio, evaluá bajar de plan, la baja transitoria (Avalian la ofrece si te vas del país más de 90 días) o pasarte a otra prepaga sin dejar un hueco. Si todavía no resolviste tu nueva cobertura, podés gestionarla desde acá: dejás tus datos y un asesor oficial te contacta.',
          cta: { texto: 'Compará el precio oficial de otras prepagas antes de pedir la baja.', boton: 'Comparar prepagas', href: '/comparador' },
        },
        {
          titulo: 'Cómo verificamos esta guía',
          cuerpo: 'El 17 de octubre de 2026 leímos las páginas oficiales de baja de cada prepaga de la tabla, la Ley 26.682, el Decreto 1993/2011, la Ley 24.240, las páginas de ARCA y de la SSSalud y la normativa citada, y pusimos el enlace en cada guía. No enviamos ningún formulario: varios portales piden iniciar sesión y no pudimos ver los pasos de adentro. De Sancor Salud solo pudimos leer sus condiciones generales de ingreso (no su reglamento de servicios), y Accord Salud no publica el trámite en un formato legible. Esta guía es información general, no asesoramiento legal individual: ante un caso con deuda, tratamientos en curso o un reclamo ya iniciado, consultá a un abogado de consumo.',
        },
      ],
      conclusion: 'Para dar de baja una prepaga: titular, botón de baja o aviso fehaciente con 30 días, sin multa y sin que puedan condicionarla a una deuda. Para una obra social: opción de cambio, cese laboral o baja del monotributo. Guardá siempre la constancia, pedí la fecha de efecto por escrito y tené la nueva cobertura confirmada antes.',
    },
    pasos: [
      { nombre: 'Confirmá si lo tuyo es prepaga u obra social', texto: 'Si pagás una cuota a una empresa privada, es prepaga y se rescinde. Si la cobertura viene por tu trabajo o por el monotributo, es obra social y se cambia con la opción de cambio, el cese laboral o la baja del monotributo.' },
      { nombre: 'Verificá que sos el titular', texto: 'La baja la pide el titular del plan: la baja del titular implica la de todo el grupo familiar, salvo una baja parcial.' },
      { nombre: 'Elegí el canal oficial', texto: 'Usá el botón de baja o el formulario de tu prepaga (ver la tabla), o escribí por un medio fehaciente como la carta documento.' },
      { nombre: 'Pedí por escrito la fecha de efecto', texto: 'La ley fija un preaviso de 30 días; cada prepaga tiene su corte (por ejemplo, el día 5 en Swiss Medical y el día 10 en Avalian). Pagá hasta esa fecha.' },
      { nombre: 'Guardá la constancia', texto: 'Captura, número de gestión, mail enviado y respuesta, o copia de la carta documento con el acuse de recibo.' },
      { nombre: 'Controlá el débito y la factura siguientes', texto: 'Si te cobran de más, pedí el stop debit y la reversión dentro de los 30 días y reclamá por escrito.' },
      { nombre: 'Si no te la dan, escalá', texto: 'Carta documento, reclamo ante la Superintendencia de Servicios de Salud, reclamo en Defensa del Consumidor y, si hace falta, la Justicia.' },
    ],
    tabla: {
      titulo: 'Cómo se pide la baja en 13 prepagas (verificado el 17 de octubre de 2026)',
      columnas: ['Prepaga', 'Cómo se pide', 'Dato clave'],
      filas: [
        { celdas: ['Swiss Medical', 'El titular, de forma fehaciente (reglamento público)', 'Hasta el día 5: rige desde el último día del mes anterior; después, desde el último día del mes en curso'], slug: 'como-dar-de-baja-swiss-medical' },
        { celdas: ['OSDE', 'Web: Gestiones online > Mi afiliación > Solicitud de baja (con cuenta)', 'Vale desde el día del trámite o una fecha futura; no hay bajas retroactivas'], slug: 'como-dar-de-baja-osde' },
        { celdas: ['Sancor Salud', 'Formulario de baja en su web, sin iniciar sesión (documento del titular y N.º de asociado), o por escrito a su domicilio legal', 'No fija fecha de efecto en el texto publicado: pedila por escrito'], slug: 'como-dar-de-baja-sancor-salud' },
        { celdas: ['Galeno', '"Solicitud de Baja" en la web (con tu usuario) o en una sucursal', 'Titular y socio privado; alcanza a todo el grupo familiar'], slug: 'como-dar-de-baja-galeno' },
        { celdas: ['Medifé', 'Formulario de baja en el portal de asociados (Mi Cuenta)', 'Formulario de arrepentimiento para planes de hasta 10 días'], slug: 'como-dar-de-baja-medife' },
        { celdas: ['Omint', '"Botón de baja de servicios" (Autogestión)', 'Hay un botón de arrepentimiento aparte'], slug: 'como-dar-de-baja-omint' },
        { celdas: ['Medicus', 'Mail con asunto "Intención de baja", 0800-333-7624 o agencia', 'Botón de arrepentimiento: 10 días corridos'], slug: 'como-dar-de-baja-medicus' },
        { celdas: ['Prevención Salud', '"Solicitud de baja" en Autogestión de afiliados', 'Arrepentimiento para altas de hasta 10 días'], slug: 'como-dar-de-baja-prevencion-salud' },
        { celdas: ['Hominis', '"Solicitud de baja" en Mi Hominis', 'Titular del grupo; baja total o parcial (con DNI)'], slug: 'como-dar-de-baja-hominis' },
        { celdas: ['Hospital Italiano', 'Formulario de "¿Cómo cancelar mi afiliación?"', 'Según su página, se puede pedir en cualquier momento'], slug: 'como-dar-de-baja-hospital-italiano' },
        { celdas: ['Avalian', '"Botón de baja" (Autogestión) o por escrito', 'Rige al último día del mes si la pedís hasta el día 10; baja transitoria al 25%'], slug: 'como-dar-de-baja-avalian' },
        { celdas: ['CEMIC', 'Mail a consultasafiliados@cemic.edu.ar o atención en Av. Las Heras 2900', 'No publica formulario ni preaviso; fallecimiento: certificado de defunción por mail'], slug: 'como-dar-de-baja-cemic' },
        { celdas: ['Premedic', 'Formulario "Solicitud de baja" (titular, asociado activo)', 'Baja total o parcial; después te contactan'], slug: 'como-dar-de-baja-premedic' },
      ],
      nota: 'Fuente: la web oficial de cada prepaga, leída el 17 de octubre de 2026 sin enviar formularios. Los portales con inicio de sesión no permiten ver los pasos internos.',
    },
    faq: [
      { q: '¿Cómo doy de baja mi prepaga?', a: 'La pide el titular, por el botón o formulario de baja de la web de la prepaga o por escrito, notificando de forma fehaciente con 30 días de anticipación (Ley 26.682, art. 9). Cada prepaga tiene su canal y su fecha de corte: están en la tabla de esta guía.' },
      { q: '¿Cómo doy de baja mi obra social?', a: 'Una obra social no se da de baja: se cambia con la opción de cambio en Mi SSSalud (una vez al año), se deja al terminar la relación laboral o se pierde al darte de baja del monotributo. ANSES no tramita bajas de obra social; CODEM solo permite consultar cuál tenés.' },
      { q: '¿Se puede dar de baja la prepaga antes del año?', a: 'Sí. No hay permanencia mínima: la ley permite rescindir en cualquier momento, sin penalidad, y solo limita a una vez por año el ejercicio de ese derecho. La permanencia de 12 meses de la SSSalud se refiere a las obras sociales (Agentes del Seguro) tras una opción de cambio.' },
      { q: '¿Cuánto tarda en hacerse efectiva la baja?', a: 'Depende de la prepaga: la ley prevé 30 días de preaviso, pero OSDE la hace valer desde el día del trámite, Swiss Medical tiene un corte el día 5 y Avalian el día 10. Pedí la fecha por escrito.' },
      { q: '¿Puedo darme de baja si debo cuotas?', a: 'Sí: el decreto 1993/2011 dice que no puede supeditarse la rescisión del usuario a la previa cancelación de lo adeudado. La deuda sigue existiendo y la prepaga puede reclamarla.' },
      { q: '¿Quién puede pedir la baja?', a: 'Solo el titular del plan. La baja del titular incluye a todo el grupo familiar; para sacar solo a un integrante se pide una baja parcial.' },
      { q: '¿Puedo pedir la baja por WhatsApp o por mail?', a: 'Algunas prepagas aceptan mail o WhatsApp (por ejemplo Medicus por mail con asunto "Intención de baja"). Para tener una prueba indiscutible de la fecha, la forma más sólida es la carta documento.' },
      { q: '¿Qué hago si la prepaga no me da la baja?', a: 'Dejá constancia, mandá una carta documento y reclamá ante la Superintendencia de Servicios de Salud y Defensa del Consumidor (Ventanilla Federal Única). El COPREC ya no existe: fue disuelto por el Decreto 55/2025.' },
      { q: '¿Qué pasa con mi familia si me doy de baja?', a: 'La baja del titular implica la de todo el grupo. Los integrantes que quieran seguir tienen, en Swiss Medical y Avalian, 30 días para formar un nuevo grupo y conservar la antigüedad.' },
      { q: '¿Hasta cuándo tengo cobertura si pido la baja?', a: 'Hasta la fecha en que la baja se hace efectiva, según la prepaga. La única extensión que prevé el decreto es de dos meses de PMO para el grupo familiar tras el fallecimiento del titular (Avalian prevé tres).' },
    ],
    keywords: ['como dar de baja mi prepaga', 'dar de baja mi prepaga', 'dar de baja mi obra social', 'como dar de baja mi obra social', 'como dar de baja la prepaga', 'como darme de baja de la prepaga', 'baja de prepaga', 'baja de obra social', 'dar de baja prepaga antes del año', 'cuando puedo dar de baja la prepaga', 'puedo dar de baja mi prepaga', 'dar de baja mi obra social prepaga', 'boton de baja prepaga', 'baja de prepaga ley'],
    relacionadas: ['prepaga-no-me-da-la-baja', 'carta-documento-baja-prepaga-modelo', 'prepaga-sigue-cobrando-despues-de-la-baja', 'dar-de-baja-prepaga-con-deuda', 'prepaga-me-dio-de-baja-por-falta-de-pago', 'baja-prepaga-fallecimiento-titular', 'arrepentimiento-prepaga-10-dias', 'hasta-cuando-tengo-cobertura-despues-de-la-baja-prepaga', 'baja-obra-social-monotributo', 'opcion-de-cambio-obra-social', 'sin-trabajo-obra-social', 'que-obra-social-tengo-codem', 'como-cambiar-de-prepaga'],
    fuentes: [
      { texto: 'Ley 26.682, texto actualizado (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
      { texto: 'Decreto 1993/2011, texto actualizado (argentina.gob.ar)', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' },
      { texto: 'Ley 24.240 de Defensa del Consumidor (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/0-4999/638/texact.htm' },
      { texto: 'Resolución 201/2024 de la SSSalud (permanencia en el Agente del Seguro)', url: 'https://www.argentina.gob.ar/normativa/nacional/norma-396980/texto' },
      { texto: 'SSSalud — Opción de cambio para jubilados y pensionados', url: 'https://www.argentina.gob.ar/sssalud/usuarios/cambio-obra-sociales/jubilados-pensionados' },
      { texto: 'SSSalud — Opción de cambio para trabajadores bajo convenio', url: 'https://www.argentina.gob.ar/sssalud/usuarios/cambio-obra-sociales/sindicales' },
      { texto: 'SSSalud — Consultas y reclamos', url: 'https://www.argentina.gob.ar/sssalud/consultas-la-superintendencia-de-servicios-de-salud' },
      { texto: 'Defensa del Consumidor — Iniciar un reclamo', url: 'https://www.argentina.gob.ar/servicio/iniciar-un-reclamo-ante-defensa-del-consumidor' },
    ],
  },
  // 17-oct-2026, Bloque B (Swiss): carencias, preexistencias y declaración
  // jurada. Fuente: Reglamento General de Contratación de Swiss Medical
  // (cláusulas 1.4, 1.5, 12.1 y 12.3) cruzado con la Ley 26.682 (art. 10) y el
  // Decreto 1993/2011 (art. 9).
  {
    slug: 'swiss-medical-carencias-preexistencias-declaracion-jurada',
    titulo: 'Swiss Medical: carencias, preexistencias y declaración jurada (qué dice su reglamento y qué dice la ley)',
    metaDescripcion: 'Qué dice el reglamento de Swiss Medical sobre carencias, preexistencias y declaración jurada, y qué establece la Ley 26.682: sin carencia en el PMO, preexistencias solo por declaración jurada y baja solo con mala fe acreditada.',
    tiempoLectura: 7,
    categoria: 'Coberturas',
    fechaActualizacion: '2026-10-17',
    contenido: {
      intro: 'Según el Reglamento General de Contratación de Swiss Medical, la carencia es el lapso entre el ingreso al plan y el momento en que empiezan a regir los beneficios, con plazos que fija el anexo de cada plan; durante ese lapso podés usar cualquier servicio pagando aranceles o, en las prestaciones obligatorias, los prestadores exclusivos del PMO. La Ley 26.682 (art. 10) agrega que los contratos no pueden incluir carencias para las prestaciones del PMO y que las preexistencias solo pueden surgir de la declaración jurada del usuario y no pueden ser motivo de rechazo del ingreso.',
      secciones: [
        {
          titulo: 'Qué es la carencia según Swiss Medical',
          cuerpo: 'El reglamento la define como el lapso entre el ingreso del asociado al plan y el momento en que empiezan a regir los beneficios, detallados en el anexo de condiciones de cada plan (cláusula 12.1). Durante ese período se puede usar cualquier servicio abonando los aranceles, o en prestaciones obligatorias, los prestadores exclusivos para la atención del PMO. Los plazos concretos (por ejemplo para partos, cirugías o tratamientos no incluidos en el PMO) no figuran en el reglamento general: están en el anexo del plan, que conviene pedir por escrito antes de contratar.',
          enlaces: [{ texto: 'Swiss Medical — Reglamento General de Contratación (PDF)', url: 'https://www.swissmedical.com.ar/smgnewsite/pdf/prepaga/formularios/reglamento_swissmedical.pdf' }],
        },
        {
          titulo: 'Qué dice la ley sobre las carencias',
          cuerpo: 'Ley 26.682, artículo 10: los contratos "no pueden incluir períodos de carencia o espera para todas aquellas prestaciones que se encuentran incluidas en el Programa Médico Obligatorio". Para otras modalidades, los períodos de carencia deben estar explicitados en el contrato y aprobados por la Autoridad de Aplicación. En la práctica: lo que está en el PMO no puede quedar sujeto a espera; lo que cubre un plan por encima del PMO sí puede tener carencia si figura en el contrato aprobado.',
          enlaces: [{ texto: 'Ley 26.682, texto actualizado (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' }],
        },
        {
          titulo: 'Preexistencias: qué pide Swiss y qué permite la ley',
          cuerpo: 'Swiss Medical exige completar la solicitud de ingreso y una declaración jurada sobre enfermedades preexistentes, patologías secuelares, cirugías y tratamientos, indicando los profesionales consultados en los últimos 12 meses (cláusula 1.4.1). Según el reglamento, las preexistencias informadas no tienen cobertura salvo que Swiss las acepte expresamente en las condiciones que fije (cláusula 12.3.3). La ley, por su parte, dice que las preexistencias solo pueden establecerse a partir de la declaración jurada, que no pueden ser criterio de rechazo de admisión y que la Autoridad de Aplicación puede autorizar valores diferenciales justificados. Si tenés una preexistencia, pedí por escrito, antes de firmar, qué se excluye y si hay una cuota diferencial.',
        },
        {
          titulo: 'Declaración jurada: sé exacto y completo',
          cuerpo: 'El reglamento considera la veracidad de la declaración jurada una condición esencial y dice que cualquier inexactitud habilita a Swiss a resolver el contrato (cláusulas 1.4.2 y 12.3.5); también prevé una Junta Médica de tres profesionales para determinar una preexistencia no declarada (cláusula 12.3.6). Pero el decreto reglamentario de la ley es más exigente con la prepaga: para resolver por declaración jurada falsa debe acreditar que el usuario no obró de buena fe, y la falta de acreditación de mala fe determina la ilegitimidad de la resolución. Por eso conviene declarar todo, aunque te parezca irrelevante, y guardar una copia de lo que firmaste.',
          enlaces: [{ texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' }],
        },
        {
          titulo: 'Si te piden revisar tu historia clínica',
          cuerpo: 'Al firmar la declaración jurada autorizás a Swiss a pedir información a los médicos que te trataron y relevás el secreto profesional respecto de ellos (cláusula 1.4.3). Si te convocan a una Junta Médica, el reglamento te permite concurrir con un profesional de tu elección, a tu cargo, y los estudios que la Junta ordene corren por cuenta de Swiss (cláusula 12.3.6). No respondas con apuro: pedí todo por escrito y, si hay riesgo de perder la cobertura, consultá a un abogado de consumo.',
        },
        {
          titulo: 'Arrepentirte después de contratar',
          cuerpo: 'Una vez perfeccionado el contrato, el reglamento de Swiss reconoce el derecho a revocarlo dentro de los 10 días conforme el artículo 34 de la Ley 24.240 (cláusula 1.5.2). Si ya pasó ese plazo, rige la baja común con 30 días de preaviso. Si querés comparar con otras prepagas antes de decidir, podés hacerlo sin costo.',
          cta: { texto: 'Compará el precio oficial de Swiss Medical con otras prepagas y consultá por tus preexistencias antes de contratar.', boton: 'Comparar prepagas', href: '/comparador' },
        },
      ],
      conclusion: 'En Swiss Medical, los plazos de carencia están en el anexo de cada plan y, por ley, no pueden aplicarse a las prestaciones del PMO. Las preexistencias salen de tu declaración jurada: declará todo, pedí por escrito qué queda excluido y recordá que, para darte de baja por declaración jurada, la prepaga debe acreditar tu mala fe.',
    },
    faq: [
      { q: '¿Qué es la carencia en Swiss Medical?', a: 'Según su reglamento, es el lapso entre el ingreso al plan y el momento en que empiezan a regir los beneficios, con plazos que fija el anexo de cada plan. Durante ese lapso se puede usar cualquier servicio pagando aranceles, o las prestaciones del PMO con los prestadores exclusivos.' },
      { q: '¿Las prestaciones del PMO pueden tener carencia?', a: 'No. La Ley 26.682 (art. 10) dice que los contratos no pueden incluir períodos de carencia o espera para las prestaciones incluidas en el PMO. Para otras modalidades, la carencia debe estar explicitada en el contrato y aprobada por la Autoridad de Aplicación.' },
      { q: '¿Dónde veo los plazos de carencia de mi plan de Swiss Medical?', a: 'En el anexo de condiciones particulares de tu plan, que complementa el Reglamento General de Contratación. Pedilo por escrito antes de contratar.' },
      { q: '¿Swiss Medical puede rechazar mi ingreso por una preexistencia?', a: 'La Ley 26.682 establece que las preexistencias no pueden ser criterio de rechazo de admisión y solo pueden surgir de la declaración jurada; la Autoridad de Aplicación puede autorizar valores diferenciales justificados.' },
      { q: '¿Qué pasa si no declaro una enfermedad?', a: 'El reglamento de Swiss prevé resolver el contrato y convocar una Junta Médica. Según el decreto 1993/2011, la prepaga debe acreditar que no obraste de buena fe; si no lo acredita, la resolución es ilegítima.' },
      { q: '¿Puedo arrepentirme de contratar Swiss Medical?', a: 'Sí: el reglamento reconoce la revocación dentro de los 10 días, conforme el artículo 34 de la Ley 24.240.' },
    ],
    keywords: ['swiss medical carencias', 'carencia swiss medical', 'swiss medical preexistencias', 'swiss medical declaracion jurada', 'swiss medical enfermedades preexistentes', 'swiss medical periodo de carencia parto', 'swiss medical carencia cirugia', 'swiss medical reglamento', 'swiss medical junta medica'],
    relacionadas: ['prepaga-sin-periodo-carencia', 'prepaga-me-dio-de-baja-por-falta-de-pago', 'arrepentimiento-prepaga-10-dias', 'como-dar-de-baja-swiss-medical', 'reintegros-en-prepagas', 'que-cubre-la-prepaga', 'swiss-medical-mora-suspension-baja-por-falta-de-pago'],
    prepagasRelacionadas: ['swiss-medical'],
    fuentes: [
      { texto: 'Swiss Medical — Reglamento General de Contratación (PDF)', url: 'https://www.swissmedical.com.ar/smgnewsite/pdf/prepaga/formularios/reglamento_swissmedical.pdf' },
      { texto: 'Ley 26.682, texto actualizado (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
      { texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' },
    ],
  },
  // 18-oct-2026: Swiss Medical, mora y baja por falta de pago. Reglamento de
  // Swiss (cláusulas 2.1, 2.2, 5.1 y 6) contrastado con el Decreto 1993/2011
  // (art. 9, punto 2.a). Se informa lo que dice cada texto; no se afirma cuál
  // prevalece en un caso concreto.
  {
    slug: 'swiss-medical-mora-suspension-baja-por-falta-de-pago',
    titulo: 'Swiss Medical: mora, suspensión de servicios y baja por falta de pago (reglamento y ley)',
    metaDescripcion: 'Qué dice el reglamento de Swiss Medical sobre mora, intereses, suspensión y baja por falta de pago (3 cuotas), y qué exige el decreto 1993/2011: intimación de 10 días hábiles. Cómo regularizar y reclamar.',
    tiempoLectura: 6,
    categoria: 'Trámites',
    fechaActualizacion: '2026-10-18',
    captarBaja: true,
    contenido: {
      intro: 'El reglamento de Swiss Medical define la mora como la falta de pago de la cuota del mes en curso desde el "Primer Vencimiento", y prevé que tres cuotas impagas (consecutivas o alternadas) son causal de resolución del contrato "en forma automática y sin necesidad de interpelación". El decreto 1993/2011, que reglamenta la Ley 26.682, exige en cambio tres cuotas íntegras y consecutivas, la notificación inmediata de la mora y una intimación para regularizar en diez días hábiles antes de resolver. Si te dieron de baja o te suspendieron, conviene pedir por escrito el detalle y reclamar si no se cumplió ese procedimiento.',
      secciones: [
        {
          titulo: 'Qué dice el reglamento de Swiss sobre la mora',
          cuerpo: 'La cuota se paga por mes adelantado y se considera por mes calendario, sin proporcionarse por la fecha de alta o baja (cláusula 2.1). La mora comienza cuando no pagás la cuota del mes en curso al "Primer Vencimiento" del aviso; desde ahí Swiss puede aplicar un interés compensatorio y punitorio de una vez y media la tasa activa a 30 días del Banco de la Nación, más gastos administrativos o de rehabilitación (cláusula 2.2).',
          enlaces: [{ texto: 'Swiss Medical — Reglamento General de Contratación (PDF)', url: 'https://www.swissmedical.com.ar/smgnewsite/pdf/prepaga/formularios/reglamento_swissmedical.pdf' }],
        },
        {
          titulo: 'Suspensión de servicios',
          cuerpo: 'Según el reglamento, hasta el último día del primer mes impago se exige pagar la cuota vencida (con intereses y gastos) antes de cualquier prestación; si regularizás, la prestación se brinda sin cargo en los rubros que correspondan, y si no, las prestaciones se facturan a valores de paciente particular, sin derecho a reintegro posterior (cláusula 2.2.1). Swiss puede suspender los servicios al grupo familiar sin notificación previa: de inmediato para las prácticas que requieren autorización y, para las que no, al cumplirse el primer mes de mora (cláusula 5.1.1). La suspensión no genera indemnizaciones ni reintegros (cláusula 5.1.2).',
        },
        {
          titulo: 'Baja por tres cuotas: reglamento vs decreto',
          cuerpo: 'Reglamento de Swiss (cláusula 2.2.2): la falta de pago de tres cuotas consecutivas o alternadas es causal de resolución automática, sin interpelación, y la baja no extingue las deudas. Decreto 1993/2011 (art. 9, punto 2.a): la prepaga solo puede resolver por falta de pago de tres cuotas íntegras y consecutivas, debe notificar de inmediato la constitución en mora e intimar a regularizar el pago íntegro en diez días hábiles. Son textos distintos. Si te dieron de baja sin esa intimación, o por cuotas alternadas, pedí por escrito los avisos de mora y reclamá ante la Superintendencia; la jerarquía entre un reglamento y un decreto reglamentario es una cuestión que, en un caso concreto, conviene plantear con un abogado de consumo.',
          enlaces: [{ texto: 'Decreto 1993/2011, texto actualizado', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' }],
        },
        {
          titulo: 'Cómo regularizar y volver a usar la cobertura',
          cuerpo: 'Si regularizás una mora, el reglamento pide presentar, junto con la credencial y el documento, el recibo de la cancelación de la deuda para demandar servicios durante los primeros 30 días posteriores (cláusula 2.2.3). Pagá con los intereses que te liquiden, guardá el comprobante y pedí por escrito que te confirmen la rehabilitación. Si te resolvieron el contrato, pedí por escrito la reincorporación: el reglamento no la regula en detalle, así que conviene dejar constancia de la fecha en que pagaste y de la respuesta.',
        },
        {
          titulo: 'Si te dieron de baja y necesitás cobertura ya',
          cuerpo: 'Si la baja por mora ya se produjo y no vas a poder revertirla rápido, conviene conseguir una nueva cobertura cuanto antes: en una nueva prepaga vas a completar la declaración jurada y es posible que apliquen carencias para lo que exceda el PMO. Si todavía no resolviste tu nueva cobertura, podés gestionarla desde acá: dejás tus datos y un asesor oficial te contacta.',
          cta: { texto: 'Compará el precio oficial de otras prepagas.', boton: 'Comparar prepagas', href: '/comparador' },
        },
      ],
      conclusion: 'Swiss Medical define la mora desde el primer vencimiento, puede suspender los servicios y prevé la baja por tres cuotas impagas; el decreto 1993/2011 exige tres cuotas consecutivas y una intimación de diez días hábiles. Pedí por escrito los avisos, regularizá con comprobante y reclamá si no se cumplió el procedimiento.',
    },
    faq: [
      { q: '¿Cuándo entro en mora en Swiss Medical?', a: 'Cuando no pagás la cuota del mes en curso en la fecha del "Primer Vencimiento" del aviso. Desde ahí pueden aplicarse intereses y gastos administrativos (reglamento, cláusula 2.2).' },
      { q: '¿Pueden suspenderme los servicios por mora?', a: 'El reglamento lo prevé, sin notificación previa: de inmediato para las prácticas que requieren autorización y al cumplirse el primer mes de mora para las demás (cláusula 5.1.1).' },
      { q: '¿Cuántas cuotas impagas dan lugar a la baja?', a: 'El reglamento de Swiss habla de tres cuotas consecutivas o alternadas. El decreto 1993/2011 exige tres cuotas íntegras y consecutivas, con notificación de la mora y una intimación de diez días hábiles.' },
      { q: '¿Tengo que pagar los intereses para volver a usar la cobertura?', a: 'Según el reglamento, para regularizar se paga la cuota vencida con intereses, gastos administrativos y de rehabilitación, y se presenta el recibo de cancelación en los primeros 30 días.' },
      { q: '¿Qué hago si me dieron de baja sin avisarme?', a: 'Pedí por escrito el motivo y los avisos de mora, y reclamá ante la Superintendencia de Servicios de Salud y Defensa del Consumidor. Si necesitás cobertura urgente, consultá a un abogado de consumo.' },
      { q: '¿La baja por falta de pago borra la deuda?', a: 'No: según el reglamento la baja no extingue las deudas con Swiss ni con otros prestadores, y se reserva el derecho a reclamarlas.' },
    ],
    keywords: ['swiss medical mora', 'swiss medical baja por falta de pago', 'swiss medical suspension de servicios', 'swiss medical no pagué la cuota', 'swiss medical deuda', 'swiss medical tres cuotas', 'swiss medical rehabilitacion', 'swiss medical me dieron de baja'],
    relacionadas: ['prepaga-me-dio-de-baja-por-falta-de-pago', 'dar-de-baja-prepaga-con-deuda', 'como-dar-de-baja-swiss-medical', 'prepaga-no-me-da-la-baja', 'swiss-medical-carencias-preexistencias-declaracion-jurada', 'como-reclamar-a-una-prepaga'],
    prepagasRelacionadas: ['swiss-medical'],
    fuentes: [
      { texto: 'Swiss Medical — Reglamento General de Contratación (PDF)', url: 'https://www.swissmedical.com.ar/smgnewsite/pdf/prepaga/formularios/reglamento_swissmedical.pdf' },
      { texto: 'Decreto 1993/2011, texto actualizado (argentina.gob.ar)', url: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1993-2011-190606/actualizacion' },
      { texto: 'Ley 26.682, texto actualizado (Infoleg)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
    ],
  },
]
guias.push(...guiasPreguntas)

export function getGuiaBySlug(slug: string): GuiaData | undefined {
  return guias.find((g) => g.slug === slug)
}
