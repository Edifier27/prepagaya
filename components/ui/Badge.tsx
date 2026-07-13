import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'green' | 'blue' | 'red' | 'gray'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-blue-100 text-blue-800',
        variant === 'green' && 'bg-green-100 text-green-800',
        variant === 'blue' && 'bg-blue-100 text-blue-800',
        variant === 'red' && 'bg-red-100 text-red-800',
        variant === 'gray' && 'bg-gray-100 text-gray-700',
        className
      )}
    >
      {children}
    </span>
  )
}
