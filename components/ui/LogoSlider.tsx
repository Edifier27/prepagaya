'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { PrepagaLogo } from './PrepagaLogo'

interface LogoEntry {
  slug: string
  nombre: string
  colorPrimario: string
}

interface LogoSliderProps {
  logos: LogoEntry[]
  intervalMs?: number
}

export function LogoSlider({ logos, intervalMs = 2600 }: LogoSliderProps) {
  const [center, setCenter] = useState(0)
  const n = logos.length

  const advance = useCallback(() => {
    setCenter(prev => (prev + 1) % n)
  }, [n])

  useEffect(() => {
    const timer = setInterval(advance, intervalMs)
    return () => clearInterval(timer)
  }, [advance, intervalMs])

  // Positions: -1 (left), 0 (center), 1 (right)
  const getIdx = (offset: number) => (center + offset + n) % n

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8 h-[68px] bg-gray-50 border-t border-gray-100 px-4">
      <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider hidden sm:block mr-2 flex-shrink-0">
        Compará
      </span>

      <div className="flex items-center gap-3 sm:gap-6">
        {([-1, 0, 1] as const).map((offset) => {
          const logo = logos[getIdx(offset)]
          const isCenter = offset === 0

          return (
            <Link
              key={offset}
              href={`/prepagas/${logo.slug}`}
              className="flex flex-col items-center gap-1 group"
              title={logo.nombre}
            >
              <div
                className={`transition-all duration-500 ease-in-out ${
                  isCenter
                    ? 'scale-100 opacity-100 drop-shadow-md'
                    : 'scale-[0.6] opacity-35 group-hover:opacity-55'
                }`}
              >
                <PrepagaLogo
                  slug={logo.slug}
                  nombre={logo.nombre}
                  colorPrimario={logo.colorPrimario}
                  size={isCenter ? 'md' : 'sm'}
                />
              </div>
              <span
                className={`text-[10px] font-medium text-gray-600 whitespace-nowrap transition-all duration-500 leading-none ${
                  isCenter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                }`}
              >
                {logo.nombre}
              </span>
            </Link>
          )
        })}
      </div>

      <Link
        href="/prepagas"
        className="text-[11px] text-[#E8002D] font-bold ml-2 hidden sm:block flex-shrink-0 hover:underline"
      >
        Ver todas →
      </Link>
    </div>
  )
}
