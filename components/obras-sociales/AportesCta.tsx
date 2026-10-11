import Link from 'next/link'

// Aviso compacto arriba de todo en las páginas de obras sociales (11-oct-2026):
// fichas, códigos y cartillas por provincia suman unas 330 visitas por semana
// desde Google y casi no dejaban contactos. El bloque grande de "pasate con tus
// aportes" quedaba muy abajo; este va pegado al primer pantallazo.
export function AportesCta({ osNombre, osSlug, derivable = true }: { osNombre?: string; osSlug?: string; derivable?: boolean }) {
  const href = derivable
    ? `/calculadora-aportes${osSlug ? `?os=${osSlug}` : ''}`
    : '/comparador?prepaga=swiss-medical&desde=obra-social'
  return (
    <Link
      href={href}
      className="group mt-5 flex items-center gap-3 rounded-2xl border border-[#E8002D]/25 bg-white p-4 shadow-sm hover:border-[#E8002D] transition-colors"
    >
      <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-lg">💳</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-gray-900">
          {derivable
            ? `Con tus aportes${osNombre ? ` de ${osNombre}` : ''} podés tener Swiss Medical`
            : 'Compará prepagas con precio oficial'}
        </span>
        <span className="block text-xs text-gray-600 mt-0.5">
          {derivable ? 'Poné tu sueldo y mirá cuánto pagarías de diferencia, o nada.' : 'Cotizá gratis, sin DNI, con 15% OFF online.'}
        </span>
      </span>
      <span className="shrink-0 rounded-xl bg-[#E8002D] px-3 py-2 text-xs font-bold text-white group-hover:bg-[#B8001F]">
        {derivable ? 'Calcular →' : 'Cotizar →'}
      </span>
    </Link>
  )
}
