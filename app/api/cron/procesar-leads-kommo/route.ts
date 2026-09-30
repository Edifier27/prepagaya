import { NextRequest, NextResponse } from 'next/server'
import { SITE_URL } from '@/lib/utils'
import { buildKommoLink, crearLeadEnKommo, getDestinoLead, kommoLeadUrl, nombreCuenta } from '@/lib/kommo'
import { leadsPendientesDeKommo, marcarResultadoKommo, seguimientosVencidos, marcarSeguimientoAvisado } from '@/lib/db'
import { avisarLeadPorPush } from '@/lib/push'
import { mandarLeadPorEmail } from '@/lib/emailjs'

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

export async function GET(req: NextRequest) {
  if (CRON_SECRET) {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
  }

  const pendientes = await leadsPendientesDeKommo(3)
  const destino = await getDestinoLead()
  let ok = 0
  let fallidos = 0

  for (const lead of pendientes) {
    const nombre = lead.nombre
    const celular = lead.celular ?? ''
    const email = lead.email ?? ''
    const prepaga = lead.prepaga ?? ''
    // Si la persona no pasó por el wizard (no dio su provincia a mano), usamos
    // la zona aproximada por IP que ya se guarda para todos los formularios
    // (lib/geo-zonas.ts vía app/api/leads/route.ts) — así a Kommo le llega una
    // zona igual, sin haberle preguntado nada (pedido de Darío, 30-sep-2026).
    const provincia = lead.provincia || lead.zona_detectada || ''
    const edades = lead.edades ?? ''
    const fuente = lead.fuente ?? 'web'
    const fecha = new Date(lead.creado_en).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
    const pais = lead.pais ?? undefined

    // Destino "Otro mail" (pedido de Darío, 29-sep-2026): no toca Kommo para
    // nada, va directo por EmailJS a la dirección configurada en el panel.
    if (destino.tipo === 'email') {
      await mandarLeadPorEmail({
        nombre, celular, email, prepaga, provincia, edades, fuente, fecha,
        kommo_link: '', kommo_label: '', duplicado_banner: '', to: destino.email,
      })
      await marcarResultadoKommo(lead.id, `Email directo a ${destino.email}`, '')
      ok++
      continue
    }

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
        await mandarLeadPorEmail({
          nombre, celular, email, prepaga, provincia, edades, fuente, fecha,
          kommo_link, kommo_label: 'Cargar en Kommo', duplicado_banner: '',
        })
        fallidos++
        console.error('[CRON-KOMMO] no se pudo cargar en Kommo, lead', lead.id, ':', resultado.error)
      }
    } catch (err) {
      const kommo_link = buildKommoLink(SITE_URL, { nombre, celular, email, interes: prepaga, provincia, edades, fuente, fecha, pais })
      await marcarResultadoKommo(lead.id, `Error: ${err}`, '')
      await mandarLeadPorEmail({
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
