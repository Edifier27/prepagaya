import type { MetadataRoute } from 'next'
import { prepagas } from '@/lib/data/prepagas'
import { comparativasPlanes } from '@/lib/data/comparativas-planes'
import { comparativas } from '@/lib/data/comparativas'
import { guias } from '@/lib/data/guias'
import { ciudades } from '@/lib/data/ciudades'
import { perfiles } from '@/lib/data/perfiles'
import { blogPosts } from '@/lib/data/blog'
import { coberturas } from '@/lib/data/coberturas'
import { condiciones } from '@/lib/data/condiciones'
import { obrasSociales } from '@/lib/data/obras-sociales'
import { cartillasInfo } from '@/lib/data/cartillas'
import { CARTILLAS, combinacionesPlanZona, indiceZonas, slugPlan } from '@/lib/data/cartilla-zonas'
import { coberturasMarca } from '@/lib/data/coberturas-marca'
import { provinciasSEO } from '@/lib/data/zonas'
import { cambiosRecomendados } from '@/lib/data/cambios'
import { PRECIOS_UPDATE, CONTENT_UPDATE } from '@/lib/utils'

const BASE = 'https://www.prepagaya.com.ar'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: PRECIOS_UPDATE, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/prepagas`, lastModified: PRECIOS_UPDATE, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/precios`, lastModified: PRECIOS_UPDATE, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE}/aumentos`, lastModified: PRECIOS_UPDATE, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/ranking`, lastModified: PRECIOS_UPDATE, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/comparativas`, lastModified: CONTENT_UPDATE, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/guias`, lastModified: CONTENT_UPDATE, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/tramites`, lastModified: CONTENT_UPDATE, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/pmo`, lastModified: CONTENT_UPDATE, changeFrequency: 'monthly', priority: 0.85 },
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
    { url: `${BASE}/terminos-y-condiciones`, lastModified: CONTENT_UPDATE, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/en/health-insurance-argentina`, lastModified: CONTENT_UPDATE, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/cambios`, lastModified: PRECIOS_UPDATE, changeFrequency: 'monthly', priority: 0.85 },
  ]

  const cambioRoutes: MetadataRoute.Sitemap = cambiosRecomendados.map((c) => ({
    url: `${BASE}/cambios/${c.slug}`,
    lastModified: PRECIOS_UPDATE,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

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

  const comparativaPlanesRoutes: MetadataRoute.Sitemap = comparativasPlanes.map((c) => ({
    url: `${BASE}/prepagas/${c.prepagaSlug}/${c.slug}`,
    lastModified: PRECIOS_UPDATE,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const guiaRoutes: MetadataRoute.Sitemap = guias.map((g) => ({
    url: `${BASE}/guias/${g.slug}`,
    lastModified: new Date(g.fechaActualizacion).toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const empresasRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/empresas`, lastModified: PRECIOS_UPDATE, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE}/empresas/como-cotizar`, lastModified: PRECIOS_UPDATE, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE}/empresas/beneficios-impositivos`, lastModified: PRECIOS_UPDATE, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE}/empresas/swiss-medical`, lastModified: PRECIOS_UPDATE, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE}/empresas/osde`, lastModified: PRECIOS_UPDATE, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE}/empresas/sancor-salud`, lastModified: PRECIOS_UPDATE, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE}/empresas/avalian`, lastModified: PRECIOS_UPDATE, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE}/empresas/swiss-medical/plan-black`, lastModified: PRECIOS_UPDATE, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE}/empresas/swiss-medical/vs-osde`, lastModified: PRECIOS_UPDATE, changeFrequency: 'monthly' as const, priority: 0.75 },
    { url: `${BASE}/empresas/ranking`, lastModified: PRECIOS_UPDATE, changeFrequency: 'monthly' as const, priority: 0.75 },
  ]

  // Ciudades cuya provincia ya migró al silo /prepagas/[provincia] (301 en next.config).
  // 'rosario', 'la-plata' y 'posadas' redirigen a su localidad dentro del hub provincial.
  const CIUDADES_MIGRADAS = new Set([...provinciasSEO.map((p) => p.slug), 'rosario', 'la-plata', 'posadas', 'mar-del-plata'])
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
    // Cruce localidad × prepaga (ej. "Swiss Medical en Bahía Blanca") —
    // un nivel más específico que la ficha de prepaga a nivel provincial.
    ...prov.localidades.flatMap((loc) =>
      prov.prepagas.filter((pz) => pz.enSitio).map((pz) => ({
        url: `${BASE}/prepagas/${prov.slug}/${loc.slug}/${pz.slug}`,
        lastModified: PRECIOS_UPDATE,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    ),
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

  // Silo de cartilla por zona (OSDE / Premedic / Avalian): solo las zonas
  // indexables (las de 1 centro y las subzonas Sudeste/Sudoeste van noindex).
  const cartillaZonaRoutes: MetadataRoute.Sitemap = Object.values(CARTILLAS).flatMap((c) => [
    ...c.planesConPagina.map((p) => ({
      url: `${BASE}/cartillas/${c.prepagaSlug}/${slugPlan(p)}`,
      lastModified: CONTENT_UPDATE,
      changeFrequency: 'monthly' as const,
      priority: 0.72,
    })),
    ...indiceZonas(c.prepagaSlug)
      .filter((z) => z.indexable)
      .map((z) => ({
        url: `${BASE}/cartillas/${c.prepagaSlug}/${z.slug}`,
        lastModified: CONTENT_UPDATE,
        changeFrequency: 'monthly' as const,
        priority: 0.68,
      })),
    ...combinacionesPlanZona(c.prepagaSlug).map((x) => ({
      url: `${BASE}/cartillas/${c.prepagaSlug}/${x.plan}/${x.zona}`,
      lastModified: CONTENT_UPDATE,
      changeFrequency: 'monthly' as const,
      priority: 0.62,
    })),
  ])

  const coberturaMarcaRoutes: MetadataRoute.Sitemap = coberturasMarca.map((c) => ({
    url: `${BASE}/coberturas/${c.tema}/${c.prepagaSlug}`,
    lastModified: CONTENT_UPDATE,
    changeFrequency: 'monthly' as const,
    priority: 0.72,
  }))

  const obraSocialRoutes: MetadataRoute.Sitemap = obrasSociales.map((os) => ({
    url: `${BASE}/obras-sociales/${os.slug}`,
    lastModified: CONTENT_UPDATE,
    changeFrequency: 'monthly' as const,
    priority: 0.80,
  }))

  return [
    ...staticRoutes,
    ...cambioRoutes,
    ...prepagaRoutes,
    ...zonaRoutes,
    ...comparativaRoutes,
    ...comparativaPlanesRoutes,
    ...guiaRoutes,
    ...empresasRoutes,
    ...ciudadRoutes,
    ...perfilRoutes,
    ...blogRoutes,
    ...coberturaRoutes,
    ...condicionRoutes,
    ...obraSocialRoutes,
    ...cartillaRoutes,
    ...cartillaZonaRoutes,
    ...coberturaMarcaRoutes,
  ]
}
