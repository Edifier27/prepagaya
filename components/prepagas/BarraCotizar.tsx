'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { trackEvent } from '@/lib/analytics'

// Barra fija de abajo, solo en el celular, en las fichas de prepaga y las
// páginas de plan (Darío, 3-oct-2026: "llevalos al comparador"). Vercel
// Analytics, 25-sep al 2-oct: unas 4 de cada 10 personas que abren el
// comparador dejan sus datos, y las páginas de plan tenían cientos de
// visitas y casi ningún contacto. Aparece después de bajar un poco (no tapa
// el botón de arriba) y queda sobre la barra de navegación del celular.
export function BarraCotizar({ titulo, href, origen }: { titulo: string; href: string; origen: string }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    // Se ve después de bajar 500 px y se esconde al llegar al pie de página
    const alScrollear = () => {
      const alFinal = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight) < 400
      setVisible(window.scrollY > 500 && !alFinal)
    }
    window.addEventListener('scroll', alScrollear, { passive: true })
    return () => window.removeEventListener('scroll', alScrollear)
  }, [])

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-[3.3rem] z-30 lg:hidden px-3 pb-2 transition-all duration-300 ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
    >
      <Link
        href={href}
        tabIndex={visible ? 0 : -1}
        onClick={() => trackEvent('barra_cotizar_click', { origen })}
        className="flex items-center justify-between gap-3 rounded-2xl bg-[#E8002D] px-4 py-3 text-white shadow-xl"
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold">Cotizá {titulo}</span>
          <span className="block truncate text-[11px] text-red-100">15% OFF online · gratis y sin DNI</span>
        </span>
        <span className="flex-shrink-0 rounded-xl bg-white px-3 py-2 text-sm font-bold text-[#E8002D]">Ver mi precio →</span>
      </Link>
    </div>
  )
}
