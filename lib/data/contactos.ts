// Teléfonos y canales oficiales de atención de cada prepaga.
// Todo se copió de la web oficial de cada una (verificado el 23-sep-2026);
// no agregar números que no estén publicados por la propia prepaga.
// Solo se muestran en /prepagas/[slug] las prepagas que están acá.

export interface CanalContacto {
  tipo: 'emergencias' | 'socios' | 'whatsapp' | 'ventas' | 'turnos' | 'otro'
  etiqueta: string
  valor: string
  detalle?: string // horario u observación, tal como lo publica la prepaga
}

export interface ContactoPrepaga {
  canales: CanalContacto[]
  fuente: string
}

export const CONTACTOS_VERIFICADOS = '23 de septiembre de 2026'

export const contactos: Record<string, ContactoPrepaga> = {
  'swiss-medical': {
    fuente: 'https://www.swissmedical.com.ar/prepagaclientes/telefonos',
    canales: [
      { tipo: 'emergencias', etiqueta: 'Urgencias y emergencias médicas', valor: '0800-777-7800 / 4344-1500' },
      { tipo: 'whatsapp', etiqueta: 'Swity, asistente en WhatsApp', valor: '+54 9 11 5051-9982' },
      { tipo: 'socios', etiqueta: 'Información general', valor: '0800-555-7000' },
      { tipo: 'turnos', etiqueta: 'Turnos', valor: '0810-333-8876' },
      { tipo: 'ventas', etiqueta: 'Ventas', valor: '0810-333-2244' },
      { tipo: 'otro', etiqueta: 'Programas de prevención', valor: '0810-333-6800' },
    ],
  },
  osde: {
    fuente: 'https://www.osde.com.ar/contacto',
    canales: [
      { tipo: 'emergencias', etiqueta: 'Riesgo de vida', valor: '0810-666-1111' },
      { tipo: 'emergencias', etiqueta: 'Asistencia médica', valor: '0810-888-7788 / 0810-999-6300', detalle: 'WhatsApp: 11-4872-9100' },
      { tipo: 'socios', etiqueta: 'Atención al socio', valor: '0810-555-6733 / 0800-555-6733', detalle: 'Lunes a viernes de 9 a 20 h' },
      { tipo: 'whatsapp', etiqueta: 'WhatsApp atención al socio', valor: '11-4872-9000' },
    ],
  },
  premedic: {
    fuente: 'https://web.grupopremedic.com.ar/',
    canales: [
      { tipo: 'emergencias', etiqueta: 'Urgencias médicas', valor: '0810-888-3226' },
      { tipo: 'socios', etiqueta: 'Atención al cliente', valor: '0810-222-5522', detalle: 'Lunes a viernes de 8 a 20 h' },
      { tipo: 'whatsapp', etiqueta: 'WhatsApp atención general', valor: '+54 9 11 2264-7285', detalle: 'Lunes a viernes de 10 a 18 h' },
      { tipo: 'otro', etiqueta: 'Asistencia al viajero', valor: '0810-666-7676' },
    ],
  },
  avalian: {
    fuente: 'https://avalian.com/contacto',
    canales: [
      { tipo: 'emergencias', etiqueta: 'Emergencias', valor: '0800-555-5556' },
      { tipo: 'socios', etiqueta: 'Atención telefónica', valor: '0810-222-72583 (SALUD)' },
    ],
  },
  'sancor-salud': {
    fuente: 'https://sancorsalud.com.ar/contacto',
    canales: [
      { tipo: 'emergencias', etiqueta: 'Emergencias / médico a domicilio', valor: '0800-8888-733' },
      { tipo: 'socios', etiqueta: 'Asociados', valor: '0810-444-72583' },
      { tipo: 'whatsapp', etiqueta: 'WhatsApp', valor: 'Credencial, facturas y pedidos las 24 h', detalle: 'Atención personalizada de lunes a viernes de 8 a 17 h' },
    ],
  },
}
