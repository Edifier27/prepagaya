# OSDE, Swiss Medical y Sancor: palabras nuevas, canibalización y enlaces internos (26-nov-2026)

Pedido de Darío: descubrir más palabras de OSDE, Swiss Medical y Sancor donde podamos posicionar, cuidando la canibalización y el interlinking.

## Fuentes y límites

- **Autocompletado de Google** (Argentina, español, 26-nov):
  - 579 consultas, con cada marca y cada plan más letras y preguntas ("cómo", "cuánto", "vs", "para");
  - salieron 1.333 variantes de OSDE, 692 de Swiss y 574 de Sancor;
  - el autocompletado muestra cómo se busca, no cuánto.
- **Search Console**: export del 22-nov (3 meses hasta el 20-nov), solo las 1.000 consultas con más clics. Que una variante no aparezca no prueba que no tengamos impresiones.
- **Inventario del sitio**: sacado de `app/sitemap.ts`: 381 URLs con OSDE, 322 con Swiss y 224 con Sancor.
- **Sin volúmenes**: Ahrefs no los da con el plan actual y la prueba de Supermetrics venció.
- **Pruebas de título en curso** hasta el 21-dic (`pruebas-titulos-2026-11-23.md`):
  - en prueba: OSDE 410 y 510, /ranking y SMG20;
  - de control: OSDE 210, OSDE 310 y la ficha de Swiss.
  - **Esas 7 páginas no se tocan hasta el 21-dic**, ni el texto ni los enlaces.

## Lo que dicen los datos

Variantes por intención, cruzadas con Search Console:

| Intención | OSDE | Swiss | Sancor | Qué es |
|---|---|---|---|---|
| Cartilla y prestadores | 214 | 101 | 84 | Ya trabajado: la intención más grande en Search Console (OSDE 35.121 impresiones, Swiss 16.765) |
| Marca + ciudad | 59 | 53 | 57 | Ya trabajado (cartilla por zona y prepagas por ciudad). Faltan La Pampa y San Luis (ver Sancor) |
| Precio | 113 | 30 | 37 | Compra. Muchas variantes por edad y grupo familiar |
| Planes | 261 | 148 | 107 | Mezcla: nombre del plan, sanatorio con el plan, planes corporativos y variantes |
| Cobertura (qué cubre, reintegros, exterior) | 283 | 63 | 50 | Compra o socio que evalúa. **Sancor: 0 impresiones, no tenemos páginas** |
| Comparación (vs, o, diferencia) | 77 | 48 | 22 | Compra. Lo que mejor funciona hoy: "OSDE Flux vs 210" trajo 306 clics en 3 meses |
| Aportes y monotributo | 24 | 19 | 14 | Compra (código, derivar, monotributo) |
| Edad (jóvenes, jubilados, familia) | 64 | 18 | 17 | Compra |
| Opiniones y reclamos | 9 | 8 | 10 | Compra, pero sin fuente propia de opiniones |
| Contacto, gestiones de socios, trabajo | 102 | 86 | 66 | Ya es socio; poco valor para ventas |

## Prioridades: qué hacer y dónde

