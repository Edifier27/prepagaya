import Link from 'next/link'
import type { Prepaga } from '@/types'
import { formatPrecio } from '@/lib/utils'
import { PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import type { ComparacionPlanes as Datos } from '@/lib/planes-comparacion'
import { Carrusel } from '@/components/ui/Carrusel'

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
  const globos = globosDePlanes(datos)

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

        {/* Carrusel de tarjetas sin precios (Darío, 4-oct-2026): cada plan con
            su "globo" de lo que lo destaca, calculado con los mismos datos
            oficiales (ver globosDePlanes). */}
        <Carrusel
          etiqueta="planes"
          items={[
            // Línea Sport de Swiss siempre al final (Darío, 4-oct-2026)
            ...filas.filter((f) => !f.plan.slug.startsWith('sport')),
            ...filas.filter((f) => f.plan.slug.startsWith('sport')),
          ].map((f) => (
            <TarjetaPlan key={f.plan.slug} f={f} globos={globos.get(f.plan.slug) ?? []} hayCartilla={hayCartilla} href={href(f.plan.slug)} />
          ))}
        />
        <p className="text-xs text-gray-400 mt-2">
          {hayCartilla && `Sanatorios: centros con internación en la cartilla, en todo el país (${datos.fuenteCartilla}).`}
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

type Globo = { texto: string; tono: 'rojo' | 'verde' | 'azul' | 'violeta' }

/**
 * Qué destaca a cada plan, solo con los datos de la comparación:
 * - el más barato, el primero sin copago, la cartilla más amplia y el más completo;
 * - "+N sanatorios" en el plan donde crece la cartilla;
 * - por cobertura (fichas oficiales): en el primer plan (por precio) que la
 *   tiene, "Suma X"; si ya estaba en uno más barato con otro detalle, "Mejor en X".
 */
function globosDePlanes(datos: Datos): Map<string, Globo[]> {
  const out = new Map<string, Globo[]>()
  const poner = (slug: string, g: Globo) => out.set(slug, [...(out.get(slug) ?? []), g])
  poner(datos.entrada.plan.slug, { texto: 'Mejor precio', tono: 'verde' })
  if (datos.sinCopago && datos.sinCopago.plan.slug !== datos.entrada.plan.slug) poner(datos.sinCopago.plan.slug, { texto: 'Sin copago al menor precio', tono: 'verde' })
  if (datos.masSanatorios) poner(datos.masSanatorios.plan.slug, { texto: 'La cartilla más amplia', tono: 'azul' })
  for (const sa of datos.saltos) {
    const f = datos.filas.find((x) => x.plan.nombre === sa.hasta)
    if (f && f.plan.slug !== datos.masSanatorios?.plan.slug) poner(f.plan.slug, { texto: `+${sa.nuevos} sanatorios`, tono: 'azul' })
  }
  const vistos = new Map<string, string | undefined>()
  for (const f of datos.filas) {
    for (const c of f.incluye) {
      if (!vistos.has(c.tema)) {
        if (f.plan.slug !== datos.filas[0].plan.slug) poner(f.plan.slug, { texto: `Suma ${c.nombre.toLowerCase()}`, tono: 'violeta' })
      } else if (vistos.get(c.tema) && c.detalle && vistos.get(c.tema) !== c.detalle) {
        // Solo si los dos planes tienen el detalle y cambia: una ficha sin
        // detalle no dice que sea mejor ni peor
        poner(f.plan.slug, { texto: `Mejor en ${c.nombre.toLowerCase()}`, tono: 'violeta' })
      }
      if (c.detalle || !vistos.has(c.tema)) vistos.set(c.tema, c.detalle)
    }
  }
  if (datos.completo.plan.slug !== datos.entrada.plan.slug) poner(datos.completo.plan.slug, { texto: 'El más completo', tono: 'rojo' })
  // Orden para el tope de 3: precio/copago, el más completo, lo que suma, en qué mejora, sanatorios
  const prioridad = (g: Globo) => (g.tono === 'verde' ? 0 : g.tono === 'rojo' ? 1 : g.texto.startsWith('Suma') ? 2 : g.tono === 'violeta' ? 3 : 4)
  for (const [k, v] of out) out.set(k, [...v].sort((a, b) => prioridad(a) - prioridad(b)))
  return out
}

const TONO: Record<Globo['tono'], string> = {
  rojo: 'bg-[#E8002D] text-white',
  verde: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  azul: 'bg-sky-50 text-sky-700 border border-sky-200',
  violeta: 'bg-violet-50 text-violet-700 border border-violet-200',
}

function TarjetaPlan({ f, globos, hayCartilla, href }: { f: Datos['filas'][number]; globos: Globo[]; hayCartilla: boolean; href: string }) {
  return (
    <Link href={href} className="h-full rounded-2xl border-2 border-gray-100 hover:border-[#E8002D]/40 bg-white p-4 flex flex-col gap-2 transition-colors group">
      {globos.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {globos.slice(0, 3).map((g) => (
            <span key={g.texto} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TONO[g.tono]}`}>{g.texto}</span>
          ))}
        </div>
      )}
      <div className="font-bold text-gray-900 group-hover:text-[#E8002D] transition-colors">{f.plan.nombre}</div>
      <div className="text-xs text-gray-500">
        {f.plan.copago ? 'Con copago' : 'Sin copago'}
        {hayCartilla && f.sanatorios ? ` · ${f.sanatorios} sanatorios para internación` : ''}
      </div>
      {f.incluye.length > 0 && (
        <ul className="mt-1 space-y-1 text-xs text-gray-600">
          {f.incluye.map((c) => (
            <li key={c.tema} className="flex gap-1.5">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>{c.nombre}{c.detalle ? <span className="text-gray-400"> · {c.detalle}</span> : null}</span>
            </li>
          ))}
        </ul>
      )}
      <span className="mt-auto pt-2 text-sm font-semibold text-[#E8002D]">Ver el plan →</span>
    </Link>
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
