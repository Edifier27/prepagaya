import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { SiteChrome } from '@/components/layout/SiteChrome'
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/utils'
import { provinciasMenu } from '@/lib/data/zonas'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
// Mono: solo en un par de páginas (códigos) — sin precarga, así no compite
// con la fuente principal en la carga de cada página.
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'], preload: false })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Comparador de Prepagas Argentina 2026`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ['prepagas argentina', 'comparar prepagas', 'mejor prepaga', 'medicina prepaga', 'swiss medical', 'osde', 'sancor salud'],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Comparador de Prepagas Argentina 2026`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Comparador de Prepagas Argentina`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  verification: { google: 'xbu_9e5mpT91WGbFtdOe8q1P2GsLBko-V8jh8LA081c' },
}

// Pinta la barra del navegador (Chrome/Android) del rojo de marca, igual que
// hace Mercado Libre con su amarillo — pedido de Darío, 21-sep-2026.
export const viewport: Viewport = {
  themeColor: '#E8002D',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SiteChrome provincias={provinciasMenu()}>{children}</SiteChrome>
        <Analytics />
        {/* lazyOnload: se carga cuando el navegador queda libre, después de la
            carga de la página (no compite con el primer render en el celular) */}
        <Script src="https://analytics.ahrefs.com/analytics.js" data-key="n963Y9CAcOEi8wFIGX2/pw" strategy="lazyOnload" />
      </body>
    </html>
  )
}
