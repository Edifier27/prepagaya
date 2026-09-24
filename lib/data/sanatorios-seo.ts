import { normalizarTexto, type PlanCartilla } from '@/lib/cartilla-zonas-geo'
import { CARTILLAS, textoFecha, type CentroCartilla } from './cartilla-zonas'
import { nucleoNombre } from './cartilla-zonas/cruce'

// Páginas "¿Qué prepagas atienden en el Hospital X?" (23-sep-2026). La
// competencia las escribe a mano; acá salen SOLO de las cartillas oficiales
// que ya bajamos (lib/data/cartilla-zonas): qué prepaga lo tiene, desde qué
// plan, para internación y guardia. Si una prepaga no aparece, no afirmamos
// que no lo tenga (puede figurar con otro nombre): simplemente no se lista.

/** Fecha en que se cruzaron las cartillas oficiales (actualizar al re-bajarlas) */
export const SANATORIOS_ACTUALIZADO = '2026-09-23'

export interface SanatorioSEO {
  slug: string
  nombre: string
  /** Palabras que tienen que estar TODAS en el nombre del centro (normalizado) */
  claves: string[]
  /** Si el nombre tiene alguna de estas palabras, no es este sanatorio */
  excluir?: string[]
  /** Interior (23-sep-2026): se buscan zonas cuyo nombre contenga este texto
   *  normalizado (ej. 'rosario'). Sin ciudad = CABA y GBA. */
  ciudad?: string
  /** Cómo se muestra la ciudad: "Rosario", "Córdoba"... */
  ciudadNombre?: string
}

