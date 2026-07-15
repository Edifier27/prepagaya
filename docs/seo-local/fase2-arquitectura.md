# FASE 2 — Arquitectura SILO + árbol de URLs

Fecha: 2026-07-14 · Estado: propuesta para GATE 2 (sin código)

## Principio rector: aditivo, no destructivo

El sitio tiene 268 páginas recién corregidas (canonicals propios, deployadas 14-jul, pendientes de reindexación). La arquitectura nueva **no cambia ninguna URL existente**. Solo hay una migración: `/prepagas-en/[ciudad]` (12 páginas) se 301-redirige a los nuevos hubs provinciales — es el momento ideal porque Google recién está reindexando y no hay equity acumulado que perder.

## Decisiones de estructura (recomendadas)

1. **`/prepagas/[x]` convive prepaga y provincia.** `/prepagas/osde` (prepaga) y `/prepagas/cordoba` (hub provincial) viven en el mismo nivel; la ruta dinámica despacha por tipo de slug. Verificado: ningún slug de prepaga choca con ninguna provincia. Es la estructura exacta del silo pedido, sin mover nada existente.
2. **El cotizador queda en `/comparador`.** Renombrar a `/cotizador` implica 301 + tocar decenas de CTAs sin ganancia SEO (es una herramienta, no una landing de keyword). Se agrega `/cotizador` → 301 → `/comparador` por si se usa en campañas. El deep-link `?zona=` ya funciona.
3. **`/prepagas-en/[ciudad]` → 301 al hub provincial equivalente** (ej. `/prepagas-en/cordoba` → `/prepagas/cordoba/`). Las 4 ciudades que son localidades no capitales (rosario, la-plata, mar-del-plata, bariloche) redirigen a su futura página de localidad o al hub de su provincia.
4. **OS provinciales estatales (IPS Salta, ISSN, APROSS):** página informativa en silo 2 (capturan mucha búsqueda local), con CTA al cotizador `?zona=` — nunca link horizontal al silo 1. El cotizador es herramienta neutral: no rompe el cierre de silos.

## Árbol de URLs — piloto (replicable a 24 jurisdicciones)

```
/prepagas/                                    PILLAR silo 1 (existe, se enriquece)
│
├── /prepagas/cordoba/                        HUB provincial               [NUEVA]
│   ├── /prepagas/cordoba/mejores-prepagas/   Ranking zona                 [NUEVA]
│   ├── /prepagas/cordoba/nobis/              Prepaga × zona (9 en Cba)    [NUEVA]
│   ├── /prepagas/cordoba/avalian/
│   ├── /prepagas/cordoba/sancor-salud/
│   ├── /prepagas/cordoba/prevencion-salud/
│   ├── /prepagas/cordoba/federada-salud/
│   ├── /prepagas/cordoba/jerarquicos-salud/
│   ├── /prepagas/cordoba/swiss-medical/
│   ├── /prepagas/cordoba/osde/
│   ├── /prepagas/cordoba/galeno/
│   ├── /prepagas/cordoba/cordoba-capital/    Localidad                    [NUEVA]
│   ├── /prepagas/cordoba/rio-cuarto/
│   ├── /prepagas/cordoba/villa-carlos-paz/
│   └── /prepagas/cordoba/villa-maria/
│
├── /prepagas/salta/                          [NUEVA]
│   ├── /prepagas/salta/mejores-prepagas/
│   ├── /prepagas/salta/boreal/  ·  nobis/  ·  sancor-salud/  ·  prevencion-salud/  ·  osde/  ·  swiss-medical/  ·  galeno/
│   ├── /prepagas/salta/salta-capital/
│   ├── /prepagas/salta/oran/
│   └── /prepagas/salta/tartagal/
│
├── /prepagas/neuquen/                        [NUEVA]  (sin ñ)
│   ├── /prepagas/neuquen/mejores-prepagas/
│   ├── /prepagas/neuquen/swiss-medical/  ·  osde/  ·  sancor-salud/  ·  galeno/  ·  prevencion-salud/  ·  avalian/
│   ├── /prepagas/neuquen/neuquen-capital/
│   ├── /prepagas/neuquen/cutral-co/
│   └── /prepagas/neuquen/san-martin-de-los-andes/
│
├── /prepagas/[prepaga]/                      EXISTE (15) — gana bloque "Cobertura por provincia"
└── /prepagas/[prepaga]/[plan]/               EXISTE (66) — sin cambios

/obras-sociales/                              PILLAR silo 2 (existe, se enriquece)
├── /obras-sociales/osdepym/                  HUB entidad                  [NUEVA]
│   ├── /obras-sociales/osdepym/plan-2000/    ·  plan-3000/  ·  plan-4000/
│   └── /obras-sociales/osdepym/cordoba/      Entidad × zona (solo con dato real)
├── /obras-sociales/osecac/  +  /plan-azul/
├── /obras-sociales/ospe/
├── /obras-sociales/union-personal/  +  /accord-salud/
├── /obras-sociales/daspu/                    (foco Córdoba: cruce silo 2 × zona)
├── /obras-sociales/ips-salta/  ·  /issn-neuquen/  ·  /apross/    (informativas, no comercializables)
└── /obras-sociales/[slug]/                   EXISTEN (15) — sin cambios

/comparador?zona=X                            Herramienta (existe) + alias 301 /cotizador
/guias · /blog · /coberturas · ...            Contenido soporte: alimenta ambos silos (link entrante, nunca saliente desde silo)
```

