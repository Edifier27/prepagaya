'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import type { IndiceCobertura, SanatorioIndice } from '@/lib/data/cartilla-zonas/indice-cobertura'
import { normalizarBusqueda } from '@/lib/busqueda'
import { enviarLead, preciosDelGrupo, resumenEdades } from '@/lib/leads-cliente'
import { formatPrecio, PRIORIDAD_PARTNERS, PARTNERS_OFICIALES_SLUGS, TIEMPO_RESPUESTA } from '@/lib/utils'
import { FormularioLead, type DatosFormulario } from './FormularioLead'

// "Mis sanatorios" (/buscar-por-sanatorio, 24-sep-2026): la persona elige los
// sanatorios donde se atiende y ve qué planes los incluyen a todos, según las
// cartillas oficiales. La cobertura se ve sin dar datos; el precio para su
// edad, después de dejarlos (misma regla que el cotizador).
//
// Orden: primero las prepagas que cubren más sanatorios de la lista; entre
// las que cubren lo mismo, la prioridad de partners (Swiss Medical primero).
// Si Swiss no tiene un sanatorio, no se lo muestra como si lo tuviera.

const MAX = 5
const CLAVE_GUARDADO = 'prepagaya:mis-sanatorios'
const POPULARES = ['Hospital Alemán', 'Hospital Italiano', 'Sanatorio Otamendi y Miroli', 'Sanatorio Güemes', 'FLENI', 'Sanatorio de La Trinidad', 'Sanatorio Finochietto', 'Sanatorio Mater Dei']

const bit = (i: number) => 1 << i
/** "el plan SMG20 y S2 (Global)" / "el Plan 210" (hay etiquetas que ya dicen "Plan") */
const elPlan = (label: string) => (/^plan /i.test(label) ? `el ${label}` : `el plan ${label}`)

interface Resultado {
  slug: string
  nombre: string
  cubre: number
  /** índice del plan elegido en prepagas[slug].planes */
  plan: number
  /** otros planes que cubren lo mismo */
  otros: number[]
}

function calcular(ix: IndiceCobertura, elegidos: SanatorioIndice[]): Resultado[] {
  const out: Resultado[] = []
  for (const [slug, p] of Object.entries(ix.prepagas)) {
    if (!elegidos.some((s) => s.c[slug])) continue
    // Cuántos sanatorios de la lista incluye cada plan de la escalera.
    const conteo = p.escalera.map((id) => {
      const i = p.planes.findIndex((x) => x.id === id)
      return { i, n: elegidos.filter((s) => (s.c[slug]?.[0] ?? 0) & bit(i)).length }
    }).filter((x) => x.i >= 0)
    const cubre = Math.max(0, ...conteo.map((x) => x.n))
    if (cubre === 0) continue
    const empatan = conteo.filter((x) => x.n === cubre)
    // El más bajo de la escalera, prefiriendo uno con precio oficial.
    const elegido = empatan.find((x) => p.planes[x.i].precio.length > 0) ?? empatan[0]
    out.push({ slug, nombre: p.nombre, cubre, plan: elegido.i, otros: empatan.filter((x) => x !== elegido).map((x) => x.i) })
  }
  const prioridad = (s: string) => {
    const i = PRIORIDAD_PARTNERS.indexOf(s)
    return i >= 0 ? i : PRIORIDAD_PARTNERS.length
  }
  return out.sort((a, b) => b.cubre - a.cubre || prioridad(a.slug) - prioridad(b.slug) || a.nombre.localeCompare(b.nombre, 'es'))
}

function leerGuardado(): string[] {
  try {
    const u = new URLSearchParams(window.location.search).get('s')
    if (u) return u.split(',').filter(Boolean).slice(0, MAX)
    return (JSON.parse(localStorage.getItem(CLAVE_GUARDADO) ?? '[]') as string[]).slice(0, MAX)
  } catch {
    return []
  }
}

