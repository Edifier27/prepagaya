"""Busca datos oficiales de reclamos contra prepagas y obras sociales.

La red de los entornos de desarrollo no llega a datos.gob.ar ni a
datos.salud.gob.ar; esta Action sí (25-sep-2026). No guarda nada en el
repo: imprime en el log los conjuntos de datos que encuentra en los dos
catálogos (CKAN), sus archivos y las columnas de cada CSV, y para los que
nombran empresas cuenta los reclamos por empresa. Con eso se decide si hay
dato oficial para armar un ranking de reclamos por prepaga.
"""
import csv
import io
import json
import re
import urllib.parse
import urllib.request
import zipfile

UA = {'User-Agent': 'Mozilla/5.0 (compatible; prepagaya-fuentes/1.0)', 'Accept-Language': 'es-AR,es'}
CATALOGOS = ['https://datos.salud.gob.ar', 'https://datos.gob.ar']
CONSULTAS = [
    'reclamos',
    'reclamos superintendencia',
    'superintendencia de servicios de salud',
    'medicina prepaga',
    'defensa del consumidor',
    'ventanilla unica federal',
    'coprec',
]
INTERES = re.compile(r'reclam|denunc|consumidor|prepaga|superintendencia|sssalud|coprec', re.I)
PREPAGA = re.compile(r'prepag|medicina privada|osde|swiss|galeno|medif|omint|sancor salud|avalian|premedic|hospital italiano|hospital aleman|hospital alemán|medicus|prevenci[oó]n salud|accord|jer[aá]rquicos|luis pasteur|federada', re.I)
MAX_BYTES = 150_000_000


def bajar(url, max_bytes=None):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read(max_bytes) if max_bytes else r.read()


def buscar_paquetes():
    vistos = {}
    for base in CATALOGOS:
        for q in CONSULTAS:
            url = f'{base}/api/3/action/package_search?' + urllib.parse.urlencode({'q': q, 'rows': 25})
            try:
                res = json.loads(bajar(url))['result']['results']
            except Exception as e:  # noqa: BLE001
                print(f'!! {base} "{q}": {e}')
                continue
            for p in res:
                clave = (base, p['name'])
                if clave in vistos:
                    continue
                texto = ' '.join([p.get('title', ''), p.get('notes', '') or '', (p.get('organization') or {}).get('title', '')])
                if not INTERES.search(texto):
                    continue
                vistos[clave] = p
    return vistos


def columnas_y_conteo(url, fmt):
    crudo = bajar(url, MAX_BYTES)
    if fmt == 'zip' or url.lower().endswith('.zip'):
        z = zipfile.ZipFile(io.BytesIO(crudo))
        nombre = next((n for n in z.namelist() if n.lower().endswith('.csv')), None)
        if not nombre:
            print('    zip sin csv:', z.namelist()[:10])
            return
        crudo = z.read(nombre)
    for cs in ('utf-8-sig', 'latin-1'):
        try:
            texto = crudo.decode(cs)
            break
        except UnicodeDecodeError:
            continue
    muestra = texto[:5000]
    try:
        dialecto = csv.Sniffer().sniff(muestra, delimiters=',;|\t')
    except csv.Error:
        dialecto = csv.excel
    filas = csv.reader(io.StringIO(texto), dialecto)
    cab = next(filas, [])
    print('    columnas:', cab)
    datos = list(filas)
    print('    filas:', len(datos))
    for f in datos[:3]:
        print('    ej:', f)
    # Columnas que parecen nombrar a la empresa / entidad y al rubro
    idx_emp = [i for i, c in enumerate(cab) if re.search(r'empresa|proveedor|denunciad|razon|razón|entidad|agente|prestador|obra.?social|prepaga', c, re.I)]
    idx_rub = [i for i, c in enumerate(cab) if re.search(r'rubro|actividad|sector|tipo', c, re.I)]
    idx_anio = [i for i, c in enumerate(cab) if re.search(r'a[nñ]o|fecha|periodo|período', c, re.I)]
    print('    col empresa:', [cab[i] for i in idx_emp], '| rubro:', [cab[i] for i in idx_rub], '| fecha:', [cab[i] for i in idx_anio])
    if not idx_emp:
        return
    conteo, anios, rubros = {}, {}, {}
    for f in datos:
        fila = ' '.join(f)
        if not PREPAGA.search(fila):
            continue
        emp = ' / '.join(f[i].strip() for i in idx_emp if i < len(f))
        conteo[emp] = conteo.get(emp, 0) + 1
        for i in idx_rub:
            if i < len(f):
                rubros[f[i].strip()] = rubros.get(f[i].strip(), 0) + 1
        for i in idx_anio[:1]:
            if i < len(f):
                a = f[i].strip()[:4]
                anios[a] = anios.get(a, 0) + 1
    print('    filas con prepagas:', sum(conteo.values()))
    print('    por año:', sorted(anios.items())[-10:])
    print('    rubros:', sorted(rubros.items(), key=lambda x: -x[1])[:15])
    for emp, n in sorted(conteo.items(), key=lambda x: -x[1])[:60]:
        print(f'      {n:>7}  {emp}')


def main():
    paquetes = buscar_paquetes()
    print(f'== {len(paquetes)} conjuntos de datos con reclamos / consumidor / prepagas ==')
    for (base, nombre), p in paquetes.items():
        org = (p.get('organization') or {}).get('title', '')
        print(f'\n## {p.get("title")}  [{org}]  {base}/dataset/{nombre}')
        print('   ', re.sub(r'\s+', ' ', (p.get('notes') or ''))[:400])
        for r in p.get('resources', []):
            fmt = (r.get('format') or '').lower()
            print(f'  - {r.get("name")} | {fmt} | {r.get("last_modified") or r.get("created")} | {r.get("url")}')
    # Segunda pasada: columnas y conteos de los CSV (el más nuevo de cada conjunto)
    print('\n\n== Columnas y conteos ==')
    for (base, nombre), p in paquetes.items():
        recursos = [r for r in p.get('resources', []) if (r.get('format') or '').lower() in ('csv', 'zip') or (r.get('url') or '').lower().endswith(('.csv', '.zip'))]
        recursos.sort(key=lambda r: r.get('last_modified') or r.get('created') or '', reverse=True)
        for r in recursos[:2]:
            print(f'\n## {p.get("title")} :: {r.get("name")}  {r.get("url")}')
            try:
                columnas_y_conteo(r['url'], (r.get('format') or '').lower())
            except Exception as e:  # noqa: BLE001
                print('    !!', e)


if __name__ == '__main__':
    main()
