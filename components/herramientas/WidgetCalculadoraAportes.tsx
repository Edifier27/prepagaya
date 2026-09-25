'use client'

import { useEffect, useRef, useState } from 'react'
import { PROVINCIAS } from '@/lib/data/provincias-cotizador'
import { preciosDelGrupo } from '@/lib/leads-cliente'
import { APORTE_DERIVABLE, SITE_NAME, SITE_URL, formatPrecio } from '@/lib/utils'
import type { PrepagaCotizable } from '@/lib/data/planes-cotizables'

// Versión para insertar de la calculadora de aportes (25-sep-2026), para
// estudios contables, blogs de RRHH y medios: sueldo, edad y provincia →
// cuánto llega a la prepaga y cuántos planes cubre sin diferencia. El detalle
// plan por plan y la cotización quedan en /calculadora-aportes (link con la
// marca, que abre fuera del iframe).

const numero = (s: string) => parseInt(s.replace(/\D/g, ''), 10) || 0
const miles = (n: number) => (n ? n.toLocaleString('es-AR') : '')

interface Resultado { cubiertos: number; total: number; minima: { nombre: string; diferencia: number } | null }

export function WidgetCalculadoraAportes({ prepagas, mes }: { prepagas: PrepagaCotizable[]; mes: string }) {
  const [sueldo, setSueldo] = useState('')
  const [edad, setEdad] = useState('')
  const [provincia, setProvincia] = useState('caba')
  const [cargando, setCargando] = useState(false)
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const aporte = Math.round(numero(sueldo) * APORTE_DERIVABLE)
  const edadNum = parseInt(edad, 10)
  const completo = aporte > 0 && Number.isInteger(edadNum) && edadNum >= 18 && edadNum <= 99

  async function calcular(e: React.FormEvent) {
    e.preventDefault()
    const prov = PROVINCIAS.find((p) => p.slug === provincia)
    if (!completo || !prov) return
    setCargando(true)
    const precios = await preciosDelGrupo(prov.zonaKey, [edadNum], 'desregulado')
    const filas = prepagas.flatMap((p) => p.planes
      .filter((pl) => (pl.edadMinima === undefined || edadNum >= pl.edadMinima) && (pl.edadMaxima === undefined || edadNum <= pl.edadMaxima))
      .map((pl) => ({ nombre: `${p.nombre} ${pl.nombre.replace(/^Plan /, '')}`, valor: precios[`${p.slug}/${pl.slug}`] ?? 0 })))
      .filter((f) => f.valor > 0)
    const conDiferencia = filas.map((f) => ({ ...f, diferencia: Math.max(0, f.valor - aporte) }))
    const pagando = conDiferencia.filter((f) => f.diferencia > 0).sort((a, b) => a.diferencia - b.diferencia)
    setResultado({
      cubiertos: conDiferencia.length - pagando.length,
      total: conDiferencia.length,
      minima: pagando[0] ? { nombre: pagando[0].nombre, diferencia: pagando[0].diferencia } : null,
    })
    setCargando(false)
  }

  const cambiar = (set: (v: string) => void) => (v: string) => { set(v); setResultado(null) }

  // Dentro de un iframe, avisa su alto a la página que lo inserta: el código
  // de /calculadora-aportes trae un script que ajusta el iframe (si el sitio
  // no permite scripts, queda el alto fijo del código).
  const raiz = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = raiz.current
    if (!el || window.parent === window) return
    const avisar = () => window.parent.postMessage({ prepagayaAlto: Math.ceil(el.getBoundingClientRect().height) }, '*')
    const ro = new ResizeObserver(avisar)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={raiz} className="bg-white p-4 sm:p-5 font-sans text-gray-900">
      <p className="text-[11px] font-bold uppercase tracking-wide text-[#E8002D]">Calculadora de aportes · precios oficiales</p>
      <h1 className="text-lg font-bold leading-snug mt-1">¿Cuánto te cubren tus aportes en una prepaga?</h1>
      <form onSubmit={calcular} className="mt-3 grid grid-cols-[0.6fr_1fr] gap-2 sm:grid-cols-[1.4fr_0.6fr_1fr_auto] sm:items-end">
        <label className="col-span-2 block sm:col-span-1">
          <span className="text-xs font-semibold text-gray-600">Sueldo bruto mensual</span>
          <input id="w-sueldo" inputMode="numeric" value={miles(numero(sueldo))} onChange={(e) => cambiar(setSueldo)(e.target.value)} placeholder="$ 1.500.000"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm tabular-nums" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-gray-600">Edad</span>
          <input id="w-edad" inputMode="numeric" value={edad} onChange={(e) => cambiar(setEdad)(e.target.value.replace(/\D/g, '').slice(0, 2))} placeholder="35"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm tabular-nums" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-gray-600">Provincia</span>
          <select id="w-provincia" value={provincia} onChange={(e) => cambiar(setProvincia)(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm">
            {PROVINCIAS.map((p) => <option key={p.slug} value={p.slug}>{p.nombre}</option>)}
          </select>
        </label>
        <button type="submit" disabled={!completo || cargando} className="col-span-2 sm:col-span-1 rounded-lg bg-[#E8002D] px-4 py-2 text-sm font-bold text-white hover:bg-[#B8001F] disabled:opacity-50">
          {cargando ? 'Calculando…' : 'Calcular'}
        </button>
      </form>

      <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm" aria-live="polite">
        {aporte > 0 ? (
          <p>Llegan a la prepaga <strong className="tabular-nums">{formatPrecio(aporte)}</strong> por mes de tus aportes.</p>
        ) : (
          <p className="text-gray-600">Poné tu sueldo bruto: te decimos cuánto de tu aporte llega a la prepaga y cuántos planes te cubre.</p>
        )}
        {resultado && (
          resultado.total === 0 ? (
            <p className="mt-1 text-gray-600">No hay precios oficiales con aportes para esa provincia y edad.</p>
          ) : (
            <p className="mt-1">
              Te cubren <strong>{resultado.cubiertos} de {resultado.total}</strong> planes sin pagar diferencia.
              {resultado.minima && <> {resultado.cubiertos ? 'En el resto, la' : 'La'} diferencia más baja es {formatPrecio(resultado.minima.diferencia)} ({resultado.minima.nombre}).</>}
            </p>
          )
        )}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-gray-500">
        Aporte: {(APORTE_DERIVABLE * 100).toLocaleString('es-AR')}% del bruto (9% de obra social menos el Fondo Solidario). Precios oficiales con aportes (SSSalud), {mes}.{' '}
        <a href={`${SITE_URL}/calculadora-aportes`} target="_blank" rel="noopener" className="font-semibold text-[#E8002D] hover:underline">
          Ver plan por plan en {SITE_NAME} →
        </a>
      </p>
    </div>
  )
}
