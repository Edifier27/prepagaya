'use client'

import { useState } from 'react'
import Link from 'next/link'

const NAV = [
  { href: '/empresas/swiss-medical', label: 'Swiss Medical' },
  { href: '/empresas/osde', label: 'OSDE' },
  { href: '/empresas/ranking', label: 'Ranking' },
  { href: '/empresas/como-cotizar', label: 'Cómo cotizar' },
  { href: '/empresas/beneficios-impositivos', label: 'Impositivo' },
]

// Header propio del silo /empresas: intencionalmente oscuro y sin rojo, para
// que quien llega desde un link corporativo (RRHH, gerencia) perciba de
// entrada que está en un canal distinto al comparador de consumo masivo.
// Se monta reemplazando al Header global (ver app/empresas/layout.tsx).
export function EmpresasHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#0A0B0D]/95 backdrop-blur border-b border-white/[0.08]">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <Link href="/empresas" className="flex items-center gap-2.5 flex-shrink-0">
            <svg width="30" height="30" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="18" cy="18" r="18" fill="#C7A046"/>
              <g transform="translate(18,18) skewX(-14) translate(-18,-18)">
                <rect x="10" y="7" width="6" height="22" fill="#0A0B0D"/>
                <path d="M16 7 A9 9 0 0 1 16 25 Z" fill="#0A0B0D"/>
                <path d="M16 11 A5 5 0 0 1 16 21 Z" fill="#C7A046"/>
              </g>
            </svg>
            <span className="font-semibold text-lg text-white tracking-tight">
              PrepagaYa
            </span>
            <span className="hidden sm:inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-[#C7A046] border border-[#C7A046]/40 rounded-full px-2 py-0.5 ml-0.5">
              Empresas
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-gray-300 hover:text-white transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/" className="hidden md:inline text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Ir al comparador →
            </Link>
            <Link
              href="/empresas#cotizar"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-[#C7A046] hover:bg-[#DDBB63] text-[#0A0B0D] font-bold rounded-lg text-sm transition-colors"
            >
              Pedir propuesta
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg text-gray-300 hover:bg-white/5"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Abrir menú"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden py-4 border-t border-white/[0.08] flex flex-col gap-1">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                className="px-2 py-2.5 text-sm text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                {item.label}
              </Link>
            ))}
            <Link href="/" onClick={() => setMenuOpen(false)}
              className="px-2 py-2.5 text-sm text-gray-500 hover:text-gray-300 rounded-lg hover:bg-white/5 transition-colors mt-1 border-t border-white/[0.08] pt-3">
              Ir al comparador de consumo →
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
