import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
  className?: string
}

export function StarRating({
  rating,
  max = 5,
  size = 'md',
  showNumber = true,
  className,
}: StarRatingProps) {
  const stars = Array.from({ length: max }, (_, i) => {
    const filled = i < Math.floor(rating)
    const half = !filled && i < rating
    return { filled, half }
  })

  const sizeClass = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  }[size]

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className={cn('flex', sizeClass)}>
        {stars.map((star, i) => (
          <span
            key={i}
            className={cn(
              star.filled ? 'text-amber-400' : 'text-gray-300'
            )}
          >
            ★
          </span>
        ))}
      </div>
      {showNumber && (
        <span className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
      )}
    </div>
  )
}
