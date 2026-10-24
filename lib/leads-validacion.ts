// Controles del lado del servidor para /api/leads (21-oct-2026, auditoría de
// seguridad): el endpoint es público y antes no tenía ningún freno. El límite
// por IP lo pone el firewall de Vercel (regla para POST /api/leads); acá van
// el campo trampa, los largos máximos y las fuentes de prueba.

/** Nombre del campo trampa: los formularios lo mandan vacío. Un bot que llena
 *  todos los campos lo completa y su lead se descarta sin avisarle. */
export const CAMPO_TRAMPA = 'pya_confirmacion'

/** Largos máximos por campo (holgados: el texto más largo legítimo es el
 *  "interés" del cotizador, ~120 caracteres). */
export const LARGO_MAXIMO = {
  nombre: 100,
  email: 150,
  celular: 40,
  prepaga: 500,
  fuente: 60,
  fecha: 60,
  provincia: 80,
  personas: 200,
  pais: 60,
  origen: 40,
} as const

/** Primer campo que se pasa del máximo, o null si todo está en rango. */
export function campoDemasiadoLargo(campos: Partial<Record<keyof typeof LARGO_MAXIMO, string>>): string | null {
  for (const [campo, valor] of Object.entries(campos)) {
    if (valor && valor.length > LARGO_MAXIMO[campo as keyof typeof LARGO_MAXIMO]) return campo
  }
  return null
}

/** El celular, si viene, tiene que tener entre 6 y 20 dígitos (los de /en,
 *  /ru y /zh traen código de país). */
export function celularPlausible(celular: string): boolean {
  if (!celular) return true
  const digitos = celular.replace(/\D/g, '').length
  return digitos >= 6 && digitos <= 20
}

/** Las fuentes "prueba-…" (cupo de mail, conexión con el CRM) se aceptan solo
 *  con el secreto del cron en el header. Sin él, cualquiera podía mandar
 *  "prueba-cupo-mail" ilimitados, que van al mail sin gastar cupo. */
export function pruebaAutorizada(authorization: string | null): boolean {
  const secreto = process.env.CRON_SECRET ?? ''
  return Boolean(secreto) && authorization === `Bearer ${secreto}`
}
