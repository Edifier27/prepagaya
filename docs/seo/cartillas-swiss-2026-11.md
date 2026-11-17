# Cartillas de Swiss Medical: Nubial, Global y Premium (17-nov-2026)

Pedido de Darío: la gente busca un prestador por la cartilla (Nubial, Global o Premium), no solo por el plan. Ver cuánto se busca, con qué intención y qué variantes, cuidar la canibalización y aplicarlo a la página de cartillas.

## Fuentes y límites

- **Search Console**: exports del 28-oct, 9-nov y 16-nov-2026, **últimos 3 meses**. Cada export trae solo las 1.000 consultas y las 1.000 páginas principales: las búsquedas chicas sin clics no aparecen.
- **Autocompletado de Google** (Argentina, español): consultado el 17-nov-2026 con 273 frases semilla, letra por letra. Muestra **cómo** se busca, no cuánto.
- **Cartilla oficial de Swiss Medical** (buscador oficial, consultado el 22/09/2026). Códigos de cada cartilla, según `scripts/cartilla-swiss/swiss.py`:
  - NU3 = Nubial Quality (SMG02 y S1);
  - CLE = Global (SMG20 y S2);
  - CLS = Premium (SMG30 a SMG70);
  - NU2 = Nubial Clásica (SMG01, ya no existe).
- **Sin volúmenes de búsqueda**. Por qué:
  - Ahrefs devuelve "Insufficient plan" en todas las consultas.
  - Supermetrics tiene conectado el Planificador de Google Ads, pero la prueba gratis venció el 5-oct-2026.
  - La lista para correr en el Planificador está al final.

## Lo que dicen los datos

1. **Por código de plan se busca 10 a 30 veces más que por nombre de cartilla.** Search Console, últimos 3 meses (export del 16-nov):

| Consulta | Impresiones | Clics | Posición |
|---|---|---|---|
| cartilla swiss medical smg20 | 812 | 27 | 6,2 |
| plan smg02 swiss medical cartilla | 218 | 12 | 4,9 |
| cartilla swiss medical smg30 | 187 | 17 | 4,3 |
| cartilla swiss medical smg02 | 117 | 6 | 4,4 |
| **cartilla global swiss medical** | **35** | 2 | **18,7** |
| **cartilla nubial quality** | **24** | 4 | 4,0 |

   - Google Ads (planificador, oct-2026): "cartilla swiss medical smg20" tiene 320 búsquedas por mes y "swiss medical cartilla", 3.600.
   - Conclusión: el nombre de la cartilla se **suma** al título, **sin sacar** los códigos SMG. Si el título dijera solo "Nubial", perderíamos la búsqueda grande.

2. **Con "cartilla global swiss medical" estamos en posición 18,7.** Es la única de estas búsquedas en la que no aparecemos en la primera página. La página de la cartilla Global (`/cartillas/swiss-medical/plan-smg20`) no decía "cartilla Global" en el título ni en el H1.

3. **Nubial, Global y Premium se buscan también como si fueran planes, con intención de compra.** El autocompletado lo muestra:
   - "plan global swiss medical precio";
   - "cuánto sale el plan global de swiss medical";
   - "swiss medical premium precio";
   - "cuánto sale el plan premium de swiss medical";
   - "swiss medical nubial es la más barata".

4. **Muchos planes corporativos llevan el nombre de la cartilla.** El autocompletado muestra:
   - "docthos global", "cartilla docthos premium";
   - "qualitas premium swiss medical";
   - "smmp global cle", "swiss medical plan 0 smmp premium cls";
   - "plan bg2 premium", "plan bgi premium", "plan psg1 premium", "plan care 2 premium";
   - "plan sb04 global", "plan ms3 global", "plan plus global", "plan rojo global".

   Es lo que dice Darío: quien tiene uno de esos planes busca la cartilla por su nombre. Los sufijos CLE y CLS coinciden con los códigos de cartilla del buscador oficial.

5. **Las páginas de cartilla por plan ya tienen tráfico y CTR mejor que la cartilla general** (últimos 3 meses, export del 16-nov):

