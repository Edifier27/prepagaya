import Link from 'next/link'
import { NIVEL_DOC, preexistenciasConEnlace } from '@/lib/data/preexistencias-documentacion'

// "Qué te piden para afiliarte" en las fichas de condiciones y coberturas:
// las entradas del buscador de preexistencias que se desarrollan en esa página
// (lib/data/preexistencias-documentacion, campo enlace). Si no hay, no se muestra.
export function DocumentacionIngreso({ href, tema }: { href: string; tema: string }) {
  const items = preexistenciasConEnlace(href)
  if (items.length === 0) return null
  return (
    <section className="py-10 bg-white border-t border-gray-100">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-1">{tema}: qué documentación te piden para afiliarte</h2>
        <p className="text-sm text-gray-500 mb-5">Según nuestra experiencia como asesores. Cada prepaga tiene su criterio de auditoría y puede pedir más o menos.</p>
        <ul className="space-y-3">
          {items.map((p) => (
            <li key={p.slug} className="rounded-2xl border border-gray-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900">{p.nombre}</h3>
                <span className={`text-xs font-semibold rounded-full border px-2.5 py-1 ${NIVEL_DOC[p.nivel].clase}`}>{NIVEL_DOC[p.nivel].texto}</span>
              </div>
              {p.documentos.length > 0 && <p className="text-sm text-gray-700 mt-2 leading-relaxed">{p.documentos.join(' ')}</p>}
              {p.nota && <p className="text-sm text-gray-500 mt-2 leading-relaxed">{p.nota}</p>}
              <Link href={`/declaracion-jurada-de-salud?c=${p.slug}`} className="inline-block mt-2 text-sm font-semibold text-[#E8002D] hover:underline">
                Armar mi lista de documentación →
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