Volumen piloto: **~45 páginas nuevas** (3 hubs + 3 rankings + ~25 prepaga×zona + ~10 localidades + ~12 silo 2). Proyección 24 jurisdicciones: ~300-350 páginas, todas de plantilla + dataset.

## Mapa de enlazado interno (cerrado por silo)

| Página | Enlaza hacia | Nunca hacia |
|---|---|---|
| Pillar `/prepagas` | 24 hubs provinciales + 15 prepagas | otro silo |
| Hub provincial | ↑ pillar · ↓ su ranking, sus prepaga×zona, sus localidades · CTA `?zona=` | otras provincias (máx. 3 vecinas al pie), blog |
| Ranking zona | ↑ hub · ↓ cada prepaga×zona rankeada · CTA `?zona=` | — |
| Prepaga×zona | ↑ hub + pillar · → 2-3 hermanas de la misma provincia · ↓ página nacional de la prepaga y sus planes (vertical, mismo silo) · CTA `?zona=` | prepaga×zona de OTRA provincia |
| Localidad | ↑ hub · → localidades hermanas · CTA `?zona=` | — |
| Prepaga nacional (existente) | + nuevo bloque "¿Dónde tiene cobertura?" → sus prepaga×zona | — |
| Hub entidad OS | ↑ pillar OS · ↓ sus planes y entidad×zona · CTA cotizador | silo 1 |
| Guías/blog (soporte) | → hacia cualquier silo (entrante) | los silos NO devuelven el link (salvo hub → 1 guía madre, máx.) |

Breadcrumbs (con `BreadcrumbList`): `Inicio > Prepagas > Córdoba > OSDE` · `Inicio > Obras Sociales > OSDEPYM > Plan 3000`.

## Plantillas title / meta / H1 por tipo

Regla vigente: el layout agrega "| PrepagaYa" — los titles NO concatenan marca.

| Tipo | Title (patrón) | H1 | Meta description (patrón) |
|---|---|---|---|
| Hub provincial | `Prepagas en {Provincia}: precios y cartillas — {Mes} {Año}` | `Prepagas en {Provincia}` | `Compará las {n} prepagas con cobertura real en {Provincia}. Precios {mes}, cartillas en {ciudad1} y {ciudad2} y cotización online sin DNI.` |
| Ranking zona | `Mejores prepagas en {Provincia} ({Año}): ranking y precios` | `Las mejores prepagas en {Provincia}` | `Ranking {año} de prepagas en {Provincia} según cartilla local, precio y prestadores como {prestador_local}. Cotizá online.` |
| Prepaga × zona | `{Prepaga} en {Provincia}: cartilla, planes y precios {Año}` | `{Prepaga} en {Provincia}` | `¿Qué cubre {Prepaga} en {Provincia}? Sucursal, cartilla con {prestador_local}, planes desde {precio} y cotización online.` |
| Localidad | `Prepagas en {Ciudad}: precios y cobertura {Año}` | `Prepagas en {Ciudad}` | `Las prepagas con cartilla en {Ciudad}, {Provincia}: precios {mes} {año} y qué sanatorios locales cubren. Cotizá gratis.` |
| Hub entidad OS | `{SIGLA}: planes, precios y cómo afiliarse en {Año}` | `{SIGLA} — {nombre completo}` | `{SIGLA} ({nombre completo}): planes, a quién afilia, monotributo y cómo darse de alta. Guía verificada {año}.` |
| Plan OS | `{SIGLA} {Plan}: cobertura, precio y opiniones {Año}` | `{Plan} de {SIGLA}` | `Qué cubre el {Plan} de {SIGLA}, cuánto cuesta y cómo afiliarse. Comparalo con prepagas online.` |
| Entidad × zona | `{SIGLA} en {Provincia}: cartilla y afiliación` | `{SIGLA} en {Provincia}` | `Cobertura de {SIGLA} en {Provincia}: prestadores, sucursales y alternativas si buscás más cartilla.` |

Reglas duras: un solo H1; H2 = secciones (cartilla local, precios, comparación, FAQ); precios solo si están verificados en data (regla "nada inventado" — si no, "sujeto a cotización"); cada página cierra con CTA al cotizador pre-filtrado.

## Protección del SEO existente (checklist)

- [x] Cero URLs existentes modificadas o eliminadas
- [x] Única migración: 12 páginas `/prepagas-en/*` vía 301 (equity preservado, timing ideal pre-indexación)
- [x] Canonicals self en todas las nuevas; sin competencia de keywords con páginas existentes (las nuevas atacan `{prepaga}+{provincia}` y `prepagas+{provincia}`, que hoy nadie ataca)
- [x] `/para/`, `/condiciones/`, `/coberturas/`, `/comparativas/` no se tocan (soporte transversal)
- [x] Sitemap: se agregan las nuevas secciones; en Fase 6 se segmenta por silo
