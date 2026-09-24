import { NextResponse } from 'next/server'
import { indiceCobertura } from '@/lib/data/cartilla-zonas/indice-cobertura'

// Índice de cobertura por sanatorio para /buscar-por-sanatorio. Estático: se
// genera en el build y el cliente lo baja recién cuando la persona empieza a
// buscar (~50 KB comprimido).
export const dynamic = 'force-static'

export async function GET() {
  return NextResponse.json(indiceCobertura())
}
