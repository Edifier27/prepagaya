# Jubilados y mayores — notas (18-oct-2026)

Volúmenes (Planificador de Google Ads, AR): "prepagas para jubilados" 260/mes (+23 %), "prepagas que aceptan jubilados" 40, "pami y prepaga" 10. Search Console: unas 94 impresiones en ~15 variantes, posición 11,5.

## Lo que ya existe (no duplicar)
- `/para/mayores-60` (`lib/data/perfiles.ts`): FAQ "¿Qué prepaga acepta jubilados?" (todas, Ley 26.682 no permite rechazar por edad), "¿Puedo tener PAMI y una prepaga?" (los jubilados hacen la opción en ANSES), precios oficiales a los 60, 65 y 70 por prepaga. Keywords: prepaga para mayores de 60, adultos mayores, mejor prepaga jubilados, prepaga complementaria PAMI.
- Guía `edad-maxima-afiliarse-prepaga` (`lib/data/guias.ts`): sin límite legal; planes complementarios (ambulatorio / internación) con una obra social de base. Ojo: dice que Swiss Medical ofrece planes parciales complementarios y no tiene fuente enlazada: verificar o suavizar.
- Post de blog sobre PAMI (qué cubre) y otro sobre tener PAMI y prepaga a la vez (`lib/data/blog.ts`).
- `lib/data/obras-sociales.ts` y la guía de opción de cambio mencionan que los jubilados hacen la opción en ANSES.

## Qué falta / cómo reforzar
1. Fuente oficial del trámite: confirmar en argentina.gob.ar/ANSES cómo y desde qué entidades pueden los jubilados elegir otra obra social, y si se puede derivar el descuento de PAMI. Citarla en `/para/mayores-60` y en la guía de PAMI + prepaga.
2. Verificar el dato de "planes complementarios" por prepaga con las fichas oficiales (Swiss Medical, etc.) antes de nombrarlas.
3. Revisar el título y la descripción de `/para/mayores-60` contra las variantes buscadas ("prepagas para jubilados", "prepagas que aceptan jubilados 2026") y que la página tenga una FAQ para cada una.
4. Medir antes y después en Search Console (línea base: pos 11,5, 94 impresiones en 17-sep a 14-oct).

No inventar: no hay datos de precios de planes complementarios; los precios por edad salen de los cuadros oficiales de la SSSalud.
