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

1. ~~IVA 21% vs 10,5%~~ **Resuelto**: es 10,5% siempre en salud (Darío). `IVA_PREPAGA` pasó a 0,105 y se corrigieron los textos de `/precios`, `/historial-precios`, la tabla por modalidad y la calculadora.
2. ~~Rating y cantidad de opiniones sin fuente~~ **Resuelto**: se sacaron `rating` y `cantidadOpiniones` de los datos y de todas las páginas (ficha, planes, ranking, listado, comparativas). La ficha muestra solo las reseñas reales de la base. **Queda la satisfacción (%)**: confirmar si tiene fuente.
3. ~~"+8.400 cotizaciones realizadas"~~ **Resuelto**: sale de la base (confirmado por Darío).
4. **`lang` de las páginas `/en`, `/ru` y `/zh`**: salen con `lang="es-AR"` porque el layout raíz es uno solo. Se arregla con layouts raíz por idioma (grupos de rutas). Impacto bajo en Google, mayor en accesibilidad.
5. **`middleware.ts` → `proxy.ts`**: Next 16 lo marca como deprecado en el build. No afecta SEO hoy.
6. **Descripciones largas en las plantillas de cola larga** (cartillas por zona, localidades, sanatorios): ~1.080 páginas pasan los 160 caracteres. Google las corta; no es un problema de ranking.
7. **Códigos AFIP/ARCA de Avalian y Premedic**: cargados OSDE (400800) y Sancor (902108) con la fuente oficial de la SSSalud. Avalian y Premedic no aparecen en ninguna fuente accesible desde el entorno (mediflow.com.ar y sssalud.gob.ar están bloqueados por la red).
8. **Monotributo por prepaga**: para sumar "¿Puedo pagar [prepaga] con el monotributo?" a cada ficha hace falta confirmar, por prepaga, si acepta derivar el aporte de obra social del monotributo y cómo se calcula la diferencia.
9. **Datos de referencia de Omint, Medicus y CEMIC**: sus precios no salen del cuadro oficial (figuran como referencia) y sus descripciones tienen cifras sin fuente citada (ej. Medicus "87% satisfacción", "11 centros propios"). Conviene mapear sus cuadros de la SSSalud como con el resto.
10. **Beneficiarios en las fichas de obras sociales** (ej. OSDE 2.800.000, Medicus 450.000): confirmar la fuente o sacarlos, como se hizo con prestadores.

### Resuelto en la tanda del 24-sep (tarde)

- **Precios de monotributo inventados** en `/obras-sociales` (OSDE "$45.000", Galeno "$95.000", Medifé "$85.000"): ahora salen del cuadro oficial del mes. Los de obras sociales sin prepaga asociada pasan a "Cuota según plan y edad".
- **Contradicciones** en `/obras-sociales/osde` (90.000 profesionales vs los 125.000 que informa OSDE) y `/obras-sociales/swiss-medical-os` (11 sanatorios vs los 9 confirmados).
- **Comparativas**: en 10 de 27 el tilde de "más barata" quedaba al lado del precio más caro de la fila; ahora se calcula con el precio que muestra la tabla. Se reescribieron 10 veredictos que afirmaban cosas de precio contrarias al cuadro oficial y se sacaron porcentajes de satisfacción escritos a mano. Nuevas: Galeno vs OSDE, Omint vs OSDE, Medicus vs OSDE, Omint vs Swiss Medical y Premedic vs Avalian.
- **Leads**: se guardan situación laboral, presupuesto del quiz, cobertura actual (pregunta opcional después de enviar) y preferencias. Se ven en el panel y alimentan `/prensa/sondeo`.

## Siguientes pasos de contenido (por impacto)

1. **Sondeo propio**: la página `/prensa/sondeo` ya está armada y se calcula sola desde la base (solo agregados). Está en `noindex` hasta revisar los números: pasar `SONDEO_PUBLICADO` a `true` en `app/prensa/sondeo/page.tsx`.
2. **"[Prepaga] opiniones"**: la competencia rankea con "opiniones reales". Las reseñas de la base ya se muestran en la ficha: sumar una sección visible "Opiniones de afiliados" con H2 propio.
3. **Obras sociales para monotributistas**: es una de las búsquedas más grandes del rubro y MiObraSocial es fuerte ahí. Revisar que `/para/monotributistas` cubra "obra social monotributo" (listado de obras sociales que aceptan monotributistas y cómo elegir).
4. **Video**: ElegiMejor tiene canal de YouTube. Un video corto mensual con el aumento del mes, embebido en `/aumentos`, suma presencia en Google Videos y en YouTube.
