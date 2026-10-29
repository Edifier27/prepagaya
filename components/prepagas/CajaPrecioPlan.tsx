// Caja de la ficha de cada plan (Darío, 25-oct-2026, "tipo Mercado Libre").
// Sin la calculadora por edad ni el precio estimado (29-oct-2026): queda para
// quién es el plan, el botón de cotizar y comparar. La promo aparece solo en
// Swiss Medical; en el resto, sin promociones.
import type { ReactNode } from 'react'
import Link from 'next/link'

interface Props {
  titulo: string
  promo: { corta: string; detalle: string } | null
  /** Botón que abre el formulario (ContratarPlanButton) */
  cta: ReactNode
  hrefComparar: string
}

export function CajaPrecioPlan({ titulo, promo, cta, hrefComparar }: Props) {
  return (
    <div className="mb-5 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_18px_40px_-24px_rgba(22,18,26,0.35)]">
      {promo && (
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 bg-gradient-to-r from-[#6E0B22] to-[#E8002D] px-5 py-2 text-white">
          <span className="text-sm font-extrabold">{promo.corta}</span>
          <span className="text-xs text-red-100">{promo.detalle}</span>
        </div>
      )}
      <div className="grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-center sm:p-6">
        <div>
          <p className="text-sm font-bold text-gray-900">{titulo}</p>
          {/* Texto sin fondo de color: en un recuadro rosa parecía un botón
              (Clarity, 19–25/10/2026: clics muertos en las fichas de Swiss) */}
          <p className="mt-1 text-sm text-gray-700">
            <strong className="text-[#B8001F]">Conseguí un mejor precio.</strong>{' '}
            {promo ? `Cotizá a tu medida con ${promo.corta} y un asesor oficial te pasa tu precio final por WhatsApp.` : 'Cotizá a tu medida y un asesor te pasa tu precio final por WhatsApp.'}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {cta}
          <Link href={hrefComparar} className="text-center text-sm font-semibold text-gray-600 underline-offset-2 hover:text-[#E8002D] hover:underline">
            Comparar este plan con otro →
          </Link>
        </div>
      </div>
    </div>
  )
}
