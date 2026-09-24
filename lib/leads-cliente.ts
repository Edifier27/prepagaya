// Envío de leads desde las herramientas (Mis sanatorios, Chequeo, Match).
// Mismo camino que el cotizador: /api/leads, que valida, guarda y avisa.

/** "una persona de 35 años" / "un grupo de 3 personas (35, 33 y 5 años)": el
 *  formato del cotizador, que leen el mensaje de WhatsApp y el sondeo. */
export function resumenEdades(edades: number[]): string {
  if (edades.length === 0) return ''
  if (edades.length === 1) return `una persona de ${edades[0]} años`
  const lista = edades.length === 2 ? edades.join(' y ') : `${edades.slice(0, -1).join(', ')} y ${edades[edades.length - 1]}`
  return `un grupo de ${edades.length} personas (${lista} años)`
}

export interface LeadHerramienta {
  nombre: string
  celular: string
  email: string
  fuente: string
  provincia?: string
  edades?: number[]
  /** Lo que la persona vio o eligió, para el asesor ("Swiss Medical SMG20 · OSDE 310") */
  interes?: string
  prepagaActual?: string
  preferencias?: Record<string, string>
}

export async function enviarLead(l: LeadHerramienta): Promise<void> {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: l.nombre.trim(),
      celular: l.celular.trim(),
      email: l.email.trim(),
      fuente: l.fuente,
      provincia: l.provincia ?? '',
      personas: resumenEdades(l.edades ?? []),
      prepaga_interes: l.interes ?? '',
      ...(l.prepagaActual ? { prepaga_actual: l.prepagaActual } : {}),
      ...(l.preferencias ? { preferencias: l.preferencias } : {}),
    }),
  })
  if (!res.ok) throw new Error(`/api/leads respondió ${res.status}`)
}

/** Precios oficiales del grupo (motor de precios): { "prepaga/plan": total con IVA }. */
export async function preciosDelGrupo(zona: string, edades: number[]): Promise<Record<string, number>> {
  const res = await fetch('/api/precios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ zona, edades }),
  })
  if (!res.ok) return {}
  const data = await res.json().catch(() => null)
  return data?.precios ?? {}
}
