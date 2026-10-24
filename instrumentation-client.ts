import { initBotId } from 'botid/client/core'

// Detector de robots de Vercel (BotID, 23-oct-2026) en las direcciones
// internas que calculan o reciben datos. Verifica que el pedido venga de un
// navegador de verdad, sin captcha. Solo en estas rutas: las páginas siguen
// abiertas para Google y las IA. Cada ruta de esta lista tiene que llamar a
// checkBotId() en el servidor (y al revés).
initBotId({
  protect: [
    // Precio de cualquier grupo y zona: sin esto se podía bajar la tabla entera
    { path: '/api/precios', method: 'POST' },
    { path: '/api/resenas', method: 'POST' },
  ],
})
