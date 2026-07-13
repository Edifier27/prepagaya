'use client'

import { useState, useEffect } from 'react'
import { LeadFormInline } from './LeadFormInline'

interface Props {
  prepagaNombre?: string
}

export function LeadFormPopup({ prepagaNombre }: Props) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (dismissed) return

    const timer = setTimeout(() => {
      setVisible(true)
    }, 25000)

    function handleScroll() {
      if (dismissed) return
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      if (scrolled > 0.55) {
        setVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [dismissed])

  function dismiss() {
    setVisible(false)
    setDismissed(true)
  }

  if (!visible || dismissed) return null

  return (
    <>
      {/* Backdrop on mobile */}
      <div
        className="fixed inset-0 bg-black/30 z-40 md:hidden"
        onClick={dismiss}
      />

      {/* Slide-up panel */}
      <div className="fixed bottom-0 left-0 right-0 md:bottom-6 md:right-6 md:left-auto md:w-80 z-50 animate-slide-up">
        <div className="relative">
          <button
            onClick={dismiss}
            className="absolute -top-3 right-3 w-7 h-7 bg-gray-700 text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors z-10 text-sm font-bold shadow"
            aria-label="Cerrar"
          >
            ✕
          </button>
          <LeadFormInline
            prepagaNombre={prepagaNombre}
            titulo={prepagaNombre ? `¿Querés cotizar ${prepagaNombre}?` : '¿Necesitás asesoramiento?'}
            className="rounded-b-none md:rounded-2xl shadow-2xl"
          />
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </>
  )
}
