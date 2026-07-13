import Link from 'next/link'

const prepagaLinks = [
  { slug: 'swiss-medical', nombre: 'Swiss Medical' },
  { slug: 'osde', nombre: 'OSDE' },
  { slug: 'cemic', nombre: 'CEMIC' },
  { slug: 'sancor-salud', nombre: 'Sancor Salud' },
  { slug: 'premedic', nombre: 'Premedic' },
  { slug: 'medife', nombre: 'Medife' },
]

const coberturaLinks = [
  { slug: 'psicologia', label: 'Cobertura de psicología' },
  { slug: 'maternidad', label: 'Cobertura de maternidad' },
  { slug: 'odontologia', label: 'Cobertura odontológica' },
  { slug: 'fertilidad', label: 'Fertilización asistida' },
  { slug: 'oncologia', label: 'Oncología' },
  { slug: 'medicamentos', label: 'Medicamentos' },
]

const condicionLinks = [
  { slug: 'diabetes', label: 'Prepaga para diabéticos' },
  { slug: 'celiacos', label: 'Prepaga para celíacos' },
  { slug: 'salud-mental', label: 'Salud mental' },
  { slug: 'autismo', label: 'Autismo (TEA)' },
  { slug: 'preexistencias', label: 'Con preexistencias' },
]

const obrasSocialesLinks = [
  { slug: 'osde', label: 'OSDE' },
  { slug: 'swiss-medical-os', label: 'Swiss Medical Salud' },
  { slug: 'pami', label: 'PAMI' },
  { slug: 'ioma', label: 'IOMA' },
  { slug: 'sancor-os', label: 'Sancor OS' },
  { slug: 'galeno', label: 'Galeno' },
]

const guiaLinks = [
  { slug: 'como-cambiar-de-prepaga', label: 'Cómo cambiar de prepaga' },
  { slug: 'obra-social-vs-prepaga', label: 'Obra social vs prepaga' },
  { slug: 'prepagas-para-monotributistas', label: 'Para monotributistas' },
  { slug: 'prepagas-economicas', label: 'Prepagas económicas' },
  { slug: 'que-cubre-la-prepaga', label: 'Qué cubre la prepaga' },
  { slug: 'cuota-prepaga-por-edad', label: 'Cuota por edad' },
]

// ── SVG Icons ──────────────────────────────────────────────────────────────────

function IconTarget() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconCalculator() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" viewBox="0 0 24 24">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 7h8" />
      <path d="M8 12h2M14 12h2M8 16h2M14 16h2" />
    </svg>
  )
}

function IconCompare() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" viewBox="0 0 24 24">
      <rect x="2" y="5" width="9" height="14" rx="1.5" />
      <rect x="13" y="5" width="9" height="14" rx="1.5" />
      <path d="M5 9h3M13 9h3M5 13h3M13 13h3" />
    </svg>
  )
}

