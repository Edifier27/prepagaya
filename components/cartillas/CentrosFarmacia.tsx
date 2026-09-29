import type { CentroFarmacia } from '@/lib/data/cartilla-zonas/farmacias'

// Lista de farmacias para la pestaña "Farmacias" de la cartilla — comercios
// habilitados, no hay problema de privacidad (no son personas).

function telHref(tel: string): string | null {
  const primero = tel.match(/(\(?0?\d{2,4}\)?[\s-]?)?\d{2,4}[\s-]?\d{4}/)
  if (!primero) return null
  const digitos = primero[0].replace(/\D/g, '')
  return digitos.length >= 8 ? `tel:${digitos}` : null
}

export function CentrosFarmacia({
  centros,
  plan,
  zonaCorta,
}: {
  centros: CentroFarmacia[]
  plan?: string
  zonaCorta: string
}) {
  const filtrados = plan ? centros.filter((c) => c.planes.includes(plan)) : centros

  if (filtrados.length === 0) {
    return (
      <p className="text-sm text-gray-500 bg-gray-50 border border-gray-100 rounded-xl p-4">
        No hay farmacias en {zonaCorta}
        {plan ? ' para este plan' : ''} en la cartilla oficial.
      </p>
    )
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {filtrados.map((c) => (
        <li key={c.nombre} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-2">
          <div>
            <h4 className="font-semibold text-gray-900 text-sm leading-snug">{c.nombre}</h4>
            {c.notas.length > 0 && <div className="text-xs text-amber-700 mt-0.5">{c.notas.join(' ')}</div>}
          </div>
          <ul className="space-y-2">
            {c.sedes.map((s) => {
              const href = s.tel ? telHref(s.tel) : null
              const maps = s.lat != null && s.lon != null ? `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}` : null
              return (
                <li key={`${s.direccion}-${s.tel}`} className="text-xs text-gray-600 leading-snug">
                  <span className="text-gray-800">{s.direccion}</span>
                  {s.localidad && <span className="text-gray-500"> · {s.localidad}</span>}
                  <div className="flex items-center gap-2 mt-1">
                    {s.tel && (
                      <span className="text-gray-500">
                        Tel. {href ? <a href={href} className="hover:text-[#E8002D] underline-offset-2 hover:underline">{s.tel}</a> : s.tel}
                      </span>
                    )}
                    {maps && (
                      <a href={maps} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#E8002D] hover:underline">
                        Cómo llegar →
                      </a>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </li>
      ))}
    </ul>
  )
}
