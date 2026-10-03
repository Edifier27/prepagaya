import { NIVEL_PRECIO_LABEL, cn } from '@/lib/utils'
import type { NivelPrecio } from '@/lib/data/prepagas'

interface NivelPrecioBadgeProps {
  nivel: NivelPrecio
  className?: string
}

export function NivelPrecioBadge({ nivel, className }: NivelPrecioBadgeProps) {
  const { label } = NIVEL_PRECIO_LABEL[nivel]
  return (
    <span
      className={cn(
        'inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border',
        nivel === 'economico' && 'bg-emerald-50 text-emerald-700 border-emerald-200',
        nivel === 'medio' && 'bg-red-50 text-[#B8001F] border-red-200',
        nivel === 'premium' && 'bg-purple-50 text-purple-700 border-purple-200',
        className
      )}
    >
      {label}
    </span>
  )
}
