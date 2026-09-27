'use client'

import { Suspense, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { prestacionesCobertura, NIVEL_COBERTURA as NIVEL, NORMAS, type PrestacionCobertura } from '@/lib/data/que-cubre'
import { FormularioLead, type DatosFormulario } from '@/components/herramientas/FormularioLead'
import { enviarLead } from '@/lib/leads-cliente'
import { TIEMPO_RESPUESTA } from '@/lib/utils'

// Buscador "¿Qué me cubre la prepaga?" (27-sep-2026): escribís una práctica y
// te dice si es obligatoria por ley, con qué porcentaje o límite y la norma.
// Lo que depende del plan muestra qué incluye cada prepaga según sus datos
// oficiales (Swiss Medical primero) y ofrece cotizar un plan que lo cubra.

/** Resumen por prepaga de un tema de coberturas-marca, armado en el servidor */
export interface MarcaResumen {
  prepagaSlug: string
  prepagaNombre: string
  respuesta: string
}

const norm = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim()

// Cada palabra buscada tiene que ser el comienzo de alguna palabra de la
// entrada: "lente" encuentra "lentes de contacto" pero no "suplente".
const INDICE = prestacionesCobertura.map((p) => {
  const nombre = norm(p.nombre)
  const claves = p.sinonimos.map(norm)
  return { p, nombre, claves, palabras: [...new Set(`${nombre} ${claves.join(' ')}`.split(' '))] }
})

function buscar(q: string): PrestacionCobertura[] {
  const t = norm(q)
  if (t.length < 2) return []
  const buscadas = t.split(' ')
  return INDICE
    .map(({ p, nombre, claves, palabras }) => {
      if (!buscadas.every((w) => palabras.some((x) => x.startsWith(w)))) return null
      const puntaje = claves.includes(t) || nombre === t ? 0 : claves.some((k) => k.startsWith(t)) || nombre.startsWith(t) ? 1 : 2
      return { p, puntaje }
    })
    .filter((x): x is { p: PrestacionCobertura; puntaje: number } => x !== null)
    .sort((a, b) => a.puntaje - b.puntaje)
    .slice(0, 5)
    .map((x) => x.p)
}

const SUGERIDAS = ['psicologia', 'ortodoncia', 'anteojos', 'fertilizacion', 'medicamentos', 'embarazo-parto', 'kinesiologia', 'cirugia-estetica', 'implantes-dentales', 'vasectomia-ligadura']
const CORTO: Record<string, string> = {
  psicologia: 'Psicólogo', 'embarazo-parto': 'Embarazo y parto', medicamentos: 'Medicamentos', 'vasectomia-ligadura': 'Vasectomía', 'implantes-dentales': 'Implantes dentales', kinesiologia: 'Kinesiología',
}

function PlanesDeLaPrepaga({ tema, marcas }: { tema: string; marcas: MarcaResumen[] }) {
  const [primera, ...resto] = marcas
  return (
    <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Qué incluye cada plan (datos oficiales de la prepaga)</p>
      <p className="mt-1.5 text-sm text-gray-800 leading-relaxed">
        <strong>{primera.prepagaNombre}:</strong> {primera.respuesta}{' '}
        <Link href={`/coberturas/${tema}/${primera.prepagaSlug}`} className="font-semibold text-[#E8002D] hover:underline whitespace-nowrap">Ver plan por plan →</Link>
      </p>
      {resto.length > 0 && (
        <p className="mt-1.5 text-sm text-gray-600">
          También:{' '}
          {resto.map((m, i) => (
            <span key={m.prepagaSlug}>
              {i > 0 && ' · '}
              <Link href={`/coberturas/${tema}/${m.prepagaSlug}`} className="underline hover:text-[#E8002D]">{m.prepagaNombre}</Link>
            </span>
          ))}
        </p>
      )}
    </div>
  )
}

function Tarjeta({ p, marcas, onConsultar }: { p: PrestacionCobertura; marcas?: MarcaResumen[]; onConsultar: () => void }) {
  return (
    <li className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-bold text-gray-900">{p.nombre}</h3>
        <span className={`text-xs font-semibold rounded-full border px-2.5 py-1 ${NIVEL[p.nivel].clase}`}>{NIVEL[p.nivel].texto}</span>
      </div>
      <p className="mt-2 text-sm text-gray-700 leading-relaxed">{p.respuesta}</p>
      {p.nota && <p className="mt-2 text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl px-3 py-2">{p.nota}</p>}
      {p.temaMarca && marcas && marcas.length > 0 && <PlanesDeLaPrepaga tema={p.temaMarca} marcas={marcas} />}
      {p.normas.length > 0 && (
        <p className="mt-2 text-xs text-gray-500 leading-relaxed">
          Dónde lo dice:{' '}
          {p.normas.map((n, i) => (
            <span key={n.norma + (n.donde ?? '')}>
              {i > 0 && ' · '}
              <a href={NORMAS[n.norma].url} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">
                {NORMAS[n.norma].nombre}{n.donde ? `, ${n.donde}` : ''}
              </a>
            </span>
          ))}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        {p.nivel === 'plan' ? (
          <button type="button" onClick={onConsultar}
            className="text-sm font-bold rounded-xl px-4 py-2 bg-[#E8002D] text-white hover:bg-[#B8001F] transition-colors">
            Quiero un plan que lo cubra →
          </button>
        ) : (
          <button type="button" onClick={onConsultar}
            className="text-sm font-semibold rounded-xl px-3 py-2 border border-red-200 text-[#E8002D] hover:bg-red-50 transition-colors">
            Consultar con un asesor
          </button>
        )}
        {p.enlace && <Link href={p.enlace.href} className="text-sm text-gray-600 underline hover:text-[#E8002D]">{p.enlace.texto}</Link>}
      </div>
    </li>
  )
}

function BuscadorQueCubre({ marcas, inicial }: { marcas: Record<string, MarcaResumen[]>; inicial?: PrestacionCobertura }) {
  const [q, setQ] = useState(inicial?.nombre ?? '')
  const [consulta, setConsulta] = useState<{ nombre: string; plan: boolean } | null>(null)
  const [enviado, setEnviado] = useState<string | null>(null)

  const resultados = useMemo(() => (inicial && q === inicial.nombre ? [inicial] : buscar(q)), [q, inicial])

  async function enviar(d: DatosFormulario) {
    const tema = consulta?.nombre || q
    await enviarLead({
      ...d,
      fuente: 'buscador-que-cubre',
      interes: `Cobertura: ${tema}`.slice(0, 200),
      preferencias: { coberturas: tema.slice(0, 200) },
    })
    setEnviado(d.nombre)
    setConsulta(null)
  }

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <label htmlFor="qc-q" className="block text-sm font-semibold text-gray-800 mb-1">¿Qué necesitás saber si te cubre?</label>
        <input id="qc-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off"
          placeholder="Ej.: psicólogo, ortodoncia, anteojos, resonancia…"
          className="w-full rounded-xl border-2 border-gray-200 px-3 py-3 text-base bg-white focus:outline-none focus:border-[#E8002D]" />
        {!q && (
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGERIDAS.map((s) => {
              const p = prestacionesCobertura.find((x) => x.slug === s)
              return p ? (
                <button key={s} type="button" onClick={() => setQ(CORTO[s] ?? p.nombre)}
                  className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-[#E8002D] hover:text-[#E8002D]">
                  {CORTO[s] ?? p.nombre}
                </button>
              ) : null
            })}
          </div>
        )}
      </div>

      {enviado && (
        <p className="mt-4 text-sm text-green-900 bg-green-50 border border-green-200 rounded-xl p-3" aria-live="polite">
          <strong>Listo, {enviado}.</strong> Un asesor te escribe en {TIEMPO_RESPUESTA} con los planes que lo cubren y cuánto salen para tu edad.
        </p>
      )}

      {q && resultados.length > 0 && (
        <ul className="mt-4 space-y-3" aria-live="polite">
          {resultados.map((p) => (
            <Tarjeta key={p.slug} p={p} marcas={p.temaMarca ? marcas[p.temaMarca] : undefined} onConsultar={() => setConsulta({ nombre: p.nombre, plan: p.nivel === 'plan' })} />
          ))}
        </ul>
      )}

      {q && norm(q).length >= 2 && resultados.length === 0 && (
        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4" aria-live="polite">
          <p className="text-sm text-gray-700 leading-relaxed">
            No lo encontramos con ese nombre: probá con otra palabra (por ejemplo, &quot;dentista&quot; o &quot;anteojos&quot;) o mirá la lista completa más abajo. Si no está en el PMO ni en ninguna ley, depende de cada plan: un asesor te dice cuáles lo incluyen.
          </p>
          {!enviado && (
            <button type="button" onClick={() => setConsulta({ nombre: q.trim(), plan: true })} className="mt-3 text-sm font-bold text-[#E8002D] hover:underline">
              Consultar con un asesor →
            </button>
          )}
        </div>
      )}

      {consulta && (
        <FormularioLead
          titulo={consulta.plan ? 'Te pasamos los planes que lo cubren' : 'Te asesoramos'}
          bajada={`Sobre "${consulta.nombre}": te decimos qué planes lo cubren, con qué condiciones y cuánto salen para tu edad.`}
          textoBoton="Quiero que me asesoren →"
          pedirEdades
          onCerrar={() => setConsulta(null)}
          onEnviar={enviar}
        />
      )}
    </div>
  )
}

function ConPrestacionDeUrl({ marcas }: { marcas: Record<string, MarcaResumen[]> }) {
  const c = useSearchParams().get('c')
  const inicial = c ? prestacionesCobertura.find((x) => x.slug === c) : undefined
  return <BuscadorQueCubre key={inicial?.slug} marcas={marcas} inicial={inicial} />
}

/** El buscador sale en el HTML (fallback) y, ya en el navegador, se reemplaza
 *  por el que toma ?c=<slug> del link (desde el buscador del sitio u otra página). */
export function BuscadorQueCubreConUrl({ marcas }: { marcas: Record<string, MarcaResumen[]> }) {
  return (
    <Suspense fallback={<BuscadorQueCubre marcas={marcas} />}>
      <ConPrestacionDeUrl marcas={marcas} />
    </Suspense>
  )
}
