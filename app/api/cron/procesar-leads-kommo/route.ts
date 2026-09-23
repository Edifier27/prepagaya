import { NextRequest, NextResponse } from 'next/server'
import { whatsappLinkParaLead, SITE_URL } from '@/lib/utils'
import { buildKommoLink, crearLeadEnKommo, kommoLeadUrl, nombreCuenta } from '@/lib/kommo'
import { leadsPendientesDeKommo, marcarResultadoKommo, seguimientosVencidos, marcarSeguimientoAvisado } from '@/lib/db'
import { avisarLeadPorPush } from '@/lib/push'

// Hasta 50 leads por corrida, cada uno con su propio llamado a Kommo — con
// Vercel Pro el límite de duración sube bastante del default de Hobby, pero
// igual le ponemos un techo explícito por las dudas.
export const maxDuration = 60

// Cron de Vercel (ver vercel.json — corre cada 1 minuto, requiere Vercel Pro
// para esa granularidad) que manda a Kommo los leads que llevan 3+ minutos
// sin actividad nueva de esa misma persona. Ver el porqué del delay en
// lib/db.ts (guardarLead) — pedido de Darío, 22-sep-2026.
//
// Vercel firma sus propias invocaciones de cron con este header; si alguien
// más le pega a esta URL sin el secreto, se rechaza. Sin CRON_SECRET
// configurado no hay chequeo (mismo criterio permisivo que el resto de las
// integraciones opcionales del sitio).
const CRON_SECRET = process.env.CRON_SECRET ?? ''

// Mismas credenciales EmailJS que usaba antes app/api/leads/route.ts — acá
// es donde ahora vive el fallback, porque recién acá sabemos si Kommo
// falló de verdad (antes se sabía al toque; con el delay, se sabe cuando
// corre este cron).
const EMAILJS_SERVICE_ID  = process.env.EMAILJS_SERVICE_ID  ?? 'PREPAGAYA'
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID ?? 'template_8p5ihaj'
const EMAILJS_PUBLIC_KEY  = process.env.EMAILJS_PUBLIC_KEY  ?? 'lVlSZHupNk1R5ZDES'
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY ?? ''

function bannerDuplicado(cuenta: string): string {
  return `<tr><td style="padding:16px 32px 0 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FEF3C7;border:1px solid #FDE68A;border-radius:12px;"><tr><td style="padding:14px 18px;"><span style="display:block;font-size:13px;font-weight:700;color:#92400E;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">⚠️ Ya es un contacto en Kommo (cuenta de ${cuenta})</span><span style="display:block;font-size:12px;color:#92400E;margin-top:4px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">Puede que ya lo hayas contactado antes — revisá el historial en Kommo antes de escribirle de nuevo.</span></td></tr></table></td></tr>`
}

async function mandarEmailFallback(d: {
  nombre: string; celular: string; email: string; prepaga: string
  provincia: string; edades: string; fuente: string; fecha: string
  kommo_link: string; kommo_label: string; duplicado_banner: string
}) {
  if (!EMAILJS_PRIVATE_KEY) {
    console.error('[CRON-KOMMO] Falta EMAILJS_PRIVATE_KEY — EmailJS va a rechazar el envío (modo estricto).')
  }
  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id:  EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id:     EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PRIVATE_KEY,
        template_params: {
          name:      d.nombre,
          email:     d.email.toLowerCase(),
          celular:   d.celular || 'No informado',
          prepaga:   d.prepaga || 'No especificada',
          zona:      d.provincia || 'No especificada',
          edades:    d.edades || 'No especificado',
          fuente:    d.fuente,
          fecha:     d.fecha,
          whatsapp_link: d.celular ? whatsappLinkParaLead(d.nombre, d.celular) : '',
          kommo_link: d.kommo_link,
          kommo_label: d.kommo_label,
          duplicado_banner: d.duplicado_banner,
        },
      }),
    })
    if (!res.ok) console.error('[CRON-KOMMO] EmailJS error:', res.status, await res.text().catch(() => ''))
  } catch (err) {
    console.error('[CRON-KOMMO] EmailJS fetch error:', err)
  }
}

export async function GET(req: NextRequest) {
  if (CRON_SECRET) {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
  }

  const pendientes = await leadsPendientesDeKommo(3)
  let ok = 0
  let fallidos = 0

  for (const lead of pendientes) {
    const nombre = lead.nombre
    const celular = lead.celular ?? ''
    const email = lead.email ?? ''
    const prepaga = lead.prepaga ?? ''
    const provincia = lead.provincia ?? ''
    const edades = lead.edades ?? ''
    const fuente = lead.fuente ?? 'web'
    const fecha = new Date(lead.creado_en).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
    const pais = lead.pais ?? undefined

    try {
      const resultado = await crearLeadEnKommo({ nombre, celular, email, interes: prepaga, provincia, edades, fuente, fecha, ts: String(Date.now()), pais })
      if (resultado.ok && resultado.cuenta && resultado.leadId) {
        const cuentaDisplay = nombreCuenta(resultado.cuenta)
        const kommo_link = kommoLeadUrl(resultado.cuenta, resultado.leadId)
        await marcarResultadoKommo(lead.id, `OK (${cuentaDisplay})${resultado.duplicado ? ' — ya era contacto' : ''}`, kommo_link)
        ok++
      } else {
        const kommo_link = buildKommoLink(SITE_URL, { nombre, celular, email, interes: prepaga, provincia, edades, fuente, fecha, pais })
        await marcarResultadoKommo(lead.id, `Error: ${resultado.error ?? 'sin detalle'}`, '')
        await mandarEmailFallback({
          nombre, celular, email, prepaga, provincia, edades, fuente, fecha,
          kommo_link, kommo_label: 'Cargar en Kommo', duplicado_banner: '',
        })
        fallidos++
        console.error('[CRON-KOMMO] no se pudo cargar en Kommo, lead', lead.id, ':', resultado.error)
      }
    } catch (err) {
      const kommo_link = buildKommoLink(SITE_URL, { nombre, celular, email, interes: prepaga, provincia, edades, fuente, fecha, pais })
      await marcarResultadoKommo(lead.id, `Error: ${err}`, '')
      await mandarEmailFallback({
        nombre, celular, email, prepaga, provincia, edades, fuente, fecha,
        kommo_link, kommo_label: 'Cargar en Kommo', duplicado_banner: '',
      })
      fallidos++
      console.error('[CRON-KOMMO] error cargando en Kommo, lead', lead.id, ':', err)
    }
  }

  // Recordatorios de seguimiento del panel (23-sep-2026): se aprovecha este
  // mismo cron de cada minuto en vez de sumar otro.
  const vencidos = await seguimientosVencidos()
  for (const l of vencidos) {
    await avisarLeadPorPush('PrepagaYa — Seguimiento', `Volver a contactar a ${l.nombre}${l.notas ? ` · ${l.notas.slice(0, 80)}` : ''}`)
    await marcarSeguimientoAvisado(l.id)
  }

  return NextResponse.json({ procesados: pendientes.length, ok, fallidos, recordatorios: vencidos.length })
}
