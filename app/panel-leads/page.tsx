import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { COOKIE_SESION, sesionValida, passwordConfigurada } from '@/lib/panel-auth'
import { listarLeads } from '@/lib/db'
import LoginForm from './LoginForm'
import PanelLeads from './PanelLeads'

// Página interna, nunca indexada — reforzado también en robots.ts.
export const metadata: Metadata = {
  title: 'Panel de Leads — PrepagaYa',
  robots: { index: false, follow: false },
  manifest: '/panel-manifest.json',
}

// Siempre dinámica: lee la cookie de sesión y consulta la base en cada
// visita, nunca cachear una página que decide "mostrar los leads o no" según
// quién la pide.
export const dynamic = 'force-dynamic'

export default async function PanelLeadsPage() {
  const store = await cookies()
  const autenticado = sesionValida(store.get(COOKIE_SESION)?.value)

  if (!autenticado) {
    return <LoginForm sinPassword={!passwordConfigurada()} />
  }

  const leads = await listarLeads()
  return <PanelLeads leadsIniciales={leads} />
}
