import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

// Icono interino con la "P" de la marca mientras no tengamos el archivo del
// logo real de PrepagaYa. Reemplaza al triángulo default de create-next-app
// que nunca se había tocado. Circle chico con padding generoso para que no
// se vea "grande/tosco" dentro de la pestaña del navegador.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: '#E8002D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'sans-serif',
            fontWeight: 800,
            fontSize: '16px',
            color: 'white',
          }}
        >
          P
        </div>
      </div>
    ),
    { ...size },
  )
}
