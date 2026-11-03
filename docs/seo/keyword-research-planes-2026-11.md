# Keyword research por plan: Swiss Medical, Sancor Salud, OSDE, Avalian, Prevención Salud y Premedic

Pedido de Darío (3-nov-2026, curso de SEO): qué busca la gente de cada plan y qué contenido de nicho conviene hacer.

## Fuentes y límites

- **Search Console**: export del 28-oct-2026, **últimos 3 meses** (agosto a octubre).
  - Las impresiones son de los 3 meses, no por mes. Para el mensual, dividir por 3.
  - El export trae solo las 1.000 consultas y las 1.000 páginas con más clics, así que las búsquedas chicas sin clics no aparecen.
- **Volúmenes**: Planificador de Google Ads, en `volumenes-google-ads-2026-10.md`. Son búsquedas por mes en todo Google.
- **Sin acceso desde acá**:
  - Autocompletado de Google: el dominio está bloqueado en este entorno.
  - Preguntas reales de los chats del CRM: la consulta SQL está al final, para correrla en Supabase.

## Lo que dicen los datos (los 6 hallazgos)

1. **De los planes se busca sobre todo la cartilla.**
   - En Swiss Medical, Sancor y Premedic, la mayoría de las búsquedas con nombre de plan dicen "cartilla" ("cartilla swiss medical smg20", "cartilla sancor salud plan 1000", "premedic plan 300 cartilla").
   - El precio pesa en OSDE: "osde 210 precio", "osde 410 precio", "osde flux precio".
   - Conclusión: la página de cada plan tiene que poner arriba **qué sanatorios y médicos entran en tu zona**, y el precio después.
2. **Las fichas de plan aparecen mucho y casi nadie entra** (CTR menor a 1%, posición 7 a 8):

   | Página | Impresiones (3 meses) | CTR | Posición |
   |---|---|---|---|
   | /prepagas/osde/210 | 7.172 | 0,61% | 7,3 |
   | /prepagas/swiss-medical/smg20 | 4.780 | 0,40% | 7,1 |
   | /prepagas/osde/410 | 3.417 | 0,59% | 8,1 |
   | /prepagas/sancor-salud/f800 | 3.166 | 1,23% | 6,3 |
   | /prepagas/osde/310 | 1.985 | 0,60% | 8,3 |
   | /prepagas/sancor-salud/plan-1500 | 1.594 | 0,44% | 7,9 |

   Es la mayor oportunidad, porque el tráfico ya existe. Pasar de posición 7 a 3 suele multiplicar los clics por 3 o 4.
3. **Las comparaciones entre planes funcionan.**
   - /prepagas/osde/flux-vs-210 es la página con más clics de todas las de planes: 138 clics, CTR 3,0%.
   - "osde flux vs osde 210" está en posición 4,4.
   - También rinden las de 210 vs 310, 310 vs 410, smg20 vs smg30 y smg02 vs smg20.
   - Conclusión: el formato "X vs Y" conviene repetirlo donde la gente duda entre dos planes.
4. **/cartillas/osde: 25.053 impresiones con 0,1% de CTR.**
   - Es la consulta de marca "osde cartilla" (40.500 por mes): la gente quiere la cartilla oficial y nos ve en posición 6.
   - No es de compra, pero es la página con más impresiones del sitio.
5. **Avalian y Prevención Salud no se buscan por plan.**
   - Nadie busca "AS200" ni "A2": se busca la marca más la ciudad ("prevención salud córdoba", "avalian rosario").
   - Las páginas de ciudad de Prevención tienen miles de impresiones con CTR de 0,1 a 0,2%. Por ejemplo, Córdoba Capital: 3.690 impresiones y 7 clics; Rosario: 3.128 y 6.
   - Para estas dos, el contenido de nicho es **por ciudad**, no por plan.
6. **Premedic se busca poco, y casi todo es cartilla del Plan 300 y del Plan 400.**
   - Estamos en posición 8 a 11.
   - Hay una pregunta concreta sin buena respuesta: "premedic plan 400 qué cubre", en posición 10,7.

## Por prepaga y por plan

"Impr." es la suma de impresiones de las búsquedas con el nombre del plan, en 3 meses. "Pos." es la posición promedio ponderada.

### Swiss Medical

