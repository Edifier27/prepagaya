'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { COOKIE_SESION, crearValorCookie, verificarPassword } from '@/lib/panel-auth'

export interface LoginState {
  error: string
}

export async function login(_prevState: LoginState | null, formData: FormData): Promise<LoginState | null> {
  const password = String(formData.get('password') ?? '')

  if (!verificarPassword(password)) {
    return { error: 'Contraseña incorrecta.' }
  }

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