| Página | Impresiones | Clics | CTR | Posición |
|---|---|---|---|---|
| /cartillas/swiss-medical/plan-smg02/caba | 3.447 | 128 | 3,7% | 6,2 |
| /cartillas/swiss-medical/plan-smg20 | 2.070 | 57 | 2,8% | 6,6 |
| /cartillas/swiss-medical/plan-smg02 | 1.527 | 46 | 3,0% | 7,4 |
| /cartillas/swiss-medical/plan-smg30 | 1.098 | 46 | 4,2% | 7,1 |
| /cartillas/swiss-medical | 8.046 | 132 | 1,6% | 8,0 |

   - Crecen semana a semana. plan-smg20 pasó de 1.224 impresiones (export del 28-oct) a 2.070 (16-nov).
   - En el export `gsc-ia-2026-10-28` (impresiones por página), la cartilla de Swiss suma 631 impresiones, plan-smg02/caba 235, plan-smg02 216 y plan-smg20 211.

## Variantes por intención (autocompletado de Google)

| Intención | Variantes | Página que responde |
|---|---|---|
| **Cartilla** (ya es socio o lo está por ser) | cartilla nubial, cartilla nubial swiss medical, swiss medical cartilla nubial, swiss medical plan nubial cartilla, cartilla global swiss medical, swiss medical cartilla global, swiss medical plan global cartilla, cartilla premium swiss medical, swiss medical premium cartilla, cartilla swiss medical smg30 premium | La de cada cartilla: `/cartillas/swiss-medical/plan-smg02` (Nubial), `plan-smg20` (Global), `plan-smg30` (Premium) |
| **Qué es o cuál es** | qué es nubial, cartilla nubial qué es, cuál es el plan nubial de swiss medical, swiss medical global qué es, cuál es el plan global, qué es swiss medical premium, cuál es el plan premium | La de cada cartilla: primer párrafo con la respuesta directa |
| **Qué cubre** | swiss medical nubial cobertura, plan nubial swiss medical cobertura, plan global swiss medical que cubre, swiss medical global beneficios, que cubre el plan premium, que incluye el plan premium, swiss medical premium cobertura | La de cada cartilla (sanatorios) y la ficha de cada plan (`/prepagas/swiss-medical/[plan]`, coberturas) |
| **Precio** (compra) | plan global swiss medical precio, cuánto sale el plan global, swiss medical premium precio, cuánto sale el plan premium, plan premium swiss medical precio, swiss medical nubial es la más barata | La ficha de cada plan. La página de la cartilla responde "desde $X" y enlaza al plan |
| **Plan corporativo** | docthos global y premium, qualitas premium, smmp global cle, smmp premium cls, bg2, bgi, psg1 y care 2 premium, sb04, ms3, plus y rojo global | La de cada cartilla (ver "Pendiente") |
| **Plan que ya no existe** | nubial clásica, plan nubial clásica swiss medical (SMG01) | Nada por ahora |
| **Ruido** (no es Swiss) | nubial almohadas, swiss premium chocolate, swiss global airlines, cartilla global 4500 | — |

## Canibalización: una intención, una URL

| Búsqueda | URL dueña | Las otras |
|---|---|---|
| cartilla swiss medical (general), "¿cuál es mi cartilla?" | `/cartillas/swiss-medical` | La ficha de Swiss (`/prepagas/swiss-medical`) tiene la sección de las 3 cartillas y enlaza a cada una. Sigue apuntando a "swiss medical planes y precios" |
| cartilla nubial / global / premium, "qué es" | `/cartillas/swiss-medical/plan-smg02`, `plan-smg20`, `plan-smg30` | La cartilla general solo resume en una tabla y enlaza a cada una |
| cartilla nubial / global / premium + zona | `/cartillas/swiss-medical/plan-smg02/caba`, etc. | — |
| plan global precio, cuánto sale el premium | `/prepagas/swiss-medical/[plan]` (la ficha del plan) | La página de la cartilla dice "desde $X" y enlaza a la ficha del plan |

No se crearon páginas nuevas. Cada cartilla ya tenía su URL; faltaba que dijera su nombre.

