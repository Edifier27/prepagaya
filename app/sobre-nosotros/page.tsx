import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_NAME, SITE_URL } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Sobre Nosotros',
  description: `Conocé quiénes somos en ${SITE_NAME}, cómo trabajamos y por qué somos el comparador de prepagas más confiable de Argentina.`,
  alternates: { canonical: `${SITE_URL}/sobre-nosotros` },
}

const valores = [
  {
    titulo: 'Independencia total',
    descripcion: 'No recibimos dinero de las prepagas para mejorar su posición en nuestros rankings. Nuestros ingresos provienen de publicidad y comisiones transparentes cuando una persona contrata a través nuestro, sin afectar el orden de nuestras comparativas.',
    letters: 'IN', bg: 'bg-blue-100', text: 'text-blue-800',
  },
  {
    titulo: 'Datos verificados',
    descripcion: 'Todos los precios que publicamos son verificados mensualmente contra los cuadros tarifarios oficiales de la Superintendencia de Servicios de Salud (SSSalud). Nunca publicamos precios desactualizados.',
    letters: 'VR', bg: 'bg-green-100', text: 'text-green-800',
  },
  {
    titulo: 'Opiniones reales',
    descripcion: 'Las reseñas en nuestro sitio son de afiliados verificados. Verificamos que quien opina sea o haya sido afiliado de la prepaga que evalúa, evitando opiniones falsas de cualquier parte.',
    letters: 'OP', bg: 'bg-purple-100', text: 'text-purple-800',
  },
  {
    titulo: 'Actualización constante',
    descripcion: 'El mercado de prepagas en Argentina cambia cada mes. Nuestro equipo actualiza precios, coberturas y cartillas médicas de forma continua para que siempre tengas información vigente.',
    letters: 'AC', bg: 'bg-orange-100', text: 'text-orange-800',
  },
]

const equipo = [
  {
    nombre: 'Equipo Editorial',
    rol: 'Contenidos y Análisis',
    descripcion: 'Profesionales de la salud y periodismo especializados en el sistema de salud argentino, con más de 10 años de experiencia analizando el mercado de prepagas.',
  },
  {
    nombre: 'Equipo de Datos',
    rol: 'Precios y Coberturas',
    descripcion: 'Analistas que rastrean y verifican mensualmente los cuadros tarifarios de la Superintendencia de Servicios de Salud y los planes de cada prepaga.',
  },
  {
    nombre: 'Equipo de Tecnología',
    rol: 'Plataforma y UX',
    descripcion: 'Desarrolladores enfocados en que la experiencia de comparar prepagas sea lo más simple e intuitiva posible para cualquier usuario.',
  },
]

export default function SobreNosotrosPage() {
  return (
    <div className="container py-12 max-w-4xl mx-auto">

      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-10 h-10 bg-[#E8002D] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="font-bold text-2xl text-gray-900">
            Prepaga<span className="text-[#E8002D]">Ya</span>
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          El comparador de prepagas más transparente de Argentina
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Somos un equipo de profesionales comprometidos con ayudar a los argentinos a tomar la mejor decisión sobre su cobertura médica, con información objetiva, actualizada y sin intereses ocultos.
        </p>
      </div>

      {/* Misión */}
      <section className="mb-12 bg-blue-50 rounded-2xl p-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Nuestra misión</h2>
        <p className="text-gray-700 leading-relaxed text-lg">
          En Argentina, elegir una prepaga puede ser una decisión confusa y costosa. Con precios que cambian mensualmente, decenas de planes y coberturas difíciles de comparar, muchas personas terminan eligiendo mal o pagando de más.
        </p>
        <p className="text-gray-700 leading-relaxed mt-3">
          Nuestra misión es simple: <strong>hacer que comparar prepagas sea tan fácil como comparar vuelos</strong>. Toda la información relevante en un solo lugar, actualizada, verificada y sin letra chica.
        </p>
      </section>

      {/* Cómo trabajamos / valores */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Cómo trabajamos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {valores.map((v) => (
            <div key={v.titulo} className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 text-sm font-black tracking-tight ${v.bg} ${v.text}`}>{v.letters}</div>
              <h3 className="font-bold text-gray-900 mb-2">{v.titulo}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{v.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Equipo */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Nuestro equipo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {equipo.map((m) => (
            <div key={m.nombre} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-center">
              <div className="w-14 h-14 bg-[#E8002D] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                {m.nombre[0]}
              </div>
              <h3 className="font-bold text-gray-900">{m.nombre}</h3>
              <div className="text-sm text-[#E8002D] font-medium mb-2">{m.rol}</div>
              <p className="text-xs text-gray-500 leading-relaxed">{m.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Metodología link */}
      <section className="mb-12 bg-gray-50 rounded-2xl p-6 border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-900 mb-1">¿Cómo elaboramos nuestros rankings?</h3>
          <p className="text-sm text-gray-600">
            Leé nuestra metodología detallada: cómo calculamos los rankings, qué factores consideramos y cómo verificamos los precios.
          </p>
        </div>
        <Link
          href="/metodologia"
          className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-[#E8002D] text-white rounded-xl text-sm font-medium hover:bg-[#B8001F] transition-colors"
        >
          Ver metodología →
        </Link>
      </section>

      {/* Contacto */}
      <section className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">¿Tenés alguna pregunta o sugerencia?</h2>
        <p className="text-gray-600 text-sm mb-4">
          Estamos siempre abiertos a feedback. Si encontrás información desactualizada o querés reportar algo, escribinos.
        </p>
        <a
          href="mailto:hola@prepagaya.com.ar"
          className="inline-flex items-center gap-2 text-[#E8002D] font-medium hover:underline"
        >
          hola@prepagaya.com.ar
        </a>
      </section>
    </div>
  )
}
