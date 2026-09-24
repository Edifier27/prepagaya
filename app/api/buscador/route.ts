import { NextResponse } from 'next/server'
import { indiceBuscador, GRUPOS_BUSCADOR } from '@/lib/buscador/indice'

// Índice del buscador del sitio (components/layout/Buscador.tsx). Estático:
// se genera en el build y el navegador lo baja al abrir el buscador.
export const dynamic = 'force-static'

export async function GET() {
  return NextResponse.json({ grupos: GRUPOS_BUSCADOR, entradas: indiceBuscador() })
}
