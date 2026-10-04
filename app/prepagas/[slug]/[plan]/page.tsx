import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prepagas, PRECIO_ACTUALIZADO, nivelPrecio } from '@/lib/data/prepagas'
import { getProvinciaSEO, provinciasSEO } from '@/lib/data/zonas'
import { getPlanMenosCopago, getGrupoCartilla, ordenarPorCartilla } from '@/lib/data/cartilla-grupos'
import { SITE_NAME, SITE_URL, formatPrecio, PRECIO_VALIDO_HASTA, PARTNERS_OFICIALES_SLUGS } from '@/lib/utils'
import { PrepagaLogo } from '@/components/ui/PrepagaLogo'
import { NivelPrecioBadge } from '@/components/ui/NivelPrecioBadge'
import { ContratarPlanButton } from '@/components/prepagas/ContratarPlanButton'
import { CartillaPlanTuZona } from '@/components/cartillas/CartillaPlanTuZona'
import { BarraCotizar } from '@/components/prepagas/BarraCotizar'
import { escalaPorEdad, preciosPorRegion } from '@/lib/precios/motor'
import { coberturasMarca } from '@/lib/data/coberturas-marca'
import { sanatorios } from '@/lib/data/sanatorios'
import { linkCartillaPlan, CARTILLAS, type CartillaPrepaga } from '@/lib/data/cartilla-zonas'
import { clavesRenombre, resumirZonaPlan } from '@/lib/cartilla-plan-resumen'
import { RankingZonaPage, rankingZonaMetadata } from '@/components/seo-local/RankingZonaPage'
import { PrepagaZonaPage, prepagaZonaMetadata } from '@/components/seo-local/PrepagaZonaPage'
import { LocalidadPage, localidadMetadata } from '@/components/seo-local/LocalidadPage'
import { comparativasPlanes, getComparativaPlanes, getComparativaParaPlan, type ComparativaPlanes } from '@/lib/data/comparativas-planes'
import { ComparativaPlanesPage, comparativaPlanesMetadata } from '@/components/prepagas/ComparativaPlanesPage'
import { paresComparativaAuto, ordenPlanes } from '@/lib/comparativas-auto'
import { OrejitaPlan, type OrejitaDatos } from '@/components/prepagas/OrejitaPlan'
import type { Prepaga } from '@/types'

interface Props {
  params: Promise<{ slug: string; plan: string }>
  searchParams: Promise<{ cartilla?: string; provincia?: string }>
}

type Plan = Prepaga['planes'][number]

function getPerfilDelPlan(plan: Plan): { titulo: string; desc: string }[] {
  const items: { titulo: string; desc: string }[] = []
  if (!plan.copago) items.push({
    titulo: 'Usuarios frecuentes del sistema de salud',
    desc: 'Sin copago: cuanto más consultás, más te conviene. Especialistas, kinesio, estudios — todo sin ticket adicional.',
  })
  if (plan.copago) items.push({
    titulo: 'Personas jóvenes y en general sanas',
    desc: 'Con copago el costo mensual baja. Ideal si usás el sistema solo para urgencias y controles anuales.',
  })
  if (plan.redAbierta) items.push({
    titulo: 'Quienes eligen libremente su médico',
    desc: 'Red abierta: cualquier profesional de la cartilla, sin derivaciones ni restricción por zona o centro.',
  })
  if (!plan.redAbierta) items.push({
    titulo: 'Quienes se atienden siempre en el mismo centro',
    desc: 'Red cerrada con prestadores de calidad garantizada. Sin pagar de más por amplitud que no vas a usar.',
  })
  const tieneMaternidad = plan.cobertura.some(c => c.toLowerCase().includes('maternidad'))
  if (tieneMaternidad) items.push({
    titulo: 'Parejas con planes de tener hijos',
    desc: 'Maternidad y parto cubiertos. Incluye controles de embarazo, pediatría y primer año del bebé.',
  })
  const tieneSaludMental = plan.cobertura.some(c => c.toLowerCase().includes('psicolog') || c.toLowerCase().includes('salud mental'))
  if (tieneSaludMental) items.push({
    titulo: 'Quienes usan o planean usar salud mental',
    desc: 'Psicología incluida. Sin derivación médica previa para empezar a atenderte.',
  })
  return items.slice(0, 3)
}

// Contenido SEO de plan (Darío, 23-sep-2026; primero Swiss, después
// OSDE, Premedic, Avalian y Sancor): todo sale de datos con fuente — escala de
// precio por edad del cuadro tarifario SSSalud y la cobertura plan por plan de
// las fichas oficiales (coberturas-marca.ts), cuando la hay.
// Medifé se sumó el 28-sep-2026 (Darío: mejorar las páginas de planes de
// todas las prepagas). Prevención espera: su cuadro oficial tiene solo tres
// franjas de edad con valores que hay que confirmar.
const PREPAGAS_PLAN_SEO = ['swiss-medical', 'osde', 'premedic', 'avalian', 'sancor-salud', 'medife']

/** Nombre corto del plan como se busca: "Swiss Medical SMG20", "OSDE 210".
 *  Si el nombre no tiene número queda "Plan": "Medifé Plan Oro" (se busca
 *  "medife plan oro", no "medife oro"). */
function codigoPlan(plan: Plan) {
  const corto = plan.nombre.replace(/^Plan\s+/, '')
  return /\d/.test(corto) ? corto : plan.nombre
}

/** Nombre de la cartilla oficial de un plan: "Global", "Premium", "Plan 310" */
function cartillaDePlan(c: CartillaPrepaga | undefined, planSlug: string): string | undefined {
  const pc = c?.planes.find((x) => x.comparadorSlug === planSlug || x.otrosComparadorSlugs?.includes(planSlug))
  if (!pc) return undefined
  return pc.label.match(/\(([^)]+)\)$/)?.[1] ?? pc.label
}

function regionTexto(r: string) {
  if (/^(general|avalian)$/i.test(r)) return 'lista general'
  if (r === r.toUpperCase() && r.length > 4) return r.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase()).replace(/ (De|Del|Y) /g, (x) => x.toLowerCase())
  return r
}

