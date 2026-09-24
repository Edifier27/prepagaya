"""Exploración de los buscadores oficiales de sucursales (segunda pasada).

Corre en la GitHub Action. Para cada prepaga muestra los datos que hacen
falta para escribir el parser: el JSON completo de Swiss Medical, los
endpoints que usan los buscadores de OSDE y Swiss (dentro de su JS), el
__NEXT_DATA__ de Galeno y el texto visible de las páginas de Premedic,
Medifé y Sancor.

Uso: python scripts/sucursales/explorar.py
"""
import html, json, re, ssl, sys, urllib.error, urllib.request

UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'


def bajar(url, limite=6_000_000, extra=None):
    h = {'User-Agent': UA, 'Accept': '*/*', 'Accept-Language': 'es-AR,es;q=0.9'}
    h.update(extra or {})
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=h), timeout=40, context=ssl.create_default_context()) as r:
            return r.status, r.read(limite).decode('utf-8', 'replace')
    except urllib.error.HTTPError as e:
        return e.code, e.read(5000).decode('utf-8', 'replace')
    except Exception as e:  # noqa: BLE001
        return 'ERR', repr(e)


def visible(cuerpo):
    cuerpo = re.sub(r'<(script|style|svg|noscript)[^>]*>.*?</\1>', ' ', cuerpo, flags=re.S | re.I)
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' | ', cuerpo)))


def urls_en(js):
    return sorted(set(re.findall(r'''["'`](https?://[^"'`\s]{6,200}|/[a-zA-Z0-9_\-/]*(?:api|sucursal|branch|backend|\.php)[^"'`\s]{0,150})["'`]''', js)))[:80]


def seccion(t):
    print(f'\n##### {t}')


def main():
    seccion('SWISS chunk completo')
    st, c = bajar('https://www.swissmedical.com.ar/prepagaclientes/assets/sucursales.cadd91c7.chunk.js')
    print(st, c[:26000])
    seccion('SWISS scripts de la página y endpoints con sucursal')
    st, c = bajar('https://www.swissmedical.com.ar/prepagaclientes/sucursales')
    for src in re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', c):
        if not src.startswith('http'):
            src = 'https://www.swissmedical.com.ar' + src
        st2, js = bajar(src)
        hits = sorted(set(re.findall(r'["\'`]([^"\'`\s]{0,120}(?:sucursal|Sucursal)[^"\'`\s]{0,120})["\'`]', js)))[:40]
        print(src, st2, len(js), json.dumps(hits, ensure_ascii=False))

    seccion('OSDE env.json y API')
    st, env = bajar('https://www.osde.com.ar/buscadorsucursales/env.json')
    print(st, env[:3000])
    bases = re.findall(r'https?://[^"\s]+', env)
    for base in ['https://www.osde.com.ar', 'https://api.osde.com.ar'] + bases[:6]:
        st, c = bajar(base.rstrip('/') + '/os-sucursales/v1/sucursales', extra={'Accept': 'application/json', 'Origin': 'https://www.osde.com.ar', 'Referer': 'https://www.osde.com.ar/buscadorsucursales/'})
        print(base, st, len(c), c[:2500])

    seccion('SANCOR bundles')
    st, c = bajar('https://sancorsalud.com.ar/sucursales')
    for src in re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', c)[:12]:
        if not src.startswith('http'):
            src = 'https://sancorsalud.com.ar/' + src.lstrip('/')
        st2, js = bajar(src)
        hits = sorted(set(re.findall(r'["\'`]([^"\'`\s]{0,150}(?:sucursal|api/|/api|backend)[^"\'`\s]{0,150})["\'`]', js, re.I)))[:40]
        print(src, st2, len(js), json.dumps(hits, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    sys.exit(main())
