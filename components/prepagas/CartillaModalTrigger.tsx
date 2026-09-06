'use client'

import { useEffect, useState } from 'react'
import { CartillaModal } from '@/components/comparador/CartillaModal'
import { ZonaPickerModal } from '@/components/prepagas/ZonaPickerModal'
import type { Provincia } from '@/components/comparador/ComparadorWizard'
import type { Plan, Prepaga } from '@/types'

const ZONA_STORAGE_KEY = 'prepagaya_zona'

function leerZonaGuardada(): Provincia | null {
  try {
    const raw = localStorage.getItem(ZONA_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Provincia) : null
  } catch {
    return null
  }
}

function guardarZona(p: Provincia) {
  try {
    localStorage.setItem(ZONA_STORAGE_KEY, JSON.stringify(p))
  } catch {}
}

interface Props {
  prepaga: Prepaga
  plan: Plan
  /** Cuando se sabe la zona de antemano (ej. viene de una página de provincia). Si no se pasa, se usa la última guardada o se le pregunta al visitante. */
  zonaKey?: string
  provinciaNombre?: string
  className?: string
  /** Abre el modal solo al montar (llegada desde el link "Ver más" de un listado, vía ?cartilla=1). No se activa en visitas directas/orgánicas para no mostrar un interstitial. */
  autoOpen?: boolean
}

// Wrapper con estado propio para reutilizar CartillaModal (ya construido y
// probado dentro del comparador) también en las páginas estáticas de SEO,
// donde no hay un componente padre manejando el open/close del modal.
// Cuando no se conoce la zona del visitante, pregunta una vez (con el mismo
// selector del comparador) y la guarda para no volver a preguntar.
export function CartillaModalTrigger({ prepaga, plan, zonaKey, provinciaNombre, className, autoOpen }: Props) {
  const [zona, setZona] = useState<Provincia | null>(
    zonaKey && provinciaNombre ? { slug: '', nombre: provinciaNombre, zonaKey } : null
  )
  const [open, setOpen] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)

  useEffect(() => {
    if (zona) return
    const guardada = leerZonaGuardada()
    if (guardada) setZona(guardada)
  }, [zona])

  function abrirCartilla() {
    if (zona) {
      setOpen(true)
      return
    }
    const guardada = leerZonaGuardada()
    if (guardada) {
      setZona(guardada)
      setOpen(true)
      return
    }
    setPickerOpen(true)
  }

  useEffect(() => {
    if (autoOpen) abrirCartilla()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpen])

  function handleZonaSeleccionada(p: Provincia) {
    guardarZona(p)
    setZona(p)
    setPickerOpen(false)
    setOpen(true)
  }

  return (
    <>
      <button
        onClick={abrirCartilla}
        className={className ?? 'inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#E8002D] border-2 border-gray-200 hover:border-red-200 rounded-lg px-3 py-2 transition-colors'}
      >
        Ver cartilla
      </button>
      {pickerOpen && (
        <ZonaPickerModal onSelect={handleZonaSeleccionada} onClose={() => setPickerOpen(false)} />
      )}
      {open && zona && (
        <CartillaModal
          prepaga={prepaga}
          plan={plan}
          zonaKey={zona.zonaKey}
          provinciaNombre={zona.nombre}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
