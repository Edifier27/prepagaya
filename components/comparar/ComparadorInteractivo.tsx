'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { formatPrecio } from '@/lib/utils'

const FILAS = [
  { key: 'precio', label: 'Precio base (30 años)', tipo: 'precio' },
  { key: 'satisfaccion', label: 'Satisfacción de afiliados', tipo: 'porcentaje' },
  { key: 'rating', label: 'Valoración usuarios', tipo: 'rating' },
  { key: 'profesionales', label: 'Profesionales adheridos', tipo: 'numero' },
  { key: 'sanatoriosPropios', label: 'Sanatorios propios', tipo: 'numero' },
  { key: 'appMovil', label: 'App móvil', tipo: 'bool' },
  { key: 'atencion24hs', label: 'Atención 24hs', tipo: 'bool' },
  { key: 'coberturaNacional', label: 'Cobertura nacional', tipo: 'bool' },
  { key: 'saludMental', label: 'Salud mental / Psicología', tipo: 'bool' },
  { key: 'maternidad', label: 'Maternidad', tipo: 'bool' },
  { key: 'odontologia', label: 'Odontología', tipo: 'bool' },
  { key: 'optica', label: 'Óptica', tipo: 'bool' },
  { key: 'farmacia', label: 'Cobertura en farmacia', tipo: 'bool' },
]

function getValor(prepaga: (typeof prepagas)[0], key: string): unknown {
  if (key === 'precio') return prepaga.planes[0]?.precio ?? 0
  if (key === 'satisfaccion') return prepaga.satisfaccion
  if (key === 'rating') return prepaga.rating
  if (key === 'profesionales') return prepaga.profesionales
  if (key === 'sanatoriosPropios') return prepaga.sanatoriosPropios
  return prepaga.caracteristicas[key as keyof typeof prepaga.caracteristicas]
}

function ganador(val1: unknown, val2: unknown, tipo: string, key: string): 0 | 1 | 2 {
  if (tipo === 'bool') return val1 === val2 ? 0 : val1 ? 1 : 2
  if (tipo === 'precio') {
    if (val1 === val2) return 0
    return (val1 as number) < (val2 as number) ? 1 : 2
  }
  if (val1 === val2) return 0
  return (val1 as number) > (val2 as number) ? 1 : 2
}

function renderValor(val: unknown, tipo: string): React.ReactNode {
  if (tipo === 'bool') return val ? <span className="text-green-600 text-lg">✓</span> : <span className="text-gray-300 text-lg">—</span>
  if (tipo === 'precio') return <span className="font-bold text-[#E8002D]">{formatPrecio(val as number)}</span>
  if (tipo === 'porcentaje') return <span className="font-semibold text-[#00875A]">{String(val)}%</span>
  if (tipo === 'rating') return <span className="font-semibold">{String(val)} / 5</span>
  if (tipo === 'numero') return <span className="font-semibold">{(val as number).toLocaleString('es-AR')}</span>
  return String(val)
}

