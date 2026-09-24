import type { Metadata } from 'next'
import { AUMENTOS_OFICIALES, ultimoMesOficial } from '@/lib/data/aumentos'
import { SITE_NAME, SITE_URL } from '@/lib/utils'

// Widget embebible (24-sep-2026): el aumento del mes por prepaga, para que
// medios y blogs lo inserten con un iframe desde /prensa. El código para
// copiar incluye, fuera del iframe, un link con la marca a /aumentos: ese es
// el backlink. Sale de los mismos datos oficiales que /prensa y /aumentos, así
// que se actualiza solo en cada sitio que lo haya insertado.
// noindex: es una vista para iframe, la página indexable es /aumentos.
export const metadata: Metadata = {
  title: 'Widget: aumento de prepagas por empresa',
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/aumentos` },
}

const pct = (n: number) => `${n.toLocaleString('es-AR')}%`

export default function WidgetAumentosPage() {
  const mes = ultimoMesOficial()
  if (!mes) return null
  const ranking = Object.values(mes.prepagas).sort((a, b) => b.mediana - a.mediana)
  const maximo = Math.max(...ranking.map((p) => p.mediana))
  const fecha = new Date(AUMENTOS_OFICIALES.generado + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="bg-white p-4 sm:p-5 font-sans text-gray-900">
      <p className="text-[11px] font-bold uppercase tracking-wide text-[#E8002D]">Dato oficial SSSalud · {mes.label}</p>
      <h1 className="text-lg font-bold leading-snug mt-1">
        Las prepagas aumentan en promedio {pct(mes.promedio)} en {mes.label.toLowerCase()}
      </h1>
      <ul className="mt-4 space-y-1.5">
        {ranking.map((p) => (
          <li key={p.nombre} className="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-2 text-sm">
            <span className="truncate text-gray-700">{p.nombre}</span>
            <span className="h-3 rounded-full bg-gray-100 overflow-hidden" aria-hidden>
              <span className="block h-full rounded-full bg-[#E8002D]" style={{ width: `${(p.mediana / maximo) * 100}%` }} />
            </span>
            <span className="text-right tabular-nums font-semibold">{pct(p.mediana)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[11px] leading-relaxed text-gray-500">
        Mediana del aumento de cada prepaga según los cuadros tarifarios declarados ante la Superintendencia de Servicios de Salud. Datos al {fecha}.{' '}
        <a href={`${SITE_URL}/aumentos`} target="_blank" rel="noopener" className="font-semibold text-[#E8002D] hover:underline">
          Ver el detalle en {SITE_NAME} →
        </a>
      </p>
    </div>
  )
}
