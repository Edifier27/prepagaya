import Link from 'next/link'
import type { CentroEnOtras } from '@/lib/data/cartilla-zonas/cruce'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'

// "¿No encontrás tu sanatorio? Está en la cartilla de otra prepaga" — CRO.
// Recibe el cruce ya calculado (lib/data/cartilla-zonas/cruce.ts), así sirve
// tanto en las páginas estáticas como dentro del buscador cliente (que lo
// recibe por la API) sin importar datos.
export function EnOtrasCartillas({
  items,
  prepagaNombre,
  zonaCorta,
  max = 12,
  prepagaSlug,
}: {
  items: CentroEnOtras[]
  prepagaNombre: string
  zonaCorta: string
  max?: number
  prepagaSlug?: string
}) {
  if (items.length === 0) return null
  // En OSDE, a la vista solo los que se pueden cotizar con Swiss Medical (el
  // socio de OSDE en general se pasa a Swiss, Darío 27-sep-2026); el resto,
  // plegado. Los items ya vienen con Swiss primero (cruce.ts).
  const corte = prepagaSlug === 'osde' ? Math.min(max, items.filter((c) => c.en[0].prepagaSlug === 'swiss-medical').length) : max
  const visibles = items.slice(0, corte)
  const resto = items.slice(corte)
  // Botón "Cotizar": una mezcla de prepagas (Darío, 3-oct-2026: en Swiss salía
  // siempre "Cotizar Premedic"). En cada sanatorio se ofrece, entre las que lo
  // tienen, la que menos veces se ofreció hasta ahora (a igualdad, el orden del
  // cruce: partners primero).
  const usos = new Map<string, number>()
  const ofrecida = new Map<string, CentroEnOtras['en'][number]>()
  for (const c of items) {
    const elegida = [...c.en].sort((a, b) => (usos.get(a.prepagaSlug) ?? 0) - (usos.get(b.prepagaSlug) ?? 0))[0]
    usos.set(elegida.prepagaSlug, (usos.get(elegida.prepagaSlug) ?? 0) + 1)
    ofrecida.set(c.nombre, elegida)
  }
  const fila = (c: CentroEnOtras) => {
    const primera = ofrecida.get(c.nombre) ?? c.en[0]
    return (
      <li key={c.nombre} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-sky-100 rounded-xl p-3">
        <div className="min-w-0">
          <div className="font-semibold text-gray-900 text-sm">{c.nombre}</div>
          {c.direccion && <div className="text-xs text-gray-500">{c.direccion}</div>}
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {c.en.map((e) => (
              <Link
                key={e.prepagaSlug}
                href={`/cartillas/${e.prepagaSlug}/${e.zonaSlug}`}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-100 hover:border-sky-300"
              >
                {e.prepagaNombre} · {e.desde.label.replace(/ \(.*\)$/, '')}
              </Link>
            ))}
          </div>
        </div>
        <ContratarPlanButton
          prepagaNombre={primera.prepagaNombre}
          planNombre={primera.desde.label}
          fuente="cartilla-cruce"
          label={`Cotizar ${primera.prepagaNombre}`}
          className="flex-shrink-0 inline-flex items-center justify-center gap-1 px-4 py-2 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-lg transition-all text-xs"
        />
      </li>
    )
  }
  return (
    <div className="bg-sky-50/60 border border-sky-100 rounded-2xl p-5">
      <h2 className="text-lg font-bold text-gray-900 mb-1">
        ¿No encontrás tu sanatorio en la cartilla de {prepagaNombre} en {zonaCorta}?
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Estos sanatorios para internación de {zonaCorta} no los encontramos en la cartilla de {prepagaNombre}, pero figuran en la de otras prepagas (y en qué plan):
      </p>
      {visibles.length > 0 && <ul className="space-y-2">{visibles.map(fila)}</ul>}
      {resto.length > 0 && (
        <details className="mt-2">
          <summary className="cursor-pointer text-sm font-semibold text-sky-800 py-2">
            {visibles.length > 0 ? `Ver ${resto.length} más` : `Ver ${resto.length === 1 ? 'el sanatorio' : `los ${resto.length} sanatorios`} en otras prepagas`}
          </summary>
          <ul className="space-y-2 mt-2">{resto.map(fila)}</ul>
        </details>
      )}
      <p className="text-[11px] text-gray-400 mt-3">
        Cruzamos las cartillas oficiales de cada prepaga por nombre y dirección del sanatorio. Confirmá la cobertura antes de contratar.
      </p>
    </div>
  )
}
