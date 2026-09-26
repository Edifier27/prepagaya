// Ciudades de /prepagas-en/[ciudad] que migraron a los hubs provinciales del
// silo (/prepagas/[provincia] y /prepagas/[provincia]/[localidad]). Lo usan
// las redirecciones 308 de next.config.ts y los links "Prepagas en otras
// ciudades" de /prepagas-en (que apuntaban a la URL vieja y pasaban por la
// redirección — auditoría 26-sep-2026). Solo ciudades cuya provincia ya
// tiene hub; el resto migra al expandir provincias (no redirigir a un 404).
export const CIUDADES_MIGRADAS: Record<string, string> = {
  'cordoba': '/prepagas/cordoba',
  'salta': '/prepagas/salta',
  'neuquen': '/prepagas/neuquen',
  'mendoza': '/prepagas/mendoza',
  'tucuman': '/prepagas/tucuman',
  'santa-fe': '/prepagas/santa-fe',
  'rosario': '/prepagas/santa-fe/rosario',
  'buenos-aires': '/prepagas/buenos-aires',
  'la-plata': '/prepagas/buenos-aires/la-plata',
  'mar-del-plata': '/prepagas/buenos-aires/mar-del-plata',
  'posadas': '/prepagas/misiones/posadas',
  'entre-rios': '/prepagas/entre-rios',
  'chaco': '/prepagas/chaco',
  'corrientes': '/prepagas/corrientes',
  'misiones': '/prepagas/misiones',
}
