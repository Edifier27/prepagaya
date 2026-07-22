import type { MetadataRoute } from 'next'
import { prepagas } from '@/lib/data/prepagas'
import { comparativas } from '@/lib/data/comparativas'
import { guias } from '@/lib/data/guias'
import { ciudades } from '@/lib/data/ciudades'
import { perfiles } from '@/lib/data/perfiles'
import { blogPosts } from '@/lib/data/blog'
import { coberturas } from '@/lib/data/coberturas'
import { condiciones } from '@/lib/data/condiciones'
import { obrasSociales } from '@/lib/data/obras-sociales'
import { cartillasInfo } from '@/lib/data/cartillas'
import { provinciasSEO } from '@/lib/data/zonas'

const BASE = 'https://www.prepagaya.com.ar'

// Los precios se actualizan al inicio de cada mes: las páginas con precios
// declaran como última modificación el día 1 del mes en curso.
const now = new Date()
const PRECIOS_UPDATE = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

// Última revisión editorial del contenido estable (guías, coberturas, etc.)
const CONTENT_UPDATE = new Date('2026-07-14').toISOString()

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: PRECIOS_UPDATE, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/prepagas`, lastModified: PRECIOS_UPDATE, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/precios`, lastModified: PRECIOS_UPDATE, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE}/aumentos`, lastModified: PRECIOS_UPDATE, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/ranking`, lastModified: PRECIOS_UPDATE, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/comparativas`, lastModified: CONTENT_UPDATE, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/guias`, lastModified: CONTENT_UPDATE, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/coberturas`, lastModified: CONTENT_UPDATE, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/condiciones`, lastModified: CONTENT_UPDATE, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/comparador`, lastModified: PRECIOS_UPDATE, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${BASE}/calculadora`, lastModified: PRECIOS_UPDATE, changeFrequency: 'monthly', priority: 0.90 },
    { url: `${BASE}/comparar`, lastModified: PRECIOS_UPDATE, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/blog`, lastModified: CONTENT_UPDATE, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/obras-sociales`, lastModified: CONTENT_UPDATE, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/sobre-nosotros`, lastModified: CONTENT_UPDATE, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE}/metodologia`, lastModified: CONTENT_UPDATE, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE}/prepaga-por-presupuesto`, lastModified: PRECIOS_UPDATE, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE}/cartillas`, lastModified: CONTENT_UPDATE, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/historial-precios`, lastModified: PRECIOS_UPDATE, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/glosario`, lastModified: CONTENT_UPDATE, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/privacidad`, lastModified: CONTENT_UPDATE, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/en/health-insurance-argentina`, lastModified: CONTENT_UPDATE, changeFrequency: 'monthly', priority: 0.7 },
  ]

  const prepagaRoutes: MetadataRoute.Sitemap = prepagas.flatMap((p) => [
    { url: `${BASE}/prepagas/${p.slug}`, lastModified: PRECIOS_UPDATE, changeFrequency: 'weekly' as const, priority: 0.85 },
    ...p.planes.map((pl) => ({
      url: `${BASE}/prepagas/${p.slug}/${pl.slug}`,
      lastModified: PRECIOS_UPDATE,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    })),
  ])

  const comparativaRoutes: MetadataRoute.Sitemap = comparativas.map((c) => ({
    url: `${BASE}/comparativas/${c.slug}`,
    lastModified: PRECIOS_UPDATE,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const guiaRoutes: MetadataRoute.Sitemap = guias.map((g) => ({
    url: `${BASE}/guias/${g.slug}`,
    lastModified: new Date(g.fechaActualizacion).toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Ciudades cuya provincia ya migró al silo /prepagas/[provincia] (301 en next.config).
  // 'rosario' y 'la-plata' redirigen a su localidad dentro del hub provincial.
  const CIUDADES_MIGRADAS = new Set([...provinciasSEO.map((p) => p.slug), 'rosario', 'la-plata'])
  const ciudadRoutes: MetadataRoute.Sitemap = ciudades
    .filter((c) => !CIUDADES_MIGRADAS.has(c.slug))
    .map((c) => ({
      url: `${BASE}/prepagas-en/${c.slug}`,
      lastModified: PRECIOS_UPDATE,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    }))

  // Silo SEO local: hub provincial + ranking + prepaga×zona + localidades
  const zonaRoutes: MetadataRoute.Sitemap = provinciasSEO.flatMap((prov) => [
    { url: `${BASE}/prepagas/${prov.slug}`, lastModified: PRECIOS_UPDATE, changeFrequency: 'weekly' as const, priority: 0.85 },
    { url: `${BASE}/prepagas/${prov.slug}/mejores-prepagas`, lastModified: PRECIOS_UPDATE, changeFrequency: 'weekly' as const, priority: 0.8 },
    ...prov.prepagas.filter((pz) => pz.enSitio).map((pz) => ({
      url: `${BASE}/prepagas/${prov.slug}/${pz.slug}`,
      lastModified: PRECIOS_UPDATE,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
    ...prov.localidades.map((loc) => ({
      url: `${BASE}/prepagas/${prov.slug}/${loc.slug}`,
      lastModified: PRECIOS_UPDATE,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ])

  const perfilRoutes: MetadataRoute.Sitemap = perfiles.map((p) => ({
    url: `${BASE}/para/${p.slug}`,
    lastModified: CONTENT_UPDATE,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }))

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.fechaPublicacion).toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }))

  const coberturaRoutes: MetadataRoute.Sitemap = coberturas.map((c) => ({
    url: `${BASE}/coberturas/${c.slug}`,
    lastModified: CONTENT_UPDATE,
    changeFrequency: 'monthly' as const,
    priority: 0.80,
  }))

  const condicionRoutes: MetadataRoute.Sitemap = condiciones.map((c) => ({
    url: `${BASE}/condiciones/${c.slug}`,
    lastModified: CONTENT_UPDATE,
    changeFrequency: 'monthly' as const,
    priority: 0.80,
  }))

  const cartillaRoutes: MetadataRoute.Sitemap = cartillasInfo.map((c) => ({
    url: `${BASE}/cartillas/${c.slug}`,
    lastModified: CONTENT_UPDATE,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const obraSocialRoutes: MetadataRoute.Sitemap = obrasSociales.map((os) => ({
    url: `${BASE}/obras-sociales/${os.slug}`,
    lastModified: CONTENT_UPDATE,
    changeFrequency: 'monthly' as const,
    priority: 0.80,
  }))

  return [
    ...staticRoutes,
    ...prepagaRoutes,
    ...zonaRoutes,
    ...comparativaRoutes,
    ...guiaRoutes,
    ...ciudadRoutes,
    ...perfilRoutes,
    ...blogRoutes,
    ...coberturaRoutes,
    ...condicionRoutes,
    ...obraSocialRoutes,
    ...cartillaRoutes,
  ]
}
