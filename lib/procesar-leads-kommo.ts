import { getDestinoLead, resolverDestino } from '@/lib/kommo'
import { reclamarLeadsPendientesDeKommo, marcarResultadoKommo, seguimientosVencidos, marcarSeguimientoAvisado } from '@/lib/db'
import { avisarLeadPorPush } from '@/lib/push'
import { mandarLeadPorEmail } from '@/lib/emailjs'
import { mandarLeadACrmAsesor, detalleOrigen } from '@/lib/crm-asesor'
import { devolverCupoMail, tomarCupoMail } from '@/lib/cupo-mail'
import { portalConfigurado, prepagaParaPortal, mandarAlPortal } from '@/lib/portal-asesores'
import { prepagas as listaPrepagas } from '@/lib/data/prepagas'

// Envío de los leads a Kommo (o al destino configurado en el panel), 1
// minuto y medio después de la última actividad de cada persona (Darío,
// 19-oct-2026; antes 3 minutos) — ver el porqué de la espera en lib/db.ts
// (guardarLead), pedido de Darío, 22-sep-2026.
//
// 19-oct-2026: antes lo corría un cron de Vercel cada minuto, que consultaba
// la base las 24 horas y agotó el cupo gratis de Neon (100 horas de cómputo
// por mes; la base nunca llegaba a apagarse). Ahora cada lead programa su
// propio envío desde app/api/leads (after + espera) y el cron
// queda cada 30 minutos como respaldo. Los dos usan esta función; la reserva
// de cada lead (reclamarLeadsPendientesDeKommo) evita mandarlo dos veces.
// Minutos sin actividad de la persona antes de mandar su lead
export const MINUTOS_ESPERA_KOMMO = 1.5

export async function procesarLeadsPendientesDeKommo(): Promise<{ procesados: number; ok: number; fallidos: number }> {
  const pendientes = await reclamarLeadsPendientesDeKommo(MINUTOS_ESPERA_KOMMO)
  if (!pendientes.length) return { procesados: 0, ok: 0, fallidos: 0 }
  const destinoConfigurado = await getDestinoLead()
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
    // En los mails, la fuente va con el origen completo (página, canal, partner y #id), igual que al CRM
    const fuenteMail = detalleOrigen(lead)
    const fecha = new Date(lead.creado_en).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })

    // Portal Asesores (25-oct-2026): si solo pidió prepagas que no son Swiss
    // ni OSDE, va al asesor de esa prepaga y no al CRM ni al cupo por mail.
    // Si el portal no responde, sigue el camino de siempre (no se pierde).
    const slugPortal = portalConfigurado() && !fuente.startsWith('prueba') ? prepagaParaPortal(prepaga) : null
    if (slugPortal && await mandarAlPortal(lead, slugPortal)) {
      await marcarResultadoKommo(lead.id, `Portal asesores: ${listaPrepagas.find((p) => p.slug === slugPortal)?.nombre ?? slugPortal}`, '')
      ok++
      continue
    }

    // Cupo diario por mail (pedido de Darío, 14-oct-2026): los primeros 3 leads de cada día van a un mail aparte y
    // en el panel quedan con su rótulo ("Dario B2"). Va antes del destino normal y no lo toca (ni avanza alternancias).
    // Los datos de prueba del cupo (fuente "prueba-cupo-mail") van siempre al mail y no gastan lugar del día
    const cupo = fuente.startsWith('prueba-cupo') ? await tomarCupoMail({ prueba: true }) : await tomarCupoMail()
    if (cupo) {
      try {
        await mandarLeadPorEmail({
          nombre, celular, email, prepaga, provincia, edades, fuente: fuenteMail, fecha,
          kommo_link: '', kommo_label: '', duplicado_banner: '', to: cupo.email,
        })
        await marcarResultadoKommo(lead.id, `Cupo mail: ${cupo.rotulo}`, '')
        ok++
        continue
      } catch (err) {
        // Si no salió, el lead no se pierde: sigue al destino de siempre y el lugar del cupo se devuelve
        await devolverCupoMail()
        console.error('[CRON-KOMMO] no salió el mail del cupo, lead', lead.id, ':', err)
      }
    }

    // Resuelto por lead, no antes del loop: los destinos "alternar-*" avanzan
    // el reparto 1 a 1 en cada llamado (pedido de Darío, 30-sep-2026).
    const destino = await resolverDestino(destinoConfigurado)

    // Destino "Otro mail" (pedido de Darío, 29-sep-2026) o el lado "mail" de
    // una alternancia: no toca Kommo para nada, va directo por EmailJS.
    // Envuelto en try/catch (1-oct-2026): sin esto, una falla acá tiraba todo
    // el cron abajo, y como reclamarLeadsPendientesDeKommo() siempre trae primero el
    // más viejo, el mismo lead trabado volvía a tirar el cron cada minuto sin
    // dejar pasar nunca a los que venían después en la cola.
    // CRM Asesor: desde el 22-oct-2026 es el único destino además del mail (ya no
    // se trabaja con Kommo; resolverDestino manda al CRM hasta los destinos viejos
    // de Kommo). Si el CRM falla, el lead no se pierde: sale por mail a Darío.
    if (destino.tipo === 'crm') {
      const r = await mandarLeadACrmAsesor(lead, destino.cuenta)
      const quien = destino.cuenta === 'gabriela' ? 'Gabriela' : 'Darío'
      if (r.ok) {
        await marcarResultadoKommo(lead.id, `OK (CRM ${quien})`, '')
        ok++
      } else {
        await marcarResultadoKommo(lead.id, `Error CRM ${quien}: ${r.error ?? 'sin detalle'}`, '')
        try {
          // Ya no se trabaja con Kommo (22-oct-2026): el mail de respaldo va sin link para cargarlo ahí
          await mandarLeadPorEmail({
            nombre, celular, email, prepaga, provincia, edades, fuente: fuenteMail, fecha,
            kommo_link: '', kommo_label: '', duplicado_banner: '',
          })
        } catch (err) {
          console.error('[CRON-KOMMO] tampoco salió el mail de respaldo, lead', lead.id, ':', err)
        }
        fallidos++
        console.error('[CRON-KOMMO] no se pudo cargar en el CRM Asesor, lead', lead.id, ':', r.error)
      }
      continue
    }

    if (destino.tipo === 'email') {
      try {
        await mandarLeadPorEmail({
          nombre, celular, email, prepaga, provincia, edades, fuente: fuenteMail, fecha,
          kommo_link: '', kommo_label: '', duplicado_banner: '', to: destino.email,
        })
        await marcarResultadoKommo(lead.id, `Email directo a ${destino.email}`, '')
        ok++
      } catch (err) {
        await marcarResultadoKommo(lead.id, `Error: ${err}`, '')
        fallidos++
        console.error('[CRON-KOMMO] error mandando email directo, lead', lead.id, ':', err)
      }
    }
  }

  return { procesados: pendientes.length, ok, fallidos }
}

/** Recordatorios de seguimiento del panel (23-sep-2026), por push. */
export async function avisarSeguimientosVencidos(): Promise<number> {
  const vencidos = await seguimientosVencidos()
  for (const l of vencidos) {
    await avisarLeadPorPush('PrepagaYa — Seguimiento', `Volver a contactar a ${l.nombre}${l.notas ? ` · ${l.notas.slice(0, 80)}` : ''}`)
    await marcarSeguimientoAvisado(l.id)
  }
  return vencidos.length
}