function contenidoPlan(prep: Prepaga, plan: Plan) {
  if (!PREPAGAS_PLAN_SEO.includes(prep.slug)) return null
  const codigo = codigoPlan(plan)
  const nombreLargo = `${prep.nombre} ${codigo}`
  const escala = escalaPorEdad(prep.slug, plan.slug, 'caba')
  const region = escala ? regionTexto(escala.region) : ''
  const coberturas = coberturasMarca
    .filter((c) => c.prepagaSlug === prep.slug)
    .flatMap((c) => c.planes.filter((f) => f.planSlugs.includes(plan.slug)).map((f) => ({ tema: c.tema, nombre: c.temaNombre, fila: f })))
  const reintegros = coberturas.find((c) => c.tema === 'reintegros')?.fila
  const precioEdad = (edad: number) => escala?.rangos.find((x) => x.desde <= edad && edad <= x.hasta)?.precio
  // Plan siguiente en la escalera (orden por precio a los 30), sin variantes
  // (Sport de Swiss, GEN, Digital Flex y con coseguro de Sancor, planes con edad acotada)
  const orden = [...prep.planes]
    .filter((x) => !x.slug.startsWith('sport') && !x.slug.endsWith('-cc') && !x.slug.includes('digital-flex') && !x.edadMaxima)
    .sort((a, b) => a.precio - b.precio)
  const idx = orden.findIndex((x) => x.slug === plan.slug)
  const siguiente = idx >= 0 ? orden[idx + 1] : undefined
  const anterior = idx > 0 ? orden[idx - 1] : undefined
  const regiones = preciosPorRegion(prep.slug, plan.slug)
  const diferencias = tablaDiferencias(prep, plan, siguiente ?? anterior, coberturas)
  const faqs: { q: string; a: string }[] = []
  if (escala) {
    const edades = [40, 50, 60].filter((e) => precioEdad(e))
    faqs.push({
      q: `¿Cuánto cuesta el ${nombreLargo} según la edad?`,
      a: `Según el cuadro tarifario que ${prep.nombre} declara ante la Superintendencia de Servicios de Salud (${PRECIO_ACTUALIZADO}, ${region}, contratación directa, IVA incluido): ${edades.map((e) => `${formatPrecio(precioEdad(e)!)} a los ${e} años`).join(', ')}. ${prep.nombre} ajusta el precio por rangos de edad; hasta los ${escala.rangos[0].hasta} años se paga ${formatPrecio(escala.rangos[0].precio)}.`,
    })
  }
  if (reintegros && !reintegros.sinDato) {
    faqs.push({
      q: `¿El ${nombreLargo} tiene reintegros?`,
      a: reintegros.incluido
        ? `Sí. Según la ficha oficial, el ${codigo} incluye reintegros${reintegros.detalle ? ` (${reintegros.detalle.toLowerCase()})` : ''}: podés atenderte fuera de cartilla y pedir el reintegro, con topes por práctica.`
        : `No. Según la ficha oficial, el ${codigo} no tiene reintegros: te atendés con los prestadores de la cartilla.`,
    })
  }
  if (siguiente && diferencias && diferencias.otro.slug === siguiente.slug) {
    // Con datos concretos (28-sep-2026): se busca "smg20 vs smg30"
    const cod2 = codigoPlan(siguiente)
    const p30 = diferencias.filas.find((f) => f.edad === 30)
    const plano = (t: string) => (/^[✓✕] /.test(t) ? t.slice(2).replace(/^\S/, (c) => c.toLowerCase()) : t.replace(/^(Con|Sin) /, (m) => m.toLowerCase()))
    const cambios = diferencias.filas.filter((f) => !f.edad && f.a !== f.b).slice(0, 3).map((f) => `${f.label.toLowerCase()}: ${plano(f.a)} en el ${codigo} y ${plano(f.b)} en el ${cod2}`)
    faqs.push({
      q: `¿Qué diferencia hay entre el ${codigo} y el ${cod2} de ${prep.nombre}?`,
      a: `${p30 ? `A los 30 años, en la lista oficial de ${PRECIO_ACTUALIZADO.toLowerCase()} (${region}), el ${codigo} sale ${p30.a} y el ${cod2} ${p30.b} por mes. ` : ''}${cambios.length ? `Cambia ${cambios.join('; ')}. ` : ''}${siguiente.descripcion}`,
    })
  }
  return { codigo, nombreLargo, escala, region, coberturas, faqs, regiones, diferencias }
}

type FilaCobertura = { tema: string; nombre: string; fila: { incluido: boolean; detalle?: string; sinDato?: boolean } }

function textoCobertura(f?: FilaCobertura['fila']): string {
  if (!f || f.sinDato) return 'Sin dato'
  return f.incluido ? `✓ ${f.detalle ?? 'Incluido'}` : `✕ ${f.detalle ?? 'No incluido'}`
}

/** Tabla del plan contra el escalón vecino, solo con datos oficiales: precio
 *  de lista por edad (SSSalud), copago, cartilla y lo que dicen las fichas. */
function tablaDiferencias(prep: Prepaga, plan: Plan, otro: Plan | undefined, coberturas: FilaCobertura[]) {
  if (!otro) return null
  const e1 = escalaPorEdad(prep.slug, plan.slug, 'caba')
  const e2 = escalaPorEdad(prep.slug, otro.slug, 'caba')
  if (!e1 || !e2) return null
  const precio = (e: typeof e1, edad: number) => e.rangos.find((x) => x.desde <= edad && edad <= x.hasta)?.precio
  const filas: { label: string; a: string; b: string; edad?: number }[] = []
  for (const edad of [30, 45, 60]) {
    const a = precio(e1, edad)
    const b = precio(e2, edad)
    if (a && b) filas.push({ label: `Precio de lista a los ${edad} años`, a: formatPrecio(a), b: formatPrecio(b), edad })
  }
  filas.push({ label: 'Copago en consultas', a: plan.copago ? 'Con copago' : 'Sin copago', b: otro.copago ? 'Con copago' : 'Sin copago' })
  const c1 = cartillaDePlan(CARTILLAS[prep.slug], plan.slug)
  const c2 = cartillaDePlan(CARTILLAS[prep.slug], otro.slug)
  if (c1 && c2) filas.push({ label: 'Cartilla', a: c1, b: c2 })
  const delOtro = coberturasMarca
    .filter((c) => c.prepagaSlug === prep.slug)
    .flatMap((c) => c.planes.filter((f) => f.planSlugs.includes(otro.slug)).map((f) => ({ tema: c.tema, nombre: c.temaNombre, fila: f })))
  for (const t of [...new Set([...coberturas.map((c) => c.tema), ...delOtro.map((c) => c.tema)])]) {
    const x = coberturas.find((c) => c.tema === t)
    const y = delOtro.find((c) => c.tema === t)
    filas.push({ label: (x ?? y)!.nombre, a: textoCobertura(x?.fila), b: textoCobertura(y?.fila) })
  }
  return { otro, esSuperior: otro.precio > plan.precio, filas, conFichas: coberturas.length + delOtro.length > 0 }
}

