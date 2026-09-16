import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { detectarZona } from '@/lib/geo-zonas'

// Endpoint temporal de diagnóstico: muestra qué headers de geolocalización
// manda Vercel para la IP real de quien lo visita, y qué zona calculamos con
// eso. Sirve para depurar sin adivinar — borrar una vez resuelto.
export async function GET(request: NextRequest) {
  const region = request.headers.get('x-vercel-ip-country-region')
  const ciudad = request.headers.get('x-vercel-ip-city')
  const pais = request.headers.get('x-vercel-ip-country')
  const lat = request.headers.get('x-vercel-ip-latitude')
  const lon = request.headers.get('x-vercel-ip-longitude')

  return NextResponse.json({
    headers_recibidos: {
      'x-vercel-ip-country': pais,
      'x-vercel-ip-country-region': region,
      'x-vercel-ip-city': ciudad,
      'x-vercel-ip-latitude': lat,
      'x-vercel-ip-longitude': lon,
    },
    zona_calculada: detectarZona(region, ciudad),
  }, { headers: { 'Cache-Control': 'no-store' } })
}
