# Traspaso de sesión — 18-oct-2026

Carpeta para retomar el trabajo en otra sesión sin perder contexto. Leer primero este archivo; el detalle de cada tema está en los otros archivos de la carpeta y en `docs/seo/`.

## Prompt para pegar al retomar

```
Retomá PrepagaYa (repo C:\Users\USUARIO\Desktop\PREPAGAS\prepagaya, branch main, deploy automático en Vercel).
Antes de nada leé la memoria del proyecto (project_prepagaya.md) y docs/sesiones/2026-10-18/README.md.
Reglas: nada inventado (solo fuentes oficiales; la prensa se marca como tal), marca blanca (no nombrar a Darío ni a sitios competidores), push a main autorizado después de tsc + build, mails solo como borrador (nunca enviar).
Seguí por "Pendientes" del README.
```

## Qué se hizo el 18-oct-2026 (commits en main)

| Tema | Commit | Detalle |
|---|---|---|
| Monotributo | `3a65f8c` | Buscador de la lista de 46 obras sociales + 3 FAQ (cuál elegir, Monotributo Social, cómo saber cuál tengo). Se descartó un ranking: solo OSPAT publica cartilla oficial. |
| Mascotas | `7da7f24` | Guía `/guias/prepaga-para-mascotas` (Premedic Amar Mascotas con fuentes oficiales; Omint Mascotas solo con fuente de prensa) + FAQ en ficha de Premedic. |
| Flux (corrección) | `7da7f24` | Se sacó "exclusivo 18-35", "psicología sin copago" y "anticonceptivos como diferencia" (OSDE los cubre al 100% en todos los planes) y un rango de precio sin fuente. Se agregó lo que dice osde.com.ar/planes/flux. FAQ de edad y de qué incluye en `/prepagas/osde`. |
| Promo SportClub | `5069cc1` | `components/prepagas/PromoFluxSportClub.tsx` (cuenta regresiva, chequeo "¿califico?", condiciones). En ficha Flux, Flux vs 210 y post de Flux. Se oculta sola el 1-nov. |
| CLS | `e588589` | Causa del 0,35 de Clarity: en `/comparador`, visitantes con cookie `pya_zona_geo` saltan a edades y el wizard escondía el Header (65 px). Ahora `HeaderEnfocado` (solo logo, mismo alto). `/empresas` ya no dibuja el chrome global desde el SSR. Medido en prod con cookie simulada: 0. |
| Firewall | — | Regla "Challenge China" (geo CN → Challenge) activa y publicada. Verificar en el dashboard Firewall → Traffic cuántas visitas desafió. |

Commits previos del mismo día (ya documentados en `docs/seo/`): `53de70b`, `30bdd2d`, `045e8f1`, `fdc63d5`, `e36f03e`, `c5453ac`, `6775227`, `430f41f`, `fdba032`.

## Pendientes (en orden de prioridad)

1. **OSECAC** — ver `osecac-notas.md`. Idea: página guía de cartilla/gestiones oficiales de OSECAC (no hay cartilla propia: la oficial pide login). 2.400 búsquedas/mes de "cartilla osecac"; marca sola 165.000.
2. **Jubilados y mayores** — ver `jubilados-notas.md`. Ya existen `/para/mayores-60`, un post de PAMI y la guía de edad máxima; el trabajo es reforzar con fuentes oficiales, no crear de cero.
3. **31-oct**: medir la ola 1 de títulos (fichas, plan-vs-plan, home) contra la línea base de la memoria y decidir la ola 2 (localidad×prepaga y cartillas). **14-nov**: medición a 28 días y ola 3.
4. **1-nov**: sacar `PromoFluxSportClub` del código (ficha del plan, `ComparativaPlanesPage`, `app/blog/[slug]/page.tsx`). Los textos de Flux ya están corregidos y quedan.
5. **~8-nov**: re-medir en Search Console `/obras-sociales/monotributo` (línea base: "obra social monotributo" pos 13,8; "obras sociales para monotributistas" pos 12,2) y la guía de mascotas (línea base: "prepaga para mascotas" 170/mes, "seguro para mascotas" 390/mes).
6. **~1 semana**: ver en Clarity si el CLS bajó.
7. Del lado de Darío: enviar los dos borradores de Gmail (Revista Mercado, Mario Vadillo) y pegar los textos de Chequeado y argentinavisalaw (`docs/seo/outreach-2026-10.md`).

## Preguntas abiertas para Darío

- ¿Tiene matrícula de productor-asesor de seguros (SSN)? Define si se entra al nicho ART/seguros.
- ¿Armar página con historia y dueño de Swiss Medical leyendo su "Quiénes somos" oficial?
- ¿Usar el logo de SportClub? (Hoy solo hay link de texto, por ser marca de terceros.)
- Listas de keywords que faltan: Medifé, Omint, CEMIC, Hospital Italiano, Medicus, Prevención; las genéricas "prepagas" y "obras sociales".

## Otros pendientes de fondo

Artículos: plan materno infantil por prepaga, leche especial/congelar óvulos, PAMI→prepaga (verificar norma). Avisos a los anotados de "Te aviso el aumento" (necesita OK de Darío). Paso 4 del embudo de GA4 (Darío). Folletos Sancor para comparativas y reintegro Medifé/Medicus (Darío, sin fuente).

## Datos clave para no volver a buscarlos

- Volúmenes de búsqueda (Planificador de Google Ads, AR, oct-2025 a sep-2026): `docs/seo/volumenes-google-ads-2026-10.md`.
- Análisis de nichos y canibalización: `docs/seo/nichos-y-canibalizacion-2026-10.md`.
- Search Console: la posición manda el CTR (pos ≤5 → 3–28 %; pos ≥9 → <1 %). Los títulos no mueven las búsquedas de cabeza; sí las de cola larga (plan, zona, "2026").
- Vercel: proyecto `prepagaya` (team `forza-projects`, id `prj_PqMk33Xg4L1ajY9HIYclwEe30wZN`). El sitio responde en `https://www.prepagaya.com.ar` (el dominio sin www redirige).
- Probar en local: `.claude/launch.json` (no está en git) define `prepagaya-dev`. Si el servidor de desarrollo da 404 en todo menos la home, borrar la carpeta `.next` (restos de un build) y reiniciar.
- Cookie de geolocalización simulada para probar visitantes de Argentina: `pya_zona_geo` = JSON `{label, wizardSlug, provinciaSEOSlug}`.
- Commits con archivo de mensaje (`git commit -F`), no con here-string de PowerShell.
