"""Sucursales oficiales de cada prepaga → lib/data/sucursales.json.

Corre en la GitHub Action (la red de los entornos de desarrollo no llega a
los sitios de las prepagas). Cada prepaga tiene su parser; si uno falla o
trae menos sucursales que el mínimo esperado, se conservan las que ya había
de esa prepaga (nunca se publica una lista rota).

Fuentes (páginas oficiales de cada prepaga):
  OSDE     https://www.osde.com.ar/buscadorsucursales (API del buscador:
           gateway.api-osde.com.ar/os-sucursales/v1/sucursales)
  Swiss    https://www.swissmedical.com.ar/prepagaclientes/sucursales (API
           /v0/getSucursales del buscador; se prueban las rutas posibles)
  Galeno   https://www.galeno.com.ar/sucursales/ (__NEXT_DATA__ del sitio)
  Premedic https://web.grupopremedic.com.ar/sucursales
  Medifé   https://www.medife.com.ar/sucursales

Uso: python scripts/sucursales/bajar.py
"""
import html, json, os, re, ssl, sys, unicodedata, urllib.error, urllib.request
from datetime import date

UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'
SALIDA = os.path.join(os.path.dirname(__file__), '..', '..', 'lib', 'data', 'sucursales.json')
MINIMOS = {'osde': 40, 'swiss-medical': 30, 'galeno': 15, 'premedic': 12, 'medife': 15}
FUENTES = {
    'osde': 'https://www.osde.com.ar/buscadorsucursales',
    'swiss-medical': 'https://www.swissmedical.com.ar/prepagaclientes/sucursales',
    'galeno': 'https://www.galeno.com.ar/sucursales/',
    'premedic': 'https://web.grupopremedic.com.ar/sucursales',
    'medife': 'https://www.medife.com.ar/sucursales',
}


def bajar(url, extra=None):
    h = {'User-Agent': UA, 'Accept-Language': 'es-AR,es;q=0.9'}
    h.update(extra or {})
    req = urllib.request.Request(url, headers=h)
    with urllib.request.urlopen(req, timeout=40, context=ssl.create_default_context()) as r:
        return r.read().decode('utf-8', 'replace')


def limpio(s):
    return re.sub(r'\s+', ' ', html.unescape(s or '')).strip()


def tokens_visibles(cuerpo):
    cuerpo = re.sub(r'<(script|style|svg|noscript)[^>]*>.*?</\1>', ' ', cuerpo, flags=re.S | re.I)
    return [t for t in (limpio(x) for x in re.sub(r'<[^>]+>', '|', cuerpo).split('|')) if t]


def es_telefono(s):
    return bool(re.fullmatch(r'[\d\s()/\-]{7,}', s)) and len(re.sub(r'\D', '', s)) >= 7


def osde():
    datos = json.loads(bajar('https://gateway.api-osde.com.ar/os-sucursales/v1/sucursales', {
        'Accept': 'application/json', 'Origin': 'https://www.osde.com.ar', 'Referer': 'https://www.osde.com.ar/buscadorsucursales/'}))
    out = []
    for s in datos:
        tipo = limpio(str(s.get('tipo') or ''))
        out.append({
            'nombre': f"OSDE {limpio(s.get('nombre')).title()}" + (' (filial)' if tipo == 'FILIAL' else ''),
            'direccion': limpio(s.get('direccion')),
            'localidad': limpio(s.get('Localidad')),
            'region': limpio(s.get('Provincia')),
            'horario': re.sub(r'^Horario de atención:\s*', '', limpio(s.get('horario'))) or None,
            'lat': s.get('latitud'),
            'lon': s.get('longitud'),
        })
    return out


def swiss():
    rutas = ['https://www.swissmedical.com.ar/prepagaclientes/api/v0/getSucursales',
             'https://www.swissmedical.com.ar/prepagaclientes/v0/getSucursales',
             'https://www.swissmedical.com.ar/v0/getSucursales',
             'https://mobile.swissmedical.com.ar/api-smg/v0/getSucursales']
    ultimo = None
    for url in rutas:
        try:
            crudo = bajar(url, {'Accept': 'application/json', 'Referer': FUENTES['swiss-medical']})
            datos = json.loads(crudo)
            if isinstance(datos, str):
                datos = json.loads(datos)
            docs = datos['response']['docs']
        except Exception as e:  # noqa: BLE001
            ultimo = f'{url}: {e!r}'
            continue
        print('Swiss: datos en', url, '— campos:', sorted(docs[0].keys()) if docs else [])
        out = []
        for d in docs:
            campo = lambda *ks: next((limpio(str(d[k])) for k in ks if d.get(k) not in (None, '')), None)  # noqa: E731
            out.append({
                'nombre': f"Swiss Medical {campo('Nombre') or ''}".strip(),
                'direccion': campo('Direccion') or '',
                'localidad': campo('Localidad', 'localidad', 'Ciudad'),
                'region': campo('Provincia', 'provincia'),
                'telefono': campo('Telefono'),
                'horario': campo('Atencion'),
                'lat': float(d['coordenada_1_coordinate']) if d.get('coordenada_1_coordinate') else None,
                'lon': float(d['coordenada_0_coordinate']) if d.get('coordenada_0_coordinate') else None,
            })
        return out
    raise RuntimeError(f'Swiss: ninguna ruta devolvió datos ({ultimo})')


