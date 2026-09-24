# Todo lo que la gente busca sobre obras sociales y prepagas, y cómo nuclearlo en PrepagaYa

Fecha: 2026-09-24 · Estado: **análisis y propuesta para aprobar** · Actualizado con Search Console (8 al 22 de septiembre) en la sección 0

## 0. Lo que dice Search Console (8 al 22 de septiembre de 2026)

Export que pasó Darío el 24-sep (copia en `docs/seo/datos/gsc-2026-09-08-al-22/`, sirve de línea de base).

**El sitio crece rápido**: de ~4.000 a ~10.000 impresiones por día en dos semanas. 839 clics y 76.000 impresiones en 14 días, posición media 7,5. El 98% es Argentina; 6 de cada 10 clics son desde el celular.

**El problema es el CTR, no la posición**: 1,1% de CTR en posición 7,5 es bajo (en esa posición se espera 2% a 3%). Aparecemos, pero no nos eligen.

**Qué busca la gente que ya nos ve** (las 1.000 consultas visibles):

| Familia | % de impresiones | CTR | Posición | Lectura |
|---|---|---|---|---|
| Cartilla / prestadores ("osde cartilla", "cartilla swiss medical") | 36% | 0,5% | 7,6 | La más grande. Mucha es de marca: quieren la cartilla oficial |
| **Marca + ciudad** ("osde rosario", "sancor salud tucumán") | **25%** | **0,3%** | 8,6 | **El hueco más grande**: casi seguro buscan la sucursal (dirección, teléfono) y nuestra página habla de planes y precios |
| Marca (plan, teléfono, otras) | 14% | 0,8% | 7,6 | Navegacional |
| Precios ("osde flux precio", "osde 210 precio 2026") | 8% | 0,8% | 10,2 | Casi todo OSDE, en el borde de la primera página |
| Obras sociales, monotributo, trámites | 5% | 1,5% | 8,8 | Poco porque casi no tenemos páginas; donde hay, "mejores obras sociales en [provincia]" rankea 4 a 8 |
| Mejores / ranking | 4,5% | 0,9% | 8,7 | |
| Coberturas (PMO, odontología, celiaquía) | 2% | 1,4% | 7,5 | Gana el dato oficial ("pmo actualizado 2026 pdf" en posición 1) |

**Por tipo de página**: prepaga por localidad 14.500 impresiones con 0,6% de CTR; fichas de prepaga 12.100 con 0,5%; cartillas por zona y plan 8.500 con 0,7%; prepaga por provincia 8.400 con 2%; guías 6.200 con 1,7%; obras sociales 1.100 con 0,8%.

**Ojo al medir**: los títulos de fichas, planes y cartillas se cambiaron el 23 y 24 de septiembre, después de este export. Antes de tocarlos de nuevo hay que comparar 14 días antes y después (a partir del 8 de octubre).

### Qué cambia en las prioridades

1. **Sube al primer lugar: sucursales por ciudad.** "Marca + ciudad" es un cuarto de todo lo que vemos y convierte 0,3%. Propuesta: sumar a cada página de prepaga por localidad la sucursal oficial (dirección, teléfono, horario), bajada de los buscadores de sucursales de cada prepaga con la GitHub Action, empezando por Swiss Medical. Título: "OSDE en Rosario: sucursal, teléfono, cartilla y precios".
2. **Sube: obras sociales por provincia.** Ya rankeamos entre 4 y 8 para "mejor obra social en Córdoba/Tucumán/Mendoza" sin tener la página. Pasa de la fase 2 a la 1.
3. **Precios de OSDE a la primera mitad de la página 1**: ~900 impresiones en 2 semanas en posición ~10 (Flux, 210, 410, 510). Hace falta el precio oficial de Flux (no está en los cuadros de la SSSalud) y más enlaces internos a las páginas de plan de OSDE.
4. **Sigue igual**: calculadora de aportes, fichas de obra social y guías de trámites (sección 5).

### Arreglado el 24-sep con estos datos

