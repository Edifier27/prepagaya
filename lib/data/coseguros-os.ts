// Coseguros que cobran las obras sociales (1-oct-2026). Desde la Resolución
// SSSalud 1926/2024 cada entidad fija sus coseguros (avisando con 30 días):
// la Superintendencia ya no los regula. Todo copiado de la publicación oficial
// de cada obra social, con su vigencia. Solo consulta y visita a domicilio,
// que son los que más se usan.

export interface CoseguroOs {
  fuente: string
  /** Desde cuándo rigen, como lo publica la obra social */
  vigencia: string
  /** Plan al que aplican, si la obra social tiene varios */
  plan?: string
  items: { concepto: string; valor: string }[]
}

export const COSEGUROS_OS: Record<string, CoseguroOs> = {
  osecac: {
    fuente: 'https://www.osecac.org.ar/Novedades/coseguros/',
    vigencia: '26 de octubre de 2026',
    items: [
      { concepto: 'Consulta con médico de familia o generalista', valor: '$12.500' },
      { concepto: 'Consulta con especialista', valor: '$19.950' },
      { concepto: 'Visita médica a domicilio', valor: '$31.500' },
      { concepto: 'Resonancia, tomografía o endoscopía', valor: '$30.000' },
    ],
  },
  ospe: {
    fuente: 'https://www.ospesalud.com.ar/quiero-afiliarme/valor-de-coseguros/',
    vigencia: '1 de mayo de 2026',
    plan: 'PMO',
    items: [
      { concepto: 'Consulta médica', valor: '$22.500' },
      { concepto: 'Visita a domicilio de día', valor: '$28.000' },
      { concepto: 'Visita a domicilio de noche', valor: '$40.000' },
    ],
  },
  osmata: {
    fuente: 'https://osmata.com.ar/atencion-en-domicilio-emergencias-y-urgencias/',
    vigencia: '1 de agosto de 2026',
    plan: 'PMO',
    items: [
      { concepto: 'Visita a domicilio de día, de 8 a 20 (5 a 64 años)', valor: '$29.700' },
      { concepto: 'Visita a domicilio de noche, de 20 a 8 (5 a 64 años)', valor: '$41.600' },
    ],
  },
  ospsip: {
    fuente: 'https://ospsip.org.ar/coseguros.php',
    vigencia: '1 de septiembre de 2026',
    items: [
      { concepto: 'Consulta con médico de familia, generalista o pediatra', valor: '$4.800' },
      { concepto: 'Consulta con especialista', valor: '$9.100' },
    ],
  },
  ospia: {
    fuente: 'https://www.ospia.org.ar/pdfs/ospia-coseguros-junio-2026.pdf',
    vigencia: '1 de junio de 2026',
    items: [
      { concepto: 'Consulta con médico de familia, generalista o pediatra', valor: '$6.000' },
      { concepto: 'Consulta con especialista', valor: '$12.000' },
      { concepto: 'Visita a domicilio de día', valor: '$25.000' },
      { concepto: 'Visita a domicilio de noche', valor: '$30.000' },
    ],
  },
  osmedica: {
    fuente: 'https://osmedica.com.ar/wp-content/uploads/2026/07/OSMEDICA-coseguros-agosto-2026.pdf',
    vigencia: 'agosto de 2026',
    items: [
      { concepto: 'Consulta con médico de familia o clínico', valor: '$11.000' },
      { concepto: 'Consulta con especialista', valor: '$17.000' },
      { concepto: 'Visita a domicilio de día', valor: '$25.000' },
      { concepto: 'Visita a domicilio de noche', valor: '$35.000' },
    ],
  },
  osdop: {
    fuente: 'https://www.osdop.org.ar/coseguros-actualizados/',
    vigencia: '1 de septiembre de 2026',
    items: [
      { concepto: 'Consulta médica', valor: '$11.700' },
      { concepto: 'Visita a domicilio de día', valor: '$17.000' },
      { concepto: 'Visita a domicilio de noche', valor: '$23.000' },
      { concepto: 'Estudio de alta complejidad', valor: '$60.000' },
    ],
  },
  ospat: {
    fuente: 'https://www.ospat.com.ar/wp-content/uploads/2026/08/COSEGUROS-OCTUBRE-2026-Nuevos-Valores.xlsx',
    vigencia: 'octubre de 2026',
    items: [
      { concepto: 'Consulta médica o teleconsulta', valor: '$7.324' },
    ],
  },
  ospacp: {
    fuente: 'https://ospacp.org.ar/wp-content/uploads/2026/06/COSEGUROS-OSPACP.pdf',
    vigencia: 'junio de 2026 (fecha de publicación)',
    items: [
      { concepto: 'Consulta con médico de familia, generalista o pediatra', valor: '$2.019' },
      { concepto: 'Consulta con especialista', valor: '$3.786' },
      { concepto: 'Visita a domicilio de día', valor: '$6.310' },
      { concepto: 'Visita a domicilio de noche', valor: '$8.834' },
    ],
  },
  osuomra: {
    fuente: 'https://osuomra.org.ar/wp-content/uploads/2025/09/VALORES-DE-COSEGUROS-ACTUALIZADOS-1-NOVIEMBRE-2025.xlsx',
    vigencia: '1 de noviembre de 2025 (último valor publicado)',
    items: [
      { concepto: 'Consulta con médico de cabecera', valor: '$3.400' },
      { concepto: 'Consulta con especialista', valor: '$8.000' },
      { concepto: 'Consulta con especialista, afiliados monotributistas', valor: '$30.000' },
    ],
  },
}

// Swiss Medical, folletos oficiales de cada plan (vigencia 09/2026, AMBA).
// SMG20: consultas, visitas a domicilio y estudios sin cargo (SC/ST/SL).
// S1: copago en consultas ($13.812), domicilio ($31.336) y guardia ($19.661).
export const SWISS_COPAGOS_VIGENCIA = '09/2026'
export const SWISS_S1_COPAGOS = [
  { concepto: 'Consulta', valor: '$13.812' },
  { concepto: 'Visita a domicilio', valor: '$31.336' },
  { concepto: 'Guardia', valor: '$19.661' },
]
