import { ImageResponse } from 'next/og'
import { prepagas } from '@/lib/data/prepagas'
import { cartillaConNombre } from '@/lib/cartilla-plan-nombre'
import { formatPrecio, precioDesde } from '@/lib/utils'
import { OG_SIZE, mes } from '@/lib/og/datos'

// Imagen de cada plan y de cada ficha (20-oct-2026): tarjeta con nuestros
// datos (precio oficial a los 30 años, copago, red, cartilla) en vez de una
// foto de marca. Va como vista previa al compartir (WhatsApp, redes), visible
// en la página para la miniatura de Google y Google Imágenes, y en el JSON-LD.
// Se arma con los mismos datos de la página: cambia sola con cada cuadro.

function Tarjeta({ color, marca, titulo, precio, nota, pastillas }: {
  color: string
  marca: string
  titulo: string
  precio: string
  nota: string
  pastillas: string[]
}) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'white', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', height: '18px', background: color }} />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '56px 72px 0' }}>
        <div style={{ display: 'flex', fontSize: '40px', fontWeight: 700, color }}>{marca}</div>
        <div style={{ display: 'flex', fontSize: '76px', fontWeight: 800, color: '#111827', lineHeight: 1.05, marginTop: '6px' }}>{titulo}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '36px' }}>
          <div style={{ display: 'flex', fontSize: '84px', fontWeight: 800, color: '#111827' }}>{precio}</div>
        </div>
        <div style={{ display: 'flex', fontSize: '28px', color: '#4B5563', marginTop: '4px' }}>{nota}</div>
        <div style={{ display: 'flex', gap: '14px', marginTop: '34px' }}>
          {pastillas.map((p) => (
            <div key={p} style={{ display: 'flex', fontSize: '26px', fontWeight: 700, color: '#374151', background: '#F3F4F6', borderRadius: '999px', padding: '10px 26px' }}>{p}</div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 72px 40px' }}>
        <div style={{ display: 'flex', fontSize: '30px', color: '#E8002D' }}>Compará y cotizá en 1 minuto</div>
      </div>
    </div>
  )
}

export function imagenPlan(prepSlug: string, planSlug: string): ImageResponse | null {
  const prep = prepagas.find((p) => p.slug === prepSlug)
  const plan = prep?.planes.find((pl) => pl.slug === planSlug)
  if (!prep || !plan) return null
  const conPrecio = Number.isFinite(plan.precio)
  const cartilla = cartillaConNombre(prep.slug, plan)
  return new ImageResponse(
    <Tarjeta
      color={prep.colorPrimario}
      marca={prep.nombre}
      titulo={plan.nombre}
      precio={conPrecio ? `${formatPrecio(plan.precio)} /mes` : 'Precio a cotizar'}
      nota={conPrecio ? `30 años · Precio oficial SSSalud · ${mes()}` : `${prep.nombre} no publica precio oficial de este plan`}
      pastillas={[plan.copago ? 'Con copago' : 'Sin copago', plan.redAbierta ? 'Red abierta' : 'Red cerrada', ...(cartilla ? [`Cartilla ${cartilla}`] : [])]}
    />,
    OG_SIZE,
  )
}

export function imagenPrepaga(prepSlug: string): ImageResponse | null {
  const prep = prepagas.find((p) => p.slug === prepSlug)
  if (!prep) return null
  const desde = precioDesde(prep)
  const conPrecio = Number.isFinite(desde)
  const sinCopago = prep.planes.filter((pl) => !pl.copago).length
  return new ImageResponse(
    <Tarjeta
      color={prep.colorPrimario}
      marca={prep.nombre}
      titulo={`${prep.planes.length} planes comparados`}
      precio={conPrecio ? `desde ${formatPrecio(desde)} /mes` : 'Precio a cotizar'}
      nota={conPrecio ? `30 años · Precios oficiales SSSalud · ${mes()}` : `${prep.nombre} no publica precios oficiales`}
      pastillas={[sinCopago ? `${sinCopago} sin copago` : '', prep.planes.length - sinCopago ? `${prep.planes.length - sinCopago} con copago` : ''].filter(Boolean)}
    />,
    OG_SIZE,
  )
}
