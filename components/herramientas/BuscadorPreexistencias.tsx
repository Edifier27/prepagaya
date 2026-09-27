'use client'

import { Suspense, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { preexistenciasDoc, NIVEL_DOC as NIVEL, type PreexistenciaDoc } from '@/lib/data/preexistencias-documentacion'
import { FormularioLead, type DatosFormulario } from '@/components/herramientas/FormularioLead'
import { enviarLead } from '@/lib/leads-cliente'
import { TIEMPO_RESPUESTA } from '@/lib/utils'

// Buscador de preexistencias (27-sep-2026, pedido de Darío): escribís tu
// condición y ves qué documentación te piden al afiliarte. Se pueden sumar
// varias a "tu lista" y pedir que un asesor revise el caso antes de presentar
// la declaración jurada.

const norm = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim()

// Cada palabra buscada tiene que ser el comienzo de alguna palabra de la
// entrada: "presion" encuentra "presión alta" pero no "depresión".
const INDICE = preexistenciasDoc.map((p) => {
  const nombre = norm(p.nombre)
  const claves = p.sinonimos.map(norm)
  return { p, nombre, claves, palabras: [...new Set(`${nombre} ${claves.join(' ')}`.split(' '))] }
})

function buscar(q: string): PreexistenciaDoc[] {
  const t = norm(q)
  if (t.length < 2) return []
  const buscadas = t.split(' ')
  return INDICE
    .map(({ p, nombre, claves, palabras }) => {
      if (!buscadas.every((w) => palabras.some((x) => x.startsWith(w)))) return null
      const puntaje = claves.includes(t) || nombre === t ? 0 : claves.some((k) => k.startsWith(t)) || nombre.startsWith(t) ? 1 : 2
      return { p, puntaje }
    })
    .filter((x): x is { p: PreexistenciaDoc; puntaje: number } => x !== null)
    .sort((a, b) => a.puntaje - b.puntaje)
    .slice(0, 6)
    .map((x) => x.p)
}

const SUGERIDAS = ['diabetes', 'hipertension', 'hipotiroidismo', 'asma', 'obesidad', 'depresion', 'columna', 'embarazo', 'cancer', 'arritmias']

function Tarjeta({ p, enLista, onToggle }: { p: PreexistenciaDoc; enLista: boolean; onToggle: () => void }) {
  return (
    <li className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-bold text-gray-900">{p.nombre}</h3>
        <span className={`text-xs font-semibold rounded-full border px-2.5 py-1 ${NIVEL[p.nivel].clase}`}>{NIVEL[p.nivel].texto}</span>
      </div>
      {p.documentos.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {p.documentos.map((d) => (
            <li key={d} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
              <span className="text-[#E8002D] shrink-0" aria-hidden>•</span>{d}
            </li>
          ))}
        </ul>
      )}
      {p.nota && <p className="mt-3 text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl px-3 py-2">{p.nota}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <button type="button" onClick={onToggle} aria-pressed={enLista}
          className={`text-sm font-semibold rounded-xl px-3 py-2 border transition-colors ${enLista ? 'bg-[#E8002D] text-white border-[#E8002D]' : 'text-[#E8002D] border-red-200 hover:bg-red-50'}`}>
          {enLista ? '✓ En tu lista' : '+ Sumar a mi lista'}
        </button>
        {p.enlace && <Link href={p.enlace.href} className="text-sm text-gray-600 underline hover:text-[#E8002D]">{p.enlace.texto}</Link>}
      </div>
    </li>
  )
}

function BuscadorPreexistencias({ inicial }: { inicial?: PreexistenciaDoc }) {
  const [q, setQ] = useState(inicial?.nombre ?? '')
  const [lista, setLista] = useState<string[]>(inicial ? [inicial.slug] : [])
  const [formAbierto, setFormAbierto] = useState(false)
  const [enviado, setEnviado] = useState<string | null>(null)

  const resultados = useMemo(() => buscar(q), [q])
  const elegidas = lista.map((s) => preexistenciasDoc.find((p) => p.slug === s)!).filter(Boolean)
  const toggle = (slug: string) => setLista((l) => (l.includes(slug) ? l.filter((s) => s !== slug) : [...l, slug]))

  async function enviar(d: DatosFormulario) {
    const nombres = elegidas.map((p) => p.nombre).join(', ')
    await enviarLead({
      ...d,
      fuente: 'buscador-preexistencias',
      interes: `Preexistencias: ${nombres}`.slice(0, 200),
      preferencias: { preexistencias: nombres.slice(0, 200) },
    })
    setEnviado(d.nombre)
    setFormAbierto(false)
  }

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <label htmlFor="bp-q" className="block text-sm font-semibold text-gray-800 mb-1">¿Qué tenés o qué te trataste?</label>
        <input id="bp-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off"
          placeholder="Ej.: diabetes, presión alta, hernia de disco…"
          className="w-full rounded-xl border-2 border-gray-200 px-3 py-3 text-base bg-white focus:outline-none focus:border-[#E8002D]" />
        {!q && (
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGERIDAS.map((s) => {
              const p = preexistenciasDoc.find((x) => x.slug === s)
              return p ? (
                <button key={s} type="button" onClick={() => setQ(p.nombre)}
                  className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-[#E8002D] hover:text-[#E8002D]">
                  {p.nombre.split(' (')[0]}
                </button>
              ) : null
            })}
          </div>
        )}
      </div>

      {q && resultados.length > 0 && (
        <ul className="mt-4 space-y-3" aria-live="polite">
          {resultados.map((p) => <Tarjeta key={p.slug} p={p} enLista={lista.includes(p.slug)} onToggle={() => toggle(p.slug)} />)}
        </ul>
      )}

      {q && norm(q).length >= 2 && resultados.length === 0 && (
        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4" aria-live="polite">
          <p className="text-sm text-gray-700 leading-relaxed">
            No lo encontramos con ese nombre: probá con otra palabra (por ejemplo, &quot;presión&quot; en vez de &quot;hipertensión arterial&quot;). En general, lo que se pide es un <strong>resumen de historia clínica actualizado</strong> del especialista que te trata, con el diagnóstico, cuándo empezó, cómo evolucionó y cómo estás hoy, más los informes de los últimos estudios.
          </p>
          {!enviado && (
            <button type="button" onClick={() => setFormAbierto(true)} className="mt-3 text-sm font-bold text-[#E8002D] hover:underline">
              Consultar mi caso con un asesor →
            </button>
          )}
        </div>
      )}

      {elegidas.length > 0 && (
        <section className="mt-6 rounded-2xl border-2 border-[#E8002D]/20 bg-red-50/40 p-5" aria-label="Tu lista">
          <h2 className="text-lg font-bold text-gray-900">Tu lista para la declaración jurada</h2>
          <ul className="mt-3 space-y-3">
            {elegidas.map((p) => (
              <li key={p.slug} className="rounded-xl bg-white border border-gray-200 p-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-gray-900 text-sm">{p.nombre}</span>
                  <button type="button" onClick={() => toggle(p.slug)} className="text-xs text-gray-500 hover:text-[#E8002D]" aria-label={`Quitar ${p.nombre}`}>Quitar</button>
                </div>
                <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                  {p.documentos.length > 0 ? p.documentos.join(' ') : NIVEL[p.nivel].texto + '.'}
                </p>
              </li>
            ))}
          </ul>
          {enviado ? (
            <p className="text-sm text-green-900 bg-green-50 border border-green-200 rounded-xl p-3 mt-4">
              <strong>Listo, {enviado}.</strong> Un asesor te escribe en {TIEMPO_RESPUESTA} para revisar tu caso y decirte cómo suele evaluarlo cada prepaga antes de que presentes la declaración.
            </p>
          ) : (
            <button type="button" onClick={() => setFormAbierto(true)}
              className="mt-4 w-full py-4 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-2xl transition-colors">
              Revisar mi caso con un asesor →
            </button>
          )}
          <p className="text-xs text-gray-500 mt-3">Es gratis y no te compromete a nada. Cada prepaga tiene su propio criterio de auditoría: el asesor te dice cómo suele evaluarlo cada una.</p>
        </section>
      )}

      {formAbierto && (
        <FormularioLead
          titulo="Revisamos tu caso"
          bajada="Te decimos qué documentación preparar y cómo suele evaluar tu caso cada prepaga, antes de que presentes la declaración jurada."
          textoBoton="Quiero que me asesoren →"
          pedirEdades
          onCerrar={() => setFormAbierto(false)}
          onEnviar={enviar}
        />
      )}
    </div>
  )
}

function ConCondicionDeUrl() {
  const c = useSearchParams().get('c')
  const inicial = c ? preexistenciasDoc.find((x) => x.slug === c) : undefined
  return <BuscadorPreexistencias key={inicial?.slug} inicial={inicial} />
}

/** El buscador sale en el HTML (fallback) y, ya en el navegador, se reemplaza
 *  por el que toma ?c=<slug> del link (desde una ficha o el buscador del sitio). */
export function BuscadorPreexistenciasConUrl() {
  return (
    <Suspense fallback={<BuscadorPreexistencias />}>
      <ConCondicionDeUrl />
    </Suspense>
  )
}
