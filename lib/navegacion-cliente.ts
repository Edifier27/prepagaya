// Página anterior dentro del sitio (acción 3, 24-oct-2026). Los leads del
// cotizador se mandan desde /comparador, así que el referer del pedido no
// dice desde qué ficha, plan o guía llegó la persona. SiteChrome anota cada
// cambio de ruta en sessionStorage y el cotizador manda la anterior. Sirve
// también para los ~60 links al comparador que no llevan ?desde=.
const ACTUAL = 'pya_ruta_actual'
const PREVIA = 'pya_ruta_previa'

export function registrarRuta(ruta: string) {
  try {
    const actual = sessionStorage.getItem(ACTUAL)
    if (actual === ruta) return // recarga de la misma página
    if (actual) sessionStorage.setItem(PREVIA, actual)
    sessionStorage.setItem(ACTUAL, ruta)
  } catch { /* sin sessionStorage */ }
}

/** Ruta en la que estaba la persona antes de la actual ('' si entró directo acá). */
export function paginaPrevia(): string {
  try {
    return (sessionStorage.getItem(PREVIA) ?? '').slice(0, 100)
  } catch {
    return ''
  }
}
