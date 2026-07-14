'use client'

import { useEffect, useState } from 'react'

interface Item {
  id: string
  label: string
}

// Submenú fijo con las secciones del artículo: aparece debajo del header al
// scrollear hacia abajo (pasado el índice inline) y se oculta al subir.
export function StickySectionNav({ items }: { items: Item[] }) {
  const [visible, setVisible] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const bajando = y > lastY
      lastY = y
      setVisible(bajando && y > 350)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveId(e.target.id)
        }
      },
      // Franja bajo el header + submenú: la sección que la cruza es la activa
      { rootMargin: '-120px 0px -70% 0px' }
    )
    for (const item of items) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [items])

  return (
    <div
      className={`fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-[130%]'
      }`}
      aria-hidden={!visible}
    >
      <div className="container">
        <nav className="flex gap-2 overflow-x-auto py-2.5" style={{ scrollbarWidth: 'none' }}>
          {items.map((item, i) => {
            const active = activeId === item.id
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                tabIndex={visible ? 0 : -1}
                className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  active
                    ? 'bg-[#E8002D] text-white border-[#E8002D]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-red-200 hover:text-[#E8002D]'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                  active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {i + 1}
                </span>
                <span className="whitespace-nowrap">{item.label}</span>
              </a>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