| Plan | Impr. | Pos. | Lo que busca la gente | Contenido de nicho que falta o hay que reforzar |
|---|---|---|---|---|
| SMG20 | 1.808 | 7,4 | "cartilla swiss medical smg20" (583), "smg20" (262), "plan smg20 swiss medical" (231) | La ficha (4.780 impr.) tiene que abrir con la cartilla de tu zona y responder en el primer párrafo qué es el SMG20: sin copago, cartilla cerrada, el más elegido. Preguntas para sumar: si incluye el Alemán, el Italiano o el Británico; ortodoncia y psicología; reintegros (no tiene); diferencias con el OSDE 310 |
| SMG30 | 485 | 6,0 | "smg30" (138), "cartilla swiss medical smg30" (119), "swiss medical plan smg30 precio" (44) | La ficha rinde bien (CTR 2,3%). Falta "SMG30 vs OSDE 310/410" y qué agrega al SMG20 en sanatorios. "smg20 vs smg30" ya existe y rinde |
| SMG02 | 424 | 5,1 | "plan smg02 swiss medical cartilla" (178), "cartilla swiss medical smg02" (89) | Casi todo es cartilla. La cartilla del SMG02 en CABA rinde (CTR 3,1%). Falta la cartilla por zona del GBA y "SMG02 vs S1" (la duda de copago sí o no, que es tu discurso de venta) |
| S1 | 231 | 9,8 | "plan s1 swiss medical" (83, posición 13,5), "swiss medical s1" (53) | Lo más flojo de Swiss: posición casi 10. Hace falta responder "qué es el S1": el mismo plan que el SMG02 con copago fijo de $14.000. Y una comparación "S1 vs SMG02" |
| S2 | 128 | 7,8 | "s2 swiss medical" | Igual que el S1, para el interior: "S2 vs SMG20" |
| SMG40, SMG50, SMG70 | 137 | 4 a 13 | Marca más plan | Poco volumen. Alcanza con la ficha |
| Sport | — | — | Sin búsquedas con clics | No priorizar |

Fuera de los planes: /coberturas/ortodoncia, /psicologia, /optica, /reintegros e /implantes-dentales de Swiss tienen entre 860 y 2.250 impresiones en posición 5 a 7. Son nichos que ya rinden y conviene enlazarlos desde la ficha de cada plan.

### OSDE

| Plan | Impr. | Pos. | Lo que busca la gente | Contenido de nicho |
|---|---|---|---|---|
| 210 | 4.617 | 7,2 | "osde 210" (1.226), "cartilla osde 210" (752), "osde 210 precio" (652), "plan osde 210 precio" (445), "osde 210 precio 2026" (307) | Precio por edad con fuente SSSalud arriba de todo, en tabla: es la búsqueda de compra más grande de las seis prepagas ("osde 210 precio", 1.300 por mes en Google Ads). La ficha tiene 7.172 impresiones con CTR de 0,6% |
| Flux | 4.250 | 7,9 | "osde flux precio" (943), "osde flux" (622), "osde flux vs osde 210" (353, posición 4,4), "osde flux opiniones" (115) | "Flux vs 210" ya es la página con más clics. Faltan "opiniones de OSDE Flux" (hay búsqueda y no tenemos página) y el precio de Flux, que sigue sin fuente oficial |
| 310 | 1.428 | 7,0 | "osde cartilla 310" (414), "osde cartilla 310 caba" (250), "osde 310" (219) | Casi todo es cartilla: sanatorios del 310 por zona. "Diferencia entre OSDE 210 y 310" ya tiene página y rinde |
| 410 | 900 | 8,6 | "osde 410 precio" (748), "cuánto cuesta osde 410" | Casi todo es precio. La ficha (3.417 impr.) tiene que abrir con el precio por edad y qué agrega al 310 |
| 510 | 503 | 9,2 | "osde 510 precio" (300), "cuánto sale osde 510 por mes" | Precio. Posición 9: falta una tabla de precio por edad bien arriba |

### Sancor Salud

| Plan | Impr. | Pos. | Lo que busca la gente | Contenido de nicho |
|---|---|---|---|---|
| Plan 1000 (y GEN 1000) | 787 | 8,0 | "cartilla sancor salud plan 1000" (535), "plan gen 1000 sancor salud" (78), "plan 1000 b cartilla" (77) | Cartilla. Además, explicar la diferencia entre 1000, GEN 1000 y 1000 con coseguro, que confunde ("plan 1000 b") |
| F800 | 664 | 6,5 | "plan f800 sancor salud" (170), "sancor f800" (158) | La ficha rinde (3.166 impr., CTR 1,2%). Falta "F800 vs F800 Digital Flex" y "F700 vs F800" |
| Plan 1500 | 623 | 6,9 | "cartilla sancor salud plan 1500" (381), "... plan 1500 pdf" (110) | Cartilla. La gente pide el PDF: conviene aclarar que la cartilla está online y es la oficial al día |
| Plan 3000 | 258 | 8,6 | "sancor salud plan 3000 precio" (216) | Precio por edad arriba de todo |
| 4000, 4500, 3500, F700 | menos de 40 cada uno | 4 a 7 | Marca más plan | Alcanza con la ficha |

