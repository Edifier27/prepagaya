# Sumar un familiar a la prepaga: keyword research, enlazado y canibalización

Pedido de Darío (6-nov-2026): cómo busca la gente "incluir a un familiar a la prepaga", empezando por Swiss Medical y después el resto de las prepagas.

## Fuentes y límites

- **Reglamento General de Contratación de Swiss Medical** (PDF oficial, versión de enero de 2017, la que publica Swiss hoy): puntos 1.2, 1.3, 1.4, 6 y 7.
- **Search Console**: export del 28-oct-2026 (últimos 3 meses), solo las 1.000 consultas y las 1.000 páginas principales.
- **Vercel Analytics**: 7-oct al 5-nov-2026.
- **Motor de precios**: cuadro oficial de la SSSalud de noviembre de 2026, AMBA, contratación directa, IVA incluido.
- **Sin volúmenes**: Ahrefs no da datos con el plan actual y el autocompletado de Google está bloqueado. La lista para el Planificador de Google Ads está al final.
- **No se pudo leer**: las páginas de trámites de swissmedical.com.ar devuelven 403 (firewall de Swiss). Solo bajó el reglamento.

## Lo que dicen los datos

1. **No hay competencia para Swiss.** En "agregar un familiar a Swiss Medical" o "grupo familiar Swiss Medical" aparecen los PDF de Swiss, nuestra guía de baja y fichas genéricas de elegimejor y elmejortrato. Nadie tiene una página dedicada.
2. **Lo que tenemos de familia habla de obra social, no de prepaga, y casi no convierte** (Vercel, 30 días):

   | Página | Visitantes | Leads | Search Console (3 meses) |
   |---|---|---|---|
   | /guias/divorcio-obra-social | 72 | 1 | 1.226 impresiones, posición 3,2 |
   | /guias/hijos-21-a-25-anos-obra-social | 67 | 0 | 5.279 impresiones, posición 5,8 (y 1.559 en el informe de IA) |
   | /para/familias | 28 | 0 | — |
   | /guias/afiliar-recien-nacido-prepaga | 10 | 0 | — |
   | /blog/cuanto-cuesta-prepaga-familia | — | — | 542 impresiones, posición 5,9 |

3. **Consultas que ya nos muestran**: "plan osde 210 precio grupo familiar" (69 impresiones, posición 8,5), "hasta que edad cubre la prepaga a los hijos" (22, posición 7,6), "osde plan familiar precio" (7). En el buscador del sitio: "Grupo familiar", "HIJOS MAYORES" (4 veces) y "cómo hago los aportes desde monotributo a Swiss Medical".
4. **En los chats del CRM** el tema aparece pegado a los aportes: "¿Me toman los dos aportes, el de mi marido y el del monotributo?" (44 menciones de monotributo y aportes; ver `keyword-research-planes-2026-11.md`).
5. **El dato que nadie tiene: en Swiss, un hijo paga lo mismo que un adulto.** La primera franja del cuadro va de 0 a 35 años:

   | Plan | Hijo o pareja (0 a 35) | Pareja de 45 | Padre o suegro de 60 | 2 adultos de 35 y 2 hijos |
   |---|---|---|---|---|
   | S1 | $205.108 | $258.435 | $480.442 | $820.432 |
   | S2 | $257.499 | $324.419 | $603.133 | $1.029.996 |
   | SMG02 | $289.621 | $364.922 | $678.405 | $1.158.484 |
   | SMG20 | $361.459 | $455.397 | $846.637 | $1.445.836 |
   | SMG30 | $415.228 | $523.205 | $972.621 | $1.660.912 |

   En OSDE, en cambio, los menores de 27 pagan bastante menos (perfil familias). Es una diferencia de compra concreta para una familia con hijos.

## Qué dice el reglamento de Swiss (fuente de la guía)

