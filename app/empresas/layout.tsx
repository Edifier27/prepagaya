import { EmpresasHeader } from '@/components/empresas/EmpresasHeader'
import { EmpresasFooter } from '@/components/empresas/EmpresasFooter'

// Todo el silo /empresas tiene identidad visual propia (oscura, sin rojo)
// para diferenciarse del comparador de consumo masivo — pedido explícito de
// Darío, 17-9-2026: "quiero que esa página sea totalmente diferente a
// PrepagaYa". SiteChrome no dibuja el Header/Footer/BottomNav globales en /empresas (desde el
// servidor, para que la página no salte al hidratar) y acá se montan los propios.
export default function EmpresasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#0A0B0D] min-h-screen flex flex-col">
      <EmpresasHeader />
      <main className="flex-1">{children}</main>
      <EmpresasFooter />
    </div>
  )
}
