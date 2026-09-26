import { ImageResponse } from 'next/og'
import { marcaDataUri } from '@/lib/marca'

// Ícono al agregar el sitio a la pantalla de inicio del iPhone (iOS le
// redondea las esquinas solo, por eso va con el fondo lleno).
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <img src={marcaDataUri('cuadrado')} width={180} height={180} alt="" />,
    { ...size },
  )
}
