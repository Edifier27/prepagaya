// Comparativas entre dos planes de la MISMA prepaga (a diferencia de
// comparativas.ts, que compara dos empresas distintas). Search Console
// muestra demanda real de este tipo de consulta ("osde flux vs osde 210",
// "diferencia entre osde 210 y flux") que no encaja en el modelo de
// comparativas.ts porque red/satisfacción son iguales para ambos planes.
export interface ComparativaPlanes {
  slug: string // segundo segmento de /prepagas/[prepagaSlug]/[slug]
  prepagaSlug: string
  plan1Slug: string
  plan2Slug: string
  titulo: string
  descripcion: string
  respuestaCorta: string
  veredicto: string
  faqExtra: { q: string; a: string }[]
}

export const comparativasPlanes: ComparativaPlanes[] = [
  {
    slug: 'flux-vs-210',
    prepagaSlug: 'osde',
    plan1Slug: 'flux',
    plan2Slug: '210',
    titulo: 'OSDE Flux vs OSDE 210: ¿cuál conviene?',
    descripcion: 'Comparamos el Plan Flux y el Plan 210 de OSDE en precio, copago y cobertura para saber cuál elegir según tu edad.',
    // 13-oct-2026: sin afirmaciones de precio del Flux — no figura en la lista
    // oficial de OSDE ante la SSSalud ni OSDE lo publica.
    respuestaCorta: 'El Flux es el plan joven de OSDE (pensado para 18 a 35 años). Según su página oficial suma psicología sin tope de sesiones, consultas médicas sin copago, ortodoncia, lentes y kinesiología, y asistencia al viajero en países limítrofes. Los anticonceptivos al 100% no son una diferencia: OSDE los cubre así en todos los planes. Su precio no figura en la lista oficial, así que conviene cotizarlo junto al 210.',
    veredicto: 'No es una comparación de "mejor vs peor" sino de a quién apunta cada plan. OSDE diseñó el Flux para personas de 18 a 35 años: su página oficial destaca psicología sin tope de sesiones, consultas sin copago, ortodoncia, placa de descanso, lentes recetados, kinesiología, chequeo anual, asistencia al viajero en países limítrofes y reintegros sin tope por factura. Según la prensa puede contratarlo cualquier edad, pero varios beneficios son solo para quienes tienen entre 18 y 35 años; la web oficial no fija una edad máxima, así que confirmalo al cotizar. El precio del Flux no está en la lista oficial: cotizá los dos para tu edad y compará. El 210 sí tiene precio oficial y sin límite de edad.',
    faqExtra: [
      {
        q: '¿Cuánto cuesta el Plan Flux comparado con el 210?',
        a: 'El 210 tiene precio de lista oficial declarado por OSDE ante la Superintendencia de Servicios de Salud (está arriba, para 30 años). El Flux no figura en esa lista ni OSDE publica su precio, así que se cotiza según tu edad. Cotizá los dos gratis y te pasamos la diferencia exacta.',
      },
      {
        q: '¿Puedo pasar del Plan Flux al 210 cuando cumpla 36 años?',
        a: 'OSDE no publica qué pasa con el Flux al cumplir 36 años. Lo que sí está en sus condiciones oficiales: la membresía de un año (SportClub, Vetify o Puramente) aplica a mayores de edad hasta 35 años y se mantiene mientras sigas siendo socio activo del plan. Antes de que se acerque esa fecha, consultá con OSDE o con un asesor si seguís en Flux o te pasan a otro plan, y cómo cambia la cuota.',
      },
      {
        q: '¿El Plan Flux cubre lo mismo que el 210 en internación y urgencias?',
        a: 'Ambos acceden a la red de OSDE (más de 125.000 prestadores, según OSDE). La diferencia que destaca OSDE en el Flux está en los adicionales: psicología sin tope de sesiones, consultas sin copago, asistencia al viajero en países limítrofes y los beneficios para jóvenes. Para internación y urgencias comparalos en el detalle de cada plan.',
      },
    ],
  },
]

export function getComparativaPlanes(prepagaSlug: string, slug: string): ComparativaPlanes | undefined {
  return comparativasPlanes.find((c) => c.prepagaSlug === prepagaSlug && c.slug === slug)
}

// Para linkear desde la ficha de un plan individual a la comparativa que lo incluye.
export function getComparativaParaPlan(prepagaSlug: string, planSlug: string): ComparativaPlanes | undefined {
  return comparativasPlanes.find(
    (c) => c.prepagaSlug === prepagaSlug && (c.plan1Slug === planSlug || c.plan2Slug === planSlug)
  )
}
