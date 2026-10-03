import Link from 'next/link'
import { OS_MONOTRIBUTO } from '@/lib/data/monotributo'

// Secciones por intención de búsqueda para las fichas de obras sociales
// sindicales (1-oct-2026). Keyword research con el autocompletado de Google
// sobre 77 obras sociales: después de cartilla y teléfono, lo más buscado es
// credencial/app, alta/baja/cambio, discapacidad, monotributo y "opiniones".
// Solo afirma lo que sale de la norma o del registro de la SSSalud.

export interface DatosGuia {
  osNombre: string
  osSlug: string
  /** Código RNAS con guiones (ej. "1-1210-3"); sin código no hay opción de cambio */
  codigo?: string | null
  /** Tiene página de cartilla oficial en el sitio */
  conCartilla?: boolean
  /** La página ya explica el cambio paso a paso (fichas del registro) */
  omitirBaja?: boolean
}

function enMonotributo(codigo?: string | null): boolean | null {
  if (!codigo) return null
  return OS_MONOTRIBUTO.some((o) => o.codigo === codigo)
}

export function faqsGuia(d: DatosGuia) {
  const mono = enMonotributo(d.codigo)
  const faqs = [
    {
      q: `¿Cómo me doy de baja de ${d.osNombre}?`,
      a: `No hace falta hacer un trámite de baja en ${d.osNombre}: alcanza con elegir otra obra social o una prepaga con la opción de cambio, online en la web de la Superintendencia de Servicios de Salud con tu clave fiscal nivel 3. Confirmás el mail dentro de las 48 horas y desde el primer día del mes siguiente tus aportes van a la nueva cobertura. Se puede hacer una vez cada 365 días.`,
    },
    {
      q: `¿Qué cubre ${d.osNombre} en discapacidad?`,
      a: `Con el Certificado Único de Discapacidad (CUD), ${d.osNombre}, como toda obra social, tiene que cubrir el 100% de las prestaciones básicas de la Ley 24.901: rehabilitación, terapias, prestaciones educativas y transporte, entre otras. Si te las niegan o te demoran, podés reclamar ante la Superintendencia de Servicios de Salud al 0800-222-SALUD (72583).`,
    },
  ]
  if (mono !== null) {
    faqs.push({
      q: `¿${d.osNombre} acepta monotributistas?`,
      a: mono
        ? `Sí: figura en el listado oficial de obras sociales que aceptan monotributistas de la Superintendencia de Servicios de Salud. La pagás con el aporte de salud de tu categoría.`
        : `No figura en el listado oficial de obras sociales para monotributistas de la Superintendencia de Servicios de Salud. Si sos monotributista, tenés que elegir una de las que sí están, o una prepaga que acepte tu aporte.`,
    })
  }
  faqs.push({
    q: `¿Es buena ${d.osNombre}?`,
    a: `Depende de lo que necesites. Fijate tres cosas: si el sanatorio que querés está en su cartilla, si tus médicos atienden por ${d.osNombre} y cuánto tardás en conseguir un turno. Si alguna no te cierra, con tus mismos aportes podés pasarte a una prepaga y pagar solo la diferencia.`,
  })
  return faqs
}

export function GuiaObraSocial(d: DatosGuia) {
  const mono = enMonotributo(d.codigo)
  return (
    <section id="guia" className="py-10 bg-white border-t border-gray-100">
      <div className="container max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
        {!d.omitirBaja && <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Cómo darte de baja de {d.osNombre} o cambiarte</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            No existe un trámite de baja aparte: te vas de {d.osNombre} cuando elegís otra cobertura con la <strong>opción de cambio</strong>.
          </p>
          <ol className="text-sm text-gray-700 space-y-1.5 mt-3 list-decimal list-inside">
            <li>Entrás a la web de la Superintendencia de Servicios de Salud con tu clave fiscal nivel 3.</li>
            <li>Elegís la nueva obra social o prepaga.</li>
            <li>Confirmás el mail que te llega dentro de las 48 horas.</li>
            <li>Desde el primer día del mes siguiente, tus aportes van a la nueva cobertura.</li>
          </ol>
          <p className="text-xs text-gray-500 mt-2">Se puede hacer una vez cada 365 días.</p>
        </div>}

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">{d.osNombre} y discapacidad</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Con el <strong>Certificado Único de Discapacidad (CUD)</strong>, {d.osNombre} tiene que cubrir el 100% de las prestaciones
            básicas de la Ley 24.901: rehabilitación, terapias, prestaciones educativas y transporte, entre otras. Es igual para todas
            las obras sociales y prepagas.
          </p>
          <p className="text-sm text-gray-700 mt-2">
            Si te niegan o demoran una prestación, reclamá ante la Superintendencia: <strong>0800-222-SALUD (72583)</strong>.
          </p>
        </div>

        {mono !== null && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">¿{d.osNombre} acepta monotributistas?</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {mono ? (
                <>Sí. Figura en el <Link href="/obras-sociales/monotributo" className="text-[#E8002D] font-semibold hover:underline">listado oficial de obras sociales para monotributistas</Link>: la pagás con el aporte de salud de tu categoría.</>
              ) : (
                <>No figura en el <Link href="/obras-sociales/monotributo" className="text-[#E8002D] font-semibold hover:underline">listado oficial de obras sociales para monotributistas</Link>. Si sos monotributista, elegí una de las que sí están o una prepaga que acepte tu aporte.</>
              )}
            </p>
          </div>
        )}

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">¿Es buena {d.osNombre}?</h2>
          <p className="text-sm text-gray-700 leading-relaxed">Depende de lo que necesites. Antes de quedarte o irte, mirá tres cosas:</p>
          <ul className="text-sm text-gray-700 space-y-1.5 mt-2">
            <li>✓ Si el sanatorio que querés está en su cartilla{d.conCartilla && <> (<Link href={`/obras-sociales/${d.osSlug}/cartilla`} className="text-[#E8002D] font-semibold hover:underline">ver la cartilla de {d.osNombre}</Link>)</>}.</li>
            <li>✓ Si tus médicos atienden por {d.osNombre}.</li>
            <li>✓ Cuánto tardás en conseguir un turno.</li>
          </ul>
          <p className="text-sm text-gray-700 mt-2">
            Si alguna no te cierra, no estás atado: con tus mismos aportes podés pasarte a una prepaga y pagar solo la diferencia.{' '}
            <a href="#pasarte" className="text-[#E8002D] font-semibold hover:underline">Ver cómo →</a>
          </p>
        </div>
      </div>
    </section>
  )
}
