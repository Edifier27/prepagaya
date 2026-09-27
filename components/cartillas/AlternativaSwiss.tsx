import Link from 'next/link'
import { CARTILLAS, nombreCortoZona } from '@/lib/data/cartilla-zonas'
import { claveZona, type CentroEnOtras } from '@/lib/data/cartilla-zonas/cruce'
import { internacionCerca } from '@/lib/data/guardias-cerca'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'

// En las cartillas de OSDE, Swiss Medical como alternativa (27-sep-2026,
// Darío: "ahí tenés que poner casi todo de Swiss Medical, ya que el socio de
// OSDE en general se pasa a Swiss Medical"). Los números salen de las dos
// cartillas oficiales: sanatorios con internación de Swiss Medical en la
// misma zona y cuántos de los que faltan en OSDE están en Swiss.

// Ciudades donde, cerca del centro, la cartilla de Swiss Medical tiene más
// sanatorios con internación que la de OSDE (27-sep-2026, Darío: "Dale"). La
// clave es la zona de la cartilla de OSDE y el punto, la plaza principal. Se
// cuenta con las coordenadas de /guardias-cerca al armar el sitio: si una
// cartilla se actualiza y Swiss deja de tener más, el dato no se muestra.
const CENTROS: Record<string, { ciudad: string; lat: number; lon: number }> = {
  'cordoba-capital': { ciudad: 'Córdoba', lat: -31.4166, lon: -64.1838 },
  parana: { ciudad: 'Paraná', lat: -31.7322, lon: -60.5286 },
  'ciudad-de-neuquen': { ciudad: 'Neuquén', lat: -38.9518, lon: -68.0592 },
  'san-miguel-de-tucuman': { ciudad: 'San Miguel de Tucumán', lat: -26.8304, lon: -65.2038 },
}
const RADIO_KM = 10

function comparacionCiudad(zonaSlug?: string) {
  const c = zonaSlug ? CENTROS[zonaSlug] : undefined
  if (!c) return null
  const n = internacionCerca(c.lat, c.lon, RADIO_KM)
  const swiss = n['swiss-medical'] ?? 0
  const osde = n.osde ?? 0
  if (swiss <= osde) return null
  const mapa = `/guardias-cerca?${new URLSearchParams({ prepaga: 'swiss-medical', tipo: 'internacion', lat: String(c.lat), lon: String(c.lon), lugar: `${c.ciudad} (centro)` })}`
  return { ...c, swiss, osde, mapa }
}

export function AlternativaSwiss({ prepagaSlug, zonaSlug, enOtras = [] }: { prepagaSlug: string; zonaSlug?: string; enOtras?: CentroEnOtras[] }) {
  if (prepagaSlug !== 'osde') return null
  const swiss = CARTILLAS['swiss-medical']
  if (!swiss) return null
  const z = zonaSlug ? swiss.zonas.find((x) => claveZona(x.slug) === claveZona(zonaSlug)) : undefined
  const internacion = z ? z.centros.filter((c) => c.internacion.length > 0).length : 0
  const soloEnSwiss = enOtras.filter((o) => o.en.some((e) => e.prepagaSlug === 'swiss-medical')).length
  const zonaCorta = z ? nombreCortoZona(z.nombre) : null
  const ciudad = comparacionCiudad(zonaSlug)

  return (
    <section className="py-10 bg-white border-t border-gray-100">
      <div className="container max-w-4xl mx-auto">
        <div className="rounded-2xl border-2 border-[#E8002D]/20 bg-red-50/40 p-5">
          <h2 className="text-lg font-bold text-gray-900">¿Tenés OSDE y estás pensando en cambiarte? Mirá Swiss Medical</h2>
          <p className="text-sm text-gray-700 mt-2 leading-relaxed">
            Según nuestra experiencia como asesores, la mayoría de los socios de OSDE que cambian de prepaga se pasan a Swiss Medical.
            {ciudad ? (
              <> En {ciudad.ciudad}, Swiss Medical tiene más sanatorios con internación cerca del centro que OSDE
                {soloEnSwiss > 0 && <>, y {soloEnSwiss === 1 ? 'uno de los sanatorios de su cartilla no está' : `${soloEnSwiss} sanatorios de su cartilla no están`} en la de OSDE</>}.</>
            ) : z && internacion > 0 && (
              <> En {zonaCorta}, la cartilla oficial de Swiss Medical tiene <strong>{internacion} sanatorios y clínicas con internación</strong>
                {soloEnSwiss > 0 && <>, y {soloEnSwiss === 1 ? 'uno de ellos no aparece' : `${soloEnSwiss} de ellos no aparecen`} en la de OSDE</>}.</>
            )}
          </p>
          {ciudad && (
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-2 max-w-xs">
                <div className="rounded-xl border-2 border-[#E8002D] bg-white p-3 text-center">
                  <p className="text-3xl font-extrabold leading-none text-[#E8002D]">{ciudad.swiss}</p>
                  <p className="mt-1 text-xs font-semibold text-gray-800">Swiss Medical</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
                  <p className="text-3xl font-extrabold leading-none text-gray-500">{ciudad.osde}</p>
                  <p className="mt-1 text-xs font-semibold text-gray-600">OSDE</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                Sedes de sanatorios y clínicas con internación a menos de {RADIO_KM} km del centro de {ciudad.ciudad}, sumando todos los planes, según la cartilla oficial de cada prepaga.{' '}
                <Link href={ciudad.mapa} className="font-semibold text-[#E8002D] hover:underline whitespace-nowrap">Verlos en el mapa →</Link>
              </p>
            </div>
          )}
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
