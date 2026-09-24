import { prepagas } from '@/lib/data/prepagas'
import { obrasSociales } from '@/lib/data/obras-sociales'
import { entidadesRegistro, codigoSeisDigitos, nombreLegible, registroDeObraSocial, PREPAGA_A_REGISTRO } from '@/lib/data/registro-sssalud'
import { SANATORIOS_SEO, sanatoriosPublicables } from '@/lib/data/sanatorios-seo'
import { indiceCobertura } from '@/lib/data/cartilla-zonas/indice-cobertura'
import { CARTILLAS } from '@/lib/data/cartilla-zonas'
import { coberturas } from '@/lib/data/coberturas'
import { coberturasMarca } from '@/lib/data/coberturas-marca'
import { comparativas } from '@/lib/data/comparativas'
import { guias } from '@/lib/data/guias'
import { blogPosts } from '@/lib/data/blog'
import { provinciasSEO } from '@/lib/data/zonas'
import { FICHAS_REGISTRO } from '@/lib/data/fichas-registro'
import { normalizarTexto } from '@/lib/cartilla-zonas-geo'

// Índice del buscador del sitio (24-sep-2026, idea de Darío: "que busque la
// prepaga que quieras y le salte nuestra URL"). Se arma en el build y se
// sirve estático desde /api/buscador; el cliente lo baja al abrir el
// buscador. Cada entrada: [título, url, grupo, subtítulo, texto extra para
// buscar, peso]. El subtítulo ya contesta lo más buscado (ej. el código de
// una obra social) sin tener que entrar. El peso sube las páginas propias
// (ej. /sanatorios/sanatorio-guemes) sobre homónimos del interior.

export const GRUPOS_BUSCADOR = ['Herramientas', 'Prepagas', 'Planes', 'Sanatorios', 'Obras sociales', 'Códigos', 'Coberturas', 'Comparativas', 'Zonas', 'Guías'] as const

export type EntradaBuscador = [titulo: string, url: string, grupo: number, subtitulo: string, extra: string, peso?: number]

const G = (nombre: (typeof GRUPOS_BUSCADOR)[number]) => GRUPOS_BUSCADOR.indexOf(nombre)

let cache: EntradaBuscador[] | null = null

