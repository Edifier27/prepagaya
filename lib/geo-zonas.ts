// Detección de zona por geolocalización de IP (headers que agrega Vercel Edge
// Network en cada request: x-vercel-ip-country-region, x-vercel-ip-city).
// Uso exclusivamente para mostrar un banner informativo y precargar el campo
// de zona del cotizador — nunca para recomendar un plan puntual: no tenemos
// cartilla verificada localidad por localidad, solo por provincia/zona de GBA.
//
// Los códigos de región son ISO 3166-2:AR (los manda Vercel tal cual).
// La subdivisión de partidos del GBA en Norte/Sur/Oeste es geografía pública
// conocida (no es un dato de cobertura de salud que haya que verificar).

export interface ZonaDetectada {
  /** Texto para el banner, ej. "Banfield (GBA Sur)" */
  label: string
  /** Coincide con PROVINCIAS[].slug del wizard, para autocompletar */
  wizardSlug: string
  /** Coincide con provinciasSEO[].slug cuando la provincia tiene silo propio */
  provinciaSEOSlug?: string
}

const REGION_A_PROVINCIA: Record<string, { nombre: string; wizardSlug: string; provinciaSEOSlug?: string }> = {
  'AR-C': { nombre: 'CABA', wizardSlug: 'caba' },
  'AR-B': { nombre: 'Buenos Aires', wizardSlug: 'buenos-aires' },
  'AR-X': { nombre: 'Córdoba', wizardSlug: 'cordoba', provinciaSEOSlug: 'cordoba' },
  'AR-S': { nombre: 'Santa Fe', wizardSlug: 'santa-fe', provinciaSEOSlug: 'santa-fe' },
  'AR-M': { nombre: 'Mendoza', wizardSlug: 'mendoza', provinciaSEOSlug: 'mendoza' },
  'AR-T': { nombre: 'Tucumán', wizardSlug: 'tucuman', provinciaSEOSlug: 'tucuman' },
  'AR-A': { nombre: 'Salta', wizardSlug: 'salta', provinciaSEOSlug: 'salta' },
  'AR-Q': { nombre: 'Neuquén', wizardSlug: 'neuquen', provinciaSEOSlug: 'neuquen' },
  'AR-E': { nombre: 'Entre Ríos', wizardSlug: 'entre-rios' },
  'AR-N': { nombre: 'Misiones', wizardSlug: 'misiones' },
  'AR-H': { nombre: 'Chaco', wizardSlug: 'chaco' },
  'AR-W': { nombre: 'Corrientes', wizardSlug: 'corrientes' },
  'AR-R': { nombre: 'Río Negro', wizardSlug: 'rio-negro' },
  'AR-Y': { nombre: 'Jujuy', wizardSlug: 'jujuy' },
}

// Partidos del GBA por zona — geografía pública, no dato de salud.
const GBA_SUR = [
  'banfield', 'lomas de zamora', 'temperley', 'turdera', 'llavallol', 'avellaneda',
  'dock sud', 'piñeyro', 'sarandi', 'sarandí', 'villa dominico', 'villa domínico', 'wilde', 'gerli',
  'lanus', 'lanús', 'valentin alsina', 'valentín alsina', 'remedios de escalada',
  'quilmes', 'berazategui', 'florencio varela', 'adrogue', 'adrogué', 'burzaco',
  'rafael calzada', 'glew', 'longchamps', 'monte grande', 'luis guillon', 'luis guillón',
  'ezeiza', 'guernica', 'canning',
]
const GBA_NORTE = [
  'san isidro', 'vicente lopez', 'vicente lópez', 'olivos', 'martinez', 'martínez',
  'acassuso', 'beccar', 'boulogne', 'florida', 'victoria', 'san fernando', 'tigre',
  'don torcuato', 'general pacheco', 'pacheco', 'pilar', 'escobar', 'garin', 'garín',
  'san miguel', 'malvinas argentinas', 'jose c paz', 'josé c. paz', 'los polvorines',
  'general san martin', 'general san martín', 'villa ballester', 'san andres', 'san andrés',
]
const GBA_OESTE = [
  'moron', 'morón', 'castelar', 'haedo', 'el palomar', 'ituzaingo', 'ituzaingó',
  'hurlingham', 'merlo', 'moreno', 'san justo', 'ramos mejia', 'ramos mejía',
  'ciudadela', 'isidro casanova', 'gonzalez catan', 'gonzález catán', 'laferrere',
  'la matanza', 'villa madero', 'virrey del pino', 'lomas del mirador',
  'general rodriguez', 'general rodríguez', 'marcos paz',
]

function subzonaGBA(ciudad: string): string | null {
  const c = ciudad.toLowerCase().trim()
  if (GBA_SUR.some((n) => c.includes(n))) return 'GBA Sur'
  if (GBA_NORTE.some((n) => c.includes(n))) return 'GBA Norte'
  if (GBA_OESTE.some((n) => c.includes(n))) return 'GBA Oeste'
  return null
}

// A partir de los headers de geolocalización que manda Vercel Edge Network.
export function detectarZona(countryRegion: string | null, ciudad: string | null): ZonaDetectada | null {
  if (!countryRegion) return null
  const prov = REGION_A_PROVINCIA[countryRegion.toUpperCase()]
  if (!prov) return null

  const ciudadLimpia = ciudad ? decodeURIComponent(ciudad).trim() : null

  if (prov.wizardSlug === 'buenos-aires' && ciudadLimpia) {
    const subzona = subzonaGBA(ciudadLimpia)
    if (subzona) {
      return { label: `${ciudadLimpia} (${subzona})`, wizardSlug: 'buenos-aires' }
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