- **1.2 Quiénes pueden entrar:** el titular (capaz de contratar), su cónyuge, los hijos solteros hasta 21 años a cargo exclusivo y, **pagando una cuota adicional**, los hijos solteros de 21 a 30 y los **familiares a cargo en primer grado de afinidad o consanguinidad que convivan** con el titular. En la práctica, eso son los padres y los suegros.
- **1.3.1:** los hijos solteros se dan de baja solos a los 30. Tienen 30 días para asociarse por su cuenta sin perder la antigüedad.
- **1.3.2:** sin tope de edad para hijos con discapacidad a cargo.
- **1.3.3:** el hijo menor de 30 que se casa tiene que armar su propio grupo, con el mismo plazo de 30 días.
- **1.3.4:** la cobertura de maternidad completa es solo para la titular o la cónyuge que figure en la solicitud. Cualquier otra integrante embarazada se atiende según el PMO.
- **1.4.1:** solicitud de ingreso y declaración jurada de salud de **cada** integrante. El titular responde por lo que declaran todos.
- **7.1.1:** hay que avisar cualquier cambio del grupo dentro de los 30 días.
- **7.1.3:** el bebé que nace en un sanatorio de la cartilla, con la madre asociada, conserva la antigüedad del grupo si se lo suma dentro de los 30 días. El trámite lo hacen el padre, la madre o el tutor.
- **2.1:** la cuota es por mes calendario; no se prorratea por la fecha de alta.
- **Pendiente de confirmar con Darío:** si Swiss acepta al conviviente sin casamiento y con qué papel; si el alta de un integrante se puede pedir online o por Swity, o hay que ir a la sucursal; y qué documentación pide hoy.

## Mapa de búsquedas y qué URL responde cada una (una intención = una URL)

| Grupo de búsquedas | Ejemplos | Intención | URL dueña | Cómo evitar la canibalización |
|---|---|---|---|---|
| Sumar un familiar a Swiss (trámite + quién puede) | "agregar familiar swiss medical", "como agregar a mi pareja a swiss medical", "alta de familiar swiss medical", "swiss medical grupo familiar", "sumar a mi hijo a swiss medical" | Navegacional y transaccional | **Nueva: /guias/como-agregar-un-familiar-a-swiss-medical** | Es la única página de Swiss sobre altas. La guía de baja se queda con la baja |
| Cuánto cuesta sumar a alguien a Swiss | "cuanto sale agregar un hijo a swiss medical", "swiss medical precio grupo familiar", "swiss medical plan familiar precio" | Transaccional | **La misma guía nueva** (tabla por plan y edad) | La ficha `/prepagas/swiss-medical` no suma una sección de familia: la enlaza |
| Precio familiar de un plan puntual | "smg20 precio grupo familiar", "plan osde 210 precio grupo familiar" | Transaccional | **Página de cada plan** (ya tiene "precio para tu grupo familiar" y la pregunta de la familia de 4) | La guía enlaza a cada plan; no repite la tabla de grupos |
| Hasta qué edad cubre Swiss a los hijos | "hasta que edad cubre swiss medical a los hijos", "swiss medical hijos 21 años", "hijo 30 años swiss medical" | Informacional (afiliado) | **La guía nueva** (sección hijos) | La guía de baja conserva "qué hacer cuando cumple 30" y enlaza a la nueva |
| Hasta qué edad, en obra social | "hijos 21 a 25 años obra social", "hasta que edad un hijo puede estar en la obra social" | Informacional | **/guias/hijos-21-a-25-anos-obra-social** (no se toca el título) | Sumarle una sección corta "¿Y en una prepaga?" que enlace a la guía de cada prepaga |
| Recién nacido | "afiliar bebe swiss medical", "recien nacido swiss medical 30 dias" | Informacional (afiliado) | **/guias/afiliar-recien-nacido-prepaga** (general) | La guía nueva tiene 2 líneas con la regla de Swiss (7.1.3) y enlaza a la general |
| Padres y suegros a cargo | "sumar a mis padres a swiss medical", "familiar a cargo swiss medical" | Transaccional, ticket alto | **La guía nueva** (sección padres y suegros) | Más adelante, la página general "prepaga para mis padres" (veta del 18-oct) enlaza a la guía de cada prepaga |
| Sumar los aportes de la pareja | "unificar aportes swiss medical", "aportes de mi marido a swiss medical" | Transaccional | **/derivar-aportes/swiss-medical** | La guía nueva enlaza con ese texto; no explica la derivación |
| Baja de un integrante | "swiss medical baja grupo familiar", "dar de baja a mi hijo swiss" | Navegacional | **/guias/como-dar-de-baja-swiss-medical** | Ya cubre 6.1.4 y 7.1.2. Enlaza a la nueva en "qué pasa con tu familia" |
| Divorcio | "divorcio obra social", "sacar a mi ex de la prepaga" | Informacional | **/guias/divorcio-obra-social** | Solo un enlace desde la guía nueva |
| La mejor prepaga para una familia | "mejor prepaga para familias", "prepaga para familia con hijos" | Comercial | **/para/familias** | La guía nueva no compara prepagas |
| Cuánto cuesta una prepaga para una familia (todas) | "cuanto cuesta una prepaga para una familia" | Comercial | **/blog/cuanto-cuesta-prepaga-familia** | Enlaza a la guía de cada prepaga |

