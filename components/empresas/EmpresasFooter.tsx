import Link from 'next/link'

const COLUMNAS = [
  {
    titulo: 'Planes corporativos',
    links: [
      { href: '/empresas/swiss-medical', label: 'Swiss Medical' },
      { href: '/empresas/osde', label: 'OSDE' },
      { href: '/empresas/ranking', label: 'Ranking comparado' },
    ],
  },
  {
    titulo: 'Recursos',
    links: [
      { href: '/empresas/como-cotizar', label: 'Cómo cotizar' },
      { href: '/empresas/beneficios-impositivos', label: 'Beneficios impositivos' },
      { href: '/guias/prepaga-corporativa-vs-particular', label: 'Corporativa vs. particular' },
    ],
  },
]

export function EmpresasFooter() {
  return (
    <footer className="bg-[#0A0B0D] border-t border-white/[0.08]">
      <div className="container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <svg width="26" height="26" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="18" cy="18" r="18" fill="#C7A046"/>
                <g transform="translate(18,18) skewX(-14) translate(-18,-18)">
                  <rect x="10" y="7" width="6" height="22" fill="#0A0B0D"/>
                  <path d="M16 7 A9 9 0 0 1 16 25 Z" fill="#0A0B0D"/>
                  <path d="M16 11 A5 5 0 0 1 16 21 Z" fill="#C7A046"/>
                </g>
              </svg>
              <span className="font-semibold text-white">PrepagaYa <span className="text-[#C7A046]">Empresas</span></span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Asesoramiento gratuito para armar el plan corporativo de salud de tu equipo: precio por volumen, sin carencias en superadoras y deducible de Ganancias.
            </p>
          </div>

          {COLUMNAS.map((col) => (
            <div key={col.titulo}>
              <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">{col.titulo}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-gray-500 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t border-white/[0.08]">
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} PrepagaYa. Todos los derechos reservados.</p>
          <Link href="/" className="text-xs text-gray-500 hover:text-[#C7A046] transition-colors font-medium">
            ¿Buscás una prepaga individual? Andá al comparador →
          </Link>
        </div>
      </div>
    </footer>
  )
}
