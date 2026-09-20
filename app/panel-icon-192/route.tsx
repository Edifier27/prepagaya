import { ImageResponse } from 'next/og'

// Ícono del panel instalado como PWA (mismo estilo que app/icon.tsx, más
// grande — 192x192 es el tamaño mínimo que piden Chrome/Android para el
// manifest de una app instalable).
export async function GET() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E8002D' }}>
        <div style={{ display: 'flex', fontFamily: 'sans-serif', fontWeight: 800, fontSize: '104px', color: 'white' }}>P</div>
      </div>
    ),
    { width: 192, height: 192 },
  )
}
