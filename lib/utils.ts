import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrecio(precio: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(precio)
}

export function renderStars(rating: number): string {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const SITE_NAME = 'PrepagaYa'
export const SITE_URL = 'https://www.prepagaya.com.ar'
export const SITE_DESCRIPTION =
  'Compará prepagas en Argentina. Precios actualizados, opiniones reales y el comparador más completo para elegir la mejor prepaga para vos.'

// Sistema de precios: Argentina tiene 2 listas de precios desregulados
// - Directo con IVA (21%): para monotributistas y particulares
// - Deriva Aporte (sin IVA): para empleados en relación de dependencia
//   que derivan sus contribuciones de obra social a la prepaga
export const IVA_PREPAGA = 0.21

/** Precio para empleados en relación de dependencia (sin IVA 21%) */
export function precioDeriva(precioDirecto: number): number {
  return Math.round(precioDirecto / (1 + IVA_PREPAGA))
}

/** Diferencia mensual entre modalidades (ahorro al derivar aporte) */
export function ahorroDeriva(precioDirecto: number): number {
  return precioDirecto - precioDeriva(precioDirecto)
}
