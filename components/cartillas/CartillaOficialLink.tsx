import Link from 'next/link'

// Caja que lleva del silo SEO local / fichas de prepaga y plan al silo de
// cartillas (/cartillas/[prepaga]/...). La intención "cartilla" vive en ese
// silo; estas páginas apuntan a "planes y precios" y derivan acá.
export function CartillaOficialLink({
  href,
  titulo,
  texto,
}: {
  href: string
  titulo: string
  texto: string
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 bg-white border border-gray-200 hover:border-red-200 hover:shadow-sm rounded-2xl p-4 sm:p-5 transition-all"
    >
      <div className="flex items-start gap-3 min-w-0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-6 h-6 text-[#E8002D] flex-shrink-0 mt-0.5" aria-hidden>
          <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M10.5 9h3M12 7.5v3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="min-w-0">
          <div className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-[#E8002D] transition-colors">{titulo}</div>
          <div className="text-xs sm:text-sm text-gray-500 mt-0.5">{texto}</div>
        </div>
      </div>
      <span className="text-[#E8002D] font-semibold text-sm whitespace-nowrap flex-shrink-0">Ver →</span>
    </Link>
  )
}
