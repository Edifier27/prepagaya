// "¿A cuál cambiarte?" — recomendaciones de switch entre prepagas, basadas en
// precios reales de lib/data/prepagas.ts (no estimaciones). Cada entrada compara
// el plan sin-copago/red-abierta más representativo de la prepaga de origen
// contra el destino, con el delta de precio calculado, no redondeado a ojo.
// Actualizar cuando cambien los precios de lista (PRECIO_ACTUALIZADO).

export interface CambioRecomendado {
  slug: string
  origenSlug: string
  origenNombre: string
  origenPlanNombre: string
  origenPrecio: number
  destinoSlug: string
  destinoNombre: string
  destinoPlanSlug: string
  destinoPlanNombre: string
  destinoPrecio: number
  // Positivo = ahorrás cambiándote; negativo = pagás un poco más.
  deltaMensual: number
  gancho: string
  razon: string
  paraQuienNo: string // honestidad: cuándo este cambio NO conviene
}

export const cambiosRecomendados: CambioRecomendado[] = [
  {
    slug: 'osde-a-swiss-medical',
    origenSlug: 'osde',
    origenNombre: 'OSDE',
    origenPlanNombre: 'Plan 310',
    origenPrecio: 345310,
    destinoSlug: 'swiss-medical',
    destinoNombre: 'Swiss Medical',
    destinoPlanSlug: 'smg20',
    destinoPlanNombre: 'Plan SMG20',
    destinoPrecio: 325467,
    deltaMensual: 345310 - 325467,
    gancho: 'Mismo nivel de cobertura, menos cuota',
    razon: 'El OSDE 310 y el Swiss Medical SMG20 están en la misma categoría: sin copago, red abierta, plan más elegido de cada empresa. La diferencia es que Swiss Medical suma 8 sanatorios propios (OSDE no tiene sanatorios propios, trabaja 100% con convenios) y sale $19.843 menos por mes. Si tu prioridad es no perder cartilla y bajar la cuota, es el cambio más directo del mercado.',
    paraQuienNo: 'Si usás específicamente el Hospital Alemán o necesitás la red nacional de 140.000 profesionales de OSDE fuera de las zonas donde Swiss Medical tiene centros propios, quedate en OSDE.',
  },
  {
    slug: 'sancor-salud-a-swiss-medical',
    origenSlug: 'sancor-salud',
    origenNombre: 'Sancor Salud',
    origenPlanNombre: 'Plan 1000',
    origenPrecio: 362701,
    destinoSlug: 'swiss-medical',
    destinoNombre: 'Swiss Medical',
    destinoPlanSlug: 'smg20',
    destinoPlanNombre: 'Plan SMG20',
    destinoPrecio: 325467,
    deltaMensual: 362701 - 325467,
    gancho: 'Pagás menos y subís de cartilla',
    razon: 'El Plan 1000 de Sancor cuesta $362.701 y no tiene sanatorios propios. El SMG20 de Swiss Medical cuesta $37.234 menos por mes y suma 8 sanatorios propios de primer nivel. Es habitual que las promociones de ingreso de Sancor terminen y el afiliado quede pagando más que un plan equivalente de Swiss — comparalo con tu recibo actual, no con el precio con el que entraste.',
    paraQuienNo: 'Si vivís en el interior productivo (Córdoba, Santa Fe, Entre Ríos) donde Sancor tiene cartilla más profunda que Swiss Medical, este cambio pierde sentido: quedate con Sancor o mirá otra regional local.',
  },
  {
    slug: 'avalian-a-swiss-medical',
    origenSlug: 'avalian',
    origenNombre: 'Avalian',
    origenPlanNombre: 'Plan Full',
    origenPrecio: 378200,
    destinoSlug: 'swiss-medical',
    destinoNombre: 'Swiss Medical',
    destinoPlanSlug: 'smg20',
    destinoPlanNombre: 'Plan SMG20',
    destinoPrecio: 325467,
    deltaMensual: 378200 - 325467,
    gancho: 'Menor cuota, más sanatorios propios',
    razon: 'El Plan Full de Avalian ($378.200) y el SMG20 de Swiss Medical ($325.467) cubren lo mismo — sin copago, red abierta — pero Swiss sale $52.733 menos por mes y con 8 sanatorios propios contra 5 de Avalian, todos concentrados en AMBA.',
    paraQuienNo: 'Si estás fuera de AMBA/GBA, Avalian declara cobertura en más de 24 provincias: verificá primero que Swiss Medical tenga cartilla real en tu ciudad antes de cambiarte.',
  },
  {
    slug: 'prevencion-salud-a-swiss-medical',
    origenSlug: 'prevencion-salud',
    origenNombre: 'Prevención Salud',
    origenPlanNombre: 'Plan Oro',
    origenPrecio: 340500,
    destinoSlug: 'swiss-medical',
    destinoNombre: 'Swiss Medical',
    destinoPlanSlug: 'smg20',
    destinoPlanNombre: 'Plan SMG20',
    destinoPrecio: 325467,
    deltaMensual: 340500 - 325467,
    gancho: 'Pagás menos por una cartilla más sólida',
    razon: 'El Plan Oro de Prevención Salud ($340.500) no tiene sanatorios propios. El SMG20 de Swiss Medical cuesta $15.033 menos y suma 8 centros propios, con mejor calificación de cartilla (5/5 contra 3/5) y más satisfacción declarada de afiliados.',
    paraQuienNo: 'Si valorás la atención personalizada y ya tenés un vínculo armado con prestadores de Prevención en tu zona, el ahorro es chico — evaluá si vale la pena mover todo el grupo familiar por $15.000/mes.',
  },
  {
    slug: 'medife-a-swiss-medical',
    origenSlug: 'medife',
    origenNombre: 'Medifé',
    origenPlanNombre: 'Plan Plata',
    origenPrecio: 309892,
    destinoSlug: 'swiss-medical',
    destinoNombre: 'Swiss Medical',
    destinoPlanSlug: 'smg20',
    destinoPlanNombre: 'Plan SMG20',
    destinoPrecio: 325467,
    deltaMensual: 309892 - 325467,
    gancho: 'Casi el mismo precio, una cartilla mucho más grande',
    razon: 'Este caso es distinto a los demás: el Plan Plata de Medifé ($309.892) ya es uno de los planes sin copago más baratos del mercado, así que no hay ahorro real cambiándose. Lo que sí hay es una diferencia de cartilla enorme para una diferencia de precio chica: por apenas $15.575 más por mes, el SMG20 de Swiss Medical suma 8 sanatorios propios contra el sanatorio único (Finochietto) de Medifé.',
    paraQuienNo: 'Si tu prioridad es el precio más bajo posible y no usás sanatorios de alta complejidad seguido, Medifé Plata sigue siendo una opción sólida — no hay ahorro cambiándote, solo más cartilla por un poco más de plata.',
  },
  {
    slug: 'omint-a-osde',
    origenSlug: 'omint',
    origenNombre: 'Omint',
    origenPlanNombre: 'Plan Global',
    origenPrecio: 437027,
    destinoSlug: 'osde',
    destinoNombre: 'OSDE',
    destinoPlanSlug: '310',
    destinoPlanNombre: 'Plan 310',
    destinoPrecio: 345310,
    deltaMensual: 437027 - 345310,
    gancho: 'Mucha más red por bastante menos plata',
    razon: 'El Plan Global de Omint cuesta $437.027 y su red está concentrada en 3 sanatorios propios de CABA/GBA (Bazterrica, Del Sol, Santa Isabel). El Plan 310 de OSDE cuesta $91.717 menos por mes y da acceso a una red de 140.000 profesionales en todo el país, incluido el Hospital Alemán.',
    paraQuienNo: 'Si elegiste Omint específicamente por sus 3 sanatorios propios o por la cobertura internacional incluida en todos los planes, OSDE no te da lo mismo — quedate en Omint.',
  },
]

export function getCambioBySlug(slug: string): CambioRecomendado | undefined {
  return cambiosRecomendados.find((c) => c.slug === slug)
}

export function getCambiosPorOrigen(origenSlug: string): CambioRecomendado[] {
  return cambiosRecomendados.filter((c) => c.origenSlug === origenSlug)
}