- 15 URLs con impresiones que daban 404 (páginas viejas y variantes mal escritas): ahora redirigen. Las otras 45 URLs viejas ya redirigían bien.
- **Celiaquía**: la página decía que el subsidio existía "en algunos casos" y que la prepaga podía aplicar un período de espera. Es obligatorio para todas: $58.560,97 por mes desde el 26-abr-2026 (Ministerio de Salud), próxima actualización el 26-oct-2026. Corregido, con el monto en el título ("subsidio celiaquía 2026" tenía ~50 impresiones sin clics).
- Títulos de dos páginas con CTR muy bajo que no se habían tocado: odontología (1.100 impresiones, 0,2%) y obra social vs prepaga (se busca "¿obra social y prepaga es lo mismo?").

---

## En cinco líneas

1. La búsqueda de salud en Argentina tiene **dos mitades del mismo tamaño**: prepagas (donde ya somos fuertes) y obras sociales (donde tenemos 31 fichas contra más de 300 de MiObraSocial). La mitad de obras sociales es informativa, enorme y recurrente: teléfonos, cartillas, CODEM, cambio de obra social, monotributo.
2. **No hace falta un partner de obra social para monetizar ese tráfico.** Quien busca su obra social es, casi siempre, alguien con aportes. La oferta es la misma para todos: *"con tus mismos aportes podés tener Swiss Medical; mirá cuánto pagarías de diferencia"*. Hoy ninguna página nuestra lo calcula.
3. Ya tenemos el activo que nadie tiene: **el registro oficial de 398 obras sociales y prepagas con código** (el que pasó Darío), más cartillas y cuadros oficiales. Con eso se pueden armar fichas de obra social con datos verificables, no texto de relleno.
4. El otro gran bloque son los **trámites y situaciones de vida** (me quedé sin trabajo, soy monotributista, empleada doméstica, jubilación, embarazo, hijos de 21 a 25). Los medios nacionales publican notas de esto todos los meses: la demanda es alta y constante. Tenemos una parte; faltan las más buscadas.
5. Propuesta: **tres fases** (abajo), empezando por la calculadora "de tu obra social a una prepaga", fichas de obra social desde el registro para las más grandes y seis guías de trámites. Todo con el mismo patrón: responder primero y ofrecer la cotización en el momento justo.

---

## 1. Cómo lo medí (y qué falta para medirlo mejor)

- **Inventario del sitio**: 1.882 URLs, 25 guías, 22 notas, 31 fichas de obras sociales, 12 coberturas, 29 coberturas por prepaga, 10 condiciones de salud, 6 perfiles, 43 sanatorios, códigos de 398 entidades.
- **Competencia y resultados de búsqueda** (búsquedas web del 24-sep): quién aparece para cada tema. MiObraSocial tiene más de 300 fichas de obras sociales ("Opiniones, Afiliaciones, Planes, Sucursales, Cartilla") y guías de trámites; ElegiMejor, fichas con "Prestadores, Planes, Teléfonos, Sucursales" y buscador por sanatorio; iProfesional, Ámbito y El Cronista publican todos los meses sobre CODEM, monotributo, empleo doméstico y cambio de obra social; ANSES, ARCA, SSSalud y PAMI rankean con sus páginas oficiales.
- **Tráfico propio**: Vercel Analytics recién se activó el 21-sep (31 visitantes). Lo que entra desde Google ya es cola larga: cartillas por zona y plan, coberturas por prepaga ("¿Swiss Medical cubre óptica?"), prepaga por localidad.
- **Lo que falta**: no hay acceso a volúmenes exactos (Search Console, Planificador de palabras clave de Google). La demanda de abajo es **relativa y estimada** por el tipo de consulta, por quién la cubre y por la frecuencia con que los medios escriben de eso. **Pedido**: acceso de lectura a Search Console de prepagaya.com.ar, para priorizar con datos reales y medir cada fase.

---

## 2. El universo, en nueve familias

Demanda: ●●● alta · ●● media · ● baja (estimada). "Tenemos": ✅ cubierto · ◐ parcial · ❌ no.

