'use client'

import Link from 'next/link'
import { Buscador } from './Buscador'
import { useState } from 'react'
// Solo el JSON chico de precios (no lib/data/prepagas.ts): el header está en
// todas las páginas y es client component.
import preciosOficiales from '@/lib/data/precios-oficiales.json'

// Orden del menú (Darío, 23-sep-2026): Swiss Medical "mejor prepaga",
// Premedic "mejor prepaga económica" y después el resto.
const prepagaLinks: { slug: string; nombre: string; colorPrimario: string; badge?: string }[] = [
  { slug: 'swiss-medical', nombre: 'Swiss Medical', colorPrimario: '#E30613', badge: 'Mejor prepaga' },
  { slug: 'premedic',      nombre: 'Premedic',      colorPrimario: '#0066CC', badge: 'Mejor prepaga económica' },
  { slug: 'osde',          nombre: 'OSDE',          colorPrimario: '#003087' },
  { slug: 'medife',        nombre: 'Medifé',        colorPrimario: '#009639' },
  { slug: 'sancor-salud',  nombre: 'Sancor Salud',  colorPrimario: '#E30613' },
  { slug: 'omint',         nombre: 'Omint',         colorPrimario: '#005BAC' },
  { slug: 'medicus',       nombre: 'Medicus',       colorPrimario: '#0057A8' },
  { slug: 'avalian',       nombre: 'Avalian',       colorPrimario: '#0099D4' },
  { slug: 'cemic',         nombre: 'CEMIC',         colorPrimario: '#1B4F9B' },
  { slug: 'hospital-italiano', nombre: 'Hospital Italiano', colorPrimario: '#003087' },
  { slug: 'prevencion-salud', nombre: 'Prevención Salud', colorPrimario: '#0066A1' },
  { slug: 'federada-salud',nombre: 'Federada Salud',colorPrimario: '#C0392B' },
  { slug: 'hominis',       nombre: 'Hominis',       colorPrimario: '#1B5E20' },
  { slug: 'galeno',        nombre: 'Galeno',        colorPrimario: '#005B9A' },
  { slug: 'luis-pasteur',  nombre: 'Luis Pasteur',  colorPrimario: '#006837' },
]

const PRECIO_ACTUALIZADO = preciosOficiales.periodoTexto

// Menú renovado (Darío, 28-sep-2026: "quedó medio viejo, que se encuentre lo
// más útil"). Afuera "Por zona" y "Obras sociales" (siguen en el footer, así
// que no se pierde el enlazado interno); adentro los rankings, las
// herramientas y las guías.
type ItemMenu = { href: string; label: string; desc?: string; nuevo?: boolean }

const rankingMenu: ItemMenu[] = [
  { href: '/ranking', label: 'Mejores prepagas de Argentina', desc: 'Ranking con precios oficiales' },
  { href: '/prepagas-economicas', label: 'Prepagas económicas', desc: 'Buenas y baratas, con cartilla' },
  { href: '/comparativas', label: 'Comparativas', desc: 'OSDE vs Swiss Medical y más' },
  { href: '/precios', label: `Precios ${PRECIO_ACTUALIZADO.toLowerCase()}`, desc: 'Lista oficial de todos los planes' },
  { href: '/aumentos', label: 'Aumentos mes a mes', desc: 'El dato oficial de cada prepaga' },
]

const herramientasGrupos: { titulo: string; items: ItemMenu[] }[] = [
  {
    titulo: 'Elegí tu prepaga',
    items: [
      { href: '/comparador', label: 'Cotizador', desc: 'Precio exacto para tu grupo, 15% OFF' },
      { href: '/match-prepaga', label: '¿Qué prepaga me conviene?', desc: 'Test de 6 preguntas' },
      { href: '/chequeo-prepaga', label: '¿Pagás de más?', desc: 'Chequeá tu cuota y cuánto aumenta' },
      { href: '/calculadora-aportes', label: 'De tu obra social a una prepaga', desc: 'Cuánto pagás con tus aportes' },
    ],
  },
  {
    titulo: 'Cobertura y atención',
    items: [
      { href: '/guias/que-cubre-la-prepaga#buscador', label: '¿Qué me cubre la prepaga?', desc: 'Buscá cualquier práctica', nuevo: true },
      { href: '/guardias-cerca', label: '¿Dónde me atiendo?', desc: 'Guardias cerca con tu ubicación', nuevo: true },
      { href: '/buscar-por-sanatorio', label: '¿Qué prepaga cubre mi sanatorio?', desc: 'Con las cartillas oficiales' },
      { href: '/fertilizacion-asistida', label: 'Fertilización asistida', desc: 'Qué cubre la ley y centros por zona', nuevo: true },
      { href: '/declaracion-jurada-de-salud', label: 'Preexistencias', desc: 'Qué papeles te piden al afiliarte' },
      { href: '/cartillas', label: 'Cartillas médicas', desc: 'Sanatorios y guardias por zona' },
    ],
  },
]

