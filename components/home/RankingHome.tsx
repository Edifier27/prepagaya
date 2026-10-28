'use client'

// Ranking de la home (Darío, 26-oct-2026): podio con el #1 al centro. Sin
// precio (28-oct-2026): cada tarjeta dice para quién es y lleva al botón de
// cotizar. El 15% OFF aparece solo en Swiss Medical.
import Image from 'next/image'
import Link from 'next/link'
import { LOGO_EXT } from '@/components/ui/PrepagaLogo'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'

export interface ItemRanking {
  slug: string
  nombre: string
  /** "quien quiere sanatorios propios de primer nivel" */
  ideal?: string
  pruebas: string[]
  planes: string[]
  promo: boolean
  /** Agranda logos con mucho margen propio (Sancor) */
  escalaLogo?: number
}

const Tilde = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-emerald-600" aria-hidden>
    <path d="M5 12.5l4 4 10-10" />
  </svg>
)

export function RankingHome({ items }: { items: ItemRanking[] }) {
  // Podio en la compu: el #1 al centro y más alto; en el celular, en orden
  const ordenPc = ['md:order-2', 'md:order-1', 'md:order-3']

  return (
    <div className="flex flex-col gap-7">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1.12fr_1fr] md:items-end">
        {items.map((it, i) => {
          const uno = i === 0
          return (
            <article key={it.slug} aria-label={`Puesto ${i + 1}: ${it.nombre}`}
              className={`relative flex min-w-0 flex-col gap-3.5 rounded-[22px] bg-white transition hover:-translate-y-0.5 hover:shadow-[0_22px_48px_-28px_rgba(22,18,26,0.35)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${ordenPc[i] ?? ''} ${uno ? 'mt-3 border-2 border-[#E8002D] p-6 shadow-[0_22px_48px_-28px_rgba(22,18,26,0.35)] md:mt-0' : 'border border-gray-200 p-5'}`}>
              {uno && it.promo && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#E8002D] px-3 py-1 text-xs font-extrabold text-white">Recomendada · 15% OFF online</span>
              )}
              <div className="flex items-center gap-3">
                <span className={`grid h-8 w-8 flex-shrink-0 place-items-center rounded-full border text-[13px] font-extrabold ${uno ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-gray-200 bg-gray-50 text-gray-500'}`}>{i + 1}</span>
                <span className="flex h-11 min-w-0 flex-1 items-center justify-end overflow-hidden">
                  <Image src={`/logos/${it.slug}.${LOGO_EXT[it.slug] ?? 'svg'}`} alt={it.nombre} width={160} height={40} unoptimized={(LOGO_EXT[it.slug] ?? 'svg') === 'svg'}
                    className="h-9 w-auto max-w-[150px] origin-right object-contain" style={it.escalaLogo ? { transform: `scale(${it.escalaLogo})` } : undefined} />
                </span>
              </div>
              <div>
                <h3 className="text-[19px] font-extrabold tracking-tight text-gray-900">{it.nombre}</h3>
                {it.ideal && <p className="mt-0.5 text-[13.5px] text-gray-500">Ideal para <span className="font-semibold text-gray-900">{it.ideal}</span></p>}
              </div>
              <ul className="flex flex-col gap-1.5 text-[13.5px] text-gray-700">
                {it.pruebas.map((p) => <li key={p} className="flex gap-2"><Tilde />{p}</li>)}
              </ul>
              <div className="mt-auto flex flex-col gap-2 border-t border-dashed border-gray-200 pt-4">
                <ContratarPlanButton
                  prepagaNombre={it.nombre}
                  fuente="home-ranking"
                  conPromo={it.promo}
                  planesOpciones={it.planes}
                  titulo={it.promo ? 'Tu precio con 15% OFF' : `Cotizá ${it.nombre}`}
                  label={it.promo ? 'Quiero mi precio con 15% OFF' : `Cotizar ${it.nombre}`}
                  className={uno
                    ? 'flex h-12 w-full items-center justify-center gap-1.5 rounded-[13px] bg-[#E8002D] text-[15px] font-bold text-white transition hover:bg-[#B8001F]'
                    : 'flex h-12 w-full items-center justify-center gap-1.5 rounded-[13px] border-[1.5px] border-gray-200 text-[15px] font-bold text-gray-900 transition hover:border-[#E8002D] hover:text-[#E8002D]'}
                />
                <Link href={`/prepagas/${it.slug}`} className="text-center text-[13.5px] font-semibold text-gray-500 hover:text-[#E8002D] hover:underline">
                  Ver los {it.planes.length} planes de {it.nombre} →
                </Link>
              </div>
            </article>
          )
        })}
      </div>

      <p className="mx-auto max-w-3xl text-center text-xs text-gray-500">El 15% OFF es exclusivo cotizando online con Swiss Medical.</p>
    </div>
  )
}
