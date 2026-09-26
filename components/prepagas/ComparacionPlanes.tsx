import Link from 'next/link'
import type { Prepaga } from '@/types'
import { formatPrecio } from '@/lib/utils'
import { PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import type { ComparacionPlanes as Datos } from '@/lib/planes-comparacion'

// Sección "Diferencias entre los planes de X" de la ficha (26-sep-2026): tabla
// de todos los planes con precio oficial, copago, sanatorios de la cartilla
// oficial y coberturas de los documentos de la prepaga; qué suma cada escalón
// y qué plan conviene según lo que busques. Datos: lib/planes-comparacion.ts.

export function ComparacionPlanes({ prep, datos }: { prep: Prepaga; datos: Datos }) {
  const { filas, saltos, entrada, sinCopago, masSanatorios, completo } = datos
  const hayCartilla = filas.some((f) => f.sanatorios)
  const hayCoberturas = datos.temas.length > 0
  const mes = PRECIO_ACTUALIZADO.toLowerCase()
  const href = (slug: string) => `/prepagas/${prep.slug}/${slug}`

  return (
    <section id="diferencias-planes" className="py-10 bg-white border-t border-gray-100 scroll-mt-24">
      <div className="container max-w-5xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Diferencias entre los planes de {prep.nombre}: cuál elegir</h2>
        <p className="text-sm text-gray-600 mb-5 max-w-3xl">
          {prep.nombre} tiene {filas.length} planes. Van de {formatPrecio(entrada.plan.precio)} ({entrada.plan.nombre}) a {formatPrecio(completo.plan.precio)} ({completo.plan.nombre}) por mes para una persona de 30 años
          {entrada.oficial ? `, según el cuadro tarifario oficial de ${mes}` : ` (precio de referencia, ${mes})`}.
          {hayCartilla ? ' Además del precio, cambian el copago, los sanatorios de la cartilla' : ' Además del precio, cambia el copago'}
          {hayCoberturas ? ' y coberturas como ' + datos.temas.slice(0, 3).map((t) => t.nombre.toLowerCase()).join(', ') : ''}.
        </p>

        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <table className="w-full text-sm">
            <caption className="sr-only">Planes de {prep.nombre} comparados: precio, copago{hayCartilla ? ', sanatorios' : ''}{hayCoberturas ? ' y coberturas' : ''}</caption>
            <thead className="bg-gray-50 text-left text-xs text-gray-500">
              <tr>
                <th scope="col" className="px-3 py-2.5 font-semibold">Plan</th>
                <th scope="col" className="px-3 py-2.5 font-semibold text-right">Precio 30 años</th>
                {hayCartilla && <th scope="col" className="px-3 py-2.5 font-semibold text-right">Sanatorios</th>}
              </tr>
            </thead>
            <tbody>
              {filas.map((f) => (
                <FilaTabla key={f.plan.slug} f={f} hayCartilla={hayCartilla} href={href(f.plan.slug)} />
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {filas.every((f) => f.oficial) ? `Precio de lista oficial (SSSalud, ${mes}), contratación individual.` : `Precios de lista para 30 años, ${mes}${filas.some((f) => f.oficial) ? '; los marcados con ✓ son del cuadro oficial de la SSSalud' : ''}.`}
          {hayCartilla && ` Sanatorios: centros con internación en la cartilla, en todo el país (${datos.fuenteCartilla}).`}
          {hayCoberturas && (datos.fuentesCobertura.length <= 2
            ? ` Coberturas: ${datos.fuentesCobertura.join('; ')}.`
            : ` Coberturas: ${datos.fuentesCobertura.length} documentos oficiales de ${prep.nombre}; cada uno está citado en su página de cobertura.`)}
        </p>

        {saltos.length > 0 && (
          <>
            <h3 className="text-base font-bold text-gray-900 mt-8 mb-3">Qué sanatorios suma cada plan de {prep.nombre}</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {saltos.map((s) => (
                <li key={s.hasta} className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                  <strong className="text-gray-900">De {s.desde} a {s.hasta}:</strong> {s.nuevos} sanatorio{s.nuevos === 1 ? '' : 's'} más para internación
                  {s.ejemplos.length > 0 && <>, entre ellos {s.ejemplos.join(', ')}</>}.
                </li>
              ))}
            </ul>
          </>
        )}

        <h3 className="text-base font-bold text-gray-900 mt-8 mb-3">¿Qué plan de {prep.nombre} te conviene?</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <Recomendacion titulo="Para entrar al menor precio" f={entrada} href={href(entrada.plan.slug)}
            texto={`${formatPrecio(entrada.plan.precio)} por mes${entrada.plan.copago ? ', con copago en consultas' : ', sin copago en consultas'}.`} />
          {sinCopago && (
            <Recomendacion titulo="Sin copago, al menor precio" f={sinCopago} href={href(sinCopago.plan.slug)}
              texto={`${formatPrecio(sinCopago.plan.precio)} por mes: no pagás cada consulta.`} />
          )}
          {masSanatorios && (
            <Recomendacion titulo="La cartilla más amplia" f={masSanatorios} href={href(masSanatorios.plan.slug)}
              texto={`${masSanatorios.sanatorios} sanatorios para internación, desde ${formatPrecio(masSanatorios.plan.precio)}.${masSanatorios.cartillaLabel ? ` Misma cartilla: ${masSanatorios.cartillaLabel}.` : ''}`} />
          )}
          <Recomendacion titulo="El plan más completo" f={completo} href={href(completo.plan.slug)}
            texto={`${formatPrecio(completo.plan.precio)} por mes${completo.sanatorios ? `, ${completo.sanatorios} sanatorios para internación` : ''}${completo.incluye.length ? ` e incluye ${completo.incluye.map((c) => c.nombre.toLowerCase()).join(', ')}` : ''}.`} />
        </ul>
      </div>
    </section>
  )
}

function FilaTabla({ f, hayCartilla, href }: { f: Datos['filas'][number]; hayCartilla: boolean; href: string }) {
  return (
    <>
      <tr className="border-t border-gray-100 align-top">
        <th scope="row" className={`px-3 pt-3 ${f.incluye.length ? 'pb-1' : 'pb-3'} text-left font-normal`}>
          <Link href={href} className="font-semibold text-gray-900 hover:text-[#E8002D] whitespace-nowrap">{f.plan.nombre}</Link>
          <div className="text-xs text-gray-500">{f.plan.copago ? 'Con copago' : 'Sin copago'}</div>
        </th>
        <td className="px-3 pt-3 pb-1 text-right tabular-nums whitespace-nowrap">
          {formatPrecio(f.plan.precio)}
          {f.oficial ? <span className="ml-1 text-[10px] text-green-700" title="Precio oficial SSSalud">✓</span> : <span className="block text-[10px] text-gray-400">referencia, no oficial</span>}
        </td>
        {hayCartilla && (
          <td className="px-3 pt-3 pb-1 text-right tabular-nums">
            {f.sanatorios ? (f.cartillaHref ? <Link href={f.cartillaHref} className="text-[#E8002D] hover:underline">{f.sanatorios}</Link> : f.sanatorios) : <span className="text-gray-300">—</span>}
          </td>
        )}
      </tr>
      {f.incluye.length > 0 && (
        <tr>
          <td colSpan={hayCartilla ? 3 : 2} className="px-3 pb-3 text-xs text-gray-500">
            Incluye: {f.incluye.map((c) => (c.detalle ? `${c.nombre} (${c.detalle})` : c.nombre)).join(' · ')}
          </td>
        </tr>
      )}
    </>
  )
}

function Recomendacion({ titulo, f, href, texto }: { titulo: string; f: Datos['filas'][number]; href: string; texto: string }) {
  return (
    <li className="rounded-xl border border-gray-200 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">{titulo}</div>
      <Link href={href} className="mt-1 block font-bold text-gray-900 hover:text-[#E8002D]">{f.plan.nombre} →</Link>
      <p className="mt-1 text-gray-600">{texto}</p>
    </li>
  )
}
