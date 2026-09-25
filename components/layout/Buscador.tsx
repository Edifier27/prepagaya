'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { track } from '@vercel/analytics'
import type { EntradaBuscador } from '@/lib/buscador/indice'
import { normalizarBusqueda } from '@/lib/busqueda'

// Buscador del sitio (24-sep-2026): una caja para buscar prepagas, planes,
// sanatorios, obras sociales, códigos, coberturas y guías, que lleva siempre
// a una página nuestra. El índice (/api/buscador) se baja al abrirlo. Lo que
// la gente busca queda en Vercel Analytics (eventos "Buscador" y "Buscador
// sin resultados"): sirve para saber qué contenido falta.

interface Indice { grupos: string[]; entradas: EntradaBuscador[] }
interface Preparada { e: EntradaBuscador; t: string; todo: string }

const SUGERENCIAS = ['Swiss Medical', 'OSDE', 'Código de obra social', 'Aumentos', 'Hospital Alemán', 'Chequeá tu prepaga']
// Grupos que suben en el orden cuando empatan (Prepagas, Herramientas, Obras sociales)
const BONUS_GRUPO: Record<number, number> = { 0: 2, 1: 3, 2: 1, 4: 2 }

function buscar(prep: Preparada[], q: string): Preparada[] {
  const tokens = normalizarBusqueda(q).split(/\s+/).filter(Boolean)
  if (!tokens.length) return []
  const res: { p: Preparada; s: number }[] = []
  for (const p of prep) {
    if (!tokens.every((tk) => p.todo.includes(tk))) continue
    let s = (BONUS_GRUPO[p.e[2]] ?? 0) + (p.e[5] ?? 0)
    for (const tk of tokens) s += p.t.startsWith(tk) ? 5 : p.t.includes(` ${tk}`) ? 3 : p.t.includes(tk) ? 2 : 0
    s -= p.t.length / 40
    res.push({ p, s })
  }
  // Si hay suficientes coincidencias en el título, las que solo coinciden
  // por la dirección o el subtítulo (ej. una clínica en la calle Güemes) sobran.
  const enTitulo = res.filter((x) => tokens.every((tk) => x.p.t.includes(tk)))
  return (enTitulo.length >= 5 ? enTitulo : res).sort((a, b) => b.s - a.s).slice(0, 12).map((x) => x.p)
}

