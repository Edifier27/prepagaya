// Leads de personas mayores (Darío, 27-oct-2026): hasta los 66 años entran
// al CRM como siempre; con alguien de 67 o más el lead no se manda (ni CRM,
// ni mail, ni portal: nadie le escribe) y queda en la solapa "Mayores de 66
// años" del panel. Sin dependencias de servidor: lo usan el envío
// (lib/procesar-leads-kommo.ts) y el panel.

/** Edad máxima con la que un lead va al CRM */
export const EDAD_MAX_CRM = 66

/** kommo_estado de los leads que no se mandan por la edad */
export const ESTADO_MAYOR_66 = 'Mayor de 66: no se envía'

/**
 * La edad más alta escrita en el campo de integrantes, o null si no hay.
 * Llega en varios formatos: "una persona de 34 años", "un grupo de 3
 * personas (35, 33 y 5 años)", "2 personas de 31 años", "35, 33, 5". Los
 * otros números que aparecen (cantidad de personas o de hijos) son chicos y
 * no cambian el máximo.
 */
export function edadMaximaLead(edades: string | null | undefined): number | null {
  const numeros = (edades ?? '').match(/\d{1,3}/g)?.map(Number).filter((n) => n <= 120) ?? []
  return numeros.length ? Math.max(...numeros) : null
}

/** ¿Hay alguien de más de 66 años en el lead? */
export function esLeadMayor(edades: string | null | undefined): boolean {
  const max = edadMaximaLead(edades)
  return max !== null && max > EDAD_MAX_CRM
}
