import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { detectarZona, COOKIE_ZONA_GEO } from '@/lib/geo-zonas'

// Detecta la zona del visitante a partir de los headers de geolocalización
// por IP que agrega Vercel Edge Network (x-vercel-ip-*) y la deja en una
// cookie para que los componentes cliente (ZonaBanner, ComparadorWizard) la
// lean después de hidratar. A propósito NO se expone vía header a los
// Server Components: eso forzaría renderizado dinámico en el home y otras
// páginas que hoy son 100% estáticas.
// No se usa para elegir contenido distinto para Google: Googlebot rastrea
// desde IPs sin geolocalización argentina, así que siempre ve la versión
// default — esto es personalización del lado del cliente, no cloaking.
export function middleware(request: NextRequest) {
  const region = request.headers.get('x-vercel-ip-country-region')
  const ciudad = request.headers.get('x-vercel-ip-city')
  const zona = detectarZona(region, ciudad)

  const response = NextResponse.next()
  if (zona) {
    response.cookies.set(COOKIE_ZONA_GEO, encodeURIComponent(JSON.stringify(zona)), {
      maxAge: 60 * 60 * 24, // 1 día — la IP puede cambiar (wifi/datos), no persistir de más
      path: '/',
      sameSite: 'lax',
    })
  }
  return response
}

export const config = {
  matcher: [
    // Corre en todo excepto assets estáticos y archivos de Next internos.
    '/((?!_next/static|_next/image|favicon|logos|icon).*)',
  ],
}