export function Buscador({ variante = 'icono' }: { variante?: 'icono' | 'barra' }) {
  const [abierto, setAbierto] = useState(false)
  const [ix, setIx] = useState<Indice | null>(null)
  const [q, setQ] = useState('')
  const [activo, setActivo] = useState(0)
  const router = useRouter()
  const pedido = useRef<Promise<void> | null>(null)
  const input = useRef<HTMLInputElement>(null)

  function abrir() {
    setAbierto(true)
    if (!pedido.current) {
      pedido.current = fetch('/api/buscador').then((r) => (r.ok ? r.json() : null)).then((d: Indice | null) => setIx(d)).catch(() => {})
    }
  }
  function cerrar() { setAbierto(false); setQ(''); setActivo(0) }

  // Atajo de teclado: "/" o Ctrl/Cmd+K abren el buscador.
  useEffect(() => {
    if (variante !== 'icono') return
    const f = (e: KeyboardEvent) => {
      const escribiendo = e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)
      if ((e.key === '/' && !escribiendo) || (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey))) { e.preventDefault(); abrir() }
    }
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  }, [variante])

  useEffect(() => {
    if (!abierto) return
    input.current?.focus()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = overflow }
  }, [abierto])

  const preparadas = useMemo<Preparada[]>(() => (ix?.entradas ?? []).map((e) => ({
    e, t: normalizarBusqueda(e[0]), todo: normalizarBusqueda(`${e[0]} ${e[3]} ${e[4]}`),
  })), [ix])
  const resultados = useMemo(() => buscar(preparadas, q), [preparadas, q])

  // Búsquedas sin resultado: se registran (sin datos personales) para saber qué falta.
  useEffect(() => {
    if (!ix || q.trim().length < 3 || resultados.length) return
    const t = setTimeout(() => track('Buscador sin resultados', { q: q.trim().slice(0, 60) }), 1200)
    return () => clearTimeout(t)
  }, [ix, q, resultados.length])

  function ir(e: EntradaBuscador) {
    track('Buscador', { q: q.trim().slice(0, 60), destino: e[1].slice(0, 100) })
    cerrar()
    router.push(e[1])
  }

  function teclas(ev: React.KeyboardEvent) {
    if (ev.key === 'Escape') cerrar()
    else if (ev.key === 'ArrowDown') { ev.preventDefault(); setActivo((a) => Math.min(a + 1, resultados.length - 1)) }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); setActivo((a) => Math.max(a - 1, 0)) }
    else if (ev.key === 'Enter' && resultados[activo]) { ev.preventDefault(); ir(resultados[activo].e) }
  }

  return (
    <>
      {variante === 'icono' ? (
        <button type="button" onClick={abrir} aria-label="Buscar en PrepagaYa"
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-5 h-5"><path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>
        </button>
      ) : (
        <button type="button" onClick={abrir}
          className="w-full min-w-0 flex items-center gap-3 rounded-2xl border-2 border-gray-200 bg-white px-4 py-3.5 text-left text-gray-500 hover:border-gray-300">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-5 h-5 shrink-0"><path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>
          {/* Texto corto en el celular: el largo se cortaba con "…" */}
          <span className="truncate sm:hidden">Buscá prepaga, plan o sanatorio</span>
          <span className="truncate hidden sm:inline">Buscá una prepaga, plan, sanatorio u obra social</span>
        </button>
      )}

      {abierto && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center sm:pt-20" role="dialog" aria-modal="true" aria-label="Buscar en PrepagaYa">
          <div className="absolute inset-0 bg-gray-900/40 hidden sm:block" onClick={cerrar} />
          <div className="relative bg-white w-full h-full sm:h-auto sm:max-h-[70vh] sm:max-w-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 border-b border-gray-100 px-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-5 h-5 text-gray-400 shrink-0" aria-hidden><path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>
              <input
                ref={input}
                value={q}
                onChange={(e) => { setQ(e.target.value); setActivo(0) }}
                onKeyDown={teclas}
                placeholder="Prepaga, plan, sanatorio, obra social o código"
                aria-label="Buscar"
                autoComplete="off"
                className="flex-1 py-4 text-base focus:outline-none"
              />
              <button type="button" onClick={cerrar} className="text-sm font-semibold text-gray-500 hover:text-gray-900 px-2 py-1">Cerrar</button>
            </div>

            <div className="overflow-y-auto">
              {!q.trim() ? (
                <div className="p-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Lo más buscado</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGERENCIAS.map((s) => (
                      <button key={s} type="button" onClick={() => { setQ(s); input.current?.focus() }}
                        className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-[#E8002D] hover:text-[#E8002D]">{s}</button>
                    ))}
                  </div>
                </div>
              ) : !ix ? (
                <p className="p-4 text-sm text-gray-500">Cargando…</p>
              ) : resultados.length === 0 ? (
                <div className="p-4 text-sm text-gray-600">
                  No encontramos “{q.trim()}”. Probá con otra palabra, o <button type="button" onClick={() => { cerrar(); router.push('/comparador') }} className="font-semibold text-[#E8002D] hover:underline">cotizá gratis</button> y un asesor te responde.
                </div>
              ) : (
                <ul role="listbox" aria-label="Resultados">
                  {resultados.map(({ e }, i) => (
                    <li key={e[1]} role="option" aria-selected={i === activo}>
                      <button type="button" onClick={() => ir(e)} onMouseEnter={() => setActivo(i)}
                        className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 ${i === activo ? 'bg-red-50' : ''}`}>
                        <span className="min-w-0">
                          <span className="block font-semibold text-gray-900 text-sm truncate">{e[0]}</span>
                          {e[3] && <span className="block text-xs text-gray-500 truncate">{e[3]}</span>}
                        </span>
                        <span className="shrink-0 text-[11px] font-semibold text-gray-400">{ix.grupos[e[2]]}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
