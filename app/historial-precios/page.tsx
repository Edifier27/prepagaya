import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL, SITE_NAME } from '@/lib/utils'
import { BreadcrumbSchema } from '@/components/ui/BreadcrumbSchema'

export const metadata: Metadata = {
  title: 'Historial de Precios de Prepagas Argentina 2024–2026 — PrepagaYa',
  description:
    'Seguí la evolución mensual de los precios de prepagas en Argentina. OSDE, Swiss Medical, Sancor, Medifé y más. Actualizado junio 2026.',
  alternates: { canonical: `${SITE_URL}/historial-precios` },
  keywords: [
    'historial precios prepagas argentina',
    'aumento prepagas 2024 2025',
    'evolución precios prepaga',
    'osde precio historial',
    'cuanto aumentaron las prepagas',
  ],
}

const historialOSDE310 = [
  { mes: 'Jul 2024', precio: 198250 },
  { mes: 'Ago 2024', precio: 215630 },
  { mes: 'Sep 2024', precio: 231500 },
  { mes: 'Oct 2024', precio: 253800 },
  { mes: 'Nov 2024', precio: 268490 },
  { mes: 'Dic 2024', precio: 284320 },
  { mes: 'Ene 2025', precio: 301440 },
  { mes: 'Feb 2025', precio: 318260 },
  { mes: 'Mar 2025', precio: 327100 },
  { mes: 'Abr 2025', precio: 333450 },
  { mes: 'May 2025', precio: 338900 },
  { mes: 'Jun 2025', precio: 345310 },
]

const preciosJunio2026 = [
  { prepaga: 'Swiss Medical', plan: 'SMG20', precio: 325467, precioEne2024: 87500 },
  { prepaga: 'OSDE', plan: 'Plan 310', precio: 345310, precioEne2024: 87500 },
  { prepaga: 'Medifé', plan: 'Plan Plata', precio: 309892, precioEne2024: 87500 },
  { prepaga: 'Sancor Salud', plan: 'Plan 1000', precio: 362701, precioEne2024: 87500 },
  { prepaga: 'CEMIC', plan: 'Plan Individual (Plan B)', precio: 245000, precioEne2024: 87500 },
  { prepaga: 'Premedic', plan: 'Plan 300', precio: 135000, precioEne2024: 87500 },
]

const maxPrecio = Math.max(...historialOSDE310.map((d) => d.precio))

function formatPrecioHist(precio: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(precio)
}

