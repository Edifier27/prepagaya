# Auditoría de navegación y orden del sitio (17-nov-2026)

Pedido de Darío: revisar cómo están ordenadas las cosas, si el cliente se pierde y si hay que mover cajas, en el home y en el resto del sitio (planes, cartillas, etc.).

## Fuentes y límites

- **Vercel Analytics**, del 18-oct al 17-nov-2026:
  - visitas por página;
  - leads ("Lead enviado"), con la página desde donde la persona fue a cotizar;
  - búsquedas del buscador.
- **Recorrido del sitio** (build de producción de `main` del 17-nov) en dos pantallas: celular (iPhone 13, 390 × 664) y compu (1440 × 900).
  - 23 páginas: las de más tráfico de cada tipo.
  - Se midió en qué pantalla cae cada título y cada botón, qué queda fijo en la pantalla y cuánto mide cada página.
  - El cotizador se recorrió hasta el formulario, sin enviar datos.
- **Informes anteriores de Clarity** (clics muertos): commits del 19-oct, 27-oct y 9-nov.
- **Límites**:
  - Vercel no mide salidas ni hasta dónde baja la gente.
  - "Página del lead" es la última página antes de ir a cotizar.
  - Los visitantes por sección suman tipos de página, así que una persona puede contar en dos.

## Resumen

1. **El cliente casi nunca entra por el home.**
   - Google trae 12.948 de unos 18.100 visitantes (71%), directo a una ficha de plan, una cartilla o una obra social.
   - El home tiene 650 visitantes (3,6%).
   - Lo que más importa es el orden de esas páginas internas.
2. **En el celular, las fichas de plan tapan un tercio de la pantalla con cosas fijas.**
   - El celular trae el 55% de las visitas y el 61% de los leads.
   - Al cargar la página, las orejitas de plan tapan el botón de cotizar.
3. **Hay unos 60 textos distintos de botón para 3 acciones.** En la misma página, un botón abre el formulario y otro lleva al cotizador.
4. **Algunas páginas ofrecen lo contrario de lo que busca la persona.** La guía para dar de baja Swiss Medical muestra "Cotizá Swiss Medical · 15% OFF".
5. **Hay páginas muy largas sin índice.** En el celular, la ficha de Swiss mide 37 pantallas, la cartilla de Swiss 30 y los códigos de obras sociales 72.
6. **El menú y el home destacan herramientas que casi nadie usa** (13 a 53 visitantes por mes cada una).

## Cómo llega y dónde convierte la gente (18-oct al 17-nov)

| | Visitantes | Leads (personas) | % |
|---|---|---|---|
| Total | ~18.100 | 749 | 4,1% |
| Celular | 10.020 | 455 | 4,5% |
| Compu | 7.905 | 290 | 3,7% |

| Sección | Visitantes | Leads | % aprox. |
|---|---|---|---|
| Home | 650 | 137 | 21% |
| Prepagas: fichas, planes, provincias y localidades (`/prepagas/...`) | ~6.700 | 282 | 4,2% |
| Perfiles (`/para/...`) | 755 | 30 | 4,0% |
| Sanatorios | 1.253 | 30 | 2,4% |
| Cartillas de prepagas | ~3.700 | 78 | 2,1% |
| Coberturas | ~940 | 18 | 1,9% |
| Obras sociales | ~4.750 | 22 | 0,5% |
| Guías | 1.962 | 9 | 0,5% |
| Comparativas (`/comparativas/...`) | 429 | 2 | 0,5% |

Otros 147 leads tienen como página el cotizador mismo: entraron directo o sin página previa.

| Ficha de plan | Visitantes | Leads | % |
|---|---|---|---|
| /prepagas/osde/210 | 363 | 12 | 3,3% |
| /prepagas/swiss-medical/smg20 | 232 | 3 | 1,3% |
| /prepagas/swiss-medical/smg30 | 196 | 3 | 1,5% |
| /prepagas/osde/310 | 180 | 2 | 1,1% |
| /prepagas/swiss-medical/s1 | 142 | 6 | 4,2% |
| /prepagas/swiss-medical/smg02 | 131 | 0 o 1 | <1% |
| /prepagas/premedic/plan-c100 | 115 | 12 | 10,4% |

