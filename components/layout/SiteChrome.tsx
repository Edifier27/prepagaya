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

function SiteChromeInner({ children, provincias }: { children: React.ReactNode; provincias: ProvinciaMenu[] }) {
  const { hideChrome: modoEnfocado } = useChromeVisibility()
  // /widget/*: páginas para insertar en otros sitios con un iframe (sala de
  // prensa) — van sin header, footer ni popups. /panel-leads: el panel
  // interno tiene su propia barra; con el header del sitio arriba quedaba
  // tapada en el celular, y la barra de abajo y el popup de salida sobran.
  const ruta = usePathname() ?? ''
  const sinChrome = ruta.startsWith('/widget/') || ruta.startsWith('/panel-leads')
  const hideChrome = modoEnfocado || sinChrome
  return (
    <div className={`flex-1 flex flex-col ${hideChrome ? '' : 'pb-16 lg:pb-0'}`}>
      {!hideChrome && <Header provincias={provincias} />}
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
