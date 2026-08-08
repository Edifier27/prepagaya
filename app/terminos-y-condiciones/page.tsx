import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_NAME, SITE_URL } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: `Términos y condiciones de uso de ${SITE_NAME}, el comparador de prepagas y obras sociales de Argentina.`,
  alternates: { canonical: `${SITE_URL}/terminos-y-condiciones` },
  robots: { index: true, follow: true },
}

const secciones = [
  {
    titulo: '1. Qué es PrepagaYa',
    cuerpo: `${SITE_NAME} es un sitio independiente de comparación e información sobre prepagas y obras sociales en Argentina. No somos una prepaga, una obra social, ni una compañía de seguros: somos un intermediario informativo que te ayuda a comparar precios, coberturas y cartillas antes de contratar directamente con la empresa de tu elección.`,
  },
  {
    titulo: '2. Carácter orientativo de la información',
    cuerpo: `Los precios, coberturas, cartillas y demás datos publicados en el sitio tienen carácter informativo y orientativo. Se elaboran a partir de cuadros tarifarios oficiales, información pública de cada prepaga y relevamientos propios, pero pueden contener errores o desactualizaciones puntuales. El precio final de un plan depende de la cotización personalizada que te brinde la prepaga o su representante autorizado. Ante cualquier diferencia, prevalece siempre la información y las condiciones que te confirme la prepaga al momento de contratar.`,
  },
  {
    titulo: '3. Cómo funciona el servicio',
    cuerpo: `Usar el comparador de ${SITE_NAME} es gratuito para el usuario. Al completar el formulario de cotización, tus datos pueden ser compartidos con la prepaga o las prepagas que elegís conocer, para que un asesor te contacte y te acompañe en el proceso de contratación. Vos decidís en todo momento si avanzar o no con la contratación: no representamos a ninguna prepaga en particular ni gestionamos afiliaciones sin tu consentimiento.`,
  },
  {
    titulo: '4. Modelo de negocio y comisiones',
    cuerpo: `${SITE_NAME} trabaja con un grupo curado de prepagas partner. Cuando una contratación se concreta a través nuestro, la prepaga nos paga una comisión de intermediación. Esta comisión no representa ningún costo adicional para vos: pagás exactamente lo mismo que pagarías contratando directamente con la prepaga. El resto de las prepagas del mercado también se muestran en el sitio con fines informativos, aunque no gestionemos su contratación de forma directa.`,
  },
  {
    titulo: '5. Límites de responsabilidad',
    cuerpo: `${SITE_NAME} no es responsable por las prestaciones médicas, la calidad de atención, los plazos de carencia, ni por cualquier controversia que surja entre el usuario y la prepaga contratada. La relación contractual de cobertura médica se establece exclusivamente entre el usuario y la prepaga elegida, bajo los términos, condiciones y normativa que esa empresa te informe al momento de la afiliación. Te recomendamos siempre verificar por escrito con la prepaga las condiciones exactas del plan antes de firmar cualquier contrato.`,
  },
  {
    titulo: '6. Marco regulatorio',
    cuerpo: `Las empresas de medicina prepaga que se comparan en este sitio están reguladas por la Superintendencia de Servicios de Salud (SSSalud) y por la Ley 26.682 de Marco Regulatorio de Medicina Prepaga. Ante cualquier reclamo formal relacionado con una prestación médica o una afiliación, el canal correspondiente es la propia prepaga y, en su defecto, la SSSalud o los organismos de Defensa del Consumidor.`,
  },
  {
    titulo: '7. Propiedad intelectual',
    cuerpo: `Los contenidos, textos, comparativas, diseño y marca de ${SITE_NAME} son propiedad del sitio y no pueden reproducirse total o parcialmente sin autorización previa, salvo cita con enlace a la fuente.`,
  },
  {
    titulo: '8. Modificaciones',
    cuerpo: `Podemos actualizar estos términos y condiciones periódicamente para reflejar cambios en el servicio, en la normativa aplicable o en nuestro modelo de negocio. La fecha de última actualización figura al pie de este documento.`,
  },
  {
    titulo: '9. Contacto',
    cuerpo: `Ante dudas sobre estos términos y condiciones, escribinos a hola@prepagaya.com.ar.`,
  },
]

export default function TerminosPage() {
  return (
    <div className="container py-12 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-[#E8002D]">{SITE_NAME}</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900">Términos y Condiciones</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Términos y Condiciones</h1>
      <p className="text-sm text-gray-500 mb-10">
        Última actualización: agosto 2026 · {SITE_NAME} — prepagaya.com.ar
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
          {SITE_NAME} es un sitio independiente, no afiliado a ninguna prepaga ni obra social. Las empresas comparadas están reguladas por la Superintendencia de Servicios de Salud (SSSalud).
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
