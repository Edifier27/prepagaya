// IndexNow (4-oct-2026): avisa a Bing (y a Yandex, Seznam, Naver) las URLs
// nuevas o cambiadas para que las indexe sin esperar al rastreo. Bing trae
// cerca del 9% de las visitas desde Google (Vercel Analytics, 20/9-4/10).
//
// Lee el sitemap publicado y manda las URLs con lastmod de los últimos DIAS
// días, o todas con --todo. La clave es pública a propósito: IndexNow la
// verifica en https://www.prepagaya.com.ar/<clave>.txt.
//
//   node scripts/indexnow.mjs          → cambiadas en los últimos 7 días
//   node scripts/indexnow.mjs --todo   → todo el sitemap

const SITIO = 'https://www.prepagaya.com.ar'
const CLAVE = 'b03bda44527688fe13c36655230484a5'
const DIAS = 7
const todo = process.argv.includes('--todo')

const xml = await (await fetch(`${SITIO}/sitemap.xml`)).text()
const desde = Date.now() - DIAS * 86_400_000
const urls = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)]
  .map(([, u]) => ({ loc: u.match(/<loc>([^<]+)/)?.[1], lastmod: u.match(/<lastmod>([^<]+)/)?.[1] }))
  .filter((u) => u.loc && (todo || (u.lastmod && Date.parse(u.lastmod) >= desde)))
  .map((u) => u.loc)

if (!urls.length) {
  console.log('IndexNow: no hay URLs cambiadas en los últimos', DIAS, 'días')
  process.exit(0)
}

// Hasta 10.000 URLs por pedido
for (let i = 0; i < urls.length; i += 10_000) {
  const lote = urls.slice(i, i + 10_000)
  const r = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(SITIO).host, key: CLAVE, keyLocation: `${SITIO}/${CLAVE}.txt`, urlList: lote }),
  })
  console.log(`IndexNow: ${lote.length} URLs → ${r.status} ${r.statusText}`)
  if (r.status >= 400) process.exit(1)
}
