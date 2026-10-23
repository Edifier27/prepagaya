# Seguridad del formulario y del panel

Controles agregados el 21-oct-2026 (auditoría). Hay partes en el código y partes que se configuran en Vercel a mano.

## En el código

- **/api/leads**
  - Descarta en silencio los leads con el campo trampa completo (`pya_confirmacion`, `components/ui/CampoTrampa.tsx`).
  - Rechaza campos demasiado largos y celulares con menos de 6 o más de 20 dígitos (`lib/leads-validacion.ts`).
  - Acepta fuentes `prueba-…` solo con `Authorization: Bearer <CRON_SECRET>`.
  - El log ya no guarda nombre, email ni celular.
- **/api/leads/complemento:** largo máximo de email y celular.
- **Panel:** la sesión dura 7 días. Permite 5 intentos fallidos por IP cada 15 minutos, y cada fallo tarda 1 segundo. Ese límite es por instancia de la función, así que el freno fuerte es la regla del firewall.
- Se borró `/api/debug-geo`.

## En Vercel (a mano)

1. **Límite para el formulario.** Proyecto prepagaya → Firewall → Configure → New Rule.
   - Nombre: "Límite leads".
   - If: Request Path · Equals · `/api/leads`, AND Method · Equals · `POST`.
   - Then: Rate Limit · Fixed Window · 600 segundos · 10 requests · por IP · al pasarse: Deny (o "Too Many Requests").
   - Save → Review Changes → Publish.
2. **Límite para el login del panel.** Igual que la anterior, con Request Path · Equals · `/panel-leads` y Method · `POST`, 10 requests cada 900 segundos.
3. **Límite para las direcciones internas de datos** (anti-scraping, 23-oct-2026). Otra regla:
   - If: Request Path · Starts with · `/api/`.
   - Then: Rate Limit · Fixed Window · 60 segundos · 60 requests · por IP · Deny.
   - Una persona usando el cotizador, las cartillas o el buscador hace pocos pedidos por minuto. Un programa que baja toda la tabla de precios o todas las cartillas pasa ese número enseguida.
   - No afecta a Google ni a las IA, que leen las páginas, no estas direcciones.
4. **Vistas previas privadas.** Settings → Deployment Protection → Vercel Authentication → "Standard Protection". Hoy las URLs de prueba (`prepagaya-xxxx.vercel.app`) son públicas y usan la misma base.
5. **Contraseña del panel.** Settings → Environment Variables → `PANEL_PASSWORD`: una frase larga (20 o más caracteres). Redeploy. Al cambiarla se cierran todas las sesiones abiertas.

## Para probar el cupo de mail

Las fuentes `prueba-…` ahora necesitan el secreto del cron:

```
curl -X POST https://prepagaya.com.ar/api/leads -H "Authorization: Bearer $CRON_SECRET" -H "Content-Type: application/json" -d '{"nombre":"Prueba","email":"prueba@prepagaya.com.ar","celular":"1100000099","fuente":"prueba-cupo-mail"}'
```
