// "[prepaga] [ciudad]" (27-nov-2026): las páginas marca × provincia y marca ×
// localidad suman 161.748 impresiones con CTR 0,62% (Search Console al
// 22-nov). 60.000 son la marca y la ciudad solas ("osde rosario") y, cuando
// se agrega algo, casi siempre es "teléfono": se busca la sucursal. El título
// arranca como se busca y promete lo que la página muestra (dirección,
// horario y teléfono oficiales). Solo las prepagas con las que trabajamos;
// el resto queda igual y sirve de control para medir.
import { formatPrecio } from '@/lib/utils'
import { contactos } from '@/lib/data/contactos'
import type { Sucursal } from '@/lib/data/sucursales'

export const PREPAGAS_MARCA_LUGAR = ['swiss-medical', 'osde', 'sancor-salud', 'avalian', 'premedic']

/** "San Lorenzo 1141 - Rosario - Santa Fe" → "San Lorenzo 1141" cuando el resto repite la localidad. */
export function direccionCorta(s: Sucursal): string {
  const partes = s.direccion.split(' - ').map((x) => x.trim())
  return partes.length > 1 && s.localidad && partes.slice(1).some((p) => p.toLowerCase() === s.localidad!.toLowerCase()) ? partes[0] : s.direccion
}

/** Teléfono de atención al socio que publica la prepaga (lib/data/contactos.ts) */
export function telefonoAtencion(prepagaSlug: string): string | null {
  return contactos[prepagaSlug]?.canales.find((c) => c.tipo === 'socios')?.valor ?? null
}

export function metaMarcaLugar(o: { slug: string; marca: string; lugar: string; sucursales: Sucursal[]; precioDesde: number | null; mes: string }): { title: string; description: string } | null {
  if (!PREPAGAS_MARCA_LUGAR.includes(o.slug)) return null
  const tel = telefonoAtencion(o.slug)
  if (!tel) return null
  const { marca, lugar, sucursales: suc } = o
  const planes = o.precioDesde ? `Planes desde ${formatPrecio(o.precioDesde)}/mes (${o.mes})` : `Planes y precios (${o.mes})`
  if (suc.length) {
    const primera = suc[0]
    const title = suc.length === 1
      ? `${marca} ${lugar}: sucursal en ${direccionCorta(primera)}, horario y teléfono`
      : `${marca} ${lugar}: ${suc.length} sucursales, horarios y teléfono`
    const dirs = suc.slice(0, 2).map(direccionCorta).join(' y ')
    const description = `${suc.length === 1 ? 'Sucursal' : 'Sucursales'} de ${marca} en ${lugar}: ${dirs}${suc.length === 1 && primera.horario ? ` (${primera.horario.replace(/\.$/, '')})` : ''}. Teléfono de atención: ${tel}. ${planes} y cotización online gratis.`
    return { title, description }
  }
  return {
    title: o.precioDesde
      ? `${marca} ${lugar}: teléfono y planes desde ${formatPrecio(o.precioDesde)}/mes`
      : `${marca} ${lugar}: teléfono, planes y precios`,
    description: `Teléfono de atención de ${marca}: ${tel}. ${planes} en ${lugar}, cobertura en la zona y cotización online gratis.`,
  }
}
