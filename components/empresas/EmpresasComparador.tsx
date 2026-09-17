import Link from 'next/link'
import { prepagas } from '@/lib/data/prepagas'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'

// Comparador de las 2 prepagas corporativas que manejamos (Swiss Medical y
// OSDE) para la home del silo de empresas. A propósito NO repite el
// contenido de /empresas/swiss-medical ni /empresas/osde: acá va solo un
// pantallazo (carrousel + tabla corta) que empuja a esas páginas para el
// detalle, así no hay contenido duplicado entre el hub y las fichas.
function Check({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 rounded-full flex-shrink-0">
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-green-600">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </span>
  ) : (
    <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full flex-shrink-0">
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-gray-300">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </span>
  )
}

export function EmpresasComparador() {
  const swiss = prepagas.find((p) => p.slug === 'swiss-medical')!
  const osde = prepagas.find((p) => p.slug === 'osde')!

  const filas = [
    { label: 'Sanatorios propios', swiss: '8', osde: 'Trabaja con red de convenios' },
    { label: 'Profesionales en cartilla', swiss: '81.500+', osde: '140.000+' },
    { label: 'Facturación directa al empleado (afinidad)', swiss: true, osde: false },
    { label: 'Cobertura pareja en todo el país', swiss: false, osde: true },
    { label: 'Línea corporativa premium con nombre propio', swiss: 'Plan Black', osde: '—' },
    { label: 'Deducible de Ganancias', swiss: true, osde: true },
  ]

  return (
    <div>
      {/* Carrousel de cards */}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 mb-8" style={{ scrollbarWidth: 'none' }}>
        {[swiss, osde].map((p) => (
          <div key={p.slug} className="snap-start flex-shrink-0 w-[280px] sm:w-[320px] bg-white rounded-2xl border-2 border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <PrepagaLogo slug={p.slug} nombre={p.nombre} colorPrimario={p.colorPrimario} size="md" />
              <div>
                <div className="font-bold text-gray-900">{p.nombre}</div>
                <div className="text-xs text-gray-400">{p.satisfaccion}% satisfacción</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{p.descripcion}</p>
            <Link
              href={`/empresas/${p.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E8002D] hover:underline"
            >
              Ver plan corporativo de {p.nombre} →
            </Link>
          </div>
        ))}
      </div>

      {/* Tabla comparativa corta */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">&nbsp;</th>
              <th className="px-4 py-3 text-center">
                <span className="font-bold text-gray-900">Swiss Medical</span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="font-bold text-gray-900">OSDE</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filas.map((f) => (
              <tr key={f.label}>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{f.label}</td>
                <td className="px-4 py-3 text-center">
                  {typeof f.swiss === 'boolean' ? (
                    <div className="flex justify-center"><Check ok={f.swiss} /></div>
                  ) : (
                    <span className="font-semibold text-gray-900">{f.swiss}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {typeof f.osde === 'boolean' ? (
                    <div className="flex justify-center"><Check ok={f.osde} /></div>
                  ) : (
                    <span className="font-semibold text-gray-900">{f.osde}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-3">Datos de cartilla y afiliados verificados a {new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}. El precio de un plan corporativo se cotiza a medida según tu equipo — no es de lista pública en ninguna de las dos prepagas.</p>
    </div>
  )
}
