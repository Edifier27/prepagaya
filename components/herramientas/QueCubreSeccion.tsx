import { coberturasMarca } from '@/lib/data/coberturas-marca'
import { prestacionesCobertura, prestacionesDeCategoria, CATEGORIAS_COBERTURA, NIVEL_COBERTURA, NORMAS, QUE_CUBRE_FECHA } from '@/lib/data/que-cubre'
import { PRIORIDAD_PARTNERS } from '@/lib/utils'
import { BuscadorQueCubreConUrl, type MarcaResumen } from '@/components/herramientas/BuscadorQueCubre'

// Sección del buscador "¿Qué me cubre la prepaga?" en la guía
// /guias/que-cubre-la-prepaga: el buscador y, debajo, la lista completa por
// categoría (en el HTML, para Google y los asistentes de IA). Los datos por
// prepaga salen de coberturas-marca.ts, con Swiss Medical primero.

const prioridad = (slug: string) => {
  const i = (PRIORIDAD_PARTNERS as readonly string[]).indexOf(slug)
  return i === -1 ? PRIORIDAD_PARTNERS.length : i
}

function marcasPorTema(): Record<string, MarcaResumen[]> {
  const temas = new Set(prestacionesCobertura.map((p) => p.temaMarca).filter(Boolean))
  const out: Record<string, MarcaResumen[]> = {}
  for (const c of coberturasMarca) {
    if (!temas.has(c.tema)) continue
    ;(out[c.tema] ??= []).push({ prepagaSlug: c.prepagaSlug, prepagaNombre: c.prepagaNombre, respuesta: c.respuesta })
  }
  for (const t of Object.keys(out)) out[t].sort((a, b) => prioridad(a.prepagaSlug) - prioridad(b.prepagaSlug))
  return out
}

export function QueCubreSeccion() {
  const marcas = marcasPorTema()
  const fecha = new Date(QUE_CUBRE_FECHA + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
  return (
    <section id="buscador" className="scroll-mt-28 mb-10" aria-labelledby="buscador-titulo">
      <h2 id="buscador-titulo" className="text-2xl font-bold text-gray-900 mb-1">Buscá qué te cubre la prepaga</h2>
      <p className="text-gray-600 leading-relaxed mb-4">
        Escribí una práctica, un tratamiento o un estudio: te decimos si es obligatorio por ley, con qué porcentaje o límite, qué incluye cada plan y dónde lo dice la norma oficial.
      </p>
      <BuscadorQueCubreConUrl marcas={marcas} />

      <details className="mt-5 group rounded-2xl border border-gray-200 bg-white">
        <summary className="cursor-pointer select-none list-none p-4 font-semibold text-gray-900 flex items-center justify-between">
          <span>Ver las {prestacionesCobertura.length} prestaciones, por categoría</span>
          <svg className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="px-4 pb-4 space-y-6 border-t border-gray-100 pt-4">
          {CATEGORIAS_COBERTURA.map((cat) => (
            <div key={cat.slug}>
              <h3 className="font-bold text-gray-900 mb-2">{cat.nombre}</h3>
              <ul className="space-y-3">
                {prestacionesDeCategoria(cat.slug).map((p) => (
                  <li key={p.slug} className="text-sm leading-relaxed">
                    <div className="flex flex-wrap items-center gap-2">
                      <a href={`?c=${p.slug}#buscador`} className="font-semibold text-gray-900 hover:text-[#E8002D]">{p.nombre}</a>
                      <span className={`text-[11px] font-semibold rounded-full border px-2 py-0.5 ${NIVEL_COBERTURA[p.nivel].clase}`}>{NIVEL_COBERTURA[p.nivel].texto}</span>
                    </div>
                    <p className="text-gray-600 mt-0.5">
                      {p.respuesta}
                      {p.normas.length > 0 && (
                        <span className="text-gray-400"> ({p.normas.map((n) => `${NORMAS[n.norma].nombre}${n.donde ? `, ${n.donde}` : ''}`).join('; ')})</span>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="text-xs text-gray-400">
            Revisado el {fecha} con los textos oficiales de Infoleg. &quot;Obligatorio&quot; quiere decir que está en el PMO o en una ley que alcanza a las prepagas: tiene que estar en todos los planes, del más barato al más caro. Lo que dice &quot;Depende del plan&quot; es una prestación superadora.
          </p>
        </div>
      </details>
    </section>
  )
}
