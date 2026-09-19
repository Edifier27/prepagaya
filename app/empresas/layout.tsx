'use client'

import { useEffect } from 'react'
import { useChromeVisibility } from '@/components/layout/ChromeVisibility'
import { EmpresasHeader } from '@/components/empresas/EmpresasHeader'
import { EmpresasFooter } from '@/components/empresas/EmpresasFooter'

// Todo el silo /empresas tiene identidad visual propia (oscura, sin rojo)
// para diferenciarse del comparador de consumo masivo — pedido explícito de
// Darío, 17-9-2026: "quiero que esa página sea totalmente diferente a
// PrepagaYa". Oculta el Header/Footer/BottomNav globales (mismo mecanismo
// que usa ComparadorWizard en modo enfocado) y monta los propios.
export default function EmpresasLayout({ children }: { children: React.ReactNode }) {
  const { setHideChrome } = useChromeVisibility()
  useEffect(() => {
    setHideChrome(true)
    return () => setHideChrome(false)
  }, [setHideChrome])

  return (
    <div className="bg-[#0A0B0D] min-h-screen flex flex-col">
      <EmpresasHeader />
      <main className="flex-1">{children}</main>
      <EmpresasFooter />
    </div>
  )
}
