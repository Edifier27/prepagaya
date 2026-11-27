import { contactos, CONTACTOS_VERIFICADOS } from '@/lib/data/contactos'
import { PREPAGAS_MARCA_LUGAR } from '@/lib/seo/marca-lugar'

// Teléfonos oficiales de la prepaga en las páginas "[prepaga] [ciudad]"
// (27-nov-2026): cuando se agrega algo a la búsqueda, casi siempre es
// "teléfono". Sin la línea de ventas: para cotizar está el asesor oficial.
export function TelefonosMarca({ prepagaSlug, prepagaNombre }: { prepagaSlug: string; prepagaNombre: string }) {
  const c = contactos[prepagaSlug]
  if (!PREPAGAS_MARCA_LUGAR.includes(prepagaSlug) || !c) return null
  const canales = c.canales.filter((x) => x.tipo !== 'ventas')
  if (!canales.length) return null
  return (
    <section id="telefonos" className="mb-8 scroll-mt-20">
      <h2 className="text-xl font-bold text-gray-900 mb-3">Teléfonos de {prepagaNombre}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {canales.map((x) => (
          <div key={`${x.etiqueta}-${x.valor}`} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-xs font-semibold text-gray-500">{x.etiqueta}</div>
            <div className="font-bold text-gray-900 text-sm mt-0.5">{x.valor}</div>
            {x.detalle && <div className="text-xs text-gray-500 mt-1">{x.detalle}</div>}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Fuente: <a href={c.fuente} target="_blank" rel="noopener noreferrer" className="underline">web oficial de {prepagaNombre}</a>, verificado el {CONTACTOS_VERIFICADOS}. Para cotizar un plan, te atiende un asesor oficial desde esta página.
      </p>
    </section>
  )
}
