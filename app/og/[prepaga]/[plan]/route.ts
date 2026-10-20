import { prepagas } from '@/lib/data/prepagas'
import { imagenPlan } from '@/lib/og/tarjeta'

// Imagen de cada plan /prepagas/[prepaga]/[plan] (ver lib/og/tarjeta.tsx)
export const dynamicParams = false

export function generateStaticParams() {
  return prepagas.flatMap((p) => p.planes.map((pl) => ({ prepaga: p.slug, plan: pl.slug })))
}

export async function GET(_req: Request, { params }: { params: Promise<{ prepaga: string; plan: string }> }) {
  const { prepaga, plan } = await params
  return imagenPlan(prepaga, plan) ?? new Response('No encontrado', { status: 404 })
}
