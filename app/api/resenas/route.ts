import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { guardarResena, resenasRecientesDeIp } from '@/lib/db'
import { prepagas } from '@/lib/data/prepagas'
import { avisarLeadPorTelegram } from '@/lib/telegram'
import { avisarLeadPorPush } from '@/lib/push'

// Reseñas de usuarios (23-sep-2026). Entran como "pendiente" y solo se
// publican cuando se aprueban en el panel. Anti-spam: campo trampa (web),
// máximo 3 por IP cada 24 hs, sin links, largo mínimo. La IP se guarda solo
// como hash.
const SAL = process.env.RESENAS_SAL ?? 'prepagaya-resenas'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })

  // Campo trampa: los bots lo completan, las personas no lo ven
  if (String(body.web ?? '').trim()) return NextResponse.json({ ok: true })

  const prepagaSlug = String(body.prepaga ?? '').trim()
  const prep = prepagas.find((p) => p.slug === prepagaSlug)
  const planNombre = String(body.plan ?? '').trim().slice(0, 60)
  const nombre = String(body.nombre ?? '').trim().slice(0, 40)
  const ciudad = String(body.ciudad ?? '').trim().slice(0, 40)
  const rating = Number(body.rating)
  const texto = String(body.texto ?? '').trim()

  if (!prep) return NextResponse.json({ error: 'Prepaga inválida' }, { status: 400 })
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return NextResponse.json({ error: 'Elegí de 1 a 5 estrellas' }, { status: 400 })
  if (nombre.length < 2) return NextResponse.json({ error: 'Poné tu nombre' }, { status: 400 })
  if (texto.length < 20 || texto.length > 1200) return NextResponse.json({ error: 'El comentario tiene que tener entre 20 y 1200 caracteres' }, { status: 400 })
  if (/https?:\/\/|www\./i.test(texto)) return NextResponse.json({ error: 'El comentario no puede tener links' }, { status: 400 })
  if (planNombre && !prep.planes.some((pl) => pl.nombre === planNombre)) return NextResponse.json({ error: 'Plan inválido' }, { status: 400 })

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'sin-ip'
  const ipHash = createHash('sha256').update(SAL + ip).digest('hex')
  if ((await resenasRecientesDeIp(ipHash)) >= 3) {
    return NextResponse.json({ error: 'Ya recibimos varias opiniones desde tu conexión hoy. Probá mañana.' }, { status: 429 })
  }

  await guardarResena({ prepagaSlug, planNombre, nombre, ciudad, rating, texto, ipHash })
  await Promise.allSettled([
    avisarLeadPorTelegram(`⭐ Nueva reseña para aprobar\n${prep.nombre}${planNombre ? ` · ${planNombre}` : ''} · ${rating}/5\n${nombre}: ${texto.slice(0, 300)}\n\nAprobala en el panel → Reseñas`),
    avisarLeadPorPush('PrepagaYa — Reseña para aprobar', `${prep.nombre} · ${rating}★ · ${nombre}`),
  ])
  return NextResponse.json({ ok: true })
}
