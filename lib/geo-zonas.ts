// Detección de zona por geolocalización de IP (headers que agrega Vercel Edge
// Network en cada request: x-vercel-ip-country-region, x-vercel-ip-city).
// Uso exclusivamente para mostrar un banner informativo y precargar el campo
// de zona del cotizador — nunca para recomendar un plan puntual: no tenemos
// cartilla verificada localidad por localidad, solo por provincia/zona de GBA.
//
// Los códigos de región son ISO 3166-2:AR, pero Vercel los manda SIN el
// prefijo de país en x-vercel-ip-country-region (ej. "B", no "AR-B" —
// confirmado con /api/debug-geo contra un visitante real en Tandil, que
// devolvió region: "B"). Se normaliza por las dudas de que algún edge
// location mande el prefijo completo.
// La subdivisión de partidos del GBA en Norte/Sur/Oeste es geografía pública
// conocida (no es un dato de cobertura de salud que haya que verificar).

export interface ZonaDetectada {
  /** Texto para el banner, ej. "Banfield (GBA Sur)" */
  label: string
  /** Coincide con PROVINCIAS[].slug del wizard, para autocompletar */
  wizardSlug: string
  /** Coincide con provinciasSEO[].slug cuando la provincia tiene silo propio */
  provinciaSEOSlug?: string
  /** slug de provinciasSEO[].localidades[] cuando existe página propia de esa localidad */
  localidadSlug?: string
}

const REGION_A_PROVINCIA: Record<string, { nombre: string; wizardSlug: string; provinciaSEOSlug?: string }> = {
  C: { nombre: 'CABA', wizardSlug: 'caba', provinciaSEOSlug: 'caba' },
  B: { nombre: 'Buenos Aires', wizardSlug: 'buenos-aires', provinciaSEOSlug: 'buenos-aires' },
  X: { nombre: 'Córdoba', wizardSlug: 'cordoba', provinciaSEOSlug: 'cordoba' },
  S: { nombre: 'Santa Fe', wizardSlug: 'santa-fe', provinciaSEOSlug: 'santa-fe' },
  M: { nombre: 'Mendoza', wizardSlug: 'mendoza', provinciaSEOSlug: 'mendoza' },
  T: { nombre: 'Tucumán', wizardSlug: 'tucuman', provinciaSEOSlug: 'tucuman' },
  A: { nombre: 'Salta', wizardSlug: 'salta', provinciaSEOSlug: 'salta' },
  Q: { nombre: 'Neuquén', wizardSlug: 'neuquen', provinciaSEOSlug: 'neuquen' },
  E: { nombre: 'Entre Ríos', wizardSlug: 'entre-rios', provinciaSEOSlug: 'entre-rios' },
  N: { nombre: 'Misiones', wizardSlug: 'misiones', provinciaSEOSlug: 'misiones' },
  H: { nombre: 'Chaco', wizardSlug: 'chaco' },
  W: { nombre: 'Corrientes', wizardSlug: 'corrientes' },
  R: { nombre: 'Río Negro', wizardSlug: 'rio-negro' },
  Y: { nombre: 'Jujuy', wizardSlug: 'jujuy' },
}

