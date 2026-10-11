# Agentes de PrepagaYa

Tareas programadas que analizan el sitio y mandan un informe a Darío (celular y mail).
Creadas el 11-oct-2026. Se administran en claude.ai → Routines.

| Agente | Cuándo (hora Argentina) | Qué hace | ID |
|---|---|---|---|
| PrepagaYa · Métricas y comportamiento | Lunes 8:52 | Vercel Analytics (visitas, contactos por página y formulario, card "Elegí tu plan", barra, comparativas, búsquedas sin resultado) + Clarity. Cierra con 5 acciones de la semana. Solo analiza. | trig_01UzGdmWF5raWSFB981YrgF2 |
| PrepagaYa · Control de contenido | Lunes a viernes 7:41 | Compila el sitio, revisa páginas clave y 60 del sitemap (errores, títulos largos, textos con meses viejos, links rotos, sin botón de cotizar). Arreglos chicos en un PR **sin mergear**. | trig_01F4cjcGtLq68t19DUHR8fYH |
| PrepagaYa · Search Console | Días 1 y 15, 9:10 | CTR por página con propuestas de título, consultas en posición 8-20, canibalización y artículos que faltan. Solo analiza. | trig_01A9FA6mMAAn9Vszp1oN57ze |

Una sola vez, el 21-oct-2026: medición de los cambios del 11-oct (card "Elegí tu plan" del inicio, "Elegí tu plan" en las páginas de plan, obras sociales y comparaciones Swiss vs OSDE/Sancor). Si la card del inicio no genera contactos, se saca. (trig_01VYrdV4k2xnbmRw1SP3BWpF)

## Pendiente de configurar (Darío, lunes o martes)

1. **Conector de Vercel en el agente de métricas.** Se creó sin conectores: en claude.ai → Routines → "PrepagaYa · Métricas y comportamiento", sumarle el conector de Vercel. Sin eso no lee las métricas.
2. **Clarity:**
   - En Clarity → Configuración → Exportar datos, generar un token.
   - Cargarlo en el entorno (menú del entorno en el título de la sesión → Editar) como variable `CLARITY_API_TOKEN`. No pegarlo en el chat.
   - En la misma pantalla, en Network access → Allowed domains, agregar `www.clarity.ms` (hoy está bloqueado).
3. **Search Console:**
   - Crear una cuenta de servicio de Google con acceso de lectura a la propiedad de prepagaya.com.ar.
   - Cargar su JSON en el entorno como `GSC_SERVICE_ACCOUNT_JSON`.
   - Si no se configura, el agente pide el export (Rendimiento → Exportar → últimos 28 días).
4. **Control de contenido:** en el entorno de Claude Code, chequear que la sesión pueda clonar y abrir PRs en Edifier27/prepagaya (el agente usa add_repo). Mirar el primer informe para confirmarlo.

## Reglas que respetan todos

- Solo datos oficiales: precios de los cuadros de la SSSalud.
- Swiss Medical siempre primero.
- No cambiar URLs.
- No publicar ni citar documentos internos de Swiss Medical.
- El precio exacto por edad del cotizador se ve solo después de dejar los datos.
- Los precios para leads son privados.
- Nunca pushean a main: solo PRs para revisar.
