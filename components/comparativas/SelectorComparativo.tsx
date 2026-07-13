'use client'

import { useState } from 'react'
import Link from 'next/link'
import { prepagas } from '@/lib/data/prepagas'
import { comparativas } from '@/lib/data/comparativas'
import { formatPrecio } from '@/lib/utils'
import type { Prepaga } from '@/types'

const logoColors: Record<string, { bg: string; text: string }> = {
  'swiss-medical': { bg: '#FEE2E2', text: '#991B1B' },
  osde:            { bg: '#DBEAFE', text: '#1E3A8A' },
  cemic:           { bg: '#E0E7FF', text: '#3730A3' },
  'sancor-salud':  { bg: '#FEF3C7', text: '#92400E' },
  premedic:        { bg: '#DBEAFE', text: '#1E40AF' },
  medife:          { bg: '#D1FAE5', text: '#065F46' },
  omint:           { bg: '#EDE9FE', text: '#5B21B6' },
  medicus:         { bg: '#FCE7F3', text: '#9D174D' },
}

function initials(nombre: string) {
  return nombre.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function PrepagaCard({
  prepaga,
  selected,
  disabled,
  onClick,
  size = 'md',
}: {
  prepaga: Prepaga
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
  size?: 'sm' | 'md'
}) {
  const colors = logoColors[prepaga.slug] ?? { bg: '#F3F4F6', text: '#374151' }
  const minPrecio = Math.min(...prepaga.planes.map((p) => p.precio))

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group w-full text-left rounded-2xl border-2 transition-all duration-150 ${
        size === 'sm' ? 'p-3' : 'p-4'
      } ${
        selected
          ? 'border-[#E8002D] bg-red-50 shadow-md ring-2 ring-red-200'
          : disabled
          ? 'border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed'
          : 'border-gray-200 bg-white hover:border-[#E8002D] hover:shadow-sm cursor-pointer'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex-shrink-0 rounded-xl flex items-center justify-center font-black ${
            size === 'sm' ? 'w-10 h-10 text-sm' : 'w-12 h-12 text-base'
          }`}
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          {initials(prepaga.nombre)}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-bold text-gray-900 leading-tight truncate ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
            {prepaga.nombre}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            Desde {formatPrecio(minPrecio)}/mes · {prepaga.satisfaccion}% satisf.
          </div>
        </div>
        {selected && (
          <div className="flex-shrink-0 w-6 h-6 bg-[#E8002D] rounded-full flex items-center justify-center">
            <svg viewBox="0 0 12 12" fill="white" className="w-3 h-3">
              <path fillRule="evenodd" d="M10.28 1.28L3.989 9.05 1.695 6.288a.75.75 0 00-1.14.976l2.939 3.425a.75.75 0 001.07.093l7-8.5a.75.75 0 00-1.284-.802z" clipRule="evenodd"/>
            </svg>
          </div>
        )}
      </div>
    </button>
  )
}

function ResultadoComparacion({ p1, p2 }: { p1: Prepaga; p2: Prepaga }) {
  const comparativa = comparativas.find(
    (c) =>
      (c.prepaga1Slug === p1.slug && c.prepaga2Slug === p2.slug) ||
      (c.prepaga1Slug === p2.slug && c.prepaga2Slug === p1.slug)
  )

  const min1 = Math.min(...p1.planes.map((p) => p.precio))
  const min2 = Math.min(...p2.planes.map((p) => p.precio))
  const ganaPrecio = min1 <= min2 ? p1 : p2
  const ganaRed = p1.profesionales >= p2.profesionales ? p1 : p2
  const ganaSat = p1.satisfaccion >= p2.satisfaccion ? p1 : p2
  const ganaPlanes = p1.planes.length >= p2.planes.length ? p1 : p2

  const metrics = [
    {
      label: 'Precio de entrada',
      val1: formatPrecio(min1) + '/mes',
      val2: formatPrecio(min2) + '/mes',
      winner: ganaPrecio.slug,
      icon: (
        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      ),
    },
    {
      label: 'Red de profesionales',
      val1: p1.profesionales.toLocaleString('es-AR'),
      val2: p2.profesionales.toLocaleString('es-AR'),
      winner: ganaRed.slug,
      icon: (
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
      ),
    },
    {
      label: 'Satisfacción afiliados',
      val1: p1.satisfaccion + '%',
      val2: p2.satisfaccion + '%',
      winner: ganaSat.slug,
      icon: (
        <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      ),
    },
    {
      label: 'Cantidad de planes',
      val1: p1.planes.length + ' planes',
      val2: p2.planes.length + ' planes',
      winner: ganaPlanes.slug,
      icon: (
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      ),
    },
  ]

  const c1 = logoColors[p1.slug] ?? { bg: '#F3F4F6', text: '#374151' }
  const c2 = logoColors[p2.slug] ?? { bg: '#F3F4F6', text: '#374151' }

  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header comparación */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black mx-auto mb-2"
            style={{ backgroundColor: c1.bg, color: c1.text }}
          >
            {initials(p1.nombre)}
          </div>
          <div className="font-bold text-gray-900">{p1.nombre}</div>
          <div className="text-xs text-gray-400">{p1.planes.length} planes disponibles</div>
        </div>

        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-xs font-black text-gray-500">VS</span>
        </div>

        <div className="flex-1 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black mx-auto mb-2"
            style={{ backgroundColor: c2.bg, color: c2.text }}
          >
            {initials(p2.nombre)}
          </div>
          <div className="font-bold text-gray-900">{p2.nombre}</div>
          <div className="text-xs text-gray-400">{p2.planes.length} planes disponibles</div>
        </div>
      </div>

      {/* Métricas */}
      <div className="space-y-3 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="w-4 h-4 text-gray-400">
                {m.icon}
              </svg>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{m.label}</span>
            </div>
            <div className="flex">
              {/* P1 */}
              <div className={`flex-1 px-4 py-3 text-center border-r border-gray-100 ${m.winner === p1.slug ? 'bg-red-50' : ''}`}>
                <div className={`font-bold text-sm ${m.winner === p1.slug ? 'text-[#E8002D]' : 'text-gray-700'}`}>
                  {m.val1}
                </div>
                {m.winner === p1.slug && (
                  <div className="text-[10px] font-semibold text-[#E8002D] mt-0.5 flex items-center justify-center gap-1">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    Gana
                  </div>
                )}
              </div>
              {/* P2 */}
              <div className={`flex-1 px-4 py-3 text-center ${m.winner === p2.slug ? 'bg-red-50' : ''}`}>
                <div className={`font-bold text-sm ${m.winner === p2.slug ? 'text-[#E8002D]' : 'text-gray-700'}`}>
                  {m.val2}
                </div>
                {m.winner === p2.slug && (
                  <div className="text-[10px] font-semibold text-[#E8002D] mt-0.5 flex items-center justify-center gap-1">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    Gana
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Planes del plan más accesible de cada una */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[{ p: p1, c: c1 }, { p: p2, c: c2 }].map(({ p, c }) => {
          const planBase = p.planes.find((pl) => pl.destacado) ?? p.planes[0]
          return (
            <div key={p.slug} className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="text-xs font-semibold text-gray-400 mb-2">Plan más elegido</div>
              <div
                className="text-xs font-black px-2 py-1 rounded-lg inline-block mb-2"
                style={{ backgroundColor: c.bg, color: c.text }}
              >
                {planBase.nombre}
              </div>
              <div className="text-lg font-black text-gray-900">
                {formatPrecio(planBase.precio)}
                <span className="text-xs font-normal text-gray-400">/mes</span>
              </div>
              <div className="flex gap-1 mt-2 flex-wrap">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${planBase.copago ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                  {planBase.copago ? 'Con copago' : 'Sin copago'}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${planBase.redAbierta ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                  Red {planBase.redAbierta ? 'abierta' : 'cerrada'}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Veredicto si existe comparativa */}
      {comparativa && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-600">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">Veredicto PrepagaYa</span>
          </div>
          <p className="text-sm text-amber-900 leading-relaxed">{comparativa.veredicto}</p>
        </div>
      )}

      {/* CTAs secundarios */}
      <div className="flex flex-col gap-3 mb-5">
        {comparativa ? (
          <Link
            href={`/comparativas/${comparativa.slug}`}
            className="w-full py-3 border border-[#E8002D] text-[#E8002D] hover:bg-red-50 font-semibold rounded-xl text-sm text-center transition-colors"
          >
            Ver análisis completo →
          </Link>
        ) : (
          <Link
            href={`/comparar?p1=${p1.slug}&p2=${p2.slug}`}
            className="w-full py-3 border border-[#E8002D] text-[#E8002D] hover:bg-red-50 font-semibold rounded-xl text-sm text-center transition-colors"
          >
            Ver comparación detallada →
          </Link>
        )}
        <div className="grid grid-cols-2 gap-2">
          <Link href={`/prepagas/${p1.slug}`} className="py-2.5 border border-gray-200 hover:border-gray-300 text-gray-500 font-medium rounded-xl text-xs text-center transition-colors">
            Planes {p1.nombre} →
          </Link>
          <Link href={`/prepagas/${p2.slug}`} className="py-2.5 border border-gray-200 hover:border-gray-300 text-gray-500 font-medium rounded-xl text-xs text-center transition-colors">
            Planes {p2.nombre} →
          </Link>
        </div>
      </div>

      {/* CTA cotizar */}
      <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] rounded-2xl p-5 text-white text-center">
        <p className="font-bold text-base mb-1">¿Querés saber cuánto pagás vos?</p>
        <p className="text-sm text-red-100 mb-4">El precio varía según tu edad y grupo familiar. Cotizá gratis en 2 minutos.</p>
        <Link
          href="/#cotizador"
          className="inline-block bg-white text-[#E8002D] font-bold px-6 py-3 rounded-xl text-sm hover:bg-red-50 transition-colors"
        >
          Cotizar mi prepaga gratis →
        </Link>
      </div>
    </div>
  )
}

export function SelectorComparativo(): React.ReactElement {
  const [primera, setPrimera] = useState<Prepaga | null>(null)
  const [segunda, setSegunda] = useState<Prepaga | null>(null)

  const reset = () => {
    setPrimera(null)
    setSegunda(null)
  }

  const seleccionarPrimera = (p: Prepaga) => {
    setPrimera(p)
    setSegunda(null)
  }

  const seleccionarSegunda = (p: Prepaga) => {
    if (p.slug === primera?.slug) return
    setSegunda(p)
  }

  return (
    <div>
      {/* Step 1: Elegí la primera */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${primera ? 'bg-[#00875A] text-white' : 'bg-[#E8002D] text-white'}`}>
            {primera ? (
              <svg viewBox="0 0 12 12" fill="white" className="w-3 h-3">
                <path fillRule="evenodd" d="M10.28 1.28L3.989 9.05 1.695 6.288a.75.75 0 00-1.14.976l2.939 3.425a.75.75 0 001.07.093l7-8.5a.75.75 0 00-1.284-.802z" clipRule="evenodd"/>
              </svg>
            ) : '1'}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">
              {primera ? `Elegiste ${primera.nombre}` : 'Elegí la primera prepaga'}
            </p>
            {!primera && <p className="text-xs text-gray-400">Tocá la prepaga que querés comparar</p>}
          </div>
          {primera && (
            <p className="ml-auto text-xs text-gray-400">Tocá otra para cambiar</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {prepagas.map((p) => (
            <PrepagaCard
              key={p.slug}
              prepaga={p}
              selected={primera?.slug === p.slug}
              onClick={() => seleccionarPrimera(p)}
            />
          ))}
        </div>
      </div>

      {/* Step 2: Elegí la segunda */}
      {primera && (
        <div className="border-t border-gray-100 pt-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${segunda ? 'bg-[#00875A] text-white' : 'bg-[#E8002D] text-white ring-4 ring-red-100'}`}>
              {segunda ? (
                <svg viewBox="0 0 12 12" fill="white" className="w-3 h-3">
                  <path fillRule="evenodd" d="M10.28 1.28L3.989 9.05 1.695 6.288a.75.75 0 00-1.14.976l2.939 3.425a.75.75 0 001.07.093l7-8.5a.75.75 0 00-1.284-.802z" clipRule="evenodd"/>
                </svg>
              ) : '2'}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">
                {segunda ? `Comparando con ${segunda.nombre}` : `¿Con quién comparamos ${primera.nombre}?`}
              </p>
              {!segunda && <p className="text-xs text-gray-400">Elegí la segunda prepaga</p>}
            </div>
            {segunda && (
              <button onClick={() => setSegunda(null)} className="ml-auto text-xs text-gray-400 hover:text-gray-600 underline">
                Cambiar
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prepagas
              .filter((p) => p.slug !== primera.slug)
              .map((p) => (
                <PrepagaCard
                  key={p.slug}
                  prepaga={p}
                  selected={segunda?.slug === p.slug}
                  size="sm"
                  onClick={() => seleccionarSegunda(p)}
                />
              ))}
          </div>
        </div>
      )}

      {/* Resultado */}
      {primera && segunda && (
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-full bg-[#E8002D] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
            <p className="font-bold text-gray-900 text-sm">Resultado de la comparación</p>
          </div>
          <ResultadoComparacion p1={primera} p2={segunda} />
        </div>
      )}
    </div>
  )
}
