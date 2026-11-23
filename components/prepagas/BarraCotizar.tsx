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
// La promo es solo de Swiss Medical (regla de Darío). Auditoría del 10-nov-2026: la barra decía "Cotizá OSDE · 15% OFF"
// porque el 15% era el valor por defecto. Ahora, sin promo explícita, sale solo si el botón lleva a cotizar Swiss.
// Versión de compu (23-nov-2026): la barra era solo de celular (lg:hidden) y las páginas de obras sociales, cartillas y la ficha de
// Swiss tienen tráfico de compu sin ningún llamado fijo. Tarjeta chica abajo a la izquierda (a la derecha está el popup de captación),
// que se puede cerrar para el resto de la sesión. Fuente propia "barra-pc" para medirla aparte de la de celular ("barra").
const CLAVE_CERRADA_PC = 'barra-cotizar-pc-cerrada'
const llevaASwiss = (href: string) => /[?&]prepaga=swiss-medical(&|$)/.test(href)

export function BarraCotizar({ titulo, href, origen, promo: promoDada, apareceEn = 500 }: { titulo: string; href: string; origen: string; /** Promo al lado del título; sin indicar, "15% OFF" solo si el botón lleva a Swiss Medical */ promo?: string; /** Píxeles de scroll a partir de los cuales se ve (por defecto 500) */ apareceEn?: number }) {
  const promo = promoDada ?? (llevaASwiss(href) ? '15% OFF' : '')
  const [visible, setVisible] = useState(false)
  const [cerradaPc, setCerradaPc] = useState(false)
  const cerrarPc = () => {
    setCerradaPc(true)
    try { sessionStorage.setItem(CLAVE_CERRADA_PC, '1') } catch { /* sin storage */ }
  }
  const hrefPc = href.replace(/desde=barra(?![a-z-])/, 'desde=barra-pc')
  useEffect(() => {
    // Se ve después de bajar 500 px y se esconde al llegar al pie de página
    const alScrollear = () => {
      const alFinal = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight) < 400
      setVisible(window.scrollY > apareceEn && !alFinal)
      // Si en esta sesión ya la cerró, no vuelve a aparecer (se lee acá y no al montar, para no desfasar el HTML del servidor)
      try { if (sessionStorage.getItem(CLAVE_CERRADA_PC) === '1') setCerradaPc(true) } catch { /* sin storage: se ve igual */ }
    }
    window.addEventListener('scroll', alScrollear, { passive: true })
    return () => window.removeEventListener('scroll', alScrollear)
  }, [apareceEn])

  return (
    <>
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-[3.3rem] z-30 lg:hidden px-3 pb-2 transition-all duration-300 ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
    >
      <Link
        href={href}
        tabIndex={visible ? 0 : -1}
        onClick={() => trackEvent('barra_cotizar_click', { origen })}
        className="flex items-center justify-between gap-3 rounded-2xl bg-[#E8002D] px-4 py-2 text-white shadow-xl"
      >
        {/* Una sola línea (11-oct-2026): ocupa menos pantalla en el celular */}
        <span className="min-w-0 truncate text-sm font-bold">Cotizá {titulo} {promo && <span className="font-semibold text-red-100">· {promo}</span>}</span>
        <span className="flex-shrink-0 rounded-xl bg-white px-3 py-1.5 text-sm font-bold text-[#E8002D]">Ver mi precio →</span>
      </Link>
    </div>

    {!cerradaPc && (
      <div
        aria-hidden={!visible}
        className={`hidden lg:block fixed bottom-6 left-4 z-30 w-72 transition-all duration-300 ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
      >
        <div className="relative rounded-2xl bg-[#E8002D] p-4 text-white shadow-xl">
          <button
            type="button"
            onClick={cerrarPc}
            tabIndex={visible ? 0 : -1}
            aria-label="Cerrar"
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-lg leading-none text-red-100 hover:bg-white/15 hover:text-white"
          >
            ×
          </button>
          <p className="pr-6 text-sm font-bold leading-snug">Cotizá {titulo} {promo && <span className="font-semibold text-red-100">· {promo}</span>}</p>
          <p className="mt-0.5 text-xs text-red-100">Gratis y sin DNI. Dejás tus datos y ves el precio de cada plan.</p>
          <Link
            href={hrefPc}
            tabIndex={visible ? 0 : -1}
            onClick={() => trackEvent('barra_cotizar_click', { origen, dispositivo: 'compu' })}
            className="mt-3 flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#E8002D] transition-colors hover:bg-red-50"
          >
            Ver mi precio →
          </Link>
        </div>
      </div>
    )}
    </>
  )
}
