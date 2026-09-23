"""
Descarga los cuadros tarifarios oficiales de la Superintendencia de Servicios
de Salud (https://cuadrostarifarios.sssalud.gob.ar, Resolución 645/2025): el
valor por cápita que cada prepaga declara por plan, rango etario y región.

API pública (la misma que usa la web oficial, sin captcha ni login):
  /api/getPrepagas, /api/getPeriodo, /api/getCuadrosTarifarios?periodo=&page=&per_page=

Uso:  python scripts/cuadros-sssalud/scrape.py [--todas] [periodo ...]
      (sin períodos: los dos últimos publicados; sin --todas: solo las
      prepagas del sitio, filtrando por RNEMP — el servidor es lento y con
      más de 50 filas por página devuelve 504, así que bajar todo el mercado
      lleva ~30 min por período)

Salida: data/sssalud/prepagas.json y data/sssalud/cuadros-<periodo>.json
(filas compactas: se sacan los campos repetidos de la prepaga, que quedan en
prepagas.json). Pausa entre páginas para no cargar el servidor.
"""
import json, os, sys, time, urllib.request, urllib.parse

API = 'https://cuadrostarifarios.sssalud.gob.ar/api'
OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'sssalud')
PER_PAGE = 50  # con 100+ el servidor da 504 Gateway Timeout

# RNEMP (registro de la SSSalud) de las prepagas que tiene el sitio.
RNEMP_SITIO = {
    'swiss-medical': 113328, 'osde': 614081, 'avalian': 211947, 'sancor-salud': 311371,
    'premedic': 112172, 'medife': 412258, 'omint': 113366, 'medicus': 111834,
    'galeno': 112851, 'prevencion-salud': 116792, 'hominis': 111438, 'federada-salud': 311586,
    'hospital-italiano': 413145, 'cemic': 412593, 'luis-pasteur': 610133,
}
UA = {'User-Agent': 'Mozilla/5.0 (PrepagaYa; datos publicos SSSalud)'}


def get(path, params=None, intentos=4):
    url = f'{API}/{path}' + ('?' + urllib.parse.urlencode(params) if params else '')
    for i in range(intentos):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
                return json.loads(r.read().decode('utf-8'))
        except Exception as e:
            print(f'  reintento {i + 1} ({e})', file=sys.stderr)
            time.sleep(5 * (i + 1))
    raise RuntimeError(f'No se pudo bajar {url}')


CAMPOS = ['rnemp', 'periodo', 'codigo_plan', 'nombre_plan', 'valor_capital', 'cantidad_capitas',
          'rango_etario_desde', 'rango_etario_hasta', 'region', 'tipo_plan', 'comercializable',
          'permite_copago', 'tasa_aumento_mensual', 'modalidad_adhesion', 'tipificacion']


def bajar_periodo(periodo, rnemp=None):
    filas, page = [], 1
    while True:
        params = {'periodo': periodo, 'page': page, 'per_page': PER_PAGE}
        if rnemp:
            params['rnemp'] = rnemp
        r = get('getCuadrosTarifarios', params)
        datos = r.get('data') or []
        filas += [{k: f.get(k) for k in CAMPOS} for f in datos]
        pag = r.get('paginacion') or {}
        total = pag.get('total', len(filas))
        print(f'  {periodo} {rnemp or "todas"}: página {page} → {len(filas)}/{total}', flush=True)
        if not datos or len(filas) >= total:
            break
        page += 1
        time.sleep(1.5)
    return filas


def main():
    os.makedirs(OUT, exist_ok=True)
    prepagas = get('getPrepagas')['data']
    json.dump(prepagas, open(os.path.join(OUT, 'prepagas.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    todas = '--todas' in sys.argv
    periodos = [int(p) for p in args] or get('getPeriodo')['data'][:2]
    for periodo in periodos:
        if todas:
            filas = bajar_periodo(periodo)
        else:
            filas = []
            for slug, rnemp in RNEMP_SITIO.items():
                filas += bajar_periodo(periodo, rnemp)
        destino = os.path.join(OUT, f'cuadros-{periodo}.json')
        with open(destino, 'w', encoding='utf-8') as f:
            json.dump({'fuente': 'Superintendencia de Servicios de Salud — cuadrostarifarios.sssalud.gob.ar (Res. 645/2025)',
                       'periodo': periodo, 'descargado': time.strftime('%Y-%m-%d'), 'filas': filas},
                      f, ensure_ascii=False, separators=(',', ':'))
        print(f'OK {periodo}: {len(filas)} filas → {destino}')


if __name__ == '__main__':
    main()