### A. Marca de prepaga ("swiss medical precios", "osde 310", "galeno cartilla", "medifé teléfono")
- **Demanda** ●●● · Transaccional y navegacional.
- **Tenemos** ✅ fichas de 15 prepagas, 90 planes, cartillas por zona y plan, coberturas por plan, teléfonos, apps, aumento del mes, código RNAS, PAMI, convenios, comparativas.
- **Huecos**: "[prepaga] opiniones" sin sección propia; "[prepaga] afiliación / requisitos" repartido; prepagas sin cuadro oficial (Omint, Medicus, CEMIC, Hospital Italiano) con precio de referencia.
- **Oferta**: cotizador con la prepaga elegida; chequeo si ya es socio.

### B. Marca de obra social ("osecac teléfono", "ioma cartilla", "osprera turnos", "unión personal credencial", "ospe código")
- **Demanda** ●●● · Mayormente navegacional e informativa: teléfono, cartilla, turnos, delegaciones, credencial, cómo afiliarse, qué cubre, código.
- **Tenemos** ◐ 31 fichas (15 con código, 14 provinciales), directorio de códigos de 398 entidades.
- **Hueco principal**: MiObraSocial y ElegiMejor tienen una ficha por obra social; nosotros, 31. Las sindicales grandes (camioneros, construcción, gastronómicos, bancarios, sanidad, UOM, docentes privados, luz y fuerza, etc.) no tienen página.
- **Oferta**: *"¿Tenés [obra social]? Con tus mismos aportes podés pasar a una prepaga: mirá cuánto pagarías de diferencia"* (calculadora, fase 1). Es la conversión natural de este tráfico y no necesita partner de obra social.

### C. Trámites oficiales ("qué obra social tengo", "codem anses", "cambiar de obra social", "mi sssalud", "unificación de aportes", "alta temprana código obra social", "reclamo superintendencia")
- **Demanda** ●●● · Informativa, recurrente (los medios la publican todos los meses).
- **Tenemos** ◐ CODEM, derivar aportes, cambiar de prepaga, baja, reclamos, autorización, código de obra social.
- **Huecos**: *opción de cambio en Mi SSSalud paso a paso* (con capturas y los errores comunes: la confirmación por mail en 48 horas, una vez por año), *unificación de aportes* (pareja que suma los dos), *cuánto tarda el cambio*, *cómo saber si mi obra social está activa*, *reclamo ante la Superintendencia (0800-222-72583)*, *qué pasa con la obra social si me jubilo*.
- **Oferta**: en el paso donde la persona elige a qué obra social cambiarse, el bloque "antes de elegir, mirá si con tus aportes te alcanza para una prepaga".

### D. Situaciones de vida ("obra social monotributo", "obra social empleada doméstica", "me quedé sin trabajo obra social", "obra social jubilados", "hijos hasta 25 años obra social", "embarazada sin obra social")
- **Demanda** ●●● (monotributo, desempleo, empleo doméstico) · ●● (jubilación, hijos estudiantes, embarazo).
- **Tenemos** ◐ perfiles (familias, embarazadas, monotributistas, adultos mayores, jóvenes, extranjeros), guía "me quedé sin trabajo", notas de PAMI.
- **Huecos**: *lista de obras sociales para monotributistas* (la búsqueda más grande del bloque; necesita el listado oficial de la SSSalud), *cuánto se paga de obra social en cada categoría del monotributo*, *obra social de la empleada doméstica* (OSPACP, las 16 horas, aportes voluntarios), *hijos de 21 a 25 que estudian*, *divorcio y obra social*.
- **Oferta**: monotributo → "con tu monotributo podés tener prepaga pagando la diferencia" (ya está el texto en las fichas); desempleo → plan particular accesible mientras tanto; empleo doméstico → cotizar para quien emplea.

### E. Coberturas y derechos ("la obra social cubre ortodoncia", "fertilización obra social", "pmo qué cubre", "carencia prepaga", "preexistencias", "discapacidad cud cobertura")
- **Demanda** ●●● genéricas · ●● por marca.
- **Tenemos** ✅ en prepagas: 12 coberturas, 29 coberturas por prepaga con fuente, 10 condiciones de salud, PMO, carencias, preexistencias, discapacidad.
- **Huecos**: la misma pregunta desde el lado de obra social ("¿mi obra social cubre X?"), que se responde con el PMO: lo que es obligatorio para todas.
- **Oferta**: Match (/match-prepaga) con el uso ya marcado; "qué plan cubre X" con precio.

