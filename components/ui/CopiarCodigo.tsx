'use client'

import { useState } from 'react'

// Clarity (2 al 9-nov-2026): en /derivar-aportes/swiss-medical 6 de 11 sesiones tocaron el recuadro
// del código y no pasaba nada. Ahora lo copia, para pegarlo en la opción de cambio.
export function CopiarCodigo({ codigo }: { codigo: string }) {
  const [copiado, setCopiado] = useState(false)
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard?.writeText(codigo).then(() => { setCopiado(true); setTimeout(() => setCopiado(false), 1800) }).catch(() => {})}
      className="group text-left"
      aria-label={`Copiar el código ${codigo}`}
    >
      <span className="text-3xl font-black text-gray-900 tabular-nums mt-1 block">{codigo}</span>
      <span className="text-xs font-semibold text-[#E8002D] group-hover:underline">{copiado ? '¡Copiado!' : 'Tocá para copiar'}</span>
    </button>
  )
}