Sancor por ciudad: /prepagas/cordoba/sancor-salud tiene 2.465 impresiones y CTR de 0,08%; Rosario, 1.703 impresiones y 0,18%. Es el mismo problema que Prevención: la gente busca la sucursal.

### Avalian

- Por nombre de plan solo aparece "AS400" (68 impresiones). El resto no se busca.
- Lo que rinde:
  - La ficha /prepagas/avalian: 2.738 impresiones, posición 6,6.
  - "avalian vs sancor salud": posición 5,1.
  - "avalian vs osde": CTR 5,9%.
  - La cartilla por ciudad: Rosario, Mar del Plata, Bahía Blanca, Tandil.
- **Nicho**:
  - Las comparaciones (sumar "avalian vs premedic" y "avalian vs swiss medical", que ya rinde con CTR 3,7%).
  - La cartilla por ciudad del interior.
  - Explicar los planes por su nombre comercial (Cerca, Integral, Superior, Selecta), que es como los nombra la gente, y no por el código AS.

### Prevención Salud

- Por plan no hay búsquedas con clics: A1 (352 impresiones de la ficha) y A2 (198).
- **Lo que hay es ciudad**:

  | Ciudad | Impresiones | CTR |
  |---|---|---|
  | Córdoba Capital | 3.690 | 0,19% |
  | Rosario | 3.128 | 0,19% |
  | Mendoza | 2.706 | 0,07% |
  | Salta | 1.547 | 0,39% |
  | Tucumán | 1.197 | 0,08% |

- La gente busca "prevención salud + ciudad", casi seguro la sucursal: dirección y teléfono.
- **Nicho**: en cada página de ciudad, la sucursal oficial (dirección, horario y teléfono, con fuente) arriba de todo y después los planes. Es el mismo hueco que ya marca `universo-busquedas.md` para marca más ciudad.

### Premedic

| Plan | Impr. | Pos. | Lo que busca la gente | Contenido de nicho |
|---|---|---|---|---|
| Plan 300 | 327 | 9,8 | "premedic plan 300 cartilla" (167, posición 10,8), "cartilla premedic plan 300" (96) | Cartilla del 300 por zona (CABA y GBA). Ya existe y está en posición 8 a 10 |
| Plan 400 | 112 | 12,0 | "premedic plan 400 qué cubre" (37, posición 10,7), "cartilla premedic plan 400" (40) | Responder "qué cubre el Plan 400" punto por punto, con la ficha oficial |
| C-100, 200, 500 | menos de 20 | — | Casi nada | Alcanza con la ficha |

"Cartilla premedic" tiene 3.600 búsquedas por mes en Google Ads: /cartillas/premedic tiene 1.251 impresiones en posición 8,9.

## Plan de contenido, en orden

El orden sigue el criterio del sitio: volumen por intención de compra. Fecha clave: **15 de noviembre**. Hasta la medición de Search Console no se tocan los títulos de las fichas de Swiss; el contenido de la página sí se puede mejorar.