// Comparativas automáticas plan vs plan vecino (4-oct-2026): los pares salen
// de lib/comparativas-auto.ts; el contenido, de la misma tabla de diferencias
// de la página de plan (cuadro SSSalud, fichas oficiales, cartillas).
function comparativaAuto(slug: string, planSlug: string) {
  const c = paresComparativaAuto().find((x) => x.prep.slug === slug && x.slug === planSlug)
  if (!c) return null
  const { prep, plan1, plan2 } = c
  const cob1 = coberturasMarca
    .filter((x) => x.prepagaSlug === prep.slug)
    .flatMap((x) => x.planes.filter((f) => f.planSlugs.includes(plan1.slug)).map((f) => ({ tema: x.tema, nombre: x.temaNombre, fila: f })))
  const dif = tablaDiferencias(prep, plan1, plan2, cob1)
  if (!dif) return null
  const [cod1, cod2] = [codigoPlan(plan1), codigoPlan(plan2)]
  const e1 = escalaPorEdad(prep.slug, plan1.slug, 'caba')!
  const e2 = escalaPorEdad(prep.slug, plan2.slug, 'caba')!
  const precio = (e: typeof e1, edad: number) => e.rangos.find((x) => x.desde <= edad && edad <= x.hasta)?.precio ?? 0
  const region = regionTexto(e1.region)
  const d30 = precio(e2, 30) - precio(e1, 30)
  const plano = (t: string) => (/^[✓✕] /.test(t) ? t.slice(2).replace(/^\S/, (ch) => ch.toLowerCase()) : t.replace(/^(Con|Sin) /, (m) => m.toLowerCase()))
  const cambios = dif.filas.filter((f) => !f.edad && f.a !== f.b)
  const textoCambios = cambios.slice(0, 4).map((f) => `${f.label.toLowerCase()}: ${plano(f.a)} en el ${cod1} y ${plano(f.b)} en el ${cod2}`)
  const comp: ComparativaPlanes = {
    slug: planSlug,
    prepagaSlug: prep.slug,
    plan1Slug: plan1.slug,
    plan2Slug: plan2.slug,
    titulo: `${prep.nombre} ${cod1} vs ${cod2}: diferencias y cuál conviene`,
    descripcion: `Diferencias entre el ${cod1} y el ${cod2} de ${prep.nombre}: precio por edad según la lista oficial, copago, cartilla y coberturas.`,
    respuestaCorta: `A los 30 años, el ${cod2} cuesta ${formatPrecio(Math.abs(d30))} ${d30 >= 0 ? 'más' : 'menos'} por mes que el ${cod1} (lista oficial de ${PRECIO_ACTUALIZADO.toLowerCase()}, ${region}).${textoCambios.length ? ` Lo que cambia: ${textoCambios.join('; ')}.` : ' Según los datos oficiales que relevamos, el resto de la cobertura es igual.'}`,
    veredicto: `Conviene el ${cod1} si buscás la cuota más baja de los dos${plan1.copago && !plan2.copago ? ' y vas poco al médico, porque tiene copago en consultas' : ''}. Conviene el ${cod2} si ${cambios.length ? `te importa lo que suma (${cambios.slice(0, 3).map((f) => f.label.toLowerCase()).join(', ')})` : 'preferís el plan superior'} y la diferencia de ${formatPrecio(Math.abs(d30))} por mes te cierra. Si trabajás en relación de dependencia, tus aportes pueden cubrir parte de la cuota o toda: cotizalo para ver tu número exacto.`,
    faqExtra: [
      {
        q: `¿Cuánto más sale el ${cod2} que el ${cod1}?`,
        a: `Según el cuadro tarifario que ${prep.nombre} declara ante la Superintendencia de Servicios de Salud (${PRECIO_ACTUALIZADO}, ${region}, IVA incluido): ${[30, 45, 60].filter((e) => precio(e1, e) && precio(e2, e)).map((e) => `a los ${e} años, ${formatPrecio(precio(e1, e))} el ${cod1} y ${formatPrecio(precio(e2, e))} el ${cod2}`).join('; ')}.`,
      },
      ...(textoCambios.length
        ? [{ q: `¿Qué cambia entre el ${cod1} y el ${cod2}?`, a: `${textoCambios.join('. ').replace(/^\S/, (ch) => ch.toUpperCase())}. Datos de las fichas oficiales y la cartilla de ${prep.nombre}.` }]
        : []),
      { q: `¿Puedo pasar del ${cod1} al ${cod2}?`, a: `Sí, se puede cambiar de plan dentro de ${prep.nombre}. Al subir de plan pueden aplicar carencias para las prestaciones nuevas: consultalo con un asesor antes de hacer el cambio.` },
    ],
  }
  return { comp, prep, plan1, plan2, filas: dif.filas }
}

/** Sanatorios con internación en CABA de un plan, según la cartilla oficial */
function sanatoriosCaba(prepSlug: string, planSlug: string): number {
  const c = CARTILLAS[prepSlug]
  const pc = c?.planes.find((x) => x.comparadorSlug === planSlug || x.otrosComparadorSlugs?.includes(planSlug))
  const caba = c?.zonas.find((z) => z.slug === 'caba')
  if (!pc || !caba) return 0
  return caba.centros.filter((x) => x.internacion.includes(pc.id)).length
}

// Orejitas de navegación entre planes (Darío, 4-oct-2026): en cada página de
// plan, a la derecha el plan siguiente ("¿buscás más cobertura?") y a la
// izquierda el anterior ("¿buscás pagar menos?"), en todas las prepagas.
// Lo que cambia sale solo de datos con fuente: con cuadro SSSalud y fichas
// oficiales (tablaDiferencias), copago, sanatorios con internación en CABA
// (cartilla oficial) y coberturas; si no, la cobertura publicada de cada plan.
// Sin diferencias puntuales, la orejita derecha usa la descripción del plan.

/** Qué tiene `mejor` que `base` no tenga, en frases cortas */
function ventajas(prep: Prepaga, base: Plan, mejor: Plan): string[] {
  const cobBase = coberturasMarca
    .filter((x) => x.prepagaSlug === prep.slug)
    .flatMap((x) => x.planes.filter((f) => f.planSlugs.includes(base.slug)).map((f) => ({ tema: x.tema, nombre: x.temaNombre, fila: f })))
  const dif = tablaDiferencias(prep, base, mejor, cobBase)
  const out: string[] = []
  if (dif) {
    const sinMarca = (t: string) => t.replace(/^[✓✕] /, '')
    for (const f of dif.filas) {
      if (f.edad || f.a === f.b || f.b === 'Sin dato') continue
      if (f.label === 'Copago en consultas') {
        if (f.a === 'Con copago' && f.b === 'Sin copago') out.push('consultas sin copago')
      } else if (f.label === 'Cartilla') {
        // Solo si de verdad tiene más sanatorios: un nombre distinto no dice que
        // sea mejor (S2 "Global" → SMG02 "Nubial Quality" es una cartilla más chica)
        const n = sanatoriosCaba(prep.slug, mejor.slug) - sanatoriosCaba(prep.slug, base.slug)
        if (n > 0) out.push(`${n} sanatorio${n === 1 ? '' : 's'} más para internación en CABA`)
      } else if (f.b.startsWith('✓') && (f.a.startsWith('✕') || f.a === 'Sin dato')) {
        out.push(f.label.toLowerCase())
      } else if (f.b.startsWith('✓') && f.a.startsWith('✓')) {
        // Solo con un detalle corto y concreto ("hasta 18 años")
        const detalle = sinMarca(f.b)
        if (detalle.length <= 32 && !/^incluido$/i.test(detalle)) out.push(`${f.label.toLowerCase()} (${detalle.replace(/^\S/, (c) => c.toLowerCase())})`)
      }
    }
  } else if (base.copago && !mejor.copago) {
    // Sin fichas oficiales plan por plan solo se afirma el copago: comparar
    // las listas de cobertura escritas distinto daba falsos ("el Flux no
    // tiene internación"). El resto lo cuenta la descripción del plan.
    out.push('consultas sin copago')
  }
  return out
}

/** Diferencia de cuota a los 30 años (lista oficial si la hay, si no el precio de lista del plan) */
function diferencia30(prep: Prepaga, a: Plan, b: Plan): { monto: number; oficial: boolean } {
  const e1 = escalaPorEdad(prep.slug, a.slug, 'caba')
  const e2 = escalaPorEdad(prep.slug, b.slug, 'caba')
  const precio = (e: typeof e1, edad: number) => e?.rangos.find((x) => x.desde <= edad && edad <= x.hasta)?.precio ?? 0
  if (e1 && e2 && precio(e1, 30) && precio(e2, 30)) return { monto: precio(e2, 30) - precio(e1, 30), oficial: true }
  return { monto: b.precio - a.precio, oficial: false }
}

