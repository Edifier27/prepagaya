import { NIVEL_PRECIO_LABEL, cn } from '@/lib/utils'
import type { NivelPrecio } from '@/lib/data/prepagas'

interface NivelPrecioBadgeProps {
  nivel: NivelPrecio
  className?: string
}

export function NivelPrecioBadge({ nivel, className }: NivelPrecioBadgeProps) {
  const { simbolo, label } = NIVEL_PRECIO_LABEL[nivel]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border',
        nivel === 'economico' && 'bg-emerald-50 text-emerald-700 border-emerald-200',
        nivel === 'medio' && 'bg-red-50 text-[#E8002D] border-red-200',
        nivel === 'premium' && 'bg-purple-50 text-purple-700 border-purple-200',
        className
      )}
    >
      <span className="tabular-nums">{simbolo}</span>
      {label}
    </span>
  )
}