function calcVariacion(precioActual: number, precioBase: number): string {
  const variacion = Math.round(((precioActual - precioBase) / precioBase) * 100)
  return `+${variacion}%`
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Historial de precios de prepagas Argentina 2024–2026',
  description: 'Evolución mensual de precios de OSDE Plan 310, Swiss Medical, Sancor Salud y más. Actualizado junio 2026.',
  url: `${SITE_URL}/historial-precios`,
  dateModified: '2026-06-01',
  inLanguage: 'es-AR',
  author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/historial-precios` },
}

export default function HistorialPreciosPage(): React.ReactElement {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="container">
          <BreadcrumbSchema crumbs={[{ label: 'Historial de precios de prepagas' }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-red-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-100 text-[#E8002D] text-xs font-semibold px-4 py-2 rounded-full mb-4">
            Datos verificados · Actualizado junio 2026
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Historial de precios de prepagas Argentina 2024–2026
          </h1>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            Seguí mes a mes cómo evolucionaron los precios de las principales prepagas. Datos basados en cuadros tarifarios de la Superintendencia de Salud.
          </p>
        </div>
      </section>

      {/* Stat destacado */}
      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-[#E8002D] text-white rounded-2xl p-6 flex flex-col justify-center">
              <div className="text-sm font-medium text-red-100 mb-1">OSDE Plan 310 · Persona 30 años</div>
              <div className="text-5xl font-bold mb-2">+294%</div>
              <div className="text-red-100 text-sm">
                Aumento acumulado enero 2024 → junio 2025.{' '}
                <span className="text-white font-medium">
                  De {formatPrecioHist(87500)} a {formatPrecioHist(345310)} por mes.
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Precio ene 2024</div>
                <div className="text-2xl font-bold text-gray-900">{formatPrecioHist(87500)}</div>
                <div className="text-xs text-gray-400 mt-1">OSDE 310 · base</div>
              </div>
              <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                <div className="text-xs text-gray-500 mb-1">Precio jun 2025</div>
                <div className="text-2xl font-bold text-[#E8002D]">{formatPrecioHist(345310)}</div>
                <div className="text-xs text-gray-400 mt-1">OSDE 310 · actual</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gráfico de barras horizontales */}
      <section className="py-10 bg-gray-50 border-y border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Evolución mensual OSDE Plan 310 — Jul 2024 a Jun 2025
            </h2>
            <p className="text-sm text-gray-500">
              Precio para persona de 30 años contratación individual (sin IVA diferenciado). Aumentos autorizados por la Superintendencia de Salud.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
            {historialOSDE310.map((dato) => {
              const pct = Math.round((dato.precio / maxPrecio) * 100)
              return (
                <div key={dato.mes} className="flex items-center gap-3">
                  <div className="w-20 text-xs text-gray-500 font-medium flex-shrink-0 text-right">
                    {dato.mes}
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-7 relative overflow-hidden">
                    <div
                      className="h-full rounded-full flex items-center justify-end pr-3 transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: '#E8002D',
                      }}
                    >
                      <span className="text-white text-xs font-semibold whitespace-nowrap">
                        {formatPrecioHist(dato.precio)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <p className="text-xs text-gray-400 mt-3">
            * Precios de referencia para persona de 30 años. Fuente: cuadros tarifarios OSDE / Superintendencia de Salud.
          </p>
        </div>
      </section>

      {/* Tabla comparativa junio 2026 */}
      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Precios actuales junio 2026 — comparativa por prepaga
            </h2>
            <p className="text-sm text-gray-500">
              Precios para persona de 30 años contratación particular/monotributista. Referencia ene 2024: OSDE 310 a $87.500.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Prepaga</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Plan</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-700">Precio/mes</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-700">vs ene 2024 (est.)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {preciosJunio2026.map((fila) => (
                  <tr key={`${fila.prepaga}-${fila.plan}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-gray-900">{fila.prepaga}</td>
                    <td className="px-5 py-4 text-gray-600">{fila.plan}</td>
                    <td className="px-5 py-4 text-right font-bold text-[#E8002D]">
                      {formatPrecioHist(fila.precio)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="inline-block bg-red-50 text-red-700 font-semibold text-xs px-2 py-1 rounded-full">
                        {calcVariacion(fila.precio, fila.precioEne2024)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            * La comparación vs enero 2024 usa como referencia el precio del OSDE 310 en ese período ($87.500). Los planes de cada prepaga pueden no ser equivalentes entre sí. Los porcentajes son estimativos.
          </p>
        </div>
      </section>

      {/* Contexto editorial */}
      <section className="py-10 bg-gray-50 border-y border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            ¿Por qué aumentaron tanto las prepagas en Argentina?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Desregulación de precios (2024)</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Desde enero 2024, el gobierno eliminó el control de precios sobre las prepagas. Los aumentos pasaron de ser autorizados por el Estado a ser libres, lo que generó subas mensuales de entre 7% y 16% durante el primer semestre de 2024.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Inflación y costos médicos</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Los costos del sistema de salud (honorarios médicos, insumos, medicamentos) se indexaron con la inflación general. Las prepagas trasladaron esos aumentos a los afiliados, con una aceleración mayor que el índice inflacionario general en varios meses.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Estabilización en 2025</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                A partir del segundo semestre de 2024 y durante 2025, los aumentos se moderaron. Entre enero y junio 2025, el OSDE 310 subió solo un 14,6% acumulado (de $301.440 a $345.310), frente al más del 100% que acumuló en el primer semestre de 2024.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Opciones si el precio es un problema</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Si trabajás en relación de dependencia, podés derivar tu aporte de obra social a la prepaga y ahorrar el 21% de IVA. También existen planes más económicos como Premedic Plan 300 ($135.000/mes) que mantienen cobertura PMO completa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-[#E8002D] text-white">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">
            Ver precios actualizados y cotizá
          </h2>
          <p className="text-red-100 mb-7 text-sm">
            Compará los precios actuales de todas las prepagas con tu edad real y encontrá el plan que mejor se ajusta a tu presupuesto.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center font-semibold rounded-lg px-7 py-3.5 text-base bg-[#00875A] text-white hover:bg-[#006644] transition-colors shadow-sm"
          >
            Ver precios actualizados y cotizá
          </Link>
        </div>
      </section>
    </>
  )
}
