import { ImageResponse } from 'next/og'

export async function GET() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E8002D' }}>
        <div style={{ display: 'flex', fontFamily: 'sans-serif', fontWeight: 800, fontSize: '280px', color: 'white' }}>P</div>
      </div>
    ),
    { width: 512, height: 512 },
  )
}
