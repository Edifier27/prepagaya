# Análisis de palabras clave — artículo pilar "dar de baja la prepaga / la obra social" (17-oct-2026)

Insumos: autocompletado de Google es-AR (≈ 590 sugerencias únicas: 411 de las raíces de bajas + 179 de las cabeceras "mi prepaga / mi obra social"), las listas de Keyword Tool que pasó Darío (volúmenes ficticios: 88.888 en todas, no sirven para priorizar) y una revisión de la SERP actual. Sin volumen real, la prioridad sale de **cuántas variantes comparten la misma intención** y de **qué falta en la SERP**.

## 1. Cómo es la SERP hoy

Para "cómo dar de baja mi prepaga" y "dar de baja mi obra social" aparecen guías de medios y portales (ElegíMejor, Mi Obra Social, Derecho en Zapatillas, La Gaceta, iProfesional) y foros de reclamos (tuQuejaSuma). Los puntos débiles que se pueden superar:

- Son notas genéricas: **ninguna** reúne el procedimiento oficial de **cada prepaga** con fecha de verificación.
- Mezclan normas (24.240 vs 26.682) y repiten datos desactualizados: notas de 2022 sobre AFIP, sin ARCA; el COPREC, disuelto en 2025, sigue apareciendo.
- Dicen "podés darte de baja en cualquier momento" sin aclarar lo que más se pregunta: **"antes del año"** (ver 2.3).

## 2. Hallazgos nuevos respecto del primer análisis

1. **Confusión prepaga / obra social.** Hay muchísimas búsquedas como "como dar de baja mi obra social prepaga", "dar de baja obra social sancor salud / prevención salud / avalian". Para el usuario son la misma cosa. El pilar tiene que nombrar las dos y explicar la diferencia en dos líneas.
2. **"Antes del año" es una búsqueda propia** ("dar de baja prepaga antes del año", "se puede dar de baja una prepaga antes del año", "puedo dar de baja mi obra social antes del año", "dar de baja obra social antes del año"). Hay dos reglas distintas que la gente mezcla:
   - **Prepaga**: sin permanencia mínima; la ley permite rescindir en cualquier momento (Ley 26.682, art. 9) y solo se puede ejercer una vez por año (Decreto 1993/2011).
   - **Obra social (Agente del Seguro)**: la SSSalud fijó 12 meses de permanencia mínima tras una opción de cambio (Res. 201/2024; la norma aclara que no rige para quien elige una prepaga registrada).
3. **"Cuándo se puede dar de baja"**: preguntas de plazo ("cuándo puedo darme de baja", "cuánto tarda", "en cuánto tiempo se da de baja la obra social"). Responder con fechas de efecto reales por prepaga (OSDE: día del trámite; Swiss: día 5; Avalian: hasta el día 10).
4. **"Dar de baja en ANSES / AFIP / ARCA / CODEM"**: malentendido frecuente. CODEM solo consulta; el cambio se hace con la opción de cambio (Mi SSSalud, o ARCA/UDAI para jubilados), la modificación o baja del monotributo (ARCA) o el cese laboral.
5. **"Dar de baja a otra persona"**: "a mi hijo", "a mi esposa", "a mi ex de la obra social", "adherente". Es la baja parcial.
6. **"Mi prepaga me dio de baja" / "prepaga dada de baja"**: ya cubierto por `prepaga-me-dio-de-baja-por-falta-de-pago`.
7. **Marcas más buscadas con "baja"**: Sancor Salud, Prevención Salud, Swiss Medical, Galeno, Omint, Medicus, Medifé, Hospital Italiano, Avalian, Accord, Hominis (todas con guía salvo Accord).
8. Ruido: "línea prepaga" (celulares), "tarjeta prepaga" y las búsquedas de EPS colombianas. No se compite por eso.

## 3. Mapa de palabras clave y página destino

| Intención | Variantes (ejemplos) | Página |
|---|---|---|
| **Pilar (cabecera)** | "dar de baja mi prepaga", "cómo dar de baja mi prepaga", "dar de baja mi obra social", "como darme de baja de la prepaga", "baja de prepaga y obra social" | **Nueva: `/guias/como-dar-de-baja-prepaga-u-obra-social`** (reemplaza a `baja-de-prepaga-proceso`, con redirección 301) |
| Plazo / "antes del año" | "dar de baja prepaga antes del año", "cuándo puedo darme de baja en una prepaga" | Sección del pilar + FAQ (sin página aparte) |
| Por marca | "como dar de baja la prepaga {marca}" | 13 guías por marca (existentes) |
| Problemas | "no me dan la baja", "baja prepaga superintendencia", "carta documento" | 8 guías jurídicas (existentes) |
| Obra social, monotributo | "dar de baja obra social monotributo / afip / arca" | `baja-obra-social-monotributo` (existente) |
| Obra social, otros | "en anses", "codem", "relación de dependencia", "por internet" | Sección del pilar; enlaza a `que-obra-social-tengo-codem`, `opcion-de-cambio-obra-social` y `sin-trabajo-obra-social` |
| Dar de baja a otra persona | "a mi hijo", "a mi esposa", "a mi ex", "adherente" | Sección del pilar (baja parcial); enlaza a `divorcio-obra-social` y `hijos-21-a-25-anos-obra-social` |

## 4. Criterios para el pilar (SEO y GEO, 2026)

- **Respuesta primero** en las primeras líneas (los motores de IA toman el primer bloque), con la base legal en la misma frase.
- **Tabla comparativa por prepaga** (canal, quién, fecha de efecto, guía): dato propio, verificable y fácil de citar (ganancia de información frente a la SERP).
- **Pasos numerados** y esquema `HowTo`, además de `FAQPage` y `Article` ya existentes.
- **Bloques que se entienden solos** (cada sección responde una pregunta completa): los buscadores de IA citan fragmentos, no páginas.
- **Fuentes primarias con enlace**, fecha de verificación visible y sección "cómo lo verificamos" (qué se pudo leer y qué no): señal de confianza (E-E-A-T) y de actualidad.
- **Enlazado radial**: el pilar enlaza a las 22 guías y todas enlazan de vuelta; texto de enlace descriptivo.
- **`llms.txt`** con el pilar arriba del bloque de bajas; bots de IA ya permitidos en `robots.ts`.
- **Conversión**: bloque "¿Todavía no resolviste tu nueva cobertura?" con el formulario (fuente `guia-baja`).
- Evitar canibalización: una sola página para la cabecera (el pilar); las guías por marca apuntan a "como dar de baja {marca}".