## Enlazado

**Hacia la guía nueva** (texto del enlace = cómo se busca):
- **Ficha /prepagas/swiss-medical:** una pregunta frecuente, "¿Cómo sumo a un familiar a Swiss Medical?", con una respuesta corta y el enlace "cómo agregar un familiar a Swiss Medical".
- **Las 12 páginas de plan de Swiss:** una línea debajo de "Ver precio para tu grupo familiar": "Cómo sumar a un familiar a tu plan".
- **/guias/como-dar-de-baja-swiss-medical:** en "Qué pasa con tu grupo familiar".
- **/guias/hijos-21-a-25-anos-obra-social:** sección "¿Y en una prepaga?".
- **/guias/afiliar-recien-nacido-prepaga:** "En Swiss Medical: el bebé conserva la antigüedad si nace en un sanatorio de la cartilla".
- **/para/familias**, **/blog/cuanto-cuesta-prepaga-familia** y el término "Grupo familiar" del glosario.

**Desde la guía nueva:**
- La ficha ("planes de Swiss Medical").
- Las páginas de plan ("precio del SMG20 para tu grupo familiar").
- El cotizador con el grupo ya cargado (/comparador?prepaga=swiss-medical&desde=guia-familiar).
- La derivación de aportes, la guía de carencias y declaración jurada de Swiss, la del recién nacido, la de baja y la de hijos en obra social.

## Cómo convierte

- **Quien todavía no tiene Swiss:** "Cotizá Swiss Medical para toda tu familia", que lleva al cotizador con las edades.
- **Quien ya tiene Swiss y suma a alguien:** "¿Te conviene sumar los aportes de tu pareja o cambiar de plan? Un asesor oficial te lo calcula". Es un lead de derivación o de cambio de plan. Ver la pregunta 1 de abajo.
- **Padres y suegros:** el precio sube mucho (SMG20 a los 60: $846.637). Es el momento de mostrar la alternativa: un plan propio para el padre o la madre, o el S1 o el S2.

## Fase 2: el resto de las prepagas

- **Mismo formato** por prepaga partner: Sancor Salud (contrato de adhesión en repo.sancorsalud.com.ar), OSDE, Avalian (reglamento en avalian.com) y Premedic.
- **Después**, una guía general "Cómo agregar un familiar a la prepaga" con una tabla por prepaga (hasta qué edad los hijos, si acepta padres, recién nacido), que enlaza a cada guía. Es el mismo esquema que la baja: el pilar general (`como-dar-de-baja-prepaga-u-obra-social`) más una guía por marca, que ya funciona sin canibalizarse.
- **Hosts que hay que habilitar** en el entorno cuando toque: repo.sancorsalud.com.ar, www.avalian.com, www.osde.com.ar y el de Premedic.

## Preguntas para Darío

1. Si alguien que ya es de Swiss quiere sumar a un familiar, ¿lo puede gestionar el asesor, y eso genera comisión? Define el botón de la guía.
2. ¿Swiss acepta al conviviente sin casamiento? ¿Con qué papel (certificado de unión convivencial o declaración jurada de convivencia)?
3. El alta de un integrante, ¿se pide online, por Swity o en la sucursal? ¿Qué documentación piden hoy?
4. ¿Swiss acepta en la práctica padres o suegros a cargo que convivan? ¿Hasta qué edad?

## Para el Planificador de Google Ads (volúmenes)

agregar familiar swiss medical · como agregar a mi pareja a swiss medical · agregar hijo swiss medical · alta familiar swiss medical · swiss medical grupo familiar · swiss medical plan familiar · swiss medical precio grupo familiar · hasta que edad cubre swiss medical a los hijos · swiss medical hijos 21 años · afiliar bebe swiss medical · sumar a mis padres a la prepaga · agregar familiar a la prepaga · como agregar a mi pareja a la prepaga · agregar conyuge prepaga · agregar concubino prepaga · hasta que edad cubre la prepaga a los hijos · prepaga grupo familiar precio · osde grupo familiar · sancor salud grupo familiar · agregar familiar osde · agregar familiar sancor salud · agregar familiar avalian · agregar familiar premedic · unificar aportes prepaga · familiar a cargo prepaga
