import Link from 'next/link'
import { PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { formatPrecio } from '@/lib/utils'
import { codigoCorto } from '@/lib/seo/titulos'
import type { Prepaga } from '@/types'

// "Los planes de [prepaga] por línea" (19-oct-2026). "[prepaga] planes" es la
// búsqueda transaccional de cada marca y la ficha la perdía en la cabeza
// ("osde planes" 6.600/mes en pos. 26,5; "swiss medical planes" 6.600 en 19,5;
// "sancor salud planes" 2.900 sin aparecer; Search Console 8-22 sep), mientras
// la respuesta de IA de Google cita a miobrasocial con los mismos precios SSSalud
// agrupados por línea. La ficha mostraba tarjetas sueltas: este resumen en
// texto + tabla es lo que Google y las IA pueden citar. Precios, copago y red
// salen de lib/data/prepagas.ts; el texto de cada línea, de las descripciones
// de esos mismos planes. Sin montos escritos a mano.

interface Linea {
  nombre: string
  /** Cómo se nombra la línea dentro del párrafo de resumen */
  enTexto: string
  planes: string[]
  distingue: string
}

/** Fila sin precio de lista (ej. planes corporativos), al final de la tabla */
interface FilaExtra {
  nombre: string
  plan: string
  href: string
  distingue: string
  masHref?: string
  masTexto?: string
  /** Oración que cierra el párrafo de resumen */
  enResumen: string
}

interface ConfigLineas {
  lineas: Linea[]
  extra?: FilaExtra
  /** Cómo se nombra cada plan cuando el nombre repite la línea ("Plan Integral AS200" → "AS200") */
  codigo?: RegExp
}

const LINEAS: Record<string, ConfigLineas> = {
  'swiss-medical': {
    lineas: [
      { nombre: 'Con copago (económica)', enTexto: 'con copago', planes: ['s1', 's2'], distingue: 'Menor cuota a cambio de copagos en consultas y estudios. El S2 suma el Hospital Italiano y la Fundación Favaloro.' },
      { nombre: 'Entrada sin copago', enTexto: 'de entrada sin copago', planes: ['smg02'], distingue: 'La forma más barata de tener consultas sin copago, con cobertura en CABA y GBA.' },
      { nombre: 'Nivel medio', enTexto: 'de nivel medio', planes: ['smg20'], distingue: 'El más elegido: sistema cerrado, sin copago en consultas, estudios, kinesiología y fonoaudiología, y 30 sesiones de psicología por año.' },
      { nombre: 'Superiores', enTexto: 'superiores', planes: ['smg30', 'smg40', 'smg50'], distingue: 'Red abierta con reintegros fuera de cartilla. El SMG50 suma una cirugía estética por año e implantes dentales por reintegro.' },
      { nombre: 'Alta gama', enTexto: 'de alta gama', planes: ['smg60', 'smg70'], distingue: 'Habitación individual, chequeo médico ejecutivo anual y Swiss Medical Internacional para todo el grupo familiar.' },
      { nombre: 'Sport', enTexto: 'Sport', planes: ['sport-s', 'sport', 'sport-plus'], distingue: 'Reintegro por gimnasio y actividad física, nutrición y traumatología. El Sport incluye estudio biomecánico de la marcha y el Sport+, un test genético.' },
    ],
    extra: {
      nombre: 'Corporativa',
      plan: 'Black',
      href: '/empresas/swiss-medical/plan-black',
      distingue: 'Solo para empresas: ejecutivo de cuenta, cobertura internacional y red Blue Cross & Blue Shield en EE. UU.',
      masHref: '/empresas/swiss-medical',
      masTexto: 'Planes corporativos',
      enResumen: 'Para empresas existe además la línea corporativa, con el Plan Black.',
    },
  },
  // OSDE: un plan por escalón. Flux no está en el cuadro de la SSSalud (se cotiza).
  osde: {
    lineas: [
      { nombre: 'Plan joven', enTexto: 'plan joven', planes: ['flux'], distingue: 'Pensado para 18 a 35 años: consultas sin copago, psicología sin tope de sesiones, ortodoncia, lentes y reintegros sin tope por factura.' },
      { nombre: 'Entrada', enTexto: 'de entrada', planes: ['210'], distingue: 'El más accesible de OSDE, con acceso a la red completa de prestadores.' },
      { nombre: 'Intermedio', enTexto: 'intermedio', planes: ['310'], distingue: 'Sin copago en consultas y estudios, visita médica domiciliaria, consulta online y Hospital Alemán. Ortodoncia hasta 18 años.' },
      { nombre: 'Superior', enTexto: 'superior', planes: ['410'], distingue: 'Habitación individual, ortodoncia sin límite de edad, implantes dentales y cirugía estética cada 3 años.' },
      { nombre: 'Premium', enTexto: 'premium', planes: ['510'], distingue: 'Internación en suite, cirugía estética anual y companion hospitalario ilimitado.' },
    ],
  },
  // Sancor Salud: las líneas son las de la propia marca (FAM, Digital Flex,
  // Clásica, Exclusive, GEN), tal como figuran en las descripciones de cada plan.
  'sancor-salud': {
    lineas: [
      { nombre: 'Línea FAM', enTexto: 'FAM', planes: ['f700', 'f800'], distingue: 'La de menor cuota, con copago: telemedicina 24-7 y atención en la red regional de prestadores. El F800 suma ortodoncia.' },
      { nombre: 'Línea Digital Flex', enTexto: 'Digital Flex', planes: ['f800-digital-flex', 'plan-1000-digital-flex'], distingue: 'Sin copago y enfocada en el acceso digital: telemedicina 24-7 y atención directa en guardias. El 1000 Digital Flex suma ortodoncia hasta los 35 y asistencia al viajero internacional.' },
      { nombre: 'Línea Clásica', enTexto: 'Clásica', planes: ['plan-1000-cc', 'plan-1000', 'plan-1500-cc', 'plan-1500', 'plan-3000', 'plan-3500', 'plan-4000'], distingue: 'La línea tradicional. El 1000 y el 1500 vienen sin coseguro o con coseguro y cuota menor; desde el 1500, habitación individual; desde el 3000, red abierta con reintegros.' },
      { nombre: 'Línea Exclusive', enTexto: 'Exclusive', planes: ['plan-4500', 'plan-5000', 'plan-6000'], distingue: 'Cobertura nacional sin coseguros, habitación individual, cirugía estética y asistencia en viaje internacional. El 5000 suma habitación VIP; el 6000, ortodoncia sin límite de edad.' },
      { nombre: 'Línea GEN', enTexto: 'GEN', planes: ['plan-1000-gen', 'plan-1500-gen', 'plan-3000-gen', 'plan-3500-gen', 'plan-4000-gen', 'plan-4500-gen'], distingue: 'Para personas de 18 a 45 años: los planes de la línea Clásica con ortodoncia hasta los 45, psicoterapia sin coseguro y chequeo preventivo.' },
    ],
  },
  // Avalian: las líneas son las de su web (Cerca, Integral, Hoy, Superior, Selecta)
  avalian: {
    codigo: /AS\d+H?/,
    lineas: [
      { nombre: 'Cerca', enTexto: 'Cerca', planes: ['as100'], distingue: 'Plan de entrada: cartilla seleccionada por cercanía y servicios digitales (credencial digital, e-doc y app). Consultas con copago.' },
      { nombre: 'Integral', enTexto: 'Integral', planes: ['as204', 'as200'], distingue: 'Cobertura nacional con copago en consultas, 40% de descuento en farmacias y asistencia al viajero en Argentina y países limítrofes. El AS204 interna en habitación compartida; el AS200, en individual.' },
      { nombre: 'Hoy (18 a 35 años)', enTexto: 'Hoy', planes: ['as200h'], distingue: 'La cobertura del Integral AS200 con los copagos de consultas bonificados los primeros 12 meses, por única vez.' },
      { nombre: 'Superior', enTexto: 'Superior', planes: ['as300'], distingue: 'Consultas, consultas a domicilio y odontología sin copago, internación en habitación individual y asistencia al viajero internacional.' },
      { nombre: 'Selecta', enTexto: 'Selecta', planes: ['as400', 'as500'], distingue: 'Red abierta con reintegros, sin copagos, cirugías estéticas y asistencia al viajero internacional. 50% de descuento en farmacias en el AS400 y 75% en el AS500.' },
    ],
  },
  // Medifé y Premedic: un plan por escalón
  medife: {
    lineas: [
      { nombre: 'Con copago', enTexto: 'con copago', planes: ['medife-plus'], distingue: 'Centro asistencial zonal, Sanatorio Finochietto y telemedicina (Cam Doctor).' },
      { nombre: 'Entrada', enTexto: 'de entrada', planes: ['bronce'], distingue: 'Red nacional extensa y cobertura internacional en países limítrofes (Brasil incluido).' },
      { nombre: 'Intermedio', enTexto: 'intermedio', planes: ['plata'], distingue: 'Sin copago, atención fuera de cartilla con reintegros, habitación individual en internación y prótesis dental.' },
      { nombre: 'Superior', enTexto: 'superior', planes: ['oro'], distingue: 'Implantes dentales, ortodoncia hasta 18 años, cirugía estética desde los 2 años de antigüedad y reintegros más altos.' },
      { nombre: 'Premium', enTexto: 'el más completo', planes: ['platinum'], distingue: 'Ortodoncia sin límite de edad, cirugía estética desde el primer año y cobertura internacional en Europa (Tratado Schengen).' },
    ],
  },
  premedic: {
    lineas: [
      { nombre: 'Esencial', enTexto: 'esencial', planes: ['plan-c100'], distingue: 'El de menor cuota: consultas, estudios de rutina, habitación compartida, red odontológica propia y médico por videollamada.' },
      { nombre: 'Básico', enTexto: 'básico', planes: ['plan-200'], distingue: 'Más especialidades y estudios que el C-100, centros médicos propios y médico a domicilio sin cargo.' },
      { nombre: 'Intermedio', enTexto: 'intermedio', planes: ['plan-300'], distingue: 'Más prácticas cubiertas y atención en centros de primer nivel, con centros médicos propios y médico a domicilio sin cargo.' },
      { nombre: 'Alto', enTexto: 'alto', planes: ['plan-400'], distingue: 'Internación en habitación individual en clínicas de alta calidad, más estudios y tratamientos y descuentos en implantes y ortodoncia.' },
      { nombre: 'Completo', enTexto: 'el más completo', planes: ['plan-500'], distingue: 'Acceso preferencial a los sanatorios más prestigiosos, habitación individual y la cobertura y los reintegros más altos.' },
    ],
  },
}

const lista = (xs: string[]) => xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}` : xs.join('')

function lineasDe(prep: Prepaga) {
  const cfg = LINEAS[prep.slug]
  if (!cfg) return null
  const lineas = cfg.lineas.map((l) => {
    const planes = l.planes
      .map((s) => prep.planes.find((pl) => pl.slug === s))
      .filter((pl): pl is Prepaga['planes'][number] => Boolean(pl))
    const desde = Math.min(...planes.map((pl) => pl.precio))
    const copago = planes.every((pl) => pl.copago) ? 'Sí' : planes.some((pl) => pl.copago) ? 'Según plan' : 'No'
    const red = planes.every((pl) => pl.redAbierta) ? 'Abierta' : planes.some((pl) => pl.redAbierta) ? 'Según plan' : 'Cerrada'
    return { ...l, planes, desde, copago, red }
  }).filter((l) => l.planes.length > 0)
  const codigo = (nombre: string) => (cfg.codigo && nombre.match(cfg.codigo)?.[0]) || codigoCorto(nombre)
  return lineas.length > 0 ? { lineas, extra: cfg.extra, codigo } : null
}

type Lineas = NonNullable<ReturnType<typeof lineasDe>>

function resumen(prep: Prepaga, { lineas, extra, codigo }: Lineas) {
  // Las líneas de un solo plan se nombran por el plan; las demás, por línea
  const unPlanPorLinea = lineas.every((l) => l.planes.length === 1)
  const tramo = (l: Lineas['lineas'][number]) => {
    const precio = Number.isFinite(l.desde) ? `${unPlanPorLinea ? '' : 'desde '}${formatPrecio(l.desde)}` : 'a cotizar'
    return unPlanPorLinea
      ? `${codigo(l.planes[0].nombre)} (${l.enTexto}, ${precio})`
      : `${l.enTexto} (${lista(l.planes.map((pl) => codigo(pl.nombre)))}, ${precio})`
  }
  const cuantos = unPlanPorLinea
    ? `${prep.nombre} tiene ${prep.planes.length} planes para particulares en ${PRECIO_ACTUALIZADO.toLowerCase()}: ${lista(lineas.map(tramo))}.`
    : `${prep.nombre} tiene ${prep.planes.length} planes para particulares en ${PRECIO_ACTUALIZADO.toLowerCase()}, divididos en ${lineas.length} líneas: ${lista(lineas.map(tramo))}.`
  return `${cuantos} Son precios de lista por mes para una persona de 30 años según el cuadro oficial de la SSSalud.${extra ? ` ${extra.enResumen}` : ''}`
}

/** Respuesta para las preguntas frecuentes de la ficha */
export function faqLineasPlanes(prep: Prepaga): { q: string; a: string } | null {
  const ls = lineasDe(prep)
  if (!ls) return null
  return { q: `¿Cómo se dividen los planes de ${prep.nombre}?`, a: resumen(prep, ls) }
}

export function LineasPlanes({ prep }: { prep: Prepaga }) {
  const ls = lineasDe(prep)
  if (!ls) return null
  const { lineas, extra, codigo } = ls
  return (
    <div className="mb-6">
      <h3 className="text-base font-bold text-gray-900 mb-2">Los planes de {prep.nombre} por línea</h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-4 max-w-3xl">{resumen(prep, ls)}</p>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        {/* En el celular la tabla se desliza de costado: "Desde" va 2.ª para que
            el precio se vea sin deslizar, y la última columna es más ancha para
            que las filas no midan 300 px de alto (acción 6, 24-oct-2026). */}
        <table className="w-full min-w-[48rem] text-sm text-left">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <tr>
              <th scope="col" className="px-3 py-2 font-semibold">Línea</th>
              <th scope="col" className="px-3 py-2 font-semibold whitespace-nowrap">Desde (30 años)</th>
              <th scope="col" className="px-3 py-2 font-semibold">Planes</th>
              <th scope="col" className="px-3 py-2 font-semibold">Copago</th>
              <th scope="col" className="px-3 py-2 font-semibold">Red</th>
              <th scope="col" className="px-3 py-2 font-semibold min-w-[16rem]">Qué la distingue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {lineas.map((l) => (
              <tr key={l.nombre} className="align-top">
                <th scope="row" className="px-3 py-2.5 font-semibold text-gray-900">{l.nombre}</th>
                <td className="px-3 py-2.5 font-semibold text-gray-900 tabular-nums whitespace-nowrap">{formatPrecio(l.desde)}</td>
                <td className="px-3 py-2.5">
                  {l.planes.map((pl, i) => (
                    <span key={pl.slug} className="whitespace-nowrap">
                      {i > 0 && ', '}
                      <Link href={`/prepagas/${prep.slug}/${pl.slug}`} className="font-semibold text-gray-900 hover:text-[#E8002D] hover:underline">{codigo(pl.nombre)}</Link>
                    </span>
                  ))}
                </td>
                <td className="px-3 py-2.5 text-gray-600">{l.copago}</td>
                <td className="px-3 py-2.5 text-gray-600">{l.red}</td>
                <td className="px-3 py-2.5 text-gray-600">{l.distingue}</td>
              </tr>
            ))}
            {extra && (
              <tr className="align-top">
                <th scope="row" className="px-3 py-2.5 font-semibold text-gray-900">{extra.nombre}</th>
                <td className="px-3 py-2.5 text-gray-600">A cotizar</td>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <Link href={extra.href} className="font-semibold text-gray-900 hover:text-[#E8002D] hover:underline">{extra.plan}</Link>
                </td>
                <td className="px-3 py-2.5 text-gray-600">—</td>
                <td className="px-3 py-2.5 text-gray-600">—</td>
                <td className="px-3 py-2.5 text-gray-600">
                  {extra.distingue}
                  {extra.masHref && <>{' '}<Link href={extra.masHref} className="text-[#E8002D] hover:underline">{extra.masTexto} →</Link></>}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
