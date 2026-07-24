'use client'

import { createContext, useCallback, useContext, useState } from 'react'

interface ChromeCtx {
  hideChrome: boolean
  setHideChrome: (v: boolean) => void
}

const ChromeContext = createContext<ChromeCtx>({ hideChrome: false, setHideChrome: () => {} })

// Modo enfocado: cuando el cotizador avanza más allá de elegir la zona, el
// header/footer/bottom-nav se ocultan para que no haya forma de distraerse o
// irse de la cotización a mitad de camino. Lo activa ComparadorWizard.
export function ChromeVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [hideChrome, setHideChromeState] = useState(false)
  const setHideChrome = useCallback((v: boolean) => setHideChromeState(v), [])
  return <ChromeContext.Provider value={{ hideChrome, setHideChrome }}>{children}</ChromeContext.Provider>
}

export function useChromeVisibility() {
  return useContext(ChromeContext)
}
