import { FUENTES_SUCURSALES, SUCURSALES_GENERADO, linkMapa, type Sucursal } from '@/lib/data/sucursales'

// Sucursales oficiales de una prepaga en una provincia o localidad
// (lib/data/sucursales.ts). Va arriba de todo: quien busca "osde rosario"
// casi siempre quiere la dirección de la sucursal.

const MAX = 12

/** "San Lorenzo 1141 - Rosario - Santa Fe" → "San Lorenzo 1141" cuando el resto repite la localidad. */
function direccionCorta(s: Sucursal): string {
  const partes = s.direccion.split(' - ').map((x) => x.trim())
  return partes.length > 1 && s.localidad && partes.slice(1).some((p) => p.toLowerCase() === s.localidad!.toLowerCase()) ? partes[0] : s.direccion
}

export function SucursalesBloque({ prepagaSlug, prepagaNombre, lugar, sucursales }: { prepagaSlug: string; prepagaNombre: string; lugar: string; sucursales: Sucursal[] }) {
  if (!sucursales.length) return null
  const fuente = FUENTES_SUCURSALES[prepagaSlug]
  const fecha = SUCURSALES_GENERADO ? new Date(`${SUCURSALES_GENERADO}T12:00:00`).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }) : null
  const lista = sucursales.slice(0, MAX)
  return (
    <section id="sucursales" className="mb-8 scroll-mt-20">
      <h2 className="text-xl font-bold text-gray-900 mb-3">
        {sucursales.length === 1 ? `Sucursal de ${prepagaNombre} en ${lugar}` : `Sucursales de ${prepagaNombre} en ${lugar}`}
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {lista.map((s) => (
          <li key={`${s.nombre}-${s.direccion}`} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="font-semibold text-gray-900 text-sm">{s.nombre}</div>
            <div className="text-sm text-gray-700 mt-0.5">{direccionCorta(s)}{s.localidad && !direccionCorta(s).toLowerCase().includes(s.localidad.toLowerCase()) ? `, ${s.localidad}` : ''}</div>
            {s.horario && <div className="text-xs text-gray-500 mt-1">{s.horario}</div>}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm">
              {s.telefono && <a href={`tel:${s.telefono.split('/')[0].replace(/[^\d+]/g, '')}`} className="font-semibold text-[#E8002D] hover:underline">{s.telefono}</a>}
              <a href={linkMapa(s)} target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-600 hover:text-gray-900 hover:underline">Cómo llegar</a>
            </div>
          </li>
        ))}
      </ul>
      {sucursales.length > MAX && <p className="text-sm text-gray-600 mt-2">Y {sucursales.length - MAX} más en {lugar}.</p>}
      {fuente && (
        <p className="text-xs text-gray-500 mt-3">
          Fuente: <a href={fuente} target="_blank" rel="noopener noreferrer" className="underline">buscador oficial de sucursales de {prepagaNombre}</a>{fecha ? `, consultado el ${fecha}` : ''}. Confirmá el horario antes de ir.
        </p>
      )}
    </section>
  )
}
