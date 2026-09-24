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
    seccion('SWISS lista_sucursales_atencion.php (completo)')
    st, c = bajar('https://www.swissmedical.com.ar/smgnewsite/commons/backend/sucursales/lista_sucursales_atencion.php')
    print(st, c[:30000])

    seccion('SWISS chunk JS del buscador de sucursales')
    st, c = bajar('https://www.swissmedical.com.ar/prepagaclientes/assets/sucursales.cadd91c7.chunk.js')
    print(st, len(c)); print(json.dumps(urls_en(c), ensure_ascii=False))
    for m in re.finditer(r'.{0,160}(?:sucursal|backend|api)[^"\']{0,40}.{0,160}', c[:400000], re.I):
        print('  …', m.group(0)[:360]); break

    seccion('OSDE JS del buscador')
    st, c = bajar('https://www.osde.com.ar/buscadorsucursales/assets/index-DMwyoByI.js')
    print(st, len(c)); print(json.dumps(urls_en(c), ensure_ascii=False))

    seccion('GALENO __NEXT_DATA__')
    st, c = bajar('https://www.galeno.com.ar/sucursales/')
    m = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', c, re.S)
    if m:
        print(m.group(1)[:12000])
    else:
        print('sin __NEXT_DATA__; texto:', visible(c)[:6000])

    for nombre, url in [('PREMEDIC', 'https://web.grupopremedic.com.ar/sucursales'), ('MEDIFE', 'https://www.medife.com.ar/sucursales'), ('SANCOR', 'https://sancorsalud.com.ar/sucursales')]:
        seccion(f'{nombre} texto visible')
        st, c = bajar(url)
        t = visible(c)
        i = max(0, t.lower().find('sucursal'))
        print(st, len(c)); print(t[i:i + 9000])
        estado = re.search(r'<script id="(?:ng-state|serverApp-state)"[^>]*>(.*?)</script>', c, re.S)
        if estado:
            print('--- estado Angular:', estado.group(1)[:6000])

    seccion('AVALIAN con otros encabezados')
    for url in ['https://www.avalian.com/sucursales', 'https://avalian.com/contacto', 'https://avalian.com/']:
        st, c = bajar(url, extra={'Accept': 'text/html,application/xhtml+xml', 'Referer': 'https://www.google.com/'})
        print(url, st, len(c), visible(c)[:300])
    return 0


if __name__ == '__main__':
    sys.exit(main())
