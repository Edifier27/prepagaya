'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
  MiniPsicologia, MiniMaternidad, MiniOdontologia, MiniFertilidad, MiniOncologia,
  MiniDiabetes, MiniCeliacos, MiniSaludMental, MiniAutismo, MiniPreexistencias,
  MiniBuilding, MiniLeaf, MiniElder, MiniCross,
} from '@/components/ui/CategoryIcon'

const prepagaLinks = [
  { slug: 'swiss-medical', nombre: 'Swiss Medical' },
  { slug: 'osde', nombre: 'OSDE' },
  { slug: 'medife', nombre: 'Medifé' },
  { slug: 'sancor-salud', nombre: 'Sancor Salud' },
  { slug: 'omint', nombre: 'Omint' },
  { slug: 'medicus', nombre: 'Medicus' },
  { slug: 'avalian', nombre: 'Avalian' },
  { slug: 'cemic', nombre: 'CEMIC' },
  { slug: 'hospital-italiano', nombre: 'Hospital Italiano' },
  { slug: 'premedic', nombre: 'Premedic' },
]

const coberturasMenu = [
  { href: '/coberturas/psicologia',  label: 'Psicología',  Icon: MiniPsicologia },
  { href: '/coberturas/maternidad',  label: 'Maternidad',  Icon: MiniMaternidad },
  { href: '/coberturas/odontologia', label: 'Odontología', Icon: MiniOdontologia },
  { href: '/coberturas/fertilidad',  label: 'Fertilidad',  Icon: MiniFertilidad },
  { href: '/coberturas/oncologia',   label: 'Oncología',   Icon: MiniOncologia },
]

const condicionesMenu = [
  { href: '/condiciones/diabetes',        label: 'Diabetes',      Icon: MiniDiabetes },
  { href: '/condiciones/celiacos',        label: 'Celiaquía',     Icon: MiniCeliacos },
  { href: '/condiciones/salud-mental',    label: 'Salud mental',  Icon: MiniSaludMental },
  { href: '/condiciones/autismo',         label: 'Autismo (TEA)', Icon: MiniAutismo },
  { href: '/condiciones/preexistencias',  label: 'Preexistencias',Icon: MiniPreexistencias },
]

const obrasSocialesMenu = [
  { href: '/obras-sociales/osde',            label: 'OSDE',               Icon: MiniBuilding },
  { href: '/obras-sociales/swiss-medical-os',label: 'Swiss Medical Salud', Icon: MiniCross },
  { href: '/obras-sociales/pami',            label: 'PAMI',               Icon: MiniElder },
  { href: '/obras-sociales/ioma',            label: 'IOMA',               Icon: MiniBuilding },
  { href: '/obras-sociales/sancor-os',       label: 'Sancor OS',          Icon: MiniLeaf },
]

const herramientasMenu = [
  { href: '/precios', label: 'Precios julio 2026' },
  { href: '/comparar', label: 'Comparar planes' },
  { href: '/prepaga-por-presupuesto', label: 'Encontrá tu prepaga por presupuesto' },
  { href: '/historial-precios', label: 'Historial de precios' },
  { href: '/calculadora-costo', label: 'Calculadora' },
  { href: '/cartillas', label: 'Cartillas médicas' },
]

type DropdownKey = 'prepagas' | 'coberturas' | 'condiciones' | 'obras-sociales' | 'herramientas' | null

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
                <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="grid grid-cols-2 gap-0">
                    {prepagaLinks.map((p) => (
                      <Link key={p.slug} href={`/prepagas/${p.slug}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-[#E8002D] transition-colors">
                        {p.nombre}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <Link href="/prepagas" className="block px-4 py-2 text-sm font-medium text-[#E8002D] hover:bg-red-50 transition-colors">Ver todas las prepagas →</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Coberturas dropdown */}
            <div className="relative" onMouseEnter={() => openDropdown('coberturas')} onMouseLeave={closeDropdown}>
              <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[#E8002D] transition-colors">
                Coberturas
                <svg className="w-3.5 h-3.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'coberturas' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {coberturasMenu.map((item) => (
                    <Link key={item.href} href={item.href} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-[#E8002D] transition-colors group">
                      <item.Icon />
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <Link href="/coberturas" className="block px-4 py-2 text-sm font-medium text-[#E8002D] hover:bg-red-50 transition-colors">Ver todas →</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Condiciones dropdown */}
            <div className="relative" onMouseEnter={() => openDropdown('condiciones')} onMouseLeave={closeDropdown}>
              <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[#E8002D] transition-colors">
                Por condición
                <svg className="w-3.5 h-3.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'condiciones' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {condicionesMenu.map((item) => (
                    <Link key={item.href} href={item.href} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-[#E8002D] transition-colors group">
                      <item.Icon />
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <Link href="/condiciones" className="block px-4 py-2 text-sm font-medium text-[#E8002D] hover:bg-red-50 transition-colors">Ver todas →</Link>
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

            <Link href="/comparativas" className="text-sm font-medium text-gray-700 hover:text-[#E8002D] transition-colors">
              Comparativas
            </Link>

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

            <Link href="/blog" className="text-sm font-medium text-gray-700 hover:text-[#E8002D] transition-colors">
              Blog
            </Link>
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
                <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Coberturas</p>
                {coberturasMenu.map((item) => (
                  <Link key={item.href} href={item.href} className="px-2 py-2 text-sm text-gray-700 hover:text-[#E8002D] rounded-lg hover:bg-red-50 flex items-center gap-1" onClick={() => setMenuOpen(false)}>
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-2 pt-2">
                <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Por condición</p>
                {condicionesMenu.map((item) => (
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
              <div className="border-t border-gray-100 mt-2 pt-2 flex flex-col gap-1">
                <Link href="/comparativas" className="px-2 py-2 text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Comparativas</Link>
                <Link href="/blog" className="px-2 py-2 text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Blog</Link>
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
