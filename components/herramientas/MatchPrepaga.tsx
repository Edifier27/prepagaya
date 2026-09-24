'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { DatosMatch, PlanMatch, UsoMatch } from '@/lib/data/match'
import { PROVINCIAS } from '@/lib/data/provincias-cotizador'
import { enviarLead, preciosDelGrupo } from '@/lib/leads-cliente'
import { formatPrecio, PRIORIDAD_PARTNERS, TIEMPO_RESPUESTA } from '@/lib/utils'
import { FormularioLead, type DatosFormulario } from './FormularioLead'

// "Match" (/match-prepaga, 24-sep-2026): seis tarjetas de a una, y el plan
// que más coincide con lo que la persona dijo, con el porqué punto por punto.
// Cada punto sale de un dato con fuente (lib/data/match.ts); sin dato, no
// suma ni resta. Empates: prioridad de partners (Swiss Medical primero).

type Nivel = 0 | 1 | 2
type Pref3 = 'si' | 'no' | 'igual'
interface Respuestas {
  provincia?: string
  edadMin?: number
  nivel?: Nivel
  copago?: Pref3
  red?: Pref3
  usos: UsoMatch[]
}

interface Props { datos: DatosMatch; usos: readonly { id: UsoMatch; label: string }[] }

interface Criterio { texto: string; ok: boolean | null }
interface Match { plan: PlanMatch; puntos: number; criterios: Criterio[] }

const NIVELES = ['Pagar lo menos posible', 'Equilibrio entre precio y cobertura', 'La mejor cobertura'] as const
const EDADES = [
  { label: 'Menos de 36', min: 18 },
  { label: '36 a 49', min: 36 },
  { label: '50 a 64', min: 50 },
  { label: '65 o más', min: 65 },
]
const RAPIDAS = ['caba', 'buenos-aires', 'buenos-aires-interior', 'cordoba', 'santa-fe', 'mendoza']

function evaluar(p: PlanMatch, r: Respuestas, usos: Props['usos']): Match {
  const criterios: Criterio[] = []
  let puntos = 0
  const sumar = (ok: boolean | null, peso = 2) => { if (ok === true) puntos += peso; if (ok === false) puntos -= peso }
  if (r.nivel !== undefined) {
    const d = Math.abs(p.nivel - r.nivel)
    const ok = d === 0 ? true : d === 2 ? false : null
    const nivelTexto = ['económico', 'intermedio', 'de alta gama'][p.nivel]
    criterios.push({
      texto: d === 0 ? `Precio: plan ${nivelTexto}, como buscás` : `Precio: plan ${nivelTexto}, ${p.nivel > r.nivel ? 'más caro' : 'más económico'} de lo que buscás`,
      ok,
    })
    sumar(ok, 3)
  }
  if (r.copago && r.copago !== 'igual') {
    const ok = p.copago === (r.copago === 'si')
    criterios.push({ texto: p.copago ? 'Tiene copago en consultas' : 'Sin copago en consultas', ok })
    sumar(ok)
  }
  if (r.red && r.red !== 'igual') {
    const ok = p.redAbierta === (r.red === 'si')
    criterios.push({ texto: p.redAbierta ? 'Libre elección con reintegro' : 'Atención con la cartilla', ok })
    sumar(ok)
  }
  for (const u of r.usos) {
    const dato = p.usos[u]
    const label = usos.find((x) => x.id === u)?.label ?? u
    criterios.push({
      texto: dato ? `${label}: ${dato.si ? (dato.detalle ?? 'incluido') : 'no lo incluye'}` : `${label}: sin dato oficial para este plan`,
      ok: dato ? dato.si : null,
    })
    sumar(dato ? dato.si : null)
  }
  return { plan: p, puntos, criterios }
}

function ranking(datos: DatosMatch, r: Respuestas, usos: Props['usos']): Match[] {
  const zona = PROVINCIAS.find((p) => p.slug === r.provincia)?.zonaKey ?? 'caba'
  const disponibles = new Set(datos.disponibles[zona] ?? [])
  const prioridad = (s: string) => (PRIORIDAD_PARTNERS.includes(s) ? PRIORIDAD_PARTNERS.indexOf(s) : PRIORIDAD_PARTNERS.length)
  const todos = datos.planes
    .filter((p) => disponibles.has(p.k) && (p.edadMaxima === undefined || (r.edadMin ?? 18) <= p.edadMaxima))
    .map((p) => evaluar(p, r, usos))
    .sort((a, b) => b.puntos - a.puntos || prioridad(a.plan.prepaga) - prioridad(b.plan.prepaga) || a.plan.nivel - b.plan.nivel)
  // Un plan por prepaga: el mejor de cada una.
  const vistos = new Set<string>()
  return todos.filter((m) => (vistos.has(m.plan.prepaga) ? false : (vistos.add(m.plan.prepaga), true)))
}