### F. Plata ("cuánto sale una prepaga", "aumento prepagas octubre", "deducir prepaga ganancias", "cuánto se descuenta de obra social del sueldo", "diferencia a pagar con aportes")
- **Demanda** ●●● · Mezcla de informativa y transaccional.
- **Tenemos** ✅ precios oficiales, aumentos, historial, calculadora por edad, deducción de Ganancias, chequeo de prepaga.
- **Huecos**: *aportes de obra social: cuánto se descuenta* (3% + 6%, con el tope) y *cuánto pagaría de diferencia con mis aportes* (la calculadora de la fase 1 cubre las dos).
- **Oferta**: chequeo y calculadora.

### G. Local ("prepagas en córdoba", "qué prepaga atiende en el güemes", "obra social en mendoza", "cartilla osde rosario")
- **Demanda** ●● (suma mucho por cantidad).
- **Tenemos** ✅ en prepagas: provincias, localidades, prepaga por localidad, cartillas por zona, sanatorios, Mis sanatorios. ◐ en obras sociales: 14 provinciales.
- **Huecos**: *"obras sociales en [provincia]"* (qué obras sociales tienen más afiliados y delegaciones en cada provincia).
- **Oferta**: Mis sanatorios; prepagas de la provincia.

### H. Comparativas y rankings ("mejor prepaga", "mejor obra social", "osde vs swiss", "obra social vs prepaga", "ranking reclamos prepagas")
- **Demanda** ●●.
- **Tenemos** ✅ ranking, 32 comparativas, obra social vs prepaga, mejores obras sociales (nota).
- **Huecos**: *ranking de reclamos* con los datos abiertos de la SSSalud (es noticia y consigue links), *mejores obras sociales con datos* (afiliados, reclamos), comparativas de obra social vs prepaga por marca (OSDEPYM vs OSDE).
- **Oferta**: match y cotizador.

### I. Autogestión ("mi osde", "credencial digital ioma", "app swiss medical", "turnos pami")
- **Demanda** ●●● pero **conversión baja**: quieren entrar a su cuenta, no comparar.
- **Tenemos** ◐ apps y teléfonos de prepagas.
- **Propuesta**: cubrirlo dentro de cada ficha ("cómo sacar la credencial", link oficial), sin páginas propias. Sirve para captar la marca y ofrecer el chequeo ("¿cuánto estás pagando?").

---

## 3. Cómo convertir cada búsqueda (la regla general)

**Responder primero, ofrecer después, y siempre con un número de la persona.** Quien busca "OSECAC teléfono" no vino a cotizar: si la página le da el teléfono rápido, confía; si además le muestra *"con tu sueldo de $X, pasar a Swiss Medical te cuesta $Y más por mes"*, una parte se convierte. Es el mismo patrón que funcionó en el chequeo.

| Busca | Primero le damos | Después le ofrecemos |
|---|---|---|
| Su obra social (teléfono, cartilla, código) | El dato, arriba y copiable | "Con tus mismos aportes, esta prepaga te cuesta $Y de diferencia" |
| Un trámite (cambio, CODEM, unificación) | El paso a paso oficial | "Antes de elegir, mirá si te alcanza para una prepaga" |
| Monotributo | Lista oficial y cuánto se paga por categoría | "Con tu monotributo, prepaga pagando la diferencia" |
| Me quedé sin trabajo | Qué le corresponde por ley (3 meses, seguro de desempleo) | Plan particular accesible para no quedarse sin cobertura |
| Una cobertura | Qué dice el PMO y qué planes lo mejoran | Match con ese uso marcado |
| Un sanatorio | Qué prepagas lo tienen | Mis sanatorios |
| Precio o aumento | El dato oficial | Chequeo de su plan |

**CTR (el título que se ve en Google)**: número concreto + año + dato oficial. Ejemplos: "OSECAC: teléfonos, cartilla y código 126205 (2026)", "Obras sociales para monotributistas: lista oficial de septiembre 2026", "Cambio de obra social en Mi SSSalud: paso a paso y errores comunes (2026)".

---

## 4. Arquitectura y enlazado

