'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Footer } from './Footer'
import { BottomNav } from './BottomNav'
import { ExitIntentPopup } from '@/components/ui/ExitIntentPopup'
import { ChromeVisibilityProvider, useChromeVisibility } from './ChromeVisibility'

function SiteChromeInner({ children }: { children: React.ReactNode }) {
  const { hideChrome: modoEnfocado } = useChromeVisibility()
  // /widget/*: páginas para insertar en otros sitios con un iframe (sala de
  // prensa) — van sin header, footer ni popups. /panel-leads: el panel
  // interno tiene su propia barra; con el header del sitio arriba quedaba
  // tapada en el celular, y la barra de abajo y el popup de salida sobran.
  const ruta = usePathname() ?? ''
  const sinChrome = ruta.startsWith('/widget/') || ruta.startsWith('/panel-leads')
  const hideChrome = modoEnfocado || sinChrome
  return (
    <div className={`flex-1 flex flex-col ${hideChrome ? '' : 'pb-16 md:pb-0'}`}>
      {!hideChrome && <Header />}
      <main className="flex-1">{children}</main>
      {!hideChrome && <Footer />}
      {!hideChrome && <BottomNav />}
      {!hideChrome && <ExitIntentPopup />}
    </div>
  )
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <ChromeVisibilityProvider>
      <SiteChromeInner>{children}</SiteChromeInner>
    </ChromeVisibilityProvider>
  )
}
