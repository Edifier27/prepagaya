import { NextResponse } from 'next/server'
import { indiceNombres } from '@/lib/data/cartilla-zonas/indice-nombres'

// Índice de sanatorios de internación de todas las cartillas por zona, para el
// buscador por nombre. Estático: se genera en el build.
export const dynamic = 'force-static'

export async function GET() {
  return NextResponse.json(indiceNombres())
}
