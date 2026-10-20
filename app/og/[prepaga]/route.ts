import { prepagas } from '@/lib/data/prepagas'
import { imagenPrepaga } from '@/lib/og/tarjeta'

// Imagen de la ficha /prepagas/[prepaga] (ver lib/og/tarjeta.tsx)
export const dynamicParams = false

export function generateStaticParams() {
  return prepagas.map((p) => ({ prepaga: p.slug }))
}

export async function GET(_req: Request, { params }: { params: Promise<{ prepaga: string }> }) {
  const { prepaga } = await params
  return imagenPrepaga(prepaga) ?? new Response('No encontrado', { status: 404 })
}