const listaY = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}` : xs[0] ?? '')

function hrefComparacion(prep: Prepaga, a: Plan, b: Plan): string | undefined {
  const par = paresComparativaAuto().find((c) => c.prep.slug === prep.slug && c.plan1.slug === a.slug && c.plan2.slug === b.slug)
  if (par) return `/prepagas/${prep.slug}/${par.slug}`
  const manual = comparativasPlanes.find((c) => c.prepagaSlug === prep.slug && [c.plan1Slug, c.plan2Slug].includes(a.slug) && [c.plan1Slug, c.plan2Slug].includes(b.slug))
  return manual ? `/prepagas/${prep.slug}/${manual.slug}` : undefined
}

/** Línea de un plan: las variantes (GEN, con coseguro, Digital Flex, Sport) son escaleras aparte */
function lineaDePlan(slug: string): string {
  if (slug.endsWith('-gen')) return 'gen'
  if (slug.endsWith('-cc')) return 'cc'
  if (slug.includes('digital-flex')) return 'digital-flex'
  if (slug.startsWith('sport')) return 'sport'
  return 'principal'
}

function orejitasPlan(prep: Prepaga, plan: Plan) {
  // Escalera por precio dentro de la línea del plan. Los planes con edad
  // acotada (Flux) se ubican por precio en la línea principal.
  const linea = lineaDePlan(plan.slug)
  const orden = linea === 'principal'
    ? ordenPlanes(prep)
    : prep.planes.filter((x) => lineaDePlan(x.slug) === linea).sort((a, b) => a.precio - b.precio)
  const idx = orden.findIndex((x) => x.slug === plan.slug)
  // Con coseguro / Digital Flex en el tope de su línea: el siguiente es el mismo plan sin la variante
  const base = prep.planes.find((x) => x.slug === plan.slug.replace(/-cc$|-digital-flex$/, '') && x.slug !== plan.slug)
  const siguiente = idx >= 0 ? (orden[idx + 1] ?? (linea === 'cc' || linea === 'digital-flex' ? base : undefined)) : orden.find((x) => x.precio > plan.precio)
  const anterior = idx >= 0 ? orden[idx - 1] : [...orden].reverse().find((x) => x.precio < plan.precio)
  const cod = codigoPlan(plan)
  const lista = (o: { oficial: boolean }) => (o.oficial ? `lista oficial ${PRECIO_ACTUALIZADO.toLowerCase()}` : `precio de lista ${PRECIO_ACTUALIZADO.toLowerCase()}`)

  let derecha: OrejitaDatos | null = null
  if (siguiente) {
    const cod2 = codigoPlan(siguiente)
    const suma = ventajas(prep, plan, siguiente).slice(0, 3)
    const d = diferencia30(prep, plan, siguiente)
    derecha = {
      lado: 'derecha',
      etiqueta: 'Plan siguiente',
      destino: cod2,
      texto: suma.length
        ? `¿Buscás un plan con **${listaY(suma)}**? Pasá del ${cod} al **${cod2}**.`
        : `¿Buscás más cobertura? El **${cod2}** es el plan siguiente de ${prep.nombre}. ${siguiente.descripcion}`,
      nota: d.monto > 0 ? `Cuesta ${formatPrecio(d.monto)} más por mes a los 30 años (${lista(d)}).` : undefined,
      href: `/prepagas/${prep.slug}/${siguiente.slug}`,
      hrefComparar: hrefComparacion(prep, plan, siguiente),
      origen: `${prep.slug}/${plan.slug}>${siguiente.slug}`,
    }
  }

  let izquierda: OrejitaDatos | null = null
  // Solo si de verdad es más barato ("¿buscás pagar menos?")
  const dAnterior = anterior ? diferencia30(prep, anterior, plan) : null
  if (anterior && dAnterior && dAnterior.monto > 0) {
    const cod0 = codigoPlan(anterior)
    const d = dAnterior
    const pierde = ventajas(prep, anterior, plan).filter((x) => x !== 'consultas sin copago').slice(0, 3)
    const conCopago = anterior.copago && !plan.copago
    izquierda = {
      lado: 'izquierda',
      etiqueta: conCopago ? 'Plan con copago' : 'Más económico',
      destino: cod0,
      texto: `¿Buscás pagar menos? El **${cod0}**${d.monto > 0 ? ` cuesta **${formatPrecio(d.monto)} menos** por mes a los 30 años` : ' es el plan anterior'}${conCopago ? ', con copago en consultas' : ''}.${pierde.length ? ` Frente al ${cod}, dejás de tener ${listaY(pierde.map((x) => x.replace(' más para', ' para')))}.` : ''}`,
      nota: d.monto > 0 ? `Diferencia según la ${lista(d)}.` : undefined,
      href: `/prepagas/${prep.slug}/${anterior.slug}`,
      hrefComparar: hrefComparacion(prep, anterior, plan),
      origen: `${prep.slug}/${plan.slug}<${anterior.slug}`,
    }
  }
  return { derecha, izquierda }
}

function buildPlanFAQs(plan: Plan, prep: Prepaga) {
  return [
    {
      q: `¿Cuánto cuesta el ${plan.nombre} de ${prep.nombre}?`,
      a: `El ${plan.nombre} de ${prep.nombre} cuesta ${formatPrecio(plan.precio)} por mes (precio de lista para una persona de 30 años, ${PRECIO_ACTUALIZADO.toLowerCase()}). El valor final varía según tu edad y tu provincia: a mayor edad, mayor es el costo mensual. Cotizá gratis en PrepagaYa para ver el precio exacto de tu perfil.`,
    },
    {
      q: `¿El ${plan.nombre} tiene copago en consultas?`,
      a: plan.copago
        ? `Sí, el ${plan.nombre} tiene copago en consultas médicas. Pagás un adicional por cada consulta, lo que baja la cuota mensual. Ideal si no usás el sistema con frecuencia.`
        : `No, el ${plan.nombre} no tiene copago en consultas. Podés ir al médico sin pagar nada extra por cada visita. Conviene si usás el sistema con frecuencia.`,
    },
    {
      q: `¿Qué cubre el ${plan.nombre} de ${prep.nombre}?`,
      a: `El ${plan.nombre} incluye: ${plan.cobertura.join(', ')}. La red es ${plan.redAbierta ? 'abierta (libre elección de prestador)' : 'cerrada (centros propios y convenios específicos)'}.`,
    },
    {
      q: `¿Cómo contratar el ${plan.nombre}?`,
      a: `Cotizá el precio exacto para tu edad usando el comparador gratuito de PrepagaYa. Un asesor te va a contactar para completar el trámite sin costo adicional.`,
    },
  ]
}

// Este segmento despacha dos silos: /prepagas/[prepaga]/[plan] (planes) y
// /prepagas/[provincia]/{mejores-prepagas|prepaga|localidad} (SEO local).
export async function generateStaticParams() {
  return [
    ...prepagas.flatMap((p) =>
      p.planes.map((pl) => ({ slug: p.slug, plan: pl.slug }))
    ),
    ...comparativasPlanes.map((c) => ({ slug: c.prepagaSlug, plan: c.slug })),
    ...paresComparativaAuto().map((c) => ({ slug: c.prep.slug, plan: c.slug })),
    ...provinciasSEO.flatMap((prov) => [
      { slug: prov.slug, plan: 'mejores-prepagas' },
      ...prov.prepagas.filter((pz) => pz.enSitio).map((pz) => ({ slug: prov.slug, plan: pz.slug })),
      ...prov.localidades.map((loc) => ({ slug: prov.slug, plan: loc.slug })),
    ]),
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, plan: planSlug } = await params
  const prov = getProvinciaSEO(slug)
  if (prov) {
    if (planSlug === 'mejores-prepagas') return rankingZonaMetadata(prov)
    const pz = prov.prepagas.find((x) => x.slug === planSlug && x.enSitio)
    if (pz) return prepagaZonaMetadata(prov, pz)
    const loc = prov.localidades.find((l) => l.slug === planSlug)
    if (loc) return localidadMetadata(prov, loc)
    return {}
  }
  const comp = getComparativaPlanes(slug, planSlug)
  if (comp) {
    const prepComp = prepagas.find((p) => p.slug === comp.prepagaSlug)
    const plan1Comp = prepComp?.planes.find((pl) => pl.slug === comp.plan1Slug)
    const plan2Comp = prepComp?.planes.find((pl) => pl.slug === comp.plan2Slug)
    if (prepComp && plan1Comp && plan2Comp) return comparativaPlanesMetadata(comp, prepComp, plan1Comp, plan2Comp)
    return {}
  }
  const auto = comparativaAuto(slug, planSlug)
  if (auto) return comparativaPlanesMetadata(auto.comp, auto.prep, auto.plan1, auto.plan2)
  const prep = prepagas.find((p) => p.slug === slug)
  const plan = prep?.planes.find((pl) => pl.slug === planSlug)
  if (!prep || !plan) return {}
  const escalaMeta = PREPAGAS_PLAN_SEO.includes(prep.slug) ? escalaPorEdad(prep.slug, plan.slug, 'caba') : null
  return {
    // "Qué cubre" en vez de "Cartilla" (22-sep-2026): la cartilla del plan vive
    // en /cartillas/[prepaga]/plan-x; acá se enlaza (ver cartillaPlanLink).
    // Swiss: "Swiss Medical SMG20" (sin "Plan", es como se busca) + precio por edad
    // "Cuánto sale" (23-sep-2026): misma intención que las fichas de prepaga.
    // absolute: sin "| PrepagaYa", para que Google lo muestre completo.
    title: {
      absolute: escalaMeta
        ? `${prep.nombre} ${codigoPlan(plan)}: cuánto sale por edad y qué cubre (${PRECIO_ACTUALIZADO.toLowerCase()})`
        : `${prep.nombre} ${plan.nombre}: cuánto sale en ${PRECIO_ACTUALIZADO.toLowerCase()} y qué cubre`,
    },
    description: escalaMeta
      ? `${prep.nombre} ${codigoPlan(plan)} en ${PRECIO_ACTUALIZADO.toLowerCase()}: ${formatPrecio(escalaMeta.rangos[0].precio)}/mes hasta los ${escalaMeta.rangos[0].hasta} años (lista oficial SSSalud, ${regionTexto(escalaMeta.region)}). ${plan.copago ? 'Con copago' : 'Sin copago'}, red ${plan.redAbierta ? 'abierta' : 'cerrada'}. Precio por edad, qué cubre y sanatorios de tu zona.`
      : `${prep.nombre} ${plan.nombre} cuesta ${formatPrecio(plan.precio)}/mes (persona de 30 años, ${PRECIO_ACTUALIZADO.toLowerCase()}${plan.fuentePrecio === 'sssalud' ? ', lista oficial SSSalud' : ''}). ${plan.copago ? 'Con copago.' : 'Sin copago.'} Red ${plan.redAbierta ? 'abierta' : 'cerrada'}. Cotizá el precio exacto para tu edad gratis.`,
    alternates: { canonical: `${SITE_URL}/prepagas/${slug}/${planSlug}` },
    keywords: [
      `${prep.nombre.toLowerCase()} ${plan.nombre.toLowerCase()}`,
      `${prep.nombre.toLowerCase()} ${plan.nombre.toLowerCase()} precio`,
      `precio ${prep.nombre.toLowerCase()} ${plan.nombre.toLowerCase()}`,
      `cuanto sale ${prep.nombre.toLowerCase()} ${plan.nombre.toLowerCase()}`,
      `cuanto cuesta ${prep.nombre.toLowerCase()} ${plan.nombre.toLowerCase()}`,
      `${prep.nombre.toLowerCase()} ${plan.nombre.toLowerCase()} cobertura`,
      `${prep.nombre.toLowerCase()} ${plan.nombre.toLowerCase()} que cubre`,
      // "cartilla" (29-sep-2026): autocomplete y "la gente también pregunta" de
      // Google muestran esta intención con mucho volumen y la página no la
      // tenía en keywords, aunque sí tiene el contenido (cartillaPlanLink,
      // sección "Qué incluye el plan").
      `cartilla ${prep.nombre.toLowerCase()} ${plan.nombre.toLowerCase()}`,
      `${prep.nombre.toLowerCase()} ${plan.nombre.toLowerCase()} cartilla`,
      `${prep.nombre.toLowerCase()} ${plan.nombre.toLowerCase()} opiniones`,
    ],
  }
}

export default async function PlanPage({ params, searchParams }: Props) {
  const { slug, plan: planSlug } = await params
  const prov = getProvinciaSEO(slug)
  if (prov) {
    if (planSlug === 'mejores-prepagas') return <RankingZonaPage prov={prov} />
    const pz = prov.prepagas.find((x) => x.slug === planSlug && x.enSitio)
    if (pz) return <PrepagaZonaPage prov={prov} pz={pz} />
    const loc = prov.localidades.find((l) => l.slug === planSlug)
    if (loc) return <LocalidadPage prov={prov} loc={loc} />
    notFound()
  }
  const comp = getComparativaPlanes(slug, planSlug)
  if (comp) {
    const prepComp = prepagas.find((p) => p.slug === comp.prepagaSlug)
    const plan1Comp = prepComp?.planes.find((pl) => pl.slug === comp.plan1Slug)
    const plan2Comp = prepComp?.planes.find((pl) => pl.slug === comp.plan2Slug)
    if (!prepComp || !plan1Comp || !plan2Comp) notFound()
    return <ComparativaPlanesPage comp={comp} prep={prepComp} plan1={plan1Comp} plan2={plan2Comp} />
  }
  const auto = comparativaAuto(slug, planSlug)
  if (auto) return <ComparativaPlanesPage comp={auto.comp} prep={auto.prep} plan1={auto.plan1} plan2={auto.plan2} filas={auto.filas} />
  const prep = prepagas.find((p) => p.slug === slug)
  const plan = prep?.planes.find((pl) => pl.slug === planSlug)
  if (!prep || !plan) notFound()

  const orejitas = orejitasPlan(prep, plan)
  const { provincia } = await searchParams
  const cartillaPlanLink = linkCartillaPlan(prep.slug, plan.slug)
  // Si se llega desde una página de zona (ej. "Sancor Salud en Córdoba") ya
  // sabemos la provincia: la barra "Cotizá" la pasa al comparador.
  const provDelLink = provincia ? getProvinciaSEO(provincia) : undefined

  // Plan de la cartilla oficial que corresponde a este plan (ej. SMG20 → "SMG20", S1 → "SMG02")
  const cartillaDef = CARTILLAS[prep.slug]
  const planCartilla = cartillaDef?.planes.find((x) => x.comparadorSlug === plan.slug || x.otrosComparadorSlugs?.includes(plan.slug))

  const isPartner = PARTNERS_OFICIALES_SLUGS.includes(slug)
  // Sanatorios del plan en CABA, armados en el servidor (28-sep-2026): Google
  // ve la cartilla del plan ("smg20 cartilla", "qué cubre el smg20")
  const renombre = sanatorios.map((x) => ({ nombre: x.nombre, aliases: x.aliases }))
  const zonaCaba = cartillaDef?.zonas.find((z) => z.slug === 'caba')
  const resumenCaba = planCartilla && zonaCaba
    ? resumirZonaPlan(zonaCaba, zonaCaba.slug, zonaCaba.nombre, planCartilla.id, clavesRenombre(renombre))
    : undefined

  const planesOrdenados = [...prep.planes].sort((a, b) => a.precio - b.precio)
  const planIdx = planesOrdenados.findIndex(p => p.slug === planSlug)
  const planInferior = planIdx > 0 ? planesOrdenados[planIdx - 1] : null
  const planSuperior = planIdx < planesOrdenados.length - 1 ? planesOrdenados[planIdx + 1] : null
  const otrosPlanes = ordenarPorCartilla(slug, planesOrdenados).filter(pl => pl.slug !== planSlug)
  const planMenosCopagoSlug = getPlanMenosCopago(slug, planSlug, prep.planes)
  const planMenosCopago = planMenosCopagoSlug ? prep.planes.find((p) => p.slug === planMenosCopagoSlug) : undefined

  const perfilDelPlan = getPerfilDelPlan(plan)
  const seo = contenidoPlan(prep, plan)
  // Una sola pregunta de precio (25-sep-2026): si hay cuadro oficial por edad,
  // la de "precio a los 30 años" sobra.
  const faqs = [...(seo?.faqs ?? []), ...buildPlanFAQs(plan, prep).filter((f) => !(seo?.escala && f.q.startsWith('¿Cuánto cuesta el')))]
  // "¿Qué incluye la cartilla de [prepaga] [plan]?" (29-sep-2026): es la
  // pregunta que Google muestra en "la gente también pregunta" para este tipo
  // de búsqueda — solo se agrega cuando hay cartilla oficial real para
  // apuntar (cartillaPlanLink), la sección ya está más abajo en la página.
  if (cartillaPlanLink) {
    faqs.push({
      q: `¿Qué incluye la cartilla de ${prep.nombre} ${plan.nombre}?`,
      a: `Más abajo en esta página tenés la cartilla oficial de ${cartillaPlanLink.label === plan.nombre ? 'este plan' : `la cartilla ${cartillaPlanLink.label}`}: los sanatorios para internación y guardias por zona (CABA, GBA e interior), con dirección y teléfono de cada centro, según datos oficiales.`,
    })
  }
  const comparativaPlan = getComparativaParaPlan(slug, planSlug)
  const otroPlanComparativa = comparativaPlan
    ? prep.planes.find((p) => p.slug === (comparativaPlan.plan1Slug === planSlug ? comparativaPlan.plan2Slug : comparativaPlan.plan1Slug))
    : undefined


  const jsonLd = [
    {
      '@context': 'https://schema.org',
      // Service, no Product: ver nota en app/prepagas/[slug]/page.tsx —
      // evita que Search Console lo valide como Merchant Listing (pide
      // imagen de producto, devolución, envío, que no aplican a un plan de salud).
      '@type': 'Service',
      name: `${prep.nombre} ${plan.nombre}`,
      description: plan.descripcion,
      url: `${SITE_URL}/prepagas/${slug}/${planSlug}`,
      provider: { '@type': 'Organization', name: prep.nombre },
      offers: {
        '@type': 'Offer',
        price: plan.precio,
        priceCurrency: 'ARS',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/prepagas/${slug}/${planSlug}`,
        priceValidUntil: PRECIO_VALIDO_HASTA,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Prepagas', item: `${SITE_URL}/prepagas` },
        { '@type': 'ListItem', position: 3, name: prep.nombre, item: `${SITE_URL}/prepagas/${slug}` },
        { '@type': 'ListItem', position: 4, name: plan.nombre },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {orejitas.derecha && <OrejitaPlan {...orejitas.derecha} />}
      {orejitas.izquierda && <OrejitaPlan {...orejitas.izquierda} />}
      <BarraCotizar
        titulo={`${prep.nombre} ${codigoPlan(plan)}`}
        origen={`plan:${slug}/${planSlug}`}
        href={`/comparador?${new URLSearchParams({
          prepaga: slug,
          plan: planSlug,
          desde: 'barra',
          ...(provDelLink ? { zona: provDelLink.zonaKey, provincia: provDelLink.nombre } : {}),
        })}`}
      />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-[#E8002D] transition-colors">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <Link href="/prepagas" className="hover:text-[#E8002D] transition-colors">Prepagas</Link>
            <span className="text-gray-300">›</span>
            <Link href={`/prepagas/${slug}`} className="hover:text-[#E8002D] transition-colors">{prep.nombre}</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">{plan.nombre}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-10">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-start gap-4 mb-6">
            <PrepagaLogo
              slug={prep.slug}
              nombre={prep.nombre}
              colorPrimario={prep.colorPrimario}
              size="md"
              className="shadow-sm mt-1"
            />
            <div>
              <Link href={`/prepagas/${slug}`} className="text-sm text-gray-500 hover:text-[#E8002D] transition-colors font-medium">
                Planes de {prep.nombre}
              </Link>
              {/* H1 con marca + plan: "osde 210" se busca más que "planes osde" (Trends, 23-sep-2026) */}
              <h1 className="text-3xl font-bold text-gray-900 mt-0.5">{prep.nombre} {plan.nombre}</h1>
              {plan.destacado && (
                <span className="inline-block mt-2 bg-[#E8002D] text-white text-xs font-black px-3 py-1 rounded-full">
                  MÁS ELEGIDO
                </span>
              )}
            </div>
          </div>

          {/* CTA — sin precio: se cotiza por edad en el comparador o se pide directo */}
          <div className="bg-white rounded-2xl border-2 border-[#E8002D] p-6 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-gray-900">{prep.nombre} {plan.nombre}</div>
              <div className="text-xs text-gray-500 mt-0.5">Cotizando online: <strong className="text-[#E8002D]">15% OFF</strong> sobre el precio de lista (25% si sos monotributista)</div>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <ContratarPlanButton
                    prepagaNombre={prep.nombre}
                    planNombre={plan.nombre}
                    fuente="ficha-plan"
                    titulo={`Cotizá y contratá el ${prep.nombre} ${plan.nombre.replace(/^Plan\s+/, '')}`}
                  />
                  {/* Comparar este plan con otro (Darío, 28-sep-2026) */}
                  <Link
                    href={`/comparar?plan=${prep.slug}/${plan.slug}#planes`}
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold rounded-xl text-sm w-full sm:w-auto transition-colors"
                  >
                    Comparar este plan con otro
                  </Link>

            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${
              plan.copago ? 'bg-gray-50 text-gray-600 border-gray-200' : 'bg-green-50 text-green-700 border-green-200'
            }`}>
              {plan.copago ? '— Con copago en consultas' : '✓ Sin copago en consultas'}
            </span>
            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${
              plan.redAbierta ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'
            }`}>
              {plan.redAbierta ? '✓ Red abierta' : '— Red cerrada'}
            </span>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-5">{plan.descripcion}</p>

          {/* Datos clave — lo primero que alguien busca al comparar un plan */}
          <div className="grid grid-cols-3 gap-3">
            {/* Antes: el precio de lista (se repetía con el cuadro por edad de más
                abajo). Ahora el incentivo para cotizar (Darío, 25-sep-2026). */}
            <Link href="/comparador" className="bg-red-50 rounded-xl border border-red-100 p-3 text-center hover:border-[#E8002D] transition-colors">
              <div className="text-[10px] font-bold text-[#E8002D] uppercase tracking-wide mb-1">Online</div>
              <div className="text-lg font-black text-[#E8002D]">15% OFF</div>
              <div className="text-[10px] text-gray-500">25% monotributo</div>
            </Link>
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-3 text-center">
              {/* Antes "Calidad cartilla x/5": era un puntaje propio sin fuente
                  (23-sep-2026). Ahora, datos del plan. */}
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Copago</div>
              <div className="text-lg font-black text-gray-900">{plan.copago ? 'Con copago' : 'Sin copago'}</div>
              <div className="text-[10px] text-gray-400">Red {plan.redAbierta ? 'abierta' : 'cerrada'}</div>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-3 text-center">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Satisfacción</div>
              <div className="text-lg font-black text-gray-900">{prep.satisfaccion}%</div>
              <Link href={`/prepagas/${prep.slug}#opiniones`} className="text-[10px] text-gray-400 hover:text-[#E8002D]">Ver opiniones →</Link>
            </div>
          </div>
          <Link href="/calculadora" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-[#E8002D] font-medium mt-2 transition-colors">
            ¿Cuánto te sale a tu edad? Calculalo acá →
          </Link>
        </div>
      </section>

      {/* Para quién es este plan */}
      <section className="py-10 bg-white">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-1">¿Para quién es el {plan.nombre}?</h2>
          <p className="text-sm text-gray-500 mb-5">Los perfiles que más sacan partido a este plan.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {perfilDelPlan.map((p, i) => (
              <div key={i} className="flex gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-6 h-6 rounded-full bg-[#E8002D] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-white">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-0.5">{p.titulo}</div>
                  <div className="text-xs text-gray-500 leading-relaxed">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coberturas */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
            <h2 className="text-xl font-bold text-gray-900">¿Qué incluye el {plan.nombre}?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {plan.cobertura.map((c) => (
              <div key={c} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500 flex-shrink-0">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Precio por edad (cuadro tarifario SSSalud) y cobertura punto por punto (fichas oficiales) */}
      {seo && (seo.escala || seo.coberturas.length > 0) && (
        <section className="py-10 bg-white border-t border-gray-100">
          <div className="container max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            {seo.escala && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Precio del {seo.nombreLargo} por edad</h2>
                <p className="text-xs text-gray-500 mb-3">
                  Lista oficial de {PRECIO_ACTUALIZADO} declarada ante la Superintendencia de Servicios de Salud: {seo.region}, contratación directa, IVA incluido, por persona. Cotizando online tenés 15% OFF sobre estos valores.
                </p>
                {/* Plegado (25-sep-2026): el precio estaba demasiado a la vista y
                    repetido. Queda una sola vez, a un toque. */}
                <details className="group rounded-xl border border-gray-200">
                  <summary className="flex items-center justify-between px-4 py-3 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden text-sm font-semibold text-gray-800">
                    Ver precio de lista por edad
                    <svg className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </summary>
                <table className="w-full text-sm border-t border-gray-100">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                    <tr><th className="text-left px-4 py-2">Edad</th><th className="text-right px-4 py-2">Precio mensual</th></tr>
                  </thead>
                  <tbody>
                    {seo.escala.rangos.map((x) => (
                      <tr key={x.desde} className="border-t border-gray-100">
                        <td className="px-4 py-2 text-gray-700">{x.hasta >= 99 ? `${x.desde} años o más` : `${x.desde} a ${x.hasta} años`}</td>
                        <td className="px-4 py-2 text-right font-semibold text-gray-900 tabular-nums">{formatPrecio(x.precio)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </details>
                {seo.regiones.length > 0 && (
                  <details className="group mt-3 rounded-xl border border-gray-200">
                    <summary className="flex items-center justify-between px-4 py-3 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden text-sm font-semibold text-gray-800">
                      Ver precio por zona (a los 30 años)
                      <svg className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </summary>
                    <table className="w-full text-sm border-t border-gray-100">
                      <caption className="sr-only">Precio de lista del {seo.nombreLargo} a los 30 años según la zona</caption>
                      <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr><th className="text-left px-4 py-2">Zona</th><th className="text-right px-4 py-2">Precio mensual</th></tr>
                      </thead>
                      <tbody>
                        {seo.regiones.map((r) => (
                          <tr key={r.region} className="border-t border-gray-100">
                            <td className="px-4 py-2 text-gray-700">{r.zonas.join(', ')}</td>
                            <td className="px-4 py-2 text-right font-semibold text-gray-900 tabular-nums">{formatPrecio(r.precio)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </details>
                )}
                <p className="text-xs text-gray-400 mt-2">El precio final depende de tu zona, tu grupo familiar y las promociones vigentes: te lo cotizamos sin cargo.</p>
              </div>
            )}
            {seo.coberturas.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Qué cubre el {seo.nombreLargo}, punto por punto</h2>
                <p className="text-xs text-gray-500 mb-4">Según las fichas oficiales de {prep.nombre}.</p>
                <ul className="divide-y divide-gray-100 border border-gray-100 rounded-xl">
                  {seo.coberturas.map((c) => (
                    <li key={c.tema} className="flex items-start justify-between gap-3 px-4 py-2.5 text-sm">
                      <Link href={`/coberturas/${c.tema}/${prep.slug}`} className="text-gray-700 hover:text-[#E8002D] hover:underline">{c.nombre}</Link>
                      <span className={`text-right ${c.fila.sinDato ? 'text-gray-400' : c.fila.incluido ? 'text-emerald-700 font-semibold' : 'text-gray-500'}`}>
                        {c.fila.sinDato ? 'Sin dato en la ficha' : c.fila.incluido ? `✓ ${c.fila.detalle ?? 'Incluido'}` : `✕ ${c.fila.detalle ?? 'No incluido'}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Qué tenés con este plan en tu zona (cartilla oficial por zona, Darío 23-sep-2026) */}
      {planCartilla && cartillaDef && (
        <section className="py-8 bg-white">
          <div className="container max-w-5xl mx-auto">
            <CartillaPlanTuZona
              prepagaSlug={prep.slug}
              prepagaNombre={prep.nombre}
              planNombre={plan.nombre}
              planCartillaId={planCartilla.id}
              labelGuardia={cartillaDef.labelGuardia}
              renombre={renombre}
              inicial={resumenCaba}
            />
          </div>
        </section>
      )}

      {/* Diferencias con el escalón vecino, con datos oficiales (28-sep-2026: se busca "smg20 vs smg30") */}
      {seo?.diferencias && (
        <section className="py-10 bg-gray-50 border-t border-gray-100">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Diferencias entre el {seo.codigo} y el {codigoPlan(seo.diferencias.otro)}</h2>
            <p className="text-xs text-gray-500 mb-4">
              {seo.diferencias.esSuperior ? 'El plan siguiente' : 'El plan anterior'} de {prep.nombre}: qué cambia en cobertura{seo.diferencias.conFichas ? `, según las fichas oficiales de ${prep.nombre}` : ''}. Los precios por edad están más arriba.
              {(() => {
                const par = paresComparativaAuto().find((c) => c.prep.slug === prep.slug && [c.plan1.slug, c.plan2.slug].includes(plan.slug) && [c.plan1.slug, c.plan2.slug].includes(seo.diferencias!.otro.slug))
                return par ? (
                  <>
                    {' '}
                    <Link href={`/prepagas/${prep.slug}/${par.slug}`} className="font-semibold text-[#E8002D] hover:underline">
                      Ver la comparación completa →
                    </Link>
                  </>
                ) : null
              })()}
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="text-left px-4 py-2 font-semibold"><span className="sr-only">Dato</span></th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-900">{seo.codigo}</th>
                    <th className="text-left px-4 py-2 font-semibold">
                      <Link href={`/prepagas/${slug}/${seo.diferencias.otro.slug}`} className="hover:text-[#E8002D] hover:underline">{codigoPlan(seo.diferencias.otro)}</Link>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Sin filas de precio (Darío, 4-oct-2026): los precios ya están más arriba */}
                  {seo.diferencias.filas.filter((f) => !f.edad).map((f) => (
                    <tr key={f.label} className="border-t border-gray-100 align-top">
                      <th scope="row" className="text-left px-4 py-2 font-medium text-gray-600">{f.label}</th>
                      <td className="px-4 py-2 text-gray-900">{f.a}</td>
                      <td className="px-4 py-2 text-gray-700">{f.b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Comparativa directa contra otro plan puntual (ej. Flux vs 210) */}
      {comparativaPlan && otroPlanComparativa && (
        <section className="py-8 bg-white border-t border-gray-100">
          <div className="container max-w-4xl mx-auto">
            <Link
              href={`/prepagas/${slug}/${comparativaPlan.slug}`}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 border-2 border-gray-200 hover:border-[#E8002D] rounded-2xl p-5 transition-all"
            >
              <div>
                <div className="text-xs font-bold text-gray-400 mb-1">¿{plan.nombre} o {otroPlanComparativa.nombre}?</div>
                <div className="text-sm text-gray-700">
                  Comparamos los dos punto por punto: precio, copago y cobertura.
                </div>
              </div>
              <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 bg-white group-hover:bg-[#E8002D] border-2 border-gray-200 group-hover:border-[#E8002D] text-gray-700 group-hover:text-white font-bold rounded-xl text-sm transition-colors whitespace-nowrap">
                Ver comparativa →
              </span>
            </Link>
          </div>
        </section>
      )}

      {/* Sugerencia: mismo grupo de cartilla, sin copago */}
      {planMenosCopago && (
        <section className="py-8 bg-gray-50 border-t border-gray-100">
          <div className="container max-w-4xl mx-auto">
            <Link
              href={`/prepagas/${slug}/${planMenosCopago.slug}`}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border-2 border-[#E8002D] rounded-2xl p-5 hover:shadow-sm transition-all"
            >
              <div>
                <div className="text-xs font-bold text-[#E8002D] mb-1">¿Buscás menos copago?</div>
                <div className="text-sm text-gray-700">
                  El <span className="font-semibold text-gray-900">{planMenosCopago.nombre}</span> tiene la misma cartilla que el {plan.nombre}, sin copago.
                </div>
              </div>
              <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#E8002D] group-hover:bg-[#B8001F] text-white font-bold rounded-xl text-sm transition-colors whitespace-nowrap">
                Ver {planMenosCopago.nombre} →
              </span>
            </Link>
          </div>
        </section>
      )}

      {/* Comparar con planes adyacentes */}
      {(planInferior || planSuperior) && (
        <section className="py-10 bg-white border-t border-gray-100">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Comparar con otros planes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {planInferior && (
                <Link
                  href={`/prepagas/${slug}/${planInferior.slug}`}
                  className="group flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Plan anterior</div>
                    <div className="font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors text-sm">{planInferior.nombre}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {planInferior.copago ? 'Con copago' : 'Sin copago'} · Red {planInferior.redAbierta ? 'abierta' : 'cerrada'}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 pl-3">
                    <NivelPrecioBadge nivel={nivelPrecio(planInferior.precio)} />
                  </div>
                </Link>
              )}
              {planSuperior && (
                <Link
                  href={`/prepagas/${slug}/${planSuperior.slug}`}
                  className="group flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100 hover:border-red-200 hover:shadow-sm transition-all"
                >
                  <div>
                    <div className="text-xs text-[#E8002D] mb-1 font-medium">Plan superior</div>
                    <div className="font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors text-sm">{planSuperior.nombre}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {planSuperior.copago ? 'Con copago' : 'Sin copago'} · Red {planSuperior.redAbierta ? 'abierta' : 'cerrada'}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 pl-3">
                    <NivelPrecioBadge nivel={nivelPrecio(planSuperior.precio)} />
                  </div>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Otros planes */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Otros planes de {prep.nombre}</h2>
          <div className="space-y-2">
            {otrosPlanes.map((pl) => {
              const grupoCartilla = getGrupoCartilla(slug, pl.slug)
              return (
              <Link
                key={pl.slug}
                href={`/prepagas/${slug}/${pl.slug}`}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all group"
              >
                <div>
                  <div className="font-semibold text-gray-900 group-hover:text-[#E8002D] transition-colors text-sm flex items-center gap-2 flex-wrap">
                    {pl.nombre}
                    {pl.destacado && (
                      <span className="text-[10px] bg-[#E8002D] text-white px-2 py-0.5 rounded-full font-bold">MÁS ELEGIDO</span>
                    )}
                    {grupoCartilla && (
                      <span className="text-[10px] bg-red-50 text-[#E8002D] px-2 py-0.5 rounded-full font-bold">{grupoCartilla.nombre}</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {pl.copago ? 'Con copago' : 'Sin copago'} · Red {pl.redAbierta ? 'abierta' : 'cerrada'}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 flex items-center gap-3">
                  <div>
                    <NivelPrecioBadge nivel={nivelPrecio(pl.precio)} />
                  </div>
                  <span className="text-xs text-gray-400">→</span>
                </div>
              </Link>
            )})}
          </div>
          <div className="mt-4">
            <Link href={`/prepagas/${slug}`} className="text-sm text-[#E8002D] font-semibold hover:underline">
              ← Todos los planes de {prep.nombre} y sus diferencias
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Preguntas frecuentes sobre el {plan.nombre}</h2>
          <div className="space-y-2">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-sm text-gray-900 select-none list-none">
                  <h3 className="font-semibold text-sm text-gray-900 m-0">{q}</h3>
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-12 bg-[#E8002D] text-white">
        <div className="container max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">¿Querés cotizar el {plan.nombre}?</h2>
          <p className="text-white text-sm mb-6">
            El precio real depende de tu edad y zona. Cotizá online con 15% OFF (25% si sos monotributista) y recibí asesoramiento sin cargo.
          </p>
          <div className="flex flex-col items-center gap-3">
              <ContratarPlanButton
                prepagaNombre={prep.nombre}
                planNombre={plan.nombre}
                fuente="ficha-plan-final"
                titulo={`Cotizá y contratá el ${prep.nombre} ${plan.nombre.replace(/^Plan\s+/, '')}`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E8002D] font-bold rounded-2xl hover:bg-red-50 transition-all shadow-lg text-sm"
              />
              <Link href={`/comparar?plan=${prep.slug}/${plan.slug}#planes`} className="text-sm text-red-100 hover:text-white font-semibold underline underline-offset-2">
                O compará el {plan.nombre} con otro plan
              </Link>
            </div>
        </div>
      </section>
    </>
  )
}
