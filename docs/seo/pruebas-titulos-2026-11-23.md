# Pruebas de título del 23-nov-2026

Origen: auditoría de clics con el export de Search Console del 22-nov (`docs/seo/datos/gsc-2026-11-22/`, últimos 3 meses hasta el 20-nov).
Hallazgo: 70 búsquedas de compra en posición 14 o mejor con 150+ impresiones suman 42.900 impresiones y 297 clics (CTR 0,7%). Casi todas
están en las posiciones 6 a 9, así que lo que más mueve es subir puestos (enlaces internos, tabla de `/precios`, autoridad); estas tres pruebas
miran si el título aporta algo en las páginas con más volumen. Una prueba por página, para poder medirlas por separado.

| # | Página | Título anterior | Título nuevo | Hipótesis |
|---|---|---|---|---|
| 1 | `/prepagas/osde/410` y `/510` | OSDE 410: $ 381.660/mes y qué cubre (noviembre 2026) | OSDE 410 precio noviembre 2026: $563.585/mes a los 30 años | "precio" pegado al plan y el monto que se compara (30 años, el de `/precios`) en vez del de la franja de 27 años. |
| 2 | `/ranking` | ¿Cuál es la mejor prepaga de Argentina? Ranking 2026 con precios | Las 15 mejores prepagas de Argentina 2026: ranking y precios (el número sale de las prepagas que lista el ranking) | La forma "las N mejores" es como más se busca; no se afirma que una sea "la mejor" en el título. |
| 3 | `/prepagas/swiss-medical/smg20` | Swiss Medical SMG20 precio noviembre 2026: desde $361.459/mes | Plan SMG20 Swiss Medical precio nov 2026: desde $361.459/mes | La búsqueda es "plan smg20 swiss medical" (349 impresiones, CTR 0,3%, posición 8,9) y el título no decía "plan". |

Control: `/prepagas/osde/210` y `/310` (cambios del 29-oct y 9-nov, no se tocan) y `/prepagas/swiss-medical` (título que se mantiene).

## Línea de base (export del 22-nov, acumulado de 3 meses; por página)
| Página | Clics | Impresiones | CTR | Posición |
|---|---|---|---|---|
| `/prepagas/osde/410` | 49 | 6.125 | 0,80% | 7,4 |
| `/prepagas/osde/210` (control) | 217 | 23.176 | 0,94% | 6,3 |
| `/prepagas/osde/310` (control) | 48 | 5.457 | 0,88% | 7,0 |
| `/ranking` | 216 | 19.665 | 1,10% | 6,2 |
| `/prepagas/swiss-medical/smg20` | 63 | 8.827 | 0,71% | 6,5 |
| `/prepagas/swiss-medical` (control) | 223 | 20.906 | 1,07% | 6,8 |

Consultas de la prueba (22-nov): "osde 410 precio" 8 clics / 1.239 impr / pos 8,4; "cual es la mejor prepaga de argentina" 2 / 533 / 6,5; "las 10 mejores prepagas de argentina" 3 / 522 / 5,8;
"mejores prepagas en argentina" 4 / 505 / 7,2; "plan smg20 swiss medical" 1 / 349 / 8,9.

## Cómo medir (importante)
- Los exports anteriores son **acumulados desde septiembre**: con 3 a 8 clics por búsqueda no separan el efecto de un cambio. Para esta prueba, exportar
  de Search Console **por página** (filtro de página) con rangos propios: 28 días antes del 23-nov (26-oct al 22-nov) contra 28 días después (24-nov al 21-dic).
- Comparar solo días hábiles y sacar los feriados (el del 23-nov si se trasladó el del 20, el 8-dic y el 25-dic).
- Mirar CTR y posición juntos: si el CTR sube pero la posición baja, el título no es lo que cambió.
- Fechas: primera lectura el **7-dic** (2 semanas, ya programada) y la definitiva el **21-dic** (4 semanas).
- Criterio: la prueba "gana" si el CTR de la página sube de forma sostenida contra su control sin perder posición; con tan pocos clics, un cambio menor a 30% no se considera señal.