**Lectura**:
- Obras sociales y guías traen unos 6.700 visitantes por mes y casi no generan leads. Es esperable: quien busca "cartilla de OSECAC" o "qué obra social tengo" ya está afiliado. No conviene llenarlas de botones.
- El margen está en las fichas de plan de Swiss y en las cartillas, donde la gente elige o compara planes.

## Lo que funciona (no tocar)

- **El cotizador es corto**:
  - pasos: provincia (en producción se detecta sola por IP), edades, "Ver precios", vista previa de planes;
  - después, un formulario con 2 datos obligatorios (nombre y celular).
  - En compu y en celular se entiende.
- **El home convierte el 21%.** El podio de las 3 prepagas (Swiss recomendada, Sancor, Premedic) es claro.
- **Las fichas de prepaga dicen el precio en el primer párrafo.** Ejemplo de Swiss: "el S1 sale $174.342 por mes con 15% OFF".
- **Las migas de pan** (breadcrumb) están en todas las páginas internas.
- **La barra fija "Cotizá … Ver mi precio" del celular**:
  - aparece recién al bajar y se esconde al llegar al pie;
  - trajo 65 leads en el mes (fuente "barra").

## Hallazgos, de mayor a menor impacto

### 1. Celular: un tercio de la pantalla tapado en las fichas de plan

- **Qué pasa**:
  - Al bajar en una ficha de plan quedan fijos cuatro elementos: el header (65 px), las orejitas "SMG02 ↓ / ↑ SMG30", la barra "Cotizá … Ver mi precio" y el menú de abajo. Ocupan 221 de 664 px: queda libre el 67% de la pantalla.
  - Al cargar la página, las orejitas tapan el botón "Cotizá con 15% OFF" y el link "Comparar este plan con otro".
  - La barra y el menú de abajo muestran, uno arriba del otro, dos botones que van al mismo lugar: "Ver mi precio" y "Cotizador −15%".
- **Qué propongo**:
  - (a) Que las orejitas aparezcan recién después de pasar el recuadro de arriba, como la barra.
  - (b) Que mientras se ve la barra de cotizar se esconda el menú de abajo, porque la barra ya es el botón principal. Así queda libre cerca del 75%.
- **Alcance**: todas las fichas de plan (3.673 visitantes por mes) y, por el punto (b), todas las páginas que tienen barra.
- **Esfuerzo**: chico (`OrejitaPlan.tsx`, `BottomNav.tsx`, `BarraCotizar.tsx`).
- **Hecho (17-nov-2026)**: Darío pidió sacar las orejitas, en celular y en compu.
  - En el celular, al bajar, la pantalla libre pasó de 443 a 490 px (de 67% a 74%).
  - Arriba de todo, el botón de cotizar ya no queda tapado.
  - El paso a otros planes sigue en la página: "Otros planes", "Diferencias entre…" y el comparador de planes.
  - Queda pendiente el punto (b).

### 2. Fichas de plan de Swiss: el título promete el precio y el precio está a 5,5 pantallas

- **Qué pasa**:
  - En Google, la ficha del SMG20 dice "Swiss Medical SMG20 precio noviembre 2026: desde $361.459/mes".
  - En el celular, el recuadro de arriba no tiene ningún número: dice "Conseguí un mejor precio. Cotizá a tu medida".
  - La tabla de precios por edad aparece en la pantalla 5,5, después de la cartilla de la zona y de "¿Qué es el plan?".
  - En el OSDE 210, en cambio, la tabla está en la pantalla 1,5 y arriba de todo hay un link "Precio del 210 por edad ↓".
- **Datos**:
  - Convierten: SMG20 1,3%, SMG30 1,5%, SMG02 menos de 1%. OSDE 210 3,3%, Premedic C-100 10,4%.
  - No toda la diferencia es por el orden: quien busca el SMG20 muchas veces ya es socio y quiere la cartilla. Pero lo que promete el título no se cumple arriba.
- **Qué propongo**:
  - No mover la cartilla: es lo que más se busca de Swiss (`docs/seo/keyword-research-planes-2026-11.md`).
  - Sumar al recuadro de arriba una línea: "Precio de lista desde $361.459 por mes (30 años, CABA y GBA) · Ver por edad ↓", como en OSDE.
