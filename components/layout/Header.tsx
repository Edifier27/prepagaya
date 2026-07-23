'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { provinciasSEO } from '@/lib/data/zonas'
import { MiniBuilding, MiniLeaf, MiniElder, MiniCross } from '@/components/ui/CategoryIcon'

const prepagaLinks = [
  { slug: 'swiss-medical', nombre: 'Swiss Medical', colorPrimario: '#E30613' },
  { slug: 'osde',          nombre: 'OSDE',          colorPrimario: '#003087' },
  { slug: 'medife',        nombre: 'Medifé',        colorPrimario: '#009639' },
  { slug: 'sancor-salud',  nombre: 'Sancor Salud',  colorPrimario: '#E30613' },
  { slug: 'omint',         nombre: 'Omint',         colorPrimario: '#005BAC' },
  { slug: 'medicus',       nombre: 'Medicus',       colorPrimario: '#0057A8' },
  { slug: 'avalian',       nombre: 'Avalian',       colorPrimario: '#0099D4' },
  { slug: 'cemic',         nombre: 'CEMIC',         colorPrimario: '#1B4F9B' },
  { slug: 'hospital-italiano', nombre: 'Hospital Italiano', colorPrimario: '#003087' },
  { slug: 'premedic',      nombre: 'Premedic',      colorPrimario: '#0066CC' },
  { slug: 'prevencion-salud', nombre: 'Prevención Salud', colorPrimario: '#0066A1' },
  { slug: 'federada-salud',nombre: 'Federada Salud',colorPrimario: '#C0392B' },
  { slug: 'hominis',       nombre: 'Hominis',       colorPrimario: '#1B5E20' },
  { slug: 'galeno',        nombre: 'Galeno',        colorPrimario: '#005B9A' },
  { slug: 'luis-pasteur',  nombre: 'Luis Pasteur',  colorPrimario: '#006837' },
]

// Silo SEO local: hubs provinciales con cobertura verificada (lib/data/zonas.ts)
const zonasMenu = provinciasSEO.map((p) => ({
  href: `/prepagas/${p.slug}`,
  label: `Prepagas en ${p.nombre}`,
  ranking: `/prepagas/${p.slug}/mejores-prepagas`,
}))

const obrasSocialesMenu = [
  { href: '/obras-sociales/osde',            label: 'OSDE',               Icon: MiniBuilding },
  { href: '/obras-sociales/swiss-medical-os',label: 'Swiss Medical Salud', Icon: MiniCross },
  { href: '/obras-sociales/pami',            label: 'PAMI',               Icon: MiniElder },
  { href: '/obras-sociales/ioma',            label: 'IOMA',               Icon: MiniBuilding },
  { href: '/obras-sociales/sancor-os',       label: 'Sancor OS',          Icon: MiniLeaf },
]

const herramientasMenu = [
  { href: '/precios', label: 'Precios julio 2026' },
  { href: '/cambios', label: '¿A qué prepaga cambiarte?' },
  { href: '/aumentos', label: 'Aumentos mes a mes' },
  { href: '/comparar', label: 'Comparar planes' },
  { href: '/prepaga-por-presupuesto', label: 'Encontrá tu prepaga por presupuesto' },
  { href: '/historial-precios', label: 'Historial de precios' },
  { href: '/calculadora', label: 'Calculadora' },
  { href: '/cartillas', label: 'Cartillas médicas' },
  { href: '/glosario', label: 'Glosario de prepagas' },
  { href: '/blog', label: 'Blog' },
]

