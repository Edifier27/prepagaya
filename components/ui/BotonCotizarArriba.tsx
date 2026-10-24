'use client'

import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'

// Botón para cotizar en el primer pantallazo (acción 6 de la auditoría del
// 21-oct-2026): en /precios el primer link al cotizador estaba casi 8
// pantallas más abajo y llevaba a la home. Va directo al comparador con
// ?desde=, que /api/leads guarda como "cotizacion-wizard · <desde>". El clic
// se mide igual que la barra fija (barra_cotizar_click) con origen "arriba:…".
export function BotonCotizarArriba({ desde, query = '', centrado = false, className = '' }: {
  /** Origen del lead: 3 a 20 letras minúsculas o guiones (lo valida /api/leads) */
  desde: string
  /** Parámetros extra para el comparador, sin "?" ni "&" inicial (ej. "prepaga=osde&plan=210") */
  query?: string
  centrado?: boolean
  className?: string
}) {
  const href = `/comparador?${query ? `${query}&` : ''}desde=${desde}`
  return (
    <div className={`flex flex-col gap-1.5 ${centrado ? 'items-center' : 'items-start'} ${className}`}>
      <Link
        href={href}
        onClick={() => trackEvent('barra_cotizar_click', { origen: `arriba:${desde}` })}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E8002D] px-5 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#B8001F]"
      >
        Ver mi precio por edad →
      </Link>
      <span className="text-xs text-gray-500">Gratis, sin DNI y en 1 minuto</span>
    </div>
  )
}
