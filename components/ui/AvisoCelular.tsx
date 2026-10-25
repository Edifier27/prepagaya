'use client'

import { useCallback, useState } from 'react'
import { revisarCelular } from '@/lib/celular-cliente'

/** Revisión del celular con los bloques de ENACOM antes de enviar un lead
 *  (lib/celular-cliente.ts). `revisar` devuelve false si hay que avisar. */
export function useAvisoCelular() {
  const [aviso, setAviso] = useState('')
  const revisar = useCallback(async (celular: string) => {
    const texto = await revisarCelular(celular)
    setAviso(texto ?? '')
    return !texto
  }, [])
  const limpiar = useCallback(() => setAviso(''), [])
  return { aviso, revisar, limpiar }
}

export function AvisoCelular({ texto }: { texto: string }) {
  if (!texto) return null
  return <p role="alert" className="mt-1 text-xs font-semibold text-[#E8002D]">{texto}</p>
}
