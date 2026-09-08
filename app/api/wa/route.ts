import { NextRequest, NextResponse } from 'next/server'

// El número real del asesor vive SOLO acá (server-only, nunca se manda al
// bundle del navegador). Todo botón de "hablar por WhatsApp" del sitio pasa
// por este redirect en vez de armar el link wa.me directo en el cliente —
// así el celular de Darío no aparece en ningún código fuente visible desde
// afuera (pedido explícito, 8-sep-2026).
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER ?? '5491134142247'

export async function GET(req: NextRequest) {
  const mensaje = req.nextUrl.searchParams.get('m') ?? 'Hola! Quiero asesoramiento sobre prepagas.'
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
  return NextResponse.redirect(url)
}
