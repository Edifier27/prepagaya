import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { sesionValidaEnRequest } from '@/lib/panel-auth'
import { listarResenas, moderarResena, type EstadoResena } from '@/lib/db'

// Moderación de reseñas desde el panel (23-sep-2026).
//   GET  ?estado=pendiente|aprobada|rechazada → lista
//   POST { id, estado: 'aprobada' | 'rechazada' | 'pendiente' } → modera y
//        regenera la ficha de esa prepaga para que la reseña aparezca (o se
//        vaya) enseguida, sin esperar la revalidación por tiempo.
const ESTADOS: EstadoResena[] = ['pendiente', 'aprobada', 'rechazada']

export async function GET(req: NextRequest) {
  if (!sesionValidaEnRequest(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const estado = req.nextUrl.searchParams.get('estado') as EstadoResena | null
  const resenas = await listarResenas(estado && ESTADOS.includes(estado) ? estado : undefined)
  return NextResponse.json({ resenas })
}

export async function POST(req: NextRequest) {
  if (!sesionValidaEnRequest(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const body = await req.json().catch(() => null)
  const id = Number(body?.id)
  const estado = body?.estado as EstadoResena
  if (!id || !ESTADOS.includes(estado)) return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  const prepagaSlug = await moderarResena(id, estado)
  if (prepagaSlug) revalidatePath(`/prepagas/${prepagaSlug}`)
  return NextResponse.json({ ok: true })
}
