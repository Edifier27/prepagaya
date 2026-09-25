'use client'

import { Suspense, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { PROVINCIAS } from '@/lib/data/provincias-cotizador'
import { useZonaDetectada } from '@/lib/use-zona-detectada'
import { enviarLead, preciosDelGrupo } from '@/lib/leads-cliente'
import { formatPrecio, PRIORIDAD_PARTNERS, TIEMPO_RESPUESTA } from '@/lib/utils'
import { FormularioLead, type DatosFormulario } from './FormularioLead'

// "Ya tengo prepaga" (/chequeo-prepaga, 24-sep-2026): la persona carga su
// plan, sus edades y su zona, y ve el precio de lista oficial de SU plan, el
// aumento oficial que viene y cuántos planes de precio parecido le salen
// menos. El precio de su propio plan se muestra (ya lo paga); las
// alternativas con precio, después de dejar los datos.

export interface PlanChequeo { slug: string; nombre: string; edadMinima?: number; edadMaxima?: number }
export interface PrepagaChequeo { slug: string; nombre: string; planes: PlanChequeo[] }
export interface AumentoChequeo { mes: string; mediana: number; minimo: number; maximo: number; promedio: number }

interface Props {
  /** Prepaga ya elegida (link desde la ficha: /chequeo-prepaga?prepaga=osde) */
  inicial?: string
  prepagas: PrepagaChequeo[]
  /** prepaga → aumentos oficiales, del más viejo al más nuevo */
  aumentos: Record<string, AumentoChequeo[]>
  /** "septiembre 2026" */
  mesPrecios: string
}

// Alternativas "de precio parecido": hasta 40% más baratas. Las más baratas
// del mercado suelen ser de otro nivel de cobertura y no sirven de comparación.
const PISO_SIMILAR = 0.6
// Menos de 3% de ahorro no justifica un cambio de prepaga: no se muestra.
const AHORRO_MINIMO = 0.03
const PREPAGA_ACTUAL: Record<string, string> = {
  'swiss-medical': 'Swiss Medical', osde: 'OSDE', galeno: 'Galeno', medife: 'Medifé',
  'sancor-salud': 'Sancor Salud', avalian: 'Avalian', premedic: 'Premedic',
}
const pct = (n: number) => `${n.toLocaleString('es-AR')}%`

interface Alternativa { prepaga: PrepagaChequeo; plan: PlanChequeo; precio: number; ahorro: number }

export function ChequeoPrepaga({ inicial, prepagas, aumentos, mesPrecios }: Props) {
  const [prepagaSlug, setPrepagaSlug] = useState(() => (inicial && prepagas.some((p) => p.slug === inicial) ? inicial : ''))
  const [planSlug, setPlanSlug] = useState('')
  const [edades, setEdades] = useState<string[]>([''])
  const [provincia, setProvincia] = useState('')
  const [modalidad, setModalidad] = useState<'directo' | 'desregulado'>('directo')
  const [estado, setEstado] = useState<'idle' | 'cargando' | 'listo'>('idle')
  const [precios, setPrecios] = useState<Record<string, number>>({})
  const [formAbierto, setFormAbierto] = useState(false)
  const [desbloqueado, setDesbloqueado] = useState<string | null>(null)
  const resultadoRef = useRef<HTMLDivElement>(null)

  const prepaga = prepagas.find((p) => p.slug === prepagaSlug)
  const plan = prepaga?.planes.find((p) => p.slug === planSlug)
  // Zona precargada por la ubicación aproximada; la persona la puede cambiar.
  const detectada = useZonaDetectada()
  const provinciaElegida = provincia || detectada?.provincia.slug || ''
  const prov = PROVINCIAS.find((p) => p.slug === provinciaElegida)
  const edadesNum = edades.map((e) => parseInt(e, 10)).filter((n) => Number.isInteger(n) && n >= 0 && n <= 99)
  const completo = Boolean(prepaga && plan && prov && edadesNum.length === edades.length && edadesNum.length > 0)

  async function chequear(e: React.FormEvent) {
    e.preventDefault()
    if (!completo || !prov) return
    setEstado('cargando')
    setDesbloqueado(null)
    setPrecios(await preciosDelGrupo(prov.zonaKey, edadesNum, modalidad))
    setEstado('listo')
    setTimeout(() => resultadoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  // Si cambia algo del formulario, el resultado anterior deja de valer.
  function cambiar<T>(set: (v: T) => void) {
    return (v: T) => { set(v); setEstado('idle') }
  }

  const actual = prepaga && plan ? precios[`${prepaga.slug}/${plan.slug}`] : undefined
  const serie = prepaga ? aumentos[prepaga.slug] ?? [] : []
  const ultimo = serie[serie.length - 1]
  const anterior = serie[serie.length - 2]

  const edadOk = (pl: PlanChequeo) => edadesNum.every((e) => (pl.edadMinima === undefined || e >= pl.edadMinima) && (pl.edadMaxima === undefined || e <= pl.edadMaxima))
  const alternativas: Alternativa[] = []
  if (actual && estado === 'listo') {
    for (const p of prepagas) {
      const candidatas = p.planes
        .filter((pl) => !(p.slug === prepaga?.slug && pl.slug === plan?.slug) && edadOk(pl))
        .map((pl) => ({ prepaga: p, plan: pl, precio: precios[`${p.slug}/${pl.slug}`] ?? 0 }))
        .filter((x) => x.precio > 0 && x.precio <= actual * (1 - AHORRO_MINIMO) && x.precio >= actual * PISO_SIMILAR)
        .sort((a, b) => b.precio - a.precio)
      // Una por prepaga: la más parecida (la más cercana por debajo).
      if (candidatas[0]) alternativas.push({ ...candidatas[0], ahorro: actual - candidatas[0].precio })
    }
    const prioridad = (s: string) => (PRIORIDAD_PARTNERS.includes(s) ? PRIORIDAD_PARTNERS.indexOf(s) : PRIORIDAD_PARTNERS.length)
    alternativas.sort((a, b) => prioridad(a.prepaga.slug) - prioridad(b.prepaga.slug) || b.ahorro - a.ahorro)
  }
  const maxAhorro = Math.max(0, ...alternativas.map((a) => a.ahorro))

  async function enviar(d: DatosFormulario) {
    if (!prepaga || !plan || !prov) return
    await enviarLead({
      ...d,
      edades: edadesNum,
      fuente: 'chequeo-prepaga',
      provincia: prov.nombre,
      interes: alternativas.slice(0, 3).map((a) => `${a.prepaga.nombre} ${a.plan.nombre}`).join(' · '),
      prepagaActual: PREPAGA_ACTUAL[prepaga.slug] ?? 'Otra prepaga',
      preferencias: { planActual: `${prepaga.nombre} ${plan.nombre} (${modalidad === 'directo' ? 'particular' : 'con aportes'})${actual ? `, lista ${formatPrecio(actual)}` : ''}` },
    })
    setDesbloqueado(d.nombre)
    setFormAbierto(false)
  }

  const campo = 'w-full rounded-xl border-2 border-gray-200 px-3 py-3 text-base bg-white focus:outline-none focus:border-[#E8002D]'

  return (
    <div>
      <form onSubmit={chequear} className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4 shadow-sm">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ch-prepaga" className="block text-sm font-semibold text-gray-800 mb-1">Tu prepaga</label>
            <select id="ch-prepaga" value={prepagaSlug} onChange={(e) => { cambiar(setPrepagaSlug)(e.target.value); setPlanSlug('') }} className={campo}>
              <option value="">Elegí…</option>
              {prepagas.map((p) => <option key={p.slug} value={p.slug}>{p.nombre}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="ch-plan" className="block text-sm font-semibold text-gray-800 mb-1">Tu plan</label>
            <select id="ch-plan" value={planSlug} onChange={(e) => cambiar(setPlanSlug)(e.target.value)} disabled={!prepaga} className={`${campo} disabled:bg-gray-50`}>
              <option value="">{prepaga ? 'Elegí…' : 'Primero la prepaga'}</option>
              {prepaga?.planes.map((p) => <option key={p.slug} value={p.slug}>{p.nombre}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="ch-provincia" className="block text-sm font-semibold text-gray-800 mb-1">Dónde vivís</label>
            <select id="ch-provincia" value={provinciaElegida} onChange={(e) => cambiar(setProvincia)(e.target.value)} className={campo}>
              <option value="">Elegí…</option>
              {PROVINCIAS.map((p) => <option key={p.slug} value={p.slug}>{p.nombre}</option>)}
            </select>
            {!provincia && detectada && <p className="mt-1 text-xs text-gray-500">📍 Por tu ubicación aproximada: {detectada.label}. Si no es tu zona, cambiala.</p>}
          </div>
          <fieldset>
            <legend className="block text-sm font-semibold text-gray-800 mb-1">Cómo lo pagás</legend>
            <div className="grid grid-cols-2 gap-2">
              {([['directo', 'Particular'], ['desregulado', 'Con mis aportes']] as const).map(([v, t]) => (
                <button key={v} type="button" aria-pressed={modalidad === v} onClick={() => cambiar(setModalidad)(v)}
                  className={`rounded-xl border-2 px-3 py-3 text-sm font-semibold ${modalidad === v ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-700'}`}>{t}</button>
              ))}
            </div>
          </fieldset>
        </div>
        <fieldset>
          <legend className="block text-sm font-semibold text-gray-800 mb-1">Edad de cada persona del plan</legend>
          <div className="flex flex-wrap gap-2">
            {edades.map((v, i) => (
              <div key={i} className="relative">
                <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={2} value={v}
                  onChange={(e) => cambiar(setEdades)(edades.map((x, j) => (j === i ? e.target.value.replace(/\D/g, '').slice(0, 2) : x)))}
                  placeholder={i === 0 ? 'Tu edad' : 'Edad'} aria-label={i === 0 ? 'Tu edad' : `Edad de la persona ${i + 1}`}
                  className={`${campo} w-28 pr-7`} />
                {i > 0 && (
                  <button type="button" onClick={() => cambiar(setEdades)(edades.filter((_, j) => j !== i))} aria-label={`Sacar persona ${i + 1}`}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 hover:text-gray-700">×</button>
                )}
              </div>
            ))}
            {edades.length < 6 && (
              <button type="button" onClick={() => cambiar(setEdades)([...edades, ''])}
                className="rounded-xl border-2 border-dashed border-gray-300 px-3 text-sm font-semibold text-gray-600 hover:border-gray-400">+ Persona</button>
            )}
          </div>
        </fieldset>
        <button type="submit" disabled={!completo || estado === 'cargando'}
          className="w-full py-4 bg-[#E8002D] hover:bg-[#B8001F] disabled:bg-gray-200 disabled:text-gray-500 text-white font-bold rounded-2xl transition-colors">
          {estado === 'cargando' ? 'Calculando…' : 'Chequear mi cuota'}
        </button>
      </form>

      {estado === 'listo' && prepaga && plan && (
        <div ref={resultadoRef} className="mt-6 space-y-4 scroll-mt-20" aria-live="polite">
          {actual ? (
            <section className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-600">{prepaga.nombre} {plan.nombre}, lista oficial de {mesPrecios}</p>
              <p className="text-3xl font-black text-gray-900 tabular-nums mt-1">{formatPrecio(actual)} <span className="text-base font-semibold text-gray-500">por mes</span></p>
              <p className="text-xs text-gray-500 mt-2">
                {modalidad === 'directo'
                  ? 'Precio para particulares, con IVA (10,5%). Si pagás menos, puede ser por una bonificación de la prepaga.'
                  : 'Valor del plan pagando con aportes (sin IVA): a esto se le descuentan los aportes de tu recibo de sueldo.'}
              </p>
            </section>
          ) : (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
              {prepaga.nombre} no publica un cuadro oficial de {plan.nombre} para {prov?.nombre ?? 'tu zona'} o para esas edades. Un asesor te lo puede cotizar.
            </section>
          )}

          {ultimo && (
            <section className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="font-bold text-gray-900">Aumento de {prepaga.nombre} en {ultimo.mes.toLowerCase()}: {pct(ultimo.mediana)}</h2>
              <p className="text-sm text-gray-700 mt-1">
                {actual ? <>Tu cuota pasaría a unos <strong>{formatPrecio(Math.round(actual * (1 + ultimo.mediana / 100)))}</strong>. </> : null}
                {ultimo.minimo !== ultimo.maximo && <>Según el plan y la región va de {pct(ultimo.minimo)} a {pct(ultimo.maximo)}. </>}
                El promedio del mercado ese mes es {pct(ultimo.promedio)}: {prepaga.nombre} aumenta {ultimo.mediana > ultimo.promedio ? 'más' : ultimo.mediana < ultimo.promedio ? 'menos' : 'lo mismo'} que el promedio.
                {anterior && <> En {anterior.mes.toLowerCase()} había aumentado {pct(anterior.mediana)}.</>}
              </p>
              <p className="text-xs text-gray-500 mt-2">Cuadros tarifarios que {prepaga.nombre} declara ante la Superintendencia de Servicios de Salud. <Link href="/aumentos" className="underline">Aumentos de todas las prepagas</Link></p>
            </section>
          )}

          {actual && (
            <section className="rounded-2xl border-2 border-[#E8002D]/20 bg-red-50/40 p-5">
              {alternativas.length > 0 ? (
                <>
                  <h2 className="text-lg font-bold text-gray-900">
                    {alternativas.length === 1 ? 'Un plan de precio parecido te sale menos' : `${alternativas.length} planes de precio parecido te salen menos`}
                  </h2>
                  <p className="text-sm text-gray-700 mt-1">
                    Hasta <strong>{formatPrecio(maxAhorro)} menos por mes</strong> ({formatPrecio(maxAhorro * 12)} por año), para las mismas edades y la misma zona.
                  </p>
                  <ul className="mt-4 space-y-2">
                    {alternativas.map((a) => (
                      <li key={`${a.prepaga.slug}/${a.plan.slug}`} className="flex items-center justify-between gap-3 rounded-xl bg-white border border-gray-200 px-4 py-3">
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 text-sm">{a.prepaga.nombre}</div>
                          {desbloqueado
                            ? <Link href={`/prepagas/${a.prepaga.slug}/${a.plan.slug}`} className="text-xs text-[#E8002D] hover:underline">{a.plan.nombre}</Link>
                            : <div className="text-xs text-gray-400 blur-[4px] select-none" aria-hidden>Plan 000</div>}
                        </div>
                        <div className="text-right shrink-0">
                          {desbloqueado ? (
                            <>
                              <div className="font-bold text-gray-900 tabular-nums">{formatPrecio(a.precio)}</div>
                              <div className="text-[11px] text-green-700 font-semibold">{formatPrecio(a.ahorro)} menos por mes</div>
                            </>
                          ) : (
                            <span className="block font-bold text-gray-300 blur-[5px] select-none" aria-hidden>$ 000.000</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                  {desbloqueado ? (
                    <p className="text-sm text-green-900 bg-green-50 border border-green-200 rounded-xl p-3 mt-4">
                      <strong>Listo, {desbloqueado}.</strong> Un asesor te escribe en {TIEMPO_RESPUESTA} para ver si alguna de estas opciones tiene tus sanatorios y cómo hacer el cambio sin perder cobertura.
                    </p>
                  ) : (
                    <button type="button" onClick={() => setFormAbierto(true)}
                      className="mt-4 w-full py-4 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-2xl transition-colors">
                      Ver cuáles son y cuánto ahorro →
                    </button>
                  )}
                  <p className="text-xs text-gray-500 mt-3">
                    Precio parecido no es igual cobertura: antes de cambiarte, fijate que estén tus sanatorios en <Link href="/buscar-por-sanatorio" className="underline">Mis sanatorios</Link>.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-gray-900">Tu plan está bien de precio para su nivel</h2>
                  <p className="text-sm text-gray-700 mt-1">No encontramos planes de precio parecido que te salgan menos para tu edad y tu zona. Si querés revisar tu cobertura o pagar con tus aportes, te asesoramos gratis.</p>
                  {desbloqueado ? (
                    <p className="text-sm text-green-900 mt-3"><strong>Listo, {desbloqueado}.</strong> Te escribimos en {TIEMPO_RESPUESTA}.</p>
                  ) : (
                    <button type="button" onClick={() => setFormAbierto(true)} className="mt-4 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl">Hablar con un asesor</button>
                  )}
                </>
              )}
            </section>
          )}
        </div>
      )}

      {formAbierto && (
        <FormularioLead
          titulo={alternativas.length ? 'Tus alternativas están listas' : 'Te asesoramos gratis'}
          bajada={alternativas.length ? `Te mostramos los planes y cuánto ahorrás, y un asesor revisa con vos que tengan tus sanatorios.` : 'Un asesor revisa tu plan con vos.'}
          textoBoton={alternativas.length ? 'Ver mis alternativas →' : 'Quiero que me contacten'}
          onCerrar={() => setFormAbierto(false)}
          onEnviar={enviar}
        />
      )}
    </div>
  )
}

function ConPrepagaDeUrl(props: Omit<Props, 'inicial'>) {
  const inicial = useSearchParams().get('prepaga') ?? undefined
  return <ChequeoPrepaga key={inicial} inicial={inicial} {...props} />
}

/** El formulario sale en el HTML (fallback) y, ya en el navegador, se
 *  reemplaza por el que toma ?prepaga= del link. */
export function ChequeoPrepagaConUrl(props: Omit<Props, 'inicial'>) {
  return (
    <Suspense fallback={<ChequeoPrepaga {...props} />}>
      <ConPrepagaDeUrl {...props} />
    </Suspense>
  )
}
