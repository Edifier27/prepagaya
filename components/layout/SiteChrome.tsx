'use client'

import { Header } from './Header'
import { Footer } from './Footer'
import { BottomNav } from './BottomNav'
import { ExitIntentPopup } from '@/components/ui/ExitIntentPopup'
import { ChromeVisibilityProvider, useChromeVisibility } from './ChromeVisibility'

function SiteChromeInner({ children }: { children: React.ReactNode }) {
  const { hideChrome } = useChromeVisibility()
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
