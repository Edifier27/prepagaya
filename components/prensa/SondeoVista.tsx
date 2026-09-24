import Link from 'next/link'
import { MIN_BASE, type BloqueSondeo, type ResultadoSondeo } from '@/lib/data/sondeo'
import { SITE_NAME } from '@/lib/utils'

// Vista del sondeo (/prensa/sondeo), separada de la consulta a la base para
// poder revisarla con datos de ejemplo. Barras de una sola serie en el rojo
// de la marca, con el valor escrito al lado y el texto en grises.

const fmtFecha = (iso: string) => new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
const pct = (n: number) => `${n.toLocaleString('es-AR')}%`

function Barras({ b }: { b: BloqueSondeo }) {
  const max = Math.max(...b.items.map((x) => x.pct))
  return (
    <section className="rounded-2xl border border-gray-200 p-5">
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <h2 className="font-bold text-gray-900">{b.titulo}</h2>
        <span className="text-xs text-gray-500 whitespace-nowrap">{b.base.toLocaleString('es-AR')} respuestas</span>
      </div>
      {/* Etiqueta y valor arriba, barra abajo: las etiquetas largas
          ("Relación de dependencia") no se cortan en mobile. */}
      <ul className="space-y-2.5">
        {b.items.map((x) => (
          <li key={x.etiqueta} className="text-sm"
            title={`${x.etiqueta}: ${pct(x.pct)} (${x.n.toLocaleString('es-AR')} de ${b.base.toLocaleString('es-AR')})`}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-gray-700">{x.etiqueta}</span>
              <span className="tabular-nums font-semibold text-gray-900">{pct(x.pct)}</span>
            </div>
            <span className="mt-1 block h-2.5 rounded bg-gray-100 overflow-hidden" aria-hidden>
              <span className="block h-full rounded bg-[#E8002D]" style={{ width: `${(x.pct / max) * 100}%` }} />
            </span>
          </li>
        ))}
      </ul>
      {b.nota && <p className="text-xs text-gray-500 mt-3">{b.nota}</p>}
    </section>
  )
}

export function SondeoVista({ s }: { s: ResultadoSondeo }) {
  const hayDatos = s.total >= MIN_BASE && s.bloques.length > 0
  const periodo = s.desde && s.hasta ? `del ${fmtFecha(s.desde)} al ${fmtFecha(s.hasta)}` : ''
  const bloque = (id: string) => s.bloques.find((b) => b.id === id)
  const item = (id: string, etiqueta: string) => bloque(id)?.items.find((x) => x.etiqueta === etiqueta)

  // Datos destacados para la bajada y la cita: solo los que existen.
  const familias = item('grupo', 'Familia con hijos')
  const sinCobertura = item('cobertura-actual', 'No tengo cobertura')
  const sinCopago = item('copago', 'Quiere un plan sin copago')
  const destacados = [
    s.edadMedianaTitular != null ? { v: `${s.edadMedianaTitular} años`, l: 'Edad mediana de quien cotiza' } : null,
    familias ? { v: pct(familias.pct), l: 'Cotiza para una familia con hijos' } : null,
    sinCobertura ? { v: pct(sinCobertura.pct), l: 'No tiene ninguna cobertura hoy' } : null,
    sinCopago ? { v: pct(sinCopago.pct), l: 'Quiere un plan sin copago' } : null,
  ].filter((x): x is { v: string; l: string } => x !== null)

  return (
    <>
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wide text-[#E8002D] mb-2">Sondeo {SITE_NAME} · datos propios</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">Quién busca prepaga en Argentina</h1>
          {hayDatos ? (
            <p className="text-gray-700 text-base leading-relaxed mt-4 max-w-3xl">
              Análisis de {s.total.toLocaleString('es-AR')} cotizaciones de prepaga hechas en {SITE_NAME} {periodo}. Datos anónimos y agregados: ningún número de esta página identifica a una persona.
            </p>
          ) : (
            <p className="text-gray-700 text-base leading-relaxed mt-4 max-w-3xl">
              Todavía no hay suficientes cotizaciones para publicar el sondeo (mínimo {MIN_BASE} por dato). Mientras tanto, el dato oficial del mes está en el <Link href="/prensa" className="text-[#E8002D] font-semibold hover:underline">informe de aumentos</Link>.
            </p>
          )}
          {destacados.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {destacados.map((x) => (
                <div key={x.l} className="rounded-xl border border-gray-200 p-4">
                  <div className="text-2xl font-black text-gray-900 tabular-nums">{x.v}</div>
                  <div className="text-xs text-gray-500 mt-1">{x.l}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {hayDatos && (
        <section className="py-10 bg-white">
          <div className="container max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {s.bloques.map((b) => <Barras key={b.id} b={b} />)}
          </div>
        </section>
      )}

      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Metodología</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Sale de las cotizaciones que las personas hacen en el comparador y en el quiz de {SITE_NAME}. Cada persona cuenta una vez aunque cotice varias veces en el día. La situación laboral, la cobertura actual y las preferencias son opcionales, así que cada gráfico indica sobre cuántas respuestas se calcula. Un gráfico se muestra con al menos {MIN_BASE} respuestas y las categorías con menos de 5 se agrupan en “Otras”. Se actualiza todos los días.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Para citar</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Podés usar estos datos citando a {SITE_NAME} con un enlace a esta página. Consultas de prensa: <a href="mailto:hola@prepagaya.com.ar" className="text-[#E8002D] font-semibold hover:underline">hola@prepagaya.com.ar</a>. El dato oficial de aumentos está en el <Link href="/prensa" className="text-[#E8002D] font-semibold hover:underline">informe mensual</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
