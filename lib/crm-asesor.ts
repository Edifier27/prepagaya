import type { LeadRow } from '@/lib/db'

// Conexión con el CRM Asesor (pedido de Darío, 3-oct-2026): destino opcional
// "CRM Asesor" en /panel-leads, en etapa de prueba. Mientras no se elija ese
// destino, nada de esto se ejecuta y los leads siguen yendo a Kommo.
//
// Variables (Vercel, proyecto prepagaya):
//   CRM_ASESOR_URL      ej.: https://crm-asesor.vercel.app/api/leads
//   CRM_ASESOR_API_KEY  la misma que LEADS_API_KEY del CRM
//   CRM_ASESOR_BYPASS   (opcional) "Protection Bypass for Automation" del proyecto
//                       crm-asesor, mientras use la URL .vercel.app protegida
const URL_CRM = process.env.CRM_ASESOR_URL ?? ''
const CLAVE = process.env.CRM_ASESOR_API_KEY ?? ''
const BYPASS = process.env.CRM_ASESOR_BYPASS ?? ''

export const crmAsesorConfigurado = () => Boolean(URL_CRM && CLAVE)

/** Manda un lead ya consolidado (el mismo que iría a Kommo) al CRM Asesor. */
export async function mandarLeadACrmAsesor(lead: LeadRow): Promise<{ ok: boolean; error?: string }> {
  if (!crmAsesorConfigurado()) return { ok: false, error: 'Falta CRM_ASESOR_URL o CRM_ASESOR_API_KEY en el servidor.' }

  const cuerpo = {
    nombre: lead.nombre,
    telefono: lead.celular ?? '',
    email: lead.email ?? '',
    // La provincia la eligió la persona en el cotizador (confiable); la zona
    // detectada es por IP (aproximada) y el CRM se la hace confirmar al lead.
    provincia: lead.provincia ?? '',
    zona_detectada: lead.zona_detectada ?? '',
    edades: lead.edades ?? '',
    situacion_laboral: lead.situacion_laboral ?? '',
    prepaga_interes: lead.prepaga ?? '',
    presupuesto: lead.presupuesto ?? '',
    origen: 'web',
    origen_detalle: `PrepagaYa · ${lead.fuente ?? 'web'}`,
  }

  try {
    const res = await fetch(URL_CRM, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAVE,
        ...(BYPASS ? { 'x-vercel-protection-bypass': BYPASS } : {}),
      },
      body: JSON.stringify(cuerpo),
      signal: AbortSignal.timeout(15_000),
    })
    if (res.ok) return { ok: true }
    const detalle = await res.text().catch(() => '')
    return { ok: false, error: `HTTP ${res.status} ${detalle.slice(0, 200)}` }
  } catch (err) {
    return { ok: false, error: String(err) }
  }
}
