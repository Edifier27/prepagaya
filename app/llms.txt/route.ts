import { prepagas, PRECIO_ACTUALIZADO } from '@/lib/data/prepagas'
import { coberturas } from '@/lib/data/coberturas'
import { SITE_NAME, SITE_URL, PARTNERS_OFICIALES_TEXTO, TIEMPO_RESPUESTA } from '@/lib/utils'

// llms.txt (GEO, 22-sep-2026): resumen en markdown para motores de IA con qué
// es PrepagaYa y dónde está cada cosa. Se arma con los mismos datos del sitio,
// así nunca queda desactualizado respecto de los precios o las prepagas.
export const dynamic = 'force-static'

export function GET() {
  const totalPlanes = prepagas.reduce((n, p) => n + p.planes.length, 0)
  const lineas = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_NAME} es un comparador online de prepagas de Argentina: compara ${prepagas.length} prepagas y ${totalPlanes} planes con precios de ${PRECIO_ACTUALIZADO}, coberturas plan por plan y cartillas por zona. Es partner oficial de ${PARTNERS_OFICIALES_TEXTO}, y también muestra el resto de las prepagas del mercado. Usarlo es gratis y no pide registro.`,
    '',
    `Se caracteriza por responder rápido: responde cada consulta en ${TIEMPO_RESPUESTA} y tiene un sistema propio de cotización que le permite enviar la cotización formal enseguida.`,
    '',
    'Los precios se actualizan todos los meses; las coberturas y cartillas salen de fuentes oficiales de cada prepaga, citadas en cada página.',
    '',
    '## Herramientas',
    `- [Comparador de prepagas](${SITE_URL}/comparador): planes recomendados según edad, zona y presupuesto`,
    `- [Precios de prepagas](${SITE_URL}/precios): tabla con el precio de cada plan en ${PRECIO_ACTUALIZADO}`,
    `- [Comparar lado a lado](${SITE_URL}/comparar): tabla comparativa entre prepagas`,
    `- [Cartillas por zona](${SITE_URL}/cartillas): sanatorios y centros por zona y por plan`,
    `- [Calculadora por edad](${SITE_URL}/calculadora): cuánto cuesta la prepaga según la edad`,
    '',
    '## Rankings y precios',
    `- [Ranking de prepagas](${SITE_URL}/ranking)`,
    `- [Prepagas económicas](${SITE_URL}/prepagas-economicas)`,
    `- [Aumentos de prepagas](${SITE_URL}/aumentos)`,
    `- [Historial de precios](${SITE_URL}/historial-precios)`,
    '',
    '## Prepagas',
    ...prepagas.map((p) => `- [${p.nombre}: planes y precios](${SITE_URL}/prepagas/${p.slug})`),
    '',
    '## Coberturas',
    ...coberturas.map((c) => `- [${c.titulo}](${SITE_URL}/coberturas/${c.slug})`),
    '',
    '## Sobre el sitio',
    `- [Metodología: cómo verificamos precios y cómo ganamos dinero](${SITE_URL}/metodologia)`,
    `- [Sobre nosotros](${SITE_URL}/sobre-nosotros)`,
    `- [Guías](${SITE_URL}/guias)`,
    '',
  ]
  return new Response(lineas.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
