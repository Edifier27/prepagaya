import type { Metadata } from 'next'
import Link from 'next/link'
import { condiciones } from '@/lib/data/condiciones'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { CondicionIcon } from '@/components/ui/CategoryIcon'

export const metadata: Metadata = {
  title: `Prepagas por Condición de Salud — Diabetes, Celiaquía, Artritis y más`,
  description: 'Encontrá la mejor prepaga según tu condición de salud. Guías específicas para diabetes, celiaquía, hipertensión, autismo, artritis, salud mental y más.',
  alternates: { canonical: `${SITE_URL}/condiciones` },
}

export default function CondicionesHubPage() {
  return (
    <>
      <div className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-[#E8002D]">{SITE_NAME}</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Prepagas por condición</span>
          </nav>
        </div>
      </div>

      <section className="bg-gradient-to-b from-green-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-[#00875A] text-xs font-semibold px-4 py-2 rounded-full mb-4">
            Guías especializadas por condición de salud
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            ¿Cuál es la mejor prepaga para mi condición?
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Si tenés una condición de salud específica, la elección de prepaga es más importante que para el resto. Encontrá guías personalizadas con análisis detallado de cobertura.
          </p>
        </div>
      </section>

      <div className="container max-w-4xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {condiciones.map((cond) => (
            <Link
              key={cond.slug}
              href={`/condiciones/${cond.slug}`}
              className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:border-green-200 transition-all"
            >
              <div className="flex items-start gap-4">
                <CondicionIcon slug={cond.slug} size="sm" />
                <div>
                  <h2 className="font-bold text-gray-900 group-hover:text-[#00875A] transition-colors mb-1">
                    {cond.nombre}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {cond.intro.split('.')[0]}.
                  </p>
                  <div className="mt-3 text-xs font-semibold text-[#00875A] group-hover:underline">
                    Ver guía completa →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-green-50 rounded-2xl p-6 border border-green-100 text-center">
          <h2 className="font-bold text-gray-900 mb-2">¿No encontrás tu condición?</h2>
          <p className="text-sm text-gray-600 mb-4">Usá nuestro comparador personalizado y filtrá por las coberturas que más necesitás.</p>
          <Link href="/comparador" className="inline-flex items-center gap-2 px-6 py-3 bg-[#00875A] text-white font-bold rounded-xl hover:bg-[#006644] transition-colors">
            Ir al comparador personalizado
          </Link>
        </div>
      </div>
    </>
  )
}
