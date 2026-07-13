'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatPrecio } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import type { Plan } from '@/types'

interface PlanConExtras extends Plan {
  idealPara: string
  prepagaSlug: string
  prepagaNombre: string
}

interface ModalState {
  plan: PlanConExtras
  nombre: string
  celular: string
  email: string
  status: 'idle' | 'loading' | 'success' | 'error'
}

interface Props {
  planes: PlanConExtras[]
  prepagaNombre: string
}

export function PlanesSinPrecio({ planes, prepagaNombre }: Props): React.ReactElement {
  const [modal, setModal] = useState<ModalState | null>(null)

  const openModal = (plan: PlanConExtras) => {
    setModal({ plan, nombre: '', celular: '', email: '', status: 'idle' })
  }

  const closeModal = () => setModal(null)

  const handleSubmit = async () => {
    if (!modal) return
    const { nombre, celular, email, plan } = modal

    if (!nombre.trim() || !celular.trim() || !email.trim()) return

    setModal((m) => m ? { ...m, status: 'loading' } : m)

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          celular: celular.trim(),
          email: email.trim(),
          fuente: 'ver-precio-plan',
          prepaga: plan.prepagaNombre,
          plan: plan.nombre,
          planSlug: plan.slug,
          prepagaSlug: plan.prepagaSlug,
          precio: plan.precio,
        }),
      })
      if (res.ok) {
        setModal((m) => m ? { ...m, status: 'success' } : m)
      } else {
        setModal((m) => m ? { ...m, status: 'error' } : m)
      }
    } catch {
      setModal((m) => m ? { ...m, status: 'error' } : m)
    }
  }

  const formOk = modal
    ? modal.nombre.trim().length >= 2 && modal.celular.trim().length >= 8 && modal.email.includes('@')
    : false

  return (
    <>
      {/* Grilla de planes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {planes.map((plan) => (
          <div
            key={plan.slug}
            className={`bg-white rounded-2xl border p-6 relative transition-all flex flex-col ${
              plan.destacado
                ? 'border-[#E8002D] shadow-md shadow-red-100'
                : 'border-gray-200 hover:border-red-200 hover:shadow-sm'
            }`}
          >
            {plan.destacado && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-[#E8002D] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  Más elegido
                </span>
              </div>
            )}

            <h3 className="font-bold text-lg text-gray-900 mb-2">{plan.nombre}</h3>

            {/* Ideal para */}
            {plan.idealPara && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 mb-4">
                <p className="text-xs font-semibold text-[#E8002D] mb-0.5">Ideal para</p>
                <p className="text-xs text-red-800 leading-relaxed">{plan.idealPara}</p>
              </div>
            )}

            <p className="text-sm text-gray-600 mb-4">{plan.descripcion}</p>

            <ul className="space-y-2 mb-5 flex-1">
              {plan.cobertura.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex gap-2 mb-4">
              <Badge variant={plan.redAbierta ? 'green' : 'gray'}>
                Red {plan.redAbierta ? 'abierta' : 'cerrada'}
              </Badge>
              <Badge variant={plan.copago ? 'gray' : 'green'}>
                {plan.copago ? 'Con copago' : 'Sin copago'}
              </Badge>
            </div>

            <div className="flex flex-col gap-2">
              {/* Ver precio — dispara modal */}
              <button
                onClick={() => openModal(plan)}
                className="w-full py-2.5 rounded-xl text-sm font-bold bg-[#00875A] hover:bg-[#006644] text-white transition-colors"
              >
                Ver precio
              </button>
              <Link
                href={`/prepagas/${plan.prepagaSlug}/${plan.slug}`}
                className="block w-full text-center py-2 rounded-xl text-xs font-medium text-[#E8002D] hover:underline"
              >
                Ver detalles →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] px-6 py-5 text-white">
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs text-red-200 font-medium">{prepagaNombre}</div>
                <button onClick={closeModal} className="text-white/70 hover:text-white transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-5 h-5">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <div className="font-bold text-xl">{modal.plan.nombre}</div>
              {modal.plan.idealPara && (
                <p className="text-red-200 text-xs mt-1 leading-relaxed">{modal.plan.idealPara}</p>
              )}
            </div>

            <div className="p-6">
              {modal.status === 'success' ? (
                /* Precio revelado */
                <div className="text-center py-4">
                  <div className="text-xs text-gray-400 mb-1">Precio estimado · 30 años · contratación individual</div>
                  <div className="text-4xl font-black text-[#E8002D] mb-1">{formatPrecio(modal.plan.precio)}</div>
                  <div className="text-sm text-gray-500 mb-4">/mes · Directo con IVA</div>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 text-xs text-amber-700 mb-5">
                    El precio final varía según tu edad. Un asesor te enviará la cotización exacta en breve.
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/prepagas/${modal.plan.prepagaSlug}/${modal.plan.slug}`}
                      className="block w-full py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm text-center transition-colors"
                    >
                      Ver detalles del plan →
                    </Link>
                    <button
                      onClick={closeModal}
                      className="text-xs text-gray-400 hover:text-gray-600 py-1"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              ) : (
                /* Formulario */
                <>
                  <p className="text-sm text-gray-600 mb-5">
                    Dejá tus datos y te mostramos el precio real para tu edad, más un asesor te contacta para ayudarte.
                  </p>

                  <div className="space-y-3 mb-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre *</label>
                      <input
                        type="text"
                        value={modal.nombre}
                        onChange={(e) => setModal((m) => m ? { ...m, nombre: e.target.value } : m)}
                        placeholder="Tu nombre"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8002D] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Celular *</label>
                      <input
                        type="tel"
                        value={modal.celular}
                        onChange={(e) => setModal((m) => m ? { ...m, celular: e.target.value } : m)}
                        placeholder="11 2345-6789"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8002D] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={modal.email}
                        onChange={(e) => setModal((m) => m ? { ...m, email: e.target.value } : m)}
                        placeholder="tu@email.com"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8002D] transition-colors"
                      />
                    </div>
                  </div>

                  {modal.status === 'error' && (
                    <p className="text-red-500 text-xs mb-3 text-center">Algo salió mal. Intentá de nuevo.</p>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={!formOk || modal.status === 'loading'}
                    className="w-full py-3.5 bg-[#00875A] hover:bg-[#006644] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-colors"
                  >
                    {modal.status === 'loading' ? 'Enviando...' : 'Ver precio →'}
                  </button>

                  <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className="w-3 h-3">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                    Tu información es privada · Sin compromiso
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
