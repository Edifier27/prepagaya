'use client'

import { useState } from 'react'
import Link from 'next/link'
import { prepagas } from '@/lib/data/prepagas'
import { formatPrecio } from '@/lib/utils'

type PrepagaSlug =
  | 'swiss-medical'
  | 'osde'
  | 'cemic'
  | 'sancor-salud'
  | 'premedic'
  | 'medife'

interface Opcion {
  texto: string
  puntos: Partial<Record<PrepagaSlug, number>>
}

interface Pregunta {
  id: number
  texto: string
  opciones: Opcion[]
}

const PREGUNTAS: Pregunta[] = [
  {
    id: 1,
    texto: '¿Cuánto podés destinar por mes a tu prepaga?',
    opciones: [
      { texto: 'Menos de $200.000', puntos: { premedic: 3, medife: 1 } },
      { texto: '$200.000–$350.000', puntos: { 'swiss-medical': 2, medife: 2, 'sancor-salud': 1, osde: 1 } },
      { texto: '$350.000–$600.000', puntos: { osde: 3, cemic: 2, 'swiss-medical': 1 } },
      { texto: 'Más de $600.000', puntos: { osde: 3, cemic: 3 } },
    ],
  },
  {
    id: 2,
    texto: '¿Dónde vivís?',
    opciones: [
      { texto: 'CABA o GBA', puntos: { 'swiss-medical': 3, cemic: 2, osde: 1 } },
      { texto: 'Provincia grande (Córdoba, Rosario, Mendoza)', puntos: { osde: 2, 'sancor-salud': 2, medife: 1 } },
      { texto: 'Interior del país', puntos: { 'sancor-salud': 3, medife: 2, osde: 1 } },
      { texto: 'Viajo mucho', puntos: { osde: 2, 'sancor-salud': 2 } },
    ],
  },
  {
    id: 3,
    texto: '¿Qué lugar ocupa la salud mental para vos?',
    opciones: [
      { texto: 'Es mi prioridad #1', puntos: { osde: 3, 'swiss-medical': 1 } },
      { texto: 'Importante pero no lo principal', puntos: { osde: 1, 'swiss-medical': 2, cemic: 1 } },
      { texto: 'No es prioridad', puntos: { premedic: 2, 'sancor-salud': 2, medife: 1 } },
    ],
  },
  {
    id: 4,
    texto: '¿Tenés médico de confianza al que querés seguir viendo?',
    opciones: [
      { texto: 'Sí, quiero seguir con él', puntos: { osde: 3, 'sancor-salud': 2 } },
      { texto: 'No, puedo cambiar', puntos: { 'swiss-medical': 3, cemic: 3, premedic: 2 } },
      { texto: 'Prefiero una red grande para elegir', puntos: { osde: 3, medife: 1 } },
    ],
  },
  {
    id: 5,
    texto: '¿Qué tan importante es no pagar copago por cada consulta?',
    opciones: [
      { texto: 'Muy importante', puntos: { 'swiss-medical': 2, osde: 2, cemic: 2 } },
      { texto: 'Me parece bien pagar algo', puntos: { 'sancor-salud': 2, medife: 2, premedic: 2 } },
      { texto: 'Me es indiferente', puntos: { osde: 1, 'swiss-medical': 1 } },
    ],
  },
  {
    id: 6,
    texto: '¿Para cuántas personas buscás prepaga?',
    opciones: [
      { texto: 'Solo para mí', puntos: { premedic: 1, medife: 1 } },
      { texto: 'Para mí y mi pareja', puntos: { 'swiss-medical': 1, osde: 1 } },
      { texto: 'Familia con hijos', puntos: { osde: 2, 'swiss-medical': 2, 'sancor-salud': 1 } },
    ],
  },
]

const TOTAL_PREGUNTAS = PREGUNTAS.length

type Scores = Record<PrepagaSlug, number>

function calcularResultados(respuestas: (number | null)[]): PrepagaSlug[] {
  const scores: Scores = {
    'swiss-medical': 0,
    osde: 0,
    cemic: 0,
    'sancor-salud': 0,
    premedic: 0,
    medife: 0,
  }

  respuestas.forEach((opcionIdx, pregIdx) => {
    if (opcionIdx === null) return
    const opcion = PREGUNTAS[pregIdx].opciones[opcionIdx]
    for (const [slug, pts] of Object.entries(opcion.puntos)) {
      scores[slug as PrepagaSlug] = (scores[slug as PrepagaSlug] ?? 0) + (pts ?? 0)
    }
  })

  return (Object.entries(scores) as [PrepagaSlug, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([slug]) => slug)
}

function BarraProgreso({ actual, total }: { actual: number; total: number }): React.ReactElement {
  const pct = Math.round((actual / total) * 100)
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-500">
          Pregunta {actual} de {total}
        </span>
        <span className="text-xs font-bold text-[#E8002D]">{pct}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: '#E8002D' }}
        />
      </div>
    </div>
  )
}