| # | Búsquedas (ejemplos del autocompletado y Search Console) | URL dueña | Qué hacer | Bloqueo |
|---|---|---|---|---|
| 1 | **Sancor, qué cubre cada plan**: "sancor 1000 que cubre", "plan 3000 que cubre", "reintegros sancor salud plan 1000/1500/3000", "sancor 1000 ortodoncia", "sancor 1000 cubre anteojos", "sancor salud asistencia al viajero", "sancor salud cubre implantes dentales" | `/coberturas/[tema]/sancor-salud` (nuevas: ortodoncia, óptica, implantes, reintegros, exterior) y la sección "Qué cubre" de cada plan | Cargar la cobertura oficial de cada plan de Sancor | **Falta la fuente**: hoy no hay datos de cobertura de Sancor. Lo mismo destraba las comparaciones entre planes (punto 3) |
| 2 | **OSDE, comparaciones con Flux**: "osde flux vs osde 310", "osde 310 o flux", "osde flux vs osde 410" | `/prepagas/osde/flux-vs-310` y `/flux-vs-410` (nuevas) | Mismo armado que `/flux-vs-210`, la comparación con más clics del sitio (306 en 3 meses) | No |
| 3 | **Sancor, comparaciones entre planes**: "sancor 1000 vs 1500" y los pares cercanos | `/prepagas/sancor-salud/plan-1000-vs-plan-1500`, etc. (nuevas) | Comparaciones automáticas como las de Swiss y OSDE | Depende del punto 1 |
| 4 | **Planes jóvenes**: "osde plan joven (precio 2026)", "osde para jóvenes", "osde flux hasta qué edad", "sancor salud plan joven", "sancor gen", "swiss medical plan joven" | OSDE: `/prepagas/osde/flux`. Sancor: los planes GEN (18 a 45 años). Swiss: `/blog/swiss-medical-para-jovenes` | Sumar "plan joven" al título, H1 y preguntas de esas páginas, y el rango de edad con fuente | Edad de Flux: el sitio dice "pensado para 18 a 35", falta confirmarlo con OSDE |
| 5 | **Aportes y monotributo por marca**: "osde monotributo", "osde para monotributistas", "código osde para derivar aportes / AFIP / ARCA", "swiss medical para monotributistas", "código de sancor salud para monotributo" | `/derivar-aportes/[prepaga]` | Sumar "monotributo" al título y al H1. Hoy: "Derivar aportes a OSDE: código … y cuánto pagás" | No |
| 6 | **Jubilados y mayores por marca**: "osde para jubilados", "osde para mayores de 60/65/70", "swiss medical para jubilados", "sancor salud para jubilados" | Una sección "Para jubilados" en cada ficha (precio a los 65, ingreso hasta los 66) con link a `/para/adultos-mayores` | Sección y enlace | Ficha de Swiss: después del 21-dic. OSDE y Sancor: ya |
| 7 | **Sanatorio + plan**: "osde 210 hospital italiano", "osde 210 fleni", "osde 210 británico", "osde 210 finochietto", "osde 310 favaloro", "osde 210 los arcos", "osde 210 suizo argentina" | `/sanatorios/[slug]` | Pregunta frecuente por plan de partner ("¿El OSDE 210 cubre el Hospital Italiano?"), con el dato de la cartilla oficial y link a la cartilla del plan | No |
| 8 | **OSDE en el exterior**: "osde 210 cobertura en brasil", "osde 210 cubre en uruguay", "cómo activar osde en brasil / uruguay / para viajar", "osde 210 asistencia al viajero europa", "asistencia al viajero osde 510" | `/coberturas/exterior/osde` (nueva; Swiss ya la tiene) | Página con la cobertura oficial por plan | Falta la fuente oficial de OSDE para el exterior |
| 9 | **Precio por edad y grupo**: "cuánto sale osde para una persona de 40 / 50 años", "osde 210 precio 50 años / 60 años", "osde 310 matrimonio precio", "osde 410 plan familiar precio", "cuánto sale osde para un bebé", "cuánto sale swiss medical para una persona" | La ficha de cada plan | Preguntas con respuesta directa a los 40, 50 y 60 años y en pareja, tomadas del cuadro de la SSSalud | OSDE 210, 310, 410 y 510 y SMG20 están en prueba: **después del 21-dic** |
| 10 | **Sancor en La Pampa y San Luis**: "sancor salud santa rosa" (505 impresiones, posición 10,1), "sancor salud general pico" (304, posición 7,8), "sancor salud villa mercedes" (125, posición 7,8), "osde santa rosa" (224, posición 9,4) | `/prepagas/la-pampa/...` y `/prepagas/san-luis/...` (nuevas en el silo de prepagas por provincia) | Sumar las dos provincias al silo local, con la cartilla por zona enlazando a los planes de la ciudad (como ya se hace) | No |
| 11 | **Swiss, planes corporativos**: "swiss medical plan docthos", "plan bg2", "plan care 1 / care 2 / care 3", "plan cl10", "plan sb02 que cubre", "swiss medical bajar plan" | Guía nueva: "Planes corporativos de Swiss Medical: qué cartilla usa tu plan y cómo seguir si dejás la empresa" | El momento de compra es cuando la persona deja la empresa y quiere seguir con un plan individual | Hace falta la equivalencia de cada código (Darío ya pasó Qualitas, Docthos y SMMP) |
| 12 | **Sancor, variantes de plan**: "sancor 1000 b", "1000 r", "1500 b", "plan 800 v", "sancor gen w", "gen xt", "f800 40" | Pregunta en la ficha de cada plan: "¿Qué es el Plan 1000 B?" | Explicar qué significa cada letra | No sabemos qué significan: preguntar a Darío o a Sancor |
| 13 | **Brand vs brand que faltan**: "sancor salud vs galeno", "sancor salud vs omint", "sancor salud vs jerárquicos", "osde 210 vs sancor 3000" | `/comparativas/...` (nuevas) | Solo si hay datos comparables; prioridad baja | No |

