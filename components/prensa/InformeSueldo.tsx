import type { ReactNode } from 'react'
import Link from 'next/link'
import { PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { APORTE_DERIVABLE, SITE_NAME, SITE_URL } from '@/lib/utils'
import { MES, PERFILES, millones, millonesLargo, resumenSueldos, textosInforme, type FilaSueldo } from '@/lib/prensa/sueldo-prepaga'

// Página del informe "cuánto hay que ganar para que los aportes paguen la
// prepaga" (lib/prensa/sueldo-prepaga.ts): la usan el informe del AMBA y los
// de cada provincia.

interface Props {
  filas: FilaSueldo[]
  /** "en el AMBA", "en Córdoba" */
  lugar: string
  /** Para la metodología y la tabla: "AMBA", "Córdoba" */
  region: string
  h1: string
  url: string
  /** Migas después de Prensa; la última es la página actual */
  migas: { nombre: string; href?: string }[]
  /** Secciones propias de cada página, después de la tabla */
  children?: ReactNode
}

export function InformeSueldo({ filas, lugar, region, h1, url, migas, children }: Props) {
  const { min30, osde, swiss, famMin } = resumenSueldos(filas)
  const { titular, cita } = textosInforme(filas, lugar)
  const ref45 = osde ?? swiss
  const regionTexto = region === 'AMBA' ? 'del AMBA' : `de ${region}`

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: titular,
      description: cita,
      url,
      inLanguage: 'es-AR',
      author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      publisher: { '@id': `${SITE_URL}/#organization` },
      isBasedOn: 'https://cuadrostarifarios.sssalud.gob.ar/',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Prensa', item: `${SITE_URL}/prensa` },
        ...migas.map((m, i) => ({ '@type': 'ListItem', position: 3 + i, name: m.nombre, ...(m.href ? { item: `${SITE_URL}${m.href}` } : {}) })),
      ],
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-[#E8002D]">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <Link href="/prensa" className="hover:text-[#E8002D]">Prensa</Link>
            {migas.map((m) => (
              <span key={m.nombre} className="flex items-center gap-1">
                <span className="text-gray-300">›</span>
                {m.href ? <Link href={m.href} className="hover:text-[#E8002D]">{m.nombre}</Link> : <span className="text-gray-700">{m.nombre}</span>}
              </span>
            ))}
          </nav>
        </div>
      </div>

      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-10">
        <div className="container max-w-3xl! mx-auto">
          <p className="text-xs font-semibold text-[#E8002D] uppercase tracking-wide">Informe {SITE_NAME} · {PRECIO_ACTUALIZADO}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance mt-2">{h1}</h1>
          <p className="text-gray-700 mt-3 leading-relaxed">
            {titular}.
            {swiss ? ` Para el plan de entrada de Swiss Medical hacen falta ${millonesLargo(swiss.sueldo.s30)}` : ''}
            {swiss && osde ? `; para el de OSDE, ${millonesLargo(osde.sueldo.s30)}.` : swiss ? '.' : ''}
          </p>

          {min30 && ref45 && famMin && (
            <div className="mt-6 grid gap-3 grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
                <p className="text-lg sm:text-2xl font-black text-gray-900 tabular-nums">{millones(min30.sueldo.s30)}</p>
                <p className="text-xs text-gray-600">a los 30 años, en la prepaga más accesible</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
                <p className="text-lg sm:text-2xl font-black text-gray-900 tabular-nums">{millones(ref45.sueldo.s45)}</p>
                <p className="text-xs text-gray-600">para {ref45.prepaga} a los 45 años</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
                <p className="text-lg sm:text-2xl font-black text-gray-900 tabular-nums">{millones(famMin.sueldo.fam)}</p>
                <p className="text-xs text-gray-600">como mínimo, entre los dos sueldos, una familia de 4</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-3xl! mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sueldo bruto mensual para no pagar diferencia</h2>
          <p className="text-sm text-gray-600 mb-4">Plan de entrada de cada prepaga, cuadro oficial con aportes {regionTexto}, {MES}. Con un sueldo menor, la persona paga la diferencia entre sus aportes y el precio del plan.</p>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs text-gray-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Prepaga y plan</th>
                  {PERFILES.map((p) => <th key={p.id} className="px-3 py-2 font-semibold text-right whitespace-nowrap">{p.corto}</th>)}
                </tr>
              </thead>
              <tbody>
                {filas.map((f) => (
                  <tr key={f.prepaga} className="border-t border-gray-100">
                    <td className="px-3 py-2"><span className="font-semibold text-gray-900">{f.prepaga}</span><span className="block text-xs text-gray-500">{f.plan}</span></td>
                    {PERFILES.map((p) => <td key={p.id} className="px-3 py-2 text-right tabular-nums text-gray-800 whitespace-nowrap">{millones(f.sueldo[p.id])}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">&quot;Familia de 4&quot;: pareja de 40 y 38 años con hijos de 10 y 7, que unifican los aportes de sus dos sueldos (el valor es la suma de ambos).</p>

          <div className="mt-8 rounded-2xl border-2 border-[#E8002D]/20 bg-gradient-to-r from-red-50 to-white p-5 flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="flex-1 text-sm text-gray-700"><strong className="text-gray-900">¿Y con tu sueldo?</strong> La calculadora te dice cuánto aportás y cuánto pagarías de diferencia en cada plan.</p>
            <Link href="/calculadora-aportes" className="shrink-0 inline-flex items-center justify-center px-5 py-2.5 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm">Calcular mi diferencia →</Link>
          </div>

          {children}

          <h2 className="text-xl font-bold text-gray-900 mt-10 mb-2">Metodología</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-700">
            <li>Precios: cuadros tarifarios que cada prepaga declara ante la Superintendencia de Servicios de Salud, en la modalidad &quot;con aportes&quot; (sin IVA), {region === 'AMBA' ? 'AMBA' : `región que cada prepaga declara para ${region}`}, {MES}.</li>
            <li>Plan de entrada: el más económico de cada prepaga con cuadro publicado para esa modalidad. Se usa el mismo plan para los tres perfiles.</li>
            <li>Aporte que llega a la prepaga: {(APORTE_DERIVABLE * 100).toLocaleString('es-AR')}% del sueldo bruto (el 3% del trabajador y el 6% del empleador, menos lo que va al Fondo Solidario de Redistribución).</li>
            <li>Sueldo necesario = precio del plan ÷ {(APORTE_DERIVABLE * 100).toLocaleString('es-AR')}%. No incluye promociones ni descuentos comerciales.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 mt-10 mb-2">Para citar</h2>
          <blockquote className="rounded-xl border-l-4 border-[#E8002D] bg-gray-50 p-4 text-sm text-gray-800 leading-relaxed">{cita}</blockquote>
          <p className="text-sm text-gray-600 mt-3">Podés usar estos datos citando a {SITE_NAME} con un enlace a esta página. Consultas de prensa: <a href="mailto:hola@prepagaya.com.ar" className="text-[#E8002D] hover:underline">hola@prepagaya.com.ar</a>.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
            <Link href="/prensa" className="text-sm font-semibold text-[#E8002D] hover:underline">Informe mensual de aumentos →</Link>
            <Link href="/prensa/sondeo" className="text-sm font-semibold text-[#E8002D] hover:underline">Sondeo: quién busca prepaga →</Link>
            <Link href="/guias/derivar-obra-social-a-prepaga" className="text-sm font-semibold text-[#E8002D] hover:underline">Cómo derivar los aportes →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
