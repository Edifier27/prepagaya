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

const BASE = 'https://prepagaya.com.ar'
const NOW = new Date().toISOString()

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: NOW, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/prepagas`, lastModified: NOW, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/precios`, lastModified: NOW, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE}/ranking`, lastModified: NOW, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/comparativas`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/guias`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/coberturas`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/condiciones`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/comparador`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${BASE}/calculadora`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.90 },
    { url: `${BASE}/comparar`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/blog`, lastModified: NOW, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/obras-sociales`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/sobre-nosotros`, lastModified: NOW, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE}/metodologia`, lastModified: NOW, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE}/prepaga-por-presupuesto`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE}/cartillas`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/historial-precios`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/calculadora-costo`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE}/privacidad`, lastModified: NOW, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const prepagaRoutes: MetadataRoute.Sitemap = prepagas.flatMap((p) => [
    { url: `${BASE}/prepagas/${p.slug}`, lastModified: NOW, changeFrequency: 'weekly' as const, priority: 0.85 },
    ...p.planes.map((pl) => ({
      url: `${BASE}/prepagas/${p.slug}/${pl.slug}`,
      lastModified: NOW,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    })),
  ])

  const comparativaRoutes: MetadataRoute.Sitemap = comparativas.map((c) => ({
    url: `${BASE}/comparativas/${c.slug}`,
    lastModified: NOW,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const guiaRoutes: MetadataRoute.Sitemap = guias.map((g) => ({
    url: `${BASE}/guias/${g.slug}`,
    lastModified: NOW,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const ciudadRoutes: MetadataRoute.Sitemap = ciudades.map((c) => ({
    url: `${BASE}/prepagas-en/${c.slug}`,
    lastModified: NOW,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }))

  const perfilRoutes: MetadataRoute.Sitemap = perfiles.map((p) => ({
    url: `${BASE}/para/${p.slug}`,
    lastModified: NOW,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }))

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: NOW,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }))

  const coberturaRoutes: MetadataRoute.Sitemap = coberturas.map((c) => ({
    url: `${BASE}/coberturas/${c.slug}`,
    lastModified: NOW,
    changeFrequency: 'monthly' as const,
    priority: 0.80,
  }))

  const condicionRoutes: MetadataRoute.Sitemap = condiciones.map((c) => ({
    url: `${BASE}/condiciones/${c.slug}`,
    lastModified: NOW,
    changeFrequency: 'monthly' as const,
    priority: 0.80,
  }))

  const obraSocialRoutes: MetadataRoute.Sitemap = obrasSociales.map((os) => ({
    url: `${BASE}/obras-sociales/${os.slug}`,
    lastModified: NOW,
    changeFrequency: 'monthly' as const,
    priority: 0.80,
  }))

  return [
    ...staticRoutes,
    ...prepagaRoutes,
    ...comparativaRoutes,
    ...guiaRoutes,
    ...ciudadRoutes,
    ...perfilRoutes,
    ...blogRoutes,
    ...coberturaRoutes,
    ...condicionRoutes,
    ...obraSocialRoutes,
  ]
}