function IconChart() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M3 20h18" />
      <rect x="4" y="13" width="4" height="7" rx="0.5" fill="currentColor" stroke="none" className="opacity-60" />
      <rect x="10" y="8" width="4" height="12" rx="0.5" fill="currentColor" stroke="none" className="opacity-80" />
      <rect x="16" y="4" width="4" height="16" rx="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconArrow() {
  return (
    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

// ── Component ──────────────────────────────────────────────────────────────────

export function Footer() {
  return (
    <footer className="bg-[#0a0f1e] text-gray-400">
      <div className="container py-14">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-x-6 gap-y-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-4 xl:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="18" cy="18" r="18" fill="#E8002D"/>
                <g transform="translate(18,18) skewX(-14) translate(-18,-18)">
                  <rect x="10" y="7" width="6" height="22" fill="white"/>
                  <path d="M16 7 A9 9 0 0 1 16 25 Z" fill="white"/>
                  <path d="M16 11 A5 5 0 0 1 16 21 Z" fill="#E8002D"/>
                </g>
              </svg>
              <span className="font-bold text-lg text-white tracking-tight">
                Prepaga<span className="text-red-400">Ya</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              El comparador de prepagas y obras sociales más completo de Argentina. Precios actualizados, opiniones reales y comparativas independientes.
            </p>
            <p className="text-xs text-gray-600 mt-4 leading-relaxed max-w-xs">
              Precios de referencia para persona de 30 años. Los precios finales varían según edad y zona geográfica.
            </p>
          </div>

          {/* Prepagas */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Prepagas</h3>
            <ul className="space-y-2.5">
              {prepagaLinks.map((p) => (
                <li key={p.slug}>
                  <Link href={`/prepagas/${p.slug}`} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {p.nombre}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/prepagas" className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium mt-1">
                  Ver todas <IconArrow />
                </Link>
              </li>
            </ul>
          </div>

          {/* Coberturas */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Coberturas</h3>
            <ul className="space-y-2.5">
              {coberturaLinks.map((c) => (
                <li key={c.slug}>
                  <Link href={`/coberturas/${c.slug}`} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {c.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/coberturas" className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium mt-1">
                  Ver todas <IconArrow />
                </Link>
              </li>
            </ul>
          </div>

          {/* Por condición */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Por condición</h3>
            <ul className="space-y-2.5">
              {condicionLinks.map((c) => (
                <li key={c.slug}>
                  <Link href={`/condiciones/${c.slug}`} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {c.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/condiciones" className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium mt-1">
                  Ver todas <IconArrow />
                </Link>
              </li>
              <li className="pt-2 border-t border-gray-800 mt-2">
                <Link href="/obras-sociales" className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  Obras sociales <IconArrow />
                </Link>
              </li>
            </ul>
          </div>

          {/* Herramientas */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Herramientas</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/comparador" className="group flex items-center gap-2.5 text-sm text-gray-500 hover:text-white transition-colors">
                  <span className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-red-500/20 flex items-center justify-center transition-colors text-blue-400">
                    <IconTarget />
                  </span>
                  Comparador
                </Link>
              </li>
              <li>
                <Link href="/calculadora" className="group flex items-center gap-2.5 text-sm text-gray-500 hover:text-white transition-colors">
                  <span className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-red-500/20 flex items-center justify-center transition-colors text-blue-400">
                    <IconCalculator />
                  </span>
                  Calculadora
                </Link>
              </li>
              <li>
                <Link href="/comparar" className="group flex items-center gap-2.5 text-sm text-gray-500 hover:text-white transition-colors">
                  <span className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-red-500/20 flex items-center justify-center transition-colors text-blue-400">
                    <IconCompare />
                  </span>
                  Comparar planes
                </Link>
              </li>
              <li>
                <Link href="/ranking" className="group flex items-center gap-2.5 text-sm text-gray-500 hover:text-white transition-colors">
                  <span className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-red-500/20 flex items-center justify-center transition-colors text-blue-400">
                    <IconChart />
                  </span>
                  Ranking
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-sm text-gray-500 hover:text-white transition-colors pl-0.5">
                  Quiz prepaga
                </Link>
              </li>
              <li>
                <Link href="/historial-precios" className="text-sm text-gray-500 hover:text-white transition-colors pl-0.5">
                  Historial de precios
                </Link>
              </li>
              <li>
                <Link href="/cartillas" className="text-sm text-gray-500 hover:text-white transition-colors pl-0.5">
                  Cartillas médicas
                </Link>
              </li>
            </ul>
          </div>

          {/* Guías */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Guías</h3>
            <ul className="space-y-2.5">
              {guiaLinks.map((g) => (
                <li key={g.slug}>
                  <Link href={`/guias/${g.slug}`} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {g.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/guias" className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium mt-1">
                  Ver todas <IconArrow />
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.06] mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © 2026 PrepagaYa · Sitio independiente, no afiliado a ninguna prepaga ni obra social.
          </p>
          <div className="flex gap-5 text-xs text-gray-600">
            <Link href="/sobre-nosotros" className="hover:text-gray-400 transition-colors">Sobre nosotros</Link>
            <Link href="/metodologia" className="hover:text-gray-400 transition-colors">Metodología</Link>
            <Link href="/privacidad" className="hover:text-gray-400 transition-colors">Privacidad</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
