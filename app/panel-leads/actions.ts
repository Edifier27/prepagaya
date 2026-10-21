'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { COOKIE_SESION, crearValorCookie, verificarPassword } from '@/lib/panel-auth'

export interface LoginState {
  error: string
}

// Límite de intentos (21-oct-2026): 5 fallidos por IP cada 15 minutos, y
// cada fallo tarda 1 segundo en responder. Vive en la memoria de la función,
// así que es por instancia: frena a quien prueba a mano o con un script
// simple. El freno fuerte es la regla del firewall de Vercel para POST
// /panel-leads (ver docs/producto/seguridad.md).
const VENTANA_MS = 15 * 60_000
const MAX_FALLOS = 5
const fallos = new Map<string, { n: number; desde: number }>()

function ipDe(h: Headers): string {
  return (h.get('x-forwarded-for') ?? '').split(',')[0].trim() || h.get('x-real-ip') || 'sin-ip'
}

function bloqueada(ip: string): boolean {
  const f = fallos.get(ip)
  if (!f) return false
  if (Date.now() - f.desde > VENTANA_MS) { fallos.delete(ip); return false }
  return f.n >= MAX_FALLOS
}

function anotarFallo(ip: string) {
  const f = fallos.get(ip)
  if (!f || Date.now() - f.desde > VENTANA_MS) fallos.set(ip, { n: 1, desde: Date.now() })
  else f.n++
  // Que el mapa no crezca sin fin si alguien rota IPs
  if (fallos.size > 5000) fallos.clear()
}

export async function login(_prevState: LoginState | null, formData: FormData): Promise<LoginState | null> {
  const password = String(formData.get('password') ?? '')
  const ip = ipDe(await headers())

  if (bloqueada(ip)) {
    return { error: 'Demasiados intentos. Probá de nuevo en 15 minutos.' }
  }
  if (!verificarPassword(password)) {
    anotarFallo(ip)
    await new Promise((r) => setTimeout(r, 1000))
    return { error: 'Contraseña incorrecta.' }
  }
  fallos.delete(ip)

  const { valor, maxAgeSegundos } = crearValorCookie()
  const store = await cookies()
  store.set(COOKIE_SESION, valor, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeSegundos,
  })

  redirect('/panel-leads')
}

export async function logout(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE_SESION)
  redirect('/panel-leads')
}
