import Link from 'next/link'
import { prepagas } from '@/lib/data/prepagas'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="container py-20 max-w-2xl mx-auto text-center">
      <div className="text-7xl mb-6 font-black text-gray-200">404</div>
      <h1 className="text-4xl font-bold text-gray-900 mb-3">
        Página no encontrada
      </h1>
      <p className="text-gray-500 mb-8 text-lg">
        La página que buscás no existe o fue movida. Probá con alguna de estas opciones.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
        <Button href="/" variant="primary" size="lg">
          Ir al inicio
        </Button>
        <Button href="/prepagas" variant="outline" size="lg">
          Ver prepagas
        </Button>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-left">
        <h2 className="font-bold text-gray-900 mb-4 text-center">Accesos rápidos</h2>
        <div className="grid grid-cols-2 gap-2">
          {prepagas.map((p) => (
            <Link
              key={p.slug}
              href={`/prepagas/${p.slug}`}
              className="text-sm text-gray-700 hover:text-[#E8002D] py-2 px-3 rounded-lg hover:bg-white transition-all border border-transparent hover:border-gray-200"
            >
              {p.nombre} →
            </Link>
          ))}
          <Link href="/ranking" className="text-sm text-gray-700 hover:text-[#E8002D] py-2 px-3 rounded-lg hover:bg-white transition-all border border-transparent hover:border-gray-200">
            Ranking prepagas →
          </Link>
          <Link href="/guias" className="text-sm text-gray-700 hover:text-[#E8002D] py-2 px-3 rounded-lg hover:bg-white transition-all border border-transparent hover:border-gray-200">
            Guías →
          </Link>
        </div>
      </div>
    </div>
  )
}
