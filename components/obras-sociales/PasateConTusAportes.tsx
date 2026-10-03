import Link from 'next/link'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'
import { calcularSueldos, millonesLargo, MES } from '@/lib/prensa/sueldo-prepaga'
import { preciosParaGrupo } from '@/lib/precios/motor'
import { APORTE_DERIVABLE, TIEMPO_RESPUESTA, formatPrecio } from '@/lib/utils'
import { prepagas } from '@/lib/data/prepagas'
import { COSEGUROS_OS, SWISS_COPAGOS_VIGENCIA } from '@/lib/data/coseguros-os'

// Bloque de conversión para las fichas de obras sociales sindicales (1-oct-2026,
// pedido de Darío: persuasivo, hacia planes superadores, Swiss Medical primero).
// Todo lo que afirma tiene fuente:
// - Swiss Medical S.A. está en el listado de la opción de cambio (RNAS 9-0080-5).
// - Precios "con aportes" del cuadro que Swiss declara ante la SSSalud (motor
//   de precios), 30 años, AMBA; el aporte que llega es APORTE_DERIVABLE.
// - SMG20 sin copagos en consultas, domicilio y estudios: folleto oficial del
//   plan, vigencia 09/2026. El S1 (entrada) sí tiene copagos: se aclara.
// - Coseguros de cada obra social: lib/data/coseguros-os.ts (publicación oficial).
// - Sanatorios, SMG Center, ICBA, Guardia Ágil y Swity: confirmados por Darío
//   (partner oficial) y en la ficha de Swiss (lib/data/prepagas.ts).

const precios30 = preciosParaGrupo([30], 'caba', 'desregulado')
const smg20 = precios30['swiss-medical/smg20'] ?? 0
const sueldoSmg20 = smg20 / APORTE_DERIVABLE
const swissEntrada = calcularSueldos('caba').find((f) => f.prepaga === 'Swiss Medical')
const planesSwiss = prepagas.find((p) => p.slug === 'swiss-medical')?.planes.map((p) => p.nombre) ?? []
// Sueldos de ejemplo para mostrar la diferencia a pagar por el SMG20
const SUELDOS_EJEMPLO = [1_200_000, 1_800_000, 2_500_000, 3_000_000]
const diferencia = (sueldo: number) => Math.max(0, Math.round(smg20 - sueldo * APORTE_DERIVABLE))

