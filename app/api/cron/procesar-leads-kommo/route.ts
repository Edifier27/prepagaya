import { NextRequest, NextResponse } from 'next/server'
import { procesarLeadsPendientesDeKommo, avisarSeguimientosVencidos } from '@/lib/procesar-leads-kommo'

// Hasta 50 leads por corrida, cada uno con su propio llamado a Kommo — con
// Vercel Pro el límite de duración sube bastante del default de Hobby, pero
// igual le ponemos un techo explícito por las dudas.
export const maxDuration = 60

// Cron de Vercel de respaldo (ver vercel.json — cada 30 minutos desde el
// 19-oct-2026; antes cada minuto, y eso agotó el cupo gratis de la base).
// El envío normal lo programa cada lead en app/api/leads, 3 minutos después;
// este cron levanta los que hayan quedado (por ejemplo, si ese envío se
// cortó) y manda los recordatorios de seguimiento del panel. La lógica está
// en lib/procesar-leads-kommo.ts.
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

  const r = await procesarLeadsPendientesDeKommo()
  const recordatorios = await avisarSeguimientosVencidos()
  return NextResponse.json({ ...r, recordatorios })
}
