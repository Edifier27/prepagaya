'use client'

import { useEffect } from 'react'
import { track } from '@vercel/analytics'

// Prueba 50/50 del cotizador: cuenta la visita del grupo "a" (el actual). El
// grupo "b" la cuenta en CotizadorV2.
export function VistoAB() {
  useEffect(() => { track('Cotizador visto', { version: 'a' }) }, [])
  return null
}
