'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { leerZonaGeoDeCookie, type ZonaDetectada } from '@/lib/geo-zonas'

// Banner informativo de geolocalización — nunca reemplaza el H1 ni recomienda
// un plan puntual (no tenemos cartilla verificada localidad por localidad).
// Client component a propósito: lee la cookie que dejó middleware.ts después
// de hidratar, para que la página siga siendo 100% estática (sin esto, leer
// la zona en el servidor forzaría renderizado dinámico en el home).
// Si no hay zona detectada (bot, VPN, IP fuera de Argentina) no renderiza nada.
export function ZonaBanner({ variant = 'home' }: { variant?: 'home' | 'cotizador' }) {
  const [zona, setZona] = useState<ZonaDetectada | null>(null)

  useEffect(() => {
    setZona(leerZonaGeoDeCookie())
  }, [])

  if (!zona) return null

  const href = zona.provinciaSEOSlug ? `/prepagas/${zona.provinciaSEOSlug}` : '/comparador'

  return (
    <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-red-100 rounded-full pl-3 pr-1.5 py-1.5 text-xs shadow-sm mb-4">
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-[#E8002D] flex-shrink-0">
        <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
      </svg>
      <span className="text-gray-600">
        {variant === 'home' ? 'Vemos que estás en' : 'Cotizando para'} <strong className="text-gray-900">{zona.label}</strong>
      </span>
      {zona.provinciaSEOSlug && (
        <Link
          href={href}
          className="text-[#E8002D] font-semibold hover:underline whitespace-nowrap px-2 py-1 rounded-full hover:bg-red-50 transition-colors"
        >
          Ver tu zona →
        </Link>
      )}
    </div>
  )
}
