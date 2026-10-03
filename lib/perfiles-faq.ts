// Solo del lado del servidor (usa el motor de precios).
import { precioGrupo } from '@/lib/precios/motor'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { APORTE_OS_MAXIMO, APORTE_OS_MINIMO, CATEGORIAS_MONOTRIBUTO, VIGENCIA_CATEGORIAS, formatoPesos } from '@/lib/data/monotributo'
import { formatPrecio } from '@/lib/utils'
import { nombreCorto } from '@/components/perfiles/PreciosMayores'

// Preguntas de los perfiles que se responden con datos oficiales (3-oct-2026):
// los precios de lista de la SSSalud y el cuadro de categorías de ARCA. Se
// arman acá para que la respuesta cambie sola cuando se cargan los precios
// del mes.

const nombrePlan = (slug: string, plan: string) => {
  const p = prepagas.find((x) => x.slug === slug)
  const pl = p?.planes.find((x) => x.slug === plan)
  return p && pl ? nombreCorto(p.nombre, pl.nombre) : null
}

// Familia tipo: dos adultos de 35 y dos chicos de 5 y 8
const FAMILIA = [35, 35, 5, 8]
const PLANES_FAMILIA: [string, string][] = [['swiss-medical', 'smg20'], ['osde', '310'], ['sancor-salud', 'f800'], ['medife', 'bronce'], ['premedic', 'plan-300']]

export function faqFamilia(): { q: string; a: string } | null {
  const filas = PLANES_FAMILIA.flatMap(([slug, plan]) => {
    const r = precioGrupo(slug, plan, FAMILIA, 'caba')
    const nombre = nombrePlan(slug, plan)
    return r && nombre ? [{ nombre, total: r.total, chicoMenos: r.porPersona[2].precio < r.porPersona[0].precio }] : []
  })
  if (filas.length < 3) return null
  const conDescuento = filas.filter((f) => f.chicoMenos).map((f) => f.nombre.split(' ')[0])
  return {
    q: '¿Cuánto sale una prepaga para una familia de 4 personas?',
    a: `Depende de la edad de cada integrante y del plan. Según las listas oficiales de ${PRECIO_ACTUALIZADO.toLowerCase()} (CABA y GBA, contratación directa, IVA incluido), dos adultos de 35 años con dos hijos de 5 y 8 pagan por mes: ${filas.map((f) => `${f.nombre}, ${formatPrecio(f.total)}`).join('; ')}. Cada integrante paga según la franja de edad que declara la prepaga${conDescuento.length ? `: en ${conDescuento.join(' y ')} los chicos pagan menos que un adulto; en las otras, lo mismo que un adulto joven` : ''}. Cotizando online tenés 15% OFF sobre esos valores.`,
  }
}

export function faqAporteMonotributo(): { q: string; a: string } | null {
  if (CATEGORIAS_MONOTRIBUTO.length === 0) return null
  const letras = (v: number) => CATEGORIAS_MONOTRIBUTO.filter((c) => c.obraSocial === v).map((c) => c.letra)
  const minimas = letras(APORTE_OS_MINIMO)
  const maximas = letras(APORTE_OS_MAXIMO)
  const rango = (ls: string[]) => (ls.length > 1 ? `categorías ${ls[0]} a ${ls.at(-1)}` : `categoría ${ls[0]}`)
  return {
    q: '¿Cuánto aporta mi categoría del monotributo a la obra social?',
    a: `Según el cuadro de ARCA${VIGENCIA_CATEGORIAS ? ` vigente desde el ${VIGENCIA_CATEGORIAS}` : ''}, el aporte mensual a la obra social va de ${formatoPesos(APORTE_OS_MINIMO)} (${rango(minimas)}) a ${formatoPesos(APORTE_OS_MAXIMO)} (${rango(maximas)}). Cada familiar que sumes como adherente paga lo mismo que el titular. Si la prepaga toma ese aporte, se descuenta de la cuota y pagás solo la diferencia.`,
  }
}