export function MatchPrepaga({ datos, usos }: Props) {
  const [paso, setPaso] = useState(0)
  const [r, setR] = useState<Respuestas>({ usos: [] })
  const [formAbierto, setFormAbierto] = useState(false)
  const [precios, setPrecios] = useState<Record<string, number> | null>(null)
  const [nombre, setNombre] = useState('')
  // Edades del grupo una vez que dejó los datos: si vuelve a empezar, los
  // precios se recalculan para la zona nueva sin pedirle los datos otra vez.
  const [edadesGrupo, setEdadesGrupo] = useState<number[] | null>(null)

  const TOTAL = 6
  const avanzar = (cambio: Partial<Respuestas>) => { setR((prev) => ({ ...prev, ...cambio })); setPaso((p) => p + 1) }
  const resultados = paso >= TOTAL ? ranking(datos, r, usos).slice(0, 3) : []
  const prov = PROVINCIAS.find((p) => p.slug === r.provincia)

  async function enviar(d: DatosFormulario) {
    const top = resultados.map((m) => `${m.plan.prepagaNombre} ${m.plan.planNombre}`)
    await enviarLead({
      ...d,
      fuente: 'match-prepaga',
      provincia: prov?.nombre ?? '',
      interes: top.join(' · '),
      preferencias: {
        ...(r.copago && r.copago !== 'igual' ? { copago: r.copago === 'si' ? 'Con copago' : 'Sin copago' } : r.copago ? { copago: 'Me es indiferente' } : {}),
        ...(r.usos.length ? { coberturas: r.usos.map((u) => usos.find((x) => x.id === u)?.label ?? u).join(', ') } : {}),
        perfil: [
          r.nivel !== undefined ? NIVELES[r.nivel] : '',
          r.red === 'si' ? 'Libre elección' : r.red === 'no' ? 'Cartilla' : '',
          EDADES.find((e) => e.min === r.edadMin)?.label ?? '',
        ].filter(Boolean).join(' · '),
      },
    })
    setPrecios(await preciosDelGrupo(prov?.zonaKey ?? 'caba', d.edades))
    setNombre(d.nombre)
    setEdadesGrupo(d.edades)
    setFormAbierto(false)
  }

  function verMatch() {
    setPaso(TOTAL)
    if (edadesGrupo) preciosDelGrupo(prov?.zonaKey ?? 'caba', edadesGrupo).then(setPrecios)
  }

  const opcion = 'w-full text-left rounded-2xl border-2 border-gray-200 bg-white px-5 py-4 text-base font-semibold text-gray-900 hover:border-[#E8002D] hover:bg-red-50/40 focus:outline-none focus:border-[#E8002D] transition-colors'

  const tarjetas: { titulo: string; contenido: React.ReactNode }[] = [
    {
      titulo: '¿Dónde vivís?',
      contenido: (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {RAPIDAS.map((s) => {
              const p = PROVINCIAS.find((x) => x.slug === s)!
              return <button key={s} type="button" className={opcion} onClick={() => avanzar({ provincia: s })}>{p.nombre}</button>
            })}
          </div>
          <label htmlFor="match-prov" className="sr-only">Otra provincia</label>
          <select id="match-prov" defaultValue="" onChange={(e) => e.target.value && avanzar({ provincia: e.target.value })}
            className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-4 text-base text-gray-700">
            <option value="">Otra provincia…</option>
            {PROVINCIAS.filter((p) => !RAPIDAS.includes(p.slug)).map((p) => <option key={p.slug} value={p.slug}>{p.nombre}</option>)}
          </select>
        </div>
      ),
    },
    {
      titulo: '¿Qué edad tiene la persona más grande del grupo?',
      contenido: (
        <div className="grid grid-cols-2 gap-2">
          {EDADES.map((e) => <button key={e.label} type="button" className={opcion} onClick={() => avanzar({ edadMin: e.min })}>{e.label}</button>)}
        </div>
      ),
    },
    {
      titulo: '¿Qué es lo más importante para vos?',
      contenido: (
        <div className="space-y-2">
          {NIVELES.map((t, i) => <button key={t} type="button" className={opcion} onClick={() => avanzar({ nivel: i as Nivel })}>{t}</button>)}
        </div>
      ),
    },
    {
      titulo: '¿Cómo preferís pagar?',
      contenido: (
        <div className="space-y-2">
          <button type="button" className={opcion} onClick={() => avanzar({ copago: 'si' })}>Cuota más baja y un copago por consulta</button>
          <button type="button" className={opcion} onClick={() => avanzar({ copago: 'no' })}>Cuota fija, sin copagos</button>
          <button type="button" className={`${opcion} font-normal text-gray-600`} onClick={() => avanzar({ copago: 'igual' })}>Me da igual</button>
        </div>
      ),
    },
    {
      titulo: '¿Cómo te querés atender?',
      contenido: (
        <div className="space-y-2">
          <button type="button" className={opcion} onClick={() => avanzar({ red: 'no' })}>Con los médicos de la cartilla</button>
          <button type="button" className={opcion} onClick={() => avanzar({ red: 'si' })}>Con cualquier médico, y que me reintegren</button>
          <button type="button" className={`${opcion} font-normal text-gray-600`} onClick={() => avanzar({ red: 'igual' })}>Me da igual</button>
        </div>
      ),
    },
    {
      titulo: '¿Qué vas a usar este año?',
      contenido: (
        <div>
          <p className="text-sm text-gray-600 -mt-2 mb-3">Marcá todo lo que aplique. Consultas, estudios, internación y embarazo los cubren todos los planes por ley.</p>
          <div className="flex flex-wrap gap-2">
            {usos.map((u) => {
              const activo = r.usos.includes(u.id)
              return (
                <button key={u.id} type="button" aria-pressed={activo}
                  onClick={() => setR((prev) => ({ ...prev, usos: activo ? prev.usos.filter((x) => x !== u.id) : [...prev.usos, u.id] }))}
                  className={`rounded-full border-2 px-4 py-2.5 text-sm font-semibold transition-colors ${activo ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-800 hover:border-gray-400'}`}>
                  {activo ? '✓ ' : ''}{u.label}
                </button>
              )
            })}
          </div>
          <button type="button" onClick={verMatch} className="mt-5 w-full py-4 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-2xl">
            {r.usos.length ? 'Ver mi match →' : 'Nada de esto: ver mi match →'}
          </button>
        </div>
      ),
    },
  ]

  if (paso < TOTAL) {
    const t = tarjetas[paso]
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-7 shadow-sm">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>Pregunta {paso + 1} de {TOTAL}</span>
          {paso > 0 && <button type="button" onClick={() => setPaso(paso - 1)} className="font-semibold text-gray-600 hover:text-gray-900">← Atrás</button>}
        </div>
        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mb-5" aria-hidden>
          <div className="h-full bg-[#E8002D] transition-all duration-300" style={{ width: `${(paso / TOTAL) * 100}%` }} />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-balance">{t.titulo}</h2>
        {t.contenido}
      </div>
    )
  }

  const [primero, ...otros] = resultados
  const cumple = (m: Match) => m.criterios.filter((c) => c.ok === true).length
  const precioDe = (m: Match) => (precios ? precios[m.plan.k] : undefined)

  return (
    <div aria-live="polite">
      {!primero ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          No encontramos planes con precio oficial para tu zona. Un asesor te arma las opciones. <Link href="/comparador" className="font-semibold underline">Cotizar</Link>
        </div>
      ) : (
        <>
          <div className="rounded-3xl border-2 border-[#E8002D]/30 bg-white p-5 sm:p-7 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-[#E8002D]">Tu match</p>
            <div className="flex items-start justify-between gap-3 mt-1">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{primero.plan.prepagaNombre} {primero.plan.planNombre}</h2>
                <p className="text-sm text-gray-700 mt-1">Cumple {cumple(primero)} de {primero.criterios.length} cosas que te importan</p>
              </div>
              <PrecioMatch valor={precioDe(primero)} bloqueado={!precios} calculando={Boolean(edadesGrupo)} onVer={() => setFormAbierto(true)} />
            </div>
            <ul className="mt-4 space-y-1.5">
              {primero.criterios.map((c) => (
                <li key={c.texto} className="flex gap-2 text-sm">
                  <span className={c.ok === true ? 'text-green-700' : c.ok === false ? 'text-red-600' : 'text-gray-400'} aria-hidden>{c.ok === true ? '✓' : c.ok === false ? '✗' : '–'}</span>
                  <span className="text-gray-800">{c.texto}</span>
                </li>
              ))}
            </ul>
            <Link href={`/prepagas/${primero.plan.prepaga}/${primero.plan.plan}`} className="inline-block mt-4 text-sm font-semibold text-[#E8002D] hover:underline">Ver el plan completo →</Link>
          </div>

          {otros.length > 0 && (
            <>
              <h3 className="font-bold text-gray-900 mt-6 mb-2">Otras dos que te pueden servir</h3>
              <ul className="space-y-3">
                {otros.map((m) => (
                  <li key={m.plan.k} className="rounded-2xl border border-gray-200 bg-white p-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/prepagas/${m.plan.prepaga}/${m.plan.plan}`} className="font-semibold text-gray-900 hover:text-[#E8002D]">{m.plan.prepagaNombre} {m.plan.planNombre}</Link>
                      <p className="text-xs text-gray-600 mt-0.5">Cumple {cumple(m)} de {m.criterios.length}{m.criterios.some((c) => c.ok === false) ? ` · no: ${m.criterios.filter((c) => c.ok === false).map((c) => c.texto.split(':')[0].toLowerCase()).join(', ')}` : ''}</p>
                    </div>
                    <PrecioMatch valor={precioDe(m)} bloqueado={!precios} calculando={Boolean(edadesGrupo)} onVer={() => setFormAbierto(true)} chico />
                  </li>
                ))}
              </ul>
            </>
          )}

          {precios || edadesGrupo ? (
            <p className="text-sm text-green-900 bg-green-50 border border-green-200 rounded-2xl p-4 mt-5">
              <strong>Listo, {nombre}.</strong> Precios de lista oficiales para particulares, con IVA. Un asesor te escribe en {TIEMPO_RESPUESTA} con la cotización formal.
            </p>
          ) : (
            <button type="button" onClick={() => setFormAbierto(true)} className="mt-5 w-full py-4 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-2xl">
              Ver cuánto me sale cada uno →
            </button>
          )}
          <button type="button" onClick={() => { setPaso(0); setR({ usos: [] }); setPrecios(null) }} className="mt-3 w-full text-sm font-semibold text-gray-600 hover:text-gray-900">
            Empezar de nuevo
          </button>
          <p className="text-xs text-gray-500 mt-4">Coberturas según los documentos oficiales de cada prepaga; si un plan no tiene el dato, no lo contamos ni a favor ni en contra. <Link href="/buscar-por-sanatorio" className="underline">¿Tenés sanatorios preferidos? Chequealos acá</Link>.</p>
        </>
      )}

      {formAbierto && (
        <FormularioLead
          titulo="Tu precio con este match"
          bajada={`Con las edades de tu grupo te mostramos el precio mensual y anual de cada plan${prov ? ` en ${prov.nombre}` : ''}.`}
          textoBoton="Ver mis precios →"
          pedirEdades
          onCerrar={() => setFormAbierto(false)}
          onEnviar={enviar}
        />
      )}
    </div>
  )
}

function PrecioMatch({ valor, bloqueado, calculando, onVer, chico }: { valor?: number; bloqueado: boolean; calculando?: boolean; onVer: () => void; chico?: boolean }) {
  if (bloqueado) {
    if (calculando) return <span className="text-xs text-gray-500 shrink-0">Calculando…</span>
    return (
      <button type="button" onClick={onVer} className="text-right shrink-0 group">
        <span className={`block font-black text-gray-300 blur-[5px] select-none ${chico ? 'text-base' : 'text-xl'}`} aria-hidden>$ 000.000</span>
        <span className="block text-xs font-semibold text-[#E8002D] group-hover:underline">Ver precio</span>
      </button>
    )
  }
  if (!valor) return <span className="text-xs text-gray-500 text-right shrink-0 max-w-[8rem]">Precio a confirmar por el asesor</span>
  return (
    <div className="text-right shrink-0">
      <div className={`font-black text-gray-900 tabular-nums ${chico ? 'text-base' : 'text-xl'}`}>{formatPrecio(valor)}</div>
      <div className="text-[11px] text-gray-500">por mes · {formatPrecio(valor * 12)} al año</div>
    </div>
  )
}
