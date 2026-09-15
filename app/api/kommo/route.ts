import { NextRequest, NextResponse } from 'next/server'
import { crearLeadEnKommo, kommoLeadUrl, verificarKommoLink, type KommoLeadData } from '@/lib/kommo'

// Nota: crearLeadEnKommo ya decide sola a qué cuenta (Darío/Gabriela) va el
// lead — reparto automático si es alguien nuevo, o la cuenta del contacto
// existente si ya estaba cargado (ver lib/kommo.ts).

// GET porque lo dispara el botón del mail (un link, no puede mandar un POST
// con body). Ver lib/kommo.ts para el porqué de la firma HMAC.

function paginaError(mensaje: string): string {
  return `<!doctype html><html lang="es-AR"><head><meta charset="utf-8"><title>PrepagaYa — Kommo</title>
<style>body{font-family:system-ui,sans-serif;background:#FAFAFA;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:24px}
.card{max-width:420px;background:#fff;border:1px solid #eee;border-radius:16px;padding:32px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,.06)}
h1{font-size:18px;color:#1f2937;margin:0 0 8px}p{color:#6b7280;font-size:14px;line-height:1.5;margin:0}</style></head>
<body><div class="card"><h1>No se pudo cargar el lead en Kommo</h1><p>${mensaje}</p></div></body></html>`
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const datos: KommoLeadData = {
    nombre:    sp.get('nombre') ?? '',
    celular:   sp.get('celular') ?? '',
    email:     sp.get('email') ?? '',
    interes:   sp.get('interes') ?? '',
    provincia: sp.get('provincia') ?? '',
    edades:    sp.get('edades') ?? '',
    fuente:    sp.get('fuente') ?? '',
    fecha:     sp.get('fecha') ?? '',
    ts:        sp.get('ts') ?? '',
  }
  const sig = sp.get('sig') ?? ''

  const verificacion = verificarKommoLink(datos, sig)
  if (!verificacion.ok) {
    const mensaje = verificacion.motivo === 'vencido'
      ? 'Este link de mail ya venció (son válidos 90 días). Cargá el lead a mano en Kommo.'
      : 'El link no es válido. Si lo copiaste de otro lado, pedí que te reenvíen el mail original.'
    console.error('[KOMMO] link rechazado:', verificacion.motivo)
    return new NextResponse(paginaError(mensaje), { status: 403, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  }

  const resultado = await crearLeadEnKommo(datos)
  if (!resultado.ok || !resultado.leadId || !resultado.cuenta) {
    console.error('[KOMMO] error creando el lead:', resultado.error)
    return new NextResponse(paginaError('Hubo un error de conexión con Kommo. Probá de nuevo en unos minutos.'), {
      status: 502,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  return NextResponse.redirect(kommoLeadUrl(resultado.cuenta, resultado.leadId))
}
