'use client'

import { useActionState } from 'react'
import { login, type LoginState } from './actions'

export default function LoginForm({ sinPassword }: { sinPassword: boolean }) {
  const [state, formAction, pending] = useActionState<LoginState | null, FormData>(login, null)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="w-10 h-10 rounded-xl bg-[#E8002D] text-white flex items-center justify-center font-black text-lg mb-4">P</div>
        <h1 className="text-lg font-bold text-gray-900 mb-1">Panel de Leads</h1>
        <p className="text-sm text-gray-500 mb-5">Acceso interno — PrepagaYa</p>

        {sinPassword ? (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
            Falta configurar <code className="font-mono text-xs">PANEL_PASSWORD</code> en el servidor.
          </p>
        ) : (
          <form action={formAction} className="space-y-3">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              autoFocus
              required
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8002D] transition-colors"
            />
            {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-[#E8002D] hover:bg-[#c8001f] disabled:opacity-60 text-white font-bold text-sm rounded-xl px-4 py-3 transition-colors"
            >
              {pending ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
