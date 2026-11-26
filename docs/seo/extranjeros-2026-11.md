# Extranjeros: cómo venimos y qué palabras sumar (26-nov-2026)

Pedido de Darío: analizar las páginas para extranjeros e investigar palabras clave nuevas o que podamos posicionar.

## Fuentes y límites

- **Search Console**:
  - exports del 28-oct, 9-nov, 16-nov y 22-nov-2026; cada uno acumula los últimos 3 meses;
  - solo trae las 1.000 consultas y las 1.000 páginas con más clics.
- **Vercel Analytics**: visitas y leads ("Lead enviado", con la página desde donde la persona fue a cotizar). Período: 27-oct al 26-nov; para los leads, 26-sep al 26-nov.
- **Autocompletado de Google** (26-nov):
  - 305 consultas en 5 idiomas: inglés (desde Argentina y EE.UU.), español, portugués, ruso y chino;
  - muestra **cómo** se busca, no cuánto.
- **Sin volúmenes**: Ahrefs no los da con el plan actual y la prueba gratis de Supermetrics (que trae el Planificador de Google Ads) venció el 5-oct.
- **Decreto 366/2025**, verificado en:
  - el [Boletín Oficial](https://www.boletinoficial.gob.ar/detalleAviso/primera/326096/2025-05-29) (DNU publicado el 29-may-2025, reforma la Ley de Migraciones 25.871);
  - la [normativa nacional](https://www.argentina.gob.ar/normativa/nacional/decreto-366-2025-413297);
  - [Presidencia](https://www.argentina.gob.ar/node/467195): los no residentes necesitan seguro o pago previo para la atención programada en hospitales públicos; las emergencias se atienden igual.

## Cómo venimos

### Search Console (últimos 3 meses al 20-nov y cambio contra el export del 28-oct)

| Página | Clics | Impresiones | CTR | Posición | Clics el 28-oct |
|---|---|---|---|---|---|
| /en/health-insurance-argentina | 35 | 5.653 | 0,62% | 7,2 | 20 |
| /en/best-health-insurance-argentina | 30 | 11.923 | 0,25% | 6,9 | 14 |
| /en/mandatory-insurance-decree-366 | 30 | 1.523 | 1,97% | 4,8 | 10 |
| /para/extranjeros | 19 | 564 | 3,37% | 4,4 | 12 |
| /en/health-insurance-cost-argentina | 16 | 5.321 | 0,30% | 6,6 | 8 |
| /ru/strahovanie-argentina | 7 | 267 | 2,62% | 8,4 | 4 |
| /zh/yiliao-baoxian-agenting | 7 | 167 | 4,19% | 5,5 | 2 |
| /ru/stoimost-strahovaniya-argentina | 6 | 112 | 5,36% | 6,0 | 5 |
| /ru/luchshaya-strahovka-argentina | 6 | 95 | 6,32% | 7,3 | 4 |

- **Crece:**
  - las 4 páginas en inglés pasaron de 17.215 a 24.420 impresiones (+42%) y de 52 a 111 clics (+113%) entre los dos exports;
  - el decreto 366 se triplicó.
- **CTR muy bajo en inglés**: 0,25% a 0,6% en las posiciones 6 a 7.
  - La mayor parte de las impresiones viene de una búsqueda suelta, **"health insurance"**: 15.031 impresiones, posición 6,1, 30 clics (0,2%).
  - Casi todas esas impresiones son de Argentina (el país del 98% de las impresiones del sitio).
- **Brasil**: el sitio tiene 3.777 impresiones desde Brasil en posición 13,4 (CTR 0,77%), y no tenemos ninguna página en portugués.

### Vercel (27-oct al 26-nov)

- **Visitantes por página**:
  - decreto 366: 63; health-insurance-argentina: 57; best: 34; /para/extranjeros: 30; cost: 20;
  - chino: 15; ruso: 19.
- **País**: EE.UU. 120 visitantes y Argentina 59. Son sobre todo turistas o gente que planea venir.
- **Leads** (26-sep al 26-nov, 2 meses): 12 en total.
  - health-insurance-argentina 5; cost 2; decreto 2; best 1; /para/extranjeros 1; chino 1.
- **Dos direcciones rotas**:
  - `/en/best-health-insurance-argentinaprepaga` y `/en/best-health-insurance-argentinaprepaga).`;
  - **24 visitantes en el mes**, sin sitio de origen (parece un link mal copiado en otro lado; en nuestro código no está);
  - hoy terminan en "página no encontrada".

## Qué encontramos

1. **Hay dos públicos y solo uno compra una prepaga.**
   - **Turistas** (la mayor parte del volumen, en inglés, portugués y chino): buscan el seguro para entrar al país. Por ejemplo:
     - "health insurance required to enter argentina", "proof of health insurance to enter argentina";
     - "argentina travel insurance requirements for u.s. citizens";
     - "seguro saúde para entrar na argentina", "valor mínimo seguro saúde argentina", "阿根廷 入境 保险".
     - Necesitan una asistencia al viajero, que no vendemos.
   - **Residentes** (estudiantes, quien se muda, jubilados, nómadas digitales): necesitan una prepaga. Por ejemplo:
     - "health insurance for expats in argentina", "private health insurance argentina cost";
     - "plano de saúde na argentina", "quanto custa um plano de saúde na argentina", "como se chama plano de saúde na argentina";
     - "seguro médico para estudiantes extranjeros en argentina", "medicina prepaga para extranjeros en argentina".
   - **Qué conviene**: al turista, responderle rápido qué seguro le piden (eso trae citas en las IA y confianza). En todas las páginas, empujar el caso "si te quedás varios meses, te conviene una prepaga", que es lo que ya dice la página del decreto.

2. **La página del decreto afirma cosas sin fuente.**
   - No enlaza al Boletín Oficial.
   - Dice que las aerolíneas pueden pedir el seguro antes de embarcar, y eso no lo encontramos en las fuentes oficiales.
   - Dice "en vigencia desde el 1-jul-2025", una fecha que sale de la prensa, no del decreto.
   - Le falta lo que más se pregunta: "is healthcare free in argentina for foreigners", "does argentina have free healthcare". La respuesta, con [Presidencia](https://www.argentina.gob.ar/node/467195) como fuente: las emergencias se atienden; la atención programada pide seguro o pago previo a los no residentes.

3. **En español falta la parte legal.**
   - "decreto 366/25 migraciones", "decreto 366 25 resumen", "seguro médico obligatorio para extranjeros en argentina", "decreto 366/25 inconstitucional".
   - Solo la tenemos en inglés. `/para/extranjeros` (posición 4,4, CTR 3,4%) la menciona en una línea.

4. **Portugués no existe.**
   - Hay muchos brasileños estudiando y viviendo en Argentina, y el autocompletado muestra búsquedas de residentes, no solo de turistas.
   - El nombre local también se busca: "como se chama plano de saúde na argentina".

5. **El ruso es casi todo "роды в аргентине"** (parto en Argentina: precio, ciudadanía, foro 2026).
   - Una prepaga no cubre un embarazo en curso (carencia), así que esa búsqueda casi no se convierte en venta.
   - Las páginas actuales alcanzan; no conviene invertir más.

6. **El chino es mínimo** y casi todo es seguro de entrada ("阿根廷 入境 保险"). Se deja como está.

## Mapa: una intención, una URL

| Intención | Ejemplos | URL dueña | Estado |
|---|---|---|---|
| Seguro para entrar al país (turista) | health insurance required to enter argentina, argentina travel insurance requirements | /en/mandatory-insurance-decree-366 | Hecho (26-nov): fuentes oficiales, sin lo de las aerolíneas, la regla de los hospitales |
| Prepaga para quien se queda (inglés) | health insurance for expats in argentina, health insurance for foreigners in argentina, how does health insurance work in argentina, health insurance for international students argentina | /en/health-insurance-argentina | Hecho (26-nov): sección para estudiantes (#students), pasaporte o precaria, certificado para el DNI. Falta jubilados |
| Cuánto cuesta (inglés) | how much does health insurance cost in argentina, cost of private health insurance in argentina | /en/health-insurance-cost-argentina | Existe: CTR 0,3% |
| La mejor (inglés) | best health insurance in argentina, y la búsqueda suelta "health insurance" | /en/best-health-insurance-argentina | Existe: CTR 0,25%, mejorar título y descripción |
| ¿Es gratis la salud para extranjeros? (inglés) | is healthcare free in argentina for foreigners, does argentina have free healthcare | /en/mandatory-insurance-decree-366 (pregunta frecuente; la respuesta es la regla del decreto) | Hecho (26-nov) |
| Prepaga para extranjeros (español) | prepaga para extranjeros, medicina prepaga para extranjeros en argentina, prepaga con residencia precaria | /para/extranjeros | Hecho (26-nov): pasaporte o precaria, certificado para el DNI, links a estudiantes y a portugués |
| Estudiantes extranjeros (español) | seguro médico para estudiantes extranjeros en argentina, prepaga para estudiantes extranjeros, estudiar medicina en argentina seguro médico | /para/estudiantes-extranjeros | Nueva (26-nov): precio a los 22 años, comparación con Brasil, Uruguay y Colombia, qué dice la ley |
| Decreto 366 (español, legal) | decreto 366/25 migraciones, decreto 366 25 resumen, seguro médico obligatorio para extranjeros en argentina | /guias/seguro-medico-obligatorio-extranjeros (ya existía; no la vimos en el primer análisis porque no tiene clics) | Hecho (26-nov): fuentes oficiales, sin "la mayoría acepta pasaporte" ni "cumple el requisito"; enlaza a /para/extranjeros y a estudiantes |
| Prepaga en Argentina (portugués) | plano de saúde na argentina, quanto custa um plano de saúde na argentina, como se chama plano de saúde na argentina, plano de saúde estudante argentina | /pt/plano-de-saude-argentina | Nueva (26-nov): hreflang con /para/extranjeros, /en, /ru y /zh; secciones #estudantes y #turistas |
| Seguro de viagem (portugués) | seguro saúde para entrar na argentina, seguro saúde argentina é obrigatório | /pt/plano-de-saude-argentina#turistas | Hecho (26-nov): una sección corta, sin vender seguro de viaje |

No se cruzan:
- **Guía del decreto en español**: responde qué exige la ley y deriva a `/para/extranjeros` para cotizar.
- **`/para/extranjeros`**: no repite el análisis legal, solo un párrafo y el link a la guía.

## Qué haría, en orden

1. **Redirigir las dos direcciones rotas** a `/en/best-health-insurance-argentina`. Son 24 visitantes por mes; es un cambio de 5 minutos.
2. **Página del decreto (inglés)**:
   - enlaces al Boletín Oficial y a la normativa;
   - sacar lo de las aerolíneas, o confirmarlo con una fuente;
   - "1-jul-2025" como fecha informada, no como texto del decreto;
   - pregunta nueva "Is healthcare free in Argentina for foreigners?".
3. **Títulos y descripciones en inglés**:
   - `best` y `cost` tienen CTR de 0,25% a 0,3% en posición 6 a 7;
   - probar títulos con la búsqueda al principio ("Health Insurance in Argentina…") y el precio desde, en pesos y su equivalente en dólares (el sitio ya lee el dólar del BCRA);
   - medir a las 2 y 4 semanas, como las pruebas del 23-nov.
4. **`/para/extranjeros`**: secciones "Estudiantes extranjeros", "Para el trámite de residencia" y "Qué dice el decreto 366" (un párrafo y el link a la guía).
5. **Guía nueva del decreto 366 en español**, con el texto del Boletín Oficial como fuente.
6. **Página en portugués**, si hay quien atienda en portugués:
   - para residentes: precio desde, qué piden para afiliarse y prepagas con red en las ciudades donde estudian brasileños;
   - una sección corta para turistas.
7. **Ruso y chino**: sin cambios.

## Para decidir (Darío)

- **Idiomas**: ¿hay quien atienda en inglés y en portugués? Sin eso, la página en portugués trae consultas que después no se cierran.
- **Afiliación con pasaporte**: ¿qué prepagas afilian solo con pasaporte (sin DNI) o con residencia precaria? `/para/extranjeros` dice que "la mayoría de las grandes" lo aceptan, y conviene tenerlo confirmado por prepaga.

## Hecho el 26-nov (Darío: "arrancá con todo")

Datos de Darío: asesoramos en inglés y portugués; Swiss Medical afilia con pasaporte o con residencia precaria; con la afiliación damos el certificado de cobertura para el trámite del DNI.

- **Redirección** de las dos direcciones rotas a `/en/best-health-insurance-argentina`.
- **Decreto 366 (inglés)**: fuentes del Boletín Oficial, la normativa y Presidencia; sin lo de las aerolíneas; el 1-jul-2025 como fecha informada por la prensa; preguntas nuevas: "Is healthcare free in Argentina for foreigners?" y afiliación con pasaporte o precaria.
- **Guía en inglés**: sin "la mayoría de las compañías aceptan pasaporte" (solo Swiss está confirmado); sección para estudiantes con el precio a los 22 años; asesores en inglés y portugués; el JSON-LD de las preguntas ya no manda un objeto en vez del texto.
- **Ruso y chino**: las mismas correcciones del decreto y del pasaporte, y el hreflang a portugués.
- **`/para/extranjeros`**: pasaporte o precaria, certificado para el DNI, links a estudiantes y a portugués.
- **`/para/estudiantes-extranjeros`** (nueva): precio a los 22 años de la lista oficial, cómo funciona si venís de Brasil, Uruguay o Colombia (con fuentes), qué dice la ley.
- **`/pt/plano-de-saude-argentina`** (nueva): precio oficial, comparación Brasil-Argentina, glosario ("como se chama plano de saúde"), estudiantes, turistas y formulario en portugués (fuente `pt-pillar`, `pt-estudantes`, `pt-pillar-cta`; el teléfono arranca en +55).
- Sin el descuento por edad de Swiss en ninguna página: se comunica en la cotización.

- **Guías en español que ya existían**:
  - `/guias/seguro-medico-obligatorio-extranjeros` (dueña de lo legal en español): fuentes oficiales y las mismas correcciones;
  - `/guias/prepaga-para-uruguayos-en-argentina`: la diferencia con las mutualistas (órdenes y tickets, con fuente de la OPS e IMPO), como pidió Darío;
  - `/guias/como-afiliarse-prepaga-requisitos`: solo lo confirmado sobre el pasaporte.

Falta: títulos de `best` y `cost` en inglés, y qué prepagas además de Swiss afilian con pasaporte (Sancor lo averigua Darío).
