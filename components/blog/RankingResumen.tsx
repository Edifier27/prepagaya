import Link from 'next/link'
import { prepagas } from '@/lib/data/prepagas'
import { formatPrecio } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'

interface Props {
  slugs: string[]
}

// Resumen estructurado (GEO, 17-sep-2026): para posts de ranking/listicle,
// arma por cada prepaga un bloque "ideal para / pros / contras / precio"
// leyendo directo de prepagas.ts — así el post tiene, además de la nota en
// prosa, una versión citable en un formato que los motores de IA prefieren
// extraer (resumen corto + tag + pros/contras + precio), sin reescribir el
// contenido de cada post a mano.
export function RankingResumen({ slugs }: Props) {
  const items = slugs.map((s) => prepagas.find((p) => p.slug === s)).filter((p): p is NonNullable<typeof p> => Boolean(p))
  if (items.length < 2) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
      {items.map((p) => {
        const planBarato = [...p.planes].sort((a, b) => a.precio - b.precio)[0]
        return (
          <div key={p.slug} className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-2.5 mb-2">
              <PrepagaLogo slug={p.slug} nombre={p.nombre} colorPrimario={p.colorPrimario} size="sm" />
              <span className="font-bold text-gray-900">{p.nombre}</span>
            </div>
            {p.pros[0] && (
              <p className="text-xs font-semibold text-[#E8002D] mb-3">Ideal para: {p.pros[0]}</p>
            )}
            <ul className="space-y-1 mb-3">
              {p.pros.slice(1, 4).map((pro) => (
                <li key={pro} className="flex items-start gap-1.5 text-xs text-gray-600">
                  <span className="text-green-500 flex-shrink-0">✓</span>{pro}
                </li>
              ))}
              {p.contras.slice(0, 2).map((con) => (
                <li key={con} className="flex items-start gap-1.5 text-xs text-gray-400">
                  <span className="text-gray-300 flex-shrink-0">✗</span>{con}
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="text-sm">
                <span className="text-gray-400">Desde </span>
                <span className="font-bold text-gray-900">{formatPrecio(planBarato.precio)}/mes</span>
              </div>
              <Link href={`/prepagas/${p.slug}`} className="text-xs font-semibold text-[#E8002D] hover:underline flex-shrink-0">
                Ver detalle →
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
