import Link from 'next/link'
import { CARTILLAS, nombreCortoZona } from '@/lib/data/cartilla-zonas'
import { claveZona, type CentroEnOtras } from '@/lib/data/cartilla-zonas/cruce'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'

// En las cartillas de OSDE, Swiss Medical como alternativa (27-sep-2026,
// Darío: "ahí tenés que poner casi todo de Swiss Medical, ya que el socio de
// OSDE en general se pasa a Swiss Medical"). Los números salen de las dos
// cartillas oficiales: sanatorios con internación de Swiss Medical en la
// misma zona y cuántos de los que faltan en OSDE están en Swiss.
export function AlternativaSwiss({ prepagaSlug, zonaSlug, enOtras = [] }: { prepagaSlug: string; zonaSlug?: string; enOtras?: CentroEnOtras[] }) {
  if (prepagaSlug !== 'osde') return null
  const swiss = CARTILLAS['swiss-medical']
  if (!swiss) return null
  const z = zonaSlug ? swiss.zonas.find((x) => claveZona(x.slug) === claveZona(zonaSlug)) : undefined
  const internacion = z ? z.centros.filter((c) => c.internacion.length > 0).length : 0
  const soloEnSwiss = enOtras.filter((o) => o.en.some((e) => e.prepagaSlug === 'swiss-medical')).length
  const zonaCorta = z ? nombreCortoZona(z.nombre) : null

  return (
    <section className="py-10 bg-white border-t border-gray-100">
      <div className="container max-w-4xl mx-auto">
        <div className="rounded-2xl border-2 border-[#E8002D]/20 bg-red-50/40 p-5">
          <h2 className="text-lg font-bold text-gray-900">¿Tenés OSDE y estás pensando en cambiarte? Mirá Swiss Medical</h2>
          <p className="text-sm text-gray-700 mt-2 leading-relaxed">
            Según nuestra experiencia como asesores, la mayoría de los socios de OSDE que cambian de prepaga se pasan a Swiss Medical.
            {z && internacion > 0 && (
              <> En {zonaCorta}, la cartilla oficial de Swiss Medical tiene <strong>{internacion} sanatorios y clínicas con internación</strong>
                {soloEnSwiss > 0 && <>, y {soloEnSwiss === 1 ? 'uno de ellos no aparece' : `${soloEnSwiss} de ellos no aparecen`} en la de OSDE</>}.</>
            )}
          </p>
          <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-2">
            <ContratarPlanButton
              prepagaNombre="Swiss Medical"
              fuente="cartilla-osde-a-swiss"
              label="Cotizar Swiss Medical"
              datosExtra={zonaCorta ? { zonaCartilla: zonaCorta } : undefined}
              className="inline-flex items-center justify-center px-5 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all text-sm"
            />
            <Link href="/comparativas/swiss-medical-vs-osde" className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-800 hover:border-[#E8002D] hover:text-[#E8002D]">
              OSDE vs Swiss Medical →
            </Link>
            <Link href={z ? `/cartillas/swiss-medical/${z.slug}` : '/cartillas/swiss-medical'} className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-800 hover:border-[#E8002D] hover:text-[#E8002D]">
              Cartilla de Swiss Medical{zonaCorta ? ` en ${zonaCorta}` : ''} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
