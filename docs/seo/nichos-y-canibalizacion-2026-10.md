# Nichos nuevos y canibalización — 18-oct-2026

Sale de tres fuentes: Search Console (17-sep a 14-oct), los leads reales de Vercel Analytics (1-sep a 18-oct) y un rastreo de las 2.358 URLs del sitemap. No hay volúmenes de búsqueda (Ahrefs sin plan y Supermetrics vencido), así que el tamaño de cada nicho es una estimación por lo que ya aparece en Search Console.

## 1. Canibalización

**Rastreo del sitemap (2.358 URLs, todas 200):** 0 títulos repetidos, 0 H1 repetidos, 0 descripciones repetidas, 0 canonicals distintos de la URL, 0 páginas con noindex. Los duplicados de intención que había ya redirigen con 308: `/guias/prepagas-economicas` → `/prepagas-economicas`, `/blog/osde-plan-210-vs-310` → `/prepagas/osde/210-vs-310`, `/blog/mejores-obras-sociales-argentina` → `/obras-sociales/mejores`. Las impresiones que Search Console todavía muestra en esas URLs viejas se van a juntar con las nuevas cuando Google las vuelva a rastrear.

**Indexación:** 2,3 mil páginas indexadas y 776 sin indexar. De esas, 451 figuran como "rastreadas, sin indexar", pero 420 son archivos de `/_next/` (JS y CSS), no páginas. Los 173 noindex y las 93 redirecciones son intencionales. No hay una exclusión masiva por contenido flojo.

**Solapamientos reales (de menor a mayor):**

| Consulta | Páginas que se reparten | Datos | Qué hice |
|---|---|---|---|
| "swiss medical rosario" (y cualquier "[prepaga] [ciudad]") | Cartilla por zona vs. planes y precios de la ciudad | 618 y 485 impresiones, posiciones 5,5 y 6 | La de planes ya enlazaba a la cartilla y no al revés. Ahora la cartilla enlaza a los planes de esa ciudad (commit `e36f03e`). Los títulos ya están separados desde antes (cartilla vs. "sucursal, planes y precios"). |
| "swiss medical cartilla" | Hub de la marca vs. zona CABA | 849 y 1.324 impresiones, ambas en posición 8,5 | Sin cambio: el hub tiene 326 enlaces entrantes y CABA 50, cada una cumple un rol y no hay canibalización dañina. |
| "[prepaga] + ciudad" en marcas sin sucursal propia (Medicus, Omint, Hominis, Federada) | Páginas de localidad vs. provincia | 93 a 98 % de vocabulario compartido entre ellas | Sin cambio: las 47 de Medicus suman 4.479 impresiones y 39 clics, más que las de provincia. Si Search Console empieza a marcarlas como duplicadas, se enriquecen. |

## 2. Nichos

**Conversión real (leads por fuente, 1-sep a 18-oct, 640 envíos):** el comparador (`cotizacion-wizard`) 305, fichas de prepaga 56, barra de cotización 35, cartilla por zona 34, fichas de plan 31, "quiero asesoramiento" 26, cupón 22, comparador por prepaga 36, localidad × prepaga 15, cobertura de cirugía estética 4, implantes dentales 1, óptica 1. El nombre de la prepaga no llega en los eventos.

**Ranking de oportunidades:**

1. **Escalar las páginas "¿mi prepaga cubre X?" (`/coberturas/`).** 40 páginas, 22.564 impresiones y 240 clics (CTR 1,06 %, el mejor de las plantillas grandes), posiciones 5,6 a 8,3. Cirugía estética: 4 leads con 13 clics. Ortodoncia, en cambio, tiene 44 clics y 0 leads, y óptica 47 clics y 1 lead: priorizar temas de alta intención y ticket alto (estética, bariátrica, fertilidad, implantes), no los de reintegro de bajo costo. Cada tema nuevo exige fuente oficial por marca.
2. **Jubilados y mayores de 60, 65, 70 y 80 años.** Es el mismo negocio, con una brecha enorme: en las listas hay unas 15 variantes y en Search Console apenas 94 impresiones, posición 11,5. Hay que reforzar `/para/adultos-mayores` con topes de edad y precios oficiales por marca.
3. **Mascotas, con el ángulo de Premedic.** La web oficial de Premedic dice que "Amar Mascotas" (veterinaria a domicilio, videollamadas y descuentos) está incluido en todos los planes sin costo adicional, en AMBA, Mendoza y Córdoba. Es partner del proyecto. Hay competidores nuevos (Companion, Vetify, Banco Provincia) y Omint anunció un servicio, pero eso viene de prensa y no pude confirmarlo en su sitio. Volumen sin medir.
4. **Empresas (B2B).** 11 páginas, 1.476 impresiones y 18 clics (CTR 1,2 %). Volumen chico y ticket mayor. Mantener y ampliar por partner.
5. **Extranjeros.** En inglés hay unas 2.300 impresiones útiles y 15 clics; en español, ninguna. El Decreto 366/2025 exige declarar un seguro de salud, pero las fuentes no coinciden sobre su vigencia y reglamentación. No expandir hasta verificarlo en el Boletín Oficial.
6. **ART y seguros (Swiss Medical ART y Seguros, Galeno Seguros).** Aparecen mucho en las listas, pero vender seguros requiere matrícula de productor asesor ante la SSN. Decisión de Darío, y no se publica nada hasta confirmarlo.

**Fuera de foco:** tarjetas prepagas, empleos y login de socios.

## 3. Pendiente de decisión

- ¿Se escalan las coberturas empezando por estética, bariátrica y fertilidad por marca? Hay que reunir las fuentes.
- ¿Se arma la página de mascotas con Premedic como ejemplo?
- ¿Darío tiene habilitación para seguros? Si no, se descarta el nicho 6.
- Con un plan de Ahrefs o el Planificador de Google Ads se pueden medir los volúmenes antes de invertir.
