'use client'

import Image from 'next/image'
import { useState } from 'react'

interface PrepagaLogoProps {
  slug: string
  nombre: string
  colorPrimario: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const sizeConfig = {
  xs: { px: 32,  cls: 'w-8 h-8 rounded-lg text-[10px]'       },
  sm: { px: 40,  cls: 'w-10 h-10 rounded-xl text-xs'          },
  md: { px: 56,  cls: 'w-14 h-14 rounded-2xl text-base'       },
  lg: { px: 72,  cls: 'w-[72px] h-[72px] rounded-2xl text-xl' },
}

const LOGO_EXT: Record<string, string> = {
  'swiss-medical':    'svg',
  'osde':             'png',
  'cemic':            'svg',
  'sancor-salud':     'webp',
  'premedic':         'png',
  'medife':           'jpg',
  'omint':            'png',
  'medicus':          'png',
  'avalian':          'png',
  'prevencion-salud': 'jpg',
  'hospital-italiano':'jpg',
  'federada-salud':   'png',
  'hominis':          'jpg',
  'luis-pasteur':     'jpg',
  'galeno':           'jpg',
}

export function PrepagaLogo({ slug, nombre, colorPrimario, size = 'md', className = '' }: PrepagaLogoProps) {
  const [error, setError] = useState(false)
  const { px, cls } = sizeConfig[size]
  const initials = nombre.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const ext = LOGO_EXT[slug] ?? 'svg'

  if (!error) {
    return (
      <div className={`${cls} ${className} overflow-hidden flex-shrink-0 bg-white`}>
        <Image
          src={`/logos/${slug}.${ext}`}
          alt={nombre}
          width={px}
          height={px}
          className="w-full h-full object-contain"
          onError={() => setError(true)}
          unoptimized
        />
      </div>
    )
  }

  return (
    <div
      className={`${cls} ${className} flex items-center justify-center text-white font-black flex-shrink-0`}
      style={{ backgroundColor: colorPrimario }}
    >
      {initials}
    </div>
  )
}
