import type { Metadata } from 'next'
import Link from 'next/link'
import { guias } from '@/lib/data/guias'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

export const metadata: Metadata = {
  title: `Guías de Prepagas Argentina ${new Date().getFullYear()} — Todo lo que necesitás saber`,
  description: 'Guías completas sobre prepagas en Argentina: cómo cambiar, qué cubre el PMO, prepagas para monotributistas, cómo deducir en ganancias y mucho más.',
  alternates: { canonical: `${SITE_URL}/guias` },
}

export default function GuiasPage() {
  const categorias = [...new Set(guias.map((g) => g.categoria))]

  return (
    <>
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 border-b border-gray-200">
        <div className="container">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#E8002D]">{SITE_NAME}</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Guías</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Guías sobre Prepagas en Argentina
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Todo lo que necesitás saber para elegir, contratar y aprovechar al máximo tu prepaga en Argentina.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          {categorias.map((cat) => (
            <div key={cat} className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Badge variant="blue">{cat}</Badge>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guias
                  .filter((g) => g.categoria === cat)
                  .map((g) => (
                    <Link
                      key={g.slug}
                      href={`/guias/${g.slug}`}
                      className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-red-200 transition-all group"
                    >
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors mb-2">
                        {g.titulo}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{g.metaDescripcion}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">{g.tiempoLectura} min de lectura</span>
                        <span className="text-sm font-medium text-[#E8002D] group-hover:underline">Leer guía →</span>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
