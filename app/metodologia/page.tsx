import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_NAME, SITE_URL, CONTENT_UPDATE, PARTNERS_OFICIALES_TEXTO } from '@/lib/utils'
import { ldJson } from '@/lib/jsonld'

export const metadata: Metadata = {
  title: 'Metodología — Cómo elaboramos nuestros rankings',
  description: `Cómo armamos nuestros rankings de prepagas en Argentina: de dónde salen los precios, qué miramos para recomendar y cómo trabajamos con las prepagas.`,
  alternates: { canonical: `${SITE_URL}/metodologia` },
}

// GEO (17-sep-2026): ver mismo criterio en app/coberturas/page.tsx.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: `Metodología de ${SITE_NAME}`,
  description: 'Cómo armamos nuestros rankings de prepagas: de dónde salen los precios, qué miramos para recomendar y cómo trabajamos con las prepagas.',
  url: `${SITE_URL}/metodologia`,
  author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  dateModified: CONTENT_UPDATE,
  inLanguage: 'es-AR',
}

// Auditoría 18-oct-2026: antes decía "5 factores con pesos" (35% satisfacción,
// 25% precio-calidad…) que no se usaban en ningún lado. Ahora dice cómo se
// arma de verdad cada ranking.
const factores = [
  { nombre: 'Experiencia de atención', descripcion: 'El orden de "Nuestro ranking" es la recomendación de nuestros asesores, por cómo responde cada prepaga en el día a día: autorizaciones, reintegros, trámites y atención. Es una opinión y la presentamos como tal.' },
  { nombre: 'Cartilla en tu zona', descripcion: 'En los rankings por provincia miramos la cartilla local: sanatorios, centros propios y prestadores que cada prepaga informa en su cartilla oficial para esa provincia.' },
  { nombre: 'Precio', descripcion: 'El ranking por precio no tiene opinión: sale del cuadro tarifario oficial que cada prepaga declara ante la Superintendencia de Servicios de Salud.' },
]

const fuentes = [
  { nombre: 'Superintendencia de Servicios de Salud (SSSalud)', descripcion: 'Fuente oficial de los cuadros tarifarios. Los controlamos de forma automática los días 1 y 15 de cada mes.' },
  { nombre: 'Fichas y webs oficiales de cada prepaga', descripcion: 'Lo que cubre cada plan (copagos, ortodoncia, reintegros, exterior) sale de las fichas oficiales de la prepaga. En las páginas de coberturas indicamos la fuente de cada dato.' },
  { nombre: 'Cartillas médicas oficiales', descripcion: 'Accedemos a las cartillas de prestadores de cada prepaga para verificar la amplitud real de la red.' },
  { nombre: 'Experiencia de nuestros asesores', descripcion: 'Más de 10 años cotizando y acompañando altas: de ahí sale la recomendación de "Nuestro ranking", que siempre aclaramos que es una opinión.' },
]

export default function MetodologiaPage() {
  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(jsonLd) }} />

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Metodología de {SITE_NAME}
      </h1>
      <p className="text-lg text-gray-600 mb-10 max-w-2xl">
        Cómo elaboramos nuestros rankings, cómo verificamos los precios y qué factores consideramos para recomendar una prepaga. La transparencia es el pilar de nuestra credibilidad.
      </p>

      {/* Precios */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Cómo verificamos los precios</h2>
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 mb-4">
          <p className="text-gray-800 leading-relaxed">
            Todos los precios publicados en {SITE_NAME} son extraídos directamente de los <strong>cuadros tarifarios oficiales de la Superintendencia de Servicios de Salud (SSSalud)</strong>, el organismo gubernamental que regula las prepagas en Argentina. Los actualizamos al inicio de cada mes.
          </p>
        </div>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 bg-[#E8002D] rounded-full text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</div>
            <p className="text-gray-600 text-sm">Los precios son de referencia para una persona de 30 años contratando de forma individual. Los precios reales varían según edad, zona geográfica y modalidad de contratación (individual, familiar, derivación de obra social).</p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 bg-[#E8002D] rounded-full text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</div>
            <p className="text-gray-600 text-sm">Publicamos siempre el mes y año de los precios para que el usuario sepa cuándo fue la última actualización.</p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 bg-[#E8002D] rounded-full text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</div>
            <p className="text-gray-600 text-sm">Si detectás una diferencia entre lo que publicamos y el precio real que te ofreció la prepaga, por favor reportalo a hola@prepagaya.com.ar — lo verificamos y corregimos dentro de las 48 horas.</p>
          </li>
        </ul>
      </section>

      {/* Factores de ranking */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Cómo calculamos los rankings</h2>
        <p className="text-gray-600 mb-6">
          No existe una única "mejor prepaga" para todos: la mejor depende de tu perfil, tu zona y lo que más vas a usar. Por eso separamos lo que es opinión de lo que sale de datos.
        </p>
        <div className="space-y-4">
          {factores.map((f) => (
            <div key={f.nombre} className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2">{f.nombre}</h3>
              <p className="text-sm text-gray-600">{f.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fuentes */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Fuentes de información</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fuentes.map((f) => (
            <div key={f.nombre} className="bg-gray-50 rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">{f.nombre}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{f.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo ganamos dinero / partners */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cómo ganamos dinero y cómo elegimos nuestros partners</h2>
        <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
          <p className="text-gray-800 leading-relaxed mb-3">
            {SITE_NAME} <strong>no te cobra nada</strong> por usar el comparador ni por contratar a través nuestro: pagás exactamente lo mismo que yendo directo a la prepaga. Nuestro ingreso viene de las comisiones que nos paga la prepaga cuando una contratación se concreta.
          </p>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            Para poder ofrecerte un proceso de contratación rápido y acompañado, trabajamos activamente con un <strong>grupo curado de prepagas partner</strong> —somos partner oficial de {PARTNERS_OFICIALES_TEXTO}—, elegidas por calidad de cobertura, relación precio-cartilla y agilidad del proceso de alta. Son las que vas a ver con opción de cotización directa y mayor protagonismo en el comparador y el ranking.
          </p>
          <p className="text-gray-700 text-sm leading-relaxed">
            El resto de las prepagas del mercado también aparecen en el sitio con información de precios, cartillas y coberturas verificada de la misma forma — para que puedas comparar el panorama completo — aunque no gestionemos la contratación de esas de forma directa.
          </p>
        </div>
      </section>

      {/* Actualización */}
      <section className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Frecuencia de actualización</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#E8002D]">Mensual</div>
            <div className="text-sm text-gray-500">Actualización de precios</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#E8002D]">Días 1 y 15</div>
            <div className="text-sm text-gray-500">Control automático de cuadros oficiales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#E8002D]">Continua</div>
            <div className="text-sm text-gray-500">Cartillas y coberturas</div>
          </div>
        </div>
      </section>

      <p className="text-center text-sm text-gray-500 mt-8">
        ¿Querés saber quiénes estamos detrás de {SITE_NAME}? <Link href="/sobre-nosotros" className="text-[#E8002D] font-semibold hover:underline">Conocé al equipo →</Link>
      </p>
    </div>
  )
}
