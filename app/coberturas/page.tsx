import type { Metadata } from 'next'
import Link from 'next/link'
import { coberturas } from '@/lib/data/coberturas'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { CoberturaIcon } from '@/components/ui/CategoryIcon'

export const metadata: Metadata = {
  title: `Coberturas de Prepagas en Argentina — Qué cubre cada plan`,
  description: 'Guía completa de coberturas de prepagas en Argentina: psicología, maternidad, odontología, fertilidad, oncología, medicamentos y más. Qué dice la ley y cuál prepaga cubre mejor cada área.',
  alternates: { canonical: `${SITE_URL}/coberturas` },
}

export default function CoberturasHubPage() {
  return (
    <>
      <div className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-[#E8002D]">{SITE_NAME}</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Coberturas</span>
          </nav>
        </div>
      </div>

      <section className="bg-gradient-to-b from-blue-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            ¿Qué cubre tu prepaga?
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Guía completa sobre coberturas en prepagas argentinas. Qué dice la ley, qué cubren obligatoriamente y cuáles prepagas lo hacen mejor en cada área.
          </p>
        </div>
      </section>

      <div className="container max-w-4xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {coberturas.map((cob) => (
            <Link
              key={cob.slug}
              href={`/coberturas/${cob.slug}`}
              className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:border-red-200 transition-all"
            >
              <div className="flex items-start gap-4">
                <CoberturaIcon slug={cob.slug} size="sm" />
                <div>
                  <h2 className="font-bold text-gray-900 group-hover:text-[#E8002D] transition-colors mb-1">
                    {cob.titulo}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{cob.intro.split('.')[0]}.</p>
                  <div className="mt-3 text-xs font-semibold text-[#E8002D] group-hover:underline">
                    Ver cobertura completa →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 bg-blue-50 rounded-2xl p-6 border border-blue-100 text-center">
          <h2 className="font-bold text-gray-900 mb-2">¿Querés saber qué plan te conviene?</h2>
          <p className="text-sm text-gray-600 mb-4">Usá nuestro comparador personalizado y en 2 minutos encontrás el plan ideal según tus coberturas prioritarias.</p>
          <Link
            href="/comparador"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8002D] text-white font-bold rounded-xl hover:bg-[#B8001F] transition-colors"
          >
            Ir al comparador →
          </Link>
        </div>
      </div>
    </>
  )
}
