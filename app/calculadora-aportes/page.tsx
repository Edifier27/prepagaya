import type { Metadata } from 'next'
import Link from 'next/link'
import { CalculadoraAportes } from '@/components/herramientas/CalculadoraAportes'
import { InsertarWidget } from '@/components/prensa/InsertarWidget'
import { prepagasCotizables } from '@/lib/data/planes-cotizables'
import { obrasSociales } from '@/lib/data/obras-sociales'
import { FICHAS_REGISTRO } from '@/lib/data/fichas-registro'
import { PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL, OG_IMAGE, TIEMPO_RESPUESTA } from '@/lib/utils'

// "De tu obra social a una prepaga" (24-sep-2026). Es la oferta para todo el
// tráfico de obras sociales (docs/seo/universo-busquedas.md): busca "derivar
// aportes a prepaga", "cuánto pago de diferencia con aportes" y "cuánto se
// descuenta de obra social del sueldo". Las fichas de obra social linkean
// acá con ?os= para que la calculadora ya diga de dónde viene la persona.

const URL = `${SITE_URL}/calculadora-aportes`
// Alto fijo del iframe del widget si el sitio no deja correr el script que lo
// ajusta: entra el resultado en un celular (medido: 504 px a 320-360 px de ancho)
const ALTO_WIDGET = 510

export const metadata: Metadata = {
  title: 'Calculadora de aportes: cuánto pagás de diferencia si pasás tu obra social a una prepaga',
  description: 'Poné tu sueldo bruto y mirá cuánto de tus aportes llega a la prepaga y cuántos planes te quedan cubiertos sin pagar diferencia. Con los precios oficiales con aportes.',
  alternates: { canonical: URL },
  openGraph: {
    title: '¿Cuánto te cuesta pasar de tu obra social a una prepaga?',
    description: 'Calculá tu aporte y la diferencia que pagarías en cada plan.',
    url: URL,
    images: [OG_IMAGE],
  },
}

const faqs = [
  {
    q: '¿Cuánto se descuenta de obra social del sueldo?',
    a: 'El 3% del sueldo bruto lo aportás vos y el 6% lo pone tu empleador: en total, 9% va a tu obra social. De eso, entre el 10% y el 15% va al Fondo Solidario de Redistribución de la Superintendencia de Servicios de Salud. Por eso la calculadora usa 7,5% del bruto como lo que llega a la prepaga.',
  },
  {
    q: '¿Cómo paso mis aportes de la obra social a una prepaga?',
    a: 'Elegís una prepaga inscripta como agente del seguro y hacés la opción de cambio online, en la web de la Superintendencia, con tu clave fiscal (una vez cada 365 días; rige desde el primer día del mes siguiente). La prepaga te descuenta el aporte de la cuota y, además, el precio con aportes no lleva el IVA del 10,5% que paga quien contrata como particular.',
  },
  {
    q: '¿Puedo sumar los aportes de mi pareja?',
    a: 'Sí: si los dos trabajan, se pueden unificar los aportes en el mismo plan familiar con el trámite de unificación de aportes de la Superintendencia. Marcá la opción de la calculadora y poné los dos sueldos.',
  },
  {
    q: '¿Y si soy monotributista?',
    a: 'El monotributo tiene un componente fijo de obra social por categoría, no un porcentaje del sueldo. También podés pasarlo a una prepaga pagando la diferencia.',
  },
]

export default function CalculadoraAportesPage() {
  const prepagas = prepagasCotizables()
  const os = [
    ...obrasSociales.map((o) => ({ slug: o.slug, nombre: o.nombre })),
    ...FICHAS_REGISTRO.map((f) => ({ slug: f.slug, nombre: f.nombreCorto })),
  ].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Calculadora de aportes: de tu obra social a una prepaga',
      url: URL,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      inLanguage: 'es-AR',
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'ARS' },
      provider: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Calculadora de aportes' },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-gradient-to-b from-red-50/60 to-white border-b border-gray-100 pt-8 pb-12">
        <div className="container max-w-3xl! mx-auto">
          <nav className="text-sm text-gray-500 mb-5">
            <Link href="/" className="hover:text-[#E8002D]">{SITE_NAME}</Link>
            <span className="mx-2 text-gray-300">›</span>
            <span className="text-gray-700">Calculadora de aportes</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">¿Cuánto te cuesta pasar de tu obra social a una prepaga?</h1>
          <p className="text-gray-700 mt-3 mb-6 leading-relaxed">
            Si trabajás en relación de dependencia, tus aportes pueden ir a una prepaga y pagás solo la diferencia. Poné tu sueldo y te decimos cuánto aportás y cuántos planes te quedan cubiertos, con los precios oficiales de {PRECIO_ACTUALIZADO.toLowerCase()}.
          </p>
          <CalculadoraAportes prepagas={prepagas} obrasSociales={os} />
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container max-w-3xl! mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold text-gray-900">{f.q}</h3>
                <p className="text-sm text-gray-700 leading-relaxed mt-1">{f.a}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-6">¿Monotributista? Mirá <Link href="/para/monotributistas" className="text-[#E8002D] font-semibold hover:underline">prepagas para monotributistas</Link>. ¿Dudas con el trámite? Un asesor te ayuda en {TIEMPO_RESPUESTA}.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
            <Link href="/guias/derivar-obra-social-a-prepaga" className="text-sm font-semibold text-[#E8002D] hover:underline">Cómo derivar tus aportes →</Link>
            <Link href="/guias/opcion-de-cambio-obra-social" className="text-sm font-semibold text-[#E8002D] hover:underline">Cómo hacer la opción de cambio →</Link>
            <Link href="/guias/unificar-aportes-obra-social" className="text-sm font-semibold text-[#E8002D] hover:underline">Unificar aportes con tu pareja →</Link>
            <Link href="/prensa/sueldo-para-cubrir-la-prepaga" className="text-sm font-semibold text-[#E8002D] hover:underline">Cuánto hay que ganar para no pagar diferencia →</Link>
            <Link href="/obras-sociales/codigos" className="text-sm font-semibold text-[#E8002D] hover:underline">Códigos de obras sociales →</Link>
            <Link href="/obras-sociales" className="text-sm font-semibold text-[#E8002D] hover:underline">Obras sociales →</Link>
          </div>

          {/* Para estudios contables, blogs de RRHH y medios (25-sep-2026) */}
          <h2 className="text-xl font-bold text-gray-900 mt-10 mb-2">Insertá la calculadora en tu sitio</h2>
          <InsertarWidget
            alto={ALTO_WIDGET}
            widget="/widget/calculadora-aportes"
            pagina="/calculadora-aportes"
            titulo="Calculadora de aportes a prepaga (precios oficiales SSSalud)"
            autoAlto
            intro="¿Tenés un estudio contable, un blog de recursos humanos o una web para empleados? Sumá la calculadora: tus lectores ponen su sueldo y ven cuánto les cubren los aportes, con los precios oficiales de cada mes. Es gratis y se actualiza sola."
          />
        </div>
      </section>
    </>
  )
}