export function ComparadorInteractivo() {
  const router = useRouter()
  const params = useSearchParams()

  const [slug1, setSlug1] = useState(params.get('a') ?? 'swiss-medical')
  const [slug2, setSlug2] = useState(params.get('b') ?? 'osde')

  const p1 = useMemo(() => prepagas.find((p) => p.slug === slug1), [slug1])
  const p2 = useMemo(() => prepagas.find((p) => p.slug === slug2), [slug2])

  function handleChange(which: 1 | 2, slug: string) {
    const newSlug1 = which === 1 ? slug : slug1
    const newSlug2 = which === 2 ? slug : slug2
    if (which === 1) setSlug1(slug)
    else setSlug2(slug)
    router.replace(`/comparar?a=${newSlug1}&b=${newSlug2}`, { scroll: false })
  }

  // Score summary
  const puntajes = useMemo(() => {
    if (!p1 || !p2) return { p1: 0, p2: 0 }
    let s1 = 0, s2 = 0
    for (const fila of FILAS) {
      const v1 = getValor(p1, fila.key)
      const v2 = getValor(p2, fila.key)
      const g = ganador(v1, v2, fila.tipo, fila.key)
      if (g === 1) s1++
      else if (g === 2) s2++
    }
    return { p1: s1, p2: s2 }
  }, [p1, p2])

  const veredicto = useMemo(() => {
    if (!p1 || !p2) return null
    if (puntajes.p1 > puntajes.p2) return { ganador: p1.nombre, slug: p1.slug, diferencia: puntajes.p1 - puntajes.p2 }
    if (puntajes.p2 > puntajes.p1) return { ganador: p2.nombre, slug: p2.slug, diferencia: puntajes.p2 - puntajes.p1 }
    return null
  }, [puntajes, p1, p2])

  return (
    <div>
      {/* ── Selectores ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[
          { which: 1 as const, value: slug1 },
          { which: 2 as const, value: slug2 },
        ].map(({ which, value }) => (
          <div key={which}>
            <label className="block text-xs font-medium text-gray-500 mb-2">
              Prepaga {which}
            </label>
            <select
              value={value}
              onChange={(e) => handleChange(which, e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900 font-semibold focus:outline-none focus:border-[#E8002D] transition-colors text-sm"
            >
              {prepagas.map((p) => (
                <option
                  key={p.slug}
                  value={p.slug}
                  disabled={p.slug === (which === 1 ? slug2 : slug1)}
                >
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {p1 && p2 && (
        <>
          {/* ── Veredicto rápido ──────────────────────────────────────────── */}
          <div className={`rounded-2xl p-5 mb-6 text-center ${veredicto ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-200'}`}>
            {veredicto ? (
              <>
                <div className="text-sm text-gray-500 mb-1">Resultado general</div>
                <div className="text-xl font-bold text-gray-900">
                  <span className="text-[#E8002D]">{veredicto.ganador}</span> gana en {veredicto.diferencia} de {FILAS.length} categorías
                </div>
                <div className="flex justify-center gap-8 mt-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#E8002D]">{puntajes.p1}</div>
                    <div className="text-xs text-gray-500">{p1.nombre}</div>
                  </div>
                  <div className="text-gray-300 text-2xl flex items-center">vs</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#E8002D]">{puntajes.p2}</div>
                    <div className="text-xs text-gray-500">{p2.nombre}</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-gray-600 font-medium">Empate técnico — ambas prepagas son equivalentes en la mayoría de categorías</div>
            )}
          </div>

          {/* ── Tabla comparativa ─────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
            {/* Header */}
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
              <div className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Categoría</div>
              <div className="p-4 text-center border-l border-gray-200">
                <div className="font-bold text-gray-900 text-sm">{p1.nombre}</div>
                <div className="text-xs text-[#00875A] font-medium">{p1.satisfaccion}% satisfacción</div>
              </div>
              <div className="p-4 text-center border-l border-gray-200">
                <div className="font-bold text-gray-900 text-sm">{p2.nombre}</div>
                <div className="text-xs text-[#00875A] font-medium">{p2.satisfaccion}% satisfacción</div>
              </div>
            </div>

            {/* Filas */}
            {FILAS.map((fila, i) => {
              const v1 = getValor(p1, fila.key)
              const v2 = getValor(p2, fila.key)
              const g = ganador(v1, v2, fila.tipo, fila.key)

              return (
                <div
                  key={fila.key}
                  className={`grid grid-cols-3 border-b border-gray-100 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                >
                  <div className="p-4 text-sm text-gray-700 font-medium flex items-center">{fila.label}</div>
                  <div className={`p-4 text-center border-l border-gray-100 flex items-center justify-center text-sm ${g === 1 ? 'bg-green-50' : ''}`}>
                    {renderValor(v1, fila.tipo)}
                    {g === 1 && <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">✓</span>}
                  </div>
                  <div className={`p-4 text-center border-l border-gray-100 flex items-center justify-center text-sm ${g === 2 ? 'bg-green-50' : ''}`}>
                    {renderValor(v2, fila.tipo)}
                    {g === 2 && <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">✓</span>}
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Planes de cada prepaga ─────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            {[p1, p2].map((prep) => (
              <div key={prep.slug} className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-3">Planes de {prep.nombre}</h3>
                <div className="space-y-2">
                  {prep.planes.map((plan) => (
                    <Link
                      key={plan.slug}
                      href={`/prepagas/${prep.slug}/${plan.slug}`}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-red-50 transition-colors group"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-900 group-hover:text-[#E8002D]">{plan.nombre}</div>
                        <div className="text-xs text-gray-400">
                          {plan.copago ? 'Con copago' : 'Sin copago'} · {plan.redAbierta ? 'Red abierta' : 'Red cerrada'}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-[#E8002D]">{formatPrecio(plan.precio)}</div>
                    </Link>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <Link
                    href={`/prepagas/${prep.slug}`}
                    className="text-sm font-semibold text-[#E8002D] hover:underline flex items-center gap-1"
                  >
                    Ver página completa de {prep.nombre} →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* ── Compartir ─────────────────────────────────────────────────── */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm text-gray-600">
              <strong>Compartí esta comparativa</strong> — el link se actualiza automáticamente con tu selección
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="text-sm font-semibold text-[#E8002D] border border-[#E8002D] px-4 py-2 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
            >
              📋 Copiar link
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            Precios de referencia para 30 años, contratación individual · {PRECIO_ACTUALIZADO}
          </p>
        </>
      )}
    </div>
  )
}
