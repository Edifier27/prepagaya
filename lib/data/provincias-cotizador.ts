// Provincias del cotizador y su zona del motor de precios (lib/precios/motor.ts).
// 'otras' = sin cuadro regional propio en la mayoría de las prepagas.

export interface Provincia { slug: string; nombre: string; zonaKey: string }
export const PROVINCIAS: Provincia[] = [
  { slug: 'caba',         nombre: 'CABA',                    zonaKey: 'caba' },
  { slug: 'buenos-aires', nombre: 'Gran Buenos Aires (GBA)', zonaKey: 'buenos-aires' },
  { slug: 'buenos-aires-interior', nombre: 'Interior de Buenos Aires', zonaKey: 'buenos-aires-interior' },
  { slug: 'cordoba',      nombre: 'Córdoba',                 zonaKey: 'cordoba' },
  { slug: 'santa-fe',     nombre: 'Santa Fe',                zonaKey: 'santa-fe' },
  { slug: 'mendoza',      nombre: 'Mendoza',                 zonaKey: 'mendoza' },
  { slug: 'tucuman',      nombre: 'Tucumán',                 zonaKey: 'tucuman' },
  { slug: 'entre-rios',   nombre: 'Entre Ríos',              zonaKey: 'entre-rios' },
  { slug: 'salta',        nombre: 'Salta',                   zonaKey: 'salta' },
  { slug: 'neuquen',      nombre: 'Neuquén',                 zonaKey: 'neuquen' },
  { slug: 'misiones',     nombre: 'Misiones',                zonaKey: 'misiones' },
  { slug: 'chaco',        nombre: 'Chaco',                   zonaKey: 'chaco' },
  { slug: 'corrientes',   nombre: 'Corrientes',              zonaKey: 'corrientes' },
  { slug: 'rio-negro',    nombre: 'Río Negro',               zonaKey: 'rio-negro' },
  { slug: 'jujuy',        nombre: 'Jujuy',                   zonaKey: 'jujuy' },
  { slug: 'santiago',     nombre: 'Santiago del Estero',     zonaKey: 'otras' },
  { slug: 'san-juan',     nombre: 'San Juan',                zonaKey: 'otras' },
  { slug: 'san-luis',     nombre: 'San Luis',                zonaKey: 'otras' },
  { slug: 'la-pampa',     nombre: 'La Pampa',                zonaKey: 'otras' },
  { slug: 'catamarca',    nombre: 'Catamarca',               zonaKey: 'otras' },
  { slug: 'la-rioja',     nombre: 'La Rioja',                zonaKey: 'otras' },
  { slug: 'chubut',       nombre: 'Chubut',                  zonaKey: 'otras' },
  { slug: 'formosa',      nombre: 'Formosa',                 zonaKey: 'otras' },
  { slug: 'santa-cruz',   nombre: 'Santa Cruz',              zonaKey: 'otras' },
  { slug: 'tierra-fuego', nombre: 'Tierra del Fuego',        zonaKey: 'otras' },
]