## Qué se cambió (17-nov-2026)

- **Datos**: cada cartilla de Swiss tiene su nombre y su código oficial (`lib/data/cartilla-zonas/index.ts`). El armado de las tres está en `lib/data/cartillas-swiss.ts`.
- **Página de cada cartilla** (`/cartillas/swiss-medical/plan-smg02`, `-smg20`, `-smg30`):
  - Título: "Cartilla Swiss Medical Global (SMG20 y S2) 2026: sanatorios".
  - H1: "Cartilla Global de Swiss Medical (SMG20 y S2): sanatorios y guardias por zona".
  - Primer párrafo con la respuesta directa (GEO): qué planes la usan, su código, si es la de entrada, la del medio o la más completa, y cuántos sanatorios tiene en CABA frente a las otras dos, con fuente y fecha.
  - Tabla en HTML de las 3 cartillas: planes, sanatorios en CABA y precio desde, con fuente y fecha. Enlaza a la página de cada cartilla con el texto "Cartilla Nubial" y a la ficha de cada plan.
  - Preguntas frecuentes con el nombre de la cartilla: "¿Qué es la cartilla Global de Swiss Medical?", "¿Qué sanatorios tiene la cartilla Global en CABA?", "¿Qué suma la cartilla Premium frente a la Global?", "¿Cuánto cuesta un plan con cartilla Global?" y "¿Cómo sé qué cartilla tengo?".
- **Cartilla por plan y zona** (`/plan-smg02/caba`, etc.): el título y el H1 suman el nombre ("Cartilla Swiss Medical Nubial (SMG02 y S1) en CABA").
- **Cartilla de Swiss** (`/cartillas/swiss-medical`):
  - sección "Las 3 cartillas de Swiss Medical: Nubial, Global y Premium", con la tabla;
  - la pregunta "¿Cuál es mi cartilla de Swiss Medical: Nubial, Global o Premium?".
- **Medir** en Search Console a las 2 y 4 semanas:
  - "cartilla global swiss medical", que hoy está en posición 18,7;
  - las impresiones de "nubial", "global" y "premium";
  - que "cartilla swiss medical smg20" no baje de la posición 6.

## Pendiente

- **Planes corporativos** (respuesta de Darío, 17-nov-2026): Qualitas usa la Nubial; Docthos Global, la Global; Docthos Premium y SMMP, la Premium.
  - Ya está en la página de cada cartilla: primer párrafo, tabla, pregunta "¿Qué planes corporativos usan la cartilla X?" y "¿Cómo sé qué cartilla tengo?".
  - Ojo: el **Qualitas Premium usa la Nubial**, no la Premium. Se aclara en la página porque se busca ("qualitas premium swiss medical", "cartilla qualitas premium").
  - A confirmar: el autocompletado muestra "smmp global cle" (CLE es el código de la Global). Si existe un SMMP con cartilla Global, hay que corregir "SMMP usa la Premium".
- **Nubial Clásica** (SMG01): se sigue buscando y el plan ya no existe. Se podría sumar una respuesta en la cartilla Nubial ("la Nubial Clásica ya no se comercializa; hoy la Nubial es la del S1 y el SMG02"), si Darío lo confirma.
- **Volúmenes**: correr en el Planificador de Google Ads (Argentina, español, últimos 12 meses):

  nubial; swiss medical nubial; nubial swiss medical; cartilla nubial; cartilla nubial swiss medical; cartilla nubial quality; plan nubial swiss medical; plan nubial; nubial clasica swiss medical; swiss medical nubial cobertura; swiss medical global; cartilla global swiss medical; swiss medical cartilla global; plan global swiss medical; swiss medical plan global; plan global swiss medical precio; plan global swiss medical que cubre; swiss medical premium; cartilla premium swiss medical; swiss medical cartilla premium; plan premium swiss medical; swiss medical plan premium; swiss medical premium precio; plan premium swiss medical precio; que cubre el plan premium de swiss medical; docthos global; docthos premium; qualitas premium swiss medical; smmp global cle; cartilla swiss medical smg02; cartilla swiss medical smg30
