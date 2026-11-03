'use client'

import { trackEvent } from '@/lib/analytics'

// "¿Me lo pasás por escrito / en PDF?" es de lo que más piden en los chats del CRM (3-nov-2026). El botón
// imprime solo la hoja del plan (el bloque con data-imprimir de la ficha): en el celular y en la compu,
// "Guardar como PDF" en el diálogo de impresión.
export function BotonPdfPlan({ plan, className = '' }: { plan: string; className?: string }) {
  function imprimir() {
    trackEvent('pdf_plan_click', { plan })
    // La hoja se copia como hija directa del body: así se oculta todo lo demás con display:none
    // y el PDF sale de una o dos páginas, sin las hojas en blanco del resto de la ficha.
    const origen = document.querySelector('[data-imprimir]')
    if (!origen) return window.print()
    const hoja = origen.cloneNode(true) as HTMLElement
    hoja.removeAttribute('data-imprimir')
    hoja.className = 'hoja-imprimir'
    document.body.appendChild(hoja)
    document.body.classList.add('imprimir-plan')
    const limpiar = () => { document.body.classList.remove('imprimir-plan'); hoja.remove(); window.removeEventListener('afterprint', limpiar) }
    window.addEventListener('afterprint', limpiar)
    window.print()
    // Safari en iOS no siempre dispara afterprint
    setTimeout(limpiar, 60000)
  }
  return (
    <button type="button" onClick={imprimir}
      className={`inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:border-red-200 hover:text-[#E8002D] print:hidden ${className}`}>
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden><path d="M10 2a1 1 0 011 1v7.59l2.3-2.3a1 1 0 111.4 1.42l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.42L9 10.59V3a1 1 0 011-1zM4 15a1 1 0 011 1v1h10v-1a1 1 0 112 0v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2a1 1 0 011-1z" /></svg>
      Descargar qué cubre (PDF)
    </button>
  )
}
