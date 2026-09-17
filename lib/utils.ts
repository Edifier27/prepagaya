import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { NivelPrecio } from '@/lib/data/prepagas'
import type { Prepaga, Plan } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Calidad de cartilla a nivel plan: parte de calidadCartilla de la prepaga
// (red de prestadores) y se ajusta por plan — red cerrada y copago son las
// señales de una cartilla más acotada dentro de la misma prepaga.
export function calidadPlan(prep: Prepaga, plan: Plan): number {
  let score = prep.calidadCartilla
  if (!plan.redAbierta) score -= 1
  if (plan.copago) score -= 1
  return Math.max(1, Math.min(5, Math.round(score)))
}

export const NIVEL_PRECIO_LABEL: Record<NivelPrecio, { simbolo: string; label: string }> = {
  economico: { simbolo: '$', label: 'Económico' },
  medio: { simbolo: '$$', label: 'Precio medio' },
  premium: { simbolo: '$$$', label: 'Premium' },
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

// dateModified compartido entre sitemap.ts y el JSON-LD (schema Article) de
// cada plantilla de página (GEO, 17-sep-2026): la evidencia 2026 dice que
// las páginas con dateModified dentro de los últimos 90 días tienen
// prioridad en búsquedas sensibles al tiempo. Antes solo lo usaba el
// sitemap — ningún schema Article del sitio declaraba dateModified.
// PRECIOS_UPDATE: para páginas cuyo contenido depende del precio mensual
// (prepagas, planes, cambios recomendados) — rueda solo cada 1° del mes.
export const PRECIOS_UPDATE = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
// CONTENT_UPDATE: última revisión editorial del contenido estable
// (coberturas, condiciones, comparativas, obras sociales, perfiles).
export const CONTENT_UPDATE = new Date('2026-07-14').toISOString()

// priceValidUntil para los schema Offer/AggregateOffer de precios de planes
// (GEO, 17-sep-2026): a diferencia de dateModified, esta propiedad es la
// correcta según schema.org para señalar hasta cuándo vale un precio — más
// preciso que forzar dateModified en un schema Service/Offer, que no lo
// define. Fin del mes en curso, ya que los precios se actualizan recién al
// mes siguiente.
export const PRECIO_VALIDO_HASTA = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().slice(0, 10)

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

// ── WhatsApp hacia el lead (el asesor le escribe a quien dejó sus datos) ───
// Ya no existe la función inversa (visitante → asesor): pedido explícito de
// Darío, 9-sep-2026 — no quiere que el visitante lo contacte directo por
// WhatsApp después de dejar sus datos, solo recibir el lead por mail y
// contactarlo él cuando le convenga. Todos los formularios del sitio dejaron
// de redirigir a WhatsApp tras el envío.
// Los formularios piden el celular como "11 2345-6789" (código de área +
// número, sin 0 ni 15, sin código de país — así lo dice el placeholder en
// todos los forms). WhatsApp necesita 549 + área + número, solo dígitos.
export function normalizarCelularAR(raw: string): string {
  let digits = raw.replace(/\D/g, '')
  if (digits.startsWith('0')) digits = digits.slice(1)
  if (!digits.startsWith('54')) digits = `54${digits}`
  if (!digits.startsWith('549')) digits = `${digits.slice(0, 2)}9${digits.slice(2)}`
  return digits
}

/**
 * Filtro anti-"celular basura" para los formularios de lead (pedido de
 * Darío, 9-sep-2026). No puede confirmar que el número exista de verdad —
 * eso solo lo sabe un WhatsApp real — pero descarta los casos más obvios de
 * alguien tipeando cualquier cosa para pasar el formulario: muy corto/largo
 * para ser un número argentino, todos los dígitos iguales (1111111111) o una
 * secuencia ascendente/descendente (1234567890, 0987654321).
 */
export function esCelularArgentinoValido(raw: string): boolean {
  const digits = raw.replace(/\D/g, '')
  if (digits.length < 8 || digits.length > 13) return false
  if (/^(\d)\1+$/.test(digits)) return false
  // Secuencias clásicas de "número de prueba" — el chequeo de rachas de abajo
  // no las detecta solo porque el 9→0 corta la racha en términos de código
  // de carácter (57 → 48 no es +1), así que se buscan explícitas primero.
  const secuenciasFalsas = ['0123456789', '1234567890', '9876543210', '0987654321']
  if (secuenciasFalsas.some((s) => digits.includes(s))) return false
  let asc = true, desc = true
  for (let i = 1; i < digits.length; i++) {
    const diff = digits.charCodeAt(i) - digits.charCodeAt(i - 1)
    if (diff !== 1) asc = false
    if (diff !== -1) desc = false
  }
  return !asc && !desc
}

/**
 * Link de WhatsApp con mensaje pre-armado para que el asesor le escriba al
 * lead. Mensaje corto a propósito (pedido de Darío, 15-sep-2026: nada de
 * contexto de cotización ni promo, solo la apertura — el resto de la
 * conversación la lleva él a mano). Pensado para reenviarse tal cual, sin
 * editar.
 */
export function whatsappLinkParaLead(nombre: string, celular: string): string {
  const numero = normalizarCelularAR(celular)
  const mensaje = `Hola ${nombre}. Soy Dario de Swiss Medical. Te contacto por tu consulta.`
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`
}
