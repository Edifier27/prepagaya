import { NextResponse } from 'next/server'
import { CARTILLAS, zonasPorProvincia } from '@/lib/data/cartilla-zonas'

// Índice de zonas de la cartilla de una prepaga (con sus localidades) para el
// recuadro "Qué tenés con este plan en tu zona" de las páginas de plan
// (components/cartillas/CartillaPlanTuZona.tsx). Estático: una respuesta por
// prepaga generada en el build, así no se embebe en el HTML de cada plan.
export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return Object.keys(CARTILLAS).map((prepaga) => ({ prepaga }))
}

export async function GET(_req: Request, { params }: { params: Promise<{ prepaga: string }> }) {
  const { prepaga } = await params
  return NextResponse.json(zonasPorProvincia(prepaga))
}
