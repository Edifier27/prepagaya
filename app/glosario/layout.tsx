import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Glosario de prepagas: términos y definiciones',
  description: 'Diccionario claro de los términos que vas a encontrar al comparar prepagas en Argentina: PMO, copago, carencia, período de espera, cartilla, derivación de aportes y más.',
  alternates: { canonical: `${SITE_URL}/glosario` },
  keywords: ['glosario prepagas', 'términos prepagas argentina', 'qué es el PMO', 'qué es la carencia prepaga', 'diccionario medicina prepaga'],
}

export default function GlosarioLayout({ children }: { children: React.ReactNode }) {
  return children
}
