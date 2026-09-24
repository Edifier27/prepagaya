// Delegaciones de la Superintendencia de Servicios de Salud, copiadas de
// argentina.gob.ar/sssalud/usuarios/delegaciones (leídas el 24-sep-2026 con la
// Action "Fuentes oficiales de trámites"). Ahí se hacen los trámites que no son
// online (unificación de aportes, denuncias) con turno. Se muestran en
// /obras-sociales/provincia/[prov]. `provincia` = nombre en lib/data/zonas.ts.

export interface DelegacionSSSalud {
  provincia: string
  localidad: string
  direccion: string
  horario?: string
  telefono?: string
}

export const DELEGACIONES_FUENTE = 'https://www.argentina.gob.ar/sssalud/usuarios/delegaciones'
export const DELEGACIONES_VERIFICADO = '2026-09-24'

/** Sede central y línea gratuita (atención telefónica de 8 a 16 h). */
export const SSSALUD_SEDE_CENTRAL: DelegacionSSSalud = { provincia: 'CABA', localidad: 'Ciudad de Buenos Aires', direccion: 'Bartolomé Mitre 434, planta baja', horario: '8:00 a 16:00 hs, con turno', telefono: '0800-222-72583' }
export const SSSALUD_0800 = '0800-222-72583'

export const DELEGACIONES_SSSALUD: DelegacionSSSalud[] = [
  SSSALUD_SEDE_CENTRAL,
  { provincia: 'Buenos Aires', localidad: 'Bahía Blanca', direccion: 'Vicente López 45', horario: '8:00 a 14:00 hs', telefono: '0291-487-6350' },
  { provincia: 'Buenos Aires', localidad: 'La Plata', direccion: 'Calle 8 Nº 1407 entre 61 y 62', horario: '8:00 a 14:00 hs', telefono: '011-3696-9184' },
  { provincia: 'Buenos Aires', localidad: 'Mar del Plata', direccion: '25 de Mayo 3139', horario: '8:00 a 14:00 hs', telefono: '0223-628-4209' },
  { provincia: 'Buenos Aires', localidad: 'Junín', direccion: '20 de Septiembre 174', horario: '8:00 a 14:00 hs' },
  { provincia: 'Catamarca', localidad: 'San Fernando del Valle de Catamarca', direccion: 'Maipú 477', horario: '7:00 a 13:00 hs', telefono: '0383-445-7755' },
  { provincia: 'Chaco', localidad: 'Resistencia', direccion: 'Juan Domingo Perón 290', horario: '7:00 a 13:00 hs', telefono: '0362-476-1821' },
  { provincia: 'Chubut', localidad: 'Comodoro Rivadavia', direccion: 'Carlos Pellegrini 555', horario: '8:00 a 14:00 hs', telefono: '0297-596-2855' },
  { provincia: 'Córdoba', localidad: 'Córdoba', direccion: '9 de Julio 360', horario: '8:00 a 14:00 hs' },
  { provincia: 'Corrientes', localidad: 'Corrientes', direccion: '25 de Mayo 1425', horario: '7:00 a 13:00 hs', telefono: '0379-443-3538' },
  { provincia: 'Entre Ríos', localidad: 'Paraná', direccion: 'Gral. José de San Martín 505', horario: '7:00 a 13:00 hs', telefono: '0343-484-0907' },
  { provincia: 'Formosa', localidad: 'Formosa', direccion: 'Brandsen 405/415', horario: '8:00 a 14:00 hs', telefono: '0370-443-8545' },
  { provincia: 'Jujuy', localidad: 'San Salvador de Jujuy', direccion: 'Sarmiento 455', horario: '8:00 a 14:00 hs', telefono: '0388-431-1815' },
  { provincia: 'La Pampa', localidad: 'Santa Rosa', direccion: 'Rivadavia 345', horario: '7:00 a 13:00 hs', telefono: '0295-442-1993' },
  { provincia: 'La Rioja', localidad: 'La Rioja', direccion: 'Dorrego 110', horario: '8:00 a 14:00 hs', telefono: '0380-442-2180' },
  { provincia: 'Mendoza', localidad: 'Mendoza', direccion: 'Av. España 1425, piso 6', horario: '8:00 a 14:00 hs' },
  { provincia: 'Misiones', localidad: 'Posadas', direccion: 'Junín 2331', horario: '8:00 a 14:00 hs', telefono: '0376-443-7548' },
  { provincia: 'Neuquén', localidad: 'Neuquén', direccion: 'Roca 664', horario: '8:00 a 14:00 hs' },
  { provincia: 'Río Negro', localidad: 'General Roca', direccion: 'Av. Roca 1968', horario: '8:00 a 14:00 hs', telefono: '0298-442-3820' },
  { provincia: 'Salta', localidad: 'Salta', direccion: 'Av. Belgrano 570', horario: '7:00 a 13:00 hs', telefono: '0387-495-4252' },
  { provincia: 'San Juan', localidad: 'San Juan', direccion: 'Santa Fe 179 (oeste)', horario: '7:00 a 13:00 hs', telefono: '0264-427-8043' },
  { provincia: 'Santa Cruz', localidad: 'Río Gallegos', direccion: 'Comodoro Rivadavia 255', horario: '8:00 a 14:00 hs', telefono: '02966-427-489' },
  { provincia: 'Santa Fe', localidad: 'Rosario', direccion: 'Mendoza 1035', horario: '8:00 a 14:00 hs' },
  { provincia: 'Santa Fe', localidad: 'Santa Fe', direccion: 'Obispo Gelabert 2964', horario: '8:00 a 14:00 hs', telefono: '0342-451-2414' },
  { provincia: 'Santiago del Estero', localidad: 'Santiago del Estero', direccion: 'Independencia 1549 (Delegación Sanitaria Federal)', horario: '8:00 a 14:00 hs', telefono: '03854-259990' },
  { provincia: 'Tucumán', localidad: 'San Miguel de Tucumán', direccion: 'Gral. Lamadrid 291', horario: '8:00 a 14:00 hs', telefono: '0381-420-7951' },
]

export function delegacionesEn(provincia: string): DelegacionSSSalud[] {
  return DELEGACIONES_SSSALUD.filter((d) => d.provincia === provincia)
}
