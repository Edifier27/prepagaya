import { prepagas } from '@/lib/data/prepagas'
import { formatPrecio } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'

// Trabajamos directo con estas — van primero en el grid.
const PARTNER_ORDER = ['swiss-medical', 'sancor-salud', 'premedic']
const prepagasParaCotizar = [
  ...PARTNER_ORDER.map((slug) => prepagas.find((p) => p.slug === slug)).filter((p): p is (typeof prepagas)[number] => Boolean(p)),
  ...prepagas.filter((p) => !PARTNER_ORDER.includes(p.slug)).sort((a, b) => b.satisfaccion - a.satisfaccion),
]

interface Props {
  className?: string
  fuente?: string
}

// Grid con las 15 prepagas para cotizar directo (sin pasar por el wizard de
// zona/edades) — usado en /comparador y en el home, debajo del cotizador.
export function CotizarPorPrepaga({ className, fuente = 'cotizar-por-prepaga' }: Props) {
  return (
    <section className={className ?? 'bg-white border-t border-gray-100 py-12'}>
      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cotizar por prepaga</h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            ¿Ya sabés cuál te interesa? Elegí la prepaga y dejá tus datos directamente, sin pasar por el comparador.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {prepagasParaCotizar.map((p) => {
            const planEstrella = p.planes.find((pl) => pl.destacado) ?? [...p.planes].sort((a, b) => a.precio - b.precio)[0]
            const precioMin = Math.min(...p.planes.map((pl) => pl.precio))
            const isPartner = PARTNER_ORDER.includes(p.slug)
            return (
              <div key={p.slug}
                className={`flex flex-col items-center text-center bg-white rounded-2xl border-2 p-4 ${
                  isPartner ? 'border-amber-200' : 'border-gray-100'
                }`}>
                {isPartner && (
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full border mb-2"
                    style={{ color: '#92400E', backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }}>
                    ★ TRABAJAMOS CON ELLOS
                  </span>
                )}
                <PrepagaLogo slug={p.slug} nombre={p.nombre} colorPrimario={p.colorPrimario} size="md" className="mb-2" />
                <div className="font-bold text-gray-900 text-sm leading-tight">{p.nombre}</div>
                <div className="text-xs text-gray-400 mt-0.5 mb-3">
                  Desde <span className="font-semibold text-gray-600">{formatPrecio(precioMin)}</span>
                </div>
                <ContratarPlanButton
                  prepagaNombre={p.nombre}
                  planNombre={planEstrella.nombre}
                  fuente={fuente}
                  label="Cotizar"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#E8002D] hover:bg-[#B8001F] text-white rounded-lg text-xs font-bold transition-colors"
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