**No conviene:**
- **Opiniones** ("osde flux opiniones", 166 impresiones, posición 9,6; "swiss medical quejas y reclamos"): no tenemos una fuente de opiniones y no se inventa.
- **OSDE Neo y OSDE 450**: no están en el cuadro oficial de la SSSalud (OSDE solo publica 210, 310, 410 y 510), así que no hay precio con fuente. Primero saber qué son.
- **Especialistas por plan** ("neurólogo osde 410"): el sitio no lista médicos (decisión del 22-sep).

## Enlaces internos

Lo que falta hoy, revisado en el código:

1. **Ficha de plan → comparación con la otra marca.**
   - Ninguna ficha de plan enlaza a las comparaciones entre marcas que ya existen:
     - SMG20 vs OSDE 210 y vs OSDE 310;
     - SMG02 vs OSDE 210;
     - SMG30 vs OSDE 310 y vs OSDE 410;
     - SMG50 vs OSDE 410;
     - SMG20 vs Sancor 3000.
   - Se buscan "osde 210 vs smg20", "smg20 vs osde 310", "smg50 vs osde 410"…
   - Propuesta: link con el texto exacto ("OSDE 210 vs Swiss Medical SMG20") desde las dos fichas de plan.
   - Las fichas en prueba quedan para después del 21-dic.
2. **Ficha de plan → derivar aportes.** Las fichas de plan no enlazan a `/derivar-aportes/[prepaga]`. Texto propuesto: "Pasar tus aportes al OSDE 210: código y cuánto pagás".
3. **Fichas de prepaga → perfiles.** Desde las secciones nuevas de jubilados y jóvenes, link a `/para/adultos-mayores` y `/para/jovenes` con el texto "OSDE para jubilados" o "plan joven de OSDE".
4. **Sanatorio ↔ cartilla del plan.** La pregunta nueva de cada sanatorio enlaza a `/cartillas/[prepaga]/plan-x`, y la cartilla del plan enlaza al sanatorio.
5. **OSDE como obra social y derivar aportes.**
   - `/obras-sociales/osde` (OSDE como obra social) y `/derivar-aportes/osde` (pasar los aportes) se enlazan entre sí.
   - "codigo osde" ya tiene 169 impresiones en posición 2,6.

## Canibalización: quién es dueño de qué

| Búsqueda | Dueña | Las otras solo enlazan |
|---|---|---|
| "osde 210 precio", "smg20 precio", "sancor 3000 precio" | Ficha del plan | Ficha de prepaga, /precios, comparaciones |
| "osde precios", "planes osde", "sancor salud planes y precios" | Ficha de la prepaga | Fichas de plan |
| "osde 210 vs 310" (dos planes) | `/prepagas/osde/210-vs-310` | La sección "Diferencias" de la ficha de prepaga resume y enlaza |
| "osde 210 vs 310 vs 410" (tres o más) | Sección "Diferencias entre los planes" de la ficha de prepaga | Sin URL nueva: competiría con las de a dos |
| "osde 210 vs smg20" (entre marcas) | `/comparativas/swiss-medical-smg20-vs-osde-210` | Fichas de los dos planes |
| "osde monotributo", "código para derivar aportes a osde" | `/derivar-aportes/osde` | `/para/monotributistas` (general), ficha |
| "osde obra social" (qué es OSDE como obra social) | `/obras-sociales/osde` | `/derivar-aportes/osde` |
| "osde 210 hospital italiano" | `/sanatorios/hospital-italiano` | Cartilla del 210 |
| "osde 210 cobertura en brasil" | `/coberturas/exterior/osde` (nueva) | Ficha del plan (renglón "Exterior" de "Qué cubre") |
| "osde para jubilados" | Sección de la ficha de OSDE | `/para/adultos-mayores` (general, sin marca) |
| "osde plan joven" | `/prepagas/osde/flux` | `/para/jovenes` (general) |
| "sancor salud plan joven" | Fichas de los planes GEN | `/para/jovenes` |