- **Esfuerzo**: chico.

### 3. Un nombre para cada acción

- **Qué pasa**:
  - En las 23 páginas recorridas hay unos 60 textos distintos de botón para 3 acciones: ir al cotizador, abrir el formulario y hablar con un asesor. Algunos de esos textos:
    - "Cotizá con 15% OFF", "Cotizá a tu medida", "Ver mi precio";
    - "Quiero mi precio con 15% OFF", "Cotizar mi precio", "Cotizar gratis";
    - "Cotizar precio", "cotizá acá", "Consultar mi convenio".
  - En la ficha de plan, el botón de arriba abre un formulario (fuente "ficha-plan": 74 leads) y la barra lleva al cotizador (65 leads). Son dos caminos distintos para el mismo pedido.
  - En el menú de abajo del celular:
    - "Presupuesto", con ícono de signo de pregunta, lleva a una página con 50 visitantes por mes;
    - "Planes" lleva al listado de prepagas.
- **Qué propongo**:
  - Dos nombres fijos: "Ver mi precio" para todo lo que lleva al cotizador y "Hablar con un asesor" para el formulario.
  - En el menú de abajo, "Presupuesto" pasa a "Cartillas" (3.700 visitantes por mes) y "Planes" pasa a "Prepagas".
- **Esfuerzo**: medio (muchos archivos, solo cambian textos).

### 4. Ofertas que van contra lo que busca la persona

- **Qué pasa**:
  - En "Cómo dar de baja Swiss Medical", la barra dice "Cotizá Swiss Medical · 15% OFF".
  - Lo mismo pasa en las guías de baja de OSDE y de Sancor, porque la barra toma la primera prepaga que nombra la guía.
  - Las 3 guías suman unos 226 visitantes por mes.
- **Qué propongo**: en las guías de baja, que la barra diga "Antes de darte de baja, compará" y lleve al cotizador sin prepaga elegida.
- **Esfuerzo**: chico.

### 5. Cartilla por zona: la decisión llega tarde

- **Qué pasa**: `/cartillas/swiss-medical/caba` es la cartilla más visitada. El orden en el celular es:
  1. sanatorios (pantalla 1,3);
  2. guardias (pantalla 4,3);
  3. "¿No encontrás tu sanatorio?", con unos 20 botones rojos "Cotizar Premedic / Avalian / Sancor / OSDE" (pantalla 7,3). Ese bloque trajo 3 leads en el mes (fuente "cartilla-cruce");
  4. recién en la pantalla 10,6, la tabla "¿Qué plan de Swiss Medical necesitás en CABA?".
- **Qué propongo**:
  - Subir la tabla del plan justo después de los sanatorios.
  - Plegar el cruce con otras prepagas detrás de un botón "Ver qué prepagas tienen tu sanatorio".
- **Esfuerzo**: chico.

### 6. Páginas muy largas sin índice

- **Ficha de Swiss Medical**: 37 pantallas en el celular y 21 secciones.
  - Los teléfonos están en la pantalla 11,5 y las preguntas frecuentes en la 28,5.
  - Hay 12 botones rojos iguales "Cotizar con 15% OFF" seguidos, uno por plan.
- **Cartilla de Swiss**: 30 pantallas, de las cuales unas 10 son botones de zona (412 zonas).
- **Códigos de obras sociales**: 72 pantallas. El filtro está en la pantalla 2,3 y no queda a mano al bajar.
- **Qué propongo**:
  - (a) Un índice "En esta página" plegable arriba de las fichas de prepaga. Las guías ya tienen uno (`BlogTOC`).
  - (b) En las cartillas, las zonas en un selector por provincia con buscador, en vez de 412 botones. Los links pueden seguir en el HTML para Google, plegados.
  - (c) El filtro de códigos fijo arriba al bajar.
  - (d) En la lista de planes de la ficha, el botón de cada plan en gris (secundario) y uno rojo al final.
- **Esfuerzo**: medio.

### 7. Home: el orden después del cotizador

- **Qué pasa** (orden en el celular):
  1. cotizador (pantalla 0,6);
  2. "¿Cómo querés empezar?", con 6 atajos a herramientas (pantalla 1,2);
  3. grilla "Mirá todos los planes", con OSDE segunda y botones rojos "Ver más" (pantalla 2,4);
  4. podio de las 3 recomendadas (pantalla 3,8).
