'use client'

import { useState } from 'react'
import { SITE_NAME, SITE_URL } from '@/lib/utils'

// Código para insertar un widget (aumentos, calculadora de aportes) en otro sitio. El link de la
// fuente va FUERA del iframe (un link adentro del iframe no cuenta como
// enlace del sitio que lo inserta) y con la marca como texto, no con una
// keyword: los links de widgets con anchor de keyword son los que Google
// trata como esquema de enlaces.
interface Props {
  /** Alto del iframe en px */
  alto: number
  /** Ruta del widget y página del sitio a la que apunta el link de la fuente */
  widget?: string
  pagina?: string
  titulo?: string
  intro?: string
  /** Suma el script que ajusta el alto del iframe al contenido (el widget lo avisa con postMessage) */
  autoAlto?: boolean
}

export function InsertarWidget({
  alto,
  widget = '/widget/aumentos',
  pagina = '/aumentos',
  titulo = 'Aumento de prepagas por empresa (dato oficial SSSalud)',
  intro = 'Insertá el gráfico en tu nota o blog: se actualiza solo cada mes con el dato oficial, sin que tengas que tocar nada.',
  autoAlto = false,
}: Props) {
  const origen = new URL(SITE_URL).origin
  const [copiado, setCopiado] = useState(false)
  const codigo = `<iframe src="${SITE_URL}${widget}" title="${titulo}" width="100%" height="${alto}" style="border:1px solid #e5e7eb;border-radius:12px;max-width:640px" loading="lazy"></iframe>
<p style="font-size:12px;color:#6b7280">Fuente: <a href="${SITE_URL}${pagina}">${SITE_NAME}</a>, con datos de la Superintendencia de Servicios de Salud.</p>${autoAlto ? `
<script>addEventListener('message',function(e){if(e.origin==='${origen}'&&e.data&&e.data.prepagayaAlto){document.querySelectorAll('iframe[src="${SITE_URL}${widget}"]').forEach(function(f){f.style.height=e.data.prepagayaAlto+'px'})}})</script>` : ''}`

  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      setCopiado(false)
    }
  }

  return (
    <div>
      <p className="text-sm text-gray-600 leading-relaxed mb-3">
        {intro}
      </p>
      <pre className="text-xs bg-gray-900 text-gray-100 rounded-xl p-4 overflow-x-auto whitespace-pre-wrap break-all">{codigo}</pre>
      <button
        type="button"
        onClick={copiar}
        className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-[#E8002D] hover:bg-[#B8001F] text-white text-sm font-bold rounded-xl transition-colors"
      >
        {copiado ? '¡Copiado!' : 'Copiar código'}
      </button>
      <a href={widget} target="_blank" rel="noopener" className="ml-3 text-sm font-semibold text-[#E8002D] hover:underline">
        Ver el widget →
      </a>
    </div>
  )
}
