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
    seccion('SWISS client.js: helper que arma las URL de la API')
    st, js = bajar('https://www.swissmedical.com.ar/prepagaclientes/assets/client.0f2777d1.js')
    for pat in [r'.{0,300}v0/.{0,300}', r'.{0,200}(?:baseURL|apiUrl|API_URL|urlBase|BASE_URL)\s*[:=].{0,200}', r'.{0,150}(?:https://[a-z0-9.-]*swissmedical[a-z0-9./-]*api[^"\']*).{0,150}']:
        for m in list(re.finditer(pat, js))[:6]:
            print('  …', m.group(0)[:600])
    seccion('SANCOR chunks perezosos')
    st, main_js = bajar('https://sancorsalud.com.ar/main-ZF2Y3S74.js')
    chunks = sorted(set(re.findall(r'chunk-[A-Z0-9]+\.js', main_js)))
    print(len(chunks), chunks[:80])
    for ch in chunks[:80]:
        st2, js = bajar('https://sancorsalud.com.ar/' + ch)
        hits = sorted(set(re.findall(r'["\'`]([^"\'`\s]{0,150}(?:sucursal|Sucursal|/api/|api\.|backend)[^"\'`\s]{0,150})["\'`]', js)))[:25]
        if hits:
            print(ch, st2, len(js), json.dumps(hits, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    sys.exit(main())