// Partidos/localidades del GBA por zona, mapeados al slug real de
// provinciasSEO['buenos-aires'].localidades[] (lib/data/zonas.ts) cuando
// existe página propia — geografía pública, no dato de salud.
interface LocalidadMatch { subzona: string; localidadSlug: string }
const GBA_SUR: [string, LocalidadMatch][] = [
  ['banfield', { subzona: 'GBA Sur', localidadSlug: 'banfield' }],
  ['temperley', { subzona: 'GBA Sur', localidadSlug: 'temperley' }],
  ['lomas de zamora', { subzona: 'GBA Sur', localidadSlug: 'lomas-de-zamora' }],
  ['turdera', { subzona: 'GBA Sur', localidadSlug: 'lomas-de-zamora' }],
  ['llavallol', { subzona: 'GBA Sur', localidadSlug: 'lomas-de-zamora' }],
  ['quilmes', { subzona: 'GBA Sur', localidadSlug: 'quilmes' }],
  ['berazategui', { subzona: 'GBA Sur', localidadSlug: 'berazategui' }],
  ['florencio varela', { subzona: 'GBA Sur', localidadSlug: 'florencio-varela' }],
  ['adrogue', { subzona: 'GBA Sur', localidadSlug: 'adrogue' }],
  ['adrogué', { subzona: 'GBA Sur', localidadSlug: 'adrogue' }],
  ['burzaco', { subzona: 'GBA Sur', localidadSlug: 'adrogue' }],
  ['rafael calzada', { subzona: 'GBA Sur', localidadSlug: 'adrogue' }],
  ['monte grande', { subzona: 'GBA Sur', localidadSlug: 'monte-grande' }],
  ['luis guillon', { subzona: 'GBA Sur', localidadSlug: 'monte-grande' }],
  ['glew', { subzona: 'GBA Sur', localidadSlug: 'monte-grande' }],
  ['longchamps', { subzona: 'GBA Sur', localidadSlug: 'monte-grande' }],
  ['ezeiza', { subzona: 'GBA Sur', localidadSlug: 'monte-grande' }],
  ['avellaneda', { subzona: 'GBA Sur', localidadSlug: 'avellaneda-lanus' }],
  ['lanus', { subzona: 'GBA Sur', localidadSlug: 'avellaneda-lanus' }],
  ['lanús', { subzona: 'GBA Sur', localidadSlug: 'avellaneda-lanus' }],
  ['dock sud', { subzona: 'GBA Sur', localidadSlug: 'avellaneda-lanus' }],
  ['sarandi', { subzona: 'GBA Sur', localidadSlug: 'avellaneda-lanus' }],
  ['sarandí', { subzona: 'GBA Sur', localidadSlug: 'avellaneda-lanus' }],
  ['wilde', { subzona: 'GBA Sur', localidadSlug: 'avellaneda-lanus' }],
  ['gerli', { subzona: 'GBA Sur', localidadSlug: 'avellaneda-lanus' }],
  ['valentin alsina', { subzona: 'GBA Sur', localidadSlug: 'avellaneda-lanus' }],
  ['remedios de escalada', { subzona: 'GBA Sur', localidadSlug: 'avellaneda-lanus' }],
]
const GBA_NORTE: [string, LocalidadMatch][] = [
  ['san isidro', { subzona: 'GBA Norte', localidadSlug: 'san-isidro' }],
  ['acassuso', { subzona: 'GBA Norte', localidadSlug: 'san-isidro' }],
  ['beccar', { subzona: 'GBA Norte', localidadSlug: 'san-isidro' }],
  ['boulogne', { subzona: 'GBA Norte', localidadSlug: 'san-isidro' }],
  ['victoria', { subzona: 'GBA Norte', localidadSlug: 'san-isidro' }],
  ['vicente lopez', { subzona: 'GBA Norte', localidadSlug: 'vicente-lopez' }],
  ['vicente lópez', { subzona: 'GBA Norte', localidadSlug: 'vicente-lopez' }],
  ['olivos', { subzona: 'GBA Norte', localidadSlug: 'vicente-lopez' }],
  ['martinez', { subzona: 'GBA Norte', localidadSlug: 'vicente-lopez' }],
  ['martínez', { subzona: 'GBA Norte', localidadSlug: 'vicente-lopez' }],
  ['florida', { subzona: 'GBA Norte', localidadSlug: 'vicente-lopez' }],
  ['san fernando', { subzona: 'GBA Norte', localidadSlug: 'tigre-san-fernando' }],
  ['tigre', { subzona: 'GBA Norte', localidadSlug: 'tigre-san-fernando' }],
  ['don torcuato', { subzona: 'GBA Norte', localidadSlug: 'tigre-san-fernando' }],
  ['general pacheco', { subzona: 'GBA Norte', localidadSlug: 'tigre-san-fernando' }],
  ['pilar', { subzona: 'GBA Norte', localidadSlug: 'pilar' }],
  ['garin', { subzona: 'GBA Norte', localidadSlug: 'pilar' }],
  ['garín', { subzona: 'GBA Norte', localidadSlug: 'pilar' }],
  ['san miguel', { subzona: 'GBA Norte', localidadSlug: 'san-miguel' }],
  ['malvinas argentinas', { subzona: 'GBA Norte', localidadSlug: 'san-miguel' }],
  ['jose c paz', { subzona: 'GBA Norte', localidadSlug: 'san-miguel' }],
  ['los polvorines', { subzona: 'GBA Norte', localidadSlug: 'san-miguel' }],
  ['escobar', { subzona: 'GBA Norte', localidadSlug: 'escobar' }],
]
const GBA_OESTE: [string, LocalidadMatch][] = [
  ['moron', { subzona: 'GBA Oeste', localidadSlug: 'moron' }],
  ['morón', { subzona: 'GBA Oeste', localidadSlug: 'moron' }],
  ['castelar', { subzona: 'GBA Oeste', localidadSlug: 'moron' }],
  ['haedo', { subzona: 'GBA Oeste', localidadSlug: 'moron' }],
  ['el palomar', { subzona: 'GBA Oeste', localidadSlug: 'moron' }],
  ['ituzaingo', { subzona: 'GBA Oeste', localidadSlug: 'ituzaingo-merlo' }],
  ['ituzaingó', { subzona: 'GBA Oeste', localidadSlug: 'ituzaingo-merlo' }],
  ['hurlingham', { subzona: 'GBA Oeste', localidadSlug: 'ituzaingo-merlo' }],
  ['merlo', { subzona: 'GBA Oeste', localidadSlug: 'ituzaingo-merlo' }],
  ['ramos mejia', { subzona: 'GBA Oeste', localidadSlug: 'ramos-mejia-san-justo' }],
  ['ramos mejía', { subzona: 'GBA Oeste', localidadSlug: 'ramos-mejia-san-justo' }],
  ['san justo', { subzona: 'GBA Oeste', localidadSlug: 'ramos-mejia-san-justo' }],
  ['ciudadela', { subzona: 'GBA Oeste', localidadSlug: 'ramos-mejia-san-justo' }],
  ['isidro casanova', { subzona: 'GBA Oeste', localidadSlug: 'isidro-casanova' }],
  ['gonzalez catan', { subzona: 'GBA Oeste', localidadSlug: 'isidro-casanova' }],
  ['gonzález catán', { subzona: 'GBA Oeste', localidadSlug: 'isidro-casanova' }],
  ['laferrere', { subzona: 'GBA Oeste', localidadSlug: 'isidro-casanova' }],
]
// Interior/costa bonaerense con página propia (no es GBA, pero comparte
// provincia — sin subzona en el label).
const BUENOS_AIRES_INTERIOR: [string, string][] = [
  ['la plata', 'la-plata'],
  ['mar del plata', 'mar-del-plata'],
  ['bahia blanca', 'bahia-blanca'],
  ['bahía blanca', 'bahia-blanca'],
  ['tandil', 'tandil'],
  ['azul', 'azul'],
]
// Barrios de CABA con página propia.
const CABA_BARRIOS: [string, string][] = [
  ['recoleta', 'recoleta-barrio-norte'],
  ['barrio norte', 'recoleta-barrio-norte'],
  ['palermo', 'palermo'],
  ['belgrano', 'belgrano'],
  ['caballito', 'caballito'],
  ['villa devoto', 'villa-devoto'],
  ['flores', 'flores'],
]