export function MisSanatorios() {
  const [ix, setIx] = useState<IndiceCobertura | null>(null)
  const [q, setQ] = useState('')
  const [ids, setIds] = useState<string[]>([])
  const [formAbierto, setFormAbierto] = useState(false)
  const [precios, setPrecios] = useState<Record<string, number> | null>(null)
  const [grupo, setGrupo] = useState<{ nombre: string; edades: number[] } | null>(null)
  const pedido = useRef<Promise<IndiceCobertura | null> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function cargar(): Promise<IndiceCobertura | null> {
    if (!pedido.current) {
      pedido.current = fetch('/api/sanatorios-cobertura')
        .then((r) => (r.ok ? r.json() : null))
        .then((d: IndiceCobertura | null) => { setIx(d); return d })
        .catch(() => null)
    }
    return pedido.current
  }

  // Si vuelve con una lista guardada (o entra con un link compartido), se
  // carga el índice y se restaura.
  const restaurado = useRef(false)
  useEffect(() => {
    const guardado = leerGuardado()
    if (!guardado.length) { restaurado.current = true; return }
    cargar().then((d) => {
      if (d) setIds(guardado.filter((id) => d.sanatorios.some((s) => s.id === id)))
      restaurado.current = true
    })
  }, [])

  // La lista queda en el navegador y en el link (para volver o compartirla).
  // Recién después de restaurar, así el primer render no borra el ?s= del link.
  useEffect(() => {
    if (!restaurado.current) return
    try {
      localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(ids))
      const url = new URL(window.location.href)
      if (ids.length) url.searchParams.set('s', ids.join(','))
      else url.searchParams.delete('s')
      window.history.replaceState(null, '', url.toString())
    } catch { /* sin almacenamiento: la herramienta funciona igual */ }
  }, [ids])

  const guardar = (nuevos: string[]) => setIds(nuevos)

  const porId = useMemo(() => new Map((ix?.sanatorios ?? []).map((s) => [s.id, s])), [ix])
  const elegidos = ids.map((id) => porId.get(id)).filter((s): s is SanatorioIndice => Boolean(s))
  const zona = elegidos[0]?.z ?? 'caba'
  const region = elegidos[0]?.rn

  function agregar(s: SanatorioIndice) {
    if (ids.includes(s.id) || ids.length >= MAX) return
    guardar([...ids, s.id])
    setQ('')
    inputRef.current?.focus()
  }

  // Botones de "los más buscados": no tocan el texto del buscador (el índice
  // puede tardar en llegar y la persona ya puede estar escribiendo otro).
  async function agregarPorNombre(nombre: string) {
    const d = ix ?? (await cargar())
    const s = d?.sanatorios.find((x) => x.n === nombre && x.rn === 'AMBA')
    if (s) setIds((prev) => (prev.includes(s.id) || prev.length >= MAX ? prev : [...prev, s.id]))
  }

  const sugerencias = useMemo(() => {
    if (!ix || q.trim().length < 2) return []
    const terminos = normalizarBusqueda(q).split(/\s+/).filter(Boolean)
    return ix.sanatorios
      .filter((s) => !ids.includes(s.id))
      .map((s) => ({ s, t: normalizarBusqueda(`${s.n} ${s.rn}`) }))
      .filter(({ t }) => terminos.every((w) => t.includes(w)))
      .sort((a, b) =>
        Number(b.s.rn === region) - Number(a.s.rn === region)
        || Number(b.t.startsWith(terminos[0])) - Number(a.t.startsWith(terminos[0]))
        || Object.keys(b.s.c).length - Object.keys(a.s.c).length)
      .slice(0, 8)
      .map(({ s }) => s)
  }, [ix, q, ids, region])

  const resultados = useMemo(() => (ix && elegidos.length ? calcular(ix, elegidos) : []), [ix, elegidos])
  const completos = resultados.filter((r) => r.cubre === elegidos.length)

  async function enviar(d: DatosFormulario) {
    if (!ix) return
    const interes = resultados.slice(0, 3).map((r) => `${r.nombre} ${ix.prepagas[r.slug].planes[r.plan].label}`).join(' · ')
    await enviarLead({
      ...d,
      fuente: 'buscar-por-sanatorio',
      provincia: region ?? '',
      interes,
      preferencias: { sanatorios: elegidos.map((s) => s.n).join(', ').slice(0, 200) },
    })
    setPrecios(await preciosDelGrupo(zona, d.edades))
    setGrupo({ nombre: d.nombre, edades: d.edades })
    setFormAbierto(false)
  }

  function precioDe(r: Resultado): { valor: number; plan: string } | null {
    if (!ix || !precios) return null
    const planes = ix.prepagas[r.slug].planes
    for (const i of [r.plan, ...r.otros]) {
      const slugPrecio = planes[i].precio[0]
      const v = slugPrecio ? precios[`${r.slug}/${slugPrecio}`] : undefined
      if (v) return { valor: v, plan: planes[i].label }
    }
    return null
  }

  return (
    <div>
      {/* Buscador */}
      <div className="relative">
        <label htmlFor="buscar-sanatorio" className="block text-sm font-semibold text-gray-800 mb-2">
          {elegidos.length ? `Sumá otro (hasta ${MAX})` : '¿En qué sanatorio, clínica u hospital te atendés?'}
        </label>
        <input
          id="buscar-sanatorio"
          ref={inputRef}
          value={q}
          onChange={(e) => { setQ(e.target.value); cargar() }}
          onFocus={() => cargar()}
          onKeyDown={(e) => { if (e.key === 'Enter' && sugerencias[0]) { e.preventDefault(); agregar(sugerencias[0]) } }}
          disabled={ids.length >= MAX}
          placeholder={ids.length >= MAX ? 'Llegaste al máximo de 5' : 'Ej. Hospital Alemán, Güemes, Allende…'}
          autoComplete="off"
          className="w-full rounded-2xl border-2 border-gray-200 px-4 py-4 text-base focus:outline-none focus:border-[#E8002D] disabled:bg-gray-50"
        />
        {q.trim().length >= 2 && (
          <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
            {!ix && <li className="px-4 py-3 text-sm text-gray-500">Cargando cartillas…</li>}
            {ix && sugerencias.length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-500">No lo encontramos en las cartillas de internación que tenemos. Probá con otra palabra del nombre.</li>
            )}
            {sugerencias.map((s) => (
              <li key={s.id}>
                <button type="button" onClick={() => agregar(s)} className="w-full text-left px-4 py-3 hover:bg-red-50 focus:bg-red-50 focus:outline-none">
                  <span className="block font-semibold text-gray-900 text-sm">{s.n}</span>
                  <span className="block text-xs text-gray-500">{s.rn}{s.d ? ` · ${s.d}` : ''}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Elegidos */}
      {elegidos.length > 0 ? (
        <ul className="flex flex-wrap gap-2 mt-3" aria-label="Tus sanatorios">
          {elegidos.map((s) => (
            <li key={s.id} className="inline-flex items-center gap-1 rounded-full bg-gray-900 text-white text-sm pl-3 pr-1 py-1">
              {s.n}
              <button type="button" onClick={() => guardar(ids.filter((x) => x !== s.id))} aria-label={`Sacar ${s.n}`}
                className="w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center">×</button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">Los más buscados en AMBA:</p>
          <div className="flex flex-wrap gap-2">
            {POPULARES.map((n) => (
              <button key={n} type="button" onClick={() => agregarPorNombre(n)}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:border-[#E8002D] hover:text-[#E8002D]">
                + {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resultados */}
      {ix && elegidos.length > 0 && (
        <div className="mt-8" aria-live="polite">
          <h2 className="text-xl font-bold text-gray-900">
            {completos.length > 0
              ? `${completos.length === 1 ? 'Una prepaga incluye' : `${completos.length} prepagas incluyen`} ${elegidos.length === 1 ? 'tu sanatorio' : `tus ${elegidos.length} sanatorios`}`
              : elegidos.length > 1 ? 'Ninguna prepaga incluye todos juntos' : 'No encontramos ese sanatorio en las cartillas'}
          </h2>
          {completos.length === 0 && elegidos.length > 1 && (
            <p className="text-sm text-gray-600 mt-1">Estas son las que incluyen más de tu lista. Un asesor puede ayudarte a elegir cuál priorizar.</p>
          )}

          {grupo && (
            <div className="mt-4 rounded-2xl bg-green-50 border border-green-200 p-4 text-sm text-green-900">
              <strong>Listo, {grupo.nombre}.</strong> Estos son los precios de lista para {resumenEdades(grupo.edades)}. Un asesor te escribe en {TIEMPO_RESPUESTA} con la cotización formal y los descuentos que apliquen.
            </div>
          )}

          <ul className="mt-4 space-y-4">
            {resultados.map((r) => {
              const p = ix.prepagas[r.slug]
              const precio = precioDe(r)
              const partner = PARTNERS_OFICIALES_SLUGS.includes(r.slug)
              return (
                <li key={r.slug} className={`rounded-2xl border bg-white p-5 ${r.cubre === elegidos.length ? 'border-gray-200' : 'border-dashed border-gray-300'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-gray-900">{p.nombre}</h3>
                        {partner && <span className="text-[11px] font-semibold text-[#E8002D] bg-red-50 border border-red-100 rounded-full px-2 py-0.5">Partner PrepagaYa</span>}
                      </div>
                      <p className="text-sm text-gray-700 mt-0.5">
                        {r.cubre === elegidos.length
                          ? <>Incluye {elegidos.length === 1 ? 'tu sanatorio' : `tus ${elegidos.length} sanatorios`} desde <strong>{elPlan(p.planes[r.plan].label)}</strong></>
                          : <>Incluye {r.cubre} de tus {elegidos.length} con <strong>{elPlan(p.planes[r.plan].label)}</strong></>}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      {precio ? (
                        <>
                          <div className="text-xl font-black text-gray-900 tabular-nums">{formatPrecio(precio.valor)}</div>
                          <div className="text-[11px] text-gray-500">por mes{precio.plan !== p.planes[r.plan].label ? ` · ${precio.plan}` : ''}</div>
                        </>
                      ) : precios ? (
                        <div className="text-xs text-gray-500 max-w-[8rem]">Precio a confirmar por el asesor</div>
                      ) : (
                        <button type="button" onClick={() => setFormAbierto(true)} className="group text-right">
                          <span className="block text-xl font-black text-gray-300 blur-[5px] select-none" aria-hidden>$ 000.000</span>
                          <span className="block text-xs font-semibold text-[#E8002D] group-hover:underline">Ver precio para tu edad</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <ul className="mt-3 divide-y divide-gray-100 border-t border-gray-100">
                    {elegidos.map((s) => {
                      const [mi, mg] = s.c[r.slug] ?? [0, 0]
                      const enPlan = Boolean(mi & bit(r.plan))
                      const otroPlan = !enPlan && mi ? p.escalera.map((id) => p.planes.findIndex((x) => x.id === id)).find((i) => i >= 0 && mi & bit(i)) : undefined
                      return (
                        <li key={s.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                          <span className="text-gray-800 min-w-0 truncate">{s.n}</span>
                          <span className={`shrink-0 text-xs font-semibold ${enPlan ? 'text-green-700' : 'text-gray-500'}`}>
                            {enPlan
                              ? (mg & bit(r.plan) ? '✓ Internación y guardia' : '✓ Internación')
                              : otroPlan !== undefined ? `Desde ${p.planes[otroPlan].label.split(' (')[0]}` : '✗ No figura'}
                          </span>
                        </li>
                      )
                    })}
                  </ul>

                  <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
                    {r.otros.length > 0 ? (
                      <p className="text-xs text-gray-500">También en: {r.otros.map((i) => p.planes[i].label).join(', ')}</p>
                    ) : <span />}
                    <Link href={`/cartillas/${r.slug}`} className="text-xs font-semibold text-[#E8002D] hover:underline">Cartilla completa de {p.nombre} →</Link>
                  </div>
                </li>
              )
            })}
          </ul>

          {!precios && resultados.length > 0 && (
            <button type="button" onClick={() => setFormAbierto(true)}
              className="mt-6 w-full sm:w-auto px-8 py-4 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-2xl transition-colors">
              Ver los precios para mi edad →
            </button>
          )}

          <p className="text-xs text-gray-500 mt-6 leading-relaxed">
            Según las cartillas oficiales de internación de cada prepaga ({resultados.map((r) => `${ix.prepagas[r.slug].nombre}: ${ix.prepagas[r.slug].vigencia}`).join(' · ')}). Las cartillas cambian: el asesor lo confirma antes de que te asocies. Precios de lista para particulares, con IVA, del cuadro que cada prepaga declara ante la Superintendencia de Servicios de Salud.
          </p>
        </div>
      )}

      {formAbierto && (
        <FormularioLead
          titulo="Tu precio con estos sanatorios"
          bajada={`Te mostramos cuánto sale cada plan para tu grupo${region ? ` en ${region}` : ''} y te mandamos la cotización formal.`}
          textoBoton="Ver mis precios →"
          pedirEdades
          onCerrar={() => setFormAbierto(false)}
          onEnviar={enviar}
        />
      )}
    </div>
  )
}
