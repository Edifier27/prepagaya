import { ImageResponse } from 'next/og'

export const alt = 'PrepagaYa — Comparador de Prepagas Argentina'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #E8002D 0%, #B8001F 100%)',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#E8002D',
              fontSize: '40px',
              fontWeight: 900,
            }}
          >
            P
          </div>
          <div style={{ display: 'flex', fontSize: '52px', fontWeight: 700, color: 'white' }}>
            Prepaga
            <span style={{ color: '#FECDD3' }}>Ya</span>
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: 'flex',
            fontSize: '56px',
            fontWeight: 800,
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.15,
            marginBottom: '20px',
            maxWidth: '960px',
          }}
        >
          Comparador de Prepagas Argentina 2026
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: 'flex',
            fontSize: '26px',
            color: '#FECDD3',
            textAlign: 'center',
            marginBottom: '44px',
          }}
        >
          Swiss Medical · OSDE · Sancor · CEMIC · Medifé · Omint
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: '16px' }}>
          {['Gratis', 'Sin registro', 'Precios actualizados'].map((label) => (
            <div
              key={label}
              style={{
                background: 'white',
                borderRadius: '999px',
                padding: '10px 28px',
                fontSize: '22px',
                fontWeight: 700,
                color: '#E8002D',
                display: 'flex',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  )
}
