import type { CSSProperties } from 'react'
import s from './MatchAnimacion.module.css'

// Pantalla entre la última pregunta y el resultado del match: primero
// "buscando" (anillo que gira y mensajes), después el check verde con confeti
// y el plan elegido. Los tiempos los maneja MatchPrepaga.
export type FaseMatch = 'buscando' | 'listo'

export function MatchAnimacion({ fase, plan }: { fase: FaseMatch; plan?: string }) {
  return (
    <div className={s.caja} role="status" aria-live="polite">
      <div className={s.icono}>
        {fase === 'listo' && <div className={s.onda} aria-hidden />}
        <svg viewBox="0 0 64 64" className={s.svg} aria-hidden>
          {fase === 'buscando' ? (
            <>
              <circle cx="32" cy="32" r="28" className={s.pista} />
              <circle cx="32" cy="32" r="28" className={s.anillo} />
            </>
          ) : (
            <>
              <circle cx="32" cy="32" r="30" className={s.circulo} />
              <path d="M19 33 L28 42 L46 23" className={s.check} />
            </>
          )}
        </svg>
        {fase === 'listo' && (
          <div className={s.confeti} aria-hidden>
            {Array.from({ length: 14 }, (_, i) => <i key={i} style={{ '--i': i } as CSSProperties} />)}
          </div>
        )}
      </div>
      {fase === 'buscando' ? (
        <div className={s.mensajes}>
          <span>Comparando los planes de tu zona…</span>
          <span>Chequeando copagos y cartilla…</span>
          <span>Mirando tus coberturas…</span>
        </div>
      ) : (
        <p className={s.titulo}>
          ¡Tenemos tu match!
          {plan && <span className={s.plan}>{plan}</span>}
        </p>
      )}
    </div>
  )
}

export const claseEntrar = s.entrar
export const claseCriterio = s.criterio
