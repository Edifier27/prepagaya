import Link from 'next/link'
import type { ReactNode } from 'react'

export interface FilaDiferencia {
  label: string
  a: string
  b: string
  edad?: number
  /** Columna donde está lo que se suma (sin copago, cobertura incluida o más amplia) */
  mejora?: 'a' | 'b'
}

// Tabla plan vs plan con lo que se suma marcado en verde (14-oct-2026, Darío:
// "en el 410 marcá con color lo que se agrega, fácil, rápido y pragmático").
// Arriba, un resumen "Lo que suma el X" con solo esas filas.
export function TablaDiferenciasPlanes({ filas, nombreA, nombreB, hrefB, superior, conPrecios = false }: {
  filas: FilaDiferencia[]
  nombreA: ReactNode
  nombreB: ReactNode
  hrefB?: string
  /** Columna del plan superior: el resumen muestra lo que suma ese plan */
  superior: 'a' | 'b'
  /** Mostrar también las filas de precio por edad (sin resaltar) */
  conPrecios?: boolean
}) {
  const sinPrecio = filas.filter((f) => !f.edad)
  const visibles = conPrecios ? filas : sinPrecio
  const suma = sinPrecio.filter((f) => f.mejora === superior)
  const nombreSup = superior === 'a' ? nombreA : nombreB
  const celda = (f: FilaDiferencia, col: 'a' | 'b') =>
    f.mejora === col
      ? 'bg-emerald-50 text-emerald-900 font-semibold'
      : f.mejora ? 'text-gray-500' : 'text-gray-900'

  return (
    <div className="space-y-4">
      {suma.length > 0 && (
        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/60 p-4">
          <p className="text-sm font-bold text-emerald-900 mb-2">Lo que suma el {nombreSup}</p>
          <ul className="space-y-1.5">
            {suma.map((f) => (
              <li key={f.label} className="flex items-start gap-2 text-sm text-gray-800">
                <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center" aria-hidden>+</span>
                <span><strong>{f.label}:</strong> {(superior === 'a' ? f.a : f.b).replace(/^✓\s*/, '')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-2 font-semibold"><span className="sr-only">Dato</span></th>
              <th className="text-left px-4 py-2 font-semibold text-gray-900">{nombreA}</th>
              <th className="text-left px-4 py-2 font-semibold text-gray-900">
                {hrefB ? <Link href={hrefB} className="hover:text-[#E8002D] hover:underline">{nombreB}</Link> : nombreB}
              </th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((f) => (
              <tr key={f.label} className="border-t border-gray-100 align-top">
                <th scope="row" className="text-left px-4 py-2 font-medium text-gray-600">{f.label}</th>
                {(['a', 'b'] as const).map((col) => (
                  <td key={col} className={`px-4 py-2 ${celda(f, col)}`}>
                    {f.mejora === col && <span className="mr-1 inline-flex w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-black items-center justify-center align-middle" aria-label="Suma">+</span>}
                    {f.mejora === col ? (col === 'a' ? f.a : f.b).replace(/^✓\s*/, '') : col === 'a' ? f.a : f.b}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sinPrecio.some((f) => f.mejora) && (
        <p className="text-xs text-gray-400"><span className="inline-block w-3 h-3 rounded bg-emerald-100 border border-emerald-300 align-middle mr-1" />En verde, lo que tiene de más ese plan.</p>
      )}
    </div>
  )
}
