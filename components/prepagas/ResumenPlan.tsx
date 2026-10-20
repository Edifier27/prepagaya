import Image from 'next/image'
import Link from 'next/link'
import { PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { formatPrecio } from '@/lib/utils'
import type { ResumenZonaPlan } from '@/lib/cartilla-plan-resumen'
import { OG_SIZE, rutaOgPlan, altOgPlan } from '@/lib/og/datos'
import type { Prepaga } from '@/types'

// "¿Qué es el [plan] de [prepaga]?" arriba de la página del plan (19-oct-2026).
// La respuesta de IA de Google para "swiss medical plan smg20" arma: una frase
// que define el plan con su precio (el nuestro, del cuadro SSSalud), una lista
// "Cobertura y beneficios" con renglones "Etiqueta: detalle" y los sanatorios
// de la cartilla — y cita casi todo a MiObraSocial. Teníamos los datos (fichas
// oficiales, cartilla oficial) pero en etiquetas sueltas o más abajo. Este
// bloque los pone con la forma que la IA puede citar. Nada sin fuente: precio
// del cuadro tarifario, coberturas de lib/data/coberturas-marca, sanatorios de
// la cartilla oficial de CABA.

type Plan = Prepaga['planes'][number]

export interface CoberturaPlan {
  tema: string
  nombre: string
  fila: { incluido: boolean; detalle?: string; sinDato?: boolean }
}

interface Props {
  prep: Prepaga
  plan: Plan
  /** Nombre de la cartilla oficial del plan ("Global"), si es distinto del plan */
  cartilla?: string
  coberturas: CoberturaPlan[]
  sanatoriosCaba?: ResumenZonaPlan
  cartillaHref?: string
}

const listaCon = (xs: string[], y = 'y') => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} ${y} ${xs[xs.length - 1]}` : xs[0] ?? '')
const mayuscula = (t: string) => t.replace(/^\S/, (c) => c.toUpperCase())
// "Hasta 15 años" → "hasta 15 años"; las siglas ("PMO") quedan igual
const minuscula = (t: string) => (/^\p{Lu}\p{Ll}/u.test(t) ? t.replace(/^\S/, (c) => c.toLowerCase()) : t)

export function resumenPlan({ prep, plan, cartilla, coberturas, sanatoriosCaba }: Props) {
  const definicion = [
    `El ${plan.nombre} de ${prep.nombre} es un plan ${plan.copago ? 'con copago' : 'sin copago'} en consultas y ${plan.redAbierta ? 'de red abierta' : 'de sistema cerrado'}${cartilla ? `, con la cartilla ${cartilla}` : ''}.`,
    Number.isFinite(plan.precio)
      ? `Cuesta ${formatPrecio(plan.precio)} por mes para una persona de 30 años según el cuadro tarifario que ${prep.nombre} declara ante la Superintendencia de Servicios de Salud (${PRECIO_ACTUALIZADO.toLowerCase()}, CABA/AMBA, contratación directa, IVA incluido).`
      : `${prep.nombre} no lo publica en su cuadro tarifario oficial: se cotiza según tu edad y tu zona.`,
  ].join(' ')

  const conDato = coberturas.filter((c) => !c.fila.sinDato)
  const beneficios: { etiqueta: string; detalle: string }[] = [
    { etiqueta: 'Consultas', detalle: plan.copago ? 'con copago: pagás un adicional por consulta y la cuota es menor.' : 'sin copago.' },
    ...conDato.filter((c) => c.fila.incluido).map((c) => ({ etiqueta: c.nombre, detalle: c.fila.detalle ? `${minuscula(c.fila.detalle).replace(/\.$/, '')}.` : 'incluido.' })),
  ]
  if (!conDato.some((c) => c.tema === 'internacion') && sanatoriosCaba?.totalInternacion) {
    beneficios.splice(1, 0, { etiqueta: 'Internación', detalle: `en ${sanatoriosCaba.totalInternacion} sanatorios y clínicas de la cartilla oficial en CABA.` })
  }
  // Sin fichas oficiales con detalle: las coberturas del plan, en una línea
  if (beneficios.length < 4 && plan.cobertura.length) {
    beneficios.push({ etiqueta: 'Incluye', detalle: `${listaCon(plan.cobertura.map((c, i) => (i === 0 ? c : c.replace(/^\S/, (x) => x.toLowerCase()))))}.` })
  }
  const noIncluye = conDato.filter((c) => !c.fila.incluido).map((c) => c.nombre.toLowerCase())
  const sanatorios = (sanatoriosCaba?.destacados ?? []).filter((s) => s.internacion).slice(0, 12)
  return { definicion, beneficios, noIncluye, sanatorios, conFicha: conDato.length > 0 }
}

/** Respuesta para las preguntas frecuentes de la página del plan */
export function faqResumenPlan(props: Props): { q: string; a: string } {
  const r = resumenPlan(props)
  const incluye = r.beneficios.filter((b) => b.etiqueta !== 'Consultas' && b.etiqueta !== 'Incluye').slice(0, 4)
  const general = r.beneficios.find((b) => b.etiqueta === 'Incluye')
  return {
    q: `¿Qué es el ${props.plan.nombre} de ${props.prep.nombre}?`,
    a: [
      r.definicion,
      incluye.length ? `Incluye ${listaCon(incluye.map((b) => `${b.etiqueta.toLowerCase()} (${b.detalle.replace(/\.$/, '')})`))}.` : '',
      general ? `Entre sus coberturas: ${minuscula(general.detalle)}` : '',
      r.noIncluye.length ? `No incluye ${listaCon(r.noIncluye, 'ni')}.` : '',
    ].filter(Boolean).join(' '),
  }
}

export function ResumenPlan(props: Props) {
  const { prep, plan, sanatoriosCaba, cartillaHref } = props
  const r = resumenPlan(props)
  return (
    <section className="py-8 bg-white border-b border-gray-100">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-2">¿Qué es el {plan.nombre} de {prep.nombre}?</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-5">{r.definicion}</p>
        {/* Imagen del plan con sus datos (lib/og/tarjeta.tsx): miniatura en
            Google y Google Imágenes ("plan smg20"). Ya viene en 1200x630. */}
        <Image
          src={rutaOgPlan(prep.slug, plan.slug)}
          alt={altOgPlan(prep, plan)}
          width={OG_SIZE.width}
          height={OG_SIZE.height}
          unoptimized
          className="w-full max-w-md h-auto rounded-xl border border-gray-200 mb-5"
        />

        <h3 className="text-base font-bold text-gray-900 mb-2">Cobertura y beneficios principales</h3>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-700 mb-2">
          {r.beneficios.map((b) => (
            <li key={b.etiqueta}><strong className="text-gray-900">{b.etiqueta}:</strong> {b.detalle}</li>
          ))}
          {r.noIncluye.length > 0 && (
            <li><strong className="text-gray-900">No incluye:</strong> {mayuscula(listaCon(r.noIncluye, 'ni'))}.</li>
          )}
        </ul>
        <p className="text-xs text-gray-400 mb-5">
          {r.conFicha ? `Coberturas según la ficha oficial de ${prep.nombre}. ` : ''}Precio: cuadro tarifario de la SSSalud ({PRECIO_ACTUALIZADO.toLowerCase()}).
        </p>

        {r.sanatorios.length > 0 && sanatoriosCaba && (
          <>
            <h3 className="text-base font-bold text-gray-900 mb-2">Principales sanatorios de la cartilla</h3>
            <p className="text-sm text-gray-700 mb-2">
              Con el {plan.nombre} te internás en {sanatoriosCaba.totalInternacion} sanatorios y clínicas de la cartilla oficial en CABA. Entre ellos:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              {r.sanatorios.map((s) => (
                <li key={s.nombre}>{s.nombre}{s.ubicacion ? ` (${s.ubicacion})` : ''}</li>
              ))}
            </ul>
            {cartillaHref && (
              <Link href={cartillaHref} className="inline-block mt-3 text-sm font-semibold text-[#E8002D] hover:underline">
                Cartilla completa del {plan.nombre} por zona →
              </Link>
            )}
          </>
        )}
      </div>
    </section>
  )
}
