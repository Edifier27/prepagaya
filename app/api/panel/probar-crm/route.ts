import { NextRequest, NextResponse } from 'next/server'
import { sesionValidaEnRequest } from '@/lib/panel-auth'
import { mandarLeadACrmAsesor, crmAsesorConfigurado } from '@/lib/crm-asesor'
import type { LeadRow } from '@/lib/db'

// "Probar conexión" del panel (7-oct-2026): manda un lead ficticio al CRM de
// Darío y al de Gabriela con la misma función que usa el cron, para confirmar
// la clave y la cuenta de destino sin activar ningún destino. El teléfono es
// de la serie de demo del CRM (5490000000…): la bienvenida no le llega a nadie.
export async function POST(req: NextRequest) {
  if (!sesionValidaEnRequest(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  if (!crmAsesorConfigurado()) {
    return NextResponse.json({ error: 'Falta CRM_ASESOR_URL o CRM_ASESOR_API_KEY en el servidor.' }, { status: 400 })
  }
  const prueba = (cuenta: string, telefono: string) => ({
    nombre: `PRUEBA PrepagaYa (${cuenta}) - borrar`,
    celular: telefono,
    email: null,
    prepaga: 'Swiss Medical',
    provincia: 'CABA',
    edades: '35',
    fuente: 'prueba-conexion',
    zona_detectada: null,
    situacion_laboral: null,
    presupuesto: null,
  }) as unknown as LeadRow

  const [dario, gabriela] = await Promise.all([
    mandarLeadACrmAsesor(prueba('Darío', '5490000000091'), 'dario'),
    mandarLeadACrmAsesor(prueba('Gabriela', '5490000000092'), 'gabriela'),
  ])
  return NextResponse.json({ dario, gabriela })
}