def galeno():
    c = bajar(FUENTES['galeno'])
    m = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', c, re.S)
    datos = json.loads(json.loads(m.group(1))['props']['pageProps']['sucursalCMS'])
    out = []
    for grupo in datos['provincias']:
        for s in grupo['sucursales']:
            out.append({
                'nombre': limpio(s.get('name')),
                'direccion': limpio(s.get('domicilio') or s.get('adress')),
                'localidad': limpio(s.get('localidad')),
                'region': limpio(grupo.get('provincia')),
                'horario': limpio(s.get('horario')) or None,
                'lat': float(s['latitud']) if s.get('latitud') else None,
                'lon': float(s['longitud']) if s.get('longitud') else None,
            })
    return out


def premedic():
    t = tokens_visibles(bajar(FUENTES['premedic']))
    out = []
    for i in range(3, len(t) - 1):
        if t[i] == 'Llamar' and t[i + 1].startswith('Ver en Google'):
            nombre, direccion, tel = t[i - 3], t[i - 2], t[i - 1]
            if not es_telefono(tel.split('/')[0]):
                continue
            out.append({'nombre': nombre, 'direccion': direccion, 'localidad': re.sub(r'\s*\(.*\)$', '', nombre), 'region': None, 'telefono': tel})
    return out


def medife():
    t = tokens_visibles(bajar(FUENTES['medife']))
    out = []
    for i in range(4, len(t) - 1):
        if t[i] != 'Horario':
            continue
        direccion = t[i - 1]
        if es_telefono(t[i - 2]):
            tel, localidad, provincia = t[i - 2], t[i - 3], t[i - 4]
        else:
            tel, localidad, provincia = None, t[i - 2], t[i - 3]
        out.append({'nombre': f'Medifé {localidad}', 'direccion': direccion, 'localidad': re.sub(r'\s+-\s+.*$', '', localidad), 'region': provincia, 'telefono': tel, 'horario': t[i + 1]})
    return out


def main():
    anterior = {}
    if os.path.exists(SALIDA):
        anterior = json.load(open(SALIDA, encoding='utf-8'))
    por_prepaga = {p: [s for s in anterior.get('sucursales', []) if s['prepaga'] == p] for p in FUENTES}
    resumen = []
    for prepaga, fn in [('osde', osde), ('swiss-medical', swiss), ('galeno', galeno), ('premedic', premedic), ('medife', medife)]:
        try:
            lista = fn()
        except Exception as e:  # noqa: BLE001
            resumen.append(f'{prepaga}: ERROR {e!r} — se conservan {len(por_prepaga[prepaga])}')
            continue
        # Sin duplicados (misma dirección)
        vistos, unicos = set(), []
        for s in lista:
            k = unicodedata.normalize('NFD', s['direccion'].lower())
            if k in vistos or not s['direccion']:
                continue
            vistos.add(k)
            unicos.append({'prepaga': prepaga, **{k2: v for k2, v in s.items() if v not in (None, '')}})
        if len(unicos) < MINIMOS[prepaga]:
            resumen.append(f'{prepaga}: solo {len(unicos)} (mínimo {MINIMOS[prepaga]}) — se conservan {len(por_prepaga[prepaga])}')
            continue
        por_prepaga[prepaga] = unicos
        resumen.append(f'{prepaga}: {len(unicos)} sucursales')
        for s in unicos[:4]:
            print('  ', json.dumps(s, ensure_ascii=False))
    todas = [s for p in FUENTES for s in por_prepaga[p]]
    json.dump({'generado': date.today().isoformat(), 'fuentes': FUENTES, 'sucursales': todas}, open(SALIDA, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('\n'.join(resumen))
    return 0


if __name__ == '__main__':
    sys.exit(main())
