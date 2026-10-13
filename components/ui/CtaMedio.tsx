import Link from 'next/link'
import { TIEMPO_RESPUESTA } from '@/lib/utils'

// Bloque "Cotizá" a mitad de página (13-oct-2026, Search Console + Vercel):
// /ranking y /obras-sociales/codigos tienen miles de impresiones y casi no
// generaban contactos porque el único llamado estaba al final.
export function CtaMedio({ titulo, texto, href = '/comparador', boton = 'Ver mi precio' }: { titulo: string; texto?: string; href?: string; boton?: string }) {
  return (
    <section className="py-6 bg-white">
      <div className="container max-w-4xl mx-auto">
        <div className="rounded-2xl bg-gradient-to-r from-[#E8002D] to-[#B8001F] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
          <div className="min-w-0">
            <p className="font-bold text-lg leading-snug">{titulo}</p>
            <p className="text-sm text-red-100 mt-1">{texto ?? `Gratis y sin DNI: tu precio exacto por edad y zona, con 15% de descuento. Un asesor te responde en ${TIEMPO_RESPUESTA}.`}</p>
          </div>
          <Link href={href} className="shrink-0 inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-[#E8002D] font-bold text-sm hover:bg-red-50 transition-colors">
            {boton} →
          </Link>
        </div>
      </div>
    </section>
  )
}
