import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fullWidth?: boolean
}

export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  fullWidth,
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants = {
    primary: 'bg-[#E8002D] text-white hover:bg-[#B8001F] focus:ring-blue-500 shadow-sm',
    secondary: 'bg-[#00875A] text-white hover:bg-[#006644] focus:ring-green-500 shadow-sm',
    outline: 'border-2 border-[#E8002D] text-[#E8002D] hover:bg-red-50 focus:ring-blue-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
    white: 'bg-white text-[#E8002D] hover:bg-red-50 focus:ring-red-300 shadow-sm font-bold',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  }

  const classes = cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
