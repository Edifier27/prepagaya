// Perfiles de /para/[perfil] que tienen versión dedicada en otro idioma
// (silo PrepagaYa Internacional) — alimenta el hreflang recíproco y el link
// visible "¿Leés en inglés/ruso?" de cada página. Se agranda a medida que
// se suman páginas nuevas a los silos /en/ y /ru/.
export interface PerfilIdioma {
  codigo: 'en' | 'ru' | 'zh' | 'pt'
  etiqueta: string // texto del link visible, en el idioma de destino
  href: string
  /** false: solo el link visible, sin hreflang (la otra página no es su traducción y no la devuelve) */
  hreflang?: boolean
}

export const PERFIL_IDIOMAS: Record<string, PerfilIdioma[]> = {
  extranjeros: [
    { codigo: 'en', etiqueta: 'Reading this in English?', href: '/en/health-insurance-argentina' },
    { codigo: 'ru', etiqueta: 'Читаете по-русски?', href: '/ru/strahovanie-argentina' },
    { codigo: 'zh', etiqueta: '中文阅读?', href: '/zh/yiliao-baoxian-agenting' },
    { codigo: 'pt', etiqueta: 'Lê em português?', href: '/pt/plano-de-saude-argentina' },
  ],
  // Estudiantes extranjeros (26-nov-2026): la mayoría de las búsquedas de
  // "estudar medicina na argentina" son en portugués
  'estudiantes-extranjeros': [
    { codigo: 'pt', etiqueta: 'Lê em português?', href: '/pt/plano-de-saude-argentina', hreflang: false },
    { codigo: 'en', etiqueta: 'Reading this in English?', href: '/en/health-insurance-argentina#students', hreflang: false },
  ],
  embarazadas: [
    { codigo: 'ru', etiqueta: 'Читаете по-русски?', href: '/ru/strahovka-dlya-beremennyh' },
  ],
}
