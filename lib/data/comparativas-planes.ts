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
    respuestaCorta: 'Si tenés entre 18 y 35 años, el Flux es la mejor opción: cuesta menos que el 210, no tiene copago y suma psicología ilimitada. Si tenés 36 años o más, no podés elegir Flux — el 210 queda como la puerta de entrada a OSDE.',
    veredicto: 'No es una comparación de "mejor vs peor" sino de elegibilidad por edad. El Flux es exclusivo para socios de 18 a 35 años y, dentro de ese rango, no tiene punto de comparación real con el 210: cuesta menos, no tiene copago en consultas y agrega psicología ilimitada, anticonceptivos al 100% y asistencia al viajero en países limítrofes. El Plan 210 tiene copago y es más caro, pero es la única puerta de entrada a OSDE para quienes ya pasaron los 35 años (o para grupos familiares con integrantes fuera de ese rango, que no pueden anotarse todos en Flux).',
    faqExtra: [
      {
        q: '¿Por qué el Plan Flux es más barato que el 210 si tiene más cobertura?',
        a: 'Porque OSDE lo pensó como plan de captación para socios jóvenes (18 a 35 años): al ser un perfil que estadísticamente usa menos el sistema de salud, la prepaga puede ofrecer una cuota más baja con beneficios pensados para esa etapa (psicología ilimitada, anticonceptivos, asistencia al viajero) sin copago.',
      },
      {
        q: '¿Puedo pasar del Plan Flux al 210 cuando cumpla 36 años?',
        a: 'Sí, es el camino habitual: al superar el límite de edad del Flux, OSDE reubica al afiliado en un plan sin restricción etaria como el 210 (o uno superior, según lo que quieras pagar). Consultalo con un asesor antes de que se acerque la fecha para planificar el cambio de cuota.',
      },
      {
        q: '¿El Plan Flux cubre lo mismo que el 210 en internación y urgencias?',
        a: 'Sí, ambos acceden a la misma red de OSDE (más de 125.000 prestadores, según OSDE) y a la cobertura base de internación y urgencias de OSDE. La diferencia está en los adicionales (psicología ilimitada, anticonceptivos 100%, asistencia al viajero en el Flux) y en que el 210 tiene copago en consultas y el Flux no.',
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
