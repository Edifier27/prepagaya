import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL } from '@/lib/utils'

export const metadata: Metadata = {
  title: `Metodología — Cómo elaboramos nuestros rankings | ${SITE_NAME}`,
  description: `Explicamos cómo calculamos nuestros rankings de prepagas en Argentina: fuentes de precios, factores de satisfacción, y criterios de evaluación. Transparencia total.`,
  alternates: { canonical: `${SITE_URL}/metodologia` },
}

const factores = [
  { nombre: 'Satisfacción de afiliados', peso: '35%', descripcion: 'Encuestas periódicas a afiliados activos verificados. Evaluamos atención, tiempos de respuesta, calidad de prestadores y facilidad de trámites.' },
  { nombre: 'Relación precio-calidad', peso: '25%', descripcion: 'Comparamos el precio de cada plan contra la cobertura real que ofrece, la red de prestadores y la experiencia de atención.' },
  { nombre: 'Amplitud de red', peso: '20%', descripcion: 'Cantidad de profesionales adheridos, cobertura geográfica, presencia de especialidades y disponibilidad de turnos en plazos razonables.' },
  { nombre: 'Experiencia digital', peso: '10%', descripcion: 'Calidad de la app móvil, portal web para gestión de turnos y trámites, facilidad de autorización de estudios y prácticas.' },
  { nombre: 'Transparencia', peso: '10%', descripcion: 'Claridad en la información de precios, facilidad para obtener la cartilla médica actualizada, y honestidad en los términos y condiciones.' },
]

const fuentes = [
  { nombre: 'Superintendencia de Servicios de Salud (SSSalud)', descripcion: 'Fuente oficial para cuadros tarifarios. Accedemos mensualmente a los valores actualizados de todos los planes.' },
  { nombre: 'Encuestas propias a afiliados', descripcion: 'Realizamos encuestas periódicas a afiliados verificados de cada prepaga. La verificación se hace mediante número de afiliado.' },
  { nombre: 'Cartillas médicas oficiales', descripcion: 'Accedemos a las cartillas de prestadores de cada prepaga para verificar la amplitud real de la red.' },
  { nombre: 'Reclamos ante SSSalud', descripcion: 'Monitoreamos el índice de reclamos ante el organismo regulador como indicador de calidad de servicio.' },
]

export default function MetodologiaPage() {
  return (
    <div className="container py-12 max-w-4xl mx-auto">

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
          Nuestros rankings combinan 5 factores con distintos pesos. No existe un único "mejor prepaga" para todos: la mejor depende de tu perfil, zona y necesidades.
        </p>
        <div className="space-y-4">
          {factores.map((f) => (
            <div key={f.nombre} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{f.nombre}</h3>
                <span className="text-sm font-bold text-[#E8002D] bg-blue-50 px-3 py-1 rounded-full">
                  Peso: {f.peso}
                </span>
              </div>
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

      {/* Independencia */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Nuestra independencia editorial</h2>
        <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
          <p className="text-gray-800 leading-relaxed mb-3">
            <strong>{SITE_NAME} es editorialmente independiente.</strong> Las prepagas no pueden pagar para mejorar su posición en nuestros rankings o comparativas. Nuestros análisis reflejan únicamente los datos objetivos y la experiencia de los afiliados.
          </p>
          <p className="text-gray-700 text-sm leading-relaxed">
            Nuestros ingresos provienen de publicidad contextual y de comisiones cuando un usuario contrata una prepaga a través de nuestro sitio. Estas comisiones <strong>no afectan el orden ni los contenidos</strong> de nuestros rankings y análisis. Cuando existe algún acuerdo comercial con una prepaga, lo indicamos explícitamente con una etiqueta "Patrocinado".
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
            <div className="text-2xl font-bold text-[#E8002D]">Trimestral</div>
            <div className="text-sm text-gray-500">Encuestas de satisfacción</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#E8002D]">Continua</div>
            <div className="text-sm text-gray-500">Cartillas y coberturas</div>
          </div>
        </div>
      </section>
    </div>
  )
}
