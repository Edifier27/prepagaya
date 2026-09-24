# Auditoría SEO + UX — PrepagaYa

Fecha: 2026-09-24 · Método: build de producción local y rastreo de las 1.873 URLs del sitemap (título, descripción, H1, canonical, robots, JSON-LD, Open Graph, cantidad de palabras), capturas mobile y desktop, y comparación con MiObraSocial y ElegiMejor en los resultados de búsqueda.

## Diagnóstico general

El sitio está técnicamente sano (canonicals propios, 0 páginas noindex en el sitemap, JSON-LD válido, 1 H1 por página) y tiene más profundidad de contenido que la competencia: cartillas por zona, sanatorios, silo provincial y precios oficiales de la SSSalud.

La diferencia con MiObraSocial no es contenido: es **autoridad** (links de medios gracias a sus sondeos) y **marca**. Por eso el plan de links (`plan-backlinks.md`) es lo más importante de esta auditoría.

## Mapa de keywords (una página por intención)

| Intención | Tipo | Página |
|---|---|---|
| comparador de prepagas | Transaccional | `/` (H1 nuevo con la keyword) |
| cotizar prepaga online, cotizador de prepagas | Transaccional | `/comparador` (antes competía con el home con el mismo título) |
| prepagas argentina, medicina prepaga, listado | Transaccional / navegacional | `/prepagas` |
| precios prepagas [mes] | Transaccional | `/precios` |
| [prepaga] precios / cuánto sale [prepaga] | Transaccional | `/prepagas/[prepaga]` (H1 con "planes y precios") |
| [prepaga] [plan] | Transaccional | `/prepagas/[prepaga]/[plan]` |
| prepagas económicas / baratas | Transaccional | `/prepagas-economicas` (no estaba en el sitemap) |
| mejores prepagas, ranking | Comercial | `/ranking` |
| prepaga según presupuesto | Comercial | `/prepaga-por-presupuesto` (absorbe `/quiz`) |
| aumento prepagas [mes] | Informacional | `/aumentos` |
| cuánto cuesta una prepaga | Informacional | `/precios#cuanto-sale` |
| cartilla [prepaga] [zona] | Informacional / local | `/cartillas/...` |
| qué prepagas atienden en [sanatorio] | Informacional / local | `/sanatorios/[slug]` |
| PMO, carencia, derivar aportes, reclamos | Informacional | `/pmo`, `/guias/...` |

## Qué se corrigió en este cambio

**Técnico**
- `/coberturas/bariátrica` daba **404** y estaba en el sitemap: el slug con tilde no resolvía. Ahora es `/coberturas/cirugia-bariatrica`, con 301 desde las dos versiones viejas.
- **Faltaban en el sitemap** `/prepagas-economicas` (página de "prepagas económicas/baratas") y 9 de las 10 páginas para extranjeros (`/en`, `/ru`, `/zh`).
- `/quiz` y `/prepaga-por-presupuesto` eran **la misma página** (mismo quiz y casi el mismo texto): `/quiz` ahora redirige con 301 y los links del menú y del footer apuntan a la otra.
- Títulos con **la marca repetida** ("— PrepagaYa | PrepagaYa") en 5 páginas.
- **Títulos duplicados** en cartillas de zonas con el mismo nombre (San Pedro de Jujuy, Misiones y Pergamino; La Paz; Mercedes; Colón; zonas llamadas solo "alrededores"): ahora llevan la filial o la provincia.
- Páginas en ruso y chino con el mes **en inglés** en el título ("September 2026"): ahora "Сентябрь 2026" y "2026年9月".
- **133 páginas sin imagen al compartir** (guías, blog, comparativas, obras sociales, coberturas, condiciones, perfiles, PMO): al definir su propio `openGraph` pisaban la imagen general. Ahora la llevan.
- "1,243 opiniones" con formato en inglés: ahora "1.243".

