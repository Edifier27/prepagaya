'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Footer } from './Footer'
import { BottomNav } from './BottomNav'
import dynamic from 'next/dynamic'
import { ChromeVisibilityProvider, useChromeVisibility } from './ChromeVisibility'
import type { ProvinciaMenu } from '@/lib/data/zonas'

// Arranca oculto (aparece al intentar salir): se descarga después de la carga
// inicial, no compite con el primer render.
const ExitIntentPopup = dynamic(() => import('@/components/ui/ExitIntentPopup').then((m) => m.ExitIntentPopup), { ssr: false })

// Header del modo enfocado (cotizador): solo el logo, sin menú ni links para
// irse a mitad de cotización. Mide lo mismo que el Header normal (h-16 + borde
// de 1 px = 65 px) a propósito: antes el header desaparecía del todo cuando el
// cotizador salta al paso de edades y todo el contenido subía 65 px de golpe.
// Con la zona detectada por IP pasa en cada visita a /comparador: CLS 0,284
// medido el 18-oct-2026 (Clarity venía marcando 0,35).
function HeaderEnfocado() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container">
        <div className="flex items-center h-16">
          <div className="flex items-center gap-2">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="18" cy="18" r="18" fill="#E8002D"/>
              <g transform="translate(18,18) skewX(-14) translate(-18,-18)">
                <rect x="10" y="7" width="6" height="22" fill="white"/>
                <path d="M15.5 7 H16 A9 9 0 0 1 16 25 H15.5 Z" fill="white"/>
                <path d="M16 11 A5 5 0 0 1 16 21 Z" fill="#E8002D"/>
              </g>
            </svg>
            <span className="font-bold text-xl text-gray-900">
              Prepaga<span className="text-[#E8002D]">Ya</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

function SiteChromeInner({ children, provincias }: { children: React.ReactNode; provincias: ProvinciaMenu[] }) {
  const { hideChrome: modoEnfocado } = useChromeVisibility()
  // /widget/*: páginas para insertar en otros sitios con un iframe (sala de
  // prensa) — van sin header, footer ni popups. /panel-leads: el panel
  // interno tiene su propia barra; con el header del sitio arriba quedaba
  // tapada en el celular, y la barra de abajo y el popup de salida sobran.
  // /en, /ru, /zh: silo para extranjeros (Darío, 29-sep-2026) — el header,
  // footer y bottom nav del sitio están en español y mandaban a /comparador
  // (también en español), rompiendo la experiencia. Cada página de este silo
  // ya tiene su propio CTA traducido (ContratarPlanButtonIntl) y sus propios
  // links cruzados entre idiomas, así que no queda ninguna sin salida.
  const ruta = usePathname() ?? ''
  const sinChrome = ruta.startsWith('/widget/') || ruta.startsWith('/panel-leads')
    || ruta.startsWith('/en/') || ruta.startsWith('/ru/') || ruta.startsWith('/zh/')
    // /empresas tiene su propio header y footer: antes el global llegaba en el
    // HTML y se escondía recién al hidratar, y la página saltaba (CLS).
    || ruta === '/empresas' || ruta.startsWith('/empresas/')
  const hideChrome = modoEnfocado || sinChrome
  return (
    <div className={`flex-1 flex flex-col ${hideChrome ? '' : 'pb-16 lg:pb-0'}`}>
      {!sinChrome && (modoEnfocado ? <HeaderEnfocado /> : <Header />)}
      <main className="flex-1">{children}</main>
      {!hideChrome && <Footer provincias={provincias} />}
      {!hideChrome && <BottomNav />}
      {!hideChrome && <ExitIntentPopup />}
    </div>
  )
}

// `provincias` viene del layout (server): así header y footer no importan
// lib/data/zonas.ts y el navegador no lo descarga en cada página.
export function SiteChrome({ children, provincias }: { children: React.ReactNode; provincias: ProvinciaMenu[] }) {
  return (
    <ChromeVisibilityProvider>
      <SiteChromeInner provincias={provincias}>{children}</SiteChromeInner>
    </ChromeVisibilityProvider>
  )
}