- **Uso de las herramientas de los atajos** (visitantes por mes):
  - chequeo de cuota: 53;
  - buscar por sanatorio: 50;
  - test: 44;
  - guardias cerca: 20;
  - fertilización: 13.
- En compu se ven dos escaleras 1-2-3 seguidas: la del encabezado ("Cotizás gratis / Comparás / Vos decidís") y la del cotizador ("Zona / Integrantes / Ver precios").
- **Qué propongo**:
  - El podio de las 3 recomendadas justo después del cotizador.
  - Los atajos más abajo, o 3 en vez de 6.
  - "Ver más" de la grilla como link, no como botón rojo igual al principal.
  - Una sola escalera 1-2-3 en compu.
- **Impacto**: bajo en volumen (650 visitantes), pero es la página que mejor convierte. Conviene probar y medir.
- **Esfuerzo**: chico.

### 8. Menú

- **Qué pasa**:
  - **Compu**: "Herramientas" tiene 10 entradas y 3 llevan la etiqueta "Nuevo".
  - **Celular**: el menú abre con las herramientas ("¿Qué prepaga me conviene?", "¿Pagás de más?"…). La lista de prepagas está plegada más abajo, aunque las fichas de prepaga y de plan son lo más visitado.
- **Qué propongo**:
  - En el celular, primero "Prepagas" (abierta) y "Cartillas", y después las herramientas.
  - Sacar la etiqueta "Nuevo".
- **Esfuerzo**: chico.

### 9. Comparativas sin botón en el momento de decidir

- **Qué pasa**: en `/comparativas/swiss-medical-vs-osde`, el veredicto está en la pantalla 2,3 y el primer botón, sin contar la barra, en la 7,2. Las comparativas traen 429 visitantes y 2 leads por mes.
- **Qué propongo**: un botón "Ver el precio de las dos para mi edad" debajo del veredicto.
- **Esfuerzo**: chico.

### 10. Pie de página, buscador y listado de prepagas

- **Pie de página**: en el celular mide 5,2 pantallas (99 links en 9 columnas) y está en todas las páginas.
  - Propongo columnas plegables en el celular. Los links siguen para Google.
- **Buscador**: lo usan 111 personas por mes y el 40% de las búsquedas no encuentra nada. Las causas:
  - errores de tipeo: "Avaian", "Avaliam", "Promedic", "Medie", "Galeno qzul";
  - búsquedas de médicos: "cardiólogos", "dermatóloga", "nutricionista".
  - Propongo que tolere errores de tipeo y que, cuando buscan un médico, explique que no listamos médicos y lleve a la cartilla oficial.
- **`/prepagas`**: los bloques "Prepagas por provincia" y "¿Qué es la medicina prepaga?" quedaron en medio de la lista (entre Medicus y OSDE, y entre Luis Pasteur y Hominis).
  - Propongo pasarlos al final.
- **Esfuerzo**: chico cada uno.

## Orden de trabajo propuesto

1. **Tanda 1** (chica, un PR):
   - puntos 1, 2, 4, 5 y 9, más el orden de `/prepagas`;
   - medir a las 2 semanas en Vercel los leads de fichas de plan (fuentes "ficha-plan" y "barra"), de cartillas y de comparativas.
2. **Tanda 2**: puntos 3 (nombres de botones y menú de abajo), 7 (home) y 8 (menú). Necesita el OK de Darío en los nombres.
3. **Tanda 3**: puntos 6 (índices y selector de zonas) y 10.

## Para decidir (Darío)

- **Botón de arriba de la ficha de plan**: ¿sigue abriendo el formulario o lleva al cotizador, que muestra los planes y el precio "desde"?
- **Guías de baja de Swiss**: a quien se va por el precio, ¿le ofrecemos un plan más barato de Swiss o el comparador abierto?

## Para medir mejor

- **Eventos nuevos en Vercel**: clic en cada ítem del menú de abajo, en las orejitas, en los atajos del home y en el índice. Hoy no se sabe cuánto se usan.
- **Clarity**: mirar hasta dónde baja la gente en la ficha de Swiss y en la cartilla de CABA. Eso confirma o descarta el punto 6.
