import { AUMENTOS_OFICIALES } from '@/lib/data/aumentos'

// Dataset descargable para periodistas (23-sep-2026): aumento de cada prepaga
// por mes, calculado de los cuadros tarifarios oficiales de la SSSalud.
export const dynamic = 'force-static'

export function GET() {
  const filas = [
    'periodo,mes,prepaga,aumento_mediana_pct,aumento_minimo_pct,aumento_maximo_pct,filas_del_cuadro,fuente',
  ]
  for (const periodo of Object.keys(AUMENTOS_OFICIALES.meses).sort()) {
    const m = AUMENTOS_OFICIALES.meses[periodo]
    const lista = Object.values(m.prepagas).sort((a, b) => a.mediana - b.mediana)
    for (const p of lista) {
      filas.push([periodo, `"${m.label}"`, `"${p.nombre}"`, p.mediana, p.minimo, p.maximo, p.filas, `"${AUMENTOS_OFICIALES.fuenteUrl}"`].join(','))
    }
  }
  return new Response(filas.join('\n') + '\n', {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'inline; filename="aumentos-prepagas-sssalud-prepagaya.csv"',
    },
  })
}
