import { normalizarTexto, type PlanCartilla } from '@/lib/cartilla-zonas-geo'
import { CARTILLAS, type CentroCartilla, type ZonaCartilla } from './index'

// Cruce entre cartillas: sanatorios de internación de una zona que figuran en
// la cartilla de OTRAS prepagas y no en la que se está mirando ("¿No
// encontrás el prestador? Está en Swiss Medical, cotizalo"). Pedido de Darío,
// 22-sep-2026.
//
// Cada prepaga nombra distinto al mismo lugar ("Hosp. Aleman" vs "Hospital
// Alemán", "Sanatorio Otamendi" vs "Sanatorio Otamendi y Miroli"), así que el
// criterio es CONSERVADOR: ante la duda se lo considera presente. Mejor no
// mostrar un faltante que afirmar mal que una prepaga no tiene un sanatorio.

const GENERICAS = new Set([
  'sanatorio', 'sanatorios', 'clinica', 'clinicas', 'hospital', 'hosp', 'instituto', 'inst', 'centro', 'centros', 'medico', 'medica',
  'medicos', 'privado', 'privada', 'priv', 'sa', 's', 'a', 'srl', 'r', 'l', 'sas', 'de', 'del', 'la', 'las', 'los', 'el', 'y', 'e',
  'en', 'fundacion', 'fund', 'asociacion', 'integral', 'salud', 'policlinico', 'sede', 'cl', 'sanat', 'ctro', 'maternidad',
  'internacion', 'guardia', 'general', 'polivalente', 'nuevo', 'nueva', 'ac', 'asoc', 'coop', 'cooperativa', 'ltda',
])

/** Palabras distintivas del nombre (sin "sanatorio", "clínica", "S.A.", etc.) */
export function nucleoNombre(nombre: string): string[] {
  return normalizarTexto(nombre.replace(/\([^)]*\)/g, ' ').replace(/\s-\s.*$/, ''))
    .split(' ')
    .filter((w) => w.length > 1 && !GENERICAS.has(w))
}

function claveDireccion(dir: string | null): string | null {
  if (!dir) return null
  const n = normalizarTexto(dir).replace(/\b(av|avda|avenida|calle|bv|boulevard|pje|pasaje|gral|general|dr|pte|presidente)\b/g, ' ')
  const num = n.match(/\b(\d{2,5})\b/)
  const calle = n.replace(/\d+/g, ' ').split(' ').filter((w) => w.length > 2).slice(0, 2).join(' ')
  return num && calle ? `${calle}#${num[1]}` : null
}

function esMismo(a: CentroCartilla, b: CentroCartilla): boolean {
  const na = nucleoNombre(a.nombre)
  const nb = nucleoNombre(b.nombre)
  if (na.length && nb.length && (na.every((w) => nb.includes(w)) || nb.every((w) => na.includes(w)))) return true
  const da = new Set(a.sedes.map((s) => claveDireccion(s.direccion)).filter(Boolean))
  return b.sedes.some((s) => {
    const k = claveDireccion(s.direccion)
    return k !== null && da.has(k)
  })
}

// Zonas equivalentes entre prepagas: mismo slug, o la "capital" de una con la
// ciudad de otra ("cordoba-capital" ≈ "cordoba").
function claveZona(slug: string): string {
  return slug.replace(/-capital$/, '').replace(/^ciudad-de-/, '')
}
// Premedic arma sus zonas del interior por PROVINCIA entera: solo sirve para
// el cruce en AMBA (en el interior no se sabe si queda en la misma ciudad).
function zonaUsableParaCruce(prepagaSlug: string, z: ZonaCartilla): boolean {
  if (prepagaSlug === 'premedic') return z.slug === 'caba' || z.slug.startsWith('gba-')
  return true
}

export interface CentroEnOtras {
  nombre: string
  direccion: string | null
  en: { prepagaSlug: string; prepagaNombre: string; zonaSlug: string; desde: PlanCartilla }[]
}

const cache = new Map<string, CentroEnOtras[]>()

export function centrosEnOtrasCartillas(prepagaSlug: string, zonaSlug: string): CentroEnOtras[] {
  const k = `${prepagaSlug}/${zonaSlug}`
  const hit = cache.get(k)
  if (hit) return hit
  const propia = CARTILLAS[prepagaSlug]?.zonas.find((z) => z.slug === zonaSlug)
  if (!propia || !zonaUsableParaCruce(prepagaSlug, propia)) return []
  // En AMBA cada prepaga traza distinto los límites del GBA (Pilar es "Zona
  // Noroeste" para OSDE y "Zona Norte" para Avalian): para decidir si un
  // sanatorio FALTA se compara contra toda la cartilla AMBA de la prepaga.
  const esAmba = (s: string) => s === 'caba' || s.startsWith('gba-')
  const mios = esAmba(zonaSlug)
    ? CARTILLAS[prepagaSlug].zonas.filter((z) => esAmba(z.slug)).flatMap((z) => z.centros)
    : propia.centros
  const out: CentroEnOtras[] = []
  for (const otra of Object.values(CARTILLAS)) {
    if (otra.prepagaSlug === prepagaSlug) continue
    const z = otra.zonas.find((x) => claveZona(x.slug) === claveZona(zonaSlug) && !x.slug.match(/gba-zona-sud(este|oeste)$/))
    if (!z || !zonaUsableParaCruce(otra.prepagaSlug, z)) continue
    for (const c of z.centros) {
      if (!c.internacion.length) continue
      if (mios.some((m) => esMismo(m, c))) continue
      // Plan sugerido: el más bajo que lo incluye, priorizando los que están en el comparador
      const primero = otra.escalera.find((p) => c.internacion.includes(p) && otra.planesConPagina.includes(p))
        ?? otra.escalera.find((p) => c.internacion.includes(p)) ?? c.internacion[0]
      const desde = otra.planes.find((p) => p.id === primero)
      if (!desde) continue
      const previo = out.find((o) => esMismo({ ...c, nombre: o.nombre, sedes: [{ direccion: o.direccion, localidad: null, tel: null, servicios: [] }] }, c))
      const entrada = { prepagaSlug: otra.prepagaSlug, prepagaNombre: otra.prepagaNombre, zonaSlug: z.slug, desde }
      if (previo) {
        if (!previo.en.some((e) => e.prepagaSlug === otra.prepagaSlug)) previo.en.push(entrada)
      } else {
        out.push({ nombre: c.nombre, direccion: c.sedes[0]?.direccion ?? null, en: [entrada] })
      }
    }
  }
  // Primero los que están en más cartillas (los más "conocidos")
  out.sort((a, b) => b.en.length - a.en.length || a.nombre.localeCompare(b.nombre, 'es'))
  cache.set(k, out)
  return out
}