## Orden propuesto

1. **Ya, sin bloqueos**:
   - comparaciones Flux vs 310 y vs 410 (2);
   - "monotributo" en las páginas de derivar aportes (5);
   - preguntas por plan en los sanatorios (7);
   - La Pampa y San Luis (10);
   - "plan joven" en Flux y GEN (4, con la edad de Flux confirmada);
   - secciones de jubilados en las fichas de OSDE y Sancor (6).
2. **Con datos de Darío o de las prepagas**:
   - cobertura oficial de Sancor por plan (1 y 3);
   - cobertura de OSDE en el exterior (8);
   - códigos de planes corporativos de Swiss (11);
   - letras de los planes de Sancor (12).
3. **Después del 21-dic**:
   - preguntas de precio por edad (9);
   - enlaces a comparaciones entre marcas y a derivar aportes desde las fichas en prueba (enlaces 1 y 2);
   - sección de jubilados en la ficha de Swiss.
4. **Medir** cada tanda a las 2 y 4 semanas en Search Console, por página, como pide `pruebas-titulos-2026-11-23.md`.

## Hecho el 27-nov

Datos de Darío (26-nov): OSDE Neo es para menores de 27 años; el OSDE 450 sigue a la venta, aunque se vende poco por el precio.

- **Flux (punto 4)**:
  - "osde flux" (2.761 impresiones, posición 8,7, CTR 0,3%) y "osde flux precio" (1.414) los ganaba la comparación Flux vs 210 (11.630 impresiones), no la página del plan;
  - la página `/prepagas/osde/flux` tiene ahora título y descripción propios: "OSDE Flux 2026: qué cubre, edad y precio del plan joven";
  - el resto de las fichas de plan usa la misma plantilla de siempre, y las que están en prueba no cambian.
- **Ficha de OSDE**: preguntas "¿OSDE tiene un plan para jóvenes además del Flux?" (Neo, menores de 27) y "¿OSDE sigue vendiendo el plan 450?". El 450 figura en la cartilla oficial, pero no en el cuadro de precios de la SSSalud.
- **Ficha de Sancor**: "¿Sancor Salud tiene un plan para jóvenes?" (los GEN, con precio hasta los 45 años en la lista oficial). No se dice que sean más baratos: a los 30 años la lista los muestra más caros que el plan equivalente.
- **Sanatorios (punto 7)**:
  - una pregunta por prepaga ("¿El Hospital Italiano atiende Swiss Medical?") con el plan desde el que lo cubre según la cartilla oficial;
  - en OSDE, además, si el 210 lo incluye;
  - responde "hospital italiano atiende swiss medical" (82 impresiones, posición 5,4) y "sanatorio los arcos atiende osde 210".

**Queda para después del 21-dic:**
- **Flux vs 310 y vs 410 (punto 2)**: crear esas comparaciones agrega un enlace en las fichas del 310 (control) y del 410 (en prueba).
- **Monotributo en derivar aportes (punto 5)**: poco volumen ("swiss medical monotributo", 46 impresiones), y `/derivar-aportes/swiss-medical` rinde bien (posición 3,5, CTR 2,7%). No se toca el título; la página ya responde "¿Sirve si soy monotributista?".
- **La Pampa y San Luis (punto 10)**:
  - Es lo de más volumen: unas 1.800 impresiones en posición 6 a 10 ("sancor salud santa rosa" 505, "osde san luis" 331, "sancor salud general pico" 304). Hoy las ganan las páginas de cartilla.
  - Sumarlas al silo por provincia toca la lista de provincias de `/ranking` (en prueba) y de la ficha de Swiss (control).
  - Además, el motor de precios no tiene región oficial para esas provincias en Swiss, OSDE y Sancor.
  - Se hace después del 21-dic. Mientras tanto, las cartillas de esas ciudades siguen siendo las dueñas.
