// JSON-LD para <script type="application/ld+json"> (13-oct-2026, Clarity):
// varias páginas mandaban un array en la raíz y un script de terceros hacía
// r["@context"].toLowerCase() sobre él → error JS en el 69% de los casos.
// Los arrays se envuelven en un único @graph, que es el formato que recomienda
// schema.org. También escapa "<" para que el contenido no cierre el <script>.
export function ldJson(data: unknown): string {
  let out = data
  if (Array.isArray(data)) {
    out = {
      '@context': 'https://schema.org',
      '@graph': data.map((d) => {
        if (d && typeof d === 'object' && !Array.isArray(d)) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { ['@context']: _ctx, ...resto } = d as Record<string, unknown>
          return resto
        }
        return d
      }),
    }
  }
  return JSON.stringify(out).replace(/</g, '\u003c')
}
