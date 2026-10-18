'use client'

import { useEffect, useState } from 'react'
import { trackEvent } from '@/lib/analytics'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'

// Promo de OSDE "Flux + pase semestral SportClub Plan Flex" (18-oct-2026).
// Fuente: términos oficiales del plan Flux (osde.com.ar/terminos-y-condiciones-flux):
// vigencia del 1/10/2026 al 31/10/2026 inclusive o hasta agotar 1000 pases; pase libre
// semestral de 6 meses consecutivos, nominal e intransferible; se activa con el primer
// pago de la cuota del Flux dentro de la vigencia; el referente y el referido reciben
// 1 pase cada uno cuando el referido contrata, paga la primera cuota y mantiene la
// afiliación; para conservar el acceso hay que seguir afiliado a Flux.
// Se oculta sola después del 31-oct (hora de Argentina), sin necesidad de republicar.
const FIN = new Date('2026-11-01T00:00:00-03:00').getTime()
const DIA = 24 * 60 * 60 * 1000

type Caso = 'nuevo' | 'referido' | 'socio'

const CASOS: { id: Caso; label: string; titulo: string; texto: string }[] = [
  {
    id: 'nuevo',
    label: 'Voy a contratar Flux',
    titulo: 'Sí: entrás como nuevo socio',
    texto: 'El pase se activa con el primer pago de la cuota mensual del plan Flux, siempre que lo hagas antes de que termine octubre. Según OSDE, el alta puede ser digital o presencial.',
  },
  {
    id: 'referido',
    label: 'Me recomendó un socio',
    titulo: 'Sí: tu pase y el de quien te recomendó',
    texto: 'El referente y el referido reciben 1 pase cada uno, pero solo cuando el referido contrata Flux, paga la primera cuota y mantiene la afiliación durante la vigencia de la promoción.',
  },
  {
    id: 'socio',
    label: 'Ya soy socio de OSDE',
    titulo: 'Para vos, solo si recomendás Flux',
    texto: 'La promoción es para nuevos socios de Flux. Si recomendás Flux a alguien y esa persona contrata, paga la primera cuota y mantiene la afiliación, vos recibís 1 pase como referente.',
  },
]

export function PromoFluxSportClub({ origen }: { origen: string }) {
  const [dias, setDias] = useState<number | null>(null)
  const [vigente, setVigente] = useState(true)
  const [caso, setCaso] = useState<Caso | null>(null)
  const [condiciones, setCondiciones] = useState(false)

  useEffect(() => {
    const resto = FIN - Date.now()
    if (resto <= 0) { setVigente(false); return }
    setDias(Math.ceil(resto / DIA))
  }, [])

  if (!vigente) return null

  const elegido = CASOS.find((c) => c.id === caso)

  return (
    <section aria-label="Promoción de OSDE: Flux con pase de SportClub" className="my-6 rounded-2xl border-2 border-[#E8002D]/30 bg-red-50/40 p-5">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="text-xs font-bold text-[#E8002D] uppercase tracking-wide">Promo de OSDE · octubre 2026</span>
        {dias !== null && (
          <span className="text-xs font-bold bg-[#E8002D] text-white px-2.5 py-0.5 rounded-full">
            {dias === 1 ? 'Último día' : `Quedan ${dias} días`}
          </span>
        )}
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Flux + 6 meses de SportClub (Plan Flex)</h2>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        OSDE regala un pase libre de 6 meses consecutivos a{' '}
        <a href="https://www.sportclub.com.ar" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#E8002D] underline underline-offset-2">SportClub</a>{' '}
        (Plan Flex) a quienes contratan el Plan Flux entre el 1 y el 31 de octubre de 2026, o hasta agotar los 1.000 pases.
      </p>

      <div className="text-xs font-semibold text-gray-700 mb-2">¿Calificás? Elegí tu caso:</div>
      <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Tu situación">
        {CASOS.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={caso === c.id}
            onClick={() => { setCaso(c.id); trackEvent('promo_flux_caso', { caso: c.id, origen }) }}
            className={`px-3.5 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${
              caso === c.id ? 'bg-[#E8002D] border-[#E8002D] text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-[#E8002D]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {elegido && (
        <div className="rounded-xl bg-white border border-gray-200 p-4 mb-3" aria-live="polite">
          <div className="text-sm font-bold text-gray-900 mb-1">{elegido.titulo}</div>
          <p className="text-sm text-gray-600 leading-relaxed">{elegido.texto}</p>
        </div>
      )}

      <button
        type="button"
        aria-expanded={condiciones}
        onClick={() => { setCondiciones((v) => !v); if (!condiciones) trackEvent('promo_flux_condiciones', { origen }) }}
        className="text-sm font-semibold text-gray-600 hover:text-[#E8002D] underline underline-offset-2 mb-3"
      >
        {condiciones ? 'Ocultar condiciones' : 'Ver las condiciones del pase'}
      </button>
      {condiciones && (
        <ul className="text-xs text-gray-600 leading-relaxed space-y-1.5 list-disc pl-5 mb-4">
          <li>Pase libre semestral de 6 meses consecutivos, nominal e intransferible.</li>
          <li>No se puede canjear por dinero ni por otros productos o servicios.</li>
          <li>Para mantener el acceso al Plan Flex de SportClub hay que seguir afiliado al Plan Flux.</li>
          <li>Vigencia del 1/10/2026 al 31/10/2026 inclusive, o hasta agotar el stock de 1.000 pases, lo que ocurra primero.</li>
          <li>OSDE comparte tus datos con SportClub para dar de alta el Plan Flex.</li>
        </ul>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <ContratarPlanButton
          prepagaNombre="OSDE"
          planNombre="Plan Flux"
          fuente="promo-flux-sportclub"
          label="Cotizar Flux con el pase"
          titulo="Cotizá el Flux y consultá por el pase de SportClub"
        />
        <a href="https://www.osde.com.ar/terminos-y-condiciones-flux" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gray-600 hover:text-[#E8002D] underline underline-offset-2">
          Bases oficiales de OSDE
        </a>
      </div>
      <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
        Promoción de OSDE y SportClub, no de PrepagaYa; mandan las bases oficiales. Pedile a tu asesor que confirme que tu alta entra en la promoción antes de pagar la primera cuota.
      </p>
    </section>
  )
}
