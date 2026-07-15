import type { Metadata } from 'next'
import Link from 'next/link'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { provinciasSEO } from '@/lib/data/zonas'
import { formatPrecio, SITE_NAME, SITE_URL } from '@/lib/utils'
import { StarRating } from '@/components/ui/StarRating'
import { Badge } from '@/components/ui/Badge'

export const metadata: Metadata = {
  title: `Prepagas Argentina ${new Date().getFullYear()}: Listado, Precios y Comparativas`,
  description: `Compará todas las prepagas de Argentina en un solo lugar. Precios actualizados de Swiss Medical, OSDE, CEMIC, Sancor Salud, Premedic y Medife. ${PRECIO_ACTUALIZADO}.`,
  alternates: { canonical: `${SITE_URL}/prepagas` },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Prepagas Argentina',
  description: 'Listado completo de prepagas en Argentina con precios y coberturas',
  numberOfItems: prepagas.length,
  itemListElement: prepagas.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: p.nombre,
    url: `${SITE_URL}/prepagas/${p.slug}`,
  })),
}

export default function PrepagasPage() {
  const prepagasOrdenadas = [...prepagas].sort((a, b) => b.satisfaccion - a.satisfaccion)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 border-b border-gray-200">
        <div className="container">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#E8002D]">{SITE_NAME}</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Prepagas</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Medicina Prepaga en Argentina: Precios y Comparativas {new Date().getFullYear()}
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Compará {prepagas.length} prepagas con precios actualizados al {PRECIO_ACTUALIZADO}. Opiniones de afiliados, coberturas y planes detallados.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            * Precios de referencia para persona de 30 años, contratación individual. Actualizado: {PRECIO_ACTUALIZADO}.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {prepagasOrdenadas.map((p, i) => {
              const planMasBarato = [...p.planes].sort((a, b) => a.precio - b.precio)[0]
              return (
                <Link
                  key={p.slug}
                  href={`/prepagas/${p.slug}`}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-red-200 transition-all group"
                >
                  {/* Card header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {i < 3 && (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            i === 0 ? 'bg-amber-100 text-amber-700' :
                            i === 1 ? 'bg-gray-100 text-gray-600' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            #{i + 1}
                          </span>
                        )}
                        <h2 className="font-bold text-xl text-gray-900 group-hover:text-[#E8002D] transition-colors">
                          {p.nombre}
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <StarRating rating={p.rating} size="sm" />
                      <span className="text-xs text-gray-400">({p.cantidadOpiniones.toLocaleString('es-AR')} opiniones)</span>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
                      {p.descripcion}
                    </p>

                    {/* Pros */}
                    <ul className="space-y-1 mb-4">
                      {p.pros.slice(0, 3).map((pro, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {pro}
                        </li>
                      ))}
                    </ul>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {p.caracteristicas.coberturaNacional && <Badge variant="blue">Cobertura nacional</Badge>}
                      {p.caracteristicas.appMovil && <Badge variant="green">App móvil</Badge>}
                      {p.sanatoriosPropios > 0 && <Badge variant="gray">{p.sanatoriosPropios} sanatorios propios</Badge>}
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-400">Desde</div>
                      <div className="text-xl font-bold text-[#E8002D]">
                        {formatPrecio(planMasBarato.precio)}
                        <span className="text-sm font-normal text-gray-400">/mes</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-[#00875A] font-semibold">{p.satisfaccion}% satisfacción</div>
                      <div className="text-sm font-medium text-[#E8002D] group-hover:underline mt-1">
                        Ver {p.planes.length} planes →
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Silo SEO local: hubs provinciales */}
      <section className="py-12 border-t border-gray-100">
        <div className="container">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Prepagas por provincia</h2>
          <p className="text-sm text-gray-500 mb-6">La cartilla real cambia según dónde vivas: mirá las prepagas con cobertura verificada en tu provincia.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {provinciasSEO.map((prov) => (
              <Link key={prov.slug} href={`/prepagas/${prov.slug}`}
                className="p-5 bg-white rounded-2xl border-2 border-gray-100 hover:border-red-200 hover:shadow-sm transition-all group">
                <div className="font-bold text-gray-900 group-hover:text-[#E8002D] transition-colors">Prepagas en {prov.nombre}</div>
                <div className="text-xs text-gray-500 mt-1">{prov.prepagas.length} prepagas con cobertura · ranking y precios</div>
                <div className="text-xs font-semibold text-[#E8002D] mt-3">Ver cobertura local →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Info SEO block */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container max-w-3xl mx-auto prose prose-gray">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Qué es la medicina prepaga en Argentina?</h2>
          <p className="text-gray-600 leading-relaxed">
            La medicina prepaga es un sistema de cobertura médica privada en Argentina que permite acceder a una amplia red de médicos, clínicas y sanatorios pagando una cuota mensual. A diferencia de las obras sociales (que son obligatorias para trabajadores en relación de dependencia), las prepagas son de contratación voluntaria y ofrecen mayor flexibilidad en prestadores y cobertura.
          </p>
          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">¿Cómo elegir la mejor prepaga?</h3>
          <p className="text-gray-600 leading-relaxed">
            Para elegir la prepaga adecuada debés considerar: tu presupuesto mensual, la red de prestadores disponible en tu zona, el tipo de cobertura que necesitás (individual, familiar, maternidad), y la calidad de atención. Usá nuestro comparador para analizar todas las opciones de forma simultánea.
          </p>
        </div>
      </section>
    </>
  )
}
