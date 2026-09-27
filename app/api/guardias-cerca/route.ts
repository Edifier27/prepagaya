import { NextResponse } from 'next/server'
import { datosGuardias } from '@/lib/data/guardias-cerca'

// Datos de "¿Dónde me atiendo?" (components/herramientas/GuardiasCerca.tsx).
// Estático: se genera en el build y el navegador lo baja al abrir la página.
export const dynamic = 'force-static'

export async function GET() {
  return NextResponse.json(datosGuardias())
}