export const SANATORIOS_SEO: SanatorioSEO[] = [
  { slug: 'hospital-italiano', nombre: 'Hospital Italiano', claves: ['italiano'], excluir: ['plata', 'rosario', 'cordoba', 'mendoza'] },
  { slug: 'hospital-aleman', nombre: 'Hospital Alemán', claves: ['aleman'] },
  { slug: 'hospital-britanico', nombre: 'Hospital Británico', claves: ['britanico'] },
  { slug: 'hospital-austral', nombre: 'Hospital Universitario Austral', claves: ['austral'] },
  { slug: 'fleni', nombre: 'FLENI', claves: ['fleni'] },
  { slug: 'fundacion-favaloro', nombre: 'Hospital Universitario Fundación Favaloro', claves: ['favaloro'] },
  { slug: 'sanatorio-otamendi', nombre: 'Sanatorio Otamendi', claves: ['otamendi'] },
  { slug: 'sanatorio-mater-dei', nombre: 'Sanatorio Mater Dei', claves: ['mater', 'dei'] },
  { slug: 'sanatorio-guemes', nombre: 'Sanatorio Güemes', claves: ['guemes'] },
  { slug: 'sanatorio-de-la-trinidad', nombre: 'Sanatorio de la Trinidad', claves: ['trinidad'] },
  { slug: 'sanatorio-finochietto', nombre: 'Sanatorio Finochietto', claves: ['finochietto'] },
  { slug: 'clinica-suizo-argentina', nombre: 'Clínica y Maternidad Suizo Argentina', claves: ['suizo'] },
  { slug: 'sanatorio-anchorena', nombre: 'Sanatorio Anchorena', claves: ['anchorena'] },
  { slug: 'sanatorio-los-arcos', nombre: 'Sanatorio Los Arcos', claves: ['arcos'] },
  { slug: 'clinica-bazterrica', nombre: 'Clínica Bazterrica', claves: ['bazterrica'] },
  { slug: 'sanatorio-agote', nombre: 'Sanatorio Agote', claves: ['agote'] },
  { slug: 'instituto-alexander-fleming', nombre: 'Instituto Alexander Fleming', claves: ['fleming'], excluir: ['trinidad'] },
  { slug: 'hospital-cemic', nombre: 'Hospital Universitario CEMIC', claves: ['cemic'] },
  // Interior: los que figuran en 3 o más cartillas oficiales de su ciudad
  { slug: 'sanatorio-allende', nombre: 'Sanatorio Allende', claves: ['allende'], ciudad: 'cordoba', ciudadNombre: 'Córdoba' },
  { slug: 'clinica-reina-fabiola', nombre: 'Clínica Universitaria Reina Fabiola', claves: ['reina', 'fabiola'], ciudad: 'cordoba', ciudadNombre: 'Córdoba' },
  { slug: 'sanatorio-del-salvador', nombre: 'Sanatorio del Salvador', claves: ['salvador'], ciudad: 'cordoba', ciudadNombre: 'Córdoba' },
  { slug: 'instituto-modelo-de-cardiologia', nombre: 'Instituto Modelo de Cardiología', claves: ['modelo', 'cardiologia'], ciudad: 'cordoba', ciudadNombre: 'Córdoba' },
  { slug: 'sanatorio-britanico-rosario', nombre: 'Sanatorio Británico de Rosario', claves: ['britanico'], ciudad: 'rosario', ciudadNombre: 'Rosario' },
  { slug: 'sanatorio-parque-rosario', nombre: 'Sanatorio Parque de Rosario', claves: ['parque'], ciudad: 'rosario', ciudadNombre: 'Rosario' },
  { slug: 'sanatorio-de-la-mujer-rosario', nombre: 'Sanatorio de la Mujer (Rosario)', claves: ['mujer'], ciudad: 'rosario', ciudadNombre: 'Rosario' },
  { slug: 'hospital-espanol-rosario', nombre: 'Hospital Español de Rosario', claves: ['espanol'], ciudad: 'rosario', ciudadNombre: 'Rosario' },
  { slug: 'sanatorio-americano-rosario', nombre: 'Sanatorio Americano (Rosario)', claves: ['americano'], ciudad: 'rosario', ciudadNombre: 'Rosario' },
  { slug: 'centro-medico-ipam', nombre: 'Centro Médico IPAM (Rosario)', claves: ['ipam'], ciudad: 'rosario', ciudadNombre: 'Rosario' },
  { slug: 'instituto-cardiovascular-de-rosario', nombre: 'Instituto Cardiovascular de Rosario', claves: ['cardiovascular'], ciudad: 'rosario', ciudadNombre: 'Rosario' },
  { slug: 'hospital-italiano-garibaldi-rosario', nombre: 'Hospital Italiano Garibaldi (Rosario)', claves: ['italiano'], excluir: ['sanatorio'], ciudad: 'rosario', ciudadNombre: 'Rosario' },
  { slug: 'sanatorio-de-ninos-rosario', nombre: 'Sanatorio de Niños (Rosario)', claves: ['ninos'], ciudad: 'rosario', ciudadNombre: 'Rosario' },
  { slug: 'clinica-de-cuyo', nombre: 'Clínica de Cuyo', claves: ['cuyo'], ciudad: 'mendoza', ciudadNombre: 'Mendoza' },
  { slug: 'clinica-mayo-tucuman', nombre: 'Clínica Mayo (Tucumán)', claves: ['mayo'], excluir: ['sanatorio'], ciudad: 'tucuman', ciudadNombre: 'Tucumán' },
  { slug: 'sanatorio-del-norte-tucuman', nombre: 'Sanatorio del Norte (Tucumán)', claves: ['norte'], ciudad: 'tucuman', ciudadNombre: 'Tucumán' },
  { slug: 'hospital-italiano-la-plata', nombre: 'Hospital Italiano de La Plata', claves: ['italiano', 'plata'], ciudad: 'plata', ciudadNombre: 'La Plata' },
  { slug: 'instituto-medico-platense', nombre: 'Instituto Médico Platense', claves: ['platense'], ciudad: 'plata', ciudadNombre: 'La Plata' },
  { slug: 'clinica-colon-mar-del-plata', nombre: 'Clínica y Maternidad Colón (Mar del Plata)', claves: ['colon'], ciudad: 'mar del plata', ciudadNombre: 'Mar del Plata' },
  { slug: 'hospital-regional-espanol-bahia-blanca', nombre: 'Hospital Regional Español (Bahía Blanca)', claves: ['regional', 'espanol'], ciudad: 'bahia blanca', ciudadNombre: 'Bahía Blanca' },
  { slug: 'hospital-privado-del-sur', nombre: 'Hospital Privado del Sur (Bahía Blanca)', claves: ['privado', 'sur'], excluir: ['italiano'], ciudad: 'bahia blanca', ciudadNombre: 'Bahía Blanca' },
  { slug: 'sanatorio-tandil', nombre: 'Sanatorio Tandil', claves: ['tandil'], excluir: ['chacabuco'], ciudad: 'tandil', ciudadNombre: 'Tandil' },
]

