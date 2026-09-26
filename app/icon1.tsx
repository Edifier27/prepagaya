import { ImageResponse } from 'next/og'
import { marcaDataUri } from '@/lib/marca'

// Favicon PNG de respaldo para navegadores sin favicon SVG (el principal es
// app/icon.svg). 96 px: Google pide múltiplos de 48 para mostrarlo en los
// resultados; el anterior era de 32 y con una "P" de fuente genérica.
export const size = { width: 96, height: 96 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    // eslint-disable-next-line @next/next/no-img-element
    <img src={marcaDataUri('circulo')} width={96} height={96} alt="" />,
    { ...size },
  )
}
