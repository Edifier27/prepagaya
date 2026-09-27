'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'

// Término del glosario dentro de un texto (28-sep-2026, Darío: "un glosario
// para facilitar la navegación en temas pesados"). Subrayado punteado; al
// tocarlo muestra la definición sin salir de la página: en el celular como
// hoja abajo de la pantalla, en la computadora como tarjeta debajo de la
// palabra. Se cierra con Escape, tocando afuera o con la X.

export function TerminoGlosario({ slug, termino, definicion, children }: { slug: string; termino: string; definicion: string; children: ReactNode }) {
  const [abierto, setAbierto] = useState(false)
  const caja = useRef<HTMLSpanElement>(null)
  const id = useId()

  useEffect(() => {
    if (!abierto) return
    const alTocarAfuera = (e: MouseEvent | TouchEvent) => {
      if (caja.current && !caja.current.contains(e.target as Node)) setAbierto(false)
    }
    const alTeclear = (e: KeyboardEvent) => { if (e.key === 'Escape') setAbierto(false) }
    document.addEventListener('mousedown', alTocarAfuera)
    document.addEventListener('touchstart', alTocarAfuera)
    document.addEventListener('keydown', alTeclear)
    return () => {
      document.removeEventListener('mousedown', alTocarAfuera)
      document.removeEventListener('touchstart', alTocarAfuera)
      document.removeEventListener('keydown', alTeclear)
    }
  }, [abierto])

  return (
    <span ref={caja} className="relative inline">
      <button type="button" onClick={() => setAbierto((a) => !a)} aria-expanded={abierto} aria-controls={id}
        className="inline cursor-help border-b-2 border-dotted border-[#E8002D]/60 text-inherit hover:border-[#E8002D] hover:text-[#E8002D] focus-visible:outline-2 focus-visible:outline-[#E8002D]">
        {children}
      </button>
      {abierto && (
        <span id={id} role="dialog" aria-label={termino}
          className="fixed inset-x-3 bottom-20 z-[60] block rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-2xl lg:absolute lg:inset-auto lg:bottom-auto lg:left-0 lg:top-full lg:mt-2 lg:w-80">
          <span className="flex items-start justify-between gap-3">
            <span className="block text-sm font-bold text-gray-900">{termino}</span>
            <button type="button" onClick={() => setAbierto(false)} aria-label="Cerrar" className="-mr-1 -mt-1 rounded-lg px-1.5 text-gray-400 hover:text-gray-700">✕</button>
          </span>
          <span className="mt-1 block text-sm font-normal leading-relaxed text-gray-700">{definicion}</span>
          <Link href={`/glosario#${slug}`} className="mt-2 inline-block text-xs font-semibold text-[#E8002D] hover:underline">Ver en el glosario →</Link>
        </span>
      )}
    </span>
  )
}