| # | Qué | Por qué | Esfuerzo |
|---|---|---|---|
| 1 | **OSDE 210, 410 y 510: precio por edad arriba de todo**, en tabla, con fuente SSSalud | Es la búsqueda de compra más grande ("osde 210 precio", 1.300 por mes) y las fichas están en posición 7 a 9 con CTR de 0,6% | Chico: los datos ya están |
| 2 | **SMG20, SMG02 y Sancor 1000, 1500 y F800: la cartilla de tu zona como primer bloque de la ficha**, con la respuesta "qué es el plan" en una oración | Lo que busca la gente de estos planes es la cartilla. La ficha del SMG20 tiene 4.780 impresiones con 0,4% de CTR | Mediano: hay que reordenar el componente de la ficha |
| 3 | **Comparaciones nuevas**: S1 vs SMG02, S2 vs SMG20, SMG30 vs OSDE 310, F700 vs F800, F800 vs F800 Digital Flex | El formato "vs" es el que mejor rinde; estas son las dudas reales de compra (copago sí o no) | Chico por página: el formato ya existe |
| 4 | **Preguntas frecuentes de cada plan sacadas del CRM** (SQL de abajo): "¿el SMG20 incluye el Alemán?", "¿qué cubre el Plan 400?" | Respuestas directas a preguntas reales: es lo que citan las IA (AEO) y no lo tiene la competencia | Mediano: necesita las preguntas del CRM |
| 5 | **Prevención Salud y Sancor por ciudad: la sucursal arriba de todo** | Miles de impresiones con CTR de 0,1 a 0,2%. No es de compra directa, pero es mucho tráfico perdido | Mediano: hace falta la lista oficial de sucursales |
| 6 | **"Opiniones de OSDE Flux"** y **"Qué cubre el Plan 400 de Premedic"** | Búsquedas concretas sin página propia | Chico |

Medición: Search Console 2 a 4 semanas después de cada cambio. Comparar las impresiones, el CTR y la posición de la página contra este export.

## Consulta para sacar las preguntas reales del CRM

Correr en el SQL Editor de Supabase. Trae las preguntas de clientes de los últimos 90 días que nombran un plan, agrupadas por plan. No trae nombres ni teléfonos.

```sql
with m as (
  select coalesce(nullif(texto, ''), transcripcion) as t
    from public.mensajes
   where direccion = 'entrante' and autor = 'contacto'
     and creado_at > now() - interval '90 days'
)
select * from (
select case
         when t ~* 'smg ?0?2\y' then 'SMG02'
         when t ~* 'smg ?20' then 'SMG20'
         when t ~* 'smg ?30' then 'SMG30'
         when t ~* 'smg ?(40|50|60|70)' then 'SMG40+'
         when t ~* '\ys ?1\y' then 'S1'
         when t ~* '\ys ?2\y' then 'S2'
         when t ~* 'osde' then 'OSDE'
         when t ~* 'sancor' then 'Sancor'
         when t ~* 'avalian' then 'Avalian'
         when t ~* 'prevenci' then 'Prevención'
         when t ~* 'premedic' then 'Premedic'
       end as plan,
       left(regexp_replace(t, '\s+', ' ', 'g'), 200) as pregunta
  from m
 where t ~ '\?' or t ~* '\y(cubre|incluye|tiene|entra|atiende|cuanto|cuánto|diferencia|puedo|sirve)\y'
) x
 where plan is not null
 order by plan
 limit 500;
```

Con el resultado se arman las preguntas frecuentes de cada plan (punto 4), con la respuesta sacada de la ficha oficial.

## Lo que pregunta la gente en los chats del CRM (3-nov-2026)

Fuente: 299 preguntas de clientes de los últimos 90 días que nombran un plan, y 400 resúmenes de lo que le interesa a cada lead (ficha del CRM). Se cuentan temas, sin datos personales. La consulta de "aprendizajes" no se corrió todavía.

