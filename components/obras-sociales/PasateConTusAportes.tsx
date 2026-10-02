import Link from 'next/link'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'
import { calcularSueldos, millonesLargo, MES } from '@/lib/prensa/sueldo-prepaga'
import { TIEMPO_RESPUESTA } from '@/lib/utils'
import { prepagas } from '@/lib/data/prepagas'

// Bloque de conversión para las fichas de obras sociales sindicales (1-oct-2026,
// pedido de Darío: persuasivo, hacia planes superadores, Swiss Medical primero).
// Todo lo que afirma tiene fuente:
// - Swiss Medical S.A. está en el listado de la opción de cambio (RNAS 9-0080-5).
// - El sueldo sale del cuadro "con aportes" que Swiss declara ante la SSSalud
//   (lib/prensa/sueldo-prepaga.ts), 30 años, AMBA.
// - Sanatorios, SMG Center, ICBA, Guardia Ágil y Swity: confirmados por Darío
//   (partner oficial) y en la ficha de Swiss (lib/data/prepagas.ts).

const filas = calcularSueldos('caba')
const swiss = filas.find((f) => f.prepaga === 'Swiss Medical')
const premedic = filas.find((f) => f.prepaga === 'Premedic')
const planesSwissData = prepagas.find((p) => p.slug === 'swiss-medical')?.planes ?? []
const planesSwiss = planesSwissData.map((p) => p.nombre)
// Si el plan de entrada tiene copago, se aclara (no prometer "todo cubierto")
const swissConCopago = !!swiss && planesSwissData.find((p) => p.nombre === swiss.plan)?.copago === true

export function datosSwissAportes() {
  return swiss ? { plan: swiss.plan, sueldo: swiss.sueldo.s30 } : null
}

export function PasateConTusAportes({ osNombre, osSlug, sanatoriosOs }: { osNombre: string; osSlug: string; sanatoriosOs?: number }) {
  return (
    <section id="pasarte" className="py-12 bg-gradient-to-b from-red-50/60 to-white border-t border-gray-100">
      <div className="container max-w-4xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-wide text-[#E8002D] mb-2">Tus aportes, tu elección</p>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight text-balance">
          ¿Tenés {osNombre}? Con tus mismos aportes podés tener Swiss Medical
        </h2>
        <p className="text-gray-700 leading-relaxed mt-3 max-w-3xl">
          Todos los meses se descuenta de tu sueldo un aporte para tu cobertura de salud. Ese aporte es tuyo, no de {osNombre}:
          la ley te deja elegir a dónde va. Si lo pasás a Swiss Medical, tus aportes pagan el plan y vos ponés solo la diferencia,
          o nada, según lo que ganes.
        </p>

        {swiss && (
          <div className="mt-6 rounded-2xl bg-white border-2 border-[#E8002D]/20 p-5 sm:p-6">
            <div className="text-sm text-gray-600">Con un sueldo bruto desde</div>
            <div className="text-3xl sm:text-4xl font-black text-gray-900 tabular-nums">{millonesLargo(swiss.sueldo.s30)}</div>
            <div className="text-sm text-gray-700 mt-1">
              tus aportes pagan el <strong>Swiss Medical {swiss.plan}</strong> completo, sin diferencia{swissConCopago ? ' (plan de entrada, con copago en las consultas)' : ''}.
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Persona de 30 años en el AMBA, con el cuadro tarifario “con aportes” que Swiss Medical declara ante la Superintendencia
              de Servicios de Salud ({MES}). Si ganás menos, pagás solo la diferencia; si querés un plan sin copago, también se calcula
              con tus aportes.
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
            fuente={`ficha-os-${osSlug}`}
            label="Quiero Swiss Medical con mis aportes"
            titulo={`Pasá de ${osNombre} a Swiss Medical`}
            planesOpciones={planesSwiss}
            datosExtra={{ obra_social_actual: osNombre }}
          />
          <Link href={`/calculadora-aportes?os=${osSlug}`} className="inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-[#E8002D] text-gray-800 font-bold text-sm">
            Calcular mi diferencia con mi sueldo
          </Link>
        </div>
        {premedic && (
          <p className="text-xs text-gray-500 mt-4">
            ¿Buscás lo más económico? Con aportes desde {millonesLargo(premedic.sueldo.s30)} de sueldo bruto pagás el Premedic {premedic.plan} completo.{' '}
            <Link href="/comparador" className="underline">Compará todas las prepagas</Link>.
          </p>
        )}
      </div>
    </section>
  )
}

/** Pregunta frecuente persuasiva con el mismo dato, para el JSON-LD de la ficha. */
export function faqPasarseASwiss(osNombre: string) {
  return {
    q: `¿Puedo pasar mis aportes de ${osNombre} a Swiss Medical?`,
    a: swiss
      ? `Sí. Swiss Medical figura en el listado oficial de la opción de cambio, así que podés derivarle tus aportes y pagar solo la diferencia del plan. Con un sueldo bruto desde ${millonesLargo(swiss.sueldo.s30)}, los aportes pagan el Swiss Medical ${swiss.plan}${swissConCopago ? ' (con copago en consultas)' : ''} completo para una persona de 30 años en el AMBA (cuadro oficial de ${MES}). El trámite es online, en la web de la Superintendencia, y el cambio se activa el primer día del mes siguiente.`
      : `Sí. Swiss Medical figura en el listado oficial de la opción de cambio, así que podés derivarle tus aportes y pagar solo la diferencia del plan.`,
  }
}