type DropdownKey = 'prepagas' | 'zonas' | 'obras-sociales' | 'herramientas' | null

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey>(null)

  const openDropdown = (key: DropdownKey) => setActiveDropdown(key)
  const closeDropdown = () => setActiveDropdown(null)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="18" cy="18" r="18" fill="#E8002D"/>
                <g transform="translate(18,18) skewX(-14) translate(-18,-18)">
                  <rect x="10" y="7" width="6" height="22" fill="white"/>
                  <path d="M16 7 A9 9 0 0 1 16 25 Z" fill="white"/>
                  <path d="M16 11 A5 5 0 0 1 16 21 Z" fill="#E8002D"/>
                </g>
              </svg>
              <span className="font-bold text-xl text-gray-900">
                Prepaga<span className="text-[#E8002D]">Ya</span>
              </span>
            </div>
          </Link>

          {/* Nav Desktop */}
          <nav className="hidden md:flex items-center gap-5">

            {/* Prepagas dropdown */}
            <div className="relative" onMouseEnter={() => openDropdown('prepagas')} onMouseLeave={closeDropdown}>
              <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[#E8002D] transition-colors">
                Prepagas
                <svg className="w-3.5 h-3.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'prepagas' && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {prepagaLinks.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/prepagas/${p.slug}`}
                      className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-red-50 hover:text-[#E8002D] transition-colors"
                    >
                      {p.nombre}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <Link href="/prepagas" className="block px-4 py-2 text-sm font-medium text-[#E8002D] hover:bg-red-50 transition-colors">
                      Ver todas las prepagas →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Por zona dropdown (silo SEO local) */}
            <div className="relative" onMouseEnter={() => openDropdown('zonas')} onMouseLeave={closeDropdown}>
              <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[#E8002D] transition-colors">
                Por zona
                <svg className="w-3.5 h-3.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'zonas' && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {zonasMenu.map((item) => (
                    <div key={item.href} className="flex items-center justify-between pr-3 hover:bg-red-50 transition-colors group">
                      <Link href={item.href} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 group-hover:text-[#E8002D] transition-colors flex-1">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-gray-300 group-hover:text-[#E8002D] flex-shrink-0 transition-colors">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="9" r="2" fill="currentColor" stroke="none"/>
                        </svg>
                        {item.label}
                      </Link>
                      <Link href={item.ranking} className="text-[10px] font-semibold text-gray-400 hover:text-[#E8002D] transition-colors flex-shrink-0">
                        Ranking
                      </Link>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <Link href="/prepagas" className="block px-4 py-2 text-sm font-medium text-[#E8002D] hover:bg-red-50 transition-colors">
                      Todas las provincias →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Obras Sociales dropdown */}
            <div className="relative" onMouseEnter={() => openDropdown('obras-sociales')} onMouseLeave={closeDropdown}>
              <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[#E8002D] transition-colors">
                Obras Sociales
                <svg className="w-3.5 h-3.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'obras-sociales' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {obrasSocialesMenu.map((item) => (
                    <Link key={item.href} href={item.href} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors group">
                      <item.Icon />
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <Link href="/obras-sociales" className="block px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors">Ver todas →</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Herramientas dropdown */}
            <div className="relative" onMouseEnter={() => openDropdown('herramientas')} onMouseLeave={closeDropdown}>
              <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[#E8002D] transition-colors">
                Herramientas
                <svg className="w-3.5 h-3.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'herramientas' && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {herramientasMenu.map((item) => (
                    <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-[#E8002D] transition-colors">
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <a href="/comparador"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm transition-all shadow-sm hover:shadow-md">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-4 h-4">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Cotizá gratis
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
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

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col gap-1">
              <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Prepagas</p>
              {prepagaLinks.map((p) => (
                <Link key={p.slug} href={`/prepagas/${p.slug}`} className="px-2 py-2 text-sm text-gray-700 hover:text-[#E8002D] rounded-lg hover:bg-red-50 transition-colors" onClick={() => setMenuOpen(false)}>
                  {p.nombre}
                </Link>
              ))}
              <div className="border-t border-gray-100 mt-2 pt-2">
                <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Por zona</p>
                {zonasMenu.map((item) => (
                  <Link key={item.href} href={item.href} className="px-2 py-2 text-sm text-gray-700 hover:text-[#E8002D] rounded-lg hover:bg-red-50 flex items-center gap-1" onClick={() => setMenuOpen(false)}>
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-2 pt-2">
                <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Obras Sociales</p>
                {obrasSocialesMenu.map((item) => (
                  <Link key={item.href} href={item.href} className="px-2 py-2 text-sm text-gray-700 hover:text-purple-700 rounded-lg hover:bg-purple-50 flex items-center gap-1" onClick={() => setMenuOpen(false)}>
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-2 pt-2">
                <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Herramientas</p>
                {herramientasMenu.map((item) => (
                  <Link key={item.href} href={item.href} className="px-2 py-2 text-sm text-gray-700 hover:text-[#E8002D] rounded-lg hover:bg-red-50 block transition-colors" onClick={() => setMenuOpen(false)}>
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="mt-3">
                <a href="/comparador" onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#F97316] hover:bg-[#ea6c0b] text-white font-bold rounded-xl text-sm transition-all">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-4 h-4">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Cotizá gratis
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