function matchLocalidad(lista: [string, LocalidadMatch][], ciudad: string): LocalidadMatch | null {
  const c = ciudad.toLowerCase().trim()
  const hit = lista.find(([nombre]) => c.includes(nombre))
  return hit ? hit[1] : null
}
function matchSlugSimple(lista: [string, string][], ciudad: string): string | null {
  const c = ciudad.toLowerCase().trim()
  const hit = lista.find(([nombre]) => c.includes(nombre))
  return hit ? hit[1] : null
}

// A partir de los headers de geolocalización que manda Vercel Edge Network.
export function detectarZona(countryRegion: string | null, ciudad: string | null): ZonaDetectada | null {
  if (!countryRegion) return null
  const codigo = countryRegion.toUpperCase().replace(/^AR-/, '')
  const prov = REGION_A_PROVINCIA[codigo]
  if (!prov) return null

  const ciudadLimpia = ciudad ? decodeURIComponent(ciudad).trim() : null

  if (prov.wizardSlug === 'buenos-aires' && ciudadLimpia) {
    const match = matchLocalidad(GBA_SUR, ciudadLimpia) ?? matchLocalidad(GBA_NORTE, ciudadLimpia) ?? matchLocalidad(GBA_OESTE, ciudadLimpia)
    if (match) {
      return { label: `${ciudadLimpia} (${match.subzona})`, wizardSlug: 'buenos-aires', provinciaSEOSlug: 'buenos-aires', localidadSlug: match.localidadSlug }
    }
    const interior = matchSlugSimple(BUENOS_AIRES_INTERIOR, ciudadLimpia)
    if (interior) {
      return { label: `${ciudadLimpia} (Interior de Buenos Aires)`, wizardSlug: 'buenos-aires', provinciaSEOSlug: 'buenos-aires', localidadSlug: interior }
    }
    // Ni GBA ni una de las ciudades con página propia (La Plata, Mar del
    // Plata, Bahía Blanca): sigue siendo "interior" en el sentido de "no
    // GBA", aunque no tengamos página específica de esa localidad.
    return { label: `${ciudadLimpia} (Interior de Buenos Aires)`, wizardSlug: 'buenos-aires', provinciaSEOSlug: 'buenos-aires' }
  }

  if (prov.wizardSlug === 'caba' && ciudadLimpia) {
    const barrio = matchSlugSimple(CABA_BARRIOS, ciudadLimpia)
    if (barrio) {
      return { label: `${ciudadLimpia} (CABA)`, wizardSlug: 'caba', provinciaSEOSlug: 'caba', localidadSlug: barrio }
    }
  }

  if (ciudadLimpia && ciudadLimpia.toLowerCase() !== prov.nombre.toLowerCase()) {
    return { label: `${ciudadLimpia} (${prov.nombre})`, wizardSlug: prov.wizardSlug, provinciaSEOSlug: prov.provinciaSEOSlug }
  }
  return { label: prov.nombre, wizardSlug: prov.wizardSlug, provinciaSEOSlug: prov.provinciaSEOSlug }
}

// Cookie que deja middleware.ts con el resultado de detectarZona(). Se lee
// del lado del cliente (nunca en Server Components) para que las páginas
// que la usan puedan seguir siendo 100% estáticas — la personalización se
// aplica después de la hidratación, no en el render del servidor.
export const COOKIE_ZONA_GEO = 'pya_zona_geo'

export function leerZonaGeoDeCookie(): ZonaDetectada | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_ZONA_GEO}=([^;]*)`))
  if (!match) return null
  try {
    return JSON.parse(decodeURIComponent(match[1])) as ZonaDetectada
  } catch {
    return null
  }
}