export interface PrepagaEnSanatorio {
  prepagaSlug: string
  prepagaNombre: string
  /** Plan más bajo (según la escalera de la prepaga) que lo incluye para internación */
  desde: PlanCartilla | null
  internacion: PlanCartilla[]
  guardia: PlanCartilla[]
  sedes: { nombre: string; direccion: string | null; zona: string }[]
  fuenteUrl: string
  fecha: string
}

const esAmba = (s: string) => s === 'caba' || s.startsWith('gba-')

function coincide(s: SanatorioSEO, c: CentroCartilla): boolean {
  const palabras = nucleoNombre(c.nombre)
  const texto = normalizarTexto(c.nombre)
  if (s.excluir?.some((x) => texto.includes(x))) return false
  return s.claves.every((k) => palabras.includes(k))
}

const cache = new Map<string, PrepagaEnSanatorio[]>()

export function prepagasEnSanatorio(slug: string): PrepagaEnSanatorio[] {
  const hit = cache.get(slug)
  if (hit) return hit
  const s = SANATORIOS_SEO.find((x) => x.slug === slug)
  if (!s) return []
  const out: PrepagaEnSanatorio[] = []
  for (const cart of Object.values(CARTILLAS)) {
    const internacion = new Set<string>()
    const guardia = new Set<string>()
    const sedes: PrepagaEnSanatorio['sedes'] = []
    for (const z of cart.zonas) {
      if (s.ciudad ? !normalizarTexto(z.nombre).includes(s.ciudad) : !esAmba(z.slug)) continue
      for (const c of z.centros) {
        if (!coincide(s, c)) continue
        c.internacion.forEach((p) => internacion.add(p))
        c.guardia.forEach((p) => guardia.add(p))
        const direccion = c.sedes[0]?.direccion ?? null
        if (!sedes.some((x) => x.nombre === c.nombre && x.direccion === direccion)) sedes.push({ nombre: c.nombre, direccion, zona: z.nombre })
      }
    }
    if (!internacion.size && !guardia.size) continue
    const orden = (ids: Set<string>) => {
      const enEscalera = cart.escalera.filter((id) => ids.has(id))
      const resto = [...ids].filter((id) => !cart.escalera.includes(id))
      return [...enEscalera, ...resto].map((id) => cart.planes.find((p) => p.id === id)).filter((p): p is PlanCartilla => Boolean(p))
    }
    const planesInternacion = orden(internacion)
    out.push({
      prepagaSlug: cart.prepagaSlug,
      prepagaNombre: cart.prepagaNombre,
      desde: planesInternacion[0] ?? null,
      internacion: planesInternacion,
      guardia: orden(guardia),
      sedes: sedes.slice(0, 6),
      fuenteUrl: cart.fuenteUrl,
      fecha: textoFecha(cart),
    })
  }
  cache.set(slug, out)
  return out
}

/** Solo se publican los sanatorios que figuran en al menos 2 cartillas oficiales. */
export function sanatoriosPublicables(): SanatorioSEO[] {
  return SANATORIOS_SEO.filter((s) => prepagasEnSanatorio(s.slug).length >= 2)
}
