// ¿Mostrar el "15% OFF" del menú en esta página? (Darío, 25-oct-2026): la
// promo es de Swiss Medical, así que en las páginas de las otras prepagas
// (/prepagas/osde, /prepagas/sancor-salud/plan-1000…) no aparece. Lista
// corta a mano para no cargar lib/data/prepagas.ts en el menú, que está en
// todas las páginas: si se suma una prepaga, agregarla acá.
const OTRAS_PREPAGAS = ['osde', 'cemic', 'sancor-salud', 'premedic', 'medife', 'omint', 'medicus', 'avalian', 'prevencion-salud',
  'hospital-italiano', 'federada-salud', 'hominis', 'galeno', 'luis-pasteur']

export function promoEnRuta(pathname: string | null): boolean {
  const slug = pathname?.match(/^\/prepagas\/([^/?#]+)/)?.[1]
  return !slug || !OTRAS_PREPAGAS.includes(slug)
}
