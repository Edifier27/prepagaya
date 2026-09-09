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

// ── WhatsApp de asesoramiento ───────────────────────────────────────────────
// El número real del asesor vive solo server-side (app/api/wa/route.ts) — acá
// solo se arma la URL al redirect propio, nunca el link wa.me directo, para
// que el celular no quede expuesto en el bundle de cliente (pedido explícito
// de Darío, 8-sep-2026: "no puede estar mi cel por ningún lado").
export function whatsappLink(mensaje: string): string {
  return `/api/wa?m=${encodeURIComponent(mensaje)}`
}

// ── WhatsApp hacia el lead (el asesor le escribe a quien dejó sus datos) ───
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
 * Link de WhatsApp con mensaje pre-armado para que el asesor le escriba al
 * lead. Cuando hay zona/edad (las manda el wizard del comparador — los
 * formularios más simples como AsesoramientoPopup no las piden), el mensaje
 * se arma como confirmación comercial directa ("cotizaste X para Y en Z,
 * ¿es correcto?"), pensado para reenviarse tal cual sin editar. Sin ese
 * contexto, cae al mensaje genérico de siempre.
 */
export function whatsappLinkParaLead(nombre: string, celular: string, interes: string, zona?: string, edad?: string): string {
  const numero = normalizarCelularAR(celular)
  const primerNombre = nombre.trim().split(' ')[0] || nombre.trim()
  const contexto = [edad, zona].filter(Boolean).join(' en ')
  const mensaje = contexto
    ? `¡Hola ${primerNombre}! Soy Darío de PrepagaYa 👋. Cotizaste ${interes || 'un plan'} en la web para ${contexto}. ¿Es correcto? Contame y te paso el precio exacto.`
    : `¡Hola ${primerNombre}! Soy Darío de PrepagaYa 👋. Recibí tu consulta sobre: ${interes || 'tu cotización'}. ¿Tenés 2 minutos para que te pase el precio exacto para tu perfil?`
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`
}
