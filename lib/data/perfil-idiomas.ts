// Perfiles de /para/[perfil] que tienen versión dedicada en otro idioma
// (silo PrepagaYa Internacional) — alimenta el hreflang recíproco y el link
// visible "¿Leés en inglés/ruso?" de cada página. Se agranda a medida que
// se suman páginas nuevas a los silos /en/ y /ru/.
export interface PerfilIdioma {
  codigo: 'en' | 'ru'
  etiqueta: string // texto del link visible, en el idioma de destino
  href: string
}

export const PERFIL_IDIOMAS: Record<string, PerfilIdioma[]> = {
  extranjeros: [
    { codigo: 'en', etiqueta: 'Reading this in English?', href: '/en/health-insurance-argentina' },
    { codigo: 'ru', etiqueta: 'Читаете по-русски?', href: '/ru/strahovanie-argentina' },
  ],
  embarazadas: [
    { codigo: 'ru', etiqueta: 'Читаете по-русски?', href: '/ru/strahovka-dlya-beremennyh' },
  ],
}
