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
      { concepto: 'Visita a domicilio de 8 a 20 (5 a 64 años)', valor: '$29.700' },
      { concepto: 'Visita a domicilio de 20 a 8 (5 a 64 años)', valor: '$41.600' },
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