const guiasMenu: ItemMenu[] = [
  { href: '/guias/que-cubre-la-prepaga', label: 'Qué cubre la prepaga' },
  { href: '/pmo', label: 'El PMO, explicado' },
  { href: '/condiciones/preexistencias', label: 'Carencias y preexistencias' },
  { href: '/cambios', label: '¿A qué prepaga cambiarte?' },
  { href: '/tramites', label: 'Trámites de prepaga' },
  { href: '/glosario', label: 'Glosario de prepagas' },
  { href: '/guias', label: 'Todas las guías' },
]

type DropdownKey = 'prepagas' | 'ranking' | 'herramientas' | 'guias' | null

const Flecha = () => (
  <svg className="w-3.5 h-3.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const Nuevo = () => (
  <span className="rounded-full bg-[#E8002D] px-1.5 py-0.5 text-[9px] font-black uppercase leading-none text-white">Nuevo</span>
)

// Botón de cada desplegable: se abre al pasar el mouse y también con clic
// o teclado (antes solo con hover).
function Disparador({ texto, abierto, onAlternar }: { texto: string; abierto: boolean; onAlternar: () => void }) {
  return (
    <button type="button" onClick={onAlternar} aria-expanded={abierto} aria-haspopup="true"
      className={`flex items-center gap-1 text-sm font-medium transition-colors ${abierto ? 'text-[#E8002D]' : 'text-gray-700 hover:text-[#E8002D]'}`}>
      {texto}
      <Flecha />
    </button>
  )
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey>(null)

  const openDropdown = (key: DropdownKey) => setActiveDropdown(key)
  const closeDropdown = () => setActiveDropdown(null)
  const alternar = (key: DropdownKey) => setActiveDropdown((a) => (a === key ? null : key))
  const cerrarMovil = () => setMenuOpen(false)

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
                  <path d="M15.5 7 H16 A9 9 0 0 1 16 25 H15.5 Z" fill="white"/>
                  <path d="M16 11 A5 5 0 0 1 16 21 Z" fill="#E8002D"/>
                </g>
              </svg>
              <span className="font-bold text-xl text-gray-900">
                Prepaga<span className="text-[#E8002D]">Ya</span>
              </span>
            </div>
          </Link>

          {/* Nav Desktop: menú completo desde 1024 px (entre 768 y 1024 va el
              menú hamburguesa). Los paneles cuelgan con padding (no margin)
              para que el mouse no los cierre al cruzar el hueco. */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Menú principal">

            {/* Prepagas */}
            <div className="relative" onMouseEnter={() => openDropdown('prepagas')} onMouseLeave={closeDropdown}>
              <Disparador texto="Prepagas" abierto={activeDropdown === 'prepagas'} onAlternar={() => alternar('prepagas')} />
              {activeDropdown === 'prepagas' && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="w-72 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                    {prepagaLinks.map((p) => (
                      <Link key={p.slug} href={`/prepagas/${p.slug}`} onClick={closeDropdown}
                        className={`flex items-center justify-between gap-2 px-3 py-1.5 text-sm hover:bg-red-50 hover:text-[#E8002D] transition-colors ${p.badge ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {p.nombre}
                        {p.badge && <BadgeDestacado texto={p.badge} />}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <Link href="/prepagas" onClick={closeDropdown} className="block px-4 py-2 text-sm font-medium text-[#E8002D] hover:bg-red-50 transition-colors">
                        Ver todas las prepagas →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ranking */}
            <div className="relative" onMouseEnter={() => openDropdown('ranking')} onMouseLeave={closeDropdown}>
              <Disparador texto="Ranking" abierto={activeDropdown === 'ranking'} onAlternar={() => alternar('ranking')} />
              {activeDropdown === 'ranking' && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="w-80 bg-white rounded-xl shadow-lg border border-gray-100 p-2">
                    {rankingMenu.map((item) => (
                      <Link key={item.href} href={item.href} onClick={closeDropdown} className="block rounded-lg px-3 py-2 hover:bg-red-50 group">
                        <span className="block text-sm font-semibold text-gray-900 group-hover:text-[#E8002D]">{item.label}</span>
                        {item.desc && <span className="block text-xs text-gray-500">{item.desc}</span>}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Herramientas: panel ancho en dos columnas */}
            <div className="relative" onMouseEnter={() => openDropdown('herramientas')} onMouseLeave={closeDropdown}>
              <Disparador texto="Herramientas" abierto={activeDropdown === 'herramientas'} onAlternar={() => alternar('herramientas')} />
              {activeDropdown === 'herramientas' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                  <div className="w-[620px] bg-white rounded-2xl shadow-xl border border-gray-100 p-4 grid grid-cols-2 gap-4">
                    {herramientasGrupos.map((g) => (
                      <div key={g.titulo}>
                        <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wide text-gray-400">{g.titulo}</p>
                        {g.items.map((item) => (
                          <Link key={item.href} href={item.href} onClick={closeDropdown} className="block rounded-lg px-3 py-2 hover:bg-red-50 group">
                            <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 group-hover:text-[#E8002D]">{item.label}{item.nuevo && <Nuevo />}</span>
                            {item.desc && <span className="block text-xs text-gray-500">{item.desc}</span>}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Guías */}
            <div className="relative" onMouseEnter={() => openDropdown('guias')} onMouseLeave={closeDropdown}>
              <Disparador texto="Guías" abierto={activeDropdown === 'guias'} onAlternar={() => alternar('guias')} />
              {activeDropdown === 'guias' && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                    {guiasMenu.map((item) => (
                      <Link key={item.href} href={item.href} onClick={closeDropdown} className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-[#E8002D] transition-colors">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/empresas" className="text-sm font-medium text-gray-700 hover:text-[#E8002D] transition-colors">
              Empresas
            </Link>
          </nav>

          <div className="flex items-center gap-1 md:gap-3">
          {/* Buscador del sitio (24-sep-2026) */}
          <Buscador />

          {/* CTA */}
          <div className="hidden lg:block">
            <Link href="/comparador"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm transition-all shadow-sm hover:shadow-md whitespace-nowrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-4 h-4">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Cotizá gratis
              {/* Incentivo al clic (Darío, 25-sep-2026): el mismo 15% online del cotizador */}
              <span className="rounded-md bg-white/5 border border-white/25 px-1.5 py-0.5 text-[10px] font-black leading-none">15% OFF</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
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

        {/* Mobile menu: lo más usado arriba (cotizar y herramientas); las
            listas largas (prepagas) van plegadas. */}
        {menuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 max-h-[80vh] overflow-y-auto">
            <Link href="/comparador" onClick={cerrarMovil}
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm transition-all">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-4 h-4">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Cotizá gratis · 15% OFF online
            </Link>

            {herramientasGrupos.map((g) => (
              <div key={g.titulo} className="mt-4">
                <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{g.titulo}</p>
                <div className="grid grid-cols-2 gap-2">
                  {g.items.filter((i) => i.href !== '/comparador').map((item) => (
                    <Link key={item.href} href={item.href} onClick={cerrarMovil}
                      className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-gray-800 hover:border-red-200 hover:text-[#E8002D] leading-snug">
                      <span className="flex flex-wrap items-center gap-1">{item.label}{item.nuevo && <Nuevo />}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-4 border-t border-gray-100 pt-3">
              <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Ranking</p>
              {rankingMenu.map((item) => (
                <Link key={item.href} href={item.href} onClick={cerrarMovil} className="px-2 py-2 text-sm text-gray-700 hover:text-[#E8002D] rounded-lg hover:bg-red-50 block">
                  {item.label}
                </Link>
              ))}
            </div>

            <details className="mt-2 border-t border-gray-100 pt-2 group">
              <summary className="flex cursor-pointer list-none items-center justify-between px-2 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Prepagas
                <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </summary>
              {prepagaLinks.map((p) => (
                <Link key={p.slug} href={`/prepagas/${p.slug}`} onClick={cerrarMovil}
                  className={`px-2 py-2 text-sm hover:text-[#E8002D] rounded-lg hover:bg-red-50 transition-colors flex items-center justify-between gap-2 ${p.badge ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                  {p.nombre}
                  {p.badge && <BadgeDestacado texto={p.badge} />}
                </Link>
              ))}
              <Link href="/prepagas" onClick={cerrarMovil} className="px-2 py-2 text-sm font-semibold text-[#E8002D] block">Ver todas las prepagas →</Link>
            </details>

            <details className="border-t border-gray-100 pt-2 group">
              <summary className="flex cursor-pointer list-none items-center justify-between px-2 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Guías
                <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </summary>
              {guiasMenu.map((item) => (
                <Link key={item.href} href={item.href} onClick={cerrarMovil} className="px-2 py-2 text-sm text-gray-700 hover:text-[#E8002D] rounded-lg hover:bg-red-50 block">
                  {item.label}
                </Link>
              ))}
            </details>

            <div className="border-t border-gray-100 pt-2">
              <Link href="/empresas" onClick={cerrarMovil} className="px-2 py-2 text-sm text-gray-700 hover:text-[#E8002D] rounded-lg hover:bg-red-50 block transition-colors">
                Empresas
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function BadgeDestacado({ texto }: { texto: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap"
      style={{ color: '#92400E', backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }}>
      ★ {texto}
    </span>
  )
}
