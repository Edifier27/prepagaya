// Envío de mail de lead vía EmailJS — pedido de Darío, 22-sep-2026 (fallback
// si Kommo falla) y extendido el 29-sep-2026 para el modo "Otro mail" del
// panel (destino de leads nuevos que no es ninguna de las dos cuentas de
// Kommo). Antes vivía solo dentro de app/api/cron/procesar-leads-kommo — se
// separa acá para que ambos casos usen el mismo código.
//
// Server-only a propósito: no importar desde un componente 'use client'.
import { whatsappLinkParaLead } from './utils'

const EMAILJS_SERVICE_ID  = process.env.EMAILJS_SERVICE_ID  ?? 'PREPAGAYA'
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID ?? 'template_8p5ihaj'
const EMAILJS_PUBLIC_KEY  = process.env.EMAILJS_PUBLIC_KEY  ?? 'lVlSZHupNk1R5ZDES'
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY ?? ''

export function bannerDuplicado(cuenta: string): string {
  return `<tr><td style="padding:16px 32px 0 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FEF3C7;border:1px solid #FDE68A;border-radius:12px;"><tr><td style="padding:14px 18px;"><span style="display:block;font-size:13px;font-weight:700;color:#92400E;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">⚠️ Ya es un contacto en Kommo (cuenta de ${cuenta})</span><span style="display:block;font-size:12px;color:#92400E;margin-top:4px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">Puede que ya lo hayas contactado antes — revisá el historial en Kommo antes de escribirle de nuevo.</span></td></tr></table></td></tr>`
}

export interface LeadParaEmail {
  nombre: string; celular: string; email: string; prepaga: string
  provincia: string; edades: string; fuente: string; fecha: string
  kommo_link: string; kommo_label: string; duplicado_banner: string
  /** A quién llega el mail. Sin esto, EmailJS usa el "To Email" fijo que
   *  tenga configurado la plantilla — hace falta que la plantilla tenga ese
   *  campo armado con la variable {{to_email}} para que esto funcione. */
  to?: string
}

export async function mandarLeadPorEmail(d: LeadParaEmail): Promise<void> {
  if (!EMAILJS_PRIVATE_KEY) {
    console.error('[EMAILJS] Falta EMAILJS_PRIVATE_KEY — EmailJS va a rechazar el envío (modo estricto).')
  }
  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id:  EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id:     EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PRIVATE_KEY,
        template_params: {
          name:      d.nombre,
          email:     d.email.toLowerCase(),
          celular:   d.celular || 'No informado',
          prepaga:   d.prepaga || 'No especificada',
          zona:      d.provincia || 'No especificada',
          edades:    d.edades || 'No especificado',
          fuente:    d.fuente,
          fecha:     d.fecha,
          whatsapp_link: d.celular ? whatsappLinkParaLead(d.nombre, d.celular) : '',
          kommo_link: d.kommo_link,
          kommo_label: d.kommo_label,
          duplicado_banner: d.duplicado_banner,
          ...(d.to ? { to_email: d.to } : {}),
        },
      }),
    })
    if (!res.ok) console.error('[EMAILJS] error:', res.status, await res.text().catch(() => ''))
  } catch (err) {
    console.error('[EMAILJS] fetch error:', err)
  }
}
