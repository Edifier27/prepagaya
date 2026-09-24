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
  medife: {
    fuente: 'https://www.medife.com.ar/canales-de-contacto',
    canales: [
      { tipo: 'emergencias', etiqueta: 'Urgencias y emergencias', valor: '0800-333-0075' },
      { tipo: 'socios', etiqueta: 'Atención al cliente', valor: '0800-333-2700', detalle: 'Todos los días, las 24 horas' },
      { tipo: 'whatsapp', etiqueta: 'WhatsApp', valor: '11 2242-0091', detalle: 'Todos los días, de 8 a 22' },
      { tipo: 'ventas', etiqueta: 'Asociarse', valor: '0810-122-0400' },
    ],
  },
  galeno: {
    fuente: 'https://www.galeno.com.ar/servicios/te-acercamos-todos-los-medios-de-contacto-disponibles/',
    canales: [
      { tipo: 'emergencias', etiqueta: 'Riesgo de vida CABA y GBA', valor: '4321-3888' },
      { tipo: 'emergencias', etiqueta: 'Riesgo de vida interior del país', valor: '0810-999-8743' },
      { tipo: 'socios', etiqueta: 'Call center', valor: '0810-999-7828 (SUCURSAL)', detalle: 'Lunes a viernes de 9 a 18' },
      { tipo: 'whatsapp', etiqueta: 'WhatsApp atención al cliente', valor: '11 6163-0000', detalle: 'Con tu número de socio y DNI' },
      { tipo: 'otro', etiqueta: 'Medicación especial', valor: '0800-777-6633', detalle: 'Lunes a viernes de 10 a 17' },
    ],
  },
  omint: {
    fuente: 'https://www.omint.com.ar/PlanDeSalud/CanalesAtencion',
    canales: [
      { tipo: 'emergencias', etiqueta: 'Emergencias / riesgo de vida', valor: '0800-888-66468' },
      { tipo: 'socios', etiqueta: 'Atención al socio', valor: '(011) 4808-2090 / 0810-999-3876', detalle: 'Lunes a viernes de 8 a 20' },
      { tipo: 'whatsapp', etiqueta: 'WhatsApp', valor: '11 6434-8039', detalle: 'Lunes a viernes de 9 a 17' },
      { tipo: 'ventas', etiqueta: 'Atención comercial', valor: '0800-555-66468 (OMINT)' },
    ],
  },
  medicus: {
    fuente: 'https://medicus.com.ar/',
    canales: [
      { tipo: 'emergencias', etiqueta: 'Riesgo de vida', valor: '0800-999-2064 / 0800-888-8855' },
      { tipo: 'otro', etiqueta: 'Atención médica en domicilio', valor: '(011) 4129-5300', detalle: 'Opción 1' },
      { tipo: 'whatsapp', etiqueta: 'WhatsApp atención al cliente', valor: '11 5094-1119' },
      { tipo: 'otro', etiqueta: 'Autorizaciones (materiales)', valor: '0800-333-7624' },
    ],
  },
  'prevencion-salud': {
    fuente: 'https://www.prevencionsalud.com.ar/telefonos-numeros-utiles',
    canales: [
      { tipo: 'emergencias', etiqueta: 'Emergencias', valor: '0800-444-0000', detalle: 'Todos los días, las 24 horas' },
      { tipo: 'whatsapp', etiqueta: 'WhatsApp', valor: '3493 447302', detalle: 'Todos los días, las 24 horas' },
      { tipo: 'socios', etiqueta: 'Consultas generales', valor: '0810-888-0010', detalle: 'Lunes a viernes de 8 a 20' },
    ],
  },
  cemic: {
    fuente: 'https://www.cemic.edu.ar/',
    canales: [
      { tipo: 'emergencias', etiqueta: 'Consulta por emergencia', valor: '5299-1100' },
      { tipo: 'socios', etiqueta: 'Hospital Universitario sede Pombo de Rodríguez (Av. Cnel. Díaz 2423)', valor: '5299-1300' },
      { tipo: 'otro', etiqueta: 'Hospital Universitario sede Saavedra (Galván 4102)', valor: '5299-0100' },
    ],
  },
  'luis-pasteur': {
    fuente: 'https://www.oslpasteur.com.ar/portalHTML5/home.asp',
    canales: [
      { tipo: 'emergencias', etiqueta: 'Urgencias en CABA y GBA', valor: '(011) 4370-0800' },
      { tipo: 'emergencias', etiqueta: 'Urgencias a más de 100 km de CABA', valor: '0800-999-1700' },
      { tipo: 'socios', etiqueta: 'Centro de atención telefónica', valor: '(011) 4370-1000' },
      { tipo: 'turnos', etiqueta: 'Reserva de turnos', valor: '0800-222-1331' },
      { tipo: 'ventas', etiqueta: 'Comercial', valor: '0810-333-7278' },
    ],
  },
  hominis: {
    fuente: 'https://hominis.com.ar/',
    canales: [
      { tipo: 'emergencias', etiqueta: 'Urgencias y emergencias', valor: '4959-8228 / 4959-8777' },
      { tipo: 'socios', etiqueta: 'Centro de atención al socio', valor: '0810-999-1950' },
      { tipo: 'whatsapp', etiqueta: 'WhatsApp', valor: '+54 9 11 2838-1649' },
      { tipo: 'turnos', etiqueta: 'Turnos Sanatorio Güemes', valor: '4959-8700 / 4959-8300' },
    ],
  },
}
