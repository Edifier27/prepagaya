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
          background: 'linear-gradient(135deg, #CCFBF1 0%, #D1FAE5 20%, #DBEAFE 45%, #E0E7FF 65%, #FCE7F3 85%, #FEF3C7 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* White fade at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '220px',
            background: 'linear-gradient(to top, rgba(255,255,255,0.95), transparent)',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '60px',
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                background: '#E8002D',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '32px',
                fontWeight: 900,
              }}
            >
              P
            </div>
            <span style={{ fontSize: '48px', fontWeight: 700, color: '#111827' }}>
              Prepaga<span style={{ color: '#E8002D' }}>Ya</span>
            </span>
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: '52px',
              fontWeight: 800,
              color: '#111827',
              textAlign: 'center',
              lineHeight: 1.15,
              marginBottom: '20px',
              maxWidth: '900px',
            }}
          >
            Comparador de Prepagas{' '}
            <span style={{ color: '#E8002D' }}>Argentina 2026</span>
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '26px',
              color: '#4B5563',
              textAlign: 'center',
              marginBottom: '40px',
              maxWidth: '700px',
            }}
          >
            Swiss Medical · OSDE · Sancor · CEMIC · Premedic · Medife
          </div>

          {/* Pills */}
          <div style={{ display: 'flex', gap: '16px' }}>
            {['Gratis', 'Sin registro', 'Precios actualizados'].map((label) => (
              <div
                key={label}
                style={{
                  background: 'white',
                  border: '2px solid #D1FAE5',
                  borderRadius: '999px',
                  padding: '10px 24px',
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#E8002D',
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
