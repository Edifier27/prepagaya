import { ImageResponse } from 'next/og'
import { marcaDataUri } from '@/lib/marca'

// Ícono del panel (PWA) y logo de la organización en los datos estructurados
// de la home: la misma "P" del header, con el fondo lleno.
export async function GET() {
  return new ImageResponse(
    // eslint-disable-next-line @next/next/no-img-element
    <img src={marcaDataUri('cuadrado')} width={192} height={192} alt="" />,
    { width: 192, height: 192 },
  )
}