export function PasateConTusAportes({ osNombre, osSlug, sanatoriosOs, fuente, titulo }: { osNombre: string; osSlug: string; sanatoriosOs?: number; fuente?: string; titulo?: string }) {
  const coseguros = COSEGUROS_OS[osSlug]
  return (
    <section id="pasarte" className="py-12 bg-gradient-to-b from-red-50/60 to-white border-t border-gray-100">
      <div className="container max-w-4xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-wide text-[#E8002D] mb-2">Tus aportes, tu elección</p>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight text-balance">
          {titulo ?? `¿Tenés ${osNombre}? Con tus mismos aportes podés tener Swiss Medical, sin copagos`}
        </h2>
        <p className="text-gray-700 leading-relaxed mt-3 max-w-3xl">
          Todos los meses se descuenta de tu sueldo un aporte para tu salud. Ese aporte es tuyo, no de {osNombre}: la ley te deja
          elegir a dónde va. Si lo pasás a Swiss Medical, tu aporte paga el plan y vos ponés solo la diferencia, o nada, según lo que ganes.
        </p>

        {coseguros && (
          <div className="mt-6 rounded-2xl bg-white border border-gray-200 p-5">
            <div className="font-bold text-gray-900">Lo que pagás hoy en {osNombre} cada vez que la usás</div>
            <ul className="mt-3 divide-y divide-gray-100">
              {coseguros.items.map((x) => (
                <li key={x.concepto} className="flex justify-between gap-4 py-2 text-sm">
                  <span className="text-gray-700">{x.concepto}</span>
                  <span className="font-bold text-gray-900 tabular-nums">{x.valor}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-800 mt-3">
              En el <strong>Swiss Medical SMG20</strong>, las consultas, las visitas a domicilio y los estudios son <strong>sin cargo</strong>.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Coseguros oficiales de {osNombre}{coseguros.plan ? ` (plan ${coseguros.plan})` : ''}, vigencia: {coseguros.vigencia}{' '}
              (<a href={coseguros.fuente} target="_blank" rel="noopener noreferrer" className="underline">fuente</a>). Swiss Medical: folleto
              oficial del plan SMG20, vigencia {SWISS_COPAGOS_VIGENCIA}.{' '}
              <Link href="/obras-sociales/coseguros" className="underline">Coseguros de otras obras sociales</Link>.
            </p>
          </div>
        )}

        {smg20 > 0 && (
          <div className="mt-6 rounded-2xl bg-white border-2 border-[#E8002D]/20 p-5 sm:p-6">
            <div className="text-sm text-gray-600">Con un sueldo bruto desde</div>
            <div className="text-3xl sm:text-4xl font-black text-gray-900 tabular-nums">{millonesLargo(sueldoSmg20)}</div>
            <div className="text-sm text-gray-700 mt-1">
              tu aporte paga el <strong>Swiss Medical SMG20</strong> completo: sin copagos en consultas, visitas a domicilio ni estudios.
            </div>
            <div className="mt-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Si ganás menos, pagás solo la diferencia</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SUELDOS_EJEMPLO.map((s) => (
                  <div key={s} className="rounded-lg bg-gray-50 p-3">
                    <div className="text-xs text-gray-500">Sueldo de {millonesLargo(s)}</div>
                    <div className="font-bold text-gray-900 tabular-nums">{formatPrecio(diferencia(s))}/mes</div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Persona de 30 años en el AMBA, con el cuadro tarifario “con aportes” que Swiss Medical declara ante la Superintendencia
              de Servicios de Salud ({MES}). Tu precio exacto depende de tu edad y tu grupo familiar.
              {swissEntrada && ` Si buscás algo más económico, el ${swissEntrada.plan}, de entrada, se cubre con un sueldo desde ${millonesLargo(swissEntrada.sueldo.s30)}, pero tiene copago en consultas, domicilio y guardia.`}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Qué ganás con Swiss Medical</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                '9 sanatorios propios: Suizo Argentina, Los Arcos, Agote, Zabala, Olivos, San Lucas y Las Lomas, entre otros',
                'Más de 30 SMG Center en el AMBA para consultas y estudios, y SMG Center en Neuquén',
                'Dueña del ICBA (Instituto Cardiovascular de Buenos Aires) y de Diagnóstico Maipú',
                'Guardia Ágil: reservás tu turno en la guardia desde el celular',
                'Trámites por WhatsApp con Swity',
              ].map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="text-[#E8002D] font-bold">✓</span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            {typeof sanatoriosOs === 'number' && sanatoriosOs > 0 && (
              <p className="text-xs text-gray-500 mt-3">
                Para comparar: la cartilla oficial de {osNombre} tiene {sanatoriosOs.toLocaleString('es-AR')} sanatorios y clínicas con
                internación en todo el país, en su mayoría de terceros.{' '}
                <Link href={`/obras-sociales/${osSlug}/cartilla`} className="underline">Ver la cartilla de {osNombre}</Link>.
              </p>
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Cómo te pasás, en 3 pasos</h3>
            <ol className="space-y-3 text-sm text-gray-700">
              <li><strong>1. Cotizás.</strong> Te pasamos el precio exacto de tu plan con tus aportes, en {TIEMPO_RESPUESTA}.</li>
              <li><strong>2. Hacés la opción de cambio.</strong> Online, en la web de la Superintendencia, con tu clave fiscal nivel 3. Confirmás el mail que te llega dentro de las 48 horas.</li>
              <li><strong>3. Empezás a usarla.</strong> El cambio se activa el primer día del mes siguiente. Tus aportes dejan de ir a {osNombre}.</li>
            </ol>
            <p className="text-xs text-gray-500 mt-3">
              Swiss Medical figura en el listado oficial de la opción de cambio (código 9-0080-5). La opción se puede hacer una vez cada 365 días.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <ContratarPlanButton
            prepagaNombre="Swiss Medical"
            fuente={fuente ?? `ficha-os-${osSlug}`}
            label="Quiero Swiss Medical con mis aportes"
            titulo={`Pasá de ${osNombre} a Swiss Medical`}
            planesOpciones={planesSwiss}
            datosExtra={{ obra_social_actual: osNombre }}
          />
          <Link href={osSlug ? `/calculadora-aportes?os=${osSlug}` : '/calculadora-aportes'} className="inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-[#E8002D] text-gray-800 font-bold text-sm">
            Calcular mi diferencia con mi sueldo
          </Link>
        </div>
      </div>
    </section>
  )
}

/** Pregunta frecuente persuasiva con el mismo dato, para el JSON-LD de la ficha. */
export function faqPasarseASwiss(osNombre: string) {
  return {
    q: `¿Puedo pasar mis aportes de ${osNombre} a Swiss Medical?`,
    a: smg20 > 0
      ? `Sí. Swiss Medical figura en el listado oficial de la opción de cambio, así que podés derivarle tus aportes y pagar solo la diferencia del plan. Con un sueldo bruto desde ${millonesLargo(sueldoSmg20)}, el aporte paga el Swiss Medical SMG20 completo, sin copagos en consultas, visitas a domicilio ni estudios (persona de 30 años en el AMBA, cuadro oficial de ${MES}). El trámite es online, en la web de la Superintendencia, y el cambio se activa el primer día del mes siguiente.`
      : `Sí. Swiss Medical figura en el listado oficial de la opción de cambio, así que podés derivarle tus aportes y pagar solo la diferencia del plan.`,
  }
}

/** Si la obra social publica coseguros: "¿cuánto cobra de coseguro?" para la ficha. */
export function faqCoseguros(osNombre: string, osSlug: string) {
  const c = COSEGUROS_OS[osSlug]
  if (!c) return null
  return {
    q: `¿Cuánto cobra ${osNombre} de coseguro?`,
    a: `Según sus valores oficiales${c.plan ? ` del plan ${c.plan}` : ''} (vigencia: ${c.vigencia}): ${c.items.map((x) => `${x.concepto.toLowerCase()}, ${x.valor}`).join('; ')}. Desde la Resolución 1926/2024 de la Superintendencia, cada obra social fija sus coseguros libremente, avisando con 30 días.`,
  }
}
