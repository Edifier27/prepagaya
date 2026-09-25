import type { Metadata } from 'next'
import { WidgetCalculadoraAportes } from '@/components/herramientas/WidgetCalculadoraAportes'
import { prepagasCotizables } from '@/lib/data/planes-cotizables'
import { PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { SITE_URL } from '@/lib/utils'

// Widget embebible de la calculadora de aportes (25-sep-2026), para estudios
// contables, blogs de RRHH y medios. El código para copiar está en
// /calculadora-aportes e incluye, fuera del iframe, el link con la marca.
// noindex: es una vista para iframe, la página indexable es /calculadora-aportes.
export const metadata: Metadata = {
  title: 'Widget: calculadora de aportes a prepaga',
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/calculadora-aportes` },
}

export default function WidgetCalculadoraAportesPage() {
  return <WidgetCalculadoraAportes prepagas={prepagasCotizables()} mes={PRECIO_ACTUALIZADO.toLowerCase()} />
}
