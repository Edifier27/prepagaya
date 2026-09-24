"""Exploración de los buscadores oficiales de sucursales de cada prepaga.

Corre en la GitHub Action (la red de los entornos de desarrollo no llega a
los sitios de las prepagas). Imprime, para cada URL candidata, el estado, el
tipo de contenido y un extracto, más los endpoints de datos que aparezcan en
el HTML o en los scripts, para escribir después el parser de cada una.

Uso: python scripts/sucursales/explorar.py
"""
import re, sys, urllib.request, urllib.error, ssl, json

UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'
CANDIDATAS = [
    ('swiss-medical', 'https://www.swissmedical.com.ar/smgnewsite/commons/backend/sucursales/lista_sucursales_atencion.php'),
    ('swiss-medical', 'https://www.swissmedical.com.ar/prepagaclientes/sucursales'),
    ('osde', 'https://www.osde.com.ar/buscadorsucursales'),
    ('osde', 'https://www.osde.com.ar/contacto/buscadorsucursales'),
    ('sancor-salud', 'https://www.sancorsalud.com.ar/sucursales'),
    ('sancor-salud', 'https://sancorsalud.com.ar/sucursales'),
    ('avalian', 'https://avalian.com/sucursales'),
    ('premedic', 'https://web.grupopremedic.com.ar/sucursales'),
    ('galeno', 'https://www.galeno.com.ar/sucursales'),
    ('medife', 'https://www.medife.com.ar/sucursales'),
]
PATRON_ENDPOINT = re.compile(r'''["'](https?://[^"']+?(?:api|sucursal|branch|oficina|centro|json|\.php)[^"']*|/[^"'\s]*(?:api|sucursal|branch|oficina|json)[^"'\s]*)["']''', re.I)
PATRON_SCRIPT = re.compile(r'<script[^>]+src=["\']([^"\']+)["\']', re.I)


def bajar(url, limite=3_000_000):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': '*/*', 'Accept-Language': 'es-AR,es;q=0.9'})
    ctx = ssl.create_default_context()
    try:
        with urllib.request.urlopen(req, timeout=40, context=ctx) as r:
            return r.status, r.headers.get('content-type', ''), r.geturl(), r.read(limite).decode('utf-8', 'replace')
    except urllib.error.HTTPError as e:
        return e.code, e.headers.get('content-type', ''), url, e.read(20000).decode('utf-8', 'replace')
    except Exception as e:  # noqa: BLE001
        return 'ERR', '', url, repr(e)


def main():
    for prepaga, url in CANDIDATAS:
        st, ct, final, cuerpo = bajar(url)
        print(f'\n===== {prepaga} {url}\nestado={st} tipo={ct} final={final} largo={len(cuerpo)}')
        texto = re.sub(r'\s+', ' ', cuerpo)
        print('--- extracto:', texto[:2500])
        endpoints = sorted(set(m.group(1) for m in PATRON_ENDPOINT.finditer(cuerpo)))[:60]
        if endpoints:
            print('--- endpoints:', json.dumps(endpoints, ensure_ascii=False))
        scripts = PATRON_SCRIPT.findall(cuerpo)[:25]
        if scripts:
            print('--- scripts:', json.dumps(scripts, ensure_ascii=False))
        # Direcciones con número y teléfonos: pista de si los datos vienen en el HTML
        dirs = re.findall(r'[A-ZÁÉÍÓÚ][\wÁÉÍÓÚáéíóúñÑ\. ]{3,40}\s\d{2,5}\b', texto)[:15]
        tels = re.findall(r'\(?0\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}|0810[\s-]?\d{3}[\s-]?\d{4}', texto)[:10]
        print('--- direcciones?', dirs)
        print('--- teléfonos?', tels)
    return 0


if __name__ == '__main__':
    sys.exit(main())
