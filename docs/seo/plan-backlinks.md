# Plan de backlinks — PrepagaYa

Fecha: 2026-09-24 · Objetivo: pasar a MiObraSocial y ElegiMejor en autoridad.

## Qué hace la competencia (y por qué rankea)

- **MiObraSocial**: su autoridad sale de **PR con datos propios**. Publica sondeos a sus usuarios ("63% quiere cobertura privada", "70,6% hace un esfuerzo alto para mantener la prepaga") y los medios los levantan con link: [Revista Mercado](https://mercado.com.ar/tendencias/sondeo-de-miobrasocial-afiliados-de-prepagas-comparan-costos-sin-resignar-cobertura-medica/), [Infobae](https://www.infobae.com/economia/2025/11/26/prepagas-casi-6-de-cada-10-argentinos-intentara-mantener-su-plan-actual-de-salud-el-proximo-ano/), Clarín, TN, El Cronista, [ON24](https://www.on24.com.ar/sin-categoria/miobrasocial-com-ar-cuenta-con-un-comparativo-de-prepagas-para-que-puedas-elegir-tu-cobertura-medica/). Tiene una página [/prensa/](https://www.miobrasocial.com.ar/prensa/) que junta todo.
- **ElegiMejor**: notas de "startup" ([Infonegocios](https://infonegocios.info/y-ademas/elegimejor-com-ar-la-startup-que-compara-prepagas-y-lanza-un-servicio-para-empresas)), el ángulo "el Trivago de las prepagas" y un [canal de YouTube](https://www.youtube.com/@elegimejor-comparar-prepagas).

**Nuestra ventaja**: ya tenemos lo que ellos no, el **dato oficial de la SSSalud** procesado cada 15 días (`/prensa`, `/aumentos`, CSV y schema Dataset). Los medios publican el aumento de prepagas todos los meses: si somos la fuente más rápida y más clara, nos citan todos los meses.

## Activos para ganar links (ya en el sitio)

| Activo | URL | Para quién |
|---|---|---|
| Informe mensual de aumentos + CSV | `/prensa` | Periodistas de economía |
| **Widget embebible** del aumento por prepaga (nuevo) | `/widget/aumentos`, código en `/prensa` | Blogs, abogados, contadores, medios regionales |
| Tabla de precios oficial del mes | `/precios` | Periodistas, blogs de finanzas |
| Precios por edad y plan | `/prepagas/[prepaga]/[plan]`, `/calculadora` | Blogs de expats, asesores |
| Qué prepaga atiende en cada sanatorio | `/sanatorios/[slug]` | Medios regionales |
| Guías en inglés, ruso y chino para extranjeros | `/en/*`, `/ru/*`, `/zh/*` | Blogs de expats, universidades |
| Beneficios impositivos para empresas | `/empresas/beneficios-impositivos` | RRHH, contadores |

El widget pone el link **fuera** del iframe y con la marca como texto ("PrepagaYa"), no con una keyword: es lo que Google acepta. No cambiarlo a "aumento de prepagas".

## Todos los objetivos que encontré

Prioridad: **A** = alta probabilidad y autoridad, empezar ya · **B** = buena · **C** = de relleno o solo tráfico.

### 1. Medios nacionales (dato mensual de aumentos)

Gancho: *"Las prepagas aumentan X% en [mes] según los cuadros oficiales de la SSSalud: ranking por empresa"*. Mandarlo el mismo día que se actualiza `/prensa`.

| # | Medio | Por qué | Prio |
|---|---|---|---|
| 1 | [El Economista](https://eleconomista.com.ar/economia/prepagas-cuanto-cobra-cada-empresa-mas-barata-n93321) | Ya publicó "cuál es la más barata" con datos de la SSSalud: nuestro dato es la versión procesada | A |
| 2 | [Chequeado — El explicador](https://chequeado.com/el-explicador/aumentan-las-prepagas-en-agosto-de-2025-cuanto-cuesta-cada-plan-y-que-paso-con-la-cuota-desde-que-asumio-milei/) | Hace la nota de aumentos cada mes y cita fuentes con link | A |
| 3 | [Revista Mercado](https://mercado.com.ar/tendencias/miobrasocial-midio-demanda-insatisfecha-de-prepagas-63-quiere-cobertura-privada) | Publica los sondeos de MiObraSocial: acepta gacetillas del rubro | A |
| 4 | [Ámbito](https://www.ambito.com/economia/las-prepagas-confirmaron-nuevos-aumentos-octubre-n6192397) | Nota de aumentos todos los meses | A |
| 5 | [iProfesional](https://www.iprofesional.com/management/437606-las-3-prepagas-mas-baratas-en-argentina-en-septiembre-2025) | Hace "las prepagas más baratas del mes" | A |
| 6 | [Perfil](https://www.perfil.com/noticias/economia/las-prepagas-aumentaron-78-puntos-por-encima-de-la-inflacion-interanual.phtml) | Aumentos vs inflación: tenemos la serie | A |
| 7 | Infobae (Economía) | Levantó el sondeo de MiObraSocial | A |
| 8 | Clarín (Economía / Sociedad) | Ídem | B |
| 9 | La Nación (Economía) | Ídem | B |
| 10 | El Cronista ([ya cubre reclamos](https://www.cronista.com/economia-politica/la-lista-completa-de-prepagas-que-deberan-retrotraer-los-aumentos-como-pedir-la-devolucion-y-donde-hacer-el-reclamo/)) | Aumentos, reclamos, monotributo | B |
| 11 | TN (Economía) | Ídem | B |
| 12 | [Bloomberg Línea](https://www.bloomberglinea.com/latinoamerica/argentina/prepagas-argentina-informara-precios-en-sitio-web-para-que-usuarios-comparen-tarifas-y-planes/) | Cubrió el sistema de cuadros tarifarios | B |
| 13 | Noticias Argentinas (agencia) | Una nota de agencia se replica en decenas de diarios | A |
| 14 | [Infonegocios](https://infonegocios.info/y-ademas/elegimejor-com-ar-la-startup-que-compara-prepagas-y-lanza-un-servicio-para-empresas) | Nota de "startup" (como la de ElegiMejor) | A |
| 15 | Forbes Argentina / Apertura | Historia de emprendimiento | C |

### 2. Medios regionales (dato local)

Gancho: dato de su provincia. Tenemos `/prepagas/[provincia]`, `/prepagas/[provincia]/mejores-prepagas` y las páginas de sanatorios del interior (Córdoba, Rosario, Mendoza, Tucumán, La Plata, Mar del Plata, Bahía Blanca, Tandil, Salta). Ej.: *"Qué prepagas atienden en el Sanatorio X de Córdoba y desde qué plan"*.

| # | Medio | Provincia | Prio |
|---|---|---|---|
| 16 | [MDZ](https://www.mdzol.com/sociedad/nuevo-aumento-las-prepagas-cuanto-habra-que-pagar-septiembre-n1594862) | Mendoza (ya publica aumentos) | A |
| 17 | Los Andes | Mendoza | B |
| 18 | La Voz del Interior | Córdoba | A |
| 19 | La Capital | Rosario | B |
| 20 | El Litoral | Santa Fe | B |
| 21 | La Gaceta / [Contexto Tucumán](https://www.contextotucuman.com/) | Tucumán | B |
| 22 | El Tribuno | Salta (Swiss con sucursal y Altos de Salta confirmados) | B |
| 23 | [Primera Edición](https://www.primeraedicion.com.ar/nota/101136672/prepagas-aumentos-septiembre-2026-inflacion/) | Misiones (ya publica aumentos) | A |
| 24 | [Diario de Cuyo](https://www.diariodecuyo.com.ar/economia/aumentan-las-prepagas-abril-cuales-son-los-nuevos-valores-y-como-impactan-el-bolsillo-n6568597) | San Juan (ya publica aumentos) | A |
| 25 | Río Negro | Neuquén / Río Negro | B |
| 26 | El Día | La Plata | B |
| 27 | La Nueva | Bahía Blanca | B |
| 28 | 0223 | Mar del Plata | B |
| 29 | [El Argentino Diario](https://elargentinodiario.com.ar/zona-destacada/28/08/2026/prepagas-por-encima-de-la-inflacion-swiss-medical-lidera-con-el-mayor-aumento/) | Nacional (ya publica aumentos) | A |
| 30 | [Al Sur Noticias](https://alsurnoticias.com.ar/2026/08/28/prepagas-aumentan-hasta-mas-de-3-en-septiembre-y-acumulan-una-suba-superior-a-la-inflacion/) | Ya publica aumentos | A |
| 31 | [Norte en Línea](https://norteenlinea.com/) / [El Sello](https://elsello.info/) | Regionales que levantan gacetillas | C |

### 3. Sitios para extranjeros (en inglés)

Gancho: **corrección de datos**. Varios publican precios viejos (ej. "OSDE 310: ARS 120.000–180.000"; el oficial de septiembre 2026 es $ 272.629 hasta los 27 años). Ofrecer el dato oficial actualizado y nuestra guía como fuente.

| # | Sitio | Página que habla del tema | Prio |
|---|---|---|---|
| 32 | argentinavisalaw.com | [expat-healthcare-argentina-2026](https://argentinavisalaw.com/blog/expat-healthcare-argentina-2026), [comparación](https://argentinavisalaw.com/blog/health-insurance-expats-argentina-comparison), [non-citizens](https://argentinavisalaw.com/blog/health-insurance-options-non-citizens-argentina) | A |
| 33 | buenosairesexpats.com | [/healthcare/](https://buenosairesexpats.com/healthcare/) | A |
| 34 | propertyinbuenosaires.com | [/healthcare-insurance/](https://propertyinbuenosaires.com/healthcare-insurance/) | A |
| 35 | expatsargentina.com | [/insurance/](https://expatsargentina.com/insurance/) | A |
| 36 | The Rio Times | [healthcare-argentina-foreigners-2026](https://www.riotimesonline.com/healthcare-argentina-foreigners-2026/) | B |
| 37 | argentineunveiled.blog | [healthcare-buenos-aires-2026](https://argentineunveiled.blog/healthcare-buenos-aires-2026/) | B |
| 38 | Migaku | [prepaga vs public](https://migaku.com/blog/language-fun/healthcare-in-argentina-prepaga-vs-public-system-for-foreigners) | B |
| 39 | expatlife.ai | [/argentina/healthcare](https://expatlife.ai/argentina/healthcare) | C |
| 40 | [Lucero Legal](https://lucerolegal.org/guias/sistema-de-salud-argentina) | Guía del sistema de salud para extranjeros | B |
| 41 | Buenos Aires Times / Buenos Aires Herald | Decreto 366/25 y salud para extranjeros: `/en/mandatory-insurance-decree-366` | B |

### 4. Abogados, contadores y finanzas personales

Gancho: el **widget** (se actualiza solo en su nota) y guías concretas (`/guias/como-reclamar-a-una-prepaga`, `/para/monotributistas`, `/empresas/beneficios-impositivos`).

| # | Sitio | Por qué | Prio |
|---|---|---|---|
| 42 | [mariovadillo.com.ar](https://mariovadillo.com.ar/prepagas-aumento-julio-2026-derechos-reclamar/) | Abogado que publica cada aumento mensual: el widget le ahorra trabajo | A |
| 43 | [Estudio Jurídico Mogliani](https://www.estudiojuridicomogliani.com.ar/blog/actualidad/aumentos-de-prepagas-sabias-que-podes-reclamar-judicialmente-.html) | Blog sobre reclamos por aumentos | B |
| 44 | [Diario Judicial](https://www.diariojudicial.com/news-103611-la-prepaga-no-puede-aumentar-sin-control) | Cubre fallos sobre prepagas: dato de contexto | B |
| 45 | [EnOrsai](https://www.enorsai.com.ar/economia/42971-aumentos-prepagas-como-frenar-copagos-indebidos-reclamos-salud.html) | Notas de aumentos y copagos | B |
| 46 | [TributoSimple](https://tributosimple.com/categorias-del-monotributo-vigentes/) | Monotributo: guía de prepaga para monotributistas | A |
| 47 | [Monarca](https://askmonarca.com/guias/ganancias-desde-que-sueldo) | Guías de Ganancias: deducción de la prepaga | B |
| 48 | [Estudio Contable Piacentini](https://www.estudiopiacentini.com.ar/) | Blog contable que republica notas | C |
| 49 | [Naranja X — Hablemos de plata](https://www.naranjax.com/blog) | Blog de finanzas: "cómo pagar menos de prepaga" | B |
| 50 | [Segundo Enfoque](https://segundoenfoque.com/las-mejores-apps-de-finanzas-personales-en-argentina-2026-cuales-usar-y-para-que) | Finanzas personales | C |

### 5. Empresas y RRHH

Gancho: prepaga como beneficio (reforma laboral: beneficios no remunerativos) → `/empresas`, `/empresas/beneficios-impositivos`, `/empresas/ranking`.

| # | Sitio | Por qué | Prio |
|---|---|---|---|
| 51 | [iProfesional — Legales](https://www.iprofesional.com/legales/461797-beneficios-laborales-no-remunerativos-reforma-laboral-comedor-prepaga-gift-cards) | Escribió sobre prepaga como beneficio no remunerativo | A |
| 52 | [Fortuna / Perfil Empresas](https://www.perfil.com/noticias/empresas-y-protagonistas/beneficios-corporativos-2027-cuanto-invertiran-las-empresas-en-argentina-y-cuales-son-las-tendencias.phtml) | Notas de beneficios corporativos | B |
| 53 | [Criteria](https://criteria.com.ar/pension-benefits/cerrar-brecha-beneficios-laborales-argentina/) | Blog de beneficios laborales | C |
| 54 | Blogs de software de RRHH (Humand, Buk, Factorial) y portales de empleo (Bumeran, Computrabajo) | Guías de beneficios para pymes | C |

### 6. Institucionales, partners y perfiles propios

| # | Dónde | Qué pedir | Prio |
|---|---|---|---|
| 55 | Swiss Medical, Sancor Salud, OSDE, Avalian y Premedic | Como partner oficial, que nos listen en su página de productores o canales de venta autorizados. Es el link más relevante que existe para nosotros | A |
| 56 | Cámara Argentina de Comercio Electrónico (CACE) | Ser socio da un perfil con link | C |
| 57 | Cámara de comercio de tu ciudad | Directorio de socios | C |
| 58 | LinkedIn (empresa), Instagram, YouTube, X | Perfiles con link al sitio. YouTube es donde está ElegiMejor | B |
| 59 | Google Business Profile | No es backlink, pero ayuda en búsquedas de marca y locales | B |
| 60 | Crunchbase | Perfil de empresa | C |

### 7. Universidades (estudiantes extranjeros)

Oficinas de relaciones internacionales de UBA, UADE, Austral, UCA, ITBA, Di Tella y San Andrés. Tienen páginas de "vivir en Buenos Aires / seguro médico" para estudiantes extranjeros. Ofrecer `/en/health-insurance-argentina` como recurso. Links .edu.ar valen mucho, pero responden lento: prioridad **B**.

## Los 10 primeros (esta semana)

1. **Partners** (#55): pedido formal a los 5, por el canal comercial que ya tienen.
2. **argentinavisalaw.com** (#32): corrección de datos en sus 3 notas.
3. **buenosairesexpats.com** (#33): corrección de datos.
4. **mariovadillo.com.ar** (#42): widget.
5. **Chequeado** (#2): dato de octubre + CSV.
6. **El Economista** (#1): dato de octubre.
7. **Revista Mercado** (#3): gacetilla con el dato de octubre.
8. **Infonegocios** (#14): nota de startup.
9. **MDZ** y **Primera Edición** (#16, #23): dato provincial.
10. **iProfesional Legales** (#51): prepaga como beneficio en la reforma laboral.

Ritmo: el mismo día que se actualiza `/prensa` (cada 15 días, cuando la SSSalud publica los cuadros), mandar el dato a los medios de las secciones 1 y 2. Una sola lista de distribución, un mail por medio, sin insistir más de una vez.

## Plantillas

### A. Periodistas (dato del mes)

> **Asunto:** Dato oficial: las prepagas aumentan 2,17% en octubre (ranking por empresa)
>
> Hola [nombre], te comparto el dato de octubre por si te sirve para la nota de aumentos: según los cuadros tarifarios que las prepagas declararon ante la Superintendencia de Servicios de Salud, el aumento promedio es 2,17%, de 1,7% (Federada Salud) a 2,9% (Omint).
>
> El ranking por empresa, la metodología y el CSV están acá: https://www.prepagaya.com.ar/prensa
>
> Si lo usás, te pido que cites a PrepagaYa con link a esa página. Si necesitás un corte por provincia, edad o plan, lo sacamos en el día.
>
> [Nombre] — PrepagaYa · hola@prepagaya.com.ar

### B. Blogs de expats (corrección de datos, en inglés)

> **Subject:** Updated 2026 prices for your Argentina health insurance guide
>
> Hi [name], I read your guide [título] and it's one of the clearest on prepagas for foreigners. One detail looks outdated: it lists OSDE 310 at ARS 120,000–180,000/month. The official September 2026 price declared to the Superintendencia de Servicios de Salud is ARS 272,629 (under 27, CABA/Buenos Aires).
>
> We keep the official prices updated every month, by plan and age, here: https://www.prepagaya.com.ar/en/health-insurance-cost-argentina
>
> Feel free to use it as a source. Happy to send figures for any other plan.

### C. Abogados, contadores y blogs (widget)

> **Asunto:** Un gráfico del aumento de prepagas que se actualiza solo
>
> Hola [nombre], vi que publicás cada mes el aumento de las prepagas. Armamos un gráfico con el dato oficial de la SSSalud por empresa que se actualiza solo: lo insertás una vez en tu nota y cada mes muestra el dato nuevo, sin que toques nada.
>
> El código para copiar está acá: https://www.prepagaya.com.ar/prensa (sección "Insertar el gráfico en tu sitio").

### D. Partners

> Hola [contacto comercial], como partner oficial de [prepaga] queríamos pedirles si pueden sumarnos a la página donde listan productores o canales de venta autorizados, con link a https://www.prepagaya.com.ar/prepagas/[slug]. Nos ayuda a que los afiliados que nos encuentran confirmen que somos canal oficial.

### E. Menciones sin link

Buscar en Google `"PrepagaYa" -site:prepagaya.com.ar` una vez por mes. A quien nos nombre sin link: agradecer y pedir el link a la página que citaron.

## Lo que NO hay que hacer

Un sitio de salud (YMYL) se juzga con la vara más alta. Nada de:

- Comprar links, "paquetes de backlinks" o notas pagas sin marcar como publicidad.
- Comentarios en blogs y foros, perfiles vacíos o directorios masivos.
- Redes de sitios propios (PBN) o intercambios de links en masa.
- Anchors con la keyword exacta ("aumento de prepagas", "prepagas baratas") en widgets o notas pagas.
- Editar Wikipedia para citarnos.

Un solo link de Chequeado o de un partner vale más que cientos de esos, y esos pueden traer una penalización manual.

## Cómo medirlo

- Search Console → Vínculos: dominios que enlazan, mes a mes.
- Ahrefs (ya está el script de analytics; Ahrefs Webmaster Tools es gratis para el sitio propio): referring domains de PrepagaYa vs MiObraSocial y ElegiMejor. Exportar los dominios que enlazan a ellos y no a nosotros: esa es la próxima lista de objetivos.

## Próximo activo recomendado: sondeo propio

Es lo que más links le da a MiObraSocial. Con los datos anónimos y agregados de las cotizaciones (+8.400) se puede publicar cada trimestre, por ejemplo: presupuesto que elige la gente en el quiz, edad promedio de quien cotiza, provincias que más cotizan y qué prepaga eligen los que se cambian. Una página `/prensa/sondeo-[trimestre]` con el mismo formato que `/prensa`.
