import { useMemo, useSyncExternalStore } from 'react'
import { COOKIE_ZONA_GEO, type ZonaDetectada } from './geo-zonas'
import { PROVINCIAS, type Provincia } from './data/provincias-cotizador'

// Zona aproximada de la persona (cookie de middleware.ts, por la IP) para
// precargar "Dónde vivís" en las herramientas, igual que hace el cotizador
// (pedido de Darío, 25-sep-2026). Solo precarga: la persona siempre la puede
// cambiar. Con useSyncExternalStore el HTML del servidor sale sin zona y el
// navegador la toma después, sin avisos de hidratación.

export interface ZonaParaHerramientas {
  provincia: Provincia
  /** Texto para mostrar, ej. "Banfield (GBA Sur)" */
  label: string
}

const sinSuscripcion = () => () => {}
const leerCookie = () => document.cookie.match(new RegExp(`(?:^|; )${COOKIE_ZONA_GEO}=([^;]*)`))?.[1] ?? ''

/** Provincia del cotizador para una zona detectada (el interior bonaerense tiene opción propia). */
export function provinciaDeZona(geo: ZonaDetectada): Provincia | undefined {
  const slug = geo.wizardSlug === 'buenos-aires' && geo.label.includes('Interior de Buenos Aires') ? 'buenos-aires-interior' : geo.wizardSlug
  return PROVINCIAS.find((p) => p.slug === slug)
}

export function useZonaDetectada(): ZonaParaHerramientas | null {
  const crudo = useSyncExternalStore(sinSuscripcion, leerCookie, () => '')
  return useMemo(() => {
    if (!crudo) return null
    try {
      const geo = JSON.parse(decodeURIComponent(crudo)) as ZonaDetectada
      const provincia = provinciaDeZona(geo)
      return provincia ? { provincia, label: geo.label } : null
    } catch {
      return null
    }
  }, [crudo])
}
