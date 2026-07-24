import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { SiteChrome } from '@/components/layout/SiteChrome'
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/utils'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
      </body>
    </html>
  )
}
