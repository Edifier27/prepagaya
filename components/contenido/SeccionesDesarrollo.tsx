import Link from 'next/link'
import type { GuiaEnlace, GuiaSeccion } from '@/lib/data/guias'

// Bloques compartidos por las fichas de condiciones y de coberturas: el
// desarrollo (lo que dice la norma y lo que pasa en la práctica) y la línea
// de fuentes oficiales al pie.

export function SeccionesDesarrollo({ secciones }: { secciones?: GuiaSeccion[] }) {
  if (!secciones?.length) return null
  return (
    <section className="py-10 bg-white border-t border-gray-100">
      <div className="container max-w-4xl mx-auto space-y-8">
        {secciones.map((sec) => (
          <div key={sec.titulo}>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{sec.titulo}</h2>
            <p className="text-gray-700 leading-relaxed">{sec.cuerpo}</p>
            {sec.enlaces && (
              <div className="flex flex-wrap gap-2 mt-3">
                {sec.enlaces.map((e) => (
                  <a key={e.url} href={e.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:border-[#E8002D] hover:text-[#E8002D]">
                    {e.texto} ↗
                  </a>
                ))}
              </div>
            )}
            {sec.cta && (
              <div className="mt-3 rounded-xl bg-red-50 border border-red-100 p-4">
                <p className="text-sm text-gray-800 leading-relaxed">{sec.cta.texto}</p>
                <Link href={sec.cta.href} className="inline-block mt-2 text-sm font-bold text-[#E8002D] hover:underline">{sec.cta.boton} →</Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export function FuentesOficiales({ fuentes }: { fuentes?: GuiaEnlace[] }) {
  if (!fuentes?.length) return null
  return (
    <p className="mt-6 text-xs text-gray-400 leading-relaxed">
      Fuentes oficiales:{' '}
      {fuentes.map((f, i) => (
        <span key={f.url}>
          {i > 0 && ' · '}
          <a href={f.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">{f.texto}</a>
        </span>
      ))}
    </p>
  )
}
