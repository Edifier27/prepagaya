import { normalizarTexto } from '@/lib/cartilla-zonas-geo'
import { CARTILLAS } from './cartilla-zonas'
import { claveDireccion, nucleoNombre } from './cartilla-zonas/cruce'
import { SANATORIOS_SEO, sanatoriosPublicables, type SanatorioSEO } from './sanatorios-seo'
import { CARTILLAS_SINDICALES, fechaDescarga } from './sindicales-cartillas'
import { osDeCartilla } from './sindicales-cartillas/os'

// "¿Qué obras sociales atiende el Sanatorio X?" (1-oct-2026): el cruce inverso
// de las cartillas oficiales de obras sociales (Anexo III, lib/data/
// sindicales-cartillas) con los sanatorios de /sanatorios/[slug].
//
// Para no confundir sanatorios homónimos ("Sanatorio Modelo" hay muchos), un
// prestador de obra social cuenta solo si el nombre coincide Y además:
//   - su dirección es una de las sedes que el sanatorio tiene en las cartillas
//     de las prepagas (calle + número), o
//   - está en la misma ciudad (interior) o en CABA (sanatorios del AMBA).
// Si una obra social no aparece no afirmamos que no lo tenga: no se lista.

export interface ObraSocialEnSanatorio {
  osSlug: string
  osNombre: string
  internacion: boolean
  guardia: boolean
  sedes: { nombre: string; domicilio?: string; localidad: string }[]
  /** Página de la cartilla de esa obra social en la provincia del sanatorio */
  urlCartilla: string
  fuente: string
  fecha: string
}

function coincideNombre(s: SanatorioSEO, nombre: string): boolean {
  const palabras = nucleoNombre(nombre)
  const texto = normalizarTexto(nombre)
  if (s.excluir?.some((x) => texto.includes(x))) return false
  return s.claves.every((k) => palabras.includes(k))
}

const esAmba = (zona: string) => zona === 'caba' || zona.startsWith('gba-')

/** Calle + número de todas las sedes del sanatorio en las cartillas de prepagas. */
function direccionesConocidas(s: SanatorioSEO): Set<string> {
  const out = new Set<string>()
  for (const cart of Object.values(CARTILLAS)) {
    for (const z of cart.zonas) {
      if (s.ciudad ? !normalizarTexto(z.nombre).includes(s.ciudad) : !esAmba(z.slug)) continue
      for (const c of z.centros) {
        if (!coincideNombre(s, c.nombre)) continue
        for (const sede of c.sedes) {
          const k = claveDireccion(sede.direccion)
          if (k) out.add(k)
        }
      }
    }
  }
  return out
}

const cache = new Map<string, ObraSocialEnSanatorio[]>()

export function obrasSocialesEnSanatorio(slug: string): ObraSocialEnSanatorio[] {
  const hit = cache.get(slug)
  if (hit) return hit
  const s = SANATORIOS_SEO.find((x) => x.slug === slug)
  if (!s) return []
  const direcciones = direccionesConocidas(s)
  const out: ObraSocialEnSanatorio[] = []
  for (const c of Object.values(CARTILLAS_SINDICALES)) {
    const os = osDeCartilla(c.slug)
    if (!os) continue
    let internacion = false
    let guardia = false
    const sedes: ObraSocialEnSanatorio['sedes'] = []
    let provincia: string | null = null
    for (const p of c.provincias) {
      for (const i of p.instituciones) {
        if (!i.t.includes('internacion') && !i.t.includes('guardia')) continue
        if (!coincideNombre(s, i.n)) continue
        const k = claveDireccion(i.dom ?? null)
        const mismaDireccion = k !== null && direcciones.has(k)
        const mismaZona = s.ciudad ? normalizarTexto(i.loc).includes(s.ciudad) : p.slug === 'caba'
        if (!mismaDireccion && !mismaZona) continue
        internacion ||= i.t.includes('internacion')
        guardia ||= i.t.includes('guardia')
        provincia ??= p.slug
        if (!sedes.some((x) => x.nombre === i.n && x.domicilio === i.dom)) sedes.push({ nombre: i.n, domicilio: i.dom, localidad: i.loc })
      }
    }
    if (!internacion && !guardia) continue
    out.push({
      osSlug: c.slug,
      osNombre: os.nombre,
      internacion,
      guardia,
      sedes,
      urlCartilla: `/obras-sociales/${c.slug}/cartilla/${provincia}`,
      fuente: c.fuente,
      fecha: fechaDescarga(c),
    })
  }
  out.sort((a, b) => Number(b.internacion) - Number(a.internacion) || a.osNombre.localeCompare(b.osNombre, 'es'))
  cache.set(slug, out)
  return out
}

let indice: Map<string, { slug: string; nombre: string }> | null = null
const claveInst = (osSlug: string, nombre: string, domicilio?: string) => `${osSlug}|${nombre}|${domicilio ?? ''}`

/** Si un prestador de la cartilla de una obra social es un sanatorio con página propia (/sanatorios/[slug]). */
export function sanatorioConPagina(osSlug: string, nombre: string, domicilio?: string): { slug: string; nombre: string } | undefined {
  if (!indice) {
    indice = new Map()
    for (const s of sanatoriosPublicables()) {
      for (const o of obrasSocialesEnSanatorio(s.slug)) {
        for (const sede of o.sedes) indice.set(claveInst(o.osSlug, sede.nombre, sede.domicilio), { slug: s.slug, nombre: s.nombre })
      }
    }
  }
  return indice.get(claveInst(osSlug, nombre, domicilio))
}
