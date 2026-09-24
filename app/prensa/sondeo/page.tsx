import type { Metadata } from 'next'
import Link from 'next/link'
import { filasSondeo } from '@/lib/db'
import { agregarSondeo, MIN_BASE } from '@/lib/data/sondeo'
import { SondeoVista } from '@/components/prensa/SondeoVista'
import { SITE_NAME, SITE_URL } from '@/lib/utils'

// Sondeo PrepagaYa (24-sep-2026): quién busca prepaga en Argentina, a partir
// de las cotizaciones del sitio. Es el formato que más links le da a
// MiObraSocial (ver docs/seo/plan-backlinks.md). Solo totales y porcentajes:
// la consulta no trae nombre, celular ni email (filasSondeo en lib/db.ts) y
// el agregado de lib/data/sondeo.ts esconde bloques y categorías chicas.
//
// SONDEO_PUBLICADO: en false la página existe pero no se indexa ni se enlaza.
// Pasarlo a true recién cuando Darío haya revisado los números en producción.
const SONDEO_PUBLICADO = false
// Primer día con leads completos en la base. Cambiarlo si los primeros días
// tienen datos de prueba.
const SONDEO_DESDE = '2026-09-01'

export const revalidate = 86400

const SONDEO_URL = `${SITE_URL}/prensa/sondeo`

export const metadata: Metadata = {
  title: 'Sondeo: quién busca prepaga en Argentina (datos propios)',
  description: 'Edad, grupo familiar, provincia, situación laboral y presupuesto de quienes cotizan prepaga en PrepagaYa. Datos anónimos y agregados, actualizados todos los días.',
  alternates: { canonical: SONDEO_URL },
  robots: SONDEO_PUBLICADO ? { index: true, follow: true } : { index: false, follow: true },
}

export default async function SondeoPage() {
  const s = agregarSondeo(await filasSondeo(SONDEO_DESDE))
  const hayDatos = s.total >= MIN_BASE && s.bloques.length > 0

  const jsonLd = SONDEO_PUBLICADO && hayDatos ? {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Sondeo PrepagaYa: quién busca prepaga en Argentina',
    description: 'Estadísticas anónimas y agregadas de las cotizaciones de prepaga hechas en PrepagaYa: edad, grupo familiar, provincia, situación laboral, cobertura actual y presupuesto.',
    url: SONDEO_URL,
    creator: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'es-AR',
    spatialCoverage: 'Argentina',
    ...(s.desde && s.hasta ? { temporalCoverage: `${s.desde.slice(0, 10)}/${s.hasta.slice(0, 10)}` } : {}),
  } : null

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}

      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="container">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-[#E8002D] transition-colors">{SITE_NAME}</Link>
            <span className="text-gray-300">›</span>
            <Link href="/prensa" className="hover:text-[#E8002D] transition-colors">Prensa</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700">Sondeo</span>
          </nav>
        </div>
      </div>

      <SondeoVista s={s} />
    </>
  )
}