- **Hub de obras sociales** (`/obras-sociales`) con tres entradas: por nombre (buscador y códigos), por tipo (sindicales, de dirección, provinciales) y por provincia.
- **Hub de trámites** (`/tramites`) que sume los de obra social (hoy es solo de prepaga).
- Cada ficha de obra social enlaza a: código, cómo cambiarse, la calculadora de aportes y 2 o 3 prepagas que aceptan derivación en su zona (Swiss Medical primero donde corresponde).
- El buscador del sitio ya indexa todo esto: cada página nueva aparece ahí sin trabajo extra, y los eventos "Buscador sin resultados" van a decir qué falta.

---

## 5. Plan por fases

| Fase | Qué | Páginas | Por qué primero |
|---|---|---|---|
| **1** (2 semanas) | **Calculadora "de tu obra social a una prepaga"**: sueldo bruto → aporte (3% + 6%) → cuánto pagaría de diferencia en cada plan con precio oficial "con aportes". Va en cada ficha de obra social y en los trámites. | 1 herramienta | Convierte todo el tráfico de obras sociales sin partner |
| | **Fichas de obra social desde el registro** para las ~60 más grandes: código, razón social, teléfono y domicilio del registro de la SSSalud, web, provincias, si se puede elegir con la opción de cambio, cómo cambiarse, y la calculadora. | ~60 | Es el hueco más grande frente a la competencia |
| | **Seis guías de trámites**: opción de cambio en Mi SSSalud, unificación de aportes, cuánto tarda el cambio, obra social activa, reclamo ante la SSSalud, obra social al jubilarse. | 6 | Demanda alta y constante |
| **2** (2 semanas) | **Monotributo**: lista oficial de obras sociales habilitadas y cuánto se paga por categoría. **Empleo doméstico**, **hijos de 21 a 25**, **divorcio**. **Obras sociales por provincia** (con afiliados por provincia de los datos abiertos). | ~30 | Necesitan bajar listados oficiales (GitHub Action) |
| **3** (2 a 3 semanas) | **Ranking de reclamos** con datos abiertos de la SSSalud (activo de prensa), resto de las fichas del registro (en noindex hasta tener datos propios suficientes), "opiniones" en cada ficha. | ~300 | Volumen de cola larga y links |

**Cuidado con el contenido flaco**: 300 fichas iguales con el nombre cambiado es lo que Google castiga. Por eso primero las 60 más grandes, cada una con datos verificables propios, y el resto sin indexar hasta que tengan algo más que el código.

---

## 6. Lo que necesito de Darío

1. ~~Acceso a Search Console~~ **Recibido el export del 24-sep** (sección 0). Para seguir midiendo sin pedirlo cada vez: la Action semanal con cuenta de servicio. Y si tienen **Ahrefs** (hay un export de Ahrefs del 21-sep citado en el código), conectarlo en claude.ai suma los volúmenes de búsqueda.
2. **Precio oficial del OSDE Flux** (del cotizador de OSDE), para ponerlo en el título: "osde flux precio" suma ~400 impresiones en 2 semanas.
3. **Sucursales**: ¿avanzo con bajar las sucursales oficiales de cada prepaga para las páginas por ciudad?
4. **¿Usamos teléfono y domicilio del registro?** El listado que pasaste los trae (salen del registro de la SSSalud). En esta tanda los dejé afuera; para las fichas de obra social son el dato más buscado.
5. **Derivación de aportes**: confirmar con qué prepagas y planes podemos cotizar "con aportes" para cada tipo de trabajador (relación de dependencia, monotributo, empleo doméstico). La calculadora depende de esto.
6. **Listados oficiales a bajar** en la GitHub Action (la red de este entorno no llega a la SSSalud): obras sociales habilitadas para monotributo, afiliados por obra social y provincia, reclamos por entidad.
7. **Aprobar las fases** con el orden nuevo de la sección 0 (o cambiarlo).

## 7. Cómo vamos a saber si funciona

- Clics desde Google a páginas de obra social y trámites (Search Console).
- % de visitas de obra social que usan la calculadora, y % que deja el lead.
- Leads con fuente "calculadora-aportes" y cuántos terminan en venta (Kommo).
- Búsquedas sin resultado en el buscador del sitio (Vercel Analytics): la lista de pendientes sale de ahí.
