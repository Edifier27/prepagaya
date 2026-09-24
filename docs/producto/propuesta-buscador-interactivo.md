# Propuesta: un buscador de prepagas que empieza por tu vida

Fecha: 2026-09-24 · Estado: **aprobada y en marcha** (ver "Qué quedó hecho" al final)

## La idea en tres líneas

Todos los comparadores del mercado (MiObraSocial, ElegiMejor, CompareYa y hoy también PrepagaYa) hacen lo mismo: zona + edad → lista de planes → formulario. Nadie arranca por lo que de verdad le importa a la gente: **sus sanatorios, lo que ya paga y lo que va a usar**.

La propuesta es cambiar la entrada por **tres puertas según quién llega**, que terminan en un **informe personal guardado**. El informe se recibe por WhatsApp y trae **alertas de aumento** que hacen volver a la persona todos los meses.

Tenemos una ventaja que nadie tiene: los precios oficiales por edad y región de 8 prepagas y las cartillas oficiales por zona de 5, cruzados en una sola base.

---

## 1. Qué encontré en el mercado

### Qué funciona afuera (y por qué)

| Referente | Qué hace distinto | Qué tomamos |
|---|---|---|
| [Oscar Health](https://medium.com/oscar-tech/designing-a-better-provider-search-experience-858bc89d0032) (EE.UU.) | La búsqueda arranca por **médico, medicamento o clínica**, y el comparador de planes verifica que tus médicos estén | Buscar por sanatorio primero |
| [HealthCare.gov](https://www.healthcare.gov/choose-a-plan/your-total-costs/) | Cargás tus médicos y medicamentos, elegís cuánto vas a usar (bajo, medio, alto) y te muestra el **costo anual total**: cuota × 12 + copagos | Simulador de tu año de salud |
| [Lemonade](https://goodux.appcues.com/blog/lemonade-user-onboarding) | Cotización **conversacional** en menos de 90 segundos, no un formulario | Preguntas de a una, en lenguaje simple |
| [Zillow / Redfin](https://raw.studio/blog/using-maps-as-the-core-ux-in-real-estate-platforms) | Búsqueda **en el mapa**: la gente explora más y las consultas que llegan tienen más intención | Mapa de sanatorios cerca tuyo |
| [Kayak / Skyscanner](https://www.kayak.com/c/help/pricing/) | **Alertas de precio**: el usuario vuelve solo cuando cambia algo | Alerta de aumento de tu prepaga |
| [Spotify Wrapped](https://nogood.io/blog/spotify-wrapped-marketing-strategy/) | Resultado **personal y compartible**: más de 500 millones de veces compartido el primer día de 2025 | Tarjeta "tu prepaga en 2026" para compartir |

### Datos de conversión que respaldan el formato

- **Quizzes de recomendación**: en promedio, 40,1% de quienes empiezan un quiz terminan dejando sus datos ([Interact, 2026](https://www.tryinteract.com/blog/quiz-conversion-rate-report/)). La landing mediana convierte 6,6%.
- **Formularios por pasos**: 13,9% contra 4,5% de un formulario en una sola página (Formstack), y 86% más según HubSpot ([resumen](https://ventureharbour.com/multi-step-lead-forms-get-300-conversions/)).
- **Chat**: quienes conversan con un asistente convierten cerca de 4 veces más que quienes no (12,3% contra 3,1%), según relevamientos de comercio conversacional ([Gorgias, 2026](https://www.gorgias.com/blog/conversational-commerce-trends-ai-conversational-shopping)).
- **WhatsApp en Argentina**: según relevamientos regionales, más de 2 de cada 3 compras por conversación se cerraron por WhatsApp en el primer trimestre de 2026 ([Aurora Inbox](https://www.aurorainbox.com/en/2026/03/04/estadisticas-ecommerce-whatsapp-latam/)).
- **Esfuerzo propio = retención**: cuando la persona arma algo (su lista de sanatorios, su perfil), lo valora más y vuelve (efecto IKEA; [Amplitude](https://amplitude.com/blog/onboarding-ikea-effect-retention)).

Los números de proveedores de herramientas son de referencia, no leyes: por eso todo esto va con **test A/B** (sección 8).

### Qué hace la competencia local

- **MiObraSocial**: formulario, comparación y opiniones de usuarios. Su fuerte es el PR con sondeos.
- **ElegiMejor**: "Compará en 30 segundos", formulario y YouTube.
- **ConectaSalud**: ranking del mercado, y admite que no hay un ranking de satisfacción con metodología robusta ([fuente](https://conectasalud.com.ar/ranking)).
- **Ninguno** cruza cartillas de varias prepagas, ni muestra el precio oficial por edad, ni avisa cuando aumenta tu plan.

### Qué pasa hoy en PrepagaYa

El cotizador pide zona y edades, muestra los precios borrosos 3 segundos y pide nombre, celular y email para verlos. Al mismo tiempo, `/precios` muestra todos los precios sin pedir nada. Además, la búsqueda por sanatorio ya existe en `/cartillas`, pero de a un sanatorio, sin precio para tu edad y escondida.

---

## 2. La propuesta: tres puertas y un informe

La portada deja de ser un solo formulario y pregunta **"¿Cómo querés empezar?"**:

### Puerta 1 · "Mis sanatorios" (buscador inverso por cartilla)

1. Escribís el o los sanatorios, clínicas o centros que usás, o tu barrio. Se autocompleta con los **2.917 centros** de las cartillas oficiales de Swiss Medical, OSDE, Sancor Salud, Avalian y Premedic.
2. Te mostramos **qué planes los cubren a todos**, para internación y guardia, y desde qué plan de cada prepaga.
3. Ves el **precio oficial para tu edad y tu región** (cuadros de la SSSalud), no el de "una persona de 30 años".
4. Un **mapa** con los sanatorios cerca tuyo, coloreados según qué planes los cubren.

- **Por qué funciona**: es la pregunta número uno de la gente ("¿está el Italiano?", "¿me cubre el Otamendi?") y hoy la resuelve entrando a 5 cartillas distintas. Es el modelo de Oscar y HealthCare.gov.
- **Swiss Medical**: con 9 sanatorios propios, el ICBA y más de 30 SMG Center en AMBA, aparece como opción en la mayoría de las búsquedas de AMBA, con su etiqueta de partner.
- **Datos**: ya los tenemos todos (cartillas por zona y plan, más tarifas oficiales por edad).

### Puerta 2 · "Ya tengo prepaga" (chequeo de tu cuota)

1. Elegís tu prepaga, tu plan, tu edad y tu zona.
2. Te decimos cuánto sale tu plan hoy según la lista oficial, **cuánto aumentó en el año contra la inflación**, cuánto va a salir el mes que viene (en cuanto se publica el cuadro) y **qué planes con tus mismos sanatorios te salen menos**.
3. **"Avisame cuando aumente"**: alerta por WhatsApp, email o notificación cada vez que la SSSalud publica el cuadro nuevo (cada 15 días, como ya lee el sitio).

- **Por qué funciona**: el tráfico de "aumento de prepagas" y "aumento de [prepaga] [mes]" es enorme, es informativo y hoy no deja leads. El chequeo lo convierte en una persona que ya tiene prepaga y quiere pagar menos: el lead de cambio. Las alertas la traen de vuelta todos los meses, como las de precio de Kayak.
- **Swiss Medical**: entre las alternativas con los mismos sanatorios, Swiss va primero cuando cumple.
- **Datos**: aumentos oficiales por prepaga y mes, tarifas por edad y región, e IPC del INDEC (para comparar contra la inflación).

### Puerta 3 · "No sé por dónde empezar" (match en 60 segundos)

1. Seis a ocho tarjetas de "esto o aquello", de a una y con el pulgar en el celular:
   - ¿Sanatorio propio o red abierta?
   - ¿Cuota más baja con copago, o cuota fija?
   - ¿Hacés terapia? ¿Chicos con ortodoncia? ¿Viajás seguido? ¿Hacés deporte?
2. **Simulador de tu año de salud**: costo anual real = cuota × 12 + copagos estimados − reintegros, con los topes oficiales de cada plan (sesiones de psicología, ortodoncia, anteojos) que ya cargamos.
3. Resultado: "Tu match: Swiss Medical SMG20, 92%", con el porqué y dos alternativas.

- **Por qué funciona**: es el formato con mejor tasa de lead (quizzes, alrededor de 40%), y el costo anual muestra lo que ningún comparador muestra: que el plan más barato de cuota no siempre es el más barato del año.
- **Swiss Medical**: el perfil deportista matchea con Sport, único en el mercado con reintegros de gimnasio, nutrición y kinesiología, y los perfiles que priorizan sanatorio propio matchean con Swiss. Los empates se ordenan por la prioridad de partners que ya usa el sitio.

### Lo común a las tres: "Tu informe"

- **Precios visibles primero**: son datos oficiales y ya están en `/precios`. El dato se pide en el momento de más valor: "Te mando el informe y la cotización formal con el 15% por WhatsApp". **Esto se testea A/B** contra el embudo actual antes de cambiarlo.
- **Página propia del informe** (sin indexar), guardada en el navegador y enviada por WhatsApp: lo que la persona armó (sus sanatorios, su perfil) no se pierde, y vuelve a eso.
- **Tarjeta para compartir**, estilo Wrapped: "Mi prepaga subió 29% en 2026 y la inflación 19%. ¿Y la tuya?" (sale del chequeo). Trae tráfico y, a veces, notas de prensa.
- **El asesor recibe todo**: sanatorios, cobertura actual, perfil y plan elegido. Eso ya empezó con los campos nuevos del lead.

### Fase 4: asistente conversacional

"Preguntale a PrepagaYa": un chat que responde **solo con los datos del sitio** y cita la fuente. Por ejemplo: "¿El Hospital Alemán está en el SMG20?" → "Sí, para internación y guardia, según la cartilla oficial de Swiss Medical de septiembre".

- Cuando la persona quiere avanzar, la pasa al asesor por WhatsApp.
- Va último porque en salud un error cuesta caro: solo respuestas con dato y fuente, nunca consejo médico.

---

## 3. Datos

| | Qué | Estado |
|---|---|---|
| **Ya tenemos (oficial)** | Precio por edad y región: 8 prepagas, 65 planes (SSSalud) | ✅ |
| | Aumento oficial por prepaga y mes | ✅ |
| | Cartillas por zona y plan: 5 partners, 2.917 centros con dirección | ✅ |
| | Coberturas plan por plan (comparativos oficiales de Swiss, Avalian, OSDE, Premedic) | ✅ |
| | Códigos RNAS, apps (Google Play), reseñas propias, leads (sondeo) | ✅ |
| **Oficiales para sumar** | [Usuarios de prepagas por provincia](https://datos.gob.ar/sq/dataset/salud-cantidad-usuarios-empresas-medicinas-prepagas) (SSSalud): "en tu provincia, X% elige…" | A bajar |
| | Gestión de reclamos por provincia (SSSalud, [datos abiertos](https://datos.salud.gob.ar/dataset?groups=estadisticas-de-servicios)) | A bajar |
| | IPC del INDEC (aumento contra inflación) | A bajar |
| **A scrapear o mapear** | Cuadros de Omint, Medicus, CEMIC y Hospital Italiano: ya declaran a la SSSalud; es sumarlos al script actual | Script existente |
| | Cartillas de Galeno y Medifé (mismo método que las otras 5) | Script nuevo |
| | Geocodificar las 2.917 direcciones para el mapa (OpenStreetMap, gratis) | Script nuevo |
| **No hacer** | Scrapear reseñas de Google Maps (lo prohíben sus términos; si hace falta, API oficial de Places) | — |

**Dónde corre el scraping**: este entorno tiene la red cerrada, pero la GitHub Action que ya baja los cuadros de la SSSalud cada 15 días tiene internet. Los scrapers nuevos se suman ahí, con el mismo control de "si algo salta raro, no publica y avisa por Telegram".

---

## 4. Swiss Medical primero, sin engañar a nadie

- En cada resultado, **ordenamiento por la prioridad de partners** que ya usa el sitio (Swiss, Premedic, Avalian, Sancor), dentro de lo que cumple el pedido de la persona.
- **Etiqueta visible "Partner PrepagaYa"** y la aclaración de que cobramos comisión de la prepaga. Es lo que ya dicen el home y los términos.
- **Si Swiss no cubre el sanatorio que buscó la persona, no se muestra como si lo cubriera.** En salud, una recomendación falsa se paga con reclamos y con reputación (La Nación: 66% de las causas del fuero civil y comercial son reclamos contra obras sociales o prepagas; [fuente](https://www.lanacion.com.ar/politica/el-66-de-las-causas-iniciadas-en-el-fuero-civil-y-comercial-son-reclamos-contra-obras-sociales-o-nid20092026/)).

---

## 5. SEO

Cada puerta tiene su página indexable, para búsquedas que hoy no atacamos bien:

| Herramienta | Búsquedas |
|---|---|
| `/buscar-por-sanatorio` | "qué prepaga cubre el [sanatorio]", "prepaga con [sanatorio]" (se enlaza con las 43 páginas de sanatorio) |
| `/chequeo-prepaga` | "cuánto va a aumentar mi prepaga", "calcular aumento prepaga" (se enlaza desde el bloque de aumento de cada ficha) |
| `/match-prepaga` | "qué prepaga me conviene", "test prepaga" |

Los informes personales no se indexan.

---

## 6. Plan por fases

| Fase | Qué | Esfuerzo | Por qué en este orden |
|---|---|---|---|
| 1 | Puerta "Mis sanatorios" + informe + WhatsApp, con test A/B en el home | 2 a 3 semanas | Los datos ya están y es lo más buscado |
| 2 | Puerta "Ya tengo prepaga" + alertas de aumento + tarjeta compartible | 2 semanas | Convierte el tráfico de aumentos y trae de vuelta a la gente |
| 3 | Puerta "Match" + simulador anual + datos nuevos (mapa, cuadros restantes, usuarios por provincia) | 3 semanas | Necesita datos que hay que sumar |
| 4 | Asistente conversacional con datos del sitio | 2 a 3 semanas | Solo con las fases anteriores en marcha |

**Test A/B** (Vercel ya permite flags por porcentaje de tráfico): 50% ve el home actual y 50% las tres puertas, al menos 2 semanas o hasta tener leads suficientes para comparar.

**Métricas**:
- % de sesiones que terminan en lead (la principal).
- % de leads que después cierran venta (desde Kommo).
- Visitantes que vuelven (por alertas).
- Tiempo en el sitio.
- Suscripciones a alertas.
- % de leads que terminan en Swiss Medical.

---

## 7. Decisiones que necesito

1. **¿Mostrar precios antes de pedir datos?** Lo propongo solo como test A/B, no como cambio directo.
2. **Alertas**: ¿por WhatsApp (API de WhatsApp Business, tiene costo por mensaje), por email y notificaciones (gratis), o las dos?
3. **Orden de las fases**: recomiendo empezar por "Mis sanatorios".
4. **Scraping**: ¿lo sumamos a la GitHub Action existente, o habilitás los dominios en este entorno (sssalud.gob.ar, datos.gob.ar, mediflow.com.ar, nominatim.openstreetmap.org)?
5. **Nombre de la experiencia** (para la marca y para prensa). Algunas opciones: "PrepagaYa a medida", "Tu prepaga al revés", "Radar PrepagaYa".

---

## Qué quedó hecho (24-sep-2026)

Darío aprobó las cuatro herramientas con una condición: **el precio exacto para la edad se sigue mostrando recién después de dejar los datos** (con poco tráfico, el precio abierto hace que la gente no responda al asesor). Todas lo respetan: la cobertura, el aumento o el match se ven gratis; el precio de las opciones, con el lead.

| Herramienta | URL | Qué se ve sin datos | Qué se ve con datos | El lead lleva |
|---|---|---|---|---|
| Mis sanatorios | `/buscar-por-sanatorio` | Por prepaga, el plan más bajo que incluye todos los sanatorios elegidos (internación y guardia) | Precio de ese plan para el grupo | `fuente: buscar-por-sanatorio`, sanatorios elegidos |
| Chequeo de prepaga | `/chequeo-prepaga` | Precio oficial del plan propio, aumento del mes que viene contra el promedio, cuántos planes parecidos salen menos y hasta cuánto se ahorra | Qué planes son y cuánto sale cada uno | `fuente: chequeo-prepaga`, prepaga y plan actual |
| Match | `/match-prepaga` | El plan que más coincide y dos alternativas, con cada punto a favor y en contra | Precio mensual y anual | `fuente: match-prepaga`, copago, coberturas y perfil |
| Buscador del sitio | En el encabezado de todas las páginas y en el home | Prepagas, planes, 1.400 sanatorios, obras sociales, códigos, coberturas, comparativas, zonas y guías; siempre lleva a una página nuestra | — | Lo que se busca queda en Vercel Analytics (eventos "Buscador" y "Buscador sin resultados") |

Además: las tres puertas en el home (debajo del cotizador, que sigue siendo la entrada principal), links desde cada ficha de prepaga (chequeo con la prepaga ya elegida), desde `/aumentos` y desde cada página de sanatorio (el buscador abre con ese sanatorio cargado).

### Lo que falta y necesita una decisión

1. **Asistente conversacional** (fase 4): necesita una clave de la API de Claude cargada en Vercel y un tope de gasto mensual. Propuesta: que responda solo con los datos del sitio (el mismo índice del buscador, las cartillas y los cuadros) y cite la fuente, y que pase a WhatsApp cuando la persona quiere avanzar.
2. **Alertas de aumento**: el chequeo todavía no suscribe a alertas. Por email y notificación del navegador es gratis (la base y las notificaciones ya existen); por WhatsApp tiene costo por mensaje.
3. **Test A/B del home** con las tres puertas arriba del cotizador (hoy están debajo, para no tocar la conversión actual).
4. **Mapa de sanatorios**: falta geocodificar las direcciones (script en la GitHub Action).
