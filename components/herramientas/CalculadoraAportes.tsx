'use client'

import { Suspense, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { PROVINCIAS } from '@/lib/data/provincias-cotizador'
import { useZonaDetectada } from '@/lib/use-zona-detectada'
import { enviarLead, preciosDelGrupo } from '@/lib/leads-cliente'
import { APORTE_DERIVABLE, formatPrecio, PRIORIDAD_PARTNERS, TIEMPO_RESPUESTA } from '@/lib/utils'
import { FormularioLead, type DatosFormulario } from './FormularioLead'
import type { PrepagaCotizable, PlanCotizable } from '@/lib/data/planes-cotizables'

// Calculadora de aportes (24-sep-2026): "de tu obra social a una prepaga".
// Es la oferta para todo el tráfico de obras sociales (docs/seo/universo-
// busquedas.md): con el sueldo bruto se estima el aporte que se deriva y,
// con el precio oficial "con aportes" de cada plan, cuánto se pagaría de
// diferencia. Sin datos: el aporte y cuántos planes quedan cubiertos. Con
// datos: plan por plan (misma regla de precios que el resto del sitio).

interface Props {
  prepagas: PrepagaCotizable[]
  /** Nombres de obras sociales para autocompletar (fichas del sitio) */
  obrasSociales: { slug: string; nombre: string }[]
  inicialOs?: string
}

interface Fila { prepaga: PrepagaCotizable; plan: PlanCotizable; valor: number; diferencia: number }

const numero = (s: string) => parseInt(s.replace(/\D/g, ''), 10) || 0
const miles = (n: number) => (n ? n.toLocaleString('es-AR') : '')

function Calculadora({ prepagas, obrasSociales, inicialOs }: Props) {
  const [sueldo, setSueldo] = useState('')
  const [sueldoPareja, setSueldoPareja] = useState('')
  const [conPareja, setConPareja] = useState(false)
  const [edades, setEdades] = useState<string[]>([''])
  const [provincia, setProvincia] = useState('')
  const [obraSocial, setObraSocial] = useState(() => obrasSociales.find((o) => o.slug === inicialOs)?.nombre ?? '')
  const [estado, setEstado] = useState<'idle' | 'cargando' | 'listo'>('idle')
  const [precios, setPrecios] = useState<Record<string, number>>({})
  const [formAbierto, setFormAbierto] = useState(false)
  const [nombre, setNombre] = useState<string | null>(null)
  const [verTodos, setVerTodos] = useState(false)
  const resultado = useRef<HTMLDivElement>(null)

  // Zona precargada por la ubicación aproximada; la persona la puede cambiar.
  const detectada = useZonaDetectada()
  const provinciaElegida = provincia || detectada?.provincia.slug || ''
  const prov = PROVINCIAS.find((p) => p.slug === provinciaElegida)
  const edadesNum = edades.map((e) => parseInt(e, 10)).filter((n) => Number.isInteger(n) && n >= 0 && n <= 99)
  const aporte = Math.round((numero(sueldo) + (conPareja ? numero(sueldoPareja) : 0)) * APORTE_DERIVABLE)
  const completo = numero(sueldo) > 0 && Boolean(prov) && edadesNum.length === edades.length && edadesNum.length > 0

  function cambiar<T>(set: (v: T) => void) {
    return (v: T) => { set(v); setEstado('idle') }
  }

  async function calcular(e: React.FormEvent) {
    e.preventDefault()
    if (!completo || !prov) return
    setEstado('cargando')
    setPrecios(await preciosDelGrupo(prov.zonaKey, edadesNum, 'desregulado'))
    setEstado('listo')
    setTimeout(() => resultado.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const edadOk = (pl: PlanCotizable) => edadesNum.every((x) => (pl.edadMinima === undefined || x >= pl.edadMinima) && (pl.edadMaxima === undefined || x <= pl.edadMaxima))
  const filas: Fila[] = estado === 'listo'
    ? prepagas.flatMap((p) => p.planes.filter(edadOk).map((pl) => {
      const valor = precios[`${p.slug}/${pl.slug}`] ?? 0
      return { prepaga: p, plan: pl, valor, diferencia: Math.max(0, valor - aporte) }
    })).filter((f) => f.valor > 0)
    : []
  const cubiertos = filas.filter((f) => f.diferencia === 0)
  const prioridad = (s: string) => (PRIORIDAD_PARTNERS.includes(s) ? PRIORIDAD_PARTNERS.indexOf(s) : PRIORIDAD_PARTNERS.length)
  // Una opción por prepaga: la de menor diferencia (entre las que quedan
  // cubiertas, la de más valor, o sea el mejor plan). Partners primero.
  const mejores = new Map<string, Fila>()
  for (const f of [...filas].sort((a, b) => a.diferencia - b.diferencia || b.valor - a.valor)) {
    if (!mejores.has(f.prepaga.slug)) mejores.set(f.prepaga.slug, f)
  }
  const destacadas = [...mejores.values()].sort((a, b) => prioridad(a.prepaga.slug) - prioridad(b.prepaga.slug) || a.diferencia - b.diferencia)
  const todas = [...filas].sort((a, b) => a.diferencia - b.diferencia || a.valor - b.valor)

  async function enviar(d: DatosFormulario) {
    await enviarLead({
      ...d,
      edades: edadesNum,
      fuente: 'calculadora-aportes',
      provincia: prov?.nombre ?? '',
      interes: destacadas.slice(0, 3).map((f) => `${f.prepaga.nombre} ${f.plan.nombre}`).join(' · '),
      prepagaActual: 'Obra social',
      preferencias: { perfil: `Relación de dependencia · aporte estimado ${formatPrecio(aporte)}/mes${conPareja ? ' (unifica con la pareja)' : ''}${obraSocial ? ` · hoy: ${obraSocial.slice(0, 60)}` : ''}` },
    })
    setNombre(d.nombre)
    setFormAbierto(false)
  }

  const campo = 'w-full rounded-xl border-2 border-gray-200 px-3 py-3 text-base bg-white focus:outline-none focus:border-[#E8002D]'
  const precio = (n: number) => (nombre ? formatPrecio(n) : <span className="blur-[5px] select-none text-gray-300" aria-hidden>$ 000.000</span>)

  return (
    <div>
      <form onSubmit={calcular} className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4 shadow-sm">
        <div>
          <label htmlFor="ca-sueldo" className="block text-sm font-semibold text-gray-800 mb-1">Tu sueldo bruto mensual</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input id="ca-sueldo" inputMode="numeric" value={miles(numero(sueldo))} onChange={(e) => cambiar(setSueldo)(e.target.value)} placeholder="1.500.000" className={`${campo} pl-7`} />
          </div>
          <p className="text-xs text-gray-500 mt-1">El que figura en tu recibo antes de los descuentos.</p>
        </div>
        <label className="flex items-start gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={conPareja} onChange={(e) => cambiar(setConPareja)(e.target.checked)} className="mt-1" />
          Mi pareja también trabaja en relación de dependencia (se pueden sumar los dos aportes)
        </label>
        {conPareja && (
          <div>
            <label htmlFor="ca-sueldo2" className="block text-sm font-semibold text-gray-800 mb-1">Sueldo bruto de tu pareja</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input id="ca-sueldo2" inputMode="numeric" value={miles(numero(sueldoPareja))} onChange={(e) => cambiar(setSueldoPareja)(e.target.value)} className={`${campo} pl-7`} />
            </div>
          </div>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ca-provincia" className="block text-sm font-semibold text-gray-800 mb-1">Dónde vivís</label>
            <select id="ca-provincia" value={provinciaElegida} onChange={(e) => cambiar(setProvincia)(e.target.value)} className={campo}>
              <option value="">Elegí…</option>
              {PROVINCIAS.map((p) => <option key={p.slug} value={p.slug}>{p.nombre}</option>)}
            </select>
            {!provincia && detectada && <p className="mt-1 text-xs text-gray-500">📍 Por tu ubicación aproximada: {detectada.label}. Si no es tu zona, cambiala.</p>}
          </div>
          <div>
            <label htmlFor="ca-os" className="block text-sm font-semibold text-gray-800 mb-1">Tu obra social hoy <span className="font-normal text-gray-500">(opcional)</span></label>
            <input id="ca-os" list="ca-os-lista" value={obraSocial} onChange={(e) => setObraSocial(e.target.value)} placeholder="Ej. OSECAC" className={campo} autoComplete="off" />
            <datalist id="ca-os-lista">{obrasSociales.map((o) => <option key={o.slug} value={o.nombre} />)}</datalist>
          </div>
        </div>
        <fieldset>
          <legend className="block text-sm font-semibold text-gray-800 mb-1">Edad de cada persona que se asocia</legend>
          <div className="flex flex-wrap gap-2">
            {edades.map((v, i) => (
              <div key={i} className="relative">
                <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={2} value={v}
                  onChange={(e) => cambiar(setEdades)(edades.map((x, j) => (j === i ? e.target.value.replace(/\D/g, '').slice(0, 2) : x)))}
                  placeholder={i === 0 ? 'Tu edad' : 'Edad'} aria-label={i === 0 ? 'Tu edad' : `Edad de la persona ${i + 1}`} className={`${campo} w-28 pr-7`} />
                {i > 0 && <button type="button" onClick={() => cambiar(setEdades)(edades.filter((_, j) => j !== i))} aria-label={`Sacar persona ${i + 1}`} className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 hover:text-gray-700">×</button>}
              </div>
            ))}
            {edades.length < 6 && <button type="button" onClick={() => cambiar(setEdades)([...edades, ''])} className="rounded-xl border-2 border-dashed border-gray-300 px-3 text-sm font-semibold text-gray-600 hover:border-gray-400">+ Persona</button>}
          </div>
        </fieldset>
        <button type="submit" disabled={!completo || estado === 'cargando'} className="w-full py-4 bg-[#E8002D] hover:bg-[#B8001F] disabled:bg-gray-200 disabled:text-gray-500 text-white font-bold rounded-2xl transition-colors">
          {estado === 'cargando' ? 'Calculando…' : 'Calcular mi diferencia'}
        </button>
      </form>

      {estado === 'listo' && (
        <div ref={resultado} className="mt-6 space-y-4 scroll-mt-20" aria-live="polite">
          <section className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-600">Tus aportes que se pueden pasar a una prepaga{conPareja ? ' (sumando a tu pareja)' : ''}</p>
            <p className="text-3xl font-black text-gray-900 tabular-nums mt-1">{formatPrecio(aporte)} <span className="text-base font-semibold text-gray-500">por mes</span></p>
            <p className="text-xs text-gray-500 mt-2">Estimado: 7,5% del sueldo bruto. Vos y tu empleador aportan 9% a la obra social y entre 10% y 15% de eso va al Fondo Solidario de Redistribución.</p>
          </section>

          {filas.length === 0 ? (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
              Para {prov?.nombre ?? 'tu zona'} las prepagas no publican un cuadro con aportes para estas edades. Un asesor te lo cotiza. <button type="button" onClick={() => setFormAbierto(true)} className="font-semibold underline">Quiero que me contacten</button>
            </section>
          ) : (
            <section className="rounded-2xl border-2 border-[#E8002D]/20 bg-red-50/40 p-5">
              <h2 className="text-lg font-bold text-gray-900">
                {cubiertos.length > 0
                  ? `Con tus aportes, ${cubiertos.length === 1 ? 'un plan te sale' : `${cubiertos.length} planes te salen`} sin pagar diferencia`
                  : 'Con tus aportes, pagás solo la diferencia'}
              </h2>
              <p className="text-sm text-gray-700 mt-1">
                {obraSocial ? `Hoy tus aportes van a ${obraSocial}. ` : ''}Pasándolos a una prepaga, el aporte se descuenta de la cuota y el precio no lleva IVA.
              </p>
              <ul className="mt-4 space-y-2">
                {destacadas.slice(0, 5).map((f) => (
                  <li key={`${f.prepaga.slug}/${f.plan.slug}`} className="flex items-center justify-between gap-3 rounded-xl bg-white border border-gray-200 px-4 py-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 text-sm">{f.prepaga.nombre}</div>
                      {nombre ? <Link href={`/prepagas/${f.prepaga.slug}/${f.plan.slug}`} className="text-xs text-[#E8002D] hover:underline">{f.plan.nombre}</Link> : <div className="text-xs text-gray-400 blur-[4px] select-none" aria-hidden>Plan 000</div>}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-gray-900 tabular-nums">{f.diferencia === 0 && nombre ? 'Sin diferencia' : precio(f.diferencia)}</div>
                      <div className="text-[11px] text-gray-500">{nombre ? `${f.diferencia ? 'de diferencia' : 'lo cubren tus aportes'} · plan ${formatPrecio(f.valor)}` : 'de diferencia por mes'}</div>
                    </div>
                  </li>
                ))}
              </ul>
              {nombre ? (
                <>
                  <p className="text-sm text-green-900 bg-green-50 border border-green-200 rounded-xl p-3 mt-4">
                    <strong>Listo, {nombre}.</strong> Un asesor te escribe en {TIEMPO_RESPUESTA} para confirmar tu aporte con el recibo y hacer el cambio sin que te quedes sin cobertura.
                  </p>
                  <button type="button" onClick={() => setVerTodos(!verTodos)} className="mt-3 text-sm font-semibold text-gray-700 hover:text-gray-900">{verTodos ? 'Ocultar' : `Ver los ${todas.length} planes`}</button>
                  {verTodos && (
                    <table className="mt-2 w-full text-sm">
                      <thead><tr className="text-left text-xs text-gray-500"><th className="py-1 font-medium">Plan</th><th className="py-1 font-medium text-right">Valor con aportes</th><th className="py-1 font-medium text-right">Tu diferencia</th></tr></thead>
                      <tbody className="divide-y divide-gray-100">
                        {todas.map((f) => (
                          <tr key={`${f.prepaga.slug}/${f.plan.slug}`}>
                            <td className="py-1.5"><Link href={`/prepagas/${f.prepaga.slug}/${f.plan.slug}`} className="hover:text-[#E8002D]">{f.prepaga.nombre} {f.plan.nombre}</Link></td>
                            <td className="py-1.5 text-right tabular-nums">{formatPrecio(f.valor)}</td>
                            <td className="py-1.5 text-right tabular-nums font-semibold">{f.diferencia ? formatPrecio(f.diferencia) : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              ) : (
                <button type="button" onClick={() => setFormAbierto(true)} className="mt-4 w-full py-4 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-2xl transition-colors">
                  Ver cuánto pago de diferencia en cada plan →
                </button>
              )}
              <p className="text-xs text-gray-500 mt-3">Valores con aportes (sin IVA) del cuadro que cada prepaga declara ante la Superintendencia de Servicios de Salud. El aporte real sale de tu recibo: el asesor lo confirma antes del cambio.</p>
            </section>
          )}
        </div>
      )}

      {formAbierto && (
        <FormularioLead
          titulo="Tu diferencia plan por plan"
          bajada="Te mostramos cuánto pagarías en cada plan con tus aportes y un asesor te ayuda con el cambio."
          textoBoton="Ver mi diferencia →"
          onCerrar={() => setFormAbierto(false)}
          onEnviar={enviar}
        />
      )}
    </div>
  )
}

function ConObraSocialDeUrl(props: Omit<Props, 'inicialOs'>) {
  const os = useSearchParams().get('os') ?? undefined
  return <Calculadora key={os} inicialOs={os} {...props} />
}

/** El formulario sale en el HTML y, ya en el navegador, toma ?os= del link (fichas de obra social). */
export function CalculadoraAportes(props: Omit<Props, 'inicialOs'>) {
  return (
    <Suspense fallback={<Calculadora {...props} />}>
      <ConObraSocialDeUrl {...props} />
    </Suspense>
  )
}