export function QuizPrepaga(): React.ReactElement {
  const [respuestas, setRespuestas] = useState<(number | null)[]>(
    Array(TOTAL_PREGUNTAS).fill(null)
  )
  const [preguntaActual, setPreguntaActual] = useState(0)
  const [mostrarResultados, setMostrarResultados] = useState(false)
  const [animando, setAnimando] = useState(false)

  const pregunta = PREGUNTAS[preguntaActual]
  const respuestaSeleccionada = respuestas[preguntaActual]

  function seleccionarOpcion(opcionIdx: number) {
    const nuevas = [...respuestas]
    nuevas[preguntaActual] = opcionIdx
    setRespuestas(nuevas)
  }

  function avanzar() {
    if (preguntaActual < TOTAL_PREGUNTAS - 1) {
      setAnimando(true)
      setTimeout(() => {
        setPreguntaActual((p) => p + 1)
        setAnimando(false)
      }, 200)
    } else {
      setMostrarResultados(true)
    }
  }

  function volver() {
    if (preguntaActual > 0) {
      setAnimando(true)
      setTimeout(() => {
        setPreguntaActual((p) => p - 1)
        setAnimando(false)
      }, 200)
    }
  }

  function reiniciar() {
    setRespuestas(Array(TOTAL_PREGUNTAS).fill(null))
    setPreguntaActual(0)
    setMostrarResultados(false)
  }

  if (mostrarResultados) {
    const top3 = calcularResultados(respuestas)

    return (
      <div className="animate-in fade-in duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-[#E8002D] text-xs font-bold px-4 py-2 rounded-full mb-4">
            Resultados de tu quiz
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Las prepagas que mejor se adaptan a vos
          </h2>
          <p className="text-gray-500 text-sm">
            Basado en tus respuestas, estas son las tres opciones más recomendadas.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {top3.map((slug, i) => {
            const prepaga = prepagas.find((p) => p.slug === slug)
            if (!prepaga) return null
            const planDestacado =
              prepaga.planes.find((pl) => pl.destacado) ?? prepaga.planes[0]
            const esMejor = i === 0

            return (
              <div
                key={slug}
                className={`rounded-2xl border-2 overflow-hidden transition-shadow ${
                  esMejor
                    ? 'border-[#E8002D] shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                {esMejor && (
                  <div className="bg-[#E8002D] text-white text-xs font-bold px-5 py-2 flex items-center gap-2">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Mejor match para tu perfil
                  </div>
                )}

                <div className="bg-white p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-400">#{i + 1}</span>
                        <h3 className="text-lg font-black text-gray-900">{prepaga.nombre}</h3>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed max-w-md">
                        {prepaga.descripcion.split('.')[0]}.
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-xs text-gray-400 mb-0.5">Desde</div>
                      <div className="text-xl font-black text-[#00875A]">
                        {formatPrecio(planDestacado.precio)}
                      </div>
                      <div className="text-xs text-gray-400">/mes</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500 font-medium">
                      {prepaga.satisfaccion}% satisfacción
                    </span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-500 font-medium">
                      {prepaga.profesionales.toLocaleString('es-AR')} profesionales
                    </span>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Link
                      href="/"
                      className="flex-1 text-center py-3 rounded-xl font-bold text-sm bg-[#00875A] hover:bg-[#006644] text-white transition-all shadow-sm hover:shadow-md"
                    >
                      Cotizar
                    </Link>
                    <Link
                      href={`/prepagas/${slug}`}
                      className="flex-1 text-center py-3 rounded-xl font-bold text-sm border-2 border-[#E8002D] text-[#E8002D] hover:bg-red-50 transition-all"
                    >
                      Ver planes
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <button
            onClick={reiniciar}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Volver a hacer el quiz
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <BarraProgreso actual={preguntaActual + 1} total={TOTAL_PREGUNTAS} />

      <div
        className={`transition-all duration-200 ${animando ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0'}`}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">{pregunta.texto}</h2>

        <div className="space-y-3 mb-8">
          {pregunta.opciones.map((opcion, idx) => (
            <button
              key={idx}
              onClick={() => seleccionarOpcion(idx)}
              className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 font-medium text-sm ${
                respuestaSeleccionada === idx
                  ? 'border-[#E8002D] bg-red-50 text-[#E8002D]'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-red-200 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                    respuestaSeleccionada === idx
                      ? 'border-[#E8002D] bg-[#E8002D]'
                      : 'border-gray-300'
                  }`}
                >
                  {respuestaSeleccionada === idx && (
                    <svg viewBox="0 0 12 12" fill="white" className="w-3 h-3">
                      <path
                        fillRule="evenodd"
                        d="M10.28 1.28L3.989 9.05 1.695 6.288a.75.75 0 00-1.14.976l2.939 3.425a.75.75 0 001.07.093l7-8.5a.75.75 0 00-1.284-.802z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
                {opcion.texto}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        {preguntaActual > 0 ? (
          <button
            onClick={volver}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className="w-4 h-4"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Volver
          </button>
        ) : (
          <span />
        )}

        <button
          onClick={avanzar}
          disabled={respuestaSeleccionada === null}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#E8002D] hover:bg-[#B8001F] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
        >
          {preguntaActual === TOTAL_PREGUNTAS - 1 ? 'Ver mis resultados' : 'Siguiente'}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="w-4 h-4"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