**Contenido y datos**
- El **FAQ del home tenía precios de junio** ($107.044) que contradecían la tabla oficial ($90.938), y Google los mostraba como respuesta. Ahora se calcula con los mismos datos que `/precios` y se suma la pregunta del aumento del mes (dato oficial).
- El FAQ del home decía "Swiss Medical lidera con 76% de satisfacción" mientras la ficha dice 91%: ahora responde sin porcentajes, alineado con el ranking del sitio.
- El FAQ del home decía que la lista Deriva Aporte es "21% menos"; `/precios` dice que el IVA es 10,5%. Se sacó el porcentaje del home (ver pendientes).
- `/prepagas-economicas` decía "desde $109.000" fijo: ahora sale del dato del mes.
- `/prepaga-por-presupuesto` era la página más flaca del sitio (339 palabras): suma la tabla "qué prepaga podés pagar según tu presupuesto", con rangos que se calculan solos a partir de los precios oficiales.
- Descripciones del home, `/precios` y fichas de prepaga recortadas a ~160 caracteres.
- Menú: se suman `/ranking` y `/prepagas-economicas`. Footer: link a `/prensa` (no tenía ningún link en el sitio).

**Diseño (UX)**
- **Home en mobile: el cotizador quedaba entero debajo de la primera pantalla** (título + 3 pasos apilados). Ahora los pasos van en una fila compacta y el selector de provincia entra en la primera pantalla de un celular de 390×844.
- El home decía "Respondé 4 preguntas", pero el cotizador tiene 2 (zona y edades): texto corregido.

**Links**
- Widget embebible `/widget/aumentos` (noindex) con el aumento oficial por prepaga, y código para copiar en `/prensa`. Ver `plan-backlinks.md`.

## Pendientes que necesitan una decisión tuya

1. **IVA de la lista directa: ¿21% o 10,5%?** `lib/utils.ts` usa 21% (`IVA_PREPAGA`) para calcular el precio de relación de dependencia en el cotizador, y `/precios` dice 10,5%. Si es 10,5%, el cotizador está mostrando precios de relación de dependencia más bajos de lo real. No lo toqué porque cambia precios.
2. **Satisfacción, rating y cantidad de opiniones sin fuente.** `satisfaccion`, `rating` y `cantidadOpiniones` de `lib/data/prepagas.ts` no tienen fuente documentada (ej. Swiss "91%" y "4,2 (1.243 opiniones)"). En un sitio de salud, Google mira mucho la confiabilidad (E-E-A-T). Recomiendo lo mismo que se hizo con prestadores: mostrarlos solo con fuente, o reemplazarlos por las reseñas reales de la base (que ya alimentan el schema `AggregateRating`).
3. **"+8.400 cotizaciones realizadas"** en el home (desktop): confirmar que sale del CRM.
4. **`lang` de las páginas `/en`, `/ru` y `/zh`**: salen con `lang="es-AR"` porque el layout raíz es uno solo. Se arregla con layouts raíz por idioma (grupos de rutas). Impacto bajo en Google, mayor en accesibilidad.
5. **`middleware.ts` → `proxy.ts`**: Next 16 lo marca como deprecado en el build. No afecta SEO hoy.
6. **Descripciones largas en las plantillas de cola larga** (cartillas por zona, localidades, sanatorios): ~1.080 páginas pasan los 160 caracteres. Google las corta; no es un problema de ranking.

## Siguientes pasos de contenido (por impacto)

1. **Sondeo trimestral propio** con datos anónimos de las cotizaciones: es lo que le da los links a MiObraSocial (detalle en `plan-backlinks.md`).
2. **"[Prepaga] opiniones"**: la competencia rankea con "opiniones reales". Las reseñas de la base ya se muestran en la ficha: sumar una sección visible "Opiniones de afiliados" con H2 propio.
3. **Obras sociales para monotributistas**: es una de las búsquedas más grandes del rubro y MiObraSocial es fuerte ahí. Revisar que `/para/monotributistas` cubra "obra social monotributo" (listado de obras sociales que aceptan monotributistas y cómo elegir).
4. **Video**: ElegiMejor tiene canal de YouTube. Un video corto mensual con el aumento del mes, embebido en `/aumentos`, suma presencia en Google Videos y en YouTube.
