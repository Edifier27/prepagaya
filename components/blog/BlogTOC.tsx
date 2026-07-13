'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export interface TOCSection {
  id: string
  titulo: string
  isConclusion?: boolean
}

interface Props {
  sections: TOCSection[]
}

export function BlogTOC({ sections }: Props) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-8% 0px -80% 0px', threshold: 0 }
    )

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    const onScroll = () => {
      const doc = document.documentElement
      const scrolled = doc.scrollTop || document.body.scrollTop
      const total = doc.scrollHeight - doc.clientHeight
      setProgress(total > 0 ? Math.min(100, Math.round((scrolled / total) * 100)) : 0)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [sections])

  return (
    <aside className="sticky top-24 self-start space-y-3">

      {/* TOC principal */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Header + progreso */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              En este artículo
            </span>
            <span className="text-xs font-bold text-[#E8002D]">{progress}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E8002D] to-[#B8001F] rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Secciones */}
        <nav className="p-3">
          {sections.map((section, i) => {
            const isActive = activeId === section.id
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className={`flex items-start gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${
                  isActive
                    ? 'bg-red-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                {/* Número / check */}
                <span className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold mt-0.5 transition-all ${
                  isActive
                    ? 'border-[#E8002D] bg-[#E8002D] text-white'
                    : 'border-gray-200 text-gray-400 group-hover:border-gray-300'
                }`}>
                  {section.isConclusion ? '✓' : i + 1}
                </span>

                {/* Texto */}
                <span className={`leading-snug transition-colors ${
                  isActive
                    ? 'text-[#E8002D] font-semibold'
                    : 'text-gray-500 group-hover:text-gray-800 font-medium'
                }`}>
                  {section.titulo}
                </span>
              </a>
            )
          })}
        </nav>

        {/* Links rápidos */}
        <div className="mx-3 mb-3 p-3 bg-gray-50 rounded-xl space-y-2">
          <Link
            href="/glosario"
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#E8002D] transition-colors font-medium group"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5 flex-shrink-0 group-hover:stroke-[#E8002D]">
              <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Glosario de prepagas
          </Link>
          <Link
            href="/comparador"
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#E8002D] transition-colors font-medium group"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5 flex-shrink-0 group-hover:stroke-[#E8002D]">
              <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Comparar planes
          </Link>
          <Link
            href="/precios"
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#E8002D] transition-colors font-medium group"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5 flex-shrink-0 group-hover:stroke-[#E8002D]">
              <path d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Ver precios actualizados
          </Link>
        </div>
      </div>

      {/* Mini CTA */}
      <div className="bg-gradient-to-br from-[#E8002D] to-[#8B0000] rounded-2xl p-4 text-white">
        <p className="text-xs font-bold mb-1">¿Te quedó alguna duda?</p>
        <p className="text-[11px] text-red-200 mb-3 leading-relaxed">Un asesor te explica todo sin costo y sin compromiso.</p>
        <Link
          href="/comparador"
          className="block text-center text-xs font-bold bg-white text-[#E8002D] rounded-xl py-2 hover:bg-red-50 transition-colors"
        >
          Cotizar gratis →
        </Link>
      </div>

    </aside>
  )
}
