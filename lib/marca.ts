// La "P" de PrepagaYa — la misma del logo del header (components/layout/
// Header.tsx): cursiva, blanca sobre el rojo de la marca. Una sola fuente
// para favicon, ícono de iPhone, íconos del panel y el logo que ve Google en
// los datos estructurados (26-sep-2026). app/icon.svg repite este dibujo
// porque tiene que ser un archivo estático.

export const ROJO_MARCA = '#E8002D'

const P = `<g transform="translate(18,18) skewX(-14) translate(-18,-18)"><rect x="10" y="7" width="6" height="22" fill="#fff"/><path d="M15.5 7 H16 A9 9 0 0 1 16 25 H15.5 Z" fill="#fff"/><path d="M16 11 A5 5 0 0 1 16 21 Z" fill="${ROJO_MARCA}"/></g>`

/** `circulo`: como el header y el favicon. `cuadrado`: fondo lleno, para
 *  íconos a los que el sistema les recorta las esquinas (iPhone, Android). */
export function marcaSvg(forma: 'circulo' | 'cuadrado'): string {
  const fondo = forma === 'circulo' ? `<circle cx="18" cy="18" r="18" fill="${ROJO_MARCA}"/>` : `<rect width="36" height="36" fill="${ROJO_MARCA}"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">${fondo}${P}</svg>`
}

export const marcaDataUri = (forma: 'circulo' | 'cuadrado') => `data:image/svg+xml;base64,${btoa(marcaSvg(forma))}`