| Tema | Menciones | Ejemplos reales (reescritos) | ¿Tenemos página? |
|---|---|---|---|
| Precio: "¿hay algo más barato?", "tengo hasta X" | 78 | "¿Tenés algún plan por menos de $200.000?", "el S2 se me va" | Sí: /prepagas-economicas y /prepaga-por-presupuesto. Falta "el plan más barato de Swiss Medical", con la escalera S1 → S2 → SMG02 → SMG20 |
| Cartilla o un sanatorio puntual | 67 | "¿El S2 cubre el Británico de Rosario?", "¿entra la Clínica Bessone?", "¿está el Güemes?" | Sí: /sanatorios/[slug] ya tiene Bessone, Güemes, Británico de Rosario y Modelo de Quilmes. Se suma Trinidad Quilmes (3-nov). Hospital Español de Mendoza figura en una sola cartilla oficial, así que no se publica (piso de 2). "Sanatorio Lomas" y Corporación Médica de San Martín no aparecen en las cartillas cargadas |
| Copago: qué es, cuánto, en qué se paga | 54 | "¿Los $14.000 son por consulta y por estudios?", "¿el SMG20 es el sin copago?", "¿la internación tiene copago?" | Guía general de copago, sí. **Falta "S1 vs SMG02" y "S2 vs SMG20"**: la duda número uno de venta (es el mismo plan, cambia el copago). Además, "plan s1 swiss medical" está en posición 13,5 en Google |
| Monotributo y aportes | 44 | "¿Me toman los dos aportes, el de mi marido y el del monotributo?", "¿el monotributo es pago a cuenta?" | Sí: perfil monotributistas y guías. Sumar preguntas frecuentes en las fichas |
| Desde cuándo tengo cobertura, alta y baja de la otra prepaga | 38 | "¿Desde cuándo lo puedo usar?", "¿cuándo doy de baja Sancor sin pagar dos veces?" | Sí: /guias/como-cambiar-de-prepaga. Sumar las fechas: alta el 1 del mes y cuándo dar la baja en la otra |
| Qué cubre, "por escrito" o en PDF | 26 | "¿Me lo pasás en PDF?", "¿tenés el brochure del SMG50?" | La ficha tiene "qué cubre punto por punto", pero no se puede descargar. **Idea: botón "Descargar qué cubre el plan" (PDF)** en cada ficha |
| Nombres y equivalencias de planes | 23 | "¿Cuál es como el OSDE 310 o el 410?", "¿Swiss y Sancor es lo mismo?", "¿un escalón menos sería el SMG02?" | Parcial: hay comparaciones sueltas. **Falta una tabla de equivalencias** (OSDE 210 / 310 / 410 contra S1, SMG02, SMG20, SMG30 y SMG50). La tiene que validar Darío |
| Ortodoncia y odontología | 20 | "Tengo SMG20 y estoy con ortodoncia: ¿qué plan la cubre para adultos?" | Sí: /coberturas/ortodoncia/swiss-medical, en posición 4,8. Sumar "ortodoncia para adultos: desde qué plan" |
| Aumentos y rango de edad | 19 | "¿Cada cuánto aumenta?", "¿cuándo cambia el precio por edad?" | Sí: /aumentos y la tabla por edad de la ficha. Sumarlo a las preguntas frecuentes de la ficha |
| Mayores de 65, PAMI, AMBU 1 e INTER 1 | 17 | Hijas que buscan cobertura para su madre de 70 a 80 años con PAMI | **No hay página.** Hace falta "prepaga para mayores de 65 con PAMI: AMBU 1 e INTER 1" ("prepagas para jubilados": 260 búsquedas por mes, +23%) |
| Embarazo, parto y carencia | 15 | "¿El SMG02 cubre el parto?", "¿hay carencia de maternidad?" | Sí: /guias/contratar-prepaga-embarazada. Sumar la pregunta en las fichas de SMG02, S1 y S2 |
| Reintegros y plan abierto o cerrado | 15 | "Mi psicóloga es particular: ¿hay reintegro?", "¿plan abierto o cerrado?" | Sí: guía de reintegros y nota de red abierta vs cerrada |
| Psicología | 14 | "¿Cuántas sesiones cubre?", "¿reintegra la psicóloga particular?" | Sí: /coberturas/psicologia/swiss-medical |
| Cirugía estética, botox y rellenos | 12 | "¿Cubre botox o relleno de labios?", "¿desde cuándo cubre la cirugía?" | Sí: /coberturas/cirugia-estetica/swiss-medical. Sumar botox y rellenos solo si lo dice la ficha oficial |
| Autorizaciones | 5 | "¿Con el S2 voy directo o necesito autorización?" | Sí: guía de autorizaciones |

### Contenido nuevo que sale de los chats, en orden

1. **"S1 vs SMG02" y "S2 vs SMG20" de Swiss Medical.** Es la duda de copago, la más frecuente en los chats, y "plan s1" está en posición 13,5. Mismo formato que las comparaciones que ya rinden.
2. **"Prepaga para mayores de 65 con PAMI: AMBU 1 e INTER 1".** No existe y llegan muchos leads de 66 años o más. "prepagas para jubilados": 260 búsquedas por mes y en aumento. Ojo: el precio solo se publica si hay fuente oficial.
3. **Página del Sanatorio de la Trinidad Quilmes** (hecha el 3-nov). Bessone, Güemes, Británico de Rosario y Modelo de Quilmes ya tenían su página.
4. **Tabla de equivalencias OSDE ↔ Swiss Medical,** validada por Darío.
5. **Botón "Descargar qué cubre el plan" (PDF)** en cada ficha, para el que lo pide "por escrito".
6. **Preguntas frecuentes en cada ficha de plan,** sacadas de esta lista: copago, parto, aumentos por edad, desde cuándo cubre, monotributo.
