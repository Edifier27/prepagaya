import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_NAME, SITE_URL } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: `Política de privacidad de ${SITE_NAME}. Cómo recopilamos, usamos y protegemos tu información personal.`,
  alternates: { canonical: `${SITE_URL}/privacidad` },
  robots: { index: true, follow: true },
}

const secciones = [
  {
    titulo: '1. Información que recopilamos',
    cuerpo: `Recopilamos la información que nos proporcionás voluntariamente al usar el comparador de prepagas: nombre, correo electrónico, edad y composición del grupo familiar. No solicitamos datos sensibles como número de DNI, datos de salud detallados ni información financiera directa. También recopilamos datos técnicos anónimos de navegación (páginas visitadas, tiempo en el sitio) a través de herramientas de analítica.`,
  },
  {
    titulo: '2. Cómo usamos tu información',
    cuerpo: `Usamos tu información para: enviarte las cotizaciones de prepagas solicitadas, conectarte con las empresas de prepaga que elegiste conocer, mejorar nuestro comparador y la experiencia de usuario, y enviarte comunicaciones sobre novedades del mercado de prepagas (solo si nos diste tu consentimiento). Nunca vendemos tu información a terceros.`,
  },
  {
    titulo: '3. Con quién compartimos tu información',
    cuerpo: `Compartimos tu información exclusivamente con las prepagas que vos elegís conocer en el proceso de cotización. Podemos compartir datos anónimos y agregados con anunciantes para medir el rendimiento de campañas. No compartimos datos personales identificables con otras empresas, salvo requerimiento judicial o legal.`,
  },
  {
    titulo: '4. Cookies y tecnologías de rastreo',
    cuerpo: `Utilizamos cookies propias para el funcionamiento del sitio (preferencias, sesión) y cookies de terceros para analítica (Google Analytics) y publicidad. Podés desactivar las cookies en la configuración de tu navegador, aunque esto puede afectar la funcionalidad del comparador. Al usar el sitio, aceptás el uso de cookies en los términos descritos.`,
  },
  {
    titulo: '5. Seguridad de los datos',
    cuerpo: `Implementamos medidas técnicas y organizativas para proteger tu información: conexión cifrada HTTPS, acceso restringido a datos personales solo a personal autorizado, y almacenamiento seguro. Sin embargo, ningún sistema de transmisión de datos por internet puede garantizar seguridad absoluta.`,
  },
  {
    titulo: '6. Tus derechos',
    cuerpo: `Conforme a la Ley 25.326 de Protección de Datos Personales de Argentina, tenés derecho a: acceder a tus datos personales, rectificar datos incorrectos, solicitar la supresión de tus datos (derecho al olvido), y oponerte al tratamiento de tus datos para fines de marketing. Para ejercer estos derechos, escribinos a hola@prepagaya.com.ar.`,
  },
  {
    titulo: '7. Retención de datos',
    cuerpo: `Conservamos tus datos personales mientras exista una relación comercial o de comunicación con vos, o el tiempo necesario para cumplir con obligaciones legales. Podés solicitar la eliminación de tus datos en cualquier momento escribiéndonos a hola@prepagaya.com.ar.`,
  },
  {
    titulo: '8. Cambios en esta política',
    cuerpo: `Podemos actualizar esta política de privacidad periódicamente. Te notificaremos sobre cambios significativos por correo electrónico o mediante un aviso destacado en el sitio. La fecha de última actualización aparece al pie de este documento.`,
  },
  {
    titulo: '9. Contacto',
    cuerpo: `Si tenés preguntas sobre esta política de privacidad o sobre cómo tratamos tus datos, podés contactarnos en: hola@prepagaya.com.ar. También podés dirigirte a la Agencia de Acceso a la Información Pública (AAIP) si considerás que tus derechos no han sido debidamente atendidos.`,
  },
]

export default function PrivacidadPage() {
  return (
    <div className="container py-12 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-[#E8002D]">{SITE_NAME}</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900">Política de Privacidad</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de Privacidad</h1>
      <p className="text-sm text-gray-500 mb-10">
        Última actualización: junio 2026 · {SITE_NAME} — prepagaya.com.ar
      </p>

      <div className="prose prose-gray max-w-none space-y-8">
        {secciones.map((s) => (
          <section key={s.titulo}>
            <h2 className="text-lg font-bold text-gray-900 mb-3">{s.titulo}</h2>
            <p className="text-gray-600 leading-relaxed text-sm">{s.cuerpo}</p>
          </section>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-xs text-gray-400 mb-4">
          Esta política está redactada en cumplimiento de la Ley 25.326 de Protección de Datos Personales de la República Argentina y las directrices de la Agencia de Acceso a la Información Pública (AAIP).
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#E8002D] hover:underline"
        >
          ← Volver al comparador de prepagas
        </Link>
      </div>
    </div>
  )
}