export function indiceBuscador(): EntradaBuscador[] {
  if (cache) return cache
  const out: EntradaBuscador[] = []
  const add = (t: string, u: string, g: number, s = '', k = '', peso = 0) => out.push(peso ? [t, u, g, s, k, peso] : [t, u, g, s, k])

  // Herramientas y páginas clave
  add('Cotizar prepaga', '/comparador', G('Herramientas'), 'Precio exacto por edad y zona', 'cotizador cotizacion comparador precio')
  add('¿Qué prepaga cubre mi sanatorio?', '/buscar-por-sanatorio', G('Herramientas'), 'Buscador por cartilla oficial', 'sanatorio clinica hospital cartilla')
  add('Chequeá tu prepaga', '/chequeo-prepaga', G('Herramientas'), 'Cuánto pagás, cuánto aumenta, cuánto podés ahorrar', 'aumento cuota pago de mas ahorro')
  add('¿Qué prepaga me conviene?', '/match-prepaga', G('Herramientas'), 'Test de 6 preguntas', 'test quiz cual elegir mejor')
  add('Precios de prepagas', '/precios', G('Herramientas'), 'Lista oficial de todos los planes', 'precio cuanto sale cuota valores')
  add('Aumentos de prepagas', '/aumentos', G('Herramientas'), 'Dato oficial mes a mes', 'aumento suba octubre septiembre')
  add('De tu obra social a una prepaga', '/calculadora-aportes', G('Herramientas'), 'Cuánto pagás de diferencia con tus aportes', 'aportes derivar sueldo descuento obra social diferencia calculadora')
  add('Códigos de obras sociales', '/obras-sociales/codigos', G('Herramientas'), 'Código RNOS para AFIP/ARCA', 'codigo rnos rnas afip arca alta temprana')
  add('Ranking de prepagas', '/ranking', G('Herramientas'), 'Las mejores prepagas', 'mejores ranking')
  add('Prepagas económicas', '/prepagas-economicas', G('Herramientas'), 'Los planes más baratos', 'barata economica')

  // Prepagas y planes
  for (const p of prepagas) {
    const reg = PREPAGA_A_REGISTRO[p.slug]
    const cod = reg ? entidadesRegistro.find((e) => e.slug === reg)?.codigo : null
    add(p.nombre, `/prepagas/${p.slug}`, G('Prepagas'), `Planes y precios${cod ? ` · código ${codigoSeisDigitos(cod)}` : ''}`, cod ? codigoSeisDigitos(cod) : '')
    for (const pl of p.planes) {
      const nombrePlan = pl.nombre.startsWith(p.nombre) ? pl.nombre : `${p.nombre} ${pl.nombre}`
      add(nombrePlan, `/prepagas/${p.slug}/${pl.slug}`, G('Planes'), pl.copago ? 'Con copago' : 'Sin copago', pl.slug)
    }
    if (CARTILLAS[p.slug]) add(`Cartilla de ${p.nombre}`, `/cartillas/${p.slug}`, G('Prepagas'), 'Sanatorios y guardias por zona', 'cartilla medica prestadores')
  }

  // Sanatorios: primero las páginas propias; el resto, al buscador por
  // sanatorio con ese sanatorio ya cargado.
  const publicables = new Set(sanatoriosPublicables().map((s) => s.slug))
  const conPagina = SANATORIOS_SEO.filter((s) => publicables.has(s.slug))
  for (const s of conPagina) add(s.nombre, `/sanatorios/${s.slug}`, G('Sanatorios'), `Qué prepagas lo cubren${s.ciudadNombre ? ` · ${s.ciudadNombre}` : ''}`, '', 3)
  for (const s of indiceCobertura().sanatorios) {
    const n = normalizarTexto(s.n)
    const yaTiene = conPagina.some((p) => (p.ciudad ? normalizarTexto(s.rn).includes(p.ciudad) : s.rn === 'AMBA') && p.claves.every((k) => n.includes(k)) && !(p.excluir ?? []).some((k) => n.includes(k)))
    if (yaTiene) continue
    add(s.n, `/buscar-por-sanatorio?s=${encodeURIComponent(s.id)}`, G('Sanatorios'), `Qué prepagas lo cubren · ${s.rn}`, s.d ?? '')
  }

  // Obras sociales con ficha, y el resto del registro como código
  const conFicha = new Set<string>()
  for (const os of obrasSociales) {
    const e = registroDeObraSocial(os.slug)
    if (e) conFicha.add(e.slug)
    add(os.nombre, `/obras-sociales/${os.slug}`, G('Obras sociales'), e?.codigo ? `Código ${codigoSeisDigitos(e.codigo)}` : 'Obra social', [e?.razonSocial, ...(e?.alias ?? [])].filter(Boolean).join(' '))
  }
  // Fichas armadas con el registro (teléfono y código)
  for (const f of FICHAS_REGISTRO) {
    const e = entidadesRegistro.find((x) => x.slug === f.slug)
    if (!e?.codigo) continue
    conFicha.add(e.slug)
    add(f.nombreCorto, `/obras-sociales/${f.slug}`, G('Obras sociales'), `Código ${codigoSeisDigitos(e.codigo)}${e.telefono ? ` · Tel. ${e.telefono}` : ''}`,
      [e.nombre, e.razonSocial, e.sigla, ...(e.alias ?? []), ...f.keywords, e.codigo, codigoSeisDigitos(e.codigo)].filter(Boolean).join(' '))
  }
  for (const e of entidadesRegistro) {
    if (conFicha.has(e.slug) || Object.values(PREPAGA_A_REGISTRO).includes(e.slug)) continue
    add(nombreLegible(e.nombre), `/obras-sociales/codigos#${e.slug}`, G('Códigos'), e.codigo ? `Código ${codigoSeisDigitos(e.codigo)} · RNAS ${e.codigo}` : 'Sin código nacional (régimen propio)', [e.razonSocial, e.sigla, ...(e.alias ?? []), e.codigo, e.codigo && codigoSeisDigitos(e.codigo)].filter(Boolean).join(' '))
  }

  // Coberturas
  for (const c of coberturas) add(c.titulo, `/coberturas/${c.slug}`, G('Coberturas'), 'Qué cubren las prepagas', c.nombre)
  for (const c of coberturasMarca) add(c.pregunta, `/coberturas/${c.tema}/${c.prepagaSlug}`, G('Coberturas'), 'Plan por plan, con fuente oficial', c.keywords.join(' '))

  // Comparativas
  for (const c of comparativas) add(c.titulo, `/comparativas/${c.slug}`, G('Comparativas'), 'Comparativa', 'vs versus diferencia')

  // Zonas
  for (const p of provinciasSEO) {
    add(`Prepagas en ${p.nombre}`, `/prepagas/${p.slug}`, G('Zonas'), 'Precios y cartilla en tu provincia', p.capitalNombre)
    for (const l of p.localidades) add(`Prepagas en ${l.nombre}`, `/prepagas/${p.slug}/${l.slug}`, G('Zonas'), p.nombre)
  }

  // Guías y blog
  for (const g of guias) add(g.titulo, `/guias/${g.slug}`, G('Guías'), g.categoria)
  for (const b of blogPosts) add(b.titulo, `/blog/${b.slug}`, G('Guías'), b.categoria)

  cache = out
  return out
}
